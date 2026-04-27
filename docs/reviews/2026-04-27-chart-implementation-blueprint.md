# Chart Implementation Blueprint

**Date:** 2026-04-27
**Author:** code-architect
**Owner:** frontend-engineer
**Status:** READY FOR IMPLEMENTATION

**Source specs consumed:**
- docs/design/CHARTS_SPEC.md v1.1 (all sections including Zod schema in section 5.2)
- docs/product/chart-component-catalog.md v1.1
- docs/design/PROVEDO_DESIGN_SYSTEM_v1.md v1.1
- packages/ui/src/charts/{AreaChart,BarChart,DonutChart,tokens}.ts (existing wrappers)
- packages/ui/package.json (recharts ^3.8.1 confirmed installed)
- apps/web/src/app/design/_sections/charts.tsx (current showcase consumer)
- packages/shared-types/src/index.ts, packages/api-client/src/index.ts
- docs/engineering/kickoffs/2026-04-27-design-system-migration.md (SLICE-DSM-V1)

---

## Architectural decisions (with rationale)

1. **11 specific typed components, not one universal dispatcher** - A universal Chart dispatcher harms tree-shaking. Recharts is ~80 kb gzipped and the packages/ui/charts subpath already exists to let non-chart bundles omit it. If all 11 types are co-imported by one module, every consumer importing Chart pays the full Recharts cost even when rendering only sparklines. With 11 named exports, Next.js per-page bundling plus React.lazy() gives pay-per-type. TypeScript discriminated-union narrowing also gives the compiler an error when a new chart type is added to the schema but no renderer branch exists.

2. **Zod validation at the API client boundary only, not at the component boundary** - packages/api-client already wraps all API interactions. Parsing ChartEnvelope there means validation runs once, failure converts to a typed error, and the component receives a known-good ChartPayload. The Zod schema lives in packages/shared-types so backend and frontend share one truth.

3. **Colors via CSS var() strings passed directly to Recharts props** - Recharts ^3.8.1 passes stroke and fill strings verbatim to SVG attributes. Using var(--chart-series-1) as a prop string causes the browser to resolve the CSS custom property at paint time, so theme switching via the .dark class on html flips chart colors in real time without any JavaScript re-render. A useTheme() hook resolving hex at mount would require a component remount on theme change because Recharts does not re-read injected colors dynamically. CSS-var approach: zero JS runtime cost, live switching, one definition point.

4. **Full Recharts encapsulation; zero Recharts API leakage to consumers** - Consumers import chart components from @investment-tracker/ui/charts and never touch recharts directly. This enforces Lane-A structural constraints: the component owns which payload fields it renders. If consumers could pass Recharts Line children directly, there would be no structural barrier against adding a movingAverage series by bypassing the schema. Migration cost if Recharts is replaced: one rewrite of packages/ui/src/charts/ with no consumer changes.

5. **React.lazy() for T2 and T3 chart types; T1 types bundled eagerly** - T1 types (Line, Area, Bar, Donut, Sparkline, Calendar, Treemap) are imported by app routes on-demand from AI chat. They belong in the initial packages/ui/charts chunk. T2 types (StackedBar, Scatter, Waterfall) and T3 (Candlestick) are imported lazily from a packages/ui/charts/lazy subpath. This keeps the critical-path bundle for the chat route below the 300 kb app-page budget.

6. **Calendar is pure DOM/CSS-grid with zero Recharts dependency** - It uses the same ChartPayload input contract, same token references, and same empty/loading/error state pattern. From the consumer perspective it behaves identically to any other chart. Treemap uses Recharts native Treemap component with a custom content render-prop tile.

7. **Waterfall and Candlestick each isolate their custom shape in their own file** - Both require custom SVG geometry (WaterfallStep, CandleShape) that cannot share a file without coupling two unrelated chart types. Each file is self-contained. The pattern is identical across both types, proven in spec sections 4.8 and 4.11.

8. **Shared skeleton/error/empty states and utilities in a _shared/ subfolder** - Used by all 11 chart types. Factored into packages/ui/src/charts/_shared/ to avoid 11 copies. This folder is not exported from the subpath index; it is internal.

9. **packages/shared-types grows a charts subpath for the Zod schema** - The schema from CHARTS_SPEC section 5.2 is TypeScript-first and designed to be shared between frontend renderer and the backend AI agent service. It lives in packages/shared-types because the backend also imports from shared-types. A new ./charts export in shared-types/package.json exports both Zod schemas and inferred types. Zod is added as a production dependency of packages/shared-types. This is the only new package dependency; it is MIT-licensed and free.

10. **Retire static showcase via gradual redirect, not hard cut** - Once the /design/charts live playground confirms all 11 chart types, a meta http-equiv refresh added to design-system.html redirects visitors to /design. Hard deletion waits one sprint to verify no external links break.
---

## File-level plan (concrete paths)

### New files to create

| Path | Purpose | Public interface |
|------|---------|-----------------|
| packages/shared-types/src/charts.ts | Zod schemas and inferred types for all 11 chart kinds | ChartPayload, ChartEnvelope, 11 payload types as Zod schemas and z.infer types |
| packages/ui/src/charts/tokens.ts | REWRITE existing file - replace old token refs | SERIES_VARS, DONUT_ORDER, CHART_TOKENS, CHART_ANIMATION_MS, colorForTreemapChange(), labelOnTile() |
| packages/ui/src/charts/_shared/formatters.ts | Value formatters per ValueFormat union | formatValue(n, format, currency?), formatXAxis(v, format) |
| packages/ui/src/charts/_shared/useReducedMotion.ts | Reduced-motion hook | useReducedMotion(): boolean |
| packages/ui/src/charts/_shared/useChartKeyboardNav.ts | Keyboard navigation hook | useChartKeyboardNav(ref, dataLength, onIndexChange) |
| packages/ui/src/charts/_shared/buildTooltipProps.ts | Shared Recharts tooltip style factory | buildTooltipProps(): TooltipProps |
| packages/ui/src/charts/_shared/ChartDataTable.tsx | Hidden table for screen-reader transcript | ChartDataTable({ payload, id }) |
| packages/ui/src/charts/_shared/ChartSkeleton.tsx | Per-kind loading skeletons | ChartSkeleton({ kind, height? }) |
| packages/ui/src/charts/_shared/ChartEmpty.tsx | Empty-data state lockup | ChartEmpty({ kind, hint? }) |
| packages/ui/src/charts/_shared/ChartError.tsx | Schema validation failure state | ChartError({ rawPayload? }) |
| packages/ui/src/charts/LineChart.tsx | Line chart (T1) | LineChart({ payload: LineChartPayload, height?, className? }) |
| packages/ui/src/charts/AreaChart.tsx | REWRITE existing - Area chart (T1) | AreaChart({ payload: AreaChartPayload, height?, className? }) |
| packages/ui/src/charts/BarChart.tsx | REWRITE existing - Bar chart (T1) | BarChart({ payload: BarChartPayload, height?, className? }) |
| packages/ui/src/charts/DonutChart.tsx | REWRITE existing - Donut chart (T1) | DonutChart({ payload: DonutChartPayload, size?, className? }) |
| packages/ui/src/charts/Sparkline.tsx | Sparkline (T1) | Sparkline({ payload: SparklinePayload, width?, height? }) |
| packages/ui/src/charts/Calendar.tsx | CSS-grid calendar (T1) | Calendar({ payload: CalendarPayload, className? }) |
| packages/ui/src/charts/Treemap.tsx | Treemap (T1) | Treemap({ payload: TreemapPayload, height?, className? }) |
| packages/ui/src/charts/StackedBar.tsx | Stacked bar (T2) | StackedBar({ payload: StackedBarChartPayload, height?, className? }) |
| packages/ui/src/charts/Scatter.tsx | Scatter / dot plot (T2) | Scatter({ payload: ScatterChartPayload, height?, className? }) |
| packages/ui/src/charts/Waterfall.tsx | Cash-flow waterfall (T2) | Waterfall({ payload: WaterfallPayload, height?, className? }) |
| packages/ui/src/charts/Candlestick.tsx | Candlestick (T3) | Candlestick({ payload: CandlestickChartPayload, height?, className? }) |
| packages/ui/src/charts/index.ts | REWRITE existing - public T1 exports (eager) | Named exports of T1 chart components and schema types |
| packages/ui/src/charts/lazy.ts | T2 and T3 lazy exports | LazyStackedBar, LazyScatter, LazyWaterfall, LazyCandlestick |

### Files to modify

| File | Changes | Priority |
|------|---------|----------|
| packages/shared-types/src/index.ts | Add export from ./charts.js | P1 |
| packages/shared-types/package.json | Add ./charts export entry; add zod to dependencies | P1 |
| packages/api-client/src/index.ts | Add parseChartEnvelope(raw: unknown): ParseChartResult | P1 |
| packages/ui/package.json | Add ./charts/lazy export entry | P2 |
| apps/web/src/app/design/_sections/charts.tsx | Replace old-API chart usages; add all 11 type demo blocks | P2 |
| apps/web/public/design-system.html | Add meta refresh redirect after all 11 live charts confirmed | P3 |

---

## Data flow


---

## Build sequence

### Phase 0 - Schema (no React, no Recharts)

1. Add zod to packages/shared-types/package.json dependencies.
2. Create packages/shared-types/src/charts.ts with full Zod schema from CHARTS_SPEC section 5.2. Export all 11 payload types as Zod schemas and z.infer types. Export ChartEnvelope.
3. Add ./charts export entry to packages/shared-types/package.json.
4. Update packages/shared-types/src/index.ts to re-export from ./charts.js.
5. Add parseChartEnvelope(raw: unknown): ParseChartResult to packages/api-client/src/index.ts.
6. Run pnpm --filter @investment-tracker/shared-types build -- must produce zero type errors.

### Phase 1 - Shared internals

7. Rewrite packages/ui/src/charts/tokens.ts.
8. Create packages/ui/src/charts/_shared/formatters.ts.
9. Create packages/ui/src/charts/_shared/useReducedMotion.ts.
10. Create packages/ui/src/charts/_shared/useChartKeyboardNav.ts.
11. Create packages/ui/src/charts/_shared/buildTooltipProps.ts.
12. Create packages/ui/src/charts/_shared/ChartDataTable.tsx.
13. Create packages/ui/src/charts/_shared/ChartSkeleton.tsx.
14. Create packages/ui/src/charts/_shared/ChartEmpty.tsx.
15. Create packages/ui/src/charts/_shared/ChartError.tsx.

### Phase 2 - T1 chart components

16. Create packages/ui/src/charts/Sparkline.tsx (simplest; validates token and formatter integration quickly).
17. Rewrite packages/ui/src/charts/AreaChart.tsx.
18. Rewrite packages/ui/src/charts/BarChart.tsx.
19. Rewrite packages/ui/src/charts/DonutChart.tsx.
20. Create packages/ui/src/charts/LineChart.tsx.
21. Create packages/ui/src/charts/Calendar.tsx.
22. Create packages/ui/src/charts/Treemap.tsx.

### Phase 3 - Bundle split

23. Rewrite packages/ui/src/charts/index.ts -- T1 eager exports.
24. Create packages/ui/src/charts/lazy.ts -- T2 and T3 via React.lazy().
25. Add ./charts/lazy to packages/ui/package.json.

### Phase 4 - T2 chart components

26. Create packages/ui/src/charts/StackedBar.tsx.
27. Create packages/ui/src/charts/Scatter.tsx.
28. Create packages/ui/src/charts/Waterfall.tsx (most complex -- computeWaterfallSteps() data transform, connector lines).

### Phase 5 - T3 chart component

29. Create packages/ui/src/charts/Candlestick.tsx (T3 -- designed now; deploy gated on PO).

### Phase 6 - Showcase integration

30. Rewrite apps/web/src/app/design/_sections/charts.tsx -- all 11 types with section 5.3 example payloads; T2/T3 behind Suspense.
31. Wire ?debug=1 gate in ChartError.tsx.

### Phase 7 - Tests

32. Vitest unit tests for formatters.ts.
33. Vitest unit tests for Zod schema -- all three Lane-A Risk Flags.
34. Vitest unit tests for computeWaterfallSteps().
35. Vitest snapshot tests for ChartDataTable per kind.
36. Playwright visual regression: 11 chart types at 320/768/1440 in both themes.
37. axe-core a11y tests on LineChart, DonutChart, Calendar.

### Phase 8 - Retire static showcase

38. After Playwright screenshots confirm parity: add redirect meta tag to apps/web/public/design-system.html.

---

## Path beta - 1-day chart-only spike

**Goal:** all 11 chart types visible as real components at /design#charts. No AI agent wiring. No Vitest/Playwright. Code produced is identical to what Path alpha reuses -- no throwaway work.

| Hour | Task | Output |
|------|------|--------|
| 0.0-0.5 | Phase 0 steps 1-5: charts.ts Zod schema, wire exports, parseChartEnvelope stub | 11 payload types type-checking |
| 0.5-1.0 | Phase 1 steps 7-11: rewrite tokens.ts, create formatters, useReducedMotion, buildTooltipProps | Shared internals ready |
| 1.0-1.5 | Phase 1 steps 12-15: ChartDataTable, ChartSkeleton, ChartEmpty, ChartError | Empty/loading/error states available |
| 1.5-3.5 | Phase 2 steps 16-20: Sparkline, AreaChart rewrite, BarChart rewrite, DonutChart rewrite, LineChart | T1 Recharts components done |
| 3.5-5.0 | Phase 2 steps 21-22: Calendar CSS-grid, Treemap Recharts native | Full T1 set -- 7 types visible |
| 5.0-6.5 | Phase 4 steps 26-28: StackedBar, Scatter, Waterfall | T2 set -- 10 types visible |
| 6.5-7.5 | Phase 3 + Phase 6: index rewrite, lazy.ts, showcase section rewrite | All 11 types visible at /design#charts |
| 7.5-8.0 | Smoke-check: pnpm build; zero TS errors; toggle light/dark -- all chart colors flip | Day-1 deliverable verified |

**What beta does NOT do:** AI agent wiring, Vitest tests, Playwright visual regression, Candlestick showcase demo (file created, no demo block added).

---

## Path alpha - full migration week

Day 1 of Path alpha is identical to Path beta. The chart subsystem is self-contained and does not block the broader token migration.

| Day | Phase alpha task | Chart-specific note |
|-----|----------------|---------------------|
| Day 1 | Beta spike -- all chart components and showcase | See above |
| Day 2 | Token migration (design-tokens rewrite per kickoff section 4.1) | tokens.ts uses var(--chart-series-N) -- picks up migrated token values once design-tokens rebuilds. Zero chart code changes needed. |
| Day 3 | Primitive refit (Button, Card, Input, etc.) | Charts are independent; can proceed in parallel if FE splits work |
| Day 4 | Consumer page integration + Geist self-host (kickoff sections 4.4, 4.6) | Chat page gets parseChartEnvelope wired into AI response stream handler; charts appear live in chat for the first time |
| Day 5 | Phase 7 tests + Phase 8 redirect | Vitest schema tests, snapshot tests, axe-core, Playwright screenshots; redirect meta tag |

---

## AI agent integration boundary

packages/shared-types/src/charts.ts is the single source of truth for both the frontend renderer and the backend AI agent service.

packages/api-client/src/index.ts gains parseChartEnvelope(raw: unknown): ParseChartResult using ChartEnvelope.safeParse(). On success returns { ok: true, data: ChartEnvelope }. On failure returns { ok: false, error: ZodError, raw: unknown }. This is the only place Zod runs for chart payloads.

Streaming: Only call parseChartEnvelope when the stream closes or [DONE] arrives. During streaming render ChartSkeleton.

Versioning: Add schemaVersion: z.string().optional().default("1.0") to ChartEnvelope before MVP ships. v1.1 additions are additive. Server versions the payload per client API version header.

---

## Lane-A structural constraints -- Zod enforcement

Risk Flag 1 -- forbidden overlays (Line and Candlestick): LineOverlay is a discriminated union containing only TradeMarker. Forbidden overlay types have no branches, so any forbidden type string produces a ZodError. A secondary .refine() checks FORBIDDEN_OVERLAY_TYPES for future-proofing.

Risk Flag 2 -- zero-only reference line (Bar and StackedBar): BarReferenceLine.axis is z.literal("zero"). There is no "target" or "benchmark" branch. BarChartPayload uses .strict() so any unknown key including targetWeight causes a ZodError.

Risk Flag 3 -- Calendar MVP eventType gate: CalendarEventType is z.enum(["dividend", "corp_action"]). "earnings" and "news" are intentionally absent. Any payload with eventType "earnings" fails validation and ChartError is rendered. Adding these requires a schema version bump and PO sign-off under R1.

---

## Theme integration -- live switching without remount

Treemap tile fill: colorForTreemapChange() returns a CSS var string applied as SVG fill. SVG fill accepts CSS custom properties in Chrome 49+, Firefox 31+, Safari 9.1+.

Calendar pill colors: DOM-based; colors come from CSS classes. Theme switching works via class toggle on html.

Area chart gradient: Recharts linearGradient stopColor accepts CSS custom properties. The existing AreaChart.tsx already uses this pattern.

Series-7 dark contrast swap: When series-7 is the ONLY series in dark mode (2:1 contrast fails), silently swap to series-1. Guard: series.length === 1 AND solo color is var(--chart-series-7) AND theme is dark. Log console.warn in development only. This is the only auto-correction the renderer performs.

Selector conflict: CHARTS_SPEC section 2.5 uses .light / .dark class selectors. Design-system kickoff section 4.3 specifies data-theme attribute. Must be resolved before Phase 0. See Open Questions item 3.

---

## Bundle size

Chat route (T1 only): ~80 kb gz Recharts + ~15 kb gz chart components = ~95 kb gz. Within the 300 kb app-page budget.
/design route (all 11): ~80 kb gz Recharts + ~5 kb gz T2/T3 lazy chunks + ~30 kb gz components.
Routes never importing charts: 0 kb.

---

## Test strategy

Schema unit tests (packages/shared-types/src/charts.test.ts): BarChartPayload with targetWeight -> ZodError; BarReferenceLine axis "target" -> ZodError; LineChartPayload overlay "moving_average" -> ZodError; CalendarPayload eventType "earnings" -> ZodError; CandlestickChartPayload extra field -> ZodError; all section 5.3 example payloads parse successfully.

Formatter unit tests (packages/ui/src/charts/_shared/formatters.test.ts): formatValue(1234567, currency-compact) -> $1.23M; formatValue(0.0234, percent) -> +2.34%; formatXAxis("2026-04-12", date-day) -> Apr 12.

Waterfall unit tests (packages/ui/src/charts/Waterfall.test.ts): computeWaterfallSteps() running total equals payload.endValue.

ChartDataTable snapshot tests per kind using fixed-seed payloads from section 5.3.

Visual regression (Playwright): 11 chart types at 320/768/1440 in both themes = 66 baseline screenshots plus empty/error/skeleton screenshots. Store in apps/web/tests/visual/charts/.

A11y tests (axe-core via Playwright): LineChart, DonutChart, Calendar before v1 merge. Verify role="img", aria-label, aria-describedby targets a table, keyboard arrow nav reachable.

No Storybook install (R1 -- Chromatic requires PO approval). /design/charts is the living playground.

---

## Static showcase retirement plan

1. Beta completes -- all 11 charts visible at /design#charts.
2. FE screenshots at all 6 breakpoints in both themes; PO confirms parity.
3. Add meta http-equiv="refresh" content="0; url=/design" to apps/web/public/design-system.html head. File stays on disk.
4. One sprint later (no regressions): delete the file in a dedicated cleanup commit.

---

## Open questions for tech-lead / FE

1. Streaming protocol: Does the AI agent SSE stream emit ChartEnvelope as a single JSON atom after its tool-call completes, or stream JSON incrementally? Recommendation: single-atom after tool-call.

2. schemaVersion field: Should ChartEnvelope include schemaVersion from day 1? Recommend yes. Needs backend-engineer alignment.

3. data-theme vs class selector conflict: CHARTS_SPEC section 2.5 uses .light / .dark class selectors. Design-system kickoff section 4.3 specifies data-theme attribute. Must resolve before Phase 0. If data-theme wins, chart token CSS uses [data-theme="dark"] selectors.

4. Chart CSS tokens injection for beta: For Path beta, inject --chart-series-1..7 directly in apps/web/src/app/globals.css. For Path alpha Day 2 they migrate to packages/design-tokens. Confirm beta approach before Day 1.

5. Recharts Treemap aspectRatio prop: Spec uses aspectRatio={1.618}. Verify this prop exists on the Recharts ^3.8.1 Treemap TypeScript definition before writing the component.

6. Candlestick beta scope: Recommend creating Candlestick.tsx and exporting it from lazy.ts in Phase 5, but adding no demo block to the showcase.

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------| 
| Recharts Treemap content render-prop props differ between ^3.8.x minor versions | Low | Medium | Smoke-test node.x/y/width/height before writing TreemapTile |
| CSS var() not resolved in SVG text elements on older WebKit | Low | Low | Fall back to hex literal in CHART_TOKENS for text tokens if Playwright Safari fails |
| Calendar clip-path polygon on corp_action diamond pill unsupported on some mobile browsers | Low | Low | Feature-detect via @supports; fall back to border-radius square pill |
| Waterfall data transform off-by-one: running total does not match endValue | Medium | Medium | Write computeWaterfallSteps() unit test before building the component |
| Series-7 dark swap triggers when multiple series exist but one is series-7 | Low | Low | Guard: series.length === 1 AND solo color is var(--chart-series-7) AND theme is dark |
| ChartEnvelope.id used for aria-describedby before full parse during streaming | Low | Low | Use envelope.id only after parse success; during streaming use local useId() |
| Zod version conflict when added to packages/shared-types | Low | Medium | Pin Zod at ^3.x; if conflict exists, co-locate schema in packages/ui instead |
