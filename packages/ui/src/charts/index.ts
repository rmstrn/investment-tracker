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
 *
 * Phase E1 (visx-candy migration) — V2-primitives backend deleted. The
 * barrel now exports V1 (Recharts) directly. Phase E2 will retire V1 in
 * favour of visx; the visx exports below remain the post-migration target
 * until then.
 */
import { BarChart as BarChartV1 } from './BarChart';
import { DonutChart as DonutChartV1 } from './DonutChart';
import { Sparkline as SparklineV1 } from './Sparkline';

/**
 * Public chart components — currently V1 (Recharts) wrappers. Phase E2
 * will swap these to visx-backed variants.
 */
export const Sparkline = SparklineV1;
export const DonutChart = DonutChartV1;
export const BarChart = BarChartV1;

export type { SparklineProps } from './Sparkline';
export type { DonutChartProps } from './DonutChart';
export type { BarChartProps } from './BarChart';

/**
 * visx-powered candy POC exports (2026-05-01). The Phase E2 migration
 * target — currently imported directly by the
 * `/design-system#charts-visx` showcase section so PO can compare the
 * visx surface against V1 side-by-side before V1 is retired.
 */
export { DonutVisx, type DonutVisxProps } from './visx/DonutVisx';
export { BarVisx, type BarVisxProps } from './visx/BarVisx';
export { LineVisx, type LineVisxProps } from './visx/LineVisx';
export { AreaVisx, type AreaVisxProps } from './visx/AreaVisx';
export { SparklineVisx, type SparklineVisxProps } from './visx/SparklineVisx';
export { TreemapVisx, type TreemapVisxProps } from './visx/TreemapVisx';
export { CalendarVisx, type CalendarVisxProps } from './visx/CalendarVisx';
export { StackedBarVisx, type StackedBarVisxProps } from './visx/StackedBarVisx';
export { WaterfallVisx, type WaterfallVisxProps } from './visx/WaterfallVisx';

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
