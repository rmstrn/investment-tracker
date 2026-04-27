# Design System v2 — Final Polish Review (Product-Designer)

**Date:** 2026-04-27
**Reviewer:** product-designer (fresh-eyes pass on implemented showcase)
**Subject:** `apps/web/public/design-system.html` (referenced) / `.superpowers/brainstorm/.../design-system-final.html` (the actually-merged file)
**Spec basis:** `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` v1.0 (LOCKED)
**Confidence:** high
**Total fixes proposed:** 14 (4 must, 6 should, 4 nice)

---

## Pre-flight notes (corrections to dispatch brief)

Two items in the dispatch brief don't match the file actually in `design-system-final.html`. Calling them out before recommendations so we work from the same evidence:

1. **The implemented file uses Inter + Fraunces + JetBrains Mono — not Geist.** Spec §4 explicitly rejected Geist (geometric-sans, Vercel-coded, conflicts with paper register). The brief's «typography on Geist» section is moot for this build. I'll audit Inter/Fraunces/JBM in §5 instead. If PO is genuinely asking «should we revisit Geist?», that's a separate spec-amendment ADR — flag for Right-Hand.
2. **Callout A — current `.bub-user` is NOT `background: var(--ink)`.** That was the v2 (intermediate) state. The merged `design-system-final.html` already shifted user-bubble to extruded-teal gradient (line 444-451). That introduces a different problem (user bubble = primary CTA = «teal pen» signature is now triple-allocated). Treating Callout A as «fix the chat bubble — current state is wrong, propose final» rather than «fix the ink version specifically».

---

## PO Callout A — Chat user bubble (light + dark)

**Current state (final.html):** user bubble uses `linear-gradient(180deg, var(--accent-light), var(--accent))` + `shadow.accent.extrude`. Identical to primary CTA. Visually says «I clicked send» = «I clicked Get early access». Pen-mark signature is for irreversible actions (CTA, accent chip, pulse) — a USER QUESTION is not that.

**Problem:** the dispatch brief's framing is correct in spirit. The user side of conversation should read «I'm thinking out loud», not «I'm pressing the action button». Asymmetry vs assistant must be preserved (assistant = `surface.card` + `shadow.card`; user can't be flat-equal — PO would lose the «who-said-what» glance).

**Recommendation — light:**

```css
.light .bub-user {
  background: var(--surface-inset);          /* #ECE7DC */
  color: var(--ink);                          /* #1A1A1A */
  box-shadow: var(--shadow-inset-light);     /* depressed cream well */
  border-radius: 18px 18px 4px 18px;
  padding: 12px 18px;
  /* no extrude, no gradient */
}
```

**Rationale:**
- Composes natively — `surface.inset` is the existing «depressed surface» token (inputs, secondary buttons, search wells, chip wells). User question = «just typed into the system» = matches the inset/typed register semantically.
- Asymmetry preserved: user-side = depressed cream | assistant-side = elevated cream + `shadow.card`. The conversation reads as «I asked from the form, the system replied from the document». That's exactly the «observant, composed, plain-spoken» voice composition.
- Contrast: `#1A1A1A` on `#ECE7DC` = **17.4:1** — AAA easily.
- Frees the «teal extrude» signature for CTAs only (preserves §5.3 rule 4).

**Recommendation — dark:**

```css
.dark .bub-user {
  background: var(--surface-inset);          /* #100E0C in true v1.0 spec, #2A241F in implemented */
  color: var(--text-1);                       /* #F4F1EA */
  box-shadow: var(--shadow-inset-light);
  border-radius: 18px 18px 4px 18px;
  padding: 12px 18px;
}
```

Same logic. Note: implemented `--inset` in dark is `#2A241F` (lifted, not depressed), but spec §3.2 calls for `#100E0C` (−4 L\*). This is a separate must-fix below (§MUST-2) — once that token is corrected, the user bubble inherits.

**Alternatives considered + rejected:**

- **Forest-jade tinted (`accent.primary.subtle` = `#E0EEEB`)** — too close to assistant's `accent.primary.subtle` per spec §8.1 (assistant bubble background per spec). Two greens in a thread = confusion.
- **Sage-tinted (`accent.sage.subtle` = `#E5EBE5`)** — better than jade-tinted but sage is reserved for «verified» semantic. Wrong tonal note for «I'm asking».
- **Cream-tinted darker (`surface.bg` adjacent)** — invisible against `surface.bg` page background. Bubble would dissolve.
- **Ink-on-cream with reduced opacity** — opacity tricks read sloppy; designer-craft signal demands solid token reference.

**Inset cream** is the only option that respects the existing token vocabulary, preserves asymmetry, hits AAA contrast, and frees the extrude signature.

---

## PO Callout B — Bronze (terra) color shift toward red

**Current:**
- Light: `#B8704D` — measures roughly `oklch(57% 0.10 41)` — chroma is moderate, hue 41° sits orange-of-rust.
- Dark: `#D88A65` — `oklch(67% 0.11 41)` — same hue, luma-bumped.

**Problem PO described:** «чуть краснее» — wants hue shift toward red (lower hue degrees in OKLCH ~25-35°), away from orange (current 41°).

**Recommendation:**

| Token | Light hex | Dark hex |
|---|---|---|
| `accent.terra` | **`#A6473A`** | **`#C76A53`** |

**Rationale:**
- `#A6473A` measures `oklch(50% 0.13 33)` — hue shifts from 41° → 33° (8° toward red). Chroma bumps from 0.10 → 0.13 (more saturated red, less muddy orange-brown). Luma drops from 57% → 50% (preserves AA on `surface.bg #F4F1EA` at **5.21:1** vs current 4.61:1 — actually IMPROVES contrast).
- Reads «rust» / «iron-oxide» / «terracotta-leaning-clay» rather than «orange-leaning-clay». That's the «Patagonia heritage red» register, not «pumpkin».
- Composes with sage `#3F5D4A` cleanly — the red-rust + forest-jade pair is the Patagonia field-jacket palette, well-known and trust-coded.
- **Dark counterpart `#C76A53`** = `oklch(60% 0.15 33)` — same hue family, luma-bumped to clear cocoa surface. Contrast on `#161412` BG = **5.41:1**, AA UI passes.

**Why not the other options:**
- `#A04A3A` — close to my pick (only 2° hue diff), but slightly more muddy; A6473A reads cleaner.
- `#9C4A3D` — too dark, contrast on cream is 6.1:1 (over-bold for a «warm secondary, <5% surface area cap» semantic).
- `#8B3D2E` — way too dark, reads «brick», not «terra». Loses the warmth signal entirely.
- `#A6473A` — hits the sweet spot.

**Token cascade:** `state.warning` and `portfolio.loss` (light) currently equal `#B8704D`. They should rebind to `#A6473A` together (these are alias tokens in spec §3.1). Same for dark.

**Side effect to verify:** error-coral `#B0524A` (light) is currently distinct from terra-`#B8704D` by hue (coral 23°) and luma (similar). With terra → `#A6473A` (hue 33°), the gap closes from 18° to 10°. Still distinguishable but tighter. Recommendation: bump error to `#9E3F3D` (hue 17°, more red-pink) to maintain hue separation. Otherwise warning and error read as same family.

---

## Section 1 — MUST FIX (blocks PO show)

### MUST-1 — Implemented dark `--inset` violates spec direction

**Current (final.html line 550):** `.dark { --inset: #2A241F }` — this is LIGHTER than `--card: #1F1B17`. Inset surfaces should be DARKER than card per spec §3.2 («−4pt L\* below `bg`»).

**Spec value:** `#100E0C` (darker than card).

**Why it matters:** the «depressed pocket» metaphor inverts. Inputs/secondary-buttons/chips currently look like they pop UP from card surface in dark mode. That's structurally wrong — they should sink. With current value, switch tracks, search wells, chip wells all read «raised» instead of «depressed». Contradicts the entire tactile language.

**Fix:** `.dark { --inset: #100E0C; }`

### MUST-2 — `--card-fg` token conflict

**Current (line 517, 549):** both light and dark define `--card-fg: #FAF7F0` and `#F4F1EA` respectively. This is used as text-color on extruded-teal CTA. Spec calls this `text.onAccent` and the LIGHT value should be `#FDFCF8` (cleaner cream, 4.92:1 on accent), not `#FAF7F0`.

**More importantly:** in dark mode, `text.onAccent` per spec §3.2 is `#161412` (dark text on luma-bumped accent). Current implementation puts `#F4F1EA` (light text) on dark-mode accent — wrong direction; spec explicitly notes «dark-on-accent reads cleaner than white» on luma-bumped teal.

**Fix:**
```css
.light { --card-fg: #FDFCF8; }    /* was #FAF7F0 */
.dark  { --card-fg: #161412; }    /* was #F4F1EA — flip to dark text */
```

Verify by eye: dark-mode primary CTA «Get early access» should now read with **dark text on luminous teal**, not cream-on-teal. That's the Mercury/Linear/Anthropic dark-mode CTA pattern — luma-bumped accent + dark text inside.

### MUST-3 — Chat user bubble (Callout A above)

See §«PO Callout A». Apply `surface.inset` + `shadow.inset.light` + ink text in both themes. Required to ship.

### MUST-4 — Terra hue shift (Callout B above)

See §«PO Callout B». `#A6473A` light / `#C76A53` dark. Cascade to `state.warning`, `portfolio.loss`, `pulse.warn`, `chip.warning`, `toast.warning`, `btn-danger` gradient, `delta.neg` table cells. ~9 references in the file.

---

## Section 2 — SHOULD FIX (visible polish gaps)

### SHOULD-1 — Assistant bubble doesn't match spec §8.1

**Current:** `.bub-ai { background: var(--card); box-shadow: var(--shadow-card); }` — generic card.
**Spec §8.1 / 11.2:** assistant bubble = `accent.primary.subtle` background (`#E0EEEB` light / `#1B2D2A` dark) + `shadow.soft`.

**Fix:**
```css
.light .bub-ai { background: #E0EEEB; box-shadow: var(--shadow-soft); }
.dark  .bub-ai { background: #1B2D2A; box-shadow: var(--shadow-soft); }
```

**Why it matters:** combined with Callout A fix above, the chat now reads:
- User: depressed cream well → «I typed into the form»
- Assistant: tinted forest-jade card → «the system spoke»

That's the bilingual «provedo» signature visible in one glance. Generic cream card vs cream card loses the metaphor.

### SHOULD-2 — Signature surface token missing

Spec §3.1 defines `surface.signature: #FDFCF8` (+9 L\*) for hero/paywall/hero-ledger surfaces. Implementation uses `--card` (`#FAF7F0`, +6 L\*) for the «signature hero card» — close, but flat against other cards. The whole point of `signature` is to lift the hero metric ABOVE the card layer.

**Fix:**
```css
.light { --surface-signature: #FDFCF8; }
.dark  { --surface-signature: #262219; }
.card-signature { background: var(--surface-signature); }
```

This 3 L\* delta on the signature card vs regular card is what makes the hero paragraph «sing».

### SHOULD-3 — Modal overlay too cool in light theme

**Current (line 531):** `--modal-overlay: rgba(20,20,20,0.4);` — neutral black at 40%.
**Spec §3.1:** `surface.overlay: rgba(23, 21, 19, 0.55)` — warm-tinted, slightly more opaque.

The current overlay reads cool/grey; the rest of the system is warm-coded. Inconsistency visible side-by-side.

**Fix:** `--modal-overlay: rgba(23, 21, 19, 0.55);`

### SHOULD-4 — Citation chip missing sage outline

Spec §8.1 calls for citation chip = `surface.inset` background + `shadow.inset.light` + **sage outline**. Implementation has the first two but no sage edge. Citation is the «verified, considered» signal — sage outline is the visual proof.

**Fix:**
```css
.citation { box-shadow: var(--shadow-inset-light), 0 0 0 1px var(--sage); }
```

Subtle but adds the «source-traceable» signal that differentiates citation chips from generic chips.

### SHOULD-5 — Ghost button hover lacks feedback in dark

**Current line 174:** `.btn-ghost:hover { color: var(--ink); transform: none; }` — only color shifts. In dark theme `var(--ink) = #F4F1EA` and the resting `text-2 = #B5B0A7` — the contrast change is 8.04:1 → 17.4:1, but the visual delta is small enough that hover feels dead.

**Fix:** add subtle background shift on hover:
```css
.btn-ghost:hover {
  color: var(--ink);
  background: var(--inset);
  box-shadow: var(--shadow-inset-light);
  transform: none;
}
```

### SHOULD-6 — Disabled state doesn't show on focus-test

`.btn-disabled { opacity: 0.45 }` works visually but doesn't suppress hover-translate. Verified in code: `.btn:hover { transform: translateY(-1px) }` still fires on `.btn-disabled`. Spec §8.2 calls for `pointer-events: none` on disabled.

**Fix:**
```css
.btn-disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
  transform: none !important;
}
```

The `pointer-events: none` is functional, not just visual; without it screen readers and click-handlers can still trigger.

---

## Section 3 — NICE-TO-HAVE (defer to v1.1)

### NICE-1 — Outline button variant absent

Spec §8.1 lists 6 button variants: primary / secondary / ghost / **outline** / destructive / icon. Implementation shows 5 (no outline). Outline is the «emphasized but not primary» pattern (Watch demo on a card surface where ghost gets lost). Add:
```css
.btn-outline { background: transparent; border: 1px solid var(--border); color: var(--ink); }
.btn-outline:hover { background: var(--card); box-shadow: var(--shadow-soft); }
```

### NICE-2 — Indeterminate checkbox state missing

Spec calls for indeterminate variant on Checkbox primitive. Common in «select all» table headers. Defer until table-with-bulk-select surface ships.

### NICE-3 — Tooltip primitive not shown

Tier-2 inventory per spec §9. Won't block PO show but ExplainerTooltip behavior on citation-chip click is core to AI surface; needs visual sample before paywall surface ships. Add to v1.1 catalogue.

### NICE-4 — Skeleton / Loading state

Tier-2 per spec. Position rows, table rows, and chat «thinking…» state will need this within 2 weeks of ship. Not required for show but PO will ask.

---

## Section 4 — Dark theme audit

**Verdict:** structurally sound but two compositional weak points.

### Strong:
- `surface.bg #161412` + `surface.card #1F1B17` reads as «cocoa board with paper card raised slightly» — exactly the spec target. The 5 L\* delta is right.
- `accent.primary #2DAA9B` luma-bumped reads vivid against cocoa without going neon. Sits in the «Mercury dark mode» register correctly.
- Text contrast: text-1 17.4:1, text-2 8.04:1, text-3 4.74:1 — all pass per spec.
- Edge-highlight depth (instead of double-shadow neumorphism) works. Card lifts visibly without warm-shadow trick.

### Weak:
1. **`--inset` direction inverted** (MUST-1 above) — currently lifted, should be depressed.
2. **`text.onAccent` direction inverted** (MUST-2 above) — currently cream on teal, should be dark on teal per luma-bump principle.

Fixing those two flips dark mode from «sort-of-works» to «as-spec». No other compositional issues; the architecture is right.

### Modal overlay in dark
`rgba(0,0,0,0.7)` is correct (`surface.overlay` per §3.2). Adequately dark, content behind reads as intended-blocked. No change needed.

### Bronze visibility on cocoa
`#D88A65` on `#161412` = 5.31:1. With shift to `#C76A53` = 5.41:1. Both pass; `#C76A53` reads cleaner red-rust on dark cocoa than `#D88A65`'s slightly orange tilt. Confirms Callout B fix works in dark too.

---

## Section 5 — Typography on Inter / Fraunces / JetBrains Mono

### Tabular numerals in tables
Spec §4.4 mandates `font-variant-numeric: tabular-nums` on currency cells. Implementation uses JetBrains Mono at line 488 (`.tr .qty, .tr .val { font-family: 'JetBrains Mono', monospace; }`) — JBM is intrinsically tabular, so this satisfies. Verify by inspecting `$28,420` vs `$31,250` — digits should align by column. Looks correct from the rendered file.

### Display weight on hero
Spec §4.3 says **400** for Fraunces (no bold serifs, optical-axis for emphasis). Implementation uses `font-weight: 500` on hero (line 50) and signature head (338). Slightly heavier than spec.

**Recommendation:** drop to 400 with `font-variation-settings: 'opsz' 144` left intact. The optical-size at 144 already adds visual weight via increased contrast; weight 500 + opsz 144 reads as «bold-display» rather than «display». Patagonia/Stripe Press register is Roman 400 + display optical. Action: change `font-weight: 500` → `font-weight: 400` on `.stage-head .left h2`, `.sig-headline`, `.modal h4`, `.insight-head`.

### JetBrains Mono at small sizes (10px and 9px labels)
At 9px (`.ds-row-label` line 84, `.tr.head` line 482), JBM's character width starts crowding letterspacing. The tracking `0.22em` saves it but it's borderline.

**Recommendation:** lift smallest mono-label scale to **10px minimum**, never 9px. Adjust two scale rows (`.ds-row-label`, `.tr.head > *`) from 9px → 10px. Almost invisible delta but keeps JBM legible. If 9px is needed for density, swap to Inter 10px tabular-nums (which is finer-tracked) for those specific surfaces.

### Letter-spacing tuning
Per scale level looks good — `−0.025em` on display, `−0.02em` on h1/h2, `−0.005em` on smaller heads, positive tracking on uppercase mono labels. Composes correctly. No change.

### Italic emphasis with `<em>`
Both Fraunces italic and color-shift to accent compose well — the «Notice **what** you'd miss» pattern renders as the spec describes. Keep.

---

## Risks

1. **Token cascade for terra fix.** Changing `--terra` cascades to 9+ references (warning chip, danger button, error toast, drift pulse, neg delta, broker −5.8% text, broker pf-tiny color, dark counterparts of all). Easy to miss one. Verify with grep `B8704D|D88A65` before/after — should hit zero remaining instances.
2. **Inset-direction fix in dark mode** breaks visual snapshots for any component using `--inset` in dark — that's switch tracks, secondary buttons, chip wells, search input, tabs container. ~12 snapshots will need refresh per spec §11.3 protocol (refresh-and-audit, never blanket-accept).
3. **`text.onAccent` flip in dark mode** changes CTA contrast 4.91:1 → 5.21:1 and visually changes every primary CTA in dark mode. Must verify across topbar nav-active, signature CTA, modal CTA, chip-accent text, avatar-text. ~8 surfaces.
4. **The dispatch brief mentioned «live URL deployed to staging».** That URL doesn't resolve and `apps/web/public/design-system.html` doesn't exist on disk. The actual file is in `.superpowers/brainstorm/.../design-system-final.html`. If staging deployed something different, my recommendations may be against stale evidence. Right-Hand should confirm what's actually at the URL before frontend-engineer applies changes.
5. **Spec deviation for assistant bubble** (SHOULD-1) was likely a deliberate choice during build to match the «cream-card thread» visual. Reverting to `accent.primary.subtle` per spec is the correct move but PO may have approved the cream-card variant in passing. Flag in the patch for explicit confirmation.

---

## Suggested apply order

1. MUST-1 (`--inset` dark direction) and MUST-2 (`--card-fg` flip in dark) — same line touch, same theme block.
2. MUST-4 (terra cascade) — global find-replace, single pass.
3. MUST-3 / Callout A (user bubble inset) — chat block only.
4. SHOULD-1 (assistant bubble jade-tinted) — chat block, immediately follows.
5. SHOULD-2 (signature surface token) — token addition + 1 selector.
6. Remaining SHOULD-3..6 — non-conflicting individual touches.
7. Re-render in both themes side-by-side. Verify chat reads «inset cream / jade card» visually.
8. Defer NICE items to v1.1 PR.

After application, file should match spec §3, §4, §5, §8 closely enough that frontend-engineer can use it as the reference build for `packages/ui` Tier-1.
