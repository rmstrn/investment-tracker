# Phase-3 Brand-Voice-Curator Validation — Landing v4 Redesign Synthesis

**Author:** brand-voice-curator (Phase-3 validator dispatch)
**Date:** 2026-04-27
**Inputs read in order:**
1. `docs/product/BRAND_VOICE/VOICE_PROFILE.md` (post-Provedo-lock; 7-criterion C1-C7 + 5-item EN guardrails)
2. `docs/product/BRAND_VOICE/REFERENCES_LIVING.md` (15+12 corpus, threshold HIT)
3. `docs/product/04_BRAND.md` v1.0 (tagline locked «Notice what you'd miss»; tone-of-voice surface map; verb-allowlist + banned co-occurrence)
4. `docs/reviews/2026-04-27-redesign-synthesis-product-designer.md` (the synthesis under review; Phase-3 questions §6)
5. `docs/reviews/2026-04-27-fintech-competitor-landing-audit-user-researcher.md` (R2 voice 2x2 — Provedo's lower-friendly information-only quadrant uncontested)
6. Cross-checked against `docs/content/landing-provedo-v2.md` (current shipped copy) for fingerprint baseline

**Independence statement:** Right-hand has issued a preliminary weighted recommendation for Option A. This report does NOT defer to that recommendation. Voice-fingerprint analysis is conducted independently against the locked profile + reference corpus. Hero-lock reopening is a brand-voice-curator call.

**HARD RULES respected:** Rule 1 (no spend) · Rule 2 (no PO impersonation) · Rule 3 (independent verdict in parallel multi-specialist dispatch) · Rule 4 (no rejected predecessor name).

---

## §0. Voice anchor recap (operational baseline applied below)

The locked voice profile sets four load-bearing constraints that every line evaluated below must satisfy:

1. **Archetype lock.** Magician primary + Sage strong-modifier + Everyman warmth-modifier. Magician 67% / Sage 50% / Everyman 42% reference-derived match. Order matters: Magician must LEAD, Sage qualifies.
2. **EN verb-allowlist (Provedo as agent-subject).** provides clarity / context / observation / foresight · sees / sees ahead / foresees · surfaces / shows / cites / connects / notices · leads through (restrained EN equivalent of RU «проведу»).
3. **5-item EN banned co-occurrence.** advice / advise / advisory · recommendation / recommend · strategy / strategic · suggestion / suggest · guidance-on-action (splitter rule — substitute «clarity» or «observation»).
4. **Anti-tone registers explicitly rejected.** advisor-prescriptive · profit-aggressive (Outlaw / Hero) · surveillance-creepy · companion-warm-Sidekick · fintech-infrastructure-serious-only (the borrowed-anchor R16 register; Stripe is the *edge of tolerance*, not the target).

Reference 2x2 from R2 §4: Provedo sits in the **lower-friendly quadrant — information-only with Everyman warmth.** Uncontested by direct peers (Wealthfolio is closest but skews technical-developer; Kubera is closest information-only but skews technical-premium). **Voice fingerprint IS positioning differentiator** — drift away from this quadrant erodes the only competitive moat the page carries against Getquin / Copilot / Monarch's advice-y-friendly cluster.

---

## §1. Question-by-question rulings

### Q1 (Universal) — Time-anchor sub «Five minutes a week. Every broker. Every position.»

**Verdict: BORDERLINE — drift toward Stripe-imperative anti-Sage register, partial fingerprint loss. Mitigatable with one rewrite.**

**Voice analysis.**
- The anaphora «Every X. Every Y.» fragmented by periods is the Stripe canonical cadence («Move money. Move data.» / «Build for the platform of the future.»). VOICE_PROFILE explicitly flags Stripe as the **edge of tolerance** for the modern-tech-tool-2020s register, not the target — the borrowed-anchor R16 trap that 17 prior naming rounds drifted into. The fragment-cadence tilts further into Stripe-territory than Provedo's locked Sage observation register supports.
- Compare authorized voice tokens from `04_BRAND.md` §5 (tone-of-voice per surface map):
  - Coach surface: «Provedo notices: your tech allocation grew 8% this quarter» — **substantive observation** (specific number, named asset class, named timeframe).
  - Insights surface (weekly digest): «Three things this week: dividends ($124), NVDA at 52w high (14% of holdings), EUR cash drag (-2.1% to inflation)» — **substantive triplet** (specific dollars, specific tickers, specific deltas).
- The Sage-Magician fingerprint is **substantive observation** over **abstract scope-claim**. «Every broker. Every position.» is *abstract scope-claim* — it tells the reader what surface area Provedo covers, but it does not let the reader hear a Provedo observation. Compactness for its own sake = Stripe; compactness with embedded observation = Provedo.
- Allowlist check: no banned co-occurrence. No advice / recommendation / strategy / suggestion. Lane A: PASS.
- Archetype check: «Five minutes a week» is **Everyman** (accessible time-promise, friendly to multi-broker millennial). «Every broker. Every position.» is **scope-claim Hero** (capability-coverage register). Magician is absent. Sage is implicit at best.

**Why this matters for the locked positioning.** The R2 §4 voice 2x2 places Provedo's protected quadrant at lower-friendly (information-only + warm). The Stripe-cadence drift pulls TOWARD upper-technical (the empty competitive quadrant Snowball already occupies, dryly). The fingerprint loss is small per-line but compounds across the page rhythm if multiple sub-lines adopt this cadence.

**Recommended rewrite (preserves time-anchor value, restores Sage substantive register):**
- v3.1 current sub: «Notice what you'd miss across all your brokers.» (Sage-clean, allowlist «notice», substantive «miss».)
- Option A as proposed: «Five minutes a week. Every broker. Every position.» (Stripe-cadence drift; abstract scope.)
- **brand-voice-curator preferred rewrite #1:** «Five minutes a week — every broker, every position you hold.» (single sentence, comma-separated; «you hold» grounds the abstract scope in user-side substance. Allowlist: passive — Provedo not the subject of the verb.)
- **brand-voice-curator preferred rewrite #2 (more conservative — keeps current sub, adds time-anchor in proof bar instead):** Hold v3.1 sub «Notice what you'd miss across all your brokers.» Move «Five minutes a week» to S2 proof bar cell as the time-anchor cell (replacing or alongside «4 demo scenarios»). This puts the time-anchor in the *factual proof* register where it lands as data, not as cadence.

The synthesis frames Q1 as a drift-or-hold binary. The actual answer is **drift-mitigable** — keep the time-anchor signal (it's a real R3 §2 trend-fit gap closure), but route it through a rewrite that doesn't import the Stripe fragment-cadence wholesale.

---

### Q2 (Option A) — JBM-mono accent in §S6 closer

**Verdict: REJECT mono-italic. ACCEPT mono-non-italic conditionally as a single typographic pause. Default Inter italic.**

**The closer copy (locked candidate #2):** «You hold the assets. Provedo holds the context.»

**Voice analysis.**
- The §S6 mid-page block is the page's **Sage editorial slot** — gravitas, restraint, two-clause antithesis structure. It is the highest-prestige typographic surface on the page and the closer is the highest-prestige line within it. Whatever typographic choice carries it sets the brand register's highwater mark.
- JetBrains Mono is in the locked typography stack (Inter + JBM per visual lock A). On the proof bar it carries **numerical precision** signal — `1000+ brokers` / `$9/mo` etc. That assignment has set the in-product semantic of JBM = «this is a precise, technical, computed fact».
- Reusing JBM for an editorial line shifts the line from **literary observation register** (Inter italic = quotation, prose, restrained voice) to **technical precision register** (mono = computed output, terminal print, code-comment, fact). For a Sage-archetype antithesis line, the literary register is correct; the technical register is off-archetype.
- Worse: **JBM-mono italic** is a near-universal code-editor convention for *comments* (greyed-out non-executing prose inside source). To a reader who codes — and Provedo's ICP A productivity-native multi-broker millennial cohort skews technical — italicized mono reads as «code comment», not as «brand quotation». That's product/dev-tool genre creep, exactly the off-archetype risk the synthesis Q2 worries about.
- JBM-mono **non-italic** is more defensible: it reads as a typographic pause / accent / variant-typography device rather than a quotation. Setting «Provedo holds the context.» in non-italic JBM at the same size as the Inter body, with no other ornamentation, can land as a deliberate compositional gesture (mono = the clausal twist; non-mono = the prose that set it up). This is a single-instance device, not a pattern.

**Decision matrix:**

| Treatment | Register read | Verdict |
|---|---|---|
| Inter italic (current) | Literary Sage quotation | **DEFAULT — ship this.** |
| JBM-mono italic | Code comment / terminal output | **REJECT.** Off-archetype dev-tool drift. |
| JBM-mono non-italic, single line, same body size | Typographic pause / clausal twist | Acceptable as A/B test variant only; not default. |

**Recommendation to product-designer:** Ship Inter italic as default v4. If JBM-mono test variant is desired, run it as a **post-launch single-page A/B** with non-italic treatment only, instrumented for read-time / scroll-depth at §S6. Do NOT make mono-italic the v4 default.

---

### Q3 (Option B) — Sub-line cadence «Provedo leads you through every position, every dividend, every drawdown. Five minutes a week.»

**Verdict: REJECT. Two compounding voice losses — present-tense Sage-foresight-loss + scope-list capability-claim drift toward Outlaw/Hero. Highest fingerprint cost of any option.**

**Voice analysis — two independent failure modes stacked.**

**Failure 1 — «leads» vs «will lead» (Sage-foresight-loss).**
- The locked Provedo etymology is *provedere* = «I provide for, **I foresee**, I take care of». Foresight is the Italian-side load-bearing semantic. The hero verb «will lead» is the only EN surface that carries the *foresee*-future semantic — present-tense «leads» strips the future-orientation entirely.
- VOICE_PROFILE archetype anchor: «Magician — Foresight as Magician (NOT predictive): "Provedo sees the rebalance window approaching for your retirement allocation." — foresight = visibility-of-pattern, not market-prediction.» The future-tense modal is part of the foresight register; collapsing to present strips it.
- The R3 §2 trend-fit argument is «present-tense reads more confident in 2026 hero copy». That's a generic landing-trend observation. For Provedo specifically, the future-modal IS the etymology-anchor — it's the half-load-bearing surface that makes «*provedere*» legible to the EN reader who doesn't know Italian. Trading «will lead» for «leads» = trading legible etymology for generic 2026-trend confidence. Wrong trade.

**Failure 2 — Scope-list cadence «every position, every dividend, every drawdown» (capability-claim drift).**
- Three abstract scope-claims in anaphora = the canonical capability-claim register. This is **Hero archetype** («I can do X, Y, Z!») not Sage observation register («I noticed X about your specific holdings»).
- Compare authorized voice tokens (`04_BRAND.md` §5 Coach + Insights surfaces): observation triplets are *substantive* (specific dollars, specific tickers, specific deltas). Scope-claim triplets are *abstract* (categories, not instances). Provedo's locked register is substantive; this sub-line is abstract.
- VOICE_PROFILE anti-tone register: «NOT profit-aggressive: "Maximize your gains / beat the market / outperform" — wrong archetype (Outlaw / Hero), wrong audience pull (anti-ICP day-trader).» The «every X, every Y, every Z» cadence is in the same archetype family as the Outlaw register — both are capability-claim grammar, regardless of whether the substantive content is regulatory-compliant.
- R2 §4 voice 2x2 implication: this sub pushes the page UP the advice-y axis (capability-claim register reads as advice-adjacent in cold-traffic parsing) and SLIGHTLY RIGHT toward the friendly-Sharesight «smarter investor» quadrant. Both axis-shifts erode the protected lower-friendly information-only quadrant.

**Failure 3 (compounding) — Length budget.**
- The proposed sub is 95 characters. Current v3.1 sub is 47 characters. Doubling the sub-length to import scope-list anaphora trades typographic restraint (Sage gravitas device) for verbosity. The compactness floor is a load-bearing C2 criterion in VOICE_PROFILE; sub-lines inherit that discipline.

**No mitigation possible without strip-and-rewrite.** Cannot fix one failure without touching the other; cannot keep the scope-list at this length without violating compactness; cannot adopt present-tense without losing foresight-anchor. This is not a trim job — it's the wrong sub.

**Recommended Option B sub if Option B were to ship:** «Notice what you'd miss across every broker — patterns, dividends, drawdowns.» (preserves current sub's Sage observation register, adds R2 Opp #3 pattern-artefact list, drops the «Provedo leads» capability-claim subject, holds the future-tense Sage-foresight in the hero head «will lead» where it belongs).

---

### Q4 (Option C) — Negation hero — does it subdue Magician below the lock?

**Verdict: YES — violates Magician-primary positioning lock. §S2 typing-reveal does not adequately restore. Hero-position-of-archetype matters as much as page-presence-of-archetype.**

**Voice analysis.**

**The negation hero copy:**
> Provedo is not a robo-advisor.
> Provedo is not a brokerage.
> Provedo will not tell you what to buy.
>
> What Provedo does: leads you through your portfolio across every broker, with sources for every answer.

**Archetype-by-line read:**

| Line | Archetype carried | Register |
|---|---|---|
| 1 «not a robo-advisor» | Sage (disclaim) | Pure Lane A negation |
| 2 «not a brokerage» | Sage (disclaim) | Pure Lane A negation |
| 3 «will not tell you what to buy» | Sage + slight Everyman (user-empowerment) | Pure Lane A negation |
| 4 affirmation closer | Magician (leads + foresight) + Sage (sources) | Mixed — Magician finally appears |

**The structural problem.** Hero-position is the brand-fingerprint anchor. Whatever archetype LEADS the hero defines the page's archetype baseline; everything below modifies. Option C's hero is **3 lines of pure-Sage disclaim** before Magician appears in the 4th line. To a reader scanning the page in 4 seconds (the hero-budget the synthesis works against), Magician has not appeared. The page reads as **Sage-only / Sage-overdosed** — exactly the anti-archetype VOICE_PROFILE flags as «Sage-overdosed-academic» (Noesis-territory) when not balanced by Magician action.

**Critical reframe.** This is not an Option C problem; this is a *positioning-lock-violation* problem. The locked archetype is «Magician + Sage primary · Everyman modifier» — this is not a 50/50 split where any presence of all three is sufficient. **Magician is primary.** The hero must lead with Magician.

R2 §4 voice 2x2 confirms the cost: Option C «deepens lower-friendly information-only quadrant even further than v3.1 — pulls toward Kubera's information-coded territory more than Provedo's current Everyman-warmer position.» The synthesis itself acknowledges the drift. From a voice-fingerprint perspective, this drift is not «mixed risk» (synthesis language); it is **a positioning-lock breach**. Provedo cannot become Kubera-coded without losing the differentiator R2 identifies as protected.

**Does §S2 typing-reveal restore Magician?** Partially. The typing animation IS a Magician device (chat-as-pattern-recognition surface coming alive, tool-in-hand foresight). But:
- Hero archetype baseline is set by the time §S2 loads — first impression has already happened.
- §S2 typing-reveal is *demonstration*, not *brand-claim*. The brand-claim slot is the hero. Demonstration without prior claim reads as «interesting capability» not «defining product identity».
- A reader who scans hero, decides «this is a disclaim-coded Sage tool», and bounces (R3 §7.V5 explicitly warned of this risk) never reaches §S2.

**Where Magician resurfaces adequately on the page (if Option C ships):** Magician-substantive observation is carried by §S5 (Insights bullets — «Provedo holds context across every broker — knows what you own, what changed since last week»), §S4 (demo tabs — pattern-recognition coach), and §S6 (editorial mid-page closer — «Provedo holds the context»). These are strong Magician surfaces. **They do not, however, retroactively fix a hero that subdued Magician.** The page-rhythm reads as «Sage gravitas first, Magician quietly second» — a polarity inversion of the locked archetype order.

**Lane A note.** Option C does have the strongest Lane A discipline of the three (synthesis is correct on this — the negation pre-empts implicit-rec drift to score 0). But Lane A discipline is *one* constraint; the archetype lock is another. Optimizing one at the cost of the other is not net-positive when both are load-bearing.

**Recommendation if Option C is desired despite the violation:** Reorder hero so the affirmation closer becomes line 1 (Magician leads), three negation lines follow as Sage modifier. This restores the Magician-leads-Sage-modifies order. Drafted variant:

> Provedo leads you through your portfolio — across every broker, with sources for every answer.
>
> Not a robo-advisor.
> Not a brokerage.
> Won't tell you what to buy.

Magician statement first; three terse Sage disclaims qualify. Same content, same Lane A signal, archetype order respected. **This is Option C reordered, not Option C as drafted — the synthesis-as-drafted Option C is rejected.**

---

### Q5 (Universal) — Audience-whisper «For investors who hold across more than one broker.»

**Verdict: CLEAN. Reads as ICP-naming, not ICP-recruiting. Approve for ship in any option.**

**Voice analysis.**
- Construction is *descriptive condition* («who hold across more than one broker») not *aspirational claim* («who want to maximize returns» / «who are ready to take charge»). Descriptive = Sage-observation register; aspirational = Outlaw/Hero recruiting register. The line is on the correct side of the gradient.
- Reference precedent: Kubera «for those who manage their own wealth» — same construction (descriptive condition naming a real cohort), same archetype effect (Sage observation that the visitor either is or isn't, no recruitment). R2 names this as the cleanest ICP-naming in the direct-competitor set.
- Compare counter-example: Sharesight «Be the smarter investor» — aspirational/normative, registers as recruitment because «smarter» implies a self-improvement claim. The proposed Provedo line carries no such normative claim.
- Allowlist check: «hold» is in the allowlist verb-cluster («holds context» / «holds your portfolio»). User-side conjugation here («who hold») extends the allowlist consistently.
- Archetype check: Everyman primary (direct address to a real audience), Sage modifier (descriptive observation). Magician is absent — but this is a sub-line, not a hero, so Magician absence is acceptable; the hero carries Magician.
- Lane A check: no advice / recommendation / strategy / suggestion. No personalization claim («built for you»). Cohort is described, not addressed. PASS.

**Outlaw/Hero drift concern (synthesis Q5 specifically asks).** The drift would manifest as «for investors who **want to**…» / «for the multi-broker investor **ready to**…» — modal-verb constructions that imply recruitment. The proposed line uses indicative mood («who hold») not modal — no recruitment grammar. CLEAN.

**Minor refinement note (LOW priority, not blocking).** «More than one broker» is plain; «across multiple brokers» would be more compact but slightly less Everyman-warm. The current phrasing is correct for the Everyman-modifier register. Hold as drafted.

---

### Q6 (Meta) — Option D = ship 7 universals as v3.2 patch, defer A/B/C strategic choice

**Verdict: STRONGLY SUPPORT. From voice-fingerprint perspective, Option D is the cleanest path. Supports as primary recommendation over Options A / B / C.**

**Voice analysis.**

The 7 universal improvements (synthesis §5) are:
1. Granola-grade demo content (replace bracketed placeholders)
2. Three-layer disclaimer pattern (R3 §9)
3. Footer waitlist trial-CTA leak fix (R3 §8.M3)
4. Single weighted testimonial + honest pre-alpha line
5. Drop «Lane A —» prefix from proof bar cell #4
6. Add audience-whisper line «For investors who hold across more than one broker.»
7. Hold v3.1 finance/legal patches at commit `8cb509b` verbatim

**Voice-fingerprint impact of each (sequenced):**

| # | Universal change | Fingerprint effect |
|---|---|---|
| 1 | Granola-grade demo content | **Strengthens** — replaces abstract scope-claim placeholders with substantive observation tokens (specific dollars, tickers, dates). Pure Sage-Magician register reinforcement. |
| 2 | Three-layer disclaimer | **Neutral-to-strengthens** — Layer 1 plain-language summary («Provedo provides information about your portfolio. It is not investment advice — every decision stays yours.») uses allowlist verb «provides information» + observation register + Everyman direct-address. Voice-clean. |
| 3 | Footer waitlist fix | **Neutral** — bug fix, no voice impact. |
| 4 | Single weighted testimonial | **Strengthens** — collapses repetitive triple-quote (currently three Roman M. cards) into single restrained quote + honest pre-alpha line. Restraint = Sage gravitas device. |
| 5 | Drop «Lane A —» prefix | **Strengthens** — «Information. Not advice.» reads as Sage observation; «Lane A — information, not advice.» is internal-jargon-coded (Lane A is a project-internal taxonomy term, not a reader-facing concept). |
| 6 | Audience-whisper | **Strengthens** — see Q5 ruling above. Adds Everyman direct-address that v3.1 hero currently lacks. |
| 7 | Hold v3.1 finance/legal patches | **Required** — these are Lane A guardrail surfaces; reverting them is non-negotiable. |

**Aggregate fingerprint score:** 4 strengthens / 2 neutral / 1 required-hold / 0 weakens. **Net: voice-fingerprint strictly improves vs v3.1 baseline, with zero introduced drift surfaces.**

**What Option D protects that Options A/B/C variably risk:**
- **Hero remains locked** at «Provedo will lead you through your portfolio.» — Magician-foresight «will» preserved. Option B explicitly trades this away (Q3 verdict: REJECT). Option C explicitly subdues Magician in hero (Q4 verdict: violates lock).
- **No new Stripe-cadence import** — the «Five minutes a week. Every broker. Every position.» fragment-cadence (Option A's chosen sub) is not adopted. Time-anchor signal is preserved by routing the «5 minutes a week» frame to the proof bar cell (Q1 mitigation #2 above), not by importing Stripe-cadence into the hero sub.
- **No JBM-mono editorial typography risk** (Q2 above). §S6 closer remains in Inter italic.
- **Lower coordination cost** — Phase-3 validator dispatch is lighter (no negation-hero legal-readability ruling required; no audience-naming personalization-drift finance ruling required at hero scale).

**Why this is independently the right voice-call (not just a default-by-cowardice).** The fingerprint analysis above shows Option D is not just «defer the decision» — it's «ship the changes that strictly improve voice without taking on archetype-lock risk». The strategic posture choice (show / tell / refuse — A / B / C) is downstream of «is the current voice-fingerprint preserved?». Locking voice-fingerprint preservation FIRST creates clean ground for any subsequent A/B/C decision, because the page voice will be measurably better with the 7 universals than with v3.1, AND the hero-lock decision can be re-opened post-alpha against actual user data rather than against synthesis hypothesis.

**One condition for Option D ship.** Q1 mitigation must be applied: route «5 minutes a week» to the S2 proof bar cell (not into the hero sub). The Option A hero sub as drafted («Five minutes a week. Every broker. Every position.») does NOT ship in Option D — only the v3.1 hero «Notice what you'd miss across all your brokers.» holds.

---

## §2. Voice-fingerprint score per option (out of 10)

Scoring methodology: score reflects degree of voice-fingerprint preservation against the locked Magician+Sage+Everyman archetype anchor + verb-allowlist + 5-item EN guardrails + R2 §4 protected-quadrant positioning. 10 = strict improvement vs v3.1 baseline; 7 = preservation parity; 5 = mixed (some strengthens, some drifts); ≤4 = net fingerprint loss.

| Option | Score | One-line rationale |
|---|---|---|
| **A — Editorial Sage** | **6.5 / 10** | 7 universals are voice-strengthening (rated +1 to +1.5 vs v3.1 baseline); Stripe-cadence sub-line drift (Q1) drops the score from 8 to 6.5. Mitigatable to 8.5 if Q1 rewrite adopted. |
| **B — Narrowed Wedge** | **3.5 / 10** | Hero sub-line is twin-failure (Q3): Sage-foresight-loss on «leads» + Outlaw/Hero capability-claim drift on scope-list. Audience-naming hero is voice-clean (Q5) but doesn't compensate for the sub damage. R2 §4 protected-quadrant erosion in two axes simultaneously. |
| **C — Negation-Forward** | **4.5 / 10** | Hero violates Magician-primary archetype lock (Q4); §S2 typing-reveal partially restores but cannot retroactively fix archetype-leads order. Negation-as-positioning is a coherent strategic move but the as-drafted hero copy *order* is wrong. Reorderable variant (Magician-leads-Sage-modifies) would score 7.5. |
| **D — 7 universals as v3.2 patch (no A/B/C)** | **9 / 10** | 4 strengthens / 2 neutral / 1 required-hold / 0 weakens. Hero-lock preserved (Magician-foresight «will» intact). No Stripe-cadence import. No JBM-mono editorial risk. Audience-whisper added cleanly. R2 §4 protected-quadrant fully held. **Highest fingerprint-preservation path.** |

**Note on the 9/10 for Option D.** Not 10/10 because the audience-whisper is a sub-line addition that the hero-lock decision did not formally include — adding it inherits a small product-designer placement decision that needs Phase-3 a11y-architect concurrence on reading-order (per synthesis scope estimate). With that concurrence, full 10/10.

---

## §3. Verdict

**SUPPORT-ALT-D** (ship the 7 universals as v3.2 patch; defer A/B/C strategic posture decision until post-alpha against actual conversion / read-time / cohort-quality data).

**One-line rationale.** Option D strictly improves voice-fingerprint vs v3.1 (9/10) without reopening the hero-lock or importing any of the three drifts the as-drafted A/B/C hero sub-lines carry (Stripe-cadence in A, dual-failure scope-list in B, archetype-lock violation in C); the strategic-posture decision (show / tell / refuse) is more honestly made against alpha-launch data than against synthesis hypothesis.

---

## §4. Specific copy-edit recommendations (4)

These apply to whichever option ships (Option D specifically; flagged where they'd also apply to A / B / C if those were chosen).

### Edit #1 — Hero sub-line treatment

**Current v3.1:** «Notice what you'd miss across all your brokers.»

**Option A as drafted:** «Five minutes a week. Every broker. Every position.»

**brand-voice-curator preferred for Option D ship:** Hold v3.1 sub verbatim. Move «5 minutes a week» to S2 proof bar as a time-anchor cell (replacing or alongside «4 demo scenarios on real positions»). This preserves the time-anchor signal R3 §2 trend-fit value while routing it through the factual-proof typographic register where it lands as data, not as Stripe-imperative cadence.

If the synthesis-as-Option-A is chosen instead, the hero sub MUST be rewritten to: **«Five minutes a week — every broker, every position you hold.»** (single sentence, comma-separated; «you hold» grounds the abstract scope in user-side substance; passive grammar avoids Provedo-as-subject-of-capability-claim).

### Edit #2 — §S6 editorial closer typography

**Current:** Inter italic, candidate #2 «You hold the assets. Provedo holds the context.»

**Option A test variant:** JBM-mono italic.

**brand-voice-curator default:** Ship Inter italic. Reject JBM-mono italic (reads as code-comment, off-archetype dev-tool drift). If a typographic experiment is desired, run JBM-mono **non-italic** as a single-instance pause device, NOT as default and NOT italic — and instrument with read-time / scroll-depth A/B post-launch.

### Edit #3 — Layer 1 plain-language disclaimer wording

**R3 §9 draft (proposed for adoption in all options):** «Provedo provides information about your portfolio. It is not investment advice — every decision stays yours.»

**Voice-check verdict:** **APPROVE.** All four element-pairs are clean — «provides information» (allowlist verb-form), «not investment advice» (5-item guardrail compliant — disclaim register, not claim register), «every decision stays yours» (Everyman direct-address + user-empowerment per R2 Opp #4). 19 words; within R3's 14-20 budget.

**Minor refinement (LOW priority, optional):** Substitute «about your portfolio» → «about what you hold» — extends the «you hold» motif from §S6 closer into the disclaimer, creating a Sage-rhyme between editorial slot and regulatory slot. Not blocking; both versions ship clean.

### Edit #4 — §S10 FAQ Q1 strengthening (applies to Option C as drafted; considered for Option D)

**v3.1 current Q1:** «Does Provedo give investment advice? — No. Provedo provides clarity, observation, context, and foresight — never advice, recommendations, or strategy. Lane A: information, not advice.»

**Option C synthesis proposed strengthening:** Q1 leads with «No, Provedo does not give investment advice. It provides clarity, observation, context, and foresight.»

**Voice-check verdict:** **CONDITIONAL APPROVE for Option C; HOLD v3.1 wording for Option D.**

The proposed strengthening is voice-clean — drops the internal-jargon «Lane A:» prefix (consistent with Edit #5 universal proof-bar prefix-drop), reorders to lead with the negation. For Option C ship, this strengthening reinforces the hero negation-rhyme.

For Option D ship, the v3.1 wording is already voice-clean; Option C's strengthening adds a Sage-disclaim rhyme that doesn't have the hero negation to rhyme to, making it less load-bearing. Hold v3.1 wording in Option D.

---

## §5. Disagreement with right-hand's preliminary Option A recommendation

**Direct disagreement, registered.**

Right-hand's preliminary recommendation cites four reasons for Option A: (1) lowest-risk, (2) single PR, (3) doesn't reopen 2-day-old hero-lock, (4) voice fingerprint preserved best. Of these four, brand-voice-curator agrees with #2 (single PR is operationally clean), agrees with #3 (preserving hero-lock IS the correct voice instinct), and **disagrees with #4 (voice fingerprint preserved best)** when measured against the actual locked profile.

**The disagreement is specific.** Option A as drafted preserves the hero HEAD («Provedo will lead you through your portfolio.») which is the load-bearing voice-anchor. But Option A also adopts R3.V1 time-anchor sub «Five minutes a week. Every broker. Every position.» which imports Stripe-cadence drift (Q1 verdict above). Right-hand's «voice fingerprint preserved best» judgement weights hero-head preservation correctly but does not surface the sub-line drift cost. The honest score-out-of-10 for Option A as drafted is 6.5, not 9-10.

**The fingerprint-preservation crown belongs to Option D**, not Option A. Option A scores 6.5 because it accepts a sub-line drift that Option D rejects. Option A is *mitigatable to 8.5* with the Edit #1 rewrite — but as the synthesis is currently structured, the choice is binary (adopt R3.V1 or don't), and Right-hand's preliminary recommendation reads as adopting R3.V1 wholesale.

**Practical consequence.** If PO accepts Right-hand's preliminary Option A recommendation as-currently-formulated, the page ships with a sub-line that drifts toward the borrowed-Stripe-anchor register that 17 prior naming rounds taught us costs the brand. The sub-line drift is small per-line but compounds with R2 §4 voice-2x2 positioning erosion — Provedo's protected lower-friendly information-only quadrant erodes axis-by-axis as each surface accepts «small» drifts.

**brand-voice-curator recommendation to Right-hand and PO.** Re-frame the choice as Option D primary / Option A secondary:
- **Option D (recommended):** Ship the 7 universals as v3.2 patch. Hero-lock preserved. No Stripe-cadence import. Voice-fingerprint score 9/10.
- **Option A-amended (acceptable fallback):** Ship Option A WITH Edit #1 hero sub rewrite («Five minutes a week — every broker, every position you hold.»). Voice-fingerprint score 8.5/10.
- **Option A as drafted (NOT recommended by voice):** Voice-fingerprint score 6.5/10 — cleaner-than-B-or-C but introduces a small drift Option D doesn't carry.
- **Option B as drafted (REJECT from voice perspective):** Voice-fingerprint 3.5/10 — twin-failure sub-line.
- **Option C as drafted (REJECT from voice perspective):** Voice-fingerprint 4.5/10 — archetype-lock violation. Reorderable variant (Magician-leads-Sage-modifies, see Q4) would score 7.5.

**Hero-lock reopening greenlight (the call brand-voice-curator owns):** **NOT GRANTED for Options B or C as drafted.** Both reopen the hero in ways that violate the locked archetype anchor (B: Sage-foresight-loss; C: Magician-subdued). **GRANTED conditionally for Option A** only if Edit #1 rewrite is adopted (the as-drafted Option A still touches the hero via sub-line replacement, which is hero-zone change). **Not needed for Option D** — Option D ships the audience-whisper as a sub-line ADDITION that doesn't replace any hero-locked text; the locked head + locked sub stay verbatim, the whisper is additive.

---

## §6. Phase-3 next-action summary

| Item | Action | Owner |
|---|---|---|
| 1 | Surface Option D as primary recommendation in Phase-3 synthesis to PO | Right-hand |
| 2 | If PO chooses Option A: enforce Edit #1 hero sub rewrite | content-lead + product-designer |
| 3 | If PO chooses Option B: REJECT as-drafted hero sub; require strip-and-rewrite | content-lead + brand-voice-curator second-pass |
| 4 | If PO chooses Option C: REJECT as-drafted hero order; require Magician-leads-Sage-modifies reorder | content-lead + brand-voice-curator second-pass |
| 5 | Audience-whisper «For investors who hold across more than one broker.» — APPROVE for any option | product-designer (placement) + a11y-architect (reading-order) |
| 6 | Layer 1 disclaimer wording — APPROVE for any option | legal-advisor (legal-read concurrence) |
| 7 | §S6 closer typography — DEFAULT Inter italic; reject JBM-mono italic | product-designer |

---

## §7. Files referenced

- `docs/product/BRAND_VOICE/VOICE_PROFILE.md` (post-Provedo-lock)
- `docs/product/BRAND_VOICE/REFERENCES_LIVING.md` (15+12 corpus)
- `docs/product/04_BRAND.md` v1.0 (tagline + tone-of-voice surface map + brand-name usage rules)
- `docs/reviews/2026-04-27-redesign-synthesis-product-designer.md` (synthesis under review)
- `docs/reviews/2026-04-27-fintech-competitor-landing-audit-user-researcher.md` (R2 voice 2x2 + Lane A gradient)
- `docs/reviews/2026-04-27-ai-tool-landing-audit-product-designer.md` (R1 — referenced via synthesis)
- `docs/reviews/2026-04-27-landing-trends-cro-content-lead.md` (R3 — referenced via synthesis)
- `docs/content/landing-provedo-v2.md` (current shipped copy, fingerprint baseline)

**Word count:** ~3 800. Deliverable complete.

**END phase3-brand-voice-curator-validation.md**
