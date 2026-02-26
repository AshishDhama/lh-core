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
import type { IllustrationName } from '@/forge/primitives/Illustration';

export const Route = createFileRoute('/brilliant/analytics')({
  component: AnalyticsHomePage,
});

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------

interface EnrichedExercise extends Exercise {
  programName: string;
  programAccent: string;
}

function getAllExercises(programs: Program[]): EnrichedExercise[] {
  const result: EnrichedExercise[] = [];
  for (const p of programs) {
    for (const ex of p.seqExercises) result.push({ ...ex, programName: p.name, programAccent: p.accent });
    for (const ex of p.openExercises) result.push({ ...ex, programName: p.name, programAccent: p.accent });
  }
  return result;
}

function countByStatus(exercises: EnrichedExercise[]) {
  return {
    complete: exercises.filter((e) => e.status === 'complete').length,
    progress: exercises.filter((e) => e.status === 'progress').length,
    notstarted: exercises.filter((e) => e.status === 'notstarted').length,
    locked: exercises.filter((e) => e.status === 'locked').length,
    total: exercises.length,
  };
}

function parseDurationMinutes(time: string): number {
  if (!time || time === '—') return 0;
  const match = time.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function totalRemainingMinutes(exercises: EnrichedExercise[]): number {
  return exercises
    .filter((e) => e.status !== 'complete')
    .reduce((sum, e) => sum + parseDurationMinutes(e.time), 0);
}

function formatMinutes(min: number): string {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function overallPct(programs: Program[]): number {
  if (!programs.length) return 0;
  return Math.round(programs.reduce((s, p) => s + p.pct, 0) / programs.length);
}

function nearestDeadline(programs: Program[]): Program {
  return [...programs].sort((a, b) => a.daysLeft - b.daysLeft)[0];
}

function nextActionExercises(programs: Program[], count = 2): EnrichedExercise[] {
  const all = getAllExercises(programs);
  return all
    .filter((e) => e.status === 'progress' || e.status === 'notstarted')
    .slice(0, count);
}

// ---------------------------------------------------------------------------
// Status metadata
// ---------------------------------------------------------------------------

interface StatusMeta {
  label: string;
  icon: IconName;
  dotCls: string;
  barCls: string;
  textCls: string;
  segmentCls: string;
}

function statusMeta(status: ItemStatus): StatusMeta {
  switch (status) {
    case 'complete':
      return {
        label: 'Complete',
        icon: 'CircleCheckBig',
        dotCls: 'bg-success-light text-success-dark',
        barCls: 'bg-success-dark',
        textCls: 'text-success-dark',
        segmentCls: 'bg-success-dark',
      };
    case 'progress':
      return {
        label: 'In Progress',
        icon: 'Play',
        dotCls: 'bg-subject-code-light text-subject-code',
        barCls: 'bg-subject-code',
        textCls: 'text-subject-code',
        segmentCls: 'bg-subject-code',
      };
    case 'notstarted':
      return {
        label: 'Not Started',
        icon: 'Circle',
        dotCls: 'bg-surface-tertiary text-content-tertiary',
        barCls: 'bg-border-subtle',
        textCls: 'text-content-tertiary',
        segmentCls: 'bg-border-muted',
      };
    case 'locked':
      return {
        label: 'Locked',
        icon: 'Lock',
        dotCls: 'bg-surface-tertiary text-content-tertiary',
        barCls: 'bg-border-subtle',
        textCls: 'text-content-tertiary',
        segmentCls: 'bg-surface-tertiary border border-border-subtle',
      };
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MetricCard({
  label,
  value,
  sub,
  iconName,
  iconCls,
  accentCls,
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  iconName: IconName;
  iconCls: string;
  accentCls: string;
  trend?: { up: boolean; text: string };
}) {
  return (
    <div className="bg-surface-card rounded-3xl shadow-soft p-5 flex flex-col gap-3 border border-border-subtle/50">
      <div className="flex items-start justify-between">
        <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center', accentCls)}>
          <Icon name={iconName} size="md" className={iconCls} />
        </div>
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
              trend.up ? 'bg-success-light text-success-dark' : 'bg-error-light text-error-dark',
            )}
          >
            <Icon name={trend.up ? 'TrendingUp' : 'TrendingDown'} size={12} />
            {trend.text}
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold text-content-primary leading-none mb-1">{value}</div>
        <Overline color="tertiary">{label}</Overline>
        {sub && (
          <Text size="xs" color="tertiary" className="mt-1 block">
            {sub}
          </Text>
        )}
      </div>
    </div>
  );
}

function ProgrammeProgressCard({ program }: { program: Program }) {
  const all = [...program.seqExercises, ...program.openExercises];
  const completed = all.filter((e) => e.status === 'complete').length;
  const inProgress = all.filter((e) => e.status === 'progress').length;
  const daysLabel = program.daysLeft <= 7 ? 'text-error-dark' : program.daysLeft <= 14 ? 'text-warning-dark' : 'text-content-secondary';

  return (
    <div className="flex-1 min-w-0 bg-surface-card rounded-3xl shadow-soft p-5 border border-border-subtle/50 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: program.accent + '22' }}
        >
          <Icon name="BookOpen" size="md" style={{ color: program.accent }} />
        </div>
        <div className="min-w-0 flex-1">
          <Text size="sm" weight="semibold" color="primary" truncate className="block">
            {program.name}
          </Text>
          <div className="flex items-center gap-2 mt-0.5">
            <Icon name="Calendar" size={12} className="text-content-tertiary shrink-0" />
            <Text size="xs" color="tertiary">
              Due {program.due}
            </Text>
            <span className={cn('text-xs font-bold', daysLabel)}>
              {program.daysLeft}d left
            </span>
          </div>
        </div>
      </div>

      {/* Circle progress ring */}
      <div className="flex flex-col items-center gap-2">
        <ProgressBar
          percent={program.pct}
          type="circle"
          size="lg"
          strokeColor={program.accent}
          showInfo
          format={(pct) => (
            <span className="text-lg font-bold text-content-primary">{pct}%</span>
          )}
        />
        <div className="flex items-center gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-success-dark">{completed}</div>
            <Text size="xs" color="tertiary">done</Text>
          </div>
          <div className="w-px h-8 bg-border-subtle" />
          <div>
            <div className="text-xl font-bold text-subject-code">{inProgress}</div>
            <Text size="xs" color="tertiary">active</Text>
          </div>
          <div className="w-px h-8 bg-border-subtle" />
          <div>
            <div className="text-xl font-bold text-content-tertiary">{all.length}</div>
            <Text size="xs" color="tertiary">total</Text>
          </div>
        </div>
      </div>
    </div>
  );
}

function StackedBarChart({ exercises }: { exercises: EnrichedExercise[] }) {
  const counts = countByStatus(exercises);
  const { total } = counts;
  const segments: { status: ItemStatus; count: number }[] = [
    { status: 'complete', count: counts.complete },
    { status: 'progress', count: counts.progress },
    { status: 'notstarted', count: counts.notstarted },
    { status: 'locked', count: counts.locked },
  ];

  return (
    <div className="bg-surface-card rounded-3xl shadow-soft p-5 border border-border-subtle/50">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="ChartBar" size="md" className="text-content-tertiary" />
        <Overline color="tertiary">Exercise Status Distribution</Overline>
      </div>

      {/* Stacked bar */}
      <div className="flex rounded-full overflow-hidden h-4 mb-5 gap-0.5">
        {segments.map(({ status, count }) => {
          if (count === 0) return null;
          const meta = statusMeta(status);
          const pct = (count / total) * 100;
          return (
            <div
              key={status}
              className={cn('h-full transition-all duration-moderate', meta.segmentCls)}
              style={{ width: `${pct}%` }}
              title={`${meta.label}: ${count}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {segments.map(({ status, count }) => {
          const meta = statusMeta(status);
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={status} className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded-full shrink-0', meta.segmentCls)} />
              <Text size="xs" color="secondary" className="flex-1">
                {meta.label}
              </Text>
              <Text size="xs" weight="bold" color="primary">
                {count}
              </Text>
              <Text size="xs" color="tertiary">
                ({pct}%)
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimeEstimateCard({ exercises }: { exercises: EnrichedExercise[] }) {
  const remaining = totalRemainingMinutes(exercises);
  const completed = exercises.filter((e) => e.status === 'complete');
  const completedMin = completed.reduce((s, e) => s + parseDurationMinutes(e.time), 0);
  const totalMin = exercises.reduce((s, e) => s + parseDurationMinutes(e.time), 0);
  const pct = totalMin > 0 ? Math.round((completedMin / totalMin) * 100) : 0;

  return (
    <div className="bg-surface-card rounded-3xl shadow-soft p-5 border border-border-subtle/50">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Timer" size="md" className="text-content-tertiary" />
        <Overline color="tertiary">Time Estimate</Overline>
      </div>

      <div className="flex items-end gap-3 mb-4">
        <div>
          <div className="text-4xl font-bold text-content-primary leading-none">
            {formatMinutes(remaining)}
          </div>
          <Text size="xs" color="tertiary" className="mt-1 block">
            remaining across all exercises
          </Text>
        </div>
        <div className="ml-auto text-right">
          <div className="text-lg font-bold text-success-dark">{formatMinutes(completedMin)}</div>
          <Text size="xs" color="tertiary">invested</Text>
        </div>
      </div>

      <ProgressBar
        percent={pct}
        type="line"
        size="sm"
        strokeColor="var(--color-success-dark, #15803d)"
        showInfo={false}
      />
      <div className="flex justify-between mt-1">
        <Text size="xs" color="tertiary">{pct}% time completed</Text>
        <Text size="xs" color="tertiary">{formatMinutes(totalMin)} total</Text>
      </div>
    </div>
  );
}

function DeadlineCountdownCard({ program }: { program: Program }) {
  const urgent = program.daysLeft <= 7;
  const warning = !urgent && program.daysLeft <= 14;
  const hoursLeft = program.daysLeft * 24;
  const hDisplay = hoursLeft % 24;

  const outerCls = urgent
    ? 'border-error-dark/30 bg-error-light/40'
    : warning
      ? 'border-warning-dark/30 bg-warning-light/30'
      : 'border-border-subtle/50 bg-surface-card';

  const numCls = urgent
    ? 'text-error-dark'
    : warning
      ? 'text-warning-dark'
      : 'text-content-primary';

  return (
    <div className={cn('rounded-3xl shadow-soft p-5 border', outerCls)}>
      <div className="flex items-center gap-2 mb-4">
        <Icon
          name="Clock"
          size="md"
          className={urgent ? 'text-error-dark' : warning ? 'text-warning-dark' : 'text-content-tertiary'}
        />
        <Overline color={urgent ? 'error' : warning ? 'warning' : 'tertiary'}>
          Nearest Deadline
        </Overline>
      </div>

      <Text size="sm" weight="semibold" color="primary" className="block mb-4" truncate>
        {program.name}
      </Text>

      {/* Countdown clock display */}
      <div className="flex items-stretch gap-2 mb-4">
        {/* Days */}
        <div className="flex-1 flex flex-col items-center bg-surface-primary rounded-2xl py-3 border border-border-subtle/50">
          <span className={cn('text-4xl font-bold leading-none tabular-nums', numCls)}>
            {String(program.daysLeft).padStart(2, '0')}
          </span>
          <Text size="xs" color="tertiary" className="mt-1">
            days
          </Text>
        </div>

        <div className="flex items-center">
          <span className={cn('text-2xl font-bold', numCls)}>:</span>
        </div>

        {/* Hours */}
        <div className="flex-1 flex flex-col items-center bg-surface-primary rounded-2xl py-3 border border-border-subtle/50">
          <span className={cn('text-4xl font-bold leading-none tabular-nums', numCls)}>
            {String(hDisplay).padStart(2, '0')}
          </span>
          <Text size="xs" color="tertiary" className="mt-1">
            hours
          </Text>
        </div>

        <div className="flex items-center">
          <span className={cn('text-2xl font-bold', numCls)}>:</span>
        </div>

        {/* Minutes placeholder */}
        <div className="flex-1 flex flex-col items-center bg-surface-primary rounded-2xl py-3 border border-border-subtle/50">
          <span className={cn('text-4xl font-bold leading-none tabular-nums', numCls)}>
            00
          </span>
          <Text size="xs" color="tertiary" className="mt-1">
            min
          </Text>
        </div>
      </div>

      <Text size="xs" color="tertiary" className="text-center block">
        Due {program.due}
      </Text>

      {urgent && (
        <div className="mt-3 flex items-center gap-1.5 justify-center">
          <Icon name="Zap" size="sm" className="text-error-dark" />
          <Text size="xs" weight="semibold" color="error">
            Deadline approaching — act now
          </Text>
        </div>
      )}
    </div>
  );
}

function ExerciseBreakdownList({ exercises }: { exercises: EnrichedExercise[] }) {
  return (
    <div className="bg-surface-card rounded-3xl shadow-soft p-5 border border-border-subtle/50">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Activity" size="md" className="text-content-tertiary" />
        <Overline color="tertiary">Exercise Breakdown</Overline>
      </div>

      <div className="space-y-3">
        {exercises.map((ex) => {
          const meta = statusMeta(ex.status);
          return (
            <div key={`${ex.programName}-${ex.id}`} className="flex items-center gap-3">
              {/* Status dot */}
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
                  meta.dotCls,
                )}
              >
                <Icon name={meta.icon} size="sm" />
              </div>

              {/* Exercise info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Text size="xs" weight="semibold" color="primary" truncate className="block">
                    {ex.name}
                  </Text>
                  <Text size="xs" color="tertiary" className="shrink-0">
                    {ex.time}
                  </Text>
                </div>
                {/* Mini progress bar */}
                <div className="h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-moderate', meta.barCls)}
                    style={{ width: `${ex.pct}%` }}
                  />
                </div>
              </div>

              {/* Pct label */}
              <Text size="xs" weight="bold" className={cn('shrink-0 w-8 text-right', meta.textCls)}>
                {ex.pct}%
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuickActionsCard({ exercises }: { exercises: EnrichedExercise[] }) {
  return (
    <div className="bg-surface-card rounded-3xl shadow-soft p-5 border border-border-subtle/50">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Zap" size="md" className="text-content-tertiary" />
        <Overline color="tertiary">Quick Actions</Overline>
      </div>

      {exercises.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <Illustration name="analytics" size="sm" />
          <Text size="sm" color="tertiary" align="center">
            All exercises complete — well done!
          </Text>
        </div>
      ) : (
        <div className="space-y-3">
          {exercises.map((ex) => {
            const isProgress = ex.status === 'progress';
            const illustration = (ex.illustration ?? 'assessment') as IllustrationName;
            return (
              <div
                key={`${ex.programName}-${ex.id}`}
                className="flex items-center gap-3 p-3 rounded-2xl bg-surface-primary border border-border-subtle/50 hover:border-subject-code/30 hover:shadow-hover-card transition-all duration-fast cursor-pointer group"
              >
                <Illustration name={illustration} size="sm" className="shrink-0 opacity-90" />
                <div className="flex-1 min-w-0">
                  <Text size="sm" weight="semibold" color="primary" truncate className="block">
                    {ex.name}
                  </Text>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Icon name="Clock" size={11} className="text-content-tertiary" />
                    <Text size="xs" color="tertiary">{ex.time}</Text>
                    {ex.proctored && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-content-tertiary" />
                        <Icon name="Shield" size={11} className="text-content-tertiary" />
                        <Text size="xs" color="tertiary">Proctored</Text>
                      </>
                    )}
                  </div>
                  {isProgress && ex.pct > 0 && (
                    <div className="mt-1.5 h-1 bg-surface-tertiary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-subject-code transition-all duration-moderate"
                        style={{ width: `${ex.pct}%` }}
                      />
                    </div>
                  )}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  subjectColor="code"
                  icon={<Icon name={isProgress ? 'Play' : 'ArrowRight'} size="sm" className="text-white" />}
                  className="shrink-0"
                >
                  {isProgress ? 'Resume' : 'Start'}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

function AnalyticsHomePage() {
  const exercises = getAllExercises(programList);
  const counts = countByStatus(exercises);
  const overall = overallPct(programList);
  const nearest = nearestDeadline(programList);
  const nextActions = nextActionExercises(programList, 2);
  const remainingMin = totalRemainingMinutes(exercises);

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Icon name="ChartBar" size="md" className="text-subject-code" />
            <Overline color="tertiary">Analytics Overview</Overline>
          </div>
          <Title level={3} weight="bold" color="primary" className="!mb-0">
            Your Assessment Dashboard
          </Title>
          <Text size="sm" color="secondary" className="mt-1 block">
            Track progress, deadlines, and performance across all active programmes.
          </Text>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-card border border-border-subtle/50 shadow-soft">
          <div className="text-center">
            <div className="text-2xl font-bold text-subject-code">{overall}%</div>
            <Text size="xs" color="tertiary">Overall</Text>
          </div>
          <div className="w-px h-10 bg-border-subtle mx-2" />
          <ProgressBar
            percent={overall}
            type="circle"
            size="sm"
            strokeColor="var(--color-subject-code, #2563eb)"
            showInfo={false}
          />
        </div>
      </div>

      {/* ── Top metric cards row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Exercises"
          value={counts.total}
          sub={`across ${programList.length} programmes`}
          iconName="Target"
          iconCls="text-subject-code"
          accentCls="bg-subject-code-light"
          trend={{ up: true, text: '+2 new' }}
        />
        <MetricCard
          label="Completed"
          value={counts.complete}
          sub={`${counts.total > 0 ? Math.round((counts.complete / counts.total) * 100) : 0}% completion rate`}
          iconName="CircleCheckBig"
          iconCls="text-success-dark"
          accentCls="bg-success-light"
          trend={{ up: true, text: `${counts.complete} done` }}
        />
        <MetricCard
          label="In Progress"
          value={counts.progress}
          sub={`${counts.notstarted} not started`}
          iconName="CircleDot"
          iconCls="text-warning-dark"
          accentCls="bg-warning-light"
        />
        <MetricCard
          label="Time Remaining"
          value={formatMinutes(remainingMin)}
          sub="across pending exercises"
          iconName="Timer"
          iconCls="text-content-secondary"
          accentCls="bg-surface-tertiary"
        />
      </div>

      {/* ── Main two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left column — wider */}
        <div className="lg:col-span-7 flex flex-col gap-5">

          {/* Programme progress rings side by side */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Icon name="ChartPie" size="sm" className="text-content-tertiary" />
              <Overline color="tertiary">Programme Progress</Overline>
            </div>
            <div className="flex gap-4">
              {programList.map((p) => (
                <ProgrammeProgressCard key={p.id} program={p} />
              ))}
            </div>
          </div>

          {/* Stacked bar — exercise status distribution */}
          <StackedBarChart exercises={exercises} />

          {/* Time estimate */}
          <TimeEstimateCard exercises={exercises} />
        </div>

        {/* Right column */}
        <div className="lg:col-span-5 flex flex-col gap-5">

          {/* Deadline countdown */}
          <DeadlineCountdownCard program={nearest} />

          {/* Exercise breakdown list */}
          <ExerciseBreakdownList exercises={exercises} />

          {/* Quick actions */}
          <QuickActionsCard exercises={nextActions} />
        </div>
      </div>
    </main>
  );
}
