import { Avatar as AntAvatar } from 'antd';
import type { ReactNode } from 'react';

import { cn } from '@/forge/utils';
import { colors } from '@/forge/tokens';

type AvatarSize = 'sm' | 'md' | 'lg';
type AvatarShape = 'circle' | 'square';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize | number;
  shape?: AvatarShape;
  icon?: ReactNode;
  fallback?: string;
  className?: string;
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 24,
  md: 36,
  lg: 48,
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({
  src,
  alt,
  size = 'md',
  shape = 'circle',
  icon,
  fallback,
  className,
}: AvatarProps) {
  const resolvedSize = typeof size === 'number' ? size : sizeMap[size];

  return (
    <AntAvatar
      src={src}
      alt={alt}
      size={resolvedSize}
      shape={shape}
      icon={icon}
      style={{
        backgroundColor: !src && !icon ? colors.navy[400] : undefined,
        color: !src && !icon ? colors.content.inverse : undefined,
      }}
      className={cn(className)}
    >
      {fallback ? getInitials(fallback) : null}
    </AntAvatar>
  );
}

// --- AvatarGroup ---

export interface AvatarGroupProps {
  max?: number;
  size?: AvatarSize | number;
  className?: string;
  children?: ReactNode;
}

export function AvatarGroup({
  max = 3,
  size = 'md',
  className,
  children,
}: AvatarGroupProps) {
  const resolvedSize = typeof size === 'number' ? size : sizeMap[size];

  return (
    <AntAvatar.Group
      max={{ count: max }}
      size={resolvedSize}
      className={cn(className)}
    >
      {children}
    </AntAvatar.Group>
  );
}
