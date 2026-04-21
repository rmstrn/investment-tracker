import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Account } from '../../lib/api/accounts';
import { AccountListItem } from './account-list-item';

function makeAccount(overrides: Partial<Account> = {}): Account {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    broker_name: 'manual',
    display_name: 'My Manual Account',
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

describe('AccountListItem', () => {
  it('renders display name, currency, account type badge and Manual sync badge', () => {
    render(<AccountListItem account={makeAccount()} onRename={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('My Manual Account')).toBeInTheDocument();
    expect(screen.getByText('manual')).toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
    expect(screen.getByText('Manual')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /actions for my manual account/i }),
    ).toBeInTheDocument();
  });

  it('shows broker_name when it is not the literal "manual" placeholder', () => {
    render(
      <AccountListItem
        account={makeAccount({ broker_name: 'Interactive Brokers' })}
        onRename={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('Interactive Brokers')).toBeInTheDocument();
  });

  it('hides broker_name when it is the placeholder "manual"', () => {
    render(
      <AccountListItem
        account={makeAccount({ broker_name: 'manual' })}
        onRename={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(
      screen.queryByText('manual', { selector: 'span:not([class*="rounded-full"])' }),
    ).toBeNull();
  });
});
