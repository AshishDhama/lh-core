#!/bin/bash
# scripts/recover-worktree-commits.sh — One-time recovery of dangling worktree commits
# Run from project root: ./scripts/recover-worktree-commits.sh
#
# These commits were left orphaned when worktrees were destroyed before merging.
# Each SHA below is the "best" (latest/most complete) version from duplicate groups.

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BOLD='\033[1m'
RESET='\033[0m'

log()      { echo -e "${BOLD}>>>${RESET} $1"; }
log_ok()   { echo -e "${GREEN}✓${RESET} $1"; }
log_warn() { echo -e "${YELLOW}⚠${RESET} $1"; }
log_err()  { echo -e "${RED}✗${RESET} $1"; }

# Cherry-pick order: primitives → data → stores → composites
# Each entry: SHA "description"
PICKS=(
  # Primitives
  "9e9be71:Icon primitive"
  "37fa67a:Avatar primitive"
  "14f6e2d:Badge primitive"
  "8390cdf:Input primitive"
  "21f7c5d:ProgressBar primitive"
  "eaae0fd:Tag primitive"
  # Data layer
  "160d252:programs mock data"
  "bcf0a26:reports mock data"
  # Stores
  "6931fb5:useProgramStore"
  "ba38575:useThemeStore + dark mode"
  # Composites
  "85b05d3:ProgramCard composite"
)

merged=0
skipped=0
failed=0

log "Recovering ${#PICKS[@]} dangling commits..."
echo ""

for entry in "${PICKS[@]}"; do
  sha="${entry%%:*}"
  desc="${entry#*:}"

  # Check if this work already exists on main (by commit message match)
  msg=$(git log --format='%s' -1 "$sha" 2>/dev/null)
  if git log --oneline main | grep -qF "$desc" 2>/dev/null; then
    log_warn "SKIP (already on main): $desc"
    skipped=$((skipped + 1))
    continue
  fi

  log "Cherry-picking: $desc ($sha)..."
  if git cherry-pick "$sha" --no-edit 2>/dev/null; then
    log_ok "Merged: $desc"
    merged=$((merged + 1))
  else
    # Try to resolve — if conflict is just barrel exports, auto-fix
    if git diff --name-only --diff-filter=U 2>/dev/null | grep -q "index.ts"; then
      log_warn "Conflict in barrel export — attempting auto-resolve..."
      # Accept theirs for the new component, keep ours for existing
      git checkout --theirs -- $(git diff --name-only --diff-filter=U) 2>/dev/null || true
      git add -A 2>/dev/null
      if git cherry-pick --continue --no-edit 2>/dev/null; then
        log_ok "Merged (auto-resolved): $desc"
        merged=$((merged + 1))
        continue
      fi
    fi
    git cherry-pick --abort 2>/dev/null || true
    log_err "FAILED: $desc — manual cherry-pick needed: git cherry-pick $sha"
    failed=$((failed + 1))
  fi
done

echo ""
log "Recovery complete: ${GREEN}$merged merged${RESET} | ${YELLOW}$skipped skipped${RESET} | ${RED}$failed failed${RESET}"

# Validate
echo ""
log "Running typecheck..."
if bun typecheck 2>/dev/null; then
  log_ok "Typecheck passed"
else
  log_err "Typecheck failed — manual fixes needed"
fi
