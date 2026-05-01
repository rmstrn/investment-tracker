# D1 «Lime Cabin» — Edge Case Spec

**Author:** frontend-engineer
**Date:** 2026-05-01
**Source:** Fix #6 of the 7-fix-pass for D1 lock canonicalisation
(see `.superpowers/brainstorm/2026-05-01-d1-fix-pass/KICKOFF.md`).

This spec covers the 5 edge-case categories the cross-functional review
flagged as unspecced (mobile / empty / error / stale / failure).

The mobile breakpoints below are **implemented** in `theme.css` for the
canonical preview. The empty / error / stale / failure states are
**spec only** — implementation lands when the corresponding features
ship (broker integration, real-data binding, chart-error boundary
adoption). The MD spec is the spec; the future implementation must
match this contract.

---

## 1. Mobile breakpoints (implemented in `theme.css`)

D1's pre-fix CSS had a single `@media (max-width: 1100px)` block that
collapsed everything to one column — too coarse. Post-fix the page has
explicit responsive behaviour at 768 / 414 / 375 px.

### 1.1 768px — tablet portrait + below (`@media (max-width: 768px)`)

- **Outer padding** drops from 24 → 16 px so the surface uses full
  viewport width.
- **Surface card** padding drops from 24 → 16 px, radius 28 → 24 px,
  inter-row gap 24 → 20 px.
- **3-col data grid** (`d1-grid`) collapses to single column.
- **AI insights panel reorders to FIRST** (CSS `order: -1`) — mobile
  reads top-down and the «what changed» summary leads, the deeper
  chart read follows.
- **3-KPI grid** collapses to 2-col with the **portfolio card spanning
  both columns** (`grid-column: 1 / -1`) — full-width hero retains the
  portfolio's role as the dominant figure.
- **Marketing strip** stacks single-column.
- **Hero headline** clamp tightens to 1.75rem-2.5rem (was 2.25-3.5rem).

### 1.2 414px — phone landscape / large phone portrait

- **KPI grid** collapses to single column.
- **KPI cards** padding 20 → 16 px, `min-height: auto`, internal gap
  14 → 10 px.
- **Portfolio numeral** clamp shifts to `clamp(36px, 10vw, 48px)` —
  still the dominant figure, but no longer dwarfs the surrounding
  cards on a small viewport.
- **Disclaimer chip label** is visually hidden (icon-only mode) but
  remains screen-reader accessible via `aria-label` and a clip-rect
  visually-hidden `.d1-disclaimer-chip__label`.
- **Filter chip row** becomes horizontally scrollable
  (`overflow-x: auto` + `flex-wrap: nowrap`), scrollbar hidden via
  `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`.

### 1.3 375px — iPhone SE / mini

- **Nav** collapses: only the active pill stays visible; the others
  hide via `display: none`. (A future `▾ More` overflow chip will
  surface them — out of scope for canonical preview; see TD-entry
  below.)
- **Eyebrow name** locks to 16px (the floor of the clamp).

### 1.4 TD entries (deferred implementation)

- **Mobile nav `▾ More` overflow chip** at `<375px` — reveals the
  hidden nav pills in a popover. Trigger: when nav grows past the 5
  items shown today (Holdings, Drift, Tax, Income, Goals, Reports,
  Connections, Settings — ~8-10 items realistic). Defer to first real
  mobile-nav feature.
- **Touch-target audit** at `<414px` — verify every interactive
  surface is ≥44×44pt. Defer to first mobile QA pass.

---

## 2. Empty portfolio state (spec only)

When the user has no broker connected and `portfolioValue === 0`:

### 2.1 KPI band

- **Portfolio value KPI** renders «$0» (still Geist Mono dominant
  numeral) + delta line «No accounts connected» in `text.muted`.
- **Lime KPI rule §7 falls through** — no card receives the lime
  treatment. The default precedence (drift > tax-lot > dividend
  event > portfolio value) has nothing to highlight; the page should
  read as «waiting» not «here is your alert».
- **Drift KPI** is replaced with a **«Connect a broker» neutral card**
  in the third slot — same 132px height, dark surface, lime
  Lucide-`plus` icon at 32px in the icon-chip slot, body «Connect a
  broker to see your positions». No lime fill on this card — lime
  fill is reserved for actionable observations, and an unconnected
  broker is not an observation.

### 2.2 Heatmap (Dividend calendar)

- All cells render as level-0 (`bg.page` colour).
- **Center caption** in the panel body: «No dividends in the last 6
  weeks» — Geist Sans 13px, `text.muted`, centered horizontally and
  vertically inside the panel body.
- The Record Rail above the panel still reads `▮ DIVIDEND CALENDAR
  ───`.

### 2.3 AI feed

- One Record Rail entry renders: `▮ ON THE RECORD ───` + body
  «Provedo surfaces patterns weekly. Connect a broker to start.»
- The filter input above stays — but `disabled` (`text.muted` on
  `bg.page`, no border highlight on focus) until at least one
  insight exists.

---

## 3. Error state — broker disconnected (spec only)

When a previously-connected broker fails sync:

### 3.1 Amber chip vocabulary

This is the ONLY surface allowed to render `--d1-notification-amber`
(`#F4C257`) at 100% saturation as a chip background. Everywhere else
amber is reserved for count badges (which have been removed from the
nav per Fix 1).

```
[ ⚠ MSFT · sync error ]
```

- **Chip placement:** above the affected KPI card (between the KPI
  band and the chip row), as a separate row with right-aligned
  «Reconnect» button.
- **Style:** 32px tall, `border-radius: 9999px`, `bg:
  var(--d1-notification-amber)`, `color: var(--d1-text-ink)`, Geist
  Sans 500 12px, padding `0 12px`, gap `6px`.
- **Icon:** Lucide `triangle-alert` at 14px in `--d1-text-ink` (NOT
  lime — lime is reserved for «look here», amber chip is its own
  semantic).
- **Tooltip on hover:** «Last successful sync: 2h ago. Retry to
  refresh positions.»

### 3.2 Affected KPI card overlay

The KPI card whose data is stale gets a thin amber hairline border
(`box-shadow: inset 0 0 0 1px var(--d1-notification-amber)`) — the
border is the only chrome change so the numeric content stays
readable. Numerals do NOT swap to amber (numerals stay in mono
`text.primary`).

---

## 4. Stale data (spec only)

When data is older than the freshness threshold (default: 1h for live
positions, 24h for dividend feeds):

### 4.1 Record Rail extension

The structural Record Rail above chart panels gains a `last-sync`
slot:

```
▮ ALLOCATION DRIFT · synced 2h ago ───────
```

- **Format:** section name + ` · ` + `synced Xh ago` (Geist Mono
  11px, same `text.muted` colour as the date stamp).
- The Record Rail component accepts a new optional `meta` prop:
  `<RecordRail label="ALLOCATION DRIFT" meta="synced 2h ago" />`.
- When `meta` is present, the rail's hairline shortens to leave
  visual room for the suffix.

### 4.2 KPI card stale indicator

The KPI card delta line gets a leading `↻` glyph + the staleness
hint: «↻ +12.4% MTD · synced 2h ago». The glyph is `currentColor`
(stays muted when the card is dark, stays ink when the card is
lime-filled).

---

## 5. Failure state — chart fails to render (spec only)

When a chart's `<Suspense>` boundary throws or its data fetch
rejects:

### 5.1 ChartError boundary

Each chart panel body is wrapped in a `<ChartError />` boundary that
already exists in `packages/ui/src/charts/_shared/`. The error
fallback renders inside the same panel chrome (no layout shift):

```
▮ ALLOCATION DRIFT · couldn't load ────────
  [retry button]
```

- **Rail meta:** `couldn't load` is the staleness equivalent for the
  failure case — same Record Rail meta slot, different copy.
- **Body:** centered message «Couldn't load this chart.» (Geist Sans
  14px, `text.primary`) + a small «Retry» chip below (the existing
  `.d1-chip` vocabulary, 36px tall, neutral fill).
- **No lime, no amber** — failure is observational, not alarming.
  Lime is reserved for «look here»; amber is reserved for sync
  errors (which the user can act on by reconnecting a broker).
  Failure to render a chart is a software issue the user can only
  retry.

### 5.2 Per-panel isolation

Each panel has its own boundary so one chart's failure does NOT take
down the dashboard. The KPI band and AI insights remain interactive.

---

## 6. Accessibility rules carried by this spec (Fix 7 documentation)

- **Avatar weight:** non-chat avatars (brand «P» monogram
  `.d1-nav__brand`, user avatar «R» `.d1-nav__avatar`) render at
  `font-weight: 700` for AAA on the purple fill. (Chat avatars are
  no longer present after the Fix 2 chat-row deletion.)
- **`:focus-visible` rings** are 2px solid `--d1-accent-lime` with
  2px outset on the truly interactive surfaces: `.d1-chip`,
  `.d1-segmented__btn`, `.d1-nav__icon-pill`, `.d1-pill`, `.d1-cta`.
- **`.d1-kpi` and `.d1-insight` are non-interactive containers** in
  the canonical preview (a11y/noNoninteractiveTabindex blocks
  `tabIndex={0}` on `<article>`). The PD spec calls for a focus
  ring around the AI-insight article — the ring rule lives commented
  in `theme.css` and should be re-enabled the moment a real
  expand/click affordance lands as a child `<button>` inside
  `.d1-insight` (`:focus-within` then activates correctly without
  forcing the article into the tab order).
- **Spec contrast claims** (corrected from the pre-fix CSS comment
  block):
  - `text.primary` on `bg.card` = **15.9:1** (was over-claimed as
    17.8:1 — still AAA, conservative correction).
  - `text.muted` on `bg.card` = **5.9:1** (was over-claimed as
    6.4:1 — still AA-large + AAA on body 16px+).
  - `text.ink` on `accent.lime` = **15.4:1** (was under-claimed as
    14.7:1 — actually better; bump up).
- **Reduced motion:** all transitions become instant via the
  `prefers-reduced-motion: reduce` block in `theme.css`. Default →
  hover / focus / active state changes still happen — only the
  transition timing is removed.

---

## 7. Out of scope for this spec

- Localisation of the Record Rail datestamp format. Per directive
  (target market 2026-05-01), product surface is EN-only US+EU until
  i18n phase. `MAY 01 · 09:14` is the only rail format; `synced 2h
  ago` is the only stale format.
- Currency-explicit suffix on KPI numerals (`$847,290 USD`) — defer
  to multi-currency phase.
- EU AI Act `[AI]` chip on AI-insight entries — legal-advisor flagged
  as deferable to EU-launch gate Aug 2026.
- Chat-row form factor — explicitly REPLACED by Record Rail per PD
  spec, no fallback supported.

---

**End of spec.**
