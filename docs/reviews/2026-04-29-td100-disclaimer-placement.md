# TD-100 Disclaimer — placement spec

**Author:** product-designer
**Date:** 2026-04-29
**Workshop:** TD-100 page-level disclaimer (parallel dispatch with legal-advisor + content-lead)
**Status:** draft → awaiting Right-Hand synthesis

> Scope: structure / placement / visibility / responsive / interaction.
> Out of scope: regulatory text content (legal-advisor), final copy variants (content-lead).

---

## 1. Recommended placement

**Recommended: Option A (compact persistent footer-strip) for ALL `(app)` routes; Option B (soft-footer, verbose variant) for `/design`.**

### Options considered

| Opt | Pattern | Pros | Cons |
|---|---|---|---|
| **A** | **Compact persistent footer-strip** (always-visible, non-dismissable, fixed-height ~28-36px, app-shell scoped) | Lane A persistence guaranteed; predictable real-estate; one component; co-located with chrome (TopBar / Sidebar) | Eats 28-36px of vertical viewport; needs care on 320×568 mobile |
| B | Soft-footer (renders at end of `<main>`, scrolls into view) | Zero chrome cost; comfortable verbose copy | Scroll-dependent → fails «every chart screen» Lane A persistence test (M-1) |
| C | Sub-hero banner (top of page, below TopBar) | High visibility | Competes with primary action; eats hero real-estate; feels like a cookie banner |
| D | First-session modal + localStorage | Forces acknowledgement | Single-acknowledgement is **not** Lane A persistence; modal-fatigue; dismissable = drift |
| E | Combo (sticky compact + verbose `/legal/disclaimer`) | Best of A + linkable verbose | Adds a TD (TD-105) but not in this slice |

**Rationale for A:** Lane A is a regulatory floor, not a UX preference. Persistence MUST NOT depend on scroll position, browser tab focus, or single-session acknowledgement. A compact strip co-resident with the AppShell chrome is the only pattern that satisfies M-1 on a chat surface (where users may pin to a single message and never scroll), an insights dashboard (where the chart can be pinned above the fold indefinitely), or a positions page (where lazy-loaded transactions push a scroll-footer below the fold for hours of a session).

**Rationale for B on `/design`:** the showcase route is staff-only / non-production; verbose teaching copy is appropriate and persistence is irrelevant.

**The compact strip uses Combo (A+E):** the strip itself is short; a `Read full disclaimer →` link routes to `/legal/disclaimer` (a separate TD-105 candidate, not built in this slice). Content-lead specifies the short form; legal-advisor specifies the long form.

---

## 2. Per-surface placement matrix

| Route | Group | Placement | Variant size | Why |
|---|---|---|---|---|
| `/dashboard` | `(app)` | **footer-strip A** | compact | Charts always present (value-card, position-distribution, asset-allocation). Lane A required. |
| `/positions` | `(app)` | **footer-strip A** | compact | Position table + price chart. Lane A required. |
| `/positions/[id]` | `(app)` | **footer-strip A** | compact | Detail page with price-chart. Lane A required. |
| `/chat` | `(app)` | **footer-strip A** | compact | AI may render charts inline. Lane A required even for non-chart turns (consistency, M-1). |
| `/chat/[id]` | `(app)` | **footer-strip A** | compact | Same. |
| `/insights` | `(app)` | **footer-strip A** | compact | Insight cards may include charts. Lane A required. |
| `/accounts` | `(app)` | **footer-strip A** | compact | No charts today, but consistency across `(app)` shell + future-proofing for balance-history sparklines. |
| `/design` | top-level | **soft-footer B** | verbose | Staff showcase; persistence irrelevant; verbose teaches contributors. |
| `/` (landing) | `(marketing)` | NOT this disclaimer | n/a | Marketing-disclaimer is a separate concern (different copy + tone + placement); file separately. |
| `/pricing` | `(marketing)` | NOT this disclaimer | n/a | Same. |
| `/sign-in` | `(auth)` | NOT required | n/a | No chart content; no Lane A surface. |
| `/sign-up` | `(auth)` | NOT required | n/a | Same. |

**Implementation consequence:** mount the disclaimer **once** inside the `(app)` route-group layout (`apps/web/src/app/(app)/layout.tsx` → `AppShellClient`), NOT in the root `app/layout.tsx`. This automatically excludes `(marketing)`, `(auth)`, and the `/design` showcase, and gives every chart-bearing route Lane A persistence by construction.

For `/design`, mount the verbose variant inside `apps/web/src/app/design/layout.tsx` separately.

---

## 3. Visual specification

### Geometry

| Dimension | Value | Notes |
|---|---|---|
| Strip height | `clamp(28px, 5vh, 36px)` desktop; `auto` (multi-line allowed) ≤ 480px | Cap on tall viewports prevents waste; uncap on mobile prevents truncation. |
| Vertical padding | `8px` (top + bottom) | Compact; balances minimum-touch-target via the `Read more →` anchor, which sits at 44×44 effective hit-area through padding around a 14px label. |
| Horizontal padding | `clamp(16px, 4vw, 32px)` | Mobile breathing-room, desktop indent. |
| Top border | `1px solid var(--color-border-subtle)` | Separates from `<main>` content. |
| Bottom border | none on desktop; safe-area inset on iOS PWA via `env(safe-area-inset-bottom)` | Future-proofs PWA install. |
| Z-index | the strip is **not** `position: fixed` — it is the last grid-row of the AppShell grid (sits below scrollable `<main>`, always rendered). Same layout primitive as the TopBar. | Avoids fixed-position scroll jank; avoids occluding content; AppShell already uses CSS grid for chrome. |

### Tokens (design system v1.1)

| Element | Token | Notes |
|---|---|---|
| Background | `var(--color-background-secondary)` (cream-paper deep / cocoa-board deep) | Quiet contrast vs `--color-background-primary` of `<main>`. |
| Body text | `var(--color-text-tertiary)` | De-emphasized but legible. Verify ≥ 4.5:1 against `--color-background-secondary` in BOTH themes (see §6 a11y). If light mode `text-3` is the deferred `#7A7A7A` (4.06:1, fails AA per §12 open-question 6 of design system), promote to `#6E6E6E` (4.84:1) **for this surface specifically** before ship — TD-100 cannot ship with sub-4.5:1 body text. |
| `Read full disclaimer →` link | `var(--color-text-secondary)` for default; `var(--color-accent-primary)` on hover/focus | Underline on hover; 2px focus-ring `outline` per §11.5 a11y spec. |
| Border | `var(--color-border-subtle)` | Top edge only. |
| Optional icon | Lucide `Info` 14px, `currentColor`, `aria-hidden="true"` | Optional — content-lead's call whether copy needs a leading affordance. Recommend **omit** on compact variant (saves real-estate); **include** on verbose `/design` variant. |

### Typography

| Property | Value |
|---|---|
| Font | `var(--font-sans)` (Geist) |
| Size | `12px` mobile (≤ 480px); `13px` tablet; `13px` desktop. **NOT smaller than 12px.** |
| Line-height | `1.4` |
| Weight | `400` |
| Letter-spacing | default (no tracking adjustment) |
| Text alignment | left-aligned on all viewports (NOT centered — center reads as marketing/decorative; left reads as legal/structural per Refactoring UI heuristic) |

Mono is **not** used here. Geist Mono is reserved for accent-eyebrow / numerical / citation contexts per §13.

---

## 4. Responsive behaviour

| Breakpoint | Behaviour |
|---|---|
| **320px** (smallest) | Multi-line allowed. Strip auto-grows. NO horizontal scroll. NO truncation with ellipsis (regulatory text must be readable in full). `Read more →` link wraps to its own line if needed. Eats ~5-8% of vertical viewport — acceptable cost for Lane A regulatory floor. |
| **375px** (iPhone SE class) | Same as 320, more breathing room. |
| **768px** (tablet portrait) | Single-line if compact copy fits; wrap otherwise. Padding bumps to 24px horizontal. |
| **1024px** (tablet landscape / small desktop) | Single-line guaranteed for compact copy. |
| **1440px** (desktop) | Single-line. Optional `max-width: 1280px` centered if AppShell content uses container constraint (defer to AppShell — match its main-content max-width if any; otherwise full-width). |
| **1920px** (large desktop) | Same as 1440; the strip should not become absurdly wide-strung — match main-content max-width. |
| **Print stylesheet** | **DO NOT hide** (`@media print { display: block; }` explicit). Important for screenshot-as-PDF, share-as-PDF, browser print of any chart-bearing page. |

---

## 5. Theme behaviour (v1.1 §11.4)

| Theme | Background | Text | Border |
|---|---|---|---|
| `data-theme="light"` (cream-paper) | `--color-background-secondary` (deeper cream / paper-2) | `--color-text-tertiary` (verify ≥4.5:1; see §3 caveat) | `--color-border-subtle` |
| `data-theme="dark"` (cocoa-board) | `--color-background-secondary` (deeper cocoa) | `--color-text-tertiary` | `--color-border-subtle` |

- Auto-flip via CSS custom-properties (no JS resolution; no inline hex).
- Respects `prefers-color-scheme` fallback per §11.4 mechanism (`:root:not([data-theme='light'])`).
- No theme-specific markup branches in the component — pure token-driven.

---

## 6. Accessibility

| Concern | Spec |
|---|---|
| Landmark | Wrapper `role="contentinfo"` (footer landmark). If the AppShell already uses a `<footer>` slot, this disclaimer **is** that footer; do not double-stack landmarks. If no AppShell footer slot exists today, add one and put the disclaimer inside as the only child. |
| Aria-label | `aria-label="Regulatory disclaimer"` on the wrapper. Lets screen-reader users skip past or jump to. (`Lane A` is internal vocabulary; user-facing label uses plain language.) |
| Keyboard | The `Read full disclaimer →` link is the only focusable element. `Tab` order: after main content's last focusable, before any AppShell-footer-nav (none today). 2px outline + 2px offset focus-ring per §11.5. |
| Screen reader | Body text rendered as plain `<p>` — no role overrides. Link uses native `<a href="/legal/disclaimer">`; suffix `→` is decorative — wrap in `<span aria-hidden="true">` or use an icon. |
| Contrast | ≥ **4.5:1** for body text against background in BOTH themes. **Block ship** if measured below. (Concrete risk on light theme — see §3.) |
| Reduced-motion | The disclaimer **does not animate**. No fade-in on mount, no slide, no transition. Static text only. (No `prefers-reduced-motion` media query needed because there is no motion to suppress.) |
| Zoom | Survives 200% browser zoom without horizontal scroll (strip wraps to multi-line). Survives 400% per WCAG 2.2 AA. |

---

## 7. Interaction model

| Aspect | Decision |
|---|---|
| **Dismissable?** | **NO.** Lane A is structural, not preference. No close button, no «don't show again», no localStorage flag. |
| **Sticky?** | Layout-grid-pinned (last grid-row of AppShell), NOT `position: fixed`. Always present in DOM, always visible without scroll. |
| **Animations?** | None. |
| **Hover state?** | Only on the `Read full disclaimer →` link (underline + color shift). Strip body has no hover affordance. |
| **Click behaviour?** | Strip body is non-interactive. Only the link is clickable; routes to `/legal/disclaimer` (TD-105 — not built in this slice; render `404` placeholder OK for the TD-100 slice OR ship the link disabled until TD-105 lands; recommend the former — broken internal link is worse than a stub page). |
| **Locale?** | Single language at a time, follows app-locale. Multi-language toggle out of scope (i18n is a global concern, not a disclaimer concern). |
| **Tier-aware?** | No. Same disclaimer for Free / Plus / Pro. Tier-specific entitlement messaging is a different surface. |

---

## 8. Implementation hint for FE

**Component path (recommended):** `packages/ui/src/components/regulatory-disclaimer/RegulatoryDisclaimer.tsx`

**Why a UI-package component, not an inline app component:**
- Re-usable on `/design` showcase with verbose variant via prop.
- Re-usable on iOS post-alpha (same Style Dictionary tokens).
- Storybook story can document both variants (compact + verbose) and both themes (light + dark) — fits §11.5 a11y verification flow.
- Keeps app routes thin (mount only).

**API surface (FE designs final):**

```
RegulatoryDisclaimerProps:
  variant: 'compact' | 'verbose'
  bodyText: string                  // injected by content-lead's copy
  fullDisclaimerHref?: string       // default '/legal/disclaimer'; omit to hide link
  className?: string                // for AppShell grid placement override
```

**Mount points:**
- `apps/web/src/app/(app)/layout.tsx` → mount inside `AppShellClient`'s footer slot (add slot if missing) → `<RegulatoryDisclaimer variant="compact" bodyText={…} />`
- `apps/web/src/app/design/layout.tsx` → mount as soft-footer at end of `<main>` → `<RegulatoryDisclaimer variant="verbose" bodyText={…} />`

**FE coordination ask:** confirm AppShell already exposes a footer slot OR will add one in this slice. The `AppShell` primitive in `packages/ui` is the home of that change.

---

## 9. Coordination notes

- **Legal-advisor output:** drives `bodyText` prop content (the regulatory minimum). Length cap suggestion: **≤ 220 characters** for compact variant to avoid 3+ line wrap on 320px viewport. If legal needs longer, escalate — placement variant may need to flex (e.g. compact = always-visible 1-liner + always-visible link to verbose; verbose lives at `/legal/disclaimer`).
- **Content-lead output:** drives bilingual copy variants (EN / RU per app locale) and shorter/longer renderings within legal's content envelope. Variant **size** (compact / verbose) per surface is **placement-spec's call** (this doc, §2). Variant **content** is content-lead's call.
- **Variant-size handoff rule:** placement spec specifies «compact for `(app)`, verbose for `/design`». Content-lead delivers TWO renderings — compact + verbose — both passing legal-advisor's content floor.

---

## 10. Out of scope (file as separate TDs)

| TD candidate | What | Why deferred |
|---|---|---|
| **TD-105** | `/legal/disclaimer` dedicated full-text page | Verbose long-form needs legal-advisor's complete text + footnote treatment; placement spec for that page is trivial (article landmark, prose-max-width, semantic headings) but copy is heavy. |
| **TD-106** | Marketing-page disclaimer (different copy + placement on `/`, `/pricing`) | Different audience, different regulatory floor (marketing claims), different placement. Don't conflate. |
| **TD-107** | Cookie-consent banner | Overlapping but separate concern. Cookie banners answer GDPR/ePrivacy; Lane A answers investment-advice regulation. They will **stack** if both required — consider stacking order in TD-107. |
| **TD-108** | Currency / data-source / freshness disclaimer (per chart) | In-context micro-disclaimer near specific chart elements (e.g. «Prices delayed 15 min, USD»). Different UX, different surface, different copy. |
| **TD-109** | Tier-specific entitlement disclosures (Free vs Plus vs Pro) | Tier-aware surfaces have their own disclosure needs (e.g. «Free users see 30-day history only»). Not Lane A. |

---

## 11. Top design concerns surfaced

1. **Mobile vertical real-estate.** 28-36px strip on a 568px iPhone-SE viewport is ~5-8%. Acceptable for Lane A but tightens the value-card / chart hero geometry. **Action:** when FE ports value-card to v1.1, verify above-the-fold composition still works at 320×568 with the strip mounted. Visual-regression test required at that viewport.

2. **Light-mode text-3 contrast.** Design-system v1.1 §12 open-question 6 explicitly notes `text.3 #7A7A7A` fails body AA at 4.06:1 (vs 4.5:1 minimum). **TD-100 cannot ship with that token unmitigated.** Promote to `#6E6E6E` (4.84:1) BEFORE TD-100 ships, OR use `--color-text-secondary` for the disclaimer body specifically.

3. **AppShell footer slot.** May not exist today (only TopBar + Sidebar are wired in `app-shell-client.tsx`). FE slice must add the slot. Estimate: trivial for an experienced FE — confirm with frontend-engineer during synthesis.

---

## 12. Acceptance summary

- [ ] Single component `RegulatoryDisclaimer` in `packages/ui` with `compact` + `verbose` variants
- [ ] Mounted ONCE in `(app)` route-group layout → covers 7 chart-bearing routes
- [ ] Mounted in `/design` layout → verbose variant
- [ ] NOT mounted in `(marketing)`, `(auth)`, root layout
- [ ] Token-driven (no inline hex); auto-themes via `data-theme`
- [ ] WCAG 2.2 AA contrast verified BOTH themes (block ship if `text-3` contrast fix not landed)
- [ ] Print-visible
- [ ] Responsive 320 / 375 / 768 / 1024 / 1440 / 1920 — no overflow, no truncation
- [ ] No animation; no dismissal; non-interactive body; single focusable link
- [ ] `role="contentinfo"` + `aria-label="Regulatory disclaimer"`
- [ ] Storybook stories: compact-light, compact-dark, verbose-light, verbose-dark, compact-mobile-320
- [ ] Visual-regression snapshot pair per theme
- [ ] Coordinated with legal-advisor (content) + content-lead (copy variants)

---

## 13. Open questions for Right-Hand to weigh during synthesis

1. **Locale switching.** App-locale is currently `en` only. When RU lands, does the disclaimer copy switch atomically with locale? (Recommend: yes — content-lead provides both, switch is mechanical via app-locale.)
2. **`/legal/disclaimer` link target.** Ship TD-100 with link to a stub page (TD-105 next), OR ship with link disabled until TD-105 lands? (Recommend: stub page — broken-feeling link erodes trust more than a stub.)
3. **Tooltip on `Info` icon.** If verbose variant uses Lucide `Info`, should it carry a tooltip with summary text? (Recommend: no — verbose variant has the text itself; tooltip duplicates.)
4. **Future iOS surface.** Same component vocabulary applies (Style Dictionary cross-platform). No spec-divergence risk now; flag for post-alpha.
