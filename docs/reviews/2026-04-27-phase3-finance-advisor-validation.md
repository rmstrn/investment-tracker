# Phase 3 Finance-Advisor Validation — Provedo Landing v4 Redesign Synthesis

**Author:** finance-advisor (internal SME, NOT registered investment advisor)
**Date:** 2026-04-27
**Dispatched by:** right-hand (Phase 3 parallel multi-specialist validation)
**Source artefact:** `docs/reviews/2026-04-27-redesign-synthesis-product-designer.md`
**Independent of:** right-hand's preliminary weighted recommendation for Option A (read but pressure-tested, NOT deferred to)
**Skills applied:** `finance-skills:saas-metrics-coach` (Free-tier 50-Q math), `c-level-skills:cfo-advisor` (commercial-pressure read on hero pricing), `everything-claude-code:product-lens` (ICP-A cohort fit pressure-test), `quantitative-trading:risk-metrics-calculation` (no math content needed; copy-only)
**Constraints respected:** Rule 1 (no spend), Rule 2 (no comms), Rule 3 (independent verdict), Rule 4 (no naming of rejected predecessor)
**Status:** independent verdict; right-hand to synthesize alongside parallel specialists

---

## §1 Executive verdict

**SUPPORT-A** with two concrete patches required and one rejected sub-element.

Option A is the financially correct call from finance-advisor's domain perspective. Reasoning in §2-§5; the verdict survives independent pressure-testing of the synthesis's preliminary recommendation. **Two of the four open questions for finance in §6 of the synthesis surface real risks** — the time-anchor sub-line is honest given existing S7 production copy («I check the weekly feed for five minutes Sunday morning» — `landing-provedo-v2.md` line 282), but the **proof-bar $9/month price-on-hero cell (Options B + C) reads commercial-pressure** and should be **rejected even if PO chooses Option B or C**. Option C's negation-led hero **does materially depress conversion among ICP-A productivity-native millennial** — the regulatory-aware reframe («finally, a tool that won't pretend to be an advisor») is a real cohort but is **5-10% of cold traffic at most**, not the load-bearing 80%.

I also propose **Option D as a serious alternative**, not as a rhetorical move. See §6.

---

## §2 Question-by-question independent ruling

### Q1 — Option A time-anchor sub: «Five minutes a week. Every broker. Every position.»

**Verdict: SUPPORT, with one sourcing observation.**

**Over-promise check:** «Five minutes a week» is a **reading-time anchor**, not a usage-time anchor. The distinction matters. The promise is «you can scan everything that moved in five minutes», not «you can manage your portfolio in five minutes». The S7 builder testimonial at `landing-provedo-v2.md:282` already establishes the same honest frame in production copy: «I check the weekly feed for five minutes Sunday morning. Everything that moved is in one place. That's the whole product for me.» Promoting this from testimonial to sub-line is internally consistent with already-shipped honest framing. **No false-promise risk.**

**FOMO check:** Cadence is *weekly*, not *daily* / *real-time*. This is the **anti-FOMO pole**. Compare to my 2026-04-26 review §4 critique of «daily insights» (which I patched to «insights when they matter»); a weekly time-anchor is structurally the strongest possible anti-day-trader recruitment signal. PASS.

**Day-trader recruitment check:** «Five minutes a week» is **structurally repellent to day-traders**. Day-trader cohort wants real-time alerts, intraday flow, sub-minute responsiveness. A weekly reading-time promise filters them out at the hero. This is **anti-pattern-prevention as positioning copy** — same family of move as the §S3 negation lines. PASS.

**Honesty vs Free-tier 50-Q allocation:** This is the question the synthesis surfaces and it deserves the math. 50 questions/month ÷ 4.33 weeks ≈ **11.5 questions per week**. At ~15-30s reading time per response, that's **3-6 minutes of reading time per week** for a fully-engaged Free user. The «five minutes a week» claim is therefore **literally honest** at the Free tier — a Free user who maxes their allocation reads ~5 minutes/week of Provedo output. Plus tier (unlimited chat) by definition exceeds the floor. **The sub-line is mathematically defensible at both tiers.**

One nuance: «Five minutes a week» refers to *reading time*, but the hero implies it covers «every broker, every position». For ICP-A holding 2-5 brokers with 30-100 positions each, *all observations across all positions* in 5 minutes implies dense pre-aggregation by Provedo (which is the actual product). The promise is **operationally true** for ICP-A typical scale — `landing-provedo-v2.md` Tab 1 demo shows exactly this kind of dense multi-position summary in a single response. PASS.

**Stripe-imperative cadence drift check (R3 §11.Q1, brand-voice-curator's territory):** «Every broker. Every position.» — finance-advisor not domain-owner here. Flagging that this is brand-voice-curator's call, not mine. From finance angle: the cadence does NOT trigger performance-claim gradient (it does not say «every gain» or «every alpha» — both of which would trip my Lane A monitor). PASS finance gradient.

**One observation:** «Every position» includes positions the user holds in any broker — this is a **scope claim**, not a performance claim. If interpreted by a regulator-adjacent reviewer as «Provedo will analyze every position individually», the operational truth is yes — Provedo's chat surface does answer per-position questions. No stretch. PASS.

### Q2 — Option B audience-headline: «For investors who hold across more than one broker.»

**Verdict: WARN — borderline, see synthesis §3 Lane A risk gradient (+1 personalization-drift).**

**ICP-narrowing vs personalization-drift:** This is exactly the question the synthesis flags at +1 personalization-drift in its own table. Finance-advisor agrees with the synthesis's read but adds nuance.

The line **«For investors who hold across more than one broker»** is **descriptive ICP-naming**, not personalization. It describes a *condition* (holds multi-broker) that the visitor self-identifies with or doesn't, identical in structure to Kubera's «for those who manage their own wealth». Kubera's line has been in production for 2+ years with no regulatory pushback that I can find in public trade press. **Descriptive ICP-naming has weak Lane A precedent against it.**

However, the gradient *is* real. Compare:
- DESCRIPTIVE (PASS): «For investors who hold across more than one broker.»
- BORDERLINE: «Built for serious multi-broker investors.» (the «serious» implies normative judgment, drift toward «smart investor» / «better habits» Lane A drift — see Sharesight precedent in R2 §2.6)
- ADVISORY (FAIL): «If you hold across multiple brokers, here's what you should do.» (prescriptive, breaks Lane A)

Provedo's Option B variant sits in **DESCRIPTIVE** quadrant. Lane A passes. **+1 personalization-drift in synthesis's table is correctly flagged but not blocking.**

**«Every position. Every dividend. Every drawdown.» scope-cadence check:** This is the more interesting half of the question. The cadence is observation-list, not performance-list. «Drawdown» is the sensitive word — it's a **historical observation** (drawdowns are measured, not produced), so saying «every drawdown» is reportorial, not predictive. Compare to forbidden cadence: «every gain, every loss avoided» (alpha-generative implication, breaks Lane A). The Option B cadence stays on observation side. PASS.

**Performance-implication risk:** I do not read the cadence as performance-implication. «Every position» = scope, «every dividend» = calendar event observation, «every drawdown» = historical price observation. None implies Provedo *produced* anything; all imply Provedo *noticed* something. Sage register held.

**Net Q2 verdict:** Not blocking. If PO chooses Option B, brand-voice-curator should rule on whether the present-tense upgrade «leads» (vs current locked «will lead») is acceptable — that's brand territory, not finance.

### Q3 — Option C negation-led hero: cohort-conversion impact

**Verdict: REJECT for ICP-A primary cohort. Conversion-depressing.**

This is the load-bearing question. I'll separate the two reads the synthesis poses:

**Read 1 — productivity-native millennial sees «Provedo will not tell you what to buy» as «Provedo is less powerful than Getquin/Magnifi»:**

This is the **majority read** for ICP-A cold traffic. Reasoning:

1. **Genre-conventions matter at the 8-second-bounce-decision moment.** ICP-A productivity-native millennial has been trained by Notion / Linear / Cursor / Granola / Lovable that the hero **declares capability**, then the page demonstrates it. A hero that opens with three negations *before* declaring capability **violates AI-tool genre conventions** and reads as *defensive*. R1's audit set (Anthropic, Granola, Cursor, etc.) shows 0/8 lead with negation. The synthesis correctly notes 0/7 fintech direct competitors lead with negation either. Provedo would be the **only fintech-AI tool in the entire R1+R2 corpus leading with negation.** This is differentiation-by-isolation — and isolation cuts both ways.

2. **«Provedo is not a robo-advisor»** — *the productivity-native millennial does not know what a robo-advisor is in 2026.* Robo-advisor is a 2014-2018 fintech category term (Wealthfront, Betterment) that has largely faded from millennial consumer awareness. To a 28-year-old SaaS PM who's never managed a 401(k) outside of Vanguard auto-allocation, «robo-advisor» reads as *a category they don't recognize being denied*. The negation lands as confused, not as clarifying. The Lane A insider-cohort that recognizes the term and reads it as «finally, an honest tool» is real — but per R2 §2.4 the regulatory-aware fintech-Twitter cohort is small (Getquin's «expert advice» drift has not visibly cratered Getquin's 500K user base, suggesting the cohort that *cares* about Lane A discipline is a minority of cold traffic).

3. **Productivity-native millennial cohort psychology with «not» framing:** B2B SaaS productivity-native users have been trained by their genre to read negation copy as either (a) competitive-attack («unlike Salesforce we don't make you...») or (b) defensive disclaim («not a magic AI assistant, just a tool»). Neither is what Option C wants. The intended read («confident enough to refuse the genre») requires the visitor to *already understand the genre being refused* — a meta-read that takes 2-3 paragraphs of education to land, not 8 seconds.

4. **Cold-traffic conversion estimate (note: prediction, no data — I'll be specific about the floor and ceiling):**
   - Best case (regulatory-aware cohort dominates first traffic): -5% to -10% conversion vs Option A (some bounce on confused negation read; offset by deeper engagement among the cohort that *does* land it).
   - Median case: -15% to -25% conversion vs Option A (most bounces are «I don't get it, next tab»).
   - Worst case (productivity-native millennial reads «less capable than Getquin»): -30% to -40% conversion vs Option A.
   - **No upside conversion case exists where Option C beats Option A on cold-traffic conversion.** The upside of Option C is brand differentiation / press cycle / Lane A-aware cohort over-indexing — all of which are lifetime-value or category-press effects, not conversion effects.

5. **«Hardest-to-reverse» factor (synthesis trade-off #2 on Option C):** Finance-advisor confirms — once a brand has shipped «Provedo is not a robo-advisor / not a brokerage / will not tell you what to buy» as the hero opening line, retreating to a capability-led hero in v5 reads as *the brand walked back its own confidence*. This is a **highest-cost positioning move on the page** with no cold-traffic conversion data to justify the lock-in. Pre-alpha is the worst possible time to make this lock-in commitment.

**Read 2 — regulatory-aware cohort sees «finally, a tool that won't pretend to be an advisor»:**

This cohort is real and vocal, but per R2 §2.4 + §2.5 evidence, **it is not the conversion-driving cohort for any of the 7 direct fintech tracker competitors.** Snowball, Kubera, and Wealthfolio are all Lane-A-clean (score 0); none uses the negation-led hero. Kubera is the closest — and Kubera makes anti-advisor a tagline («Skip the middleman»), but **Kubera's hero opens with «The Balance Sheet for those who manage their own wealth.»** Capability-first, then anti-advisor as flavor. **Even Kubera doesn't lead with negation**; it leads with audience-named capability. Option C is more aggressive than Kubera on negation-promotion.

**Net Q3 verdict:** Option C **does** depress conversion among ICP-A. The synthesis's Lane A discipline strengthening (-1 implicit-rec drift to 0) is a real upside, but the conversion cost is asymmetric. Pre-alpha with no cold-traffic data, the rational play is **don't take the lock-in commitment until you have data to justify it**. If PO is committed to negation-forward as a brand-territory move, fine — but it should be a deliberate brand bet labeled as such, not a positioning safety play.

### Q4 — Universal: $9/month price-on-hero cell (Options B + C proof bar)

**Verdict: REJECT for proof-bar position. Reads commercial-pressure (anti-Sage). Belongs in FAQ Q4 + pre-footer small-print, NOT in proof-bar above the fold.**

This is the question I most strongly disagree with the synthesis on. Both Option B and Option C add a `$9/month` cell to the proof bar. The synthesis cites R2 §7.Adopt-1 (Kubera + Sharesight pattern) as evidence for this move. Finance-advisor's read:

1. **Kubera's $250/year tagline is in-character for HNW-positioned premium product.** Kubera makes the price the *positioning move* itself — «$250 a year. Whether you have $250K or $2.5 billion.» — flat-fee anti-1%-AUM positioning. The price IS the differentiation. Provedo's $9/mo is **not** the differentiation. Provedo's differentiation is Lane A + chat-first + multi-broker context. Putting $9/mo in proof bar surfaces a price anchor that does not advance Provedo's positioning.

2. **Sharesight's pricing-on-landing is in /pricing nav, not in proof bar.** Per R2 §2.6, Sharesight has «$7/mo Starter · $18/mo Standard · $23.25/mo Premium» on a /pricing landing — not on the proof bar above the fold of the main marketing page. The synthesis's R2.Adopt-1 read conflates these two patterns. **Sharesight does not put price on hero proof bar.**

3. **Sage register and price-anchor incompatibility.** The Sage archetype's voice fingerprint is *patient, observational, agency-preserving*. Surfacing a $9/mo number in the proof bar is **transactional register** — it reads «here's the price of access», which is the kind of subtle commercial-pressure cue that productivity-native millennial cohort recognizes as marketing-cadence. Compare to v3.1 cell #5 «$0 free forever, no card» — this is **friction-removal**, not **pricing**, and it reads as Sage-helpful (we removed the obstacle for you), not Sage-transactional (here's what we charge).

4. **The «$0 free forever» cell already does the price anchoring work.** A visitor who sees «$0 free forever, no card» understands implicitly that there is an upsell path. Adding «$9/month» on the same proof bar **does not increase trust** — it surfaces commercial intent that the visitor would have inferred anyway, and it does so at the most attention-precious surface on the page. **Net cognitive load increase, zero positioning benefit.**

5. **The right placement for $9/month is FAQ Q4 (already shipped per v3.1 finance/legal patches) + pre-footer CTA small-print.** A visitor who has scrolled past the demo, the editorial mid-page, and the testimonial section is by then **price-curious**, not **conversion-deciding**. That's where pricing answers belong. Proof-bar placement is wrong.

**Net Q4 verdict:** $9/month price-on-hero is **anti-Sage commercial-pressure** at the proof-bar surface. Reject for B and C. Keep $9/mo in FAQ Q4 only (already shipped), and consider adding to pre-footer CTA small-print as a low-key reference. **This is a finance-advisor patch that should override the synthesis recommendation regardless of which option PO chooses.**

### Q5 — Meta-question (my own): is there an Option D?

**Verdict: YES. Option D is the financially most-defensible path. Synthesis omits it.**

**Option D — «Universal-7 patches as v3.2; defer A/B/C until cold-traffic data.»**

The synthesis's §5 «Common across all three options» enumerates 7 patches that ship in any of A, B, or C:

1. Replace bracketed-placeholder demo content with Granola-grade fully-written example output (R1 §4.R1)
2. Three-layer disclaimer pattern (R3 §9) — legal-advisor sign-off required
3. Footer waitlist trial-CTA leak fix (R3 §8.M3)
4. Single weighted testimonial + «alpha quotes coming Q2» line (R3 §6.20)
5. Drop «Lane A —» prefix from proof bar cell #4 (R3 §8.M4)
6. Add audience-whisper line «For investors who hold across more than one broker» (R1 §4.R3 + R2 §7.Adopt-4)
7. v3.1 finance/legal patches at commit `8cb509b` — held in all three options

**These 7 patches are research-validated in three independent reports (R1, R2, R3) AND non-disputable in their own right.** Shipping them as v3.2 produces a measurably better landing without making any of the strategic-posture commitments A/B/C demand.

**Why Option D is financially saner than picking A/B/C blind right now:**

1. **No cold-traffic data exists yet.** PR #65 ships v3.1; v3.2-with-the-7-patches could ship 1-2 weeks after. Then **4 weeks of cold-traffic data** (organic search referrals + any low-cost shareback channels PO does himself) gives finance-advisor + user-researcher real data to evaluate which strategic posture (A vs B vs C) the cohort actually responds to. The synthesis itself notes (in Option C trade-off #2) that «hardest to reverse» is a real cost; Option D is a **option-value play** — keep the strategic-posture optionality open until the pre-alpha cohort signal arrives.

2. **Scope estimate Option D ≈ 12-18h** (smaller than Option A's 18-28h because it omits the «Granola-grade demo content rewrite» content-lead burden — that's the heaviest single lift in A and is the exact item that benefits most from cohort feedback before commit). Could ship as **single PR** like Option A. Lowest execution risk of any option on the table.

3. **Preserves the locked hero.** Option D doesn't touch the 2026-04-25 hero lock at all — no political cost of reopening a 2-day-old PO-locked decision.

4. **Compounds with the existing v3.1 finance/legal patches at `8cb509b`.** PO already invested in the v3.1 patch cycle (which I co-authored 2026-04-26); Option D extends that work pattern naturally. A/B/C all require **resetting** the development tempo to a redesign cycle.

5. **The 7 universal patches close the highest-leverage research findings.** R1's #1 recommendation (Granola-grade content), R3's #1 microcopy bug (footer CTA leak), R2's #1 adoption pattern (audience-whisper line) — all in. Strategic-posture choice (show / tell / refuse) becomes a **second decision after the universal patches land + provide a baseline**, not a coupled decision.

6. **Counter to «Option D defers a real decision»:** the strategic posture is *itself* the decision being made too early. With pre-alpha + zero cold-traffic data, choosing «show vs tell vs refuse» is choosing without information. Option D buys 4 weeks of information for ~12-18h of work.

**Net Q5 verdict:** Option D is the financially correct path. If PO is willing to delay the redesign-decision moment until v3.2 has cold-traffic data, **Option D > Option A > Option B > Option C** on a financial-rationality axis. If PO is not willing to defer (timing constraint, brand momentum, narrative coherence at fundraise time), then Option A is the next best.

---

## §3 Top 3 finance-domain risks across the chosen path

Assuming PO accepts the SUPPORT-A or SUPPORT-ALT-D verdict, the top three risks are:

**Risk #1 (HIGH) — «5 minutes a week» drift surface in §S2 proof-bar revision.** The synthesis's §S2 cell #3 swap (drop «4 demo scenarios», add «5 minutes a week») was the patch I recommended in 2026-04-26 review §3 — I support it. But: the proof-bar version is **«5 minutes a week to see everything that moved»** (my 2026-04-26 phrasing), not «Five minutes a week. Every broker. Every position.» (synthesis hero phrasing). If both ship, the page has the time anchor twice in two different cadences. **Patch:** harmonize. Either drop the proof-bar cell to make room for the hero sub-line carrying it, or use the proof-bar cell as a *complementary* anchor («reading time, not trading time») while the hero sub carries the scope claim. Frontend-engineer + content-lead coordination needed.

**Risk #2 (HIGH) — Granola-grade demo content fidelity must inherit the v3.1 finance/legal patches.** Option A's biggest single lift is replacing Tab 1-4 placeholder content with fully-written example output. The v3.1 patches at commit `8cb509b` (Tab 3 normalization phrase «common pattern across retail investors»; Tab 4 sourced benchmark «about 2x the sector's weight in S&P 500 (~28%)»; FAQ Q4 $9/mo lock) are the **exact phrasing templates** the new content must inherit. If content-lead writes new Tab 3 content from scratch without the normalization phrase, Lane A discipline drifts back to v3.0 baseline. **Patch:** include in content-lead's brief an explicit «inherit the phrasing patterns from `landing-provedo-v2.md` lines 268-275 and 295-303» (the current v3.1-patched Tab 3 + Tab 4 content). I will also flag this for legal-advisor's parallel return.

**Risk #3 (MEDIUM) — `BENCHMARKS_SOURCED.md` row 8 (US retail tech allocation) is still unsourced.** The 2026-04-26 review patched Tab 4 to use S&P 500 sector weight (~28%) instead of the unsourced 34% retail median. That patch holds in all options. But: any new Granola-grade demo content (Tab 1, Tab 2, Tab 3, Tab 4, plus any new examples Option B's chat-first section header surfaces) **must NOT introduce new unsourced benchmarks.** Every numerical comparative claim in new content must resolve to a row in `BENCHMARKS_SOURCED.md` or to user's own portfolio data. **Patch:** content-lead handoff brief should include explicit reference to `BENCHMARKS_SOURCED.md` §1 («Usage guidance for AI») as a copy-rule, not just an AI-output rule. Same discipline applies to landing copy as applies to AI output.

---

## §4 One specific micro-patch PO should consider regardless of A/B/C/D outcome

**Universal micro-patch — proof bar cell #2 word swap: «messages» → «questions».**

Currently v3.1 cell #2 reads «50 free chat messages a month». My 2026-04-26 review §3 recommended «50 free questions a month» — the swap reframes from chat-software register («messages» = SMS / Slack / WhatsApp register) to **investor-task register** («questions» = the kind of thing you'd ask an analyst). Same numerical claim, stronger ICP positioning, zero content-lead overhead, single-token frontend change.

The reason I'm surfacing this **regardless of A/B/C/D** is that all four options modify the proof bar (drop «Lane A —» prefix, swap demo-count cell, etc.) — there is no universe in which this micro-patch ships **unless** finance-advisor flags it explicitly to be carried into the proof-bar revision. R3 §6.8 also recommends «messages → questions» — independent convergence. **Concrete diff:**

- v3.1: «**50** free chat messages a month»
- patched: «**50** free questions a month»

5 characters dropped, ICP register tightened, no compliance touch, no Lane A surface. Single-line patch, zero cost, asymmetric upside.

---

## §5 Disagreement with right-hand's preliminary Option A recommendation

**I support the directional verdict (Option A is the best of A/B/C) but disagree with the framing on three points:**

### Disagreement #1 — Right-hand's recommendation does not surface Option D

The synthesis itself does not propose Option D. Right-hand's preliminary recommendation appears to take the synthesis's three-option frame at face value. **This is a Phase-2 synthesis omission, not right-hand's error per se** — but a Phase-3 finance-advisor read independently surfaces Option D as financially superior (§2.Q5 above). If right-hand's synthesis presents only A/B/C to PO, finance-advisor's parallel return **must include Option D** for PO to weigh against the three options the synthesis offers. If right-hand chooses to filter Option D out before presenting to PO, that should be a deliberate documented choice with reasoning, not an omission.

**Net:** right-hand's preliminary Option A is correct *given the three options on the table*. The bigger question is whether the table has the right options.

### Disagreement #2 — Right-hand presumably accepts the proof-bar $9/month cell

The synthesis recommends the $9/month cell for Options B and C. Right-hand's preliminary Option A rec sidesteps the question (Option A doesn't include the $9/month cell). But if PO chooses Option B or C downstream, the $9/month cell ships unless explicitly objected to. **Finance-advisor formally objects to the $9/month proof-bar cell in any option.** It's anti-Sage commercial-pressure copy that doesn't advance positioning (§2.Q4 above). The synthesis doesn't flag this as a finance-domain question; right-hand may not surface it; finance-advisor surfaces it here. Carry forward.

### Disagreement #3 — Right-hand's «lowest-risk, doesn't reopen 2-day-old hero-lock» framing is strategically right but tactically incomplete

The synthesis's Option A trade-off #1 names «sacrifices novelty for brand-coherence; reads to casual visitor as "better v3.1", not "v4 redesign"». A PO chasing visible-redesign-energy at a fundraise narrative checkpoint or a product-launch storyline could find Option A anticlimactic. Right-hand's preliminary rec correctly identifies this as a feature, not a bug — but should make the trade-off **explicit to PO**: «Option A's strategic upside is the political-cost-of-zero (no hero relock, single PR, doesn't reopen finance/legal review surface); its downside is that no investor / press / brand-press cycle will find this newsworthy». If PO has a soft preference for visible-redesign-energy, Option A may not satisfy that preference.

**My read:** for PRE-ALPHA pre-investor-conversation Provedo, political-cost-of-zero is the correct optimization target. Visible-redesign-energy is a fundraise-narrative concern, not a pre-alpha concern. Option A is correct — but should be sold to PO with the political-cost framing made explicit, not implicit.

---

## §6 Cross-references

- `docs/reviews/2026-04-27-redesign-synthesis-product-designer.md` — Phase 2 synthesis being validated
- `docs/reviews/2026-04-27-fintech-competitor-landing-audit-user-researcher.md` (R2) — competitor Lane A gradient + voice 2x2
- `docs/reviews/2026-04-27-ai-tool-landing-audit-product-designer.md` (R1) — AI-tool genre conventions; key for Q3 conversion-impact reasoning
- `docs/reviews/2026-04-27-landing-trends-cro-content-lead.md` (R3) — independent convergence on «messages → questions» (R3 §6.8)
- `docs/reviews/2026-04-26-finance-advisor-landing-review.md` — finance-advisor v3.1 review (foundation of patches at commit `8cb509b`)
- `docs/finance/PRICING_TIER_VALIDATION.md` — $9/mo Plus tier rationale
- `docs/finance/BENCHMARKS_SOURCED.md` row 8 — US retail tech allocation unsourced flag (still active)
- `docs/finance/AI_CONTENT_VALIDATION_TEMPLATES.md` — Lane A discipline templates content-lead must inherit for new Granola-grade demo content
- `docs/content/landing-provedo-v2.md` line 282 — existing «I check the weekly feed for five minutes Sunday morning» builder testimonial that pre-validates Option A's time-anchor sub
- `.agents/team/CONSTRAINTS.md` Rule 1-4

---

**END phase3-finance-advisor-validation.md**
