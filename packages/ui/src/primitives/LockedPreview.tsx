import { Lock } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface LockedPreviewProps extends HTMLAttributes<HTMLDivElement> {
  /** Faded sample content rendered behind the gate. */
  children: ReactNode;
  tier?: 'Plus' | 'Pro';
  title?: string;
  description?: ReactNode;
  onUnlock?: () => void;
  /** Replaces default unlock button if provided. */
  unlockAction?: ReactNode;
}

/**
 * LockedPreview — blur-gate for Pro/Plus-only screens. Brief §13.5.
 */
export function LockedPreview({
  children,
  tier = 'Pro',
  title,
  description,
  onUnlock,
  unlockAction,
  className,
  ...props
}: LockedPreviewProps) {
  const defaultTitle = title ?? `Upgrade to ${tier} to unlock`;
  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)} {...props}>
      <div
        aria-hidden="true"
        className="pointer-events-none select-none blur-[5px] grayscale-[0.3] opacity-60"
      >
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background-primary/30 p-4">
        <div className="flex max-w-sm flex-col items-center gap-3 rounded-lg border border-border-subtle bg-background-elevated p-6 text-center shadow-md">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background-secondary text-brand-600 dark:text-brand-400">
            <Lock size={18} aria-hidden="true" />
          </div>
          <h3 className="text-heading-md font-semibold tracking-tight text-text-primary">
            {defaultTitle}
          </h3>
          {description ? <p className="text-sm text-text-secondary">{description}</p> : null}
          {unlockAction ? (
            unlockAction
          ) : onUnlock ? (
            <button
              type="button"
              onClick={onUnlock}
              className="mt-1 inline-flex h-9 items-center gap-2 rounded-md bg-interactive-primary px-4 text-sm font-medium text-text-onBrand hover:bg-interactive-primaryHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary"
            >
              Unlock {tier}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
