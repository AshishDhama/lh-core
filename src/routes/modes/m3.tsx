import { createFileRoute, Link } from '@tanstack/react-router';
import { ConfigProvider } from 'antd';
import { Activity, BookOpen, TrendingUp, Users } from 'lucide-react';

import { Badge, Button, StatCard, StatusBadge, Text, Title } from '@/forge';
import { m3Tokens } from '@/forge/tokens/modes/m3';
import { resolveModeTokens } from '@/forge/tokens/modes/utils';
import { cn } from '@/forge/utils';

export const Route = createFileRoute('/modes/m3')({
  component: M3ModePage,
});

type ModePath =
  | '/modes/scrolly'
  | '/modes/bento'
  | '/modes/editorial'
  | '/modes/notion'
  | '/modes/m3';

const MODES: { key: string; label: string; to: ModePath }[] = [
  { key: 'scrolly', label: 'Scrolly', to: '/modes/scrolly' },
  { key: 'bento', label: 'Bento', to: '/modes/bento' },
  { key: 'editorial', label: 'Editorial', to: '/modes/editorial' },
  { key: 'notion', label: 'Notion', to: '/modes/notion' },
  { key: 'm3', label: 'Material 3', to: '/modes/m3' },
];

function M3ModePage() {
  const antTheme = resolveModeTokens(m3Tokens);

  return (
    <ConfigProvider theme={antTheme}>
      <div className="min-h-screen bg-[#fffbfe]">
        {/* Mode nav */}
        <nav className="sticky top-0 z-10 bg-[#fffbfe]/95 backdrop-blur-sm border-b border-[#e8def8] px-6 py-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[#625B71] uppercase tracking-wider mr-2">
            Design Mode
          </span>
          {MODES.map((mode) => (
            <Link key={mode.key} to={mode.to}>
              <span
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer',
                  mode.key === 'm3'
                    ? 'bg-[#6750A4] text-white'
                    : 'text-[#625B71] hover:bg-[#e8def8]/60',
                )}
              >
                {mode.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="max-w-5xl mx-auto px-8 py-12 space-y-16">
          {/* Header */}
          <section className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e8def8] text-[#6750A4] text-sm font-medium">
              Dynamic · Elevated · Bold
            </div>
            <Title level={1} weight="bold" color="primary">
              Material 3 Mode
            </Title>
            <Text size="lg" color="secondary">
              Google Material Design 3 with dynamic color, elevated surfaces, and bold accents
            </Text>
          </section>

          {/* Typography */}
          <section className="space-y-4">
            <Text size="xs" weight="semibold" color="tertiary" className="uppercase tracking-widest">
              Typography
            </Text>
            <div className="bg-[#fffbfe] rounded-[28px] border border-[#e8def8] p-10 space-y-5 shadow-md shadow-[#6750A4]/10">
              <Title level={1}>Career Insights Platform</Title>
              <Title level={2}>Empowering Professionals</Title>
              <Title level={3}>Assessment Results</Title>
              <Title level={4}>Development Plan Overview</Title>
              <Text size="lg" color="secondary">
                Your leadership competency profile reflects strong strategic thinking and
                collaborative decision-making abilities across all dimensions.
              </Text>
              <Text size="sm" color="tertiary">
                Assessments are designed to evaluate both technical proficiency and behavioral
                attributes across core competency areas defined by your organization.
              </Text>
            </div>
          </section>

          {/* Buttons */}
          <section className="space-y-4">
            <Text size="xs" weight="semibold" color="tertiary" className="uppercase tracking-widest">
              Buttons
            </Text>
            <div className="bg-[#fffbfe] rounded-[28px] border border-[#e8def8] p-10 shadow-md shadow-[#6750A4]/10 flex flex-wrap gap-4 items-center">
              <Button variant="primary">Get Started</Button>
              <Button variant="secondary">View Report</Button>
              <Button variant="ghost">Skip for now</Button>
              <Button variant="danger">Remove</Button>
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="lg">
                Large Action
              </Button>
            </div>
          </section>

          {/* Stat Cards */}
          <section className="space-y-4">
            <Text size="xs" weight="semibold" color="tertiary" className="uppercase tracking-widest">
              Stat Cards
            </Text>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Active Programs"
                value={4}
                change={8}
                icon={<BookOpen size={18} />}
                iconColor="#6750A4"
                className="rounded-[28px] border-[#e8def8] shadow-md shadow-[#6750A4]/10"
              />
              <StatCard
                title="Completion Rate"
                value="78%"
                change={12}
                icon={<TrendingUp size={18} />}
                iconColor="#006A6A"
                className="rounded-[28px] border-[#e8def8] shadow-md shadow-[#6750A4]/10"
              />
              <StatCard
                title="Team Members"
                value={24}
                icon={<Users size={18} />}
                iconColor="#625B71"
                className="rounded-[28px] border-[#e8def8] shadow-md shadow-[#6750A4]/10"
              />
              <StatCard
                title="Sessions Logged"
                value={156}
                change={-3}
                icon={<Activity size={18} />}
                iconColor="#386A20"
                className="rounded-[28px] border-[#e8def8] shadow-md shadow-[#6750A4]/10"
              />
            </div>
          </section>

          {/* Badges */}
          <section className="space-y-4">
            <Text size="xs" weight="semibold" color="tertiary" className="uppercase tracking-widest">
              Badges
            </Text>
            <div className="bg-[#fffbfe] rounded-[28px] border border-[#e8def8] p-10 shadow-md shadow-[#6750A4]/10 flex flex-wrap gap-6 items-center">
              <Badge count={5} />
              <Badge count={99} overflowCount={50} />
              <StatusBadge status="success" text="Published" />
              <StatusBadge status="processing" text="In Progress" />
              <StatusBadge status="warning" text="Review Required" />
              <StatusBadge status="error" text="Action Needed" />
            </div>
          </section>
        </div>
      </div>
    </ConfigProvider>
  );
}
