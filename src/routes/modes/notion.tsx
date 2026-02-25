import { createFileRoute, Link } from '@tanstack/react-router';
import { ConfigProvider } from 'antd';
import { Activity, BookOpen, TrendingUp, Users } from 'lucide-react';

import { Badge, Button, StatCard, StatusBadge, Text, Title } from '@/forge';
import { notionTokens } from '@/forge/tokens/modes/notion';
import { resolveModeTokens } from '@/forge/tokens/modes/utils';
import { cn } from '@/forge/utils';

export const Route = createFileRoute('/modes/notion')({
  component: NotionModePage,
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

function NotionModePage() {
  const antTheme = resolveModeTokens(notionTokens);

  return (
    <ConfigProvider theme={antTheme}>
      <div className="min-h-screen bg-[#f7f6f3]">
        {/* Mode nav */}
        <nav className="sticky top-0 z-10 bg-[#f7f6f3] border-b border-slate-200 px-6 py-3 flex items-center gap-1 flex-wrap">
          <span className="text-xs font-medium text-slate-400 mr-3">Design Mode:</span>
          {MODES.map((mode) => (
            <Link key={mode.key} to={mode.to}>
              <span
                className={cn(
                  'px-2.5 py-1 rounded text-sm transition-colors cursor-pointer',
                  mode.key === 'notion'
                    ? 'bg-[#2d3748] text-white font-medium'
                    : 'text-slate-500 hover:bg-slate-200/60',
                )}
              >
                {mode.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
          {/* Header */}
          <section className="space-y-2">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Minimal · Clean · Productivity
            </div>
            <Title level={1} weight="bold" color="primary">
              Notion Mode
            </Title>
            <Text size="base" color="secondary">
              Minimal, productivity-first design with clean lines and subtle interactions
            </Text>
          </section>

          {/* Typography */}
          <section className="space-y-3">
            <Text size="xs" weight="medium" color="tertiary" className="uppercase tracking-wider">
              Typography
            </Text>
            <div className="bg-white rounded-lg border border-slate-200 p-8 space-y-4">
              <Title level={1}>Career Insights Platform</Title>
              <Title level={2}>Empowering Professionals</Title>
              <Title level={3}>Assessment Results</Title>
              <Title level={4}>Development Plan Overview</Title>
              <Text size="base" color="secondary">
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
          <section className="space-y-3">
            <Text size="xs" weight="medium" color="tertiary" className="uppercase tracking-wider">
              Buttons
            </Text>
            <div className="bg-white rounded-lg border border-slate-200 p-8 flex flex-wrap gap-3 items-center">
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
          <section className="space-y-3">
            <Text size="xs" weight="medium" color="tertiary" className="uppercase tracking-wider">
              Stat Cards
            </Text>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                title="Active Programs"
                value={4}
                change={8}
                icon={<BookOpen size={16} />}
                iconColor="#2d3748"
                className="rounded-lg shadow-none border-slate-200"
              />
              <StatCard
                title="Completion Rate"
                value="78%"
                change={12}
                icon={<TrendingUp size={16} />}
                iconColor="#2d3748"
                className="rounded-lg shadow-none border-slate-200"
              />
              <StatCard
                title="Team Members"
                value={24}
                icon={<Users size={16} />}
                iconColor="#2d3748"
                className="rounded-lg shadow-none border-slate-200"
              />
              <StatCard
                title="Sessions Logged"
                value={156}
                change={-3}
                icon={<Activity size={16} />}
                iconColor="#2d3748"
                className="rounded-lg shadow-none border-slate-200"
              />
            </div>
          </section>

          {/* Badges */}
          <section className="space-y-3">
            <Text size="xs" weight="medium" color="tertiary" className="uppercase tracking-wider">
              Badges
            </Text>
            <div className="bg-white rounded-lg border border-slate-200 p-8 flex flex-wrap gap-5 items-center">
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
