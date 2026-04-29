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
 * Phase β.1.1 (this commit) adds the flag scaffold + `ACTIVE_CHART_BACKEND`
 * export — no chart kinds re-route yet. Phase β.1.2 (Sparkline) and β.1.3
 * (Donut) add the per-kind branches.
 *
 * Read at module evaluation time (not inside a component) so the choice
 * propagates as a static export. Per Next.js 15 + Turbopack inlining,
 * `process.env.NEXT_PUBLIC_*` resolves at build time on the client and at
 * eval time on the server, both of which match consumer expectations.
 */
const PROVEDO_CHART_BACKEND =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_PROVEDO_CHART_BACKEND) || 'recharts';

/**
 * Active backend, exposed for tests + dev tooling. Per-kind switches (added
 * in β.1.2+) read from this constant.
 */
export const ACTIVE_CHART_BACKEND = PROVEDO_CHART_BACKEND as 'recharts' | 'primitives';

const usePrimitives = ACTIVE_CHART_BACKEND === 'primitives';

import { DonutChart as DonutChartV1 } from './DonutChart';
import { DonutChartV2 } from './DonutChartV2';
import { Sparkline as SparklineV1 } from './Sparkline';
import { SparklineV2 } from './SparklineV2';

/**
 * Per-kind feature-flag branches. Both V1 + V2 share the `*Props` type
 * contract — V2 is API-compatible by design (DonutChartV2 adds optional
 * extension props that V1 ignores when the flag is `recharts`).
 */
export const Sparkline = usePrimitives ? SparklineV2 : SparklineV1;
export const DonutChart = usePrimitives ? DonutChartV2 : DonutChartV1;

export type { SparklineProps } from './Sparkline';
export type { DonutChartProps } from './DonutChart';

/** V2 named exports — consumers that want the primitives variant unconditionally. */
export { SparklineV2, type SparklineV2Props } from './SparklineV2';
export {
  DonutChartV2,
  type DonutChartV2Props,
  type DonutLabelPosition,
} from './DonutChartV2';

export { LineChart, type LineChartProps } from './LineChart';
export { AreaChart, type AreaChartProps } from './AreaChart';
export { BarChart, type BarChartProps } from './BarChart';
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
