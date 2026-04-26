# Final Design Review — product-designer (independent verdict)

**Author:** product-designer
**Date:** 2026-04-27
**Scope:** Independent visual-quality verdict on the live preview after slice-LP3.2 universals + 3.3 chart upgrade + 3.4 hero polish + 3.5 chrome polish + 3.6 hero L2/L3 retire have all shipped.
**Method:**
1. Form independent judgment FIRST. Walk shipped code top-to-bottom (the live preview at `https://investment-tracker-web-git-feat-lp-pr-7c8919-ruslan-maistrenko1.vercel.app` is gated behind Vercel SSO and could not be rendered headlessly; this review is grounded in the shipped components at HEAD `ad359a6` plus the explicit composition specs that govern them).
2. Cross-check against my own slice-LP3.6 spec, my Phase-2.5 re-evaluation memo, and the Phase-2 synthesis.
3. Score per question. Top-3 remaining issues. Verdict.

**Constraint acknowledged:** preview is auth-walled. I read all shipped surfaces from source — `ProvedoHeroV2.tsx`, `hero/ChatMockup.tsx`, `hero/DigestHeader.tsx`, `hero/CitationChip.tsx`, `Sources.tsx`, `ProvedoNumericProofBar.tsx`, `ProvedoNegationSection.tsx`, `ProvedoAggregationSection.tsx`, `ProvedoEditorialNarrative.tsx`, `ProvedoDemoTabsV2.tsx`, `charts/AllocationPieBar.tsx` — and reasoned about composition + rhythm + a11y from token-resolution-correct typography specs. Where a verdict requires actual rendered observation (e.g. exact 12px gap reads, animation timing on a 60Hz display, specific contrast ratio under final font-rendering), I flag it as «PO-eyes-required» rather than rule.

---

## §1 First impressions on the live preview (3-5 lines per impression)

### What works (top 3)

1. **The Sources primitive is the strongest single composition signal on the page now.** Italic 13px slate-tertiary + dotted top-rule + monospace «SOURCES» eyebrow appears verbatim in the hero receipt, in every demo tab, in §S6 editorial, and on the §S4-Tab4 chart. That single typographic mark is the page's connective tissue — every observational claim wears it. This is exactly what `Sources` was built for in slice-LP3.5 §3.1, and it lands as a system, not as decoration. Brand-strategist's «receipt-chrome as load-bearing visual primitive» verdict gets paid in full here.
2. **The Tab 4 comparison-bars finally serve the chat claim.** Chat says «about 2× the sector's weight in S&P 500 (~28%)» and the chart now ships exactly two horizontal bars — Provedo 58% (teal, highlighted) above S&P 28% (slate, neutral) — on the same horizontal scale. The 58→28 visual gap is doing the load-bearing work the prior bento couldn't. Plus the in-bento data-coherence problem I missed in my prior audit (donut $231k vs broker-sum $312k) is gone — ledger now reads IBKR $31k (AAPL $14k + MSFT $9k + NVDA $8k) + Schwab $5k (GOOG $3k + AMZN $2k), arithmetic matches the chat answer line-for-line.
3. **Hero now reads as one composition, not three.** DigestHeader (eyebrow + tagline) → ChatMockup (typing + sources) → CitationChip (IBKR · Schwab — 2 brokers) is a single typographic-rhythm with 12px gaps throughout, no card-borders separating the three. The mono numeral «3» in the digest visually rhymes with every mono token inside the receipt and with the mono ticker tokens in the chip. The orphan-product-feed-and-orphan-donut-widget problem from pre-LP3.6 is gone.

### What's weak (top 3)

1. **§S2 proof bar Cell IV «Sources / for every answer» now reads slightly redundant against the page.** The page already proves «sources for every answer» visually in five separate places — hero receipt, all four demo tabs, §S6 editorial. By the time the cold visitor reaches the proof bar, the claim is already self-evident. This isn't broken — it's load-bearing belt-and-braces — but on a calm-over-busy page the cell flirts with self-promotion-of-a-thing-the-page-already-shows. It works. It's not the strongest possible cell. Verdict: keep, but flag as candidate for future iteration if a stronger fourth proof cell emerges.
2. **§S2 proof bar coverage cell still reads «100s / brokers and exchanges / every major one» while §S8 says «Hundreds of brokers and exchanges, in one place».** Two different copy registers for the same proof point one viewport apart. «100s» is mono-numeric and reads as a number; «Hundreds» is sans-narrative. The two surfaces should agree — either both numeric («100s» / «100s+») or both narrative («Hundreds» / «Hundreds»). Currently they read as «we couldn't decide which felt more honest». TD-095 is tracking the upgrade to «1000+» — when that lands, both surfaces should align in the same register.
3. **The §S6 editorial Sources line «Pre-alpha JTBD interviews 2026-Q1 · ICP cohort signals» reads more academic than the rest of the receipt-system uses Sources.** Every other Sources mount on the page cites *external observable artifacts* (broker statements, SEC filings, earnings dates, S&P methodology). This one cites *internal research process*. The treatment is identical (italic + dotted top + mono eyebrow) but the *kind of thing being cited* is different. It works as a Sources mount, but the visitor's epistemic register flips from «here's a third-party data trail» to «here's the internal research that drove this brand line». Brand-strategist may have reasons; visually it's a slight register-switch the receipt-system rhythm doesn't quite absorb. Minor.

---

## §2 Hero composition — does it read as ONE receipt-system?

**Verdict: YES, mostly. With one observation.**

Per spec §5.4 the hero should read as «a digest pointer to a specific receipt that cites specific sources from specific brokers» — a single narrative arc top to bottom. The shipped composition delivers this:

- **DigestHeader** sets the frame: «THIS WEEK / 3 observations across your portfolio» — small-caps eyebrow + 14px sans tagline + mono `3`. No card chrome. The mono numeral is the system signature that ties the digest to the receipt below — every numeric token in the chat receipt is mono-set, and `3` matches that treatment.
- **ChatMockup** is the receipt body — the typing animation, the −4.2% answer, the inline mono tokens, the sparkline, and the Sources line at the bottom of the response.
- **CitationChip** closes it: rounded-full pill, white bg matching the L1 elevation (no extra shadow), mono tickers `IBKR · Schwab` + sans suffix `— 2 brokers`. 240ms fade-in fires when typing completes.

The 12px gaps between elements (`gap-3` on the aside) are paragraph-internal spacing, not card-separating spacing. The aside has `min-h-[320px]` and `justify-center` so it vertically centers in the hero row — no awkward top-anchored stack.

**The composition reads as one receipt-system because the three elements share four signals:** mono numerals in all three, paragraph-level spacing not card-level, no chrome between digest and receipt (digest is unframed), and the chip explicitly closes a thread the receipt opened (Sources cite Schwab + AAPL + TSLA → chip names IBKR + Schwab as brokers). Each element answers a question the previous element raised. Single narrative arc.

**One observation:** the chip's 240ms entrance starts at 120ms after the L1 sources line begins — so for a moment the visitor sees the receipt land + the sources line settle + then the chip arrive. In spec §5.4 this was framed as «sources are explained by where they came from». In a 60Hz render with full content this should land in ~360ms total post-typing, well within the 600ms entrance budget. PO-eyes-required: confirm the chip lands as «receipt closure» not as «late afterthought». If it reads late, drop the 120ms delay to 0 and let the chip and the sources line co-arrive.

**Score 9/10.**

---

## §3 Tab 4 comparison-bars — does «58% vs 28%» land as length-difference?

**Verdict: YES.** Strong.

Both bars share `width: 100%` of the surrounding div via the `reveal=1` default in `ComparisonBarRow`. Inside each bar, segments are flex children with `flex: ${pct} 0 0` — so a 58% segment occupies 58% of bar width regardless of which bar it's in, and a 28% segment occupies 28%. The two bars are stacked vertically at `gap: 14px`. Visual length comparison is direct: the teal Provedo segment runs roughly twice as long as the slate S&P segment.

Three reinforcements:

1. **Color hierarchy.** Provedo bar leads with teal accent (highlighted) on the 58% tech segment; S&P bar uses neutral slate-secondary on the 28% tech segment. Teal vs slate is the same brand-vs-benchmark contrast the rest of the page uses (e.g. P&L sparkline). Color reinforces «which one is yours» without color-only-reading dependency (segment labels carry the data inside the bar).
2. **Headline-numeral position.** Each bar's series eyebrow («YOUR PORTFOLIO» mono small-caps) is on the left; the headline («Tech 58%» / «Tech 28%») is on the right, in mono-13px-600. The headline numerals stack vertically and create a secondary visual comparison aligned to the right of the bars — a second way to read the gap.
3. **Segment in-bar labels** show «tech 58%» / «tech 28%» inside the segments themselves at 11px mono — third way to read the gap. The aria-label and the visible mono caption «Tech 58% · Financials 18% · Healthcare 14% · Other 10%» carry the data when JS or CSS unavailable.

The italic «Provedo notices: Your tech weight is about 2× the index's — driven by IBKR.» line below the ledger names the comparison directly in voice. Then Sources mount cites Holdings + S&P methodology. The whole tab-4 surface reads as: claim (chat) → visual proof (bars) → broker breakdown (ledger) → observation in voice (notices line) → sources. Cleanest tab on the page.

**Score 9.5/10.** The half-point I withhold: the segment labels inside the bars («tech 58%», «fin 18%», «hth 14%», «10%») use abbreviated tokens that read slightly cryptic at first glance. «hth» as «healthcare» abbreviation is non-standard; spec §S4 elsewhere on the page spells full sector names. Minor. Could be addressed in a future polish pass if length-budget allows full names inside the bars — but at the current bar height the truncation is reasonable.

---

## §4 Sources primitive everywhere — coherent system or noise?

**Verdict: Coherent system.** Strongest piece of typographic discipline in the redesign.

The `Sources` component appears in:
- L1 hero ChatMockup (after the response paragraph, before the sparkline)
- All 4 demo tab Provedo bubbles (Tab 1 P&L, Tab 2 dividends, Tab 3 trade timeline, Tab 4 inside `AllocationPieBar` next to the comparison)
- §S6 editorial closing block (theme="dark" variant, lighter slate text on dark surface)

Visual contract is uniform across mounts: italic 13px sans + 1.55 line-height + dotted 1px top-rule with 8px padding-top + JBM-mono small-caps «SOURCES» eyebrow with 0.08em tracking + items joined with `·`. The dark-theme variant uses `rgba(203, 213, 225, 0.85)` body text and `rgba(45, 212, 191, 0.85)` eyebrow on slate-900 — preserving the dotted-rule + small-caps + italic pattern, just rebalanced for the dark surface.

This is what a typographic system primitive looks like when it works. Not a reusable wrapper; a load-bearing brand-meaning anchor. Every observational claim on the page wears the same mark. The «citations are how Provedo earns trust» promise becomes a visible, system-level commitment.

The only risk-noise: when there are five Sources lines on one page, repetition can fade into noise instead of reinforcing. Mitigation already shipped: each Sources mount cites *different* sources (broker statements vs SEC filings vs S&P methodology vs JTBD interviews) so the items themselves carry information density even when the eyebrow is identical. The primitive becomes the rhythm; the items become the content.

**Score 9.5/10.** Minor: see §1.W3 above — the §S6 editorial Sources line cites internal research, which is the one mount where the «cite kind» switches register. Acceptable, not perfect.

---

## §5 Negation S3 typographic refactor — Sage gravitas or austere?

**Verdict: Sage gravitas.** Clean upgrade vs the prior lucide-X-icons treatment.

The shipped section: section header «This is what Provedo is not.» (35-50px clamp sans-medium) → first block «WHAT PROVEDO IS NOT» mono small-caps eyebrow + three em-dash bullet rows in slate-secondary noun + slate-muted predicate → mirror block «WHAT PROVEDO IS» same eyebrow style + three plus-sign bullet rows in slate-primary noun (heavier weight 600) + slate-secondary predicate, with plus glyphs in teal. Stack vertical, single column, max-width 640px, centered.

What works:
- **Typographic weight does the lifting that lucide icons used to do.** The negation block is lighter (500 noun weight, muted predicate); the affirmation block is heavier (600 noun weight, secondary predicate). Glyph color shifts (slate-tertiary `—` vs teal `+`) carry the negation-vs-affirmation polarity. No icon library; no color-X anti-pattern.
- **Single column resists pros/cons sales register.** I flagged this in the PD reeval §3.2 and the shipped impl honors it. Two-column would have pulled the section into «features vs not-features» — sales register, off-Sage. Single column reads as «here are three plain truths, then here are three plain truths in the affirmative». Editorial confidence, not comparison-shopping.
- **«Source-keeper»** as the third affirmation noun is voice-correct (brand-voice REJECTed «citer»). «A reader. / A noticer. / A source-keeper.» reads as Sage role-naming, not feature-claim register.

What I'd note:
- **The bullet glyph alignment is `align-items: baseline`** which means the em-dash and the plus sit on the text baseline, not centered to the line-height. At 17px sans body this creates a small visual hop on rows where the predicate has descenders. Minor, deliberate, reads honest — but PO-eyes-required to confirm it doesn't read as misalignment on the actual screen.
- **Section heading «This is what Provedo is not.»** — the meta-header is still present, even though the brand-strategist-flagged «strip the meta-header» note from R3 §6.11 said it could go. The header is doing useful work (orienting the cold visitor before they encounter three negation lines without context) so the keep is defensible. Borderline.

**Score 9/10.** Sage gravitas, not austere. The em-dash glyphs read calm; the teal `+` glyphs in the affirmation block signal «yes, this» without celebration. Single-column rhythm is correct.

---

## §6 Proof bar Cell IV «Sources / for every answer» + footer disclaimer separation — works?

**Verdict: WORKS.** With one rhythm note.

Shipped state at `ProvedoNumericProofBar.tsx`:
- Cell IV body: «Sources» (mono accent-teal, big-numeric-clamp size 36-52px) / eyebrow «for every answer» (mono small-caps tertiary) / sub «cited inline, dated, traceable» (sans-tertiary 13px). The accent-teal on «Sources» is the only place in the proof bar where a big-numeric token uses brand accent — the other three cells use slate-primary. This deliberately makes Cell IV the visual anchor of the bar, which is correct because it's the load-bearing trust signal.
- Below the cells, two italic footer lines:
  1. «Information, not advice.» — italic 14px sans-tertiary, max-width 480px, centered, tracked as `data-testid="proof-bar-disclaimer-footer"`.
  2. «For investors who hold across more than one broker.» — same typography, separate paragraph (mt-3 separation), same max-width.

The two footer lines being **separate paragraphs** (not run-on) is the brand-voice REJECT-WITH-EDIT outcome from the LP3.5 review. Run-on would have read as «Information, not advice. For investors…» — implying the audience-line is part of the disclaimer, which it isn't. Separating them keeps each line's claim discrete: Cell IV claims sources; the disclaimer footer claims «not advice»; the audience-whisper claims ICP scope.

**The Cell IV → disclaimer-footer relationship reads correctly.** The big «Sources» numeric token claims the *positive* epistemic position (every answer is sourced); the italic footer below claims the *Lane A* boundary (information, not advice). Together they form a single Sage-stance: «here's what we provide, and what we don't claim to be». Cell IV no longer carries the disclaimer body (which was the prior conflation), so the visual hierarchy is clean.

**Rhythm note:** the proof bar now contains: 4 cells (numeric + eyebrow + sub) + 1 italic footer line + 1 italic audience-whisper. That's six rows of content stacked in one section. PO-eyes-required: confirm the section doesn't feel over-stuffed at 1024px+ where the cells are horizontal. At smaller breakpoints where the cells stack vertically, six rows may feel long — but each row is short, so it should still scan. If it doesn't scan, the audience-whisper line is the most movable element (could relocate to the hero `aria-label` zone or below the hero CTA).

**Score 9/10.** Strong cell-content + correct visual separation. Half a point off for the rhythm risk on smaller breakpoints.

---

## §7 Marquee → typeset list — improvement or regression?

**Verdict: IMPROVEMENT.** Clear win.

Shipped state at `ProvedoAggregationSection.tsx`: animated horizontal-scroll marquee retired. Replaced with a 3-column grid (2 col on `<sm`, 3 col on `≥sm`) of 12 broker abbreviations in JBM-mono 13px slate-secondary, max-width 640px, centered. Closing line «— and growing» in mono-italic tertiary below.

Why it's an improvement:

1. **Calmer reading.** The marquee asked the visitor to wait-and-watch for the proof. A static list lets the eye scan in 1-2 seconds. R3 «calmer than animated scroll» verdict held.
2. **Honest scope.** 12 abbreviations + «— and growing» reads as «here's a representative set, more exist». The marquee's perceived-scope-via-motion was visual hyperbole; the typeset list is closer to what we can verifiably claim. Especially given the §S2 proof bar cell still reads «100s» (TD-095 tracks upgrade), the §S8 list of 12 + «— and growing» is the most calibrated representation of «we cover many but here are the ones we name».
3. **Bundle + motion budget.** Removing the keyframe `translateX` animation drops a continuously-running compositor task. Within 5-rule compliance either way, but the calmer state is also the lighter state.

**The «— and growing» tail line is brand-voice correct** vs the rejected «100s more» (which would have conflicted with the §S2 «100s» cell). It's a verb-of-Provedo register («growing» as Sage observation of itself) rather than a quantitative-claim register.

**One caveat:** I flagged in §1 above that §S2 says «100s» and §S8 header says «Hundreds» — the two surfaces are now in different registers. That's not a regression caused by the marquee→list move; it's a pre-existing copy mismatch the move surfaces. Not the responsibility of slice-LP3.5 §3.5 to fix; will surface as TD-095 sequel when «1000+» lands.

**Score 9/10.**

---

## §8 Cross-section composition rhythm — does the page read as one composition?

**Verdict: YES, mostly.**

The page now reads as a single restrained composition because of three system-level chrome decisions that LP3.5 + LP3.6 locked in:

1. **The Sources primitive appears at every observational claim.** This is the strongest single rhythm anchor. The visitor's eye learns the pattern (italic sources line + dotted rule + mono eyebrow) at the hero, then re-encounters it in every demo tab + the editorial. Each re-encounter reinforces «this is the system» rather than «another section».
2. **The proof bar's «Sources / for every answer» Cell IV becomes the page's epistemic-spine claim.** The cell has accent-teal treatment that no other proof cell has, so the visitor's eye registers «this is the load-bearing claim of the page» on first glance — and then the rest of the page demonstrates it.
3. **Restraint on motion.** Hero typing → simultaneous demo charts on tab-switch → §S6 editorial fade-in on scroll. No marquee scrolling, no parallax stack, no decorative-only transitions. The rhythm is calm enough that each motion moment becomes meaningful — the typing animation feels like a product moment, not a marketing flourish, because nothing else is competing for the motion budget.

What still has rhythm-friction:

- **§S2 proof bar size + density vs §S3 negation single-column.** §S2 is a wide horizontal band (4 cells + footer + whisper) at proof-bar height. §S3 is a narrow centered max-w-640px column. The transition from S2 to S3 is a width-snap from full-bleed to constrained. Functional (it differentiates the sections) but the page's horizontal rhythm jolts there. Minor; PO-eyes-required.
- **§S6 dark editorial → §S7 testimonials → §S8 broker list → §S9 FAQ** is the page's longest stretch without a chart or product surface. Four typography-only sections in a row. Honest restraint, or attentional fatigue zone? Below-the-fold weight matters less for cold-traffic conversion (most readers won't reach §S6+), but for press / brand-press cohort (R2 alt-cohort) this stretch is where they form their «is this a serious tool» judgment. Currently reads serious; PO-eyes-required to confirm it doesn't read sparse.
- **The §S6 «You hold the assets. Provedo holds the context.» closing line + §S10 «Open Provedo when you're ready.» CTA** are voice-rhymed correctly (R3 §6.23) but visually they're both centered single-line typography on dark slate-900 backgrounds. The visitor sees a dark editorial moment at S6, then four lighter sections, then another dark editorial moment at S10. The bookending creates a frame. Works.

**Score 8.5/10.** The page now reads as one composition through the Sources primitive + restraint discipline. Two minor friction points (S2→S3 width-snap, S6→S9 typography-stretch) keep it short of 10.

---

## §9 What's still weak — top 3 issues remaining

### Issue 1 (HIGH) — §S2 «100s» vs §S8 «Hundreds» copy register mismatch

**Severity:** HIGH (visible inconsistency one viewport apart).

The proof bar Cell I shows mono-numeric `100s` with eyebrow «brokers and exchanges». §S8 broker section header reads «Hundreds of brokers and exchanges, in one place». Two registers for the same proof. Cold visitor reading top-down sees `100s` then later sees «Hundreds» — registers as «we couldn't decide which was more honest».

**Why it ships now:** TD-095 is tracking the upgrade to «1000+» once tech-lead verifies SnapTrade + Plaid + CCXT broker coverage. The mismatch will resolve when both surfaces upgrade together.

**Why it's still a HIGH:** until TD-095 resolves, the inconsistency is visible. Either one surface should be aligned to the other in the interim, or both should hold consistent language.

**Recommendation (flag, not new spec):** in slice-LP3.7 if TD-095 isn't ready, align §S8 header to «100s of brokers and exchanges, in one place» so both surfaces use the mono-numeric register. Then both upgrade to «1000+» simultaneously when verification lands.

### Issue 2 (MEDIUM) — Hero text column is heavy on the left at md+ vs the receipt-system right column

**Severity:** MEDIUM (composition-level, not load-bearing for first-impression).

The hero's left text column at lg+ is `lg:max-w-xl lg:text-left` with: H1 (60px clamp) + sub (20px) + CTA + small-print. Total visual weight is high. The right-column aside is `min-h-[320px]` with: DigestHeader (small) + ChatMockup (~280px) + CitationChip (~32px). Total visual weight on the right is moderate-to-low at 1440px+.

Pre-LP3.6 the right column had three product mockups (chat + insight feed + broker pie at ~520px+ stacked). The retire was correct — three mockups created the asymmetric-credibility problem named in PD reeval §0 Finding 3 — but the consequence is the right column is now visually lighter than the left. The 12px gaps between the three receipt-system elements are correct *internally* but mean the column doesn't fill height the way three stacked surfaces did.

**Manifests as:** at desktop+ the hero looks slightly text-heavy — the eye pulls left because the H1 dominates. Receipt-system on the right does its job (signals «product runs, sources cite»), but the visual weight isn't quite balanced.

**Why it ships now:** the alternative (filling the right column with more chrome to match left-column weight) would re-introduce the 3-mockup problem. The receipt-system is correctly weighted *for what it claims*; the imbalance is between «hero copy claim» (heavy) and «hero product proof» (calm). Sage register correctly subordinates product-flex to brand-claim, so the imbalance is in-character.

**Recommendation (flag, not new spec):** PO-eyes-required at 1440px+. If imbalance reads broken, options are (a) tighten H1 copy to one line at lg+ instead of two, (b) center-align the H1 + sub at lg+ to share width with the receipt-system, or (c) accept the deliberate imbalance as «hero claim leads, product proof follows» Sage register. My preference: (c) accept as-is unless PO finds it visually unsatisfying.

### Issue 3 (MEDIUM) — §S6 editorial Sources mount «Pre-alpha JTBD interviews 2026-Q1 · ICP cohort signals» switches Sources register

**Severity:** MEDIUM (system-coherence at the edge).

Every other Sources mount on the page cites *external observable artifacts*: broker statements, SEC filings, S&P 500 methodology, AAPL Q3 earnings dates. These are things a visitor could in principle verify or look up.

The §S6 editorial Sources mount cites *internal research process*: pre-alpha JTBD interviews + ICP cohort signals. These are things only Provedo can attest to. The visitor's epistemic register switches from «here's a third-party data trail» to «here's the internal research behind this brand line».

The treatment is identical (italic + dotted rule + mono eyebrow + dark-theme rebalance) so the *form* of the system holds. But the *kind of cite* breaks the pattern — the rest of the page trains the visitor to expect external citations, and this one mount delivers internal citations.

**Why it ships now:** the §S6 editorial is the page's most-Sage moment (slate-900 full-bleed, oversized typography, brand-promise prose). Holding back the Sources mount would have left the editorial uncited — and the brand-strategist's «every observation cited» promise would have a hole exactly where the brand-promise reaches deepest. Citing the internal research is the honest move; the alternative (citing nothing) would be worse.

**Recommendation (flag, not new spec):** acceptable as-is. If a future polish pass introduces external citations to the §S6 editorial (e.g. specific public reports on retail-investor multi-broker-aggregation), swap them in. Until then, the internal cite is honest and brand-coherent even though it's a slight register-switch in the cite-system.

---

## §10 Vs Phase 2 synthesis goals — did we achieve Option D + chrome-system layer? Score 0-10.

**Verdict: 8.5/10.** Achieved the chrome-system layer (Phase 2.5 D-prime) cleanly. Option D is the synthesis-decided posture (per PO directive 2026-04-26 to ship the converged plan); we shipped it with one composition gap remaining.

What «Option D + chrome-system layer» meant from the synthesis:

1. **Chrome-system layer (D-prime).** The brand-strategist's verdict that receipt-chrome is the load-bearing visual primitive — i.e. every observational claim on the landing wears the same Sources treatment, the cite-trail reads as a system, the trust-signal is structural rather than decorative. **SHIPPED.** Sources primitive is the page's strongest typographic-system commitment. 9.5/10 (per §4 above).

2. **Tab 4 chart serves the chat claim.** The PD reeval §2 verdict that the comparison between «your tech 58%» and «S&P 28%» must be visualized literally, not via donut+broker bento. **SHIPPED.** Comparison-bars at 58 vs 28 on the same horizontal scale + Sources mount + Provedo notices line + accounts ledger. 9.5/10 (per §3 above).

3. **Hero composes as one receipt-system.** Retire L2/L3, replace with DigestHeader + CitationChip, three elements as one composition. **SHIPPED.** 9/10 (per §2 above) — single observation about chip-entrance timing only.

4. **Negation S3 typeset cleanup.** Drop lucide icons, single-column. **SHIPPED.** 9/10 (per §5 above).

5. **Proof bar disclaimer move + Cell IV reclaim for «Sources for every answer».** **SHIPPED.** 9/10 (per §6 above) — minor rhythm risk at smaller breakpoints.

6. **Marquee→typeset list with «— and growing».** **SHIPPED.** 9/10 (per §7 above).

7. **Page-level composition rhythm reads as one system.** **MOSTLY SHIPPED.** 8.5/10 (per §8 above) — S2→S3 width-snap and S6→S9 typography-stretch are minor frictions.

**Where we fell short:**

- **§S2 vs §S8 «100s» vs «Hundreds» copy mismatch** is unresolved (Issue 1 above) — TD-095 dependency, but the surface inconsistency ships visible.
- **Hero left-column vs right-column visual weight balance** at lg+ is an open composition question (Issue 2 above) — Sage register correctly subordinates product-flex to brand-claim, but PO-eyes-required to confirm the deliberate imbalance reads as discipline rather than emptiness.
- **§S6 Sources cite-register switch** (Issue 3 above) — minor edge-case in the chrome-system.

**Score 8.5/10.** This is a strong achievement vs the Phase 2.5 D-prime spec. The chrome-system layer is intact end-to-end. Tab 4 finally serves the chat. Hero is one composition. Three of three load-bearing redesign goals shipped at 9+ each. The 1.5-point shortfall is two minor frictions and one TD-tracked copy mismatch — none of them blocking, all of them addressable in a slice-LP3.7 polish pass if PO chooses.

---

## §11 Verdict

**SHIP-WITH-MINOR-FIXES.**

The page is materially better than v3.1 across every load-bearing axis: the chrome-system is real, the chart serves the claim, the hero is one composition, the negation reads as Sage gravitas, the proof bar's epistemic spine is in place, the marquee is calmly typeset, the rhythm holds. This is the best the landing has read since redesign began.

**Minor fixes recommended before final lock (in priority order):**

1. **(HIGH, Issue 1)** §S2 vs §S8 register mismatch — align in interim if TD-095 isn't ready (`100s` everywhere or `Hundreds` everywhere; pick one until upgrade lands).
2. **(MEDIUM, Issue 2)** PO-eyes-required at 1440px+ on hero left-column-heavy vs right-column-light visual weight. If imbalance reads broken, flag for slice-LP3.7; if it reads as Sage discipline, accept.
3. **(MEDIUM, Issue 3)** §S6 Sources cite-register switch — acceptable, monitor for future external-citation upgrades.
4. **(LOW)** PO-eyes-required on chip 240ms entrance timing — confirm chip lands as «receipt closure» not «late afterthought». If late, drop the 120ms delay.

**None of the four are ship-blocking.**

---

## §12 What PO should specifically check during preview review

1. **Hero rhythm at desktop (1440px+).** Does the left column (H1 + sub + CTA + small-print) visually balance against the right column (DigestHeader + ChatMockup + CitationChip)? Or does the right column read as «under-filled» now that L2/L3 are retired? See Issue 2.
2. **CitationChip entrance timing.** Watch the hero load. Does the chip arrive feel «receipt closes correctly» or «late afterthought»? See §2 final paragraph.
3. **§S2 proof bar cell rhythm at the breakpoint where cells stack vertically.** With 4 cells + footer + whisper = 6 stacked rows, does the section feel calm or stuffed? See §6 rhythm note.
4. **§S2 «100s» vs §S8 «Hundreds» reading top-to-bottom.** Does the copy register feel inconsistent? See Issue 1.
5. **§S6 dark-editorial → §S7-S9 typography stretch.** Four typography-only sections in a row (S6 dark editorial → S7 testimonials → S8 typeset broker list → S9 FAQ). Does this stretch read as restrained gravitas or as attentional fatigue? See §8 rhythm note.
6. **Tab 4 comparison-bars segment labels.** Inside the bars, abbreviations «tech 58% / fin 18% / hth 14% / 10%» — does «hth» as healthcare abbreviation read OK? See §3 last paragraph.

---

**END 2026-04-27-final-design-review-product-designer.md**
