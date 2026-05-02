'use client';

/**
 * AreaVisx — visx-powered candy-themed area chart (POC).
 *
 * Sibling to `LineVisx`. Adds a filled gradient region beneath the same
 * monotonic-cubic stroke + ink-shadow drop signature. The gradient runs
 * from `--cta-fill` at 0.30 alpha at the top → transparent at the
 * baseline (matches CHARTS_SPEC §5.3 area treatment).
 *
 * Library boundary:
 *   - `scaleTime` / `scaleLinear` from `@visx/scale`
 *   - `<Group>` from `@visx/group`
 *   - `area()` + `line()` from `d3-shape` with `curveMonotoneX`
 *
 * Entrance: `clip-path: inset(0 0 100% 0)` → `inset(0 0 0% 0)` from
 * bottom over 1100ms, deliberate easing. The fill + stroke + shadow all
 * share the same clip so the reveal reads as «paper-tape unrolling
 * upward». Reduced motion locks at full.
 */

import type { AreaChartPayload } from '@investment-tracker/shared-types/charts';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { curveMonotoneX, area as d3Area, line as d3Line } from 'd3-shape';
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

export interface AreaVisxProps {
  payload: AreaChartPayload;
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
const SHADOW_OFFSET_X = 2;
const SHADOW_OFFSET_Y = 3;
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

/* ────────────────────────────────────────────────────────────────────── */
/* Helpers                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

function toDate(v: string | number, fallbackIndex: number): Date {
  if (typeof v === 'number') return new Date(v);
  const d = new Date(v);
  if (!Number.isNaN(d.getTime())) return d;
  return new Date(2000, 0, fallbackIndex + 1);
}

/* ────────────────────────────────────────────────────────────────────── */
/* Component                                                               */
/* ────────────────────────────────────────────────────────────────────── */

export function AreaVisx({ payload, width = 360, height = 200, className }: AreaVisxProps) {
  const dataTableId = useId();
  const prefersReducedMotion = useReducedMotion();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gradientId = useId();

  // ─── Layout ──────────────────────────────────────────────────────────
  const margin = { top: 16, right: 64, bottom: 28, left: 12 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // ─── Series resolution (single series only in Phase A) ──────────────
  const seriesKey: string = payload.series?.[0]?.key ?? 'cumulative';

  const points: ResolvedPoint[] = useMemo(
    () =>
      payload.data.map((row, i) => {
        const xRaw = row.x;
        const yRaw = row[seriesKey] ?? row.y;
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
    const lo = Math.min(...ys, 0);
    const hi = Math.max(...ys);
    const pad = (hi - lo) * 0.1 || 1;
    return [lo, hi + pad];
  }, [points]);

  const xScale = useMemo(
    () => scaleTime({ domain: xExtent, range: [0, innerWidth] }),
    [xExtent, innerWidth],
  );
  const yScale = useMemo(
    () => scaleLinear({ domain: yExtent, range: [innerHeight, 0], nice: true }),
    [yExtent, innerHeight],
  );

  // ─── Path geometry ──────────────────────────────────────────────────
  const baselineY = yScale(yExtent[0]);

  const linePathD = useMemo(() => {
    const generator = d3Line<ResolvedPoint>()
      .x((p) => xScale(p.x) ?? 0)
      .y((p) => yScale(p.y) ?? 0)
      .curve(curveMonotoneX);
    return generator(points) ?? '';
  }, [points, xScale, yScale]);

  const areaPathD = useMemo(() => {
    const generator = d3Area<ResolvedPoint>()
      .x((p) => xScale(p.x) ?? 0)
      .y0(baselineY)
      .y1((p) => yScale(p.y) ?? 0)
      .curve(curveMonotoneX);
    return generator(points) ?? '';
  }, [points, xScale, yScale, baselineY]);

  // ─── Entrance — clip-path inset reveal from bottom ───────────────────
  const [drawProgress, setDrawProgress] = useState<number>(prefersReducedMotion ? 1 : 0);
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
  }, [prefersReducedMotion]);

  // 0% reveal == clip 100% from top (hide everything above the inset).
  const insetTop = (1 - drawProgress) * 100;

  // ─── Y / X ticks ─────────────────────────────────────────────────────
  const yTicks = yScale.ticks(4);
  const xTicks = useMemo<ResolvedPoint[]>(() => {
    if (points.length === 0) return [];
    if (points.length <= 3) return points;
    const mid = Math.floor(points.length / 2);
    const a = points[0];
    const b = points[mid];
    const c = points[points.length - 1];
    return [a, b, c].filter((p): p is ResolvedPoint => p !== undefined);
  }, [points]);

  // ─── Hover ──────────────────────────────────────────────────────────
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

  const ariaLabelText = payload.meta.alt ?? payload.meta.title;
  const yFormat = payload.yAxis?.format ?? 'currency-compact';
  const xFormat = payload.xAxis?.format ?? 'date-month';

  const tooltipPoint =
    hoverIndex !== null && hoverIndex >= 0 && hoverIndex < points.length
      ? points[hoverIndex]
      : null;

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabelText}
      aria-describedby={dataTableId}
      data-testid="chart-area-visx"
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
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--cta-fill, var(--accent, #F08A3C))"
              stopOpacity={0.3}
            />
            <stop
              offset="100%"
              stopColor="var(--cta-fill, var(--accent, #F08A3C))"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
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
          {xTicks.map((p) => (
            <text
              key={`x-${p.x.getTime()}`}
              x={xScale(p.x)}
              y={innerHeight + 18}
              textAnchor="middle"
              style={AXIS_LABEL_STYLE}
            >
              {formatXAxis(p.xRaw, xFormat)}
            </text>
          ))}

          {/* Reveal-clipped chart layers */}
          <g
            style={{
              clipPath: `inset(${insetTop}% 0% 0% 0%)`,
              WebkitClipPath: `inset(${insetTop}% 0% 0% 0%)`,
            }}
          >
            {/* Filled gradient area */}
            {areaPathD ? <path d={areaPathD} fill={`url(#${gradientId})`} /> : null}

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

            {/* Hard ink-shadow drop on stroke */}
            {linePathD ? (
              <path
                d={linePathD}
                stroke="var(--text-on-candy, #1C1B26)"
                strokeOpacity={0.55}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                transform={`translate(${SHADOW_OFFSET_X} ${SHADOW_OFFSET_Y})`}
              />
            ) : null}

            {/* Coloured stroke */}
            {linePathD ? (
              <path
                d={linePathD}
                stroke="var(--cta-fill, var(--accent, #F08A3C))"
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ) : null}
          </g>

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
