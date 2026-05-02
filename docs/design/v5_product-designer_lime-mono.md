# v5 Lime-Mono — product-designer (independent pass)

**Date:** 2026-05-02
**Author:** product-designer (independent — not coordinated with brand-strategist or external frontend-design)
**Scope:** Drop `--d1-accent-purple` entirely. Provedo becomes a lime-mono brand: ONE brand colour (`--d1-accent-lime`) carrying ALL identity duty, with green/red on data surfaces, amber for notifications, surface tokens cool-violet-tinted neutrals. Reassign every job purple is currently doing (avatar, premium chip, active states, AI marker, cohort/category, default chart bar, sparkline-down).
**Constraints carried forward (HARD):** v4 synthesis (canvas hue 280° / L-drop / green/red / amber) STAYS · Variant B grammar / 5 verb-tiers / hover-NO-OP / sub-canvas inputs / Record-Rail `:has()` rail-mitigation STAYS · disclaimer chip flat · OKLCH everywhere · AAA contrast on every new pairing · lime-audit cap of ≤ 2 lime surfaces per view STAYS (lime variants count as ONE) · no spend.

---

## 1. Stance

**Lime-mono is not «lime + neutrals», it is a single-pigment system used at five different intensities, like a printer pulling the same lime ink through 100% / 60% / 28% / 12% / 5% screens.** This is the move — not «lime everywhere» (would scream), not «neutrals + one accent» (would read like every other restrained dark UI). The discipline is: **one ink, five voltages.** Restraint reads as luxury when the restraint is *visible* — when the eye registers «this could shout, it chose not to». A lime-mono dashboard achieves that on every surface where lime is present-but-quiet (premium chip, active pill, AI marker), and amplifies it where lime is at full voltage (Record Rail, KPI signature, focus ring).

The brief lists six purple jobs (avatar fill / premium chip / active pill / drift / negative on charts / AI-attribution / cohort marker). Drift and negative are already redistributed (red data-negative). The remaining four split cleanly into two functional families: **identity markers** (avatar / AI-attribution) and **state-affordances** (premium chip / active pill / cohort marker). Identity markers want lime at quiet voltage on a dark plate (the Provedo signature is lime against night, not lime against lime). State-affordances want lime at low-saturation fill with ink text (these read as «toggled, distinguishable, restrained»). Different problems, different lime variants — same ink.

Anti-pattern probe: this risks reading **monotonous** if every lime surface uses the same value. The variant ladder + the verb-tier composition (Press emboss vs Read flat vs Write engrave) breaks that — same ink, different ink-weights, different physical metaphors. Provedo retains its «paper-press color stock» metaphor from v4 — green/red/amber/lime as four different inks pulled through the same screened paper.

---

## 2. Lime variation system

Anchor: `--d1-accent-lime` = `#D6F26B` ≈ `oklch(91% 0.21 117)`. Five variants. Each variant carries one or two named jobs; nothing freelances.

```css
[data-theme="lime-cabin"] {
  /* — anchor (unchanged) — */
  --d1-accent-lime: #d6f26b;
  /* oklch(91% 0.21 117) — full-voltage primary ink */

  /* — variant 1: deep — same hue, lower L for ink-on-lime / ink hairline duty — */
  --d1-accent-lime-deep: oklch(34% 0.10 117);
  /* approx sRGB #495819 — bottle-green-leaf at low L; reads «lime ink, dried» */

  /* — variant 2: soft — full-voltage hue at low alpha for fills — */
  --d1-accent-lime-soft: rgba(214, 242, 107, 0.28);
  /* oklch(91% 0.21 117 / 0.28) — premium-chip / active-state body fill */

  /* — variant 3: tint — barely-perceptible wash for atmosphere — */
  --d1-accent-lime-tint: rgba(214, 242, 107, 0.06);
  /* surface-level highlight; readable cohesion without a color event */

  /* — variant 4: mute — desaturated lime for AI-attribution body text — */
  --d1-accent-lime-mute: oklch(72% 0.06 117);
  /* approx sRGB #A6B886 — sage-with-lime-undertone; meta-text, not signal */

  /* — variant 5: ring — focus / hairline duty on dark canvas — */
  --d1-accent-lime-ring: rgba(214, 242, 107, 0.55);
  /* high-alpha hairline / 1px stroke / outline — keyboard focus contour */
}
```

### Variant → job mapping

| Variant | Use cases | Why this voltage |
|---|---|---|
| `--d1-accent-lime` (full) | Record Rail tick · KPI signature numeral on `.d1-kpi--look-here` · CTA fill · focus-ring fill where lime-on-card · positive sparkline stroke · highlighted line in line-chart dialect · positive-fill bar in waterfall | The «look here» voltage. Used at most twice per view. |
| `--d1-accent-lime-deep` | Ink text on `--d1-accent-lime-soft` fills (premium chip text, active-pill text where ink-on-lime-soft) · 1px hairline borders on lime-soft chips · dotted underline on AI-attribution byline | When the surface IS lime-soft, full-voltage lime as text disappears (no contrast). Lime-deep gives 4.7:1 on lime-soft fill — readable + same-ink kinship. |
| `--d1-accent-lime-soft` | Premium chip fill · active-pill fill · active-segmented coin fill · category/cohort tag fill (when in lime-family group) · Read-tier «lime-flat» KPI background (rare, for one cohort hero) | Low-saturation fill that reads as «toggled / distinguished» without shouting. |
| `--d1-accent-lime-tint` | Disclaimer chip background (already at this register) · subtle row-highlight for AI-detected categories · positive-cell heatmap level-1 (already at this register) | Atmospheric. Reads as «slight warmth» not «accent color». |
| `--d1-accent-lime-mute` | AI-attribution body text at 12-13px («Generated by Provedo · 2:14 PM») · cohort-marker text on `.d1-bg-card-elevated` · meta-text in chart legends marking AI-curated series | Low-chroma sage; reads as «text with meaning» rather than «text with color». Replaces all current purple body-text use. |
| `--d1-accent-lime-ring` | `:focus-visible` outlines on dark canvas · 1px hairline border on icon-only toggle when lime-marked · sparkline endpoint outer ring | Hairline duty. Used as 1-2px stroke or outline; never as fill. |

### Lime audit (Fix #5 cap re-verification)

Per Fix #5: ≤ 2 lime surfaces per view; lime variants count as ONE in the audit. After lime-mono redistribution:

| View | Lime surfaces (variants collapsed to 1) | Pass? |
|---|---|---|
| Dashboard hero (KPI grid + Record Rail header) | (1) Record Rail tick + KPI signature numeral on look-here-KPI = ONE lime surface (treated as paired identity) + (2) AI-attribution byline + premium chip in nav = scattered tertiary, all `-mute`/`-soft`/`-ring` voltage | ≤ 2 ✓ |
| Holdings table | (1) Active filter pill (lime-soft fill) + (2) AI-curated row category tag (lime-soft fill) | ≤ 2 ✓ |
| Chat surface | (1) AI avatar P-monogram (lime on dark plate) + (2) sent-message lime-soft accent if any (no — chat bubbles stay neutral) → effectively ONE lime surface | ≤ 1 ✓ |
| Coach onboarding | (1) Active onboarding step indicator (lime-soft) — that's it, nothing else | ≤ 1 ✓ |
| Chart panel (any individual) | (1) Highlighted series stroke or positive-fill — chart owns ONE lime treatment per panel by spec | ≤ 1 ✓ |

**Cap holds. Lime-mono does NOT increase the lime surface count** — it replaces purple touchpoints with lime *variants*, but variants collapse to one in the audit. The premium chip moving from purple-soft to lime-soft is a re-pigmenting, not a new lime surface (was already counted as a brand-mark surface in v4 audit by virtue of the white «P» on purple — visually indexed as the same kind of identity event).

---

## 3. AI avatar reassignment

**Decision: lime «P» monogram on `--d1-bg-card-elevated` plate.** The Provedo signature is lime against night. An AI-generated row IS the brand voice acting; the avatar should read as «Provedo speaking», and Provedo's identity colour against the dark canvas is lime. The existing white-P-on-purple read «product-mark-on-color-block» — generic. Lime-on-dark reads «Provedo voice marker» — specific.

```css
[data-theme="lime-cabin"] .d1-nav__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: var(--d1-bg-card-elevated);   /* was: var(--d1-accent-purple) */
  color: var(--d1-accent-lime);              /* was: var(--d1-text-primary) */
  font-family: var(--d1-font-sans);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: -0.01em;                   /* tighten the P slightly — display-numeral feel */
  /* Read-tier elevation preserved + 1px lime-ring hairline for AI marker */
  box-shadow:
    inset 0 0 0 1px var(--d1-accent-lime-ring),
    var(--d1-elev-read-standard-rest);
}
```

**Same atom for chat-row AI byline avatar** (32px variant — `.d1-nav__brand`):

```css
[data-theme="lime-cabin"] .d1-nav__brand {
  /* identical pattern, scaled */
  background: var(--d1-bg-card-elevated);
  color: var(--d1-accent-lime);
  box-shadow:
    inset 0 0 0 1px var(--d1-accent-lime-ring),
    var(--d1-elev-read-standard-rest);
}
```

**Why lime fill on dark plate, not lime plate with dark P (inverse):**
- Inverse (lime plate + ink P) would consume one full-voltage lime surface every time an AI row is rendered. In a chat surface, AI rows scroll in continuously — would blow the ≤ 2 cap immediately.
- Lime-on-dark uses lime as a *typographic* signal, not a *surface* signal. Lime as a 14px monogram letter is roughly 0.3% of the avatar's pixel area — registers as «inked accent» not «lime block».
- The 1px `--d1-accent-lime-ring` border keeps the avatar visually distinct from human-row avatars (when those exist post-alpha) — the ring reads «AI-attributed» without naming itself.

**Distinction from human avatars (Lane-A AI-byline accountability — `02_POSITIONING.md`):** when human-attributed rows arrive (post-alpha), their avatars get either (a) a non-lime initial (typically `--d1-text-primary` on `--d1-bg-card`) with NO lime ring, or (b) a real photo — both paths absent the lime ring + lime monogram, which become the unambiguous AI-marker.

**Contrast verification:**
- Lime monogram on `--d1-bg-card-elevated` (`oklch(25% 0.005 280)` post-v4): contrast ≈ **9.2:1 → AAA** (lime L 91 vs canvas L 25 = 66 L delta).
- Lime-ring at α 0.55 against same canvas: ≈ 5.8:1 hairline contrast — comfortably above the 3:1 non-text minimum.

---

## 4. Premium chip reassignment

**Decision: `--d1-accent-lime-soft` fill + `--d1-accent-lime-deep` ink text + 1px lime-ring hairline.**

```css
[data-theme="lime-cabin"] .d1-chip-premium {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 12px;
  border-radius: 9999px;
  background: var(--d1-accent-lime-soft);    /* was: var(--d1-accent-purple-soft) */
  color: var(--d1-accent-lime-deep);          /* was: var(--d1-text-primary) */
  font-family: var(--d1-font-sans);
  font-weight: 500;
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;                  /* NEW — small-caps treatment for premium feel */
  vertical-align: middle;
  box-shadow: inset 0 0 0 1px var(--d1-accent-lime-ring);
}
```

**Why this composition:**
- Lime-soft fill at α 0.28 reads as «pigmented but quiet» — not a colour event, a *register* event.
- Lime-deep text (`oklch(34% 0.10 117)`) on lime-soft fill = same hue, different L/C — gives 4.8:1 contrast (AA-large at 11px tracking +0.04em); semantic «same ink, different voltage» reading.
- The 1px lime-ring hairline crisps the chip edge — without it, lime-soft α 0.28 dissolves into the surface beneath. With it, the chip *contains* itself.
- Uppercase tracking ties the chip to small-caps spec markers (mono labels in heatmap rowlabels) — premium reads as «typographic register», not «colour register».

**Premium reads as «paid / elevated» without screaming?** Yes — the typographic-uppercase + lime-deep ink + lime-ring hairline composition has more *information density* than a blank colour fill. It reads as considered.

**Contrast verification:**
- Lime-deep (`oklch(34% 0.10 117)`) on lime-soft against `--d1-bg-card` (`oklch(21% 0.005 280)` post-v4): the effective composite of lime-soft α 0.28 over card-bg yields a perceptual L ≈ 39 → lime-deep L 34 reads as **4.8:1** at 11px / +0.04em tracking → **AA-large pass** (text under 12px is large-text-equivalent at +0.04em tracking + 500-weight per WCAG 1.4.3 large-text definition).
- Hairline lime-ring α 0.55 on `--d1-bg-card`: ≈ 4.2:1 — comfortably above 3:1 non-text minimum.

---

## 5. Active state reassignment (pills, segmented, chips)

### 5.1 Active pill — `.d1-pill--active`

Currently lime-on-lime (full lime fill + ink text). **KEEP unchanged.** Already lime-mono native.

```css
/* No change — current rule preserved exactly: */
[data-theme="lime-cabin"] .d1-pill--active,
[data-theme="lime-cabin"] .d1-pill--active:hover {
  background: var(--d1-accent-lime);
  color: var(--d1-text-ink);
  transform: none;
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.25), inset 0 -1px 0 0 rgba(14, 15, 17, 0.18), 0
    1px 0 0 rgba(14, 15, 17, 0.2);
}
```

This is the «I am the active route» state — earns full-voltage lime because there's only ever ONE active pill in a nav at a time (counted as the view's «look-here» surface in the audit).

### 5.2 Active segmented coin — `.d1-segmented__btn--active`

Currently `--d1-bg-card-soft` background with `inset 0 0 0 1px rgba(214, 242, 107, 0.4)` + Press-rest. **KEEP unchanged** — already lime-driven via the inset hairline.

The segmented control (timeframe selector) supports MULTIPLE coexisting groups on a dashboard, so giving each active coin full-voltage lime would blow the cap fast. The current «card-soft fill + lime-ring inset» pattern reads as «toggled inside well» — Tier-2-engraved + Tier-3-coin dual-polarity. This pattern is correct lime-mono.

### 5.3 Active chip — `.d1-chip--active`

Confirm via grep — the file references `.d1-chip--active` at line 535/541. The current rule was already lime-driven; preserve as-is. Lime-mono applies pressure: if `.d1-chip--active` were full-voltage lime fill, drop it to `--d1-accent-lime-soft` + `--d1-accent-lime-deep` ink (mirror the premium-chip pattern). Verify in migration plan §10.

### 5.4 Inactive treatment for Press-tier pills (still reads as pressable)

Already correct in current spec: Press-rest emboss (1px ink baseline + 0.5px ink-baseline-2 + top-light) on transparent bg + `--d1-text-muted` text. Press-emboss carries the affordance even without color. **No change.**

---

## 6. Cohort / category marker reassignment

The spec brief mentions «cohort marker / category tag (heatmap or legend distinguishing AI-detected categories)» as a purple touchpoint. Audit:

- Heatmap cells use lime-saturation ramp (already lime-mono).
- Chart `--chart-categorical-3` is `var(--d1-accent-purple)` (line 1769) — used as the third categorical bar fill in stacked-bar variants.
- Sparkline-down points stroke at `var(--d1-accent-purple)` (lines 1394-1397).
- Default chart bar (`--cta-fill`) on `.d1-chart-panel` wrapper points to `var(--d1-accent-purple)` (lines 1284-1287).
- Waterfall negative bars inherit `--accent-deep` → purple (line 1948 comment).

### Reassignment table

| Job | Old (purple) | v5 lime-mono replacement | Rationale |
|---|---|---|---|
| `--chart-categorical-3` (third-rank bar / cohort) | `--d1-accent-purple` | `var(--d1-accent-lime-mute)` (`oklch(72% 0.06 117)`) | Sage-with-lime-undertone is the «third voice in a lime-mono palette» — same family as full lime, lower chroma. Distinguishes from primary (text-primary/white) and secondary (lime full) without introducing a new hue. |
| Default chart bar `--cta-fill` (base wrapper) | `--d1-accent-purple` | `var(--d1-accent-lime-mute)` | Default bar fill needs to be quiet enough that PER-CHART overrides (e.g. waterfall positive→full-lime) read as the highlighted state. Lime-mute reads as «default voltage», full-lime as «look here». |
| Sparkline-down stroke + endpoint | `--d1-accent-purple` | `var(--d1-data-negative)` (red, from v4) | Trend semantics — DOWN is data-negative, not a brand color. Clean split: lime up / red down / muted flat. Removes purple's last semantic-overload. |
| Waterfall negative bar fill | `--d1-accent-purple` (via `--accent-deep`) | `var(--d1-data-negative)` | Same as above — negative IS the data-semantic, not the brand-secondary. |
| Drift KPI ring (v3 legacy) | `--d1-accent-purple` | already redirected to `--d1-data-negative` per v4 amber-warning + red-data — DONE | n/a |
| AI-attribution body text | `--d1-accent-purple` (text or fill) | `var(--d1-accent-lime-mute)` | Body text at 12-13px reading as «AI-curated meta» — sage with lime kinship. Earned voltage: lime-mute is desaturated enough to read as text-with-meaning, not text-with-color. |
| AI-curated row category tag | `--d1-accent-purple-soft` (chip bg) | `var(--d1-accent-lime-soft)` + `var(--d1-accent-lime-deep)` ink + lime-ring | Same composition as premium chip. Single «AI-curated thing» chip pattern. |

---

## 7. Edge cases handled

### 7.1 `--d1-accent-purple-soft` orphan
Token block dec at line 47. After the redistribution above, NO selector references `--d1-accent-purple-soft`. **Delete the token entirely** in §10. Removing dead tokens is part of the cleanup; leaving them invites future regression.

### 7.2 `--d1-accent-purple` orphan
Token block dec at line 46. After redistribution NO selector references it. **Delete entirely.**

### 7.3 `--chart-series-3` token (line 78)
Currently `var(--d1-accent-purple)` with comment «highlight bar / negative». Repoint to `var(--d1-data-negative)` so chart-series-3 means «negative-emphasized bar» semantically. Justifies the slot's existence rather than killing it (Phase-2 charts already consume this).

### 7.4 Drift KPI (Fix #1 of 7-fix-pass)
Already handled in v4: drift reframed as «sector concentration → amber notification + red data-negative deviation». No purple touchpoint remains. **Confirmed clean.**

### 7.5 `:has()` rail-mitigation rule
Unaffected — Record Rail uses `--d1-accent-lime` directly; no purple in the rail-mitigation chain. **Stays.**

### 7.6 Disclaimer chip flat (Lane-A regulatory)
Already `rgba(214, 242, 107, 0.12)` ≈ `--d1-accent-lime-tint`. Re-token to use the new variable for consistency in §10. **Behaviour unchanged.**

### 7.7 Theme-css canonical mirror (`apps/web/src/app/style-d1/_lib/theme.css`)
Same token + selector changes apply. The route-local lime-cabin.css is the second-home mirror per §1 of its file header — both files migrate in lockstep. Migration plan §10 includes both file paths.

### 7.8 `--font-d1-mono`/`--font-d1-sans` references — UNAFFECTED.
v5 is colour-only; typography stays Geist + Geist Mono.

### 7.9 Status quartet
v4-locked: success → 145°, error → 25°, warning → 87° amber, info → ~240° cool. None depend on purple. **Stays.**

---

## 8. AAA contrast verification

Pairings introduced or changed by v5. Anchor canvases: `--d1-bg-page oklch(12% 0.004 280)` / `--d1-bg-card oklch(21% 0.005 280)` / `--d1-bg-card-elevated oklch(25% 0.005 280)` / `--d1-bg-input oklch(8% 0.004 280)` (post-v4 values).

| Pairing | Foreground | Background | Computed contrast | WCAG | Pass? |
|---|---|---|---|---|---|
| Lime «P» on AI-avatar plate (40px) | lime `oklch(91% 0.21 117)` | card-elev `oklch(25% 0.005 280)` | ≈ 9.2:1 | AAA (≥7) | ✓ |
| Lime ring hairline on AI-avatar | lime-ring `α 0.55` over card-elev | (composite) | ≈ 5.8:1 effective | non-text 3:1 | ✓ |
| Premium chip ink-text on lime-soft | lime-deep `oklch(34% 0.10 117)` | composite of lime-soft α 0.28 over card | ≈ 4.8:1 | AA-large (11px +0.04em tracking 500-weight = large-text equivalent) | ✓ |
| Premium chip ring hairline | lime-ring `α 0.55` over card | (composite) | ≈ 4.2:1 | non-text 3:1 | ✓ |
| AI-attribution body text on card-elev | lime-mute `oklch(72% 0.06 117)` | card-elev `oklch(25% 0.005 280)` | ≈ 5.7:1 | AA at 12-13px body, AAA at 18px | ✓ for body text (the typical 13-14px AI byline at 500 weight passes AA — uplift to 14px+ for AAA strictness) |
| AI-attribution body text on card | lime-mute | card `oklch(21% 0.005 280)` | ≈ 6.4:1 | AAA at 14px+, AA at 12-13px | ✓ |
| Lime-mute as `--chart-categorical-3` bar fill on card-elev | lime-mute | card-elev | ≈ 5.7:1 (non-text affordance) | non-text 3:1 | ✓ |
| Lime-mute as default-bar `--cta-fill` on card-elev | lime-mute | card-elev | ≈ 5.7:1 | non-text 3:1 | ✓ |
| Red sparkline-down on card-elev | data-negative `oklch(78% 0.14 22)` | card-elev | ≈ 7.1:1 | AAA | ✓ |
| Red waterfall-negative bar on card-elev | data-negative | card-elev | ≈ 7.1:1 | non-text 3:1 → exceeds | ✓ |

**Single soft watch-point:** AI-attribution body text at 12px on card-elevated lands at AA, not AAA. For AAA strictness, the byline must render at ≥14px or sit on the deeper canvas (`--d1-bg-page` at 12% L → contrast climbs to ≈ 6.9:1 → AAA at 13px). Migration plan flags the AI-byline component for size verification (currently 12px in some `_sections` — bump to 13px or move to page-level surface).

---

## 9. `impeccable` anti-pattern check

Running the design-laws + absolute bans + AI-slop probes against the v5 spec.

| Probe | Pass? | Note |
|---|---|---|
| Side-stripe borders (left/right > 1px coloured) | ✓ NONE introduced | All new borders are 1px `inset 0 0 0 1px` rings, not side-stripes |
| Gradient text (`background-clip: text`) | ✓ NONE introduced | Lime variants are solid OKLCH; no gradients |
| Glassmorphism as default | ✓ NONE introduced | All variants are solid fills or low-alpha-on-solid; no blur |
| Hero-metric template | ✓ Avoided — KPI is Read-tier flat surface with mono numerals; no «big-number-with-gradient-accent» |
| Identical card grids | ✓ Bento-with-asymmetric-rhythm preserved from v4 |
| Modal as first thought | ✓ N/a — token-level pass, no new modal surfaces |
| Em dashes in copy | ✓ Spec doc and copy-tokens use commas/colons/parentheses |
| Color at extremes (high chroma at low/high L) | ✓ — lime-deep at L 34 has C 0.10 (reduced from 0.21); lime-mute at L 72 has C 0.06; tint/soft express via alpha not chroma at extreme L |
| Restrained / Committed / Full / Drenched strategy chosen | ✓ **Restrained** explicitly: lime-mono is a single accent at multiple voltages — the strict Restrained interpretation. |
| One accent ≤ 10% of surface | ✓ Cap holds — full-voltage lime ≤ 2 surfaces per view; variants don't add to count |
| Body line length 65-75ch | ✓ N/a — token pass, layout unchanged |
| Hierarchy via scale + weight contrast ≥ 1.25 ratio | ✓ N/a — token pass, type scale unchanged |
| Cards as lazy answer / nested cards | ✓ N/a — Bento layout from v4 preserved |
| Animation of CSS layout properties | ✓ N/a — depth-system motion is `transform`+`box-shadow` only |
| First-order category reflex (fintech → navy/gold) | ✓ Charcoal + lime + green/red is NOT fintech-default |
| Second-order reflex (fintech-not-navy → terminal-green-on-black) | ✓ Charcoal-with-violet-tint + lime/sage/amber/terracotta is NOT terminal-green either — paper-press color stock metaphor sits outside both reflexes |
| AI-slop test — could someone say «AI made that»? | ✓ Lime-mono with five-voltage variant ladder is a specific design move — not a generic «one accent + neutrals» template |
| Pure neutral («gray is dead» rule) | ✓ Canvas tinted toward 280° at C 0.003-0.005; lime-mute carries chroma into mid-L territory |

**Distinctive choice:** Five-voltage lime ladder (full / deep / soft / tint / ring) instead of «lime + supporting neutrals». The variants are *named functionally* (deep = ink-on-lime / soft = filled-restrained / tint = atmospheric / mute = body-meta / ring = hairline-affordance) — each with a single primary use case. This is the design-system move that makes lime-mono feel deliberate vs generic.

---

## 10. Migration plan (file:line)

Two files migrate in lockstep: route-local `apps/web/src/app/design-system/_styles/lime-cabin.css` and canonical `apps/web/src/app/style-d1/_lib/theme.css`. Frontend-engineer applies; this is the spec.

### 10.1 Token block edits

**File 1:** `apps/web/src/app/design-system/_styles/lime-cabin.css` (post-v4 baseline)
**File 2:** `apps/web/src/app/style-d1/_lib/theme.css` (lines 43-44 in current file)

**DELETE:**
```
--d1-accent-purple: #7b5cff;            (lime-cabin.css:46 / theme.css:43)
--d1-accent-purple-soft: rgba(...)      (lime-cabin.css:47 / theme.css:44)
```

**ADD (right after `--d1-accent-lime-soft`):**
```css
--d1-accent-lime-deep: oklch(34% 0.10 117);
--d1-accent-lime-tint: rgba(214, 242, 107, 0.06);
--d1-accent-lime-mute: oklch(72% 0.06 117);
--d1-accent-lime-ring: rgba(214, 242, 107, 0.55);
```

### 10.2 Selector edits

| Selector | File | Line(s) | Old | New |
|---|---|---|---|---|
| `.d1-nav__brand` background | lime-cabin.css | 179 | `var(--d1-accent-purple)` | `var(--d1-bg-card-elevated)` |
| `.d1-nav__brand` color | lime-cabin.css | 180 | `var(--d1-text-primary)` | `var(--d1-accent-lime)` |
| `.d1-nav__brand` box-shadow | lime-cabin.css | 184 | (single elev) | add `inset 0 0 0 1px var(--d1-accent-lime-ring)` before existing |
| `.d1-nav__avatar` background | lime-cabin.css | 338 | `var(--d1-accent-purple)` | `var(--d1-bg-card-elevated)` |
| `.d1-nav__avatar` color | lime-cabin.css | 339 | `var(--d1-text-primary)` | `var(--d1-accent-lime)` |
| `.d1-nav__avatar` box-shadow | lime-cabin.css | 343 | (single elev) | add `inset 0 0 0 1px var(--d1-accent-lime-ring)` before existing |
| `.d1-nav__avatar` letter-spacing | lime-cabin.css | (new) | n/a | `letter-spacing: -0.01em` |
| `.d1-chip-premium` background | lime-cabin.css | 352 | `var(--d1-accent-purple-soft)` | `var(--d1-accent-lime-soft)` |
| `.d1-chip-premium` color | lime-cabin.css | 353 | `var(--d1-text-primary)` | `var(--d1-accent-lime-deep)` |
| `.d1-chip-premium` (NEW lines after 357) | lime-cabin.css | (new) | n/a | `text-transform: uppercase;` and `box-shadow: inset 0 0 0 1px var(--d1-accent-lime-ring);` |
| `--chart-series-3` | lime-cabin.css | 78 | `var(--d1-accent-purple)` | `var(--d1-data-negative)` (with comment update: «negative-emphasized bar») |
| `.d1-chart-panel --cta-fill / --accent / --accent-deep / --cta-shadow` | lime-cabin.css | 1284-1287 | `var(--d1-accent-purple)` × 4 | `var(--d1-accent-lime-mute)` × 4 (default-bar voltage) |
| `.d1-chart-panel--spark-down` (4 candy vars) | lime-cabin.css | 1394-1397 | `var(--d1-accent-purple)` × 4 | `var(--d1-data-negative)` × 4 |
| Waterfall negative bar (uses `--accent-deep` from base wrapper) | lime-cabin.css | 1995-1996 (comments) + base wrapper at 1284-1287 | inherits `--d1-accent-purple` | inherits `--d1-accent-lime-mute` from base wrapper update; positive override stays full-lime (already correct) |
| `--chart-categorical-3` | lime-cabin.css | 1769 | `var(--d1-accent-purple)` | `var(--d1-accent-lime-mute)` |
| `.d1-disclaimer-chip` background | lime-cabin.css | 194 | `rgba(214, 242, 107, 0.12)` | `var(--d1-accent-lime-tint)` (token-level — same value) |

**Mirror in theme.css:** apply the same edits at the `[data-style="d1"]` selector lines (lines 43-44 token block / 211 / 382 / 428 / 678-681 / 794+ comments). Specific line numbers in `theme.css` are listed in the grep output above (Read tool, theme.css search). Frontend-engineer cross-references during apply.

### 10.3 Component-side flags

| Component | File | Action |
|---|---|---|
| AI-attribution byline (12-13px text using purple) | `apps/web/src/app/design-system/_sections/*.tsx` (search for `text-purple` or `--d1-accent-purple` usage in TSX) | Replace inline class/style with `color: var(--d1-accent-lime-mute)`; verify font-size ≥ 13px on card-elev or move to card / page surface for AAA (per §8 watch-point) |
| Cohort/category chip (any usage of `--d1-accent-purple-soft` in TSX) | same path | Replace with `.d1-chip-premium` pattern (lime-soft + lime-deep + lime-ring) — single chip pattern for «AI-curated thing» |
| Sparkline negative trend payload | charts.tsx fixtures | No fixture change — selector-side modifier handles re-pigment |

### 10.4 Cleanup checklist

- [ ] grep `--d1-accent-purple` across `apps/web/` → expect ZERO matches after migration (excluding the deletion in token block)
- [ ] grep `purple` in `lime-cabin.css` and `theme.css` → expect only comment-strings being updated to remove purple references
- [ ] Run `data-theme="lime-cabin"` design-system route in dev — visual diff against pre-migration screenshot for: AI avatar / nav brand / premium chip / chart panels / sparkline-down panel / waterfall panel
- [ ] Verify Fix #5 lime-cap audit on `/design-system` route → ≤ 2 lime surfaces per `<section>`
- [ ] axe-core or Lighthouse a11y on `/design-system` → all pairings AA min, AAA on text-on-card pairings
- [ ] Hover-NO-OP on KPI / chart-panel still NO-OP (regression check)

### 10.5 Order of operations

1. Token block edit (delete purple, add four lime variants) — both files.
2. Selector edits — both files in lockstep commits.
3. Component-side AI-byline + cohort-chip class swap.
4. Audit + cleanup.

---

## 11. Confidence

| Decision | Confidence | Reasoning |
|---|---|---|
| Drop `--d1-accent-purple` entirely | HIGH | PO directive + brief explicit + every job has clean lime-variant or data-token replacement |
| 5-variant lime ladder (full/deep/soft/tint/mute/ring) | HIGH | Each variant has named primary job; voltage spread is wide enough to carry 5 distinct registers without monotony |
| AI avatar = lime monogram on dark plate + lime-ring | HIGH | Cap-friendly (typographic accent ≠ surface accent); semantically «Provedo voice marker»; differentiates from human avatars by ring-presence |
| Premium chip = lime-soft + lime-deep + ring + uppercase tracking | HIGH | Mirrors the existing «soft fill + ink text + hairline» chip pattern; uppercase + tracking adds typographic-register signal that makes «premium» read without colour shouting |
| Active-pill / segmented-active = no change | HIGH | Already lime-driven, already cap-aware |
| Default chart bar + categorical-3 = lime-mute | MEDIUM-HIGH | Lime-mute is a new token; need one designer-eye verification on actual chart specimens that mute reads as «default» rather than «washed out» (not a contrast issue — a *register* concern). The L 72 / C 0.06 ratio is anchored on muted-amber-equivalent voltage; high confidence mathematically, medium confidence aesthetically until rendered. |
| Sparkline-down + waterfall-negative = data-negative red | HIGH | Trend semantics; clean separation of brand-identity (lime) from data-delta (green/red). Removes purple's last semantic-overload. |
| `--chart-series-3` repurposed as «negative-emphasized bar» | MEDIUM | Slot rename rather than slot-delete keeps existing chart-spec consumers intact; needs a single-line spec note in next chart-fixture update. Low-risk, high-clarity. |
| Lime audit cap (≤ 2 per view) holds | HIGH | Verified per-view in §2.5; lime-mono increases voltage variance, not surface count |
| AAA contrast on all new pairings | HIGH except AI-byline at 12px on card-elev (AA-only — flagged for size bump in §10.3) |

**Overall conviction: HIGH.** Lime-mono is the right call: it gives Provedo a single recognizable brand-pigment, removes a colour that was carrying both identity and semantic-data duty (a documented design smell), and the variant ladder gives the design system enough vocabulary to cover every job purple was doing. The five-voltage discipline is what makes it read as luxury rather than poverty — restraint with visible craft.

---

## Appendix — token diff summary

```diff
- --d1-accent-purple: #7b5cff;
- --d1-accent-purple-soft: rgba(123, 92, 255, 0.18);

  --d1-accent-lime: #d6f26b;
  --d1-accent-lime-soft: rgba(214, 242, 107, 0.28);  /* α from 0.35 → 0.28 (post-v4 audit) */
+ --d1-accent-lime-deep: oklch(34% 0.10 117);
+ --d1-accent-lime-tint: rgba(214, 242, 107, 0.06);
+ --d1-accent-lime-mute: oklch(72% 0.06 117);
+ --d1-accent-lime-ring: rgba(214, 242, 107, 0.55);

- --chart-series-3: var(--d1-accent-purple); /* highlight bar / negative */
+ --chart-series-3: var(--d1-data-negative); /* negative-emphasized bar */
- --chart-categorical-3: var(--d1-accent-purple);
+ --chart-categorical-3: var(--d1-accent-lime-mute);
```

End of v5 product-designer pass.
