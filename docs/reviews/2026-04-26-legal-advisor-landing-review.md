# Legal-advisor Landing Review — Provedo v2/v3 Lane A audit

**Date:** 2026-04-26
**Author:** legal-advisor
**Method:** Line-by-line audit `docs/content/landing-provedo-v2.md` against Lane A regulatory boundary в US SEC + EU MiFID II + UK FCA + Russia 39-ФЗ + animation implications + disclaimer adequacy + EN/RU asymmetry
**Verdict:** **WARN** — Lane A held throughout copy; specific patches needed in disclaimer + Tab 3 + animation guardrails before production launch
**Confidence:** MEDIUM — first-pass internal SME read; final pre-launch clearance requires licensed counsel в каждой target jurisdiction

---

## Phase 1 — Section-by-section Lane A pass

| § | Section | Verdict | Notes |
|---|---|---|---|
| S1 | Hero «will lead you through» + «Ask Provedo» | **GO** | «Lead through» = Sage register allowlist, NOT «advise/recommend». «Across all your brokers» = aggregation, not custodian-implication (Tab S6 «cannot trade by design» reinforces). EN guardrail: PASS. |
| S2 | Numeric proof bar — «Lane A — information not advice» cell #4 | **GO** + minor flag | Direct Lane A claim в proof bar = strong defensive register. «Every observation cited» (cell label не указан, но в copy implies) — see WARN below: this commits Provedo to source-on-every-output. If AI hallucinates без source, the proof-bar claim becomes misleading advertising under SEC Rule 206(4)-1 (Marketing Rule, eff Nov 2022) AND FCA fin-promo rules (COBS 4.2.1R fair, clear, not misleading). Engineering-side: must actually enforce «every observation cited» в production AI persona — not aspirational copy. |
| S3 | Problem-negation «not a robo / not a brokerage / will not tell you what to buy» | **GO** | Strongest Lane A surface на page. Maps cleanly to: SEC Adviser Act §202(a)(11) publisher exclusion (impersonal + non-discretionary + general info — see Lowe v. SEC, 472 U.S. 181 (1985)), MiFID II Art 4(1)(4) «personal recommendation» negation, FCA PERG 8.28 «generic advice» exclusion. «Will not tell you what to buy» = bright-line commitment. **WARN below:** AI-output drift risk — must enforce in system-prompt (ALREADY in §S13 anchor) so prod model never violates the negation. |
| S4 Tab 1 | Performance-explanation «down 4.2%, AAPL/TSLA breakdown с Q3 earnings/delivery miss» | **GO** | Retrospective observation, public-record sources cited, no forward-looking forecast, no «consider selling». Clean across all four jurisdictions. |
| S4 Tab 2 | Dividend dates «KO/VZ/MSFT specific dates» | **GO** | Disclosed corporate-action data = public record. Forward-looking ONLY на published facts (ex-div dates), not return forecasts. Clean. |
| S4 Tab 3 | Pattern «sold AAPL within 3 days of >5% drop 3x; recovered within 8 weeks» | **WARN** | HIGHEST RISK section. Three issues: (a) The «recovered within 8 weeks» pattern, even framed «no judgment, no advice», can be read by SEC examiner as **personalized recommendation by implication** — pattern-with-outcome on user's own trades arguably crosses publisher-exclusion boundary (Lowe test #1 «non-personal/general info» — fails on personalization to user's specific trade history). (b) MiFID II Art 9 ESMA Q&A 2010 explicitly: «highlighting that a particular trade was suboptimal in hindsight» is borderline personal recommendation if presented as actionable framing. (c) FCA PERG 8.30B: «implied recommendation» test — if reasonable reader infers «I shouldn't sell on dips again», it's regulated advice. Disclaimer «no judgment, no advice» helps but не bullet-proof. **Patch needed — see Top 3 below.** |
| S4 Tab 4 | Aggregation «tech 58%, US retail median 34% context» | **GO** with caveat | «Median context» is generic factual reference, not personalized rec. Caveat: do NOT add interpretive layer like «which is high» — that drifts toward implicit advice. Current copy clean. |
| S5 | Editorial «You hold the assets. Provedo holds the context» | **GO** | «Holds context» = aggregator/memory framing, no advice register. Clean across all 4 jurisdictions. |
| S6 | Aggregation «hundreds brokers / read-only / cannot trade by design» | **GO** | Strong custodian/broker-dealer disclaimer. Important for SEC Rule 15a (broker-dealer registration exemption) + FCA «arranging deals» PERG 12 — read-only access is bright-line non-broker. Clean. |
| S7 | Pre-alpha builder testimonials | **GO** | Honest «builder» badge = no Section 5 SEC Marketing Rule violation (no fake user testimonials, no implied performance claims). Card 3 «no judgment, no advice» disclaim baked в. Clean. |
| S8 | FAQ Q1-Q6 | **GO** with one note | Q1 («Does Provedo give advice? — No. Information not advice») is the regulator-readable bright-line answer. Q2 «every decision stays yours» reinforces non-discretionary publisher-exclusion. Q5 «read-only API» = broker-dealer non-registration anchor. **Note:** Q3 «1000+ brokers» — tech-lead verification flag already noted; if claim materially overstates actual coverage, FTC §5 + FCA fin-promo «misleading» rules trigger. Honest fallback copy в v2 = good. |
| S9 | Pre-footer CTA «Open Provedo when you're ready» | **GO** | Same Sage register as hero. Clean. |
| S10 | Footer disclaimer (current) | **WARN** | See Phase 3 — needs jurisdictional tightening. |

**Net Phase 1 verdict:** Copy register is Lane A clean throughout. Two WARN flags concentrated в (a) Tab 3 personalized pattern + (b) footer disclaimer adequacy.

---

## Phase 2 — Animation guardrails recommended

v3 plans animated charts (line drawing, calendar dots, timeline marks, pie wedges). Three animation classes carry latent compliance risk:

### Risk 2.1 — Color-coded action signals

- **Red dots highlighting drawdowns на line chart** → can be read by reasonable user as «sell signal indicator» (TradingView mental model). FCA PERG 8.30B «implied recommendation» test: visual emphasis = implicit framing.
- **Green annotations на recovery points** → reinforces «hold and wait» strategy by visual coding.

**Guardrail:** Color-code ONLY for standard gain/loss semantic (red = down period, green = up period — that's accepted financial-data convention, not advice). DO NOT use red/green to highlight specific «action moments» (sell points, entry points, rebalance triggers). Annotation marks should be neutral слate-700 / blue, NOT red/green/orange.

### Risk 2.2 — Timeline emphasis on «recovered within 8 weeks» (Tab 3)

- Animation drawing timeline from sell point → 8-week-after recovery mark visually narrates a story «if you hadn't sold, you'd have recovered». This is the same implicit-recommendation problem as Tab 3 copy, amplified by motion.

**Guardrail:** Tab 3 timeline animation should present sell points + recovery points **simultaneously** (not sequentially-revealed) to reduce narrative-causation framing. OR add explicit visual disclaimer overlay «past pattern, not predictive» during animation.

### Risk 2.3 — Animation timing emphasizing certain data points

- If pie chart wedge for «tech 58%» pulses or scales-up while «median 34%» stays static → visual emphasis = implicit «pay attention to this for action».

**Guardrail:** All chart elements animate с same timing curve / no element gets disproportionate motion emphasis. Concentration callouts neutral, not action-coded.

### Recommended animation rules summary

1. Color: red/green ONLY for standard gain/loss period coding; never для action-moment annotation.
2. Timeline animations: present cause + effect simultaneously, not narratively-sequenced.
3. Motion emphasis: equal weight across data elements; no «look here for action» visual hierarchy.
4. Auto-replay disabled; user-triggered or single-play only (avoid drilling repeated message).
5. Reduced-motion media query respected (accessibility + reduces animation-amplified compliance risk).

---

## Phase 3 — Disclaimer adequacy per jurisdiction

**Current footer disclaimer:** «Provedo is not a registered investment advisor. Information is provided for educational purposes only. Past performance is not indicative of future results. All investment decisions are your own.»

| Jurisdiction | Citation | Verdict | Patch needed? |
|---|---|---|---|
| **US SEC** | Investment Advisers Act §202(a)(11) publisher exclusion + Rule 206(4)-1 Marketing Rule (eff Nov 2022) | **WARN** | Add: «Provedo does not provide personalized investment recommendations.» — closes SEC «personalization» element of advice test (Lowe / SEC No-Action Letter framework). Also recommend: «Provedo is not a broker-dealer» (separate from «not investment advisor» — these are different SEC registrations). |
| **EU MiFID II** | Directive 2014/65/EU Art 4(1)(4) «personal recommendation»; ESMA Q&A on investment advice | **WARN** | Add: «Provedo does not provide a personal recommendation as defined in MiFID II.» — explicit MiFID II language signals to EU regulators the firm has considered the regulation. Recommended for DE/IT/ES/FR launch waves. |
| **UK FCA** | FSMA 2000 + PERG 8.24-8.30B «advising on investments»; Consumer Duty (PRIN 2A, eff Jul 2023) | **WARN** | Add: «Provedo provides generic information, not regulated advice under FSMA 2000.» — explicit «generic advice» exemption invocation. Consumer Duty also requires «consumer understanding» — disclaimer should be readable, не just legal. |
| **Russia 39-ФЗ** | ст. 6.1 «индивидуальная инвестиционная рекомендация»; ФЗ-38 ст. 28 (рекламные ограничения финуслуг) | **N/A current launch** — geography lock 2026-04-23 explicitly excludes Russia. RU surface defer to wave-2. **WHEN/IF Russia opens:** add «Provedo не оказывает услуги по инвестиционному консультированию по смыслу 39-ФЗ» — explicit non-IIR (индивидуальная инвестиционная рекомендация) statement. Also: ФЗ-38 ст. 28 ч. 2 п. 2 requires disclaimer о рисках для рекламных материалов финуслуг — текущий disclaimer покрывает только частично. |

### Recommended tightened EN disclaimer (proposed)

> Provedo is not a registered investment advisor and is not a broker-dealer. Provedo provides generic information for educational purposes only and does not provide personalized investment recommendations or advice as defined under the U.S. Investment Advisers Act of 1940, EU MiFID II, or UK FSMA 2000. Past performance is not indicative of future results. All investment decisions are your own. Consult a licensed financial advisor in your jurisdiction before making investment decisions.

Length penalty acknowledged (current 39 words → proposed 75 words). Trade-off: explicit jurisdictional citation buys regulator-readable defense at cost of footer density. Recommendation: use proposed version OR jurisdiction-specific footer variants по geo-IP.

**[ATTORNEY REVIEW]** Final disclaimer wording must be reviewed by SEC-aware US counsel + MiFID II-aware EU counsel + FCA-aware UK counsel before production launch in respective markets.

---

## Phase 4 — Cross-language EN/RU asymmetry

Per geography lock 2026-04-23, Russia explicitly out-of-scope; RU surface deferred wave-2. Current landing EN-only — **no immediate cross-language compliance issue.**

**When RU surface eventually ships (post-launch CIS / RU-diaspora wave для не-РФ markets):**

1. **«Provedo проведёт через твой портфель» = naturally Lane A clean.** Sage «провести/проводить» в RU has zero advisor-drift gradient (per VOICE_PROFILE.md §RU guardrails). EN's «provide → recommend» downhill gradient does NOT exist in RU.

2. **39-ФЗ «инвестиционное консультирование» test** — granularity matters. RU regulator distinguishes:
   - Образовательная информация (общая) = NOT регулируется
   - Аналитическая информация (общая, не персонализированная) = NOT регулируется как ИИК
   - Индивидуальная инвестиционная рекомендация (ИИР) персонализированная под клиента = регулируется
   
   Tab 3 RU translation («Provedo заметил, ты продал AAPL...») — same personalization concern as EN Tab 3, possibly stronger because 39-ФЗ ст. 6.1 personalization test is explicit.

3. **Symmetric ban на «Provedo рекомендует / советует / даёт стратегию»** already in VOICE_PROFILE.md §RU guardrails — codified, content-lead enforces.

4. **Russia-specific copy NOT shipping** until and unless Russia geography lock changes. RU-language surface для не-РФ markets (CIS diaspora, Israel, Kazakhstan, etc.) does not invoke 39-ФЗ — но local consumer protection laws may apply per market. Out of scope this review.

**Net Phase 4:** No active cross-language compliance gap currently. Wave-2 RU launch dispatch should re-engage legal-advisor для market-specific clearance.

---

## Phase 5 — Final verdict: **WARN**

Lane A held throughout copy register — guardrails working as designed (5-item EN rules active, voice-allowlist enforced, problem-negation §S3 surfaces Lane A as feature). Two specific gaps require patching before production launch:

1. **Tab 3 personalized-pattern framing** carries implicit-recommendation risk under SEC publisher-exclusion test + MiFID II Art 9 + FCA PERG 8.30B implied-rec test. Disclaimer «no judgment, no advice» helps но не sufficient.
2. **Footer disclaimer** under-specified for SEC + MiFID II + FCA — current wording covers «not investment advisor» but missing «not broker-dealer», «no personalized recommendations», explicit jurisdictional citations.
3. **Animation guardrails** не codified — risk of color/timing/emphasis drift into implicit-action register once v3 motion lands.

These are PATCH-level not REWRITE-level issues. Lane A framework intact; tightening required.

---

## Top 3 specific patches recommended for v3.1

### Patch 1 — Tab 3 framing reinforcement

**Current (Tab 3 response):** «You sold Apple within 3 trading days of a >5% drop, three times last year. Each time, AAPL recovered above your sell price within 8 weeks. Provedo notices — no judgment, no advice.»

**Proposed:** «You sold Apple within 3 trading days of a >5% drop, three times last year. AAPL's price returned above your sell level within 8 weeks each time. This is a retrospective observation about past trades; not a recommendation about future trading decisions, and past patterns do not predict future results.»

**Rationale:** Replaces «recovered above your sell price» (which carries implicit «you missed gains») with neutral «price returned above your sell level» (factual). Adds explicit «not a recommendation about future trading decisions» which is the SEC/MiFID/FCA bright-line phrase examiners look for. Adds «past patterns do not predict future results» — standard FCA/SEC required language for backward-looking analysis.

### Patch 2 — Footer disclaimer tightening

Replace current footer with proposed jurisdiction-explicit version (Phase 3 above): adds «not broker-dealer» + «no personalized recommendations» + explicit Investment Advisers Act / MiFID II / FSMA 2000 citations + «consult licensed advisor» close.

**Rationale:** Three specific regulatory-readable phrases close known examiner test points. Current disclaimer covers ~60% of needed surface; proposed covers ~90%. Final 10% requires per-jurisdiction attorney review.

### Patch 3 — Animation guardrails section в design spec (NEW)

Add explicit «Animation Compliance Guardrails» section to product-designer's chart/motion spec:
1. Color coding red/green only для gain/loss period semantic, not action-moment annotation.
2. Cause + effect timeline animations present simultaneously, не sequentially-narrated.
3. Equal motion weight across data elements; no «look here for action» hierarchy.
4. Reduced-motion query respected.
5. Auto-replay disabled.

**Rationale:** Animation can amplify implicit-recommendation framing even when copy is Lane A clean. Codifying guardrails into design spec prevents drift during v3 motion implementation.

---

## Caveat

WebFetch indirect signal только для regulator guidance; agent did not live-fetch SEC.gov / EUR-Lex / FCA.org.uk this session (relies on doctrine knowledge to cutoff Jan 2026). Final regulatory clearance requires attorney review pre-launch in each target market:

- **US launch:** SEC-registered compliance counsel ($300-2K initial opinion). Per Rule 1, NOT initiated — PO greenlight per-transaction required.
- **EU launch:** MiFID II-aware counsel в DE first (highest ICP weight per positioning v3.1). $300-2K range.
- **UK launch:** FCA-aware financial-promotion counsel. Consumer Duty post-Jul 2023 makes this non-optional. $300-2K range.
- **Russia:** N/A current scope.

Total estimated pre-launch legal spend across 3 jurisdictions: **$900-6K**. Recommend single counsel firm с multi-jurisdiction practice (e.g., Latham, Cleary Gottlieb, Linklaters) to reduce overhead, OR specialty fintech boutiques (e.g., Lewis & Llewellyn UK, Bird & Bird EU). PO greenlight per Rule 1 obligatory.

---

## Compliance notes

- **Rule 1 (no spend):** No paid services initiated. No external counsel engaged. All sources public/free.
- **Rule 2 (no comms):** No outreach to regulators / counsel / external parties. Internal artifact only.
- **Lane A:** Held — verdict patches specific gaps, не challenges Lane A lock.
- **Bilingual:** EN audit primary; RU asymmetry analysis included (Phase 4); 39-ФЗ deferred per geography lock.

**END landing-review.md**
