import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { BookOpen, CalendarDays, Target } from 'lucide-react';

import { ProgramCard, Text, Title } from '@/forge';
import { DashboardLayout } from '@/forge/layouts';
import { colors } from '@/forge/tokens';
import { programList } from '@/data/programs';
import type { Program } from '@/types/program';
import { useTranslation } from '@/i18n';
import { useThemeStore } from '@/stores/useThemeStore';
import { useSidebarItems } from '@/hooks';

const MOCK_USER = {
  name: 'Priya Sharma',
  role: 'Senior Manager',
};

function toProgramCardStatus(status: Program['status']): 'active' | 'completed' | 'locked' {
  if (status === 'progress') return 'active';
  if (status === 'complete') return 'completed';
  return 'locked';
}

export const Route = createFileRoute('/programs/')({
  component: ProgramsIndexPage,
});

function ProgramsIndexPage() {
  const locale = useThemeStore((s) => s.locale);
  const { t } = useTranslation(locale);
  const sidebarItems = useSidebarItems();
  const navigate = useNavigate();

  const activePrograms = programList.filter((p) => p.status === 'progress');
  const completedPrograms = programList.filter((p) => p.status === 'complete');
  const lockedPrograms = programList.filter((p) => p.status === 'locked');

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      user={MOCK_USER}
      title="Lighthouse"
      activeKey="programs"
    >
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <Title level={3} weight="bold" color="primary">
            {t('programs.title')}
          </Title>
          <Text color="secondary" size="sm" className="mt-1">
            {programList.length} {t('nav.programs').toLowerCase()} · {activePrograms.length} {t('status.active').toLowerCase()}
          </Text>
        </div>

        {/* Active programs */}
        {activePrograms.length > 0 && (
          <section>
            <Title level={4} weight="semibold" color="primary" className="mb-4">
              {t('status.active')} ({activePrograms.length})
            </Title>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activePrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  title={program.name}
                  description={program.desc}
                  progress={program.pct}
                  status={toProgramCardStatus(program.status)}
                  daysLeft={program.daysLeft}
                  accentColor={program.accent}
                  onClick={() =>
                    navigate({ to: '/programs/$programId', params: { programId: program.id } })
                  }
                />
              ))}
            </div>
          </section>
        )}

        {/* Completed programs */}
        {completedPrograms.length > 0 && (
          <section>
            <Title level={4} weight="semibold" color="primary" className="mb-4">
              {t('status.completed')} ({completedPrograms.length})
            </Title>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedPrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  title={program.name}
                  description={program.desc}
                  progress={program.pct}
                  status={toProgramCardStatus(program.status)}
                  accentColor={program.accent}
                  onClick={() =>
                    navigate({ to: '/programs/$programId', params: { programId: program.id } })
                  }
                />
              ))}
            </div>
          </section>
        )}

        {/* Locked programs */}
        {lockedPrograms.length > 0 && (
          <section>
            <Title level={4} weight="semibold" color="primary" className="mb-4">
              {t('status.upcoming')} ({lockedPrograms.length})
            </Title>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {lockedPrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  title={program.name}
                  description={program.desc}
                  progress={program.pct}
                  status={toProgramCardStatus(program.status)}
                  accentColor={program.accent}
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
