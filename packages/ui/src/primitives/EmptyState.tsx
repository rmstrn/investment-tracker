import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: ReactNode;
  /** Optional SVG illustration (~160×160). Brief §6.7: violet-monochrome. */
  illustration?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}

/**
 * EmptyState — "Connect an account to see magic happen" panels. Brief §6.7.
 */
export function EmptyState({
  title,
  description,
  illustration,
  primaryAction,
  secondaryAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-5 px-6 py-12 text-center',
        className,
      )}
      {...props}
    >
      {illustration ? (
        <div className="flex h-40 w-40 items-center justify-center text-brand-500" aria-hidden>
          {illustration}
        </div>
      ) : null}
      <div className="max-w-sm space-y-2">
        <h3 className="text-heading-lg font-semibold tracking-tight text-text-primary">{title}</h3>
        {description ? <p className="text-sm text-text-secondary">{description}</p> : null}
      </div>
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
