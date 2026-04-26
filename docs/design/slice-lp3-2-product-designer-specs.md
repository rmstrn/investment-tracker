# Slice-LP3.2 — Product-Designer Visual Specs

**Author:** product-designer
**Date:** 2026-04-27
**Status:** draft → awaiting frontend-engineer impl
**Branch:** `feat/lp-provedo-first-pass` (PR #65 stack)
**Source kickoff:** `docs/kickoffs/2026-04-27-slice-lp3-2-universal-improvements.md`
**Source dispatch:** `docs/kickoffs/slice-lp3-2-dispatches/02-product-designer.md`

## Token references (from Design Brief v1.4 — Direction A)

All values below reference the existing CSS-variable token system. **No new tokens introduced.**

| Token | Value | Use |
|---|---|---|
| `--provedo-bg-page` | `#FAFAF7` | warm-neutral page bg |
| `--provedo-bg-elevated` | `#FFFFFF` | cards, popovers |
| `--provedo-bg-muted` | `#F5F5F1` | proof-bar bg, secondary surfaces |
| `--provedo-bg-subtle` | `#F1F1ED` | hover, tonal sep |
| `--provedo-text-primary` | `#0F172A` (slate-900) | hero text, big numbers |
| `--provedo-text-secondary` | slate-600 | sub-lines, body |
| `--provedo-text-tertiary` | slate-500 | small-print, footnotes |
| `--provedo-text-muted` | slate-400/500 | quietest copy |
| `--provedo-accent` | `#0D9488` (teal-600) | CTAs, accents |
| `--provedo-accent-active` | teal-700 | hover/active |
| `--provedo-border-subtle` | slate-200 | dividers |
| `--provedo-font-sans` | Inter | body + headings |
| `--provedo-font-mono` | JetBrains Mono | numbers + technical |

**Anti-pattern guard (§0 Design Brief).** No purple/pink/violet, no AI sparkles, no neural imagery, no brain icons, no gradient meshes, no Liquid Glass on AI cards, no dashboard-jazz, no cream-paper register. Every spec below complies.

---

## V1 — Proof bar cell rebalance

### Decision: **4 cells** (not 3)

**Rationale.**
- Replace-option (drop broker-count cell, swap in time-anchor) was considered. Rejected because the broker-count cell is the single most important first-impression proof point on the page — it's the «what does this thing actually do» answer for a cold visitor, and it pre-empts the audience-whisper («for investors who hold across more than one broker»). Removing it weakens the immediate value-prop legibility.
- Add-option (4 cells) preserves all existing proof and adds the time-anchor as a parallel data-point. Visual rhythm at desktop holds (4 cells × ~25% width per cell = 192-256px text columns with comfortable padding).
- The proof bar is information-dense by design (R2 audit confirms top fintech landing patterns use 3-5 stat strips). 4 cells lands within that established pattern.

### Cell content (final, applies finance-advisor «messages»→«questions» patch + drops «Lane A —» prefix + adds time-anchor)

| # | Big number/token | Eyebrow (UPPERCASE) | Sub-line | Color of big number |
|---|---|---|---|---|
| 1 | `100s` (coverage prop unchanged) | `brokers and exchanges` | `every major one` | `--provedo-text-primary` |
| 2 | `Every` | `observation cited` | `with sources inline` | `--provedo-text-primary` |
| 3 | `5 min` | `a week` | `the whole habit` | `--provedo-text-primary` |
| 4 | `100%` (count-up) | `information not advice` | `no robo-advisor, no brokerage` | `--provedo-accent` |

**Microcopy decisions.**
- **Cell #2 «messages» patch** — the proof bar does NOT currently carry the word «messages» (it carries «observation cited»). The «50 free questions a month» microcopy lives in the hero/repeat-CTA small-print only. **No proof-bar copy change needed for the «messages → questions» patch** — flag for frontend-engineer that this patch lands in `ProvedoHeroV2.tsx:477` and `ProvedoRepeatCTAV2.tsx:70` and `ProvedoFAQ.tsx:29/39`, NOT the proof bar.
- **Cell #3 token «5 min»** — uses JBM-mono at the same size-clamp as the other big-number tokens. The numeral «5» is bare (no decoration), consistent with «100s» and «100%». Avoids spelling out «Five» (drops the Stripe-cadence-fragment risk flagged by brand-voice-curator §1).
- **Cell #3 sub-line «the whole habit»** — substantive Sage register (an observation about user behavior, not a feature claim). Avoids «that's it» / «that's the whole product» which read flippant. content-lead may push an alternative; flag for review (see §V1 open questions).
- **Cell #4 prefix drop** — eyebrow goes from `Lane A — information not advice` (28 chars) → `information not advice` (22 chars). Tighter, still uppercase tracking 0.08em, still sets up the «no robo-advisor, no brokerage» sub-line.

### Per-breakpoint behavior

| Breakpoint | Layout | Per-cell width | Big-number font-size clamp |
|---|---|---|---|
| 320–767px (mobile) | **vertical stack**, cells full-width, 1px horizontal divider between cells, 32px vertical padding per cell | 100% | `clamp(2.25rem, 1.6rem + 1.6vw, 2.75rem)` (slightly tighter than current to avoid awkward wrap on «5 min») |
| 768–1023px (tablet) | **2×2 grid**, vertical + horizontal dividers, 24px padding | ~50% | `clamp(2.5rem, 1.8rem + 1.5vw, 3rem)` |
| 1024–1439px (laptop) | **4 columns horizontal**, vertical dividers only, 24px padding | 25% | `clamp(2.5rem, 1.6rem + 1.4vw, 3.25rem)` |
| 1440px+ (desktop/wide) | **4 columns horizontal**, vertical dividers, 32px padding | 25% | `clamp(2.5rem, 1.5rem + 1.2vw, 3.5rem)` (matches current cap) |

**Outer container.**
- `max-w-4xl` → bump to **`max-w-5xl`** (1024px) to give 4-cell layout adequate breathing room. Current `max-w-4xl` (896px) becomes too tight at 1024px viewport (224px per cell with dividers — text wraps awkwardly).
- Section vertical padding `py-12 md:py-16` retained.
- Section bg `--provedo-bg-muted` retained. Top + bottom 1px borders retained (`--provedo-border-subtle`).

### Per-cell typography spec (unchanged from current — applies to all 4 cells unless noted)

```
Big number / token:
  font-family: var(--provedo-font-mono)  /* JBM */
  font-weight: 500
  font-size: clamp per breakpoint table above
  letter-spacing: -0.02em
  line-height: 1
  margin-bottom: 8px

Eyebrow (UPPERCASE):
  font-family: var(--provedo-font-sans)  /* Inter */
  font-weight: 500
  font-size: 13px
  text-transform: uppercase
  letter-spacing: 0.08em
  color: var(--provedo-text-secondary)
  margin-bottom: 4px

Sub-line:
  font-family: var(--provedo-font-sans)
  font-weight: 400
  font-size: 13px
  color: var(--provedo-text-muted)
```

### Cell-3 motion spec

- **Reduced-motion:** `5 min` renders static at full opacity on mount.
- **Default motion:** match cell #2's existing `opacity 400ms ease 200ms` fade-in on `inView`. Do NOT add count-up animation to «5» (count-up belongs to numerical-trend tokens like `100%`; «5 min» is a fixed time-anchor, count-up reads as gimmicky here).
- Cell #4's existing `100%` count-up retained unchanged.

### A11y

- Semantic `<dl><dt><dd>` pattern preserved (each cell = one description-list group).
- Section `aria-label="Proof points"` retained.
- Contrast verified for warm-bg-muted `#F5F5F1`:
  - `--provedo-text-primary` `#0F172A` on `#F5F5F1` = 16.4:1 (AAA)
  - `--provedo-text-secondary` slate-600 `#475569` on `#F5F5F1` = 8.6:1 (AAA)
  - `--provedo-text-muted` slate-500 `#64748b` on `#F5F5F1` = 4.7:1 (AA)
  - `--provedo-accent` `#0D9488` on `#F5F5F1` = 4.6:1 (AA — passes for non-text large display tokens at clamp 2.5–3.5rem)

### Open questions for content-lead

- **OQ-V1.1:** Cell #3 sub-line — is «the whole habit» the locked phrasing, or does content-lead prefer alternative? Candidates considered: «the whole habit» (chosen), «that's the whole habit», «across all your brokers» (R-redundant with cell #1), «every dividend, every drift» (too long). content-lead final call.
- **OQ-V1.2:** Cell #3 token format — `5 min` vs `5min` vs `5 minutes`. Designer preference: `5 min` (matches Stripe/Linear time-token convention, JBM renders it crisp, leaves space for `a week` eyebrow). Confirm.

---

## V2 — Audience-whisper visual placement

### Decision: **Proof-bar small-print** (italic micro-line below the 4-cell strip), not under-hero.

**Rationale.**
- **Hero is locked.** Adding a 51-char line under the hero sub introduces a 4th typographic register (heading + sub + whisper + dual-CTA stack) into a deliberately 3-register composition. Even at small font-size, it dilutes the «sub-line is the second voice» hierarchy. Brand-voice-curator §1 explicitly protected the hero from time-anchor injection for this exact reason; the audience-whisper carries the same dilution risk.
- **Proof bar is the natural data-frame.** The 4 cells already say «we cover 100s of brokers / cite every observation / take 5 min/week / are info-not-advice». The audience-whisper «for investors who hold across more than one broker» is an audience-frame for that proof. Putting it as a single italic micro-line below the cells reads as «here's who this proof is FOR» — the reading-order matches the cognitive flow.
- **Above-fold landing is preserved.** Proof bar lives at S2 (one scroll below hero on desktop, ~80% of mobile users see it without scrolling per typical hero+proof pattern). The whisper lands early enough to qualify the audience before content-heavy demo tabs.
- **Risk acknowledged: easier to miss vs under-hero.** Mitigated by typographic emphasis (italic + slightly tighter font + centered + max-width constrained = visual «footnote-with-weight» pattern, not generic disclaimer).

### Spec

```
Position:
  - Sits OUTSIDE the <dl> cell grid, inside the same <section>
  - Below the cell row, before the section's bottom 1px border
  - margin-top: 32px (24px on mobile)
  - Centered horizontally

Typography:
  font-family: var(--provedo-font-sans)  /* Inter */
  font-style: italic
  font-weight: 400
  font-size: 14px (13px mobile)
  line-height: 1.55
  letter-spacing: 0
  color: var(--provedo-text-tertiary)  /* slate-500 — 4.7:1 on bg-muted */

Layout:
  max-width: 480px (≈40-45 char-width — keeps the 51-char line single-row at all breakpoints from 480px up; wraps gracefully at 320-479px)
  text-align: center
  padding-inline: 16px (mobile breathing)
```

**Final copy (locked from content-lead):** `For investors who hold across more than one broker.` (51 chars)

### Per-breakpoint behavior

| Breakpoint | Behavior |
|---|---|
| 320–479px | Wraps to 2 lines, italic preserved, font 13px |
| 480px+ | Single line, italic, font 14px |

### A11y

- Wrap in a single `<p>` element, no separate aria-label needed (text is self-descriptive).
- Italic alone is not a semantic signal — meaning is conveyed by text content, so screen-reader-friendly.
- Reading order: proof-bar cells first (data), whisper second (audience-frame). Matches visual order. PASS.

### Decision rejected (under-hero) — kept for record

Considered: place under hero sub-line, font 13px italic centered, margin-top 16px above CTA stack. Rejected because:
1. Adds 4th register to locked 3-register hero stack.
2. Pushes CTA 32px further down on mobile, hurts above-fold CTA visibility.
3. Audience-frame BEFORE proof reads as «who-disclaimer-first» — proof-bar-first reading order is stronger.

---

## V3 — Footer 3-layer disclaimer

### Layer 1 — Plain-language summary (visible)

**Locked copy (legal-advisor + brand-voice-curator + PO):**
> «Provedo provides general information about your portfolio. It is not personalized investment advice — every decision stays yours.»
>
> 23 words.

**Position.** Replaces the current 75-word block at lines 67-77 of `MarketingFooter.tsx`. Same `mt-6` offset from footer nav row above.

**Typography.**
```
font-family: var(--provedo-font-sans)
font-weight: 400
font-size: 13px (was 12px in current — bump 1px because Layer 1 is now the primary visible disclaim, deserves more presence)
line-height: 1.6 (was 1.5 — more breathing for the 2-clause sentence)
color: var(--provedo-text-secondary)  /* slate-600 — was tertiary; bump for the same reason */
max-width: 640px (was 2xl ≈ 672px — tightens to keep 23 words on 2 readable lines at desktop)
```

**Why bump weight/size of Layer 1 vs current.** The 75-word block was a deliberately quiet legal-block — primary mode was «present but not insistent». Layer 1 is the OPPOSITE — it's the user-facing summary that NEEDS to be read for the disclaimer to function as a substitute for the (now-collapsed) full text. Brightness must scale to its functional load. The bump is small (1px font, slate-600 not slate-500) — still calm, but legible.

### Layer 2 — Expandable `<details>` block

**Position.** Directly below Layer 1, `margin-top: 16px`. Contained within the same outer footer column.

**Summary text (legal-advisor §2 locked):**
> `Full regulatory disclosures (US, EU, UK)`

**Verbatim Layer 2 content** (the existing 75-word block, NOT modified — regulator-readable text from commit `8cb509b`):
> «Provedo is not a registered investment advisor and is not a broker-dealer. Provedo provides generic information for educational purposes only and does not provide personalized investment recommendations or advice as defined under the U.S. Investment Advisers Act of 1940, EU MiFID II, or UK FSMA 2000. Past performance is not indicative of future results. All investment decisions are your own. Consult a licensed financial advisor in your jurisdiction before making investment decisions.»

### `<details>` / `<summary>` styling

**Pattern reference:** `ProvedoFAQ.tsx` lines 60-118 — match that chevron + transition pattern exactly so the disclosure interaction is visually consistent across the page.

```
<details> outer:
  border: none
  padding: 0
  /* No accordion top/bottom border — Layer 2 is a single inline disclosure, not a list of items */

<summary>:
  display: flex
  align-items: center
  gap: 8px
  cursor: pointer
  list-style: none  /* hides default ▶ marker */
  padding: 8px 0  /* generous click target — 32px total height with line-height */
  font-family: var(--provedo-font-sans)
  font-weight: 500
  font-size: 13px
  color: var(--provedo-text-secondary)  /* slate-600 — links-but-not-shouting */
  transition: color 150ms ease

  /* Match FAQ pattern */
  ::-webkit-details-marker { display: none }

  &:hover { color: var(--provedo-accent) }

Chevron icon (right of summary text, 16px sq):
  width: 16px
  height: 16px
  flex-shrink: 0
  color: var(--provedo-text-tertiary)
  transition: transform 150ms ease
  /* same SVG path as ProvedoFAQ.tsx line 102 */

  details[open] & { transform: rotate(180deg) }

Focus-visible:
  outline: 2px solid var(--provedo-accent)
  outline-offset: 2px
  border-radius: 4px

Expanded content (the 75-word block):
  margin-top: 12px
  font-family: var(--provedo-font-sans)
  font-weight: 400
  font-size: 12px  /* same as current — this IS the legal text, intentionally quiet */
  line-height: 1.55
  color: var(--provedo-text-tertiary)
  max-width: 640px
```

### Layer 3 — `/disclosures` page link (inside expanded Layer 2)

**Position.** End of the 75-word verbatim block, on a new line. `margin-top: 12px` from end of legal text.

**Copy:** `Read full extended disclosures →`

**Affordance.** Match existing footer-nav-link style for visual consistency:
```
font-family: var(--provedo-font-sans)
font-weight: 500
font-size: 12px
color: var(--provedo-accent)  /* teal-600, links read as teal in this footer context */
text-decoration: none
display: inline-flex
align-items: center
gap: 4px

&:hover {
  text-decoration: underline
  text-underline-offset: 2px
}
```

The `→` arrow is a literal Unicode RIGHT-ARROW glyph (U+2192), not an icon — keeps the link inline-flow without alignment concerns.

### A11y

- `<details>` / `<summary>` is native HTML — keyboard-navigable (Tab focuses, Enter/Space toggles), screen-reader announces «expand button collapsed/expanded» automatically. **No additional `aria-*` needed.**
- The verbatim 75-word text is preserved unchanged inside Layer 2. Screen readers will announce the full text when expanded. `aria-describedby` NOT required (Layer 1 is the canonical visible summary; Layer 2 is supplementary detail).
- Layer 3 link inherits standard anchor semantics — labels itself.
- Focus order: footer nav links → © line → Layer 1 (`<p>`, not focusable) → Layer 2 `<summary>` (focusable, expand trigger) → Layer 3 link (only when Layer 2 expanded).
- Reduced-motion: chevron rotation `transform: none` honored via existing `--provedo-` motion vars (already wired in FAQ pattern).

### Visual hierarchy summary (footer bottom-section, post-Layer-2 collapsed)

```
[Footer nav row — © 2026 Provedo · Pricing · Sign in]
                                                       ← mt-6 (24px)
[Layer 1 — 23-word plain-language summary, slate-600, 13px, lh 1.6, max-w 640px]
                                                       ← mt-4 (16px)
[Layer 2 — "Full regulatory disclosures (US, EU, UK)" + chevron, slate-600, 13px]
   [collapsed by default; expands inline below summary on click/Enter/Space]
```

### Open question for frontend-engineer

- **OQ-V3.1:** `/disclosures` route copy comes from content-lead (Layer 3 sub-page draft). Designer scope ends at the link affordance; frontend-engineer creates the route, content-lead writes the body. Confirm this division of labor with tech-lead.

---

## V4 — Removed-secondary-CTA visual rebalance

### Dead-code verification (verified by product-designer 2026-04-27)

`page.tsx` imports confirmed:
- `ProvedoHeroV2` (mounted line 46) ✅
- `ProvedoRepeatCTAV2` (mounted line 78) ✅
- **`ProvedoHero.tsx` — NOT imported. Dead code.** Recommend deletion.
- **`ProvedoRepeatCTA.tsx` — NOT imported. Dead code.** Recommend deletion.

**Recommendation:** frontend-engineer deletes both V1 legacy files in this slice (clean-up the diff). No visual impact since they're not mounted.

### V4-A — Hero CTA cluster (`ProvedoHeroV2.tsx` lines 461-478)

**Current state.**
```
<div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
  <ProvedoButton href="#demo" variant="primary" size="lg">Ask Provedo</ProvedoButton>
  <ProvedoNavLink href="/sign-up" ...>Or start free forever</ProvedoNavLink>  ← REMOVE
</div>
<p className="mt-3 text-xs">No card. 50 chat messages a month, free always.</p>  ← microcopy patch
```

**After-removal spec.**

```
<div className="mt-10 flex flex-col items-center lg:items-start">
  <ProvedoButton href="#demo" variant="primary" size="lg">Ask Provedo</ProvedoButton>
</div>
<p className="mt-4 text-xs ...">No card. 50 free questions a month.</p>
```

**Changes from current:**
1. **Drop `gap-4 sm:flex-row`** — single child, no gap needed; no row-direction needed.
2. **Bump small-print `mt-3` → `mt-4`** — adds 4px breathing because the small-print is now the only secondary element under the primary CTA. Without the bump, the small-print sits 12px below the button (felt from the original 4px gap + 12px button-bottom-padding); with the bump, a clean 16px breathing room reads intentional.
3. **Microcopy:** `No card. 50 chat messages a month, free always.` → `No card. 50 free questions a month.` (kickoff §F microcopy directive). 36 chars vs 51 — tighter, no «free always» reassurance copy (PO microcopy principle 2026-04-27 addendum).
4. **Alignment retained** (`items-center` mobile, `lg:items-start` desktop). Same hero-stack alignment as headline + sub.

**Visual rebalance — does the lonely primary CTA feel right?** Yes, with the small-print bump. Single primary CTA is the dominant pattern in modern B2C SaaS landing (Vercel, Linear, Stripe). The 16px small-print breathing turns the `[BUTTON] / [16px gap] / [small-print]` stack into a clean 2-element pyramid. **No additional decoration needed** — no «no card required» badge, no checkmark icons (would re-introduce reassurance-copy register PO directive prohibits).

### V4-B — Repeat CTA section (`ProvedoRepeatCTAV2.tsx` lines 56-79)

**Current state.**
```
<h2>Open Provedo when you're ready.</h2>
<div>{primary "Ask Provedo" button}</div>
<div className="mt-4">
  <ProvedoNavLink href="/sign-up" ...>Or start free forever</ProvedoNavLink>  ← REMOVE
</div>
<p className="mt-4 text-xs">
  No card. 50 free messages a month, free always.{' '}  ← microcopy patch
  <ProvedoNavLink href="/pricing" ...>Or see Plus pricing →</ProvedoNavLink>  ← KEEP
</p>
```

**After-removal spec.**

```
<h2>Open Provedo when you're ready.</h2>
<div>{primary "Ask Provedo" button}</div>
<p className="mt-6 text-xs">
  No card. 50 free questions a month.{' '}
  <ProvedoNavLink href="/pricing" ...>Or see Plus pricing →</ProvedoNavLink>
</p>
```

**Changes from current:**
1. **Delete the `mt-4` wrapper div containing the secondary NavLink.**
2. **Bump small-print `mt-4` → `mt-6`** — the small-print previously sat 16px below the «Or start free forever» link; with that link removed, the small-print would sit 16px below the button which feels too tight given the dark `slate-900` bg amplifies button visual weight. 24px (`mt-6`) restores the «button has its own breathing» feel.
3. **Microcopy:** `No card. 50 free messages a month, free always.` → `No card. 50 free questions a month.` (kickoff §F directive).
4. **Keep:** `Or see Plus pricing →` link inside the small-print. This is a different link (pricing page, not signup) and PO directive only kills the «free forever» reassurance copy, not the pricing-page-link affordance.

**Visual rebalance verification on slate-900 dark bg.**
- Primary CTA «Ask Provedo» is the visual anchor — teal-500 button on slate-900 = high-contrast focal point.
- Small-print «No card. 50 free questions a month. Or see Plus pricing →» reads as supplementary info-link (slate-400 base, teal-400 hover on the pricing link).
- Without the «Or start free forever» line, the visual stack becomes:
  ```
  [HEADLINE — Open Provedo when you're ready.]
              ↓ 32px
  [BUTTON — Ask Provedo]
              ↓ 24px
  [SMALL-PRINT — No card. 50 free questions a month. Or see Plus pricing →]
  ```
- Composition feels balanced — headline as visual heaviest, button as action-anchor, small-print as quiet info-band. **No additional spacing or decoration changes needed.**

### Centering / alignment notes

- ProvedoRepeatCTAV2 is `text-center` outer (line 17), all children centered. Retain.
- ProvedoHeroV2 is `text-center lg:text-left` (line 445), CTA cluster is `items-center lg:items-start`. After removal, hero CTA cluster simplifies to single-element flex (no `flex-col` actually needed since there's no stack — but keep the wrapper div for layout consistency with future re-additions and for the existing lg:items-start alignment).

### A11y

- Removed elements: 2 `<a>` text-links. Reading order cleaned (one fewer focus-stop in hero, one fewer in repeat-CTA). PASS.
- No new aria-* needed.
- Tab order at hero: skip link → primary nav → hero `<a href="#demo">` (Ask Provedo button) → next section. Cleaner than current (which had Ask Provedo → Or start free forever → next).

---

## V5 — Single-quote S7 testimonial layout

### Decision: Single centered figure, max-width 640px, kept Sage-restraint typography (not editorial-magazine pull-quote register)

**Rationale.**
- Brand-voice-curator §1 archetype lock: Sage observation register, not Hero capability-claim register. A pull-quote with display-size typography and dramatic punctuation register reads Hero-bombastic; a centered figure with restrained sans-typography reads Sage-confident.
- The quote IS getting weight bump (was 16px in 3-card grid → 18px solo) but the bump is calibrated, not theatrical. Reference: Linear's testimonial sections — single quote, generous whitespace, restrained typography.
- The 3-card → 1-card collapse already conveys «we picked the strongest signal» — no need for additional visual amplification.

### Selected quote (per kickoff §E)

```
"I asked Provedo why my portfolio was down. It told me which two
positions did 62% of the work, with sources. Two minutes, no
spreadsheet."
                                              — Roman M., builder at Provedo · chat surface
```

(Locked from `ProvedoTestimonialCards.tsx` BUILDER_CARDS[0] — same text retained.)

### Layout spec

```
Outer <section>:
  bg: var(--provedo-bg-page)
  padding-x: 16px
  padding-y: clamp(4rem, 3rem + 4vw, 6rem)  /* 64-96px — slightly tighter than current 64-96 */
  max-width container: max-w-3xl (768px)  /* was max-w-5xl for 3-card grid */

Section header (preserved, with content-lead-locked copy):
  Eyebrow «Coming Q2 2026»:
    background: var(--provedo-accent-subtle)
    color: var(--provedo-accent)
    font: JBM 11px medium uppercase tracking 0.08em
    padding: 4px 12px, border-radius: 100px (pill)
    /* unchanged from current */

  Section h2 (e.g. «What testers will be noticing.» — content-lead may revise to D3):
    font: Inter 24px (mobile) / 30px (desktop), semibold, tracking-tight
    color: var(--provedo-text-primary)
    text-align: center
    margin-top: 16px (from eyebrow)

  Section sub-line (e.g. «Provedo enters closed alpha Q2 2026...» — currently 2 sentences, content-lead may consolidate):
    font: Inter 14px, line-height 1.6
    color: var(--provedo-text-tertiary)
    max-width: 480px (centered)
    margin-top: 12px (from h2)

Single quote figure:
  Outer container:
    max-width: 640px
    margin-x: auto
    margin-top: 56px (from header block)

  <figure>:
    background: var(--provedo-bg-elevated)  /* white card on warm-bg */
    border: 1px solid var(--provedo-border-subtle)
    border-radius: 16px  /* bumped from 12px — solo card earns slightly more rounded */
    padding: 48px  /* bumped from 32px — solo card needs substance */
    box-shadow: 0 1px 2px rgba(15,23,42,0.06)  /* same as current */

  Decorative quote-mark «:
    font: JBM 40px (bumped from 32px solo earns presence)
    color: var(--provedo-accent)
    opacity: 0.4
    line-height: 1
    margin-bottom: 16px (was 8px)
    aria-hidden: true

  <blockquote>:
    font-family: var(--provedo-font-sans)
    font-weight: 400
    font-size: 18px  /* bumped from 16px (one step up for solo treatment) */
    line-height: 1.6  /* slightly more open than 3-card 1.55 */
    color: var(--provedo-text-primary)  /* bumped from text-secondary — solo quote is primary content, not supporting */
    margin-bottom: 32px  /* extra breathing before divider */
    quotes: none  /* preserve existing — no auto-quotes; the styled « handles it */

  <hr> divider:
    border: none
    border-top: 1px solid var(--provedo-border-subtle)
    margin-bottom: 20px

  <figcaption>:
    /* same content as current — name + tier badge + builder/surface line */
    /* no font-size change — caption stays 14px name + 13px sub */
```

### «Alpha quotes coming Q2 2026» honest-line placement

**Decision: under the section header sub-line, NOT under the quote.**

**Rationale.**
- Header-position sets framing BEFORE the user reads the quote — establishes «we're being honest about pre-alpha state» upfront. This pre-empts the «is this a real customer?» skepticism that lands harder if the disclosure comes after the quote.
- Putting the disclosure after the quote reads slightly defensive («great quote BUT…»). Putting it before reads transparent («here's the framing, here's the strongest signal we have»).
- Existing `ProvedoTestimonialCards.tsx` puts a similar disclosure at the bottom (lines 197-202). For the solo treatment, MOVE it to header.

**Spec for disclosure line.**
- **Copy:** `Alpha quotes coming Q2 2026.` (kickoff-locked, 28 chars)
- **Position:** Inside the section header block, replacing the current 2-sentence sub-line OR appended to it (content-lead final call — see OQ-V5.1).
- **Typography:**
  ```
  font: Inter 14px italic
  color: var(--provedo-text-tertiary)
  text-align: center
  margin-top: 8px (if appended to existing sub) or replaces current sub fully
  ```

### Per-breakpoint behavior

| Breakpoint | Card max-width | Card padding | Quote font-size |
|---|---|---|---|
| 320–767px | calc(100% - 32px) | 32px | 17px |
| 768–1023px | 640px | 40px | 18px |
| 1024px+ | 640px | 48px | 18px |

### A11y

- `<figure>` + `<blockquote>` + `<figcaption>` pattern preserved (semantic). Screen reader announces «figure» + reads quote + reads caption. PASS.
- Decorative `«` is `aria-hidden="true"` (already in current — preserved). Screen readers don't read the visual mark.
- Color contrast on `--provedo-bg-elevated` `#FFFFFF`:
  - quote `--provedo-text-primary` `#0F172A` = 16.7:1 (AAA)
  - caption-name `--provedo-text-primary` = 16.7:1 (AAA)
  - caption-sub `--provedo-text-muted` slate-500 = 4.6:1 (AA)
- Reduced-motion: existing `ScrollFadeIn` wrapper honored.

### Open questions for content-lead

- **OQ-V5.1:** Section sub-line — does «Alpha quotes coming Q2 2026.» REPLACE the current 2-sentence sub-line («Provedo enters closed alpha Q2 2026. Below: quotes from the team building the product.») or SUPPLEMENT it? Designer recommendation: REPLACE. Current sub is verbose and somewhat defensive («Below: quotes from the team building the product»). Single short italic disclosure does the same job tighter.
- **OQ-V5.2:** Section h2 — kickoff says «What testers will be noticing.» (current). Dispatch hints content-lead D3 may revise. Content-lead final call.
- **OQ-V5.3:** Tier badge on solo quote — keep `Plus user` badge or drop? Designer recommendation: KEEP. The badge is functional info (which tier the surface comes from) and reads as data-point not decoration.

---

## Cross-cutting decisions summary

1. **4-cell proof bar (not 3-cell replacement).** Keep broker-count, add time-anchor.
2. **Audience-whisper as proof-bar small-print** (not under-hero). Italic, 14px, slate-500 tertiary, max-w 480px, centered, mt-32px below cells.
3. **Layer 1 disclaimer slightly more prominent than current 75-word block** (13px not 12px, slate-600 not tertiary, max-w 640px not 2xl). Reflects its new functional load as primary visible disclaim.
4. **Layer 2 `<details>` styled to match `ProvedoFAQ.tsx` chevron pattern** — visual consistency with existing site disclosure interactions.
5. **V1 legacy files (`ProvedoHero.tsx`, `ProvedoRepeatCTA.tsx`) confirmed dead** — recommend deletion in this slice.
6. **Lonely primary CTA in hero needs `mt-3 → mt-4` small-print bump** (4px) for breathing.
7. **Lonely primary CTA in repeat-CTA needs `mt-4 → mt-6` small-print bump** (8px) for breathing on dark bg.
8. **Solo testimonial quote bumps 16px → 18px font-size, padding 32px → 48px, border-radius 12px → 16px, color text-secondary → text-primary.** Calibrated bumps, not theatrical.
9. **«Alpha quotes coming Q2 2026.» disclosure moves from bottom to header** in S7 — pre-empts skepticism by framing first.

## What this spec does NOT touch

- Hero head + sub typography (LOCKED).
- Hero CTA primary button styling.
- v3.1 finance/legal patches at `8cb509b` (Tab 3, Tab 4, FAQ Q4, footer 75-word block content).
- Token system in `packages/design-tokens/`.
- Motion system (no new animation rules).
- Color palette (no new colors).
- Typography stack (Inter + JBM only).
- A/B/C strategic-posture changes (deferred to Phase 2.5).
- /pricing page visual layout.
- /disclosures page visual layout (frontend-engineer scope).

## Coordination items

### For content-lead
- **C-OQ-V1.1:** Cell #3 sub-line phrasing («the whole habit» vs alternatives).
- **C-OQ-V5.1:** Replace vs supplement S7 section sub-line with «Alpha quotes coming Q2 2026.»
- **C-OQ-V5.2:** S7 section h2 — keep «What testers will be noticing.» or D3 revision.

### For frontend-engineer
- **F-OQ-V1.1:** Bump proof-bar `max-w-4xl` → `max-w-5xl` for 4-cell layout.
- **F-OQ-V3.1:** Confirm /disclosures route ownership division (frontend-engineer routing, content-lead body copy).
- **F-OQ-V4.1:** Delete `ProvedoHero.tsx` + `ProvedoRepeatCTA.tsx` legacy files (confirmed dead code by product-designer).
- **F-OQ-V4.2:** Microcopy patch in `ProvedoHeroV2.tsx:477` and `ProvedoRepeatCTAV2.tsx:70` («50 chat messages a month, free always» → «50 free questions a month»).

### For a11y-architect
- **A-OQ-V3.1:** Audit Layer 2 `<details>` keyboard + screen-reader behavior matches FAQ pattern parity.
- **A-OQ-V2.1:** Verify proof-bar reading order (cells → audience-whisper) is semantically correct.

### For tech-lead
- **T-OQ:** Confirm dispatch order — product-designer Wave 1 done; gates frontend-engineer Wave 2 impl.
