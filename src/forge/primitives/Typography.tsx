import { Typography as AntTypography } from 'antd';
import type { ReactNode } from 'react';

import { cn } from '@/forge/utils';

type TextColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'inverse'
  | 'success'
  | 'error'
  | 'warning';

type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextAlign = 'left' | 'center' | 'right';

const colorClasses: Record<TextColor, string> = {
  primary: 'text-[#0f172a]',
  secondary: 'text-[#475569]',
  tertiary: 'text-[#94a3b8]',
  inverse: 'text-white',
  success: 'text-[#22c55e]',
  error: 'text-[#ef4444]',
  warning: 'text-[#eab308]',
};

const weightClasses: Record<FontWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const alignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

// --- Title ---

export interface TitleProps {
  level?: 1 | 2 | 3 | 4;
  weight?: FontWeight;
  color?: TextColor;
  align?: TextAlign;
  className?: string;
  children?: ReactNode;
}

export function Title({
  level = 1,
  weight = 'bold',
  color,
  align,
  className,
  children,
}: TitleProps) {
  return (
    <AntTypography.Title
      level={level}
      className={cn(
        weightClasses[weight],
        color && colorClasses[color],
        align && alignClasses[align],
        className,
      )}
    >
      {children}
    </AntTypography.Title>
  );
}

// --- Text ---

export interface TextProps {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: FontWeight;
  color?: TextColor;
  align?: TextAlign;
  truncate?: boolean;
  italic?: boolean;
  underline?: boolean;
  delete?: boolean;
  code?: boolean;
  strong?: boolean;
  className?: string;
  children?: ReactNode;
}

const sizeClasses: Record<NonNullable<TextProps['size']>, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export function Text({
  size,
  weight,
  color,
  align,
  truncate,
  italic,
  underline,
  delete: del,
  code,
  strong,
  className,
  children,
}: TextProps) {
  return (
    <AntTypography.Text
      ellipsis={truncate ? true : undefined}
      italic={italic}
      underline={underline}
      delete={del}
      code={code}
      strong={strong}
      className={cn(
        size && sizeClasses[size],
        weight && weightClasses[weight],
        color && colorClasses[color],
        align && alignClasses[align],
        className,
      )}
    >
      {children}
    </AntTypography.Text>
  );
}

// --- Paragraph ---

export interface ParagraphProps {
  size?: 'sm' | 'base' | 'lg';
  weight?: FontWeight;
  color?: TextColor;
  align?: TextAlign;
  truncate?: boolean | { rows: number };
  className?: string;
  children?: ReactNode;
}

export function Paragraph({
  size,
  weight,
  color,
  align,
  truncate,
  className,
  children,
}: ParagraphProps) {
  const ellipsis =
    truncate === true
      ? { rows: 2 }
      : truncate
        ? { rows: truncate.rows }
        : undefined;

  return (
    <AntTypography.Paragraph
      ellipsis={ellipsis}
      className={cn(
        size && sizeClasses[size],
        weight && weightClasses[weight],
        color && colorClasses[color],
        align && alignClasses[align],
        className,
      )}
    >
      {children}
    </AntTypography.Paragraph>
  );
}

// --- Label ---

export interface LabelProps {
  htmlFor?: string;
  required?: boolean;
  weight?: FontWeight;
  color?: TextColor;
  className?: string;
  children?: ReactNode;
}

export function Label({
  htmlFor,
  required,
  weight = 'medium',
  color = 'primary',
  className,
  children,
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'text-sm leading-snug',
        weightClasses[weight],
        colorClasses[color],
        className,
      )}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-[#ef4444]" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
