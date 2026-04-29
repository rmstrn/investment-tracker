'use client';

/**
 * DonutChart (rewrite) — typed payload renderer.
 *
 * Reads `DonutChartPayload` from `@investment-tracker/shared-types/charts`.
 * Δ1 sum-to-total invariant lives at the envelope level (Zod), so the
 * renderer just renders. 60% inner radius per CHARTS_SPEC §4.4; legend
 * placement varies by viewport.
 */

import type { DonutChartPayload } from '@investment-tracker/shared-types/charts';
import { useCallback, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_FOCUS_RING_CLASS } from './_shared/a11y';
import { ChartDataTable } from './_shared/ChartDataTable';
import { buildTooltipProps } from './_shared/buildTooltipProps';
import { formatValue } from './_shared/formatters';
import { useChartKeyboardNav } from './_shared/useChartKeyboardNav';
import { useReducedMotion } from './_shared/useReducedMotion';
import { CHART_ANIMATION_MS, DONUT_ORDER } from './tokens';

export interface DonutChartProps {
  payload: DonutChartPayload;
  size?: number;
  /** Custom center label override; falls back to `payload.centerLabel` or sum. */
  centerLabel?: ReactNode;
  className?: string;
}

export function DonutChart({ payload, size = 220, centerLabel, className }: DonutChartProps) {
  const dataTableId = useId();
  const tooltip = buildTooltipProps();
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const onIndexChange = useCallback((next: number) => setActiveIndex(next), []);
  useChartKeyboardNav(containerRef, payload.segments.length, onIndexChange);

  const outerR = size / 2 - 4;
  const innerR = outerR * 0.6;
  const fmtValue = (n: number) => formatValue(n, payload.format, payload.currency);

  const segments = payload.segments.map((s, i) => ({
    ...s,
    color: s.color ?? DONUT_ORDER[i % DONUT_ORDER.length],
  }));

  const center =
    centerLabel ??
    (payload.centerLabel ? (
      <div className="font-mono text-sm font-semibold tabular-nums">{payload.centerLabel}</div>
    ) : null);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={payload.meta.alt ?? payload.meta.title}
      aria-describedby={dataTableId}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: chart container needs keyboard focus for arrow-key navigation per CHARTS_SPEC §7.4 a11y baseline.
      tabIndex={0}
      data-testid="chart-donut"
      data-active-index={activeIndex ?? undefined}
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%' }}
    >
      <div
        className="relative inline-flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <ResponsiveContainer width={size} height={size}>
          <PieChart>
            <Pie
              data={segments}
              dataKey="value"
              nameKey="label"
              innerRadius={innerR}
              outerRadius={outerR}
              paddingAngle={2}
              strokeWidth={0}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={CHART_ANIMATION_MS}
            >
              {segments.map((s) => (
                <Cell key={s.key} fill={s.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltip.contentStyle}
              labelStyle={tooltip.labelStyle}
              itemStyle={tooltip.itemStyle}
              separator={tooltip.separator}
              formatter={(v) => fmtValue(Number(v))}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, color: 'var(--color-text-secondary)' }}
              align="right"
              verticalAlign="middle"
              layout="vertical"
            />
          </PieChart>
        </ResponsiveContainer>
        {center ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {center}
          </div>
        ) : null}
      </div>
      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
