'use client';

/**
 * useHoverScale — gate the hover-scale animation on bar dimension + reduced
 * motion.
 *
 * Per spec docs/superpowers/specs/2026-04-30-bar-chart-v2-design.md §5.4:
 * scale(1.06) hover-lift on bars matches the donut V2 register, but tiny
 * bars (<12px) would render the scale as a no-op / razor-pop. The hook
 * skips scale on those, falling back to the paper-press shadow only.
 *
 * `barDimensionPx` should be `min(width, height)` to handle both vertical
 * and horizontal layouts — razor-thin in either direction skips scale.
 */

import { useReducedMotion } from './useReducedMotion';

export const HOVER_SCALE_THRESHOLD_PX = 12;
export const HOVER_SCALE_FACTOR = 1.06;

export interface HoverScaleResult {
  /** 1.06 when enabled; 1 otherwise. */
  scale: number;
  /** 12. */
  threshold: number;
  /** True when bar dim >= threshold AND not reduced-motion. */
  enabled: boolean;
}

export function useHoverScale(barDimensionPx: number): HoverScaleResult {
  const reduced = useReducedMotion();
  const enabled = barDimensionPx >= HOVER_SCALE_THRESHOLD_PX && !reduced;
  return {
    scale: enabled ? HOVER_SCALE_FACTOR : 1,
    threshold: HOVER_SCALE_THRESHOLD_PX,
    enabled,
  };
}
