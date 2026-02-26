import { useCallback, useEffect, useRef, useState } from 'react';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { Checkbox, Steps } from 'antd';
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Monitor,
  Shield,
  ShieldCheck,
  Wifi,
} from 'lucide-react';

import { Button, Text, Title } from '@/forge';
import { FullscreenLayout } from '@/forge/layouts';
import type { SystemCheck } from '@/forge/patterns/SystemCheckPanel';
import { SystemCheckPanel } from '@/forge/patterns/SystemCheckPanel';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';

export const Route = createLazyFileRoute('/programs/$programId/precheck')({
  component: PrecheckPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────

type WizardStep = 0 | 1 | 2;

// ─── Check definitions ────────────────────────────────────────────────────────

const INITIAL_CHECKS: SystemCheck[] = [
  { name: 'Browser compatibility', status: 'pending' },
  { name: 'Network speed', status: 'pending' },
  { name: 'Camera & microphone', status: 'pending' },
  { name: 'Equipment readiness', status: 'pending' },
];

// Simulated durations (ms) per check
const CHECK_DURATIONS = [800, 1200, 1500, 900];

// Simulated outcomes — all pass in the happy path
const CHECK_OUTCOMES: Array<{ status: 'pass' | 'fail'; message?: string }> = [
  { status: 'pass', message: 'Chrome 120+ detected' },
  { status: 'pass', message: 'Good connection (45 Mbps)' },
  { status: 'pass', message: 'Access granted' },
  { status: 'pass', message: 'Ready to proceed' },
];

// ─── Guideline rules ──────────────────────────────────────────────────────────

interface GuidelineRule {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const GUIDELINE_RULES: GuidelineRule[] = [
  {
    icon: <Monitor size={20} style={{ color: colors.navy.DEFAULT }} />,
    title: 'Stay in frame',
    description:
      'Keep your face clearly visible in the camera throughout the assessment. Do not move away from view.',
  },
  {
    icon: <Shield size={20} style={{ color: colors.navy.DEFAULT }} />,
    title: 'No external aids',
    description:
      'No phone, notes, or other devices are permitted. Assessments must be completed independently.',
  },
  {
    icon: <Wifi size={20} style={{ color: colors.navy.DEFAULT }} />,
    title: 'Stable internet required',
    description:
      'Ensure you have a reliable internet connection before starting. Disconnections may invalidate your session.',
  },
  {
    icon: <ShieldCheck size={20} style={{ color: colors.navy.DEFAULT }} />,
    title: 'Quiet environment',
    description:
      'Complete the assessment in a quiet, private space free from interruptions and distractions.',
  },
];

// ─── Step 1: Guidelines ───────────────────────────────────────────────────────

interface GuidelinesStepProps {
  onContinue: () => void;
}

function GuidelinesStep({ onContinue }: GuidelinesStepProps) {
  const [consented, setConsented] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <Title level={3} className="!mb-0">
          Assessment Guidelines
        </Title>
        <Text size="sm" color="secondary">
          Please review the following rules before beginning your proctored assessment.
        </Text>
      </div>

      {/* Rules */}
      <div className="flex flex-col gap-3">
        {GUIDELINE_RULES.map((rule) => (
          <div
            key={rule.title}
            className="flex items-start gap-4 rounded-xl border border-[#e2e8f0] bg-surface-secondary p-4"
          >
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: colors.navy[50] }}
            >
              {rule.icon}
            </div>
            <div className="flex flex-col gap-0.5">
              <Text size="sm" weight="semibold" color="primary">
                {rule.title}
              </Text>
              <Text size="sm" color="secondary">
                {rule.description}
              </Text>
            </div>
          </div>
        ))}
      </div>

      {/* Consent */}
      <div className="rounded-xl border border-[#e2e8f0] bg-surface-tertiary p-4">
        <Checkbox
          checked={consented}
          onChange={(e) => setConsented(e.target.checked)}
          className="items-start"
        >
          <span className="text-sm text-content-primary leading-snug ml-1">
            I agree to the assessment guidelines and proctoring terms. I understand that my session
            will be recorded and that any violations may result in disqualification.
          </span>
        </Checkbox>
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          disabled={!consented}
          onClick={onContinue}
          icon={<ChevronRight size={16} style={{ color: colors.content.inverse }} />}
          iconPlacement="end"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

// ─── Step 2: System Check ─────────────────────────────────────────────────────

interface SystemCheckStepProps {
  onContinue: () => void;
  onBack: () => void;
}

function SystemCheckStep({ onContinue, onBack }: SystemCheckStepProps) {
  const [checks, setChecks] = useState<SystemCheck[]>(INITIAL_CHECKS);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allPassed = done && checks.every((c) => c.status === 'pass');
  const hasFailures = done && checks.some((c) => c.status === 'fail');

  const runChecks = useCallback(() => {
    setChecks(INITIAL_CHECKS);
    setRunning(true);
    setDone(false);

    let idx = 0;

    function runNext() {
      if (idx >= INITIAL_CHECKS.length) {
        setRunning(false);
        setDone(true);
        return;
      }

      const currentIdx = idx;
      idx += 1;

      setChecks((prev) =>
        prev.map((c, i) => (i === currentIdx ? { ...c, status: 'running' } : c)),
      );

      timerRef.current = setTimeout(() => {
        const outcome = CHECK_OUTCOMES[currentIdx];
        setChecks((prev) =>
          prev.map((c, i) =>
            i === currentIdx ? { ...c, status: outcome.status, message: outcome.message } : c,
          ),
        );
        runNext();
      }, CHECK_DURATIONS[currentIdx]);
    }

    runNext();
  }, []);

  // Auto-start on mount
  useEffect(() => {
    runChecks();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [runChecks]);

  return (
    <div className="flex flex-col gap-6">
      <SystemCheckPanel
        checks={checks}
        allPassed={allPassed}
        onRetry={hasFailures && !running ? runChecks : undefined}
        onContinue={allPassed && !running ? onContinue : undefined}
      />

      {/* Footer status + back link */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={onBack} icon={<ChevronLeft size={14} />}>
          Back
        </Button>
        <Text size="xs" color="tertiary">
          {running
            ? 'Please wait while we check your system\u2026'
            : allPassed
              ? 'All checks passed. You\u2019re ready to begin.'
              : hasFailures
                ? 'Some checks failed. Resolve the issues and retry.'
                : 'System check complete.'}
        </Text>
      </div>
    </div>
  );
}

// ─── Step 3: Launch ───────────────────────────────────────────────────────────

interface LaunchStepProps {
  programId: string;
  onBack: () => void;
}

function LaunchStep({ programId, onBack }: LaunchStepProps) {
  const navigate = useNavigate();

  function handleStart() {
    navigate({ to: '/programs/$programId/tasks', params: { programId } });
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Success icon */}
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ backgroundColor: colors.teal[50] }}
      >
        <CheckCircle size={32} style={{ color: colors.teal.DEFAULT }} />
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-2">
        <Title level={3} className="!mb-0" align="center">
          You&apos;re all set!
        </Title>
        <Text size="sm" color="secondary" align="center">
          Your system has passed all checks. Review what to expect, then start when ready.
        </Text>
      </div>

      {/* What to expect */}
      <div className="w-full rounded-xl border border-[#e2e8f0] bg-surface-secondary p-5 text-left">
        <Text size="sm" weight="semibold" color="primary" className="mb-3 block">
          What to expect
        </Text>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <Clock size={16} className="mt-0.5 flex-shrink-0" style={{ color: colors.navy.DEFAULT }} />
            <div>
              <Text size="sm" weight="medium" color="primary">
                Timed assessment
              </Text>
              <Text size="xs" color="secondary" className="mt-0.5 block">
                The timer begins the moment you click &quot;Start Assessment&quot;. Manage your time carefully.
              </Text>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText size={16} className="mt-0.5 flex-shrink-0" style={{ color: colors.navy.DEFAULT }} />
            <div>
              <Text size="sm" weight="medium" color="primary">
                Proctored format
              </Text>
              <Text size="xs" color="secondary" className="mt-0.5 block">
                Your camera and screen are monitored throughout. Any suspicious activity is flagged automatically.
              </Text>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: colors.navy.DEFAULT }} />
            <div>
              <Text size="sm" weight="medium" color="primary">
                No interruptions
              </Text>
              <Text size="xs" color="secondary" className="mt-0.5 block">
                Once started, do not close this tab or navigate away. Doing so may invalidate your attempt.
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex w-full flex-col gap-3">
        <Button variant="primary" size="lg" fullWidth onClick={handleStart}>
          Start Assessment
        </Button>
        <button
          type="button"
          onClick={onBack}
          className={cn(
            'text-sm font-medium text-content-secondary hover:text-content-primary',
            'transition-colors duration-150 underline-offset-2 hover:underline',
          )}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

function PrecheckPage() {
  const { programId } = Route.useParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<WizardStep>(0);

  function handleBack() {
    if (currentStep === 0) {
      navigate({ to: '/programs/$programId', params: { programId } });
    } else {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  }

  function handleNext() {
    setCurrentStep((prev) => (prev + 1) as WizardStep);
  }

  const stepItems = [
    { title: 'Guidelines' },
    { title: 'System Check' },
    { title: 'Launch' },
  ];

  return (
    <FullscreenLayout>
      <div className="w-full max-w-xl px-4 py-8">
        {/* Brand mark */}
        <div className="flex items-center gap-2 mb-8">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: colors.navy.DEFAULT }}
          >
            <ShieldCheck size={18} style={{ color: colors.content.inverse }} />
          </div>
          <Title level={4} weight="bold" color="primary" className="!mb-0">
            Lighthouse
          </Title>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <Steps
            current={currentStep}
            items={stepItems}
            size="small"
          />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm p-8">
          {currentStep === 0 && <GuidelinesStep onContinue={handleNext} />}
          {currentStep === 1 && (
            <SystemCheckStep onContinue={handleNext} onBack={handleBack} />
          )}
          {currentStep === 2 && (
            <LaunchStep programId={programId} onBack={handleBack} />
          )}
        </div>
      </div>
    </FullscreenLayout>
  );
}
