'use client';

/**
 * Axis — single SVG primitive for X/Y axes via `orientation` prop.
 *
 * Per spec docs/superpowers/specs/2026-04-30-bar-chart-v2-design.md §3.4 +
 * §5.2: one component handles all four axis orientations (bottom / left /
 * top / right) — type narrowing on `orientation` literal switches tick
 * positioning + label anchoring branches inside.
 *
 * Caller responsibility: compute ticks via the appropriate scale's
 * `.ticks(n)` method; pass `transform` to position the axis group inside
 * the chart inner-rect.
 *
 * NOTE: scale port exposes `.toPixel(value)` (not `.scale(value)`) — see
 * `packages/ui/src/charts/primitives/math/scale.ts`. Both `Scale<number>`
 * and `BandScale` honour the same `toPixel` signature, so we accept either
 * via a thin local interface to avoid the union-input incompatibility
 * between `toPixel(number)` and `toPixel(string)`.
 */

import type { CSSProperties, JSX } from 'react';
import type { BandScale, Scale } from '../math/scale';

/**
 * Four-edge orientation set for the cartesian `<Axis>` primitive.
 *
 * Distinct from `AxisTicksHTML`'s legacy `AxisEdgeOrientation`
 * (`'horizontal' | 'vertical'`) which described the line's geometry rather
 * than the edge it lives on. Bar V2 needs edge semantics so it can position
 * the axis group on the bottom and left of the inner-rect by default.
 */
export type AxisEdgeOrientation = 'top' | 'right' | 'bottom' | 'left';

/**
 * Loose scale shape that both `Scale<number>` and `BandScale` satisfy.
 * `value` is `string | number` because the same primitive is reused across
 * categorical (band) and continuous (linear/time) axes.
 */
interface ScaleLike {
  toPixel(value: string & number): number;
}

export interface AxisTickInput {
  readonly value: string | number;
  readonly label: string;
}

export interface AxisProps {
  orientation: AxisEdgeOrientation;
  scale: Scale<number> | BandScale;
  ticks?: readonly AxisTickInput[];
  /** SVG translate applied to the axis group; caller positions. */
  transform?: string;
  /** When true, suppress the axis baseline `<line>`. */
  hideBaseline?: boolean;
  /** Plot-area extent — needed to size baseline + tick lines. */
  innerWidth?: number;
  innerHeight?: number;
  className?: string;
}

const TICK_SIZE = 4;
const TICK_LABEL_OFFSET = 8;
const AXIS_LABEL_FONT_SIZE = 10;
const TICK_LABEL_VERTICAL_NUDGE = AXIS_LABEL_FONT_SIZE / 3;

/* ────────────────────────────────────────────────────────────────────── */
/* Per-orientation geometry helpers — extracted so the JSX stays flat.    */
/* ────────────────────────────────────────────────────────────────────── */

interface TickGeometry {
  readonly tickX2: number;
  readonly tickY2: number;
  readonly labelX: number;
  readonly labelY: number;
  readonly textAnchor: 'start' | 'middle' | 'end';
}

function computeTickGeometry(orientation: AxisEdgeOrientation, pos: number): TickGeometry {
  if (orientation === 'bottom') {
    return {
      tickX2: pos,
      tickY2: TICK_SIZE,
      labelX: pos,
      labelY: TICK_LABEL_OFFSET + AXIS_LABEL_FONT_SIZE,
      textAnchor: 'middle',
    };
  }
  if (orientation === 'top') {
    return {
      tickX2: pos,
      tickY2: -TICK_SIZE,
      labelX: pos,
      labelY: -TICK_LABEL_OFFSET,
      textAnchor: 'middle',
    };
  }
  if (orientation === 'left') {
    return {
      tickX2: -TICK_SIZE,
      tickY2: pos,
      labelX: -TICK_LABEL_OFFSET,
      labelY: pos + TICK_LABEL_VERTICAL_NUDGE,
      textAnchor: 'end',
    };
  }
  // right
  return {
    tickX2: TICK_SIZE,
    tickY2: pos,
    labelX: TICK_LABEL_OFFSET,
    labelY: pos + TICK_LABEL_VERTICAL_NUDGE,
    textAnchor: 'start',
  };
}

export function Axis({
  orientation,
  scale,
  ticks = [],
  transform,
  hideBaseline = false,
  innerWidth = 0,
  innerHeight = 0,
  className,
}: AxisProps): JSX.Element {
  const isHorizontal = orientation === 'top' || orientation === 'bottom';
  const baselineLength = isHorizontal ? innerWidth : innerHeight;

  // BandScale.toPixel(string) and Scale<number>.toPixel(number) — cross-cast
  // through the loose local shape so we can iterate ticks of mixed value type.
  const scaleLike = scale as unknown as ScaleLike;

  const lineStyle: CSSProperties = {
    stroke: 'var(--axis-tick, currentColor)',
    strokeWidth: 1,
    opacity: 0.5,
    pointerEvents: 'none',
  };

  const labelStyle: CSSProperties = {
    fill: 'var(--axis-label, var(--text-2))',
    fontFamily: 'var(--font-mono)',
    fontSize: AXIS_LABEL_FONT_SIZE,
    pointerEvents: 'none',
  };

  return (
    <g
      data-testid="axis"
      data-orientation={orientation}
      transform={transform}
      className={className}
    >
      {!hideBaseline ? (
        <line
          data-testid="axis-baseline"
          x1={0}
          y1={0}
          x2={isHorizontal ? baselineLength : 0}
          y2={isHorizontal ? 0 : baselineLength}
          vectorEffect="non-scaling-stroke"
          style={lineStyle}
        />
      ) : null}
      {ticks.map((tick) => {
        // Cast value to the cross-typed input — both numeric and string
        // domains funnel through `toPixel` of their respective concrete
        // scale. The loose `ScaleLike` is a presentational seam only.
        const pos = scaleLike.toPixel(tick.value as string & number);
        const tickX1 = isHorizontal ? pos : 0;
        const tickY1 = isHorizontal ? 0 : pos;
        const { tickX2, tickY2, labelX, labelY, textAnchor } = computeTickGeometry(
          orientation,
          pos,
        );

        return (
          <g key={`tick-${String(tick.value)}`} data-testid="axis-tick">
            <line
              x1={tickX1}
              y1={tickY1}
              x2={tickX2}
              y2={tickY2}
              vectorEffect="non-scaling-stroke"
              style={lineStyle}
            />
            <text
              data-testid="axis-tick-label"
              x={labelX}
              y={labelY}
              textAnchor={textAnchor}
              style={labelStyle}
            >
              {tick.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}
