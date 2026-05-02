# Charts Pre-QA Review Aggregate — 2026-04-29

**Branch:** `chore/plugin-architecture-2026-04-29` @ `407e9c0`
**Slices reviewed:** SLICE-CHARTS-BACKEND-V1 (`820ea86`+`2c23f5e`) + SLICE-CHARTS-FE-V1 (`18f7a97`+`407e9c0`)
**Reviewers dispatched:** 6 plugin (TS / a11y / security / finance / legal / architect) + 4 project (backend self / FE self / tech-lead / architect)
**Aggregator:** Right-Hand
**Date:** 2026-04-29

---

## Aggregate verdict — **FIX-BEFORE-QA**

3 of 10 reviewers returned `FIX-BEFORE-MERGE` (a11y plugin, TS plugin, FE self). Remaining 7 returned APPROVE-WITH-NITS or PROCEED-TO-QA. Aggregating: **2 CRITICAL + 3 HIGH-correctness + 2 HIGH-PR-mechanics block QA dispatch**. Multiple MEDIUM findings file as TDs.

---

## Per-reviewer scorecard

| Reviewer | Verdict | C | H | M | L |
|---|---|---|---|---|---|
| Security (plugin) | APPROVE-W-NITS | 0 | 0 | 4 | 2 |
| Finance (plugin) | APPROVE-W-NITS | 0* | 0 | 2 | 0 |
| Architect (plugin) | APPROVE-W-NITS | 0 | 0 | 0 | 1 |
| Architect (project) | APPROVE-W-NITS | 0 | 0 | 1 | 2 |
| Legal (plugin) | APPROVE-W-NITS | 0 | 0 | 3 | 4 |
| **A11y (plugin)** | **FIX-BEFORE-MERGE** | **2** | **6** | 6 | 4 |
| **TS (plugin)** | **FIX-BEFORE-MERGE** | 0 | **2** | 4 | 2 |
| Backend self | APPROVE-W-NITS | 0 | 0 | 2 | 4 |
| **FE self** | **FIX-BEFORE-MERGE** | 0 | **1** | 3 | 3 |
| Tech-lead | PROCEED-TO-QA | 0 | 2† | 1 | 0 |

\* Finance: 2 original-audit CRITICALs **mitigated** in implementation; 2 new MEDIUMs introduced.
† Tech-lead HIGH items are PR-mechanics (rebase, PENDING_CLEANUPS), not contract bugs.

---

## BLOCKERS — must fix before QA dispatch

### CRITICAL — a11y

**CRIT-1 (all 10 chart components) — focus-ring suppression.**
- `style={{ outline: 'none' }}` on every chart container while `tabIndex={0}` is set.
- Direct WCAG 2.4.7 (Focus Visible) + 2.4.11 (Focus Not Obscured) fail at AA.
- No `:focus-visible` replacement wired.
- AT users land in a silent dead-zone.
- CHARTS_SPEC §3.8 mandates `outline: 2px solid var(--accent)`.
- **Fix:** Replace `outline: none` with `:focus-visible` ring on all 10 components.

**CRIT-2 (all 10 chart components) — keyboard navigation non-functional.**
- `useChartKeyboardNav` hook defined at `packages/ui/src/charts/_shared/useChartKeyboardNav.ts:13`, exported, but **never imported by any chart component**.
- Charts have `tabIndex={0}` (focus lands) but no `onKeyDown` handler anywhere.
- Arrow-keys / Esc / Home / End do nothing.
- Kickoff §7 acceptance — «arrow-keys cycle data points; Esc blurs» — claimed PASS, actually FAIL.
- **Confirmed by both a11y plugin reviewer AND FE self-review.**
- **Fix:** Wire the hook into all 10 components (~30 min, per FE self-estimate).

### HIGH-correctness — type/schema

**TS H-1 — `ChartMeta.merge(MetaFinancialAggregate)` silently drops `.strict()`.**
- `packages/shared-types/src/charts.ts:386` (Donut) and `:582` (Treemap).
- Zod `.merge()` produces a new ZodObject with `strip` (not `strict`) unknown-key behavior.
- **Confirmed via runtime test in TS reviewer's session** — extra keys on `DonutChartPayload.meta` and `TreemapPayload.meta` parse without error.
- Lane-A `.strict()` enforcement is weakened in two places.
- **Fix:** Append `.strict()` to both merge calls.

**TS H-2 — schema barrel re-exports Zod schema values.**
- `packages/shared-types/src/index.ts:26` — `export * from './charts.js'`.
- Re-exports Zod schema *values* from the root barrel.
- Any consumer can call `.safeParse()` directly on `ChartEnvelope`, bypassing the `parseChartEnvelope` single-parser invariant declared in architect ADR Δ4.
- **Fix:** Change to `export type * from './charts.js'` — types remain available; runtime schemas don't escape.

**A11y H-1 — Treemap text contrast fail.**
- `packages/ui/src/charts/Treemap.tsx:54-78` renders 10-11px white text over `var(--chart-series-2)` (#A04A3D light, ~3.99:1) and `var(--chart-series-5)` neutral (#67756F light, ~3.81:1).
- Both fail WCAG 1.4.3 AA body 4.5:1.
- When `dailyChangePct` is absent, every tile falls through to neutral → wholly non-compliant treemap.
- **Fix:** Either darker text colour, larger font, or palette adjustment.

### HIGH — PR mechanics (tech-lead)

**HIGH-MECH-1 — Rebase `chore` against `origin/main`.**
- Today's dependabot merges (#79 gomod-minor + #80 npm-minor) sit on main.
- 3 package.json files + `pnpm-lock.yaml` will collide on PR open.
- Verify `lucide-react ^0.577.0` doesn't break chart icon imports.
- Re-run shared-types 57/57, ui 17/17, web 69/69 after rebase.

**HIGH-MECH-2 — PENDING_CLEANUPS item 13.**
- 5 `.claude/` agent-file deltas live local-only (gitignored).
- Track as PENDING_CLEANUPS #13.

---

## NOTABLE MEDIUMs (file as TDs, not blockers)

### Security (3)
- **M1** `apps/web/src/components/positions/position-price-chart.tsx:87` — `as unknown as` cast around `MultiSeriesPoint.catchall(z.number())`. Runtime-safe (parser still gates) but foot-gun.
- **M2** Same file constructs `AreaChartPayload` literal directly, NOT round-tripped through `parseChartEnvelope`. Current data source is typed price-history (not AI-emitted) → Lane-A intact, but structurally outside trust boundary.
- **M3** `ChartError` `?debug=1` gate ungated by hostname / frame-ancestor — iframe parent could force-enable debug.

### Legal (3)
- **M-1** No page-level «information only, not investment advice» disclaimer on showcase. OK for `/design`, mandatory pre-launch (SEC publisher-exclusion + MiFID II).
- **M-2** `?debug=1` payload reveal at `ChartError.tsx:42-50` leaks PII (`brokerSource`, position values) in production. GDPR Art. 5(1)(c) + 32. Move to staff-auth + field-redaction before user-facing routes.
- **M-3** No AI-prose vocabulary regex on `meta.title` / `meta.subtitle` / `meta.alt` / `CalendarEvent.description`. SOLE prose-drift gate per Δ4. Belongs at api-client trust boundary, not this slice — track as next-slice acceptance criterion.

### Finance (2 new)
- **N1** Same as Legal M-3 (AI-prose vocabulary regex absent at renderer).
- **T-1 partial** Staleness banner — schema requires `asOf` but no time-comparison gate yet. Tractable.

### Architect — project (1)
- **M** Single-parser invariant enforced by social contract, not CI gate. Production count = 1 today; no `grep ChartEnvelope.safeParse` CI guard wired. **Recommend TD: wire CI guard before MVP.**

### TS plugin (4)
- **M-1** `validateCrossFieldInvariants` cognitive complexity 26 (Biome limit 15). Most critical correctness gate; difficult to audit as one function. Extract per-invariant helpers post-merge.
- (3 other M items — see plugin TS report)

### FE self (3)
- **M1** Drift-bar caption trigger uses `meta.subtitle.includes('drift')` substring sniff instead of kickoff-promised `payload.subtype === 'drift'`. `BarChartPayload` schema has no `subtype` field. Brittle to locale, false-positive prone. **Schema-bump or accept-as-TD.**
- **M3** Series-7 dark-warn uses `window.location.hostname === 'localhost'` instead of `NODE_ENV` (no @types/node in package). Staging telemetry blind-spot.

### Backend self (2)
- **M-1** TD-091 grep returns 3 hits (cosmetic — historical commit-message quotes).
- **M-2** Cross-field `superRefine` envelope relocation (acknowledged + documented inline at `charts.ts:679-694`).

### Architect plugin (0 MED), Architect project (LOWs)
- **LOW-1** `CHART_KINDS` tuple in `types.ts` hand-maintained; no compile-time `Expect<Equal<>>` assertion vs `ChartPayload['kind']`. Drift-detection one-liner recommended.
- **LOW-2** Δ1 ADR addendum: «mixin co-located on `meta` for Donut/Treemap; payload-level array for StackedBar» plus caption-bake (Waterfall/Treemap/Bar drift) clarification.

---

## Per-reviewer report files

- `docs/reviews/2026-04-29-charts-pre-qa-typescript-review.md` (TS plugin)
- `docs/reviews/2026-04-29-charts-pre-qa-a11y-review.md` (a11y plugin)
- `docs/reviews/2026-04-29-charts-pre-qa-security-review.md` (security plugin)
- `docs/reviews/2026-04-29-charts-pre-qa-finance-revalidation.md` (finance plugin)
- `docs/reviews/2026-04-29-charts-pre-qa-legal-review.md` (legal plugin)
- `docs/reviews/2026-04-29-charts-pre-qa-architect-conformance.md` (architect plugin — returned inline; transcribe if needed)
- `docs/reviews/2026-04-29-charts-pre-qa-architect-conformance-project.md` (architect project — returned inline; transcribe if needed)
- `docs/reviews/2026-04-29-charts-pre-qa-backend-self-review.md` (backend self)
- `docs/reviews/2026-04-29-charts-pre-qa-fe-self-review.md` (FE self)
- `docs/reviews/2026-04-29-charts-pre-qa-techlead-integration-audit.md` (tech-lead)

---

## Recommended fix dispatch (sequential, smaller scope, builders only)

### Slice FIX-1 — frontend-engineer (a11y blockers + FE M-tier)
- **CRIT-1** Wire `:focus-visible` ring on all 10 chart containers; remove `outline: none` style.
- **CRIT-2** Import `useChartKeyboardNav` hook into all 10 components; wire `onKeyDown` per kickoff §7 a11y baseline (arrow-keys cycle, Esc blurs).
- **A11y H-1** Treemap text contrast fix (palette OR text colour OR font-size) — meet 4.5:1.
- **FE M1** Resolve drift-bar caption trigger: schema-bump (add `subtype: z.enum(['drift', ...])` to `BarChartPayload`) OR file as TD with rationale.
- **FE M3** Wire `NODE_ENV` for series-7 dev-warn (add @types/node devDep).
- Re-run `pnpm --filter @investment-tracker/ui test` + `pnpm --filter @investment-tracker/web build`.

### Slice FIX-2 — backend-engineer (TS HIGHs + schema)
- **TS H-1** Append `.strict()` to `ChartMeta.merge(MetaFinancialAggregate)` at `charts.ts:386` and `:582`.
- **TS H-2** Change `packages/shared-types/src/index.ts:26` from `export * from './charts.js'` to `export type * from './charts.js'`.
- **FE M1 cooperation** — if FE chooses schema-bump on `subtype`, backend lands the field on `BarChartPayload`.
- Re-run `pnpm --filter @investment-tracker/shared-types test`; verify all 57 still pass; verify single-parser grep still = 1 production hit.

### Slice FIX-3 — Right-Hand (mechanics + TDs)
- **HIGH-MECH-1** Rebase `chore/plugin-architecture-2026-04-29` against `origin/main` (post #79 + #80). Re-run all tests.
- **HIGH-MECH-2** Add PENDING_CLEANUPS #13 («.claude/ agent deltas»).
- File TDs:
  - TD — Single-parser CI grep gate (architect project M).
  - TD — `?debug=1` hostname/PII guard (security M3 + legal M-2).
  - TD — AI-prose vocabulary regex at api-client boundary (legal M-3 / finance N1).
  - TD — Page-level Lane-A disclaimer (legal M-1; pre-launch).
  - TD — `validateCrossFieldInvariants` cognitive complexity refactor (TS M-1).
  - TD — `CHART_KINDS` compile-time `Expect<Equal<>>` test (architect project LOW-1).
  - TD — ADR Δ1 addendum (architect project LOW-2).
- Update tech-lead's QA kickoff addendum: Layer A parser tests already shipped (57/57); retarget Layer C item 1 from «info-only chip» to «mandatory-caption presence».

### Then — re-dispatch QA (SLICE-CHARTS-QA-V1)
After FIX-1 + FIX-2 + FIX-3 land cleanly: dispatch qa-engineer with explicit skill brief (per `feedback_agent_skill_brief.md`) including `accessibility`, `e2e-testing`, `browser-qa`, `tdd-workflow`, `typescript-reviewer`.

---

## Meta-observation — independent reviewers earn their keep

Self-reviewers (backend, tech-lead, project architect) all returned APPROVE / PROCEED. Independent plugin reviewers (a11y, TS) caught:
- 2 CRITICAL a11y bugs (one of which FE self-review co-confirmed; one not).
- 2 HIGH TS/schema bugs both self-reviews missed.

Validates `feedback_agent_skill_brief.md` rule and `project_post_phase2_review_plan.md` discipline. Multi-perspective independent review found real bugs that single-perspective self-review systematically missed. Recommend formalising this fan-out for every future major slice.
