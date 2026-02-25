import { icons, type LucideProps } from 'lucide-react';

import { cn } from '@/forge/utils';

type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export type IconName = keyof typeof icons;

export interface IconProps extends Omit<LucideProps, 'size'> {
  name: IconName;
  size?: IconSize | number;
}

const sizeMap: Record<IconSize, number> = {
  sm: 14,
  md: 18,
  lg: 24,
  xl: 32,
};

export function Icon({
  name,
  size = 'md',
  className,
  strokeWidth = 2,
  ...props
}: IconProps) {
  const LucideIcon = icons[name];
  const resolved = typeof size === 'number' ? size : sizeMap[size];

  return (
    <LucideIcon
      size={resolved}
      strokeWidth={strokeWidth}
      className={cn('shrink-0', className)}
      {...props}
    />
  );
}
