import { useState } from 'react';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { Alert } from 'antd';
import { BookOpen, CalendarDays, CheckCircle, ChartBar, Clock, Play, Target } from 'lucide-react';

import { Button, Text, Title } from '@/forge';
import type { SidebarItem } from '@/forge';
import { DashboardLayout } from '@/forge/layouts';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';
import { useProgramStore } from '@/stores/useProgramStore';

// ─── Sidebar (shared with other pages) ───────────────────────────────────────

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

// ─── Video Thumbnail ──────────────────────────────────────────────────────────

const MOCK_VIDEO_DURATION = '12:30';

interface VideoThumbnailProps {
  accentColor: string;
}

function VideoThumbnail({ accentColor }: VideoThumbnailProps) {
  const [watched, setWatched] = useState(false);
  const [animating, setAnimating] = useState(false);

  function handlePlay() {
    if (watched) return;
    setAnimating(true);
    setTimeout(() => {
      setWatched(true);
      setAnimating(false);
    }, 600);
  }

  return (
    <div className="max-w-4xl mx-auto px-8 pt-6">
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-2xl shadow-lg cursor-pointer group',
          'transition-transform duration-200 hover:scale-[1.01]',
        )}
        style={{ aspectRatio: '16 / 9' }}
        onClick={handlePlay}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePlay(); }}
        aria-label={watched ? 'Program intro video (watched)' : 'Play program intro video'}
      >
        {/* Gradient placeholder background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.navy.DEFAULT} 0%, ${colors.teal.DEFAULT} 100%)`,
          }}
        />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px), radial-gradient(circle at 70% 80%, white 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Gradient overlay for bottom text area */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40',
              'transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110',
              animating && 'scale-125 opacity-0',
              watched && 'bg-success/20 border-success/60',
            )}
          >
            {watched ? (
              <CheckCircle size={28} color="white" />
            ) : (
              <Play size={28} color="white" fill="white" />
            )}
          </div>
        </div>

        {/* Bottom bar: duration + watched badge */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-1.5">
            <Clock size={13} color="white" className="opacity-80" />
            <span className="text-white text-xs font-medium opacity-90">{MOCK_VIDEO_DURATION}</span>
          </div>

          {watched && (
            <span
              className={cn(
                'flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                'transition-all duration-500',
              )}
              style={{ backgroundColor: `${colors.teal.DEFAULT}cc`, color: 'white' }}
            >
              <CheckCircle size={11} />
              Watched
            </span>
          )}

          {!watched && (
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white/80"
              style={{ backgroundColor: `${accentColor}55` }}
            >
              Program Intro
            </span>
          )}
        </div>
      </div>

      {!watched && (
        <p className="mt-2 text-xs text-center" style={{ color: colors.content.tertiary }}>
          Watch the intro video to get oriented before starting your exercises.
        </p>
      )}
    </div>
  );
}

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createLazyFileRoute('/programs/$programId/')({
  component: ProgramInstructionsPage,
});

function ProgramInstructionsPage() {
  const { programId } = Route.useParams();
  const navigate = useNavigate();
  const program = useProgramStore((s) => s.programs[programId]);

  const totalExercises =
    (program?.seqExercises.length ?? 0) + (program?.openExercises.length ?? 0);
  const completedExercises = [
    ...(program?.seqExercises ?? []),
    ...(program?.openExercises ?? []),
  ].filter((e) => e.status === 'complete').length;

  if (!program) {
    return (
      <DashboardLayout sidebarItems={SIDEBAR_ITEMS} user={MOCK_USER} title="Lighthouse" activeKey="programs">
        <div className="p-6">
          <Alert
            type="error"
            message="Program not found"
            description={`No program with id "${programId}" exists.`}
            showIcon
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      sidebarItems={SIDEBAR_ITEMS}
      user={MOCK_USER}
      title="Lighthouse"
      activeKey="programs"
    >
      {/* Hero banner */}
      <div
        className="relative overflow-hidden px-8 py-12"
        style={{
          background: `linear-gradient(135deg, ${program.accent}18 0%, ${program.accent}08 100%)`,
          borderBottom: `1px solid ${program.accent}22`,
        }}
      >
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <div
            className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: `${program.accent}18`, color: program.accent }}
          >
            <BookOpen size={12} />
            Program Overview
          </div>

          <Title level={2} weight="bold" color="primary">
            {program.name}
          </Title>

          <Text color="secondary" size="sm" className="max-w-2xl leading-relaxed">
            {program.desc}
          </Text>

          {/* Meta row */}
          <div className="flex flex-wrap gap-5 mt-2">
            <div className="flex items-center gap-1.5">
              <CalendarDays size={15} style={{ color: colors.content.tertiary }} />
              <Text size="sm" color="tertiary">Due {program.due}</Text>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={15} style={{ color: colors.content.tertiary }} />
              <Text size="sm" color="tertiary">{totalExercises} exercises</Text>
            </div>
            <div className="flex items-center gap-1.5">
              <Target size={15} style={{ color: colors.content.tertiary }} />
              <Text size="sm" color="tertiary">{program.pct}% complete</Text>
            </div>
            {program.centers.length > 0 && (
              <div className="flex items-center gap-1.5">
                <ChartBar size={15} style={{ color: colors.content.tertiary }} />
                <Text size="sm" color="tertiary">{program.centers.length} assessment {program.centers.length === 1 ? 'center' : 'centers'}</Text>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video thumbnail */}
      <VideoThumbnail accentColor={program.accent} />

      {/* Page body */}
      <div className="p-6 max-w-4xl mx-auto space-y-8">

        {/* Instructions */}
        <section>
          <Title level={4} weight="semibold" color="primary" className="mb-4">
            Before You Begin
          </Title>
          <div className="rounded-xl border border-border bg-white p-5 space-y-3">
            {program.instructions.map((instruction, idx) => (
              <div key={idx} className="flex gap-3">
                <div
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: program.accent }}
                >
                  {idx + 1}
                </div>
                <Text size="sm" color="secondary" className="leading-relaxed">
                  {instruction}
                </Text>
              </div>
            ))}
          </div>
        </section>

        {/* Module overview */}
        <section>
          <Title level={4} weight="semibold" color="primary" className="mb-4">
            Modules ({completedExercises}/{totalExercises} completed)
          </Title>
          <div className="space-y-2">
            {program.seqExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3"
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: exercise.status === 'complete'
                      ? `${colors.success.DEFAULT}15`
                      : `${exercise.color}15`,
                    color: exercise.status === 'complete' ? colors.success.DEFAULT : exercise.color,
                  }}
                >
                  <CheckCircle size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <Text size="sm" weight="medium" color="primary">{exercise.name}</Text>
                  <Text size="xs" color="tertiary">{exercise.time}</Text>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={
                    exercise.status === 'complete'
                      ? { color: colors.success.dark, backgroundColor: `${colors.success.light}40` }
                      : exercise.status === 'progress'
                        ? { color: colors.warning.dark, backgroundColor: `${colors.warning.light}40` }
                        : { color: colors.content.tertiary, backgroundColor: `${colors.content.tertiary}15` }
                  }
                >
                  {exercise.status === 'complete' ? 'Done' : exercise.status === 'progress' ? 'In Progress' : 'Locked'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate({ to: '/programs/$programId/tasks', params: { programId } })}
          >
            {program.pct > 0 ? 'Continue Program' : 'Start Program'}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate({ to: '/' })}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
