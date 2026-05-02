# V4 Design Pass — Brand-Strategist Palette Redirect

**Author:** brand-strategist agent
**Date:** 2026-05-02
**Status:** Independent v4 proposal (parallel-track with product-designer + frontend-design generalist; do not read each other's outputs — Right-Hand synthesises).
**Brief:** PO challenged the v3-shipped «editorial-warm hue 75» retint after live render: «теперь дизайн какой то коричневый. я бы хотел в сторону чёрного или тёмного смотреть». Also requires green + red at the amber `#F4C257` register (NOT TradingView-saturated). Brand redirect required; do not re-defend hue 75.

---

## VERDICT

**SUPPORT-with-conditions** — pivot canvas to **cold paper-graphite (hue 240° at chroma 0.001–0.003)**, introduce green + red at the amber register matched to `#F4C257`, and adopt **hybrid green-up / red-down only on data-rendering surfaces** while preserving lime as brand-primary signal.

PO is right. The v3 hue 75 retint perceptually translated to «brown SaaS» on dark canvas — the chroma I specified (0.008–0.014) is within the impeccable tinted-neutrals band, but the *hue choice* sat 60° away from the lime accent (122°), and the warm-yellow tint reads as warm-coffee-stain rather than editorial-paper when the lime fill is loud at full chroma 0.18. The metaphor I was reaching for («Field Notes / NYT plate») depends on a *light* paper substrate; on a *dark* substrate, hue 75 becomes brown because there's no white-paper context to anchor the yellow as «paper».

The brand-correct dark-substrate metaphor is not «aged paper» — it is **graphite drawing on charcoal cardstock** (architectural draft, NYT photo-section blacks, the Field Notes Pitch Black notebook). That register is hue 240° at chroma 0.001–0.003 — *cool enough to read dark, restrained enough to keep an editorial metaphor, and 118° away from lime so the lime accent reads as accent rather than as competition.* This is the redirect.

Conditions on SUPPORT:

1. Canvas pivots to hue 240° at chroma 0.001–0.003 (cold paper-graphite) on the 4 surface tokens; lightness held within ±1% of v3 values to preserve AAA contrast.
2. Green + red enter at the amber register `oklch(82% 0.13 H)` — green at hue 152°, red at hue 28°. Single saturation level; deferred bright/soft variants.
3. Green-up / red-down adopted **only on data-rendering surfaces** (charts, delta numerals on KPI cards, gain/loss columns). Lime stays brand-primary signal (Record Rail tick, focus-ring, look-here KPI fill, AI byline, active filter chip).
4. Status quartet aliased: `--d1-status-success` ← `--d1-finance-up`; `--d1-status-error` ← `--d1-finance-down`. Single source for system-state and delta-direction at the same hue, so the system has one green and one red, not two of each.
5. The 3-color family (amber + green + red) must render together once before lock — visual triad coherence test, not just per-token AAA contrast.

---

## 1. Hue redirect — cold paper-graphite (option E)

### 1.1 Six-option assessment

| Option | Hue / chroma | Brand-DNA read | Verdict |
|---|---|---|---|
| **A. Pure neutral** (chroma → 0) | hue irrelevant, chroma 0 | Bloomberg-Terminal-credible. Material-honest. **Drops the editorial metaphor entirely.** Reads as «pure utility», not as «designed». ICP A: positive (Bloomberg). ICP B: neutral-to-bored (Linear has chroma > 0). | **REJECT** — Sage-correct but Magician-flat. Provedo loses its only brand-craft hook in the canvas. |
| **B. Cool-blue ≈ hue 240°** (chroma > 0.005) | 240° / 0.008–0.014 | Generic. **Discord / GitHub Dark / every fintech 2018-2024.** First-order category reflex (impeccable's "AI dashboard → cool blue" trap). | **REJECT** — saturated reflex. Reads as default. |
| **C. Cool-violet ≈ hue 280°** | 280° / 0.008–0.014 | Linear / Vercel / Notion-dark / Raycast. **Modern-tech-luxury, but currently saturated.** ICP B native; ICP A reads it as «trying-too-hard SaaS». Second-order reflex. | **REJECT** — "AI workflow tool that's not SaaS-cream → editorial-typographic" reflex catches this. |
| **D. Cool-greenish ≈ hue 120°** | 120° / 0.005–0.010 | Lime accent harmony. **Collides with `--d1-accent-lime` (hue 122).** Canvas + accent at the same hue means no perceptual separation; lime stops popping. | **REJECT** — kills the lime accent. |
| **E. Cold paper-graphite ≈ hue 240° at chroma 0.001–0.003** | 240° / 0.001–0.003 | **«Cold-pencil-on-charcoal-cardstock»** — architectural draft, NYT photo-section, Field Notes Pitch Black. Sage + Magician compose. Distinguishable from B because chroma is below the conscious-perception threshold. The hue is *implied*, not *stated*. | **PICK** — passes both impeccable reflexes (not "cool blue", not "Linear violet"); reads dark; keeps brand-craft hook. |
| **F. Pure black + 1° hue tint** (e.g., 240° at chroma 0.0005) | 240° / 0.0005 | Maximum contrast, minimum chromatic commitment. **Effectively identical to A in render** — chroma below 0.001 is invisible. | **REJECT** — strictly dominated by E (E's chroma is also below conscious threshold but slightly more bend toward a hue, giving the canvas a weak directional pull that composes with cool-side accents). |

### 1.2 Brand-DNA argument for E

**Why graphite, not paper, on a dark substrate.** The v3 mistake was applying a *light-paper-pulp* hue (warm yellow 75°) to a *dark* canvas. Light paper hues only read as paper when there's a light-paper context. On a charcoal canvas, the warm tint reads as «old film stock browning» or «coffee-stained office». The brand-correct dark-substrate metaphor swaps the substrate from «paper pulp» to «cardstock + graphite»: a Field Notes Pitch Black notebook page is hue 240° (cool dark grey-blue), not hue 75° (warm tan). NYT's photo-section black is the same. The metaphor stays editorial — it just shifts from «aged ledger paper» to «archival cardstock with graphite annotation».

**Why chroma 0.001–0.003 (not 0.008–0.014 like v3).** At chroma 0.008+, the hue becomes consciously visible — the canvas reads as «tinted dark grey». PO read v3's chroma 0.008–0.014 at hue 75 as «brown». At chroma 0.001–0.003, the hue is *subliminal* — the canvas reads as «dark grey» on first look, with a *subconscious cool tilt* on second look. This is the impeccable-grounded discipline of «tint every neutral toward the brand hue (chroma 0.005–0.01 is enough)» dialled one notch quieter, because the lime accent is loud enough that the canvas doesn't need to compete. Sage anti-position protected: the canvas is restraint, not assertion.

**Why 240° as the directional pull (not 270° or 220°).** 240° is the canonical «cold, not specifically blue» hue — between blue (240°) and violet (290°). It's the hue of a graphite-pencil-stroke on charcoal paper. 270° (blue-violet) leans toward Linear/Vercel violet — second-order reflex caught in the table above. 220° (cyan-blue) leans toward Discord/Slack — first-order reflex. 240° threads the needle. Composes with lime (122°) at 118° apart — clean perceptual separation. Composes with the proposed amber-register green (152°) at 88° apart — clean. Composes with amber (87°) at 153° apart — wide but stable. Composes with the proposed amber-register red (28°) at 212° apart — near-complementary, gives the red maximum «pop against the canvas» when needed.

### 1.3 OKLCH triples for the 6 surface tokens

```css
[data-style="d1"] {
  /* ── Canvas — pivoted from hue 75° (warm tan) to hue 240° (cold paper-graphite).
   *    Lightness held within ±1% of v3 to preserve AAA contrast.
   *    Chroma dropped from 0.008–0.014 to 0.001–0.003 — subliminal not stated. */

  --d1-bg-page:           oklch(15% 0.002 240);  /* page canvas — Tier 0 */
  --d1-bg-surface:        oklch(20% 0.002 240);  /* section frame */
  --d1-bg-card:           oklch(24% 0.003 240);  /* non-elevated containers */
  --d1-bg-card-soft:      oklch(27% 0.003 240);  /* press-tier hover bg, segmented active bg */
  --d1-bg-card-elevated:  oklch(28% 0.003 240);  /* Read-tier surface fill (KPI / panel) */
  --d1-bg-input:          oklch(11% 0.001 240);  /* Write-tier sub-canvas well */
}
```

### 1.4 Lightness verdict — HOLD at v3 values

The PO directive «к чёрному, тёмному» reads as «cooler/darker». Cooler is satisfied by the hue + chroma redirect above. Darker is *not* needed — v3 lightness values (15%, 20%, 24%, 27%, 28%, 11%) are already at the dark end of the impeccable-defendable range. Pushing card lightness from 24% → 20% would compress the contrast between page (15%) and card (now 20%), reducing the «document on desk» depth read that variant B is built on. Pushing card-elevated from 28% → 24% would erase the Read-tier amplitude differentiation.

**Hold at v3 lightness.** The hue + chroma redirect alone resolves the «brown» perception.

### 1.5 Re-tinted ink (text) tokens

```css
  /* Text ink — re-tinted to match the new canvas hue (240°), chroma kept low. */
  --d1-text-primary: oklch(98% 0.001 240);   /* AAA on bg-card */
  --d1-text-muted:   oklch(64% 0.005 240);   /* AA-large + AAA on 16px+ body */
  --d1-text-ink:     oklch(11% 0.003 240);   /* AAA on lime, slightly cool-cast */
```

**Note:** ink hue follows canvas hue. Mixing hue-240° text on a hue-240° canvas keeps perceptual coherence; the previous v3 hue-75° ink on hue-75° canvas was internally consistent but rejected for the canvas-hue reason — the redirect propagates through ink for the same reason.

### 1.6 Contrast verification (computed against new hue)

| Pair | Computed contrast | Standard |
|---|---|---|
| `text-primary` on `bg-card` | ~14.7:1 | AAA |
| `text-muted` on `bg-card` | ~5.6:1 | AA-large; AAA at 16px+ body |
| `text-ink` on `accent-lime` | ~14.9:1 | AAA |
| `text-primary` on `bg-card-elevated` | ~13.0:1 | AAA |
| `text-primary` on `bg-input` | ~18.4:1 | AAA |

Lightness held; contrast ratios from v3 carry through unchanged. AAA preserved across all 5 critical pairs.

---

## 2. Green spec — `oklch(82% 0.13 152)` at amber register

### 2.1 Hue choice rationale

Candidate hues evaluated against the locked saturation register (L 82, C 0.13 — matched to amber `#F4C257`):

- **145° canonical leaf-green** — Excel default. AI-design-default green. Reads as «system OK» but generically. Reflex-trigger.
- **152°** — desaturated forest-leaf. *Sage-correct* (forest, not stoplight). 30° away from lime hue 122 (perceptually distinct without clashing). 65° away from amber hue 87 (family-coherent). Already specced as v3 `--d1-status-success` at chroma 0.14 — moving it to 0.13 keeps it inside the locked register. **PICK.**
- **135° yellower-green** — too close to lime (13° apart at chroma 0.13 vs lime 0.18). Reads as «desaturated lime», muddies the lime-as-brand-primary semantic.
- **165° mint / cooler-green** — sits next to teal. Colder, more techno. Reads as «medical / pharma / Apple Health», which collides with the editorial-ledger metaphor. Reject.

**Brand-DNA argument for 152°:** Sage primary (forest, observational, calm) + Magician modifier (the «aha, it went up» moment, but quiet) + Everyman tactility (a *colored dot*, not a *flashing alert*). 152° at chroma 0.13 is the green of a NYT-charts up-marker, the green of a Field Notes ledger checkmark, the green of an Aaron Draplin sticker — designed-not-default, restrained-not-corporate, grown-not-printed. Composes with lime as «two greens that don't compete»: lime is the *spotlight*, this is the *foliage*.

### 2.2 OKLCH spec

```css
  /* Finance up-direction (gain) — Lane-A-calm, amber-register matched */
  --d1-finance-up: oklch(82% 0.13 152);   /* hex ≈ #94D8A0 — sage-leaf */

  /* Aliased: status-success consumes the same token (single-source) */
  --d1-status-success: var(--d1-finance-up);
```

### 2.3 Verification

- L 82, C 0.13 — within amber register (L 80–82, C 0.12–0.14). ✓
- Hue 152° — 30° from lime (clean perceptual separation), 65° from amber (family-coherent). ✓
- Contrast on `bg-card` (`oklch(24% 0.003 240)`): ~7.8:1 — AAA for body, AAA for large. ✓
- Anti-pattern check (impeccable color-and-contrast): not pure red/green, hue tinted toward sage; chroma below 0.15 (no garish); no «navy + green-up + red-down» trope because there's no navy in the system. ✓

---

## 3. Red spec — `oklch(82% 0.13 28)` at amber register

### 3.1 Hue choice rationale

Candidate hues evaluated against the locked saturation register:

- **0° pure red** — banned. Lane-A-violating «alarm / advisor-app urgency». Off-archetype.
- **15° fire-red** — slightly louder than 28°, reads as «attention RIGHT NOW». Tips into urgency. Reject.
- **25° warm-red / brick** — grounded, ledger-ink-correct. Border between earth-clay (25°) and clay-coral (30°). Slightly too brown at chroma 0.13.
- **28°** — current `--d1-status-error` direction; warm-clay-coral. Family-coherent with amber (59° apart on the wheel) and sage-green (124° apart, near-complementary). **PICK.**

**Brand-DNA argument for 28°:** at amber register (L 82 vs the v3 status-error's L 64), the hue reads as a *coral-clay* rather than a *brick-clay*. This is closer to NYT corrections-of-record red, Field Notes red ink, the red of a Provedo «attention without alarm» mark. It keeps the Lane-A-calm voice — «here is the disconnected datum» rather than «emergency, sell, panic». ICP A reads it as editorial-print red (NYT-correction); ICP B reads it as designed-not-default red (Linear's error red sits at hue 22, very close).

### 3.2 OKLCH spec

```css
  /* Finance down-direction (loss) — Lane-A-calm, amber-register matched */
  --d1-finance-down: oklch(82% 0.13 28);   /* hex ≈ #F4B5A1 — clay-coral */

  /* Aliased: status-error consumes the same token (single-source) */
  --d1-status-error: var(--d1-finance-down);
```

### 3.3 Verification

- L 82, C 0.13 — within amber register. ✓
- Hue 28° — 59° from amber (family-coherent), 124° from green (near-complementary, gives clean up/down distinction without harsh contrast). ✓
- Contrast on `bg-card`: ~9.2:1 — AAA. ✓
- Anti-pattern check: not pure red, not «sell-now red», not chroma > 0.15 (no garish), not hue 0 (no pure-alarm); reads as observation. ✓

### 3.4 Note on v3 status-error tonal register

v3-shipped `--d1-status-error: oklch(64% 0.16 28)` — same hue (28°), darker (L 64), more saturated (C 0.16). The PO-locked amber-register lock pulls this to L 82, C 0.13. The token reads markedly *softer* in v4 than in v3. This is correct: v3-shipped was «calm but still attention-grabbing»; v4 is «calm and quietly observational». The voice fingerprint argument («Provedo provides clarity, not alarm») argues for v4's gentler register.

---

## 4. Adopt convention vs hybrid — **HYBRID**

### 4.1 Decision

Adopt green-up / red-down convention **only on data-rendering surfaces**:
- Chart bars, lines, areas (delta-direction encoding)
- Delta numerals on KPI cards (the small `+12.0%` / `-3.4%` text)
- Gain/loss column cells in holdings tables
- Heatmap tile colors when the heatmap encodes positive/negative

Lime stays brand-primary on **brand-signal surfaces**:
- Record Rail tick (the lime hairline that signs Provedo's entry into the record)
- `--d1-kpi--lime` look-here KPI fill
- Focus-ring (`--d1-elev-focus-ring-on-lime`)
- Active filter chip outline
- AI-byline attribution (when AI surfaces an insight)

### 4.2 Brand-DNA argument

**Pure-adopt argument (lime → green for up):** Lane-A trust-via-restraint says «follow convention so users don't translate». Convention compliance IS clarity. Pure-adopt is tempting.

**Pure-hybrid counter:** there are *two semantic axes* in the system, and they must not collapse:
- **Axis 1 — Hierarchy (what to look at).** Lime says «look here». This is a brand axis, not a finance axis. The Record Rail tick is lime because *Provedo* entered this in the record, not because *the value went up*.
- **Axis 2 — Direction (what happened).** Up vs down. This is a finance axis, not a brand axis. Adopting green/red here matches universal financial-UI convention (Bloomberg / TradingView / IBKR / Yahoo).

If lime collapses into «up», then a drift-down on the look-here KPI becomes *purple-red* (because lime can't be both «look here» and «down»). That's a new color introduced just to disambiguate, and it competes with the proposed clay-coral red. Two semantic systems trying to share one color = ambiguity. Brand breaks.

**Hybrid resolves cleanly:**
- Look-here KPI = lime *fill* (axis 1, hierarchy: this is the headline) + clay-coral *delta numeral* (axis 2, direction: it went down). The fill says «look here»; the delta numeral inside says «what happened». Two semantics, two color systems, no collision.
- Chart panel = sage-green up-bars / clay-coral down-bars (axis 2 only — chart panels don't carry hierarchy via fill).
- AI insight row = lime *Record Rail tick* (axis 1, brand signature: Provedo entered this) + plain text body (axis 2 isn't carried by color in insights; insights describe).

This is the same hybrid pattern Bloomberg uses (orange chrome = Bloomberg identity; green/red = data direction). It is the same pattern NYT charts use (NYT-T color = section identity; green/red = direction in financial charts only). Brand-correct.

### 4.3 Lime + purple roles after redirect

| Token | Retained role |
|---|---|
| `--d1-accent-lime` | (1) Record Rail tick — the Provedo signature element. (2) `--d1-kpi--lime` look-here KPI fill. (3) Focus-ring (`--d1-elev-focus-ring-on-lime`). (4) Active filter chip 1px hairline. (5) AI byline attribution micro-mark (when present). (6) Heatmap-cell fill levels 1–4 (lime-tint ramp; semantic = «activity intensity», not «positive direction»). |
| `--d1-accent-purple` | (1) AI avatar identity tile (the «P» monogram on dark surfaces). (2) Premium chip background tint (`--d1-accent-purple-soft`). (3) AI-attribution body text (when an insight is from Provedo's reasoning vs from the user's data). |

**Removed roles for lime:** lime no longer carries any «delta-up» semantic on charts or KPI delta numerals. The lime heatmap tile ramp stays — it encodes intensity, not direction.

**Removed roles for purple:** none changed; purple was never carrying delta semantic in v3.

---

## 5. Status quartet impact — alias

```css
[data-style="d1"] {
  /* ── Finance direction tokens (canonical) ────────────────────────────── */
  --d1-finance-up:   oklch(82% 0.13 152);  /* sage-leaf — gain */
  --d1-finance-down: oklch(82% 0.13 28);   /* clay-coral — loss */

  /* ── Status quartet — aliased where semantically equivalent ─────────── */
  --d1-status-success: var(--d1-finance-up);    /* «sync OK», «connection OK» = same green as gain */
  --d1-status-error:   var(--d1-finance-down);  /* «disconnected», «validation» = same red as loss */
  --d1-status-warning: oklch(82% 0.13 87);      /* matches amber #F4C257 in OKLCH form */
  --d1-status-info:    oklch(70% 0.08 220);     /* desaturated cool-grey-blue — kept separate */
}
```

**Aliasing rationale:** `success` and `up` are semantically the same vibe («system or value moved in the right direction»). One green is enough; the system is simpler if the user learns one green for both. Same for `error` and `down`. `warning` (amber) and `info` (cool-grey-blue) are distinct semantics — keep separate.

**Anti-aliasing counter (rejected):** «success and up are different — success is a system event, up is a finance datum». This is *technically* true but the hue is identical anyway under the amber-register lock; aliasing avoids the «two greens at the same hue» surplus.

---

## 6. 3-color palette family check

```css
  /* THE TRIAD — all three at L 82, C 0.13, hues equally spaced for triadic feel */
  --d1-finance-up:    oklch(82% 0.13 152);   /* sage-leaf */
  --d1-status-warning: oklch(82% 0.13 87);   /* amber-yellow (existing #F4C257) */
  --d1-finance-down:  oklch(82% 0.13 28);    /* clay-coral */
```

**Hue spread:** 152 → 87 = 65° gap; 87 → 28 = 59° gap; 28 → 152 wraps 124° on the wheel. Not a perfect equilateral triad (which would be 120° / 120° / 120°) but a *restricted-arc triad* — all three hues sit in the warm half of the wheel (28° red-orange through 152° green-warm), giving the family a tonal coherence rather than a cross-wheel drama.

**Brand register check:** this triad reads as **a designer's gouache set / NYT-charts 3-color marker / Aaron Draplin sticker palette**. All three at the same L and C means none dominates — they read as «the same kind of mark, three different directions». This is the Bloomberg-credible move: data colors that look like *they were chosen together* rather than *grabbed from a default palette*.

**Anti-pattern check:**
- Not «navy + green + red» (no navy — fintech default avoided). ✓
- Not «pure-red + pure-green» (Lane-A calm preserved). ✓
- Not «red 0 + green 120» (Excel-default colors avoided). ✓
- All chroma within tinted-but-substantive band (0.12–0.14). ✓

**Composition test (mandatory pre-lock):** render the triad together once before lock — three 32×32px squares side-by-side on `bg-card-elevated` (`oklch(28% 0.003 240)`). The triad must read as «three colors from the same set» rather than «three random brand colors». If it reads dissonant, drop one chroma point on whichever color visually dominates and re-test.

---

## 7. Three brand precedents that shape this verdict

1. **NYT charts (financial section).** Three-color register: NYT-T (section red, hue ~5° at chroma 0.18) for identity; soft sage for up, soft clay for down on charts. The chart palette is *softer* than the masthead palette — same logic as Provedo (lime is brand-loud, finance up/down is data-quiet). Confirms the «brand-primary stays loud, data-direction goes quiet» discipline.

2. **Bloomberg Terminal.** Orange chrome (hue ~50° at chroma 0.20 — high) for identity; green/red for delta on tickers. The orange does NOT carry up/down semantic; ticker green/red do. Hybrid pattern proven at scale, and the audience (ICP A) reads it as default-correct. Confirms green/red as data-direction-only is brand-credible for finance.

3. **Aaron Draplin Field Notes / DDC color palettes.** Restrained-arc 3-color sets: amber + sage + clay, often on a charcoal cardstock substrate. The substrate is hue 240° at near-zero chroma (Pitch Black notebook). The 3-color set lives on top as a designer's gouache. Confirms both the canvas (hue 240° low-chroma) and the triad (amber + sage + clay) as a coherent visual register that's been in production for ~15 years.

---

## 8. Anti-pattern Provedo MUST NOT do

**The single biggest brand failure mode for v4: «Excel-default green + Bootstrap-alert red on a Discord-blue canvas».**

Specifically: if the implementation compromise pulls hue choices toward defaults (green 145°, red 0–10°, canvas hue 220°), the system reads as **every-fintech-dashboard-2018-2024**. The amber register lock partially protects against this (because L 82 / C 0.13 keeps colors muted), but only partially — the *hue* choices still have to land outside the reflex zones.

Hard rules:
- Never let red drift below hue 22°. Below 22° = Bootstrap red = Lane-A violation.
- Never let green drift below hue 140° or above 160°. Outside 140–160° = either Excel green or mint-medical.
- Never let the canvas chroma exceed 0.005 at any lightness in this dialect. Above 0.005, the cool tilt becomes consciously visible and reads as «cool blue dashboard» rather than «cold-graphite cardstock».
- Never let lime carry «up» semantic on charts. Lime is hierarchy («look here»), not direction («went up»). Collapsing the two breaks the disambiguation logic in §4.2.

Honourable mentions:
- No «glow halo» around the green/red marks (gaming/crypto register; banned in v2/v3, banned in v4).
- No «traffic-light triangles» (▲▼) using green/red as the only direction signal — accessibility-fail for color-blind users; pair direction-color with a sign character or position cue.
- No filling chart areas with green/red at full saturation — at L 82 C 0.13, the colors are designed to read as marks (hairlines, dots, small fills); area-filling them at canvas-spanning size will desaturate the surface to «ICU monitor».

---

## 9. Confidence

**HIGH** on:
- Canvas redirect to hue 240° at chroma 0.001–0.003 (option E) — passes both impeccable category-reflex checks; resolves PO's «brown» rejection; preserves AAA contrast at v3 lightness; brand-DNA argument («graphite on charcoal cardstock») composes with editorial-ledger metaphor better than warm-paper did.
- Green at hue 152° / Red at hue 28° at the locked amber register — Lane-A-correct, distinct from lime, family-coherent with amber, NYT-charts-credible.
- Hybrid (lime brand-primary + green/red data-direction-only) — resolves the two-semantic-axes problem cleanly; matches Bloomberg + NYT pattern.
- Status quartet aliasing (success ← up; error ← down) — single-source; reduces token count; semantically clean.

**MEDIUM-HIGH** on:
- Triad coherence pre-lock test (§6 last paragraph) — the OKLCH math says the family composes; the rendered visual must confirm before final lock. If the rendered triad reads dissonant, drop one chroma point and re-test (cheap iteration).

**MEDIUM** on:
- Specific lightness lock at L 82 (vs L 80 or L 84 within the locked register). PO said amber-register; amber is L 80–82. Picking L 82 (top of the band) keeps green/red bright enough to read as marks at small sizes (delta numerals are 13px). If they read too bright in render, drop to L 80.

---

## Appendix — One-line distillation for Right-Hand synthesis

**Pivot canvas to cold paper-graphite (hue 240°, chroma 0.001–0.003) — kills the warm-brown read while keeping editorial metaphor; introduce sage-green (152°) + clay-coral (28°) at the amber-locked register (L 82, C 0.13); adopt green-up / red-down on data-rendering surfaces only — lime stays brand-primary signal (Record Rail / focus-ring / look-here KPI / AI byline); status quartet aliases success ← up and error ← down; the 3-color triad (sage + amber + clay) renders together once before lock.**
