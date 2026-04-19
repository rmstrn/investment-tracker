import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

/**
 * Shimmer — loading placeholder with a violet gradient sweep, 1.5s loop.
 * Replaces spinner usage per brief §6.8.
 *
 * Honors `prefers-reduced-motion` via motion-reduce: killing the sweep layer.
 */
export const Shimmer = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden rounded-sm bg-background-tertiary',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:animate-[shimmer_var(--duration-shimmer,1500ms)_linear_infinite]',
        'before:bg-[var(--gradient-shimmer)]',
        'motion-reduce:before:hidden',
        className,
      )}
      {...props}
    />
  ),
);
Shimmer.displayName = 'Shimmer';
