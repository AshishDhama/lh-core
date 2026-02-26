import { cn } from '@/forge/utils';
import { Text, Overline } from '@/forge/primitives/Typography';
import { Icon } from '@/forge/primitives/Icon';

export interface DashboardDeadlineItem {
  id: string;
  name: string;
  due: string;
  daysLeft: number;
  accentColor: string;
}

export interface DashboardDeadlineStripProps {
  items: DashboardDeadlineItem[];
  className?: string;
}

function urgencyColor(daysLeft: number): {
  border: string;
  text: 'error' | 'warning' | 'secondary';
  bg: string;
} {
  if (daysLeft <= 7) {
    return { border: 'border-l-error-dark', text: 'error', bg: 'bg-error-light/10' };
  }
  if (daysLeft <= 14) {
    return { border: 'border-l-warning-dark', text: 'warning', bg: 'bg-warning-light/10' };
  }
  return { border: 'border-l-teal-500', text: 'secondary', bg: 'bg-surface-tertiary' };
}

export function DashboardDeadlineStrip({ items, className }: DashboardDeadlineStripProps) {
  if (items.length === 0) return null;

  return (
    <section className={cn('rounded-3xl bg-surface-card shadow-soft p-6', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Icon name="CalendarClock" size="md" className="text-content-tertiary" />
        <Overline color="tertiary">Upcoming Deadlines</Overline>
      </div>

      <div className="flex flex-wrap gap-3">
        {items.map((item) => {
          const urgency = urgencyColor(item.daysLeft);

          return (
            <div
              key={item.id}
              className={cn(
                'flex-1 min-w-[200px] rounded-xl border-l-4 px-4 py-3',
                urgency.border,
                urgency.bg,
              )}
            >
              <Text size="sm" weight="semibold" color="primary" className="block truncate mb-0.5">
                {item.name}
              </Text>
              <div className="flex items-center gap-2">
                <Text size="xs" color="tertiary">
                  {item.due}
                </Text>
                <span className="w-1 h-1 rounded-full bg-content-tertiary" />
                <Text size="xs" weight="bold" color={urgency.text}>
                  {item.daysLeft}d left
                </Text>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
