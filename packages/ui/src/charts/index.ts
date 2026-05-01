/**
 * Chart subsystem barrel — visx-candy backend (post-Phase-E).
 *
 * Subpath `@investment-tracker/ui/charts`. The Recharts-backed V1 wrappers
 * and the V2 custom-SVG primitives layer were retired on 2026-05-01 (Phase
 * E of the visx-candy migration). The single canonical chart surface is
 * the visx-powered candy variant exported below.
 *
 * Type re-exports come from `@investment-tracker/shared-types/charts` —
 * the canonical Zod-derived contract. Importing here means consumers do
 * not need a second package dependency.
 */

/* ─── visx-candy chart components ─────────────────────────────────────── */
export { AreaVisx, type AreaVisxProps } from './visx/AreaVisx';
export { BarVisx, type BarVisxProps } from './visx/BarVisx';
export { CalendarVisx, type CalendarVisxProps } from './visx/CalendarVisx';
export { DonutVisx, type DonutVisxProps } from './visx/DonutVisx';
export { LineVisx, type LineVisxProps } from './visx/LineVisx';
export { SparklineVisx, type SparklineVisxProps } from './visx/SparklineVisx';
export { StackedBarVisx, type StackedBarVisxProps } from './visx/StackedBarVisx';
export { TreemapVisx, type TreemapVisxProps } from './visx/TreemapVisx';
export { WaterfallVisx, type WaterfallVisxProps } from './visx/WaterfallVisx';

/* ─── Tokens ──────────────────────────────────────────────────────────── */
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

/* ─── Shared shells (state placeholders + frame) ─────────────────────── */
export { ChartCard, type ChartCardProps } from './_shared/ChartCard';
export { ChartEmpty } from './_shared/ChartEmpty';
export { ChartError } from './_shared/ChartError';
export { ChartSkeleton } from './_shared/ChartSkeleton';

/* ─── Demo / fixture payloads ─────────────────────────────────────────── */
// Re-exported for the showcase route + smoke tests; not intended for
// production AI agent emissions.
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

/* ─── Kind discriminator ──────────────────────────────────────────────── */
export { CHART_KINDS, type ChartKind } from './types';

/* ─── Type re-exports ─────────────────────────────────────────────────── */
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
