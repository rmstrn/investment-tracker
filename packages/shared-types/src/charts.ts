/**
 * Chart payload schemas — Zod source-of-truth for the AI-emitted chart contract.
 *
 * Authoritative references (read these first if changing this file):
 * - `docs/design/CHARTS_SPEC.md` v1.1 §5.2 — canonical schema prose, §5.3 examples.
 * - `docs/reviews/2026-04-29-architect-chart-data-shape-adr.md` — data-shape ADR
 *   incl. post-verification deltas Δ1 (sum-to-total mixin), Δ2 (waterfall
 *   conservation block-merge severity), Δ3 (Scatter excluded from MVP union),
 *   Δ4 (dual-side validation: Zod canonical, Pydantic generated).
 * - `docs/reviews/2026-04-29-finance-charts-lane-a-audit.md` — per-chart Lane-A
 *   guardrails (3 Risk Flags + finding T-8 cross-currency basis).
 * - `docs/engineering/kickoffs/2026-04-29-charts-backend.md` — slice scope.
 *
 * This file is the CANONICAL definition. Pydantic models in `apps/ai/` are
 * GENERATED from the OpenAPI schema (which is itself generated from these
 * Zod schemas via `zod-to-openapi`). Cross-field invariants (waterfall
 * conservation Δ2, sum-to-total Δ1) live ONLY here; Pydantic guards shape,
 * Zod guards shape + math (architect Δ4 dual-side validation).
 *
 * Lane-A structural guardrails baked into these schemas (CHARTS_SPEC §5.2):
 * - Risk Flag 1 — forbidden Line/Candlestick overlays (TA indicators / signals
 *   / target prices). LineOverlay union has only `trade_marker`; Candlestick
 *   `.strict()` rejects every indicator/MA/RSI/Bollinger field by absence.
 * - Risk Flag 2 — Bar/StackedBar zero-only reference line. NO `targetWeight`
 *   field anywhere; `BarReferenceLine.axis` is `z.literal('zero')`.
 * - Risk Flag 3 — Calendar V2 event-type gate. `CalendarEventType` is
 *   `z.enum(['dividend', 'corp_action'])`; `'earnings'` / `'news'` rejected
 *   pending V2 paid-data PO greenlight (R1 — no spend without PO approval).
 *
 * Future contributors: do NOT add `targetWeight`, TA-indicator overlays, or
 * V2 event types as «improvements». They are absent BY DESIGN and the parser
 * will reject them at the api-client trust boundary.
 */

import { z } from 'zod';

/* ─── primitives ─────────────────────────────────────────────────── */

export const ValueFormat = z.enum([
  'currency',
  'currency-compact',
  'percent',
  'percent-delta',
  'count',
  'ratio',
  'date',
]);
export type ValueFormat = z.infer<typeof ValueFormat>;

export const XAxisFormat = z.enum(['date-day', 'date-month', 'date-year', 'category', 'numeric']);
export type XAxisFormat = z.infer<typeof XAxisFormat>;

/** ISO 4217 three-letter currency code (uppercase). Defaults to USD where used. */
export const Currency = z.string().regex(/^[A-Z]{3}$/);

export const ChartMeta = z
  .object({
    title: z.string(),
    subtitle: z.string().optional(),
    alt: z.string().optional(),
    source: z.string().optional(),
    emptyHint: z.string().optional(),
  })
  .strict();
export type ChartMeta = z.infer<typeof ChartMeta>;

/* ─── data point shapes ──────────────────────────────────────────── */

export const TimePoint = z
  .object({
    x: z.union([z.string(), z.number()]),
    y: z.number(),
  })
  .strict();
export type TimePoint = z.infer<typeof TimePoint>;

export const CategoryPoint = z
  .object({
    x: z.string(),
    y: z.number(),
  })
  .strict();
export type CategoryPoint = z.infer<typeof CategoryPoint>;

/**
 * Multi-series point uses `.catchall(z.number())` to permit dynamic series
 * keys (e.g. `{ x: 'Apr', ibkr: 1200, binance: 800 }`). Cannot use `.strict()`
 * here because the keys are agent-defined per payload.
 */
export const MultiSeriesPoint = z
  .object({
    x: z.union([z.string(), z.number()]),
  })
  .catchall(z.number());
export type MultiSeriesPoint = z.infer<typeof MultiSeriesPoint>;

export const ScatterPoint = z
  .object({
    x: z.number(),
    y: z.number(),
    z: z.number().optional(),
    label: z.string().optional(),
  })
  .strict();
export type ScatterPoint = z.infer<typeof ScatterPoint>;

export const CandlePoint = z
  .object({
    x: z.union([z.string(), z.number()]),
    open: z.number(),
    high: z.number(),
    low: z.number(),
    close: z.number(),
  })
  .strict();
export type CandlePoint = z.infer<typeof CandlePoint>;

/* ─── series ──────────────────────────────────────────────────────── */

export const Series = z
  .object({
    key: z.string(),
    label: z.string(),
    color: z.string().optional(),
  })
  .strict();
export type Series = z.infer<typeof Series>;

/* ─── shared mixin (architect Δ1) ─────────────────────────────────── */

/**
 * Sum-to-total invariant fragment. Reused on Donut / Treemap / StackedBar
 * `.meta` extensions. One mixin → three identical refinement helpers.
 *
 * `reportedTotal` is the declared aggregate (e.g. portfolio value, 100 for
 * percentage breakdowns). `toleranceMode` chooses absolute vs relative
 * tolerance window; `toleranceValue` is the half-width.
 *
 * See architect ADR §«Δ1 — BLESS shared sum-to-total invariant».
 */
export const MetaFinancialAggregate = z
  .object({
    reportedTotal: z.number().positive(),
    reportedTotalCurrency: z.string().length(3).optional(),
    toleranceMode: z.enum(['absolute', 'relative']).default('relative'),
    toleranceValue: z.number().nonnegative().default(0.005),
  })
  .strict();
export type MetaFinancialAggregate = z.infer<typeof MetaFinancialAggregate>;

/**
 * Tests whether `sum` falls within the tolerance window of the declared
 * aggregate. Returns `true` if within tolerance.
 */
function isWithinTolerance(sum: number, aggregate: MetaFinancialAggregate): boolean {
  const { reportedTotal, toleranceMode, toleranceValue } = aggregate;
  const halfWidth = toleranceMode === 'absolute' ? toleranceValue : reportedTotal * toleranceValue;
  return Math.abs(sum - reportedTotal) <= halfWidth;
}

/* ─── Lane-A constraint constants (Risk Flag 1) ───────────────────── */

/**
 * Forbidden Line/Candlestick overlay types. These tokens are NOT permitted
 * as `LineOverlay.type` discriminator literals — the discriminated union
 * has no branch for them, AND a secondary `.refine()` guards against
 * future contributors adding a branch by mistake.
 *
 * Lane-A rationale: technical-analysis indicators (MAs, RSI, MACD, etc.)
 * and signal annotations imply prescriptive trading advice. Provedo charts
 * are descriptive only. See CHARTS_SPEC.md §4.1.1 + §4.8 + finance audit §2.1.
 */
export const FORBIDDEN_OVERLAY_TYPES = [
  'support_line',
  'resistance_line',
  'trend_line',
  'channel_band',
  'moving_average',
  'ema',
  'sma',
  'bollinger',
  'rsi',
  'macd',
  'atr',
  'stochastic',
  'adx',
  'ichimoku',
  'fibonacci',
  'pivot_point',
  'buy_marker',
  'sell_marker',
  'signal_annotation',
  'recommendation_annotation',
  'target_price',
  'price_target',
  'projected_price',
] as const;
export type ForbiddenOverlayType = (typeof FORBIDDEN_OVERLAY_TYPES)[number];

/* ─── line overlays (Lane-A Risk Flag 1) ──────────────────────────── */

/**
 * Trade marker — the user's own historical trade. Lane-A factual: «you
 * bought 10 NVDA at $480 on 2026-03-15». Distinct from a prescriptive
 * `buy_marker` recommending future action. Only this branch exists.
 */
export const TradeMarker = z
  .object({
    type: z.literal('trade_marker'),
    date: z.union([z.string(), z.number()]),
    side: z.enum(['buy', 'sell']),
    qty: z.number().positive(),
    price: z.number().positive(),
  })
  .strict();
export type TradeMarker = z.infer<typeof TradeMarker>;

/**
 * Discriminated union with only the `trade_marker` branch. The `.refine()`
 * is belt-and-suspenders: even if a future contributor adds a branch with
 * a forbidden discriminant literal, the refinement will reject it.
 */
export const LineOverlay = z
  .discriminatedUnion('type', [TradeMarker])
  .refine((v) => !(FORBIDDEN_OVERLAY_TYPES as readonly string[]).includes(v.type), {
    message: 'Forbidden overlay type — Lane A structural exclusion (CHARTS_SPEC §4.1.1 / §4.8)',
  });
export type LineOverlay = z.infer<typeof LineOverlay>;

/* ─── bar reference line (Lane-A Risk Flag 2) ─────────────────────── */

/**
 * Bar/StackedBar reference line restricted to zero-axis only.
 *
 * Lane-A rationale: a `target` or `benchmark-target` reference line on a
 * drift bar implies «you should rebalance to this allocation». The only
 * permitted reference geometry is the zero axis (for diverging bars and
 * P&L sign separators). See CHARTS_SPEC §4.3 + finance audit §2.3.
 */
export const BarReferenceLine = z
  .object({
    axis: z.literal('zero'),
    label: z.string().optional(),
  })
  .strict();
export type BarReferenceLine = z.infer<typeof BarReferenceLine>;

/* ─── chart kinds ─────────────────────────────────────────────────── */

export const LineChartPayload = z
  .object({
    kind: z.literal('line'),
    meta: ChartMeta,
    xAxis: z.object({ format: XAxisFormat, label: z.string().optional() }).strict(),
    yAxis: z
      .object({
        format: ValueFormat,
        currency: Currency.optional(),
        label: z.string().optional(),
        domain: z
          .tuple([
            z.union([z.number(), z.literal('auto')]),
            z.union([z.number(), z.literal('auto')]),
          ])
          .optional(),
      })
      .strict(),
    series: z.array(Series).min(1).max(3),
    data: z.array(MultiSeriesPoint).min(0).max(500),
    interpolation: z.enum(['monotone', 'linear', 'step']).default('monotone'),
    benchmark: z.object({ y: z.number(), label: z.string() }).strict().optional(),
    overlay: z.array(LineOverlay).optional(),
  })
  .strict();
export type LineChartPayload = z.infer<typeof LineChartPayload>;

export const AreaChartPayload = z
  .object({
    kind: z.literal('area'),
    meta: ChartMeta,
    xAxis: z.object({ format: XAxisFormat, label: z.string().optional() }).strict(),
    yAxis: z
      .object({
        format: ValueFormat,
        currency: Currency.optional(),
        label: z.string().optional(),
      })
      .strict(),
    series: z.array(Series).min(1).max(5),
    data: z.array(MultiSeriesPoint).min(0).max(500),
    stacked: z.boolean().default(false),
    interpolation: z.enum(['monotone', 'linear', 'step']).default('monotone'),
  })
  .strict();
export type AreaChartPayload = z.infer<typeof AreaChartPayload>;

/**
 * Bar chart payload. Risk Flag 2: NO `targetWeight` field. NO `target` /
 * `benchmark-target` axis on `referenceLine`. `.strict()` rejects unknown
 * keys, so `{ ...valid, targetWeight: 0.25 }` fails parse.
 */
export const BarChartPayload = z
  .object({
    kind: z.literal('bar'),
    meta: ChartMeta,
    xAxis: z.object({ format: XAxisFormat, label: z.string().optional() }).strict(),
    yAxis: z
      .object({
        format: ValueFormat,
        currency: Currency.optional(),
        label: z.string().optional(),
      })
      .strict(),
    data: z.array(CategoryPoint).min(0).max(50),
    orientation: z.enum(['vertical', 'horizontal']).default('vertical'),
    colorBySign: z.boolean().default(false),
    diverging: z.boolean().default(false),
    referenceLine: BarReferenceLine.optional(),
  })
  .strict();
export type BarChartPayload = z.infer<typeof BarChartPayload>;

/**
 * Stacked bar payload. Risk Flag 2: same constraints as Bar (no
 * `targetWeight`; reference line zero-only).
 *
 * Δ1 (sum-to-total): individual rows MAY carry an optional
 * `MetaFinancialAggregate` per-row inside `data[i].meta`. Because
 * `MultiSeriesPoint` uses `.catchall(z.number())`, per-row `meta` is not
 * structurally available without a schema change; we accept the row-level
 * aggregate at the payload level via an optional `rowAggregate` array
 * keyed by row `x`. Refinement enforces sum-tolerance when present.
 */
export const StackedBarChartPayload = z
  .object({
    kind: z.literal('stacked-bar'),
    meta: ChartMeta,
    xAxis: z.object({ format: XAxisFormat, label: z.string().optional() }).strict(),
    yAxis: z
      .object({
        format: ValueFormat,
        currency: Currency.optional(),
        label: z.string().optional(),
      })
      .strict(),
    series: z.array(Series).min(2).max(5),
    data: z.array(MultiSeriesPoint).min(0).max(50),
    referenceLine: BarReferenceLine.optional(),
    /**
     * Optional per-row sum-to-total aggregates (architect Δ1). Keyed by
     * the `x` value of the corresponding row in `data`. When present,
     * the sum of that row's series-keyed numeric values must fall within
     * the row's tolerance window of its `reportedTotal`.
     *
     * Cross-field refinement runs at the `ChartEnvelope` level (see
     * `validateCrossFieldInvariants` below) so this object stays a plain
     * `ZodObject` and remains a valid `discriminatedUnion` member.
     */
    rowAggregates: z
      .array(
        z
          .object({ rowX: z.union([z.string(), z.number()]) })
          .strict()
          .extend(MetaFinancialAggregate.shape),
      )
      .optional(),
  })
  .strict();
export type StackedBarChartPayload = z.infer<typeof StackedBarChartPayload>;

/**
 * Donut chart payload. Δ1 (sum-to-total): `meta` carries
 * `MetaFinancialAggregate`; refinement enforces Σ segments.value within
 * tolerance of `reportedTotal`.
 */
export const DonutChartPayload = z
  .object({
    kind: z.literal('donut'),
    /**
     * Δ1 (sum-to-total): `meta` carries `MetaFinancialAggregate`. Σ
     * `segments.value` must fall within tolerance of `meta.reportedTotal`.
     * Refinement runs at the `ChartEnvelope` level (see
     * `validateCrossFieldInvariants`) so this stays a plain `ZodObject`
     * and remains a valid `discriminatedUnion` member.
     *
     * `.strict()` re-asserts unknown-key rejection: Zod's `.merge()`
     * resets the resulting object to `strip` mode regardless of the
     * source schemas' settings (TS H-1).
     */
    meta: ChartMeta.merge(MetaFinancialAggregate).strict(),
    format: ValueFormat,
    currency: Currency.optional(),
    segments: z
      .array(
        z
          .object({
            key: z.string(),
            label: z.string(),
            value: z.number().nonnegative(),
            color: z.string().optional(),
          })
          .strict(),
      )
      .min(1)
      .max(7),
    centerLabel: z.string().optional(),
  })
  .strict();
export type DonutChartPayload = z.infer<typeof DonutChartPayload>;

export const SparklinePayload = z
  .object({
    kind: z.literal('sparkline'),
    meta: ChartMeta,
    format: ValueFormat,
    currency: Currency.optional(),
    data: z.array(TimePoint).min(2).max(120),
    trend: z.enum(['up', 'down', 'flat']).optional(),
    filled: z.boolean().default(false),
  })
  .strict();
export type SparklinePayload = z.infer<typeof SparklinePayload>;

/**
 * Scatter chart payload. **NOT included in MVP `ChartPayload` discriminated
 * union** (architect Δ3). Defined here for V2 import-readiness; bumping
 * schema version to ≥1.1 with V2 PO greenlight + legal-advisor sign-off
 * re-adds it to the union. See finance audit §2.9 S-1.
 */
export const ScatterChartPayload = z
  .object({
    kind: z.literal('scatter'),
    meta: ChartMeta,
    xAxis: z.object({ format: ValueFormat, label: z.string() }).strict(),
    yAxis: z.object({ format: ValueFormat, label: z.string() }).strict(),
    groups: z
      .array(
        z
          .object({
            key: z.string(),
            label: z.string(),
            color: z.string().optional(),
            points: z.array(ScatterPoint).min(1),
          })
          .strict(),
      )
      .min(1)
      .max(3),
    referenceLines: z
      .array(
        z
          .object({
            axis: z.enum(['x', 'y']),
            value: z.number(),
            label: z.string().optional(),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();
export type ScatterChartPayload = z.infer<typeof ScatterChartPayload>;

/**
 * Candlestick chart payload (T3). Risk Flag 1: structurally excludes every
 * indicator / MA / RSI / MACD / Bollinger / signal / target field via
 * `.strict()` mode — extra keys cause `ZodError`. The schema is
 * intentionally minimal; future V2 trade-marker support requires
 * legal-advisor sign-off and a schema bump.
 */
export const CandlestickChartPayload = z
  .object({
    kind: z.literal('candlestick'),
    meta: ChartMeta,
    xAxis: z.object({ format: XAxisFormat }).strict(),
    yAxis: z.object({ format: ValueFormat, currency: Currency.optional() }).strict(),
    symbol: z.string(),
    data: z.array(CandlePoint).min(1).max(365),
  })
  .strict();
export type CandlestickChartPayload = z.infer<typeof CandlestickChartPayload>;

/* ─── calendar (Risk Flag 3) ──────────────────────────────────────── */

/**
 * MVP eventType is restricted to `dividend` + `corp_action`. `'earnings'`
 * and `'news'` are RESERVED and rejected at parse time via
 * discriminator-mismatch. They will be added in v1.2 only after PO
 * greenlights the corresponding paid-data integration (R1 — no spend
 * without PO approval). See CHARTS_SPEC §4.9 + finance audit §2.6.
 */
export const CalendarEventType = z.enum(['dividend', 'corp_action']);
export type CalendarEventType = z.infer<typeof CalendarEventType>;

export const DividendEvent = z
  .object({
    id: z.string(),
    eventType: z.literal('dividend'),
    ticker: z.string(),
    name: z.string().optional(),
    exDate: z.string().optional(),
    payDate: z.string(),
    amountPerShare: z.number().nonnegative().optional(),
    shares: z.number().nonnegative().optional(),
    expectedAmount: z.number(),
    currency: Currency.default('USD'),
    status: z.enum(['received', 'scheduled', 'announced']),
    brokerSource: z.string(),
  })
  .strict();
export type DividendEvent = z.infer<typeof DividendEvent>;

export const CorpActionEvent = z
  .object({
    id: z.string(),
    eventType: z.literal('corp_action'),
    ticker: z.string(),
    name: z.string().optional(),
    effectiveDate: z.string(),
    actionType: z.enum([
      'split',
      'reverse_split',
      'spinoff',
      'merger',
      'ticker_change',
      'name_change',
    ]),
    ratio: z.string().optional(),
    description: z.string(),
    status: z.enum(['announced', 'effective']),
    brokerSource: z.string(),
  })
  .strict();
export type CorpActionEvent = z.infer<typeof CorpActionEvent>;

export const CalendarEvent = z.discriminatedUnion('eventType', [DividendEvent, CorpActionEvent]);
export type CalendarEvent = z.infer<typeof CalendarEvent>;

export const CalendarPayload = z
  .object({
    kind: z.literal('calendar'),
    meta: ChartMeta,
    view: z.enum(['month', 'week', 'list']).default('month'),
    periodStart: z.string(),
    periodEnd: z.string(),
    events: z.array(CalendarEvent).max(500),
    totalReceived: z.number().nonnegative().optional(),
    totalScheduled: z.number().nonnegative().optional(),
    currency: Currency.default('USD'),
  })
  .strict();
export type CalendarPayload = z.infer<typeof CalendarPayload>;

/* ─── treemap (Δ1 sum-to-total + T-8 cross-currency basis) ────────── */

export const TreemapTile = z
  .object({
    key: z.string(),
    ticker: z.string(),
    name: z.string().optional(),
    weightPct: z.number().min(0).max(100),
    valueAbs: z.number().nonnegative(),
    sector: z.string().optional(),
    dailyChangePct: z.number().optional(),
    isOther: z.boolean().default(false),
    itemCount: z.number().int().positive().optional(),
  })
  .strict();
export type TreemapTile = z.infer<typeof TreemapTile>;

/**
 * Treemap payload.
 *
 * - Δ1 (sum-to-total): `meta` carries `MetaFinancialAggregate` where
 *   `reportedTotal === 100` (percentage); refinement enforces Σ
 *   `tile.weightPct` within tolerance.
 * - T-8 (cross-currency basis): `dailyChangeBasis` is a REQUIRED
 *   payload-level enum disambiguating whether `tile.dailyChangePct` is
 *   local-currency price change or base-currency total change (incl. FX).
 *   Mixing within a treemap is incoherent, hence payload-level not
 *   per-tile. See finance audit §9 Δc.
 */
export const TreemapPayload = z
  .object({
    kind: z.literal('treemap'),
    /**
     * `.strict()` re-asserts unknown-key rejection: Zod's `.merge()`
     * resets the resulting object to `strip` mode regardless of the
     * source schemas' settings (TS H-1).
     */
    meta: ChartMeta.merge(MetaFinancialAggregate).strict(),
    asOf: z.string().datetime(),
    baseCurrency: Currency.default('USD'),
    /**
     * Cross-currency disambiguator for `tile.dailyChangePct` (T-8).
     * `'local'` = price change in each tile's local currency.
     * `'base'`  = total change in user's base currency, including FX.
     */
    dailyChangeBasis: z.enum(['local', 'base']),
    tiles: z.array(TreemapTile).min(2).max(50),
  })
  .strict();
export type TreemapPayload = z.infer<typeof TreemapPayload>;

/* ─── waterfall (Δ2 conservation invariant) ───────────────────────── */

export const WaterfallStep = z
  .object({
    key: z.string(),
    label: z.string(),
    componentType: z.enum([
      'start',
      'deposits',
      'withdrawals',
      'realized_gains',
      'unrealized_gains',
      'dividends_received',
      'interest',
      'fees',
      'fx_effects',
      'end',
    ]),
    deltaAbs: z.number(),
  })
  .strict();
export type WaterfallStep = z.infer<typeof WaterfallStep>;

/** Waterfall conservation tolerance — $1.00 absolute, for FX rounding. */
export const WATERFALL_CONSERVATION_TOLERANCE = 1.0;

/**
 * Custom error code emitted on waterfall conservation violations. Distinct
 * from generic `ZodError` so monitoring can alert on this specifically
 * (architect Δ2 — block-merge CI severity, finance audit W-1).
 */
export const WATERFALL_CONSERVATION_VIOLATION = 'WATERFALL_CONSERVATION_VIOLATION';

/**
 * Waterfall payload with conservation invariant.
 *
 * Δ2 — `startValue + Σ non-anchor deltas === endValue` within $1.00
 * tolerance. Failure surfaces as a `z.ZodIssueCode.custom` issue with
 * `params.code === 'WATERFALL_CONSERVATION_VIOLATION'`, distinct from
 * generic ZodError. Severity: block-merge.
 *
 * Anchor steps (`start` / `end`) carry the absolute value in `deltaAbs`
 * for renderer convenience but are EXCLUDED from the delta sum.
 */
export const WaterfallPayload = z
  .object({
    kind: z.literal('waterfall'),
    meta: ChartMeta,
    startValue: z.number(),
    endValue: z.number(),
    steps: z.array(WaterfallStep).min(3).max(12),
    periodStart: z.string(),
    periodEnd: z.string(),
    currency: Currency.default('USD'),
  })
  .strict();
export type WaterfallPayload = z.infer<typeof WaterfallPayload>;

/* ─── union (architect Δ3 — Scatter excluded from MVP) ────────────── */

/**
 * MVP `ChartPayload` discriminated union — 10 members.
 *
 * `ScatterChartPayload` is defined above for V2 import-readiness but is
 * INTENTIONALLY NOT a member of this union (architect Δ3). Emission of
 * `{ kind: 'scatter', ... }` fails at Zod parse time at the api-client
 * trust boundary, never reaching the renderer. Re-adding requires schema
 * bump to ≥1.1 with V2 PO greenlight + legal-advisor sign-off.
 */
export const ChartPayload = z.discriminatedUnion('kind', [
  LineChartPayload,
  AreaChartPayload,
  BarChartPayload,
  StackedBarChartPayload,
  DonutChartPayload,
  SparklinePayload,
  CandlestickChartPayload,
  CalendarPayload,
  TreemapPayload,
  WaterfallPayload,
]);
export type ChartPayload = z.infer<typeof ChartPayload>;

/* ─── cross-field invariant validator ─────────────────────────────── */

/**
 * Cross-field invariants live here (not on individual payload schemas)
 * because Zod's `discriminatedUnion` requires plain `ZodObject` members,
 * and `superRefine` produces a `ZodEffects` wrapper that breaks the
 * discriminator. We attach the refinements at the envelope level
 * instead — same gate, same error provenance.
 *
 * Invariants enforced (per kickoff §5):
 * - Δ1 — Donut/Treemap sum-to-total mixin tolerance window.
 * - Δ1 — StackedBar per-row sum-to-total when `rowAggregates` present.
 * - Δ2 — Waterfall conservation: `startValue + Σ non-anchor deltas
 *   === endValue` within $1.00 absolute. Issue carries
 *   `params.code === 'WATERFALL_CONSERVATION_VIOLATION'`.
 */
function validateCrossFieldInvariants(payload: ChartPayload, ctx: z.RefinementCtx): void {
  // Δ1 — Donut sum-to-total
  if (payload.kind === 'donut') {
    const sum = payload.segments.reduce((a, s) => a + s.value, 0);
    if (!isWithinTolerance(sum, payload.meta)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['payload', 'segments'],
        message: `Σ segments.value (${sum}) not within tolerance of meta.reportedTotal (${payload.meta.reportedTotal})`,
      });
    }
  }

  // Δ1 — Treemap sum-to-total
  if (payload.kind === 'treemap') {
    const sum = payload.tiles.reduce((a, t) => a + t.weightPct, 0);
    if (!isWithinTolerance(sum, payload.meta)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['payload', 'tiles'],
        message: `Σ tiles.weightPct (${sum}) not within tolerance of meta.reportedTotal (${payload.meta.reportedTotal})`,
      });
    }
  }

  // Δ1 — StackedBar per-row sum-to-total (optional rowAggregates)
  if (payload.kind === 'stacked-bar' && payload.rowAggregates) {
    const seriesKeys = payload.series.map((s) => s.key);
    for (const aggregate of payload.rowAggregates) {
      const row = payload.data.find((d) => d.x === aggregate.rowX);
      if (!row) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['payload', 'rowAggregates'],
          message: `rowAggregate references unknown row x=${String(aggregate.rowX)}`,
        });
        continue;
      }
      let sum = 0;
      for (const key of seriesKeys) {
        const v = row[key];
        if (typeof v === 'number') sum += v;
      }
      const aggregateNormalized: MetaFinancialAggregate = {
        reportedTotal: aggregate.reportedTotal,
        reportedTotalCurrency: aggregate.reportedTotalCurrency,
        toleranceMode: aggregate.toleranceMode,
        toleranceValue: aggregate.toleranceValue,
      };
      if (!isWithinTolerance(sum, aggregateNormalized)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['payload', 'rowAggregates'],
          message: `Row x=${String(aggregate.rowX)} series sum ${sum} not within tolerance of reportedTotal ${aggregate.reportedTotal}`,
        });
      }
    }
  }

  // Δ2 — Waterfall conservation
  if (payload.kind === 'waterfall') {
    const nonAnchorDeltaSum = payload.steps
      .filter((s) => s.componentType !== 'start' && s.componentType !== 'end')
      .reduce((a, s) => a + s.deltaAbs, 0);
    const computedEnd = payload.startValue + nonAnchorDeltaSum;
    if (Math.abs(computedEnd - payload.endValue) > WATERFALL_CONSERVATION_TOLERANCE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['payload', 'steps'],
        message: `Waterfall conservation violated: startValue (${payload.startValue}) + Σ non-anchor deltas (${nonAnchorDeltaSum}) = ${computedEnd}, expected endValue ${payload.endValue} (tolerance $${WATERFALL_CONSERVATION_TOLERANCE.toFixed(2)})`,
        params: { code: WATERFALL_CONSERVATION_VIOLATION },
      });
    }
  }
}

/* ─── envelope ────────────────────────────────────────────────────── */

/**
 * Wire envelope for AI-emitted charts. Includes an optional `schemaVersion`
 * (default `'1.0'`) for forward-compatibility per architect ADR §«Risks 2».
 *
 * Cross-field invariants (Δ1 sum-to-total, Δ2 waterfall conservation) are
 * applied here via `.superRefine`. See `validateCrossFieldInvariants` above.
 */
export const ChartEnvelope = z
  .object({
    id: z.string().uuid(),
    payload: ChartPayload,
    createdAt: z.string().datetime(),
    schemaVersion: z.string().optional().default('1.0'),
  })
  .strict()
  .superRefine((envelope, ctx) => {
    validateCrossFieldInvariants(envelope.payload, ctx);
  });
export type ChartEnvelope = z.infer<typeof ChartEnvelope>;
