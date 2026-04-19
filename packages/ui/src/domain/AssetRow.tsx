import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { Avatar } from '../primitives/Avatar';

export interface AssetRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Ticker, e.g. "AAPL" */
  symbol: string;
  /** Company / coin name, e.g. "Apple Inc." */
  name: string;
  /** Units held, formatted, e.g. "12.5" */
  quantity: string;
  /** Current price, formatted, e.g. "$189.34" */
  price: string;
  /** Market value, formatted, e.g. "$2,366.75" */
  value: string;
  /** Change percent */
  changePct: number;
  /** Optional icon URL */
  iconSrc?: string;
}

export function AssetRow({
  symbol,
  name,
  quantity,
  price,
  value,
  changePct,
  iconSrc,
  className,
  ...props
}: AssetRowProps) {
  const positive = changePct >= 0;
  const pct = `${positive ? '+' : ''}${changePct.toFixed(2)}%`;
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-lg px-3 py-3 transition-colors',
        'hover:bg-background-secondary focus-within:bg-background-secondary',
        className,
      )}
      {...props}
    >
      <Avatar size="md" src={iconSrc} fallback={symbol} alt={`${name} icon`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary">{symbol}</span>
          <span className="truncate text-sm text-text-tertiary">{name}</span>
        </div>
        <div className="mt-0.5 font-mono text-xs text-text-tertiary tabular-nums">
          {quantity} · {price}
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono text-sm font-medium text-text-primary tabular-nums">{value}</div>
        <div
          className={cn(
            'font-mono text-xs tabular-nums',
            positive ? 'text-portfolio-gain-default' : 'text-portfolio-loss-default',
          )}
        >
          {pct}
        </div>
      </div>
    </div>
  );
}
