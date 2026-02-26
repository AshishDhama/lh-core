import { createFileRoute } from '@tanstack/react-router';

import { BrilliantHeader } from '@/forge/patterns/BrilliantHeader';
import { BrilliantStreakCard } from '@/forge/composites/BrilliantStreakCard';
import { BrilliantPremiumCard } from '@/forge/composites/BrilliantPremiumCard';
import { BrilliantLeagueCard } from '@/forge/composites/BrilliantLeagueCard';
import { BrilliantHeroAssessmentCard } from '@/forge/composites/BrilliantHeroAssessmentCard';
import { BrilliantLessonStepList } from '@/forge/composites/BrilliantLessonStepList';
import type { LessonStep } from '@/forge/composites/BrilliantLessonStepList';
import { programList } from '@/data/programs';

export const Route = createFileRoute('/brilliant/')({
  component: BrilliantHomePage,
});

const MOCK_STREAK = {
  count: 7,
  weekDays: [true, true, true, true, true, false, false],
};

function buildLessonSteps(): LessonStep[] {
  const program = programList[0];
  if (!program) return [];
  return program.seqExercises.map((ex) => ({
    id: ex.id,
    label: ex.name,
    status: ex.status,
    duration: ex.time,
  }));
}

function BrilliantHomePage() {
  const steps = buildLessonSteps();
  const currentExercise = programList[0]?.seqExercises.find(
    (e) => e.status === 'progress',
  );

  return (
    <div className="min-h-screen bg-surface-primary">
      <BrilliantHeader
        activeTab="home"
        streakCount={MOCK_STREAK.count}
        energyCount={42}
        userName="Priya Sharma"
      />

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column — streak, premium, league */}
          <div className="lg:col-span-4 space-y-5">
            <BrilliantStreakCard
              streakCount={MOCK_STREAK.count}
              weekDays={MOCK_STREAK.weekDays}
              motivationalText="You're on a 7-day streak! Keep it going!"
            />
            <BrilliantPremiumCard />
            <BrilliantLeagueCard locked />
          </div>

          {/* Right column — hero assessment + lesson steps */}
          <div className="lg:col-span-8 space-y-5">
            <BrilliantHeroAssessmentCard
              overline="CONTINUE LEARNING"
              title={currentExercise?.name ?? 'Cognitive Ability Test'}
              description={currentExercise?.desc ?? 'Verbal, numerical, and abstract reasoning.'}
              illustration="cognitive"
              subjectColor="code"
              ctaText="Continue"
            />

            <div className="rounded-4xl bg-surface-card shadow-soft p-8">
              <BrilliantLessonStepList
                steps={steps}
                subjectColor="code"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
