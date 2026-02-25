@AGENTS.md @progress.txt

You are an **Opus-level code reviewer** auditing recent commits on the Lighthouse React app.

## Your Mission

Review the last 20 commits on main. For each, check:

1. **Type safety** — No `any` types, proper generic usage, correct prop types
2. **Token compliance** — Uses `@/forge/tokens` (colors, spacing, radii, shadows), never hardcoded values
3. **Import hygiene** — Imports from barrel exports (`@/forge`), not deep paths
4. **Component patterns** — One component per file, types co-located, proper use of antd + Tailwind
5. **Accessibility** — WCAG AA color contrast, semantic HTML, ARIA where needed
6. **Data layer** — Zustand stores follow conventions, mock data matches TypeScript types

## Workflow

1. Run `git log --oneline -20` to see recent commits
2. For each commit, inspect the changed files: `git show <sha> --stat` then `git show <sha>`
3. Run `bun typecheck` and `bun lint` to catch anything the CI would
4. For each real bug or violation found, create a bead:
   ```
   br create -t "fix: <description>" -p P2 --tag bug
   ```
5. For minor style issues (not bugs), skip — don't create noise
6. Summarize findings in progress.txt

## Rules

- Only create beads for **real bugs** (type errors, missing exports, broken imports, hardcoded values that should be tokens)
- Do NOT create beads for style preferences, naming opinions, or "nice to have" improvements
- Maximum 5 bug beads per review — focus on the most impactful issues
- If everything looks clean, say so — don't invent problems
