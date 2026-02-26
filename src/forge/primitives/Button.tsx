import { Button as AntButton } from 'antd';
import type { ReactNode } from 'react';

import { cn } from '@/forge/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';
type SubjectColor = 'code' | 'science' | 'math' | 'logic';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPlacement?: 'start' | 'end';
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  htmlType?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLElement>;
  subjectColor?: SubjectColor;
  className?: string;
  children?: ReactNode;
}

const sizeMap: Record<ButtonSize, 'small' | 'middle' | 'large'> = {
  sm: 'small',
  md: 'middle',
  lg: 'large',
};

const subjectColorClasses: Record<SubjectColor, string> = {
  code: 'bg-subject-code hover:bg-subject-code-dark text-white border-transparent',
  science: 'bg-subject-science hover:bg-subject-science-dark text-content-primary border-transparent',
  math: 'bg-subject-math hover:bg-subject-math-dark text-white border-transparent',
  logic: 'bg-subject-logic hover:bg-subject-logic-dark text-white border-transparent',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  subjectColor,
  className,
  ...props
}: ButtonProps) {
  let antType: 'primary' | 'default' | 'text' | 'link';
  let danger = false;

  switch (variant) {
    case 'primary':
      antType = 'primary';
      break;
    case 'secondary':
      antType = 'default';
      break;
    case 'ghost':
      antType = 'text';
      break;
    case 'danger':
      antType = 'primary';
      danger = true;
      break;
    case 'link':
      antType = 'link';
      break;
  }

  return (
    <AntButton
      type={antType}
      danger={danger}
      size={sizeMap[size]}
      block={fullWidth}
      className={cn(
        'font-medium',
        'transition-all duration-fast ease-out',
        'hover:-translate-y-px active:scale-[0.97]',
        subjectColor && subjectColorClasses[subjectColor],
        className,
      )}
      {...props}
    />
  );
}
