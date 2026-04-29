'use client';

/**
 * Sparkline — single-series glance trend (CHARTS_SPEC §4.5).
 *
 * No axes, no tooltip, no legend, no gridlines. Pre-axis renderer for
 * table cells, KPI tiles, and inline answers. Schema-restricted to a
 * single time series with 2..120 points.
 */

import type { SparklinePayload } from '@investment-tracker/shared-types/charts';
import { useId, useRef, useState } from 'react';
import {
  Area,
  Line,
  AreaChart as ReAreaChart,
  LineChart as ReLineChart,
  ResponsiveContainer,
} from 'recharts';
import { ChartDataTable } from './_shared/ChartDataTable';
import { useReducedMotion } from './_shared/useReducedMotion';
import { CHART_ANIMATION_MS, SERIES_VARS } from './tokens';

export interface SparklineProps {
  payload: SparklinePayload;
  height?: number;
  width?: number;
  className?: string;
}

export function Sparkline({ payload, height = 32, width, className }: SparklineProps) {
  const dataTableId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setActiveIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

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

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={dataTableId}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: chart container needs keyboard focus for arrow-key navigation per CHARTS_SPEC §7.4 a11y baseline.
      tabIndex={0}
      data-testid="chart-sparkline"
      data-trend={trend}
      className={className}
      style={{ width: width ?? '100%', height, outline: 'none' }}
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
