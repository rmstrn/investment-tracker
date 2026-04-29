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

export { LineChart, type LineChartProps } from './LineChart';
export { AreaChart, type AreaChartProps } from './AreaChart';
export { BarChart, type BarChartProps } from './BarChart';
export { DonutChart, type DonutChartProps } from './DonutChart';
export { Sparkline, type SparklineProps } from './Sparkline';
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
  labelOnTile,
} from './tokens';

export { ChartEmpty } from './_shared/ChartEmpty';
export { ChartError } from './_shared/ChartError';
export { ChartSkeleton } from './_shared/ChartSkeleton';

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
