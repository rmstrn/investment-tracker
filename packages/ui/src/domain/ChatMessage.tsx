import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Avatar } from '../primitives/Avatar';

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessageProps extends HTMLAttributes<HTMLDivElement> {
  role: ChatRole;
  /** Rendered content. Pass strings or rich children. */
  children: ReactNode;
  /** Optional author avatar src (mostly for user role) */
  avatarSrc?: string;
  /** Optional avatar fallback text */
  avatarFallback?: string;
  /** Timestamp caption, e.g. "now", "10:24" */
  timestamp?: string;
}

export function ChatMessage({
  role,
  children,
  avatarSrc,
  avatarFallback,
  timestamp,
  className,
  ...props
}: ChatMessageProps) {
  if (role === 'system') {
    return (
      <div
        className={cn(
          'mx-auto my-3 max-w-md rounded-full bg-background-secondary px-3 py-1 text-center text-xs text-text-tertiary',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  const isUser = role === 'user';
  return (
    <div
      className={cn('flex w-full gap-3', isUser ? 'flex-row-reverse' : 'flex-row', className)}
      {...props}
    >
      <Avatar
        size="sm"
        src={avatarSrc}
        fallback={avatarFallback ?? (isUser ? 'You' : 'AI')}
        alt={isUser ? 'You' : 'Assistant'}
        className={cn(
          isUser
            ? 'bg-interactive-primary text-text-onBrand'
            : 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200',
        )}
      />
      <div className={cn('max-w-[75%] flex flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isUser
              ? 'bg-interactive-primary text-text-onBrand rounded-tr-sm'
              : 'bg-background-secondary text-text-primary rounded-tl-sm',
          )}
        >
          {children}
        </div>
        {timestamp ? (
          <span className="text-xs text-text-tertiary font-mono">{timestamp}</span>
        ) : null}
      </div>
    </div>
  );
}
