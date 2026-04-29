'use client';

/**
 * AreaPath — single SVG `<path>` consuming `areaPath()` from the math layer.
 *
 * Per product-designer §2.5 («paper-soaked gradient under a 2px stroke-cap
 * line») the area primitive renders the filled region only. The optional
 * stroke-cap line on the upper bound is owned by Layer 3 (chart-kind layers
 * a `<LinePath>` for the y1 boundary). Keeps this primitive single-purpose.
 *
 * Caller passes a `gradientId` resolved from `useAreaGradient()` (or supplies
 * an `<AreaGradientDef>` sibling) — the primitive references it via
 * `fill={`url(#${gradientId})`}`. This decouples gradient definition from
 * usage, allowing one gradient to be shared across multiple area paths
 * (e.g. focused / unfocused stack rows in a Stacked Area).
 */

import type { CSSProperties } from 'react';
import { areaPath } from '../math/path';
import type { AreaPoint, CurveKind } from '../math/path';

export interface AreaPathProps {
  /** Pre-scaled points with y0 + y1 bounds in chart pixel space. */
  points: readonly AreaPoint[];
  /**
   * Gradient id — typically obtained via `useAreaGradient({ ... }).gradientId`
   * or a sibling `<AreaGradientDef id={...}>`. Required so the area fills
   * with the per-chart gradient rather than a flat colour.
   */
  gradientId: string;
  /** Path interpolation. Default `"linear"`. */
  curve?: CurveKind;
  /**
   * Optional stroke colour for the upper bound. Pass undefined (the default)
   * to keep the area fill-only — Layer 3 wrappers render a `<LinePath>` on
   * top for the visual stroke cap.
   */
  strokeColorVar?: string;
  /** Optional className for state-dependent styling. */
  className?: string;
}

const AREA_BASE: CSSProperties = {
  pointerEvents: 'none',
};

export function AreaPath({
  points,
  gradientId,
  curve = 'linear',
  strokeColorVar,
  className,
}: AreaPathProps) {
  const d = areaPath(points, { curve });
  return (
    <path
      d={d}
      fill={`url(#${gradientId})`}
      stroke={strokeColorVar ?? 'none'}
      strokeWidth={strokeColorVar ? 2 : 0}
      className={className}
      style={AREA_BASE}
    />
  );
}
