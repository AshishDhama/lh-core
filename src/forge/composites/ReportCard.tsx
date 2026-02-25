import { Download, FileText, TrendingDown, TrendingUp } from 'lucide-react';

import { Button, Text } from '@/forge/primitives';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';

export interface ReportMetric {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
}

export type ReportStatus = 'draft' | 'published';

export interface ReportCardProps {
  title: string;
  period: string;
  metrics?: ReportMetric[];
  status?: ReportStatus;
  generatedAt?: Date | string;
  downloadUrl?: string;
  onDownload?: () => void;
  onView?: () => void;
  className?: string;
}

const statusConfig: Record<ReportStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: '#475569', bg: '#f1f5f9' },
  published: { label: 'Published', color: '#15803d', bg: '#dcfce7' },
};

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface MetricRowProps {
  metric: ReportMetric;
}

function MetricRow({ metric }: MetricRowProps) {
  const hasChange = metric.change !== undefined;
  const isPositive = (metric.change ?? 0) >= 0;

  return (
    <div className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0">
      <Text size="sm" color="secondary">
        {metric.label}
      </Text>
      <div className="flex items-center gap-2">
        <Text size="sm" weight="semibold" color="primary">
          {metric.value}
        </Text>
        {hasChange && (
          <span
            className={cn(
              'flex items-center gap-0.5 text-xs font-medium',
              isPositive ? 'text-success-dark' : 'text-error-dark',
            )}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {metric.changeLabel ?? `${Math.abs(metric.change!)}%`}
          </span>
        )}
      </div>
    </div>
  );
}

export function ReportCard({
  title,
  period,
  metrics = [],
  status = 'published',
  generatedAt,
  onDownload,
  onView,
  className,
}: ReportCardProps) {
  const { label: statusLabel, color: statusColor, bg: statusBg } = statusConfig[status];

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-border bg-surface-primary p-4 shadow-sm',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-50 dark:bg-navy-900/20">
            <FileText size={18} style={{ color: colors.navy.DEFAULT }} />
          </div>
          <div className="min-w-0 flex flex-col">
            <Text size="sm" weight="semibold" color="primary" className="leading-snug block">
              {title}
            </Text>
            <Text size="xs" color="tertiary" className="mt-0.5 block">
              {period}
            </Text>
          </div>
        </div>

        <span
          className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{ color: statusColor, backgroundColor: statusBg }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Metrics */}
      {metrics.length > 0 && (
        <div className="flex flex-col">
          {metrics.map((metric, idx) => (
            <MetricRow key={idx} metric={metric} />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        {generatedAt && (
          <Text size="xs" color="tertiary">
            Generated {formatDate(generatedAt)}
          </Text>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {onView && (
            <Button size="sm" variant="secondary" onClick={onView}>
              View
            </Button>
          )}
          {onDownload && (
            <Button
              size="sm"
              variant="primary"
              icon={<Download size={14} />}
              onClick={onDownload}
            >
              Download
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
