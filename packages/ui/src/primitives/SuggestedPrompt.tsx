import { type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cn } from '../lib/cn';

export interface SuggestedPromptProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Short prompt text — ideally 3–6 words. */
  children: ReactNode;
}

/**
 * SuggestedPrompt — clickable chip that pre-fills the chat input.
 * Brief §5.1 dashboard AI card & §5.2 chat empty state.
 */
export const SuggestedPrompt = forwardRef<HTMLButtonElement, SuggestedPromptProps>(
  ({ className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border-default bg-background-elevated',
        'px-3 py-1.5 text-sm text-text-primary',
        'transition-colors duration-fast ease-out',
        'hover:bg-background-secondary hover:border-border-default',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary',
        className,
      )}
      {...props}
    />
  ),
);
SuggestedPrompt.displayName = 'SuggestedPrompt';

export function SuggestedPromptRow({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-wrap gap-2', className)} {...props} />;
}
