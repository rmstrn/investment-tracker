import { ToastProvider } from '@investment-tracker/ui';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Transaction } from '../../lib/api/transactions';

const deleteMutate = vi.fn();

vi.mock('../../hooks/useDeleteTransaction', () => ({
  useDeleteTransaction: () => ({ mutateAsync: deleteMutate, isPending: false }),
}));

import { DeleteTransactionConfirm } from './delete-transaction-confirm';

const TX: Transaction = {
  id: 'tx-1',
  account_id: 'acc-1',
  symbol: 'AAPL',
  asset_type: 'stock',
  transaction_type: 'buy',
  quantity: '5',
  price: '150.00',
  currency: 'USD',
  fee: '0',
  executed_at: '2026-04-20T14:00:00Z',
  source: 'manual',
  source_details: null,
  fingerprint: 'fp',
  notes: null,
  created_at: '2026-04-20T14:00:00Z',
};

describe('DeleteTransactionConfirm', () => {
  beforeEach(() => {
    deleteMutate.mockReset();
    deleteMutate.mockResolvedValue(undefined);
  });

  it('calls deleteTransaction with the transaction id and positionId on confirm', () => {
    render(
      <ToastProvider>
        <DeleteTransactionConfirm transaction={TX} positionId="pos-1" onClose={() => {}} />
      </ToastProvider>,
    );

    expect(screen.getByText(/delete this buy of 5 AAPL/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    expect(deleteMutate).toHaveBeenCalledWith({ id: 'tx-1', positionId: 'pos-1' });
  });

  it('renders closed when transaction is null', () => {
    render(
      <ToastProvider>
        <DeleteTransactionConfirm transaction={null} positionId="pos-1" onClose={() => {}} />
      </ToastProvider>,
    );
    expect(screen.queryByText(/delete transaction/i)).toBeNull();
  });
});
