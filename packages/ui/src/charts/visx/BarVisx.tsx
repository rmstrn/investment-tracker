'use client';

/**
 * BarVisx — visx-powered bar chart (D1 dialect).
 *
 * v5.1 cleanup: candy-era artifacts (hard 5px ink-shadow drop, hover-lift
 * depth change, candy tooltip box-shadow) removed per PO directive «много
 * артефактов от предыдущих». D1 register is flat-fill bars with hover
 * NO-OP on data display (tooltip triggers stay; visual depth change does
 * not). Top-only 8px corner radius via hand-rolled SVG path preserved
 * (visx `<Bar>` doesn't expose per-corner radii).
 *
 * Library boundary:
 *   - `scaleBand` / `scaleLinear` from `@visx/scale`
 *   - `<Group>` from `@visx/group` for translation
 *   - Bars rendered as inline `<path>` because top-only corner radius is
 *     not in `@visx/shape`'s `<Bar>` API.
 *
 * Drift fixture pattern: bars within the rebalance band get neutral
 * ink-on-canvas at 0.55 alpha, out-of-band bars get the full signal
 * treatment. Threshold = ±2pp (CHARTS_SPEC §5.4 «drift band»).
 */

import type { BarChartPayload } from '@investment-tracker/shared-types/charts';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { type CSSProperties, useEffect, useId, useState } from 'react';
import { ChartDataTable } from '../_shared/ChartDataTable';
import { CHART_FOCUS_RING_CLASS } from '../_shared/a11y';
import { formatValue } from '../_shared/formatters';
import { useReducedMotion } from '../_shared/useReducedMotion';

/* ────────────────────────────────────────────────────────────────────── */
/* Types                                                                   */
/* ────────────────────────────────────────────────────────────────────── */

export interface BarVisxProps {
  payload: BarChartPayload;
  /** SVG width (defaults to 100% via container). Optional explicit pin. */
  width?: number;
  height?: number;
  /**
   * When `true` paints a chunky Bagel value label above each bar. Default
   * `false` — keep bar tops clean and let the tooltip carry the value on
   * hover.
   */
  showValueLabels?: boolean;
  className?: string;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Constants                                                               */
/* ────────────────────────────────────────────────────────────────────── */

/** Drift threshold (percentage points). Matches CHARTS_SPEC §5.4. */
const DRIFT_BAND_PP = 2;

/** Top-corner radius. */
const BAR_RADIUS = 8;

/** Entrance — bars rise from baseline, deliberate easing (720ms). */
const ENTRANCE_DURATION_MS = 720;
/** Per-bar stagger. */
const ENTRANCE_STAGGER_MS = 60;
/** Spring-soft cubic-bezier (matches `--motion-easing-spring-soft`). */
function easeSpringSoft(t: number): number {
  // Cubic-bezier(0.34, 1.56, 0.64, 1) approximated. We use a closed-form
  // approximation that mirrors the same overshoot character without
  // pulling in a bezier solver.
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const s = 1.70158;
  const t1 = t - 1;
  return t1 * t1 * ((s + 1) * t1 + s) + 1;
}

const TOOLTIP_STYLE: CSSProperties = {
  position: 'absolute',
  pointerEvents: 'none',
  background: 'var(--card, var(--bg-cream, #FFF8E7))',
  color: 'var(--ink, var(--text-on-candy, #1C1B26))',
  border: '1px solid var(--chart-tooltip-border, rgba(255,255,255,0.06))',
  borderRadius: 8,
  padding: '6px 10px',
  fontFamily: "var(--font-family-body, 'Manrope', system-ui, sans-serif)",
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.3,
  whiteSpace: 'nowrap',
  transform: 'translate(-50%, -100%)',
  zIndex: 2,
};

const TOOLTIP_LABEL_STYLE: CSSProperties = {
  fontFamily: "var(--font-family-mono, 'Geist Mono', ui-monospace, SFMono-Regular, monospace)",
  fontSize: 10,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontWeight: 500,
  opacity: 0.7,
  marginBottom: 2,
};

const VALUE_LABEL_STYLE: CSSProperties = {
  fontFamily: "var(--font-family-display, 'Bagel Fat One', sans-serif)",
  fontWeight: 400,
  fontSize: 14,
  fill: 'var(--text-on-candy, #1C1B26)',
  fontVariantNumeric: 'tabular-nums',
};

const AXIS_LABEL_STYLE: CSSProperties = {
  fontFamily: "var(--font-family-mono, 'Geist Mono', ui-monospace, SFMono-Regular, monospace)",
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
  showValueLabels = false,
  className,
}: BarVisxProps) {
  const dataTableId = useId();
  const prefersReducedMotion = useReducedMotion();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // ─── Entrance progress in ms ─────────────────────────────────────────
  const [entranceMs, setEntranceMs] = useState<number>(
    prefersReducedMotion ? Number.POSITIVE_INFINITY : 0,
  );
  useEffect(() => {
    if (prefersReducedMotion) {
      setEntranceMs(Number.POSITIVE_INFINITY);
      return;
    }
    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number): void => {
      const elapsed = now - t0;
      setEntranceMs(elapsed);
      const ceiling =
        ENTRANCE_DURATION_MS + ENTRANCE_STAGGER_MS * Math.max(0, payload.data.length - 1) + 80;
      if (elapsed < ceiling) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion, payload.data.length]);

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

  // ─── Tooltip data for the hovered bar ────────────────────────────────
  const yFormat = payload.yAxis?.format ?? 'currency-compact';
  const tooltipDatum =
    hoverIndex !== null && hoverIndex >= 0 && hoverIndex < data.length ? data[hoverIndex] : null;

  return (
    <div
      role="img"
      aria-label={ariaLabelText}
      aria-describedby={dataTableId}
      data-testid="chart-bar-visx"
      data-chart-backend="visx"
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%', position: 'relative' }}
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
                <text x={-8} y={ty} dy="0.32em" textAnchor="end" style={AXIS_LABEL_STYLE}>
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
            const fullBarH = Math.abs(yScale(yValue) - zeroY);

            // Per-bar entrance progress.
            const segStart = i * ENTRANCE_STAGGER_MS;
            const localElapsed = entranceMs - segStart;
            const rawProgress =
              localElapsed <= 0
                ? 0
                : localElapsed >= ENTRANCE_DURATION_MS
                  ? 1
                  : localElapsed / ENTRANCE_DURATION_MS;
            const progress = easeSpringSoft(rawProgress);
            const barH = Math.max(0.001, fullBarH * progress);
            const barTop = isPositive ? zeroY - barH : zeroY;

            // Drift fixture treatment: in-band = neutral ink, out-of-band
            // = full candy ink + signal-orange.
            const isDriftFixture = payload.yAxis?.format === 'percent-delta';
            const isInBand = isDriftFixture && Math.abs(yValue) <= DRIFT_BAND_PP;
            const fill = isInBand
              ? 'var(--text-on-candy, #1C1B26)'
              : isPositive
                ? 'var(--cta-fill, var(--accent, #F08A3C))'
                : 'var(--accent-deep, var(--cta-shadow, #C9601E))';
            const fillOpacity = isInBand ? 0.55 : 1;

            const finalPath = topRoundedBarPath(
              bandX,
              barTop,
              bandW,
              barH,
              BAR_RADIUS,
              !isPositive,
            );

            const isHover = hoverIndex === i;

            // Optional value label above the bar (positive bars only —
            // negative bars get their label below in the same offset
            // direction).
            const labelY = isPositive ? barTop - 6 : barTop + barH + 14;

            // v5.1: hover-NO-OP on data — handlers trigger tooltip but
            // visual depth/lift is gone. Cursor stays default.
            return (
              <g
                key={`bar-${xValue}`}
                data-segment-index={i}
                data-active={isHover || undefined}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {/* Coloured bar (v5.1: shadow path removed). */}
                <path d={finalPath} fill={fill} fillOpacity={fillOpacity} />
                {showValueLabels && progress >= 1 ? (
                  <text
                    x={bandX + bandW / 2}
                    y={labelY}
                    textAnchor="middle"
                    style={VALUE_LABEL_STYLE}
                  >
                    {formatValue(yValue, yFormat, payload.yAxis?.currency)}
                  </text>
                ) : null}
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

      {tooltipDatum
        ? (() => {
            const tx = (xScale(String(tooltipDatum.x)) ?? 0) + xScale.bandwidth() / 2 + margin.left;
            const ty =
              (Number(tooltipDatum.y) >= 0 ? yScale(Number(tooltipDatum.y)) : zeroY) + margin.top;
            return (
              <div
                role="tooltip"
                aria-hidden="true"
                style={{
                  ...TOOLTIP_STYLE,
                  // px units; left/top in svg-coords map 1:1 because we
                  // render at intrinsic width/height (no CSS scale).
                  left: `${(tx / width) * 100}%`,
                  top: ty - 8,
                }}
              >
                <div style={TOOLTIP_LABEL_STYLE}>{String(tooltipDatum.x)}</div>
                <div>{formatValue(Number(tooltipDatum.y), yFormat, payload.yAxis?.currency)}</div>
              </div>
            );
          })()
        : null}

      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
