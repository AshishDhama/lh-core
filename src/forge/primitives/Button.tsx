import { Button as AntButton } from 'antd';
import type { ReactNode } from 'react';

import { cn } from '@/forge/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  htmlType?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
  children?: ReactNode;
}

const sizeMap: Record<ButtonSize, 'small' | 'middle' | 'large'> = {
  sm: 'small',
  md: 'middle',
  lg: 'large',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
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
      className={cn('font-medium', className)}
      {...props}
    />
  );
}
