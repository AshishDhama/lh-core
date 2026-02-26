import { cn } from '@/forge/utils';
import { Text, Title } from '@/forge/primitives/Typography';
import { Button } from '@/forge/primitives/Button';

export interface BrilliantPremiumCardProps {
  title?: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export function BrilliantPremiumCard({
  title = 'Unlock your full potential',
  description = 'Get access to all courses, challenges, and advanced content.',
  ctaText = 'Go Premium',
  onCtaClick,
  className,
}: BrilliantPremiumCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl p-6 bg-gradient-to-br from-subject-code-dark to-purple-900',
        'transition-all duration-moderate ease-in-out',
        'hover:shadow-hover-card hover:-translate-y-px',
        className,
      )}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15">
          <span className="text-base" role="img" aria-label="star">
            ⭐
          </span>
        </div>
        <Title level={4} weight="bold" className="!mb-0 !text-white">
          {title}
        </Title>
      </div>

      <Text size="sm" className="text-white/70 mb-4 block">
        {description}
      </Text>

      <Button
        variant="secondary"
        size="sm"
        onClick={onCtaClick}
        className="!bg-white !text-subject-code-dark !border-transparent !rounded-full font-semibold"
      >
        {ctaText}
      </Button>
    </div>
  );
}
