'use client';

import { Badge, CountUpNumber } from '@investment-tracker/ui';
import type { Position } from '../../lib/api/positions';
import { formatCurrency } from '../../lib/format';
import { type PnlFormatted, formatPositionPnl } from './pnl-helpers';

export interface PositionHeaderProps {
  position: Position;
}

export function PositionHeader({ position }: PositionHeaderProps) {
  const display = position.values.display;
  const rawValue = Number(display.total_value);
  const value = Number.isFinite(rawValue) ? rawValue : 0;
  const pnl = formatPositionPnl(position);

  return (
    <header className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-3xl font-semibold tracking-tight text-text-primary">
          {position.symbol}
        </h1>
        <Badge tone="brand">{position.asset_type}</Badge>
      </div>
      <div className="flex flex-wrap items-baseline gap-3">
        <CountUpNumber
          value={value}
          from={value}
          duration={600}
          format={(n) => formatCurrency(String(n), display.currency)}
          className="font-mono text-4xl font-semibold text-text-primary"
          aria-label={`Current value ${formatCurrency(display.total_value, display.currency)}`}
        />
        <PnlPill pnl={pnl} />
      </div>
    </header>
  );
}

function PnlPill({ pnl }: { pnl: PnlFormatted }) {
  if (pnl.kind === 'absent') {
    return (
      <span className="rounded-full border border-border-subtle px-2.5 py-0.5 font-mono text-sm text-text-tertiary tabular-nums">
        —
      </span>
    );
  }
  const tone =
    pnl.kind === 'gain'
      ? 'bg-state-positive-subtle text-state-positive-default'
      : pnl.kind === 'loss'
        ? 'bg-state-negative-subtle text-state-negative-default'
        : 'bg-background-tertiary text-text-secondary';
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-sm font-medium tabular-nums ${tone}`}
    >
      <span>{pnl.absoluteLabel}</span>
      <span>{pnl.percentLabel}</span>
    </span>
  );
}
