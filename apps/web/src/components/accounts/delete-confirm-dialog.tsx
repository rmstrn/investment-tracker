'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@investment-tracker/ui';
import { useDeleteAccount } from '../../hooks/useDeleteAccount';
import type { Account } from '../../lib/api/accounts';

export interface DeleteConfirmDialogProps {
  account: Account | null;
  onClose: () => void;
}

export function DeleteConfirmDialog({ account, onClose }: DeleteConfirmDialogProps) {
  const mutation = useDeleteAccount();
  const open = account !== null;

  async function handleConfirm() {
    if (!account) return;
    const ok = await mutation
      .mutateAsync({ id: account.id, displayName: account.display_name })
      .then(() => true)
      .catch(() => false);
    if (ok) onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <DialogContent>
        <DialogTitle>
          Remove {account ? `"${account.display_name}"` : 'account'} from portfolio?
        </DialogTitle>
        <DialogDescription>
          Trades stay historical, portfolio recalculates without this account.
        </DialogDescription>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={mutation.isPending}>
            {mutation.isPending ? 'Removing…' : 'Remove'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
