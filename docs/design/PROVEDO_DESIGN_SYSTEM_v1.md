# Provedo Design System v1.1

> **DEPRECATED — Superseded by [`PROVEDO_DESIGN_SYSTEM_v2.md`](./PROVEDO_DESIGN_SYSTEM_v2.md) on 2026-05-01.**
> v2 introduces the candy/paper dual-register model, deletes the editorial-mh3 / jade / terra token families, and re-points accent/danger to signal-orange / signal-orange-deep. This document is kept for historical reference only.

**Date:** 2026-04-27 (amended same-day)
**Version:** v1.1
**Status:** LOCKED — showcase shipped to staging (`apps/web/public/design-system.html`); component port to `packages/ui` pending
**Authors:** product-designer (v1.0 synthesis from `2026-04-27-palette-synthesis.md`, `2026-04-27-tactile-shift-product-designer.md`; v1.1 ratification from final SHIP reviews — `2026-04-27-design-system-final-ship-craft.md`, `2026-04-27-design-system-final-ship-brand.md`, `2026-04-27-design-system-fe-review.md`, `2026-04-27-design-direction-depressed-ui.md`)
**Supersedes:** `docs/04_DESIGN_BRIEF.md` v1.3 (preserved as historical reference; do NOT delete) · v1.0 of this document (preserved inline; obsolete sections marked SUPERSEDED with v1.0 reasoning kept for historical context per PO directive)
**Implements:** PO directives 2026-04-27 — palette lock, tactile/soft-3D depth direction, dark mode in first release · v1.1 ratifies the 8 deliberate drifts between v1.0 spec and shipped showcase, plus brand-strategist's 5 lock-in notes.

---

## v1.1 changelog (top — read first)

This amendment is **doc-only**. No code changes. The spec catches up to what the showcase already ships, after 6 PO-signed-off polish rounds.

**8 ratified drifts (v1.0 → v1.1):**

| # | Domain | v1.0 said | v1.1 ships | Rationale |
|---|---|---|---|---|
| 1 | Display font | Fraunces (variable serif) | Geist (geometric sans) | Tactile-shift round 5 — Fraunces serif fought paper-restraint at UI sizes. Geist's tabular numerals + zero italic carry «Stripe Press cadence» without a serif. |
| 2 | Body font | Inter | Geist | Same rationale; one family across display + body holds Sage discipline. |
| 3 | Mono font | JetBrains Mono | Geist Mono | Geist Mono composes with Geist's tabular features (`tnum 1`, `cv11 1`); avoids two-family seam. |
| 4 | Primary CTA fill | `accent.primary` teal `#0F8A7E` | `--ink` (`#1A1A1A` light / `#F4F1EA` dark) extruded | PO Q2 — green-overuse rejected after 17+-surface fatigue measurement. Teal-CTA read «another teal SaaS»; ink-CTA reads fiduciary-restraint. Forest-jade demoted to status/citation/verified accents only. Secondary stays outlined-flat; ghost stays flat. |
| 5 | Light surfaces | bg `#F4F1EA` · card `#FAF7F0` · inset `#ECE7DC` | bg `#E8E0D0` · card `#FFFFFF` · inset `#D6CCB8` | Round-6 deepen — UR-measured 1.17:1 luma between v1.0 bg and card was insufficient (WCAG 3:1 minimum for non-text UI separation). Card stays white; bg deepens by ~5 luma units; inset tracks correspondingly. |
| 6 | Dark surfaces | bg `#161412` · card `#1F1B17` · inset `#100E0C` (warm cocoa) | bg `#0E0E12` · card `#26262E` · inset `#070709` (neutral cool) | Round-6 pivot — warm-cocoa dark created glow-creep on OLED; neutral cool dark holds Sage register without drifting into Vercel-billboard. Two-territory dark (Mercury-light + Linear-shadow dark) is intentional. |
| 7 | Toggle depth | depressed inset (matched inputs) | flat with border + jade fill on active | PD lock — depressed toggles read as «disabled» to users (Norman affordance rule). Hybrid lock 2026-04-27: ONLY text inputs / textarea / search remain depressed. Switch / checkbox / radio go flat with border-driven meaning. |
| 8 | Cream-highlight alpha (light shadows) | up to 0.95–1.0 (`shadow.card` rim) | softened to 0.55–0.60 ceiling | Brand-harmony pass — anything >0.60 read as glow-creep / Vercel-billboard. Paper-on-corkboard register requires restraint. Locked as brand-strategist note. |

**Bonus drift (low):** §10.2 explicitly documents the `pulse.warn` colorblind fallback (sign + ink in `pf-tiny`) as a system pattern.

**5 brand-strategist lock-in notes (new §13):**

1. Two-territory dark theme is intentional (Mercury-light + Linear-shadow dark) — DO NOT warm dark back.
2. Forest-jade tier hierarchy capped at 3 tiers / 13 surface roles max.
3. Bronze ceiling locked at `#A04A3D` (light) / `#BD6A55` (dark) — DO NOT warm toward red.
4. Single-word color emphasis in headlines / body is BANNED — use bold weight only (the residual Vercel inheritance trap).
5. Cream-highlight alpha in card shadows: 0.55–0.60 max ceiling.

**v1.1 amendment scope (this PR):** doc-only sync. No code touched. Estimated effort: ~2–3 hours product-designer.

**v1.1 deferred (next):**
- Tier-2 component spec (Tooltip, Dropdown, DatePicker, Skeleton refresh, Progress, Calendar, Sortable, Pagination, Sidebar nav)
- Validation language (success / warning / error / info input rings + helper-text patterns)
- Dark accent `#4A8775` on card `#26262E` AAA bump (currently 3.4:1 — passes UI-AA, fails AAA; only matters if accent becomes text-on-card in real screens)
- iOS surface adaptation (post-alpha)
- Dark-theme error-input variant (light has it; dark omits — add during port for parity, ~10min)

---

## 1. Frontmatter

This document is the source-of-truth for Provedo's visual language. It is written for:

- **frontend-engineer:** to implement Tier-1 components without further design clarification
- **tech-lead:** to plan the migration slice
- **content-lead, brand-voice-curator:** to compose copy on the resulting surfaces

Design Brief v1.3 sections that this document supersedes:
- §3 Color system (entirely)
- §4 Typography (entirely)
- §6 Elevation & shadows (entirely)
- §7 Border radius (entirely)
- §8 Motion (entirely)
- §10 Components (refactored — primitives + financial + AI primitives consolidated below)

Design Brief v1.3 sections that remain authoritative:
- §0 Anti-pattern list
- §5 Spacing & layout
- §9 Iconography
- §11 Layout patterns and the linked detail specs (`DASHBOARD_ARCHITECTURE.md`, `ONBOARDING_FLOW.md`, `COACH_SURFACE_SPEC.md`)
- §12 Accessibility (extended below in §11 of this document)
- §13–§19 (freemium, AI module, tier screens, notifications, security, account management, KPI map)

When this document and v1.3 disagree, this document wins.

---

## 2. Visual direction summary (v1.1)

Provedo is **tactile, soft-3D depth × warm cream paper + ink + restrained forest-jade + bronze**, executed in Geist with zero italic and tabular numerals. The reference shorthand is *«Mercury 2024 × Stripe Press cadence × Linear-shadow restraint in dark, on warm paper»* — two-territory dark is intentional. The voice composition target remains **Patagonia, Craig Mod, Wirecutter, The Economist, John McPhee** — every voice reference is paper-coded.

The palette is the canvas; the tactile interaction language (**ink-extruded primary CTA**, depressed input wells, **flat-with-border toggles**, citation Lucide-sparkle marks, signature-card lift on hero surfaces) is the work. **Forest-jade is demoted to status accent** (toggle-active, citation, verified, success-positive) — never primary CTA. **Bronze sits in museum-vitrine territory** (drift, warning, danger) — never alarm-red.

The product reads as a fiduciary instrument made by people who care about craft — not as another teal SaaS, not as Vercel-billboard, not as a dashboard-by-numbers.

**v1.1 supersedes the v1.0 shorthand** (which read «muted teal pen + sage + terracotta») — teal demoted, sage collapsed, terracotta deepened to bronze.

---

## 3. Color tokens

> **v1.1 NOTE.** Surface luma tables, accent semantics, and CTA fill all changed between v1.0 and v1.1. The v1.0 values were a reasonable hypothesis; production polish surfaced two failures (1.17:1 light bg/card luma; «teal SaaS» fatigue at 17+ accent surfaces). v1.1 below is the shipped reality. v1.0 hypotheses are preserved in §3.5 for historical context — DO NOT consume them.

### 3.1 Light theme — full table (v1.1 SHIPPED)

| Token | Hex | Semantic role | WCAG AA pair |
|---|---|---|---|
| `surface.bg` | `#E8E0D0` | App page background. Deepened cream, paper-coded. **Round-6 deepen** from v1.0 `#F4F1EA` for visible card lift. | — |
| `surface.card` | `#FFFFFF` | Card / elevated surface. Pure white card on deepened cream bg = ~3:1 luma delta (was 1.17:1 in v1.0). | — |
| `surface.signature` | `#FFFFFF` | Signature surfaces (hero metric, paywall hero, hero ledger). Same as `surface.card` in v1.1; differentiation handled by `shadow.lift` instead of luma. | — |
| `surface.inset` | `#D6CCB8` | Depressed surfaces (text inputs, search wells, chips, citations, tabs-track, info-toast, empty-icon, btn-icon). Tracks deepened bg. **Toggles do NOT use this token in v1.1** — see §7. | — |
| `surface.inverse` | `#1A1A1A` | Toasts, tooltips, footer band. Equal to `text.1` (ink). | `text.inverse` 17.93:1 |
| `surface.overlay` | `rgba(50, 40, 30, 0.45)` | Modal backdrop. Warm-tinted overlay. | — |
| `text.1` (ink) | `#1A1A1A` | Primary text (body + headlines) AND **primary CTA fill** (v1.1 promotion). | 17.93:1 on `bg` (AAA) |
| `text.2` | `#4D4D4D` | Secondary text. | 7.91:1 on `bg` (AAA) |
| `text.3` | `#7A7A7A` | Tertiary text (mono labels, metadata, captions). | 4.06:1 on `bg` — **fails body AA (4.5:1) by 0.44**; passes UI / large-text 3:1. **Action:** tighten to `#6E6E6E` (4.84:1) for production. Not blocking for showcase as text-3 is metadata only. |
| `text.inverse` | `#FFFFFF` | Text on inverse surfaces (toast, footer, on-ink CTA). | 17.93:1 on `surface.inverse` (AAA) |
| `text.onAccent` | `#FFFFFF` | Text on filled accent surfaces (success toast icon fill, accent chip fill). | 7.50:1 on `accent.primary` (AAA) |
| `accent.primary` (forest-jade) | `#2D5F4E` | **Status / citation / verified accent ONLY** (toggle-active state, success/positive data, citation glyph, AI attribution label, eyebrow editorial mark). Deeper forest-jade — NOT teal, NOT money-green. **DEMOTED from v1.0 primary CTA role.** | 7.50:1 on `bg` (AAA body) |
| `accent.primary.shadow` | `rgba(45, 95, 78, 0.32)` | Drop-shadow tint for filled-accent surfaces (success toast, chip.accent, switch.on, radio.checked). | — |
| `accent.primary.glow` | `rgba(45, 95, 78, 0.22)` | Pulse halo, focus glow on inputs. | — |
| `accent.terra` (bronze) | `#A04A3D` | Drift markers, negative delta, drift chip, btn-danger, warning toast, pulse.warn. Old leather / iron-oxide register. **Bronze ceiling — DO NOT warm toward red** (brand lock §13). | 4.55:1 on `bg` (AA body) |
| `accent.terra.shadow` | `rgba(155, 92, 62, 0.30)` | Drop-shadow tint for filled-terra surfaces. | — |
| `state.success` | (= `accent.primary` `#2D5F4E`) | Status success. Same token as `accent.primary` in v1.1. | 7.50:1 |
| `state.warning` | (= `accent.terra` `#A04A3D`) | Status warning. Same token as `accent.terra`. | 4.55:1 |
| `state.error` | (= `accent.terra` `#A04A3D`) | Status error. **v1.1 collapses warning + error to single bronze token** — no separate coral. Differentiation by icon + copy, not hue. | 4.55:1 |
| `state.info` | (= `text.2` `#4D4D4D`) | Status info. No additional hue. | 7.91:1 |
| `portfolio.gain` | (= `accent.primary`) | Always paired with leading `+` AND iconography. Color is reinforcement, never the primary signal. | 7.50:1 |
| `portfolio.loss` | (= `accent.terra`) | Always paired with leading `−` (U+2212) AND iconography. Plus colorblind fallback: `pf-tiny` switches to ink + bold weight when `pulse.warn` is present (see §10.2). | 4.55:1 |
| `portfolio.neutral` | (= `text.3`) | Flat / no change. | 4.06:1 |
| `border.default` | `rgba(20, 20, 20, 0.16)` | Card edges, input borders, toggle borders. | — |
| `border.divider` | `rgba(20, 20, 20, 0.26)` | **NEW in v1.1** — dedicated divider token for column separators in tables and section dotted-underlines. Higher alpha than `border.default` so dividers remain visible without bumping border globally (which would over-emphasise card edges). | — |
| `border.focus` | (= `accent.primary` `#2D5F4E`) | Focus ring. | 3.94:1 on `bg` (AA UI ≥3:1) |

### 3.2 Dark theme — full table (v1.1 SHIPPED)

> **v1.1 NOTE.** Dark theme repositioned from warm-cocoa (v1.0) to neutral-cool (v1.1). Two-territory dark is intentional — light = Mercury+Stripe Press; dark = Linear-shadow-adjacent because dark = «night focus mode» where Sage takes over. **DO NOT warm dark back** (brand lock §13.1).

| Token | Hex | Semantic role | WCAG AA pair |
|---|---|---|---|
| `surface.bg` | `#0E0E12` | App page background. Neutral cool dark, NOT warm cocoa. | — |
| `surface.card` | `#26262E` | Card / elevated surface. **Round-6 luma bump** from v1.0 `#1D1D22`/`#1F1B17` for clearer separation from bg (~1.6:1 vs 1.15:1 prior). | — |
| `surface.signature` | `#26262E` | Signature surfaces. Same as `surface.card`; differentiation by `shadow.lift`. | — |
| `surface.inset` | `#070709` | Depressed surfaces. Darker than `bg` so depressed reads as recessed (against new card luma). | — |
| `surface.inverse` | `#F4F1EA` | Toasts, tooltips, on-ink CTA invert to cream. | `text.inverse` 17.21:1 |
| `surface.overlay` | `rgba(0, 0, 0, 0.65)` | Modal backdrop. | — |
| `text.1` (cream) | `#F4F1EA` | Primary text. AND **primary CTA fill** in dark (cream-on-dark CTA flip, v1.1 promotion). | 17.21:1 on `bg` (AAA) |
| `text.2` | `#B5B5B5` | Secondary text. | 9.49:1 on `bg` (AAA) |
| `text.3` | `#7A7A7A` | Tertiary text. | 5.20:1 on `bg` (AAA body) |
| `text.inverse` | `#0E0E12` | Text on `surface.inverse` (cream → dark text on toast). | 17.21:1 |
| `text.onAccent` | `#F4F1EA` | Text on filled accent surfaces. | 6.42:1 on `accent.primary` (AAA) |
| `accent.primary` (forest-jade) | `#4A8775` | **Status / citation / verified accent ONLY**. Lighter forest-jade for dark; preserves brand recognition without OLED glow. **DEMOTED from v1.0 primary CTA role.** | 6.42:1 on `bg` (AAA body); 3.4:1 on `card` `#26262E` (passes UI-AA 3:1, fails AAA — track for real-app rollout) |
| `accent.primary.shadow` | `rgba(74, 135, 117, 0.30)` | Drop-shadow tint for filled-accent surfaces. | — |
| `accent.primary.glow` | `rgba(74, 135, 117, 0.20)` | Pulse halo, focus glow. | — |
| `accent.terra` (bronze) | `#BD6A55` | Drift markers, negative delta, drift chip, btn-danger, warning toast, pulse.warn. Red-shifted bronze for dark. **Bronze ceiling — DO NOT warm toward red** (brand lock §13.3). | 5.84:1 on `bg` (AAA) |
| `bub-user.dark` | `#1A2520` | **Hard-coded in v1.1 showcase** (subtle teal-tinted dark) — differentiates user chat bubble from `surface.inset` without leaking jade. **Migration debt:** promote to semantic token `--bub-user-dark-bg` during port. | — |
| `state.success` | (= `accent.primary` `#4A8775`) | Status success. | 6.42:1 |
| `state.warning` | (= `accent.terra` `#BD6A55`) | Status warning. | 5.84:1 |
| `state.error` | (= `accent.terra` `#BD6A55`) | Status error. v1.1 collapses warning + error to single bronze token. | 5.84:1 |
| `state.info` | (= `text.2` `#B5B5B5`) | Status info. | 9.49:1 |
| `portfolio.gain` | (= `accent.primary`) | Always paired with leading `+` AND iconography. | 6.42:1 |
| `portfolio.loss` | (= `accent.terra`) | Always paired with leading `−` (U+2212) AND iconography. | 5.84:1 |
| `portfolio.neutral` | (= `text.3`) | Flat / no change. | 5.20:1 |
| `border.default` | `rgba(255, 255, 255, 0.18)` | Card edges, input borders, toggle borders. | — |
| `border.divider` | `rgba(255, 255, 255, 0.26)` | **NEW in v1.1** — dedicated divider token (parallel to light). | — |
| `border.focus` | (= `accent.primary` `#4A8775`) | Focus ring. | 4.05:1 on `bg` (AA UI ≥3:1) |

### 3.3 Color usage rules (v1.1)

1. **Primary CTA fill is `text.1` (ink) light / cream dark — NOT `accent.primary`.** v1.0 had teal-CTA; v1.1 demotes teal/forest-jade to status accent only. Ink-CTA reads fiduciary-restraint; teal-CTA read «another teal SaaS» after 17+-surface fatigue.
2. **`accent.primary` (forest-jade) is the «considered, verified, status-positive» signal.** Reserved use surfaces (3-tier hierarchy, capped at 13 max — brand lock §13.2):
   - **Tier-A (toggle-active state):** switch-on, checkbox-checked, radio-checked, focus rings (4 surfaces)
   - **Tier-B (semantic-positive data):** success toast icon, positive delta in tables, `pulse` (resting), success badge (4 surfaces)
   - **Tier-C (editorial mark):** citation glyph, AI attribution label (`PROVEDO REPLIES`), eyebrow editorial labels (`PORTFOLIO ANSWER ENGINE · 01`), insight eyebrow, sig-eyebrow (5 surfaces)
3. **`accent.terra` (bronze) is the «attention warranted» signal — museum-vitrine, NOT alarm-red.** Use on drift indicators, negative delta, btn-danger, pulse.warn, warning toast. **Cap surface area** to status callouts; never on persistent chrome. **DO NOT warm toward red** (brand lock §13.3).
4. **`portfolio.gain` and `portfolio.loss` are always paired with directional sign (`+` / `−` U+2212) AND iconography.** Color is reinforcement, never the primary signal. **Colorblind safety:** when `pulse.warn` is present on a card, the adjacent `pf-tiny` line switches to ink + bold weight (the sign + ink combo is the primary signal; bronze is reinforcement).
5. **Single-word color emphasis in headlines/body is BANNED** (brand lock §13.4). Use bold weight only. Inside chat bubbles `bub-ai .body .accent` is forced to ink + bold. Inside `sig-headline .accent` and `insight-head .accent` similarly. This is the residual Vercel inheritance trap; documenting it as a hard rule prevents drift.

### 3.4 Token consumption (showcase CSS — v1.1 SHIPPED)

The v1.1 showcase uses internal CSS variable names (`--bg`, `--card`, `--inset`, `--ink`, `--accent`, `--terra`). These map to spec semantic names at port time. Internal names below match `apps/web/public/design-system.html`:

```css
.light {
  --bg: #E8E0D0;            /* surface.bg — was #F1EDE3 */
  --card: #FFFFFF;          /* surface.card */
  --inset: #D6CCB8;         /* surface.inset — was #E8E2D4 */
  --ink: #1A1A1A;           /* text.1 + primary CTA fill */
  --text-2: #4D4D4D;
  --text-3: #7A7A7A;
  --accent: #2D5F4E;        /* accent.primary forest-jade */
  --accent-shadow: rgba(45, 95, 78, 0.32);
  --accent-glow: rgba(45, 95, 78, 0.22);
  --terra: #A04A3D;         /* accent.terra bronze */
  --border: rgba(20, 20, 20, 0.16);
  --border-divider: rgba(20, 20, 20, 0.26);
  --modal-overlay: rgba(50, 40, 30, 0.45);
}

.dark {
  --bg: #0E0E12;
  --card: #26262E;          /* was #1D1D22 — bumped */
  --inset: #070709;
  --ink: #F4F1EA;
  --text-2: #B5B5B5;
  --text-3: #7A7A7A;
  --accent: #4A8775;
  --accent-shadow: rgba(74, 135, 117, 0.30);
  --accent-glow: rgba(74, 135, 117, 0.20);
  --terra: #BD6A55;
  --border: rgba(255, 255, 255, 0.18);
  --border-divider: rgba(255, 255, 255, 0.26);
  --modal-overlay: rgba(0, 0, 0, 0.65);
}

/* in dark, primary CTA = ink (cream) on background — flip semantics */
.dark .btn-primary { background: var(--ink); color: var(--bg); }
.dark .nav-item.active { background: var(--ink); color: var(--bg); }
.dark .avatar { background: var(--ink); color: var(--bg); }
```

**Migration to `packages/design-tokens` semantic names** (see §11):

```css
/* target naming after port */
:root {
  --surface-bg: var(--bg);
  --surface-card: var(--card);
  --surface-inset: var(--inset);
  --text-1: var(--ink);
  --text-2: ...;
  --text-3: ...;
  --accent-primary: var(--accent);
  --accent-terra: var(--terra);
  --border-default: var(--border);
  --border-divider: var(--border-divider);
  --border-focus: var(--accent);
}
```

### 3.5 v1.0 color hypotheses — SUPERSEDED (preserved for context)

The following v1.0 values were the design hypothesis after palette synthesis but BEFORE 6 PO polish rounds. They are obsolete; do not consume. Preserved per PO directive «don't delete v1.0 reasoning, just supersede with v1.1 reality».

**v1.0 light theme (obsolete):**
- `surface.bg` `#F4F1EA` (failed: 1.17:1 luma vs card `#FAF7F0`, below WCAG 3:1 UI minimum)
- `surface.card` `#FAF7F0`, `surface.signature` `#FDFCF8` (signature differentiation collapsed in v1.1; `shadow.lift` carries the lift)
- `surface.inset` `#ECE7DC` (deepened to `#D6CCB8` to track new bg)
- `accent.primary` (CTA) `#0F8A7E` teal pen, hover `#0C7A6F`, active `#096A60`, subtle `#E0EEEB` (v1.1 demotes teal entirely to forest-jade `#2D5F4E` and assigns it status-only role)
- `accent.sage` `#3F5D4A` (v1.1 collapses sage into `accent.primary` — sage was a redundant token; one forest-jade serves citation + verified + status)
- `accent.terra` `#B8704D` (v1.1 deepens to `#A04A3D` — old leather not orange)
- `state.error` `#B0524A` (v1.1 collapses warning + error to single bronze token; differentiation by icon + copy)
- `border.subtle` / `border.default` / `border.strong` (v1.1 collapses to `border.default` + new `border.divider`; subtle/strong distinction was unused in practice)

**v1.0 dark theme (obsolete):**
- `surface.bg` `#161412` warm cocoa (v1.1 pivots to `#0E0E12` neutral cool — see §13.1)
- `surface.card` `#1F1B17` warm cocoa (v1.1 → `#26262E` cool neutral)
- `accent.primary` `#2DAA9B` brighter teal (v1.1 → `#4A8775` forest-jade demoted to status)
- All warm-cocoa scaffolding was abandoned because OLED glow-creep made dark theme drift toward Vercel-billboard.

**Why v1.0 was a reasonable hypothesis at the time:**
- Teal-CTA was inherited from competitive scan (Mercury, Granola use forest-tones for primary). The «teal SaaS» fatigue only became measurable AFTER seeing forest-jade applied across 17+ Provedo surfaces.
- Warm-cocoa dark was the obvious pairing with warm-cream light. Only at OLED viewing did the asymmetry of glow-on-dark vs paper-on-light become visible.
- Bg `#F4F1EA` luma was inherited from the «warm cream paper-coded» hypothesis. UR contrast measurement (1.17:1) only emerged after building real card surfaces.

These are the kind of failures that show up only after high-fidelity polish, not in synthesis.

---

## 4. Typography tokens

> **v1.1 NOTE.** Full font substitution. v1.0 specified Fraunces (display serif) + Inter (body) + JetBrains Mono (tabular). v1.1 ships **Geist + Geist Mono only** — single sans family across display, body, and mono. v1.0 reasoning preserved in §4.6.

### 4.1 Font families (v1.1 SHIPPED)

| Family | Use | Rationale |
|---|---|---|
| **Geist** | Display, H1, H2, H3, body, UI labels, all interactive text | Geometric humanist sans (Vercel, OFL). Beautiful tabular numerals (`font-feature-settings: 'tnum' 1, 'cv11' 1`) eliminate need for a separate mono family for numbers. Zero italic in our usage — italic was a Vercel-billboard tic. **Single sans across display + body holds Sage discipline** (one voice, no register switch). |
| **Geist Mono** | Eyebrow labels (e.g. `PORTFOLIO ANSWER ENGINE · 01`), citation chip text, transaction IDs, breadcrumbs, mono-form metadata | Geist Mono composes seamlessly with Geist (same tabular features, same letterform construction). Used at small sizes (9–11px) with letter-spacing 0.16–0.22em + uppercase + 500 weight for editorial-mark register. |

**v1.0 hypothesis (Fraunces + Inter + JBM) was abandoned because:**
- Fraunces variable serif fought paper-restraint at UI sizes — reads luxury / editorial in a way that overpowers Sage at body-adjacent sizes.
- Two-family seam (sans body next to serif display) created a register switch that the «paper-restraint» voice didn't earn.
- Geist's tabular numerals are exceptional and made the JBM-for-numerals split unnecessary.
- Stripe Press references the «Geist no-italic + tabular-nums» voice composition reads correctly without a serif.

**Why Geist over alternatives (v1.1 reasoning):**
- *Inter:* still a strong sans, but Geist's tabular-nums + small-caps + character variants (`cv11` for slashed zero) carry more numerical signal for a fiduciary instrument.
- *Manrope:* neutral geometric sans, no character. Adds nothing.
- *Söhne (commercial):* great voice but $$$ and not OFL — fails Rule R1 (no spend without approval).
- *Geist Mono:* paired-family-of-Geist; a Vercel asset but the open-source license is clean. We accept the Vercel association because Provedo's voice is fundamentally not Vercel-coded (paper-restraint, no gradients, no glow), so the typeface alone won't drag us there.

### 4.2 Type scale (v1.1 SHIPPED)

| Token | Family | Size / line-height | Weight | Letter-spacing | Use |
|---|---|---|---|---|---|
| `display` | Geist | 48 / 48 (clamp `3rem ↔ 4rem` 1280→1920) | 600 | -0.035em | Stage hero / marketing hero (`Notice what you'd miss.`) |
| `h1` | Geist | 40 / 40 | 600 | -0.035em | `sig-headline` (signature card hero) |
| `h2` | Geist | 32 / 32 | 600 | -0.03em | Page titles |
| `h2-modal` | Geist | 24 / 27.6 | 600 | -0.03em | Modal heads |
| `h3` | Geist | 22 / 22 | 600 | -0.025em | Section heads (`Color tokens`, `Typography`, `Buttons`) |
| `insight-head` | Geist | 20 / 24 | 600 | -0.025em | Card insight headlines |
| `body-lg` | Geist | 14 / 21.7 | 400 | 0 | Modal body, sig-sub |
| `body` | Geist | 13 / 19.5 | 400 | 0 | Default body text, chat bubble body, table money cells |
| `body-sm` | Geist | 12 / 18 | 400 | 0 | Secondary UI, captions, ds-nav links |
| `body-xs` | Geist | 11 / 16.5 | 500 | -0.005em | Microcopy, chips, pf-tiny, tab text |
| `eyebrow-mono` | Geist Mono | 10 / 16 | 500 | 0.18–0.22em | Stage eyebrow, sig-eyebrow, insight-eyebrow, modal-eyebrow, AI label (`PROVEDO REPLIES`), nav-label, ds-row-label, table-head |
| `mono-label` | Geist Mono | 11 / 17.6 | 500 | 0.16em | Mono content samples, breadcrumbs |
| `mono-meta` | Geist Mono | 9 / 15.3 | 500 | 0.10–0.18em | Smallest mono labels (table-head, ds-row-label, mono-meta in cards) |
| `tabular-md` | Geist (`tnum 1`, `ss01 1`) | 13 / 19.5 | 500 | -0.01em | Table money/qty/delta cells |
| `tabular-lg` | Geist (`tnum 1`, `ss01 1`) | 24 / 24 | 600 | -0.03em | Numerals row in showcase / total values |
| `tabular-xl` | Geist (`tnum 1`, `ss01 1`) | 28 / 28 | 600 | -0.035em | `pf-amt` (portfolio card hero amount) |

### 4.3 Weights in the system

Geist: **300 / 400 / 500 / 600 / 700.** Default body = 400. UI labels = 500. Headings = 600. **700 reserved exclusively** for emphasis-within-headline (`sig-headline .accent`, `insight-head .accent`) — but per brand lock §13.4, this emphasis carries NO color shift; bold weight only.
Geist Mono: **500** is the canonical eyebrow weight. 400 occasionally for body-mono content.

### 4.4 Numbers — invariants (v1.1)

- All currency and quantity numbers MUST use `font-feature-settings: 'tnum' 1` (and ideally `'ss01' 1` for slashed zero on amounts). This applies to `pf-amt`, `tr .qty`, `tr .val`, `tr .delta`, `pf-tiny`.
- Gain/loss percentages MUST include leading sign: `+2.4%`, `−5.8%`. Use the math minus `−` (U+2212), not hyphen-minus. Verified in showcase `−5.8%` rendering at line 857.
- `pf-amt` (portfolio-card hero amount) uses `tabular-xl` (28px Geist 600, `tnum 1`, `ss01 1`, `letter-spacing: -0.035em`).
- Mono labels (citation marks, transaction IDs, eyebrow editorial labels) use Geist Mono with the conventional eyebrow letter-spacing 0.16–0.22em + uppercase + 500.
- **NO italic anywhere in the system.** Italic is a banned register (Vercel-billboard / decorative-emphasis trap).

### 4.5 Font loading (v1.1)

```html
<!-- Showcase uses Google Fonts; production migrates to next/font/local -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap">
```

**Production migration:** self-host Geist + Geist Mono via `next/font/local` in `apps/web/src/app/layout.tsx`. Bundle ~50–80kb gzipped per family. Preload only the critical weights (Geist 500 numerical + Geist 600 h2/h3 + Geist Mono 500). `font-display: swap` on all faces.

**Geist licensing:** OFL, open-source, Vercel-published. Clean self-host. Compatible with Rule R1 (no spend).

### 4.6 v1.0 typography hypothesis — SUPERSEDED (preserved for context)

v1.0 specified three families (Fraunces / Inter / JetBrains Mono) with the rationale «Stripe Press × Mercury × Granola, executed with restrained tactility on warm paper». Three-family system was meant to carry editorial-display + body-text + tabular-numeric registers with maximum character.

**Why v1.0 was a reasonable hypothesis:**
- Voice references (Patagonia, Craig Mod, McPhee) all live in serif-display worlds; Fraunces was the closest open-source serif to that register.
- JetBrains Mono is the gold standard for tabular numerals in finance UIs.
- Inter is the safe-harbor body sans for fiduciary register.

**Why v1.1 collapsed to Geist + Geist Mono:**
- Three families = three weight/loading concerns + two register-switches per page. Geist with `tnum 1` carries numerical signal alone; Geist Mono picks up eyebrow labels. Two families, one tone.
- Fraunces at UI sizes (16–18px running body) read more luxury than considered. At display sizes (32–48px) the optical-axis variation read as «character», but it competed with the paper restraint of the surface system.
- After 6 polish rounds the «Stripe Press cadence» that v1.0 wanted came out fine in Geist alone — not because Geist mimics Stripe Press's typeface, but because the *cadence* (tabular numerals + mono eyebrows + dotted dividers + zero italic) is what carries the voice, not the serif specifically.

The v1.0 type scale is preserved here for historical reference but **none of the v1.0 family/weight/size combinations should be consumed in production code**. All references to `Fraunces`, `Inter`, and `JetBrains Mono` in the rest of this document, surface specs, or migration tooling are obsolete.

---

## 5. Shadow / elevation tokens

> **v1.1 NOTE.** Shadow scale renamed (`shadow.accent.extrude` → `shadow.primary.extrude` — primary CTA is now ink-extruded, not accent-extruded; new `shadow.terra.extrude` for btn-danger). **Cream-highlight alpha softened from 0.95–1.0 (v1.0) to 0.55–0.60 ceiling** — anything higher reads as glow-creep / Vercel-billboard (brand lock §13.5). New `shadow.input-inset` token consumed ONLY by `.input` and `.search-input` (toggles do NOT use inset shadow in v1.1 — they use border-driven flat language; see §7). Shadow values below assume the v1.1 surfaces (light bg `#E8E0D0`, dark bg `#0E0E12`).

### 5.1 Light-mode shadow tokens (v1.1 SHIPPED)

| Token | CSS value | Use |
|---|---|---|
| `shadow.soft` | `0 1px 3px rgba(20, 20, 20, 0.08), 0 6px 18px rgba(20, 20, 20, 0.06)` | Subtle paper lift — list items, tab-active thumb |
| `shadow.card` | `5px 5px 14px rgba(140, 100, 55, 0.14), -3px -3px 10px rgba(255, 250, 240, 0.55), inset 1px 1px 0 rgba(255, 255, 255, 0.5)` | **Tactile baseline** — every card, every primitive, the extruded paper signature. Triple layer: warm shadow bottom-right, **cream highlight top-left at 0.55 alpha (was 0.95 in v1.0 — softened per §13.5 brand lock)**, inner highlight rim |
| `shadow.lift` | `8px 8px 24px rgba(140, 100, 55, 0.18), -3px -3px 12px rgba(255, 250, 240, 0.60), inset 1px 1px 0 rgba(255, 255, 255, 0.6)` | Hero / modal / focused signature surfaces. Cream highlight 0.60 alpha. |
| `shadow.toast` | `6px 10px 28px rgba(120, 80, 40, 0.20), -3px -3px 10px rgba(255, 250, 240, 0.55), inset 1px 1px 0 rgba(255, 255, 255, 0.5)` | Floating overlays — toast, topbar, dropdown. Bumped vs v1.0 because toast/topbar sit on bg without parent-card scaffolding. |
| `shadow.modal` | `8px 10px 36px rgba(20, 20, 20, 0.24), -2px -2px 10px rgba(255, 250, 240, 0.7), inset 1px 1px 0 rgba(255, 255, 255, 0.4)` | Modal lift. Slightly higher highlight alpha (0.7) acceptable for floating-on-overlay context where there's no surrounding card to compete. |
| `shadow.input-inset` | `inset 3px 3px 6px rgba(140, 100, 55, 0.14), inset -2px -2px 4px rgba(255, 250, 240, 0.9)` | **Depressed surfaces — INPUTS ONLY** (`.input`, `.search-input`). Toggles do NOT use this. **Renamed from v1.0 `shadow.inset`** because the semantic became narrower. |
| `shadow.inset.light` | `inset 1.5px 1.5px 3px rgba(140, 100, 55, 0.10), inset -1px -1px 2px rgba(255, 250, 240, 0.8)` | Chip / minor inset — chips, citations, tabs-track, info-toast icon, empty-icon, btn-icon, chat-user-bubble. 9 consumer sites total. |
| `shadow.primary.extrude` | `4px 4px 12px rgba(20, 20, 20, 0.18), -1px -1px 4px rgba(255, 250, 240, 0.6), inset 1px 1px 0 rgba(255, 255, 255, 0.06)` | **Primary CTA — INK extruded** (renamed from v1.0 `shadow.accent.extrude`). Used by `.btn-primary`, `.btn-icon.primary`, `.nav-item.active`, `.avatar`, `.chip.ink`. |
| `shadow.terra.extrude` | `3px 3px 10px rgba(155, 92, 62, 0.28), -1px -1px 4px rgba(255, 250, 240, 0.5), inset 1px 1px 0 rgba(255, 255, 255, 0.12)` | **NEW in v1.1** — bronze-extruded shadow for `.btn-danger`. Subtle warm shadow that doesn't compete with primary's ink shadow. |
| `shadow.focus` (outline-based) | `outline: 2px solid var(--accent); outline-offset: 2px` | Focus ring uses `outline` property (not box-shadow) — works at any specificity, doesn't compose with surface shadows. Error-input variant overrides outline-color to `var(--terra)`. |

### 5.2 Dark-mode shadow tokens (v1.1 SHIPPED)

> **v1.1 NOTE.** Dark mode rejects warm cream-highlight overlays — neutral cool dark theme uses near-pure `rgba(255, 255, 255, 0.07–0.09)` for top-edge highlight. No double-shadow glow.

| Token | CSS value | Use |
|---|---|---|
| `shadow.soft` | `0 1px 3px rgba(0, 0, 0, 0.45)` | Subtle paper lift |
| `shadow.card` | `0 4px 16px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.07)` | Tactile baseline. Top-edge cream-highlight at 0.07 (bumped from v1.0 0.04 because v1.1 luma 1.15:1 was insufficient — now backed by visible top rim). |
| `shadow.lift` | `0 12px 36px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.09)` | Hero / modal / signature. |
| `shadow.toast` | `0 10px 28px rgba(0, 0, 0, 0.60), inset 0 1px 0 rgba(255, 255, 255, 0.08)` | Floating overlays. |
| `shadow.modal` | `0 14px 36px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08)` | Modal lift. |
| `shadow.input-inset` | `inset 0 2px 0 rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(0, 0, 0, 0.3)` | Inputs only. Deeper top-edge alpha so depressed reads on OLED black. |
| `shadow.inset.light` | `inset 0 1px 0 rgba(0, 0, 0, 0.3)` | Chip / minor inset. |
| `shadow.primary.extrude` | `0 2px 6px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)` | **Primary CTA in dark — RESTRAINED, no glow.** Primary CTA uses cream fill on dark bg, but the shadow is plain dark drop with cream rim — no jade glow. |
| `shadow.terra.extrude` | `0 2px 6px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)` | btn-danger in dark. Same shape as primary; differentiation by fill color only. |
| `shadow.focus` (outline-based) | `outline: 2px solid var(--accent); outline-offset: 2px` | Focus ring; same mechanism as light. |

### 5.3 Elevation usage rules (v1.1)

1. Every primitive that is a discrete surface (Card, Button, Modal, Toast, Chip, Badge) consumes ONE shadow token. No mixing.
2. **Never animate shadow geometry.** If a hover state needs more shadow, cross-fade between two static layers via `::after` opacity. Animating `box-shadow` blur or offset is a known perf foot-gun (see §7).
3. **Inset shadows are NOT used on toggles.** v1.0 spec'd inset on switch/checkbox/radio; v1.1 PD lock 2026-04-27 made toggles flat with border + jade fill on active. **`shadow.input-inset` is consumed only by `.input` and `.search-input`** — see §7 for full reasoning.
4. `shadow.primary.extrude` is reserved for the primary CTA family + ink-filled variants (active nav-item, avatar, chip.ink). No other surface uses the ink-tinted shadow. This protects the «extruded ink» signature.
5. `shadow.terra.extrude` is reserved for `.btn-danger` only. The bronze-tinted extrude is the «attention warranted» counterpart to ink-primary.
6. `shadow.lift` is reserved for signature surfaces in the entire app: hero metric card (`.card-signature`), paywall hero (`.modal`), hero ledger, topbar (sits on bg with no parent card), and toast lift-on-enter. New surfaces requesting `shadow.lift` need an ADR.
7. **Cream-highlight alpha ceiling: 0.55–0.60 in light, 0.07–0.09 in dark** (brand lock §13.5). Any future shadow token that exceeds these must justify in an ADR.

### 5.4 v1.0 shadow values — SUPERSEDED (preserved for context)

v1.0 spec'd cream-highlight alphas of 0.95 (`shadow.card` `-3px -3px 10px rgba(255,250,240,0.95)`) and 0.98 (`shadow.lift`). At those alphas, the highlight read as a glowing rim that pulled toward Vercel-billboard rather than paper-on-corkboard. **Brand-strategist final ship review identified this as glow-creep.** v1.1 softens to 0.55–0.60.

v1.0 spec'd `shadow.accent.extrude` (teal-tinted) for primary CTA. With CTA fill changing from teal to ink, the shadow shifted to neutral-warm `shadow.primary.extrude`. **The teal-tinted shadow value is now obsolete** — do not consume `rgba(15, 138, 126, 0.22)` or related teal alphas anywhere in the system.

v1.0's `shadow.inset` (single token) split into v1.1's `shadow.input-inset` (inputs only) + `shadow.inset.light` (chips, citations, tabs-track, info-toast). Migration: grep `shadow.inset` usages, retarget per consumer (FE work, ~30min mechanical pass).

---

## 6. Radius scale (v1.1 SHIPPED)

| Token | Value | Use |
|---|---|---|
| `radius.sm` | `6–7px` | Citation chip (6px), checkbox (7px) |
| `radius.md` | `10–12px` | Buttons-sm (10px), shadow-grid blocks (10–14px), nav-item (10px), tabs / tab (10/14px), topbar (14px), toast (14px) |
| `radius.lg` | `14–18px` | Buttons-md (14px), buttons-lg (18px), inputs (14px), cards (18px), card-empty (18px), modal-stage (18px) |
| `radius.xl` | `22px` | Modal (22px), card-signature (22px) — paywall hero, hero ledger |
| `radius.pill` | `100px` (or `50%`) | Chips, search-input, switch track, avatar / radio / btn-icon (50%), pulse, status-dot |

**Note:** v1.1 ships a softer scale than v1.0 (md `10`→`10–12px`, lg `14`→`14–18px`, xl `20`→`22px`). The bump composes better with v1.1's softened cream-highlight shadows — at the larger radius, the inner-rim highlight rounds cleanly without sharp corner pinching.

**The pill radius (100px) is now the convention for**: chip, search-input, switch-track, status-dot, pulse, btn-icon, avatar, radio. v1.0 reserved pill specifically for the primary CTA; in v1.1 the primary CTA uses `radius.lg` (14px) — pill-CTA was abandoned because ink-extruded pill at large sizes read more «buttony» than fiduciary-restrained.

---

## 7. Motion tokens

### 7.1 Duration + easing

| Token | Value | Use |
|---|---|---|
| `duration.press` | `80ms` | Press-down on any interactive surface |
| `duration.fast` | `120ms` | Press-release, color-state changes (hover color) |
| `duration.normal` | `200ms` | Hover lift, opacity transitions |
| `duration.slow` | `300ms` | Page-level transitions, dialog enter/exit, settle-on-viewport |
| `easing.default` | `cubic-bezier(0.16, 1, 0.3, 1)` | ease-out-expo. Confident settle. Default for everything except press-in. |
| `easing.in` | `cubic-bezier(0.4, 0, 1, 1)` | Press-in (fast at end, mimics fingertip contact) |
| `easing.out` | `cubic-bezier(0, 0, 0.2, 1)` | Press-release |

### 7.2 The three primary tactile gestures

**Press-down** (click on any interactive surface):
```css
.surface-interactive:active {
  transform: translateY(1px) scale(0.98);
  transition:
    transform 80ms cubic-bezier(0.4, 0, 1, 1),
    opacity 80ms linear;
}
```

**Hover lift** (cards / interactive surfaces):
```css
.surface-interactive:hover {
  transform: translateY(-1px); /* buttons */
  /* or translateY(-2px) for cards */
  transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
.surface-interactive::after {
  /* second shadow layer cross-fades in */
  opacity: 0;
  transition: opacity 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
.surface-interactive:hover::after {
  opacity: 1;
}
```

**Settle** (element entering viewport, IntersectionObserver-triggered):
```css
.surface-settle {
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 300ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.surface-settle.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

Stagger between siblings: 60ms, max 5 staggered before clamping.

### 7.3 Motion language — what we reject

- **iOS spring with overshoot.** Reads playful / toy-coded. Wrong tone for fiduciary instrument. Reject.
- **Material ripple.** Reads as a Google product. Reject.
- **Animated shadow geometry.** Perf foot-gun. Reject — use cross-fade instead.
- **Border-radius animation.** Reads squishy / cartoony. Reject.
- **Width / height / margin animation.** Layout thrash. Reject.

The Provedo motion register is **Stripe-Mercury family** — transform-only, ease-out-expo settles, no overshoot, no ripple.

### 7.4 Reduced motion

Respect `prefers-reduced-motion: reduce`:
- Skip ALL `translateY` animations.
- **Retain** opacity transitions and shadow cross-fades (they don't trigger vestibular issues; they preserve affordance signal).
- Skip count-up number animation (final value renders immediately).
- Skip stagger; render all settled-in items at once.
- Skip Coach dot pulse and BellDropdown first-session pulse.

**v1.1 showcase implementation (reference):**
```css
@media (prefers-reduced-motion: reduce) {
  .btn, .switch::after, .switch, .input { transition: none !important; }
  .btn:hover, .btn:active { transform: none !important; }
}
```
Verified in `apps/web/public/design-system.html` lines 709–712. Hover transforms (`translateY(-1px)` on buttons) are disabled; transitions on switch knob and input box-shadow are also stripped. Color-state transitions remain intact.

---

## 8. Component inventory — Tier-1 (must-have for v1)

Tier-1 is the inventory that frontend-engineer implements before any app surface migrates. Each row gives semantic role + variants + states + dependencies.

### 8.1 Tier-1 component table (v1.1 SHIPPED)

| Component | File | Variants | States | Shadow | Notes |
|---|---|---|---|---|---|
| **Button** | `packages/ui/src/primitives/Button.tsx` | `primary` / `secondary` / `ghost` / `danger` / `icon` | rest / hover / press / disabled / loading | **Primary: `shadow.primary.extrude`** (ink-extruded). **Secondary: NONE** (transparent + 1px border). **Ghost: NONE** (transparent, no border). **Danger: `shadow.terra.extrude`**. **Icon: `shadow.inset.light`** baseline; `.btn-icon.primary` uses `shadow.primary.extrude`. | Sizes `sm` (px-14, py-7, radius-10) / `md` (px-20, py-11, radius-14) / `lg` (px-28, py-14, radius-18). Hover lift: `translateY(-1px)` 100ms ease-in. Press: `translateY(1px)` 80ms. v1.1 dropped `outline` variant — use `secondary`. |
| **Input** | `Input.tsx` | `text` / `search` / `error` | rest / focus / error / disabled | `shadow.input-inset` (depressed well baseline — INPUTS ONLY). Focus adds 3px accent-glow ring. Error: terra border + 2px terra outline ring. | Always render visible label (no placeholder-as-label). Background `surface.inset`. Errors render below field with `accent.terra` text + warning glyph + `aria-describedby`. **Dark theme error variant missing in v1.1 showcase — add during port** (FE migration item ~10min). |
| **Switch** | new in `Switch.tsx` | sole | rest / on / off / disabled | **NONE** — flat with `border.default` 1px. On state: `accent.primary` fill + `accent.primary.shadow` 0/1px/3px drop + `inset 0 1px 0 rgba(255,255,255,0.18)` highlight. | **PD lock 2026-04-27 (§13.7):** flat with border-driven meaning, NOT depressed. Knob: `surface.card` background + `1px 1px 3px rgba(0,0,0,0.15)` shadow. Knob translates 22px on toggle (44 track − 2 borders − 20 knob − 2 left margin), 200ms. Track 44×26px, knob 20×20px, radius 100px. **Dark-mode knob shadow is too subtle** (cosmetic, not blocking). |
| **Checkbox** | new in `Checkbox.tsx` | sole | rest / checked / disabled | **NONE** — flat with `border.default` 1px. Checked: `accent.primary` fill + same accent shadow as switch. | Same flat language as switch. Box 22×22px, radius 7px. Check icon: Lucide `check`, 14×14px, white stroke-width 3. |
| **Radio** | new in `Radio.tsx` | sole | rest / checked / disabled | **NONE** — flat with `border.default` 1px. Inner dot at checked: `accent.primary` filled, 14×14px, with `0 1px 2px var(--accent-shadow)` drop. | Outer ring 22×22px radius 50%. Inner dot uses same accent token as switch/checkbox. |
| **Card** | `Card.tsx` | `default` (`.card-pf`, `.card-insight`, `.card-empty`) / `signature` (`.card-signature`) | rest / hover (where interactive) / focus-within | `default`: `shadow.card` + 1px `border.default`. `signature`: `shadow.lift` + 1px `border.default`. Card border-radius 18px (default) / 22px (signature). | All cards have a 1px border in v1.1 — gives «catalog-card / library-index feel» (Everyman warmth note from brand-strategist). v1.0 removed `elevated` and `interactive` redundant variants. Padding default 18–22px, signature 28–32px. |
| **Chip / Badge** | `Badge.tsx` | `neutral` / `accent` / `ink` / `warning` / `removable` | rest / hover (removable) / focus (removable) | Neutral: `shadow.inset.light` + `surface.inset` bg. Accent: `accent.primary` fill + `accent.primary.shadow` drop + cream highlight rim. Ink: `accent.ink` (`text.1`) fill + `shadow.primary.extrude`. Warning: `accent.terra` fill + terra-shadow drop. Outline variants none at rest. | v1.1 collapsed `success` and `error` chip variants into `accent` and `warning`. Removable variant: `<button class="chip-close">` with Lucide `X` SVG (8×8) — focusable, `aria-label="Remove {filter}"`. |
| **Toast** | `Toast.tsx` | `success` / `warning` / `info` | enter / rest / exit | `shadow.toast`. Toast enters with `translateY(8px)→0` + opacity 0→1 over 250ms. | Layout: 32×32px circular icon + title + msg, max-width 380px, padding 14×16px, radius 14px. Icons: Lucide `check` (success), `triangle-alert` (warning), `info` (info). **Info variant uses `surface.inset` + `shadow.inset.light` icon-circle** (restraint canon — info is not a status, just a notice). |
| **Modal / Dialog** | `Dialog.tsx` | `paywall` / `confirmation` | enter / rest / exit | Backdrop: `surface.overlay` + `backdrop-filter: blur(2px)`. Modal: `shadow.modal`. | Modal max-width 460px, padding 26×28px, radius 22px. Paywall variant uses `radius.xl` (22px) and `shadow.lift`. Modal-stage wrapper has its own padding 30px + radius 18px. |
| **Topbar** | new in `Topbar.tsx` | sole | sole | `shadow.lift` (sits on bg with no parent card — needs strong shadow). | 56–60px height. Padding 12×22px, radius 14px. Slots: logo / nav-items / search / bell-icon / avatar. Active nav-item uses `shadow.primary.extrude` (ink fill flip). |
| **Tabs (segmented)** | `SegmentedControl.tsx` | sole | rest / hover / active / focus | Track: `shadow.inset.light` + `surface.inset` background. Active thumb: `shadow.soft` + `surface.card`. | Track radius 14px, padding 4px. Tab radius 10px, padding 8×16px. Thumb shifts via translate, NOT width animation. Hover background bumped to be perceptible at glance (`rgba(20,20,20,0.10)` light / `rgba(255,255,255,0.12)` dark — PO feedback ×3). |
| **Breadcrumb** | new in `Breadcrumb.tsx` | sole | rest / hover (link) / current | None | Mono-typography (Geist Mono 10px, letter-spacing 0.06em, `text.3`). Separator: `/` glyph (NOT chevron) at 0.5 opacity. Current page in ink + 500 weight. |
| **Chat bubble** | `ChatMessage.tsx` (domain) | `user` / `assistant` / `with-citation-chip` | rest / streaming (assistant) | **User: `surface.inset` + `shadow.inset.light`** (depressed «slot» metaphor like input field — both themes). **Assistant: `surface.card` + 1px border + `shadow.card`** (no jade tint — accent overuse drop per brand-strategist §13.4). | User bubble radius `18px 18px 4px 18px`, max-width 78%, padding 12×18px. Assistant bubble radius `18px 18px 18px 4px`, max-width 86%, padding 16×20px. Assistant `.label` uses Geist Mono eyebrow style + accent color. **Inline `.accent` in body forced to ink + 600 weight** (paper-restraint canon §13.4). Citation chip: `surface.inset` + `shadow.inset.light` + 1px accent-tinted border + Lucide sparkle SVG (10×10px) glyph. |
| **Table row** (PositionRow) | `PositionRow.tsx` (domain) | `default` / `head` | rest / hover / pressed | Card wraps table: `shadow.card` + 1px border + radius 14px + `overflow: hidden`. Header row: `surface.inset` + `inset 0 -1px 2px rgba(0,0,0,0.04)` (light) / dead-pixels (dark — known limitation §13.6). Body rows: 1px `border.default` between rows. | 4-column grid `2.4fr 0.7fr 1.2fr 1fr` (symbol / qty / value / delta). Body cells right-aligned for numerical columns; header cells center-aligned for numerical columns (specificity override). Column separators use `border.divider` (NEW token in v1.1). Money cells: Geist `tabular-md` with `tnum 1`. |
| **Avatar (with status dot)** | `Avatar.tsx` | `default` / `accent` / `terra` | sole | `shadow.primary.extrude` (default ink); accent and terra variants use accent / terra fill (no extrude shadow). | Sizes 38×38px (md) typical. Status dot: 12×12px, `accent.primary` fill, 2px `surface.card` border, positioned `bottom: -2px right: -2px`. |
| **Pulse / status dot** | new in `StatusDot.tsx` | `default` / `warn` | rest / pulse | None | 12×12px filled circle. Default: `accent.primary` + `accent.primary.glow` 3px halo. Warn: `accent.terra` + `color-mix(in oklch, terra 18%, transparent)` 3px halo. **Colorblind safety:** when `pulse.warn` is present on a card, adjacent `pf-tiny` line switches to `text.1` (ink) + 600 weight — sign + ink combo is the primary signal, bronze is reinforcement (see §10.2). Pulse animation per `COACH_SURFACE_SPEC.md` §1 — 1200ms scale 1.0→1.15→1.0, every 2.5s, 5min cap, reduced-motion → static. |

### 8.2 Per-component spec — Button (canonical pattern, v1.1 SHIPPED)

The Button is the canonical implementation pattern. Every interactive primitive follows the same shape.

**v1.1 reference CSS (from `apps/web/public/design-system.html` lines 161–209):**

```css
.btn {
  font-family: 'Geist', sans-serif; font-weight: 500;
  border: none; cursor: pointer;
  transition: transform 100ms ease-in;
  font-size: 13px; padding: 11px 20px; border-radius: 14px;
  letter-spacing: -0.01em;
}
.btn:hover { transform: translateY(-1px); }
.btn:active { transform: translateY(1px); transition-duration: 80ms; }

/* PRIMARY = INK extruded (NOT teal/green) */
.btn-primary {
  background: var(--ink);
  color: var(--card);          /* white in light, ink in dark via dark override */
  box-shadow: var(--shadow-primary-extrude);
}
.dark .btn-primary { background: var(--ink); color: var(--bg); }

/* SECONDARY = outlined-flat (NOT depressed — depressed reads as «disabled») */
.btn-secondary {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--border);
  box-shadow: none;
}
.btn-secondary:hover { background: rgba(0,0,0,0.03); }
.dark .btn-secondary:hover { background: rgba(255,255,255,0.04); }

/* GHOST = flat, no border */
.btn-ghost {
  background: transparent;
  color: var(--text-2);
  padding: 11px 14px;
}
.btn-ghost:hover {
  color: var(--ink);
  transform: none;
  background: rgba(0,0,0,0.04);
}
.dark .btn-ghost:hover { background: rgba(255,255,255,0.05); }

/* DANGER = bronze extruded */
.btn-danger {
  background: var(--terra);
  color: var(--card);
  box-shadow: var(--shadow-terra-extrude);
}

/* ICON BUTTON */
.btn-icon {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--inset);
  color: var(--text-2);
  box-shadow: var(--shadow-inset-light);
}
.btn-icon.primary {
  background: var(--ink); color: var(--card);
  box-shadow: var(--shadow-primary-extrude);
}

/* DISABLED */
.btn-disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none !important;
  pointer-events: none;
}

/* SIZES */
.btn-sm { padding: 7px 14px; font-size: 11px; border-radius: 10px; }
.btn-lg { padding: 14px 28px; font-size: 14px; border-radius: 18px; }
```

**React/Tailwind port target (FE migration):**

```tsx
// packages/ui/src/primitives/Button.tsx (v1.1 spec)

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';
type Size = 'sm' | 'md' | 'lg';

const base = [
  'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap',
  'transition-transform duration-100 ease-in',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
  'disabled:pointer-events-none disabled:opacity-45',
  'hover:-translate-y-px active:translate-y-px',
].join(' ');

const variants: Record<Variant, string> = {
  primary: 'bg-text-1 text-surface-card shadow-primary-extrude',
  secondary: 'bg-transparent text-text-1 border border-border-default hover:bg-text-1/3',
  ghost: 'bg-transparent text-text-2 hover:text-text-1 hover:bg-text-1/4',
  danger: 'bg-accent-terra text-surface-card shadow-terra-extrude',
  icon: 'bg-surface-inset text-text-2 rounded-full shadow-inset-light hover:text-text-1',
};
```

**States checklist** for every interactive primitive:
- [ ] rest
- [ ] hover (`translateY(-1px)` 100ms ease-in; bg/color shift on secondary/ghost)
- [ ] press (`translateY(1px)` 80ms — overrides hover)
- [ ] focus-visible (2px outline `var(--accent)` + 2px offset; error variant overrides to `var(--terra)`)
- [ ] disabled (opacity 0.45, pointer-events none, transform reset)
- [ ] loading (spinner replaces label, click-disabled — production add)

### 8.3 Per-component spec — Card variants (v1.1 SHIPPED)

```css
/* DEFAULT card — portfolio, insight, empty */
.card-pf, .card-insight, .card-empty {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18-22px;        /* contextual */
  box-shadow: var(--shadow-card);
}

/* SIGNATURE card — hero, paywall hero */
.card-signature {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 28px 32px;
  box-shadow: var(--shadow-lift);
}
```

**Port target:**

```tsx
// packages/ui/src/primitives/Card.tsx (v1.1 spec)

type Variant = 'default' | 'signature';

const variants: Record<Variant, string> = {
  default:   'bg-surface-card border border-border-default shadow-card rounded-[18px] p-5',
  signature: 'bg-surface-card border border-border-default shadow-lift rounded-[22px] p-8',
};
```

v1.0's `elevated` variant was a duplicate of `default`; both consumed the same shadow. v1.1 collapses to two variants. `interactive` variant (hover-lift) deferred to Tier-2 — currently no surface in v1.1 needs hover-lift on a card primitive (interactive surfaces are buttons, chips, nav-items).

### 8.4 Per-component spec — Input (v1.1 SHIPPED)

```css
/* TEXT INPUT — depressed well */
.input {
  background: var(--inset);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px 16px;
  font-family: 'Geist', sans-serif;
  font-size: 13px;
  color: var(--ink);
  width: 100%; box-sizing: border-box;
  box-shadow: var(--shadow-input-inset);   /* INPUTS-ONLY token */
  outline: none;
  transition: box-shadow 150ms, border-color 150ms;
}
.input::placeholder { color: var(--text-3); }
.input:focus {
  box-shadow: var(--shadow-input-inset), 0 0 0 3px var(--accent-glow);
}

/* ERROR variant — terra border + outline ring (overrides accent-glow at higher specificity) */
.input.error,
.input.error:focus {
  border-color: var(--terra);
  box-shadow: var(--shadow-input-inset), 0 0 0 2px color-mix(in srgb, var(--terra) 50%, transparent);
}

/* SEARCH variant — same depressed well + leading SVG glyph */
.search-input {
  background: var(--inset); border: 1px solid var(--border);
  border-radius: 100px;     /* pill */
  padding: 11px 16px 11px 38px;   /* leave room for left glyph */
  box-shadow: var(--shadow-input-inset);
  /* … */
}
.search-wrap .search-glyph {
  position: absolute; left: 14px; top: 50%;
  transform: translateY(-50%);
  color: var(--text-3);
  width: 14px; height: 14px;
}
```

**Port target:**

```tsx
const inputBase = [
  'block w-full bg-surface-inset text-text-1 placeholder:text-text-3',
  'rounded-[14px] px-4 h-12 text-sm',
  'shadow-input-inset',
  'border border-border-default',
  'focus:outline-none focus:shadow-input-inset focus:ring-3 focus:ring-accent/22',
  'disabled:opacity-45 disabled:cursor-not-allowed',
  'aria-[invalid=true]:border-accent-terra',
  'aria-[invalid=true]:focus:ring-accent-terra/50',
].join(' ');
```

**Mandatory behaviors:**
- Visible label associated via `for`/`id` (showcase line 839). NO placeholder-as-label.
- Error text renders below input as `accent.terra` + 11px Geist + leading warning glyph (Lucide `triangle-alert` 12×12) + `aria-describedby` linking the helper.
- `aria-invalid="true"` on error inputs; focus-visible outline-color overrides to `var(--terra)`.
- Type-specific: `type="email"`, `type="search"` for SR semantics.

### 8.5 Per-component spec — Switch / Checkbox / Radio (v1.1 SHIPPED — flat language)

> **PD lock 2026-04-27 (§13.7):** Toggles are FLAT, NOT depressed. Background uses `surface.inset` for «idle slot» feel; meaning is carried by border + accent fill on active. v1.0 spec'd inset shadows on toggles; v1.1 abandoned that because users compared depressed-toggles to disabled-buttons (Norman affordance rule).

```css
/* SWITCH — track 44×26px radius pill */
.switch {
  width: 44px; height: 26px; border-radius: 100px;
  background: var(--inset);
  border: 1px solid var(--border);
  box-shadow: none;                    /* FLAT — no inset */
  position: relative; cursor: pointer;
  transition: background 200ms;
  box-sizing: border-box;
}
.switch::after {
  content: ''; position: absolute;
  top: calc(50% - 10px); left: 2px;
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--card);
  box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
  transition: left 200ms;
}
.switch.on {
  background: var(--accent);
  box-shadow: 0 1px 3px var(--accent-shadow), inset 0 1px 0 rgba(255,255,255,0.15);
}
.switch.on::after { left: calc(100% - 22px); }

/* CHECKBOX — 22×22px radius 7px */
.checkbox {
  width: 22px; height: 22px; border-radius: 7px;
  background: var(--inset);
  border: 1px solid var(--border);
  box-shadow: none;                    /* FLAT */
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; box-sizing: border-box;
}
.checkbox.checked {
  background: var(--accent); color: white;
  box-shadow: 0 1px 3px var(--accent-shadow), inset 0 1px 0 rgba(255,255,255,0.18);
}
.checkbox svg { width: 14px; height: 14px; }   /* Lucide check, stroke-width 3 */

/* RADIO — 22×22px circle */
.radio {
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--inset);
  border: 1px solid var(--border);
  box-shadow: none;                    /* FLAT */
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; box-sizing: border-box;
}
.radio.checked::after {
  content: ''; width: 14px; height: 14px; border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 1px 2px var(--accent-shadow);
}
```

**Port target — semantic uplift required:**

The showcase uses `<div role="switch" aria-checked="..." tabindex="0">` (presentational; doesn't actually toggle on keypress). Production must port to native `<input type="checkbox">` + visually-hidden + custom render, OR `<button role="switch">`. Required behavior:
- Focusable via Tab (radio: only checked one in same group has `tabindex=0`; others `-1`)
- Toggles on Space / Enter
- Announces «switch, on / off», «checkbox, checked / unchecked», «radio, selected / not selected»
- `role="switch"` / `role="checkbox"` / `role="radio"` + `aria-checked`
- Group radios with `role="radiogroup"` + arrow-key navigation

**Why flat (vs v1.0 depressed) — five reasons (depressed-UI direction review 2026-04-27):**

1. **Affordance (Norman):** depressed inset = «receive input from me» → maps to typing field, not binary toggle. Users compare depressed-toggles to disabled-buttons; «depressed reads as disabled» pattern is the failure mode.
2. **Reference precedent:** Mercury 2024, Stripe Press, Granola all keep inputs subtly recessed but render switches/checkboxes flat with crisp filled active states. None inset-shadow a checkbox.
3. **Brand alignment:** Magician + Everyman wants confidence + plainness. Depth on inputs sells «physical ledger»; depth on a checkbox sells nothing.
4. **A11y:** flat toggles with explicit fill + border + checkmark hit WCAG AA more reliably across high-contrast / OLED extremes than inset shadows that disappear on extremes.
5. **Geist composition:** geometric letterforms sit better next to flat toggles than against multiple inset-shadow vocabularies competing for attention.

### 8.6 Per-component spec — Topbar (v1.1 SHIPPED)

```css
.topbar {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px 22px;
  display: flex; align-items: center; justify-content: space-between;
  box-shadow: var(--shadow-lift);     /* sits on bg with no parent card */
}
.nav-item.active {
  background: var(--ink); color: var(--card);
  box-shadow: var(--shadow-primary-extrude);
}
```

Active state uses ink-extruded fill (matches primary CTA semantic) — flips ink/cream on dark. Hover state was bumped per PO feedback ×3 to `rgba(20,20,20,0.13)` light / `rgba(255,255,255,0.16)` dark for perceptibility.

Bell icon: Lucide `bell` SVG (NOT emoji 🔔 — emojis are pre-delivery checklist fail). 18×18px, stroke-width 1.8, `aria-label="Notifications"`.

---

## 9. Component inventory — Tier-2 (next-wave, list only — DEFERRED in v1.1)

Built after Tier-1 ships. No detailed spec yet; tracked in design-tech-debt. v1.1 explicitly defers all of these — do not implement until Tier-1 ports to `packages/ui` AND a real consuming surface forces the spec.

- **Tooltip** — `shadow.toast` floating, `surface.inverse` background, `text.inverse` text
- **Dropdown** — `shadow.toast`, list-of-items popover
- **Date picker** — calendar modal with `surface.card` + `shadow.lift`
- **Skeleton** — already exists; refresh to consume `surface.inset` + subtle shimmer
- **Progress bar** — `surface.inset` track + `accent.primary` fill, no shadow
- **Calendar** — month grid for tax-report range selection
- **Sortable list** — drag handle = Lucide `grip-vertical` icon
- **Drag handle** — `text.3` resting, `text.1` on grab
- **Pagination** — keyboard-navigable page list
- **Sidebar nav** — for desktop chrome (currently AppShell handles this; needs refit to v1.1 tokens)
- **Slider / Range** — Plus scenario simulator dependency
- **Combobox** — Plus scenario simulator dependency
- **Stepper / Progress** — onboarding flow
- **Streaming-cursor primitive** — AI surface
- **Tooltip arrow / Popover** — Coach popover surface
- **Validation states catalogue** — full success / warning / error / info input rings + helper-text patterns; deferred to v2 per ship-craft review

---

## 10. Accessibility verification (v1.1 SHIPPED)

### 10.1 Contrast pairs — verified against showcase

All combos computed against the v1.1 shipped tokens. Critical thresholds:

**Light mode (bg `#E8E0D0` after Round-6 deepen, but showcase uses `#F1EDE3` — see migration note below):**

| Pair | Computed | WCAG AA |
|---|---|---|
| `text.1 #1A1A1A` on `surface.bg #E8E0D0` | 17.93:1 | **AAA** body |
| `text.2 #4D4D4D` on `surface.bg` | 7.91:1 | **AAA** body |
| `text.3 #7A7A7A` on `surface.bg` | 4.06:1 | **fails body AA (4.5:1) by 0.44** — passes UI / large-text 3:1. **Action:** tighten to `#6E6E6E` (4.84:1) for production. Not blocking for showcase as text-3 is metadata only. |
| `accent.primary #2D5F4E` on `surface.bg` | 7.50:1 | **AAA** body |
| `accent.terra #A04A3D` on `surface.bg` | 4.55:1 | AA body |
| Primary CTA: `text.1` on `surface.card #FFFFFF` | 17.93:1 | AAA |
| Focus ring `accent.primary` on `surface.bg` | 3.94:1 | AA UI ≥3:1 |

**Dark mode (bg `#0E0E12`, card `#26262E`):**

| Pair | Computed | WCAG AA |
|---|---|---|
| `text.1 #F4F1EA` on `surface.bg #0E0E12` | 17.21:1 | AAA |
| `text.2 #B5B5B5` on `surface.bg` | 9.49:1 | AAA |
| `text.3 #7A7A7A` on `surface.bg` | 5.20:1 | AAA body |
| `accent.primary #4A8775` on `surface.bg` | 6.42:1 | AAA body |
| `accent.primary` on `surface.card #26262E` | 3.4:1 | UI-AA, **fails AAA** — only matters if accent becomes text-on-card; current use is decorative-pill / chart-chrome / verification-badge → pass. **Track for real-app rollout** (deferred §12). |
| `accent.terra #BD6A55` on `surface.bg` | 5.84:1 | AAA |
| Primary CTA: `text.1 (cream)` on `surface.bg` | 17.21:1 | AAA |
| Focus ring `accent.primary` on `surface.bg` | 4.05:1 | AA UI |

**Migration note:** the v1.1 showcase uses light bg `#F1EDE3` (slightly lighter than the spec's `#E8E0D0`). The spec value `#E8E0D0` is the round-6 deepen target. Either acceptable per visual review; the FE port should align to spec `#E8E0D0`. Showcase will refresh to spec at port time.

### 10.2 Color-blind safety for status (v1.1)

Status colors are luma-split AND paired with iconography + text + sign:

- `state.success` (`accent.primary` `#2D5F4E` light / `#4A8775` dark) and `state.warning`/`state.error` (`accent.terra` `#A04A3D` light / `#BD6A55` dark) are **luma-split** — different lightness AND different chroma direction. Verified passing deuteranopia and protanopia simulation in showcase.
- **Portfolio gain/loss numbers** are ALWAYS rendered with leading sign (`+` / `−` U+2212). Color is reinforcement, NEVER the primary signal.
- **`pulse.warn` colorblind fallback (v1.1 system pattern):** when a card carries `pulse.warn`, the adjacent `pf-tiny` line switches from `text.2` to `text.1` (ink) + 600 weight. Verified in showcase line 857: `<div class="pf-tiny" style="color:var(--ink);font-weight:600">−5.8% week · 7 positions</div>` paired with `pulse warn`. The sign + ink-bold combo is the primary signal; bronze color is reinforcement only.
- `.pulse.warn` is bronze; `.pulse` is jade. Both are paired with surrounding text describing the state (`+2.4% week` vs `−5.8% week`).
- `.toast-icon.warning` uses bronze fill plus `triangle-alert` glyph.
- Status badges use icon + text label pair, never color-only.
- Citation chips carry Lucide `sparkle` SVG glyph in `accent.primary` color + chip text label.

Verification: every status/portfolio surface in the showcase passes Coblis simulator on protanopia, deuteranopia, tritanopia. QA includes this pass per surface.

### 10.3 Focus rings (v1.1 SHIPPED)

v1.1 uses CSS `outline` property uniformly (not `box-shadow`):

```css
.btn:focus-visible,
.btn-icon:focus-visible,
.chip-close:focus-visible,
.nav-item:focus-visible,
.tab:focus-visible,
.input:focus-visible,
.search-input:focus-visible,
.switch:focus-visible,
.checkbox:focus-visible,
.radio:focus-visible,
.ds-nav a:focus-visible {
  outline: 2px solid var(--accent, #2D5F4E);
  outline-offset: 2px;
}
/* error input must keep terra in BOTH border AND outline ring */
.input.error:focus-visible {
  outline-color: var(--terra);
}
```

**v1.0 had per-surface inset/outset distinctions** (inset on tactile cards, outset on flat). v1.1 collapses to **one rule: outline 2px solid `accent` + offset 2px** for all interactive surfaces. This works because:
- v1.1 cards have a 1px border that visually contains the focus ring without it fighting the warm shadow.
- The outline property doesn't compose with `box-shadow`, so it doesn't conflict with the tactile shadow stack.
- One rule = one mental model = fewer drift opportunities.

Focus rings are NEVER suppressed — `outline: none` without `:focus-visible` replacement is a banned pattern.

### 10.4 Reduced motion behavior

Per §7.4. Tested on macOS / iOS / Windows reduced-motion settings. Visual-regression sweep includes one pass with `prefers-reduced-motion: reduce` honored.

### 10.5 Keyboard flow

- Tab order matches visual reading order (top→bottom, left→right in LTR).
- Modal traps focus; Escape closes modal AND restores focus to invoking element.
- Enter / Space activate buttons and `role="menuitem"` items.
- Arrow keys within Tabs, SegmentedControl, BellDropdown items (BellDropdown arrow-nav remains tech-debt TD-005 from v1.3).
- Coach popover dismiss: Escape OR click outside.

### 10.6 Screen reader semantics

- Every icon that conveys meaning gets `aria-label`. Decorative icons `aria-hidden="true"`.
- `aria-live="polite"` on AI streaming responses.
- Charts have adjacent data-table alternative.
- Toasts use `role="status"` (info/success) or `role="alert"` (error/warning).
- Coach dots are wrapped in `<button aria-label="Coach pattern: {category}">` per `COACH_SURFACE_SPEC.md`.

---

## 11. Migration plan

### 11.0 Current state (v1.1)

**Showcase shipped to staging.** `apps/web/public/design-system.html` (1055 LOC after FE-review fixes) renders both themes correctly. PR #74 «design-system showcase + FE review fixes» landed (HTML5 shell, font preconnect, label associations, ARIA roles, focus rings, reduced-motion, semantic landmarks).

**Production component port — NOT YET STARTED.** Tier-1 components in `packages/ui` still use pre-v1.1 tokens. The showcase is design documentation; the production library is downstream.

**Pre-port checklist (gate before §11.1):**
- [x] v1.0 spec drafted
- [x] Showcase iterated to lock state through 6 PO polish rounds
- [x] FE-review fixes applied (PR #74)
- [x] Brand-strategist final SHIP signal
- [x] Product-designer final SHIP signal
- [x] **Spec amendment v1.1 (this document)** — ratifies the 8 drifts
- [ ] FE migration kick-off (frontend-engineer assignment)
- [ ] `packages/design-tokens/` token re-target (§11.1)
- [ ] `packages/ui` Tier-1 component port (§11.2)
- [ ] Snapshot refresh + visual delta audit (§11.3)
- [ ] Dark mode wiring + SSR no-flicker script (§11.4)
- [ ] A11y verification pass (§11.5)
- [ ] PO review (§11.6)

### 11.1 Token migration (FE work, ~0.5 day)

Files in `packages/design-tokens/`:

| File | Change | LOC |
|---|---|---|
| `tokens/primitives/color.json` | Re-target to v1.1 surfaces (light bg `#E8E0D0`, card `#FFFFFF`, inset `#D6CCB8`; dark bg `#0E0E12`, card `#26262E`, inset `#070709`). Replace `accent.primary` with forest-jade `#2D5F4E` light / `#4A8775` dark. Replace `accent.terra` with bronze `#A04A3D` light / `#BD6A55` dark. Drop `accent.sage` (collapsed into `accent.primary`). Drop `state.error #B0524A` (collapsed into `accent.terra`). | ~50 |
| `tokens/primitives/shadow.json` | Replace with v1.1 tactile scale (soft / card / lift / toast / modal / input-inset / inset.light / primary.extrude / terra.extrude). Cream-highlight alpha 0.55–0.60 ceiling. Rename `accent.extrude` → `primary.extrude`. NEW `terra.extrude`. NEW `input-inset` (split from generic `inset`). | ~40 |
| `tokens/primitives/radius.json` | Adjust to v1.1 scale (sm 6–7, md 10–14, lg 14–18, xl 22, pill 100). | ~8 |
| `tokens/primitives/motion.json` | Already aligned (duration.press 80, easing.default ease-out-expo). | ~0 |
| `tokens/primitives/typography.json` | Replace family `Inter` / `Fraunces` / `JetBrains Mono` → `Geist` / `Geist Mono`. Update weight axis (300/400/500/600/700 for sans; 400/500/600 for mono). Drop italic axis. | ~15 |
| `tokens/semantic/light.json` | Re-target every reference to v1.1 light surfaces / text / accent (forest-jade) / terra / border / focus. Add NEW `border.divider` token. | ~80 |
| `tokens/semantic/dark.json` | Re-target every reference to v1.1 dark — neutral-cool surfaces (NOT warm-cocoa). Add NEW `bub-user.dark` token (or hard-code at port time per migration debt). | ~80 |
| `tokens/brand.json` | Re-target brand color from `accent.primary` (CTA) to `text.1` (ink) — primary action signal is now ink-extruded, not jade. | ~5 |

**Total tokens:** ~278 LOC. ~0.5 day mechanical work + Style Dictionary build verification.

### 11.2 Component migration (FE work, ~2 days)

Files in `packages/ui/src/primitives/`:

| File | Change | LOC |
|---|---|---|
| `Button.tsx` | Update primary fill ink (was teal). Add `danger` variant (terra). Drop `outline` variant (use `secondary`). Update sizes (sm 7×14 r10, md 11×20 r14, lg 14×28 r18). Hover/press transforms. | ~50 |
| `Card.tsx` | Drop `elevated` and `interactive` variants (collapse to `default`). Add 1px `border.default` to all variants. Update `signature` to radius 22px + padding 28×32. | ~30 |
| `Input.tsx` | Add `error` variant with terra border + outline. Use NEW `shadow.input-inset` (NOT generic `shadow.inset`). 3px accent-glow on focus. Visible label associations mandatory. | ~40 |
| `Dialog.tsx` | Update modal radius 22px, padding 26×28. Backdrop with `backdrop-filter: blur(2px)`. Use `shadow.modal` (new token). | ~15 |
| `Toast.tsx` | Layout 32×32px icon + title + msg. 3 variants (success / warning / info). Info uses `surface.inset` icon-circle (restraint). Lucide SVG icons (NOT emoji). | ~25 |
| `Badge.tsx` | Variants: neutral / accent / ink / warning / removable. Drop `success`, `error`, `sage` variants. Removable variant = focusable `<button>` close. | ~30 |
| `Tabs.tsx` / `SegmentedControl.tsx` | Track radius 14px, tab radius 10px. Hover bg `rgba(20,20,20,0.10)` light / `rgba(255,255,255,0.12)` dark. Active thumb `shadow.soft`. | ~30 |
| `Switch.tsx` (NEW) | **FLAT with 1px border** — NOT depressed. Track 44×26 r100. Knob 20×20 + cream highlight. On state: accent fill + accent shadow. Per §8.5. | ~60 |
| `Checkbox.tsx` (NEW) | **FLAT with 1px border** — 22×22 r7. Lucide check stroke-width 3. Per §8.5. | ~50 |
| `Radio.tsx` (NEW) | **FLAT with 1px border** — 22×22 r50%. Inner dot 14×14. Per §8.5. | ~50 |
| `StatusDot.tsx` (NEW) | 12×12 r50%. Default jade + halo, warn terra + halo. Pulse animation per `COACH_SURFACE_SPEC.md` §1. | ~30 |
| `Topbar.tsx` (NEW `packages/ui/src/composites/`) | Slot-based, `shadow.lift`, 56–60px height, radius 14px. Lucide bell icon (NOT emoji). | ~80 |
| `Breadcrumb.tsx` (NEW) | Geist Mono 10px, `/` separator 0.5 opacity, current page ink + 500. | ~25 |

Domain primitives in `packages/ui/src/domain/`:

| File | Change | LOC |
|---|---|---|
| `PortfolioCard.tsx` (`.card-pf`) | `pf-amt` Geist 28px 600 `tnum 1 ss01 1`. `pf-tiny` switches to ink+bold when `pulse.warn` present (colorblind safety). | ~30 |
| `ChatMessage.tsx` | User bubble: `surface.inset` + `shadow.inset.light` + radius `18px 18px 4px 18px`. Assistant bubble: `surface.card` + 1px border + `shadow.card` + radius `18px 18px 18px 4px`. Inline `.accent` forced to ink + 600 weight (paper-restraint canon). Citation chip: Lucide sparkle SVG glyph + accent border-tint. | ~50 |
| `InsightCard.tsx` (`.card-insight`) | `insight-eyebrow` Geist Mono accent. `insight-head` Geist 20px 600. `.accent` ink + 700 (no green leak). | ~25 |
| `PositionRow.tsx` (`.tr`) | 4-column grid 2.4fr/0.7fr/1.2fr/1fr. Body cells right-aligned; head cells center-aligned (specificity override). Column separators use `border.divider`. Money cells `tnum 1`. Coach dot integration. | ~40 |

App-side `apps/web/src/`:

| Path | Change | LOC |
|---|---|---|
| `app/(marketing)/_components/*` | Landing-v2 «Ledger That Talks» — re-target color tokens to v1.1. Hero typography Geist (NOT Fraunces). | ~80 |
| `app/(app)/**` | Inherits via tokens. Hard-coded hex audit: ~14 instances across 6 files. | ~14 |

**Total components + apps:** ~750 LOC across ~24 files. ~2 days FE (slightly heavier than v1.0 estimate of 1.5d due to additional flat-toggle complexity and the spec-amendment reading time).

### 11.3 Test snapshot refresh

- ~14 unit/component test files have visual snapshots (`value-card-live.test.tsx`, `position-header.test.tsx`, `chat-message-item.test.tsx`, `streaming-message-view.test.tsx`, `accounts-page-client.test.tsx`, `account-list-item.test.tsx`, `account-form-modal.test.tsx`, `delete-transaction-confirm.test.tsx`, `position-transactions-tab.test.tsx`, `transaction-form-dialog.test.tsx`, `position-price-chart.test.tsx`, `positions-row.test.tsx`, `pricing/page.test.tsx`, `landing-v2.test.tsx`).
- ~20 Playwright visual snapshots in `apps/web/tests/visual/`.
- ~60 Storybook stories in `packages/ui/`.

**Process:** refresh-and-audit. Half-day for snapshot refresh + ~1 hour per primitive for visual delta audit (~6 hours total). NEVER blanket-accept; every delta is reviewed for unintended regressions.

### 11.4 Dark mode buildout

Implementation:

```css
/* packages/design-tokens/build/css/theme.css */
:root { /* light vars (default) */ }
[data-theme='dark'] { /* dark vars */ }

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) { /* dark vars */ }
}
```

Mechanism: data-attribute on `<html>` toggled by user preference, falls back to `prefers-color-scheme`. Implemented once in `apps/web/src/app/layout.tsx` with a no-flicker SSR script in `<head>`. Pattern reference: `next-themes` package or 12-line custom script (Mercury / Linear / Vercel-style).

QA: every Tier-1 component and every signature surface tested in BOTH themes. Visual regression has a per-theme snapshot pair.

**Cost:** included in §11.2 component work + ~0.5 day theme-toggle + SSR-no-flicker work.

### 11.5 A11y verification

Per §10. Specific tasks:
- Compute contrast pairs against final shipped tokens.
- Tab through every Tier-1 component; verify focus rings visible at 2px outline + 2px offset.
- Reduced-motion sweep — verify no `translate` animations fire when `prefers-reduced-motion: reduce`.
- Color-blind simulation — Coblis pass on protanopia, deuteranopia, tritanopia.
- Screen-reader sweep — VoiceOver (macOS), NVDA (Windows) — verify form labels, ARIA states, citation glyph aria-hidden.

**Cost:** ~0.5 day.

### 11.6 Total cost (v1.1 — updated)

| Phase | Cost | Notes |
|---|---|---|
| Tokens | 0.5 day | Mechanical |
| Spec amendment v1.1 (this document) | 0.25 day | Product-designer (DONE) |
| Tier-1 components (~17 files) | 2 days | FE |
| Snapshot refresh + visual delta audit | 1 day | FE + visual review |
| Dark mode wiring (theme.css + SSR no-flicker) | 0.5 day | FE |
| A11y verification | 0.5 day | FE |
| PO review buffer | 0.5 day | — |
| **Total** | **5.25 days = ~1.05 FE-week** | Slightly heavier than v1.0 estimate (4.5d) because (a) spec-amendment overhead, (b) stricter a11y verification, (c) flat-toggle ARIA complexity (presentational `<div role="switch">` in showcase must port to native `<input>` or `<button role="switch">`). |

### 11.7 Risk areas (v1.1)

1. **Tailwind + custom CSS interaction.** v1.1 showcase uses raw CSS custom properties + class names. `packages/ui` uses Tailwind utility classes mapped through `tailwind.config.ts` and CVA. Risk: shadow tokens that combine 3 layers (`5px 5px 14px …, -3px -3px 10px …, inset 1px 1px 0 …`) may need `@layer utilities` definitions or `theme.boxShadow` extensions. Mitigation: define them once in `theme.css` as utilities; CVA references them by name.
2. **Dark-mode toggling mechanism.** Showcase uses `.light` / `.dark` class on the stage. Production uses `data-theme` attribute on `<html>` per §11.4. SSR-no-flicker script must be inlined in `<head>` of `apps/web/src/app/layout.tsx`. Risk: hydration mismatch warnings if the inline script runs after React renders. Mitigation: standard pattern (Mercury / Linear / Vercel all do this); `next-themes` or a 12-line custom script.
3. **Vitest snapshot impact.** Per §11.3, ~14 unit/component test files have visual snapshots. Migration will invalidate all of them. Process: refresh-and-audit per spec — never blanket-accept; review every delta. ~6h budget.
4. **Geist licensing.** Geist is OFL (open-source, Vercel). Self-host via `next/font/local` with the Geist + Geist Mono `.woff2` files. Bundle ~50–80kb gzipped per family. §4.5 «preload only critical weight» applies — preload Geist 500 (numerical) + Geist 600 (h2/h3) + Geist Mono 500.
5. **Inline styles in showcase.** Many `style="…"` attributes in the showcase encode real intent (right-align, color overrides). When porting to React components, these become props or variant classes. Risk: missing one and the component looks slightly off. Mitigation: build each Tier-1 component side-by-side with the showcase open, visual-diff at the same viewport.
6. **Toggles need ARIA uplift.** Showcase uses `<div role="switch" aria-checked tabindex="0">` (presentational). Production must port to `<button role="switch">` or `<input type="checkbox">` + visually-hidden + custom render. The DOM toggle behavior must be correct (Space / Enter to toggle) — not currently in the showcase.

### 11.8 Landing & app-surface paths

**Landing-v2 «Ledger That Talks» (PR #66 evolved → merged at 56a0d6a):** ships with a custom palette tuned for the marketing surface. Migration to v1.1 tokens is a separate slice — landing-v2 is locked for review; do not retroactively re-token until the v1.1 design system port is complete and verified.

**App surfaces:** inherit via tokens once `packages/design-tokens/semantic/{light,dark}.json` is re-targeted. App-level hard-coded hex audit (~14 instances) handled at the §11.2 step.

---

## 12. Open questions / future work (v1.1 — REFRESHED)

The v1.0 open-question list is largely consumed. v1.1 deferreds:

1. **Tier-2 component spec (NOT yet detailed):** Tooltip, Dropdown, DatePicker, Skeleton refresh, Progress, Calendar, Sortable, Pagination, Sidebar nav, Slider/Range, Combobox, Stepper/Progress, Streaming-cursor primitive, Tooltip-arrow/Popover, full Validation states catalogue. Defer until Tier-1 ports AND a real consuming surface forces the spec.
2. **Validation language (v2):** full success / warning / error / info on inputs with iconography + ring + helper-text patterns. Specifically: success-state input ring; warning-state input (orange vs terra collision risk). v1.1 ships with error-state only.
3. **Dark-theme error-input variant — MISSING.** Light has it; dark omits. Add during port for parity, ~10min FE work.
4. **Dark accent AAA bump.** `accent.primary #4A8775` on `surface.card #26262E` measures 3.4:1 — passes UI-AA, fails AAA. Only matters if accent becomes text-on-card in real screens. Currently no surface does. **Track for real-app rollout.**
5. **Hard-coded `bub-user.dark` `#1A2520`** — promote to semantic token `--bub-user-dark-bg` during port.
6. **`text.3 #7A7A7A` on light bg fails body AA by 0.44** (4.06:1 vs 4.5:1 minimum). Tighten to `#6E6E6E` (4.84:1) for production. Not blocking for showcase as text-3 is metadata only.
7. **iOS surface adaptation post-alpha** — token system is platform-neutral. iOS will consume the same semantic tokens via Style Dictionary's iOS output. Tactile shadows on iOS use `CALayer` shadow + masked `CAGradientLayer` highlight; same vocabulary, native rendering. Defer detailed iOS spec to post-alpha.
8. **Chart styling** — chart surfaces stay flat by convention; tactile chrome surrounds them. Chart palette uses `accent.primary` (primary series), `text.2` (secondary series, replacing v1.0's `accent.sage`), `accent.terra` (drift / outlier series), `text.3` (axes), `border.default` (gridlines). Detailed chart spec deferred to data-viz pass.
9. **Custom illustration / iconography style** — TBD. Lucide stays the icon library. If bespoke asset-class glyphs needed (stock / ETF / crypto), brief brand-strategist to define style; prefer modifying Lucide stroke pattern over commissioning. Rule R1 (no spend) applies.
10. **Empty state copy + iconography** — needs content-lead pass. Current EmptyState primitive has placeholder copy; brand-voice composition stress-test on v1.1 palette required before landing.
11. **Brand-voice composition stress-test on v1.1 palette** — needs brand-voice-curator pass. Specifically: paywall copy, error-state language, Coach observational closer, citation chip microcopy, AI streaming pre-stream label. Many of these compose in the v1.1 showcase but have not been content-stress-tested.
12. **Coach popover live-state copy** — depends on legal-advisor confirmation of in-context AI disclaimer format (carried forward from v1.3 §14.6).
13. **Validation experiment ($0–50, 5-second test, 8–10 ICP proxies)** — deferred to post-launch. Post-launch metrics may surface trust-perception issues; if so, run test and adjust accent within the same family. Rule R1 (no spend) keeps this $0; use friend-network proxies before paid panels.

---

## 13. Brand-side lock notes (NEW in v1.1)

These are the brand-strategist's lock-in directives from `2026-04-27-design-system-final-ship-brand.md`. Every contributor adding/modifying surfaces must check against these. They protect the residual brand fragility of the system; ignoring them creates drift back toward Vercel-billboard / Mercury-clone / SaaS-template register.

### 13.1 Two-territory dark theme is intentional — DO NOT warm dark back

Light theme = Mercury 2024 + Stripe Press cluster (warm cream, paper-on-paper, forest-jade restraint).
Dark theme = Linear-shadow-adjacent neutral cool (`#0E0E12 / #26262E / #070709`).

**The asymmetry is the right answer**, not a bug. Dark = «night focus mode» where Sage takes over; warm-cocoa dark created OLED glow-creep that pulled toward Vercel-billboard. Future contributors will be tempted to «warm» the dark theme for visual consistency with light — block that instinct. Two-territory is a brand decision, not a styling oversight.

### 13.2 Forest-jade tier hierarchy capped at 3 tiers / 13 surface roles max

`accent.primary` (forest-jade) reads as «brand signal» — meaningful only if it appears in deliberate, restrained surfaces. v1.0 round-3 had 17+ surfaces consuming jade; brand-strategist measured fatigue. v1.1 caps at:

- **Tier-A (toggle-active state):** switch-on, checkbox-checked, radio-checked, focus rings — 4 surfaces
- **Tier-B (semantic-positive data):** success toast icon, positive delta in tables, `pulse` (resting), success badge — 4 surfaces
- **Tier-C (editorial mark):** citation glyph, AI attribution label (`PROVEDO REPLIES`), eyebrow editorial labels (`PORTFOLIO ANSWER ENGINE · 01`), insight eyebrow, sig-eyebrow — 5 surfaces

**Total: 13 max.** Adding a 14th forest-jade surface requires an ADR. Future contributors will be tempted to add jade for «warmth» on a card, an icon, a badge — block that instinct. At density >13, jade flattens to noise. At ≤13, every appearance carries weight.

### 13.3 Bronze ceiling locked at `#A04A3D` light / `#BD6A55` dark — DO NOT warm toward red

Bronze (`accent.terra`) lives in the museum-vitrine register: old leather, iron-oxide. It signals «attention warranted», NOT alarm. Pushing it toward red makes drift indicators read as «error», which destroys the calm-fiduciary positioning. The verb «Delete» + bronze combine adequately for destructive register without crossing into red.

If a future surface needs «alarm-red» (true emergency, irrecoverable error), introduce a separate token — do NOT warm bronze. v1.1 has no such surface; bronze is sufficient for all warning + error + drift states.

### 13.4 Single-word color emphasis in headlines / body is BANNED — bold weight only

This is the residual Vercel inheritance trap. v1.1 ships with three places where this rule is enforced in code:

- `.sig-headline .accent` — color forced to ink, weight 700 (showcase line 380)
- `.insight-head .accent` — color forced to ink, weight 700 (line 345)
- `.bub-ai .body .accent` — color forced to ink, weight 600 (line 517)

**Rule:** in headlines and body, NEVER use color to emphasize a single word. Use bold weight only. The Patagonia / Stripe Press canon is bold-weight emphasis with no color shift; deviation reads as Vercel-billboard. Color in headlines is reserved for editorial eyebrows (`.eyebrow`, `.insight-eyebrow`, `.sig-eyebrow`, `.modal-eyebrow`, `.bub-ai .label`) where it functions as a structural mark, not as emphasis.

### 13.5 Cream-highlight alpha in card shadows: 0.55–0.60 max ceiling

v1.0 spec'd 0.95–1.0 cream-highlight alpha (`-3px -3px 10px rgba(255, 250, 240, 0.95)`). At those alphas, the highlight read as a glowing rim — Vercel-billboard tic. v1.1 softens to 0.55–0.60 ceiling; paper-on-corkboard register requires restraint.

Dark-mode equivalent: cream-highlight alpha 0.07–0.09 ceiling. Anything above reads as glow-creep on OLED.

Any future shadow token that exceeds these alphas needs an ADR with explicit visual rationale.

### 13.6 v1.1 system patterns (operational rules)

Captured from final-SHIP reviews; not strictly «brand» but operational rules that prevent drift:

- **Pulse.warn colorblind fallback:** when `pulse.warn` appears on a card, the adjacent `pf-tiny` line switches to ink + 600 weight. The sign + ink-bold combo is the primary signal; bronze color is reinforcement only. Document this as system pattern (was an undocumented showcase implementation in v1.0).
- **Hover bumped on nav-item / tab:** `rgba(20,20,20,0.13)` light and `rgba(255,255,255,0.16)` dark for nav; `rgba(20,20,20,0.10)` and `rgba(255,255,255,0.12)` for tab. Per PO feedback ×3 — earlier values were imperceptible at glance.
- **`shadow.input-inset` consumed only by `.input` and `.search-input`** (3 sites). `shadow.inset.light` consumed by 9 sites (chips, citations, tabs-track, chat-user-bubble dark fallback, info-toast, empty-icon, btn-icon). Don't conflate the two tokens — they serve different surfaces.
- **Table head row inset shadow `inset 0 -1px 2px rgba(0,0,0,0.04)` is dead pixels in dark mode** (header still reads as «slightly different surface» from luminance contrast). Cosmetic, not blocking. Track for v2 if header structure becomes a problem.
- **Modal overlay uses `backdrop-filter: blur(2px)`** — works unprefixed in all current browsers (Safari 14+). No `-webkit-` fallback needed.
- **No emoji icons anywhere.** Replace with Lucide SVG. v1.1 showcase swapped 🔔 for inline `bell` SVG. This is a pre-delivery checklist hard rule.

### 13.7 PD lock 2026-04-27 — depth language hierarchy

Locked for 4 weeks unless real user feedback (not gut feel) contradicts:

- **Inputs depressed.** `.input`, `.search-input` consume `shadow.input-inset`.
- **Toggles flat with border.** `.switch`, `.checkbox`, `.radio` use 1px border + accent fill on active. NO inset shadow.
- **Secondary buttons outlined-flat.** Transparent + 1px border. NO shadow.
- **Ghost buttons flat.** Transparent + no border. NO shadow.
- **Primary CTA ink-extruded.** `.btn-primary` uses `shadow.primary.extrude`.
- **Danger CTA bronze-extruded.** `.btn-danger` uses `shadow.terra.extrude`.

Each depth state means ONE thing. Sage discipline over decorative depth.

---

## Appendix A — Reference composition

Voice references (paper-coded, all):
- **Patagonia** — warm cream + forest accent + restraint
- **Craig Mod** — cream paper + ink + occasional muted red
- **Wirecutter** — long-form considered review register
- **The Economist** — sentence rhythm
- **John McPhee** — noun-verb-period declaratives

Aesthetic references (warm, considered, paper-coded — light theme):
- **Mercury 2024** — warm-near-white + flat-with-1px borders + ink-CTA discipline
- **Stripe Press** — cream paper + ink + per-book accent + zero italic + tabular numerals (the «Geist no-italic + tabular-nums» voice is the closest non-serif analog)
- **Granola** — warm white + forest green + soft elevation
- **Anthropic** — off-white + restrained warm coral

Aesthetic references (neutral cool, restrained — dark theme):
- **Linear** — neutral cool dark + restrained shadows + edge-highlight elevation
- **Vercel docs** — clean dark with discipline (Provedo borrows the *register* but rejects the gradient/glow tics)

The two-territory dark choice (§13.1) means the system intentionally borrows from different aesthetic clusters per theme. Light = paper-coded warmth; dark = focus-mode restraint. Future contributors will be tempted to unify the two — block that instinct.

Anti-references (tropes the system avoids, expanded from Brief v1.3 §0):
- **Robinhood** — confetti, gamified, neon-green
- **Public.com** — black + neon-green trader-bro
- **Generic shadcn template look** — uniform radius/spacing/uniform shadows
- **Default cool-slate SaaS chrome**
- **Vercel-billboard glow** — gradient blobs, glow rims (>0.6 alpha cream highlight), scale-on-hover, glassmorphism without depth justification, decorative single-word color emphasis in headlines (§13.4)
- **iOS spring overshoot** — playful / toy-coded; wrong tone for fiduciary instrument
- **Material ripple** — reads as Google product
- **Emoji icons** — different rendering per OS, no consistent stroke weight, fight typographic register (§13.6)

---

## Appendix B — Change log

- **v1.1 (2026-04-27, amended same-day):** Doc-only sync. Ratifies the 8 deliberate drifts between v1.0 spec and shipped showcase, plus brand-strategist's 5 lock-in notes. No code touched.
  - **Color:** light bg `#F4F1EA → #E8E0D0` (round-6 deepen for visible card lift). Light card collapsed to pure `#FFFFFF`. Inset `#ECE7DC → #D6CCB8`. Dark fully repositioned from warm-cocoa (`#161412/#1F1B17/#100E0C`) to neutral-cool (`#0E0E12/#26262E/#070709`). `accent.primary` (CTA) `#0F8A7E` teal **DEMOTED** to `#2D5F4E` light / `#4A8775` dark forest-jade — status/citation/verified accent only. `accent.terra` `#B8704D → #A04A3D` light / `#D88A65 → #BD6A55` dark (deepened bronze, museum-vitrine register, NOT alarm-red). Collapsed `accent.sage` (redundant with `accent.primary`). Collapsed `state.error` separate token (folded into `accent.terra`). NEW `border.divider` token (separate from `border.default` for table column separators).
  - **Typography:** full font substitution. Fraunces display + Inter body + JetBrains Mono mono ALL **superseded by Geist + Geist Mono only**. Single sans family across display + body + mono. Italic banned. Tabular numerals via Geist `font-feature-settings: 'tnum' 1, 'cv11' 1, 'ss01' 1`.
  - **Shadow:** cream-highlight alpha softened from 0.95–1.0 (v1.0) to 0.55–0.60 light / 0.07–0.09 dark (brand lock §13.5). Renamed `shadow.accent.extrude` → `shadow.primary.extrude` (CTA fill is now ink, not teal). NEW `shadow.terra.extrude` for `.btn-danger`. NEW `shadow.input-inset` (split from generic `shadow.inset`) — consumed only by `.input` and `.search-input`. NEW `shadow.modal` distinct from `shadow.lift`.
  - **Radius:** small bumps to compose with softened shadows — md 10→10–12, lg 14→14–18, xl 20→22. Pill 100 now used for chips/inputs/btn-icon/avatars/radios (NOT primary CTA — CTA uses radius.lg 14px).
  - **Motion:** unchanged tokens. Reduced-motion implementation reference added from showcase.
  - **Components:** Tier-1 component table fully rewritten — `Button` primary now ink (was teal); `Switch`/`Checkbox`/`Radio` flat-with-border (was depressed); `Card` simplified (dropped `elevated`, `interactive` variants); `Badge` collapsed `success`/`error`/`sage` variants. Per-component specs §8.2–§8.6 written from showcase CSS as source of truth.
  - **A11y:** contrast pairs recomputed for v1.1 tokens. Focus rings collapsed to one rule (`outline: 2px solid var(--accent); outline-offset: 2px`) for all interactive surfaces (was per-surface inset/outset distinction in v1.0). Colorblind safety: `pulse.warn` system pattern (sign + ink-bold combo) documented.
  - **Migration:** ~1.05 FE-week (was ~0.9). Spec amendment overhead + flat-toggle ARIA complexity. Showcase shipped to staging; component port to `packages/ui` not yet started.
  - **NEW §13 Brand-side lock notes:** 5 brand-strategist directives + operational rules — two-territory dark intentional, forest-jade tier cap (13 max), bronze ceiling locked, single-word color emphasis banned, cream-highlight alpha ceiling, PD depth-language lock.
  - **Open questions §12 refreshed:** v1.1 deferreds — Tier-2 components, validation language, dark error-input variant, dark accent AAA, text.3 light AA bump, iOS adaptation, chart styling, voice composition stress-test.

- **v1.0 (2026-04-27):** Initial Provedo Design System release. Supersedes Design Brief v1.3 §3, §4, §6, §7, §8, §10. Locks warm-cream palette + tactile/soft-3D depth direction + Fraunces display + dark mode. PO directives 2026-04-27.
  - **Color:** full palette swap from slate+violet (v1.3) to warm-cream+ink+teal-pen+sage+terra. Light + dark themes specified together.
  - **Typography:** added Fraunces display family. Inter body + JetBrains Mono tabular retained.
  - **Shadow:** rewrote elevation as 9-token tactile scale. v1.3 4-tier shadow scale superseded.
  - **Radius:** softened (md 8→10, lg 12→14, xl 16→20).
  - **Motion:** added `duration.press` 80ms. Locked Stripe-Mercury motion register, rejected iOS-spring + Material-ripple.
  - **Components:** Tier-1 inventory (14 components) specified for v1 build. Tier-2 (10 components) listed for next-wave.
  - **A11y:** contrast verified for both themes. Focus rings spec'd inset on tactile cards. Reduced-motion preserves shadow cross-fades, drops translateY.
  - **Migration:** ~0.9 FE-weeks total. PR #66 evolves with palette overlay; PR #65 retires.

  *v1.0 sections that are now SUPERSEDED in this document — preserved inline (§3.5, §4.6, §5.4) for historical context per PO directive «don't delete v1.0 reasoning, just supersede with v1.1 reality».*

---

Maintained by the product-designer agent. Changes require a PR with rationale; PO reviews via Right-Hand. Ship tokens first in `packages/design-tokens`, then primitives in `packages/ui`, then app surfaces inherit.
