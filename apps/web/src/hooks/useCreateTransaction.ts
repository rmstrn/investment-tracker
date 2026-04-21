'use client';

import { useAuth } from '@clerk/nextjs';
import { useToast } from '@investment-tracker/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserApiClient } from '../lib/api/browser';
import { mapTransactionMutationError } from '../lib/api/errors';
import {
  type Transaction,
  type TransactionCreateRequest,
  createTransaction,
} from '../lib/api/transactions';
import { useRateLimit } from './useRateLimit';

export interface CreateTransactionVars {
  /** Position id whose transaction list should be re-fetched after success. */
  positionId?: string;
  body: TransactionCreateRequest;
}

export function useCreateTransaction() {
  const { getToken } = useAuth();
  const { setSnapshot } = useRateLimit();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const apiClient = useMemo(
    () => createBrowserApiClient(() => getToken(), setSnapshot),
    [getToken, setSnapshot],
  );

  return useMutation<Transaction, unknown, CreateTransactionVars>({
    mutationFn: ({ body }) => createTransaction(apiClient, body),
    onSuccess: (_tx, { positionId }) => {
      if (positionId) {
        queryClient.invalidateQueries({ queryKey: ['position-transactions', positionId] });
      }
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast({ title: 'Transaction added', tone: 'positive' });
    },
    onError: (err) => {
      toast({ title: mapTransactionMutationError(err, 'add'), tone: 'negative' });
    },
  });
}
