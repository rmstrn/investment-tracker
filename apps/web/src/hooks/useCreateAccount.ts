'use client';

import { useAuth } from '@clerk/nextjs';
import { useToast } from '@investment-tracker/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { type Account, type AccountCreateRequest, createAccount } from '../lib/api/accounts';
import { createBrowserApiClient } from '../lib/api/browser';
import { mapAccountMutationError } from '../lib/api/errors';
import { useRateLimit } from './useRateLimit';

export function useCreateAccount() {
  const { getToken } = useAuth();
  const { setSnapshot } = useRateLimit();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const apiClient = useMemo(
    () => createBrowserApiClient(() => getToken(), setSnapshot),
    [getToken, setSnapshot],
  );

  return useMutation<Account, unknown, AccountCreateRequest>({
    mutationFn: (body) => createAccount(apiClient, body),
    onSuccess: (account) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast({ title: `Account "${account.display_name}" added`, tone: 'positive' });
    },
    onError: (err) => {
      toast({ title: mapAccountMutationError(err, 'add'), tone: 'negative' });
    },
  });
}
