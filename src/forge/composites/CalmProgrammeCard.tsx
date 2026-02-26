import { cn } from '@/forge/utils';
import { Title, Text, Overline } from '@/forge/primitives/Typography';
import { Icon } from '@/forge/primitives/Icon';
import { ProgressBar } from '@/forge/primitives/ProgressBar';
import { Button } from '@/forge/primitives/Button';
import { Illustration } from '@/forge/primitives/Illustration';
import type { Program, Exercise } from '@/types/program';

export interface CalmProgrammeCardProps {
  programme: Program;
  onContinue?: () => void;
  className?: string;
}

function getNextExercise(programme: Program): Exercise | undefined {
  const inProgress =
    programme.seqExercises.find((e) => e.status === 'progress') ??
    programme.openExercises.find((e) => e.status === 'progress');
  if (inProgress) return inProgress;

  return (
    programme.seqExercises.find((e) => e.status === 'notstarted') ??
    programme.openExercises.find((e) => e.status === 'notstarted')
  );
}

function countExercises(programme: Program) {
  const all = [...programme.seqExercises, ...programme.openExercises];
  const completed = all.filter((e) => e.status === 'complete').length;
  return { completed, total: all.length };
}

export function CalmProgrammeCard({
  programme,
  onContinue,
  className,
}: CalmProgrammeCardProps) {
  const next = getNextExercise(programme);
  const { completed, total } = countExercises(programme);
  const isUrgent = programme.daysLeft <= 14;

  return (
    <div
      className={cn(
        'rounded-4xl bg-surface-card shadow-soft p-8',
        'transition-all duration-moderate ease-in-out',
        'hover:shadow-hover-card',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <Overline className="mb-1.5">{`${completed} of ${total} exercises complete`}</Overline>
          <Title level={3} weight="bold" color="primary" className="!mb-0">
            {programme.name}
          </Title>
        </div>

        <div
          className={cn(
            'flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1.5',
            isUrgent ? 'bg-error-light/40' : 'bg-surface-tertiary',
          )}
        >
          <Icon
            name="Clock"
            size="sm"
            className={isUrgent ? 'text-error-dark' : 'text-content-tertiary'}
          />
          <Text
            size="xs"
            weight="semibold"
            color={isUrgent ? 'error' : 'tertiary'}
          >
            {programme.daysLeft}d left &middot; {programme.due}
          </Text>
        </div>
      </div>

      <div className="mb-8">
        <ProgressBar
          percent={programme.pct}
          size="sm"
          strokeColor={programme.accent}
          showInfo={false}
          className="[&_.ant-progress-bg]:!rounded-full"
        />
        <Text size="xs" color="tertiary" className="mt-1.5 block">
          {programme.pct}% complete
        </Text>
      </div>

      {next && (
        <div
          className={cn(
            'flex items-center gap-5 rounded-3xl bg-surface-tertiary/60 p-5',
          )}
        >
          {next.illustration && (
            <Illustration name={next.illustration} size="sm" className="shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            <Text size="xs" color="tertiary" weight="medium" className="mb-0.5 block">
              {next.status === 'progress' ? 'Continue' : 'Up next'}
            </Text>
            <Text size="base" weight="semibold" color="primary">
              {next.name}
            </Text>
            <Text size="sm" color="secondary" className="mt-0.5 block">
              {next.desc}
            </Text>
            {next.time && next.time !== '\u2014' && (
              <div className="flex items-center gap-1 mt-1.5">
                <Icon name="Clock" size={12} className="text-content-tertiary" />
                <Text size="xs" color="tertiary">{next.time}</Text>
              </div>
            )}
          </div>

          <Button
            variant="primary"
            size="md"
            subjectColor="code"
            onClick={onContinue}
            icon={<Icon name={next.status === 'progress' ? 'Play' : 'ArrowRight'} size="sm" />}
          >
            {next.status === 'progress' ? 'Continue' : 'Start'}
          </Button>
        </div>
      )}
    </div>
  );
}
