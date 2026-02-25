#!/bin/bash
# scripts/ralph.sh — Ralph Wiggum autonomous coding loop
# Usage:
#   ./scripts/ralph.sh hitl              # One iteration, watch output
#   ./scripts/ralph.sh afk [N]           # N iterations unattended (default: 10)
#   ./scripts/ralph.sh parallel [N]      # N concurrent workers in worktrees (default: 3)
#   ./scripts/ralph.sh status            # Dashboard: br stats + ready + progress

set -euo pipefail

# ── Config (override via env vars) ──────────────────────────────────
MODEL=${RALPH_MODEL:-sonnet}
BUDGET=${RALPH_MAX_BUDGET:-1.00}
COOLDOWN=${RALPH_COOLDOWN:-5}
TOOLS=${RALPH_ALLOWED_TOOLS:-"Bash Edit Read Write Glob Grep"}

# ── Colors ──────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

# ── Resolve project root (where this script lives) ─────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

PROMPT_FILE="$SCRIPT_DIR/ralph-prompt.md"

# ── Helpers ─────────────────────────────────────────────────────────
timestamp() { date '+%Y-%m-%d %H:%M:%S'; }

log() { echo -e "${DIM}[$(timestamp)]${RESET} $1"; }
log_ok() { echo -e "${DIM}[$(timestamp)]${RESET} ${GREEN}$1${RESET}"; }
log_warn() { echo -e "${DIM}[$(timestamp)]${RESET} ${YELLOW}$1${RESET}"; }
log_err() { echo -e "${DIM}[$(timestamp)]${RESET} ${RED}$1${RESET}"; }
log_head() { echo -e "\n${BOLD}${CYAN}=== $1 ===${RESET} ${DIM}$(timestamp)${RESET}"; }

# Trap Ctrl+C
cleanup() {
  echo ""
  log_warn "Interrupted. Exiting gracefully..."
  exit 130
}
trap cleanup SIGINT SIGTERM

# ── Validate dependencies ──────────────────────────────────────────
check_deps() {
  local missing=0
  for cmd in claude br jq; do
    if ! command -v "$cmd" &>/dev/null; then
      log_err "Missing: $cmd"
      missing=1
    fi
  done
  if [[ ! -f "$PROMPT_FILE" ]]; then
    log_err "Missing prompt file: $PROMPT_FILE"
    missing=1
  fi
  if [[ $missing -eq 1 ]]; then
    exit 1
  fi
}

# ── Read prompt ────────────────────────────────────────────────────
read_prompt() {
  cat "$PROMPT_FILE"
}

# ── Core: run one iteration ────────────────────────────────────────
run_iteration() {
  local iter=$1
  local total=$2
  local prompt
  prompt=$(read_prompt)

  log_head "Iteration $iter/$total"

  # Show what's ready
  local ready_count
  ready_count=$(br ready --json 2>/dev/null | jq length 2>/dev/null || echo "0")
  log "Ready tasks: $ready_count"

  if [[ "$ready_count" == "0" ]]; then
    log_ok "No ready tasks. All work complete!"
    return 1  # Signal completion
  fi

  # Run claude (clear Claude env vars to allow spawning from within Claude Code)
  local logfile="/tmp/ralph-iter-${iter}.log"
  log "Running agent... (log: $logfile)"

  env -u CLAUDECODE -u CLAUDE_CODE_ENTRYPOINT \
    claude -p \
    --model "$MODEL" \
    --max-budget-usd "$BUDGET" \
    --allowedTools "$TOOLS" \
    --dangerously-skip-permissions \
    "$prompt" > "$logfile" 2>&1 || true

  # Display output
  cat "$logfile"

  # Check for completion signal
  if grep -q '<promise>COMPLETE</promise>' "$logfile" 2>/dev/null; then
    log_ok "Agent signaled COMPLETE."
    return 1  # Signal completion
  fi

  return 0
}

# ── HITL: single iteration ─────────────────────────────────────────
hitl_run() {
  check_deps
  log_head "Ralph HITL Mode"
  log "Model: $MODEL | Budget: \$$BUDGET"
  echo ""

  run_iteration 1 1 || true

  echo ""
  log "HITL complete. Review output above."
}

# ── AFK: loop N iterations ─────────────────────────────────────────
afk_run() {
  local iterations=${1:-10}
  check_deps

  log_head "Ralph AFK Mode"
  log "Iterations: $iterations | Model: $MODEL | Budget: \$$BUDGET/iter | Cooldown: ${COOLDOWN}s"
  echo ""

  local start_time=$SECONDS
  local completed=0

  for ((i=1; i<=iterations; i++)); do
    if ! run_iteration "$i" "$iterations"; then
      completed=$i
      break
    fi
    completed=$i

    if [[ $i -lt $iterations ]]; then
      log "Cooling down ${COOLDOWN}s..."
      sleep "$COOLDOWN"
    fi
  done

  local elapsed=$(( SECONDS - start_time ))
  echo ""
  log_head "AFK Summary"
  log "Iterations: $completed/$iterations"
  log "Elapsed: $(( elapsed / 60 ))m $(( elapsed % 60 ))s"
  br stats 2>/dev/null || true
}

# ── Parallel: N concurrent workers ─────────────────────────────────
parallel_run() {
  local workers=${1:-3}
  check_deps

  log_head "Ralph Parallel Mode"
  log "Workers: $workers | Model: $MODEL | Budget: \$$BUDGET/worker"

  # Check how many tasks are actually ready
  local ready_count
  ready_count=$(br ready --json 2>/dev/null | jq length 2>/dev/null || echo "0")

  if [[ "$ready_count" == "0" ]]; then
    log_warn "No ready tasks. Nothing to parallelize."
    exit 0
  fi

  local actual=$(( ready_count < workers ? ready_count : workers ))
  log "Ready tasks: $ready_count | Spawning: $actual workers"
  echo ""

  local prompt
  prompt=$(read_prompt)

  local pids=()
  local start_time=$SECONDS

  for ((w=1; w<=actual; w++)); do
    log "Spawning worker $w..."
    env -u CLAUDECODE -u CLAUDE_CODE_ENTRYPOINT claude -p \
      --worktree "ralph-w$w" \
      --model "$MODEL" \
      --max-budget-usd "$BUDGET" \
      --allowedTools "$TOOLS" \
      --dangerously-skip-permissions \
      "$prompt" > "/tmp/ralph-worker-$w.log" 2>&1 &
    pids+=($!)
  done

  log "All $actual workers spawned. Waiting..."
  echo ""

  # Wait for all workers and report
  local failed=0
  for ((w=1; w<=actual; w++)); do
    if wait "${pids[$((w-1))]}"; then
      log_ok "Worker $w finished successfully"
    else
      log_err "Worker $w failed (exit code: $?)"
      failed=$((failed + 1))
    fi
    # Show tail of worker log
    echo -e "${DIM}--- Worker $w output (last 5 lines) ---${RESET}"
    tail -5 "/tmp/ralph-worker-$w.log" 2>/dev/null || true
    echo ""
  done

  local elapsed=$(( SECONDS - start_time ))
  echo ""
  log_head "Parallel Summary"
  log "Workers: $actual | Failed: $failed | Elapsed: $(( elapsed / 60 ))m $(( elapsed % 60 ))s"
  log "Worker logs: /tmp/ralph-worker-*.log"
  echo ""
  br stats 2>/dev/null || true
}

# ── Status: dashboard ──────────────────────────────────────────────
status_run() {
  log_head "Ralph Status Dashboard"
  echo ""

  echo -e "${BOLD}Project Stats${RESET}"
  br stats 2>/dev/null || log_warn "br stats failed"
  echo ""

  echo -e "${BOLD}Ready Tasks${RESET}"
  br ready 2>/dev/null || log_warn "No ready tasks"
  echo ""

  echo -e "${BOLD}Recent Progress${RESET}"
  tail -30 progress.txt 2>/dev/null || echo "(no progress yet)"
}

# ── Usage ──────────────────────────────────────────────────────────
usage() {
  echo -e "${BOLD}Ralph Wiggum${RESET} — autonomous AI coding loop"
  echo ""
  echo "Usage: $0 <command> [args]"
  echo ""
  echo "Commands:"
  echo "  hitl              Run one iteration (human-in-the-loop)"
  echo "  afk [N]           Run N iterations unattended (default: 10)"
  echo "  parallel [N]      Spawn N concurrent workers (default: 3)"
  echo "  status            Show project dashboard"
  echo ""
  echo "Environment:"
  echo "  RALPH_MODEL         Claude model (default: sonnet)"
  echo "  RALPH_MAX_BUDGET    Max USD per iteration (default: 1.00)"
  echo "  RALPH_COOLDOWN      Seconds between iterations (default: 5)"
  echo "  RALPH_ALLOWED_TOOLS Tool whitelist (default: Bash Edit Read Write Glob Grep)"
  echo ""
  echo "Examples:"
  echo "  ./scripts/ralph.sh hitl"
  echo "  ./scripts/ralph.sh afk 20"
  echo "  RALPH_MODEL=opus ./scripts/ralph.sh afk 5"
  echo "  ./scripts/ralph.sh parallel 3"
}

# ── Main ───────────────────────────────────────────────────────────
case "${1:-}" in
  hitl)     hitl_run ;;
  afk)      afk_run "${2:-10}" ;;
  parallel) parallel_run "${2:-3}" ;;
  status)   status_run ;;
  -h|--help|help) usage ;;
  *)        usage; exit 1 ;;
esac
