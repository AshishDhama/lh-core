import { Input as AntInput } from 'antd';
import type { InputProps as AntInputProps, InputRef } from 'antd';
import type { PasswordProps as AntPasswordProps } from 'antd/es/input';
import type { TextAreaProps as AntTextAreaProps } from 'antd/es/input';
import { forwardRef } from 'react';

import { cn } from '@/forge/utils';

type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<AntInputProps, 'size'> {
  size?: InputSize;
}

export interface PasswordProps
  extends Omit<AntPasswordProps, 'size'> {
  size?: InputSize;
}

export interface TextAreaProps
  extends Omit<AntTextAreaProps, 'size'> {
  size?: InputSize;
}

const sizeMap: Record<InputSize, 'small' | 'middle' | 'large'> = {
  sm: 'small',
  md: 'middle',
  lg: 'large',
};

export const Input = forwardRef<InputRef, InputProps>(
  function Input({ size = 'md', className, ...props }, ref) {
    return (
      <AntInput
        ref={ref}
        size={sizeMap[size]}
        className={cn('rounded-lg', className)}
        {...props}
      />
    );
  },
);

export const Password = forwardRef<InputRef, PasswordProps>(
  function Password({ size = 'md', className, ...props }, ref) {
    return (
      <AntInput.Password
        ref={ref}
        size={sizeMap[size]}
        className={cn('rounded-lg', className)}
        {...props}
      />
    );
  },
);

export const TextArea = forwardRef<InputRef, TextAreaProps>(
  function TextArea({ size = 'md', className, ...props }, ref) {
    return (
      <AntInput.TextArea
        ref={ref}
        size={sizeMap[size]}
        className={cn('rounded-lg', className)}
        {...props}
      />
    );
  },
);
