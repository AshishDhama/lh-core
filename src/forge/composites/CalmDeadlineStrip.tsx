import { cn } from '@/forge/utils';
import { Text } from '@/forge/primitives/Typography';
import { Icon } from '@/forge/primitives/Icon';

export interface CalmDeadlineItem {
  id: string;
  name: string;
  due: string;
  daysLeft: number;
}

export interface CalmDeadlineStripProps {
  deadlines: CalmDeadlineItem[];
  className?: string;
}

export function CalmDeadlineStrip({
  deadlines,
  className,
}: CalmDeadlineStripProps) {
  if (deadlines.length === 0) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-6 rounded-2xl bg-surface-card shadow-soft px-6 py-4',
        className,
      )}
    >
      <div className="flex items-center gap-2 shrink-0">
        <Icon name="CalendarClock" size="md" className="text-content-tertiary" />
        <Text size="sm" weight="semibold" color="secondary">
          Upcoming
        </Text>
      </div>

      <div className="h-5 w-px bg-border-subtle shrink-0" />

      <div className="flex items-center gap-6 overflow-x-auto min-w-0">
        {deadlines.map((item) => {
          const isUrgent = item.daysLeft <= 14;

          return (
            <div key={item.id} className="flex items-center gap-2 shrink-0">
              <div
                className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  isUrgent ? 'bg-error-dark' : 'bg-teal-500',
                )}
              />
              <Text size="sm" color="primary" weight="medium" className="whitespace-nowrap">
                {item.name}
              </Text>
              <Text
                size="xs"
                weight="semibold"
                color={isUrgent ? 'error' : 'tertiary'}
                className="whitespace-nowrap"
              >
                {item.daysLeft}d
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
}
