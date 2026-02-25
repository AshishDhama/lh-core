import { useState } from 'react';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { Alert, Divider } from 'antd';
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock,
  Lock,
  PlayCircle,
  Target,
} from 'lucide-react';

import { Button, Text, Title } from '@/forge';
import type { SidebarItem } from '@/forge';
import { DashboardLayout } from '@/forge/layouts';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';
import type { Exercise, Program } from '@/types/program';
import { useProgramStore } from '@/stores/useProgramStore';

// ─── Shared constants ────────────────────────────────────────────────────────

const SIDEBAR_ITEMS: SidebarItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  { key: 'programs', label: 'Programs', icon: 'BookOpen', path: '/programs' },
  { key: 'development', label: 'Development', icon: 'Target', path: '/development' },
  { key: 'scheduling', label: 'Scheduling', icon: 'CalendarDays', path: '/scheduling' },
  { key: 'insights', label: 'Insights', icon: 'ChartBar', path: '/insights' },
];

const MOCK_USER = {
  name: 'Priya Sharma',
  role: 'Senior Manager',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusIcon(status: Exercise['status'], color: string) {
  if (status === 'complete') return <CheckCircle size={16} style={{ color: colors.success.DEFAULT }} />;
  if (status === 'progress') return <PlayCircle size={16} style={{ color: colors.warning.DEFAULT }} />;
  if (status === 'locked') return <Lock size={16} style={{ color: colors.content.tertiary }} />;
  return <BookOpen size={16} style={{ color }} />;
}

function statusLabel(status: Exercise['status']): string {
  if (status === 'complete') return 'Completed';
  if (status === 'progress') return 'In Progress';
  if (status === 'locked') return 'Locked';
  return 'Not Started';
}

// ─── Exercise list item ───────────────────────────────────────────────────────

interface ExerciseRowProps {
  exercise: Exercise;
  isActive: boolean;
  onClick: () => void;
}

function ExerciseRow({ exercise, isActive, onClick }: ExerciseRowProps) {
  const isLocked = exercise.status === 'locked';
  return (
    <button
      type="button"
      disabled={isLocked}
      onClick={onClick}
      className={[
        'w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
        isActive
          ? 'bg-navy-50 text-navy'
          : isLocked
            ? 'opacity-50 cursor-default text-content-secondary'
            : 'hover:bg-surface-tertiary text-content-secondary hover:text-content-primary',
      ].join(' ')}
    >
      <div className="mt-0.5 shrink-0">{statusIcon(exercise.status, exercise.color)}</div>
      <div className="min-w-0 flex-1">
        <Text
          size="sm"
          weight={isActive ? 'semibold' : 'medium'}
          className={isActive ? 'text-navy' : undefined}
        >
          {exercise.name}
        </Text>
        <div className="flex items-center gap-1 mt-0.5">
          <Clock size={11} style={{ color: colors.content.tertiary }} />
          <Text size="xs" color="tertiary">{exercise.time}</Text>
        </div>
      </div>
    </button>
  );
}

// ─── Exercise detail panel ────────────────────────────────────────────────────

interface ExerciseDetailProps {
  exercise: Exercise | null;
}

function ExerciseDetail({ exercise }: ExerciseDetailProps) {
  if (!exercise) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-8 text-center">
        <BookOpen size={32} style={{ color: colors.content.tertiary }} />
        <Text color="tertiary">Select an exercise to view details</Text>
      </div>
    );
  }

  const isLocked = exercise.status === 'locked';

  return (
    <div className="rounded-xl border border-border bg-white p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${exercise.color}15`, color: exercise.color }}
        >
          <PlayCircle size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <Title level={4} weight="bold" color="primary">{exercise.name}</Title>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <div className="flex items-center gap-1">
              <Clock size={13} style={{ color: colors.content.tertiary }} />
              <Text size="xs" color="tertiary">{exercise.time}</Text>
            </div>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={
                exercise.status === 'complete'
                  ? { color: colors.success.dark, backgroundColor: `${colors.success.light}40` }
                  : exercise.status === 'progress'
                    ? { color: colors.warning.dark, backgroundColor: `${colors.warning.light}40` }
                    : { color: colors.content.tertiary, backgroundColor: `${colors.content.tertiary}15` }
              }
            >
              {statusLabel(exercise.status)}
            </span>
            {exercise.proctored && (
              <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-semibold text-navy">
                Proctored
              </span>
            )}
          </div>
        </div>
      </div>

      <Text color="secondary" size="sm" className="leading-relaxed">{exercise.desc}</Text>

      {/* Progress */}
      {exercise.pct > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <Text size="xs" color="tertiary">Progress</Text>
            <Text size="xs" weight="semibold" color="primary">{exercise.pct}%</Text>
          </div>
          <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${exercise.pct}%`, backgroundColor: exercise.color }}
            />
          </div>
        </div>
      )}

      {/* CTA */}
      {!isLocked && (
        <div className="pt-2">
          <Button variant="primary">
            {exercise.status === 'complete' ? 'Review' : exercise.status === 'progress' ? 'Continue' : 'Start'}
          </Button>
        </div>
      )}

      {isLocked && (
        <Alert
          type="info"
          showIcon
          icon={<Lock size={14} />}
          message="This exercise is locked until previous exercises are completed."
        />
      )}
    </div>
  );
}

// ─── Collapsible Hero Banner ──────────────────────────────────────────────────

interface CollapsibleHeroBannerProps {
  program: Program;
  totalExercises: number;
  completedExercises: number;
}

function CollapsibleHeroBanner({
  program,
  totalExercises,
  completedExercises,
}: CollapsibleHeroBannerProps) {
  const [collapsed, setCollapsed] = useState(false);

  const completionPct = totalExercises > 0
    ? Math.round((completedExercises / totalExercises) * 100)
    : 0;

  // Estimate time remaining: each exercise ~20 min average
  const remainingExercises = totalExercises - completedExercises;
  const estimatedMinutes = remainingExercises * 20;
  const timeRemaining = estimatedMinutes >= 60
    ? `${Math.floor(estimatedMinutes / 60)}h ${estimatedMinutes % 60}m`
    : `${estimatedMinutes}m`;

  return (
    <div
      className="rounded-xl overflow-hidden border shadow-sm"
      style={{ borderColor: `${program.accent}30` }}
    >
      {/* Accent stripe */}
      <div className="h-1 w-full" style={{ backgroundColor: program.accent }} />

      {/* Always-visible collapsed row */}
      <div
        className={cn(
          'flex items-center gap-3 px-5 py-3 cursor-pointer select-none',
          'transition-colors duration-150 hover:bg-surface-secondary',
        )}
        style={{ backgroundColor: `${program.accent}08` }}
        onClick={() => setCollapsed((c) => !c)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setCollapsed((c) => !c);
        }}
        aria-expanded={!collapsed}
      >
        <Title level={4} weight="semibold" color="primary" className="flex-1 !mb-0 truncate">
          {program.name}
        </Title>

        {/* Mini progress bar (always visible) */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="w-28 h-1.5 rounded-full bg-surface-tertiary overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%`, backgroundColor: program.accent }}
            />
          </div>
          <Text size="xs" weight="semibold" color="secondary">{completionPct}%</Text>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-lg p-1 transition-colors hover:bg-surface-tertiary"
          style={{ color: colors.content.tertiary }}
          aria-label={collapsed ? 'Expand banner' : 'Collapse banner'}
          onClick={(e) => { e.stopPropagation(); setCollapsed((c) => !c); }}
        >
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {/* Expandable content */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          collapsed ? 'max-h-0' : 'max-h-96',
        )}
      >
        <div
          className="px-5 pb-5 pt-1 space-y-4"
          style={{ backgroundColor: `${program.accent}05` }}
        >
          {/* Description */}
          <Text size="sm" color="secondary" className="leading-relaxed">
            {program.desc}
          </Text>

          {/* Metrics row */}
          <div className="flex flex-wrap gap-5">
            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${program.accent}15`, color: program.accent }}
              >
                <CheckCircle size={14} />
              </div>
              <div>
                <Text size="xs" color="tertiary" className="leading-none">Exercises</Text>
                <Text size="sm" weight="semibold" color="primary">
                  {completedExercises}/{totalExercises} done
                </Text>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${colors.warning.DEFAULT}15`, color: colors.warning.DEFAULT }}
              >
                <Clock size={14} />
              </div>
              <div>
                <Text size="xs" color="tertiary" className="leading-none">Time Remaining</Text>
                <Text size="sm" weight="semibold" color="primary">~{timeRemaining}</Text>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${colors.teal.DEFAULT}15`, color: colors.teal.DEFAULT }}
              >
                <Target size={14} />
              </div>
              <div>
                <Text size="xs" color="tertiary" className="leading-none">Completion</Text>
                <Text size="sm" weight="semibold" color="primary">{completionPct}%</Text>
              </div>
            </div>
          </div>

          {/* Full progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Text size="xs" color="tertiary">Overall progress</Text>
              <Text size="xs" weight="semibold" color="primary">{completedExercises} of {totalExercises} exercises</Text>
            </div>
            <div className="h-2 w-full rounded-full bg-surface-tertiary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${completionPct}%`, backgroundColor: program.accent }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createLazyFileRoute('/programs/$programId/tasks')({
  component: ProgramTasksPage,
});

function ProgramTasksPage() {
  const { programId } = Route.useParams();
  const navigate = useNavigate();
  const program = useProgramStore((s) => s.programs[programId]);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);

  if (!program) {
    return (
      <DashboardLayout sidebarItems={SIDEBAR_ITEMS} user={MOCK_USER} title="Lighthouse" activeKey="programs">
        <div className="p-6">
          <Alert type="error" message="Program not found" showIcon />
        </div>
      </DashboardLayout>
    );
  }

  const allExercises = [...program.seqExercises, ...program.openExercises];
  const activeExercise = allExercises.find((e) => e.id === activeExerciseId) ?? null;
  const completedCount = allExercises.filter((e) => e.status === 'complete').length;

  return (
    <DashboardLayout
      sidebarItems={SIDEBAR_ITEMS}
      user={MOCK_USER}
      title="Lighthouse"
      activeKey="programs"
    >
      <div className="p-6 space-y-6">

        {/* Breadcrumb + back */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({ to: '/programs/$programId', params: { programId } })}
            className="flex items-center gap-1 text-content-secondary hover:text-navy transition-colors"
          >
            <ChevronLeft size={16} />
            <Text size="sm">Back to {program.name}</Text>
          </button>
        </div>

        {/* Collapsible hero banner */}
        <CollapsibleHeroBanner
          program={program}
          totalExercises={allExercises.length}
          completedExercises={completedCount}
        />

        {/* Two-column layout: exercise list + detail */}
        <div className="flex gap-5">

          {/* Left: exercise list */}
          <aside className="w-72 shrink-0 space-y-4">

            {program.seqExercises.length > 0 && (
              <div>
                <Text size="xs" weight="semibold" color="tertiary" className="px-3 mb-2 block uppercase tracking-wide">
                  Sequential
                </Text>
                <div className="space-y-0.5">
                  {program.seqExercises.map((exercise) => (
                    <ExerciseRow
                      key={exercise.id}
                      exercise={exercise}
                      isActive={activeExerciseId === exercise.id}
                      onClick={() => setActiveExerciseId(exercise.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {program.openExercises.length > 0 && (
              <div>
                {program.seqExercises.length > 0 && <Divider className="my-3" />}
                <Text size="xs" weight="semibold" color="tertiary" className="px-3 mb-2 block uppercase tracking-wide">
                  Open
                </Text>
                <div className="space-y-0.5">
                  {program.openExercises.map((exercise) => (
                    <ExerciseRow
                      key={exercise.id}
                      exercise={exercise}
                      isActive={activeExerciseId === exercise.id}
                      onClick={() => setActiveExerciseId(exercise.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Right: exercise detail */}
          <main className="flex-1 min-w-0">
            <ExerciseDetail exercise={activeExercise} />
          </main>
        </div>

        {/* Assessment centers */}
        {program.centers.length > 0 && (
          <section>
            <Title level={4} weight="semibold" color="primary" className="mb-4">
              Assessment Centers
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {program.centers.map((center) => {
                const isLocked = center.status === 'locked';
                return (
                  <div
                    key={center.id}
                    className={[
                      'rounded-xl border border-border bg-white p-5 space-y-3',
                      isLocked ? 'opacity-60' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${center.color}15`, color: center.color }}
                      >
                        <Target size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Text size="sm" weight="semibold" color="primary">{center.name}</Text>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock size={12} style={{ color: colors.content.tertiary }} />
                          <Text size="xs" color="tertiary">{center.time}</Text>
                          {isLocked && <Lock size={12} style={{ color: colors.content.tertiary }} />}
                        </div>
                      </div>
                    </div>
                    <Text size="xs" color="secondary" className="leading-relaxed">{center.desc}</Text>
                    {!isLocked && (
                      <Button size="sm" variant="secondary">
                        View Center
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
