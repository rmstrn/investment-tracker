# Pre-QA self-review — SLICE-CHARTS-BACKEND-V1

**Date:** 2026-04-29
**Reviewer:** backend-engineer (cold-read self-review pass)
**Branch:** `chore/plugin-architecture-2026-04-29`
**Implementation SHA reviewed:** `820ea86` per merge-log entry
**Kickoff:** `docs/engineering/kickoffs/2026-04-29-charts-backend.md`
**Sister contracts:** architect ADR `2026-04-29-architect-chart-data-shape-adr.md`; finance audit `2026-04-29-finance-charts-lane-a-audit.md`
**Mode:** read-only review (no code changes); independent of plugin TS reviewer pass

---

## Verdict

**APPROVE-WITH-NITS.** Implementation honors every §7 acceptance box and every architect/finance delta on inspection. Tests pass 57/57. Single-parser invariant holds. Lane-A risk flags are structurally enforced. No CRITICAL or HIGH findings. Five MEDIUM/LOW notes recorded for visibility, none of them merge-blocking.

---

## §7 acceptance criteria — line-by-line

| # | Criterion | Status | Cite |
|---|-----------|--------|------|
| 1 | `charts.ts` exists with all 11 payload schemas + `MetaFinancialAggregate` mixin (Δ1) + `ChartEnvelope` 10-member MVP union (Scatter excluded Δ3, defined for V2) + 11 inferred types + `FORBIDDEN_OVERLAY_TYPES` + `LineOverlay` discriminated union | PASS | `packages/shared-types/src/charts.ts:141` (mixin), `:173` (forbidden tuple), `:223` (LineOverlay), `:250` (Line), `:277` (Area), `:302` (Bar), `:334` (StackedBar), `:376` (Donut), `:407` (Sparkline), `:426` (Scatter — defined), `:467` (Candlestick), `:535` (Calendar), `:579` (Treemap), `:640` (Waterfall), `:665–676` (10-member union, Scatter absent), `:780` (envelope) |
| 2 | `MetaFinancialAggregate` applied to Donut + Treemap + StackedBar with sum-to-total `.refine()` | PASS | Donut `:386` `ChartMeta.merge(MetaFinancialAggregate)` + envelope-level `.superRefine` `:697`; Treemap `:582` + `:709`; StackedBar `rowAggregates` `:364` extends mixin shape + `:721` per-row refinement. One mixin, three reuses, identical tolerance helper `isWithinTolerance` at `:155`. |
| 3 | Waterfall conservation `.refine()` produces issue with `params.code === 'WATERFALL_CONSERVATION_VIOLATION'`; tolerance $1.00 absolute (Δ2); block-merge severity | PASS | `:620` `WATERFALL_CONSERVATION_TOLERANCE = 1.0`; `:627` exported error code constant; `:760–767` `addIssue` with `params: { code: WATERFALL_CONSERVATION_VIOLATION }` and tolerance check `Math.abs(computedEnd - endValue) > 1.0`. Test `charts.test.ts:622` asserts `params.code` equals constant. |
| 4 | `ChartPayload` MVP union has 10 members; `ScatterChartPayload` defined-but-not-unioned; `parseChartEnvelope({ kind: 'scatter' })` fails parse | PASS | Union enumeration at `:665–676` lists exactly 10 members; Scatter schema retained at `:426`. Test `charts.test.ts:687` group asserts standalone schema parses, `ChartPayload` rejects `kind: 'scatter'`, envelope rejects too. |
| 5 | `TreemapPayload` requires `dailyChangeBasis: z.enum(['local', 'base'])`; payload omitting fails parse; both values parse | PASS | `:590` required no-default field. Tests `charts.test.ts:706–738` cover both happy values, omission, and two invalid string variants. |
| 6 | `package.json` exports `./charts` subpath with both `types` and `default` fields | PASS | `packages/shared-types/package.json:18–21` |
| 7 | `index.ts` re-exports from `./charts.js` | PASS | `packages/shared-types/src/index.ts:26` |
| 8 | Zod added to `dependencies` (NOT devDependencies); `^3.23.0` | PASS | `packages/shared-types/package.json:39–41` runtime `dependencies.zod = "^3.23.0"` |
| 9 | `parseChartEnvelope(raw): ParseChartResult` exported with documented success/failure shape | PASS | `packages/api-client/src/index.ts:107–137`; ParseChartResult discriminated union at `:107`; JSDoc explicitly calls function the SOLE entry point. |
| 10 | `parseChartEnvelope` is the ONLY production-code call to `ChartEnvelope.safeParse` / `ChartEnvelope.parse` | PASS | `grep ... --exclude="*.test.ts"` returns exactly 1 match: `packages/api-client/src/index.ts:132`. Test files contain expected fixture hits; spec carve-out matches kickoff §8. |
| 11 | Risk Flag 1: every `FORBIDDEN_OVERLAY_TYPES` entry produces `ZodError` as `LineOverlay.type` | PASS | `:173–197` 23-entry tuple. `LineOverlay` `:223` is `z.discriminatedUnion('type', [TradeMarker])` with `.refine` belt-and-suspenders. Tests `charts.test.ts:395` cover 6 explicit + 3 sampled forbidden types. The discriminator-mismatch alone rejects all 23 (refine is defensive). |
| 12 | Risk Flag 1 (Candlestick): `.parse({ ...valid, movingAverage: [...] })` throws `ZodError` because `.strict()` rejects unknown keys | PASS | `:467–476` `.strict()` on root + `.strict()` on nested xAxis/yAxis. Tests `charts.test.ts:448` cover 6 intrusion shapes (`movingAverage`, `rsi`, `macd`, `bollinger`, `signalAnnotation`, `trendLine`). |
| 13 | Risk Flag 2: neither Bar nor StackedBar has `targetWeight`; `BarReferenceLine.axis = z.literal('zero')` only | PASS | Bar schema `:302–320` no targetWeight, `.strict()`; StackedBar `:334–368` no targetWeight, `.strict()`; `BarReferenceLine.axis` `:242` is `z.literal('zero')`. Tests `charts.test.ts:469` confirm rejection of `targetWeight` and non-zero axis on both kinds. |
| 14 | Risk Flag 3: `CalendarEventType = z.enum(['dividend', 'corp_action'])`; `'earnings'` and `'news'` produce `ZodError` | PASS | `:488` enum is exactly two values. `CalendarEvent` is `z.discriminatedUnion('eventType', [DividendEvent, CorpActionEvent])` `:532`; `eventType` literals on each event schema (`:494`, `:512`) are `dividend` / `corp_action`. Tests `charts.test.ts:503` reject earnings + news. |
| 15 | All 11 §5.3 example payloads parse successfully | PASS-WITH-NUANCE | 10 §5.3 fixtures parsed via envelope (Scatter is V2-deferred per Δ3 so it is parsed standalone, not via envelope). Test `charts.test.ts:371` covers 10 envelope kinds; Scatter is exercised separately at `:687` via `ScatterChartPayload.safeParse`. This matches Δ3 intent. |
| 16 | `parseChartEnvelope({ kind: 'definitely-not-a-chart' })` returns `{ ok: false, error, raw }`, does NOT throw | PASS | Test `charts.test.ts:760` asserts envelope rejects unknown discriminator; `parseChartEnvelope` body `:131–137` uses `safeParse` (no throw) and returns the discriminated union. |
| 17 | Vitest `charts.test.ts` covers all six describe groups (positives + 3 risk flags + Δ1 + Δ2 + parser); all green | PASS | 10 describe groups present (positives, RF1 line, RF1 candlestick, RF2 bar/stacked, RF3 calendar, Δ1 mixin, Δ2 waterfall, Δ3 union exclusion, T-8 basis, envelope edge cases). 57/57 pass — confirmed by `pnpm --filter @investment-tracker/shared-types test` run during this review. |
| 18 | CI green on PR (8 jobs) | DEFERRED-TO-CI | Local checks all green: `typecheck` (shared-types + api-client + web), `build` (shared-types + api-client + web), `test` 57/57. PR CI verification is the integration step — out of scope for this self-review. |
| 19 | PR description includes schema overview + Lane-A guardrail table + fixture inventory + TDs added | DEFERRED-TO-PR-OPEN | Merge-log entry at `docs/merge-log.md:30` documents these inline; the consolidated PR opens against chore branch per kickoff §7 final box. |
| 20 | DO NOT MERGE until architect ADR is on `main` | OBSERVATION | Both ADR and audit live in `docs/reviews/`. Per merge-log line 32, this slice currently sits on `chore/plugin-architecture-2026-04-29`, not `main`. Ordering responsibility belongs to Right-Hand integration; structurally the implementation is ready. |

**Score: 17 PASS / 1 PASS-WITH-NUANCE / 2 DEFERRED-OUT-OF-REVIEW-SCOPE / 0 PARTIAL / 0 FAIL.**

The PASS-WITH-NUANCE on box 15 is a literal-reading nuance, not a defect — Δ3 intentionally removed Scatter from MVP envelope union, so the «11 §5.3 examples parse via envelope» phrasing is mathematically impossible post-Δ3. The implementation handles this exactly as Δ3 specifies. Boxes 18 and 19 cannot be evaluated in a read-only self-review.

---

## §8 verification commands — re-run results

| Command | Result |
|---------|--------|
| `test -f docs/reviews/2026-04-29-architect-chart-data-shape-adr.md` | PASS — file exists |
| `pnpm --filter @investment-tracker/shared-types typecheck` | PASS — `tsc --noEmit` clean |
| `pnpm --filter @investment-tracker/api-client typecheck` | PASS — clean |
| `pnpm --filter @investment-tracker/shared-types build` | PASS — clean |
| `pnpm --filter @investment-tracker/api-client build` | PASS — clean |
| `pnpm --filter @investment-tracker/shared-types test` | PASS — 57/57 in 17ms (Vitest 2.1.9) |
| `grep -rn "ChartEnvelope.safeParse\|ChartEnvelope.parse" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude="*.test.ts" .` | PASS — exactly 1 match: `./packages/api-client/src/index.ts:132` |
| `pnpm --filter @investment-tracker/web typecheck` | PASS — clean |
| `pnpm --filter @investment-tracker/web build` | PASS — Next.js production build succeeded |

All 9 verification commands green. No deviations from kickoff §8 expected output.

---

## Delta-by-delta correctness audit

### Δ1 — `MetaFinancialAggregate` mixin (architect)

- **Mixin defined once.** `charts.ts:141–148` — one canonical `z.object({ reportedTotal, reportedTotalCurrency, toleranceMode, toleranceValue }).strict()`.
- **Reused on three payloads.**
  - Donut: `:386` `meta: ChartMeta.merge(MetaFinancialAggregate)`.
  - Treemap: `:582` `meta: ChartMeta.merge(MetaFinancialAggregate)`.
  - StackedBar: `:364` per-row `rowAggregates` array uses `.extend(MetaFinancialAggregate.shape)`.
- **Tolerance check shared via single helper.** `isWithinTolerance` at `:155–159` handles both `absolute` and `relative` tolerance modes.
- **Cross-field validation relocated to envelope-level `superRefine`.** Comment at `:679–694` explains the surface finding: Zod `discriminatedUnion` requires plain `ZodObject` members, so `superRefine` cannot live on individual payloads. Refinements run at `ChartEnvelope.superRefine` (`:780–790`) which calls `validateCrossFieldInvariants` (`:695`) and dispatches per `payload.kind`. **Same enforcement guarantee preserved** — every successful `ChartEnvelope.safeParse` runs the cross-field gate; any standalone `DonutChartPayload.safeParse` (test path only) does not, but this is acceptable because the api-client trust boundary always uses the envelope. Tests at `charts.test.ts:543–611` verify the gate fires for all three kinds.

**Status: Δ1 fully implemented. Architectural choice (envelope-level `superRefine` vs per-schema) is documented and correct.**

### Δ2 — Waterfall conservation block-merge invariant

- **Tolerance: $1.00 absolute.** Constant at `:620` `WATERFALL_CONSERVATION_TOLERANCE = 1.0`. Comparison at `:760` is strict `>` so $1.00 exactly passes; tests `charts.test.ts:660` (`$1.00 off passes`) and `:669` (`$1.01 off fails`) confirm boundary behavior.
- **Distinct error code.** `:627` `WATERFALL_CONSERVATION_VIOLATION = 'WATERFALL_CONSERVATION_VIOLATION'` exported constant. Issue produced via `z.ZodIssueCode.custom` with `params: { code: WATERFALL_CONSERVATION_VIOLATION }` (`:765`). Monitoring can grep params.code.
- **Anchor steps excluded from delta sum.** `:756–758` filter `componentType !== 'start' && componentType !== 'end'` before summing. Test `charts.test.ts:617` canonical fixture has start/end as anchors with `deltaAbs` set to absolute values for renderer convenience; the conservation check ignores them.
- **Fixture coverage.** Tests cover canonical (parses), $5 off (fails + asserts code), $5000 off (fails), fees-sign reversed (fails + asserts code), $1.00 boundary (passes), $1.01 boundary (fails + asserts code). 6 fixtures total — adequate for kickoff §6 spec. Missing-anchor / signs-reversed-on-deposits are not exercised explicitly; the kickoff lists them as «intentionally-broken variants» but the QA kickoff owns the canonical broken-fixture suite (per kickoff §5 Δ2 line 107). Acceptable handoff.

**Status: Δ2 fully implemented with distinct error code and tolerance boundary.**

### Δ3 — Scatter excluded from MVP union

- **Schema retained.** `ScatterChartPayload` at `:426–457` is fully defined and exported.
- **Type retained for V2 import-readiness.** `:458` `export type ScatterChartPayload = z.infer<typeof ScatterChartPayload>`.
- **Union excludes it.** `ChartPayload` at `:665–676` lists 10 members; Scatter is not present.
- **Parser fails for kind:'scatter' envelope.** Test `charts.test.ts:687–701` group asserts: standalone `ScatterChartPayload.safeParse(scatter)` succeeds (V2 readiness); `ChartPayload.safeParse(scatter)` fails (discriminator mismatch); `ChartEnvelope.safeParse(envelope(scatter))` fails (envelope wraps the union).

**Status: Δ3 fully implemented exactly as architect ADR §«Δ3» specified.**

### Δ4 — Documentation of Zod-canonical / Pydantic-generated source-of-truth

- **File header JSDoc.** `charts.ts:1–33` documents:
  - File is canonical; Pydantic models in `apps/ai/` are GENERATED.
  - Cross-field invariants live ONLY in Zod (`Δ2 conservation`, `Δ1 sum-to-total`).
  - Structural exclusions (Risk Flags 1/2/3) are mirrored in both runtimes.
  - Future contributors warning against re-adding `targetWeight` / TA overlays.
- **TD-091 captures the Pydantic mirror generation backlog item** (`docs/TECH_DEBT.md:56`).

**Status: Δ4 documentation present and accurate.**

### T-8 — Cross-currency basis discriminator

- `:590` `dailyChangeBasis: z.enum(['local', 'base'])` — required, no default.
- Test coverage `charts.test.ts:706–738`: both values parse; omission fails; `'mixed'` and `'usd'` fail.

**Status: T-8 fully implemented as per finance audit §9 Δc.**

### Lane-A Risk Flags 1/2/3 (kickoff §5)

- **Risk Flag 1 (Line):** `LineOverlay` discriminated union has only `TradeMarker` branch (`:223–227`). 23 forbidden literals enumerated at `:173–197`. Belt-and-suspenders `.refine` rejects forbidden discriminants even if a future contributor adds them. Tests `charts.test.ts:395`.
- **Risk Flag 1 (Candlestick):** `CandlestickChartPayload` is `.strict()` at `:467` and excludes every indicator field by absence. Tests `charts.test.ts:448` cover 6 intrusion shapes.
- **Risk Flag 2:** `BarReferenceLine.axis = z.literal('zero')` at `:242`; both Bar and StackedBar are `.strict()` (`:320`, `:368`); neither has `targetWeight`. Tests `charts.test.ts:469`.
- **Risk Flag 3:** `CalendarEventType = z.enum(['dividend', 'corp_action'])` at `:488`. Tests `charts.test.ts:503` reject `earnings` and `news`.

**Status: All three Risk Flags structurally enforced.**

### Single-parser invariant

`grep -rn "ChartEnvelope.safeParse|ChartEnvelope.parse" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude="*.test.ts"` returns exactly **1 match: `./packages/api-client/src/index.ts:132`**. Kickoff §7 box 10 satisfied.

### TDs filed (TD-091 / TD-092 / TD-093)

- `TD-091` — Pydantic mirror generation for `apps/ai/`. P3. Trigger: `SLICE-AI-CHARTS-V1` start. (`docs/TECH_DEBT.md:56`)
- `TD-092` — Re-activate scatter `referenceLines.label` vocabulary regex on V2 re-introduction. P3. Trigger: V2 PO greenlight + legal-advisor sign-off. (`docs/TECH_DEBT.md:47`)
- `TD-093` — Pin AI-agent SSE chart-emission streaming protocol. P2. Trigger: `SLICE-AI-CHARTS-V1`. (`docs/TECH_DEBT.md:37`)

All three TDs accurate, gated correctly, and linked to the right downstream slice triggers.

---

## Findings (grouped by severity)

### CRITICAL
None.

### HIGH
None.

### MEDIUM

**M-1 — TD-091 numbering: live entry shares an ID with a historical resolved-and-renamed entry.**
The new TD-091 (`docs/TECH_DEBT.md:56`) is the live chart-related entry. The historical TD-091 was renamed to `TD-R091` at `:654` («Resolved» tag), which is the correct migration. However, the body of the TD-R091 entry at `:659` and `:661` still cites the original commit message `(TD-091)` literally, which is an unavoidable historical record. **Net effect:** searching `TD-091` in the doc returns three hits — one live heading + two historical commit-message quotes. Not a bug; just a grep-noise risk. **Recommendation:** consider a one-line clarifier note under TD-R091 («Note: ID was renamed to TD-R091; the active TD-091 at line 56 is unrelated to this Go-side issue»). LOW-priority polish — does not block merge.

**M-2 — Per-schema `superRefine` was not feasible due to discriminated-union constraint; cross-field gate lives at envelope level.**
File comment at `charts.ts:679–694` explains this clearly. The trade-off: a caller who invokes `DonutChartPayload.safeParse(...)` directly bypasses the sum-to-total check. **Mitigation:** the single-parser invariant ensures production code only calls `ChartEnvelope.safeParse` (via `parseChartEnvelope`); standalone schema parses are only allowed in tests. **Recommendation:** consider exporting a deprecation-style JSDoc warning on per-payload schemas pointing callers toward `parseChartEnvelope` for cross-field guarantees. Optional — current single-parser CI gate already enforces the right path.

### LOW

**L-1 — Re-export of subpath via `index.ts`.**
`packages/shared-types/src/index.ts:26` does `export * from './charts.js'` — correct and consistent with kickoff §6 Phase 2. No issue.

**L-2 — `Currency` regex enforces uppercase only.**
`charts.ts:54` `z.string().regex(/^[A-Z]{3}$/)`. The agent emitting lowercase `'usd'` would fail parse with a generic-looking ZodError. Acceptable for a strict contract; the failure surface is the AI agent prompt-engineering layer, not the schema. No change needed.

**L-3 — `MultiSeriesPoint` cannot use `.strict()`.**
Documented at `charts.ts:85–94` — `catchall(z.number())` is required because series keys are agent-defined. The schema author flagged this explicitly. No issue.

**L-4 — Test fixture for waterfall has correct math but extends spec example by $4,000.**
Comment at `charts.test.ts:238–243` explicitly notes that the canonical `realized: 8200` differs from the published spec example (which is off by $4,000 per finance W-1) and that PD owns the spec repair. Correct handling — the implementation lives by the conservation invariant, not by the broken spec example. PD repair lives in TD-territory but is owned by PD, not by this slice. No action required from backend.

---

## Recommendation

**APPROVE-WITH-NITS.**

- All CRITICAL gates (waterfall conservation, single-parser invariant, Risk Flags 1/2/3, Scatter exclusion, T-8 basis) are structurally enforced and tested.
- All architect deltas (Δ1 / Δ2 / Δ3 / Δ4) are honored.
- Tests 57/57 PASS; typecheck and build green across shared-types / api-client / web.
- TDs 091 / 092 / 093 are correctly filed and gated.
- Two MEDIUM-tagged findings (M-1 numbering grep-noise, M-2 envelope-level cross-field placement explanation) are documentation-only polish and do not block merge.
- Three LOW notes are observational, not actionable.

Slice ready to merge to `main` once architect ADR commit is on `main` (per kickoff §7 final box) and CI is green on the consolidated PR.
