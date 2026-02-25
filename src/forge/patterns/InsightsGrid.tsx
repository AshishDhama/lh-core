import { Icon } from '@/forge/primitives/Icon';
import { Text, Title } from '@/forge/primitives/Typography';
import { StatCard } from '@/forge/composites/StatCard';
import type { StatCardProps } from '@/forge/composites/StatCard';
import { ReportCard } from '@/forge/composites/ReportCard';
import type { ReportCardProps } from '@/forge/composites/ReportCard';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';

export interface ChartConfig {
  id: string;
  title: string;
  /** Placeholder height in px until real charts are implemented */
  height?: number;
}

export interface InsightsGridProps {
  stats: StatCardProps[];
  charts?: ChartConfig[];
  reports: ReportCardProps[];
  period?: string;
  className?: string;
}

function ChartPlaceholder({ config }: { config: ChartConfig }) {
  return (
    <div
      className="flex flex-col gap-3 p-5 rounded-2xl border border-[#e2e8f0] bg-white"
      style={{ minHeight: config.height ?? 200 }}
    >
      <Text size="sm" weight="semibold" color="primary">
        {config.title}
      </Text>
      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
        <Icon
          name="ChartBar"
          size="lg"
          style={{ color: colors.content.tertiary }}
          aria-hidden="true"
        />
        <Text size="xs" color="tertiary">
          Chart coming soon
        </Text>
      </div>
    </div>
  );
}

export function InsightsGrid({ stats, charts = [], reports, period, className }: InsightsGridProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Title level={2} className="!mb-0">
          Insights
        </Title>
        {period && (
          <Text size="sm" color="secondary">
            Period: <span className="font-medium text-[#0f172a]">{period}</span>
          </Text>
        )}
      </div>

      {/* Stat cards row */}
      {stats.length > 0 && (
        <section aria-label="Key metrics">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        </section>
      )}

      {/* Charts row */}
      {charts.length > 0 && (
        <section aria-label="Charts">
          <div
            className={cn(
              'grid gap-4',
              charts.length === 1
                ? 'grid-cols-1'
                : charts.length === 2
                  ? 'grid-cols-1 md:grid-cols-2'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
            )}
          >
            {charts.map((chart) => (
              <ChartPlaceholder key={chart.id} config={chart} />
            ))}
          </div>
        </section>
      )}

      {/* Reports section */}
      {reports.length > 0 && (
        <section aria-label="Reports" className="flex flex-col gap-3">
          <Title level={3} className="!mb-0 !text-base">
            Reports
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report, i) => (
              <ReportCard key={i} {...report} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
