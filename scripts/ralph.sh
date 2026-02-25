#!/bin/bash
# scripts/ralph.sh — Ralph Wiggum autonomous coding loop
# Usage:
#   ./scripts/ralph.sh hitl              # One iteration, watch output
#   ./scripts/ralph.sh afk [N]           # N iterations unattended (default: 10)
#   ./scripts/ralph.sh parallel [N]      # N concurrent workers in worktrees (default: 3)
#   ./scripts/ralph.sh judge             # Opus review of recent commits, creates bug beads
#   ./scripts/ralph.sh orchestrate [N]   # N rounds of: parallel → merge → judge (default: 3)
#   ./scripts/ralph.sh smart [N] [W]     # Opus orchestrator: spawns workers, merges, reviews
#   ./scripts/ralph.sh status            # Dashboard: br stats + ready + progress

set -euo pipefail

# ── Config (override via env vars) ──────────────────────────────────
MODEL=${RALPH_MODEL:-sonnet}
BUDGET=${RALPH_MAX_BUDGET:-10.00}
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

# ── Process tracking ─────────────────────────────────────────────────
CHILD_PID=""
CURRENT_ITER=0
WORKER_PIDS=()

# ── Resolve project root (where this script lives) ─────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

PROMPT_FILE="$SCRIPT_DIR/ralph-prompt.md"
BEADS_DIR="$PROJECT_ROOT/.beads"
WORKTREE_DIR="$PROJECT_ROOT/.claude/worktrees"

# ── Helpers ─────────────────────────────────────────────────────────
timestamp() { date '+%Y-%m-%d %H:%M:%S'; }

log() { echo -e "${DIM}[$(timestamp)]${RESET} $1"; }
log_ok() { echo -e "${DIM}[$(timestamp)]${RESET} ${GREEN}$1${RESET}"; }
log_warn() { echo -e "${DIM}[$(timestamp)]${RESET} ${YELLOW}$1${RESET}"; }
log_err() { echo -e "${DIM}[$(timestamp)]${RESET} ${RED}$1${RESET}"; }
log_head() { echo -e "\n${BOLD}${CYAN}=== $1 ===${RESET} ${DIM}$(timestamp)${RESET}"; }

# Trap Ctrl+C — kill child processes and show feedback
# Verify child is dead after interrupt: ps aux | grep "claude -p"
cleanup() {
  echo ""
  log_warn "Interrupted. Shutting down..."

  # Kill single-agent child (hitl/afk modes)
  if [[ -n "$CHILD_PID" ]] && kill -0 "$CHILD_PID" 2>/dev/null; then
    kill "$CHILD_PID" 2>/dev/null
    wait "$CHILD_PID" 2>/dev/null || true
    log_warn "Killed agent process (PID $CHILD_PID)"
  fi

  # Kill parallel worker children (safe even if empty)
  if [[ ${#WORKER_PIDS[@]} -gt 0 ]]; then
    for pid in "${WORKER_PIDS[@]}"; do
      if kill -0 "$pid" 2>/dev/null; then
        kill "$pid" 2>/dev/null
        wait "$pid" 2>/dev/null || true
      fi
    done
    log_warn "Killed ${#WORKER_PIDS[@]} worker processes"

    # Merge whatever the workers committed before dying
    log_warn "Salvaging worktree commits before exit..."
    merge_worktrees "${#WORKER_PIDS[@]}" || true
  fi

  log_warn "Exited after iteration $CURRENT_ITER. Logs: /tmp/ralph-iter-*.log"
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

# ── Worktree management ───────────────────────────────────────────
# Clean up stale worktrees and prepare fresh ones for parallel mode.
# Each worktree gets a symlinked .beads so all workers share one DB.
cleanup_worktrees() {
  local count=${1:-3}
  log "Cleaning up stale worktrees..."

  for ((w=1; w<=count; w++)); do
    local wt_name="ralph-w$w"
    local wt_path="$WORKTREE_DIR/$wt_name"
    local wt_branch="worktree-$wt_name"

    # Remove existing worktree if present
    if [[ -d "$wt_path" ]]; then
      git worktree remove --force "$wt_path" 2>/dev/null || true
    fi

    # Delete stale branch
    if git show-ref --verify --quiet "refs/heads/$wt_branch" 2>/dev/null; then
      git branch -D "$wt_branch" 2>/dev/null || true
    fi
  done

  log_ok "Worktrees cleaned"
}

setup_worktree_beads() {
  # After claude creates the worktree, symlink .beads to share the main DB.
  # Called after workers are spawned with a small delay.
  local count=${1:-3}

  for ((w=1; w<=count; w++)); do
    local wt_path="$WORKTREE_DIR/ralph-w$w"
    local max_wait=30
    local waited=0

    # Wait for worktree to be created by claude
    while [[ ! -d "$wt_path" && $waited -lt $max_wait ]]; do
      sleep 1
      waited=$((waited + 1))
    done

    if [[ -d "$wt_path" ]]; then
      # Remove the worktree's own .beads (stale copy) and symlink to main
      if [[ -d "$wt_path/.beads" && ! -L "$wt_path/.beads" ]]; then
        rm -rf "$wt_path/.beads"
        ln -s "$BEADS_DIR" "$wt_path/.beads"
        log "Linked .beads for worker $w"
      elif [[ ! -e "$wt_path/.beads" ]]; then
        ln -s "$BEADS_DIR" "$wt_path/.beads"
        log "Linked .beads for worker $w"
      fi
    else
      log_warn "Worktree ralph-w$w not created after ${max_wait}s"
    fi
  done
}

# ── Merge conflict auto-resolution ──────────────────────────────────
# Handles predictable conflicts so cherry-picks don't get skipped.

# Resolve barrel export conflicts: strip markers, keep all exports, sort + dedup.
merge_barrel_exports() {
  local file="$1"
  local tmp="${file}.resolved"

  # Extract header comment lines (before first export)
  local header=""
  header=$(sed -n '/^export /q;p' "$file")

  # Extract all export lines from both sides, stripping conflict markers
  local exports
  exports=$(grep -E '^export ' "$file" | sort -u)

  # Reconstruct the file
  {
    [[ -n "$header" ]] && echo "$header"
    echo "$exports"
  } > "$tmp"

  mv "$tmp" "$file"
}

# Check if all conflicting files are auto-resolvable and resolve them.
# Returns 0 if all conflicts resolved, 1 if any unknown conflict remains.
auto_resolve_conflicts() {
  local conflicting
  conflicting=$(git diff --name-only --diff-filter=U)

  if [[ -z "$conflicting" ]]; then
    return 0  # No conflicts
  fi

  while IFS= read -r file; do
    case "$file" in
      *routeTree.gen.ts)
        git checkout --ours "$file"
        log "  Auto-resolved (ours → regenerate): $file"
        ;;
      */index.ts)
        if grep -q '<<<<<<<' "$file" 2>/dev/null; then
          merge_barrel_exports "$file"
          log "  Auto-resolved (barrel merge): $file"
        else
          git checkout --ours "$file"
          log "  Auto-resolved (ours): $file"
        fi
        ;;
      package.json)
        git checkout --theirs "$file"
        log "  Auto-resolved (theirs → reinstall): $file"
        ;;
      bun.lock|bun.lockb)
        git checkout --ours "$file"
        log "  Auto-resolved (ours → regenerate): $file"
        ;;
      *)
        log_warn "  Unknown conflict — cannot auto-resolve: $file"
        return 1
        ;;
    esac
  done <<< "$conflicting"

  return 0
}

# Post-merge fixup: regenerate generated files, reinstall deps, validate.
post_merge_fixup() {
  local needs_commit=false

  # Check if routeTree was touched in recent merges
  if git diff HEAD~5 --name-only 2>/dev/null | grep -q 'routeTree.gen.ts'; then
    log "Regenerating routeTree..."
    if bun run build 2>/dev/null; then
      log_ok "routeTree regenerated"
      needs_commit=true
    else
      log_warn "routeTree regeneration failed — may need manual fix"
    fi
  fi

  # Check if package.json was touched
  if git diff HEAD~5 --name-only 2>/dev/null | grep -q 'package.json'; then
    log "Running bun install to fix lockfile..."
    if bun install 2>/dev/null; then
      log_ok "Dependencies installed"
      needs_commit=true
    else
      log_warn "bun install failed — may need manual fix"
    fi
  fi

  # Commit regenerated files if anything changed
  if [[ "$needs_commit" == true ]]; then
    if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
      git add -A
      git commit -m "fix: post-merge regeneration (routeTree, deps)" --no-verify 2>/dev/null || true
      log_ok "Committed post-merge regeneration"
    fi
  fi

  # Final validation
  log "Running post-merge validation..."
  if bun typecheck 2>/dev/null; then
    log_ok "Typecheck passed"
  else
    log_warn "Typecheck failed after merge — manual review needed"
  fi
  if bun lint 2>/dev/null; then
    log_ok "Lint passed"
  else
    log_warn "Lint failed after merge — manual review needed"
  fi
}

# ── Merge worktree branches to main ─────────────────────────────────
# Cherry-picks unique commits from each worktree branch onto main.
# Called after parallel workers finish, before worktree cleanup.
merge_worktrees() {
  local count=${1:-3}
  log_head "Merging Worktree Branches"

  # Must be on main to cherry-pick
  local current_branch
  current_branch=$(git branch --show-current)
  if [[ "$current_branch" != "main" ]]; then
    log_warn "Not on main (on $current_branch) — skipping merge"
    return 1
  fi

  local merged=0 failed=0 skipped=0
  for ((w=1; w<=count; w++)); do
    local wt_branch="worktree-ralph-w$w"
    if ! git show-ref --verify --quiet "refs/heads/$wt_branch" 2>/dev/null; then
      continue
    fi

    # Check if branch has commits ahead of main
    local ahead
    ahead=$(git rev-list --count main.."$wt_branch" 2>/dev/null || echo "0")
    if [[ "$ahead" == "0" ]]; then
      skipped=$((skipped + 1))
      continue
    fi

    log "Merging $wt_branch ($ahead commits ahead)..."

    # Cherry-pick each commit individually onto main
    local commits
    commits=$(git rev-list --reverse main.."$wt_branch")
    for sha in $commits; do
      local msg
      msg=$(git log --format='%h %s' -1 "$sha")

      # Skip if an identical patch is already on main (dedup)
      if git log --format='%s' main | grep -qF "$(git log --format='%s' -1 "$sha")"; then
        log "  Skip (duplicate): $msg"
        skipped=$((skipped + 1))
        continue
      fi

      if git cherry-pick "$sha" --no-edit 2>/dev/null; then
        log_ok "  Merged: $msg"
        merged=$((merged + 1))
      else
        # Try auto-resolving known conflict types before giving up
        if auto_resolve_conflicts; then
          git add -A
          if GIT_EDITOR=true git cherry-pick --continue 2>/dev/null; then
            log_ok "  Merged (auto-resolved): $msg"
            merged=$((merged + 1))
          else
            git cherry-pick --abort 2>/dev/null || true
            log_warn "  Conflict — auto-resolve failed continue: $msg"
            failed=$((failed + 1))
          fi
        else
          git cherry-pick --abort 2>/dev/null || true
          log_warn "  Conflict — skipped (unknown files): $msg"
          failed=$((failed + 1))
        fi
      fi
    done
  done

  echo ""
  log_ok "Merge complete: $merged merged | $skipped skipped | $failed conflicts"

  # Post-merge fixup: regenerate routeTree, bun install, typecheck, lint
  if [[ $merged -gt 0 ]]; then
    post_merge_fixup
  fi
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

  # Run claude in background so trap fires immediately on Ctrl+C
  local logfile="/tmp/ralph-iter-${iter}.log"
  CURRENT_ITER=$iter
  log "Running agent... (log: $logfile)"

  env -u CLAUDECODE -u CLAUDE_CODE_ENTRYPOINT \
    claude -p \
    --model "$MODEL" \
    --max-budget-usd "$BUDGET" \
    --allowedTools "$TOOLS" \
    --dangerously-skip-permissions \
    "$prompt" > "$logfile" 2>&1 &
  CHILD_PID=$!
  wait "$CHILD_PID" || true
  CHILD_PID=""

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

  # Clean up stale worktrees from previous runs
  cleanup_worktrees "$actual"

  echo ""

  local prompt
  prompt=$(read_prompt)

  WORKER_PIDS=()
  local start_time=$SECONDS

  # Clear old log files
  for ((w=1; w<=actual; w++)); do
    > "/tmp/ralph-worker-$w.log"
  done

  for ((w=1; w<=actual; w++)); do
    log "Spawning worker $w..."
    env -u CLAUDECODE -u CLAUDE_CODE_ENTRYPOINT claude -p \
      --worktree "ralph-w$w" \
      --model "$MODEL" \
      --max-budget-usd "$BUDGET" \
      --allowedTools "$TOOLS" \
      --dangerously-skip-permissions \
      "$prompt" > "/tmp/ralph-worker-$w.log" 2>&1 &
    WORKER_PIDS+=($!)
  done

  log "All $actual workers spawned. Monitoring progress..."

  # Symlink .beads in worktrees to shared DB (runs in background)
  setup_worktree_beads "$actual" &
  local beads_setup_pid=$!

  echo ""

  # Monitor progress while workers run
  local poll_interval=${RALPH_POLL:-15}
  local prev_closed=0
  prev_closed=$(br list -s closed --json 2>/dev/null | jq length 2>/dev/null || echo "0")

  while true; do
    # Check if any workers are still alive
    local alive=0
    for pid in "${WORKER_PIDS[@]}"; do
      if kill -0 "$pid" 2>/dev/null; then
        alive=$((alive + 1))
      fi
    done
    [[ $alive -eq 0 ]] && break

    sleep "$poll_interval"

    # Poll beads stats
    local now_closed now_open now_ready
    now_closed=$(br list -s closed --json 2>/dev/null | jq length 2>/dev/null || echo "?")
    now_open=$(br list -s open --json 2>/dev/null | jq length 2>/dev/null || echo "?")
    now_ready=$(br ready --json 2>/dev/null | jq length 2>/dev/null || echo "?")

    local delta=""
    if [[ "$now_closed" != "?" && "$prev_closed" != "?" ]]; then
      local diff=$((now_closed - prev_closed))
      [[ $diff -gt 0 ]] && delta=" ${GREEN}(+$diff since last check)${RESET}"
      prev_closed=$now_closed
    fi

    # Worker log sizes as activity indicator
    local log_sizes=""
    for ((w=1; w<=actual; w++)); do
      local sz
      sz=$(wc -c < "/tmp/ralph-worker-$w.log" 2>/dev/null || echo "0")
      local alive_mark="●"
      kill -0 "${WORKER_PIDS[$((w-1))]}" 2>/dev/null || alive_mark="○"
      log_sizes+=" W$w:${alive_mark}$(( sz / 1024 ))K"
    done

    log "⏱  ${BOLD}Closed: $now_closed${RESET} | Open: $now_open | Ready: $now_ready | Workers alive: $alive$delta"
    log "   Logs:$log_sizes"
  done

  # Clean up beads setup background process
  wait "$beads_setup_pid" 2>/dev/null || true

  echo ""
  log "All workers finished. Collecting results..."
  echo ""

  # Collect exit codes
  local failed=0
  for ((w=1; w<=actual; w++)); do
    local sz
    sz=$(wc -c < "/tmp/ralph-worker-$w.log" 2>/dev/null || echo "0")
    if wait "${WORKER_PIDS[$((w-1))]}" 2>/dev/null; then
      log_ok "Worker $w finished (${sz} bytes output)"
    else
      log_err "Worker $w failed (exit code: $?, ${sz} bytes output)"
      failed=$((failed + 1))
    fi
    # Show tail of worker log
    echo -e "${DIM}--- Worker $w output (last 10 lines) ---${RESET}"
    tail -10 "/tmp/ralph-worker-$w.log" 2>/dev/null || true
    echo ""
  done

  # Merge worktree branches to main before cleanup
  merge_worktrees "$actual"

  local elapsed=$(( SECONDS - start_time ))
  echo ""
  log_head "Parallel Summary"
  log "Workers: $actual | Failed: $failed | Elapsed: $(( elapsed / 60 ))m $(( elapsed % 60 ))s"
  log "Worker logs: /tmp/ralph-worker-*.log"
  echo ""
  br stats 2>/dev/null || true

  # Clean up worktrees now that work is merged
  cleanup_worktrees "$actual"
}

# ── Judge: opus review of recent work ────────────────────────────────
judge_run() {
  check_deps
  log_head "Ralph Judge Mode (Opus Review)"

  local judge_prompt_file="$SCRIPT_DIR/ralph-judge-prompt.md"
  if [[ ! -f "$judge_prompt_file" ]]; then
    log_err "Missing judge prompt: $judge_prompt_file"
    exit 1
  fi

  local judge_prompt
  judge_prompt=$(cat "$judge_prompt_file")

  local logfile="/tmp/ralph-judge.log"
  log "Running opus judge... (log: $logfile)"

  env -u CLAUDECODE -u CLAUDE_CODE_ENTRYPOINT \
    claude -p \
    --model opus \
    --max-budget-usd "${RALPH_JUDGE_BUDGET:-5.00}" \
    --allowedTools "$TOOLS" \
    --dangerously-skip-permissions \
    "$judge_prompt" > "$logfile" 2>&1 &
  CHILD_PID=$!
  wait "$CHILD_PID" || true
  CHILD_PID=""

  cat "$logfile"

  # Count any new beads created
  local new_bugs
  new_bugs=$(grep -c 'br create' "$logfile" 2>/dev/null || echo "0")
  log_ok "Judge complete. Bug beads created: $new_bugs"
}

# ── Smart: opus orchestrator manages everything ─────────────────────
# Single opus claude that spawns workers, merges intelligently, reviews.
# More expensive but smarter — resolves conflicts, groups tasks, adapts.
smart_run() {
  local rounds=${1:-3}
  local workers=${2:-3}
  check_deps

  local orch_prompt_file="$SCRIPT_DIR/ralph-orchestrator-prompt.md"
  if [[ ! -f "$orch_prompt_file" ]]; then
    log_err "Missing orchestrator prompt: $orch_prompt_file"
    exit 1
  fi

  log_head "Ralph Smart Mode (Opus Orchestrator)"
  log "Rounds: $rounds | Workers/round: $workers"
  log "The orchestrator will manage workers, merge, and review autonomously."
  echo ""

  local orch_prompt
  orch_prompt=$(cat "$orch_prompt_file")
  # Inject round/worker config into the prompt
  orch_prompt="$orch_prompt

## Session Config
- Rounds: $rounds
- Workers per round: $workers
- Worker model: $MODEL
- Worker budget: \$$BUDGET each
"

  local logfile="/tmp/ralph-smart.log"
  local start_time=$SECONDS

  env -u CLAUDECODE -u CLAUDE_CODE_ENTRYPOINT \
    claude -p \
    --model opus \
    --max-budget-usd "${RALPH_SMART_BUDGET:-20.00}" \
    --allowedTools "$TOOLS" \
    --dangerously-skip-permissions \
    "$orch_prompt" > "$logfile" 2>&1 &
  CHILD_PID=$!

  log "Opus orchestrator running... (log: $logfile)"
  log "Tail live: tail -f $logfile"
  echo ""

  wait "$CHILD_PID" || true
  CHILD_PID=""

  cat "$logfile"

  local elapsed=$(( SECONDS - start_time ))
  echo ""
  log_head "Smart Mode Summary"
  log "Elapsed: $(( elapsed / 60 ))m $(( elapsed % 60 ))s"
  log "Log: $logfile"
  br stats 2>/dev/null || true
}

# ── Orchestrate: full loop (parallel → merge → judge) ───────────────
orchestrate_run() {
  local rounds=${1:-3}
  local workers=${2:-3}
  check_deps

  log_head "Ralph Orchestrate Mode"
  log "Rounds: $rounds | Workers/round: $workers | Model: $MODEL"
  echo ""

  local start_time=$SECONDS
  local completed=0

  for ((r=1; r<=rounds; r++)); do
    log_head "Orchestrate Round $r/$rounds"

    # Check if there's work to do
    local ready_count
    ready_count=$(br ready --json 2>/dev/null | jq length 2>/dev/null || echo "0")
    if [[ "$ready_count" == "0" ]]; then
      log_ok "No ready tasks. All work complete!"
      break
    fi
    log "Ready tasks: $ready_count"

    # Phase 1: Parallel workers
    log "Phase 1: Running $workers parallel workers..."
    parallel_run "$workers"

    # Phase 2: Judge review
    log "Phase 2: Opus judge review..."
    judge_run

    completed=$r

    if [[ $r -lt $rounds ]]; then
      log "Cooling down ${COOLDOWN}s before next round..."
      sleep "$COOLDOWN"
    fi
  done

  local elapsed=$(( SECONDS - start_time ))
  echo ""
  log_head "Orchestrate Summary"
  log "Rounds: $completed/$rounds | Elapsed: $(( elapsed / 60 ))m $(( elapsed % 60 ))s"
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
  echo "  judge             Opus review of recent commits, creates bug beads"
  echo "  orchestrate [N]   N rounds of parallel→merge→judge (default: 3)"
  echo "  smart [N] [W]     Opus orchestrator: N rounds, W workers (default: 3/3)"
  echo "  status            Show project dashboard"
  echo ""
  echo "Environment:"
  echo "  RALPH_MODEL         Claude model (default: opus)"
  echo "  RALPH_MAX_BUDGET    Max USD per worker (default: 10.00)"
  echo "  RALPH_COOLDOWN      Seconds between iterations (default: 5)"
  echo "  RALPH_ALLOWED_TOOLS Tool whitelist (default: Bash Edit Read Write Glob Grep)"
  echo "  RALPH_JUDGE_BUDGET  Max USD for judge review (default: 5.00)"
  echo "  RALPH_SMART_BUDGET  Max USD for smart orchestrator (default: 20.00)"
  echo "  RALPH_POLL          Progress poll interval in secs (default: 15)"
  echo ""
  echo "Examples:"
  echo "  ./scripts/ralph.sh hitl"
  echo "  ./scripts/ralph.sh afk 20"
  echo "  RALPH_MODEL=opus ./scripts/ralph.sh afk 5"
  echo "  ./scripts/ralph.sh parallel 5"
  echo "  ./scripts/ralph.sh judge"
  echo "  ./scripts/ralph.sh orchestrate 3"
  echo "  ./scripts/ralph.sh smart 3 5        # 3 rounds, 5 workers each"
}

# ── Main ───────────────────────────────────────────────────────────
case "${1:-}" in
  hitl)        hitl_run ;;
  afk)         afk_run "${2:-10}" ;;
  parallel)    parallel_run "${2:-3}" ;;
  judge)       judge_run ;;
  orchestrate) orchestrate_run "${2:-3}" "${3:-3}" ;;
  smart)       smart_run "${2:-3}" "${3:-3}" ;;
  status)      status_run ;;
  -h|--help|help) usage ;;
  *)           usage; exit 1 ;;
esac
