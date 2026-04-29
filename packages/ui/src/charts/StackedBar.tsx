'use client';

/**
 * StackedBar — typed payload renderer (T2 lazy).
 *
 * Reads `StackedBarChartPayload` from `@investment-tracker/shared-types/charts`.
 * Same Risk Flag 2 schema constraints as Bar (zero-only reference line, no
 * targetWeight). Δ1 per-row sum-to-total invariant lives at the envelope
 * level; renderer just renders.
 */

import type { StackedBarChartPayload } from '@investment-tracker/shared-types/charts';
import { useCallback, useId, useRef, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  Legend,
  BarChart as ReBarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartDataTable } from './_shared/ChartDataTable';
import { CHART_FOCUS_RING_CLASS } from './_shared/a11y';
import { buildTooltipProps } from './_shared/buildTooltipProps';
import { formatValue, formatXAxis } from './_shared/formatters';
import { useChartKeyboardNav } from './_shared/useChartKeyboardNav';
import { useReducedMotion } from './_shared/useReducedMotion';
import { CHART_ANIMATION_MS, CHART_TOKENS, SERIES_VARS } from './tokens';

export interface StackedBarProps {
  payload: StackedBarChartPayload;
  height?: number;
  className?: string;
}

export function StackedBar({ payload, height = 220, className }: StackedBarProps) {
  const dataTableId = useId();
  const tooltip = buildTooltipProps();
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const onIndexChange = useCallback((next: number) => setActiveIndex(next), []);
  useChartKeyboardNav(containerRef, payload.data.length, onIndexChange);

  const fmtValue = (n: number) => formatValue(n, payload.yAxis.format, payload.yAxis.currency);
  const fmtX = (v: string | number) => formatXAxis(v, payload.xAxis.format);
  const data = payload.data.map((row) => ({ ...row }));

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={payload.meta.alt ?? payload.meta.title}
      aria-describedby={dataTableId}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: chart container needs keyboard focus for arrow-key navigation per CHARTS_SPEC §7.4 a11y baseline.
      tabIndex={0}
      data-testid="chart-stacked-bar"
      data-active-index={activeIndex ?? undefined}
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%' }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <ReBarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke={CHART_TOKENS.gridLine} strokeDasharray="2 4" />
          <XAxis
            dataKey="x"
            tick={{ fill: CHART_TOKENS.axisLabel, fontSize: 11 }}
            stroke={CHART_TOKENS.gridLine}
            tickLine={false}
            axisLine={false}
            tickFormatter={fmtX}
            minTickGap={24}
          />
          <YAxis
            tick={{ fill: CHART_TOKENS.axisLabel, fontSize: 11 }}
            stroke={CHART_TOKENS.gridLine}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => fmtValue(Number(v))}
            width={52}
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
          <Legend
            wrapperStyle={{
              paddingTop: 12,
              fontSize: 11,
              color: 'var(--color-text-secondary)',
            }}
          />
          {payload.referenceLine ? (
            <ReferenceLine y={0} stroke={CHART_TOKENS.gridLineStrong} strokeDasharray="2 4" />
          ) : null}
          {payload.series.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              stackId="a"
              fill={s.color ?? SERIES_VARS[i % SERIES_VARS.length]}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={CHART_ANIMATION_MS}
              radius={i === payload.series.length - 1 ? [4, 4, 0, 0] : 0}
            />
          ))}
        </ReBarChart>
      </ResponsiveContainer>
      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
