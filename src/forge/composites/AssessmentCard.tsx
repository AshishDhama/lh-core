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
import { memo } from 'react';

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
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  quiz: {
    label: 'Quiz',
    icon: <FileQuestion size={16} />,
    color: 'var(--color-navy-400)',
    bg: 'var(--color-navy-50)',
  },
  practical: {
    label: 'Practical',
    icon: <Wrench size={16} />,
    color: 'var(--color-teal)',
    bg: 'var(--color-teal-50)',
  },
  observation: {
    label: 'Observation',
    icon: <Eye size={16} />,
    color: 'var(--color-purple)',
    bg: '#F3F0FF' /* purple bg – no token */,
  },
};

const statusConfig: Record<
  AssessmentStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: 'Pending', color: 'var(--color-content-secondary)', bg: 'var(--color-surface-tertiary)' },
  inProgress: { label: 'In Progress', color: 'var(--color-warning-dark)', bg: '#fef9c3' /* warning bg – no token */ },
  completed: { label: 'Completed', color: 'var(--color-success-dark)', bg: '#dcfce7' /* success bg – no token */ },
  locked: { label: 'Locked', color: 'var(--color-content-tertiary)', bg: '#f8fafc' /* no token */ },
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

export const AssessmentCard = memo(function AssessmentCard({
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
  const { label: typeLabel, icon, color, bg } = typeConfig[type];
  const { label: statusLabel, color: statusColor, bg: statusBg } = statusConfig[status];

  const hasScore = score !== undefined && maxScore !== undefined;
  const scorePercent = hasScore ? Math.round((score! / maxScore!) * 100) : 0;
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-surface-tertiary bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
        isLocked && 'opacity-60',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: bg, color }}
          >
            {icon}
          </span>
          <div className="min-w-0">
            <Text size="sm" weight="semibold" color="primary" className="leading-snug">
              {title}
            </Text>
            <span
              className="mt-0.5 inline-block text-xs font-medium"
              style={{ color }}
            >
              {typeLabel}
            </span>
          </div>
        </div>

        <span
          className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{ color: statusColor, backgroundColor: statusBg }}
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
            trailColor="var(--color-surface-tertiary)"
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
});
