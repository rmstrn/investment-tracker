'use client';

import { ArrowUp } from 'lucide-react';
import {
  type KeyboardEvent,
  type MutableRefObject,
  type TextareaHTMLAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { cn } from '../lib/cn';

export interface ChatInputPillProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onSubmit'> {
  onSubmit?: (value: string) => void;
  placeholder?: string;
  /** Disable send (e.g. while streaming). */
  sending?: boolean;
  /** Max visible lines before internal scroll kicks in. Default 8. */
  maxLines?: number;
}

/**
 * ChatInputPill — radius-full autosize textarea with ↑ send. Brief §5.2.
 * Enter = send; Shift+Enter = newline.
 */
export const ChatInputPill = forwardRef<HTMLTextAreaElement, ChatInputPillProps>(
  (
    {
      className,
      placeholder = 'Ask your portfolio…',
      sending,
      maxLines = 8,
      value,
      onChange,
      onSubmit,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLTextAreaElement>(null);
    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        (innerRef as MutableRefObject<HTMLTextAreaElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as MutableRefObject<HTMLTextAreaElement | null>).current = node;
      },
      [ref],
    );

    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      el.style.height = 'auto';
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
      const maxH = lineHeight * maxLines;
      el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
      el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden';
    }, [value, maxLines]);

    const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const v = (value as string | undefined) ?? innerRef.current?.value ?? '';
        if (v.trim() && !sending) onSubmit?.(v);
      }
    };

    const v = (value as string | undefined) ?? '';
    const canSend = v.trim().length > 0 && !sending;

    return (
      <div
        className={cn(
          'flex w-full items-end gap-2 rounded-full border border-border-subtle bg-background-elevated',
          'px-3 py-2 shadow-xs',
          'focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent',
          'transition-colors duration-fast ease-out',
          className,
        )}
      >
        <textarea
          ref={setRefs}
          rows={1}
          value={value}
          onChange={onChange}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className={cn(
            'block w-full flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-base',
            'text-text-primary placeholder:text-text-muted',
            'focus:outline-none leading-snug',
          )}
          {...props}
        />
        <button
          type="button"
          aria-label="Send message"
          disabled={!canSend}
          onClick={() => {
            const val = (value as string | undefined) ?? innerRef.current?.value ?? '';
            if (val.trim()) onSubmit?.(val);
          }}
          className={cn(
            'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-fast ease-out',
            canSend
              ? 'bg-interactive-primary text-text-onBrand hover:bg-interactive-primaryHover active:scale-95'
              : 'bg-background-tertiary text-text-muted',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary',
          )}
        >
          <ArrowUp size={16} aria-hidden="true" />
        </button>
      </div>
    );
  },
);
ChatInputPill.displayName = 'ChatInputPill';
