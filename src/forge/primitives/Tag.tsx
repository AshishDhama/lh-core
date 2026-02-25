import { Tag as AntTag } from 'antd';
import type { ReactNode } from 'react';

import { cn } from '@/forge/utils';
import { colors } from '@/forge/tokens';

type TagColor =
  | 'navy'
  | 'teal'
  | 'purple'
  | 'success'
  | 'warning'
  | 'error'
  | 'default';

export interface TagProps {
  color?: TagColor;
  closable?: boolean;
  icon?: ReactNode;
  bordered?: boolean;
  onClose?: () => void;
  className?: string;
  children?: ReactNode;
}

const colorMap: Record<TagColor, string> = {
  navy: colors.navy.DEFAULT,
  teal: colors.teal.DEFAULT,
  purple: colors.purple.DEFAULT,
  success: colors.success.DEFAULT,
  warning: colors.warning.DEFAULT,
  error: colors.error.DEFAULT,
  default: colors.content.tertiary,
};

export function Tag({
  color = 'default',
  closable = false,
  icon,
  bordered = true,
  onClose,
  className,
  children,
}: TagProps) {
  return (
    <AntTag
      color={colorMap[color]}
      closable={closable}
      icon={icon}
      bordered={bordered}
      onClose={onClose}
      className={cn(className)}
    >
      {children}
    </AntTag>
  );
}

// --- CheckableTag ---

export interface CheckableTagProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  children?: ReactNode;
}

export function CheckableTag({
  checked,
  onChange,
  className,
  children,
}: CheckableTagProps) {
  return (
    <AntTag.CheckableTag
      checked={checked}
      onChange={onChange}
      className={cn(className)}
    >
      {children}
    </AntTag.CheckableTag>
  );
}
