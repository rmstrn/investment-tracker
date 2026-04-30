'use client';

/**
 * CartesianFrame — plot-area `<g>` with margin translate.
 *
 * Per spec docs/superpowers/specs/2026-04-30-bar-chart-v2-design.md §3.5 +
 * §5.2: owns ONLY the plot-area `<g>`, not the outer `<svg>` (that's
 * `<ChartFrame>` upstream). Stateless render-prop pattern exposes
 * innerWidth/innerHeight to children — no context boundary.
 *
 * `filterId` (optional): when supplied, applied as `filter="url(#id)"` on
 * the inner `<g>` so a single filter region wraps all plot-area children
 * (mirrors donut single-region rule for `<EditorialBevelFilter>`).
 */

import type { JSX, ReactNode } from 'react';

export interface CartesianFrameMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface CartesianFrameDims {
  innerWidth: number;
  innerHeight: number;
}

export interface CartesianFrameProps {
  width: number;
  height: number;
  margin: CartesianFrameMargin;
  /** Render-prop children — receives plot-area inner dimensions. */
  children: (dims: CartesianFrameDims) => ReactNode;
  /** When supplied, applied as `filter="url(#filterId)"` on the inner <g>. */
  filterId?: string;
}

export function CartesianFrame({
  width,
  height,
  margin,
  children,
  filterId,
}: CartesianFrameProps): JSX.Element {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  return (
    <g
      data-testid="cartesian-frame"
      transform={`translate(${margin.left},${margin.top})`}
      filter={filterId ? `url(#${filterId})` : undefined}
    >
      {children({ innerWidth, innerHeight })}
    </g>
  );
}
