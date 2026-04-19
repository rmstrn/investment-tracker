import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

type Tone = 'neutral' | 'brand' | 'positive' | 'negative' | 'warning' | 'info';

const tones: Record<Tone, string> = {
  neutral: 'bg-background-tertiary text-text-secondary',
  brand: 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200',
  positive: 'bg-state-positive-subtle text-state-positive-default',
  negative: 'bg-state-negative-subtle text-state-negative-default',
  warning: 'bg-state-warning-subtle text-state-warning-default',
  info: 'bg-state-info-subtle text-state-info-default',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone = 'neutral', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-border-subtle px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = 'Badge';
