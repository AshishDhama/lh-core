import { Input, Spin, Tag } from 'antd';
import { Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/forge/utils';

export interface SearchFilterOption {
  label: string;
  value: string;
}

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  filters?: SearchFilterOption[];
  activeFilters?: string[];
  onFilterToggle?: (value: string) => void;
  loading?: boolean;
  debounceMs?: number;
  className?: string;
}

export function SearchBar({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  onSearch,
  filters,
  activeFilters = [],
  onFilterToggle,
  loading = false,
  debounceMs = 300,
  className,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? '');
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isControlled) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue, isControlled]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        onSearch?.(newValue);
      }, debounceMs);
    },
    [isControlled, onChange, onSearch, debounceMs],
  );

  const handleClear = useCallback(() => {
    if (!isControlled) {
      setInternalValue('');
    }
    onChange?.('');
    onSearch?.('');
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  }, [isControlled, onChange, onSearch]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Input
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        prefix={
          <Search
            size={16}
            className="text-content-tertiary"
          />
        }
        suffix={
          loading ? (
            <Spin size="small" />
          ) : currentValue ? (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center justify-center text-content-tertiary hover:text-content-secondary transition-colors"
              aria-label="Clear search"
            >
              <X size={14} className="text-content-tertiary" />
            </button>
          ) : null
        }
        aria-label={placeholder}
        className="rounded-lg"
        allowClear={false}
      />

      {filters && filters.length > 0 && (
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Search filters">
          {filters.map((filter) => {
            const isActive = activeFilters.includes(filter.value);
            return (
              <Tag
                key={filter.value}
                color={isActive ? 'blue' : undefined}
                className={cn(
                  'cursor-pointer select-none rounded-full px-3 py-0.5 text-sm transition-all',
                  isActive
                    ? 'border-navy-400 bg-navy-50 text-navy-700 font-medium'
                    : 'border-gray-200 text-content-secondary hover:border-navy-200',
                )}
                style={
                  isActive
                    ? {
                        borderColor: 'var(--color-navy-400)',
                        backgroundColor: 'var(--color-navy-50)',
                        color: 'var(--color-navy-700)',
                      }
                    : {}
                }
                onClick={() => onFilterToggle?.(filter.value)}
                role="checkbox"
                aria-checked={isActive}
              >
                {filter.label}
              </Tag>
            );
          })}
        </div>
      )}
    </div>
  );
}
