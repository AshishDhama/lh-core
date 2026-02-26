import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { cn } from '@/forge/utils';
import { Title, Text, Overline } from '@/forge/primitives/Typography';
import { Icon } from '@/forge/primitives/Icon';
import { Illustration } from '@/forge/primitives/Illustration';
import { ProgressBar } from '@/forge/primitives/ProgressBar';
import { Button } from '@/forge/primitives/Button';
import { programList } from '@/data/programs';
import type { Exercise, Program } from '@/types/program';
import type { ItemStatus } from '@/types/common';

export const Route = createFileRoute('/brilliant/programmes/detail')({
  component: AccordionDetailProgrammesPage,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function exerciseCounts(program: Program): { completed: number; total: number } {
  const all = [...program.seqExercises, ...program.openExercises];
  return {
    completed: all.filter((e) => e.status === 'complete').length,
    total: all.length,
  };
}

function totalCounts(programs: Program[]): { completed: number; total: number } {
  return programs.reduce(
    (acc, p) => {
      const c = exerciseCounts(p);
      return { completed: acc.completed + c.completed, total: acc.total + c.total };
    },
    { completed: 0, total: 0 },
  );
}

function nearestDeadline(programs: Program[]): Program | undefined {
  return [...programs].sort((a, b) => a.daysLeft - b.daysLeft)[0];
}

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

interface StatusMeta {
  label: string;
  badgeBg: string;
  badgeText: string;
  actionLabel: string;
  actionVariant: 'primary' | 'secondary' | 'ghost';
  actionDisabled: boolean;
}

function statusMeta(status: ItemStatus, pct: number): StatusMeta {
  switch (status) {
    case 'complete':
      return {
        label: 'Completed',
        badgeBg: 'bg-success-light',
        badgeText: 'text-success-dark',
        actionLabel: 'Review',
        actionVariant: 'ghost',
        actionDisabled: false,
      };
    case 'progress':
      return {
        label: `${pct}% done`,
        badgeBg: 'bg-subject-code-light',
        badgeText: 'text-subject-code-dark',
        actionLabel: 'Continue',
        actionVariant: 'primary',
        actionDisabled: false,
      };
    case 'notstarted':
      return {
        label: 'Not started',
        badgeBg: 'bg-surface-tertiary',
        badgeText: 'text-content-secondary',
        actionLabel: 'Start',
        actionVariant: 'secondary',
        actionDisabled: false,
      };
    case 'locked':
      return {
        label: 'Locked',
        badgeBg: 'bg-surface-tertiary',
        badgeText: 'text-content-tertiary',
        actionLabel: 'Locked',
        actionVariant: 'ghost',
        actionDisabled: true,
      };
  }
}

// ---------------------------------------------------------------------------
// Stat Pill — compact hero stat chip
// ---------------------------------------------------------------------------

function StatPill({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-surface-card border border-border-subtle shadow-soft">
      <div className="w-7 h-7 rounded-xl bg-subject-code-light flex items-center justify-center shrink-0">
        <Icon name={icon as 'BookOpen'} size="sm" className="text-subject-code-dark" />
      </div>
      <div>
        <Text size="xs" color="tertiary" className="block leading-none mb-0.5">
          {label}
        </Text>
        <Text size="sm" weight="semibold" color="primary" className="leading-none">
          {value}
        </Text>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exercise Row
// ---------------------------------------------------------------------------

function ExerciseRow({
  exercise,
  stepNumber,
  isLast,
}: {
  exercise: Exercise;
  stepNumber?: number;
  isLast: boolean;
}) {
  const meta = statusMeta(exercise.status, exercise.pct);
  const isLocked = exercise.status === 'locked';

  return (
    <div
      className={cn(
        'flex items-center gap-4 px-5 py-4 transition-colors duration-fast',
        !isLast && 'border-b border-border-subtle',
        isLocked ? 'opacity-50' : 'hover:bg-surface-warm',
      )}
    >
      {/* Step number or open indicator */}
      <div className="shrink-0 w-7 flex justify-center">
        {stepNumber !== undefined ? (
          <div
            className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold leading-none',
              exercise.status === 'complete'
                ? 'bg-success-light text-success-dark'
                : exercise.status === 'progress'
                  ? 'bg-subject-code text-white'
                  : 'bg-surface-tertiary text-content-tertiary',
            )}
          >
            {exercise.status === 'complete' ? (
              <Icon name="Check" size={10} strokeWidth={3} />
            ) : (
              stepNumber
            )}
          </div>
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-content-tertiary mt-0.5" />
        )}
      </div>

      {/* Illustration */}
      <div className="shrink-0">
        <Illustration
          name={exercise.illustration ?? 'assessment'}
          size="sm"
          className={isLocked ? 'grayscale' : undefined}
        />
      </div>

      {/* Name + description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Text size="sm" weight="semibold" color={isLocked ? 'tertiary' : 'primary'}>
            {exercise.name}
          </Text>
          {exercise.proctored && !isLocked && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-warning-light border border-amber-200">
              <Icon name="ShieldCheck" size={10} className="text-amber-700" strokeWidth={2.5} />
              <Text size="xs" weight="semibold" className="text-amber-700 leading-none">
                Proctored
              </Text>
            </span>
          )}
          {exercise.hasReport && !isLocked && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-navy-50 border border-navy-100">
              <Icon name="FileText" size={10} className="text-navy-600" strokeWidth={2.5} />
              <Text size="xs" weight="semibold" className="text-navy-600 leading-none">
                Report
              </Text>
            </span>
          )}
        </div>
        <Text size="xs" color="tertiary" className="mt-0.5 leading-snug block">
          {exercise.desc}
        </Text>
      </div>

      {/* Time */}
      <div className="shrink-0 hidden sm:flex items-center gap-1 text-content-tertiary w-20 justify-end">
        <Icon name="Clock" size={12} className="text-content-tertiary shrink-0" />
        <Text size="xs" color="tertiary" className="tabular-nums">
          {exercise.time}
        </Text>
      </div>

      {/* Progress bar (only meaningful for in-progress) */}
      <div className="shrink-0 w-20 hidden md:block">
        {exercise.status === 'progress' ? (
          <ProgressBar
            percent={exercise.pct}
            type="line"
            size="xs"
            showInfo={false}
            strokeColor="var(--color-subject-code, #8B5CF6)"
          />
        ) : exercise.status === 'complete' ? (
          <ProgressBar
            percent={100}
            type="line"
            size="xs"
            showInfo={false}
            strokeColor="var(--color-success, #22c55e)"
          />
        ) : (
          <div className="h-1 rounded-full bg-border-subtle" />
        )}
      </div>

      {/* Status badge */}
      <div className="shrink-0 hidden sm:block w-24 text-right">
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
            meta.badgeBg,
            meta.badgeText,
          )}
        >
          {meta.label}
        </span>
      </div>

      {/* Action */}
      <div className="shrink-0">
        {isLocked ? (
          <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-surface-tertiary">
            <Icon name="Lock" size="sm" className="text-content-tertiary" />
          </div>
        ) : (
          <Button
            variant={meta.actionVariant}
            size="sm"
            disabled={meta.actionDisabled}
            className="text-xs"
          >
            {meta.actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Programme Accordion Item
// ---------------------------------------------------------------------------

function ProgrammeAccordionItem({
  program,
  isOpen,
  onToggle,
}: {
  program: Program;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const counts = exerciseCounts(program);
  const hasOpen = program.openExercises.length > 0;

  const headerStatusColor =
    program.status === 'complete'
      ? 'text-success-dark'
      : program.status === 'progress'
        ? 'text-subject-code-dark'
        : 'text-content-tertiary';

  const headerStatusLabel =
    program.status === 'complete'
      ? 'Complete'
      : program.status === 'progress'
        ? 'In Progress'
        : 'Not Started';

  return (
    <div
      className={cn(
        'rounded-3xl border transition-shadow duration-moderate overflow-hidden',
        isOpen
          ? 'border-border-muted shadow-hover-card'
          : 'border-border-subtle shadow-soft hover:shadow-hover-card',
        'bg-surface-card',
      )}
    >
      {/* Collapsed / header row */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'w-full flex items-center gap-4 px-6 py-5 text-left transition-colors duration-fast',
          isOpen ? 'bg-surface-warm' : 'hover:bg-surface-warm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-subject-code focus-visible:ring-inset',
        )}
        aria-expanded={isOpen}
      >
        {/* Accent dot / icon */}
        <div
          className="shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: program.accent + '18' }}
        >
          <Icon name="BookOpen" size="md" style={{ color: program.accent }} />
        </div>

        {/* Programme name + desc */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Title level={4} weight="semibold" color="primary" className="!mb-0 !text-base leading-tight">
              {program.name}
            </Title>
            <span className={cn('text-xs font-semibold', headerStatusColor)}>
              {headerStatusLabel}
            </span>
          </div>
          <Text size="xs" color="tertiary" className="mt-0.5 block truncate max-w-lg">
            {program.desc}
          </Text>
        </div>

        {/* Exercise count summary */}
        <div className="shrink-0 hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-tertiary">
          <Icon name="ListChecks" size="sm" className="text-content-tertiary" />
          <Text size="xs" weight="semibold" color="secondary">
            {counts.completed}/{counts.total} done
          </Text>
        </div>

        {/* Deadline chip */}
        <div className="shrink-0 hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-subtle bg-surface-primary">
          <Icon name="Calendar" size={12} className="text-content-tertiary" />
          <Text size="xs" weight="medium" color="secondary">
            Due {program.due}
          </Text>
          <span
            className={cn(
              'ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold',
              program.daysLeft <= 7
                ? 'bg-error-light text-error-dark'
                : 'bg-surface-tertiary text-content-secondary',
            )}
          >
            {program.daysLeft}d
          </span>
        </div>

        {/* Progress bar (compact) */}
        <div className="shrink-0 w-28 hidden sm:block">
          <ProgressBar
            percent={program.pct}
            type="line"
            size="xs"
            showInfo={false}
            strokeColor={program.accent}
          />
          <Text size="xs" color="tertiary" className="mt-1 text-right block tabular-nums">
            {program.pct}%
          </Text>
        </div>

        {/* Chevron */}
        <div className="shrink-0 ml-2">
          <Icon
            name="ChevronDown"
            size="md"
            className={cn(
              'text-content-tertiary transition-transform duration-moderate',
              isOpen && 'rotate-180',
            )}
          />
        </div>
      </button>

      {/* Expanded panel */}
      {isOpen && (
        <div className="border-t border-border-subtle">
          {/* Sequential exercises */}
          {program.seqExercises.length > 0 && (
            <div>
              {/* Section label */}
              <div className="flex items-center gap-2 px-5 py-3 bg-surface-tertiary/40 border-b border-border-subtle">
                <div className="w-5 h-5 rounded-full bg-subject-code flex items-center justify-center shrink-0">
                  <Icon name="ArrowRight" size={10} className="text-white" strokeWidth={2.5} />
                </div>
                <Overline color="secondary" className="!text-xs">
                  Sequential Path — complete in order
                </Overline>
                <div className="ml-auto flex items-center gap-1 text-content-tertiary">
                  <Icon name="Lock" size={10} className="text-content-tertiary" />
                  <Text size="xs" color="tertiary">
                    Unlocks step by step
                  </Text>
                </div>
              </div>

              {/* Exercise rows */}
              <div>
                {program.seqExercises.map((ex, i) => (
                  <ExerciseRow
                    key={ex.id}
                    exercise={ex}
                    stepNumber={i + 1}
                    isLast={
                      i === program.seqExercises.length - 1 && !hasOpen
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Open / anytime exercises */}
          {hasOpen && (
            <div>
              {/* Section label */}
              <div
                className={cn(
                  'flex items-center gap-2 px-5 py-3 bg-surface-tertiary/40 border-b border-border-subtle',
                  program.seqExercises.length > 0 && 'border-t border-border-subtle',
                )}
              >
                <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
                  <Icon name="Shuffle" size={10} className="text-white" strokeWidth={2.5} />
                </div>
                <Overline color="secondary" className="!text-xs">
                  Complete Anytime — flexible order
                </Overline>
                <div className="ml-auto">
                  <Text size="xs" color="tertiary">
                    {program.openExercises.filter((e) => e.status === 'complete').length}/
                    {program.openExercises.length} completed
                  </Text>
                </div>
              </div>

              {/* Open exercise rows */}
              <div>
                {program.openExercises.map((ex, i) => (
                  <ExerciseRow
                    key={ex.id}
                    exercise={ex}
                    stepNumber={undefined}
                    isLast={i === program.openExercises.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Footer CTA row */}
          <div className="flex items-center justify-between px-5 py-5 border-t border-border-subtle bg-surface-warm/50">
            <div className="flex items-center gap-3">
              <ProgressBar
                percent={program.pct}
                type="circle"
                size="xs"
                showInfo={false}
                strokeColor={program.accent}
                className="shrink-0"
              />
              <div>
                <Text size="xs" weight="semibold" color="primary">
                  {program.pct}% complete
                </Text>
                <Text size="xs" color="tertiary" className="block">
                  {counts.completed} of {counts.total} exercises done
                </Text>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                View Instructions
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Icon name="Play" size="sm" />}
              >
                {program.status === 'complete' ? 'Review Programme' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------

function ProgrammesHero() {
  const totals = totalCounts(programList);
  const nearest = nearestDeadline(programList);
  const overallPct =
    programList.length > 0
      ? Math.round(
          programList.reduce((sum, p) => sum + p.pct, 0) / programList.length,
        )
      : 0;

  return (
    <div className="mb-10">
      <Overline className="mb-2 block" color="tertiary">
        YOUR PROGRAMMES
      </Overline>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <Title level={2} weight="bold" color="primary" className="!mb-1">
            Assessments & Exercises
          </Title>
          <Text size="sm" color="secondary">
            Track your progress across all assigned programmes below.
          </Text>
        </div>
        {/* Overall ring */}
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-surface-card border border-border-subtle shadow-soft">
          <ProgressBar
            percent={overallPct}
            type="circle"
            size="sm"
            showInfo={false}
            strokeColor="#8B5CF6"
          />
          <div>
            <Text size="xs" color="tertiary" className="block">
              Overall progress
            </Text>
            <Text size="lg" weight="bold" color="primary" className="leading-none tabular-nums">
              {overallPct}%
            </Text>
          </div>
        </div>
      </div>

      {/* Stat row */}
      <div className="flex flex-wrap gap-3">
        <StatPill
          icon="BookOpen"
          label="Total exercises"
          value={totals.total}
        />
        <StatPill
          icon="CircleCheck"
          label="Completed"
          value={totals.completed}
        />
        <StatPill
          icon="Hourglass"
          label="Remaining"
          value={totals.total - totals.completed}
        />
        {nearest && (
          <StatPill
            icon="Calendar"
            label="Next deadline"
            value={`${nearest.due} · ${nearest.daysLeft}d left`}
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function AccordionDetailProgrammesPage() {
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set(programList.length > 0 ? [programList[0].id] : []),
  );

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <main className="max-w-[960px] mx-auto px-5 py-10">
      <ProgrammesHero />

      {/* Accordion list */}
      <div className="space-y-4">
        {programList.map((program) => (
          <ProgrammeAccordionItem
            key={program.id}
            program={program}
            isOpen={openIds.has(program.id)}
            onToggle={() => toggle(program.id)}
          />
        ))}
      </div>

      {/* Footer spacer */}
      <div className="h-16" aria-hidden="true" />
    </main>
  );
}
