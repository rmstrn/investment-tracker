'use client';

import { Button, EmptyState } from '@investment-tracker/ui';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import {
  AccountFormModal,
  type AccountFormMode,
} from '../../../components/accounts/account-form-modal';
import { AccountListItem } from '../../../components/accounts/account-list-item';
import { DeleteConfirmDialog } from '../../../components/accounts/delete-confirm-dialog';
import { useAccounts } from '../../../hooks/useAccounts';
import type { Account } from '../../../lib/api/accounts';

export interface AccountsPageClientProps {
  initialData?: Account[];
}

export function AccountsPageClient({ initialData }: AccountsPageClientProps) {
  const { data, isLoading, isError } = useAccounts(initialData);
  const [formMode, setFormMode] = useState<AccountFormMode | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null);

  const accounts = [...(data ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <>
      <header className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Accounts</h1>
          <p className="text-sm text-text-secondary">
            Manually tracked accounts. Broker connections arrive in a later slice.
          </p>
        </div>
        <Button onClick={() => setFormMode({ kind: 'add' })}>
          <Plus size={16} aria-hidden="true" />
          Add manual account
        </Button>
      </header>

      {isLoading && !initialData ? (
        <p className="text-sm text-text-tertiary">Loading accounts…</p>
      ) : isError ? (
        <p className="text-sm text-state-negative-default">
          Couldn't load accounts. Refresh to retry.
        </p>
      ) : accounts.length === 0 ? (
        <EmptyState
          title="No accounts yet"
          description="Add a manual account to start tracking trades and see your portfolio."
          primaryAction={
            <Button onClick={() => setFormMode({ kind: 'add' })}>
              <Plus size={16} aria-hidden="true" />
              Add manual account
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {accounts.map((account) => (
            <li key={account.id}>
              <AccountListItem
                account={account}
                onRename={(a) => setFormMode({ kind: 'rename', account: a })}
                onDelete={(a) => setDeleteTarget(a)}
              />
            </li>
          ))}
        </ul>
      )}

      <AccountFormModal mode={formMode} onClose={() => setFormMode(null)} />
      <DeleteConfirmDialog account={deleteTarget} onClose={() => setDeleteTarget(null)} />
    </>
  );
}
