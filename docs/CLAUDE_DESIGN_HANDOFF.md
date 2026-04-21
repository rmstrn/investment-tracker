# Claude Design — Investment Tracker handoff pack

**Purpose:** Give Claude Design enough context to start producing design work (screens, flows, component refinements, landing page, empty states) without you having to re-explain the product each session.

---

## 1. Paste this first (product one-pager)

**What we're building.** Investment Tracker — an AI-native portfolio aggregator (not a brokerage). Users connect brokers + crypto exchanges read-only; the product shows a unified cross-currency / cross-asset-class view, AI-driven analysis, a chat layer you can talk to about your own holdings, and proactive insights. We never execute trades or hold real assets.

**Who it's for.** Primary: beginner + intermediate EU/US retail investors. Later: a Pro tier for experienced users (tax, advanced analytics). Asset classes in MVP: stocks, ETFs, crypto. Out: real estate, deposits, pensions, P2P.

**Unique positioning.** AI is the primary interface, not a sidecar. Competitors (Finary, Getquin, Kubera, Delta, Sharesight) add AI on top of a conventional dashboard; we invert that — chat + insights are load-bearing, the dashboard is a supporting surface.

**Business model.** Freemium — Free ($0, 2 accounts), Plus ($8/mo), Pro ($20/mo). Paywall behavior is part of the design scope.

**Six design principles** (already canonized in §1 of the Design Brief):
1. Calm over busy. No gradients, no dashboard-jazz.
2. AI is the interface, not a feature.
3. Trust through transparency — we show sources, label estimates.
4. Data-first, then decoration. Numbers are the hero.
5. Consistent across Web + iOS (shared tokens).
6. Accessibility = WCAG 2.1 AA minimum (2.2 where practical).

**Not-goals:** gamification, social feeds, leaderboards, push-notification maximization, dark patterns for upgrades.

---

## 2. Files to attach to the Claude Design session

Attach these as context, in this order of priority:

**Tier 1 — always attach:**
1. `docs/00_PROJECT_BRIEF.md` — product definition, audience, monetization tiers, feature scope.
2. `docs/04_DESIGN_BRIEF.md` — THIS IS THE MAIN REFERENCE. v1.1 covers: principles (§1), voice & tone-by-surface (§2), color system slate + violet (§3), typography, iconography, spacing, data-viz, freemium UX (§13), AI module UI (§14), tier-specific screens (§15), notifications (§16), security UI (§17), account management (§18), KPI coverage (§19). ~900 lines. **Don't skip — design must extend, not contradict, what's here.**
3. `docs/UI_BACKLOG.md` — canonical backlog of what's built vs what still needs design. P1 / P2 / P3 priorities annotated.

**Tier 2 — attach when relevant:**
4. `docs/03_ROADMAP.md` — current wave status, MVP milestones, alpha date target.
5. `docs/TASK_07_web_frontend.md` — web frontend implementation task (slice-by-slice log + what's landed).
6. `docs/TASK_02_design_system.md` — design system task history (tokens, primitives, Style Dictionary setup).

**Tier 3 — only if CD asks:**
7. `docs/DECISIONS.md` — architectural decisions (for technical constraints context).
8. `docs/PO_HANDOFF.md` — full project state handoff (use if CD needs to understand "why is X not done yet").

---

## 3. What's built, what needs design (snapshot 2026-04-21)

### ✅ Already shipped (have working UI — design can refine, not create from scratch)

- **Auth flow** — Clerk sign-in + sign-up pages (boilerplate Clerk components, light theming). Could use design polish.
- **Root redirect** — `/` → `/dashboard` for signed-in users, landing placeholder for anon.
- **Dashboard** — `PortfolioValueCardLive` + portfolio API. Single card only; needs expansion (positions snippet, allocation donut, recent activity, insight feed entry point).
- **Positions** — List + Detail with Recharts price chart + infinite transactions. Solid baseline, could refine typography density + mobile responsive behavior.
- **AI Chat** — `/chat` + `/chat/[id]` with SSE streaming, rich content blocks (ImpactCardView, CalloutView), rate-limit UI. Visually functional; "AI as primary interface" principle could be pushed harder.
- **Landing + Pricing** — `/` (anon) and `/pricing` (3 tiers). Current Landing = hero + 3 pillars + trust strip — basic. **Strong candidate for design refresh.**
- **Manual Accounts CRUD** — `/accounts` with Add/Rename/Delete. Functional, needs empty-state polish.
- **Transactions CRUD** — buy/sell/dividend on Position Detail. Functional; form dialog could be refined.
- **Design playground** — `/design` with component catalog (existing primitives rendered).

### ❌ Missing / needs design from scratch

- **`/insights` page (Slice 6a)** — AI insights exist on the backend, no UI yet. **Last MVP blocker.** Primitives `ImpactCardView` + `CalloutView` exist in `packages/ui/src/domain/` and are referenced in §14.2; need layout + interactions.
- **`/settings/*`** — profile, billing, notifications pages absent. §18 of Design Brief has requirements.
- **Paywall modal / upgrade flow** — `PaywallModal` primitive exists but paywall trigger points not wired (TD-080). §13 of Design Brief covers freemium UX.
- **Scope-cut banners** — when portfolio data is partial (X-Partial-Portfolio header from backend), user has no visual signal. Needs banner design + placement rules.
- **Global 404 / 500 / error states** — Slice 12, polish.
- **Empty states** — Dashboard-without-accounts, Positions-empty, Chat-first-session. Several already have placeholders but not systematically designed.
- **Broker connect flows (Slice 4b/4c)** — SnapTrade OAuth + Binance/Coinbase API-key connection UX. §18.2 of Design Brief.
- **Onboarding** — first-time-user walkthrough after signup. Currently: straight to empty dashboard. §15 tier-specific screens + general onboarding flow.
- **PWA install prompt, offline states** — P3 polish.
- **Marketing site polish** — landing hero, feature sections, social proof, trust strip.

### 🧊 Deliberately out of scope for now

- Mobile iOS app (Wave 4, separate repo, needs Mac + Xcode).
- Gamification, social features.

---

## 4. Suggested first design tasks (pick one to start)

**If you want to ship fast:** Slice 6a `/insights` page design. It's the last MVP blocker, primitives exist, backend data shape is known, small enough for one session.

**If you want biggest visual impact:** Landing page refresh (`/` anon variant). Current is placeholder; the "AI-native, not a dashboard" positioning isn't communicated. Premium calm-over-busy tone should come through. Could also pull from §2 voice + §3 color system for a distinctive but restrained hero.

**If you want to fix the rough edges:** Empty states pass. Dashboard-without-accounts, Positions-empty, Chat-first-message, Accounts-no-broker-connected. Applies Design Brief §13 (freemium UX) + voice §2.2 (errors tone).

**If you want strategic work:** Paywall & upgrade flow (§13). Honest-about-value principle — design the upgrade moment without dark patterns. Touches `PaywallModal`, `/pricing`, scope-cut banner copy, tier matrix.

---

## 5. Tech constraints (so design doesn't ship impossible specs)

- **Framework:** Next.js 15 App Router. Server Components default, Client Components opt-in with `'use client'`.
- **Styling:** Tailwind CSS v4 + shadcn/ui primitives (already implemented in `packages/ui/src/primitives/`). Design tokens in `packages/design-tokens/` via Style Dictionary → Tailwind config + CSS custom properties.
- **Component architecture:** `packages/ui/src/primitives/` = shadcn-style primitives (Button, Card, Dialog, Input, Dropdown, Badge, Avatar, Skeleton, Shimmer, EmptyState, PaywallModal, PlanBadge, GlobalBanner, SegmentedControl, Sheet, BellDropdown, LockedPreview, ExplainerTooltip, ChatInputPill, AskAiButton, CountUpNumber). `packages/ui/src/domain/` = app-specific (PortfolioCard, AssetRow, TransactionRow, ChatMessage, InsightCard, AccountConnectCard). `packages/ui/src/charts/` = Recharts wrappers (AreaChart, BarChart, DonutChart).
- **Icons:** lucide-react only. No custom icon fonts.
- **Animation:** restraint. `prefers-reduced-motion` respected via `useReducedMotion`. No decorative motion.
- **Breakpoints:** Tailwind defaults (sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536). Mobile-first, desktop-optimized. Mobile browser-web, not native (iOS is separate Wave 4).
- **Dark mode:** first-class support. Tokens resolved through `packages/design-tokens/tokens/semantic/{light,dark}.json`.
- **Accessibility:** WCAG 2.1 AA. Focus rings on all interactive, keyboard nav complete, never color-only signaling, contrast checked against semantic tokens.
- **Charts:** Recharts. No other chart libs.
- **Forms:** React Hook Form + Zod. Not Formik. Design layouts should assume field-level error display.
- **State:** TanStack Query for server state; React state for UI. No Redux.

---

## 6. Brand tokens cheat sheet (for quick reference)

```
Neutrals: Tailwind `slate` scale (50 → 950)
Primary accent: violet-700 #6D28D9 (hover violet-500, pressed violet-600)
Semantic:
  positive  emerald-600 (light) / emerald-400 (dark)
  negative  rose-600    (light) / rose-400    (dark)
  warning   amber-600   (light) / amber-400   (dark)
  info      sky-600     (light) / sky-400     (dark)
Portfolio gain/loss (distinct from generic positive/negative):
  gain      emerald-700 / emerald-400
  loss      rose-700    / rose-400
  neutral   slate-500
```

Use violet **sparingly** — primary CTAs, active nav, focus rings, key data-viz accent. Never for body text or large surfaces.

No gradients anywhere. No decorative chrome. No dashboard-jazz.

---

## 7. What "good" looks like

- Feels premium without being fintech-cliché (no deep-blue-and-gold, no orange-monopoly à la Robinhood).
- Numbers are the hero; typography supports them.
- AI surfaces feel conversational, data surfaces feel precise — same product, adapted register.
- A user with partial data always knows the data is partial (never silent degradation).
- Errors are calm, specific, and give a next step.
- Paywall is honest about value, no guilt-trip.
- Works at 320px mobile browser and 1920px+ desktop.
- Dark mode is not an afterthought — both modes pass the same design bar.

## 8. What to avoid

- Rainbow semantic palette (keep tokens scoped, don't add red-orange-yellow-green-blue-purple everywhere).
- Generic bank-app aesthetic (deep blue + gold + stock tickers ticking).
- AI as a sidebar widget — it's the primary interface, give it the real estate.
- Celebratory micro-interactions on every action (calm-over-busy).
- Hiding uncertainty ("your portfolio dropped 2.3%" not "NAV experienced a negative revaluation event").
- Hardcoded color values in components — always tokens.
- Copy that assumes the user knows finance jargon (beginner is the primary audience).

---

## 9. Suggested opening prompt for Claude Design

> I'm working on **Investment Tracker**, an AI-native portfolio aggregator for EU/US retail investors. Attached are:
> - `00_PROJECT_BRIEF.md` — what we're building
> - `04_DESIGN_BRIEF.md` — existing design system (extend, don't contradict)
> - `UI_BACKLOG.md` — what's built vs missing
>
> I want to design **[TASK — pick one from §4 above]**. Please:
> 1. Read the design brief first, especially §1 principles, §2 voice, §3 colors, and the relevant section for this task (§13 freemium / §14 AI UI / §15 tiers / §18 accounts).
> 2. Propose 2-3 directions before committing to one. Keep them distinct.
> 3. For the chosen direction, produce high-fidelity screens for all key states (loading, empty, populated, error, mobile at 375px, desktop at 1440px, both light + dark).
> 4. Call out any deviation from Design Brief with rationale.
> 5. Deliver component-level specs I can hand to my frontend engineer — which primitives from `packages/ui/src/primitives/` are reused vs what's new.

Done — this gives CD enough to produce concrete design work on day one.

---

_Handoff pack prepared 2026-04-21. Update as new slices ship or design system evolves._
