'use client';

/**
 * `useAnimatedNumber` — KPI count-up tween hook.
 *
 * Tweens a numeric value from previous → target via `requestAnimationFrame`.
 * Used for the «Magician quiet revelation» moment described in product-designer
 * atom-H (the moment Provedo surfaces a finding) — KPI count-up paired with
 * `<CitationGlyph>` carries the brand voice.
 *
 * Per aggregate decision #3, animation hooks honor `prefers-reduced-motion` at
 * the hook boundary — when `reduced === true` the hook returns the target
 * value immediately and never tweens.
 *
 * Locale-aware formatting is the consumer's concern; this hook returns a
 * raw number so callers can pipe through `Intl.NumberFormat`.
 */

import { useEffect, useRef, useState } from 'react';

export interface UseAnimatedNumberOptions {
  /** The target value to tween to. */
  readonly value: number;
  /** Total tween duration in milliseconds. Default 600 (matches product-designer spec). */
  readonly durationMs?: number;
  /** Honors `prefers-reduced-motion`. When true returns target immediately. */
  readonly reduced?: boolean;
}

/**
 * Cubic ease-out — same easing as `useStrokeDashoffset` for visual coherence
 * (numbers and lines settle on the same curve).
 */
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function useAnimatedNumber(options: UseAnimatedNumberOptions): number {
  const { value, durationMs = 600, reduced = false } = options;

  // Track the previous tween end-state so re-targeting (KPI updates) animates
  // from the last visible value rather than zero. Initial mount tweens from
  // the target itself (no animation) when `reduced` is set; otherwise tweens
  // from 0 to give the count-up effect on first render.
  const previousValueRef = useRef<number>(reduced ? value : 0);
  const [current, setCurrent] = useState<number>(previousValueRef.current);

  useEffect(() => {
    if (reduced || durationMs <= 0) {
      previousValueRef.current = value;
      setCurrent(value);
      return;
    }

    const startValue = previousValueRef.current;
    const delta = value - startValue;
    if (delta === 0) {
      // No-op if target equals current — avoids a 0-distance frame loop.
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (): void => {
      const elapsed = performance.now() - start;
      const t = Math.min(elapsed / durationMs, 1);
      const next = startValue + delta * easeOutCubic(t);
      setCurrent(next);
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        previousValueRef.current = value;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs, reduced]);

  return current;
}
