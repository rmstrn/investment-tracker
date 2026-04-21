import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type SyncStatus = 'synced' | 'syncing' | 'error' | 'paused' | 'manual';

export interface SyncStatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: SyncStatus;
  /** Optional contextual label, e.g. "2h ago". */
  label?: string;
}

const dotClass: Record<Exclude<SyncStatus, 'manual'>, string> = {
  synced: 'bg-portfolio-gain-default',
  syncing:
    'bg-interactive-primary animate-[pulse-dot_1.4s_ease-in-out_infinite] motion-reduce:animate-none',
  error: 'bg-state-warning-default',
  paused: 'bg-text-muted',
};

const textClass: Record<SyncStatus, string> = {
  synced: 'text-text-secondary',
  syncing: 'text-text-primary',
  error: 'text-state-warning-default',
  paused: 'text-text-tertiary',
  manual: 'text-text-secondary',
};

const defaultLabels: Record<SyncStatus, string> = {
  synced: 'Synced',
  syncing: 'Syncing…',
  error: 'Needs attention',
  paused: 'Paused',
  manual: 'Manual',
};

const defaultTitle: Partial<Record<SyncStatus, string>> = {
  manual: 'Manually entered — does not sync',
};

/**
 * SyncStatusBadge — per-account sync indicator. Brief §18.2.
 * `manual` variant renders without a status dot (manual entries do not sync).
 */
export function SyncStatusBadge({
  status,
  label,
  className,
  title,
  ...props
}: SyncStatusBadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-xs', textClass[status], className)}
      title={title ?? defaultTitle[status]}
      {...props}
    >
      {status !== 'manual' ? (
        <span aria-hidden="true" className={cn('block h-2 w-2 rounded-full', dotClass[status])} />
      ) : null}
      <span>{label ?? defaultLabels[status]}</span>
    </span>
  );
}
