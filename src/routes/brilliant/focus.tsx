import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { cn } from '@/forge/utils';
import { Title, Text, Overline } from '@/forge/primitives/Typography';
import { ProgressBar } from '@/forge/primitives/ProgressBar';
import { Illustration } from '@/forge/primitives/Illustration';
import { Icon } from '@/forge/primitives/Icon';
import { Button } from '@/forge/primitives/Button';
import { programList } from '@/data/programs';
import type { Exercise, Program } from '@/types/program';
import type { ItemStatus } from '@/types/common';

export const Route = createFileRoute('/brilliant/focus')({
  component: FocusHomePage,
});

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------

interface FocusExercise extends Exercise {
  programName: string;
  programAccent: string;
  programDaysLeft: number;
  programDue: string;
  totalInProgram: number;
  indexInProgram: number;
}

function getAllOrderedExercises(): Array<FocusExercise> {
  const result: FocusExercise[] = [];

  for (const prog of programList) {
    const all = [...prog.seqExercises, ...prog.openExercises];
    all.forEach((ex, i) => {
      result.push({
        ...ex,
        programName: prog.name,
        programAccent: prog.accent,
        programDaysLeft: prog.daysLeft,
        programDue: prog.due,
        totalInProgram: all.length,
        indexInProgram: i,
      });
    });
  }

  return result;
}

function findFocusExercise(all: FocusExercise[]): FocusExercise | null {
  // First priority: in-progress
  const inProgress = all.find((e) => e.status === 'progress');
  if (inProgress) return inProgress;
  // Second: not started
  const notStarted = all.find((e) => e.status === 'notstarted');
  if (notStarted) return notStarted;
  return null;
}

function getQueueExercises(
  all: FocusExercise[],
  focus: FocusExercise,
): FocusExercise[] {
  const focusIdx = all.findIndex((e) => e.id === focus.id && e.programName === focus.programName);
  return all
    .slice(focusIdx + 1)
    .filter((e) => e.status !== 'complete' && e.status !== 'locked')
    .slice(0, 3);
}

function getOverallStats(): { completed: number; total: number } {
  let completed = 0;
  let total = 0;
  for (const p of programList) {
    const all = [...p.seqExercises, ...p.openExercises];
    completed += all.filter((e) => e.status === 'complete').length;
    total += all.length;
  }
  return { completed, total };
}

function getNearestDeadline(): Program | undefined {
  return [...programList]
    .filter((p) => p.status !== 'complete')
    .sort((a, b) => a.daysLeft - b.daysLeft)[0];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const STATUS_CTA: Record<ItemStatus, string> = {
  progress: 'Continue',
  notstarted: 'Start',
  complete: 'Review',
  locked: 'Locked',
};

const ILLUSTRATION_FALLBACK = 'assessment';

function ProctoredBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-tertiary border border-border-subtle">
      <Icon name="Video" size={12} className="text-content-tertiary" />
      <Text size="xs" weight="medium" color="tertiary">
        Proctored
      </Text>
    </div>
  );
}

function TimeBadge({ time }: { time: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-tertiary border border-border-subtle">
      <Icon name="Clock" size={12} className="text-content-tertiary" />
      <Text size="xs" weight="medium" color="tertiary">
        {time}
      </Text>
    </div>
  );
}

function PositionDots({
  total,
  current,
  accent,
}: {
  total: number;
  current: number;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full transition-all duration-moderate',
            i === current
              ? 'w-5 h-2'
              : i < current
                ? 'w-2 h-2 opacity-60'
                : 'w-2 h-2 opacity-20',
          )}
          style={{
            backgroundColor: i <= current ? accent : 'var(--color-slate-400, #94a3b8)',
          }}
        />
      ))}
    </div>
  );
}

function QueuePill({ exercise, isNext }: { exercise: FocusExercise; isNext: boolean }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors duration-fast',
        isNext
          ? 'bg-surface-card border-border-muted shadow-soft'
          : 'bg-surface-primary border-border-subtle',
      )}
    >
      {exercise.illustration ? (
        <Illustration
          name={exercise.illustration}
          size="sm"
          className="w-5 h-5 object-contain opacity-80"
        />
      ) : (
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: exercise.programAccent + 'aa' }}
        />
      )}
      <Text
        size="xs"
        weight={isNext ? 'semibold' : 'normal'}
        color={isNext ? 'secondary' : 'tertiary'}
        truncate
      >
        {exercise.name}
      </Text>
      {exercise.time !== '—' && (
        <Text size="xs" color="tertiary">
          · {exercise.time}
        </Text>
      )}
    </div>
  );
}

function AllDoneState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-20 h-20 rounded-full bg-success-light flex items-center justify-center mb-6">
        <Icon name="Award" size="xl" className="text-success-dark" />
      </div>
      <Title level={2} weight="bold" color="primary" align="center" className="!mb-2">
        All done!
      </Title>
      <Text size="base" color="secondary" align="center" className="max-w-xs">
        You've completed every exercise across all programmes. Outstanding work.
      </Text>
      <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-success-light">
        <Icon name="CircleCheckBig" size="sm" className="text-success-dark" />
        <Text size="sm" weight="semibold" color="success">
          Journey complete
        </Text>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

function FocusHomePage() {
  const [expanded, setExpanded] = useState(false);

  const allExercises = getAllOrderedExercises();
  const focusExercise = findFocusExercise(allExercises);
  const { completed, total } = getOverallStats();
  const nearest = getNearestDeadline();

  // All done
  if (!focusExercise) {
    return (
      <main className="max-w-[640px] mx-auto px-6 py-16">
        <AllDoneState />
      </main>
    );
  }

  const queue = getQueueExercises(allExercises, focusExercise);
  const ctaLabel = STATUS_CTA[focusExercise.status];
  const illustrationName =
    (focusExercise.illustration ?? ILLUSTRATION_FALLBACK) as Parameters<typeof Illustration>[0]['name'];
  const isInProgress = focusExercise.status === 'progress';

  return (
    <main className="max-w-[640px] mx-auto px-6 py-12 flex flex-col items-center gap-0">

      {/* ── Ambient programme label ── */}
      <div className="flex items-center gap-2 mb-10">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: focusExercise.programAccent }}
        />
        <Overline color="tertiary">{focusExercise.programName}</Overline>
      </div>

      {/* ── Hero focus card ── */}
      <div
        className={cn(
          'w-full rounded-4xl bg-surface-card shadow-soft border border-border-subtle',
          'flex flex-col items-center px-8 pt-10 pb-8 gap-0',
          'transition-shadow duration-moderate hover:shadow-hover-card',
        )}
      >
        {/* Illustration */}
        <div className="relative mb-6">
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: focusExercise.programAccent }}
          />
          <Illustration
            name={illustrationName}
            size="xl"
            className="relative z-10 drop-shadow-sm"
          />
        </div>

        {/* Exercise name */}
        <Title
          level={2}
          weight="bold"
          color="primary"
          align="center"
          className="!mb-1 !leading-snug"
        >
          {focusExercise.name}
        </Title>

        {/* Description */}
        <Text size="sm" color="secondary" align="center" className="max-w-xs mb-5 leading-relaxed">
          {focusExercise.desc}
        </Text>

        {/* Meta badges */}
        <div className="flex items-center gap-2 mb-6 flex-wrap justify-center">
          {focusExercise.time !== '—' && <TimeBadge time={focusExercise.time} />}
          {focusExercise.proctored && <ProctoredBadge />}
        </div>

        {/* In-progress mini bar */}
        {isInProgress && focusExercise.pct > 0 && (
          <div className="w-full mb-6 px-2">
            <div className="flex items-center justify-between mb-1.5">
              <Text size="xs" color="tertiary" weight="medium">
                Progress
              </Text>
              <Text size="xs" weight="semibold" color="secondary">
                {focusExercise.pct}%
              </Text>
            </div>
            <ProgressBar
              percent={focusExercise.pct}
              type="line"
              size="xs"
              strokeColor={focusExercise.programAccent}
              showInfo={false}
            />
          </div>
        )}

        {/* CTA button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          subjectColor="code"
          icon={<Icon name={isInProgress ? 'Play' : 'ArrowRight'} size="sm" />}
          iconPlacement="end"
          className="rounded-2xl h-14 text-base font-semibold"
        >
          {ctaLabel}
        </Button>

        {/* Position dots */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <PositionDots
            total={focusExercise.totalInProgram}
            current={focusExercise.indexInProgram}
            accent={focusExercise.programAccent}
          />
          <Text size="xs" color="tertiary">
            {focusExercise.indexInProgram + 1} of {focusExercise.totalInProgram} in this programme
          </Text>
        </div>
      </div>

      {/* ── Queue section ── */}
      {queue.length > 0 && (
        <div className="w-full mt-8 flex flex-col items-center gap-3">
          <button
            onClick={() => setExpanded((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 text-content-tertiary hover:text-content-secondary',
              'transition-colors duration-fast cursor-pointer bg-transparent border-none p-0',
            )}
            aria-expanded={expanded}
          >
            <Text size="xs" weight="medium" color="tertiary">
              Up next
            </Text>
            <Icon
              name="ChevronDown"
              size={14}
              className={cn(
                'text-content-tertiary transition-transform duration-moderate',
                expanded && 'rotate-180',
              )}
            />
          </button>

          <div
            className={cn(
              'flex flex-wrap justify-center gap-2 overflow-hidden transition-all duration-moderate',
              expanded ? 'max-h-40 opacity-100' : 'max-h-10 opacity-100',
            )}
          >
            {queue.map((ex, i) => (
              <QueuePill key={`${ex.programName}-${ex.id}`} exercise={ex} isNext={i === 0} />
            ))}
          </div>
        </div>
      )}

      {/* ── Stats bar ── */}
      <div
        className={cn(
          'w-full mt-10 flex items-center justify-center gap-6',
          'border-t border-border-subtle pt-6',
        )}
      >
        {/* Completion */}
        <div className="flex items-center gap-2">
          <Icon name="CircleCheck" size={14} className="text-content-tertiary" />
          <Text size="xs" color="tertiary">
            <Text size="xs" weight="semibold" color="secondary">
              {completed}
            </Text>
            /{total} done
          </Text>
        </div>

        <div className="w-px h-3 bg-border-subtle" />

        {/* Overall progress mini */}
        <div className="flex items-center gap-2">
          <ProgressBar
            percent={Math.round((completed / total) * 100)}
            type="circle"
            size="xs"
            strokeColor="#8B5CF6"
            showInfo={false}
            className="!w-5 !h-5"
          />
          <Text size="xs" color="tertiary">
            <Text size="xs" weight="semibold" color="secondary">
              {Math.round((completed / total) * 100)}%
            </Text>{' '}
            overall
          </Text>
        </div>

        {nearest && (
          <>
            <div className="w-px h-3 bg-border-subtle" />
            {/* Nearest deadline */}
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={14} className="text-content-tertiary" />
              <Text size="xs" color="tertiary">
                <Text
                  size="xs"
                  weight="semibold"
                  color={nearest.daysLeft <= 7 ? 'error' : 'secondary'}
                >
                  {nearest.daysLeft}d
                </Text>{' '}
                until {nearest.due}
              </Text>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
