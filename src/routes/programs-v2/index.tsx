import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, Clock, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Progress } from 'antd';

import { Icon, Illustration, Text, Title } from '@/forge';
import { DashboardLayout } from '@/forge/layouts';
import { cn } from '@/forge/utils';
import { colors } from '@/forge/tokens';
import { programList } from '@/data/programs';
import type { Program, Exercise } from '@/types/program';
import { useTranslation } from '@/i18n';
import { useThemeStore } from '@/stores/useThemeStore';
import { useSidebarItems } from '@/hooks';
import type { IconName } from '@/forge';

const MOCK_USER = {
  name: 'Priya Sharma',
  role: 'Senior Manager',
};

const iconMap: Record<string, IconName> = {
  chart: 'ChartBar',
  users: 'Users',
};

/* ── Status config ──────────────────────────────────────── */

type ExerciseStatus = Exercise['status'];

interface StatusStyle {
  label: string;
  color: string;
  bg: string;
  icon?: React.ReactNode;
}

const statusStyles: Record<ExerciseStatus, StatusStyle> = {
  complete: {
    label: 'Complete',
    color: colors.success.dark,
    bg: `${colors.success.DEFAULT}15`,
    icon: <CheckCircle2 size={10} />,
  },
  progress: {
    label: 'In Progress',
    color: colors.warning.dark,
    bg: `${colors.warning.DEFAULT}15`,
  },
  notstarted: {
    label: 'New',
    color: colors.teal.DEFAULT,
    bg: `${colors.teal.DEFAULT}15`,
    icon: <Sparkles size={10} />,
  },
  locked: {
    label: 'Locked',
    color: colors.content.tertiary,
    bg: `${colors.content.tertiary}12`,
    icon: <Lock size={10} />,
  },
};

/* ── Exercise illustration card ─────────────────────────── */

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const status = statusStyles[exercise.status];
  const isLocked = exercise.status === 'locked';
  const isComplete = exercise.status === 'complete';
  const isProgress = exercise.status === 'progress';
  const accentColor = exercise.color;

  return (
    <div
      className={cn(
        'group relative flex w-48 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-solid border-border bg-surface-primary shadow-sm transition-all duration-200',
        isLocked
          ? 'opacity-55 grayscale-[40%]'
          : 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5',
      )}
    >
      {/* Illustration area — tinted with exercise accent */}
      <div
        className="relative flex items-center justify-center p-5"
        style={{ backgroundColor: `${accentColor}08` }}
      >
        {/* Status badge */}
        <span
          className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold leading-none"
          style={{ backgroundColor: status.bg, color: status.color }}
        >
          {status.icon}
          {status.label}
        </span>

        <Illustration name={exercise.illustration ?? ''} size="lg" />

        {/* Completed indicator */}
        {isComplete && (
          <div
            className="absolute bottom-2 left-3 flex size-5 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.success.DEFAULT, color: '#fff' }}
          >
            <CheckCircle2 size={12} />
          </div>
        )}
      </div>

      {/* Content area — generous padding for breathing room */}
      <div className="flex flex-1 flex-col items-center px-4 pt-3 pb-4">
        <Text size="xs" weight="semibold" color="primary" className="text-center leading-snug line-clamp-2">
          {exercise.name}
        </Text>

        <div className="mt-2 flex items-center gap-1.5">
          <Clock size={11} className="text-content-tertiary" />
          <Text size="xs" color="tertiary">{exercise.time}</Text>
        </div>

        {/* Progress bar for in-progress */}
        {isProgress && exercise.pct > 0 && (
          <div className="mt-3 w-full">
            <Progress
              percent={exercise.pct}
              showInfo={false}
              strokeColor={accentColor}
              trailColor="var(--lh-surface-tertiary)"
              size="small"
            />
          </div>
        )}
      </div>

      {/* Accent bottom strip */}
      <div
        className="h-[3px] w-full"
        style={{
          backgroundColor: isComplete
            ? colors.success.DEFAULT
            : isProgress
              ? accentColor
              : 'transparent',
        }}
      />
    </div>
  );
}

/* ── Horizontal scroll container ────────────────────────── */

function ScrollRow({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 flex size-9 items-center justify-center rounded-full border border-solid border-border bg-surface-elevated shadow-md transition hover:bg-surface-tertiary"
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} className="text-content-secondary" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-1 px-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {children}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 flex size-9 items-center justify-center rounded-full border border-solid border-border bg-surface-elevated shadow-md transition hover:bg-surface-tertiary"
          aria-label="Scroll right"
        >
          <ChevronRight size={16} className="text-content-secondary" />
        </button>
      )}
    </div>
  );
}

/* ── Program section ────────────────────────────────────── */

function ProgramSection({ program }: { program: Program }) {
  const allExercises = [...program.seqExercises, ...program.openExercises];
  const completedCount = allExercises.filter((e) => e.status === 'complete').length;
  const navigate = useNavigate();
  const iconName = iconMap[program.icon] ?? 'ChartBar';

  return (
    <section className="overflow-hidden rounded-2xl border border-solid border-border bg-surface-primary shadow-sm">
      {/* Program header */}
      <div
        className="px-7 pt-7 pb-6"
        style={{
          background: `linear-gradient(180deg, ${program.accent}06 0%, transparent 100%)`,
        }}
      >
        <div
          className="flex items-start gap-4 cursor-pointer"
          onClick={() => navigate({ to: '/programs/$programId', params: { programId: program.id } })}
        >
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${program.accent}12`, color: program.accent }}
          >
            <Icon name={iconName} size="lg" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Title level={4} weight="bold" color="primary">
                {program.name}
              </Title>
              <ChevronRight size={16} className="shrink-0 text-content-tertiary" />
            </div>

            <Text size="sm" color="secondary" className="mt-1.5 block leading-relaxed">
              {program.desc}
            </Text>
          </div>
        </div>

        {/* Progress row — aligned with title text */}
        <div className="mt-5 ml-16 flex items-center gap-5">
          <Progress
            percent={program.pct}
            strokeColor={program.accent}
            trailColor="var(--lh-surface-tertiary)"
            size="small"
            className="flex-1 max-w-56"
            format={(pct) => (
              <Text size="xs" weight="semibold" color="tertiary">{pct}%</Text>
            )}
          />

          <Text size="xs" color="tertiary">
            {completedCount}/{allExercises.length} done
          </Text>

          {program.daysLeft > 0 && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{
                backgroundColor: program.daysLeft <= 14
                  ? `${colors.error.DEFAULT}12`
                  : `${colors.content.tertiary}10`,
                color: program.daysLeft <= 14 ? colors.error.dark : colors.content.tertiary,
              }}
            >
              <Clock size={11} />
              {program.daysLeft}d left
            </span>
          )}
        </div>
      </div>

      {/* Separator with spacing */}
      <div className="mx-7 border-t border-border" />

      {/* Exercise cards — generous padding for negative space */}
      {allExercises.length > 0 && (
        <div className="px-7 py-6">
          <ScrollRow>
            {allExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </ScrollRow>
        </div>
      )}
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────── */

export const Route = createFileRoute('/programs-v2/')({
  component: ProgramsV2IndexPage,
});

function ProgramsV2IndexPage() {
  const locale = useThemeStore((s) => s.locale);
  const { t } = useTranslation(locale);
  const sidebarItems = useSidebarItems();

  const activePrograms = programList.filter((p) => p.status === 'progress');
  const completedPrograms = programList.filter((p) => p.status === 'complete');
  const lockedPrograms = programList.filter((p) => p.status === 'locked');

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      user={MOCK_USER}
      title="Lighthouse"
      activeKey="programs"
    >
      <div className="px-8 py-10 space-y-12 max-w-7xl mx-auto">
        {/* Page header */}
        <div>
          <Title level={3} weight="bold" color="primary">
            {t('programs.title')}
          </Title>
          <Text color="secondary" size="sm" className="mt-2">
            {programList.length} {t('nav.programs').toLowerCase()} · {activePrograms.length} {t('status.active').toLowerCase()}
          </Text>
        </div>

        {/* Active programs */}
        {activePrograms.length > 0 && (
          <div className="space-y-6">
            <Title level={4} weight="semibold" color="primary">
              {t('status.active')} ({activePrograms.length})
            </Title>
            <div className="space-y-8">
              {activePrograms.map((program) => (
                <ProgramSection key={program.id} program={program} />
              ))}
            </div>
          </div>
        )}

        {/* Completed programs */}
        {completedPrograms.length > 0 && (
          <div className="space-y-6">
            <Title level={4} weight="semibold" color="primary">
              {t('status.completed')} ({completedPrograms.length})
            </Title>
            <div className="space-y-8">
              {completedPrograms.map((program) => (
                <ProgramSection key={program.id} program={program} />
              ))}
            </div>
          </div>
        )}

        {/* Locked programs */}
        {lockedPrograms.length > 0 && (
          <div className="space-y-6">
            <Title level={4} weight="semibold" color="primary">
              {t('status.upcoming')} ({lockedPrograms.length})
            </Title>
            <div className="space-y-8">
              {lockedPrograms.map((program) => (
                <ProgramSection key={program.id} program={program} />
              ))}
            </div>
          </div>
        )}

        <div className="h-12" aria-hidden="true" />
      </div>
    </DashboardLayout>
  );
}
