import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        'flex h-10 w-full rounded-sm border bg-background-elevated px-3 text-sm',
        'text-text-primary placeholder:text-text-muted',
        'border-border-default',
        'transition-colors duration-fast ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-state-negative-default aria-invalid:focus-visible:ring-red-500',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
