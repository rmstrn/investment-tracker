import { type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { AskAiButton } from '../primitives/AskAiButton';

export interface FloatingAiFabProps {
  onClick?: () => void;
  /** When true, hides the FAB. Brief §5.1: hide on /chat page. */
  hidden?: boolean;
  ariaLabel?: string;
  /** Optional icon override (defaults to Sparkles). */
  icon?: ReactNode;
  className?: string;
}

/**
 * FloatingAiFab — bottom-right chat FAB. Brief §4, §5.1.
 */
export function FloatingAiFab({ onClick, hidden, ariaLabel, icon, className }: FloatingAiFabProps) {
  if (hidden) return null;
  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-40',
        'pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)]',
        className,
      )}
    >
      <AskAiButton fab aria-label={ariaLabel ?? 'Ask AI'} onClick={onClick}>
        {icon}
      </AskAiButton>
    </div>
  );
}
