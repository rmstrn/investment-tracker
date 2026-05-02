# Brand Review — Global D1 Elevation System

**Reviewer:** brand-strategist
**Date:** 2026-05-02
**Subject:** PO directive 2026-05-02 — promote `.d1-kpi:hover` lift+shadow effect (`translateY(-2px) + box-shadow 0 8px 24px rgba(0,0,0,0.4)`) to **default rest state** for ~20 D1 selectors (cards + buttons + chrome). Hover then pushes deeper.
**Parallel author:** product-designer (implementation spec at `docs/design/D1_ELEVATION_SYSTEM.md`)

---

## Verdict

**SUPPORT-with-conditions** — proceed with Tier 1 (cards/surfaces) and Tier 2 (interactive) at full elevation; **HOLD on `.d1-disclaimer-chip` and `.d1-pill--active`** at rest-state lift; **CAUTION** on three more (rationale below). Conditions are non-optional for brand-safety. Without them, the universal pass reactivates the originality-void risk that Fix #2 of the 7-fix-pass was authored to mitigate.

---

## 1. DNA alignment assessment

**The originating brand grammar of D1 is editorial flatness, not card-stack depth.** The 7-fix-pass document and the live theme.css (`/style-d1/_lib/theme.css`) state the signature visual asset is the **Provedo Record Rail** — a 1px lime hairline + tick + datestamp + ledger-rule between data zones. The metaphor is «on the record» — paper-press, ledger, editorial dated note. That is a *flatness-leaning* metaphor: pages, rules, hairlines, stamps. It does not rhyme with «raised cards floating on a dark canvas with shadow halos.»

The 7-fix-pass also explicitly **muted** lime fills on filter chips and segmented controls (Fix 5) precisely because the original D1 read as «every dark dashboard 2024-26» — too much shouty surface treatment. A universal lift+shadow pass risks an **isomorphic regression on the depth axis**: we pulled saturation back; if we now push elevation up across ~20 selectors, we land on a different version of the same convergent dashboard look (lime+purple+dark + every-element-floats), which is the genre default in 2026 — see Linear, Notion-Calendar, Vercel v4, Pitch dashboards, Cuberto/Halo Lab dribbble works. The Record Rail thrives on a flat substrate; floating cards over flat ground are a *different* aesthetic register (Material 3, glassmorphism stack, 2024 SaaS) and the Rail looks decorative in that register, not load-bearing.

That said — the directive is not a regression to «raw D1». It's a refinement: light tactile depth + Geist + paper-press hairlines + ledger-rule rail is a **defensible synthesis** if (and only if) the elevation values stay subtle and the Rail is given visual primacy over the lift. The current `.d1-kpi:hover` numbers (`translateY(-2px) + 0 8px 24px rgba(0,0,0,0.4)`) are on the edge of «tactile» and «floaty». Promoting that exact value to rest state on every card pushes us into «floaty». **Recommendation: at rest, halve the values** (`translateY(-1px) + 0 4px 12px rgba(0,0,0,0.3)`), and reserve the full value for hover. This preserves the directive's intent (depth as default) while keeping the editorial register dominant.

## 2. Originality risk vs Record Rail

**The Record Rail and universal elevation fight. Rail must win.**

Fix #2's entire rationale was: «without a Provedo-signature element, D1 reads as every dark dashboard 2024-26.» The Record Rail solved this by being a *flatness-grammar* artifact — hairline, tick, datestamp — that no other fintech dashboard ships. If every panel carrying a Rail also carries a `0 8px 24px rgba(0,0,0,0.4)` shadow halo, the eye reads the *card* first («floating panel») and the *Rail* second («decorative hairline inside the card»). The Rail demotes from signature to ornament.

**Visual-priority test:** in a 5-second squint at the rendered dashboard, what does the user see? With universal full-strength elevation: a stack of dark-mode cards (genre default) with hairlines on top (decorative). With muted elevation + Rail-first hierarchy: a flat editorial canvas with subtle tactility, anchored by the Rail (signature). The first read is replaceable by any 2026 dashboard; the second is Provedo's.

**Resolution:** halve the rest-state elevation values; make the Record Rail's `--d1-rail-line-color` slightly more present (currently `rgba(214, 242, 107, 0.3)` — bump to 0.4 to compensate for new shadow contrast competition). The Rail must be the *first* thing the eye locks onto on every panel.

## 3. Selector-by-selector verdict

| # | Selector | Verdict | Rationale |
|---|---|---|---|
| 1 | `.d1-kpi` (default) | **GO** | Already proven at hover. As rest state with halved values, reinforces «KPI is a tangible artifact.» Rail above it stays dominant. |
| 2 | `.d1-kpi--portfolio` | **GO** (full strength acceptable) | Hero numeral container — premium product expects more depth on the dominant figure per Fix #4. Use full hover-grade elevation at rest; hover lifts further by ~50%. |
| 3 | `.d1-kpi--lime` (highlighted) | **CAUTION** | Lime fill already carries «look here» semantic per Fix #5 (reserved as the ONE signal). Adding shadow halo over a lime card creates a double-emphasis stack that pulls the eye even harder — risks reactivating the «implied advice / alarm-grade» concern from Fix #1 (raised by content + finance + legal + brand). **Recommendation:** ship lime KPI with elevation but at *halved* values vs neighboring dark KPIs; visual emphasis comes from the lime fill, not from the shadow. |
| 4 | `.d1-panel` (chart panels) | **GO** (halved values) | Anchors three-column data grid as discrete artifacts. Halved values keep the Rail dominant inside the panel. |
| 5 | `.d1-insight` (AI rows) | **HOLD** | This is the post-fix-pass *editorial dated note* surface — Fix #2 explicitly chose Record Rail + ledger-rule hairlines as the AI insight format precisely to escape the «chat-row» pattern. Lifting each insight reactivates the chat-row affordance: rows-as-cards = bubbles-as-cards = «I can reply here». The whole point of the Rail is that insights live on a flat editorial substrate. **Do not elevate.** |
| 6 | `.d1-cta` | **GO** (full strength) | Primary lime CTA — elevation + lime fill is the standard premium-button pattern. Already has `transform: translateY(-1px)` at hover; promote the resting state to that, hover goes to -2px + shadow. |
| 7 | `.d1-pill` (default nav) | **CAUTION** | Pill nav is high-frequency low-attention chrome. If every pill floats, the nav reads visually noisy — eye hunts for the active pill less easily because all pills now compete with shadow halos. **Recommendation:** flat at rest, lift on hover only. The active pill (lime fill) is the one «look here» in the row — let it earn that on its own. |
| 8 | `.d1-pill--active` (lime nav active) | **HOLD** | Same logic as `.d1-kpi--lime` — but stronger. The active pill IS the «sanctioned look here» surface (per theme.css comment line 247). Adding shadow over lime fill on a pill creates a visual «button waiting to be pressed» affordance. The active pill is *already pressed* (state indicator); the shadow lies. Stay flat. |
| 9 | `.d1-chip` (filter chips, default) | **CAUTION** | Same noise concern as `.d1-pill`. Halved values acceptable; full values not. |
| 10 | `.d1-chip--active` (lime hairline) | **GO** (halved) | Fix #5 already muted this from solid lime to inset hairline — the active state is now signaled by border, not fill. Light elevation reinforces the active-chip-is-tactile read. Halved values. |
| 11 | `.d1-chip-premium` (purple) | **GO** (halved) | Premium chip is a status badge — elevation reinforces «earned». Halved values. |
| 12 | `.d1-chip--icon` | **GO** (halved) | Icon chip is interactive surface; elevation is appropriate. |
| 13 | `.d1-chip--export` | **GO** (halved) | Same. |
| 14 | `.d1-segmented` (container) | **CAUTION** | Container itself shouldn't float — it's chrome. **Recommendation:** flat container, elevation lives only on the active inner button (`.d1-segmented__btn--active`). |
| 15 | `.d1-segmented__btn` (default) | **CAUTION** | Same noise concern as nav pills — these are dense, high-frequency toggle controls. Flat at rest, elevation on hover only. |
| 16 | `.d1-segmented__btn--active` | **GO** (halved) | The active toggle is the one indicator that needs to «sit forward» of its peers. Halved values OK. |
| 17 | `.d1-nav__icon-pill` (icon buttons) | **GO** (halved) | Search/notifications/avatar are real interactive controls. Halved elevation reads as «button-like» and reinforces affordance. |
| 18 | `.d1-disclaimer-chip` (`[Read-only · No advice]`) | **HOLD — STRONG** | This chip is a **Lane-A regulatory cure** (Fix #3). It is NOT a marketing badge or a status pill — it is a regulatory disclosure that must read as built-in to the chrome, not as a decorative element. Lifting it with shadow makes it read as a «feature highlight» / «marketing chip» / «promo banner» — exactly the framing legal and finance flagged as Lane-A risk during the original review. **Specific risk:** if a regulator screenshots this chip and it visually presents as a marketing badge (lifted, shadowed, equal in chrome treatment to `.d1-chip-premium`), Provedo's defence «the disclaimer is persistent and chrome-level» weakens materially. Stay flat. |
| 19 | `.d1-nav__brand` (P logo monogram) | **CAUTION** | Identity surface, not interactive. Lifting it adds nothing semantically. Flat is correct. If included for consistency, halved values minimum. |
| 20 | `.d1-nav__avatar` (user avatar) | **GO** (halved) | Interactive (opens profile menu typically). Halved elevation = appropriate affordance. |

**HOLD count: 3** (`.d1-insight`, `.d1-pill--active`, `.d1-disclaimer-chip`)
**CAUTION count: 5** (`.d1-kpi--lime`, `.d1-pill`, `.d1-chip`, `.d1-segmented` container, `.d1-segmented__btn` default, plus `.d1-nav__brand` if included)
**GO count: 12** (with halved values on most)

## 4. ICP read

**ICP A (28-40 multi-broker / weekly ChatGPT):** Universal subtle elevation reads as «considered, premium fintech» — same register as Mercury, Pitch, Linear app surfaces this user already trusts. **Positive read.** This cohort expects tactility on real-money apps; flat-everything reads as «MVP» or «not done yet». Halved values land this read without tipping into floaty.

**ICP B (22-32 AI-native, daily ChatGPT, TikTok):** This cohort's reference set is Linear, Raycast, Vercel dashboard, Arc browser, ChatGPT-native UIs. **Linear and Raycast are notable for their flatness** — depth is communicated via subtle contrast and motion, not shadow halos. Universal full-strength elevation reads as **«older SaaS dashboard»** to this cohort, not «premium». They would call it «overdesigned» or «trying too hard». Halved values + Record Rail dominance is the safer landing for this cohort.

**Divergence:** A wants more depth, B wants less. The halved-values recommendation lands closer to B's threshold while still satisfying A. Full-strength values would tilt toward A and alienate B. Since Provedo's positioning targets both ICPs equally (per design-lock memo) and B is the higher-growth cohort over the next 18 months, **bias toward B's preference: halved values are the correct default**.

## 5. Counter-proposals

1. **Halve all rest-state values universally.** Hover then takes the original full-strength values. This delivers the directive's intent (depth as default) without crossing into «floaty SaaS dashboard» — and preserves Record Rail dominance. Spec change: rest = `translateY(-1px) + 0 4px 12px rgba(0,0,0,0.3)`; hover = `translateY(-2px) + 0 8px 24px rgba(0,0,0,0.4)` (current hover values).

2. **Tier 3 (chrome) gets a tighter scope:** drop `.d1-disclaimer-chip` from the pass entirely (HOLD); flatten `.d1-pill--active` (HOLD); flatten `.d1-segmented` container (CAUTION → flat). The remaining chrome selectors (`.d1-nav__icon-pill`, `.d1-nav__avatar`) ship at halved values.

3. **AI insight rows (`.d1-insight`) stay flat — full stop.** This is a brand-DNA boundary: the Record Rail's whole authoring rationale was a flat editorial register. If insights elevate, the Rail's signature value collapses. Bump rail line opacity from 0.3 → 0.4 to compensate for any nearby panel-level elevation contrast.

4. **Regulatory boundary preserved:** `.d1-disclaimer-chip` remains visually subordinate to its sibling pills — flat or with a -2px inset shadow only (debossed, not embossed). This is a Lane-A defence-of-design choice, not aesthetic preference. Document the rationale in the implementation spec so future contributors don't «unify» it later.

## 6. Top 3 risks if PO ships product-designer's spec as-is (assumed full-strength all-tier)

1. **Originality regression — HIGH.** The Record Rail (Fix #2 signature) loses visual primacy when every panel/card/chip floats with `0 8px 24px` shadow. We re-enter «every dark dashboard 2024-26» territory through the depth axis after exiting it through the saturation axis. The single most important brand-distinctive asset gets demoted to ornament. **Probability: high if values aren't halved.**

2. **Lane-A regulatory framing risk — HIGH.** If `.d1-disclaimer-chip` lifts and shadows alongside `.d1-chip-premium`, the disclaimer reads as a feature-marketing chip, not chrome-level regulatory disclosure. In an FCA / MiFID II audit scenario or a regulator screenshot, the visual hierarchy is the disclaimer's defence — make it look like a marketing badge and the defence «this is built into the product chrome» weakens. **Probability: certain if chip is included in pass.**

3. **AI-feed mental-model regression — MEDIUM-HIGH.** Lifting `.d1-insight` rows reactivates the chat-row affordance (rows-as-elevated-cards = chat-bubbles). The whole point of the Record Rail + flat-editorial-note format was to escape the chat-back affordance flagged by brand + content + UR in the original review. Elevation reintroduces the «I can reply here» visual cue — the very mental model Provedo's positioning explicitly refuses («push-only insights», «AI is a witness, not an advisor»). **Probability: high if insights are included.**

---

## Closing note

The directive is sound — depth as a default is a defensible refinement of D1, and the halved-values approach delivers it without burning the post-fix-pass brand DNA. The three HOLD selectors are non-negotiable for brand+regulatory reasons. The five CAUTION selectors are negotiable on values, not on inclusion.

If product-designer's spec lands as-is at full hover-grade values across all 20 selectors, expect a brand-strategist re-WARN at the next cross-functional review. The recommendation here flips that to SUPPORT.
