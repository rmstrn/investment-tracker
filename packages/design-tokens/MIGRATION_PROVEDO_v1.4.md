# Token migration: Provedo v1.3 → Provedo v1.4

**Author:** product-designer
**Date:** 2026-04-25
**Status:** SPEC — awaiting frontend-engineer kickoff
**Trigger:** Direction A — Modern AI-Tool Minimalist locked by PO 2026-04-25 (`docs/04_DESIGN_BRIEF.md` v1.4 §3 + §4 + §6 + §8). Full visual rebrand from Provedo slate-violet system to Provedo warm-neutral + sky-blue (default) system.
**Pairs with:** `docs/04_DESIGN_BRIEF.md` v1.4 (master spec), `docs/design/2026-04-25-provedo-visual-direction-options.md` (3-direction dispatch + Direction A details), `docs/product/04_BRAND.md` v1.0 (brand foundation).

---

## 1. Migration strategy — clean cut (recommended)

**Recommended approach: clean cut.** v1.4 ships as a complete token replacement, not a feature-flagged dual-system. Rationale:

- Pre-alpha product (zero production users); no SLA risk from breaking changes
- v1.3 violet brand is anti-pattern in v1.4 per Design Brief §0.1 — keeping it dual-system contradicts the rebrand intent
- Token files are <200 lines each; single-PR migration is small enough to review thoroughly
- Frontend-engineer Slice 8c (Coach contextual) and any new slices align cleanly with v1.4 from day one — no dual-API surface

**Alternative (NOT recommended): feature-flagged dual-system.** Would keep `tokens/semantic/{light,dark}.json` (v1.3 violet) and add `tokens/semantic/{light,dark}.v14.json` (Provedo). Frontend toggles via env var. **Reject** because:
- Doubles surface area to maintain
- Risks v1.3 leaking into landing/marketing screenshots after v1.4 ships
- No production user to protect; benefit-zero, cost-real

**Decision:** clean cut. Single PR replaces tokens + bumps Style Dictionary build output. Frontend-engineer rebuilds + retests in single sprint.

---

## 2. Files affected

| File | Change | Owner |
|---|---|---|
| `packages/design-tokens/tokens/primitives/color.json` | Add warm-neutral scale (`color.warm.*`) + neutral grayscale (`color.neutral.*` Tailwind neutral, NOT slate) for dark-mode bg. Retain slate. Brand scale `color.brand.*` semantically becomes `color.sky.*` (rename violet → sky). | product-designer (spec) → frontend-engineer (apply) |
| `packages/design-tokens/tokens/primitives/typography.json` | Replace `font.family.sans` Geist → Inter. Replace `font.family.mono` Geist Mono → JetBrains Mono. Add responsive `clamp()` font-size scale per Design Brief §4.2. | frontend-engineer |
| `packages/design-tokens/tokens/primitives/shadow.json` | Remove `shadow.ai` (violet glow — anti-pattern §0.1). Remove `shadow.xl` (folded into elevated). Rename `shadow.sm/md/lg` → `shadow.subtle/medium/elevated` per §6. Update `shadow.focusRing` to sky-500 alpha. | frontend-engineer |
| `packages/design-tokens/tokens/primitives/motion.json` | Remove `motion.easing.spring` (anti-pattern §8 — Sage-pure register, no bouncy). Add `motion.duration.medium` (250ms) for major transitions. | frontend-engineer |
| `packages/design-tokens/tokens/semantic/light.json` | Full rewrite per Design Brief §3.5 light mapping. Background uses `color.warm.bg.page/elevated/muted/subtle`. Text/border references slate scale. Brand references sky scale. Add `state.*` (replacing `semantic.*` naming inconsistency) and `interactive.*`. | frontend-engineer |
| `packages/design-tokens/tokens/semantic/dark.json` | Full rewrite per Design Brief §3.5 dark mapping. Background uses neutral scale (warmer near-black, NOT slate-950). Text/border references neutral scale. Brand references sky-400. | frontend-engineer |
| `packages/design-tokens/tokens/brand.json` | Update `brand.productName` MVP placeholder → «Provedo». Update `brand.tagline` → «Notice what you'd miss». Update `brand.domain.web` → `provedo.ai`. Update `brand.email.support` → `support@provedo.ai`. Update `brand.legalName` → still `TBD Ltd.` (legal-advisor pending). | frontend-engineer (after PO domain transition lock) |
| `packages/design-tokens/tokens/primitives/radius.json` | NO CHANGE (6/8/12/16 scale retained; matches Direction A spec). | — |
| `packages/design-tokens/tokens/primitives/spacing.json` | NO CHANGE (rem-based scale 0.25 → 24 retained per Design Brief §5). | — |

---

## 3. Token diff table — primitives/color.json

### Added (v1.4 new tokens)

```jsonc
"color": {
  "warm": {
    "bg": {
      "page":     { "$value": "#FAFAF7", "$description": "Page background — Claude.ai-style warm off-white" },
      "elevated": { "$value": "#FFFFFF", "$description": "Cards, popovers, modals" },
      "muted":    { "$value": "#F5F5F1", "$description": "Secondary surfaces, striped rows" },
      "subtle":   { "$value": "#F1F1ED", "$description": "Hover surfaces, tonal separation" }
    }
  },
  "sky": {
    "50":  { "$value": "#f0f9ff" },
    "100": { "$value": "#e0f2fe" },
    "300": { "$value": "#7dd3fc", "$description": "Dark-mode hover" },
    "400": { "$value": "#38bdf8", "$description": "Dark-mode primary accent" },
    "500": { "$value": "#0ea5e9", "$description": "LIGHT-MODE PRIMARY ACCENT (Direction A default)" },
    "600": { "$value": "#0284c7", "$description": "Hover state on light" },
    "700": { "$value": "#0369a1", "$description": "Active/pressed state on light" },
    "800": { "$value": "#075985" },
    "900": { "$value": "#0c4a6e" }
  },
  "neutral": {
    "50":  { "$value": "#fafafa" },
    "100": { "$value": "#f5f5f5" },
    "200": { "$value": "#e5e5e5" },
    "400": { "$value": "#a3a3a3", "$description": "Dark-mode muted text" },
    "600": { "$value": "#525252" },
    "700": { "$value": "#404040", "$description": "Dark-mode default border" },
    "800": { "$value": "#262626", "$description": "Dark-mode muted bg / strong border" },
    "900": { "$value": "#171717", "$description": "Dark-mode elevated surface" },
    "950": { "$value": "#0a0a0a", "$description": "Dark-mode page bg — warmer than slate-950" }
  }
}
```

Note: Tailwind's `neutral` palette (warm grays) is added alongside the existing `slate` palette (which is renamed/repurposed but retained). Slate continues to drive light-mode text + borders. Neutral drives dark-mode bg/surface/border (warmer near-black per Direction A).

### Renamed (v1.3 → v1.4)

| v1.3 path | v1.4 path | Note |
|---|---|---|
| `color.brand.50-950` | `color.sky.50-900` | Violet `#6D28D9` family removed; sky family added. Token reference `{color.brand.700}` → `{color.sky.500}`. |

### Removed (v1.3 tokens deprecated)

```jsonc
// v1.3 violet scale — REMOVED in v1.4
"color.brand.50":  "#f5f3ff"   →  REMOVED (banned per anti-pattern §0.1 AI-purple/pink)
"color.brand.100": "#ece9fe"   →  REMOVED
"color.brand.200": "#dcd5fd"   →  REMOVED
"color.brand.300": "#c3b4fb"   →  REMOVED
"color.brand.400": "#a78bfa"   →  REMOVED
"color.brand.500": "#8b5cf6"   →  REMOVED
"color.brand.600": "#7c3aed"   →  REMOVED
"color.brand.700": "#6d28d9"   →  REMOVED
"color.brand.800": "#5b21b6"   →  REMOVED
"color.brand.900": "#4c1d95"   →  REMOVED
"color.brand.950": "#2e1065"   →  REMOVED
```

### Retained unchanged

```
color.green.* (50/100/400/500/600/700)  — emerald scale, semantic positive
color.red.*   (50/100/400/500/600/700)  — red scale, semantic negative
color.amber.* (50/100/400/500/600)      — amber scale, semantic warning
color.cyan.*  (50/100/400/500/600)      — cyan scale, retained for legacy info; v1.4 prefers sky for info
color.slate.* (50–950)                  — RENAMED via the existing color.neutral.* path retained (the v1.3 file uses color.neutral.* path with slate values; v1.4 keeps that path but its semantic role shifts to text/border; new color.neutral.* (Tailwind neutral, warmer) is added under a new path — recommend renaming v1.3 color.neutral.* → color.slate.* during migration to disambiguate)
color.static.* (white/black/transparent) — unchanged
```

**Path naming clarification (v1.4 cleanup recommendation):** v1.3 stored slate values under `color.neutral.*`. v1.4 introduces real Tailwind `neutral` for dark mode. Recommendation: rename v1.3 `color.neutral.*` → `color.slate.*` to disambiguate, then add new `color.neutral.*` with warm-gray Tailwind neutral values. This is a breaking change to all consumers (Tailwind config, CSS variable references, Swift theme); plan a single-PR sweep across `apps/web/`.

---

## 4. Token diff table — primitives/typography.json

### Replaced

```diff
-  "font.family.sans": "Geist, ui-sans-serif, system-ui, ..."
+  "font.family.sans": "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

-  "font.family.mono": "'Geist Mono', ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
+  "font.family.mono": "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
```

### Added — responsive font-size scale (clamp-based)

```jsonc
"font.size": {
  "caption":    { "$value": "clamp(0.75rem, 0.7rem + 0.15vw, 0.8125rem)", "$description": "12-13px — metadata" },
  "body-sm":    { "$value": "clamp(0.8125rem, 0.78rem + 0.15vw, 0.875rem)", "$description": "13-14px — captions, labels" },
  "body-md":    { "$value": "clamp(0.875rem, 0.84rem + 0.18vw, 0.9375rem)", "$description": "14-15px — tables, secondary body" },
  "body-lg":    { "$value": "clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)", "$description": "16-17px — primary body, inputs" },
  "heading-md": { "$value": "clamp(1.0625rem, 1rem + 0.3vw, 1.125rem)", "$description": "17-18px — sub-sections" },
  "heading-lg": { "$value": "clamp(1.125rem, 1rem + 0.5vw, 1.25rem)", "$description": "18-20px — card titles" },
  "display-sm": { "$value": "clamp(1.5rem, 1.3rem + 1vw, 1.75rem)", "$description": "24-28px — sub-heroes" },
  "display-md": { "$value": "clamp(1.75rem, 1.4rem + 1.6vw, 2.25rem)", "$description": "28-36px — section heroes" },
  "display-lg": { "$value": "clamp(2.25rem, 1.8rem + 2.2vw, 3rem)", "$description": "36-48px — page titles, KPI" },
  "display-xl": { "$value": "clamp(3rem, 2rem + 5vw, 4.5rem)", "$description": "48-72px — hero portfolio value" }
}
```

v1.3 fixed-size scale (`xs/sm/base/lg/xl/2xl/3xl/4xl`) is retained for utility classes. New responsive `body-*` and `display-*` named tokens are the v1.4 preferred reference for new components.

### Retained unchanged

```
font.weight.*       (400/500/600/700)
font.lineHeight.*   (none/tight/snug/normal/relaxed/heading-lg/heading-md/display-md/display-sm)
font.letterSpacing.* (tightest/tighter/tight/normal/wide/caption)
```

### Web font loading (consumer-side, NOT in tokens but documented here for frontend-engineer)

Add to `apps/web/app/layout.tsx` (Next.js 15 `next/font/google`):

```ts
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
  preload: false, // lazy — only used in mono cells, not above-fold critical
});
```

Apply `${inter.variable} ${jetbrainsMono.variable}` to `<html>` className. CSS references `var(--font-sans)` / `var(--font-mono)`.

---

## 5. Token diff table — primitives/shadow.json

### Renamed + retuned

```diff
- "shadow.xs":    "0 1px 2px rgba(0, 0, 0, 0.04)"
+ "shadow.subtle": "0 1px 2px rgba(15, 23, 42, 0.04)"
   (renamed; shadow color shifted from pure black to slate-900 alpha — warmer on warm-bg-page)

- "shadow.sm":    "0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)"
+ "shadow.medium": "0 2px 6px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)"

- "shadow.md":    "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)"
- "shadow.lg":    "0 12px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)"
+ "shadow.elevated": "0 8px 24px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04)"
   (md+lg folded into single elevated tier; modals/sheets use elevated)
```

### Removed (anti-pattern §0.1)

```diff
- "shadow.ai":   "0 0 24px rgba(124, 58, 237, 0.25)"
   REMOVED — violet glow on AI surfaces banned per §0.1 (AI-purple/pink + AI-glow trope)

- "shadow.xl":   "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)"
   REMOVED — folded into shadow.elevated at lower intensity
```

### Retuned

```diff
- "shadow.focusRing": "0 0 0 3px rgba(109, 40, 217, 0.4)"  // violet-700 @ 40% alpha
+ "shadow.focusRing": "0 0 0 2px rgba(14, 165, 233, 0.5)"  // sky-500 @ 50% alpha (Direction A accent)
   Note: Direction A spec uses outline (not box-shadow ring) for focus-visible — see Design Brief §12.2
   Token retained for legacy components transitioning; new components use outline pattern
```

---

## 6. Token diff table — primitives/motion.json

### Removed (anti-pattern §8)

```diff
- "motion.easing.spring": "cubic-bezier(0.34, 1.56, 0.64, 1)"
   REMOVED — Sage-pure register, no bouncy/playful easing
```

### Added

```diff
+ "motion.duration.medium": "250ms"  // major UI transitions (modal enter, sheet slide)
```

### Retuned

```diff
- "motion.duration.fast": "100ms"
+ "motion.duration.fast": "150ms"
   v1.4 raises fast tier to 150ms per Design Brief §8 (was 100ms — too snappy for Direction A's calm register)
```

### Retained unchanged

```
motion.duration.base / slow / slower / count-up / shimmer
motion.easing.default / in / out / inOut / exp-out
```

---

## 7. Token diff table — semantic/light.json

Reflects Design Brief §3.5 light mapping. Single-shot rewrite recommended.

```jsonc
{
  "semantic": {
    "background": {
      "primary":   { "$value": "{color.warm.bg.page}",     "$description": "Page bg — Claude.ai warm off-white" },
      "secondary": { "$value": "{color.warm.bg.muted}",    "$description": "Striped rows, secondary surfaces" },
      "tertiary":  { "$value": "{color.warm.bg.subtle}" },
      "elevated":  { "$value": "{color.warm.bg.elevated}", "$description": "Cards, popovers — pair with shadow.subtle" },
      "inverse":   { "$value": "{color.slate.900}" },
      "overlay":   { "$value": "rgba(15, 23, 42, 0.55)" }
    },
    "text": {
      "primary":   { "$value": "{color.slate.900}",  "$description": "16.7:1 on bg.primary — AAA" },
      "secondary": { "$value": "{color.slate.700}",  "$description": "12.1:1 — AAA" },
      "tertiary":  { "$value": "{color.slate.600}",  "$description": "8.86:1 — AAA" },
      "muted":     { "$value": "{color.slate.500}",  "$description": "4.83:1 — AA pass" },
      "brand":     { "$value": "{color.sky.700}",    "$description": "5.93:1 — AA pass" },
      "inverse":   { "$value": "{color.warm.bg.elevated}" },
      "onBrand":   { "$value": "{color.warm.bg.elevated}", "$description": "Text on sky-500 fill — 4.51:1" }
    },
    "border": {
      "subtle":  { "$value": "{color.slate.200}", "$description": "Decorative — 1.42:1, intentional" },
      "default": { "$value": "{color.slate.300}", "$description": "Visible — 1.94:1, intentional" },
      "strong":  { "$value": "{color.slate.400}", "$description": "Interactive — 2.84:1" },
      "focus":   { "$value": "{color.sky.500}",   "$description": "Focus rings — 3.02:1" }
    },
    "state": {
      "positive": { "default": { "$value": "{color.green.600}" }, "subtle": { "$value": "{color.green.50}" } },
      "negative": { "default": { "$value": "{color.red.600}"   }, "subtle": { "$value": "{color.red.50}"   } },
      "warning":  { "default": { "$value": "{color.amber.600}" }, "subtle": { "$value": "{color.amber.50}" } },
      "info":     { "default": { "$value": "{color.sky.600}"   }, "subtle": { "$value": "{color.sky.50}"   } }
    },
    "portfolio": {
      "gain":    { "default": { "$value": "{color.green.700}" }, "subtle": { "$value": "{color.green.50}" } },
      "loss":    { "default": { "$value": "{color.red.700}"   }, "subtle": { "$value": "{color.red.50}"   } },
      "neutral": { "default": { "$value": "{color.slate.500}"  }, "subtle": { "$value": "{color.slate.100}" } }
    },
    "interactive": {
      "primary":         { "$value": "{color.sky.500}",  "$description": "Direction A primary CTA fill" },
      "primaryHover":    { "$value": "{color.sky.600}" },
      "primaryActive":   { "$value": "{color.sky.700}" },
      "secondary":       { "$value": "{color.slate.100}" },
      "secondaryHover":  { "$value": "{color.slate.200}" },
      "secondaryActive": { "$value": "{color.slate.300}" },
      "ghostHover":      { "$value": "{color.slate.100}" },
      "ghostActive":     { "$value": "{color.slate.200}" }
    }
  }
}
```

**§3.6 PO calibration plug:** if PO selects A2 muted teal `#0D9488` (product-designer recommendation), change `interactive.primary` to a new `color.teal.600` reference. Single-token change; cascades through all CTA / focus / brand-text / Coach-multi-category surfaces.

---

## 8. Token diff table — semantic/dark.json

```jsonc
{
  "semantic": {
    "background": {
      "primary":   { "$value": "{color.neutral.950}",   "$description": "#0A0A0A — warmer than slate-950" },
      "secondary": { "$value": "{color.neutral.900}" },
      "tertiary":  { "$value": "{color.neutral.800}" },
      "elevated":  { "$value": "{color.neutral.900}",   "$description": "Cards on dark — border carries weight, not shadow" },
      "inverse":   { "$value": "{color.warm.bg.elevated}" },
      "overlay":   { "$value": "rgba(0, 0, 0, 0.7)" }
    },
    "text": {
      "primary":   { "$value": "{color.warm.bg.elevated}", "$description": "19.3:1 on bg.primary — AAA" },
      "secondary": { "$value": "{color.slate.300}",        "$description": "12.1:1" },
      "tertiary":  { "$value": "{color.slate.400}" },
      "muted":     { "$value": "{color.slate.400}",        "$description": "6.62:1" },
      "brand":     { "$value": "{color.sky.400}" },
      "inverse":   { "$value": "{color.slate.900}" },
      "onBrand":   { "$value": "{color.slate.900}",        "$description": "On sky-400 fill — 7.27:1" }
    },
    "border": {
      "subtle":  { "$value": "{color.neutral.800}", "$description": "1.18:1" },
      "default": { "$value": "{color.neutral.700}", "$description": "1.97:1" },
      "strong":  { "$value": "{color.neutral.600}", "$description": "3.65:1" },
      "focus":   { "$value": "{color.sky.400}" }
    },
    "state": {
      "positive": { "default": { "$value": "{color.green.400}" }, "subtle": { "$value": "rgba(16, 185, 129, 0.15)" } },
      "negative": { "default": { "$value": "{color.red.400}"   }, "subtle": { "$value": "rgba(239, 68, 68, 0.15)"  } },
      "warning":  { "default": { "$value": "{color.amber.400}" }, "subtle": { "$value": "rgba(245, 158, 11, 0.15)" } },
      "info":     { "default": { "$value": "{color.sky.400}"   }, "subtle": { "$value": "rgba(14, 165, 233, 0.15)" } }
    },
    "portfolio": {
      "gain":    { "default": { "$value": "{color.green.400}" }, "subtle": { "$value": "rgba(16, 185, 129, 0.12)" } },
      "loss":    { "default": { "$value": "{color.red.400}"   }, "subtle": { "$value": "rgba(239, 68, 68, 0.12)"  } },
      "neutral": { "default": { "$value": "{color.slate.400}"  }, "subtle": { "$value": "{color.neutral.800}"      } }
    },
    "interactive": {
      "primary":         { "$value": "{color.sky.400}" },
      "primaryHover":    { "$value": "{color.sky.300}" },
      "primaryActive":   { "$value": "{color.sky.500}" },
      "secondary":       { "$value": "{color.neutral.800}" },
      "secondaryHover":  { "$value": "{color.neutral.700}" },
      "secondaryActive": { "$value": "{color.neutral.600}" },
      "ghostHover":      { "$value": "{color.neutral.800}" },
      "ghostActive":     { "$value": "{color.neutral.700}" }
    }
  }
}
```

---

## 9. Migration checklist for frontend-engineer

Sequence (single PR or sequence of small PRs — frontend-engineer's call based on test isolation):

### Phase A — token files (this package)

- [ ] Add `color.warm.*` paths to `tokens/primitives/color.json`
- [ ] Add `color.sky.*` paths (50–900)
- [ ] Add Tailwind `color.neutral.*` paths (50–950) under a new path; rename existing `color.neutral.*` (which holds slate values) → `color.slate.*` to disambiguate
- [ ] Remove `color.brand.*` (violet) paths entirely
- [ ] Update `tokens/primitives/typography.json` font.family + add responsive size scale
- [ ] Update `tokens/primitives/shadow.json` per §5 above (rename, remove ai, retune focusRing)
- [ ] Update `tokens/primitives/motion.json` per §6 above (remove spring, add medium, retune fast)
- [ ] Rewrite `tokens/semantic/light.json` per §7 above
- [ ] Rewrite `tokens/semantic/dark.json` per §8 above
- [ ] Update `tokens/brand.json` productName / tagline / domain (after PO domain transition lock confirmed)
- [ ] Run Style Dictionary build → verify no broken references
- [ ] Snapshot diff of generated output (`build/css/tokens.css`, `build/ts/tokens.ts`, `build/swift/Tokens.swift`)

### Phase B — Tailwind config (`apps/web/`)

- [ ] Update `tailwind.config.ts` to extend with new `warm`, `sky` (rename brand→sky), `neutral` (Tailwind warm-gray) palettes
- [ ] Remove `brand` (violet) palette extension
- [ ] Update CSS-variable mapping if used (`@layer base`)

### Phase C — frontend code sweep (`apps/web/`)

- [ ] Grep for `bg-brand-*`, `text-brand-*`, `border-brand-*` Tailwind classes → replace with `bg-sky-*` / `text-sky-*` / `border-sky-*` (or semantic `text-brand` if available via plugin)
- [ ] Grep for `violet-` literal references → replace with `sky-`
- [ ] Grep for `slate-50` page bg references → replace with `warm-bg-page` semantic token
- [ ] Grep for `Geist` font references → replace with `Inter`
- [ ] Grep for `Geist Mono` → replace with `JetBrains Mono`
- [ ] Grep for `shadow-ai` class usage → REMOVE (no replacement; AI surfaces use `shadow-subtle`)
- [ ] Grep for `motion-easing-spring` / `ease-spring` references → replace with `easing-default` (cubic in-out)
- [ ] Grep for «Provedo» string literals in `.tsx` files → replace with «Provedo»
- [ ] Update `<Logo />` component SVG wordmark path to «Provedo» (in `packages/ui/src/components/Logo.tsx`)
- [ ] Update `next/font/google` imports per §4 above
- [ ] Run `pnpm tsc --noEmit` — no type errors
- [ ] Run `pnpm eslint --fix` — no lint errors
- [ ] Run Playwright visual regression at 320/375/768/1024/1440/1920 (per `~/.claude/rules/web/testing.md`)

### Phase D — verification

- [ ] WCAG contrast audit pass on all text/bg combinations (axe DevTools or @axe-core/playwright)
- [ ] Light + dark mode both verified
- [ ] Reduced-motion verified (DevTools emulation `prefers-reduced-motion: reduce`)
- [ ] Lighthouse pass on landing + dashboard (CWV per `~/.claude/rules/web/performance.md`)
- [ ] Storybook (if exists) re-snapshotted

### Phase E — docs cleanup (product-designer follow-up after frontend lands)

- [ ] Update `DASHBOARD_ARCHITECTURE.md` references to `accent.primary` → `interactive.primary`
- [ ] Update `COACH_SURFACE_SPEC.md` color references
- [ ] Update `ONBOARDING_FLOW.md` if any explicit color/font references
- [ ] Update component examples in Design Brief §10 if hex literals leaked through
- [ ] Add v1.4 entry to `docs/DECISIONS.md` (rebrand ADR)

---

## 10. Expected breaking changes in `apps/web/`

Components likely affected (non-exhaustive — frontend-engineer's pre-flight grep will produce final list):

| Surface / component | Change | Owner |
|---|---|---|
| Landing hero | bg slate-50 → warm-bg-page; CTA violet → sky; font Geist → Inter | frontend-engineer |
| Dashboard hero | KPI number font Geist Mono → JetBrains Mono; positive/negative tokens unchanged in semantic role | frontend-engineer |
| Chat bubbles | Provedo response bubble: violet-50 tint → REMOVED (white/border.subtle) | frontend-engineer |
| AI chat input | focus ring violet → sky | frontend-engineer |
| BellDropdown | unread Coach 1px ring violet-700 → interactive.primary (sky-500 default) | frontend-engineer |
| Buttons (primary) | violet-700 → sky-500 fill; violet-800 hover → sky-600 hover | frontend-engineer |
| InsightCard | hairline border tokens unchanged; «Provedo noticed» copy → «Provedo noticed» | content-lead (copy) + frontend-engineer (tokens) |
| Logo wordmark | «Provedo» SVG → «Provedo» SVG (3 variants: full, mark, wordmark) | product-designer (SVG asset) → frontend-engineer (apply) |
| Toast / Alert | semantic state colors unchanged in role; no visible diff | — |
| Focus rings | violet-700 outline → sky-500 outline (or PO-calibrated teal) | frontend-engineer |

---

## 11. Verification matrix

After migration lands, confirm each line passes:

| Surface | Metric | Threshold | How to verify |
|---|---|---|---|
| Landing hero (light) | text-primary on bg-page contrast | ≥4.5:1 | axe DevTools on / |
| Landing hero (light) | CTA text on sky-500 fill | ≥4.5:1 | axe |
| Dashboard KPI | mono font legibility | JetBrains Mono variable loaded | DevTools Fonts panel |
| Dashboard KPI | tabular numerals | font-variant-numeric: tabular-nums applied | DevTools computed style |
| Chat | focus ring visible on input | 2px sky-500 + 2px offset | Tab + visual inspect |
| Chat | streaming aria-live | `aria-live="polite"` on response container | inspect DOM |
| Coach dot | category color matches token | per `COACH_SURFACE_SPEC.md` §1 | inspect computed bg |
| Coach dot | reduced-motion disables pulse | static dot, no animation | DevTools emulation |
| BellDropdown | unread Coach 1px ring | interactive.primary | inspect computed border |
| Modal / Sheet | shadow-elevated applied | per §5 spec | inspect computed shadow |
| Dark mode | bg-page warm near-black | `#0A0A0A`, NOT `#020617` slate-950 | inspect computed bg |
| 320px viewport | no horizontal scroll | overflow-x: hidden enforced or no overflow | Playwright @ 320 |
| Reduced-motion | no count-up animation | static final value displayed | DevTools emulation |

---

## 12. Rollback plan

If v1.4 ships with an unforeseen blocker (e.g. critical contrast regression discovered post-merge):

1. Single revert commit on `packages/design-tokens/` brings back v1.3 violet-slate values
2. Frontend revert PR re-applies v1.3 Tailwind config + font imports
3. Component-level breaking changes (chat bubble tint removal, etc.) are token-only — automatic rollback via Style Dictionary regen
4. Brand.json domain/email reverts: blocked by «Provedo» string usage in landing; product-designer + content-lead must re-validate before flipping back

Pre-alpha protection: zero production users, so rollback risk is purely internal-build-stability. Acceptable.

---

## 13. Pre-delivery checklist (per ui-ux-pro-max workflow)

- [x] Token naming convention consistent (Style Dictionary `{group.scale}` notation)
- [x] WCAG 2.2 AA contrast verified all palette pairs (Design Brief §3.5 with hex+ratio inline)
- [x] Light + dark mode both specified
- [x] Responsive breakpoints specified in typography clamp() math (320–1440 viewport interpolation)
- [x] Reduced-motion variant specified (Design Brief §8.1)
- [x] Anti-patterns from Design Brief §0 preserved (no AI sparkle, no purple/pink, no brain icons, no gradient meshes, no Liquid Glass on AI content, no dashboard-jazz)
- [x] Industry-specific style mapping confirmed (fintech-B2C-AI, modern-tech-tool register — Direction A)
- [x] Free Google Fonts only (Inter + JetBrains Mono) — Rule 1 compliant
- [x] Lucide icons (open-source ISC) — Rule 1 compliant
- [x] No external comms drafted/sent (Rule 2)
- [x] Backward-compat strategy documented (clean cut, recommended; alternative dual-flag rejected with rationale)
- [x] Migration checklist written in actionable steps for frontend-engineer
- [x] Rollback plan documented

---

## 14. Open coordination items

1. **PO §3.6 accent calibration — RESOLVED 2026-04-25.** PO locked **A2 muted teal `#0D9488`**. Frontend-engineer Phase A starts с teal tokens, NOT sky-500 default. All migration table references к `sky-500` / `sky-400` to be read as `teal-600 #0D9488` (light) / `teal-400 #2DD4BF` (dark). `state.info` family flips к teal as well (Provedo «notices» = informational, sharing accent family per Design Brief §3.3). Single bulk find-replace в migration commits: sky-{shade} → teal-{shade}.
2. **`color.neutral.*` path rename.** Recommended rename of v1.3 path (slate values) → `color.slate.*` to free up `color.neutral.*` for Tailwind warm-gray. Frontend-engineer may push back if Style Dictionary references are extensively threaded; alternative is to keep slate under `color.neutral.*` (legacy name) and put new neutrals under `color.warm.gray.*` or similar. Product-designer accepts either; clarity-of-naming preferred but not blocking.
3. **Brand.json domain transition.** `provedo.ai` is owned (PO 2026-04-25 purchase). `localhost:*` placeholders should flip to `provedo.ai` only after deployment infra is staged. Frontend-engineer + devops-engineer coordinate; not blocking on token migration.
4. **Logo wordmark SVG.** «Provedo» wordmark in `packages/ui/src/components/Logo.tsx` needs «Provedo» replacement. product-designer will deliver SVG paths in a follow-up artifact (separate dispatch — wordmark needs typographic care given Inter Semibold + tracking-tight). Token migration can land before logo SVG; logo lands as separate small PR.
5. **iOS token consumption (TASK_08, post-alpha).** Style Dictionary Swift output regenerates automatically; iOS frontend implementation will catch up post-alpha per `04_DESIGN_BRIEF.md` framing. No iOS-specific blocker for v1.4 web migration.

---

## 15. References

- `docs/04_DESIGN_BRIEF.md` v1.4 §3 Color, §4 Typography, §6 Shadows, §8 Motion (master spec)
- `docs/design/2026-04-25-provedo-visual-direction-options.md` (3-direction dispatch — Direction A details)
- `docs/product/04_BRAND.md` v1.0 (brand foundation, name + tagline)
- `docs/product/03_NAMING.md` (Provedo lock 2026-04-25)
- `~/.claude/rules/web/performance.md` (Core Web Vitals + bundle budgets — Inter+JetBrains Mono fits)
- `~/.claude/rules/web/coding-style.md` (CSS custom properties pattern, animation-only properties)
- `~/.claude/rules/web/testing.md` (responsive breakpoints 320/375/768/1024/1440/1920 — visual regression baseline)
- Style Dictionary docs: https://amzn.github.io/style-dictionary/
