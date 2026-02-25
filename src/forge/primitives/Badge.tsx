import { Badge as AntBadge } from 'antd';
import type { ReactNode } from 'react';

import { cn } from '@/forge/utils';
import { colors } from '@/forge/tokens';

type BadgeStatus = 'success' | 'processing' | 'error' | 'warning' | 'default';
type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  count?: ReactNode;
  dot?: boolean;
  status?: BadgeStatus;
  color?: string;
  size?: BadgeSize;
  overflowCount?: number;
  showZero?: boolean;
  offset?: [number, number];
  className?: string;
  children?: ReactNode;
}

const statusColorMap: Record<BadgeStatus, string> = {
  success: colors.success.DEFAULT,
  processing: colors.teal.DEFAULT,
  error: colors.error.DEFAULT,
  warning: colors.warning.DEFAULT,
  default: colors.content.tertiary,
};

const sizeMap: Record<BadgeSize, 'small' | 'default'> = {
  sm: 'small',
  md: 'default',
};

export function Badge({
  count,
  dot,
  status,
  color,
  size = 'md',
  overflowCount = 99,
  showZero = false,
  offset,
  className,
  children,
}: BadgeProps) {
  const resolvedColor = color ?? (status ? statusColorMap[status] : undefined);

  return (
    <AntBadge
      count={count}
      dot={dot}
      status={!color && !count && !dot ? status : undefined}
      color={resolvedColor}
      size={sizeMap[size]}
      overflowCount={overflowCount}
      showZero={showZero}
      offset={offset}
      className={cn(className)}
    >
      {children}
    </AntBadge>
  );
}

// --- StatusBadge: inline status dot + text ---

export interface StatusBadgeProps {
  status: BadgeStatus;
  text?: string;
  className?: string;
}

export function StatusBadge({ status, text, className }: StatusBadgeProps) {
  return (
    <AntBadge
      status={status}
      text={text}
      color={statusColorMap[status]}
      className={cn(className)}
    />
  );
}
