import { useEffect, useRef, useState } from 'react';
import { Progress, Steps } from 'antd';
import {
  BookOpen,
  Brain,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Loader2,
  MessageSquare,
  Target,
  Users,
  X,
} from 'lucide-react';

import { Button } from '@/forge/primitives/Button';
import { Input } from '@/forge/primitives/Input';
import { Text, Title } from '@/forge/primitives/Typography';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';

export interface IdpWizardProps {
  onClose: () => void;
  className?: string;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Competency {
  name: string;
  current: number;
  target: number;
  color: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface WizardGoal {
  id: string;
  title: string;
  skills: string[];
  milestones: string[];
}

// ─── Static data ─────────────────────────────────────────────────────────────

const COMPETENCIES: Competency[] = [
  { name: 'Leadership', current: 3, target: 5, color: colors.navy.DEFAULT },
  { name: 'Communication', current: 4, target: 5, color: colors.teal.DEFAULT },
  { name: 'Strategy', current: 2, target: 4, color: colors.purple.DEFAULT },
  { name: 'Innovation', current: 3, target: 4, color: colors.success.DEFAULT },
  { name: 'Execution', current: 4, target: 5, color: colors.warning.DEFAULT },
];

const SUGGESTIONS = [
  'What are my long-term career goals?',
  'What are my key strengths?',
  'Where do I most want to grow?',
  'What skills do I need for my next role?',
];

const AI_RESPONSES: Record<string, string> = {
  default:
    "That's a great point. Based on your competency data, I'd recommend focusing on strategic leadership skills while leveraging your strong execution abilities. Shall we explore specific development activities?",
  'What are my long-term career goals?':
    'Thinking about long-term goals is essential for effective planning. Based on your profile, you seem positioned for a senior leadership role. What timeframe are you envisioning — 2 years or 5 years?',
  'What are my key strengths?':
    "Your assessment shows strong scores in Communication (4/5) and Execution (4/5). These are real differentiators. Let's build on those while closing the gaps in Strategy and Leadership.",
  'Where do I most want to grow?':
    'Your Strategy score (2/5) has the biggest gap to your target (4/5). Developing strategic thinking will unlock more senior opportunities. Would you like specific resources for this?',
  'What skills do I need for my next role?':
    'For your target senior role, you will likely need: advanced stakeholder management, executive communication, systems thinking, and team scaling experience. Want me to prioritize these in your plan?',
};

const LOADING_MESSAGES = [
  'Analyzing your responses…',
  'Identifying development opportunities…',
  'Building your personalized plan…',
  'Almost ready…',
];

const GENERATED_GOALS: WizardGoal[] = [
  {
    id: 'g1',
    title: 'Develop Strategic Leadership',
    skills: ['Systems Thinking', 'Executive Presence', 'Stakeholder Management'],
    milestones: [
      'Complete a leadership assessment by end of Q1',
      'Shadow a senior leader for 1 month',
      'Lead a cross-functional initiative by Q3',
    ],
  },
  {
    id: 'g2',
    title: 'Build Innovation Capability',
    skills: ['Design Thinking', 'Agile Methods', 'Data-Driven Decision Making'],
    milestones: [
      'Complete a Design Thinking workshop',
      'Run an internal hackathon or ideation session',
      'Implement one process improvement initiative',
    ],
  },
  {
    id: 'g3',
    title: 'Strengthen Strategic Thinking',
    skills: ['Business Acumen', 'Competitive Analysis', 'Scenario Planning'],
    milestones: [
      'Read 2 books on business strategy',
      'Present a strategic analysis to leadership team',
      'Develop a 3-year vision document for your function',
    ],
  },
  {
    id: 'g4',
    title: 'Expand Team Leadership',
    skills: ['Coaching', 'Talent Development', 'Inclusive Leadership'],
    milestones: [
      'Complete a coaching certification program',
      'Establish monthly 1:1s with each direct report',
      'Develop a succession plan for your team',
    ],
  },
];

const STEP_TITLES = [
  'Introduction',
  'Skill Gap Assessment',
  'Guided Conversation',
  'Summary',
  'Generating Plan',
  'Your Development Plan',
];

// ─── Step components ──────────────────────────────────────────────────────────

function StepIntroduction({ onNext }: { onNext: () => void }) {
  const learningModels = [
    {
      icon: <Briefcase size={24} />,
      pct: '70%',
      label: 'Experiential',
      desc: 'On-the-job challenges, stretch assignments, and real-world problem solving.',
      color: colors.navy.DEFAULT,
      bg: 'bg-navy-50 dark:bg-navy-900/20',
    },
    {
      icon: <Users size={24} />,
      pct: '20%',
      label: 'Social',
      desc: 'Mentoring, coaching, peer learning, and collaborative projects.',
      color: colors.teal.DEFAULT,
      bg: 'bg-teal-50 dark:bg-teal-900/20',
    },
    {
      icon: <GraduationCap size={24} />,
      pct: '10%',
      label: 'Formal',
      desc: 'Courses, certifications, workshops, and structured programs.',
      color: colors.purple.DEFAULT,
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="flex flex-col items-center gap-8 max-w-2xl mx-auto text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-navy-50 dark:bg-navy-900/20">
        <Target size={40} style={{ color: colors.navy.DEFAULT }} />
      </div>

      <div className="space-y-3">
        <Title level={2} weight="bold" color="primary">
          Welcome to Your IDP Journey
        </Title>
        <Text size="base" color="secondary" className="leading-relaxed">
          An Individual Development Plan (IDP) is a personalised roadmap to help you grow your skills,
          reach your career goals, and perform at your best. This wizard will guide you through creating
          a tailored plan based on the 70-20-10 learning model.
        </Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {learningModels.map((model) => (
          <div
            key={model.pct}
            className="rounded-2xl border border-border bg-surface-primary p-5 flex flex-col items-center gap-3 text-center"
          >
            <div className={cn('flex items-center justify-center w-12 h-12 rounded-xl', model.bg)}>
              <span style={{ color: model.color }}>{model.icon}</span>
            </div>
            <div>
              <Text size="xl" weight="bold" color="primary">
                {model.pct}
              </Text>
              <Text size="sm" weight="semibold" color="primary">
                {model.label}
              </Text>
            </div>
            <Text size="xs" color="secondary" className="leading-relaxed">
              {model.desc}
            </Text>
          </div>
        ))}
      </div>

      <Button variant="primary" size="lg" onClick={onNext}>
        Get Started
        <ChevronRight size={16} className="ml-1" />
      </Button>
    </div>
  );
}

function CompetencyBar({ competency }: { competency: Competency }) {
  const maxLevel = 5;
  const currentPct = (competency.current / maxLevel) * 100;
  const targetPct = (competency.target / maxLevel) * 100;
  const gap = competency.target - competency.current;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Text size="sm" weight="semibold" color="primary">
          {competency.name}
        </Text>
        <div className="flex items-center gap-3">
          <Text size="xs" color="tertiary">
            Current: <span className="font-semibold">{competency.current}/5</span>
          </Text>
          <Text size="xs" color="tertiary">
            Target: <span className="font-semibold">{competency.target}/5</span>
          </Text>
          {gap > 0 && (
            <span
              className="px-1.5 py-0.5 rounded text-xs font-semibold"
              style={{ backgroundColor: `${competency.color}18`, color: competency.color }}
            >
              +{gap} gap
            </span>
          )}
        </div>
      </div>
      {/* Current level bar */}
      <div className="relative h-3 rounded-full bg-surface-tertiary overflow-hidden">
        {/* Target marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 z-10"
          style={{
            left: `${targetPct}%`,
            backgroundColor: competency.color,
            opacity: 0.4,
          }}
        />
        {/* Current fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{ width: `${currentPct}%`, backgroundColor: competency.color }}
        />
      </div>
      <div className="flex items-center gap-3 text-xs" style={{ color: colors.content.tertiary }}>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: competency.color }}
          />
          Current level
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm opacity-40"
            style={{ backgroundColor: competency.color }}
          />
          Target level
        </span>
      </div>
    </div>
  );
}

function StepSkillGap({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy-50 dark:bg-navy-900/20 mx-auto mb-4">
          <Brain size={28} style={{ color: colors.navy.DEFAULT }} />
        </div>
        <Title level={3} weight="bold" color="primary">
          Competency Assessment
        </Title>
        <Text size="sm" color="secondary" className="mt-1">
          Review your current skill levels and targets identified from your latest assessment.
        </Text>
      </div>

      <div className="rounded-2xl border border-border bg-surface-primary p-6 space-y-6">
        {COMPETENCIES.map((comp) => (
          <CompetencyBar key={comp.name} competency={comp} />
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="secondary" onClick={onBack}>
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Button>
        <Button variant="primary" onClick={onNext}>
          Continue
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
}

function StepChat({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      text: "Hi! I'm your IDP Coach. Based on your assessment, I can see you have real strengths to build on and clear growth areas. Let's have a conversation to better understand your goals. You can choose one of the suggested questions or type your own.",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasSentMessage = messages.some((m) => m.role === 'user');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = AI_RESPONSES[text] ?? AI_RESPONSES['default'];
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: response,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  }

  function handleSend() {
    const text = inputValue.trim();
    if (!text) return;
    sendMessage(text);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
      <div className="text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-900/20 mx-auto mb-4">
          <MessageSquare size={28} style={{ color: colors.teal.DEFAULT }} />
        </div>
        <Title level={3} weight="bold" color="primary">
          Guided Conversation
        </Title>
        <Text size="sm" color="secondary" className="mt-1">
          Chat with your AI coach to explore your career goals and development priorities.
        </Text>
      </div>

      {/* Chat area */}
      <div className="rounded-2xl border border-border bg-surface-primary overflow-hidden flex flex-col h-80">
        {/* Message list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-2',
                msg.role === 'user' ? 'justify-end' : 'justify-start',
              )}
            >
              {msg.role === 'assistant' && (
                <div
                  className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full"
                  style={{ backgroundColor: `${colors.navy.DEFAULT}18` }}
                >
                  <Brain size={14} style={{ color: colors.navy.DEFAULT }} />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2.5',
                  msg.role === 'user'
                    ? 'bg-navy text-white rounded-tr-sm'
                    : 'bg-surface-secondary text-content-primary rounded-tl-sm',
                )}
              >
                <Text size="sm" className={msg.role === 'user' ? 'text-white' : ''}>
                  {msg.text}
                </Text>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 px-3 py-2">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full"
                style={{ backgroundColor: `${colors.navy.DEFAULT}18` }}
              >
                <Brain size={14} style={{ color: colors.navy.DEFAULT }} />
              </div>
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{
                      backgroundColor: colors.content.tertiary,
                      animationDelay: `${i * 150}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        {!hasSentMessage && (
          <div className="flex flex-wrap gap-2 px-4 py-2 border-t border-surface-tertiary">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                className="px-3 py-1 rounded-full border border-border text-xs font-medium hover:bg-surface-secondary transition-colors"
                style={{ color: colors.content.secondary }}
                onClick={() => sendMessage(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-border flex-shrink-0">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message…"
            className="flex-1"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
          >
            Send
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={onBack}>
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Button>
        <div className="flex flex-col items-end gap-1">
          {!hasSentMessage && (
            <Text size="xs" color="tertiary">
              Send at least one message to continue
            </Text>
          )}
          <Button variant="primary" onClick={onNext} disabled={!hasSentMessage}>
            Continue to Summary
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function StepSummary({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const focusAreas = COMPETENCIES.filter((c) => c.target > c.current).sort(
    (a, b) => b.target - b.current - (a.target - a.current),
  );

  const recommendedSkills = [
    'Strategic Leadership',
    'Stakeholder Management',
    'Systems Thinking',
    'Executive Communication',
    'Design Thinking',
    'Data-Driven Decision Making',
  ];

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/20 mx-auto mb-4">
          <BookOpen size={28} style={{ color: colors.purple.DEFAULT }} />
        </div>
        <Title level={3} weight="bold" color="primary">
          Development Summary
        </Title>
        <Text size="sm" color="secondary" className="mt-1">
          Here's what we've identified for your development plan.
        </Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Focus areas */}
        <div className="rounded-2xl border border-border bg-surface-primary p-5 space-y-3">
          <Text size="sm" weight="semibold" color="tertiary" className="uppercase tracking-wide">
            Priority Focus Areas
          </Text>
          <div className="space-y-2">
            {focusAreas.map((comp) => (
              <div key={comp.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: comp.color }}
                  />
                  <Text size="sm" color="primary">
                    {comp.name}
                  </Text>
                </div>
                <Text size="xs" color="tertiary">
                  Gap: +{comp.target - comp.current}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended skills */}
        <div className="rounded-2xl border border-border bg-surface-primary p-5 space-y-3">
          <Text size="sm" weight="semibold" color="tertiary" className="uppercase tracking-wide">
            Recommended Skills
          </Text>
          <div className="flex flex-wrap gap-2">
            {recommendedSkills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${colors.navy.DEFAULT}12`,
                  color: colors.navy.DEFAULT,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-navy-50 dark:bg-navy-900/20 p-5">
        <Text size="sm" color="secondary" className="leading-relaxed">
          Based on your assessment and our conversation, we will generate a personalised development
          plan with 4 goals, each containing specific skills to develop and milestones to achieve.
          Your plan follows the 70-20-10 model to ensure balanced, effective learning.
        </Text>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={onBack}>
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Button>
        <Button variant="primary" size="lg" onClick={onNext}>
          Generate Plan
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
}

function StepLoading() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 750);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 3, 100));
    }, 90);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 max-w-md mx-auto text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-navy-50 dark:bg-navy-900/20">
        <Loader2 size={48} style={{ color: colors.navy.DEFAULT }} className="animate-spin" />
      </div>

      <div className="space-y-2 w-full">
        <Title level={3} weight="bold" color="primary">
          Building Your Plan
        </Title>
        <Text size="sm" color="secondary">
          {LOADING_MESSAGES[msgIndex]}
        </Text>
      </div>

      <div className="w-full space-y-2">
        <Progress percent={progress} showInfo={false} strokeColor={colors.navy.DEFAULT} />
        <Text size="xs" color="tertiary">
          {progress}% complete
        </Text>
      </div>
    </div>
  );
}

function StepPlan({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-success/10 mx-auto mb-4">
          <CheckCircle2 size={28} style={{ color: colors.success.DEFAULT }} />
        </div>
        <Title level={3} weight="bold" color="primary">
          Your Development Plan
        </Title>
        <Text size="sm" color="secondary" className="mt-1">
          Here is your personalised IDP with 4 goals tailored to your growth areas.
        </Text>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {GENERATED_GOALS.map((goal, index) => (
          <div
            key={goal.id}
            className="rounded-2xl border border-border bg-surface-primary p-5 space-y-4"
          >
            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: colors.navy.DEFAULT }}
              >
                {index + 1}
              </div>
              <Title level={4} weight="semibold" color="primary" className="!mb-0 pt-0.5">
                {goal.title}
              </Title>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Text size="xs" weight="semibold" color="tertiary" className="uppercase tracking-wide">
                Key Skills
              </Text>
              <div className="flex flex-wrap gap-2">
                {goal.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${colors.teal.DEFAULT}12`,
                      color: colors.teal.DEFAULT,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-2">
              <Text size="xs" weight="semibold" color="tertiary" className="uppercase tracking-wide">
                Milestones
              </Text>
              <ul className="space-y-1.5">
                {goal.milestones.map((milestone) => (
                  <li key={milestone} className="flex items-start gap-2">
                    <div
                      className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                      style={{ backgroundColor: colors.content.tertiary }}
                    />
                    <Text size="sm" color="secondary">
                      {milestone}
                    </Text>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <Button variant="primary" size="lg" onClick={onClose}>
          <CheckCircle2 size={16} className="mr-1.5" />
          Save &amp; Close
        </Button>
      </div>
    </div>
  );
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

export function IdpWizard({ onClose, className }: IdpWizardProps) {
  const [step, setStep] = useState(0);

  function goNext() {
    setStep((s) => s + 1);
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  // Auto-advance from loading step
  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => setStep(5), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const stepItems = STEP_TITLES.map((title) => ({ title }));

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900',
        className,
      )}
      role="dialog"
      aria-modal="true"
      aria-label="IDP Wizard"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <Target size={22} style={{ color: colors.navy.DEFAULT }} />
          <Title level={4} weight="semibold" color="primary" className="!mb-0">
            Individual Development Plan
          </Title>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-secondary transition-colors"
          aria-label="Close wizard"
        >
          <X size={20} style={{ color: colors.content.secondary }} />
        </button>
      </div>

      {/* Progress steps */}
      <div className="px-6 py-4 border-b border-border flex-shrink-0 overflow-x-auto">
        <Steps
          current={step}
          items={stepItems}
          size="small"
          responsive={false}
        />
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {step === 0 && <StepIntroduction onNext={goNext} />}
        {step === 1 && <StepSkillGap onNext={goNext} onBack={goBack} />}
        {step === 2 && <StepChat onNext={goNext} onBack={goBack} />}
        {step === 3 && <StepSummary onNext={goNext} onBack={goBack} />}
        {step === 4 && <StepLoading />}
        {step === 5 && <StepPlan onClose={onClose} />}
      </div>
    </div>
  );
}
