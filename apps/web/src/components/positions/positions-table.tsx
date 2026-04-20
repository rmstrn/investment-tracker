'use client';

import { AssetRow } from '@investment-tracker/ui';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import type { Position } from '../../lib/api/positions';
import { formatCurrency, formatShortAccountId } from '../../lib/format';
import { formatPositionPnl } from './pnl-helpers';
import { PositionsRow } from './positions-row';

export interface PositionsTableProps {
  positions: ReadonlyArray<Position>;
}

export function PositionsTable({ positions }: PositionsTableProps) {
  const router = useRouter();

  return (
    <>
      {/* Desktop — md and up */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-border-subtle bg-background-elevated">
        <table className="w-full text-sm">
          <thead className="border-b border-border-subtle bg-background-secondary text-xs uppercase tracking-wide text-text-tertiary">
            <tr>
              <th scope="col" className="py-2 pl-4 pr-2 text-left font-medium">
                Symbol
              </th>
              <th scope="col" className="px-2 py-2 text-right font-medium">
                Quantity
              </th>
              <th scope="col" className="px-2 py-2 text-right font-medium">
                Avg cost
              </th>
              <th scope="col" className="px-2 py-2 text-right font-medium">
                Value
              </th>
              <th scope="col" className="pl-2 pr-4 py-2 text-right font-medium">
                P&amp;L
              </th>
            </tr>
          </thead>
          <tbody>
            {positions.map((p) => (
              <PositionsRow key={p.id} position={p} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile — below md */}
      <div className="md:hidden space-y-1 rounded-lg border border-border-subtle bg-background-elevated p-2">
        {positions.map((p) => {
          const pnl = formatPositionPnl(p);
          const changePct =
            pnl.kind === 'absent' || pnl.kind === 'neutral' ? 0 : pnl.percentFraction * 100;
          return (
            <button
              key={p.id}
              type="button"
              className="block w-full rounded-md text-left transition hover:bg-background-secondary focus-visible:bg-background-secondary focus-visible:outline-none"
              onClick={() => router.push(`/positions/${p.id}` as Route)}
              aria-label={`Open ${p.symbol} position detail`}
            >
              <AssetRow
                symbol={p.symbol}
                name={formatShortAccountId(p.account_id)}
                quantity={p.quantity}
                price={p.avg_cost ? formatCurrency(p.avg_cost, p.currency) : '—'}
                value={formatCurrency(p.values.display.total_value, p.values.display.currency)}
                changePct={changePct}
              />
            </button>
          );
        })}
      </div>
    </>
  );
}
