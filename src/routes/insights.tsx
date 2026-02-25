import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { BarChart3, BookOpen, CheckCircle2, Target, TrendingUp } from 'lucide-react';

import { ReportCard, StatCard, Text, Title } from '@/forge';
import { ReportPreviewModal } from '@/forge/patterns';
import { DashboardLayout } from '@/forge/layouts';
import { colors } from '@/forge/tokens';
import { reports, competencies } from '@/data/reports';
import type { Report } from '@/types/report';
import { useTranslation } from '@/i18n';
import { useThemeStore } from '@/stores/useThemeStore';
import { useSidebarItems } from '@/hooks';

// ─── Shared constants ─────────────────────────────────────────────────────────

const MOCK_USER = {
  name: 'Priya Sharma',
  role: 'Senior Manager',
};

type Period = 'week' | 'month' | 'quarter' | 'year';

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute('/insights')({
  component: InsightsPage,
});

function InsightsPage() {
  const locale = useThemeStore((s) => s.locale);
  const { t } = useTranslation(locale);
  const [period, setPeriod] = useState<Period>('month');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const sidebarItems = useSidebarItems();

  const periodLabels: Record<Period, string> = {
    week: t('insights.periods.week'),
    month: t('insights.periods.month'),
    quarter: t('insights.periods.quarter'),
    year: t('insights.periods.year'),
  };

  const availableReports = reports.filter((r) => r.available);
  const totalReports = reports.length;
  const completedReports = availableReports.length;
  const avgScore = Math.round(
    competencies.reduce((sum, c) => sum + c.score, 0) / competencies.length,
  );

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      user={MOCK_USER}
      title="Lighthouse"
      activeKey="insights"
    >
      <div className="p-6 space-y-8 max-w-7xl mx-auto">

        {/* Header + period selector */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Title level={3} weight="bold" color="primary">{t('pages.insights')}</Title>
            <Text color="secondary" size="sm" className="mt-1">
              {t('insights.subtitle')}
            </Text>
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-primary p-1">
            {(Object.keys(periodLabels) as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={[
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  period === p
                    ? 'bg-navy dark:bg-navy-400 text-white'
                    : 'text-content-secondary hover:text-content-primary hover:bg-surface-tertiary',
                ].join(' ')}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('insights.reportsAvailable')}
            value={`${completedReports}/${totalReports}`}
            icon={<BookOpen size={18} />}
            iconColor={colors.navy.DEFAULT}
            trend="up"
          />
          <StatCard
            title={t('insights.avgCompetencyScore')}
            value={`${avgScore}%`}
            icon={<Target size={18} />}
            iconColor={colors.teal.DEFAULT}
            change={5}
          />
          <StatCard
            title={t('insights.completedAssessments')}
            value={completedReports}
            icon={<CheckCircle2 size={18} />}
            iconColor={colors.success.DEFAULT}
            change={15}
          />
          <StatCard
            title={t('insights.developmentProgress')}
            value={t('status.onTrack')}
            icon={<TrendingUp size={18} />}
            iconColor={colors.purple.DEFAULT}
            trend="up"
          />
        </div>

        {/* Competency scores — chart placeholder */}
        <section>
          <Title level={4} weight="semibold" color="primary" className="mb-4">
            {t('insights.competencyScores')}
          </Title>
          <div className="rounded-xl border border-border bg-surface-primary p-5 space-y-4">
            {competencies.map((comp) => (
              <div key={comp.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <Text size="sm" weight="medium" color="primary">{comp.label}</Text>
                  <div className="flex items-center gap-2">
                    <Text size="xs" color="tertiary">{comp.type}</Text>
                    <Text size="sm" weight="bold" color="primary">{comp.score}%</Text>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${comp.score}%`, backgroundColor: comp.color }}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <BarChart3 size={14} style={{ color: colors.content.tertiary }} />
              <Text size="xs" color="tertiary">
                {t('insights.scoresBasedOn')} · {periodLabels[period]}
              </Text>
            </div>
          </div>
        </section>

        {/* Reports */}
        <section>
          <Title level={4} weight="semibold" color="primary" className="mb-4">
            {t('insights.assessmentReports')}
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                title={report.name}
                period="Leadership Assessment 2026"
                status={report.available ? 'published' : 'draft'}
                generatedAt={report.available ? new Date('2026-02-20') : undefined}
                onView={report.available ? () => setSelectedReport(report) : undefined}
                onDownload={report.available ? () => {} : undefined}
              />
            ))}
          </div>
        </section>

        <div className="h-8" aria-hidden="true" />
      </div>

      <ReportPreviewModal
        report={selectedReport}
        open={selectedReport !== null}
        onClose={() => setSelectedReport(null)}
      />
    </DashboardLayout>
  );
}
