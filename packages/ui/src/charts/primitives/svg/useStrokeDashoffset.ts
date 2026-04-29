'use client';

/**
 * `useStrokeDashoffset` — line draw-in animation hook.
 *
 * Animates `stroke-dasharray` + `stroke-dashoffset` from full path length →
 * zero offset, producing the «paper drawing in» reveal that the static
 * reference uses for hero KPI lines (product-designer atom-D adjacent
 * — animation table row 1).
 *
 * Per aggregate decision #3 («No framer-motion. Reduced-motion gated at hook
 * level»). Pure `requestAnimationFrame` — ~50 LOC, no runtime dep added.
 *
 * Returns `{ strokeDasharray, strokeDashoffset }` to spread on a `<path>`.
 * When `reduced === true` returns the final state immediately so the path
 * is fully drawn but never animates.
 */

import { useEffect, useState } from 'react';

export interface UseStrokeDashoffsetOptions {
  /** Total path length in user units. Caller measures via `pathRef.current.getTotalLength()`. */
  readonly pathLength: number;
  /** Animation duration in milliseconds. */
  readonly durationMs: number;
  /** Honors `prefers-reduced-motion`. When true returns final state (no animation). */
  readonly reduced: boolean;
}

export interface StrokeDashoffsetState {
  readonly strokeDasharray: number;
  readonly strokeDashoffset: number;
}

/**
 * Cubic ease-out — visually decelerates the draw-in. Keeps the «final
 * settled» feeling characteristic of editorial visuals.
 */
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function useStrokeDashoffset(options: UseStrokeDashoffsetOptions): StrokeDashoffsetState {
  const { pathLength, durationMs, reduced } = options;

  const finalState: StrokeDashoffsetState = {
    strokeDasharray: pathLength,
    strokeDashoffset: 0,
  };
  const initialState: StrokeDashoffsetState = reduced
    ? finalState
    : { strokeDasharray: pathLength, strokeDashoffset: pathLength };

  const [state, setState] = useState<StrokeDashoffsetState>(initialState);

  useEffect(() => {
    if (reduced || pathLength <= 0 || durationMs <= 0) {
      // Reduced motion → snap to final state. Per aggregate Pattern 6, the
      // primitive never overrides user motion preference.
      setState({ strokeDasharray: pathLength, strokeDashoffset: 0 });
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (): void => {
      const elapsed = performance.now() - start;
      const t = Math.min(elapsed / durationMs, 1);
      const eased = easeOutCubic(t);
      setState({
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength * (1 - eased),
      });
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [pathLength, durationMs, reduced]);

  return state;
}
