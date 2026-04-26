'use client';

import type { RateLimitSnapshot } from '@investment-tracker/api-client';
import { ChatInputPill, UsageIndicator } from '@investment-tracker/ui';
import { Square } from 'lucide-react';
import { type KeyboardEvent, useEffect, useState } from 'react';

export interface ChatInputBarProps {
  onSend: (text: string) => void;
  onCancel: () => void;
  streaming: boolean;
  disabled?: boolean;
  rateLimit?: RateLimitSnapshot | null;
  /** Seed the input with a suggested prompt (e.g. from empty state). */
  seed?: string;
}

/**
 * ChatInputBar — user-facing pill + cancel + usage indicator. When
 * `streaming` is true, a Stop button replaces submit behaviour (the
 * ChatInputPill's send arrow is disabled by `sending` — we additionally
 * surface an explicit Stop control outside the pill).
 */
export function ChatInputBar({
  onSend,
  onCancel,
  streaming,
  disabled,
  rateLimit,
  seed,
}: ChatInputBarProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (seed) setValue(seed);
  }, [seed]);

  const handleSubmit = (next: string) => {
    const trimmed = next.trim();
    if (!trimmed || streaming || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape' && streaming) {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div className="space-y-2">
      {rateLimit ? (
        <UsageIndicator
          used={Math.max(0, rateLimit.limit - rateLimit.remaining)}
          limit={rateLimit.limit}
          unit="messages"
          period="today"
        />
      ) : null}
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <ChatInputPill
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            sending={streaming || disabled}
            placeholder={streaming ? 'Provedo is responding…' : 'Ask your portfolio…'}
          />
        </div>
        {streaming ? (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Stop generating"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border-default bg-background-elevated px-4 text-sm font-medium text-text-primary hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Square size={14} aria-hidden="true" />
            Stop
          </button>
        ) : null}
      </div>
    </div>
  );
}
