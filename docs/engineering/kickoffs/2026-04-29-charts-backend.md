# Kickoff — Charts Backend v1 (Zod schemas + Lane-A structural guardrails + parser)

**Date:** 2026-04-29
**Author:** tech-lead (Right-Hand)
**Owner:** backend-engineer
**Status:** APPROVED BY PO — ready to dispatch
**Slice ID:** SLICE-CHARTS-BACKEND-V1
**Branch:** `feat/charts-backend-v1`
**Base SHA:** verify on dispatch — current `main` tip (HEAD of `chore` integration after architect ADR lands; check `git log --oneline -5 origin/main` first)
**Worktree:** main repo working tree (no separate worktree needed)
**Scope sizing:** small-medium surface — single PR with Zod schemas in `packages/shared-types/` + `packages/api-client/` integration + tests. Quality gate: 11 schemas exported with TypeScript types, 3 risk flags from CHARTS_SPEC v1.1 §5 enforced as Zod refinements (not just runtime checks), parser rejects every Lane-A-violating payload identified in finance audit.
**PR target:** `main`; single PR

---

> **Cross-team coordination**
>
> **Architect ADR:** `docs/reviews/2026-04-29-architect-chart-data-shape-adr.md` — read first. Defines schema package location (whether schemas live in `packages/shared-types` per blueprint architectural decision 9, or a new `packages/charts-contract` package), the `ChartEnvelope` shape, the `parseChartEnvelope` API surface, and the optional `schemaVersion` field. **You implement what the architect ADR specifies.**
>
> **Finance audit:** `docs/reviews/2026-04-29-finance-charts-lane-a-audit.md` — read second. Cross-check that the Zod schemas reject every Lane-A-violating payload the audit calls out. The 3 Risk Flags from CHARTS_SPEC v1.1 §5 are the structural baseline; the audit may add per-chart refinements.
>
> **Theme decision:** `data-theme="light"` / `data-theme="dark"` on `<html>` — see `docs/DECISIONS.md` 2026-04-29 entry. Has no direct effect on this slice (schema is theme-agnostic), but the architect ADR may reference it for documentation completeness.

---

## 1. Why this slice

The 11 chart components (SLICE-CHARTS-FE-V1, dispatched in parallel) consume a typed `ChartPayload` discriminated union. That contract is currently spec-only — drafted in `docs/design/CHARTS_SPEC.md` §5.2 as TypeScript-first Zod prose. To unblock FE, we need:

1. **The schemas materialised as runnable Zod code** in the monorepo, exported from a stable subpath.
2. **A single parsing entry point** at the API-client boundary so validation happens exactly once per response, not once per chart instance.
3. **Lane-A structural guardrails baked into the schemas, not the renderer** — the parser rejects forbidden overlays / target-weight reference lines / V2 calendar event types BEFORE the renderer is even invoked. The renderer then becomes a pure dispatcher.

This is the upstream FE depends on. Without this slice, FE cannot even compile (the chart components import payload types from `@investment-tracker/shared-types/charts` per architect ADR).

---

## 2. Hard rules (apply throughout)

- **R1 — No spend.** Zod is MIT-licensed and free. If Zod is not yet a direct dependency of `packages/shared-types`, add it from npm. Do NOT add any paid validation library (zod-vs-yup-vs-joi is a red herring; Zod is the project standard per `packages/api-client/src/index.ts` parsing patterns and per blueprint architectural decision 9). **No new paid services, schema-generation SaaS, or commercial validators.**
- **R2 — No external comms.** No tweets / blog posts / vendor outreach authored on PO's behalf during this slice.
- **R4 — No predecessor references.** No mention of the rejected naming predecessor in commit messages, code comments, or PR description. If documenting the original $250 budget, refer to it as «sunk cost» without naming the predecessor brand.

---

## 3. Theme mechanism (decided 2026-04-29)

`data-theme="light"` / `data-theme="dark"` on `<html>`. See `docs/DECISIONS.md` 2026-04-29 entry. **No effect on this slice** — schemas are presentation-agnostic. Cited for cross-kickoff consistency.

---

## 4. Source-of-truth inputs (read in this order — do NOT skip)

1. **`docs/reviews/2026-04-29-architect-chart-data-shape-adr.md`** — chart data-shape ADR (sister output, lands before you start). Specifies:
   - Whether schemas live in `packages/shared-types/src/charts.ts` (blueprint default) or a new `packages/charts-contract` (alternative — confirm).
   - The `ChartEnvelope` envelope shape (id, kind discriminant, payload, meta, optional `schemaVersion`).
   - The `parseChartEnvelope(raw: unknown): ParseChartResult` API surface with success / failure shape.
   - Whether `parseChartEnvelope` lives in `packages/api-client/src/index.ts` or a sibling file.
   - The exact Zod-version pin (Zod ^3.x per blueprint Risks; if architect ADR pins differently, follow ADR).
   **You implement what this ADR specifies.** If the ADR is silent on a detail covered below, fall back to the spec or blueprint default.
2. **`docs/reviews/2026-04-29-finance-charts-lane-a-audit.md`** — per-chart Lane-A guardrails. Verify each Risk Flag in §5 of your implementation matches the audit's per-chart guardrail list.
3. **`docs/reviews/2026-04-27-chart-implementation-blueprint.md`** — code-architect path γ blueprint. §«Build sequence Phase 0 — Schema (no React, no Recharts)» is your scope; §«Lane-A structural constraints — Zod enforcement» is your test contract; §«AI agent integration boundary» is the parser shape.
4. **`docs/design/CHARTS_SPEC.md`** v1.1 — product-designer spec; §5.2 is the canonical Zod schema prose; §5.3 carries example payloads (use these as positive test fixtures); §5.4 is the validation contract surface.
5. **`packages/shared-types/src/index.ts`** — current shape; you will add a re-export from `./charts.js` per blueprint File-level plan.
6. **`packages/shared-types/package.json`** — current exports; you will add `./charts` subpath export entry.
7. **`packages/api-client/src/index.ts`** — current shape; you will add `parseChartEnvelope`.
8. **`packages/api-client/package.json`** — confirm dependency on `@investment-tracker/shared-types` (already there per current state).

If item 1 is missing when you pick this up — STOP and surface to Right-Hand. The ADR is running in parallel right now and MUST be on `main` before you begin.

---

## 5. Scope

### IN scope

- **`packages/shared-types/src/charts.ts`** — new file containing:
  - 7 primitive Zod schemas: `ValueFormat`, `XAxisFormat`, `Currency`, `ChartMeta`, `TimePoint`, `CategoryPoint`, `MultiSeriesPoint`, `ScatterPoint`, `CandlePoint`, `Series`.
  - 11 payload schemas (one per chart kind): `LineChartPayload`, `AreaChartPayload`, `BarChartPayload`, `DonutChartPayload`, `SparklinePayload`, `CalendarPayload`, `TreemapPayload`, `StackedBarChartPayload`, `ScatterChartPayload`, `WaterfallPayload`, `CandlestickChartPayload`.
  - 1 envelope schema: `ChartEnvelope` (discriminated on `payload.kind`, plus optional `schemaVersion: z.string().optional().default('1.0')` per blueprint AI-agent integration boundary).
  - All 11 inferred TypeScript types via `z.infer<...>`.
  - The 3 Lane-A structural guardrails per CHARTS_SPEC §5.2 + finance audit:
    - **Risk Flag 1 (Line + Candlestick — forbidden overlays):** `LineOverlay` is a discriminated union containing only `TradeMarker`. Forbidden types (`support_line`, `resistance_line`, `trend_line`, `channel_band`, `moving_average`, `ema`, `sma`, `bollinger`, `rsi`, `macd`, `atr`, `stochastic`, `adx`, `ichimoku`, `fibonacci`, `pivot_point`, `buy_marker`, `sell_marker`, `signal_annotation`, `recommendation_annotation`, `target_price`, `price_target`, `projected_price`) have no branches. A secondary `.refine()` checks `FORBIDDEN_OVERLAY_TYPES` for future-proofing. `CandlestickChartPayload` schema STRUCTURALLY EXCLUDES every indicator / signal field via `.strict()` mode — extra keys cause `ZodError`.
    - **Risk Flag 2 (Bar + StackedBar — zero-only reference line):** `BarReferenceLine.axis` is `z.literal('zero')`. No `'target'` / `'benchmark'` branches. `BarChartPayload` and `StackedBarChartPayload` use `.strict()` so any unknown key including `targetWeight` causes `ZodError`. The schemas have NO `targetWeight: number` field at all — not optional, not commented out — absent.
    - **Risk Flag 3 (Calendar — V2 eventType gate):** `CalendarEventType` is `z.enum(['dividend', 'corp_action'])`. `'earnings'` and `'news'` are intentionally absent. Any payload with `eventType: 'earnings'` fails validation. Adding these requires a schema version bump and PO sign-off under R1 (paid-data feed).
  - Export of `FORBIDDEN_OVERLAY_TYPES` as a `readonly` tuple so test code can iterate it.
- **`packages/shared-types/package.json`**:
  - Add `./charts` subpath export entry (mirror `./openapi` shape — both `types` and `default` fields per `docs/DECISIONS.md` 2026-04-19 «Design tokens subpath exports require types»).
  - Add `zod` to `dependencies` (production dep — pin per architect ADR; default `^3.23.0`).
- **`packages/shared-types/src/index.ts`** — add `export * from './charts.js';` (or per-named export list if architect ADR requires explicit naming).
- **`packages/api-client/src/index.ts`** — add `parseChartEnvelope(raw: unknown): ParseChartResult` per blueprint AI-agent integration boundary:
  ```typescript
  type ParseChartResult =
    | { ok: true; data: ChartEnvelope }
    | { ok: false; error: ZodError; raw: unknown };
  ```
  Implementation: `ChartEnvelope.safeParse(raw)`; map success / failure to the union shape. **The ONLY place Zod runs for chart payloads in the entire codebase.** Document this in a JSDoc comment on the function.
- **Vitest schema unit tests** — `packages/shared-types/src/charts.test.ts`:
  - Positive: every CHARTS_SPEC §5.3 example payload (one per chart kind, 11 total) parses successfully via `ChartEnvelope.safeParse(...)` with `success: true`.
  - Risk Flag 1: `LineChartPayload` with `overlay: [{ type: 'moving_average', ... }]` → `ZodError`. Same for `'support_line'`, `'resistance_line'`, `'trend_line'`, `'rsi'`, `'macd'`, plus 3 random samples from `FORBIDDEN_OVERLAY_TYPES`.
  - Risk Flag 1 (Candlestick): `CandlestickChartPayload` with extra `movingAverage: [...]` field → `ZodError` (because `.strict()` rejects unknown keys).
  - Risk Flag 2: `BarChartPayload` with `targetWeight: 0.25` → `ZodError`. `BarReferenceLine` with `axis: 'target'` → `ZodError`. Same for `StackedBarChartPayload`.
  - Risk Flag 3: `CalendarPayload` with `eventType: 'earnings'` → `ZodError`. Same for `'news'`.
  - `parseChartEnvelope` happy-path: pass any §5.3 example, assert `.ok === true && .data.kind === expected`.
  - `parseChartEnvelope` failure-path: pass a malformed object, assert `.ok === false`, `.error instanceof ZodError`, `.raw === input`.
- **Documentation**:
  - JSDoc on every exported schema explaining the Lane-A guardrails it carries (so future contributors know NOT to add `targetWeight` / `support_line` / etc. as «improvements»).
  - Header comment in `packages/shared-types/src/charts.ts` linking back to CHARTS_SPEC §5.2 + architect ADR + this kickoff.

### OUT of scope (deferred)

- **Backend Go service writing OpenAPI for `ChartEnvelope`** — chart payloads ride on existing `/positions` / `/portfolio` / `/insights` endpoints (per task brief: «No new API surface yet — chart data shapes consumed from existing endpoints»). The OpenAPI surface for `ChartEnvelope` is a future slice once AI service emits charts; for now, the contract lives only in the TypeScript Zod schema, consumed at the api-client boundary.
- **Python AI service emitting `ChartEnvelope`** — separate backend-engineer dispatch (`SLICE-AI-CHARTS-V1`, post-merge). Python side will mirror the schema in Pydantic v2 once we wire it; in this slice you only define the TS source-of-truth.
- **OpenAPI auto-generated TS client regeneration** — your schema is hand-authored Zod, not OpenAPI-derived. The existing `pnpm api:generate` flow remains unchanged; it does not touch `packages/shared-types/src/charts.ts`.
- **Streaming protocol** — blueprint open-question 1: «does AI agent SSE stream emit `ChartEnvelope` as a single JSON atom after its tool-call completes, or stream JSON incrementally?». Architect ADR may pin this; if not, file a TD (P2) — out of scope for this slice. Recommendation: single-atom after tool-call (per blueprint AI-agent integration boundary section).
- **Frontend chart components** — owned by FE kickoff. You don't write any React.
- **Visual regression / Vitest unit tests for FE components** — owned by QA kickoff.
- **Recharts / Tailwind / CSS work** — owned by FE kickoff.

---

## 6. Implementation plan (file-by-file, in build order)

### Phase 0 — Add Zod dependency

1. From repo root: `pnpm --filter @investment-tracker/shared-types add zod@^3.23.0` (or whatever version the architect ADR pins).
2. Verify it lands in `packages/shared-types/package.json` under `dependencies` (NOT `devDependencies` — runtime production usage at parse time).

### Phase 1 — Author schemas

3. Create `packages/shared-types/src/charts.ts` — implement schemas in this order:
   - Header JSDoc with cross-references.
   - Primitives: `ValueFormat` / `XAxisFormat` / `Currency` / `ChartMeta` / `TimePoint` / `CategoryPoint` / `MultiSeriesPoint` / `ScatterPoint` / `CandlePoint` / `Series`.
   - Lane-A constraint constants: `FORBIDDEN_OVERLAY_TYPES` (readonly tuple) + JSDoc explaining each forbidden type.
   - `LineOverlay` discriminated union (only `TradeMarker` branch + `.refine()` future-proofing).
   - 11 payload schemas with `.strict()` per blueprint Lane-A enforcement summary.
   - `ChartEnvelope` (discriminated on `payload.kind`, optional `schemaVersion`).
   - `z.infer` exports for all 11 payload types + envelope type.

### Phase 2 — Wire exports

4. `packages/shared-types/src/index.ts` — add `export * from './charts.js';`.
5. `packages/shared-types/package.json` — add `./charts` export entry per ADR-2026-04-19 «subpath exports require types»:
   ```json
   "./charts": {
     "types": "./src/charts.ts",
     "default": "./src/charts.ts"
   }
   ```
6. Run `pnpm --filter @investment-tracker/shared-types typecheck` — green.

### Phase 3 — Author parser

7. Edit `packages/api-client/src/index.ts` — add:
   - Import `ChartEnvelope` (the schema, not just the type) and `ZodError` from `zod`.
   - Define `ParseChartResult` as the success-or-failure union.
   - Implement `parseChartEnvelope(raw: unknown): ParseChartResult` using `ChartEnvelope.safeParse(raw)`.
   - JSDoc explaining: «This is the ONLY place Zod runs for chart payloads in the entire codebase. Renderer components consume the parsed `ChartEnvelope` and must NOT re-validate.»
8. Run `pnpm --filter @investment-tracker/api-client typecheck` — green.

### Phase 4 — Tests

9. Create `packages/shared-types/src/charts.test.ts` — implement test groups per §5 IN-scope spec:
   - `describe('positive parses')` — 11 fixtures from CHARTS_SPEC §5.3, all `success === true`.
   - `describe('Risk Flag 1 — forbidden line overlays')` — 8 cases (5 explicit forbidden types + 3 random sample from `FORBIDDEN_OVERLAY_TYPES`).
   - `describe('Risk Flag 1 — Candlestick strict-mode rejections')` — 6 cases (one per indicator field family).
   - `describe('Risk Flag 2 — Bar / StackedBar zero-only reference')` — 4 cases (`targetWeight` field, `axis: 'target'` reference, plus same for stacked bar).
   - `describe('Risk Flag 3 — Calendar V2 event types')` — 2 cases (`'earnings'`, `'news'`).
   - `describe('parseChartEnvelope')` — happy path + failure path.
10. Run `pnpm --filter @investment-tracker/shared-types test` — green. (If `packages/shared-types` does not yet have a test runner configured, add Vitest as devDependency — same scope rule as FE kickoff: this is the only acceptable new dep, MIT-licensed, free.)

### Phase 5 — Acceptance walkthrough

11. `pnpm --filter @investment-tracker/shared-types build` — zero TS errors.
12. `pnpm --filter @investment-tracker/api-client build` — zero TS errors.
13. `pnpm --filter @investment-tracker/web build` — green (FE consumes the new types via shared-types subpath; if FE kickoff hasn't merged yet, this only has to typecheck — actual chart components aren't required to exist).
14. `pnpm --filter @investment-tracker/shared-types test` — all positive + negative cases pass.

---

## 7. Acceptance criteria (testable; every box must be checked or explicitly deferred + rationale)

- [ ] `packages/shared-types/src/charts.ts` exists with all 11 payload schemas + `ChartEnvelope` + 11 inferred types + `FORBIDDEN_OVERLAY_TYPES` constant + `LineOverlay` discriminated union.
- [ ] `packages/shared-types/package.json` exports `./charts` subpath with both `types` and `default` fields per ADR-2026-04-19.
- [ ] `packages/shared-types/src/index.ts` re-exports from `./charts.js`.
- [ ] Zod added to `packages/shared-types/package.json` `dependencies` (NOT `devDependencies`); pinned per architect ADR or `^3.23.0` default.
- [ ] `packages/api-client/src/index.ts` exports `parseChartEnvelope(raw: unknown): ParseChartResult` with documented success / failure shape.
- [ ] `parseChartEnvelope` is the ONLY call to `ChartEnvelope.safeParse` / `ChartEnvelope.parse` in the entire codebase. Verified by `grep -rn "ChartEnvelope.safeParse\|ChartEnvelope.parse" --include="*.ts" --include="*.tsx" .` returning exactly one match (the function body itself).
- [ ] Risk Flag 1 enforced: every entry in `FORBIDDEN_OVERLAY_TYPES` produces `ZodError` when used as `LineOverlay.type`.
- [ ] Risk Flag 1 (Candlestick): `CandlestickChartPayload.parse({ ...valid, movingAverage: [...] })` throws `ZodError` because `.strict()` rejects unknown keys.
- [ ] Risk Flag 2: neither `BarChartPayload` nor `StackedBarChartPayload` has a `targetWeight` field. `BarReferenceLine.axis` is `z.literal('zero')` only.
- [ ] Risk Flag 3: `CalendarEventType` is `z.enum(['dividend', 'corp_action'])` only. `'earnings'` and `'news'` produce `ZodError`.
- [ ] All 11 example payloads from CHARTS_SPEC §5.3 parse successfully.
- [ ] `parseChartEnvelope({ kind: 'definitely-not-a-chart' })` returns `{ ok: false, error, raw }` — does NOT throw.
- [ ] Vitest test file `packages/shared-types/src/charts.test.ts` covers all six describe groups from §6 Phase 4. All tests green.
- [ ] CI green on PR (8 jobs).
- [ ] PR description includes:
  - Schema overview (one paragraph per payload kind);
  - Lane-A guardrail enforcement table (3 Risk Flags × what's structural vs what's `.refine()`);
  - Test fixture inventory (where each §5.3 example is sourced);
  - List of TDs added.
- [ ] **DO NOT MERGE** until architect ADR (`docs/reviews/2026-04-29-architect-chart-data-shape-adr.md`) is on `main`. Right-Hand merges that into `chore` integration first; you rebase off the chore branch before opening your PR.

---

## 8. Verification commands (exact — run before claiming done)

```bash
# Phase 0 — architect ADR present
test -f docs/reviews/2026-04-29-architect-chart-data-shape-adr.md || echo "FAIL: ADR not landed"

# Phase 1–3 — package builds
pnpm --filter @investment-tracker/shared-types typecheck
pnpm --filter @investment-tracker/api-client typecheck
pnpm --filter @investment-tracker/shared-types build
pnpm --filter @investment-tracker/api-client build

# Phase 4 — tests
pnpm --filter @investment-tracker/shared-types test --run

# Phase 5 — single-parser invariant (must return exactly one match)
grep -rn "ChartEnvelope.safeParse\|ChartEnvelope.parse" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules .
# Expected: 1 line, in packages/api-client/src/index.ts

# Bundle smoke
pnpm --filter @investment-tracker/web typecheck
pnpm --filter @investment-tracker/web build
```

---

## 9. Cross-team flags

- **Architect ADR is your blocking upstream.** Without it on `main`, the schema-package location (`packages/shared-types` vs `packages/charts-contract`), the envelope shape, and the `schemaVersion` decision are unresolved. STOP and surface to Right-Hand if absent.
- **Finance audit is read-also.** The 3 Risk Flags are defined in CHARTS_SPEC §5.2; the audit may add per-chart refinements (e.g. mandatory `meta.caption` field on Waterfall, `meta.disclaimer` on Calendar). If the audit adds schema-level requirements not in the spec, IMPLEMENT THOSE TOO and cite the audit line in JSDoc.
- **FE kickoff (`SLICE-CHARTS-FE-V1`)** is your downstream. FE imports types from `@investment-tracker/shared-types/charts`. They cannot start until your PR merges. **Coordinate merge order with Right-Hand: backend lands first, then FE rebases.**
- **QA kickoff (`SLICE-CHARTS-QA-V1`)** is your sibling. QA writes additional contract tests on the boundary you define. They consume the same schemas via the same subpath.
- **OpenAPI spec sync** — chart payloads are NOT yet in `tools/openapi/openapi.yaml`. They ride on existing endpoints; AI agent emits them as part of an existing response shape. If you add new endpoints by accident, that's scope creep; surface to Right-Hand. The contract-k6-spec-sync CI job should remain green because no OpenAPI surface changes.

---

## 10. Open questions for tech-lead / Right-Hand (max 2)

1. **Schema package location** — architect ADR pins this. If ADR is silent: blueprint default is `packages/shared-types/src/charts.ts` (rationale: backend Python service also imports from shared-types in the future; one source of truth). If you read the ADR and find an alternative recommendation (e.g. new `packages/charts-contract`), follow ADR and surface the deviation in PR description.
2. **`schemaVersion` field on `ChartEnvelope`** — blueprint open-question 2 + recommended default `'1.0'`. If architect ADR is silent, ADD it with `z.string().optional().default('1.0')` and file a TD (P2) requesting backend confirmation. If ADR pins it differently, follow ADR.

---

## 11. Commit structure (two commits, in order)

**Commit 1 — implementation:**

```
feat(shared-types): chart payload schemas with Lane-A structural guardrails

- packages/shared-types/src/charts.ts: 11 Zod payload schemas + ChartEnvelope
- 3 Lane-A Risk Flags baked structurally (CHARTS_SPEC §5.2):
  - Risk Flag 1: LineOverlay discriminated union excludes 23 forbidden TA
    indicator/signal types; CandlestickChartPayload .strict() rejects all
    indicator/MA/RSI/MACD/Bollinger fields by absence
  - Risk Flag 2: BarChartPayload + StackedBarChartPayload have no
    targetWeight field; BarReferenceLine.axis = z.literal('zero') only
  - Risk Flag 3: CalendarEventType = z.enum(['dividend', 'corp_action']) only;
    'earnings' / 'news' rejected pending V2 paid-data PO greenlight (R1)
- packages/shared-types/package.json: ./charts subpath export + zod^3.23.0 dep
- packages/shared-types/src/index.ts: re-export from ./charts.js
- packages/api-client/src/index.ts: parseChartEnvelope(raw) — sole Zod
  parsing entry point per blueprint AI-agent integration boundary
- charts.test.ts: 11 positive parses + Risk Flag rejection suites + parser
  happy/failure path

Implements code-architect blueprint γ Phase 0 (Schema, no React, no Recharts).
Per docs/engineering/kickoffs/2026-04-29-charts-backend.md.
```

**Commit 2 — docs:**

```
docs: close SLICE-CHARTS-BACKEND-V1

- Add TD entries for out-of-scope findings
- Update docs/merge-log.md with slice SHA + outcome
- Update docs/TECH_DEBT.md
```

PO will land any further `docs/PO_HANDOFF.md` updates separately per «CC post-merge docs scope» rule.

---

## 12. Pre-flight checks (run before writing any code)

1. `git status` clean; on a fresh branch off the latest `chore` integration that has architect ADR merged.
2. `git checkout -b feat/charts-backend-v1`.
3. `test -f docs/reviews/2026-04-29-architect-chart-data-shape-adr.md` — exists.
4. `test -f docs/reviews/2026-04-29-finance-charts-lane-a-audit.md` — exists.
5. `pnpm install` clean.
6. Baselines:
   - `pnpm --filter @investment-tracker/shared-types typecheck` — green.
   - `pnpm --filter @investment-tracker/api-client typecheck` — green.
7. Confirm Zod is not already in `packages/shared-types/package.json` (it shouldn't be; the api-client uses `openapi-fetch` which doesn't pull Zod).

---

## 13. Report format (when slice is done — before opening PR)

Reply to Right-Hand with:

1. `git log --oneline -3` of your branch.
2. Acceptance criteria checklist (§7) — every box checked or explicitly marked deferred + rationale.
3. TDs added (TD-NNN — title — priority — trigger).
4. Surprise findings (specifically: did `.strict()` mode work as expected on Recharts-target payloads? did the architect ADR diverge from blueprint defaults? any Zod version pin friction?).
5. Single-parser invariant grep output (must show exactly 1 match).
6. CI status (link to GitHub Actions run).
7. PR URL once opened.

If anything blocked you for > 30 minutes — say so; do not silently work around it.

---

## 14. Definition of done

- PR opened, CI green, all §7 acceptance criteria checked.
- Architect ADR merged into `main` BEFORE this PR.
- Code-Reviewer dispatch requested (post-merge safety net).
- `docs/merge-log.md` + `docs/TECH_DEBT.md` updated in commit 2.
- FE kickoff (`SLICE-CHARTS-FE-V1`) builder confirms schema is consumable via `import type { LineChartPayload } from '@investment-tracker/shared-types/charts'`.
- Right-Hand will close the slice in `docs/PO_HANDOFF.md` after PO sign-off.

---

## 15. Relationship to parent migration kickoff

Same as FE kickoff: `docs/engineering/kickoffs/2026-04-27-design-system-migration.md` (SLICE-DSM-V1) §9 marks charts as out-of-scope. This kickoff is the schema-half of the chart-only carve-out. SLICE-DSM-V1 stays the parent for tokens / primitives / Geist / theme wiring.
