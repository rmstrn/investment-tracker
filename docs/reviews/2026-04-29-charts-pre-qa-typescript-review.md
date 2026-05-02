# Charts Subsystem — Pre-QA TypeScript Review

**Branch:** `chore/plugin-architecture-2026-04-29`
**Reviewer:** typescript-reviewer agent
**Date:** 2026-04-29
**Scope:** `packages/shared-types/src/charts.ts`, `charts.test.ts`; `packages/api-client/src/index.ts`; `packages/ui/src/charts/**`; `apps/web/src/app/design/_sections/charts.tsx`

---

## Summary

**FIX-BEFORE-MERGE** — 0 CRITICAL / 2 HIGH / 4 MEDIUM / 2 LOW

Typecheck passes across all 9 packages (13 turbo tasks, 0 errors). All 57 schema tests and 17 UI smoke tests pass. No `any` casts exist in production code. Zero Zod imports in `packages/ui/src/charts/`. Discriminator integrity holds; Scatter is excluded from the MVP union per architect Delta-3. Two HIGH findings require pre-merge attention.

---

## Findings

### HIGH

**H-1 — `ChartMeta.merge(MetaFinancialAggregate)` does not preserve `.strict()`**

Files: `packages/shared-types/src/charts.ts` lines 386, 582

Zod's `.merge()` creates a fresh `ZodObject` whose unknown-key policy defaults to `strip`, not `strict`. `DonutChartPayload.meta` and `TreemapPayload.meta` both use `ChartMeta.merge(MetaFinancialAggregate)` and silently accept unknown keys at parse time. Every other nested `z.object()` in the file explicitly calls `.strict()`. Confirmed via runtime test against Zod 3.25.76 in this review session: extra keys pass through the merged schema without error. Fix: append `.strict()` to both merge calls.

**H-2 — Root barrel re-exports Zod schema *values*, breaking single-parser invariant**

File: `packages/shared-types/src/index.ts` line 26

`export * from './charts.js'` re-exports all Zod schema values (`ChartEnvelope`, `ChartPayload`, `LineChartPayload`, etc.) from the root `@investment-tracker/shared-types` package. Any consumer can call `.safeParse()` / `.parse()` on these schemas directly, bypassing `parseChartEnvelope` in `packages/api-client/src/index.ts` — the declared sole trust boundary per architect ADR Delta-4. Fix: replace `export * from './charts.js'` with `export type * from './charts.js'`. This re-exports all `z.infer<...>` types (which consumers legitimately need for prop types) while omitting the runtime Zod schema objects.

---

### MEDIUM

**M-1 — `validateCrossFieldInvariants` cognitive complexity 26 (limit 15)**

File: `packages/shared-types/src/charts.ts` line 695

Biome `noExcessiveCognitiveComplexity` warning (confirmed by lint run). The function is a CRITICAL compliance gate enforcing Delta-1 and Delta-2 invariants. At complexity 26 it is difficult to audit per invariant and will worsen as new chart kinds ship. Extracting each invariant into a named private helper (`validateDonutSum`, `validateTreemapSum`, `validateStackedBarRows`, `validateWaterfallConservation`) resolves the warning and makes the gate auditable in isolation.

**M-2 — Redundant type casts after discriminated-union narrowing in `EventMarker`**

File: `packages/ui/src/charts/Calendar.tsx` lines 98, 111

Inside `EventMarker`, after the `if (event.eventType === 'corp_action')` guard, TypeScript has already narrowed `event` to `CorpActionEvent`. The `(event as CorpActionEvent)` cast on line 98 is redundant. The `else` branch is likewise already narrowed to `DividendEvent`, making `event as DividendEvent` on line 111 unnecessary. Redundant casts obscure correct narrowing and could mislead future contributors into thinking the union is not discriminated.

**M-3 — `React.ReactElement` return types without explicit React import**

File: `packages/ui/src/charts/_shared/ChartDataTable.tsx` lines 48, 77, 106, 127, 148, 159, 198, 223, 246

All nine internal helpers declare `React.ReactElement` as their return type without an explicit `import React` or `import type { ReactElement } from 'react'`. This works because `@types/react` exposes `React` as an ambient namespace under the `react-jsx` transform, but it is an implicit dependency. The idiomatic pattern — `import type { ReactElement } from 'react'` then use `ReactElement` — is consistent with every other React-type usage in this codebase.

**M-4 — Non-null assertions on array index access in schema tests**

File: `packages/shared-types/src/charts.test.ts` lines 571-572

`treemapPayload.tiles[0]!` and `treemapPayload.tiles[1]!` use non-null assertions to satisfy `noUncheckedIndexedAccess`. Biome flags these as `noNonNullAssertion` warnings (confirmed). Destructuring the two tiles into named constants at the top of the test block eliminates both assertions while remaining readable.

---

### LOW

**L-1 — `console.warn` guarded by hostname check instead of `NODE_ENV`**

File: `packages/ui/src/charts/LineChart.tsx` lines 92-97

The dev-diagnostic `console.warn` for the series-7-on-dark auto-swap is gated on `hostname === 'localhost' || hostname === '127.0.0.1'`. Documented and harmless, but will silently suppress the warning on staging environments not using localhost. `process.env.NODE_ENV !== 'production'` is the idiomatic check in Next.js/Vite projects and is tree-shaken at build time. Low priority.

**L-2 — Double-cast `as unknown as MultiSeriesPoint[]` in fixtures.ts**

File: `packages/ui/src/charts/_shared/fixtures.ts` line 34

Structurally necessary: `MultiSeriesPoint`'s `.catchall(z.number())` index signature conflicts with the `x: string | number` property in TypeScript's object-literal inference. The JSDoc comment on `asMultiSeries` explains this. A brief inline comment at the cast site referencing the catchall constraint would help reviewers reading call sites without the JSDoc context.

---

## Surface Findings

**Discriminator integrity — clean.** `ChartPayload` discriminated union has exactly 10 members. `ScatterChartPayload` is defined but excluded per Delta-3. `ChartEnvelope` discriminates on `payload.kind`. Confirmed via all 57 schema tests passing.

**Zero Zod imports in renderer layer.** No `from 'zod'` in any file under `packages/ui/src/charts/`. Clean.

**`noUncheckedIndexedAccess` + `as const` tuple.** `SERIES_VARS` is `as const`, so indexed accesses (`SERIES_VARS[0]`, `SERIES_VARS[1]`, etc.) resolve to specific string literal types — not `string | undefined`. TypeScript does not widen these under `noUncheckedIndexedAccess` when the tuple length is statically known. No guards needed; the compiler confirms this.

**`validateCrossFieldInvariants` — private, correctly wired.** Both `isWithinTolerance` and `validateCrossFieldInvariants` are module-private (no `export`). The refinement is attached at the `ChartEnvelope` level rather than the individual payload schemas, which is the correct placement: attaching `superRefine` to a schema member would produce a `ZodEffects` wrapper that breaks `discriminatedUnion` membership.

**Waterfall fixture divergence.** `_shared/fixtures.ts` uses `endValue: 242890` (realized_gains: 4200) while `charts.test.ts` uses `endValue: 246890` (realized_gains: 8200). Both conserve correctly within their own numbers. The divergence is documented in the fixture comment (finance audit W-1). Not a type bug, but worth aligning post-merge so showcase and test fixtures agree.

---

## Recommendation

**FIX-BEFORE-MERGE**

H-1 (`.strict()` not preserved on merged `meta` for Donut and Treemap payloads — Lane-A guardrails partially bypassed) and H-2 (Zod schema values leak from root barrel, single-parser invariant bypassable) are both targeted one-to-two-line fixes with no API surface change for consumers. Merge after H-1 and H-2 are resolved. M/L items can be tracked in `docs/TECH_DEBT.md`.
