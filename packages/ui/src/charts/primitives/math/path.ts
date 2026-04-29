/**
 * Path primitives — d3-shape wrappers returning SVG `d` attribute strings.
 *
 * Layer 1 / Phase α.1 of the custom SVG chart primitives. Per aggregate
 * decision #2: «generators return strings, React owns `<path>`». This file
 * is the strings half — React `<path>` elements live in Layer 2 (α.2).
 *
 * The d3-shape generators keep DOM ownership inside React: they accept a
 * synthetic `null` context and return path strings, which we then assign to
 * `<path d={...}>` from a JSX primitive. No imperative DOM mutation.
 *
 * NO React in this file. Pure functions only.
 */

import {
  curveLinear,
  curveMonotoneX,
  arc as d3Arc,
  area as d3Area,
  line as d3Line,
} from 'd3-shape';

/* ────────────────────────────────────────────────────────────────────── */
/* Curve enum — exposed to consumers as string literals (no d3 leak).      */
/* ────────────────────────────────────────────────────────────────────── */

export type CurveKind = 'linear' | 'monotone-x';

function resolveCurve(kind: CurveKind | undefined) {
  if (kind === 'monotone-x') {
    return curveMonotoneX;
  }
  return curveLinear;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Line                                                                    */
/* ────────────────────────────────────────────────────────────────────── */

export interface LinePoint {
  readonly x: number;
  readonly y: number;
}

export interface LinePathOptions {
  readonly curve?: CurveKind;
}

/**
 * Build SVG `d` attribute string for a line through `points`.
 *
 * Returns empty string when the input has no renderable points so the
 * caller can pass the result directly to `<path d={...}>` without guarding
 * for `null`.
 */
export function linePath(points: readonly LinePoint[], options: LinePathOptions = {}): string {
  if (points.length === 0) {
    return '';
  }
  const generator = d3Line<LinePoint>()
    .x((p) => p.x)
    .y((p) => p.y)
    .curve(resolveCurve(options.curve));
  return generator(points as LinePoint[]) ?? '';
}

/* ────────────────────────────────────────────────────────────────────── */
/* Area                                                                    */
/* ────────────────────────────────────────────────────────────────────── */

export interface AreaPoint {
  readonly x: number;
  /** Lower bound (typically a baseline like 0). */
  readonly y0: number;
  /** Upper bound (the data value). */
  readonly y1: number;
}

export interface AreaPathOptions {
  readonly curve?: CurveKind;
}

/**
 * Build SVG `d` attribute string for the area between `y0` and `y1` for
 * each x. Per aggregate Pattern §1, area charts get gradient fills via
 * `<defs>` rather than inline shading, so this generator handles geometry
 * only.
 */
export function areaPath(points: readonly AreaPoint[], options: AreaPathOptions = {}): string {
  if (points.length === 0) {
    return '';
  }
  const generator = d3Area<AreaPoint>()
    .x((p) => p.x)
    .y0((p) => p.y0)
    .y1((p) => p.y1)
    .curve(resolveCurve(options.curve));
  return generator(points as AreaPoint[]) ?? '';
}

/* ────────────────────────────────────────────────────────────────────── */
/* Arc                                                                     */
/* ────────────────────────────────────────────────────────────────────── */

export interface ArcPathOptions {
  readonly innerRadius: number;
  readonly outerRadius: number;
  /** Angles in radians, 0 at 12 o'clock, clockwise positive (d3 convention). */
  readonly startAngle: number;
  readonly endAngle: number;
  /**
   * Corner radius in user units — d3-shape rounds inner + outer corners.
   * Default 0. Per chart-visual-references.md (amCharts semi-circle
   * inspiration): `<DonutChartV2 cornerRadius={N}>` activates the rounded
   * `<path>` path; the fast `<circle stroke-dasharray>` ring path applies
   * only when `cornerRadius === 0`.
   */
  readonly cornerRadius?: number;
  /**
   * Pad angle in radians between adjacent sectors. Default 0. Useful when a
   * donut wants visible gaps without relying solely on stroke separation.
   */
  readonly padAngle?: number;
}

/**
 * Build SVG `d` attribute for a donut / pie sector.
 *
 * Note per aggregate Pattern §2: the canonical donut in the static reference
 * is a 5×`<circle stroke-dasharray>` ring rather than 5 SVG arcs. `arcPath`
 * is provided for charts that genuinely need wedge geometry (gauges,
 * radial bar, half-arc KPIs, rounded-corner donuts).
 *
 * Layer 3 `<DonutChartV2>` (Phase β.1) selects between the two paths:
 *   - `cornerRadius === 0` → 5×`<circle stroke-dasharray>` fast path
 *   - `cornerRadius > 0`   → `<path>` via this generator (rounded corners)
 */
export function arcPath(options: ArcPathOptions): string {
  const generator = d3Arc()
    .cornerRadius(options.cornerRadius ?? 0)
    .padAngle(options.padAngle ?? 0);
  const result = generator({
    innerRadius: options.innerRadius,
    outerRadius: options.outerRadius,
    startAngle: options.startAngle,
    endAngle: options.endAngle,
  });
  return result ?? '';
}
