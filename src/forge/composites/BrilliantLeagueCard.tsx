import { cn } from '@/forge/utils';
import { Text, Title } from '@/forge/primitives/Typography';
import { Icon } from '@/forge/primitives/Icon';

export interface LeagueEntry {
  rank: number;
  name: string;
  score: number;
}

export interface BrilliantLeagueCardProps {
  title?: string;
  entries?: LeagueEntry[];
  locked?: boolean;
  className?: string;
}

const DEFAULT_ENTRIES: LeagueEntry[] = [
  { rank: 1, name: 'Arjun M.', score: 2450 },
  { rank: 2, name: 'Sneha R.', score: 2380 },
  { rank: 3, name: 'Vikram P.', score: 2210 },
  { rank: 4, name: 'Priya S.', score: 2100 },
];

export function BrilliantLeagueCard({
  title = 'Weekly League',
  entries = DEFAULT_ENTRIES,
  locked = true,
  className,
}: BrilliantLeagueCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl bg-surface-card shadow-soft p-6 relative overflow-hidden',
        'transition-all duration-moderate ease-in-out',
        'hover:shadow-hover-card hover:-translate-y-px',
        className,
      )}
    >
      <Title level={4} weight="bold" color="primary" className="!mb-3">
        {title}
      </Title>

      <div className={cn('space-y-2', locked && 'blur-sm select-none')}>
        {entries.map((entry) => (
          <div key={entry.rank} className="flex items-center gap-3 py-1.5">
            <Text size="sm" weight="semibold" color="tertiary" className="w-6 text-center">
              {entry.rank}
            </Text>
            <div className="w-7 h-7 rounded-full bg-surface-tertiary" />
            <Text size="sm" weight="medium" color="primary" className="flex-1">
              {entry.name}
            </Text>
            <Text size="sm" weight="semibold" color="secondary">
              {entry.score}
            </Text>
          </div>
        ))}
      </div>

      {locked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-card/60">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-tertiary mb-2">
            <Icon name="Lock" size="lg" className="text-content-tertiary" />
          </div>
          <Text size="sm" weight="semibold" color="secondary">
            Complete 3 days to unlock
          </Text>
        </div>
      )}
    </div>
  );
}
