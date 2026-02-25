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
    color: '#3575BC',
    bg: '#EEF6FA',
  },
  practical: {
    label: 'Practical',
    icon: <Wrench size={16} />,
    color: '#008575',
    bg: '#E6F7F5',
  },
  observation: {
    label: 'Observation',
    icon: <Eye size={16} />,
    color: '#7B61FF',
    bg: '#F3F0FF',
  },
};

const statusConfig: Record<
  AssessmentStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: 'Pending', color: '#475569', bg: '#f1f5f9' },
  inProgress: { label: 'In Progress', color: '#a16207', bg: '#fef9c3' },
  completed: { label: 'Completed', color: '#15803d', bg: '#dcfce7' },
  locked: { label: 'Locked', color: '#94a3b8', bg: '#f8fafc' },
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
        'flex flex-col gap-4 rounded-xl border border-[#f1f5f9] bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
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
            strokeColor={scorePercent >= 70 ? '#22c55e' : '#eab308'}
            trailColor="#f1f5f9"
            size="small"
          />
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-4">
        {dueDate && (
          <span className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
            <CheckCircle2 size={13} />
            Due {formatDueDate(dueDate)}
          </span>
        )}
        {timeLimit && (
          <span className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
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
