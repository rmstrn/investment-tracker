'use client';

import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { type HTMLAttributes, type ReactNode, useState } from 'react';
import { cn } from '../lib/cn';

export interface ToolUseCardProps extends HTMLAttributes<HTMLDivElement> {
  /** While running: "Looking up your positions...". Collapsed: "Checked 23 positions". */
  runningLabel: string;
  completedLabel?: string;
  status?: 'running' | 'done';
  /** Optional JSON / summary shown under the header when expanded. */
  children?: ReactNode;
  /** Start collapsed when status transitions to done (default true). */
  collapseOnDone?: boolean;
}

/**
 * ToolUseCard — "AI used a tool" card inside chat messages. Brief §5.2.
 */
export function ToolUseCard({
  runningLabel,
  completedLabel,
  status = 'running',
  children,
  collapseOnDone = true,
  className,
  ...props
}: ToolUseCardProps) {
  const done = status === 'done';
  const [open, setOpen] = useState(!(done && collapseOnDone));
  const label = done ? completedLabel ?? runningLabel : runningLabel;

  return (
    <div
      className={cn(
        'my-2 rounded-md border border-border-subtle bg-background-secondary',
        'overflow-hidden text-sm',
        className,
      )}
      {...props}
    >
      <button
        type="button"
        onClick={() => children && setOpen((o) => !o)}
        aria-expanded={children ? open : undefined}
        className={cn(
          'flex w-full items-center gap-2 px-3 py-2 text-left',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
          children ? 'cursor-pointer hover:bg-background-tertiary' : 'cursor-default',
        )}
      >
        {done ? (
          <Check size={14} aria-hidden="true" className="text-portfolio-gain-default" />
        ) : (
          <Loader2
            size={14}
            aria-hidden="true"
            className="animate-spin text-text-tertiary motion-reduce:animate-none"
          />
        )}
        <span className={cn('flex-1 truncate', done ? 'text-text-secondary' : 'text-text-primary')}>
          {label}
        </span>
        {children ? (
          <ChevronDown
            size={14}
            aria-hidden="true"
            className={cn(
              'text-text-tertiary transition-transform duration-fast',
              open ? 'rotate-180' : 'rotate-0',
            )}
          />
        ) : null}
      </button>
      {children && open ? (
        <div className="border-t border-border-subtle px-3 py-2 font-mono text-xs text-text-secondary">
          {children}
        </div>
      ) : null}
    </div>
  );
}
