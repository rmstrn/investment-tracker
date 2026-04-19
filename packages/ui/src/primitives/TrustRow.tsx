import { Lock } from 'lucide-react';
import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface TrustRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Primary reassurance text. */
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  variant?: 'card' | 'inline';
}

/**
 * TrustRow — "Read-only — we cannot move your money" block. Brief §17.1, §13.1.
 */
export function TrustRow({
  title = 'Read-only — we can see your portfolio, we cannot trade or move money.',
  description,
  action,
  variant = 'card',
  className,
  ...props
}: TrustRowProps) {
  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 text-xs text-text-tertiary',
          className,
        )}
        {...props}
      >
        <Lock size={12} aria-hidden="true" />
        <span>{title}</span>
      </div>
    );
  }
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-border-subtle bg-background-secondary p-4',
        className,
      )}
      {...props}
    >
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background-elevated text-brand-600 dark:text-brand-400">
        <Lock size={16} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        {description ? <p className="text-sm text-text-secondary">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
