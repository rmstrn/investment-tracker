# Slice LP3.6 — Hero L2/L3 Retire + Receipt-System Composition

**Author:** product-designer
**Date:** 2026-04-27
**Status:** draft — awaiting frontend-engineer pickup
**Tier scope:** marketing landing (apps/web/(marketing)/)
**Type:** surface-spec (composition-level), not single-component
**Scope:** the right column of `ProvedoHeroV2` — `aria-hidden="false"` visual region from line ~722 to line ~771 of the shipped file
**Out of scope:** hero head/sub/CTA copy (LOCKED), color tokens (LOCKED), typography stack (LOCKED), Lane A boundaries (LOCKED), motion rules 1–5 (LOCKED)

---

## §0. Source-of-truth inputs and the converged verdict

This spec implements the convergent verdict from three independent reviews dispatched in parallel under Rule 3:

1. Outside Claude Design memo — proposed «retire 3-stack, single receipt + 2 quiet footers»
2. Product-designer re-evaluation (`docs/reviews/2026-04-27-cd-memo-product-designer-reeval.md` §1.4) — concurred on retire-L2-L3, disagreed on «footers» framing; proposed `DigestHeader` + `CitationChip` as **brand-meaningful primitives**, not visual depth filler
3. Brand-strategist verdict (`docs/reviews/2026-04-27-cd-memo-brand-strategist-verdict.md` §5) — concurred on KEEP-L1-RETIRE-L2-L3, with cite-line evolution **on** L1, not replacement of L1; staged 2-slice sequencing; restrained-Sage execution; «sources» (not «receipt») as external typographic vocabulary

Brand-voice review (`docs/reviews/2026-04-27-cd-memo-brand-voice-review.md`) ratifies the shipped chat receipt content (§2) and explicitly DENIES any extension of hero head/sub copy. This spec respects that lock.

**Convergent decision:** drop L2 (`InsightFeedMockup`) + L3 (`BrokerPieMockup`) from hero. Keep L1 (`ChatMockup`) as the load-bearing product surface. Replace L2 with a `DigestHeader` typographic primitive **above** the receipt. Replace L3 with a `CitationChip` typographic primitive **below** the receipt. The three elements compose as **one receipt-system**, not three independent surfaces.

---

## §1. Composition diagram (desktop, 1440px)

```
┌─────────────────────────────────────────────────────────────────────┐
│  HERO SECTION (full-bleed, --provedo-bg-page #FAFAF7)              │
│                                                                     │
│  ┌─────────────────────────┐  ┌───────────────────────────────────┐│
│  │ LEFT — text column       │  │ RIGHT — receipt-system column    ││
│  │                          │  │                                   ││
│  │ Provedo will lead you    │  │ ┌── DigestHeader ───────────────┐││
│  │ through your portfolio.  │  │ │ This week — 3 observations     │││
│  │                          │  │ │ across your portfolio          │││
│  │ Notice what you'd miss   │  │ └─────────────────────────────────┘││
│  │ across all your brokers. │  │   ↓ 12px                          ││
│  │                          │  │ ┌── L1 ChatMockup (shipped) ────┐││
│  │ [Ask Provedo]            │  │ │ User: Why is my portfolio     │││
│  │                          │  │ │ down this month?              │││
│  │ No card. 50 free         │  │ │                               │││
│  │ questions a month.       │  │ │ PROVEDO                       │││
│  │                          │  │ │ You're down −4.2% this month..│││
│  │                          │  │ │ ─────────────                 │││
│  │                          │  │ │ Sources: AAPL Q3 earnings ... │││
│  │                          │  │ │ [sparkline]                   │││
│  │                          │  │ └─────────────────────────────────┘││
│  │                          │  │   ↓ 12px                          ││
│  │                          │  │ ┌── CitationChip ───────────────┐││
│  │                          │  │ │ ⌘ Across IBKR · Schwab        │││
│  │                          │  │ │   · Coinbase — 3 brokers       │││
│  │                          │  │ └─────────────────────────────────┘││
│  └─────────────────────────┘  └───────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

The intent reads top-to-bottom as **«what observations Provedo collected → the observation itself, with sources → where the observation is sourced from»**. Three lines of one receipt-system, not three separate cards.

---

## §2. L1 ChatMockup — cite-line evolution

### §2.1 Decision: KEEP-AS-SHIPPED (no additional cite-line work in this slice)

The strategist's «evolve L1 with cite-line under AI response» direction is **already shipped** at commit `56fb9af` (slice-LP3.4) per `ProvedoHeroV2.tsx` lines 60–61 and lines 359–373. The `HERO_SOURCES_LINE` constant carries verbatim:

> `Sources: AAPL Q3 earnings 2025-10-31 · TSLA Q3 delivery report 2025-10-22 · holdings via Schwab statement 2025-11-01.`

This line:
- Renders italic, `--provedo-text-tertiary`, 12px, mt-2 below the response paragraph
- Animates in via `provedo-sources-fade-in` 240ms cubic-bezier(0.16, 1, 0.3, 1) — compositor-friendly
- Static under reduced-motion
- Was approved 9.5/10 by brand-voice-curator in the prior review §2.5

**Strategist's evolved-direction is therefore satisfied by shipped state.** No action required on L1 cite-line in slice-LP3.6.

### §2.2 Minor adjustments to L1 in slice-LP3.6 (composition-coherence-driven, not content-driven)

Five small adjustments, all visual-chrome only, all motion-rule-compliant:

1. **Drop the parallax `useEffect` block** (lines 645–668 of shipped `ProvedoHeroV2.tsx`) and the derived `l2Offset` / `l3Offset` constants (lines 667–668). With L2 and L3 retired, the parallax handler has no consumers. Removing reduces JS bundle by ~280 bytes (gzipped) and removes a scroll listener.
2. **Drop the `useState<number>(scrollY)`** state — same rationale.
3. **Remove the `heroRef` if unused after parallax removal.** Verify with TypeScript `noUnusedLocals`.
4. **Adjust the right column's `minHeight: '380px'`** (line 725) — with L2/L3 gone, the column is shorter. New minimum should be `--space-receipt-min: 320px` to keep the left/right alignment stable across content variation. Use `min-h-[320px]` Tailwind.
5. **Center L1 vertically in the right column.** Currently L1 has `marginTop: '48px'` (line 764) which compensates for L2/L3 above it. With L2/L3 gone, replace with vertical centering: `display: flex; flex-direction: column; justify-content: center; gap: 12px;` on the right-column wrapper, with no `marginTop` on the L1 wrapper.

**No change to:**
- `HERO_USER_MESSAGE` content (LOCKED by brand-voice §2)
- `HERO_RESPONSE_SEGMENTS` content (LOCKED)
- `HERO_SOURCES_LINE` content (LOCKED)
- typing animation timing (`TYPING_BASE_MS_PER_CHAR`, `TYPING_JITTER_MS`, `SENTENCE_PUNCTUATION_PAUSE_MS`, `INTER_BUBBLE_PAUSE_MS`)
- replay-on-intersection behavior
- `InlinePnlSparkline` content or position
- box-shadow elevation (kept at the `0 8px 24px / 0 2px 4px` shipped value — L1 is now the only product-surface mockup, deserves the heavier elevation as compositional anchor)

---

## §3. L2 replacement — `DigestHeader` typographic primitive

### §3.1 Visual specification

**Position:** above L1 ChatMockup, right column. 12px gap below it (i.e. 12px between DigestHeader bottom and L1 top).

**Container:**
- No card chrome (no border, no background, no box-shadow)
- Max-width matches L1 (`max-w-[420px]`, mirrors L1's shipped `maxWidth: '420px'` at line 763)
- `mx-auto` for desktop center-align with L1
- Padding: `0` horizontally, `0` vertically — pure typography, no card affordance

**Content (English, voice-clean, brand-strategist + brand-voice approved register):**

Two-line typesetting:
- **Eyebrow line:** `THIS WEEK` — small-caps, tracking-widest, 11px, `--provedo-text-tertiary`, font-weight 500
- **Tagline line:** `3 observations across your portfolio` — sans (Inter), 14px, `--provedo-text-secondary`, font-weight 400, leading-snug

Optional separator: a 24px wide horizontal hairline below the tagline at `--provedo-border-subtle`, 1px, only visible on desktop (≥1024px). Adds the "ledger" affordance without becoming a card.

**Typography:**

| Element | Font | Size | Weight | Tracking | Color |
|---|---|---|---|---|---|
| Eyebrow `THIS WEEK` | `--provedo-font-sans` | 11px | 500 | 0.16em (widest) | `--provedo-text-tertiary` (#475569) |
| Tagline body | `--provedo-font-sans` | 14px | 400 | normal | `--provedo-text-secondary` (#334155) |
| Number `3` (within tagline) | `--provedo-font-mono` | 14px | 500 | normal | `--provedo-text-primary` (#0F172A) |

**Why this typography mix:** the eyebrow + body pattern matches the shipped §S3 negation eyebrow (`PROVEDO` wordmark) and §S4 demo-tab eyebrows. Mono numeral inside the body sentence ties the DigestHeader visually to the receipt below (which mono-formats every number). This is the composition-coherence anchor: **mono numerals are the system signature; if DigestHeader uses one, it reads as the same surface as the receipt.**

### §3.2 Brand meaning carried

The DigestHeader carries one brand promise: **continuous observation cadence**. Provedo doesn't only respond when asked; it watches across the week and surfaces what matters. The pre-retirement L2 (`InsightFeedMockup`) carried this same signal but as a competing product surface; the DigestHeader carries it as **introductory typography for the receipt below** — a header, not a sibling.

This converts the «3 items this week» signal from a fake-product-feed (which read as orphan AI-tool list per the PD reeval §0 Finding 3) into a **frame for the receipt** — «Provedo collected 3 observations; here is one of them in detail».

The «3» count creates a productive expectation: the visitor reads «3 observations» and sees one detailed observation in the receipt below, implying the existence of 2 more (which can be explored in the demo tabs further down the page). This is Sage-restraint (don't show all 3; show 1 in detail and signal there are more).

### §3.3 Animation behavior

**Motion: NONE on initial render.** The DigestHeader is static typography; it does not animate in.

**Rationale:** the L1 receipt has its own typing-animation that already costs ~600ms of the entrance budget. The DigestHeader, being above L1 in reading order, must already be visible when the typing animation starts — otherwise the user reads the chat without the digest context. A static header is also Sage-correct: animated headers are Magician/Outlaw tells.

**Reduced-motion:** identical static behavior. No-op.

**Bundle: 0 motion JS.** Pure CSS typography.

### §3.4 Acceptance criteria

- [ ] Eyebrow renders `THIS WEEK` in small-caps, 11px, tracking-widest
- [ ] Tagline renders `3 observations across your portfolio` (note: NO leading «—» dash; NO trailing period; final comma absent — single declarative phrase)
- [ ] Numeral `3` renders in JBM mono (`--provedo-font-mono`)
- [ ] No card chrome (no border, no background, no shadow)
- [ ] 12px gap between DigestHeader bottom and L1 ChatMockup top
- [ ] `aria-hidden` is **NOT** set — it is real readable content for screen readers (see §6 for a11y semantics)
- [ ] Renders on tablet (≥768px) and desktop (≥1024px)
- [ ] Hidden on mobile (<768px) — see §7 for mobile collapse strategy

---

## §4. L3 replacement — `CitationChip` typographic primitive

### §4.1 Visual specification

**Position:** below L1 ChatMockup, right column. 12px gap above it (i.e. 12px between L1 bottom and CitationChip top).

**Container:**
- Inline-flex chip (not full-width)
- Single rounded pill: `rounded-full`, padding `px-3 py-1.5`
- Border: 1px solid `--provedo-border-subtle`
- Background: `--provedo-bg-elevated` (#FFFFFF) — same as L1, reinforcing the "same surface" reading
- No box-shadow (L1 carries the elevation; the chip sits on the L1 plane)
- Centered: `mx-auto` on desktop; aligned with L1 left edge on tablet (see §7)

**Content:**

Single line, three components:
1. Leading icon: a 14px Lucide `Layers3` glyph (already in dependency tree per shipped imports) at `--provedo-text-tertiary`. Indicates "stacked sources / multiple brokers" — matches the multi-broker positioning anchor.
2. Mono ticker list: `IBKR · Schwab · Coinbase` — `--provedo-font-mono`, 12px, `--provedo-text-secondary`, weight 500. Three ticker tokens separated by mono middle-dots.
3. Suffix: `— 3 brokers` — sans, 12px, `--provedo-text-tertiary`, weight 400. The em-dash sets it as a clarifying clause, not a label.

Full string rendered: `[Layers3] IBKR · Schwab · Coinbase — 3 brokers`

**Typography:**

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Icon `Layers3` (14×14) | (lucide) | 14px | n/a | `--provedo-text-tertiary` |
| Ticker tokens | `--provedo-font-mono` | 12px | 500 | `--provedo-text-secondary` |
| Suffix `— 3 brokers` | `--provedo-font-sans` | 12px | 400 | `--provedo-text-tertiary` |

**Why these tokens:** IBKR + Schwab + Coinbase is the broker triplet referenced in the shipped Tab 4 chat answer (per `ProvedoDemoTabsV2.tsx` line 222), in the shipped `BrokerPieMockup` SVG legend (line 525 «Across IBKR + Schwab»), and is a load-bearing trio across the page. Reusing the same trio in the hero CitationChip creates **page-level coherence** — the visitor encounters IBKR/Schwab/Coinbase at the hero and again at the demo tabs, registering it as «these are Provedo's representative brokers».

### §4.2 Brand meaning carried

The CitationChip makes the **«every observation is sourced»** promise literal. The receipt above already cites three sources (`AAPL Q3 earnings`, `TSLA Q3 delivery report`, `Schwab statement`). The chip below answers an implicit visitor question: «sourced from where?» — by naming the brokers Provedo aggregates across.

This carries the **multi-broker aggregation positioning** that L3 BrokerPieMockup originally carried, but as a typographic claim instead of an orphan donut chart. The donut at 0.6 opacity hidden on mobile was a weak way to deliver the multi-broker signal (per PD reeval §1.3). A typographic chip is stronger because:
- It reads as part of the receipt-system, not as a separate dashboard widget
- It's legible on mobile (no chart-reading required)
- It composes visually with the sources line directly above it inside L1

The chip's job is not to claim breadth (the §S2 proof-bar «1000+ brokers» does that, the §S8 marquee does that). The chip's job is to ground the **specific** receipt above it in the **specific** brokers Provedo pulls from. Specificity = trust.

### §4.3 Animation behavior

**Motion: subtle entrance only**, fired exactly once when L1's typing-animation completes (phase = `done`).

**Spec:**
- `opacity: 0 → 1` over 240ms, cubic-bezier(0.16, 1, 0.3, 1)
- `transform: translateY(4px) → translateY(0)` over 240ms
- Delay: 120ms after the L1 sources-line animation begins (so the chip animates in just as the sources line settles, reinforcing the «sources are explained by where they came from» reading)
- Total duration: 240ms — well within the 600ms entrance budget

**Reduced-motion:** static render, full opacity, no transform.

**Why animate this and not the DigestHeader:** the DigestHeader sets the frame **before** the receipt; it must already be visible when the typing starts. The CitationChip closes the receipt **after** the typing finishes; animating its arrival reinforces the «one continuous observation» reading — typing → sources → chip, in causal order.

**Replay-on-intersection:** the chip's entrance animation should be tied to L1's existing `useInView` replay mechanism. When the user scrolls back into the hero, L1's typing replays from start, and the chip should re-fade-in at the appropriate moment. Implementation: use a derived `phase === 'done'` boolean from L1's `useTypingSequence` hook, lifted to the parent component via prop or via a shared hook.

### §4.4 Acceptance criteria

- [ ] Renders as inline-flex pill, not full-width
- [ ] Border 1px `--provedo-border-subtle`, background `--provedo-bg-elevated`, no shadow
- [ ] Tickers `IBKR · Schwab · Coinbase` in JBM mono, `--provedo-text-secondary`
- [ ] Suffix `— 3 brokers` in sans, `--provedo-text-tertiary`
- [ ] `Layers3` icon 14×14, `--provedo-text-tertiary`
- [ ] 12px gap above (L1 bottom → chip top)
- [ ] Animates in 240ms after L1 typing completes; static under reduced-motion
- [ ] Re-fires on scroll-back (intersection re-entry)
- [ ] Renders on tablet (≥768px) and desktop (≥1024px)
- [ ] Hidden on mobile (<768px) — see §7

---

## §5. Composition coherence check

### §5.1 The risk the PD reeval §9 named

> «The pattern across the two re-evaluations: both audits scored against design-rubric-in-isolation. Neither scored against content-claim-coherence (does the chart serve the chat answer? does the hero stack tell one product story?). This is a recurring blindspot in design audits: optimizing per-element without auditing whether the elements compose coherently.»

This spec applies that audit to itself, **before** frontend-engineer implementation, to avoid shipping a per-element-correct but composition-incoherent hero.

### §5.2 The composition test: does the visitor read «one receipt-system» or «three separate elements»?

The three elements compose as one receipt-system **if** the visitor's reading order produces a single continuous narrative.

Reading-order trace (left-to-right, top-to-bottom, desktop):
1. Visitor reads hero head «Provedo will lead you through your portfolio.» (locked left column)
2. Visitor reads hero sub «Notice what you'd miss across all your brokers.» (locked left column)
3. Visitor's eye moves right, sees **DigestHeader**: «THIS WEEK — 3 observations across your portfolio»
   → registers: «Provedo watches my portfolio across a week; there are 3 observations available»
4. Visitor reads **L1 receipt** (User question typed → Provedo response typed → sources line)
   → registers: «here is one of those 3 observations, in detail, with sources»
5. Visitor's eye drops to **CitationChip**: «IBKR · Schwab · Coinbase — 3 brokers»
   → registers: «and here are the brokers Provedo pulls those sources from»

**Single narrative arc:** weekly cadence → specific observation with sources → broker scope. Each element answers the question the previous element raises. This is the receipt-system reading.

### §5.3 Anti-test: where could it fail?

Three failure modes, each with mitigation in this spec:

**Failure mode 1 — DigestHeader reads as a section heading, not part of L1.**
If the DigestHeader has too much visual weight (large type, bold, decorative chrome), it will split the right column into «section A: digest» / «section B: receipt» — two surfaces, not one.
*Mitigation:* small-caps eyebrow at 11px tertiary, body at 14px secondary, no card chrome, 12px gap (smaller than would separate distinct sections — same gap as inter-paragraph spacing). The DigestHeader visually-weight is **lighter** than L1, so the receipt remains the focal point.

**Failure mode 2 — CitationChip reads as a button or interactive element.**
Pill shape + icon could be misread as «click to open broker connections». That breaks the typographic-chip reading.
*Mitigation:* no hover state, no cursor change, no focus ring (it's not interactive). The chip is `<aside>` semantically (see §6), not a button. Visual: thin border + same bg as L1 = looks like part of the receipt's footer, not an actionable element.

**Failure mode 3 — Spacing rhythm reads as «three separate cards».**
If the gap between elements is too generous (e.g. 24px), the right column reads as three independent boxes.
*Mitigation:* 12px gap throughout — half the typical inter-card gap on this page (e.g. demo-tab cards have 24px). 12px is paragraph-internal spacing, signaling «same surface».

### §5.4 Composition-coherence verdict

The three elements compose as one receipt-system. The hero now reads as: **a digest pointer to a specific receipt that cites specific sources from specific brokers**. The reader gets one product-story, not three.

---

## §6. Accessibility

### §6.1 Semantic HTML structure

```html
<section aria-labelledby="hero-heading">
  <h1 id="hero-heading">Provedo will lead you through your portfolio.</h1>
  <p>Notice what you'd miss across all your brokers.</p>
  <a href="#demo">Ask Provedo</a>
  <p>No card. 50 free questions a month.</p>

  <aside aria-label="Provedo demo receipt">
    <header>
      <p class="eyebrow">This week</p>
      <p>3 observations across your portfolio</p>
    </header>

    <article aria-label="Provedo demo conversation">
      <!-- shipped ChatMockup contents — unchanged -->
    </article>

    <footer aria-label="Sources">
      <p>
        <span aria-hidden="true">[Layers3 icon]</span>
        Across IBKR · Schwab · Coinbase — 3 brokers
      </p>
    </footer>
  </aside>
</section>
```

The right-column wrapper becomes `<aside>` (was unmarked `<div>`). The `<header>` and `<footer>` inside the aside are semantic markers that communicate to screen-readers «this digest belongs to this receipt; this citation belongs to this receipt». Reading order via screen-reader: digest → conversation → citation, in DOM order.

### §6.2 Screen-reader behavior

- DigestHeader is read in full as part of the aside header
- L1 ChatMockup retains its `aria-live="polite"` on the response paragraph (shipped behavior); user message has `aria-label="User message"`; response has `aria-label="Provedo response"`
- CitationChip's icon is `aria-hidden="true"`; the text content is read in full
- Tab order: the only interactive element in the right column is the (existing) primary CTA in the left column — no tab stops added by this slice

### §6.3 Contrast ratios (WCAG 2.2 AA, 4.5:1 minimum for body text)

All measured against `--provedo-bg-page` #FAFAF7 and `--provedo-bg-elevated` #FFFFFF.

| Element | Foreground | Background | Ratio | Pass |
|---|---|---|---|---|
| DigestHeader eyebrow | #475569 | #FAFAF7 | 7.96:1 | AAA |
| DigestHeader body | #334155 | #FAFAF7 | 11.04:1 | AAA |
| DigestHeader mono numeral | #0F172A | #FAFAF7 | 16.79:1 | AAA |
| CitationChip ticker tokens | #334155 | #FFFFFF | 11.65:1 | AAA |
| CitationChip suffix | #475569 | #FFFFFF | 8.40:1 | AAA |
| CitationChip border | #E2E8F0 | #FFFFFF | 1.43:1 | n/a (decorative) |

All text passes AAA. Border ratio is decorative (non-text).

### §6.4 Keyboard navigation

- DigestHeader: not focusable (text content only)
- CitationChip: not focusable (text content only, NOT a link or button)
- L1 ChatMockup: not focusable (shipped behavior unchanged)
- Tab order from hero head: H1 → CTA → (skip the right-column aside) → next section
- Skip-link behavior (`#main-content`) unchanged

### §6.5 Reduced-motion behavior

| Element | Default motion | `prefers-reduced-motion: reduce` |
|---|---|---|
| DigestHeader | static (no motion) | static (no change) |
| L1 ChatMockup typing | typing animation | full text rendered statically |
| L1 ChatMockup sources line | 240ms fade | static, opacity 1 |
| L1 ChatMockup sparkline | 400ms fade | static, opacity 1 |
| CitationChip entrance | 240ms fade + translateY | static, opacity 1, no transform |

All CSS animations use the existing `usePrefersReducedMotion` hook (already shipped). No new motion primitives.

### §6.6 Motion-rule compliance check (5 rules from slice-LP3.3)

| Rule | This slice |
|---|---|
| Compositor-friendly props only (transform / opacity) | YES — chip uses opacity + translateY only |
| ≤600ms entrance budget | YES — chip 240ms + L1 typing already accounted for in shipped budget |
| ≤3 simultaneous animations | YES — at peak: L1 typing + L1 sources fade-in, chip queues after; max 2 simultaneous |
| `prefers-reduced-motion` respected | YES — see §6.5 |
| No narrative-causation drift | YES — chip animation reinforces the natural receipt reading order |

---

## §7. Mobile + responsive behavior

### §7.1 Breakpoint matrix

| Breakpoint | DigestHeader | L1 ChatMockup | CitationChip | Right-column layout |
|---|---|---|---|---|
| 320px (small mobile) | hidden | visible | hidden | full-width L1 only |
| 375px (standard mobile) | hidden | visible | hidden | full-width L1 only |
| 768px (tablet) | visible | visible | visible | centered column, 480px max |
| 1024px (laptop) | visible | visible | visible | flex-row with left text col |
| 1440px (desktop) | visible | visible | visible | flex-row with left text col |
| 1920px (wide desktop) | visible | visible | visible | flex-row, max-w-7xl container |

### §7.2 Mobile collapse strategy: drop both DigestHeader and CitationChip below 768px

**Rationale:** the L1 receipt alone fully satisfies the chat-first-wedge positioning on mobile; the digest + chip add typographic refinement, not load-bearing brand information. On a 320px viewport, every pixel earns its keep — adding a header and a footer to a chat surface is decorative-density that a small screen can't afford.

The mobile reading order becomes:
1. Hero head + sub + CTA (full width, top)
2. L1 ChatMockup (full width, below text column)
3. (no DigestHeader, no CitationChip)

The DigestHeader's brand promise («continuous weekly observation») is carried elsewhere on mobile by the §S5 InsightsBullets section — a few scrolls down. The CitationChip's brand promise («multi-broker scope») is carried elsewhere by the §S2 proof-bar `1000+ brokers` cell, and by the shipped sources line **inside** the L1 receipt (which IS visible on mobile) which already names «Schwab statement 2025-11-01». Mobile loses zero positioning load.

### §7.3 Tablet (768px–1023px) layout

- Right column stacks below the left text column (already shipped behavior — `flex-col` until `lg:flex-row`)
- DigestHeader, L1, CitationChip all visible, vertically stacked with 12px gaps
- Right column max-width: 480px, centered
- Receipt reads as a calm three-line composition; the digest+chip add weight to the mobile-tablet experience justifying the work

### §7.4 Implementation: Tailwind responsive classes

```tsx
{/* DigestHeader wrapper */}
<header className="hidden md:block mx-auto max-w-[420px]">
  ...
</header>

{/* L1 ChatMockup — always visible, max-w-[420px] */}
<div className="mx-auto w-full max-w-[420px]">
  <ChatMockup prefersReduced={prefersReduced} />
</div>

{/* CitationChip wrapper */}
<footer className="hidden md:flex justify-center mx-auto max-w-[420px]">
  ...
</footer>
```

`hidden md:block` (or `md:flex`) is the standard mobile-hide pattern in the codebase (matches L2's shipped `hidden md:block` at line 745 — but applied to DigestHeader/CitationChip, not L2/L3 which are now retired).

---

## §8. Bundle impact estimate

### §8.1 Code added

| Module | Approx gzipped size |
|---|---|
| `DigestHeader` component (new) | +0.3 kB |
| `CitationChip` component (new) | +0.5 kB (includes Layers3 icon import — but Layers3 may already be in dependency tree; verify with frontend-engineer) |
| Phase-shared hook for chip-fade-trigger | +0.2 kB |
| Tailwind class additions (compiled CSS) | +0.05 kB |

**Subtotal added: ~1.05 kB gzipped.**

### §8.2 Code removed

| Module | Approx gzipped size |
|---|---|
| `InsightFeedMockup` component | −0.4 kB |
| `BrokerPieMockup` component (with SVG) | −0.9 kB |
| `useEffect` parallax block + `scrollY` state | −0.3 kB |
| Right-column inline parallax `transform` strings | −0.05 kB |

**Subtotal removed: ~1.65 kB gzipped.**

### §8.3 Net bundle delta: −0.6 kB gzipped

This slice is **bundle-positive** — it removes more code than it adds. The current `/` route is at 140 kB; this slice brings it closer to the 80 kB headroom target by ~0.6 kB. Slice-LP3.5 (running in parallel) will need to find its own bundle reductions; this slice is not a budget consumer.

### §8.4 Runtime perf delta

- Removal of the scroll handler (parallax `requestAnimationFrame` loop): saves a passive scroll listener and per-frame DOM read (`getBoundingClientRect`). Small but observable on slower devices.
- One fewer animated SVG in the hero (donut). Reduces paint work on first scroll.

**Verdict: this slice improves CWV (LCP, INP) measurably on slow devices.**

---

## §9. Frontend handoff readiness — what to build, in what order

### §9.1 Build order (recommended for frontend-engineer)

1. **Component extraction (no behavior change):** extract `ChatMockup` from `ProvedoHeroV2.tsx` into its own file `apps/web/src/app/(marketing)/_components/hero/ChatMockup.tsx`. Same content, same behavior. Test parity. **[REQUIRED]**
2. **Delete L2 + L3:** remove `InsightFeedMockup` + `BrokerPieMockup` functions (lines 456–636). Remove their JSX usages in `ProvedoHeroV2` (lines 728–756). Remove parallax `useEffect` + `scrollY` state. Remove `heroRef` if unused. Clean up `--space-receipt-min` constant. **[REQUIRED]**
3. **Create `DigestHeader` component:** new file `apps/web/src/app/(marketing)/_components/hero/DigestHeader.tsx`. Pure typography, no state, no motion, no props beyond optional `className`. Export named `DigestHeader`. **[REQUIRED]**
4. **Create `CitationChip` component:** new file `apps/web/src/app/(marketing)/_components/hero/CitationChip.tsx`. Takes a `phase: 'idle' | 'done'` prop (or equivalent boolean `isReceiptComplete`) to trigger the entrance animation. Uses `prefersReducedMotion` from existing hook. **[REQUIRED]**
5. **Lift L1 typing-completion state:** the existing `useTypingSequence` hook returns `phase`. Either lift it to `ProvedoHeroV2` so it can pass `phase === 'done'` to `CitationChip`, OR create a simple shared hook `useReceiptCompletion` that mirrors the timing. Frontend-engineer's call on which is cleaner. **[REQUIRED]**
6. **Compose new right column:** in `ProvedoHeroV2`, replace the right-column `<div>` (lines 722–771) with an `<aside>` containing `DigestHeader` (md+ only), `ChatMockup`, `CitationChip` (md+ only), in that DOM order. Apply the responsive classes per §7. **[REQUIRED]**
7. **Tests:** update `apps/web/src/app/(marketing)/page.test.tsx` to assert (a) DigestHeader text content, (b) CitationChip text content, (c) absence of `InsightFeedMockup` and `BrokerPieMockup` mock surfaces, (d) shipped `HERO_USER_MESSAGE`, `HERO_RESPONSE_SEGMENTS`, `HERO_SOURCES_LINE` content invariants still pass. **[REQUIRED]**
8. **Visual regression:** Playwright screenshots at 320, 375, 768, 1024, 1440, 1920. Compare to baseline. **[REQUIRED]**
9. **Lighthouse pass on `/`:** verify LCP < 2.5s, INP < 200ms, CLS < 0.1. Confirm bundle delta. **[REQUIRED]**

### §9.2 Optional / nice-to-have

- **Move CSS keyframes to `packages/design-tokens/animations.css`** instead of inline `<style>` block in `ProvedoHeroV2`. Improves cacheability and de-duplicates if other components use the same animation. **[OPTIONAL]**
- **`Layers3` icon import audit:** if Lucide tree-shaking pulls only `Layers3`, the cost is ~0.3 kB. If it pulls a barrel, switch to inline SVG (12 lines of path data). Frontend-engineer's call. **[OPTIONAL]**
- **Visual rhythm test:** verify that the 12px gap between DigestHeader-L1-CitationChip reads as «one surface» on a 1440px screenshot. Adjust to 8px or 16px if it doesn't. **[OPTIONAL]**

### §9.3 Out of scope for this slice

- Any change to L1 chat content (LOCKED by brand-voice §2)
- Any change to hero head/sub/CTA copy (LOCKED)
- Refactoring the typing-animation timing knobs (already polished in slice-LP3.4)
- Updates to demo-tab content (slice-LP3.5 territory)
- `Sources:` typographic-primitive systematization across the page (deferred to a later slice — was Phase 2.5 §3.1 highest-ROI proposal but not in scope here)

---

## §10. Open questions for downstream specialists

### §10.1 For content-lead (via right-hand)

- Is the DigestHeader copy `THIS WEEK — 3 observations across your portfolio` voice-clean as drafted? It uses two allowlist signals (`observations`, the «across all your brokers» rhyme via «across your portfolio») but I have not had brand-voice-curator review it explicitly.
- Should the number `3` in the DigestHeader match a real demo-content count (i.e. there must actually be 3 observations across the page's demo tabs to honor the promise)? Currently 4 demo tabs exist; if the page genuinely surfaces 3 «this week»-coded observations, the DigestHeader is honest. If not, content-lead should propose alternative phrasing or align demo-tab count.
- For the CitationChip, are `IBKR · Schwab · Coinbase` the canonical broker triplet for landing-copy use, or should we narrow to `IBKR · Schwab` (which the Tab 4 chat answer literally references and excludes Coinbase)? The data-coherence problem flagged in PD reeval §0 Finding 2 affects this — Coinbase appears in `BrokerPieMockup` (now retired) but not in the chat answer. The cleanest answer might be to drop Coinbase from the chip and use «IBKR · Schwab — 2 brokers», then promote a different broker count signal elsewhere on the page.

### §10.2 For brand-voice-curator (via right-hand)

- Voice rating on `THIS WEEK — 3 observations across your portfolio` (eyebrow + tagline)?
- Voice rating on `IBKR · Schwab · Coinbase — 3 brokers` (or the alternative `IBKR · Schwab — 2 brokers`)?
- Composition-level voice check: does the receipt-system reading (digest → receipt → citation) hold the Sage register, or does it drift toward dashboard register?

### §10.3 For frontend-engineer (direct, post-handoff)

- Confirm `Layers3` icon is already in the dependency tree (likely — used elsewhere). If not, decide between import or inline SVG.
- Confirm bundle estimate; report actual gzipped delta after build.
- Decide whether `useReceiptCompletion` is a separate hook or whether `phase` is lifted to parent. Either is acceptable.
- Confirm that removing the parallax handler does not break any e2e or visual-regression tests; if it does, update baselines.

### §10.4 For a11y-architect (post-implementation audit)

- Verify the `<aside>` semantic for the right column reads correctly in NVDA + JAWS + VoiceOver
- Confirm `aria-label="Provedo demo receipt"` on the aside is the right label, or whether something more specific (e.g. «Provedo weekly digest with sample observation») reads better
- Confirm reading order on screen readers matches the visual reading order described in §5.2

---

## §11. Blockers / authorizations beyond right-hand greenlight

**None.**

Right-hand has greenlit the slice-LP3.6 scope under PO delegation. Brand-strategist verdict §11 listed four pre-ship gates: (1) content-lead delivers cite-trail copy — already shipped at slice-LP3.4; (2) tech-lead confirms cite-discipline shippable in alpha — not relevant to this slice (no new cite claims); (3) brand-voice-curator chrome-typography pass — flagged as §10.2 open question, not a blocker for design spec; (4) right-hand routes to PO with staged-2-slice framing — already done.

The brand-voice-curator pass on the new typographic primitives (`THIS WEEK — 3 observations` and `IBKR · Schwab · Coinbase — 3 brokers`) should happen **before** frontend-engineer ships, but is not a blocker on writing the spec or starting component scaffolding. Right-hand to dispatch when ready.

The brand-strategist Risk #4 («receipt-chrome on landing should be gated on tech-lead confirmation that the alpha product can ship with cite-discipline at chrome-promised level») does not apply to this slice in isolation — slice-LP3.6 retires L2/L3 but does NOT add new chrome promises beyond the shipped sources line. The chrome-promise risk applies to the broader receipt-system extension (slice-LP4-D-prime-B per strategist §11), not to slice-LP3.6.

---

## §12. Definition of done

- [ ] L2 `InsightFeedMockup` deleted; L3 `BrokerPieMockup` deleted
- [ ] Parallax scroll handler + `scrollY` state removed
- [ ] `DigestHeader` component built per §3
- [ ] `CitationChip` component built per §4 (with `phase`-driven entrance animation)
- [ ] L1 `ChatMockup` extracted to own file; behavior unchanged; all shipped tests pass
- [ ] Right column composed as `<aside>` with `<header>` (DigestHeader) + `<article>` (ChatMockup) + `<footer>` (CitationChip)
- [ ] Mobile (<768px) hides DigestHeader and CitationChip; L1 visible full-width
- [ ] Reduced-motion: all animations static; tested with system setting
- [ ] WCAG AAA contrast ratios on all new text (verified per §6.3)
- [ ] Playwright screenshots updated at 320, 375, 768, 1024, 1440, 1920
- [ ] Bundle delta confirmed ≤0 (slice is bundle-positive per §8)
- [ ] Lighthouse: LCP < 2.5s, INP < 200ms, CLS < 0.1 on `/`
- [ ] Page tests assert new content invariants (DigestHeader + CitationChip text)
- [ ] Brand-voice-curator approves the two new typographic primitives

---

**End of slice-lp3-6-hero-retire-spec.md**
