'use client';

/**
 * WaterfallVisx — visx-powered candy-themed waterfall chart.
 *
 * Phase C of the visx-candy migration. PD-flagged showcase chart: the
 * ending-balance bar is a chunky pill container with a Bagel Fat One
 * numeral painted INSIDE it. This is, per PD, «the chunkiest visual
 * moment in the product».
 *
 * Library boundary:
 *   - `scaleBand` / `scaleLinear` from `@visx/scale`
 *   - `<Group>` from `@visx/group` for translation
 *   - Bars rendered as inline SVG rects/paths (not `<Bar>` from
 *     `@visx/shape`) because we need per-corner radius control + the
 *     pill-container treatment for the ending bar.
 *
 * Visual signature (CHARTS_VISX_CANDY_SPEC §10 «Waterfall»):
 *   - Start anchor + End anchor: full-height ink-on-cream paper-press
 *     blocks. Ending block carries the Bagel hero numeral inside.
 *   - Positive contributors: signal-orange floating bars rising from the
 *     previous running total.
 *   - Negative contributors: accent-deep floating bars dropping from the
 *     previous running total.
 *   - Connector bridges: embossed-groove pattern (2 stacked 1px lines,
 *     ink-shadow then card-highlight, 1px offset) — same pattern as the
 *     V2 ReferenceLine.
 *   - Hard ink-shadow drop on every bar.
 *   - Hover each bar lifts independently with tooltip (delta + running
 *     cumulative total).
 *   - Entrance: bars draw left-to-right with spring-soft 640ms, 100ms
 *     stagger. Pill numeral fades in after the ending bar lands.
 *   - Reduced motion: hover lift + entrance disabled.
 */

import type { WaterfallPayload, WaterfallStep } from '@investment-tracker/shared-types/charts';
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

export interface WaterfallVisxProps {
  payload: WaterfallPayload;
  width?: number;
  height?: number;
  className?: string;
}

type BarKind = 'anchor-start' | 'anchor-end' | 'positive' | 'negative';

interface BarLayout {
  step: WaterfallStep;
  index: number;
  kind: BarKind;
  /** Top y of the bar in inner-frame coords. */
  y: number;
  /** Height of the bar in pixels. */
  h: number;
  /** Running total *after* this step. Used for tooltip + connectors. */
  runningTotal: number;
  /** Running total *before* this step (= the previous bar's top). Used
   *  for the connector bridge starting at this bar's left edge. */
  runningTotalBefore: number;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Constants                                                               */
/* ────────────────────────────────────────────────────────────────────── */

const SHADOW_OFFSET_X = 2;
const SHADOW_OFFSET_Y = 4;
const HOVER_LIFT_PX = 2;
const HOVER_TRANSITION =
  'transform 220ms var(--motion-easing-spring-soft, cubic-bezier(0.34, 1.56, 0.64, 1))';
const BAR_RADIUS = 8;

/** Entrance timing (640ms per bar, 100ms stagger, +200ms overshoot for end). */
const ENTRANCE_DURATION_MS = 640;
const ENTRANCE_STAGGER_MS = 100;
const PILL_NUMERAL_FADE_MS = 320;

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
  fontFamily: "var(--font-family-mono, 'Geist Mono', ui-monospace, SFMono-Regular, monospace)",
  fontSize: 10,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontWeight: 500,
  opacity: 0.7,
  marginBottom: 2,
};

const TOOLTIP_RUNNING_STYLE: CSSProperties = {
  fontFamily: "var(--font-family-mono, 'Geist Mono', ui-monospace, SFMono-Regular, monospace)",
  fontSize: 10,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontWeight: 500,
  opacity: 0.7,
  marginTop: 4,
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

const PILL_NUMERAL_STYLE: CSSProperties = {
  fontFamily: "var(--font-family-display, 'Bagel Fat One', sans-serif)",
  fontWeight: 400,
  fontSize: 'clamp(28px, 4vw, 44px)',
  letterSpacing: '-0.01em',
  fill: 'var(--bg-cream, #FFF8E7)',
  fontVariantNumeric: 'tabular-nums',
};

/* ────────────────────────────────────────────────────────────────────── */
/* Helpers                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

/** Path-d for a fully-rounded rect (all four corners) — pill / chunky bar. */
function roundedRectPath(x: number, y: number, width: number, height: number, r: number): string {
  const radius = Math.min(r, width / 2, Math.max(0.001, height) / 2);
  return [
    `M ${x + radius} ${y}`,
    `H ${x + width - radius}`,
    `Q ${x + width} ${y} ${x + width} ${y + radius}`,
    `V ${y + height - radius}`,
    `Q ${x + width} ${y + height} ${x + width - radius} ${y + height}`,
    `H ${x + radius}`,
    `Q ${x} ${y + height} ${x} ${y + height - radius}`,
    `V ${y + radius}`,
    `Q ${x} ${y} ${x + radius} ${y}`,
    'Z',
  ].join(' ');
}

/* ────────────────────────────────────────────────────────────────────── */
/* Component                                                               */
/* ────────────────────────────────────────────────────────────────────── */

export function WaterfallVisx({
  payload,
  width = 720,
  height = 280,
  className,
}: WaterfallVisxProps) {
  const dataTableId = useId();
  const prefersReducedMotion = useReducedMotion();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const steps = payload.steps;

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
        ENTRANCE_STAGGER_MS * Math.max(0, steps.length - 1) +
        PILL_NUMERAL_FADE_MS +
        80;
      if (elapsed < ceiling) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion, steps.length]);

  // ─── Layout ──────────────────────────────────────────────────────────
  const margin = { top: 36, right: 18, bottom: 32, left: 56 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // ─── Build running-total walk + bar layouts ──────────────────────────
  // Anchor steps (`start` / `end`) carry the absolute value in deltaAbs.
  // Intermediates carry signed deltas. Running total walks from
  // startValue through intermediates and lands at endValue.
  let runningTotal = 0;
  const layouts: BarLayout[] = steps.map((step, i) => {
    const isStart = step.componentType === 'start';
    const isEnd = step.componentType === 'end';
    const before = runningTotal;
    let kind: BarKind;
    if (isStart) {
      runningTotal = step.deltaAbs;
      kind = 'anchor-start';
    } else if (isEnd) {
      runningTotal = step.deltaAbs;
      kind = 'anchor-end';
    } else {
      runningTotal = runningTotal + step.deltaAbs;
      kind = step.deltaAbs >= 0 ? 'positive' : 'negative';
    }
    return {
      step,
      index: i,
      kind,
      y: 0,
      h: 0,
      runningTotal,
      runningTotalBefore: before,
    };
  });

  // ─── Y-domain ────────────────────────────────────────────────────────
  // For a typical YTD waterfall the values are large (220k–250k). Anchor
  // y-domain to [0, max anchor + 5% headroom] so the absolute scale reads
  // correctly. Intermediates float between the previous and current
  // running totals (they sit at the «delta band» of the chart).
  const allValues = layouts.flatMap((l) => [l.runningTotalBefore, l.runningTotal]);
  const yMin = Math.min(0, ...allValues);
  const yMax = Math.max(...allValues);

  const xScale = scaleBand<string>({
    domain: layouts.map((l) => l.step.key),
    range: [0, innerWidth],
    padding: 0.32,
  });
  const yScale = scaleLinear<number>({
    domain: [yMin, yMax * 1.05],
    range: [innerHeight, 0],
    nice: true,
  });
  const yTicks = yScale.ticks(4);
  const zeroY = yScale(0);

  // Resolve actual bar y/h per kind.
  const resolvedLayouts: BarLayout[] = layouts.map((l) => {
    if (l.kind === 'anchor-start' || l.kind === 'anchor-end') {
      // Anchor bar = full block from baseline to running total.
      const top = yScale(l.runningTotal);
      const bottom = zeroY;
      return { ...l, y: top, h: Math.max(2, bottom - top) };
    }
    // Floating delta bar between runningTotalBefore and runningTotal.
    const top = yScale(Math.max(l.runningTotal, l.runningTotalBefore));
    const bottom = yScale(Math.min(l.runningTotal, l.runningTotalBefore));
    return { ...l, y: top, h: Math.max(2, bottom - top) };
  });

  // ─── Entrance progress per bar ──────────────────────────────────────
  function barProgress(i: number): number {
    const segStart = i * ENTRANCE_STAGGER_MS;
    const localElapsed = entranceMs - segStart;
    if (localElapsed <= 0) return 0;
    if (localElapsed >= ENTRANCE_DURATION_MS) return 1;
    return easeSpringSoft(localElapsed / ENTRANCE_DURATION_MS);
  }

  // Pill numeral fade: starts when the LAST bar lands.
  const lastBarLandsMs = (steps.length - 1) * ENTRANCE_STAGGER_MS + ENTRANCE_DURATION_MS;
  const pillElapsed = entranceMs - lastBarLandsMs;
  const pillOpacity = prefersReducedMotion
    ? 1
    : pillElapsed <= 0
      ? 0
      : pillElapsed >= PILL_NUMERAL_FADE_MS
        ? 1
        : pillElapsed / PILL_NUMERAL_FADE_MS;

  const yFormat = 'currency-compact';
  const ariaLabelText = payload.meta.alt ?? payload.meta.title;

  const hoveredLayout = hoverIndex !== null ? (resolvedLayouts[hoverIndex] ?? null) : null;

  return (
    <div
      role="img"
      aria-label={ariaLabelText}
      aria-describedby={dataTableId}
      data-testid="chart-waterfall-visx"
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
                  {formatValue(tick, yFormat, payload.currency)}
                </text>
              </g>
            );
          })}

          {/* Connector bridges — embossed-groove (ink hairline + cream
              highlight). Drawn between consecutive bars at the previous
              bar's top edge. Not drawn before the start anchor. */}
          {resolvedLayouts.slice(1).map((curr, idx) => {
            const prev = resolvedLayouts[idx];
            if (!prev) return null;
            const progress = barProgress(curr.index);
            if (progress <= 0) return null;
            const prevX = (xScale(prev.step.key) ?? 0) + xScale.bandwidth();
            const currX = xScale(curr.step.key) ?? 0;
            // Bridge sits at the previous bar's TOP edge (which is also
            // the y of the running total at that point in the walk).
            const bridgeY = yScale(prev.runningTotal);
            return (
              <g key={`bridge-${curr.step.key}`}>
                <line
                  x1={prevX}
                  x2={currX}
                  y1={bridgeY}
                  y2={bridgeY}
                  stroke="var(--text-on-candy, #1C1B26)"
                  strokeOpacity={0.45}
                  strokeWidth={1}
                  strokeDasharray="2 3"
                />
                <line
                  x1={prevX}
                  x2={currX}
                  y1={bridgeY + 1}
                  y2={bridgeY + 1}
                  stroke="var(--card-highlight, rgba(255,255,255,0.55))"
                  strokeWidth={1}
                  strokeDasharray="2 3"
                />
              </g>
            );
          })}

          {/* Bars */}
          {resolvedLayouts.map((l) => {
            const bandX = xScale(l.step.key) ?? 0;
            const bandW = xScale.bandwidth();
            const progress = barProgress(l.index);
            if (progress <= 0) return null;

            // Animated height — bar grows from its bottom edge up.
            const animatedH = Math.max(0.001, l.h * progress);
            const animatedY = l.y + (l.h - animatedH);

            const fill =
              l.kind === 'anchor-start' || l.kind === 'anchor-end'
                ? 'var(--text-on-candy, #1C1B26)'
                : l.kind === 'positive'
                  ? 'var(--cta-fill, var(--accent, #F08A3C))'
                  : 'var(--accent-deep, var(--cta-shadow, #C9601E))';

            const isHover = hoverIndex === l.index;
            const lift =
              isHover && !prefersReducedMotion
                ? `translate(${-HOVER_LIFT_PX}px, ${-HOVER_LIFT_PX}px)`
                : 'translate(0, 0)';

            const path = roundedRectPath(bandX, animatedY, bandW, animatedH, BAR_RADIUS);

            const isEndAnchor = l.kind === 'anchor-end';

            return (
              <g
                key={`bar-${l.step.key}`}
                data-segment-index={l.index}
                data-active={isHover || undefined}
                onMouseEnter={() => setHoverIndex(l.index)}
                onMouseLeave={() => setHoverIndex(null)}
                style={{
                  transform: lift,
                  transition: prefersReducedMotion ? undefined : HOVER_TRANSITION,
                  cursor: 'pointer',
                }}
              >
                {/* Hard ink-shadow drop */}
                <path
                  d={path}
                  fill="var(--text-on-candy, #1C1B26)"
                  fillOpacity={0.85}
                  transform={`translate(${SHADOW_OFFSET_X} ${SHADOW_OFFSET_Y})`}
                />
                {/* Coloured bar on top */}
                <path d={path} fill={fill} />
                {/* PD signature: ending-balance bar = pill container with
                    Bagel Fat One numeral inside. Cream-on-orange. Fades in
                    after the bar lands as the «hero moment». */}
                {isEndAnchor && progress >= 1 ? (
                  <text
                    x={bandX + bandW / 2}
                    y={animatedY + animatedH / 2}
                    dy="0.36em"
                    textAnchor="middle"
                    style={{ ...PILL_NUMERAL_STYLE, opacity: pillOpacity }}
                  >
                    {formatValue(payload.endValue, yFormat, payload.currency)}
                  </text>
                ) : null}
              </g>
            );
          })}

          {/* X-axis labels */}
          {resolvedLayouts.map((l) => {
            const bandX = xScale(l.step.key) ?? 0;
            const bandW = xScale.bandwidth();
            return (
              <text
                key={`xlabel-${l.step.key}`}
                x={bandX + bandW / 2}
                y={innerHeight + 18}
                textAnchor="middle"
                style={AXIS_LABEL_STYLE}
              >
                {l.step.label}
              </text>
            );
          })}
        </Group>
      </svg>

      {hoveredLayout
        ? (() => {
            const tx = (xScale(hoveredLayout.step.key) ?? 0) + xScale.bandwidth() / 2 + margin.left;
            const ty = hoveredLayout.y + margin.top;
            const isAnchor =
              hoveredLayout.kind === 'anchor-start' || hoveredLayout.kind === 'anchor-end';
            return (
              <div
                role="tooltip"
                aria-hidden="true"
                style={{
                  ...TOOLTIP_STYLE,
                  left: `${(tx / width) * 100}%`,
                  top: ty - 8,
                }}
              >
                <div style={TOOLTIP_LABEL_STYLE}>{hoveredLayout.step.label}</div>
                <div>
                  {isAnchor
                    ? formatValue(hoveredLayout.step.deltaAbs, yFormat, payload.currency)
                    : `${hoveredLayout.step.deltaAbs >= 0 ? '+' : '−'}${formatValue(
                        Math.abs(hoveredLayout.step.deltaAbs),
                        yFormat,
                        payload.currency,
                      )}`}
                </div>
                <div style={TOOLTIP_RUNNING_STYLE}>
                  Running · {formatValue(hoveredLayout.runningTotal, yFormat, payload.currency)}
                </div>
              </div>
            );
          })()
        : null}

      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
