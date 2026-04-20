'use client';

import { useAuth } from '@clerk/nextjs';
import type { components } from '@investment-tracker/shared-types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserApiClient } from '../lib/api/browser';

export type PortfolioSnapshot = components['schemas']['PortfolioSnapshot'];

export interface UsePortfolioOptions {
  /** Initial data from a Server Component fetch — hydrates the cache. */
  initialData?: PortfolioSnapshot | null;
  /** Optional override for `?display_currency=…`. */
  displayCurrency?: string;
}

export function usePortfolio(options: UsePortfolioOptions = {}) {
  const { initialData, displayCurrency } = options;
  const { getToken } = useAuth();

  const apiClient = useMemo(() => createBrowserApiClient(() => getToken()), [getToken]);

  return useQuery({
    queryKey: ['portfolio', displayCurrency ?? 'default'] as const,
    queryFn: async (): Promise<PortfolioSnapshot> => {
      const params = displayCurrency
        ? ({ query: { display_currency: displayCurrency } } as const)
        : undefined;
      const { data, error } = await apiClient.GET('/portfolio', params);
      if (error || !data) {
        throw new Error('Failed to load portfolio');
      }
      return data;
    },
    initialData: initialData ?? undefined,
  });
}
