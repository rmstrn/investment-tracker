'use client';

/**
 * AreaChart (rewrite) — typed payload renderer.
 *
 * Reads `AreaChartPayload` from `@investment-tracker/shared-types/charts`.
 * Stacked variant via `payload.stacked`; multi-series fills use the
 * `--chart-series-N` CSS-var palette so theme switches without remount.
 *
 * Lane-A: schema-side. The renderer is data-driven — no overlays exist on
 * the AreaChart payload, so there is nothing to police here.
 */

import type { AreaChartPayload } from '@investment-tracker/shared-types/charts';
import { useCallback, useId, useRef, useState } from 'react';
import {
  Area,
  CartesianGrid,
  Legend,
  AreaChart as ReAreaChart,
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

export interface AreaChartProps {
  payload: AreaChartPayload;
  height?: number;
  className?: string;
}

const GRADIENT_PREFIX = 'area-fill';

export function AreaChart({ payload, height = 220, className }: AreaChartProps) {
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
      data-testid="chart-area"
      data-active-index={activeIndex ?? undefined}
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%' }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <ReAreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            {payload.series.map((s, i) => {
              const stroke = s.color ?? SERIES_VARS[i % SERIES_VARS.length];
              return (
                <linearGradient
                  key={s.key}
                  id={`${GRADIENT_PREFIX}-${dataTableId}-${i}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              );
            })}
          </defs>
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
            cursor={tooltip.cursor}
            separator={tooltip.separator}
            formatter={(v) => fmtValue(Number(v))}
            labelFormatter={(v) => fmtX(v as string | number)}
          />
          {payload.series.length > 1 ? (
            <Legend
              wrapperStyle={{
                paddingTop: 12,
                fontSize: 11,
                color: 'var(--color-text-secondary)',
              }}
            />
          ) : null}
          {payload.series.map((s, i) => {
            const stroke = s.color ?? SERIES_VARS[i % SERIES_VARS.length];
            return (
              <Area
                key={s.key}
                dataKey={s.key}
                name={s.label}
                type={payload.interpolation}
                stroke={stroke}
                strokeWidth={2}
                fill={`url(#${GRADIENT_PREFIX}-${dataTableId}-${i})`}
                stackId={payload.stacked ? 'stack' : undefined}
                isAnimationActive={!prefersReducedMotion}
                animationDuration={CHART_ANIMATION_MS}
              />
            );
          })}
        </ReAreaChart>
      </ResponsiveContainer>
      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
