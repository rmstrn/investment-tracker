'use client';

import {
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useId,
  useState,
} from 'react';
import { cn } from '../lib/cn';

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: ReactNode;
  ariaLabel?: string;
}

export interface SegmentedControlProps<T extends string = string>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options: ReadonlyArray<SegmentedControlOption<T>>;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  size?: 'sm' | 'md';
  /** Accessible group label (visually hidden). */
  label?: string;
}

const sizeStyles = {
  sm: 'h-8 text-xs',
  md: 'h-10 text-sm',
} as const;

const segmentSizeStyles = {
  sm: 'px-2.5',
  md: 'px-3',
} as const;

/**
 * SegmentedControl — pill-shaped period picker (1D · 1W · 1M · 3M · 1Y · All).
 * Brief §5.1 dashboard hero. Arrow keys cycle selection.
 */
export function SegmentedControl<T extends string = string>({
  options,
  value,
  defaultValue,
  onChange,
  size = 'md',
  label,
  className,
  ...props
}: SegmentedControlProps<T>) {
  const groupId = useId();
  const controlled = value !== undefined;
  const [internal, setInternal] = useState<T>(defaultValue ?? options[0]!.value);
  const current = controlled ? (value as T) : internal;

  const setValue = useCallback(
    (next: T) => {
      if (!controlled) setInternal(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const next = (idx + dir + options.length) % options.length;
      setValue(options[next]!.value);
      const root = e.currentTarget.parentElement;
      const buttons = root?.querySelectorAll<HTMLButtonElement>('button[role="radio"]');
      buttons?.[next]?.focus();
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-border-default bg-background-secondary p-1',
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {options.map((opt, i) => {
        const active = opt.value === current;
        return (
          <button
            key={opt.value}
            id={`${groupId}-${opt.value}`}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.ariaLabel}
            tabIndex={active ? 0 : -1}
            onClick={() => setValue(opt.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              'inline-flex h-full items-center justify-center rounded-full font-medium transition-colors duration-fast ease-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              segmentSizeStyles[size],
              active
                ? 'bg-background-elevated text-text-primary shadow-xs'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
