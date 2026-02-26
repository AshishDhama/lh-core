import { createFileRoute } from '@tanstack/react-router';

import { cn } from '@/forge/utils';
import { Title, Text, Overline } from '@/forge/primitives/Typography';
import { Icon } from '@/forge/primitives/Icon';
import { Illustration } from '@/forge/primitives/Illustration';
import { ProgressBar } from '@/forge/primitives/ProgressBar';
import { Button } from '@/forge/primitives/Button';
import { programList } from '@/data/programs';

import type { Exercise } from '@/types/program';

export const Route = createFileRoute('/brilliant/programmes/kanban')({
  component: KanbanProgrammesPage,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FlatExercise extends Exercise {
  programName: string;
  programAccent: string;
}

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------

function flattenExercises(): FlatExercise[] {
  const result: FlatExercise[] = [];
  for (const program of programList) {
    for (const ex of program.seqExercises) {
      result.push({ ...ex, programName: program.name, programAccent: program.accent });
    }
    for (const ex of program.openExercises) {
      result.push({ ...ex, programName: program.name, programAccent: program.accent });
    }
  }
  return result;
}

function overallStats(): {
  completedCount: number;
  totalCount: number;
  overallPct: number;
  nextDeadlineName: string;
  nextDeadlineDue: string;
  nextDeadlineDaysLeft: number;
} {
  const allEx = flattenExercises();
  const completedCount = allEx.filter((e) => e.status === 'complete').length;
  const totalCount = allEx.length;
  const overallPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const nearest = [...programList].sort((a, b) => a.daysLeft - b.daysLeft)[0];

  return {
    completedCount,
    totalCount,
    overallPct,
    nextDeadlineName: nearest?.name ?? '—',
    nextDeadlineDue: nearest?.due ?? '—',
    nextDeadlineDaysLeft: nearest?.daysLeft ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

// -- Stat pill --
function StatPill({
  icon,
  label,
  value,
  highlight,
}: {
  icon: Parameters<typeof Icon>[0]['name'];
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border',
        highlight
          ? 'bg-subject-code-light border-transparent'
          : 'bg-surface-card border-border-subtle shadow-soft',
      )}
    >
      <Icon
        name={icon}
        size="sm"
        className={highlight ? 'text-subject-code' : 'text-content-tertiary'}
      />
      <div className="leading-none">
        <div
          className={cn(
            'text-xs font-medium leading-none mb-0.5',
            highlight ? 'text-subject-code' : 'text-content-tertiary',
          )}
        >
          {label}
        </div>
        <div
          className={cn(
            'text-sm font-bold leading-none',
            highlight ? 'text-subject-code' : 'text-content-primary',
          )}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

// -- Programme tag badge --
function ProgramTag({ name, accent }: { name: string; accent: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold leading-none truncate max-w-[140px]"
      style={{ backgroundColor: accent + '18', color: accent }}
      title={name}
    >
      {name}
    </span>
  );
}

// -- In-Progress exercise card --
function InProgressCard({ exercise }: { exercise: FlatExercise }) {
  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 rounded-2xl bg-surface-card border border-border-subtle p-4',
        'shadow-soft hover:shadow-hover-card transition-shadow duration-moderate',
      )}
    >
      {/* Top row: illustration + meta */}
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-xl overflow-hidden">
          <Illustration name={exercise.illustration ?? 'assessment'} size="sm" />
        </div>
        <div className="min-w-0 flex-1">
          <Text size="sm" weight="semibold" color="primary" className="block leading-snug mb-0.5">
            {exercise.name}
          </Text>
          <ProgramTag name={exercise.programName} accent={exercise.programAccent} />
        </div>
        {exercise.proctored && (
          <Icon name="Shield" size="sm" className="text-warning-dark shrink-0 mt-0.5" />
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <Text size="xs" color="tertiary">
            {exercise.pct}% complete
          </Text>
          <div className="flex items-center gap-1">
            <Icon name="Clock" size={12} className="text-content-tertiary" />
            <Text size="xs" color="tertiary">
              {exercise.time}
            </Text>
          </div>
        </div>
        <ProgressBar
          percent={exercise.pct}
          type="line"
          size="xs"
          strokeColor="#8B5CF6"
          showInfo={false}
        />
      </div>

      {/* Action */}
      <Button variant="primary" size="sm" fullWidth>
        Continue
      </Button>
    </div>
  );
}

// -- Up-Next exercise card --
function UpNextCard({ exercise }: { exercise: FlatExercise }) {
  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 rounded-2xl bg-surface-card border border-border-subtle p-4',
        'shadow-soft hover:shadow-hover-card transition-shadow duration-moderate',
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-xl overflow-hidden">
          <Illustration name={exercise.illustration ?? 'assessment'} size="sm" />
        </div>
        <div className="min-w-0 flex-1">
          <Text size="sm" weight="semibold" color="primary" className="block leading-snug mb-0.5">
            {exercise.name}
          </Text>
          <ProgramTag name={exercise.programName} accent={exercise.programAccent} />
        </div>
        {exercise.proctored && (
          <Icon name="Shield" size="sm" className="text-warning-dark shrink-0 mt-0.5" />
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Icon name="Clock" size={12} className="text-content-tertiary" />
        <Text size="xs" color="tertiary">
          {exercise.time}
        </Text>
      </div>

      <Button variant="secondary" size="sm" fullWidth>
        Start
      </Button>
    </div>
  );
}

// -- Locked exercise card --
function LockedCard({ exercise }: { exercise: FlatExercise }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border border-border-subtle p-3',
        'bg-surface-tertiary opacity-60',
      )}
    >
      <div className="shrink-0 rounded-xl overflow-hidden grayscale opacity-60">
        <Illustration name={exercise.illustration ?? 'assessment'} size="sm" />
      </div>
      <div className="min-w-0 flex-1">
        <Text size="sm" weight="medium" color="tertiary" className="block leading-snug mb-0.5">
          {exercise.name}
        </Text>
        <ProgramTag name={exercise.programName} accent={exercise.programAccent} />
      </div>
      <Icon name="Lock" size="sm" className="text-content-tertiary shrink-0" />
    </div>
  );
}

// -- Completed exercise card --
function CompletedCard({ exercise }: { exercise: FlatExercise }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2.5 rounded-2xl border border-border-subtle p-4',
        'bg-surface-card shadow-soft',
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-xl overflow-hidden opacity-70">
          <Illustration name={exercise.illustration ?? 'assessment'} size="sm" />
        </div>
        <div className="min-w-0 flex-1">
          <Text size="sm" weight="semibold" color="secondary" className="block leading-snug mb-0.5">
            {exercise.name}
          </Text>
          <ProgramTag name={exercise.programName} accent={exercise.programAccent} />
        </div>
        <div className="shrink-0 mt-0.5">
          <Icon name="CircleCheck" size="md" className="text-success-dark" />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Icon name="Clock" size={12} className="text-content-tertiary" />
        <Text size="xs" color="tertiary">
          {exercise.time}
        </Text>
        {exercise.proctored && (
          <>
            <span className="w-1 h-1 rounded-full bg-content-tertiary" />
            <Icon name="Shield" size={12} className="text-content-tertiary" />
            <Text size="xs" color="tertiary">
              Proctored
            </Text>
          </>
        )}
      </div>

      {exercise.hasReport && (
        <Button variant="ghost" size="sm" fullWidth>
          View Report
        </Button>
      )}
    </div>
  );
}

// -- Column header --
function ColumnHeader({
  label,
  count,
  accentClass,
  dotClass,
}: {
  label: string;
  count: number;
  accentClass?: string;
  dotClass?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className={cn('w-2 h-2 rounded-full shrink-0', dotClass ?? 'bg-content-tertiary')} />
      <Overline color="tertiary" className="flex-1">
        {label}
      </Overline>
      <span
        className={cn(
          'inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-xs font-bold',
          accentClass ?? 'bg-surface-tertiary text-content-secondary',
        )}
      >
        {count}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

function KanbanProgrammesPage() {
  const allExercises = flattenExercises();
  const stats = overallStats();

  const inProgress = allExercises.filter((e) => e.status === 'progress');
  const notStarted = allExercises.filter((e) => e.status === 'notstarted');
  const locked = allExercises.filter((e) => e.status === 'locked');
  const completed = allExercises.filter((e) => e.status === 'complete');

  const urgentDaysLeft = stats.nextDeadlineDaysLeft <= 7;

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">

      {/* ----------------------------------------------------------------- */}
      {/* Top area: progress + stats                                         */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">

        {/* Circle + label */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative">
            <ProgressBar
              percent={stats.overallPct}
              type="circle"
              size="md"
              strokeColor="#8B5CF6"
              showInfo
              format={(pct) => (
                <span className="text-sm font-bold text-content-primary">{pct}%</span>
              )}
            />
          </div>
          <div>
            <Title level={2} weight="bold" color="primary" className="!mb-0.5 !text-xl">
              Your Progress
            </Title>
            <Text size="sm" color="secondary">
              {stats.completedCount} of {stats.totalCount} exercises complete
            </Text>
          </div>
        </div>

        {/* Divider (desktop) */}
        <div className="hidden sm:block w-px h-12 bg-border-subtle shrink-0" />

        {/* Stat pills */}
        <div className="flex flex-wrap gap-2.5">
          <StatPill
            icon="CircleCheck"
            label="Completed"
            value={`${stats.completedCount} / ${stats.totalCount}`}
          />
          <StatPill
            icon="Play"
            label="In Progress"
            value={String(inProgress.length)}
            highlight={inProgress.length > 0}
          />
          <StatPill
            icon={urgentDaysLeft ? 'CircleAlert' : 'Calendar'}
            label="Next Deadline"
            value={`${stats.nextDeadlineDue} · ${stats.nextDeadlineDaysLeft}d`}
            highlight={urgentDaysLeft}
          />
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Kanban columns                                                      */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">

        {/* ---- IN PROGRESS ---- */}
        <div
          className={cn(
            'rounded-3xl p-4 border',
            inProgress.length > 0
              ? 'bg-subject-code-light border-transparent'
              : 'bg-surface-card border-border-subtle shadow-soft',
          )}
        >
          <ColumnHeader
            label="In Progress"
            count={inProgress.length}
            dotClass="bg-subject-code"
            accentClass="bg-subject-code text-white"
          />

          {inProgress.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
              <Icon name="Inbox" size="lg" className="text-content-tertiary" />
              <Text size="sm" color="tertiary">
                Nothing in progress yet
              </Text>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {inProgress.map((ex) => (
                <InProgressCard key={`${ex.programName}-${ex.id}`} exercise={ex} />
              ))}
            </div>
          )}
        </div>

        {/* ---- UP NEXT ---- */}
        <div className="rounded-3xl bg-surface-card border border-border-subtle shadow-soft p-4">
          <ColumnHeader
            label="Up Next"
            count={notStarted.length + locked.length}
            dotClass="bg-content-tertiary"
            accentClass="bg-surface-tertiary text-content-secondary"
          />

          {notStarted.length === 0 && locked.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
              <Icon name="ListChecks" size="lg" className="text-content-tertiary" />
              <Text size="sm" color="tertiary">
                All exercises started or complete
              </Text>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Available (not started) */}
              {notStarted.map((ex) => (
                <UpNextCard key={`${ex.programName}-${ex.id}`} exercise={ex} />
              ))}

              {/* Locked divider */}
              {locked.length > 0 && notStarted.length > 0 && (
                <div className="flex items-center gap-2 py-1">
                  <div className="flex-1 h-px bg-border-subtle" />
                  <div className="flex items-center gap-1">
                    <Icon name="Lock" size={12} className="text-content-tertiary" />
                    <Text size="xs" color="tertiary">
                      Locked
                    </Text>
                  </div>
                  <div className="flex-1 h-px bg-border-subtle" />
                </div>
              )}

              {/* Locked cards */}
              {locked.map((ex) => (
                <LockedCard key={`${ex.programName}-${ex.id}`} exercise={ex} />
              ))}
            </div>
          )}
        </div>

        {/* ---- COMPLETED ---- */}
        <div className="rounded-3xl bg-surface-card border border-border-subtle shadow-soft p-4">
          <ColumnHeader
            label="Completed"
            count={completed.length}
            dotClass="bg-success-dark"
            accentClass="bg-success-light text-success-dark"
          />

          {completed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
              <Icon name="Trophy" size="lg" className="text-content-tertiary" />
              <Text size="sm" color="tertiary">
                Complete your first exercise to see it here
              </Text>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {completed.map((ex) => (
                <CompletedCard key={`${ex.programName}-${ex.id}`} exercise={ex} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-16" aria-hidden="true" />
    </main>
  );
}
