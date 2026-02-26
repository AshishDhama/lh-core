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

export const Route = createFileRoute('/brilliant/programmes/magazine')({
  component: MagazineProgrammesPage,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function featuredProgram(programs: Program[]): Program | undefined {
  return (
    programs.find((p) => p.status === 'progress') ??
    programs.find((p) => p.status === 'notstarted') ??
    programs[0]
  );
}

function featuredExercise(program: Program): Exercise | undefined {
  return (
    [...program.seqExercises, ...program.openExercises].find(
      (e) => e.status === 'progress',
    ) ??
    [...program.seqExercises, ...program.openExercises].find(
      (e) => e.status === 'notstarted',
    )
  );
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

function overallPct(programs: Program[]): number {
  if (programs.length === 0) return 0;
  return Math.round(programs.reduce((s, p) => s + p.pct, 0) / programs.length);
}

function nearestDeadline(programs: Program[]): Program | undefined {
  return [...programs].sort((a, b) => a.daysLeft - b.daysLeft)[0];
}

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

const STATUS_META: Record<
  ItemStatus,
  { label: string; icon: IconName; dotClass: string; badgeClass: string }
> = {
  complete: {
    label: 'Completed',
    icon: 'CircleCheckBig',
    dotClass: 'bg-success-dark',
    badgeClass: 'bg-success-light text-success-dark',
  },
  progress: {
    label: 'In Progress',
    icon: 'CircleDot',
    dotClass: 'bg-subject-code',
    badgeClass: 'bg-subject-code-light text-subject-code-dark',
  },
  notstarted: {
    label: 'Not Started',
    icon: 'Circle',
    dotClass: 'bg-border-muted',
    badgeClass: 'bg-surface-tertiary text-content-tertiary',
  },
  locked: {
    label: 'Locked',
    icon: 'Lock',
    dotClass: 'bg-border-subtle',
    badgeClass: 'bg-surface-tertiary text-content-tertiary',
  },
};

// ---------------------------------------------------------------------------
// Decorative background shape
// ---------------------------------------------------------------------------

function DecorativeBlob({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute rounded-full blur-3xl pointer-events-none', className)}
      style={style}
    />
  );
}

// ---------------------------------------------------------------------------
// Pull-quote stat card
// ---------------------------------------------------------------------------

interface PullStatProps {
  value: string;
  label: string;
  sublabel?: string;
  accentClass: string;
  icon: IconName;
  iconClass: string;
}

function PullStat({ value, label, sublabel, accentClass, icon, iconClass }: PullStatProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-surface-card shadow-soft px-7 py-6 flex flex-col gap-1">
      {/* Decorative accent bar */}
      <div className={cn('absolute top-0 left-0 right-0 h-1 rounded-t-3xl', accentClass)} />

      <div className="flex items-start justify-between gap-2 mb-1">
        <Text size="xs" color="tertiary" weight="semibold" className="uppercase tracking-wider leading-none">
          {label}
        </Text>
        <Icon name={icon} size="sm" className={iconClass} />
      </div>

      <p className={cn('text-5xl font-bold leading-none tracking-tighter tabular-nums', iconClass)}>
        {value}
      </p>

      {sublabel && (
        <Text size="xs" color="tertiary" className="block mt-1">
          {sublabel}
        </Text>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero — featured in-progress programme
// ---------------------------------------------------------------------------

interface HeroProps {
  program: Program;
}

function MagazineHero({ program }: HeroProps) {
  const ex = featuredExercise(program);

  return (
    <div
      className="relative overflow-hidden rounded-4xl shadow-hover-card"
      style={{
        background: `linear-gradient(135deg, ${program.accent}ee 0%, ${program.accent}99 50%, ${program.accent}44 100%)`,
      }}
    >
      {/* Background texture blobs */}
      <DecorativeBlob
        className="w-96 h-96 -top-24 -right-24 opacity-20"
        style={{ backgroundColor: '#ffffff' }}
      />
      <DecorativeBlob
        className="w-64 h-64 bottom-0 left-1/3 opacity-10"
        style={{ backgroundColor: '#ffffff' }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-0">
        {/* Left: text content */}
        <div className="px-10 py-10 flex flex-col gap-6 justify-between">
          {/* Overline */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">
                Featured Programme
              </span>
            </div>
          </div>

          {/* Programme name */}
          <div className="flex flex-col gap-3">
            <Title
              level={1}
              weight="bold"
              color="inverse"
              className="!mb-0 !text-4xl lg:!text-5xl !leading-tight !tracking-tight"
            >
              {program.name}
            </Title>
            <Text size="lg" color="inverse" className="opacity-80 leading-relaxed max-w-xl block">
              {program.desc}
            </Text>
          </div>

          {/* Progress ring + stats */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
              <ProgressBar
                percent={program.pct}
                type="circle"
                size="sm"
                showInfo={false}
                strokeColor="#ffffff"
                trailColor="rgba(255,255,255,0.25)"
              />
              <div>
                <p className="text-3xl font-bold text-white leading-none tabular-nums">
                  {program.pct}%
                </p>
                <Text size="xs" color="inverse" className="opacity-70 block mt-0.5">
                  complete
                </Text>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon name="Calendar" size="sm" className="text-white opacity-70" />
                <Text size="sm" color="inverse" className="opacity-90 font-semibold">
                  Due {program.due}
                </Text>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold">
                  {program.daysLeft}d left
                </span>
              </div>
              {ex && (
                <div className="flex items-center gap-2">
                  <Icon name="Play" size="sm" className="text-white opacity-70" />
                  <Text size="sm" color="inverse" className="opacity-80">
                    Up next: {ex.name}
                  </Text>
                </div>
              )}
            </div>
          </div>

          {/* CTA row */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="primary"
              size="lg"
              className="!rounded-full !bg-white !text-content-primary hover:!bg-white/90 !border-transparent !font-bold !shadow-soft"
              icon={<Icon name="Play" size="sm" />}
            >
              Continue Programme
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="!rounded-full !text-white hover:!bg-white/15 !border-white/30 !border"
            >
              View Instructions
            </Button>
          </div>
        </div>

        {/* Right: large illustration */}
        <div className="hidden lg:flex items-end justify-center px-10 pt-6 pb-0 self-end">
          <div className="relative">
            {/* Glow behind illustration */}
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-40 scale-110"
              style={{ backgroundColor: '#ffffff' }}
            />
            <Illustration
              name={
                (program.seqExercises.find((e) => e.status === 'progress')?.illustration ??
                  program.seqExercises[0]?.illustration ??
                  'leadership') as string
              }
              size="xl"
              className="relative z-10 drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pull-quote stat bar
// ---------------------------------------------------------------------------

function PullQuoteStatBar({ programs }: { programs: Program[] }) {
  const pct = overallPct(programs);
  const counts = totalExerciseCounts(programs);
  const nearest = nearestDeadline(programs);
  const inProgress = programs.filter((p) => p.status === 'progress').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <PullStat
        value={`${pct}%`}
        label="Overall Progress"
        sublabel="across all programmes"
        accentClass="bg-gradient-to-r from-violet-500 to-purple-400"
        icon="TrendingUp"
        iconClass="text-violet-600"
      />
      <PullStat
        value={String(counts.complete)}
        label="Exercises Done"
        sublabel={`of ${counts.total} total`}
        accentClass="bg-gradient-to-r from-emerald-500 to-teal-400"
        icon="CircleCheckBig"
        iconClass="text-emerald-600"
      />
      <PullStat
        value={String(inProgress)}
        label="In Progress"
        sublabel="programmes active"
        accentClass="bg-gradient-to-r from-sky-500 to-blue-400"
        icon="CircleDot"
        iconClass="text-sky-600"
      />
      <PullStat
        value={nearest ? `${nearest.daysLeft}d` : '—'}
        label="Next Deadline"
        sublabel={nearest ? nearest.due : 'No upcoming deadlines'}
        accentClass={
          nearest && nearest.daysLeft <= 7
            ? 'bg-gradient-to-r from-rose-500 to-red-400'
            : 'bg-gradient-to-r from-amber-400 to-orange-400'
        }
        icon="Calendar"
        iconClass={nearest && nearest.daysLeft <= 7 ? 'text-rose-600' : 'text-amber-600'}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Featured Exercise callout
// ---------------------------------------------------------------------------

interface FeaturedExerciseCalloutProps {
  exercise: Exercise;
  program: Program;
}

function FeaturedExerciseCallout({ exercise, program }: FeaturedExerciseCalloutProps) {
  const isProgress = exercise.status === 'progress';
  const actionLabel = isProgress ? 'Continue Exercise' : 'Start Exercise';

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-border-subtle shadow-hover-card"
      style={{
        background: `linear-gradient(to right, ${program.accent}12 0%, transparent 60%)`,
        borderLeftWidth: 4,
        borderLeftColor: program.accent,
      }}
    >
      <div className="flex flex-col sm:flex-row items-stretch">
        {/* Illustration panel */}
        <div
          className="flex items-center justify-center p-8 sm:w-52 shrink-0 rounded-l-3xl"
          style={{ backgroundColor: program.accent + '18' }}
        >
          <div className="relative">
            <DecorativeBlob
              className="w-24 h-24 opacity-30"
              style={{ backgroundColor: program.accent, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
            />
            <Illustration
              name={exercise.illustration ?? 'assessment'}
              size="lg"
              className="relative z-10"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-7 py-6 flex flex-col gap-3 justify-between">
          <div>
            {/* Callout label */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-bold"
                style={{ backgroundColor: program.accent }}
              >
                <Icon name="Sparkles" size={12} className="text-white" />
                Up Next
              </div>
              {exercise.proctored && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning-light border border-amber-200">
                  <Icon name="ShieldCheck" size={11} className="text-amber-700" />
                  <Text size="xs" weight="semibold" className="text-amber-700 leading-none">
                    Proctored
                  </Text>
                </div>
              )}
            </div>

            <Title level={3} weight="bold" color="primary" className="!mb-1 !text-xl">
              {exercise.name}
            </Title>
            <Text size="base" color="secondary" className="block leading-relaxed">
              {exercise.desc}
            </Text>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Time */}
            <div className="flex items-center gap-1.5">
              <Icon name="Clock" size="sm" className="text-content-tertiary" />
              <Text size="sm" color="tertiary" weight="medium">
                {exercise.time}
              </Text>
            </div>

            {/* Progress if in progress */}
            {isProgress && exercise.pct > 0 && (
              <div className="flex items-center gap-3 flex-1 min-w-[120px] max-w-xs">
                <ProgressBar
                  percent={exercise.pct}
                  type="line"
                  size="xs"
                  showInfo={false}
                  strokeColor={program.accent}
                />
                <Text size="xs" weight="bold" color="primary" className="shrink-0">
                  {exercise.pct}%
                </Text>
              </div>
            )}

            <Button
              variant="primary"
              size="md"
              className="!rounded-full ml-auto"
              subjectColor="code"
              icon={<Icon name="ArrowRight" size="sm" />}
            >
              {actionLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exercise list row (magazine style)
// ---------------------------------------------------------------------------

interface ExerciseListRowProps {
  exercise: Exercise;
  stepNumber?: number;
  isLast: boolean;
  accentColor: string;
}

function ExerciseListRow({ exercise, stepNumber, isLast, accentColor }: ExerciseListRowProps) {
  const meta = STATUS_META[exercise.status];
  const isLocked = exercise.status === 'locked';
  const isComplete = exercise.status === 'complete';
  const isInProgress = exercise.status === 'progress';

  return (
    <div
      className={cn(
        'flex items-center gap-4 px-5 py-4 transition-colors duration-fast',
        !isLast && 'border-b border-border-subtle',
        isLocked ? 'opacity-45' : 'hover:bg-surface-warm cursor-pointer',
      )}
    >
      {/* Step indicator */}
      <div className="shrink-0 w-8 flex justify-center">
        {stepNumber !== undefined ? (
          <div
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold leading-none',
              isComplete
                ? 'bg-success-light text-success-dark'
                : isInProgress
                  ? 'text-white'
                  : 'bg-surface-tertiary text-content-tertiary',
            )}
            style={isInProgress ? { backgroundColor: accentColor } : undefined}
          >
            {isComplete ? (
              <Icon name="Check" size={11} strokeWidth={3} className="text-success-dark" />
            ) : isLocked ? (
              <Icon name="Lock" size={11} className="text-content-tertiary" />
            ) : (
              stepNumber
            )}
          </div>
        ) : (
          /* Open exercise: status dot */
          <div className={cn('w-2.5 h-2.5 rounded-full mt-0.5', meta.dotClass)} />
        )}
      </div>

      {/* Small illustration */}
      <div className="shrink-0">
        <Illustration
          name={exercise.illustration ?? 'assessment'}
          size="sm"
          className={cn(isLocked && 'grayscale opacity-60')}
        />
      </div>

      {/* Name + description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <Text size="sm" weight="semibold" color={isLocked ? 'tertiary' : 'primary'}>
            {exercise.name}
          </Text>
          {exercise.proctored && !isLocked && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-warning-light border border-amber-200">
              <Icon name="ShieldCheck" size={9} className="text-amber-700" strokeWidth={2.5} />
              <span className="text-amber-700 text-xs font-semibold leading-none">Proctored</span>
            </span>
          )}
          {exercise.hasReport && isComplete && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-success-light">
              <Icon name="FileText" size={9} className="text-success-dark" strokeWidth={2.5} />
              <span className="text-success-dark text-xs font-semibold leading-none">Report</span>
            </span>
          )}
        </div>
        <Text size="xs" color="tertiary" className="block leading-snug">
          {exercise.desc}
        </Text>
      </div>

      {/* Time */}
      <div className="shrink-0 hidden sm:flex items-center gap-1 min-w-[56px] justify-end">
        <Icon name="Clock" size={12} className="text-content-tertiary" />
        <Text size="xs" color="tertiary" className="tabular-nums">
          {exercise.time}
        </Text>
      </div>

      {/* Inline progress */}
      <div className="shrink-0 w-24 hidden md:block">
        {isInProgress ? (
          <div className="flex flex-col gap-1">
            <ProgressBar
              percent={exercise.pct}
              type="line"
              size="xs"
              showInfo={false}
              strokeColor={accentColor}
            />
            <Text size="xs" color="tertiary" className="tabular-nums text-right">
              {exercise.pct}%
            </Text>
          </div>
        ) : isComplete ? (
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
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
            meta.badgeClass,
          )}
        >
          <Icon name={meta.icon} size={10} />
          {meta.label}
        </span>
      </div>

      {/* Action button or lock */}
      <div className="shrink-0">
        {isLocked ? (
          <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-surface-tertiary">
            <Icon name="Lock" size="sm" className="text-content-tertiary" />
          </div>
        ) : isComplete ? (
          <Button variant="ghost" size="sm" className="text-xs !rounded-full">
            Review
          </Button>
        ) : isInProgress ? (
          <Button variant="primary" size="sm" className="!rounded-full text-xs">
            Continue
          </Button>
        ) : (
          <Button variant="secondary" size="sm" className="!rounded-full text-xs">
            Start
          </Button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Magazine programme section
// ---------------------------------------------------------------------------

interface MagazineProgrammeSectionProps {
  program: Program;
  featured: Program | undefined;
}

function MagazineProgrammeSection({ program, featured }: MagazineProgrammeSectionProps) {
  const isFeatured = featured?.id === program.id;
  const allEx = [...program.seqExercises, ...program.openExercises];
  const completeCount = allEx.filter((e) => e.status === 'complete').length;
  const currentEx = featuredExercise(program);
  const hasSeq = program.seqExercises.length > 0;
  const hasOpen = program.openExercises.length > 0;

  const isUrgent = program.daysLeft <= 7;

  return (
    <section className="rounded-3xl overflow-hidden bg-surface-card shadow-soft border border-border-subtle">
      {/* Full-width gradient accent header band */}
      <div
        className="px-8 py-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(to right, ${program.accent} 0%, ${program.accent}cc 60%, ${program.accent}88 100%)`,
        }}
      >
        {/* Background blobs in header */}
        <DecorativeBlob
          className="w-64 h-64 -top-16 -right-16 opacity-15"
          style={{ backgroundColor: '#ffffff' }}
        />
        <DecorativeBlob
          className="w-32 h-32 bottom-0 left-1/2 opacity-10"
          style={{ backgroundColor: '#ffffff' }}
        />

        <div className="relative z-10 flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            {/* Big illustration in header */}
            <div className="relative shrink-0">
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-40"
                style={{ backgroundColor: '#ffffff' }}
              />
              <Illustration
                name={
                  (program.seqExercises[0]?.illustration ??
                    program.openExercises[0]?.illustration ??
                    'leadership') as string
                }
                size="md"
                className="relative z-10"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                {isFeatured && (
                  <span className="px-2 py-0.5 rounded-full bg-white/25 text-white text-xs font-bold uppercase tracking-wide">
                    Active
                  </span>
                )}
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide',
                    program.status === 'complete'
                      ? 'bg-white/20 text-white'
                      : program.status === 'progress'
                        ? 'bg-white/30 text-white'
                        : 'bg-white/15 text-white/70',
                  )}
                >
                  {program.status === 'complete'
                    ? 'Completed'
                    : program.status === 'progress'
                      ? 'In Progress'
                      : 'Not Started'}
                </span>
              </div>

              <Title
                level={2}
                weight="bold"
                color="inverse"
                className="!mb-0 !text-2xl !leading-tight"
              >
                {program.name}
              </Title>
              <Text size="sm" color="inverse" className="opacity-75 block mt-1 max-w-lg">
                {program.desc}
              </Text>
            </div>
          </div>

          {/* Right side: progress ring + deadline */}
          <div className="flex items-center gap-5 shrink-0">
            {/* Progress ring */}
            <div className="flex flex-col items-center gap-1">
              <ProgressBar
                percent={program.pct}
                type="circle"
                size="md"
                strokeColor="#ffffff"
                trailColor="rgba(255,255,255,0.25)"
                showInfo={false}
              />
              <Text size="xs" color="inverse" className="opacity-70">
                {program.pct}% done
              </Text>
            </div>

            {/* Deadline */}
            <div className="flex flex-col gap-2">
              <div
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                  isUrgent ? 'bg-red-500/30 border border-red-300/30' : 'bg-white/20 border border-white/20',
                )}
              >
                <Icon name="Calendar" size="sm" className="text-white opacity-80" />
                <Text size="sm" color="inverse" weight="semibold">
                  {program.due}
                </Text>
                <span className="px-1.5 py-0.5 rounded-full bg-white/30 text-white text-xs font-bold">
                  {program.daysLeft}d
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15">
                <Icon name="ListChecks" size="sm" className="text-white opacity-70" />
                <Text size="sm" color="inverse" className="opacity-80">
                  {completeCount} / {allEx.length} exercises
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body: two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-0">
        {/* Left column: large illustration + ring */}
        <div className="hidden lg:flex flex-col items-center justify-start gap-6 px-8 py-8 border-r border-border-subtle bg-surface-warm/40 min-w-[200px]">
          {/* Large programme illustration */}
          <div
            className="relative flex items-center justify-center w-40 h-40 rounded-3xl"
            style={{ backgroundColor: program.accent + '18' }}
          >
            <DecorativeBlob
              className="w-24 h-24 opacity-20"
              style={{
                backgroundColor: program.accent,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
              }}
            />
            <Illustration
              name={
                (program.seqExercises.find((e) => e.status === 'progress')?.illustration ??
                  program.seqExercises[0]?.illustration ??
                  program.openExercises[0]?.illustration ??
                  'leadership') as string
              }
              size="lg"
              className="relative z-10"
            />
          </div>

          {/* Large progress ring */}
          <div className="flex flex-col items-center gap-2">
            <ProgressBar
              percent={program.pct}
              type="circle"
              size="lg"
              strokeColor={program.accent}
              trailColor="rgba(0,0,0,0.06)"
              showInfo
              format={(pct) => (
                <span className="text-2xl font-bold text-content-primary tabular-nums">
                  {pct}%
                </span>
              )}
            />
            <Text size="xs" color="tertiary" align="center">
              {completeCount} of {allEx.length} done
            </Text>
          </div>

          {/* CTA */}
          {program.status !== 'complete' ? (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              className="!rounded-full !font-bold"
              subjectColor="code"
              icon={<Icon name="Play" size="sm" />}
            >
              Continue
            </Button>
          ) : (
            <Button variant="secondary" size="sm" fullWidth className="!rounded-full">
              View Report
            </Button>
          )}
        </div>

        {/* Right column: exercise list */}
        <div className="py-2">
          {/* Featured / current exercise callout (inside the section) */}
          {currentEx && (
            <div className="px-6 pt-5 pb-3">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Sparkles" size="sm" style={{ color: program.accent }} />
                <Overline color="tertiary">Current exercise</Overline>
              </div>
              <FeaturedExerciseCallout exercise={currentEx} program={program} />
            </div>
          )}

          {/* Sequential exercises */}
          {hasSeq && (
            <div>
              <div className="flex items-center gap-2 px-6 py-3 border-b border-border-subtle bg-surface-tertiary/30">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: program.accent }}
                >
                  <Icon name="ArrowRight" size={10} className="text-white" strokeWidth={2.5} />
                </div>
                <Overline color="secondary" className="!text-xs">
                  Sequential Path — complete in order
                </Overline>
                <div className="ml-auto flex items-center gap-1">
                  <Icon name="Lock" size={10} className="text-content-tertiary" />
                  <Text size="xs" color="tertiary">
                    Unlocks step by step
                  </Text>
                </div>
              </div>

              {program.seqExercises.map((ex, i) => (
                <ExerciseListRow
                  key={ex.id}
                  exercise={ex}
                  stepNumber={i + 1}
                  isLast={i === program.seqExercises.length - 1 && !hasOpen}
                  accentColor={program.accent}
                />
              ))}
            </div>
          )}

          {/* Open exercises */}
          {hasOpen && (
            <div>
              <div
                className={cn(
                  'flex items-center gap-2 px-6 py-3 border-b border-border-subtle bg-surface-tertiary/30',
                  hasSeq && 'border-t border-border-subtle',
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

              {program.openExercises.map((ex, i) => (
                <ExerciseListRow
                  key={ex.id}
                  exercise={ex}
                  stepNumber={undefined}
                  isLast={i === program.openExercises.length - 1}
                  accentColor={program.accent}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Editorial divider between sections
// ---------------------------------------------------------------------------

function EditorialDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 my-10">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border-muted to-transparent" />
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-surface-card shadow-soft">
        <Icon name="BookOpen" size="sm" className="text-content-tertiary" />
        <Text size="xs" weight="semibold" color="tertiary" className="uppercase tracking-widest">
          {label}
        </Text>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border-muted to-transparent" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Magazine-style page header
// ---------------------------------------------------------------------------

function PageMasthead() {
  return (
    <header className="flex items-end justify-between gap-6 mb-8 pb-6 border-b border-border-subtle">
      <div className="flex flex-col gap-1">
        <Overline color="tertiary" className="block">
          Brilliant Assessment Platform
        </Overline>
        <div className="flex items-baseline gap-4">
          <Title level={2} weight="bold" color="primary" className="!mb-0 !text-3xl">
            Programmes
          </Title>
          <span className="text-content-tertiary text-lg font-light select-none">&amp;</span>
          <Title level={2} weight="bold" color="primary" className="!mb-0 !text-3xl">
            Exercises
          </Title>
        </div>
      </div>

      {/* Issue / date label for editorial feel */}
      <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0 border-l-2 border-border-muted pl-5">
        <Text size="xs" color="tertiary" weight="semibold" className="uppercase tracking-wider">
          2026 Assessment Cycle
        </Text>
        <Text size="xs" color="tertiary">
          {programList.length} programme{programList.length !== 1 ? 's' : ''} assigned
        </Text>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function MagazineProgrammesPage() {
  const featured = featuredProgram(programList);

  return (
    <main className="max-w-[1100px] mx-auto px-5 py-8 relative">
      {/* Subtle page-level background blobs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.04] -top-48 -right-48"
          style={{ backgroundColor: '#8B5CF6' }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.03] bottom-0 left-0"
          style={{ backgroundColor: '#0EA5E9' }}
        />
      </div>

      {/* Masthead */}
      <PageMasthead />

      {/* Hero — featured in-progress programme */}
      {featured && (
        <section className="mb-8">
          <MagazineHero program={featured} />
        </section>
      )}

      {/* Pull-quote stat strip */}
      <section className="mb-8">
        <PullQuoteStatBar programs={programList} />
      </section>

      <EditorialDivider label="All Programmes" />

      {/* Programme sections */}
      <div className="flex flex-col gap-10">
        {programList.map((program) => (
          <MagazineProgrammeSection
            key={program.id}
            program={program}
            featured={featured}
          />
        ))}
      </div>

      {/* Footer spacer */}
      <div className="h-20" aria-hidden="true" />
    </main>
  );
}
