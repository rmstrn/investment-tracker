'use client';

/**
 * LinePath — single SVG `<path>` consuming `linePath()` from the math layer.
 *
 * Per product-designer §2.4: 2px round-cap stroke, currentColor by series,
 * optional dash pattern for color-blind safety. The «glow» variant from the
 * spec is deferred to Layer 3 (chart-kind opt-in for hero KPI lines).
 *
 * Per aggregate decision #2: «generators return strings, React owns `<path>`».
 * This primitive is pure rendering — caller passes pre-scaled `points` and a
 * colour token. No DOM measurement, no D3 selections.
 *
 * `animateOnMount` opt-in delegates to `useStrokeDashoffset`. The animation
 * skips automatically when `prefers-reduced-motion: reduce` is honored (caller
 * passes `reduced` via the hook's contract — typically through `<ChartFrame>`
 * context or a direct `useReducedMotion()` call upstream).
 */

import { type CSSProperties, useEffect, useRef, useState } from 'react';
import type { CurveKind, LinePoint } from '../math/path';
import { linePath } from '../math/path';
import { useStrokeDashoffset } from './useStrokeDashoffset';

export interface LinePathProps {
  /** Pre-scaled points in chart pixel space. */
  points: readonly LinePoint[];
  /** Series colour CSS variable, e.g. `var(--chart-series-1)`. */
  colorVar: string;
  /** Stroke width. Default 2 per product-designer §2.4. */
  strokeWidth?: number;
  /**
   * SVG `stroke-dasharray` for color-blind safety. Caller resolves via
   * `seriesEncoding` lookup (Layer 3 concern).
   */
  dashPattern?: string;
  /** Path interpolation. Default `"linear"` per math-layer default. */
  curve?: CurveKind;
  /** Opt-in stroke draw-in animation. Default `false` (calm-by-default). */
  animateOnMount?: boolean;
  /** When `true` skip the animation (reduced-motion). */
  reducedMotion?: boolean;
  /** Animation duration in ms. Default 300 per product-designer table. */
  animationDurationMs?: number;
  /** Optional className for state-dependent styling (hover, focus). */
  className?: string;
}

const STROKE_BASE: CSSProperties = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function LinePath({
  points,
  colorVar,
  strokeWidth = 2,
  dashPattern,
  curve = 'linear',
  animateOnMount = false,
  reducedMotion = false,
  animationDurationMs = 300,
  className,
}: LinePathProps) {
  const ref = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState(0);

  // Measure total path length once on mount (and on `points` change). Required
  // for stroke-dashoffset animation; set to 0 when animation is disabled so
  // the path renders normally with no dash interference. `points` is in the
  // dep list intentionally — when the array identity changes, the rendered
  // path geometry has changed, so we must re-measure even though the closure
  // body reads only `ref.current`.
  // biome-ignore lint/correctness/useExhaustiveDependencies: points triggers re-measure of the rendered path geometry.
  useEffect(() => {
    if (!animateOnMount || !ref.current) {
      setPathLength(0);
      return;
    }
    try {
      const total = ref.current.getTotalLength?.() ?? 0;
      setPathLength(total);
    } catch {
      // happy-dom / older jsdom fallback — bail silently.
      setPathLength(0);
    }
  }, [animateOnMount, points]);

  const dash = useStrokeDashoffset({
    pathLength,
    durationMs: animationDurationMs,
    reduced: reducedMotion,
  });

  const d = linePath(points, { curve });

  const animationStyle: CSSProperties = animateOnMount
    ? {
        strokeDasharray: dashPattern ?? `${dash.strokeDasharray}`,
        strokeDashoffset: dash.strokeDashoffset,
      }
    : {
        strokeDasharray: dashPattern,
      };

  return (
    <path
      ref={ref}
      d={d}
      stroke={colorVar}
      strokeWidth={strokeWidth}
      className={className}
      style={{ ...STROKE_BASE, ...animationStyle }}
    />
  );
}
