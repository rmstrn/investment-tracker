# TD-100 — page-level disclaimer — legal angle — 2026-04-29

**Author:** legal-advisor (internal SME)
**Workshop:** parallel dispatch (legal / content-lead / product-designer in isolated contexts; Right-Hand synthesizes).
**Scope:** define the **regulatory minimum content** for the persistent page-level disclaimer that must appear on every user-facing route rendering chart components, before any non-staff route mounts them. Specific copy text is content-lead's domain; placement is product-designer's domain.
**Hard rules respected:** R1 (no spend), R2 (no PO-name external comms), R4 (no predecessor name). No velocity metrics.

---

## Caveat (read first)

This is internal product-validation only, **NOT** a substitute for licensed counsel review pre-launch. The required-statements list below is the regulatory **floor** I can defend on first-pass; the disclaimer copy that ships in production must be reviewed by:

- US: SEC-registered compliance counsel (Investment Advisers Act 1940 §202(a)(11) publisher-exclusion three-prong fit + state-level investment-adviser laws).
- EU: per-member-state counsel (MiFID II Directive 2014/65/EU Article 4(1)(4) personal-recommendation line; Germany first per ICP weight).
- UK: FCA perimeter guidance review (FSMA 2000 + COBS 9 «advising on investments» scope; generic-advice exclusion fit).
- Russia: explicitly out of scope per PO directive 2026-04-23 lock; any RU-language copy is forward-readiness, not RU-market launch.

Final disclaimer text must carry an `[ATTORNEY REVIEW]` tag until human counsel signs off.

---

## 1. Required statements (regulatory floor)

Numbered. Each statement carries its primary regulatory citation. **Risk-weighting** in §6.

1. **«Provedo is not a registered investment adviser.»**
   - **Citation:** SEC Investment Advisers Act of 1940, §202(a)(11), 15 U.S.C. §80b-2(a)(11) (publisher-exclusion); MiFID II Directive 2014/65/EU Article 4(1)(4) (definition of «investment advice» as personal recommendation); FCA FSMA 2000 + COBS 9 (regulated-activity perimeter).
   - **Why mandatory:** holding the «not adviser» line in the user's eye-line is the cheapest, most-cited mitigation against unlicensed-investment-advice exposure. The phrase **«registered investment adviser»** is a US term of art; for UK/EU users, parallel framing «not authorised to provide investment advice» is the equivalent. Recommend EN copy combine both in a single sentence (see §7 jurisdictional flags).

2. **«Information shown is for educational and informational purposes only.»**
   - **Citation:** SEC publisher-exclusion «general» prong (Lowe v. SEC, 472 U.S. 181 (1985) — impersonal, non-discretionary, general); FCA COBS 9.5 «generic advice» exclusion rationale; MiFID II Article 4(1)(4) information-vs-recommendation line.
   - **Why mandatory:** «educational and informational» is the textual frame courts and regulators use to distinguish publisher-protected speech from regulated advice. Without it, structural Lane-A defenses (Zod schema gates, finance audit) lack the explicit user-facing label.

3. **«Charts and figures describe historical broker data; they are not personalized recommendations.»**
   - **Citation:** MiFID II Article 4(1)(4) explicit «personal recommendation» definition (recommendation presented as suitable for that person, based on their circumstances); FCA COBS 9.2 suitability rules (do not apply to non-personalized info).
   - **Why mandatory:** the EU/UK line is drawn at **«personal recommendation»**, not at «advice» generically. The disclaimer must rebut a reasonable user inference that charts on their actual broker data constitute a personalized recommendation. Pairing «historical» + «not personalized» rebuts both the data-source and the suitability inferences.

4. **«Past performance does not guarantee future results.»**
   - **Citation:** SEC Marketing Rule (Rule 206(4)-1, effective 2022-11-04) — 17 CFR §275.206(4)-1; FCA COBS 4.6 (financial promotions — past-performance balanced presentation); ESMA guidelines on marketing communications (per Art. 24(3) MiFID II).
   - **Why mandatory:** universal cross-jurisdiction requirement for any surface displaying historical returns / dividends / drawdowns / sparklines. Treemap, Waterfall, Bar drift, Line return-overlay, Calendar dividend events all render historical data. The phrase is so canonical that **omitting it is itself a red flag** in regulator review.

5. **«Provedo does not execute trades or hold customer funds.»**
   - **Citation:** US: SEC custody rule §275.206(4)-2 (negative-disclosure helps confirm non-custodian status); EU: MiFID II Article 4(1)(2) (investment services definitions — Provedo provides none); UK: FCA Handbook PERG 2.7 (regulated-activity perimeter).
   - **Why mandatory:** rebuts broker / custodian inferences. Provedo aggregates via Plaid / SnapTrade — users may infer broker functionality. Saying so explicitly narrows the regulated-activity perimeter Provedo does not cross.

6. **«Data sourced from your connected accounts via [Plaid / SnapTrade]; Provedo does not verify real-time accuracy.»**
   - **Citation:** GDPR Article 13(1)(e) (transparency on data sources / recipients); UK GDPR equivalent; CCPA §1798.100(b) (right-to-know data sources). Plus general consumer-protection no-misleading-claim posture (FTC Act §5; UK CMA; EU UCPD Directive 2005/29/EC).
   - **Why mandatory:** prevents «real-time», «verified», «accurate» implications the user might infer from polished UI. Names the upstream subprocessor at a level of specificity that is honest without being technical-debt (a list of 1–2 names is fine; full subprocessor registry lives in privacy policy).

7. **«Consult a licensed financial professional before making investment decisions.»**
   - **Citation:** SEC publisher-exclusion case law (Zweig v. Hearst Corp., 521 F.2d 1129 (9th Cir. 1975) — referral-out language as part of «general» prong); FCA generic-advice expectations; MiFID II Recital 70 («general information» framing).
   - **Why mandatory:** referral-out is the conventional closer that completes the «we are not your adviser» frame. Without it, users could argue Provedo positioned itself as the decision-support of last resort.

**Total: 7 required statements (regulatory minimum floor).** Three are top-criticality — see §8 compact return.

---

## 2. Forbidden statements (don't make claims you can't back)

Items the disclaimer **MUST NOT** contain. These are claim-creation traps, not just style preferences.

1. **Do NOT use the verbs «recommend», «suggest», «advise», «advice», «advisor» (other than in negative «not an advisor» phrasing).** A disclaimer that says «we never recommend any specific security» creates a baseline expectation that the rest of the product *does* recommend in some other modality. Negative-only framing: «is not a registered investment adviser», «does not provide investment advice». Never positive-modal «we may at times suggest…» constructions.

2. **Do NOT make blanket data-quality guarantees: «real-time», «verified», «accurate», «complete», «institutional-grade».** These create implicit warranties under FTC Act §5, UK CMA fairness-of-claim rules, EU UCPD Article 6 (misleading actions). Use «describes», «displays», «sourced from your connected accounts». Item §1.6 explicitly disclaims real-time accuracy.

3. **Do NOT promise outcomes: «improve your returns», «reduce risk», «optimize your portfolio».** Outcome promises invoke MiFID II suitability and FCA COBS 9 territory regardless of disclaimer length. Stay descriptive.

4. **Do NOT name specific securities or asset classes in the disclaimer body.** Exemplification («e.g., charts of NVDA returns») turns disclaimer into pseudo-recommendation by selection bias. Generic wording only.

5. **Do NOT use «we recommend you consult…»** — rewrite as «consult a licensed professional before…» (per §1.7). The verb «recommend» triggers the same trap as #1 even when the recommendation is a referral-out.

6. **Do NOT make jurisdiction-specific claims you cannot back per-market.** «Compliant with SEC rules» / «GDPR-compliant» / «FCA-authorised» are forbidden absent actual registration / certification. Stay descriptive: «we operate under information-only / publisher-exclusion principles».

7. **Do NOT use forward-looking or predictive language: «will», «expected to», «projected», «forecast».** This is a Lane-A discipline rule that extends to disclaimer copy itself, not only chart prose.

8. **Do NOT include guarantees of fiduciary status or absence thereof beyond what's true.** Saying «we have no fiduciary duty» can be read as a broad liability waiver and may run into UCPD / consumer-protection unfair-terms territory in EU. Stay narrow: «not a registered investment adviser».

---

## 3. Required disclaimer surfaces

| Route / surface | Disclaimer required? | Reason |
|---|---|---|
| Every user-facing route rendering chart components (dashboard, portfolio detail, holdings views) | **YES** | Original M-1 finding scope. SEC publisher-exclusion «general» prong requires consistent disclaimer presentation. |
| Chat surface (charts can appear in AI replies) | **YES** | Charts inline in chat carry same Lane-A risk as dashboard charts. Disclaimer must be in user's eye-line whether persistent footer or pinned-above-conversation. |
| Insights / weekly digest surfaces (when they render charts) | **YES** | Insights are AI-curated; per the M-3 next-slice item, AI prose is the highest drift risk. Disclaimer mandatory. |
| Coach / behavioral pattern-read surfaces | **YES** | Pattern-read content («you sold Apple at the local low three times last year») already walks close to the suitability line — disclaimer presence is non-negotiable here. |
| Email reports / PDF exports (future) | **YES** | Out-of-app surfaces lose ambient context; disclaimer must be embedded in the artifact itself, not merely on the route that generated it. SEC Marketing Rule scope. |
| Marketing / landing pages | **NO (separate concern)** | Landing copy is its own regulated-promotions surface (FCA financial-promotion rules; SEC marketing rule for any RIA-adjacent claims; EU UCPD). Different disclaimer text and placement; not in TD-100 scope. Track separately. |
| Staff-only `/design` showcase route | **OPTIONAL (recommended harmless)** | Internal route, no real broker data, but adding the disclaimer here costs nothing and trains the team's eye for placement consistency. Recommend including as a non-blocking polish. |
| Login / signup / marketing-style auth pages | **NO** | No chart content. GDPR Article 13 transparency is satisfied via the privacy policy link in footer (separate concern). |
| Settings / account pages | **NO** | No chart content. |
| Error pages (404 / 500) | **NO** | No chart content. |
| Empty states (zero connected accounts, zero positions) | **CONDITIONAL** | If the empty-state surface still mounts the chart shell or shows a fallback figure, disclaimer required. If it renders only a CTA («connect your first broker»), not required. Default to including for consistency. |

---

## 4. Format requirements

These are the regulatory-derived format constraints. Visual / typographic execution is product-designer's domain in this workshop.

- **Visibility without horizontal scroll on mobile (320px+):** SEC «prominent disclosure» case law treats off-screen disclaimers as unprominent; same posture under FCA COBS 4.2 «clear, fair, not misleading» test. Mobile-truncated disclaimers fail this test.
- **Readable in both light and dark theme:** contrast ratio ≥ 4.5:1 per WCAG 2.1 AA. Regulators have not adopted WCAG verbatim, but consumer-protection «clear and conspicuous» tests in the US and «prominence» under FCA increasingly cite accessibility standards as benchmarks for what counts as «clear».
- **Persistent (footer or sticky), not modal / dismissable:** dismissable disclaimers are the #1 vulnerability under SEC Marketing Rule and UCPD case law — once dismissed, the user-facing surface no longer carries the disclaimer, breaking the «general» prong of publisher-exclusion. Recommend persistent footer (always-visible across page transitions inside the app shell). Sticky banner is acceptable if stable across scroll. Modal-on-first-visit-then-gone is **not acceptable**.
- **Bilingual EN + RU mandatory:** EN is the day-1 launch language (per `02_POSITIONING.md` lock). RU is parallel-drafted for forward-readiness, **not for RU-market launch** (Russia explicitly out of scope per 2026-04-23 PO directive). The RU copy exists for: (a) RU-speaking users in EU/UK/US who prefer RU UI; (b) eventual Russia re-evaluation if the strategic position changes.
- **Plain language:** SEC plain-English requirements (17 CFR §230.421(d)) and FCA «clear, fair, not misleading» both penalize jargon-dense disclaimers as effectively-undisclosed.
- **Single block, not split:** the seven required statements should appear as one cohesive block, not scattered across page chrome. Splitting (e.g., «not an adviser» in footer + «past performance» in chart caption) creates ambiguity about which disclaimer applies where, weakening the «general» prong.
- **Same language as the page chrome:** if the user's UI is set to RU, disclaimer renders RU. If EN, EN. Mixed-language disclaimers (EN body with RU footer) fail the «clear and conspicuous» test in the secondary jurisdiction.

---

## 5. Jurisdictional flags

- **US users (SEC + state-level investment-adviser laws):** the phrase **«registered investment adviser»** is the canonical US term of art (15 U.S.C. §80b-3). Using «financial advisor» loosely is acceptable in the §1.7 referral-out (consult a licensed financial professional) because that pairs with «licensed». State-level Blue Sky laws (e.g., NY Martin Act, CA Corporate Securities Law) generally defer to federal investment-adviser definitions for tracker-class products but a few states have aggressive interpretations — counsel review pre-launch. CAN-SPAM-style sender identification is **not** required for in-app surfaces (CAN-SPAM applies to commercial email).

- **EU users (MiFID II + national):** the line is **«personal recommendation»** (Article 4(1)(4)) — a recommendation presented as suitable for that person based on their circumstances. The phrase «not personalized» / «not a personal recommendation» is the EU-native equivalent. The phrase «registered investment adviser» does not have a 1:1 EU translation — closest analogue is «authorised to provide investment advice under MiFID II». Recommend EN copy land **both**: «not a registered investment adviser, and does not provide personal recommendations under MiFID II». GDPR Article 13 transparency (controller identity, data sources, retention, rights) is satisfied via the privacy policy link, **not via disclaimer** — the disclaimer is regulatory-positioning, the privacy policy is GDPR-positioning. Per-member-state language obligations (DE: §305c BGB unfair-terms; FR: Loi Toubon language requirements) are a launch-time concern, not a TD-100 concern.

- **UK users (FCA + FSMA 2000):** post-Brexit the UK is its own jurisdiction with FCA-authoritative rules. **«Generic advice» exclusion** under PERG 8.28 is the operative carve-out — it requires the advice to be (a) not personalized, (b) not based on a consideration of the recipient's circumstances. Disclaimer language that says «describes historical broker data — not personalized recommendations» fits this exclusion. UK consumer-duty rules (FCA PS22/9, in force from 2023-07-31) impose «foreseeable harm» tests that make persistent prominence even more important.

- **Russian users (39-ФЗ + ЦБ РФ):** **out of scope** per PO 2026-04-23 lock. RU-translated disclaimer is forward-readiness only. If RU re-enters scope, the canonical phrasing for §1.1 is **«Provedo не является зарегистрированным инвестиционным советником»** (the term of art in 39-ФЗ Article 6.1 «инвестиционное консультирование» licensing). The educational-information carve-out under 39-ФЗ exists but is narrower than US/EU equivalents — flagged as escalation for Russian securities counsel only if scope re-opens.

- **Should disclaimer reference specific regulators?** **No — recommend jurisdiction-neutral phrasing for the body, with a parenthetical pointer for users to the privacy policy / terms of service for jurisdiction-specific details.** Reasons: (a) listing «SEC / ESMA / FCA» in the disclaimer body invites the reader to scrutinize the claim per-jurisdiction, raising the bar Provedo must clear; (b) jurisdiction-neutral wording covers US + EU + UK + LATAM + APAC + crypto-native (per global-без-РФ launch lock) without per-market re-litigation; (c) regulators who matter cite the **substance** of the disclaimer (impersonal, non-discretionary, general, prominent), not whether the regulator's name appears in the body. The §1.5 «does not execute trades or hold customer funds» line and §1.6 data-source line are jurisdiction-neutral and carry the cross-market substance.

---

## 6. Risk-weighting (HIGH / MEDIUM / LOW per missing statement)

| # | Missing statement | Risk | Reason |
|---|---|---|---|
| 1 | «Not a registered investment adviser» | **HIGH** | Foundational unlicensed-investment-advice exposure. Without this, every chart-bearing surface implicitly positions Provedo within regulated-adviser territory. SEC, FCA, and ESMA all treat absence of this disclaimer as an aggravating factor, not a neutral. |
| 2 | «Educational and informational purposes only» | **HIGH** | Without this textual frame, structural Lane-A defenses (schema gates) lack the user-facing label that publisher-exclusion case law (Lowe v. SEC) treats as part of the «general» prong. |
| 3 | «Not personalized recommendations» | **HIGH** | EU/UK exposure: MiFID II Article 4(1)(4) line is drawn at «personal recommendation»; FCA PERG 8.28 generic-advice exclusion requires explicit non-personalization. Missing this is the difference between Lane A and Lane C in the EU. |
| 4 | «Past performance does not guarantee future results» | **HIGH** | SEC Marketing Rule explicit; absence is an immediate red flag in regulator review and in plaintiff-bar discovery. Universal cross-jurisdiction expectation. |
| 5 | «Does not execute trades or hold customer funds» | **MEDIUM** | Rebuts broker / custodian inferences; absence creates Plaid-aggregator-vs-broker confusion. Lower priority than 1–4 because the negative inference is already weak (Provedo never had a trade-execution UI), but disclaimer hygiene benefits from explicit narrowing. |
| 6 | «Data sourced from your connected accounts; not verified real-time» | **MEDIUM** | GDPR Article 13(1)(e) transparency + consumer-protection no-misleading-claim posture. Higher in EU than US; medium overall. |
| 7 | «Consult a licensed financial professional» | **MEDIUM** | Conventional referral-out closer; absence is a red flag in regulator review but not in itself a violation. Strongly recommended. |

**Composite risk if all 7 missing:** product cannot launch in US / EU / UK without exposing the founders to unlicensed-investment-advice claims. **Composite risk with statements 1–4 present:** acceptable for soft-launch posture, with statements 5–7 added before broader rollout. **Recommendation:** ship all 7 from day 1 — there is no compliance-vs-velocity tradeoff here; the copy lift is small and the downside-tail is large.

---

## 7. Specific dispatch questions — direct answers

1. **SEC publisher-exclusion «general» prong — what minimum statements protect publisher status?** Statements §1.1 (not an adviser), §1.2 (educational), §1.4 (past performance), §1.7 (consult licensed professional) carry the «general» prong. Statements §1.3 (not personalized) and §1.5 (no trades / no custody) are belt-and-suspenders. The Lowe v. SEC three-prong test (impersonal + non-discretionary + general) is satisfied at the *content* level by the structural Zod gates and renderer-baked descriptive captions; the disclaimer is the *prominence* and *framing* layer that regulators look for above and beyond content.

2. **MiFID II Article 4(1)(4) personal-recommendation line — what disclaimer phrasing keeps content on the «information» side?** The phrase **«does not provide personal recommendations»** is the EU-native term of art. Pairing with «describes historical data» (factual, not predictive) and «not based on your individual circumstances» (rebuts the suitability prong) maps directly to the four definitional elements of Article 4(1)(4). Avoid the verb «advice» in positive constructions; only «does not provide investment advice» / «not a registered investment adviser» negative phrasing.

3. **FCA COBS 9.5 suitability analogues — does disclaimer affect this or is it irrelevant?** **Disclaimer is necessary but not sufficient.** COBS 9 suitability rules apply when the firm is «advising on investments» under FSMA 2000 Schedule 2 / RAO Article 53. The disclaimer is part of why Provedo is **not** advising-on-investments (PERG 8.28 generic-advice exclusion). If Provedo were advising, COBS 9 suitability assessments would be required and a disclaimer would not cure that — the disclaimer's purpose is to keep Provedo on the right side of the perimeter, not to mitigate post-perimeter obligations.

4. **39-ФЗ Russian investment-adviser law — special phrasing for RU disclaimer?** Out of scope per 2026-04-23 lock. Forward-readiness phrasing **«Provedo не является зарегистрированным инвестиционным советником»** is the canonical translation for §1.1. If Russia re-enters scope, the educational-information carve-out under 39-ФЗ is narrower than US/EU equivalents — escalate to Russian securities counsel; do not rely on direct translation of the EN disclaimer.

5. **Past-performance language — required by SEC + analogues (UK + EU)?** **YES — universal.** SEC Marketing Rule (17 CFR §275.206(4)-1) explicit; FCA COBS 4.6 balanced-presentation rule; ESMA guidelines per Article 24(3) MiFID II. Required wherever historical returns, dividends, drawdowns, sparklines, or any time-series chart is rendered.

6. **Data-source transparency — must we name brokerages we connect to?** **No — name the aggregator subprocessors (Plaid / SnapTrade), not individual brokerages.** Naming individual brokerages (Schwab / Fidelity / IBKR / etc.) creates impressions of partnership, endorsement, or coverage guarantees. Naming the aggregator layer is the GDPR Article 13(1)(e) transparency requirement and is honest about the data path. The full subprocessor registry (Clerk, Plaid, SnapTrade, Doppler, OpenAI / Anthropic, hosting provider) lives in the privacy policy, not the disclaimer.

7. **Should disclaimer reference specific regulators or stay jurisdiction-neutral? Recommend the call.** **Stay jurisdiction-neutral.** See §5 final paragraph for the three reasons. Jurisdiction-neutral phrasing covers the global-без-РФ market without per-market re-litigation, and regulators look at *substance* (impersonal, non-discretionary, general, prominent) not whether their name appears in the body.

8. **Frequency-of-display rule — persistent footer vs once-per-session vs route-entry banner?** **Persistent footer.** Once-per-session and route-entry banners both fail the SEC Marketing Rule «clear and prominent» test and the FCA COBS 4.2 «clear, fair, not misleading» test once the user has dismissed them. Persistent footer is the lowest-friction, highest-defensibility option. If product-designer's placement spec proposes sticky-banner-on-chart-routes-only, that is acceptable provided the banner does not auto-dismiss and is not user-dismissable. **Modal-on-first-visit-then-gone is forbidden.**

---

## 8. Compact summary (for Right-Hand synthesis)

- **Required statements (regulatory minimum count):** **7.**
- **Top-3 most critical (the «if you only include 3, include these»):** §1.1 «not a registered investment adviser», §1.2 «educational and informational purposes only», §1.4 «past performance does not guarantee future results». These three carry SEC publisher-exclusion + MiFID II + FCA cross-jurisdiction floor.
- **Top jurisdictional concern:** EU/UK personal-recommendation line (MiFID II Article 4(1)(4) + FCA PERG 8.28) requires explicit «not personalized» phrasing alongside US-canonical «not registered investment adviser» — a US-only disclaimer fails the EU/UK test.
- **Recommended format:** persistent footer (not modal, not dismissable), bilingual EN + RU, mobile-readable at 320px+, both light/dark theme contrast ≥ 4.5:1.
- **Output file:** `docs/reviews/2026-04-29-td100-disclaimer-legal.md` (this document).

---

## 9. Verification checklist (self-audit)

1. PASS — 7 required statements with regulatory citations per item.
2. PASS — 8 forbidden-statement items with claim-creation rationale.
3. PASS — Surfaces table covers user-facing chart routes, chat, insights, coach, exports, marketing, staff-only, auth, settings, errors, empty states.
4. PASS — Format requirements derived from regulatory tests (SEC «prominent», FCA «clear/fair/not misleading», WCAG-as-benchmark).
5. PASS — Jurisdictional flags US / EU / UK / RU with per-market term-of-art guidance and Russia-out-of-scope note.
6. PASS — Risk-weighting table with HIGH/MEDIUM ratings and reasoning.
7. PASS — Eight specific dispatch questions answered directly.
8. PASS — Caveat header documents licensed-counsel-not-substitute scope.
9. PASS — No code modifications. No source files outside `docs/reviews/` touched.
10. PASS — Hard rules honored (R1 / R2 / R4 / no velocity metrics).
11. PASS — No proposed final copy text (content-lead's domain). No proposed placement spec (product-designer's domain).

---

**End of legal angle. Required-statements count: 7. Top-3 critical: §1.1, §1.2, §1.4. Top jurisdictional concern: EU/UK personal-recommendation line. `[ATTORNEY REVIEW]` before production.**
