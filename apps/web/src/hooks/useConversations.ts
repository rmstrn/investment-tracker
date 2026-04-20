'use client';

import { useAuth } from '@clerk/nextjs';
import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { type ConversationsPage, fetchConversations } from '../lib/api/ai';
import { createBrowserApiClient } from '../lib/api/browser';
import { useRateLimit } from './useRateLimit';

type PageParam = string | undefined;

export interface UseConversationsOptions {
  /** Server-hydrated first page; must match the cursorless request. */
  initialPage?: ConversationsPage;
}

export function useConversations({ initialPage }: UseConversationsOptions = {}) {
  const { getToken } = useAuth();
  const { setSnapshot } = useRateLimit();
  const apiClient = useMemo(
    () => createBrowserApiClient(() => getToken(), setSnapshot),
    [getToken, setSnapshot],
  );

  return useInfiniteQuery<
    ConversationsPage,
    Error,
    InfiniteData<ConversationsPage, PageParam>,
    readonly ['ai-conversations'],
    PageParam
  >({
    queryKey: ['ai-conversations'] as const,
    queryFn: ({ pageParam }) => fetchConversations(apiClient, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor ?? undefined,
    initialData: initialPage ? { pages: [initialPage], pageParams: [undefined] } : undefined,
  });
}
