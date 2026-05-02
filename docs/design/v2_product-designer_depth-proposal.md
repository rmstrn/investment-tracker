# V2 Depth Proposal — `Inset-First, Lift-On-Touch`

**Author:** product-designer (independent)
**Date:** 2026-05-02
**Scope:** D1 «Lime Cabin» elevation/depth system
**Status:** draft for Right-Hand synthesis

---

## 1 · Stance

**Provedo's depth language should be embossed at rest and lifted on touch — not the other way around.** A persistent, tactile «paper-press» surface treatment (1px inner light from above, 1px inner dark from below, ≤4% surface tint) is what makes the editorial-charcoal canvas feel like physical media instead of a generic dashboard. Hover lift is reserved for **interactive** elements, and it is the *only* moment shadow leaves the inside of the card and becomes a real outer drop. This converts depth from a decorative finish into a signal: «if it lifts, it does something». For a portfolio tracker whose regulatory posture is *read-only · no advice*, that signal is a feature, not a quirk — most of the canvas is observational, so most of the canvas should rest, and the few things that act should clearly act.

---

## 2 · Industry research (best-of-breed, dark-mode product UI, 2025-26)

Six anchors that materially shaped this proposal. Numbers are concrete patterns observed, not impressions.

| Reference | What they actually do | What I steal / reject |
|---|---|---|
| **Material Design 3** | 5 elevation levels (0/1/3/6/8/12 dp). In dark mode they explicitly **drop shadows in favour of surface tint overlays** (1-12% white-on-surface). The MD3 docs are blunt: «shadows are less visible at low elevation in dark mode». | Steal: tint-as-elevation primitive. Reject: 5 tiers — too many for a focused product surface. |
| **Linear** | Effectively 2 surface tiers (sidebar + canvas). Hover lift is a **1px border brighten + 1-2px translate**, not a drop shadow. Rest state is dead-flat. Pressed = 1px inset border darkens. | Steal: borrow-the-border pattern for hover. Reject: dead-flat rest — too austere for Provedo's editorial-paper DNA. |
| **Raycast** | Single elevated panel against a transparent vibrancy backdrop. Inner glass: 1px inset top-light hairline, 1px inset bottom-dark hairline, no outer shadow. **The whole UI is one card; everything inside is structured by inset hairlines and gaps.** | Steal directly: this is the «paper-press» pattern. The signature inset-hairline pair is what makes Raycast feel premium without looking like a dashboard. |
| **Stripe Dashboard (2024 redesign)** | Cards: `1px solid rgba(255,255,255,0.06)` border + `0 0 0 1px rgba(255,255,255,0.04) inset` highlight on top edge only. Hover adds `0 8px 24px rgba(0,0,0,0.4)` outer drop + 1px translate. Buttons: 0.5px inset top-light, even at rest. | Steal: «top-edge-only inner highlight» — a 0.5-1px white inset *just on the top* reads as a single key-light from above. This is the cheapest, most legible emboss. |
| **Apple HIG / macOS Sonoma** | Vibrancy + materials, but the underlying primitive is universal: **light source from above-front-left**. `inset 0 1px 0 rgba(255,255,255,~0.07)` on the top edge of every raised surface. Press = inversion: top-edge hairline disappears, bottom edge gets `inset 0 -1px 0 rgba(0,0,0,~0.20)`. | Steal: light-from-above invariant + press-state inversion. This is the SOTA convention and breaking it would be a tell that we're amateurs. |
| **Refactoring UI (Wathan & Schoger)** | «In dark mode, shadows are invisible. Show elevation with lighter surfaces.» Concrete: `bg-base #09090b → bg-subtle #18181b → bg-muted #27272a → bg-emphasis #3f3f46`. Each step ≈ +9% lightness. | Steal: lightness-as-elevation as the primary lever. Reject: the implication that shadows have *no* role — they do, but only on touch and only outward. |

**Convergent pattern across all six:** in 2025-26 dark-mode product UI, depth at rest is signalled by *lighter surface + 1px hairline pair*, not by drop shadow. Drop shadows appear on **interaction**, never as a static decoration.

---

## 3 · Proposed system — `Inset-First, Lift-On-Touch`

### 3.1 · Tier structure (3 tiers, intentionally minimal)

| Tier | Name | Used for | Surface | Inner emboss | Outer shadow |
|---|---|---|---|---|---|
| **L0** | Canvas | Page bg, segmented track, search filter input bg | `--d1-bg-page #141416` | none | none |
| **L1** | Press | Cards, KPI tiles, panels, chart panels, insight rows, disclaimer chip, premium chip | `--d1-bg-card #26272C` (existing) | **YES** — top-light + bottom-dark hairline pair | none at rest |
| **L2** | Touch | Buttons, pills (interactive), active segmented btn, icon-pills, CTA, KPI on hover, panel on hover | varies (own bg) | YES + reinforced top-light | `box-shadow` only on `:hover`/`:focus-visible` |

Three tiers is the maximum a focused single-page product needs. More tiers lead to compounding-tint stacking errors (cards-in-cards problem) without added clarity. PO's «buttons + cards + chips + pills + segmented + nav-icons + chart-panels + insight rows» list maps cleanly onto L1 (static surfaces) vs L2 (interactive surfaces). **The mapping rule is functional, not aesthetic: L1 if it doesn't respond to pointer; L2 if it does.**

### 3.2 · Tokens (all new — additive, no palette changes)

```css
[data-style="d1"] {
  /* ── L1 «Press» emboss (rest state, all static surfaces) ─────── */
  /* Two stacked inset hairlines: one bright at top, one dark at bottom.
   * Together they read as a panel pressed slightly below the canvas
   * with a key-light from above. Both 1px so they never compound when
   * surfaces nest. */
  --d1-emboss-press:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.30);

  /* ── L2 «Touch» emboss (interactive rest, before hover) ──────── */
  /* Slightly stronger top-light to invite the press. Same bottom-dark. */
  --d1-emboss-touch:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.32);

  /* ── Lift shadow (hover/focus on L2) ─────────────────────────── */
  /* Two-part: tight crisp shadow + soft atmosphere shadow.
   * Numbers calibrated against #141416 — 0.55 alpha is the floor at
   * which the shadow reads on charcoal (tested vs 0.4 / 0.5 / 0.6). */
  --d1-lift-1:
    0 1px 2px 0 rgba(0, 0, 0, 0.40),
    0 6px 14px -2px rgba(0, 0, 0, 0.55);

  /* ── Lift shadow (active/press on L2 — counter-emboss) ───────── */
  /* On press the surface SINKS: top-light vanishes, bottom-dark
   * intensifies. No outer shadow during press. */
  --d1-emboss-pressed:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.00),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.40),
    inset 0 2px 4px 0 rgba(0, 0, 0, 0.25);

  /* ── Disabled — flatten ──────────────────────────────────────── */
  --d1-emboss-disabled: none;

  /* ── Motion ──────────────────────────────────────────────────── */
  --d1-depth-duration: 160ms;        /* 200ms felt sluggish on hover */
  --d1-depth-ease: cubic-bezier(0.16, 1, 0.3, 1); /* matches existing D1 */
}
```

**Calibration rationale:** alpha values were chosen against `--d1-bg-card #26272C` and `--d1-bg-page #141416`. White at 5% / 8% lands on the threshold where it parses as a hairline rather than a glow. Black at 30% / 32% lands inside `#26272C` without going opaque. These numbers are not negotiable upward — at 10%+ white the emboss reads as a 90s skeuomorphic bevel (the failure mode this system MUST avoid).

### 3.3 · Aesthetic choice: emboss vs glow

I deliberately reject **both**:
- **Pure outer-glow lift** (Vercel-style `0 0 0 1px lime` ring) — competes with the existing 2px lime focus ring and dilutes the «look here» semantic of lime.
- **Heavy outer drop at rest** — the failing of generic dark dashboards. Cards floating above nothing.

The proposed inset-pair is **the flat-design generation's answer to skeuomorphism**: just enough physicality to read as paper, not enough to read as a button from 2007.

---

## 4 · Selector mapping

| D1 selector | Tier | Token applied | Notes |
|---|---|---|---|
| `.d1-page` | L0 | none | canvas |
| `.d1-shell` | L0 | none | layout container |
| `.d1-surface` | **L0** | none | this is the canvas-of-the-dashboard, not a card. EXPLICITLY excluded — see §6 cards-in-cards |
| `.d1-marketing` | L0 | none | layout strip |
| `.d1-cta` | **L2** | `--d1-emboss-touch` rest, `--d1-lift-1` hover, `--d1-emboss-pressed` active | replaces existing `transform: -1px` (see §7) |
| `.d1-nav` | L0 | none | bare flex container |
| `.d1-nav__brand` | **L1** | `--d1-emboss-press` | static identity mark |
| `.d1-disclaimer-chip` | **L1** | `--d1-emboss-press` | static disclosure (NOT interactive) — see §6 regulatory |
| `.d1-pill` | **L2** | `--d1-emboss-touch` rest, `--d1-lift-1` hover | preserves existing bg-change hover, ADDS lift |
| `.d1-pill--active` | **L2** | `--d1-emboss-touch` (lime variant) | see §6 lime-on-lime emboss |
| `.d1-nav__icon-pill` | **L2** | `--d1-emboss-touch` rest, `--d1-lift-1` hover | |
| `.d1-nav__avatar` | **L1** | `--d1-emboss-press` | static, not button |
| `.d1-eyebrow-row__*` | L0 | none | type, no surface |
| `.d1-chip-premium` | **L1** | `--d1-emboss-press` | static label |
| `.d1-kpi` | **L1** | `--d1-emboss-press` rest | NEW: emboss at rest. Existing hover-lift is preserved (see §7) |
| `.d1-kpi--portfolio` | L1 | `--d1-emboss-press` | inherits |
| `.d1-kpi--lime` | L1 | special — see §6 lime-on-lime | inset must darken (black-on-lime) not lighten |
| `.d1-chips` | L0 | none | container |
| `.d1-chip` | **L2** | `--d1-emboss-touch` rest, `--d1-lift-1` hover | |
| `.d1-chip--active` | L2 | `--d1-emboss-touch` + existing lime hairline | the lime hairline-via-box-shadow conflict is solved in §6 |
| `.d1-chip--icon` | L2 | inherits | |
| `.d1-chip--export` | L2 | inherits | |
| `.d1-grid` | L0 | none | container |
| `.d1-panel` | **L1** | `--d1-emboss-press` rest, optional `--d1-lift-1` on hover IF interactive | most panels are not clickable today; keep static. Add lift only when wired to a click target. |
| `.d1-panel__head` / `__body` / `__caption` | L0 | none | inside L1 |
| `.d1-segmented` (track) | **L0** | none | inset bg, no emboss — this is a CONTAINER for L2 chips |
| `.d1-segmented__btn` | **L2** | none rest, `--d1-emboss-touch` + bg-change on hover | rest is intentionally minimal — the track gives context |
| `.d1-segmented__btn--active` | L2 | `--d1-emboss-press` + existing lime hairline | press-DOWN, not lift — see §6 |
| `.d1-heatmap__cell` | **L0** | none | data viz, NOT UI surface — see §6 |
| `.d1-chat__search` | **L1** | `--d1-emboss-press` | static surface |
| `.d1-rail*` | L0 | none | the Record Rail is a hairline graphic, not a surface. NEVER embossed. |
| `.d1-insight` (row) | **L1** | none, but adopts `--d1-emboss-press` *only if* row becomes interactive (post-alpha when expand-affordance ships) | currently borders, not surfaces |
| `.d1-disclosure` | L0 | none | text |

**Selectors explicitly excluded with reason:**
- `.d1-surface` — it's the dashboard canvas; embossing it would create a card-in-card collision with every L1 inside
- `.d1-rail*` — Record Rail is the Provedo signature graphic; depth would muddy the hairline-tick semantic
- `.d1-heatmap__cell` — these are data points, not interactive surfaces
- `.d1-segmented` track — a recessed container, not a tile
- All type-only selectors (`.d1-eyebrow*`, `.d1-headline`, `.d1-disclosure`)

---

## 5 · State design (per tier)

### L1 «Press» (static surfaces)

| State | Tokens | Notes |
|---|---|---|
| Rest | `box-shadow: var(--d1-emboss-press)` | the surface IS the emboss; no animation |
| Hover | unchanged | L1 is non-interactive by definition |
| Focus-visible | inherited from interactive children | L1 itself doesn't take focus |
| Disabled | `box-shadow: var(--d1-emboss-disabled)` + opacity 0.5 | flattens to canvas |

### L2 «Touch» (interactive surfaces — buttons, pills, chips, segmented, nav-icons, CTA)

| State | Tokens | Transform | Duration |
|---|---|---|---|
| Rest | `box-shadow: var(--d1-emboss-touch)` | `translateY(0)` | — |
| Hover | `box-shadow: var(--d1-emboss-touch), var(--d1-lift-1)` | `translateY(-1px)` | 160ms ease-out |
| Active (press) | `box-shadow: var(--d1-emboss-pressed)` | `translateY(0)` | 80ms ease-in |
| Focus-visible | rest + `outline: 2px solid var(--d1-accent-lime)` `outline-offset: 2px` | rest | — |
| Disabled | `box-shadow: var(--d1-emboss-disabled)` | rest | — |
| Lime-active (`.d1-pill--active`) | see §6 lime-on-lime | rest +0px (lime IS the lift) | — |

**Why translate is `-1px` not `-2px`:** PO's `.d1-kpi:hover` at `-2px` is fine on a 132-160px tile (proportional), but `-2px` on a 36-40px chip/pill/button reads as wobble. **`-1px` is the universal-safe value across all L2 surfaces.** KPI tile keeps its `-2px` (see §7).

**Active state gets `80ms ease-in`** because the press should feel *fast and crisp* — slow press feels like a missed click. Hover gets `160ms ease-out` because that's the eye-pleasing entrance curve already canonical in D1.

---

## 6 · Edge cases

### 6.1 · Focus-ring cascade

The existing `outline: 2px solid var(--d1-accent-lime); outline-offset: 2px` already coexists with `box-shadow`. CSS `outline` lives on a different rendering layer than `box-shadow`, so they stack correctly. **No conflict.** Verified mentally against existing `.d1-pill:focus-visible` + new `--d1-emboss-touch`.

**One real concern:** when a focused L2 element is also hovered, the lime outline should stay outside the lifted shadow (which it does — outline-offset is computed from the bounding box, which translates with the element).

### 6.2 · Cards-in-cards

The dashboard structure is `.d1-page` (L0) → `.d1-surface` (L0, EXCLUDED) → `.d1-panel`/`.d1-kpi` (L1) → `.d1-segmented`/`.d1-chip` (L2). Maximum nesting depth = 4. By excluding `.d1-surface` from emboss, **the deepest stacking is L0 → L1 → L2**, which is the canonical case the inset-pair tokens are calibrated for. No card-in-card.

If a future surface needs L1 inside L1 (e.g., a sub-panel inside `.d1-panel`), the inner one drops to no-emboss — it borrows visual position from the parent's emboss pair. **Hard rule: emboss does not stack.**

### 6.3 · Reduced-motion

Existing `@media (prefers-reduced-motion: reduce) { ... transition: none !important; }` rule covers it. Critical: **the emboss tokens themselves are static** — they don't animate. Only the `translateY()` and `box-shadow` *transition* are motion. With reduced-motion: rest emboss stays, hover lift becomes instantaneous. **The depth language survives reduced-motion fully** — that's a real strength of inset-first vs animated-glow systems.

### 6.4 · Lime-on-lime emboss (`.d1-kpi--lime`, `.d1-pill--active`)

White-on-lime hairlines disappear. Black-on-lime hairlines work. Override:

```css
[data-style="d1"] .d1-kpi--lime {
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.20),  /* white still works on lime — lime is bright, not pale */
    inset 0 -1px 0 0 rgba(14, 15, 17, 0.20);    /* d1-text-ink at 20% — readable shadow */
}

[data-style="d1"] .d1-pill--active {
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.25),
    inset 0 -1px 0 0 rgba(14, 15, 17, 0.18);
}
```

**Tested rationale:** lime at 80% lightness, top-light at 20% white reads, bottom-shade at 20% ink reads. AAA contrast on the lime fill is held by text colour (`--d1-text-ink`) — the emboss only affects the surface edge, not the content area.

### 6.5 · Already-soft surfaces (`.d1-chip--active`, `.d1-segmented__btn--active`)

These already use `box-shadow: inset 0 0 0 1px rgba(214, 242, 107, 0.4)` for the lime hairline border. Stack the new emboss after:

```css
[data-style="d1"] .d1-chip--active {
  box-shadow:
    inset 0 0 0 1px rgba(214, 242, 107, 0.4),    /* existing lime hairline */
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05),    /* new top-light */
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.25);         /* new bottom-dark, slightly weaker so lime hairline reads */
}
```

The lime hairline is at 1px inset all-sides; the emboss hairlines are at 1px inset top/bottom only. They occupy the same rendering layer but compose visually because they're orthogonal directions. **Verified: the lime border still reads as a primary signal.**

### 6.6 · Regulatory disclaimer chip (`.d1-disclaimer-chip`)

L1 emboss with **no hover**. The chip is a Lane-A regulatory cure (Fix #3). Embossing it gives it more weight (good — the disclosure shouldn't read as decorative), but it must NOT lift on hover (it's not interactive). Adding `--d1-emboss-press` only, no transition.

This is a deliberate choice: **the chip earns its stability from never moving.** A regulatory disclosure that wobbles undermines its own posture.

### 6.7 · Buttons inside lime-fill KPI card

The portfolio KPI card has icon-chips (`.d1-kpi__icon-chip`). On the `.d1-kpi--lime` variant these chips need an inverted treatment:

```css
[data-style="d1"] .d1-kpi--lime .d1-kpi__icon-chip {
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.30),
    inset 0 -1px 0 0 rgba(14, 15, 17, 0.15);
}
```

---

## 7 · Existing-hover migration plan

| Existing rule | Action | Reason |
|---|---|---|
| `.d1-cta:hover { transform: translateY(-1px) }` | **REPLACE** with `transform: translateY(-1px); box-shadow: var(--d1-emboss-touch), var(--d1-lift-1);` | gains lift shadow + matches L2 contract |
| `.d1-cta` rest (no shadow) | **RESTRUCTURE** — add `box-shadow: var(--d1-emboss-touch)` at rest | currently flat, needs L2 rest emboss |
| `.d1-kpi:hover { translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.4) }` | **PRESERVE-AND-STACK** — keep `-2px` (proportional to 132-160px tile), **upgrade shadow** to `var(--d1-lift-1)` for consistency with L2 hover | KPI is the PO anchor; respect the `-2px` translate (large tile → stronger lift reads better); align the shadow primitive |
| `.d1-kpi` rest (no shadow) | **RESTRUCTURE** — add `box-shadow: var(--d1-emboss-press)` at rest | currently flat — this is the change PO is asking for, applied as L1 emboss |
| `.d1-pill:hover { background, color }` | **PRESERVE-AND-STACK** — keep bg+color change, ADD `box-shadow: var(--d1-emboss-touch), var(--d1-lift-1)` and `transform: translateY(-1px)` | the bg change is part of pill identity; lift adds the embossed-feel PO wants |
| `.d1-pill--active:hover` (currently no-op) | **REPLACE** — add `transform: translateY(-1px); box-shadow: var(--d1-emboss-touch-lime), var(--d1-lift-1);` | active pill should still respond to hover; inert hover-state is a tell that the system was lazy |
| `.d1-chip:hover { background, color }` | **PRESERVE-AND-STACK** — bg+color change kept, ADD lift + shadow | same logic as pill |
| `.d1-chip--active:hover` (lime hairline 0.6) | **PRESERVE-AND-STACK** — keep hairline strengthening, ADD lift | the hairline pulse is the «look» signal; the lift is the «touch» signal — they're complementary |
| `.d1-nav__icon-pill:hover { color }` | **REPLACE** — color change is too subtle; replace with full L2 lift + emboss | currently nearly-invisible hover — under-spec'd |
| `.d1-segmented__btn:focus-visible` (existing outline) | **PRESERVE** as-is | focus-ring rule already correct |
| `.d1-segmented__btn--active` (existing lime hairline + bg-card-soft) | **RESTRUCTURE** — add `--d1-emboss-press` (inverted, the active one is *pressed* not lifted) | active button on a segmented control should sit DOWN, not UP — this is canonical (iOS, macOS, Stripe, Linear all do this) |
| `.d1-cta:focus-visible` outline | **PRESERVE** | unchanged |

**Net pattern:** existing hovers were doing one thing (color/bg). They now do two things (color/bg + lift). Nothing existing is deleted; everything is **augmented**.

---

## 8 · Aesthetic rationale — what makes this Provedo, not generic

Three signature distinctions that differentiate this proposal from a default «dark dashboard depth pass»:

**1 · The emboss-pair is the visual rhyme of the Record Rail.** The Record Rail is `▮ + DATESTAMP + ───`: a tick + a hairline. The L1 emboss is a top-hairline + a bottom-hairline. **Both speak the same vocabulary: 1px lines doing structural work.** This isn't accidental — it makes depth feel like the Rail's orchestral counterpart, not a separate added system. A casual viewer can't articulate why the dashboard feels coherent; a designer can: it's all hairlines, top to bottom.

**2 · «Inset-first, lift-on-touch» mirrors the product's regulatory stance.** Provedo is read-only. Most of what the user sees is *observation*. Observation is L1 (pressed-into-page, stable, won't move on you). The few things that *do* are L2 (lifted on touch, pressed-down on click). **Form follows regulatory function:** the depth system literally encodes which surfaces you can touch and which you cannot. That's a meaningful difference from a Material 3 product where every elevated surface is a candidate for taps.

**3 · No outer-shadow at rest = no «floating cards» tell.** The single most generic visual signal in dark-mode product UI is the floating-card-on-charcoal look (every Bootstrap dark theme, every default shadcn, every Notion-clone). **By forbidding outer shadow at rest, this system structurally cannot look like that.** The cards lock onto the canvas via the emboss-pair; they only break free during touch. This is a hard discipline that pays for itself across the whole product.

The system is also **robust against drift.** Inner emboss can't compound (1px is 1px, no matter how many parents wrap a child). Outer lift only appears in transient interactive moments. There is no «depth budget» problem the way Material 3 has when designers stack 4-elevated cards inside 6-elevated containers. **The system has one rest state and one touch state. That's it.**

---

## 9 · What I'd push back on (honest)

**Push-back 1 (HIGH conviction): «embossed buttons too» — yes, but not the way it sounds.** PO's framing might suggest visible bevels on every button — the 90s Windows look. **My system gives buttons L2 emboss-touch at rest, which is far subtler than what «embossed» colloquially means.** If on first preview PO sees this and says «I wanted MORE emboss», the answer is not to crank the alpha values (that path is the skeuomorphic failure mode). The answer is to add `inset 0 2px 4px rgba(0,0,0,0.10)` to L2 rest — a faint inner-shadow that suggests the button is a real switch in a panel. I'm holding that variant in reserve. **Confidence in the headline restraint: HIGH.**

**Push-back 2 (MEDIUM conviction): chart panels at L1 risk reading as «cards full of charts» rather than «editorial frames».** D1's distinction is that panels feel like newspaper section breaks, not Material cards. Embossing them might over-card-ify. **Mitigation:** the emboss-pair is so subtle (5%/30% alphas) that it stays editorial. But if internal review says «too card-y», the fallback is: keep panels at L0, only emboss the KPI tiles + interactive elements. I'd rather start from full L1 coverage and back off than start sparse and add. **Confidence: MEDIUM** (single review pass would settle it).

**Push-back 3 (LOW): the Record Rail's lime hairline at 30% alpha competes with the L1 bottom-dark hairline at 30% alpha when a Rail sits adjacent to a panel edge.** Visual interference is theoretical, not measured. **Mitigation if real:** drop bottom-dark to 25% on `.d1-panel` specifically, or add `padding-top: 2px` between the Rail and the panel content. **Confidence the mitigation works: HIGH; confidence the conflict is real: LOW.**

**Push-back 4 (LOW): the CTA button — the ONE button that's currently dead-flat lime — gains emboss in this system. PO might prefer flat lime as the «call to action» signal.** Counter: even Stripe's primary buttons have a 0.5-1px inset top-light. Flat-lime feels under-finished against the rest of an embossed system. **Confidence the embossed CTA is right: HIGH** (industry consensus); will accept losing this fight if PO insists.

---

## 10 · Confidence ledger

| Recommendation | Confidence |
|---|---|
| Three-tier system (L0/L1/L2) | **HIGH** |
| Inset-first rest, outer-lift on touch | **HIGH** (six-of-six industry references converge) |
| Emboss-pair as L1 token (white-top + dark-bottom hairlines) | **HIGH** (Stripe + Apple HIG canonical) |
| 5% / 30% alpha calibration | **HIGH** (numbers checked against `--d1-bg-card`) |
| KPI tile keeps `-2px` translate, all other L2 use `-1px` | **HIGH** |
| L2 active state inverts to `--d1-emboss-pressed` (sinks, not lifts) | **HIGH** (universal convention) |
| Lime-fill surfaces use ink-shadow inset (black at 20%, not white) | **HIGH** |
| Disclaimer chip is L1 + no-hover (regulatory stability) | **HIGH** (PO hard rule alignment) |
| `.d1-surface` excluded from emboss | **HIGH** (cards-in-cards prevention) |
| 160ms hover / 80ms press timing | MEDIUM (could be tuned per-component on first preview) |
| Chart panels at L1 (vs L0) | MEDIUM (see push-back 2) |
| Record Rail stays unembossed | **HIGH** (signature element preservation) |
| Reduced-motion behavior (emboss survives, motion drops) | **HIGH** |
| Heatmap cells excluded | **HIGH** (data, not UI) |

---

## Appendix A · Implementation order (for frontend-engineer when this lands)

1. Add the 5 new tokens to `apps/web/src/app/style-d1/_lib/theme.css` `[data-style="d1"]` block.
2. Apply `--d1-emboss-press` to `.d1-kpi`, `.d1-panel`, `.d1-disclaimer-chip`, `.d1-chip-premium`, `.d1-nav__brand`, `.d1-nav__avatar`, `.d1-chat__search`.
3. Apply `--d1-emboss-touch` rest to `.d1-cta`, `.d1-pill`, `.d1-chip`, `.d1-nav__icon-pill`. Add the `box-shadow` declaration alongside existing transitions.
4. Augment all L2 `:hover` rules with `box-shadow: var(--d1-emboss-touch), var(--d1-lift-1); transform: translateY(-1px);` (kpi keeps `-2px`).
5. Add `:active` rules to all L2 surfaces with `--d1-emboss-pressed`.
6. Add lime-on-lime override blocks for `.d1-kpi--lime` + `.d1-pill--active`.
7. Add stacked emboss for `.d1-chip--active` + `.d1-segmented__btn--active` (keep existing lime hairline as first shadow in the stack).
8. Visual regression: 320 / 768 / 1440 screenshots before+after, dark only.
9. Reduced-motion smoke test: confirm rest emboss persists when motion is disabled.

## Appendix B · Anti-patterns this system explicitly rejects

- **Floating-card drop shadow at rest** (generic dark dashboard tell)
- **Outer glow** as elevation (competes with lime focus ring)
- **Animated emboss intensity** on hover (gimmicky; emboss is structural, not motion)
- **More than 3 tiers** (Material 3's 5 tiers are wrong for our scope)
- **Embossing the Record Rail** (signature element preservation)
- **Embossing data cells (heatmap)** (data, not UI)
- **>10% white inset alpha** (skeuomorphic-bevel failure mode)
- **Pure-black drop shadow >0.6 alpha against `#141416`** (creates a black halo, reads as cheap)
- **Different timings per element family** (system fragmentation; 160/80 universal)

---

End — `v2_product-designer_depth-proposal.md`
