'use client';

/**
 * LineChart — typed payload renderer.
 *
 * Reads `LineChartPayload` from `@investment-tracker/shared-types/charts`.
 *
 * Lane-A Risk Flag 1 lives in the schema: `LineOverlay` is a discriminated
 * union with only `trade_marker` — no support / resistance / MA / RSI /
 * MACD / Bollinger / target-price / signal-annotation branches exist. The
 * renderer therefore only paints `trade_marker` overlays; anything else
 * cannot have survived the parser.
 *
 * Series-7-on-dark caveat: when the only series is `var(--chart-series-7)`
 * and `data-theme="dark"`, the renderer auto-swaps to series-1 with a
 * dev-mode `console.warn`. The check runs against the live attribute on
 * `<html>` so it captures both `.dark` and `[data-theme="dark"]`.
 */

import type { LineChartPayload } from '@investment-tracker/shared-types/charts';
import { useEffect, useId, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as ReLineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartDataTable } from './_shared/ChartDataTable';
import { buildTooltipProps } from './_shared/buildTooltipProps';
import { formatValue, formatXAxis } from './_shared/formatters';
import { useReducedMotion } from './_shared/useReducedMotion';
import { CHART_ANIMATION_MS, CHART_TOKENS, SERIES_VARS } from './tokens';

export interface LineChartProps {
  payload: LineChartPayload;
  height?: number;
  className?: string;
}

const SERIES_7_VAR = SERIES_VARS[6];

function isDarkTheme(): boolean {
  if (typeof document === 'undefined') return false;
  const html = document.documentElement;
  return html.classList.contains('dark') || html.dataset.theme === 'dark';
}

function useDarkTheme(): boolean {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;

    setDark(isDarkTheme());

    const observer = new MutationObserver(() => setDark(isDarkTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return dark;
}

export function LineChart({ payload, height = 220, className }: LineChartProps) {
  const dataTableId = useId();
  const tooltip = buildTooltipProps();
  const prefersReducedMotion = useReducedMotion();
  const dark = useDarkTheme();

  const fmtValue = (n: number) => formatValue(n, payload.yAxis.format, payload.yAxis.currency);
  const fmtX = (v: string | number) => formatXAxis(v, payload.xAxis.format);
  const data = payload.data.map((row) => ({ ...row }));

  // Series-7-on-dark solo auto-swap (CHARTS_SPEC §2.3 caveat).
  const series = payload.series.map((s, i) => {
    let color = s.color ?? SERIES_VARS[i % SERIES_VARS.length];
    if (payload.series.length === 1 && color === SERIES_7_VAR && dark) {
      // Dev-only diagnostic per CHARTS_SPEC §2.3. We avoid a hard dependency
      // on `process.env.NODE_ENV` (no @types/node in this package). The
      // hostname check approximates "dev only" without leaking diagnostic
      // noise to staging/prod, which run on real domains.
      if (
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ) {
        console.warn(
          '[charts] Solo series-7 in dark mode auto-swapped to series-1 — see CHARTS_SPEC §2.3.',
        );
      }
      color = SERIES_VARS[0];
    }
    return { ...s, color };
  });

  const yDomain = payload.yAxis.domain;

  return (
    <div
      role="img"
      aria-label={payload.meta.alt ?? payload.meta.title}
      aria-describedby={dataTableId}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: chart container needs keyboard focus for arrow-key navigation per CHARTS_SPEC §7.4 a11y baseline.
      tabIndex={0}
      data-testid="chart-line"
      className={className}
      style={{ width: '100%', outline: 'none' }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <ReLineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
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
          {payload.benchmark ? (
            <ReferenceLine
              y={payload.benchmark.y}
              stroke={CHART_TOKENS.gridLineStrong}
              strokeDasharray="2 4"
              label={{
                value: payload.benchmark.label,
                fill: CHART_TOKENS.axisLabel,
                fontSize: 10,
                position: 'right',
              }}
            />
          ) : null}
          {series.map((s) => (
            <Line
              key={s.key}
              dataKey={s.key}
              name={s.label}
              type={payload.interpolation}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={CHART_ANIMATION_MS}
            />
          ))}
          {(payload.overlay ?? []).map((marker, i) => (
            <ReferenceDot
              // biome-ignore lint/suspicious/noArrayIndexKey: positional overlay identity.
              key={`overlay-${i}`}
              x={marker.date as string | number}
              y={marker.price}
              r={4}
              stroke={SERIES_VARS[0]}
              fill={marker.side === 'buy' ? SERIES_VARS[0] : SERIES_VARS[1]}
              ifOverflow="visible"
            />
          ))}
        </ReLineChart>
      </ResponsiveContainer>
      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
