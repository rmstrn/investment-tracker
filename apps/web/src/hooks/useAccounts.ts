'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { type Account, fetchAccounts } from '../lib/api/accounts';
import { createBrowserApiClient } from '../lib/api/browser';
import { useRateLimit } from './useRateLimit';

export function useAccounts(initialData?: Account[]) {
  const { getToken } = useAuth();
  const { setSnapshot } = useRateLimit();
  const apiClient = useMemo(
    () => createBrowserApiClient(() => getToken(), setSnapshot),
    [getToken, setSnapshot],
  );

  return useQuery({
    queryKey: ['accounts'] as const,
    queryFn: () => fetchAccounts(apiClient),
    staleTime: 30_000,
    initialData,
  });
}
