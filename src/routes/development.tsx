import { createFileRoute } from '@tanstack/react-router';
import { BookOpen, Lightbulb, Target, TrendingUp } from 'lucide-react';

import { Button, StatCard, Text, Title } from '@/forge';
import { DashboardLayout } from '@/forge/layouts';
import { colors } from '@/forge/tokens';
import { useTranslation } from '@/i18n';
import { useThemeStore } from '@/stores/useThemeStore';
import { useSidebarItems } from '@/hooks';

const MOCK_USER = {
  name: 'Priya Sharma',
  role: 'Senior Manager',
};

export const Route = createFileRoute('/development')({
  component: DevelopmentPage,
});

function DevelopmentPage() {
  const locale = useThemeStore((s) => s.locale);
  const { t } = useTranslation(locale);
  const sidebarItems = useSidebarItems();

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      user={MOCK_USER}
      title="Lighthouse"
      activeKey="development"
    >
      <div className="p-6 space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <Title level={3} weight="bold" color="primary">
            {t('development.title')}
          </Title>
          <Text color="secondary" size="sm" className="mt-1">
            {t('development.subtitle')}
          </Text>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Goals Set"
            value={3}
            icon={<Target size={18} />}
            iconColor={colors.navy.DEFAULT}
          />
          <StatCard
            title="Skills Tracked"
            value={7}
            icon={<Lightbulb size={18} />}
            iconColor={colors.teal.DEFAULT}
            change={2}
          />
          <StatCard
            title="Milestones Done"
            value="5/12"
            icon={<TrendingUp size={18} />}
            iconColor={colors.purple.DEFAULT}
          />
          <StatCard
            title="Resources"
            value={4}
            icon={<BookOpen size={18} />}
            iconColor={colors.success.DEFAULT}
          />
        </div>

        {/* My Plan card */}
        <section>
          <Title level={4} weight="semibold" color="primary" className="mb-4">
            {t('development.myPlan')}
          </Title>
          <div className="rounded-2xl border border-border bg-surface-primary p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-50 dark:bg-navy-900/20">
                <Target size={22} style={{ color: colors.navy.DEFAULT }} />
              </div>
              <div className="flex-1 min-w-0">
                <Title level={4} weight="semibold" color="primary">
                  {t('idp.title')}
                </Title>
                <Text size="sm" color="secondary" className="mt-1 leading-relaxed">
                  {t('development.myPlanDescription')}
                </Text>
              </div>
            </div>

            {/* Progress summary */}
            <div className="flex flex-wrap gap-6">
              <div>
                <Text size="xs" color="tertiary">{t('status.completed')}</Text>
                <Text size="lg" weight="bold" color="primary">42%</Text>
              </div>
              <div>
                <Text size="xs" color="tertiary">{t('idp.milestones')}</Text>
                <Text size="lg" weight="bold" color="primary">5/12</Text>
              </div>
              <div>
                <Text size="xs" color="tertiary">{t('idp.skills')}</Text>
                <Text size="lg" weight="bold" color="primary">7</Text>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden">
                <div
                  className="h-full rounded-full bg-navy transition-all duration-700"
                  style={{ width: '42%' }}
                />
              </div>
            </div>

            <Button variant="primary">
              {t('development.viewPlan')}
            </Button>
          </div>
        </section>

        {/* Skills in Focus */}
        <section>
          <Title level={4} weight="semibold" color="primary" className="mb-4">
            {t('development.skillsInFocus')}
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Strategic Thinking', level: 72, color: colors.navy.DEFAULT },
              { name: 'Stakeholder Management', level: 58, color: colors.teal.DEFAULT },
              { name: 'Decision Making', level: 85, color: colors.purple.DEFAULT },
            ].map((skill) => (
              <div
                key={skill.name}
                className="rounded-xl border border-border bg-surface-primary p-4 space-y-3"
              >
                <Text size="sm" weight="semibold" color="primary">{skill.name}</Text>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Text size="xs" color="tertiary">
                      {skill.level >= 80 ? t('idp.skillLevels.advanced') : skill.level >= 50 ? t('idp.skillLevels.intermediate') : t('idp.skillLevels.beginner')}
                    </Text>
                    <Text size="xs" weight="semibold" color="primary">{skill.level}%</Text>
                  </div>
                  <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${skill.level}%`, backgroundColor: skill.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Resources */}
        <section>
          <Title level={4} weight="semibold" color="primary" className="mb-4">
            {t('development.learningResources')}
          </Title>
          <div className="rounded-2xl border border-border bg-surface-primary p-8 flex flex-col items-center justify-center gap-3 text-center">
            <BookOpen size={32} style={{ color: colors.content.tertiary }} />
            <Text size="sm" color="tertiary">
              {t('development.comingSoon')}
            </Text>
          </div>
        </section>

        <div className="h-8" aria-hidden="true" />
      </div>
    </DashboardLayout>
  );
}
