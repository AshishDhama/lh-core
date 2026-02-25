import { createLazyFileRoute } from '@tanstack/react-router';
import { BookOpen, CalendarDays, Clock, Target } from 'lucide-react';

import {
  ProgramCard,
  ReportCard,
  StatCard,
  Text,
  Title,
} from '@/forge';
import type { SidebarItem } from '@/forge';
import { DashboardLayout } from '@/forge/layouts';
import { colors } from '@/forge/tokens';
import { programList } from '@/data/programs';
import { reports } from '@/data/reports';
import type { Program } from '@/types/program';

// ─── Static data ─────────────────────────────────────────────────────────────

const SIDEBAR_ITEMS: SidebarItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  { key: 'programs', label: 'Programs', icon: 'BookOpen', path: '/programs' },
  { key: 'development', label: 'Development', icon: 'Target', path: '/development' },
  { key: 'scheduling', label: 'Scheduling', icon: 'CalendarDays', path: '/scheduling' },
  { key: 'insights', label: 'Insights', icon: 'ChartBar', path: '/insights' },
];

const MOCK_USER = {
  name: 'Priya Sharma',
  role: 'Senior Manager',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toProgramCardStatus(status: Program['status']): 'active' | 'completed' | 'locked' {
  if (status === 'progress') return 'active';
  if (status === 'complete') return 'completed';
  return 'locked';
}

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createLazyFileRoute('/')({
  component: DashboardPage,
});

function DashboardPage() {
  const activePrograms = programList.filter((p) => p.status === 'progress');
  const avgCompletion = Math.round(
    programList.reduce((sum, p) => sum + p.pct, 0) / programList.length,
  );
  const upcomingCount = programList.reduce(
    (sum, p) =>
      sum +
      [...p.seqExercises, ...p.openExercises].filter((e) => e.status === 'locked').length,
    0,
  );
  const availableReports = reports.filter((r) => r.available);
  const firstName = MOCK_USER.name.split(' ')[0];

  return (
    <DashboardLayout
      sidebarItems={SIDEBAR_ITEMS}
      user={MOCK_USER}
      title="Lighthouse"
      activeKey="dashboard"
      notifications={3}
    >
      <div className="p-6 space-y-8 max-w-7xl mx-auto">

        {/* Welcome */}
        <div>
          <Title level={3} weight="bold" color="primary">
            Good morning, {firstName}
          </Title>
          <Text color="secondary" size="sm" className="mt-1">
            {activePrograms.length} active {activePrograms.length === 1 ? 'program' : 'programs'}
            {' '}· {upcomingCount} upcoming exercises
          </Text>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Programs"
            value={activePrograms.length}
            icon={<BookOpen size={18} />}
            iconColor={colors.navy.DEFAULT}
            trend="flat"
          />
          <StatCard
            title="Avg. Completion"
            value={`${avgCompletion}%`}
            icon={<Target size={18} />}
            iconColor={colors.teal.DEFAULT}
            change={8}
          />
          <StatCard
            title="Upcoming Exercises"
            value={upcomingCount}
            icon={<CalendarDays size={18} />}
            iconColor={colors.purple.DEFAULT}
          />
          <StatCard
            title="Hours Logged"
            value="4.5h"
            icon={<Clock size={18} />}
            iconColor={colors.success.DEFAULT}
            change={12}
          />
        </div>

        {/* Program cards */}
        <section>
          <Title level={4} weight="semibold" color="primary" className="mb-4">
            My Programs
          </Title>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {programList.map((program) => (
              <ProgramCard
                key={program.id}
                title={program.name}
                description={program.desc}
                progress={program.pct}
                status={toProgramCardStatus(program.status)}
                daysLeft={program.daysLeft}
                accentColor={program.accent}
              />
            ))}
          </div>
        </section>

        {/* Recent reports */}
        {availableReports.length > 0 && (
          <section>
            <Title level={4} weight="semibold" color="primary" className="mb-4">
              Recent Reports
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {availableReports.map((report) => (
                <ReportCard
                  key={report.id}
                  title={report.name}
                  period="Leadership Assessment 2026"
                  status="published"
                  onView={() => {}}
                />
              ))}
            </div>
          </section>
        )}

        <div className="h-8" aria-hidden="true" />
      </div>
    </DashboardLayout>
  );
}
