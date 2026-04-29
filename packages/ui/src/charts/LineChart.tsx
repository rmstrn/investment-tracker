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
import { useCallback, useEffect, useId, useRef, useState } from 'react';
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
import { CHART_FOCUS_RING_CLASS } from './_shared/a11y';
import { buildChartTheme } from './_shared/buildChartTheme';
import { buildTooltipProps } from './_shared/buildTooltipProps';
import { formatValue, formatXAxis } from './_shared/formatters';
import { useChartKeyboardNav } from './_shared/useChartKeyboardNav';
import { useReducedMotion } from './_shared/useReducedMotion';
import { CHART_ANIMATION_MS, SERIES_VARS } from './tokens';

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
  const theme = buildChartTheme();
  const prefersReducedMotion = useReducedMotion();
  const dark = useDarkTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const onIndexChange = useCallback((next: number) => setActiveIndex(next), []);
  useChartKeyboardNav(containerRef, payload.data.length, onIndexChange);

  const fmtValue = (n: number) => formatValue(n, payload.yAxis.format, payload.yAxis.currency);
  const fmtX = (v: string | number) => formatXAxis(v, payload.xAxis.format);
  const data = payload.data.map((row) => ({ ...row }));

  // Series-7-on-dark solo auto-swap (CHARTS_SPEC §2.3 caveat).
  const series = payload.series.map((s, i) => {
    let color = s.color ?? SERIES_VARS[i % SERIES_VARS.length];
    if (payload.series.length === 1 && color === SERIES_7_VAR && dark) {
      // Dev-only diagnostic per CHARTS_SPEC §2.3. Uses NODE_ENV (Node typings
      // ship via @types/node devDep, swapped in for the previous hostname
      // probe so staging dev-builds also surface the warning).
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          '[charts] Solo series-7 in dark mode auto-swapped to series-1 — see CHARTS_SPEC §2.3.',
        );
      }
      color = SERIES_VARS[0];
    }
    return { ...s, color };
  });

  const yDomain = payload.yAxis.domain;

  // Color-blind safety: when 2+ series, vary stroke-dasharray per series so
  // colour is never the only signal. Solo series stays solid (no need).
  // Series 0 = solid; series N>=1 cycles a 7-pattern ladder.
  const DASH_LADDER = ['4 4', '8 4 2 4', '2 2', '6 6', '4 4 1 4', '8 2 2 2'];
  const getDash = (index: number): string | undefined =>
    payload.series.length > 1 && index > 0
      ? DASH_LADDER[(index - 1) % DASH_LADDER.length]
      : undefined;

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={payload.meta.alt ?? payload.meta.title}
      aria-describedby={dataTableId}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: chart container needs keyboard focus for arrow-key navigation per CHARTS_SPEC §7.4 a11y baseline.
      tabIndex={0}
      data-testid="chart-line"
      data-active-index={activeIndex ?? undefined}
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%' }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <ReLineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...theme.grid} />
          <XAxis
            dataKey="x"
            tick={theme.axis.tick}
            tickLine={theme.axis.tickLine}
            axisLine={theme.axis.axisLine}
            tickFormatter={fmtX}
            minTickGap={24}
          />
          <YAxis
            tick={theme.axis.tick}
            tickLine={theme.axis.tickLine}
            axisLine={theme.axis.axisLine}
            tickFormatter={(v) => fmtValue(Number(v))}
            domain={yDomain}
            // PO feedback (2026-04-29): «$184,210»-format labels were clipped
            // at left edge with width=52. Bumped to 68 so 7-char comma-formatted
            // currency values (e.g. $184,210, 1.42M) render fully inside the
            // axis gutter. Pair with `tickMargin=4` for breathing room between
            // tick text and the (invisible) axis line.
            width={68}
            tickMargin={4}
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
          <Legend wrapperStyle={theme.legendStyle} />
          {payload.benchmark ? (
            <ReferenceLine
              y={payload.benchmark.y}
              stroke="var(--chart-grid-strong)"
              strokeDasharray="2 4"
              label={{
                value: payload.benchmark.label,
                fill: 'var(--chart-axis-label)',
                fontSize: 10,
                position: 'right',
              }}
            />
          ) : null}
          {series.map((s, i) => {
            const dash = getDash(i);
            return (
              <Line
                key={s.key}
                dataKey={s.key}
                name={s.label}
                type={payload.interpolation}
                stroke={s.color}
                strokeWidth={theme.line.strokeWidth}
                strokeLinecap={theme.line.strokeLinecap}
                strokeLinejoin={theme.line.strokeLinejoin}
                strokeDasharray={dash}
                dot={false}
                activeDot={{ r: 5, fill: s.color, stroke: 'var(--card)', strokeWidth: 2 }}
                isAnimationActive={!prefersReducedMotion}
                animationDuration={CHART_ANIMATION_MS}
                animationEasing="ease-out"
              />
            );
          })}
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
