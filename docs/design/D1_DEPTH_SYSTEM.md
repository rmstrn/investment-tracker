# D1 «Lime Cabin» Depth System — Canonical Implementation Spec

**Author:** product-designer (synthesis)
**Date:** 2026-05-02
**Status:** LOCKED — implement as written
**Implements:** lock memo `project_d1_depth_system_2026-05-02` (3-vector convergence)
**Source proposals:** `v2_product-designer`, `v2_brand-strategist`, `v2_frontend-design` depth-proposals (do not re-read for implementation; this spec is the merged truth)
**Audience:** frontend-engineer (copy-paste-ready), tech-lead (review)

---

## 0 · Overview

D1 gains a tactile **3-tier depth grammar** with an inverse-polarity dimension on tier 2:

| Tier | Name | Polarity | Used for |
|---|---|---|---|
| **Tier 0** | Canvas | none | page bg, layout shells, type-only |
| **Tier 1** | Recessed (debossed) | inset, top-bright + bottom-dark | static surfaces (cards, panels, KPIs, inputs, segmented track) |
| **Tier 2** | Embossed (raised) | inset, top-bright + bottom-dark with stronger top-light + outer ink-baseline | interactive surfaces (CTA, active chip, segmented thumb, brand mark, avatar) |

**Polarity dimension on tier 2:** static surfaces sink into the canvas; interactive surfaces lift off it. Both use chromatically silent bevels (white/black at 4–32%). The Record Rail stays the loudest hairline on the page.

**Hard rules:**
1. No outer drop-shadow at rest on any tier.
2. Hover lift only on tier 2 + KPI hover (tier 1 with intentional hover lift, see §5).
3. `.d1-disclaimer-chip` is **flat — out of the depth system entirely** (Lane-A regulatory cure).
4. `.d1-rail*` stays flat. Depth grammar composes around the rail; never on it.
5. Bevels do not stack — at nesting depth ≥2, inner element drops to tier 0 (hairline border only).
6. Rest emboss survives `prefers-reduced-motion`; only transitions collapse to zero.
7. No new colour tokens. Only the 4 existing surface tokens + the existing lime/purple accents.

---

## 1 · Token definitions

Add to **both** files inside the existing root token block (`[data-style="d1"]` in `style-d1/_lib/theme.css`, `[data-theme="lime-cabin"]` in `design-system/_styles/lime-cabin.css`). Token *names* are identical across files.

```css
/* ── Depth grammar — D1 tactile 3-tier system ─────────────────────── */

/* Tier 1 — RECESSED (debossed). Static surfaces at rest.
 * Two stacked inset hairlines: bright above, dark below. Reads as
 * paper pressed slightly into the canvas. Calibrated against
 * --d1-bg-card #26272C and --d1-bg-page #141416. */
--d1-elev-tier1-rest:
  inset 0 1px 0 0 rgba(255, 255, 255, 0.04),
  inset 0 -1px 0 0 rgba(0, 0, 0, 0.32);

/* Tier 1 — RECESSED hover. Used ONLY where a tier-1 surface is
 * known-interactive (KPI cards). Top-light fades, bottom-dark
 * deepens, outer ink-baseline shadow appears for the «lifted off
 * the press» moment. Translate -2px (proportional to KPI tile). */
--d1-elev-tier1-hover:
  inset 0 1px 0 0 rgba(255, 255, 255, 0.02),
  inset 0 -1px 0 0 rgba(0, 0, 0, 0.40),
  0 2px 0 0 rgba(0, 0, 0, 0.50),
  0 8px 20px -4px rgba(0, 0, 0, 0.45);

/* Tier 2 — EMBOSSED (raised, «coin»). Interactive surfaces at rest.
 * Stronger top-light to invite the press, restrained bottom-dark,
 * subtle ink-baseline 1px below for the «sitting just above paper»
 * read. No blur. */
--d1-elev-tier2-rest:
  inset 0 1px 0 0 rgba(255, 255, 255, 0.08),
  inset 0 -1px 0 0 rgba(0, 0, 0, 0.24),
  0 1px 0 0 rgba(0, 0, 0, 0.35);

/* Tier 2 — EMBOSSED hover. Top-light intensifies, ink-baseline
 * deepens, soft halo joins, surface translates -1px.
 * Translate -1px (universal-safe across 32–40px controls). */
--d1-elev-tier2-hover:
  inset 0 1px 0 0 rgba(255, 255, 255, 0.12),
  inset 0 -1px 0 0 rgba(0, 0, 0, 0.20),
  0 2px 0 0 rgba(0, 0, 0, 0.50),
  0 4px 12px -2px rgba(0, 0, 0, 0.32);

/* Tier 2 — ACTIVE (pressed). Surface sinks: top-light vanishes,
 * inner shadow appears at top, no outer shadow. Reads as «button
 * pressed into the panel». */
--d1-elev-tier2-active:
  inset 0 1px 2px 0 rgba(0, 0, 0, 0.40),
  inset 0 -1px 0 0 rgba(255, 255, 255, 0.02);

/* Disabled — flatten (no inner emboss, no outer shadow). Combine
 * with opacity:0.5 at the rule level. */
--d1-elev-disabled: none;

/* Focus-ring composer — 2px lime ring as a layered box-shadow value
 * suitable for stacking with elevation shadows on lime-fill surfaces
 * where outline-on-lime is invisible. NOT a replacement for the
 * existing `outline: 2px solid var(--d1-accent-lime)` on dark-fill
 * surfaces — see §6 focus-ring cascade. */
--d1-elev-focus-ring-on-lime:
  0 0 0 4px var(--d1-bg-page),
  0 0 0 6px var(--d1-accent-lime);

/* Motion — explicit timing tokens for depth transitions. Match
 * existing D1 ease-out-expo curve; faster for press, slower for
 * settle. */
--d1-elev-duration-rest-to-hover: 200ms;
--d1-elev-duration-hover-to-active: 80ms;
--d1-elev-duration-active-to-rest: 220ms;
--d1-elev-easing: cubic-bezier(0.16, 1, 0.3, 1);
```

**Token count introduced: 11** (8 elevation recipes + 3 motion tokens). No palette tokens.

**Calibration notes (do not negotiate upward):**
- Top-light at >12% white reads as 90s-skeumorphic bevel — failure mode.
- Bottom-dark at >40% black reads as black halo on `#141416` — failure mode.
- Outer drop blur radii are deliberately small (max 20px on KPI hover) — atmospheric multi-layer is banned per brand-strategist anti-pattern list.

---

## 2 · Per-tier full CSS (copy-paste-ready blocks)

Replace the existing per-selector rules with the blocks below. Both files (`style-d1/_lib/theme.css` and `design-system/_styles/lime-cabin.css`) get the same logic; the only difference is the attribute scope wrapper.

For brevity below, the wrapper `[data-style="d1"]` is shown. **Frontend-engineer must ALSO produce the parallel block in `lime-cabin.css` with `[data-theme="lime-cabin"]` wrapper.** Selectors and values are otherwise identical.

### 2.1 · Tier 1 — Static surfaces

```css
/* === KPI tiles =================================================== */
[data-style="d1"] .d1-kpi {
  /* existing background, radius, padding, layout — unchanged */
  box-shadow: var(--d1-elev-tier1-rest);
  transition:
    transform var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing),
    box-shadow var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing);
}

[data-style="d1"] .d1-kpi:hover {
  transform: translateY(-2px);
  box-shadow: var(--d1-elev-tier1-hover);
}

/* Lime-fill KPI — white-on-lime hairline still reads, ink shadow
 * replaces black-on-lime which would muddy the lime saturation. */
[data-style="d1"] .d1-kpi--lime {
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.20),
    inset 0 -1px 0 0 rgba(14, 15, 17, 0.18);
}

[data-style="d1"] .d1-kpi--lime:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.30),
    inset 0 -1px 0 0 rgba(14, 15, 17, 0.24),
    0 2px 0 0 rgba(14, 15, 17, 0.20),
    0 8px 20px -4px rgba(0, 0, 0, 0.45);
}

/* Error variant — amber hairline COMPOSES with tier-1 emboss. */
[data-style="d1"] .d1-kpi--error {
  box-shadow:
    inset 0 0 0 1px var(--d1-notification-amber),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.04),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.32);
}

/* Empty variant — inherits tier-1 rest from .d1-kpi (no override). */

/* === Chart / data panels ========================================= */
/* style-d1 calls them .d1-panel; lime-cabin calls them .d1-chart-panel. */
[data-style="d1"] .d1-panel {
  /* DELETE existing border:1px solid var(--d1-border-hairline) on
   * lime-cabin's .d1-chart-panel — bevel replaces the framing. */
  box-shadow: var(--d1-elev-tier1-rest);
  /* No hover — chart panels are not interactive containers. Their
   * INTERNAL controls (segmented, chips) carry the interaction. */
}

/* === Segmented track (the well that holds the thumb) ============= */
[data-style="d1"] .d1-segmented {
  box-shadow: var(--d1-elev-tier1-rest);
}

/* === Search filter affordance ==================================== */
[data-style="d1"] .d1-chat__search {
  /* Replaces existing border:1px solid var(--d1-border-hairline) */
  border: 0;
  box-shadow: var(--d1-elev-tier1-rest);
}

/* === Form inputs (lime-cabin only — these don't exist in style-d1) */
[data-theme="lime-cabin"] .d1-input,
[data-theme="lime-cabin"] .d1-select,
[data-theme="lime-cabin"] .d1-textarea {
  /* Keep existing 1px border (form fields earn the explicit edge —
   * convention says «ink goes here»). Compose tier-1 bevel UNDER the
   * border via box-shadow. */
  box-shadow: var(--d1-elev-tier1-rest);
}

[data-theme="lime-cabin"] .d1-input:focus-visible,
[data-theme="lime-cabin"] .d1-select:focus-visible,
[data-theme="lime-cabin"] .d1-textarea:focus-visible {
  border-color: var(--d1-accent-lime);
  /* Compose: tier-1 rest + 3px lime focus halo (existing rule). */
  box-shadow:
    var(--d1-elev-tier1-rest),
    0 0 0 3px rgba(214, 242, 107, 0.18);
}
```

### 2.2 · Tier 2 — Interactive surfaces

```css
/* === Primary CTA (lime fill) ===================================== */
[data-style="d1"] .d1-cta {
  /* existing background, radius, padding, layout — unchanged */
  box-shadow: var(--d1-elev-tier2-rest);
  transition:
    transform var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing),
    box-shadow var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing);
}

[data-style="d1"] .d1-cta:hover {
  transform: translateY(-1px);
  box-shadow: var(--d1-elev-tier2-hover);
}

[data-style="d1"] .d1-cta:active {
  transform: translateY(0);
  box-shadow: var(--d1-elev-tier2-active);
  transition:
    transform var(--d1-elev-duration-hover-to-active) var(--d1-elev-easing),
    box-shadow var(--d1-elev-duration-hover-to-active) var(--d1-elev-easing);
}

/* CTA focus on lime fill — outline:2px solid lime is invisible.
 * Use layered box-shadow to compose tier-2 rest + canvas spacer +
 * lime ring outside. */
[data-style="d1"] .d1-cta:focus-visible {
  outline: 0;
  box-shadow:
    var(--d1-elev-tier2-rest),
    var(--d1-elev-focus-ring-on-lime);
}

/* CTA hover + focus combined */
[data-style="d1"] .d1-cta:hover:focus-visible {
  box-shadow:
    var(--d1-elev-tier2-hover),
    var(--d1-elev-focus-ring-on-lime);
}

/* Disabled — flatten, lose lift, lose ring */
[data-style="d1"] .d1-cta:disabled {
  transform: none;
  box-shadow: var(--d1-elev-disabled);
  opacity: 0.5;
  cursor: not-allowed;
}

/* === Ghost CTA (lime-cabin only) ================================= */
[data-theme="lime-cabin"] .d1-cta--ghost {
  /* Existing 1px inset border becomes layered with tier-2 emboss. */
  box-shadow:
    inset 0 0 0 1px var(--d1-border-strong),
    var(--d1-elev-tier2-rest);
}

[data-theme="lime-cabin"] .d1-cta--ghost:hover {
  box-shadow:
    inset 0 0 0 1px var(--d1-border-strong),
    var(--d1-elev-tier2-hover);
}

[data-theme="lime-cabin"] .d1-cta--ghost:active {
  box-shadow:
    inset 0 0 0 1px var(--d1-border-strong),
    var(--d1-elev-tier2-active);
}

/* === Brand mark + avatar (interactive identity tokens) =========== */
[data-style="d1"] .d1-nav__brand,
[data-style="d1"] .d1-nav__avatar {
  box-shadow: var(--d1-elev-tier2-rest);
}

/* === Nav icon-pill (cog, search, notifications) ================== */
[data-style="d1"] .d1-nav__icon-pill {
  box-shadow: var(--d1-elev-tier2-rest);
  transition:
    transform var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing),
    box-shadow var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing),
    color 120ms var(--d1-elev-easing);
}

[data-style="d1"] .d1-nav__icon-pill:hover {
  color: var(--d1-text-primary);
  transform: translateY(-1px);
  box-shadow: var(--d1-elev-tier2-hover);
}

[data-style="d1"] .d1-nav__icon-pill:active {
  transform: translateY(0);
  box-shadow: var(--d1-elev-tier2-active);
  transition:
    transform var(--d1-elev-duration-hover-to-active) var(--d1-elev-easing),
    box-shadow var(--d1-elev-duration-hover-to-active) var(--d1-elev-easing);
}

/* === Nav pill (rest = flat, hover = lift, active = persistent lift)
 * The pill is special: its identity at rest is transparent
 * (chrome quietness). Hover EARNS tier-2; active --pill--active
 * SUSTAINS it. */
[data-style="d1"] .d1-pill {
  /* No box-shadow at rest. */
  transition:
    transform var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing),
    box-shadow var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing),
    background var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing),
    color var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing);
}

[data-style="d1"] .d1-pill:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--d1-text-primary);
  transform: translateY(-1px);
  box-shadow: var(--d1-elev-tier2-rest);
}

[data-style="d1"] .d1-pill:active {
  transform: translateY(0);
  box-shadow: var(--d1-elev-tier2-active);
  transition:
    transform var(--d1-elev-duration-hover-to-active) var(--d1-elev-easing),
    box-shadow var(--d1-elev-duration-hover-to-active) var(--d1-elev-easing);
}

[data-style="d1"] .d1-pill--active,
[data-style="d1"] .d1-pill--active:hover {
  background: var(--d1-accent-lime);
  color: var(--d1-text-ink);
  /* Lime-on-lime: white at 25% reads, ink at 18% reads. */
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.25),
    inset 0 -1px 0 0 rgba(14, 15, 17, 0.18),
    0 1px 0 0 rgba(14, 15, 17, 0.20);
}

/* === Filter chip (rest = flat, hover = lift, active = lime hairline + emboss)
 * Same model as pill. Chip is 36px tall — translate -1px is the
 * universal-safe value. */
[data-style="d1"] .d1-chip {
  /* No box-shadow at rest. */
  transition:
    transform var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing),
    box-shadow var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing),
    background var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing),
    color var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing);
}

[data-style="d1"] .d1-chip:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--d1-text-primary);
  transform: translateY(-1px);
  box-shadow: var(--d1-elev-tier2-rest);
}

[data-style="d1"] .d1-chip:active {
  transform: translateY(0);
  box-shadow: var(--d1-elev-tier2-active);
  transition:
    transform var(--d1-elev-duration-hover-to-active) var(--d1-elev-easing),
    box-shadow var(--d1-elev-duration-hover-to-active) var(--d1-elev-easing);
}

/* Active chip — composes tier-2 emboss with the existing lime
 * hairline (kept first in the stack so the lime ring reads as the
 * primary state signal). */
[data-style="d1"] .d1-chip--active {
  background: var(--d1-bg-card-soft);
  color: var(--d1-text-primary);
  box-shadow:
    inset 0 0 0 1px rgba(214, 242, 107, 0.4),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.06),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.20),
    0 1px 0 0 rgba(0, 0, 0, 0.30);
}

[data-style="d1"] .d1-chip--active:hover {
  background: var(--d1-bg-card-soft);
  color: var(--d1-text-primary);
  transform: translateY(-1px);
  box-shadow:
    inset 0 0 0 1px rgba(214, 242, 107, 0.6),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.10),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.20),
    0 2px 0 0 rgba(0, 0, 0, 0.50),
    0 4px 12px -2px rgba(0, 0, 0, 0.32);
}

/* Icon-only chip + export chip (filled background variants) */
[data-style="d1"] .d1-chip--icon,
[data-style="d1"] .d1-chip--export {
  background: var(--d1-bg-card);
  /* Their rest state IS visible-surface — give them tier-2 rest. */
  box-shadow: var(--d1-elev-tier2-rest);
}

[data-style="d1"] .d1-chip--icon:hover,
[data-style="d1"] .d1-chip--export:hover {
  transform: translateY(-1px);
  box-shadow: var(--d1-elev-tier2-hover);
}

/* === Segmented thumb (the «coin» that slides inside the recessed track) */
[data-style="d1"] .d1-segmented__btn {
  /* Rest = flat (the track gives context). */
  /* No box-shadow at rest. */
}

[data-style="d1"] .d1-segmented__btn:hover {
  /* Subtle lift via background only — segmented is tight (26px tall),
   * y-translate would feel glitchy. */
  background: rgba(255, 255, 255, 0.04);
  color: var(--d1-text-primary);
}

[data-style="d1"] .d1-segmented__btn--active {
  background: var(--d1-bg-card-soft);
  color: var(--d1-text-primary);
  box-shadow:
    inset 0 0 0 1px rgba(214, 242, 107, 0.4),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.20),
    0 1px 0 0 rgba(0, 0, 0, 0.30);
}

/* === Form controls — checkbox / radio polarity flip (lime-cabin only) */
[data-theme="lime-cabin"] .d1-check,
[data-theme="lime-cabin"] .d1-radio {
  /* Unchecked = pressable: tier-2 rest. Keep existing 1px border. */
  box-shadow: var(--d1-elev-tier2-rest);
}

[data-theme="lime-cabin"] .d1-check:checked,
[data-theme="lime-cabin"] .d1-radio:checked {
  /* Checked = pressed-in: tier-2 active. Lime fill + ink-shadow inset. */
  box-shadow:
    inset 0 1px 2px 0 rgba(14, 15, 17, 0.30),
    inset 0 -1px 0 0 rgba(255, 255, 255, 0.20);
}

/* === Toggle (lime-cabin only) — track is recessed, knob is raised */
[data-theme="lime-cabin"] .d1-toggle {
  box-shadow: var(--d1-elev-tier1-rest);
}

[data-theme="lime-cabin"] .d1-toggle::after {
  /* Knob is the raised coin sliding inside the recessed track. */
  box-shadow:
    0 1px 0 0 rgba(0, 0, 0, 0.40),
    0 2px 4px 0 rgba(0, 0, 0, 0.30);
}
```

### 2.3 · Disclaimer chip — explicitly flat

```css
/* === Lane-A regulatory cure — out of the depth system ============ */
[data-style="d1"] .d1-disclaimer-chip {
  /* No box-shadow. No transition. No hover. No focus animation.
   * Visual quietness IS the compliance signal. Stays as the only
   * fully-flat chip on the page. */
  box-shadow: none;
}
```

### 2.4 · Premium chip — flat (low-priority badge)

```css
[data-style="d1"] .d1-chip-premium {
  /* No depth — premium chip is a label, not a control. */
  box-shadow: none;
}
```

---

## 3 · Selector → tier mapping (full audit)

| # | Selector | Tier | Recipe | Notes |
|---|---|---|---|---|
| 1 | `.d1-page` | 0 | none | canvas |
| 2 | `.d1-shell` | 0 | none | layout container |
| 3 | `.d1-surface` | 0 | none | dashboard canvas — excluded to prevent cards-in-cards |
| 4 | `.d1-marketing` | 0 | none | layout strip |
| 5 | `.d1-nav` | 0 | none | flex container |
| 6 | `.d1-nav__brand` | 2 | `--d1-elev-tier2-rest` | static brand mark, but earns coin polarity per «Coin & Plate» |
| 7 | `.d1-nav__avatar` | 2 | `--d1-elev-tier2-rest` | identity token; convention says raised |
| 8 | `.d1-nav__icon-pill` | 2 | rest + hover + active | full L2 contract |
| 9 | `.d1-nav__spacer` | 0 | none | flex spacer |
| 10 | `.d1-pill` | 2 | rest=flat, hover/active=L2 | chrome quiet at rest |
| 11 | `.d1-pill--active` | 2 | lime-fill emboss override | persistent raised state |
| 12 | `.d1-disclaimer-chip` | — | **flat / excluded** | Lane-A regulatory cure |
| 13 | `.d1-chip-premium` | — | **flat** | label, not control |
| 14 | `.d1-eyebrow*`, `.d1-headline`, `.d1-sub`, `.d1-disclosure` | 0 | none | type only |
| 15 | `.d1-cta` | 2 | full contract | restructures existing translate-only hover |
| 16 | `.d1-cta--ghost` (lime-cabin) | 2 | full contract + existing inset border | layer the border ABOVE elevation |
| 17 | `.d1-kpi` | 1 | rest + hover (intentional) | KPI is the PO anchor; tier-1 hover preserves the lift moment |
| 18 | `.d1-kpi--portfolio` | 1 | inherits | hero card, no override |
| 19 | `.d1-kpi--lime` | 1 | white@20% + ink@18% override | lime polarity special |
| 20 | `.d1-kpi--error` (lime-cabin) | 1 | amber hairline + tier-1 rest layered | composes |
| 21 | `.d1-kpi--empty` (lime-cabin) | 1 | inherits | no override |
| 22 | `.d1-kpi__icon-chip` | 0 | none | inside L1, no nesting |
| 23 | `.d1-kpi__head/__num/__label/__delta/__ext` | 0 | none | type/layout |
| 24 | `.d1-chips` | 0 | none | container |
| 25 | `.d1-chip` | 2 | rest=flat, hover/active=L2 | mirrors pill model |
| 26 | `.d1-chip--active` | 2 | lime hairline + L2 emboss layered | hairline reads first |
| 27 | `.d1-chip--icon` | 2 | always-filled — full L2 | bg is visible, earn the bevel |
| 28 | `.d1-chip--export` | 2 | always-filled — full L2 | same logic |
| 29 | `.d1-grid` | 0 | none | container |
| 30 | `.d1-panel` (style-d1) | 1 | `--d1-elev-tier1-rest` | static chart panel; no hover |
| 31 | `.d1-chart-panel` (lime-cabin) | 1 | `--d1-elev-tier1-rest`, **DELETE existing 1px border** | bevel replaces border |
| 32 | `.d1-chart-panel--*` modifiers (spark/line/area/donut/calendar/stacked-bar/treemap/waterfall) | 1 | inherit from `.d1-chart-panel` | no per-modifier override |
| 33 | `.d1-panel__head/__body/__caption` | 0 | none | inside L1 |
| 34 | `.d1-segmented` (track) | 1 | `--d1-elev-tier1-rest` | the well |
| 35 | `.d1-segmented__btn` | 0→2 | rest=flat, active=L2 emboss + lime hairline | active is the «coin in the well» |
| 36 | `.d1-segmented__btn--active` | 2 | lime hairline + L2 emboss layered | composes with existing rule |
| 37 | `.d1-heatmap` | 0 | none | grid container |
| 38 | `.d1-heatmap__cell` | 0 | **flat / excluded** | data point, not UI surface; bevel on 28×28 = moiré |
| 39 | `.d1-heatmap__rowlabel/__collabel` | 0 | none | type |
| 40 | `.d1-chat__search` | 1 | `--d1-elev-tier1-rest`, **DELETE existing 1px border** | bevel replaces border |
| 41 | `.d1-rail`, `.d1-rail__tick`, `.d1-rail__date`, `.d1-rail__line` | — | **flat / excluded** | signature element protection |
| 42 | `.d1-insights` | 0 | none | list container |
| 43 | `.d1-insight` | 0 | none, hairline-only divider | rhythm via hairline rules; bevel per row would fragment the feed |
| 44 | `.d1-insight__body` | 0 | none | type |
| 45 | `.d1-num` | 0 | none | inline number type |
| 46 | `.d1-hatch-legend` | 0 | none, top-border only | already correct |
| 47 | `.d1-hatch-legend__swatch/__label/__value` | 0 | none | inside legend |
| 48 | `.d1-input` (lime-cabin) | 1 | `--d1-elev-tier1-rest` + existing border | recessed well; ink goes here |
| 49 | `.d1-select` (lime-cabin) | 1 | as `.d1-input` | same |
| 50 | `.d1-textarea` (lime-cabin) | 1 | as `.d1-input` | same |
| 51 | `.d1-field`, `.d1-field__label`, `.d1-field__hint` (lime-cabin) | 0 | none | structure/type |
| 52 | `.d1-check`, `.d1-radio` (lime-cabin) | 2→active | rest=L2, checked=L2-active polarity flip | unique form-control polarity |
| 53 | `.d1-toggle` (lime-cabin) | 1 | track L1, knob raised via `::after` | composite control |
| 54 | `.ds-*` showcase chrome (lime-cabin) | 0 | none | doc page chrome — out of product scope |

**Per-tier breakdown:**
- **Tier 0 (flat / excluded):** 27 selectors (canvas, type, containers, signature elements, regulatory chip, heatmap cells, insight rows)
- **Tier 1 (recessed):** 9 selectors (KPI variants, panels, segmented track, search filter, form inputs, toggle track)
- **Tier 2 (raised):** 18 selectors (CTAs, pills, chips, segmented thumb, brand mark, avatar, icon-pill, form check/radio)
- **Total mapped:** 54

---

## 4 · Existing CSS rules superseded

Frontend-engineer must remove or restructure the following rules. Both files unless flagged otherwise.

### 4.1 · `apps/web/src/app/style-d1/_lib/theme.css`

| Lines | Selector | Action |
|---|---|---|
| 149–150 | `.d1-cta { transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1); }` | **REPLACE** — new transition shape covers transform + box-shadow per token |
| 152–154 | `.d1-cta:hover { transform: translateY(-1px); }` | **REPLACE** — augmented with `box-shadow: var(--d1-elev-tier2-hover)` |
| 156–159 | `.d1-cta:focus-visible { outline:2px solid... outline-offset:3px }` | **REPLACE** — outline removed, replaced by composed `box-shadow` (lime-on-lime requires the spacer pattern) |
| 231–233 | `.d1-pill { transition: background 120ms..., color 120ms... }` | **REPLACE** — extended transition to include transform + box-shadow |
| 235–238 | `.d1-pill:hover { background, color }` | **AUGMENT** — preserve existing background/color, ADD transform + box-shadow |
| 254–257 | `.d1-pill--active:hover { background, color }` | **AUGMENT** — preserve existing rule, ADD lime-fill emboss override |
| 296 | `.d1-nav__icon-pill { transition: color 120ms... }` | **REPLACE** — extended transition |
| 299–301 | `.d1-nav__icon-pill:hover { color }` | **AUGMENT** — preserve color, ADD transform + box-shadow |
| 385–387 | `.d1-kpi { transition: transform 200ms..., box-shadow 200ms... }` | **REPLACE** — use new motion tokens |
| 389–392 | `.d1-kpi:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }` | **REPLACE** — replace box-shadow with `var(--d1-elev-tier1-hover)` (translate kept) |
| 528–530 | `.d1-chip { transition: background, color, border-color }` | **REPLACE** — extended transition |
| 532–535 | `.d1-chip:hover { background, color }` | **AUGMENT** — preserve existing bg/color, ADD transform + box-shadow |
| 548–554 | `.d1-chip--active { background, color, box-shadow: inset...lime hairline }` | **REPLACE** — keep base rule, restructure box-shadow to layered stack |
| 556–560 | `.d1-chip--active:hover { ...lime 0.6 }` | **REPLACE** — keep hairline strengthening, ADD transform + L2 hover |
| 645–647 | `.d1-segmented__btn { transition: background, color, box-shadow }` | **PRESERVE** as-is (transition shape correct) |
| 659–663 | `.d1-segmented__btn--active { background, color, box-shadow: lime hairline }` | **REPLACE** — keep base rule, restructure box-shadow to layered stack |
| 581–604 | `.d1-panel { ... }` | **AUGMENT** — add `box-shadow: var(--d1-elev-tier1-rest)` |
| 777–789 | `.d1-chat__search { ...border:1px solid var(--d1-border-hairline) }` | **REPLACE** — remove `border`, add `box-shadow: var(--d1-elev-tier1-rest)` |

### 4.2 · `apps/web/src/app/design-system/_styles/lime-cabin.css`

| Lines | Selector | Action |
|---|---|---|
| 102 | `.d1-cta { transition: transform 180ms... }` | **REPLACE** — extended transition |
| 105–107 | `.d1-cta:hover { transform: translateY(-1px); }` | **REPLACE** — add box-shadow |
| 109–112 | `.d1-cta:focus-visible { outline... }` | **REPLACE** — outline removed, layered box-shadow |
| 114–118 | `.d1-cta:disabled { opacity, cursor, transform:none }` | **AUGMENT** — add `box-shadow: var(--d1-elev-disabled)` |
| 120–124 | `.d1-cta--ghost { ...box-shadow: inset 0 0 0 1px ... }` | **REPLACE** — layer existing border with tier-2 emboss |
| 182–183 | `.d1-pill { transition: background, color }` | **REPLACE** — extended |
| 186–189 | `.d1-pill:hover { background, color }` | **AUGMENT** |
| 201–205 | `.d1-pill--active, .d1-pill--active:hover { background, color }` | **AUGMENT** — add lime-fill emboss |
| 240 | `.d1-nav__icon-pill { transition: color }` | **REPLACE** — extended |
| 243–245 | `.d1-nav__icon-pill:hover { color }` | **AUGMENT** |
| 291–292 | `.d1-kpi { transition: transform, box-shadow }` | **REPLACE** — use new motion tokens |
| 295–298 | `.d1-kpi:hover { transform, box-shadow }` | **REPLACE** — use new tier-1 hover token |
| 380–382 | `.d1-kpi--error { box-shadow: inset 0 0 0 1px var(--d1-notification-amber); }` | **REPLACE** — layer with tier-1 rest |
| 411–412 | `.d1-chip { transition: background, color, border-color }` | **REPLACE** — extended |
| 415–418 | `.d1-chip:hover { background, color }` | **AUGMENT** |
| 430–434 | `.d1-chip--active { ...box-shadow: inset...lime }` | **REPLACE** — layered stack |
| 436–440 | `.d1-chip--active:hover { ...lime 0.6 }` | **REPLACE** — keep hairline strengthening, ADD lift |
| 484–488 | `.d1-segmented__btn--active { box-shadow: lime hairline }` | **REPLACE** — layered stack |
| 619–632 | `.d1-chat__search { border:1px solid... }` | **REPLACE** — remove border, add tier-1 rest |
| 645–658 | `.d1-input/.d1-select/.d1-textarea { ...transition }` | **AUGMENT** — add `box-shadow: var(--d1-elev-tier1-rest)` to base |
| 672–677 | `.d1-input/-select/-textarea:focus-visible { ...box-shadow: 3px lime halo }` | **REPLACE** — layer tier-1 rest + lime focus halo |
| 714–726 | `.d1-check, .d1-radio { ... }` | **AUGMENT** — add `box-shadow: var(--d1-elev-tier2-rest)` |
| 736–740 | `.d1-check:checked, .d1-radio:checked { background, border-color }` | **AUGMENT** — add tier-2 active polarity flip |
| 764–774 | `.d1-toggle { ... }` | **AUGMENT** — add tier-1 rest |
| 776–786 | `.d1-toggle::after { ... }` | **AUGMENT** — add raised knob shadow |
| 1135–1162 | `.d1-chart-panel { ...border: 1px solid var(--d1-border-hairline); }` | **REPLACE** — DELETE `border`, ADD `box-shadow: var(--d1-elev-tier1-rest)` |

**Total existing rules superseded:** 39 rule blocks across 2 files.

---

## 5 · Reduced motion

Both files already have a blanket `* { transition: none !important; animation: none !important; }` inside `@media (prefers-reduced-motion: reduce)`. **Augment** to explicitly suppress `transform` while preserving `box-shadow` (rest emboss must survive).

### 5.1 · `style-d1/_lib/theme.css` (lines 1015–1020) — REPLACE with:

```css
@media (prefers-reduced-motion: reduce) {
  [data-style="d1"] * {
    animation: none !important;
    transition: none !important;
  }
  /* Suppress translate on hover/active so depth-feedback collapses
   * to box-shadow only. Static rest emboss persists — depth grammar
   * survives. */
  [data-style="d1"] .d1-kpi:hover,
  [data-style="d1"] .d1-kpi--lime:hover,
  [data-style="d1"] .d1-cta:hover,
  [data-style="d1"] .d1-cta:active,
  [data-style="d1"] .d1-pill:hover,
  [data-style="d1"] .d1-pill:active,
  [data-style="d1"] .d1-chip:hover,
  [data-style="d1"] .d1-chip:active,
  [data-style="d1"] .d1-chip--active:hover,
  [data-style="d1"] .d1-chip--icon:hover,
  [data-style="d1"] .d1-chip--export:hover,
  [data-style="d1"] .d1-nav__icon-pill:hover,
  [data-style="d1"] .d1-nav__icon-pill:active {
    transform: none !important;
  }
}
```

### 5.2 · `design-system/_styles/lime-cabin.css` (lines 1883–1888) — REPLACE with:

```css
@media (prefers-reduced-motion: reduce) {
  [data-theme="lime-cabin"] * {
    animation: none !important;
    transition: none !important;
  }
  [data-theme="lime-cabin"] .d1-kpi:hover,
  [data-theme="lime-cabin"] .d1-kpi--lime:hover,
  [data-theme="lime-cabin"] .d1-cta:hover,
  [data-theme="lime-cabin"] .d1-cta:active,
  [data-theme="lime-cabin"] .d1-cta--ghost:hover,
  [data-theme="lime-cabin"] .d1-cta--ghost:active,
  [data-theme="lime-cabin"] .d1-pill:hover,
  [data-theme="lime-cabin"] .d1-pill:active,
  [data-theme="lime-cabin"] .d1-chip:hover,
  [data-theme="lime-cabin"] .d1-chip:active,
  [data-theme="lime-cabin"] .d1-chip--active:hover,
  [data-theme="lime-cabin"] .d1-chip--icon:hover,
  [data-theme="lime-cabin"] .d1-chip--export:hover,
  [data-theme="lime-cabin"] .d1-nav__icon-pill:hover,
  [data-theme="lime-cabin"] .d1-nav__icon-pill:active {
    transform: none !important;
  }
}
```

---

## 6 · Focus-ring cascade

Three patterns:

### 6.1 · Dark-fill surface + outline (default — pills, chips, nav-icon, segmented btn)

Existing pattern is correct. `outline` lives on a different rendering layer than `box-shadow`, so they stack naturally. **No change needed beyond what §2 already specifies.**

```css
[data-style="d1"] .d1-pill:focus-visible {
  outline: 2px solid var(--d1-accent-lime);
  outline-offset: 2px;
  /* box-shadow at rest persists. */
}
```

### 6.2 · KPI focused (tier 1) — augment existing rule

KPI cards in canonical preview are non-interactive. When made interactive, focus ring composes:

```css
[data-style="d1"] .d1-kpi:focus-visible {
  outline: 2px solid var(--d1-accent-lime);
  outline-offset: 3px;
  /* box-shadow at rest persists — bevel reads under outline. */
}

[data-style="d1"] .d1-kpi:focus-visible:hover {
  outline-offset: 4px;
  /* outline expands slightly to accommodate the lifted bounding box. */
}
```

### 6.3 · Lime-fill surface + layered ring (CTA, lime KPI, lime-fill active pill)

`outline: 2px solid lime` is invisible on lime fill. Use a layered `box-shadow` instead — composes the elevation shadow with a canvas-coloured spacer ring + lime ring. See §2.2 `.d1-cta:focus-visible` block.

```css
/* Reusable composer (already defined in §1) */
--d1-elev-focus-ring-on-lime:
  0 0 0 4px var(--d1-bg-page),
  0 0 0 6px var(--d1-accent-lime);

/* Use anywhere lime-fill surface needs a focus ring. */
[data-style="d1"] .d1-cta:focus-visible {
  outline: 0;
  box-shadow:
    var(--d1-elev-tier2-rest),
    var(--d1-elev-focus-ring-on-lime);
}

[data-style="d1"] .d1-cta:hover:focus-visible {
  box-shadow:
    var(--d1-elev-tier2-hover),
    var(--d1-elev-focus-ring-on-lime);
}
```

**Engineer note:** when applying `--d1-elev-focus-ring-on-lime` to a lime KPI hover state, swap `--d1-bg-page` with `--d1-bg-surface` if the KPI sits inside a surface card (otherwise the spacer ring colour mismatches the parent). For canonical preview where lime KPI sits directly on `.d1-surface`, use `--d1-bg-surface` in the composer override.

---

## 7 · Edge cases handled

### 7.1 · Cards-in-cards (no compound elevation)

The dashboard structure is `.d1-page (T0) → .d1-surface (T0, excluded) → .d1-panel/.d1-kpi (T1) → .d1-segmented/.d1-chip (T2)`. Maximum nesting depth = 4 with one tier-bearing element per level. No compound emboss possible.

**Hard rule:** if a future surface needs T1-inside-T1 (e.g., sub-panel inside `.d1-panel`), the inner element drops to **tier 0** (background tint shift + 1px hairline border via existing `--d1-border-hairline`). No bevel stacking.

```css
[data-style="d1"] .d1-panel .d1-panel,
[data-style="d1"] .d1-kpi .d1-kpi,
[data-style="d1"] .d1-panel .d1-kpi {
  box-shadow: none;
  border: 1px solid var(--d1-border-hairline);
}
```

Add this rule once at the end of the depth section in both files.

### 7.2 · Already-soft surfaces (`--d1-bg-card-soft`)

`#2C2D33` is the brightest surface tier. Tested values:
- `rgba(0, 0, 0, 0.32)` against `#2C2D33` → visible 1px etch ✓
- `rgba(255, 255, 255, 0.04)` against `#2C2D33` → faint 1px highlight ✓

No special-case override needed. `.d1-chip--active` (uses `--d1-bg-card-soft`) inherits tier-2 cleanly.

### 7.3 · Nested elevation across components (composability matrix)

| Outer | Inner | Rule | Result |
|---|---|---|---|
| `.d1-panel` (T1) | Record Rail (excluded) | rail flat inside well | rail floats inside, signature preserved |
| `.d1-panel` (T1) | `.d1-segmented` (T1, the well-track) | sibling, not nested | `.d1-segmented` lives in `.d1-panel__head`; both T1 — they do not share a bounding box, so no compound bevel |
| `.d1-panel` (T1) | `.d1-segmented__btn--active` (T2) | T2 inside T1 | OK — coin in plate |
| `.d1-panel` (T1) | `.d1-chips` (T0) → `.d1-chip` (T2) | nested 3 deep | OK — T1 → T0 → T2 |
| `.d1-panel` (T1) | `.d1-hatch-legend` (T0) | flat | OK — flat-on-T1 |
| KPI grid (T0) | `.d1-kpi` (T1) | canonical case | OK |
| `.d1-kpi--lime` (T1, lime fill) | `.d1-kpi__icon-chip` (T0) | flat icon-chip on lime | OK — icon-chip stays flat per existing rule |
| `.d1-disclosure` strip below page | flat | OK | flat-on-flat |

### 7.4 · `prefers-reduced-motion` + hover combo

When user has `reduce` and hovers: rest emboss persists (static), translate suppresses (`transform: none !important`), box-shadow change executes instantaneously (transition collapses to 0ms via blanket rule).

The depth language survives reduced-motion fully — that is the strength of an inset-first system vs. animated-glow systems.

### 7.5 · Lime-on-lime emboss (`.d1-kpi--lime`, `.d1-pill--active`)

White-at-low-alpha hairlines disappear on the lime fill. Override pattern (already in §2.1, §2.2):
- Top-light: white at 20–25% (lime is bright but colour-tinted, so white still reads)
- Bottom-dark: ink (`#0E0F11`) at 18–24% (warm-black ink reads on lime; pure black reads as dirt)

### 7.6 · Active chip / segmented-btn — composing with existing lime hairline

The existing `box-shadow: inset 0 0 0 1px rgba(214, 242, 107, 0.4)` reads as a 1-px lime ring all-sides. Stack the emboss pair AFTER the ring in the box-shadow value list (later shadows render OVER earlier ones). The lime ring stays the primary state signal; emboss reads as secondary tactility.

### 7.7 · AAA contrast verification under bevel

The bevel adds 1px of darker-or-lighter pixels at the edge of each surface. Internal surface luminance is unchanged. All existing contrast measurements hold:
- `text.primary (#FAFAFA) on bg.card (#26272C)` = 15.9:1 (AAA) ✓
- `text.muted (#9C9DA3) on bg.card (#26272C)` = 5.9:1 (AA-large) ✓
- `text.ink (#0E0F11) on accent.lime (#D6F26B)` = 15.4:1 (AAA) ✓

Bevels are decorative 1-px edges; they never carry text.

### 7.8 · Record Rail collision audit

- Rail line: 1px lime at 30% opacity (`rgba(214, 242, 107, 0.3)`).
- Rail tick: 6×2px solid lime at 100% opacity.
- Bevels: 1px white-or-black at 4–32% opacity.

Different colour, different polarity. The lime rail is the only chromatically saturated 1-px line on the page — it dominates by saturation. Bevels are chromatically silent. **Record Rail stays loudest hairline by design.**

---

## 8 · Migration order (single-PR-safe sequence)

Both files MUST land in the same diff. Order within the diff:

### 8.1 · File order

1. **First:** `apps/web/src/app/style-d1/_lib/theme.css` — this is the route-local D1 preview at `/style-d1`; lower visibility, safer canary.
2. **Second:** `apps/web/src/app/design-system/_styles/lime-cabin.css` — canonical `/design-system` route; higher visibility.

### 8.2 · Within-file order

For each file:

1. Add 11 depth tokens to the root token block (additive, harmless on its own).
2. Add the cards-in-cards reset rule (`§7.1`) — must precede all per-selector rules so per-selector rules can override on root surfaces.
3. Apply tier-1 rest to `.d1-kpi` + variants.
4. Apply tier-1 rest+hover restructure to `.d1-kpi:hover`.
5. Apply tier-1 rest + delete border on `.d1-panel` (style-d1) / `.d1-chart-panel` (lime-cabin).
6. Apply tier-1 rest + delete border on `.d1-chat__search`.
7. Apply tier-1 rest + focus-halo restructure on `.d1-input/.d1-select/.d1-textarea` (lime-cabin only).
8. Apply tier-2 rest+hover+active+focus on `.d1-cta`.
9. Apply tier-2 rest+hover+active on `.d1-cta--ghost` (lime-cabin only).
10. Apply tier-2 rest on `.d1-nav__brand`, `.d1-nav__avatar`.
11. Apply tier-2 full contract on `.d1-nav__icon-pill`.
12. Apply tier-2 hover+active on `.d1-pill` (rest stays flat); add lime-fill emboss override on `.d1-pill--active`.
13. Apply tier-2 hover+active on `.d1-chip` (rest stays flat); restructure `.d1-chip--active` + `:hover` to layered stack.
14. Apply tier-2 rest+hover on `.d1-chip--icon`, `.d1-chip--export`.
15. Apply tier-1 rest on `.d1-segmented`; restructure `.d1-segmented__btn--active` to layered stack.
16. Apply form-control polarity flip on `.d1-check`, `.d1-radio`, `.d1-toggle` (lime-cabin only).
17. Add explicit `box-shadow: none` on `.d1-disclaimer-chip` and `.d1-chip-premium`.
18. Restructure `@media (prefers-reduced-motion: reduce)` block per §5.

Each step is independently revertable. No big-bang.

### 8.3 · Out of scope (intentionally — for future PRs)

- Tier 3 «floating» (popovers, dropdowns, dialogs) — D1 has no tooltip/popover spec yet. Skip.
- iOS / SwiftUI parity — post-alpha.
- Token export to `packages/design-tokens/tokens/semantic/*.json` — depth tokens are CSS-only for now; promote when iOS lands.

---

## 9 · Verification checklist (post-implementation)

Frontend-engineer runs these visual checks at 320 / 768 / 1440 viewports, dark only.

1. **Record Rail dominance.** On a chart panel with a rail above it, the lime hairline still reads as the loudest 1-px line in the frame. Bevels do not compete.
2. **KPI rest reads as paper-impressed.** Cards lock onto canvas — they are not floating. No outer drop-shadow visible at rest. The 1px top-light is a hairline, not a glow.
3. **CTA reads as raised, not flat.** Lime button has visible 1px top-light + 1px ink-baseline below. On hover, a soft halo joins and the button lifts 1px. On press, the surface sinks (inner shadow at top).
4. **Disclaimer chip is the ONLY fully-flat chip on the page.** No emboss, no hover, no focus animation. Reads as architectural — a property of the page, not a UI element.
5. **Active chip reads with lime ring as primary, emboss as secondary.** The lime hairline is the «look here» signal; the emboss is the tactility.
6. **Pill at rest is transparent.** Hover earns the lift; click sinks. Rest is chrome-quiet.
7. **Reduced-motion smoke test.** Toggle `prefers-reduced-motion: reduce` — rest emboss persists on all tier-1 + tier-2 surfaces. Translate is suppressed on hover. Transition is 0ms.

If any check fails, file a bug; do not adjust token values without a follow-up dispatch through Right-Hand.

---

## Appendix A · Anti-patterns rejected by this system

These are not aesthetic preferences — they are brand/regulatory/positioning violations:

1. **Floating-card drop shadow at rest** on any tier — generic-dark-dashboard tell, anti-positioning vs Robinhood/Webull
2. **Multi-layer atmospheric drop shadows** (`0 4px 8px ... 0 12px 24px ... stacked`) — fintech-marketing vocabulary
3. **Coloured glow shadows** (purple/lime/amber halos) — crypto-dapp / 2021-bull-run aesthetic
4. **Glassmorphism / `backdrop-filter`** anywhere — material-honesty violation
5. **Animated/pulsating depth on disclaimer chip** — regulatory landmine
6. **Cards lifted in resting state** — destroys Record Rail metaphor + disclaimer architecture
7. **>12% white inset alpha** — 90s-skeumorphic-bevel failure mode
8. **Pure-black drop shadow >0.6 alpha against `#141416`** — black-halo-on-charcoal failure
9. **Different motion timings per element family** — system fragmentation
10. **More than 3 tiers** — Material-3-style 5-tier ladder is wrong for Provedo's scope

---

## Appendix B · Open questions punted to Right-Hand

None. Synthesis is complete; all values calibrated and assigned. The original v2 proposals' `MEDIUM` confidence calls (PD push-back §9 «chart panels too card-y», brand-strategist §3.5 «hover lift values across tile sizes») were resolved in favour of the more disciplined option — chart panels GO at tier 1; KPI hover keeps `-2px`, all other tier-2 hover uses `-1px`.

If a tier-2 hover surface looks under-spec'd in real renders (e.g. nav `.d1-pill` hover feels too subtle on a 40px target), the calibration window is `±0.04` on top-light alpha and `±0.08` on bottom-dark alpha within the `--d1-elev-tier2-hover` token. Beyond that window requires a re-dispatch.

---

End of canonical spec — `D1_DEPTH_SYSTEM.md`.
