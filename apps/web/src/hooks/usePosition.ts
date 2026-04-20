'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserApiClient } from '../lib/api/browser';
import { type Position, fetchPosition } from '../lib/api/positions';

export interface UsePositionOptions {
  id: string;
  displayCurrency?: string;
  initialData?: Position;
}

export function usePosition({ id, displayCurrency, initialData }: UsePositionOptions) {
  const { getToken } = useAuth();
  const apiClient = useMemo(() => createBrowserApiClient(() => getToken()), [getToken]);

  return useQuery({
    queryKey: ['position', id, displayCurrency ?? 'default'] as const,
    queryFn: () => fetchPosition(apiClient, id, displayCurrency),
    initialData,
  });
}
