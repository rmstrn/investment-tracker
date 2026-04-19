'use client';

import { Sparkles } from 'lucide-react';
import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

type Size = 'sm' | 'md' | 'lg';

export interface AskAiButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size;
  /** Hide the Sparkles icon (default visible). */
  hideIcon?: boolean;
  /**
   * Render as a circular floating action button — used for the dashboard FAB.
   * Default icon is Sparkles when no children given.
   */
  fab?: boolean;
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
};

/**
 * AskAiButton — brief's "special moment" CTA (§6.2). Gradient bg + shadow-ai.
 * Reserved for: dashboard AI suggestion, /chat empty state, floating FAB.
 */
export const AskAiButton = forwardRef<HTMLButtonElement, AskAiButtonProps>(
  ({ className, size = 'md', hideIcon, fab, type = 'button', children, ...props }, ref) => {
    if (fab) {
      return (
        <button
          ref={ref}
          type={type}
          aria-label={typeof children === 'string' ? children : 'Ask AI'}
          className={cn(
            'inline-flex h-14 w-14 items-center justify-center rounded-full text-static-white',
            'bg-[var(--gradient-ai)] shadow-ai',
            'transition-transform duration-fast ease-out hover:scale-105 active:scale-95',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary',
            className,
          )}
          {...props}
        >
          {children ?? <Sparkles size={22} aria-hidden="true" />}
        </button>
      );
    }
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center font-medium whitespace-nowrap rounded-md text-static-white',
          'bg-[var(--gradient-ai)] shadow-ai',
          'transition-transform duration-fast ease-out active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary',
          'disabled:pointer-events-none disabled:opacity-60',
          sizes[size],
          className,
        )}
        {...props}
      >
        {hideIcon ? null : <Sparkles size={size === 'lg' ? 18 : 16} aria-hidden="true" />}
        {children}
      </button>
    );
  },
);
AskAiButton.displayName = 'AskAiButton';
