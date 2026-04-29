/**
 * Lazy chart exports — T2 + T3.
 *
 * Subpath `@investment-tracker/ui/charts/lazy`. Each export is a `React.lazy()`
 * wrapper that defers the heavy bundle until the component first renders.
 *
 * Consumers wrap usage in `<Suspense fallback={<ChartSkeleton kind="..." />}>`.
 *
 * Lane-A note: Candlestick is exported here but NOT demoed in the showcase
 * route. PO greenlight + legal-advisor sign-off required before any product
 * surface mounts a Candlestick instance.
 *
 * Scatter is V2-deferred (architect ADR Δ3) and is NOT exported.
 */

import { lazy } from 'react';

export const LazyStackedBar = lazy(() =>
  import('./StackedBar').then((m) => ({ default: m.StackedBar })),
);

export const LazyWaterfall = lazy(() =>
  import('./Waterfall').then((m) => ({ default: m.Waterfall })),
);

export const LazyCandlestick = lazy(() =>
  import('./Candlestick').then((m) => ({ default: m.Candlestick })),
);

// Re-export computeWaterfallSteps eagerly so QA can unit-test the math
// without paying the full Waterfall bundle cost. Resolved at module load.
export { computeWaterfallSteps } from './Waterfall';
export type { WaterfallVisualStep } from './Waterfall';

export type { StackedBarProps } from './StackedBar';
export type { WaterfallProps } from './Waterfall';
export type { CandlestickProps } from './Candlestick';
