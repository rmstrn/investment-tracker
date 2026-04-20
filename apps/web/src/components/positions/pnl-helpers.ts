import type { Position } from '../../lib/api/positions';
import { formatSignedCurrency } from '../../lib/format';

export type PnlFormatted =
  | { kind: 'absent' }
  | {
      kind: 'gain' | 'loss' | 'neutral';
      absoluteLabel: string;
      percentLabel: string;
      /** Signed percent as a decimal fraction (0.0173 = +1.73%). */
      percentFraction: number;
    };

/**
 * Render-ready P&L for a position. `pnl_absolute` and `pnl_percent` are both
 * optional in the OpenAPI contract; when `pnl_percent` is missing we derive
 * it from `pnl_absolute.display` and the cost basis (`total_value - abs`).
 */
export function formatPositionPnl(position: Position): PnlFormatted {
  const abs = position.pnl_absolute;
  if (!abs) return { kind: 'absent' };

  const display = position.values.display;
  const absValue = Number(abs.display);
  const totalValue = Number(display.total_value);
  let fraction = position.pnl_percent ?? null;
  if (fraction === null) {
    const basis = totalValue - absValue;
    fraction = basis !== 0 ? absValue / basis : 0;
  }

  const absoluteLabel = formatSignedCurrency(abs.display, display.currency);
  const pct = fraction * 100;
  const percentLabel = `(${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%)`;
  const kind: 'gain' | 'loss' | 'neutral' =
    absValue > 0 ? 'gain' : absValue < 0 ? 'loss' : 'neutral';

  return { kind, absoluteLabel, percentLabel, percentFraction: fraction };
}
