# Coach Surface Spec — Memoro

**Owner:** product-designer
**Status:** draft v1.0 — awaiting Navigator + tech-lead sign-off (informs Slice 8c)
**Date:** 2026-04-23
**Scope:** dedicated `/coach` route — full-surface behavioral coach. Standalone route (not a filter inside Insights feed), per PO dashboard-primary architecture decision Q3 2026-04-23.
**Depends on:** `docs/04_DESIGN_BRIEF.md` v1.1→v1.2; `docs/design/DASHBOARD_ARCHITECTURE.md` v1.0; `docs/CC_KICKOFF_option4_coach_adr.md` (tech-lead pattern-detection architecture — ADR 1 + ADR 5 for soft-gate semantics).

---

## 0. Delta from tech-lead ADR

Tech-lead's ADR recommended Coach live inside the existing Insights Feed as a new insight-type (`coach_weekly`). Product-designer disagrees with that specific recommendation for UX reasons, but **without disagreeing on the backend architecture**:

- **Keep ADR 1-5 backend architecture.** Core API rule-based detection + AI Service narrative + regex guardrail + soft 30-day gate. All of that is sound.
- **Change the delivery surface.** Coach gets its own route (`/coach`) with its own tab, NOT a filter-view of Insights Feed.

**Why the delta:**

1. **User segmentation weight.** Coach is the differentiator against PortfolioPilot / Origin / Mezzi — it is a category claim («Second Brain that pattern-reads your behavior»). Burying it as a filter-chip inside Insights Feed demotes the category claim from «this is one of three Second Brain surfaces» to «this is a type of insight». The positioning lock (Option 4, three-surface metaphor) requires three visible destinations.
2. **Cold-start design problem demands a dedicated surface.** The 30-day cold-start needs a full-surface narrative treatment (see §3). A filter-chip inside Insights Feed cannot host a cold-start empty state without dominating the feed's normal state for non-coach users.
3. **Mobile tab-bar affords 4 primary tabs (iOS HIG).** Coach earns a tab slot. Hiding it behind a filter makes mobile users three clicks deep for a surface we advertised as primary.
4. **Engineering scope impact: +0 slices.** Coach still ships inside Slice 8c (per tech-lead) — the slice shifts from «filter-chip + new card variant inside insights feed» to «dedicated /coach route reusing the same card primitive». LOC estimate unchanged.

**What's unchanged:** detection architecture, narrative generation, pattern catalog, weekly cadence, regulatory guardrail, soft gate. All of it.

This delta is tracked as an open question for Navigator → PO (§9).

---

## 1. Coach home layout

```
┌─────────────────────────────────────────────────────────────────┐
│ /coach                                                          │
├─────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ HEADER                                                     │  │
│ │   Memoro · Coach                                           │  │
│ │   "Patterns Memoro noticed in your trades"                 │  │
│ │   Last read: 2 days ago  ·  Next read: Sunday              │  │
│ └────────────────────────────────────────────────────────────┘  │
│                                                                 │
│ ┌───────────────────────────────────────────┬───────────────┐   │
│ │ FILTER ROW (chips, horizontal scroll mob) │ Counter       │   │
│ │ All · Concentration · Timing · Dividends  │ N patterns    │   │
│ └───────────────────────────────────────────┴───────────────┘   │
│                                                                 │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ WEEK ANCHOR — "Week of April 14 – 20"                      │  │
│ ├────────────────────────────────────────────────────────────┤  │
│ │ PATTERN CARD                                               │  │
│ │   Category pill · Date read                                │  │
│ │   Headline (one line, verb-led)                            │  │
│ │   Summary (2-4 lines — no imperatives)                     │  │
│ │   Evidence: You sold AAPL on 2026-02-15, 2026-02-22…       │  │
│ │   Source (link to transactions) · Dismiss · Snooze         │  │
│ └────────────────────────────────────────────────────────────┘  │
│                                                                 │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ PATTERN CARD (locked preview for Free)                     │  │
│ │   Category pill · "Pattern locked"                         │  │
│ │   Headline (obfuscated: "A behavioral pattern this week")  │  │
│ │   Summary (blurred / redacted lines)                       │  │
│ │   [Upgrade to Plus to read ▸]                              │  │
│ └────────────────────────────────────────────────────────────┘  │
│                                                                 │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ WEEK ANCHOR — "Week of April 7 – 13"                       │  │
│ │   (older pattern cards, same anatomy)                      │  │
│ └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Header

- Title: «Memoro · Coach» — positional crumb, reinforces Memoro is the agent. `text-2xl` Semibold, `text.primary`.
- Subtitle: verb-led short explanation. «Patterns Memoro noticed in your trades» — `text-sm` `text.secondary`.
- Meta row: last read + next scheduled read. Uses `text-xs` `text.muted`. Helps users understand the weekly cadence without needing to ask.

### Filter row

- Chip primitives (Design Brief §10.1). Selected chip has `accent.primary` outline + `violet-50` fill.
- Categories map to pattern catalog codes (per tech-lead §2.4): Concentration / Timing / Dividends / Cost-averaging / Contrarian-signal. Plus «All» default.
- Horizontal scroll on mobile <640. Wrapped on desktop.
- Right-aligned counter: `N patterns` showing filtered count (visual parity with Insights feed, Slice 6a pattern).

### Week anchor

- Divider-style section header separating pattern cards by week.
- `text-sm` Medium, `text.secondary`. «Week of April 14 – 20» format.
- Scroll-sticky on desktop (optional polish; can defer).

### Empty state (≥30d history, no patterns this week)

- See §3 for full cold-start treatment (before 30d).
- Post-30d «no pattern this week» state: compass icon at 40px, line: «Memoro read your trades this week and didn't flag a pattern. That's a good sign», no CTA. Previous weeks still visible below if any.

---

## 2. Pattern card anatomy

This is the core reusable primitive. Name it `CoachPatternCard` (parallel to `InsightCard` but distinct).

### Default state (Free, no lock) OR (Plus, Pro)

```
┌─────────────────────────────────────────────────────────┐
│ [Timing]  ·  Read: 2 days ago                           │
│                                                         │
│ Memoro noticed a sell-at-local-low pattern              │
│ in your AAPL trades                                     │
│                                                         │
│ You sold AAPL on three dates in the last 90 days, each  │
│ within 2% of a local low. Each time, AAPL recovered     │
│ within 30 days. Memoro noticed this is a pattern —      │
│ no judgment on whether it was the right call.           │
│                                                         │
│ ┌─────────────────────────────────────────────────┐     │
│ │ Evidence                                        │     │
│ │   · Sold 12 AAPL on 2026-02-15 at $158.22      │     │
│ │   · Sold 18 AAPL on 2026-02-22 at $155.40      │     │
│ │   · Sold  8 AAPL on 2026-03-05 at $162.11      │     │
│ │ View transactions ▸                             │     │
│ └─────────────────────────────────────────────────┘     │
│                                                         │
│ 🗨  Dismiss   ·   ⏱  Snooze 30 days                     │
└─────────────────────────────────────────────────────────┘
```

**Anatomy (by element):**

- **Category pill:** chip with category name in `text-xs` Medium. Color by category: Concentration (`amber-600` outline), Timing (`sky-600` outline), Dividends (`emerald-600` outline), Cost-averaging (`emerald-600` outline), Contrarian-signal (`sky-600` outline). Category color is NOT a signal of «good/bad» — never red/green for category pills. Color is categorical, not evaluative. See accessibility §6.
- **Read date:** `text-xs` `text.muted`, relative format («2 days ago», «April 14», «3 weeks ago»).
- **Headline:** `text-lg` Medium, `text.primary`. One line. Verb-led, Memoro as subject, user in 2nd person. Never «Your brain noticed». Never imperative («You should…»). Framing template: «Memoro noticed [pattern] in your [context]» OR «Memoro flagged [observation]».
- **Summary:** `text-base` Regular, `text.secondary`. 2-4 lines. Closes with «no judgment» framing language or Lane-A-safe phrase («no recommendation to make», «patterns only»).
- **Evidence block:** bordered (border.subtle, radius-md, padding 12) sub-panel. Header «Evidence» in `text-sm` Medium. Body: bulleted list of specific transactions with exact qty/price/date. Monospaced (`Geist Mono`) tabular-nums for qty + price. Link: «View transactions» → `/positions?filter=[symbol]` with linked tx rows. This evidence block is what earns user trust — every claim cites data.
- **Actions row:** `Dismiss` (primary destructive-adjacent; text-sm, text.secondary, icon `x`) + `Snooze 30 days` (secondary; icon `clock`). Dismiss removes the pattern permanently. Snooze hides for 30 days and returns if pattern still holds. Both use existing insights mutation contract from Slice 6b (no new backend needed — tech-lead confirms pattern-read rows reuse insights-mutation endpoints).

### Plus/Pro full detail — identical to default state

No visual distinction between Plus and Pro for coach readings — both tiers see full evidence + full narrative. Pro tier differentiator is real-time cadence (daily pattern-scans instead of weekly); Plus stays weekly (ADR 3). Both get full content once delivered.

---

## 3. Cold-start handling — 30-day empty state

This is the critical surface. Hero promises «remembers», and the first month is structurally empty for users without historical import. The design must reframe that emptiness as productive.

### Two paths

Per tech-lead ADR 5 (soft gate — `tx_count >= 30 OR span >= 30 days`):

**Path A — Warm-start (historical import via SnapTrade backfill).** User connects a broker with ≥30 days of history. Backfill pulls it. Coach runs immediately on available history. First pattern-read lands within ~10 minutes of first sync completing. Stage 3 of onboarding promise fires on-sync, not on-day-30.

**Path B — Cold-start (no historical data).** User has a broker with no backfill, or account is genuinely new. Coach has no history to pattern-read. Hard wait until 30 days / 30 transactions accumulate.

### Path A empty state (warm-start pending, backfill running)

```
┌─────────────────────────────────────────────────────────┐
│                    🧭                                   │
│                                                         │
│      Memoro is reading your trade history               │
│                                                         │
│   We're processing the trades Memoro can see            │
│   from your broker. First patterns land in              │
│   a few minutes — usually under 10.                     │
│                                                         │
│           [ Progress bar — ~40% ]                       │
│                                                         │
│   What Memoro will look for:                            │
│     · Concentration patterns                            │
│     · Timing patterns (when you buy / sell)             │
│     · Cost-averaging rhythms                            │
│     · Dividend clusters                                 │
│                                                         │
│   You can close this page — we'll notify you.           │
└─────────────────────────────────────────────────────────┘
```

- Progress bar: optional visual. Shows a conservative fraction based on «transactions processed / transactions to process». If exact count not available, show indeterminate animated shimmer instead of false precision.
- «What Memoro will look for» list: sets expectations without promising specific patterns will be found.
- «Close this page — we'll notify you»: respects user's time. Bell notification fires when first pattern-read completes.
- If backfill genuinely takes >30 minutes (edge case), escalate tone: «This is taking longer than usual — your broker's data feed is slow. We'll notify you when ready.»

### Path A empty state (warm-start succeeded, patterns generated)

User lands on /coach and sees the populated surface per §1 — skip the empty state entirely.

### Path B empty state (no history, genuine cold-start)

```
┌─────────────────────────────────────────────────────────┐
│                    🧭                                   │
│                                                         │
│        Memoro is still learning your portfolio          │
│                                                         │
│   Coach needs at least 30 days of trade history         │
│   to read patterns. You have [N] days — [M] to go.      │
│                                                         │
│          ┌──────────────────────────────┐               │
│          │ Progress: ████░░░░░░░ 8/30   │               │
│          └──────────────────────────────┘               │
│                                                         │
│   In the meantime:                                      │
│     · Dashboard shows what Memoro sees today            │
│     · Insights flag things you'd miss                   │
│     · Chat answers questions about your holdings        │
│                                                         │
│   [  Go to Insights  ]    [  Ask Memoro  ]              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

- Progress counter with day-count (or transaction-count — whichever the soft-gate logic is using for this user; show the one closer to threshold).
- Sets expectation clearly: 30 days is the bar, you're not being gated forever.
- Routes user to surfaces that DO work during the cold-start (Insights + Chat). Dashboard works from day 1 too, but routing user back to dashboard feels like a loop.
- Tone: «Memoro is learning», not «you don't have enough». Never make the user feel inadequate. «Still learning» is honest and doesn't blame the user.
- Never show a locked pattern card here — cold-start is about emptiness, not about upselling.

### Counter behavior

- Updates daily. If user crosses threshold mid-day (first pattern read completed), surface auto-refreshes to populated state on next load. Don't require manual reload.
- If Path A backfill completes mid-Path-B wait, user auto-promotes to Path A then populated state.
- Counter never goes backward. If tx count drops (e.g., a transaction is deleted in broker), counter holds highest-ever-seen value. This prevents a punitive «you lost a day» experience.

---

## 4. Interaction states

Each `CoachPatternCard` has these states.

### Default (populated, unread)

Base visual per §2.

### Hover (desktop)

- Card border transitions from `border.subtle` → `border.default` over 120ms.
- Evidence block does NOT change.
- Actions row stays visible (already not hover-gated).
- Cursor: default (not pointer — the card itself isn't clickable; only its buttons are).

### Focus

- 2px `violet-700` focus ring with 2px `background.page` offset. Wraps entire card when card-level focus is triggered (via keyboard tab).
- Individual buttons (Dismiss, Snooze, View transactions) get their own focus rings on internal tab-walk.

### Active / Pressed (Dismiss, Snooze buttons only)

- Button scale(0.97) for 100ms. `accent.pressed` color for primary variants.

### Loading (mutation in flight)

- On click of Dismiss or Snooze: button shows spinner (16px) + disables. Card stays visible until mutation resolves. On success: card fades out 200ms (respects reduced-motion — instant removal on reduce).

### Error (mutation failure)

- Card stays visible. Toast («Couldn't dismiss this pattern — try again») appears top-right. Button re-enables.

### Teaser-paywall (Free tier, §5)

- See §5.

### Empty state (§3)

- See §3.

---

## 5. Teaser-paywall visual pattern

Free tier sees a **locked preview** of coach patterns. This is the «Memoro noticed a pattern» tease that hooks upgrade conversion without feeling manipulative.

### Locked card layout

```
┌─────────────────────────────────────────────────────────┐
│ [Timing]  ·  Locked preview                             │
│                                                         │
│ Memoro noticed a pattern in your trading this week      │
│                                                         │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░            │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░            │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                       │
│                                                         │
│ ┌─────────────────────────────────────────────────┐     │
│ │ Evidence   [locked]                             │     │
│ │ ░░░░░░░░░░░░░░░░░░░░░░░░░                       │     │
│ │ ░░░░░░░░░░░░░░░░░░░░░░░░░                       │     │
│ └─────────────────────────────────────────────────┘     │
│                                                         │
│ Plus unlocks full pattern reads + weekly cadence.       │
│ [ Upgrade to Plus  ▸ ]                                  │
└─────────────────────────────────────────────────────────┘
```

**What's shown:**

- **Category pill** — shown (Timing, Concentration, etc.). Tells user what domain the pattern is in without telling them the pattern.
- **Headline** — generic «Memoro noticed a pattern in your trading this week» / «Memoro noticed a concentration pattern this week» / «Memoro noticed a dividend rhythm this week». Category-specific but pattern-vague.
- **Summary lines** — rendered as skeleton shimmer (horizontal bars) in `background.muted` color. NOT filled with text. User knows content is there but cannot read it.
- **Evidence block** — locked. Evidence header shown with a small lock icon; body shown as skeleton shimmer.
- **CTA** — «Upgrade to Plus» primary button. One honest sentence of value explanation below the button.

**What's NOT shown:**

- No exact pattern name («sell-at-local-low» is withheld — category «Timing» is shown, specific pattern is not).
- No dates, symbols, or transaction details.
- No «# of patterns locked» count — avoids scarcity framing.
- No countdown timers, no urgency language («your patterns expire in…»). Never.

**Design Brief §13.3 «Never» list enforced.** No dark patterns. Upgrade copy is honest about value, not guilt-trip.

### Locked card visual treatment

- Card outline: `border.default` (slightly darker than default cards to signal «restricted»).
- Content overlay: skeleton shimmer on text lines (matches existing skeleton primitive from §10.1).
- Lock icon on the Evidence block header: Lucide `lock`, 14px, `text.muted`.
- CTA button: `accent.primary` fill, `text.onAccent` text. Same as primary button in rest of system — no special «urgent upgrade» styling.
- Hover: cursor stays default (card not clickable); button hovers normally.

### When teaser-paywall shows

Per `DASHBOARD_ARCHITECTURE.md` §2 Coach teaser tile note:

- Free tier with ≥30 days history: shows latest locked pattern on dashboard AND inside /coach route.
- Free tier with <30 days history: shows cold-start empty state on /coach (§3); no locked card. Dashboard Coach teaser tile is also hidden in this window.
- Plus/Pro: no locked cards ever. All patterns full content.

### Upgrade CTA destination

- Routes to `/pricing?source=coach&pattern=[category]` — analytics tracking the conversion source. Product-designer does not own this URL/analytics scheme; hands to navigator → frontend-engineer for implementation.
- Modal vs full-page: recommend full-page paywall for coach upgrade (matches Design Brief §13.2 «page lock»). Coach is a dedicated surface; users clicking «upgrade» expect to see pricing comparison, not a modal. PO to confirm.

---

## 6. Accessibility

### Screen reader

- Page title: «Coach — Memoro».
- Each week anchor is `<h2>` (e.g., `<h2>Week of April 14 – 20</h2>`).
- Each pattern card is `<article aria-labelledby="pattern-[id]">`. The headline carries the `id`.
- Category pill is decorative-with-label: `<span class="category-pill" aria-label="Category: Timing">Timing</span>`. Don't rely on visual category-pill alone.
- Evidence block is `<section aria-label="Evidence">` with `<ul>` of transactions. Each transaction line announces qty, symbol, date, price.
- Dismiss / Snooze buttons: `aria-label="Dismiss pattern: [headline]"` / `aria-label="Snooze pattern for 30 days: [headline]"`.
- Locked state: `aria-label` on card adds «Locked preview. Upgrade to Plus to read.» so screen-reader users understand the gate without visual skeleton inference.
- **Verb-led framing on screen reader:** «Memoro noticed a sell-at-local-low pattern in your AAPL trades». Never «your brain noticed». Never «your second brain…». The name of the agent IS «Memoro» — screen readers say it cleanly. The brain metaphor lives in positioning copy, NOT in UI chrome.

### Keyboard flow

- Tab into /coach header.
- Tab through filter chips left-to-right.
- Tab into first pattern card (focus ring wraps card).
  - Enter / Space while card focused: no-op. Card isn't a button.
  - Tab again: focus moves to «View transactions» link inside evidence.
  - Tab: Dismiss button.
  - Tab: Snooze button.
  - Tab: next card.
- Escape: unfocuses card; returns to nav.

### Contrast

- All text on card surface meets 4.5:1.
- Skeleton shimmer lines for locked cards: `background.muted` on `background.elevated`. Intentionally low contrast — signal is «not readable». Not a WCAG violation because skeleton is decorative; underlying locked state has text alternative.
- Category pill text: 4.5:1 minimum on chip fill.
- Evidence block monospaced numbers: 4.5:1.

### Reduced motion

- Skeleton shimmer: static at `prefers-reduced-motion: reduce` (no pulse). Color-only signal of locked state.
- Card fade-out on dismiss: instant on reduce.
- Progress bar shimmer in cold-start: static on reduce.

### Color-only signaling — forbidden

- Category pills use color AND text label.
- No red pill means «bad pattern»; no green pill means «good pattern». Coach patterns are observational, not evaluative. Color coding is categorical only.

---

## 7. Mobile vs desktop variations

| Element | Desktop ≥1024 | Mobile ≤768 |
|---|---|---|
| Header | Full content + meta row | Stacked; meta row on second line, `text-xs` |
| Filter row | Inline chips + right-aligned counter | Horizontal scroll chips; counter below |
| Week anchor | Sticky on scroll (optional, can defer) | Non-sticky; inline divider |
| Pattern card | Max-width 720px centered, evidence block inline | Full-width, evidence block full-width below summary |
| Evidence list | Flat list with chevron link | Same; link text unchanged |
| Actions row | Right-aligned buttons | Left-aligned buttons; full-width separators |
| Locked card | Same layout, centered | Full-width; CTA button full-width at bottom |
| Cold-start empty state | Centered with max-width 560 | Full-width with 16px side padding |

**Mobile-specific concerns:**

- Touch targets: Dismiss + Snooze buttons must be ≥44×44 CSS pixels (iOS HIG). Desktop can compact to 32×32.
- Horizontal scroll of filter chips: no scroll-snap (too jarring); momentum scroll native.
- Coach tab on iOS bottom tab-bar (see `DASHBOARD_ARCHITECTURE.md` §4 iOS section).

---

## 8. Design tokens used

From `packages/design-tokens/tokens/semantic/{light,dark}.json`:

- `background.page`, `background.elevated`, `background.muted`
- `text.primary`, `text.secondary`, `text.muted`
- `border.subtle`, `border.default`, `border.strong`
- `accent.primary` (violet-700) — CTA and category-pill (Timing/Contrarian) outline
- `semantic.warning` (amber-600) — category-pill (Concentration) outline
- `semantic.info` (sky-600) — category-pill (Timing) outline
- `semantic.positive` (emerald-600) — category-pill (Dividends/Cost-averaging) outline

**No new tokens required for coach surface.**

---

## 9. Open questions for PO (via Navigator)

1. **Dedicated /coach route vs. insights-feed filter-chip.** Tech-lead's ADR recommends filter-chip; product-designer (this spec) recommends dedicated route. PO to adjudicate. If PO picks filter-chip, §1-§5 of this spec rework to fit inside Insights Feed; §3 cold-start gets harder (takes over entire feed for users with <30d history).
2. **Upgrade CTA destination:** full-page pricing vs. modal. Recommendation: full-page. See §5.
3. **Coach weekly cadence Sunday 00:00 UTC:** user-timezone aware or UTC global? Recommendation: UTC global for MVP (simpler; matches tech-lead Slice 8e plan); revisit post-alpha if user feedback says patterns «feel stale by Monday morning» in non-UTC markets.
4. **Snooze duration default:** 30 days vs 7 days. Recommendation: 30 days (matches pattern cadence — snoozing a weekly pattern for 7 days barely helps; 30 days gives the pattern time to evolve or clear). PO to confirm.
5. **Can Coach be dismissed category-wide?** User: «I don't want to see Concentration patterns anymore». Recommendation: yes, via settings → notifications → coach categories (matches Design Brief §16 notification overrides). Not MVP; post-alpha refinement.

---

## 10. Dependencies

- **Blocked on:** PO sign-off on §9.1 (route vs filter-chip). Tech-lead ADRs 1-5 already merged as recommendations. Frontend-engineer adding Coach to nav (per `DASHBOARD_ARCHITECTURE.md` §4).
- **Blocks:**
  - Slice 8c (coach web surface) implementation.
  - Onboarding flow spec (§3 Stage 3 depends on Coach first-pattern-read timing).
  - Design Brief v1.2 §14.6 (new subsection referencing this spec).

---

## 11. Verification checklist (before production ships)

Product-designer sign-off gates:

- [ ] All pattern narrative copy passes regex guardrail locally (tech-lead §2.6 Layer 2 test fixtures).
- [ ] Every pattern card has verb-led framing ("Memoro noticed…" not "Your brain noticed…").
- [ ] Locked card treats skeleton shimmer as decorative — screen-reader announces «Locked. Upgrade to Plus.» without relying on visual skeleton inference.
- [ ] Cold-start empty state correctly differentiates Path A (backfill in progress) vs Path B (true cold-start). Both tested with fixture data in Storybook / Chromatic equivalent.
- [ ] Filter chip keyboard nav: arrow keys move between chips, space/enter selects, escape clears.
- [ ] Reduced-motion removes all shimmer and fade animations; content still legible / functional.
- [ ] Contrast-check all chip categories with color tokens in both light + dark themes.
- [ ] Mobile tap targets 44×44 minimum on all interactive elements.
- [ ] Dismiss / Snooze mutations handle failure with visible toast (not silent).

---

## 12. Changelog

- v1.0 (2026-04-23) — initial spec. Delta from tech-lead ADR on surface location (dedicated route, not filter-chip) with rationale. Full anatomy + cold-start + teaser-paywall + accessibility.
