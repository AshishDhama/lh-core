import { Image } from 'lucide-react';

import { cn } from '@/forge/utils';

import analyticsUrl from '@/assets/illustrations/analytics.svg?url';
import assessmentUrl from '@/assets/illustrations/assessment.svg?url';
import cognitiveUrl from '@/assets/illustrations/cognitive.svg?url';
import feedbackUrl from '@/assets/illustrations/feedback.svg?url';
import interviewUrl from '@/assets/illustrations/interview.svg?url';
import leadershipUrl from '@/assets/illustrations/leadership.svg?url';
import scenarioUrl from '@/assets/illustrations/scenario.svg?url';
import simulationUrl from '@/assets/illustrations/simulation.svg?url';
import surveyUrl from '@/assets/illustrations/survey.svg?url';
import wellbeingUrl from '@/assets/illustrations/wellbeing.svg?url';

const illustrationMap = {
  analytics: analyticsUrl,
  assessment: assessmentUrl,
  cognitive: cognitiveUrl,
  feedback: feedbackUrl,
  interview: interviewUrl,
  leadership: leadershipUrl,
  scenario: scenarioUrl,
  simulation: simulationUrl,
  survey: surveyUrl,
  wellbeing: wellbeingUrl,
} as const;

export type IllustrationName = keyof typeof illustrationMap;

type IllustrationSize = 'sm' | 'md' | 'lg' | 'xl';

export interface IllustrationProps {
  name: string;
  size?: IllustrationSize;
  className?: string;
}

const sizeMap: Record<IllustrationSize, number> = {
  sm: 48,
  md: 80,
  lg: 120,
  xl: 160,
};

export function Illustration({ name, size = 'md', className }: IllustrationProps) {
  const resolved = sizeMap[size];
  const url = illustrationMap[name as IllustrationName];

  if (!url) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-surface-tertiary',
          className,
        )}
        style={{ width: resolved, height: resolved }}
        role="img"
        aria-label={name}
      >
        <Image size={resolved * 0.4} className="text-content-tertiary" />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={name}
      width={resolved}
      height={resolved}
      className={cn('object-contain', className)}
      draggable={false}
    />
  );
}
