import { Progress } from 'antd';
import {
  CheckCircle2,
  Clock,
  Eye,
  FileQuestion,
  Lock,
  PlayCircle,
  Wrench,
} from 'lucide-react';

import { Button, Text } from '@/forge/primitives';
import { cn } from '@/forge/utils';

export type AssessmentType = 'quiz' | 'practical' | 'observation';
export type AssessmentStatus = 'pending' | 'inProgress' | 'completed' | 'locked';

export interface AssessmentCardProps {
  title: string;
  type: AssessmentType;
  score?: number;
  maxScore?: number;
  status: AssessmentStatus;
  dueDate?: Date | string;
  timeLimit?: number;
  onStart?: () => void;
  onView?: () => void;
  className?: string;
}

const typeConfig: Record<
  AssessmentType,
  { label: string; icon: React.ReactNode; iconClassName: string; textClassName: string }
> = {
  quiz: {
    label: 'Quiz',
    icon: <FileQuestion size={16} />,
    iconClassName: 'bg-navy-50 dark:bg-navy-900/20 text-navy-400',
    textClassName: 'text-navy-400',
  },
  practical: {
    label: 'Practical',
    icon: <Wrench size={16} />,
    iconClassName: 'bg-teal-50 dark:bg-teal-900/20 text-teal',
    textClassName: 'text-teal',
  },
  observation: {
    label: 'Observation',
    icon: <Eye size={16} />,
    iconClassName: 'bg-purple/10 text-purple',
    textClassName: 'text-purple',
  },
};

const statusConfig: Record<
  AssessmentStatus,
  { label: string; className: string }
> = {
  pending: { label: 'Pending', className: 'text-content-secondary bg-surface-tertiary' },
  inProgress: { label: 'In Progress', className: 'text-warning-dark dark:text-warning-light bg-warning/10' },
  completed: { label: 'Completed', className: 'text-success-dark dark:text-success-light bg-success/10' },
  locked: { label: 'Locked', className: 'text-content-tertiary bg-surface-secondary' },
};

function formatDueDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatTimeLimit(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function AssessmentCard({
  title,
  type,
  score,
  maxScore,
  status,
  dueDate,
  timeLimit,
  onStart,
  onView,
  className,
}: AssessmentCardProps) {
  const { label: typeLabel, icon, iconClassName, textClassName } = typeConfig[type];
  const { label: statusLabel, className: statusClassName } = statusConfig[status];

  const hasScore = score !== undefined && maxScore !== undefined;
  const scorePercent = hasScore ? Math.round((score! / maxScore!) * 100) : 0;
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-border bg-surface-primary p-4 shadow-sm transition-shadow hover:shadow-md',
        isLocked && 'opacity-60',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0">
          <span
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
              iconClassName,
            )}
          >
            {icon}
          </span>
          <div className="min-w-0">
            <Text size="sm" weight="semibold" color="primary" className="leading-snug">
              {title}
            </Text>
            <span
              className={cn('mt-0.5 inline-block text-xs font-medium', textClassName)}
            >
              {typeLabel}
            </span>
          </div>
        </div>

        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
            statusClassName,
          )}
        >
          {isLocked ? (
            <span className="flex items-center gap-1">
              <Lock size={11} />
              {statusLabel}
            </span>
          ) : (
            statusLabel
          )}
        </span>
      </div>

      {/* Score (completed state) */}
      {isCompleted && hasScore && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Text size="xs" color="secondary">
              Score
            </Text>
            <Text size="sm" weight="semibold" color="primary">
              {score}/{maxScore}
              <Text size="xs" color="tertiary" className="ml-1">
                ({scorePercent}%)
              </Text>
            </Text>
          </div>
          <Progress
            percent={scorePercent}
            showInfo={false}
            strokeColor={scorePercent >= 70 ? 'var(--color-success)' : 'var(--color-warning)'}
            trailColor="var(--lh-surface-tertiary)"
            size="small"
          />
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-4">
        {dueDate && (
          <span className="flex items-center gap-1.5 text-xs text-content-tertiary">
            <CheckCircle2 size={13} />
            Due {formatDueDate(dueDate)}
          </span>
        )}
        {timeLimit && (
          <span className="flex items-center gap-1.5 text-xs text-content-tertiary">
            <Clock size={13} />
            {formatTimeLimit(timeLimit)}
          </span>
        )}
      </div>

      {/* Actions */}
      {!isLocked && (
        <div className="flex gap-2">
          {!isCompleted && onStart && (
            <Button
              size="sm"
              variant="primary"
              icon={<PlayCircle size={14} />}
              onClick={onStart}
              fullWidth
            >
              {status === 'inProgress' ? 'Continue' : 'Start'}
            </Button>
          )}
          {isCompleted && onView && (
            <Button size="sm" variant="secondary" onClick={onView} fullWidth>
              View Results
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
