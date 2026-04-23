# Dashboard Architecture — Memoro (Home Screen Spec)

**Owner:** product-designer
**Status:** draft v1.0 — awaiting Navigator review + PO sign-off
**Date:** 2026-04-23
**Supersedes:** `docs/reviews/2026-04-23-product-designer-option4.md` §«Alternative 1 — chat-primary». PO locked dashboard-primary architecture 2026-04-23 (Q3). Earlier chat-primary recommendation is rescinded in favor of dashboard-primary with AI woven across surfaces.
**Depends on:** `docs/04_DESIGN_BRIEF.md` v1.1 (moving to v1.2); `docs/product/02_POSITIONING.md` v3.1; `docs/CC_KICKOFF_option4_coach_adr.md` (tech-lead coach ADR drafts).

---

## 1. Decision — dashboard-primary, AI woven

**Architecture:** Dashboard is the home. Chat is one of the primary tabs (not the home). Insights and Coach are primary destinations too. AI is woven across dashboard cards, not siloed to chat.

**Rationale (short):**

- **ICP A (multi-broker millennial, 28-40, $20-100K).** Getquin/Kubera mental model is what they know. Opening the app to chat-primary is a category break users must re-learn on every login. Dashboard at login matches expectation and removes friction.
- **ICP B (AI-native newcomer, 22-32, $2-20K).** Chat-primary initially feels right, but on day-2+ they still want «what's my portfolio worth?» at a glance. Dashboard + Ask Memoro chip entry solves both — default dashboard, chat one tap away.
- **Metaphor preservation.** «Second Brain» is expressed through AI-woven cards (Memoro noticed X, pattern preview, insight of the day inline in dashboard), not through chat-primary chrome. The metaphor lives in the product's behavior, not its layout.
- **Competitive differentiation holds.** Getquin dashboards are aggregator-first with AI as side-panel. Memoro dashboards are aggregator-first with AI embedded inline in every card that has reasoning to share. That's a design difference, not a layout difference.
- **iOS HIG compliance.** Tab-bar at the bottom of iOS demands a clear primary destination. Dashboard-as-tab-1 is legible; chat-as-tab-1 is not.

**What this rejects:**

- Chat-primary-home (earlier product-designer review recommendation — rescinded).
- Unified timeline home (Alternative 3 in review — out of scope for alpha; may revisit post-alpha as design-sprint exploration).
- 3-tab «Dashboard / Chat / More» iOS layout — too sparse for the surfaces we need.

---

## 2. Top-of-fold hierarchy — Dashboard

Dashboard home loads to this, in strict vertical priority order. Each row may span full width (desktop) or stack (mobile).

```
┌───────────────────────────────────────────────────────────────────┐
│ Top bar:  Memoro (logo) · / · Ask Memoro chip · Bell · Plan · Avatar │
├─────┬─────────────────────────────────────────────────────────────┤
│ Nav │ ┌───────────────────────────────────────────────────────┐   │
│     │ │ HERO                                                  │   │
│     │ │   $148,204.12                                         │   │
│     │ │   +$1,214 today (+0.82%) · +$12,489 all-time (+9.2%)  │   │
│     │ │   [Ask Memoro ▸]  (secondary chip, routes to chat)    │   │
│     │ └───────────────────────────────────────────────────────┘   │
│     │                                                             │
│     │ ┌───────────────────────────────────────────────────────┐   │
│     │ │ INSIGHT OF THE WEEK  ·  "Memoro noticed"              │   │
│     │ │   Headline (one line)                                 │   │
│     │ │   Body (2 lines max)                                  │   │
│     │ │   Source · View all insights ▸                        │   │
│     │ └───────────────────────────────────────────────────────┘   │
│     │                                                             │
│     │ ┌──────────────────────────────┬────────────────────────┐   │
│     │ │ PORTFOLIO LINE CHART         │ ALLOCATION DONUT       │   │
│     │ │ (7d / 30d / 90d / 1y / all)  │ (asset-class, 8 max)   │   │
│     │ └──────────────────────────────┴────────────────────────┘   │
│     │                                                             │
│     │ ┌───────────────────────────────────────────────────────┐   │
│     │ │ POSITIONS (top 5) · "See all positions ▸"             │   │
│     │ └───────────────────────────────────────────────────────┘   │
│     │                                                             │
│     │ ┌───────────────────────────────────────────────────────┐   │
│     │ │ COACH PATTERN TEASER (Plus lock if Free) [if gated]   │   │
│     │ │   "Memoro noticed a pattern in your last 90 days"     │   │
│     │ │   Obfuscated detail · [Upgrade to Plus ▸]             │   │
│     │ │   OR (Plus/Pro): full pattern-read card               │   │
│     │ └───────────────────────────────────────────────────────┘   │
│     │                                                             │
│     │ ┌───────────────────────────────────────────────────────┐   │
│     │ │ RECENT ACTIVITY (5 most recent transactions)          │   │
│     │ └───────────────────────────────────────────────────────┘   │
└─────┴─────────────────────────────────────────────────────────────┘
```

### Hero (total value) — design contract

- **Scale:** `text-4xl` (36/40), Semibold, tabular-nums, `text.primary`.
- **Delta row:** `text-base` (16/24), Regular, split into two runs — today's delta · all-time delta — separated by a mid-dot. Today colored by sign (gain/loss tokens from §3.4). All-time always neutral (`text.secondary`) to prevent «doom-focus» visual noise.
- **Ask Memoro chip:** `SuggestedPrompt`-variant with a brain-free icon (use Lucide `sparkle` once, or `message-square-dashed` — to be decided in Slice 12. No brain icon. See §0 Anti-pattern in Design Brief v1.2). Routes to `/chat` with empty session.
- **Spacing:** 32px top padding desktop, 16px mobile. Hero sits above the fold on all breakpoints (320/375/768/1024/1440/1920).
- **Reduced-motion:** when present, count-up on total value disables. Number renders final value instantly.
- **Empty state:** pre-first-sync shows skeleton number + «Connect your first account to see your portfolio» CTA replacing delta row.

### Insight of the week card

- Always present post-first-sync (Free tier shows 1 per week; Plus shows today's; Pro shows real-time).
- Visual treatment: same as insights feed card but outlined with `border.subtle` + subtle `violet-50` tint in light mode to signal «AI-surfaced».
- Headline uses verb-led framing: **«Memoro noticed…»** / **«Flagged this week:…»** — NOT «your brain noticed» (see accessibility note §5.3).
- CTA: `View all insights` routes to `/insights`.
- Dismiss lives here too (same pattern as feed).

### Portfolio chart + allocation donut

- Desktop: side-by-side, 2/3 chart · 1/3 donut.
- Tablet (1024): stacks under 1024px into two full-width cards.
- Mobile (≤768): stacks.
- Chart uses gain/loss portfolio tokens (§3.4); donut uses a calibrated 8-color palette from Design Brief §14 (extend if needed; coordinate through Navigator).
- Both charts carry an explainer tooltip affordance (§14.5) — click/long-press on any data point opens `ExplainerTooltip` with the number breakdown.

### Positions preview (top 5)

- Reuse `PositionRow` primitive from Design Brief §10.2.
- Sort: by current value desc.
- Link text: «See all positions» → `/positions`. Not a button; styled as a link with chevron.

### Coach pattern teaser tile (conditional)

- **Free:** visible only when the user has ≥30 days of sufficient history (per tech-lead ADR 5). Before then, coach teaser tile is **not shown on dashboard** — it lives only on the dedicated coach tab (see §4 route primacy). This prevents the dashboard from advertising a locked surface every login in the first month.
- **Plus/Pro:** shows the latest coach pattern-read inline if any was generated in the last 14 days; else hidden.
- **Teaser-paywall pattern (Free with history):** headline «Memoro noticed a pattern» + 1-line obfuscated detail («You've traded NVDA N times in the last 90 days in a pattern worth reading») + `Upgrade to Plus` CTA. Never shows the actual pattern name or dates. See `COACH_SURFACE_SPEC.md` §5 for detailed teaser-paywall contract.

### Recent activity

- 5 most recent transactions, chronological desc.
- Link text: «See all transactions» → `/positions` (transaction view) for alpha. Post-alpha may get its own `/activity` route.

---

## 3. AI woven — the pattern

Dashboard does not shunt AI to chat. AI is embedded in the dashboard surface as a semantic layer:

1. **«Memoro noticed» badges** on cards. Used sparingly (not on every card). Applied when AI has added reasoning to a surface that would otherwise be pure data:
   - Allocation donut with a concentration flag («One slice is over your usual range»).
   - Positions row with a cost-basis insight («This position is near its 52-week high»).
   - Chart with a drawdown annotation («-8% week, driven by AAPL»).

   Visual: small pill, `text-xs`, `violet-700` outline + `violet-50` fill, 4px border radius, no icon. Placement: top-right corner of the card. Click opens `ExplainerTooltip` with the reasoning + source links.

2. **Insight of the week** inline on dashboard (top card, above charts). Already spec'd above. This is the one persistent AI-curated slot on dashboard.

3. **Coach pattern teaser tile** — conditional, tier-aware, below positions. Already spec'd above.

4. **Ask Memoro chip** — entry point to chat from dashboard. One click. Pre-filled context: dashboard state. Chat opens with a suggested prompt derived from dashboard context («Why am I down this week?» if today's delta is negative; «What changed in my top 3 positions?» if top 3 moved >5%).

5. **Explainer tooltips** on every financial number (hero total, positions row values, chart data points, donut slices). Always available; no tier gate. Per Design Brief §14.5.

**What AI-woven does NOT mean:**

- No sparkle animations when a card renders.
- No brain-pulse loaders.
- No persistent «AI active» chrome in the top bar.
- No «thinking…» indicators on cards that already loaded (only on streaming surfaces like chat).

See Design Brief v1.2 §0 Anti-pattern list (added concurrently with this spec).

---

## 4. Primary routes — tab structure

Six primary routes. Dashboard is tab 1 on all platforms.

| # | Route | Label | Purpose | ICP A weight | ICP B weight |
|---|---|---|---|---|---|
| 1 | `/dashboard` | **Dashboard** | Home. Portfolio summary + AI-woven cards. | **Primary** | **Primary** |
| 2 | `/positions` | **Positions** | Full holdings table, drill-in to position detail. | **Primary** | Secondary |
| 3 | `/insights` | **Insights** | AI-surfaced items feed. Weekly digest cadence. | Secondary | **Primary** |
| 4 | `/coach` | **Coach** | Behavioral pattern-reads (Plus/Pro full; Free teaser). | Secondary (growing) | Tertiary until day 30 |
| 5 | `/chat` | **Chat** | Free-form Q&A with Memoro. | Secondary | **Primary** |
| 6 | `/settings` | **Settings** | Account, accounts-management, notifications, subscription. | Utility | Utility |

### Web navigation pattern (desktop + tablet ≥768)

Side nav, 240px fixed width, collapsible to 56px icon-only. Top bar 56px height.

```
┌─────────────────────────────────────────────────────────┐
│ Memoro (logo) · Ask Memoro chip · Bell · Plan · Avatar   │  ← 56px top bar
├─────┬───────────────────────────────────────────────────┤
│ 🏠  │                                                   │
│ Das.│                                                   │
│     │                                                   │
│ 📊  │                                                   │
│ Pos.│            Content area                           │
│     │                                                   │
│ ✨  │                                                   │
│ Ins.│                                                   │
│     │                                                   │
│ 🧭  │                                                   │
│ Coa.│                                                   │
│     │                                                   │
│ 💬  │                                                   │
│ Cha.│                                                   │
│     │                                                   │
│ ──  │                                                   │
│ ⚙️  │                                                   │
│ Set.│                                                   │
└─────┴───────────────────────────────────────────────────┘
```

Icons are Lucide (see Design Brief §9). **Confirmed icons (no brain glyph):**

- Dashboard: `layout-grid`
- Positions: `briefcase`
- Insights: `sparkles` — kept (Lucide `sparkles` is restrained compared to brain-circuit; one decorative sparkle at stroke 1.5 is acceptable for the insights surface and already shipped)
- Coach: `compass` — chosen to avoid `brain`, `brain-circuit`, `brain-cog`. Compass conveys «guidance without imperatives» (Lane A alignment) without AI-sparkle clichés.
- Chat: `message-circle`
- Settings: `cog`

Currently shipped nav (verified via `apps/web/src/components/app-shell-client.tsx`) includes Dashboard / Positions / Chat / Insights / Accounts / Settings. **Changes needed (tracked as dependencies for frontend-engineer via Navigator):**

1. Add **Coach** nav item (new route, new icon `compass`).
2. Remove **Accounts** from primary nav — demote to `/settings/accounts` (§18 of Design Brief already puts account management in settings). Rationale: accounts-management is a setup surface, not a daily destination; freeing tab slot for Coach is the right trade.
3. Reorder to: Dashboard / Positions / Insights / Coach / Chat / Settings. Insights moves up (primary for ICP B), Coach sits next to Insights (both are AI-surfaced feeds), Chat follows.

### iOS navigation pattern (post-alpha, design-locked now)

iOS HIG favors 3-5 tab-bar items; 4 is the sweet spot for primary navigation. Settings goes to a standard More-menu or a profile-button in the top-right.

**4 tabs (iOS primary):**

1. **Dashboard** (`square.grid.2x2` SF Symbol)
2. **Insights** (`sparkles` SF Symbol — mirror web)
3. **Coach** (`location.north.line` SF Symbol — compass-equivalent; NOT `brain` family)
4. **Chat** (`message` SF Symbol)

**Secondary (via push navigation from Dashboard or a top-left menu):**

- Positions — push from Dashboard's «See all positions» row, OR via slide-over menu.
- Settings — top-right gear in profile area (standard iOS pattern).
- Accounts — inside Settings.

**Rationale for Positions demotion on iOS only:** iOS users hit `/positions` less frequently than web users (mobile is glance-oriented, desktop is spreadsheet-oriented). Push-navigation from dashboard preserves it without eating a tab slot. If user-research post-alpha shows mobile users want Positions as a tab, we promote it by demoting Chat (since mobile chat is secondary for ICP A). This is a validated-by-data post-alpha call, not a launch call.

### Mobile web (≤768px)

Mobile web matches iOS pattern (bottom tab bar with 4 slots: Dashboard / Insights / Coach / Chat). Settings and Positions behind a top-left hamburger or profile menu. This is a responsive pattern, not a separate app — web and mobile web share the same React app, with a breakpoint-driven nav component.

---

## 5. Surface primacy per user segment

The same 6 routes serve all users, but which surface they use daily differs by segment.

### ICP A — multi-broker millennial (28-40, $20-100K, productivity-native)

Daily pattern: dashboard (primary, 70%+ of sessions) → insights (secondary, weekly) → positions (secondary, deeper check) → chat (occasional, for drill-in queries). Coach becomes primary after day 30 once patterns accumulate.

- Dashboard: hero + charts + positions preview + weekly insight. Coach teaser appears after day 30.
- Chat: used for «why?» questions triggered from dashboard cards.
- Coach: grows in importance after first 90 days; becomes secondary daily destination.

### ICP A secondary — mid-career post-mistake retail ($30-150K, self-aware)

Same as ICP A primary, but Coach becomes primary earlier (Coach is the reason they're here). Dashboard stays home.

### ICP B — AI-native newcomer (22-32, $2-20K)

Daily pattern: chat (primary until they build habit) → dashboard (growing, weekly) → insights (weekly) → positions (rarely). Coach is tertiary until day 30.

- Dashboard: still home. Hero is less impactful (small portfolio). Insight of the week + Ask Memoro chip do heavy lifting.
- Chat: primary AI interaction mode. Dashboard's Ask Memoro chip is their most-clicked element on dashboard.
- Insights: weekly check-in after first sync.
- Coach: unavailable for first 30 days; empty-state must be handled carefully (see `COACH_SURFACE_SPEC.md` §3).

**Key insight:** even for ICP B (chat-leaning), dashboard is the home. The Ask Memoro chip does the routing work chat-primary-home would have done. Dashboard-primary unifies architecture without costing ICP B their chat-first preference.

---

## 6. Empty states per route

Illustration-free by default per Design Brief §11.5. Each empty state has icon + short line + single CTA.

| Route | Trigger | Empty state |
|---|---|---|
| Dashboard | No accounts connected | Icon (broken plug) · «No portfolio yet» · «Connect your first broker to see Memoro in action» · `Connect account` CTA |
| Dashboard | Accounts connected, zero positions | Icon · «Your accounts are connected, but we don't see positions yet. This can take a few minutes to sync» · `Check sync status` link |
| Positions | No positions | Same as dashboard empty state |
| Insights | No insights yet (first week) | Icon (`sparkles`) · «Memoro is learning your portfolio. First insight arrives within 7 days of your first sync» · No CTA; informational |
| Insights | All insights dismissed | Icon · «You're all caught up. New items arrive weekly» · No CTA |
| Coach | < 30 days of history (cold-start) | Full-surface treatment — see `COACH_SURFACE_SPEC.md` §3 |
| Coach | ≥30 days, no patterns this week | Icon (`compass`) · «Memoro read your trades this week and didn't flag a pattern. That's a good sign» · No CTA |
| Chat | Empty chat | Suggested prompts (chips), pre-filled per dashboard state |
| Settings | Never empty | N/A |

Each empty state text must be verb-led not identity-led. **Say «Memoro noticed…» / «Memoro is learning…» — never «your brain noticed…»**. See Design Brief v1.2 §0 and accessibility discussion in `COACH_SURFACE_SPEC.md` §6.

---

## 7. Top-bar components

Top bar hosts chrome-level navigation + AI entry. 56px height.

**Left:**
- Memoro logo (wordmark; square mark on mobile ≤640px).

**Center-left (desktop) or hidden (mobile <640):**
- `Ask Memoro` chip — pill-shaped, `violet-700` outline, `violet-50` fill, `text-sm`, Medium weight. Click → `/chat` new conversation with dashboard context. Keyboard shortcut: `⌘ + K` / `Ctrl + K` (hint shown on hover). On mobile, chip collapses into a floating action button at bottom-right of dashboard only.

**Right:**
- Bell (notifications center) — `BellDropdown` primitive from Design Brief §10.3.
- Plan badge — `PlanBadge` primitive; shows Free/Plus/Pro. Click for plan management popover.
- Avatar — Clerk `UserButton` with menu (Profile / Settings / Sign out).

---

## 8. Responsive behavior

| Breakpoint | Layout |
|---|---|
| 320 (iPhone SE portrait) | Single column. Hero compact (text-3xl instead of text-4xl). Charts stack. Positions preview 3 rows. Bottom tab bar (4 tabs). No side nav. |
| 375 (iPhone standard) | Same as 320, hero text-4xl OK. |
| 768 (tablet portrait) | Single column. Bottom tab bar stays. Positions preview 5 rows. Charts stack (line over donut). |
| 1024 (tablet landscape / small desktop) | Side nav collapsed (56px icon-only). Charts side-by-side. Positions preview 5 rows. |
| 1440 (desktop) | Side nav expanded (240px). Charts side-by-side. Max content width 1280. |
| 1920 (large desktop) | Same as 1440. Content centers with max-width. Extra space goes to gutters. |

**Content width rule:** max 1280px centered. Beyond 1440 viewport, add symmetric whitespace. Do not stretch content.

**Card widths on dashboard:**

- Hero: full width at all breakpoints.
- Insight of the week: full width.
- Chart + donut row: 2/3 + 1/3 at ≥1024; stacked below.
- Positions preview: full width.
- Coach teaser: full width.
- Recent activity: full width.

All card widths = container width (no forced equal-width grid).

---

## 9. Design tokens used

From `packages/design-tokens/tokens/semantic/{light,dark}.json`:

- `background.page`, `background.elevated`, `background.muted`
- `text.primary`, `text.secondary`, `text.muted`
- `border.subtle`, `border.default`, `border.strong`
- `portfolio.gain`, `portfolio.loss`, `portfolio.neutral`
- `semantic.info`, `semantic.warning`, `semantic.positive`, `semantic.negative`
- `accent.primary` (violet-700), `accent.hover` (violet-500), `accent.pressed` (violet-600)

No new tokens required for dashboard-primary architecture. Tokens remain metaphor-neutral per product-designer earlier review.

---

## 10. Accessibility

- **Contrast:** all card text meets 4.5:1 on `background.elevated`. Hero number hits 7:1 target.
- **Keyboard flow:** Top bar (logo → Ask Memoro chip → Bell → Plan → Avatar) → Side nav (Dashboard → Positions → Insights → Coach → Chat → Settings) → Content cards in vertical order. Every card that has a CTA is focusable.
- **Screen reader:**
  - Hero: `<section aria-label="Portfolio summary">`. Total value is announced with its delta ("Total portfolio value: $148,204. Today: up 0.82 percent, plus 1,214 dollars. All time: up 9.2 percent").
  - Cards with AI badges: `aria-label` includes "Memoro insight" prefix before the card content.
  - Every financial number gets `aria-live="polite"` when it updates post-mount.
- **Reduced motion:** Count-up animation disabled; number arrives at final value. Chart drawing animates only on `prefers-reduced-motion: no-preference`. Card fade-in on mount disabled.
- **Color-only signaling:** forbidden. All gain/loss data carries sign prefix (`+0.82%` / `-1.1%`). Coach pattern categories carry icon + text label, never color-only.
- **Focus ring:** 2px `violet-700` outside + 2px `background.page` inside (ring offset) on every focusable element. Same as Design Brief §12.2.

---

## 11. What this does NOT spec

- Exact chart implementation (done by frontend-engineer using shared chart lib; this spec only mandates visual treatment).
- Ask Memoro chip click behavior when chat is mid-stream (resolved in Chat surface spec — future artifact).
- Notification center content grouping (resolved in §16 of Design Brief; unchanged here).
- Settings subpage layout (separate spec, post-alpha).

---

## 12. Dependencies

- **Blocked on:** PO sign-off via Navigator. Frontend-engineer buy-in that Coach can be added as nav item and Accounts can be demoted to settings (via tech-lead routing review).
- **Blocks:**
  - Coach surface spec (companion artifact `COACH_SURFACE_SPEC.md`).
  - Onboarding flow spec (`ONBOARDING_FLOW.md`).
  - Slice 12 (empty/error states) needs to include dashboard empty states from §6 above.
  - Future Slice — «Nav restructure» — frontend-engineer's work to add Coach tab + move Accounts into Settings. Sequencing: can ship independently of Coach Slice 8a as pure UI/routing.

---

## 13. Open questions for PO (via Navigator)

1. **Coach teaser on Free-tier dashboard:** appear after day 30 (recommended), or never (only inside Coach tab)? Recommendation: appear after day 30 for upgrade-conversion, with design restraint (no pulsing CTA, calm teaser tone). PO to confirm.
2. **Accounts demotion:** moving Accounts out of primary nav into Settings is correct architecturally but changes user-learned navigation from shipped state. Recommendation: ship with both during a 30-day transition period (Accounts visible at both `/accounts` and `/settings/accounts`, with deprecation notice on `/accounts`). PO to confirm transition strategy.
3. **Ask Memoro chip copy:** exact label — «Ask Memoro», «Ask your portfolio», «Ask»? Recommendation: «Ask Memoro» to reinforce named agent. Content-lead coordination needed.
4. **Coach tab icon:** `compass` vs `location.north.line` (iOS) vs custom glyph. Recommendation: `compass` on web, `location.north.line` on iOS. PO-level awareness only; not requiring lock.

---

## 14. Changelog

- v1.0 (2026-04-23) — initial spec. Supersedes chat-primary recommendation from product-designer review. Locks dashboard-primary + AI-woven architecture per PO Q3 2026-04-23.
