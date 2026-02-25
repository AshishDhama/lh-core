import { Button } from '@/forge/primitives/Button';
import { Icon } from '@/forge/primitives/Icon';
import { ProgressBar } from '@/forge/primitives/ProgressBar';
import { Text, Title } from '@/forge/primitives/Typography';
import { colors } from '@/forge/tokens';
import { cn } from '@/forge/utils';

export type CheckStatus = 'pass' | 'fail' | 'pending' | 'running';

export interface SystemCheck {
  name: string;
  status: CheckStatus;
  message?: string;
}

export interface SystemCheckPanelProps {
  checks: SystemCheck[];
  onRetry?: () => void;
  onContinue?: () => void;
  allPassed?: boolean;
  className?: string;
}

const statusIconMap: Record<CheckStatus, { name: Parameters<typeof Icon>[0]['name']; color: string }> = {
  pass: { name: 'CircleCheck', color: colors.success.DEFAULT },
  fail: { name: 'CircleX', color: colors.error.DEFAULT },
  pending: { name: 'Circle', color: colors.content.tertiary },
  running: { name: 'Loader', color: colors.navy.DEFAULT },
};

const statusLabel: Record<CheckStatus, string> = {
  pass: 'Passed',
  fail: 'Failed',
  pending: 'Waiting',
  running: 'Checking…',
};

function CheckRow({ check }: { check: SystemCheck }) {
  const { name: iconName, color: iconColor } = statusIconMap[check.status];

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-xl',
        check.status === 'running' && 'bg-[#EEF6FA]',
        check.status === 'fail' && 'bg-[#fef2f2]',
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        <Icon
          name={iconName}
          size="md"
          style={{ color: iconColor }}
          className={check.status === 'running' ? 'animate-spin' : undefined}
          aria-hidden="true"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <Text size="sm" weight="medium" color="primary">
            {check.name}
          </Text>
          <Text
            size="xs"
            className={cn(
              'flex-shrink-0',
              check.status === 'pass' && 'text-[#15803d]',
              check.status === 'fail' && 'text-[#b91c1c]',
              check.status === 'running' && 'text-[#002C77]',
              check.status === 'pending' && 'text-[#94a3b8]',
            )}
          >
            {statusLabel[check.status]}
          </Text>
        </div>
        {check.message && (
          <Text size="xs" color="tertiary" className="mt-0.5">
            {check.message}
          </Text>
        )}
      </div>
    </div>
  );
}

export function SystemCheckPanel({
  checks,
  onRetry,
  onContinue,
  allPassed,
  className,
}: SystemCheckPanelProps) {
  const passedCount = checks.filter((c) => c.status === 'pass').length;
  const progress = checks.length > 0 ? Math.round((passedCount / checks.length) * 100) : 0;
  const hasFailures = checks.some((c) => c.status === 'fail');
  const isRunning = checks.some((c) => c.status === 'running');

  const progressStatus = hasFailures
    ? 'exception'
    : allPassed || progress === 100
      ? 'success'
      : isRunning
        ? 'active'
        : 'normal';

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex flex-col gap-1">
        <Title level={3} className="!mb-0">
          System Check
        </Title>
        <Text size="sm" color="secondary">
          Verifying your device before you begin the assessment.
        </Text>
      </div>

      {/* Progress bar */}
      <ProgressBar
        percent={progress}
        status={progressStatus}
        showInfo
      />

      {/* Check rows */}
      <div className="flex flex-col gap-1">
        {checks.map((check) => (
          <CheckRow key={check.name} check={check} />
        ))}
      </div>

      {/* Actions */}
      {(hasFailures || allPassed) && (
        <div className="flex items-center gap-3 pt-2">
          {hasFailures && onRetry && (
            <Button variant="secondary" onClick={onRetry} icon={<Icon name="RefreshCw" size="sm" />}>
              Retry Failed Checks
            </Button>
          )}
          {(allPassed || progress === 100) && !hasFailures && onContinue && (
            <Button
              variant="primary"
              onClick={onContinue}
              icon={<Icon name="ArrowRight" size="sm" style={{ color: colors.content.inverse }} />}
            >
              Continue to Assessment
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
