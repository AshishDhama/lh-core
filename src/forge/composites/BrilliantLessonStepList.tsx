import { cn } from '@/forge/utils';
import { Text } from '@/forge/primitives/Typography';
import { Icon } from '@/forge/primitives/Icon';
import type { ItemStatus } from '@/types/common';

type SubjectColor = 'code' | 'science' | 'math' | 'logic';

export interface LessonStep {
  id: string;
  label: string;
  status: ItemStatus;
  duration?: string;
}

export interface BrilliantLessonStepListProps {
  steps: LessonStep[];
  subjectColor?: SubjectColor;
  className?: string;
}

const activeColorClasses: Record<SubjectColor, string> = {
  code: 'bg-subject-code border-subject-code',
  science: 'bg-subject-science border-subject-science',
  math: 'bg-subject-math border-subject-math',
  logic: 'bg-subject-logic border-subject-logic',
};

const lineColorClasses: Record<SubjectColor, string> = {
  code: 'bg-subject-code/20',
  science: 'bg-subject-science/20',
  math: 'bg-subject-math/20',
  logic: 'bg-subject-logic/20',
};

export function BrilliantLessonStepList({
  steps,
  subjectColor = 'code',
  className,
}: BrilliantLessonStepListProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const isActive = step.status === 'progress';
        const isComplete = step.status === 'complete';
        const isLocked = step.status === 'locked' || step.status === 'notstarted';

        return (
          <div key={step.id} className="flex gap-3">
            {/* Node column */}
            <div className="flex flex-col items-center">
              {/* Circle node */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0',
                  'transition-colors duration-fast',
                  isComplete && `${activeColorClasses[subjectColor]}`,
                  isActive && `border-2 ${activeColorClasses[subjectColor]}`,
                  isLocked && 'border-border-muted bg-surface-tertiary',
                )}
              >
                {isComplete && (
                  <Icon name="Check" size="sm" className="text-white" />
                )}
                {isActive && (
                  <div className={cn('w-3 h-3 rounded-full', `bg-subject-${subjectColor}`)} />
                )}
                {isLocked && (
                  <Icon name="Lock" size={12} className="text-content-tertiary" />
                )}
              </div>
              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    'w-0.5 flex-1 min-h-8',
                    isComplete ? lineColorClasses[subjectColor] : 'bg-border-muted',
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className={cn('pb-6', isLast && 'pb-0')}>
              <Text
                size="sm"
                weight={isActive ? 'semibold' : 'medium'}
                color={isLocked ? 'tertiary' : 'primary'}
              >
                {step.label}
              </Text>
              {step.duration && (
                <Text size="xs" color="tertiary" className="mt-0.5">
                  {step.duration}
                </Text>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
