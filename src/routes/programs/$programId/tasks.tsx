import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Alert, Divider } from 'antd';
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  Clock,
  Lock,
  PlayCircle,
  Target,
} from 'lucide-react';

import { Button, Text, Title } from '@/forge';
import { DashboardLayout } from '@/forge/layouts';
import { colors } from '@/forge/tokens';
import type { Exercise } from '@/types/program';
import { useProgramStore } from '@/stores/useProgramStore';
import { useTranslation } from '@/i18n';
import { useThemeStore } from '@/stores/useThemeStore';
import { useSidebarItems } from '@/hooks';

// ─── Shared constants ────────────────────────────────────────────────────────

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

function statusLabel(status: Exercise['status'], t: (key: string) => string): string {
  if (status === 'complete') return t('status.completed');
  if (status === 'progress') return t('status.inProgress');
  if (status === 'locked') return t('status.locked');
  return t('status.notStarted');
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
          ? 'bg-navy-50 dark:bg-navy-900/20 text-navy dark:text-navy-200'
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
          className={isActive ? 'text-navy dark:text-navy-200' : undefined}
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
  const locale = useThemeStore((s) => s.locale);
  const { t } = useTranslation(locale);

  if (!exercise) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-8 text-center">
        <BookOpen size={32} style={{ color: colors.content.tertiary }} />
        <Text color="tertiary">{t('programs.selectExercise')}</Text>
      </div>
    );
  }

  const isLocked = exercise.status === 'locked';

  return (
    <div className="rounded-xl border border-border bg-surface-primary p-6 space-y-5">
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
              {statusLabel(exercise.status, t)}
            </span>
            {exercise.proctored && (
              <span className="rounded-full bg-navy-50 dark:bg-navy-900/20 px-2.5 py-0.5 text-xs font-semibold text-navy dark:text-navy-200">
                {t('programs.proctored')}
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
            <Text size="xs" color="tertiary">{t('programs.progress')}</Text>
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
            {exercise.status === 'complete' ? t('actions.review') : exercise.status === 'progress' ? t('actions.continue') : t('actions.start')}
          </Button>
        </div>
      )}

      {isLocked && (
        <Alert
          type="info"
          showIcon
          icon={<Lock size={14} />}
          message={t('programs.lockedExerciseMessage')}
        />
      )}
    </div>
  );
}

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute('/programs/$programId/tasks')({
  component: ProgramTasksPage,
});

function ProgramTasksPage() {
  const locale = useThemeStore((s) => s.locale);
  const { t } = useTranslation(locale);
  const { programId } = Route.useParams();
  const navigate = useNavigate();
  const program = useProgramStore((s) => s.programs[programId]);
  const sidebarItems = useSidebarItems();
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);

  if (!program) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} user={MOCK_USER} title="Lighthouse" activeKey="programs">
        <div className="p-6">
          <Alert type="error" message="Program not found" showIcon />
        </div>
      </DashboardLayout>
    );
  }

  const allExercises = [...program.seqExercises, ...program.openExercises];
  const activeExercise = allExercises.find((e) => e.id === activeExerciseId) ?? null;

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
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
            className="flex items-center gap-1 text-content-secondary hover:text-navy dark:hover:text-navy-200 transition-colors"
          >
            <ChevronLeft size={16} />
            <Text size="sm">Back to {program.name}</Text>
          </button>
        </div>

        {/* Page title */}
        <div>
          <Title level={3} weight="bold" color="primary">{program.name}</Title>
          <Text color="secondary" size="sm">
            {allExercises.filter((e) => e.status === 'complete').length}/{allExercises.length} exercises completed
          </Text>
        </div>

        {/* Two-column layout: exercise list + detail */}
        <div className="flex gap-5">

          {/* Left: exercise list */}
          <aside className="w-72 shrink-0 space-y-4">

            {program.seqExercises.length > 0 && (
              <div>
                <Text size="xs" weight="semibold" color="tertiary" className="px-3 mb-2 block uppercase tracking-wide">
                  {t('programs.sequential')}
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
                  {t('programs.open')}
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
              {t('programs.assessmentCenters')}
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {program.centers.map((center) => {
                const isLocked = center.status === 'locked';
                return (
                  <div
                    key={center.id}
                    className={[
                      'rounded-xl border border-border bg-surface-primary p-5 space-y-3',
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
                        {t('programs.viewCenter')}
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
