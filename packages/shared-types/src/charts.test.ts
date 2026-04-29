/**
 * Chart payload schema tests — Zod parse / refusal contract.
 *
 * Test groups (per kickoff §6 Phase 4):
 * 1. Positive parses — every CHARTS_SPEC §5.3 example payload + canonical
 *    fixtures for the kinds without published examples.
 * 2. Risk Flag 1 — forbidden Line/Candlestick overlays.
 * 3. Risk Flag 2 — Bar/StackedBar zero-only reference + targetWeight rejection.
 * 4. Risk Flag 3 — Calendar V2 event-type rejection.
 * 5. Δ1 — sum-to-total mixin (Donut + Treemap + StackedBar per-row).
 * 6. Δ2 — waterfall conservation invariant (block-merge severity).
 * 7. Δ3 — MVP union exclusion of Scatter.
 * 8. T-8 — Treemap dailyChangeBasis discriminator.
 *
 * Cross-field invariants (Δ1 / Δ2) are wired through `ChartEnvelope.safeParse`
 * (the envelope-level `superRefine`), so payload-only fixtures wrap into a
 * minimal envelope helper.
 */

import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import {
  BarChartPayload,
  CalendarPayload,
  CandlestickChartPayload,
  ChartEnvelope,
  ChartPayload,
  FORBIDDEN_OVERLAY_TYPES,
  LineChartPayload,
  ScatterChartPayload,
  StackedBarChartPayload,
  TreemapPayload,
  WATERFALL_CONSERVATION_VIOLATION,
} from './charts.js';

const ENVELOPE_ID = 'f3a8c1de-1234-4abc-8def-0123456789ab';
const CREATED_AT = '2026-04-27T10:14:22Z';

function envelope<P>(payload: P): unknown {
  return { id: ENVELOPE_ID, payload, createdAt: CREATED_AT };
}

/* ─── canonical fixtures from CHARTS_SPEC §5.3 ────────────────────── */

const linePayload = {
  kind: 'line' as const,
  meta: {
    title: 'Portfolio value',
    subtitle: 'Last 30 days · all brokers',
    source: 'IBKR + Binance · synced 2026-04-26',
  },
  xAxis: { format: 'date-day' as const, label: 'Date' },
  yAxis: { format: 'currency-compact' as const, currency: 'USD', label: 'Value' },
  series: [{ key: 'y', label: 'Total' }],
  data: [
    { x: '2026-03-28', y: 220180 },
    { x: '2026-03-29', y: 221450 },
  ],
  interpolation: 'monotone' as const,
};

const donutPayload = {
  kind: 'donut' as const,
  meta: {
    title: 'Allocation by sector',
    subtitle: '5 sectors · $226,390 total',
    reportedTotal: 226390,
    reportedTotalCurrency: 'USD',
    toleranceMode: 'relative' as const,
    toleranceValue: 0.005,
  },
  format: 'currency-compact' as const,
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

const sparklinePayload = {
  kind: 'sparkline' as const,
  meta: { title: 'Portfolio · 7d' },
  format: 'currency-compact' as const,
  currency: 'USD',
  data: [
    { x: '2026-04-20', y: 218500 },
    { x: '2026-04-21', y: 220100 },
    { x: '2026-04-26', y: 226390 },
  ],
  trend: 'up' as const,
  filled: false,
};

const calendarPayload = {
  kind: 'calendar' as const,
  meta: {
    title: 'Dividend calendar — April 2026',
    subtitle: '3 received · 2 scheduled · all brokers',
    source: 'IBKR + Lynx · synced 2026-04-26',
  },
  view: 'month' as const,
  periodStart: '2026-04-01',
  periodEnd: '2026-04-30',
  events: [
    {
      id: 'ev-001',
      eventType: 'dividend' as const,
      ticker: 'KO',
      name: 'Coca-Cola Co',
      exDate: '2026-04-08',
      payDate: '2026-04-12',
      amountPerShare: 0.485,
      shares: 100,
      expectedAmount: 48.5,
      currency: 'USD',
      status: 'received' as const,
      brokerSource: 'IBKR corporate-actions feed',
    },
    {
      id: 'ev-003',
      eventType: 'corp_action' as const,
      ticker: 'GOOGL',
      name: 'Alphabet Inc',
      effectiveDate: '2026-04-15',
      actionType: 'split' as const,
      ratio: '2:1',
      description: '2-for-1 stock split effective at market open 2026-04-15',
      status: 'announced' as const,
      brokerSource: 'Lynx corporate-actions feed',
    },
  ],
  totalReceived: 284.1,
  totalScheduled: 412,
  currency: 'USD',
};

const treemapPayload = {
  kind: 'treemap' as const,
  meta: {
    title: 'Concentration',
    subtitle: "Tile size = weight; color = today's change",
    source: 'IBKR · synced 2026-04-26 14:14 ET',
    reportedTotal: 100,
    reportedTotalCurrency: 'USD',
    toleranceMode: 'absolute' as const,
    toleranceValue: 0.5,
  },
  asOf: '2026-04-26T18:14:00Z',
  baseCurrency: 'USD',
  dailyChangeBasis: 'base' as const,
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

/**
 * Canonical waterfall — corrected from the spec example which is off by
 * $4,000 (finance audit W-1; PD owns the spec repair). Here `realized:
 * 8200` makes the conservation hold exactly. start=220000 + 10000 - 2000 +
 * 8200 + 8420 + 1850 + 240 - 90 + 270 = 246890 = end.
 */
const waterfallPayload = {
  kind: 'waterfall' as const,
  meta: {
    title: 'Where your value came from',
    subtitle: 'YTD · 2026-01-01 to 2026-04-26',
    source: 'IBKR cash flows + holdings · FX via FRED',
  },
  startValue: 220000,
  endValue: 246890,
  steps: [
    { key: 'start', label: 'Start value', componentType: 'start' as const, deltaAbs: 220000 },
    { key: 'deposits', label: 'Deposits', componentType: 'deposits' as const, deltaAbs: 10000 },
    {
      key: 'withdrawals',
      label: 'Withdrawals',
      componentType: 'withdrawals' as const,
      deltaAbs: -2000,
    },
    {
      key: 'realized',
      label: 'Realized gains',
      componentType: 'realized_gains' as const,
      deltaAbs: 8200,
    },
    {
      key: 'unrealized',
      label: 'Unrealized gains',
      componentType: 'unrealized_gains' as const,
      deltaAbs: 8420,
    },
    {
      key: 'dividends',
      label: 'Dividends',
      componentType: 'dividends_received' as const,
      deltaAbs: 1850,
    },
    { key: 'interest', label: 'Interest', componentType: 'interest' as const, deltaAbs: 240 },
    { key: 'fees', label: 'Fees', componentType: 'fees' as const, deltaAbs: -90 },
    { key: 'fx', label: 'FX', componentType: 'fx_effects' as const, deltaAbs: 270 },
    { key: 'end', label: 'End value', componentType: 'end' as const, deltaAbs: 246890 },
  ],
  periodStart: '2026-01-01',
  periodEnd: '2026-04-26',
  currency: 'USD',
};

/* ─── canonical fixtures for kinds without published §5.3 examples ──── */

const areaPayload = {
  kind: 'area' as const,
  meta: { title: 'Broker contribution over time' },
  xAxis: { format: 'date-month' as const, label: 'Month' },
  yAxis: { format: 'currency-compact' as const, currency: 'USD' },
  series: [
    { key: 'ibkr', label: 'IBKR' },
    { key: 'binance', label: 'Binance' },
  ],
  data: [
    { x: '2026-01', ibkr: 80000, binance: 22000 },
    { x: '2026-02', ibkr: 85000, binance: 24000 },
  ],
  stacked: true,
  interpolation: 'linear' as const,
};

const barPayload = {
  kind: 'bar' as const,
  meta: { title: 'Allocation drift' },
  xAxis: { format: 'category' as const },
  yAxis: { format: 'percent-delta' as const },
  data: [
    { x: 'Tech', y: 6.3 },
    { x: 'Financials', y: -2.1 },
    { x: 'Energy', y: 1.8 },
  ],
  orientation: 'vertical' as const,
  colorBySign: true,
  diverging: true,
  referenceLine: { axis: 'zero' as const, label: 'No drift' },
};

const stackedBarPayload = {
  kind: 'stacked-bar' as const,
  meta: { title: 'Broker asset-class composition' },
  xAxis: { format: 'category' as const },
  yAxis: { format: 'currency-compact' as const, currency: 'USD' },
  series: [
    { key: 'equity', label: 'Equity' },
    { key: 'cash', label: 'Cash' },
  ],
  data: [
    { x: 'IBKR', equity: 80000, cash: 5000 },
    { x: 'Binance', equity: 22000, cash: 2000 },
  ],
};

const candlestickPayload = {
  kind: 'candlestick' as const,
  meta: { title: 'NVDA — last 5 days' },
  xAxis: { format: 'date-day' as const },
  yAxis: { format: 'currency' as const, currency: 'USD' },
  symbol: 'NVDA',
  data: [
    { x: '2026-04-22', open: 480, high: 492, low: 478, close: 488 },
    { x: '2026-04-23', open: 488, high: 495, low: 483, close: 491 },
  ],
};

const scatterPayload = {
  kind: 'scatter' as const,
  meta: { title: 'Risk vs Return (V2)' },
  xAxis: { format: 'percent' as const, label: '90-day rolling volatility' },
  yAxis: { format: 'percent' as const, label: 'YTD return' },
  groups: [
    {
      key: 'positions',
      label: 'Holdings',
      points: [
        { x: 0.18, y: 0.12 },
        { x: 0.22, y: -0.04 },
      ],
    },
  ],
};

/* ─── 1. positive parses ──────────────────────────────────────────── */

describe('positive parses (CHARTS_SPEC §5.3 examples)', () => {
  it.each([
    ['line', linePayload],
    ['area', areaPayload],
    ['bar', barPayload],
    ['stacked-bar', stackedBarPayload],
    ['donut', donutPayload],
    ['sparkline', sparklinePayload],
    ['candlestick', candlestickPayload],
    ['calendar', calendarPayload],
    ['treemap', treemapPayload],
    ['waterfall', waterfallPayload],
  ])('%s envelope parses successfully', (_kind, payload) => {
    const result = ChartEnvelope.safeParse(envelope(payload));
    if (!result.success) {
      // Surface error detail when test fails.
      throw new Error(JSON.stringify(result.error.issues, null, 2));
    }
    expect(result.success).toBe(true);
  });
});

/* ─── 2. Risk Flag 1 — forbidden line overlays ─────────────────────── */

describe('Risk Flag 1 — forbidden Line overlays', () => {
  const explicit = [
    'moving_average',
    'support_line',
    'resistance_line',
    'trend_line',
    'rsi',
    'macd',
  ] as const;

  it.each(explicit)('rejects overlay type "%s"', (forbiddenType) => {
    const payload = {
      ...linePayload,
      overlay: [{ type: forbiddenType, date: '2026-03-28', side: 'buy', qty: 1, price: 100 }],
    };
    const result = ChartEnvelope.safeParse(envelope(payload));
    expect(result.success).toBe(false);
  });

  // Three random samples from FORBIDDEN_OVERLAY_TYPES (deterministic indices).
  const sampleIndices = [0, 8, 16];
  it.each(sampleIndices.map((i) => [FORBIDDEN_OVERLAY_TYPES[i] as string]))(
    'rejects sampled forbidden type "%s"',
    (forbiddenType) => {
      const payload = {
        ...linePayload,
        overlay: [{ type: forbiddenType, date: '2026-03-28', side: 'buy', qty: 1, price: 100 }],
      };
      const result = ChartEnvelope.safeParse(envelope(payload));
      expect(result.success).toBe(false);
    },
  );

  it('accepts the only permitted overlay type "trade_marker"', () => {
    const payload = {
      ...linePayload,
      overlay: [
        {
          type: 'trade_marker' as const,
          date: '2026-03-28',
          side: 'buy' as const,
          qty: 10,
          price: 480,
        },
      ],
    };
    const result = ChartEnvelope.safeParse(envelope(payload));
    expect(result.success).toBe(true);
  });
});

/* ─── 3. Risk Flag 1 — Candlestick strict-mode rejections ─────────── */

describe('Risk Flag 1 — Candlestick rejects unknown indicator/signal fields', () => {
  const intrusions = [
    { movingAverage: [{ window: 50, values: [] }] },
    { rsi: [{ x: '2026-04-22', value: 65 }] },
    { macd: { signal: [], histogram: [] } },
    { bollinger: { upper: [], lower: [] } },
    { signalAnnotation: [{ x: '2026-04-22', label: 'BUY' }] },
    { trendLine: [{ from: '2026-01-01', to: '2026-04-22' }] },
  ];
  it.each(intrusions.map((extra, i) => [i, Object.keys(extra)[0], extra]))(
    'rejects extra key %s ("%s")',
    (_i, _name, extra) => {
      const payload = { ...candlestickPayload, ...extra } as unknown;
      const result = CandlestickChartPayload.safeParse(payload);
      expect(result.success).toBe(false);
    },
  );
});

/* ─── 4. Risk Flag 2 — Bar / StackedBar zero-only reference ───────── */

describe('Risk Flag 2 — Bar / StackedBar reject targetWeight + non-zero references', () => {
  it('rejects BarChartPayload with extra targetWeight field', () => {
    const payload = { ...barPayload, targetWeight: 0.25 } as unknown;
    const result = BarChartPayload.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('rejects BarReferenceLine with axis: "target"', () => {
    const payload = {
      ...barPayload,
      referenceLine: { axis: 'target', label: 'Goal' },
    } as unknown;
    const result = BarChartPayload.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('rejects StackedBarChartPayload with extra targetWeight field', () => {
    const payload = { ...stackedBarPayload, targetWeight: 0.4 } as unknown;
    const result = StackedBarChartPayload.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('rejects StackedBar referenceLine with axis: "benchmark"', () => {
    const payload = {
      ...stackedBarPayload,
      referenceLine: { axis: 'benchmark' },
    } as unknown;
    const result = StackedBarChartPayload.safeParse(payload);
    expect(result.success).toBe(false);
  });
});

/* ─── 5. Risk Flag 3 — Calendar V2 event types ────────────────────── */

describe('Risk Flag 3 — Calendar rejects V2 event types', () => {
  it('rejects eventType: "earnings"', () => {
    const payload = {
      ...calendarPayload,
      events: [
        {
          id: 'ev-x',
          eventType: 'earnings',
          ticker: 'NVDA',
          payDate: '2026-04-30',
          status: 'announced',
          brokerSource: 'paid feed',
        },
      ],
    } as unknown;
    const result = CalendarPayload.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('rejects eventType: "news"', () => {
    const payload = {
      ...calendarPayload,
      events: [
        {
          id: 'ev-y',
          eventType: 'news',
          ticker: 'NVDA',
          payDate: '2026-04-30',
          status: 'announced',
          brokerSource: 'paid feed',
        },
      ],
    } as unknown;
    const result = CalendarPayload.safeParse(payload);
    expect(result.success).toBe(false);
  });
});

/* ─── 6. Δ1 — sum-to-total mixin ──────────────────────────────────── */

describe('Δ1 — sum-to-total mixin', () => {
  it('Donut: valid sum within tolerance parses', () => {
    const result = ChartEnvelope.safeParse(envelope(donutPayload));
    expect(result.success).toBe(true);
  });

  it('Donut: sum off by 5% fails parse', () => {
    const broken = {
      ...donutPayload,
      meta: { ...donutPayload.meta, reportedTotal: 1000 },
      segments: [
        { key: 'a', label: 'A', value: 500 },
        { key: 'b', label: 'B', value: 450 }, // sum = 950, reportedTotal = 1000
      ],
    };
    const result = ChartEnvelope.safeParse(envelope(broken));
    expect(result.success).toBe(false);
  });

  it('Treemap: weightPct sum within absolute tolerance parses', () => {
    const result = ChartEnvelope.safeParse(envelope(treemapPayload));
    expect(result.success).toBe(true);
  });

  it('Treemap: weightPct sum off by 10 fails parse', () => {
    const broken = {
      ...treemapPayload,
      tiles: [
        { ...treemapPayload.tiles[0]!, weightPct: 50 },
        { ...treemapPayload.tiles[1]!, weightPct: 40 }, // sum = 90, reported = 100, tolerance 0.5
      ],
    };
    const result = ChartEnvelope.safeParse(envelope(broken));
    expect(result.success).toBe(false);
  });

  it('StackedBar: per-row aggregate within tolerance parses', () => {
    const payload = {
      ...stackedBarPayload,
      rowAggregates: [
        {
          rowX: 'IBKR',
          reportedTotal: 85000,
          reportedTotalCurrency: 'USD',
          toleranceMode: 'absolute' as const,
          toleranceValue: 1,
        },
      ],
    };
    const result = ChartEnvelope.safeParse(envelope(payload));
    expect(result.success).toBe(true);
  });

  it('StackedBar: per-row aggregate off by 5000 fails parse', () => {
    const payload = {
      ...stackedBarPayload,
      rowAggregates: [
        {
          rowX: 'IBKR',
          reportedTotal: 100000, // actual sum 85000 → off by 15000
          reportedTotalCurrency: 'USD',
          toleranceMode: 'absolute' as const,
          toleranceValue: 1,
        },
      ],
    };
    const result = ChartEnvelope.safeParse(envelope(payload));
    expect(result.success).toBe(false);
  });
});

/* ─── 7. Δ2 — waterfall conservation ──────────────────────────────── */

describe('Δ2 — waterfall conservation invariant', () => {
  it('canonical payload parses', () => {
    const result = ChartEnvelope.safeParse(envelope(waterfallPayload));
    expect(result.success).toBe(true);
  });

  it('off by $5 fails with WATERFALL_CONSERVATION_VIOLATION', () => {
    const broken = {
      ...waterfallPayload,
      endValue: 246895, // off by $5
    };
    const result = ChartEnvelope.safeParse(envelope(broken));
    expect(result.success).toBe(false);
    if (result.success) return;
    const violation = result.error.issues.find(
      (issue) =>
        (issue as { params?: { code?: string } }).params?.code === WATERFALL_CONSERVATION_VIOLATION,
    );
    expect(violation).toBeDefined();
  });

  it('off by $5000 fails', () => {
    const broken = { ...waterfallPayload, endValue: 251890 };
    const result = ChartEnvelope.safeParse(envelope(broken));
    expect(result.success).toBe(false);
  });

  it('signs reversed on fees fails', () => {
    const broken = {
      ...waterfallPayload,
      steps: waterfallPayload.steps.map((s) =>
        s.componentType === 'fees' ? { ...s, deltaAbs: 90 } : s,
      ),
    };
    const result = ChartEnvelope.safeParse(envelope(broken));
    expect(result.success).toBe(false);
    if (result.success) return;
    const violation = result.error.issues.find(
      (issue) =>
        (issue as { params?: { code?: string } }).params?.code === WATERFALL_CONSERVATION_VIOLATION,
    );
    expect(violation).toBeDefined();
  });

  it('tolerance boundary: $1.00 off passes', () => {
    const onEdge = {
      ...waterfallPayload,
      endValue: 246891, // off by exactly $1
    };
    const result = ChartEnvelope.safeParse(envelope(onEdge));
    expect(result.success).toBe(true);
  });

  it('tolerance boundary: $1.01 off fails', () => {
    const justOver = {
      ...waterfallPayload,
      endValue: 246891.01, // off by $1.01
    };
    const result = ChartEnvelope.safeParse(envelope(justOver));
    expect(result.success).toBe(false);
    if (result.success) return;
    const violation = result.error.issues.find(
      (issue) =>
        (issue as { params?: { code?: string } }).params?.code === WATERFALL_CONSERVATION_VIOLATION,
    );
    expect(violation).toBeDefined();
  });
});

/* ─── 8. Δ3 — MVP union exclusion of Scatter ──────────────────────── */

describe('Δ3 — Scatter excluded from MVP ChartPayload union', () => {
  it('ScatterChartPayload schema still parses standalone (V2 readiness)', () => {
    const result = ScatterChartPayload.safeParse(scatterPayload);
    expect(result.success).toBe(true);
  });

  it('ChartPayload discriminator does NOT match kind: "scatter"', () => {
    const result = ChartPayload.safeParse(scatterPayload);
    expect(result.success).toBe(false);
  });

  it('ChartEnvelope rejects kind: "scatter" at parse time', () => {
    const result = ChartEnvelope.safeParse(envelope(scatterPayload));
    expect(result.success).toBe(false);
  });
});

/* ─── 9. T-8 — Treemap dailyChangeBasis discriminator ─────────────── */

describe('T-8 — Treemap dailyChangeBasis discriminator', () => {
  it('parses with dailyChangeBasis: "local"', () => {
    const payload = { ...treemapPayload, dailyChangeBasis: 'local' as const };
    const result = ChartEnvelope.safeParse(envelope(payload));
    expect(result.success).toBe(true);
  });

  it('parses with dailyChangeBasis: "base"', () => {
    const payload = { ...treemapPayload, dailyChangeBasis: 'base' as const };
    const result = ChartEnvelope.safeParse(envelope(payload));
    expect(result.success).toBe(true);
  });

  it('rejects payload omitting dailyChangeBasis', () => {
    const { dailyChangeBasis: _omit, ...withoutBasis } = treemapPayload;
    const result = TreemapPayload.safeParse(withoutBasis);
    expect(result.success).toBe(false);
    if (result.success) return;
    const issue = result.error.issues.find((i) => i.path.includes('dailyChangeBasis'));
    expect(issue).toBeDefined();
  });

  it('rejects invalid dailyChangeBasis value "mixed"', () => {
    const payload = { ...treemapPayload, dailyChangeBasis: 'mixed' };
    const result = TreemapPayload.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('rejects invalid dailyChangeBasis value "usd"', () => {
    const payload = { ...treemapPayload, dailyChangeBasis: 'usd' };
    const result = TreemapPayload.safeParse(payload);
    expect(result.success).toBe(false);
  });
});

/* ─── 10. envelope-level edge cases ───────────────────────────────── */

describe('ChartEnvelope edge cases', () => {
  it('applies schemaVersion default "1.0" when omitted', () => {
    const result = ChartEnvelope.safeParse(envelope(linePayload));
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.schemaVersion).toBe('1.0');
  });

  it('rejects non-uuid id', () => {
    const result = ChartEnvelope.safeParse({
      id: 'not-a-uuid',
      payload: linePayload,
      createdAt: CREATED_AT,
    });
    expect(result.success).toBe(false);
  });

  it('rejects unknown discriminator kind', () => {
    const result = ChartEnvelope.safeParse(
      envelope({ ...linePayload, kind: 'definitely-not-a-chart' } as unknown),
    );
    expect(result.success).toBe(false);
  });

  it('LineChartPayload alone parses without envelope wrapper', () => {
    const result = LineChartPayload.safeParse(linePayload);
    expect(result.success).toBe(true);
  });

  it('Zod errors are instances of ZodError', () => {
    const result = ChartEnvelope.safeParse({});
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toBeInstanceOf(ZodError);
  });
});
