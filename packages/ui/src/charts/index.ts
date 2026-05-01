/**
 * Eager (T1) chart exports + chart tokens.
 *
 * Subpath `@investment-tracker/ui/charts`. Apps that don't render charts
 * (mobile tab-only bundles) can tree-shake Recharts entirely. T2/T3
 * charts live in `@investment-tracker/ui/charts/lazy` and load via
 * `React.lazy()`.
 *
 * Type re-exports come from `@investment-tracker/shared-types/charts` —
 * the canonical Zod-derived contract. Importing here means consumers do
 * not need a second package dependency.
 */

/**
 * Phase β.1 feature-flag switch — `NEXT_PUBLIC_PROVEDO_CHART_BACKEND`.
 *
 * Default `'recharts'` (zero downstream impact). Set to `'primitives'` to
 * route migrated chart kinds to the custom SVG primitives layer
 * (`packages/ui/src/charts/primitives/{math,svg}/`).
 *
 * Phase β.1.1 added the flag scaffold + `ACTIVE_CHART_BACKEND` export.
 * Phase β.1.2 (Sparkline) + β.1.3 (Donut) wired the per-kind branches.
 * Phase β.1.5 (TD-117 closure) consolidated the env read into the single
 * `getActiveBackend()` resolver in `_shared/chart-backend-dispatch.tsx` —
 * the barrel re-exports its result as `ACTIVE_CHART_BACKEND`.
 *
 * IMPORTANT — hydration safety. Because the read sits in a workspace
 * package (`@investment-tracker/ui`), Next.js 15 + Turbopack do NOT
 * inline `NEXT_PUBLIC_*` symmetrically across the server / client
 * bundle boundary the way they do for `apps/web` source. Server reads
 * `apps/web/.env.local` and resolves `'primitives'`; the workspace
 * package's client bundle falls back to `'recharts'`. This produces a
 * React hydration mismatch on `<DonutChart>` / `<Sparkline>`.
 *
 * Mitigation = TWO LAYERS + per-consumer setup:
 *   1. `apps/web/next.config.ts` echoes the var into its `env:` block —
 *      pins the value for the apps/web bundle. Other consumers (Vitest,
 *      Storybook, mobile) must mirror this (see `CHARTS_SPEC.md` §3.13).
 *   2. `makeBackendDispatch` renders V1 on the *server-side baseline*
 *      for the FIRST paint and upgrades to V2 only after mount via
 *      `useEffect`. SSR === client-first-render === V1; V2 swaps in
 *      after mount. Hydration is now safe even if Layer 1 misfires.
 */
import {
  getActiveBackend,
  makeBackendDispatch,
  type ChartBackend,
} from './_shared/chart-backend-dispatch';
import { BarChart as BarChartV1, type BarChartProps } from './BarChart';
import { BarChartV2, type BarChartV2Props } from './BarChartV2';
import { DonutChart as DonutChartV1, type DonutChartProps } from './DonutChart';
import { DonutChartV2, type DonutChartV2Props } from './DonutChartV2';
import { Sparkline as SparklineV1, type SparklineProps } from './Sparkline';
import { SparklineV2, type SparklineV2Props } from './SparklineV2';

/**
 * Active backend, exposed for tests + dev tooling. Per-kind switches read
 * from this constant. Resolved via the canonical `getActiveBackend()`
 * resolver — single source of truth, cached at module-eval per consumer.
 *
 * NOT used directly in render paths — those go through the SSR-safe
 * `chart-backend-dispatch` helpers below.
 */
export const ACTIVE_CHART_BACKEND: ChartBackend = getActiveBackend();

export { getActiveBackend, type ChartBackend } from './_shared/chart-backend-dispatch';

/**
 * Per-kind SSR-safe dispatchers. The dispatcher generic `<P1, P2 extends P1>`
 * keeps the public surface typed as the V2 prop shape (the superset), so
 * V2-only optional props (`cornerRadius`, `startAngleRadians`, etc.) are
 * reachable through the unified export. V1 silently drops extras at runtime
 * via destructure — Liskov-safe by construction.
 *
 * The dispatcher always renders V1 on the server + first client paint
 * (matching SSR), then upgrades to V2 inside `useEffect` if the flag
 * resolves to `'primitives'`. Hydration mismatch eliminated.
 */
export const Sparkline = makeBackendDispatch<SparklineProps, SparklineV2Props>(
  SparklineV1,
  SparklineV2,
  'Sparkline',
);
export const DonutChart = makeBackendDispatch<DonutChartProps, DonutChartV2Props>(
  DonutChartV1,
  DonutChartV2,
  'DonutChart',
);
export const BarChart = makeBackendDispatch<BarChartProps, BarChartV2Props>(
  BarChartV1,
  BarChartV2,
  'BarChart',
);

export type { SparklineProps } from './Sparkline';
export type { DonutChartProps } from './DonutChart';
export type { BarChartProps } from './BarChart';

/** V2 named exports — consumers that want the primitives variant unconditionally. */
export { SparklineV2, type SparklineV2Props } from './SparklineV2';
export {
  DonutChartV2,
  type DonutChartV2Props,
  type DonutLabelPosition,
} from './DonutChartV2';
export { BarChartV2, type BarChartV2Props } from './BarChartV2';

/**
 * visx-powered candy POC exports (2026-05-01). NOT a third backend — these
 * are imported directly by the `/design-system#charts-visx` showcase
 * section so PO can compare visx-candy vs V2-primitives side-by-side
 * before committing to a migration. Do not wire into the dispatcher.
 */
export { DonutVisx, type DonutVisxProps } from './visx/DonutVisx';
export { BarVisx, type BarVisxProps } from './visx/BarVisx';

export { LineChart, type LineChartProps } from './LineChart';
export { AreaChart, type AreaChartProps } from './AreaChart';
export { Calendar, type CalendarProps } from './Calendar';
export { Treemap, type TreemapProps } from './Treemap';

export {
  CHART_ANIMATION_MS,
  CHART_TOKENS,
  CHART_COLORS,
  DONUT_ORDER,
  SERIES_PALETTE,
  SERIES_VARS,
  colorForTreemapChange,
  fillOpacityForTreemapChange,
  labelOnTile,
} from './tokens';

export { ChartCard, type ChartCardProps } from './_shared/ChartCard';
export { ChartEmpty } from './_shared/ChartEmpty';
export { ChartError } from './_shared/ChartError';
export { ChartSkeleton } from './_shared/ChartSkeleton';
export {
  BAR_RADIUS,
  buildAreaGradient,
  buildAxisProps,
  buildChartTheme,
  buildDonutSegmentProps,
  buildGridProps,
  buildLegendWrapperStyle,
  buildLineSeriesProps,
  type AreaGradientStops,
  type AxisTickProps,
  type ChartTheme,
  type DonutSegmentVisuals,
  type GridProps,
  type LineSeriesVisuals,
} from './_shared/buildChartTheme';

// Demo / fixture payloads — re-exported for the showcase route + smoke tests.
// Not intended for production AI agent emissions.
export {
  AREA_FIXTURE,
  BAR_DRIFT_FIXTURE,
  BAR_FIXTURE,
  CALENDAR_FIXTURE,
  CANDLESTICK_FIXTURE,
  DONUT_FIXTURE,
  LINE_FIXTURE,
  SPARKLINE_FIXTURE,
  STACKED_BAR_FIXTURE,
  TREEMAP_FIXTURE,
  WATERFALL_FIXTURE,
} from './_shared/fixtures';

export { CHART_KINDS, type ChartKind } from './types';

export type {
  AreaChartPayload,
  BarChartPayload,
  CalendarPayload,
  CandlestickChartPayload,
  ChartEnvelope,
  ChartMeta,
  ChartPayload,
  DonutChartPayload,
  LineChartPayload,
  SparklinePayload,
  StackedBarChartPayload,
  TreemapPayload,
  WaterfallPayload,
  WaterfallStep,
} from '@investment-tracker/shared-types/charts';
