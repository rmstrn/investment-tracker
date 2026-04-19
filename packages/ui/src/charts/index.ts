/**
 * Chart wrappers — styled Recharts components that read design tokens.
 *
 * Exposed as `@investment-tracker/ui/charts` subpath so apps which don't
 * render charts (mobile tab-only bundles) can tree-shake Recharts entirely.
 * Do NOT re-export from packages/ui root.
 */

export { AreaChart, type AreaChartDatum, type AreaChartProps } from './AreaChart';
export { BarChart, type BarChartDatum, type BarChartProps } from './BarChart';
export { DonutChart, type DonutChartProps, type DonutSlice } from './DonutChart';
export { CHART_ANIMATION_MS, CHART_COLORS, SERIES_PALETTE } from './tokens';
