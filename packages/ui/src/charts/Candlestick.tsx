'use client';

/**
 * Candlestick — OHLC chart (T3 lazy, no demo).
 *
 * Reads `CandlestickChartPayload` from `@investment-tracker/shared-types/charts`.
 * Lane-A structural exclusions live in the schema (no support / resistance
 * / trend / channel / MA / RSI / MACD / Bollinger / signal / target / buy
 * / sell fields — `.strict()` rejects them at parse time). The renderer
 * just paints OHLC.
 *
 * **Demo policy:** this file is exported from `lazy.ts` but NOT demoed in
 * the showcase route until PO greenlight + legal-advisor sign-off (per
 * scope §«T3»).
 */

import type { CandlestickChartPayload } from '@investment-tracker/shared-types/charts';
import { useCallback, useId, useRef, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_FOCUS_RING_CLASS } from './_shared/a11y';
import { ChartDataTable } from './_shared/ChartDataTable';
import { buildTooltipProps } from './_shared/buildTooltipProps';
import { formatValue, formatXAxis } from './_shared/formatters';
import { useChartKeyboardNav } from './_shared/useChartKeyboardNav';
import { useReducedMotion } from './_shared/useReducedMotion';
import { CHART_ANIMATION_MS, CHART_TOKENS, SERIES_VARS } from './tokens';

export interface CandlestickProps {
  payload: CandlestickChartPayload;
  height?: number;
  className?: string;
}

interface CandleVisualPoint {
  x: string | number;
  /** Wick: [low, high]. */
  wick: [number, number];
  /** Body: [bodyLow, bodyHigh]. */
  body: [number, number];
  open: number;
  close: number;
}

function transform(payload: CandlestickChartPayload): CandleVisualPoint[] {
  return payload.data.map((c) => ({
    x: c.x,
    wick: [c.low, c.high],
    body: [Math.min(c.open, c.close), Math.max(c.open, c.close)],
    open: c.open,
    close: c.close,
  }));
}

export function Candlestick({ payload, height = 300, className }: CandlestickProps) {
  const dataTableId = useId();
  const tooltip = buildTooltipProps();
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const onIndexChange = useCallback((next: number) => setActiveIndex(next), []);
  useChartKeyboardNav(containerRef, payload.data.length, onIndexChange);

  const visual = transform(payload);
  const fmtValue = (n: number) => formatValue(n, payload.yAxis.format, payload.yAxis.currency);
  const fmtX = (v: string | number) => formatXAxis(v, payload.xAxis.format);

  // Y-axis padding aware of low-priced instruments per finance audit CN-3.
  const allValues = payload.data.flatMap((c) => [c.low, c.high]);
  const dataMin = Math.min(...allValues);
  const dataMax = Math.max(...allValues);
  const lowPad = Math.max(0.01, dataMin * 0.02);
  const highPad = Math.max(0.01, dataMax * 0.02);
  const yDomain: [number, number] = [Math.max(0, dataMin - lowPad), dataMax + highPad];

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={payload.meta.alt ?? `${payload.meta.title} (${payload.symbol})`}
      aria-describedby={dataTableId}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: chart container needs keyboard focus for arrow-key navigation per CHARTS_SPEC §7.4 a11y baseline.
      tabIndex={0}
      data-testid="chart-candlestick"
      data-active-index={activeIndex ?? undefined}
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%' }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={visual} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
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
            domain={yDomain}
            width={64}
          />
          <Tooltip
            contentStyle={tooltip.contentStyle}
            labelStyle={tooltip.labelStyle}
            itemStyle={tooltip.itemStyle}
            cursor={tooltip.cursor}
            separator={tooltip.separator}
            formatter={(_v, _n, item) => {
              const data = item?.payload as { open?: number; close?: number } | undefined;
              return data?.close !== undefined ? fmtValue(data.close) : '';
            }}
            labelFormatter={(v) => fmtX(v as string | number)}
          />
          {/* Wick: thin bar from low to high. */}
          <Bar dataKey="wick" barSize={1} isAnimationActive={false} fill={CHART_TOKENS.axisLabel} />
          {/* Body: thick bar from open to close, colored by direction. */}
          <Bar
            dataKey="body"
            barSize={6}
            isAnimationActive={!prefersReducedMotion}
            animationDuration={CHART_ANIMATION_MS}
          >
            {visual.map((c) => (
              <Cell key={String(c.x)} fill={c.close >= c.open ? SERIES_VARS[0] : SERIES_VARS[1]} />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
