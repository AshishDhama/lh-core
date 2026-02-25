import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { BarChart3, BookOpen, CheckCircle2, Target, TrendingUp } from 'lucide-react';

import { ReportCard, StatCard, Text, Title } from '@/forge';
import type { SidebarItem } from '@/forge';
import { DashboardLayout } from '@/forge/layouts';
import { colors } from '@/forge/tokens';
import { reports, competencies } from '@/data/reports';
import { i18n } from '@/i18n';

// ─── Shared constants ─────────────────────────────────────────────────────────

const SIDEBAR_ITEMS: SidebarItem[] = [
  { key: 'dashboard', label: i18n.t('nav.dashboard'), icon: 'LayoutDashboard', path: '/' },
  { key: 'programs', label: i18n.t('nav.programs'), icon: 'BookOpen', path: '/programs' },
  { key: 'development', label: i18n.t('nav.development'), icon: 'Target', path: '/development' },
  { key: 'scheduling', label: i18n.t('nav.scheduling'), icon: 'CalendarDays', path: '/scheduling' },
  { key: 'insights', label: i18n.t('nav.insights'), icon: 'ChartBar', path: '/insights' },
];

const MOCK_USER = {
  name: 'Priya Sharma',
  role: 'Senior Manager',
};

type Period = 'week' | 'month' | 'quarter' | 'year';

const PERIOD_LABELS: Record<Period, string> = {
  week: i18n.t('insights.periods.week'),
  month: i18n.t('insights.periods.month'),
  quarter: i18n.t('insights.periods.quarter'),
  year: i18n.t('insights.periods.year'),
};

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute('/insights')({
  component: InsightsPage,
});

function InsightsPage() {
  const [period, setPeriod] = useState<Period>('month');

  const availableReports = reports.filter((r) => r.available);
  const totalReports = reports.length;
  const completedReports = availableReports.length;
  const avgScore = Math.round(
    competencies.reduce((sum, c) => sum + c.score, 0) / competencies.length,
  );

  return (
    <DashboardLayout
      sidebarItems={SIDEBAR_ITEMS}
      user={MOCK_USER}
      title="Lighthouse"
      activeKey="insights"
    >
      <div className="p-6 space-y-8 max-w-7xl mx-auto">

        {/* Header + period selector */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Title level={3} weight="bold" color="primary">{i18n.t('pages.insights')}</Title>
            <Text color="secondary" size="sm" className="mt-1">
              {i18n.t('insights.subtitle')}
            </Text>
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-1 rounded-lg border border-[#e2e8f0] bg-surface-primary p-1">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={[
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  period === p
                    ? 'bg-[#002C77] text-white'
                    : 'text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9]',
                ].join(' ')}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={i18n.t('insights.reportsAvailable')}
            value={`${completedReports}/${totalReports}`}
            icon={<BookOpen size={18} />}
            iconColor={colors.navy.DEFAULT}
            trend="up"
          />
          <StatCard
            title={i18n.t('insights.avgCompetencyScore')}
            value={`${avgScore}%`}
            icon={<Target size={18} />}
            iconColor={colors.teal.DEFAULT}
            change={5}
          />
          <StatCard
            title={i18n.t('insights.completedAssessments')}
            value={completedReports}
            icon={<CheckCircle2 size={18} />}
            iconColor={colors.success.DEFAULT}
            change={15}
          />
          <StatCard
            title={i18n.t('insights.developmentProgress')}
            value={i18n.t('status.onTrack')}
            icon={<TrendingUp size={18} />}
            iconColor={colors.purple.DEFAULT}
            trend="up"
          />
        </div>

        {/* Competency scores — chart placeholder */}
        <section>
          <Title level={4} weight="semibold" color="primary" className="mb-4">
            {i18n.t('insights.competencyScores')}
          </Title>
          <div className="rounded-xl border border-[#e2e8f0] bg-surface-primary p-5 space-y-4">
            {competencies.map((comp) => (
              <div key={comp.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <Text size="sm" weight="medium" color="primary">{comp.label}</Text>
                  <div className="flex items-center gap-2">
                    <Text size="xs" color="tertiary">{comp.type}</Text>
                    <Text size="sm" weight="bold" color="primary">{comp.score}%</Text>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
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
                {i18n.t('insights.scoresBasedOn')} · {PERIOD_LABELS[period]}
              </Text>
            </div>
          </div>
        </section>

        {/* Reports */}
        <section>
          <Title level={4} weight="semibold" color="primary" className="mb-4">
            {i18n.t('insights.assessmentReports')}
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                title={report.name}
                period="Leadership Assessment 2026"
                status={report.available ? 'published' : 'draft'}
                generatedAt={report.available ? new Date('2026-02-20') : undefined}
                onView={report.available ? () => {} : undefined}
                onDownload={report.available ? () => {} : undefined}
              />
            ))}
          </div>
        </section>

        <div className="h-8" aria-hidden="true" />
      </div>
    </DashboardLayout>
  );
}
