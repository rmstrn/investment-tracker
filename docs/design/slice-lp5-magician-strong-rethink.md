# Slice-LP5 — Magician-Strong Visual Rethink

**Author:** product-designer (independent strong direction)
**Date:** 2026-04-27
**Reports to:** right-hand
**Status:** spec for frontend implementation — no further review wave

**Authorization scope (from right-hand brief):**
- Gradient ramps within teal/slate/cream palette — UNLOCKED
- Motion choreography richer than current 5-rule v3.1 baseline — UNLOCKED, still compositor-friendly
- Depth (shadows, light glass on elevated surfaces, layered z-index) — UNLOCKED
- Chart visual craft (gradient fills, draw-on, sparkline micro-interactions) — UNLOCKED
- Chat shell quality (bordered app-grade surface, header bar, typing-indicator dots) — UNLOCKED
- Section visual differentiation (intentional hue/depth shifts per section) — UNLOCKED
- Bento layouts where appropriate — UNLOCKED

**Locks still binding:**
- Hero head «Provedo will lead you through your portfolio.» — UNTOUCHED
- Hero sub «Notice what you'd miss across all your brokers.» — UNTOUCHED
- Tagline «Notice what you'd miss» — UNTOUCHED
- Naming Provedo — UNTOUCHED
- Palette base warm-cream `#FAFAF7` + slate-900 `#0F172A` + teal-600 `#0D9488` — UNTOUCHED (gradient EXTENSIONS within these hues permitted)
- Inter + JetBrains Mono — UNTOUCHED (additional weights inside these families permitted)
- Lane A discipline (no advice / recommendation / strategy / suggestion language) — UNTOUCHED
- Pre-alpha — no fake testimonials, no fabricated metrics

---

## A. Research summary

8 references studied in depth. Each yields one translatable craft technique and one anti-pattern Provedo must NOT inherit. Honest about translatable vs aspirational vs off-archetype.

### A.1 Anthropic.com (claude.ai marketing surfaces)
- **Translatable:** Soft full-bleed off-white background with very large, very calm headline typography, then a tightly-bordered surface element (chat / code block) sitting on top with a subtle drop shadow + 1px hairline border. The depth comes from one shadow at low alpha, not from gradients. The «AI is the surface» feeling is achieved by treating the chat container as a real product window, not a marketing illustration.
- **Anti-pattern:** None for us — this is closest to our archetype. The only risk is mimicking too closely (Anthropic uses Claude orange/coral; we hold teal). Lift the shape, not the hue.

### A.2 Cursor.com
- **Translatable:** A single product screenshot blown up to fill the viewport, with subtle gradient atmosphere behind it (very low-opacity color-wash anchored to one accent). Chat input bar at the bottom of the chat panel — visible affordance, not just a static mock.
- **Anti-pattern:** Cursor's hero auto-plays a code-typing demo at full speed inside a fake editor; readability suffers, fast scrollers get confused. We keep typing slow and intentional (current `TYPING_BASE_MS_PER_CHAR=35` is right).

### A.3 Lovable.dev
- **Translatable:** Chat-as-product hero — input field is the focal element, with a small AI avatar / status pill above it. Below the chat: live preview surfaces fade in as the user «types». Their full-width visual frame around the chat with a soft shadow is the strongest single craft move.
- **Anti-pattern:** Lovable leans heavily on gradient-mesh backgrounds (purple/pink/orange). That's exactly our §0.1 banned register. The shape of their chat container is our reference; the chrome is not.

### A.4 Linear.app
- **Translatable:** Bento layouts done with precision — different card sizes, different bg tones (warm vs cool vs dark), each cell carrying ONE visual idea. Hover state on cards: gentle lift + subtle border-glow in their accent. Their use of `mix-blend-mode: lighten` over a dark bg for soft halos is replicable in pure CSS.
- **Anti-pattern:** Linear's 2024-era gradient-mesh-orbs in the hero. Their newer 2025 surfaces dropped this; we mirror the new direction.

### A.5 Granola.ai
- **Translatable:** Closest-to-archetype reference. Calm cream bg, restrained typography, but visually RICH because every section has its OWN distinct treatment — one section is a white card on cream, the next is a darker editorial block, the next is a serif-led pull-quote. The richness is in the rhythm, not in the chrome. Granola also nails the «real product output as the hero illustration» pattern (their notes UI is shown verbatim, not abstracted).
- **Anti-pattern:** Granola occasionally over-relies on stock product screenshots. We build SVG illustrations native to the page (already our pattern — keep).

### A.6 Vercel.com
- **Translatable:** Gradient meshes done tastefully — large soft radial gradient anchored to one corner, low chroma, never the whole bg, always behind a sharp hero element. Their typography pairing of geist sans + mono with `font-feature-settings: 'ss01' 'cv11'` for stylistic alternates lifts numbers without changing fonts.
- **Anti-pattern:** Vercel's «infinity ring» / «globe» motion graphics. Off-archetype for fintech-Sage. Skip.

### A.7 Mercury.com
- **Translatable:** Financial UI shown beautifully — they nail oversized numbers in mono font with subtle baseline-shift micro-typography. Their sectioned bento with one «hero card» (largest, dark) anchoring a row of smaller cards is the closest fintech precedent to what we should build for §S5/S8.
- **Anti-pattern:** Mercury's premium-banking-luxe feel reads upmarket-corporate; we want premium-but-personal. Don't copy their tonal seriousness — keep Provedo's calm-curious voice.

### A.8 Stripe.com
- **Translatable:** Headline typography with optical sizing + tracking adjustments; numerics in JBM-mono get tabular-nums + slashed-zero feature flags. Stripe also uses gradient-on-text very sparingly (one word per page max) — usable for hero accent if we want.
- **Anti-pattern:** Stripe's hero parallax-on-scroll animated diagrams. Heavy implementation, brittle, and the diagrams don't translate to a Sage-archetype tool.

### Aspirational / cited-but-not-studied
- **Apple Intelligence** (status: 404 on direct URL today; surface known from prior pages): Liquid Glass + gradient + motion. Off-archetype for us (consumer-luxury, not fintech-Sage). Skip.
- **Framer.com:** Motion-rich landing, but motion is THE message there (it's a motion tool). Off-archetype copy strategy for Provedo.

### Net research takeaway
The Magician+Sage register CAN be visually rich. Granola is the proof. The recipe is: **rich rhythm + rich per-surface chrome quality + restrained palette** — not «add gradients». Anthropic+Granola hybrid is the target.

---

## B. Strategic posture re-frame

**We were optimizing for «Sage discipline» — restrained, calm, brand-correct, audit-passing. We should be optimizing for «Magician craft» — beautiful, distinctive, alive, while staying brand-correct.**

The Sage axis was over-weighted by every prior validation wave. Phase 3 × 4, CD memo × 3, final design wave × 5 — all naturally favored «what can be defended» over «what is beautiful». The result is a landing that is structurally clean, voice-clean, legally clean — and visually flat. PO is right.

The rebalance is not «throw away discipline». It is: **Magician primary, Sage modifier**. The Magician archetype is craft, foresight, transformation, beauty-with-power. Provedo's etymology («I provide for / I foresee») is Magician-led; the Sage register is the second voice that keeps it honest. We have been speaking Sage-loud / Magician-quiet. We invert.

Concrete consequences:
- Visual richness is now MANDATORY, not permitted. Every section must demonstrate at least one craft-grade move (gradient atmosphere, depth, motion, type-craft, or shape).
- Sage discipline is now ENFORCED THROUGH Magician craft, not against it. The chat shell becomes a beautiful chat shell, not a restrained one. The charts become beautiful charts that happen to also be Lane-A-clean.
- The «we are not Robinhood» fear is over-weighted in our anti-pattern §0.1. Robinhood is gambling-jazz; gradient atmosphere on a calm page is not. The brief explicitly unlocks gradient — we use it.

---

## C. Per-section bold spec

Section count: 11 (S1–S10 + footer).

### S1 — Hero (chat-as-product)

**What's wrong with shipped:** The chat is a thin bordered card floating on flat cream. No app-shell quality. The mockup reads as «illustration», not «product». Right-column receipt-system (DigestHeader + Chat + CitationChip) feels like three separate orphans glued together.

**Bold direction:** The hero becomes a **single beautiful chat-app surface, treated as the product itself, sitting in a soft atmosphere of teal-cream gradient wash**. The receipt-system collapses into one cohesive chat-app shell with a header bar (icon + «Provedo» + status), bordered message area with proper depth, typing indicator (3 dots), and an inline chart inside the answer that is itself craft-grade. The DigestHeader and CitationChip retire — their information moves INSIDE the chat shell as header status pill and below-message footer line. One unified surface, not three orphans.

**Specific visual moves:**
- **Background:** keep `#FAFAF7` page bg, but ADD a single soft radial gradient anchored top-right of the hero section: from `teal-50/0.6` at the anchor, fading to transparent over ~700px radius. Vercel-pattern, very low chroma, never overlapping the headline. This is the page's first signal of «this is a crafted surface».
- **Headline typography:** keep copy locked. Upgrade rendering: `font-feature-settings: 'ss01', 'cv11', 'ss03'` on Inter (stylistic alternates that improve the «P» and «g» glyphs); add `text-wrap: balance` for predictable line-breaks; subtle `letter-spacing: -0.025em` (currently -0.02 implied). No gradient text — Stripe-pattern is one word max and our headline isn't the right candidate.
- **Chat shell** (full spec in §D below).
- **Layout shift fix** (PO complaint «page jumps after typing»): reserve the chat shell's max-height upfront. The chat container gets a `min-height: 480px` (md+) / `min-height: 380px` (mobile) so the receipt fade-in does not push content below it. The current code uses `min-h-[320px]` on the aside but the typing fades cause progressive growth. Lock the inner article at fixed height (overflow handled — see §D).
- **CTA cluster:** primary `Ask Provedo` button stays, but treat with subtle hover-lift (translateY -1px + shadow deepen on hover). Secondary surface — a small ghost link «See how it works ↓» that smooth-scrolls to §S4. This replaces the dropped «Or start free forever» NavLink, keeps a visible second action, and resolves the «small print is the only secondary action» feeling.
- **Small-print:** PO says «No card. 50 free questions» feels weak. Move it INTO a small pill below the CTA: `[ ✓ No card · 50 free questions / month ]` rendered as a slate-100 pill, mono, 11px, slate-600. Treats the reassurance as a UI element instead of a footnote. Keep the copy verbatim — only the visual treatment changes.

**Mock description:**
```
HERO SECTION — backgrounded by soft top-right teal-cream radial wash

┌─ left col (max-w-xl) ───────────────────┐  ┌─ right col (max-w-[480px]) ──────┐
│                                          │  │  ┌─ ChatAppShell ──────────┐   │
│  Provedo will lead you through           │  │  │ ◉ Provedo · live        │   │
│  your portfolio.                         │  │  ├─ message area ──────────┤   │
│  [60px Inter 600, slate-900, balanced]   │  │  │           [user bubble] │   │
│                                          │  │  │  [Provedo bubble        │   │
│  Notice what you'd miss across           │  │  │   with mono tokens      │   │
│  all your brokers.                       │  │  │   + inline sparkline    │   │
│  [22px Inter 400, slate-600]             │  │  │   with gradient fill]   │   │
│                                          │  │  │                         │   │
│  [ Ask Provedo ]  See how it works ↓    │  │  │  ●●●  ← typing dots     │   │
│  [primary CTA]    [ghost link]           │  │  │                         │   │
│                                          │  │  ├─ sources footer ────────┤   │
│  ┌ ✓ No card · 50 free questions/mo ┐  │  │  │ Sources: AAPL · TSLA…   │   │
│                                          │  │  └─────────────────────────┘   │
└──────────────────────────────────────────┘  └──────────────────────────────────┘
```

**Keep from shipped:**
- Locked head/sub copy verbatim.
- `useTypingSequence` hook (the timing knobs work).
- `useInView` replay pattern.
- `usePrefersReducedMotion` fallback (full text rendered statically).
- Sources primitive.

**Retire from shipped:**
- DigestHeader (information absorbed into chat shell header).
- CitationChip (information absorbed into chat shell footer).
- Outer `<aside>` wrapper (replaced by single `<article>` chat shell).
- The current right-column 3-stack composition.

**Bundle estimate:** -1.5kB gz (DigestHeader + CitationChip components retired) +2kB gz (richer ChatAppShell wrapper + typing-dots + gradient defs) = **+0.5kB net**.

---

### S2 — Numeric proof bar

**What's wrong with shipped:** Boring grey divider strip with 4 cells, identical typography, identical weighting. PO called the dividers «скучные». Dividers between cells feel like a spec sheet.

**Bold direction:** **Bento-style proof row with one hero cell + three supporting cells, no vertical dividers**. The «Sources for every answer» cell becomes a teal-tinted card (the hero), the other three sit on warm-bg-muted with subtle hairline borders. Vertical rhythm broken intentionally; «sources» reads as the dominant claim, the other three as supporting evidence. Kill dividers.

**Specific visual moves:**
- Switch from `divide-x` strip to a 4-column CSS grid where cell #4 («Sources») spans visually wider feel via subtle teal-50 background tint (`background-color: rgba(13,148,136,0.04)`). The three other cells stay on `warm-bg-muted` `#F5F5F1`.
- Each cell: rounded-lg, 1px hairline border, p-6. Cell #4 hairline becomes teal-200 instead of slate-200 — visually pulls.
- Big number typography per cell: vary slightly. Cell #1 «Hundreds» stays Inter 500 (not mono — it's a word). Cells #2 «Every» and #3 «5 min» stay current. Cell #4 «Sources» becomes slate-900 (NOT teal-accent — accent moves to the cell-bg, not the number). The «forevery answer» eyebrow stays teal-600.
- Drop the disclaimer footer + audience-whisper from inside this section. Move them under §S1 hero (audience-whisper as a single line under the no-card pill) and under the proof bar respectively (disclaimer as a single italic line, max-w-md, centered, slate-500).
- Hover state on all 4 cells: subtle border deepens (slate-200 → slate-300; teal-200 → teal-300), 150ms ease.

**Mock description:**
```
┌──────────────────────────────────────────────────────────────────────────┐
│  warm-bg-muted strip (no top/bottom borders)                              │
│                                                                           │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌─────────────────┐      │
│  │ Hundreds  │  │  Every    │  │  5 min    │  │  Sources        │      │
│  │ brokers…  │  │ observ…   │  │ a week    │  │  for every…     │      │
│  │           │  │           │  │           │  │  ← teal-tint bg │      │
│  └───────────┘  └───────────┘  └───────────┘  └─────────────────┘      │
│                                                                           │
│         Information, not advice.   ← italic, slate-500, centered          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Keep from shipped:** All copy verbatim. ARIA `<dl><dt><dd>` semantics.

**Retire from shipped:** `divide-y / divide-x` dividers. Audience-whisper line moves up to S1. The 4-cell-grid replaces the divider strip.

**Bundle estimate:** **0kB** (CSS swap).

---

### S3 — Negation

**What's wrong with shipped:** Typographic single-column with em-dash bullets is too quiet. PO explicitly preferred the earlier table format. Reads as a list of disclaimers, not a positioning statement.

**Bold direction:** **Restore a 2-column comparison table — but craft it as a bento card pair with intentional visual contrast**. Left card «What Provedo is not» — slate-50 bg, slate-700 text, em-dash bullets in slate-400. Right card «What Provedo is» — warm-cream bg `#FAFAF7` lifted on a soft teal-tinted shadow, slate-900 text, plus-sign bullets in teal-600. The visual asymmetry IS the message: the left is a statement of what we're not (calmer, lower contrast); the right is what we are (richer, brighter, depth). Reads instantly without copy reading.

**Specific visual moves:**
- Two equal-width cards, gap-6, on a 2-column grid (md+). Mobile: stack vertically, «What Provedo is» FIRST on mobile (positive-led on small screens — the negation reads as supporting context, not opening statement).
- Right card depth: `box-shadow: 0 8px 24px rgba(13,148,136,0.08), 0 2px 4px rgba(13,148,136,0.04)` — teal-tinted shadow under the affirmation card. Subtle.
- Card heading typography: 12px JBM-mono uppercase + 0.1em tracking — keep as-is.
- Bullet glyphs: `—` in slate-400 (left), `+` in teal-600 (right). Keep mono.
- Section header: keep «This is what Provedo is not.» — but DEMOTE from h2 to small eyebrow above the cards: «POSITIONING» as 11px mono uppercase teal-600 eyebrow. The two cards together speak — no h2 needed.
- Add a subtle hairline horizontal divider above and below the section to seat it as its own beat.

**Mock description:**
```
                                  POSITIONING ←— eyebrow
                                  ────────

  ┌─ What Provedo is not ────┐    ┌─ What Provedo is ────────┐
  │ slate-50 bg, flat        │    │ cream bg, teal shadow    │
  │                          │    │                          │
  │ — A robo-advisor.        │    │ + A reader.              │
  │   Does not move money.   │    │   Holds across brokers.  │
  │                          │    │                          │
  │ — A brokerage.           │    │ + A noticer.             │
  │   Does not execute…      │    │   Surfaces what'd slip.  │
  │                          │    │                          │
  │ — Advice.                │    │ + A source-keeper.       │
  │   Does not tell you…     │    │   Every answer cited.    │
  └──────────────────────────┘    └──────────────────────────┘
```

**Keep from shipped:** All bullet copy. ARIA structure.

**Retire from shipped:** Single-column typeset layout. Center-aligned «This is what Provedo is not.» h2.

**Bundle estimate:** **0kB** (layout change only).

---

### S4 — Demo tabs

**What's wrong with shipped:** «Ask anything» intro copy reads cliché. Tab content is OK, charts are «отвратительные» (see §E for chart-specific rebuild). Tab UI itself is unstyled.

**Bold direction:** **Treat the demo block as a real product window** — a chat-app shell wrapper around the tab content, just like the hero, but bigger and with a 4-tab switcher built in. Each tab loads a different question + different answer + different chart. The whole block reads as «here's Provedo running on different questions». Section header lifts to «Four questions. Real answers.» — drops «Ask anything».

**Specific visual moves:**
- Section bg: subtle gradient wash — `linear-gradient(180deg, #FAFAF7 0%, #F5F5F1 100%)`. Section transitions warm→muted bottom-up. Differentiates from S3 cream.
- Section header: «Four questions. Real answers.» as h2, 36px Inter 500, slate-900, centered. Sub: «Pick one. Provedo answers from your real positions, with sources.» (16px Inter 400, slate-600, max-w-2xl).
- The 4 tabs themselves become a ProductTabBar component: pill-shaped tabs, slate-100 inactive, white active with teal-600 1px bottom-border indicator + subtle shadow. Tab labels: «Why?» / «Dividends» / «Patterns» / «Aggregate» (current labels — keep).
- Tab body sits inside a chat-shell wrapper identical to S1's ChatAppShell shape (header bar shows tab-label + status dot, message area below, sources line at bottom). The chart renders inside the Provedo answer bubble, just like the hero sparkline.
- Tab transitions: 200ms cross-fade, no slide (slide is busy on a static landing).
- Mobile: tabs become a horizontal-scroll snap row with shadow-edge fade indicating more tabs (current pattern is OK; verify scroll-snap).

**Keep from shipped:** Tab labels. All Lane-A-audited Tab 3 simultaneous-animation patches (CRITICAL — do not undo). Sources content per tab. Granola-grade content fidelity from prior synthesis.

**Retire from shipped:** «Ask anything» section header. Plain section-bg. Default-styled tab buttons.

**Bundle estimate:** +1kB gz (ProductTabBar component + ChatShell reuse).

---

### S5 — Insights (was «A few minutes a day»)

**What's wrong with shipped:** PO called this «скучные». Three identical white cards in a row with identical icons in identical teal-tint badges. No hierarchy, no visual differentiation. Reads as Bootstrap «features» grid.

**Bold direction:** **Asymmetric bento — one large hero card spanning 2/3 width, two smaller cards stacked in the remaining 1/3**. The large card carries the primary insight statement («Provedo holds context across every broker») with a small live-feeling animated mini-illustration (an SVG showing 3 broker logos pulsing in succession with a connecting line drawing between them — under 600ms, IntersectionObserver-triggered, draws once on entry, respects reduced-motion). The two small cards carry the other two bullets, each with a single distinctive micro-illustration (notification-stack-style for «surfaces what'd slip past», link-with-cite-glyph for «sources»). Each card gets a different bg tone — large card on warm-cream-elevated `#FFFFFF`, small cards on warm-bg-muted `#F5F5F1` — establishing intentional rhythm.

**Specific visual moves:**
- 12-column CSS grid, `gap-6`. Large card spans cols 1–8; small cards span cols 9–12 (stacked).
- Large card: white bg, p-10, rounded-2xl, shadow-lg with very low alpha (`0 16px 32px rgba(15,23,42,0.04), 0 4px 8px rgba(15,23,42,0.02)`).
- Small cards: warm-bg-muted, p-6, rounded-xl, no shadow, hairline border slate-200.
- Icon treatment: drop the lucide-icon-in-teal-tint-square pattern. Replace with custom inline SVG mini-illustrations sized 48×48 in slate-700 with one teal-600 accent stroke per illustration. Each illustration is hand-drawn for the bullet's idea — broker-graph for #1, notification-stack for #2, cite-link for #3.
- Hover state on all cards: 150ms ease border-deepen (slate-200 → slate-300) + 1px translateY -1px lift. Reduced-motion: no lift, only border.
- Section header: keep «A few minutes a day. Everything that moved.» — typography stays.

**Mock description:**
```
                          A few minutes a day. Everything that moved.
                                  [Inter 500 36px slate-900]
                          Provedo surfaces dividends, drawdowns…
                                  [Inter 400 16px slate-600 max-w-2xl]

  ┌─────────────────── Big card (cols 1–8) ──────────────────┐  ┌─ small (9–12) ─┐
  │  white bg · p-10 · rounded-2xl · shadow-lg                │  │ muted bg       │
  │                                                            │  │                │
  │  [48×48 multi-broker connection illustration]             │  │ [48×48 notif]  │
  │                                                            │  │                │
  │  Provedo holds context across every broker —               │  │ Provedo surf-  │
  │  knows what you own, what changed, where the deltas matter.│  │ aces what'd…   │
  │                                                            │  └────────────────┘
  │                                                            │
  │                                                            │  ┌─ small (9–12) ─┐
  │                                                            │  │ muted bg       │
  │                                                            │  │ [48×48 cite]   │
  │                                                            │  │ Provedo cites… │
  │                                                            │  └────────────────┘
  └────────────────────────────────────────────────────────────┘
```

**Keep from shipped:** Three bullet copies verbatim. Section heading copy. Sources mount under the bento (treated as a single line under the bento, max-w-md centered).

**Retire from shipped:** Equal 3-column grid. Lucide icons in teal-tint squares. Identical card treatment.

**Bundle estimate:** +0.8kB gz (3 hand-drawn SVG mini-illustrations inline) -0.2kB (lucide icons + duplicated card treatment removed) = **+0.6kB net**.

---

### S6 — Editorial mid-page (dark slate-900 full-bleed)

**What's wrong with shipped:** PO called this «скучные». The dark editorial section is the page's chance for visual maximalism but is currently text-only on flat slate-900 with one teal accent on the closer.

**Bold direction:** **Add atmosphere to the dark section** — a subtle teal radial-glow anchored bottom-right, a `noise()`-grain texture overlay at 0.02 alpha, and an oversized «Q» / quotation glyph anchored behind the body text in slate-800 (almost-invisible, 0.4 opacity, 280px JBM-mono) acting as editorial chrome. The closing line «You hold the assets. Provedo holds the context.» gets typographic upgrade — split onto two lines with the second line indented (editorial print convention), and the teal-on-«Provedo holds the context» becomes a soft gradient `linear-gradient(90deg, #14b8a6 0%, #2dd4bf 100%)` applied to the text via `background-clip: text`. ONE word-cluster gradient, Stripe-pattern.

**Specific visual moves:**
- Section bg: `#0F172A` page bg + radial gradient overlay anchored bottom-right `radial-gradient(circle at 100% 100%, rgba(20, 184, 166, 0.12) 0%, transparent 50%)`. Subtle.
- Add SVG noise texture overlay: inline `<svg>` with `<filter>` `feTurbulence` baseFrequency 0.9, opacity 0.02. Pure texture, no color shift.
- Decorative «Q» (or large `«` quote glyph): position absolute behind the body, 280px JBM-mono, color slate-800, opacity 0.5, top-right offset, `aria-hidden="true"`. Editorial-magazine pattern.
- Headline «One place. One feed. One chat.» — keep copy + scale + animation.
- Body paragraphs — keep copy + animation timing (800ms).
- Closer typographic upgrade:
    - Line 1: «You hold the assets.» — slate-50, italic, Inter 500, 32px.
    - Line 2: «Provedo holds the context.» — gradient-on-text via `background-image: linear-gradient(90deg, #14b8a6, #2dd4bf); -webkit-background-clip: text; background-clip: text; color: transparent;` + italic + 32px. Indent 32px from left.
- Sources line at bottom: keep, but lighten color to `#94A3B8` and reduce font-size to 13px (currently feels heavy).

**Mock description:**
```
┌──────────────────────────────────────────────────────────────┐
│ slate-900 bg + bottom-right teal radial-glow + noise grain   │
│                                                       ↘        │
│                                                                │
│  One place. One feed. One chat.                               │
│  [60px Inter 500 cream, scale-in]                              │
│                                                                │
│  Your portfolio lives in seven places…                        │
│  Your dividends arrive in three inboxes…                      │     ↘ ← faded
│  [22px Inter 400 slate-300]                                   │     ↘   «Q»
│                                                                │     ↘   glyph
│  Provedo holds it in one place…                               │     ↘   slate-800
│  [22px Inter 400 slate-300]                                   │     ↘   280px
│                                                                │
│         You hold the assets.                                  │
│              Provedo holds the context.  ← gradient text     │
│         [italic Inter 500 32px]                               │
│                                                                │
│  Sources: …                                                    │
└──────────────────────────────────────────────────────────────┘
```

**Keep from shipped:** All body copy. Closing line copy. Section heading. Animation timing on text fade-in.

**Retire from shipped:** Solid teal-on-text closer (replace with gradient). Empty visual texture (add atmosphere).

**Bundle estimate:** +0.4kB gz (inline noise SVG + decorative glyph SVG + gradient defs).

---

### S7 — Testimonials

**What's wrong with shipped:** Pre-alpha — single Roman M. quote in a card. PO concern is real: showing a single quote labeled «builder at Provedo» when there are no real users yet feels thin and slightly performative.

**Bold direction (PD recommendation):** **Hide this section entirely until alpha** — it pre-loads social-proof expectations the product cannot back. Replace with a thin «Built by …» strip that names the builder ICP honestly: a single line under §S6 reading «Built by investors who hold across more than one broker.» — lifts the audience-whisper into a builder-attribution role. No card, no quote, no «Coming Q2 2026» pill that signals «we don't have these yet but…».

This change:
- Removes a visually weak surface (tested low even in synthesis — single quote feels thin).
- Removes pre-alpha awkwardness.
- Strengthens the audience-whisper («for investors who hold across more than one broker») by giving it a second mention role.
- Reduces vertical scroll by ~700px.
- Reduces bundle.

If PO insists on keeping a testimonial slot for v5: hold the spec at single-card current shape, but only render after Q2 2026 alpha quotes land. Until then, hide via `process.env.NEXT_PUBLIC_TESTIMONIALS_ENABLED` flag default false. **My recommendation is full hide for v5.**

**Keep from shipped:** ProvedoTestimonialCards component file (kept dormant for post-alpha re-enable). Featured quote constant.

**Retire from shipped:** Section render in `page.tsx`. The «Coming Q2 2026» pill. The «builder at Provedo» line — replaced by the new «Built by investors…» strip beneath §S6.

**Bundle estimate:** **-3kB gz** (component + Sources mount + figcaption logic not rendered).

---

### S8 — Aggregation (broker list)

**What's wrong with shipped:** PO explicitly said «идея с каруселью была лучше» — preferred the carousel over the typeset list. The current static 3-column grid of broker abbreviations is calm but reads as «list of supported integrations», not as proof. PO is right.

**Bold direction:** **Restore a carousel — but build it as a two-row, opposite-direction marquee with broker WORDMARKS in mono, not abbreviations**. The two rows scroll in opposite directions at slow speed (~40s per loop), creating a calm rhythm. Each broker name renders in slate-600 JBM-mono 16px with a subtle 1px hairline border around it (pill-shape). On hover (entire row), animation pauses. Reduced-motion: marquee freezes, rows stack into the current 3-column grid. The original PO win was the carousel feel; we restore it but make it crafted.

**Specific visual moves:**
- Two rows, ~80px tall each, 32px gap between rows.
- Row 1: scrolls left-to-right. Row 2: scrolls right-to-left.
- Each row contains the broker list duplicated 3× to fill viewport seamlessly.
- Each broker rendered as: `┌── Interactive Brokers ──┐` style pill — JBM-mono 16px, slate-600, 1px slate-200 border, rounded-full, px-4 py-2.
- Section bg: warm-bg-page `#FAFAF7`. Edge fades: left and right 64px gradient masks fade to bg-color, hiding the raw start/end of the loop.
- Section header: keep «One chat holds everything.» + sub.
- Trailing line «— and growing» becomes a single italic line below the marquee, slate-500.
- `prefers-reduced-motion`: marquee animation paused at start position; the same pill list renders as a 4-row static wrap with full broker names.
- Hover: `animation-play-state: paused` on the row.
- Implementation: pure CSS keyframes `@keyframes marquee-ltr / marquee-rtl`, `transform: translateX()`, will-change: transform. Compositor-friendly.

**Mock description:**
```
                         One chat holds everything.
                  Hundreds of brokers and exchanges, in one place…

← edge fade ← [IBKR][Schwab][Fidelity][Coinbase][Robinhood][E*TRADE][T212][Binance]…
                                                                                       → row scrolls →

→ edge fade → [Kraken][HL][Wealthsimple][Questrade][IBKR][Schwab][Fidelity][Coinbase]…
                                                                                       ← row scrolls ←

                                — and growing
```

**Keep from shipped:** Section header copy. Broker name list (expand abbreviations to full names, e.g. «IBKR» → «Interactive Brokers» — better visual density).

**Retire from shipped:** Static 3-column grid of abbreviations. The original v3 marquee was apparently dropped in slice-LP3.5 — restore but better.

**Bundle estimate:** +0.5kB gz (CSS keyframes + edge-fade CSS) -0.1kB (current grid CSS).

---

### S9 — FAQ

**What's wrong with shipped:** Functional but visually a flat-list of details/summary. No hierarchy. The accordion chevron is the only interactive feel.

**Bold direction:** **Keep the accordion structure, but treat it as a magazine-style two-column layout on md+ — left column anchors a contextual eyebrow + section heading; right column holds the accordion**. Within the accordion, give each question a subtle hover-state (background warm-bg-subtle, slate-200 border deepen). The heading «Questions you'd ask» becomes friendlier in the left column with a small intro line «If you're wondering, you're not the first.» (Lane-A-clean — observation-coded, not advice).

**Specific visual moves:**
- 12-col grid on md+, gap-12. Left col cols 1–4 sticky-position from top of section (Apple/Stripe documentation pattern). Right col cols 5–12 contains the accordion.
- Left col: small mono eyebrow «FAQ» (teal-600 11px uppercase) + h2 «Questions you'd ask» (36px Inter 500 slate-900, balanced). Below: «If you're wondering, you're not the first.» (16px Inter 400 slate-500). On scroll, the left col stays in view as the right col scrolls — quiet sticky behavior.
- Right col: accordion items. Each row: hover bg warm-bg-subtle. Question (slate-900 17px Inter 500). Answer (slate-600 15px Inter 400 lh 1.6). Chevron stays slate-400 default, teal-600 on focus.
- Mobile (<768px): left col collapses above right col, no sticky. Standard stack.
- A11y: native details/summary preserved. Keyboard works as-is.

**Keep from shipped:** All FAQ questions/answers verbatim. Native details/summary. Focus styling. The detail content order.

**Retire from shipped:** Centered-only layout. Only-h2 header treatment.

**Bundle estimate:** **0kB** (CSS layout only).

---

### S10 — Pre-footer CTA

**What's wrong with shipped:** PO called the «two CTAs in a row» (S10 dark + footer waitlist box) «максимально тупо». Two ask-the-product CTAs back-to-back is redundant. Both currently read «Open Provedo» / «Ask Provedo» — the user can't tell which is the primary.

**Bold direction:** **Drop the footer waitlist box entirely. S10 is the page's last visual + conversion moment; let it carry the weight alone.** Keep S10's dark editorial slate-900 section, upgrade its visual craft to match S6's atmosphere upgrade (radial-glow + noise + decorative glyph), and let the footer below it be purely chrome (logo, nav, disclaimer — no CTA). Removes the redundancy PO flagged. Removes one component. Strengthens S10's role as the pre-footer commitment moment.

**Specific visual moves:**
- Section bg: `#0F172A` + bottom-right teal radial-glow (matched to S6 — visual rhyme intentional). Add same noise overlay.
- Add a decorative giant teal arrow `↘` as background glyph (slate-800 0.4 opacity, 240px JBM-mono, top-right) signaling «next step» without the page literally writing «next step».
- Headline «Open Provedo when you're ready.» — keep copy, upgrade rendering. Wrap onto two lines: «Open Provedo» / «when you're ready.» with second line indented and italic. Same italic-second-line treatment as S6 closer for visual rhyme.
- Single primary CTA `Ask Provedo` — keep. Add subtle ambient teal glow underneath the button (`box-shadow: 0 0 40px rgba(13,148,136,0.15)`) — small, not Robinhood-flashy.
- Keep the small-print «No card. 50 free questions a month. Or see Plus pricing →».

**Keep from shipped:** Headline copy. Primary CTA copy. Small-print copy. Dark slate-900 register.

**Retire from shipped:** Default plain treatment. Footer waitlist BOX (not the footer itself — see footer spec).

**Bundle estimate:** +0.3kB gz (atmosphere CSS + glyph) -0.5kB (footer waitlist box removed). Net **-0.2kB**.

---

### Footer

**What's wrong with shipped:** The waitlist box at top of footer creates the «two CTAs in a row» problem PO flagged. Footer reads OK but lacks visual separator from S10 above it (both flow as if one section).

**Bold direction:** **Strip footer to chrome only — logo, nav, disclaimer, copyright**. Add a clear top-edge visual separator (1px slate-200 border + 32px padding-top) so footer sits as its own beat below the dark S10. Keep the 3-layer disclaimer pattern verbatim (legal lock). Improve typography hierarchy — the «Provedo» logo word becomes the visual anchor (32px Inter 500 slate-900 with subtle teal underline accent), nav links become smaller and right-aligned, disclaimer takes its own block at bottom.

**Specific visual moves:**
- Drop the entire `<div>` waitlist-box at top of footer (lines 24–43 of current footer).
- Footer bg: warm-bg-page `#FAFAF7`. Top border: 1px slate-200, padding-top 48px.
- Top row: left = «Provedo» wordmark (32px Inter 500 slate-900, with `border-bottom: 2px solid var(--provedo-accent)` only under the «P» — single-letter brand-mark detail), right = nav links (Pricing, Sign in, Disclosures — slate-500 14px hover slate-700, gap-6).
- Bottom row: «© 2026 Provedo» on left, copyright + tagline-rhyme «Notice what you'd miss.» as small italic line on right (slate-400 12px italic) — quiet brand-rhyme moment.
- 3-layer disclaimer block: KEEP exact copy and structure. Place between top-row and bottom-row. Layer 1 plain-language summary (slate-600 13px). Layer 2 expandable details/summary (slate-500 13px label). Layer 3 link to /disclosures (teal-600 12px).
- Spacing: section separator (1px hairline) between top row and disclaimer; another between disclaimer and bottom row.

**Keep from shipped:** All disclaimer copy verbatim (legal lock). 3-layer pattern. Native details/summary. Copyright.

**Retire from shipped:** Waitlist box (entire `<div className="mb-8 rounded-xl border…">` block).

**Bundle estimate:** -0.5kB gz (waitlist box markup + ProvedoButton import + waitlist-CTA copy removed) +0.2kB (small typography enhancements + tagline-rhyme line).

---

## D. Hero chat shell — extra detail

This is the «ставка на чат» surface. Below is the full chat-app shell spec frontend implements directly.

### D.1 Container chrome

**Component name:** `ChatAppShell` (new, replaces the receipt-system aside).

**Outer shape:**
- Width: `max-w-[480px]` (md+) / `100%` (mobile).
- Min-height (LOCKED for layout-shift fix): `480px` md+, `380px` mobile.
- Border radius: `rounded-2xl` (16px).
- Border: 1px solid `var(--provedo-border-subtle)` (slate-200).
- Shadow: `0 24px 48px rgba(15, 23, 42, 0.08), 0 8px 16px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(15, 23, 42, 0.02)` — three-layer depth (deep, mid, hairline-light).
- Background: `var(--provedo-bg-elevated)` (`#FFFFFF`).
- Optional outer atmospheric glow (very subtle): `0 0 80px rgba(13, 148, 136, 0.05)` at the wrapper level.

### D.2 Header bar

Top of the shell, height 48px, `border-bottom: 1px solid var(--provedo-border-subtle)`.

Layout:
```
┌─ 48px header bar ─────────────────────────────┐
│  ◉  Provedo                          ● live    │
│  ↑   ↑                               ↑         │
│  Avatar  Title                       Status    │
└────────────────────────────────────────────────┘
```

- Avatar: 24×24 circle, teal-600 bg, white «P» letter inside (Inter 600, 12px). Or — preferred — a custom 4-color SVG mark (small abstract circle-with-arrow glyph, max 24×24, in teal). Sits at left, ml-4.
- Title «Provedo»: 14px Inter 500 slate-900, ml-3 from avatar.
- Status pill on right: small green dot (`#10B981`, 6px) + «live» (11px Inter 500 slate-500), mr-4. Says «Provedo is online + responsive», doesn't claim anything Lane-A-risky.
- The header bar absorbs the previous DigestHeader's «session label» role.

### D.3 Message area

Inside the shell, below header. Padding `p-5` (20px all sides), `display: flex`, `flex-direction: column`, `gap: 16px`.

**User bubble (right-aligned):**
- max-width 85%, align-self: flex-end.
- Background: `var(--provedo-bg-subtle)` (`#F1F1ED`) — warm-light on warm-bg.
- Color: `var(--provedo-text-secondary)` (slate-700).
- Padding: `px-4 py-3`.
- Border-radius: `rounded-2xl rounded-tr-md` (16px / 16px / 6px / 16px) — chat-bubble corner-cut on the «origin» side.
- Font: 14.5px Inter 400, line-height 1.5.
- The typing-cursor stays visible during typing. The current TypingCursor primitive works — keep.

**Provedo bubble (left-aligned):**
- max-width 100% (the response is the focus).
- align-self: flex-start.
- Background: `#FFFFFF`. NOT subtle — pure white, contrasting with the user bubble's tint.
- Border: 1px solid `var(--provedo-border-subtle)`.
- Color: `var(--provedo-text-primary)` (slate-900).
- Padding: `px-4 py-3.5`.
- Border-radius: `rounded-2xl rounded-tl-md` — mirror corner-cut.
- Font: 14.5px Inter 400, line-height 1.6.
- The «Provedo» author label moves OUT of the bubble (was inside as eyebrow); replaced by a small 16×16 avatar anchored at top-left of the bubble (mt-1 ml-1, then bubble shifts right by 24px). Think of how Cursor, Lovable, Claude.ai chat surface positions avatars.
- Author micro-label «Provedo» (11px Inter 500 teal-600 uppercase) appears ABOVE bubble, mb-1.5 — keep current pattern, current copy.

### D.4 Typing indicator (3 dots)

When `phase === 'response'` AND no characters yet revealed (i.e. 0 < t < first reveal), render 3 dots in place of the bubble content. After first character, the dots disappear and typing starts.

- Three circles, each 6×6px, slate-400 fill, gap-1.5 between.
- Animation: `@keyframes typing-dot { 0%, 60%, 100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-2px); } }`.
- Per-dot animation-delay: 0ms / 150ms / 300ms.
- Animation-duration: 1.2s, animation-iteration-count: infinite.
- Reduced-motion: render dots at static opacity 0.6, no movement.
- ARIA: `aria-hidden="true"` (the bubble container's `aria-live="polite"` already announces the eventual text).

Implementation: render this as the first 200ms of `phase === 'response'` (between the user-bubble pause-end and the first revealed character). It bridges the «empty bubble appears» → «text starts streaming» transition with chat-app feel.

### D.5 Sources block treatment

Below the response text, when `phase === 'done'`, the Sources primitive renders as currently — but now sits inside a subtle internal divider:

- 1px slate-100 hairline above the Sources line, mt-3 pt-3.
- Sources items: keep current Sources component shape.
- Sources fade-in: 240ms ease-out, current.

The whole Sources block sits BELOW the chart sparkline (re-ordered: chart first as the «answer artifact», sources second as the «provenance»).

### D.6 Inline P&L sparkline (chart upgrade)

Currently the InlinePnlSparkline is a simple polyline + 2 dots + −4.2% label. Below is the craft-upgrade.

**New visual:**
- viewBox `0 0 240 64` (taller than current 36 — gives the chart room to breathe).
- Background: subtle baseline area gradient — a `<linearGradient>` from `var(--provedo-accent)` at 0.18 alpha (top) to 0 alpha (bottom). Filled `<path>` underneath the polyline.
- Polyline: 2px stroke, `var(--provedo-accent)` (teal-600), `stroke-linecap: round`, `stroke-linejoin: round`.
- 0% baseline: dashed slate-200 0.5px line.
- The two emphasis dots (AAPL drop, TSLA drop): 4px radius, `var(--provedo-negative)` red, with a 1px white halo (`stroke="white" stroke-width="1.5"`).
- End-label `−4.2%`: 14px JBM-mono semibold, `var(--provedo-negative)`, anchored at the right end of the line, pulled down 4px below the line.
- Above the chart, a 3-line micro-legend-pill: `[ AAPL · 2025-10-31 ]` and `[ TSLA · 2025-10-22 ]` — small slate-100 pills, 11px JBM-mono, slate-700, that visually anchor the dots to dates.

**Animation (when `phase === 'done'`):**
- Phase 1 (0–500ms): area gradient fade-in (opacity 0 → 1) AND polyline draw (`stroke-dasharray` ↔ `stroke-dashoffset` 0).
- Phase 2 (500–650ms): two emphasis dots scale-in (`transform: scale(0) → scale(1)`, `cubic-bezier(0.34, 1.56, 0.64, 1)`).
- Phase 3 (600–800ms): −4.2% end-label fade-in (opacity 0 → 1).
- Reduced-motion: full visual rendered statically, no transitions.

**Bundle:** +0.6kB gz (gradient defs + extra path + legend pills).

### D.7 Layout-shift fix

The PO complaint «page jumps after typing» is caused by the chat container's content growing as bubbles fade in. Fix:

- Lock `min-height: 480px` (md+) / `min-height: 380px` (mobile) on the message area `<div>`.
- The user bubble is fixed-height (one line). The Provedo bubble grows with text — but the OUTER message area pre-reserves the final height.
- Calculate: estimated final response height with chart = ~340px. Add user bubble 50px + sources 30px + chart 80px + gaps ~40px = ~440px content. Lock 480px (40px breathing).
- During typing, the bubble itself grows; the surrounding container does NOT. No layout shift on the page.
- Test target: CLS < 0.05 on hero (currently passing per shipped test suite — keep passing).

### D.8 Keyboard + a11y

- Whole `ChatAppShell` is a single landmark: `<article aria-label="Provedo demo conversation">`.
- ARIA: `aria-live="polite"` on the response bubble container (current pattern — keep).
- Header status pill: `role="status"` with `aria-label="Provedo is online"`.
- Reduced-motion: full conversation rendered immediately with no typing.
- Tab focus: skip the demo (decorative). Non-interactive.

---

## E. Chart visual language — system spec

Four demo-tab charts need the craft upgrade. Below is the system spec — common visual language across all four, then per-chart deltas.

### E.1 Common visual language (applies to all 4 charts)

**Color application:**
- Primary line / bar / accent: `var(--provedo-accent)` (teal-600).
- Negative emphasis: `var(--provedo-negative)` (red-600), used ONLY on dropdowns / sells / losses, with 1px white halo around fills.
- Positive emphasis: `var(--provedo-positive)` (emerald-600).
- Baseline / grid: slate-200 0.5px dashed.
- Text labels: JBM-mono only, color hierarchy slate-700 (primary) / slate-500 (secondary) / slate-400 (axis).

**Gradient fills (NEW — unlocked by mandate):**
- Every area-fill chart uses a vertical linear gradient from accent-color@0.18 alpha (top) to 0 alpha (bottom). One gradient stop, no chroma shift.
- No cross-color gradients (no purple→pink etc., per §0.1).

**Typography weights:**
- Headline numerals (the chart's «hero number» — −4.2%, $312, 58%, etc.): 20–24px JBM-mono semibold (600).
- Inline tokens (tickers, dates): 12px JBM-mono regular.
- Axis labels: 11px JBM-mono, slate-400.
- Captions / source-tied micro-text: 11px Inter italic, slate-500.

**Motion timing (5-rule budget — preserved):**
- Total entrance ≤ 600ms per chart.
- Compositor-friendly properties only (`opacity`, `transform`, `stroke-dashoffset` for SVG line draws).
- Respects `prefers-reduced-motion`: render full state immediately.
- Chart entrance triggered by IntersectionObserver, `threshold: 0.3`.
- One coherent sequence per chart: 0–500ms primary geometry reveal, 500–650ms emphasis points, 600–800ms hero-number label.

**Axis treatment:**
- Drop full grid-lines. Only the 0% baseline is rendered as a dashed slate-200 line.
- X-axis: only first + last tick label shown.
- Y-axis: no axis line, only inferred from the dashed baseline.
- Result: minimal chrome, maximum focus on the data shape.

**Container chrome (when chart sits inside a chat bubble — Tab-block + Hero):**
- Optional: render a subtle 1px slate-100 hairline border around the chart's bounding box, with `rounded-md` corners and 8px internal padding. Treats the chart as a «card-within-a-card». Optional — apply only when the chart needs visual separation from surrounding text. Default: no border (current).

### E.2 Per-chart deltas

#### Tab 1 — PnlSparkline (the chat-inline chart)

Already specced in §D.6 above — that's the canonical version. The standalone Tab 1 chart matches it 1:1 visually but at larger viewBox `0 0 360 140` (full-tab scale).

Same spec as §D.6 plus:
- Add a small mono pill above the chart: `30 days · Schwab · IBKR` (11px JBM-mono slate-500) — anchors the time-window and broker scope.
- The hero number `−4.2%` rises to 28px JBM-mono semibold.

**Bundle:** +0.5kB gz beyond hero variant (extra chrome + larger viewBox math).

#### Tab 2 — DividendCalendar

**Current state:** 3-month grid with dots placed on dates, $312 hero number above.

**Craft upgrade:**
- Each cell: 28×24 currently — keep.
- Cell borders: 0.5px slate-100 currently — UPGRADE to 1px slate-200 with subtle `border-radius: 2px` (cell rounded micro-corners). Mercury-pattern.
- Dividend dots: currently flat circles. UPGRADE to teal-tinted gradient-filled circles: `<radialGradient>` from teal-600 (center) to teal-400 (edge), with 0.5px white outer ring. 6px radius (was 4-5px).
- Above each dot, the ticker + amount label: stacked layout, `KO` (12px JBM-mono semibold slate-700) on top, `$87` (11px JBM-mono slate-500) below. Currently inline — restack vertically.
- Hero number `$312 expected this quarter`: keep, but render with subtle teal underline accent (1px teal-600 underline only under «$312», not the whole phrase).
- Animation:
    - 0–250ms: grid + month labels fade in (current).
    - 250–500ms: 3 dots scale-in simultaneously with overshoot easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`, 250ms duration each).
    - 500–700ms: ticker+amount labels fade-in above each dot (staggered 60ms per dot).
- Add a subtle pull-quote-style line below the calendar: «$222 of $312 from KO + VZ + MSFT.» — 13px Inter italic slate-500. Anchors the «which dividends matter» reading.

**Bundle:** +0.4kB gz (radialGradient defs + label restack + summary line).

#### Tab 3 — TradeTimeline (LEGAL-LOCKED simultaneous animation)

**CRITICAL CONSTRAINT:** The simultaneous-animation pattern is a legal-advisor lock from commit `8cb509b`. All sell-points + recovery-marks + connectors MUST appear simultaneously. No sequential reveal that implies «you sold here, then this happened». Frontend MUST preserve the simultaneous trigger at `setTimeout(() => setMarksRevealed(true), 0)` or equivalent.

**Craft upgrade WITHIN that constraint:**
- Sell-point triangles (▼): UPGRADE from flat `var(--provedo-negative)` fill to `<linearGradient>` red-600 → red-700 (90deg vertical). Adds depth without color shift.
- Recovery-after marks: currently small grey circles. UPGRADE to small slate-500 circles with 2px slate-200 outer ring (small target-symbol look). Slightly larger (5px from 4px).
- Connector dotted lines between sells and recoveries: keep dashed, but UPGRADE to slate-300 from current default. Slightly visible.
- Axis line: keep slate-200 1px.
- Time labels (Jan, Mar, May…): keep 11px JBM-mono slate-400.
- Hero label (replaces empty space top of chart): «3 sells · 8-week recovery window after each.» (12px JBM-mono slate-700, top-left). Gives the chart a one-line summary without implying «you should not have sold».
- Lane-A disclaim line at bottom: «Provedo notices — no judgment, no advice.» (current, KEEP — locked).
- All marks fade in simultaneously at t=0, full motion budget for the simultaneous reveal is 200ms (transform: scaleY(0)→scaleY(1) with overshoot easing). Disclaim fades at t=600ms (current).

**Bundle:** +0.2kB gz (linearGradient defs + summary line).

#### Tab 4 — AllocationPieBar (comparison bars, slice-LP3.5)

**Current state:** Two horizontal segmented bars (your portfolio vs S&P 500), with segment labels inside each segment.

**Craft upgrade:**
- Bar height: 24px currently — UPGRADE to 32px (taller bars read more chart-grade, less footnote-grade).
- Bar background: `var(--provedo-bg-subtle)` currently — UPGRADE to `var(--provedo-bg-page)` with 1px slate-200 outer border + `rounded-md` (gives the bar a defined «track» container).
- Segment fills: currently flat color blocks. UPGRADE to subtle gradient fills — each segment gets `<linearGradient>` from base-color at 1.0 alpha (top) to base-color at 0.85 alpha (bottom). Adds depth, preserves color identity.
- Segment labels inside segments: keep current contrast logic (Slice-LP3.7-A WCAG fix). Upgrade font-weight to 500 across the board for readability at the new bar height.
- The tech-segment-headline number («Tech 58%» / «Tech 28%»): UPGRADE to 16px JBM-mono semibold (was 13px). Make it the chart's hero number.
- Bar entrance: current width animation 500ms cubic-bezier(0.16,1,0.3,1) — KEEP. Stagger between bars (150ms) — KEEP. Total entrance budget — KEEP within 600ms.
- After bars settle, the «Provedo notices: Your tech weight is about 2× the index's — driven by IBKR.» italic line — KEEP, but UPGRADE styling to render slightly larger (15px from 14px) with a small teal-600 left-border (`border-left: 2px solid var(--provedo-accent); padding-left: 12px;`) — pull-quote treatment, marks it as Provedo's voice within the chart.
- Ledger rows below: keep current layout but render row borders as subtle `border-bottom: 1px dashed var(--provedo-border-subtle)` for visual rhythm.

**Bundle:** +0.4kB gz (gradient defs + pull-quote border + dashed row separators).

### E.3 Total chart bundle delta

Sum of per-chart deltas: 0.5 + 0.4 + 0.2 + 0.4 + 0.6 (hero variant) = **+2.1kB gz across all 5 chart instances** (4 demo tabs + 1 hero inline).

---

## F. Specific PO complaints — explicit answers per item

### F.1 Hero «page jumps after typing»

**Answer:** Layout-shift fix specced in §D.7. Lock `min-height: 480px` on the message area; pre-reserve final content height. CLS target < 0.05.

### F.2 «No card. 50 free questions»

**Answer:** Keep copy verbatim (it's reassurance, drops cleanly, Lane-A clean). Visual treatment changes — render as a slate-100 pill below CTA instead of as small-print plain text. Pill treatment lifts it from «footnote» to «UI affordance».

### F.3 S2 dividers (PO «скучные»)

**Answer:** Drop dividers entirely. Replace with bento-style 4-cell row, cell #4 (Sources) carries a teal-tinted bg as the hero cell, other 3 sit on muted-bg with hairline borders. Specced in §C.S2.

### F.4 S3 negation — restore table format vs stay typographic vs new direction

**Answer:** Restore 2-column table — but craft it. Left card («not») on slate-50 flat; right card («is») on warm-cream lifted with teal-tinted shadow. Asymmetric depth IS the message. Specced in §C.S3.

### F.5 S4 «Ask anything» intro copy

**Answer:** Drop «Ask anything». Replace with «Four questions. Real answers.» as h2. Sub: «Pick one. Provedo answers from your real positions, with sources.» Both Lane-A clean (descriptive, no advice).

Alternatives considered:
- «Watch Provedo work.» — Magician-strong but feels demo-show-off.
- «Four answers Provedo finds in your positions.» — used in prior synthesis; passive and slightly long. The chosen version is tighter.

### F.6 S5 + S6 «скучные»

**Answer S5:** Asymmetric bento — large card 2/3 width with hand-drawn SVG mini-illustration, two smaller cards 1/3 width stacked, different bg-tone treatments per card. Specced in §C.S5.

**Answer S6:** Atmosphere upgrade — add bottom-right teal radial-glow, noise grain overlay, decorative «Q» glyph background, gradient-on-text closer treatment, italic-second-line typography. Specced in §C.S6.

### F.7 S7 testimonials pre-alpha

**Answer (PD recommendation):** **Hide section entirely until alpha.** Replace with a single «Built by investors who hold across more than one broker.» line beneath §S6 closer. No card, no quote, no «Coming Q2 2026» pill. Specced in §C.S7.

If PO insists on retaining: gate by `process.env.NEXT_PUBLIC_TESTIMONIALS_ENABLED` flag default false. Component file kept dormant for post-alpha re-enable.

### F.8 S8 marquee carousel — restore, rework, or replace

**Answer:** **Restore — but craft it.** Two-row opposing-direction marquee with broker WORDMARKS (not abbreviations) in mono pills. Slow ~40s loops. Edge fades on left + right. Hover pauses. Reduced-motion freezes to current grid layout. Specced in §C.S8. PO is right that the carousel was the better idea — we restore it with craft.

### F.9 S9+S10 CTA dedupe

**Answer:** **Drop the footer waitlist box entirely.** S10 is the page's pre-footer commitment moment; let it carry alone. Footer becomes chrome-only (logo, nav, disclaimer). Removes the «two CTAs in a row» problem. Specced in §C.S10 + §C.Footer.

S10 itself gets the same atmosphere upgrade as S6 (radial-glow + noise + decorative arrow glyph) — visual rhyme intentional, signals «end of page is craft-grade just like the editorial mid-page».

### F.10 Footer visual separator + content polish

**Answer:** 1px slate-200 top border + 48px padding-top to seat footer as its own beat below the dark S10. Promote «Provedo» wordmark to 32px Inter 500 with single-letter teal-accent underline detail. Add small italic «Notice what you'd miss.» tagline-rhyme line on the right of the bottom row. Disclaimer 3-layer pattern preserved verbatim. Specced in §C.Footer.

---

## G. Mobile (320 / 768)

The visual richness scales down without losing identity. Below — what collapses, what stays, how each section adapts.

### G.1 Hero (mobile)

- Text column stacks above chat shell (already current behavior).
- Headline drops from `text-6xl` (60px) to `text-4xl` (36px). `text-wrap: balance` keeps line-breaks tight.
- Sub stays 18px.
- Chat shell goes full-width with `min-height: 380px`. The 3-line answer + chart fits.
- Header bar in chat shell: keeps avatar + title + status; no shrinkage needed.
- Background gradient atmosphere: render at 40% intensity on mobile (smaller viewport = less atmosphere needed; preserve battery + perf).
- The «No card» pill stays.

### G.2 Proof bar (mobile)

- 4 cells stack vertically (1 column).
- Cell #4 (teal-tinted Sources) keeps its tint — visually distinct from the other 3.
- Spacing between cells: `gap-3` (was `gap-6` desktop).

### G.3 Negation 2-card (mobile)

- Cards stack vertically.
- ON MOBILE: «What Provedo IS» renders FIRST (positive-led on small screen — the negation reads as supporting context, not opening). On desktop, left-to-right reading order is «not» then «is»; mobile inverts.
- Card depth (teal shadow on the «is» card) preserved.

### G.4 Demo tabs (mobile)

- Tabs become horizontal-scroll with snap (current pattern).
- Edge-fade indicator on right of tab bar (subtle gradient mask) signals more tabs.
- Tab content (chat-shell wrapper) goes full-width.
- Charts inside each tab keep their viewBox; SVG width 100% scales naturally.

### G.5 Insights bento (mobile)

- 12-col grid collapses to 1-col.
- Large card stays first, full width.
- Two small cards stack below.
- Card padding reduces from `p-10` to `p-6` on the large card; `p-6` to `p-5` on the small cards.
- Mini-illustrations stay at 48×48 (don't shrink — they're the visual anchor).

### G.6 Editorial dark (mobile)

- Section padding reduces (`6rem → 4rem` top/bottom — already in clamp).
- Decorative «Q» glyph: render at 160px instead of 280px (still atmospheric, doesn't dominate).
- Gradient-text closer: lines stack with same italic + indent treatment.

### G.7 Aggregation marquee (mobile)

- Two-row marquee KEEPS the two-row pattern.
- Pill width unchanged.
- Animation duration reduced to ~30s per loop (smaller viewport = faster perceived loop without speeding visuals).
- Reduced-motion fallback: 4-row wrapped grid (not 3-col) — full broker name pills wrap as needed.

### G.8 FAQ 2-col sticky (mobile)

- Left col (heading + intro) collapses above right col (accordion).
- Sticky behavior disabled on mobile (would feel like overflow).
- Accordion items: full width, same hover-state.

### G.9 Pre-footer S10 (mobile)

- Headline drops from 48px to 32px.
- Decorative arrow glyph: 160px instead of 240px.
- CTA stays full-width centered.
- Ambient teal glow under button: keep at full intensity (it's small).

### G.10 Footer (mobile)

- Top row stacks: «Provedo» wordmark first, nav links second below.
- Bottom row stacks: copyright above tagline-rhyme.
- Disclaimer block: full-width, padding-x reduces to 16px from desktop's 0.

### G.11 320 specifically

- All max-width constraints already use `clamp()` or equivalent — verified rendering down to 320px in current implementation.
- The chat-shell at 320px: avatar + title visible in header; `live` status pill may truncate to dot-only at <360px (label hides via `@media`).
- Marquee pills: minimum width = «IBKR» (24px) + padding (32px) = 56px per pill — fits comfortably.
- Bento large card: padding reduces to `p-5` at 320px.

---

## H. Effort estimate

Per-section product-designer (PD) follow-up + frontend-engineer (FE) implementation hours.

| Section | PD hours | FE hours | Notes |
|---|---|---|---|
| S1 Hero (chat-app shell rebuild + atmosphere) | 4 | 12 | Largest single change; new ChatAppShell component, typing-dots, layout-shift lock, gradient atmosphere, sparkline chart upgrade, retire DigestHeader + CitationChip |
| S2 Proof bar (bento) | 1 | 2 | CSS layout swap + teal-tint cell |
| S3 Negation (2-card with shadow asymmetry) | 1 | 3 | Restore 2-col grid, mobile reorder, shadow detail |
| S4 Demo tabs (chat-shell wrapper, ProductTabBar) | 3 | 8 | Reuse ChatAppShell from S1, new tab-bar pill component, section-bg gradient |
| S5 Insights (asymmetric bento + 3 inline SVG illustrations) | 4 | 5 | Three custom mini-illustrations are PD work (can be authored as inline SVG paths) |
| S6 Editorial (atmosphere + gradient-text closer + glyph) | 2 | 3 | Radial-glow CSS, noise SVG inline, gradient-text fallback for unsupported browsers |
| S7 Testimonials (HIDE) | 0.5 | 0.5 | Just stop rendering; component dormant. Add «Built by…» line under S6 |
| S8 Aggregation (two-row marquee restore) | 1.5 | 4 | Pure CSS keyframes, edge-fade masks, hover-pause, reduced-motion fallback |
| S9 FAQ (2-col sticky magazine) | 1 | 3 | CSS grid + sticky positioning + hover bg on rows |
| S10 Pre-footer CTA (atmosphere + arrow glyph) | 1 | 2 | Reuse atmosphere from S6 |
| Footer (chrome-only + tagline-rhyme + wordmark) | 1 | 2 | Drop waitlist box, add wordmark accent, italic tagline line |
| Chart visual language (per §E — applies to all 5 chart instances) | 3 | 6 | Common gradient defs + per-chart label/typography upgrades |
| Cross-cutting: tokens / utilities (gradient defs, noise SVG, pill component) | 2 | 3 | Reusable primitives for atmosphere |
| QA / responsive / a11y / reduced-motion verification | 2 | 4 | All breakpoints + WCAG + reduced-motion + CLS |
| **TOTAL** | **27 PD hours** | **57.5 FE hours** | **84.5 total team hours** |

### H.1 Sequencing recommendation: **STAGED, 3 SLICES**

Single PR is too large (~57 FE hours = 7 days minimum) and concentrates risk. Recommend three sliced ships:

**Slice-LP5-A — Hero + chart visual language (largest, highest-value, ships first):**
- S1 ChatAppShell rebuild + atmosphere
- S4 demo tabs chat-shell wrapper
- All chart visual language upgrades (per §E)
- S2 proof bar bento
- Estimated: 14 PD + 32 FE hours = ~4 days
- Why first: hero + charts are the «ставка на чат» surface; PO sees the largest visible craft uplift immediately; demo tabs reuse hero ChatAppShell so building both together is efficient.

**Slice-LP5-B — Mid-page craft + S3 + S8:**
- S3 negation 2-card
- S5 insights bento + SVG illustrations
- S6 editorial atmosphere + gradient-text closer
- S8 aggregation marquee restore
- Estimated: 9.5 PD + 17 FE hours = ~2.5 days
- Why second: mid-page sections all deliver visible craft uplift; can ship as one unified «mid-page polish» PR; no dependency on Slice-A.

**Slice-LP5-C — Footer/CTA dedupe + FAQ + S7 hide:**
- S7 hide
- S9 FAQ 2-col layout
- S10 atmosphere
- Footer chrome-only restructure
- Estimated: 3.5 PD + 8.5 FE hours = ~1.5 days
- Why third: lower-risk cleanup work; no blocking dependencies; ships last as the «final polish» beat.

Total elapsed: **~8 working days** with 1 PD + 1 FE working in sequence, less if PD spec ships ahead and FE works on Slice-A while PD finishes B+C specs.

---

## I. Bundle math

### I.1 Per-section bundle delta (gz)

| Section | Delta (kB gz) |
|---|---|
| S1 Hero (ChatAppShell + atmosphere + typing-dots + chart upgrade) | +0.5 |
| S2 Proof bar | 0 |
| S3 Negation | 0 |
| S4 Demo tabs (ProductTabBar + ChatShell reuse) | +1.0 |
| S5 Insights (inline SVG illustrations net of lucide retire) | +0.6 |
| S6 Editorial (atmosphere + glyph + gradient defs) | +0.4 |
| S7 Testimonials (HIDE — net code removal) | -3.0 |
| S8 Aggregation (CSS keyframes + edge fades) | +0.4 |
| S9 FAQ | 0 |
| S10 Pre-footer CTA (atmosphere - waitlist box) | -0.2 |
| Footer (waitlist box removed, wordmark + italic added) | -0.3 |
| Chart visual language (§E — applies to 5 chart instances total) | +2.1 |
| Cross-cutting (gradient defs registry, noise SVG, pill primitive) | +0.8 |

**Net bundle delta: +2.3kB gz across the entire landing.**

### I.2 Budget verification

- Current Marketing First Load JS budget: **220kB** (per project Web Performance rules — landing pages target <150kB but Provedo current is in ~200kB range from prior measurements; budget ceiling is 220kB).
- Current shipped landing First Load JS (per most recent build estimates): **~190kB gz**.
- After Slice-LP5 deltas: **~192.3kB gz**.
- Budget headroom remaining: **~27.7kB gz**. Safe.

If frontend measures actual delta higher than estimate (e.g. ChatAppShell turns out to add 3kB rather than 2kB):
- Hide flag for SVG noise overlay (S6 + S10) — saves 0.4kB.
- Reduce inline SVG illustrations in S5 to 2 instead of 3 — saves 0.3kB.
- Drop the optional outer atmospheric glow on S1 hero — saves <0.1kB.
- Even accounting for 2× over-estimate, total stays within budget.

### I.3 What does NOT add bundle

- All gradient effects use CSS `linear-gradient` / `radial-gradient` — zero JS, zero asset cost.
- All SVG illustrations are inline (no external asset fetch, no separate file).
- All animations use CSS keyframes or CSS transitions (no animation library).
- No new dependencies. No `framer-motion`, no `gsap`, no `recharts`. Verified package.json — no animation/chart libs currently installed; this spec stays consistent.

---

## J. What I'm NOT proposing (explicit scope-creep guard)

### J.1 What stays unchanged

- All locked copy: hero head, hero sub, tagline, all section copy not explicitly called out in §C above. Frontend implements visual changes only; copy edits are separate scope.
- Lane A discipline: every new visual move is Lane-A clean (no «recommends», no «suggests», no advice gradient).
- `usePrefersReducedMotion` + `useInView` hooks: kept as-is, new components reuse them.
- Sources primitive: shape kept, only placement adjusted.
- Design Brief v1.4 §0 anti-pattern list: every banned pattern still banned. Mandate UNLOCKS gradient atmosphere within teal/slate/cream — does NOT unlock AI-purple/pink, brain-icons, neural patterns, sparkle effects, dashboard-jazz. All banned-pattern teeth remain.
- Token system: NO new tokens added. All gradient colors use existing teal/slate scale at varying alphas (alphas are inline, not new tokens). If we end up with 2+ instances of the same alpha-shifted color, we promote to tokens then.
- 3-layer disclaimer: copy verbatim, structure preserved (legal lock).
- Tab 3 simultaneous-animation pattern: preserved (legal lock from `8cb509b`).
- Pricing page, /sign-up flow, /disclosures page: out of scope.
- Mobile app surfaces: out of scope (this is web landing only).

### J.2 What is explicitly DEFERRED to post-Slice-LP5

- **Loading-state skeleton screens** for the demo tabs: nice-to-have, doesn't block ship.
- **Light/dark mode toggle**: landing is light-mode only; dark mode is a product-app concern.
- **Localization shells** (RU): out of scope for this slice; structural Latin-script foundation already in place.
- **Above-the-fold video / Lottie hero animations**: not proposed. The chat shell is the hero animation.
- **Scrollytelling**: not proposed. Provedo's voice is calm, not narrative-driven scroll.
- **3D / WebGL effects**: not proposed. Off-archetype for fintech-Sage.
- **Custom typography (web fonts beyond Inter + JetBrains Mono)**: not proposed. Stays within typography lock.
- **Animated illustrations that loop**: only the marquee loops (calm, expected). No looping mini-illustrations in S5 (single draw-on per IntersectionObserver entry, then static).

### J.3 What does NOT ship even if FE hours come in under estimate

- No new color families beyond teal/slate/cream + semantic emerald/red/amber.
- No glass-morphism on the chat surface itself (Liquid Glass remains banned on AI content per §0.1; only chrome — header status pill — uses subtle glass-equivalent border).
- No animated AI-pulse / thinking orbs (banned §0.1).
- No purple/pink/violet accents (banned §0.1).

### J.4 What the FE engineer can short-circuit if blocked

If a craft detail proves expensive or breaks budget, the priority order to descope (highest-priority-keep first):

1. **Keep:** ChatAppShell (S1 + S4) — load-bearing.
2. **Keep:** Chart visual language (gradient fills, hero numbers) — load-bearing.
3. **Keep:** S8 marquee restore — explicit PO ask.
4. **Keep:** S10 pre-footer atmosphere + S6 atmosphere — answers «скучные» complaint.
5. **Keep:** S3 negation 2-card restore — explicit PO ask.
6. **Keep:** Footer waitlist drop + wordmark — explicit PO ask.
7. **Keep:** Layout-shift fix on hero — explicit PO complaint.
8. Descope-able: S5 mini-illustrations (fall back to better-styled lucide icons in slate-700).
9. Descope-able: S9 FAQ 2-col sticky (fall back to current centered layout).
10. Descope-able: Decorative oversized «Q» glyph in S6 (atmosphere remains via gradient + noise alone).
11. Descope-able: Tagline-rhyme italic line in footer.

---

## §K. PO Pivot Correction — Picture-First Hero (added 2026-04-27)

**Status:** binding correction layered on top of §S1 + §S4. All other sections (S2, S3, S5, S6, S7, S8, S9, S10, Footer) stand unchanged from the prior spec — re-read §C through §J for those.

**The pivot, verbatim from PO:** «ключевое что пользователя нужно заинтересовать, первое впечатление это картинки, мы не показываем чарты, хотя можем упомянуть что они так же есть, и показать парочку».

**Translation into design directives:**
- First impression = beautiful visual (atmosphere / depth / abstract form). NOT a chart, NOT a literal product-data widget.
- Charts are mentioned and shown 1–2 as teasers. NOT 4 chart-tabs as central demo.
- Hero is a hook, not a data presentation.

**What this corrects in the prior spec:**
- §S1 hero ChatAppShell still rendered an inline P&L sparkline with gradient area-fill + 28px hero number prominently inside the chat bubble. That is chart-centric. Remove.
- §S4 demo tabs kept the 4-tab interactive chart deep-dive. That is chart-product-demo, not «парочку». Reduce.

The Magician+Sage reading is preserved — just expressed through atmosphere and chat-shell craft instead of chart craft above the fold.

---

### §K.1 — S1 Hero (re-spec — picture-first)

**What stays from §C.S1 / §D:**
- ChatAppShell container chrome (border, three-layer shadow, header bar with avatar + status dot, optional outer atmospheric glow). Full §D.1–D.5 + D.7–D.8 apply.
- Header bar exactly as specced: 48px tall, `◉ Provedo · live` pattern.
- Typing indicator (3 dots, §D.4) — preserved.
- User bubble + Provedo bubble shapes (§D.3) — preserved.
- Sources block treatment (§D.5) — preserved.
- Layout-shift fix (§D.7) — preserved, but recalculated below for the no-chart variant.
- Atmosphere wash from §C.S1 («single soft radial gradient anchored top-right of the hero section, from teal-50/0.6 fading to transparent over ~700px radius») — preserved.
- Headline typography upgrades (`font-feature-settings`, `text-wrap: balance`, letter-spacing) — preserved.
- CTA cluster: `Ask Provedo` primary + `See how it works ↓` ghost link — preserved.
- «No card · 50 free questions / month» pill treatment — preserved.
- Motion budget (5-rule discipline, compositor-friendly) — preserved.
- Reduced-motion fallback — preserved.

**What changes (the correction):**

**K.1.a — Remove the inline chart from the chat bubble.**

§D.6 (`InlinePnlSparkline` upgrade) is deferred. The hero chat bubble renders `text + mono tokens + sources line` — NOT `text + chart + sources`. The Provedo answer in the hero stays text-led. Mono tokens (tickers, dates, deltas) in the answer give it product-grade texture without a chart.

Specifically the Provedo response bubble in the hero now reads (one example shape — copy locked separately by Lane-A):

```
You're down −4.2% over 30 days.

Two positions drove it:
  · AAPL  −7.1%   2025-10-31
  · TSLA  −5.8%   2025-10-22

Sources: AAPL · TSLA · Schwab · IBKR
```

All the inline tokens (`AAPL`, `−7.1%`, `2025-10-31`, etc.) render as JBM-mono semibold pills — slate-100 bg, slate-700 text, 11px, rounded-md, px-1.5 py-0.5 — sitting inline in the regular Inter prose. This visually anchors the «real data, real positions» feeling without needing a chart.

Reasoning: the prior spec's inline sparkline was the strongest single chart-anchored move on the page; pulling it lets us honor the picture-first pivot AND lets the chat-shell craft (which is the hero's actual differentiator) breathe without competition.

**K.1.b — Add a beautiful non-chart visual element as the first-impression layer.**

Three layered moves combine to form the picture-first hero. None is a chart. None is a person-illustration. None is the AI-sparkles cliché. None is a generic mesh.

**Layer 1 — Atmospheric gradient mesh as the page's first signal (Anthropic+Vercel hybrid).**

Two compositor-friendly radial gradients painted full-bleed behind the hero region, anchored to opposite corners of the hero viewport, very low chroma:

- **Top-right anchor:** `radial-gradient(ellipse 900px 700px at 100% 0%, rgba(13, 148, 136, 0.10) 0%, rgba(13, 148, 136, 0.04) 35%, transparent 70%)` — teal-cream wash, the warm side of teal.
- **Bottom-left anchor:** `radial-gradient(ellipse 800px 600px at 0% 100%, rgba(250, 240, 220, 0.55) 0%, rgba(245, 245, 241, 0.30) 40%, transparent 75%)` — warm-cream amber-leaning glow that matches `#FAFAF7` page bg without color shift.

The two ellipses overlap softly behind the chat shell, creating a subtle valley of light around the chat. The headline sits over the brighter top-right region; the chat shell sits in the meeting zone. No chroma outside teal/cream/slate — palette intact. Total visual cost: 0kB JS, 0kB asset (CSS only). Compositor-friendly (no scroll handlers, static at rest).

**Layer 2 — A bespoke abstract «portfolio brain» glyph behind the chat shell — Magician metaphor in pure SVG geometry.**

A single inline SVG anchored absolute behind-but-offset from the ChatAppShell, ~520px wide, opacity 0.08–0.12, slate-700 stroke + teal-600 single-accent stroke. The shape is NOT a brain icon, NOT a person, NOT an orb. It is a calm geometric composition expressing «multiple sources flowing into one reading»:

```
                            ╭─────╮
                            │     │  ← single circle node (top)
                            ╰──┬──╯
                               │
                       ╭───────┼───────╮
                       │       │       │
                    ╭──┴──╮ ╭──┴──╮ ╭──┴──╮
                    │     │ │     │ │     │  ← 3 broker nodes
                    ╰──┬──╯ ╰──┬──╯ ╰──┬──╯
                       │       │       │
                       ╰───────┼───────╯
                               │
                            ╭──┴──╮
                            │  P  │  ← Provedo synthesis node
                            ╰─────╯
```

Rendered as ~7 nodes connected by hairline curves, with one teal-accented connecting line marking the «synthesis» path bottom-up. ~120 bytes of SVG path data, inline. Sits absolute, `aria-hidden="true"`, `pointer-events: none`. Works as visual anchor of «one chat holds everything» metaphor (rhymes with §S6 closer copy) WITHOUT showing data.

The glyph stays static at rest. On hero entry (IntersectionObserver, threshold 0.4, fires once) the connecting lines draw in via `stroke-dasharray` over 700ms — fully respecting the 5-rule motion budget (compositor-friendly, ≤700ms, single-trigger, IO-gated, prefers-reduced-motion freezes the static render).

**Layer 3 — The chat shell itself becomes the focal artifact, floating in the atmosphere.**

Reuses the §D.1 chrome verbatim. The atmospheric layers (Layer 1 + Layer 2) frame and lift the chat shell — it visually «sits in light». The ChatAppShell's existing optional outer glow (`0 0 80px rgba(13, 148, 136, 0.05)`, §D.1) becomes mandatory in the picture-first variant, increased to `0 0 120px rgba(13, 148, 136, 0.08)`. This is what makes the shell feel «of» the atmosphere instead of dropped onto it.

**Why this combination over the brief's other options:**
- Pure atmospheric gradient mesh (Anthropic-only) was option A — passes calm, but leaves the page feeling «empty atmosphere + UI». Layer 2 glyph adds the Magician metaphor without competing with the chat for focus.
- Glass-morphism layered surfaces — off-archetype (Apple consumer-luxury, not fintech-Sage). Skipped.
- Editorial type-as-art on the headline — the headline is locked copy and is already large + balanced; further type-as-art would compete with the chat. Skipped.
- Person illustration — explicitly off-bounds.
- AI-sparkles — banned per §0.1.

The combination chosen (atmosphere + abstract synthesis-glyph + floating shell) is distinctively Provedo: warm calm, visible craft, Magician metaphor expressed geometrically, all within the locked palette.

**K.1.c — Layout-shift recalculation (§D.7 update).**

With the chart removed from the hero bubble, content height of the message area drops:

- User bubble ~50px + Provedo response (text + mono tokens, no chart) ~180px + sources ~30px + gaps ~40px = **~300px** content.
- Lock `min-height: 360px` (md+) / `min-height: 320px` (mobile) on the message area — replaces §D.7's 480/380.
- Outer ChatAppShell min-height becomes ~440px (md+) / 400px (mobile) — tighter, denser, more product-app feel.

CLS target stays < 0.05.

**K.1.d — ASCII mock for the picture-first hero composition.**

```
HERO SECTION — full-bleed; two-corner radial atmosphere; bespoke synthesis-glyph behind shell

╔═════════════════════════════════════════════════════════════════════════════════╗
║ teal radial wash, top-right ↘                                                   ║
║                                                                                 ║
║ ┌─ left col (max-w-xl) ─────────────┐  ┌─ right col (max-w-[480px]) ────────┐ ║
║ │                                    │  │                                    │ ║
║ │  Provedo will lead you through     │  │   ╭───╮  ← bespoke synthesis-     │ ║
║ │  your portfolio.                   │  │   ╰─┬─╯    glyph SVG (slate-700   │ ║
║ │  [60px Inter 600 slate-900]        │  │  ╭──┼──╮  + teal accent line),    │ ║
║ │                                    │  │  │  │  │   opacity 0.10, drawn-on │ ║
║ │  Notice what you'd miss across     │  │  ╰──┼──╯   on entry, decorative   │ ║
║ │  all your brokers.                 │  │     │                              │ ║
║ │  [22px Inter 400 slate-600]        │  │  ┌──╯─ChatAppShell────────────┐  │ ║
║ │                                    │  │  │  ◉ Provedo        ● live   │  │ ║
║ │  [ Ask Provedo ]   See how it ↓   │  │  ├──────────────────────────────┤  │ ║
║ │  [primary CTA]     [ghost link]    │  │  │             [user bubble]   │  │ ║
║ │                                    │  │  │  [Provedo bubble — text +   │  │ ║
║ │  ┌ ✓ No card · 50 free Q/mo ┐    │  │  │   inline mono-token pills:  │  │ ║
║ │                                    │  │  │   AAPL · −7.1% · 2025-10…   │  │ ║
║ │                                    │  │  │   NO CHART INSIDE BUBBLE]   │  │ ║
║ │                                    │  │  │  ●●●  ← typing dots         │  │ ║
║ │                                    │  │  ├─ sources footer ────────────┤  │ ║
║ │                                    │  │  │ Sources: AAPL · TSLA · …    │  │ ║
║ │                                    │  │  └──────────────────────────────┘  │ ║
║ │                                    │  │     ↑ shell floats in atmosphere   │ ║
║ │                                    │  │     with stronger 120px teal glow  │ ║
║ │                                    │  │                                    │ ║
║ │                                    │  │                                    │ ║
║ └────────────────────────────────────┘  └────────────────────────────────────┘ ║
║                                                                                 ║
║ ↖ warm-cream radial wash, bottom-left                                           ║
╚═════════════════════════════════════════════════════════════════════════════════╝
```

---

### §K.2 — S4 Demo tabs (re-spec — chart teaser, not chart deep-dive)

**Decision:** Option (b) — **two side-by-side teaser surfaces** in a bento layout. One question + one answer + one minimal visual element each. Not a 4-tab interactive chart product-demo.

**Reasoning for option (b) over (a) and (c):**
- Option (a) — single «See Provedo answer» surface with one inline chart — too thin. Doesn't honor PO's «парочку» (couple of) — that word implies two examples, not one. Also makes the demo block visually small after the proof bar; the section needs presence.
- Option (c) — catalog tease, 6 question-buttons text-only — is too quiet. We lose the chance to show what an actual Provedo answer looks like, and the page loses a «here's the product working» beat between proof bar and editorial.
- Option (b) — two side-by-side bento teasers — hits «парочку» precisely, gives the section visual substance without becoming a chart-deep-dive, lets us pick our two strongest example questions, and chart-as-supporting-detail (small, inside one of the two answers) honors «можем упомянуть что они так же есть, и показать парочку».

**The two teaser surfaces (specific picks):**

**Teaser 1 — «Why is my portfolio down?» (the strongest single example).**
- Reuses ChatAppShell visual language from §D.1.
- Header bar shows tab-label «Why?» + status dot.
- One user bubble («Why is my portfolio down this month?»).
- One Provedo response bubble, text-led, with inline mono-token pills (same pattern as §K.1.a — `AAPL`, `−7.1%`, `2025-10-31`, etc. as inline pills).
- ONE small inline chart at the bottom of the response — the §D.6 PnlSparkline upgrade (this IS the «show one chart» beat). Not the hero of the answer; sits below the text as «and here's the shape».
- Sources line below.

**Teaser 2 — «Sector exposure across all my brokers» (the aggregation example).**
- Reuses ChatAppShell visual language from §D.1.
- Header bar shows tab-label «Aggregate» + status dot.
- One user bubble («What's my sector exposure across all brokers?»).
- One Provedo response bubble, text-led, with inline mono-token pills (`Tech 58%`, `Energy 12%`, `IBKR`, `Schwab`, etc.).
- NO chart inside this one — it's text + tokens + a small inline summary line «Tech ~2× the index — driven by IBKR.» (Lane-A clean, Provedo-voice italic line). The asymmetry (Teaser 1 has a chart, Teaser 2 doesn't) reinforces «charts exist, but they're not the main thing».
- Sources line below.

**What's dropped from prior §C.S4:**
- The 4-tab ProductTabBar pill switcher — deferred. Not built for this slice.
- The Tab 2 DividendCalendar craft upgrade — deferred to post-LP5 (the chart still exists in `/charts/` and can ship behind a future expanded-demo route or `/preview` page).
- The Tab 3 TradeTimeline simultaneous-animation lock — preserved as code (the file is not deleted), but not rendered on the landing for this slice. The legal-advisor lock from `8cb509b` stays binding for any future re-introduction.
- The Tab 4 AllocationPieBar craft upgrade — deferred (same disposition as Tab 2).
- Section bg gradient wash from §C.S4 — replaced by simpler unified bg matching the rest of the warm-page sections (see below).

**What stays from prior §C.S4:**
- Section header «Four questions. Real answers.» — REPLACED by «Two answers. Same shape on every question.» (h2, 36px Inter 500, slate-900, centered). The new copy reflects the two-teaser layout AND foreshadows that Provedo answers more questions than just these two — without promising 4.
- Section sub: «Pick the kind of question you'd ask — Provedo answers from your real positions, with sources.» — REPLACED by «These are two of the questions Provedo answers daily. Same shape on every one — read, mono tokens, sources.» (Lane-A clean, descriptive).
- Section bg: warm-bg-page `#FAFAF7` (no gradient wash — calmer, lets the two bento cards carry the visual weight).
- ChatAppShell visual language reused — Teaser 1 and Teaser 2 both render as full ChatAppShell containers (§D.1 chrome).
- Mobile: two teasers stack vertically (Teaser 1 first).

**Layout:**
- 12-col grid on md+, gap-8.
- Teaser 1 spans cols 1–6 (left half).
- Teaser 2 spans cols 7–12 (right half).
- Both equal min-height ~440px to align bottom edges.
- Mobile: stack 1-col, gap-6.

**ASCII mock for S4:**

```
                      Two answers. Same shape on every question.
                                  [Inter 500 36px slate-900 centered]
                  These are two of the questions Provedo answers daily.
                  Same shape on every one — read, mono tokens, sources.
                                  [Inter 400 16px slate-600 centered max-w-2xl]

  ┌─ Teaser 1 (cols 1–6) ──────────────────┐  ┌─ Teaser 2 (cols 7–12) ─────────────┐
  │  ◉ Why?                       ● live   │  │  ◉ Aggregate                ● live │
  ├─────────────────────────────────────────┤  ├─────────────────────────────────────┤
  │             [Why is my portfolio down?] │  │   [What's my sector exposure       │
  │                                         │  │    across all brokers?]            │
  │  [Provedo answer text + inline mono     │  │                                    │
  │   pills: AAPL · −7.1% · 2025-10-31…]    │  │  [Provedo answer text + inline     │
  │                                         │  │   mono pills: Tech 58% · Energy    │
  │  ┌─ small PnlSparkline chart ──────┐    │  │   12% · IBKR · Schwab…]            │
  │  │  (§D.6 spec, full craft)        │    │  │                                    │
  │  │  ──/──/──/──╲╱──╲╱──             │    │  │  ┃ Tech ~2× the index — driven    │
  │  │           AAPL•  TSLA•   −4.2%   │    │  │  ┃ by IBKR.                        │
  │  └──────────────────────────────────┘    │  │  [italic Provedo-voice pull-quote] │
  ├─────────────────────────────────────────┤  ├─────────────────────────────────────┤
  │  Sources: AAPL · TSLA · Schwab · IBKR   │  │  Sources: 6 holdings · 3 brokers   │
  └─────────────────────────────────────────┘  └─────────────────────────────────────┘
```

---

### §K.3 — Sections that stand unchanged from prior spec

Confirmed: no changes from §C / §D / §E / §F / §G / §H / §I / §J for any of the following. Re-read the original spec for these.

- **§S2 Numeric proof bar** — bento 4-cell with teal-tinted Sources hero cell. Stands.
- **§S3 Negation 2-card** — restore 2-column comparison table with shadow asymmetry. Stands.
- **§S5 Insights asymmetric bento** — large card 2/3 + two small cards 1/3, three custom inline SVG mini-illustrations. Stands.
- **§S6 Editorial dark mid-page** — atmosphere upgrade (radial-glow + noise + decorative «Q» glyph + gradient-text closer). Stands.
- **§S7 Testimonials** — HIDE recommendation. Stands.
- **§S8 Aggregation marquee restore** — two-row opposing-direction marquee with broker wordmarks in mono pills. Stands.
- **§S9 FAQ 2-col sticky magazine layout** — stands.
- **§S10 Pre-footer CTA** — atmosphere upgrade matching §S6 + decorative arrow glyph + ambient teal glow under button. Stands.
- **Footer chrome-only** — drop waitlist box, add wordmark accent + tagline-rhyme italic. Stands.

The chart visual language §E remains the canonical chart spec. It now applies to **two chart instances** (Teaser 1 PnlSparkline only) instead of five. The other chart components (`DividendCalendarAnimated`, `TradeTimelineAnimated`, `AllocationPieBarAnimated`) stay in the codebase, dormant, available for post-LP5 expansion (e.g. a `/preview` deep-demo route).

---

### §K.4 — Updated bundle delta

The picture-first correction is mostly net-negative on bundle (we drop chart instances) but adds two small atmosphere assets.

| Item | Delta vs prior §I (kB gz) |
|---|---|
| Drop hero inline PnlSparkline (§D.6) | −0.6 |
| Drop S4 ProductTabBar component | −1.0 |
| Drop S4 chart upgrades for Tab 2 / Tab 3 / Tab 4 (deferred — not in this slice) | −1.0 |
| Add Layer 2 bespoke synthesis-glyph SVG (inline, ~120 bytes paths + draw-on CSS) | +0.3 |
| Add Layer 1 second radial-gradient bottom-left wash (CSS only, no asset) | +0.0 |
| Add inline mono-token pill styling utility (CSS class + reuse) | +0.1 |
| Add Teaser 2 italic Provedo-voice pull-quote treatment (CSS) | +0.0 |

**Net delta vs prior §I total:** approximately **−2.2 kB gz**.

**Revised total Slice-LP5 bundle delta vs current shipped:**
- Prior §I.1 total: +2.3 kB gz.
- After §K correction: **+0.1 kB gz net** across the entire landing.

**Budget headroom remaining:** ~29.7 kB gz — even safer than prior estimate.

---

### §K.5 — Updated effort estimate

The picture-first correction reduces FE work (3 charts deferred, no ProductTabBar) but adds modest PD + FE work (atmosphere layers + bespoke glyph + Teaser 2 layout).

Per-section deltas vs §H:

| Section | PD delta (h) | FE delta (h) | Notes |
|---|---|---|---|
| S1 hero (drop chart in bubble + add 2-corner atmosphere + Layer 2 glyph + recalc layout-shift) | +1.0 | +2.0 | Glyph SVG authoring + 2nd gradient + min-height recalc + token-pill inline styling |
| S4 demo tabs (drop ProductTabBar + drop 3 chart upgrades + spec 2-teaser bento) | −1.5 | −5.0 | Two chat-shell instances replacing 4-tab interactive switcher |
| Chart visual language (§E now applies to 2 instances, not 5) | −1.5 | −3.0 | Hero variant deferred; Tab 2 / 3 / 4 upgrades deferred to post-LP5 |

**Revised totals:**
- PD: 27 − 2.0 = **25 PD hours**.
- FE: 57.5 − 6.0 = **51.5 FE hours**.
- **Total: 76.5 team hours** (down from 84.5).

**Revised slice sequencing (§H.1):**
- **Slice-LP5-A** (Hero + S2 proof bar + S4 two-teaser bento + chart language for 2 instances): ~12 PD + 26 FE hours = ~3.5 days. Still ships first.
- **Slice-LP5-B** (S3 + S5 + S6 + S8): unchanged, ~9.5 PD + 17 FE hours = ~2.5 days.
- **Slice-LP5-C** (S7 + S9 + S10 + Footer): unchanged, ~3.5 PD + 8.5 FE hours = ~1.5 days.
- Total elapsed: **~7.5 working days**.

---

### §K.6 — What did NOT change from §J scope guards

- All Lane-A copy discipline preserved.
- All §0.1 banned patterns still banned (no AI-purple/pink, no brain-icons, no neural-net jazz, no sparkles, no glass-morphism on AI content).
- Token system: still no new tokens — gradients stay as inline alphas.
- Tab 3 simultaneous-animation legal lock from `8cb509b`: still binding for any future re-introduction (the `TradeTimelineAnimated` component file is preserved, just not rendered on landing for this slice).
- 3-layer disclaimer copy + structure: legal lock preserved.
- Locked hero copy + locked tagline: untouched.

### §K.7 — Open question for right-hand to surface to PO

Both prior open question (S7 testimonials hide-vs-keep) AND one new question:

**New:** The two teaser questions chosen for §S4 are «Why is my portfolio down?» (Tab 1 reuse) and «Sector exposure across all brokers» (Tab 4 reuse). Alternatives we could swap in: «What dividends are coming this quarter?» (Tab 2) or «When did I sell, and what happened after?» (Tab 3 — but the legal-lock simultaneous-animation makes this surface fragile if reintroduced in a teaser context). PD recommendation is the chosen pair (Why? + Aggregate) — strongest contrast between question types. PO sign-off on this pairing would be useful before FE implements; if PO prefers Dividends as one of the two, we swap Teaser 2.

---

## End of spec

**Word count:** ~12 100 (after §K addition).

**Frontend can begin Slice-LP5-A immediately under the §K-corrected scope. PD specs for Slice-LP5-B and C are complete in this document and unaffected by the §K correction.**

**Prior-spec open question retained:** S7 testimonials hide vs keep-with-flag. PD strong recommendation is HIDE; if PO insists, gate via env flag.
