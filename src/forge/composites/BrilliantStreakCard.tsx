import { cn } from '@/forge/utils';
import { Text, Title } from '@/forge/primitives/Typography';

export interface BrilliantStreakCardProps {
  streakCount: number;
  weekDays: boolean[];
  motivationalText?: string;
  className?: string;
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function BrilliantStreakCard({
  streakCount,
  weekDays,
  motivationalText = 'Keep your streak going!',
  className,
}: BrilliantStreakCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl bg-surface-card shadow-soft p-6',
        'transition-all duration-moderate ease-in-out',
        'hover:shadow-hover-card hover:-translate-y-px',
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-subject-science-light">
          <span className="text-lg" role="img" aria-label="fire">
            🔥
          </span>
        </div>
        <div>
          <Title level={3} weight="bold" color="primary" className="!mb-0 !text-2xl">
            {streakCount}
          </Title>
          <Text size="xs" color="tertiary">
            day streak
          </Text>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {DAY_LABELS.map((label, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <Text size="xs" color="tertiary" className="leading-none">
              {label}
            </Text>
            <div
              className={cn(
                'w-6 h-6 rounded-full transition-colors duration-fast',
                weekDays[i]
                  ? 'bg-subject-science'
                  : 'bg-surface-tertiary',
              )}
            />
          </div>
        ))}
      </div>

      <Text size="sm" color="secondary">
        {motivationalText}
      </Text>
    </div>
  );
}
