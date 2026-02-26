import { cn } from '@/forge/utils';
import { Text } from '@/forge/primitives/Typography';
import { Icon } from '@/forge/primitives/Icon';
import type { Exercise } from '@/types/program';
import type { ItemStatus } from '@/types/common';

export interface JourneyTimelineProps {
  exercises: Exercise[];
  className?: string;
}

const nodeStyles: Record<ItemStatus, { bg: string; border: string; iconColor: string }> = {
  complete: {
    bg: 'bg-subject-code',
    border: 'border-subject-code',
    iconColor: 'text-white',
  },
  progress: {
    bg: 'bg-surface-card',
    border: 'border-subject-code',
    iconColor: 'text-subject-code',
  },
  notstarted: {
    bg: 'bg-surface-card',
    border: 'border-border-muted',
    iconColor: 'text-content-tertiary',
  },
  locked: {
    bg: 'bg-surface-tertiary',
    border: 'border-border-muted',
    iconColor: 'text-content-tertiary',
  },
};

export function JourneyTimeline({
  exercises,
  className,
}: JourneyTimelineProps) {
  if (exercises.length === 0) return null;

  return (
    <div
      className={cn('w-full overflow-x-auto scrollbar-hide', className)}
      role="list"
      aria-label="Journey timeline"
    >
      <div className="flex items-center min-w-max px-1 py-3">
        {exercises.map((exercise, i) => {
          const isLast = i === exercises.length - 1;
          const style = nodeStyles[exercise.status];
          const lineComplete = exercise.status === 'complete';
          const lineColor = lineComplete ? 'bg-subject-code/40' : 'bg-border-muted';

          return (
            <div key={exercise.id} className="flex items-center" role="listitem">
              <div className="flex flex-col items-center gap-1.5 w-24 shrink-0">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0',
                    'transition-all duration-fast',
                    style.bg,
                    style.border,
                  )}
                >
                  {exercise.status === 'complete' && (
                    <Icon name="Check" size={14} className={style.iconColor} />
                  )}
                  {exercise.status === 'progress' && (
                    <div className="w-3 h-3 rounded-full bg-subject-code animate-pulse" />
                  )}
                  {exercise.status === 'notstarted' && (
                    <Icon name="Circle" size={10} className={style.iconColor} />
                  )}
                  {exercise.status === 'locked' && (
                    <Icon name="Lock" size={12} className={style.iconColor} />
                  )}
                </div>
                <Text
                  size="xs"
                  weight={exercise.status === 'progress' ? 'semibold' : 'medium'}
                  color={exercise.status === 'locked' ? 'tertiary' : 'primary'}
                  className="text-center leading-tight line-clamp-2"
                >
                  {exercise.name}
                </Text>
                <Text size="xs" color="tertiary" className="text-center">
                  {exercise.time}
                </Text>
              </div>

              {!isLast && (
                <div
                  className={cn(
                    'h-0.5 w-8 shrink-0 rounded-full transition-colors duration-fast',
                    lineColor,
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
