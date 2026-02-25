import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Download,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from 'lucide-react';

import { Button } from '@/forge/primitives/Button';
import { Text, Title } from '@/forge/primitives/Typography';
import { ChatAssistant } from '@/forge/patterns/ChatAssistant';
import type { ChatAssistantMessage } from '@/forge/patterns/ChatAssistant';
import { PlanEditor } from '@/forge/patterns/PlanEditor';
import type { Goal } from '@/forge/patterns/PlanEditor';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Types & constants
// ─────────────────────────────────────────────────────────────────────────────

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

const TOTAL_STEPS = 6;

const STEP_LABELS: Record<WizardStep, string> = {
  1: 'Introduction',
  2: 'Skill Gap',
  3: 'AI Chat',
  4: 'Summary',
  5: 'Generating',
  6: 'Your Plan',
};

interface Competency {
  name: string;
  current: 1 | 2 | 3 | 4 | 5;
  target: 1 | 2 | 3 | 4 | 5;
  barColor: string;
}

const COMPETENCIES: Competency[] = [
  { name: 'Leadership', current: 3, target: 5, barColor: colors.navy.DEFAULT },
  { name: 'Communication', current: 4, target: 5, barColor: colors.teal.DEFAULT },
  { name: 'Strategy', current: 2, target: 4, barColor: colors.purple.DEFAULT },
  { name: 'Innovation', current: 3, target: 4, barColor: colors.warning.DEFAULT },
  { name: 'Execution', current: 4, target: 5, barColor: colors.success.DEFAULT },
];

const AI_SENDER = { name: 'IDP Coach' };
const USER_SENDER = { name: 'You' };

const CHAT_SUGGESTIONS = [
  'I want to move into a Director role',
  'My biggest strength is stakeholder management',
  'I struggle with strategic thinking',
  'I want to improve my executive presence',
  'I need help with cross-functional leadership',
];

const INITIAL_CHAT_MESSAGES: ChatAssistantMessage[] = [
  {
    id: 'init-1',
    content:
      "Welcome! I'm your IDP Coach. I'll help you build a personalised development plan. Let's start — what leadership role do you see yourself in 2–3 years from now?",
    sender: AI_SENDER,
    timestamp: new Date(),
    isOwn: false,
  },
];

const AI_FOLLOW_UPS = [
  "That's a great goal! What do you feel are your biggest strengths right now?",
  'Thank you for sharing. What area do you find most challenging in your current role?',
  'Great insight. How do you prefer to learn — through courses, mentoring, or on-the-job projects?',
  "Noted! Is there a specific project where you'd like to demonstrate these skills?",
  'Good to know. What feedback have you received from your manager recently?',
  "Based on what you've shared, I can already identify some excellent focus areas for your plan.",
];

const LOADING_MESSAGES = [
  'Analysing your responses…',
  'Identifying skill gaps…',
  'Building your development plan…',
  'Adding personalised milestones…',
  'Almost ready…',
];

const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Develop Strategic Leadership',
    skills: [
      { name: 'Executive Presence', level: 'beginner' },
      { name: 'Vision Setting', level: 'intermediate' },
    ],
    milestones: [
      { id: 'm1', title: 'Complete leadership assessment', completed: true },
      { id: 'm2', title: 'Shadow a VP for 2 weeks', completed: false },
      { id: 'm3', title: 'Lead a cross-functional project', completed: false },
    ],
    progress: 33,
    status: 'in_progress',
  },
  {
    id: 'goal-2',
    title: 'Enhance Innovation & Problem Solving',
    skills: [
      { name: 'Design Thinking', level: 'intermediate' },
      { name: 'Creative Problem Solving', level: 'beginner' },
    ],
    milestones: [
      { id: 'm4', title: 'Complete design thinking workshop', completed: false },
      { id: 'm5', title: 'Run an internal innovation sprint', completed: false },
    ],
    progress: 0,
    status: 'not_started',
  },
  {
    id: 'goal-3',
    title: 'Master Communication & Influence',
    skills: [
      { name: 'Executive Communication', level: 'intermediate' },
      { name: 'Stakeholder Management', level: 'advanced' },
    ],
    milestones: [
      { id: 'm6', title: 'Deliver quarterly business review', completed: false },
      { id: 'm7', title: 'Present to senior leadership', completed: false },
    ],
    progress: 0,
    status: 'not_started',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Step sub-components
// ─────────────────────────────────────────────────────────────────────────────

function StepIntroduction({ onNext }: { onNext: () => void }) {
  const pillars = [
    {
      icon: <Zap size={20} style={{ color: colors.navy.DEFAULT }} />,
      pct: '70%',
      label: 'Experience',
      description: 'On-the-job stretch assignments, real projects, and new responsibilities.',
      bgColor: colors.navy[50],
    },
    {
      icon: <Users size={20} style={{ color: colors.teal.DEFAULT }} />,
      pct: '20%',
      label: 'Social',
      description: 'Coaching, mentoring, peer learning, and leadership feedback.',
      bgColor: colors.teal[50],
    },
    {
      icon: <BookOpen size={20} style={{ color: colors.purple.DEFAULT }} />,
      pct: '10%',
      label: 'Formal',
      description: 'Courses, certifications, workshops, and structured programmes.',
      bgColor: `${colors.purple.DEFAULT}18`,
    },
  ];

  return (
    <div className="flex flex-col items-center gap-8 max-w-2xl mx-auto text-center">
      <div className="flex flex-col items-center gap-3">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${colors.navy.DEFAULT}18` }}
        >
          <Brain size={32} style={{ color: colors.navy.DEFAULT }} />
        </div>
        <Title level={2} weight="bold" color="primary">
          Build Your Development Plan
        </Title>
        <Text size="base" color="secondary" className="max-w-md leading-relaxed">
          Your Individual Development Plan (IDP) is a personalised roadmap for your career growth.
          We'll guide you through a simple 6-step process.
        </Text>
      </div>

      <div className="w-full">
        <Text
          size="xs"
          weight="semibold"
          color="tertiary"
          className="uppercase tracking-wide mb-4 block"
        >
          The 70-20-10 Learning Model
        </Text>
        <div className="grid grid-cols-3 gap-4">
          {pillars.map((p) => (
            <div
              key={p.label}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface-primary p-5"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: p.bgColor }}
              >
                {p.icon}
              </div>
              <div>
                <Text size="xl" weight="bold" color="primary">
                  {p.pct}
                </Text>
                <Text size="sm" weight="semibold" color="primary" className="block">
                  {p.label}
                </Text>
              </div>
              <Text size="xs" color="secondary" className="leading-relaxed">
                {p.description}
              </Text>
            </div>
          ))}
        </div>
      </div>

      <Button variant="primary" size="lg" onClick={onNext}>
        Get Started
      </Button>
    </div>
  );
}

function StepSkillGap({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="text-center">
        <Title level={2} weight="bold" color="primary">
          Skill Gap Assessment
        </Title>
        <Text size="base" color="secondary" className="mt-1">
          Here's how your current levels compare to your target profile.
        </Text>
      </div>

      <div className="flex flex-col gap-3">
        {COMPETENCIES.map((comp) => {
          const gap = comp.target - comp.current;
          const currentPct = (comp.current / 5) * 100;
          const targetPct = (comp.target / 5) * 100;
          return (
            <div
              key={comp.name}
              className="rounded-2xl border border-border bg-surface-primary p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Text size="sm" weight="semibold" color="primary">
                  {comp.name}
                </Text>
                {gap > 0 ? (
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: `${colors.warning.DEFAULT}18`,
                      color: colors.warning.dark,
                    }}
                  >
                    Gap: {gap}
                  </span>
                ) : (
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: `${colors.success.DEFAULT}18`,
                      color: colors.success.dark,
                    }}
                  >
                    On target
                  </span>
                )}
              </div>

              {/* Current level bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Text size="xs" color="tertiary">
                    Current
                  </Text>
                  <Text size="xs" weight="semibold" color="primary">
                    {comp.current}/5
                  </Text>
                </div>
                <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${currentPct}%`, backgroundColor: comp.barColor }}
                  />
                </div>
              </div>

              {/* Target level bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Text size="xs" color="tertiary">
                    Target
                  </Text>
                  <Text size="xs" weight="semibold" color="primary">
                    {comp.target}/5
                  </Text>
                </div>
                <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 opacity-40"
                    style={{ width: `${targetPct}%`, backgroundColor: comp.barColor }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="secondary" icon={<Download size={16} />}>
          Download Report
        </Button>
        <Button variant="primary" onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}

function StepChat({
  messages,
  isTyping,
  onSend,
  onNext,
}: {
  messages: ChatAssistantMessage[];
  isTyping: boolean;
  onSend: (text: string) => void;
  onNext: () => void;
}) {
  const canContinue = messages.filter((m) => m.isOwn).length >= 1;

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      <div className="text-center">
        <Title level={2} weight="bold" color="primary">
          Career Conversation
        </Title>
        <Text size="base" color="secondary" className="mt-1">
          Chat with your AI Coach to help shape your development plan.
        </Text>
      </div>

      <div style={{ height: '420px' }}>
        <ChatAssistant
          messages={messages}
          onSend={onSend}
          title="IDP Coach"
          placeholder="Share your career goals and aspirations…"
          suggestions={CHAT_SUGGESTIONS}
          isTyping={isTyping}
          className="h-full"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button variant="primary" disabled={!canContinue} onClick={onNext}>
          Continue to Summary
        </Button>
      </div>
    </div>
  );
}

function StepSummary({ onNext }: { onNext: () => void }) {
  const focusAreas = COMPETENCIES.filter((c) => c.target > c.current).map((c) => c.name);
  const recommendations = [
    { skill: 'Systems Leadership', why: 'Addresses your Leadership gap (3 → 5)' },
    { skill: 'Strategic Communication', why: 'Bridges Communication to expert level' },
    { skill: 'Business Acumen', why: 'Closes your Strategy gap (2 → 4)' },
    { skill: 'Creative Problem Solving', why: 'Develops your Innovation competency' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="text-center">
        <Title level={2} weight="bold" color="primary">
          Your Development Summary
        </Title>
        <Text size="base" color="secondary" className="mt-1">
          Based on your assessment and conversation, here's what we've identified.
        </Text>
      </div>

      {/* Focus Areas */}
      <div className="rounded-2xl border border-border bg-surface-primary p-5 space-y-4">
        <Text size="xs" weight="semibold" color="tertiary" className="uppercase tracking-wide block">
          Focus Areas
        </Text>
        <div className="flex flex-wrap gap-2">
          {focusAreas.map((area) => (
            <span
              key={area}
              className="rounded-full px-3 py-1 text-sm font-medium border border-border"
              style={{
                backgroundColor: `${colors.navy.DEFAULT}08`,
                color: colors.navy.DEFAULT,
              }}
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended Skills */}
      <div className="rounded-2xl border border-border bg-surface-primary p-5 space-y-4">
        <Text size="xs" weight="semibold" color="tertiary" className="uppercase tracking-wide block">
          Recommended Skills
        </Text>
        <div className="flex flex-col gap-3">
          {recommendations.map((r) => (
            <div key={r.skill} className="flex items-start gap-3">
              <CheckCircle2
                size={16}
                style={{ color: colors.success.DEFAULT, marginTop: 2, flexShrink: 0 }}
                aria-hidden="true"
              />
              <div>
                <Text size="sm" weight="semibold" color="primary">
                  {r.skill}
                </Text>
                <Text size="xs" color="tertiary" className="block">
                  {r.why}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" icon={<Sparkles size={16} />} onClick={onNext}>
          Generate Plan
        </Button>
      </div>
    </div>
  );
}

function StepLoading({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const totalMs = 3000;
    const tickMs = 80;
    const totalTicks = totalMs / tickMs;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += 1;
      const pct = Math.min(Math.round((elapsed / totalTicks) * 100), 100);
      setProgress(pct);
      setMessageIndex(
        Math.min(
          Math.floor((elapsed / totalTicks) * LOADING_MESSAGES.length),
          LOADING_MESSAGES.length - 1,
        ),
      );
      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          onDoneRef.current();
        }, 400);
      }
    }, tickMs);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8 max-w-md mx-auto text-center min-h-[400px]">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${colors.navy.DEFAULT}18` }}
      >
        <Sparkles size={36} style={{ color: colors.navy.DEFAULT }} className="animate-pulse" />
      </div>

      <div className="space-y-2">
        <Title level={3} weight="bold" color="primary">
          Building Your Plan
        </Title>
        <Text size="base" color="secondary">
          {LOADING_MESSAGES[messageIndex]}
        </Text>
      </div>

      <div className="w-full space-y-2">
        <div className="h-2.5 rounded-full bg-surface-tertiary overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${progress}%`, backgroundColor: colors.navy.DEFAULT }}
          />
        </div>
        <Text size="sm" color="tertiary">
          {progress}%
        </Text>
      </div>
    </div>
  );
}

function StepPlan({
  goals,
  onGoalUpdate,
  onAddGoal,
  onClose,
}: {
  goals: Goal[];
  onGoalUpdate: (id: string, updates: Partial<Goal>) => void;
  onAddGoal: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
      <div className="text-center">
        <Title level={2} weight="bold" color="primary">
          Your Development Plan
        </Title>
        <Text size="base" color="secondary" className="mt-1">
          Your personalised plan is ready. Review and customise your goals below.
        </Text>
      </div>

      <div className="overflow-y-auto max-h-[480px] pb-2">
        <PlanEditor goals={goals} onGoalUpdate={onGoalUpdate} onAddGoal={onAddGoal} />
      </div>

      <div className="flex justify-end pt-2">
        <Button variant="primary" icon={<CheckCircle2 size={16} />} onClick={onClose}>
          Save &amp; Close
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Header sub-components
// ─────────────────────────────────────────────────────────────────────────────

function WizardProgressBar({ step }: { step: WizardStep }) {
  const progressPct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;
  return (
    <div className="hidden sm:flex items-center gap-3 flex-1 max-w-sm mx-6">
      <div className="flex-1 h-1.5 rounded-full bg-surface-tertiary overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%`, backgroundColor: colors.navy.DEFAULT }}
        />
      </div>
      <Text size="xs" color="tertiary" className="flex-shrink-0">
        {Math.round(progressPct)}%
      </Text>
    </div>
  );
}

function StepDots({ step }: { step: WizardStep }) {
  return (
    <div className="hidden md:flex items-center gap-1.5" aria-hidden="true">
      {([1, 2, 3, 4, 5, 6] as WizardStep[]).map((s) => (
        <div
          key={s}
          className="rounded-full transition-all duration-300"
          style={{
            width: s === step ? 20 : 8,
            height: 8,
            backgroundColor: s <= step ? colors.navy.DEFAULT : colors.surface.tertiary,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export interface IdpWizardProps {
  onClose: () => void;
  className?: string;
}

export function IdpWizard({ onClose, className }: IdpWizardProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [messages, setMessages] = useState<ChatAssistantMessage[]>(INITIAL_CHAT_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [aiFollowUpIndex, setAiFollowUpIndex] = useState(0);

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS) as WizardStep);
  }, []);

  function handleSend(text: string) {
    const userMsg: ChatAssistantMessage = {
      id: `user-${Date.now()}`,
      content: text,
      sender: USER_SENDER,
      timestamp: new Date(),
      isOwn: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const followUp = AI_FOLLOW_UPS[aiFollowUpIndex % AI_FOLLOW_UPS.length];
      const aiMsg: ChatAssistantMessage = {
        id: `ai-${Date.now()}`,
        content: followUp,
        sender: AI_SENDER,
        timestamp: new Date(),
        isOwn: false,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      setAiFollowUpIndex((i) => i + 1);
    }, 1500);
  }

  function handleGoalUpdate(goalId: string, updates: Partial<Goal>) {
    setGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, ...updates } : g)));
  }

  function handleAddGoal() {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: 'New Development Goal',
      skills: [],
      milestones: [],
      progress: 0,
      status: 'not_started',
    };
    setGoals((prev) => [...prev, newGoal]);
  }

  return (
    <div
      className={cn('fixed inset-0 z-50 flex flex-col bg-white overflow-hidden', className)}
      role="dialog"
      aria-modal="true"
      aria-label="Individual Development Plan Wizard"
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border flex-shrink-0">
        {/* Identity */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${colors.navy.DEFAULT}18` }}
          >
            <Target size={16} style={{ color: colors.navy.DEFAULT }} />
          </div>
          <div>
            <Text size="sm" weight="semibold" color="primary">
              Individual Development Plan
            </Text>
            <Text size="xs" color="tertiary" className="block">
              Step {step} of {TOTAL_STEPS} — {STEP_LABELS[step]}
            </Text>
          </div>
        </div>

        {/* Progress bar */}
        <WizardProgressBar step={step} />

        {/* Step dots */}
        <StepDots step={step} />

        {/* Close button */}
        <button
          type="button"
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-tertiary transition-colors flex-shrink-0"
          onClick={onClose}
          aria-label="Close wizard"
        >
          <X size={18} style={{ color: colors.content.secondary }} />
        </button>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 min-h-0">
        {step === 1 && <StepIntroduction onNext={next} />}
        {step === 2 && <StepSkillGap onNext={next} />}
        {step === 3 && (
          <StepChat messages={messages} isTyping={isTyping} onSend={handleSend} onNext={next} />
        )}
        {step === 4 && <StepSummary onNext={next} />}
        {step === 5 && <StepLoading onDone={next} />}
        {step === 6 && (
          <StepPlan
            goals={goals}
            onGoalUpdate={handleGoalUpdate}
            onAddGoal={handleAddGoal}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
