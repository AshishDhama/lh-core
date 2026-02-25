import { createFileRoute, Link } from '@tanstack/react-router';
import { ConfigProvider } from 'antd';
import { Activity, BookOpen, TrendingUp, Users } from 'lucide-react';

import { Badge, Button, StatCard, StatusBadge, Text, Title } from '@/forge';
import { editorialTokens } from '@/forge/tokens/modes/editorial';
import { resolveModeTokens } from '@/forge/tokens/modes/utils';
import { cn } from '@/forge/utils';

export const Route = createFileRoute('/modes/editorial')({
  component: EditorialModePage,
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

function EditorialModePage() {
  const antTheme = resolveModeTokens(editorialTokens);

  return (
    <ConfigProvider theme={antTheme}>
      <div className="min-h-screen bg-white">
        {/* Mode nav */}
        <nav className="sticky top-0 z-10 bg-white border-b-2 border-slate-900 px-6 py-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
            Design Mode
          </span>
          {MODES.map((mode) => (
            <Link key={mode.key} to={mode.to}>
              <span
                className={cn(
                  'px-3 py-1 text-sm font-semibold transition-colors cursor-pointer uppercase tracking-wide',
                  mode.key === 'editorial'
                    ? 'bg-[#0f172a] text-white'
                    : 'text-slate-600 hover:text-slate-900',
                )}
              >
                {mode.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="max-w-5xl mx-auto px-8 py-16 space-y-20">
          {/* Header */}
          <section className="border-b-4 border-slate-900 pb-8 space-y-4">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Sharp · Typographic · High Contrast
            </div>
            <Title level={1} weight="bold" color="primary" className="!text-5xl leading-tight">
              Editorial Mode
            </Title>
            <Text size="xl" color="secondary">
              Magazine-like design with strong typographic hierarchy and bold contrasts
            </Text>
          </section>

          {/* Typography */}
          <section className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Typography
            </div>
            <div className="border border-slate-900 p-10 space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <Title level={1}>Career Insights Platform</Title>
              </div>
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
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Buttons
            </div>
            <div className="border border-slate-900 p-10 flex flex-wrap gap-4 items-center">
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
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Stat Cards
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-slate-900">
              <StatCard
                title="Active Programs"
                value={4}
                change={8}
                icon={<BookOpen size={18} />}
                iconColor="#0f172a"
                className="rounded-none border-r border-b border-slate-200"
              />
              <StatCard
                title="Completion Rate"
                value="78%"
                change={12}
                icon={<TrendingUp size={18} />}
                iconColor="#0f172a"
                className="rounded-none border-r border-b border-slate-200"
              />
              <StatCard
                title="Team Members"
                value={24}
                icon={<Users size={18} />}
                iconColor="#0f172a"
                className="rounded-none border-r border-b border-slate-200"
              />
              <StatCard
                title="Sessions Logged"
                value={156}
                change={-3}
                icon={<Activity size={18} />}
                iconColor="#0f172a"
                className="rounded-none border-b border-slate-200"
              />
            </div>
          </section>

          {/* Badges */}
          <section className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Badges
            </div>
            <div className="border border-slate-900 p-10 flex flex-wrap gap-6 items-center">
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
