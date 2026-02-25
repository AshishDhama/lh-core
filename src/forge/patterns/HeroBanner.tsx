import { Button } from '@/forge/primitives/Button';
import { Text, Title } from '@/forge/primitives/Typography';
import { cn } from '@/forge/utils';

export interface HeroBannerProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaAction?: () => void;
  backgroundImage?: string;
  /** Overlay opacity 0–1, defaults to 0.55 */
  overlay?: number;
  className?: string;
}

export function HeroBanner({
  title,
  subtitle,
  ctaText,
  ctaAction,
  backgroundImage,
  overlay = 0.55,
  className,
}: HeroBannerProps) {
  return (
    <div
      className={cn(
        'relative w-full min-h-48 flex items-end overflow-hidden rounded-2xl',
        'bg-[#002C77]', // navy fallback when no image
        className,
      )}
    >
      {/* Background image */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, rgba(0,44,119,${overlay}) 0%, rgba(0,133,117,${Math.max(0, overlay - 0.15)}) 100%)`,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 w-full px-8 py-8 flex flex-col gap-3">
        <Title level={2} className="!text-white leading-tight !mb-0">
          {title}
        </Title>

        {subtitle && (
          <Text size="base" className="text-white/80 max-w-2xl">
            {subtitle}
          </Text>
        )}

        {ctaText && ctaAction && (
          <div className="mt-2">
            <Button
              variant="secondary"
              onClick={ctaAction}
              className="bg-white text-[#002C77] border-white hover:bg-[#EEF6FA] hover:border-[#EEF6FA]"
            >
              {ctaText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
