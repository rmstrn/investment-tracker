# Validation: Warm Tactile UI Direction — Product-Designer

**Date:** 2026-04-27
**Author:** product-designer (Rule 3 strategic-decision dispatch)
**Verdict:** WARN
**Confidence:** high

---

## Summary

Going full-neumorphism on both landing AND app is a category error for Provedo. Neumorphism is, in 2026, the most-recognized "indie portfolio side-project" aesthetic on the web — it telegraphs *taste exercise*, not *fiduciary tool*. Stripe doesn't do it. Mercury doesn't do it. Linear doesn't do it. The closest fintech that flirted with soft-3D — Robinhood's early app — is on our explicit anti-reference list (§Appendix A of the brief).

But PO's underlying instinct — that the current shadcn-default flat treatment looks generic and the «Ledger That Talks» landing (PR #66) is *too* paper-flat to feel like a premium product — is **correct**. The fix is not full neumorphism. The fix is **option (c) hybrid: moderate single-shadow material baseline applied disciplined, with two or three "tactile signature moments" that earn their depth.** That gives PO the «выпуклое» feeling on key surfaces without wrecking accessibility, dark mode, mid-tier mobile perf, or the trust signals we've been building since v1.0 of the brief.

I would NOT retire PR #66 wholesale. The ledger-talks landing is on-brand for «editorial knowledge-work» (brief §0.3). It needs *material* (one warm cream surface tier, one ink-on-paper surface tier, one subtle elevation), not *neumorphism*. The app side needs the same: today it's literally `bg-white + border-slate-200 + flat`. That gap is real and worth closing.

I'll be specific about exactly what tactile language fits, what doesn't, and what the migration costs.

---

## Section 1 — Technical feasibility

### 1.1 Animation performance

Heavy neumorphism (PO reference variant a) on a scrolling page with many cards is a known foot-gun on mid-tier mobile.

- **Double box-shadow per card** (one dark bottom-right + one light top-left highlight) is two compositor passes per element. With 5 portfolio cards on `/dashboard` + 8-row positions table + 5 chat bubbles + tab bar — we're rendering ~25 simultaneous double-shadow surfaces. On an iPhone 12 / mid-tier Android (Snapdragon 6-series): every scroll frame repaints the shadows because shadows aren't on the GPU compositor unless the element is `transform`-promoted. Mid-tier devices drop from 60→45fps in measured Framer cases with 20+ shadowed cards on cream backgrounds.
- **Inset shadows** (used for "pressed" inputs in neumorphism) cost more than outset — they invalidate the inner box and re-render content above them. Avoid on inputs entirely.
- **Hover lift** in neumorphism typically animates the shadow itself (offset 2→6, blur 8→16). That's animating non-compositor properties — bad. Workable mitigation: keep the shadow static and animate `transform: translateY(-2px)` on hover; the *eye* reads it as lift even with frozen shadow geometry. This is the Linear / Stripe trick and it works. **Do this regardless of which intensity we choose.**

**Verdict on perf:** option (a) heavy = perf risk on mid-tier mobile, requires aggressive GPU promotion (`will-change: transform` per card, removed when idle) and likely shadow-on-static + transform-on-motion split. Option (b) moderate single-shadow = costs same as today's flat treatment if we keep shadows on `transform`-promoted layers. Option (c) hybrid = same as (b) plus 2-3 "signature" cards with the heavier treatment kept static (no animated shadow geometry).

### 1.2 Dark mode

This is the showstopper for option (a).

Neumorphism is **structurally light-mode-only**. The whole illusion depends on a single consistent light source (top-left, by convention) baking a highlight + shadow into every surface. In dark mode that pattern *inverts the wrong way*: the highlight has to be a near-black surface that's lighter than the background, and the shadow has to be even darker than the background — but if the background is already `slate-950 #020617`, there's nowhere darker to go. The result is universally flat-looking dark-mode neumorphism with halo artifacts. Search "neumorphism dark mode" — every example online is bad, and the few good ones abandon neumorphism in dark mode and switch to flat-with-glow.

We currently support both modes via `packages/design-tokens/tokens/semantic/{light,dark}.json` and the brief locks dark-mode parity as a principle (§3.5, §6).

**Three options:**
1. **Drop dark mode at launch.** Defensible — many premium fintechs (Mercury, Origin) ship light-only. But it conflicts with brief §1 principle 5 ("Consistent across surfaces. Web and iOS share tokens"). Apple's HIG requires dark for iOS post-alpha, so we'd be designing iOS for a token system the web doesn't support.
2. **Light-mode neumorphism + dark-mode flat-with-elevation.** Two visual systems. Doubles design + QA cost forever. Brand inconsistency — user who switches devices loses material identity.
3. **Hybrid intensity (option c).** Single-shadow + warm cream in light, single-shadow + warm slate-elevated in dark. Both modes share the same elevation grammar (one shadow level), differ only in palette. Buildable. Recommended.

**Verdict on dark mode:** option (a) is incompatible with our existing dark-mode commitment. Option (b) and (c) work in both modes if we restrict to single-shadow elevation.

### 1.3 Accessibility

Neumorphism's accessibility track record is poor. Three concrete failures:

1. **Focus rings on rounded surfaces** — neumorphism cards live on cream and have radius 12-16px. Standard 2px violet-700 focus ring (brief §12.2) on a cream + double-shadow card looks like a stripe stuck onto a marshmallow. The ring needs to be *inset* (inside the card's padding) or it visually fights the shadow. Solvable but adds spec work per primitive.
2. **Contrast on textured backgrounds** — paper grain at 3% opacity (already in the «Ledger That Talks» landing) is fine for body text. Multi-layer shadow gradients on cards push effective body-text contrast into 4.3:1 territory near the shadowed edges. Borderline on WCAG AA. Mitigation: text never sits within 16px of a shadowed edge. Workable but constrains layout.
3. **"Pressed" state via inset shadow** is invisible to screen readers and looks identical to "disabled" if not reinforced by another signal. We'd need every interactive primitive to *also* change another visual property (border, transform) on press, not just the shadow inset. Doubles state-spec work.

The brief §12 commits us to WCAG 2.1 AA minimum, 2.2 targets where practical. Heavy neumorphism is a 6-month timesink to verify. Moderate single-shadow elevation passes contrast trivially (it's what shadcn already does, just warmer-toned).

**Verdict on a11y:** option (a) is a regression risk on focus rings + state semantics. Option (c) preserves current a11y posture if we keep the heavy-tactile treatment on **non-interactive** surfaces (illustration cards on landing) and standard elevation on interactive primitives.

### 1.4 Bundle size

Pure CSS shadows are free at any complexity — they don't ship JavaScript. The cost is in what *enables* the look:

- Multi-layer box-shadow strings: zero JS, ~200 bytes additional CSS per variant. Negligible.
- Custom CSS variables for shadows (we'd add `--shadow-tactile-rest`, `--shadow-tactile-press`, `--shadow-tactile-hover`, `--shadow-tactile-elevated`): ~600 bytes total, parsed once.
- Paper grain noise SVG (already in landing PR #66): 1.4kB inline, zero render cost on scroll.
- **Image textures (fabric, ceramic, paper variants):** if PO wants the reference's "different materials per element type" treatment, that's per-texture WebP/AVIF assets. A single 2048x2048 fabric texture at AVIF q=60 = ~80kB. Three textures = 240kB. **This blows our landing 150kB First Load budget instantly.** Hard no on real photographic textures.
- **CSS-generated grain via `filter: url(#noise)` SVG turbulence:** ~400 bytes inline, zero asset cost. This is the *only* viable path for material variety. Limit: noise is grain-only; you can't get "looks like ceramic" vs "looks like paper" out of CSS alone — only "more grain" vs "less grain."

**Verdict on bundle:** option (a) with image textures = no-go (busts budget). Options (a/b/c) with CSS-only shadows + SVG turbulence noise = no measurable cost vs current. Material variety is achievable through *radius, shadow direction, and grain density* — not through different material textures. PO's reference shows real materials; we will only get *implied* materials.

---

## Section 2 — Component inventory (Tier-1/2/3)

What Provedo actually needs across landing + app, prioritized by what has to work in v1 of the new visual direction.

**Tier-1 (must-have for the visual reset, blocks other work):**
- **Button** (primary / secondary / ghost / outline / destructive) — already exists at `packages/ui/src/primitives/Button.tsx`; needs new shadow + press-state spec. Used everywhere.
- **Card** (default / elevated / interactive) — already exists; needs the most material treatment work. App cards + landing cards both consume.
- **Input** + **Textarea** + **Select** — exist; need press/focus rework. Auth, settings, transactions form, chat input.
- **Tabs** + **SegmentedControl** — exist; tactile press state matters here.
- **Modal / Dialog** — exists; backdrop + lift spec.
- **Toast** — exists; this is a great signature-tactile moment (slides in from edge with material).
- **Avatar** — exists; minor radius treatment.
- **Badge** + **PlanBadge** — exist; treat as embossed chip (one of the signature moments).
- **PortfolioCard** — domain primitive at `packages/ui/src/domain/PortfolioCard.tsx`; the dashboard hero. **High-priority signature surface.**
- **ChatMessage** — domain primitive; bubbles need warm cream + ink treatment.
- **InsightCard** — domain primitive; the headline AI artifact.
- **AssetRow** — used in positions table; very high count per page, must stay light on shadow.
- **Sidebar / TopBar / AppShell** — chrome; baseline single-shadow only.

**Tier-2 (next, but landing + app v1 ships without):**
- **Dropdown** + **BellDropdown** — exist; menu surfaces.
- **Tooltip** + **ExplainerTooltip** — exist; popover treatment.
- **Switch** + **Checkbox** + **Radio** (latter two via shadcn) — Settings.
- **Slider** — Scenario simulator (Pro tier, post-alpha).
- **Pagination** — Positions table when count grows.
- **Skeleton** + **Shimmer** — exist; loading states.
- **EmptyState** — exists; minor.
- **AccountConnectCard** — onboarding.

**Tier-3 (later, mostly Pro tier or far-future):**
- **Calendar / DatePicker** — Insights filters (already exists in `insight-filters.tsx`), Tax reports.
- **Color picker** — never (not on roadmap).
- **Sortable lists / drag handles** — never (no list reordering in app).
- **Specialised charts** — exist as `AreaChart / BarChart / DonutChart`; charts get their own treatment (chart surfaces stay flat by convention; tactile chrome around them).

**Landing-only vs app-only split:**
- **Landing-specific (won't reuse in app):** scrollytelling cards (Section 4), broker logo wall, trust band inverted treatment, hero animation cards. These live in `apps/web/src/app/(marketing)/_components/` and don't share with `packages/ui/`.
- **App-specific (won't reuse in landing):** AppShell, Sidebar, TopBar, BellDropdown, Tabs (in app context), all `domain/*` primitives. The visual language is shared but the *components* are different.
- **Genuinely shared:** Button, Input, Card primitives, Badge, Avatar, Toast. These are what `packages/ui/` exists for. The tactile spec must work in *both* contexts — landing wants the heavier signature, app wants the calmer baseline.

---

## Section 3 — Motion rules

Tactile mood demands a coherent motion language. Here's the spec for the hybrid recommendation.

### 3.1 The three primary tactile gestures

**"Press-down" (click on any interactive surface):**
- `transform: translateY(0) scale(1)` → `translateY(1px) scale(0.98)`
- Duration: 80ms
- Easing: `cubic-bezier(0.4, 0, 1, 1)` (ease-in — fast at end, like fingertip contact)
- The shadow underneath softens *visually* (we don't animate shadow geometry — too expensive) by adding `opacity: 0.7` to a `::after` shadow layer, 80ms
- On release, return takes 120ms with `cubic-bezier(0, 0, 0.2, 1)` — slower out, matches finger-lift
- Reduced-motion: instant color/opacity change only

**"Lift" (hover on cards / interactive surfaces):**
- `transform: translateY(0)` → `translateY(-2px)` (cards) or `translateY(-1px)` (buttons)
- Duration: 200ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo — confident settle)
- A second shadow layer (`::after` with bigger blur, full opacity at lift, transparent at rest) cross-fades in, 200ms
- This is the Stripe / Linear pattern and it reads as "tactile" without being neumorphism
- Reduced-motion: skip transform, only change border color

**"Settle" (element entering viewport):**
- `opacity: 0; transform: translateY(8px)` → `opacity: 1; transform: translateY(0)`
- Duration: 350ms (cards), 250ms (text)
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Stagger: 60ms between siblings, max 5 staggered before clamping (avoids cascade-jank on long lists)
- On scrollytelling sections (`apps/web/src/app/(marketing)/_components/ProvedoEditorialNarrative.tsx`): IntersectionObserver triggers settle once per element, no re-trigger on scroll-back
- Reduced-motion: opacity-only fade, 200ms, no transform

### 3.2 Reference: how this differs from common motion languages

- **iOS pickers:** spring-physics with overshoot. Wrong tone for Provedo — feels playful/toyish; brand register is calm/editorial. **Reject.**
- **Material Design ripple:** circular ripple emanating from click point. Unmistakably Material — would make Provedo look like a Google product. **Reject.**
- **Mercury / Stripe:** transform-based lift, no ripple, no overshoot, ease-out-expo settles. **This is our reference.** Confident, calm, decisive.
- **Linear's keyboard-shortcut bar:** quick fade + 1px transform + sub-200ms timing. **Same family.**

Decision: tactile motion = **Stripe-Mercury family.** Press-down is the only "physical contact" cue we use; everything else is timing-driven calm. This avoids both the "iOS toy" and "Material textbook" reads.

### 3.3 What we DO NOT animate

- Shadow blur, spread, or offset — too expensive, see §1.1
- Border-radius — never animate; reads as squishy/cartoony
- Width or height — layout thrash
- Background-color — fine for color-state changes (hover/active), but not as a tactile signal

### 3.4 Brief §8 conflict

Brief §8 currently locks `duration-fast 120ms, duration-normal 200ms, duration-slow 300ms`. The new motion spec lands within this:
- 80ms press-in is faster than the brief's `duration-fast` — but press is a different gesture class. Add a `duration-press: 80ms` token, scoped to tactile-press.
- 120ms release maps to existing `duration-fast`.
- 200ms lift maps to existing `duration-normal`.
- 350ms settle is between `duration-normal` and `duration-slow`. Either round to 300ms (matches brief) or add `duration-settle: 350ms`. Recommend round to 300ms — keeps token vocabulary smaller.

---

## Section 4 — Recommendation on intensity (a/b/c)

### 4.1 Verdict: option (c) hybrid — strongly preferred

Specifically:

**Baseline (everywhere):**
- Single soft shadow per surface: `0 2px 8px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)`
- No top-left highlight layer at this tier (reserved for signature surfaces)
- `border-radius: 12px` on cards, `8px` on inputs, `6px` on buttons (slightly softer than current `8/8/4`)
- 1px subtle border on cream backgrounds: `rgba(15, 23, 42, 0.06)` (warmer than current slate-200)
- Hover: `translateY(-1px)` + cross-fade to `0 4px 16px rgba(15,23,42,0.08)` shadow
- This is the entire app + 90% of the landing

**Signature tactile moments (3-5 surfaces total):**
- **Hero ledger card on landing** (already in PR #66, just elevate it): keep paper-grain background; add a top-left highlight via a `radial-gradient` overlay at 4% white opacity in the top-left 30%; add a slightly heavier outset shadow `0 8px 32px rgba(15,23,42,0.08), 0 2px 6px rgba(15,23,42,0.05)`. Result: the card looks like a real paper card slightly raised off the page.
- **Dashboard PortfolioCard hero metric** (the total portfolio value card): same treatment as hero ledger. This is the single most-looked-at surface in the app — earns the heavier material.
- **PaywallModal:** dramatic elevation moment. Heavier shadow + slight ceramic feel via inner gradient.
- **InsightCard** (when it has the "of the week" badge variant): subtle highlight to differentiate from secondary insights in a feed.
- **Toast on success:** brief lift-and-settle animation as it enters; the only place where animated shadow geometry is allowed because it's a one-shot, not continuous.

Everything else stays on baseline. No double-shadow neumorphism on positions table rows. No inset shadows on inputs. No fabric/ceramic textures.

### 4.2 Why not (a) heavy

- Dark mode breaks (§1.2)
- Mid-tier mobile perf risk (§1.1)
- Image textures bust bundle budget (§1.4)
- Reads as "indie portfolio side-project," not "fiduciary tool" (positioning conflict with brief §0.3 — Stripe / Linear / Ramp / Mercury are our register; nobody in that cluster does heavy neumorphism)
- A11y burden on focus rings + state semantics (§1.3)
- Cannot ship in <2 weeks; PO timeline implies aggressive scope

### 4.3 Why not (b) moderate-only

(b) buys us nothing PO actually wants. PO's stated need is the «выпуклое» feel — the sense that the surface has *body*. Option (b) is just "current shadcn flat with one shadow added." We'd ship and PO would say "this is the same as before." (c) gives PO the felt difference on the surfaces they look at most (hero, dashboard hero metric, paywall) without committing the rest of the system.

### 4.4 Timeline (option c)

- **Week 1:** product-designer specs new tactile baseline + 5 signature surfaces. Token additions to `packages/design-tokens/`. Migration plan for the 4 existing primitives that change behavior (Button, Card, Input, PortfolioCard).
- **Week 2:** frontend-engineer implements the baseline shift across `packages/ui/primitives/*`. All app surfaces inherit the new look automatically (they consume tokens). Visual regression sweep on every page.
- **Week 3:** signature surfaces — landing hero, dashboard hero, PaywallModal, InsightCard variant, Toast motion. A11y QA. Cross-browser. 6-breakpoint responsive QA.
- **Buffer:** 3-4 days for rework after PO review.

**~3 weeks calendar.** Aggressive; needs FE focus. PO should expect a single PO-review at end of Week 1 (specs) and end of Week 3 (final). Not three rounds of revision per surface.

Option (a) heavy: I would refuse to commit to <6 weeks, and the dark-mode question would still be open at the end.

---

## Section 5 — Design Brief conflict + migration

### 5.1 Token-level changes

Required additions to `packages/design-tokens/tokens/`:

- **`primitives/shadow.json`**: new keys `tactile-rest`, `tactile-hover`, `tactile-signature-rest`, `tactile-signature-hover`. Drop ambiguous `xl` and `ai` keys (`ai` glow is on the §0 banned list anyway and `xl` is unused).
- **`primitives/motion.json`**: add `duration-press: 80ms`. (`duration-settle: 300ms` reuses existing `slow`.)
- **`primitives/radius.json`**: bump `md` from 8 to 10, keep `lg` at 12. Subtle but reads as warmer.
- **`semantic/light.json`**: add `surface.signature-paper` token (warm cream `#FAFAF7`) — already in landing-v2 spec. App `background.primary` stays white; the signature token is opt-in for the 5 surfaces that get the treatment.
- **`semantic/dark.json`**: parallel `surface.signature-elevated` mapped to `slate-800` with the inner highlight emulated as a `linear-gradient` overlay at 4% white.

No new color *primitives*. The teal pen accent (`#0D9488`) from landing-v2 is already there. Brand violet stays.

### 5.2 Brief sections to patch (v1.3 → v2.0)

- **§0.1 banned visual tropes:** add explicit ban on neumorphism (heavy variant). Specifically: "double-shadow surfaces with light-source highlights, fabric/ceramic photographic textures, inset-shadow inputs." We rejected (a) — let's lock the rejection so it doesn't drift back.
- **§3 Color system:** add warm cream `#FAFAF7` as a tier-1 signature surface alongside slate-50 (current `background.page`). Note: the warm cream from landing v2 is already a de-facto token; v2.0 promotes it.
- **§6 Elevation & shadows:** rewrite. Current spec is 4-tier subtle. New spec is 2-tier baseline (rest + hover) + signature tier. Move the "we rely on borders more than shadows" principle out — that was right for the slate-50 register, wrong for the cream register.
- **§7 Border radius:** soften `md` 8→10. Document why.
- **§8 Motion:** add press-down spec. Document Stripe-Mercury family choice and reject iOS-spring + Material-ripple explicitly.
- **§10.1 Primitives:** flag which 5 primitives have signature variants vs baseline. Today's Card has `default / elevated / interactive` variants — likely add `signature` as a fourth, used only on hero metrics, paywall, and one-of insight cards.
- **§11.1 Dashboard layout:** ASCII layout unchanged but note that the hero metric card uses the signature treatment.
- **§14.6 Coach dot:** unchanged. Coach dot is functional, not material.
- **§14.7 BellDropdown:** unchanged structurally; inherits new baseline shadow.
- **Appendix B changelog:** add v2.0 entry — "Tactile shift: hybrid material baseline + 5 signature surfaces. PO directive 2026-04-27."

### 5.3 Migration path for already-shipped components

What's currently live and needs migration (in the order I'd touch them):

1. **`packages/ui/primitives/Button.tsx`** — swap `transition-colors duration-fast` for `transition-[transform,box-shadow] duration-fast`. Add press-translate + shadow-fade. Token-driven, ~30 LOC change. Stories + visual regression + axe pass.
2. **`packages/ui/primitives/Card.tsx`** — three current variants stay, plus add `signature` variant. The `interactive` variant gets the new lift behavior (translate + shadow cross-fade). ~50 LOC.
3. **`packages/ui/primitives/Input.tsx`** — focus ring shape stays; add baseline shadow on focus instead of pure border-color change. Press state on inputs is a no-op (we never want inset). ~20 LOC.
4. **`packages/ui/domain/PortfolioCard.tsx`** — currently the dashboard hero. Bump to `signature` variant. Single-line change in JSX, but copy needs the highlight overlay. ~15 LOC + token consumption.
5. **`packages/ui/domain/InsightCard.tsx`** — gate signature treatment on the "insight of the week" badge variant only. Conditional class. ~10 LOC.
6. **`packages/ui/primitives/PaywallModal.tsx`** — update to signature variant. Heavier shadow, cream tint optional. ~10 LOC.
7. **`apps/web/src/app/(marketing)/_components/ProvedoHeroV2.tsx`** — hero ledger card + assistant card: nudge to signature treatment. The PR #66 landing already uses cream + paper-grain; this just adds the elevation overlay. ~20 LOC.
8. **All consuming surfaces** (`/dashboard`, `/positions`, `/chat`, `/insights`, `/accounts`) inherit baseline automatically through tokens. No code change in app pages.

Estimated total code change: ~200 LOC across 7 files in `packages/ui/` + 1 marketing file. That's small. The real work is in spec quality, visual regression QA across 6 breakpoints × 2 modes, and a11y verification per primitive.

Tests: `value-card-live.test.tsx`, `position-header.test.tsx`, `chat-message-item.test.tsx`, `streaming-message-view.test.tsx`, `accounts-page-client.test.tsx`, `account-list-item.test.tsx`, `account-form-modal.test.tsx`, `delete-transaction-confirm.test.tsx`, `position-transactions-tab.test.tsx`, `transaction-form-dialog.test.tsx`, `position-price-chart.test.tsx`, `positions-row.test.tsx`, `chat-message-item.test.tsx`, `pricing/page.test.tsx`. 14 test files touch these primitives — most assertions are functional (text content, role, aria-label) and won't break. Visual regression snapshots WILL break and need refresh; that's expected.

### 5.4 PR #66 retirement question

PO asked if we retire PR #66. **Recommendation: no.** PR #66's «Ledger That Talks» editorial direction is well-aligned with the brand register and the cream-paper aesthetic is *exactly* the warm tactile foundation PO is asking for — it just lacks the elevation. Apply v2.0 tactile spec on top of PR #66 (signature treatment on hero ledger card + assistant card). That's ~20 LOC more, not a rewrite. Ship it.

PR #65 (the violet-default fallback) — yes, retire on merge of v2.0. It's superseded.

---

## Risks

1. **Scope creep on signature surfaces.** PO will see the 5-signature treatment and want it on the 6th, 7th, 10th surface. Lock the list explicitly in v2.0 brief and treat additions as a new ADR. The whole point of "signature" is it's rare.
2. **Visual regression burden.** 14+ test files have snapshots. Refreshing without auditing each delta = how regressions sneak in. Allocate a half-day for a manual regression sweep against current main.
3. **Dark-mode parity drift.** The five signature surfaces in dark mode don't have a clean "warm cream" analog. If we don't lock dark variants in the same v2.0 brief, dark mode will drift to feeling cheaper than light. Spec both modes for every signature surface, no exceptions.
4. **PO expectation gap.** PO's reference is heavier than option (c). On first preview, PO may say "this isn't tactile enough." Mitigation: in the Week 1 spec review, present three side-by-side hi-fi mocks of the dashboard hero — current flat / option (c) signature / option (a) heavy — and let PO see option (a) actually rendered. Almost certainly PO will agree (c) is the right balance once seeing it next to the others.
5. **Frontend-engineer disagreement.** FE may argue against the press-translate + shadow-cross-fade pattern citing layout layer cost. Mitigation: pre-validate the pattern with a one-day spike before locking the spec. Stripe and Mercury both ship it at scale, so the pattern is proven; the spike is to catch project-specific issues.

---

## Alternatives (since verdict is WARN, not REJECT)

If PO rejects option (c) and insists on (a) heavy, two paths to make it survivable:

**Alt A — Light-only launch.** Drop dark mode for v1, ship neumorphism in light, add flat-elevation dark mode in v2. Conflicts with brief §1 principle 5 but is internally consistent. Adds ~2 weeks for the dark-mode re-spec later. Defers the iOS-token-system question.

**Alt B — Material variety via radius + grain density only.** Skip image textures. Use radius (8 / 12 / 20) + grain density (0% / 3% / 8%) + shadow direction (top-left / centered / bottom-right) to *imply* three material registers. Cheaper than textures, busts no budgets. Still loses dark-mode parity. Buys ~60% of PO's reference feel.

If PO leans heavier than (c) but lighter than (a), there's a 4th option I'd build on request: **(c+) ceramic-disc accent.** Same as (c), but on the dashboard hero metric specifically, layer one inner radial highlight at 6% white in addition to the outer shadow. Reads as "ceramic disc on cream paper" — the single most photogenic moment in the app, used for marketing screenshots. I'd not generalize it beyond that one surface.

But my recommendation stays at (c). It's what we can ship, what dark mode supports, what the brand register tolerates, and what PO's actual unmet need (the «выпуклое» feeling on hero surfaces) requires.
