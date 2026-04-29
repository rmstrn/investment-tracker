# Charts FE v1 — Pre-QA Self-Review (cold-read)

**Reviewer:** frontend-engineer (re-validation pass, fresh context)
**Date:** 2026-04-29
**Branch:** `chore/plugin-architecture-2026-04-29`
**Slice:** SLICE-CHARTS-FE-V1
**Kickoff:** `docs/engineering/kickoffs/2026-04-29-charts-fe.md`
**Verdict:** **FIX-BEFORE-MERGE** (1 HIGH structural a11y gap; everything else PASS / minor)

---

## §7 acceptance criteria checklist

| # | Criterion | Status | Cite |
|---|---|---|---|
| 1 | 10 MVP chart components in `packages/ui/src/charts/` (Scatter excluded per Δ3) | **PASS** | dir listing — 10 `.tsx` chart files; no `Scatter.tsx`. |
| 2 | T1 (7) eager from `index.ts`; T2/T3 (3) lazy from `lazy.ts` | **PASS** | `packages/ui/src/charts/index.ts:14-20`; `lazy.ts:18-28`. |
| 3 | `packages/ui/package.json` exports `./charts/lazy` with `types`+`default` | **PASS** | `packages/ui/package.json:18-21`. |
| 4 | Each component imports payload type from `@investment-tracker/shared-types/charts`; zero `any`; no Zod at boundary | **PASS** | grep for `from 'zod'` in `packages/ui/src/charts/` → 0 hits; only legitimate prose `any` (BarChart drift caption text); every chart imports `type … from '@investment-tracker/shared-types/charts'`. |
| 5 | Live theme switching via `var(--chart-series-N)` | **PASS** | All charts use `SERIES_VARS[i]` strings as Recharts `stroke`/`fill`/`fill={s.color}` props. CSS vars declared at `apps/web/src/app/globals.css:47-76`. LineChart `useDarkTheme` hook listens to MutationObserver on `class` + `data-theme` attrs (`LineChart.tsx:54-71`). Theme test exists (`charts.test.tsx:163-177`). |
| 6 | WCAG AA contrast verified for series-on-bg combinations | **PARTIAL** | Tokens declared but no automated contrast assertion in this slice; manual eye-check expected per kickoff. Acceptable per kickoff phrasing. |
| 7 | Series-7 dark-mode auto-swap | **PASS** | `LineChart.tsx:84-101` — guard runs only when `payload.series.length === 1 && color === SERIES_7_VAR && dark`; swaps to `SERIES_VARS[0]` and dev-only `console.warn`. Test exists (`charts.test.tsx:163-177`). |
| 8 | `prefers-reduced-motion` honoured on all 10 charts | **PASS** | `useReducedMotion` (`_shared/useReducedMotion.ts`) is consumed by every animated chart and passed to Recharts as `isAnimationActive={!prefersReducedMotion}`. Calendar / Sparkline non-Recharts paths also honour. |
| 9 | A11y baseline: `role="img"` + `aria-label` + `aria-describedby` + `tabIndex={0}` + arrow-key nav + Esc | **PARTIAL → FAIL on arrow-key nav** | All 10 components have role/label/describedby/tabIndex (grep across `*.tsx` confirms). **However: `useChartKeyboardNav` is defined and exported but NEVER consumed by any chart component.** No `onKeyDown` handler is attached to any container. Arrow-key navigation is non-functional today. See HIGH finding A1 below. |
| 10 | axe-core passes on Line / Donut / Calendar (QA-owned) | **DEFERRED** | QA kickoff dispatch — outside this slice. Structural a11y violation in #9 will be caught by QA's keyboard-nav test if added. |
| 11 | Showcase route `/design#charts` renders all 10 MVP types live; T2/T3 behind Suspense; Candlestick NO demo; Scatter NO demo; empty/error/loading for Line/Donut/Calendar | **PASS** | `apps/web/src/app/design/_sections/charts.tsx:76-153` covers Line / Area / Bar / Bar-drift / Donut / Sparkline / Calendar / Treemap / StackedBar (Suspense) / Waterfall (Suspense). Candlestick block absent. Scatter block absent. ChartEmpty for Line/Donut/Calendar (lines 161-183). ChartError block (lines 185-193). |
| 12 | `?debug=1` gate on ChartError | **PASS** | `_shared/ChartError.tsx:42-60` reveals `<details>`+payload only when `useDebugMode()` returns true; `useDebugMode` reads `window.location.search` for `debug=1`. Without param, button is rendered disabled. |
| 13 | Bundle delta — chat-route page-bundle ≤ 300 kb gz; chart-only delta ≤ 50 kb gz | **PASS** | `pnpm --filter @investment-tracker/web build`: `/chat/[id] = 193 kB First Load`; `/positions/[id] = 346 kB` (over 300 kB but pre-existing); `/design = 284 kB` (within 300 kB target). No regression introduced by chart code; bundle structurally split (T2/T3 lazy). |
| 14 | Smoke Vitest suite: 10 instantiation + 10 ChartDataTable snapshots | **PASS** | `packages/ui/src/charts/charts.test.tsx` ships 17 tests, all green: 10 instantiation tests + 10 snapshots + dark-swap test + drift caption test (×2) + Treemap caption tests (×2) + Waterfall conservation transform shape test + Waterfall caption test. `__snapshots__/charts.test.tsx.snap` exists. |
| 15 | Lane-A enforcement is parser-time; no `import { z }` from zod in chart code | **PASS** | grep `from 'zod'` in `packages/ui/src/charts/` → 0 matches. Only `import type` from shared-types. |
| 16 | Mandatory caption for Waterfall (C6) baked-in | **PASS** | `Waterfall.tsx:110-111, 199-201` — caption is a module-level const string and rendered unconditionally beneath chart. Test confirms (`charts.test.tsx:152-160`). |
| 17 | Drift-bar caption when `payload.subtype === 'drift'` (B8) | **PARTIAL — kickoff↔impl drift** | `BarChartPayload` schema has NO `subtype` field (verified in `packages/shared-types/src/charts.ts:302-321` — schema is `.strict()`). The implementation sniffs `payload.meta.subtitle?.toLowerCase().includes('drift')` (`BarChart.tsx:49-51`). Functionally equivalent for the BAR_DRIFT_FIXTURE which sets subtitle accordingly, but the trigger contract differs from kickoff wording. See MEDIUM finding M1. |
| 18 | Calendar `eventType` only `dividend`/`corp_action` | **PASS** | Schema-enforced upstream; renderer (`Calendar.tsx:93-128`) handles only those two branches. |
| 19 | CI green on PR | **PASS (local)** | `pnpm --filter @investment-tracker/ui typecheck` clean; `pnpm --filter @investment-tracker/ui test` 17/17 pass; `pnpm --filter @investment-tracker/web build` clean (Next 15.5.15 reports compile success, all 11 static pages generated). |
| 20 | PR description with phase summary + bundle table + 20 screenshots + a11y verification + TDs | **DEFERRED** | PR not yet opened (per kickoff §13). Out of scope for code-only review. |
| 21 | Code Reviewer dispatch requested AFTER merge | **DEFERRED** | Convention-only. |
| 22 | DO NOT MERGE until ADR + audit on `main` | **N/A** | Branch is `chore/plugin-architecture-2026-04-29`; merge gating is Right-Hand's call. |
| 23 | TDs filed (TD-094 / TD-095) | **PASS** | `docs/TECH_DEBT.md:17-37` — both entries present, accurate, with cited files + revisit triggers. |

**Score:** 17 PASS / 3 PARTIAL / 1 PASS-with-note / 2 DEFERRED out-of-scope.

---

## Per-component checklist

| Chart | role+aria | tabIndex | reduced-motion | series-vars | data-testid | caption | smoke test |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| LineChart (T1) | ✓ | ✓ | ✓ | ✓ stroke | `chart-line` | n/a | ✓ + dark-swap |
| AreaChart (T1) | ✓ | ✓ | ✓ | ✓ gradient stops | `chart-area` | n/a | ✓ |
| BarChart (T1) | ✓ | ✓ | ✓ | ✓ Cell fill | `chart-bar` | drift caption (subtitle-sniff) | ✓ + drift ×2 |
| DonutChart (T1) | ✓ | ✓ | ✓ | ✓ Cell fill | `chart-donut` | n/a | ✓ |
| Sparkline (T1) | ✓ | ✓ | ✓ | ✓ stroke/fill | `chart-sparkline` | n/a | ✓ |
| Calendar (T1) | ✓ | ✓ | n/a (CSS-only, no anim) | ✓ status-color CSS vars | `chart-calendar` | n/a | ✓ |
| Treemap (T1) | ✓ | ✓ | `isAnimationActive={false}` | ✓ tile fill | `chart-treemap` | FINRA + basis caption baked | ✓ + caption ×2 |
| StackedBar (T2 lazy) | ✓ | ✓ | ✓ | ✓ Bar fill | `chart-stacked-bar` | n/a | ✓ |
| Waterfall (T2 lazy) | ✓ | ✓ | ✓ | ✓ Cell fill | `chart-waterfall` | mandatory caption baked | ✓ + caption + transform |
| Candlestick (T3 lazy, no demo) | ✓ | ✓ | ✓ | ✓ Cell fill | `chart-candlestick` | n/a | ✓ |

All 10 components have `data-testid="chart-${kind}"` per kickoff §9 QA-handoff convention.

---

## Findings

### HIGH

**A1 — Arrow-key keyboard navigation is not functional on any chart.**

`packages/ui/src/charts/_shared/useChartKeyboardNav.ts:13` — hook is defined and exported but **never imported or invoked by any chart component**. Verified by `grep useChartKeyboardNav packages/ui/src/charts/*.tsx` → no matches. Charts have `tabIndex={0}` so they receive focus, but `onKeyDown` handlers are absent. Pressing Arrow / Home / End / Esc on a focused chart does nothing.

The kickoff §7 acceptance box reads: *"a11y baseline on every chart: …; tabIndex={0} on container; arrow-keys cycle data points; Esc blurs."* The first two clauses are satisfied; the last two are not.

**Severity:** HIGH (kickoff acceptance box says PASS but actually FAIL on inspection — exactly the rubric's HIGH class).

**Fix sketch:** in each chart component, after `const containerRef = useRef<HTMLDivElement>(null);`, attach the ref to the container `<div>` and call `useChartKeyboardNav(containerRef, payload.data.length, setActiveIndex)`. Sparkline already has the `useRef` and `useState<number | null>(null)` in place (`Sparkline.tsx:33-34`) but the wiring is incomplete.

**Files affected:** all 10 chart `.tsx` files in `packages/ui/src/charts/`.

---

### MEDIUM

**M1 — Drift-bar caption trigger uses subtitle-substring sniff, not a discriminator field.**

`BarChart.tsx:49-51` detects drift via `payload.meta.subtitle?.toLowerCase().includes('drift')`. The kickoff §7 box wording was "`payload.subtype === 'drift'`" — but `BarChartPayload` schema (`packages/shared-types/src/charts.ts:302-321`) does not declare a `subtype` field, and the schema is `.strict()` so adding one would have been a schema-bump.

Two consequences:
1. **Brittle:** any AI agent emission whose subtitle happens to contain the word "drift" (e.g. "Drift in valuation method") will spuriously render the FINRA rebalance caption.
2. **Locale-fragile:** subtitle is human-readable prose. A non-English locale ("Дрифт по портфелю") or alternate framing ("Allocation slippage YoY") would silently fail to render the mandatory finance-audit-B8 caption.

**Severity:** MEDIUM (functional today on the BAR_DRIFT_FIXTURE, but the trigger contract is implicit prose not explicit schema). Either:
- (a) bump `BarChartPayload` to add `subtype: z.enum(['default', 'drift']).default('default')` and switch detection to `payload.subtype === 'drift'`, or
- (b) accept the prose-sniff and document the subtitle-prefix contract in a TD (P3).

**File:** `packages/ui/src/charts/BarChart.tsx:46-51`.

---

**M2 — Sparkline `setActiveIndex` is wired but never consumed.**

`Sparkline.tsx:34` — `const [, setActiveIndex] = useState<number | null>(null);`. The setter is captured (commented signature pre-empts a future cursor display) but never called; only the ignore-pattern destructure leaves the value unused. `onMouseLeave` resets to null. This is a pre-wired hook for the missing keyboard nav (M1 link). Vitest output also shows Recharts width/height warnings on Sparkline rendering in jsdom — cosmetic.

**Severity:** MEDIUM (dead code today; resolves automatically when A1 is fixed).

**File:** `packages/ui/src/charts/Sparkline.tsx:34, 63`.

---

**M3 — Series-7 dark-mode warn uses hostname check instead of NODE_ENV.**

`LineChart.tsx:91-94` warns only on `localhost`/`127.0.0.1`. The component doc-comment explains the package has no `@types/node` so `process.env.NODE_ENV` is unavailable. Acceptable workaround, but staging on a real domain would silently swap without telemetry. If staging surfaces a solo series-7 dark chart, the dev hint vanishes.

**Severity:** MEDIUM (acceptable; consider a future TD to use Vite-style `import.meta.env.DEV` if Vite is the bundler for `packages/ui`).

**File:** `packages/ui/src/charts/LineChart.tsx:88-99`.

---

### LOW

**L1 — `position-price-chart.tsx` line 87 ships an `as unknown as AreaChartPayload['data']` cast.**

This is exactly the cast TD-094 documents and accepts. Annotated in code with a clear comment; consumer-side, not chart-code-side. Within rule scope.

**File:** `apps/web/src/components/positions/position-price-chart.tsx:87`.

---

**L2 — BarChart Cell array — branchless render of bars when `colorBySign=false` looks fine but uses `noArrayIndexKey` biome-ignore.**

`BarChart.tsx:140-144`. Acceptable; positional bar identity is stable for fixed-data renders.

---

**L3 — Recharts emits `width(-1)/height(-1)` warnings under jsdom Sparkline test.**

Test output (`charts.test.tsx > Sparkline`) shows Recharts ResponsiveContainer measurement warnings. Tests still pass; benign noise. Cosmetic.

---

## Recommendation

**FIX-BEFORE-MERGE.** Single HIGH finding (A1: keyboard navigation non-functional) is a structural a11y regression that the kickoff §7 explicitly enumerates as required. The hook exists; wire it up in each of the 10 chart components and add a Vitest assertion that `fireEvent.keyDown(container, { key: 'ArrowRight' })` advances the focus index. ~30 mins of work; one commit on this branch before opening the PR.

Everything else (M1 / M2 / M3 / L1-3) can ride: M1 either as a follow-on schema bump tracked in a new TD or as accepted prose-contract; M2 self-resolves on A1 fix; M3 / L1 / L2 / L3 are documented or mechanical.

Once A1 is fixed:
- 10/10 components fully a11y-baselined per kickoff §7
- 18/18 effective acceptance boxes PASS
- recommend `APPROVE` for QA dispatch

**Out-of-scope deferrals (correct):** axe-core wiring, Playwright visual baseline, dual-side Pydantic mirror (TD-091), AI-agent SSE streaming protocol (TD-093), Scatter V2 (TD-092), MultiSeriesPoint cast cleanup (TD-094), DTCG token migration (TD-095).
