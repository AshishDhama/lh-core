import { cn } from '@/forge/utils';
import { Title, Text, Overline } from '@/forge/primitives/Typography';
import { ProgressBar } from '@/forge/primitives/ProgressBar';
import { Icon } from '@/forge/primitives/Icon';
import { colors } from '@/forge/tokens';

export interface DashboardWelcomeHeroProps {
  userName: string;
  overallPercent: number;
  completedCount: number;
  totalCount: number;
  nextDeadlineName: string;
  nextDeadlineDue: string;
  nextDeadlineDaysLeft: number;
  className?: string;
}

export function DashboardWelcomeHero({
  userName,
  overallPercent,
  completedCount,
  totalCount,
  nextDeadlineName,
  nextDeadlineDue,
  nextDeadlineDaysLeft,
  className,
}: DashboardWelcomeHeroProps) {
  const isUrgent = nextDeadlineDaysLeft <= 7;
  const firstName = userName.split(' ')[0];

  return (
    <section
      className={cn(
        'rounded-3xl bg-surface-card shadow-soft p-8',
        'flex flex-col sm:flex-row items-center gap-6',
        className,
      )}
    >
      <div className="flex-1 min-w-0">
        <Overline color="tertiary" className="mb-1 block">
          Welcome back
        </Overline>
        <Title level={2} weight="bold" color="primary" className="!mb-1">
          {firstName}
        </Title>
        <Text size="sm" color="secondary">
          {completedCount} of {totalCount} programmes complete — keep going!
        </Text>
      </div>

      <div className="flex flex-col items-center gap-1 shrink-0">
        <ProgressBar
          type="circle"
          percent={overallPercent}
          size="md"
          strokeColor={colors.teal.DEFAULT}
          showInfo
          format={(pct) => (
            <span className="text-sm font-bold text-content-primary">{pct}%</span>
          )}
        />
        <Text size="xs" color="tertiary" className="mt-1">
          Overall
        </Text>
      </div>

      <div className="hidden sm:block w-px h-16 bg-border-subtle shrink-0" />

      <div className="flex items-center gap-3 shrink-0">
        <div
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full shrink-0',
            isUrgent ? 'bg-error-light/30' : 'bg-surface-tertiary',
          )}
        >
          <Icon
            name="Clock"
            size="lg"
            className={isUrgent ? 'text-error-dark' : 'text-content-tertiary'}
          />
        </div>
        <div className="min-w-0">
          <Text size="xs" color="tertiary" className="block mb-0.5">
            Next deadline
          </Text>
          <Text size="sm" weight="semibold" color="primary" className="block truncate">
            {nextDeadlineName}
          </Text>
          <Text
            size="xs"
            weight="bold"
            color={isUrgent ? 'error' : 'secondary'}
            className="block"
          >
            {nextDeadlineDue} — {nextDeadlineDaysLeft}d left
          </Text>
        </div>
      </div>
    </section>
  );
}
