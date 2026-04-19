import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

export const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-background-tertiary', className)}
      {...props}
    />
  ),
);
Skeleton.displayName = 'Skeleton';
