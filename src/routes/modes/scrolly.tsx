import { createFileRoute, Link } from '@tanstack/react-router';
import { ConfigProvider } from 'antd';
import { Activity, BookOpen, TrendingUp, Users } from 'lucide-react';

import { Badge, Button, StatCard, StatusBadge, Text, Title } from '@/forge';
import { scrollyTokens } from '@/forge/tokens/modes/scrolly';
import { resolveModeTokens } from '@/forge/tokens/modes/utils';
import { cn } from '@/forge/utils';

export const Route = createFileRoute('/modes/scrolly')({
  component: ScrollyModePage,
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

function ScrollyModePage() {
  const antTheme = resolveModeTokens(scrollyTokens);

  return (
    <ConfigProvider theme={antTheme}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30">
        {/* Mode nav */}
        <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-200 px-6 py-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
            Design Mode
          </span>
          {MODES.map((mode) => (
            <Link key={mode.key} to={mode.to}>
              <span
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer',
                  mode.key === 'scrolly'
                    ? 'bg-[#002C77] text-white'
                    : 'text-slate-600 hover:bg-slate-100',
                )}
              >
                {mode.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="max-w-5xl mx-auto px-8 py-12 space-y-16">
          {/* Header */}
          <section className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#002C77]/10 text-[#002C77] text-sm font-medium">
              Flowing · Organic · Rounded
            </div>
            <Title level={1} weight="bold" color="primary">
              Scrolly Mode
            </Title>
            <Text size="lg" color="secondary">
              Smooth, flowing design with organic curves and generous whitespace
            </Text>
          </section>

          {/* Typography */}
          <section className="space-y-4">
            <Text size="xs" weight="semibold" color="tertiary" className="uppercase tracking-widest">
              Typography
            </Text>
            <div className="bg-white rounded-[32px] p-10 shadow-sm space-y-5">
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
            <div className="bg-white rounded-[32px] p-10 shadow-sm flex flex-wrap gap-4 items-center">
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
                iconColor="#002C77"
              />
              <StatCard
                title="Completion Rate"
                value="78%"
                change={12}
                icon={<TrendingUp size={18} />}
                iconColor="#008575"
              />
              <StatCard
                title="Team Members"
                value={24}
                icon={<Users size={18} />}
                iconColor="#7B61FF"
              />
              <StatCard
                title="Sessions Logged"
                value={156}
                change={-3}
                icon={<Activity size={18} />}
                iconColor="#22c55e"
              />
            </div>
          </section>

          {/* Badges */}
          <section className="space-y-4">
            <Text size="xs" weight="semibold" color="tertiary" className="uppercase tracking-widest">
              Badges
            </Text>
            <div className="bg-white rounded-[32px] p-10 shadow-sm flex flex-wrap gap-6 items-center">
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
