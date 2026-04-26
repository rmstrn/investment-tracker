# Phase-3 Legal-Advisor Validation — v4 Landing Redesign Synthesis

**Author:** legal-advisor (independent Phase-3 dispatch)
**Date:** 2026-04-27
**Inputs reviewed:**
- `docs/reviews/2026-04-27-redesign-synthesis-product-designer.md` (synthesis A/B/C + §6 questions)
- `docs/reviews/2026-04-27-landing-trends-cro-content-lead.md` (R3 §9 three-layer disclaimer source)
- `docs/reviews/2026-04-26-legal-advisor-landing-review.md` (own prior v3.1 review — `8cb509b` patches verified intact)
- v3.1 source: `apps/web/src/app/(marketing)/_components/MarketingFooter.tsx` lines 71-77 (75-word verbatim block confirmed in tree)

**Method:** Independent pressure-test of right-hand's preliminary Option-A weighted recommendation. Five questions answered (4 from synthesis §6 + 1 meta «Option D» check). Each question reviewed across US SEC / EU MiFID II / UK FCA. Russia 39-ФЗ deferred (geography-lock 2026-04-23).

**Verdict:** **SUPPORT-ALT-D** — partial disagreement with right-hand's Option-A preliminary. Recommend a v3.2 patch slice (universal improvements + 3-layer disclaimer ONLY) BEFORE any A/B/C strategic-posture choice. Detail in §6 below.

**Confidence:** MEDIUM (first-pass internal SME; pre-production launch in any specific market still requires licensed counsel per Rule 1 caveat).

---

## §1 Answer to Question 1 — Layer 1 plain-language disclaimer sign-off

### Proposed Layer 1 (R3 §9 / synthesis §6)
> «Provedo provides information about your portfolio. It is not investment advice — every decision stays yours.»

### Per-jurisdiction read

**US SEC — Investment Advisers Act §202(a)(11) publisher exclusion** + **Rule 206(4)-1 (Marketing Rule, eff Nov 2022)**

The publisher-exclusion test (Lowe v. SEC, 472 U.S. 181 (1985)) has three elements: (a) impersonal, (b) non-discretionary, (c) general circulation. The Layer 1 wording covers (b) explicitly («every decision stays yours» = non-discretionary commitment); element (a) is the load-bearing risk because «information about **your** portfolio» is **personalized to user-uploaded holdings by definition** — that's what the product *is*. The current 75-word footer block addresses this gap with the explicit phrase «does not provide personalized investment recommendations or advice as defined under the U.S. Investment Advisers Act of 1940». Layer 1 as drafted DOES NOT carry the «no personalized recommendation» negation, only the «not investment advice» negation. This matters because a SEC examiner reading Layer 1 standalone (per the question's premise: «without expanding Layer 2») will not see the personalization-element disclaim, only the broader advice-element disclaim. **Adequacy gap: real but small.** The phrase «not investment advice» does substantial defensive work because under SEC interpretation «investment advice» includes personalized recommendation as a constituent element — but the gap is the «belt-and-suspenders» pattern SEC examiners prefer.

**EU MiFID II — Directive 2014/65/EU Article 4(1)(4)** + **ESMA Q&A on investment advice**

Article 4(1)(4) defines «investment advice» as «the provision of personal recommendations to a client». ESMA's interpretation is structurally similar to SEC's — personalization is the gate. Layer 1's «not investment advice» implicitly encompasses «not personal recommendation» under MiFID II framework because the directive's «advice» term is constructed *from* the personalization element. **Adequacy: marginally better than US read.** A MiFID II auditor reading Layer 1 standalone gets the disclaim with less ambiguity than a SEC examiner because the directive's terminology aligns more cleanly with the layperson «investment advice» phrase.

**UK FCA — FSMA 2000 Regulated Activities Order Article 53** + **PERG 8.24-8.30B** + **Consumer Duty (PRIN 2A, eff Jul 2023)**

PERG 8.30B explicitly considers the «implied recommendation» test — does a reasonable reader of the content perceive a recommendation? The negation phrase «not investment advice» plus the affirmative «every decision stays yours» does substantial work here because Consumer Duty *requires* «consumer understanding» — plain-language summary aligns with the regulator's stated preference. **Adequacy: strongest of the three.** FCA actively promotes plain-English disclosures; Layer 1 reads as more Consumer-Duty-compliant than a 75-word legal block.

### Net verdict on Question 1

**SIGNED-WITH-EDIT.** The proposed Layer 1 is acceptable as a layer of a three-layer pattern but NOT acceptable as a standalone disclaimer if Layer 2 expansion is unlikely (e.g., on cold mobile traffic). One word fixes the SEC personalization gap:

**Proposed edit (one word added):**
> «Provedo provides general information about your portfolio. It is not personalized investment advice — every decision stays yours.»

Two changes: «information» → «general information» and «investment advice» → «personalized investment advice». Both insertions are SEC/MiFID/FCA-aligned terms-of-art that examiners actively look for. Word count goes from 21 → 23 (negligible). Voice-check: «general information» is observation-coded, allowlist-clean; «personalized investment advice» preserves the negation force. No advice-co-occurrence violation.

**[ATTORNEY REVIEW]** Final wording must be reviewed by SEC-aware US counsel before US production launch. Counsel may prefer «non-personalized» over «not personalized» as belt-and-suspenders.

---

## §2 Answer to Question 2 — Three-layer disclaimer adequacy

### Question restated
Layer 2 = expandable native HTML `<details>` containing the verbatim 75-word block. Is this «reachable enough» for regulator-readability requirements? Or does jurisprudence/precedent require disclaim copy to be visible-without-interaction in some jurisdictions?

### Per-jurisdiction read

**US SEC — Marketing Rule (Rule 206(4)-1) + general anti-fraud (Section 10(b) / Rule 10b-5)**

The SEC Marketing Rule requires disclosures be «clear and prominent» and not «materially misleading». The Marketing Rule's Adopting Release (Final Rule release 2020-12-22) explicitly addresses hyperlinked / layered disclosures: SEC permits layered disclosure provided the link/expand mechanism is «reasonably accessible» and the underlying disclosure is not buried. The native HTML `<details>`/`<summary>` element is keyboard-accessible by default, screen-reader-accessible by default, and visible-to-cursor by default (the `<summary>` text «Read full disclosures» or equivalent is always visible). **Adequacy: GO.** This pattern is what Wealthfront, Public.com, Robinhood already use; SEC has not enforced against them on this pattern as of 2026-Jan cutoff.

Caveat: the `<summary>` text matters. «Read full disclosures» or «Full regulatory disclosures» = clear-and-prominent invitation. Vague phrasing like «Legal» or «More info» = arguably buried. Recommend exact summary text: **«Full regulatory disclosures (US, EU, UK)»** — explicit jurisdictional invitation signals to a SEC examiner that the link is substantive, not decorative.

**EU MiFID II — Directive 2014/65/EU Article 24(3)** + **ESMA Guidelines on MiFID II Product Governance**

Article 24(3) requires information be «fair, clear and not misleading». The MiFID II framework does not require disclaim text to be visible-without-interaction; layered disclosure is widely used by EU-regulated firms. ESMA's stance on layered disclosures aligns with SEC — accessibility and non-burial are the tests. **Adequacy: GO.** Same `<summary>` text recommendation applies.

**UK FCA — COBS 4.2.1R (fair, clear, not misleading)** + **Consumer Duty PRIN 2A**

This is the jurisdiction where layered disclosure has the *strongest* regulator endorsement. FCA's Consumer Duty explicitly favors plain-language summaries with depth available on demand. FCA Finalised Guidance 22/5 (Consumer Duty, July 2022) discusses «layered information» as a recommended pattern. **Adequacy: GO** — actively preferred over single-block dense legal text.

**Russia 39-ФЗ:** N/A current scope.

### One implementation guardrail

The native HTML `<details>` element has one quirk: when collapsed, the inner content is **not** rendered into the accessibility tree by default in some screen readers (this varies by AT/browser combo). For full a11y + regulatory belt-and-suspenders, recommend the underlying full-text be **also reachable via an always-visible footer link** to `/disclosures` (Layer 3). That way a regulator or an AT user can reach the verbatim text without having to find and operate the `<summary>` toggle. The synthesis already proposes Layer 3 as «post-alpha» — for legal adequacy, **Layer 3 should ship simultaneously with Layer 2, not deferred**. The cost is one route + one rendered MDX page containing the same 75-word block — trivial frontend lift (~30 minutes).

### Net verdict on Question 2

**GO with two conditions:**
1. `<summary>` text = «Full regulatory disclosures (US, EU, UK)» (explicit jurisdictional signal).
2. Layer 3 (`/disclosures` sub-page) ships **simultaneously** with Layer 2, not deferred. The synthesis treats Layer 3 as «post-alpha» — for legal adequacy this needs to move to «ships in same PR».

---

## §3 Answer to Question 3 — Option C affirmative-claim risk

### Question restated
Promoting three-line negation to hero («Provedo is not a robo-advisor. Provedo is not a brokerage. Provedo will not tell you what to buy.») — does framing the negation as positioning copy (vs disclaim copy) change interpretation under any jurisdictional advertising-rules framework? E.g., does it imply that everything ELSE Provedo says IS advice-by-omission?

### The expressio-unius-est-exclusio-alterius concern

This is the «expressio unius» concern — by enumerating specific negations, you imply the negated set is exhaustive (i.e., everything not negated is implicitly affirmed). Standard interpretive canon in common-law jurisdictions (US + UK), softer in EU civil-law jurisdictions but still operative.

### Per-jurisdiction read

**US SEC — Marketing Rule + general anti-fraud**

The SEC Marketing Rule prohibits material misstatements AND material *omissions* «that make a statement, in light of the circumstances under which it was made, not misleading». SEC enforcement actions historically focus on what was *promised* in marketing copy, not on negative-framing inference. A negation-led hero like «Provedo is not a robo-advisor» is structurally similar to disclaimers like «we are not a registered investment adviser» which thousands of fintech publishers, newsletters, and information services use without SEC enforcement. **The expressio-unius concern is theoretical, not enforced.** SEC examiners would focus on (a) does the rest of the page contain personalized recommendation copy?, (b) is the firm operating outside the publisher exclusion?, (c) are users likely to be misled? — not on whether the negation list is exhaustive.

However: there is one operational risk specific to Option C. Hero-position negation **commits the firm publicly** to those specific negations. If product evolution later adds a feature that arguably crosses any of the three lines (e.g., a Plus-tier auto-rebalance suggestion — which would cross «will not tell you what to buy»), the prior-marketing commitment becomes evidence in any future enforcement matter. v3.1 carries the same negation in §S3 mid-page; promoting to hero raises the *visibility* of the commitment but does not create a new commitment. **Marginal increment in commitment-risk.**

**EU MiFID II**

MiFID II marketing rules (MAR / Market Abuse Regulation does not apply here; the relevant rules are in MiFID II Article 24(3) and the EU Marketing Communication framework). The EU framework similarly focuses on misstatements + misleading omissions, not enumerative negation. **Expressio-unius concern: not operative.**

**UK FCA — COBS 4.2** + **financial promotion rules**

This is the jurisdiction where the question matters most. FCA's PERG 8.30B «implied recommendation» test asks whether a reasonable reader would infer a recommendation. The negation list does NOT create implied recommendations — it does the opposite. **However**, FCA's Consumer Duty (PRIN 2A) requires firms to consider whether copy framing creates *any* risk of consumer misunderstanding. A regulator in a future Consumer Duty review *could* ask: «if Provedo prominently negates being a robo-advisor, do consumers infer that everything Provedo positively says is therefore *not* the kind of thing a robo-advisor says — i.e., that Provedo's positive content is *more* trustworthy / safer than a regulated alternative?» This is the most plausible UK FCA concern.

Mitigation if Option C ships: the affirmation closer in Option C («What Provedo does: leads you through your portfolio across every broker, with sources for every answer.») already contains «with sources for every answer» — a verifiability anchor that defuses the «more trustworthy than a regulated alternative» inference. Helpful but not bulletproof.

### Specific phrase risk: «Provedo will not tell you what to buy»

This phrase carries the strongest regulator-readability of the three negation lines (it's the bright-line «no recommendation» commitment). It also carries the strongest commitment-risk: every future product feature that touches buy/sell prompts must respect this commitment. **Recommend keep the phrase exactly as-is — do not soften.** Softening (e.g., to «we don't make buy/sell recommendations») would arguably reduce the bright-line force. The current phrasing is colloquially crisp and regulator-readable simultaneously.

### Net verdict on Question 3

**WARN, not BLOCK.** Promoting negation to hero does not cross a regulatory line in any jurisdiction. It does (a) increase the firm's public commitment to the negated set, raising operational discipline cost over time, and (b) introduce a marginal Consumer-Duty-era UK FCA «reasonable inference» concern that is mitigated but not eliminated by the affirmation closer.

The Option C copy as drafted is **legally clean today**. The risk is *forward-operational* — every future feature that could cross the negated lines now lives under a higher-visibility public commitment.

---

## §4 Answer to Question 4 — Option B audience-headline rule

### Question restated
«For investors who hold across more than one broker.» — any «targeted advertising to specific investor cohort» concern under jurisdictional advertising rules (US FINRA-style suitability, EU MiFID II appropriateness, UK FCA conduct)?

### Per-jurisdiction read

**US — FINRA + SEC**

FINRA Rule 2210 (Communications with the Public) and FINRA Rule 2111 (Suitability) apply to FINRA member firms (broker-dealers + their associated persons). Provedo is **not** a FINRA member, not a broker-dealer, not an investment adviser — so FINRA rules do not directly apply. SEC Marketing Rule (Rule 206(4)-1) applies only to investment advisers; not applicable.

Where targeted advertising could create a problem: (a) if the audience-naming created an «investment adviser by holding-out» concern under §202(a)(11), or (b) if it triggered state-level «hold out as adviser» rules. The phrase «For investors who hold across more than one broker» is **descriptive of a use-case** (multi-broker reconciliation), not a recommendation about who-should-invest-in-what. It does not hold the firm out as advising specific investor profiles on investment selection. **Adequacy: GO.**

One nuance: if the audience-line were «For investors with $X+ assets» or «For sophisticated investors» — those would carry implications about regulatory accreditation status (SEC Reg D «accredited investor» / Reg A «qualified purchaser») which create additional documentation burden. The proposed line carries none of those implications. Clean.

**EU MiFID II — Article 24 + appropriateness/suitability framework**

MiFID II's appropriateness regime (Article 25(3)) requires regulated firms to assess whether a client has the knowledge and experience to understand the risks of a service. **Provedo is not a MiFID II regulated firm**; the appropriateness regime does not apply.

The relevant rule is the marketing communication framework (Article 24(3) — fair, clear, not misleading). Audience-naming a use-case («multi-broker investors») is descriptive, not solicitation-targeted. **Adequacy: GO.**

**UK FCA — COBS 4** + **target-market identification (PROD 3 in the Product Intervention and Product Governance sourcebook)**

FCA's PROD rules apply to manufacturers and distributors of financial products. **Provedo is not a manufacturer or distributor of a financial product** — the product is information software, not a financial instrument. PROD rules do not apply.

COBS 4 (financial promotion conduct) applies to communications inviting investment activity. Audience-naming for an information product is not a financial promotion in the COBS 4 sense. **Adequacy: GO.**

**Russia 39-ФЗ:** N/A current scope.

### Net verdict on Question 4

**GO across all in-scope jurisdictions.** The Option B audience-headline does not trigger any targeted-advertising / suitability / appropriateness rule because Provedo is not a regulated firm in any of these jurisdictions and the audience-naming is descriptive of use-case, not solicitation of investor cohort.

One forward-watch flag: if Provedo's regulatory positioning ever changes (e.g., adding a managed-portfolio feature that requires investment-adviser registration), the audience-naming pattern would need to be re-reviewed under suitability rules at that time. Currently irrelevant.

---

## §5 Answer to Question 5 — Meta «Option D» path

### Question restated
Is there a fourth «Option D» path = ship the 7 universal improvements + 3-layer disclaimer ONLY (skip the strategic A/B/C posture choice) as a v3.2 patch slice? If yes, would that be legally cleaner than reopening hero-lock for B or C?

### Legal-only analysis

The 7 universal improvements per synthesis §5 «Common across all three options»:
1. Replace bracketed-placeholder demo content with Granola-grade fully-written example output
2. Three-layer disclaimer pattern (R3 §9)
3. Footer waitlist trial-CTA leak fix
4. Single weighted testimonial + «alpha quotes coming Q2» line
5. Drop «Lane A —» prefix from proof bar cell #4
6. Add audience-whisper line «For investors who hold across more than one broker.»
7. v3.1 finance/legal patches at `8cb509b` held (Tab 3 + simultaneous animation + sourced benchmark + FAQ Q4 $9 + 75-word disclaimer behind Layer 2)

**Per-improvement legal gradient:**

| # | Improvement | Legal risk delta vs v3.1 | Notes |
|---|---|---|---|
| 1 | Granola-grade demo content | -1 (improvement) | Higher fidelity = less marketing-tightening pressure to «punch up» examples; explicit content-lead pass per v3.1 patches inheritance |
| 2 | Three-layer disclaimer | 0 to -1 (depends on Layer 1 wording per §1 above) | Net positive if Layer 1 carries the «general information» + «personalized investment advice» edit |
| 3 | Footer waitlist trial-CTA fix | -1 (improvement) | Removes accidentally-promotional «14-day trial» framing — anti-Sage AND anti-deceptive-pattern (FCA Consumer Duty preference for non-pressure framing) |
| 4 | Single testimonial + honest pre-alpha line | -1 (improvement) | Three quotes from same person reads thin; honest «coming Q2» is FTC-Endorsement-Guides-aligned, also UK CAP Code 3.45 (testimonials) preference for verifiable quotes |
| 5 | Drop «Lane A —» prefix | 0 | Internal terminology removal — no legal impact, slight clarity gain |
| 6 | Audience-whisper line | 0 (per §4 above) | Descriptive, not solicitation |
| 7 | v3.1 patches held | 0 | Already in production; preservation is the requirement |

**Net legal gradient of Option D vs v3.1:** -3 to -4 (substantial improvement). **Net legal risk vs Option A:** Option D is a strict subset of Option A (Option A = D + S6 mid-page elevation + R3.V1 time-anchor sub + JBM-mono accent test + tab structure preserved). Option A's *additional* changes carry no incremental legal risk beyond Option D — so legally Option D and Option A are *equivalent in risk*. The difference between them is purely brand/design/content scope, not legal scope.

**Net legal gradient vs Options B and C:**
- **vs Option B:** Option D avoids the +1 personalization-drift risk Option B introduces via audience-headline-in-hero. (Audience-whisper as a *micro-line* below hero is materially different from audience-line *as headline* — the headline position carries «who is this for» framing weight that the whisper position does not. Per synthesis Option B Lane A risk gradient table: B is +1 personalization vs v3.1; D is 0.) **D is legally cleaner than B by +1 vector.**
- **vs Option C:** Option D does not carry C's -1 implicit-recommendation drop, but also does not carry C's forward-operational commitment-risk from §3 above. Net: D is legally **roughly equivalent** to C on the day of ship, and **lower-risk forward** because the commitment surface is smaller.

### Sequencing argument for Option D

Three reasons Option D is the cleanest legal play:

1. **Decouples regulatory work from strategic work.** v3.2 ships the legally-load-bearing improvements (3-layer disclaimer + audience-whisper-as-descriptive + universal patches) without reopening the hero-lock — which is the single highest-risk decision PO has to make. Strategic-posture A/B/C debate then happens *over* a v3.2 baseline that has already absorbed the regulatory-readability improvements. Future strategic-posture rev does not have to re-litigate the disclaimer pattern.

2. **Preserves PO's 2026-04-25 hero lock without precluding future change.** The hero-lock decision was made 2 days ago. Reopening it now (Options B + C both reopen) costs decision-credibility. Option D respects the lock; Options B and C ask PO to re-decide a 2-day-old lock. From a legal-process-discipline perspective (forward-operational commitment cost from §3): a lock that gets reopened easily is a lock that is *less defensible* in any future enforcement context where consistency-of-public-positioning matters.

3. **Lowest single-PR risk surface.** Synthesis estimates Option A at 18-28h, Option B at 36-51h, Option C at 42-61h. Option D is a strict subset of Option A — estimate ~12-18h. Smaller PR = fewer interactions between simultaneous changes = lower probability that the disclaimer Layer 1 wording, the audience-whisper placement, and the universal patches collide in unexpected ways. Legal-risk concentration is lower when the slice is smaller.

### Net verdict on Question 5

**Yes, Option D exists as a legally-cleaner path** than Options A, B, or C — at the cost of deferring the brand/design «v4 redesign energy» that A/B/C deliver. From a pure legal-advisor lens (which is the lens this validation is constrained to), **Option D is the recommended ship**.

---

## §6 Disagreement with right-hand's preliminary Option-A recommendation

### Where I agree

Right-hand's Option-A preliminary correctly identifies that Options B and C reopen the 2-day-old hero-lock (high decision-credibility cost) and that Option A is single-PR (lower execution risk). Both are valid considerations.

### Where I disagree

Right-hand's Option-A preliminary treats the «universal improvements» (3-layer disclaimer, audience-whisper, demo-content rewrite, etc.) as *bundled with* Option A's S6 mid-page elevation + R3.V1 time-anchor sub + JBM-mono test. From a legal lens these two bundles are **separable**, and separating them yields **lower regulatory risk than Option A** because:

- The 3-layer disclaimer pattern + Layer 1 wording sign-off + Layer 3 sub-page is the load-bearing legal upgrade from v3.1. This work is **independent** of any strategic-posture decision.
- Bundling it inside Option A means the disclaimer ships as part of an «evolution» PR that *also* reshapes S6 and changes the hero sub. If a post-ship issue surfaces with the disclaimer (e.g., Layer 1 wording catches a regulator concern) and we need to roll back, we lose the S6 + sub changes too. Higher coupling = higher rollback cost.
- Decoupling (Option D ships disclaimer + universals; A/B/C posture decision happens over v3.2 baseline) means each PR has a single decision-frame and each rollback affects only one decision-domain.

**This is a process-discipline disagreement, not a copy-or-design disagreement.** I am not saying Option A's S6 mid-page elevation or R3.V1 time-anchor sub are legally wrong — they are legally fine. I am saying they should ship in v4 *after* v3.2 has shipped the legally-load-bearing pieces, not bundled together.

### What right-hand's preliminary gets right that this validation respects

If PO timing constraint is «one slice this week, no follow-up», the difference between Option A and Option D collapses (Option A is the closest deliverable that includes the universal improvements). In that scenario right-hand's Option-A preliminary is correct. **My SUPPORT-ALT-D verdict is conditional on PO accepting a two-slice cadence: v3.2 patch (this week) → v4-A/B/C strategic decision (subsequent week, with Phase-3 inputs).**

If PO insists on single-slice this week, fall back to Option A with the §1 Layer 1 edit applied.

---

## §7 Summary table — per-question verdicts

| Q | Topic | Verdict | Action |
|---|---|---|---|
| Q1 | Layer 1 disclaimer wording | SIGNED-WITH-EDIT | Add «general» + «personalized» two-word edit (§1) |
| Q2 | Three-layer disclaimer adequacy | GO with conditions | `<summary>` text fix + Layer 3 ships simultaneously, not deferred (§2) |
| Q3 | Option C negation-hero affirmative-claim risk | WARN, not BLOCK | Forward-operational commitment cost real but not regulatory-line-crossing today (§3) |
| Q4 | Option B audience-headline targeted-advertising risk | GO across in-scope jurisdictions | Provedo not a regulated firm; descriptive use-case naming = clean (§4) |
| Q5 | Option D path (universals only, defer A/B/C) | YES — exists and is legally cleanest | SUPPORT-ALT-D as primary verdict (§5) |

---

## §8 Top 3 legal risks across the recommended (Option D / fallback Option A) path

### Risk 1 — Layer 1 wording standalone-readability gap

If Layer 1 ships as proposed («Provedo provides information about your portfolio. It is not investment advice — every decision stays yours.») without the §1 edit, a SEC examiner reading Layer 1 alone (cold mobile traffic, AT user, regulator skim-pass) gets the «no advice» negation but not the «no personalized recommendation» negation. **Mitigation:** apply the two-word edit. **Severity:** MEDIUM. **Effort to fix:** trivial (copy change).

### Risk 2 — Layer 3 deferral creates a regulator-readability gap during the deferral window

If Layer 3 (`/disclosures` sub-page) is treated as «post-alpha» per the synthesis Option A spec, then between v3.2 ship and Layer 3 ship the only path to the verbatim 75-word block is via the `<details>` toggle. For users / regulators where the toggle is suppressed (some AT/browser combos, some screen-reader configurations), the verbatim text becomes harder-to-reach than today's always-visible 75-word footer. **Mitigation:** ship Layer 3 simultaneously with Layer 2 (~30 min frontend lift). **Severity:** MEDIUM. **Effort to fix:** small (one route + one rendered MDX page).

### Risk 3 — Forward-operational commitment from any negation-prominence change

Whichever option ships, the negation lines remain on-page (Option A keeps them in §S3, Option C promotes to hero). Each future product feature must respect the negation set. The most fragile commitment is «Provedo will not tell you what to buy» — any Plus-tier feature involving suggested actions, rebalance prompts, or auto-trade-suggestions would be a public-commitment-violation under any of A/B/C/D. **Mitigation:** add a content-lead + legal-advisor sign-off gate to product roadmap for any feature involving prompts/suggestions/recommendations. (This is process, not copy.) **Severity:** LOW today, escalates with product complexity. **Effort to fix:** process gate, not code change.

---

## §9 Things that did NOT change from v3.1 review and MUST NOT change

These are regulatory-load-bearing artefacts from the `8cb509b` patches that any v3.2 / v4 ship must preserve verbatim:

1. **Tab 3 framing** — «price returned above your sell level» + «not a recommendation about future trading decisions» + «past patterns do not predict future results» + «common pattern across retail investors». Verified at `apps/web/src/app/(marketing)/_components/ProvedoDemoTabsV2.tsx`.
2. **Tab 3 simultaneous animation** — sell points + recovery marks + connectors fade in simultaneously, NOT sequentially. Verified at `apps/web/src/app/(marketing)/_components/charts/TradeTimelineAnimated.tsx`.
3. **Footer 75-word disclaimer block** — verbatim text at `apps/web/src/app/(marketing)/_components/MarketingFooter.tsx` lines 71-77. Three-layer pattern *must preserve this exact text* behind Layer 2 expansion.
4. **FAQ Q4 — $9/month explicit** + «insights when they matter» (not «daily insights»).
5. **Tab 4 sourced benchmark** — «about 2x S&P 500 sector weight (~28%)» (not the unsourced «US retail median tech 34%»).

Any v3.2 PR must preserve these five artefacts. The synthesis explicitly respects this (Rule 6 hold) but flagging here for ship-checklist.

---

## §10 Compliance footer

- **Rule 1 (no spend):** No paid services initiated. No external counsel engaged. All sources public/free. The §1 [ATTORNEY REVIEW] flag is a recommendation for pre-launch in specific markets, not a request for spend approval today.
- **Rule 2 (no comms):** No outreach to regulators / counsel / external parties. Internal artifact only.
- **Rule 3 (independent verdict):** This validation was produced without reading or deferring to any other Phase-3 specialist's parallel output. Right-hand's preliminary Option-A weighted recommendation was treated as a hypothesis to pressure-test, not an answer to defer to.
- **Rule 4 (no predecessor reference):** Honored.
- **Lane A:** Held. None of A/B/C/D challenges Lane A; D / A / C strengthen it; B introduces a +1 personalization vector that is mitigatable but real.
- **Counsel caveat:** Final regulatory clearance for production launch in US / EU / UK requires licensed counsel review per jurisdiction (estimated $900-6K total per prior review §Caveat). Per Rule 1, counsel engagement requires per-transaction PO greenlight; not initiated here.

**END phase3-legal-advisor-validation.md**
