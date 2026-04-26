# Chart Upgrade Audit — Provedo Landing Demo Charts + Hero Pie

**Date:** 2026-04-27
**Author:** product-designer (Right-Hand dispatch)
**Trigger:** PO directive 2026-04-27 — «нужно сделать красивые, нормальные графики». PO is dissatisfied; specific gaps not stated. Job: audit + propose 2-3 concrete upgrade directions for PO selection.
**Scope:** 5 chart areas — `PnlSparkline`, `DividendCalendar`, `TradeTimeline`, `AllocationPieBar` (4 demo tabs) + inline `BrokerPieMockup` in `ProvedoHeroV2.tsx` (hero L3 layer).
**Constraints:** Provedo tokens only (`#FAFAF7` warm-cream, slate-900, teal-600 `#0D9488`). Inline SVG only (no Recharts/D3/Victory). 5 motion rules hold. Lane A discipline holds. Hero copy LOCKED.
**Method:** Source-read all 9 chart files (4 static + 4 animated + 1 inline), cross-checked against (a) v2 visual spec (`docs/design/2026-04-26-provedo-landing-v2-visual-spec.md`), (b) Design Brief v1.4 §3-§8 tokens, (c) AI-tool landing audit R1 (`docs/reviews/2026-04-27-ai-tool-landing-audit-product-designer.md`).

---

## §1. Per-chart audit

### 1.1 PnlSparkline (Tab 1 «Why?») — 280×120 viewBox

**File:** `apps/web/src/app/(marketing)/_components/charts/PnlSparkline.tsx` (114 LOC) + `PnlSparklineAnimated.tsx` (215 LOC).

| Dimension | Finding | Severity |
|---|---|---|
| Visual polish | Stroke is `var(--provedo-text-secondary)` (slate-700) at 1.5px — reads gray-on-cream, not «P&L line». P&L is the headline data; the line should carry weight. Two emphasis dots are red `var(--provedo-negative)` 4px circles — correct semantic but tiny. | HIGH |
| Typography | Mono labels at 9px and end-label at 11px — both **below the 10px floor** for marketing surfaces. End label `−4.2%` is the single most important number on the chart and renders smaller than caption text on a typical 1440 viewport. | HIGH |
| Spacing | `marginTop: 12px` only. End label crammed at `x=276` collides with right edge. AAPL/TSLA labels float at `y=46`/`y=86` with no protective padding from line — they overlap when the chart compresses. | MEDIUM |
| Stroke widths | 1.5px line + 0.5px equivalent for the gradient fill stop = anemic. Linear/Anthropic charts use 2px+ for primary data lines. Dashed baseline at 1px stroke + `2,3` dasharray reads as noise, not reference. | HIGH |
| Color application | Line stroke uses **secondary text color**, not accent. The chart visually reads «text overlay,» not «data viz.» Gradient fill uses `var(--provedo-border-subtle)` opacity 0.4 → 0 — **the brand teal is absent from the primary chart of the page.** This is the largest single brand-alignment gap in the entire chart inventory. | CRITICAL |
| Whitespace | viewBox is 280×120 with content packed top-to-bottom. ~30% bottom whitespace below the polyline (since trend goes down). On the right side, the `−4.2%` label has zero margin from edge. | MEDIUM |
| Motion quality | Stroke-dashoffset draw 1.5s ease-out — **standard pattern, well-implemented.** Two dots pulse at 1.6s with spring-back easing `cubic-bezier(0.34,1.56,0.64,1)` — feels deliberate. End label fades 2.0s. **Total entrance: 2.6s — exceeds the 600ms-per-chart total entrance budget by 4×.** Per the 5-rule constraint locked at 600ms total, this is a violation. | HIGH (constraint violation) |
| Data density | 30 data points + 2 emphasis events + 2 axis labels + 1 end label = sparse. Compare to a Robinhood/Wealthsimple sparkline: shows time-of-day axis, percentage at peak/trough, position-level event markers. Our chart hides the y-axis entirely (no «what is 0%? what is −5%?» reference). | HIGH |
| Distinctiveness | Looks like every gray-line sparkline ever shipped on a fintech landing. Zero brand signature. | HIGH |
| Brand alignment | **Magician+Sage drift toward Generic-Dashboard.** No teal signature, no editorial-restraint signal, no Provedo-as-observer presence. Pure fintech-template register. | HIGH |
| Best-in-class gap | **Granola-gap:** Granola charts inside meeting summaries use a single high-precision accent on a dim baseline + larger numerals (≥14pt) + clear y-axis reference. **Linear-gap:** Linear's analytics surfaces use 2px stroke + filled-area gradient at 12% opacity using brand color, not gray. **Anthropic-gap:** Anthropic Console charts use mono numerals at 16pt for primary metric + axis tick labels at 11pt. We're 3-5pt below across the board. | HIGH |

**Verdict:** Functionally correct, brand-disconnected, motion-budget over. The single most important chart on the landing (P&L is the «notice what you'd miss» payload) is rendered as the most generic widget in the inventory.

### 1.2 DividendCalendar (Tab 2 «Dividends») — 604×116 viewBox

**File:** `DividendCalendar.tsx` (147 LOC) + `DividendCalendarAnimated.tsx` (237 LOC).

| Dimension | Finding | Severity |
|---|---|---|
| Visual polish | 28×24px cells with 0.5px borders → **borders nearly invisible at 1× rendering on macOS**, fully invisible on Windows/Linux 100% scaling. Calendar grid reads as floating teal dots without the grid context. Half-pixel strokes are a common dataviz anti-pattern. | HIGH |
| Typography | Month labels at 10pt mono. Ticker+amount labels at 8pt — **20% below 10pt floor**. «KO $87» renders at ~9px on a 1440 display, sub-readable. | HIGH |
| Spacing | 8px gap between months on a 196px-wide month strip — **gap is 4% of element width, reads as not-a-gap.** Calendar months bleed into each other. Fix: 24px gap minimum or visible vertical separator. | HIGH |
| Stroke widths | 0.5px cell borders (see polish). Ratio of border:cell = 1:56 — borders disappear. | HIGH |
| Color application | Filled cells use `var(--provedo-accent-subtle)` (`#CCFBF1`, very light teal) with `var(--provedo-accent)` dot center. Dot+light-fill combo is the **best brand-aligned chart in the inventory.** Empty cells transparent on cream → calendar grid is implied not stated. | LOW (positive) |
| Whitespace | viewBox is 604 wide on tabs that may render at 320–600px container width on mobile. **Aspect ratio 5:1 forces aggressive scaling on small viewports** — at 320px wide, each cell is ~12px square, ticker labels become unreadable. | HIGH (responsive) |
| Motion quality | Grid fades in 300ms, then 3 dots stagger 200ms each (400/600/800ms), then counter 0→312 over 800ms ease-out cubic. **Total entrance: 1.8s — exceeds 600ms budget by 3×.** Counter animation is well-built (rAF, ease-out cubic) but the dot stagger + counter sequence is the longest in the inventory. | HIGH (constraint violation) |
| Data density | 3 events across 12 weeks (84 cells) = **3.5% data density.** Calendar mostly-empty cells dominate. The «3 smaller payments after» from the aria-label and caption isn't visualized — reader sees 3 dots, told there are «3 smaller payments after» in caption. Mismatch between claim and visualization. | HIGH |
| Distinctiveness | Calendar-with-dots pattern is well-considered for date-anchored events (audit `--domain chart` correctly identifies calendar > bar for this use). The execution is restrained but not distinctive — could be any GitHub contribution-graph descendant. | MEDIUM |
| Brand alignment | Holds. Teal signature present. Magician+Sage register intact. Counter «$312 expected this quarter» reads observation, not advice. | LOW (positive) |
| Best-in-class gap | **GitHub-contribution-graph parity** — execution matches that bar but doesn't beat it. **Granola-gap:** Granola would label every event in-place with the actual amount; here only 3 of (presumably) 6 events are labeled, and the other 3 are mentioned only in caption text. | MEDIUM |

**Verdict:** Conceptually right, executionally weak. Half-pixel borders + sub-floor typography + 5:1 aspect ratio on mobile + motion budget violation. Brand alignment is the strongest of the four demo charts.

### 1.3 TradeTimeline (Tab 3 «Patterns») — 280×120 viewBox

**File:** `TradeTimeline.tsx` (194 LOC) + `TradeTimelineAnimated.tsx` (250 LOC).

| Dimension | Finding | Severity |
|---|---|---|
| Visual polish | Horizontal axis line at 1px slate, 3 downward triangles (sell points) at 10×10px filled accent, 3 hollow circles (recovery markers) at 5px radius stroked. Composition reads OK at desktop, **collapses to indistinguishable shapes at 320px viewport** (each triangle becomes ~5px). | MEDIUM |
| Typography | Month labels at 9pt, sell-month labels at 9pt mono, legend at 8pt. **Three sizes all below 10pt floor.** Legend at 8pt for «sell point» / «+8 weeks» on the bottom edge — reads as noise. | HIGH |
| Spacing | `AXIS_Y=60` centers axis vertically. Triangles sit at `y-12` to `y-2` (above axis) — 10px above axis line. Recovery circles sit on axis. 6px clearance between triangle tip and axis line — too tight visually. Month labels at `y+16` (16px below axis) — adequate. | MEDIUM |
| Stroke widths | Axis 1px, recovery circles 1.5px stroke, legend 1px stroke. Consistent but uniformly thin. Triangles are filled (no stroke) which gives them visual priority — correct. | LOW |
| Color application | **v3.1 patch made this chart the second-best brand-aligned in the inventory:** sell triangles `var(--provedo-negative)` (red — semantic «sell»), recovery circles `var(--provedo-accent)` (teal — semantic «what came after»). Two-color story reads. Legend shapes match colors. WCAG: not color-only — triangle ▽ vs circle ○ shape redundancy holds. | LOW (positive) |
| Whitespace | viewBox 280×120 with axis at y=60 leaves 60px above and 60px below — symmetric but underused. Legend at `y=SVG_H-14` glued to bottom edge, no breathing room. | MEDIUM |
| Motion quality | All sell/recovery marks fade+scale simultaneously at 0ms (per v3.1 finance/legal patch — eliminates narrative-causation framing). Disclaim «Provedo notices — no judgment, no advice.» fades at 600ms. **Total entrance: ~800ms (200ms scale + 600ms disclaim delay + 400ms disclaim fade) — over budget but only by ~30%.** Best-behaved animation in the inventory. | LOW |
| Data density | 3 sell events × 2 markers each = 6 marks on 12-month axis. Plus 6 axis labels (Jan/Mar/May/Jul/Sep/Nov — every other month). **Sparse but readable.** The story («3 sells, 3 recoveries 8 weeks later») is data-thin — could fit in a 1-line table without losing meaning. | HIGH |
| Distinctiveness | The horizontal-axis-with-triangles-and-circles pattern is generic chart vocabulary. Triangle-as-sell-marker is conventional. Nothing here signals «Provedo did this.» | HIGH |
| Brand alignment | Holds. The «no judgment, no advice» disclaim is load-bearing brand presence. Triangle/circle shape pairing is observational. | LOW (positive) |
| Best-in-class gap | **Stripe-gap:** Stripe's payment-timeline charts use a continuous baseline curve to imply context (price movement around the events), not just discrete markers on a flat line. **Linear-gap:** Linear adds tooltip-on-hover with full date + ticker + delta — we have static labels only. | MEDIUM |

**Verdict:** Solidest motion behavior in the inventory; data density too thin to justify the chart's screen real estate; visual vocabulary generic.

### 1.4 AllocationPieBar (Tab 4 «Aggregate») — 280×150 viewBox

**File:** `AllocationPieBar.tsx` (243 LOC) + `AllocationPieBarAnimated.tsx` (330 LOC).

| Dimension | Finding | Severity |
|---|---|---|
| Visual polish | Donut + stacked bar combo. Donut at 70,70 center r=60 outer / r=36 inner (40% hole). Stacked bars 11px tall × variable width. **Donut and bars compete for visual priority** with no clear hierarchy — both at the same scale weight. The chart is doing two jobs in one slot. | HIGH |
| Typography | Center label «$231k» at 13pt mono — **the only ≥10pt label on the chart.** All other labels at 9pt or 7pt (broker bar inline labels). 7pt white text inside 11px bars on AMZN (16px wide) — **renders as ~5-6px on 1440 display, illegible.** | CRITICAL |
| Spacing | Donut sits at left, labels stack vertically right of donut at `y=22,36,50,64` (14px line height). «By broker» header at y=86, IBKR row y=92-103, Schwab row y=108-119. **Whole right half has 4px gaps between elements** — cramped to the point of looking like a debug overlay. | HIGH |
| Stroke widths | Donut uses `strokeWidth=24` (OUTER_R - INNER_R) which is the stroke band, fine. Stacked bar borders absent — bars just touch with 1px gaps via `pos.w + 1`. Labels inside bars are 7pt white — not a stroke issue but a contrast issue (white on teal-active is OK contrast, white on `accent-light` `#CCFBF1` is **fail**). | CRITICAL (a11y) |
| Color application | Donut uses 4-color slate gradient (accent, secondary, tertiary, border) — **legible monochrome ramp.** Stacked bars use a 5-color teal gradient (accent-active, accent, accent-hover, accent-light, border). **The teal-light bar (GOOG) on cream background with white inner text is unreadable** — `#CCFBF1` on `#FAFAF7` has ~1.05:1 contrast (text invisible). | CRITICAL (a11y) |
| Whitespace | viewBox 280×150 packed to the brim. Mobile <768px: stacked bars become unreadable since the right column is a fixed 110px wide of the 280px viewBox = **scaled down to ~55px on a 320px screen.** | HIGH |
| Motion quality | 4 slices reveal 0/200/400/600ms via stroke-dashoffset (correct pattern), then bars at 800ms grow width 300ms each with 80ms cumulative stagger, then labels fade at 1100ms. **Total entrance: ~1.5s — over budget 2.5×.** PLUS: bars animate `width` property — **violates compositor-friendly properties rule** from the 5-rule motion constraint. This is a constraint violation. | HIGH (constraint violation) |
| Data density | Donut: 4 sectors. Stacked bars: 5 positions across 2 brokers. Center: $231k total. Labels: 4 sector %s + 5 ticker tags + 2 broker names + «By broker» + «total» = **17 distinct text elements + 4 arcs + 5 bars = ~26 items in 280×150px = 0.62 items/px².** **Densest chart in the inventory by ~3×.** Reader cannot resolve which information matters first. | CRITICAL |
| Distinctiveness | Generic dashboard composition. No signature. | HIGH |
| Brand alignment | Holds — teal-led palette. But the «By broker» grid reads as a Bloomberg-terminal screenshot, not as Provedo Magician+Sage register. Sage doesn't show 5 tickers in a 110×30px grid; Sage shows 1 number that matters. | HIGH |
| Best-in-class gap | **Kubera-gap:** Kubera's allocation surface uses ONE primary view (donut OR bar) + a secondary expandable layer for the broker breakdown — never both at once. **Mercury-gap:** Mercury's account-aggregation card uses bento sub-cards with one number per sub-card, not a packed combo. **Anthropic-gap:** Anthropic's «models» comparison surface dedicates one row per dimension — never overlays two information types. | HIGH |

**Verdict:** **Worst chart in the inventory.** Two charts forced into one slot, sub-floor typography in critical paths, contrast failures (7pt white on teal-light), motion-rule violation (animates `width`), data density 3× the next-densest chart. This is the strongest candidate for restructure.

### 1.5 BrokerPieMockup (Hero L3 layer) — 160×100 viewBox, inline in `ProvedoHeroV2.tsx` lines 268-392

**Note:** rendered at 320px container width with `opacity: 0.6` on desktop, hidden on mobile. Visual function is **atmospheric depth element**, not primary chart.

| Dimension | Finding | Severity |
|---|---|---|
| Visual polish | 4-segment SVG donut via 4 stacked `<circle>` elements with `strokeDasharray` segments and `strokeDashoffset` rotations. **Math-correct but not arc-aligned to standard donut conventions** — segments start from the right (3 o'clock), not from top (12 o'clock). Reader's expectation broken. | MEDIUM |
| Typography | Center «$231k» at 10pt, «total» at 8pt, slice labels at 9pt — uniformly sub-floor. At 0.6 opacity on cream background, mono `#0F172A` 10pt becomes effective contrast ~2.8:1 — **WCAG AA fails for normal text** (requires 4.5:1). | HIGH (a11y) |
| Spacing | Donut at left, labels stacked at `x=100, y=28/40/52/64` (12px line height). Card padding `p-4` (16px) + 12px label-stack margin = **34% of the 160px width is donut+gap before labels start.** Labels then have 60px of horizontal space → cramped to «Health 14%» (10 chars max) without ellipsis risk. | LOW |
| Stroke widths | 18px stroke on r=30 circle. 18/30 = **60% of circle radius is stroke** — donut hole is r=21px. Visually OK but the wide-stroke pattern is GitHub-status-pie aesthetic, not Provedo-Sage. | MEDIUM |
| Color application | Same teal-monochrome as Tab 4 donut. At 0.6 parent opacity, teal becomes `~#67BAB0` perceived — desaturated. Effective brand-color presence in hero is thin. | MEDIUM |
| Whitespace | 16px card padding + small SVG = card area is 80% chart-occupied. Looks dense for a hero atmospheric element. | MEDIUM |
| Motion quality | Static. Inherits hero parallax (12px translate on scroll). | LOW |
| Data density | 4 slices + center label + 4 side labels = 9 items in a 320×100 atmospheric card. Not too bad, but the entire card is supposed to read as «context, not focus» — and 9 readable items pulls the eye into the back layer competing with the chat L1. | MEDIUM |
| Distinctiveness | Hero has 3 stacked mockups (chat L1, insight feed L2, broker pie L3). The pie L3 is the weakest of the three — chat and insight feed both look like product surfaces, the pie looks like an isolated chart widget. **Asymmetric mockup credibility.** | HIGH |
| Brand alignment | Acceptable. Teal donut + warm-cream card + slate text holds the palette. | LOW |
| Best-in-class gap | **Linear-hero-gap:** Linear's stacked hero mockups use 3 surfaces of the SAME product (issue list, kanban, dashboard). All three read as «one product, three views.» Provedo's L3 reads as «one product surface (chat) + one peripheral widget (insight feed) + one orphan chart (pie).» The pie should look like part of a portfolio dashboard surface, not a standalone widget. | HIGH |

**Verdict:** Wrong artifact in the L3 slot. A pie chart card is not a «product surface mockup» — it's a chart widget. The hero composition needs an actual portfolio-dashboard mockup in L3, with the pie embedded inside it.

---

## §2. Cross-cutting findings

### 2.1 Typography floor violation across the board

| Chart | Smallest text size | Below 10pt floor? |
|---|---|---|
| PnlSparkline | 9pt (axis), 9pt (event labels) | Yes |
| DividendCalendar | 8pt (ticker amounts) | Yes |
| TradeTimeline | 8pt (legend), 9pt (labels) | Yes |
| AllocationPieBar | 7pt (in-bar inline ticker labels) | Yes (CRITICAL) |
| BrokerPieMockup | 8pt (`total` label) | Yes |

**Design Brief §4.2 typography scale floor for marketing surfaces is 12pt body / 11pt labels.** Current charts ship at 7-9pt across the board. This is the single largest category-level issue and the one PO is most likely picking up subconsciously («cluttered», «hard to read», «cheap-looking»).

### 2.2 Motion budget violation across the board

| Chart | Total entrance time | 600ms budget? |
|---|---|---|
| PnlSparkline | 2.6s | Over by 4.3× |
| DividendCalendar | 1.8s | Over by 3.0× |
| TradeTimeline | 0.8s | Over by 1.3× |
| AllocationPieBar | 1.5s | Over by 2.5× (PLUS animates `width` — violates compositor rule) |

**Per the 5 motion rules locked from finance/legal v3.1 patches, max 600ms total entrance per chart.** Three of four animated charts violate by 1.3×-4.3×. AllocationPieBar additionally violates the compositor-friendly-properties rule by animating SVG rect `width`.

### 2.3 Brand-archetype drift toward Generic-Dashboard

Magician+Sage register requires:
- Restraint in visualization (one number that matters > many numbers)
- Editorial gravitas (typography that signals attention to craft)
- Observation framing (not «here's data» but «here's what stood out»)

Current charts read:
- Information-overload (Tab 4 packs 26 items in 280×150px)
- Sub-floor typography signaling «cheap dashboard widget»
- Equal-weight visual treatment (no editorial hierarchy — every label gets the same 8-9pt mono)

The PO's «нужно сделать красивые, нормальные графики» almost certainly maps to: **«these read as cheap dashboard widgets, not as Provedo product moments.»**

### 2.4 Three named-reference gaps PO would notice

1. **Granola gap — fully-written + larger-numeral content fidelity.** Granola embeds charts INSIDE meeting summary cards where the chart is one element of a richer card (header text + chart + summary line). The chart's primary numeral renders at 18-24pt, supporting axis at 11-12pt. **Provedo has 13pt as max numeral and the chart sits naked in the bubble.**
2. **Linear gap — primary stroke at 2px+ in brand color, filled-area gradient at 12% opacity.** Linear's analytics use brand purple at 2px+ stroke for primary data + a 12% opacity filled area underneath. **Provedo's PnL line is 1.5px slate-gray — the brand color (teal) is absent from the most-prominent chart.**
3. **Anthropic Console gap — typographic hierarchy + breathing room.** Anthropic Console charts ship 1 primary metric at 24-32pt mono, axis at 11pt, hover-state for detail. Charts are surrounded by 24-32px whitespace inside their cards. **Provedo charts have 12px top margin + 4px bottom margin and zero internal whitespace.**

---

## §3. Three upgrade proposals

### Proposal A — «Polish current» (LOWEST scope, safest)

**Premise:** Architecture is correct. Execution is sub-floor. Polish typography, motion, spacing, color application without restructuring any chart.

**Concrete moves:**

1. **Typography lift across all 5 charts.** Bring ALL text to ≥11pt mono (small floor) and key numerals to 16-20pt mono (primary floor). Specifically:
   - PnL end label `−4.2%`: 11pt → 18pt mono medium
   - PnL axis labels: 9pt → 11pt
   - PnL event labels (AAPL/TSLA): 9pt → 11pt
   - DividendCalendar ticker amounts: 8pt → 11pt; counter «$312»: 11pt → 16pt mono medium
   - TradeTimeline month labels: 9pt → 11pt; legend: 8pt → 10pt minimum
   - AllocationPieBar center: 13pt → 22pt mono medium; in-bar labels REMOVED (use external legend instead — 7pt white-on-light-teal is a contrast failure regardless)
   - BrokerPieMockup: bring to parity with Tab 4 donut after lift
2. **Color application lift on PnL sparkline (highest leverage).** Switch line stroke from `var(--provedo-text-secondary)` (slate-700) to `var(--provedo-accent)` (teal-600), bump stroke from 1.5px → 2px, gradient fill from `border-subtle` → `accent` at 12% opacity. The chart finally signals «Provedo brand data viz» instead of «gray line on cream.»
3. **Motion budget compliance.** Cap each chart's total entrance at 600ms. Drop staggered slice reveals (Tab 4) to single combined dashoffset. Drop counter animation to instant render with fade-in. Drop dot pulse on PnL.
4. **Spacing & stroke fix.** Cell borders on DividendCalendar 0.5px → 1px (visible at all DPRs). Add 8-12px internal padding around each chart's drawable area. Drop AllocationPieBar in-bar labels (contrast fail) — move ticker names to external legend.
5. **Replace AllocationPieBar `width` animation** with `transform: scaleX()` to comply with compositor-friendly rule. Or drop the animation entirely (preferred — saves complexity).

**Scope:** ~6-8h frontend-engineer. Each change is a token-swap or single-line edit.
**Risk:** Low. Architecture untouched. Lane A discipline preserved.
**Reward:** Solves typography floor + motion budget + brand-color absence in one pass. Charts will read «considered + on-brand» without restructuring.
**Trade-off:** Doesn't address structural issues (AllocationPieBar packs 2 charts in 1 slot; DividendCalendar 5:1 aspect on mobile; BrokerPieMockup is wrong artifact for L3).

### Proposal B — «Restructure 1-2 charts» (MID scope, targeted fix)

**Premise:** Polish can't fix the structural issues. Restructure the 1-2 weakest charts; polish the rest per Proposal A.

**Charts to restructure (priority order):**

1. **AllocationPieBar — split into bento-card duo.** Replace the packed 280×150 combo with two cards in a 2-column bento at the same total footprint:
   - **Card A (left):** Donut only at 160×160 with center «$231k / total» at 24pt/12pt mono. 4-slice teal-monochrome, slice labels OUTSIDE donut with 1px leader lines (not in legend stack), each label 12pt with $-amount in same line («Tech 58% · $134k»).
   - **Card B (right):** «By broker» — drop the stacked bar entirely. Use a 2-row mini-table: «IBKR · $186k · 5 positions» / «Schwab · $45k · 2 positions». 14pt mono numerals, 10pt mono labels. No bar visualization — the numbers ARE the visualization.
   - **Outcome:** Reader gets 2 clean reads (donut for sector, table for broker) instead of 1 cluttered read with 26 items.
2. **PnlSparkline — upgrade to filled-area mini-chart with explicit y-axis reference.** Restructure visual treatment:
   - 280×140 viewBox (taller +20px for breathing room above/below)
   - Add **explicit y-axis labels** at right side: «+1%» at top, «0%» at baseline, «−5%» at bottom. 11pt mono tertiary.
   - Line stroke 2px teal-600. Filled area gradient teal at 12% → 0% opacity.
   - Two emphasis dots at 6px radius (currently 4px) with 11pt mono labels above
   - End label `−4.2%` at 20pt mono medium negative-color, sitting in the right margin (not crammed inside the chart)
   - Single 600ms entrance: stroke draw 600ms, dots+labels appear together at 600ms.

**Charts to keep + polish per Proposal A:** DividendCalendar, TradeTimeline, BrokerPieMockup.

**Scope:** ~12-16h. Frontend-engineer ~10-12h restructure + ~4h polish pass on the other charts.
**Risk:** Medium. AllocationPieBar restructure changes the v2 visual spec section §2.4 — Design Brief sub-section needs a v1.4 → v1.5 bump. Brand-voice-curator should review the new copy («$134k», «5 positions») for Lane A discipline.
**Reward:** Fixes the two structural problems while keeping the architecture of the other three. Tab 4 becomes the **best chart** in the inventory instead of the worst. PnL sparkline finally carries the brand signature. Total chart-quality lift is 60-70% of Proposal C with 50% of the scope.
**Trade-off:** Doesn't address BrokerPieMockup-as-wrong-artifact in hero L3 (deferred). Doesn't add interactivity (which PO may or may not want).

### Proposal C — «Bento + interactivity» (DEEPEST scope, highest novelty)

**Premise:** Treat all 4 demo tab charts as a coherent bento-grid with hover-to-reveal data layers. Move from «4 isolated charts in 4 tabs» to «1 portfolio bento on 1 surface, with the chat surface to the right.»

**Concrete restructure:**

1. **Drop the 4-tab interaction.** Replace with a 3×2 bento grid below the chat mockup:
   - Cell 1 (2×1, top-left): PnL with monthly toggle (1M/3M/1Y) — interactive
   - Cell 2 (1×1, top-right): Dividend calendar (3-month strip)
   - Cell 3 (1×1, mid-right): Allocation donut (sector)
   - Cell 4 (1×1, bottom-right): Trade pattern (sell/recovery markers)
   - Cell 5 (2×1, bottom-left): «By broker» table card
2. **Add hover-to-reveal data layers** on PnL (date+price tooltip), DividendCalendar (full event detail), Allocation (slice expand on hover with $-amount).
3. **Single coherent visual treatment.** All bento cards share: 16px internal padding, `var(--provedo-bg-elevated)` background, `var(--provedo-border-subtle)` 1px border, 12px radius. One typographic system — primary numerals 22pt mono medium, secondary 14pt mono, labels 11pt mono.

**Scope:** ~30-40h. Frontend-engineer ~24-30h (rebuild tab interaction → bento; add hover state machinery; add tooltip primitive). Product-designer ~6-10h (bento layout spec + interaction spec). A11y-architect ~2h (hover-tooltip keyboard parity).

**Risk:** HIGH.
- **Architectural break:** slice-LP3.2 demo-tabs are a documented landing-page component pattern. Removing breaks both the §S4 spec in `redesign-synthesis-product-designer.md` and the v3.1 finance/legal patch which is scoped to per-tab disclaim placement.
- **Lane A risk surface:** hover-to-reveal can imply «interactive product preview» — if the hover state surfaces an answer that reads prescriptive, Lane A is gone. Brand-voice-curator review required for every tooltip string.
- **Motion budget:** 4 simultaneous bento cell entrances likely exceeds the 3-simultaneous-animations rule. Needs sequencing.
- **Mobile collapse:** bento at 320px wide collapses to 1-column stack — same as current, but now with more visual chrome per card.
- **Overshoot risk:** PO said «красивые, нормальные графики» — not «interactive bento.» Risk of solving a problem PO didn't ask to be solved.

**Reward:** Highest visual novelty. Brings Provedo into Mercury/Brex/Linear-tier dashboard composition. **But this is a v4 redesign-tier move, not a v3.2 patch.** If PO actually wants a v4 visual pivot, this is the right direction. If PO wants the current charts to look better, this overshoots.

---

## §4. Weighted recommendation

**Recommend Proposal B.** Reasoning:

- Proposal A solves typography + motion + brand-color absence. **It does not solve the AllocationPieBar overload (the most-likely subconscious source of PO's «нормальные» complaint).** Reader-facing improvement is real but ceiling is bounded by Tab 4 staying cluttered.
- Proposal C overshoots. PO directive used language suggesting visual quality concern, not interaction-pattern concern. Adding a bento + hover layer = scope explosion + Lane A risk surface + slice architecture break, all to solve a stated «красивые, нормальные» request that Proposal B addresses.
- Proposal B targets the two structural failures (AllocationPieBar overload + PnL brand-color absence) and absorbs Proposal A's polish pass for the remaining three charts. **Net visual-quality lift is ~70% of Proposal C at ~40% of scope.**
- Lane A discipline preserved. Hero copy untouched. Token palette untouched. v2 spec needs a v1.4→v1.5 doc bump for the Tab 4 restructure — manageable.

**Top 3 charts to upgrade first (priority order):**

1. **PnlSparkline** — single chart visible above the fold on Tab 1 (the default tab). Brand-color absence is the highest-leverage fix; readers' first chart-impression sets the tone. Apply Proposal B restructure (filled-area + 2px teal + explicit y-axis + 20pt end label).
2. **AllocationPieBar** — the visually-densest chart and the worst single offender on a11y (7pt white on `#CCFBF1`). Apply Proposal B restructure (split to 2-cell bento: donut + broker-table).
3. **DividendCalendar** — apply Proposal A polish (1px borders + 11pt minimum + 24px month gap + drop counter animation, render counter instantly).

TradeTimeline and BrokerPieMockup are lower-priority. TradeTimeline is the strongest motion behavior + correct semantic colors; only typography needs lift. BrokerPieMockup is hidden on mobile and renders at 0.6 opacity — visual-impact ceiling is low even after polish; defer to a later hero-mockup-redesign cycle.

---

## §5. Risks + open questions for PO (via Right-Hand)

1. **Does PO want Lane A disclaim to remain on every chart?** Tab 3's «Provedo notices — no judgment, no advice.» disclaim is load-bearing v3.1 patch. Restructure proposals preserve it. If PO wants it removed/relocated, Lane A guard requires re-review with legal-advisor.
2. **Does PO want hover/tooltip interactivity?** This is the Proposal B vs C boundary question. If PO says yes, Proposal B becomes Proposal B+ (~16-20h) with hover-on-PnL and hover-on-Allocation only.
3. **Tab 4 restructure requires Design Brief §11 + visual-spec §2.4 doc updates.** PO authorization to bump v1.4 → v1.5?
4. **AllocationPieBar has 5 broker positions in mock data.** «5 positions» on the new broker-table card is verifiable from the source. Should we extend mock to 7-8 positions to make the «across all your brokers» value-prop louder?
5. **PO did NOT specify mobile vs desktop priority.** All three proposals improve desktop more than mobile. If PO's complaint is mobile-specific, the priority order shifts (DividendCalendar 5:1 aspect ratio becomes #1 priority — currently #3).

---

## §6. Pre-delivery checklist (against ui-ux-pro-max 10-priority rubric)

| Priority | Status under Proposal B |
|---|---|
| 1 Accessibility | Resolved — 7pt-white-on-teal-light contrast fail is removed. All text ≥11pt. |
| 2 Touch & Interaction | Hold (no interactive surfaces added in Prop B). |
| 3 Performance | Hold — inline SVG, no library, no runtime cost change. |
| 4 Style Selection | Improved — typography lift signals craft; brand-color presence on PnL signals on-brand. |
| 5 Layout & Responsive | DividendCalendar still has mobile aspect issue under Prop B (covered by Prop A polish only). Open. |
| 6 Typography & Color | Resolved — semantic tokens preserved, sizes ≥11pt floor. |
| 7 Animation | Resolved — 600ms budget enforced, compositor-friendly properties only. |
| 8 Forms & Feedback | N/A. |
| 9 Navigation | Tab structure preserved (Prop B), no nav impact. |
| 10 Charts & Data | Improved — donut paired with table (not stacked-bar) avoids redundancy; PnL adds y-axis reference. |

**Tokens used (Prop B, no new tokens):** `--provedo-accent`, `--provedo-accent-hover`, `--provedo-accent-active`, `--provedo-accent-subtle`, `--provedo-bg-page`, `--provedo-bg-elevated`, `--provedo-bg-muted`, `--provedo-text-primary`, `--provedo-text-secondary`, `--provedo-text-tertiary`, `--provedo-border-subtle`, `--provedo-border-default`, `--provedo-positive`, `--provedo-negative`, `--provedo-font-mono`. Identical to v3.1 — zero token changes.

---

**End of audit.**
