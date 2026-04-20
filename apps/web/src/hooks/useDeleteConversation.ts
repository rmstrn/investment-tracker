'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { deleteConversation } from '../lib/api/ai';
import { createBrowserApiClient } from '../lib/api/browser';
import { useRateLimit } from './useRateLimit';

export function useDeleteConversation() {
  const { getToken } = useAuth();
  const { setSnapshot } = useRateLimit();
  const queryClient = useQueryClient();
  const apiClient = useMemo(
    () => createBrowserApiClient(() => getToken(), setSnapshot),
    [getToken, setSnapshot],
  );

  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => deleteConversation(apiClient, id),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
      queryClient.removeQueries({ queryKey: ['ai-conversation', id] });
    },
  });
}
