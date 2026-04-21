'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@investment-tracker/ui';
import { useDeleteTransaction } from '../../hooks/useDeleteTransaction';
import type { Transaction } from '../../lib/api/transactions';

export interface DeleteTransactionConfirmProps {
  transaction: Transaction | null;
  positionId: string;
  onClose: () => void;
}

const TYPE_VERB: Partial<Record<Transaction['transaction_type'], string>> = {
  buy: 'buy',
  sell: 'sell',
  dividend: 'dividend',
};

export function DeleteTransactionConfirm({
  transaction,
  positionId,
  onClose,
}: DeleteTransactionConfirmProps) {
  const mutation = useDeleteTransaction();
  const open = transaction !== null;

  async function handleConfirm() {
    if (!transaction) return;
    const ok = await mutation
      .mutateAsync({ id: transaction.id, positionId })
      .then(() => true)
      .catch(() => false);
    if (ok) onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <DialogContent>
        <DialogTitle>Delete transaction?</DialogTitle>
        <DialogDescription>{describe(transaction)}</DialogDescription>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={mutation.isPending}>
            {mutation.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function describe(t: Transaction | null): string {
  if (!t) return '';
  const verb = TYPE_VERB[t.transaction_type] ?? t.transaction_type;
  return `Delete this ${verb} of ${t.quantity} ${t.symbol}? Portfolio value will update.`;
}
