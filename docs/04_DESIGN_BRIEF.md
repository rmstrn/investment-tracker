# 04 — Design Brief v1.3

Source of truth for the visual, interaction, and content design of Memoro. Consumed by TASK_02 (design system implementation) and TASK_07 (web frontend), with parallel guidance for TASK_08 (iOS).

**Version history**
- v1.0 — initial brief, foundations only
- v1.1 — added freemium UX (§13), AI module UI (§14), tier-specific screens (§15), notifications (§16), security UI (§17), account management (§18), KPI coverage map (§19)
- v1.2 — added §0 anti-pattern list (Memoro brand-metaphor guard); §2.2 Insights tone row changed «actionable» → «observational»; §14.2 Insights cadence honesty (weekly, not daily); new §14.6 Coach surface subsection referencing `docs/design/COACH_SURFACE_SPEC.md`; new §11.6 reference to `docs/design/DASHBOARD_ARCHITECTURE.md`; updated principles commentary for dashboard-primary architecture (positioning lock 2026-04-23)
- v1.3 — rewrote §14.6 Coach surface to contextual-icon + bell-hub model per PO lock 2026-04-23; added new §14.7 BellDropdown pattern (extension of §10.3 + §16.2); updated §15 tier-specific screens to remove Coach-route references; no token changes

---

## 0. Anti-pattern list — Memoro brand-metaphor guard

Memoro's tagline is «Second Brain for Your Portfolio». The metaphor carries well-known aesthetic gravity that directly conflicts with the «calm over busy» principle and the Magician + Sage + Everyman archetype. This section is an explicit NO list. Designers and engineers MUST reject these patterns during design review and code review.

### 0.1 Banned visual tropes

The following are forbidden in Memoro's UI — at any tier, on any surface, on any platform (web and iOS):

- **AI-sparkle visuals.** Gradient halos around AI output, animated sparkles on AI-generated content, «generating…» starbursts. The AI is the behavior, not the chrome.
- **Neural-network / synapse imagery.** Glowing node constellations, animated synapse lines, brain-pulse loaders, neuron dot-grids, connectome graphs. Every second-brain productivity app defaults to this; we do not.
- **Brain icons in persistent UI chrome.** No Lucide `brain` / `brain-cog` / `brain-circuit` in tab bars, nav, top bar, card headers, loading states. No SF Symbols `brain` / `brain.head.profile` / `brain.filled.head.profile` on iOS. The word «Memoro» carries the memory semantics; icons do not need to repeat it.
- **«Thinking» / «memorizing» animations.** No pulsing dots indicating the brain is thinking during a non-streaming state. Streaming indicators in chat are allowed (`aria-live="polite"` text indicator); decorative brain-pulses outside streaming are not.
- **«Memory indicator» progress bars.** No timelines showing «brain is learning», no accumulating-memory meters. Coach's 30-day cold-start IS a day-count progress (see `COACH_SURFACE_SPEC.md` §3), but that's a functional progress toward a named threshold — not decorative memory-chrome.
- **Liquid Glass effects on AI content.** iOS 26 Liquid Glass is ALLOWED on chrome (tab-bar blur, nav background). It is FORBIDDEN on AI-generated cards (insight cards, coach cards, chat bubbles). Those surfaces stay opaque with standard `background.elevated`.
- **Gradient meshes / blobs / glow effects.** No vaporwave gradients, no glowing orbs, no generative-AI-aesthetic meshes. Solid backgrounds and flat tokens only.
- **Dashboard-jazz.** No confetti on gains. No animated celebrations. No particle effects. No haptic-visual fireworks. Robinhood is the anti-reference; we are not Robinhood.

### 0.2 Banned copy-level patterns

Copy and microcopy must also avoid:

- **«Your brain noticed…»** / **«Your second brain…»** as persistent UI narration voice. The agent's name is **Memoro** — that's what copy says. Screen readers amplify personification awkwardly; «Your brain noticed X» reads strangely on screen readers. Use «Memoro noticed X» or verb-led framing («Noticed this week: X»).
- **Imperative action language from AI.** Lane A LOCKED. AI never says «buy X», «sell Y», «rebalance», «reduce your exposure». Only `notice / observe / flag / surface / explain / show / summarize`. This applies to chat, insights, coach, and dashboard AI badges.

### 0.3 Aesthetic reference — what we ARE

Memoro belongs to the **editorial knowledge-work** visual tradition:

- **Positive references (intonation):** Stripe, Linear, Ramp, Notion (product UI), Obsidian's restraint side. Calm typographic hierarchy, generous whitespace, restrained use of accent color, information density without visual noise, source citation treated as first-class content.
- **Negative references (what we avoid):** Robinhood, eToro, most crypto-aesthetic fintech, 2025-era AI-consumer apps with sparkle-heavy interiors.

### 0.4 Enforcement

- Design review: every new surface spec must reference this anti-pattern list and declare compliance.
- Code review: `code-reviewer` agent flags violations — brain icons in UI chrome, sparkle animations, gradient meshes in CSS, violate-able copy (see §0.2).
- Token audit: `packages/design-tokens/` must not contain tokens named for brain/neural/sparkle imagery. If a need arises, raise through Navigator before token add.

---

## 1. Overview & principles

Memoro is an AI-native portfolio tracker — a «Second Brain for Your Portfolio» — not a brokerage, not an advisor (Lane A LOCKED). The design has to feel premium and calm — people trust us with a read-only view of their financial life, and the AI layer is the reason they come back. Architecture is dashboard-primary with AI woven (LOCKED 2026-04-23); see §11.6 and `docs/design/DASHBOARD_ARCHITECTURE.md`.

Six principles, in priority order:

1. **Calm over busy.** Dashboards are information-dense; we fight that with whitespace, hierarchy, and restraint. No gradients, no decorative chrome, no dashboard-jazz.
2. **AI is the interface, not a feature.** Chat, insights, coach, scenarios, explainer — these are load-bearing, not sidecars. The visual system treats them as primary surfaces.
3. **Trust through transparency.** We show sources. We label estimates. We never hide uncertainty behind a friendly number.
4. **Data-first, then decoration.** Numbers are the hero. Typography supports them. Color is used sparingly and with intent.
5. **Consistent across surfaces.** Web and iOS share tokens, patterns, and voice. They diverge only where platform conventions demand it (navigation, gestures, share sheets).
6. **Accessibility is table stakes.** WCAG 2.1 AA minimum; 2.2 targets where practical. No contrast shortcuts, no keyboard dead-ends, no reliance on color alone.

Not-goals: gamification, social feeds, leaderboards, push-notification maximization, dark patterns for upgrades.

---

## 2. Brand identity

### 2.1 Voice

- **Confident, not cocky.** We know what we're talking about; we don't oversell.
- **Plain language.** Say "your portfolio dropped 2.3%" not "NAV experienced a negative revaluation event."
- **Honest about limits.** "We couldn't fetch data from X" beats silently hiding the gap.
- **Conversational in AI surfaces, precise in data surfaces.** The chat can say "looks like"; the dashboard says "down 2.3%".

### 2.2 Tone by surface

| Surface | Tone |
|---|---|
| Dashboard | Neutral, factual, tight |
| AI chat | Warm, curious, allowed to hedge |
| Insights | Proactive, specific, observational (not «actionable» — Lane A lock 2026-04-23; AI never prescribes actions) |
| Onboarding | Encouraging, never patronizing |
| Errors | Calm, specific, with a next step |
| Paywall | Honest about value, never guilt-trip |

### 2.3 Naming

Product name LOCKED 2026-04-23: **Memoro** (Latin 1st-person-singular «I remember»). Tagline: **«Second Brain for Your Portfolio»** (v3.1 positioning lock). Hero: imperative «Ask your portfolio» / «Спроси свой портфель» (bilingual-ready; English day-1 launch).

In-product references:
- Product name: **Memoro** (never «the tracker», «the app», «Investment Tracker»).
- Agent self-reference in copy: **Memoro** (third-person). «Memoro noticed…» / «Memoro is learning…». Never «your brain…», «your second brain…», or «I…» (no AI first-person).
- Tagline use: sparingly in marketing surfaces; not persistent UI chrome.

See §0.2 banned copy-level patterns.

---

## 3. Color system

### 3.1 Neutral scale — Slate

We chose Tailwind's `slate` over `zinc` because slate reads slightly warmer on white backgrounds and has better perceived depth in dark mode.

```
slate-50   #f8fafc
slate-100  #f1f5f9
slate-200  #e2e8f0
slate-300  #cbd5e1
slate-400  #94a3b8
slate-500  #64748b
slate-600  #475569
slate-700  #334155
slate-800  #1e293b
slate-900  #0f172a
slate-950  #020617
```

### 3.2 Accent — Violet

Primary brand accent: **violet-700 `#6D28D9`**.

Rationale: reads as premium without being fintech-cliché (no deep-blue-and-gold), distinctive among competitors (Finary orange, Getquin blue), calm enough to live alongside positive/negative portfolio colors without creating a rainbow.

```
violet-50   #f5f3ff
violet-100  #ede9fe
violet-500  #8b5cf6   ← hover state
violet-600  #7c3aed   ← pressed state
violet-700  #6d28d9   ← primary accent
violet-800  #5b21b6
violet-900  #4c1d95
```

Use sparingly: primary CTAs, active nav, focus rings, key data-viz accent. **Never** for body text or large surfaces.

### 3.3 Semantic colors

Muted, not ER-saturated:

```
positive  emerald-600  #059669  (on light) / emerald-400 #34d399 (on dark)
negative  rose-600     #e11d48  (on light) / rose-400    #fb7185 (on dark)
warning   amber-600    #d97706  (on light) / amber-400   #fbbf24 (on dark)
info      sky-600      #0284c7  (on light) / sky-400     #38bdf8 (on dark)
```

All four pass 4.5:1 on their respective surface backgrounds.

### 3.4 Portfolio gain/loss

Deliberately distinct from generic positive/negative:

```
gain     emerald-700   #047857   (on light) / emerald-400 (on dark)
loss     rose-700      #be123c   (on light) / rose-400    (on dark)
neutral  slate-500     #64748b
```

Numbers only. Charts use the same hues at reduced saturation for fills, full saturation for strokes.

### 3.5 Semantic tokens (mapping)

Tokens live in `packages/design-tokens/tokens/semantic/{light,dark}.json` and are consumed via Style Dictionary. Current values reflect the WCAG audit fix merged in PR #31.

Light:
```
background.page       slate-50
background.elevated   white
background.muted      slate-100
text.primary          slate-900
text.secondary        slate-700
text.muted            slate-500     ← 4.76:1 on white
border.subtle         slate-200
border.default        slate-300     ← visible contours, 1.48:1 on white (intentional)
border.strong         slate-400
```

Dark:
```
background.page       slate-950
background.elevated   slate-900
background.muted      slate-800
text.primary          slate-50
text.secondary        slate-300
text.muted            slate-400
border.subtle         slate-800
border.default        slate-700
border.strong         slate-600
```

Rationale for `border.default` compromise (1.48:1, below strict 3:1 for UI components): strict compliance produced a harsh fintech look. We keep 1.48 for decorative containment, use `border.strong` wherever the border carries interactive meaning (buttons, focused inputs). Tracked in `TECH_DEBT.md`.

---

## 4. Typography

### 4.1 Families

- **Sans:** Inter (web + iOS fallback to SF Pro on Apple platforms)
- **Mono:** Geist Mono (tabular numbers in tables, code, data-dense lists)

### 4.2 Scale

```
text-xs     12 / 16   captions, metadata
text-sm     14 / 20   secondary UI, table cells
text-base   16 / 24   body, default
text-lg     18 / 28   emphasized body, card titles
text-xl     20 / 28   section headings
text-2xl    24 / 32   page sub-headings
text-3xl    30 / 36   page titles, big numbers
text-4xl    36 / 40   hero numbers (total portfolio value)
text-5xl    48 / 48   marketing only
```

### 4.3 Weights

Regular 400, Medium 500, Semibold 600. No bold (700). Numbers that need visual weight use Semibold + tabular-nums.

### 4.4 Numbers

All currency and quantity numbers use `font-variant-numeric: tabular-nums`. Gain/loss percentages include a leading sign (`+2.3%`, `-1.1%`).

---

## 5. Spacing & layout

Scale (rem): `0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24`.

### 5.1 Grid

- Desktop: 12-col, 1440 canvas, max content width 1280, gutters 24
- Tablet: 8-col, 1024 canvas, gutters 20
- Mobile: 4-col, 390 canvas, gutters 16

### 5.2 Page chrome

Top bar 56. Side nav 240 (collapsible to 56). Content padding 32 desktop, 16 mobile.

---

## 6. Elevation & shadows

Four levels. Subtle — we rely on borders more than shadows in light mode, flipped in dark mode.

```
shadow-sm   0 1px 2px rgba(15,23,42,0.04)
shadow-md   0 2px 6px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.04)
shadow-lg   0 8px 24px rgba(15,23,42,0.08), 0 2px 6px rgba(15,23,42,0.04)
shadow-xl   0 16px 48px rgba(15,23,42,0.12)
```

Dark mode: reduce opacity by ~40%; compensate with `ring-1 ring-white/5` for edge definition.

---

## 7. Border radius

```
radius-none  0
radius-sm    4    chips, small tags
radius-md    8    inputs, small cards
radius-lg    12   cards, dialogs, bottom sheets
radius-xl    16   feature cards, paywall hero
radius-full  9999 avatars, pills, fab
```

---

## 8. Motion

Principles: **short, confident, directional**. Never bouncy.

```
duration-fast    120ms   micro-interactions (hover, focus)
duration-normal  200ms   most transitions
duration-slow    300ms   page-level, dialogs
duration-xslow   500ms   rare (onboarding, success confirmations)

easing-default   cubic-bezier(0.2, 0, 0, 1)
easing-in        cubic-bezier(0.4, 0, 1, 1)
easing-out       cubic-bezier(0, 0, 0.2, 1)
easing-inout     cubic-bezier(0.4, 0, 0.2, 1)
```

Numbers that change animate with `count-up` (tween over 600ms, ease-out). Never animate a delta that the user didn't cause themselves.

---

## 9. Iconography

- Web: **Lucide** (currentColor, stroke-width 1.5, size 16/20/24)
- iOS: **SF Symbols** (regular weight, scale medium)

Custom icons only for brand marks or asset class glyphs we genuinely need (stock, ETF, crypto) and Lucide doesn't cover cleanly.

---

## 10. Components

The design system exposes a set of primitives, composites, and patterns. Tokens drive all of them.

### 10.1 Primitives

Button, Input, Select, Combobox, Checkbox, Radio, Switch, Slider, Badge, Chip, Tooltip, Popover, Dropdown, Dialog, Sheet, Toast, Alert, Tabs, SegmentedControl, Card, Skeleton, Avatar, ProgressBar, Spinner, Separator.

### 10.2 Financial primitives

- **MoneyCell** — formatted currency with tabular-nums, auto color by sign
- **PercentCell** — same, with leading sign
- **CountUpNumber** — animated number for hero metrics
- **PositionRow** — symbol + name + qty + value + daily delta, default row for lists
- **Sparkline** — 7/30/90-day mini chart, uses `portfolio.gain/loss` colors
- **Allocation donut** — pie variant for asset-class breakdown, max 8 slices, ninth bucketed as "Other"

### 10.3 AI-specific primitives

- **ChatInputPill** — grounded single-line input with expanding textarea behavior
- **ToolUseCard** — shows what tool the AI invoked (e.g., "Fetched your AAPL transactions"), collapsible
- **TrustRow** — "Based on: N transactions across M accounts • Updated X min ago"
- **SuggestedPrompt** — dismissable chip with example question
- **ExplainerTooltip** — used in-place to decompose a number ("this 5.2% = $2,100 / $40,384")
- **InsightCard** — headline + body + source + two CTAs (`View` / `Dismiss`)
- **BellDropdown** — notifications center; `<li>` with inner `<div role="menuitem" tabIndex="0">` for correct a11y semantics

### 10.4 Monetization

- **PlanBadge** — subtle chip showing Free/Plus/Pro in context
- **PaywallModal** — honest, single-column, no urgency manipulation
- **UsageMeter** — linear bar with "X of Y used this month"
- **FeatureLockRow** — inline lock icon + one-line reason + CTA
- ~~**LockedPatternCard**~~ — **OBSOLETE in v1.3.** Was a teaser variant of the v1.2 `CoachPatternCard` (dedicated-route model). Replaced by CoachPopover teaser variant in v1.3 (contextual-dot model). See §10.5 and `COACH_SURFACE_SPEC.md` §4.2.

### 10.5 Coach primitives (v1.3 — contextual model)

v1.3 **supersedes v1.2** Coach primitives. PO 2026-04-23 locked Coach as contextual (not dedicated route); primitives redesigned accordingly.

**New (v1.3 — used):**

- **CoachDot** — 6px (desktop) / 8px (mobile) filled circle, categorical semantic color (amber-600 Concentration, sky-600 Timing / Contrarian, emerald-600 Dividends / Cost-averaging, violet-700 multi-category). Wrapped in a `<button>` for keyboard + a11y. Optional bounded pulse animation (scale 1.0→1.15→1.0, 1200ms, every 2.5s, max 5min active-page-time, `prefers-reduced-motion` → static). Mount point: any of 5 attachment types per `COACH_SURFACE_SPEC.md` §1.
- **CoachPopover** — dialog anchored to a CoachDot (desktop, max 480px) or full-width bottom sheet (mobile). Two content variants:
  - **Full detail (Plus/Pro):** category pill + read date + verb-led headline + observational summary + evidence block (monospaced tabular-nums transaction list) + dismiss/snooze actions.
  - **Teaser (Free):** category pill + subject-only headline + skeleton shimmer body + locked evidence + «Upgrade to Plus» CTA.
- **CategoryPill** — retained; categorical (not evaluative) pill with token-colored outline + text label. Used inside CoachPopover and bell-dropdown rows. Never color-only signal.

**Removed (v1.2 primitives obsoleted by v1.3):**

- ~~`CoachPatternCard`~~ — article-level card for `/coach` route; route removed.
- ~~`CoachWeekAnchor`~~ — `<h2>` week divider; no dedicated coach surface to anchor.
- ~~`CoachEmptyState`~~ — full-surface Path A/B empty states; empty states now live in bell-dropdown (`COACH_SURFACE_SPEC.md` §6).
- ~~`LockedPatternCard` (v1.2 §10.4)~~ — full locked card variant; replaced by teaser variant inside CoachPopover.

Frontend-engineer implements CoachDot + CoachPopover in Slice 8c (scope unchanged at slice level; substituting primitives within the slice).

---

## 11. Layout patterns

### 11.1 Dashboard (home)

```
┌─────────────────────────────────────────────────┐
│ TopBar: logo | search | notif | plan | avatar   │
├─────┬───────────────────────────────────────────┤
│ Nav │ Hero: total value + day/all-time delta    │
│     ├───────────────────────────────────────────┤
│     │ Insight of the day (AI) — full width      │
│     ├───────────────────────┬───────────────────┤
│     │ Portfolio line chart  │ Allocation donut  │
│     ├───────────────────────┴───────────────────┤
│     │ Positions table (top 5, "See all" →)      │
│     ├───────────────────────────────────────────┤
│     │ Recent activity (transactions)            │
└─────┴───────────────────────────────────────────┘
```

### 11.2 AI chat

Split view on desktop, full-screen on mobile. Left: conversation list + "new chat". Right: message column (max 720px readable width), input pinned bottom.

### 11.3 Positions / position detail

Table → row click → side sheet on desktop, full-screen on mobile. Detail contains: identity, position summary, transaction history, explainer for key metrics, related AI insights.

### 11.4 Accounts

List view + "+ Connect" primary action. Each account card shows broker logo, display name, last sync, status pill, quick menu.

### 11.5 Empty states

Illustration-free by default. Icon + short line + single CTA. Example: "No positions yet. Connect an account to see your portfolio. [ Connect ]".

### 11.6 Dashboard architecture — detailed spec

`docs/design/DASHBOARD_ARCHITECTURE.md` owns the full home-screen spec for Memoro:

- Top-of-fold hierarchy (hero → insight of the week → charts → positions → activity). Coach has no dedicated dashboard tile; coach dots surface on position rows + widget headers instead (v1.3 contextual model).
- AI-woven pattern (how «Memoro noticed» badges surface on cards without AI-sparkle chrome; coach dots are a distinct primitive).
- Primary routes + tab structure (Dashboard / Positions / Insights / Chat / Settings — 5 routes, Coach is contextual, not a route).
- Web side-nav + iOS bottom tab-bar mapping (4 tabs on iOS: Dashboard / Insights / Chat / Settings).
- Responsive behavior across 320/375/768/1024/1440/1920.
- Per-ICP daily-use patterns (ICP A / ICP B / mid-career post-mistake).

ASCII layout in §11.1 above is retained as a quick-reference; `DASHBOARD_ARCHITECTURE.md` is the authoritative source for dashboard design.

### 11.7 Onboarding flow — detailed spec

`docs/design/ONBOARDING_FLOW.md` owns the 3-stage onboarding flow:

- Stage 1: account creation (Clerk-hosted).
- Stage 2: broker sync (SnapTrade flow).
- Stage 3: first-value moment (warm-start via SnapTrade backfill-derived pattern-read within 10 minutes, NOT 30-day wait).

First-value-moment design handles both warm-start (backfill-triggered) and cold-start (no history) dual paths.

---

## 12. Accessibility

### 12.1 Contrast

- Text: 4.5:1 minimum (WCAG AA for body), 7:1 target for critical financial numbers
- UI components: 3:1 minimum (WCAG AA), with the documented compromise on `border.default` (§3.5)
- Never convey gain/loss through color alone — always sign + number

### 12.2 Keyboard

- All interactive elements reachable by Tab
- Escape closes dialogs, sheets, popovers
- Enter / Space activate buttons and menu items
- Arrow keys within menus, tabs, segmented controls (minimal arrow-nav in BellDropdown is tech-debt, Enter/Space suffice for now)
- Focus ring always visible, 2px violet-700 outside, 2px white inside (ring offset)

### 12.3 Screen readers

- All icons that carry meaning get `aria-label`
- Decorative icons `aria-hidden="true"`
- Live regions for AI streaming responses (`aria-live="polite"`)
- Charts have adjacent data-table alternative

### 12.4 Motion

Respect `prefers-reduced-motion`. Disable count-up, cross-fades, and decorative transitions. Keep functional state changes instant.

---

## 13. Freemium UX

### 13.1 Tiers

| Tier | Price | Accounts | AI msgs/day | Insights | Tax reports | API |
|---|---|---|---|---|---|---|
| Free | $0 | 2 | 5 | Weekly | — | — |
| Plus | $8–10 | 10 | 100 | Daily | — | — |
| Pro | $20 | Unlimited | Unlimited | Real-time | US+DE | ✓ |

### 13.2 Gating patterns

Three levels of friction, chosen by feature:

1. **Soft lock** — feature visible, greyed-out with `FeatureLockRow` inline. Used for low-value gates (custom alerts).
2. **Modal lock** — `PaywallModal` on click, preview of what they'd see. Used for AI daily insights beyond weekly.
3. **Page lock** — full upgrade page for premium-only surfaces (tax reports). Always shows clearly what's included.

### 13.3 Never

- No dark patterns ("you'll lose your data in 3 days")
- No forced trial auto-renewal without prominent 7-day-prior email reminder
- No fake scarcity ("only 3 spots left")
- No countdown timers on paywalls
- No "downgrade" language; use "change plan"

### 13.4 Upgrade surfaces

- Contextual in-feature CTA (the moment they hit a limit)
- Settings → Subscription (non-intrusive)
- One honest email sequence (welcome → first insight → 30-day value recap → limit-approaching → upgrade offer)

---

## 14. AI module UI

We have five AI surfaces. Each gets its own visual identity within the system.

### 14.1 Chat

Purpose: free-form Q&A about the user's portfolio.

UI:
- Message bubbles: user right-aligned slate-100, AI left-aligned with subtle violet-50 tint in light mode, slate-800 in dark
- Streaming: token-by-token, cursor indicator
- ToolUseCard collapses below the message when the AI used a tool
- TrustRow appears under every AI response
- SuggestedPrompt chips appear in empty state

Free tier: 5 messages/day counter visible in input area. Plus/Pro: hidden unless approaching limit.

### 14.2 Proactive insights

Purpose: Memoro notices things without being asked.

**Cadence honesty (LOCKED 2026-04-23):** weekly-default, not daily. Free tier = 1 insight/week (weekly digest). Plus tier = daily (1 per day max). Pro tier = real-time as-found. Earlier «daily» framing for Free tier is rejected — daily pressure breaks the «calm over busy» principle and positions Memoro as push-driven notification stream, which it is not. Landing and in-product copy align on «weekly» for Free tier messaging.

UI:
- InsightCard in a vertical feed on dedicated page (`/insights`)
- "Insight of the week" card on dashboard (top 1 for Free; today's for Plus; real-time for Pro). See `docs/design/DASHBOARD_ARCHITECTURE.md` §2.
- Categories: concentration, behavioral (Coach surfaces contextually via dots on related elements — see §14.6 v1.3 contextual model), dividend, performance, observational (NOT rebalance — rebalance is imperative; Lane A lock forbids imperative framing)
- Each card: headline (one line, verb-led), body (2-4 lines, observational voice), source (which positions/dates), CTAs (View details / Dismiss / Snooze)
- Dismissed insights never return; snoozed return in 7 days if still valid
- Headline framing: **«Memoro noticed…»**, **«Flagged this week:…»**, **«Surfaced:…»**. Never «Your brain noticed…». See §0.2.

### 14.3 Behavioral coach

Purpose: flag emotional-investing patterns, gently.

UI:
- Appears as a sheet triggered by behavior (e.g., 3+ buys in 7 days on same ticker after price spike)
- Never blocks user action; it's observational
- "Want to talk about this?" → routes to chat with pre-filled context
- Can be muted per-category in settings

### 14.4 Scenario simulator

Purpose: "what if I bought X / sold Y" and "how would my portfolio look".

UI:
- Entry points: from position detail, from chat, from allocation donut (click segment → "What if I rebalanced?")
- Modal with side-by-side: current vs. simulated, with deltas on key metrics
- Disclaimer: "Simulation only. Past performance doesn't predict future."
- Pro-only feature (Free and Plus see paywall)

### 14.5 Explainer

Purpose: decompose any number on the screen.

UI:
- Long-press / right-click / `?` icon on any financial number opens ExplainerTooltip
- Shows the formula and the inputs ("5.2% = $2,100 gain / $40,384 cost basis")
- Links to source transactions
- Always available (no tier gate)

### 14.6 Coach — contextual behavioral pattern reads

Purpose: Memoro surfaces patterns in user's trade history — observationally, never as advice.

**Architecture (LOCKED 2026-04-23 by PO, supersedes earlier dedicated-route and filter-chip proposals):** Coach is a **contextual layer**, not a primary route. Coach is surfaced via:

1. **Dot indicator primitive** on attachment-point elements — position rows, dashboard widget headers, chat thread previews, insight cards, transaction rows. A small (6px desktop / 8px mobile) categorical-colored filled circle signals «Memoro noticed a pattern concerning this element».
2. **Top-bar bell-dropdown** as the aggregation hub — see §14.7.

Coach is NOT a primary route. Coach is NOT a nav item. Coach is woven into existing surfaces.

**Detailed spec:** `docs/design/COACH_SURFACE_SPEC.md` v2.0 — owns attachment-point taxonomy, dot primitive, pulse motion spec, hover/focus/active states, popover (Plus/Pro full detail + Free teaser), bell-dropdown hub, empty states (Path A warm-start, Path B cold-start, post-gate quiet), accessibility. Supersedes v1.0 `/coach` route spec.

**Integration contract with this design brief:**
- Coach dot primitive uses existing semantic color tokens — `semantic.warning` (Concentration), `semantic.info` (Timing / Contrarian-signal), `semantic.positive` (Dividends / Cost-averaging), `accent.primary` (multi-category on same element). No new tokens required.
- Coach popover content (both Plus/Pro detail variant and Free teaser variant) reuses existing primitives: Skeleton (locked state shimmer), Dialog (popover), Button (CTA), Lucide `lock` icon, existing dismiss/snooze mutation buttons.
- Coach patterns flow through the same mutation contract as insights (dismiss + snooze via existing insights backend, per Slice 6b pattern) — no new mutation primitives needed.
- Coach has its own category taxonomy (Concentration / Timing / Dividends / Cost-averaging / Contrarian-signal). Dot colors + popover category pills are categorical, NOT evaluative (no red-for-bad, green-for-good).
- Coach cold-start gating uses tx-count-or-history-span soft gate (not calendar-day hard gate). Bell-dropdown shows progress counter during cold-start (`COACH_SURFACE_SPEC.md` §6.2). See `CC_KICKOFF_option4_coach_adr.md` §2.3.
- Coach in-context AI disclaimer: every popover summary closes with observational-framing language («no judgment», «pattern only», or equivalent). Narrative is AI-Service-generated and passes Lane A regex guardrail (`CC_KICKOFF_option4_coach_adr.md` §2.6 Layer 2) server-side; client trusts the filter and renders only validated text.
- Coach regulatory guardrail: backend regex filter rejects imperative output; design trusts the filter.
- Coach dot anti-pattern compliance (§0): NO sparkle, NO brain glyph, NO gradient halo, NO AI-glow. Solid filled circle only. Optional subtle pulse (scale 1.0→1.15→1.0, 1200ms, every 2.5s, bounded to 5 min active-page-time, `prefers-reduced-motion: reduce` → static).

**Removed v1.2 primitives:**

- `CoachPatternCard` (article-level card for `/coach` route) — obsolete in v1.3 (route removed). Dot + popover take its place. See §10.5 update below.
- `CoachWeekAnchor` (`<h2>` week section divider) — obsolete (no dedicated coach surface to anchor).
- `CoachEmptyState` (Path A / Path B full-surface variants) — obsolete. Empty states now live inside bell-dropdown (`COACH_SURFACE_SPEC.md` §6).
- `LockedPatternCard` (Free-tier full locked card variant) — obsolete. Locked teaser lives in popover instead (`COACH_SURFACE_SPEC.md` §4.2).
- `CategoryPill` — retained as popover/dropdown element; no longer used in a dedicated coach surface.

**New v1.3 primitives:**

- **`CoachDot`** — 6px/8px filled circle with category-colored semantic token, optional pulse animation, wrapped in a `<button>` for keyboard + screen-reader accessibility. Mount point: any attachment-point element per `COACH_SURFACE_SPEC.md` §1.
- **`CoachPopover`** — dialog anchored to a CoachDot (desktop) or full-width bottom sheet (mobile). Two content variants: full detail (Plus/Pro) and teaser (Free). Reuses existing Dialog + Skeleton + Button primitives.

**Content-lead coordination:** every pattern category needs a narrative template (popover summary body). Product-designer owns the dot + popover shape; content-lead owns copy variants (headline templates, observational closer, teaser headline framing, dashboard conversion-nudge banner). See `COACH_SURFACE_SPEC.md` §13 for full list of copy hooks.

**Legal-advisor coordination:** in-context AI disclaimer format is still open per positioning lock 2026-04-23 Q6. Product-designer's candidate recommendation in v1.3 remains **inline observational closer on every popover summary** (not tooltip) plus a one-time first-interaction modal on first dot-click («Memoro shows patterns based on your trade history, not advice. This is educational, not investment guidance.» — Acknowledge). Legal-advisor to confirm whether inline closer satisfies EU/UK requirement. Tracked in `COACH_SURFACE_SPEC.md` §17 Q1.

### 14.7 BellDropdown pattern — hub for «Memoro noticed» notifications

Purpose: single always-on-screen aggregation surface for every «Memoro noticed» notification — including Coach patterns, weekly digest, price alerts, billing, security events.

Extension of the `BellDropdown` primitive from §10.3 and behavior notes in §16.2.

**Visual behavior:**

- Lucide `bell` icon in top-bar right group (left of PlanBadge), 20px, `text.primary` at rest.
- Unread count badge: small circle overlay top-right of bell, `semantic.info` fill (sky-600), `text.onAccent` text, `text-xs` Semibold. Shows 1-9 or `9+`.
- **Coach-unread differentiator:** when at least one unread coach pattern is present in the dropdown, the bell icon gains a subtle 1px `accent.primary` (violet-700) ring at the icon's outer radius. Differentiates coach-present from generic-product-notifications-only. Disappears when all coach patterns read.
- **First-coach-of-session pulse:** the first time a new coach pattern lands in a session, the bell pulses ONCE (scale 1.0→1.15→1.0 over 1200ms). Subsequent coach patterns in the same session: badge count increments silently. User-agency principle — one attention-grab per session. Reduced motion: no pulse.

**Dropdown structure (see `COACH_SURFACE_SPEC.md` §7.2 / §7.3 for full layouts):**

Sections in order:

1. **Coach · This week** — coach patterns from the current weekly cycle (Sunday 00:00 UTC – Sat 23:59 UTC).
2. **Coach · Earlier** — coach patterns from older cycles, not yet read / dismissed. Collapsed by default if >3 items.
3. **Other notifications** — non-coach types (digest emails, price alerts, billing, etc.).

Footer: «Mark all read» + «Notification settings» link (→ `/settings/notifications`, includes per-Coach-category mute toggles).

**Free vs Plus/Pro:**

- Plus/Pro: coach rows show pattern-name teaser text. Click opens full popover.
- Free: coach rows show «🔒 Locked preview» label. Click opens teaser popover. Footer gains «Upgrade to Plus for full pattern reads ▸» link.

**Keyboard shortcut:**

- `Cmd/Ctrl+Shift+B` toggles the bell-dropdown from anywhere in the app. `Cmd/Ctrl+B` NOT used — conflicts with browser bookmark-bar toggle on Chrome/Firefox.
- Hint shown in bell hover tooltip.

**Accessibility (extends §10.3 TD-005):**

- `<button aria-label="Notifications — N unread" aria-haspopup="menu" aria-expanded="[bool]">` on the bell.
- Dropdown `role="menu"` (minimal arrow-nav remains tech-debt TD-005; Enter/Space + Tab suffice for alpha).
- Coach rows `role="menuitem"` with context-specific `aria-label` per `COACH_SURFACE_SPEC.md` §7.6.
- Reduced motion: dropdown opens/closes instantly (no scale/opacity transition); bell first-session pulse disabled.

**Empty state variants (Path A warm-start, Path B cold-start, post-gate quiet):** see `COACH_SURFACE_SPEC.md` §6. Bell icon shows without badge during all empty states (count = 0).

**Integration contract:** BellDropdown receives its feed from a single notifications API endpoint (tech-lead to confirm — payload must include notification type discriminant so Coach rows can be grouped separately from other types). Coach rows consume insights-type payload with `type = 'coach_weekly'` (per `CC_KICKOFF_option4_coach_adr.md`). Mutation actions on Coach rows (dismiss, snooze) reuse Slice 6b insights-mutation endpoints.

---

## 15. Tier-specific screens

### 15.1 Free

- Dashboard shows weekly insight only, with "Daily insights → Plus" inline CTA
- AI chat input shows "N of 5 messages today" counter
- Accounts page: "Add account" button is disabled past 2 with tooltip

### 15.2 Plus

- Dashboard: daily insight at top, with "Real-time → Pro" tease
- AI chat: clean input, hidden counter
- Accounts: 10-account limit, progress indicator in settings

### 15.3 Pro

- All locks off
- Additional nav item: "Reports" (tax)
- Additional nav item: "Scenarios" (simulator)
- Settings: API key management section

### 15.4 Plan switcher

Top-right `PlanBadge`. Click → dropdown:
- Current plan + "Manage"
- Link to pricing
- If on Free: prominent "Upgrade" button

---

## 16. Notifications

### 16.1 Types

| Type | Channel | Default | Override |
|---|---|---|---|
| Security (new login, etc.) | Email + in-app | On, not mutable | — |
| Insight published | In-app | On | Off per category |
| Weekly summary | Email | On | Off |
| Price alert (user-set) | In-app | On | Off per alert |
| Billing | Email | On, not mutable | — |
| Product updates | Email | Off | On if desired |

### 16.2 In-app

`BellDropdown` in top bar. Unread count as `slate-700` dot, violet-700 when high-priority. Grouping updated in v1.3 — see §14.7 for full spec:

- Coach · This week
- Coach · Earlier
- Other notifications

When a Coach pattern is unread, bell icon gains a 1px `accent.primary` outer ring. First-coach-of-session bell pulse (1200ms scale, disabled on `prefers-reduced-motion`). Keyboard shortcut `Cmd/Ctrl+Shift+B`.

### 16.3 Email design

Same type scale. Single-column, 600px max width. Unsubscribe link in footer (for non-mandatory emails). No tracking pixels (principle — we'll use aggregate open-tracking via provider, no per-user).

---

## 17. Security UI

### 17.1 Auth

- Clerk-hosted sign-up/sign-in pages, themed to match tokens (not dark-vs-light-flash)
- 2FA setup in settings, QR code + backup codes (downloadable as PDF only, never shown as image or text to copy)
- Sessions page: device, location (country-level, never precise), last active

### 17.2 Data handling

- Every place that displays sensitive data (e.g., broker linkage status) has a "What we see" explainer tooltip
- Accounts page has a "Disconnect" action with a confirmation showing exactly what happens ("we'll stop syncing; your historical data stays until you delete it")
- "Delete account" in settings: destructive red-700 button at bottom, 3-step confirmation (explain → type username → final)

### 17.3 Trust markers

Subtle, not bragging:
- "Read-only" pill next to every broker account
- "Encrypted at rest" in tooltip on security section
- Bank-grade phrasing avoided; we don't need to namedrop SOC-2 until we have it

---

## 18. Account management

### 18.1 Profile

Avatar upload, display name, email (managed by Clerk), locale, display currency, time zone. Changes save inline (no explicit save button) with toast confirmation.

### 18.2 Subscription

Plan card with: current plan, next billing date, amount, "Manage in Stripe" button (opens Stripe Customer Portal in new tab).

### 18.3 Data & privacy

- Export all data (GDPR) → async job, emails link to downloadable zip
- Delete all data (GDPR) → 7-day soft-delete with "restore" option, then hard delete
- Connected accounts overview (Clerk-provided and ours)

### 18.4 Notifications settings

As per §16, togglable per-category.

---

## 19. KPI coverage map

How the design system supports business KPIs. Useful as a sanity check when adding new surfaces.

| KPI | Primary surfaces | Design levers |
|---|---|---|
| Activation (connect first account) | Onboarding, empty dashboard, connect flow | Empty state CTA prominence, onboarding chat, trust markers |
| Engagement (DAU/MAU) | Dashboard, AI chat, insights feed | Daily insight freshness, chat answer quality, notification restraint |
| Retention (30/90-day) | All surfaces, email touchpoints | Calm UX (no fatigue), behavioral coach restraint, value recap emails |
| Conversion Free→Plus | Paywall, usage meter, upgrade CTA contexts | Honest gating, contextual CTAs, no dark patterns |
| Upgrade Plus→Pro | Pro-feature teases, scenario simulator, reports | Tease without nagging, clear Pro-only value |
| Trust / NPS | AI transparency, error states, disclosure | TrustRow, ToolUseCard, source links, calm tone |
| Churn (early warning) | Settings, billing | Reminder emails ≥7 days prior, pause option (future), honest cancel flow |

---

## Appendix A — Reference competitors

Positive references (what we're learning from):
- **Linear** — information density + calm
- **Raycast** — keyboard-first polish
- **Lunchmoney** — financial UX done well
- **Arc** — unexpected but unobtrusive moments

Negative references (what we avoid):
- **Robinhood** — gamified, confetti
- **eToro** — cluttered, social-maxxed
- Most retail broker apps — cluttered, ad-driven

---

## Appendix B — Change log

- **v1.0 → v1.1:** added §13 freemium UX, §14 AI module UI, §15 tier-specific screens, §16 notifications, §17 security UI, §18 account management, §19 KPI coverage map; updated §3.5 with WCAG audit outcomes from PR #31.
- **v1.1 → v1.2 (2026-04-23):** Memoro product-name lock + dashboard-primary architecture lock alignment. Added:
  - **§0 Anti-pattern list** — explicit ban list guarding the «Second Brain» metaphor against AI-sparkle / brain-chrome / neural-network / gradient-mesh / Liquid-Glass-on-AI-content / dashboard-jazz drift. Copy-level patterns banned («Your brain noticed…»). Enforcement notes for design review + code review.
  - **§2.2 Insights tone** — «actionable» → «observational» (Lane A lock, AI never prescribes).
  - **§2.3 Naming** — Memoro locked; agent-self-reference policy («Memoro noticed…», never «your brain…», never AI first-person).
  - **§10.4 Monetization** — added `LockedPatternCard` primitive for Coach teaser-paywall.
  - **§10.5 Coach primitives** — new subsection introducing `CoachPatternCard`, `CoachWeekAnchor`, `CoachEmptyState`, `CategoryPill`.
  - **§11.6 Dashboard architecture** — pointer to `docs/design/DASHBOARD_ARCHITECTURE.md`.
  - **§11.7 Onboarding flow** — pointer to `docs/design/ONBOARDING_FLOW.md`.
  - **§14.2 Insights cadence honesty** — Free tier = weekly (not daily); aligned with positioning + landing.
  - **§14.6 Coach surface** — new subsection; delegates detailed spec to `docs/design/COACH_SURFACE_SPEC.md`; coach integration contract (mutation reuse, category taxonomy, cold-start gating, regulatory guardrail, legal-advisor coordination for in-context AI disclaimer format).
  - No token changes. Token system remains metaphor-neutral; v1.1 palette + semantic mapping survives v1.2 unchanged.
- **v1.2 → v1.3 (2026-04-23):** Coach UX PO lock — contextual-icon + bell-hub model supersedes dedicated-route model. Changes:
  - **§10.4 Monetization** — `LockedPatternCard` marked OBSOLETE (replaced by CoachPopover teaser variant in §10.5).
  - **§10.5 Coach primitives** — rewritten. `CoachDot` + `CoachPopover` added. v1.2 primitives (`CoachPatternCard`, `CoachWeekAnchor`, `CoachEmptyState`, `LockedPatternCard`) marked obsolete. `CategoryPill` retained.
  - **§11.6 Dashboard architecture pointer** — updated primary routes count (5, not 6); removed Coach teaser row from top-of-fold; updated iOS tab-bar (4 tabs, Coach contextual).
  - **§14.2 Insights categories** — behavioral insights note updated (no longer «routes to Coach»; coach surfaces contextually).
  - **§14.6 Coach surface** — major rewrite. Contextual-layer architecture: dot on attachment-points + bell-dropdown hub. Legal-advisor coordination carried forward. Detailed spec now in `COACH_SURFACE_SPEC.md` v2.0.
  - **§14.7 BellDropdown pattern (new)** — single hub for all «Memoro noticed» notifications including Coach. Coach-unread violet ring differentiator, first-session pulse, keyboard shortcut `Cmd/Ctrl+Shift+B`, three-section grouping (Coach · This week / Coach · Earlier / Other).
  - **§16.2 In-app notifications** — BellDropdown grouping updated (points to §14.7).
  - No token changes. Existing semantic tokens (warning / info / positive / accent.primary) cover Coach dot colors. Palette and mapping unchanged.

---

Maintained by the product-designer agent (Navigator mediates PO review). Changes require a PR with rationale in the description. Ship tokens first in `packages/design-tokens`, then this doc, then TASK_07/08 implementation catches up.
