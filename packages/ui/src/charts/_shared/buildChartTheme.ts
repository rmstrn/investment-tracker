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
      // PO feedback (2026-04-29): x-axis labels on bar charts read as faint /
      // anaemic. Bumped 10 → 11 (still editorial, still mono) and the fill
      // resolves to `--chart-axis-label` → `--text-3` (#7A7A7A light /
      // #9A9A9A dark) which gives ≥4.5:1 on both card surfaces; combined
      // with the size bump categorical labels («NVDA», «MSFT») now read
      // clearly without dominating the chart.
      fontSize: 11,
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
    // PO feedback (2026-04-29): «пунктир пожирнее» — the prior 2 4 dotted
    // pattern read as too sparse against the cream-paper card. Switched to
    // 3 5 — slightly longer dashes with longer gaps — so the gridline
    // rhythm has visible cadence without overpowering the data layer.
    // The `--chart-grid` token resolves to rgba(20,20,20,0.10) light /
    // rgba(255,255,255,0.10) dark; opacity stays at 1 (the alpha lives in
    // the token) so the dash pattern reads at the intended density.
    strokeDasharray: '3 5',
    strokeOpacity: 1,
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
/* BAR — radius 10px on top corners (v1.2 neumorphism pass)               */
/* ────────────────────────────────────────────────────────────────────── */

/**
 * Recharts `<Bar radius={...}>` → top-rounded.
 *
 * Bumped from `[6, 6, 0, 0]` to `[10, 10, 0, 0]` per the neumorphism /
 * round-more dispatch (2026-04-29). Top-only — bottom corners stay flat
 * because bars rest on the x-axis.
 */
export const BAR_RADIUS: [number, number, number, number] = [10, 10, 0, 0];

/**
 * Stacked-bar top-segment radius. Bumped from `[4, 4, 0, 0]` to `[8, 8, 0, 0]`;
 * kept slightly tighter than `BAR_RADIUS` because stacked tops sit on top of
 * other segments and a deeper curve disconnects the stack visually.
 */
export const BAR_RADIUS_STACK_TOP: [number, number, number, number] = [8, 8, 0, 0];

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
