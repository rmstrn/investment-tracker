import { ToastProvider } from '@investment-tracker/ui';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Account } from '../../lib/api/accounts';
import type { Transaction } from '../../lib/api/transactions';

const accountsData: Account[] = [
  {
    id: 'acc-1',
    broker_name: 'manual',
    display_name: 'IB Main',
    account_type: 'manual',
    connection_type: 'manual',
    external_account_id: null,
    base_currency: 'USD',
    last_synced_at: null,
    sync_status: 'ok',
    sync_error: null,
    is_included_in_portfolio: true,
    deleted_at: null,
    created_at: '2026-04-20T10:00:00Z',
    updated_at: '2026-04-20T10:00:00Z',
  },
];

const createMutate = vi.fn();
const updateMutate = vi.fn();

vi.mock('../../hooks/useAccounts', () => ({
  useAccounts: () => ({ data: accountsData, isLoading: false }),
}));
vi.mock('../../hooks/useCreateTransaction', () => ({
  useCreateTransaction: () => ({ mutateAsync: createMutate, isPending: false }),
}));
vi.mock('../../hooks/useUpdateTransaction', () => ({
  useUpdateTransaction: () => ({ mutateAsync: updateMutate, isPending: false }),
}));

import { TransactionFormDialog } from './transaction-form-dialog';

const POSITION = { symbol: 'AAPL', asset_type: 'stock' as const, currency: 'USD' };

function renderForm(mode: Parameters<typeof TransactionFormDialog>[0]['mode']) {
  return render(
    <ToastProvider>
      <TransactionFormDialog
        mode={mode}
        positionId="pos-1"
        position={POSITION}
        onClose={() => {}}
      />
    </ToastProvider>,
  );
}

describe('TransactionFormDialog — create', () => {
  beforeEach(() => {
    createMutate.mockReset();
    updateMutate.mockReset();
    createMutate.mockResolvedValue({ id: 'tx-new' });
  });

  it('submits a buy with symbol/asset_type inherited from position and USD default', () => {
    renderForm({ kind: 'create' });

    fireEvent.change(screen.getByLabelText(/^quantity$/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/^price$/i), { target: { value: '150.25' } });
    fireEvent.click(screen.getByRole('button', { name: /add transaction/i }));

    expect(createMutate).toHaveBeenCalledTimes(1);
    const call = createMutate.mock.calls[0]?.[0];
    if (!call) throw new Error('createMutate was not called with arguments');
    expect(call.positionId).toBe('pos-1');
    expect(call.body).toMatchObject({
      account_id: 'acc-1',
      symbol: 'AAPL',
      asset_type: 'stock',
      transaction_type: 'buy',
      quantity: '5',
      price: '150.25',
      currency: 'USD',
    });
    expect(typeof call.body.executed_at).toBe('string');
    expect(call.body.executed_at.length).toBeGreaterThan(0);
  });

  it('blocks submit when quantity is zero or empty', () => {
    renderForm({ kind: 'create' });
    fireEvent.click(screen.getByRole('button', { name: /add transaction/i }));
    expect(createMutate).not.toHaveBeenCalled();
    expect(screen.getByText(/quantity must be greater than 0/i)).toBeInTheDocument();
  });
});

describe('TransactionFormDialog — edit', () => {
  beforeEach(() => {
    createMutate.mockReset();
    updateMutate.mockReset();
    updateMutate.mockResolvedValue({ id: 'tx-1' });
  });

  const existing: Transaction = {
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

  it('PATCHes only the changed quantity, omits unchanged locked fields', () => {
    renderForm({ kind: 'edit', transaction: existing });

    fireEvent.change(screen.getByLabelText(/^quantity$/i), { target: { value: '7' } });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(updateMutate).toHaveBeenCalledTimes(1);
    expect(updateMutate).toHaveBeenCalledWith({
      id: 'tx-1',
      positionId: 'pos-1',
      body: { quantity: '7' },
    });
  });
});
