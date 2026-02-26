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

export const Route = createFileRoute('/brilliant/programmes/')({
  component: CatalogueGridProgrammesPage,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function overallProgress(programs: Program[]): number {
  if (programs.length === 0) return 0;
  return Math.round(programs.reduce((s, p) => s + p.pct, 0) / programs.length);
}

function countsByStatus(programs: Program[]) {
  const total = programs.length;
  const complete = programs.filter((p) => p.status === 'complete').length;
  const inProgress = programs.filter((p) => p.status === 'progress').length;
  return { total, complete, inProgress };
}

function nearestDeadline(programs: Program[]): Program | undefined {
  return [...programs].sort((a, b) => a.daysLeft - b.daysLeft)[0];
}

function exerciseCounts(exercises: Exercise[]) {
  const complete = exercises.filter((e) => e.status === 'complete').length;
  return { complete, total: exercises.length };
}

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

type StatusConfig = {
  label: string;
  icon: IconName;
  chipClass: string;
};

const STATUS_CONFIG: Record<ItemStatus, StatusConfig> = {
  complete: {
    label: 'Completed',
    icon: 'CircleCheckBig',
    chipClass: 'bg-success-light text-success-dark',
  },
  progress: {
    label: 'In Progress',
    icon: 'CircleDot',
    chipClass: 'bg-subject-code-light text-subject-code-dark',
  },
  notstarted: {
    label: 'Not Started',
    icon: 'Circle',
    chipClass: 'bg-surface-tertiary text-content-tertiary',
  },
  locked: {
    label: 'Locked',
    icon: 'Lock',
    chipClass: 'bg-surface-tertiary text-content-tertiary',
  },
};

// ---------------------------------------------------------------------------
// Page-level summary stats
// ---------------------------------------------------------------------------

interface SummaryStatsProps {
  programs: Program[];
}

function SummaryStats({ programs }: SummaryStatsProps) {
  const { total, complete, inProgress } = countsByStatus(programs);
  const overall = overallProgress(programs);
  const nearest = nearestDeadline(programs);
  const isUrgent = nearest && nearest.daysLeft <= 7;

  const stats: { icon: IconName; label: string; value: string; sub?: string; urgent?: boolean }[] = [
    {
      icon: 'BookOpen',
      label: 'Total Programmes',
      value: String(total),
      sub: `${complete} completed · ${inProgress} in progress`,
    },
    {
      icon: 'TrendingUp',
      label: 'Overall Progress',
      value: `${overall}%`,
      sub: 'across all programmes',
    },
    {
      icon: 'Calendar',
      label: 'Next Deadline',
      value: nearest ? nearest.due : '—',
      sub: nearest ? `${nearest.daysLeft} days · ${nearest.name}` : 'No upcoming deadlines',
      urgent: !!isUrgent,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-3xl bg-surface-card shadow-soft px-6 py-5 flex items-start gap-4"
        >
          <div
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-2xl shrink-0',
              s.urgent ? 'bg-error-light' : 'bg-subject-code-light',
            )}
          >
            <Icon
              name={s.icon}
              size="md"
              className={s.urgent ? 'text-error-dark' : 'text-subject-code-dark'}
            />
          </div>
          <div className="min-w-0">
            <Overline color="tertiary" className="block mb-0.5">
              {s.label}
            </Overline>
            <Text
              size="xl"
              weight="bold"
              color={s.urgent ? 'error' : 'primary'}
              className="block leading-tight"
            >
              {s.value}
            </Text>
            {s.sub && (
              <Text size="xs" color="tertiary" className="block mt-0.5 truncate">
                {s.sub}
              </Text>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exercise card
// ---------------------------------------------------------------------------

interface ExerciseCardProps {
  exercise: Exercise;
  seqIndex?: number; // present for sequential exercises
}

function ExerciseCard({ exercise, seqIndex }: ExerciseCardProps) {
  const config = STATUS_CONFIG[exercise.status];
  const isLocked = exercise.status === 'locked';
  const isComplete = exercise.status === 'complete';
  const isInProgress = exercise.status === 'progress';
  const isActionable = !isLocked;

  const illustrationBgClass = isComplete
    ? 'bg-success-light/30'
    : isInProgress
      ? 'bg-subject-code-light'
      : isLocked
        ? 'bg-surface-tertiary/40'
        : 'bg-surface-tertiary/50';

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-3xl bg-surface-card shadow-soft overflow-hidden',
        'transition-all duration-moderate ease-in-out',
        isActionable && 'hover:shadow-hover-card hover:-translate-y-px cursor-pointer',
        isLocked && 'opacity-60 cursor-not-allowed',
      )}
    >
      {/* Illustration zone */}
      <div
        className={cn(
          'relative flex items-center justify-center py-6',
          illustrationBgClass,
        )}
      >
        <Illustration
          name={exercise.illustration ?? 'assessment'}
          size="sm"
          className={cn(isLocked && 'opacity-40')}
        />

        {/* Status chip — top right */}
        <div
          className={cn(
            'absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
            config.chipClass,
          )}
        >
          <Icon name={config.icon} size={11} />
          <span>{config.label}</span>
        </div>

        {/* Sequential step badge — top left */}
        {seqIndex !== undefined && (
          <div className="absolute top-3 left-3 flex items-center justify-center w-5 h-5 rounded-full bg-surface-card/90 shadow-soft">
            <Text size="xs" weight="bold" color="secondary">
              {seqIndex}
            </Text>
          </div>
        )}

        {/* Proctored shield */}
        {exercise.proctored && (
          <div
            className="absolute bottom-3 left-3 flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-surface-card/90 shadow-soft"
            title="Proctored exercise"
          >
            <Icon name="ShieldCheck" size={11} className="text-subject-code-dark" />
            <Text size="xs" weight="semibold" color="secondary">
              Proctored
            </Text>
          </div>
        )}

        {/* Report available badge */}
        {exercise.hasReport && isComplete && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-surface-card/90 shadow-soft">
            <Icon name="FileText" size={11} className="text-success-dark" />
            <Text size="xs" weight="semibold" color="success">
              Report
            </Text>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <Text
          size="sm"
          weight="semibold"
          color={isLocked ? 'tertiary' : 'primary'}
          className="block leading-snug"
        >
          {exercise.name}
        </Text>

        <Text size="xs" color="secondary" className="block line-clamp-2 leading-relaxed">
          {exercise.desc}
        </Text>

        {/* Footer row */}
        <div className="mt-auto pt-2 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 shrink-0">
            <Icon name="Clock" size={12} className="text-content-tertiary" />
            <Text size="xs" color="tertiary">
              {exercise.time}
            </Text>
          </div>

          {isInProgress && exercise.pct > 0 && (
            <div className="flex-1 min-w-[60px]">
              <ProgressBar
                percent={exercise.pct}
                type="line"
                size="xs"
                showInfo={false}
                strokeColor="var(--color-subject-code, #8B5CF6)"
              />
            </div>
          )}

          {isInProgress && exercise.pct > 0 && (
            <Text size="xs" weight="bold" color="primary" className="shrink-0">
              {exercise.pct}%
            </Text>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Programme section
// ---------------------------------------------------------------------------

interface ProgrammeSectionProps {
  program: Program;
}

function ProgrammeSection({ program }: ProgrammeSectionProps) {
  const allEx = [...program.seqExercises, ...program.openExercises];
  const counts = exerciseCounts(allEx);
  const isUrgent = program.daysLeft <= 7;
  const hasSeq = program.seqExercises.length > 0;
  const hasOpen = program.openExercises.length > 0;
  const statusConfig = STATUS_CONFIG[program.status];

  return (
    <section className="rounded-3xl bg-surface-warm border border-border-subtle shadow-soft overflow-hidden">
      {/* Programme header */}
      <div
        className="px-7 pt-6 pb-5 flex flex-col gap-4 border-b border-border-subtle"
        style={{ borderLeftWidth: 4, borderLeftColor: program.accent }}
      >
        <div className="flex items-start gap-4 flex-wrap">
          {/* Accent icon */}
          <div
            className="flex items-center justify-center w-11 h-11 rounded-2xl shrink-0"
            style={{ backgroundColor: program.accent + '1A' }}
          >
            <Icon name="BookOpen" size="md" style={{ color: program.accent }} />
          </div>

          {/* Name + desc */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Title level={3} weight="bold" color="primary" className="!mb-0">
                {program.name}
              </Title>
              <div
                className={cn(
                  'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0',
                  statusConfig.chipClass,
                )}
              >
                <Icon name={statusConfig.icon} size={11} />
                <span>{statusConfig.label}</span>
              </div>
            </div>
            <Text size="sm" color="secondary" className="block leading-relaxed">
              {program.desc}
            </Text>
          </div>

          {/* Right meta */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <Icon
                name="Calendar"
                size="sm"
                className={isUrgent ? 'text-error-dark' : 'text-content-tertiary'}
              />
              <Text
                size="sm"
                weight="semibold"
                color={isUrgent ? 'error' : 'secondary'}
              >
                {program.due}
              </Text>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-bold',
                  isUrgent
                    ? 'bg-error-light text-error-dark'
                    : 'bg-surface-tertiary text-content-tertiary',
                )}
              >
                {program.daysLeft}d
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="ListChecks" size="sm" className="text-content-tertiary" />
              <Text size="xs" color="tertiary" weight="medium">
                {counts.complete} / {counts.total} exercises
              </Text>
            </div>
          </div>
        </div>

        {/* Programme progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar
              percent={program.pct}
              type="line"
              size="sm"
              strokeColor={program.accent}
              showInfo={false}
            />
          </div>
          <Text size="sm" weight="bold" color="primary" className="shrink-0 w-10 text-right">
            {program.pct}%
          </Text>
          {program.status !== 'complete' && (
            <Button
              variant="primary"
              size="sm"
              subjectColor="code"
              className="!rounded-full shrink-0"
            >
              Continue
            </Button>
          )}
          {program.status === 'complete' && (
            <Button
              variant="secondary"
              size="sm"
              className="!rounded-full shrink-0"
            >
              View Report
            </Button>
          )}
        </div>
      </div>

      {/* Exercise grids */}
      <div className="px-7 py-6 space-y-7">
        {/* Sequential exercises */}
        {hasSeq && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-subject-code-light border border-subject-code/20">
                <Icon name="ArrowRight" size={12} className="text-subject-code-dark" />
                <Overline color="tertiary" className="!text-subject-code-dark">
                  Sequential — complete in order
                </Overline>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {program.seqExercises.map((ex, i) => (
                <ExerciseCard key={ex.id} exercise={ex} seqIndex={i + 1} />
              ))}
            </div>
          </div>
        )}

        {/* Open exercises */}
        {hasOpen && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-tertiary border border-border-muted">
                <Icon name="Shuffle" size={12} className="text-content-tertiary" />
                <Overline color="tertiary">Open — complete anytime</Overline>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {program.openExercises.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function CatalogueGridProgrammesPage() {
  const nearest = nearestDeadline(programList);
  const overall = overallProgress(programList);
  const { complete, total } = countsByStatus(programList);

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Page header */}
      <header className="mb-8">
        <Overline className="block mb-2">Your Assessment Catalogue</Overline>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <Title level={2} weight="bold" color="primary" className="!mb-1">
              Programmes &amp; Exercises
            </Title>
            <Text size="sm" color="secondary">
              {complete} of {total} programmes complete · {overall}% overall
              {nearest && (
                <>
                  {' '}·{' '}
                  <Text
                    size="sm"
                    weight="semibold"
                    color={nearest.daysLeft <= 7 ? 'error' : 'secondary'}
                  >
                    Next deadline: {nearest.due} ({nearest.daysLeft}d)
                  </Text>
                </>
              )}
            </Text>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-subject-code-light border border-subject-code/30 flex items-center justify-center">
                <Icon name="ArrowRight" size={9} className="text-subject-code-dark" />
              </div>
              <Text size="xs" color="tertiary">Sequential</Text>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-surface-tertiary border border-border-muted flex items-center justify-center">
                <Icon name="Shuffle" size={9} className="text-content-tertiary" />
              </div>
              <Text size="xs" color="tertiary">Open</Text>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="ShieldCheck" size={14} className="text-subject-code-dark" />
              <Text size="xs" color="tertiary">Proctored</Text>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="FileText" size={14} className="text-success-dark" />
              <Text size="xs" color="tertiary">Report available</Text>
            </div>
          </div>
        </div>
      </header>

      {/* Summary stat cards */}
      <SummaryStats programs={programList} />

      {/* Programme sections */}
      <div className="space-y-8">
        {programList.map((program) => (
          <ProgrammeSection key={program.id} program={program} />
        ))}
      </div>

      <div className="h-16" aria-hidden="true" />
    </main>
  );
}
