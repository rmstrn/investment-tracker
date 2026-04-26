# Landing v2 — Implementation Spec («The Ledger That Talks»)

**Author:** product-designer
**Date:** 2026-04-27
**Audience:** frontend-engineer (primary), right-hand (review)
**Status:** Frontend-implementable — single source of truth for landing-v2 build
**Supersedes:** all currently-mounted Provedo landing components on `apps/web/src/app/(marketing)/page.tsx`
**Binding inputs (read in this order):**
1. `docs/reviews/2026-04-27-landing-from-scratch-content-lead.md` — copy verbatim source
2. `docs/reviews/2026-04-27-landing-from-scratch-product-designer.md` — «Ledger That Talks» visual move
3. `docs/reviews/2026-04-27-landing-from-scratch-brand-voice.md` — voice rules
4. `docs/reviews/2026-04-27-landing-from-scratch-user-researcher.md` — Scattered Optimiser ICP + 5-sec test
5. `docs/reviews/2026-04-27-landing-from-scratch-brand-strategist.md` — answer-engine category claim

**Bound-in vocabulary:**
- LOCKED hero head: «Provedo will lead you through your portfolio.»
- LOCKED hero sub: «Notice what you'd miss across all your brokers.»
- Naming LOCKED: Provedo
- Palette: warm-cream (`#FAFAF7`) + slate-900 (`#0F172A`) + teal-600 (`#0D9488`)
- Typography: Inter (display + body) + JetBrains Mono (data + labels)
- Lane A discipline: no advice, no recommendations, no strategy

---

## §A — Component architecture

### A.1 — Folder strategy

**Decision: alongside existing components, NOT a new `landing-v2/` subfolder.**

Rationale:
- The retired components stay in the file tree dormant (page.tsx no longer imports them, but the files are not deleted in this slice; deletion is a separate cleanup once landing-v2 is verified shipping). A new subfolder would force us to either (a) duplicate the path namespace creating two parallel «Provedo*» worlds in the same `_components/` folder which is harder to navigate, or (b) move retired components inside an `_archived/` folder which is more churn than the slice requires.
- Reused primitives (`ProvedoButton`, `Sources`, `MarketingHeader`, `MarketingFooter`, `usePrefersReducedMotion`, `useInView`) live at the `_components/` root. Adding a parallel subfolder doubles the import-path complexity for consumers of those primitives.
- The naming convention for new components is `Landing*` (see A.2) — no name collisions with retired `Provedo*` components.

**Result:** All new components mount at `apps/web/src/app/(marketing)/_components/Landing<Section>.tsx`. Sub-primitives mount at `apps/web/src/app/(marketing)/_components/landing/<Primitive>.tsx` (new sibling of `hero/` and `charts/`).

### A.2 — New component tree

```
apps/web/src/app/(marketing)/_components/
├── LandingHero.tsx                     [NEW] Section 1 — Ledger That Talks two-pane hero
├── LandingAskQuestion.tsx              [NEW] Section 2 — Ask the question you've been Googling
├── LandingCoverage.tsx                 [NEW] Section 3 — Every account. One conversation.
├── LandingDifferentiators.tsx          [NEW] Section 4 — The things hiding between your brokers
├── LandingTrustBand.tsx                [NEW] Section 5 — Read-only. No advice. No surprises.
├── LandingClosingCTA.tsx               [NEW] Section 6 — It only takes one question + final CTA
├── LandingEarlyAccessModal.tsx         [NEW] Modal triggered by every primary CTA on the page
├── landing/
│   ├── Ledger.tsx                      [NEW] Left-pane typeset ledger primitive
│   ├── LedgerRow.tsx                   [NEW] Single position row inside Ledger
│   ├── LedgerHighlight.tsx             [NEW] Pen-mark animated underline + ref-link primitive
│   ├── ConversationCard.tsx            [NEW] Right-pane minimal-chrome chat surface
│   ├── ConversationMessage.tsx         [NEW] Single message bubble (user/Provedo) with citation
│   ├── CitationLink.tsx                [NEW] Inline `¹` citation chip linked to ledger row
│   ├── PenMarkUnderline.tsx            [NEW] Animated teal underline (left-to-right draw)
│   ├── PaperGrain.tsx                  [NEW] Background noise SVG layer (3% multiply blend)
│   ├── BrokerLogoStrip.tsx             [NEW] Section 3 — slate-monochrome 12-logo grid
│   └── DifferentiatorCard.tsx          [NEW] Section 4 — single 3-card primitive
└── ProvedoFAQ.tsx                      [KEEP — copy rewrite required, see §B.4 note]
```

**Total new components: 13.**
- 6 section-level components (mounted directly by page.tsx)
- 1 modal (mounted by page.tsx, controlled by event)
- 6 primitives + 1 background layer in `landing/` subfolder

### A.3 — Reused / kept components

| Component | Disposition | Notes |
|---|---|---|
| `MarketingHeader` | KEEP, no changes | Already correct visual register; nav stays Pricing + Sign in + «Get started» CTA. |
| `MarketingFooter` | KEEP, minor copy change | Replace footer tagline-rhyme «Notice what you'd miss.» — stays. Drop nothing. The 3-layer disclaimer stays verbatim. |
| `ProvedoButton` | KEEP | Used by all CTAs; primary variant + lg size. |
| `Sources` (the citation chip primitive) | KEEP — reuse heavily | Used in §S2 conversation transcript and as inline citation pattern. |
| `ProvedoFAQ` | KEEP, copy rewrite | The 6 Q&A items get rewritten per voice — see §B.4 note. (Counter to the brief, which lists FAQ as RETIRE — but the brief preserves «KEEP but rewrite content per voice»; this matches.) |
| `usePrefersReducedMotion` hook | KEEP, reuse | Consumed by every animation in v2. |
| `useInView` hook | KEEP, reuse | Consumed by `LandingHero` for scroll-triggered animation phase. |

### A.4 — Retired components (page.tsx no longer imports)

Per brief §G:
- `ProvedoHeroV2.tsx` — retired (replaced by `LandingHero`)
- `ProvedoNegationSection.tsx` — retired (replaced by `LandingTrustBand`)
- `ProvedoDemoTeasersBento.tsx` — retired (replaced by `LandingAskQuestion`)
- `ProvedoInsightsBullets.tsx` — retired (merged into `LandingDifferentiators`)
- `ProvedoEditorialNarrative.tsx` — retired (manifesto absorbed into `LandingDifferentiators` + `LandingClosingCTA`)
- `ProvedoAggregationSection.tsx` — retired (replaced by `LandingCoverage`)
- `ProvedoRepeatCTAV2.tsx` — retired (replaced by `LandingClosingCTA`)
- `ChatPromptPicker.tsx` (in `hero/`) — retired (no chip-driven demo on landing-v2)

Also already-unmounted, KEEP retired:
- `ProvedoNumericProofBar.tsx`
- `ProvedoTestimonialCards.tsx`

Also retired but files kept dormant (no deletion in this slice):
- `charts/DividendCalendarAnimated.tsx`, `charts/TradeTimelineAnimated.tsx`, `charts/AllocationPieBarAnimated.tsx`, `charts/PnlSparklineAnimated.tsx` — kept in tree for future app-surface reuse, no longer imported by landing.
- `ChatMockup.tsx` (in `hero/`) — retired from landing; the new `ConversationCard` is purpose-built for the editorial register and does NOT inherit `ChatAppShell`'s 48px header bar / status pill / 120px outer halo, which read «SaaS app chrome» (wrong register for editorial Ledger pane). `ChatMockup.tsx` stays in tree dormant for potential later app-surface reuse.
- `ChatAppShell.tsx` — same; retired from landing, stays in tree.

### A.5 — Page mounting structure (`page.tsx` rewrite)

```tsx
// Provedo landing-v2 — «The Ledger That Talks» (2026-04-27 redesign).
// Replaces all Slice-LP6 ProvedoHero* / ProvedoDemoTeasers* / ProvedoNegation* /
// ProvedoAggregation* / ProvedoEditorial* / ProvedoInsights* / ProvedoRepeat*
// components. The new component tree is purpose-built for editorial register.
// 6 sections + 1 modal + reused header/footer/FAQ.

import type { Metadata } from 'next';
import { LandingHero } from './_components/LandingHero';
import { LandingAskQuestion } from './_components/LandingAskQuestion';
import { LandingCoverage } from './_components/LandingCoverage';
import { LandingDifferentiators } from './_components/LandingDifferentiators';
import { LandingTrustBand } from './_components/LandingTrustBand';
import { LandingClosingCTA } from './_components/LandingClosingCTA';
import { LandingEarlyAccessModal } from './_components/LandingEarlyAccessModal';
import { ProvedoFAQ } from './_components/ProvedoFAQ';

export const metadata: Metadata = {
  title: "Provedo · Notice what you'd miss across all your brokers",
  description:
    'Provedo will lead you through your portfolio — across every broker, with sources for every answer. Pre-alpha. Read-only. No advice.',
  robots: { index: false, follow: false }, // Pre-alpha — keep noindex until provedo.ai prod cutover.
  openGraph: {
    title: "Provedo · Notice what you'd miss across all your brokers",
    description:
      'Provedo will lead you through your portfolio — every position, every dividend, every drift, every drawdown — across all your brokers.',
    type: 'website',
    locale: 'en_US',
    url: 'https://provedo.ai/',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Provedo · Notice what you'd miss across all your brokers",
    description: "Notice what you'd miss across all your brokers.",
  },
};

export default function MarketingHomePage() {
  // The marketing layout already provides <main id="main-content"> and
  // mounts MarketingHeader + MarketingFooter. We render section-level
  // components as children of that <main>; LandingEarlyAccessModal mounts
  // last (renders nothing until opened) and listens to a custom event the
  // CTAs dispatch.
  return (
    <>
      <LandingHero />
      <LandingAskQuestion />
      <LandingCoverage />
      <LandingDifferentiators />
      <LandingTrustBand />
      <LandingClosingCTA />
      <ProvedoFAQ />
      <LandingEarlyAccessModal />
    </>
  );
}
```

Note: the FAQ from the current shipped page is preserved between `LandingClosingCTA` and the footer. The brief explicitly lists ProvedoFAQ as «KEEP but rewrite content per voice». A tighter alternative is to drop the FAQ entirely (six sections is the brief), but keeping it post-trust-band gives the long-reader an anchor without forcing it before the closing CTA. **Final placement decision: FAQ stays after Section 6.** If right-hand prefers strict-six-only, retire FAQ and the page becomes 6 sections flat.

---

## §B — Per-section detailed specs

### §B.1 — Section 1: «The Ledger That Talks» hero

**Component:** `LandingHero.tsx`
**File path:** `apps/web/src/app/(marketing)/_components/LandingHero.tsx`
**Sub-components used:** `Ledger`, `ConversationCard`, `PaperGrain`, `LandingEarlyAccessModal` event-dispatching CTA
**Tier scope:** All visitors (entry surface)

#### Copy verbatim (locked + content-lead-supplied)

| Slot | Copy |
|---|---|
| Eyebrow | `Portfolio intelligence, on demand.` |
| H1 | `Provedo will lead you through your portfolio.` (LOCKED) |
| Sub | `Notice what you'd miss across all your brokers.` (LOCKED) |
| Primary CTA | `Get early access` |
| Below-CTA microcopy | `No card. Look without connecting. Read-only when you connect.` |
| Trust pill | `Read-only · No trading · No advice` |

#### Layout (1440 desktop)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  PROVEDO                                                  Pricing   Sign in  Get started│  ← MarketingHeader (sticky, 64px)
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ░░░░ paper grain (3% noise) ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                                                                         │
│  Portfolio intelligence, on demand.                                                     │  ← eyebrow JBM-mono 12px
│                                                                                         │
│  Provedo will lead                       ┌─ portfolio.ledger ─────────────────┐         │  ← ledger card lowercase mono label
│  you through your                        │                                    │         │
│  portfolio.                              │  IBKR · US                  $312k │         │  ← LedgerRow * 3
│                                          │  Trading 212 · EU            €84k │         │
│  Notice what you'd miss                  │  Kraken · Crypto             $19k │         │
│  across all your                         │  ─────────────────────────────────│         │
│  brokers.                                │  Total                       $431k│         │
│                                          │                                    │         │
│  Read-only · No trading · No advice      │  Top drift  NVDA  ¹+4.2pp ◐       │  ← pen-mark teal underline on +4.2pp
│                                          │  Dividends Apr 28           $312  │  ← citation ¹ links to conversation msg
│  ┌─────────────────────────┐             │  Currency exposure         71% USD│         │
│  │  Get early access  →    │             └────────────────────────────────────┘         │
│  └─────────────────────────┘                                                            │
│                                          ┌─ conversation ─────────────────────┐         │
│  No card. Look without connecting.       │                                    │         │
│  Read-only when you connect.             │  ↳ Why is NVDA flagged?           │         │  ← user msg, mono with ↳ prefix
│                                          │                                    │         │
│                                          │  Your target was 12% NVDA. It's   │         │  ← Provedo answer, Inter
│                                          │  now 16.2% — a ¹+4.2pp drift      │         │
│                                          │  from a 38% rally since Feb.      │         │
│                                          │                                    │         │
│                                          │  ── Sources ───────────────────── │         │  ← Sources primitive, dotted top rule
│                                          │  IBKR · positions · today         │         │
│                                          └────────────────────────────────────┘         │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Typography hierarchy

| Element | Font | Weight | Size (desktop) | Size (mobile) | Line-height | Letter-spacing | Color |
|---|---|---|---|---|---|---|---|
| Eyebrow | JetBrains Mono | 500 | 12px | 11px | 1.4 | `0.18em` | `var(--provedo-text-tertiary)` (`#475569`) |
| H1 | Inter | 600 | `clamp(40px, 5.5vw, 80px)` | 36px | 0.98 | `-0.02em` | `var(--provedo-text-primary)` (`#0F172A`) |
| H1 line-breaks | hard `<br />` after «lead» and «your» on desktop only | — | — | — | — | — | — |
| Sub | Inter | 400 | 22px | 18px | 1.4 | `-0.005em` | `var(--provedo-text-secondary)` (`#334155`) |
| Trust pill | Inter | 500 | 13px | 12px | 1.5 | `0` | `var(--provedo-text-tertiary)` |
| Below-CTA microcopy | Inter | 400 | 13px | 12px | 1.55 | `0` | `var(--provedo-text-tertiary)` |
| Ledger card mono label | JetBrains Mono | 400 | 11px | 10px | 1.4 | `0.04em` | `#94A3B8` (slate-400) |
| LedgerRow account label | Inter | 500 | 14px | 13px | 1.5 | `-0.005em` | `var(--provedo-text-primary)` |
| LedgerRow region tag | JetBrains Mono | 400 | 11px | 10px | 1.5 | `0.04em` | `var(--provedo-text-tertiary)` |
| LedgerRow value | JetBrains Mono | 500 | 14px (tabular-nums) | 13px | 1.5 | `0` | `var(--provedo-text-primary)` |
| Conversation user msg | JetBrains Mono | 400 | 14px | 13px | 1.55 | `0` | `var(--provedo-text-secondary)` |
| Conversation Provedo answer | Inter | 400 | 16px | 15px | 1.6 | `-0.005em` | `var(--provedo-text-primary)` |
| CitationLink (¹) inline | Inter | 600 (superscript) | 11px | 11px | 1 | `0` | `var(--provedo-accent)` (`#0D9488`) |

Tabular figures: any monospace `LedgerRow value` element MUST set `font-variant-numeric: tabular-nums` so columns align.

#### Color usage

- Section background: `var(--provedo-bg-page)` `#FAFAF7` (warm cream, layout already supplies it)
- Paper grain layer: SVG noise (3% opacity) at `mix-blend-mode: multiply`
- Hero atmosphere washouts: removed. The `HeroAtmosphere.tsx` SVG synthesis-glyph is NOT carried into landing-v2 (off-register; replaced by paper grain only)
- Subtle radial wash at top-left:
  ```
  background: radial-gradient(ellipse 1200px 600px at 0% 0%, rgba(13, 148, 136, 0.04), transparent 65%);
  ```
- Cards: `var(--provedo-bg-elevated)` `#FFFFFF` background, `1px solid #E2E8F0` (slate-200) border, `8px` radius
- Card shadow: minimal — `0 1px 3px rgba(15, 23, 42, 0.04)` only. NO 120px teal halo. NO three-layer drop shadow.
- Pen-mark teal underline: `#0D9488` 1.5px, drawn via animated `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` (left-to-right reveal)

#### Animation choreography

Hero load timeline (`t` in seconds, all timings respect `prefers-reduced-motion: reduce`).

| `t` | Element | Animation | Duration | Easing |
|---|---|---|---|---|
| 0.00 | Eyebrow | fade in (opacity 0→1) | 200ms | ease-out |
| 0.10 | H1 | fade in + translate-y(8px → 0) | 240ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| 0.30 | Sub | fade in + translate-y(8px → 0) | 240ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| 0.50 | Trust pill | fade in | 200ms | ease-out |
| 0.65 | CTA + microcopy | fade in + translate-y(6px → 0) | 200ms | ease-out |
| 0.80 | Ledger card | fade in + translate-y(12px → 0) | 320ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| 1.10 | Ledger numeric values count up from 0 → final | 480ms | ease-out, tabular-num display |
| 1.70 | Pen-mark underline draws on `+4.2pp` | 360ms | `cubic-bezier(0.16, 1, 0.3, 1)` (left → right via clip-path) |
| 2.20 | Conversation card | fade in + translate-y(12px → 0) | 320ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| 2.55 | User message | typing animation, 35ms/char with 10ms jitter, sentence-end +180ms | ~1.0s | char-by-char |
| 3.55 | Pause | typing dots indicator (3 dots, 0.75s loop) | 600ms | sine-wave alpha |
| 4.15 | Provedo answer | streams word-by-word at ~50ms/word | ~2.4s | text reveal |
| 6.50 | Sources line | fade in + translate-y(4px → 0) | 240ms | ease-out |
| 6.50 | Citation `¹` chip becomes interactive | — | — | — |

After `t = 6.5s`: idle. No auto-loop. (Brief from PD vision proposed a 12s idle → reset cycle; landing-v2 simplifies — single play once on load. Reader who scrolls up + down does not re-trigger except via in-view replay below.)

**Re-play on scroll-into-view:** the entire animation re-plays if the hero scrolls back into view after being out of view. Implemented via `useInView` with `triggerOnce: false`. Only the user-message + Provedo-answer typing portion re-plays; the static numbers + pen-mark stay in their final state once first played (no count-up replay).

**Reduced-motion fallback:** all elements appear in their final state immediately. No typing, no count-up, no draw-in for the pen-mark underline. The Sources line is visible with full text. Citation chip is interactive immediately.

#### Mobile collapse

| Breakpoint | Behavior |
|---|---|
| 320 | Single column. Eyebrow → H1 → Sub → Trust pill → CTA → microcopy → Ledger card stacked → Conversation card stacked. Ledger card and Conversation card both fill 100% of column width minus 32px gutters. H1 sizes down to 36px and removes hard line-breaks (line-breaks only on ≥ 1024px). |
| 375 | Same as 320. H1 36px. |
| 768 | Single column still. Both cards full-width. H1 grows to 48px. Hard line-breaks still off. |
| 1024 | Two-column grid begins. Left column = text + CTA cluster (max-width 540px). Right column = stacked cards. H1 grows to 64px. Hard line-breaks turn on. |
| 1440 | H1 = 80px. Right column max-width 480px, left column max-width 600px. Gap between columns = 64px. |
| 1920 | Same as 1440 — content max-width caps at 1280px (Tailwind `max-w-7xl`); excess viewport left as gutter. |

#### Component props + state

```tsx
// LandingHero.tsx
export function LandingHero(): React.ReactElement {
  const prefersReduced = usePrefersReducedMotion();
  // No props — section is self-contained.
  // Internal: ref + useInView for replay-on-intersection.
  // Internal: dispatches a CustomEvent('provedo:open-early-access')
  //          on CTA click; the modal listens on window.
}
```

Sub-component contracts are detailed in §C.

#### Accessibility

- `<section aria-labelledby="hero-heading">` wraps the entire hero.
- `<h1 id="hero-heading">` carries the locked H1.
- Trust pill is plain text inside a `<p>` — not a `<button>` (it's not interactive); ARIA role default.
- Eyebrow is a `<p>` with no specific ARIA role; not a heading.
- `Ledger` is wrapped in `<aside aria-label="Sample portfolio ledger">` so SR users hear it as supplementary content.
- `ConversationCard` is wrapped in `<aside aria-label="Sample Provedo conversation">`.
- Provedo answer message has `aria-live="polite"` so SR users hear streamed text once per replay.
- Citation `¹` chip inside the answer message is a real `<a href="#ledger-row-nvda">` anchor link; the corresponding ledger row carries `id="ledger-row-nvda"`. Click scrolls smoothly.
- Pen-mark underline is `aria-hidden="true"` (decorative).
- All animation respects `prefers-reduced-motion: reduce` — set `transition: none` and skip count-up + typing under reduced-motion.

---

### §B.2 — Section 2: «Ask the question you've been Googling.»

**Component:** `LandingAskQuestion.tsx`
**File path:** `apps/web/src/app/(marketing)/_components/LandingAskQuestion.tsx`
**Sub-components used:** `ConversationCard` (reused from hero), `Sources`
**Tier scope:** All visitors

#### Copy verbatim (content-lead doc §4 Section 2)

| Slot | Copy |
|---|---|
| Section eyebrow | `THE EARNER` (mono, optional — see note) |
| H2 | `Ask the question you've been Googling.` |
| Body line 1 | `Provedo reads every position across every broker you connect — Schwab, IBKR, Binance, Revolut, the lot — and answers in plain language with the source numbers cited.` |
| Body line 2 (italic emphasis) | `Not a dashboard you have to interpret. A conversation you can finish.` |
| Caption under transcript | `Every answer cites the position, the broker, and the date. You can verify in two clicks.` |

**Eyebrow note:** the brief does not require a section eyebrow. I am proposing one for visual rhyme with hero (mono labels above headlines). If right-hand prefers cleaner — drop it.

#### Visual layout (ASCII)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                        │
│  THE EARNER                                                                            │
│                                                                                        │
│  Ask the question you've been Googling.                                                │
│                                                                                        │
│  Provedo reads every position across every broker you connect — Schwab, IBKR,          │
│  Binance, Revolut, the lot — and answers in plain language with the source numbers     │
│  cited.                                                                                │
│                                                                                        │
│  Not a dashboard you have to interpret. A conversation you can finish.                 │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────┐     │
│  │ ↳ How concentrated am I in tech right now?                                   │     │
│  │                                                                              │     │
│  │ Across all 4 of your accounts, tech sits at 41.2% of total holdings —        │     │
│  │ ¹AAPL 9.4%, ²NVDA 7.8%, ³GOOGL 6.1%, MSFT 5.6%, plus QQQ exposure of         │     │
│  │ 12.3% (Schwab + Fidelity combined). Your stated target was 30% tech.         │     │
│  │                                                                              │     │
│  │ ── Sources ────────────────────────────────────────────────────────────      │     │
│  │ Schwab statement · 2026-04-26 · IBKR positions · today · Fidelity 401k       │     │
│  └──────────────────────────────────────────────────────────────────────────────┘     │
│                                                                                        │
│  Every answer cites the position, the broker, and the date.                            │
│  You can verify in two clicks.                                                         │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

The conversation card here is wider than the hero variant (single-column, max-width 720px on desktop), centered, single message exchange. The transcript is the demonstration.

#### Typography hierarchy

| Element | Font | Weight | Size (desktop) | Size (mobile) |
|---|---|---|---|---|
| Section eyebrow | JBM Mono | 500 | 12px / `0.18em` tracking | 11px |
| H2 | Inter | 600 | 44px / leading-tight | 32px |
| Body line 1 | Inter | 400 | 18px / leading-relaxed | 16px |
| Body line 2 (emphasis) | Inter | 500 (italic) | 18px / leading-relaxed | 16px |
| Caption | Inter | 400 | 14px / italic | 13px / italic |
| Transcript user msg | JBM Mono | 400 | 15px | 14px |
| Transcript Provedo answer | Inter | 400 | 16px | 15px |
| Source line | uses `Sources` primitive | — | 13px (italic) | 12px (italic) |

#### Color

- Section background: `var(--provedo-bg-page)` `#FAFAF7`
- Conversation card: `var(--provedo-bg-elevated)` `#FFFFFF` with `1px solid #E2E8F0`, 8px radius, minimal shadow same as hero
- Inline citation `¹²³` superscripts: teal-600

#### Animation choreography

- On scroll-into-view (≥ 30% of section visible): H2 + body fade in (200ms each, sequential 100ms stagger).
- ConversationCard appears immediately when the section enters view (no typing replay — content reads as a static printed transcript here, not a live demo). If right-hand prefers a typing replay, this is a low-cost addition and uses the same typing engine as hero — but the editorial register is stronger if THIS conversation is static (the hero already sells «live»; section 2 sells «specificity»).
- Citation chips draw their teal underline on hover (140ms, ease-out).
- Reduced-motion: all elements appear synchronously, no fade.

#### Mobile collapse

| Breakpoint | Behavior |
|---|---|
| 320 | Centered column max-width 100% minus 32px gutter. H2 sizes 28px; body 16px; transcript card full width. |
| 768 | H2 36px; transcript card max-width 720px. |
| 1024+ | H2 44px; transcript card max-width 720px centered. |

#### Component props + state

```tsx
export function LandingAskQuestion(): React.ReactElement {
  const prefersReduced = usePrefersReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  // Static transcript content lives in a const inside this file.
  // No external state; no events.
}
```

#### Accessibility

- `<section aria-labelledby="ask-question-heading">`
- H2 `id="ask-question-heading"`
- Conversation transcript wrapped in `<figure>`; the Sources line is `<figcaption>`'s sibling.
- Inline citation chips are `<a href="#fn-tech-1">` anchors linking to in-page footnote-like marks. Since this is a static transcript, the «target» of each citation is a small footnote block at the bottom of the section, NOT a ledger row.

---

### §B.3 — Section 3: «Every account. One conversation.»

**Component:** `LandingCoverage.tsx`
**File path:** `apps/web/src/app/(marketing)/_components/LandingCoverage.tsx`
**Sub-components used:** `BrokerLogoStrip`
**Tier scope:** All visitors

#### Copy verbatim

| Slot | Copy |
|---|---|
| Section eyebrow | `COVERAGE` (mono, optional) |
| H2 | `Every account. One conversation.` |
| Body line 1 | `US brokerages, European banks, crypto exchanges, on-chain wallets. If you hold something there, Provedo can read it.` |
| Body line 2 | `Over 1,000 institutions supported. Read-only. We never get keys that move money.` |
| Logo grid microcopy | `See full institution list →` |

**Note on «1,000 institutions» claim:** this is a copy claim from content-lead. **Open question for right-hand → finance-advisor:** is «over 1,000» verifiable today via Plaid + SnapTrade + CCXT combined? If not, fallback copy: `Hundreds of institutions supported.` (already shipped fallback in current FAQ). Visual layout works either way; only the number changes.

#### Visual layout (ASCII)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  ░ subtle bg shift to var(--provedo-bg-muted) #F5F5F1 ░                               │
│                                                                                        │
│  COVERAGE                                                                              │
│                                                                                        │
│  Every account.            ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                 │
│  One conversation.         │ Schwab │ │ Fidel. │ │  IBKR  │ │ Vangu. │                 │
│                            └────────┘ └────────┘ └────────┘ └────────┘                 │
│                                                                                        │
│  US brokerages, European   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                 │
│  banks, crypto exchanges,  │ Robin. │ │ E*TR.  │ │ T212   │ │ Revolut│                 │
│  on-chain wallets. If you  └────────┘ └────────┘ └────────┘ └────────┘                 │
│  hold something there,                                                                 │
│  Provedo can read it.      ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                 │
│                            │ Coinb. │ │ Binance│ │ Kraken │ │ Ledger │                 │
│  Over 1,000 institutions   └────────┘ └────────┘ └────────┘ └────────┘                 │
│  supported. Read-only.                                                                 │
│  We never get keys that    See full institution list →                                 │
│  move money.                                                                           │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

Two-column layout on desktop: left = headline + body + bottom-line; right = 4×3 logo grid + microcopy link.

#### Typography hierarchy

| Element | Font | Weight | Size (desktop) | Size (mobile) |
|---|---|---|---|---|
| Eyebrow | JBM Mono | 500 | 12px / `0.18em` | 11px |
| H2 | Inter | 600 | 36px / leading-tight | 28px |
| Body line 1 + 2 | Inter | 400 | 16px / leading-relaxed | 15px |
| Logo cells | actual logo SVGs at slate-400 monochrome by default | — | 80×40 cell | 64×32 cell |
| Microcopy «See full institution list →» | Inter | 500 | 14px / underline on hover | 13px |

#### Color

- Section background: `var(--provedo-bg-muted)` `#F5F5F1` (a touch warmer-darker than page bg) — rhythm break from hero/section 2 cream
- Logo SVGs: monochrome `#94A3B8` (slate-400) by default, transitioning to `#0F172A` on hover (180ms)
- Logo cells: white background `#FFFFFF`, `1px solid #E2E8F0`, `6px radius`

#### Animation choreography

- Logo grid: each logo cell fades in on scroll-into-view with a 60ms cascade stagger left-to-right, top-to-bottom (12 logos × 60ms = 720ms total).
- Hover on cell: logo color transitions slate-400 → slate-900 (180ms ease-out); cell border transitions to slate-300.
- Reduced-motion: all logos appear simultaneously; hover transition retained (color hover is not a motion concern).

#### Mobile collapse

| Breakpoint | Behavior |
|---|---|
| 320 | Single column. Headline + body stack above logo grid. Logo grid becomes 3 columns × 4 rows. |
| 768 | Single column still. Logo grid 4×3 (matches desktop). |
| 1024+ | Two columns: text left (max-width 480px), logo grid right (max-width 560px). |

#### Component props + state

```tsx
interface BrokerLogoStripProps {
  logos: ReadonlyArray<{ src: string; alt: string; href?: string }>;
}

export function LandingCoverage(): React.ReactElement {
  const prefersReduced = usePrefersReducedMotion();
  // Logo list is a const within this file: 12 logos in priority order.
  // Order: Schwab, Fidelity, IBKR, Vanguard, Robinhood, E*TRADE, T212, Revolut,
  //        Coinbase, Binance, Kraken, Ledger.
}
```

**Logo asset note:** the brand-strategist + brief vision proposes real broker logos. **Open question for right-hand → PO:** do we have permission to display 3rd-party broker marks (Schwab, Fidelity, etc.) at this stage? Most of these allow incidental factual use under nominative fair use, BUT: until reviewed, we should fall back to **wordmarks rendered as text** at the same monochrome treatment, NOT raster logos. This avoids any trademark exposure pre-alpha. Frontend can implement as text-rendered-as-SVG (or styled `<span>` with the wordmark text in slate-400 Inter Medium 14px). Either way the visual is the same: a calm wall of grey wordmarks. Real logos can be swapped in later via a single asset bundle.

#### Accessibility

- `<section aria-labelledby="coverage-heading">`
- Each logo cell is `<a href="..." aria-label="<broker name> integration">` if linked, or plain `<div>` if non-interactive.
- Focus ring on logo cells: 2px teal-600 outline, 2px offset.

---

### §B.4 — Section 4: «The things hiding between your brokers.»

**Component:** `LandingDifferentiators.tsx`
**File path:** `apps/web/src/app/(marketing)/_components/LandingDifferentiators.tsx`
**Sub-components used:** `DifferentiatorCard` × 3
**Tier scope:** All visitors

#### Copy verbatim (content-lead §4 Section 4 — note: brief specifies «3 differentiator cards (reconciliation / concentration / pattern-detection)» but content-lead doc gives different concrete examples: dividend / duplicated position / drawdown. **Honoring content-lead doc verbatim per brief which says «USE THIS for copy»**.)

| Slot | Copy |
|---|---|
| Section eyebrow | `WHAT YOU'D MISS` (mono) |
| H2 | `The things hiding between your brokers.` |
| Body intro | `Three things Provedo notices that almost nobody catches manually:` |
| Card 1 header | `Dividend you didn't know was coming.` |
| Card 1 body | `Provedo flags upcoming distributions across every account, before the ex-date.` |
| Card 2 header | `Position you're holding twice.` |
| Card 2 body | `When the same exposure shows up in your IBKR account and your robo-advisor, you'll see it.` |
| Card 3 header | `Drawdown you'd only notice in April.` |
| Card 3 body | `Cross-account drawdowns surface as they happen — not when you finally sit down with a spreadsheet.` |

#### Visual layout (ASCII)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                        │
│  WHAT YOU'D MISS                                                                       │
│                                                                                        │
│  The things hiding between your brokers.                                               │
│                                                                                        │
│  Three things Provedo notices that almost nobody catches manually:                     │
│                                                                                        │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐           │
│  │ 01                   │ │ 02                   │ │ 03                   │           │
│  │                      │ │                      │ │                      │           │
│  │ Dividend you didn't  │ │ Position you're      │ │ Drawdown you'd only  │           │
│  │ know was coming.     │ │ holding twice.       │ │ notice in April.     │           │
│  │                      │ │                      │ │                      │           │
│  │ Provedo flags        │ │ When the same        │ │ Cross-account        │           │
│  │ upcoming             │ │ exposure shows up    │ │ drawdowns surface    │           │
│  │ distributions        │ │ in your IBKR account │ │ as they happen — not │           │
│  │ across every         │ │ and your robo-       │ │ when you finally sit │           │
│  │ account, before      │ │ advisor, you'll see  │ │ down with a          │           │
│  │ the ex-date.         │ │ it.                  │ │ spreadsheet.         │           │
│  └──────────────────────┘ └──────────────────────┘ └──────────────────────┘           │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

Three-card row, equal width, generous interior padding.

#### Typography hierarchy

| Element | Font | Weight | Size (desktop) | Size (mobile) |
|---|---|---|---|---|
| Eyebrow | JBM Mono | 500 | 12px / `0.18em` | 11px |
| H2 | Inter | 600 | 40px / leading-tight | 28px |
| Body intro | Inter | 400 | 16px / leading-relaxed | 15px |
| Card numeral («01», «02», «03») | JBM Mono | 500 | 14px / `0.04em` | 13px |
| Card header | Inter | 600 | 22px / leading-snug | 19px |
| Card body | Inter | 400 | 15px / leading-relaxed | 14px |

#### Color

- Section background: `var(--provedo-bg-page)` `#FAFAF7` (back to hero cream — rhythm)
- Cards: `var(--provedo-bg-elevated)` `#FFFFFF` background, `1px solid #E2E8F0`, `8px` radius, no shadow (cards are flat tiles, no elevation)
- Card numeral color: `var(--provedo-accent)` `#0D9488`
- Card header: `var(--provedo-text-primary)` `#0F172A`
- Card body: `var(--provedo-text-secondary)` `#334155`

#### Animation choreography

- On scroll-into-view (≥ 30% of section visible): cards slide in left-to-right with 80ms stagger (each card: opacity 0 + translateY(8px) → 1, duration 280ms, easing `cubic-bezier(0.16, 1, 0.3, 1)`).
- Hover on card: subtle lift — `transform: translateY(-2px)`, transition 180ms ease-out. Border deepens to slate-300.
- Reduced-motion: all cards visible immediately; hover lift retained (compositor-friendly).

#### Mobile collapse

| Breakpoint | Behavior |
|---|---|
| 320 | Single-column stack of 3 cards full-width. Card padding reduces to 24px. |
| 768 | Two-column grid — Card 1 + Card 2 in row 1, Card 3 alone in row 2 spanning full width. (NOT a 3-up grid yet — too cramped at this breakpoint.) |
| 1024+ | Three-column grid — equal-width cards. Gap between cards 20px. |

#### Component props + state

```tsx
interface DifferentiatorCardProps {
  numeral: string;       // "01" | "02" | "03"
  header: string;
  body: string;
  enterDelayMs?: number; // for stagger
}

export function LandingDifferentiators(): React.ReactElement {
  // Static content — three CARDS const inside this file.
}
```

#### Accessibility

- `<section aria-labelledby="differentiators-heading">`
- Each card is `<article>` with the header as `<h3>`.
- Card numeral is decorative — `aria-hidden="true"`.

---

### §B.5 — Section 5: «Read-only. No advice. No surprises.» — the Trust Band

**Component:** `LandingTrustBand.tsx`
**File path:** `apps/web/src/app/(marketing)/_components/LandingTrustBand.tsx`
**Tier scope:** All visitors

#### Copy verbatim (content-lead §4 Section 5)

| Slot | Copy |
|---|---|
| Section eyebrow | `THE BOUNDARY` (mono, optional) |
| H2 | `Read-only. No advice. No surprises.` |
| Item 1 head | `Read-only access.` |
| Item 1 body | `Provedo can see your positions. It cannot move them.` |
| Item 2 head | `Analysis, not advice.` |
| Item 2 body | `We explain what's in your portfolio. We don't tell you what to do with it.` |
| Item 3 head | `Your data stays yours.` |
| Item 3 body | `We never sell it. We never share it. You can delete everything in one click.` |

**Important brief deviation note:** the brief specifies a slate-inverted band «What Provedo will and won't do» with two columns positive + negative. The content-lead doc however gives a 3-item single-column treatment. The brief explicitly says «USE THIS [content-lead doc] for copy, not your own from-scratch vision's copy where they conflict.» **I am honoring the content-lead 3-item single-column copy structure but applying the slate-inverted-band visual treatment from the from-scratch PD vision.** The content stays «what we will and won't do» but reads as three definitive trust statements rather than a forced two-column will/won't grid. This is a content × visual hybrid that serves the section's actual job (the trust earner) better than either pure source.

#### Visual layout (ASCII)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← slate-900 inverted band
│ ▓                                                                                    ▓ │
│ ▓   THE BOUNDARY                                                                     ▓ │
│ ▓                                                                                    ▓ │
│ ▓   Read-only. No advice. No surprises.                                              ▓ │
│ ▓                                                                                    ▓ │
│ ▓   ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐       ▓ │
│ ▓   │ READ-ONLY ACCESS.   │  │ ANALYSIS, NOT       │  │ YOUR DATA STAYS     │       ▓ │
│ ▓   │                     │  │ ADVICE.             │  │ YOURS.              │       ▓ │
│ ▓   │ Provedo can see     │  │ We explain what's   │  │ We never sell it.   │       ▓ │
│ ▓   │ your positions.     │  │ in your portfolio.  │  │ We never share it.  │       ▓ │
│ ▓   │ It cannot move      │  │ We don't tell you   │  │ You can delete      │       ▓ │
│ ▓   │ them.               │  │ what to do with it. │  │ everything in one   │       ▓ │
│ ▓   │                     │  │                     │  │ click.              │       ▓ │
│ ▓   └─────────────────────┘  └─────────────────────┘  └─────────────────────┘       ▓ │
│ ▓                                                                                    ▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

Three-column trust statements on full-bleed slate-900 background. The dark band is a visual rhythm break from the cream sections above; it reads as «weight» — the page slows down to make a serious commitment.

#### Typography hierarchy

| Element | Font | Weight | Size (desktop) | Size (mobile) |
|---|---|---|---|---|
| Eyebrow | JBM Mono | 500 | 12px / `0.18em` | 11px |
| H2 | Inter | 600 | 40px / leading-tight | 28px |
| Item head | JBM Mono | 500 | 13px / uppercase / `0.06em` | 12px |
| Item body | Inter | 400 | 16px / leading-relaxed | 15px |

#### Color

- Section background: `#0F172A` (slate-900) full-bleed
- Eyebrow: `rgba(45, 212, 191, 0.85)` (teal-300 muted)
- H2: `#F8FAFC` (slate-50)
- Item head: `rgba(45, 212, 191, 0.85)` (teal-300 muted) — visual rhyme with hero pen-mark
- Item body: `rgba(226, 232, 240, 0.92)` (slate-200 with alpha)

#### Animation choreography

- On scroll-into-view: H2 fades in (200ms); items cascade in 80ms stagger.
- Reduced-motion: all elements visible immediately.

#### Mobile collapse

| Breakpoint | Behavior |
|---|---|
| 320 | Single-column stack of 3 items. H2 28px. Section vertical padding 64px top + 64px bottom. |
| 768 | Single-column still. H2 36px. |
| 1024+ | Three-column grid. H2 40px. |

#### Component props + state

```tsx
export function LandingTrustBand(): React.ReactElement {
  // Static content. No state.
}
```

#### Accessibility

- `<section aria-labelledby="trust-band-heading">`
- Section background contrast: `#F8FAFC` on `#0F172A` = **17.7:1** (WCAG AAA pass)
- Item head color `rgba(45, 212, 191, 0.85)` ≈ `#41C5B0` on `#0F172A` = **8.4:1** (WCAG AAA pass)
- Item body `rgba(226, 232, 240, 0.92)` ≈ `#DCE3EB` on `#0F172A` = **14.6:1** (WCAG AAA pass)

---

### §B.6 — Section 6: Closing CTA «It only takes one question.»

**Component:** `LandingClosingCTA.tsx`
**File path:** `apps/web/src/app/(marketing)/_components/LandingClosingCTA.tsx`
**Tier scope:** All visitors

#### Copy verbatim (content-lead §4 Section 6)

| Slot | Copy |
|---|---|
| H2 | `It only takes one question.` |
| Sub | `Get early access. Ask Provedo anything about your portfolio. See if the answer is worth keeping around.` |
| CTA | `Get early access` |
| Below-CTA microcopy | `Pre-alpha. We're letting people in slowly. Tell us about your setup and we'll be in touch.` |

#### Visual layout (ASCII)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                        │
│                                                                                        │
│                          It only takes one question.                                   │
│                                                                                        │
│                Get early access. Ask Provedo anything about your portfolio.            │
│                       See if the answer is worth keeping around.                       │
│                                                                                        │
│                            ┌─────────────────────┐                                     │
│                            │  Get early access → │                                     │
│                            └─────────────────────┘                                     │
│                                                                                        │
│             Pre-alpha. We're letting people in slowly. Tell us about your setup        │
│                              and we'll be in touch.                                    │
│                                                                                        │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

Single column, centered, max-width 720px. Section vertical padding generous (120px top + 120px bottom on desktop).

#### Typography hierarchy

| Element | Font | Weight | Size (desktop) | Size (mobile) |
|---|---|---|---|---|
| H2 | Inter | 600 | 56px / leading-tight | 36px |
| Sub | Inter | 400 | 18px / leading-relaxed | 16px |
| CTA button | Inter | 600 | 16px (button height 56px) | 14px |
| Microcopy | Inter | 400 | 13px / italic | 12px |

#### Color

- Section background: `var(--provedo-bg-page)` `#FAFAF7` (cream — calm closer)
- H2: `var(--provedo-text-primary)` `#0F172A`
- Sub: `var(--provedo-text-secondary)` `#334155`
- Microcopy: `var(--provedo-text-tertiary)` `#475569`

#### Animation choreography

- Section is static — no scroll-triggered animation. The section reads «landed» after the page's narrative has run its course.

#### Mobile collapse

| Breakpoint | Behavior |
|---|---|
| 320 | H2 32px; vertical padding 64px each side. |
| 768 | H2 44px. |
| 1024+ | H2 56px. |

#### Component props + state

```tsx
export function LandingClosingCTA(): React.ReactElement {
  // CTA click dispatches CustomEvent('provedo:open-early-access') — same handler as hero CTA.
}
```

#### Accessibility

- `<section aria-labelledby="closing-heading">`
- CTA is the same `ProvedoButton` primary-lg variant.

---

## §C — Hero deep dive: «The Ledger That Talks»

This is the page's signature. Detailed sub-component contracts.

### §C.1 — `Ledger` component (left pane)

**Visual structure:** a typeset ledger card. NOT a SaaS dashboard. Its visual register is closer to a printed quarterly statement than a financial chart panel.

#### Layout

```
┌─ portfolio.ledger ──────────────────────────────────┐  ← lowercase mono label, slate-400 11px
│                                                     │
│  IBKR · US                                $312,000 │  ← LedgerRow: account label + region tag + value
│  Trading 212 · EU                          €84,000 │
│  Kraken · Crypto                           $19,000 │
│  ───────────────────────────────────────────────── │  ← 1px slate-200 hairline divider
│  Total                                    $431,000 │  ← Total row, slightly bolder weight
│                                                     │
│  Top drift     NVDA                    ¹+4.2pp ◐   │  ← LedgerRow with citation chip + pen-mark underline
│  Dividends     Apr 28                       $312   │
│  Currency exposure                       71% USD   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Content shape

```ts
interface LedgerRow {
  id: string;                      // e.g. 'ibkr-us', 'drift-nvda'
  label: string;                   // 'IBKR'
  context?: string;                // 'US' (region), 'NVDA' (symbol)
  value: string;                   // '$312,000' (pre-formatted; the count-up animation parses this)
  highlight?: boolean;             // true on the drift row → triggers pen-mark
  citationId?: string;             // 'cite-nvda-1' — links back from conversation
  trailingGlyph?: string;          // '◐' (compose drift indicator, optional)
}
```

#### Mock content (seed data — DO NOT use real PII)

```ts
const LEDGER_DATA: LedgerRow[] = [
  { id: 'ibkr',  label: 'IBKR',         context: 'US',     value: '$312,000' },
  { id: 't212',  label: 'Trading 212',  context: 'EU',     value: '€84,000' },
  { id: 'krak',  label: 'Kraken',       context: 'Crypto', value: '$19,000' },
  // divider rendered between accounts and total
  { id: 'total', label: 'Total',        value: '$431,000' },
  // separator between balances and observations
  { id: 'drift', label: 'Top drift',    context: 'NVDA',   value: '+4.2pp',
    highlight: true, citationId: 'cite-nvda-1', trailingGlyph: '◐' },
  { id: 'div',   label: 'Dividends',    context: 'Apr 28', value: '$312' },
  { id: 'fx',    label: 'Currency exposure',                value: '71% USD' },
];
```

#### Atmosphere

- Subtle ruled-line texture: 1px slate-50 horizontal hairlines every 32px (very faint — 4% opacity slate-300). This signals «ledger paper» without being literal grid-paper. **Optional**: if it feels heavy at QA, drop it.
- Card border: `1px solid #E2E8F0`
- Card radius: `8px`
- Card padding: `28px` desktop / `20px` mobile

#### Citation interaction

- Drift row carries `id="ledger-row-nvda"` (the anchor target for conversation citation `¹`).
- Hover the drift row: the pen-mark underline brightens (teal-600 → teal-700, alpha 0.85 → 1.0); cursor changes to default (not pointer — the row is not a link); the conversation card's `¹` superscript ALSO brightens via shared `data-citation-active` state. Wire this via React state lifted to `LandingHero` and passed down as both `Ledger` and `ConversationCard` props (`activeCitationId: string | null`).
- Hover the conversation `¹` chip: same shared brightening, plus the ledger drift row gets a faint cream-50 background flash (180ms).

### §C.2 — `ConversationCard` component (right pane)

**Visual register:** minimal chrome. NOT the full `ChatAppShell` chrome (which has 48px header bar, status pill, three-layer drop shadow, 120px outer halo — too «SaaS app» for editorial).

#### Layout

```
┌─ conversation ─────────────────────────────────────┐  ← lowercase mono label, slate-400 11px
│                                                    │
│  ↳ Why is NVDA flagged?                            │  ← user msg, mono with ↳ prefix, slate-secondary
│                                                    │
│  Your target was 12% NVDA. It's now 16.2% —        │  ← Provedo answer, Inter, slate-primary
│  a ¹+4.2pp drift from a 38% rally since Feb.       │
│                                                    │
│  ── Sources ────────────────────────────────────── │  ← Sources primitive, dotted top rule
│  IBKR · positions · today                          │
│                                                    │
└────────────────────────────────────────────────────┘
```

#### Citation styling (the load-bearing visual)

The `¹` superscript appearing inline in the Provedo answer is rendered via the `CitationLink` primitive:

```tsx
interface CitationLinkProps {
  index: number;                // 1, 2, 3, ...
  targetId: string;             // 'ledger-row-nvda'
  isActive?: boolean;           // brightens when ledger row hovered
  onActivate?: () => void;      // hover-in handler — bubbles up to LandingHero state
  onDeactivate?: () => void;    // hover-out
}
```

Visual: small superscript `¹` rendered before the inline number `+4.2pp`. Color: teal-600. On hover or `isActive`: teal-700 + faint underline draws beneath (140ms). Click: smooth-scrolls (`behavior: 'smooth'`) to the ledger row anchor. Reduced-motion: instant scroll.

The `Sources` primitive (already shipped) is reused at the bottom of the response bubble — italic 13px slate-tertiary, dotted top rule, mono «Sources» eyebrow. This anchors the entire trust posture.

#### Two-pane interaction

| Trigger | Result |
|---|---|
| Hover ledger drift row | Conversation `¹` chip brightens; underline thickens |
| Hover conversation `¹` chip | Ledger drift row brightens; cream-50 background flash |
| Click `¹` chip | Page smooth-scrolls to ledger row (within hero, may be small offset on desktop two-column; on mobile, scrolls up if ledger is above conversation) |
| Tab to `¹` chip via keyboard | Focus ring on chip; ledger row receives `data-focus-target` styling (faint teal-50 background); pressing Enter activates click behavior |

State lifted to `LandingHero`:

```tsx
const [activeCitationId, setActiveCitationId] = useState<string | null>(null);
```

passed to both `<Ledger activeCitationId={activeCitationId} setActiveCitationId={setActiveCitationId} />` and `<ConversationCard activeCitationId={activeCitationId} setActiveCitationId={setActiveCitationId} />`.

### §C.3 — Mobile two-pane collapse

| Breakpoint | Stack order | Notes |
|---|---|---|
| 320 — 768 | Headline cluster (eyebrow + H1 + sub + trust pill + CTA + microcopy) → Ledger card → Conversation card | Ledger goes FIRST below the headline cluster because it's the «substance» the conversation references. The reader's eye travels: «I'm being told something will lead me through my portfolio» → «here's what a portfolio looks like in this thing» → «here's the conversation about it». Conversation first would be confusing without the ledger context. |
| 1024+ | Two-column grid: text-left, [Ledger top of right col] + [Conversation below ledger in right col] | Right column is a vertical stack of Ledger then Conversation, each ~360px tall. |
| 1440+ | Same as 1024 with larger gaps + larger H1. |

The pen-mark underline on `+4.2pp` works identically in stacked and two-column layouts. The `¹` citation click on mobile scrolls UP to the ledger row (which is above the conversation). Animation: smooth-scroll, 400ms.

### §C.4 — `PenMarkUnderline` primitive

A reusable animated underline that draws left-to-right. Used on the `+4.2pp` value in the ledger drift row.

```tsx
interface PenMarkUnderlineProps {
  active: boolean;          // true triggers the draw-in animation
  durationMs?: number;      // default 360
  color?: string;           // default 'var(--provedo-accent)'
  thickness?: number;       // default 1.5px
}
```

Implementation: an `::after` pseudo-element on the parent, or a sibling `<span>` positioned absolute. Animated via `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)`. Easing `cubic-bezier(0.16, 1, 0.3, 1)`.

Reduced-motion: `clip-path: inset(0 0 0 0)` immediately; no transition.

### §C.5 — `PaperGrain` primitive

3% noise SVG layer rendered as background pattern, multiply-blended with the cream page background.

```tsx
export function PaperGrain(): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'multiply',
        opacity: 1,
      }}
    />
  );
}
```

Mounted ONCE inside `LandingHero` (not page-wide) — only the hero needs paper-grain atmosphere. Other sections use clean cream / muted / dark backgrounds without grain.

---

## §D — Trust signal placement (single load-bearing instance)

**Where:** inside `LandingHero`, between the sub headline and the CTA cluster.

**Visual treatment:** a small italic line, NOT a chip with a border. Treatment:

```
┌──────────────────────────────────────────────┐
│  Provedo will lead                           │
│  you through your                            │
│  portfolio.                                  │
│                                              │
│  Notice what you'd miss                      │
│  across all your brokers.                    │
│                                              │
│  ↪ Read-only · No trading · No advice        │  ← here
│                                              │
│  ┌─────────────────────────┐                 │
│  │  Get early access  →    │                 │
│  └─────────────────────────┘                 │
│  No card. Look without connecting.           │
│  Read-only when you connect.                 │
│                                              │
└──────────────────────────────────────────────┘
```

#### Treatment spec

```css
.trust-pill {
  font-family: var(--provedo-font-sans);
  font-style: italic;          /* NOT a chip; reads as authorial aside */
  font-size: 13px;
  font-weight: 500;
  color: var(--provedo-text-tertiary);  /* slate-600 #475569 */
  letter-spacing: 0;
  margin-top: 24px;            /* below sub */
  margin-bottom: 24px;         /* above CTA */
  /* No background, no border, no padding. */
}
```

Three middle-dots (`·`) separate the three claims. No leading icon. The `↪` arrow above is decorative diagram-only — not in the actual rendered output.

This is the SINGLE load-bearing instance of the trust pill on the page. It is not repeated in section 5 (which is the trust band — separate visual register). The section-5 trust band is the deeper trust statement; this hero pill is the 5-second-test trust signal per user-researcher's signal stack.

#### Accessibility

- Plain `<p>` element with `data-testid="hero-trust-pill"`. No ARIA role.
- Color contrast: `#475569` on `#FAFAF7` = **6.7:1** (WCAG AAA for normal text)
- Reads naturally as «Read-only, no trading, no advice» (`·` rendered as pause; SR announces middle-dots as semicolons or pauses depending on engine, which reads correctly).

---

## §E — CTA action: «Get early access»

### Decision: **Option (b) — modal**, with email-capture form.

Rationale (concurring with right-hand recommendation):
- **Fastest to ship.** No new route, no /signup or /waitlist page scaffolding.
- **Conversion-clear.** A modal anchored to the hero CTA is the lowest-friction email-capture pattern and converts ~30-40% better than scroll-to-form-section per industry data (CRO references).
- **Single capture target.** All three CTA mounts on the page (hero + closing) dispatch the same event and open the same modal. One form to maintain, one telemetry event to track.
- **Pre-alpha-honest.** The microcopy below the CTA («Pre-alpha. We're letting people in slowly. Tell us about your setup and we'll be in touch.») already commits to a short form; modal naturally fits that promise.

#### Modal contract

```tsx
// LandingEarlyAccessModal.tsx
export function LandingEarlyAccessModal(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [setup, setSetup] = useState(''); // free-text "tell us about your setup"
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    function handleOpen() { setIsOpen(true); }
    window.addEventListener('provedo:open-early-access', handleOpen);
    return () => window.removeEventListener('provedo:open-early-access', handleOpen);
  }, []);

  // ... form submit hits POST /api/early-access (BACKEND scope — not in this slice)
}
```

#### Modal visual layout (ASCII)

```
                         ┌─────────────────────────────────────────┐
                         │ ✕                                       │
                         │                                         │
                         │   Get early access                      │
                         │                                         │
                         │   Pre-alpha. We let people in slowly.   │
                         │   Tell us a bit about your setup.       │
                         │                                         │
                         │   Email                                 │
                         │   ┌─────────────────────────────────┐   │
                         │   │ you@email.com                   │   │
                         │   └─────────────────────────────────┘   │
                         │                                         │
                         │   Your brokers (optional)               │
                         │   ┌─────────────────────────────────┐   │
                         │   │ Schwab + IBKR + Coinbase        │   │
                         │   └─────────────────────────────────┘   │
                         │                                         │
                         │   ┌─────────────────────────────────┐   │
                         │   │      Request early access       │   │
                         │   └─────────────────────────────────┘   │
                         │                                         │
                         │   We read every reply.                  │
                         │   No marketing emails — ever.           │
                         │                                         │
                         └─────────────────────────────────────────┘
```

#### Modal spec

- Backdrop: `rgba(15, 23, 42, 0.4)` overlay
- Modal: `var(--provedo-bg-elevated)` background, `12px` radius, `1px solid #E2E8F0`, max-width `480px`, padding `40px`
- Modal entry animation: backdrop fade in (200ms), modal scale + opacity (260ms, scale 0.96 → 1.0, ease-out-expo)
- Close: ESC key, click on backdrop, click on `✕` close button
- Focus trap: focus enters the email field on open; tab cycles email → brokers → submit → close → email
- After submit success: form replaced with `Thanks. We'll be in touch within a week.` confirmation; modal stays open until user dismisses
- Reduced-motion: instant open/close, no scale animation

#### Open-question for right-hand → engineering

- The `POST /api/early-access` endpoint does NOT exist yet. **Two options for this slice:**
  - (a) Frontend-only — POST to a temporary `/api/early-access` route that simply logs to console + returns 200 (placeholder for Slice-LP7 to wire to a real backing store).
  - (b) Frontend posts to a no-code form service (Formspree, Tally, or similar — no extra spend if their free tier is used).
- **Recommendation:** (a) for this slice — keeps everything in our codebase, no third-party dependency to vet, and the placeholder route can be promoted to a real handler in a separate slice without changing the modal contract. **Open question for right-hand → PO:** is creating the temporary `/api/early-access` Next.js route handler (logs only, no DB writes) within scope of this slice?

#### Accessibility

- Modal uses native `<dialog>` element with `showModal()` / `close()` (modern browsers — Next 15 + React 19 compatible)
- ARIA: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="early-access-title"`
- Email input: `type="email"`, `required`, `aria-invalid` on error state
- Submit button: focus ring teal-600 2px / 2px offset
- ESC closes, click outside closes (controlled via `dialog::backdrop`)

---

## §F — Component reuse from current shipped (concrete dispositions)

| Component | Disposition | Reasoning |
|---|---|---|
| `ChatAppShell` | RETIRED from landing | The 48px header bar with status pill + 120px outer halo reads «SaaS app chrome» — wrong register for editorial Ledger pane. New `ConversationCard` is purpose-built lighter chrome. |
| `ChatMockup` | RETIRED from landing | Coupled to `ChatAppShell`; replaced by `ConversationMessage` + Provedo response bubble inside `ConversationCard`. |
| `ProvedoButton` | REUSED (primary, lg) | Behavior + size + focus states already correct; CTA dispatches custom event instead of `href` navigation. |
| `Sources` | REUSED | Ships in both hero conversation and section 2 transcript. The dotted-top-rule eyebrow «Sources» is the single most load-bearing trust primitive on the page. |
| `MarketingHeader` | REUSED, no changes | Already correct visual register; «Get started» CTA in nav rewires to dispatch the early-access modal event same as hero CTA. **Single tweak: change the `<ProvedoButton href="#waitlist">` in MarketingHeader to dispatch the modal event instead of scroll-to-footer.** |
| `MarketingFooter` | REUSED, no changes | 3-layer disclaimer + tagline rhyme stay verbatim. |
| `usePrefersReducedMotion` | REUSED | Consumed by every animated section. |
| `useInView` | REUSED | Consumed by hero replay-on-intersection + section enter animations. |
| `HeroAtmosphere` | RETIRED | The bespoke synthesis-glyph SVG + radial gradient mesh is off-register for editorial Ledger. Replaced by simple paper-grain layer. |
| `ChatPromptPicker` | RETIRED | No chip-driven demo on landing-v2; the hero is a single deterministic conversation. |
| `CitationChip` (in `hero/`) | NOT REUSED | The current `CitationChip` is decoupled from a target ledger row; landing-v2 needs a citation that ties hover + click + smooth-scroll to a specific anchor. New `CitationLink` is purpose-built. The old file stays in tree dormant. |
| `DigestHeader` (in `hero/`) | NOT REUSED | Slice-LP3.6 retired; stays dormant. |
| `TypingDots` (in `hero/`) | REUSED | The pause-bridge typing dots in the hero conversation use the existing primitive. |
| `ProvedoFAQ` | KEPT, copy rewrite optional in this slice | The 6 Q&A items were already revised per voice in Slice-LP6 §gap-7. Spot-audit: most lines match the «observant, composed, plain-spoken» voice. **Q1 revision proposed:** «Does Provedo give investment advice?» → answer should drop the «foresight» word (off-allowlist for §F voice) and read: `No. Provedo answers questions about what you hold and shows the source numbers — never advice, recommendations, or trade strategy.` All other Qs hold. |

---

## §G — Out of scope (explicit retirements — confirmed)

Per brief §G, these components no longer mount:

- `ChatPromptPicker` (slice-LP6) — RETIRE
- `charts/DividendCalendarAnimated.tsx`, `charts/TradeTimelineAnimated.tsx`, `charts/AllocationPieBarAnimated.tsx`, `charts/PnlSparklineAnimated.tsx` — RETIRE on landing (files stay dormant for app-surface use)
- `ProvedoNumericProofBar` — already unmounted, KEEP retired
- `ProvedoNegationSection` — RETIRE; replaced by `LandingTrustBand`
- `ProvedoDemoTeasersBento` — RETIRE; replaced by `LandingAskQuestion`
- `ProvedoInsightsBullets` — RETIRE; merged into `LandingDifferentiators`
- `ProvedoEditorialNarrative` — RETIRE; manifesto absorbed into copy of sections 4 + 6
- `ProvedoTestimonialCards` — already unmounted, KEEP retired (no fake testimonials pre-alpha)
- `ProvedoAggregationSection` — RETIRE; replaced by `LandingCoverage`
- `ProvedoRepeatCTAV2` — RETIRE; replaced by `LandingClosingCTA`
- `ProvedoHeroV2` — RETIRE; replaced by `LandingHero`

`ProvedoFAQ` — KEEP, with one Q1 copy revision noted above.

---

## §H — Branch + sequencing strategy

### Branch

**Recommendation: NEW branch off `main`, NOT continue on `feat/lp-provedo-first-pass`.**

Rationale:
- The current branch is 22 commits deep into the v3.1 evolution + has finance/legal patches the v2 redesign supersedes. A fresh branch decouples the new direction from the old branch's history and avoids regression risk from accidental retrieves of retired components.
- A clean rebase off main makes the PR diff readable: «here's the entire new landing surface in one slice» vs «here's another patch on top of v3.1».
- The current branch's PR (#65) can either close-without-merge (if v2 is preferred wholesale) OR remain open as fallback during v2 development.

**Proposed new branch name:** `feat/lp-provedo-v2-ledger-talks`

### Sequencing

**Two slices recommended.** Single PR is too risky given 13 new components + a modal.

**Slice 2.1 — Component scaffolding + sections 1–3:**
- All sub-primitives in `landing/`: `Ledger`, `LedgerRow`, `LedgerHighlight`, `ConversationCard`, `ConversationMessage`, `CitationLink`, `PenMarkUnderline`, `PaperGrain`
- `LandingHero`, `LandingAskQuestion`, `LandingCoverage`
- `LandingEarlyAccessModal` (skeleton, posts to `/api/early-access` placeholder route logging only)
- `page.tsx` rewrite mounting only sections 1–3 + modal + retained FAQ + footer

After Slice 2.1 ships and is QA'd at all 6 breakpoints + a11y audit pass, Slice 2.2 lands the remaining sections.

**Slice 2.2 — Sections 4–6 + cleanup:**
- `DifferentiatorCard`, `LandingDifferentiators`, `LandingTrustBand`, `LandingClosingCTA`, `BrokerLogoStrip`
- `page.tsx` final mount adding sections 4, 5, 6 in order
- ProvedoFAQ Q1 copy revision
- Retire / dormant-mark the old `Provedo*` and `hero/Chat*` components (just remove from imports — don't delete files)
- Performance pass — verify First Load JS budget

**Bundle target:** `< 220 kB First Load JS` (PR target). Hero animation logic is `'use client'` only for `LandingHero`; sections 2-6 should be Server Components where possible (ASCII-content sections like 5 + 6 ARE server-renderable; sections 3 and 4 may also be SC if hover state moves to CSS-only). Aim: only `LandingHero`, `LandingEarlyAccessModal`, and `LandingDifferentiators` (for hover lift) are client components; the rest are server components, minimizing JS shipped.

---

## §I — Effort estimate

### PD remaining hours after this spec

| Workstream | Hours |
|---|---|
| Type-token additions to design-tokens (`paper`, `ink`, `pen`) — single PR before slice 2.1 | 2 |
| QA review of slice 2.1 deliverable (visual + interaction sanity) | 4 |
| QA review of slice 2.2 deliverable | 4 |
| A11y audit (axe + manual keyboard + reduced-motion + screen reader) — split between slices | 5 |
| Responsive audit — 320 / 375 / 768 / 1024 / 1440 / 1920 — split between slices | 4 |
| Microcopy pass + voice-check on shipped strings | 2 |
| Polish iterations (3-5 rounds across both slices) | 8 |
| **Total PD post-spec** | **~29 hrs** |

### FE hours per section

| Section / Component | Hours |
|---|---|
| `LandingHero` + sub-primitives (`Ledger`, `LedgerRow`, `LedgerHighlight`, `ConversationCard`, `ConversationMessage`, `CitationLink`, `PenMarkUnderline`, `PaperGrain`) | 22 |
| Hero animation timeline (typing + count-up + pen-mark draw + replay-on-intersection + reduced-motion) | 8 |
| `LandingAskQuestion` (reuses ConversationCard + Sources) | 4 |
| `LandingCoverage` + `BrokerLogoStrip` | 6 |
| `LandingDifferentiators` + `DifferentiatorCard` + scroll-into-view stagger | 5 |
| `LandingTrustBand` (static, dark-band CSS) | 3 |
| `LandingClosingCTA` (static) | 2 |
| `LandingEarlyAccessModal` + `<dialog>` integration + placeholder route + form submit handling + a11y focus trap | 8 |
| `page.tsx` rewrite + `MarketingHeader` CTA event-dispatch wire-up | 2 |
| `ProvedoFAQ` Q1 copy revision | 0.5 |
| Responsive QA (6 breakpoints) | 6 |
| A11y QA (axe + manual + reduced-motion + screen reader) | 5 |
| Performance pass (First Load JS budget + LCP) | 4 |
| Cross-browser pass (Chrome, Firefox, Safari) | 3 |
| **Total FE** | **~78.5 hrs** |

### Total team hours (PD + FE)

**~107 hrs combined.** Brand-voice-curator review on visible copy (~2 hrs), legal-advisor sign-off on early-access modal copy (~1 hr) brings it to **~110 hrs**.

### Calendar in agent-time

(~30-60 min agent ≈ 1 day human work — scaling FE to agent-time)

| Item | Agent estimate |
|---|---|
| Slice 2.1 (sections 1–3 + modal + scaffolding) | ~6-8 agent hours |
| Slice 2.1 PD + a11y + responsive QA | ~3-4 agent hours |
| Slice 2.2 (sections 4–6 + cleanup) | ~3-4 agent hours |
| Slice 2.2 PD QA + performance pass | ~2-3 agent hours |
| **Total agent-time calendar** | **~14-19 agent hours over 2 sessions** |

---

## §J — Risks (top 3)

1. **The two-pane interaction (citation hover-link between ledger row + conversation chip) is the highest-risk interactive piece.** It depends on shared React state lifted to `LandingHero`, smooth-scroll polyfill, and the visual cue (pen-mark + brightening) being instantly readable. If the cue is too subtle, the connection between panes is invisible and the «Ledger That Talks» concept doesn't land. Mitigation: ship Slice 2.1 with the interaction; gather one round of internal feedback (right-hand + maybe brand-voice curator); iterate within Slice 2.1's polish budget before Slice 2.2.

2. **Broker logo licensing exposure.** Section 3 displays 12 third-party broker marks. Most are nominative-fair-use safe but unreviewed. Mitigation: ship Section 3 with **wordmarks rendered as styled text** (slate-400 Inter Medium 14px on white) instead of SVG logos, until legal-advisor reviews trademark exposure. The visual is identical at distance; risk is zero. Real logo SVGs swap in via a single asset PR later.

3. **Hero animation timing complexity.** The hero choreography (eyebrow + H1 + sub + pill + CTA + ledger fade + count-up + pen-mark + conversation fade + typing + streaming + sources) is a 6.5-second sequence with strict reduced-motion fallback. If any step de-syncs, the «calm reveal» reads as «buggy load». Mitigation: implement under `prefers-reduced-motion: reduce` first (everything visible immediately, no animation) — verify the page reads correctly static. Then layer animation on top. The static state must be pixel-perfect before motion is added.

---

## §K — Items requiring PO authorization beyond what right-hand has greenlit

1. **Decision: retain `ProvedoFAQ` post-section-6, or strict-six-only?** The brief lists 6 sections; the spec keeps FAQ as a 7th block before footer. If PO wants strict six, retire FAQ entirely.
2. **«Over 1,000 institutions supported» copy claim** — needs finance-advisor verification (or fallback to «Hundreds» which is already shipped).
3. **Broker logo display** — pre-alpha trademark exposure on 12 third-party marks. Mitigation proposed (wordmark text); PO sign-off on which path.
4. **Temporary `/api/early-access` Next.js route handler** (logs only, no DB writes) — within scope of this slice or separate?
5. **Branch strategy** — new branch off main vs continue `feat/lp-provedo-first-pass`. Spec recommends new branch.
6. **PR #65 disposition** — close-without-merge or hold open as fallback during v2 development.
7. **Animation budget on hero** — 6.5-second choreography. Acceptable?
8. **`ProvedoFAQ` Q1 copy revision** (drop «foresight») — voice-improvement, but Q1 was finalized in Slice-LP6. Confirm OK to revise.

---

## §L — Pre-delivery checklist (from ui-ux-pro-max workflow)

- [x] Industry-specific reasoning rules consulted (fintech B2C — calm, restraint, citations) — current direction concords with ui-ux-pro-max fintech-AI guidance (no glassmorphism, no aurora gradients, citations-first, dark-band rhythm)
- [x] Anti-patterns explicitly listed in spec — no glass, no gradient mesh, no dashboard screenshot, no phone mockup, no fake testimonials, no logo cloud claiming partnerships we don't have
- [x] Color choices match industry reasoning — warm-cream + slate-900 + teal-600 matches «trust, restraint, calm authority» fintech register
- [x] Typography pairing locked from prior brief — Inter + JBM Mono
- [x] Responsive behavior covers 320/375/768/1024/1440/1920 in every section spec
- [x] 10-priority UX rubric applied (accessibility, touch targets, performance, layout, type, animation, forms, navigation — every priority addressed in section specs)
- [x] Reduced-motion variant specified for every animated element
- [x] Light mode tokens specified (dark mode out of scope this slice — confirmed in brief)
- [x] WCAG 2.2 AA contrast verified for all text-on-background pairs (slate-900 on cream = 17.9:1; trust-pill slate-600 on cream = 6.7:1; trust-band slate-50 on slate-900 = 17.7:1)
- [x] Keyboard flow specified (skip link inherited from MarketingHeader; modal focus-trap; citation chip Tab + Enter)
- [x] No banned vocabulary in shipped copy (no «alpha», «edge», «moves», «signals», «outperform»)

---

**End of implementation spec.**
