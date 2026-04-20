'use client';

import { useAuth } from '@clerk/nextjs';
import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserApiClient } from '../lib/api/browser';
import { type PositionTransactionsPage, fetchPositionTransactions } from '../lib/api/positions';

export type { PositionTransactionsPage } from '../lib/api/positions';

export interface UsePositionTransactionsOptions {
  id: string;
  /** Server-hydrated first page; matches the cursorless request. */
  initialPage?: PositionTransactionsPage;
}

type PageParam = string | undefined;

export function usePositionTransactions({ id, initialPage }: UsePositionTransactionsOptions) {
  const { getToken } = useAuth();
  const apiClient = useMemo(() => createBrowserApiClient(() => getToken()), [getToken]);

  return useInfiniteQuery<
    PositionTransactionsPage,
    Error,
    InfiniteData<PositionTransactionsPage, PageParam>,
    readonly ['position-transactions', string],
    PageParam
  >({
    queryKey: ['position-transactions', id] as const,
    queryFn: ({ pageParam }) => fetchPositionTransactions(apiClient, id, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor ?? undefined,
    initialData: initialPage ? { pages: [initialPage], pageParams: [undefined] } : undefined,
  });
}
