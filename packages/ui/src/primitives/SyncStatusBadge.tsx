import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type SyncStatus = 'synced' | 'syncing' | 'error' | 'paused';

export interface SyncStatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: SyncStatus;
  /** Optional contextual label, e.g. "2h ago". */
  label?: string;
}

const dotClass: Record<SyncStatus, string> = {
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
};

const defaultLabels: Record<SyncStatus, string> = {
  synced: 'Synced',
  syncing: 'Syncing…',
  error: 'Needs attention',
  paused: 'Paused',
};

/**
 * SyncStatusBadge — per-account sync indicator. Brief §18.2.
 */
export function SyncStatusBadge({ status, label, className, ...props }: SyncStatusBadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-xs', textClass[status], className)}
      {...props}
    >
      <span aria-hidden="true" className={cn('block h-2 w-2 rounded-full', dotClass[status])} />
      <span>{label ?? defaultLabels[status]}</span>
    </span>
  );
}
