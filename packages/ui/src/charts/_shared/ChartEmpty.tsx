/**
 * Empty-state surface for charts (CHARTS_SPEC §3.9).
 *
 * Eyebrow line in Geist Mono uppercase, headline in `--text-1`, body in
 * `--text-2`. Uses Lucide `Activity` icon. The body is read from
 * `payload.meta.emptyHint` when present; otherwise a generic fallback.
 */

import { Activity } from 'lucide-react';
import type { ChartKind } from '../types';

interface ChartEmptyProps {
  kind: ChartKind;
  hint?: string;
}

const KIND_EYEBROW: Record<ChartKind, string> = {
  line: 'TIME SERIES',
  area: 'TIME SERIES',
  bar: 'BREAKDOWN',
  'stacked-bar': 'BREAKDOWN',
  donut: 'ALLOCATION',
  sparkline: 'TREND',
  calendar: 'EVENTS',
  treemap: 'POSITIONS',
  waterfall: 'CASH-FLOW',
  candlestick: 'PRICE',
};

export function ChartEmpty({ kind, hint }: ChartEmptyProps) {
  return (
    <div
      data-testid={`chart-empty-${kind}`}
      role="status"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border-subtle bg-background-elevated px-6 py-10 text-center"
    >
      <Activity aria-hidden="true" className="h-6 w-6 text-text-tertiary" />
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
        {KIND_EYEBROW[kind]}
      </p>
      <p className="text-sm font-semibold text-text-primary">No data to display</p>
      <p className="max-w-prose text-xs text-text-secondary">
        {hint ?? 'Data is not available for this period yet.'}
      </p>
    </div>
  );
}
