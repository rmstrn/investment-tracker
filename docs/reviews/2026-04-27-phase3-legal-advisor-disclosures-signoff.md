# Legal-Advisor Sign-Off — Layer 3 `/disclosures` Sub-Page Draft (slice-LP3.2)

**Author:** legal-advisor
**Date:** 2026-04-27
**Inputs reviewed:**
- `docs/content/slice-lp3-2-content-lead-deliverables.md` (D2 deliverable, ~580 words, 6 sections + Contact)
- `docs/reviews/2026-04-27-phase3-legal-advisor-validation.md` (own prior verdict — Layer 1 SIGNED-WITH-EDIT, 3-layer adequacy ruling, Layer 3 not-deferral mandate)
- `docs/reviews/2026-04-26-legal-advisor-landing-review.md` (own v3.1 review — 75-word footer baseline)
- `apps/web/src/app/(marketing)/_components/MarketingFooter.tsx` lines 71-76 (current verbatim 75-word block — confirmed in tree)
- `docs/kickoffs/2026-04-27-slice-lp3-2-universal-improvements.md` (scope item 5 = Layer 3 ship requirement)

**Method:** Five-question sign-off per right-hand brief: (1) element-by-element adequacy vs five regulator-readable phrases in 75-word footer, (2) Lane A voice-allowlist + banned-co-occurrence audit, (3) jurisdictional citation completeness across US/EU/UK, (4) `noindex` ruling, (5) forward-operational commitment surface.

**Verdict:** **SIGNED-WITH-EDITS** — three small edits required to close one element-level gap (Element 5 explicit-citation phrasing), one cosmetic gap (Element 4 phrase-of-art tightening), and one operational risk (Plus-tier suggestion-feature foreclosure). Edits are surgical (≤30 words total). With edits applied, Layer 3 inherits all five regulator-readable disclaim-protections from the 75-word footer baseline and is **adequate as a Lane A first-pass disclosures page** for non-production use under noindex.

**Confidence:** MEDIUM (first-pass internal SME; pre-production launch in any specific market still requires licensed counsel per Rule 3 caveat).

---

## §1 Element-level adequacy vs the 75-word footer baseline

The 75-word footer block (verbatim from `MarketingFooter.tsx:71-76`, locked at commit `8cb509b`) carries five regulator-readable disclaim-protections. Each must be inheritable by Layer 3 to satisfy the Phase 3 «3-layer pattern adequacy» ruling — Layer 3 is the **always-reachable verbatim safety net** for users where the `<details>` toggle is suppressed (some AT/browser combos) or for regulator skim-pass.

### Element 1 — «not a registered investment advisor»

**Footer baseline phrase:** «Provedo is not a registered investment advisor».
**D2 draft equivalent:** §1 «Who Provedo is and is not» — «Provedo is not a registered investment advisor» (line 204) AND §3 US sub-section — «Provedo is not registered as an investment advisor under the Investment Advisers Act of 1940» (line 233).

**Verdict: PASS.** Element appears in two surfaces (general intro + US-specific section), strengthening regulator-readable redundancy.

### Element 2 — «not a broker-dealer»

**Footer baseline phrase:** «and is not a broker-dealer».
**D2 draft equivalent:** §1 «Who Provedo is and is not» — «is not a broker-dealer» (line 204) AND §3 US sub-section — «Provedo is not a broker-dealer registered under the Securities Exchange Act of 1934» (line 235).

**Verdict: PASS.** D2 actually **strengthens** the footer baseline by adding the explicit «Securities Exchange Act of 1934» citation in the US sub-section. This is a regulator-readable upgrade — broker-dealer registration sits under the '34 Act, not the '40 Act, and naming both Acts shows the firm has considered both registration regimes.

### Element 3 — «does not provide personalized investment recommendations or advice as defined under [US Investment Advisers Act / EU MiFID II / UK FSMA 2000]»

**Footer baseline phrase:** «does not provide personalized investment recommendations or advice as defined under the U.S. Investment Advisers Act of 1940, EU MiFID II, or UK FSMA 2000».
**D2 draft equivalent:** §1 «Who Provedo is and is not» — «Provedo does not provide personalized investment recommendations or advice as defined under the U.S. Investment Advisers Act of 1940, the EU Markets in Financial Instruments Directive (MiFID II), or the UK Financial Services and Markets Act 2000» (lines 205-209).

**Verdict: PASS.** D2 actually **strengthens** the footer baseline by spelling out «Markets in Financial Instruments Directive» (MiFID II's full name) and «Financial Services and Markets Act 2000» (FSMA's full name) — these are the regulator-readable forms an examiner skimming the page would expect.

Bonus: §3 EU sub-section additionally cites «Directive 2014/65/EU» (the actual MiFID II directive number) which is the **strongest** form of citation a regulator-readable page can carry. This is an upgrade from the footer baseline.

### Element 4 — «Past performance is not indicative of future results»

**Footer baseline phrase:** «Past performance is not indicative of future results.»
**D2 draft equivalent:** §4 «Past performance and predictions» — «Past performance is not indicative of future results» (line 247).

**Verdict: PASS** — but with **one cosmetic tightening recommended.** The footer baseline phrase is verbatim. D2 reproduces it verbatim. However, §4 in D2 then adds two sentences that go *beyond* the footer baseline by addressing the Tab 3 «pattern observation» surface specifically:

> «Patterns Provedo surfaces from your trade history are retrospective observations about past trades. They are not predictions about future market movements and are not recommendations about future trading decisions.»

These two added sentences are **regulator-positive** — they extend the «past performance» protection to the pattern-observation surface (which is the Tab 3 risk concentration per my v3.1 review §S4 Tab 3 WARN). This is a Layer 3 *strengthening* of disclaim-protection vs the 75-word footer.

**Cosmetic edit recommended (not blocking):** the sentence «They are not predictions about future market movements and are not recommendations about future trading decisions» uses the construction «not recommendations about future trading decisions» — which mirrors the Tab 3 disclaimer phrase **«not a recommendation about future trading decisions»** (singular «a recommendation»). For perfect verbal-rhyme with the locked Tab 3 disclaim phrase, recommend changing to **«are not a recommendation about future trading decisions»** (singular). Reduces cross-surface inconsistency.

### Element 5 — «Consult a licensed financial advisor in your jurisdiction before making investment decisions»

**Footer baseline phrase:** «Consult a licensed financial advisor in your jurisdiction before making investment decisions.»
**D2 draft equivalent:** §5 «Your decisions, your responsibility» — «Consult a licensed financial advisor in your jurisdiction before making investment decisions, particularly decisions involving tax consequences, retirement accounts, or significant changes to your portfolio composition» (lines 257-260).

**Verdict: PASS** — but with **one substantive edit required.** The base phrase is preserved verbatim. The added qualifier «particularly decisions involving tax consequences, retirement accounts, or significant changes to your portfolio composition» is well-intentioned (it points users to the highest-stakes decisions where licensed-counsel value is greatest) but introduces **two forward-operational risks**:

1. **Tax-decisions enumeration risk.** Calling out «tax consequences» specifically commits Provedo to the position that tax is a domain where the firm explicitly routes users to licensed counsel. If a future Plus-tier feature ships a tax-optimization observation surface (e.g., «your IBKR account has $X in unrealized losses harvestable before year-end»), the `/disclosures` page becomes evidence in any future enforcement matter that the firm publicly committed to *not* providing tax-related observations without licensed-counsel intermediation. This is a forward-operational commitment beyond what the 75-word footer carries.

2. **«Retirement accounts» enumeration risk.** Same pattern. If Provedo ever surfaces observations on tax-advantaged accounts (IRA / 401(k) / SIPP / ISA), the enumeration here becomes a public commitment. Some of these — particularly US ERISA-governed retirement accounts — carry their own regulatory regimes (DOL Fiduciary Rule territory) where any observation could be construed as fiduciary advice. The 75-word footer sidesteps this by not enumerating; D2 enumerates and thereby creates the commitment.

**Recommended edit:** drop the qualifier entirely. Replace lines 257-260 with verbatim footer baseline:

> «Consult a licensed financial advisor in your jurisdiction before making investment decisions.»

This preserves Element 5 inheritance without creating new commitments. The «particularly...» list reads helpful but is forward-operationally fragile.

---

### Element-inheritance scoreboard

| # | Footer baseline element | D2 draft inheritance | Verdict |
|---|---|---|---|
| 1 | not a registered investment advisor | §1 + §3-US (2x) | PASS |
| 2 | not a broker-dealer | §1 + §3-US with `'34 Act` upgrade | PASS — strengthened |
| 3 | no personalized recommendations / Advisers Act / MiFID II / FSMA 2000 | §1 with full-name expansion + §3-EU with directive number | PASS — strengthened |
| 4 | past performance not indicative | §4 verbatim + Tab-3 surface extension | PASS — minor cosmetic edit recommended |
| 5 | consult licensed advisor in jurisdiction | §5 with «tax / retirement / significant changes» qualifier | PASS — substantive edit recommended (drop qualifier) |

**All five elements inherit. Layer 3 is adequate as the verbatim safety-net surface required by my Phase 3 risk #2 ruling.**

---

## §2 Lane A voice-allowlist + banned-co-occurrence audit

### Verb-allowlist audit on Provedo-as-subject

D2 explicitly enumerates the verb set used (line 272): **provides / surfaces / shows / notices / cites / connects / aggregates / describes / supports**. This is allowlist-clean — observation register, no advice gradient.

**Per-section verb verification:**

| Section | Active verbs on Provedo | Allowlist? |
|---|---|---|
| §1 «Who Provedo is and is not» | provides / does not provide / is not / does not hold / does not execute / connects | PASS |
| §2 «Information we provide» | provides clarity, observation, context, foresight / surfaces / shows / notices / cites / describes / does not prescribe | PASS |
| §3-US | is not registered / does not provide / is not | PASS (negation register) |
| §3-EU | does not provide / provides | PASS |
| §3-UK | provides / does not provide | PASS |
| §4 «Past performance and predictions» | surfaces / are not (predictions) / are not (recommendations) | PASS (negation register) |
| §5 «Your decisions, your responsibility» | (no Provedo-as-subject; user-as-subject) | N/A |
| §6 «Contact» | (no Provedo-as-subject) | N/A |

**Verdict: PASS.** Zero violations of the verb-allowlist in any of six sections.

### Banned-co-occurrence audit

The banned list (advice / recommendations / strategy / strategic / suggestions / suggest) appears throughout D2 — but **every appearance is in negation/disclaim register**, never as Provedo-positive description. Counts:

- «advice» — 5 occurrences, all in negation («not personalized investment advice», «not investment advice», «not regulated advice», «do not... advice»)
- «recommend / recommendations» — 4 occurrences, all in negation («does not provide personalized investment recommendations», «not a personal recommendation», «are not a recommendation»)
- «strategy / strategic / suggestion / suggest» — 0 occurrences anywhere

**Verdict: PASS.** Banned co-occurrence rule is honored — banned terms appear only as the things Provedo **does not** do, never as descriptions of what Provedo provides.

### «Guidance» splitter rule

D2 explicitly notes (line 274): «word ‹guidance› absent (used ‹clarity› and ‹observation› instead).» Confirmed by spot-check of all six sections — zero appearances of «guidance» / «guide» / «guiding». This is the brand-voice-curator splitter rule (avoid «guidance» which carries «advice»-adjacent semantic in financial register) honored.

**Verdict: PASS.**

### One micro-flag: «foresight»

D2 §2 line 218 includes «foresight» in the verb-list applied to Provedo: «Provedo provides clarity, observation, context, and foresight on your portfolio.» «Foresight» is on the brand-voice-curator allowlist per VOICE_PROFILE.md, but in a *legal disclosures page* it deserves a sanity-check:

**SEC Marketing Rule lens:** «Foresight» literally means «the ability to predict». In a marketing context this is a brand-voice claim («we help you anticipate»); in a *disclosures* context, an SEC examiner could read it as an implied claim that Provedo's outputs predict future events — which would conflict with §4's «not predictions about future market movements» disclaim two paragraphs below.

**Mitigation:** the §4 disclaim explicitly negates predictive claims, so the §2 «foresight» reference is bracketed by surrounding disclaim. **Risk severity: LOW.** But for a disclosures-page register I would prefer a less predict-coded synonym. **Optional cosmetic edit:** replace «foresight» with «context» (already in the same list — would just appear once instead of twice) OR with «perspective». Not blocking. Right-hand call.

---

## §3 Jurisdictional citation completeness

The §3 «Per-jurisdiction notes» block carries three sub-sections (US / EU / UK). Audit:

### US sub-section (line 232-235)

**Citations present:** Investment Advisers Act of 1940 + Securities Exchange Act of 1934.
**What's covered:** investment-adviser registration + broker-dealer registration.
**What's NOT covered (and acceptable to omit at Layer 3):**
- SEC Rule 206(4)-1 (Marketing Rule) — applies only to *registered* investment advisers; Provedo is not registered, so the rule does not apply to Provedo's marketing. Footer baseline does not cite it; Layer 3 inheritance is correct in not citing it.
- Securities Act of 1933 — applies to securities offerings; Provedo does not offer securities. Correctly omitted.
- State-level «Blue Sky» laws — applicable on per-state basis for investment advisers above $100M AUM; Provedo is below threshold and unregistered. Correctly omitted.
- FINRA rules — apply to FINRA member firms; Provedo is not a FINRA member. Correctly omitted.

**Verdict: ADEQUATE for first-pass.** The two cited Acts cover the two registration regimes Provedo could plausibly trigger. **[ATTORNEY REVIEW]** A SEC-registered compliance counsel may want to add a state-level disclosure if Provedo intends to launch in NY, MA, or CA (which have stricter consumer-protection regimes than federal floor); not required for Layer 3 first-pass under noindex.

### EU sub-section (line 237-239)

**Citations present:** MiFID II (Directive 2014/65/EU).
**What's covered:** personal-recommendation definition.
**What's NOT covered:**
- GDPR (Regulation (EU) 2016/679) — privacy regulation, not investment regulation. Layer 3 is a *regulatory disclosures* page (investment scope), not a privacy policy. Correctly omitted from this surface; will need its own privacy-policy page on `/privacy` when product launches.
- ESMA guidelines — applicable to ESMA-supervised firms; Provedo is not ESMA-supervised. Correctly omitted.
- AIFMD / UCITS — apply to fund managers; Provedo is not a fund manager. Correctly omitted.
- Per-member-state implementation laws (e.g., Germany's WpHG, France's COMOFI) — applicable on per-market basis when Provedo launches in specific EU markets. Correctly omitted at Layer 3 first-pass; will need per-market disclosure additions when launching specific EU members.

**Verdict: ADEQUATE for first-pass.** **[ATTORNEY REVIEW]** Per-member-state counsel review required before launching specific EU markets (DE first per ICP weight per positioning v3.1).

### UK sub-section (line 241-244)

**Citations present:** Financial Services and Markets Act 2000 (FSMA).
**What's covered:** regulated-advice perimeter under FSMA.
**What's NOT covered (and worth flagging):**
- **PERG 8.24-8.30B** — FCA's Perimeter Guidance, which is the operative source for «advising on investments» definition and the «implied recommendation» test from my v3.1 review. The footer baseline does not cite PERG 8 either; Layer 3 inheritance is consistent. However, citing PERG 8 in Layer 3 specifically (where there's word-budget for it, unlike the footer) would be a **regulator-readable upgrade** — UK FCA examiners actively look for PERG 8 acknowledgment in fintech disclosures.

**Optional substantive edit (recommended but not blocking):** §3-UK sub-section currently reads:

> «Provedo provides generic information and does not provide regulated investment advice under the Financial Services and Markets Act 2000 (FSMA). Provedo's communications are intended to be fair, clear, and not misleading.»

Recommend adding one phrase:

> «Provedo provides generic information and does not provide regulated investment advice under the Financial Services and Markets Act 2000 (FSMA), as further described in the FCA Perimeter Guidance Manual (PERG 8). Provedo's communications are intended to be fair, clear, and not misleading.»

This adds 11 words and explicitly cites the operative perimeter guidance — strengthens UK FCA regulator-readability. Not blocking; right-hand call.

- **Consumer Duty (PRIN 2A, eff Jul 2023)** — applies to firms providing products or services to UK retail customers. Provedo's status under Consumer Duty depends on whether the FCA classifies an unregulated fintech as «providing services to retail customers» in the Consumer Duty sense. The «fair, clear, and not misleading» phrase in §3-UK is **already a Consumer Duty-aligned phrase** (it mirrors COBS 4.2.1R / the Consumer Principle). No additional edit required, but flagging that this phrase is doing double-duty.

- **FSMA Section 21 (financial promotion restriction)** — applies to communications made in the course of business that invite or induce engagement in investment activity. If Provedo's marketing copy is ever construed as a financial promotion, it requires either FCA authorization or an authorized-person approval. The Layer 3 page is *disclosures*, not *promotion*, so Section 21 doesn't directly bite the disclosures surface; but it bites adjacent marketing surfaces. Out of scope for Layer 3 review. **[ATTORNEY REVIEW]** Required before UK production launch.

### Russia 39-ФЗ

**Citations present:** none.
**Verdict:** Correctly omitted — geography lock 2026-04-23 explicitly excludes Russia from current launch scope. Per my Phase 3 validation §10 «Russia 39-ФЗ deferred», this is the right call. When/if Russia opens, Layer 3 needs a fourth sub-section.

### Net §3 verdict

**Three jurisdictions adequately disclosed at first-pass level under noindex.** All three cited regimes carry the load-bearing registration/perimeter language. Optional UK PERG 8 strengthening edit recommended; not blocking. **[ATTORNEY REVIEW]** required per-jurisdiction before production launch in any specific market — same caveat as Phase 3 verdict §6.

---

## §4 `noindex` ruling

### The question

Content-lead's D2 spec includes:

```tsx
robots: {
  index: false,
  follow: false,
}
```

i.e., `<meta name="robots" content="noindex, nofollow" />` on `/disclosures`. Right-hand asks: confirm this is correct, OR should it be indexed for transparency?

### Analysis

Two competing considerations:

**Pro-INDEX (transparency argument):**
- A disclosures page exists *to be found* by users and regulators looking for it.
- SEC Marketing Rule's «clear and prominent» test favors discoverability.
- If a regulator searches «Provedo regulatory disclosures site:provedo.app» and the page is noindex, it returns nothing — bad signal.
- FCA Consumer Duty's «consumer understanding» principle favors discoverability.

**Pro-NOINDEX (slice-LP3.2 specific argument):**
- The slice-LP3.2 product is **pre-alpha**. PR #65 is still in flight.
- The Layer 3 page exists to satisfy the «3-layer pattern adequacy» ruling — i.e., to serve as the always-reachable safety net for users where the `<details>` toggle is suppressed AND for regulator skim-pass via Layer 2 link. **It does not need to be search-indexed to satisfy either of those goals.**
- Indexing a *pre-alpha* disclosures page exposes the firm to scrape-and-archive risk: any enforcement matter or legal-research query in the future will surface this exact text via Wayback Machine + Google cache. Once indexed, retracting the page (e.g., to update wording after attorney review) leaves a permanent indexed copy of pre-attorney-review text.
- **`/disclosures` is reachable from the Layer 2 footer link by direct navigation** — that's how regulators and users actually get there. Search-indexing is not the access path.
- Production-launch attorney review will likely require copy edits to this page. If it's already indexed, those edits create a Wayback-Machine-visible delta which becomes evidence in any future enforcement matter.

### Verdict

**NOINDEX is correct for slice-LP3.2 ship.** Two-line rationale:

1. **Layer 3 access path is direct navigation from Layer 2 footer link, not search.** Indexing adds no user-discovery benefit while creating archive-permanence risk.
2. **Pre-attorney-review text should not enter Wayback Machine / Google cache.** When attorney review eventually happens (per Phase 3 §10 caveat), the post-review version replaces the pre-review version cleanly only if the pre-review version was never indexed.

**Forward note:** When Provedo launches production in any specific market and licensed counsel signs off the final wording, the `noindex` should be **flipped to `index`** at that time. This is a one-line code change that converts the noindex from a slice-LP3.2-specific protection to a transparency posture for production. Recommend tracking this as a TECH_DEBT item or as part of the production-launch checklist.

---

## §5 Forward-operational commitments created by D2 draft

This is the question with the most strategic weight. Layer 3 is a public-facing page whose every sentence becomes a permanent commitment shaping what product features Provedo can ship without violating its own disclosed posture.

### Commitment audit

| # | D2 commitment | Forward feature it potentially forecloses | Severity |
|---|---|---|---|
| C1 | «Provedo does not hold custody of your assets» (§1 line 211) | Custodial wallet / hold-positions feature; account-money-movement feature | LOW (custodial path requires SEC/FCA registration anyway; firm wouldn't ship without separate regulatory work) |
| C2 | «Provedo does not execute trades on your behalf» (§1 line 211-212) | Auto-rebalance feature; one-click-execute-suggestion feature; copy-trading feature | **MEDIUM-HIGH** (Plus-tier auto-action features potentially conflict — see deep-dive below) |
| C3 | «Provedo connects to your broker accounts on a read-only basis» (§1 line 213) | Write-access broker integration (e.g., for trade execution) | MEDIUM (couples to C2; same Plus-tier deep-dive) |
| C4 | «Provedo describes what is. Provedo does not prescribe what you should do.» (§2 line 220-221) | Coach-tier coaching surface that uses prescriptive verb tense («consider X», «you might want to Y») | **HIGH** — see deep-dive below |
| C5 | «Information Provedo surfaces is intended to support your own analysis, not to replace it» (§5 line 256-257) | Plus-tier «full-managed-portfolio» feature; «set-and-forget» framing | LOW-MEDIUM (forecloses managed-portfolio framing but firm has no near-term plan for that) |
| C6 | «Consult a licensed financial advisor... particularly decisions involving tax consequences, retirement accounts, or significant changes to your portfolio composition» (§5 line 257-260) | Tax-optimization feature; tax-advantaged-account observations; portfolio-composition-change suggestions | **MEDIUM-HIGH** — see deep-dive in §1 Element 5 above; primary reason for the «drop qualifier» edit recommendation |

### Deep-dive: C2 / C3 — auto-action and write-access foreclosure

Right-hand specifically flagged «Plus-tier suggestion-feature» as a forward-operational concern. The D2 draft does NOT explicitly foreclose «suggestion» surfaces — the language «Provedo does not execute trades» is about **execution**, not suggestion. A Plus-tier feature that *suggests* an action without *executing* it does not directly conflict with C2.

**However**, C2 + C4 combined create a tighter perimeter than C2 alone:
- C2: no execution
- C4: no prescription («does not prescribe what you should do»)

A Plus-tier feature that says «consider rebalancing your tech allocation» is **prescriptive in tense** (the verb «consider» is an imperative-soft, the framing «rebalance» is a recommended action) and would conflict with C4 on a strict read.

**Recommendation:** the Plus-tier suggestion-feature design needs to be content-lead + legal-advisor reviewed *before* the spec is locked. The Layer 3 disclosures language as drafted does not block the feature category outright, but constrains its **register**: any Plus-tier «suggestion» surface must use observation-coded framing (e.g., «your tech allocation is 2x sector weight» — observation) rather than prescription-coded framing (e.g., «consider rebalancing» — prescription). This is a Lane A discipline gate, not a regulatory line — but it's now a *publicly committed* discipline gate.

### Deep-dive: C4 — Coach UX foreclosure risk

C4 is the highest-severity commitment. «Describes what is, does not prescribe what you should do» is a bright-line public commitment that a future Coach UX (a hypothetical surface where Provedo guides users through portfolio decisions step-by-step) would have to respect.

**The Coach UX, as currently un-designed, is unconstrained.** As soon as Layer 3 ships with C4, the Coach UX must be designed within the «describe, not prescribe» perimeter. This means:

- Coach can ask questions («What's your time horizon?») — observation register, allowed
- Coach can present trade-offs («Aggressive vs. conservative typically means X vs. Y») — observation register, allowed
- Coach can summarize the user's stated preferences («You said you want growth, you currently hold 80% growth assets») — observation register, allowed
- Coach **cannot** say «Based on your goals, you should rebalance to 70% growth» — prescription register, foreclosed by C4

This is a real Coach-UX design constraint. **Severity: HIGH** because the Coach surface is a leading candidate for Plus-tier value differentiation, and the C4 commitment locks its register.

**Recommended risk-mitigation (process, not copy):** add a Lane A + Layer 3 discipline gate to the product roadmap for any feature involving guided decision-flows. (Same recommendation as Phase 3 §8 risk #3, now made more concrete by Layer 3 ship.)

### Net §5 verdict

**Layer 3 ships six forward-operational commitments. Two (C2/C3) are LOW-MEDIUM severity; one (C5) is LOW-MEDIUM; one (C6) is MEDIUM-HIGH and partially mitigated by the §1 Element-5 edit recommendation; one (C4) is HIGH severity and constrains future Coach UX register.** The C1 and most of C2-C3 commitments are commitments the firm would have wanted to make anyway (registration-trigger avoidance). The C4-C6 commitments materially shape future feature design.

**Decision lever:** the forward-operational commitments in C4-C6 are the cost of Lane A discipline being publicly disclosed at Layer 3 depth (vs. only at Layer 1 surface). This cost was implicitly accepted when PO greenlit Phase 3 §2 verdict («Layer 3 ships simultaneously, not deferred»). My Phase 3 verdict treated the cost as worthwhile because the regulatory-readability gain (verbatim safety net for AT users + regulator skim-pass) outweighs the forward-operational tightening.

**This sign-off does not reverse that Phase 3 verdict.** It surfaces the forward-operational commitments so right-hand and PO understand the perimeter Layer 3 establishes. Future Plus-tier and Coach features will be designed within this perimeter or will require a Layer 3 update with new attorney review.

---

## §6 Three required edits + one optional edit

### Required Edit 1 — §5 «Your decisions, your responsibility» — drop tax/retirement/composition qualifier

**Current (D2 lines 257-260):**
> «Consult a licensed financial advisor in your jurisdiction before making investment decisions, particularly decisions involving tax consequences, retirement accounts, or significant changes to your portfolio composition.»

**Replace with:**
> «Consult a licensed financial advisor in your jurisdiction before making investment decisions.»

**Rationale:** removes forward-operational commitment that complicates future tax-optimization / retirement-account-observation / portfolio-composition-change features. Preserves verbatim Element-5 inheritance from 75-word footer.

**Severity:** SUBSTANTIVE. Required for sign-off.

### Required Edit 2 — §4 «Past performance and predictions» — singular «recommendation» for Tab-3 verbal-rhyme

**Current (D2 line 250-251):**
> «They are not predictions about future market movements and are not recommendations about future trading decisions.»

**Replace with:**
> «They are not predictions about future market movements and are not a recommendation about future trading decisions.»

**Rationale:** mirrors the verbatim Tab 3 disclaim phrase «not a recommendation about future trading decisions» (singular «a recommendation») locked at commit `8cb509b`. Cross-surface phrase consistency is a regulator-readable signal — the same protection appears in the same wording across all surfaces of the property.

**Severity:** COSMETIC-IMPORTANT. Required for sign-off.

### Required Edit 3 — Footer waitlist box + verbatim 75-word block file path correction

D2 spec correctly identifies the file path for the verbatim 75-word block as residing in **`MarketingFooter.tsx`** (per my Phase 3 §9 reference). Right-hand brief refers to «`ProvedoFooter.tsx` (or equivalent footer-disclaimer component)». Confirming for record: the actual file is **`apps/web/src/app/(marketing)/_components/MarketingFooter.tsx` lines 71-76**, NOT `ProvedoFooter.tsx`. Frontend-engineer impl must reference the correct file. (This is housekeeping, not a content edit.)

**Severity:** HOUSEKEEPING. Flag to right-hand for tech-lead handoff.

### Optional Edit 4 — §3-UK add PERG 8 citation

**Current (D2 line 241-244):**
> «**United Kingdom.** Provedo provides generic information and does not provide regulated investment advice under the Financial Services and Markets Act 2000 (FSMA). Provedo's communications are intended to be fair, clear, and not misleading.»

**Replace with:**
> «**United Kingdom.** Provedo provides generic information and does not provide regulated investment advice under the Financial Services and Markets Act 2000 (FSMA), as further described in the FCA Perimeter Guidance Manual (PERG 8). Provedo's communications are intended to be fair, clear, and not misleading.»

**Rationale:** explicitly cites the operative UK perimeter guidance source. UK FCA examiners actively look for PERG 8 acknowledgment. 11-word addition.

**Severity:** OPTIONAL substantive. Not blocking. Right-hand call.

### Optional Edit 5 — §2 «foresight» predict-coded register softening

**Current (D2 line 218):**
> «Provedo provides clarity, observation, context, and foresight on your portfolio.»

**Optional replacement A:**
> «Provedo provides clarity, observation, context, and perspective on your portfolio.»

**Optional replacement B:**
> «Provedo provides clarity, observation, and context on your portfolio.»

**Rationale:** «foresight» literally means predict-ability; in a *disclosures* page register, an SEC examiner could read it as an implied predictive claim that conflicts with §4's «not predictions» disclaim. Replacement A swaps for «perspective» (less predict-coded). Replacement B drops the word entirely (cleanest). The §4 disclaim provides bracketing protection so this is LOW severity.

**Severity:** OPTIONAL cosmetic. Not blocking. Right-hand call.

---

## §7 Confirm Phase 3 prior commitments

Per right-hand brief, this sign-off must confirm the Layer 3 page satisfies the Phase 3 commitments I made. Audit:

| Phase 3 §2 commitment | Status |
|---|---|
| «Layer 3 (`/disclosures` sub-page) ships simultaneously with Layer 2, not deferred» | CONFIRMED — D2 deliverable is a Layer 3 spec slated for Wave-1/Wave-2 ship in slice-LP3.2 (not deferred) |
| «for full a11y + regulatory belt-and-suspenders, recommend the underlying full-text be also reachable via an always-visible footer link to `/disclosures`» | CONFIRMED — slice-LP3.2 scope item 4 wires Layer 2 `<details>` + scope item 5 wires `/disclosures` Layer 3 page. Layer 2 link to `/disclosures` is the always-visible reach path. |
| «<summary> text = ‹Full regulatory disclosures (US, EU, UK)›» | NOT YET CONFIRMED — D2 deliverable does not specify the Layer 2 `<summary>` text; this is a content-lead D-not-yet item OR a frontend-engineer impl detail. **Flag to right-hand:** ensure the Layer 2 `<summary>` text matches my Phase 3 recommendation when frontend-engineer ships. |

---

## §8 Final verdict and ship-readiness

**Verdict:** **SIGNED-WITH-EDITS**.

**Edits required for sign-off (3):**
1. §5 — drop tax/retirement/composition qualifier (substantive)
2. §4 — singular «recommendation» for Tab-3 verbal-rhyme (cosmetic-important)
3. File path — confirm `MarketingFooter.tsx` not «ProvedoFooter.tsx» (housekeeping)

**Edits optional (2):**
4. §3-UK — add PERG 8 citation
5. §2 — soften «foresight» predict-coded register

**With Required Edits 1-3 applied, Layer 3 is adequate as a Lane A first-pass disclosures page for slice-LP3.2 ship under noindex.** All five regulator-readable disclaim-protections from the 75-word footer baseline inherit. Voice is allowlist-clean. Banned co-occurrences appear only in negation register. Three jurisdictions adequately disclosed at first-pass. NoIndex is the correct posture for pre-alpha pre-attorney-review text.

**[ATTORNEY REVIEW]** required before production launch in any specific market — same Phase 3 caveat applies. When attorney review happens, the noindex flips to index and Layer 3 becomes the regulator-readable transparency surface it was designed to be.

---

## §9 Compliance footer

- **Rule 1 (no spend):** No paid services initiated. No external counsel engaged. The [ATTORNEY REVIEW] flag is a forward-recommendation for pre-launch in specific markets, not a request for spend approval today. No legal-fees obligation created by this sign-off.
- **Rule 2 (no comms):** No outreach to regulators / counsel / external parties. Internal artifact only. Reports to right-hand; right-hand presents to PO.
- **Rule 3 (independent SME, not licensed):** This sign-off is an internal SME first-pass; final regulatory clearance for production launch in US / EU / UK requires licensed counsel review per jurisdiction.
- **Rule 4 (no predecessor reference):** Honored. Only «Provedo» appears anywhere in this sign-off.
- **Lane A:** Held. Layer 3 actively *strengthens* Lane A by surfacing the discipline at disclosures-page depth. The forward-operational commitments noted in §5 are Lane A discipline being publicly committed — features must be designed within this perimeter going forward.

**END phase3-legal-advisor-disclosures-signoff.md**
