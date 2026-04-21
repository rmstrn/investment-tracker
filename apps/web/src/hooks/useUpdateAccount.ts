'use client';

import { useAuth } from '@clerk/nextjs';
import { useToast } from '@investment-tracker/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { type Account, type AccountUpdateRequest, updateAccount } from '../lib/api/accounts';
import { createBrowserApiClient } from '../lib/api/browser';
import { mapAccountMutationError } from '../lib/api/errors';
import { useRateLimit } from './useRateLimit';

export interface UpdateAccountVars {
  id: string;
  body: AccountUpdateRequest;
}

export function useUpdateAccount() {
  const { getToken } = useAuth();
  const { setSnapshot } = useRateLimit();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const apiClient = useMemo(
    () => createBrowserApiClient(() => getToken(), setSnapshot),
    [getToken, setSnapshot],
  );

  return useMutation<Account, unknown, UpdateAccountVars>({
    mutationFn: ({ id, body }) => updateAccount(apiClient, id, body),
    onSuccess: (account) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({ title: `Renamed to "${account.display_name}"`, tone: 'positive' });
    },
    onError: (err) => {
      toast({ title: mapAccountMutationError(err, 'rename'), tone: 'negative' });
    },
  });
}
