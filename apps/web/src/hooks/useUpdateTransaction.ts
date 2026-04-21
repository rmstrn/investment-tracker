'use client';

import { useAuth } from '@clerk/nextjs';
import { useToast } from '@investment-tracker/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserApiClient } from '../lib/api/browser';
import { mapTransactionMutationError } from '../lib/api/errors';
import {
  type Transaction,
  type TransactionUpdateRequest,
  updateTransaction,
} from '../lib/api/transactions';
import { useRateLimit } from './useRateLimit';

export interface UpdateTransactionVars {
  id: string;
  /** Position id whose transaction list should be re-fetched after success. */
  positionId?: string;
  body: TransactionUpdateRequest;
}

export function useUpdateTransaction() {
  const { getToken } = useAuth();
  const { setSnapshot } = useRateLimit();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const apiClient = useMemo(
    () => createBrowserApiClient(() => getToken(), setSnapshot),
    [getToken, setSnapshot],
  );

  return useMutation<Transaction, unknown, UpdateTransactionVars>({
    mutationFn: ({ id, body }) => updateTransaction(apiClient, id, body),
    onSuccess: (_tx, { positionId }) => {
      if (positionId) {
        queryClient.invalidateQueries({ queryKey: ['position-transactions', positionId] });
      }
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast({ title: 'Transaction updated', tone: 'positive' });
    },
    onError: (err) => {
      toast({ title: mapTransactionMutationError(err, 'update'), tone: 'negative' });
    },
  });
}
