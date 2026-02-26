import { cn } from '@/forge/utils';
import { Title, Text, Overline } from '@/forge/primitives/Typography';
import { ProgressBar } from '@/forge/primitives/ProgressBar';
import { Button } from '@/forge/primitives/Button';
import { Icon } from '@/forge/primitives/Icon';

import type { ItemStatus } from '@/types/common';

export interface DashboardProgrammeCardProps {
  name: string;
  description: string;
  percent: number;
  status: ItemStatus;
  due: string;
  daysLeft: number;
  accentColor: string;
  completedExercises: number;
  totalExercises: number;
  nextActionLabel?: string;
  onAction?: () => void;
  onClick?: () => void;
  className?: string;
}

export function DashboardProgrammeCard({
  name,
  description,
  percent,
  status,
  due,
  daysLeft,
  accentColor,
  completedExercises,
  totalExercises,
  nextActionLabel = 'Continue',
  onAction,
  onClick,
  className,
}: DashboardProgrammeCardProps) {
  const isUrgent = daysLeft <= 7;
  const isComplete = status === 'complete';

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(); } : undefined}
      className={cn(
        'rounded-3xl bg-surface-card shadow-soft p-6',
        'transition-all duration-moderate ease-in-out',
        'hover:shadow-hover-card hover:-translate-y-px',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <Overline color={isComplete ? 'success' : 'tertiary'}>
          {isComplete ? 'Completed' : 'In Progress'}
        </Overline>
        <div className="flex items-center gap-1">
          <Icon
            name="Calendar"
            size="sm"
            className={isUrgent ? 'text-error-dark' : 'text-content-tertiary'}
          />
          <Text size="xs" weight="bold" color={isUrgent ? 'error' : 'tertiary'}>
            {due} — {daysLeft}d
          </Text>
        </div>
      </div>

      <Title level={4} weight="bold" color="primary" className="!mb-1">
        {name}
      </Title>

      <Text size="sm" color="secondary" className="block mb-4 leading-relaxed">
        {description}
      </Text>

      <div className="mb-3">
        <ProgressBar
          percent={percent}
          type="line"
          size="sm"
          strokeColor={accentColor}
          showInfo={false}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon name="ListChecks" size="sm" className="text-content-tertiary" />
          <Text size="xs" color="secondary" weight="medium">
            {completedExercises} of {totalExercises} complete
          </Text>
        </div>
        {!isComplete && (
          <Button
            variant="primary"
            size="sm"
            subjectColor="code"
            onClick={(e) => {
              e.stopPropagation();
              onAction?.();
            }}
            className="!rounded-full"
          >
            {nextActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
