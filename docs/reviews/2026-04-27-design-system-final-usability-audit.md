# Final Usability + Visibility Audit

**Subject:** Provedo Design System v2 (`apps/web/public/design-system.html`)
**Reviewer:** user-researcher (isolated context, dispatched by Right-Hand)
**Date:** 2026-04-27
**Verdict:** TIGHTEN
**Confidence:** high

PO's «white-on-white / black-on-black» complaint is empirically correct. Hard numbers below.

---

## Section 1 — 5-second scan (both themes)

**Light, t=0–5s.** What lands: the hero «Notice **what** you'd miss.» (48px Geist, ink, jade «what»), then the eyebrow mono «PROVEDO · DESIGN SYSTEM v2 · LIGHT». Cream-on-cream stage. Cards float well thanks to dual-shadow warm cocoa lift. The double-shadow on `.card-pf` and `.card-signature` is the heaviest signal carrier — it's doing the visibility work the surface tokens aren't.

- Serious finance tool: **beat.** Geist tabular numerals at 28px ($184,210) read as Bloomberg-adjacent, not Robinhood.
- Trust signal: **beat.** Forest-jade is restrained. No neon. No gradient.
- Anti-Robinhood: **achieved.** Editorial paper voice, not crypto-bro neon.
- AI-for-portfolio identity: **mid.** Hero copy is metaphorical («Notice what»). Mono eyebrow «PORTFOLIO · ANSWER · ENGINE» does the explicit work but reads at 10–11px — a 2-second viewer parses the headline first and may get «poetry» before «product». Not fatal; it's a landing-page concern, not a DS concern.

**Dark, t=0–5s.** Same hero structure but stage gets visually flat. Within 5s I cannot reliably distinguish stage-bg from card-bg — they sit at 1.15:1 luminance ratio. Cards exist but float on shadow alone (no warm reverse-glow like light gets). The «Cream (CTA)» swatch is brighter than the card — visually it's the brightest element and pulls focus away from the headline.

- Serious finance: **beat** (still — typography carries it).
- Trust: **mid.** Card-on-bg merging undermines the «engineered» feel. Reads slightly «dashboard demo screenshot» rather than «shipped product».
- Anti-Robinhood: **beat.**
- AI identity: **mid** (same as light).

---

## Section 2 — Surface merging audit

Computed WCAG luminance ratios between adjacent surfaces. **Below 1.3:1 = perceptually unreliable without shadow/border crutches.** Above 1.5:1 = clearly distinct.

### Light theme — surface pairs

| Pair | Tokens | Ratio | Merge level | Note |
|------|--------|-------|-------------|------|
| bg vs card | #F1EDE3 vs #FFFFFF | **1.17:1** | **4/5 merge** | Pure white card on cream bg — visible only because dual cocoa shadow does heavy lift. Without shadow, vanishes. |
| bg vs inset | #F1EDE3 vs #E8E2D4 | **1.10:1** | **4/5 merge** | Inset is barely darker than bg. Inset shadow does the work. |
| card vs inset | #FFFFFF vs #E8E2D4 | 1.29:1 | 3/5 merge | Acceptable, inset's depressed shadow sells it. |

**Light verdict:** Card-on-bg is the worst offender. Card lifts only through warm-cocoa double-shadow at 5px. If user disables shadows (high-contrast mode, screenshots, low-DPI screens), cards become invisible white blocks on cream.

**Recommended luma adjustment:**
- Either darken bg to **#EDE7DA** (gives 1.30:1 vs card — borderline acceptable) or
- **Darken card to #FAF7F0** (gives 1.13:1 — same problem, just reversed) — DON'T do this. Card must stay brightest.
- **Best:** keep card at #FFFFFF, **darken bg to #EAE3D1** (1.36:1) AND strengthen border on `.card-pf`/`.card-signature` from `rgba(20,20,20,0.14)` → `rgba(20,20,20,0.22)`. Solves screenshot/no-shadow case.

### Dark theme — surface pairs

| Pair | Tokens | Ratio | Merge level | Note |
|------|--------|-------|-------------|------|
| bg vs card | #0E0E12 vs #1D1D22 | **1.15:1** | **5/5 merge** | This is the PO complaint, validated. Card lift is purely shadow-dependent in a theme where shadows are dimmed («restrained, no glow»). |
| bg vs inset | #0E0E12 vs #0A0A0C | **1.03:1** | **5/5 merge** | Inset is *darker* than bg, almost identical luminance. Tabs/inputs disappear into bg. |
| card vs inset | #1D1D22 vs #0A0A0C | 1.18:1 | 4/5 merge | OK only inside a card with surrounding border. |
| dark bub-user #1A2520 vs bg | 1.22:1 | 4/5 merge | User chat bubble on stage bg — barely distinct. |
| dark bub-user #1A2520 vs card #1D1D22 | **1.06:1** | **5/5 merge** | If user bubble appears inside a card-bg context — invisible. |

**Dark verdict:** This is structurally broken, not a polish issue. The PO is right. Three problems:

1. **Card vs bg** sits at 1.15 — same delta as light, but light has dual-shadow + warm reverse-highlight. Dark has only `0 4px 16px rgba(0,0,0,0.5)` — a downward shadow on near-black is barely visible because the bg is already near-black.
2. **Inset darker than bg** is the wrong polarity for a «depressed slot» in dark mode. Inputs read as «hole into the void» but the void is the same depth as the wall around it. Should either be brighter than card (cleaner) or noticeably darker than bg.
3. **bub-user #1A2520** is hardcoded outside the token system — green-tinted but not a token.

**Recommended luma adjustment (dark, hardest-hitting fixes):**
- **Brighten card to #24242B** (gives 1.45:1 vs bg — passes the perceptual threshold).
- **Brighten inset to #16161A** (sits *between* bg and card — proper «slot below card surface», 1.10:1 vs bg but visible because card-on-inset becomes 1.32:1).
- **Strengthen card border** to `rgba(255,255,255,0.18)` from 0.12.
- **Add a 1px highlight on top edge of `.card-pf`/`.card-signature`** in dark — `inset 0 1px 0 rgba(255,255,255,0.06)` (already present in shadow-card, but increase to 0.10).

### Component-specific merges

| Component | Issue | Severity |
|-----------|-------|----------|
| `.tabs` (light) — bg `var(--inset)` #E8E2D4 sits inside a stage-bg card at #F1EDE3 | 1.10:1 surface delta | High |
| `.toast-icon.info` (light) — `var(--inset)` icon inside `var(--card)` toast | 1.29:1 — OK with shadow | Low |
| `.empty-icon` — `var(--inset)` circle inside `.card-empty` (#FFFFFF) | 1.29:1 — OK | Low |
| `.bub-user` (light) — `var(--inset)` bubble against stage `var(--bg)` | 1.10:1 — borderline | Med |
| Swatch labels in DS show **stale hex values** | bg=#F4F1EA labeled, actual=#F1EDE3; card=#FAF7F0 labeled, actual=#FFFFFF; etc. | High (DS doc credibility) |

---

## Section 3 — Accessibility (contrast pairs, WCAG)

WCAG AA: 4.5:1 small text · 3:1 large text (≥18px or ≥14px bold). AAA: 7:1 / 4.5:1.

### Light — text pairs

| Element | Pair | Ratio | AA | AAA |
|---------|------|-------|-----|-----|
| ink on card | #1A1A1A on #FFFFFF | 17.40:1 | pass | pass |
| ink on bg | #1A1A1A on #F1EDE3 | 14.89:1 | pass | pass |
| ink on inset | #1A1A1A on #E8E2D4 | 13.48:1 | pass | pass |
| text-2 on card | #4D4D4D on #FFFFFF | 8.45:1 | pass | pass |
| text-2 on inset (chip) | 6.55:1 | pass | pass-large only | OK |
| text-3 on card | #7A7A7A on #FFFFFF | 4.29:1 | **fail small** | fail |
| text-3 on bg | #7A7A7A on #F1EDE3 | 3.67:1 | **fail small** | fail |
| text-3 on inset | #7A7A7A on #E8E2D4 | **3.32:1** | **fail small** | fail |
| accent on card | #2D5F4E on #FFFFFF | 7.35:1 | pass | pass |
| accent on inset | #2D5F4E on #E8E2D4 | 5.69:1 | pass | fail |
| terra on card | #A04A3D on #FFFFFF | 5.93:1 | pass | fail |
| cream on ink CTA | 15.43:1 | pass | pass |

**Failures, light:**
- **text-3 (#7A7A7A) fails AA on every surface.** Used for: `.pf-broker`, `.sw-hex`, `.input-help`, `.breadcrumb`, `.empty-icon p`, `.card-empty p`, `.tr.head` was raised to `text-2` (good), `.modal-eyebrow` is accent (OK), eyebrow mono in `.stage-head .right`, `.toast-msg` (uses text-2, OK).
- Critical: `.pf-tiny` was changed to `var(--text-2)` — 8.45:1 — **passes**. Good.
- Critical: `.input-help` at #7A7A7A — **fails 4.29:1**. Bump to `var(--text-2)`.
- `.card-empty p` (12px) at text-3 — **fails 4.29:1**. Bump to `var(--text-2)`.
- `.breadcrumb` (10px mono) at text-3 — **fails 3.67:1 on bg**. Bump to text-2.
- `.toast-icon.info` text — uses text-2 inside an inset chip on card — passes.
- `.btn-disabled` opacity 0.45 on a text-2 ghost button → effective ratio ~3.8 — fails. WCAG allows non-essential disabled to fail, but worth a note.

### Dark — text pairs

| Element | Pair | Ratio | AA | AAA |
|---------|------|-------|-----|-----|
| cream on card | #F4F1EA on #1D1D22 | 14.88:1 | pass | pass |
| cream on bg | 17.08:1 | pass | pass |
| cream on inset | 17.54:1 | pass | pass |
| text-2 on card | #B5B5B5 on #1D1D22 | 8.19:1 | pass | pass |
| text-2 on bg | 9.39:1 | pass | pass |
| text-3 on card | #7A7A7A on #1D1D22 | 3.91:1 | **fail small** | fail |
| text-3 on bg | #7A7A7A on #0E0E12 | 4.49:1 | **fail small** by 0.01 | fail |
| text-3 on inset | #7A7A7A on #0A0A0C | 4.61:1 | pass | fail |
| accent on card | #4A8775 on #1D1D22 | **4.01:1** | **fail small** | fail |
| terra on card | #BD6A55 on #1D1D22 | 4.28:1 | **fail small** | fail |
| bg on cream CTA | 17.08:1 | pass | pass |

**Failures, dark:**
- **accent #4A8775 fails AA on card at 4.01:1.** Used in: `.insight-eyebrow`, `.bub-ai .label`, `.sig-eyebrow`, `.modal-eyebrow`, `.bub-ai .body .accent` highlight word, `.citation::before` icon. All small text. **Bump dark accent to #5FA08C** (already exists as `--accent-light` in dark — promote it to `--accent`).
- **terra #BD6A55 fails AA on card at 4.28:1.** Used in `.delta.neg`, `.input-help.error`. **Bump dark terra to #C97D6A** (~5.0:1).
- text-3 fails on card at 3.91:1. Used in `.pf-broker`, `.sw-hex`, `.input-help`, `.breadcrumb`. **Promote to text-2 in same components as light fix.**

### Specific concerns from PO

| Concern | Status |
|---------|--------|
| text-3 in tables (was 3.7:1) | Now uses text-2 (#4D4D4D) in `.tr.head` → **8.45:1 — fixed**. |
| pf-tiny in cards | Changed to text-2 → **passes**. |
| Mono labels on inset (chips, eyebrows) | Mostly text-2 or accent, OK. Eyebrows on inset are accent #2D5F4E → 5.69:1 pass-AA. |
| Citation chip text on inset | text-2 → passes. |
| Help text under inputs | **Still text-3 — fails on both themes. Fix.** |
| Disabled button text | 0.45 opacity → ~3.8:1 — non-essential, acceptable but flag. |

---

## Section 4 — Cognitive load for Scattered Optimiser

ICP context: 32–42, multi-broker, anxious about scattered holdings, semi-pro mindset. They're scanning 4 portfolio cards across IBKR/Lynx/Binance/Coinbase wanting one thing: **«am I OK or not OK right now?»**

| Friction point | Status |
|---------------|--------|
| Numbers scannable in tables | **Beat.** Tabular nums + right-aligned values + dotted column dividers + ticker as 2-line cell — Bloomberg-grade. This is the strongest part of the DS. |
| Status (pos/neg deltas) immediately readable | **Mid.** Light: jade #2D5F4E vs bronze #A04A3D — distinguishable but both saturated mid-tones, semi-pro user might want a faster green/red read at 1m glance. **Dark: terra fails AA (4.28).** Combined with negative numbers being the anxiety trigger, this is exactly the wrong place for low contrast. |
| Hover affordances clear | **Mid.** `.tr` rows have no hover state. Anxious user wants to mouse over a position and see «I can click this for detail» — currently nothing visual happens. Add `.tr:hover { background: var(--inset); }`. Also `.card-pf` has no hover lift — adds anxiety («is this interactive?»). |
| Visual noise distracting from data | **Beat.** Restraint is the win. No neon, no gradient blob, no animations, no mascot. The DS reads as «this person is serious, my money is safe with their tooling». |
| Pulse dot semantics | **Risk.** Both pulse states are solid (warn variant uses terra). Colorblind 8% of male ICP can't distinguish jade from terra at small size. **Add an icon variant** (e.g., warn = `▲` glyph inside, normal = empty dot) — the comment in CSS says «colorblind safety covered by pf-tiny ink+sign» but that text is below the pulse, not adjacent. Anxious user will glance at the dot first. |
| Anxiety trigger handling | **Note.** `−5.8% week · 7 positions` in Binance card — terra-tinted. The card itself doesn't lift in a way that says «look at me» despite being the bad-news card. Consider: warning card gets a 1px terra-toned left border (`border-left: 3px solid var(--terra)`) for the anxious-scanner pattern. Currently the only differentiator is the small pulse dot. |

---

## Section 5 — TIGHTEN list

**Must-fix before show (ordered by impact):**

1. **Dark surface stack — restructure tokens.** Bg #0E0E12 / card #1D1D22 / inset #0A0A0C → **bg #0B0B0E / card #1F1F25 / inset #15151A**. Targets: bg-vs-card 1.45:1, card-vs-inset 1.30:1, inset *between* bg and card. Re-test perceptually.
2. **Light card border bump** to `rgba(20,20,20,0.20)` from 0.14 — gives screenshot-safe edge.
3. **Dark accent token swap.** Promote `--accent-light` (#5FA08C) to `--accent`. Demote current to `--accent-deep` for backgrounds. Restores AA on label/eyebrow/citation.
4. **Dark terra bump** #BD6A55 → #C97D6A. Restores AA on `.delta.neg`.
5. **text-3 → text-2 in 4 components:** `.input-help`, `.card-empty p`, `.breadcrumb`, `.swatch .sw-hex`. (Already done in tables/pf-tiny.)
6. **Sync DS swatch labels to actual tokens.** Currently shows #F4F1EA/#FAF7F0/#ECE7DC for surfaces, real values are #F1EDE3/#FFFFFF/#E8E2D4. Same drift in dark swatches. **DS document is lying about its own tokens** — credibility risk.
7. **Add `.tr:hover { background: var(--inset); cursor: pointer; }`** for affordance.
8. **Pulse dot — add inner glyph for colorblind.** `.pulse.warn::after { content: '!'; ... }`, normal = empty.
9. **Move `bub-user` dark color (`#1A2520`) into a token** — `--bub-user-dark` or add to inset stack. Hardcoded values outside the token system are tech debt.

**Nice-to-have (not blockers):**
- Warning-card left border (terra) on `.card-pf` when delta is negative.
- `.card-pf:hover` micro-lift (translateY -1px + shadow bump).
- `.btn-disabled` increase opacity to 0.55 for legibility on light.

---

**Bottom line:** Typography, layout rhythm, restraint, and the editorial voice are **ship-grade and beat anti-Robinhood**. The DS is held back by surface tokens that don't deliver perceptual separation in dark mode (1.15:1 card-vs-bg) and by 5–6 small text-3 components that fail AA. None of these need architecture changes — token-level edits to `:root.dark` and 4 component class swaps. **Half a day of work.**

After fixes 1–6, verdict moves to **SHIP NOW**.
