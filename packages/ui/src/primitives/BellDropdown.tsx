'use client';

import { Bell } from 'lucide-react';
import {
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '../lib/cn';

export type NotificationTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

export interface Notification {
  id: string;
  title: string;
  body?: ReactNode;
  timestamp: string;
  icon?: ReactNode;
  tone?: NotificationTone;
  read?: boolean;
  href?: string;
}

export interface BellDropdownProps extends HTMLAttributes<HTMLDivElement> {
  items: ReadonlyArray<Notification>;
  unreadCount?: number;
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onItemClick?: (n: Notification) => void;
  emptyState?: ReactNode;
  /** Dumb shell: consumer injects next/link or plain <a>. */
  LinkComponent?: (props: {
    href: string;
    children: ReactNode;
    onClick?: () => void;
  }) => ReactElement;
}

const toneAccent: Record<NotificationTone, string> = {
  info: 'bg-state-info-default',
  success: 'bg-portfolio-gain-default',
  warning: 'bg-state-warning-default',
  danger: 'bg-state-negative-default',
  neutral: 'bg-text-muted',
};

/**
 * BellDropdown — notification bell + dropdown list. Brief §16.1.
 * Dumb: caller owns item state, read-tracking, paging.
 */
export function BellDropdown({
  items,
  unreadCount: unreadProp,
  onMarkRead,
  onMarkAllRead,
  onItemClick,
  emptyState,
  LinkComponent,
  className,
  ...props
}: BellDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const unread = unreadProp ?? items.filter((i) => !i.read).length;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleItem = useCallback(
    (n: Notification) => {
      onItemClick?.(n);
      if (!n.read) onMarkRead?.(n.id);
      setOpen(false);
    },
    [onItemClick, onMarkRead],
  );

  return (
    <div ref={wrapRef} className={cn('relative inline-flex', className)} {...props}>
      <button
        type="button"
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary',
          'hover:bg-interactive-ghostHover hover:text-text-primary transition-colors duration-fast',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary',
        )}
      >
        <Bell size={18} aria-hidden="true" />
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-interactive-primary px-1 text-[10px] font-medium text-text-onBrand">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          className={cn(
            'absolute right-0 top-full z-40 mt-2 w-96 overflow-hidden rounded-xl border border-border-subtle bg-background-elevated shadow-md',
          )}
        >
          <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
            <span className="text-sm font-semibold text-text-primary">Notifications</span>
            {unread > 0 && onMarkAllRead ? (
              <button
                type="button"
                onClick={() => onMarkAllRead()}
                className="text-xs text-brand-600 hover:underline dark:text-brand-400"
              >
                Mark all as read
              </button>
            ) : null}
          </div>

          {items.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-text-secondary">
              {emptyState ?? "You're all caught up."}
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto divide-y divide-border-subtle">
              {items.map((n) => {
                const tone = n.tone ?? 'neutral';
                const inner = (
                  <div className="flex gap-3 px-4 py-3 text-left">
                    <span
                      aria-hidden="true"
                      className={cn('mt-2 h-2 w-2 shrink-0 rounded-full', toneAccent[tone])}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className={cn(
                            'truncate text-sm',
                            n.read
                              ? 'font-medium text-text-secondary'
                              : 'font-semibold text-text-primary',
                          )}
                        >
                          {n.title}
                        </span>
                        <span className="shrink-0 text-[11px] text-text-tertiary tabular-nums">
                          {n.timestamp}
                        </span>
                      </div>
                      {n.body ? (
                        <p className="mt-0.5 line-clamp-2 text-xs text-text-secondary">{n.body}</p>
                      ) : null}
                    </div>
                  </div>
                );
                if (n.href && LinkComponent) {
                  return (
                    <li key={n.id} role="menuitem">
                      <LinkComponent href={n.href} onClick={() => handleItem(n)}>
                        {inner}
                      </LinkComponent>
                    </li>
                  );
                }
                return (
                  <li key={n.id} role="menuitem">
                    <button
                      type="button"
                      onClick={() => handleItem(n)}
                      className="block w-full text-left hover:bg-background-secondary focus-visible:bg-background-secondary focus-visible:outline-none"
                    >
                      {inner}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
