'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import type { StreamState } from '../../lib/ai/chat-reducer';
import type { AIMessage } from '../../lib/api/ai';
import { ChatMessageItem } from './chat-message-item';
import { StreamingMessageView } from './streaming-message-view';

export interface ChatMessageListProps {
  messages: AIMessage[];
  stream: StreamState;
  /** Rendered above the message list when there are older pages to load. */
  loadOlderSlot?: ReactNode;
}

/**
 * Scrollable message column. API returns messages newest-first (DESC)
 * per `ai_conversations.sql:34-39`; we reverse once for oldest-top
 * rendering. Streaming message pins to the bottom.
 */
export function ChatMessageList({ messages, stream, loadOlderSlot }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const ordered = [...messages].reverse();

  useEffect(() => {
    // Reference `messages.length` and `stream.phase` so biome's exhaustive
    // deps rule sees the trigger without us listing unused references.
    void messages.length;
    void stream.phase;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, stream.phase]);

  return (
    <div className="flex flex-col gap-4 px-1 py-4">
      {loadOlderSlot ? <div className="text-center">{loadOlderSlot}</div> : null}
      {ordered.map((msg) => (
        <ChatMessageItem key={msg.id} message={msg} />
      ))}
      {stream.phase === 'streaming' ? (
        <StreamingMessageView message={stream.message} streaming />
      ) : null}
      {stream.phase === 'error' && stream.message ? (
        <StreamingMessageView message={stream.message} streaming={false} />
      ) : null}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  );
}
