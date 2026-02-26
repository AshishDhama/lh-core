import { createFileRoute } from '@tanstack/react-router';

import { Title, Text, Overline } from '@/forge/primitives/Typography';
import { Icon } from '@/forge/primitives/Icon';
import { JourneyWelcomeHero } from '@/forge/composites/JourneyWelcomeHero';
import { JourneyProgrammeCard } from '@/forge/composites/JourneyProgrammeCard';
import { JourneyTimeline } from '@/forge/composites/JourneyTimeline';
import { programList } from '@/data/programs';
import type { Exercise } from '@/types/program';

export const Route = createFileRoute('/brilliant/journey')({
  component: JourneyHomePage,
});

function getActiveProgramme() {
  return programList.find((p) => p.status === 'progress') ?? programList[0];
}

function getAllExercises(seq: Exercise[], open: Exercise[]): Exercise[] {
  return [...seq, ...open];
}

function JourneyHomePage() {
  const activeProgramme = getActiveProgramme();

  return (
    <main className="max-w-[1080px] mx-auto px-6 py-10">
      {activeProgramme && (
        <JourneyWelcomeHero
          programme={activeProgramme}
          userName="Priya"
          className="mb-10"
        />
      )}

      <div className="flex flex-col gap-10">
        {programList.map((programme) => {
          const allExercises = getAllExercises(
            programme.seqExercises,
            programme.openExercises,
          );
          const inProgressExercise = allExercises.find(
            (e) => e.status === 'progress',
          );

          return (
            <section key={programme.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: programme.accent + '18' }}
                  >
                    <Icon
                      name="BookOpen"
                      size="md"
                      style={{ color: programme.accent }}
                    />
                  </div>
                  <div>
                    <Title level={4} weight="bold" color="primary" className="!mb-0">
                      {programme.name}
                    </Title>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Text size="xs" color="tertiary">
                    Due {programme.due}
                  </Text>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-tertiary">
                    <Icon name="Calendar" size={12} className="text-content-tertiary" />
                    <Text size="xs" weight="semibold" color="secondary">
                      {programme.daysLeft}d left
                    </Text>
                  </div>
                </div>
              </div>

              {inProgressExercise && (
                <div className="flex items-center gap-2 mb-4 mt-1">
                  <Icon name="ArrowRight" size="sm" className="text-subject-code" />
                  <Text size="sm" color="secondary">
                    Pick up where you left off:{' '}
                    <Text size="sm" weight="semibold" color="primary">
                      {inProgressExercise.name}
                    </Text>
                  </Text>
                </div>
              )}

              <Text size="sm" color="secondary" className="mb-5">
                {programme.desc}
              </Text>

              <div className="rounded-2xl bg-surface-card shadow-soft px-4 py-4 mb-6">
                <JourneyTimeline exercises={allExercises} />
              </div>

              {programme.seqExercises.length > 0 && (
                <div className="mb-6">
                  <Overline className="mb-3 block">Sequential Pathway</Overline>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {programme.seqExercises.map((exercise, i) => (
                      <JourneyProgrammeCard
                        key={exercise.id}
                        exercise={exercise}
                        chapterNumber={i + 1}
                      />
                    ))}
                  </div>
                </div>
              )}

              {programme.openExercises.length > 0 && (
                <div>
                  <Overline className="mb-3 block">Complete Anytime</Overline>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {programme.openExercises.map((exercise) => (
                      <JourneyProgrammeCard key={exercise.id} exercise={exercise} />
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="mt-12 mb-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Icon name="Sparkles" size="md" className="text-subject-code" />
          <Text size="sm" weight="semibold" color="secondary">
            Your leadership journey is unfolding
          </Text>
        </div>
        <Text size="xs" color="tertiary">
          Every assessment completed brings you closer to a complete picture of your strengths.
        </Text>
      </div>
    </main>
  );
}
