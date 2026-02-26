import { createFileRoute } from '@tanstack/react-router';

import { cn } from '@/forge/utils';
import { Title, Text, Overline } from '@/forge/primitives/Typography';
import { ProgressBar } from '@/forge/primitives/ProgressBar';
import { Illustration } from '@/forge/primitives/Illustration';
import { Icon } from '@/forge/primitives/Icon';
import { Button } from '@/forge/primitives/Button';
import { programList } from '@/data/programs';

import type { Program, Exercise } from '@/types/program';
import type { ItemStatus } from '@/types/common';
import type { IconName } from '@/forge/primitives/Icon';

export const Route = createFileRoute('/brilliant/programmes/mosaic')({
  component: MosaicProgrammesPage,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FlatExercise extends Exercise {
  programName: string;
  programAccent: string;
  programId: string;
  exerciseKind: 'sequential' | 'open';
  stepIndex?: number;
}

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------



function overallPct(programs: Program[]): number {
  if (programs.length === 0) return 0;
  return Math.round(programs.reduce((s, p) => s + p.pct, 0) / programs.length);
}

function totalExerciseCounts(programs: Program[]) {
  return programs.reduce(
    (acc, p) => {
      const all = [...p.seqExercises, ...p.openExercises];
      return {
        total: acc.total + all.length,
        complete: acc.complete + all.filter((e) => e.status === 'complete').length,
        inProgress: acc.inProgress + all.filter((e) => e.status === 'progress').length,
      };
    },
    { total: 0, complete: 0, inProgress: 0 },
  );
}

function nearestDeadline(programs: Program[]): Program | undefined {
  return [...programs].sort((a, b) => a.daysLeft - b.daysLeft)[0];
}

// ---------------------------------------------------------------------------
// Status metadata
// ---------------------------------------------------------------------------

const STATUS_META: Record<
  ItemStatus,
  { label: string; icon: IconName; badgeClass: string; dotClass: string }
> = {
  complete: {
    label: 'Completed',
    icon: 'CircleCheckBig',
    badgeClass: 'bg-success-light text-success-dark',
    dotClass: 'bg-success-dark',
  },
  progress: {
    label: 'In Progress',
    icon: 'CircleDot',
    badgeClass: 'bg-subject-code-light text-subject-code-dark',
    dotClass: 'bg-subject-code',
  },
  notstarted: {
    label: 'Not Started',
    icon: 'Circle',
    badgeClass: 'bg-surface-tertiary text-content-tertiary',
    dotClass: 'bg-border-muted',
  },
  locked: {
    label: 'Locked',
    icon: 'Lock',
    badgeClass: 'bg-surface-tertiary text-content-tertiary',
    dotClass: 'bg-border-subtle',
  },
};

// ---------------------------------------------------------------------------
// Stats banner
// ---------------------------------------------------------------------------

interface StatPillProps {
  value: string;
  label: string;
  icon: IconName;
  iconClass: string;
  accentBar: string;
}

function StatPill({ value, label, icon, iconClass, accentBar }: StatPillProps) {
  return (
    <div className="relative flex-1 min-w-[140px] rounded-2xl bg-surface-card shadow-soft overflow-hidden px-5 py-4">
      <div className={cn('absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl', accentBar)} />
      <div className="flex items-center justify-between mb-1.5">
        <Text size="xs" color="tertiary" weight="semibold" className="uppercase tracking-wider">
          {label}
        </Text>
        <Icon name={icon} size="sm" className={iconClass} />
      </div>
      <p className={cn('text-3xl font-bold leading-none tracking-tight tabular-nums', iconClass)}>
        {value}
      </p>
    </div>
  );
}

function StatsBanner({ programs }: { programs: Program[] }) {
  const pct = overallPct(programs);
  const counts = totalExerciseCounts(programs);
  const nearest = nearestDeadline(programs);
  const urgentDeadline = nearest && nearest.daysLeft <= 7;

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <StatPill
        value={`${pct}%`}
        label="Overall"
        icon="TrendingUp"
        iconClass="text-violet-600"
        accentBar="bg-gradient-to-r from-violet-500 to-purple-400"
      />
      <StatPill
        value={String(counts.complete)}
        label={`of ${counts.total} done`}
        icon="CircleCheckBig"
        iconClass="text-emerald-600"
        accentBar="bg-gradient-to-r from-emerald-500 to-teal-400"
      />
      <StatPill
        value={String(counts.inProgress)}
        label="In Progress"
        icon="CircleDot"
        iconClass="text-sky-600"
        accentBar="bg-gradient-to-r from-sky-500 to-blue-400"
      />
      <StatPill
        value={nearest ? `${nearest.daysLeft}d` : '—'}
        label={nearest ? `Due ${nearest.due}` : 'No deadline'}
        icon="Calendar"
        iconClass={urgentDeadline ? 'text-rose-600' : 'text-amber-600'}
        accentBar={
          urgentDeadline
            ? 'bg-gradient-to-r from-rose-500 to-red-400'
            : 'bg-gradient-to-r from-amber-400 to-orange-400'
        }
      />
      <StatPill
        value={String(programs.length)}
        label="Programmes"
        icon="BookOpen"
        iconClass="text-indigo-600"
        accentBar="bg-gradient-to-r from-indigo-500 to-indigo-400"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Programme tag pill (shown on each exercise card)
// ---------------------------------------------------------------------------

function ProgramTag({
  name,
  accentColor,
}: {
  name: string;
  accentColor: string;
}) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white leading-none"
      style={{ backgroundColor: accentColor + 'cc' }}
    >
      {name.length > 22 ? name.slice(0, 20) + '…' : name}
    </span>
  );
}

// ---------------------------------------------------------------------------
// TALL card — In-Progress exercises
// ---------------------------------------------------------------------------

interface TallCardProps {
  exercise: FlatExercise;
}

function TallCard({ exercise }: TallCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-3xl bg-surface-card shadow-soft border border-border-subtle overflow-hidden',
        'break-inside-avoid mb-4',
        'hover:shadow-hover-card transition-shadow duration-moderate cursor-pointer group',
      )}
    >
      {/* Colored top border */}
      <div
        className="h-1 w-full rounded-t-3xl"
        style={{ backgroundColor: exercise.programAccent }}
      />

      {/* Illustration panel — tall hero area */}
      <div
        className="relative flex items-center justify-center px-6 pt-8 pb-6 overflow-hidden"
        style={{ backgroundColor: exercise.programAccent + '12' }}
      >
        {/* Soft blob behind illustration */}
        <div
          className="absolute w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: exercise.programAccent }}
          aria-hidden="true"
        />

        <Illustration
          name={exercise.illustration ?? 'assessment'}
          size="xl"
          className="relative z-10 drop-shadow-lg group-hover:scale-105 transition-transform duration-moderate"
        />

        {/* Status badge overlay — top right */}
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
              STATUS_META[exercise.status].badgeClass,
            )}
          >
            <Icon name={STATUS_META[exercise.status].icon} size={11} />
            {STATUS_META[exercise.status].label}
          </span>
        </div>

        {/* Programme tag — top left */}
        <div className="absolute top-3 left-3">
          <ProgramTag name={exercise.programName} accentColor={exercise.programAccent} />
        </div>

        {/* Proctored badge */}
        {exercise.proctored && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning-light border border-amber-200">
            <Icon name="ShieldCheck" size={10} className="text-amber-700" strokeWidth={2.5} />
            <Text size="xs" weight="semibold" className="text-amber-700 leading-none">
              Proctored
            </Text>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pt-4 pb-5 flex flex-col gap-3">
        {/* Sequential step indicator */}
        {exercise.exerciseKind === 'sequential' && exercise.stepIndex !== undefined && (
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              style={{ backgroundColor: exercise.programAccent }}
            >
              {exercise.stepIndex}
            </div>
            <Text size="xs" color="tertiary" weight="medium">
              Step {exercise.stepIndex} · Sequential
            </Text>
          </div>
        )}

        <div>
          <Title
            level={4}
            weight="bold"
            color="primary"
            className="!mb-1 !text-base !leading-snug"
          >
            {exercise.name}
          </Title>
          <Text size="sm" color="secondary" className="block leading-relaxed">
            {exercise.desc}
          </Text>
        </div>

        {/* Progress bar */}
        {exercise.pct > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Text size="xs" color="tertiary" weight="medium">
                Progress
              </Text>
              <Text size="xs" weight="bold" color="primary" className="tabular-nums">
                {exercise.pct}%
              </Text>
            </div>
            <ProgressBar
              percent={exercise.pct}
              type="line"
              size="xs"
              showInfo={false}
              strokeColor={exercise.programAccent}
            />
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Icon name="Clock" size="sm" className="text-content-tertiary" />
            <Text size="xs" color="tertiary">
              {exercise.time}
            </Text>
          </div>
        </div>

        {/* CTA */}
        <Button
          variant="primary"
          size="sm"
          fullWidth
          className="!rounded-full !font-bold"
          subjectColor="code"
          icon={<Icon name="ArrowRight" size="sm" />}
        >
          Continue Exercise
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MEDIUM card — Completed exercises
// ---------------------------------------------------------------------------

interface MediumCardProps {
  exercise: FlatExercise;
}

function MediumCard({ exercise }: MediumCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-3xl bg-surface-card shadow-soft border border-border-subtle overflow-hidden',
        'break-inside-avoid mb-4',
        'hover:shadow-hover-card transition-shadow duration-moderate cursor-pointer group',
        'opacity-90 hover:opacity-100',
      )}
    >
      {/* Colored top border */}
      <div
        className="h-1 w-full rounded-t-3xl"
        style={{ backgroundColor: exercise.programAccent + '80' }}
      />

      {/* Illustration area — medium height, muted */}
      <div className="relative flex items-center justify-center p-6 bg-surface-tertiary/40">
        {/* Checkmark overlay circle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-success-light/80 flex items-center justify-center z-20 shadow-soft">
            <Icon name="CircleCheckBig" size="lg" className="text-success-dark" strokeWidth={1.5} />
          </div>
        </div>

        <Illustration
          name={exercise.illustration ?? 'assessment'}
          size="md"
          className="relative z-10 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-moderate"
        />

        {/* Programme tag */}
        <div className="absolute top-3 left-3">
          <ProgramTag name={exercise.programName} accentColor={exercise.programAccent + '80'} />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-3 pb-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <Title
            level={4}
            weight="semibold"
            color="secondary"
            className="!mb-0 !text-sm !leading-snug"
          >
            {exercise.name}
          </Title>
          {exercise.hasReport && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-success-light shrink-0">
              <Icon name="FileText" size={9} className="text-success-dark" strokeWidth={2.5} />
              <span className="text-success-dark text-[10px] font-semibold leading-none">
                Report
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Icon name="Clock" size="sm" className="text-content-tertiary" />
          <Text size="xs" color="tertiary">
            {exercise.time}
          </Text>
          <span className="inline-flex items-center gap-1 ml-auto px-2 py-0.5 rounded-full bg-success-light text-success-dark text-xs font-semibold">
            <Icon name="Check" size={10} strokeWidth={2.5} className="text-success-dark" />
            Done
          </span>
        </div>

        {exercise.hasReport && (
          <Button variant="ghost" size="sm" className="!rounded-full text-xs mt-1 self-start">
            View Report
          </Button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// COMPACT card — Not-started exercises
// ---------------------------------------------------------------------------

interface CompactCardProps {
  exercise: FlatExercise;
}

function CompactCard({ exercise }: CompactCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl bg-surface-card shadow-soft border border-border-subtle overflow-hidden',
        'break-inside-avoid mb-4',
        'hover:shadow-hover-card transition-shadow duration-moderate cursor-pointer group',
      )}
    >
      {/* Colored top border */}
      <div
        className="h-0.5 w-full rounded-t-2xl"
        style={{ backgroundColor: exercise.programAccent + '60' }}
      />

      <div className="flex items-center gap-3 px-4 py-3">
        {/* Small illustration */}
        <div
          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: exercise.programAccent + '12' }}
        >
          <Illustration
            name={exercise.illustration ?? 'assessment'}
            size="sm"
            className="group-hover:scale-110 transition-transform duration-moderate"
          />
        </div>

        {/* Name + time */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <ProgramTag name={exercise.programName} accentColor={exercise.programAccent} />
          </div>
          <Text size="sm" weight="semibold" color="primary" className="block leading-snug">
            {exercise.name}
          </Text>
          <div className="flex items-center gap-1 mt-0.5">
            <Icon name="Clock" size={11} className="text-content-tertiary" />
            <Text size="xs" color="tertiary">
              {exercise.time}
            </Text>
            {exercise.proctored && (
              <span className="ml-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-warning-light">
                <Icon
                  name="ShieldCheck"
                  size={9}
                  className="text-amber-700"
                  strokeWidth={2.5}
                />
                <span className="text-amber-700 text-[10px] font-semibold leading-none">
                  Proctored
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Start button */}
        <Button
          variant="secondary"
          size="sm"
          className="!rounded-full shrink-0 text-xs"
          icon={<Icon name="Play" size="sm" />}
        >
          Start
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MINIMAL card — Locked exercises
// ---------------------------------------------------------------------------

interface MinimalCardProps {
  exercise: FlatExercise;
}

function MinimalCard({ exercise }: MinimalCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl bg-surface-tertiary/60 border border-border-subtle overflow-hidden',
        'break-inside-avoid mb-4',
        'opacity-55',
      )}
    >
      {/* Subtle top line */}
      <div className="h-px w-full bg-border-subtle rounded-t-2xl" />

      <div className="flex items-center gap-3 px-4 py-3">
        {/* Lock icon */}
        <div className="shrink-0 w-8 h-8 rounded-lg bg-surface-primary/60 flex items-center justify-center">
          <Icon name="Lock" size="sm" className="text-content-tertiary" />
        </div>

        {/* Name + programme */}
        <div className="flex-1 min-w-0">
          <Text size="xs" color="tertiary" className="block mb-0.5 truncate">
            {exercise.programName}
          </Text>
          <Text size="sm" weight="medium" color="tertiary" className="block truncate leading-snug">
            {exercise.name}
          </Text>
        </div>

        {/* Time */}
        <div className="shrink-0 flex items-center gap-1">
          <Icon name="Clock" size={11} className="text-content-tertiary" />
          <Text size="xs" color="tertiary" className="tabular-nums">
            {exercise.time}
          </Text>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section header between programme groups
// ---------------------------------------------------------------------------

function SectionDivider({
  program,
  exerciseCount,
  completeCount,
}: {
  program: Program;
  exerciseCount: number;
  completeCount: number;
}) {
  return (
    <div className="break-inside-avoid mb-4">
      <div
        className="rounded-2xl px-5 py-4 flex items-center gap-3 relative overflow-hidden"
        style={{
          background: `linear-gradient(to right, ${program.accent}22 0%, ${program.accent}08 100%)`,
          borderLeft: `3px solid ${program.accent}`,
        }}
      >
        <div className="flex-1 min-w-0">
          <Overline color="tertiary" className="block mb-0.5">
            Programme
          </Overline>
          <Title
            level={4}
            weight="bold"
            color="primary"
            className="!mb-0 !text-sm !leading-snug"
          >
            {program.name}
          </Title>
          <Text size="xs" color="tertiary" className="block mt-0.5">
            {completeCount} of {exerciseCount} complete · Due {program.due}
          </Text>
        </div>

        <div className="shrink-0 flex flex-col items-center gap-1">
          <ProgressBar
            percent={program.pct}
            type="circle"
            size="xs"
            strokeColor={program.accent}
            trailColor="rgba(0,0,0,0.06)"
            showInfo={false}
          />
          <Text size="xs" color="tertiary" className="tabular-nums">
            {program.pct}%
          </Text>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exercise card dispatcher — picks the right card variant by status
// ---------------------------------------------------------------------------

function ExerciseCard({ exercise }: { exercise: FlatExercise }) {
  switch (exercise.status) {
    case 'progress':
      return <TallCard exercise={exercise} />;
    case 'complete':
      return <MediumCard exercise={exercise} />;
    case 'notstarted':
      return <CompactCard exercise={exercise} />;
    case 'locked':
      return <MinimalCard exercise={exercise} />;
  }
}

// ---------------------------------------------------------------------------
// Page header
// ---------------------------------------------------------------------------

function PageHeader() {
  return (
    <header className="mb-8">
      <div className="flex items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <Overline color="tertiary" className="block">
            Brilliant Assessment Platform
          </Overline>
          <div className="flex items-baseline gap-3">
            <Title level={2} weight="bold" color="primary" className="!mb-0 !text-3xl">
              Programmes
            </Title>
            <span className="text-content-tertiary text-base font-light select-none">/</span>
            <Title level={2} weight="normal" color="secondary" className="!mb-0 !text-2xl">
              Mosaic
            </Title>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end gap-0.5 border-l border-border-subtle pl-5 shrink-0">
          <Text size="xs" color="tertiary" weight="semibold" className="uppercase tracking-wider">
            2026 Assessment Cycle
          </Text>
          <Text size="xs" color="tertiary">
            {programList.length} programme{programList.length !== 1 ? 's' : ''} assigned
          </Text>
        </div>
      </div>

      {/* Thin decorative rule */}
      <div className="mt-5 h-px bg-gradient-to-r from-border-subtle via-border-muted to-transparent" />
    </header>
  );
}

// ---------------------------------------------------------------------------
// Mosaic grid — builds a flat, interleaved sequence of cards
// ---------------------------------------------------------------------------

/**
 * Build a flat card sequence that interleaves exercises from all programmes.
 * Section dividers are injected before each programme's first card so they
 * appear naturally in the column flow.
 */
function buildMosaicItems(
  programs: Program[],
): Array<
  | { kind: 'divider'; program: Program; exerciseCount: number; completeCount: number }
  | { kind: 'exercise'; exercise: FlatExercise }
> {
  const items: Array<
    | { kind: 'divider'; program: Program; exerciseCount: number; completeCount: number }
    | { kind: 'exercise'; exercise: FlatExercise }
  > = [];

  // Sort exercises within status priority: progress first, then notstarted, complete, locked.
  // Within programmes, we keep the order: sequential then open.
  const STATUS_ORDER: Record<ItemStatus, number> = {
    progress: 0,
    notstarted: 1,
    complete: 2,
    locked: 3,
  };

  for (const program of programs) {
    const allEx: FlatExercise[] = [];
    for (let i = 0; i < program.seqExercises.length; i++) {
      allEx.push({
        ...program.seqExercises[i],
        programName: program.name,
        programAccent: program.accent,
        programId: program.id,
        exerciseKind: 'sequential',
        stepIndex: i + 1,
      });
    }
    for (const ex of program.openExercises) {
      allEx.push({
        ...ex,
        programName: program.name,
        programAccent: program.accent,
        programId: program.id,
        exerciseKind: 'open',
      });
    }

    // Sort within each programme block by status importance
    allEx.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

    const completeCount = allEx.filter((e) => e.status === 'complete').length;

    items.push({
      kind: 'divider',
      program,
      exerciseCount: allEx.length,
      completeCount,
    });

    for (const ex of allEx) {
      items.push({ kind: 'exercise', exercise: ex });
    }
  }

  return items;
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

function MosaicProgrammesPage() {
  const items = buildMosaicItems(programList);

  return (
    <main className="max-w-[1200px] mx-auto px-5 py-8">
      <PageHeader />
      <StatsBanner programs={programList} />

      {/* Legend */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <Text size="xs" color="tertiary" weight="semibold" className="uppercase tracking-wider">
          Card size:
        </Text>
        {[
          { status: 'progress', label: 'In Progress — Tall', color: 'bg-subject-code' },
          { status: 'complete', label: 'Completed — Medium', color: 'bg-success-dark' },
          { status: 'notstarted', label: 'Not Started — Compact', color: 'bg-border-muted' },
          { status: 'locked', label: 'Locked — Minimal', color: 'bg-border-subtle' },
        ].map((item) => (
          <div key={item.status} className="flex items-center gap-1.5">
            <div className={cn('w-2 h-2 rounded-full', item.color)} />
            <Text size="xs" color="tertiary">
              {item.label}
            </Text>
          </div>
        ))}
      </div>

      {/* Masonry columns */}
      <div
        className={cn(
          'columns-1 sm:columns-2 lg:columns-3',
          'gap-4',
        )}
      >
        {items.map((item, idx) => {
          if (item.kind === 'divider') {
            return (
              <SectionDivider
                key={`divider-${item.program.id}`}
                program={item.program}
                exerciseCount={item.exerciseCount}
                completeCount={item.completeCount}
              />
            );
          }
          return <ExerciseCard key={`${item.exercise.programId}-${item.exercise.id}-${idx}`} exercise={item.exercise} />;
        })}
      </div>

      <div className="h-16" aria-hidden="true" />
    </main>
  );
}
