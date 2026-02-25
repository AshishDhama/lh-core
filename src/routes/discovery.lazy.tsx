import { createLazyFileRoute } from '@tanstack/react-router';
import { Divider } from 'antd';
import { BookOpen, Briefcase, Star, User } from 'lucide-react';

import {
  Button,
  Label,
  Paragraph,
  Text,
  Title,
} from '@/forge/primitives';
import {
  ChatMessage,
  CommentThread,
  ReportCard,
  SearchBar,
  SkillCard,
} from '@/forge/composites';

export const Route = createLazyFileRoute('/discovery')({
  component: DiscoveryPage,
});

// ─── Section wrapper ────────────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <Title level={3} className="!mb-1">
        {title}
      </Title>
      {description && (
        <Paragraph color="secondary" className="!mb-6">
          {description}
        </Paragraph>
      )}
      {children}
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <Text size="sm" color="tertiary" weight="semibold" className="mb-3 block uppercase tracking-widest">
        {title}
      </Text>
      {children}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────

function DiscoveryPage() {
  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* Header */}
        <div className="mb-12">
          <Title level={1}>Forge Discovery</Title>
          <Paragraph color="secondary" size="lg">
            Living catalog of all Forge primitives and composites. Dev-only visual QA page.
          </Paragraph>
        </div>

        <Divider />

        {/* ── PRIMITIVES ── */}

        <Section title="Primitives" description="Atoms — smallest UI building blocks.">

          <Subsection title="Button">
            <div className="flex flex-wrap gap-3 mb-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button icon={<Star size={14} />}>With Icon</Button>
              <Button fullWidth variant="secondary">Full Width</Button>
            </div>
          </Subsection>

          <Subsection title="Typography — Title">
            <Title level={1}>Heading 1</Title>
            <Title level={2}>Heading 2</Title>
            <Title level={3}>Heading 3</Title>
            <Title level={4}>Heading 4</Title>
          </Subsection>

          <Subsection title="Typography — Text">
            <div className="flex flex-col gap-2">
              <Text size="xl">Extra Large (xl)</Text>
              <Text size="lg">Large (lg)</Text>
              <Text size="base">Base (base)</Text>
              <Text size="sm">Small (sm)</Text>
              <Text size="xs">Extra Small (xs)</Text>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <Text color="primary">Primary</Text>
              <Text color="secondary">Secondary</Text>
              <Text color="tertiary">Tertiary</Text>
              <Text color="success">Success</Text>
              <Text color="error">Error</Text>
              <Text color="warning">Warning</Text>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <Text weight="normal">Normal</Text>
              <Text weight="medium">Medium</Text>
              <Text weight="semibold">Semibold</Text>
              <Text weight="bold">Bold</Text>
            </div>
          </Subsection>

          <Subsection title="Typography — Label">
            <div className="flex flex-col gap-2">
              <Label>Default label</Label>
              <Label required>Required field</Label>
              <Label color="secondary">Secondary color label</Label>
            </div>
          </Subsection>

        </Section>

        <Divider />

        {/* ── COMPOSITES ── */}

        <Section title="Composites" description="Molecules — combinations of primitives.">

          <Subsection title="SearchBar">
            <div className="flex flex-col gap-4 max-w-md">
              <SearchBar placeholder="Search programs..." />
              <SearchBar
                placeholder="Search with filters..."
                filters={[
                  { label: 'Active', value: 'active' },
                  { label: 'Draft', value: 'draft' },
                  { label: 'Completed', value: 'completed' },
                ]}
                activeFilters={['active']}
              />
              <SearchBar placeholder="Loading state..." loading />
            </div>
          </Subsection>

          <Subsection title="ChatMessage">
            <div className="max-w-sm flex flex-col gap-3">
              <ChatMessage
                content="Hello! How can I help you today with your development plan?"
                sender={{ name: 'AI Assistant' }}
                timestamp={new Date(Date.now() - 5 * 60000)}
              />
              <ChatMessage
                content="I would like to improve my leadership skills."
                sender={{ name: 'You' }}
                timestamp={new Date(Date.now() - 4 * 60000)}
                isOwn
              />
              <ChatMessage
                content="You joined the conversation"
                sender={{ name: 'System' }}
                timestamp={new Date()}
                type="system"
              />
              <ChatMessage
                content="AI Assistant is typing..."
                sender={{ name: 'System' }}
                timestamp={new Date()}
                type="action"
              />
            </div>
          </Subsection>

          <Subsection title="SkillCard">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SkillCard
                name="Leadership"
                level={2}
                category="Management"
                icon={<User size={16} style={{ color: '#3575BC' }} />}
                targetLevel={4}
              />
              <SkillCard
                name="Strategic Thinking"
                level="advanced"
                category="Executive"
                icon={<Briefcase size={16} style={{ color: '#008575' }} />}
              />
              <SkillCard
                name="Communication"
                level={5}
                category="Soft Skills"
                icon={<BookOpen size={16} style={{ color: '#7B61FF' }} />}
                progress={100}
              />
            </div>
          </Subsection>

          <Subsection title="ReportCard">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ReportCard
                title="Q4 Performance Report"
                period="Oct – Dec 2025"
                status="published"
                generatedAt={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
                metrics={[
                  { label: 'Completion Rate', value: '87%', change: 12, changeLabel: '+12%' },
                  { label: 'Avg Score', value: '4.2 / 5', change: 5 },
                  { label: 'Exercises Done', value: 34, change: -3, changeLabel: '-3' },
                ]}
                onView={() => {}}
                onDownload={() => {}}
              />
              <ReportCard
                title="Leadership 360 Assessment"
                period="Feb 2026"
                status="draft"
                metrics={[
                  { label: 'Respondents', value: 8 },
                  { label: 'Categories', value: 5 },
                ]}
                onView={() => {}}
              />
            </div>
          </Subsection>

          <Subsection title="CommentThread">
            <div className="max-w-lg">
              <CommentThread
                comments={[
                  {
                    id: '1',
                    author: 'Priya Sharma',
                    content: 'Great progress on the leadership module! Keep it up.',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    replies: [
                      {
                        id: '1a',
                        author: 'Rohan Mehta',
                        content: 'Thanks Priya! Working on the next milestone now.',
                        timestamp: new Date(Date.now() - 90 * 60 * 1000),
                      },
                    ],
                  },
                  {
                    id: '2',
                    author: 'Manager',
                    content: 'Please complete the self-assessment by end of week.',
                    timestamp: new Date(Date.now() - 30 * 60 * 1000),
                  },
                ]}
                onReply={(id, content) => console.info('Reply to', id, ':', content)}
              />
            </div>
          </Subsection>

        </Section>

      </div>
    </div>
  );
}
