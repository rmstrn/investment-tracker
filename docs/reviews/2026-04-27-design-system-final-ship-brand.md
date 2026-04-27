# Final SHIP Review — Brand-Strategist

**Verdict:** SHIP
**Confidence:** high

System is brand-ready. Every HIGH-priority callout from my 2026-04-27 brand-harmony pass has been resolved in code. Both themes hold the Magician+Sage primary archetype with Everyman warmth, paper-restraint voice composes correctly across 12 surface groups, no anti-features remain. Freeze for 4 weeks per prior recommendation. PO can stop iterating.

## Walk-through (both themes)

**Light theme — Mercury 2024 + Stripe Press cluster confirmed.**
- BG `#E8E0D0` vs card `#FFFFFF` now reads as paper-on-paper with ~3:1 luma delta — the «white-on-white» complaint is gone. Cards lift legitimately, not ambiguously.
- Inset `#D6CCB8` reads recessed against the deeper paper — depressed-input language now coherent (wasn't, before round 6).
- Cream-highlight in card shadow softened from 0.95 → 0.55 alpha — the prior «glowing edge» tic is gone. Shadows feel like paper-on-corkboard, not Vercel-card.
- Forest-jade `#2D5F4E` deeper than money-green, no teal slip. Reads vintage-ledger / Patagonia field-guide. Correct register.
- Bronze `#A04A3D` lands in old-leather / iron-oxide territory. Pulse-warn, negative delta, drift chip, btn-danger all read «attention warranted» — none read alarm-red. Museum-vitrine confirmed.
- Geist + tabular numerals + mono eyebrows + dotted dividers + zero italic = Stripe Press cadence, well-held.
- 1px borders give catalog-card / library-index feel — unexpected Everyman warmth (counterintuitive but real per prior pass).

**Dark theme — neutral cool-dark, restrained, no glow creep.**
- BG `#0E0E12` vs card `#26262E` separation legible without shadow gymnastics. The 0.07 inset top-highlight defines card top-edge cleanly.
- Forest-jade `#4A8775` lighter for dark — preserves brand recognition without OLED glow.
- Bronze `#BD6A55` red-shifted appropriately for dark; pulse.warn reads correctly.
- No double-shadow glow. No Vercel/Linear billboard creep. Sage takes over in night-mode register, which is on-brand.
- User chat bubble `#1A2520` (subtle teal-tint) differentiates from inset without leaking jade — restrained.

**Tactile depth language coherent both themes.** Inputs depressed (correct «slot» metaphor), toggles flat with border-driven meaning + jade fill on active (PD lock holds — toggles no longer read as «disabled»), secondary outlined (no longer disabled-looking), primary 3D extrude. Each depth state means one thing. Sage discipline.

## Brand position confirmation

**Magician+Sage primary · Everyman modifier — INTACT.**
- Magician: pulse-with-halo, citation glyph (Lucide sparkle), cross-broker insight card («A pattern across accounts»), chat assistant tracking sources. Quiet librarian-Magician — finding connections in the catalog, not stage magic.
- Sage: tabular numerals, mono eyebrows (`PORTFOLIO ANSWER ENGINE · 01`), dotted dividers, restrained shadows, no italic, accent-color demoted from headline emphasis to status-only. Library register holds.
- Everyman: borders give cards «artifact, indexed, tangible» feel; warm paper bg; Geist (open and approachable, not severe like Inter). Not corporate-cold, not jargon-gated.

**Voice composition.** Paper-restraint observable. Patagonia / Craig Mod / Wirecutter / Economist / McPhee references all compose. Zero Vercel-billboard tics: no gradient blobs, no glow, no scale-on-hover, no glassmorphism, no decorative single-word color emphasis in headlines.

**Forest-jade density now meaningful.** Previous round had 17+ surfaces — measured fatigue. Current state has accent demoted from `sig-headline .accent`, `insight-head .accent`, and `bub-ai .body .accent` (all now ink + bold weight only — verified in CSS at lines 380, 345, 517). Bub-ai accent-tinted border-top is gone (line 508 — clean card border now, not jade ladder). Accent now reads as: active toggle state, success/positive data, citation glyph, AI attribution label, eyebrow editorial mark. Five semantic loads, clear tier separation. Color means something again.

**Bronze position museum-vitrine, not alarm.** Confirmed across pulse.warn, negative delta, drift chip, warning toast, btn-danger. Verb «Delete» + bronze combine adequately for destructive register without crossing into red. Don't push further red.

## Top 3 wins worth flagging to PO

1. **The white-on-white death is dead.** BG `#E8E0D0` (deepened from `#F1EDE3`) is the unlock. UR-measured 1.17:1 luma delta is now ~3:1. Cards lift legitimately. The earlier rounds were painting around the problem; this round actually fixed it. Don't backslide on bg luma in landing or app surfaces — this is the foundation.

2. **Tactile depth language now means something.** Inputs depressed, toggles flat, secondary outlined, primary extruded — each depth state carries one and only one semantic load. Most fintech UIs use depth decoratively; Provedo uses depth syntactically. This is a Sage move — language over flourish — and it's the system's strongest archetype signal. PD's flat-toggle lock was the right call against my earlier pushback.

3. **Forest-jade density discipline held.** From 17+ surfaces down to clean 3-tier hierarchy (toggle-active · semantic-positive · editorial mark). This is the difference between «brand color» (decorative, flattens to noise) and «brand signal» (means something, registers). At this density, every jade appearance carries weight. Future contributors will be tempted to add jade for «warmth» — document this density rule in `04_BRAND.md` so it doesn't drift.

## Notes for `04_BRAND.md` (post-ship lock-in)

Capture before context fades:
- **Two-territory dark theme is intentional.** Light = Mercury+Stripe Press; dark = Linear/Vercel-adjacent because dark = «night focus mode» where Sage takes over. Future contributors may try to «warm» the dark theme back — block that.
- **Forest-jade tier hierarchy** (4 toggle-active · 4 semantic-positive · 5 editorial-mark = 13 max surfaces). Document as cap.
- **Bronze ceiling at `#A04A3D / #BD6A55`.** Don't push further red.
- **Single-word color emphasis in headlines is banned.** Bold weight only. This is the residual Vercel inheritance trap.
- **Cream-highlight alpha in card shadows: 0.55-0.60 max.** Anything higher reads as glow-creep.

Ship it. Freeze 4 weeks. Stop iterating.
