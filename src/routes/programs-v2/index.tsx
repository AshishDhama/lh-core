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
        'group relative flex w-44 shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-solid border-border bg-surface-primary shadow-sm transition-all duration-200',
        isLocked
          ? 'opacity-60 grayscale-[40%]'
          : 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5',
      )}
    >
      {/* Illustration area — tinted with exercise accent color */}
      <div
        className="relative flex items-center justify-center px-3 pt-3 pb-2"
        style={{ backgroundColor: `${accentColor}08` }}
      >
        {/* Status badge — top-right */}
        <span
          className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold leading-tight"
          style={{ backgroundColor: status.bg, color: status.color }}
        >
          {status.icon}
          {status.label}
        </span>

        <Illustration name={exercise.illustration ?? ''} size="lg" />

        {/* Completed checkmark overlay */}
        {isComplete && (
          <div
            className="absolute bottom-1 left-2 flex size-5 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.success.DEFAULT, color: '#fff' }}
          >
            <CheckCircle2 size={12} />
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col px-3 pt-2 pb-3">
        <Text size="xs" weight="semibold" color="primary" className="text-center leading-snug line-clamp-2">
          {exercise.name}
        </Text>

        <div className="mt-1.5 flex items-center justify-center gap-1">
          <Clock size={11} className="text-content-tertiary" />
          <Text size="xs" color="tertiary">{exercise.time}</Text>
        </div>

        {/* Progress bar for in-progress exercises */}
        {isProgress && exercise.pct > 0 && (
          <div className="mt-2">
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
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' });
  };

  return (
    <div className="relative group/scroll">
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 flex size-8 items-center justify-center rounded-full border border-solid border-border bg-surface-elevated shadow-md transition hover:bg-surface-tertiary"
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} className="text-content-secondary" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory py-1 px-0.5"
        style={{ scrollbarWidth: 'none' }}
      >
        {children}
      </div>

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 flex size-8 items-center justify-center rounded-full border border-solid border-border bg-surface-elevated shadow-md transition hover:bg-surface-tertiary"
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
    <section
      className="overflow-hidden rounded-2xl border border-solid border-border bg-surface-primary shadow-sm"
    >
      {/* Program header — with accent-tinted top strip */}
      <div
        className="px-5 pt-5 pb-4"
        style={{
          background: `linear-gradient(to bottom, ${program.accent}06, transparent)`,
        }}
      >
        <div
          className="flex items-start gap-3 cursor-pointer"
          onClick={() => navigate({ to: '/programs/$programId', params: { programId: program.id } })}
        >
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${program.accent}15`, color: program.accent }}
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
            <Text size="sm" color="secondary" className="mt-0.5 block leading-relaxed">
              {program.desc}
            </Text>
          </div>
        </div>

        {/* Progress row */}
        <div className="mt-3 ml-14 flex items-center gap-4">
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
          <span className="flex items-center gap-1.5">
            <Text size="xs" color="tertiary">
              {completedCount}/{allExercises.length} done
            </Text>
          </span>
          {program.daysLeft > 0 && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
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

      {/* Separator */}
      <div className="mx-5 border-t border-border" />

      {/* Exercise cards */}
      {allExercises.length > 0 && (
        <div className="px-5 py-4">
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
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <Title level={3} weight="bold" color="primary">
            {t('programs.title')}
          </Title>
          <Text color="secondary" size="sm" className="mt-1">
            {programList.length} {t('nav.programs').toLowerCase()} · {activePrograms.length} {t('status.active').toLowerCase()}
          </Text>
        </div>

        {/* Active programs */}
        {activePrograms.length > 0 && (
          <div className="space-y-5">
            <Title level={4} weight="semibold" color="primary">
              {t('status.active')} ({activePrograms.length})
            </Title>
            {activePrograms.map((program) => (
              <ProgramSection key={program.id} program={program} />
            ))}
          </div>
        )}

        {/* Completed programs */}
        {completedPrograms.length > 0 && (
          <div className="space-y-5">
            <Title level={4} weight="semibold" color="primary">
              {t('status.completed')} ({completedPrograms.length})
            </Title>
            {completedPrograms.map((program) => (
              <ProgramSection key={program.id} program={program} />
            ))}
          </div>
        )}

        {/* Locked programs */}
        {lockedPrograms.length > 0 && (
          <div className="space-y-5">
            <Title level={4} weight="semibold" color="primary">
              {t('status.upcoming')} ({lockedPrograms.length})
            </Title>
            {lockedPrograms.map((program) => (
              <ProgramSection key={program.id} program={program} />
            ))}
          </div>
        )}

        <div className="h-8" aria-hidden="true" />
      </div>
    </DashboardLayout>
  );
}
