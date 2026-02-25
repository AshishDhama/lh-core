/** CountdownTimer composite — real-time countdown to a target date. */

import { useEffect, useState } from 'react';

import { Text, Label } from '@/forge/primitives';
import { cn } from '@/forge/utils';

export type CountdownFormat = 'hh:mm:ss' | 'dd:hh:mm:ss';
export type CountdownSize = 'sm' | 'md' | 'lg';

export interface CountdownTimerProps {
  /** Target date/time to count down to. */
  targetDate: Date | string;
  /** Called once when the countdown reaches zero. */
  onComplete?: () => void;
  /** Display format — include days segment or only hours. */
  format?: CountdownFormat;
  /** Size variant controlling digit font size. */
  size?: CountdownSize;
  /** Whether to show unit labels (days, hrs, min, sec) below digits. */
  showLabels?: boolean;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calcTimeLeft(targetDate: Date | string): TimeLeft {
  const target = targetDate instanceof Date ? targetDate : new Date(targetDate);
  const diff = target.getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isExpired: false,
  };
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

const digitSizeClasses: Record<CountdownSize, string> = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
};

interface SegmentProps {
  value: number;
  label: string;
  size: CountdownSize;
  showLabels: boolean;
  isLast?: boolean;
}

function Segment({ value, label, size, showLabels, isLast }: SegmentProps) {
  return (
    <div className="flex items-start gap-0">
      <div className="flex flex-col items-center">
        <span
          className={cn(
            'font-bold tabular-nums leading-none text-content-primary',
            digitSizeClasses[size],
          )}
        >
          {pad(value)}
        </span>
        {showLabels && (
          <Label className="mt-1 text-xs uppercase tracking-wide text-content-tertiary">
            {label}
          </Label>
        )}
      </div>
      {!isLast && (
        <span
          className={cn(
            'mx-0.5 font-bold text-content-tertiary',
            digitSizeClasses[size],
          )}
        >
          :
        </span>
      )}
    </div>
  );
}

export function CountdownTimer({
  targetDate,
  onComplete,
  format = 'dd:hh:mm:ss',
  size = 'md',
  showLabels = true,
  className,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(targetDate));

  useEffect(() => {
    if (timeLeft.isExpired) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      const next = calcTimeLeft(targetDate);
      setTimeLeft(next);
      if (next.isExpired) {
        clearInterval(timer);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete, timeLeft.isExpired]);

  if (timeLeft.isExpired) {
    return (
      <Text size="sm" color="tertiary" className={className}>
        Expired
      </Text>
    );
  }

  const includeDays = format === 'dd:hh:mm:ss';

  return (
    <div className={cn('inline-flex items-start', className)} role="timer" aria-live="polite" aria-atomic="true">
      {includeDays && (
        <Segment value={timeLeft.days} label="days" size={size} showLabels={showLabels} />
      )}
      <Segment value={timeLeft.hours} label="hrs" size={size} showLabels={showLabels} />
      <Segment value={timeLeft.minutes} label="min" size={size} showLabels={showLabels} />
      <Segment
        value={timeLeft.seconds}
        label="sec"
        size={size}
        showLabels={showLabels}
        isLast
      />
    </div>
  );
}
