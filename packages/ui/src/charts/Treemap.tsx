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
import { Treemap as ReTreemap, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartDataTable } from './_shared/ChartDataTable';
import { CHART_FOCUS_RING_CLASS } from './_shared/a11y';
import { buildTooltipProps } from './_shared/buildTooltipProps';
import { useChartKeyboardNav } from './_shared/useChartKeyboardNav';
import { useReducedMotion } from './_shared/useReducedMotion';
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
  /** 0-based tile index injected by Recharts via `content` clone (Recharts ≥3 contract). */
  index?: number;
  /** Active tile index for hover/focus highlight. Injected by parent renderer. */
  activeIndex?: number | null;
  /** True when motion should be suppressed (parent observes prefers-reduced-motion). */
  reducedMotion?: boolean;
  /** Hover handlers from parent. Recharts forwards mouseEnter/leave on tile groups. */
  onTileEnter?: (index: number) => void;
  onTileLeave?: () => void;
}

function TileContent(props: TileContentProps) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    dailyChangePct,
    isOther,
    ticker,
    itemCount,
    index,
    activeIndex,
    reducedMotion,
    onTileEnter,
    onTileLeave,
  } = props;
  const fill = colorForTreemapChange(dailyChangePct);
  // Conditional ink — WCAG 1.4.3 AA fix for tile labels at 10-11px.
  // Positive tiles (deep green) pair with white; negative + neutral tiles
  // (mid-luminance) pair with near-black to clear ≥4.5:1 in both themes.
  const ink = inkForTreemapChange(dailyChangePct);
  const label = isOther ? `OTHER · ${itemCount ?? 0} items` : (ticker ?? '');
  const showLabel = labelOnTile({ width, height });
  const isActive = typeof index === 'number' && index === activeIndex;

  // Per-tile keyboard handlers would double-fire with the chart container's
  // arrow-key nav (CHARTS_SPEC §3.8); we only wire mouse handlers here.
  return (
    <g
      onMouseEnter={() => {
        if (typeof index === 'number') onTileEnter?.(index);
      }}
      onMouseLeave={() => onTileLeave?.()}
      style={{
        // Lighten the active tile per audit §2.3. Skip in reduced-motion mode
        // (only the outline ring telegraphs hover).
        filter: isActive && !reducedMotion ? 'brightness(1.06)' : undefined,
        transition: reducedMotion ? undefined : 'filter 200ms ease-out',
      }}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke={isActive ? 'var(--ink)' : 'var(--bg, #fff)'}
        strokeWidth={isActive ? 2 : 1}
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
  const tooltip = buildTooltipProps();
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const onIndexChange = useCallback((next: number) => setActiveIndex(next), []);
  useChartKeyboardNav(containerRef, payload.tiles.length, onIndexChange);
  // Mouse hover wins over keyboard nav for the active highlight.
  const effectiveActive = hoverIndex ?? activeIndex;

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
          content={
            <TileContent
              activeIndex={effectiveActive}
              reducedMotion={prefersReducedMotion}
              onTileEnter={(i) => setHoverIndex(i)}
              onTileLeave={() => setHoverIndex(null)}
            />
          }
        >
          <Tooltip
            contentStyle={tooltip.contentStyle}
            labelStyle={tooltip.labelStyle}
            itemStyle={tooltip.itemStyle}
            separator={tooltip.separator}
            // Recharts treemap exposes the row payload via the `payload[0].payload`
            // chain; the formatter sees the resolved `weightPct` value (the
            // `dataKey="size"` field). We render a richer label with `labelFormatter`
            // (ticker), and the value formatter renders `xx.xx%`.
            formatter={(v) => {
              if (typeof v === 'number') return `${v.toFixed(2)}%`;
              if (typeof v === 'string') return `${v}%`;
              return '';
            }}
            labelFormatter={(_label, items) => {
              const tile = items?.[0]?.payload as
                | {
                    ticker?: string;
                    dailyChangePct?: number;
                    isOther?: boolean;
                    itemCount?: number;
                  }
                | undefined;
              if (!tile) return '';
              const head = tile.isOther
                ? `OTHER · ${tile.itemCount ?? 0} items`
                : (tile.ticker ?? '');
              const change =
                typeof tile.dailyChangePct === 'number'
                  ? ` · ${tile.dailyChangePct >= 0 ? '+' : ''}${tile.dailyChangePct.toFixed(2)}%`
                  : '';
              return `${head}${change}`;
            }}
          />
        </ReTreemap>
      </ResponsiveContainer>
      <p data-testid="chart-treemap-caption" className="mt-3 text-xs text-text-secondary">
        {basisCaption} {FINRA_CAPTION}
      </p>
      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
