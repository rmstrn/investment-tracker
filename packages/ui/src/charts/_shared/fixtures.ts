/**
 * Canonical example payloads for the 10 MVP chart kinds.
 *
 * Sourced from CHARTS_SPEC §5.3 + chart-component-catalog v1.1. Used by the
 * `/design#charts` showcase route AND by the smoke tests so visual demo and
 * snapshot fixtures stay in lockstep.
 *
 * Sum-to-total fixtures are pre-validated against the envelope-level
 * refinement (architect Δ1): donut segments sum to `meta.reportedTotal`;
 * treemap weightPct sums to 100; waterfall conservation holds within $1.
 */

import type {
  AreaChartPayload,
  BarChartPayload,
  CalendarPayload,
  CandlestickChartPayload,
  DonutChartPayload,
  LineChartPayload,
  MultiSeriesPoint,
  SparklinePayload,
  StackedBarChartPayload,
  TreemapPayload,
  WaterfallPayload,
} from '@investment-tracker/shared-types/charts';

/**
 * `MultiSeriesPoint` has `.catchall(z.number())` so `z.infer` tightens to
 * `{ x: string|number; [k: string]: number }`. Fixtures are authored as
 * plain object literals; this helper cast keeps them readable while still
 * guaranteeing the runtime shape via the schema (parsed in tests).
 */
function asMultiSeries<T extends Record<string, string | number>>(rows: T[]): MultiSeriesPoint[] {
  return rows as unknown as MultiSeriesPoint[];
}

export const LINE_FIXTURE: LineChartPayload = {
  kind: 'line',
  meta: {
    title: 'Portfolio value',
    subtitle: 'Last 30 days · all brokers',
    source: 'IBKR + Binance · synced 2026-04-26',
    alt: 'Portfolio value line chart',
  },
  xAxis: { format: 'date-day', label: 'Date' },
  yAxis: { format: 'currency-compact', currency: 'USD', label: 'Value' },
  series: [{ key: 'y', label: 'Total' }],
  data: asMultiSeries(
    Array.from({ length: 30 }, (_, i) => {
      const day = new Date(2026, 2, 28 + i);
      return {
        x: day.toISOString().slice(0, 10),
        y: 220000 + Math.sin(i / 3) * 4500 + i * 950,
      };
    }),
  ),
  interpolation: 'monotone',
};

/**
 * Showcase area fixture — cumulative P&L trend.
 *
 * `interpolation: 'monotone'` per PO feedback (2026-04-29) — the prior
 * `'step'` setting produced a stair-step ascent that read as broken. A
 * cumulative-P&L curve is a continuous trend (not a discrete-event sum),
 * so monotonic-cubic conveys the «smooth growth» story. The denser data
 * (12 monthly rows instead of 4) gives the curve room to breathe so the
 * monotonic interpolation actually has signal to follow.
 */
export const AREA_FIXTURE: AreaChartPayload = {
  kind: 'area',
  meta: {
    title: 'Cumulative P&L',
    subtitle: 'Year to date · all brokers',
    alt: 'Cumulative profit and loss area chart',
  },
  xAxis: { format: 'date-month', label: 'Month' },
  yAxis: { format: 'currency-compact', currency: 'USD', label: 'Cumulative' },
  series: [{ key: 'cumulative', label: 'Cumulative' }],
  data: asMultiSeries([
    { x: '2026-01-01', cumulative: 0 },
    { x: '2026-01-15', cumulative: 1800 },
    { x: '2026-02-01', cumulative: 4400 },
    { x: '2026-02-15', cumulative: 6200 },
    { x: '2026-03-01', cumulative: 9100 },
    { x: '2026-03-15', cumulative: 11800 },
    { x: '2026-04-01', cumulative: 15400 },
    { x: '2026-04-15', cumulative: 19200 },
    { x: '2026-04-26', cumulative: 22890 },
  ]),
  stacked: false,
  interpolation: 'monotone',
};

export const BAR_FIXTURE: BarChartPayload = {
  kind: 'bar',
  meta: {
    title: 'Monthly P&L',
    subtitle: 'Last 6 months',
    alt: 'Monthly profit and loss',
  },
  xAxis: { format: 'category', label: 'Month' },
  yAxis: { format: 'currency-compact', currency: 'USD', label: 'P&L' },
  data: [
    { x: 'Nov', y: 1200 },
    { x: 'Dec', y: -450 },
    { x: 'Jan', y: 2100 },
    { x: 'Feb', y: 980 },
    { x: 'Mar', y: -230 },
    { x: 'Apr', y: 1640 },
  ],
  orientation: 'vertical',
  colorBySign: true,
  diverging: true,
  referenceLine: { axis: 'zero', label: 'Break-even' },
};

export const BAR_DRIFT_FIXTURE: BarChartPayload = {
  kind: 'bar',
  meta: {
    title: 'Allocation drift',
    subtitle: 'Drift since 2026-01-01 · top 5 positions',
    alt: 'Allocation drift bar chart',
  },
  xAxis: { format: 'category', label: 'Position' },
  yAxis: { format: 'percent-delta', label: 'Drift (pp)' },
  data: [
    { x: 'NVDA', y: 6.3 },
    { x: 'MSFT', y: 1.4 },
    { x: 'AAPL', y: -2.1 },
    { x: 'GOOGL', y: 0.7 },
    { x: 'JNJ', y: -1.2 },
  ],
  orientation: 'vertical',
  colorBySign: true,
  diverging: true,
  referenceLine: { axis: 'zero' },
};

export const STACKED_BAR_FIXTURE: StackedBarChartPayload = {
  kind: 'stacked-bar',
  meta: {
    title: 'Broker contribution',
    subtitle: 'Asset class breakdown by broker',
    alt: 'Stacked bar by broker',
  },
  xAxis: { format: 'category', label: 'Broker' },
  yAxis: { format: 'currency-compact', currency: 'USD', label: 'Value' },
  series: [
    { key: 'stocks', label: 'Stocks' },
    { key: 'etf', label: 'ETFs' },
    { key: 'crypto', label: 'Crypto' },
  ],
  data: asMultiSeries([
    { x: 'IBKR', stocks: 80000, etf: 22000, crypto: 0 },
    { x: 'Binance', stocks: 0, etf: 0, crypto: 32000 },
    { x: 'Lynx', stocks: 60000, etf: 12000, crypto: 0 },
  ]),
};

export const DONUT_FIXTURE: DonutChartPayload = {
  kind: 'donut',
  meta: {
    title: 'Allocation by sector',
    subtitle: '5 sectors · $226,390 total',
    alt: 'Allocation by sector donut',
    reportedTotal: 226390,
    reportedTotalCurrency: 'USD',
    toleranceMode: 'relative',
    toleranceValue: 0.005,
  },
  format: 'currency-compact',
  currency: 'USD',
  segments: [
    { key: 'tech', label: 'Tech', value: 92500 },
    { key: 'fin', label: 'Financials', value: 54200 },
    { key: 'energy', label: 'Energy', value: 38900 },
    { key: 'health', label: 'Healthcare', value: 22800 },
    { key: 'other', label: 'Other', value: 17990 },
  ],
  centerLabel: '$226K',
};

export const SPARKLINE_FIXTURE: SparklinePayload = {
  kind: 'sparkline',
  meta: { title: 'Portfolio · 7d' },
  format: 'currency-compact',
  currency: 'USD',
  data: [
    { x: '2026-04-20', y: 218500 },
    { x: '2026-04-21', y: 220100 },
    { x: '2026-04-22', y: 219800 },
    { x: '2026-04-23', y: 222400 },
    { x: '2026-04-24', y: 225100 },
    { x: '2026-04-25', y: 224700 },
    { x: '2026-04-26', y: 226390 },
  ],
  trend: 'up',
  filled: false,
};

export const CALENDAR_FIXTURE: CalendarPayload = {
  kind: 'calendar',
  meta: {
    title: 'Dividend calendar — April 2026',
    subtitle: '3 received · 2 scheduled · all brokers',
    source: 'IBKR + Lynx · synced 2026-04-26',
    alt: 'Dividend calendar April 2026',
  },
  view: 'month',
  periodStart: '2026-04-01',
  periodEnd: '2026-04-30',
  events: [
    {
      id: 'ev-001',
      eventType: 'dividend',
      ticker: 'KO',
      name: 'Coca-Cola Co',
      exDate: '2026-04-08',
      payDate: '2026-04-12',
      amountPerShare: 0.485,
      shares: 100,
      expectedAmount: 48.5,
      currency: 'USD',
      status: 'received',
      brokerSource: 'IBKR corporate-actions feed',
    },
    {
      id: 'ev-002',
      eventType: 'dividend',
      ticker: 'JNJ',
      name: 'Johnson & Johnson',
      exDate: '2026-04-22',
      payDate: '2026-04-29',
      amountPerShare: 1.19,
      shares: 50,
      expectedAmount: 59.5,
      currency: 'USD',
      status: 'scheduled',
      brokerSource: 'IBKR corporate-actions feed',
    },
    {
      id: 'ev-003',
      eventType: 'corp_action',
      ticker: 'GOOGL',
      name: 'Alphabet Inc',
      effectiveDate: '2026-04-15',
      actionType: 'split',
      ratio: '2:1',
      description: '2-for-1 stock split effective at market open 2026-04-15',
      status: 'announced',
      brokerSource: 'Lynx corporate-actions feed',
    },
  ],
  totalReceived: 284.1,
  totalScheduled: 412.0,
  currency: 'USD',
};

export const TREEMAP_FIXTURE: TreemapPayload = {
  kind: 'treemap',
  meta: {
    title: 'Concentration',
    subtitle: 'Tile size = weight; color = today’s change',
    source: 'IBKR · synced 2026-04-26 14:14 ET',
    alt: 'Concentration treemap',
    reportedTotal: 100,
    toleranceMode: 'absolute',
    toleranceValue: 0.5,
  },
  asOf: '2026-04-26T18:14:00Z',
  baseCurrency: 'USD',
  dailyChangeBasis: 'base',
  tiles: [
    {
      key: 'NVDA',
      ticker: 'NVDA',
      name: 'NVIDIA Corp',
      weightPct: 14.2,
      valueAbs: 32140,
      sector: 'Technology',
      dailyChangePct: 2.1,
      isOther: false,
    },
    {
      key: 'MSFT',
      ticker: 'MSFT',
      name: 'Microsoft Corp',
      weightPct: 11.8,
      valueAbs: 26720,
      sector: 'Technology',
      dailyChangePct: 0.6,
      isOther: false,
    },
    {
      key: 'AAPL',
      ticker: 'AAPL',
      name: 'Apple Inc',
      weightPct: 9.4,
      valueAbs: 21280,
      sector: 'Technology',
      dailyChangePct: -1.2,
      isOther: false,
    },
    {
      key: 'GOOGL',
      ticker: 'GOOGL',
      name: 'Alphabet Inc',
      weightPct: 7.1,
      valueAbs: 16080,
      sector: 'Technology',
      dailyChangePct: 1.4,
      isOther: false,
    },
    {
      key: 'BRK_B',
      ticker: 'BRK.B',
      name: 'Berkshire Hathaway',
      weightPct: 6.8,
      valueAbs: 15400,
      sector: 'Financials',
      dailyChangePct: 0.3,
      isOther: false,
    },
    {
      key: 'JNJ',
      ticker: 'JNJ',
      name: 'Johnson & Johnson',
      weightPct: 5.2,
      valueAbs: 11780,
      sector: 'Healthcare',
      dailyChangePct: -0.4,
      isOther: false,
    },
    {
      key: 'XOM',
      ticker: 'XOM',
      name: 'ExxonMobil',
      weightPct: 4.6,
      valueAbs: 10410,
      sector: 'Energy',
      dailyChangePct: 3.2,
      isOther: false,
    },
    {
      key: 'OTHER',
      ticker: 'OTHER',
      name: 'Other (12 positions)',
      weightPct: 40.9,
      valueAbs: 92580,
      isOther: true,
      itemCount: 12,
    },
  ],
};

// Waterfall fixture — conservation holds: 220000 + 10000 - 2000 + 4200 + 8420
// + 1850 + 240 - 90 + 270 = 242890 (NOT 246890 as in the published spec
// example which is off by $4,000 per finance audit W-1). We use the
// arithmetic-correct form so the envelope-level Δ2 refinement passes.
export const WATERFALL_FIXTURE: WaterfallPayload = {
  kind: 'waterfall',
  meta: {
    title: 'Where your value came from',
    subtitle: 'YTD · 2026-01-01 to 2026-04-26',
    source: 'IBKR cash flows + holdings · FX via FRED',
    alt: 'YTD cash-flow waterfall',
  },
  startValue: 220000,
  endValue: 242890,
  steps: [
    { key: 'start', label: 'Start value', componentType: 'start', deltaAbs: 220000 },
    { key: 'deposits', label: 'Deposits', componentType: 'deposits', deltaAbs: 10000 },
    { key: 'withdrawals', label: 'Withdrawals', componentType: 'withdrawals', deltaAbs: -2000 },
    { key: 'realized', label: 'Realized gains', componentType: 'realized_gains', deltaAbs: 4200 },
    {
      key: 'unrealized',
      label: 'Unrealized gains',
      componentType: 'unrealized_gains',
      deltaAbs: 8420,
    },
    { key: 'dividends', label: 'Dividends', componentType: 'dividends_received', deltaAbs: 1850 },
    { key: 'interest', label: 'Interest', componentType: 'interest', deltaAbs: 240 },
    { key: 'fees', label: 'Fees', componentType: 'fees', deltaAbs: -90 },
    { key: 'fx', label: 'FX', componentType: 'fx_effects', deltaAbs: 270 },
    { key: 'end', label: 'End value', componentType: 'end', deltaAbs: 242890 },
  ],
  periodStart: '2026-01-01',
  periodEnd: '2026-04-26',
  currency: 'USD',
};

export const CANDLESTICK_FIXTURE: CandlestickChartPayload = {
  kind: 'candlestick',
  meta: {
    title: 'AAPL · last 14 sessions',
    alt: 'Apple stock candlestick',
  },
  xAxis: { format: 'date-day' },
  yAxis: { format: 'currency-compact', currency: 'USD' },
  symbol: 'AAPL',
  data: Array.from({ length: 14 }, (_, i) => {
    const open = 180 + Math.sin(i / 2) * 4 + i * 0.3;
    const close = open + Math.cos(i) * 2;
    const high = Math.max(open, close) + Math.abs(Math.sin(i)) * 1.5 + 0.5;
    const low = Math.min(open, close) - Math.abs(Math.cos(i)) * 1.5 - 0.5;
    const day = new Date(2026, 3, 13 + i);
    return {
      x: day.toISOString().slice(0, 10),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
    };
  }),
};
