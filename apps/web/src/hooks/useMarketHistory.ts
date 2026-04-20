'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserApiClient } from '../lib/api/browser';
import { type MarketHistoryQuery, fetchMarketHistory } from '../lib/api/positions';

/**
 * Market history query. The OpenAPI response does NOT carry the `period`
 * back — it is part of the request, not the payload — so it lives in the
 * query key rather than being read off the response.
 */
export function useMarketHistory(query: MarketHistoryQuery) {
  const { getToken } = useAuth();
  const apiClient = useMemo(() => createBrowserApiClient(() => getToken()), [getToken]);

  return useQuery({
    queryKey: [
      'market-history',
      query.symbol,
      query.asset_type,
      query.period,
      query.interval ?? '1d',
    ] as const,
    queryFn: () => fetchMarketHistory(apiClient, query),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(query.symbol && query.asset_type && query.period),
  });
}
