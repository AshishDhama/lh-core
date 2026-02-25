# AGENTS.md — lh-core

> Guidelines for AI coding agents working in this React web app codebase.

---

## RULE 0 - THE FUNDAMENTAL OVERRIDE PREROGATIVE

If I tell you to do something, even if it goes against what follows below, YOU MUST LISTEN TO ME. I AM IN CHARGE, NOT YOU.

---

## RULE NUMBER 1: NO FILE DELETION

**YOU ARE NEVER ALLOWED TO DELETE A FILE WITHOUT EXPRESS PERMISSION.** Even a new file that you yourself created, such as a test code file. You have a horrible track record of deleting critically important files or otherwise throwing away tons of expensive work. As a result, you have permanently lost any and all rights to determine that a file or folder should be deleted.

**YOU MUST ALWAYS ASK AND RECEIVE CLEAR, WRITTEN PERMISSION BEFORE EVER DELETING A FILE OR FOLDER OF ANY KIND.**

---

## Irreversible Git & Filesystem Actions — DO NOT EVER BREAK GLASS

1. **Absolutely forbidden commands:** `git reset --hard`, `git clean -fd`, `rm -rf`, or any command that can delete or overwrite code/data must never be run unless the user explicitly provides the exact command and states, in the same message, that they understand and want the irreversible consequences.
2. **No guessing:** If there is any uncertainty about what a command might delete or overwrite, stop immediately and ask the user for specific approval. "I think it's safe" is never acceptable.
3. **Safer alternatives first:** When cleanup or rollbacks are needed, request permission to use non-destructive options (`git status`, `git diff`, `git stash`, copying to backups) before ever considering a destructive command.
4. **Mandatory explicit plan:** Even after explicit user authorization, restate the command verbatim, list exactly what will be affected, and wait for a confirmation that your understanding is correct. Only then may you execute it—if anything remains ambiguous, refuse and escalate.

---

## Toolchain: React Web

We use **Vite + React 19 + TypeScript** in this project.

- **Build:** Vite
- **Framework:** React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + Ant Design 5
- **Navigation:** TanStack Router (file-based routing)
- **State:** Zustand 5
- **Server State:** TanStack Query v5 (React Query)
- **Icons:** Lucide React
- **Font:** DM Sans
- **i18n:** i18n-js
- **Package Manager:** bun

### Key Dependencies

| Package | Purpose |
|---------|---------|
| `react` 19 | UI framework |
| `antd` 5 | Base component library |
| `@tailwindcss/vite` | Tailwind CSS v4 Vite plugin |
| `@tanstack/react-router` | Type-safe file-based routing |
| `zustand` | Global state management |
| `@tanstack/react-query` | Server state and caching |
| `lucide-react` | Icon system |
| `clsx` + `tailwind-merge` | Class name merging |
| `i18n-js` | Internationalization |

### NOT Used (DO NOT add these)

| Package | Why NOT |
|---------|--------|
| `next` | We use Vite, not Next.js |
| `react-router-dom` | We use TanStack Router |
| `styled-components` | We use Tailwind + Ant Design |
| `emotion` | We use Tailwind + Ant Design |
| `redux` | We use Zustand |
| `react-i18next` | We use `i18n-js` |

### Package Manager

Use **bun** for all package operations:

```bash
bun install <package>       # Install dependencies
bun install                 # Install all dependencies
bun dev                     # Start Vite dev server
bun build                   # Production build
bun typecheck               # TypeScript type checking
bun lint                    # ESLint check
bun lint --fix              # Auto-fix lint issues
```

**NEVER use npm, yarn, or pnpm.**

---

## Code Editing Discipline

### No Script-Based Changes

**NEVER** run a script that processes/changes code files in this repo. Brittle regex-based transformations create far more problems than they solve.

- **Always make code changes manually**, even when there are many instances
- For many simple changes: use parallel subagents
- For subtle/complex changes: do them methodically yourself

### No File Proliferation

If you want to change something or add a feature, **revise existing code files in place**.

**NEVER** create variations like `ButtonV2.tsx`, `Button_improved.tsx`, `Button_enhanced.tsx`.

New files are reserved for **genuinely new functionality** that makes zero sense to include in any existing file.

---

## TypeScript & Type Safety

### Strict Mode

This project uses TypeScript strict mode. **NEVER use `any`** unless absolutely unavoidable (and document why).

### Code Style

| Rule | Value |
|------|-------|
| Indentation | 2 spaces |
| Quotes | Single (`'`) |
| JSX Quotes | Double (`"`) |
| Semicolons | Required |
| Trailing commas | Required (multiline) |

### Path Aliases

Always use path aliases:

| Alias | Maps to |
|-------|---------|
| `@/*` | `./src/*` |

**Examples:**
```typescript
import { Button } from '@/forge/primitives';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';
import type { Program } from '@/types/program';
```

### Import Order

1. External packages (`react`, `antd`, `zustand`)
2. Internal modules (`@/forge`, `@/stores`, `@/hooks`)
3. Relative imports (`./`, `../`)
4. Type imports

**Always use newlines between import groups.**

### Naming Conventions

- **Components:** PascalCase (`AssessmentCard.tsx`)
- **Hooks:** camelCase with `use` prefix (`useAuth.ts`)
- **Types:** PascalCase with descriptive suffixes (`AssessmentCardProps`, `AuthStore`)
- **Tokens:** camelCase (`colors.ts`, `spacing.ts`)

---

## Design System — Forge

We follow a **layered component architecture** called **Forge**, built on top of Ant Design with Tailwind for custom styling.

### Component Hierarchy

| Level | Name | Description | Location |
|-------|------|-------------|----------|
| **Primitives** | Atoms | Basic building blocks (extend antd) | `src/forge/primitives/` |
| **Composites** | Molecules | Simple component groups | `src/forge/composites/` |
| **Patterns** | Organisms | Complex UI sections | `src/forge/patterns/` |
| **Layouts** | Templates | Full-page layouts | `src/forge/layouts/` |
| **Pages** | Screens | Route-level components | `src/routes/` |

### Forge Rules

1. **Ant Design first** — Use antd components as base, extend with Forge wrappers
2. **Tailwind for custom styling** — Use utility classes for layout, spacing, custom overrides
3. **Design tokens** — All colors, spacing, radii come from `@/forge/tokens`, never hardcoded
4. **Barrel exports** — Always import from `@/forge` or `@/forge/primitives`, never deep paths
5. **Co-located types** — Component props defined in the same file
6. **One component per file** — Each Forge component gets its own file
7. **`cn()` for class merging** — Always use `cn()` from `@/forge/utils` to merge classNames

### Styling Approach

Components use **Ant Design** as the base with **Tailwind CSS** for additional styling:

```typescript
import { Button as AntButton, type ButtonProps as AntButtonProps } from 'antd';
import { cn } from '@/forge/utils';

type ButtonProps = AntButtonProps & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <AntButton
      type={variant === 'primary' ? 'primary' : variant === 'ghost' ? 'text' : 'default'}
      className={cn(
        'font-medium rounded-lg',
        variant === 'secondary' && 'border-navy-200 text-navy-700',
        className,
      )}
      {...props}
    />
  );
}
```

### Design Tokens

All visual values come from `src/forge/tokens/`:

| File | Contents |
|------|----------|
| `colors.ts` | Brand colors (navy, teal, purple), semantic, surfaces, content |
| `spacing.ts` | Spacing scale |
| `typography.ts` | Font families, sizes, weights |
| `radii.ts` | Border radius scale |
| `shadows.ts` | Box shadow definitions |
| `antTheme.ts` | Ant Design ConfigProvider theme overrides |

**NEVER hardcode hex colors, spacing values, or font sizes.** Always reference tokens.

---

## Routing — TanStack Router

File-based routing in `src/routes/`:

```
src/routes/
├── __root.tsx           # Root layout (providers, global styles)
├── index.tsx            # / → Dashboard
├── programs/
│   ├── index.tsx        # /programs
│   ├── $programId.tsx   # /programs/:id
│   └── $programId.tasks.tsx
├── development/
│   └── index.tsx        # /development → IDP builder
└── ...
```

### Route File Pattern

```typescript
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: DashboardPage,
});

function DashboardPage() {
  return <div>Dashboard</div>;
}
```

---

## Ralph Wiggum Methodology

Ralph is an **autonomous AI coding methodology** that runs agents in a loop, letting them work on tasks without constant human supervision.

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Agent Chooses Tasks** | AI picks the next task from `br ready` (highest priority, no blockers) |
| **Progress Tracking** | Each iteration appends to `progress.txt` for context across loops |
| **Feedback Loops** | Types, tests, linting must pass before committing |
| **Small Steps** | One logical change per iteration |
| **Risk First** | Tackle architectural and integration tasks early |

### Workflow Modes

| Mode | Description | Best For |
|------|-------------|----------|
| **HITL** (Human-in-the-loop) | `./scripts/ralph.sh hitl` | Learning, risky tasks |
| **AFK** (Away from keyboard) | `./scripts/ralph.sh afk 10` | Bulk work, overnight runs |
| **Parallel** | `./scripts/ralph.sh parallel 3` | Many independent tasks |

### Mandatory Feedback Loops

Before EVERY commit:

```bash
bun typecheck              # TypeScript - must pass
bun lint                   # ESLint - must pass
```

If ANY loop fails -> Fix it -> Re-run loops -> Only then commit.

---

## Issue Tracking — beads_rust (`br` CLI)

This project uses **beads_rust** for dependency-aware issue tracking. Issues are stored in SQLite with JSONL export for git sync.

### Essential Commands

```bash
br ready                   # Show issues ready to work (no blockers)
br ready --json            # Machine-readable for scripts
br list --status=open      # All open issues
br show <id>               # Full issue details with dependencies
br create --title="..." --type=task --priority=2
br update <id> --status=in_progress
br close <id> --reason="Completed"
br close <id1> <id2>       # Close multiple issues at once
br sync --flush-only       # Export to JSONL (no git operations)
```

### Workflow Pattern

1. **Start**: Run `br ready` to find actionable work
2. **Claim**: Use `br update <id> --status=in_progress`
3. **Work**: Implement the task
4. **Complete**: Use `br close <id> --reason="Done"`
5. **Sync**: Always run `br sync --flush-only` at session end

### Key Concepts

- **Dependencies**: Issues can block other issues. `br ready` shows only unblocked work.
- **Priority**: P0=critical, P1=high, P2=medium, P3=low, P4=backlog (use numbers, not words)
- **Types**: task, bug, feature, epic, question, docs

---

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** — Create issues with `br create`
2. **Run quality gates** (if code changed):
   ```bash
   bun typecheck          # TypeScript checking
   bun lint               # Linting
   ```
3. **Update issue status** — Close completed issues with `br close <id>`
4. **Sync beads:**
   ```bash
   br sync --flush-only   # Export beads tracking to JSONL
   ```
5. **Stage changes:**
   ```bash
   git status             # Check what changed
   git add <files>        # Stage code changes
   ```
6. **Commit:**
   ```bash
   git commit -m "feat: description of changes"
   ```

### Pre-Commit Checklist

Before every commit:

- [ ] All TypeScript errors resolved (`bun typecheck`)
- [ ] All linting errors resolved (`bun lint --fix`)
- [ ] No `console.log` statements (use proper logging)
- [ ] No hardcoded colors/spacing (use design tokens from `@/forge/tokens`)
- [ ] Components import from barrel exports (`@/forge`)
- [ ] Tests passing (if applicable)

---

## Note on Other Agents' Work

When working in parallel mode, other agents may modify files simultaneously. **NEVER** stash, revert, overwrite, or otherwise disturb the work of other agents. Treat their changes as your own and proceed normally.

---

## Commands Reference

```bash
# Development
bun dev                    # Start Vite dev server
bun build                  # Production build
bun preview                # Preview production build

# Quality
bun typecheck              # TypeScript type checking
bun lint                   # ESLint check
bun lint --fix             # Auto-fix ESLint issues

# Issue Tracking (beads_rust)
br ready                   # Show ready work
br list --status=open      # All open issues
br show <id>               # Full details
br create --title="..."    # Create issue
br update <id> --status=in_progress
br close <id> --reason="Completed"
br sync --flush-only       # Export to JSONL

# Ralph Wiggum AI Loop
./scripts/ralph.sh hitl         # Single iteration
./scripts/ralph.sh afk 10       # 10 iterations unattended
./scripts/ralph.sh parallel 3   # 3 concurrent workers
./scripts/ralph.sh status       # Dashboard
```

<!-- Legacy bd/beads_viewer section removed — see "Issue Tracking — beads_rust" section above.
   Correct repo: https://github.com/Dicklesworthstone/beads_rust -->
