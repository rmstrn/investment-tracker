# DONUT-V2 implementation kickoff — 2026-04-29

**Status:** READY for FE dispatch
**Author:** tech-lead
**Branch:** `chore/plugin-architecture-2026-04-29` (target = same branch — kickoff lands as a new doc, FE commits stack on top)
**PO directive:** «Запускать DONUT-V2 implementation сейчас в этой ветке» (2026-04-29)
**Source decisions (binding inputs, do NOT re-open):**
- `docs/DECISIONS.md` «2026-04-29 — Charts palette: museum-vitrine extension + ink tonal default»
- `docs/DECISIONS.md` «2026-04-29 — DonutChart anatomy + interaction: 5 PO-delegated design calls»
**Source drafts:**
- `docs/design/CHART_PALETTE_v2_draft.md` — 5-hue museum-vitrine OKLCH/hex + 7-step ink ramp + tritanopia callout (stone+ochre)
- `docs/design/DONUT_GRADIENT_v2_draft.md` — per-slice radial gradient «свет изнутри» (dark center → bright rim, INVERTED from amCharts ref) + WCAG mandatory 1px hairline outline
- `docs/design/DONUT_ANATOMY_v2_draft.md` — 270° opt-in arc, 3px corner radius (with cap rule), drop-shadow strategy, by-magnitude entrance animation 600/180/105 ms, sister-slice no-dim rule, legend-below

---

## Goal

Land a single coherent FE slice that brings DonutChart V2 to museum-vitrine palette + radial-gradient «свет изнутри» fills + 3px-cornered slices + by-magnitude descending entrance animation + bisector hover translation, behind the existing primitives backend on the showcase.

## Scope (in)

- New design tokens: 5-hue museum extension (`color.museum.{slate,stone,fog-blue,plum,ochre}` × `{light,dark}`), 7-step ink ramp (`color.ink-ramp.{light,dark}.1..7`), 2 motion durations (`duration.donut-sweep` 600 ms, `duration.donut-slice-fade` 180 ms), 1 hover-shadow token (`shadow.chart-slice-hover` — paper-press neumorphism + accent rim glow).
- Semantic-layer aliases: `chart-categorical.1..5` (ordered slate→ochre→fog-blue→plum→stone for hue spread), `chart-sequential.1..7`.
- DonutChartV2: new `palette` prop (`'categorical' | 'sequential'`, default `'categorical'`), new `arcMode` prop (`'full' | '270'`, default `'full'`), `cornerRadius` default 3 (with cap rule), per-slice radial gradient via `<defs>` injected at chart root (`gradientUnits="userSpaceOnUse"`, dark-center → bright-rim), mandatory 1px hairline outline (`var(--card)` light, `--chart-grid-dark` dark, `vector-effect="non-scaling-stroke"`), bisector translation 2px on hover/focus, layered hover shadow via the new token, by-magnitude descending entrance with 105 ms stagger + reduced-motion fallback.
- DonutChartV1 (Recharts): palette swap to museum-categorical via existing `--chart-series-N` token swap (palette tokens flip; component code unchanged), `cornerRadius={3}`, hairline 1px (currently 2px). NO stagger animation (per ADR design call 5 — accept V1↔V2 visual delta documented in CHARTS_SPEC §3 / TD-118).
- chart-tests β.1.4 baselines refresh (commit 109e4de) for DonutChart V1 + V2 only.

## Scope (out)

- Other 10 chart kinds in `CHARTS_SPEC.md` (LineChart V2 / AreaChart V2 / Bar / Treemap / Sparkline / Calendar / Stacked / Scatter / Waterfall / Candlestick) — Phase 2.
- AI chart-emission prompt update — `apps/ai/src/ai_service/llm/prompts.py` does not currently emit `ChartEnvelope` payloads; `donut` is referenced only in `allocation_drift` insight text. No prompt change required this slice. **New TD-AI-chart-palette-taxonomy** to track AI-side palette taxonomy update once the AI agent starts emitting ChartEnvelope.
- Showcase visual regression test suite (TD-112 — separate slice).
- AI agent staging deploy (RUNBOOK_ai_flip post-merge — separate concern).
- Legend click-to-filter (deferred per ADR design call 3 — TD entry «legend-click-to-filter dashboard-level» to be opened by FE).
- Inside-slice text labels and `--text-on-museum` token (flagged in `DONUT_GRADIENT_v2_draft.md` §WCAG; YAGNI).
- 5-series tritanopia hatch-pattern overlay (per `DONUT_GRADIENT_v2_draft.md` Open Q2 — gradient + outline replace the hatch in V2; tracked as TD-AI-chart-palette-taxonomy follow-on if PO later challenges).

## File-level changes

### `packages/design-tokens/tokens/primitives/color.json` (+ build artefacts)

- Add `color.museum.{slate,stone,fog-blue,plum,ochre}.{light,dark}` per `CHART_PALETTE_v2_draft.md` Section 4 (10 hex values).
- Add `color.ink-ramp.{light,dark}.1..7` per `CHART_PALETTE_v2_draft.md` Section 4 (14 hex values).
- Forest-jade and bronze primitives: UNCHANGED.

### `packages/design-tokens/tokens/primitives/motion.json`

- Add `motion.duration.donut-sweep` = `600ms`.
- Add `motion.duration.donut-slice-fade` = `180ms`.

### `packages/design-tokens/tokens/semantic/{light,dark}.json`

- Add `chart-categorical.1..5` references — order: `slate→ochre→fog-blue→plum→stone` per palette draft Section 4 «Order rationale» (hue spread maximised for 2-series and 3-series cases).
- Add `chart-sequential.1..7` references to `color.ink-ramp.{theme}.1..7`.
- Add `shadow.chart-slice-hover` semantic alias = layered stack `drop-shadow(0 1.5px 2px rgba(20, 20, 20, 0.12)) drop-shadow(0 0 4px var(--accent-glow))`. Dark theme: `rgba(241, 241, 241, 0.10)` for the first layer.
- KEEP existing `--chart-series-1..12` aliases intact for backward compatibility but **point `--chart-series-1..5` at the new museum-categorical hues** so V1 (Recharts) palette swaps automatically without code change.

### `packages/design-tokens/build/` (regenerated by `pnpm tokens:build`)

Generated CSS + JS bundles — do not hand-edit. FE runs `pnpm --filter @investment-tracker/design-tokens build` and commits artefacts.

### `packages/ui/src/charts/DonutChartV2.tsx` (palette + gradient + anatomy + interaction)

- Add `palette: 'categorical' | 'sequential'` prop (default `'categorical'`).
- Add `arcMode: 'full' | '270'` sugar prop (default `'full'`); when set, overrides `startAngleRadians`/`endAngleRadians` only if both are unset by caller. `'270'` resolves to `start = -3π/4`, `end = +3π/4` (bottom-opening).
- Default `cornerRadius` = 3 (currently 0). Implement cap rule per `DONUT_ANATOMY_v2_draft.md` §«Slice geometry» — `effectiveR = min(specifiedR, ringWidth/2, sliceArcLengthAtCenterline/4)`.
- Replace flat `<Cell>` fill with per-slice radial gradient: inject `<defs>` block with 5 `<radialGradient>` definitions (one per museum hue), `gradientUnits="userSpaceOnUse"`, `cx={cx} cy={cy} r={outerR} fx={cx} fy={cy}`, two stops (`offset="0%"` darker = museum-base L−0.10, `offset="100%"` rim = museum-base). Sector `fill={`url(#donut-${hueName}-${theme})`}` instead of CSS-var direct. Theme `theme` resolved from `document.documentElement.dataset.theme` (or fallback prop) — gradient hex values are theme-specific so we pre-render both sets and toggle via `data-theme` selector inside the SVG (or compute at render time via theme hook).
- INVERTED direction comment block per `DONUT_GRADIENT_v2_draft.md` §«Known design tension» — verbatim 3-line warning.
- Reduce hairline stroke from 2px → 1px + `vectorEffect="non-scaling-stroke"`. Stroke MANDATORY (not optional — WCAG mitigation for stone↔ochre ΔL=0).
- Hover treatment: replace single `drop-shadow(0 0 4px var(--accent-glow))` with `var(--shadow-chart-slice-hover)` token. Add bisector translation: compute `bisector = (bound.start + bound.end) / 2`, on `isActive && !prefersReducedMotion` compose `translate(${2*Math.cos(bisector)}px, ${2*Math.sin(bisector)}px)` with the existing `scale(1.02)`. Cap is 2px (non-negotiable).
- Sister-slice opacity: NO change on hover (Provedo register — explicit in `DONUT_ANATOMY_v2_draft.md` §«Hover» rule 3).
- Entrance animation: change from single shared `CHART_ANIMATION_MS` to **by-magnitude descending order** sequence (sort segments by value desc → `transition-delay: ${i * stagger}ms` mapped through that order, NOT input order). Total envelope 600ms, per-slice fade 180ms, stagger = `(600 - 180) / (n - 1)` for n=5 → 105 ms. Reduced-motion → instant render (no fade, no stagger).
- Sequential palette mode: when `palette === 'sequential'`, sort segments desc by value (caller responsibility OR component-side sort flagged via `ordinal: true` in payload meta — choose component-side for V2 ship), assign colors from `--chart-sequential-1..7` instead of categorical.

### `packages/ui/src/charts/DonutChart.tsx` (V1 — minimal touch)

- `<Pie cornerRadius={3}>`.
- Reduce slice border from 2px → 1px + `vectorEffect="non-scaling-stroke"`.
- NO bisector hover translation (V1 keeps 1.02× scale via existing `activeShape`).
- NO stagger animation (per ADR design call 5 — V1↔V2 delta accepted).
- Palette swap is automatic via the design-tokens `--chart-series-1..5` re-pointing — no component-code change for colors.
- Document V1 partial scope inline at top of file: `/* V1 Recharts — palette swap auto via tokens. Stagger + bisector translation NOT implemented (ADR design call 5; TD-118). */`.

### `packages/ui/src/charts/__tests__/DonutChartV2.test.tsx` (test deltas)

- Add test: default `cornerRadius={3}` triggers rounded path (existing test expects fast-ring on default — flip).
- Add test: `arcMode='270'` resolves to start=-3π/4, end=+3π/4.
- Add test: `palette='sequential'` cycles through ink-ramp tokens.
- Add test: `<defs>` block contains 5 `<radialGradient>` elements when `palette='categorical'`.
- Add test: each sector carries `stroke` + `vectorEffect="non-scaling-stroke"`.
- Add test: by-magnitude descending stagger order — segments sorted desc by value get `transition-delay` matching their rank, not their input index.

### `apps/web/src/app/design-system/_sections/charts.tsx`

- No code change needed; already imports `DonutChartV2 as DonutChart`. Visual regression confirmed via Playwright baseline refresh (`apps/web/playwright-tests/charts/charts.visual.spec.ts`).

### `apps/web/playwright-tests/charts/charts.visual.spec.ts`

- Snapshot baselines for DonutChart instances on `/design-system#charts` will fail — refresh via `pnpm test:e2e:charts -- --update-snapshots`. Stage diff for review per RUNBOOK_charts_visual_diff convention.

### `docs/CHARTS_SPEC.md` §3 + §4.4

- Add subsection «backend swap» under §3 documenting V1↔V2 stagger delta as deliberate (TD-118 cross-ref).
- Update §4.4 (DonutChart) — palette mode, arcMode, cornerRadius default, gradient «свет изнутри» direction, hairline mandate.

### `docs/TECH_DEBT.md`

- New TD: `legend-click-to-filter dashboard-level` (P3, trigger = first dashboard slice that surfaces filter requirement).
- New TD: `AI-chart-palette-taxonomy` (P3, trigger = first ChartEnvelope-emitting AI agent ships).
- Update TD-115 (V1 sunset) — add cross-ref to ADR design call 5.
- New TD-118 placeholder: `donut-stagger-V1-V2-delta` (P3, trigger = V2 becomes only backend → close).

---

## FE dispatch decomposition

Five sequential dispatches per CONSTRAINTS Rule 8.4 (target ≤ 15 min wall-clock each). Sequential, not parallel — Windows worktree isolation reliability concerns (Rule 8.3) + downstream files depend on D1 tokens.

### D1 — Tokens (museum + ink-ramp + motion + shadow)

- **Files:** `packages/design-tokens/tokens/primitives/color.json`, `tokens/primitives/motion.json`, `tokens/semantic/light.json`, `tokens/semantic/dark.json`. Run `pnpm --filter @investment-tracker/design-tokens build` to regenerate `build/`.
- **Acceptance:**
  - `color.museum.*` and `color.ink-ramp.*` primitives exist with values from palette draft Section 4.
  - `motion.duration.donut-sweep` (600ms) + `donut-slice-fade` (180ms).
  - Semantic `chart-categorical.1..5` order = slate→ochre→fog-blue→plum→stone.
  - `--chart-series-1..5` semantic re-pointed to museum-categorical (V1 palette swap path).
  - `shadow.chart-slice-hover` emits a 2-layer stack.
  - `pnpm typecheck` clean workspace-wide; `pnpm tokens:test` (Style Dictionary smoke) passes.
- **Skills:** `everything-claude-code:design-system`, `superpowers:test-driven-development` (token snapshot test), `everything-claude-code:plan`.
- **Verification:** `git diff packages/design-tokens/build/` shows new CSS custom properties; manual grep `var(--chart-categorical-1)` resolves; `pnpm typecheck` clean.

### D2 — DonutChartV2 anatomy + palette

- **Files:** `packages/ui/src/charts/DonutChartV2.tsx`, `packages/ui/src/charts/tokens.ts` (extend `CHART_TOKENS` with new shadow alias).
- **Acceptance:**
  - Default `cornerRadius` = 3 with cap rule implemented (rounded-path branch becomes default).
  - `arcMode` prop sugar layer wired with priority rules.
  - `palette` prop wired (`'categorical'` default, `'sequential'` sorts desc-by-value and uses ink-ramp tokens).
  - 1px hairline + `vectorEffect="non-scaling-stroke"` on all sector strokes.
  - All existing `DonutChartV2.test.tsx` tests still pass (the 7 baseline scenarios) + new tests pass.
  - `pnpm typecheck` clean.
- **Skills:** `everything-claude-code:frontend-patterns`, `superpowers:test-driven-development`, `everything-claude-code:plan`.
- **Verification:** `pnpm --filter @investment-tracker/ui test charts/__tests__/DonutChartV2.test.tsx` green.

### D3 — DonutChartV2 gradient «свет изнутри»

- **Files:** `packages/ui/src/charts/DonutChartV2.tsx` (gradient `<defs>` + sector fill swap), `packages/ui/src/charts/_shared/useThemeMode.ts` (NEW thin hook reading `document.documentElement.dataset.theme` if not already present — Grep first).
- **Acceptance:**
  - `<defs>` injected at SVG root with 5 `<radialGradient>` elements per active theme.
  - Each sector fill = `url(#donut-${hueName}-${theme})` (NOT direct CSS var).
  - INVERTED-direction inline comment block present verbatim.
  - Light + dark theme parity (manually toggle `<html data-theme>` in showcase, both render).
  - New gradient-presence test passes.
  - Existing tests still green.
- **Skills:** `everything-claude-code:frontend-patterns`, `superpowers:test-driven-development`, `everything-claude-code:design-system`.
- **Verification:** `pnpm --filter @investment-tracker/ui test`; visual smoke at `/design-system#charts` light + dark.

### D4 — DonutChartV2 hover + entrance

- **Files:** `packages/ui/src/charts/DonutChartV2.tsx` (hover + animation only).
- **Acceptance:**
  - Bisector translation 2px applied on hover/focus when `!prefersReducedMotion`.
  - Hover shadow uses `var(--shadow-chart-slice-hover)` token (replaces inline `drop-shadow`).
  - Sister-slice opacity unchanged on hover (regression-test the no-dim rule).
  - Entrance: by-magnitude descending stagger; n=5 → 105 ms stagger, 180 ms per-slice fade, 600 ms total envelope.
  - Reduced-motion: instant render, no transitions.
  - New stagger-order test passes.
- **Skills:** `everything-claude-code:frontend-patterns`, `everything-claude-code:accessibility`, `superpowers:test-driven-development`.
- **Verification:** `pnpm --filter @investment-tracker/ui test`; manually verify reduced-motion via OS toggle on showcase.

### D5 — V1 trim + showcase baselines + docs

- **Files:** `packages/ui/src/charts/DonutChart.tsx`, `apps/web/playwright-tests/charts/charts.visual.spec.ts` (snapshot refresh), `docs/CHARTS_SPEC.md` §3 + §4.4, `docs/TECH_DEBT.md` (4 new/updated entries).
- **Acceptance:**
  - V1 `cornerRadius={3}` + `strokeWidth={1}` + `vectorEffect`.
  - V1 file header comment block documenting V1↔V2 visual delta + ADR cross-ref.
  - β.1.4 chart-test snapshots refreshed for DonutChart V1 + V2 only.
  - CHARTS_SPEC §4.4 reflects museum palette + gradient + anatomy.
  - TECH_DEBT.md has new entries: `legend-click-to-filter`, `AI-chart-palette-taxonomy`, `donut-stagger-V1-V2-delta`; TD-115 cross-ref updated.
- **Skills:** `everything-claude-code:frontend-patterns`, `everything-claude-code:browser-qa`, `everything-claude-code:architecture-decision-records`.
- **Verification:** `pnpm --filter @investment-tracker/ui test`; Playwright snapshot diff reviewed; `pnpm typecheck` clean workspace-wide.

---

## Acceptance criteria (full slice)

- [ ] Museum-palette tokens emit correctly via Style Dictionary build (`pnpm tokens:build` clean; CSS vars resolved at runtime).
- [ ] Ink-ramp 7-step tokens emit correctly.
- [ ] DonutChart V2 renders with museum-categorical palette by default; ink-ramp when `palette='sequential'`.
- [ ] Per-slice radial gradient «свет изнутри» visible (dark center → bright rim) in light + dark theme.
- [ ] INVERTED-direction inline comment present in DonutChartV2.tsx.
- [ ] 1px hairline outline mandatory on every slice (light: `var(--card)`, dark: `--chart-grid-dark`); `vector-effect="non-scaling-stroke"`.
- [ ] Default `cornerRadius` = 3 px with cap rule (no «pinching» on <8% slices).
- [ ] Drop shadow static on chart wrapper; hover shadow intensified via `--shadow-chart-slice-hover` token; 2px bisector translation on active slice.
- [ ] Sister slices NOT dimmed on hover (Provedo register).
- [ ] Entrance animation by-magnitude descending; 600ms / 180ms / 105ms (n=5).
- [ ] Reduced-motion fallback: instant render, no fade, no stagger.
- [ ] Legend rendered below the chart (existing — preserved).
- [ ] `arcMode='full'` default; `'270'` opt-in resolves to bottom-opening 270°.
- [ ] `palette` prop wired (`'categorical' | 'sequential'`).
- [ ] V1 (Recharts) palette swap automatic via token re-pointing; cornerRadius=3; 1px hairline.
- [ ] V1↔V2 stagger delta documented in CHARTS_SPEC §3 + TD-118.
- [ ] chart-tests β.1.4 baselines refreshed for DonutChart only.
- [ ] Showcase `/design-system#charts` displays new DonutChart V2 visually correct in light + dark.
- [ ] `pnpm typecheck` clean workspace-wide.
- [ ] All existing chart tests still pass + new D2/D3/D4 tests pass.
- [ ] CHARTS_SPEC §4.4 updated.
- [ ] 4 TD ledger entries created/updated.

## Risks / open items

1. **Theme detection inside SVG.** `gradientUnits="userSpaceOnUse"` requires hex values; we pre-render both light + dark gradient sets and select via `<html data-theme>` reading. Risk = SSR hydration mismatch if read happens during initial render. Mitigation = read in `useEffect` + default to light during SSR, accept a 1-frame light-flash on dark-theme cold-load (consistent with other theme-aware chart components).
2. **Stone ↔ ochre tritanopia ΔL=0 collision** (palette draft §3, gradient draft §«Adjacent slice ΔL»). 1px hairline outline is the WCAG mitigation — if outline is ever conditionally disabled the WCAG case fails. Test must enforce outline presence.
3. **Token consumer fan-out.** Re-pointing `--chart-series-1..5` to museum hues will visually flip every chart that consumes those tokens (LineChart V1, BarChart V1, etc.) — that's intended (palette swap) but Phase 2 chart redesigns may need their own re-evaluation. Surface in standup.
4. **V1 Recharts cornerRadius behaviour with semicircle.** Untested with our codebase's existing `<Pie startAngle/endAngle>` configuration. D5 must visually verify in showcase before snapshot refresh.
5. **Magnitude-sort entrance vs caller-controlled order.** Spec is descending-by-value. If caller pre-sorted ascending for editorial reason (rare), the animation will reorder visually. Document in CHARTS_SPEC §4.4 + JSDoc.
6. **AI-prompt scope deferral.** Right-Hand kickoff inputs mention «AI prompt updated» but the AI service does not currently emit `ChartEnvelope`. Captured as TD-AI-chart-palette-taxonomy; flagged here to confirm with PO that deferral is acceptable.

## Independent review trigger (Rule 5)

After D5 lands, dispatch parallel reviewer fan-out per `project_post_phase2_review_plan.md`:

- **typescript-reviewer** — types, generics, Zod boundaries, theme hook safety.
- **a11y-reviewer** — reduced-motion fallback, focus order, sister-slice no-dim verification, keyboard navigation parity, WCAG outline mandate.
- **security-reviewer** — XSS surface on SVG `<defs>` injection (none expected), `dangerouslySetInnerHTML` audit (none expected), token leak via CSS vars.
- **finance-advisor** — palette taxonomy applied to portfolio-allocation register; verify museum hues read as «calm-analytical caretaker» on real fixture data.
- **legal-advisor** — no claims, decorative palette only — sanity scan only.
- **architect** — token additions match plugin architecture pattern; theme-mechanism alignment with `data-theme` ADR; backend-dispatcher invariants preserved.

Aggregate at `docs/reviews/2026-04-29-donut-v2-aggregate.md` BEFORE opening consolidated PR.

## Cross-references

- `docs/DECISIONS.md` «2026-04-29 — Charts palette: museum-vitrine extension + ink tonal default».
- `docs/DECISIONS.md` «2026-04-29 — DonutChart anatomy + interaction: 5 PO-delegated design calls».
- `docs/DECISIONS.md` «2026-04-29 — Theme mechanism: `data-theme` attribute on `<html>`».
- `docs/design/CHART_PALETTE_v2_draft.md`, `docs/design/DONUT_GRADIENT_v2_draft.md`, `docs/design/DONUT_ANATOMY_v2_draft.md`.
- `docs/design/CHARTS_SPEC.md` §2.7 (12-hue editorial extension — superseded by museum extension), §4.4 (DonutChart spec — to update).
- `docs/engineering/kickoffs/2026-04-29-charts-fe.md`, `2026-04-29-charts-backend.md`, `2026-04-29-charts-qa.md` (Phase 1 kickoffs).
- `docs/reviews/2026-04-29-charts-palette-aggregate.md` (palette specialist review).
- `packages/ui/src/charts/DonutChartV2.tsx`, `DonutChart.tsx`, `tokens.ts`, `__tests__/DonutChartV2.test.tsx`.
- `packages/design-tokens/tokens/primitives/{color,motion}.json`, `tokens/semantic/{light,dark}.json`.
- `apps/web/src/app/design-system/_sections/charts.tsx`, `apps/web/playwright-tests/charts/charts.visual.spec.ts`.
- chart-tests β.1.4 checkpoint commit `109e4de`.
- CONSTRAINTS.md Rule 8.3 (Windows dispatch hygiene → sequential not parallel), Rule 8.4 (≤15 min wall-clock per dispatch), Rule 6 (no velocity metrics), Rule 7 (skill brief required).
