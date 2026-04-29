'use client';

/**
 * Treemap — native Recharts `<Treemap>` with custom tile renderer.
 *
 * Reads `TreemapPayload` from `@investment-tracker/shared-types/charts`.
 * Δ1 sum-to-100 invariant lives at the envelope level (Zod). T-8 cross-
 * currency basis is on the payload (`dailyChangeBasis`); the renderer
 * surfaces it in the mandatory FINRA caption below the chart.
 */

import type { TreemapPayload } from '@investment-tracker/shared-types/charts';
import { useCallback, useId, useRef, useState } from 'react';
import { Treemap as ReTreemap, ResponsiveContainer } from 'recharts';
import { CHART_FOCUS_RING_CLASS } from './_shared/a11y';
import { ChartDataTable } from './_shared/ChartDataTable';
import { useChartKeyboardNav } from './_shared/useChartKeyboardNav';
import { CHART_TOKENS, colorForTreemapChange, inkForTreemapChange, labelOnTile } from './tokens';

export interface TreemapProps {
  payload: TreemapPayload;
  height?: number;
  className?: string;
}

interface TileContentProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  ticker?: string;
  weightPct?: number;
  dailyChangePct?: number;
  isOther?: boolean;
  itemCount?: number;
  basis?: 'local' | 'base';
}

function TileContent(props: TileContentProps) {
  const { x = 0, y = 0, width = 0, height = 0, dailyChangePct, isOther, ticker, itemCount } = props;
  const fill = colorForTreemapChange(dailyChangePct);
  // Conditional ink — WCAG 1.4.3 AA fix for tile labels at 10-11px.
  // Positive tiles (deep green) pair with white; negative + neutral tiles
  // (mid-luminance) pair with near-black to clear ≥4.5:1 in both themes.
  const ink = inkForTreemapChange(dailyChangePct);
  const label = isOther ? `OTHER · ${itemCount ?? 0} items` : (ticker ?? '');
  const showLabel = labelOnTile({ width, height });

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="var(--color-background-primary, #fff)"
        strokeWidth={1}
      />
      {showLabel ? (
        <text
          x={x + 8}
          y={y + 18}
          fill={ink}
          fontSize={11}
          fontFamily="var(--font-mono)"
          style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}
        >
          {label}
        </text>
      ) : null}
      {showLabel && typeof dailyChangePct === 'number' ? (
        <text
          x={x + 8}
          y={y + 34}
          fill={ink}
          fontSize={10}
          fontFamily="var(--font-mono)"
          style={{ opacity: 0.85 }}
        >
          {dailyChangePct >= 0 ? '+' : ''}
          {dailyChangePct.toFixed(2)}%
        </text>
      ) : null}
    </g>
  );
}

const FINRA_CAPTION =
  'Tile size = % of portfolio; color = today’s price change. Treemap describes proportions; concentration thresholds are factual conventions per FINRA, not Provedo recommendations.';

export function Treemap({ payload, height = 320, className }: TreemapProps) {
  const dataTableId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const onIndexChange = useCallback((next: number) => setActiveIndex(next), []);
  useChartKeyboardNav(containerRef, payload.tiles.length, onIndexChange);

  const data = payload.tiles.map((t) => ({
    name: t.isOther ? `OTHER · ${t.itemCount ?? 0} items` : t.ticker,
    size: t.weightPct,
    ticker: t.ticker,
    weightPct: t.weightPct,
    dailyChangePct: t.dailyChangePct,
    isOther: t.isOther,
    itemCount: t.itemCount,
    basis: payload.dailyChangeBasis,
  }));

  const basisCaption =
    payload.dailyChangeBasis === 'local'
      ? 'Color reflects price change in local currency.'
      : `Color reflects price change in your base currency (${payload.baseCurrency}), including FX.`;

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={payload.meta.alt ?? payload.meta.title}
      aria-describedby={dataTableId}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: chart container needs keyboard focus for arrow-key navigation per CHARTS_SPEC §7.4 a11y baseline.
      tabIndex={0}
      data-testid="chart-treemap"
      data-active-index={activeIndex ?? undefined}
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%' }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <ReTreemap
          data={data}
          dataKey="size"
          nameKey="name"
          aspectRatio={1.618}
          stroke={CHART_TOKENS.gridLineStrong}
          isAnimationActive={false}
          content={<TileContent />}
        />
      </ResponsiveContainer>
      <p data-testid="chart-treemap-caption" className="mt-3 text-xs text-text-secondary">
        {basisCaption} {FINRA_CAPTION}
      </p>
      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
