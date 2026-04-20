'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { type AIConversationDetail, fetchConversationDetail } from '../lib/api/ai';
import { createBrowserApiClient } from '../lib/api/browser';
import { useRateLimit } from './useRateLimit';

export interface UseConversationOptions {
  id: string;
  initialData?: AIConversationDetail;
}

export function useConversation({ id, initialData }: UseConversationOptions) {
  const { getToken } = useAuth();
  const { setSnapshot } = useRateLimit();
  const apiClient = useMemo(
    () => createBrowserApiClient(() => getToken(), setSnapshot),
    [getToken, setSnapshot],
  );

  return useQuery({
    queryKey: ['ai-conversation', id] as const,
    queryFn: () => fetchConversationDetail(apiClient, id),
    initialData,
  });
}
