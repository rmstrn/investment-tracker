# Design-system fixes — aggregate review report

**Date:** 2026-04-29
**Branch:** `chore/plugin-architecture-2026-04-29` (local, not committed)
**Synthesised by:** right-hand
**Process:** CONSTRAINTS.md Rule 5 — independent fan-out (5 parallel reviewers, read-only)

---

## Slices under review

| Slice | Scope | Files |
|---|---|---|
| A — Dark stage removal | Drop redundant `dark-v2` StageFrame | `apps/web/src/app/design-system/page.tsx` (-23 lines) |
| B — Theme-aware fix | Sections follow `<html data-theme>` via hook | NEW `_hooks/useShowcaseTheme.ts`, NEW `_components/StagedSections.tsx`, EDIT `page.tsx` |
| C — Console errors fix | CRITICAL hydration + LOW favicon (MEDIUM recharts deferred) | NEW `packages/ui/src/charts/_shared/chart-backend-dispatch.tsx`, EDIT `packages/ui/src/charts/index.ts`, NEW `apps/web/src/app/icon.tsx`, EDIT `apps/web/src/middleware.ts`, EDIT `apps/web/next.config.ts` |

---

## Reviewer scorecard

| Reviewer | Verdict | CRITICAL | HIGH | MEDIUM | LOW | INFO |
|---|---|---|---|---|---|---|
| TypeScript / type-safety | clear | 0 | 1 | 3 | 2 | — |
| Accessibility (WCAG 2.2) | warn | 0 | 2 | 4 | 2 | — |
| Security | clear | 0 | 0 | 2 | 3 | 2 |
| Architecture | warn | 0 | 1 | 4 | 3 | — |
| Tech-lead (cross-slice) | warn | 0 | 3 | 4 | 3 | — |
| **TOTAL** | **warn** | **0** | **7** | **17** | **13** | **2** |

Per Rule 5: CRITICAL/HIGH findings block downstream work until fixed. Zero CRITICAL — slice ships after HIGH fixes.

---

## HIGH findings (block merge / Phase 2)

### H1 — Backend-flag test broken (CI red)
- **Reviewer:** tech-lead
- **File:** `packages/ui/src/__tests__/backend-flag.test.tsx:40-46`
- **Issue:** Test asserts reference equality `Sparkline === SparklineV2` when flag is `'primitives'`. The new `makeBackendDispatch` always returns a wrapper component, never the V2 reference directly. Test fails unconditionally.
- **Fix:** Rewrite assertions to render-and-probe (e.g. `data-testid` differs, or query rendered DOM markers) instead of identity.
- **Owner:** frontend-engineer
- **Severity rationale:** CI blocker.

### H2 — Dispatcher generic pinned to V1 prop type
- **Reviewer:** TypeScript
- **File:** `packages/ui/src/charts/index.ts:79-83`
- **Issue:** `makeBackendDispatch<DonutChartProps>(V1, V2, …)` pins `P` to V1's prop type. V2 has 6+ extended optional props (`startAngle`, `endAngle`, `cornerRadius`, `labelPosition`, etc.) that are unreachable via the unified `<DonutChart>` export. The named `DonutChartV2` export is the working escape hatch today.
- **Fix:** Either widen `P` to `DonutChartProps & Partial<Omit<DonutChartV2Props, keyof DonutChartProps>>`, or expose both V1 and V2 types via the dispatcher and let consumers narrow at the call site.
- **Owner:** frontend-engineer
- **Severity rationale:** blocks Phase 2 from extending V2 prop API through the unified surface.

### H3 — Dead `BackendDispatchProps<C>` exported
- **Reviewer:** architect
- **File:** `packages/ui/src/charts/_shared/chart-backend-dispatch.tsx:27-28`
- **Issue:** Type is exported but never imported anywhere in the repo. Dead public API surface — confusing for Phase 2 builders.
- **Fix:** Delete the type and its export. Keep `makeBackendDispatch<P extends object>` as the only public surface.
- **Owner:** frontend-engineer
- **Severity rationale:** API hygiene before Phase 2 builders consume the surface.

### H4 — Page title shows wrong product name
- **Reviewer:** a11y
- **File:** runtime DOM `<title>` reads `Design System · Portfolio`; source is `apps/web/src/app/design-system/page.tsx:14-18` via `brand.productName`.
- **Issue:** Live title not `Provedo`. Either `brand.productName` exports a stale string in `packages/design-tokens/brand.ts`, or the dev server cache held the old build. WCAG 2.4.2 — page identity misleading.
- **Fix:** (1) Verify `packages/design-tokens/src/brand.ts` exports `productName: 'Provedo'`. (2) If correct — restart dev server (cache). (3) Add a render-time test asserting title contains `Provedo` so regression is caught.
- **Owner:** frontend-engineer
- **Severity rationale:** brand-truth + a11y page identity.

### H5 — Headline rendered without space ("whatyou'd")
- **Reviewer:** a11y
- **File:** `apps/web/src/app/design-system/_components/StageFrame.tsx:41-57`
- **Issue:** Headline `"Notice what you'd miss."` renders accent word `what` in a `<span>` but `split(accentWord)[0]` strips trailing space; DOM reads `Notice<span>what</span>you'd miss.`. Pre-existing bug — visible after slice A removed the dark twin which masked the issue.
- **Fix:** Use word-boundary split or render with explicit space-preserving segments: `{beforeAccent}<span>{accentWord}</span>{afterAccent}` retaining inter-word whitespace.
- **Owner:** frontend-engineer
- **Severity rationale:** WCAG 1.3.1; visible to every user on showcase load.

### H6 — Slice C scope creep
- **Reviewer:** tech-lead
- **Issue:** Middleware + `app/icon.tsx` + chart dispatcher all bundled as "design-system fix". Two unrelated surfaces (auth/middleware + chart subsystem infra).
- **Fix:** Split into PR-1 (Slices A + B + favicon + middleware = console-noise hygiene) and PR-2 (chart dispatcher + `next.config.ts` env block = Phase 2 infra).
- **Owner:** tech-lead (process, not code)
- **Severity rationale:** review hygiene; PR-2 needs different reviewer attention than PR-1.

### H7 — `next.config.ts` env asymmetry persists for non-`apps/web` consumers
- **Reviewer:** tech-lead
- **File:** `apps/web/next.config.ts:13-28` interplay with `packages/ui/src/charts/_shared/chart-backend-dispatch.tsx:30-35`
- **Issue:** The `env:` block makes `NEXT_PUBLIC_PROVEDO_CHART_BACKEND` build-time-constant **for `apps/web` only**. Other consumers (Storybook, unit tests, future mobile bundle) re-read `process.env` at module-eval and risk SSR/CSR asymmetry. Dispatcher saves them, but the architectural footgun remains.
- **Fix:** Add `ACTIVE_CHART_BACKEND` resolver — single function called once and cached. Document in `docs/design/CHARTS_SPEC.md` §3.
- **Owner:** code-architect (per tech-lead) or frontend-engineer.
- **Severity rationale:** blocks confidence that Phase 2 works in Storybook + tests symmetrically.

---

## MEDIUM findings (recommended before α; not blocking merge)

| # | Reviewer | Concern | Owner |
|---|---|---|---|
| M1 | a11y | No skip-to-main link before sticky header (8 controls before content); SC 2.4.1 | frontend-engineer |
| M2 | a11y | `useShowcaseTheme` first-paint flicker — recommends `useSyncExternalStore` or pass theme as server-rendered prop | frontend-engineer |
| M3 | a11y | Toggle border `--border` vs `--bg` may be <3:1; SC 1.4.11 — spot-check | frontend-engineer |
| M4 | a11y | Dispatcher V1→V2 swap drops focus if AT user has chart subtree focused at mount frame | frontend-engineer |
| M5 | TS | `BackendDispatchProps<C>` decorative — not consumed anywhere (overlaps H3, see architect) | (covered by H3) |
| M6 | TS | Top-level `'use client'` on dispatcher forces every wrapped chart into client bundle even on V1 path; loses RSC streaming | frontend-engineer |
| M7 | TS | Dead-typed `process.env?.` optional chain (env is non-nullable in `@types/node`) | frontend-engineer |
| M8 | Security | `/icon(.*)` regex too greedy — would expose `/icons`, `/iconadmin` if added later | frontend-engineer |
| M9 | Security | No CSP configured app-wide (pre-existing, not introduced this slice) | devops-engineer / frontend-engineer (α-cutover task) |
| M10 | Architect | Pattern explosion for Phase 2 — 11 chart kinds × 2 imports + dispatcher = boilerplate | (open as TD; mitigated by sunset gate) |
| M11 | Architect | `MutationObserver` per V2 chart instance — N observers for N charts — needs project-wide ThemeProvider before Phase 2 | frontend-engineer (TD) |
| M12 | Architect | Add cross-reference comment in `next.config.ts` env block pointing to dispatcher | frontend-engineer (trivial) |
| M13 | Architect | Two-frame flicker on V1→V2 swap, more visible on Phase 2 LineChart/AreaChart gradients | (TD; document mitigation in CHARTS_SPEC §3) |
| M14 | Tech-lead | Dispatcher double-render cost on dashboard with N≥6 charts — measure INP at Phase 2 | qa-engineer (TD) |
| M15 | Tech-lead | `useShowcaseTheme` MutationObserver fires on every `class` mutation (Tailwind `dark:`, Clerk theme injection) — unnecessary re-renders | frontend-engineer |
| M16 | Tech-lead | No visual-regression test gates `/design-system` — light-island bug shipped silently | qa-engineer |
| M17 | Tech-lead | `next/og` `ImageResponse` pulls satori (~200 KB); static `.png` cheaper for favicon | frontend-engineer |

---

## LOW findings (13 total — informational, polish)

Notable polish items grouped:
- `useState(false)` magic boolean → `useState<'v1' \| 'v2'>('v1')` (architect)
- Eyebrow magic strings in `StagedSections` should move to `_constants.ts` (tech-lead)
- `page.tsx:56` hardcodes "Provedo Design System v2 — refined" instead of `${brand.productName}` (tech-lead)
- Stale comment in `charts/index.ts` post-dispatcher refactor (tech-lead)
- Logo SVG `role="img"` without `aria-label` (a11y)
- Focus-ring halo uses page `--bg` outside stage (cosmetic only) (a11y)

Full list in per-reviewer transcripts.

---

## Recommended fix bundle (sequential)

### Bundle 1 — code HIGHs (frontend-engineer #3)
**Scope:** H1, H2, H3, H4, H5, M5 (subsumed), M12 (trivial). Wall-clock target ≤ 18 min.
**Files touched:**
- `packages/ui/src/charts/_shared/chart-backend-dispatch.tsx` (H3, M7)
- `packages/ui/src/charts/index.ts` (H2 generic widening)
- `packages/ui/src/__tests__/backend-flag.test.tsx` (H1 rewrite)
- `apps/web/src/app/design-system/_components/StageFrame.tsx` (H5 split fix)
- `packages/design-tokens/src/brand.ts` (H4 verify)
- `apps/web/next.config.ts` (M12 cross-ref comment)

### Bundle 2 — TD entries (no code, just `docs/TECH_DEBT.md`)
- TD: dispatcher double-render cost (M14)
- TD: visual regression test for `/design-system` (M16)
- TD: `ImageResponse` satori bundle vs static favicon (M17)
- TD: project-wide ThemeProvider before Phase 2 LineChart V2 (M11)
- TD: dispatcher sunset gate criteria (Architect M10 mitigation)
- TD: CSP missing app-wide (M9 — pre-existing)
- TD: `ACTIVE_CHART_BACKEND` resolver for non-`apps/web` consumers (H7 deferred to TD)

### Bundle 3 — process (PO + tech-lead)
- PR split decision (H6) — single PR vs 2 PRs (favicon hygiene + chart-infra)
- Re-run smoke verify after Bundle 1 (typecheck + Playwright)
- Greenlight palette-brainstorm fan-out (independent of merge)

---

## Merge order recommendation

Per tech-lead: **2 PRs**.

- **PR-1** (Slices A + B + favicon + middleware): low-risk visual + console-noise hygiene; gates nothing in Phase 2.
- **PR-2** (Slice C chart-dispatcher + `next.config.ts` env): must land **before** Phase 2 builder dispatch. Phase 2 chart kinds will register through `makeBackendDispatch`. Block PR-2 on H1 + H2 + H3 fixes + TD-entry for double-render cost.

**Palette brainstorm** is independent of both PRs. Schedule in parallel, not as a gate.

---

## PO decisions needed

1. **Bundle 1 dispatch — go?** (frontend-engineer with explicit skill brief; will fix 5 code HIGHs in one shot.)
2. **PR split — go with tech-lead's 2-PR recommendation?** Or single PR if α-cutover schedule favours batching?
3. **Palette brainstorm trigger — now (parallel) or after Bundle 1 lands?**

---

**End of aggregate.** Per-reviewer raw transcripts retained in agent output files (`a3673e4fa8237cb9d` tech-lead, `aae360b0379a89757` architect, `aed52aae3d4a4c9d5` security, `a6b8a24482eb9905a` TS-retry, `a636f9fa95b6347b7` a11y).
