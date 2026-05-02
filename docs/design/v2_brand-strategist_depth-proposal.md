# V2 Depth Strategy — Brand-Strategist Independent Proposal

**Author:** brand-strategist agent
**Date:** 2026-05-02
**Status:** Independent proposal (parallel-track; product-designer + frontend-design generalist working in isolation)
**Brief:** "Provedo currently reads visually flat. PO wants embossed/raised feel. Propose what depth-strategy signals «Provedo» given Magician+Sage archetype, Lane A regulatory, editorial-charcoal DNA, and Record Rail signature."

---

## 1. One-paragraph brand stance

Provedo's depth grammar is **printed, not pillowed**. The product is a record — an editorial-charcoal ledger that observes and never advises — and the brand metaphor that already lives in the lock memo is a "paper-press impression on a charcoal sheet." That metaphor commits us to a single answer: depth comes from **the act of pressing into the substrate**, not from lifting cards into the camera. Where most dark-mode SaaS products use multi-layer drop shadows to mimic glass or stage-lit cards, Provedo uses a **debossed/letterpress-impression** language for resting state and a **single, tight, ink-dark shadow** for the rare hover moments — never glow, never multi-layer atmosphere, never glassy frost. The Magician shows up in restraint (wow without trick); the Sage shows up in materials honesty (nothing pretends to float that isn't load-bearing); the Everyman modifier shows up in tactility (the surface feels like an object you can touch, not a chrome that intimidates). Depth is a *trust device*, not a *decoration device*.

---

## 2. Brand precedent research

| # | Brand / convention | What it teaches Provedo |
|---|---|---|
| 1 | **Stripe Dashboard** (2023+ refresh) | Depth as restraint. One soft shadow per card, never stacked, never coloured. Hover often does nothing visual at all. Lesson: in money UIs, *less depth signals more trust*; the team that ships fewer effects looks more confident in the math. |
| 2 | **Linear** | Surface tint > shadow. Linear's "lift" is achieved almost entirely with bg-color steps (page → surface → card → row), with shadows reserved for floating elements (modals, popovers). Lesson: a 3- or 4-step tonal ladder *is* the depth — drop shadow is the exception, not the rule. Provedo already has this ladder (`bg-page → bg-surface → bg-card → bg-card-soft`); we just haven't earned the value out of it yet. |
| 3 | **Editorial paper-press / letterpress** (Mast Brothers, A24 print, NYT Magazine plate-impression covers) | The **deboss** is the signature. When a typeface or mark is pressed *into* paper, the eye reads "permanent record, not screen object." For a product whose archetype is Sage and whose metaphor is "ledger with a Record Rail," the deboss is the brand-correct depth move. Cost: $0 (a single inset shadow); semantic value: enormous — it says "this is on the record." |
| 4 | **Bloomberg Terminal** | Depth via *containment*, not *elevation*. Cells live inside hairline-bordered wells; the depth comes from the hairline, the inset, and the typographic density — no card ever lifts. Lesson: serious-money interfaces signal weight by *not floating*. Our ICP A (28-40, multi-broker, post-burned) lives partly in this taste world; gaudy elevation will read as Robinhood-confetti to them. |
| 5 | **Apple system materials** (macOS Big Sur+ vibrancy, watchOS) | Depth is *system-driven*, never *content-driven*. Sidebars and overlays use vibrancy; in-content surfaces stay flat. Lesson: reserve elevation for *role-based* uses (popovers, modals, transient menus), not for resting content. Don't elevate every card. |
| 6 | **Notion / Obsidian** (the Sage-archetype neighbours referenced in 02_POSITIONING) | Almost zero shadow. Depth is achieved with hairlines, indentation, and typographic hierarchy. The "calm, knows-doesn't-preach" voice has a flat-or-debossed visual analogue. Lesson: our nearest-neighbour brand world treats card-lift as *unnecessary effort* — a tell that the product hasn't earned trust through the content. |

Honourable mentions (one-line lessons, not core precedents): Bloomberg Anywhere (debossed key-caps as a chrome detail), Kraken Pro (single-layer dark cards with 1px borders), Field Notes / Moleskine product photography (the press impression is the brand), and old ledger paper itself (the rule lines and the press indentation are the design system).

---

## 3. Provedo's depth-grammar — committed

**Headline grammar:** *Inset over outset. Hairline over shadow. Typography over atmosphere.*

Specifically, four allowed depth moves and one signature:

### 3.1 Tonal lift (default — 80% of surfaces)
Already in our token set: `bg-page → bg-surface → bg-card → bg-card-soft`. **This is the primary depth language and it is currently underused.** Most "flatness" PO is feeling can be solved here without adding shadows at all. Cards differentiate from page by *bg step + 1px hairline*, not by float.

### 3.2 Letterpress deboss (signature — high-trust surfaces only)
A subtle inset highlight on the top edge + inset shadow on the bottom edge, giving the impression that the surface is **pressed *into* the page**, not lifted off it. This is the brand-distinctive move; it composes with the Record Rail metaphor (rail = ink line *on* paper; card = paper *pressed*). Reserved for: KPI cards, chart panels, the persistent disclaimer chip, the AI insight feed container.

CSS grammar (token-level, leaving exact px to product-designer):

```css
--depth-deboss-rest:
  inset 0 1px 0 0 rgba(255, 255, 255, 0.04),     /* top highlight — paper edge catching light */
  inset 0 -1px 0 0 rgba(0, 0, 0, 0.32);          /* bottom inset — pressed-in shadow */
```

No outer shadow. No translate. The card *is* depressed into the substrate at rest. This is the Provedo signature.

### 3.3 Single-layer ink lift (hover — interactive surfaces only)
When the user *can* act on something, hover may lift — but only with **one shadow, never two; ink-dark, never coloured; tight (≤4px blur), never atmospheric**. PO's `.d1-kpi:hover` recipe (`0 8px 24px rgba(0,0,0,0.4)`) is in the right family but slightly too SaaS-y. The brand-correct hover is closer to:

```css
--depth-lift-hover:
  0 2px 0 0 rgba(0, 0, 0, 0.5),                  /* tight ink baseline — like a card resting just above paper */
  0 4px 12px rgba(0, 0, 0, 0.28);                /* one soft halo, never two */
```

The 2px hard offset is the editorial-print signature ("the page lifted off the press"); the 12px halo is restraint, not glow. **Translate stays at -2px maximum** — anything more reads as toy-bouncy.

### 3.4 Hairline as depth (chrome surfaces — nav pills, segmented, chips)
Pills, segmented controls, chips, the disclaimer chip in resting state: **no shadow, ever**. Active state gets the existing `inset 0 0 0 1px rgba(214,242,107,0.4)` lime-hairline (already locked) — a "stamped" mark, not a lift. This composes perfectly with the Record Rail's lime hairline and reinforces lime as the brand-identity hue.

### 3.5 Glass / frost / multi-layer atmosphere
**Banned.** Not a Provedo move. Reads as Robinhood / fintech-marketing / 2021-era SaaS, all of which are anti-positioning. If a popover or tooltip needs lift, use grammar 3.3 (single ink lift), not blur.

### 3.6 Easing personality
Already locked in tokens (`cubic-bezier(0.16, 1, 0.3, 1)` ease-out-expo @ 200ms). Brand-correct: **decelerating, never bouncy.** A bounce on a hover read as "playful"; Provedo's archetype mix (Magician + Sage primary) wants *deliberate*. Keep current easing; do not introduce spring.

---

## 4. Concrete CSS implications (token grammar, not exact px)

Add to `--d1-*` token block:

```css
/* DEPTH TOKENS — debossed-ledger grammar */

/* Resting depth — debossed ledger card. Default for KPI, chart panel, insight feed. */
--d1-depth-deboss:
  inset 0 1px 0 0 rgba(255, 255, 255, 0.04),
  inset 0 -1px 0 0 rgba(0, 0, 0, 0.32);

/* Soft variant — for surfaces that need presence but where the deboss is too loud
   (e.g. the disclaimer chip on lime-tint, the persistent nav row). */
--d1-depth-deboss-soft:
  inset 0 1px 0 0 rgba(255, 255, 255, 0.025),
  inset 0 -1px 0 0 rgba(0, 0, 0, 0.18);

/* Hover lift — interactive cards only. Single ink baseline + restrained halo.
   Translate is -2px max, ease-out-expo @ 200ms. */
--d1-depth-lift:
  0 2px 0 0 rgba(0, 0, 0, 0.5),
  0 4px 12px rgba(0, 0, 0, 0.28);

/* Pressed/active — the card stamps back into the page (ledger metaphor: pen pressed harder). */
--d1-depth-pressed:
  inset 0 1px 2px 0 rgba(0, 0, 0, 0.4),
  inset 0 -1px 0 0 rgba(255, 255, 255, 0.02);

/* Modal / popover — the only place where multi-layer is allowed, and only because
   the surface genuinely floats above content. */
--d1-depth-floating:
  0 1px 0 0 rgba(0, 0, 0, 0.3),
  0 12px 32px rgba(0, 0, 0, 0.45);

/* BANNED (do not introduce):
   --d1-depth-glow            // no coloured shadows
   --d1-depth-frost           // no backdrop-filter atmosphere
   --d1-depth-stack-3layer    // no 3+ layer drop shadows
   --d1-depth-spring-bounce   // no overshoot easing on hover */
```

Token names match the metaphor (`deboss`, `lift`, `pressed`, `floating`) so engineers reading the codebase understand the brand intent, not just the visual recipe.

---

## 5. Selector-by-selector brand verdict

Format: **GO** = ship the proposed depth treatment · **CAUTION** = land it but with a brand caveat · **HOLD** = explicit reason not to add depth here.

| # | Selector | Verdict | Brand rationale |
|---|---|---|---|
| 1 | `.d1-kpi` (rest) | **GO — apply `--d1-depth-deboss`** | This is the headline ledger card. Debossed = "on the record." Solves PO's flatness complaint at the most visible surface without resorting to elevation. |
| 2 | `.d1-kpi:hover` | **GO — keep translate -2px, swap shadow to `--d1-depth-lift`** | PO's `0 8px 24px` is too SaaS-y; the ink-baseline + restrained halo is the editorial-print read. Translate stays at -2px (Magician restraint, not Everyman bounce). |
| 3 | `.d1-kpi--lime` (rest) | **CAUTION — apply `--d1-depth-deboss-soft` only, drop the inset shadow if it muddies the lime** | Lime is the "look-here" semantic; depth must amplify, not compete. If the deboss reads as dirt on the lime fill in QA, drop the bottom-inset and keep only the top highlight. **Test in real renders.** |
| 4 | `.d1-kpi--portfolio` (the hero card) | **GO — `--d1-depth-deboss` rest, no hover lift** | This card *is* the headline; it shouldn't beg to be clicked. Rest depth, no hover. Confident. |
| 5 | `.d1-kpi--error` (amber-hairline variant) | **GO — keep amber inset hairline + add `--d1-depth-deboss`** | The amber says "stale data"; the deboss says "still on the record." They compose. |
| 6 | `.d1-panel` (chart panel) | **GO — `--d1-depth-deboss`** | Chart panels are persistent data zones. Same ledger grammar as KPI. |
| 7 | `.d1-panel:hover` | **HOLD** | Chart panels are not the primary action surface; the segmented control + chart elements inside take the interaction load. Don't lift the container. |
| 8 | `.d1-disclaimer-chip` | **CAUTION — `--d1-depth-deboss-soft`, *not* `--d1-depth-deboss`** | This is the Lane-A regulatory cure (always-on chrome). It must read as **part of the substrate**, never as a marketing badge. A subtle deboss anchors it as "stamped into the nav." A full-strength deboss or any lift would read as a feature flag, which is a regulatory liability. **See §7 for the full stance — this is the most consequential selector on the page.** |
| 9 | `.d1-pill` (nav, rest) | **HOLD — flat** | Nav pills are tertiary; depth on every pill creates visual noise that the lime active-state can't punch through. Keep flat. |
| 10 | `.d1-pill--active` | **HOLD — keep current lime fill, no added depth** | The lime fill *is* the depth signal. Stamped, not raised. |
| 11 | `.d1-nav__icon-pill` | **HOLD — flat** | Same as 9. |
| 12 | `.d1-segmented` (container) | **GO — `--d1-depth-pressed`** | The segmented sits in `bg-page` (the lowest layer); the pressed inset reinforces "this is recessed into the surface, not floating on it." |
| 13 | `.d1-segmented__btn--active` | **HOLD** | Already has the lime hairline inset. Don't double-treat. |
| 14 | `.d1-chip` (rest) | **HOLD — flat** | Chips are tertiary, repeatable. Depth here multiplies into noise. |
| 15 | `.d1-chip--active` | **HOLD** | Existing lime hairline is sufficient. |
| 16 | `.d1-insight` (single AI insight row) | **HOLD — keep existing 1px hairline divider** | The Record Rail entry tick is the depth signal for an insight. A debossed row would compete with the rail. |
| 17 | The container holding `.d1-insights` (e.g. wrapping card) | **GO — `--d1-depth-deboss`** | Yes deboss the *container*; no deboss the *rows*. The card holds; the rows list. |
| 18 | `.d1-cta` (lime CTA) | **GO — `--d1-depth-deboss-soft` rest, `--d1-depth-lift` hover, `--d1-depth-pressed` active** | The full press-and-release ledger gesture. Magician moment: "the stamp of approval." **Test active state carefully — must feel like ink-on-paper, not a Robinhood "tap."** |
| 19 | `.d1-button` / secondary buttons | **GO — `--d1-depth-deboss-soft` rest, `--d1-depth-lift` hover** | Same grammar as CTA, lower contrast. |
| 20 | `.d1-input` / `.d1-select` / `.d1-textarea` | **GO — `--d1-depth-pressed`** | Form fields are *recessed* by editorial convention; the pressed inset says "ink goes here." |
| 21 | `.d1-tooltip` | **GO — `--d1-depth-floating`** | Tooltips legitimately float above content. The only place multi-layer is brand-correct. |
| 22 | `.d1-modal` / overlay | **GO — `--d1-depth-floating`** | Same as 21. |
| 23 | `.d1-rail` (the Record Rail itself) | **HOLD — flat, never** | The rail is **ink on paper**. It cannot be debossed without breaking its own metaphor (you can't deboss an ink line — the ink would just sit in the depression). The rail is the one element that explicitly opts out of the depth grammar. |
| 24 | Ledger-rule hairlines between data zones (Fix #2 of the 7-fix-pass) | **HOLD — flat** | Same logic as the rail. Hairlines are 2D rule lines, not surfaces. |

**Summary tally:** 11 GO, 3 CAUTION, 10 HOLD. The HOLD list is intentionally long: depth is a finite resource, not a default treatment. Putting depth on tertiary chrome (pills, chips, rows) destroys its semantic value on the surfaces that should carry it.

---

## 6. Record Rail co-existence

The Record Rail is Provedo's signature element (Fix #2 of the 7-fix-pass; the brand-distinctive move that mitigates "every dark-mode SaaS dashboard" originality risk). Any depth grammar that competes with it is brand-wrong by definition.

**The deboss grammar amplifies the rail; it does not compete.**

Why:

1. **Both belong to the same metaphor.** The rail = ink hairline *on* paper. The deboss = the paper itself, *pressed*. They are two reads of the same editorial-print substrate. They reinforce each other; one is the mark, one is the material.
2. **They occupy different visual layers.** The rail is a 1px line + 6×2px tick at full lime saturation, sitting at the *top edge* of every persistent data zone. The deboss is a 1px highlight + 1px shadow at the top and bottom *edges of the card itself*. Stacked: card edge (debossed paper), then rail (ink mark on the paper). This is the editorial truth: you press the page, then you ink the rule.
3. **Visual budget check.** A rail (lime tick + datestamp + hairline) inside a debossed card produces *one* card-edge depth event + *one* rail event. That's 2 visual touches per data zone — well under the 3-touch attention ceiling. If we instead used outer drop-shadows on cards, the rail's 1px lime hairline at 30% opacity would be visually overwhelmed by the shadow halo. Deboss preserves the rail's salience.
4. **Anti-pattern check.** The lime KPI card (`.d1-kpi--lime`) explicitly omits the rail (per `record-rail.tsx` anti-patterns: "Don't use above the lime KPI card — lime hairline on lime fill = invisible"). On *that* card, the deboss is the *only* depth signal — and a soft deboss (per §5 row 3) keeps the lime as the dominant read. Grammar still composes.

**Verdict:** the deboss grammar **amplifies** the rail. Concretely: pair them on KPI cards, chart panels, AI insight containers, and the disclaimer chip (with caveats §7). Forbid depth-stack on the rail itself (§5 row 23).

---

## 7. Disclaimer chip stance — the most consequential selector on the page

This is a *Lane A* regulatory cure (per 02_POSITIONING locked 2026-04-23: "information/education only … positive trust signal"). It is **non-decorative**. It must signal "always-on, structurally-part-of-the-product" — never "feature highlight, marketing badge, or notification."

**Treatment options weighed:**

| Option | What it signals | Brand verdict |
|---|---|---|
| **A. Flat** (current `lime @ 12% bg`, no shadow) | Always-on, but reads as a passive lozenge | Acceptable but bland; doesn't earn its weight on hover/scroll, can be visually skipped. Compliance-OK, brand-meh. |
| **B. Lifted** (drop shadow + translate on hover) | Interactive feature, "click to learn more" | **Banned.** Reads as a marketing badge or beta flag. Regulatory disaster: implies the disclaimer is dismissible or rotates with state. |
| **C. Glassmorphic / frosted** | Trendy fintech, premium-tier signal | **Banned.** Not Provedo's grammar at all (§3.5). Also reads as "premium trust feature" — anti-Lane-A. |
| **D. Debossed-soft** (`--d1-depth-deboss-soft`, no hover, no scale, no transition) | Stamped into the substrate. Permanent. Like a "Read-only" inkstamp on a manila folder. | **Brand-correct. Recommended.** |
| **E. Hard letterpress emboss** (full `--d1-depth-deboss`) | Same metaphor but louder | Too loud for a chip-sized surface; the lime tint at 12% needs the ink shadow to stay subtle or it muddies. Soft variant is right. |

**Recommendation: Option D.** Apply `--d1-depth-deboss-soft` to the disclaimer chip with **zero hover state, zero focus animation, zero scale transition**. The chip should feel less like a UI element and more like *a property of the page itself* — like the masthead of a newspaper or the footer of a contract. This is brand-correct *and* regulatory-correct in one move:

- Brand: "Read-only · No advice" becomes the Provedo equivalent of a printer's mark — quiet, permanent, definitional.
- Regulatory: zero interactivity = zero ambiguity that this is a dismissible feature. EU/UK Lane A reinforcement (per 02_POSITIONING Q6) lands cleanly.

**Confidence: HIGH.** This is the cleanest compliance × brand alignment in the proposal.

---

## 8. ICP A vs ICP B reconciliation

The two ICPs have meaningfully different depth tolerances (per brief: ICP A skews "credible/considered, premium not gaudy"; ICP B skews "flatter, must not feel old SaaS").

| Concern | ICP A (28-40, multi-broker, post-burned) | ICP B (22-32, AI-native, Linear/Raycast/Arc) |
|---|---|---|
| Reaction to letterpress deboss | **Positive.** Reads as Bloomberg/editorial credibility. Old enough to remember Field Notes, magazine covers, considered objects. The deboss says "this product takes itself seriously." | **Neutral-to-positive.** The deboss is subtle enough to read as "thoughtful detail" rather than "skeumorphic throwback." It's not Apple-2010 leather; it's Linear-2025 with extra material. |
| Reaction to single-layer ink hover | **Strongly positive.** Tight ink-dark hover is the Bloomberg/NYT vocabulary. | **Positive.** Linear and Arc both use 1-shadow hovers; this is in-pocket. |
| Reaction to multi-layer atmospheric shadow (banned per §3.5) | **Negative — reads as Robinhood / pre-2022 fintech.** | **Negative — reads as old-SaaS / Bootstrap.** |
| Reaction to glass/frost (banned) | **Negative — reads as marketing-only.** | **Negative — reads as iOS lockscreen, not a tool.** |
| Reaction to coloured / glow shadows (banned) | **Negative — gaudy.** | **Negative — gaming/web3 vocabulary.** |

**Verdict: the proposed grammar lands clean for both ICPs.** This is the strongest result of the analysis: editorial-print + restrained-ink-hover is a vocabulary that Bloomberg-ICP-A and Linear-ICP-B can *both* read as "made by people who care." The bans (multi-layer, glass, glow) are also bans both audiences would issue.

The one place ICPs would diverge is *how much* depth the system uses: ICP A could tolerate slightly more debossed surfaces (they read it as gravitas); ICP B would prefer the system stay closer to Linear's flat-with-tonal-steps. **Calibration call: stay closer to ICP B's tolerance** (debossed grammar reserved for KPI / panel / insight container / CTA / disclaimer chip — i.e. high-trust surfaces only, not every card). This is reflected in the §5 verdicts: 11 GO, 10 HOLD.

---

## 9. Anti-pattern list — "if we ship X, Provedo dies a little"

These are not aesthetic preferences; these are brand-DNA violations. Each one undermines the positioning, the archetype, or the regulatory stance.

1. **Multi-layer atmospheric drop shadows** (`0 4px 8px ... 0 12px 24px ... 0 24px 48px ...` stacked). This is the visual signature of Robinhood, Webull, eToro, and every "AI investing" landing page on the internet. Provedo's anti-positioning explicitly rejects "casino / advice-framed / trade-execution" territory; this shadow language is the visual analogue of those brands. **If a designer or PR designer pushes for "richer depth," this is the first thing they will reach for, and it must be rejected.**

2. **Coloured glow shadows** — purple/lime/amber halos around interactive elements. Reads as crypto-dapp, gaming, or 2021-bull-run novelty-app. Magician archetype is "wow without trick"; coloured glow is "trick without wow." Also: lime-glow on the lime KPI would obliterate the "look-here" semantic that the entire lime-discipline doctrine depends on.

3. **Glassmorphic / backdrop-blur surfaces** anywhere in the product. We are not Apple, we are not a media app, we are a record. A frosted card claiming to be a portfolio summary is a *lie* about the substrate. The Sage archetype demands material honesty.

4. **Animated/pulsating depth on the disclaimer chip** (any state change beyond static rendering). This is a regulatory landmine: any motion or interactivity on the "Read-only · No advice" chip implies dismissibility, rotation, or feature-flag status. The chip must read as architectural, not interactive.

5. **Cards lifted in resting state** (e.g. `box-shadow: 0 4px 12px ...` on every `.d1-kpi` at rest, with no hover involvement). This is the most tempting wrong-answer: "make every card look elevated." It destroys the Record Rail metaphor (the rail sits on paper, not on a stage), it destroys the deboss-as-signature opportunity, and it pushes the product visually toward Robinhood. *Hover* may lift; *rest* must not. Cards at rest are pages on a desk, not playing cards on a felt table.

(Honourable mention: skeumorphic textures — paper grain, noise overlay, "actual paper" textures. These are *also* a brand violation but lower-risk because no one on the team is currently proposing them.)

---

## 10. Confidence on each headline recommendation

| Recommendation | Confidence | Why |
|---|---|---|
| Headline grammar = "inset over outset, hairline over shadow, typography over atmosphere" | **HIGH** | Direct read from positioning + archetype + Record Rail metaphor. Three independent vectors converge. |
| Letterpress deboss as the signature resting-state move | **HIGH** | Composes with rail, fits archetype, lands clean for both ICPs, technically cheap. |
| Single-layer ink hover (no multi-layer atmosphere) | **HIGH** | Bloomberg + Linear + NYT all converge on this. PO's `.d1-kpi:hover` is in the right family; just refine to ink-baseline + restrained halo. |
| Disclaimer chip = debossed-soft, zero interaction | **HIGH** | Brand and regulatory verdicts align unusually cleanly. |
| Pills / chips / nav stay flat | **HIGH** | Depth on every chrome surface destroys depth's semantic value. |
| Form inputs use `--d1-depth-pressed` | **HIGH** | Editorial convention; ink-goes-here metaphor; no downside. |
| Hover translate stays at -2px (no spring) | **MEDIUM-HIGH** | Brand-correct (Magician restraint), but product-designer may push for slightly more on CTA specifically. I would defend -2px on KPI cards strictly; CTA can negotiate. |
| Exact px / opacity values in §3 token block | **MEDIUM** | These are starting points. Product-designer should refine via real renders against the lime palette. The *grammar* is HIGH confidence; the *numbers* are medium until rendered. |
| Visual-budget verdict that 10 of 24 selectors should stay flat | **MEDIUM-HIGH** | I'm confident chrome stays flat; product-designer or generalist may surface 1-2 specific selectors where my hold is too conservative. Easy to negotiate per-selector without breaking the grammar. |

---

## Appendix — One-line distillation for Right-Hand synthesis

**Provedo's depth grammar is "printed, not pillowed": debossed cards on a charcoal substrate, single-layer ink hover, hairline-driven chrome, banned multi-layer atmosphere — depth as a trust device that composes with the Record Rail signature and the Lane-A disclaimer chip.**
