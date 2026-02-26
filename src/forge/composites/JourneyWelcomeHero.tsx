import { cn } from '@/forge/utils';
import { Title, Text, Overline } from '@/forge/primitives/Typography';
import { Icon } from '@/forge/primitives/Icon';
import { Button } from '@/forge/primitives/Button';
import type { Program, Exercise } from '@/types/program';

export interface JourneyWelcomeHeroProps {
  programme: Program;
  userName?: string;
  className?: string;
}

function getJourneyProgress(programme: Program) {
  const allExercises: Exercise[] = [
    ...programme.seqExercises,
    ...programme.openExercises,
  ];
  const total = allExercises.length;
  const completed = allExercises.filter((e) => e.status === 'complete').length;
  const currentStep = completed + 1;
  const nextExercise =
    programme.seqExercises.find((e) => e.status === 'progress') ??
    programme.openExercises.find((e) => e.status === 'progress') ??
    programme.seqExercises.find((e) => e.status === 'notstarted') ??
    programme.openExercises.find((e) => e.status === 'notstarted');

  return { currentStep: Math.min(currentStep, total), total, completed, nextExercise };
}

function getEncouragementText(pct: number) {
  if (pct >= 75) return "Almost there \u2014 you're in the home stretch!";
  if (pct >= 50) return 'Over halfway \u2014 keep the momentum going!';
  if (pct >= 25) return "You're making great progress. Keep going!";
  return 'Your journey has begun. One step at a time.';
}

export function JourneyWelcomeHero({
  programme,
  userName = 'there',
  className,
}: JourneyWelcomeHeroProps) {
  const { currentStep, total, completed, nextExercise } =
    getJourneyProgress(programme);

  return (
    <section
      className={cn(
        'relative w-full rounded-4xl overflow-hidden',
        'bg-gradient-to-br from-subject-code/10 via-surface-warm to-subject-code/5',
        'p-8 md:p-10',
        className,
      )}
    >
      <Overline color="tertiary" className="mb-1">
        Your Journey
      </Overline>
      <Title level={2} weight="bold" color="primary" className="!mb-1">
        Welcome back, {userName}
      </Title>
      <Text size="base" color="secondary" className="mb-6">
        {getEncouragementText(programme.pct)}
      </Text>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-subject-code-light">
          <Icon name="MapPin" size="sm" className="text-subject-code" />
          <Text size="sm" weight="semibold" className="text-subject-code-dark">
            Step {currentStep} of {total}
          </Text>
        </div>
        <Text size="sm" color="tertiary">
          {completed} completed &middot; {programme.daysLeft} days left
        </Text>
      </div>

      <div className="flex items-center gap-1.5 mb-6">
        {Array.from({ length: total }).map((_, i) => {
          const isComplete = i < completed;
          const isCurrent = i === completed;
          return (
            <div
              key={i}
              className={cn(
                'h-2 flex-1 rounded-full transition-colors duration-moderate',
                isComplete && 'bg-subject-code',
                isCurrent && 'bg-subject-code/50',
                !isComplete && !isCurrent && 'bg-border-muted',
              )}
            />
          );
        })}
      </div>

      {nextExercise && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-card shadow-soft shrink-0">
              <Icon name="ArrowRight" size="md" className="text-subject-code" />
            </div>
            <div className="min-w-0">
              <Text size="xs" color="tertiary" weight="medium">
                Next Step
              </Text>
              <Text size="base" weight="semibold" color="primary" truncate>
                {nextExercise.name}
              </Text>
            </div>
          </div>
          <Button variant="primary" size="md" subjectColor="code">
            Continue
          </Button>
        </div>
      )}
    </section>
  );
}
