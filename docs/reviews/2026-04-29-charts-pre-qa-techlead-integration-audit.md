# Chart subsystem — Pre-QA cross-slice integration audit (tech-lead)

**Date:** 2026-04-29
**Author:** tech-lead (Right-Hand)
**Branch:** `chore/plugin-architecture-2026-04-29` @ `407e9c0`
**Slices reviewed:**
- `820ea86` + `2c23f5e` — SLICE-CHARTS-BACKEND-V1
- `18f7a97` + `407e9c0` — SLICE-CHARTS-FE-V1
**Slice not yet dispatched:** SLICE-CHARTS-QA-V1 (`docs/engineering/kickoffs/2026-04-29-charts-qa.md`)

**Verdict:** **PROCEED-TO-QA** with two HIGH punch-list items to resolve in parallel with QA dispatch (rebase risk + .claude/ deltas), zero CRITICAL findings.

---

## 1. Cross-slice integration scorecard

| # | Category | Status | Notes |
|---|---|---|---|
| 1 | Type-flow integrity (FE imports from `@investment-tracker/shared-types/charts`; discriminator narrowing; FE never re-validates) | PASS | All 11 type re-exports from `packages/ui/src/charts/index.ts:55-70` go through the shared-types subpath; no Zod imports in `packages/ui/src/charts/**` (grep returned 0 hits); `payload.kind` discriminator narrows correctly per FE component prop signatures. |
| 2 | Parser boundary — `parseChartEnvelope` is sole entry point | PASS | Production grep `ChartEnvelope.safeParse\|ChartEnvelope.parse` returns exactly 1 production hit at `packages/api-client/src/index.ts:132`. The 24 other hits are all in `packages/shared-types/src/charts.test.ts` (test-file, exempt per kickoff §7). FE showcase consumes typed fixtures, never `safeParse`. |
| 3 | Δ1 / Δ2 / Δ3 / Δ4 propagation backend↔FE | PASS | Δ1 mixin at `packages/shared-types/src/charts.ts:141-149` reused on Donut (`:386`), Treemap (`:582`), StackedBar `rowAggregates` (`:359-366`); cross-field validation lifted to envelope `superRefine` at `:780-790` (correct workaround for Zod's `discriminatedUnion` plain-object requirement; documented at `:680-694`). Δ2 `WATERFALL_CONSERVATION_VIOLATION` constant exported at `:627`, fired from `:765`. Δ3 — Scatter defined `:426-458`, NOT in MVP union `:665-676`; FE Scatter.tsx absent (per `Glob` of `packages/ui/src/charts/`); showcase has no Scatter block (`apps/web/src/app/design/_sections/charts.tsx`); `lazy.ts` exports only StackedBar / Waterfall / Candlestick. Δ4 documented in JSDoc header `charts.ts:14-18` and `parseChartEnvelope` JSDoc `api-client/src/index.ts:120-127`. |
| 4 | QA kickoff still valid post-FE-merge | CONCERN | See findings 4a–4d below. Three minor drifts; no blockers. |
| 5 | Merge log + TD ledger accuracy | PASS | `docs/merge-log.md:18` (FE) + `:30` (backend) entries present. TD-091 / 092 / 093 in `docs/TECH_DEBT.md:37-58`; TD-094 / 095 at `:17` and `:27`. All five TDs have priority + trigger fields. |
| 6 | Consolidated PR readiness vs main movement | CONCERN | See finding 6a (HIGH) — `pnpm-lock.yaml` + 3 package.json files touched by both #80 dependabot (on main) and FE slice. Resolvable but mandatory rebase before consolidated PR. |
| 7 | PO_HANDOFF.md drift | NOT-AUDITED-PER-RULE | Per memory rule «CC post-merge docs scope», tech-lead does not touch PO_HANDOFF.md from worktree. Drift would be expected given two unmerged slices on a chore branch; PO updates on slice closure. No action. |
| 8 | `.claude/` agent-file deltas tracked in PENDING_CLEANUPS | FAIL | See finding 8a (HIGH) — session memory `project_session_2026-04-29_end.md` records 5 agent-file deltas (M2/M3/M4) living only on this machine (`.claude/` is gitignored). `docs/PENDING_CLEANUPS.md` does not contain a tracking entry. Risk: deltas vaporise on machine swap / agent re-init. |
| 9 | Open Phase 2 risks left as «defer to QA» that QA might miss | PASS | Captions are baked into renderer files (Waterfall `:199`, Treemap `:127-128`, Bar drift `:150`), not deferred. `data-testid` convention is `chart-${kind}` for all 10 MVP charts — matches QA kickoff selector spec (`chart-info-chip` style names referenced in QA kickoff §9 are stricter; FE shipped `chart-${kind}` + `chart-${kind}-caption` + `chart-error` + `chart-data-table-${kind}` — see finding 4c). |

---

## 2. Findings by severity

### CRITICAL

None.

### HIGH

**6a. Consolidated PR rebase against moving main — mandatory before opening.**
`origin/main` advanced 2 commits since the chore branch diverged: `15689a2` (#80, npm-minor-patch group) and `695d283` (#79, gomod-minor-patch). The npm bump touches three files that the chart slices also modified:
- `apps/web/package.json` — main bumps `@clerk/nextjs`, `@tanstack/react-query`, `lucide-react`, `@tailwindcss/postcss`, `postcss`, `tailwindcss`. Chart FE slice did not modify this file's dependency block (it added the showcase wiring under `src/app/design/_sections/charts.tsx`), but **`pnpm-lock.yaml` is in our diff** and will collide with main's lock changes from the bumps.
- `packages/ui/package.json` — main bumps `lucide-react ^0.468.0 → ^0.577.0`. Chart FE slice added `./charts/lazy` export entry (no dep changes). Both edits are in the same file → trivial three-way merge but expected.
- `packages/api-client/package.json` — main bumps `openapi-fetch ^0.13.4 → ^0.17.0`. Chart backend slice did not touch this file. Lockfile collision only.

**Action:** rebase `chore/plugin-architecture-2026-04-29` onto `origin/main` BEFORE opening the consolidated PR. Re-run `pnpm install` to regenerate `pnpm-lock.yaml`. Verify `pnpm --filter @investment-tracker/ui test` (17/17), `pnpm --filter @investment-tracker/web test` (69/69), `pnpm --filter @investment-tracker/shared-types test` (57/57) all stay green post-rebase. Verify `lucide-react ^0.577.0` does not break any chart icon imports (low risk — Lucide icon names are stable across minors per their changelog convention).

**8a. `.claude/` agent-file deltas (M2/M3/M4) not tracked in PENDING_CLEANUPS.**
Per session memory `project_session_2026-04-29_end.md` and `project_plugin_architecture_2026-04-29.md`, the plugin-architecture session produced 5 agent-file deltas that live only locally because `.claude/` is in `.gitignore`. `docs/PENDING_CLEANUPS.md` lists 6 active items; none reference these agent-file deltas. Loss vector: machine swap, fresh clone, or `.claude/` reset.

**Action:** add a new entry to `docs/PENDING_CLEANUPS.md` titled «13. `.claude/` agent-file deltas from plugin-architecture session — local-only persistence risk» with trigger «before tech-lead context-window reset OR machine swap», scope «5 deltas (M2/M3/M4) need to be either (a) committed to a project-tracked location like `docs/agent-deltas/` or (b) baked back into agent prompts via `agents/right-hand.md` updates», owner «Right-Hand». Deferred status: PO awareness pending. **This is doc-only work; tech-lead can land it as commit 3 in the consolidated PR or as a standalone cleanup commit.**

### MEDIUM

**4a. QA kickoff §5 Layer A test count assumption vs backend reality.**
QA kickoff §5 Layer A specifies «for each of 10 MVP chart kinds: a positive test». Backend shipped 57 tests covering all 10 positive parses + Risk Flag rejections + Δ1 sum-to-total (Donut/Treemap/StackedBar positive + boundary + negative) + Δ2 conservation (canonical + 5 broken + tolerance boundary $1.00/$1.01) + Δ3 Scatter exclusion + T-8 discriminator (3 cases) + envelope edge cases. **The 57 tests live in `packages/shared-types/src/charts.test.ts`, not in a separate QA file.** QA kickoff §9 Cross-team flags says «parser tests live in your slice's PR (preferred) or in a sibling test file under `packages/shared-types/__tests__/`» — backend chose option (a). QA dispatch should be updated to confirm: «Layer A parser tests are ALREADY landed by backend slice; QA's responsibility for Layer A reduces to (1) verify finance-audit-§3 CRITICAL/HIGH coverage gap analysis, (2) add any missing negatives, (3) wire CI block-merge severity if not already in place».

**Action:** when dispatching QA, prepend a one-paragraph delta to the kickoff: «Backend has shipped Layer A; your job is gap-analysis + Layer B (visual baselines) + Layer C (runtime guardrails). Audit `packages/shared-types/src/charts.test.ts` first; do not re-write parser tests that already exist.»

**4b. QA kickoff §5 Layer B baseline count is correct (20) but viewport convention should be confirmed.**
QA kickoff specifies 1280×800. FE smoke tests use jsdom (no viewport). Showcase route runs at `/design#charts`. No drift; flagged for QA-dispatch confirmation only.

**4c. QA kickoff selector convention vs FE-shipped `data-testid` names.**
QA kickoff §9 mentions `data-testid="chart-info-chip"`, `chart-caption`, `chart-projection`, `chart-error-state` as «assumed» selectors. FE actually shipped:
- `chart-${kind}` for 10 MVP roots (matches QA expectation pattern)
- `chart-${kind}-caption` for Treemap, Waterfall, Bar (drift) captions (more granular than `chart-caption`)
- `chart-error` for `ChartError` (matches `chart-error-state` close enough; QA test names will need a one-character tweak)
- `chart-data-table-${kind}` for the visually-hidden a11y transcript
- `chart-skeleton-${kind}` for skeletons
- `chart-empty-${kind}` for empty states

No `chart-info-chip` or `chart-projection` selector exists — neither concept landed in FE because no chart in the MVP shipping set has an «info-only chip» pattern (info-only is conveyed via captions, not chips, in the actual finance-audit guardrails as implemented). QA's Layer C item 1 («info-only chip») needs reinterpretation as «caption presence» — finance-advisor verification should re-validate this in QA Phase 3.

**Action:** in QA dispatch, replace «info-only chip» Layer C test (kickoff §5 item 1) with «mandatory-caption presence test» targeting the four caption testids above. Note: QA finance Phase-3 re-verification (kickoff §14) catches this either way.

**4d. QA kickoff §12 pre-flight item 6 grep for `parseChartEnvelope` will pass — confirmed.**
Self-check: `grep -q "parseChartEnvelope" packages/api-client/src/index.ts` returns true (line 131). No drift.

### LOW

**L1.** The cross-field invariant lift to envelope-level `superRefine` (rather than per-payload `.refine()`) is architecturally correct — Zod's `discriminatedUnion` cannot accept `ZodEffects`-wrapped members. The decision is documented inline at `charts.ts:680-694`. No action; flag for ADR addendum if PD or finance-advisor objects to the issue-path being `['payload', 'segments']` instead of `['segments']`. (Minor: tests at `:704` already match the new path so QA is not affected.)

**L2.** `MetaFinancialAggregate` has Zod defaults (`toleranceMode: 'relative'`, `toleranceValue: 0.005`). On Donut/Treemap, `meta` merges this mixin via `ChartMeta.merge(MetaFinancialAggregate)` — TS inferred type makes them required, but Zod parse-defaults make them optional on input. Behaviour is correct (AI agent can omit them), but the TS type asymmetry should be noted in the JSDoc for SLICE-AI-CHARTS-V1 Pydantic mirror author. No immediate action.

**L3.** `position-price-chart.tsx` consumer migration uses `as unknown as MultiSeriesPoint[]` cast (TD-094, P3). Acknowledged debt; correct deferral.

---

## 3. Updated punch list — what's left before consolidated PR

In execution order:

1. **[HIGH 6a]** Rebase `chore/plugin-architecture-2026-04-29` onto `origin/main` (post #79 / #80 dependabot bumps). Resolve `pnpm-lock.yaml` regen + spot-check `lucide-react ^0.577.0` import compatibility in chart files. Re-run all three test suites (shared-types 57/57, ui 17/17, web 69/69).
2. **[HIGH 8a]** Add PENDING_CLEANUPS item 13 covering `.claude/` agent-file delta persistence. Doc-only commit on chore branch.
3. **[MEDIUM 4a + 4c]** Update QA dispatch brief (NOT the kickoff file itself — the dispatch message): note Layer A is done, retarget Layer C item 1 from «chip» to «caption-presence».
4. **Dispatch QA** (SLICE-CHARTS-QA-V1) to qa-engineer. Kickoff `docs/engineering/kickoffs/2026-04-29-charts-qa.md` is structurally consistent with what landed; only the dispatch-time addendum from item 3 is needed.
5. **Code-Reviewer dispatch** post-QA-merge as safety net (per project convention).
6. **Open consolidated PR** off rebased `chore/plugin-architecture-2026-04-29` against `main`. Title suggestion: «feat(charts): SLICE-CHARTS-BACKEND-V1 + SLICE-CHARTS-FE-V1 + SLICE-CHARTS-QA-V1 — chart subsystem MVP». Body: cross-link three slice merge-log entries + rebase note + bundle delta table + 20 visual baselines.
7. **PO sign-off** on visual delta → close all three slices in `PO_HANDOFF.md` (PO-owned per memory rule).

---

## 4. Recommendation

**PROCEED-TO-QA.** Cross-slice contract is sound — type flow is single-direction (Zod-canonical → `z.infer` types → FE consumption with zero re-validation), parser invariant grep is clean (1 production hit), Lane-A guardrails are baked structurally not policed, all four architect deltas (Δ1 / Δ2 / Δ3 / Δ4) propagated correctly, mandatory captions baked into renderers (not deferred), `data-testid` selectors land for QA Playwright targeting.

The two HIGH items (rebase + .claude/ deltas) are PR-mechanics and process-hygiene, not slice-contract issues — they do not block QA test authoring on the parser tier or Layer C runtime guardrails. Layer B visual baselines should wait until after rebase to avoid baseline churn from `lucide-react` bumps, but parser + guardrail work can start immediately.

QA can begin Layer A audit (gap-analysis vs the 57 already-landed tests) and Layer C drafting in parallel with rebase work. Layer B baseline capture should sequence after rebase confirms test suites still green.

---

## 5. Files cited

- `packages/shared-types/src/charts.ts` (canonical Zod schemas)
- `packages/shared-types/src/charts.test.ts` (57 parser tests)
- `packages/api-client/src/index.ts:131-137` (sole parser entry point)
- `packages/ui/src/charts/index.ts` (T1 eager exports + type re-exports)
- `packages/ui/src/charts/lazy.ts` (T2 + T3 lazy)
- `packages/ui/src/charts/Treemap.tsx:127-128`, `Waterfall.tsx:199`, `BarChart.tsx:150` (mandatory captions)
- `packages/ui/src/charts/charts.test.tsx` (10 instantiation + 10 a11y-table snapshots + caption/transform/dark-swap)
- `apps/web/src/app/design/_sections/charts.tsx` (showcase — 10 MVP, no Scatter, no Candlestick demo)
- `docs/merge-log.md:18-39` (slice closures)
- `docs/TECH_DEBT.md:17,27,37,47,56` (TD-094 / 095 / 093 / 092 / 091)
- `docs/DECISIONS.md:802` (theme `data-theme` decision entry)
- `docs/PENDING_CLEANUPS.md` (missing item 13)
- `docs/engineering/kickoffs/2026-04-29-charts-qa.md` (still valid with dispatch-time addendum)
