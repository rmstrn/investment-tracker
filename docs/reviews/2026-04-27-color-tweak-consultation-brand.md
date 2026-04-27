# Color Tweak — Brand Boundary Check

**Verdict:** TIGHTEN-DIFFERENT-DIRECTION
**Confidence:** high

The merging is real (UR measured 1.17:1 — sub-perceptual, not subjective). But the cure is **not** «push bg darker» nor «push card whiter». Both options drift the system out of Mercury/Granola/Stripe Press territory. The right move is **deepen inset + add the missing border + prune accent density** so card-on-bg gets edge definition from architecture, not from luma war. Color change supports only at the inset layer (cosmetic, in-territory), and only if PD also lands the structural fixes.

---

## Section 1 — Brand boundary on bg/card luma

The territory we own:

| Brand | BG luma | Cream warmth | Posture |
|---|---|---|---|
| Mercury 2024 | ~94% L | warm-neutral, low chroma | paper-card |
| Stripe Press | ~96% L | warm cream, slight gold | book-paper |
| Granola | ~93% L | tan-paper, visible warmth | notebook |
| Patagonia editorial | ~92% L | warm cream + ink | catalog |
| **Provedo current** | `#F1EDE3` ≈ 93% L | warm cream, low chroma | paper-card |

**How dark can BG go before drifting?**

- Down to ~88-89% L (e.g., `#E8E2D4`, the current inset value) is still cream territory. Below ~86% L it reads «old paper / archive» — defensible if we wanted Aesop/Anthropologie-archival, but not where Mercury/Stripe Press live.
- **Hard floor: ~88% L.** Below that the system reads «vintage» which is wrong archetype (decorative, not observation-grade).
- Practical proposal: if PD wants more bg/card separation by darkening bg, ceiling is `#ECE6D4` (≈ 90% L). Anything darker = territory drift.

**How saturated can cream stay before drifting?**

- Current bg `#F1EDE3` chroma ≈ 0.012. Patagonia/Mercury sit 0.008-0.020. Anthropologie warm-decorative starts ~0.030+.
- **Hard ceiling: chroma ~0.025.** Higher and we leave restrained-paper for warm-decorative-catalog (wrong archetype — that's Magazine, not Sage).

**Cooler-grey shift?**

- `#EEEEE9` (cooler-neutral) → drifts toward Linear/Vercel/Notion-cool. **REJECT.** That's a different territory entirely; we'd lose Patagonia warmth and become «yet another fintech-grey». The whole reason cream was chosen over Linear-grey was Everyman warmth.

**The right cosmetic answer (if any color change happens at all):**

- **Same warmth, slightly less luminosity on inset only.** Inset `#E8E2D4` → `#E2DCCB` (≈ 87% L). This is BELOW my hard floor for *bg* but FINE for *inset*, because inset is supposed to read «recessed» — going slightly darker here is on-archetype.
- **Bg should NOT move.** `#F1EDE3` is correct. Cream-bg is a brand asset; touching it for a card-merging problem is fixing the wrong layer.
- **Card `#FFFFFF` should NOT move.** Pure white on cream is the Mercury/Stripe Press signature. If card luma drops, we lose «paper card pinned to corkboard» and gain «greige uniformity» — wrong direction.

**Boundary summary:** support inset deepening (`#E2DCCB`-ish), reject bg shift in either direction, reject card desaturation. **The merging fix is structural (border + shadow), not chromatic.**

---

## Section 2 — Forest-jade tier proposal

Already specced in detail in `2026-04-27-design-system-final-brand-harmony.md` §4. Restating here as the formal lock:

### Tier 1 — Active controls (4 surfaces)

`checkbox.checked` · `switch.on` · `radio.checked` · `input:focus` glow ring

**Rationale:** user-controlled state. Color = «I activated this». Highest semantic load.

### Tier 2 — Semantic data + status (4 surfaces)

`pulse` (success dot + halo) · `tr .delta.pos` (positive numbers in tables) · `status-dot` (avatar online) · `toast-icon.success` fill

**Rationale:** observation-grade meaning — «this is positive». Sage = color must mean something measurable.

### Tier 3 — Mono-only editorial (5 surfaces, color in mono labels only)

`stage-head .eyebrow` · `sig-eyebrow` · `insight-eyebrow` · `bub-ai .label` («PROVEDO REPLIES») · `citation::before` (✦ glyph)

**Rationale:** these are tiny mono labels (≤11px). Accent here reads «attribution», doesn't compete with content. Keep.

### DROP from these surfaces (8 removals)

- `sig-headline .accent` (single-word color in display headline) → ink + 700 weight
- `insight-head .accent` (single-word color in card head) → ink + 700 weight
- `bub-ai .body .accent` (single-word color inside chat) → ink + 700 weight
- `bub-ai border-top` (jade-tinted hairline) → drop entirely (border + shadow + label already differentiate)
- `chip.accent` («Verified») full-fill → outlined variant: transparent bg + 1px accent border + accent text
- `avatar.accent` full-fill → demo-only, don't ship to product
- (covered by Tier-3 already): editorial mono labels keep accent
- Verify no inline span overrides in markup that re-introduce accent on body words

**Net reduction:** 17 → 9 surface uses. Color regains semantic weight.

**Why this matters for the merging problem:** at 17-surface density, accent reads as «brand color = decoration» which adds visual noise that compounds the perceived merging. Pruning to 9 is part of the fix, not a separate concern.

---

## Section 3 — Anti-feature scan

Yes. Three decoration creeps are amplifying perceptual noise:

**1. Layered emphasis on signature card.**
Currently stacks: lift shadow + 22px radius + display-48 type + accent-color on «what» + ink CTA. Five emphasis devices on one surface = Hero-archetype crowding. The accent-on-«what» is the redundant one (per Tier 1+2+3 prune above). Drop it.

**2. Belt-and-suspenders on AI bubbles.**
`bub-ai` carries: card border + lift shadow + accent label + tinted top-edge hairline. Four differentiation devices. The tinted hairline is the redundant one. In a long conversation it becomes a green ladder — visually noisy in a way Granola/Anthropic Claude are not. Drop the `border-top` jade tint; let border + shadow + mono label do the work.

**3. Mismatched border opacity vs shadow softness.**
This is PD's territory but brand-relevant: light-theme uses warm-soft shadow (intentional, Mercury-correct) **without a structural border**. Soft shadow alone can't carry edge definition on cream-on-white. Result: every card looks like it's floating in fog. Per PD's visibility audit, the border was specced but never deployed. Ship it.

**No false-decoration found:** no gradients, no glassmorphism, no skeumorphic creep, no emoji, no decorative blobs. Discipline held everywhere except the three above.

---

## Section 4 — Bronze position confirm

**Confirmed. Safely landed. Don't push further.**

`#A04A3D` light / `#BD6A55` dark sits in **museum-vitrine / old-leather / Patagonia Worn Wear / Aesop terracotta** territory. Acid tests:

- `pulse.warn` on Binance card → reads «attention warranted», NOT «danger». Correct.
- `−5.8%` table delta → reads «warning», NOT «catastrophe». Correct.
- `chip.warning` («Drift +3.2%») → noteworthy, not alarming. Correct.
- `toast-icon.warning` (`!` on bronze) → editorial caution. Correct.
- `btn-danger` («Delete») → still firm enough to register destructive. Marginal but adequate.

**Has it crossed into alarm-red?** No. Alarm-red would need hue ≤10° + chroma ≥0.15. Current `#A04A3D` ≈ hue 15° + chroma ~0.10. Two safety buffers. The red-shift opened ~2-3% of «alarm» space the orange didn't have, which is exactly the upgrade we wanted on `pulse.warn` and table negatives without touching `btn-danger`.

**Lock these values in `04_BRAND.md` once it's created.** If a future round tries to «warm» bronze back toward orange (for «friendliness») — reject. The museum register is the brand asset.

---

## Key constraint to PD

**Do not solve a structural merging problem with a chromatic move.** The territory we own (Mercury 2024 + Stripe Press) is defined by warm cream + ink + restrained accent + paper-card layering. Pushing bg darker than `#ECE6D4` drifts to vintage-archive; pushing bg cooler than current chroma drifts to Linear-grey; desaturating card from `#FFFFFF` collapses the cream-on-white signature. The merging gets fixed by **(a) shipping the missing 1px borders on cards/topbar/toast/table/bub-ai/chip, (b) deepening dark inset to `#070709` and bumping dark border opacity 0.12 → 0.18, (c) optional cosmetic: deepen light inset only to ~`#E2DCCB` if more recessed-feel is wanted on form fields**. Brand-side will support all three of those. Brand-side will **reject** any proposal that touches bg luma or card luma in light theme — those are locked.

---

**Cross-cuts to land in same patch (brand-strat will sign off if PD includes them):**
1. Drop accent-color from single-word emphasis (sig-headline, insight-head, bub-ai body) — bold weight only
2. Drop `bub-ai border-top` jade hairline
3. Forest-jade 17 → 9 surfaces per tier table
4. Lock bronze `#A04A3D / #BD6A55` — no further red push
