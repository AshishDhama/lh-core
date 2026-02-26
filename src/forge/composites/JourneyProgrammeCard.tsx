import { cn } from '@/forge/utils';
import { Text } from '@/forge/primitives/Typography';
import { Icon } from '@/forge/primitives/Icon';
import { Illustration } from '@/forge/primitives/Illustration';
import { ProgressBar } from '@/forge/primitives/ProgressBar';
import type { Exercise } from '@/types/program';
import type { ItemStatus } from '@/types/common';

export interface JourneyProgrammeCardProps {
  exercise: Exercise;
  chapterNumber?: number;
  onClick?: () => void;
  className?: string;
}

const statusConfig: Record<
  ItemStatus,
  { label: string; icon: 'CircleCheckBig' | 'Circle' | 'CircleDot' | 'Lock'; chipClass: string }
> = {
  complete: {
    label: 'Completed',
    icon: 'CircleCheckBig',
    chipClass: 'bg-success-light/60 text-success-dark',
  },
  progress: {
    label: 'In Progress',
    icon: 'CircleDot',
    chipClass: 'bg-subject-code-light text-subject-code-dark',
  },
  notstarted: {
    label: 'Upcoming',
    icon: 'Circle',
    chipClass: 'bg-surface-tertiary text-content-tertiary',
  },
  locked: {
    label: 'Locked',
    icon: 'Lock',
    chipClass: 'bg-surface-tertiary text-content-tertiary',
  },
};

export function JourneyProgrammeCard({
  exercise,
  chapterNumber,
  onClick,
  className,
}: JourneyProgrammeCardProps) {
  const config = statusConfig[exercise.status];
  const isActionable =
    exercise.status === 'progress' || exercise.status === 'notstarted';
  const isLocked = exercise.status === 'locked';

  return (
    <button
      type="button"
      onClick={isActionable ? onClick : undefined}
      disabled={isLocked}
      className={cn(
        'relative flex flex-col rounded-3xl bg-surface-card shadow-soft overflow-hidden text-left w-full',
        'transition-all duration-moderate ease-in-out',
        isActionable && 'cursor-pointer hover:shadow-hover-card hover:-translate-y-px',
        isLocked && 'opacity-60 cursor-not-allowed',
        className,
      )}
    >
      <div
        className={cn(
          'relative w-full flex items-center justify-center py-5',
          exercise.status === 'complete' && 'bg-success-light/20',
          exercise.status === 'progress' && 'bg-subject-code-light',
          exercise.status === 'notstarted' && 'bg-surface-tertiary/50',
          exercise.status === 'locked' && 'bg-surface-tertiary/30',
        )}
      >
        {exercise.illustration && (
          <Illustration
            name={exercise.illustration}
            size="sm"
            className={cn(isLocked && 'opacity-50')}
          />
        )}
        <div
          className={cn(
            'absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
            config.chipClass,
          )}
        >
          <Icon name={config.icon} size={12} />
          {config.label}
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1">
        {chapterNumber !== undefined && (
          <Text size="xs" color="tertiary" weight="semibold" className="uppercase tracking-wider">
            Chapter {chapterNumber}
          </Text>
        )}

        <Text size="sm" weight="semibold" color={isLocked ? 'tertiary' : 'primary'}>
          {exercise.name}
        </Text>

        <Text size="xs" color="secondary" className="line-clamp-2">
          {exercise.desc}
        </Text>

        <div className="mt-auto pt-2 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Icon name="Clock" size={12} className="text-content-tertiary" />
            <Text size="xs" color="tertiary">
              {exercise.time}
            </Text>
          </div>
          {exercise.pct > 0 && exercise.pct < 100 && (
            <div className="flex-1 max-w-[80px]">
              <ProgressBar percent={exercise.pct} size="xs" showInfo={false} />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
