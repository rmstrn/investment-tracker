# Interactive Showcase Consolidation Spec — `/design-system`

**Date:** 2026-04-29
**Author:** product-designer (dispatched by Right-Hand)
**Branch:** `chore/plugin-architecture-2026-04-29` @ `709fc05`
**Status:** Spec draft — read-only; no code changes.

PO directive (verbatim): «продолжить с /design-system.html, перенести всё нужное из /design#charts в /design-system, удалить дубль, элементы должны быть интерактивны (hover/focus/animation), реальные компоненты — никаких картинок».

This spec describes the architecture for replacing both `/design#charts` (Next.js, outdated v1.0 tokens) and `/design-system.html` (static HTML, no real components) with a single canonical Next.js route at `/design-system` mounting real React primitives + chart components, all running on locked v1.1 paper-feel surfaces with interactive hover / focus / motion demos.

---

## 1. Decision: URL strategy

**Recommendation: Next.js route at `/design-system` + permanent rewrite from `/design-system.html` → `/design-system`.**

### Rationale (vs. alternatives)

**Option A (recommended): Next.js route `/design-system` with rewrite from `.html`.**
- Real React components mount → genuine interactivity, theme toggle drives `data-theme` on `<html>` for free, Recharts components render in their actual deployment context.
- `/design-system.html` external links (PO has shared this URL during design rounds) keep working via `next.config.ts` rewrite.
- Internal links to `/design#charts` get 308-redirected to `/design-system#charts` (or just deleted with full route removal — see §4).
- Deletes both surfaces; single source of truth.
- TODO from `apps/web/public/design-system.html` line 13–17: page resets are global (`html, body { background: #0a0a0a }`) — this **breaks** if a user navigates from `/design-system.html` to anywhere else with the file still cached. Removing the .html file fixes the leak.

**Option B (rejected): Keep `/design-system.html` static + add `/design-system` Next.js route, leave both.**
- Two surfaces drift over time. PO already flagged the duplication.
- Static HTML can't import live React components → forever shows mockups, never the real product.

**Option C (rejected): Direct page handler that returns the .html file from a Next.js route.**
- Solves URL but keeps mocked DOM. Doesn't solve PO's «реальные компоненты — никаких картинок» requirement.

### Implementation (proposed for frontend-engineer)

```ts
// next.config.ts
async rewrites() {
  return [
    { source: '/design-system.html', destination: '/design-system' },
  ];
}

async redirects() {
  return [
    { source: '/design', destination: '/design-system', permanent: true },
    { source: '/design/:path*', destination: '/design-system/:path*', permanent: true },
  ];
}
```

Old `apps/web/public/design-system.html` → delete after route ships + 1-week verification window (in case PO has linked it from external memos).
Old `apps/web/src/app/design/` directory → delete entirely.

---

## 2. Page section outline

`/design-system` is a single long-scroll Next.js page with sticky in-page nav. Section order (numbered = §X anchor):

1. **§1 Foundation — Color** (light + dark, both visible side-by-side)
2. **§2 Foundation — Typography** (Geist + Geist Mono, full scale)
3. **§3 Foundation — Spacing + Radius**
4. **§4 Foundation — Depth / Shadow** (7 shadow tokens with surface samples)
5. **§5 Foundation — Motion** (durations + easings with hover-to-trigger demos)
6. **§6 Foundation — Iconography** (18-icon Lucide initial set, hover-grow demo)
7. **§7 Tier-1 Primitives** (existing 30+ from `packages/ui/src/primitives/`)
8. **§8 New Primitives — DSM-V1 launch additions** (Switch, Checkbox, Radio, Breadcrumb, StatusDot, Topbar, Citation)
9. **§9 Charts** — 10 chart kinds with live fixtures + interactive demos (only Candlestick gated)
10. **§10 Domain components** — TrustRow, ToolUseCard, CountUpNumber, ChatInputPill etc.
11. **§11 Disclaimer compliance** — TD-100 RegulatoryDisclaimer compact + verbose
12. **§12 Theme + reduced-motion testbed** — sticky toggle in header + per-section override
13. **§13 Self-test footer** — automated checks (focus-ring presence, contrast pass/fail per section)

### Sticky page-header (always visible)

```
[Provedo wordmark] [eyebrow «DESIGN SYSTEM v1.1 · LOCKED»]
                                                           [Light · Dark toggle] [Reduce motion: on/off] [Section nav ▾]
```
Theme toggle is a real Switch primitive that sets `document.documentElement.dataset.theme`. Reduced-motion toggle sets `document.documentElement.dataset.reducedMotion="true"` and the showcase-only override CSS reads it for sections where `prefers-reduced-motion` can't be simulated client-side.

---

## 3. Per-section interaction spec

### §1 Color

- **Layout:** two side-by-side stages (`.stage.light` + `.stage.dark`) like the static showcase, each with token swatches.
- **Live behavior:** swatches auto-flip when global theme toggle changes — but this section ignores the toggle, always showing both for compare. Token names render below each swatch: `--bg`, `--card`, `--inset`, `--ink`, `--text-2`, `--text-3`, `--accent`, `--terra`, `--border`, `--border-divider`.
- **Interaction:** click a swatch → copies the hex to clipboard with a toast `Copied #2D5F4E to clipboard`. Hover: card slightly lifts (`shadow-soft → shadow-card` 200ms).
- **A11y:** swatches focusable; Enter/Space triggers copy; live-region announces «Copied» for screen readers.

### §2 Typography

- **Layout:** vertical type-row stack, label-left + sample-right. Display 48 / H1 32 / H2 22 / Body 13 / Numerals 24 (tnum) / Mono 11 (uppercase).
- **Live behavior:** font samples are real Geist + Geist Mono (already self-hosted post-DSM-V1).
- **Interaction:** tabular-nums sample animates digit transitions on click — uses `<CountUpNumber>` primitive to demo `font-feature-settings: 'tnum'`. Static reference can't do this; this is a real-component-only feature.
- **A11y:** semantic `<p>` per row, no role abuse.

### §3 Spacing + Radius

- **Layout:** spacing scale as 1×N visual ladder; radius scale as 6×1 squares.
- **Interaction:** hover spacing block → tooltip shows `--spacing-N` value in px. No motion needed.

### §4 Depth / Shadow

- **Layout:** 7 surface samples — soft / card / lift / toast / input-inset / inset-light / primary-extrude — in a 7-cell grid.
- **Interaction:** hover surface → token name appears beneath in mono. Click → copies `var(--shadow-X)` reference.
- **Demo block:** primary-extrude card has a button inside; hover the button → live hover-state demo (translateY −1 → 0 on press, 100ms ease-in).

### §5 Motion

- **Layout:** two rows — durations (fast / base / slow / slower / count-up / shimmer) and easings (default / in / out / inOut / spring / exp-out).
- **Interaction:** hover a duration pill → its dot animates over the labeled duration; hover an easing pill → dot translates 24px right with that easing curve. **Reduced-motion override:** if the showcase reduced-motion toggle is on, all motion demos disable transforms — instead show a static «motion suppressed (reduced-motion active)» tag below.

### §6 Iconography (Lucide initial 18)

- **Layout:** 6×3 grid; each icon in a 56×56 inset-square frame.
- **Interaction:** hover icon → frame `var(--shadow-card)` → `var(--shadow-lift)` 200ms; icon stroke color shifts text-3 → ink. Click → copies `<{IconName} />` import snippet.
- **A11y:** icons have `aria-label` from the icon name; focusable with keyboard; Enter triggers same-as-click.

### §7 Tier-1 primitives

Existing primitives from `packages/ui/src/primitives/`. For each, render a **showcase block** with:
- Default state
- Hover state (described inline; user mouses over)
- Focus state (separate sample with `data-force-focus="true"` so screen-readers + keyboard users can see it)
- Active state (pressed sample)
- Disabled state
- Loading state (where applicable)

| Primitive | Showcase variants | Interactive demo |
|---|---|---|
| Button | primary / secondary / ghost / outline / destructive · sm/md/lg · disabled · loading | Hover → translateY-1; press → translateY+1 (extrude bounce). Focus ring on Tab. |
| Card | default / elevated / interactive | Interactive variant: hover → shadow-soft → shadow-card 200ms. |
| Input | default / focus / error / disabled · with placeholder · with help text | Type → caret + focus ring (accent-glow). Error variant: terra ring. |
| Badge | all status variants | Static; click → copies token. |
| Avatar | initials / accent / terra · with status-dot | Status-dot pulses (scale + opacity loop) — disable on reduced-motion. |
| BellDropdown | closed / open · with items | Click bell → menu opens with `slide-down + fade` 200ms; click item → toast «Selected X». |
| ChatInputPill | empty / typing / send-ready | Type → send button activates (color shift); reduced-motion: instant. |
| Dialog | trigger + open state | Click trigger → modal slides up + backdrop fades 250ms. Esc closes. Focus traps inside. |
| Dropdown | closed / open / item-hover | Standard menu interactions, focus management demo. |
| EmptyState | with icon + headline + body | Static; theme toggle reflows colors. |
| ExplainerTooltip | trigger + tooltip-open | Hover trigger → tooltip appears 300ms; arrow pointer to trigger. |
| GlobalBanner | info / warning / success · dismissable | Click X → banner slides up + height collapses 200ms. |
| LockedPreview | locked + hover-unlock-prompt | Hover → preview blur dissipates partially → click would open paywall. |
| PaywallModal | trigger + modal | Same as Dialog with paywall-specific lockup. |
| PlanBadge | Free / Plus / Pro | Static; demonstrates color hierarchy. |
| SegmentedControl | 2-segment / 3-segment / 4-segment | Click segment → indicator animates between positions 200ms ease-out. |
| Sheet | trigger + open from right | Click → sheet slides in from right; backdrop fades. |
| Shimmer + Skeleton | text-line / card / chart | Animated shimmer; reduce-motion → static muted fill. |
| SuggestedPrompt | default / hovered / pressed | Hover → background lift 150ms; click → toast «would send to chat». |
| SyncStatusBadge | synced / syncing / error | `.syncing` has 1.2s rotating glyph; `.error` has slow pulse. |
| Tabs | 3-tab + content swap | Click tab → indicator slides; content cross-fades 200ms. |
| Toast | success / warning / info · auto-dismiss | Click «trigger» button → toast slides in from top-right; auto-dismisses 4s; reduced-motion → instant + manual-close only. |
| Tooltip | trigger + tooltip | Hover → 300ms delay before show, 200ms fade. |
| ToolUseCard | streaming / complete | Streaming: cursor blinks; complete: check icon. |
| TrustRow | 3-item row | Static; verifies layout under both themes. |
| TypingCursor | streaming demo | Cursor blinks 1s loop; reduced-motion → solid block. |
| UsageIndicator | 0% / 50% / 100% / over-limit | Bar fills with 600ms ease-out animation on first paint. |
| AskAiButton | default / hovered / loading | Hover → glow ring; click → loading spinner; loaded → content swap. |
| CountUpNumber | demo with «Count to 184,210» trigger | Click trigger → digits roll 1.2s ease-out; reduce-motion → instant. |

### §8 New primitives (DSM-V1 launch additions)

Per design-system kickoff §4.2.2. Demonstrate each:

| Primitive | Spec source | Demo |
|---|---|---|
| Switch | static-showcase `.switch` lock — flat, border-driven, jade fill on active | Click → knob translates 20px; reduced-motion: instant. |
| Checkbox | static-showcase `.checkbox` — flat, jade fill + check glyph on active | Click → check fades in 150ms. |
| Radio | static-showcase `.radio` — flat, jade inner-dot 14px on active | Click between options → inner-dot scales 0→14 200ms. |
| Breadcrumb | static-showcase `.breadcrumb` — Geist Mono 10px, `>` separators, last item ink | Hover non-last item → underline; click → mock-navigates. |
| StatusDot | derive from `.pulse` + `.pulse.warn` — 12×12 disc + accent-glow ring | Variants: idle (no pulse) / live (pulse 2s loop) / warn / error. Reduced-motion: static disc. |
| Topbar | static-showcase `.topbar` — wordmark + nav-items + right-actions | Click nav-item → active style applies; live demo of «active» ink-extrude. |
| Citation | static-showcase `.citation` — inline pill with sparkle glyph | Hover citation → tooltip shows source URL preview; reduced-motion: instant tooltip. |

### §9 Charts (consolidate from `/design#charts`)

Mount the 10 production chart components from `packages/ui/src/charts/*.tsx` against fixtures from `_shared/fixtures.ts`. Each chart wrapped in the new **`ChartCard`** wrapper from chart-refinement audit §1.1 (paper-feel surface + eyebrow/title/subtitle lockup).

Per chart:
- Live render with default fixture
- Below: 3 state demonstrators (default / hover-active / focused) — second + third may be pre-set via `data-active-index` and `data-force-focus` props (already supported in chart components).
- Below states: empty / loading / error variant rendered separately
- Caption: token-mapping summary («Series: chart-series-1, axis: chart-axis-label, gridlines: chart-grid»)

Order:
1. Line · portfolio (T1) — full spec from chart-audit §4.1 + canonical hover+focus demo from chart-audit §4.1 demo block
2. Area · cumulative P&L (T1)
3. Bar · monthly P&L sign-coloring (T1)
4. Bar · drift sub-variant with FINRA caption (T1)
5. Donut · sector allocation (T1) — canonical slice-scale demo from chart-audit §4.2 demo block
6. Sparkline · 7-day trend (T1) — three variants stacked: positive / negative / flat
7. Calendar · April 2026 dividends (T1)
8. Treemap · concentration with FINRA caption (T1) — canonical tile-lighten demo from chart-audit §4.3 demo block
9. StackedBar · broker contribution (T2 lazy) — `<Suspense fallback={<ChartSkeleton kind="stacked-bar" />}>`
10. Waterfall · YTD cash-flow (T2 lazy) — same Suspense pattern
11. Candlestick · **gated section**: rendered behind a `<LockedPreview>` component overlay. Dark-tinted blur + headline «Awaiting legal sign-off · T3» + body explaining why charts.guardrails withholds it from MVP. Removes blur only when env flag `NEXT_PUBLIC_UNLOCK_CANDLESTICK=true` (post-PO greenlight).

Chart state demonstrators (one each):
- ChartSkeleton — kind=line/donut/calendar (3 examples, kind-specific shapes per audit §1.5)
- ChartEmpty — kind=line/donut/calendar (3 examples, paper-feel lockup per audit §1.6)
- ChartError — line with mocked invalid payload + «Show payload» details affordance

### §10 Domain components

Mount existing domain primitives (TrustRow, ToolUseCard, CountUpNumber, ChatInputPill, AskAiButton — these already exist in `packages/ui/src/primitives/` actually, so this section overlaps §7). Consolidate: section §10 shows them in **product context** — e.g. a mock chat bubble using ChatInputPill + ToolUseCard + Citation; a hero-card using CountUpNumber + Sparkline. Demonstrates composition, not just isolated primitives.

### §11 Disclaimer compliance (TD-100)

- Compact RegulatoryDisclaimer (1-line) example
- Verbose RegulatoryDisclaimer (multi-paragraph) example
- Per-surface placement reference table (chat reply / paywall / dashboard hero) — mirrors `docs/reviews/2026-04-29-td100-disclaimer-placement.md` summary

### §12 Theme + reduced-motion testbed

- Already covered by sticky page-header toggles (§sticky-header above).
- Adds a section-level «Refresh from current toggle» button that re-renders the whole page client-side to verify all components flipped correctly.
- Below: contrast-check panel — runs on-page contrast-ratio computation against current theme's tokens; flags failures.

### §13 Self-test footer

Renders a small panel with auto-checks:
- ☑ All interactive elements have visible focus rings (DOM scan for `:focus-visible` styles)
- ☑ All animated elements respect `prefers-reduced-motion` (DOM scan for `@media (prefers-reduced-motion: reduce)` rules)
- ☑ Both themes verified (theme toggle history)
- ☑ No console errors during render (Console-API monitor)

---

## 4. File-tree proposal

```
apps/web/src/app/
├── design-system/
│   ├── page.tsx                      ← top-level shell: header + nav + sections
│   ├── layout.tsx                    ← optional wrapper for ToastProvider only
│   ├── _components/
│   │   ├── ShowcaseHeader.tsx        ← sticky header with theme + reduced-motion toggles
│   │   ├── ShowcaseNav.tsx           ← in-page section nav
│   │   ├── PrimitiveDemo.tsx         ← shared wrapper for §7+§8 primitive blocks
│   │   ├── ChartShowcaseCard.tsx     ← real ChartCard + interaction demo wrapper for §9
│   │   ├── StateDemoGrid.tsx         ← default / hover / focus / disabled grid
│   │   └── CopyToClipboardSwatch.tsx ← reusable for §1 + §3 swatches
│   ├── _sections/
│   │   ├── 01-color.tsx
│   │   ├── 02-typography.tsx
│   │   ├── 03-spacing-radius.tsx
│   │   ├── 04-depth.tsx
│   │   ├── 05-motion.tsx
│   │   ├── 06-icons.tsx
│   │   ├── 07-primitives-existing.tsx
│   │   ├── 08-primitives-new.tsx
│   │   ├── 09-charts.tsx               ← migrates from apps/web/src/app/design/_sections/charts.tsx, upgraded
│   │   ├── 10-domain.tsx
│   │   ├── 11-disclaimer.tsx
│   │   ├── 12-theme-testbed.tsx
│   │   └── 13-self-test.tsx
│   └── _styles/
│       └── showcase-only.css         ← isolated styles ONLY for showcase demos (e.g. data-force-focus, demo grids); not part of design tokens
```

### Migration notes

- `apps/web/src/app/design/` directory → DELETE entirely (8 files: page.tsx, layout.tsx, 6 _sections files including outdated foundations.tsx with v1.0 brand-500 references).
- `apps/web/public/design-system.html` → DELETE after rewrite ships + 1-week wait.
- New section files import only from `@investment-tracker/ui` and `@investment-tracker/ui/charts`. No private re-exports.
- `_components/ShowcaseHeader.tsx` owns the theme + reduced-motion toggles and writes to `document.documentElement.dataset`.

### Estimated section file size budget

To stay under the 800-line file rule (per repo coding-style):
- Sections 01–06 (foundations): ~150 lines each → comfortable.
- Section 07 (existing primitives): split into sub-files if exceeds 800 — probable. Subdivide by category: `07a-actions.tsx` (Button + AskAiButton), `07b-surfaces.tsx` (Card + Dialog + Sheet), `07c-feedback.tsx` (Toast + Banner + Tooltip), `07d-data.tsx` (Badge + Avatar + StatusDot + Tabs), `07e-input.tsx` (Input + Switch + Checkbox + Radio + Dropdown + Segmented + ChatInput).
- Section 09 (charts): ~600 lines for 10 chart blocks + states — fits.
- Section 12+13: <200 lines combined.

---

## 5. Migration deletion list

| Path | Action | When |
|---|---|---|
| `apps/web/src/app/design/page.tsx` | DELETE | After /design-system route lands + redirect verified |
| `apps/web/src/app/design/layout.tsx` | DELETE | Same |
| `apps/web/src/app/design/_sections/charts.tsx` | DELETE (content migrated to `09-charts.tsx`) | Same |
| `apps/web/src/app/design/_sections/chat.tsx` | MIGRATE → `10-domain.tsx` (chat composition example) | Before delete |
| `apps/web/src/app/design/_sections/domain.tsx` | MIGRATE → `10-domain.tsx` | Same |
| `apps/web/src/app/design/_sections/foundations.tsx` | REWRITE entirely against v1.1 tokens — splits into `01-color.tsx` through `06-icons.tsx` | Pre-delete |
| `apps/web/src/app/design/_sections/freemium.tsx` | MIGRATE → `10-domain.tsx` (freemium-flow surfaces use existing primitives) | Pre-delete |
| `apps/web/src/app/design/_sections/primitives.tsx` | REWRITE → `07a` … `07e` + `08-primitives-new.tsx` | Pre-delete |
| `apps/web/src/app/design/_sections/shells.tsx` | MIGRATE → `10-domain.tsx` (shell layouts) | Pre-delete |
| `apps/web/public/design-system.html` | DELETE | After 1-week of rewrite-stable state |

Total surface deletions: 1 dir (8 files) + 1 static page = 9 paths removed; replaced by 1 dir (~14 files) at `/design-system/`.

---

## 6. Acceptance criteria for the consolidated `/design-system`

- [ ] Single Next.js route at `/design-system`. No duplicate static or live surface.
- [ ] `/design-system.html` URL still works (rewrite to `/design-system`); old internal `/design#charts` URL works (308 redirect).
- [ ] Every surface uses v1.1 tokens (`var(--card)`, `var(--ink)`, `var(--inset)`, `var(--accent)`, `var(--terra)`, `var(--shadow-card)` family) — zero references to legacy v1.0 tokens (`brand-500`, `slate-N`, `gradient-brand`, `background-elevated`).
- [ ] Theme toggle in header drives `document.documentElement.dataset.theme` and ALL primitives + charts auto-flip on theme change without remount.
- [ ] Reduced-motion toggle in header sets `data-reduced-motion="true"`; ALL animation-bearing components disable motion when set.
- [ ] Every interactive primitive has demonstrably visible: default / hover / focus-visible / active / disabled states.
- [ ] All 10 chart kinds render live with real Recharts / pure CSS-grid. Candlestick is gated behind LockedPreview overlay.
- [ ] Chart cards use the new ChartCard wrapper (paper-feel surface + lockup) per chart-audit §1.1+1.2.
- [ ] Empty / loading / error states for charts use v1.1 paper-feel surfaces; loading skeletons use kind-specific geometries per CHARTS_SPEC §3.10.
- [ ] Lucide initial 18-icon set rendered with hover-grow + click-to-copy.
- [ ] TD-100 disclaimer compact + verbose variants displayed.
- [ ] Self-test footer panel auto-flags any contract failures (focus-rings missing, reduced-motion not respected).
- [ ] WCAG 2.2 AA: every text-on-surface combo passes contrast check (verifiable in §12 testbed panel).
- [ ] Page `/design-system` loads under 600KB JS gzipped (charts T2/T3 lazy via Suspense).
- [ ] No regression in `apps/web/build` — type-check + lint pass.

---

## 7. Open questions for Right-Hand (max 3)

1. **Section 11 disclaimer scope** — should `/design-system` include the verbose multi-paragraph RegulatoryDisclaimer in full, or just the compact 1-liner with a «view full disclaimer» drawer? Full inline is most thorough but adds ~600px of legal text that doesn't help designers. **PD lean: drawer with verbose hidden by default; expanded only on click.**
2. **Candlestick gating UX** — when `NEXT_PUBLIC_UNLOCK_CANDLESTICK` is unset, the section renders a LockedPreview overlay. Question: should we render the chart underneath (blurred but technically present) so when the env flag flips it just works, OR fully omit the mount until the flag is true? **PD lean: omit until flag — Recharts mount + payload validation cost is non-trivial; deferred lazy-import lighter.**
3. **«реальные компоненты» strictness** — section §1 (Color) and §3 (Spacing/Radius) lend themselves to declarative swatches that aren't really «components». They show real CSS-var values from real tokens, but they're not React components in the `packages/ui` sense. Should we leave these as inline JSX (current plan), or wrap each swatch in a `<TokenChip>` primitive contributed back to `packages/ui`? **PD lean: leave inline for showcase-only; only promote to `packages/ui` if a second consumer appears (YAGNI).**

---

## 8. Out of scope / explicit non-goals

- Re-doing brand voice / copy on the showcase. Section eyebrows + headlines reuse Provedo voice (already locked by brand-strategist + content-lead).
- Adding new design tokens. This consolidation USES existing v1.1 tokens; any token-tier change is a separate ADR.
- Storybook integration. Showcase is its own surface; Storybook is a separate (potentially future) tool.
- Mobile-app showcase. iOS post-alpha; this scope is web-only.
- Generating screenshots or visual-regression baselines. Playwright visual regression is a follow-up task once the page is stable.

---

## 9. ui-ux-pro-max usage report (Part B)

Same queries as audit Part A informed this spec. Loading-indicator severity rule confirmed prioritizing kind-specific skeletons (audit §1.5 → spec §9 loading variants). Mobile-first responsive rule informed §13 self-test breakpoint coverage. Focus-states severity-HIGH rule reinforced §6 §7 §8 demonstrating focus-visible rings for every interactive primitive — already mandatory but worth cross-checking.
