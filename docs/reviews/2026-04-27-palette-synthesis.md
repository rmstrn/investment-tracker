---
name: Palette synthesis 2026-04-27 — Right-Hand Rule 3 final
description: Synthesis of 3 specialist palette research reports into one locked palette + dark mode counterpart. Approved by PO 2026-04-27.
type: review
---

# Provedo Palette — Locked Synthesis

**Date:** 2026-04-27
**Status:** LOCKED by PO
**Authors:** Right-Hand synthesis after Rule 3 dispatch of user-researcher + brand-strategist + product-designer
**Inputs:**
- `docs/reviews/2026-04-27-palette-research-user-researcher.md`
- `docs/reviews/2026-04-27-palette-research-brand-strategist.md`
- `docs/reviews/2026-04-27-palette-research-product-designer.md`
- `docs/reviews/2026-04-27-tactile-shift-product-designer.md` (depth direction baseline)

---

## Convergence — 3/3 unanimous

| Token | Verdict |
|---|---|
| Background | warm cream — paper-coded, rejecting pure white |
| Card | lifted cream |
| Ink | warm near-black |
| Reject pure white `#FFFFFF` | YES — breaks tactile shadow composition (`rgba(255,250,240,0.95)` highlight invisible against pure white) |
| Reject saturated money-green `#00875A` / `#10B981` | YES — saturated zone (Stripe/Brex/Robinhood/Mint), saturated ICP read as «consumer fintech» within 2 sec, voice register fight («observant» vs «trade now») |
| Tactile/soft-3D depth direction | preserved — palette must compose with locked V4 inset/extruded language |

## Divergence — primary CTA accent (resolved)

Three specialists converged on «restrained green family, NOT money-green» but disagreed on specific hue:

- **user-researcher:** `#1F3A2D` British racing forest — deepest, uncontested in finance + AI
- **brand-strategist:** `#3F5D4A` deep sage — Magician+Sage archetype fit, Mercury parallel
- **product-designer:** `#0F8A7E` muted teal pen — Mercury/Origin retrospectives show sage CTAs underperform mid-chroma teal/jade by 18-24% conversion in fintech contexts

**Right-Hand resolution:** product-designer's data wins for primary CTA (conversion delta is material for pre-alpha funnel), brand-strategist's sage stays as supporting tone, terracotta (brand-strategist) added as second accent for citations and warmth.

---

## Locked palette

### Light theme

```
SURFACES
  bg              #F4F1EA   warm cream (paper-coded)
  card            #FAF7F0   lifted cream
  inset           #ECE7DC   depressed surface (inputs / secondary buttons / chips)

INK / TEXT
  text-1 (ink)    #1A1A1A   primary
  text-2          #4D4D4D   secondary
  text-3          #7A7A7A   tertiary / mono labels

ACCENT
  accent-primary  #0F8A7E   muted teal — primary CTA, focus rings, accent chips
  accent-sage     #3F5D4A   sage — citations, verified states, chart chrome
  accent-terra    #B8704D   terracotta — drift markers, attention secondary

STATUS
  success         #2D7561   muted forest-jade (derived from accent-primary family)
  warning         #B8704D   terracotta (= accent-terra)
  error           #B0524A   muted coral
  info            #4D4D4D   text-2 (no extra hue)
```

### Dark theme (per product-designer, viable)

```
SURFACES
  bg              #161412   warm cocoa
  card            #1F1B17   lifted cocoa
  inset           #2A241F   depressed

INK / TEXT
  text-1          #F4F1EA   inverted cream
  text-2          #B5B0A7   muted
  text-3          #847F77   tertiary

ACCENT
  accent-primary  #2DAA9B   lighter teal pen (luma-bumped)
  accent-sage     #6A8862   lighter sage
  accent-terra    #D88A65   lighter terracotta
```

---

## Composition with tactile depth (V4)

The locked palette preserves V4 shadow tokens unchanged:
- Card: `5px 5px 14px rgba(140,100,55,0.16), -3px -3px 10px rgba(255,250,240,0.95), inset 1px 1px 0 rgba(255,255,255,0.5)`
- Inset: `inset 3px 3px 6px rgba(140,100,55,0.22), inset -2px -2px 4px rgba(255,250,240,0.9)`
- Lift (hero/modal): `8px 8px 24px rgba(140,100,55,0.18) ...`

These shadow values were tuned for warm cream surfaces. They compose cleanly with `#F4F1EA` BG (verified visually) and are unbuildable on pure white (highlight invisible against `#FFFFFF`).

## Migration cost

Per product-designer estimate: **~0.9 FE-weeks** (~150 LOC tokens + ~14 LOC component hex de-hardcoding + dark mode build + snapshot refresh). Cheapest option of the three candidates — composability with current Provedo teal `#0D9488` token (2 hue degrees apart from new `#0F8A7E`) means evolution rather than replacement.

**Critical implication:** PR #66 «Ledger That Talks» does NOT need to retire. It evolves to v2.1 with palette overlay (~150 LOC) per product-designer findings.

## PO decisions locked 2026-04-27

1. **Palette:** option α (synthesized palette as above) — accepted
2. **Dark mode:** ship in first release alongside light theme (+1 week refit) — accepted
3. **Predecessor doc sweep (`02_POSITIONING.md`, `03_NAMING.md`):** deferred to `docs/PENDING_CLEANUPS.md` item 7 — accepted

## Risks (carried forward)

1. **Forest/sage perception risk** — user-researcher flagged that forest green may read «Patagonia heritage» rather than «fintech instrument». Mitigated by choosing muted-teal `#0F8A7E` as primary CTA (avoids sage-as-CTA penalty); sage demoted to supporting tone where its «slow down, consider» semantic helps Lane A.
2. **Validation deferred** — 5-second test ($0-50, 6h, 8-10 ICP proxies) NOT run before lock. PO chose to proceed on synthesis evidence. If post-launch metrics show trust-perception issues, can run validation as Tier-2 follow-up and adjust accent.
3. **Saturation drift risk** — warm cream + sage + terracotta IS the Patagonia/Granola/Mercury-2024 cluster. We're entering a recognized aesthetic territory, not creating a new one. Differentiation must come from typography craft + motion + voice rather than palette uniqueness.

## Next steps

1. Right-Hand dispatches product-designer to write `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` formal spec — full token export, tier-1/2 component inventory, motion rules, WCAG AA verification, light + dark mode tokens, migration plan from Design Brief v1.3.
2. PO reviews spec.
3. Right-Hand transitions to writing-plans skill → tech-lead kickoff → frontend-engineer slice for design system + landing v2.1 evolution + app refit.

## Hard rules check

- R1 ✅ no spend recommended in synthesis
- R2 ✅ no external comms drafted
- R3 ✅ real parallel 3-agent dispatch in isolated contexts, real synthesis with one weighted recommendation, PO decided
- R4 ✅ no predecessor references (latent violation in 2 docs flagged separately to PENDING_CLEANUPS item 7)
