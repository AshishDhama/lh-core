import { cn } from '@/forge/utils';
import { Overline, Text, Title } from '@/forge/primitives/Typography';
import { Button } from '@/forge/primitives/Button';
import { Illustration } from '@/forge/primitives/Illustration';
import type { IllustrationName } from '@/forge/primitives/Illustration';

type SubjectColor = 'code' | 'science' | 'math' | 'logic';

export interface BrilliantHeroAssessmentCardProps {
  overline: string;
  title: string;
  description?: string;
  illustration?: IllustrationName;
  subjectColor?: SubjectColor;
  ctaText?: string;
  onStart?: () => void;
  className?: string;
}

const subjectBgClasses: Record<SubjectColor, string> = {
  code: 'bg-subject-code-light',
  science: 'bg-subject-science-light',
  math: 'bg-subject-math-light',
  logic: 'bg-subject-logic-light',
};

export function BrilliantHeroAssessmentCard({
  overline,
  title,
  description,
  illustration = 'assessment',
  subjectColor = 'code',
  ctaText = 'Start',
  onStart,
  className,
}: BrilliantHeroAssessmentCardProps) {
  return (
    <div
      className={cn(
        'rounded-4xl bg-surface-card shadow-soft p-8 flex flex-col items-center text-center',
        'transition-all duration-moderate ease-in-out',
        'hover:shadow-hover-card',
        className,
      )}
    >
      <Overline className="mb-2">{overline}</Overline>
      <Title level={3} weight="bold" color="primary" className="!mb-2">
        {title}
      </Title>
      {description && (
        <Text size="sm" color="secondary" className="mb-6 max-w-xs">
          {description}
        </Text>
      )}

      <div
        className={cn(
          'w-full rounded-3xl flex items-center justify-center p-8 mb-6',
          subjectBgClasses[subjectColor],
        )}
      >
        <Illustration name={illustration} className="w-32 h-32" />
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        subjectColor={subjectColor}
        onClick={onStart}
      >
        {ctaText}
      </Button>
    </div>
  );
}
