# Coach Surface Spec — Provedo

**Owner:** product-designer
**Status:** draft v2.0 — rewritten from dedicated-route model to contextual-icon + bell-hub model per PO lock 2026-04-23
**Date:** 2026-04-23
**Scope:** Coach as a contextual layer across existing surfaces. No dedicated `/coach` route, no primary nav tab. Coach is surfaced via (1) small dot indicators on the elements a pattern concerns and (2) a top-bar bell-dropdown hub listing all current patterns.
**Depends on:** `docs/04_DESIGN_BRIEF.md` v1.2→v1.3; `docs/design/DASHBOARD_ARCHITECTURE.md` v1.0→v1.1; `docs/CC_KICKOFF_option4_coach_adr.md` (tech-lead pattern-detection ADRs 1-5 unchanged); `docs/DECISIONS.md` entry 2026-04-23 «Trial + Free tier + Coach UX + brand commitment (4 locks)».

---

## 0. Delta from prior draft (v1.0)

v1.0 of this spec recommended a dedicated `/coach` route with its own primary nav tab. PO (2026-04-23) locked a **contextual Coach surface** instead — rejecting both the product-designer `/coach` route and the tech-lead filter-chip-inside-Insights proposals.

**What changed (UX):**

- No `/coach` route. No primary nav tab labelled «Coach».
- Coach patterns surface as **small dot indicators** on the elements the pattern concerns (position rows, dashboard widget headers, chat thread previews, insight cards, transaction rows).
- A **top-bar bell-dropdown** is the hub listing all current patterns — single discovery surface for users who want the full list.
- Teaser-paywall for Free tier is unchanged in shape (reveal subject, not substance) but delivered inside a **popover opened from the dot**, not a full-page locked card.
- Empty state is unchanged in shape but delivered inside the bell-dropdown, not a full-page surface.

**What did NOT change (backend + detection):**

- Tech-lead ADRs 1-5 stand: rule-based detection in Core API, narrative generation in AI Service, regex guardrail (Layer 2), soft 30-day-OR-30-tx gate, weekly cadence (Sunday 00:00 UTC).
- Pattern catalog stands: Concentration / Timing / Dividends / Cost-averaging / Contrarian-signal.
- Mutation contract stands: patterns reuse insights `dismiss` / `snooze` endpoints (Slice 6b pattern).
- Regulatory guardrail stands: every narrative passes the Lane A regex filter server-side; UI trusts validated output.

**Why PO rejected the dedicated route:**

- Route-primacy argument (product-designer v1.0) claimed Coach as a category-claim deserves a tab slot. PO preferred a design where Coach IS the AI-woven behaviour of the existing dashboard + positions, not a separate destination. Reinforces dashboard-primary architecture (Q3 2026-04-23 lock) and the «AI is the interface, not a feature» principle (§1 Design Brief).
- Filter-chip-inside-Insights (tech-lead ADR) buried the category. Contextual indicators promote the category to every surface where it's relevant, which is stronger than either route or filter.
- Mobile tab-bar is freed (4 tabs instead of 5+) — see `DASHBOARD_ARCHITECTURE.md` §4 updated spec.

**Trade-off PO accepted:**

- Discoverability risk: if indicators are too subtle, users miss patterns. Mitigated by (a) first-time-use micro-tooltip explaining the convention, (b) bell-dropdown as always-on-screen anchor, (c) onboarding tour highlights bell + explains dot convention once.
- Post-alpha A/B test: contextual vs hypothetical dedicated route. If engagement weak, revisit (per DECISIONS entry «Revisit: A/B test contextual vs dedicated route post-alpha if engagement weak»).

---

## 1. Attachment-point taxonomy

Coach patterns surface on five kinds of element. Each type owns a specific visual treatment and a specific click/tap behavior.

| # | Attachment type | When it appears | Example pattern |
|---|---|---|---|
| 1 | **Position row / position card** | Pattern concerns a specific symbol | Concentration flag on NVDA; Timing pattern on AAPL; Cost-averaging rhythm on VTI |
| 2 | **Dashboard widget header** | Pattern concerns the widget's scope | Concentration across allocation donut; Timing drawdown on portfolio chart; Activity pattern on recent-transactions widget |
| 3 | **Chat thread preview** (in chat list) + **chat thread head** (when open) | Pattern relates to the subject of an existing chat thread | User asked about NVDA → later Provedo notices NVDA concentration pattern |
| 4 | **Insight card** (in `/insights` feed or dashboard «Insight of the week») | A coach pattern is adjacent to an insight the user has seen | Concentration insight + concentration coach pattern on same position |
| 5 | **Transaction row** (in position detail transaction history) | Pattern cites that specific transaction as evidence | A sell-at-local-low timing pattern's evidence row |

**Design rule — one dot per element.** Even if multiple patterns concern the same element (e.g., NVDA has both Concentration and Timing patterns open), the row shows a single dot. Dot click opens popover that lists all patterns for that element, grouped by category.

**Design rule — no cascade.** A pattern that concerns NVDA does NOT also indicate on the portfolio chart widget (even though portfolio chart includes NVDA). Indicators are attached to the most-specific matching element only. Widget-level indicators are reserved for patterns whose evidence crosses multiple symbols (e.g., an allocation-level concentration pattern).

**Design rule — no backdoor indicators.** Top-bar logo, side nav items, footer, or settings icons never receive dots. The bell is the only chrome-level surface that aggregates; everything else is surface-scoped.

---

## 2. Icon treatment — the dot

This is the load-bearing primitive. It must be:

- **Recognizably Provedo-signal** (users learn «dot means Provedo noticed something»).
- **Calm** (compliant with Design Brief v1.2 §0 anti-pattern list — NO sparkle, NO gradient halo, NO brain-glow).
- **Categorical, not evaluative** (never red-for-bad / green-for-good — Coach patterns are observational).
- **Discoverable without being noisy** (see §3 for the motion spec).

### 2.1 Visual anatomy

```
┌───────────────────────┐
│ NVDA    ● · Timing   │   ← position row with dot
│ $14,202   +$120       │
└───────────────────────┘
```

- **Shape:** filled circle, 6px diameter at default size, 8px on touch-optimized (mobile / iOS tap targets).
- **Position:** top-right of the element, 8px inset from the right edge, vertically centered to the element's primary label. For position rows: after the symbol name. For widget headers: far-right of the header baseline. For chat threads: to the right of the thread timestamp.
- **Color:** category-colored using existing semantic tokens (NO new tokens needed — see §8):
  - Concentration → `semantic.warning` (amber-600)
  - Timing → `semantic.info` (sky-600)
  - Dividends → `semantic.positive` (emerald-600)
  - Cost-averaging → `semantic.positive` (emerald-600)
  - Contrarian-signal → `semantic.info` (sky-600)
- **Multi-category on same element:** if the element has patterns from more than one category, the dot uses `accent.primary` (violet-700) as a «multiple» signal. Popover (§4) lists categories individually.
- **Border / halo:** none. No ring, no outer glow. A halo reads as sparkle.
- **Pairing with label:** on elements with enough horizontal space (dashboard widget headers, position detail headers), append `· [Category]` text after the dot in `text-xs` `text.muted`. This gives pre-click semantic information. On space-constrained elements (position rows in tables, chat thread previews), dot alone.

### 2.2 Reduced-motion variant

- Dot is static. No pulse.
- Nothing else changes — color, size, position remain identical.

### 2.3 Forbidden patterns (re-assert §0 Design Brief)

- No sparkle glyph instead of a dot.
- No gradient fill. Solid color only.
- No outer glow, halo, drop-shadow with color.
- No brain icon next to the dot.
- No animated rotation. No particle effects.
- No «AI-active» chrome in the row background (e.g., tinted-violet row background). Row stays default.

---

## 3. Icon interaction — pulse, states, tooltip

### 3.1 Motion — the pulse

When a new coach pattern attaches to an element, the dot pulses subtly for a bounded period to aid discovery, then goes static.

**Pulse spec:**

- **Animation:** scale 1.0 → 1.15 → 1.0 over 1200ms, linear-ish ease (`easing-inout` from Design Brief §8).
- **Cadence:** every 2500ms (not continuous — a breath, not a strobe).
- **Duration:** pulse runs for up to **5 minutes** of active-page time, OR until user hovers/taps the dot, whichever comes first. After that, dot is static until dismissed/snoozed or the pattern ages out.
- **Cross-session persistence:** pulse state is session-local (resets on page reload). If a pattern is still unread after 7 days of user's active sessions, pulse does NOT re-start. Bell-count remains the authoritative «unread» signal.
- **Reduced motion:** pulse disabled entirely. Dot is static.
- **Multiple dots pulsing simultaneously:** allowed but capped at 3 concurrently visible. If more than 3 unread patterns are on-screen, only the top 3 in DOM order pulse; others are static. (Prevents a wall-of-strobes effect.)

**Why this motion spec:**

- Subtle — complies with Design Brief «calm over busy» principle.
- Bounded — does not create persistent visual noise for the user who hasn't engaged.
- Resettable via user action — hover/tap stops the pulse, which gives users agency over the affordance.
- Not AI-sparkle — scale-pulse is a recognized interaction motion, not a decorative AI-aesthetic motif.

### 3.2 Hover state (desktop)

- Cursor: pointer.
- Dot expands: 6px → 8px (scale 1.33) over 120ms.
- **Inline micro-tooltip** appears below (or above if near viewport bottom) the dot:

```
┌─────────────────────────────────┐
│ Provedo noticed a Timing pattern │
│ Click to read                   │
└─────────────────────────────────┘
```

  - Copy template: «Provedo noticed a [Category] pattern» + «Click to read» (Free: «Upgrade to Plus to read»; see §5).
  - Style: `text-xs` `text.primary` on `background.elevated`, `border.subtle`, `radius-md`, `shadow-md`, 8px padding.
  - Delay: 300ms before show (prevents flicker on quick mouse-overs).
  - Hide: on mouseout with 150ms delay (prevents flicker).

### 3.3 Focus state (keyboard)

- Dot is a focusable element (`<button>` wrapper with `aria-label="Provedo noticed a [Category] pattern on [element name]. Press Enter to read."`).
- Focus ring: 2px `violet-700` with 2px `background.page` offset — matches Design Brief §12.2.
- Enter or Space: opens popover (§4). Same as click.
- Escape while popover open: closes popover, returns focus to dot.

### 3.4 Active / pressed

- Dot scale 0.92 for 100ms on mousedown/touchstart. Feedback is tactile, not decorative.

### 3.5 First-time-use tooltip (onboarding aid)

First time a user encounters a pulsing dot on any surface, a one-time **coach tutorial tooltip** attaches to the first dot:

```
┌──────────────────────────────────────────┐
│ Provedo noticed a pattern                 │
│                                          │
│ When you see a dot like this, Provedo     │
│ has read your trades and noticed         │
│ something worth sharing. Click to see.   │
│                                          │
│ All patterns also live in the bell (↑).  │
│                                          │
│                           [ Got it ]     │
└──────────────────────────────────────────┘
```

- Shows ONCE per user, ever. Persists via user-pref flag (`coach_tutorial_seen`, per-user-account).
- Copy mentions the bell as a secondary anchor («All patterns also live in the bell»).
- Dismiss via `Got it` button OR clicking outside. Dismissal marks the flag.
- On mobile: same shape, positioned to not overflow viewport.
- If user's first encounter is the bell-dropdown (not a dot on a surface), the tutorial tooltip fires from the first dot instead — bell-dropdown has its own in-dropdown onboarding line (§7.5).

### 3.6 Popover — the click destination

Clicking / tapping / activating a dot opens a **teaser popover** anchored to the dot. NOT a full modal. See §4.

---

## 4. Popover — pattern teaser / detail view

The popover is the read-surface for a single attachment point. Different content shapes per tier.

### 4.1 Plus / Pro — full detail popover

```
┌──────────────────────────────────────────────────┐
│ [Timing]  ·  Read: 2 days ago             [×]   │
│                                                  │
│ Provedo noticed a sell-at-local-low pattern       │
│ in your AAPL trades                              │
│                                                  │
│ You sold AAPL on three dates in the last 90 days │
│ each within 2% of a local low. Each time, AAPL   │
│ recovered within 30 days. Provedo noticed this    │
│ is a pattern — no judgment on whether it was     │
│ the right call.                                  │
│                                                  │
│ ┌────────────────────────────────────────────┐   │
│ │ Evidence                                   │   │
│ │   · Sold 12 AAPL on 2026-02-15 at $158.22 │   │
│ │   · Sold 18 AAPL on 2026-02-22 at $155.40 │   │
│ │   · Sold  8 AAPL on 2026-03-05 at $162.11 │   │
│ │ View transactions ▸                        │   │
│ └────────────────────────────────────────────┘   │
│                                                  │
│ Dismiss  ·  Snooze 30 days                       │
└──────────────────────────────────────────────────┘
```

**Anatomy (by element — elements carry the same visual language as v1.0 `CoachPatternCard`, but as popover content):**

- **Category pill + read date** — `text-xs` Medium; same color-by-category rules as §2.1.
- **Close button** — top-right `×`; closes popover, dot goes static (pulse already over by this point anyway).
- **Headline** — `text-base` Medium (smaller than v1.0 card; popover is compact). One line verb-led. «Provedo noticed [pattern] in your [context]».
- **Summary** — `text-sm` Regular, `text.secondary`. 2-4 lines. Closes with observational-framing language.
- **Evidence block** — same as v1.0 `CoachPatternCard` §2. Bordered sub-panel, `Geist Mono` for qty / price. «View transactions» link routes to `/positions/[symbol]?tx=[ids]`.
- **Actions row** — `Dismiss` + `Snooze 30 days`. Reuses Slice 6b mutation contract.

**Sizing:**

- Desktop: max-width 480px; positioned below the dot with 8px offset; auto-flip to above if viewport bottom within 100px.
- Mobile: bottom sheet takeover instead of popover. Swipe-down or `×` to close. Full-width, radius-lg top corners.

**Opening animation:**

- Desktop: scale 0.98 → 1.0 + opacity 0 → 1 over 150ms. Reduced-motion: instant.
- Mobile: sheet slide-up over 200ms. Reduced-motion: instant.

### 4.2 Free tier — teaser popover

```
┌──────────────────────────────────────────────────┐
│ [Timing]  ·  Locked preview              [×]    │
│                                                  │
│ Provedo noticed a pattern in your NVDA trades     │
│                                                  │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░           │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░           │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                │
│                                                  │
│ ┌────────────────────────────────────────────┐   │
│ │ Evidence [locked]                          │   │
│ │ ░░░░░░░░░░░░░░░░░░░░░░░░░                  │   │
│ │ ░░░░░░░░░░░░░░░░░░░░░░░░░                  │   │
│ └────────────────────────────────────────────┘   │
│                                                  │
│ Plus unlocks full pattern reads.                 │
│ [ Upgrade to Plus ▸ ]                            │
└──────────────────────────────────────────────────┘
```

**What's shown (subject):**

- **Category pill** — the pattern domain (Timing, Concentration, Dividends, Cost-averaging, Contrarian-signal).
- **Subject-specific headline** — specific to what the pattern is about, but not substance. Templates:
  - Per-symbol patterns: «Provedo noticed a pattern in your [SYMBOL] trades»
  - Widget-level patterns: «Provedo noticed a [Category] pattern this week»
  - Chat-thread patterns: «Provedo noticed a pattern related to [thread subject]»
- **Skeleton shimmer bars** — standing in for the summary body. Uses existing `Skeleton` primitive (Design Brief §10.1) at `background.muted` on `background.elevated`. NOT filled with text.
- **Evidence block — locked** — header «Evidence» + small `lock` icon (Lucide, 14px, `text.muted`); body as skeleton shimmer.
- **CTA** — «Upgrade to Plus» primary button + one-line honest value explanation.

**What's NOT shown (substance):**

- No specific pattern name (withhold «sell-at-local-low»; show category «Timing»).
- No dates, price points, transaction details.
- No «# patterns locked this week» — avoids scarcity framing.
- No countdown, no urgency language.

**Design Brief §13.3 «Never» list enforced.** Copy is honest about value, not guilt-trip.

**Upgrade CTA destination:**

- Routes to `/pricing?source=coach&pattern=[category]&attachment=[type]` for analytics. Full pricing page, not modal — matches Design Brief §13.2 «page lock» for Pro/Plus upgrades.
- Product-designer does not own URL/analytics scheme. Hand to frontend-engineer via Navigator.

### 4.3 Dismiss / Snooze behavior

- **Dismiss:** pattern removed permanently for this user. Dot disappears. Bell-count decrements. No undo.
- **Snooze 30 days:** pattern hidden; dot disappears; bell-count decrements. If pattern still holds 30 days later, re-fires with fresh dot + pulse.
- **Mutation contract:** reuses insights `dismiss` / `snooze` endpoints per tech-lead ADR + Slice 6b pattern. No new backend required.
- **Loading / error states:** inherited from Slice 6b implementation (in-flight spinner on button; toast on failure; card stays until resolved).

### 4.4 Popover dismissal

- `×` close button.
- Click outside popover.
- `Escape` key.
- On close, focus returns to the originating dot.
- Dismissal does NOT mark pattern as read — only `Dismiss` action marks it read. User can open the popover repeatedly.

---

## 5. Free-tier paywall treatment — summary

Free tier Coach experience:

- Dots appear on attachment points as normal. Category color shows.
- Hover tooltip: «Provedo noticed a [Category] pattern — upgrade to Plus to read».
- Click → teaser popover (§4.2). Subject revealed, substance locked.
- Bell-dropdown lists all current patterns with locked state indicator (§7.3).
- `Dismiss` available on Free locked patterns (user can hide a pattern they don't want to see even if they can't read it — agency over visual noise).
- `Snooze` available on Free locked patterns (same rationale).
- **No cold-start empty state on a dedicated surface** — contextual model has no surface to show empty. Bell-dropdown empty copy handles this (§7.3 Path A/B).

Free-to-Plus conversion signals:

- CTA in popover.
- CTA in bell-dropdown footer («Upgrade to Plus for full pattern reads»).
- Contextual dashboard banner after week 2 if ≥3 locked patterns unread (honest, not pushy — «Provedo has noticed 3 patterns this month. Upgrade to Plus to see them»).

**No dark patterns.** No countdown, no scarcity, no «expires soon». Never. (§13.3 Design Brief.)

---

## 6. Empty states

Coach is contextual — there is no dedicated surface to be «empty». The empty state lives inside the bell-dropdown.

### 6.1 Path A — warm-start pending (backfill running)

Bell-dropdown empty copy:

```
┌────────────────────────────────────────┐
│ Provedo is reading your trade history   │
│                                        │
│ First patterns land in a few minutes.  │
│ You'll see a dot here when they do.    │
│                                        │
│ [ Progress bar indeterminate ]         │
└────────────────────────────────────────┘
```

- Bell icon still visible (unread count = 0; no badge).
- No dots anywhere on surfaces during this window.
- When first pattern lands: bell-count increments to 1 + bell pulses once (same spec as dot pulse, §3.1) + dot appears on corresponding attachment point + dashboard banner (see `ONBOARDING_FLOW.md` §4.2).

### 6.2 Path B — cold-start (no history)

Bell-dropdown empty copy:

```
┌────────────────────────────────────────┐
│ Provedo is learning your portfolio      │
│                                        │
│ Coach reads your trade history to spot │
│ patterns. You'll need about 30 days    │
│ of trading for the first read.         │
│                                        │
│ Progress: ████░░░░░░░░░░ 8 / 30 days  │
│                                        │
│ In the meantime, Provedo is watching    │
│ your Dashboard and Insights for you.   │
└────────────────────────────────────────┘
```

- Bell icon visible; unread count = 0.
- No dots on surfaces.
- Progress counter updates daily. If Path A pattern fires mid-Path-B (e.g., user connects a second broker with history), auto-promotes to populated state.
- Counter is day-count OR transaction-count — whichever is closer to threshold for this user. Uses same soft-gate logic as tech-lead ADR 5.
- **Never frame as lock or gate.** «Provedo is learning» is honest and does not blame the user.

### 6.3 Post-gate — no patterns this week (all patterns dismissed or none generated)

Bell-dropdown empty copy:

```
┌────────────────────────────────────────┐
│ You're all caught up                   │
│                                        │
│ Provedo read your trades this week and  │
│ didn't flag anything new. Check back   │
│ Sunday for the next read.              │
└────────────────────────────────────────┘
```

- Bell icon visible; unread count = 0 (no badge).
- Tone: quiet, not apologetic. «Didn't flag» is honest — no patterns is a valid outcome.

---

## 7. Bell-dropdown hub — full spec

The top-bar bell is the always-on-screen aggregation surface for all «Provedo noticed» notifications, including Coach patterns. This extends the existing `BellDropdown` primitive (Design Brief §10.3, §16.2).

### 7.1 Bell icon in top bar

- Lucide `bell` icon, 20px, `text.primary` at rest.
- Positioned in top-bar right group, left of `PlanBadge`. See `DASHBOARD_ARCHITECTURE.md` §7 updated.
- **Unread count badge:** small circle overlay top-right of bell, `semantic.info` fill (sky-600), `text.onAccent` text, `text-xs` Semibold. Shows count 1-9, `9+` for 10+. Existing primitive behavior (§16.2 Design Brief).
- **Unread coach-pattern differentiator:** when at least one unread item in the dropdown is a coach pattern, bell icon gains a subtle 1px `accent.primary` (violet-700) ring at the icon's outer radius. Differentiates coach-present from «just product notifications». Disappears when all coach patterns read.
- **Bell pulse:** first time a new coach pattern lands in a session, bell pulses ONCE using the same dot-pulse spec (§3.1). Subsequent patterns in the same session: badge count increments silently. User-agency principle — one attention-grab per session, not per pattern.
- **Keyboard shortcut:** `Cmd/Ctrl+B` opens the bell-dropdown. Hint shown in tooltip on bell hover.

### 7.2 Dropdown structure — Plus / Pro

```
┌──────────────────────────────────────────────┐
│ Notifications                                │
│                                              │
│ COACH · This week                            │
│ ┌──────────────────────────────────────┐     │
│ │ [Timing]   NVDA — sell-at-local-low  │     │
│ │ 2 days ago                  View ▸   │     │
│ └──────────────────────────────────────┘     │
│ ┌──────────────────────────────────────┐     │
│ │ [Concentration]  Portfolio            │     │
│ │ 3 days ago                  View ▸   │     │
│ └──────────────────────────────────────┘     │
│                                              │
│ COACH · Earlier                              │
│ ┌──────────────────────────────────────┐     │
│ │ [Dividends]   VTI — quarterly rhythm │     │
│ │ 11 days ago                 View ▸   │     │
│ └──────────────────────────────────────┘     │
│                                              │
│ OTHER NOTIFICATIONS                          │
│ ┌──────────────────────────────────────┐     │
│ │ Weekly digest ready                   │     │
│ │ 1 day ago                   View ▸   │     │
│ └──────────────────────────────────────┘     │
│                                              │
│ Mark all read · Notification settings        │
└──────────────────────────────────────────────┘
```

**Structure:**

- Header: «Notifications» (`text-sm` Medium, `text.secondary`).
- Section groups:
  - **Coach · This week** — patterns from the current weekly cycle (Sunday 00:00 UTC – Sat 23:59 UTC).
  - **Coach · Earlier** — patterns from older cycles, not yet read / dismissed.
  - **Other notifications** — non-coach types (digest emails, price alerts, billing, etc.).
- Each coach-pattern row:
  - Category pill (same color rules as §2.1).
  - Subject identifier (symbol for per-symbol patterns; «Portfolio» for widget-level; thread title for chat-thread patterns).
  - Pattern-name teaser (only for Plus/Pro) or generic «a pattern this week» (for Free — see §7.3).
  - Timestamp relative («2 days ago»).
  - `View` link — clicking opens the same popover as clicking the dot (§4). Focus management: popover opens anchored to the row, not to a dot elsewhere.
- Footer: «Mark all read» (clears coach section unread; does NOT dismiss patterns — just marks them read in the notification hub) + «Notification settings» link to `/settings/notifications`.

**Grouping choice rationale:**

- Chronological within «This week» (most recent first) — users skim for newness.
- «Earlier» is collapsed by default if >3 items (click to expand). Prevents wall-of-rows.
- Coach grouped separately from other notification types because coach reading is a different task (pattern reading) from consuming digest emails or billing alerts. Grouping reduces cognitive switching.

### 7.3 Dropdown structure — Free tier

Identical structure to Plus/Pro but with row teaser-only content:

```
┌──────────────────────────────────────────────┐
│ Notifications                                │
│                                              │
│ COACH · This week                            │
│ ┌──────────────────────────────────────┐     │
│ │ [Timing]   NVDA — 🔒 Locked preview  │     │
│ │ 2 days ago                Unlock ▸   │     │
│ └──────────────────────────────────────┘     │
│ ┌──────────────────────────────────────┐     │
│ │ [Concentration]  Portfolio — 🔒      │     │
│ │ 3 days ago                Unlock ▸   │     │
│ └──────────────────────────────────────┘     │
│                                              │
│ Upgrade to Plus for full pattern reads ▸     │
│                                              │
│ ...                                          │
└──────────────────────────────────────────────┘
```

- Lock icon + «Locked preview» indicator after the subject.
- `Unlock ▸` link per row — routes to `/pricing?source=coach&pattern=[category]&attachment=[type]&entry=bell` (analytics tracks entry point).
- Footer CTA: «Upgrade to Plus for full pattern reads ▸» — single, honest, non-scarcity.
- `Mark all read` still works for Free users (they can mute the bell count without unlocking).
- If zero unread patterns and zero older (brand-new Free user): empty-state copy per §6.

### 7.4 Sizing / positioning

- Desktop: dropdown anchored to bell, 380px wide, max-height 60vh with internal scroll. Positioned below bell with 8px offset. Auto-flip if viewport bottom within 200px (rare — bell is in top bar).
- Mobile: bottom sheet takeover. Full-width, radius-lg top corners. Swipe-down or `×` to close.

### 7.5 First-time-bell tooltip

If user opens bell-dropdown before ever clicking a surface dot, the first open shows a one-time coach explainer at the top of the dropdown:

```
┌──────────────────────────────────────────────┐
│ ℹ This is Provedo's read-list.                │
│   When Provedo notices a pattern in your      │
│   trades, it shows up here and with a dot    │
│   on the affected element.                   │
│                              [ Got it ]      │
└──────────────────────────────────────────────┘
```

Same persistence flag as §3.5 (`coach_tutorial_seen`) — tutorial fires from whichever surface the user encounters first (dot OR bell), then is suppressed on the other surface.

### 7.6 Accessibility (bell-dropdown)

- `<button aria-label="Notifications — N unread" aria-haspopup="menu" aria-expanded="false">` for the bell button.
- Dropdown: `role="menu"` (existing BellDropdown primitive semantics — see Design Brief §10.3 TD-005 note; minimal arrow-nav is current tech-debt).
- Coach rows: `role="menuitem"` with `aria-label="Coach pattern: Timing on NVDA, 2 days ago. Click to read."` (Plus/Pro) or `aria-label="Coach pattern: Timing on NVDA, locked preview. Click to unlock with Plus."` (Free).
- Keyboard: Tab into bell → Enter opens dropdown → Tab walks through rows → Enter opens popover anchored to that row → Escape closes popover back to bell → Escape again closes dropdown back to top bar.
- Keyboard shortcut: `Cmd/Ctrl+B` toggles dropdown from anywhere in the app.
- Reduced motion: dropdown opens instantly (no scale/opacity animation).

---

## 8. Paid-tier indicator

Plus/Pro difference from Free:

- **Dot** — identical visual. No «Plus-only» ring or styling. Tier is not signalled visually on the attachment-point dot.
- **Popover** — Plus/Pro sees full detail (§4.1); Free sees teaser (§4.2).
- **Bell-dropdown rows** — Plus/Pro sees pattern-name teaser; Free sees locked-row state.
- **Dismiss / Snooze** — available to all tiers.

**Design rule: no visible tier-status on the indicator itself.** Users should not feel watched-by-tier on the chrome. Tier difference manifests at the read-level (what content is shown) not at the discovery-level (whether the dot exists).

---

## 9. Accessibility

### 9.1 Screen reader — dots

- Dot is wrapped in `<button aria-label="Provedo noticed a [Category] pattern on [element name]. Press Enter to read.">`.
- Multi-category dot: `aria-label="Provedo noticed [N] patterns on [element name]. Press Enter to read."`.
- Decorative pulse is not announced (`aria-hidden` on the animation layer).
- **Verb-led framing enforced:** «Provedo noticed a pattern» — never «your brain noticed». See Design Brief §0.2.

### 9.2 Screen reader — popover

- Popover opens as `<dialog role="dialog" aria-modal="true" aria-labelledby="popover-headline-[id]">`.
- Focus moves to popover close button on open.
- Headline is `<h3 id="popover-headline-[id]">`.
- Category pill: `<span aria-label="Category: Timing">Timing</span>`.
- Evidence block: `<section aria-label="Evidence">` with `<ul>` of transactions. Each transaction line announces qty, symbol, date, price via monospaced tabular-nums content.
- Dismiss / Snooze: `aria-label="Dismiss pattern: [headline]"` / `aria-label="Snooze pattern for 30 days: [headline]"`.
- Locked popover: `aria-label` on dialog adds «Locked preview. Upgrade to Plus to read.».

### 9.3 Screen reader — bell-dropdown

- Bell: `<button aria-label="Notifications — [N] unread" aria-haspopup="menu" aria-expanded="[bool]">`.
- Coach section header: `role="presentation"` text + grouped rows have common `aria-labelledby`.
- Each row: `role="menuitem"`. See §7.6 label templates.
- `Mark all read`: announces count affected via toast on activation.

### 9.4 Keyboard flow (end-to-end)

- **From dashboard:** Tab to bell → Enter → dropdown open → Tab to first coach row → Enter → popover open → Tab to Dismiss / Snooze → Enter to activate → mutation → focus returns to row.
- **From attachment surface:** Tab to dot (within position row, widget, etc.) → Enter → popover open → same flow.
- **Global:** `Cmd/Ctrl+B` toggles bell-dropdown from anywhere.
- Escape closes popover (focus → dot OR row); Escape again closes dropdown if open.

### 9.5 Contrast

- Dot color on white surface: Concentration (amber-600 = #d97706) hits 4.76:1; Timing (sky-600 = #0284c7) hits 4.62:1; Dividends/Cost-averaging (emerald-600 = #059669) hits 4.54:1. All meet AA non-text 3:1 and large-text 4.5:1 thresholds.
- Dot color on dark surface: use the dark-mode semantic tokens (sky-400, emerald-400, amber-400) — already audited in Design Brief §3.3 for 4.5:1 on `background.elevated` dark.
- Popover text, evidence numbers, button labels: 4.5:1 minimum on card surface.
- Skeleton shimmer (locked state): intentionally low contrast — signal is «not readable». Not a WCAG violation because underlying locked state has text alternative via `aria-label`.
- **Color-only signaling forbidden.** Every dot pairs with category text in hover tooltip / popover / bell-dropdown row. Users who cannot distinguish amber-vs-sky-vs-emerald get the category name in text.

### 9.6 Reduced motion

- Dot pulse: disabled (§3.1 reduced-motion spec).
- Bell first-session pulse: disabled.
- Popover open / close: instant (no scale/opacity transition).
- Dropdown open / close: instant.
- Skeleton shimmer in locked states: static color (no animated shimmer).
- Banner slide-in on first-value: instant.

---

## 10. Mobile vs desktop variations

| Element | Desktop ≥1024 | Mobile ≤768 |
|---|---|---|
| Dot size | 6px diameter | 8px diameter (touch optimized) |
| Dot position | Inline-right of element label, 8px inset | Same, but absolute-positioned to avoid table cell truncation on narrow rows |
| Hover tooltip | Shown on mouseover | Not shown (touch devices have no hover); tap opens popover directly |
| Popover | Anchored below/above dot, max 480px wide | Bottom sheet takeover, full-width |
| First-time tooltip | Anchored popover style | Full-width card positioned to not overflow |
| Bell position | Top-bar right group | Top-bar right group (or in hamburger menu if <640) |
| Bell-dropdown | Anchored dropdown 380px, max 60vh | Bottom sheet takeover, full-width |
| Keyboard shortcut | `Cmd/Ctrl+B` visible hint on hover | N/A (no hardware keyboard assumed) |

**Mobile-specific concerns:**

- Touch targets: dot alone is 8px — below the 44x44 HIG minimum. Solved by making the entire row (position row, widget header, chat thread, etc.) tappable when it carries a dot; tap triggers popover. The dot itself is a visual anchor, not the sole tap target. Users can tap anywhere on the row.
- iOS tab-bar: see `DASHBOARD_ARCHITECTURE.md` §4 updated — bell lives in top-bar, not tab-bar. 4 tabs remain (Dashboard / Insights / Chat / Settings).
- Android: same as iOS principle.

---

## 11. Design tokens used

From `packages/design-tokens/tokens/semantic/{light,dark}.json`:

- `background.page`, `background.elevated`, `background.muted`
- `text.primary`, `text.secondary`, `text.muted`, `text.onAccent`
- `border.subtle`, `border.default`, `border.strong`
- `accent.primary` (violet-700) — CTA + bell coach-unread ring + multi-category dot
- `semantic.warning` (amber-600) — Concentration dot
- `semantic.info` (sky-600) — Timing / Contrarian-signal dot
- `semantic.positive` (emerald-600) — Dividends / Cost-averaging dot
- Dark-mode dots use `semantic.*` dark values (amber-400 / sky-400 / emerald-400).

**No new tokens required for contextual coach surface.**

---

## 12. Interaction states reference

Consolidated state matrix for the dot + popover + bell primitives.

### Dot

- **Default (unread, recent):** colored, 6px, pulse on (or static if `prefers-reduced-motion: reduce`).
- **Default (unread, ≥5min of active-page-time):** colored, 6px, static (pulse timed out).
- **Hover (desktop):** colored, 8px (scale 1.33), micro-tooltip visible.
- **Focus (keyboard):** colored, focus ring 2px violet-700 + 2px offset.
- **Active / pressed:** scale 0.92, 100ms.
- **Read (popover closed after view):** colored, 6px, static.
- **Dismissed:** gone.
- **Snoozed:** gone (returns in 30 days if pattern still holds).

### Popover

- **Opening:** scale 0.98→1.0 + opacity 0→1 over 150ms. Reduced-motion: instant.
- **Open (Plus/Pro):** full detail per §4.1.
- **Open (Free):** teaser per §4.2.
- **Mutation in flight:** button spinner + disabled.
- **Mutation error:** card stays visible + toast.
- **Closing:** opacity 1→0 over 100ms.

### Bell

- **Default (no unread):** bell icon, no badge, no ring.
- **Unread (non-coach only):** bell + count badge (sky-600 fill).
- **Unread (contains coach):** bell + count badge + violet-700 outer ring.
- **First coach of session:** one pulse (same spec as dot pulse) then settles to default-unread state.
- **Open:** bell icon state unchanged; dropdown open below.
- **Keyboard shortcut triggered:** same as click.

### Bell-dropdown

- **Plus/Pro with coach patterns:** §7.2 structure.
- **Free with coach patterns:** §7.3 structure.
- **Empty Path A (backfill in progress):** §6.1 copy.
- **Empty Path B (cold-start):** §6.2 copy + day/tx counter.
- **Empty post-gate (all read / none this week):** §6.3 copy.

---

## 13. Content-lead coordination

Copy hooks needed. Product-designer owns shape; content-lead owns wording variants.

| Location | Purpose | Current draft (content-lead to finalize) |
|---|---|---|
| Dot hover micro-tooltip (Plus/Pro) | One-liner discovery | «Provedo noticed a [Category] pattern» + «Click to read» |
| Dot hover micro-tooltip (Free) | Discovery + upgrade | «Provedo noticed a [Category] pattern — upgrade to Plus to read» |
| First-time dot tooltip | Tutorial | §3.5 draft copy |
| First-time bell tooltip | Tutorial (alt path) | §7.5 draft copy |
| Popover headline (Plus/Pro, per-symbol) | Observational, verb-led | «Provedo noticed a [pattern-name] pattern in your [SYMBOL] trades» |
| Popover headline (Plus/Pro, widget-level) | Observational | «Provedo noticed a [Category] pattern this week» |
| Popover summary (all patterns) | Observational + «no judgment» closer | AI-Service-generated narrative, passes Lane A regex guardrail, closes with observational-framing language |
| Popover teaser headline (Free, per-symbol) | Subject only | «Provedo noticed a pattern in your [SYMBOL] trades» |
| Popover teaser headline (Free, widget-level) | Subject only | «Provedo noticed a [Category] pattern this week» |
| Popover teaser value proposition (Free) | Upgrade framing | «Plus unlocks full pattern reads.» |
| Bell-dropdown section headers | Grouping | «Coach · This week» / «Coach · Earlier» / «Other notifications» |
| Bell-dropdown empty (Path A) | Warm-start | §6.1 copy |
| Bell-dropdown empty (Path B) | Cold-start | §6.2 copy — «Provedo is learning your portfolio» |
| Bell-dropdown empty (post-gate, no patterns) | Quiet state | §6.3 copy — «You're all caught up» |
| Bell-dropdown Free footer CTA | Upgrade | «Upgrade to Plus for full pattern reads ▸» |
| Dashboard banner (Free, ≥3 unread patterns) | Conversion nudge | «Provedo has noticed N patterns this month. Upgrade to Plus to see them.» |

Navigator mediates content-lead review.

---

## 14. Legal-advisor coordination

Per positioning lock 2026-04-23 Q6 (EU/UK MiFID II + FCA in-context disclaimer format), the in-context AI disclaimer remains open.

**Product-designer recommendation (unchanged from v1.0):**

- **In-copy observational closer** on every popover summary — «Provedo noticed this is a pattern — no judgment» / «patterns only» / equivalent verb-led Lane-A-safe framing. This is AI-Service-generated narrative, passes Layer 2 regex guardrail.
- **One-time first-interaction modal** on first dot-click (separate from the §3.5 tutorial tooltip — this one is the disclaimer specifically): «Provedo shows patterns based on your trade history, not advice. This is educational, not investment guidance. [Acknowledge]». Once acknowledged, never shown again (persisted flag `coach_disclaimer_acknowledged`).

Legal-advisor to confirm:

1. Does the in-copy observational closer plus first-interaction modal satisfy EU/UK requirement, OR is an explicit `Disclaimer` component mandatory on every popover?
2. If explicit `Disclaimer` component required, product-designer proposes a small footer strip in the popover (`text-xs`, `text.muted`, single line) with a link to full disclaimer in legal page.

Tracked as open question §17.

---

## 15. Dependencies

- **Blocked on:**
  - Legal-advisor confirmation on §14 disclaimer format.
  - Content-lead finalization of §13 copy hooks.
  - Tech-lead confirmation that pattern-read metadata includes attachment-point type + target identifier (symbol, widget, thread-id, etc.) so the client can route a pattern to the correct dot. (Requires payload extension in insights API; coordinate via Navigator.)
  - Frontend-engineer buy-in for dot primitive + popover + bell-dropdown extension. Sizing impact: no new slice required beyond Slice 8c — changes scope from «dedicated /coach page» to «contextual dot primitive + popover + bell-dropdown coach section». LOC estimate likely lower than v1.0 plan.

- **Blocks:**
  - Slice 8c implementation (now scoped as contextual surface, not dedicated route).
  - Onboarding tour surface (`ONBOARDING_FLOW.md`) — needs to highlight bell + explain dot convention.
  - Design Brief v1.3 §14.6 + new §14.7 bell-dropdown subsection.

---

## 16. Verification checklist (before production ships)

Product-designer sign-off gates:

- [ ] Dot primitive renders on all 5 attachment-point types (position row, dashboard widget header, chat thread preview, insight card, transaction row) — tested in Storybook / Chromatic equivalent.
- [ ] Pulse animation respects `prefers-reduced-motion: reduce` — verified in Playwright.
- [ ] Pulse stops after 5 minutes of active page time OR on first hover/tap, whichever first.
- [ ] Concurrent-pulse cap = 3 (only top 3 pulsing, rest static) — verified.
- [ ] First-time-tutorial tooltip fires once per user, then suppressed via flag.
- [ ] Popover opens anchored to dot (desktop) / bottom sheet (mobile) — both tested.
- [ ] All pattern narratives in popover pass Lane A regex guardrail — tested with fixtures from tech-lead §2.6 Layer 2.
- [ ] Every popover carries verb-led framing («Provedo noticed…») — audit per Design Brief §0.2.
- [ ] Locked teaser popover (Free) reveals subject, never substance — visual + screen-reader audit.
- [ ] Bell icon shows coach-unread ring when at least one coach pattern unread — verified on all viewport sizes.
- [ ] Bell-dropdown opens with `Cmd/Ctrl+B` keyboard shortcut.
- [ ] Bell-dropdown groups: «Coach · This week» / «Coach · Earlier» / «Other notifications» — correct grouping under mixed-notification fixtures.
- [ ] Empty state Path A / B / post-gate all differentiable and correct — tested with fixture data.
- [ ] Dismiss / Snooze mutations reuse insights endpoints (Slice 6b) with correct loading + error states.
- [ ] Mobile tap targets ≥44×44 on popover buttons + bell + full-row tap zone on attachment points.
- [ ] WCAG 2.2 AA contrast check on dot colors (amber-600 / sky-600 / emerald-600 on white; amber-400 / sky-400 / emerald-400 on dark).
- [ ] Keyboard flow: Tab to dot → Enter → popover → Tab through buttons → Escape → focus returns to dot.
- [ ] Keyboard flow: Tab to bell → Enter → dropdown → Tab through rows → Enter → popover → Escape → focus returns to row.
- [ ] Screen reader announces «Provedo noticed a [Category] pattern on [element]» for every dot.
- [ ] Dark-mode dot colors + popover surfaces meet contrast thresholds.
- [ ] Upgrade CTA (Free popover + bell footer) routes to correct pricing URL with analytics parameters.

---

## 17. Open questions for PO (via Navigator)

1. **Disclaimer format.** Inline observational closer + one-time modal (recommended) vs explicit `Disclaimer` component per popover. Legal-advisor + PO to confirm.
2. **Snooze default.** 30 days recommended. PO to confirm. (Carried over from v1.0.)
3. **Dashboard banner conversion nudge threshold.** Recommended: Free users with ≥3 unread locked patterns see a subtle banner once per month. PO to confirm or adjust threshold.
4. **Keyboard shortcut conflict.** `Cmd/Ctrl+B` — conflicts with browser bookmark bar toggle on some browsers. Alternative: `Cmd/Ctrl+Shift+B` or `Cmd/Ctrl+.`? Recommendation: use `Cmd/Ctrl+Shift+B` for no conflict. Tech-lead / PO to confirm.
5. **Dot on chat thread previews — scope.** Attachment-point #3 requires knowing which chat threads have coach-adjacent patterns. Is the chat thread metadata rich enough for this mapping at alpha? Tech-lead to confirm; may defer this attachment-point type to post-alpha if not feasible.
6. **Category-wide mute from bell-dropdown.** Should «Notification settings» link include per-category coach mute (e.g., «Don't show Concentration patterns»)? Recommendation: yes, in `/settings/notifications` as checkbox per category. Matches Design Brief §16 overrides. Post-alpha refinement.

---

## 18. Changelog

- **v1.0 (2026-04-23)** — initial spec with dedicated `/coach` route + filter chips + week anchors + full-surface pattern cards. Delta from tech-lead filter-chip ADR documented.
- **v2.0 (2026-04-23)** — major rewrite. Contextual-icon + bell-hub model per PO lock 2026-04-23 («Coach UX: contextual — NOT dedicated route, NOT filter-chip»). Removed `/coach` route sections; added attachment-point taxonomy (§1), dot interaction spec (§2-3), popover spec (§4), bell-dropdown hub extension (§7), contextual empty states (§6). Tech-lead backend ADRs 1-5 unchanged.
