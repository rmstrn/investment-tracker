import { ToastProvider } from '@investment-tracker/ui';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const createMutate = vi.fn();
const updateMutate = vi.fn();

vi.mock('../../hooks/useCreateAccount', () => ({
  useCreateAccount: () => ({ mutateAsync: createMutate, isPending: false }),
}));
vi.mock('../../hooks/useUpdateAccount', () => ({
  useUpdateAccount: () => ({ mutateAsync: updateMutate, isPending: false }),
}));

import { AccountFormModal } from './account-form-modal';

function renderWithToast(mode: Parameters<typeof AccountFormModal>[0]['mode']) {
  return render(
    <ToastProvider>
      <AccountFormModal mode={mode} onClose={() => {}} />
    </ToastProvider>,
  );
}

describe('AccountFormModal — Add', () => {
  beforeEach(() => {
    createMutate.mockReset();
    updateMutate.mockReset();
    createMutate.mockResolvedValue({ id: 'new-id', display_name: 'My Account' });
  });

  it('submits with connection_type=manual + default base_currency=EUR + account_type=manual', () => {
    renderWithToast({ kind: 'add' });
    fireEvent.change(screen.getByPlaceholderText(/Interactive Brokers — main/i), {
      target: { value: 'My Account' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add account/i }));

    expect(createMutate).toHaveBeenCalledTimes(1);
    expect(createMutate).toHaveBeenCalledWith({
      connection_type: 'manual',
      display_name: 'My Account',
      account_type: 'manual',
      base_currency: 'EUR',
    });
  });

  it('includes broker_name only when the optional field is filled', () => {
    renderWithToast({ kind: 'add' });
    fireEvent.change(screen.getByPlaceholderText(/Interactive Brokers — main/i), {
      target: { value: 'My IB' },
    });
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Interactive Brokers$/i), {
      target: { value: 'Interactive Brokers' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add account/i }));

    expect(createMutate).toHaveBeenCalledWith(
      expect.objectContaining({ broker_name: 'Interactive Brokers' }),
    );
  });

  it('blocks submit when display_name is empty', () => {
    renderWithToast({ kind: 'add' });
    fireEvent.click(screen.getByRole('button', { name: /add account/i }));
    expect(createMutate).not.toHaveBeenCalled();
    expect(screen.getByText(/display name is required/i)).toBeInTheDocument();
  });
});

describe('AccountFormModal — Rename', () => {
  beforeEach(() => {
    createMutate.mockReset();
    updateMutate.mockReset();
    updateMutate.mockResolvedValue({ id: 'id-1', display_name: 'Renamed' });
  });

  it('PATCHes with display_name only (not connection_type / account_type)', () => {
    renderWithToast({
      kind: 'rename',
      account: {
        id: 'id-1',
        broker_name: 'manual',
        display_name: 'Original',
        account_type: 'manual',
        connection_type: 'manual',
        external_account_id: null,
        base_currency: 'EUR',
        last_synced_at: null,
        sync_status: 'ok',
        sync_error: null,
        is_included_in_portfolio: true,
        deleted_at: null,
        created_at: '2026-04-21T00:00:00Z',
        updated_at: '2026-04-21T00:00:00Z',
      },
    });

    const nameInput = screen.getByDisplayValue('Original');
    fireEvent.change(nameInput, { target: { value: 'Renamed' } });
    fireEvent.click(screen.getByRole('button', { name: /^save$/i }));

    expect(updateMutate).toHaveBeenCalledTimes(1);
    expect(updateMutate).toHaveBeenCalledWith({
      id: 'id-1',
      body: { display_name: 'Renamed' },
    });
  });
});
