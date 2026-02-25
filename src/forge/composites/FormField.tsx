import { Input } from 'antd';
import type { ReactNode } from 'react';

import { Label, Text } from '@/forge/primitives';
import { cn } from '@/forge/utils';

export interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function FormField({
  label,
  name,
  required,
  error,
  helperText,
  placeholder,
  value,
  defaultValue,
  onChange,
  children,
  className,
  disabled,
}: FormFieldProps) {
  const hasError = Boolean(error);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>

      {children ? (
        <div
          className={cn(
            hasError && '[&_.ant-input]:!border-[#ef4444] [&_.ant-select-selector]:!border-[#ef4444]',
          )}
        >
          {children}
        </div>
      ) : (
        <Input
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          status={hasError ? 'error' : undefined}
          className="rounded-lg"
        />
      )}

      {hasError && (
        <Text size="xs" color="error" className="flex items-center gap-1">
          {error}
        </Text>
      )}

      {!hasError && helperText && (
        <Text size="xs" color="tertiary">
          {helperText}
        </Text>
      )}
    </div>
  );
}
