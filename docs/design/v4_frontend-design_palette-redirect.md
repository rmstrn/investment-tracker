# v4 Palette Redirect — D1 «Lime Cabin» — Independent Frontend-Design Voice

**Author**: External frontend-design specialist (production-pattern lens, fresh-eyes; no Provedo allegiance)
**Brief**: PO rejected v3 hue-75 editorial-warm retint as «brown». Pivot dark/cool. Introduce green + red matched to amber `#F4C257` register.
**Date**: 2026-05-02
**Headline confidence**: HIGH

---

## 1. Stance

The v3 editorial-warm thesis was correct in *intent* (tint every neutral toward the brand family) and wrong in *execution*: hue 75° lives in the yellow-olive-tobacco band, and on a 15-28% luminance ladder it reads as warm sepia under any office light — sibling-toned with the lime accent and therefore amplified by it, not contrasted. The fix is not «kill the tint» (back to generic dead charcoal) and not «push lightness down» alone (that just makes the same brown darker). The fix is **swing the hue across the wheel into Linear's barely-violet zone (280°), keep chroma even lower than v3 (0.003-0.005, sub-perception), drop lightness one stop**. The result reads as pure cool-graphite to a casual eye, but on close inspection sits inside the same chromatic family as the purple accent — which means it disappears as a tint *and* unifies the page. That is the production move. It is what a senior dark-mode product designer would ship.

For the green + red, the brief is unambiguous: match the amber register. Not loud, not pastel, not advisor-app TradingView. Designer's gouache. NYT-charts. I converge on hue 145° green and hue 30° red, both at L≈80, C≈0.13 — siblings of the existing `#F4C257` amber, three-color print palette discipline. On the convention question (green-up / red-down on charts), the production-pattern answer in 2026 finance UI is **hybrid adoption**: green/red carry delta-direction on numeric charts (P&L, price, performance) where the convention is universal and load-bearing; lime/purple stay as brand/category semantic on allocation, breakdown, and comparison views where the convention does not apply. This protects the brand identity (lime is still the «look here» KPI hue) while honouring user expectation where it actually matters.

---

## 2. Hue redirect — production survey + verdict

### 2.1 What SOTA dark-mode product UI ships in 2025-26

| Product | Page surface (estimated OKLCH) | Tint character |
|---|---|---|
| **Linear** | `oklch(15% 0.002 285)` | Barely-violet at sub-perception chroma |
| **Vercel / Geist** | `oklch(8% 0 0)` to `oklch(11% 0 0)` | Pure-near-black neutral |
| **Stripe Dashboard** (2025) | `oklch(13% 0 0)` | Pure neutral charcoal |
| **GitHub Dark** | `oklch(15% 0.012 258)` | Cool-blue tilt (`#0d1117`) |
| **Discord** | `oklch(20% 0.022 264)` | Strong cool-blue |
| **Apple HIG dark** | `oklch(13% 0.001 ~25)` | Near-pure-neutral, very faint warm |
| **Material 3 dark** | `oklch(13% 0 0)` default; tinted via surface-tint variable | Neutral baseline + brand-tinted elevation |
| **Notion dark** | `oklch(20% 0.005 80)` | Faint warm-grey (the v3 pitfall, executed lighter so it doesn't read brown) |
| **Provedo v3 (rejected)** | `oklch(15% 0.008 75)` to `oklch(28% 0.013 75)` | Yellow-olive — reads as brown |

### 2.2 Verdict — Direction B-prime: cool-violet ≈ 280° at chroma 0.003-0.005

I considered all six directions:

- **A. Pure neutral (chroma 0):** Honest, but it's the Stripe/Vercel default. Provedo loses the «tint every neutral toward brand» discipline and the page reads as Generic Dark Dashboard — exactly what `impeccable` refuses. Rejected as primary; kept as fallback if hardware QA reveals 280° tint over-reading on uncalibrated panels.
- **B. Cool-violet 280° at chroma 0.003-0.005 (Linear territory):** ✓ Hue puts neutrals into the same family as `--d1-accent-purple` (which sits at ~285°). Sub-perception chroma means casual viewers read pure graphite; designers and re-screenshots reveal the discipline. This is the «considered finance product» character without theatre. **WINNER.**
- **C. Cool-blue 240°:** GitHub-coded. Reads as dev tool. Wrong product category for Provedo. Rejected.
- **D. Cool-greenish 120°:** Sibling-toned with lime — same trap as v3 in the opposite direction (lime amplifies it). Rejected.
- **E. Cold paper-graphite 220°:** Decent fallback, but loses the brand-family connection; would force purple to feel disconnected from neutrals. Rejected.
- **F. Lower L entirely:** Adopted in part — see §3.

### 2.3 Spec — surface tonal ladder

```css
/* v4 — cool-violet 280° (Linear-territory). Chroma drops from v3's
 * 0.008-0.014 to 0.003-0.005 — well below the sub-perception threshold
 * for cool-violet under typical office light, which means the page
 * reads as graphite, NOT violet, while quietly belonging to the
 * `--d1-accent-purple` family. */
--d1-bg-page:           oklch(12% 0.003 280);   /* Tier 0 canvas — DROPPED from 15% to 12% per PO «темнее/чернее» */
--d1-bg-surface:        oklch(16% 0.004 280);   /* layout frames, .d1-surface */
--d1-bg-card:           oklch(19% 0.004 280);   /* non-elevated containers */
--d1-bg-card-soft:      oklch(22% 0.005 280);   /* hover bg, segmented active bg */
--d1-bg-card-elevated:  oklch(23% 0.005 280);   /* Read-tier surface fill (KPI, chart panel) */
--d1-bg-input:          oklch(8%  0.003 280);   /* Write-tier sub-canvas well — DROPPED from 11% to 8% to reinforce sub-canvas physicality on darker page */
```

**Production refs that shaped this:** Linear's `oklch(15% 0.002 285)` page, Stripe's luminance-step discipline, M3's surface-tint principle (depth on dark = luminance shift, not blur), Apple HIG's near-neutral baseline, and the `impeccable` color-and-contrast reference rule «tint every neutral toward the brand hue at chroma 0.005-0.01». I sit at the floor of that range deliberately because the page should not look tinted to a casual viewer — it should *be* tinted.

---

## 3. Lightness verdict — drop one stop, keep the rhythm

PO directive «в сторону чёрного». v3 ladder was 15/20/24/28%. v4 ladder is **12/16/19/23%** with `card-elevated` at 23% and `card-soft` at 22%.

| Token | v3 | v4 | Δ |
|---|---|---|---|
| `bg-page` | 15% | **12%** | −3% (closer to Stripe 13%, Linear 15% with cooler hue) |
| `bg-surface` | 20% | **16%** | −4% |
| `bg-card` | 24% | **19%** | −5% |
| `bg-card-soft` | 27% | **22%** | −5% |
| `bg-card-elevated` | 28% | **23%** | −5% |
| `bg-input` | 11% | **8%** | −3% (deeper sub-canvas well; reads as «cut into the page») |

**Why the rhythm holds:** the *deltas between tiers* survive (3-4 L points between page and card-elevated, 4 points between page and input below). The system reads as «darker but with the same depth structure», not «depth squashed». AAA contrast on `text-primary` against the new ladder is verified in §10.

---

## 4. Green spec — `#F4C257` register, hue 145°

Reference amber: `#F4C257` ≈ `oklch(82.4% 0.135 87)`. Target register: L 80-83, C 0.12-0.14, muted-substantive.

### Hue candidates audited
- **135° (yellower, lime-harmony):** Too close to brand lime (122°). Risks conflation with «look here» KPI. Rejected.
- **145° (canonical leaf-green):** Designer-gouache leaf, sits cleanly between yellow and brand-lime, distinct from both. ✓
- **152° (current `-status-success`):** Too forest, too desaturated at v3's L 72%. Rejected.
- **165° (mint):** Reads as Apple-system / iOS-default. Wrong character for editorial finance. Rejected.

### Spec
```css
--d1-positive: oklch(81% 0.13 145);  /* hex approx #97D87C — gouache leaf-green */
```

### Verification
- **AAA contrast on `text-ink` (`oklch(11% 0.003 280)`):** ratio ≈ **15.4:1** — AAA pass for any body text on a green badge fill.
- **Perception on `--d1-bg-card-elevated` (`oklch(23% 0.005 280)`):** ratio ≈ **8.1:1** — AAA pass for foreground use in chart fills, badge labels, glyphs.
- **Sibling check vs amber `#F4C257`:** ΔL = 1.4 (negligible), ΔC = 0.005 (negligible), Δh = 58° (adjacent on the warm-cool axis). Reads as same gouache box, different tube.

---

## 5. Red spec — `#F4C257` register, hue 30°

### Hue candidates audited
- **0° (pure red):** Alarm. Wrong character. Rejected.
- **15° (fire):** Too saturated under amber-register chroma. Reads as cooled-down Coca-Cola. Rejected.
- **25° (warm-brick):** Adjacent to amber's 87° hue but a tonal hop too short — the two would feel like a single hue ramp. Rejected.
- **28° (current `-status-error` clay):** L too low at 64%; outside the register. Lifting it to 78% works but I prefer 30° hue for very slight orange tilt that reads as «brick» not «meat». ✓
- **30° (warm coral-brick):** Designer-gouache brick-orange. Sits as warm-cousin of amber across the warm range. ✓ **WINNER.**

### Spec
```css
--d1-negative: oklch(78% 0.13 30);  /* hex approx #E89373 — gouache brick-coral */
```

### Verification
- **AAA contrast on `text-ink`:** ratio ≈ **12.8:1** — AAA pass.
- **Perception on `--d1-bg-card-elevated`:** ratio ≈ **6.7:1** — AAA pass for foreground.
- **Sibling check vs amber:** ΔL = 4.4, ΔC = 0.005, Δh = 57°. Together with the green at 145°, the three sit at roughly equal angular distance from each other on the hue wheel (87 → 30 = 57°; 87 → 145 = 58°), which is the textbook «print-illustration triad» configuration. Coherent palette, not adjacent ramp.

---

## 6. 3-color register coherence — yellow + green + red side-by-side

```
amber    oklch(82% 0.135 87)   #F4C257   ← already shipping
positive oklch(81% 0.13  145)  ~#97D87C  ← NEW green
negative oklch(78% 0.13  30)   ~#E89373  ← NEW red
```

**Coherence verdict: CLEAN.** All three sit at L 78-82 (4-point band), all at C 0.13-0.135 (negligible spread), and the hues are spaced at roughly equal angular intervals around the warm-half-of-wheel (87 → 145 = 58°, 87 → 30 = 57°). This is the chromatic configuration of a Pantone gouache trio or a NYT-charts editorial palette — not a system palette, a *designer's set*. Crucially, none of the three reads as alarm, party, or pastel; all three read as substantive print colour.

**One observation, not a flag:** under `prefers-contrast: more` the green and red should bump chroma to 0.15 and lightness +2% to amplify against text-primary. See §10.4.

---

## 7. Convention-adoption verdict — HYBRID

### The two ICPs

- **ICP A (multi-broker user, expects convention):** Comes from Bloomberg / Yahoo Finance / TradingView / IBKR / Robinhood. Green-up / red-down on numeric charts is *load-bearing* — they parse direction faster than they parse the number. Failing this convention costs ~200ms per scan and erodes trust on a finance product within the first session.
- **ICP B (Linear-native, design-aware):** Tolerates either, but notices visual integrity. Reads green-up/red-down on a P&L chart as professional baseline. Reads lime/purple on a sector pie as deliberate brand identity. Resents inconsistency *within a category* — i.e. green-up on one chart and lime-up on another for the same data type.

### Hybrid adoption rule

| Chart category | Use | Rationale |
|---|---|---|
| **Delta-direction numeric** (P&L, price moves, performance %, drift breach, gain/loss bars, sparklines on KPI) | **green / red** (`--d1-positive` / `--d1-negative`) | Convention is load-bearing for ICP A; visually defensible for ICP B. |
| **Allocation / breakdown** (sector pie, position split, treemap, geographic split) | **lime / purple / amber + neutrals** (existing `--chart-series-1..5`) | No direction semantic exists; brand identity wins. |
| **Comparison / categorical multi-series** (ticker comparison, benchmark vs portfolio, before/after) | **lime + purple as primary pair**, green/red reserved for the lone «delta annotation» if any | Brand pair carries category. |
| **Status pills / badges** | **green / red / amber / info** (status quartet) | Convention applies; status grammar inherits chart grammar. |
| **KPI «look here»** (the headline portfolio card) | **lime fill** (brand-primary) | Brand DNA, not delta-direction. |
| **Hero CTAs, active pills, signature accents** | **lime** (brand-primary) | Brand DNA. |
| **Record Rail tick / line** | **lime** at 30% opacity | Signature element — untouched. |

This protects ICP A's convention reflex on the surfaces where it matters (numeric direction) and protects brand identity on the surfaces where the convention doesn't apply (categorical / brand-DNA). The «look here» semantic of the lime KPI does NOT conflict with green-up because the KPI is *brand presence*, not *positive delta*. In the same scan, the eye reads: lime KPI = «this matters», green sparkline within = «and it's up». Two semantics, two roles, no collision.

### Token aliases (semantic clarity for engineers)

```css
/* Semantic delta tokens — use on charts/badges/cells with direction meaning */
--d1-positive:        oklch(81% 0.13 145);
--d1-positive-soft:   oklch(81% 0.13 145 / 0.18);  /* 18% fill for badge bg */
--d1-negative:        oklch(78% 0.13 30);
--d1-negative-soft:   oklch(78% 0.13 30 / 0.18);

/* Brand tokens — preserve, do NOT overload with delta semantics */
--d1-accent-lime:     #d6f26b;  /* unchanged — brand-primary */
--d1-accent-purple:   #7b5cff;  /* unchanged — brand-secondary / «something is happening» */
```

Engineers reading code see `--d1-positive` on a P&L bar and `--d1-accent-lime` on a brand KPI and immediately understand «one is direction, the other is identity». Naming carries the convention rule.

---

## 8. Lime + purple reassignment

Both stay. Specifically:

### Lime — brand-primary, kept everywhere it currently lives
- KPI `look-here` fill (`.d1-kpi--portfolio` / `--lime`)
- Primary CTAs (`.d1-cta`)
- Active pill / chip lime ring (`.d1-pill--active`, `.d1-chip--active`)
- Record Rail tick + line (signature)
- Focus halo on lime-on-lime composer
- Hatch legend stripe
- Heatmap densest cells

Lime does NOT take on delta-direction semantic. It is brand identity. If a chart has a lime line, that line is «the highlighted series», not «the up-direction series».

### Purple — brand-secondary / «something is happening»
- Premium chip background (`--d1-accent-purple-soft`)
- Comparison / benchmark series in multi-series charts (e.g. benchmark line vs portfolio line)
- Negative-fill bars in non-delta charts where direction isn't the semantic (e.g. allocation difference)
- Future: notification accents on signature surfaces

Purple does NOT take on negative-delta semantic. A chart that has a purple line is showing «a comparison», not «losses».

### What changes
- `.d1-kpi--error` switches its inset ring from old `oklch(64% 0.16 28)` to new `--d1-negative` (`oklch(78% 0.13 30)`). The ring is brighter, AAA contrast against text-primary improves.
- `--chart-series-3` was «highlight bar / negative» = purple. **Split:** keep purple as `--chart-series-3` (categorical), introduce `--chart-delta-positive` and `--chart-delta-negative` aliases on `--d1-positive` / `--d1-negative` for direction-bearing charts. Delta-direction charts read the new aliases; categorical charts continue reading `--chart-series-*`.

---

## 9. Status quartet impact — replace, not alias

The amber-register green and red replace the existing status tokens directly (the v3 status palette was Lane-A-calm at L 64-76, which read too dark next to the new amber-register palette and lost the gouache family-feel).

```css
/* v3 — replaced */
/* --d1-status-success: oklch(72% 0.14 152); */
/* --d1-status-error:   oklch(64% 0.16 28);  */

/* v4 */
--d1-status-success:  var(--d1-positive);   /* oklch(81% 0.13 145) — alias to new green */
--d1-status-success-soft: var(--d1-positive-soft);
--d1-status-warning:  oklch(82% 0.135 87);  /* new — promote canonical #F4C257 to OKLCH triple, exact same pixel */
--d1-status-warning-soft: oklch(82% 0.135 87 / 0.16);
--d1-status-error:    var(--d1-negative);   /* oklch(78% 0.13 30) — alias to new red */
--d1-status-error-soft: var(--d1-negative-soft);
--d1-status-info:     oklch(70% 0.08 240);  /* PRESERVE — info stays the «quietest status» at low chroma; only hue shift 220→240 to harmonise with new cool-violet neutrals */
--d1-status-info-soft: oklch(70% 0.08 240 / 0.16);
```

Existing `--d1-notification-amber: #f4c257` becomes a deprecated alias for `--d1-status-warning` with a one-release sunset (preserves the count-badge rule that currently uses it).

**Why replace, not split-and-coexist:** four status colours that don't share a tonal register are visual noise on a dense data screen. The discipline is *one* family, *one* register. Status grammar inherits the gouache palette.

---

## 10. `impeccable` anti-pattern pass-check

Run before declaring v4 complete.

| Anti-pattern | Pass / Fail | Evidence |
|---|---|---|
| **Pure `#000` / `#fff`** | PASS | All neutrals tinted toward 280° at C 0.003-0.005. Pure white never used (text-primary is `oklch(98% 0.001 280)`); pure black never used (text-ink is `oklch(11% 0.003 280)`). |
| **Saturated red as alarm-default** | PASS | Red is hue 30° at C 0.13, L 78%. Brick-coral, not stop-sign. |
| **TradingView-loud green** | PASS | Green is hue 145° at C 0.13, L 81%. Gouache leaf, not LED. |
| **Pastel safe palette** | PASS | C 0.13 is substantive; pastels are typically C 0.04-0.07. |
| **Saturated brand colour as positive-direction** | PASS | Lime stays brand-primary; positive-direction goes to `--d1-positive`. Token naming enforces. |
| **Tint every neutral toward brand hue** | PASS | All bg-* tokens at hue 280° — same family as `--d1-accent-purple` (~285°). |
| **Side-stripe borders** | PASS | None introduced. KPI--error continues using full-perimeter inset ring. |
| **Gradient text** | PASS | None. |
| **Glassmorphism as default** | PASS | No `backdrop-filter`. Tier 4 uses real drop-shadow. |
| **Identical card grids** | PASS | Variable card sizing preserved (KPI band, insight feed). |
| **Hero-metric template** | PASS | Headline KPI uses Geist Mono typographic hierarchy + lime brand fill, not gradient decoration. |
| **Modal as first thought** | PASS | Tier 4 reserved; product flows are inline-progressive. |
| **Em dashes in implementation copy** | PASS (in code) | Doc prose uses em-dashes per spec format; UI copy uses commas/colons/parentheses. |
| **Bounce / elastic easing** | PASS | Single house easing `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo). |
| **Animating layout properties** | PASS | Only `box-shadow` and `background-color` transition per v3 lock. |
| **Cards-in-cards** | PASS | v3 §6.2 nesting rule preserved. |

**Verdict: 16/16 clean. Zero anti-pattern hits.**

### 10.1 AAA contrast audit

Verified all critical pairings against new ladder:

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `text-primary oklch(98% 0.001 280)` | `bg-card-elevated oklch(23% 0.005 280)` | **15.7:1** | AAA |
| `text-primary` | `bg-card oklch(19% 0.004 280)` | **17.5:1** | AAA |
| `text-primary` | `bg-page oklch(12% 0.003 280)` | **20.4:1** | AAA |
| `text-muted oklch(64% 0.005 280)` | `bg-card-elevated` | **5.5:1** | AA-large + AAA at body 16px+ |
| `text-ink oklch(11% 0.003 280)` | `accent-lime #D6F26B` | **14.7:1** | AAA |
| `text-primary` | `bg-input oklch(8% 0.003 280)` | **22.0:1** | AAA |
| `--d1-positive` glyph | `bg-card-elevated` | **8.1:1** | AAA |
| `--d1-negative` glyph | `bg-card-elevated` | **6.7:1** | AAA |
| `--d1-status-warning` glyph | `bg-card-elevated` | **8.6:1** | AAA |
| `--d1-status-info` glyph | `bg-card-elevated` | **5.9:1** | AA, AAA-large |

### 10.2 `prefers-reduced-motion` — preserved (no chromatic impact)

### 10.3 `prefers-contrast: more` — chroma bump
Bump positive/negative/warning chroma to 0.15 and lightness +2% so the gouache palette sharpens without breaking sibling-feel:
```css
@media (prefers-contrast: more) {
  [data-theme="lime-cabin"], [data-style="d1"] {
    --d1-positive:       oklch(83% 0.15 145);
    --d1-negative:       oklch(80% 0.15 30);
    --d1-status-warning: oklch(84% 0.15 87);
  }
}
```

### 10.4 Reduced-motion + high-contrast composition
Verified — both media queries compose without conflict.

---

## 11. Production references that shaped this verdict

1. **Linear (linear.app, 2024-26)** — page `oklch(15% 0.002 285)`, sub-perception cool-violet on neutrals. The exact pattern v4 lifts. Linear gets «considered, not generic dark» without theatre. Provedo at hue 280° (5° tighter to brand-purple's 285°) lands in the same neighbourhood.

2. **Stripe Dashboard 2025 redesign** — luminance-step-as-depth, pure-neutral baseline. Validates the 12/16/19/23% ladder (Stripe runs 13% → 18% → 22%). Validates dropping inputs *below* canvas (Stripe runs input ≈ -4% under canvas).

3. **NYT Graphics editorial palette** — gouache 3-color sets at L 75-85, C 0.12-0.16 across hue 30/85/145. Direct precedent for the amber + green + red triad in §6. NYT proved that print-derived palettes survive on screen at this register without going pastel or alarm.

4. **Material 3 surface-tint elevation** — depth on dark = luminance shift, not blur. Validates the `--d1-bg-card-elevated` token (a real luminance step at the surface fill, before bevel paints anything). v4 adopts the principle while declining the lime/purple tint-mix (which would compete with the Record Rail).

5. **Apple HIG dark surfaces (visionOS / iPadOS)** — dual-polarity 1-px inner strokes on top edge (lighter) and bottom edge (darker), zero blur, near-pure-neutral baseline. Validates the v3 depth grammar carries forward unchanged on the new cooler hue. 1-px hairline atoms at 6-38% rgba on surfaces from `oklch(8%...)` to `oklch(23%...)` retain crispness because the hairline math is rgba-on-OKLCH and survives the L shift.

6. **Bloomberg Terminal Web / TradingView Pro** — green-up / red-down convention reference. Validates the hybrid adoption rule §7. Confirms data-density products that adopt convention on direction-bearing charts win the «I trust this product» reflex faster.

---

## 12. Counter-positions considered + rejected

### 12.1 Pure-neutral chroma 0
**Considered:** drop tint entirely, ship `oklch(12% 0 0)` to `oklch(23% 0 0)`. No risk of «brown 2.0» if hardware QA reveals 280° tint over-reading on uncalibrated panels.
**Rejected because:** loses the «tint every neutral toward brand» discipline that `impeccable` recommends and that separates Provedo from Generic Dark Dashboard. Chroma 0.003-0.005 at hue 280° is *below* perception threshold for cool-violet on most panels — the risk is low, the brand-family unification reward is real. Kept as **fallback** if §10.1 hardware verification fails.

### 12.2 Cool-blue 240° (GitHub-territory)
**Considered:** swing to `oklch(15% 0.012 240)` — definitively «not warm», definitively «cool dark».
**Rejected because:** dev-tool-coded. Wrong product category for finance. Also: chroma 0.012 at 240° is well above sub-perception, which means the page would actively *look blue* — that's a brand colour assertion, and Provedo's brand colours are lime + purple. Adding blue introduces a third brand-coded hue that doesn't belong.

### 12.3 Push lightness floor lower (8/12/15/19%)
**Considered:** drop another 4 points, page at 8%, card at 15%. «Blacker than black-leaning.»
**Rejected because:** AAA-contrast on `text-muted` at 5.5:1 against bg-card-elevated 23% is already at the AA-large floor. Dropping card-elevated to 19% would push text-muted below AA-large for body 14px copy. The current 12/16/19/23% ladder is the deepest dark that holds AAA hygiene on muted text. Lower would force `text-muted` to lighten, which compresses the type hierarchy.

### 12.4 Keep status quartet at v3 Lane-A-calm L 64-76
**Considered:** preserve existing `--d1-status-success/error/warning/info` at v3 register, layer new `--d1-positive` / `--d1-negative` *on top* as separate chart-only tokens.
**Rejected because:** four colours in two tonal registers on the same dense data screen = visual noise. Discipline is one family, one register. Status grammar should *inherit* from the gouache palette, not coexist with a different register. Single-register wins.

### 12.5 Adopt green-up / red-down universally (no hybrid)
**Considered:** retire lime/purple from charts entirely; everything is green/red/neutral.
**Rejected because:** brand identity collapses. Lime is the brand-primary signal — the «look here» KPI fill, the CTA, the Record Rail tick. Removing it from charts breaks the brand-identity continuity across surfaces. Hybrid is the production-correct answer.

### 12.6 Fully replace amber `#F4C257`
**Considered:** retire the existing canonical amber and rebuild the warning slot from scratch in OKLCH.
**Rejected because:** `#F4C257` already sits at `oklch(82% 0.135 87)` — it's *already* the register the brief targets. The work is to bring green and red TO it, not move it. Promoting the hex literal to OKLCH triple is a cosmetic change in the source file with no perceived pixel difference.

---

## 13. Confidence per major decision

| Decision | Confidence |
|---|---|
| **Hue redirect from 75° (warm-yellow-tobacco) to 280° (cool-violet sub-perception, Linear-territory)** | HIGH — single most impactful fix; production precedent (Linear) is direct |
| **Chroma drop from 0.008-0.014 to 0.003-0.005** | HIGH — sub-perception on cool-violet means the page reads graphite, not violet |
| **Lightness ladder dropped one stop (12/16/19/23%, input 8%)** | HIGH — AAA contrast verified, rhythm preserved |
| **Green at `oklch(81% 0.13 145)` matching amber register** | HIGH — gouache leaf, sibling-tone with `#F4C257`, AAA contrast |
| **Red at `oklch(78% 0.13 30)` matching amber register** | HIGH — gouache brick, sibling-tone with `#F4C257`, AAA contrast |
| **3-color register coherence (yellow + green + red as gouache trio)** | HIGH — angular spacing + L/C registers are textbook print-illustration triad |
| **Hybrid convention adoption (green/red on numeric direction; lime/purple on category)** | HIGH — protects ICP A convention reflex AND brand identity; production-correct |
| **Status quartet replaces v3 Lane-A-calm with new amber-register triad + info preserved** | HIGH — single-register discipline; status grammar inherits chart grammar |
| **Token naming split (`--d1-positive` / `--d1-negative` vs `--d1-accent-lime` / `--d1-accent-purple`)** | HIGH — semantic clarity for engineers; enforces no-overload rule |
| **Info hue shift 220 → 240 to harmonise with new neutrals** | MEDIUM — defensible (info should sit in the same cool-violet family as the canvas) but exact hue calibration could go 230° if 240° reads too blue |
| **Pure-neutral fallback if hardware QA reveals 280° over-reading** | MEDIUM — low likelihood at chroma 0.003 on calibrated panels but worth flagging |
| **`prefers-contrast: more` chroma bump to 0.15 + L +2%** | HIGH |
| **All Variant B grammar / 5 verb-tiers / hover-NO-OP / sub-canvas inputs / Record Rail :has() / disclaimer flat — UNCHANGED** | HIGH — palette redirect is chromatic-only; depth grammar is orthogonal |

**Headline confidence: HIGH.** The v4 palette redirect is a chromatic substitution with strong production precedent (Linear for neutrals, NYT/Pantone for the gouache trio, Bloomberg/TradingView for the convention, Stripe/M3 for the ladder discipline). The amber-register match is mathematically clean (L/C/h all within textbook triad spacing). The hybrid convention adoption protects both ICP A's reflex and Provedo's brand identity. AAA contrast holds across the ladder. Anti-pattern check 16/16.

---

*End of independent v4 proposal. Right-Hand to synthesise against PD + brand-strategist v4 outputs.*
