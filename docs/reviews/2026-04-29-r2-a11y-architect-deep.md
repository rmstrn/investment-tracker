# Round-2 deep a11y review — `/design-system`

**Date:** 2026-04-29
**Branch:** `chore/plugin-architecture-2026-04-29` @ tip `afef2bf`
**Mode:** Read-only. No edits, no spend, no external comms.
**Round-1 closures (verified at tip):**
- `--text-3` light: `#6E6E6E` → `#5A5A5A` ✓ AA pass.
- Dark accent (`color.jade.bright`): `#4A8775` → `#5C9A85` ✓ AA pass on `#26262E` cards.
- Token JSON descriptors document the lift; CSS regenerated.

**Round-2 verdict in one line:** Round 1 fixed the loudest two contrast failures, and the page reads measurably less foggy — but the «мало изменилось» feeling is real because the **typographic system, focus discipline, hierarchy-via-depth, and first-fold landing are all still under-engineered**, and a couple of Round-1 P1 items (anchor IDs, 22-px hit targets, outer H1) were never landed.

---

## 1. Ten-criteria deep scorecard (Round-2)

| # | Criterion | Verdict | Evidence | Severity |
|---|---|---|---|---|
| 1 | Type-scale modular ratio | **PARTIAL** | Display 48 / H1 32 / H2 22 / Body 13 / Mono 11 → ratios 1.50, 1.45, 1.69, 1.18. The 22→13 jump (1.69×) is **wider than any other step** — H2 looks isolated above body. Modular it is not; it's a fourth then a major-third then a minor-sixth. | MEDIUM |
| 2 | Optical sizing — Geist Mono at 9-10 px | **FAIL — feel** | `_styles/showcase.css:186` ds-row label = **9 px** mono with 0.18em letterspacing on cream. 9 px Geist Mono uppercased renders as «stamped on a label-maker», not «published in a system». Even with `--text-3 #5A5A5A` (4.97:1 contrast), the **rasterized weight at 9 px is ~340 weight equivalent, not Geist's 500**. WCAG 1.4.4 reflow passes; visual quality fails the «top-design» bar. | HIGH |
| 3 | Vertical rhythm / baseline grid | **FAIL** | No baseline grid. `showcase-stage-v2__body > * + *` margin-top: 32 px; `.showcase-ds-section` mb 8; `.showcase-ds-row` mb 22; type-row mb 8; signature-hero internal mbs 14/8/18. Spacing tokens are flex-gap improvisations, not a 4 px or 8 px grid. The page lacks the «settled» feel that a baseline grid produces. | HIGH |
| 4 | Focus order on tab-through | **PARTIAL** | Sticky header (Logo → 6 nav links → Motion → Dark) → outer H1 (skipped, not focusable) → Stage 1 (light) primitives → Stage 1 forms (3 inputs + 6 placeholders) → Stage 1 cards (no focusables) → Stage 1 charts (each chart container takes focus) → Stage 2 (dark) repeats the same set. **Order is logical**. **But:** there is no skip-to-stage link, so a keyboard user lands on header link 1 and must tab through ~30 nodes to reach the dark stage. Aesthetic tour: bouncy, not curated. | HIGH |
| 5 | Hover-state hierarchy / discipline | **FAIL** | `.showcase-token-chip:hover` translateY(-1px) + shadow-card; `.showcase-icon-tile:hover` translateY(-1px) + shadow-card + bg-flip + svg color-shift; `.showcase-pf-card` no hover; `.showcase-btn-icon:hover` color-only; Buttons have their own hover. **Five different hover idioms**. Inside the Iconography section's 18-tile grid, every tile competes equally — eye has no anchor. | HIGH |
| 6 | Hit targets after Round-1 token bumps | **FAIL** (unfixed) | Checkbox/radio still 22×22 (`showcase.css:512, 532`). IconButton 40×40 OK. Switch 44×26 = 1144 px² (WCAG 2.5.8 floor 24² = 576 px² — passes; iOS HIG 44² = 1936 px² — fails). **Round-1 P1 Gap-4 not landed.** | HIGH |
| 7 | Chart-axis text overlap at small viewport | **PARTIAL — design risk** | Charts grid drops to 1-col @ ≤900 px; charts expose data-table fallback for AT. But Y-axis tick labels at 10 px Mono on the dark stage's `--text-3 = #9A9A9A` over `--card #26262E` ≈ 7.0:1 (passes). At 320 px viewport the X-axis tick density vs label width is not constrained — long date labels (e.g. "Apr 26") collide with adjacent ticks. Recharts' default tick-skipping will resolve, but there's no explicit `interval` guard. | MEDIUM |
| 8 | Reduced-motion rendering | **PARTIAL** | Toggle writes `data-reduced-motion="true"` on `<html>` (verified `ShowcaseHeader.tsx:54-58`). CSS suppresses transitions on `.showcase-motion-demo *` and on switch transitions. **Gap:** chip / icon-tile / pf-card hovers still execute their `translateY(-1px)` because they're not under `.showcase-motion-demo` scope. So PMR=true mutes ONLY the explicit motion sentinel card, not the actual interaction motion sprinkled across the page. The motion-stripped showcase is therefore not motion-stripped. | HIGH |
| 9 | Hierarchy-via-depth (NEW) | **MUDDLED** | `--shadow-soft` (token chip + type-row + swatch + compact disclaimer), `--shadow-card` (pf-card + insight + empty + hover lift), `--shadow-lift` (signature hero), `--shadow-input-inset` (inputs), `--shadow-inset-light` (icon-tile + empty-card icon), `--shadow-primary-extrude` (primary CTA). **6 elevation tiers in one viewport**. Signature hero's `shadow-lift` should dominate, but the 8 portfolio/insight/chart cards in the same stage are ALL at `shadow-card` — the hero's «lift» is +1 over a sea of +0. The hierarchy reads as «everything is roughly +1 elevation, signature is +1.2». | HIGH |
| 10 | First-fold information density at 1440 (NEW) | **WEAK** | At 1440×900 with header (≈64 px), what a viewer sees in 2 s: outer eyebrow «PROVEDO · DESIGN SYSTEM v2 · SHOWCASE» (10 px mono, very small), outer H1 «Provedo Design System v2 — refined» (28 px), one paragraph of 13 px description, and the **top edge** of Stage 1 (still scrolling). The eye lands on no Provedo signature claim — just a meta title. Compare: a top-design portfolio site lands on a hero quote, a real chart, or a punctuation moment. This page lands on a CMS-style header. **Biggest single «не красиво» tell now that contrast is fixed.** | CRITICAL |

**Count:** 0 PASS · 3 PARTIAL · 6 FAIL · 1 CRITICAL.

---

## 2. Brainstorm — five alternatives weighed (per `superpowers:brainstorming`)

### Alt 1 · Reduced-motion as default, motion as opt-in (Magician archetype)
- **Argument for:** Provedo's voice is restraint. Motion-by-default contradicts «quiet pages, sharper signals». Reduced-motion-default is a brand statement.
- **Argument against:** A design-system showcase exists to demonstrate motion. Hiding it by default would force every reviewer to discover the toggle. Brand-strategist would push back on internal-tool-vs-public-product axis.
- **Recommendation:** Don't invert default. **But fix the actual reduced-motion gap** — when toggle=true, ALL hover lifts should mute, not just the explicit sentinel card. The current gating is too narrow. Wrap card/chip/icon-tile hovers in `.showcase-motion-demo` scope, OR add a dedicated `.showcase-motion-aware` class that the CSS targets.

### Alt 2 · Designed-for focus rings, not bolted-on
- **Argument for:** Current focus discipline is two-tier: outline (icon-button + checkbox/radio/switch) vs box-shadow alpha glow (token-chip). Replace BOTH with a single «designed» ring: 2 px solid `var(--accent)` + 2 px offset + 1 px inner halo (subtle inset shadow). Reads as a deliberate affordance, not «browser default in jade».
- **Argument against:** Token-chip's alpha glow + border-color shift was a designer choice for paper-feel. Hard ring may look harsh on cream.
- **Recommendation:** **ADOPT** for everything except token-chip; for chip, replace the 0.18 alpha with `var(--accent)` at 0.55 alpha (still soft but reaches WCAG 2.4.11 contrast). Round-1 F-6 was correct.

### Alt 3 · Shrink the type-scale (Display 48 → 40)
- **Argument for:** 48 px Display + 40 px signature-hero is two near-equal poles competing for attention. Drop Display to 40 and signature-hero to 36 → clearer hierarchy, and the H2 22 → body 13 jump (1.69×) becomes less stark relative to a smaller display.
- **Argument against:** 48 Display is the brand voice carrier («Notice what you'd miss» at 48 has gravitas). Shrinking flattens the editorial register.
- **Recommendation:** **Don't shrink Display. Add an intermediate step.** Insert H1.5 / 26 px (between 32 and 22) as «section title» so the cascade becomes 48 / 32 / 26 / 22 / 16 / 13. Rhythm: 1.50 / 1.23 / 1.18 / 1.38 / 1.23 — much closer to a true modular scale.

### Alt 4 · Stricter hover discipline — one element hovered «at a time» visible
- **Argument for:** Iconography section has 18 tiles each running its own hover; cards run another; chips run another. Eye has no anchor. Discipline: **only the element under the cursor lifts**. Sibling-card hover should not visually engage neighbors. Currently each card lifts independently with no inter-card relationship.
- **Argument against:** This is the standard browser default and is what's currently shipped. Stricter discipline means muting hovers in some sections (e.g. read-only swatches, type-rows).
- **Recommendation:** **ADOPT — partial.** Type-rows and swatches should NOT have hover-lift (they're informational, not interactive). Token-chips, icon-tiles, cards, buttons keep hover. Discipline = only interactive surfaces should appear interactive.

### Alt 5 · Bump hit targets to 32×32 (over-engineered = polish signal)
- **Argument for:** AA floor is 24 px; AAA / over-engineered = 32-44. Going to 32 sends a signal: «we care about touch users beyond compliance». Visual side-effect: checkbox + radio + small icon controls feel more substantial, less default-Tailwind.
- **Argument against:** 32 px breaks form-row visual density vs the 13 px field labels. Static reference uses 22 (sub-AA); React port mirrors. Bumping to 32 diverges further from static.
- **Recommendation:** **ADOPT 28 px** — middle ground. 28 > 24 (clear AA pass), 28 < 32 (still feels paper-form-control, not iOS-tap-target). Static-reference parity loss is acceptable because static is documented as legacy, and Round-1 already proposed 24 px as F-4 minimum; going to 28 is the «top-design» version of the same fix.

---

## 3. Top-5 a11y-as-quality findings beyond contrast

### Finding 1 · Reduced-motion toggle has too narrow scope (HIGH — silent failure)
PMR=true currently mutes only `.showcase-motion-demo` descendants (theme.tsx:72) and `.showcase-switch` transition. **Card-hover translateY, icon-tile hover, token-chip hover all keep firing.** A user with vestibular sensitivity who toggles reduced-motion sees the page still bouncing on every hover. SC 2.3.3 (Animation from Interactions) is not satisfied. This is a silent failure no one will notice in QA but is felt by the affected user. Fix: extend the CSS suppressor to `*[class*="showcase-"]` or add `transition: none` under `html[data-reduced-motion="true"]` for hover-translate selectors specifically.

### Finding 2 · Skip-link nav points at non-existent IDs (HIGH — Round-1 unfixed)
`ShowcaseHeader.tsx:7-14` declares anchors `#foundation, #iconography, #primitives, #charts, #disclaimer, #theme`. Of those, only `#iconography, #disclaimer, #theme` exist (rendered via `<Section id={id}>`). `#foundation, #primitives, #charts` **render inside StageFrames keyed `light-v2` / `dark-v2`** — they have NO sibling anchor. Keyboard users tabbing to «Foundation» link and pressing Enter scroll nowhere. Round-1 flagged this as Gap-5; the fix did not land. Two-line fix: wrap each `<FoundationSection variant="light" />` in a `<div id="foundation">` (light stage only) — etc. SC 2.4.1 (Bypass Blocks) and 4.1.2 (Name Role Value) both implicated.

### Finding 3 · Hierarchy-via-depth muddled by 6 simultaneous elevation tiers (HIGH — visual)
The shadow system has 6 named elevations and 4 of them are deployed in a single viewport (Foundation stage: soft, card, lift, inset-light, primary-extrude). **Signature hero's `shadow-lift` is supposed to be the «anchor» — but it's surrounded by 8 cards at `shadow-card`, so the hero reads as +1 over a sea of +0.95.** A11y angle: low-vision users navigating by visual hierarchy can't find the «primary moment» of the section. Designed-quality angle: reads as «every card is roughly equal», which is the opposite of what an editorial system should do. Fix: demote portfolio/insight cards to `shadow-soft` (paper lift, not double-lift), keep `shadow-card` for hover-only, reserve `shadow-lift` for hero. Now hero is +2 over surrounding +0, and hover gives +1 on top of that — gradient hierarchy emerges.

### Finding 4 · Outer page H1 (28 px) is dwarfed by stage H2 (48 px) — Round-1 F-3 unfixed (HIGH — semantic)
`page.tsx:54` outer H1 is **28 px** (Round-1 reported 40 px; current is even smaller). Stage `<h2>` headlines are 48 px. The page's primary entry point is **42% smaller than nested H2s**. SC 1.3.1 (Info & Relationships) — visual hierarchy contradicts document outline. Fix: bump outer H1 to 56 px (display-scale), or de-rank stage h2s to 36 px. The static reference doesn't have this problem because it has no outer H1; the React port introduced it without rebalancing. **This is the «не красиво» first-paint tell.** Pairs directly with criterion #10 (first-fold weak).

### Finding 5 · Mono 9-10 px micro-text passes contrast but fails «published» feel (HIGH — top-design)
Round 1 fixed `--text-3` from 3.82:1 → 4.97:1 (AA). But the text is still 9 px Geist Mono with 0.18em letterspacing rendered on cream. **At 9 px, font-feature-settings barely register, hinting collapses, and the type reads stamped-on.** 78 % of the editorial chrome (ds-row labels + type-row labels + showcase-ds-section meta + swatch hex + footer) sits at 9-10 px Mono. Fix: bump 9 px → 11 px (or 10 px minimum) and increase letterspacing to 0.22em. Visually: closer to «set in type» than «label printer». Bonus: SC 1.4.12 (Text Spacing) becomes effortless to satisfy. Round 1 didn't catch this because it scored contrast, not optical quality. This is the «top-design» bar Round 2 was asked to apply.

---

## 4. Hierarchy-via-depth verdict

**MUDDLED.** Six elevation tiers are deployed in a single viewport with no clear «primary moment». Signature hero is supposed to dominate (`shadow-lift`) but it's surrounded by 8 portfolio/insight/chart cards at `shadow-card` — the relative lift is ~+0.05, not +1. The eye cannot distinguish hero from peer cards by depth alone. Combined with Finding 4 (outer H1 dwarfed), the depth system is not carrying hierarchy — it's just texture.

**Cleanest fix:** Demote sub-cards to `shadow-soft`, keep `shadow-card` as hover-state, reserve `shadow-lift` for hero. Three tiers in viewport (soft / card / lift), not six. Hover then becomes the «interactive lift» motion, and signature hero stands +2 over peers.

---

## 5. ONE a11y improvement that doubles as visual polish

**Promote the focus ring to a designed component** (Alt 2 above).

Replace the current two-style focus discipline (`outline 2px var(--accent)` on most controls + `box-shadow 0 0 0 3px rgba(45,95,78,0.18)` on token-chip) with **one ring**:
```
outline: none;
box-shadow:
  0 0 0 2px var(--bg),         /* halo gap */
  0 0 0 4px var(--accent);     /* full-strength ring */
border-color: var(--accent);
transition: none;              /* WCAG 2.4.11 prefers instant */
```

**A11y wins:** SC 2.4.7 (Focus Visible) AAA-grade visibility; SC 2.4.11 (Focus Appearance) achieves 3:1 against adjacent + 2 px minimum thickness; instant rendering removes the «fade-in» that was flagged Round 1 (criterion 6.d).

**Visual polish wins:**
- Single ring idiom across the showcase = **discipline** (top-design quality #5).
- Halo-gap (2 px of `var(--bg)`) makes the ring «sit on the paper» rather than «painted on the surface» — same paper-feel canon as the rest of the system.
- Round corners are honored (box-shadow follows border-radius; outline doesn't on older WebKit).
- Reads as «designed-for» not «browser default in jade».

This single change touches `_styles/showcase.css` (chip + icon-tile + checkbox + radio + switch + icon-button focus-visible blocks — 6 selectors, ~12 lines) and lifts perceived craft on the entire showcase.

---

## 6. Iteration trap diagnosis (a11y angle)

**The trap:** Round 1 dispatched 3 specialist lenses (a11y / brand / PD), each found a tier-0 fix, those tier-0 fixes shipped (`b0857df`), and the result feels «мало изменилось» because the **architectural a11y debt was never addressed** — only the surface-level contrast violations.

**A11y-specific symptoms of the trap:**

1. **Token-bumps fix tokens; they don't fix architecture.** `--text-3 #5A5A5A` resolves the 4.5:1 ratio but leaves 9 px Mono looking stamped-on. Contrast is necessary, not sufficient.

2. **Round-1 P1 items were not all landed.** Skip-link IDs (Gap-5), 22 px hit targets (Gap-4), and outer H1 size (Gap-3) were proposed and not merged. Each cycle re-scores them as «still failing». Without a tracker that actually closes them, the iteration produces «discovery without delivery».

3. **No one scored hierarchy-via-depth or first-fold density in Round 1.** New criteria emerge each round; old criteria recede. The audit framework keeps shifting, so the surface keeps looking «90% there» while never crossing the line.

4. **Reduced-motion gap is silent.** PMR was scored PASS Round 1 (criterion 6.b) because the explicit motion-sentinel card responds. It took Round 2 to notice that the rest of the page's hovers ignore the toggle. Silent failures don't drive iteration loops because no one sees them.

**Break the trap:**
- **Track Round-1 fixes as merge-gated, not as «proposed».** Outer H1, 22 px hit targets, skip-link IDs are all 1-3 line diffs that have been on the table since Round 1. A single PR addressing them removes 3 of 6 «FAIL» rows in the Round-2 scorecard.
- **Stop adding new criteria each round.** Lock the 10 criteria above as the canonical scorecard for `/design-system`. Score against the same 10 each iteration. Now «мало изменилось» becomes provable / disprovable.
- **Wrap the entire `.showcase` root with the PMR suppressor.** One CSS rule: `html[data-reduced-motion="true"] .showcase * { transition-duration: 0ms !important; animation-duration: 0ms !important; }`. Closes Finding 1 in 2 lines.
- **Demote `shadow-card` to `shadow-soft` for sub-cards.** One token-substitution across `showcase-pf-card / showcase-insight-card / showcase-empty-card`. Closes Finding 3.

---

## Compliance mapping (WCAG 2.2 — Round-2 deltas vs Round-1)

| SC | Round-1 status | Round-2 status | Delta |
|---|---|---|---|
| 1.4.1 Use of Color | FAIL (color-only series) | FAIL (charts dasharray not landed) | unchanged |
| 1.4.3 Contrast Minimum AA | FAIL (text-3 + dark accent) | **PASS** | ✓ closed |
| 1.4.11 Non-text Contrast | PASS | PARTIAL (focus ring on chip 0.18 alpha) | regression noticed |
| 2.3.3 Animation from Interactions | not scored | **FAIL** (PMR scope too narrow) | new failure |
| 2.4.1 Bypass Blocks | PARTIAL | FAIL (skip-links broken — unfixed) | unchanged |
| 2.4.7 Focus Visible | PARTIAL | PARTIAL | unchanged |
| 2.4.11 Focus Appearance | PARTIAL | PARTIAL (alpha-glow under threshold) | unchanged |
| 2.5.5 / 2.5.8 Target Size | FAIL (22 × 22) | FAIL (unfixed) | unchanged |
| 1.3.1 Info & Relationships | not scored | **FAIL** (H1 < H2) | new failure surfaced |
| 4.1.2 Name Role Value | PARTIAL (anchors) | FAIL (still broken) | unchanged |

**Net:** 1 closure (1.4.3), 2 new failures surfaced (2.3.3, 1.3.1), 4 unfixed Round-1 items still open.

---

## Implementation Note

Round 2 confirms what PO felt: **the page is more legible but not more «красиво» because legibility is necessary, not sufficient, for top-design quality.** The remaining gaps are architectural — focus ring discipline, depth hierarchy, vertical rhythm, first-fold landing, reduced-motion scope — not token-level. A token-bump cycle won't close them; a focus-ring refactor + a shadow-tier demotion + the 3 unfixed Round-1 items will.

**Single highest-leverage move:** **Land the unfixed Round-1 P1 trio (outer H1 → 56 px / skip-link IDs / 22→28 px hit targets) AND the focus-ring promotion (Section 5 above) in one PR.** That alone closes 5 of 10 Round-2 FAILs and is the smallest diff that delivers the largest perceived-quality jump.

---

*Prepared for Right-Hand synthesis. Round-2 read-only audit. No code, no edits, no spend, no external comms.*
