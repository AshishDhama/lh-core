# Project Lighthouse v2.0 - Implementation Plan

## Executive Summary

Building a **React web app** for a career consulting / assessment platform. This is a **fresh build** from a reference prototype (`lighthouse-v5-iter3_3.jsx`) incorporating:
- **Forge** — custom UI library following atomic design (primitives, composites, patterns, layouts)
- **Ant Design 5** — base component library with Lighthouse brand theming
- **Tailwind CSS v4** — utility-first styling alongside Ant Design
- **TanStack Router** — type-safe file-based routing
- **Ralph Wiggum methodology** — autonomous AI coding loops
- **beads_rust** (`br` CLI) — dependency-aware issue tracking

---

## Tech Stack Overview

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Build** | Vite | Fast dev server + production bundling |
| **Framework** | React 19 | UI library |
| **Language** | TypeScript (strict mode) | Type safety |
| **Routing** | TanStack Router | Type-safe file-based routing |
| **UI Library** | Ant Design 5 | Base components (Button, Table, Form, etc.) |
| **Styling** | Tailwind CSS v4 | Utility classes + custom design tokens |
| **State** | Zustand | Global client state |
| **Server State** | TanStack Query v5 (React Query) | API calls, caching, sync |
| **Icons** | Lucide React | Icon system |
| **Font** | DM Sans | Typography (from prototype) |
| **i18n** | i18n-js | Multi-language (EN/HI) |
| **Package Manager** | bun | Fast installs + script runner |
| **Issue Tracking** | beads_rust (`br` CLI) | Dependency-aware task management |
| **AI Methodology** | Ralph Wiggum | Autonomous coding loops |

---

## Forge UI Library

### What is Forge?

**Forge** is the project's custom UI library built on top of Ant Design. It follows **atomic design** principles and lives entirely in `src/forge/`. Every component in the app is built from or composed through Forge.

### Structure

```
src/forge/
├── primitives/              # Atoms — smallest UI building blocks
│   ├── Button.tsx           # Extends antd Button with brand variants
│   ├── Input.tsx            # Extends antd Input with brand styling
│   ├── Badge.tsx            # Status badges (In Progress, Complete, etc.)
│   ├── Avatar.tsx           # User avatars
│   ├── Tag.tsx              # Labels and tags
│   ├── Typography.tsx       # Text, Heading, Label components
│   ├── ProgressBar.tsx      # Linear progress indicator
│   ├── Icon.tsx             # Lucide icon wrapper with sizing
│   └── index.ts             # Barrel export
│
├── composites/              # Molecules — combinations of primitives
│   ├── FormField.tsx        # Label + Input + Error message
│   ├── SearchBar.tsx        # Input + search icon + clear button
│   ├── StatCard.tsx         # Icon + value + label (dashboard stats)
│   ├── ProgramCard.tsx      # Program info card (dashboard)
│   ├── AssessmentCard.tsx   # Exercise/assessment item
│   ├── ReportCard.tsx       # Insight report item
│   ├── ChatMessage.tsx      # Chat bubble (AI assistant + IDP chat)
│   ├── CommentThread.tsx    # Manager/user comment thread
│   ├── SkillCard.tsx        # IDP skill card with tips
│   ├── CountdownTimer.tsx   # Deadline countdown display
│   └── index.ts
│
├── patterns/                # Organisms — complex UI sections
│   ├── Header.tsx           # Top bar (logo, search, notifications, profile)
│   ├── Sidebar.tsx          # Navigation sidebar with items
│   ├── HeroBanner.tsx       # Program hero with gradient + info
│   ├── ExerciseList.tsx     # Sequential + open exercise list
│   ├── CenterGrid.tsx       # Assessment center cards grid
│   ├── SystemCheckPanel.tsx # Proctored pre-check (camera, mic, etc.)
│   ├── IdpBuilder.tsx       # IDP creation flow (skill gap + chat + plan)
│   ├── PlanEditor.tsx       # IDP plan editor with skills + tips
│   ├── ScheduleCalendar.tsx # Scheduling calendar/list view
│   ├── ChatAssistant.tsx    # Floating chat assistant panel
│   ├── InsightsGrid.tsx     # Reports and analytics grid
│   └── index.ts
│
├── layouts/                 # Page shells — wrap content with navigation
│   ├── DashboardLayout.tsx  # Sidebar + Header + main content area
│   ├── FullscreenLayout.tsx # No sidebar (pre-check, auth flows)
│   ├── AuthLayout.tsx       # Centered card layout for login/signup
│   └── index.ts
│
├── tokens/                  # Design tokens — centralized design values
│   ├── colors.ts            # Brand colors, semantic colors, surfaces
│   ├── spacing.ts           # Spacing scale
│   ├── typography.ts        # Font families, sizes, weights
│   ├── radii.ts             # Border radius scale
│   ├── shadows.ts           # Box shadow definitions
│   ├── antTheme.ts          # Ant Design ConfigProvider theme overrides
│   └── index.ts
│
├── utils/                   # Helpers
│   ├── cn.ts                # clsx + tailwind-merge for className merging
│   └── index.ts
│
└── index.ts                 # Root barrel: export * from each folder
```

### Forge Rules

1. **Ant Design first** — Use antd components as base, extend with Forge wrappers
2. **Tailwind for custom styling** — Use utility classes for layout, spacing, custom overrides
3. **Design tokens** — All colors, spacing, radii come from `forge/tokens/`, never hardcoded
4. **Barrel exports** — Always import from `@/forge` or `@/forge/primitives`, never deep paths
5. **Co-located types** — Component props defined in the same file
6. **One component per file** — Each Forge component gets its own file

### Example: Forge Primitive

```typescript
// src/forge/primitives/Button.tsx

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

---

## Design Tokens

### Brand Colors (from prototype)

```typescript
// src/forge/tokens/colors.ts

export const colors = {
  // Brand
  navy: {
    DEFAULT: '#002C77',
    50: '#EEF6FA', 100: '#D0E2F2', 200: '#A3C5E5',
    300: '#6A9FD4', 400: '#3575BC', 500: '#002C77',
    600: '#002361', 700: '#001A4A', 800: '#001234', 900: '#000A1E',
  },
  teal: {
    DEFAULT: '#008575',
    50: '#E6F7F5', 100: '#B3E8E2', 200: '#80D9CF',
    300: '#4DCABC', 400: '#26BBA9', 500: '#008575',
    600: '#006B5E', 700: '#005147', 800: '#003730', 900: '#001D19',
  },
  purple: {
    DEFAULT: '#7B61FF',
  },

  // Semantic
  success: { light: '#86efac', DEFAULT: '#22c55e', dark: '#15803d' },
  warning: { light: '#fde047', DEFAULT: '#eab308', dark: '#a16207' },
  error:   { light: '#fca5a5', DEFAULT: '#ef4444', dark: '#b91c1c' },

  // Surfaces (light mode)
  surface: {
    primary: '#ffffff',
    secondary: '#fafbfc',
    tertiary: '#f1f5f9',
    elevated: '#ffffff',
  },

  // Content
  content: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#94a3b8',
    inverse: '#ffffff',
  },
};
```

### Ant Design Theme Override

```typescript
// src/forge/tokens/antTheme.ts

import type { ThemeConfig } from 'antd';
import { colors } from './colors';

export const antTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.navy.DEFAULT,
    colorSuccess: colors.success.DEFAULT,
    colorWarning: colors.warning.DEFAULT,
    colorError: colors.error.DEFAULT,
    colorInfo: colors.teal.DEFAULT,
    fontFamily: "'DM Sans', sans-serif",
    borderRadius: 8,
    colorBgContainer: colors.surface.primary,
    colorText: colors.content.primary,
    colorTextSecondary: colors.content.secondary,
  },
  components: {
    Button: { borderRadius: 10, controlHeight: 40 },
    Card: { borderRadiusLG: 14 },
    Input: { borderRadius: 8 },
  },
};
```

---

## Project Structure

```
lh-core/
├── src/
│   ├── forge/                        # UI library (see Forge section)
│   │   ├── primitives/
│   │   ├── composites/
│   │   ├── patterns/
│   │   ├── layouts/
│   │   ├── tokens/
│   │   ├── utils/
│   │   └── index.ts
│   │
│   ├── routes/                       # TanStack Router (file-based)
│   │   ├── __root.tsx                # Root layout (providers, global styles)
│   │   ├── index.tsx                 # / → Dashboard
│   │   ├── programs/
│   │   │   ├── index.tsx             # /programs → Program list
│   │   │   ├── $programId.tsx        # /programs/:id → Program detail
│   │   │   └── $programId.tasks.tsx  # /programs/:id/tasks → Exercises
│   │   ├── precheck/
│   │   │   └── $checkId.tsx          # /precheck/:id → Proctored pre-check
│   │   ├── centers/
│   │   │   └── $centerId.tsx         # /centers/:id → Center detail
│   │   ├── development/
│   │   │   └── index.tsx             # /development → IDP builder
│   │   ├── scheduling/
│   │   │   └── index.tsx             # /scheduling → Schedule/book slots
│   │   ├── insights/
│   │   │   └── index.tsx             # /insights → Reports + analytics
│   │   ├── modes/                    # Design mode showcase (evaluation)
│   │   │   ├── scrolly.tsx           # /modes/scrolly
│   │   │   ├── bento.tsx             # /modes/bento
│   │   │   ├── editorial.tsx         # /modes/editorial
│   │   │   ├── notion.tsx            # /modes/notion
│   │   │   └── m3.tsx                # /modes/m3
│   │   └── discovery.tsx             # /discovery → Component showcase (dev)
│   │
│   ├── stores/                       # Zustand stores
│   │   ├── useThemeStore.ts          # Dark mode, design mode, brand colors
│   │   ├── useProgramStore.ts        # Program state, consent, progress
│   │   ├── useIdpStore.ts            # IDP plan, skills, tips, comments
│   │   └── useScheduleStore.ts       # Scheduling state
│   │
│   ├── api/                          # TanStack Query hooks
│   │   ├── queryClient.ts            # Query client config
│   │   ├── usePrograms.ts            # Program data queries
│   │   ├── useReports.ts             # Insights/reports queries
│   │   └── useSchedule.ts            # Scheduling queries
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useCountdown.ts           # Deadline countdown
│   │   ├── useMediaQuery.ts          # Responsive breakpoints
│   │   └── useDarkMode.ts            # Dark mode detection
│   │
│   ├── types/                        # TypeScript types
│   │   ├── program.ts                # Program, Exercise, Center types
│   │   ├── idp.ts                    # IDP skill, tip, plan types
│   │   └── schedule.ts               # Scheduling types
│   │
│   ├── i18n/                         # Internationalization
│   │   ├── en.ts                     # English translations
│   │   ├── hi.ts                     # Hindi translations
│   │   └── index.ts                  # i18n setup
│   │
│   ├── data/                         # Mock data (from prototype)
│   │   ├── programs.ts               # Program definitions
│   │   ├── reports.ts                # Report definitions
│   │   └── idp.ts                    # IDP competencies, questions
│   │
│   ├── routeTree.gen.ts              # TanStack Router generated file
│   ├── App.tsx                       # App entry (providers wrapper)
│   ├── main.tsx                      # Vite entry (ReactDOM.createRoot)
│   └── app.css                       # Global styles + Tailwind directives
│
├── public/                           # Static assets
├── .beads/                           # beads_rust issue tracking (existing)
├── scripts/
│   └── ralph.sh                      # Ralph Wiggum autonomous loop
│
├── index.html                        # Vite HTML entry
├── vite.config.ts                    # Vite config
├── tsconfig.json                     # TypeScript config
├── tsconfig.app.json                 # App-specific TS config
├── tsconfig.node.json                # Node-specific TS config (Vite)
├── eslint.config.js                  # ESLint flat config
├── package.json                      # Dependencies + scripts
├── PLAN.md                           # This file
├── AGENTS.md                         # Coding guidelines for AI agents
├── progress.txt                      # Ralph session progress (gitignored)
└── lighthouse-v5-iter3_3.jsx         # Reference prototype (read-only)
```

---

## Pages (from Prototype)

The reference prototype defines these pages. Each becomes a TanStack Router route:

| Page | Route | Description |
|------|-------|-------------|
| **Dashboard** | `/` | Welcome greeting, stats (active programs, reports, deadlines), program cards |
| **Program Instructions** | `/programs/:id` | Video + consent before starting a program |
| **Program Tasks** | `/programs/:id/tasks` | Sequential exercises, open exercises, assessment centers |
| **Pre-Check** | `/precheck/:id` | Proctored assessment: consent, system checks (camera, mic, internet), launch |
| **Center Detail** | `/centers/:id` | Assessment center with activities list |
| **Development (IDP)** | `/development` | Individual Development Plan: skill gap, AI chat, plan builder, manager comments |
| **Scheduling** | `/scheduling` | Book assessment slots (list + calendar views) |
| **Insights** | `/insights` | Reports and analytics |
| **Discovery** | `/discovery` | Dev-only component showcase |
| **Design Modes** | `/modes/:mode` | 5 design modes for evaluation (scrolly, bento, editorial, notion, m3) |

### Design Mode Pages

Each of the **5 design modes** from the prototype gets its own page under `/modes/`:
- All modes share the same data and Forge components
- Each applies different styling tokens (border radius, shadows, card styles, typography sizing)
- Purpose: evaluate which design language to use, then delete the rest
- Mode tokens are defined per-mode in `forge/tokens/` and applied via context/props

---

## Ralph Wiggum Methodology

### What is Ralph Wiggum?

Ralph is an **autonomous AI coding methodology** that runs agents in a loop, letting them work on tasks without constant human supervision. The agent chooses what to work on next based on priority and dependencies.

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
| **HITL** (Human-in-the-loop) | Run once, watch, intervene | Learning, risky tasks, prompt refinement |
| **AFK** (Away from keyboard) | Run in loop with max iterations | Bulk work, low-risk tasks, overnight runs |

### Ralph Script

```bash
#!/bin/bash
# scripts/ralph.sh
# Ralph Wiggum autonomous coding loop

set -e

ITERATIONS=${1:-10}

for ((i=1; i<=$ITERATIONS; i++)); do
  echo "=== Iteration $i/$ITERATIONS ==="

  result=$(claude -p "
@PLAN.md @progress.txt

You are working on the Lighthouse React web app.

1. Read PLAN.md and progress.txt to understand current state
2. Run 'br ready' to see what tasks are ready to work on
3. Choose the highest priority task that:
   - Has no blockers (no dependencies blocking it)
   - Is architectural/integration work OR small incremental work
   - Can be completed in one logical commit
4. Implement the task following AGENTS.md guidelines
5. Run ALL feedback loops:
   - bun typecheck (must pass)
   - bun lint (must pass)
   - bun test (must pass if tests exist)
6. Update progress.txt with:
   - Task completed
   - Key decisions made
   - Files changed
   - Any blockers encountered
7. Make a git commit with conventional commit message
8. Run 'br sync --flush-only' to sync beads tracking

DO NOT work on multiple tasks in one iteration.
DO NOT commit if any feedback loop fails.
If all work is complete, output: <promise>COMPLETE</promise>")

  echo "$result"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "All tasks complete!"
    exit 0
  fi

  sleep 5
done

echo "Max iterations reached. Review progress.txt and continue."
```

### Progress File (progress.txt)

Each iteration appends session context:

```
=== Iteration 3 ===
Task: Created Button primitive in Forge
Decisions:
  - Extended antd Button with brand variants
  - Added Tailwind classes for custom styling
  - Used design tokens from forge/tokens
Files Changed:
  - src/forge/primitives/Button.tsx (created)
  - src/forge/primitives/index.ts (updated barrel)
Feedback Loops: All passed
Commit: feat: add Button primitive to Forge
Beads: Closed br-5
Blockers: None
```

### Feedback Loops (Mandatory)

Before EVERY commit:

```bash
bun typecheck              # TypeScript - must pass
bun lint                   # ESLint - must pass
bun test                   # Tests - must pass if exist
br sync --flush-only       # Beads tracking
```

If ANY loop fails: fix it, re-run loops, only then commit.

---

## beads_rust Integration

### Why beads_rust?

**beads_rust** (`br` CLI) is a dependency-aware issue tracker that stores issues in SQLite with JSONL export for git-based sync. Unlike simple TODO lists, beads understands:

- **Dependencies** — Issue A blocks Issue B
- **Priority** — P0 (critical) to P4 (backlog)
- **Ready work** — Only shows tasks with no blockers (`br ready`)
- **Graph analysis** — Critical path, cycles, bottlenecks

### Essential Commands

```bash
# View ready work (what you should do next)
br ready

# Show all open issues
br list --status=open

# Get full details
br show <id>

# Create new issue
br create --title="..." --type=task --priority=2

# Update status
br update <id> --status=in_progress

# Close when done
br close <id> --reason="Implemented in commit abc123"

# Sync to git (exports to .beads/)
br sync --flush-only    # Export to JSONL only (no git operations)
```

### beads Workflow in Ralph

```bash
# Start of iteration
br ready                    # Find what to work on
br show br-5                # Get full details
br update br-5 --status=in_progress

# During work
br create --title="Found edge case" --type=bug --priority=3

# End of iteration
br close br-5 --reason="Done"
br sync --flush-only        # Export beads to JSONL
git add . && git commit     # Commit code changes
```

---

## Implementation Phases

### Phase 1: Foundation

- [ ] Initialize Vite + React 19 + TypeScript project (`bun create vite`)
- [ ] Install and configure Tailwind CSS v4
- [ ] Install and configure Ant Design 5 with custom theme
- [ ] Install and configure TanStack Router (file-based)
- [ ] Install Zustand + TanStack Query v5
- [ ] Create `src/forge/tokens/` (colors, spacing, typography, radii, shadows, antTheme)
- [ ] Create `src/forge/utils/cn.ts` (clsx + tailwind-merge)
- [ ] Create `src/forge/index.ts` barrel exports
- [ ] Create `scripts/ralph.sh`
- [ ] Create `AGENTS.md` with coding guidelines
- [ ] Create initial `progress.txt`
- [ ] Verify beads_rust setup + create initial issues

### Phase 2: Forge Primitives

- [ ] Button (extends antd Button)
- [ ] Input (extends antd Input)
- [ ] Typography (Text, Heading, Label)
- [ ] Badge (status indicators)
- [ ] Avatar (user photos)
- [ ] Tag (labels)
- [ ] ProgressBar (linear progress)
- [ ] Icon (Lucide wrapper)
- [ ] Create Discovery page to showcase all primitives

### Phase 3: Forge Composites

- [ ] StatCard (dashboard stat: icon + value + label)
- [ ] ProgramCard (program info with status + CTA)
- [ ] AssessmentCard (exercise item with status)
- [ ] FormField (label + input + validation)
- [ ] SearchBar (input + icon + clear)
- [ ] ChatMessage (chat bubble)
- [ ] CommentThread (threaded comments)
- [ ] SkillCard (IDP skill with expandable tips)
- [ ] CountdownTimer (deadline display)
- [ ] ReportCard (insight report item)

### Phase 4: Forge Patterns + Layouts

- [ ] DashboardLayout (sidebar + header + content)
- [ ] FullscreenLayout (no sidebar)
- [ ] Header (logo, search, notifications, profile, dark mode)
- [ ] Sidebar (nav items, collapse toggle)
- [ ] HeroBanner (program hero section)
- [ ] ExerciseList (sequential + open exercises)
- [ ] CenterGrid (assessment center cards)
- [ ] SystemCheckPanel (proctored pre-check)
- [ ] ChatAssistant (floating chat panel)
- [ ] ScheduleCalendar (booking calendar/list)
- [ ] InsightsGrid (reports grid)
- [ ] IdpBuilder (skill gap + chat flow)
- [ ] PlanEditor (plan with skills + tips + comments)

### Phase 5: Pages + Routing

- [ ] Dashboard page (`/`)
- [ ] Program instructions page (`/programs/:id`)
- [ ] Program tasks page (`/programs/:id/tasks`)
- [ ] Pre-check page (`/precheck/:id`)
- [ ] Center detail page (`/centers/:id`)
- [ ] Development/IDP page (`/development`)
- [ ] Scheduling page (`/scheduling`)
- [ ] Insights page (`/insights`)
- [ ] 5 design mode pages (`/modes/*`)
- [ ] Extract mock data from prototype into `src/data/`

### Phase 6: Features + Polish

- [ ] Dark mode toggle (Zustand + Tailwind dark: variant)
- [ ] i18n setup (EN/HI)
- [ ] Design mode comparison (choose final mode, delete rest)
- [ ] Responsive design (mobile sidebar collapse, responsive grids)
- [ ] Accessibility (keyboard nav, ARIA, focus management)
- [ ] Performance (lazy routes, React.memo, code splitting)

---

## Commands Reference

```bash
# Development
bun dev                      # Start Vite dev server
bun build                    # Production build
bun preview                  # Preview production build

# Quality
bun typecheck                # TypeScript checking
bun lint                     # ESLint check
bun lint --fix               # Auto-fix ESLint issues
bun test                     # Run tests

# beads_rust Issue Tracking
br ready                     # Show issues ready to work (no blockers)
br list --status=open        # All open issues
br show <id>                 # Full issue details with dependencies
br create --title="..." --type=task --priority=2
br update <id> --status=in_progress
br close <id> --reason="Completed"
br close <id1> <id2>         # Close multiple issues at once
br sync --flush-only         # Export to JSONL (no git operations)

# Ralph Wiggum AI Loop
./scripts/ralph.sh 10        # Run Ralph loop (10 iterations)
```

---

## Risk Mitigation

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Ant Design + Tailwind conflicts | Medium | Use `cn()` utility, Tailwind `!important` prefix sparingly |
| TanStack Router learning curve | Low | Type-safe = fewer runtime errors, good docs |
| Ralph loop quality issues | Medium | Mandatory feedback loops before commit |
| Design mode sprawl | Medium | Evaluate early, delete unused modes |
| beads sync conflicts | Low | beads_rust handles merge conflicts |
| Forge abstraction overhead | Low | Keep wrappers thin, don't over-abstract |

---

## Reference

- **Prototype**: `lighthouse-v5-iter3_3.jsx` — Full UI reference (2000+ lines, all pages + design modes)
- **Brand Colors**: Navy `#002C77`, Teal `#008575`, Purple `#7B61FF`
- **Font**: DM Sans (Google Fonts)
- **Design Modes**: Scrolly (default), Bento, Editorial, Notion, Material 3
- **Color Presets**: 12 preset palettes (Lighthouse, Ocean, Midnight, Forest, Crimson, Slate, Plum, Espresso, Teal, Rose, Charcoal, Nordic)

---

## Next Steps

1. **Begin Phase 1** — Initialize Vite project, install deps, create Forge tokens
2. **Create beads issues** — Add all Phase 1-2 tasks to `br` with dependencies
3. **Run Ralph HITL** — Start with human-in-the-loop for foundation work
4. **Switch to AFK** — Use autonomous loop for bulk Forge primitive creation
