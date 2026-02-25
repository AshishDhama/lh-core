import { Spin } from 'antd';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import type { ReactNode } from 'react';

import { Text, Title } from '@/forge/primitives';
import { cn } from '@/forge/utils';

export type StatTrend = 'up' | 'down' | 'flat';

export interface StatCardProps {
  title: string;
  value: string | number;
  /** Numeric change in percent (e.g. 12 = +12%, -5 = -5%). */
  change?: number;
  trend?: StatTrend;
  icon?: ReactNode;
  /** Accent color for the icon background (Tailwind bg-* or hex CSS). */
  iconColor?: string;
  loading?: boolean;
  className?: string;
}

const trendConfig: Record<StatTrend, { icon: ReactNode; className: string; label: string }> = {
  up: {
    icon: <TrendingUp size={12} />,
    className: 'text-[#22c55e] bg-[#86efac]/20',
    label: 'up',
  },
  down: {
    icon: <TrendingDown size={12} />,
    className: 'text-[#ef4444] bg-[#fca5a5]/20',
    label: 'down',
  },
  flat: {
    icon: <Minus size={12} />,
    className: 'text-[#94a3b8] bg-[#94a3b8]/10',
    label: 'flat',
  },
};

function deriveTrend(change?: number): StatTrend | undefined {
  if (change === undefined) return undefined;
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'flat';
}

export function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  iconColor = '#002C77',
  loading = false,
  className,
}: StatCardProps) {
  const resolvedTrend = trend ?? deriveTrend(change);
  const trendMeta = resolvedTrend ? trendConfig[resolvedTrend] : undefined;

  return (
    <div
      className={cn(
        'rounded-[14px] border border-slate-200 bg-white shadow-sm p-4',
        'flex flex-col gap-3',
        className,
      )}
    >
      {/* Icon row */}
      {icon && (
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${iconColor}15`, color: iconColor }}
        >
          {icon}
        </div>
      )}

      {/* Value */}
      {loading ? (
        <Spin size="small" />
      ) : (
        <Title
          level={3}
          weight="bold"
          color="primary"
          className="!mb-0 !text-2xl leading-none"
        >
          {value}
        </Title>
      )}

      {/* Title + trend */}
      <div className="flex items-center justify-between gap-2">
        <Text size="xs" color="tertiary">
          {title}
        </Text>

        {trendMeta && change !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-semibold',
              trendMeta.className,
            )}
            aria-label={`Trend ${trendMeta.label}`}
          >
            {trendMeta.icon}
            {change > 0 ? '+' : ''}
            {change}%
          </span>
        )}
      </div>
    </div>
  );
}
