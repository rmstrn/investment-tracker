'use client';

/**
 * SparklineVisx — visx-powered micro-line (D1 dialect).
 *
 * v5.1 cleanup: candy-era ink-shadow drop (translated path + opaque fill
 * end-dot stack) removed. D1 register is single coloured stroke + end-dot.
 * No axes, no gridlines, no hover tooltip. Designed to live inline next
 * to KPI text in dashboards.
 *
 * Library boundary:
 *   - `scaleTime` / `scaleLinear` from `@visx/scale`
 *   - `<Group>` from `@visx/group`
 *   - `line()` from `d3-shape` with `curveMonotoneX`
 *
 * Entrance: stroke-dashoffset draw-in over 800ms, deliberate easing.
 * Reduced motion locks at full draw.
 *
 * a11y: ChartFrame-style aria-label + ChartDataTable shadow. Visual is
 * decorative; table is source of truth for screen readers.
 */

import type { SparklinePayload } from '@investment-tracker/shared-types/charts';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { curveMonotoneX, line as d3Line } from 'd3-shape';
import { type CSSProperties, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChartDataTable } from '../_shared/ChartDataTable';
import { CHART_FOCUS_RING_CLASS } from '../_shared/a11y';
import { formatValue } from '../_shared/formatters';
import { useReducedMotion } from '../_shared/useReducedMotion';

/* ────────────────────────────────────────────────────────────────────── */
/* Types                                                                   */
/* ────────────────────────────────────────────────────────────────────── */

export interface SparklineVisxProps {
  payload: SparklinePayload;
  width?: number;
  height?: number;
  /** Hide the chunky Bagel end-numeral. Defaults to `false`. */
  hideEndLabel?: boolean;
  className?: string;
}

interface ResolvedPoint {
  readonly x: Date;
  readonly y: number;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Constants                                                               */
/* ────────────────────────────────────────────────────────────────────── */

const STROKE_WIDTH = 2;
const ENTRANCE_DURATION_MS = 800;
const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

const END_NUMERAL_STYLE: CSSProperties = {
  fontFamily: "var(--font-family-display, 'Bagel Fat One', sans-serif)",
  fontWeight: 400,
  fontSize: 16,
  fill: 'var(--text-on-candy, #1C1B26)',
  fontVariantNumeric: 'tabular-nums',
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

export function SparklineVisx({
  payload,
  width = 200,
  height = 64,
  hideEndLabel = false,
  className,
}: SparklineVisxProps) {
  const dataTableId = useId();
  const prefersReducedMotion = useReducedMotion();
  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState<number>(0);
  const [drawProgress, setDrawProgress] = useState<number>(prefersReducedMotion ? 1 : 0);

  // ─── Layout ──────────────────────────────────────────────────────────
  // Reserve label slot only if the end-numeral is rendered.
  const labelSlot = hideEndLabel ? 6 : 56;
  const margin = { top: 8, right: labelSlot, bottom: 8, left: 6 };
  const innerWidth = Math.max(20, width - margin.left - margin.right);
  const innerHeight = Math.max(20, height - margin.top - margin.bottom);

  // ─── Points ─────────────────────────────────────────────────────────
  const points: ResolvedPoint[] = useMemo(
    () =>
      payload.data.map((row, i) => ({
        x: toDate(row.x, i),
        y: typeof row.y === 'number' ? row.y : Number(row.y ?? 0),
      })),
    [payload.data],
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
    const pad = (hi - lo) * 0.15 || 1;
    return [lo - pad, hi + pad];
  }, [points]);

  const xScale = useMemo(
    () => scaleTime({ domain: xExtent, range: [0, innerWidth] }),
    [xExtent, innerWidth],
  );
  const yScale = useMemo(
    () => scaleLinear({ domain: yExtent, range: [innerHeight, 0] }),
    [yExtent, innerHeight],
  );

  const pathD = useMemo(() => {
    const generator = d3Line<ResolvedPoint>()
      .x((p) => xScale(p.x) ?? 0)
      .y((p) => yScale(p.y) ?? 0)
      .curve(curveMonotoneX);
    return generator(points) ?? '';
  }, [points, xScale, yScale]);

  // ─── Path-length probe (for stroke-dashoffset draw-in) ───────────────
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

  const strokeDasharray = pathLength > 0 ? `${pathLength} ${pathLength}` : undefined;
  const strokeDashoffset = pathLength > 0 ? pathLength * (1 - drawProgress) : undefined;

  const lastPoint = points[points.length - 1];
  const trendUp = payload.trend === 'up';
  const trendDown = payload.trend === 'down';
  // Stroke colour reflects trend semantically when provided.
  const strokeVar = trendDown
    ? 'var(--accent-deep, var(--cta-shadow, #C9601E))'
    : 'var(--cta-fill, var(--accent, #F08A3C))';
  void trendUp;

  const ariaLabelText = payload.meta?.title ?? 'Sparkline';

  return (
    <div
      role="img"
      aria-label={ariaLabelText}
      aria-describedby={dataTableId}
      data-testid="chart-sparkline-visx"
      data-chart-backend="visx"
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%' }}
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
          {/* Coloured stroke (v5.1: shadow path removed) */}
          {pathD ? (
            <path
              ref={pathRef}
              d={pathD}
              stroke={strokeVar}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
          ) : null}

          {/* End-dot + numeral (after the stroke completes).
           * v5.1: shadow circle removed. End-dot is a flat coloured fill
           * with a 1.25px ink ring against the canvas. */}
          {lastPoint && drawProgress >= 1 ? (
            <g>
              <circle
                cx={xScale(lastPoint.x) ?? 0}
                cy={yScale(lastPoint.y) ?? 0}
                r={3.5}
                fill={strokeVar}
                stroke="var(--text-on-candy, #1C1B26)"
                strokeWidth={1.25}
              />
              {!hideEndLabel ? (
                <text
                  x={(xScale(lastPoint.x) ?? 0) + 8}
                  y={(yScale(lastPoint.y) ?? 0) + 5}
                  style={END_NUMERAL_STYLE}
                >
                  {formatValue(lastPoint.y, payload.format ?? 'currency-compact', payload.currency)}
                </text>
              ) : null}
            </g>
          ) : null}
        </Group>
      </svg>

      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
