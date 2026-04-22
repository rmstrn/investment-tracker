'use client';

import { useAuth } from '@clerk/nextjs';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserApiClient } from '../lib/api/browser';
import {
  type Insight,
  type InsightSeverity,
  type InsightType,
  fetchInsightsPage,
} from '../lib/api/insights';
import { useRateLimit } from './useRateLimit';

export type { Insight, InsightSeverity, InsightType };

export interface UseInsightsOptions {
  includeDismissed?: boolean;
  severity?: InsightSeverity[];
  insightType?: InsightType;
}

export function useInsights(options: UseInsightsOptions = {}) {
  const { includeDismissed = false, severity, insightType } = options;
  const { getToken } = useAuth();
  const { setSnapshot } = useRateLimit();

  const apiClient = useMemo(
    () => createBrowserApiClient(() => getToken(), setSnapshot),
    [getToken, setSnapshot],
  );

  return useInfiniteQuery({
    queryKey: ['insights', { includeDismissed, severity, insightType }] as const,
    queryFn: ({ pageParam }) =>
      fetchInsightsPage(apiClient, {
        includeDismissed,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor ?? undefined,
  });
}
