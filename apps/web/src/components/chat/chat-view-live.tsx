'use client';

import { useToast } from '@investment-tracker/ui';
import { useCallback, useEffect, useState } from 'react';
import { useChatStream } from '../../hooks/useChatStream';
import { useConversation } from '../../hooks/useConversation';
import { useRateLimit } from '../../hooks/useRateLimit';
import type { TierLimitError } from '../../lib/api/ai';
import type { AIConversationDetail, AIMessage } from '../../lib/api/ai';
import { ChatInputBar } from './chat-input-bar';
import { ChatMessageList } from './chat-message-list';
import { EmptyConversationState } from './empty-conversation-state';

export interface ChatViewLiveProps {
  conversationId: string;
  initialData?: AIConversationDetail;
}

export function ChatViewLive({ conversationId, initialData }: ChatViewLiveProps) {
  const { toast } = useToast();
  const { snapshot } = useRateLimit();
  const [pendingUser, setPendingUser] = useState<AIMessage | null>(null);
  const [seed, setSeed] = useState<string | undefined>(undefined);

  const { data, isError } = useConversation({ id: conversationId, initialData });

  const { state, sendMessage, cancel, isStreaming } = useChatStream({
    conversationId,
    onTierLimit: (err: TierLimitError) => {
      toast({
        title: 'Daily AI limit reached',
        description: err.view.message || 'Upgrade to Plus for more messages.',
        tone: 'warning',
      });
    },
  });

  // Clear the optimistic user echo once the assistant turn lands in the
  // persisted history (useConversation refetches after message_stop).
  useEffect(() => {
    if (state.phase !== 'done' || !pendingUser) return;
    const haveInHistory = data?.messages.some((m) => m.id === pendingUser.id);
    if (haveInHistory) setPendingUser(null);
  }, [state.phase, pendingUser, data?.messages]);

  const onSend = useCallback(
    (text: string) => {
      const localId = `local-${Date.now()}`;
      setPendingUser({
        id: localId,
        conversation_id: conversationId,
        role: 'user',
        content: [{ type: 'text', text }],
        created_at: new Date().toISOString(),
        tokens_used: null,
      });
      setSeed(undefined);
      sendMessage(text);
    },
    [conversationId, sendMessage],
  );

  const onPickSuggested = useCallback((prompt: string) => {
    setSeed(prompt);
  }, []);

  if (isError) {
    return (
      <div className="p-6 text-sm text-state-negative-default">
        Unable to load this conversation right now.
      </div>
    );
  }

  const serverMessages = data?.messages ?? [];
  // API returns DESC (newest-first). Optimistic user message is oldest at
  // the chronological tail — prepend it to keep the DESC invariant for
  // ChatMessageList's reversal.
  const messages = pendingUser ? [pendingUser, ...serverMessages] : serverMessages;
  const isEmpty = messages.length === 0 && state.phase === 'idle';

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <EmptyConversationState onPick={onPickSuggested} disabled={isStreaming} />
        ) : (
          <div className="mx-auto max-w-[720px]">
            <ChatMessageList messages={messages} stream={state} />
          </div>
        )}
      </div>
      <div className="border-t border-border-subtle bg-background-page px-4 py-3">
        <div className="mx-auto max-w-[720px]">
          <ChatInputBar
            onSend={onSend}
            onCancel={cancel}
            streaming={isStreaming}
            rateLimit={snapshot}
            seed={seed}
          />
        </div>
      </div>
    </div>
  );
}
