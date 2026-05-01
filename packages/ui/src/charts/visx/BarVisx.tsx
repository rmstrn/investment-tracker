'use client';

/**
 * BarVisx — visx-powered candy-themed bar chart (POC).
 *
 * Pre-migration POC. Does not replace `BarChartV2`. Lives next to the v2
 * primitives so PO can compare side-by-side at `/design-system#charts`
 * vs `/design-system#charts-visx`.
 *
 * Visual register: candy. Hard 5px ink-shadow drop on each bar (offset
 * `2px, 4px`, ink-deep at 0.85 opacity), top-only 8px corner radius via
 * a hand-rolled SVG path (visx `<Bar>` doesn't expose per-corner radii),
 * Manrope mono-uppercase axis labels, embossed-groove reference line for
 * the rebalance band.
 *
 * Library boundary:
 *   - `scaleBand` / `scaleLinear` from `@visx/scale`
 *   - `<Group>` from `@visx/group` for translation
 *   - Bars rendered as inline `<path>` because top-only corner radius is
 *     not in `@visx/shape`'s `<Bar>` API. We keep the data + scale
 *     plumbing on the visx side and only the path-d construction local.
 *
 * Drift fixture pattern: bars within the rebalance band get neutral
 * ink-on-candy at 0.55 alpha, out-of-band bars get the full signal-orange
 * candy treatment. Threshold = ±2pp (CHARTS_SPEC §5.4 «drift band»).
 *
 * Reduced motion: hover lift disabled.
 */

import type { BarChartPayload } from '@investment-tracker/shared-types/charts';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { type CSSProperties, useId, useState } from 'react';
import { CHART_FOCUS_RING_CLASS } from '../_shared/a11y';
import { ChartDataTable } from '../_shared/ChartDataTable';
import { useReducedMotion } from '../_shared/useReducedMotion';

/* ────────────────────────────────────────────────────────────────────── */
/* Types                                                                   */
/* ────────────────────────────────────────────────────────────────────── */

export interface BarVisxProps {
  payload: BarChartPayload;
  /** SVG width (defaults to 100% via container). Optional explicit pin. */
  width?: number;
  height?: number;
  className?: string;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Constants                                                               */
/* ────────────────────────────────────────────────────────────────────── */

/** Drift threshold (percentage points). Matches CHARTS_SPEC §5.4. */
const DRIFT_BAND_PP = 2;

/** Hard ink shadow offset — signature paper-press feel. */
const SHADOW_OFFSET_X = 2;
const SHADOW_OFFSET_Y = 4;

/** Hover lift translation. */
const HOVER_LIFT_PX = 2;

/** Spring-soft easing — playful overshoot per design-system §5. */
const HOVER_TRANSITION =
  'transform 220ms var(--motion-easing-spring-soft, cubic-bezier(0.34, 1.56, 0.64, 1))';

/** Top-corner radius (chunky candy). */
const BAR_RADIUS = 8;

const AXIS_LABEL_STYLE: CSSProperties = {
  fontFamily:
    "var(--font-family-mono, 'Geist Mono', ui-monospace, SFMono-Regular, monospace)",
  fontSize: 10,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontVariantNumeric: 'tabular-nums',
  fill: 'var(--text-on-candy, var(--color-text-secondary, #1C1B26))',
  opacity: 0.7,
};

/* ────────────────────────────────────────────────────────────────────── */
/* Helpers                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

/**
 * Path-d for a rect with top-only rounded corners. Bars grow either up
 * (positive y) or down (negative y) from the zero baseline; round the
 * corners that face away from the baseline.
 */
function topRoundedBarPath(
  x: number,
  y: number,
  width: number,
  height: number,
  r: number,
  flipForNegative: boolean,
): string {
  const radius = Math.min(r, width / 2, Math.abs(height) / 2);
  if (flipForNegative) {
    // Round the bottom corners (bar goes down from zero line).
    const top = y;
    const bottom = y + height;
    return [
      `M ${x} ${top}`,
      `H ${x + width}`,
      `V ${bottom - radius}`,
      `Q ${x + width} ${bottom} ${x + width - radius} ${bottom}`,
      `H ${x + radius}`,
      `Q ${x} ${bottom} ${x} ${bottom - radius}`,
      'Z',
    ].join(' ');
  }
  // Round the top corners (default — bar grows upward).
  const top = y;
  const bottom = y + height;
  return [
    `M ${x + radius} ${top}`,
    `H ${x + width - radius}`,
    `Q ${x + width} ${top} ${x + width} ${top + radius}`,
    `V ${bottom}`,
    `H ${x}`,
    `V ${top + radius}`,
    `Q ${x} ${top} ${x + radius} ${top}`,
    'Z',
  ].join(' ');
}

/* ────────────────────────────────────────────────────────────────────── */
/* Component                                                               */
/* ────────────────────────────────────────────────────────────────────── */

export function BarVisx({
  payload,
  width = 360,
  height = 220,
  className,
}: BarVisxProps) {
  const dataTableId = useId();
  const prefersReducedMotion = useReducedMotion();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // ─── Layout ──────────────────────────────────────────────────────────
  const margin = { top: 12, right: 12, bottom: 28, left: 36 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // ─── Data ────────────────────────────────────────────────────────────
  const data = payload.data;
  const yValues = data.map((d) => Number(d.y));
  const yMin = Math.min(0, ...yValues);
  const yMax = Math.max(0, ...yValues);

  // ─── Scales ──────────────────────────────────────────────────────────
  const xScale = scaleBand<string>({
    domain: data.map((d) => String(d.x)),
    range: [0, innerWidth],
    padding: 0.32,
  });

  const yScale = scaleLinear<number>({
    domain: [yMin * 1.15, yMax * 1.15],
    range: [innerHeight, 0],
    nice: true,
  });

  const zeroY = yScale(0);

  // ─── Axis ticks ──────────────────────────────────────────────────────
  // Y-axis: 4 evenly-spaced ticks across the domain.
  const yTicks = yScale.ticks(4);

  const ariaLabelText = payload.meta.alt ?? payload.meta.title;

  return (
    <div
      role="img"
      aria-label={ariaLabelText}
      aria-describedby={dataTableId}
      data-testid="chart-bar-visx"
      data-chart-backend="visx"
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%' }}
      onMouseLeave={() => setHoverIndex(null)}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        focusable="false"
        style={{ overflow: 'visible', maxWidth: '100%', height: 'auto' }}
      >
        <Group top={margin.top} left={margin.left}>
          {/* Y-axis ticks + gridlines */}
          {yTicks.map((tick) => {
            const ty = yScale(tick);
            return (
              <g key={`y-${tick}`}>
                <line
                  x1={0}
                  x2={innerWidth}
                  y1={ty}
                  y2={ty}
                  stroke="var(--text-on-candy, #1C1B26)"
                  strokeOpacity={0.08}
                  strokeWidth={1}
                />
                <text
                  x={-8}
                  y={ty}
                  dy="0.32em"
                  textAnchor="end"
                  style={AXIS_LABEL_STYLE}
                >
                  {tick > 0 ? `+${tick}` : tick}
                </text>
              </g>
            );
          })}

          {/* Embossed-groove reference line at zero (rebalance baseline).
              Two stacked 1px lines: ink-shadow then card-highlight, 1px
              offset — same pattern as ReferenceLine V2. */}
          <line
            x1={0}
            x2={innerWidth}
            y1={zeroY}
            y2={zeroY}
            stroke="var(--text-on-candy, #1C1B26)"
            strokeOpacity={0.45}
            strokeWidth={1}
          />
          <line
            x1={0}
            x2={innerWidth}
            y1={zeroY + 1}
            y2={zeroY + 1}
            stroke="var(--card-highlight, rgba(255,255,255,0.55))"
            strokeWidth={1}
          />

          {/* Optional rebalance-band guides at +/- DRIFT_BAND_PP */}
          {payload.yAxis?.format === 'percent-delta' ? (
            <>
              {[-DRIFT_BAND_PP, DRIFT_BAND_PP].map((pp) => {
                const ty = yScale(pp);
                if (ty < 0 || ty > innerHeight) return null;
                return (
                  <line
                    key={`band-${pp}`}
                    x1={0}
                    x2={innerWidth}
                    y1={ty}
                    y2={ty}
                    stroke="var(--cta-fill, #F08A3C)"
                    strokeOpacity={0.4}
                    strokeWidth={1}
                    strokeDasharray="3 4"
                  />
                );
              })}
            </>
          ) : null}

          {/* Bars */}
          {data.map((d, i) => {
            const xValue = String(d.x);
            const yValue = Number(d.y);
            const bandX = xScale(xValue) ?? 0;
            const bandW = xScale.bandwidth();
            const isPositive = yValue >= 0;
            const barTop = isPositive ? yScale(yValue) : zeroY;
            const barH = Math.abs(yScale(yValue) - zeroY);

            // Drift fixture treatment: in-band = neutral ink, out-of-band
            // = full candy ink + signal-orange.
            const isDriftFixture =
              payload.yAxis?.format === 'percent-delta';
            const isInBand =
              isDriftFixture && Math.abs(yValue) <= DRIFT_BAND_PP;
            const fill = isInBand
              ? 'var(--text-on-candy, #1C1B26)'
              : isPositive
                ? 'var(--cta-fill, var(--accent, #F08A3C))'
                : 'var(--accent-deep, var(--cta-shadow, #C9601E))';
            const fillOpacity = isInBand ? 0.55 : 1;

            const path = topRoundedBarPath(
              bandX,
              barTop,
              bandW,
              isPositive ? barH : -barH,
              BAR_RADIUS,
              !isPositive,
            );
            // Account for path conventions: positive bar — y=barTop,
            // height=barH; negative bar — start at zeroY going down.
            const negPath = topRoundedBarPath(
              bandX,
              zeroY,
              bandW,
              barH,
              BAR_RADIUS,
              true,
            );
            const finalPath = isPositive ? path : negPath;

            const isHover = hoverIndex === i;
            const lift =
              isHover && !prefersReducedMotion
                ? `translate(${-HOVER_LIFT_PX}px, ${-HOVER_LIFT_PX}px)`
                : 'translate(0, 0)';

            return (
              <g
                key={`bar-${xValue}`}
                data-segment-index={i}
                data-active={isHover || undefined}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                style={{
                  transform: lift,
                  transition: prefersReducedMotion
                    ? undefined
                    : HOVER_TRANSITION,
                  cursor: 'pointer',
                }}
              >
                {/* Hard ink-shadow drop */}
                <path
                  d={finalPath}
                  fill="var(--text-on-candy, #1C1B26)"
                  fillOpacity={isInBand ? 0.4 : 0.85}
                  transform={`translate(${SHADOW_OFFSET_X} ${SHADOW_OFFSET_Y})`}
                  aria-hidden="true"
                />
                {/* Coloured bar on top */}
                <path d={finalPath} fill={fill} fillOpacity={fillOpacity} />
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map((d) => {
            const xValue = String(d.x);
            const bandX = xScale(xValue) ?? 0;
            const bandW = xScale.bandwidth();
            return (
              <text
                key={`xlabel-${xValue}`}
                x={bandX + bandW / 2}
                y={innerHeight + 18}
                textAnchor="middle"
                style={AXIS_LABEL_STYLE}
              >
                {xValue}
              </text>
            );
          })}
        </Group>
      </svg>

      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
