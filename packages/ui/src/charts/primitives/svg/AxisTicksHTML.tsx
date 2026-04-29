/**
 * AxisTicksHTML — HTML overlay axis labels.
 *
 * Per aggregate decision #4 («SVG canvas + HTML overlay for axis labels»):
 * pure SVG `<text>` has bad font hinting and weak a11y; HTML `<span>` opens
 * `font-feature-settings: 'tnum' 1` for tabular numerals and `cv11` for the
 * Geist Mono numeric set. This is the «E. Tabular Geist Mono micro-numerals»
 * atom from the static reference.
 *
 * Layer 2 / Phase α.2.2. No state. Caller passes `ticks: [{ value, position,
 * label }]`; primitive renders absolutely-positioned `<span>` siblings.
 *
 * Container is `position: absolute` over the SVG canvas — caller supplies
 * `containerWidth` / `containerHeight` for layout math. The orientation
 * controls whether ticks lay along the bottom (horizontal) or left
 * (vertical) edge.
 */

import type { CSSProperties } from 'react';

export type AxisOrientation = 'horizontal' | 'vertical';

export interface AxisTick<T = unknown> {
  /** The original domain value — kept for keying / debugging. */
  readonly value: T;
  /**
   * Pixel position on the relevant axis (x for horizontal, y for vertical).
   * Caller has already applied scale.
   */
  readonly position: number;
  /** Pre-formatted display label. */
  readonly label: string;
}

export interface AxisTicksHTMLProps {
  /** Whether ticks live on the x-axis (bottom) or y-axis (left). */
  orientation: AxisOrientation;
  /** Pre-scaled ticks. Caller is responsible for `nice()` + collision avoidance. */
  ticks: readonly AxisTick[];
  /** Width of the SVG canvas the labels sit over. */
  containerWidth: number;
  /** Height of the SVG canvas the labels sit over. */
  containerHeight: number;
  /**
   * Pixel offset reserved for axis labels at the bottom (horizontal) or left
   * (vertical). Default `24` — enough for one line of 11px Geist Mono.
   */
  axisGutter?: number;
  /** Optional className for theme overrides. */
  className?: string;
}

/**
 * Common typographic style shared across both axis orientations.
 *
 * `tnum` enables tabular numerals; `cv11` is Geist's character variant for
 * the disambiguated «I/l/1» numeric set (per CHARTS_SPEC §3.3 brand voice).
 * `letterSpacing 0.08em` is the editorial-axis rhythm from the static
 * reference (lines 1310–1330 of design-system.html).
 */
const TICK_BASE_STYLE: CSSProperties = {
  position: 'absolute',
  fontFamily: 'var(--font-mono, ui-monospace)',
  fontSize: 11,
  letterSpacing: '0.08em',
  color: 'var(--chart-axis-label, var(--text-3))',
  fontFeatureSettings: '"tnum" 1, "cv11" 1',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  // `transform: translate(-50%, 0)` (horizontal) and `translate(0, -50%)`
  // (vertical) centre the text on its tick — applied per orientation below.
};

function tickStyle(
  orientation: AxisOrientation,
  position: number,
  containerHeight: number,
  axisGutter: number,
): CSSProperties {
  if (orientation === 'horizontal') {
    return {
      ...TICK_BASE_STYLE,
      left: position,
      top: containerHeight - axisGutter,
      transform: 'translate(-50%, 0)',
    };
  }
  return {
    ...TICK_BASE_STYLE,
    left: 0,
    top: position,
    width: axisGutter,
    transform: 'translate(0, -50%)',
    textAlign: 'right',
    paddingRight: 6,
    boxSizing: 'border-box',
  };
}

export function AxisTicksHTML({
  orientation,
  ticks,
  containerWidth,
  containerHeight,
  axisGutter = 24,
  className,
}: AxisTicksHTMLProps) {
  return (
    <div
      aria-hidden="true"
      className={className}
      data-axis-orientation={orientation}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: containerWidth,
        height: containerHeight,
        pointerEvents: 'none',
      }}
    >
      {ticks.map((tick, idx) => (
        <span
          // Key combines value + position for stability across re-renders;
          // String-cast handles Date / number / string tick values.
          key={`${String(tick.value)}-${tick.position}-${idx}`}
          style={tickStyle(orientation, tick.position, containerHeight, axisGutter)}
        >
          {tick.label}
        </span>
      ))}
    </div>
  );
}
