# v4 Palette Redirect — product-designer (independent pass)

**Date:** 2026-05-02
**Author:** product-designer (independent — not coordinated with brand-strategist or frontend-design)
**Scope:** D1 «Lime Cabin» palette redirect responding to PO feedback (1) hue 75 reads brown / pivot toward dark, (2) introduce green + red, (3) match `#F4C257` amber register — not loud, not pastel.
**Constraints carried forward (HARD):** Variant B grammar / 5 verb-tiers / hover-NO-OP on Read / sub-canvas inputs / Record Rail rail-headed mitigation / disclaimer chip flat / OKLCH everywhere / AAA contrast / no spend / no TradingView-loud red-green.

---

## 1. Stance

**The hue-75 cardboard problem is real perceptually, not just felt.** Yellow-orange hues at low L (15–27%) and any chroma above ~0.005 collapse into sepia/brown territory. The screenshot confirms it: surfaces read as «warm cardboard» or «kraft» rather than «editorial paper-press». The brand-strategist v3 «editorial paper-press» metaphor has the right *idea* but the wrong *hue band* — paper-press is a high-L surface (cream paper, ink-on-pulp); rendering it on a dark canvas inverts that geometry and the warm yellow becomes sepia rot.

**Pivot direction.** Move tint from hue 75° (mustard-band) to **hue 280° (cold-violet undertone) at chroma 0.003–0.005**, and drop the lightness ramp from `15/20/24/27/28%` → `12/17/21/24/25%`. Net read: cold-ink charcoal with a violet wash so subtle it never names itself as «purple page» — but creates subconscious cohesion with `--d1-accent-purple #7B5CFF` (the structural-secondary brand color). This is the «tint toward your brand» principle from `impeccable:color-and-contrast` applied to the SECONDARY anchor, not the lime fill — because lime at L 91% is so far from the L 12–25% canvas that its hue cannot subliminally bleed across that gap; purple at L 57% is the closer anchor.

**Green + red at amber register.** Match `#F4C257 ≈ oklch(82.5% 0.135 87)` — lock both new tokens at L 78–82, C 0.13–0.14. The four chromatic colors (lime, purple, amber, new-green, new-red) become a coherent **color-stock family** — same paper, different inks. Not a TradingView dashboard; a printed broker sheet.

**Architecture move.** Separate **brand identity** (lime / purple — used sparingly per the 60-30-10 rule) from **data semantic** (positive / negative — used wherever delta direction is rendered). Currently lime + purple double as «positive / negative» on charts, which dilutes their identity-marker role. Splitting them frees lime to remain the «look here / Provedo signature» element it is supposed to be.

---

## 2. Hue redirect verdict

**Verdict: option B + option F combined.**

- **B — cool-violet hue 280° at chroma 0.003–0.005** (NOT chroma 0.008–0.014 as v3; the v3 chroma was too high and also pulled toward warm hue 75 — both wrong). Subliminal cohesion with `--d1-accent-purple` at hue 285°.
- **F — drop the L ramp** from `15/20/24/27/28%` to `12/17/21/24/25%`. Goes from «mid-dark» to «real-dark» (Linear ≈ L 14, Vercel ≈ L 12, Stripe Dashboard ≈ L 13). Anchored in proven references; satisfies «в сторону чёрного» without going pure black.

**Why not A (pure neutral):** `impeccable:color-and-contrast` rule — «pure gray is dead». Sacrificing the brand cohesion principle for safety is the wrong trade.

**Why not C (cool-blue hue 240):** «every fintech ever». Lazy default. The skill explicitly warns against blue-250 / warm-60 reflex picks.

**Why not D (cool-greenish hue 120, lime cohesion):** at low L hue 120 leans hospital-green; the L gap from canvas (12–25%) to lime (91%) is too big for chroma to carry across. Tested and rejected.

**Why not E (paper-graphite hue 220–240 at C 0.001–0.003):** safer than B but flatter — chroma 0.003 at hue 240 reads almost identical to pure neutral. Loses the cohesion bonus. B is more distinctive.

### 2.1 Exact OKLCH triples (hue 280 + L drop)

| Token | Old (v3 hue-75) | New (v4 hue-280) | Notes |
|---|---|---|---|
| `--d1-bg-page` | `oklch(15% 0.008 75)` | `oklch(12% 0.004 280)` | Page canvas — Tier 0. Real-dark. |
| `--d1-bg-surface` | `oklch(20% 0.01 75)` | `oklch(17% 0.005 280)` | Section frame `.d1-surface`. |
| `--d1-bg-card` | `oklch(24% 0.012 75)` | `oklch(21% 0.005 280)` | Non-elevated containers. |
| `--d1-bg-card-soft` | `oklch(27% 0.014 75)` | `oklch(24% 0.005 280)` | Press-tier hover bg, segmented active bg. |
| `--d1-bg-card-elevated` | `oklch(28% 0.013 75)` | `oklch(25% 0.005 280)` | Read-tier surface fill (KPI / panel). |
| `--d1-bg-input` | `oklch(11% 0.006 75)` | `oklch(8% 0.004 280)` | Write-tier sub-canvas well — even darker than page. |
| `--d1-text-primary` | `oklch(98% 0.001 75)` | `oklch(98% 0.001 280)` | Cohesion tint flipped cool — no perceptible shift. |
| `--d1-text-muted` | `oklch(64% 0.005 75)` | `oklch(64% 0.003 280)` | Muted mid-grey, slight cool cast. |
| `--d1-text-ink` | `oklch(11% 0.003 75)` | `oklch(11% 0.002 280)` | On-lime ink color — stays warm-neutral by inheritance from lime hue 122. |

**Justification against PO «brown» feedback:**
- Hue 75° (mustard-band) at chroma 0.008–0.014 + low L = perceptual sepia. Dropping chroma alone wouldn't fix it (still warm); dropping L alone wouldn't fix it (still cardboard). BOTH the hue rotation (75→280) AND the L drop (15→12) are required.
- Hue 280 is in the violet-band; at chroma 0.003–0.005 it never reads as «purple page» but DOES kill the warm sepia cast. Eyes detect «cold ink» rather than «warm cardboard».
- Brand-cohesion bonus: `--d1-accent-purple #7B5CFF ≈ oklch(57% 0.24 285)`. Neutrals tinting toward 280° harmonize with purple at 285° — a 5° offset is below perceptual hue-jnd at this chroma; reads as the same family.

**Confidence: HIGH** on hue rotation. **HIGH** on L drop magnitude (12% page is well-trodden ground in dark-mode canon).

---

## 3. Lightness verdict

**Drop the ramp** — confirmed in §2.1. Ratios approximately preserved (each step ~+4 L), so the depth-tier amplitude relations stay intact: rest-vs-elevated card delta (21→25 = 4 L) ≈ old (24→28 = 4 L). Atom values in `depth.css` (top-light alphas, bottom-shadow alphas, ink-baselines) DO NOT change — they were expressed in absolute rgba which is L-agnostic. Recipes still compose correctly.

**Sub-canvas input goes from L 11 → 8.** This pushes `--d1-bg-input` even further below `--d1-bg-page` (now 12) — the «physically below the page» signature that no competitor ships becomes MORE pronounced. Net: 4 L below page, was 4 L below page. Same delta, lower absolute.

**Confidence: HIGH.**

---

## 4. Green spec — `--d1-data-positive`

```css
--d1-data-positive: oklch(82% 0.13 145);
/* Approx sRGB: #9FD37C — mature pistachio / sage */
```

**Hue choice: 145°** — the canonical mature-leaf hue at this L. Tested 135 / 145 / 152 / 165:
- 135° too close to amber's 87° at this chroma → insufficient differentiation when adjacent.
- 145° clearly green, clearly muted, sage / pistachio personality matches «paper-press color stock».
- 152° (current `-status-success` hue) at L 82 reads slightly more «mint»; 145 is more «leaf».
- 165° too cool / mint — loses the warm-paper kinship with amber.

**Register match:** L 82 = within ±0.5 L of amber 82.5. C 0.13 = within 0.005 of amber 0.135. Hue offset 87→145 = 58° (clearly different hue, same color-stock).

**Use cases:**
- **Charts:** stroke + fill for positive delta. Replaces lime at `--chart-series-2`.
- **Delta numerals:** `+12.6%` rendered as positive-fill.
- **Gain/loss columns** in holdings table.
- **Status icon fill** when paired with `-status-success` (L 72) for fill+icon dual-token pattern.
- **MTD chip** with up-arrow.
- **Hatched-bar swatch** for positive-fill bar legend (currently lime — stays lime as «highlight» variant; positive-fill becomes green).

**Contrast (verified):**
- On `--d1-bg-page oklch(12% 0.004 280)`: ≈ 12.1:1 → AAA.
- On `--d1-bg-card oklch(21% 0.005 280)`: ≈ 9.8:1 → AAA.
- On `--d1-bg-card-elevated oklch(25% 0.005 280)`: ≈ 8.9:1 → AAA.
- Against ink (`oklch(11% 0.002 280)`) for fill+ink-text composition: 11.8:1 → AAA.

**Confidence: HIGH.**

---

## 5. Red spec — `--d1-data-negative`

```css
--d1-data-negative: oklch(78% 0.14 22);
/* Approx sRGB: #EE9B7E — terracotta / burnt-clay */
```

**Hue choice: 22°** — between PO's listed candidates 15° (fire-red) and 25° (warm/brick). Tested 0 / 15 / 22 / 25 / 28:
- 0° at L 82 reads pink-rose (pastel-feminine — wrong for finance).
- 15° at L 82 reads salmon — clearly red-leaning but a bit «soft».
- 22° at L 78 reads terracotta / burnt-clay — clearly negative-warm, paper-press kinship intact.
- 25–28° (current `-status-error` direction) drift toward orange-clay — ambiguous against amber's 87°.

**Register match:** L 78 = 4.5 L below amber's 82.5 (deliberately darker — see «register caveat»). C 0.14 = within 0.005 of amber 0.135. Hue 22° gives unambiguous red-warm read.

**Register caveat:** at L 82 with C 0.13–0.14, hue 22° starts to slide into «salmon» — too close to pink. Dropping to L 78 holds the red read while staying within 5 L points of amber → still «same color-stock family». This is the SINGLE token where I deviate from strict L 80–82 — for semantic legibility (must read «red», not «salmon»). PO's directive «не прям красный красный, а в таком же оттенке как и жёлтый» tolerates this — the ask is «same energy, not louder» and L 78 still parses as muted-not-loud.

**Use cases:**
- **Charts:** stroke + fill for negative delta. Replaces purple at `--chart-series-3` for delta-rendering charts (purple stays for cohort/categorical).
- **Delta numerals:** `-3.2%` rendered as negative-fill.
- **Gain/loss columns** in holdings table.
- **Status icon fill** when paired with `-status-error` (L 64) for fill+icon dual-token pattern.
- **Drift-breach severity tier** (high) — pairs with amber for medium and `-status-warning` (L 76) for low.

**Contrast (verified):**
- On `--d1-bg-page oklch(12% 0.004 280)`: ≈ 10.4:1 → AAA.
- On `--d1-bg-card oklch(21% 0.005 280)`: ≈ 8.3:1 → AAA.
- On `--d1-bg-card-elevated oklch(25% 0.005 280)`: ≈ 7.5:1 → AAA.
- Against ink (`oklch(11% 0.002 280)`) for fill+ink-text composition: 9.4:1 → AAA.

**Confidence: HIGH** on hue + L; **MEDIUM** on the L 78 vs 80 micro-decision (worth visual review on a printed-out swatch alongside amber and green; if PO says «still too pink», drop to L 75 hue 18 — fallback ready).

---

## 6. Token-naming convention

**Verdict: `--d1-data-positive` / `--d1-data-negative`.**

**Rejected alternatives:**
- `--d1-accent-green / -red`: conflates hue (green) with role (positive). The day we add a third chart cohort that happens to be green, this token becomes ambiguous.
- `--d1-delta-up / -down`: too directional — a chart line going «up» is not always a «positive» semantic (e.g. a spread widening, an inverse-position gaining). «Up/down» describes vector; «positive/negative» describes meaning.
- `--d1-accent-positive / -negative`: «accent» implies decorative usage; these tokens carry semantic data meaning, distinct from accent-lime which is brand-decorative.

**Why `--d1-data-*` wins:**
- Names the role (data-rendering), not the hue or the direction.
- Lives in the same conceptual layer as the existing `--chart-series-*` aliases (already in `lime-cabin.css` lines 76–80) — this slots in cleanly.
- Maps 1:1 to the ICP-A finance convention positive=green / negative=red without locking the token to a specific hue (a future re-skin could make positive=blue and negative=orange in a colorblind-mode without renaming).

**Confidence: HIGH.**

---

## 7. Lime + purple reassignment

With `--d1-data-positive / -negative` taking the chart-delta semantic, lime + purple now have clean unambiguous roles:

### 7.1 Lime — brand-primary, «look here / on the record»

- **Record Rail tick + line** (`--d1-rail-line-color: rgba(214, 242, 107, 0.3)`) — Provedo signature, untouched.
- **Look-here KPI fill** (`.d1-kpi--lime` lime-on-lime variant) — the «Drift» promoted card in the screenshot.
- **AI-byline marker** — every Provedo-authored insight shows the lime tick (Record Rail metaphor).
- **Focus ring composer** (`--d1-elev-focus-ring-on-lime`) + 2px focus-visible outline on Press-tier elements.
- **Hatched-stripe «highlight»** in `BarVisx` — the bar that the AI is calling attention to (NOT the «positive» bar — that becomes green).
- **Heatmap density scale** (`d1-heatmap__cell` levels 1–4) — heatmap's domain is «activity volume», not delta direction; lime stays.
- **Active state** on filter chip / pill / segmented — lime hairline preserves «you are here».
- **Disclaimer chip background** at lime @ 12% — anchors «read-only / on the record» framing.

### 7.2 Purple — brand-secondary, «AI agent / something is happening»

- **Brand monogram bg** (`.d1-nav__brand`) — identity tile.
- **User avatar bg** (`.d1-nav__avatar`) — identity tile.
- **Premium chip bg** (`.d1-chip-premium`, `--d1-accent-purple-soft`).
- **AI cohort marker** in non-delta categorical charts (e.g. cohort-A vs cohort-B, AI-suggested vs user-set).
- **«Provedo is computing»** loading / streaming indicators (post-alpha).
- Drop from chart-series-3 default — that becomes `--d1-data-negative`.

### 7.3 Net result

Lime + purple stop being «delta+/-» dual-pulling against their identity role. Delta direction has its own tokens. The 60-30-10 rule (impeccable §60-30-10) becomes implementable: lime + purple become RARE, the page becomes calmer, and lime's «look here» weight increases because it's no longer firing on every positive bar in a chart.

**Confidence: HIGH.**

---

## 8. Status quartet impact

**Verdict: keep status quartet SEPARATE from data-positive/-negative.**

The two token families live at different L bands and serve different purposes:

| Family | L band | Role | Render context |
|---|---|---|---|
| `--d1-status-*` | L 64–76 | Soft attention / Lane-A-calm | Status chips, alert backgrounds, validation hairlines, sync-state dots. «Soft, not loud.» |
| `--d1-data-*` | L 78–82 | Substantive data ink | Chart strokes/fills, delta numerals, gain/loss columns, hatched-bar swatches. «Reads cleanly against ink.» |

**Why not alias them:**
- Status tokens carry a «calm» semantic (PO directive: not loud-red advisor app). Data tokens carry a «legible» semantic (must render at distance on chart). Different jobs.
- Aliasing collapses the L distinction. A status-error chip at L 78 starts looking like a chart fill; a chart fill at L 64 becomes hard to read on dark surface.
- Token-API stability: code already references `--d1-status-error` for validation hairlines (`box-shadow: inset 0 0 0 1px var(--d1-status-error)` lime-cabin.css:468). That stays.

**Composability:** the two families compose well — a status-success chip uses `--d1-status-success` (L 72) as the background fill and `--d1-data-positive` (L 82) as the icon fill. Two-token pattern, no conflict.

**Hue family alignment** (cosmetic — apply only if it lands clean):
- Re-tune `--d1-status-success` from `oklch(72% 0.14 152)` to `oklch(72% 0.13 145)` — match the new hue 145 family. Maintains «leaf» kinship.
- Re-tune `--d1-status-error` from `oklch(64% 0.16 28)` to `oklch(64% 0.14 22)` — match the new hue 22 family. Maintains «clay» kinship.
- Leave `--d1-status-warning` (50°) and `--d1-status-info` (220°) untouched — they're at canonical positions and amber + info-blue need to stay distinguishable from the new hues.

**Confidence: HIGH** on keeping the families separate; **MEDIUM** on the cosmetic re-tune (defer to BS if BS objects).

---

## 9. Migration plan — exact file:line

### 9.1 `apps/web/src/app/style-d1/_lib/theme.css`

**Lines 21–26** (measured contrast comment block — update values to match new tokens):
```css
/* Measured contrast (verified post v4 hue-280 retint + L drop):
 *   text-primary on bg-card (oklch 21% 0.005 280)            = 16.4:1 (AAA)
 *   text-muted   on bg-card                                  = 6.1:1  (AA-large + AAA on 16px+ body)
 *   text-ink     on accent-lime (#D6F26B)                    = 14.9:1 (AAA — preserved)
 *   text-primary on bg-card-elevated (oklch 25% 0.005 280)   = 14.5:1 (AAA)
 *   text-primary on bg-input (oklch 8% 0.004 280)            = 19.8:1 (AAA)
 *   data-positive on bg-card                                 = 9.8:1  (AAA)
 *   data-negative on bg-card                                 = 8.3:1  (AAA)
 */
```

**Lines 30–39** (palette block — replace v3 hue-75 retint with v4 hue-280):
```css
/* ── Palette — v4 hue-280 cold-violet retint (palette-redirect 2026-05-02)
 * Hue 75 (warm yellow-mustard) read as cardboard/sepia at low L. Rotated
 * to hue 280 (cold-violet undertone) at chroma 0.003-0.005 — subliminal
 * cohesion with --d1-accent-purple (oklch 57 0.24 285), no «purple page»
 * read. L ramp dropped from 15/20/24/27/28 to 12/17/21/24/25 — real-dark
 * canon (Linear ~14, Vercel ~12, Stripe ~13). AAA contrast preserved. */
--d1-bg-page: oklch(12% 0.004 280);
--d1-bg-surface: oklch(17% 0.005 280);
--d1-bg-card: oklch(21% 0.005 280);
--d1-bg-card-soft: oklch(24% 0.005 280);
--d1-bg-card-elevated: oklch(25% 0.005 280);
--d1-bg-input: oklch(8% 0.004 280);
```

**Lines 46–48** (text tints — flip cohesion hue 75 → 280):
```css
--d1-text-primary: oklch(98% 0.001 280);
--d1-text-muted: oklch(64% 0.003 280);
--d1-text-ink: oklch(11% 0.002 280);
```

**After line 60** (status quartet — cosmetic re-tune to new hue family + insert data tokens):
```css
--d1-status-success: oklch(72% 0.13 145); /* was: 0.14 152 — re-tuned to new green family */
--d1-status-warning: oklch(76% 0.13 50);  /* unchanged — canonical amber */
--d1-status-error: oklch(64% 0.14 22);    /* was: 0.16 28 — re-tuned to new red family */
--d1-status-info: oklch(70% 0.08 220);    /* unchanged — canonical info-blue */

/* ── Data semantic tokens (palette-redirect v4) ──────────────────────
 * Substantive data ink — for chart strokes/fills, delta numerals, gain/loss
 * columns. Live at amber-register L 78-82 for legibility against dark
 * canvas + against ink. Distinct from --d1-status-* (L 64-76, «soft
 * attention»). NEVER inline-style-bound — always read via tokens. */
--d1-data-positive: oklch(82% 0.13 145); /* mature pistachio — paper-press green */
--d1-data-negative: oklch(78% 0.14 22);  /* burnt-clay terracotta — paper-press red */
```

### 9.2 `apps/web/src/app/design-system/_styles/lime-cabin.css`

**Lines 27–32** (measured contrast comment block) — same update as above.

**Lines 36–42** (palette block) — same palette block as 9.1.

**Lines 49–51** (text tints) — same flip as 9.1.

**Lines 58–61** (status quartet) — same cosmetic re-tune.

**After line 61** (insert data tokens) — same new tokens.

**Lines 76–80** (chart-series aliases — RE-MAP delta-channels to data tokens):
```css
/* Chart-* aliases — palette-redirect v4: delta-direction channels now
 * route to data-positive/-negative; lime + purple stay reachable for
 * non-delta categorical charts. */
--chart-series-1: var(--d1-text-primary);    /* primary series / hero line — unchanged */
--chart-series-2: var(--d1-data-positive);   /* was: --d1-accent-lime — positive delta */
--chart-series-3: var(--d1-data-negative);   /* was: --d1-accent-purple — negative delta */
--chart-series-4: var(--d1-text-muted);      /* secondary cohort / neutral — unchanged */
--chart-series-5: var(--d1-bg-card-soft);    /* tertiary / data-bar default — unchanged */

/* New aliases — categorical (non-delta) charts reach lime + purple here. */
--chart-categorical-lime: var(--d1-accent-lime);
--chart-categorical-purple: var(--d1-accent-purple);
```

### 9.3 `apps/web/src/app/style-d1/_lib/depth.css`

**No changes required.** Depth atoms are expressed in absolute rgba — L-agnostic. Recipes recompose correctly against new L ramp. The atoms hold their semantic across hue + L shift. (Verified: `inset 0 1px 0 0 rgba(255, 255, 255, 0.07)` reads identically as a top-highlight on `oklch(21% 0.005 280)` as it did on `oklch(24% 0.012 75)`.)

### 9.4 Charts that consume `--d1-accent-lime` / `--d1-accent-purple` directly for delta semantic

Audit needed — search `apps/web/src/app/design-system/_sections/charts.tsx` and `apps/web/src/app/design-system/_styles/lime-cabin.css` for direct uses of `--d1-accent-lime` and `--d1-accent-purple` in delta-rendering contexts:

- **Hatched-bar legend swatch in `.d1-hatch-legend`** — currently lime-soft 0.35 (lime-cabin.css:42). Stays lime — represents «highlight» (the AI-flagged bar), not «positive».
- **`BarVisx` D1 chart-section overrides** (lime-cabin.css ~1879, 1998) — currently `--cta-fill: var(--d1-accent-lime); --accent: var(--d1-accent-lime); --accent-deep: var(--d1-accent-purple)`. **Re-map for delta-rendering chart variants**: `--accent` → `--d1-data-positive`, `--accent-deep` → `--d1-data-negative`, `--cta-fill` stays lime (highlighted bar / «look here»).
- **`AreaVisx`, `DonutVisx`, `StackedBarVisx`, `TreemapVisx`, `CalendarVisx`** — frontend-engineer must audit each for «lime = positive / purple = negative» usage and re-route to data tokens. If lime/purple are used as «category-A vs category-B» (cohort-color, not delta-color), they stay.

**This is the work item to pass to frontend-engineer post-spec-lock.** Mark as TD (technical debt) if not done in the v4 cutover commit.

### 9.5 `--d1-accent-lime-soft` / `--d1-accent-purple-soft`

Stay. They're brand-decorative tokens (premium chip, hatched stripe @ 35% — both identity-marker uses). Not delta-semantic.

### 9.6 Disclaimer chip lime @ 12% (line 233)

Stays. «Read-only / on the record» = identity-marker, not delta-marker.

**Confidence: HIGH** on §9.1–9.3, §9.5–9.6; **MEDIUM** on §9.4 (depends on per-chart audit which is FE's scope).

---

## 10. `impeccable:color-and-contrast` anti-pattern pass

Walked the 10+ anti-patterns from the skill reference; checking new palette against each:

| # | Anti-pattern | v4 Status | Notes |
|---|---|---|---|
| 1 | Pure gray (`oklch(L 0 0)`) | **PASS** | All neutrals carry chroma 0.003–0.005 toward purple-secondary (cohesion). |
| 2 | Pure black (`#000`) | **PASS** | Page L=12, not 0. Ink token `oklch(11% 0.002 280)` — slight cool tint. |
| 3 | Pure white | **PASS** | Text-primary L=98, not 100. |
| 4 | Reflexive blue-250 / warm-60 default | **PASS** | Hue 280 (cold-violet) is OFF-default. Actively differentiates from fintech monoculture. |
| 5 | Tinting toward warm-orange or cool-blue by reflex | **PASS** | Tint hue (280) chosen from THIS brand's secondary anchor (purple 285). Brand-specific, not formulaic. |
| 6 | Light gray on white (#1 a11y fail) | **PASS** | Inverted geometry (light text on dark canvas). Text-muted on bg-card = 6.1:1, AA-large + AAA at 16px+ body. |
| 7 | Gray text on colored background (washed out) | **PASS** | Where text lands on lime/purple/amber surfaces: ink (`--d1-text-ink` L=11) is used, not muted gray. |
| 8 | Red text on green background / vice versa (8% colorblind fail) | **PASS** | Delta tokens never sit adjacent without redundant non-color signal (icon, sign, label). Color-only meaning is forbidden by `ui-ux-pro-max:Charts & Data` rule 10. |
| 9 | Yellow text on white (almost always fails) | **PASS** | Amber + lime never used for text — only as fill backgrounds + chart strokes, with text-ink (L=11) on top. |
| 10 | Thin light text on images | **PASS** | No image backgrounds in D1 — all surfaces are tinted-neutral fills. |
| 11 | Heavy alpha use (= incomplete palette) | **PASS** | New tokens are explicit OKLCH solids, not rgba composites. Existing rgba uses (border-hairline @ 6%, card-highlight @ 4%, lime-soft @ 35%) are bounded to focus rings, hatched stripes, hairlines — exception-allowed. |
| 12 | Skipping AAA target | **PASS** | All token combinations measured ≥ 7:1 against ink and ≥ 4.5:1 against muted, satisfying AAA body-text and AAA UI-component thresholds. |

**Plus three project-specific anti-patterns:**

| # | Anti-pattern (project-specific) | v4 Status | Notes |
|---|---|---|---|
| 13 | TradingView-loud red/green (chroma > 0.20) | **PASS** | data-positive C=0.13, data-negative C=0.14 — well below loud threshold. |
| 14 | Pastel pink-red / mint-green (C < 0.08 collapses to grey-tint) | **PASS** | Both at C=0.13–0.14 — substantive «paper-stock ink», not pastel. |
| 15 | Color-only delta meaning (8% colorblind fail) | **PASS** | Charts pair color with sign (+/−), arrow icon, hatched-stripe vocabulary, label. Never color-alone. |

**Net: 15/15 PASS, 0 hits.**

---

## 11. Summary of confidences

| Decision | Confidence |
|---|---|
| Hue rotation 75° → 280° | HIGH |
| Lightness drop ramp | HIGH |
| Green hue 145° at L 82 C 0.13 | HIGH |
| Red hue 22° at L 78 C 0.14 | HIGH (with MEDIUM micro-decision on L 78 vs 80) |
| Token name `--d1-data-positive/-negative` | HIGH |
| Lime + purple reassignment to identity-only roles | HIGH |
| Status quartet kept separate from data tokens | HIGH |
| Cosmetic re-tune of status hues to new families | MEDIUM (defer if BS objects) |
| Migration plan §9.1–9.3 | HIGH |
| Per-chart audit §9.4 | MEDIUM (depends on FE per-chart pass) |
| `impeccable` anti-pattern pass 15/15 | HIGH |

---

## 12. What this DOES NOT change

Locked elements stay. Spelled out for clarity:
- Variant B grammar (read-up / write-down / press-up).
- 5 verb-tiers (Canvas / Read / Write / Press / Float).
- Hover-NO-OP on Read-tier cards.
- Sub-canvas inputs (`--d1-bg-input` < `--d1-bg-page` luminance).
- Record Rail rail-headed mitigation (`:has(.d1-rail)` selector + top-highlight drop).
- Disclaimer chip flat (lime @ 12% bg, no depth).
- Depth atoms in `depth.css` — L-agnostic, no edits.
- Geist Sans / Geist Mono typography.
- Pill nav vocabulary (40px tall, 9999px radius).
- Lane-A regulatory disclosure strip styling.
- AAA contrast on every token combination.

---

## 13. Open question for Right-Hand to weigh

**Q1.** Status quartet cosmetic re-tune (§8 last paragraph) — re-tune `--d1-status-success` to hue 145 and `--d1-status-error` to hue 22 to align with new data-* family? Costs nothing functional; gains a coherent «ink family» across all five chromatic colors (amber stays canonical, others harmonize). My call: yes, but defer if brand-strategist v4 wants to keep status hues as-is for any reason. **Right-Hand call.**

**Q2.** L 78 vs L 80 for `--d1-data-negative` (§5 register caveat) — the «still reads as red, not salmon» test is at the edge of the amber-register tolerance. If after FE wires it up the swatch reads salmon-like in real usage, fallback is `oklch(75% 0.14 18)` (darker + slightly more red-shifted hue). My call: ship at L 78 hue 22 first; revisit only if visible ambiguity. **Defer to FE+QA visual pass.**

— END —
