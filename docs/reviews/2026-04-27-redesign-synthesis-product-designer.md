# Provedo Landing v4 — Redesign Synthesis (Phase 2)

**Author:** product-designer (synthesizer)
**Date:** 2026-04-27
**Inputs synthesized:**
- R1 — `2026-04-27-ai-tool-landing-audit-product-designer.md` (AI-tool landscape: 8 cards · pattern-frequency · Lane A tensions)
- R2 — `2026-04-27-fintech-competitor-landing-audit-user-researcher.md` (Fintech competitor JTBD · voice 2x2 · Lane A gradient)
- R3 — `2026-04-27-landing-trends-cro-content-lead.md` (2026 patterns · 5 hero variations · microcopy patches · 3-layer disclaimer)
- Current state: Provedo v3.1 (HEAD `409cda9`, post-finance/legal patch commit `8cb509b`) and `landing-provedo-v2.md`
- Voice lock: `BRAND_VOICE/VOICE_PROFILE.md` v post-Provedo-lock
- Constraints: 5 animation rules · Lane A bright-line · verb-allowlist · banned co-occurrence

**Output:** Three diverging redesign options for v4. Trade-offs honest. Synthesis table at the end. Open questions for Phase-3 validators.

**HARD RULES respected:** Rule 1 (no spend) · Rule 2 (no external comms) · Rule 3 (markdown only, no code) · Rule 4 (no final copy — hero candidates are 1-line proposals) · Rule 5 (voice-check every line) · Rule 6 (no v3.1 patch undo) · Rule 7 (5 animation rules held) · Rule 8 (each option handles the v3.1 footer-waitlist trial-CTA bug R3 §M3 surfaced).

---

## §1 Three diverging postures (one-line each)

The 2-3 options must diverge **strategically**, not stylistically. From the three reports the postures naturally fall out as:

- **Option A — «Editorial Sage».** Lift R1's editorial mid-page pattern (6/8 frequency) to be the structural backbone of the page; double down on Provedo's already-strongest move (§S6 antithesis line, Lane-A-as-positioning §S3 negation); resist AI-tool genre conventions where they pull off-brand. Most conservative, most Sage-archetype-faithful.
- **Option B — «Narrowed Wedge».** Adopt R2's strongest finding (chat-first hero is uncontested in direct-fintech category) by sharpening ICP-naming + chat-as-product wedge above the fold; promote broker-marquee + audience-line earlier; ship R3's V1 time-anchor sub. Mid-risk, highest cold-traffic clarity, strongest competitive differentiation.
- **Option C — «Negation-Forward».** Promote R3's V5 hero (negation-led) + re-order page so what-Provedo-is-NOT precedes what-Provedo-IS; make Lane A discipline visible from the first second on the page (extending Kubera's «Skip the middleman» pattern further than Kubera does). Highest brand-risk, highest single-line positioning move, most-distinctive among 2026 fintech-AI landings.

These three diverge across the **«show» vs «tell» vs «refuse»** axis (R1 §6 frame): Option A trusts editorial *show* (let typography + structure carry the brand); Option B trusts product *tell* (sharpen the JTBD+ICP claim); Option C trusts disciplined *refuse* (lead with what we are not, then quietly reveal what we are).

---

## §2 Option A — «Editorial Sage»

### Strategic posture

Treat v3.1 as fundamentally correct. Don't redesign — **evolve**. The biggest single payoff is making the editorial mid-page block (§S6) the **structural anchor of the page**, not just one section among ten. Adopt R1.R1 (replace bracketed placeholders with fully-written example product output — Granola pattern, 5/8 freq) and R1.R4 (lift editorial mid-page to its strongest variant — 6/8 freq); reject everything else as drift.

The bet: in 2026 the differentiator for a Sage-archetype AI tool is *not* matching AI-genre conventions — it is **typographic restraint + real-feeling content + calm rhythm**. Anthropic.com proves this works at scale; Granola.ai proves it works at our scale.

### Section-by-section disposition

| § | Change | Source |
|---|---|---|
| S1 Hero | **REVISE.** Adopt R3.V1 (time-anchor sub): «Five minutes a week. Every broker. Every position.» Keep current head «Provedo will lead you through your portfolio.» Keep dual CTA. | R3 §7.V1 |
| S2 Proof bar | **REVISE.** Drop «Lane A — » prefix → «Information. Not advice.» (R3.M4). Drop «4 demo scenarios» cell, swap to «5 minutes a week» reading-time anchor (R3 §6 line 7). Lock «1000+» when verified (R2 §A4) or fallback to «Hundreds». | R3 §6, §8.M4 |
| S3 Negation | **KEEP.** Strongest single-content move on page (R3 §6 line 10). Strip meta-header «This is what Provedo is not.» — let the three negation lines carry themselves (R3 §6 line 11). | R3 §6.10-11 |
| S4 Demo tabs | **REVISE.** Keep tab structure + v3.1 finance/legal patches verbatim. **Replace bracketed placeholder content with fully-written Granola-grade example output across all 4 tabs.** Tab 1 already gets the typing-animation hero treatment; the rendered chart + per-line citation badges become real micro-content the reader reads, not skips. This is the single largest copy+visual upgrade in Option A. | R1 §4.R1 |
| S5 Insights bullets | **KEEP.** Three Provedo-as-agent statements; rhythm is good (R3 §6 line 17). |  |
| S6 Editorial mid-page | **REVISE+ELEVATE.** Make this the structural anchor. Test JBM-mono accent line for closing tagline (vs italic Inter — R1 §4.R4). Tighten body by 15-20 words (R3 §6 line 19). Hold candidate #2 «You hold the assets. Provedo holds the context.» as closer. | R1 §4.R4, R3 §6.19 |
| S7 Testimonials | **REVISE.** Three quotes from Roman M. reads thin (R3 §6 line 20). Collapse to **single weighted quote** + honest line «Alpha quotes coming Q2 2026». | R3 §6.20, R3 §11.5 |
| S8 Aggregation marquee | **KEEP+VERIFY.** Lock «1000+» if verified, else «Hundreds» — but specifics over generics if true number is e.g. 400 (R3 §6 line 21). | R3 §6.21 |
| S9 FAQ | **REVISE.** «Common questions» → «Questions you'd ask» (R3.M1). Q4 already has $9 from v3.1 patch. Align Q3 with §S8 broker-count. | R3 §8.M1 |
| S10 Pre-footer CTA | **KEEP.** «Open Provedo when you're ready.» — voice-perfect (R3 §6 line 23). |  |
| Footer disclaimer | **REVISE.** Adopt R3 §9 three-layer pattern (plain-language summary + expandable verbatim 75-word block + `/disclosures` sub-page). Layer 1 ≈ 14-20 words. **Requires legal-advisor sign-off on Layer 1 wording.** | R3 §9 |
| **ADD** — Audience-name micro-line | Single line under hero or as proof-bar small-print: «For investors who hold across more than one broker.» | R1 §4.R3, R2 §7.Adopt-4 |
| Bug fix | Footer waitlist box CTA «Try Plus free for 14 days» → «Start free forever» + header consistency with §S10. | R3 §8.M3 |

### Hero variation locked

| Element | Copy | Chars | Voice-check |
|---|---|---|---|
| Headline | Provedo will lead you through your portfolio. | 45 | leads-through (allowlist, restrained) |
| Sub | Five minutes a week. Every broker. Every position. | 49 | observation-anchored, scope-claim, no advice register |
| Audience whisper (NEW, below sub or in proof-bar) | For investors who hold across more than one broker. | 51 | descriptive ICP, no advice gradient |
| Primary CTA | Ask Provedo | 11 | named-noun product CTA |
| Secondary | Start free forever | 18 | drops apologetic «Or» (R3.M2) |

### Demo presentation strategy (§S4)

**Keep-tabs + replace-content-with-real.** No structural change to the 4-tab pattern; the tabbed-demo is in-trend (Claude does this below the fold per R1 §2.1). The change is purely *content fidelity* — every tab gets fully-written example chat conversation per R1 §4.R1: real-feeling user question, real-feeling Provedo answer with specific dollar amounts, tickers, dates, source citations. The rendered chart inline becomes part of the believable example, not a placeholder. Reader reads the example, mentally maps to own portfolio, value-prop lands without explanation. This is the Granola pattern — and it's the strongest copy-side gap in v3.1 per R1 §3.

### Disclaimer treatment

**Adopt R3 §9 three-layer pattern.** Layer 1 plain-language summary (≈ 14-20 words) sits where current 75-word block is. Layer 2 expandable «Read full disclosures» preserves verbatim v3.1 legal text (the regulator-readable patch from `8cb509b` is unchanged underneath). Layer 3 `/disclosures` sub-page is post-alpha. **Cost:** legal-advisor must sign off on Layer 1 wording. Draft proposed by R3: «Provedo provides information about your portfolio. It is not investment advice — every decision stays yours.»

### Motion budget

**Restrained.** Hero typing animation (already shipped, best-in-class per R3 §6.25) + parallax stack + S6 editorial fade-in. No new motion. Anti-pattern A1 (gradient hero), A3 (dramatic-thinking pause), A4 (live-counter widgets) all rejected per R3 §10.

### Research-backed evidence

- Editorial mid-page lift: **R1 §3 pattern frequency 6/8 AI-tool landings** + R1 §4.R4 explicit recommendation.
- Replace placeholders with real content: **R1 §4.R1** (Granola is 5/8 highest-fidelity exemplar), **R1 §3 pattern row «Fully-written example product content» 5/8**.
- Time-anchor sub: **R3 §7.V1** lowest-risk hero variant; **R3 §2** identifies sub-line value-anchor as the 2026-trend gap in v3.1.
- Three-layer disclaimer: **R3 §9** (Wealthfront / Public.com / Robinhood references); legally preserved per **R3 §9 «legal-protection check»**.
- Audience whisper: **R1 §4.R3** (Granola pattern) + **R2 §7.Adopt-4** (Kubera pattern); independent convergence.
- Voice-fingerprint preservation: **R2 §4** voice 2x2 — Provedo's lower-friendly information-only quadrant is uncontested by direct peers; Option A holds it.
- v3.1 microcopy bug: **R3 §8.M3** identifies footer waitlist trial-CTA leak as top-1 patch.

### Trade-offs (3)

1. **Sacrifices novelty for brand-coherence.** Option A reads to the casual visitor as «better v3.1», not «v4 redesign». A growth-team or PO chasing visible-redesign-energy will find this anticlimactic. The bet pays off only if PO believes typographic restraint + content fidelity is actually moving the needle on the cohort that matters (HNW multi-broker millennial — R2 ICP A).
2. **Defers the chat-first wedge play.** R2 §6.Opp-1 is the strongest competitive differentiation finding (chat-first hero uncontested in direct fintech) — Option A holds the chat hero but doesn't *promote* it as wedge above-the-fold. Option B picks this up; Option A leaves it on the table.
3. **Highest content-lead burden.** «Replace bracketed placeholders with Granola-grade fully-written example output» is the heaviest single lift across all options (~6-8h content-lead per R1 §4.R1) — and the work is invisible to anyone who reads the page above the demo tabs. Visible-redesign-yield to content-lead-effort ratio is the worst of the three options.

### Lane A risk gradient (vs v3.1) — 0-5 each (lower = stronger discipline)

| Vector | v3.1 | Option A | Δ |
|---|---|---|---|
| Implicit-recommendation drift | 1 | 1 | hold |
| Personalization drift | 1 | 1 | hold |
| Social-proof-as-rec drift | 1 | 1 | hold |
| Animation-narrative-causation drift | 0 | 0 | hold |

**Net:** Option A holds Lane A discipline at v3.1 levels exactly. The replace-placeholders work in §S4 has theoretical drift surface (real-feeling AAPL recovery example could be marketing-tightened to read «AAPL bounced — stay calm next dip») but the v3.1 finance/legal patches on Tab 3 already codified the safe phrasing template. Content-lead pass on the new demo content must inherit those guardrails.

### Voice fingerprint preservation

**Strongest of the three options.** Magician+Sage register held everywhere. Editorial mid-page elevation **strengthens** Sage gravitas via typographic restraint (anti-A1 / anti-A2 / anti-A3 all rejected). Audience-whisper «For investors who hold across more than one broker» is observation-coded ICP, not advice gradient. JBM-mono accent test in §S6 closer is technical-Sage-Magician register, not designer-flourish — preserves both archetypes in single visual gesture.

No Everyman drift risk. Option A explicitly resists the Everyman-warm AI-genre gravity (Lovable «Watch it come to life», Linear-too-friendly). The Sage-with-Everyman-modifier balance held in v3.1 holds in Option A.

### Scope estimate

| Role | Hours | Notes |
|---|---|---|
| content-lead | 8-12 | Replace 4 tab placeholders with Granola-grade content + Layer 1 disclaimer draft + S6 body tightening + S7 quote consolidation |
| product-designer (you, follow-up) | 4-6 | S2 cell rebalance · S6 mono-accent test · audience-whisper visual placement · footer disclaimer 3-layer visual spec |
| frontend-engineer | 4-6 | Layer 2 expandable native HTML details/summary · S2 cell swap · §S3 header strip · S7 single-quote layout · footer waitlist CTA fix |
| a11y-architect | 1-2 | Audit Layer 2 details/summary keyboard + screen-reader · audit audience-whisper readable order |
| brand-voice-curator | 1-2 | Sign-off on time-anchor sub + audience-whisper + Layer 1 disclaimer wording |
| **Total** | **18-28h** |  |

### Sequencing

**Single PR (v4-A).** All changes are non-structural; no section is added or removed. Ships as one commit-set without risk of partial state.

---

## §3 Option B — «Narrowed Wedge»

### Strategic posture

Adopt R2's strongest competitive finding (chat-first hero + pattern-detection JTBD are uncontested in direct fintech category) by **promoting them above the fold and naming the ICP**. Build on what R3.V2 (audience-named hero) and R3.V1 (time-anchor sub) propose, but synthesize into a single hero rather than A/B-testing arms. Adopt R2.Adopt-2 (broker marquee earlier) to cash the «1000+ brokers» trust signal earlier in the reading order.

The bet: in 2026 the differentiator for a fintech-AI Sage tool is **clarity-of-who-it's-for + clarity-of-what-it-does-uniquely**. Provedo currently has both (chat-first + multi-broker) but buries them — Option B unburies. R2 §8 30-second test names exactly the gap («ICP weak, chat-first wedge implicit not explicit»); Option B closes the gap.

### Section-by-section disposition

| § | Change | Source |
|---|---|---|
| S1 Hero | **REPLACE.** New hero combines audience-naming (R3.V2 head) + chat-as-product-anchor (current Provedo lock) + time-anchor (R3.V1 sub). See locked variation below. | R3 §7.V1+V2 synthesis |
| S2 Proof bar | **REVISE.** Same as Option A (drop «Lane A —» prefix; swap demo-count for time-anchor). **Add 6th cell or modify cell #4: «$9/month» Plus tier price** to surface the price anchor (R3 §5 trend; R2 §7.Adopt-1). | R2 §7.Adopt-1, R3 §8.M4 |
| S3 Negation | **REVISE+REPOSITION.** Keep negation lines + affirmation closer. **Move to AFTER demo tabs (§S4)** — let the demo show what Provedo IS first, then the negation block reads as Lane-A discipline rather than disclaim-pre-product. R2 §6.Opp-2 second variant. | R2 §6.Opp-2 |
| **NEW** — Broker marquee thin strip | **ADD between S2 and S4.** Thin logo strip (slate-700 monochrome, height ~64px) — visualizes the «1000+» proof-bar number that's currently abstract. The original §S8 marquee can either remain (visual rhyme) or downgrade to a wider strip in S4. | R2 §7.Adopt-2 |
| S4 Demo tabs | **REVISE.** Same content-fidelity upgrade as Option A (Granola-grade real example output) + **promote chat-first framing in section header**: «Ask on your actual holdings» becomes «Chat with your portfolio. Across every broker.» — anchors chat-first wedge in section title. | R1 §4.R1, R2 §6.Opp-1 |
| S5 Insights bullets | **KEEP.** | — |
| S6 Editorial mid-page | **KEEP.** | — |
| S7 Testimonials | **REVISE.** Same as Option A (single weighted quote + honest pre-alpha line). | R3 §6.20 |
| S8 Aggregation marquee | **REPLACE-OR-DOWNGRADE.** If new thin marquee added between S2-S4 (above), the §S8 full marquee section is redundant. **Replace §S8 with «Sources for every observation» section** — showcases the cite-trail commitment R2 §6.Opp-5 identifies as a Provedo trust anchor that no peer carries. Visual: 3-card strip showing «AAPL Q3 earnings 2025-10-31 → press release link», «Schwab statement 2025-11-01 → broker source», «KO ex-div Sept 14 → SEC filing». | R2 §6.Opp-5 |
| S9 FAQ | **REVISE.** Same as Option A (R3.M1 «Questions you'd ask»). | — |
| S10 Pre-footer CTA | **KEEP.** | — |
| Footer disclaimer | **ADOPT three-layer pattern** (same as Option A). | R3 §9 |
| **ADD** — User-empowerment line | After §S3 negation closer, single line: «You stay in charge. Provedo just shows you everything.» | R2 §6.Opp-4 |
| Bug fix | Same waitlist trial-CTA fix. | R3 §8.M3 |

### Hero variation locked

| Element | Copy | Chars | Voice-check |
|---|---|---|---|
| Audience headline | For investors who hold across more than one broker. | 52 | descriptive ICP, allowlist-clean |
| Sub | Provedo leads you through every position, every dividend, every drawdown. Five minutes a week. | 95 | leads-through + scope-list + time-anchor; «leads» upgraded from «will lead» (present-tense, R3 §2 trend-fit) |
| Primary CTA | Ask Provedo | 11 | named-noun product CTA |
| Secondary | Start free forever | 18 | (R3.M2) |
| Small-print | 50 free questions a month, no card. | 36 | (R3 §6.8: «messages» → «questions» — investor-task register) |

**Voice-check:** «leads you through» is an upgrade of v3.1 «will lead» — present-tense without losing allowlist verb (R3 §2 trend-fit + R3 §7.V2 sub-pattern). Audience headline is descriptive ICP-statement; not advisor-claim. Scope-list «every position, every dividend, every drawdown» — R2.Opp-3 pattern-artefact-list, all observation-coded. Pass.

### Demo presentation strategy (§S4)

**Keep-tabs + replace-content-with-real + section-header-promotes-chat-wedge.** Same Granola-grade content fidelity as Option A, plus the section header is rewritten to anchor the chat-first JTBD R2 §3 surfaces as uncontested. The hero already shows typing animation; the section header reinforces «this is what makes us different in this category, and we're confident enough to title the section that way».

### Disclaimer treatment

**Same as Option A — adopt R3 §9 three-layer.**

### Motion budget

**Moderate.** Hero typing animation (kept). Parallax stack (kept). New thin broker marquee scrolls (already a marquee; reduced motion fallback to static row). S4 demo charts simultaneous-reveal (locked from v3.1 finance patch). S8 sources-strip cards have hover state revealing source URL preview — small new interaction. No animation budget violations vs 5 rules.

### Research-backed evidence

- Audience-naming hero: **R2 §6.Opp-1** (chat-first uncontested), **R2 §7.Adopt-4** (Kubera audience-named hero), **R1 §4.R3** (Granola pattern; «8/8 confidence — adopt»), **R3 §7.V2** explicit candidate.
- Pattern-artefact list in sub: **R2 §6.Opp-3** explicit recommendation.
- Broker marquee earlier: **R2 §7.Adopt-2** (4/7 direct competitors lead with broker-trust signal closer to fold; Provedo at S8 is below median).
- Negation post-demo repositioning: **R2 §6.Opp-2** second variant (test reordering to hero → demo → negation).
- Chat-first section header: **R2 §3** (chat-first JTBD whitespace map: 0/7 direct peers, only Wealthfolio tertiary).
- Sources cite-trail card-strip: **R2 §6.Opp-5** explicit recommendation.
- Price-on-hero proof-bar cell: **R2 §7.Adopt-1** (Kubera + Sharesight pattern; 4/7 hide pricing, Provedo currently hides).
- User-empowerment line: **R2 §6.Opp-4** (no peer frames «no advice» as user-empowerment positively).
- Three-layer disclaimer: **R3 §9**.
- v3.1 microcopy bug: **R3 §8.M3**.

### Trade-offs (3)

1. **Trades hero-poetry for ICP-signal.** Headline becomes audience-named («For investors who hold across more than one broker») — drops the imperative-Provedo register «Provedo will lead you through your portfolio» that PO locked 2026-04-25. R3 §11.Q2 explicitly flags this trade-off as strategic (PO call). Higher cold-traffic clarity, lower brand-poetry.
2. **More structural change → more execution risk.** Option B adds a new thin marquee, replaces §S8 with sources-strip, repositions §S3 below §S4, adds user-empowerment line. The visible page-rhythm shifts substantially. Frontend-engineer + product-designer hours scale up; bug surface during the slice scales up.
3. **Higher motion + more interactive surfaces.** New thin marquee + sources-strip hover state push the motion budget up vs Option A. Within 5-rule compliance but closer to the ceiling. Reduced-motion fallback work scales.

### Lane A risk gradient (vs v3.1) — 0-5 each

| Vector | v3.1 | Option B | Δ |
|---|---|---|---|
| Implicit-recommendation drift | 1 | 1 | hold |
| Personalization drift | 1 | **2** | +1 (audience-naming creates a sharper «for you» read in cold traffic; mitigated by Lane A signaling in proof bar still strong but ICP-ed page can feel «built for me» which is one step from «advises me») |
| Social-proof-as-rec drift | 1 | 1 | hold |
| Animation-narrative-causation drift | 0 | 0 | hold |

**Net:** Option B introduces +1 personalization-drift risk via audience-naming. The mitigation is that the audience-line is descriptive («who hold across more than one broker») not advisory («who want to maximize returns») — Kubera's «those who manage their own wealth» is the cleanest precedent and doesn't read as personalization. Still, **finance-advisor + brand-voice-curator should review the audience-naming framing** before ship.

### Voice fingerprint preservation

**Held but at higher risk.** Magician+Sage register preserved in sub-line and §S4 section title. The Everyman modifier strengthens at hero-headline (audience-naming = Everyman direct-address). Risk: the page-rhythm shift toward «product-claim above the fold + cite-trail strip + price-on-proof-bar» can read as **slightly more aggressive commercial register** vs Option A's pure-Sage editorial. R3 §11.Q1 flags this as needing brand-voice-curator sign-off; Option B's risk is concentrated on the «every position. every dividend. every drawdown.» cadence — Stripe-imperative-adjacent. Brand-voice-curator should rule on whether this cadence drifts off-Sage.

### Scope estimate

| Role | Hours | Notes |
|---|---|---|
| content-lead | 12-16 | Demo placeholder rewrite (same as A) + new hero + sources-strip card content + user-empowerment line + S4 section header rewrite |
| product-designer (you, follow-up) | 8-12 | Hero re-spec · new thin broker-marquee component · sources-strip card design · §S3 reorder spec · proof-bar cell re-balance |
| frontend-engineer | 12-16 | Hero rewrite · new ProvedoBrokerMarqueeStrip component · ProvedoSourcesStrip section · §S3 reorder · proof-bar cell add · footer waitlist fix |
| a11y-architect | 2-3 | Audit new audience-headline reading-order · audit sources-strip hover/keyboard · audit reduced-motion on new marquee strip |
| brand-voice-curator | 2-4 | Hero variation + section header + audience-line + user-empowerment line + cadence review |
| **Total** | **36-51h** |  |

### Sequencing

**Two slices (LP4-Ba and LP4-Bb) recommended.** Slice-LP4-Ba: hero rewrite + audience-line + proof-bar cell add + footer fix + disclaimer 3-layer (low structural risk, immediate cold-traffic clarity uplift). Slice-LP4-Bb: thin broker-marquee + sources-strip § replacing S8 + §S3 reposition + S4 header rewrite + Granola-content rewrite (deeper structural changes; can ship 1-2 weeks after Ba).

---

## §4 Option C — «Negation-Forward»

### Strategic posture

Adopt R3.V5 (negation-led hero) and **re-order the page so what-Provedo-is-NOT precedes what-Provedo-IS**. Take Kubera's «Skip the middleman» pattern further than Kubera does — they bury Lane A in copy, Option C makes Lane A the **first thing the visitor sees**. R2 §5 documents that 3/7 direct competitors hold Lane A discipline at score 0; only Kubera makes negation a *feature*; **0/7 lead with negation**.

The bet: in 2026 the strongest single positioning move available to a fintech-AI Sage tool — when the genre is awash in advice-y AI-financial-agent claims (Getquin) and ambiguous «smart-investor» promises (Sharesight) — is **explicit refusal to play the genre**. The negation IS the brand. R1 §6.T2 names this as Provedo's available positioning equity: «Range's "not a brokerage / not a spreadsheet" + Granola's "no meeting bots" both demonstrate that negation as positioning can read more confident than capability-claim register, not less.»

### Section-by-section disposition

| § | Change | Source |
|---|---|---|
| **NEW S1** Negation hero | **REPLACE current S1.** Three-line negation + affirmation closer becomes the hero. CTA layer remains dual-stack. | R3 §7.V5 (extended) |
| **NEW S2** Affirmation reveal | The previous v3.1 hero (typing animation + chat surface mockup) becomes §S2 — what-Provedo-IS, after the negation. The typing animation runs on scroll-into-view rather than page-load. | R3 §7.V5 rationale |
| S3 Proof bar | **PROMOTE** prior S2 here. Same revisions as Options A+B (drop «Lane A —» prefix; swap demo-count for time-anchor; add «$9/month» Plus tier cell). | R3 §8.M4, R2 §7.Adopt-1 |
| S4 Demo tabs | **REVISE.** Granola-grade content-fidelity rewrite (same as A+B). Section header sharpens to «Four answers Provedo finds in your real positions.» (current sub becomes head; new sub names the cite-trail). | R1 §4.R1 |
| S5 Insights bullets | **KEEP.** | — |
| S6 Editorial mid-page | **KEEP.** Locked candidate #2 closer holds. | — |
| S7 Testimonials | **REVISE.** Single weighted quote + honest pre-alpha line (same as A+B). | R3 §6.20 |
| S8 Broker marquee | **KEEP** in current position, **trim** to thin strip (R2 §7.Adopt-2). The full §S8 marquee redundant if S3 proof bar carries the «1000+» number; thin logo strip carries visual proof. | R2 §7.Adopt-2 |
| S9 FAQ | **REVISE.** R3.M1 + Q1 leads with «No, Provedo does not give investment advice. It provides clarity, observation, context, and foresight.» — strengthens the negation echo from §S1. | R3 §8.M1, R2 §6.Opp-2 |
| S10 Pre-footer CTA | **KEEP.** | — |
| Footer disclaimer | **Adopt three-layer pattern** (same as A+B). With negation in hero, Layer 1 plain-language summary inherits the visual rhyme. | R3 §9 |
| **ADD** — Audience-whisper micro-line | Same as Option A — single line under negation hero or as proof-bar small-print: «For investors who hold across more than one broker.» | R1 §4.R3, R2 §7.Adopt-4 |
| Bug fix | Same waitlist trial-CTA fix. | R3 §8.M3 |

### Hero variation locked

| Element | Copy | Chars | Voice-check |
|---|---|---|---|
| Hero head (3-line negation) | Provedo is not a robo-advisor. / Provedo is not a brokerage. / Provedo will not tell you what to buy. | 84 total | explicit Lane A disclaim register; allowlist-compatible (negation is the structural device) |
| Affirmation closer (in hero) | What Provedo does: leads you through your portfolio across every broker, with sources for every answer. | 102 | leads-through (allowlist) + scope-claim + cite-trail; Sage gravitas |
| Audience whisper | For investors who hold across more than one broker. | 51 | descriptive ICP |
| Primary CTA | Ask Provedo | 11 | named-noun product CTA |
| Secondary | Start free forever | 18 | (R3.M2) |

**Voice-check:** Three negation lines are the §S3 negation lines from v3.1 verbatim — already audited Lane A clean (R3 §6.10). Affirmation closer is candidate #1 from §S6 candidate set (v1 default), upgraded with «leads» (allowlist) + «with sources for every answer» (cite-trail anchor). Pass.

### Demo presentation strategy (§S4)

**Hybrid: scroll-revealed typing animation + Granola-grade tab content.** The typing animation that v3.1 carries in the hero relocates to **§S2** (immediately after negation hero) — runs on scroll-into-view per usePrefersReducedMotion + IntersectionObserver pattern (frontend-engineer reuses existing typing hook). Reader sees negation FIRST, then sees the chat surface come alive. The four tabs in §S4 inherit the Granola-grade content-fidelity upgrade.

This sequencing has narrative power: «Here's what we are NOT (calm gravitas) → Here's the product running (proof of capability) → Here's four examples on your real holdings → Here's why we hold a feed → Here's the editorial line.» — the page reads as a confident calm reveal, not a marketing argument.

### Disclaimer treatment

**Same as A+B — adopt R3 §9 three-layer.** With negation in hero, Layer 1 plain-language summary («Provedo provides information about your portfolio. It is not investment advice — every decision stays yours.») inherits visual rhyme with the hero negation lines.

### Motion budget

**Restrained-to-moderate.** Hero loses typing animation to §S2 (typing now on scroll-into-view). Negation hero is **static** (Sage gravitas — still page, restrained type, no movement). §S2 typing animation (kept). §S4 simultaneous demo (kept from v3.1 patch). All within 5-rule compliance.

R3 §10.A1 (gradient hero) — Option C is the strongest rejection of this anti-pattern: the hero is *literally three sentences of black text on warm-cream*. Anti-flashy-AI register at maximum.

### Research-backed evidence

- Negation-led hero: **R3 §7.V5** (most differentiated; brand-territory-expanding); **R1 §6.T2** (negation as positioning equity, named explicitly as Provedo-available); **R2 §6.Opp-2** (Lane A as positioning copy, not just disclaimer); **R2 §7.Adopt-5** (Range + Kubera negation).
- Lane A as visible feature: **R2 §5** Lane A gradient ranking (only Snowball + Kubera + Wealthfolio at 0; Kubera makes it a *feature*; nobody promotes negation to hero).
- Pre-emptive answer to «is this an AI advisor?»: **R3 §3 «Lane-A trade-off worth flagging»** — Anthropic deliberately doesn't show financial-data answer above fold; Option C inverts: **shows the negation BEFORE the product**.
- Granola-grade demo content: **R1 §4.R1**.
- Proof-bar revisions: **R3 §8.M4, R2 §7.Adopt-1**.
- Audience-whisper: **R1 §4.R3, R2 §7.Adopt-4**.
- Three-layer disclaimer: **R3 §9**.

### Trade-offs (3)

1. **Pre-loads mistrust before user knows what product is.** R3 §7.V5 names this risk explicitly: «pre-loads mistrust before user knows what product is». A cold visitor lands on three negation sentences and a CTA — they may bounce before §S2 reveals the actual product. Brand-strategist + finance-advisor should rule on whether the differentiation upside outweighs first-second-bounce risk for cold traffic.
2. **Hardest to reverse.** Negation-led hero is a strategic-posture commitment, not a copy choice. Once shipped, retreating to a product-led hero looks like the brand walked back its own confidence. Option C is the highest single-decision-cost option; rolling forward from A or B to C is easier than rolling forward from C to anything else.
3. **Highest brand-voice-curator + finance-advisor + legal-advisor coordination cost.** Negation in hero pushes Lane A signaling to its visible maximum. Each Phase-3 validator has direct stakes in whether the negation phrasing reads correctly in their domain (legal: does «not a robo-advisor» preempt regulator-readable disclaim? finance: does this depress conversion among ICP-A who came expecting AI-tool genre? brand-voice-curator: does the page over-rotate on Lane A and lose Magician-foresight register?).

### Lane A risk gradient (vs v3.1) — 0-5 each

| Vector | v3.1 | Option C | Δ |
|---|---|---|---|
| Implicit-recommendation drift | 1 | **0** | -1 (negation-in-hero pre-empts any implicit-rec read; reader has been told what Provedo is NOT before reading anything else) |
| Personalization drift | 1 | 1 | hold |
| Social-proof-as-rec drift | 1 | 1 | hold |
| Animation-narrative-causation drift | 0 | 0 | hold |

**Net:** Option C is the only option that **strengthens** Lane A discipline below v3.1 baseline. The implicit-recommendation drift vector drops to 0 because the page literally opens with «Provedo will not tell you what to buy.» Any subsequent demo content cannot drift into implicit-rec because the Lane A stance has been declared as positioning.

### Voice fingerprint preservation

**Mixed risk.** Magician archetype risk: negation-led hero **subdues Magician** (foresight / pattern-recognition / craft) in favor of pure Sage (stewardship / observation / disclaim). The page is **most-Sage** of three options — at the cost of the Magician modifier balance the positioning lock specifies (Magician primary + Sage). The §S2 reveal restores Magician via typing animation (chat-as-pattern-recognition surface), but the hero itself is Sage-only.

Everyman risk: low. Negation lines are direct, plain language («Provedo is not a robo-advisor») — Everyman accessibility intact.

R2 §4 voice 2x2: Option C **deepens lower-friendly information-only quadrant** even further than v3.1 — pulls toward Kubera's information-coded territory more than Provedo's current Everyman-warmer position. Trade-off real; brand-voice-curator should rule.

### Scope estimate

| Role | Hours | Notes |
|---|---|---|
| content-lead | 8-12 | Hero negation rewrite + affirmation closer + Granola-grade demo content + Layer 1 disclaimer + §S9 Q1 strengthening |
| product-designer (you, follow-up) | 10-14 | New negation-hero typography + §S2 reveal section spec + scroll-trigger animation spec · proof-bar cell rebalance · audience-whisper visual placement · footer disclaimer 3-layer visual |
| frontend-engineer | 16-22 | Hero rewrite (typography-led, no typing) · §S2 component (chat-typing-on-scroll-into-view) · IntersectionObserver hookup · proof-bar cell add · §S8 marquee thin-strip · footer waitlist fix · 3-layer disclaimer details/summary |
| a11y-architect | 3-4 | Audit negation-hero reading order · audit §S2 scroll-triggered animation reduced-motion fallback · audit Layer 2 disclaimer details/summary · audit S4 simultaneous-demo (already shipped) |
| brand-voice-curator | 3-5 | Hero variation review (negation-led has highest brand-territory implications) · audience-line review · demo-section voice review · cadence pull-back to maintain Magician modifier in §S2-S6 |
| finance-advisor | 1-2 | Cold-traffic conversion-risk estimate + Lane A signaling adequacy review |
| legal-advisor | 1-2 | Negation-hero phrasing regulator-readability review + Layer 1 disclaimer wording |
| **Total** | **42-61h** |  |

### Sequencing

**Two slices (LP4-Ca and LP4-Cb) required.** Slice-LP4-Ca: full negation-hero + §S2 typing-on-scroll + page reorder S1-S2-S3 + proof-bar revisions + footer 3-layer disclaimer + bug fix (high structural risk; ships first as standalone observable change). Slice-LP4-Cb: Granola-grade demo content + S8 marquee thin-strip + §S9 FAQ Q1 strengthening + S7 testimonial consolidation (lower-risk content-pass; ships 1-2 weeks after Ca, with Phase-3 validator approvals).

**Cannot ship as one PR** — too much surface change for safe single-merge. Ca defines the brand-territory move; Cb deepens the content fidelity inside the new structure.

---

## §5 Synthesis comparison table

| Dimension | Option A — Editorial Sage | Option B — Narrowed Wedge | Option C — Negation-Forward |
|---|---|---|---|
| Strategic posture | Trust editorial *show* | Trust product *tell* | Trust disciplined *refuse* |
| Hero | Current head + R3.V1 time-anchor sub | Audience-named head + scope-list sub | Three-line negation + affirmation closer |
| Demo strategy | Keep-tabs + Granola-grade real content | Same + chat-first section header | Same + typing animation moves to §S2 scroll-reveal |
| Lane A risk delta vs v3.1 | hold (1/1/1/0) | +1 personalization (1/2/1/0) | -1 implicit-rec (0/1/1/0) |
| Voice preservation | Strongest (Magician+Sage held) | Mid (slight Stripe-cadence risk in scope-list sub) | Mixed (Sage strengthened; Magician subdued in hero, recovered §S2+) |
| Scope (hrs total) | 18-28h | 36-51h | 42-61h |
| Sequencing | Single PR (v4-A) | Two slices (LP4-Ba + LP4-Bb) | Two slices (LP4-Ca + LP4-Cb) |
| Strongest research evidence | R1 §3 6/8 editorial-mid-page + R1 §4.R1 Granola | R2 §6.Opp-1 chat-first uncontested + R2 §7.Adopt-4 Kubera audience | R1 §6.T2 negation positioning equity + R2 §5 Lane A gradient |
| Top trade-off | Sacrifices novelty for brand-coherence; defers chat-first wedge play | Trades hero-poetry for ICP-signal; +1 personalization-drift | Pre-loads mistrust before product; hardest single-decision-cost |
| Differentiation upside | Lowest (continues current direction with content fidelity) | Mid (lights up uncontested chat-first wedge in category) | Highest (most-distinctive 2026 fintech-AI hero) |
| Reversibility | Highest (no structural change to undo) | Mid (page-rhythm shift can be tuned post-ship) | Lowest (negation-hero is brand-territory commitment) |
| Best fit for cohort | HNW Sage-aware reader (R2 ICP A premium-tier) | Productivity-native multi-broker millennial (R2 ICP A standard) | Fintech-Twitter regulatory-aware niche + brand-press cohort |

### Common across all three options

1. Replace bracketed-placeholder demo content with Granola-grade fully-written example output (R1 §4.R1) — universally validated.
2. Three-layer disclaimer pattern (R3 §9) — universally validated; legal-advisor sign-off required on Layer 1.
3. Footer waitlist trial-CTA leak fix (R3 §8.M3) — universally required.
4. Single weighted testimonial + «alpha quotes coming Q2» line (R3 §6.20) — universally validated.
5. Drop «Lane A —» prefix from proof bar cell #4 (R3 §8.M4) — universally validated.
6. Add audience-whisper line «For investors who hold across more than one broker.» — universally validated (R1 §4.R3 + R2 §7.Adopt-4 convergence).
7. v3.1 finance/legal patches at commit `8cb509b` — held in all three options (Tab 3 phrasing · simultaneous animation · sourced benchmark · FAQ Q4 $9 · 75-word disclaimer remains the verbatim text behind Layer 2).

These are the «un-disputable improvements» the synthesis surfaces — they would ship even in a no-redesign-decision scenario.

---

## §6 Open questions for Phase-3 validators

### For finance-advisor

- **Option A:** Does the time-anchor sub «Five minutes a week. Every broker. Every position.» trigger any over-promise / FOMO / day-trader-recruitment concern? Is «five minutes» honest given Free-tier 50-questions/month allocation?
- **Option B:** The audience-headline «For investors who hold across more than one broker.» — does this read as ICP-narrowing or as suggested-fit-for-me (personalization drift)? Does the «every position. every dividend. every drawdown.» scope-cadence risk reading as performance-implication?
- **Option C:** Most-load-bearing question. Does negation-led hero **depress conversion among ICP-A** who come expecting AI-tool genre conventions? Specifically: does «Provedo will not tell you what to buy» read as «Provedo is less powerful than Getquin/Magnifi» to a productivity-native millennial? Or does the regulatory-aware cohort read it as «finally, a tool that won't pretend to be an advisor»?
- **Universal:** Is the proof-bar new $9/month price-on-hero cell (Options B + C) brand-correct, or does it read commercial-pressure (anti-Sage)?

### For legal-advisor

- **Universal:** Sign-off required on R3 §9 Layer 1 plain-language summary draft: «Provedo provides information about your portfolio. It is not investment advice — every decision stays yours.» — does «provides information about your portfolio» preserve the «not personalized recommendation» protection that the verbatim regulator-readable language carries? (R3 §11.Q4 explicitly flagged.)
- **Universal:** Adequacy of three-layer disclaimer pattern. Layer 2 expandable native HTML `<details>` — is the verbatim 75-word block reachable enough for regulator-readability requirements (US Investment Advisers Act / EU MiFID II / UK FSMA 2000)?
- **Option C:** Does promoting the three-line negation to hero create any **affirmative claim risk**? Reading «Provedo will not tell you what to buy» from a regulator-perspective — does framing the negation as positioning copy (vs disclaim copy) change interpretation? E.g., does it imply that everything ELSE Provedo says IS advice-by-omission?
- **Option B:** Audience-headline «For investors who hold across more than one broker.» — any «targeted advertising to specific investor cohort» concern under jurisdictional advertising rules?

### For brand-voice-curator

- **Universal:** Sign-off required on time-anchor sub-line cadence. R3 §11.Q1: «every broker. every position.» — does this drift toward Stripe-imperative anti-Sage register, or hold Magician-Sage compactness?
- **Option A:** JBM-mono-accent in §S6 closer (vs italic Inter) — does technical-Sage-Magician register read correct, or does mono code «product/dev tool» (off-archetype for fintech)?
- **Option B:** «Provedo leads you through every position, every dividend, every drawdown. Five minutes a week.» — does the scope-list cadence pull toward Outlaw/Hero (capability-claim register) or hold Magician-Sage observation register? Specifically: is the present-tense upgrade «leads» (vs current «will lead») an improvement or a Sage-foresight-loss?
- **Option C:** Hero hardest call. Does negation-only hero **subdue Magician** to a degree that violates the «Magician primary + Sage modifier» positioning lock? Or does the §S2 typing-reveal restore Magician balance? If yes, where on the page does Magician resurface adequately?
- **Option C:** Audience-whisper «For investors who hold across more than one broker.» under negation hero — does it read as ICP-naming (correct) or as ICP-recruiting (slight Outlaw/Hero drift)?

---

## §7 Open questions for PO (via Navigator)

These are the strategic questions the synthesis cannot close. Phase 3 validators provide ruling on per-domain technical questions; PO provides direction on:

1. **Strategic posture choice.** «Show / tell / refuse» — A / B / C. Strongest single-decision lever.
2. **Hero-lock reopening.** v3.1 hero is PO-locked 2026-04-25. Options B and C both reopen it. Is the lock open for v4 or must hero stay verbatim?
3. **Slice cadence.** Single PR vs two-slice ship — A favors single PR; B and C require two slices. PO timing constraint?
4. **Phase-3 validator dispatch budget.** Option C requires finance-advisor + legal-advisor + brand-voice-curator coordinated rulings. Higher coordination cost vs A/B; OK to spend?

---

## Files referenced

- `docs/reviews/2026-04-27-ai-tool-landing-audit-product-designer.md` (R1)
- `docs/reviews/2026-04-27-fintech-competitor-landing-audit-user-researcher.md` (R2)
- `docs/reviews/2026-04-27-landing-trends-cro-content-lead.md` (R3)
- `docs/reviews/2026-04-26-finance-advisor-landing-review.md`
- `docs/reviews/2026-04-26-legal-advisor-landing-review.md`
- `docs/reviews/2026-04-26-strong-competitor-landing-audit.md`
- `docs/content/landing-provedo-v2.md`
- `docs/04_DESIGN_BRIEF.md` v1.4
- `docs/product/04_BRAND.md` v1.0
- `docs/product/BRAND_VOICE/VOICE_PROFILE.md` post-Provedo-lock
- `apps/web/src/app/(marketing)/page.tsx` (HEAD `409cda9`, post-`8cb509b`)

**Word count:** ~4 750. Within 3 500-5 000 budget.

**END redesign-synthesis-product-designer.md**
