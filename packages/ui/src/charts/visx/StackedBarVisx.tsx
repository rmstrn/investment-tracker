'use client';

/**
 * StackedBarVisx — visx-powered candy-themed stacked bar chart.
 *
 * Phase C of the visx-candy migration. Sibling to `BarVisx`. Each x-position
 * is a vertical pile of category segments. The stack reads as ONE chunky
 * paper-press object, not a tower of independent tiles — so the hard
 * ink-shadow drop is painted ONCE per whole-stack outline and 1px ink
 * hairlines separate segments inside.
 *
 * Library boundary:
 *   - `scaleBand` / `scaleLinear` from `@visx/scale`
 *   - `<Group>` from `@visx/group` for translation
 *   - Stacking math is done locally (cumulative running offset) because we
 *     need fine-grained control over per-segment paths to apply top-only
 *     corner rounding to the highest segment and square corners elsewhere.
 *     `BarStack` from `@visx/shape` would render uniform-corner rects.
 *
 * Visual signature (CHARTS_VISX_CANDY_SPEC §9 «Stacked Bar»):
 *   - One ink-shadow drop per whole stack.
 *   - 1px ink hairline between segments at 0.45 alpha.
 *   - Top segment carries 8px top-only corner radius; intermediate +
 *     bottom segments are square.
 *   - Segment fills from `--chart-series-1..5` token palette.
 *   - Whole stack lifts on hover; per-segment tooltip on hover within a
 *     stack.
 *   - Entrance: stacks rise from baseline 720ms spring-soft, staggered
 *     80ms per stack.
 *   - Reduced motion: hover lift + entrance disabled.
 */

import type { StackedBarChartPayload } from '@investment-tracker/shared-types/charts';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { type CSSProperties, useEffect, useId, useState } from 'react';
import { CHART_FOCUS_RING_CLASS } from '../_shared/a11y';
import { ChartDataTable } from '../_shared/ChartDataTable';
import { formatValue } from '../_shared/formatters';
import { useReducedMotion } from '../_shared/useReducedMotion';

/* ────────────────────────────────────────────────────────────────────── */
/* Types                                                                   */
/* ────────────────────────────────────────────────────────────────────── */

export interface StackedBarVisxProps {
  payload: StackedBarChartPayload;
  width?: number;
  height?: number;
  className?: string;
}

interface HoverTarget {
  stackIndex: number;
  seriesKey: string;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Constants                                                               */
/* ────────────────────────────────────────────────────────────────────── */

const SHADOW_OFFSET_X = 2;
const SHADOW_OFFSET_Y = 4;
const HOVER_LIFT_PX = 2;
const HOVER_TRANSITION =
  'transform 220ms var(--motion-easing-spring-soft, cubic-bezier(0.34, 1.56, 0.64, 1))';
const STACK_TOP_RADIUS = 8;

/** Entrance: each stack rises full-height in 720ms, 80ms per-stack stagger. */
const ENTRANCE_DURATION_MS = 720;
const ENTRANCE_STAGGER_MS = 80;

function easeSpringSoft(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const s = 1.70158;
  const t1 = t - 1;
  return t1 * t1 * ((s + 1) * t1 + s) + 1;
}

const TOOLTIP_STYLE: CSSProperties = {
  position: 'absolute',
  pointerEvents: 'none',
  background: 'var(--bg-cream, var(--card, #FFF8E7))',
  color: 'var(--text-on-candy, var(--ink, #1C1B26))',
  border: '1.5px solid var(--text-on-candy, #1C1B26)',
  borderRadius: 8,
  padding: '6px 10px',
  fontFamily: "var(--font-family-body, 'Manrope', system-ui, sans-serif)",
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.3,
  whiteSpace: 'nowrap',
  boxShadow: '5px 5px 0 0 var(--text-on-candy, #1C1B26)',
  transform: 'translate(-50%, -100%)',
  zIndex: 2,
};

const TOOLTIP_LABEL_STYLE: CSSProperties = {
  fontFamily:
    "var(--font-family-mono, 'Geist Mono', ui-monospace, SFMono-Regular, monospace)",
  fontSize: 10,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontWeight: 500,
  opacity: 0.7,
  marginBottom: 2,
};

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

/** Series fill rotation — chart-categorical-1..5 token palette. */
const SERIES_FILL_TOKENS = [
  'var(--chart-categorical-1, var(--chart-series-1, #2C7A6B))',
  'var(--chart-categorical-2, var(--chart-series-2, #C25E2A))',
  'var(--chart-categorical-3, var(--chart-series-3, #1C1B26))',
  'var(--chart-categorical-4, var(--chart-series-4, #4FA590))',
  'var(--chart-categorical-5, var(--chart-series-5, #8C6447))',
] as const;

/* ────────────────────────────────────────────────────────────────────── */
/* Helpers                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

/**
 * Path-d for a rect with top-only rounded corners (bar grows up from
 * baseline). Used for both the whole-stack outline (shadow + clip) AND for
 * the topmost segment fill.
 */
function topRoundedRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  r: number,
): string {
  const radius = Math.min(r, width / 2, Math.max(0.001, height) / 2);
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

export function StackedBarVisx({
  payload,
  width = 360,
  height = 220,
  className,
}: StackedBarVisxProps) {
  const dataTableId = useId();
  const clipId = useId();
  const prefersReducedMotion = useReducedMotion();
  const [hover, setHover] = useState<HoverTarget | null>(null);

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
        ENTRANCE_DURATION_MS +
        ENTRANCE_STAGGER_MS * Math.max(0, payload.data.length - 1) +
        80;
      if (elapsed < ceiling) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion, payload.data.length]);

  // ─── Layout ──────────────────────────────────────────────────────────
  const margin = { top: 12, right: 12, bottom: 28, left: 44 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const data = payload.data;
  const series = payload.series;

  // ─── Per-stack totals ────────────────────────────────────────────────
  const totals = data.map((row) =>
    series.reduce((acc, s) => acc + Number(row[s.key] ?? 0), 0),
  );
  const yMax = Math.max(0, ...totals);

  // ─── Scales ──────────────────────────────────────────────────────────
  const xScale = scaleBand<string>({
    domain: data.map((d) => String(d.x)),
    range: [0, innerWidth],
    padding: 0.32,
  });
  const yScale = scaleLinear<number>({
    domain: [0, yMax * 1.15],
    range: [innerHeight, 0],
    nice: true,
  });
  const zeroY = yScale(0);
  const yTicks = yScale.ticks(4);

  const yFormat = payload.yAxis?.format ?? 'currency-compact';
  const ariaLabelText = payload.meta.alt ?? payload.meta.title;

  // ─── Tooltip data ────────────────────────────────────────────────────
  const hoveredRow = hover ? data[hover.stackIndex] : null;
  const hoveredSeries = hover
    ? series.find((s) => s.key === hover.seriesKey) ?? null
    : null;
  const hoveredValue =
    hoveredRow && hoveredSeries ? Number(hoveredRow[hoveredSeries.key] ?? 0) : 0;

  return (
    <div
      role="img"
      aria-label={ariaLabelText}
      aria-describedby={dataTableId}
      data-testid="chart-stacked-bar-visx"
      data-chart-backend="visx"
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%', position: 'relative' }}
      onMouseLeave={() => setHover(null)}
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
                  {formatValue(tick, yFormat, payload.yAxis?.currency)}
                </text>
              </g>
            );
          })}

          {/* Zero baseline — ink hairline + cream highlight (embossed-groove). */}
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

          {/* Stacks — one <g> per x-position with shared shadow + clip. */}
          {data.map((row, stackIndex) => {
            const xValue = String(row.x);
            const bandX = xScale(xValue) ?? 0;
            const bandW = xScale.bandwidth();
            const total = totals[stackIndex] ?? 0;
            const fullStackHeight = Math.abs(yScale(total) - zeroY);

            // Per-stack entrance progress.
            const segStart = stackIndex * ENTRANCE_STAGGER_MS;
            const localElapsed = entranceMs - segStart;
            const rawProgress =
              localElapsed <= 0
                ? 0
                : localElapsed >= ENTRANCE_DURATION_MS
                  ? 1
                  : localElapsed / ENTRANCE_DURATION_MS;
            const progress = easeSpringSoft(rawProgress);
            const animatedHeight = Math.max(0.001, fullStackHeight * progress);
            const stackTop = zeroY - animatedHeight;

            // Whole-stack outline path — used for shadow drop + as clip.
            const stackOutlinePath = topRoundedRectPath(
              bandX,
              stackTop,
              bandW,
              animatedHeight,
              STACK_TOP_RADIUS,
            );

            const isStackHover = hover?.stackIndex === stackIndex;
            const lift =
              isStackHover && !prefersReducedMotion
                ? `translate(${-HOVER_LIFT_PX}px, ${-HOVER_LIFT_PX}px)`
                : 'translate(0, 0)';

            // Compute per-segment rects from bottom up. Use the *full*
            // stack scale (not animated height) for segment proportions,
            // then clip to the animated outline so the whole stack rises
            // together rather than each segment rising independently.
            const segScale = total > 0 ? animatedHeight / total : 0;
            let cursorY = zeroY; // bottom-anchored cursor, walks upward
            type Segment = {
              key: string;
              label: string;
              value: number;
              y: number;
              h: number;
              fill: string;
              isTop: boolean;
            };
            const segments: Segment[] = series.map((s, i) => {
              const value = Number(row[s.key] ?? 0);
              const h = value * segScale;
              const yTop = cursorY - h;
              cursorY = yTop;
              const fill =
                SERIES_FILL_TOKENS[i % SERIES_FILL_TOKENS.length] ??
                SERIES_FILL_TOKENS[0];
              return {
                key: s.key,
                label: s.label,
                value,
                y: yTop,
                h,
                fill,
                isTop: false,
              };
            });
            // Mark the topmost non-zero segment.
            for (let i = segments.length - 1; i >= 0; i -= 1) {
              const seg = segments[i];
              if (seg && seg.value > 0) {
                seg.isTop = true;
                break;
              }
            }

            const stackClipId = `${clipId}-stack-${stackIndex}`;

            return (
              <g
                key={`stack-${xValue}`}
                data-segment-index={stackIndex}
                data-active={isStackHover || undefined}
                onMouseLeave={() => setHover(null)}
                style={{
                  transform: lift,
                  transition: prefersReducedMotion ? undefined : HOVER_TRANSITION,
                  cursor: 'pointer',
                }}
              >
                {/* Hard ink-shadow drop — once per whole stack. */}
                <path
                  d={stackOutlinePath}
                  fill="var(--text-on-candy, #1C1B26)"
                  fillOpacity={0.85}
                  transform={`translate(${SHADOW_OFFSET_X} ${SHADOW_OFFSET_Y})`}
                  aria-hidden="true"
                />
                {/* Clip segments + hairlines to the stack outline so the
                    top-only corner radius applies to the assembled stack
                    (not to each segment rect individually). */}
                <defs>
                  <clipPath id={stackClipId}>
                    <path d={stackOutlinePath} />
                  </clipPath>
                </defs>
                <g clipPath={`url(#${stackClipId})`}>
                  {segments.map((seg) => {
                    if (seg.value <= 0) return null;
                    const isHover =
                      isStackHover && hover?.seriesKey === seg.key;
                    return (
                      <g key={`seg-${seg.key}`}>
                        <rect
                          x={bandX}
                          y={seg.y}
                          width={bandW}
                          height={seg.h}
                          fill={seg.fill}
                          fillOpacity={
                            isStackHover && !isHover ? 0.78 : 1
                          }
                          onMouseEnter={() =>
                            setHover({ stackIndex, seriesKey: seg.key })
                          }
                        />
                      </g>
                    );
                  })}
                  {/* Hairline separators between non-zero segments. */}
                  {segments.map((seg, i) => {
                    if (seg.value <= 0 || i === 0) return null;
                    return (
                      <line
                        key={`hair-${seg.key}`}
                        x1={bandX}
                        x2={bandX + bandW}
                        y1={seg.y + seg.h}
                        y2={seg.y + seg.h}
                        stroke="var(--text-on-candy, #1C1B26)"
                        strokeOpacity={0.45}
                        strokeWidth={1}
                        pointerEvents="none"
                      />
                    );
                  })}
                </g>
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

      {hover && hoveredRow && hoveredSeries
        ? (() => {
            const tx =
              (xScale(String(hoveredRow.x)) ?? 0) +
              xScale.bandwidth() / 2 +
              margin.left;
            const stackTotal = totals[hover.stackIndex] ?? 0;
            const stackTopY = yScale(stackTotal) + margin.top;
            return (
              <div
                role="tooltip"
                aria-hidden="true"
                style={{
                  ...TOOLTIP_STYLE,
                  left: `${(tx / width) * 100}%`,
                  top: stackTopY - 8,
                }}
              >
                <div style={TOOLTIP_LABEL_STYLE}>
                  {String(hoveredRow.x)} · {hoveredSeries.label}
                </div>
                <div>
                  {formatValue(hoveredValue, yFormat, payload.yAxis?.currency)}
                </div>
              </div>
            );
          })()
        : null}

      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
