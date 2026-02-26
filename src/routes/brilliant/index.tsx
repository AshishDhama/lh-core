import { createFileRoute } from '@tanstack/react-router';

import { CalmWelcomeHero } from '@/forge/composites/CalmWelcomeHero';
import { CalmProgrammeCard } from '@/forge/composites/CalmProgrammeCard';
import { CalmDeadlineStrip } from '@/forge/composites/CalmDeadlineStrip';
import { programList } from '@/data/programs';

export const Route = createFileRoute('/brilliant/')({
  component: CalmHomePage,
});

function getOverallStats() {
  let completed = 0;
  let total = 0;
  for (const p of programList) {
    const all = [...p.seqExercises, ...p.openExercises];
    completed += all.filter((e) => e.status === 'complete').length;
    total += all.length;
  }
  return { completed, total };
}

function getNextExerciseName(): string | undefined {
  for (const p of programList) {
    const inProgress =
      p.seqExercises.find((e) => e.status === 'progress') ??
      p.openExercises.find((e) => e.status === 'progress');
    if (inProgress) return inProgress.name;
  }
  return undefined;
}

function CalmHomePage() {
  const { completed, total } = getOverallStats();
  const nextExerciseName = getNextExerciseName();
  const activeProgrammes = programList.filter((p) => p.status !== 'complete');

  const deadlines = activeProgrammes.map((p) => ({
    id: p.id,
    name: p.name,
    due: p.due,
    daysLeft: p.daysLeft,
  }));

  return (
    <main className="max-w-[960px] mx-auto px-6 py-12">
      <CalmWelcomeHero
        userName="Priya Sharma"
        programmeCount={activeProgrammes.length}
        completedExercises={completed}
        totalExercises={total}
        nextExerciseName={nextExerciseName}
      />

      <div className="mt-12 mb-12">
        <CalmDeadlineStrip deadlines={deadlines} />
      </div>

      <div className="flex flex-col gap-8">
        {activeProgrammes.map((programme) => (
          <CalmProgrammeCard key={programme.id} programme={programme} />
        ))}
      </div>
    </main>
  );
}
