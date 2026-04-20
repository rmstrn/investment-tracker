'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { type AIConversation, createConversation } from '../lib/api/ai';
import { createBrowserApiClient } from '../lib/api/browser';
import { useRateLimit } from './useRateLimit';

export function useCreateConversation() {
  const { getToken } = useAuth();
  const { setSnapshot } = useRateLimit();
  const queryClient = useQueryClient();
  const apiClient = useMemo(
    () => createBrowserApiClient(() => getToken(), setSnapshot),
    [getToken, setSnapshot],
  );

  return useMutation<AIConversation, Error, { title?: string } | undefined>({
    mutationFn: async (vars) => {
      const title = vars?.title;
      return createConversation(apiClient, title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
    },
  });
}
