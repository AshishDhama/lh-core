import { createFileRoute } from '@tanstack/react-router';

import { cn } from '@/forge/utils';
import { Title, Text, Overline } from '@/forge/primitives/Typography';
import { ProgressBar } from '@/forge/primitives/ProgressBar';
import { Icon } from '@/forge/primitives/Icon';
import { Button } from '@/forge/primitives/Button';
import { programList } from '@/data/programs';

import type { Program, Exercise } from '@/types/program';
import type { IconName } from '@/forge/primitives/Icon';

export const Route = createFileRoute('/brilliant/programmes/checklist')({
  component: ChecklistProgrammesPage,
});

// ---------------------------------------------------------------------------
// Helpers
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
      };
    },
    { total: 0, complete: 0 },
  );
}

// ---------------------------------------------------------------------------
// Overall progress banner (full-width at top)
// ---------------------------------------------------------------------------

function OverallProgressBanner({ programs }: { programs: Program[] }) {
  const pct = overallPct(programs);
  const { total, complete } = totalExerciseCounts(programs);
  const remaining = total - complete;

  return (
    <div className="mb-8 px-6 py-5 rounded-2xl bg-surface-card border border-border-subtle shadow-soft">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-baseline gap-3">
          <Title level={4} weight="bold" color="primary" className="!mb-0 !text-base">
            All Programmes
          </Title>
          <Text size="sm" color="tertiary">
            {complete} of {total} exercises done
          </Text>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {remaining > 0 ? (
            <Text size="sm" weight="semibold" color="secondary">
              {remaining} remaining
            </Text>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-light">
              <Icon name="CircleCheckBig" size="sm" className="text-success-dark" />
              <Text size="sm" weight="semibold" className="text-success-dark">
                All complete
              </Text>
            </span>
          )}
          <Text size="lg" weight="bold" color="primary" className="tabular-nums min-w-[3.5rem] text-right">
            {pct}%
          </Text>
        </div>
      </div>
      <ProgressBar
        percent={pct}
        type="line"
        size="sm"
        strokeColor="#8B5CF6"
        trailColor="rgba(0,0,0,0.06)"
        showInfo={false}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exercise checklist row
// ---------------------------------------------------------------------------

interface ExerciseRowProps {
  exercise: Exercise;
  stepNumber?: number; // present for sequential exercises
  isLast: boolean;
  accentColor: string;
  showConnector: boolean;
}

function ExerciseRow({ exercise, stepNumber, isLast, accentColor, showConnector }: ExerciseRowProps) {
  const isComplete = exercise.status === 'complete';
  const isInProgress = exercise.status === 'progress';
  const isLocked = exercise.status === 'locked';
  // Icon per state
  const statusIcon: IconName = isComplete
    ? 'CircleCheck'
    : isInProgress
      ? 'CircleDot'
      : isLocked
        ? 'Lock'
        : 'Circle';

  const iconColorClass = isComplete
    ? 'text-success-dark'
    : isInProgress
      ? 'text-subject-code'
      : isLocked
        ? 'text-content-tertiary'
        : 'text-border-muted';

  return (
    <div className="relative flex items-stretch gap-0">
      {/* Left gutter: connector line + icon/bullet */}
      <div className="flex flex-col items-center" style={{ width: 40, flexShrink: 0 }}>
        {/* Connector line above (not for first item — caller handles) */}
        {showConnector && (
          <div
            className="w-px flex-1 min-h-0"
            style={{
              backgroundColor: isComplete ? '#86efac' : '#e2e8f0',
              minHeight: 0,
              height: 12,
            }}
          />
        )}

        {/* Status icon / step badge */}
        {stepNumber !== undefined ? (
          /* Sequential: numbered badge */
          <div className="relative shrink-0 z-10">
            {isComplete ? (
              <Icon
                name="CircleCheck"
                size={20}
                className="text-success-dark"
                strokeWidth={2}
              />
            ) : isLocked ? (
              <div className="w-5 h-5 rounded-full bg-surface-tertiary border border-border-muted flex items-center justify-center">
                <Icon name="Lock" size={10} className="text-content-tertiary" strokeWidth={2.5} />
              </div>
            ) : isInProgress ? (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: accentColor, fontSize: 10, fontWeight: 700, lineHeight: 1 }}
              >
                {stepNumber}
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-border-muted bg-surface-primary flex items-center justify-center">
                <span className="text-[9px] font-bold text-content-tertiary leading-none">{stepNumber}</span>
              </div>
            )}
          </div>
        ) : (
          /* Open exercise: status icon */
          <div className="shrink-0 z-10">
            <Icon name={statusIcon} size={20} className={iconColorClass} strokeWidth={isComplete ? 2 : 1.75} />
          </div>
        )}

        {/* Connector line below */}
        {!isLast && (
          <div
            className="w-px flex-1"
            style={{
              backgroundColor: isComplete ? '#86efac' : '#e2e8f0',
              minHeight: 12,
            }}
          />
        )}
      </div>

      {/* Row content */}
      <div
        className={cn(
          'flex-1 flex items-center gap-3 px-3 py-4 rounded-xl min-w-0',
          'transition-colors duration-fast',
          isLocked
            ? 'opacity-40 cursor-not-allowed'
            : isComplete
              ? 'opacity-60 hover:opacity-80 cursor-pointer'
              : 'hover:bg-surface-warm cursor-pointer',
          !isLast && 'mb-1',
        )}
      >
        {/* Text block */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Exercise name */}
            <span
              className={cn(
                'text-sm font-medium leading-snug',
                isComplete
                  ? 'line-through text-content-tertiary'
                  : isLocked
                    ? 'text-content-tertiary'
                    : isInProgress
                      ? 'text-content-primary font-semibold'
                      : 'text-content-primary',
              )}
            >
              {exercise.name}
            </span>

            {/* Proctored badge */}
            {exercise.proctored && !isLocked && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 shrink-0">
                <Icon name="Shield" size={10} className="text-amber-600" strokeWidth={2.5} />
                <span className="text-[10px] font-semibold text-amber-700 leading-none">Proctored</span>
              </span>
            )}

            {/* Report badge */}
            {exercise.hasReport && isComplete && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-success-light shrink-0">
                <Icon name="FileText" size={10} className="text-success-dark" strokeWidth={2.5} />
                <span className="text-[10px] font-semibold text-success-dark leading-none">Report</span>
              </span>
            )}
          </div>

          {/* In-progress: inline progress bar */}
          {isInProgress && (
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 max-w-[180px]">
                <ProgressBar
                  percent={exercise.pct}
                  type="line"
                  size="xs"
                  strokeColor={accentColor}
                  trailColor="rgba(0,0,0,0.07)"
                  showInfo={false}
                />
              </div>
              <Text size="xs" weight="semibold" color="secondary" className="tabular-nums shrink-0">
                {exercise.pct}%
              </Text>
              <Button
                variant="ghost"
                size="sm"
                className="!h-auto !py-0.5 !px-2 !text-xs !rounded-full !font-semibold !text-subject-code-dark"
              >
                Continue →
              </Button>
            </div>
          )}

          {/* Locked: hint */}
          {isLocked && (
            <Text size="xs" color="tertiary" className="block mt-0.5 italic">
              Complete previous to unlock
            </Text>
          )}
        </div>

        {/* Right: time estimate (not for in-progress, already has progress bar) */}
        {!isInProgress && !isLocked && (
          <div className="shrink-0 flex items-center gap-1 text-content-tertiary">
            <Icon name="Clock" size={12} className="text-content-tertiary" />
            <Text size="xs" color="tertiary" className="tabular-nums whitespace-nowrap">
              {exercise.time}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Programme section header
// ---------------------------------------------------------------------------

interface ProgramHeaderProps {
  program: Program;
  completeCount: number;
  totalCount: number;
}

function ProgramHeader({ program, completeCount, totalCount }: ProgramHeaderProps) {
  const isUrgent = program.daysLeft <= 7;
  const isAllDone = program.status === 'complete';

  return (
    <div className="flex items-center gap-4 mb-1">
      {/* Circular progress ring */}
      <div className="shrink-0">
        <ProgressBar
          percent={program.pct}
          type="circle"
          size="xs"
          strokeColor={isAllDone ? '#15803d' : program.accent}
          trailColor="rgba(0,0,0,0.07)"
          showInfo={false}
        />
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Title level={4} weight="semibold" color="primary" className="!mb-0 !text-sm leading-snug">
            {program.name}
          </Title>
          {isAllDone && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-light shrink-0">
              <Icon name="CircleCheckBig" size={11} className="text-success-dark" />
              <span className="text-[11px] font-semibold text-success-dark leading-none">Done</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
          <Text size="xs" color="tertiary">
            {completeCount} / {totalCount} done
          </Text>
          <div className="flex items-center gap-1">
            <Icon
              name="Calendar"
              size={11}
              className={isUrgent ? 'text-error-dark' : 'text-content-tertiary'}
            />
            <Text size="xs" color={isUrgent ? 'error' : 'tertiary'} weight={isUrgent ? 'semibold' : 'normal'}>
              {program.due}
            </Text>
            {program.daysLeft > 0 && (
              <span
                className={cn(
                  'px-1.5 py-px rounded-full text-[10px] font-bold leading-none',
                  isUrgent
                    ? 'bg-error-light text-error-dark'
                    : 'bg-surface-tertiary text-content-tertiary',
                )}
              >
                {program.daysLeft}d
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action button */}
      {!isAllDone && (
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 !rounded-full !text-xs !py-1 !h-auto !font-semibold !text-subject-code-dark"
          icon={<Icon name="ArrowRight" size={12} />}
        >
          Open
        </Button>
      )}
      {isAllDone && (
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 !rounded-full !text-xs !py-1 !h-auto !font-semibold !text-success-dark"
        >
          View Report
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subsection divider (between sequential / open groups)
// ---------------------------------------------------------------------------

function GroupLabel({ label, count, doneCount }: { label: string; count: number; doneCount: number }) {
  return (
    <div className="flex items-center gap-2 pl-10 mb-1 mt-3">
      <Overline color="tertiary" className="!text-[10px]">
        {label}
      </Overline>
      <span className="text-[10px] font-medium text-content-tertiary tabular-nums">
        {doneCount}/{count}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Programme checklist section
// ---------------------------------------------------------------------------

interface ProgrammeSectionProps {
  program: Program;
}

function ProgrammeSection({ program }: ProgrammeSectionProps) {
  const allEx = [...program.seqExercises, ...program.openExercises];
  const completeCount = allEx.filter((e) => e.status === 'complete').length;
  const hasSeq = program.seqExercises.length > 0;
  const hasOpen = program.openExercises.length > 0;

  const seqDone = program.seqExercises.filter((e) => e.status === 'complete').length;
  const openDone = program.openExercises.filter((e) => e.status === 'complete').length;

  return (
    <section
      className={cn(
        'rounded-2xl bg-surface-card border border-border-subtle shadow-soft',
        'transition-all duration-moderate overflow-hidden',
      )}
    >
      {/* Accent left border */}
      <div className="flex">
        <div
          className="w-1 rounded-l-2xl shrink-0"
          style={{
            backgroundColor:
              program.status === 'complete' ? '#15803d' : program.accent,
          }}
        />

        <div className="flex-1 px-5 py-5">
          {/* Programme header */}
          <ProgramHeader
            program={program}
            completeCount={completeCount}
            totalCount={allEx.length}
          />

          {/* Sequential exercises */}
          {hasSeq && (
            <>
              {hasOpen && (
                <GroupLabel
                  label="Sequential — complete in order"
                  count={program.seqExercises.length}
                  doneCount={seqDone}
                />
              )}
              <div className="mt-3">
                {program.seqExercises.map((ex, i) => (
                  <ExerciseRow
                    key={ex.id}
                    exercise={ex}
                    stepNumber={i + 1}
                    isLast={i === program.seqExercises.length - 1 && !hasOpen}
                    accentColor={program.accent}
                    showConnector={i > 0}
                  />
                ))}
              </div>
            </>
          )}

          {/* Open exercises */}
          {hasOpen && (
            <>
              <GroupLabel
                label="Complete anytime"
                count={program.openExercises.length}
                doneCount={openDone}
              />
              <div className="mt-3">
                {program.openExercises.map((ex, i) => (
                  <ExerciseRow
                    key={ex.id}
                    exercise={ex}
                    stepNumber={undefined}
                    isLast={i === program.openExercises.length - 1}
                    accentColor={program.accent}
                    showConnector={false}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page header
// ---------------------------------------------------------------------------

function PageHeader() {
  const pct = overallPct(programList);
  const { total, complete } = totalExerciseCounts(programList);

  return (
    <header className="mb-6">
      <Overline color="tertiary" className="block mb-1">
        2026 Assessment Cycle
      </Overline>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <Title level={2} weight="bold" color="primary" className="!mb-0">
          My Exercises
        </Title>
        <Text size="sm" color="tertiary">
          {complete} of {total} complete &middot; {pct}% overall
        </Text>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function ChecklistProgrammesPage() {
  return (
    <main className="max-w-[720px] mx-auto px-5 py-8">
      <PageHeader />

      {/* Global progress bar */}
      <OverallProgressBanner programs={programList} />

      {/* Programme sections stacked */}
      <div className="flex flex-col gap-4">
        {programList.map((program) => (
          <ProgrammeSection key={program.id} program={program} />
        ))}
      </div>

      <div className="h-16" aria-hidden="true" />
    </main>
  );
}
