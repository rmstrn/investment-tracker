# V3 Design Pass — Brand-Strategist Independent Proposal

**Author:** brand-strategist agent
**Date:** 2026-05-02
**Status:** Independent v3 proposal (parallel-track; product-designer + frontend-design generalist working in isolation; do not read each other's outputs)
**Brief:** PO challenged v2 «deboss-at-rest» consensus after live render — KPI cards perceptually flat on dark canvas. New polarity = **«cards up, inputs down»** (read-vs-write axis), not «active vs passive». Refine variant B from brand DNA lens; revisit palette (expansion ON the table); flag Provedo-specific risks.

---

## VERDICT

**SUPPORT-with-conditions.** Variant B's «read-vs-write» polarity is brand-defensible and arguably *more* honest to Provedo's editorial-ledger metaphor than the v2 «deboss-at-rest» consensus — but only if four conditions land:

1. **Cards-up uses tonal lift first, ink-baseline shadow second; never atmospheric multi-layer halos.** The v2 anti-pattern list (multi-layer drop shadows = Robinhood vocabulary) survives unchanged. Variant B is *not* a license for «every dark dashboard» depth.
2. **Inputs-down deboss is louder than cards-up emboss** — by design. The «invitation to type» metaphor is the Provedo-distinctive move; the cards-up read is the table-stakes move. Inverting that emphasis preserves originality.
3. **Record Rail must remain the loudest hairline on the page.** Its 1px lime tick + datestamp must not be visually overwhelmed by elevated-card halos. This is the single most important sign-off check.
4. **Disclaimer chip stays flat / out of the depth system entirely.** Lane-A cure is not a depth-grammar member.

Variant B is *not* a regression from the v2 brand-strategist proposal — it is a **polarity flip with the same governing constraints**. The v2 «inputs use `--d1-depth-pressed`» recommendation is the seed of variant B; PO has correctly extended that grammar to its logical conclusion: if writes recess, then reads must rise. The deboss-as-signature opportunity moves from cards to form fields. That's a clean trade.

---

## 1. Brand DNA assessment of variant B (Area 1)

### 1.1 Archetype read — does «cards up» serve Magician + Sage?

**Yes, with one Sage-protective constraint.** Magician + Sage primary (with Everyman modifier) maps onto variant B more naturally than I expected on first read. Here is the test:

- **Sage** wants material honesty. The Sage anti-position is «shiny chrome that pretends to float». What matters for Sage is not whether cards rise or recess — it is whether the depth move is *load-bearing*. Cards-up is Sage-correct *if* the rise communicates hierarchy weight (this card is the headline; this one is supporting). Cards-up is Sage-broken *if* every card rises identically (then depth carries no information and becomes decoration). **Condition: depth must vary by tier — the «look-here» KPI rises more than the supporting KPIs; the chart panel rises less than the headline KPI.** The product-designer's tier system (which I have not read) should encode this explicitly; if it doesn't, brand will reject.
- **Magician** is «wow without trick». Magician is *fine* with cards-up because the wow-moment in Provedo is the *content* (Provedo noticed your Q1 win was 71% FX tailwind), not the *chrome*. The chrome should be the supporting cast, not the magician. Variant B passes if the cards-up read is restrained enough that the eye lands on the lime KPI numeral, not on the card's edge highlight.
- **Everyman** is tactility — «an object you can touch». Both polarities serve Everyman; cards-up arguably serves it slightly better, because raised paper is more «pick up the document» and recessed cards are more «look down into the well». For ICP A (multi-broker, considered, post-burned), «pick up the document» is the ledger-correct read.

**Verdict: cards-up serves the archetype mix when depth varies by tier, and breaks it when every card rises the same amount.** This is the single most important brand-craft detail — and I expect it to be the dimension where product-designer and I are most likely to disagree on tuning.

### 1.2 Paper grammar — printed-and-laid vs pressed-into

The brief frames this as a clean trade: cards-up = «paper printed and laid on the page» (newspaper / ledger / printed report); cards-down = «paper pressed into the page» (book / archive / library). I think the framing is slightly off, and Provedo lands cleaner under a **third reading**:

> **Cards-up is the ledger entry on the desk; inputs-down is the form pressed into the blotter.** The page is the desk. The card is the document the user is reading. The input is the place the user is writing.

Under that reading, variant B is *more* Provedo than v2 was. v2 made cards behave like form fields (recessed, waiting for input that will never come — which is exactly the category error PO identified). Variant B restores semantic honesty: cards are read-surfaces, inputs are write-surfaces, and the depth grammar finally maps to the user's actual intent. This is Magician+Sage-correct in a way that v2 narrowly missed.

### 1.3 Record Rail co-existence — the conflict to surface

**There is a real conflict here, and I am flagging it explicitly.**

In v2 (cards recessed at rest), the rail was the loudest hairline on the page. Cards depressed *into* the substrate; the rail sat as ink *on* the substrate. The rail was unambiguously primary.

In variant B (cards raised at rest), the rail competes with the card edge for «which hairline does the eye notice first?». If cards-up uses a top highlight (`inset 0 1px 0 rgba(255,255,255,0.04)` or similar), that highlight runs along the *exact same edge* where the rail sits (top edge of the card). Two parallel hairlines, one lime, one white, both 1px. That is brand-breaking unless one of two things happens:

- **(A)** The card's top highlight is *below* the rail's lime tick — i.e., the rail sits at `top: 0` of the card; the highlight starts at `top: 1px`. This requires explicit selector ordering and pixel discipline in the product-designer's spec. **Mandatory.**
- **(B)** The card's top edge highlight is dropped entirely on cards that carry a rail — only cards *without* a rail get the top highlight. Cards with a rail get a side-and-bottom-only emboss. This is cleaner but requires a variant token (`--d1-depth-emboss--with-rail`).

I recommend **(B)** for the rail-bearing cards (KPI cards with a Provedo signature, AI insight feed). Cards without rails (chart panels, allocation drift) can use **(A)** — full top highlight permitted, no conflict.

**Brand-craft note for product-designer:** if your spec applies a uniform `inset 0 1px 0 rgba(255,255,255,X)` to all `.d1-kpi`, my verdict will move from SUPPORT-with-conditions to WARN. The rail must remain primary signature.

### 1.4 ICP cross-check

| Concern | ICP A (28-40, Bloomberg-credibility taste) | ICP B (22-32, Linear/Raycast-native, flatter taste) |
|---|---|---|
| Reaction to cards-up at rest | **Mildly positive** if restrained; **strongly negative** if reads as Robinhood / SaaS-marketing. The Bloomberg vocabulary is *containment*, not elevation — so cards-up must be subtle enough to read as «document on desk», not as «card on stage». |  **Neutral-to-mildly-negative.** Linear, Raycast, Arc, Notion all use flat-with-tonal-steps as default; cards-up at rest is *not* in the Linear-2025 vocabulary. The risk: variant B reads as «old-SaaS / pre-Linear» rather than «editorial-ledger». |
| Reaction to inputs-down (debossed form fields) | **Strongly positive.** Editorial-print convention; ink-goes-here metaphor. | **Positive.** Material 3 + iOS HIG both use this; not unfamiliar. |
| Reaction to varied-depth-by-tier (the Sage-protective constraint) | **Strongly positive.** Hierarchy through depth is a Bloomberg-vocabulary move. | **Positive,** especially if the differentiation reads as «obvious which is the headline» rather than «random elevation». |

**ICP verdict:** variant B lands cleaner for ICP A than for ICP B, and the gap matters. ICP B is the harder audience for cards-up. The mitigation: **keep card-up depth deliberately quiet** — the rest-state emboss should be perceptible-but-not-shouty, closer to «1px highlight + 1-2px hard ink baseline» than to «multi-layer atmospheric halo». This calibration is in the product-designer's hands; brand will validate against rendered output.

---

## 2. Palette expansion verdict (Area 2)

PO directive: «возможно расширить даже». The v2 «No new color tokens» constraint is rolled back. Below is the per-category assessment, grounded in `impeccable`'s color-and-contrast reference (OKLCH thinking, tinted neutrals, dark-mode-isn't-inverted-light, pure-gray-is-dead) and Provedo's brand DNA.

### Summary tally

| Category | Verdict | Tokens added | Tokens held | Tokens contracted |
|---|---|---|---|---|
| Status colors (success / warning / error / info) | **EXPAND — narrow** | 2 | 1 (amber held) | 0 |
| Tonal neutrals (chroma-tinted) | **EXPAND — replace** | 3 (tinted replacements) | 0 | 4 (pure-gray surfaces re-tinted in place — same names, new OKLCH values) |
| Accent splits (purple-deep / purple-soft) | **HOLD** | 0 | 2 (existing purple kept; existing «Premium» purple kept) | 0 |
| Chart multi-category palette | **EXPAND — disciplined** | 5 (chart-only namespace) | 0 | 0 |
| Brand-craft additions | **EXPAND — 1 token** | 1 (ink-on-paper warm-white for surfaces NOT primary text) | 0 | 0 |

**Total:** 11 tokens added, 3 held, 4 contracted (re-tinted in place, same name).

### 2.1 Status colors — EXPAND with brand-protective constraints

**Problem statement:** Provedo currently has lime (positive signal / look-here), purple (something-is-happening / AI), amber (notification badge only). There is no «success» token, no «error» token, and no «info» token. This is a real gap — when broker connection fails, when data is stale, when a sync succeeds, the system has nowhere to communicate that without overloading lime or purple.

**Brand constraint:** Provedo says «provides clarity», not «alarms». Loud red error states are *off-archetype* — they read as advisor-app urgency («sell now!»), which is exactly Lane-A-violating. Status colors must be calm, specific, sage-coded.

**Recommended additions (OKLCH grounded):**

```css
/* SEMANTIC STATUS — additions */

/* Success — quiet green, NOT lime. Lime is reserved for «look here» semantic. */
--d1-status-success: oklch(72% 0.14 152);   /* desaturated forest-leaf */
--d1-status-success-bg: oklch(28% 0.04 152 / 0.18); /* card-tint for success rows */

/* Error — desaturated brick, NOT pure red. Lane-A-friendly (calm, not alarm). */
--d1-status-error: oklch(64% 0.16 28);      /* warm clay-brick, reads as «attention» not «emergency» */
--d1-status-error-bg: oklch(28% 0.05 28 / 0.18);

/* Info — already covered by text.muted on bg-card (no new token).
   If a discrete info state is needed: use existing accent.purple at 70% lightness. */

/* Warning — already covered by amber (#F4C257). Keep as-is. */
```

**Brand rationale per choice:**
- **Success-green at chroma 0.14 (not 0.22).** Lime sits at chroma 0.18 and hue 122. A success token at full chroma would compete with lime. Desaturating to 0.14 + shifting hue from 122 to 152 (more forest, less neon) keeps success readable as «system OK» without stealing lime's «look here» punch. This is the impeccable tinted-neutrals discipline applied to semantic colors: keep distance from primary accent.
- **Error-clay at hue 28 (not 0 / pure red).** Hue 0 (true red) carries «sell / panic / advisor-urgent» semantics. Hue 28 (warm clay-brick) reads as «Roman-pottery attention» — calm, considered, not alarming. Lane-A-correct. ICP A reads it as «editorial print» (NYT correction-of-record red has hue ~25-30); ICP B reads it as «designed-not-default red» (Linear's error red is at hue ~22).
- **No info token needed.** Existing `text.muted` (`#9C9DA3`) on `bg.card` carries info perfectly. Resist the temptation to add a blue. Adding blue would invoke the «every fintech is navy + green-up + red-down» trope that anti-positioning rejects.
- **Amber held.** `#F4C257` is brand-correct for notification badges and serves warning semantic well. No change.

**Anti-pattern guarded:** never use the success-green as a card-fill at full saturation. It must stay subordinate to lime. If a designer reaches for «green for the up-arrow on portfolio value», reject — that's the navy-and-greens fintech default that Provedo does not occupy. Up-deltas use lime accent or stay neutral; success-green is for *system states*, not for *financial deltas*.

### 2.2 Tonal neutrals — REPLACE in place (highest-impact change)

**Problem statement (from impeccable color-and-contrast):** *"Pure gray is dead."* The current Provedo palette uses near-zero chroma neutrals (`oklch(17% 0.003 270)` page, `oklch(23% 0.005 270)` surface, `oklch(28% 0.006 270)` card). These read as «dead gray» next to the saturated lime. The hue-270 cast (cool blue-purple) is also the default «AI dashboard» tint that anti-positioning rejects. **This is a brand-DNA problem hiding inside the palette.**

**Proposed re-tint (same token names, new OKLCH values):**

```css
/* TONAL NEUTRALS — re-tinted toward editorial-warm */

/* Page — was oklch(17% 0.003 270), now subtly warm */
--d1-bg-page: oklch(17% 0.008 75);        /* hex ≈ #15140F — warm charcoal, paper-shadow read */

/* Surface — was oklch(23% 0.005 270), now warm-neutral */
--d1-bg-surface: oklch(23% 0.010 75);     /* hex ≈ #20201B — surface card, warmer cast */

/* Card — was oklch(28% 0.006 270), now warm-charcoal */
--d1-bg-card: oklch(28% 0.012 75);        /* hex ≈ #28271F — card surface */

/* Card-soft — was oklch(31% 0.005 270), now warmer */
--d1-bg-card-soft: oklch(31% 0.014 75);   /* hex ≈ #2D2C24 */
```

**Brand rationale:**
- **Hue 75 (warm orange-tan) instead of 270 (cool blue-purple).** This is the editorial-paper hue — old book pages, ledger paper, Field Notes covers. It tints the dark canvas toward «aged paper» rather than «cyber dashboard». Lime at hue 122 sits 47° away — perceptually clean separation. Purple at hue 285 sits 150° away — opposite side of the wheel, cleanest possible separation.
- **Chroma 0.008-0.014 (raised from 0.003-0.006).** Within impeccable's 0.005-0.015 tinted-neutrals band. Subconscious cohesion with the warm signature, not consciously read as «tinted» — meaning the canvas reads as «warm-charcoal» at first glance, «cool-charcoal» on color-meter-pull. ICP A senses gravitas; ICP B doesn't read it as old-SaaS because the chroma is below the «obvious» threshold.
- **Lightness held within ±1% tolerance of v2 values.** Contrast ratios on `text.primary` (FAFAFA) over `bg.card` move from 17.8:1 to ~17.3:1 — still AAA. No accessibility regression.

**Brand-craft impact:** this single change does *more* to differentiate Provedo from «every dark dashboard» than any single component-level depth move. It's the cheapest, lowest-risk, highest-payoff brand intervention available, and it composes with everything else in the system. **Strongest single recommendation in this document.**

**Anti-pattern guarded:** do *not* tint toward warm orange (hue 60). That's the «friendly = warm» reflex impeccable explicitly warns against. Hue 75 is *toward* warm but stays in the editorial-paper register, not the «cozy fireside» register.

### 2.3 Accent splits (purple) — HOLD

The brief asks: should purple split into purple-deep + purple-soft?

**No.** Purple already serves three roles cleanly:
- `accent.purple` (`#7B5CFF`, oklch 58% / 0.22 / 285) — bar-chart highlight, AI avatar, tooltip
- The Premium-chip lighter purple (`oklch(72% 0.16 285)`) — already specced in D1 as a chip-only variant

That's effectively two purple tokens and they have non-overlapping use cases. Adding more purple shades would (a) dilute purple's «something is happening» semantic the same way lime overuse diluted lime in the Fix #5 audit, and (b) introduce decision fatigue (which purple goes where?). **Hold.**

The one *theoretical* third-purple use case — negative-delta marker (e.g., portfolio down) — is better served by no color at all (neutral muted text) per the Lane-A-correct «we don't shout» principle. Provedo never says «PANIC RED / SAFE GREEN»; it says «here is the number; here is the context».

### 2.4 Chart multi-category palette — EXPAND in chart-only namespace

**Problem statement:** lime/purple binary works for delta (one direction) and for «highlighted vs background» (one accented bar). For multi-category charts (sectors, holdings list, ticker breakdowns), Provedo currently has nothing — designers will reach for arbitrary colors and brand will fragment.

**Proposed chart-only palette (5 hues, namespaced separately to prevent leakage into UI chrome):**

```css
/* CHART CATEGORY HUES — chart use only, never apply to UI chrome */
/* Selection logic: 5 perceptually-spaced hues, anchored on lime, OKLCH-uniform lightness */

--d1-chart-cat-1: oklch(75% 0.16 122);   /* lime-derived, primary category */
--d1-chart-cat-2: oklch(70% 0.18 285);   /* purple-derived */
--d1-chart-cat-3: oklch(72% 0.13 78);    /* amber-derived */
--d1-chart-cat-4: oklch(70% 0.13 200);   /* teal — fills the cool gap; hue 200 not 250 (avoid AI-default blue) */
--d1-chart-cat-5: oklch(72% 0.14 340);   /* warm magenta — sits opposite teal */
```

**Brand rationale:**
- **All five at lightness 70-75% with chroma 0.13-0.18.** OKLCH uniformity means they all sit at the same perceptual weight — no category accidentally dominates the chart. Bloomberg-correct (categories are equal until data says otherwise).
- **Hue 200 (teal) not 250 (cyan-blue).** Hue 250 is the AI-design-default blue impeccable warns against; hue 200 is more «editorial teal» (NYT magazine charts, Wired infographics).
- **Hue 340 (magenta) not 0 (red).** Hue 340 sits cleanly between purple and amber on the wheel; hue 0 collides with the proposed error-red status color.
- **Five is the brand-correct ceiling.** More than 5 categories needs visual treatment beyond color (patterns, hatching — the existing hatched-bar discipline extends here). If a chart genuinely has 8+ categories, that's a chart-design problem, not a palette problem.
- **Namespaced separately (`--d1-chart-cat-*` not `--d1-cat-*`).** Prevents leakage. UI chrome must not pull from this set; tokens are chart-only.

### 2.5 Brand-craft palette addition — ink-warm-white

**One additional token** that surfaces from the typography review (impeccable-typography reference: light text on dark needs compensation on three axes).

```css
/* INK-WARM-WHITE — body text on warm-charcoal canvas (the new tonal neutrals) */
--d1-text-warm-primary: oklch(98% 0.004 75);   /* hex ≈ FAF9F5 — paper-warm white */
```

**Brand rationale:** with the canvas re-tinted toward editorial-warm (hue 75), keeping body text at pure-white `oklch(98% 0.001 270)` introduces a tiny hue mismatch — text reads as «cooler than the surface», which is the «print on cheap office paper» effect, not «print on heritage paper». A warm-white ink (4 chroma toward hue 75) closes the gap and reads as «print on ledger paper». This is a 0.003-chroma move — invisible on a calibration meter, but the *kind* of detail that distinguishes Provedo from generic dark-mode dashboards.

**Optional, not blocking.** If product-designer or front-end push back on hue-matching ink to surfaces as «too subtle to notice», hold the existing pure-white ink. The tonal neutrals re-tint (§2.2) is the load-bearing change; warm-ink is the polish.

---

## 3. Selector-by-selector brand verdict — variant B mapping

Format: **GO** = ship the variant B treatment · **CAUTION** = land it but with brand caveat · **HOLD** = explicit reason not to apply this depth move here.

| # | Selector | Variant B treatment (assumed) | Brand verdict | Brand rationale |
|---|---|---|---|---|
| 1 | `.d1-kpi` (rest, non-lime) | Cards-up emboss | **CAUTION — apply tier-varied emboss; no uniform 1px highlight on rail-bearing cards** | The card-up read serves Sage *if* the depth varies by tier (see §1.1). If product-designer's spec applies uniform emboss to all `.d1-kpi`, this becomes WARN. Top highlight must drop on cards that carry a Record Rail (see §1.3 Option B). |
| 2 | `.d1-kpi:hover` | Reduced/no hover (cards already raised) | **GO** | Correct response to PO's challenge. Passive cards don't need hover-as-readability. A subtle bg-tint shift (≤2% lightness step) is enough to confirm the cursor landed; no translate, no shadow change. |
| 3 | `.d1-kpi--lime` (the «look here» card) | Cards-up emboss + lime fill | **GO — but emboss values must be re-tuned for lime substrate** | The 4% white top highlight that works on charcoal is invisible on lime. Lime cards need a custom emboss (e.g., 3% black top inset + 8% black bottom inset to keep the emboss read on bright fill). Without re-tuning, the lime card visually flattens. |
| 4 | `.d1-kpi--portfolio` (headline KPI) | Cards-up emboss, strongest tier | **GO** | This is the headline; it should rise *most*. Tier-1 emboss = highest white-top + sharpest ink-bottom. Sage-correct (depth carries hierarchy). |
| 5 | `.d1-kpi--error` (amber-hairline variant) | Cards-up emboss + amber inset hairline | **GO** | Stale-data warning; emboss says «still on the record»; amber hairline says «attention». They compose. |
| 6 | `.d1-panel` (chart panel) | Cards-up emboss, lower tier than KPI | **GO** | Chart panels are persistent data zones, supporting role to KPIs. Emboss should be perceptibly lower than the KPI emboss to encode hierarchy. |
| 7 | `.d1-panel:hover` | No hover lift | **HOLD — flat hover** | Chart panels are not the primary action surface; the segmented control + chart elements inside take the interaction load. Don't lift the container. |
| 8 | `.d1-disclaimer-chip` | Flat (per hard constraint) | **GO — flat, zero depth, zero hover, zero motion** | Lane-A regulatory cure. Stays out of depth grammar entirely. This was the single most consequential brand decision in v2 and it survives unchanged. |
| 9 | `.d1-pill` (nav, rest) | Flat | **GO — flat** | Nav pills are tertiary chrome; depth on every pill creates noise. Lime active-fill is the depth signal. |
| 10 | `.d1-pill--active` | Flat + lime fill | **GO — flat** | Lime fill *is* the depth. Stamped, not raised. |
| 11 | `.d1-nav__icon-pill` | Flat | **GO — flat** | Same as 9. |
| 12 | `.d1-segmented` (container) | Inputs-down deboss | **GO — `--d1-depth-pressed` (the inputs-down move)** | Segmented control sits on `bg-page` (lowest layer); the deboss reinforces «recessed track for the toggle to slide in». Brand-correct write-surface read. |
| 13 | `.d1-segmented__btn--active` | Inside the pressed track, slight raise + lime hairline | **GO** | The active segment is the «pressed-and-released» state — it sits *inside* the recessed track but rises a hair above its peers. Lime hairline says «this one is selected». |
| 14 | `.d1-chip` (filter chip, rest) | Flat | **GO — flat** | Chips are tertiary, repeatable. Depth multiplies into noise. |
| 15 | `.d1-chip--active` | Flat + lime fill | **GO — flat** | Existing lime hairline is sufficient. |
| 16 | `.d1-input` / `.d1-textarea` / `.d1-select` | Inputs-down deboss (the central variant B move) | **GO — `--d1-depth-pressed` louder than card emboss** | This is the **brand-distinctive Provedo move under variant B**. Inputs are pressed *into* the page — the «invitation to type» metaphor. Critical: the deboss here should be *more pronounced* than the cards-up emboss. If they're equal-weight, the polarity reads as ambiguous. |
| 17 | `.d1-input:focus` | Pressed deeper + 2px lime focus ring | **GO** | Focus = «ink is going here». The deboss intensifies on focus (e.g., bottom-inset goes from 32% to 40% black) and the lime ring composes via layered box-shadow. AAA-friendly. |
| 18 | `.d1-search-filter` (the AI insight feed search) | Inputs-down deboss | **GO** | Same write-surface grammar. Reinforces «type here to filter». |
| 19 | `.d1-cta` (lime CTA button) | Cards-up emboss + lime fill | **GO — full press-and-release ledger gesture** | Rest = embossed-up (raised stamp). Hover = brighter emboss (the stamp catches more light). Active = pressed-down deboss (the stamp pushed into the page). This three-stage gesture is the Magician moment of the system — «the stamp of approval» physical metaphor. **High brand-craft value; specify carefully.** |
| 20 | `.d1-button` / secondary buttons | Cards-up emboss-soft + neutral fill | **GO** | Same grammar as CTA, lower contrast. |
| 21 | `.d1-insight` (single AI insight row) | Flat | **GO — flat row, embossed container** | The Record Rail entry tick is the depth signal for an insight row. A row-level emboss would compete with the rail. Container holds the rows; rows themselves are 2D. |
| 22 | The `.d1-insights-container` (wrapping card) | Cards-up emboss | **GO — apply Option B emboss (no top highlight, side-and-bottom-only) because the rail sits at top edge** | Per §1.3, this is the canonical rail-bearing card. Top highlight must yield to the rail. |
| 23 | `.d1-tooltip` | Floating multi-layer | **GO — `--d1-depth-floating`** | Tooltips genuinely float above content. The only place multi-layer is brand-correct. |
| 24 | `.d1-modal` / overlay | Floating multi-layer | **GO — `--d1-depth-floating`** | Same as 23. |
| 25 | `.d1-rail` (the Record Rail itself) | Flat, never | **GO — flat, never** | The rail is **ink on paper**. It cannot be embossed without breaking its own metaphor. The one element that explicitly opts out of every depth grammar permutation. |
| 26 | Ledger-rule hairlines between data zones | Flat, never | **GO — flat** | Same logic as the rail. 2D rule lines, not surfaces. |

**Summary tally for variant B:** 22 GO, 2 CAUTION, 2 HOLD. Read against v2 (11 GO, 3 CAUTION, 10 HOLD), the GO count goes up because the read-vs-write polarity gives more selectors a clear treatment slot. The HOLD count drops because chrome now has a positive read (flat = «not a read or write surface, just structure») rather than a negative read (flat = «we couldn't justify depth»).

---

## 4. Anti-pattern list — «if we ship X in v3, Provedo dies a little»

Variant B opens new failure modes that v2 didn't have. Top 5 hard-stops:

1. **Multi-layer atmospheric drop shadows on raised cards.** Variant B is a *license to use depth on cards*, not a license to use *Robinhood's depth on cards*. The v2 ban survives unchanged: single-layer ink-baseline, never stacked, never coloured halos. If a designer reaches for `0 4px 8px ... 0 12px 24px ... 0 24px 48px ...`, that is the visual signature of every advisor app and every casino-fintech anti-positioning rejects. Reject.

2. **Uniform card-up emboss across every `.d1-kpi`.** If every card rises the same amount, depth carries no information and degrades to decoration. Sage breaks. Hierarchy must be encoded — tier-1 (the «look here» KPI) rises most, tier-2 (supporting KPIs) less, tier-3 (chart panels) least. If product-designer's spec doesn't differentiate, brand will WARN.

3. **Card top-edge highlight competing with the Record Rail's lime tick.** Two parallel hairlines on the same edge = brand-breaking double signal. Cards that carry a rail must drop the top highlight (use side-and-bottom emboss only). Non-negotiable.

4. **Inputs-down deboss equal-weight or quieter than cards-up emboss.** The brand-distinctive variant-B move *is* the inputs-down deboss. If the cards-up emboss is louder, variant B reads as «cards rose; inputs got minor sub-treatment» — generic dark dashboard. If inputs-down is louder, variant B reads as «we have a polarity opinion» — Provedo-distinctive. Inputs must be the louder side.

5. **Disclaimer chip joining the depth grammar.** Lane-A regulatory cure must read as architectural permanence — flat, never lifted, never debossed, never animated. Any state change implies dismissibility, which is a regulatory landmine. This is the most consequential single rule in the entire spec.

**Honourable mentions (lower-risk but still wrong):**
- Coloured glow shadows (lime/purple/amber halos) on hover. Reads as crypto-dapp / gaming. Banned in v2; banned in v3.
- Glassmorphic / backdrop-filter on any surface. Provedo is not Apple media app. Banned.
- Tinting toward warm orange (hue 60) instead of warm tan (hue 75) for tonal neutrals. Triggers «cozy fireside» read instead of «editorial paper». Subtle but real.
- Adding a navy / cyan-blue chart category color (hue 250). Triggers «every fintech dashboard» trope.

---

## 5. Brand-craft additional improvements (Area 3)

PO directive: «они могут дать любые советы и улучшение». Below are non-blocking refinements I see from the brand lens. Each is independent of the depth-grammar work.

### 5.1 Typography — weight ramp adjustment (small)

Current ramp uses Geist Sans 400 for body, 500 for labels, 600 for display, 700 for chat avatar (per Fix #7 in the design lock).

Per impeccable-typography: «Light text on dark backgrounds needs compensation on three axes — line-height + letter-spacing + weight». Provedo currently compensates on two (line-height + tracking). Adding the weight axis would mean: body text on dark goes from 400 to 425-450 (variable-font fractional weight, tabular numerals preserved).

**Recommendation:** experimental-only. Render `display.body` at 400 vs 425 in QA on the warm-charcoal canvas; if 425 reads cleaner without losing the «Linear lightness» character, move. If 425 reads as «old-SaaS heavy», hold at 400. **Not blocking.**

### 5.2 Voice fingerprint — depth-pivot copy patterns

The depth-grammar pivot opens new voice opportunities. With cards-up = «document on desk» and inputs-down = «form on blotter», the system's UI text can lean into the desk metaphor:

- Form fields: placeholder copy as «type a holding...» reads as ink-going-here. Avoid «Search...» (generic SaaS).
- Empty states for KPI cards: «Provedo will note this here» — the card is a place a note will land.
- Tooltips on debossed inputs: «press enter to file» — playing the form-on-blotter metaphor.

**Recommendation:** content-lead's scope, not brand-strategist's authoritative call. Surface as a pattern hint to content-lead in the next handoff.

### 5.3 Iconography — Lucide weight match

Lucide icons (locked) are 1.5px stroke weight at 24×24 viewBox. On the warm-charcoal canvas with Geist body at weight 400, this reads as fractionally-too-thin (icons look daintier than the type). Per impeccable-typography compensation logic, dark-mode wants slightly heavier glyphs to read as equal-weight to light text.

**Recommendation:** experimental — render Lucide at 1.75px stroke weight via the `strokeWidth` prop and compare side-by-side to current 1.5px on the warm-charcoal canvas. If 1.75 reads as «balanced with the type», migrate. Lucide supports custom strokeWidth at runtime, no new icon set needed. **Not blocking.**

### 5.4 Logo / wordmark on cards-up surfaces

The Provedo wordmark (when it lands on raised cards rather than recessed cards) gains a subtle «debossed-into-the-card» opportunity that v2 didn't have. A card-up surface with a wordmark *embossed into the card itself* (via inverse text-shadow grammar, not text-color change) reads as «the brand is part of the document, not stuck on top of it». This is Provedo-distinctive in a way most dark-mode SaaS dashboards don't attempt.

**Recommendation:** explore in a single high-prestige surface (e.g., the disclaimer chip's «P» monogram, or the AI avatar's «P»). Not a system-wide pattern; one tasteful application. Surface to product-designer for v3.1 polish; not v3 blocking.

---

## 6. Top risks if PO ships product-designer's spec without these conditions

Mirroring the prior 6-specialist verdict format. Six risks ranked by severity:

| # | Risk | Severity | Brand-failure mode |
|---|---|---|---|
| 1 | Uniform card-up emboss applied to every `.d1-kpi` regardless of tier | **CRITICAL** | Sage archetype breaks. Depth as decoration, not as information. The v2 «every dark dashboard» drift recurs by a different vector. Provedo reads as «modern fintech dashboard 2026», not as «editorial-charcoal ledger». |
| 2 | Card top-edge highlight applied uniformly, competing with Record Rail | **CRITICAL** | Primary signature element fails. Rail loses its loudest-hairline status. The single Provedo-distinctive visual element (Fix #2 of the original 7-fix-pass) is silently undermined. Originality risk un-mitigates. |
| 3 | Tonal neutrals stay at hue 270 (cool blue-purple cast) | **HIGH** | Single most impactful low-risk brand move skipped. Provedo reads as «another cool-cast SaaS dashboard» when a 0.005-chroma hue shift would have read as «editorial paper». Cheap to fix; expensive to leave. |
| 4 | Inputs-down deboss equal-weight to cards-up emboss | **HIGH** | The variant-B polarity becomes ambiguous. The brand-distinctive «invitation to type» move loses its pop. Variant B reads as «cards rose» rather than «we have a polarity opinion». |
| 5 | Status colors added at full saturation (loud red error, bright green success) | **MEDIUM-HIGH** | Lane-A archetype tension. Loud red-error reads as advisor-app urgency, contradicting «we don't tell you what to do». ICP A reads it as «another panicky fintech»; ICP B reads it as «default Bootstrap palette». |
| 6 | Chart multi-category palette pulled from arbitrary AI-default blue/red/green | **MEDIUM** | Chart visual fragmentation. Brand identity dilutes specifically in the area where Provedo competes most directly with Bloomberg (chart credibility). Recoverable but visible. |

**Aggregate verdict:** if all 6 risks land unmitigated, variant B becomes a worse outcome than v2 was. If risks 1-4 are mitigated and 5-6 are deferred to v3.1, variant B becomes a stronger outcome than v2 was. The mitigation cost is low; the upside is real.

---

## 7. Confidence on each headline recommendation

| Recommendation | Confidence | Why |
|---|---|---|
| Variant B is brand-defensible (SUPPORT-with-conditions) | **HIGH** | Read-vs-write polarity is more honest to the editorial-ledger metaphor than v2's «deboss-at-rest». PO's category-error diagnosis was correct. |
| Tier-varied card emboss is mandatory (not uniform) | **HIGH** | Sage archetype demands it. Without tier variation, depth becomes decoration. |
| Card top highlight must yield to Record Rail on rail-bearing cards | **HIGH** | Rail is primary signature. Two parallel hairlines on the same edge is double-signal failure. |
| Inputs-down deboss must be louder than cards-up emboss | **MEDIUM-HIGH** | Brand-distinctive logic suggests this; product-designer may push back on visual weight. Negotiable but defendable. |
| Tonal neutrals re-tint hue 270 → 75, chroma 0.003-0.006 → 0.008-0.014 | **HIGH** | Strongest single recommendation in this document. impeccable-grounded; cheap; high-impact. |
| Status color additions (success-green at 152°, error-clay at 28°) | **HIGH** | Brand-protective hue choices. Lane-A-correct calm tone. |
| No purple split (hold at 2 existing tokens) | **HIGH** | Adding more purple dilutes the «something is happening» semantic. |
| Chart 5-hue category palette in `--d1-chart-cat-*` namespace | **MEDIUM-HIGH** | The hue choices (200 over 250; 340 over 0) are brand-protective but defendable; product-designer or finance-advisor may push back on whether 5 categories is the right ceiling. |
| Disclaimer chip stays flat (no depth, no motion, no hover) | **HIGH** | Lane-A regulatory cure. Non-negotiable. Survives every iteration. |

---

## Appendix — One-line distillation for Right-Hand synthesis

**Variant B's read-vs-write polarity is brand-correct *if* card emboss varies by tier, top highlight yields to the Record Rail, inputs-down is the louder side of the polarity, and the canvas re-tints from cool blue-purple (hue 270) to editorial-warm (hue 75) — and the disclaimer chip stays out of the depth grammar entirely.**
