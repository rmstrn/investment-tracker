import { Badge } from '@investment-tracker/ui';
import type { Route } from 'next';
import Link from 'next/link';
import type { Position } from '../../lib/api/positions';
import { formatCurrency } from '../../lib/format';
import { type PnlFormatted, formatPositionPnl } from './pnl-helpers';

export interface PositionsRowProps {
  position: Position;
}

export function PositionsRow({ position }: PositionsRowProps) {
  const display = position.values.display;
  const value = formatCurrency(display.total_value, display.currency);
  const avgCost = position.avg_cost ? formatCurrency(position.avg_cost, position.currency) : '—';
  const pnl = formatPositionPnl(position);
  const href = `/positions/${position.id}` as Route;

  return (
    <tr className="border-b border-border-subtle last:border-b-0 hover:bg-background-secondary">
      <td className="py-3 pl-4 pr-2">
        <Link
          href={href}
          className="inline-flex items-center gap-2 font-semibold text-text-primary hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-sm"
          aria-label={`Open ${position.symbol} position detail`}
        >
          <span className="font-mono">{position.symbol}</span>
          <Badge tone="neutral">{position.asset_type}</Badge>
        </Link>
      </td>
      <td className="px-2 py-3 text-right font-mono text-sm text-text-secondary tabular-nums">
        {position.quantity}
      </td>
      <td className="px-2 py-3 text-right font-mono text-sm text-text-secondary tabular-nums">
        {avgCost}
      </td>
      <td className="px-2 py-3 text-right font-mono text-sm font-medium text-text-primary tabular-nums">
        {value}
      </td>
      <td className="pl-2 pr-4 py-3 text-right">
        <PnlCell pnl={pnl} />
      </td>
    </tr>
  );
}

function PnlCell({ pnl }: { pnl: PnlFormatted }) {
  if (pnl.kind === 'absent') {
    return <span className="font-mono text-sm text-text-tertiary">—</span>;
  }
  const tone =
    pnl.kind === 'gain'
      ? 'text-portfolio-gain-default'
      : pnl.kind === 'loss'
        ? 'text-portfolio-loss-default'
        : 'text-text-secondary';
  return (
    <div className={`font-mono tabular-nums ${tone}`}>
      <div className="text-sm font-medium">{pnl.absoluteLabel}</div>
      <div className="text-xs">{pnl.percentLabel}</div>
    </div>
  );
}
