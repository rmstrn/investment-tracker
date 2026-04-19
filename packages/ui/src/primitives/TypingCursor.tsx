import { type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

/**
 * TypingCursor — blinking caret that trails streamed AI text. Brief §5.2.
 */
export function TypingCursor({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block w-[2px] h-[1em] -mb-[0.1em] ml-[1px] align-middle bg-brand-500',
        'animate-[typing-cursor-blink_1s_steps(1)_infinite]',
        'motion-reduce:animate-none motion-reduce:opacity-60',
        className,
      )}
      {...props}
    />
  );
}

/**
 * ThinkingDots — staggered 3-dot indicator while AI is preparing first token.
 */
export function ThinkingDots({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      role="status"
      aria-label="AI is thinking"
      className={cn('inline-flex items-center gap-1', className)}
      {...props}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className="block h-1.5 w-1.5 rounded-full bg-brand-500 animate-[thinking-dot_1.2s_ease-in-out_infinite] motion-reduce:animate-none"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </span>
  );
}
