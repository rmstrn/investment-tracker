'use client';

import { type HTMLAttributes, useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { useReducedMotion } from '../lib/useReducedMotion';

export interface CountUpNumberProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  value: number;
  /** Format the numeric value for display. Default: `value.toLocaleString()`. */
  format?: (n: number) => string;
  /** Duration in ms. Default 800 (brief §3.5). */
  duration?: number;
  /** Start value for the animation. Defaults to 0. */
  from?: number;
}

const EXP_OUT = (t: number) => 1 - (1 - t) ** 3;

/**
 * CountUpNumber — tabular-nums animated ticker. Brief §3.5, §5.1.
 * Reduced-motion: sets value instantly with no animation.
 */
export function CountUpNumber({
  value,
  format,
  duration = 800,
  from = 0,
  className,
  ...props
}: CountUpNumberProps) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : from);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(from);

  // biome-ignore lint/correctness/useExhaustiveDependencies: display is read once to seed the animation's from-value; adding it would restart the tween every frame as display updates mid-flight.
  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    fromRef.current = display;
    startRef.current = null;
    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const next = fromRef.current + (value - fromRef.current) * EXP_OUT(t);
      setDisplay(next);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, reduced]);

  const fmt = format ?? ((n) => n.toLocaleString());
  return (
    <span className={cn('tabular-nums', className)} {...props}>
      {fmt(display)}
    </span>
  );
}
