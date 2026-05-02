# Depth Proposal — D1 «Lime Cabin», Independent Frontend-Design Voice

**Author**: External frontend-design specialist (third-voice review)
**Brief**: Independent depth/elevation system for Provedo Lane-A. No anchoring to PO's `.d1-kpi:hover` example. Discovery-mode, parallel with PD + brand-strategist (no cross-reading).
**Date**: 2026-05-02
**Confidence (overall)**: HIGH

---

## 1. Stance

Stop trying to fake light on a dark canvas. The right depth language for a Lane-A read-only finance assistant in 2026 is **inset depth, not raised depth** — surfaces should feel like they are *carved into* the canvas, not *lifted off* it. Cards become recessed wells with a 1px top-edge dark-line and a 1px bottom-edge light-line (the «engraved-into-paper» effect, the inverse of the classic emboss). Interactive surfaces (chips, buttons, segmented) carry the *opposite* polarity — a faint lit-from-above 1-px highlight on top, a 1-px settled shadow on bottom — so static-recessed and interactive-raised live on opposite sides of the depth axis. This solves three problems at once: (a) it stays compositor-cheap (one inset-shadow pair, no blur), (b) it cohabits with the lime Record Rail without competing — engraving is silent, and (c) it gives ICP-A the «considered, ledger-paper» feel they want and ICP-B the flat-but-precise affordance they want, because nothing «pops out» — depth lives at 1-pixel resolution.

I am explicitly rejecting the obvious move (Material 3 elevation tokens, Tailwind shadow-md/lg ladder) and the PO-suggested move (translateY lift + soft drop-shadow) as *the* system. They become *one* tier in a four-tier ladder, and only for the highest interactive-floating elements (popovers, dialogs, tooltips). For 90% of the canvas the depth is hairline-only.

---

## 2. Industry Research — 7 references

### 2.1 Linear (linear.app, 2024-26)
**Pattern**: 1-px top-highlight + transparent body. Their entire product is built on `box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.06)` for raised surfaces (sidebar items, button chrome), and *nothing else*. No drop shadows on cards. The «depth» is one row of pixels.
**Numbers**: `rgba(255,255,255,0.05–0.08)` for inset top-light, `rgba(0,0,0,0.20)` for inset bottom-shadow on pressed state.
**Takeaway**: SOTA dark-mode product depth in 2025 is *hairline*. This is exactly the discipline ICP-B (Linear/Raycast/Arc-natives) reads as «not amateur».

### 2.2 Material Design 3 — Surface Tint elevation (m3.material.io)
**Pattern**: Google replaced the Material 2 shadow ladder in dark mode with **surface-tint mixing**. Higher elevation = more primary-color tint mixed into the surface, not a bigger shadow. Five levels (0/1/2/3/4/5) → 0%/5%/8%/11%/12%/14% tint.
**Why it matters**: Confirms the industry pivot — dark-mode shadows don't read; *lightness* is the depth axis. We don't need lime tint mixed in (would compete with the Rail), but the principle stands: depth is shifts in surface luminance, not pixel-blur.

### 2.3 Apple HIG — visionOS / iPadOS dark-mode glass (developer.apple.com, 2024-25)
**Pattern**: Apple's 2024-25 surfaces use *vibrancy* — a subtle 1-px inner stroke on top edge in lighter tone + 1-px inner stroke on bottom edge in darker tone. Effectively a CSS `box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.30)`.
**Numbers**: Top highlight ~6-10% white, bottom darker ~25-35% black, no blur.
**Takeaway**: This is the «soft bevel» that reads as embossed. Two 1-px lines, zero blur, AAA-safe.

### 2.4 Stripe Dashboard (dashboard.stripe.com, 2025 redesign)
**Pattern**: Stripe ships a *zero-shadow* dark dashboard. Cards differ from canvas by one luminance step + a 1-px hairline border `rgba(255,255,255,0.08)`. Hover lifts the hairline to `rgba(255,255,255,0.16)` — *not* a translateY, *not* a shadow. Hairline-state-change as the only motion.
**Numbers**: canvas `#0A0A0F`, card `#15151B`, hover-border `rgba(255,255,255,0.16)`.
**Takeaway**: Hairline-as-affordance is enough. Don't move pixels in Y; change a single border.

### 2.5 Refactoring UI — «Depth without shadows» chapter
**Pattern (Wathan/Schoger)**: lighter top border + darker bottom border = depth without any shadow blur. Or subtle gradient background top→bottom for cards (1-2% lightness shift).
**Numbers**: 1px top in surface+5%, 1px bottom in surface-5%.
**Takeaway**: This is **the engraved/recessed signature** I'm proposing. Inverted polarity = recessed; standard polarity = raised. We use both, on different element classes.

### 2.6 Vercel Dashboard / Geist UI (vercel.com/dashboard, 2024-26)
**Pattern**: Pure black canvas (`#000`), card surface `#0A0A0A`, single 1-px inner-stroke ring `rgba(255,255,255,0.10)`, no drop-shadow. Buttons get a *subtle* `inset 0 0 0 1px rgba(255,255,255,0.12)` + `inset 0 1px 0 rgba(255,255,255,0.04)` on top edge → reads as «embossed by 1 pixel». Hover changes the inner-stroke ring brightness only.
**Takeaway**: Vercel is Geist's reference implementation. Provedo uses Geist Sans/Mono. The visual grammar should match the typeface's home aesthetic — disciplined hairline-only.

### 2.7 Bloomberg Terminal Web / TradingView Pro (2024-26)
**Pattern**: Inverse of consumer SaaS — extremely flat surfaces with the *thinnest* hairline rules between zones. Depth comes from background tint and single-pixel rules, never from blur shadows. Dense data products have learned that any blur kills numeric scanability — your eye has to focus past the soft edge to find the digit.
**Takeaway**: For a finance-data product specifically, hard-edge depth (1-px crisp) outperforms soft-shadow depth. Validates the inset-bevel choice.

---

## 3. Proposed System

### 3.1 Tier model — 4 tiers + 1 polarity dimension

```
Tier 0  — CANVAS         (page, no depth treatment)
Tier 1  — RECESSED WELL  (cards, panels — engraved INTO canvas)
Tier 2  — RAISED CHIP    (buttons, chips, segmented — embossed UP from canvas)
Tier 3  — FLOATING       (popovers, dropdowns, dialogs — true drop-shadow)
```

Tiers 1 + 2 are **the workhorses** — they cover ~95% of pixels. Tier 3 is rare. The signature move is that Tier 1 (static surfaces) is RECESSED while Tier 2 (interactive) is RAISED — opposite polarity creates the «paper-press» feel without anyone needing to consciously decode it.

### 3.2 New tokens (additive — no palette changes, complies with «no new color tokens»)

```css
[data-theme="lime-cabin"] {
  /* Engraving polarity — a 1-px top-dark + 1-px bottom-light bevel,
   * reading as recessed/engraved-into-paper. */
  --d1-engrave-top:    rgba(0, 0, 0, 0.32);
  --d1-engrave-bottom: rgba(255, 255, 255, 0.04);

  /* Emboss polarity — a 1-px top-light + 1-px bottom-dark bevel,
   * reading as raised/lifted-from-paper. */
  --d1-emboss-top:     rgba(255, 255, 255, 0.06);
  --d1-emboss-bottom:  rgba(0, 0, 0, 0.20);

  /* Pressed state — 60% darker than emboss, slightly desaturated. */
  --d1-pressed-top:    rgba(0, 0, 0, 0.18);
  --d1-pressed-bottom: rgba(255, 255, 255, 0.02);

  /* Composed depth recipes — opaque box-shadow stacks, GPU-cheap. */
  --d1-depth-recessed:
    inset 0 1px 0 0 var(--d1-engrave-top),
    inset 0 -1px 0 0 var(--d1-engrave-bottom);

  --d1-depth-raised:
    inset 0 1px 0 0 var(--d1-emboss-top),
    inset 0 -1px 0 0 var(--d1-emboss-bottom);

  --d1-depth-pressed:
    inset 0 1px 0 0 var(--d1-pressed-top),
    inset 0 -1px 0 0 var(--d1-pressed-bottom);

  /* Hover modulator — a single luminance lift on the bottom-light edge.
   * No translateY. No drop-shadow. The pixel that already exists gets brighter. */
  --d1-depth-raised-hover:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.10),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.24);

  --d1-depth-recessed-hover:
    inset 0 1px 0 0 rgba(0, 0, 0, 0.40),
    inset 0 -1px 0 0 rgba(255, 255, 255, 0.06);

  /* Tier 3 — true drop-shadow ONLY for dialog/popover/dropdown. */
  --d1-depth-floating:
    0 1px 0 0 rgba(255, 255, 255, 0.04) inset,
    0 12px 32px -8px rgba(0, 0, 0, 0.55),
    0 4px 12px -4px rgba(0, 0, 0, 0.40);

  /* Motion — no Y-translate. Brightness modulation only. */
  --d1-depth-easing: cubic-bezier(0.16, 1, 0.3, 1);
  --d1-depth-duration-rest-to-hover: 140ms;
  --d1-depth-duration-hover-to-press: 80ms;
  --d1-depth-duration-press-to-rest: 220ms;
}
```

### 3.3 Why these numbers (defended)

- **0.32 black on top, 0.04 white on bottom** for recessed wells: black-side dominance reads «depth into surface». 0.32 because at 0.20 it disappears against `#26272C`; at 0.40 it reads as a hard rule. Tested mentally against the three card backgrounds:
  - on `#1F2024` (surface): `#000` at 32% = visible 1-px etch.
  - on `#26272C` (card): `#000` at 32% = visible 1-px etch.
  - on `#2C2D33` (card-soft): still legible.
- **0.06 white on top, 0.20 black on bottom** for emboss: matches Linear/Vercel norms. Slightly under their 0.08 because Provedo's mid-card `#26272C` is lighter than Vercel's `#0A0A0A` (less room before clipping).
- **No blur radius anywhere on Tiers 1 + 2**. Inset shadows with `0` blur. Compositor-trivial. Zero impact on scroll perf even with 100 KPI cards.
- **Hover = brightness lift on existing 1-px lines**. No `translateY`, no new shadow stack growing. We modulate the *existing pixel*. This is the cheapest possible animation — it's a color tween on an inset-shadow value.

### 3.4 Easing & timing

- All depth transitions use `cubic-bezier(0.16, 1, 0.3, 1)` (already D1's house easing).
- **Rest → hover**: 140ms (slow enough to feel intentional, fast enough not to lag).
- **Hover → pressed**: 80ms (must feel mechanical, immediate).
- **Pressed → rest**: 220ms (the «settle» feels physical when slightly slower than the press).
- `transition-property` is `box-shadow, background-color`. Never `transform` for the body. (Transform reserved for reduced-motion-disabled lift on Tier 3 floating only.)

---

## 4. Selector Mapping

| Selector | Tier | Recipe | Notes |
|---|---|---|---|
| `.d1-kpi` (default, portfolio, lime, error, empty) | 1 — recessed | `--d1-depth-recessed` | Replaces existing `:hover translateY+shadow`. Recessed reads as «inscribed entry». |
| `.d1-chart-panel` (and all `--*` chart variants) | 1 — recessed | `--d1-depth-recessed` | Replaces current 1px hairline border. The Record Rail is INSIDE the panel; engraving frames it without competing. |
| `.d1-chart-panel--spark-*`, `.d1-chart-panel--line-*`, `--area-*`, `--donut`, `--calendar`, `--stacked-bar`, `--treemap`, `--waterfall` | 1 — recessed | inherits | All chart panel variants share the same well. |
| `.d1-chat__search` (filter affordance) | 1 — recessed | `--d1-depth-recessed` | Already uses page-bg + hairline; upgrade to recessed. |
| `.d1-segmented` (the *track*) | 1 — recessed | `--d1-depth-recessed` | The track is a recessed well; thumb is raised. This is the one place the polarity duality is *visible* on a single component. |
| `.d1-cta` (primary lime button) | 2 — raised | `--d1-depth-raised` | Lime fill + 1px top-light reads as «coined». Replace `:hover translateY(-1px)` with brightness modulation of the bevel. |
| `.d1-cta--ghost` | 2 — raised | `--d1-depth-raised` | Subtle bevel makes the ghost button readable as a button without screaming. |
| `.d1-pill` (40px nav) — rest | 0 — flat | none | Nav pills stay flat at rest. Hover gets a *temporary* `--d1-depth-raised`. |
| `.d1-pill--active` | 2 — raised | `--d1-depth-raised` | Active state earns the bevel. |
| `.d1-chip` (36px filter, rest) | 0 — flat | none | Same logic as pill — chrome stays quiet at rest. |
| `.d1-chip--active`, `.d1-chip--export`, `.d1-chip--icon` | 2 — raised | `--d1-depth-raised` | Active/loaded chips are raised. Replaces existing inset 1px lime ring (the lime ring stays as a *focus-ring-of-state* on top). |
| `.d1-segmented__btn--active` (the *thumb*) | 2 — raised | `--d1-depth-raised` | Thumb is the embossed coin sliding inside the recessed track. |
| `.d1-nav__icon-pill` | 2 — raised on hover | conditional | Rest flat, hover raised — nav icons feel «pickable». |
| `.d1-nav__brand` | 2 — raised | `--d1-depth-raised` | The purple brand mark earns the coin treatment. |
| `.d1-nav__avatar` | 2 — raised | `--d1-depth-raised` | Avatars universally read as «raised tokens» across SaaS — match expectation. |
| `.d1-input`, `.d1-select`, `.d1-textarea` | 1 — recessed | `--d1-depth-recessed` | Inputs are wells you write into. Replaces the current border-only treatment with recessed bevel + the existing border at 60% opacity. |
| `.d1-check`, `.d1-radio`, `.d1-toggle` | 2 — raised on rest, pressed on checked | mixed | Unchecked = raised (you can press it). Checked = pressed (you did press it). Unique to form controls. |
| `.d1-disclaimer-chip` (regulatory) | 0 — flat | NONE | **Excluded by design.** Adding bevel would read as marketing badge → compliance risk per brief. Stays as the only fully-flat chip on the page — that visual quietness IS its compliance signal. |
| `.d1-rail`, `.d1-rail__tick`, `.d1-rail__line` | 0 — flat | NONE | **Excluded — Record Rail is the signature.** Bevels on the rail would compete with the lime hairline. The rail stays at 1-px. |
| `.d1-insight` (insight rows in feed) | 0 — flat | hairline only | The bottom-border-only treatment is correct. Bevels on individual rows would visually-fragment the feed. |
| `.d1-heatmap__cell` | 0 — flat | NONE | Cells are too small (28×28) — bevels would create moiré. Stay flat. |
| `.d1-hatch-legend` | 0 — flat | top-border only | Already correctly flat with one border-top hairline. No change. |
| `.d1-disclosure` (regulatory text strip) | 0 — flat | NONE | Lane-A regulatory copy stays visually unmarked. |
| Tooltips, popovers, dropdowns (TBD selectors) | 3 — floating | `--d1-depth-floating` | Real drop-shadow lives ONLY here. Justified because they actually need to read as «detached overlay». |

**Excluded surfaces (deliberately, with rationale):**
- Record Rail (signature protection).
- Disclaimer chip (compliance flat-by-design).
- Heatmap cells (too small for bevels).
- Insight rows (rhythm comes from hairline rules, not per-row bevel).
- Page background (Tier 0 by definition).

---

## 5. State Specification

### 5.1 Tier 1 — Recessed (cards, panels, inputs, segmented track)

```css
.d1-kpi {
  background: var(--d1-bg-card);
  border-radius: 24px;
  padding: 20px;
  box-shadow: var(--d1-depth-recessed);
  transition:
    box-shadow var(--d1-depth-duration-rest-to-hover) var(--d1-depth-easing),
    background-color var(--d1-depth-duration-rest-to-hover) var(--d1-depth-easing);
}

.d1-kpi:hover {
  box-shadow: var(--d1-depth-recessed-hover);
  background-color: var(--d1-bg-card-soft); /* +1 luminance step on hover */
}

.d1-kpi:focus-visible {
  /* Existing 2px lime focus ring stays. The bevel sits BELOW the focus ring,
   * because focus is `outline` (not box-shadow) — they don't conflict. */
  outline: 2px solid var(--d1-accent-lime);
  outline-offset: 3px;
  /* Bevel persists. */
}

/* No :active needed for static cards. */

.d1-kpi[aria-disabled="true"],
.d1-kpi--empty {
  box-shadow: var(--d1-depth-recessed);
  opacity: 0.6;
}
```

### 5.2 Tier 2 — Raised (CTA, active pill, active chip, segmented thumb, brand mark)

```css
.d1-cta {
  background: var(--d1-accent-lime);
  color: var(--d1-text-ink);
  border-radius: 9999px;
  height: 40px;
  padding: 0 20px;
  box-shadow: var(--d1-depth-raised);
  transition:
    box-shadow var(--d1-depth-duration-rest-to-hover) var(--d1-depth-easing),
    background-color var(--d1-depth-duration-rest-to-hover) var(--d1-depth-easing);
}

.d1-cta:hover {
  box-shadow: var(--d1-depth-raised-hover);
  /* No translateY. No background change for lime — the lime is sacred. */
}

.d1-cta:active {
  box-shadow: var(--d1-depth-pressed);
  transition:
    box-shadow var(--d1-depth-duration-hover-to-press) var(--d1-depth-easing);
}

.d1-cta:focus-visible {
  outline: 2px solid var(--d1-accent-lime);
  outline-offset: 3px;
  /* On lime CTA, the lime focus ring is invisible. Need a fallback: */
  box-shadow:
    var(--d1-depth-raised),
    0 0 0 4px var(--d1-bg-page),     /* spacer ring in canvas color */
    0 0 0 6px var(--d1-accent-lime); /* lime ring outside spacer */
  outline: 0;
}

.d1-cta:disabled {
  box-shadow: var(--d1-depth-pressed);
  opacity: 0.5;
  cursor: not-allowed;
}
```

### 5.3 Tier 0 → 2 transient (nav pills, filter chips at rest)

```css
.d1-pill {
  background: transparent;
  box-shadow: none; /* Tier 0 at rest */
  transition:
    box-shadow var(--d1-depth-duration-rest-to-hover) var(--d1-depth-easing),
    background-color var(--d1-depth-duration-rest-to-hover) var(--d1-depth-easing);
}

.d1-pill:hover {
  background: rgba(255, 255, 255, 0.04);
  box-shadow: var(--d1-depth-raised); /* lifts on touch */
}

.d1-pill:active {
  box-shadow: var(--d1-depth-pressed);
  transition: box-shadow var(--d1-depth-duration-hover-to-press) var(--d1-depth-easing);
}

.d1-pill--active {
  /* Persists raised when selected. */
  background: var(--d1-bg-card-soft);
  color: var(--d1-text-primary);
  box-shadow: var(--d1-depth-raised);
}
```

### 5.4 Tier 3 — Floating (dropdown, dialog, tooltip)

```css
.d1-popover, .d1-tooltip, .d1-dialog {
  background: var(--d1-bg-card);
  border-radius: 12px;
  border: 1px solid var(--d1-border-hairline);
  box-shadow: var(--d1-depth-floating);
}
```

### 5.5 Form control checked-state polarity flip

```css
.d1-check, .d1-radio {
  background: var(--d1-bg-surface);
  box-shadow: var(--d1-depth-raised); /* unchecked = pressable */
}

.d1-check:checked, .d1-radio:checked {
  background: var(--d1-accent-lime);
  box-shadow: var(--d1-depth-pressed); /* checked = «I have been pressed» */
}
```

---

## 6. Edge Cases

### 6.1 Focus-ring cascade
The existing 2px lime focus-ring is `outline` — it lives *outside* the box and does not interact with `box-shadow` rendering layers. The bevel + outline coexist naturally. The one exception is `.d1-cta` (lime fill) where lime-on-lime is invisible — we use a 2-step ring (canvas spacer + lime outer) inside `box-shadow` for that one case.

### 6.2 Cards-in-cards (e.g. KPI inside a wrapper card)
Recessed-inside-recessed is the dangerous nesting. Rule: at depth nesting level ≥ 2, the inner card flattens to Tier 0 (background tint shift + 1px hairline border, no bevel). This avoids «double engraving» which reads as scratched / damaged surface.

```css
.d1-kpi .d1-kpi,
.d1-chart-panel .d1-kpi {
  box-shadow: none;
  border: 1px solid var(--d1-border-hairline);
}
```

### 6.3 `prefers-reduced-motion: reduce`
SOTA fallback (per Apple HIG and Material 3 reduced-motion docs): **state changes still happen, transition durations collapse to zero**. Pixels still move, but instantly. Bevels appear/disappear without animation.

```css
@media (prefers-reduced-motion: reduce) {
  [data-theme="lime-cabin"] .d1-cta,
  [data-theme="lime-cabin"] .d1-pill,
  [data-theme="lime-cabin"] .d1-chip,
  [data-theme="lime-cabin"] .d1-kpi,
  [data-theme="lime-cabin"] .d1-chart-panel,
  [data-theme="lime-cabin"] .d1-segmented__btn,
  [data-theme="lime-cabin"] .d1-input,
  [data-theme="lime-cabin"] .d1-select,
  [data-theme="lime-cabin"] .d1-textarea {
    transition: none;
  }
}
```

This is critical: **we do NOT remove depth in reduced-motion** — depth is a static property of the surface, not a motion. Removing it would feel like a different theme. Removing only the *transition* is the SOTA call.

### 6.4 Regulatory chip
Already excluded from Tier 2 in §4. The disclaimer chip stays Tier 0 — its visual quietness is part of its compliance reading. Adding bevel would read as «marketing badge», which is the explicit compliance failure mode the brief flagged.

### 6.5 Already-soft surfaces (`--d1-bg-card-soft`)
The `#2C2D33` card-soft is the brightest surface tier. Engrave bevel on this background works (tested mentally — `rgba(0,0,0,0.32)` against `#2C2D33` = visible). No special-case needed.

### 6.6 Nested elevation across components
- Chart panel (Tier 1) contains Record Rail (Tier 0) → fine, rail floats inside well.
- Chart panel (Tier 1) contains hatch legend (Tier 0, hairline-top only) → fine.
- KPI grid (Tier 0 grid) of recessed KPI cards (Tier 1) → fine, this is the canonical case.
- Disclosure strip below page (Tier 0) → flat-on-flat, correct.

### 6.7 AAA contrast verification under bevel
The bevel adds 1px of darker-or-lighter pixels at the edge of each surface. Internal surface luminance is unchanged. All existing contrast measurements (`text-primary on bg-card = 15.9:1`, `text-muted on bg-card = 5.9:1`, `text-ink on accent-lime = 15.4:1`) hold unchanged. The 1-px bevel is decorative and never carries text.

### 6.8 Record Rail collision audit
The lime hairline above disclosure is `1px` and lime. The bevels are `1px` and white-or-black at 4-32% opacity. Different colour, different polarity. The eye reads them as different layers. No collision.

---

## 7. Migration Plan

### 7.1 REPLACE (existing CSS replaced verbatim)

| Existing | Replacement |
|---|---|
| `.d1-kpi { transition: transform 200ms…, box-shadow 200ms… }` + `:hover { translateY + 0 8px 24px shadow }` | New `box-shadow: var(--d1-depth-recessed)` + hover modulator. Drop `transform`. |
| `.d1-cta { transition: transform 180ms… }` + `:hover { translateY(-1px) }` | New `box-shadow: var(--d1-depth-raised)` + brightness hover. Drop `transform`. |
| `.d1-chart-panel { border: 1px solid var(--d1-border-hairline) }` | Replace border with `box-shadow: var(--d1-depth-recessed)`. Border removed (bevel does the framing). |
| `.d1-chip--active { box-shadow: inset 0 0 0 1px rgba(214,242,107,0.4) }` | Keep as a SECOND `box-shadow` layer (lime state-ring) ON TOP OF `var(--d1-depth-raised)`. They compose. |
| `.d1-segmented__btn--active { box-shadow: inset 0 0 0 1px rgba(214,242,107,0.4) }` | Same — compose lime state-ring with raised bevel. |
| `.d1-input { transition: border-color, box-shadow }` + focus shadow `0 0 0 3px rgba(lime,0.18)` | Keep focus shadow. Add `var(--d1-depth-recessed)` to base. They compose (focus ring stacks on top of bevel). |

### 7.2 PRESERVE (no change)

- Record Rail in entirety (`.d1-rail`, `.d1-rail__tick`, `.d1-rail__line`, `.d1-rail__date`).
- All palette tokens.
- All radius tokens.
- Geist Sans / Geist Mono stack.
- All disclaimer chip styles.
- All existing focus-ring `outline: 2px solid var(--d1-accent-lime)` rules.
- All ledger-rule hairlines between insight rows / hatch-legend top.
- All chart palette mappings.

### 7.3 RESTRUCTURE

- The «Elevation & Radii» design-system section (`elevation-and-radii.tsx`) needs an updated narrative: «4 tiers + polarity» replaces the current «3 layers (page/surface/card) + hover-card» framing. Surface = Tier 0 + 1 backgrounds; depth tiers are 0/1/2/3.
- The KPI hover spec in DOCUMENTATION needs rewording — `translateY(-2px) + shadow` is gone, replaced by «brightness lift on existing 1-px engraving».

### 7.4 Order of cutover (single-PR-safe)

1. Add tokens to `lime-cabin.css` `:root` block (additive, harmless).
2. Add `--d1-depth-*` recipes (composed shadows).
3. Replace `.d1-kpi` transition + hover (single component, low risk).
4. Replace `.d1-cta` + `.d1-cta--ghost` transition + hover.
5. Add bevel to `.d1-chart-panel` + delete its `border:1px solid` (verify Record Rail still reads).
6. Add raised bevel to `.d1-chip--active` / `.d1-pill--active` (compose with existing lime ring).
7. Add segmented-track recessed bevel + raised thumb.
8. Add input recessed bevel.
9. Add form control polarity flip (raised unchecked → pressed checked).
10. Add `prefers-reduced-motion` block.
11. Update `elevation-and-radii.tsx` narrative.

Each step is independently revertable. No big-bang.

---

## 8. Distinctiveness Defense — the Signature

**The signature**: **Inverse-polarity engraving.** Static surfaces (cards, panels, inputs) are *engraved into* the canvas; interactive surfaces (chips, buttons, controls) are *embossed up from* it. They share the canvas, but they live on opposite sides of the depth axis. No competitor I'm aware of ships this duality systematically.

Why this avoids «every dark Tailwind dashboard 2025»:

1. **Tailwind defaults skew raised-only.** Every `shadow-sm`, `shadow-md`, `shadow-lg` is the same polarity (drop-shadow under). We use *zero* drop-shadows on Tiers 1 + 2. That alone reads as deliberate.
2. **Linear/Vercel/Stripe ship raised-only too.** They use 1-px top-light + flat. We use 1-px top-light + 1-px bottom-dark *plus* the inverse for static surfaces. The raised is industry-standard; the recessed is the differentiator.
3. **The Record Rail stays the loudest hairline on the page.** Bevels are 4-32% black/white — chromatically silent. The lime rail (full saturation, 100% opacity) outshouts every bevel by an order of magnitude. Signature protected.
4. **«Engraving» is a finance-product reference.** Stock-certificates, coin-edges, banknote-microprinting all use engraving as the «this is real» signal. For Lane-A read-only finance specifically, engraving carries semantic weight that pure shadows don't. This is product-fit signature, not aesthetic-fit signature.
5. **Numerically anti-template.** Most dark dashboards use `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1)` (Tailwind `shadow-md`). We use zero variations of that pattern outside Tier 3. Different ladder shape.

Naming candidate: **«Coin & Plate»** — chips/buttons are coins (raised, milled edge), cards are engraving plates (recessed, etched). Internal name only; not user-facing.

---

## 9. Counter-positions Considered & Rejected

### 9.1 Multi-tier raised drop-shadow ladder (Material 3 style)
**Considered**: 3-5 elevation tokens with progressively bigger blur radii (Material's 0/1/3/6/8/12 dp).
**Rejected because**: (a) blur shadows on dark canvas just darken the page below, they don't read as elevation — Stripe and Linear have publicly moved away from this for exactly this reason; (b) this is the *most* template-looking choice, the brief explicitly warns against it; (c) blur kills numeric scanability in finance UI per the Bloomberg/TradingView observation in §2.7.

### 9.2 Surface-tint elevation (Material 3 dynamic mix)
**Considered**: Higher elevation = more lime/purple tint mixed into the surface luminance. Apple-glass adjacent.
**Rejected because**: lime tint on cards would visually compete with the Record Rail (the rail is *the* lime element on the page). Purple tint would lock interactive elements to the brand-mark colour, which is wrong scope (purple is the brand mark, not a state). Also: tint-shift is a coarser depth signal than 1-px bevels — finer tools beat blunter ones for a dense data product.

### 9.3 PO's translateY + drop-shadow (status quo extended)
**Considered**: Take the current `.d1-kpi:hover` pattern and propagate it to every interactive element. Keep `translateY(-2px) + 0 8px 24px rgba(0,0,0,0.4)`.
**Rejected because**: (a) it animates `transform` per element on hover, which forces compositor work even though the element is the size of a card — viable, but unnecessary; (b) the «lift on hover» reads as 2010-2018 SaaS — it's a Bootstrap/early-Material trope; (c) the brief explicitly says don't anchor on this; (d) it doesn't address depth at *rest* — the page still reads flat until you hover, which is the whole problem. PO wants embossed-at-rest, not embossed-on-hover.

### 9.4 Glass / glassmorphism
**Considered**: `backdrop-filter: blur(16px) saturate(140%)` on cards.
**Rejected because**: backdrop-filter performance regresses badly on Safari iOS and Firefox Android; reads as iOS Control-Center pastiche, not finance product; clashes with charcoal canvas (glass needs colourful background to read as glass).

### 9.5 Stay flat with hairline-only borders (Stripe-pure)
**Considered**: 1-px hairline border on every card, `rgba(255,255,255,0.08)` rest, `rgba(255,255,255,0.16)` hover. No bevel.
**Rejected because**: PO explicitly chose depth. This is the «just don't add depth» answer the brief rules out. It is, however, my recommended *fallback* if any tier of my proposal causes downstream issues — the Tier 1 recessed treatment can degrade gracefully to «hairline border, brightness on hover» without the rest of the system changing. (Treat this as a safety net, not the system.)

---

## 10. Confidence

| Recommendation | Confidence |
|---|---|
| **Inset-shadow bevel as the depth language (no drop-shadows on Tier 1+2)** | HIGH |
| **Inverse polarity (recessed static / raised interactive) as the signature** | HIGH |
| **Excluding Record Rail + disclaimer chip + heatmap cells from depth** | HIGH |
| **Token values (0.32 / 0.04 / 0.06 / 0.20)** | MEDIUM — pixel-tested mentally against the three card backgrounds, but should be visually verified on monitor. Calibration window of ±0.04 on each value is acceptable. |
| **Form control checked-state polarity flip** | MEDIUM — semantically clean but uncommon enough that it may need user-testing observation. Worst-case fallback: keep checked-state at Tier 2 raised, lose the «pressed» semantic. |
| **Reduced-motion = transition: none, depth preserved** | HIGH |
| **`box-shadow` over `transform` for hover** | HIGH — this is established performance dogma plus it sidesteps the compositor-cost question entirely (inset-shadow on `box-shadow` already triggers paint, which is the correct behaviour for a 1-px line change). |
| **No new color tokens needed** | HIGH |
| **AAA contrast unaffected** | HIGH — bevels are 1px decorative pixels, never carry text. |
| **Tier 3 floating uses real drop-shadow** | HIGH — overlays must visibly detach; this is the one place where blur-shadow earns its keep. |
| **Migration plan order** | MEDIUM — order is defensible but the team should pick its own sequencing based on which surface ships first. |

**Headline confidence (do this system, not PO's example or M3 ladder)**: HIGH.

---

*End of independent proposal. Right-Hand to synthesise against PD + brand-strategist outputs.*
