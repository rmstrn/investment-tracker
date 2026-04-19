'use client';

import { AlertTriangle, Info, X } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface GlobalBannerProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 'warning' | 'info' | 'danger';
  children: ReactNode;
  /** Primary action, e.g. "Fix now". */
  action?: ReactNode;
  /** If set, shows an × button and calls this on click. */
  onDismiss?: () => void;
}

const toneStyles = {
  warning:
    'bg-state-warning-subtle text-state-warning-default border-b border-state-warning-default/30',
  info: 'bg-state-info-subtle text-state-info-default border-b border-state-info-default/30',
  danger:
    'bg-state-negative-subtle text-state-negative-default border-b border-state-negative-default/30',
} as const;

/**
 * GlobalBanner — top-of-app system message. Brief §18.3.
 */
export function GlobalBanner({
  tone = 'warning',
  children,
  action,
  onDismiss,
  className,
  ...props
}: GlobalBannerProps) {
  const Icon = tone === 'info' ? Info : AlertTriangle;
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-3 text-sm',
        toneStyles[tone],
        className,
      )}
      {...props}
    >
      <Icon size={16} aria-hidden="true" className="shrink-0" />
      <div className="min-w-0 flex-1 text-text-primary">{children}</div>
      {action ? <div className="shrink-0">{action}</div> : null}
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss banner"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-text-tertiary hover:bg-interactive-ghostHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <X size={14} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
