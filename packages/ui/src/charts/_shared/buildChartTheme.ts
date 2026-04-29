/**
 * buildChartTheme — shared Recharts theming primitives per CHARTS_SPEC §3.
 *
 * Centralises the visual customisation contract that the static design-system
 * reference uses for every chart card: editorial axis typography, dotted
 * gridlines, mini-card tooltip, round line caps, area gradient, rounded bar
 * tops, donut segment separation. Individual chart components consume these
 * helpers so the visual language is consistent and theme-flips for free
 * (every value resolves at paint time via `var(--chart-...)` custom props).
 *
 * Existing `buildTooltipProps` covers the tooltip surface; this module adds
 * the axis / grid / line / bar / area / gradient layers that previously had
 * to be duplicated by each chart component.
 */

import type { CSSProperties } from 'react';

/* ────────────────────────────────────────────────────────────────────── */
/* AXIS — Geist Mono · 10px · letter-spacing 0.08em · text-3 fill         */
/* ────────────────────────────────────────────────────────────────────── */

export interface AxisTickProps {
  /** Recharts `<XAxis>` / `<YAxis>` tick={{...}} value. */
  readonly tick: {
    readonly fontFamily: string;
    readonly fontSize: number;
    readonly fill: string;
    readonly letterSpacing: string;
  };
  /** Both `tickLine` and `axisLine` suppressed for editorial feel. */
  readonly tickLine: false;
  readonly axisLine: false;
}

export function buildAxisProps(): AxisTickProps {
  return {
    tick: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      fill: 'var(--chart-axis-label)',
      letterSpacing: '0.08em',
    },
    tickLine: false,
    axisLine: false,
  };
}

/* ────────────────────────────────────────────────────────────────────── */
/* GRID — dotted, low-alpha (`stroke-dasharray="2 4"`)                    */
/* ────────────────────────────────────────────────────────────────────── */

export interface GridProps {
  readonly stroke: string;
  readonly strokeDasharray: string;
  readonly strokeOpacity: number;
  readonly vertical: false;
}

export function buildGridProps(): GridProps {
  return {
    stroke: 'var(--chart-grid)',
    strokeDasharray: '2 4',
    strokeOpacity: 0.85,
    vertical: false,
  };
}

/* ────────────────────────────────────────────────────────────────────── */
/* LINE — 1.75px · round caps + joins                                     */
/* ────────────────────────────────────────────────────────────────────── */

export interface LineSeriesVisuals {
  readonly strokeWidth: number;
  readonly strokeLinecap: 'round';
  readonly strokeLinejoin: 'round';
}

export function buildLineSeriesProps(): LineSeriesVisuals {
  return {
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
}

/* ────────────────────────────────────────────────────────────────────── */
/* AREA GRADIENT — 30% → 0% opacity stops keyed by series colour          */
/* ────────────────────────────────────────────────────────────────────── */

export interface AreaGradientStops {
  readonly id: string;
  readonly stops: readonly {
    readonly offset: string;
    readonly color: string;
    readonly opacity: number;
  }[];
}

/**
 * Returns an SVG `<linearGradient>` definition spec for the area-fill of a
 * chart series. The chart component renders `<defs><linearGradient/></defs>`
 * inside its Recharts SVG and references `id` via `fill={`url(#${id})`}`.
 */
export function buildAreaGradient(seriesColor: string, idHint = 'chart-area'): AreaGradientStops {
  return {
    id: `${idHint}-${seriesColor.replace(/[^a-z0-9]/gi, '')}`,
    stops: [
      { offset: '0%', color: seriesColor, opacity: 0.3 },
      { offset: '100%', color: seriesColor, opacity: 0 },
    ],
  };
}

/* ────────────────────────────────────────────────────────────────────── */
/* BAR — radius 6px on top corners                                        */
/* ────────────────────────────────────────────────────────────────────── */

/** Recharts `<Bar radius={...}>` → top-rounded ([6, 6, 0, 0]). */
export const BAR_RADIUS: [number, number, number, number] = [6, 6, 0, 0];

/* ────────────────────────────────────────────────────────────────────── */
/* DONUT — 2px stroke between segments using card colour                  */
/* ────────────────────────────────────────────────────────────────────── */

export interface DonutSegmentVisuals {
  readonly stroke: string;
  readonly strokeWidth: number;
}

export function buildDonutSegmentProps(): DonutSegmentVisuals {
  return {
    stroke: 'var(--card)',
    strokeWidth: 2,
  };
}

/* ────────────────────────────────────────────────────────────────────── */
/* LEGEND — 11px · text-2 · padding-top 14px · 1px dotted top divider     */
/* ────────────────────────────────────────────────────────────────────── */

export function buildLegendWrapperStyle(): CSSProperties {
  return {
    paddingTop: 14,
    marginTop: 14,
    borderTop: '1px dotted var(--border-divider, var(--border))',
    fontSize: 11,
    color: 'var(--text-2)',
    fontWeight: 500,
  };
}

/* ────────────────────────────────────────────────────────────────────── */
/* CONVENIENCE — bundle every customisation in one call                   */
/* ────────────────────────────────────────────────────────────────────── */

export interface ChartTheme {
  readonly axis: AxisTickProps;
  readonly grid: GridProps;
  readonly line: LineSeriesVisuals;
  readonly bar: { readonly radius: [number, number, number, number] };
  readonly donut: DonutSegmentVisuals;
  readonly legendStyle: CSSProperties;
}

/**
 * Single-call helper that returns the full theme bundle. Chart components
 * call this once and destructure the parts they need:
 *
 * @example
 * const theme = buildChartTheme();
 * <CartesianGrid {...theme.grid} />
 * <XAxis {...theme.axis} />
 * <Line {...theme.line} stroke={s.color} />
 */
export function buildChartTheme(): ChartTheme {
  return {
    axis: buildAxisProps(),
    grid: buildGridProps(),
    line: buildLineSeriesProps(),
    bar: { radius: BAR_RADIUS },
    donut: buildDonutSegmentProps(),
    legendStyle: buildLegendWrapperStyle(),
  };
}
