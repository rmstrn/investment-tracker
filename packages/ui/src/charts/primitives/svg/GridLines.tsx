/**
 * GridLines — horizontal or vertical SVG gridline primitive.
 *
 * Per aggregate Pattern §3 («GridLines = `<line stroke-dasharray="2 4">`
 * siblings; token-driven, brand convention, recurs 144× in static reference»).
 * Hairline dashed grid is the editorial-paper rhythm — a Provedo signature.
 *
 * Layer 2 / Phase α.2.2. No state. No measurement. Pure rendering — caller
 * passes pre-computed pixel positions, primitive emits `<line>` siblings.
 *
 * Color policy: defaults to `var(--text-3)` per a11y Pattern 8 — already
 * AA-compliant after the Phase α `--text-3` luminance bump (commit b0857df).
 * Caller can override via `colorVar` prop with the `axisLabelTokenOverride`
 * gating discipline upstream in `<ChartFrame>`.
 */

import type { CSSProperties } from 'react';

export type GridLinesOrientation = 'horizontal' | 'vertical';

export interface GridLinesProps {
  /** Whether lines run horizontally or vertically. */
  orientation: GridLinesOrientation;
  /**
   * Pixel positions on the perpendicular axis. Horizontal lines = y-positions;
   * vertical lines = x-positions. Caller is expected to have applied scale
   * already.
   */
  positions: readonly number[];
  /** Length of each line on the parallel axis (chart width or chart height). */
  length: number;
  /**
   * Stroke dash pattern. Default `"2 4"` per static reference convention.
   * `"none"` flips the line to solid (matches the «zero-axis emphasis» pattern
   * when applied to a single position via `zeroAxisAt`).
   */
  dash?: string;
  /**
   * CSS variable expression for stroke colour. Default `var(--text-3)` —
   * post-luminance-bump AA against `--card` in light mode and `--bg` in dark.
   */
  colorVar?: string;
  /**
   * Optional position rendered as a solid line in `var(--text-2)` instead of
   * the dashed default. Used to emphasise the value-zero axis on charts that
   * cross zero (waterfall, P&L line, delta bar).
   */
  zeroAxisAt?: number;
  /** Optional className for theme overrides via cascade. */
  className?: string;
}

/**
 * Stable element key derived from orientation + position. Avoids React index
 * keys (positions are unique by construction within a chart).
 */
function makeKey(orientation: GridLinesOrientation, position: number): string {
  return `${orientation}-${position}`;
}

/**
 * Compute `<line>` coordinates for a given position based on orientation.
 *
 * Horizontal: line runs left-to-right at fixed y.
 * Vertical: line runs top-to-bottom at fixed x.
 */
function lineCoords(
  orientation: GridLinesOrientation,
  position: number,
  length: number,
): { x1: number; y1: number; x2: number; y2: number } {
  if (orientation === 'horizontal') {
    return { x1: 0, y1: position, x2: length, y2: position };
  }
  return { x1: position, y1: 0, x2: position, y2: length };
}

export function GridLines({
  orientation,
  positions,
  length,
  dash = '2 4',
  colorVar = 'var(--text-3)',
  zeroAxisAt,
  className,
}: GridLinesProps) {
  const baseStyle: CSSProperties = {
    stroke: colorVar,
    strokeOpacity: 0.6,
    pointerEvents: 'none',
  };

  return (
    <g aria-hidden="true" className={className} data-grid-orientation={orientation}>
      {positions.map((position) => {
        const isZeroAxis = zeroAxisAt !== undefined && Math.abs(position - zeroAxisAt) < 0.5;
        const coords = lineCoords(orientation, position, length);
        return (
          <line
            key={makeKey(orientation, position)}
            x1={coords.x1}
            y1={coords.y1}
            x2={coords.x2}
            y2={coords.y2}
            strokeDasharray={isZeroAxis ? undefined : dash}
            stroke={isZeroAxis ? 'var(--text-2)' : colorVar}
            strokeWidth={isZeroAxis ? 1 : 1}
            style={isZeroAxis ? { ...baseStyle, stroke: 'var(--text-2)', strokeOpacity: 1 } : baseStyle}
          />
        );
      })}
    </g>
  );
}
