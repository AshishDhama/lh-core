import { useCallback, useEffect, useRef, useState } from 'react';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { ShieldCheck } from 'lucide-react';

import { Button, Text, Title } from '@/forge';
import { FullscreenLayout } from '@/forge/layouts';
import type { SystemCheck } from '@/forge/patterns/SystemCheckPanel';
import { SystemCheckPanel } from '@/forge/patterns/SystemCheckPanel';
import { colors } from '@/forge/tokens';

export const Route = createLazyFileRoute('/programs/$programId/precheck')({
  component: PrecheckPage,
});

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

// ─── Page component ───────────────────────────────────────────────────────────

function PrecheckPage() {
  const { programId } = Route.useParams();
  const navigate = useNavigate();

  const [checks, setChecks] = useState<SystemCheck[]>(INITIAL_CHECKS);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allPassed = done && checks.every((c) => c.status === 'pass');
  const hasFailures = done && checks.some((c) => c.status === 'fail');

  // Run checks sequentially
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

      // Mark current check as running
      setChecks((prev) =>
        prev.map((c, i) => (i === currentIdx ? { ...c, status: 'running' } : c)),
      );

      timerRef.current = setTimeout(() => {
        const outcome = CHECK_OUTCOMES[currentIdx];
        // Mark current check with its result
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

  function handleContinue() {
    navigate({ to: '/programs/$programId/tasks', params: { programId } });
  }

  function handleRetry() {
    runChecks();
  }

  function handleBack() {
    navigate({ to: '/programs/$programId', params: { programId } });
  }

  return (
    <FullscreenLayout>
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

      {/* Card */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm p-8">
        <SystemCheckPanel
          checks={checks}
          allPassed={allPassed}
          onRetry={hasFailures && !running ? handleRetry : undefined}
          onContinue={allPassed && !running ? handleContinue : undefined}
        />
      </div>

      {/* Footer hint */}
      <div className="mt-6 text-center">
        <Text size="xs" color="tertiary">
          {running
            ? 'Please wait while we check your system…'
            : allPassed
              ? 'All checks passed. You\'re ready to begin.'
              : hasFailures
                ? 'Some checks failed. Resolve the issues and retry.'
                : 'System check complete.'}
        </Text>
        {!running && (
          <div className="mt-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              Back to Program
            </Button>
          </div>
        )}
      </div>
    </FullscreenLayout>
  );
}
