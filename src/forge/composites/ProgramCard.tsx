import { Card, Progress, Tag as AntTag } from 'antd';
import { Clock, ChevronRight, Lock } from 'lucide-react';
import { memo } from 'react';
import type { ReactNode } from 'react';

import { Text, Title } from '@/forge/primitives';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';

type ProgramStatus = 'active' | 'completed' | 'locked';

export interface ProgramCardProps {
  title: string;
  description: string;
  progress?: number;
  status: ProgramStatus;
  duration?: string;
  daysLeft?: number;
  icon?: ReactNode;
  accentColor?: string;
  onClick?: () => void;
  className?: string;
}

const statusConfig: Record<ProgramStatus, { label: string; color: string; bgColor: string }> = {
  active: {
    label: 'In Progress',
    // warning.dark (#a16207) = 4.92:1 on white — WCAG AA ✓ (was warning.DEFAULT #eab308 at ~2.3:1)
    color: colors.warning.dark,
    bgColor: `${colors.warning.DEFAULT}12`,
  },
  completed: {
    label: 'Completed',
    // success.dark (#15803d) = 5.02:1 on white — WCAG AA ✓ (was success.DEFAULT #22c55e at ~2.3:1)
    color: colors.success.dark,
    bgColor: `${colors.success.DEFAULT}12`,
  },
  locked: {
    label: 'Locked',
    color: colors.content.tertiary,
    bgColor: `${colors.content.tertiary}12`,
  },
};

export const ProgramCard = memo(function ProgramCard({
  title,
  description,
  progress = 0,
  status,
  duration,
  daysLeft,
  icon,
  accentColor = colors.navy.DEFAULT,
  onClick,
  className,
}: ProgramCardProps) {
  const config = statusConfig[status];
  const isLocked = status === 'locked';
  const isUrgent = daysLeft !== undefined && daysLeft <= 14;

  return (
    <Card
      hoverable={!isLocked}
      onClick={isLocked ? undefined : onClick}
      className={cn(
        'border border-solid',
        isLocked && 'opacity-50 cursor-default',
        className,
      )}
      styles={{ body: { padding: 22 } }}
    >
      <div className="flex items-start gap-3.5">
        {/* Icon */}
        {icon && (
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-lg mt-0.5"
            style={{ backgroundColor: `${accentColor}10`, color: accentColor }}
          >
            {icon}
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Status + deadline row */}
          <div className="mb-1.5 flex items-center gap-2">
            <AntTag
              variant="filled"
              style={{
                color: config.color,
                backgroundColor: config.bgColor,
                fontWeight: 700,
                fontSize: 11,
                margin: 0,
              }}
            >
              {config.label}
            </AntTag>
            {daysLeft !== undefined && !isLocked && (
              <Text
                size="xs"
                weight="bold"
                className={isUrgent ? `text-[${colors.error.DEFAULT}]` : undefined}
                color={isUrgent ? 'error' : 'tertiary'}
              >
                {daysLeft} days left
              </Text>
            )}
          </div>

          {/* Title */}
          <Title level={4} weight="bold" className="mb-1">
            {title}
          </Title>

          {/* Description */}
          <Text size="sm" color="secondary" className="mb-3.5 block leading-relaxed">
            {description}
          </Text>

          {/* Duration */}
          {duration && (
            <div className="mb-3 flex items-center gap-1.5">
              <Clock size={14} className={`text-[${colors.content.tertiary}]`} />
              <Text size="xs" color="tertiary">{duration}</Text>
            </div>
          )}

          {/* Progress bar */}
          {status !== 'locked' && progress > 0 && (
            <div className="mt-1">
              <Progress
                percent={progress}
                strokeColor={accentColor}
                size="small"
                format={(pct) => (
                  <Text size="xs" color="tertiary">{pct}%</Text>
                )}
              />
            </div>
          )}
        </div>

        {/* Trailing icon — decorative, hidden from screen readers */}
        <div className="mt-3 shrink-0" aria-hidden="true">
          {isLocked ? (
            <Lock size={18} className={`text-[${colors.content.tertiary}]`} />
          ) : (
            <ChevronRight size={18} className={`text-[${colors.content.tertiary}]`} />
          )}
        </div>
      </div>
    </Card>
  );
});
