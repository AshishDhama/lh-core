#!/usr/bin/env bash
set -euo pipefail

# Create all Phase 2-6 beads tasks with dependency chains.
# Each task ID is captured and used for downstream deps.

echo "=== Creating Phase 2-6 Tasks ==="
echo ""

# Helper: create task and capture ID
create_task() {
  local id
  id=$(br create "$@" --silent)
  echo "$id"
}

# ──────────────────────────────────────────────────────────────
# PHASE 2: Forge Primitives (11 tasks)
# ──────────────────────────────────────────────────────────────
echo "── Phase 2: Forge Primitives ──"

P2_1=$(create_task "Install lucide-react icon library" \
  -p P1 -l "phase-2,setup" \
  -d "Run: bun add lucide-react. Verify import works. Commit.")
echo "P2-1: $P2_1  Install lucide-react"

P2_2=$(create_task "Create Button primitive (src/forge/primitives/Button.tsx)" \
  -p P1 -l "phase-2,component,primitive" \
  --deps "blocks:$P2_1" \
  -d "Create Button primitive wrapping Ant Design Button. Props: variant (primary/secondary/ghost/danger/link), size (sm/md/lg), icon, iconPosition, loading, disabled, fullWidth. Use Forge tokens for colors/spacing/radii. Use cn() for className merging. Export from barrel. Include TypeScript interface.")
echo "P2-2: $P2_2  Button primitive"

P2_3=$(create_task "Create Input primitive (src/forge/primitives/Input.tsx)" \
  -p P1 -l "phase-2,component,primitive" \
  --deps "blocks:$P2_1" \
  -d "Create Input primitive wrapping Ant Design Input. Props: size (sm/md/lg), status (error/warning), prefix, suffix, allowClear, disabled. Use Forge tokens. Include Input.Password and Input.TextArea variants. Use cn() utility.")
echo "P2-3: $P2_3  Input primitive"

P2_4=$(create_task "Create Typography primitive (src/forge/primitives/Typography.tsx)" \
  -p P1 -l "phase-2,component,primitive" \
  --deps "blocks:$P2_1" \
  -d "Create Typography primitive with components: Title (h1-h4), Text, Paragraph, Label. Props: level, weight, color, align, truncate, className. Use Forge typography tokens (fontFamily, fontSize, fontWeight, lineHeight). Map to Ant Design Typography where appropriate.")
echo "P2-4: $P2_4  Typography primitive"

P2_5=$(create_task "Create Badge primitive (src/forge/primitives/Badge.tsx)" \
  -p P2 -l "phase-2,component,primitive" \
  --deps "blocks:$P2_1" \
  -d "Create Badge primitive wrapping Ant Design Badge. Props: count, dot, status (success/processing/error/warning/default), color, size, overflowCount, showZero. Use Forge color tokens.")
echo "P2-5: $P2_5  Badge primitive"

P2_6=$(create_task "Create Avatar primitive (src/forge/primitives/Avatar.tsx)" \
  -p P2 -l "phase-2,component,primitive" \
  --deps "blocks:$P2_1" \
  -d "Create Avatar primitive wrapping Ant Design Avatar. Props: src, alt, size (sm/md/lg/number), shape (circle/square), icon, fallback (initials). Include Avatar.Group. Use Forge tokens.")
echo "P2-6: $P2_6  Avatar primitive"

P2_7=$(create_task "Create Tag primitive (src/forge/primitives/Tag.tsx)" \
  -p P2 -l "phase-2,component,primitive" \
  --deps "blocks:$P2_1" \
  -d "Create Tag primitive wrapping Ant Design Tag. Props: color, closable, icon, bordered. Include Tag.CheckableTag variant. Use Forge color tokens for predefined color variants.")
echo "P2-7: $P2_7  Tag primitive"

P2_8=$(create_task "Create ProgressBar primitive (src/forge/primitives/ProgressBar.tsx)" \
  -p P2 -l "phase-2,component,primitive" \
  --deps "blocks:$P2_1" \
  -d "Create ProgressBar primitive wrapping Ant Design Progress. Props: percent, status (success/exception/active/normal), size, strokeColor, showInfo, format. Support type=line and type=circle. Use Forge color tokens.")
echo "P2-8: $P2_8  ProgressBar primitive"

P2_9=$(create_task "Create Icon primitive (src/forge/primitives/Icon.tsx)" \
  -p P1 -l "phase-2,component,primitive" \
  --deps "blocks:$P2_1" \
  -d "Create Icon primitive wrapping lucide-react icons. Props: name (string mapped to Lucide icon), size (sm/md/lg/number), color, strokeWidth, className. Provide a typed icon map for commonly used icons. Use cn() utility.")
echo "P2-9: $P2_9  Icon primitive"

P2_10=$(create_task "Update primitives barrel export (src/forge/primitives/index.ts)" \
  -p P2 -l "phase-2,barrel" \
  --deps "blocks:$P2_2,blocks:$P2_3,blocks:$P2_4,blocks:$P2_5,blocks:$P2_6,blocks:$P2_7,blocks:$P2_8,blocks:$P2_9" \
  -d "Update src/forge/primitives/index.ts to export all 8 primitives: Button, Input, Typography, Badge, Avatar, Tag, ProgressBar, Icon. Also re-export from src/forge/index.ts. Ensure clean named exports.")
echo "P2-10: $P2_10  Primitives barrel"

P2_11=$(create_task "Create Discovery page (src/routes/discovery.tsx)" \
  -p P3 -l "phase-2,page" \
  --deps "blocks:$P2_10" \
  -d "Create src/routes/discovery.tsx — a living catalog page that renders every primitive and composite with variations. Show each component with different props/states. This is a dev-only page for visual QA. Use DashboardLayout when available, fallback to simple layout.")
echo "P2-11: $P2_11  Discovery page"

echo ""

# ──────────────────────────────────────────────────────────────
# PHASE 3: Forge Composites (11 tasks)
# ──────────────────────────────────────────────────────────────
echo "── Phase 3: Forge Composites ──"

P3_1=$(create_task "Create StatCard composite (src/forge/composites/StatCard.tsx)" \
  -p P1 -l "phase-3,component,composite" \
  --deps "blocks:$P2_10" \
  -d "Create StatCard composite using primitives. Props: title, value (string|number), change (number, shows +/-%), icon, trend (up/down/flat), loading. Uses Typography, Icon, Badge. Styled with Forge tokens. Shows a metric card with optional trend indicator.")
echo "P3-1: $P3_1  StatCard"

P3_2=$(create_task "Create ProgramCard composite (src/forge/composites/ProgramCard.tsx)" \
  -p P1 -l "phase-3,component,composite" \
  --deps "blocks:$P2_10" \
  -d "Create ProgramCard composite. Props: title, description, progress (0-100), status (active/completed/locked), duration, thumbnail, onClick. Uses Typography, ProgressBar, Badge, Tag. Shows program overview with progress bar and status badge.")
echo "P3-2: $P3_2  ProgramCard"

P3_3=$(create_task "Create AssessmentCard composite (src/forge/composites/AssessmentCard.tsx)" \
  -p P2 -l "phase-3,component,composite" \
  --deps "blocks:$P2_10" \
  -d "Create AssessmentCard composite. Props: title, type (quiz/practical/observation), score, maxScore, status (pending/inProgress/completed/locked), dueDate, timeLimit. Uses Typography, Badge, ProgressBar, Icon. Shows assessment info with score display.")
echo "P3-3: $P3_3  AssessmentCard"

P3_4=$(create_task "Create FormField composite (src/forge/composites/FormField.tsx)" \
  -p P2 -l "phase-3,component,composite" \
  --deps "blocks:$P2_10" \
  -d "Create FormField composite wrapping Input with label, helper text, error state. Props: label, name, required, error, helperText, children (renders child input). Uses Typography for label/helper, Input as default child. Handles error styling with Forge tokens.")
echo "P3-4: $P3_4  FormField"

P3_5=$(create_task "Create SearchBar composite (src/forge/composites/SearchBar.tsx)" \
  -p P2 -l "phase-3,component,composite" \
  --deps "blocks:$P2_10" \
  -d "Create SearchBar composite. Props: placeholder, value, onChange, onSearch, filters (array of filter options), loading. Uses Input with search prefix icon, optional filter Tags. Debounced search with loading state.")
echo "P3-5: $P3_5  SearchBar"

P3_6=$(create_task "Create ChatMessage composite (src/forge/composites/ChatMessage.tsx)" \
  -p P2 -l "phase-3,component,composite" \
  --deps "blocks:$P2_10" \
  -d "Create ChatMessage composite. Props: content, sender (name, avatar), timestamp, isOwn (boolean), type (text/system/action). Uses Avatar, Typography. Styles differ for own vs other messages. Supports markdown-like content rendering.")
echo "P3-6: $P3_6  ChatMessage"

P3_7=$(create_task "Create CommentThread composite (src/forge/composites/CommentThread.tsx)" \
  -p P2 -l "phase-3,component,composite" \
  --deps "blocks:$P2_10" \
  -d "Create CommentThread composite. Props: comments (array of {author, avatar, content, timestamp, replies}), onReply, onEdit. Uses Avatar, Typography, Button, Input. Renders nested comment thread with reply capability.")
echo "P3-7: $P3_7  CommentThread"

P3_8=$(create_task "Create SkillCard composite (src/forge/composites/SkillCard.tsx)" \
  -p P2 -l "phase-3,component,composite" \
  --deps "blocks:$P2_10" \
  -d "Create SkillCard composite. Props: name, level (1-5 or beginner/intermediate/advanced/expert), category, progress, targetLevel, icon. Uses Typography, ProgressBar, Badge, Icon. Shows skill with current vs target level visualization.")
echo "P3-8: $P3_8  SkillCard"

P3_9=$(create_task "Create CountdownTimer composite (src/forge/composites/CountdownTimer.tsx)" \
  -p P3 -l "phase-3,component,composite" \
  --deps "blocks:$P2_10" \
  -d "Create CountdownTimer composite. Props: targetDate (Date|string), onComplete, format (hh:mm:ss/dd:hh:mm:ss), size, showLabels. Uses Typography. Real-time countdown with useEffect interval. Shows days/hours/minutes/seconds.")
echo "P3-9: $P3_9  CountdownTimer"

P3_10=$(create_task "Create ReportCard composite (src/forge/composites/ReportCard.tsx)" \
  -p P2 -l "phase-3,component,composite" \
  --deps "blocks:$P2_10" \
  -d "Create ReportCard composite. Props: title, period, metrics (array of {label,value,change}), status (draft/published), generatedAt, downloadUrl. Uses Typography, Badge, Button, StatCard-like metric rows. Shows report summary with action buttons.")
echo "P3-10: $P3_10  ReportCard"

P3_11=$(create_task "Update composites barrel export (src/forge/composites/index.ts)" \
  -p P2 -l "phase-3,barrel" \
  --deps "blocks:$P3_1,blocks:$P3_2,blocks:$P3_3,blocks:$P3_4,blocks:$P3_5,blocks:$P3_6,blocks:$P3_7,blocks:$P3_8,blocks:$P3_9,blocks:$P3_10" \
  -d "Create/update src/forge/composites/index.ts to export all 10 composites: StatCard, ProgramCard, AssessmentCard, FormField, SearchBar, ChatMessage, CommentThread, SkillCard, CountdownTimer, ReportCard. Also re-export from src/forge/index.ts.")
echo "P3-11: $P3_11  Composites barrel"

echo ""

# ──────────────────────────────────────────────────────────────
# PHASE 4: Forge Patterns + Layouts (16 tasks)
# ──────────────────────────────────────────────────────────────
echo "── Phase 4: Forge Patterns + Layouts ──"

P4_1=$(create_task "Create FullscreenLayout (src/forge/layouts/FullscreenLayout.tsx)" \
  -p P1 -l "phase-4,layout" \
  --deps "blocks:$P3_11" \
  -d "Create FullscreenLayout — a full-viewport layout with no chrome. Props: children, className, background. Uses 100vh/100vw, centers content. Used for pre-check, assessments, immersive flows. Styled with Forge tokens.")
echo "P4-1: $P4_1  FullscreenLayout"

P4_2=$(create_task "Create AuthLayout (src/forge/layouts/AuthLayout.tsx)" \
  -p P2 -l "phase-4,layout" \
  --deps "blocks:$P3_11" \
  -d "Create AuthLayout — split-screen layout with branding panel + form panel. Props: children, brandingContent, logo. Left panel shows branding/illustration, right panel shows auth form. Responsive: stacks on mobile. Uses Forge tokens.")
echo "P4-2: $P4_2  AuthLayout"

P4_3=$(create_task "Create Header pattern (src/forge/patterns/Header.tsx)" \
  -p P1 -l "phase-4,pattern" \
  --deps "blocks:$P3_11" \
  -d "Create Header pattern — top navigation bar. Props: title, user ({name, avatar, role}), onMenuClick, actions (ReactNode), notifications (count). Uses Avatar, Typography, Badge, Icon, Button. Fixed top, white bg, bottom border. Responsive.")
echo "P4-3: $P4_3  Header"

P4_4=$(create_task "Create Sidebar pattern (src/forge/patterns/Sidebar.tsx)" \
  -p P1 -l "phase-4,pattern" \
  --deps "blocks:$P3_11" \
  -d "Create Sidebar pattern — vertical navigation. Props: items (array of {key, label, icon, path, children}), activeKey, collapsed, onCollapse, onSelect. Uses Icon, Typography. Supports nested menu items. Collapsible with animation. Uses TanStack Router Link for navigation. Styled with Forge tokens.")
echo "P4-4: $P4_4  Sidebar"

P4_5=$(create_task "Create DashboardLayout (src/forge/layouts/DashboardLayout.tsx)" \
  -p P1 -l "phase-4,layout" \
  --deps "blocks:$P4_3,blocks:$P4_4" \
  -d "Create DashboardLayout composing Header + Sidebar + content area. Props: children, sidebarItems, user, title. Fixed header on top, sidebar on left, scrollable content area. Handles sidebar collapse state. Uses Ant Design Layout components internally. Main layout for all dashboard pages.")
echo "P4-5: $P4_5  DashboardLayout"

P4_6=$(create_task "Update layouts barrel export (src/forge/layouts/index.ts)" \
  -p P2 -l "phase-4,barrel" \
  --deps "blocks:$P4_1,blocks:$P4_2,blocks:$P4_5" \
  -d "Create/update src/forge/layouts/index.ts to export: FullscreenLayout, AuthLayout, DashboardLayout. Also export Header and Sidebar from patterns. Re-export from src/forge/index.ts.")
echo "P4-6: $P4_6  Layouts barrel"

P4_7=$(create_task "Create HeroBanner pattern (src/forge/patterns/HeroBanner.tsx)" \
  -p P2 -l "phase-4,pattern" \
  --deps "blocks:$P3_11" \
  -d "Create HeroBanner pattern. Props: title, subtitle, ctaText, ctaAction, backgroundImage, overlay. Full-width banner with gradient overlay, large typography, CTA button. Used on program instruction pages. Uses Typography, Button, Forge tokens.")
echo "P4-7: $P4_7  HeroBanner"

P4_8=$(create_task "Create ExerciseList pattern (src/forge/patterns/ExerciseList.tsx)" \
  -p P2 -l "phase-4,pattern" \
  --deps "blocks:$P3_11" \
  -d "Create ExerciseList pattern. Props: exercises (array of {id, title, type, duration, status, description}), onSelect, activeId. Renders scrollable list of exercise items with status indicators (locked/active/completed). Uses Typography, Icon, Badge. Supports grouping by section.")
echo "P4-8: $P4_8  ExerciseList"

P4_9=$(create_task "Create CenterGrid pattern (src/forge/patterns/CenterGrid.tsx)" \
  -p P2 -l "phase-4,pattern" \
  --deps "blocks:$P3_11" \
  -d "Create CenterGrid pattern. Props: items (array of center data), columns (1-4), onSelect, selectedId. Renders a responsive grid of center/location cards. Each card shows name, address, capacity, status. Uses Typography, Badge, Icon. Responsive columns.")
echo "P4-9: $P4_9  CenterGrid"

P4_10=$(create_task "Create SystemCheckPanel pattern (src/forge/patterns/SystemCheckPanel.tsx)" \
  -p P2 -l "phase-4,pattern" \
  --deps "blocks:$P3_11" \
  -d "Create SystemCheckPanel pattern. Props: checks (array of {name, status (pass/fail/pending/running), message}), onRetry, onContinue, allPassed. Shows pre-check items with animated status indicators. Uses Typography, Icon, Button, ProgressBar. Sequential check animation.")
echo "P4-10: $P4_10  SystemCheckPanel"

P4_11=$(create_task "Create ChatAssistant pattern (src/forge/patterns/ChatAssistant.tsx)" \
  -p P2 -l "phase-4,pattern" \
  --deps "blocks:$P3_11" \
  -d "Create ChatAssistant pattern. Props: messages (array), onSend, placeholder, isTyping, suggestions (quick replies). Renders chat interface with message list (ChatMessage composites), input area, typing indicator, suggestion chips. Auto-scrolls to bottom. Uses ChatMessage, Input, Button, Tag.")
echo "P4-11: $P4_11  ChatAssistant"

P4_12=$(create_task "Create ScheduleCalendar pattern (src/forge/patterns/ScheduleCalendar.tsx)" \
  -p P2 -l "phase-4,pattern" \
  --deps "blocks:$P3_11" \
  -d "Create ScheduleCalendar pattern. Props: events (array of {id, title, start, end, type, color}), onEventClick, onDateSelect, view (day/week/month), currentDate. Wraps Ant Design Calendar or builds custom grid. Shows events with color coding. Uses Typography, Badge, Tag. Responsive.")
echo "P4-12: $P4_12  ScheduleCalendar"

P4_13=$(create_task "Create InsightsGrid pattern (src/forge/patterns/InsightsGrid.tsx)" \
  -p P2 -l "phase-4,pattern" \
  --deps "blocks:$P3_11" \
  -d "Create InsightsGrid pattern. Props: stats (array of StatCard data), charts (array of chart configs), reports (array of ReportCard data), period. Renders dashboard-style grid with StatCards on top row, chart placeholders in middle, ReportCards below. Uses StatCard, ReportCard, Typography. Responsive grid.")
echo "P4-13: $P4_13  InsightsGrid"

P4_14=$(create_task "Create PlanEditor pattern (src/forge/patterns/PlanEditor.tsx)" \
  -p P2 -l "phase-4,pattern" \
  --deps "blocks:$P3_11" \
  -d "Create PlanEditor pattern. Props: goals (array of {id, title, skills, milestones, progress, status}), onGoalUpdate, onAddGoal, onDeleteGoal. Renders editable IDP (Individual Development Plan) with goal cards, skill tags, milestone checkboxes, progress bars. Uses Typography, Button, Input, Tag, ProgressBar, SkillCard.")
echo "P4-14: $P4_14  PlanEditor"

P4_15=$(create_task "Create IdpBuilder pattern (src/forge/patterns/IdpBuilder.tsx)" \
  -p P2 -l "phase-4,pattern" \
  --deps "blocks:$P4_11,blocks:$P4_14" \
  -d "Create IdpBuilder pattern composing ChatAssistant + PlanEditor. Props: goals, messages, onSend, onGoalUpdate. Split view: left panel is ChatAssistant for AI-guided plan building, right panel is PlanEditor showing current plan. Actions in chat update the plan. Responsive: stacks on mobile.")
echo "P4-15: $P4_15  IdpBuilder"

P4_16=$(create_task "Update patterns barrel export (src/forge/patterns/index.ts)" \
  -p P2 -l "phase-4,barrel" \
  --deps "blocks:$P4_7,blocks:$P4_8,blocks:$P4_9,blocks:$P4_10,blocks:$P4_11,blocks:$P4_12,blocks:$P4_13,blocks:$P4_14,blocks:$P4_15" \
  -d "Create/update src/forge/patterns/index.ts to export all patterns: HeroBanner, ExerciseList, CenterGrid, SystemCheckPanel, ChatAssistant, ScheduleCalendar, InsightsGrid, PlanEditor, IdpBuilder. Re-export from src/forge/index.ts.")
echo "P4-16: $P4_16  Patterns barrel"

echo ""

# ──────────────────────────────────────────────────────────────
# PHASE 5: Pages + Routing (18 tasks)
# ──────────────────────────────────────────────────────────────
echo "── Phase 5: Pages + Routing ──"

P5_1=$(create_task "Create TypeScript type definitions (src/types/)" \
  -p P1 -l "phase-5,types" \
  --deps "blocks:$P3_11" \
  -d "Create type definitions in src/types/: index.ts (barrel), program.ts (Program, Exercise, Module, ProgramStatus), assessment.ts (Assessment, Score, AssessmentType), user.ts (User, UserRole, UserProfile), report.ts (Report, Metric, ReportPeriod), idp.ts (Goal, Skill, Milestone, IdpPlan), schedule.ts (ScheduleEvent, EventType), center.ts (Center, CenterStatus). Extract types from prototype HTML data structures.")
echo "P5-1: $P5_1  Type definitions"

P5_2=$(create_task "Extract programs mock data (src/data/programs.ts)" \
  -p P1 -l "phase-5,data" \
  --deps "blocks:$P5_1" \
  -d "Create src/data/programs.ts with mock data extracted from prototype. Include: array of Program objects with modules, exercises, progress. Array of Center objects. Use types from src/types/. Export typed constants. Data should match what prototype HTML was rendering.")
echo "P5-2: $P5_2  Programs mock data"

P5_3=$(create_task "Extract reports mock data (src/data/reports.ts)" \
  -p P2 -l "phase-5,data" \
  --deps "blocks:$P5_1" \
  -d "Create src/data/reports.ts with mock report/insights data. Include: array of Report objects, metrics arrays, period data. Use types from src/types/. Export typed constants.")
echo "P5-3: $P5_3  Reports mock data"

P5_4=$(create_task "Extract IDP mock data (src/data/idp.ts)" \
  -p P2 -l "phase-5,data" \
  --deps "blocks:$P5_1" \
  -d "Create src/data/idp.ts with mock IDP (Individual Development Plan) data. Include: array of Goal objects with skills and milestones, suggested skills, AI conversation starters. Use types from src/types/. Export typed constants.")
echo "P5-4: $P5_4  IDP mock data"

P5_5=$(create_task "Extract scheduling mock data (src/data/scheduling.ts)" \
  -p P2 -l "phase-5,data" \
  --deps "blocks:$P5_1" \
  -d "Create src/data/scheduling.ts with mock scheduling data. Include: array of ScheduleEvent objects, time slots, instructor availability. Use types from src/types/. Export typed constants.")
echo "P5-5: $P5_5  Scheduling mock data"

P5_6=$(create_task "Create useThemeStore (src/stores/useThemeStore.ts)" \
  -p P1 -l "phase-5,store" \
  --deps "blocks:$P5_1" \
  -d "Create Zustand store for theme state. State: mode ('light'|'dark'), designMode (string), sidebarCollapsed (boolean). Actions: toggleMode, setDesignMode, toggleSidebar. Persist to localStorage. Initialize from system preference for dark mode.")
echo "P5-6: $P5_6  useThemeStore"

P5_7=$(create_task "Create useProgramStore (src/stores/useProgramStore.ts)" \
  -p P2 -l "phase-5,store" \
  --deps "blocks:$P5_2" \
  -d "Create Zustand store for program state. State: programs (array), activeProgram (id), activeProgramModule (id), filters. Actions: setActiveProgram, setFilters, updateProgress. Initialize with mock data from src/data/programs.ts.")
echo "P5-7: $P5_7  useProgramStore"

P5_8=$(create_task "Create useIdpStore (src/stores/useIdpStore.ts)" \
  -p P2 -l "phase-5,store" \
  --deps "blocks:$P5_4" \
  -d "Create Zustand store for IDP state. State: goals (array), chatMessages (array), selectedGoal (id). Actions: addGoal, updateGoal, deleteGoal, addMessage, setSelectedGoal. Initialize with mock data from src/data/idp.ts.")
echo "P5-8: $P5_8  useIdpStore"

P5_9=$(create_task "Create useScheduleStore (src/stores/useScheduleStore.ts)" \
  -p P2 -l "phase-5,store" \
  --deps "blocks:$P5_5" \
  -d "Create Zustand store for schedule state. State: events (array), view (day/week/month), currentDate. Actions: addEvent, updateEvent, deleteEvent, setView, setDate. Initialize with mock data from src/data/scheduling.ts.")
echo "P5-9: $P5_9  useScheduleStore"

P5_10=$(create_task "Update Dashboard page (src/routes/index.tsx)" \
  -p P1 -l "phase-5,page" \
  --deps "blocks:$P4_5,blocks:$P5_2,blocks:$P5_3" \
  -d "Rewrite src/routes/index.tsx to be the main dashboard. Uses DashboardLayout. Shows: welcome section with user greeting, StatCards row (programs count, completion rate, upcoming assessments, hours logged), active ProgramCards grid, recent ReportCards. Uses mock data from stores.")
echo "P5-10: $P5_10  Dashboard page"

P5_11=$(create_task "Create Program Instructions page (src/routes/programs/\$programId/index.tsx)" \
  -p P1 -l "phase-5,page" \
  --deps "blocks:$P4_5,blocks:$P4_7,blocks:$P5_2" \
  -d "Create program instructions/overview page. Uses DashboardLayout. Shows: HeroBanner with program title/description, program details (duration, modules, objectives), module list with progress. Route: /programs/\$programId. Uses useProgramStore.")
echo "P5-11: $P5_11  Program Instructions page"

P5_12=$(create_task "Create Program Tasks page (src/routes/programs/\$programId/tasks.tsx)" \
  -p P1 -l "phase-5,page" \
  --deps "blocks:$P4_5,blocks:$P4_8,blocks:$P4_9,blocks:$P5_2" \
  -d "Create program tasks/exercises page. Uses DashboardLayout. Shows: ExerciseList on left panel, exercise detail on right panel (or full width on mobile). CenterGrid for location selection when relevant. Route: /programs/\$programId/tasks. Uses useProgramStore.")
echo "P5-12: $P5_12  Program Tasks page"

P5_13=$(create_task "Create Pre-Check page (src/routes/programs/\$programId/precheck.tsx)" \
  -p P2 -l "phase-5,page" \
  --deps "blocks:$P4_1,blocks:$P4_10,blocks:$P5_2" \
  -d "Create pre-check page. Uses FullscreenLayout. Shows: SystemCheckPanel with checks (browser compat, network, permissions, equipment). Sequential animated checks. Pass/fail result with continue or retry. Route: /programs/\$programId/precheck.")
echo "P5-13: $P5_13  Pre-Check page"

P5_14=$(create_task "Create Center Detail page (src/routes/centers/\$centerId.tsx)" \
  -p P2 -l "phase-5,page" \
  --deps "blocks:$P4_5,blocks:$P4_8,blocks:$P5_2" \
  -d "Create center detail page. Uses DashboardLayout. Shows: center info (name, address, capacity, status), ExerciseList of available programs at this center, instructor info, schedule. Route: /centers/\$centerId. Uses mock data.")
echo "P5-14: $P5_14  Center Detail page"

P5_15=$(create_task "Create Development/IDP page (src/routes/development.tsx)" \
  -p P1 -l "phase-5,page" \
  --deps "blocks:$P4_5,blocks:$P4_15,blocks:$P5_4,blocks:$P5_8" \
  -d "Create IDP (Individual Development Plan) page. Uses DashboardLayout. Shows: IdpBuilder pattern (chat + plan editor split view). Uses useIdpStore for goals and chat state. Route: /development. AI chat sends/receives mock messages.")
echo "P5-15: $P5_15  Development/IDP page"

P5_16=$(create_task "Create Scheduling page (src/routes/scheduling.tsx)" \
  -p P2 -l "phase-5,page" \
  --deps "blocks:$P4_5,blocks:$P4_12,blocks:$P5_5,blocks:$P5_9" \
  -d "Create scheduling page. Uses DashboardLayout. Shows: ScheduleCalendar pattern with events, view switcher (day/week/month), event detail sidebar. Uses useScheduleStore. Route: /scheduling.")
echo "P5-16: $P5_16  Scheduling page"

P5_17=$(create_task "Create Insights page (src/routes/insights.tsx)" \
  -p P2 -l "phase-5,page" \
  --deps "blocks:$P4_5,blocks:$P4_13,blocks:$P5_3" \
  -d "Create insights/analytics page. Uses DashboardLayout. Shows: InsightsGrid pattern with stats, chart placeholders, report cards. Period selector (week/month/quarter/year). Uses mock report data. Route: /insights.")
echo "P5-17: $P5_17  Insights page"

P5_18=$(create_task "Update root layout with all providers (src/routes/__root.tsx)" \
  -p P1 -l "phase-5,layout" \
  --deps "blocks:$P5_6" \
  -d "Update src/routes/__root.tsx to include all providers and global state. Add: ThemeProvider using useThemeStore (applies dark/light class), ensure Ant Design ConfigProvider uses theme from store, add any global error boundary. Keep TanStack Router ScrollRestoration.")
echo "P5-18: $P5_18  Root layout update"

echo ""

# ──────────────────────────────────────────────────────────────
# PHASE 6: Features + Polish (15 tasks)
# ──────────────────────────────────────────────────────────────
echo "── Phase 6: Features + Polish ──"

P6_1=$(create_task "Implement dark mode in useThemeStore + CSS" \
  -p P2 -l "phase-6,feature,dark-mode" \
  --deps "blocks:$P5_6" \
  -d "Implement full dark mode support. Add dark variant CSS custom properties in Tailwind config or global CSS. useThemeStore toggleMode switches .dark class on html element. Ensure Ant Design ConfigProvider algorithm switches between defaultAlgorithm and darkAlgorithm. Test with existing components.")
echo "P6-1: $P6_1  Dark mode implementation"

P6_2=$(create_task "Add dark mode toggle to Header" \
  -p P2 -l "phase-6,feature,dark-mode" \
  --deps "blocks:$P6_1,blocks:$P4_3" \
  -d "Add a dark mode toggle button (sun/moon icon) to the Header pattern. Uses useThemeStore toggleMode action. Icon switches between Sun and Moon (lucide-react). Smooth transition animation on toggle. Place in header actions area.")
echo "P6-2: $P6_2  Dark mode toggle"

P6_3=$(create_task "Install i18n-js + create EN translations" \
  -p P2 -l "phase-6,feature,i18n" \
  --deps "blocks:$P5_10" \
  -d "Install i18n-js (bun add i18n-js). Create src/i18n/index.ts with i18n configuration. Create src/i18n/en.ts with English translations for all UI strings: navigation labels, page titles, button text, status labels, common phrases. Create useTranslation hook. Export from barrel.")
echo "P6-3: $P6_3  i18n setup + EN"

P6_4=$(create_task "Create HI (Hindi) translations" \
  -p P3 -l "phase-6,feature,i18n" \
  --deps "blocks:$P6_3" \
  -d "Create src/i18n/hi.ts with Hindi translations matching all keys from en.ts. Register in i18n config. Add language switcher UI to Header (dropdown with EN/HI options). Test switching between languages.")
echo "P6-4: $P6_4  Hindi translations"

P6_5=$(create_task "Integrate i18n into components (replace hardcoded text)" \
  -p P3 -l "phase-6,feature,i18n" \
  --deps "blocks:$P6_3" \
  -d "Replace all hardcoded English strings in components with i18n translation keys. Update: Header, Sidebar menu items, Dashboard page titles, all page headings, button labels, status text, placeholder text. Use useTranslation hook throughout.")
echo "P6-5: $P6_5  i18n integration"

P6_6=$(create_task "Create useMediaQuery hook (src/hooks/useMediaQuery.ts)" \
  -p P2 -l "phase-6,hook,responsive" \
  --deps "blocks:$P4_5" \
  -d "Create useMediaQuery hook. Accepts a CSS media query string, returns boolean. Include preset hooks: useIsMobile (max-width: 768px), useIsTablet (768-1024px), useIsDesktop (min-width: 1024px). Uses window.matchMedia with proper cleanup. SSR-safe.")
echo "P6-6: $P6_6  useMediaQuery hook"

P6_7=$(create_task "Make Sidebar responsive (collapse on mobile)" \
  -p P2 -l "phase-6,responsive" \
  --deps "blocks:$P6_6,blocks:$P4_4" \
  -d "Update Sidebar to auto-collapse on mobile. Use useIsMobile hook. On mobile: sidebar becomes a drawer (overlay), hamburger menu in Header toggles it, tap outside closes. On desktop: collapsible sidebar with toggle button. Animate transitions. Update DashboardLayout accordingly.")
echo "P6-7: $P6_7  Responsive sidebar"

P6_8=$(create_task "Make all grids responsive (1/2/3 columns)" \
  -p P2 -l "phase-6,responsive" \
  --deps "blocks:$P6_6" \
  -d "Update all grid layouts to be responsive: mobile (1 col), tablet (2 col), desktop (3-4 col). Update: Dashboard StatCards grid, ProgramCards grid, CenterGrid, InsightsGrid, ExerciseList. Use Tailwind responsive classes (sm:, md:, lg:) or useMediaQuery for complex cases.")
echo "P6-8: $P6_8  Responsive grids"

P6_9=$(create_task "Add ARIA labels to all interactive components" \
  -p P2 -l "phase-6,a11y" \
  --deps "blocks:$P5_10" \
  -d "Audit all interactive components and add proper ARIA attributes. Add: aria-label to icon-only buttons, aria-labelledby for form fields, role attributes where needed, aria-expanded for collapsible elements, aria-current for active nav items, aria-live for dynamic content (CountdownTimer, chat). Use semantic HTML elements (nav, main, aside, header).")
echo "P6-9: $P6_9  ARIA labels"

P6_10=$(create_task "Implement keyboard navigation + focus management" \
  -p P2 -l "phase-6,a11y" \
  --deps "blocks:$P5_10" \
  -d "Implement keyboard navigation: Tab order through all interactive elements, Enter/Space for buttons and links, Escape to close modals/drawers, Arrow keys in Sidebar menu and ExerciseList. Add visible focus indicators (focus-visible ring). Implement focus trap in modal/drawer components. Skip-to-content link.")
echo "P6-10: $P6_10  Keyboard navigation"

P6_11=$(create_task "Verify color contrast (WCAG AA)" \
  -p P3 -l "phase-6,a11y" \
  --deps "blocks:$P6_1" \
  -d "Audit all color combinations in both light and dark modes for WCAG AA compliance (4.5:1 for text, 3:1 for large text/UI). Check: text on backgrounds, badge text, button text, status colors, link colors. Fix any failing contrasts by adjusting Forge token colors. Document results.")
echo "P6-11: $P6_11  Color contrast audit"

P6_12=$(create_task "Add code splitting (lazy routes)" \
  -p P2 -l "phase-6,performance" \
  --deps "blocks:$P5_10" \
  -d "Implement route-based code splitting using React.lazy and TanStack Router lazy route loading. Lazy load all page routes: Dashboard, Program pages, Development, Scheduling, Insights, Discovery. Add loading fallback component (spinner or skeleton). Verify bundle splits in build output.")
echo "P6-12: $P6_12  Code splitting"

P6_13=$(create_task "Add React.memo to expensive components" \
  -p P3 -l "phase-6,performance" \
  --deps "blocks:$P5_10" \
  -d "Profile and identify expensive re-renders. Add React.memo to: StatCard, ProgramCard, AssessmentCard, ChatMessage, ExerciseList items, ScheduleCalendar cells. Add useMemo/useCallback where appropriate in stores and patterns. Verify with React DevTools Profiler.")
echo "P6-13: $P6_13  React.memo optimization"

P6_14=$(create_task "Create design mode token variants" \
  -p P3 -l "phase-6,feature,design-modes" \
  --deps "blocks:$P5_10" \
  -d "Create design mode token variants in src/forge/tokens/modes/. Each mode overrides base Forge tokens (colors, typography, spacing). Create 5 modes: default, vibrant, minimal, corporate, playful. Each is a token override file. useThemeStore.designMode selects active mode. Apply via CSS custom properties or dynamic token injection.")
echo "P6-14: $P6_14  Design mode tokens"

P6_15=$(create_task "Create 5 design mode pages (/modes/*)" \
  -p P3 -l "phase-6,feature,design-modes" \
  --deps "blocks:$P6_14" \
  -d "Create src/routes/modes/ with 5 pages, one per design mode. Each page demonstrates the mode's visual style by rendering key components (Button, StatCard, ProgramCard, Header preview). Include mode switcher UI. Route: /modes/default, /modes/vibrant, /modes/minimal, /modes/corporate, /modes/playful.")
echo "P6-15: $P6_15  Design mode pages"

echo ""
echo "=== All tasks created! ==="
echo ""
echo "Running stats..."
br stats
echo ""
echo "Ready tasks:"
br ready
