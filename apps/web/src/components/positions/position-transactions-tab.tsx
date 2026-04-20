'use client';

import {
  Button,
  Card,
  EmptyState,
  type TransactionKind,
  TransactionRow,
} from '@investment-tracker/ui';
import {
  type PositionTransactionsPage,
  usePositionTransactions,
} from '../../hooks/usePositionTransactions';
import type { Transaction } from '../../lib/api/positions';
import { formatCurrency, formatDateTime, formatSignedCurrency } from '../../lib/format';

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
  initialPage?: PositionTransactionsPage;
}

export function PositionTransactionsTab({ positionId, initialPage }: PositionTransactionsTabProps) {
  const query = usePositionTransactions({ id: positionId, initialPage });

  if (query.isError) {
    return (
      <Card variant="elevated">
        <div className="text-sm text-state-negative-default">
          Unable to load transactions for this position.
        </div>
      </Card>
    );
  }

  if (query.isLoading || !query.data) {
    return <TransactionsSkeleton />;
  }

  const all = query.data.pages.flatMap((p) => p.data);
  const displayed = all.filter((t) => t.transaction_type !== 'split');
  const hiddenSplits = all.length - displayed.length;

  if (displayed.length === 0 && hiddenSplits === 0) {
    return (
      <Card variant="elevated">
        <EmptyState
          title="No transactions yet"
          description="Once sync runs for this account, trades land here."
        />
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="p-0">
      <div className="divide-y divide-border-subtle">
        {displayed.map((t) => (
          <TransactionRow
            key={t.id}
            kind={KIND_MAP[t.transaction_type] ?? 'buy'}
            symbol={t.symbol}
            title={formatTransactionTitle(t)}
            timestamp={formatDateTime(t.executed_at)}
            amount={formatTransactionAmount(t)}
            quantity={formatTransactionQuantity(t)}
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
