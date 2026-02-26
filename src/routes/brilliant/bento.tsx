import { createFileRoute } from '@tanstack/react-router';

import { cn } from '@/forge/utils';
import { Title, Text, Overline } from '@/forge/primitives/Typography';
import { ProgressBar } from '@/forge/primitives/ProgressBar';
import { Illustration } from '@/forge/primitives/Illustration';
import { Icon } from '@/forge/primitives/Icon';
import { Button } from '@/forge/primitives/Button';
import { programList } from '@/data/programs';
import { colors } from '@/forge/tokens';

import type { Program, Exercise } from '@/types/program';
import type { ItemStatus } from '@/types/common';
import type { IconName } from '@/forge/primitives/Icon';
import type { IllustrationName } from '@/forge/primitives/Illustration';

export const Route = createFileRoute('/brilliant/bento')({
  component: BentoHomePage,
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getOverallStats(programs: Program[]) {
  let completedEx = 0;
  let totalEx = 0;
  for (const p of programs) {
    const all = [...p.seqExercises, ...p.openExercises];
    completedEx += all.filter((e) => e.status === 'complete').length;
    totalEx += all.length;
  }
  const overallPct =
    programs.length > 0
      ? Math.round(programs.reduce((s, p) => s + p.pct, 0) / programs.length)
      : 0;
  return { completedEx, totalEx, overallPct };
}

function getNextInProgress(): (Exercise & { programName: string }) | undefined {
  for (const p of programList) {
    const ex = [...p.seqExercises, ...p.openExercises].find(
      (e) => e.status === 'progress',
    );
    if (ex) return { ...ex, programName: p.name };
  }
  for (const p of programList) {
    const ex = [...p.seqExercises, ...p.openExercises].find(
      (e) => e.status === 'notstarted',
    );
    if (ex) return { ...ex, programName: p.name };
  }
  return undefined;
}

function getUpcomingExercises(
  limit = 4,
): Array<Exercise & { programName: string; programAccent: string }> {
  const result: Array<Exercise & { programName: string; programAccent: string }> = [];
  for (const p of programList) {
    const all = [...p.seqExercises, ...p.openExercises];
    for (const ex of all) {
      if (ex.status === 'progress' || ex.status === 'notstarted') {
        result.push({ ...ex, programName: p.name, programAccent: p.accent });
      }
    }
  }
  return result.slice(0, limit);
}

function getStreakCount(): number {
  // Derived from completed exercises as a mock streak
  let count = 0;
  for (const p of programList) {
    count += [...p.seqExercises, ...p.openExercises].filter(
      (e) => e.status === 'complete',
    ).length;
  }
  return count;
}

function getNearestDeadline(programs: Program[]): Program | undefined {
  return [...programs].sort((a, b) => a.daysLeft - b.daysLeft)[0];
}

function exerciseCounts(program: Program) {
  const all = [...program.seqExercises, ...program.openExercises];
  return {
    completed: all.filter((e) => e.status === 'complete').length,
    total: all.length,
  };
}

function statusIcon(status: ItemStatus): IconName {
  switch (status) {
    case 'complete':
      return 'CircleCheckBig';
    case 'progress':
      return 'CircleDot';
    case 'notstarted':
      return 'Circle';
    case 'locked':
      return 'Lock';
  }
}

function statusColors(status: ItemStatus) {
  switch (status) {
    case 'complete':
      return { dot: 'bg-success-light text-success-dark', text: 'text-success-dark' as const };
    case 'progress':
      return { dot: 'bg-subject-code-light text-subject-code-dark', text: 'text-content-primary' as const };
    case 'notstarted':
      return { dot: 'bg-surface-tertiary text-content-tertiary', text: 'text-content-secondary' as const };
    case 'locked':
      return { dot: 'bg-surface-tertiary text-content-tertiary', text: 'text-content-tertiary' as const };
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * HeroCard — spans 2 columns, 2 rows
 * Gradient dark background, greeting + CTA + progress ring
 */
function HeroCard({
  userName,
  overallPct,
  nextExercise,
}: {
  userName: string;
  overallPct: number;
  nextExercise?: Exercise & { programName: string };
}) {
  const firstName = userName.split(' ')[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div
      className={cn(
        'relative rounded-3xl overflow-hidden shadow-soft',
        'col-span-2 row-span-2',
        'flex flex-col justify-between',
        'min-h-[280px] p-8',
      )}
      style={{
        background:
          'linear-gradient(135deg, #6D28D9 0%, #002C77 60%, #001234 100%)',
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-32 opacity-5 rounded-tr-full"
        style={{ background: '#7B61FF' }}
        aria-hidden="true"
      />

      {/* Top: greeting + progress ring */}
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
            {greeting}
          </span>
          <Title level={2} weight="bold" className="!mb-0 !text-white mt-1">
            {firstName}
          </Title>
          <Text size="sm" className="text-white/70 mt-1">
            Your leadership assessment awaits
          </Text>
        </div>

        {/* Progress ring */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <ProgressBar
            type="circle"
            percent={overallPct}
            size="md"
            strokeColor={colors.teal[300]}
            trailColor="rgba(255,255,255,0.12)"
            showInfo
            format={(pct) => (
              <span className="text-sm font-bold text-white">{pct}%</span>
            )}
          />
          <span className="text-xs text-white/50 mt-0.5">Overall</span>
        </div>
      </div>

      {/* Bottom: next exercise CTA */}
      {nextExercise && (
        <div className="relative mt-6">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Up next
            </span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <Text size="lg" weight="bold" className="text-white block truncate">
                {nextExercise.name}
              </Text>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white/50 text-xs">{nextExercise.programName}</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="text-white/50 text-xs">{nextExercise.time}</span>
              </div>
              {nextExercise.status === 'progress' && nextExercise.pct > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-400"
                      style={{ width: `${nextExercise.pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/50 shrink-0">{nextExercise.pct}%</span>
                </div>
              )}
            </div>

            <Button
              variant="secondary"
              size="md"
              icon={<Icon name="Play" size="sm" />}
              iconPlacement="start"
              className={cn(
                'shrink-0 !bg-white/10 !border-white/20 !text-white',
                'hover:!bg-white/20',
              )}
            >
              {nextExercise.status === 'progress' ? 'Continue' : 'Start'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * StatCard — small single-stat tile
 */
function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
  className,
}: {
  icon: IconName;
  label: string;
  value: string | number;
  sub?: string;
  accent?: 'teal' | 'purple' | 'warm' | 'success';
  className?: string;
}) {
  const accentStyles: Record<string, { bg: string; icon: string }> = {
    teal: { bg: 'bg-teal-50', icon: 'text-teal-600' },
    purple: { bg: 'bg-subject-code-light', icon: 'text-subject-code-dark' },
    warm: { bg: 'bg-amber-50', icon: 'text-amber-600' },
    success: { bg: 'bg-success-light/30', icon: 'text-success-dark' },
  };
  const style = accentStyles[accent ?? 'teal'];

  return (
    <div
      className={cn(
        'rounded-2xl bg-surface-card shadow-soft p-5',
        'flex flex-col gap-3',
        'transition-all duration-moderate hover:shadow-hover-card hover:-translate-y-px',
        className,
      )}
    >
      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', style.bg)}>
        <Icon name={icon} size="md" className={style.icon} />
      </div>
      <div>
        <div className="text-2xl font-bold text-content-primary leading-none">{value}</div>
        {sub && <Text size="xs" color="tertiary" className="mt-0.5">{sub}</Text>}
      </div>
      <Overline color="tertiary">{label}</Overline>
    </div>
  );
}

/**
 * ProgrammeCard — medium card with progress bar + exercise count
 */
function ProgrammeCard({
  program,
  className,
}: {
  program: Program;
  className?: string;
}) {
  const { completed, total } = exerciseCounts(program);
  const nextEx = [...program.seqExercises, ...program.openExercises].find(
    (e) => e.status === 'progress' || e.status === 'notstarted',
  );
  const isUrgent = program.daysLeft <= 7;

  return (
    <div
      className={cn(
        'rounded-2xl bg-surface-card shadow-soft p-5',
        'flex flex-col gap-4',
        'transition-all duration-moderate hover:shadow-hover-card hover:-translate-y-px',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: program.accent + '18' }}
        >
          <Icon name="BookOpen" size="md" style={{ color: program.accent }} />
        </div>
        <div className="min-w-0 flex-1">
          <Text size="sm" weight="semibold" color="primary" truncate>
            {program.name}
          </Text>
          <Text size="xs" color="tertiary" className="mt-0.5 line-clamp-1">
            {program.desc}
          </Text>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Text size="xs" color="tertiary">{completed}/{total} exercises</Text>
          <Text size="xs" weight="bold" color="primary">{program.pct}%</Text>
        </div>
        <ProgressBar
          percent={program.pct}
          size="xs"
          type="line"
          strokeColor={program.accent}
          trailColor={program.accent + '18'}
          showInfo={false}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-1.5">
          <Icon
            name="Calendar"
            size="sm"
            className={isUrgent ? 'text-error-dark' : 'text-content-tertiary'}
          />
          <Text
            size="xs"
            weight="semibold"
            color={isUrgent ? 'error' : 'tertiary'}
          >
            {program.daysLeft}d left
          </Text>
        </div>
        {nextEx && (
          <Button variant="ghost" size="sm">
            {nextEx.status === 'progress' ? 'Continue' : 'Start'}
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * UpcomingExercisesTall — tall 2-row card with a vertical list of exercises
 */
function UpcomingExercisesTall({
  exercises,
  className,
}: {
  exercises: Array<Exercise & { programName: string; programAccent: string }>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-surface-card shadow-soft p-5',
        'flex flex-col',
        'row-span-2',
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-subject-code-light flex items-center justify-center">
          <Icon name="Target" size="sm" className="text-subject-code-dark" />
        </div>
        <Overline color="tertiary">Next to tackle</Overline>
      </div>

      <ol className="flex flex-col gap-1 flex-1">
        {exercises.map((ex, i) => {
          const sc = statusColors(ex.status);
          const isLast = i === exercises.length - 1;

          return (
            <li key={`${ex.programName}-${ex.id}`} className="relative">
              {/* Connector line */}
              {!isLast && (
                <div
                  className="absolute left-4 top-9 w-0.5 h-3 bg-border-subtle"
                  aria-hidden="true"
                />
              )}

              <div
                className={cn(
                  'flex items-start gap-3 rounded-xl px-3 py-3',
                  'transition-colors duration-fast',
                  ex.status !== 'locked' ? 'hover:bg-surface-tertiary cursor-pointer' : 'opacity-60',
                )}
              >
                {/* Status dot */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                    sc.dot,
                  )}
                >
                  <Icon name={statusIcon(ex.status)} size="sm" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <Text
                    size="sm"
                    weight="semibold"
                    color={ex.status === 'locked' ? 'tertiary' : 'primary'}
                    truncate
                  >
                    {ex.name}
                  </Text>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Text size="xs" color="tertiary" truncate>
                      {ex.programName}
                    </Text>
                    {ex.time !== '—' && (
                      <>
                        <span className="w-0.5 h-0.5 rounded-full bg-content-tertiary" />
                        <Text size="xs" color="tertiary">{ex.time}</Text>
                      </>
                    )}
                  </div>
                  {ex.status === 'progress' && ex.pct > 0 && (
                    <div className="mt-2">
                      <ProgressBar
                        percent={ex.pct}
                        size="xs"
                        type="line"
                        strokeColor={ex.programAccent}
                        showInfo={false}
                      />
                    </div>
                  )}
                </div>

                {/* Arrow for actionable */}
                {(ex.status === 'progress' || ex.status === 'notstarted') && (
                  <Icon name="ArrowRight" size="sm" className="text-content-tertiary shrink-0 mt-1" />
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 pt-4 border-t border-border-subtle">
        <Button variant="ghost" size="sm" fullWidth icon={<Icon name="ArrowRight" size="sm" />} iconPlacement="end">
          View all exercises
        </Button>
      </div>
    </div>
  );
}

/**
 * IllustrationAccentCard — a visually rich card with an illustration
 * used for an inspiring/brand moment
 */
function IllustrationAccentCard({
  title,
  sub,
  illustrationName,
  className,
}: {
  title: string;
  sub: string;
  illustrationName: IllustrationName;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden shadow-soft',
        'flex flex-col items-center justify-between',
        'p-5 text-center',
        'bg-subject-code-light',
        'transition-all duration-moderate hover:shadow-hover-card',
        className,
      )}
    >
      <div className="flex-1 flex items-center justify-center py-3">
        <Illustration name={illustrationName} size="lg" />
      </div>
      <div className="mt-2">
        <Text size="sm" weight="semibold" color="primary">{title}</Text>
        <Text size="xs" color="secondary" className="mt-0.5 block">{sub}</Text>
      </div>
    </div>
  );
}

/**
 * DeadlineBannerCard — wide accent card, spans 2 cols
 * Shows next approaching deadline prominently
 */
function DeadlineBannerCard({
  program,
  className,
}: {
  program: Program;
  className?: string;
}) {
  const isUrgent = program.daysLeft <= 7;

  return (
    <div
      className={cn(
        'rounded-2xl shadow-soft p-5 col-span-2',
        'flex items-center gap-5',
        isUrgent ? 'bg-error-light/20' : 'bg-surface-warm',
        'transition-all duration-moderate hover:shadow-hover-card',
        className,
      )}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
          isUrgent ? 'bg-error-light text-error-dark' : 'bg-amber-100 text-amber-700',
        )}
      >
        <Icon name={isUrgent ? 'Flame' : 'Clock'} size="lg" />
      </div>

      <div className="flex-1 min-w-0">
        <Overline color="tertiary" className="mb-0.5">
          {isUrgent ? 'Urgent deadline' : 'Upcoming deadline'}
        </Overline>
        <Text size="base" weight="semibold" color="primary" truncate>
          {program.name}
        </Text>
        <Text size="xs" color="secondary" className="mt-0.5">
          Due {program.due}
        </Text>
      </div>

      <div className="text-right shrink-0">
        <div
          className={cn(
            'text-3xl font-bold leading-none',
            isUrgent ? 'text-error-dark' : 'text-content-primary',
          )}
        >
          {program.daysLeft}
        </div>
        <Text size="xs" color="tertiary">days left</Text>
      </div>
    </div>
  );
}

/**
 * ProgramProgressRingCard — single programme with a big circle progress
 */
function ProgramProgressRingCard({
  program,
  className,
}: {
  program: Program;
  className?: string;
}) {
  const { completed, total } = exerciseCounts(program);

  return (
    <div
      className={cn(
        'rounded-2xl bg-surface-card shadow-soft p-5',
        'flex flex-col items-center text-center gap-3',
        'transition-all duration-moderate hover:shadow-hover-card hover:-translate-y-px',
        className,
      )}
    >
      <ProgressBar
        type="circle"
        percent={program.pct}
        size="md"
        strokeColor={program.accent}
        trailColor={program.accent + '18'}
        showInfo
        format={(pct) => (
          <span className="text-sm font-bold text-content-primary">{pct}%</span>
        )}
      />
      <div>
        <Text size="sm" weight="semibold" color="primary" className="line-clamp-2">
          {program.name}
        </Text>
        <Text size="xs" color="tertiary" className="mt-0.5">
          {completed}/{total} done
        </Text>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

function BentoHomePage() {
  const { completedEx, totalEx, overallPct } = getOverallStats(programList);
  const nextExercise = getNextInProgress();
  const upcomingExercises = getUpcomingExercises(4);
  const streakCount = getStreakCount();
  const nearestDeadline = getNearestDeadline(programList);

  return (
    <main className="max-w-[1120px] mx-auto px-6 py-8">
      {/*
        ┌──────────────────────┬────────┬────────┐  row 1
        │  HERO (col 1-2, r1-2)│STAT    │STAT    │
        │                      ├────────┴────────┤  row 2
        │                      │ UPCOMING (r2-3) │
        ├────────┬─────────────┤                 │  row 3
        │PROG A  │ ILLUS ACCENT│                 │
        ├────────┴─────────────┴─────────────────┤  row 4
        │  DEADLINE BANNER (col 1-2)              │  (if urgent)
        ├──────────────────────┬──────────────────┤  row 5
        │PROG RING (col 1)     │PROG RING (col 2) │
        └──────────────────────┴──────────────────┘
      */}

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: 'auto',
        }}
      >
        {/* ── Row 1-2: Hero (spans 2 cols × 2 rows) ── */}
        <div style={{ gridColumn: '1 / 3', gridRow: '1 / 3' }}>
          <HeroCard
            userName="Priya Sharma"
            overallPct={overallPct}
            nextExercise={nextExercise}
          />
        </div>

        {/* ── Row 1: Stat cards (cols 3-4) ── */}
        <div style={{ gridColumn: '3 / 4', gridRow: '1 / 2' }}>
          <StatCard
            icon="CircleCheck"
            label="Exercises done"
            value={completedEx}
            sub={`of ${totalEx} total`}
            accent="success"
          />
        </div>

        <div style={{ gridColumn: '4 / 5', gridRow: '1 / 2' }}>
          <StatCard
            icon="Flame"
            label="Completed"
            value={`${streakCount}`}
            sub="this cycle"
            accent="warm"
          />
        </div>

        {/* ── Row 2-3: Upcoming exercises list (col 3-4, 2 rows tall) ── */}
        <div style={{ gridColumn: '3 / 5', gridRow: '2 / 4' }}>
          <UpcomingExercisesTall exercises={upcomingExercises} className="h-full" />
        </div>

        {/* ── Row 3: Programme card + illustration card (cols 1-2) ── */}
        <div style={{ gridColumn: '1 / 2', gridRow: '3 / 4' }}>
          {programList[0] && (
            <ProgrammeCard program={programList[0]} className="h-full" />
          )}
        </div>

        <div style={{ gridColumn: '2 / 3', gridRow: '3 / 4' }}>
          <IllustrationAccentCard
            title="Leadership Insights"
            sub="Your full report unlocks after completion"
            illustrationName="leadership"
            className="h-full"
          />
        </div>

        {/* ── Row 4: Deadline banner (full width) ── */}
        {nearestDeadline && (
          <div style={{ gridColumn: '1 / 5', gridRow: '4 / 5' }}>
            <DeadlineBannerCard program={nearestDeadline} />
          </div>
        )}

        {/* ── Row 5: Programme ring cards (cols 1-2) + stat fillers (cols 3-4) ── */}
        {programList[0] && (
          <div style={{ gridColumn: '1 / 2', gridRow: '5 / 6' }}>
            <ProgramProgressRingCard program={programList[0]} className="h-full" />
          </div>
        )}

        {programList[1] && (
          <div style={{ gridColumn: '2 / 3', gridRow: '5 / 6' }}>
            <ProgramProgressRingCard program={programList[1]} className="h-full" />
          </div>
        )}

        <div style={{ gridColumn: '3 / 4', gridRow: '5 / 6' }}>
          <StatCard
            icon="Award"
            label="Programmes active"
            value={programList.filter((p) => p.status !== 'complete').length}
            sub="in progress"
            accent="purple"
          />
        </div>

        <div style={{ gridColumn: '4 / 5', gridRow: '5 / 6' }}>
          <StatCard
            icon="TrendingUp"
            label="Avg. progress"
            value={`${overallPct}%`}
            sub="across all"
            accent="teal"
          />
        </div>
      </div>
    </main>
  );
}
