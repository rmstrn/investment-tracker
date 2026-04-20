'use client';

import { useAuth } from '@clerk/nextjs';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type StreamState, initialState, reduce } from '../lib/ai/chat-reducer';
import { ApiStreamError, TierLimitError, sendChatMessageStream } from '../lib/api/ai';
import { getBrowserApiBaseUrl } from '../lib/api/browser';
import { useRateLimit } from './useRateLimit';

export interface UseChatStreamOptions {
  conversationId: string;
  onTierLimit?: (error: TierLimitError) => void;
}

export interface UseChatStreamResult {
  state: StreamState;
  sendMessage: (text: string) => Promise<void>;
  cancel: () => void;
  reset: () => void;
  isStreaming: boolean;
}

export function useChatStream({
  conversationId,
  onTierLimit,
}: UseChatStreamOptions): UseChatStreamResult {
  const { getToken } = useAuth();
  const { setSnapshot } = useRateLimit();
  const queryClient = useQueryClient();
  const [state, setState] = useState<StreamState>(initialState);
  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const reset = useCallback(() => {
    cancel();
    setState(initialState);
  }, [cancel]);

  useEffect(() => {
    // Cancel any in-flight stream on unmount or conversation switch.
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      cancel();
      const controller = new AbortController();
      abortRef.current = controller;
      setState(initialState);

      try {
        const final = await runStream({
          text,
          conversationId,
          getToken,
          onRateLimit: setSnapshot,
          signal: controller.signal,
          onState: setState,
        });
        if (final.phase === 'done') {
          queryClient.invalidateQueries({ queryKey: ['ai-conversation', conversationId] });
          queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
        }
      } catch (err) {
        handleStreamError(err, onTierLimit, setState);
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [cancel, conversationId, getToken, queryClient, setSnapshot, onTierLimit],
  );

  const isStreaming = state.phase === 'streaming';
  return { state, sendMessage, cancel, reset, isStreaming };
}

interface RunStreamParams {
  text: string;
  conversationId: string;
  getToken: () => Promise<string | null>;
  onRateLimit: (snapshot: import('@investment-tracker/api-client').RateLimitSnapshot) => void;
  signal: AbortSignal;
  onState: (state: StreamState) => void;
}

async function runStream(params: RunStreamParams): Promise<StreamState> {
  const token = await params.getToken();
  const request = {
    conversation_id: params.conversationId,
    message: { content: [{ type: 'text' as const, text: params.text }] },
  };

  let current: StreamState = initialState;
  for await (const event of sendChatMessageStream({
    baseUrl: getBrowserApiBaseUrl(),
    token,
    request,
    signal: params.signal,
    onRateLimit: params.onRateLimit,
  })) {
    current = reduce(current, event);
    params.onState(current);
    if (current.phase === 'done' || current.phase === 'error') break;
  }
  return current;
}

function handleStreamError(
  err: unknown,
  onTierLimit: ((error: TierLimitError) => void) | undefined,
  setState: (state: StreamState) => void,
): void {
  if (err instanceof DOMException && err.name === 'AbortError') return;
  if (err instanceof TierLimitError) {
    onTierLimit?.(err);
    setState({ phase: 'error', message: null, error: err.view });
    return;
  }
  if (err instanceof ApiStreamError) {
    setState({ phase: 'error', message: null, error: err.view });
    return;
  }
  setState({
    phase: 'error',
    message: null,
    error: { code: 'NETWORK_ERROR', message: (err as Error).message || 'Network error' },
  });
}
