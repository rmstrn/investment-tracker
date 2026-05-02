'use client';

/**
 * LineVisx — visx-powered line chart (D1 dialect).
 *
 * v5.1 cleanup: candy ink-shadow drop (translated path) + end-point shadow
 * circle removed per PO directive «много артефактов». D1 register is a
 * single coloured stroke + flat end-dot. Tooltip dropped its candy
 * box-shadow.
 *
 * Library boundary:
 *   - `scaleTime` / `scaleLinear` from `@visx/scale`
 *   - `<Group>` from `@visx/group` for translation
 *   - Path geometry via `d3-shape`'s `line()` with `curveMonotoneX`.
 *
 * Entrance: stroke-dashoffset draw-in over 1100ms; reduced-motion locks
 * at full. Hover: pointer x → nearest-x bisector → guide-line +
 * focus-circle + tooltip (date + value).
 */

import type { LineChartPayload } from '@investment-tracker/shared-types/charts';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { curveMonotoneX, line as d3Line } from 'd3-shape';
import {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ChartDataTable } from '../_shared/ChartDataTable';
import { CHART_FOCUS_RING_CLASS } from '../_shared/a11y';
import { formatValue, formatXAxis } from '../_shared/formatters';
import { useReducedMotion } from '../_shared/useReducedMotion';

/* ────────────────────────────────────────────────────────────────────── */
/* Types                                                                   */
/* ────────────────────────────────────────────────────────────────────── */

export interface LineVisxProps {
  payload: LineChartPayload;
  width?: number;
  height?: number;
  className?: string;
}

interface ResolvedPoint {
  readonly x: Date;
  readonly y: number;
  readonly xRaw: string | number;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Constants                                                               */
/* ────────────────────────────────────────────────────────────────────── */

const STROKE_WIDTH = 2.5;
const ENTRANCE_DURATION_MS = 1100;
const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

const AXIS_LABEL_STYLE: CSSProperties = {
  fontFamily: "var(--font-family-mono, 'Geist Mono', ui-monospace, SFMono-Regular, monospace)",
  fontSize: 10,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontVariantNumeric: 'tabular-nums',
  fill: 'var(--text-on-candy, var(--color-text-secondary, #1C1B26))',
  opacity: 0.7,
};

const END_NUMERAL_STYLE: CSSProperties = {
  fontFamily: "var(--font-family-display, 'Bagel Fat One', sans-serif)",
  fontWeight: 400,
  fontSize: 22,
  fill: 'var(--text-on-candy, #1C1B26)',
  fontVariantNumeric: 'tabular-nums',
};

const END_DELTA_STYLE: CSSProperties = {
  fontFamily: "var(--font-family-mono, 'Geist Mono', ui-monospace, SFMono-Regular, monospace)",
  fontSize: 10,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontVariantNumeric: 'tabular-nums',
  fill: 'var(--text-on-candy, #1C1B26)',
  opacity: 0.75,
};

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

/* ────────────────────────────────────────────────────────────────────── */
/* Helpers                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

/**
 * Coerce an `x` value (ISO date string or numeric) into a `Date`. Falls
 * back to the row index if neither parses.
 */
function toDate(v: string | number, fallbackIndex: number): Date {
  if (typeof v === 'number') return new Date(v);
  const d = new Date(v);
  if (!Number.isNaN(d.getTime())) return d;
  return new Date(2000, 0, fallbackIndex + 1);
}

/* ────────────────────────────────────────────────────────────────────── */
/* Component                                                               */
/* ────────────────────────────────────────────────────────────────────── */

export function LineVisx({ payload, width = 360, height = 200, className }: LineVisxProps) {
  const dataTableId = useId();
  const prefersReducedMotion = useReducedMotion();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  // ─── Layout ──────────────────────────────────────────────────────────
  const margin = { top: 16, right: 64, bottom: 28, left: 12 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // ─── Series resolution ──────────────────────────────────────────────
  // Single-series only in Phase A. Pick the first series key, or fall back
  // to `'y'` if `series` isn't declared.
  const seriesKey: string = payload.series?.[0]?.key ?? 'y';

  const points: ResolvedPoint[] = useMemo(
    () =>
      payload.data.map((row, i) => {
        const xRaw = row.x;
        const yRaw = row[seriesKey];
        return {
          x: toDate(xRaw, i),
          y: typeof yRaw === 'number' ? yRaw : Number(yRaw ?? 0),
          xRaw: typeof xRaw === 'number' ? xRaw : String(xRaw),
        };
      }),
    [payload.data, seriesKey],
  );

  // ─── Scales ──────────────────────────────────────────────────────────
  const xExtent = useMemo<[Date, Date]>(() => {
    if (points.length === 0) return [new Date(), new Date()];
    const xs = points.map((p) => p.x.getTime());
    return [new Date(Math.min(...xs)), new Date(Math.max(...xs))];
  }, [points]);

  const yExtent = useMemo<[number, number]>(() => {
    if (points.length === 0) return [0, 1];
    const ys = points.map((p) => p.y);
    const lo = Math.min(...ys);
    const hi = Math.max(...ys);
    const pad = (hi - lo) * 0.1 || 1;
    return [lo - pad, hi + pad];
  }, [points]);

  const xScale = useMemo(
    () => scaleTime({ domain: xExtent, range: [0, innerWidth] }),
    [xExtent, innerWidth],
  );
  const yScale = useMemo(
    () => scaleLinear({ domain: yExtent, range: [innerHeight, 0], nice: true }),
    [yExtent, innerHeight],
  );

  // ─── Path geometry (d3-shape) ────────────────────────────────────────
  const pathD = useMemo(() => {
    const generator = d3Line<ResolvedPoint>()
      .x((p) => xScale(p.x) ?? 0)
      .y((p) => yScale(p.y) ?? 0)
      .curve(curveMonotoneX);
    return generator(points) ?? '';
  }, [points, xScale, yScale]);

  // ─── Entrance — stroke-dashoffset draw-in ────────────────────────────
  const [pathLength, setPathLength] = useState<number>(0);
  const [drawProgress, setDrawProgress] = useState<number>(prefersReducedMotion ? 1 : 0);

  // pathD is the semantic trigger — when the path string changes the
  // measurement must re-run even though pathD is read only via pathRef.current.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathD is the semantic trigger for re-measurement
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len > 0 ? len : 0);
    }
  }, [pathD]);

  // pathLength is the semantic trigger — the draw-in animation must restart
  // whenever the measured path length changes (e.g. after data update + re-measurement).
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathLength is the semantic trigger for animation restart
  useEffect(() => {
    if (prefersReducedMotion) {
      setDrawProgress(1);
      return;
    }
    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number): void => {
      const elapsed = now - t0;
      const raw = Math.min(1, elapsed / ENTRANCE_DURATION_MS);
      setDrawProgress(easeOutCubic(raw));
      if (raw < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion, pathLength]);

  // ─── Y ticks (4 across the domain) ───────────────────────────────────
  const yTicks = yScale.ticks(4);

  // ─── X tick selection (start, mid, end) ──────────────────────────────
  const xTicks = useMemo<ResolvedPoint[]>(() => {
    if (points.length === 0) return [];
    if (points.length <= 3) return points;
    const mid = Math.floor(points.length / 2);
    const a = points[0];
    const b = points[mid];
    const c = points[points.length - 1];
    return [a, b, c].filter((p): p is ResolvedPoint => p !== undefined);
  }, [points]);

  // ─── Hover — nearest-x linear scan ───────────────────────────────────
  // Series sizes are tiny (<= 30 points for the showcase), so a linear
  // distance scan beats pulling in `d3-array`'s bisector.
  function handlePointerMove(e: ReactMouseEvent<SVGRectElement>): void {
    if (points.length === 0) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const localX = e.clientX - svgRect.left;
    const xValueAtPointer = xScale.invert(localX);
    const targetMs = xValueAtPointer.getTime();
    let nearestIdx = 0;
    let nearestDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (!p) continue;
      const dist = Math.abs(p.x.getTime() - targetMs);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }
    setHoverIndex(nearestIdx);
  }

  // ─── End-point + delta ───────────────────────────────────────────────
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const endDeltaPct =
    lastPoint && firstPoint && firstPoint.y !== 0
      ? ((lastPoint.y - firstPoint.y) / Math.abs(firstPoint.y)) * 100
      : null;

  const ariaLabelText = payload.meta.alt ?? payload.meta.title;
  const yFormat = payload.yAxis?.format ?? 'currency-compact';
  const xFormat = payload.xAxis?.format ?? 'date-day';

  const tooltipPoint =
    hoverIndex !== null && hoverIndex >= 0 && hoverIndex < points.length
      ? points[hoverIndex]
      : null;

  // Stroke-dashoffset draw-in.
  const strokeDasharray = pathLength > 0 ? `${pathLength} ${pathLength}` : undefined;
  const strokeDashoffset = pathLength > 0 ? pathLength * (1 - drawProgress) : undefined;

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabelText}
      aria-describedby={dataTableId}
      data-testid="chart-line-visx"
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
          {/* Y gridlines + labels */}
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
                  x={innerWidth + 6}
                  y={ty}
                  dy="0.32em"
                  textAnchor="start"
                  style={AXIS_LABEL_STYLE}
                >
                  {formatValue(tick, yFormat, payload.yAxis?.currency)}
                </text>
              </g>
            );
          })}

          {/* X tick labels */}
          {xTicks.map((p) => {
            const tx = xScale(p.x);
            return (
              <text
                key={`x-${p.x.getTime()}`}
                x={tx}
                y={innerHeight + 18}
                textAnchor="middle"
                style={AXIS_LABEL_STYLE}
              >
                {formatXAxis(p.xRaw, xFormat)}
              </text>
            );
          })}

          {/* Hover guide-line + focus circle */}
          {tooltipPoint && !prefersReducedMotion ? (
            <>
              <line
                x1={xScale(tooltipPoint.x)}
                x2={xScale(tooltipPoint.x)}
                y1={0}
                y2={innerHeight}
                stroke="var(--text-on-candy, #1C1B26)"
                strokeOpacity={0.35}
                strokeWidth={1}
                strokeDasharray="2 3"
              />
              <circle
                cx={xScale(tooltipPoint.x)}
                cy={yScale(tooltipPoint.y)}
                r={5}
                fill="var(--cta-fill, #F08A3C)"
                stroke="var(--text-on-candy, #1C1B26)"
                strokeWidth={1.5}
              />
            </>
          ) : null}

          {/* Coloured stroke (v5.1: shadow path removed) */}
          {pathD ? (
            <path
              ref={pathRef}
              d={pathD}
              stroke="var(--cta-fill, var(--accent, #F08A3C))"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
          ) : null}

          {/* End-point — flat coloured circle + chunky numeral
           * (v5.1: shadow circle removed). */}
          {lastPoint && drawProgress >= 1 ? (
            <g>
              <circle
                cx={xScale(lastPoint.x)}
                cy={yScale(lastPoint.y)}
                r={5}
                fill="var(--cta-fill, var(--accent, #F08A3C))"
                stroke="var(--text-on-candy, #1C1B26)"
                strokeWidth={1.5}
              />
              <text
                x={xScale(lastPoint.x) + 10}
                y={yScale(lastPoint.y) - 4}
                style={END_NUMERAL_STYLE}
              >
                {formatValue(lastPoint.y, yFormat, payload.yAxis?.currency)}
              </text>
              {endDeltaPct !== null ? (
                <text
                  x={xScale(lastPoint.x) + 10}
                  y={yScale(lastPoint.y) + 12}
                  style={END_DELTA_STYLE}
                >
                  {endDeltaPct >= 0 ? '+' : '−'}
                  {Math.abs(endDeltaPct).toFixed(1)}%
                </text>
              ) : null}
            </g>
          ) : null}

          {/* Pointer-capture overlay */}
          <rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onMouseMove={handlePointerMove}
            onMouseLeave={() => setHoverIndex(null)}
          />
        </Group>
      </svg>

      {/* Tooltip */}
      {tooltipPoint
        ? (() => {
            const tx = xScale(tooltipPoint.x) + margin.left;
            const ty = yScale(tooltipPoint.y) + margin.top;
            return (
              <div
                role="tooltip"
                aria-hidden="true"
                style={{
                  ...TOOLTIP_STYLE,
                  left: `${(tx / width) * 100}%`,
                  top: ty - 12,
                }}
              >
                <div style={TOOLTIP_LABEL_STYLE}>{formatXAxis(tooltipPoint.xRaw, xFormat)}</div>
                <div>{formatValue(tooltipPoint.y, yFormat, payload.yAxis?.currency)}</div>
              </div>
            );
          })()
        : null}

      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
