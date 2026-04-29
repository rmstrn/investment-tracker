'use client';

/**
 * Sparkline — single-series glance trend (CHARTS_SPEC §4.5).
 *
 * No axes, no tooltip, no legend, no gridlines. Pre-axis renderer for
 * table cells, KPI tiles, and inline answers. Schema-restricted to a
 * single time series with 2..120 points.
 *
 * **A11y per spec §4.5:** default is NON-focusable. Sparklines sit alongside
 * a number that already conveys the value; the SVG is `aria-hidden="true"`.
 * The accompanying number IS the data; the sparkline is a glance.
 *
 * **Standalone exception (`standalone={true}`):** sparkline used without an
 * adjacent number (e.g. inline chat reply) opts in to `role="img"` +
 * `aria-label` + `tabIndex={0}` + arrow-key nav + visible focus ring.
 */

import type { SparklinePayload } from '@investment-tracker/shared-types/charts';
import { useCallback, useId, useRef, useState } from 'react';
import {
  Area,
  Line,
  AreaChart as ReAreaChart,
  LineChart as ReLineChart,
  ResponsiveContainer,
} from 'recharts';
import { CHART_FOCUS_RING_CLASS } from './_shared/a11y';
import { ChartDataTable } from './_shared/ChartDataTable';
import { useChartKeyboardNav } from './_shared/useChartKeyboardNav';
import { useReducedMotion } from './_shared/useReducedMotion';
import { CHART_ANIMATION_MS, SERIES_VARS } from './tokens';

export interface SparklineProps {
  payload: SparklinePayload;
  height?: number;
  width?: number;
  className?: string;
  /**
   * Opt-in to focusable + arrow-key nav when the sparkline is the primary
   * data surface (no adjacent number). Defaults to `false` per CHARTS_SPEC
   * §4.5: SVG is aria-hidden and not in the tab order.
   */
  standalone?: boolean;
}

export function Sparkline({
  payload,
  height = 32,
  width,
  className,
  standalone = false,
}: SparklineProps) {
  const dataTableId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const onIndexChange = useCallback((next: number) => setActiveIndex(next), []);
  // Hook is a no-op when dataLength is 0; safe to call unconditionally even
  // for non-standalone sparklines (it sees `node === null` since the container
  // ref doesn't carry tabIndex and won't fire keydown anyway).
  useChartKeyboardNav(containerRef, standalone ? payload.data.length : 0, onIndexChange);

  const data = payload.data.map((d) => ({ x: d.x, y: d.y }));
  const last = data[data.length - 1]?.y ?? 0;
  const first = data[0]?.y ?? 0;

  // Trend: payload.trend takes precedence; fall back to last/first sign.
  const trend =
    payload.trend ??
    (Math.abs((last / first || 1) - 1) < 0.005 ? 'flat' : last >= first ? 'up' : 'down');

  const stroke =
    trend === 'down' ? SERIES_VARS[1] : trend === 'flat' ? SERIES_VARS[4] : SERIES_VARS[0];

  const ariaLabel = payload.meta.alt ?? `${payload.meta.title} sparkline (${trend})`;
  const hostA11yProps = standalone
    ? {
        role: 'img' as const,
        'aria-label': ariaLabel,
        'aria-describedby': dataTableId,
        tabIndex: 0,
      }
    : {
        'aria-hidden': true as const,
      };

  return (
    <div
      ref={containerRef}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: standalone sparkline opts into keyboard focus per CHARTS_SPEC §4.5 exception.
      {...hostA11yProps}
      data-testid="chart-sparkline"
      data-trend={trend}
      data-active-index={activeIndex ?? undefined}
      className={
        standalone
          ? `${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`
          : (className ?? undefined)
      }
      style={{ width: width ?? '100%', height }}
      onMouseLeave={() => setActiveIndex(null)}
    >
      <ResponsiveContainer width="100%" height="100%">
        {payload.filled ? (
          <ReAreaChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <Area
              dataKey="y"
              type="monotone"
              stroke={stroke}
              fill={stroke}
              fillOpacity={0.18}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={CHART_ANIMATION_MS}
            />
          </ReAreaChart>
        ) : (
          <ReLineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <Line
              dataKey="y"
              type="monotone"
              stroke={stroke}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={CHART_ANIMATION_MS}
            />
          </ReLineChart>
        )}
      </ResponsiveContainer>
      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
