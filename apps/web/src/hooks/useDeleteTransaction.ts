'use client';

import { useAuth } from '@clerk/nextjs';
import { useToast } from '@investment-tracker/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserApiClient } from '../lib/api/browser';
import { mapTransactionMutationError } from '../lib/api/errors';
import { deleteTransaction } from '../lib/api/transactions';
import { useRateLimit } from './useRateLimit';

export interface DeleteTransactionVars {
  id: string;
  /** Position id whose transaction list should be re-fetched after success. */
  positionId?: string;
}

export function useDeleteTransaction() {
  const { getToken } = useAuth();
  const { setSnapshot } = useRateLimit();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const apiClient = useMemo(
    () => createBrowserApiClient(() => getToken(), setSnapshot),
    [getToken, setSnapshot],
  );

  return useMutation<void, unknown, DeleteTransactionVars>({
    mutationFn: ({ id }) => deleteTransaction(apiClient, id),
    onSuccess: (_void, { positionId }) => {
      if (positionId) {
        queryClient.invalidateQueries({ queryKey: ['position-transactions', positionId] });
      }
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast({ title: 'Transaction deleted', tone: 'positive' });
    },
    onError: (err) => {
      toast({ title: mapTransactionMutationError(err, 'delete'), tone: 'negative' });
    },
  });
}
