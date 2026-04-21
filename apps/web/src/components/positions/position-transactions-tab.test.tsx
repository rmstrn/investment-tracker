import { ToastProvider } from '@investment-tracker/ui';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Transaction } from '../../lib/api/transactions';

function makeTx(overrides: Partial<Transaction> = {}): Transaction {
  return {
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
    ...overrides,
  };
}

const mockQueryResult = {
  data: { pages: [], pageParams: [undefined] } as {
    pages: Array<{ data: Transaction[]; meta: { next_cursor: string | null } }>;
    pageParams: Array<string | undefined>;
  },
  isError: false,
  isLoading: false,
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: vi.fn(),
};

vi.mock('../../hooks/usePositionTransactions', () => ({
  usePositionTransactions: () => mockQueryResult,
}));

vi.mock('../../hooks/useAccounts', () => ({
  useAccounts: () => ({ data: [], isLoading: false }),
}));
vi.mock('../../hooks/useCreateTransaction', () => ({
  useCreateTransaction: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));
vi.mock('../../hooks/useUpdateTransaction', () => ({
  useUpdateTransaction: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));
vi.mock('../../hooks/useDeleteTransaction', () => ({
  useDeleteTransaction: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

import { PositionTransactionsTab } from './position-transactions-tab';

function renderTab() {
  return render(
    <ToastProvider>
      <PositionTransactionsTab
        positionId="pos-1"
        position={{ symbol: 'AAPL', asset_type: 'stock', currency: 'USD' }}
      />
    </ToastProvider>,
  );
}

describe('PositionTransactionsTab — kebab visibility by source', () => {
  beforeEach(() => {
    mockQueryResult.data = { pages: [], pageParams: [undefined] };
  });

  it('renders an Actions kebab for manual rows', () => {
    mockQueryResult.data = {
      pages: [{ data: [makeTx({ id: 'tx-m', source: 'manual' })], meta: { next_cursor: null } }],
      pageParams: [undefined],
    };
    renderTab();
    expect(screen.getByRole('button', { name: /transaction actions/i })).toBeInTheDocument();
  });

  it('does not render a kebab for aggregator-sourced rows', () => {
    mockQueryResult.data = {
      pages: [
        { data: [makeTx({ id: 'tx-a', source: 'aggregator' })], meta: { next_cursor: null } },
      ],
      pageParams: [undefined],
    };
    renderTab();
    expect(screen.queryByRole('button', { name: /transaction actions/i })).toBeNull();
  });

  it('always shows the Add transaction CTA in the toolbar', () => {
    renderTab();
    expect(screen.getByRole('button', { name: /add transaction/i })).toBeInTheDocument();
  });
});
