'use client';

import {
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  EmptyState,
  type TransactionKind,
  TransactionRow,
} from '@investment-tracker/ui';
import { MoreVertical, Plus } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import {
  type PositionTransactionsPage,
  usePositionTransactions,
} from '../../hooks/usePositionTransactions';
import type { Transaction } from '../../lib/api/transactions';
import { formatCurrency, formatDateTime, formatSignedCurrency } from '../../lib/format';
import { DeleteTransactionConfirm } from './delete-transaction-confirm';
import { TransactionFormDialog, type TransactionFormMode } from './transaction-form-dialog';

const KIND_MAP: Partial<Record<Transaction['transaction_type'], TransactionKind>> = {
  buy: 'buy',
  sell: 'sell',
  dividend: 'dividend',
  transfer_in: 'deposit',
  transfer_out: 'withdrawal',
  fee: 'fee',
};

const TITLE_MAP: Record<Transaction['transaction_type'], string> = {
  buy: 'Bought',
  sell: 'Sold',
  dividend: 'Dividend',
  transfer_in: 'Transfer in',
  transfer_out: 'Transfer out',
  fee: 'Fee',
  split: 'Split',
};

export interface PositionTransactionsTabProps {
  positionId: string;
  /** Locked context for the Add/Edit dialog — symbol/asset_type/currency. */
  position: {
    symbol: string;
    asset_type: Transaction['asset_type'];
    currency: string;
  };
  initialPage?: PositionTransactionsPage;
}

export function PositionTransactionsTab({
  positionId,
  position,
  initialPage,
}: PositionTransactionsTabProps) {
  const query = usePositionTransactions({ id: positionId, initialPage });
  const [formMode, setFormMode] = useState<TransactionFormMode | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const addCta = (
    <Button size="sm" onClick={() => setFormMode({ kind: 'create' })}>
      <Plus size={14} aria-hidden="true" className="mr-1" />
      Add transaction
    </Button>
  );

  if (query.isError) {
    return (
      <div className="space-y-3">
        <Toolbar right={addCta} />
        <Card variant="elevated">
          <div className="text-sm text-state-negative-default">
            Unable to load transactions for this position.
          </div>
        </Card>
        <TransactionDialogs
          formMode={formMode}
          deleteTarget={deleteTarget}
          positionId={positionId}
          position={position}
          onCloseForm={() => setFormMode(null)}
          onCloseDelete={() => setDeleteTarget(null)}
        />
      </div>
    );
  }

  if (query.isLoading || !query.data) {
    return (
      <div className="space-y-3">
        <Toolbar right={addCta} />
        <TransactionsSkeleton />
      </div>
    );
  }

  const all = query.data.pages.flatMap((p) => p.data);
  const displayed = all.filter((t) => t.transaction_type !== 'split');
  const hiddenSplits = all.length - displayed.length;

  return (
    <div className="space-y-3">
      <Toolbar right={addCta} />
      {displayed.length === 0 && hiddenSplits === 0 ? (
        <Card variant="elevated">
          <EmptyState
            title="No transactions yet"
            description="Add a manual trade to seed this position, or sync a connected account."
          />
        </Card>
      ) : (
        <Card variant="elevated" className="p-0">
          <div className="divide-y divide-border-subtle">
            {displayed.map((t) => (
              <TransactionListRow
                key={t.id}
                transaction={t}
                onEdit={(tx) => setFormMode({ kind: 'edit', transaction: tx })}
                onDelete={(tx) => setDeleteTarget(tx)}
              />
            ))}
          </div>
          {hiddenSplits > 0 ? (
            <div className="border-t border-border-subtle px-4 py-2 text-xs text-text-tertiary">
              Stock splits hidden ({hiddenSplits}).
            </div>
          ) : null}
          {query.hasNextPage ? (
            <div className="border-t border-border-subtle p-3 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => query.fetchNextPage()}
                disabled={query.isFetchingNextPage}
              >
                {query.isFetchingNextPage ? 'Loading…' : 'Load more'}
              </Button>
            </div>
          ) : null}
        </Card>
      )}
      <TransactionDialogs
        formMode={formMode}
        deleteTarget={deleteTarget}
        positionId={positionId}
        position={position}
        onCloseForm={() => setFormMode(null)}
        onCloseDelete={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function Toolbar({ right }: { right: ReactNode }) {
  return <div className="flex items-center justify-end">{right}</div>;
}

function TransactionDialogs({
  formMode,
  deleteTarget,
  positionId,
  position,
  onCloseForm,
  onCloseDelete,
}: {
  formMode: TransactionFormMode | null;
  deleteTarget: Transaction | null;
  positionId: string;
  position: PositionTransactionsTabProps['position'];
  onCloseForm: () => void;
  onCloseDelete: () => void;
}) {
  return (
    <>
      <TransactionFormDialog
        mode={formMode}
        positionId={positionId}
        position={position}
        onClose={onCloseForm}
      />
      <DeleteTransactionConfirm
        transaction={deleteTarget}
        positionId={positionId}
        onClose={onCloseDelete}
      />
    </>
  );
}

interface TransactionListRowProps {
  transaction: Transaction;
  onEdit: (t: Transaction) => void;
  onDelete: (t: Transaction) => void;
}

function TransactionListRow({ transaction, onEdit, onDelete }: TransactionListRowProps) {
  const editable = transaction.source === 'manual';

  return (
    <div className="group flex items-center">
      <div className="min-w-0 flex-1">
        <TransactionRow
          kind={KIND_MAP[transaction.transaction_type] ?? 'buy'}
          symbol={transaction.symbol}
          title={formatTransactionTitle(transaction)}
          timestamp={formatDateTime(transaction.executed_at)}
          amount={formatTransactionAmount(transaction)}
          quantity={formatTransactionQuantity(transaction)}
          className="border-b-0"
        />
      </div>
      {editable ? (
        <div className="pr-2">
          <Dropdown>
            <DropdownTrigger
              aria-label="Transaction actions"
              className="rounded-md p-2 text-text-tertiary hover:bg-interactive-ghostHover"
            >
              <MoreVertical size={16} aria-hidden="true" />
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem onClick={() => onEdit(transaction)}>Edit</DropdownItem>
              <DropdownItem destructive onClick={() => onDelete(transaction)}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      ) : null}
    </div>
  );
}

function formatTransactionTitle(t: Transaction): string {
  const base = TITLE_MAP[t.transaction_type] ?? t.transaction_type;
  return t.symbol ? `${base} ${t.symbol}` : base;
}

function formatTransactionAmount(t: Transaction): string {
  if (t.transaction_type === 'fee') {
    const fee = t.fee ?? '0';
    return formatSignedCurrency(`-${fee.replace(/^-/, '')}`, t.currency);
  }
  if (t.transaction_type === 'dividend') {
    const price = t.price ?? '0';
    return formatSignedCurrency(price, t.currency);
  }
  const price = t.price ? Number(t.price) : 0;
  const qty = Number(t.quantity);
  const value = price * qty;
  if (!Number.isFinite(value) || value === 0) return '—';
  const signed = isOutflow(t.transaction_type) ? -Math.abs(value) : Math.abs(value);
  return formatSignedCurrency(String(signed), t.currency);
}

function isOutflow(type: Transaction['transaction_type']): boolean {
  return type === 'buy' || type === 'transfer_out' || type === 'fee';
}

function formatTransactionQuantity(t: Transaction): string | undefined {
  if (t.transaction_type === 'fee' || t.transaction_type === 'dividend') return undefined;
  const formattedPrice = t.price ? formatCurrency(t.price, t.currency) : null;
  return formattedPrice ? `${t.quantity} @ ${formattedPrice}` : `${t.quantity}`;
}

function TransactionsSkeleton() {
  return (
    <Card variant="elevated" aria-busy="true" className="p-0">
      <div className="divide-y divide-border-subtle">
        {Array.from({ length: 4 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows.
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <div className="h-9 w-9 rounded-full bg-background-secondary" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/2 rounded bg-background-secondary" />
              <div className="h-2 w-1/3 rounded bg-background-secondary" />
            </div>
            <div className="h-3 w-16 rounded bg-background-secondary" />
          </div>
        ))}
      </div>
    </Card>
  );
}
