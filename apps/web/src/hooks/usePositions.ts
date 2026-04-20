'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserApiClient } from '../lib/api/browser';
import { type Position, type PositionsListQuery, fetchPositions } from '../lib/api/positions';

export interface UsePositionsOptions {
  query?: PositionsListQuery;
  /** Server-hydrated list — only supplied when the query matches the SSR default. */
  initialData?: Position[];
}

export function usePositions(options: UsePositionsOptions = {}) {
  const { query, initialData } = options;
  const { getToken } = useAuth();
  const apiClient = useMemo(() => createBrowserApiClient(() => getToken()), [getToken]);

  return useQuery({
    queryKey: ['positions', query ?? {}] as const,
    queryFn: () => fetchPositions(apiClient, query),
    initialData,
  });
}
