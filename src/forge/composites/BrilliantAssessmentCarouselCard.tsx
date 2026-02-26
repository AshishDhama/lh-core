import { cn } from '@/forge/utils';
import { Text } from '@/forge/primitives/Typography';
import { Illustration } from '@/forge/primitives/Illustration';
import type { IllustrationName } from '@/forge/primitives/Illustration';
import { ProgressBar } from '@/forge/primitives/ProgressBar';

export interface BrilliantAssessmentCarouselCardProps {
  title: string;
  illustration?: IllustrationName;
  progress?: number;
  isNew?: boolean;
  onClick?: () => void;
  className?: string;
}

export function BrilliantAssessmentCarouselCard({
  title,
  illustration = 'assessment',
  progress,
  isNew = false,
  onClick,
  className,
}: BrilliantAssessmentCarouselCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center rounded-3xl bg-surface-card shadow-soft',
        'w-44 flex-shrink-0 overflow-hidden',
        'transition-all duration-moderate ease-in-out',
        'hover:shadow-hover-card hover:-translate-y-px',
        'cursor-pointer text-left',
        className,
      )}
    >
      {/* Badge */}
      {isNew && (
        <span
          className={cn(
            'absolute -top-2 left-1/2 -translate-x-1/2 z-10',
            'px-2.5 py-0.5 rounded-full',
            'bg-subject-logic text-white text-xs font-semibold',
          )}
        >
          NEW
        </span>
      )}

      {/* Illustration area */}
      <div className="w-full pt-6 pb-4 flex items-center justify-center bg-surface-tertiary/50">
        <Illustration name={illustration} className="w-20 h-20" />
      </div>

      {/* Title */}
      <div className="px-4 pt-3 pb-3 w-full">
        <Text size="sm" weight="semibold" color="primary" className="line-clamp-2">
          {title}
        </Text>
      </div>

      {/* Progress strip */}
      {progress !== undefined && (
        <div className="w-full px-4 pb-3">
          <ProgressBar percent={progress} size="xs" showInfo={false} />
        </div>
      )}
    </button>
  );
}
