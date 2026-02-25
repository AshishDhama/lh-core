import { Image } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/forge/utils';

const VALID_NAMES = [
  'analytics',
  'assessment',
  'cognitive',
  'feedback',
  'interview',
  'leadership',
  'scenario',
  'simulation',
  'survey',
  'wellbeing',
] as const;

export type IllustrationName = (typeof VALID_NAMES)[number];

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

const validSet = new Set<string>(VALID_NAMES);

function Placeholder({ size, name, className }: { size: number; name: string; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg bg-surface-tertiary',
        className,
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label={name}
    >
      <Image size={size * 0.35} className="text-content-tertiary" />
    </div>
  );
}

export function Illustration({ name, size = 'md', className }: IllustrationProps) {
  const resolved = sizeMap[size];
  const [failed, setFailed] = useState(false);

  if (!validSet.has(name) || failed) {
    return <Placeholder size={resolved} name={name} className={className} />;
  }

  return (
    <img
      src={`/illustrations/${name}.svg`}
      alt={name}
      width={resolved}
      height={resolved}
      className={cn('object-contain', className)}
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}
