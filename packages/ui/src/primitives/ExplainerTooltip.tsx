'use client';

import {
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '../lib/cn';

export interface ExplainerTooltipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Short 1–2 sentence explanation. */
  definition: ReactNode;
  /** "Learn more" callback — usually opens chat with pre-filled "Explain <term>". */
  onLearnMore?: () => void;
  /** Label shown on the CTA. Default "Learn more in chat". */
  learnMoreLabel?: string;
  children: ReactNode;
}

/**
 * ExplainerTooltip — dotted-underline term wrapper. Brief §14.3.
 * Hover/focus shows a popover with a 1–2 sentence definition + optional
 * "Learn more in chat" CTA. Click pins open; Escape dismisses.
 */
export function ExplainerTooltip({
  definition,
  onLearnMore,
  learnMoreLabel = 'Learn more in chat',
  children,
  className,
  ...props
}: ExplainerTooltipProps) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const id = useId();
  const timeout = useRef<number | null>(null);

  const clearPending = () => {
    if (timeout.current !== null) window.clearTimeout(timeout.current);
  };
  const show = useCallback(() => {
    clearPending();
    setOpen(true);
  }, []);
  const hide = useCallback(() => {
    clearPending();
    if (pinned) return;
    timeout.current = window.setTimeout(() => setOpen(false), 120);
  }, [pinned]);

  return (
    <span
      className={cn('relative inline-flex items-baseline', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      {...props}
    >
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onFocus={show}
        onBlur={hide}
        onClick={() => {
          setPinned((p) => !p);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setPinned(false);
            setOpen(false);
          }
        }}
        className={cn(
          'appearance-none border-0 bg-transparent p-0 font-inherit text-inherit',
          'border-b border-dotted border-border-default',
          'cursor-help focus:outline-none focus-visible:border-brand-500',
        )}
      >
        {children}
      </button>
      {open ? (
        <span
          role="tooltip"
          id={id}
          className={cn(
            'absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2',
            'rounded-md border border-border-subtle bg-background-elevated p-3 shadow-md',
            'text-left text-sm text-text-primary',
          )}
        >
          <span className="block">{definition}</span>
          {onLearnMore ? (
            <button
              type="button"
              onClick={() => {
                onLearnMore();
                setOpen(false);
                setPinned(false);
              }}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline focus-visible:outline-none focus-visible:underline dark:text-brand-400"
            >
              {learnMoreLabel} →
            </button>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
