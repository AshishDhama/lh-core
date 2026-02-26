import { createFileRoute } from '@tanstack/react-router';

import { cn } from '@/forge/utils';
import { Text, Overline } from '@/forge/primitives/Typography';
import { Icon } from '@/forge/primitives/Icon';
import { DashboardWelcomeHero } from '@/forge/composites/DashboardWelcomeHero';
import { DashboardProgrammeCard } from '@/forge/composites/DashboardProgrammeCard';
import { DashboardDeadlineStrip } from '@/forge/composites/DashboardDeadlineStrip';
import { programList } from '@/data/programs';

import type { Program, Exercise } from '@/types/program';
import type { ItemStatus } from '@/types/common';
import type { IconName } from '@/forge/primitives/Icon';

export const Route = createFileRoute('/brilliant/dashboard')({
  component: DashboardHomePage,
});

function overallProgress(programs: Program[]): number {
  if (programs.length === 0) return 0;
  const total = programs.reduce((sum, p) => sum + p.pct, 0);
  return Math.round(total / programs.length);
}

function nearestDeadline(programs: Program[]): Program | undefined {
  return [...programs].sort((a, b) => a.daysLeft - b.daysLeft)[0];
}

function exerciseCounts(program: Program): { completed: number; total: number } {
  const all = [...program.seqExercises, ...program.openExercises];
  const completed = all.filter((e) => e.status === 'complete').length;
  return { completed, total: all.length };
}

function allExercises(programs: Program[]): Array<Exercise & { programName: string }> {
  const result: Array<Exercise & { programName: string }> = [];
  for (const p of programs) {
    for (const ex of p.seqExercises) {
      result.push({ ...ex, programName: p.name });
    }
    for (const ex of p.openExercises) {
      result.push({ ...ex, programName: p.name });
    }
  }
  return result;
}

function statusMeta(status: ItemStatus): {
  icon: IconName;
  dotClass: string;
  lineClass: string;
  labelColor: 'primary' | 'secondary' | 'tertiary';
} {
  switch (status) {
    case 'complete':
      return {
        icon: 'CircleCheckBig',
        dotClass: 'bg-success-dark text-white',
        lineClass: 'bg-success-dark',
        labelColor: 'secondary',
      };
    case 'progress':
      return {
        icon: 'Play',
        dotClass: 'bg-subject-code text-white',
        lineClass: 'bg-subject-code-light',
        labelColor: 'primary',
      };
    case 'notstarted':
      return {
        icon: 'Circle',
        dotClass: 'bg-surface-tertiary text-content-tertiary',
        lineClass: 'bg-border-subtle',
        labelColor: 'tertiary',
      };
    case 'locked':
      return {
        icon: 'Lock',
        dotClass: 'bg-surface-tertiary text-content-tertiary',
        lineClass: 'bg-border-subtle',
        labelColor: 'tertiary',
      };
  }
}

function JourneyTimeline({ programs }: { programs: Program[] }) {
  const exercises = allExercises(programs);

  return (
    <div className="rounded-3xl bg-surface-card shadow-soft p-6">
      <div className="flex items-center gap-2 mb-5">
        <Icon name="Route" size="md" className="text-content-tertiary" />
        <Overline color="tertiary">Assessment Journey</Overline>
      </div>

      <ol className="relative space-y-0">
        {exercises.map((ex, i) => {
          const meta = statusMeta(ex.status);
          const isLast = i === exercises.length - 1;

          return (
            <li key={`${ex.programName}-${ex.id}`} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast && (
                <div
                  className={cn(
                    'absolute left-[15px] top-[32px] w-0.5 bottom-0',
                    meta.lineClass,
                  )}
                  aria-hidden="true"
                />
              )}

              <div
                className={cn(
                  'relative z-10 flex items-center justify-center w-8 h-8 rounded-full shrink-0',
                  meta.dotClass,
                )}
              >
                <Icon name={meta.icon} size="sm" />
              </div>

              <div className="min-w-0 flex-1 pt-1">
                <Text size="sm" weight="semibold" color={meta.labelColor} className="block truncate">
                  {ex.name}
                </Text>
                <div className="flex items-center gap-2 mt-0.5">
                  <Text size="xs" color="tertiary">
                    {ex.programName}
                  </Text>
                  {ex.time !== '\u2014' && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-content-tertiary" />
                      <Text size="xs" color="tertiary">
                        {ex.time}
                      </Text>
                    </>
                  )}
                  {ex.status === 'progress' && ex.pct > 0 && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-content-tertiary" />
                      <Text size="xs" weight="bold" color="primary">
                        {ex.pct}%
                      </Text>
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function DashboardHomePage() {
  const nearest = nearestDeadline(programList);
  const overall = overallProgress(programList);
  const completedProgrammes = programList.filter((p) => p.status === 'complete').length;

  const deadlines = programList.map((p) => ({
    id: p.id,
    name: p.name,
    due: p.due,
    daysLeft: p.daysLeft,
    accentColor: p.accent,
  }));

  return (
    <main className="max-w-[1120px] mx-auto px-6 py-8 space-y-8">
      <DashboardWelcomeHero
        userName="Priya Sharma"
        overallPercent={overall}
        completedCount={completedProgrammes}
        totalCount={programList.length}
        nextDeadlineName={nearest?.name ?? '\u2014'}
        nextDeadlineDue={nearest?.due ?? '\u2014'}
        nextDeadlineDaysLeft={nearest?.daysLeft ?? 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-5">
          {programList.map((program) => {
            const counts = exerciseCounts(program);
            const nextEx = [...program.seqExercises, ...program.openExercises].find(
              (e) => e.status === 'progress' || e.status === 'notstarted',
            );

            return (
              <DashboardProgrammeCard
                key={program.id}
                name={program.name}
                description={program.desc}
                percent={program.pct}
                status={program.status}
                due={program.due}
                daysLeft={program.daysLeft}
                accentColor={program.accent}
                completedExercises={counts.completed}
                totalExercises={counts.total}
                nextActionLabel={nextEx ? 'Continue' : 'View'}
              />
            );
          })}
        </div>

        <div className="lg:col-span-7">
          <JourneyTimeline programs={programList} />
        </div>
      </div>

      <DashboardDeadlineStrip items={deadlines} />
    </main>
  );
}
