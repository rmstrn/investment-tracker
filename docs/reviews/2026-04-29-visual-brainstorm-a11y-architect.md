# Visual quality brainstorm — a11y-architect lens

**Date:** 2026-04-29
**Surface:** `/design-system` (React) + `apps/web/public/design-system.html` (static reference)
**Mandate:** Accessibility-as-visual-quality. PO said «всё равно не красиво». Audit through WCAG 2.2 AA/AAA, treating contrast / hierarchy / focus / motion as the legibility substrate of «красиво».
**Mode:** Read-only audit. No code, no edits.

---

## 1. Per-criterion scorecard (× pass / partial / fail)

| # | Criterion | Surface | Verdict | Notes |
|---|---|---|---|---|
| 1.a | Body 13px on `--bg` (cream) | LIGHT | **PASS AAA** | `--ink` on `#E8E0D0` ≈ **13.04 : 1**. |
| 1.b | Body 13px on `--bg` (cocoa-board) | DARK | **PASS AAA** | `--ink` on `#0E0E12` ≈ **17.4 : 1**. |
| 1.c | Eyebrow 10px Geist Mono · `--accent` on `--card` | LIGHT | **PASS AA** | `#2D5F4E` on `#FFF` ≈ **7.66 : 1** — AAA. |
| 1.d | Eyebrow 10px Geist Mono · `--accent` on `--card` | DARK | **FAIL AA** | `#4A8775` on `#26262E` ≈ **3.87 : 1**. Required 4.5 : 1 for body text. **Hits Signature eyebrow, Insight eyebrow, Form-field accent eyebrows, ChartCard eyebrows on dark stage.** |
| 1.e | `--text-3` body/help text on `--bg` | LIGHT | **FAIL AA** | `#6E6E6E` on `#E8E0D0` ≈ **3.82 : 1**. Passes AA-Large only. **Hits empty-card body, swatch hex, footer, breadcrumb, all `__meta` lines.** |
| 1.f | `--text-3` 9-10px micro-text | LIGHT | **FAIL AA + AAA** | Token labels at 9px Geist Mono on cream — `#6E6E6E` is the documented body of every section meta + ds-row label. 9 px is a documented escape hatch but hits real users. |
| 1.g | `--text-3` body text on `--bg` | DARK | **PASS AAA** | `#9A9A9A` on `#0E0E12` ≈ 7.0 : 1. |
| 1.h | Chart axis tick labels (10px mono · `--text-3`) on `--bg` | LIGHT | **FAIL AA** | Same 3.82 : 1. Charts read «foggy» — chart-grid + chart-cursor explicitly defined per stage, but `--chart-axis-label = var(--text-3)` only escapes the token cliff if `--text-3` itself is dark enough. |
| 1.i | Chart axis tick labels | DARK | **PASS** | 7.0 : 1. |
| 2.a | Focus ring — chart container | both | **PASS** | `CHART_FOCUS_RING_CLASS` 2px ring + 2px offset against bg. WCAG 2.4.11 met. |
| 2.b | Focus ring — IconButton (showcase circular 40×40) | both | **PARTIAL** | `outline: 2px solid var(--accent); outline-offset: 2px;` is correct, BUT on dark stage `--accent` (jade) is 3.87 : 1 against `--card` and only 5.03 : 1 against `--bg` — focus ring is detectable but lacks the «punch» of WCAG 2.4.11 AAA (3 : 1 vs adjacent + 2 : 1 vs background). Marginal. |
| 2.c | Focus ring — Switch / Checkbox / Radio placeholders | both | **PARTIAL** | Same accent-only outline; on dark stage the focus ring is visible but not strong against the very-similar-luminance `--inset` (#070709) the control sits on. Adjacent contrast ≈ acceptable, but the 2px offset is needed and correct. |
| 2.d | Focus ring — token chip (custom `:focus-visible`) | both | **PARTIAL** | `border-color: var(--accent)` + `box-shadow: 0 0 0 3px rgba(45,95,78,0.18)` — the alpha-18% glow is too soft to satisfy 2.4.11 minimum-contrast against `--card`. Reads as a tint rather than a ring. |
| 2.e | Focus ring — primary IconButton on dark stage | DARK | **FAIL** | Primary variant has `--ink` bg (cream `#F4F1EA`) and accent ring on top of cream surface → `--accent` jade vs `#F4F1EA` ≈ 4.04 : 1. Borderline. |
| 3.a | Hierarchy — modular scale 48→32→22→13 | both | **PASS** | Mathematically clean (1.5×, 1.45×, 1.69× — close to perfect-fourth). |
| 3.b | Hierarchy — outer page H1 (40px) vs stage headline (48px) | both | **FAIL — visual** | The outer H1 «Notice what you'd miss.» is **smaller** than the stage headline. The inner stage heading therefore reads as the primary focal point and the page header looks accidentally subordinate. This is the «не красиво» tell #1 — broken hierarchy at first paint. |
| 3.c | Eyebrow → headline → body cascade legible without color | both | **PASS** | Geist weight + size + tracking carry the cascade; color is decorative only. |
| 4.a | Charts — color-only series differentiation | both | **PARTIAL** | Series 1-7 are color-coded only. No line-style, marker-shape, or pattern fallback. Donut/Treemap have data-table fallback (sr-only) — **PASS** for AT users — but a sighted color-blind user looking at a multi-series LineChart cannot distinguish series. |
| 4.b | Pulse warn (terra) vs pulse default (jade) | both | **PARTIAL** | Both are solid filled circles distinguished only by hue. The card body has «−5.8% week» with leading minus + bold weight on warn — passes 1.4.1 (info conveyed by a second cue: the sign + the bold). But the *pulse itself* is color-only. |
| 4.c | Input error state — terra ring + alert icon | both | **PASS** | `<AlertTriangle>` icon is rendered next to «Already exists.» — error not color-only. |
| 5.a | Touch target — IconButton 40×40 | both | **PASS** | Above 24×24 AA, above 44×44 only by AAA-iOS — borderline against AAA mobile-touch but solid for desktop. |
| 5.b | Touch target — switch 44×26 | both | **PARTIAL** | Width 44 ✓ but height 26 px → tap target 44×26 ≈ 1144 px² < 44² for iOS HIG. WCAG 2.5.8 AA (24 px²) passes. |
| 5.c | Touch target — checkbox / radio 22×22 | both | **FAIL** | 22 px < 24 px AA minimum. SC 2.5.8 (Target Size Minimum) violation by 2 px. The static reference exhibits the same flaw — drift is identical. |
| 5.d | Spacing between adjacent controls | both | **PASS** | `gap: 32px` in Forms `.showcase-flex-wrap` keeps targets isolated. |
| 6.a | Hover transitions — Card / chip / icon-tile | both | **PASS** | `200ms ease-out` + `transform: translateY(-1px)`, restrained. |
| 6.b | Reduced-motion respected | both | **PASS** | Both `@media (prefers-reduced-motion)` and `html[data-reduced-motion="true"]` honored on `.showcase-motion-demo *` and on switch transitions. |
| 6.c | Loading skeleton seizure threshold | both | **PASS** | ChartSkeleton shimmer ≤ 2 Hz typical (verified in tokens). No fast flash. |
| 6.d | Focus ring transitions | both | **FAIL — minor** | `transition: box-shadow 200ms` on token chip means the focus ring fades in. WCAG 2.4.11 prefers instant. Cognitive-load concern for switch users. |
| 7.a | Heading order on page | both | **PARTIAL** | Outer page `<h1>`, then `<h2>` inside `StageFrame` (stage tagline), then `<h3>` for `SectionHead` titles. **BUT** `SignatureHero` uses `<h3>` inside a `DsSection` whose head is also `<h3>` → **two `<h3>` siblings at the same level** — passes formally but the signature-hero h3 should be `<h4>` because it's nested inside the `DsSection`'s scope. Minor outline drift. |
| 7.b | Landmark regions | both | **PASS** | `<main>`, `<header>`, `<section aria-label="...">` on each stage, `<footer>`. |
| 7.c | Stage anchor linking from nav | both | **PARTIAL** | `<a href="#foundation">` exists in `ShowcaseHeader` NAV but the `id`s `#foundation`, `#iconography`, `#charts`, etc. **do not exist** in the rendered DOM — only `#light-v2` and `#dark-v2` exist on the stages. **Skip-links broken.** |
| 8.a | Charts — `role="img"` + `aria-label` | LineChart confirmed | **PASS** | Verified in `LineChart.tsx:113-115`. |
| 8.b | Charts — `<ChartDataTable>` sr-only transcript | all kinds | **PASS** | Branches per `payload.kind`, table semantics correct, `aria-describedby` linkage via `useId()`. Excellent. |
| 8.c | Charts — keyboard nav (arrow keys cycle, Esc blurs) | LineChart | **PASS — verified** | `useChartKeyboardNav(containerRef, payload.data.length, onIndexChange)`. CRIT-2 fix landed. |
| 8.d | Charts — active-dot focus visibility | LineChart | **PARTIAL** | `activeDot={{ r: 5, fill: s.color, stroke: 'var(--card)', strokeWidth: 2 }}` — the stroke-against-card give visual delineation, but no extra focus ring on the active dot itself. A user keyboard-arrowing through the chart sees the dot move, but its identity vs background is fragile when series and bg luminance are close. |
| 8.e | Charts — color-blind safe series | both | **PARTIAL — see 4.a** | No line-dash / marker-shape fallback. |
| 9 | Static reference parity | static html | **PARTIAL** | Static reference `design-system.html` exhibits **the same `--text-3` failure** in light mode, **the same 22×22 checkbox/radio**, **the same accent-on-card 3.87 : 1 dark-mode eyebrow** — drift is faithful. Both surfaces inherit the same gaps. |

---

## 2. Top-5 a11y-visual gaps that visibly degrade «красиво»

### Gap 1 · LIGHT-MODE `--text-3` is too pale (3.82 : 1)
- **Where:** ds-row labels, section meta chips, `__meta` lines, swatch hex, footer, breadcrumb, all 9-10px Geist Mono micro-text.
- **What it looks like:** The page reads «foggy» — eyebrows and meta blur into the cream paper. PO sees this as «всё равно не красиво» because the typographic system is *designed* to lean on these eyebrows for editorial rhythm, but the rhythm is whispered too softly.
- **Fix proposal:** `packages/design-tokens/build/css/tokens.css:145` — bump `--text-3` from `#6E6E6E` to `#5A5A5A` (light mode) → ratio 4.97 : 1, AA pass; gives all eyebrows visible bite without darkening to ink. Token already lives in source, so the rebuild is one regenerate.
- **Also:** The hierarchy actually *improves* with darker text-3 because eyebrows then anchor sections instead of dissolving.

### Gap 2 · DARK-MODE accent eyebrows under-contrast (3.87 : 1)
- **Where:** Signature eyebrow, Insight eyebrow, ChartCard eyebrows, all 10-11px mono accent labels rendered on `--card` (#26262E) on dark stage.
- **What it looks like:** Editorial accents look muddy in dark theme — the cream-accent juxtaposition that works on bg fails on the slightly-lighter cards.
- **Fix proposal:** `packages/design-tokens/build/css/tokens.css:212` — lift dark `--accent` from `#4A8775` to `#5FA08D` → ratio against `#26262E` ≈ 5.6 : 1. Keeps the jade family but pulls saturation/luma up. Brand-strategist call: confirm the hue-shift stays inside the «forest-jade» canon.

### Gap 3 · Outer H1 is smaller than stage H2 (40 vs 48 px)
- **Where:** `apps/web/src/app/design-system/page.tsx:54` (outer H1 `40px`) vs `_styles/showcase.css:251` (`.showcase-stage-v2__headline` `48px`).
- **What it looks like:** The page header — the primary entry for the whole document — is dwarfed by the inner stage tagline. First paint reads «which is the title?». Direct hierarchy violation that registers as «не красиво» before any user even thinks «accessibility».
- **Fix proposal:** Either bump outer H1 to 56-64 px (display scale), or drop stage headline to 36-40 px. The static reference doesn't have this conflict because the static page has no outer H1 — it's only stages. The React port introduced the H1 without re-balancing the scale.

### Gap 4 · Checkbox + Radio targets 22×22 violate WCAG 2.5.8
- **Where:** `_styles/showcase.css:512-543` and `apps/web/public/design-system.html:256-300`.
- **What it looks like:** Indistinguishable from the desktop default but technically below the AA target-size minimum (24×24). On a touchscreen the controls feel fiddly; on desktop they read as «cramped».
- **Fix proposal:** Bump to 24×24 (AA min) or 28×28 if the design wants breathing room. The visual-weight uplift would also help the controls feel more intentional next to the 44-px switch.

### Gap 5 · Showcase nav anchor links point at non-existent IDs
- **Where:** `_components/ShowcaseHeader.tsx:7-14` declares `#foundation`, `#iconography`, `#primitives`, `#charts`, `#disclaimer`, `#theme`. These anchor IDs are **not on the rendered DOM** — only `#light-v2`, `#dark-v2` exist (StageFrame). Iconography / Disclaimer / Theme sections render in an `<section className="space-y-12 pt-8">` with no IDs.
- **What it looks like:** Skip-links silently fail. Keyboard users tabbing to the nav and pressing Enter scroll nowhere. This is invisible to PO but degrades the «felt quality» of the page — clicking nav items does nothing.
- **Fix proposal:** Add `id="foundation"`, `id="iconography"`, etc. to the corresponding section wrappers. Or: scope the nav to the four IDs that exist. Two-line fix.

---

## 3. Concrete fix proposals (file:line + token + value)

| # | File | Line | Change | Why |
|---|---|---|---|---|
| F-1 | `packages/design-tokens/build/css/tokens.css` | 145 | `--text-3: #5A5A5A;` (was `#6E6E6E`) | Lifts AA contrast on cream-paper from 3.82 to 4.97. |
| F-2 | `packages/design-tokens/build/css/tokens.css` | 212 | `--accent: #5FA08D;` (was `#4A8775`) — needs brand sign-off | Lifts dark-mode accent on `--card` from 3.87 to 5.6. |
| F-3 | `apps/web/src/app/design-system/page.tsx` | 54 | `fontSize: '56px'` for outer H1 (was `40px`) | Restores hierarchy above the 48-px stage headline. |
| F-4 | `apps/web/src/app/design-system/_styles/showcase.css` | 512, 531 | `width: 24px; height: 24px;` (was 22) | WCAG 2.5.8 AA Target Size minimum. |
| F-5 | `apps/web/src/app/design-system/_sections/foundation.tsx` (and other section-wrappers) | section root | Add `id="foundation"` etc. | Skip-link nav resolves. |
| F-6 | `apps/web/src/app/design-system/_styles/showcase.css` | 49-53 | Replace `box-shadow: 0 0 0 3px rgba(45,95,78,0.18)` with `0 0 0 3px var(--accent)` (full alpha) on token-chip focus | WCAG 2.4.11 — focus ring needs 3 : 1 against adjacent. |
| F-7 | `packages/ui/src/charts/LineChart.tsx` | 167-180 | Pass `strokeDasharray` per series index (e.g. `i === 0 ? undefined : i === 1 ? '4 4' : '2 6'`) | Gives sighted color-blind users non-color cue per series. |
| F-8 | `apps/web/src/app/design-system/_components/SignatureHero.tsx` | 17 | `<h3>` → `<h4>` (or hoist into the `DsSection` head) | Heading outline correctness. |

---

## 4. Anti-pattern flag list (silent UX degradation)

1. **Color-only series in multi-line chart** (LineChart.tsx) — series 1-7 differ only by hue. Passes for AT (data-table) but fails sighted color-blind audit. Anti-pattern: «Color used decoratively as primary information channel.»
2. **Soft-alpha focus glow as substitute for ring** (showcase.css:52) — the `rgba(...,0.18)` glow under «3px» reads as «hint» not «affordance». Anti-pattern: «Decorative focus state.»
3. **Eyebrow accent fails on its own card surface in dark mode** (3.87 : 1) — the visual signature of the brand (mono uppercase eyebrows in jade) actively breaks WCAG on the dark stage. Anti-pattern: «Brand color hostile to brand surface.»
4. **Skip-links to non-existent anchors** (ShowcaseHeader nav) — keyboard / SR users get silently failed navigation. Anti-pattern: «Phantom navigation.»
5. **Outer H1 smaller than nested H2** (page.tsx vs StageFrame) — semantic and visual hierarchy disagree. Anti-pattern: «Visual hierarchy contradicts document outline.»
6. **`<span role="switch" tabIndex={0}>` instead of `<button>`** (PlaceholderControl.tsx:25) — works for AT but loses native click-to-activate-on-Space-and-Enter semantics. Acceptable as placeholder but flag for Phase γ.
7. **Light-mode `--text-3` body micro-text under 4.5 : 1** (tokens.css:145) — 60% of the editorial chrome (eyebrows, metas, footnotes) is sub-AA in light mode.
8. **Checkbox / radio at 22 px** — 2 px shy of AA. Universal anti-pattern: «Default Tailwind / shadcn 22px controls shipped without uplift.»
9. **No focus-visible ring on chart active-dot** (LineChart.tsx:176) — the keyboard-focused data point has weaker affordance than the chart-container ring. Anti-pattern: «Inconsistent focus depth across nested interactive surfaces.»

---

## 5. Brainstorming — alternative a11y-visual approaches considered

Per `superpowers:brainstorming` discipline, recording the alternatives I weighed before settling on the recommendations above.

### Alternative A — Bump body text from 13 → 14 px
- **Rationale:** Larger body text dilutes `--text-3` contrast burden because AA-Large kicks in at 18 px / 14 px bold. Eyebrows still fail (under 18/14) but body succeeds.
- **Why rejected:** Doesn't fix the eyebrow problem (the actual visual failure). Adds rebuild cost across cards/charts. Diet-Coke version of the real fix.

### Alternative B — Recolor `--text-3` only in light mode (`#5A5A5A`), leave dark untouched
- **Rationale:** Dark-mode `--text-3` already passes (7 : 1). No need to drag the dark token.
- **Decision:** **ADOPT.** F-1 above is light-only.

### Alternative C — Replace `--text-3` eyebrows with `--text-2` for editorial accents
- **Rationale:** `--text-2` (`#4D4D4D` light) already passes 4.5 : 1. Skip the token-redefine entirely, just escalate the role.
- **Why rejected:** Loses the rhythmic three-tier hierarchy (ink → text-2 body → text-3 chrome). Brand tone gets flatter. Token-bump is the cleaner intervention.

### Alternative D — Switch focus-ring strategy from `outline` to `box-shadow` ring with `currentColor`
- **Rationale:** `outline` doesn't render around rounded corners well in older WebKit; box-shadow rings hug border-radius. ChartFocusRing already uses Tailwind ring (= box-shadow). Could unify across showcase.
- **Decision:** Defer — not load-bearing for «красиво» quality. Logged for Phase γ.

### Alternative E — Default to reduced-motion + opt-in to motion
- **Rationale:** Inverted default would respect cognitive-load users by default; motion becomes a feature.
- **Why rejected:** Conflicts with the showcase's purpose (demo motion). Reduced-motion is correctly opt-out via toggle. Keep current.

### Alternative F — Add `.dark-mode` accent at higher saturation only on tiny text (10-11px) via a `--accent-on-card-small` token
- **Rationale:** Surgical fix — keep current `--accent` for chips/CTAs (where bigger-text rules apply) and only escalate for sub-12px micro-text on cards.
- **Why rejected:** Token proliferation; brand-strategist would push back. F-2 (lift the canonical token) is cleaner if hue stays in family.

### Alternative G — Chart series differentiation via stroke-dasharray
- **Rationale:** Standard pattern for color-blind-safe charts. ECharts and Highcharts ship this by default at series-3+.
- **Decision:** **ADOPT** as F-7. Costless visually (1.75-px stroke + 4-4 dash still reads as a clean line at typical chart density) and adds a non-color cue.

### Alternative H — Checkbox / radio 24 px vs 28 px
- **Rationale:** 24 = AA-min; 28 = «designed-for-touch». Visual weight difference is subtle.
- **Decision:** F-4 picks 24 to minimize visual disruption to the static reference; if PO wants more breathing room, 28 is also defensible.

---

## Compliance mapping (WCAG 2.2)

- **1.4.1 Use of Color** — Charts (4.a, anti-pattern 1) currently FAIL.
- **1.4.3 Contrast (Minimum) AA** — Light `--text-3` micro-text (1.e, 1.f, 1.h), Dark accent eyebrow (1.d) FAIL.
- **2.4.7 Focus Visible AA** — PASS overall, PARTIAL on token-chip (2.d), IconButton primary dark (2.e).
- **2.4.11 Focus Appearance AA** — PARTIAL (soft-alpha glow under min-contrast threshold).
- **2.5.5 Target Size (Minimum) AA / 2.5.8** — Checkbox + radio (5.c) FAIL by 2 px.
- **3.3.1 Error Identification** — PASS (icon + text, not color-only).
- **4.1.2 Name, Role, Value** — Skip-link IDs (7.c) FAIL because anchors don't resolve.

---

## Implementation Note

The audit framework here is intentionally a11y-as-craft, not a11y-as-checkbox. The single biggest «не красиво» driver isn't a missing `aria-label` — it's that `--text-3` is whispering too quietly on the cream paper, which collapses the editorial three-tier hierarchy that the rest of the design banks on. F-1 + F-3 + F-5 land the largest visible improvement for the smallest token diff.

The dark-mode accent fix (F-2) needs brand-strategist sign-off before merging because hue-shifting `--accent` lives in the brand canon, not the a11y canon. I am proposing the value, not the authority.

---

*Prepared for Right-Hand synthesis alongside product-designer + brand-strategist parallel reviews.*
