import { cn } from '@/forge/utils';
import { Title, Text, Overline } from '@/forge/primitives/Typography';
import { Icon } from '@/forge/primitives/Icon';
import { Button } from '@/forge/primitives/Button';

export interface CalmWelcomeHeroProps {
  userName: string;
  programmeCount: number;
  completedExercises: number;
  totalExercises: number;
  nextExerciseName?: string;
  onContinue?: () => void;
  className?: string;
}

export function CalmWelcomeHero({
  userName,
  programmeCount,
  completedExercises,
  totalExercises,
  nextExerciseName,
  onContinue,
  className,
}: CalmWelcomeHeroProps) {
  const firstName = userName.split(' ')[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <section
      className={cn(
        'flex flex-col items-center text-center py-16',
        className,
      )}
    >
      <Overline className="mb-3">{greeting}</Overline>
      <Title level={1} weight="bold" color="primary" heroSize="6xl" className="!mb-4">
        Welcome back, {firstName}
      </Title>
      <Text size="lg" color="secondary" className="max-w-md mb-10">
        {nextExerciseName
          ? `Continue where you left off with ${nextExerciseName}.`
          : `You have ${programmeCount} active programme${programmeCount !== 1 ? 's' : ''} to work on.`}
      </Text>

      {nextExerciseName && (
        <Button
          variant="primary"
          size="lg"
          subjectColor="code"
          onClick={onContinue}
          icon={<Icon name="Play" size="sm" />}
        >
          Continue assessment
        </Button>
      )}

      <div className="flex items-center gap-10 mt-12">
        <StatPill icon="BookOpen" label="Programmes" value={programmeCount} />
        <div className="w-px h-8 bg-border-subtle" />
        <StatPill
          icon="CircleCheck"
          label="Completed"
          value={`${completedExercises} / ${totalExercises}`}
        />
      </div>
    </section>
  );
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: 'BookOpen' | 'CircleCheck';
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-tertiary">
        <Icon name={icon} size="sm" className="text-content-secondary" />
      </div>
      <div className="text-left">
        <Text size="xs" color="tertiary" className="leading-none">
          {label}
        </Text>
        <Text size="base" weight="semibold" color="primary" className="mt-0.5 block">
          {value}
        </Text>
      </div>
    </div>
  );
}
