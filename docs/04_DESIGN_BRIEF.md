# 04 — Design Brief v1.1

Source of truth for the visual, interaction, and content design of Investment Tracker. Consumed by TASK_02 (design system implementation) and TASK_07 (web frontend), with parallel guidance for TASK_08 (iOS).

**Version history**
- v1.0 — initial brief, foundations only
- v1.1 — added freemium UX (§13), AI module UI (§14), tier-specific screens (§15), notifications (§16), security UI (§17), account management (§18), KPI coverage map (§19)

---

## 1. Overview & principles

The product is an AI-native portfolio tracker, not a brokerage. The design has to feel premium and calm — people trust us with a read-only view of their financial life, and the AI layer is the reason they come back.

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
| Insights | Proactive, specific, actionable |
| Onboarding | Encouraging, never patronizing |
| Errors | Calm, specific, with a next step |
| Paywall | Honest about value, never guilt-trip |

### 2.3 Naming

Product: **Investment Tracker** (working). Short form: "the tracker". Avoid internal codenames in UI.

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

Purpose: the AI notices things without being asked.

UI:
- InsightCard in a vertical feed on dedicated page
- "Insight of the day" card on dashboard (top 1)
- Categories: concentration, behavioral, dividend, performance, rebalance
- Each card: headline (one line), body (2-4 lines), source (which positions/dates), CTAs (View details / Dismiss / Snooze)
- Dismissed insights never return; snoozed return in 7 days if still valid

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

`BellDropdown` in top bar. Unread count as `slate-700` dot, violet-700 when high-priority. Grouping: today / earlier this week / older.

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

---

Maintained by the design lead. Changes require a PR with rationale in the description. Ship tokens first in `packages/design-tokens`, then this doc, then TASK_07/08 implementation catches up.
