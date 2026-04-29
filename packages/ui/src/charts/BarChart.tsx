'use client';

/**
 * BarChart (rewrite) — typed payload renderer.
 *
 * Reads `BarChartPayload` from `@investment-tracker/shared-types/charts`.
 * Lane-A Risk Flag 2 lives in the schema (no `targetWeight`, reference
 * line restricted to zero-axis); the renderer just renders.
 *
 * Drift sub-variant: when the AI agent emits `meta.subtitle` containing
 * the catalog B8 drift caption (FINRA convention prose), the renderer
 * displays a mandatory caption block beneath the chart.
 */

import type { BarChartPayload } from '@investment-tracker/shared-types/charts';
import { useCallback, useId, useRef, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  BarChart as ReBarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartDataTable } from './_shared/ChartDataTable';
import { CHART_FOCUS_RING_CLASS } from './_shared/a11y';
import { BAR_RADIUS, buildChartTheme } from './_shared/buildChartTheme';
import { buildTooltipProps } from './_shared/buildTooltipProps';
import { formatValue, formatXAxis } from './_shared/formatters';
import { useChartKeyboardNav } from './_shared/useChartKeyboardNav';
import { useReducedMotion } from './_shared/useReducedMotion';
import { CHART_ANIMATION_MS, CHART_TOKENS, SERIES_VARS } from './tokens';

export interface BarChartProps {
  payload: BarChartPayload;
  height?: number;
  className?: string;
}

/**
 * Drift caption — finance audit B-2 + catalog B8. Rendered when the agent
 * marks the bar as drift via `meta.subtitle` containing "Drift" (case-
 * sensitive prefix). Caption text is baked, not driven by payload, to keep
 * Lane-A wording stable.
 */
const DRIFT_CAPTION =
  'Drift = change in weight from the prior date to the current date, driven by price moves and any trades. Provedo describes drift; it does not mark drift as good/bad or recommend rebalancing.';

/**
 * Drift detection — fragile substring match on `meta.subtitle`. Tracked by
 * TD-096 (P3): swap to `BarChartPayload.subtype === 'drift'` once the
 * schema can carry the discriminator (coordinated backend bump). Locale-
 * fragile + false-positive prone today, but acceptable at MVP since the
 * AI agent is English-only and emits drift bars via a fixed prompt.
 */
function isDriftBar(payload: BarChartPayload): boolean {
  return Boolean(payload.meta.subtitle?.toLowerCase().includes('drift'));
}

function buildBarReferenceLineLabel(refLine: BarChartPayload['referenceLine']):
  | undefined
  | {
      value: string;
      fill: string;
      fontSize: number;
    } {
  if (!refLine?.label) return undefined;
  return {
    value: refLine.label,
    fill: CHART_TOKENS.axisLabel,
    fontSize: 10,
  };
}

export function BarChart({ payload, height = 180, className }: BarChartProps) {
  const dataTableId = useId();
  const tooltip = buildTooltipProps();
  const theme = buildChartTheme();
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const onIndexChange = useCallback((next: number) => setActiveIndex(next), []);
  useChartKeyboardNav(containerRef, payload.data.length, onIndexChange);

  const fmtValue = (n: number) => formatValue(n, payload.yAxis.format, payload.yAxis.currency);
  const fmtX = (v: string | number) => formatXAxis(v, payload.xAxis.format);
  const data = payload.data.map((row) => ({ ...row }));
  const horizontal = payload.orientation === 'horizontal';

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={payload.meta.alt ?? payload.meta.title}
      aria-describedby={dataTableId}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: chart container needs keyboard focus for arrow-key navigation per CHARTS_SPEC §7.4 a11y baseline.
      tabIndex={0}
      data-testid="chart-bar"
      data-active-index={activeIndex ?? undefined}
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%' }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <ReBarChart
          data={data}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <CartesianGrid {...theme.grid} />
          <XAxis
            type={horizontal ? 'number' : 'category'}
            dataKey={horizontal ? undefined : 'x'}
            tick={theme.axis.tick}
            tickLine={theme.axis.tickLine}
            axisLine={theme.axis.axisLine}
            tickFormatter={horizontal ? (v) => fmtValue(Number(v)) : fmtX}
            minTickGap={24}
          />
          <YAxis
            type={horizontal ? 'category' : 'number'}
            dataKey={horizontal ? 'x' : undefined}
            tick={theme.axis.tick}
            tickLine={theme.axis.tickLine}
            axisLine={theme.axis.axisLine}
            tickFormatter={horizontal ? undefined : (v) => fmtValue(Number(v))}
            width={horizontal ? 80 : 52}
          />
          <Tooltip
            contentStyle={tooltip.contentStyle}
            labelStyle={tooltip.labelStyle}
            itemStyle={tooltip.itemStyle}
            cursor={{ fill: 'var(--chart-grid)' }}
            separator={tooltip.separator}
            formatter={(v) => fmtValue(Number(v))}
            labelFormatter={(v) => fmtX(v as string | number)}
          />
          {payload.referenceLine ? (
            <ReferenceLine
              {...(horizontal ? { x: 0 } : { y: 0 })}
              stroke={CHART_TOKENS.gridLineStrong}
              strokeDasharray="2 4"
              label={buildBarReferenceLineLabel(payload.referenceLine)}
            />
          ) : null}
          <Bar
            dataKey="y"
            radius={horizontal ? [0, BAR_RADIUS[0], BAR_RADIUS[1], 0] : [...BAR_RADIUS]}
            isAnimationActive={!prefersReducedMotion}
            animationDuration={CHART_ANIMATION_MS}
            fill={SERIES_VARS[0]}
          >
            {payload.colorBySign
              ? data.map((d, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: positional bar identity.
                  <Cell key={`cell-${i}`} fill={d.y >= 0 ? SERIES_VARS[0] : SERIES_VARS[1]} />
                ))
              : null}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
      {isDriftBar(payload) ? (
        <p data-testid="chart-bar-drift-caption" className="mt-3 text-xs text-text-secondary">
          {DRIFT_CAPTION}
        </p>
      ) : null}
      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
