# Provedo Design System v2 — Candy + Paper

**Status:** Authored 2026-05-01 by product-designer.
**Supersedes:** [PROVEDO_DESIGN_SYSTEM_v1.md](./PROVEDO_DESIGN_SYSTEM_v1.md).
**Direction:** D — candy-pink + candy-mustard marketing surfaces, paper-cream app interior. Mascot-independent. EN-only. Open-source fonts only.

---

## 1. Premise & Dual-Register Principle

Provedo helps real money. Real money in 2026 is allocated by humans who have spent the last decade being burned by both Bloomberg-grey institutional pretend-rigour and Robinhood-confetti casino theatre. Neither aesthetic is honest about what investing is: a slow, occasionally exciting practice that benefits from a calm head and a warm room.

v2 splits the surface into two registers, each carrying a different job:

- **Candy register** (marketing — landing, pricing, comparison, blog, sign-up). Candy-pink and candy-mustard fields, paint-drip silhouette transitions, Bagel Fat One display, hard ink shadows on signal-orange CTAs, optional Caveat micro-moments. The job: stop the scroll, signal a point of view, communicate that we are not another grey dashboard. This is where character lives.
- **Paper register** (app interior — portfolio detail, charts, settings, reports, anywhere a number is binding). Cream-paper substrate, Manrope-only typography, no candy backgrounds, signal-orange retained as accent only, charts inherit the existing v1 palette unchanged. The job: trust the math. Quiet, dense, scannable.

The dual-register rule is not a fallback or a degradation — it is the central trust contract. Marketing earns the click; the app earns the deposit. Mixing them (candy backgrounds behind portfolio numbers, Bagel Fat One in a holdings table, a paint-drip behind a P&L) breaks both jobs at once. Designers who feel the urge to "extend the candy energy into the app" should treat that urge as a signal that they are about to undermine the product.

The toggle between registers is **not a theme switch**. It is a route-level surface attribute: marketing routes wear candy; app routes wear paper. There is no user-facing control. See §10.

---

## 2. Color Tokens

All colors authored in oklch and snapped to sRGB hex for tooling parity. WCAG-AA contrast verified per pairing (≥ 4.5:1 body, ≥ 3:1 large/UI). Dark theme is **app-paper register only** for v2 — marketing candy register is light-only.

### 2.1 Primitives (DTCG)

```json
{
  "color": {
    "candy": {
      "pink":    { "$value": "#F7A1C9", "$type": "color", "$description": "oklch(78% 0.18 350). Marketing primary surface." },
      "mustard": { "$value": "#F4CC4A", "$type": "color", "$description": "oklch(85% 0.16 95). Marketing secondary surface." },
      "pink-deep":    { "$value": "#D96EA0", "$type": "color", "$description": "oklch(64% 0.17 350). Drip silhouette + 2px ink-stroke fallback." },
      "mustard-deep": { "$value": "#C99A1F", "$type": "color", "$description": "oklch(67% 0.15 90). Drip silhouette." }
    },
    "signal": {
      "orange":      { "$value": "#F08A3C", "$type": "color", "$description": "oklch(72% 0.16 50). Primary CTA fill — both registers." },
      "orange-deep": { "$value": "#C76A22", "$type": "color", "$description": "oklch(58% 0.15 48). CTA active depress + danger-CTA bg." }
    },
    "ink": {
      "deep":      { "$value": "#1C1B26", "$type": "color", "$description": "oklch(20% 0.015 280). Header bar, hard CTA shadow, primary text on candy + paper." },
      "ink-2":     { "$value": "#3A3947", "$type": "color", "$description": "oklch(33% 0.015 280). Secondary text on paper." },
      "ink-3":     { "$value": "#5A5867", "$type": "color", "$description": "oklch(48% 0.015 280). Tertiary / metadata. AA pass on paper." }
    },
    "paper": {
      "cream":  { "$value": "#F6F1E8", "$type": "color", "$description": "oklch(96.5% 0.012 85). App bg." },
      "card":   { "$value": "#FFFCF4", "$type": "color", "$description": "oklch(99% 0.010 85). Card surface." },
      "inset":  { "$value": "#E9E2D2", "$type": "color", "$description": "oklch(91% 0.014 85). Input wells, chips, depressed surfaces." }
    },
    "static": {
      "white":       { "$value": "#FFFFFF", "$type": "color" },
      "ink-on-cta":  { "$value": "#1C1B26", "$type": "color", "$description": "Text on signal-orange CTA — uses ink-deep, 5.42:1 AA." }
    }
  }
}
```

> The legacy `editorial-mh3` block is removed in v2. See §11 migration.

### 2.2 Semantic — light (paper app register, default)

```json
{
  "semantic": {
    "bg":         { "$value": "{color.paper.cream}" },
    "card":       { "$value": "{color.paper.card}" },
    "inset":      { "$value": "{color.paper.inset}" },
    "text":       { "$value": "{color.ink.deep}" },
    "text-2":     { "$value": "{color.ink.ink-2}" },
    "text-3":     { "$value": "{color.ink.ink-3}" },
    "accent":     { "$value": "{color.signal.orange}", "$description": "CTAs, focus, key signal." },
    "accent-deep":{ "$value": "{color.signal.orange-deep}" },
    "border":     { "$value": "rgba(28,27,38,0.14)" },
    "divider":    { "$value": "rgba(28,27,38,0.20)" },
    "focus-ring": { "$value": "{color.signal.orange}" }
  }
}
```

### 2.3 Semantic — marketing-candy (route-scoped)

```json
{
  "semantic-candy": {
    "bg-pink":      { "$value": "{color.candy.pink}" },
    "bg-mustard":   { "$value": "{color.candy.mustard}" },
    "drip-pink":    { "$value": "{color.candy.pink-deep}" },
    "drip-mustard": { "$value": "{color.candy.mustard-deep}" },
    "text-on-candy":{ "$value": "{color.ink.deep}", "$description": "Always ink. Never white on candy." },
    "cta-fill":     { "$value": "{color.signal.orange}" },
    "cta-shadow":   { "$value": "{color.ink.deep}", "$description": "Hard 5px solid offset." },
    "header-bg":    { "$value": "{color.ink.deep}" },
    "header-text":  { "$value": "{color.static.white}" }
  }
}
```

### 2.4 Semantic — dark (paper register only, app interior)

Marketing surfaces do **not** ship a dark mode in v2. Dark applies to the paper app register exclusively.

```json
{
  "semantic-dark": {
    "bg":         { "$value": "#1C1B26" },
    "card":       { "$value": "#2A2935" },
    "inset":      { "$value": "#15141D" },
    "text":       { "$value": "#F4F0E4" },
    "text-2":     { "$value": "#C8C2B5" },
    "text-3":     { "$value": "#9A9486" },
    "accent":     { "$value": "#F8A85C", "$description": "Lifted signal-orange for cocoa bg, AA on bg." },
    "border":     { "$value": "rgba(244,240,228,0.14)" }
  }
}
```

### 2.5 WCAG-AA pairing matrix

| Foreground | Background | Ratio | Use | Pass |
|---|---|---|---|---|
| `ink.deep` `#1C1B26` | `paper.cream` `#F6F1E8` | 14.8:1 | Body text on app | AAA |
| `ink.deep` | `paper.card` `#FFFCF4` | 16.1:1 | Card body text | AAA |
| `ink.ink-2` `#3A3947` | `paper.cream` | 9.6:1 | Secondary text | AAA |
| `ink.ink-3` `#5A5867` | `paper.cream` | 5.7:1 | Tertiary / meta | AA |
| `ink.deep` | `candy.pink` `#F7A1C9` | 8.1:1 | Marketing headlines | AAA |
| `ink.deep` | `candy.mustard` `#F4CC4A` | 11.4:1 | Marketing headlines | AAA |
| `ink.deep` | `signal.orange` `#F08A3C` | 5.4:1 | Text on CTA | AA |
| `static.white` | `ink.deep` | 14.8:1 | Header nav text | AAA |
| `signal.orange` | `paper.cream` | 2.6:1 | Decorative only — not text | UI only |
| `signal.orange` (dark `#F8A85C`) | `#1C1B26` (dark bg) | 8.9:1 | Dark accent | AAA |
| `ink.ink-3` | `paper.card` | 6.0:1 | Card meta | AA |
| `static.white` | `signal.orange` | 2.7:1 | **Forbidden** — fails AA | — |

**Rule:** signal-orange never carries text on light bg; on candy CTAs, text is always `ink.deep`.

---

## 3. Typography Ladder

Three families, all OFL, Latin only:

- **Bagel Fat One** — display only, marketing register only. Single weight (Regular 400 — the family ships only 400). Real chunky-friendly geometry, closed apertures, generous round shoulders. Never used in the app interior. Never below 32px. Never in body copy. Never in form labels.
- **Manrope** — body + UI across both registers. Variable weights 200–800, we use 400/500/600/700. Single-source for app interior typography.
- **Caveat** — handwritten accent, optional. Marketing micro-moments only (annotations beside a chart screenshot, "← this number is real" pull-out). Never in nav, never in CTAs, never in body, never in app interior. Max two instances per marketing page.

### 3.1 Bagel Fat One scale (display, marketing only)

| Token | Size | Line-height | Letter-spacing | Use |
|---|---|---|---|---|
| `display-xxl` | clamp(64px, 8vw, 112px) | 0.95 | -0.02em | Hero H1 |
| `display-xl`  | clamp(48px, 5vw, 80px)  | 1.0  | -0.015em | Section heroes |
| `display-lg`  | clamp(40px, 4vw, 64px)  | 1.05 | -0.01em | Pricing tier titles, comparison column heads |
| `display-md`  | 36px                    | 1.1  | -0.005em | Card hero titles in marketing |
| `display-sm`  | 32px                    | 1.15 | 0        | Lower-emphasis decorative heads |

Bagel Fat One renders heavy already — never apply additional bold/weight overrides. Use color contrast (ink on candy) for emphasis, not weight.

### 3.2 Manrope scale (body + UI, both registers)

| Token | Size | Line-height | Weight | Use |
|---|---|---|---|---|
| `heading-xl` | 28px | 1.2 | 700 | App page titles, marketing sub-heads where Bagel feels too loud |
| `heading-lg` | 22px | 1.25 | 600 | Card titles, section heads |
| `heading-md` | 18px | 1.35 | 600 | Sub-sections, table heads |
| `body-lg`    | 16px | 1.55 | 400 | Primary body, form inputs |
| `body-md`    | 14px | 1.5  | 400 | Tables, secondary body, default app body |
| `caption`    | 12px | 1.4  | 500 | Metadata, timestamps, labels (uppercase + 0.08em tracking) |

### 3.3 Caveat usage rules

- 1.4× the size of the Manrope element it annotates (24-36px typical).
- Always paired with a 2px ink hand-drawn arrow or underline (SVG primitive in §7).
- Color: `ink.deep` only. Never on candy fields where it would lower legibility.
- Slight rotation (-2° to +2°) acceptable; no rotation beyond ±4°.

### 3.4 Loading

`@font-face` with `font-display: swap`. Self-host the WOFF2 files under `apps/web/public/fonts/`. Preload only the marketing-critical Bagel Fat One Regular and Manrope 400/600. Caveat is lazy-loaded on routes that use it.

---

## 4. Spacing, Radius, Shadow

### 4.1 Spacing

Inherits v1 4px-base scale unchanged: `space-1` 4px → `space-12` 96px. Marketing register uses larger steps (`space-10`+ for section gaps); paper register uses tighter steps (`space-2`–`space-6` for dense data).

### 4.2 Radius

| Token | Value | Use |
|---|---|---|
| `radius-sm` | 4px  | Inputs, chips |
| `radius-md` | 8px  | Cards, buttons (paper register) |
| `radius-lg` | 16px | Marketing cards, candy panels |
| `radius-xl` | 32px | Hero candy blobs, oversized marketing surfaces |
| `radius-pill` | 999px | Pills, tags |

Marketing CTAs use `radius-md` (8px) — chunky, not pill, not square. Paper buttons match.

### 4.3 Shadow — candy register (hard ink shadows)

Signature gesture: solid 5px ink offset, no blur. This is the v2 signal.

| Token | Value | Use |
|---|---|---|
| `shadow-cta-rest`    | `5px 5px 0 0 #1C1B26` | Signal-orange CTA default |
| `shadow-cta-hover`   | `7px 7px 0 0 #1C1B26` | CTA hover (lift) |
| `shadow-cta-active`  | `2px 2px 0 0 #1C1B26` | CTA pressed (depress) — translate matches |
| `shadow-card-candy`  | `4px 4px 0 0 #1C1B26` | Marketing cards / panels with ink border |
| `shadow-card-candy-hover` | `6px 6px 0 0 #1C1B26` | Hover lift |

### 4.4 Shadow — paper register (warm soft)

| Token | Value | Use |
|---|---|---|
| `shadow-soft`  | `0 1px 3px rgba(28,27,38,0.06), 0 6px 18px rgba(28,27,38,0.05)` | Subtle hover, dropdowns |
| `shadow-card`  | `0 2px 6px rgba(140,100,55,0.10), 0 12px 28px rgba(140,100,55,0.08)` | Default app card |
| `shadow-lift`  | `0 4px 10px rgba(140,100,55,0.14), 0 18px 40px rgba(140,100,55,0.10)` | Hovered card / hero panel |
| `shadow-input-inset` | `inset 2px 2px 4px rgba(140,100,55,0.10), inset -1px -1px 2px rgba(255,250,240,0.85)` | Input wells |

**Rule:** never mix hard ink shadows with paper register, never mix soft warm shadows with candy register.

---

## 5. Motion Register

### 5.1 Easings

| Token | Value | Use |
|---|---|---|
| `ease-out-snap`   | `cubic-bezier(0.22, 1, 0.36, 1)` | Default UI transitions, paper register |
| `ease-spring-soft`| `cubic-bezier(0.34, 1.56, 0.64, 1)` | Candy CTA hover bounce, drip reveal |
| `ease-press`      | `cubic-bezier(0.4, 0, 0.6, 1)` | Button depress (symmetric) |
| `ease-linear`     | `linear` | Cross-fades only |

### 5.2 Durations

| Token | Value | Use |
|---|---|---|
| `dur-instant` | 80ms  | State swaps, tooltip show |
| `dur-fast`    | 160ms | Hover, focus, color transitions |
| `dur-normal`  | 240ms | Card lift, modal open, drawer |
| `dur-slow`    | 480ms | Hero reveal, drip transition |
| `dur-deliberate` | 720ms | Section-to-section drip paint |

### 5.3 Signature gestures

- **Drip transition (marketing).** Section A ends with a paint-drip silhouette in the next section's color. On scroll-into-view, the drip extends 8-16px (clip-path expansion), `dur-deliberate`, `ease-spring-soft`. Reduced motion: drip is static, no animation.
- **CTA hover lift.** `translate(-2px, -2px)` + shadow grows from 5/5 to 7/7. `dur-fast`, `ease-spring-soft`.
- **CTA active depress.** `translate(3px, 3px)` + shadow shrinks to 2/2. `dur-instant`, `ease-press`. Net effect: button visibly stamps.
- **Paper card hover.** `translate(0, -2px)` + soft shadow lift. `dur-fast`, `ease-out-snap`. No color shift.
- **Focus ring (both registers).** 3px outline `signal.orange` with 2px offset. Animates in over `dur-instant`.

### 5.4 Reduced motion

Honour `prefers-reduced-motion`: drip transitions become static, hover lifts become 1px instead of 2px, no spring overshoot. Color transitions remain.

---

## 6. Surface System

Four named surfaces. Each has a single owner-route-class. No mixing.

| Surface | Background | Typography | Shadow stack | Owner |
|---|---|---|---|---|
| **candy-pink**   | `#F7A1C9` | Bagel display + Manrope body, ink text | hard-ink | Marketing primary |
| **candy-mustard**| `#F4CC4A` | Bagel display + Manrope body, ink text | hard-ink | Marketing secondary |
| **paper-cream**  | `#F6F1E8` | Manrope only, ink text | soft-warm | App interior default |
| **ink-deep**     | `#1C1B26` | Manrope only, parchment text | none (sits flat) | Sticky header, footer band, dark-mode app bg |

Marketing pages alternate candy-pink and candy-mustard sections separated by drip silhouettes. Sticky header is always **ink-deep** with white nav text — survives across both candy fields without conflict. Marketing CTAs always sit on candy fields, never on ink (the header gets a smaller "Sign in" link instead).

App interior uses **paper-cream** as the only background. Ink-deep appears only as the dark-mode bg toggle.

---

## 7. Component Primitives

### 7.1 Button (3 variants)

**Primary — `signal-orange`** (both registers):
- bg `#F08A3C`, text `ink.deep`, `border: 2px solid #1C1B26`, radius `8px`, padding `14px 24px`.
- Rest: `shadow: 5px 5px 0 0 #1C1B26`.
- Hover: `translate(-2px,-2px)`, `shadow: 7px 7px 0 0 #1C1B26`.
- Active: `translate(3px,3px)`, `shadow: 2px 2px 0 0 #1C1B26`.
- Focus: outline `3px solid #F08A3C`, `outline-offset: 2px` (around the rest position, not the translated one).
- Disabled: `bg: #E9E2D2`, `text: ink.ink-3`, no shadow, `cursor: not-allowed`.

**Secondary — ink-outline** (both registers):
- bg transparent, text `ink.deep`, `border: 2px solid #1C1B26`, radius 8px.
- Rest: `shadow: 4px 4px 0 0 #1C1B26`.
- Hover/active gestures match primary.

**Ghost — text only** (paper register only):
- No bg, no border, text `ink.deep`, underline on hover.
- Used in the app for "Cancel" / row-level actions where a hard-shadow button would be too loud.

### 7.2 Input (paper register only)

- bg `paper.inset` `#E9E2D2`, text `ink.deep`, `border: 1px solid rgba(28,27,38,0.14)`, radius 8px, padding `12px 16px`.
- Inset shadow: `shadow-input-inset`.
- Focus: border becomes `signal.orange`, focus ring as above. Inset shadow stays.
- Error: border `#C76A22`, helper text `signal.orange-deep`.
- Marketing email-capture inherits the same input but adds a 2px ink border for legibility against candy fields.

### 7.3 Card (3 variants)

**candy-bordered** (marketing): bg `paper.card` or `static.white`, `border: 2px solid #1C1B26`, radius `16px`, `shadow-card-candy` rest, `shadow-card-candy-hover` on hover. Sits on candy-pink or candy-mustard fields; the ink shadow reads against both.

**paper-inset** (app interior): bg `paper.card` `#FFFCF4`, `border: 1px solid rgba(28,27,38,0.10)`, radius `8px`, `shadow-card` rest, `shadow-lift` on hover. Default for portfolio cards, charts, settings panels.

**ink-ticker** (app interior, narrow use): bg `ink.deep`, text `paper.cream`, radius 8px, no border, no shadow. For the quoted-price ticker, "live" indicator strips, footer summary band. Single highest-emphasis surface inside the app.

### 7.4 Divider (paint-drip primitive)

The drip silhouette is a section-to-section transition, not a hairline rule. SVG geometry:

```
viewBox: 0 0 1440 80 (preserveAspectRatio: none, scales horizontally)
path: M0 0 L1440 0 L1440 40
      C 1380 40, 1340 78, 1300 60
      C 1260 42, 1220 72, 1180 50
      C 1130 26, 1080 70, 1020 48
      ... (12 control-point pairs, irregular spacing 80–140px apart,
           drip depths 18–48px varied with golden-ratio jitter)
      L 0 40 Z
fill: <next-section-bg>  // pink-deep or mustard-deep stop value
```

Three preset SVG paths shipped (`drip-a`, `drip-b`, `drip-c`) so consecutive transitions don't repeat. Drip color uses the **deep variant** of the section it leads into (`candy.pink-deep` for an incoming pink section), giving a 1-stop tonal step before the field flattens to base.

Hairline rules inside cards (table row separators, etc.) use `1px solid rgba(28,27,38,0.10)` — no drips inside the app.

---

## 8. State Matrix

| Component | Default | Hover | Focus | Active | Disabled |
|---|---|---|---|---|---|
| **Primary CTA** (candy) | orange + 5/5 ink shadow | translate -2/-2, shadow 7/7 | 3px orange ring | translate 3/3, shadow 2/2 | inset paper bg, ink-3 text, no shadow |
| **Primary CTA** (paper) | orange + 5/5 ink shadow | shadow 7/7, no translate | 3px orange ring | shadow 2/2 | inset paper bg, no shadow |
| **Secondary** | ink outline + 4/4 shadow | shadow 6/6, translate -2/-2 | 3px orange ring | translate 3/3, shadow 2/2 | ink-3 outline+text, no shadow |
| **Ghost** (paper) | ink text | underline + soft shadow on bg | 3px orange ring | inset bg `rgba(28,27,38,0.06)` | ink-3 text |
| **Input** | inset shadow + subtle border | border alpha 0.22 | orange border + 3px ring | — | inset paper bg, ink-3 text |
| **Card-paper** | soft shadow | lift shadow + translate -2y | 3px orange ring (when interactive) | translate 0 | reduced opacity 0.6 |
| **Card-candy** | 4/4 ink shadow | 6/6 + translate -2/-2 | 3px orange ring | 2/2 + translate 2/2 | desaturate + ink-3 text |
| **Link** | ink + 1px underline | orange + 2px underline | 3px orange ring | orange-deep | ink-3, no underline |

**Cross-register rules:**
- Focus ring is always signal-orange. Universal across registers.
- Disabled never carries shadow.
- Hover never changes hue on paper cards (translate only). Hover may shift weight on candy CTAs but never the candy bg itself.

---

## 9. Charts integration

Chart subsystem renders via **visx** (Airbnb, MIT, scoped imports) styled per the **candy register** (signal-orange / candy-pink / mustard / ink-deep) using the locked language: hard ink-shadow drops, hover-lift, Bagel hero numerals, Manrope mono axis, spring-soft motion, ChartFrame a11y wrap.

Per-chart visual specs live in [`CHARTS_VISX_CANDY_SPEC.md`](./CHARTS_VISX_CANDY_SPEC.md).

V2 custom-SVG chart subsystem (DonutChartV2, BarChartV2, Cartesian primitives, makeBackendDispatch) is being retired. V1 Recharts wrappers are deleted in Phase E. See [`DECISIONS.md`](../DECISIONS.md) entry 2026-05-01.

---

## 10. Cross-Surface Rules — Single Source of Truth

The candy ↔ paper toggle is **route-scoped**, not user-scoped, not theme-scoped, not component-scoped.

### 10.1 Routing rule

- Routes under `/`, `/pricing`, `/compare`, `/about`, `/blog`, `/legal`, `/sign-up`, `/sign-in` → **marketing-candy** register.
- Routes under `/app/**` (portfolio, dashboard, holdings, settings, reports) → **paper** register.
- The sticky header (ink-deep with white nav) appears on both. The footer band differs (candy: drip into ink-deep band; paper: minimal ink-deep strip).

### 10.2 Implementation contract

Set `data-surface="candy"` or `data-surface="paper"` on `<html>` at the layout level. Tokens cascade from there. Components query the attribute via `[data-surface="candy"] &` selectors when they need to swap shadow stack. **No conditional logic in component code** — the attribute does the routing.

### 10.3 Forbidden compositions

- Bagel Fat One inside `/app/**`.
- Hard ink shadow on `/app/**` buttons (CTA in app uses the same shape but with paper-card surrounding, never on a candy field).
- Caveat anywhere in `/app/**`.
- Candy backgrounds anywhere in `/app/**`.
- Charts on candy backgrounds.
- Manrope-only marketing pages (the marketing register requires Bagel for the H1).

If a future surface needs to bridge (e.g. an in-app onboarding takeover that wants marketing energy), introduce a third explicit register name; never overload candy or paper.

---

## 11. Migration Delta from v1

### 11.1 Token-level changes

| v1 token | v2 token | Action |
|---|---|---|
| `color.ink` `#1A1A1A` | `color.ink.deep` `#1C1B26` | Rename + slight hue shift (cool-280 vs neutral). Audit all usages. |
| `color.parchment` `#F4F1EA` | `color.paper.cream` (renamed); dark-mode text uses `#F4F0E4` | Rename + split paper-bg vs dark-text-fg. |
| `color.cream.bg` `#E8E0D0` | `color.paper.cream` `#F6F1E8` | Replace value (paper substrate slightly lighter, warmer). |
| `color.cream.card` `#FAF7F0` | `color.paper.card` `#FFFCF4` | Replace value. |
| `color.cream.inset` `#D6CCB8` | `color.paper.inset` `#E9E2D2` | Replace value. |
| `color.jade.*` (all jade tokens) | — | **Delete.** Accent role transfers to signal-orange. Charts that referenced jade re-point to existing museum series. |
| `color.terra.*` (all terra tokens) | — | **Delete from semantic.** Loss/danger transfers to `signal.orange-deep`. Chart-only terra references re-point to museum-stone or museum-plum already in v1.1. |
| `color.editorial-mh3.*` (entire block) | — | **Delete.** All chart-categorical references re-point to museum-vitrine series (already done in v1.1; this completes the cleanup). |
| `color.museum.*`, `color.ink-ramp.*`, `color.chart.*` | unchanged | Charts subsystem preserved verbatim. |
| `font.family.sans` `Geist` | `font.family.body` `Manrope` | Replace; add `font.family.display` `Bagel Fat One`, `font.family.accent` `Caveat`. |
| `font.family.mono` `Geist Mono` | — | **Delete.** No mono in v2. Eyebrow labels use Manrope 600 with caps + 0.08em tracking. |
| `shadow.card`, `shadow.lift` (warm cream-tinted) | `shadow-card`, `shadow-lift` | Keep, refresh values to use new ink hex. |
| `shadow.primary-extrude` (ink-extruded) | `shadow-cta-rest` (hard 5/5) | **Replace conceptually.** Old neumorphic ink button → new hard-shadow signal-orange button. |
| `shadow.terra-extrude` | — | **Delete.** Danger uses signal-orange-deep with the same hard-shadow primitive. |
| `semantic.accent` (jade) | `semantic.accent` (signal-orange) | Re-point. Cascade through every hover-glow and focus-ring. |
| `semantic.text.brand` (ink) | `semantic.text.brand` (ink) | Unchanged in value, role clarified: brand-text always ink. |
| `semantic.modal-overlay` `rgba(50,40,30,0.45)` | `semantic.modal-overlay` `rgba(28,27,38,0.55)` | Refresh to ink-deep + slightly darker for marketing modals. |

### 11.2 Component-level changes

- All buttons re-skinned to hard-shadow primary or secondary. The v1 ink-extruded neumorphic button is retired.
- Cards split into three explicit variants. v1's single Card → choose candy-bordered, paper-inset, or ink-ticker per route.
- New Divider primitive (paint-drip SVG) — net-new component.
- Toggles keep v1.1 inset behaviour (paper register).
- Charts: token bindings refreshed; visual designs unchanged.

---

## 12. FE Handoff Checklist

### 12.1 Token files (`packages/design-tokens/tokens/`)

- [ ] `primitives/color.json` — replace ink/cream blocks with v2 values; add `candy.*`, `signal.*`, `paper.*`, `ink.deep/ink-2/ink-3`. Delete `jade.*`, `terra.*` from this file (charts no longer reference them after re-point).
- [ ] `primitives/editorial-mh3.json` — **delete file.**
- [ ] `primitives/typography.json` — replace `font.family.sans/mono` with `body=Manrope`, `display=Bagel Fat One`, `accent=Caveat`; add display-xxl..display-sm scale (5 sizes); refresh body scale to Manrope-tuned line-heights.
- [ ] `primitives/shadow.json` — add `shadow-cta-rest/hover/active`, `shadow-card-candy*`; refresh `shadow-card`, `shadow-lift`, `shadow-input-inset`, `shadow-soft` to new ink hex.
- [ ] `primitives/motion.json` — add `ease-spring-soft`, `ease-press`; add `dur-deliberate`.
- [ ] `primitives/radius.json` — verify md=8 and lg=16 present; add xl=32 if missing.
- [ ] `primitives/gradient.json` — audit; remove jade gradient, add subtle paper-card gradient if any chart cards use it.
- [ ] `semantic/light.json` — re-point accent → signal-orange, remove all jade/terra refs, add `accent-deep`, `border`, `divider`, `focus-ring`.
- [ ] `semantic/dark.json` — re-point to dark paper-register values from §2.4.
- [ ] **New** `semantic/marketing-candy.json` — DTCG file scoped to `data-surface="candy"`. Authored from §2.3.
- [ ] `components/showcase.json` — purge jade/terra component states; rebuild from new semantics.
- [ ] `brand.json` — refresh wordmark color, accent ref.

### 12.2 Web app (`apps/web/src/app/design-system/_sections/*.tsx`)

- [ ] `foundation.tsx` — rebuild swatch grid for v2 primitives + WCAG matrix; remove jade/terra swatches.
- [ ] `primitives.tsx` — show Bagel display ladder + Manrope ladder + Caveat sample; remove Geist samples.
- [ ] `cards.tsx` — render all three Card variants (candy-bordered, paper-inset, ink-ticker) side-by-side.
- [ ] `forms.tsx` — Input + Button-primary/secondary/ghost on both registers; show state matrix grid.
- [ ] `charts.tsx` — re-bind to new tokens (accent → orange); verify DonutChartV2 + BarChartV2 hover glow re-tints. **Do not redesign charts.**
- [ ] `theme.tsx` — replace existing theme toggle with the route-surface explainer; document `data-surface` attribute contract from §10.2.
- [ ] `iconography.tsx` — Lucide already locked; re-test visual against new ink-deep value.
- [ ] `disclaimer.tsx` — re-bind text colors to `ink.ink-2` / `ink.ink-3`.
- [ ] **New** section: `_sections/marketing.tsx` — render candy-pink + candy-mustard surfaces, drip dividers, hard-shadow CTA in situ.

### 12.3 Global

- [ ] `apps/web/public/fonts/` — drop in Bagel Fat One Regular (WOFF2), Manrope variable (WOFF2), Caveat Regular (WOFF2). All OFL.
- [ ] `apps/web/src/app/layout.tsx` — set `data-surface` attribute per route. Preload Bagel + Manrope on marketing layout; preload Manrope only on `/app` layout.
- [ ] `apps/web/src/styles/tokens.css` — regenerate from updated DTCG.
- [ ] Audit any direct hex references in `*.tsx`/`*.css` that bypassed tokens — Grep for `#1A1A1A`, `#F4F1EA`, `#2D5F4E`, `#A04A3D` and re-point.
- [ ] Move `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` to `docs/design/_archive/` once parity verified.

### 12.4 Verification

- [ ] Visual regression on `/design-system` pages, both registers.
- [ ] WCAG-AA audit re-run with axe + manual contrast checks against §2.5 matrix.
- [ ] Reduced-motion review on marketing drip transitions.
- [ ] Dark-mode review on `/app/**` only (marketing has no dark variant).
- [ ] Charts spot-check: 6 chart types render correctly with re-pointed accent.
