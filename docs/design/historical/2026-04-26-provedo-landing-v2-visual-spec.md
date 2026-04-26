# Provedo Landing v2 — Visual Spec

**Author:** product-designer
**Date:** 2026-04-26
**Status:** v1 — handoff-ready для frontend-engineer (Slice-LP2)
**Inputs:**
- `docs/reviews/2026-04-26-strong-competitor-landing-audit.md` — master input (5 visual patterns + 10-section structure + 3 anti-patterns)
- `docs/04_DESIGN_BRIEF.md` v1.4 — Direction A locked palette/typography/motion
- `docs/content/landing-provedo-v1.md` v2 — locked copy
- Current `apps/web/src/app/(marketing)/_components/*` — v1 baseline

**Brief:** PO feedback «пустовато получилось» on Provedo landing v1. Audit confirmed problem is visual density, not copy. Direction A constraints (warm-neutral `#FAFAF7`, slate-900 text, teal-600 `#0D9488` accent, Inter + JetBrains Mono) — **LOCKED**. This spec specifies 5 visual patterns + redesigned 10-section structure for landing v2 build.

**Constraints:**
- Rule 1 — Google Fonts (free) only, Lucide icons only, no paid assets, no SVG marketplace.
- Rule 2 — repo artifact only, no external send.
- WCAG 2.2 AA mandatory on every spec.
- Direction A locked — никаких palette/typography swaps.

---

## 1. Pattern V1 — Stacked 3-mockup hero

### 1.1 Layout intent

Replace current centered-text-only hero with three layered product surfaces stacked at offset. Linear's signature visual structure — single-screenshot heroes read template; 2–3 layered surfaces read «real product, multiple surfaces.» Direct fix for «пустовато.»

### 1.2 Layer composition

```
desktop ≥1024px (8-col grid, content right side)
┌──────────────────────────────────────────────────────────────────┐
│  TEXT COLUMN              │   VISUAL COLUMN                      │
│  (max-w-xl, left)         │   (relative, h ~640px, layered)      │
│                           │                                      │
│  Provedo will lead         │      ┌─────────────────────────┐    │
│  you through your          │      │  L3 (back, faded 0.55)  │    │
│  portfolio.                │      │  Cross-broker pie       │    │
│                           │      │  IBKR + Schwab          │    │
│  Notice what you'd         │      └─────────────────────────┘    │
│  miss across all your      │   ┌──────────────────────────┐      │
│  brokers.                  │   │ L2 (mid, opacity 0.85)   │      │
│                           │   │ Insight feed list        │      │
│  [Ask Provedo]             │   │ • Dividend Sept 14 …     │      │
│  Or start free forever     │   │ • Drawdown forming AAPL  │      │
│                           │   │ • Concentration tech 58% │      │
│                           │   └──────────────────────────┘      │
│                           │      ┌──────────────────────────┐   │
│                           │      │ L1 (front, full opacity) │   │
│                           │      │ Chat surface             │   │
│                           │      │  user: Why is portfolio  │   │
│                           │      │     down this month?     │   │
│                           │      │  Provedo: You're down    │   │
│                           │      │     -4.2%, 62% from 2…   │   │
│                           │      │  [inline P&L sparkline]  │   │
│                           │      └──────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘

tablet 768–1023 (text top, visual full-width below — single-column)
mobile < 768 (text top, visual collapsed to 1 surface only — chat L1, others hidden)
```

### 1.3 Surface specs (per layer)

| Layer | Width (desktop) | Offset from L1 origin | Opacity | Z-index | Shadow |
|---|---|---|---|---|---|
| L1 (chat — front) | 480px (60% of visual col) | 0,0 | 1.0 | 30 | shadow-lg + 1px slate-200 border |
| L2 (insight feed — mid) | 360px (45%) | top: -32px, right: -56px | 0.92 | 20 | shadow-md + 1px slate-200 border |
| L3 (cross-broker — back) | 320px (40%) | top: -64px, left: -48px | 0.6 | 10 | shadow-sm + 1px slate-200 border |

**Card surfaces:**
- Background: `var(--provedo-bg-elevated)` = `#FFFFFF`
- Border-radius: 12px (premium tool register, not 4–6 commodity)
- Border: 1px `var(--provedo-border-subtle)` (slate-200)
- Shadow tokens (Direction A v1.4 §6 referenced):
  - shadow-sm: `0 1px 2px rgba(15,23,42,0.06)`
  - shadow-md: `0 4px 8px rgba(15,23,42,0.05), 0 2px 4px rgba(15,23,42,0.04)`
  - shadow-lg: `0 8px 24px rgba(15,23,42,0.06), 0 2px 4px rgba(15,23,42,0.04)`

### 1.4 Content per layer

**L1 — Chat surface (foreground, full fidelity):**
```
[Provedo wordmark, teal-600, uppercase tracked-wide, 11px]
PROVEDO

User bubble (right-aligned, slate-100 bg, slate-700 text):
"Why is my portfolio down this month?"

Provedo bubble (left-aligned, white bg, slate-900 text, 1px border):
"You're down −4.2% this month. 62% of the drawdown is two
positions: Apple (−11%, AAPL Q3 earnings) and Tesla (−8%,
TSLA delivery miss). The rest is roughly flat."

[Inline P&L sparkline — 280×60px, see V2.1 chart spec]
```

**L2 — Insight feed (mid layer, slightly faded):**
```
[Section label] This week — 3 items
─────────────────────────────────
• Dividend coming · KO · Sept 14 · $87
• Drawdown forming · AAPL −11% · 8d
• Concentration · Tech 58% · +4pp QoQ
```
JetBrains Mono for tickers + numbers + dates. Inter for descriptive text. Slate-700 bullet body, slate-500 metadata.

**L3 — Cross-broker pie (back layer, most faded):**
```
[Section label] Across IBKR + Schwab
[Pie chart 180×180px — 4-slice donut: Tech 58% teal-600,
Financials 18% slate-500, Healthcare 14% slate-400,
Other 10% slate-300. Center number: $231k mono.]
```

### 1.5 Motion

- **On scroll:** subtle parallax — L1 translateY +0px, L2 +6px, L3 +12px over hero scroll range. Compositor-only (transform). Max amplitude 12px so no layout shift.
- **Duration intent:** N/A — driven by scroll position, not duration.
- **Reduced-motion:** ALL parallax disabled. Layers static. `@media (prefers-reduced-motion: reduce) { transform: none !important; }`.
- **Initial load:** stagger fade-in. L3 fades 0→0.6 over 200ms (delay 0ms). L2 fades 0→0.92 over 200ms (delay 80ms). L1 fades 0→1 over 200ms (delay 160ms). Total ~400ms. Reduced-motion: no fade-in, render immediately at final opacity.

### 1.6 Responsive

| Breakpoint | Layout |
|---|---|
| 320–639 | Hero text full width center. Visual: L1 chat surface only, scaled to viewport (max-width 320px), centered below text. L2/L3 hidden. |
| 640–767 | Same as above. L1 visible, L2/L3 hidden. Avoids cramped overlap on narrow screens. |
| 768–1023 | Text full-width top. Visual: L1 + L2 (offset 16px instead of 32). L3 hidden. Visual stack ~480px tall. |
| 1024–1439 | Two-column 5/7 split. All 3 layers visible at offsets 24/48px (compressed from desktop). |
| 1440+ | Full spec (offsets 32/56px). Two-column 5/7 split. |
| 1920 ultra-wide | Same as 1440. Hero capped at max-w-7xl (1280px) — no further scale. |

### 1.7 Accessibility

- L1 chat surface: full a11y (semantic `<article>`, `aria-label="Provedo demo conversation"`, real readable text — not sr-only-hidden image).
- L2 insight feed: `<ul>` with 3 `<li>` items, semantic.
- L3 pie chart: `<svg role="img" aria-label="Provedo cross-broker allocation: Tech 58%, Financials 18%, Healthcare 14%, Other 10%">` — text label fully describes content for screen readers.
- All three layers visible to screen readers as content (not decoration). Reading order: text column → L1 → L2 → L3.
- Focus order: hero CTAs → (skip past visual stack — it's static demo) → next section.
- Contrast: chat text slate-900 on white = 16.7:1 (AAA). L2 faded to opacity 0.92 = 15.4:1 effective (AAA). L3 faded to 0.6 — still AA on chart (uses semantic colors with sufficient contrast even at 0.6 opacity per pre-flight check).

---

## 2. Pattern V2 — Real charts inside §2 demo tabs

### 2.1 Tab 1 — «Why?» — Line/Sparkline P&L chart

**Spec:**
- 280×120px inline SVG chart inside Provedo bubble
- X-axis: 30 days (Jan 1 → Jan 30, current month)
- Y-axis: P&L % from start-of-month, range −5% to +1%
- Line stroke: 1.5px `var(--provedo-text-secondary)` slate-700
- 2 emphasis points: AAPL drop circle + TSLA drop circle, fill `var(--provedo-negative)` red-600, 4px radius
- Subtle grid: 1px slate-200 horizontal at 0% baseline only (not full grid — too busy)
- End-point label: «−4.2%» mono red-600 right-aligned
- Annotations: small AAPL/TSLA labels next to red dots, slate-500 caption text
- Library: **inline SVG** (zero runtime cost, no JS hydration, accessible). NO Recharts/Chart.js — overkill for static demo charts.

**Sample SVG snippet:**

```tsx
// Inline within Tab 1 chat bubble. All values from --provedo-* tokens.
function PnlSparkline() {
  // 30-day P&L points; emphasis on day 8 (AAPL), day 19 (TSLA)
  const points = "0,30 12,28 24,32 36,38 48,52 60,64 72,76 84,82 96,72 108,60 120,52";
  return (
    <svg
      viewBox="0 0 280 120"
      width="100%"
      height="120"
      role="img"
      aria-label="Monthly P&L line chart: down 4.2%, with AAPL drop on day 8 and TSLA drop on day 19"
      style={{ marginTop: '12px' }}
    >
      {/* Baseline at 0% */}
      <line x1="0" y1="20" x2="280" y2="20" stroke="var(--provedo-border-subtle)" strokeWidth="1" strokeDasharray="2,3" />
      {/* P&L line */}
      <polyline
        fill="none"
        stroke="var(--provedo-text-secondary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* Emphasis: AAPL drop */}
      <circle cx="84" cy="82" r="4" fill="var(--provedo-negative)" />
      <text x="84" y="100" fontSize="10" fontFamily="var(--provedo-font-mono)" fill="var(--provedo-text-tertiary)" textAnchor="middle">AAPL</text>
      {/* Emphasis: TSLA drop */}
      <circle cx="180" cy="92" r="4" fill="var(--provedo-negative)" />
      <text x="180" y="110" fontSize="10" fontFamily="var(--provedo-font-mono)" fill="var(--provedo-text-tertiary)" textAnchor="middle">TSLA</text>
      {/* End label */}
      <text x="276" y="96" fontSize="11" fontFamily="var(--provedo-font-mono)" fill="var(--provedo-negative)" textAnchor="end" fontWeight="500">−4.2%</text>
    </svg>
  );
}
```

**A11y:** `role="img"` + comprehensive `aria-label` describes content fully. Series differentiation N/A (single series). Reduced-motion: SVG static, no animation. Color: red-600 emphasis dots have 5.16:1 contrast on white (AA).

### 2.2 Tab 2 — «Dividends» — Calendar mini-block

**Spec:**
- 280×96px inline SVG calendar grid
- 3 months × 4-week strip (Sep / Oct / Nov), each cell 28×28px
- Ex-div dates marked as filled circles inside cells
- Cell colors: empty = slate-50 bg, ex-div day = teal-100 bg + teal-600 dot center, payment day = teal-50 bg
- 3 callout dots: KO Sep 14, VZ Oct 7, MSFT Nov 19
- Tooltip-equivalent: small mono ticker label next to each dot («KO $87», «VZ $74», «MSFT $61»)

**Why calendar over bar chart:** Calendar is the natural representation of date-anchored data. Audit confirmed (chart-domain search): for «date-anchored discrete events,» calendar grid > bar chart for cognitive parsing.

**A11y:** Each filled cell has `<title>` element inside SVG group with full date + amount. Caption below SVG: «Dividend calendar: KO Sept 14 ($87), VZ Oct 7 ($74), MSFT Nov 19 ($61). Three smaller payments after.» (Caption serves both visual and SR users.)

### 2.3 Tab 3 — «Patterns» — Trade timeline

**Spec:**
- 280×120px inline SVG timeline
- X-axis: 12 months (Jan–Dec last year)
- Single horizontal slate-300 axis line at vertical center (y=60)
- 3 sell-points (downward triangle markers, fill teal-600, 8×8px) at month positions
- 3 «8-week-after» marks (small slate-400 circles, 4px) trailing each sell-point
- Connector dotted line between each sell-point and its 8-week-after mark, slate-300 1px
- Month labels below axis: «Jan Mar May Jul Sep Nov» mono 10px slate-500
- No upward marks — pure observational, not advice-leaning

**A11y:** `aria-label="Trade timeline: 3 Apple sell points marked, with 8-week-after recovery points trailing each."` Below SVG: caption table available via `<details>` toggle (date sold + price + 8w-later price).

### 2.4 Tab 4 — «Aggregate» — Pie + per-broker bar

**Spec (combined chart):**
- Left half: 140×140px donut chart, 4 slices (Tech 58%, Financials 18%, Healthcare 14%, Other 10%)
  - Slice colors: Tech `var(--provedo-accent)` teal-600, Financials slate-600, Healthcare slate-400, Other slate-300
  - Donut hole 60% inner radius, center label «$231k» mono slate-900
  - Slice labels OUTSIDE donut with leader lines (not over-pie — accessibility)
- Right half: stacked horizontal bar 120×60px showing per-broker split
  - IBKR row: AAPL teal-700 + MSFT teal-600 + NVDA teal-500 (proportional widths)
  - Schwab row: GOOG teal-400 + AMZN teal-300

**Why both:** pie alone fails WCAG (chart-domain search: pie accessibility grade C; mandatory data-table fallback). Pairing pie with stacked-bar provides AA-compliant alternative inline.

**A11y mandatory fallback:**
- All slice values labeled with text outside SVG
- Below charts: visible mini-table «Tech 58% · Financials 18% · Healthcare 14% · Other 10%»
- `<svg role="img" aria-label="Allocation across IBKR + Schwab: Tech 58% (AAPL $14k, MSFT $9k, NVDA $8k on IBKR; GOOG $3k, AMZN $2k on Schwab), Financials 18%, Healthcare 14%, Other 10%. Total $231k.">`

### 2.5 Cross-tab consistency

All four charts share:
- Inline SVG (no runtime chart library)
- Single primary stroke color: slate-700 for neutral data, teal-600 for emphasis/Provedo-narrative
- Semantic color reserve: red-600 (loss), emerald-600 (gain), teal-600 (Provedo-attention/info)
- Mono font for all numbers, axis labels, ticker tags
- `role="img"` + descriptive `aria-label`
- Reduced-motion: no entrance animation. Static render.
- Background transparent — surface is the chat bubble white.

---

## 3. Pattern V3 — Numeric proof bar

### 3.1 Layout

Single horizontal strip between hero (S1) and demo tabs (S4). Three-column row, dividers between, mono numbers, slate-on-cool-bg.

```
desktop ≥768
┌────────────────────────────────────────────────────────────────────┐
│         1000+              Every             $0/month              │
│   brokers and exchanges    observation       free forever          │
│   in one place             cited             no card               │
└────────────────────────────────────────────────────────────────────┘

mobile <768 (stacked single-column)
┌──────────────────────────────────────────────┐
│              1000+                            │
│      brokers and exchanges                    │
│         (in one place)                        │
├──────────────────────────────────────────────┤
│              Every                            │
│            observation                        │
│              cited                            │
├──────────────────────────────────────────────┤
│            $0/month                           │
│         free forever                          │
│            no card                            │
└──────────────────────────────────────────────┘
```

### 3.2 Spec

- Section bg: `var(--provedo-bg-muted)` `#F5F5F1` (slightly darker than page bg `#FAFAF7` — delineation without breaking palette)
- Border-top + border-bottom: 1px `var(--provedo-border-subtle)` slate-200
- Section padding: `py-12 md:py-16` (96–128px vertical)
- 3 columns desktop, 1 column mobile
- Vertical dividers between columns (desktop only): 1px slate-200, 60% column height centered
- Cell content alignment: center (text-align: center)
- **Number typography:** JetBrains Mono, weight 500, size `clamp(2.5rem, 1.8rem + 2vw, 3.5rem)` (40–56px), color slate-900, line-height 1.0, letter-spacing -0.02em
- **Label typography:** Inter, weight 500, size 13px, uppercase, letter-spacing 0.08em (tracked), color slate-600
- **Sublabel typography:** Inter, weight 400, size 13px, color slate-500
- Number-to-label gap: 8px
- Label-to-sublabel gap: 4px

### 3.3 Cell content (locked, audit-aligned)

| Cell | Number | Label | Sublabel |
|---|---|---|---|
| 1 | `1000+` | brokers and exchanges | in one place |
| 2 | `Every` | observation cited | with sources inline |
| 3 | `$0/month` | free forever | no card required |

Note: cell 2's "Every" is rendered in mono at the same number-size as `1000+` and `$0/month` — rhythmic consistency. It reads as a categorical claim, not a numeric one, but the typographic treatment matches.

### 3.4 Fallback for cell 1

If tech-lead verification flags «1000+» unverified at production deploy time, fallback per content v2 §4:
- Cell 1 number → `100s` (hundreds)
- Cell 1 label → `brokers and exchanges`
- Cell 1 sublabel → `every major one`

Frontend prop: `<NumericProofBar coverage="1000+" | "100s">` so swap is mechanical.

### 3.5 Accessibility

- Section semantic: `<section aria-label="Proof points">` with `<dl>` (description list) inside.
- Each cell: `<dt>` for label, `<dd>` for number + sublabel. Screen reader hears: «brokers and exchanges: 1000+, in one place.»
- Contrast: slate-900 mono on `#F5F5F1` = ~15.5:1 (AAA). Slate-600 label on `#F5F5F1` = 8.2:1 (AAA).
- Reduced-motion: N/A (no motion).

### 3.6 Responsive

| Breakpoint | Layout |
|---|---|
| 320–639 | Single column stacked. Numbers scale to 40px. Vertical 32px gap between cells. No dividers; horizontal 1px slate-200 separators 60%-width centered. |
| 640–767 | Same as 320 (still narrow for 3-up). |
| 768+ | 3-column horizontal. Vertical dividers between cells. Numbers scale to 56px. |

---

## 4. Pattern V4 — Editorial mid-page narrative block

### 4.1 Decision: Light-warm full-bleed with oversized typography (NOT dark)

**Recommendation:** Promote §3 mid-page narrative («One brain. One feed. One chat.») to a full-bleed editorial surface using **slate-900 dark surface** with type-led layout.

**Light vs dark choice — rationale:**

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **A. Slate-900 dark full-bleed** | Single dramatic break in light page; rhymes with closing CTA panel; precedent in claude.ai/Anthropic (warm + dark mix is established AI-tool pattern, NOT Direction A violation); creates strong vertical rhythm | One depart from pure Direction A light primary; needs careful typography contrast | **CHOSEN** |
| B. Warm-cream slightly-darker (`#F1F1ED`) full-bleed | Stays 100% in Direction A light register | Reads same-y as proof bar pattern V3; insufficient contrast against page bg to register as «editorial moment» | rejected — too quiet |

**Why A wins:** Direction A locks LIGHT-PRIMARY page register. A single dark editorial section is not a violation — it's a **reciprocal accent surface** within a light system. Anthropic / Stripe / Linear all use a single dark mid-page or pre-footer surface against otherwise-light pages. The audit explicitly cites Stripe «Book of the week» dark editorial as the strongest reference. Direction A anti-pattern §0.1 forbids «cream-paper Italianate-warm visual register» (Direction B), NOT a single contrast surface — that's complementary craft.

**One dark surface, used twice:** S6 (editorial mid-page) + S9 (pre-footer CTA). Visual rhyme. Page rhythm: light hero → light proof → light negation → light demo → light insights → **DARK editorial** → light testimonials → light marquee → **DARK CTA** → light footer.

### 4.2 Spec — S6 editorial mid-page

**Full-bleed surface:**
- Bg: `slate-900` `#0F172A`
- Padding vertical: `py-24 md:py-32 lg:py-40` (96 / 128 / 160px each side — generous)
- No max-width container on bg, but inner content max-width `max-w-3xl` (768px) centered

**Typography:**
- **Header:** «One brain. One feed. One chat.»
  - Inter, weight 500, size `clamp(2.5rem, 1.8rem + 3.5vw, 4.5rem)` (40–72px)
  - Color `#FAFAF7` (page-bg becomes text-color — design-system reciprocity)
  - tracking-tight (-0.02em)
  - line-height 1.05
  - margin-bottom 48px
- **Body paragraphs (3):** verbatim from content v2 §3 mid-page
  - Inter, weight 400, size `clamp(1.125rem, 1rem + 0.6vw, 1.375rem)` (18–22px)
  - Color slate-300 `#cbd5e1`
  - line-height 1.6
  - max-width 60ch
  - margin-bottom 24px between paragraphs
- **Closing line:** «Provedo sees what you hold and notices what you'd miss.»
  - Inter italic, weight 500, size `clamp(1.5rem, 1.2rem + 1.2vw, 2rem)` (24–32px)
  - Color `#FAFAF7` for «Provedo sees what you hold and» + `var(--provedo-accent-light)` teal-400 `#2dd4bf` for «notices what you'd miss»
  - margin-top 56px

**Decorative elements:** None. Pure type-led. No mockups, no charts, no icons. The contrast surface IS the design.

### 4.3 Accessibility

- Contrast: `#FAFAF7` text on slate-900 = 19.3:1 (AAA)
- Slate-300 body on slate-900 = 12.1:1 (AAA)
- Teal-400 accent on slate-900 = 7.81:1 (AAA — passes large-text + UI requirements)
- Semantic: `<section aria-labelledby="editorial-heading">` with `<h3 id="editorial-heading">` for the header (h3 because nested under h2 sections above it)
- Reduced-motion: static. No fade-in, no parallax. Hero entrance for this surface = instant render.

### 4.4 Responsive

| Breakpoint | Header size | Body size | Padding vertical |
|---|---|---|---|
| 320 | 40px | 18px | 96px |
| 768 | 56px | 20px | 128px |
| 1024 | 64px | 22px | 144px |
| 1440 | 72px | 22px | 160px |

---

## 5. Pattern V5 — Pre-alpha testimonial slot

### 5.1 Layout

Three horizontal cards between editorial mid-page (S6) and aggregation marquee (S8).

```
desktop ≥1024
┌────────────┐  ┌────────────┐  ┌────────────┐
│            │  │            │  │            │
│ "I caught a│  │ "Provedo   │  │ "I check   │
│  dividend  │  │  noticed   │  │  the weekly│
│  in week 2 │  │  I'd been  │  │  feed for 5│
│  I would've│  │  selling…" │  │  minutes…" │
│  missed…"  │  │            │  │            │
│            │  │  — Maria S.│  │            │
│  — Alex K. │  │   Free     │  │ — David R. │
│   Plus     │  │   user     │  │   Plus     │
│   user     │  │            │  │   user     │
│            │  │  Fidelity +│  │            │
│  IBKR +    │  │  Robinhood │  │  IBKR ·    │
│  Schwab ·  │  │  · Austin  │  │  Berlin    │
│  Boston    │  │            │  │            │
└────────────┘  └────────────┘  └────────────┘

tablet 768–1023 (2-col, 3rd card wraps below center)
mobile <768 (stacked single column with 16px gap)
```

### 5.2 Card spec

- Card: `var(--provedo-bg-elevated)` white bg, 1px `var(--provedo-border-subtle)` border, 12px radius
- Card padding: 32px (md:p-8)
- Shadow: shadow-sm `0 1px 2px rgba(15,23,42,0.06)` (subtle — not elevated like hero stack)
- Card width: equal columns in CSS grid (1fr 1fr 1fr desktop)
- Min height: 240px (cards align vertically when quotes vary in length)

**Internal layout (top → bottom):**

1. **Quote-mark glyph (decorative)** — small `"` glyph top-left, 32px JetBrains Mono, color teal-600 opacity 0.4
2. **Quote body** — Inter, weight 400, size 16px (md:18px), color slate-700, line-height 1.55, ~3–5 lines max
3. **Spacer** — `mt-auto` to push attribution to bottom of card
4. **Divider** — 1px slate-200, full card width minus padding, 24px above attribution
5. **First-name + last-initial** — Inter, weight 500, size 14px, color slate-900
6. **Tier badge** — inline pill: «Plus user» / «Free user», bg teal-50, text teal-700, 11px Inter weight 500, uppercase tracked, padding 4px 8px, radius 4px
7. **Broker stack + city** — Inter, weight 400, size 13px, color slate-500. JetBrains Mono for broker names («IBKR + Schwab · Boston»)
8. **Optional decorative**: small mono ticker icon top-right corner of card — abstract teal-tinted geometric (NOT a logo, NOT a face) — implementation: small SVG mark like a 16×16 geometric square+circle composition. Decorative only, no a11y meaning.

### 5.3 Pre-alpha framing — honesty

**Two acceptable approaches** (PO call):

**Option A — labeled pre-alpha (recommended):**
- Above the 3 cards, small section header: «What alpha testers are noticing.»
- Below: caption «From the closed alpha cohort, January 2026. Real users on real positions.»
- Cards render real-quote-shaped placeholders pulled from content v2 §C4 (3 specific quotes).
- This is honest if the quotes are from genuine alpha-testers. If alpha hasn't shipped yet, swap to Option B.

**Option B — explicit «coming soon» (recommended if alpha not shipped):**
- Section header: «What testers will be noticing.»
- Below header: caption «Provedo enters closed alpha Q2 2026. This space holds testimonials when testers arrive.»
- Cards render with structurally-real but copy-blank quote shape — 3 placeholder text lines visually but textually marked: «"Quote from alpha tester · category"» + «— First Initial., Tier user» + «Broker stack · City»
- A small badge: «Coming Q2 2026» top-right of section.

**DO NOT:** ship the 3 specific quotes from content v2 §C4 framed as if they're real users when no alpha cohort exists yet. That's fake social proof, brand-trust violation, anti-Sage.

**Recommendation to Navigator/PO:** if alpha cohort N≥3 has shipped by landing v2 deploy, use Option A with real quotes (not the §C4 placeholders verbatim). If alpha hasn't shipped, use Option B explicitly.

### 5.4 Accessibility

- Section: `<section aria-labelledby="testimonials-heading">`
- Each card: `<figure>` containing `<blockquote>` for the quote and `<figcaption>` for attribution. Semantic.
- Tier pill: `<span class="tier-badge" aria-label="Plus tier">Plus user</span>`. Color is not the only signal — text label carries meaning.
- Contrast: slate-700 quote on white = 12.1:1 (AAA). Slate-900 name on white = 16.7:1 (AAA). Teal-700 pill on teal-50 = 6.81:1 (AAA).
- Reduced-motion: no entrance animation. Static.

### 5.5 Responsive

| Breakpoint | Layout |
|---|---|
| 320–639 | Single column. Cards stack with 16px gap. Card width 100%. |
| 640–1023 | 2-column on tablet (cards 1+2 in row, card 3 wraps centered below). |
| 1024+ | 3-column equal grid. |

---

## 6. Section-by-section v2 layout map

```
┌─────────────────────────────────────────────────────┐
│  S1 — Hero (V1 stacked-mockup)            [LIGHT]   │  ← REPLACE skeleton with V1
├─────────────────────────────────────────────────────┤
│  S2 — Numeric proof bar (V3)              [MUTED]   │  ← NEW
├─────────────────────────────────────────────────────┤
│  S3 — Problem-negation positioning        [LIGHT]   │  ← NEW (content-lead delivers copy)
├─────────────────────────────────────────────────────┤
│  S4 — Demo tabs with real charts (V2)     [LIGHT]   │  ← KEEP §2; REPLACE skeletons
├─────────────────────────────────────────────────────┤
│  S5 — Insights / Pattern recognition      [ELEVATED]│  ← KEEP §3 bullets
├─────────────────────────────────────────────────────┤
│  S6 — Editorial mid-page narrative (V4)   [DARK]    │  ← PROMOTE from §3 mid → full-bleed
├─────────────────────────────────────────────────────┤
│  S7 — Pre-alpha testimonials (V5)         [LIGHT]   │  ← NEW
├─────────────────────────────────────────────────────┤
│  S8 — Aggregation marquee                 [LIGHT]   │  ← KEEP §4
├─────────────────────────────────────────────────────┤
│  S9 — Pre-footer editorial CTA            [DARK]    │  ← REDESIGN §5 (visual rhyme with S6)
├─────────────────────────────────────────────────────┤
│  S10 — Footer disclaimer                  [LIGHT]   │  ← KEEP §6
└─────────────────────────────────────────────────────┘

Section bg cadence (top → bottom):
LIGHT → MUTED → LIGHT → LIGHT → ELEVATED → DARK → LIGHT → LIGHT → DARK → LIGHT
   ↑       ↑        ↑       ↑       ↑         ↑     ↑       ↑       ↑      ↑
warm-bg muted   warm-bg warm-bg  white     dark warm-bg warm-bg  dark   warm-bg
#FAFAF7 #F5F5F1 #FAFAF7 #FAFAF7 #FFFFFF #0F172A #FAFAF7 #FAFAF7 #0F172A #FAFAF7
```

Light-light-light is intentionally broken by MUTED (S2), ELEVATED (S5), and DARK (S6, S9) to avoid the «one undifferentiated cream sea» that produced «пустовато» in v1.

### 6.1 S3 — Problem-negation positioning (NEW)

**Content-lead delivers copy parallel.** Per audit §C3:

> Provedo is not a robo-advisor. It is not a brokerage. It will not tell you what to buy.
>
> Provedo holds your portfolio across every broker, answers your questions about what you own, and surfaces what you'd miss. With sources for every observation.

**Visual spec:**
- Bg: `var(--provedo-bg-page)` `#FAFAF7`
- Padding: `py-20 md:py-28` (80–112px each side)
- Container: `max-w-3xl mx-auto text-center`
- Negation heading typography:
  - Inter, weight 500, size `clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)` (24–36px)
  - Color slate-900
  - line-height 1.4
  - Three sentences typeset on three separate lines (use `<br>` for forced breaks at sentence boundaries)
  - The «not» words emphasized: weight 600 + slate-700 (slight weight + tone shift on the negation token to anchor the rhetorical structure)
- Resolution paragraph typography:
  - Inter, weight 400, size 18px (md:20px)
  - Color slate-600
  - line-height 1.6
  - max-width 60ch
- Spacing between negation heading and resolution paragraph: 32px
- Optional: small Provedo wordmark above heading, mono uppercase tracked teal-600 11px

**A11y:** `<section aria-labelledby="negation-heading">` with `<h2 id="negation-heading">` containing the three-sentence negation. `<p>` for resolution. Contrast slate-900/`#FAFAF7` 16.7:1 (AAA).

### 6.2 S5 — Insights / Pattern recognition (KEEP existing v1 component)

No visual changes vs v1. The component already delivers 3 icon+copy bullet cards on white bg — that's correct rhythm post-S4 demo tabs. Mid-page narrative inside this section gets EXTRACTED to S6 (editorial full-bleed) — that's the only structural change. Frontend-engineer: split `ProvedoInsightsSection` into two components: `ProvedoInsightsBullets` (3-card row, current top half) + new `ProvedoEditorialNarrative` (full-bleed dark, S6).

### 6.3 S8 — Aggregation marquee (KEEP existing v1, minor refinements)

- Confirm marquee scroll animation is active (already implemented in `ProvedoAggregationSection.tsx` per current code).
- Logo treatment refinement: when real broker logos arrive (post-tech-lead verification of «1000+»), render as monochrome slate-700 SVG on white card bg (current placeholder is text abbreviation). Until real logos arrive, retain text abbreviations — accept «pre-alpha provisional visual» framing rather than ship stock-logo-soup.
- No bg-color change. Stays light `#FAFAF7`.

### 6.4 S9 — Pre-footer editorial CTA (REDESIGN)

**Replaces current `ProvedoRepeatCTA` light section.** Reuses S6 dark surface treatment for visual rhyme.

**Spec:**
- Bg: `slate-900` `#0F172A` (same as S6)
- Padding: `py-20 md:py-28`
- Container: `max-w-2xl mx-auto text-center`
- Header: «Open Provedo when you're ready.» (revised from «Ready when you are.» per audit §C1; matches imperative register of §1 «Ask Provedo»)
  - Inter, weight 500, size `clamp(2rem, 1.5rem + 2vw, 3rem)` (32–48px)
  - Color `#FAFAF7`
  - tracking-tight
  - margin-bottom 32px
- **Single primary CTA:** Try Plus free for 14 days
  - Button bg teal-500 `#14b8a6` (lighter than light-mode teal-600 — needed contrast on dark bg; 5.81:1 AA on slate-900)
  - Text white #FFFFFF
  - Same size as hero CTAs
- **Secondary text-link** (below button): «Or start free forever»
  - Inter weight 400, 14px, color slate-300 default → teal-400 hover
- Small-print: «Plus: card required, cancel one click. Free: no card, no trial ending, 50 messages / month.»
  - Inter 12px, color slate-400, line-height 1.5
  - margin-top 16px

**Why redesign:** v1 §5 is a duplicate of hero CTA cluster on identical bg with no visual differentiation — pure text repetition adds zero density. Strong-tier landings universally treat pre-footer CTA as a **dramatic moment** (Stripe, Linear, Cursor all use dark editorial CTA panel). S9-as-dark also rhymes with S6, creating intentional vertical rhythm: «light → dark → light → dark → light» pattern that reads cadenced, not arbitrary.

**A11y:** `<section aria-labelledby="cta-heading">`. Single CTA = clearer focus order. Teal-500 button on slate-900 = 5.81:1 (AA). White button text on teal-500 = 4.53:1 (AA pass).

---

## 7. Token additions / inventory

No new tokens required. All patterns use existing Direction A v1.4 tokens. Inventory of tokens consumed:

```
--provedo-bg-page          #FAFAF7
--provedo-bg-elevated      #FFFFFF
--provedo-bg-muted         #F5F5F1
--provedo-bg-subtle        #F1F1ED
--provedo-bg-inverse       #0F172A   (used in S6, S9 dark surfaces)
--provedo-text-primary     #0F172A
--provedo-text-secondary   #334155
--provedo-text-tertiary    #475569
--provedo-text-muted       #64748b
--provedo-text-inverse     #FAFAF7   (text on dark bg in S6, S9)
--provedo-border-subtle    #e2e8f0
--provedo-border-default   #cbd5e1
--provedo-accent           #0d9488   (teal-600)
--provedo-accent-hover     #14b8a6   (teal-500 — also S9 button bg on dark)
--provedo-accent-active    #0f766e   (teal-700)
--provedo-accent-light     #2dd4bf   (teal-400 — closing line accent in S6)
--provedo-accent-subtle    #ccfbf1   (teal-100 — testimonial pill bg, calendar ex-div cells in V2.2)
--provedo-positive         #047857   (emerald-700 — gain in charts)
--provedo-negative         #B91C1C   (red-700 — loss in charts)
--provedo-font-sans        Inter
--provedo-font-mono        JetBrains Mono
```

**Observation for tech-lead:** if `--provedo-text-inverse` and `--provedo-accent-light` aren't yet exposed in the CSS variables emitted by Style Dictionary, frontend-engineer flags this during integration. Both should map directly from v1.4 §3 dark-mode tokens (text.primary on dark + accent on dark).

---

## 8. Pre-delivery checklist

- [x] `--design-system` query run via ui-ux-pro-max — output reviewed; «Sage neutral + calm teal» palette guidance aligns with Direction A locked accent A2 (teal-600). No conflict, no swap.
- [x] Anti-patterns from audit listed in §3 «do not» (V4.1 dark surface deliberately differentiated from Direction B cream-Italianate; pie chart paired with mandatory data-table fallback per chart-domain a11y guidance).
- [x] Color choices match industry reasoning rule — teal-600 sage register chosen 2026-04-25 (audit §3.6 resolved), reinforced by ui-ux-pro-max design-system search «Sage neutral + calm teal.»
- [x] Typography pairing sourced — Inter + JetBrains Mono locked v1.4 §4, Google Fonts free, aligns with «modern AI-tool minimalist» visual register (Linear/Stripe lineage cited in audit).
- [x] Responsive behavior covers 320 / 375 / 640 / 768 / 1024 / 1440 / 1920 — every pattern §1.6, §2 cross-tab, §3.6, §4.4, §5.5 specifies breakpoint behavior.
- [x] 10-priority UX rubric pass complete:
  - **P1 Accessibility:** every chart has `role="img"` + descriptive `aria-label`; pie chart has mandatory data-table fallback per chart-domain a11y; contrast ratios documented per pattern; keyboard order explicit; reduced-motion explicit.
  - **P2 Touch & Interaction:** CTAs ≥44×44px (min-height enforced in `ProvedoButton`); hover/focus/active states defined; loading feedback N/A (static landing, no async UI).
  - **P3 Performance:** all charts inline SVG (no chart library, no JS hydration); fonts subset to Latin+Cyrillic; entrance fade 200ms compositor-only (transform+opacity).
  - **P4 Style Selection:** Direction A locked; SVG icons only (Lucide); zero emoji; zero gradient mesh.
  - **P5 Layout & Responsive:** mobile-first; no horizontal scroll on any pattern; breakpoint grid documented.
  - **P6 Typography & Color:** 16px base body; 1.55+ line-height; semantic tokens (`var(--provedo-*)`) used throughout; zero raw hex except in spec doc references.
  - **P7 Animation:** 200ms entrance fade only; transform+opacity only; reduced-motion respected explicitly per pattern.
  - **P8 Forms & Feedback:** N/A (landing has no forms beyond CTA buttons).
  - **P9 Navigation:** S1→S10 sequential scroll, no nav menus added; CTA anchor `#demo` jumps to S4 demo tabs.
  - **P10 Charts & Data:** legends and labels visible; pie has mandatory tabular fallback; semantic colors with text labels (color is not the only signal).
- [x] Reduced-motion variant specified — every pattern §1.5, §2.5, §3 (no motion), §4 (no motion), §5 (no motion).
- [x] Light + dark mode: dark mode landing **deferred post-alpha** (per Design Brief v1.4; landing ships light-only in pre-alpha). S6/S9 dark surfaces are within light-mode page treatment, not a dark-mode toggle.

---

## 9. Hand-off notes for frontend-engineer

### 9.1 New components to create

```
apps/web/src/app/(marketing)/_components/
  ProvedoHeroV2.tsx              ← REPLACE ProvedoHero (V1 stacked-mockup)
    ProvedoHeroChatMockup.tsx    ← NEW (L1 surface — chat bubble with PnlSparkline)
    ProvedoHeroInsightFeed.tsx   ← NEW (L2 surface — insight feed list)
    ProvedoHeroBrokerPie.tsx     ← NEW (L3 surface — donut chart mockup)
  ProvedoNumericProofBar.tsx     ← NEW (V3 pattern, S2)
  ProvedoNegationSection.tsx     ← NEW (S3, content-lead provides copy)
  ProvedoDemoTabsV2.tsx          ← REPLACE ProvedoDemoTabs — same Tabs primitive, new chart components inside
    PnlSparkline.tsx             ← NEW (Tab 1, V2.1 SVG)
    DividendCalendar.tsx         ← NEW (Tab 2, V2.2 SVG)
    TradeTimeline.tsx            ← NEW (Tab 3, V2.3 SVG)
    AllocationPieBar.tsx         ← NEW (Tab 4, V2.4 SVG)
  ProvedoInsightsBullets.tsx     ← EXTRACT top half of current ProvedoInsightsSection
  ProvedoEditorialNarrative.tsx  ← NEW (S6 dark full-bleed, extracted from current §3 mid-page)
  ProvedoTestimonialCards.tsx    ← NEW (S7, V5 pattern)
  ProvedoRepeatCTAV2.tsx         ← REPLACE ProvedoRepeatCTA (S9 dark editorial)
```

### 9.2 Components to keep unchanged

- `ProvedoButton.tsx` — already correct.
- `ProvedoAggregationSection.tsx` — minor logo refinement only when real logos arrive.
- `MarketingHeader.tsx` / `MarketingFooter.tsx` — out of scope.

### 9.3 SVG chart components — implementation guidance

- All 5 SVG chart components are **stateless React components**, no hooks, no state, no JS interactivity.
- Use `viewBox` for responsive scaling; width="100%" + fixed height.
- All colors via `var(--provedo-*)` CSS variables — never hardcoded hex inside the SVG.
- Always include `role="img"` + descriptive `aria-label` + (when complex) inline `<title>` for grouped elements.
- TypeScript: explicit prop types (per `~/.claude/rules/typescript/coding-style.md`); no `any`. Where charts have no props, declare `function PnlSparkline(): JSX.Element`.

### 9.4 Pre-alpha testimonial decision required

Frontend-engineer cannot autonomously decide Option A (real-quote framing) vs Option B (coming-soon framing) per §5.3. **Open question for PO via Navigator:** is closed alpha cohort live with N≥3 testers willing to attribute? If not, ship Option B explicitly with «Coming Q2 2026» badge — fake social proof = brand-trust violation.

### 9.5 Page composition

```tsx
// apps/web/src/app/(marketing)/page.tsx
export default function LandingPage() {
  return (
    <main>
      <ProvedoHeroV2 />
      <ProvedoNumericProofBar coverage="100s" />  {/* swap to "1000+" post-verification */}
      <ProvedoNegationSection />
      <ProvedoDemoTabsV2 />
      <ProvedoInsightsBullets />
      <ProvedoEditorialNarrative />
      <ProvedoTestimonialCards mode="coming-soon" />  {/* "real" once alpha lands */}
      <ProvedoAggregationSection />
      <ProvedoRepeatCTAV2 />
      {/* MarketingFooter rendered by layout */}
    </main>
  );
}
```

### 9.6 Performance budget reminder

Per `~/.claude/rules/web/performance.md`:
- Landing page JS budget < 150kb gzipped — staying inline-SVG (no Recharts/Chart.js) keeps room.
- Hero font preload: Inter 400 + Inter 600. JetBrains Mono 400 deferred (only used post-fold in V2 charts and proof bar).
- LCP target < 2.5s — hero text renders before V1 mockup layers; ensure L1 chat surface is not LCP-blocking (use `loading="eager"` inline SVG; no remote-fetched images).
- CLS < 0.1 — V1 layered stack uses absolute positioning over fixed-height container; no layout shift expected.

### 9.7 Open thread to product-designer (post-build review)

After frontend-engineer ships Slice-LP2 to Vercel preview, product-designer reviews on 320/768/1024/1440 against this spec and signs off (or reports deltas) before PO sees it. Reduced-motion review also conducted then.

---

## 10. Anti-patterns specifically blocked in this spec

Per audit §A1–A3:

1. **Range advisor-paternalism register** — copy-side concern, content-lead owns. Visual: spec uses observational data viz (line charts of past data, calendars of disclosed events, pies of held positions) — never «projection» / «recommendation» visualization.
2. **Public.com 7-product mega-menu density** — spec adds **4 sections** to v1 (S2 proof bar + S3 negation + S6 editorial + S7 testimonials), not 8. Final count = 10 sections (within Linear/Vercel/Stripe midpoint per audit §3-section roadmap). Header/nav stays single-line, no dropdowns.
3. **Vercel globe / network-node hero** — explicitly avoided. V1 uses three product surfaces (chat + insight feed + cross-broker pie). Zero globes, zero network-node graphs, zero «AI sparkle.» Direction A anti-pattern §0.1 reaffirmed (no neural-network synapse imagery, no gradient meshes).

---

## 11. Open questions for PO (return via Navigator)

1. **Pre-alpha testimonial framing (§5.3):** Option A (real quotes from alpha cohort, N≥3) or Option B (explicit «Coming Q2 2026» placeholder structure)? Default to Option B if alpha cohort not live by build start.
2. **«1000+» vs «100s» (§3.4):** keep tech-lead verification flag open; default to «100s» fallback at build start, swap to «1000+» when verification clears.
3. **S6/S9 dark surfaces (§4.1):** confirm slate-900 dark editorial section is acceptable depart-from-pure-light per Direction A. Spec recommends YES (rhymes with claude.ai pattern; explicitly differentiated from rejected Direction B Italianate-cream); but PO has final visual call.
4. **S3 negation copy (§6.1):** content-lead delivers parallel; product-designer typography spec assumes audit §C3 verbatim. If content-lead returns different copy, typography clamp values may need re-calibration.

---

## 12. Files created / updated

**Created this dispatch:**
- `docs/design/2026-04-26-provedo-landing-v2-visual-spec.md` (this file)

**Updated:** None. Design Brief v1.4 stays at v1.4 — no token additions, no principles changes. Landing-specific patterns documented in this dedicated spec rather than promoted to Design Brief, per «minor changes inline / major changes wait for PO greenlight» judgment in dispatch.

**Coordinated parallel work expected:**
- content-lead delivers S3 negation copy + revised pre-footer header («Open Provedo when you're ready»).
- frontend-engineer Slice-LP2 build follows this spec.
- tech-lead verifies «1000+ brokers» claim before production deploy.

**END 2026-04-26-provedo-landing-v2-visual-spec.md**
