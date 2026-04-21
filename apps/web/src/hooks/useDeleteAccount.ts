'use client';

import { useAuth } from '@clerk/nextjs';
import { useToast } from '@investment-tracker/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { deleteAccount } from '../lib/api/accounts';
import { createBrowserApiClient } from '../lib/api/browser';
import { mapAccountMutationError } from '../lib/api/errors';
import { useRateLimit } from './useRateLimit';

export interface DeleteAccountVars {
  id: string;
  displayName: string;
}

export function useDeleteAccount() {
  const { getToken } = useAuth();
  const { setSnapshot } = useRateLimit();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const apiClient = useMemo(
    () => createBrowserApiClient(() => getToken(), setSnapshot),
    [getToken, setSnapshot],
  );

  return useMutation<void, unknown, DeleteAccountVars>({
    mutationFn: ({ id }) => deleteAccount(apiClient, id),
    onSuccess: (_data, { displayName }) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast({ title: `"${displayName}" removed from portfolio`, tone: 'positive' });
    },
    onError: (err) => {
      toast({ title: mapAccountMutationError(err, 'remove'), tone: 'negative' });
    },
  });
}
