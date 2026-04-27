# Final Visibility Audit — Product-Designer

**Verdict:** 1 MORE PASS
**Confidence:** high

## TL;DR

PO is right, the merging is real. Three concrete root causes from forensic measurement of the **deployed** CSS at `staging.investment-tracker.app/design-system.html`:

1. **The 1px-border-on-cards/surfaces patch the brief described is not actually deployed.** Only `.input`, `.input.search-input`, `.checkbox`, `.switch`, `.radio` have explicit borders. `.card-pf`, `.card-insight`, `.card-empty`, `.card-signature`, `.toast`, `.modal`, `.topbar`, `.table`, `.bub-ai`, `.tabs`, `.chip` do NOT have a `border:` declaration. `.bub-ai` only has `border-top` (jade tint). Brief drift — what was specified ≠ what shipped.
2. **Dark inset `#0A0A0C` (luma ≈ 12/255) is only 4 units below dark bg `#0E0E12` (luma ≈ 14/255).** Every inset element on bg (tabs container, secondary buttons, input field, chip, switch off, checkbox unchecked, radio unchecked) merges into bg in dark theme. This is the «black-on-black» PO can't pinpoint — it's everywhere.
3. **Dark border opacity 0.12 against near-black inset surfaces is barely visible.** Border is supposed to be the rescue; in dark it isn't doing the job.

Light theme is in better shape. Inset on bg has 8 luma units of separation (`#E8E2D4` on `#F1EDE3`) — soft but acceptable. The «white-on-white» PO sees in light is mostly **topbar/toast/cards merging at the edges** because there is no border line and shadows are warm-soft (intentional) but visually shy.

The fix is small and removes complexity, not adds: **(a) ship the borders that were promised, (b) deepen dark inset 4 hex points, (c) bump dark border opacity 0.12 → 0.18.**

---

## Section 1 — Forensic merge-check

Luma diff = approximate 0–255 brightness delta on the dominant channel.

| Component | Theme | Adjacent surfaces | Luma diff | Severity | Fix |
|---|---|---|---|---|---|
| `.card-pf` (no border in live) | light | `#FFFFFF` on `#F1EDE3` | 14 | low | Add `border: 1px solid var(--border)` |
| `.card-pf` | dark | `#1D1D22` on `#0E0E12` | 7 | **HIGH** | Border + bump `--border` opacity to 0.18 |
| `.card-insight` | light | `#FFFFFF` on `#F1EDE3` | 14 | low | Border |
| `.card-insight` | dark | `#1D1D22` on `#0E0E12` | 7 | **HIGH** | Border |
| `.card-empty` | both | same as card-pf | — | medium | Border |
| `.card-signature` | dark | `#1D1D22` on `#0E0E12` | 7 | medium | Border (lift shadow helps less in dark) |
| `.topbar` | light | `#FFFFFF` on `#F1EDE3` | 14 | low | Border |
| `.topbar` | dark | `#1D1D22` on `#0E0E12` | 7 | **HIGH** | Border — right now topbar is a ghost |
| `.tabs` container | light | inset `#E8E2D4` on `#F1EDE3` | 8 | medium | Border |
| `.tabs` container | dark | inset `#0A0A0C` on `#0E0E12` | **4** | **CRITICAL** | Border + deepen inset to `#070709` |
| `.tab.active` inside tabs | light | `#FFFFFF` on `#E8E2D4` | 21 | OK | — |
| `.tab.active` inside tabs | dark | `#1D1D22` on `#0A0A0C` | 14 | OK | — |
| `.tab` (inactive) hover | both | **rule missing in deployed CSS** | — | medium | Add `.tab:not(.active):hover` rule |
| `.toast` | light | `#FFFFFF` on `#F1EDE3` | 14 | low | Border |
| `.toast` | dark | `#1D1D22` on `#0E0E12` | 7 | **HIGH** | Border |
| `.toast-icon.info` | both | inset on toast card | OK both | OK | (depressed reads correctly) |
| `.modal` | light | `#FFFFFF` on dark overlay `~#7E7768` | huge | OK | — |
| `.modal` | dark | `#1D1D22` on overlay `~#050507` | 16 | OK | — |
| Modal `.btn-ghost` ("Maybe later") | both | transparent on card | text-only contrast: text-2 reads | OK | — |
| Modal `.btn-primary` | both | ink on card | extreme contrast | OK | — |
| `.btn-secondary` (transparent + border) | light | on stage bg | border 0.14 visible | OK | — |
| `.btn-secondary` | dark | on stage bg | border 0.12 barely visible | medium | Border opacity 0.12 → 0.18 |
| `.input` | light | inset `#E8E2D4` on `#F1EDE3`, has border | 8 + border | OK | — |
| `.input` | dark | inset `#0A0A0C` on `#0E0E12`, has border 0.12 | 4 + faint border | **HIGH** | Border 0.12 → 0.20, deepen inset |
| `.search-input` | both | same as input | same | same | same fix |
| `.checkbox` (unchecked) on stage bg | light | inset on bg, border | 8 + border | medium | Already has border; bump --border 0.14 → 0.18 light |
| `.checkbox` (unchecked) on stage bg | dark | inset on bg, border 0.12 | **4 + faint border** | **HIGH** | Border 0.20, deepen inset |
| `.switch` off | both | same as checkbox | same | same | same fix |
| `.radio` unchecked | both | same as checkbox | same | same | same fix |
| `.chip` (no `.accent`/`.ink`) | light | inset `#E8E2D4` on bg | 8 | medium | Add 1px border to base chip |
| `.chip` (no variant) | dark | inset `#0A0A0C` on bg | **4** | **HIGH** | Add 1px border + deepen inset |
| `.chip.accent` | both | jade on bg | high contrast | OK | — |
| `.chip.ink` | both | ink on bg | extreme contrast | OK | — |
| `.chip-close` (× button inside chip) | both | rgba(0,0,0,0.08) on inset chip | low but token-correct | low | — |
| `.citation` inside `.bub-ai` | light | inset `#E8E2D4` on card `#FFFFFF` | 21 | OK | — |
| `.citation` inside `.bub-ai` | dark | inset `#0A0A0C` on card `#1D1D22` | 14 | OK | — (depression reads correctly) |
| `.empty-icon` inside `.card-empty` | light | inset on card | 21 | OK | — |
| `.empty-icon` inside `.card-empty` | dark | inset on card | 14 | OK | — |
| `.bub-user` (depressed slot) | light | inset on bg | 8 | medium | Already has inset shadow; once `--inset` deepened in dark this resolves |
| `.bub-user` | dark | overridden to `#1A2520` on bg `#0E0E12` | 11 | OK | — |
| `.bub-ai` | light | card on bg, no full border (only border-top jade) | 14 + tint | OK | Add full `border` so bottom edge is defined |
| `.bub-ai` | dark | same | 7 + tint | **HIGH** | Same |
| `.table` | light | card on bg | 14 | low | Border |
| `.table` | dark | card on bg | 7 | **HIGH** | Border |
| `.tr.head` row | light | inset `#E8E2D4` on table card `#FFFFFF` | 21 | OK | — |
| `.tr.head` row | dark | inset `#0A0A0C` on table card `#1D1D22` | 14 | OK | — (head correctly reads as depressed band) |
| `.avatar` (in topbar) | both | ink on card | extreme contrast | OK | — |
| `.status-dot` on `.avatar` | both | accent + 2px card-border | 2px ring isolates the dot | OK | — |
| `.pulse` on card | both | accent on card | high contrast | OK | — |
| `.pulse.warn` on card | both | terra on card | high contrast | OK | — |

Severity counts: **2 CRITICAL, 9 HIGH, 6 medium, 4 low.** All CRITICAL/HIGH are dark-theme card-or-inset on near-black bg with no border to rescue them.

---

## Section 2 — Interactive state visibility

| Element | State | Issue | Fix |
|---|---|---|---|
| `.btn-primary` | hover (translateY −1px) | works fine, but no visible color/shadow shift | OK as-is — translation is enough on extruded surface |
| `.btn-primary` | active (translateY +1px) | works | OK |
| `.btn-secondary` | hover light `rgba(0,0,0,0.03)` | **too subtle to notice** | Bump to `rgba(0,0,0,0.06)` |
| `.btn-secondary` | hover dark `rgba(255,255,255,0.04)` | invisible against transparent btn on near-black bg | Bump to `rgba(255,255,255,0.08)` |
| `.btn-ghost` | hover light `rgba(0,0,0,0.04)` | barely visible | Bump to `rgba(0,0,0,0.06)` |
| `.btn-ghost` | hover dark `rgba(255,255,255,0.05)` | barely visible | Bump to `rgba(255,255,255,0.08)` |
| `.nav-item` | hover light `rgba(0,0,0,0.04)` | brief said 7%, deployed is 4% | Bump to `rgba(0,0,0,0.07)` as originally intended |
| `.nav-item` | hover dark `rgba(255,255,255,0.05)` | brief said 10%, deployed is 5% | Bump to `rgba(255,255,255,0.10)` as originally intended |
| `.tab` (inactive) | hover | **no rule exists in deployed CSS** | Add: `.tab:not(.active):hover { background: rgba(0,0,0,0.05); color: var(--ink); }` and dark variant `rgba(255,255,255,0.06)` |
| `.input` | focus | `0 0 0 3px var(--accent-glow)` | OK in both themes |
| `.input.error` | error ring | `0 0 0 2px rgba(155,92,62,0.4)` | OK |
| `.checkbox.checked`, `.switch.on`, `.radio.checked` | active | accent fill + inset highlight | OK — high contrast in both themes |
| `.btn-icon` | hover | only changes text color to `var(--ink)` | medium — add subtle background lift `rgba(0,0,0,0.03)` light / `rgba(255,255,255,0.04)` dark |

The state-visibility findings are all in one direction: **deployed hover backgrounds are 30–50% weaker than the brief specified**. PO didn't imagine the issue — it's measurable.

---

## Section 3 — Border choice review

The brief said «all cards/surfaces got explicit 1px border». **The diff was not deployed** — I read both source-on-disk and live URL, neither contains `border: 1px solid var(--border)` on `.card-pf`, `.card-insight`, `.card-empty`, `.card-signature`, `.toast`, `.modal`, `.topbar`, `.table`, `.tabs`, `.bub-ai`, `.chip`. So the question «is the new border too prominent?» can't be answered — it isn't there.

What to do:

- **Cards on bg need the border.** This is non-negotiable in dark and helpful in light. It's the cheapest fix that resolves 9 of the HIGH severities at once.
- **Cards-inside-cards do NOT need a border.** `.citation`, `.empty-icon`, `.tr.head`, `.toast-icon.info`, `.bub-user` — these are insets on top of cards and have ≥14 luma diff plus inset shadow. Adding borders here would over-decorate and contradict the «paper-restraint» voice.
- **Use `var(--border)` always** (so light gets the warm low-opacity ink line, dark gets the white low-opacity line). Don't introduce new border tokens.
- **Border opacity in dark must lift from 0.12 → 0.18.** At 0.12 against a near-black surface the border is sub-threshold even after you ship it.
- **Border opacity in light at 0.14 is fine** if surfaces also get the border. If you skip the border the «rescue» falls on shadow alone, which is warm and intentionally soft — that's the «white-on-white» feeling.

Border choice is a **structural fix**, not a decorative one. The system already has «soft tactile» mood from shadows and shadows are not changing.

---

## Section 4 — PO callouts diagnostic

### 4.1 Table column alignment — head vs body

I traced this. The deployed `.tr.head > *:nth-child(2..4) { text-align: center }` rule the brief claims is **not in the live CSS**. Live CSS has only the body-row rule:

```css
.tr > *:nth-child(2),
.tr > *:nth-child(3),
.tr > *:nth-child(4) { text-align: right; }
```

Both head and body cells right-align, so geometric alignment is correct. **What PO is reading as «misalignment» is a visual-perception issue:**

- Head cells use `Geist Mono`, `letter-spacing: 0.18em`, uppercase, `font-size: 9px`. A short tracked uppercase word like `QTY` visually right-anchors at the **letter midline**, not the optical edge.
- Body cells use `Geist`, `font-variant-numeric: tabular-nums`, `font-size: 13px`, no tracking. Numbers like `$28,420` right-anchor at the **optical edge** (digit-1 width).
- Between «head right edge» and «body right edge» there is a perceived ~2–4px drift because `0.18em` of trailing letter-space on the head cell pushes the visible glyph cluster left of the cell padding.

**Fix:** strip trailing letter-spacing from the rightmost head cells, OR change head to `text-align: right` with `padding-right: 22px` (+4 over body's 18) to match optical edge. Cleanest:

```css
.tr.head > *:last-child { letter-spacing: 0.12em; }
```

Or simpler: **right-align head, slim the head's letter-spacing to 0.10em on numerical columns only**. Don't go for `text-align: center` on head — that creates a real geometric mismatch.

### 4.2 Surface merging — exact components still merging

Already enumerated in §1. The hot list:
1. `.tabs` container in dark — merges into bg (luma diff 4)
2. `.topbar` in dark — merges into bg (luma diff 7, no border)
3. `.toast` floating in dark — merges (7, no border)
4. All three card variants in dark — merge (7, no border)
5. Standalone `.chip` (default) sitting on stage bg in dark — merges (4)
6. `.btn-secondary` outline in dark — border opacity 0.12 too faint
7. Form controls (`.checkbox`/`.switch`/`.radio`) sitting on stage bg in dark — merge (4 + faint border)

In light, only «soft edge» complaints — none are CRITICAL. Once the border ships, light reads as crisp.

---

## Section 5 — Prioritized fix list

All fixes use existing tokens. No new colors, no new shadows, no new states.

### MUST (ship before sign-off)

**M1. Apply 1px border to surface components on bg.** Add to existing rules — single token, one line each:

```css
.card-pf,
.card-insight,
.card-empty,
.card-signature,
.toast,
.modal,
.topbar,
.table,
.bub-ai,
.tabs {
  border: 1px solid var(--border);
}
```

For `.bub-ai` keep the existing `border-top` jade tint AND add full border — the top edge will naturally inherit the heavier accent tint, the rest 0.14/0.18 ink/white.

```css
.chip { border: 1px solid var(--border); }
```

**M2. Deepen dark `--inset` from `#0A0A0C` to `#070709`.** Pushes inset 3 hex units further from bg `#0E0E12`. New luma diff: 7 (up from 4). Inset elements on bg become readable.

```css
.dark { --inset: #070709; }
```

**M3. Bump dark `--border` opacity from 0.12 to 0.18.** Single token edit.

```css
.dark { --border: rgba(255,255,255,0.18); }
```

**M4. Ship the nav-item hover bumps that the brief promised.**

```css
.nav-item:hover { background: rgba(0,0,0,0.07); color: var(--ink); }
.dark .nav-item:hover { background: rgba(255,255,255,0.10); color: var(--ink); }
```

**M5. Ship the tab inactive hover that the brief promised.**

```css
.tab:not(.active):hover { background: rgba(0,0,0,0.05); color: var(--ink); }
.dark .tab:not(.active):hover { background: rgba(255,255,255,0.06); color: var(--ink); }
```

**M6. Fix table head perceived misalignment.** Tighten head numerical-column letter-spacing so head and body both anchor at optical edge.

```css
.tr.head > *:nth-child(2),
.tr.head > *:nth-child(3),
.tr.head > *:nth-child(4) { letter-spacing: 0.10em; }
```

(Drops the head from 0.18em to 0.10em on QTY/VALUE/DELTA only. Symbol column keeps the wider tracking for typographic balance.)

### SHOULD (ship in same patch if cheap)

**S1. Strengthen secondary/ghost button hover.**

```css
.btn-secondary:hover { background: rgba(0,0,0,0.06); }
.dark .btn-secondary:hover { background: rgba(255,255,255,0.08); }
.btn-ghost:hover       { background: rgba(0,0,0,0.06); color: var(--ink); }
.dark .btn-ghost:hover { background: rgba(255,255,255,0.08); color: var(--ink); }
```

**S2. Subtle btn-icon hover background.** Currently only color shift, easy to miss.

```css
.btn-icon:hover { background: color-mix(in oklch, var(--inset) 100%, var(--ink) 6%); }
```

(Or simple `rgba` if `color-mix` is awkward — pick one.)

**S3. Fix `pf-tiny` `var(--text-1)` undefined token.** It silently inherits `--ink`. Either define `--text-1` (which appears nowhere else) or change the inline style to `color: var(--terra)` for the negative-week card to encode «warning» semantics consistently with the warn pulse.

```html
<div class="pf-tiny" style="color:var(--terra);font-weight:500">−5.8% week · 7 positions</div>
```

### NICE (post-ship if time allows)

**N1. Bump light `--border` from 0.14 to 0.16.** Marginal sharpening of light-theme card edges. Test side-by-side; if the «paper» mood feels harsher, revert.

**N2. Add `box-shadow: var(--shadow-soft)` to `.tabs` container in light** to give the depressed slot one extra ambient hit. Skip in dark (shadow already invisible there).

**N3. Drop `border-top` jade tint on `.bub-ai`** once the full border is in place. Two borders on the same edge make the tint read as a defect on dark theme. Compute final tint as gradient on the `border-image` instead, OR just delete it — the eyebrow «PROVEDO REPLIES» already carries the accent identity.

---

## What NOT to do

- Do not introduce a new border token (`--border-strong`, `--card-border-dark`). One token, conditioned by theme variant, is enough.
- Do not raise shadow strength to «rescue» merged surfaces. Borders are the right tool; shadows stay warm-soft for the «paper» mood.
- Do not shift `--bg` or `--card` hexes again. Two of those have moved twice this session; further movement risks invalidating the brand-strategist's palette sign-off and reopens accent contrast checks.
- Do not add a third surface elevation layer.

## Expected outcome after MUST fixes

Light: every card and surface has a 0.14 ink-low-opacity hairline framing it. The «soft tactile» mood is preserved (shadows unchanged); the «white-on-white at the seams» feeling is gone because every seam now has a 1px line.

Dark: every card and surface has a 0.18 white-low-opacity hairline. Inset elements (chip default, switch off, checkbox unchecked, tabs container) sit 7 luma units below bg instead of 4 — they read as depressed slots, not as bg holes. Tabs hover and nav hover are now perceptible. Table head sits cleanly above body.

PO should see no «black-on-black» or «white-on-white» merges after this single patch. If he does, send back surface-name + theme + screenshot location and we'll spot-fix one cell.

---

**Word count: ~1820.** Within budget.
