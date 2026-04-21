import { ToastProvider } from '@investment-tracker/ui';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Account } from '../../../lib/api/accounts';

const accountsMock = vi.fn();

vi.mock('../../../hooks/useAccounts', () => ({
  useAccounts: (...args: unknown[]) => accountsMock(...args),
}));
vi.mock('../../../hooks/useCreateAccount', () => ({
  useCreateAccount: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));
vi.mock('../../../hooks/useUpdateAccount', () => ({
  useUpdateAccount: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));
vi.mock('../../../hooks/useDeleteAccount', () => ({
  useDeleteAccount: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

import { AccountsPageClient } from './accounts-page-client';

function makeAccount(overrides: Partial<Account> = {}): Account {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    broker_name: 'manual',
    display_name: 'IB main',
    account_type: 'manual',
    connection_type: 'manual',
    external_account_id: null,
    base_currency: 'EUR',
    last_synced_at: null,
    sync_status: 'ok',
    sync_error: null,
    is_included_in_portfolio: true,
    deleted_at: null,
    created_at: '2026-04-21T10:00:00Z',
    updated_at: '2026-04-21T10:00:00Z',
    ...overrides,
  };
}

function renderPage() {
  return render(
    <ToastProvider>
      <AccountsPageClient />
    </ToastProvider>,
  );
}

describe('AccountsPageClient', () => {
  beforeEach(() => {
    accountsMock.mockReset();
  });

  it('renders empty state CTA when the list is empty', () => {
    accountsMock.mockReturnValue({ data: [], isLoading: false, isError: false });
    renderPage();
    expect(screen.getByText(/no accounts yet/i)).toBeInTheDocument();
    // Header button + empty-state CTA both render "Add manual account".
    expect(screen.getAllByRole('button', { name: /add manual account/i })).toHaveLength(2);
  });

  it('renders a row per account when the list is non-empty', () => {
    accountsMock.mockReturnValue({
      data: [
        makeAccount({ display_name: 'IB main' }),
        makeAccount({ id: '2', display_name: 'Kraken' }),
      ],
      isLoading: false,
      isError: false,
    });
    renderPage();
    expect(screen.getByText('IB main')).toBeInTheDocument();
    expect(screen.getByText('Kraken')).toBeInTheDocument();
  });

  it('renders an error message when the query fails', () => {
    accountsMock.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    renderPage();
    expect(screen.getByText(/couldn't load accounts/i)).toBeInTheDocument();
  });
});
