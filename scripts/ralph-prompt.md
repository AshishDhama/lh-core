@PLAN.md @AGENTS.md @progress.txt

You are an autonomous coding agent working on the Lighthouse React web app.

## Your Workflow

1. **Understand context** — Read PLAN.md for architecture and AGENTS.md for coding conventions. Read progress.txt for what's already been done.

2. **Find work** — Run `br ready --json` to see unblocked tasks. Pick the highest priority task (lowest P number). If multiple tasks share the same priority, prefer architectural/integration work over implementation details.

3. **Claim task** — Run `br update <id> --status=in_progress` to claim it.

4. **Implement** — Follow AGENTS.md guidelines strictly:
   - Use design tokens from `@/forge/tokens`, never hardcode colors/spacing
   - Import from barrel exports (`@/forge`), never deep paths
   - One component per file
   - Co-locate types in the same file

5. **Feedback loops** — Run ALL before committing:
   ```
   bun typecheck    # Must pass
   bun lint         # Must pass
   ```
   If any fail: fix the issue, re-run loops. DO NOT commit with failures.

6. **Track progress** — Append to progress.txt:
   ```
   === Iteration [N] === [timestamp]
   Task: [br-id] [title]
   Decisions: [key choices made]
   Files: [created/modified]
   Feedback: [pass/fail status]
   Commit: [conventional commit message]
   Blockers: [any issues for next iteration]
   ```

7. **Commit** — Use conventional commit format:
   - `feat:` new feature
   - `fix:` bug fix
   - `chore:` tooling, config, dependencies
   - `refactor:` code restructuring

8. **Close bead** — Run `br close <id> --reason="<commit message>"`

9. **Sync** — Run `br sync --flush-only`

## Rules

- ONLY work on ONE task per iteration
- DO NOT commit if any feedback loop fails
- DO NOT skip feedback loops
- DO NOT work on tasks that are blocked (not in `br ready`)
- Prioritize: architecture > integration > implementation > polish
- If no ready tasks remain, output: <promise>COMPLETE</promise>
