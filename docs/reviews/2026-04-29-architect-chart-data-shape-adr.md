# ADR — 2026-04-29 — Chart-component data-shape architecture

**Status:** PROPOSED → AWAITING right-hand integration
**Author:** architect
**Supersedes:** none — refines (does not supersede) §1 of `docs/reviews/2026-04-27-chart-implementation-blueprint.md` and confirms §§2-9
**Counterpart docs:** `docs/design/CHARTS_SPEC.md` v1.1 (§5 Zod schema), `docs/product/chart-component-catalog.md` v1.1
**Sister ADRs in flight:** finance-advisor — Lane-A regulatory audit; tech-lead — FE/backend/QA kickoffs

---

## Decision summary

We ship one typed component per `kind` in the Zod discriminated union (11 components), NOT one universal `<Chart />` dispatcher and NOT separate components per use-case (e.g. no separate `<DrawdownLineChart />`). Each component prop is `payload: <Kind>ChartPayload` — the same shape the AI agent emits — and each component is configuration-driven within its kind: axes, formats, series count, currency, interpolation, sign-coloring, orientation, and reference lines are all payload fields. The PO worry («один чарт может поддерживать разный набор данных») is answered structurally: a single `<LineChart />` handles portfolio price-series, returns% over time, drawdown%, allocation% projection — because the payload `yAxis.format`, `yAxis.domain`, and `series[].label` are the variation surface, not the component identity.

## Context

PO greenlit Path γ implementation. Before tech-lead decomposes into builder kickoffs, one architectural worry must be closed:

> «нам нужно убедиться что один чарт может поддерживать разный набор данных»

Concrete examples PO listed: portfolio time-series price (USD over time), returns% (negative-positive scale), drawdown% (always negative, zero-anchored top), allocation% snapshot (single point with %).

The 2026-04-27 blueprint by code-architect already chose «11 typed components, not one universal dispatcher» (§1) but did not explicitly close the question of whether each typed component is itself parameterizable across multiple data variants, or whether each variant requires its own subclass component. That gap is what this ADR closes.

Scope of impact: the public TypeScript interface of the 11 chart components in `packages/ui/src/charts/` and the Zod schemas in `packages/shared-types/src/charts.ts`. Downstream: AI-agent payload generation, FE chat-page integration, OpenAPI contract.

---

## Data-binding contract (per chart type)

The ground rule: every component takes one prop, `payload`, typed as `z.infer<typeof <Kind>ChartPayload>` from `packages/shared-types/src/charts.ts`. No per-use-case props. No render-prop overrides. The payload IS the variation surface.

The 11 contracts as inferred TypeScript (one-line summary; full Zod definitions in CHARTS_SPEC.md §5.2):

### 1. LineChart

```ts
{
  kind: 'line';
  meta: ChartMeta;
  xAxis: { format: XAxisFormat; label?: string };
  yAxis: {
    format: ValueFormat;
    currency?: string;
    label?: string;
    domain?: [number | 'auto', number | 'auto'];
  };
  series: Series[];           // 1..3
  data: MultiSeriesPoint[];   // 0..500
  interpolation: 'monotone' | 'linear' | 'step';
  benchmark?: { y: number; label: string };
  overlay?: TradeMarker[];    // Lane-A: only trade_marker permitted
}
```

### 2. AreaChart

```ts
{
  kind: 'area';
  meta: ChartMeta;
  xAxis: { format: XAxisFormat; label?: string };
  yAxis: { format: ValueFormat; currency?: string; label?: string };
  series: Series[];           // 1..5
  data: MultiSeriesPoint[];   // 0..500
  stacked: boolean;
  interpolation: 'monotone' | 'linear' | 'step';
}
```

### 3. BarChart

```ts
{
  kind: 'bar';
  meta: ChartMeta;
  xAxis: { format: XAxisFormat; label?: string };
  yAxis: { format: ValueFormat; currency?: string; label?: string };
  data: CategoryPoint[];      // 0..50
  orientation: 'vertical' | 'horizontal';
  colorBySign: boolean;
  diverging: boolean;
  referenceLine?: { axis: 'zero'; label?: string };
  // NOTE: no targetWeight field — Lane-A structural exclusion
}
```

### 4. StackedBar

```ts
{
  kind: 'stacked-bar';
  meta: ChartMeta;
  xAxis: { format: XAxisFormat; label?: string };
  yAxis: { format: ValueFormat; currency?: string; label?: string };
  series: Series[];           // 2..5
  data: MultiSeriesPoint[];   // 0..50
  referenceLine?: { axis: 'zero'; label?: string };
}
```

### 5. DonutChart

```ts
{
  kind: 'donut';
  meta: ChartMeta;
  format: ValueFormat;
  currency?: string;
  segments: Array<{           // 1..7
    key: string;
    label: string;
    value: number;            // >= 0
    color?: string;
  }>;
  centerLabel?: string;
}
```

### 6. Sparkline

```ts
{
  kind: 'sparkline';
  meta: ChartMeta;
  format: ValueFormat;
  currency?: string;
  data: TimePoint[];          // 2..120
  trend?: 'up' | 'down' | 'flat';
  filled: boolean;
}
```

### 7. Scatter

```ts
{
  kind: 'scatter';
  meta: ChartMeta;
  xAxis: { format: ValueFormat; label: string };
  yAxis: { format: ValueFormat; label: string };
  groups: Array<{             // 1..3
    key: string;
    label: string;
    color?: string;
    points: ScatterPoint[];   // >= 1
  }>;
  referenceLines?: Array<{ axis: 'x' | 'y'; value: number; label?: string }>;
}
```

### 8. Candlestick (T3 — Lane-A structural exclusions per CHARTS_SPEC §4.8)

```ts
{
  kind: 'candlestick';
  meta: ChartMeta;
  xAxis: { format: XAxisFormat };
  yAxis: { format: ValueFormat; currency?: string };
  symbol: string;
  data: CandlePoint[];        // 1..365
  // STRUCTURALLY EXCLUDED: support/resistance/trend/channel lines, MA, RSI,
  // MACD, Bollinger, signal annotations, buy/sell markers, target prices.
  // .strict() rejects unknown keys at parse time.
}
```

### 9. Calendar

```ts
{
  kind: 'calendar';
  meta: ChartMeta;
  view: 'month' | 'week' | 'list';
  periodStart: string;        // ISO date
  periodEnd: string;          // ISO date
  events: Array<DividendEvent | CorpActionEvent>;  // 0..500
  totalReceived?: number;
  totalScheduled?: number;
  currency: string;           // ISO 4217
  // NOTE: eventType restricted to dividend + corp_action — earnings/news V2-gated
}
```

### 10. Treemap

```ts
{
  kind: 'treemap';
  meta: ChartMeta;
  asOf: string;               // ISO datetime
  baseCurrency: string;       // ISO 4217
  tiles: TreemapTile[];       // 2..50
  // NOTE: no concentrationThreshold — would imply normative «too concentrated»
}
```

### 11. Waterfall

```ts
{
  kind: 'waterfall';
  meta: ChartMeta;
  startValue: number;
  endValue: number;
  steps: WaterfallStep[];     // 3..12 (start + >= 1 component + end)
  periodStart: string;        // ISO date
  periodEnd: string;          // ISO date
  currency: string;           // ISO 4217
}
```

### How this answers the PO worry

The PO listed four example use-cases. Three of them collapse into a single LineChart:

1. **Portfolio price (USD over time)** rendered as LineChart with `yAxis.format = currency-compact`, `yAxis.currency = USD`, `yAxis.domain = [auto, auto]`. One series.
2. **Returns% over time (signed)** rendered as the same LineChart with `yAxis.format = percent`, `yAxis.domain = [auto, auto]`, plus `benchmark = { y: 0, label: Zero return }` to anchor the sign axis.
3. **Drawdown% (always negative, zero-anchored top)** rendered as the same LineChart with `yAxis.format = percent`, `yAxis.domain = [auto, 0]`. The component does not need a special «drawdown» mode — it reads the domain and renders.
4. **Allocation% snapshot** is NOT a line. This is DonutChart (single moment) or BarChart with `orientation = horizontal` (sortable bars). Allocation drift over time is StackedBar with date x-axis. The choice is the AI agent — made by emitting a different `kind`.

Cases (1)-(3) collapse into the same LineChart because the payload schema makes axis-format, domain, sign-anchoring, and series count first-class fields. Case (4) is a different `kind` because the visual encoding (radial vs cartesian, snapshot vs series) genuinely differs — and the discriminated union enforces that distinction at compile time AND runtime.

---

## Component composition strategy

**Recommendation: monolithic per-kind component (no compound API, no headless layer, no slots).**

Each chart is a single React component that accepts exactly one prop (`payload`) plus two presentation overrides (`height?: number`, `className?: string`). All Recharts internals are encapsulated; consumers cannot pass Recharts children, render-props, or sub-component overrides.

Rejected alternatives:

- **Universal `<Chart payload={...} />` dispatcher.** Rejected per code-architect blueprint §1 — kills tree-shaking. A page rendering only Sparkline would pay the full Recharts cost. With 11 named exports, Next.js per-route bundling plus `React.lazy()` (T2/T3) gives pay-per-type. Confirmed.

- **Compound API (Radix-style: Chart > Chart.Line + Chart.Tooltip + Chart.Axis).** Rejected. (a) It leaks Recharts mental-model into consumers; if Recharts is ever swapped (the blueprint preserves this option) every consumer breaks. (b) It creates a structural escape hatch for Lane-A guardrails: a builder could add a Chart.MovingAverage child bypassing the schema. The Lane-A risk flags (forbidden overlays, zero-only reference, restricted calendar event types) MUST live structurally inside one component file each, validated by Zod once at the api-client boundary. Compound APIs distribute that concern across many child components and weaken enforcement.

- **Headless + style hooks (TanStack-style `useChart()` returning render configs).** Rejected. The visual language of Provedo charts (motion language, depth tokens, density rules from `PROVEDO_DESIGN_SYSTEM_v1.md` §§5,7) is opinionated and product-specific. A headless layer makes sense for libraries serving multiple apps; we have one app and one design system. Headless is over-engineering at pre-alpha; the cost is one extra abstraction layer per chart, no payoff.

- **Per-use-case subclass components (DrawdownLineChart, ReturnsLineChart, PriceLineChart).** Rejected — and this is the direct answer to the PO worry. (a) The payload schema already encodes the variation surface (axis format, domain, series labels, benchmark line). Adding subclass components duplicates that variation in TypeScript without adding capability. (b) AI-agent codepath becomes unstable: the agent emits one `kind`, but the FE has to map agent output to subclass component. That mapping is exactly what the discriminated union eliminates. (c) Subclass count grows superlinearly with new use-cases; the catalog has 57 entries, many sharing kind. We would end up maintaining ~30 subclass components for what is properly 11 components.

Trade-offs of the chosen monolithic per-kind approach:

| Dimension | Cost | Mitigation |
|-----------|------|------------|
| Bundle size per kind | T1 components ~3-5kB gz each + Recharts ~80kB gz shared | T2/T3 via `React.lazy()` per blueprint §1.5 |
| API ergonomics | Single `payload` prop is opinionated; consumers cannot tweak | This is the goal — Lane-A guardrails enforced at boundary |
| Extensibility | Adding new visual mode within a kind = schema change | Schema versioning per blueprint §AI-agent-integration; additive bumps only |
| Replaceability of Recharts | Full encapsulation = single-rewrite swap | Confirmed; no consumer code touches Recharts |
| Testing | Per-kind snapshot + Zod contract test | Per blueprint §test-strategy — already planned |

---

## Theme + locale + units props

**Theme:** zero React props, zero context. All chart colors are CSS custom properties (`var(--chart-series-1)` ... `var(--chart-series-7)`, `var(--chart-grid)`, `var(--chart-tooltip-bg)`) passed verbatim as Recharts `stroke` / `fill` strings. Light/dark switches via the active theme selector on `<html>` flip colors at paint time without React re-render. This is the blueprint §3 decision and it stands. The CHARTS_SPEC §2.5 vs design-system §4.3 selector conflict (class selector vs `data-theme` attribute) is open question 2 below — both work; we just pick one and align tokens.

**Currency / locale formatting:** lives inside `_shared/formatters.ts`, called as `formatValue(n, payload.yAxis.format, payload.yAxis.currency)`. NO React Context for locale. Reasoning:

- Currency is a payload field, not a user preference — the AI agent chose the currency when it picked the data source (broker base currency, FX-converted displayed currency); the renderer must render exactly what the agent shipped.
- Number locale (thousand separators, decimal point) follows browser `Intl.NumberFormat(undefined, ...)` which respects user OS locale. No prop needed.
- If Provedo later adds user-controlled display locale, it is added as a `FormatterOptions` parameter to `formatValue` and read from a Zustand store at the api-client parsing boundary — not at the component prop boundary. This keeps the chart prop surface stable.

**Units (compact suffix vs full):** the `format = currency-compact` choice is a payload-level decision per CHARTS_SPEC §5.2. The agent decides; the renderer obeys. Fine-grained per-axis-tick formatting lives in `formatters.ts`.

**Density / size:** only `height?: number` and `className?: string` are presentational props on every chart component. Width is always `100%` via Recharts `<ResponsiveContainer />`. DonutChart has a `size?: number` (square), Sparkline has `width?: number; height?: number` (inline measurement). No `density` / `compact` / `large` enum prop — these are container responsibilities, not chart responsibilities.

---

## Confirmation / refinement of the prior architectural decisions

The 2026-04-27 blueprint listed 10 architectural decisions. Addressed:

1. **11 typed components, not universal dispatcher** — CONFIRM. Reinforced above.
2. **Zod validation at api-client boundary, not component boundary** — CONFIRM. Components receive `z.infer<typeof Payload>`, already type-checked. No double validation.
3. **CSS var() strings for colors, no useTheme hook** — CONFIRM. Live theme switching is structurally important.
4. **Full Recharts encapsulation, zero leakage** — CONFIRM. This ADR additionally rejects compound/headless APIs that would leak Recharts mental-model.
5. **`React.lazy()` for T2/T3** — CONFIRM. Bundle math holds.
6. **Calendar pure DOM/CSS-grid, Treemap native Recharts** — CONFIRM.
7. **Waterfall + Candlestick each in own file** — CONFIRM.
8. **Shared `_shared/` subfolder** — CONFIRM.
9. **Zod schema lives in `packages/shared-types/charts.ts`** — CONFIRM with one **REFINEMENT:** export both Zod schemas AND the `z.infer<>` types from the same module. Backend (Go AI service) does not consume Zod runtime; it consumes the TypeScript types only via OpenAPI codegen, so co-location is safe and saves a package.
10. **Static showcase retire via redirect** — CONFIRM. Out of architect scope; tech-lead/FE call.

Net result: one refinement (decision 9 — co-locate types and schemas in `shared-types/charts.ts`). Nine decisions stand unchanged.

---

## Risks + mitigations

1. **Risk:** AI agent emits payload that schema-validates but encodes a Lane-A-prohibited semantic via prose (e.g. tooltip text labelled «buy zone»). **Mitigation:** Zod cannot police prose. This is finance-advisor territory — flag for their audit. The architect data-binding contract is necessary but not sufficient for Lane-A.

2. **Risk:** Schema versioning drift — backend emits payload version 1.2 with new fields; FE on 1.1 fails Zod `.strict()` parse. **Mitigation:** add `schemaVersion` (optional string, default `1.0`) to `ChartEnvelope` BEFORE MVP ships (blueprint §AI-agent-integration open Q2). Forward-compat policy: additive minor bumps; FE on n parses payload from server on n+1 by ignoring unknown keys via `.passthrough()` ONLY for additive scalar fields, never for new structural fields. Decision: keep `.strict()` but bump major-version on server before flipping FE.

3. **Risk:** PO «one chart, many shapes» confidence breaks the first time AI agent renders e.g. drawdown — agent emits `kind = area` instead of `kind = line` with `yAxis.domain = [auto, 0]`. **Mitigation:** the Zod schema is the contract for both sides. Add fixture tests in `packages/shared-types/src/charts.test.ts` that lock canonical payload examples for each catalog use-case (drawdown, returns%, price-series, allocation snapshot) — tests double as documentation for the AI-agent prompt engineer. Catalog A1, A4, A5, A9, B1 each get a fixture.

4. **Risk:** Adding a 12th chart type later (e.g. heatmap for correlation matrix) requires touching many files. **Mitigation:** that is the cost of typed dispatch and it is correctly placed. Adding a 12th type SHOULD be a deliberate review event: schema bump, finance-advisor Lane-A audit, PD visual spec, FE component. Not friction-free, by design.

5. **Risk:** Recharts ^3.8.1 minor-version churn on Treemap content render-prop or Candlestick custom shape API. **Mitigation:** these two charts already isolated per blueprint §1.7; full encapsulation means a Recharts swap rewrites two files, not 11.

---

## Cross-team flags

- **finance-advisor (sister audit):** Three Lane-A risk flags are baked into the Zod schema (`FORBIDDEN_OVERLAY_TYPES` whitelist on Line, `BarReferenceLine` zero-only, `CalendarEventType` dividend+corp_action only). Architect-level enforcement is structural — but PROSE in `meta.title`, `meta.subtitle`, `meta.source`, axis labels, and series labels is unconstrained. Recommend finance-advisor confirm: is there a need for a `meta.captionRequired: boolean` field that forces the renderer to show a mandatory caption (per CHARTS_SPEC §1.4 «required annotations on every chart»)? If yes — schema addition before MVP. If no — captions live in agent prose only and finance-advisor relies on prompt-engineering review.

- **finance-advisor (sister audit):** Drawdown chart (catalog A5) has a hard fallback rule: «if history <90 days, suppress chart with copy». This is a payload-level vs renderer-level call. Recommend: agent suppresses (returns no chart, returns prose only). Renderer does NOT have suppression logic; it renders what it gets or shows empty state. Confirm with finance-advisor.

- **tech-lead (kickoff decomposition):** This ADR is the FE contract source of truth. The tech-lead FE kickoff should cite §«Data-binding contract» table verbatim and §«Component composition strategy» recommendation as the locked design. No deviation without a follow-up ADR.

- **tech-lead (backend kickoff):** Backend AI service must consume the same Zod-derived types via OpenAPI codegen. The `ChartEnvelope` type is the boundary. AI agent prompts should reference `CHARTS_SPEC.md §5.3` example payloads as in-context shots. Recommend tech-lead schedule a backend-engineer pass on the OpenAPI generation toolchain BEFORE Phase 0 of the build sequence.

- **tech-lead (QA kickoff):** Lane-A guardrail tests are non-negotiable per CHARTS_SPEC §9.7. Recommend QA kickoff explicitly enumerate the four schema-rejection tests (`targetWeight` on bar, `moving_average` overlay on line, `earnings` event on calendar, extra field on candlestick) and gate CI on them.

---

## Open questions for PO

Maximum 3, each with a default if PO does not answer.

1. **Schema version field at MVP — yes or no?** The architect-recommendation is YES — add `schemaVersion = 1.0` to `ChartEnvelope` from day 1. Cost: one optional Zod string field. Benefit: forward-compatibility cliff avoided. **Default if no PO response: ship with `schemaVersion`.**

2. **Theme selector mechanism — class on `<html>` (CHARTS_SPEC §2.5) or `data-theme` attribute (design-system kickoff §4.3)?** Both work for chart token resolution; the question is alignment with the rest of the design system. Architect recommendation: `data-theme` because it generalizes to future themes (e.g. `data-theme = hicontrast`, `data-theme = print`) without class proliferation. **Default if no PO response: `data-theme` attribute.**

3. **Per-use-case fixture tests — how many?** Catalog has 57 entries. Locking a fixture for every entry is overkill at pre-alpha; locking zero leaves drift risk. Architect recommendation: lock 11 fixtures (one per `kind`), each chosen as the highest-frequency catalog representative (A1 sparkline, A9 area, B1 bar, B1 donut, A4 line, etc.). **Default if no PO response: 11 fixtures.**

---

## Implementation handoff

Tech-lead picks up this ADR and:

1. Writes FE kickoff citing §«Data-binding contract» and §«Component composition strategy».
2. Writes backend kickoff for OpenAPI codegen of `ChartEnvelope` types.
3. Writes QA kickoff with the four Lane-A schema-rejection tests as CI gates.

Architect closes this ADR. No further architectural questions in scope. Any new chart type, schema-breaking change, or composition-API revision opens a new ADR.
