/**
 * AreaGradientDef — `<defs><linearGradient>` for area-chart fills.
 *
 * Per aggregate Pattern §1 («`<defs><linearGradient>` per chart with `useId()`
 * to avoid ID collisions on multi-chart pages») and product-designer atom D
 * («Vertical alpha gradient 30% → 0% — paper soaked through»).
 *
 * Layer 2 / Phase α.2.2. Returns a stable React fragment with `<defs>` so
 * caller can compose it inside any SVG canvas:
 *
 *   const { gradientId, def } = useAreaGradient({ colorVar: '...' });
 *   return <svg>{def}<path fill={`url(#${gradientId})`} d={...} /></svg>;
 *
 * The hook returns the gradient ID separately so the consumer can apply it
 * to multiple `<path>` elements (e.g. focused / unfocused stack rows).
 */

import { type ReactElement, useId } from 'react';

export interface AreaGradientDefOptions {
  /** Series colour. Use a CSS variable for theme-aware behavior. */
  readonly colorVar: string;
  /** Top stop opacity (0–1). Default 0.30 per atom-D spec. */
  readonly topOpacity?: number;
  /** Bottom stop opacity (0–1). Default 0 (full fade). */
  readonly bottomOpacity?: number;
}

export interface AreaGradientHandle {
  /** Stable id for use as `fill={`url(#${gradientId})`}`. */
  readonly gradientId: string;
  /** `<defs>` element ready to drop into the SVG tree. */
  readonly def: ReactElement;
}

/**
 * Build a vertical area gradient definition. Hook (uses `useId` for SSR-safe
 * unique ids).
 *
 * Returns `{ gradientId, def }` — caller renders `def` once inside the SVG
 * tree and references `gradientId` from `<path fill={`url(#${gradientId})`}>`.
 */
export function useAreaGradient(options: AreaGradientDefOptions): AreaGradientHandle {
  const id = useId();
  const gradientId = `area-grad-${id.replace(/:/g, '')}`;
  const { colorVar, topOpacity = 0.3, bottomOpacity = 0 } = options;

  const def = (
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={colorVar} stopOpacity={topOpacity} />
        <stop offset="100%" stopColor={colorVar} stopOpacity={bottomOpacity} />
      </linearGradient>
    </defs>
  );

  return { gradientId, def };
}

/**
 * Declarative form for callers that prefer JSX composition over a hook.
 *
 * Pass an explicit `id` (e.g. `useId()` at the call site) to keep the
 * gradient referenceable. Used internally by `<AreaPath>` when the consumer
 * does not supply their own gradient.
 */
export interface AreaGradientDefProps {
  id: string;
  colorVar: string;
  topOpacity?: number;
  bottomOpacity?: number;
}

export function AreaGradientDef({
  id,
  colorVar,
  topOpacity = 0.3,
  bottomOpacity = 0,
}: AreaGradientDefProps) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={colorVar} stopOpacity={topOpacity} />
        <stop offset="100%" stopColor={colorVar} stopOpacity={bottomOpacity} />
      </linearGradient>
    </defs>
  );
}
