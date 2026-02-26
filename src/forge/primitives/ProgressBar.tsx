import { Progress as AntProgress } from 'antd';
import type { ReactNode } from 'react';

import { cn } from '@/forge/utils';
import { colors } from '@/forge/tokens';

type ProgressStatus = 'success' | 'exception' | 'active' | 'normal';
type ProgressType = 'line' | 'circle';
type ProgressSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ProgressBarProps {
  percent: number;
  status?: ProgressStatus;
  type?: ProgressType;
  size?: ProgressSize;
  strokeColor?: string;
  trailColor?: string;
  showInfo?: boolean;
  format?: (percent?: number) => ReactNode;
  strokeWidth?: number;
  className?: string;
}

const sizeMap: Record<ProgressSize, { strokeWidth: number; width?: number }> = {
  xs: { strokeWidth: 2, width: 40 },
  sm: { strokeWidth: 4, width: 60 },
  md: { strokeWidth: 8, width: 80 },
  lg: { strokeWidth: 12, width: 120 },
};

const statusColorMap: Record<ProgressStatus, string> = {
  success: colors.success.DEFAULT,
  exception: colors.error.DEFAULT,
  active: colors.teal.DEFAULT,
  normal: colors.navy.DEFAULT,
};

export function ProgressBar({
  percent,
  status = 'normal',
  type = 'line',
  size = 'md',
  strokeColor,
  trailColor,
  showInfo = true,
  format,
  strokeWidth,
  className,
}: ProgressBarProps) {
  const sizeConfig = sizeMap[size];
  const resolvedStrokeColor = strokeColor ?? statusColorMap[status];
  const resolvedStrokeWidth = strokeWidth ?? sizeConfig.strokeWidth;

  return (
    <AntProgress
      percent={percent}
      status={status}
      type={type}
      strokeColor={resolvedStrokeColor}
      trailColor={trailColor}
      showInfo={showInfo}
      format={format}
      strokeWidth={resolvedStrokeWidth}
      size={type === 'circle' ? sizeConfig.width : undefined}
      className={cn(className)}
    />
  );
}
