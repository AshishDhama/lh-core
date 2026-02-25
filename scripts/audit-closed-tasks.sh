#!/bin/bash
# scripts/audit-closed-tasks.sh — Audit phantom-closed tasks
# Checks which closed beads actually have code on main.
# Reopens tasks that were closed but never merged.
#
# Usage: ./scripts/audit-closed-tasks.sh [--dry-run]

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${BOLD}Phantom Task Audit${RESET}"
echo -e "${DIM}Checking closed beads against git history on main...${RESET}"
echo ""

# Get all closed tasks
closed_tasks=$(br list -s closed --json 2>/dev/null)
total=$(echo "$closed_tasks" | jq length)

echo "Closed tasks: $total"
echo ""

phantom=0
verified=0
unknown=0

echo "$closed_tasks" | jq -c '.[]' | while read -r task; do
  id=$(echo "$task" | jq -r '.id')
  title=$(echo "$task" | jq -r '.title')
  reason=$(echo "$task" | jq -r '.close_reason // ""')

  # Try to match task to a commit on main
  # Strategy: search commit messages for the bead ID or key words from the title
  found=false

  # 1. Search by bead ID in commit message
  if git log --oneline main | grep -qi "$id" 2>/dev/null; then
    found=true
  fi

  # 2. Search by close reason (often the commit message)
  if [[ "$found" == "false" && -n "$reason" ]]; then
    # Extract key phrase from reason (first meaningful words)
    key_phrase=$(echo "$reason" | sed 's/^feat: //;s/^fix: //;s/^chore: //' | head -c 40)
    if [[ -n "$key_phrase" ]] && git log --oneline main | grep -qiF "$key_phrase" 2>/dev/null; then
      found=true
    fi
  fi

  # 3. Search by title keywords
  if [[ "$found" == "false" ]]; then
    # Extract component/feature name from title
    component=$(echo "$title" | grep -oP '(?:add |create |implement |build )(\w+)' | awk '{print $2}' || true)
    if [[ -n "$component" ]]; then
      # Check if the component file exists on main
      if find src -name "${component}*" -type f 2>/dev/null | grep -q .; then
        found=true
      fi
    fi
  fi

  if [[ "$found" == "true" ]]; then
    echo -e "${GREEN}  ✓${RESET} $id — $title"
    verified=$((verified + 1))
  else
    echo -e "${RED}  ✗${RESET} $id — $title ${DIM}(no matching code on main)${RESET}"
    phantom=$((phantom + 1))

    if [[ "$DRY_RUN" == "false" ]]; then
      br reopen "$id" --reason "Audit: no matching code found on main" 2>/dev/null || true
    fi
  fi
done

echo ""
echo -e "${BOLD}Audit Results${RESET}"
echo -e "  Verified (code on main): ${GREEN}$verified${RESET}"
echo -e "  Phantom (no code):       ${RED}$phantom${RESET}"
if [[ "$DRY_RUN" == "true" ]]; then
  echo -e "  ${YELLOW}DRY RUN — no tasks were reopened${RESET}"
  echo "  Run without --dry-run to reopen phantom tasks"
else
  echo -e "  Reopened: $phantom tasks"
fi
