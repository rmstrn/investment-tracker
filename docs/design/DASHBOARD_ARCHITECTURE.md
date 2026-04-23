# Dashboard Architecture — Memoro (Home Screen Spec)

**Owner:** product-designer
**Status:** draft v1.1 — Coach UX updated to contextual-icon + bell-hub model per PO lock 2026-04-23
**Date:** 2026-04-23
**Supersedes:** `docs/reviews/2026-04-23-product-designer-option4.md` §«Alternative 1 — chat-primary». PO locked dashboard-primary architecture 2026-04-23 (Q3). Earlier chat-primary recommendation is rescinded in favor of dashboard-primary with AI woven across surfaces.
**Depends on:** `docs/04_DESIGN_BRIEF.md` v1.2 (moving to v1.3); `docs/product/02_POSITIONING.md` v3.1; `docs/CC_KICKOFF_option4_coach_adr.md` (tech-lead coach ADR drafts); `docs/design/COACH_SURFACE_SPEC.md` v2.0 (contextual coach pattern).

---

## 1. Decision — dashboard-primary, AI woven

**Architecture:** Dashboard is the home. Chat is one of the primary tabs (not the home). Insights is a primary destination too. Coach is a **contextual layer** across existing surfaces (dots on attachment points + bell-dropdown hub) — not a primary route. AI is woven across dashboard cards, not siloed to chat.

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
│     │ │   Rows may carry a Memoro dot (contextual Coach       │   │
│     │ │   attachment point 1 — see COACH_SURFACE_SPEC §1)     │   │
│     │ └───────────────────────────────────────────────────────┘   │
│     │                                                             │
│     │ ┌───────────────────────────────────────────────────────┐   │
│     │ │ RECENT ACTIVITY (5 most recent transactions)          │   │
│     │ └───────────────────────────────────────────────────────┘   │
└─────┴─────────────────────────────────────────────────────────────┘
```

**Note on Coach surface.** Coach is no longer a distinct row on the dashboard (v1.0 had a «Coach pattern teaser tile»; v1.1 removes it). Instead, Coach is woven contextually — the dot primitive appears on position rows, widget headers (portfolio chart, allocation donut, recent activity), dashboard insight cards, and chat thread previews when a pattern attaches to them. The top-bar bell is the aggregation hub. See `COACH_SURFACE_SPEC.md` v2.0 §1-7.

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

### Coach — contextual only (no dedicated dashboard tile)

**Removed in v1.1.** Coach has no dedicated dashboard row. Coach surfaces contextually via the dot primitive on position rows and other attachment points (per `COACH_SURFACE_SPEC.md` v2.0 §1), plus the top-bar bell as hub. This avoids advertising a locked surface to Free users during the 30-day cold-start and aligns with the PO-locked «AI is the interface, not a feature» principle.

**Conversion nudge (Free tier, conditional).** If a Free user has ≥3 unread locked coach patterns accumulated over a month, a calm one-line banner may appear above the Positions row: «Memoro has noticed 3 patterns this month. Upgrade to Plus to see them.» Max one appearance per month; dismissable. Not a persistent tile.

### Recent activity

- 5 most recent transactions, chronological desc.
- Link text: «See all transactions» → `/positions` (transaction view) for alpha. Post-alpha may get its own `/activity` route.

---

## 3. AI woven — the pattern

Dashboard does not shunt AI to chat. AI is embedded in the dashboard surface as a semantic layer:

1. **«Memoro noticed» badges** on cards — for **non-Coach AI reasoning** (insights, explainers). Used sparingly (not on every card). Applied when AI has added reasoning to a surface that would otherwise be pure data:
   - Allocation donut with a non-coach insight annotation.
   - Positions row with a cost-basis insight («This position is near its 52-week high») — note: this is an insight-card badge, not a coach dot; they are distinct primitives.
   - Chart with a drawdown annotation («-8% week, driven by AAPL»).

   Visual: small pill, `text-xs`, `violet-700` outline + `violet-50` fill, 4px border radius, no icon. Placement: top-right corner of the card. Click opens `ExplainerTooltip` with the reasoning + source links.

2. **Coach dots** — contextual pattern-read indicators on attachment points (position rows, widget headers, chat thread previews, insight cards, transaction rows). Visual: 6px filled circle, categorical color (amber / sky / emerald / violet for multi-category). Click opens teaser popover (Free) or full detail popover (Plus/Pro). Full spec: `COACH_SURFACE_SPEC.md` §1-4. **Note:** coach dot + «Memoro noticed» badge are distinct primitives. Coach dot is for pattern reads (Coach surface). Badge is for other AI annotations (Insights + Explainer surfaces). An element can carry both if both apply.

3. **Insight of the week** inline on dashboard (top card, above charts). Already spec'd above. This is the one persistent AI-curated slot on dashboard.

4. **Ask Memoro chip** — entry point to chat from dashboard. One click. Pre-filled context: dashboard state. Chat opens with a suggested prompt derived from dashboard context («Why am I down this week?» if today's delta is negative; «What changed in my top 3 positions?» if top 3 moved >5%).

5. **Explainer tooltips** on every financial number (hero total, positions row values, chart data points, donut slices). Always available; no tier gate. Per Design Brief §14.5.

6. **Bell-dropdown hub** — top-bar aggregation surface for all «Memoro noticed» notifications, including Coach patterns. Always on screen; pulse once per session on first new coach pattern; `Cmd/Ctrl+Shift+B` keyboard shortcut. See `COACH_SURFACE_SPEC.md` §7 and Design Brief v1.3 §14.7.

**What AI-woven does NOT mean:**

- No sparkle animations when a card renders.
- No brain-pulse loaders.
- No persistent «AI active» chrome in the top bar.
- No «thinking…» indicators on cards that already loaded (only on streaming surfaces like chat).

See Design Brief v1.2 §0 Anti-pattern list (added concurrently with this spec).

---

## 4. Primary routes — tab structure

Five primary routes. Dashboard is tab 1 on all platforms. Coach has no route — it is woven contextually across existing surfaces (PO lock 2026-04-23; see `COACH_SURFACE_SPEC.md` v2.0 §0).

| # | Route | Label | Purpose | ICP A weight | ICP B weight |
|---|---|---|---|---|---|
| 1 | `/dashboard` | **Dashboard** | Home. Portfolio summary + AI-woven cards. Coach dots surface here on positions + widgets. | **Primary** | **Primary** |
| 2 | `/positions` | **Positions** | Full holdings table, drill-in to position detail. Coach dots on rows + transactions. | **Primary** | Secondary |
| 3 | `/insights` | **Insights** | AI-surfaced items feed. Weekly digest cadence. Coach dots on adjacent insight cards. | Secondary | **Primary** |
| 4 | `/chat` | **Chat** | Free-form Q&A with Memoro. Coach dots on thread previews + thread heads. | Secondary | **Primary** |
| 5 | `/settings` | **Settings** | Account, accounts-management, notifications (incl. Coach category mute), subscription. | Utility | Utility |

**Coach:** not a route. Surfaced via dot primitive on attachment-point elements across the 5 routes above + bell-dropdown hub in the top bar. See `COACH_SURFACE_SPEC.md` §1-7.

### Web navigation pattern (desktop + tablet ≥768)

Side nav, 240px fixed width, collapsible to 56px icon-only. Top bar 56px height.

```
┌─────────────────────────────────────────────────────────┐
│ Memoro (logo) · Ask Memoro chip · Bell 🔔 · Plan · Avatar │  ← 56px top bar
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
- Chat: `message-circle`
- Settings: `cog`

Bell icon in top-bar: Lucide `bell`, 20px. Hosts Coach aggregation + all other notifications. See `COACH_SURFACE_SPEC.md` §7.

Currently shipped nav (verified via `apps/web/src/components/app-shell-client.tsx`) includes Dashboard / Positions / Chat / Insights / Accounts / Settings. **Changes needed (tracked as dependencies for frontend-engineer via Navigator):**

1. **No Coach nav item.** Reversal from v1.0. Coach surfaces contextually; no tab, no route.
2. Remove **Accounts** from primary nav — demote to `/settings/accounts` (§18 of Design Brief already puts account management in settings). Rationale: accounts-management is a setup surface, not a daily destination. Decision still stands independent of Coach UX change.
3. Reorder to: Dashboard / Positions / Insights / Chat / Settings. (Insights moves up — primary for ICP B.)
4. **Add bell icon to top-bar right group** — left of PlanBadge. New primitive behavior per `COACH_SURFACE_SPEC.md` §7.

### iOS navigation pattern (post-alpha, design-locked now)

iOS HIG favors 3-5 tab-bar items; 4 is the sweet spot for primary navigation. Settings goes to a standard More-menu or a profile-button in the top-right.

**4 tabs (iOS primary):**

1. **Dashboard** (`square.grid.2x2` SF Symbol)
2. **Insights** (`sparkles` SF Symbol — mirror web)
3. **Chat** (`message` SF Symbol)
4. **Settings** (`gearshape` SF Symbol)

**Secondary (via push navigation from Dashboard or a top-left menu):**

- Positions — push from Dashboard's «See all positions» row, OR via slide-over menu. Matches v1.0 rationale.
- Accounts — inside Settings.

**Coach on iOS:** surfaced via dot primitive on attachment-point elements (positions rows, dashboard widget headers, chat thread previews, insight cards) and the top-bar bell icon (visible on all screens with a top bar). No Coach tab in the bottom tab-bar.

**Rationale for Positions demotion on iOS only:** iOS users hit `/positions` less frequently than web users (mobile is glance-oriented, desktop is spreadsheet-oriented). Push-navigation from dashboard preserves it without eating a tab slot. If user-research post-alpha shows mobile users want Positions as a tab, we promote it by demoting Settings (which is utility-grade on iOS — a top-right gear works well). Validated-by-data post-alpha call.

### Mobile web (≤768px)

Mobile web matches iOS pattern (bottom tab bar with 4 slots: Dashboard / Insights / Chat / Settings). Positions behind a top-left hamburger or accessible from dashboard's «See all positions». Bell icon in top-bar. This is a responsive pattern, not a separate app — web and mobile web share the same React app, with a breakpoint-driven nav component.

---

## 5. Surface primacy per user segment

The same 6 routes serve all users, but which surface they use daily differs by segment.

### ICP A — multi-broker millennial (28-40, $20-100K, productivity-native)

Daily pattern: dashboard (primary, 70%+ of sessions) → insights (secondary, weekly) → positions (secondary, deeper check) → chat (occasional, for drill-in queries). Coach dots surface contextually across all of these once patterns accumulate (≥30d history).

- Dashboard: hero + charts + positions preview + weekly insight. Coach dots appear on position rows and widget headers when patterns match.
- Chat: used for «why?» questions triggered from dashboard cards. Coach dots on thread previews if a thread topic has an associated pattern.
- Bell: always-on anchor for Coach reading + other notifications.

### ICP A secondary — mid-career post-mistake retail ($30-150K, self-aware)

Same as ICP A primary, but Coach is the reason they're here — so bell-dropdown engagement is expected to be higher (they check bell more often to browse patterns). Dashboard stays home.

### ICP B — AI-native newcomer (22-32, $2-20K)

Daily pattern: chat (primary until they build habit) → dashboard (growing, weekly) → insights (weekly) → positions (rarely). Coach dots surface contextually once soft-gate threshold is crossed (tx_count ≥30 OR span ≥30d).

- Dashboard: still home. Hero is less impactful (small portfolio). Insight of the week + Ask Memoro chip do heavy lifting.
- Chat: primary AI interaction mode. Dashboard's Ask Memoro chip is their most-clicked element on dashboard. Coach dots can appear on chat thread previews if a thread has an associated pattern.
- Insights: weekly check-in after first sync.
- Coach: contextual across all surfaces. During cold-start (first 30 days), no dots appear; bell-dropdown shows cold-start empty state with progress counter (`COACH_SURFACE_SPEC.md` §6.2).

**Key insight:** even for ICP B (chat-leaning), dashboard is the home. The Ask Memoro chip does the routing work chat-primary-home would have done. Dashboard-primary unifies architecture without costing ICP B their chat-first preference. Coach being contextual (not a separate route) means ICP B encounters patterns organically in their chat + dashboard flow without needing to learn a new destination.

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
| Chat | Empty chat | Suggested prompts (chips), pre-filled per dashboard state |
| Settings | Never empty | N/A |

**Coach empty states live in the bell-dropdown**, not on a route. Three bell-dropdown empty variants (Path A warm-start backfill in progress, Path B cold-start, post-gate no-patterns-this-week). See `COACH_SURFACE_SPEC.md` §6.

Each empty state text must be verb-led not identity-led. **Say «Memoro noticed…» / «Memoro is learning…» — never «your brain noticed…»**. See Design Brief v1.2 §0 and accessibility discussion in `COACH_SURFACE_SPEC.md` §6.

---

## 7. Top-bar components

Top bar hosts chrome-level navigation + AI entry. 56px height.

**Left:**
- Memoro logo (wordmark; square mark on mobile ≤640px).

**Center-left (desktop) or hidden (mobile <640):**
- `Ask Memoro` chip — pill-shaped, `violet-700` outline, `violet-50` fill, `text-sm`, Medium weight. Click → `/chat` new conversation with dashboard context. Keyboard shortcut: `⌘ + K` / `Ctrl + K` (hint shown on hover). On mobile, chip collapses into a floating action button at bottom-right of dashboard only.

**Right:**
- **Bell (notifications + Coach hub)** — `BellDropdown` primitive from Design Brief §10.3 + v1.3 §14.7 extension. Behavior:
  - Lucide `bell` icon, 20px, `text.primary` at rest.
  - Unread count badge: small circle overlay top-right of bell, `semantic.info` fill, `text.onAccent` text, `text-xs` Semibold. 1-9 or `9+`.
  - **Coach-unread differentiator:** when at least one unread coach pattern present in dropdown, bell icon gains a 1px `accent.primary` (violet-700) ring at outer radius. Disappears when all coach patterns read.
  - **First-coach-of-session pulse:** bell pulses once (1200ms scale 1.0→1.15→1.0) when the first new coach pattern lands in a session. Subsequent patterns in the same session: badge increments silently. Reduced motion: no pulse.
  - **Keyboard shortcut:** `Cmd/Ctrl+Shift+B` opens the dropdown (avoids browser bookmark-bar-toggle conflict on `Cmd/Ctrl+B`). Hint shown on hover.
  - Dropdown content: see `COACH_SURFACE_SPEC.md` §7.2 (Plus/Pro) and §7.3 (Free).
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
- Positions preview: full width. Rows may carry Coach dots (contextual — no separate tile).
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
- **Keyboard flow:** Top bar (logo → Ask Memoro chip → Bell → Plan → Avatar) → Side nav (Dashboard → Positions → Insights → Chat → Settings) → Content cards in vertical order. Every card that has a CTA is focusable. Coach dots within cards/rows are tab-stops; see `COACH_SURFACE_SPEC.md` §9.4.
- **Screen reader:**
  - Hero: `<section aria-label="Portfolio summary">`. Total value is announced with its delta ("Total portfolio value: $148,204. Today: up 0.82 percent, plus 1,214 dollars. All time: up 9.2 percent").
  - Cards with AI badges: `aria-label` includes "Memoro insight" prefix before the card content.
  - Rows/widgets with Coach dots: dot is a `<button aria-label="Memoro noticed a [Category] pattern on [element]. Press Enter to read.">`. See `COACH_SURFACE_SPEC.md` §9.1.
  - Every financial number gets `aria-live="polite"` when it updates post-mount.
- **Reduced motion:** Count-up animation disabled; number arrives at final value. Chart drawing animates only on `prefers-reduced-motion: no-preference`. Card fade-in on mount disabled. Coach dot pulse + bell first-session pulse disabled.
- **Color-only signaling:** forbidden. All gain/loss data carries sign prefix (`+0.82%` / `-1.1%`). Coach dot color always pairs with category text in hover tooltip / popover / bell-dropdown row — never color-only.
- **Focus ring:** 2px `violet-700` outside + 2px `background.page` inside (ring offset) on every focusable element. Same as Design Brief §12.2.

---

## 11. What this does NOT spec

- Exact chart implementation (done by frontend-engineer using shared chart lib; this spec only mandates visual treatment).
- Ask Memoro chip click behavior when chat is mid-stream (resolved in Chat surface spec — future artifact).
- Notification center content grouping (resolved in §16 of Design Brief; unchanged here).
- Settings subpage layout (separate spec, post-alpha).

---

## 12. Dependencies

- **Blocked on:** PO sign-off via Navigator. Frontend-engineer buy-in that (a) Accounts can be demoted to settings (via tech-lead routing review) and (b) bell-dropdown can host a new Coach section per `COACH_SURFACE_SPEC.md` §7.
- **Blocks:**
  - Coach surface spec (companion artifact `COACH_SURFACE_SPEC.md`).
  - Onboarding flow spec (`ONBOARDING_FLOW.md`).
  - Slice 12 (empty/error states) needs to include dashboard empty states from §6 above.
  - Future Slice — «Nav restructure» — frontend-engineer's work to move Accounts into Settings and add bell-dropdown to top-bar (Coach hub). Sequencing: can ship independently of Coach Slice 8a as pure UI/routing + top-bar extension.

---

## 13. Open questions for PO (via Navigator)

1. **~~Coach teaser on Free-tier dashboard~~** — RESOLVED by PO 2026-04-23. No dedicated dashboard teaser tile. Coach surfaces via contextual dots. Optional conditional banner (once per month, ≥3 unread locked patterns) is a low-pressure conversion nudge.
2. **Accounts demotion:** moving Accounts out of primary nav into Settings is correct architecturally but changes user-learned navigation from shipped state. Recommendation: ship with both during a 30-day transition period (Accounts visible at both `/accounts` and `/settings/accounts`, with deprecation notice on `/accounts`). PO to confirm transition strategy.
3. **Ask Memoro chip copy:** exact label — «Ask Memoro», «Ask your portfolio», «Ask»? Recommendation: «Ask Memoro» to reinforce named agent. Content-lead coordination needed.
4. **Bell keyboard shortcut:** `Cmd/Ctrl+Shift+B` (recommended — no browser conflict) vs `Cmd/Ctrl+B` (potential Chrome/Firefox bookmark-bar-toggle conflict). Tech-lead / PO to confirm. Carried across from `COACH_SURFACE_SPEC.md` §17 Q4.

---

## 14. Changelog

- **v1.0 (2026-04-23)** — initial spec. Supersedes chat-primary recommendation from product-designer review. Locks dashboard-primary + AI-woven architecture per PO Q3 2026-04-23.
- **v1.1 (2026-04-23)** — Coach UX patch per PO lock 2026-04-23. Removed Coach from primary routes (5 routes: Dashboard / Positions / Insights / Chat / Settings). Removed dashboard Coach teaser tile. Added Coach-as-contextual-dot pattern to §3 AI-woven. Updated §4 web nav (no Coach icon, reorder). Updated §4 iOS tab-bar (4 tabs: Dashboard / Insights / Chat / Settings — Coach contextual via dots + bell). Bell icon enhanced in §7 with coach-unread ring, first-session pulse, keyboard shortcut. Empty-states §6 removes Coach route rows (Coach empty states live in bell-dropdown per `COACH_SURFACE_SPEC.md` §6).
