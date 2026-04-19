import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type TransactionKind = 'buy' | 'sell' | 'dividend' | 'deposit' | 'withdrawal' | 'fee';

export interface TransactionRowProps extends HTMLAttributes<HTMLDivElement> {
  kind: TransactionKind;
  /** Asset symbol (optional — e.g. "AAPL" for buy/sell, omitted for cash flows) */
  symbol?: string;
  /** Human-friendly title, e.g. "Bought Apple" */
  title: string;
  /** When, already formatted, e.g. "Apr 12, 2026 · 10:24" */
  timestamp: string;
  /** Amount, signed & formatted, e.g. "-$2,450.00" or "+$120.00" */
  amount: string;
  /** Quantity (optional), e.g. "12.5 shares" */
  quantity?: string;
}

const kindTone: Record<TransactionKind, string> = {
  buy: 'text-text-primary',
  sell: 'text-text-primary',
  dividend: 'text-portfolio-gain-default',
  deposit: 'text-portfolio-gain-default',
  withdrawal: 'text-portfolio-loss-default',
  fee: 'text-portfolio-loss-default',
};

const kindIcon: Record<TransactionKind, typeof ArrowDownLeft> = {
  buy: ArrowDownLeft,
  sell: ArrowUpRight,
  dividend: ArrowDownLeft,
  deposit: ArrowDownLeft,
  withdrawal: ArrowUpRight,
  fee: ArrowUpRight,
};

export function TransactionRow({
  kind,
  symbol,
  title,
  timestamp,
  amount,
  quantity,
  className,
  ...props
}: TransactionRowProps) {
  const Icon = kindIcon[kind];
  return (
    <div
      className={cn(
        'flex items-center gap-4 border-b border-border-subtle px-3 py-3 last:border-b-0',
        className,
      )}
      {...props}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background-secondary">
        <Icon size={16} aria-hidden="true" className="text-text-secondary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-text-primary">{title}</span>
          {symbol ? <span className="font-mono text-xs text-text-tertiary">{symbol}</span> : null}
        </div>
        <div className="text-xs text-text-tertiary">{timestamp}</div>
      </div>
      <div className="text-right">
        <div className={cn('font-mono text-sm font-medium tabular-nums', kindTone[kind])}>
          {amount}
        </div>
        {quantity ? (
          <div className="font-mono text-xs text-text-tertiary tabular-nums">{quantity}</div>
        ) : null}
      </div>
    </div>
  );
}
