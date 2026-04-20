/**
 * Chart period selector — UI label ↔ `/market/history?period=` mapping.
 * OpenAPI enum: `1d | 5d | 1m | 3m | 6m | 1y | 5y | max`.
 */
export const PERIOD_UI_VALUES = ['1W', '1M', '3M', '6M', '1Y', 'All'] as const;
export type PeriodUi = (typeof PERIOD_UI_VALUES)[number];

export type PeriodApi = '5d' | '1m' | '3m' | '6m' | '1y' | 'max';

const UI_TO_API: Record<PeriodUi, PeriodApi> = {
  '1W': '5d',
  '1M': '1m',
  '3M': '3m',
  '6M': '6m',
  '1Y': '1y',
  All: 'max',
};

export function mapPeriodUiToApi(period: PeriodUi): PeriodApi {
  return UI_TO_API[period];
}
