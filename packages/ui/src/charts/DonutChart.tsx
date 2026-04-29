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
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from 'recharts';
import { ChartDataTable } from './_shared/ChartDataTable';
import { CHART_FOCUS_RING_CLASS } from './_shared/a11y';
import { buildTooltipProps } from './_shared/buildTooltipProps';
import { formatValue } from './_shared/formatters';
import { useChartKeyboardNav } from './_shared/useChartKeyboardNav';
import { useReducedMotion } from './_shared/useReducedMotion';
import { CHART_ANIMATION_MS, DONUT_ORDER } from './tokens';

/**
 * Active-slice renderer (CHARTS_SPEC §3.7).
 *
 * Scales the slice 1.02× outward (≈+4px on outer radius for our 220px size)
 * and overlays a 4px `var(--accent-glow)` rim ring just outside the slice.
 * Reduced-motion path skips the scale and only paints the glow ring. Recharts
 * passes the standard sector geometry props through `activeShape`'s argument.
 */
interface ActiveShapeProps {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
}

function makeActiveShape(prefersReducedMotion: boolean) {
  return function ActiveShape(props: ActiveShapeProps) {
    const {
      cx = 0,
      cy = 0,
      innerRadius = 0,
      outerRadius = 0,
      startAngle = 0,
      endAngle = 0,
      fill,
    } = props;
    // Spec: 1.02× scale outward. For our 220px donut (outerR ≈ 106px) that's
    // ~+2.1px; we use +4px for crisper paper-feel separation per static ref.
    const expanded = prefersReducedMotion ? outerRadius : outerRadius + 4;
    return (
      <g>
        {/* 4px glow rim — sits just outside the (possibly scaled) outer edge. */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={expanded}
          outerRadius={expanded + 4}
          startAngle={startAngle}
          endAngle={endAngle}
          fill="var(--accent-glow)"
          stroke="none"
        />
        {/* Active slice itself, optionally scaled. */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={expanded}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="none"
        />
      </g>
    );
  };
}

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
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const onIndexChange = useCallback((next: number) => setActiveIndex(next), []);
  useChartKeyboardNav(containerRef, payload.segments.length, onIndexChange);

  // Recharts 3.x dropped explicit `activeIndex` on `<Pie>`; the library now
  // drives `activeShape` internally from its hover/tooltip state. We keep the
  // local `hoverIndex` purely so other parts of the renderer (e.g. tooltip
  // suppression in tests) can observe pointer state without round-tripping
  // through Recharts.
  void hoverIndex;
  const activeShapeRenderer = makeActiveShape(prefersReducedMotion);

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
              animationEasing="ease-out"
              activeShape={activeShapeRenderer}
              onMouseEnter={(_, i) => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
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
