/**
 * Local chart-kind enum used for non-payload contexts (skeleton, empty, error
 * surfaces). Mirrors the discriminator literal of every member of the MVP
 * `ChartPayload` union from `@investment-tracker/shared-types/charts`.
 *
 * If a new chart kind ships to MVP, add it both to the Zod union AND to this
 * tuple — TypeScript will fail the renderer until both are aligned.
 */

export const CHART_KINDS = [
  'line',
  'area',
  'bar',
  'stacked-bar',
  'donut',
  'sparkline',
  'calendar',
  'treemap',
  'waterfall',
  'candlestick',
] as const;

export type ChartKind = (typeof CHART_KINDS)[number];
