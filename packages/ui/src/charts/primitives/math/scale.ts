/**
 * Scale port — hexagonal wrapper over d3-scale.
 *
 * Layer 1 / Phase α.1 of the custom SVG chart primitives layer (replacement
 * for Recharts). Per `docs/reviews/2026-04-29-r2-primitives-layer-aggregate.md`
 * decision #1: «Hybrid — d3-scale + d3-shape (~10kb gz, MIT) wrapped behind
 * own `Scale` port (hexagonal). Don't reinvent `nice()` / `ticks()` /
 * `invert()` — D3 nailed it 15y ago.»
 *
 * The wrapper exposes a small, explicit `Scale<T>` / `BandScale` interface so
 * that:
 *   1. Consumer code never imports `d3-scale` directly (port pattern).
 *   2. We can swap the backing implementation later (e.g. tree-shake d3,
 *      custom impl) without touching call sites.
 *   3. Public API surface stays under our control — e.g. `format` defaults
 *      live here, not in d3.
 *
 * NO React in this file. Pure functions only.
 */

import { scaleBand, scaleLinear, scaleTime } from 'd3-scale';

/* ────────────────────────────────────────────────────────────────────── */
/* Public types — intentionally do NOT re-export d3-scale's interfaces.   */
/* ────────────────────────────────────────────────────────────────────── */

/**
 * Continuous scale port. `T` is the input domain unit (number for linear,
 * Date for time). Output is always a pixel coordinate (number).
 */
export interface Scale<T> {
  /** Map a domain value → pixel coordinate. */
  toPixel(value: T): number;
  /** Map a pixel coordinate back → domain value. */
  invert(pixel: number): T;
  /**
   * Suggested tick values for the scale's current domain.
   * @param count target number of ticks (D3 treats this as a hint, not a hard count)
   */
  ticks(count?: number): readonly T[];
  /** Default formatter — override at call site if needed. */
  format(value: T): string;
}

/**
 * Categorical band scale port — for bar charts, candlestick lanes, etc.
 * Range output is the LEFT edge of each band (matching d3-scale convention).
 */
export interface BandScale {
  /** Map a category → left-edge pixel. Returns NaN if value not in domain. */
  toPixel(value: string): number;
  /** Width of each band in pixels (uniform across the scale). */
  bandwidth(): number;
  /** All categories in their original domain order. */
  ticks(): readonly string[];
  /** Default formatter — pass-through string identity. */
  format(value: string): string;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Linear scale                                                            */
/* ────────────────────────────────────────────────────────────────────── */

export interface LinearScaleOptions {
  readonly domain: readonly [number, number];
  readonly range: readonly [number, number];
  /** Round domain to «nice» round numbers (default false). */
  readonly nice?: boolean;
}

export function linearScale(options: LinearScaleOptions): Scale<number> {
  const { domain, range, nice = false } = options;
  const scale = scaleLinear().domain([domain[0], domain[1]]).range([range[0], range[1]]);
  if (nice) {
    scale.nice();
  }
  return {
    toPixel: (value) => scale(value) ?? Number.NaN,
    invert: (pixel) => scale.invert(pixel),
    ticks: (count) => scale.ticks(count),
    format: (value) => formatNumberDefault(value),
  };
}

/* ────────────────────────────────────────────────────────────────────── */
/* Time scale                                                              */
/* ────────────────────────────────────────────────────────────────────── */

export interface TimeScaleOptions {
  readonly domain: readonly [Date, Date];
  readonly range: readonly [number, number];
  readonly nice?: boolean;
}

export function timeScale(options: TimeScaleOptions): Scale<Date> {
  const { domain, range, nice = false } = options;
  const scale = scaleTime().domain([domain[0], domain[1]]).range([range[0], range[1]]);
  if (nice) {
    scale.nice();
  }
  return {
    toPixel: (value) => scale(value) ?? Number.NaN,
    invert: (pixel) => scale.invert(pixel),
    ticks: (count) => scale.ticks(count),
    format: (value) => value.toISOString().slice(0, 10),
  };
}

/* ────────────────────────────────────────────────────────────────────── */
/* Band scale                                                              */
/* ────────────────────────────────────────────────────────────────────── */

export interface BandScaleOptions {
  readonly domain: readonly string[];
  readonly range: readonly [number, number];
  /** Inner+outer padding as fraction of step (default 0). */
  readonly padding?: number;
}

export function bandScale(options: BandScaleOptions): BandScale {
  const { domain, range, padding = 0 } = options;
  const scale = scaleBand<string>()
    .domain([...domain])
    .range([range[0], range[1]])
    .padding(padding);
  return {
    toPixel: (value) => scale(value) ?? Number.NaN,
    bandwidth: () => scale.bandwidth(),
    ticks: () => scale.domain(),
    format: (value) => value,
  };
}

/* ────────────────────────────────────────────────────────────────────── */
/* Default number formatter — chart-pleasing, locale-aware.                */
/* ────────────────────────────────────────────────────────────────────── */

/**
 * Default tick formatter for linear scales.
 *
 * Uses a max of 4 fraction digits and removes trailing zeros so that integer
 * ticks read as «12» (not «12.0000») while small decimals retain precision.
 * Consumers needing currency / compact display should override `.format` at
 * the call site.
 */
function formatNumberDefault(value: number): string {
  if (!Number.isFinite(value)) {
    return String(value);
  }
  // `en-US` locale fixes the decimal separator to «.» so chart tick text
  // is consistent across user locales / CI runners. Consumers needing
  // localised numerals should override `.format` at the call site.
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
    useGrouping: false,
  }).format(value);
}
