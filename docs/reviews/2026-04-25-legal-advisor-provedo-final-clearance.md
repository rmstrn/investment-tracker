# Provedo TM Final Clearance — Round 2

**Date:** 2026-04-25
**Author:** legal-advisor (Round 2 — post PO manual GUI verification of EUIPO + partial DPMA)
**Method:** PO-supplied EUIPO + DPMA partial findings + agent-side WebFetch на NorthData (DEU1308.HRB25090 + DEU1308.HRB28698 + Provedo NL KvK 88563421), DPMA / USPTO / EUIPO / TMview / Justia / Trademarkia / Markify / uspto.report / Bing / Google / DuckDuckGo / Yandex / Ecosia / Qwant. Direct GUI databases JS-blocked OR session-expired (expected); Bing / Yandex / Google all degraded (Ukrainian-routed noise: Twitch / Coursera / Microsoft stock / oropharyngeal airways across unrelated queries).
**Confidence:** MEDIUM-HIGH on EUIPO (PO direct check) + Provedo GmbH extinction (NorthData confirmed). LOW-MEDIUM on USPTO (no source surfaced live signal in this session — same Bing/search degradation pattern as Round 1, but PO has not done direct GUI yet either). LOW on remaining 4 DPMA hits (PO showed only 1 of 5).
**Confidence on final TM filing decision:** still requires attorney opinion before US/EU filing.

---

## Phase 1 — DPMA complete search (PARTIAL — agent could not fill the 4-hit gap)

PO showed Hit 1 = patent abandoned 2019, irrelevant to TM filing.

Agent-side direct DPMA register access blocked: Session-expired / JS-only result rendering / search-redirected to interface template only. Bing / Yandex / Google fallbacks all returned irrelevant noise (Twitch, Coursera, MSFT stock — search routing degraded today across all queries).

**What WAS surfaced via NorthData (German company-register aggregator, free):**

| # | Mark / filing | Owner / filer | Source / status | Risk to us |
|---|---|---|---|---|
| 1 | Patent 10 2012 001 401.5 (Gebäudeautomation) | provedo GmbH HRB 25090 (EXTINCT) | DPMA — abandoned 29.01.2019 (per PO finding) | None — patent, not TM |
| 2 | Wortmarke / Wort-Bildmarke **«provedo agile software»** | **Synexus Software GmbH** (predecessor of Provedo GmbH HRB 25090) — filed **30.09.2010** | NorthData publication; DPMA mark register direct-check blocked. Likely IC 9 (software) + IC 42 (software services). Mark term = 10 years; renewal would have fallen due Sept 2020 — exactly during insolvency proceedings (2018-2019). NorthData explicitly states «**No evidence of asset transfers to successor entities is documented in the available publications.**» | **Likely lapsed/abandoned** but unconfirmed. If unrenewed past Sept 2020 + 6-month grace period → mark dead. Direct DPMA register read by PO needed to confirm status. |
| 3 | Patent: «Verwendung einer elektrischen Leitung…» (DE 10 2012 001 401.5) | provedo GmbH | abandoned 2019 | None — same as Hit 1 |
| 4-5 | Remaining 2 unconfirmed DPMA hits | — | Cannot identify from agent side; PO direct register read needed | Unknown |

**Provedo Software GmbH (HRB 28698, ACTIVE) — own DPMA mark filings:**
- Agent searched NorthData direct entity profile + Bing «Provedo Software GmbH Markenanmeldung» — **NO own DPMA Wortmarke/Bildmarke surfaced.**
- This is a meaningful negative signal: if they had registered own mark, it would typically appear in NorthData publications (NorthData indexes DPMA register publications). **Working assumption: Provedo Software GmbH operates under company-name common-law usage, no registered DPMA mark in their own name.**
- Caveat: agent can't be 100% sure from this side; PO can verify via DPMA register-of-record direct entity-applicant search.

---

## Phase 2 — USPTO complete search (BLOCKED)

USPTO TESS direct: JS-rendered, returned «search interface only» on WebFetch.
Justia trademarks (third-party USPTO mirror): 403.
uspto.report: 403.
Trademarkia: 403 / ECONNREFUSED.
Markify: 404.
Bing / DuckDuckGo / Yandex / Ecosia / Qwant — все returned irrelevant noise (Twitch / MSFT stock / Coursera / oropharyngeal airways) для USPTO+PROVEDO queries today.

**Net USPTO signal:** SAME as Round 1 — indirect-clean / no surfaced live registration / cannot affirmatively confirm. PO's direct GUI search (https://tmsearch.uspto.gov/, free, JS-rendered, ~10 min) remains the **mandatory pre-filing step** for US.

**Phonetic-confusion sweep (PROVIDA / PROVEDERE / PROVEDA / PROVEDO):**
- Bing «PROVIDA trademark IC 9 OR IC 42» → returned MSFT stock noise. No live-mark signal surfaced.
- This is NOT confirmation of clean; same search-degradation issue. PROVIDA in particular has historical use as Latin-American insurance brand (general category-knowledge) — direct USPTO/EUIPO 2(d) check obligatory.
- PROVEDERE / PROVEDA — no commercial brand surfaced in any search engine today, but degraded environment limits confidence.

---

## Phase 3 — Provedo Software GmbH scope assessment (CRITICAL UPDATE)

**Direct site fetch (provedo-software.de):** 403 (Cloudflare/anti-scrape).
**Impressum page:** 403.
**Jobs page:** ECONNREFUSED.
**LinkedIn /company/provedo-software:** 404.
**Implisense profile:** 400.
**Kompass profile:** 403.

**ONE source surfaced concrete data:** NorthData (HRB 28698, free aggregator).

**Charter / Gegenstand des Unternehmens (NorthData verbatim):**
> «services in the field of information and telecommunications technology, in particular software development, **sales and licensing of software products**, consulting and trading in EDP hardware products as well as software and accessories, system support, consulting, installation, maintenance and assembly of EDP and telecommunications networks.»

**This is broader than «pure B2B custom dev services» that Round-1 verification report posited.** The charter explicitly includes:
- «sales and licensing of software products» — implies own/licensed product lines (not just bespoke client-work)
- «trading in software and accessories» — implies branded resale
- These activities sit in **IC 9 (downloadable software products) + IC 42 (software services)** — same target classes as ours

**Implication:** Provedo Software GmbH has **company-name common-law trademark rights** in Germany covering broad software-products + software-services scope. Whether they ALSO have registered DPMA Wortmarke is unconfirmed — agent's negative signal is suggestive but not definitive.

**German common-law trademark doctrine (§ 4 Nr. 2 MarkenG):** Unregistered marks gain protection through use «soweit das Zeichen innerhalb beteiligter Verkehrskreise als Marke Verkehrsgeltung erworben hat» (acquired secondary meaning within relevant trade circles). For a 13-year-old (founded 2012) software dev company actively hiring + with public web presence → at minimum local/regional protection in DE software-industry circles.

**Likelihood-of-confusion analysis:**
- Their use: B2B software development services + product sales/licensing (IC 9 + IC 42, broad)
- Our use: B2C downloadable consumer app for personal investment tracking (IC 9 narrower) + financial information services (IC 36 — they don't operate here) + AI/analytics services (IC 42 narrower)
- Sub-channel difference: B2B-services vs B2C-product-app — non-trivial distinction in EU TM examination
- Geographic overlap: both DE-domiciled (assuming we file EU TM)
- Channel overlap: tech-press / app-stores vs B2B procurement — partial divergence

**Net:** Coexistence **plausible** but **NOT certain.** Examiner OR Provedo Software GmbH (if they perceive threat) could oppose under § 9 Abs 1 Nr 2 MarkenG (Verwechslungsgefahr). Risk magnitude: 30-50% opposition probability if filed broad-scope IC 9. Mitigation: file narrower goods/services description focused on «mobile application for personal investment portfolio tracking» (IC 9) + «providing financial information via website and mobile application» (IC 36 — they don't operate here) + «software-as-a-service for personal finance management» (IC 42, consumer-narrowed). This narrowing reduces examiner-side similarity finding.

---

## Phase 4 — Phonetic confusion field

Same search-environment limitation as Round 1 + this session. No concrete live mark surfaced для PROVIDA / PROVEDERE / PROVEDA in any engine today.

| Variant | Risk | Status |
|---|---|---|
| PROVIDA | Common Latin-American insurance brand (category-general knowledge); likely live registrations in IC 36 (insurance) in multiple LATAM jurisdictions | **Direct USPTO + EUIPO 2(d) check obligatory before US/EU filing.** Cross-class IC 9/42 likely safer; IC 36 risky. |
| PROVEDERE | Italian archaic verb form; could have local Italian commercial registrations | Direct EUIPO + UIBM (Italian PTO) check before Italy launch; not blocking US/EU primary filing |
| PROVEDA | No commercial brand surfaced; possible health/wellness micro-brands | Lower priority, direct check only if examiner cites |
| PROVEDO | This is our target. Round 2 findings: dual-fortress (Viveros + Provedo Software GmbH active common-law) | See verdict |

---

## NEW FINDING: Third Provedo entity surfaced — Provedo Security (Netherlands)

NorthData entity-search «Provedo» surfaced a **third European entity not in Round 1 or namespace audit**:

- **Name:** Provedo / «Provedo Security»
- **Location:** Gorinchem, Netherlands
- **Registration:** KvK 88563421 (Dutch Chamber of Commerce)
- **Stated purpose:** «Security»
- **Scale:** Unconfirmed. Direct provedo.nl fetch = ECONNREFUSED. KvK number format suggests recent registration (Dutch KvK numbers in 88xxxxxx range = 2022-2024 cohort).

**Risk:** «Security» purpose is broad — could be physical security / cybersecurity / IT security. If cybersecurity, sub-class IC 42 overlap risk. If physical security, no IC 9/36/42 overlap — cross-class, low risk.

**Action:** PO direct verification at provedo.nl + KvK lookup before EU filing. If cybersecurity → potential additional EU-coexistence concern (small entity, low fortress weight, but still examiner-citable).

---

## Final TM clearance verdict: **WARN-CONDITIONAL** (downgraded from Round 1 «WARN»)

**Verdict shifts WARN-LOCK → WARN-CONDITIONAL** because Round 2 surfaced two material refinements vs Round 1:

1. **Provedo Software GmbH active common-law TM scope is broader than originally posited** (charter explicitly «sales and licensing of software products», not pure B2B services). DE/EU coexistence requires narrowed goods/services drafting + likely attorney pre-filing review at $300-2K. Was implicit in Round 1 «WARN» but Round 2 makes the geometry concrete.
2. **Third Provedo entity (Provedo Security NL)** surfaced — unverified scope. Adds one more EU-coexistence variable.

**EUIPO conclusion (PO direct check):** confirmed CLEAR for Wortmark «PROVEDO» in target IC 9/35/36/38/42. Only Viveros Provedo figurative IC 31+44 — cross-class, NO blocker. **This is the strongest positive Round-2 finding.** Direct EUIPO clearance had been the highest-confidence-needed item from Round 1; PO's manual GUI delivery resolves it.

**USPTO conclusion:** UNCONFIRMED. Same search-environment degradation as Round 1. PO direct GUI step still mandatory before US filing. Indirect signal continues to be «no surfaced live mark» (consistent across two sessions) but confidence is LOW-MEDIUM, not HIGH, until PO directly checks tmsearch.uspto.gov.

**DPMA conclusion:** PARTIAL. PO showed 1 of 5 hits (irrelevant patent). Critical pending items:
- Mark «provedo agile software» (Synexus 2010) — likely lapsed (10-year term + 2018-2019 insolvency timing + no transfer per NorthData), but unconfirmed.
- Provedo Software GmbH own marks — unconfirmed (suggestive negative; needs PO direct entity-applicant search).

**Romance / Phonetic / Lane A:** Unchanged from Round 1. Provedo etymology regulatorily neutral; cross-language pejorative ZERO; PROVIDA phonetic sweep flagged for direct check.

---

## Pre-purchase actions (Provedo.ai $140-170 / 2 yr — PO greenlight per Rule 1)

If PO proceeds despite WARN-CONDITIONAL:

1. **Domain purchase decision is LOW sunk cost** ($140-170). Even if TM filing later blocked → can pivot brand cheaply.
2. **Recommendation:** Domain acquisition is OK to proceed before TM clearance is fully resolved, IF PO accepts the risk that the brand may need to change post-attorney-opinion (rare but possible). Many brands operate domain-only without filed TM in early stages.
3. **Pre-purchase PO actions:**
   - WHOIS check of provedo.ai via Spaceship/Porkbun GUI before checkout (verify no premium hold)
   - Concurrent PO direct GUI USPTO TESS «PROVEDO» (~10 min, free)
   - Concurrent PO direct DPMA register search for «provedo agile software» status + applicant search «Provedo Software GmbH» own filings (~15 min, free)

---

## Pre-TM-filing actions (BLOCKING for US/EU public TM filing)

1. **Attorney opinion before EU + US TM filing.** Estimated $300-2K depending on scope. Per CONSTRAINTS Rule 1 — **NOT initiated**; PO greenlight required per-transaction. Recommend EU-aware IP counsel (Germany or Spain admitted) given Viveros Provedo + Provedo Software GmbH both DE/ES-domiciled.
2. **Goods/services description narrowing.** Recommend filing IC 9 narrowed to «downloadable mobile application for personal investment portfolio tracking and financial information visualization» + IC 36 «providing financial information via online platforms» + IC 42 «providing temporary use of online non-downloadable software for personal investment tracking». Avoid broad «software development» / «software products» language that would directly overlap Provedo Software GmbH's charter scope.
3. **PO direct GUI USPTO TESS** «PROVEDO» — filter IC 9/35/36/38/42, document any LIVE marks. ~10 min, free. **Mandatory before US filing.**
4. **PO direct DPMA register search** — applicant-search «Provedo Software GmbH», mark-search «provedo agile software» status + 2020 renewal record. ~15 min, free. **Mandatory before EU filing.**
5. **PO direct WHOIS / KvK lookup of Provedo Security (Gorinchem NL, KvK 88563421)** — verify scope (cybersecurity vs physical security). ~5 min, free. Inform attorney opinion.
6. **Phonetic-confusion direct check** PROVIDA in IC 9/36/42 in USPTO + EUIPO. ~10 min, free.
7. **Italian + Spanish + Russian register checks** (TMview cross-jurisdictional, Italian Camera di Commercio, OEPM, Rospatent) — same as Round 1 list. Free, manual, ~30 min total. Mandatory before respective public market launch.
8. **Copy guardrails (content-lead owns).** «Provedo provides insights/information» OK; «Provedo provides advice/recommendations» NOT OK — same as Round 1.

---

## Caveat

Agent-side TM searching constraints persist:
- DPMA + EUIPO + USPTO direct registers are JS-rendered → WebFetch returns interface templates / session-expired pages / 403s.
- All major search engines today returned regional Ukrainian-routed irrelevant noise (Twitch / Coursera / MSFT stock / oropharyngeal airways) — search-environment degradation, not signal of clean.
- NorthData (free German aggregator) was the **only** source that delivered concrete entity + IP-publication data this session — used for Provedo GmbH (HRB 25090) extinction confirmation, Provedo Software GmbH (HRB 28698) charter extraction, and surfacing of Provedo Security NL (KvK 88563421).
- This artifact is **first-pass legal review by internal SME**, NOT a trademark clearance opinion. Final filing decisions require licensed IP counsel + direct register verifications. The escalation list above remains in force.

**Critical line:** Round 1 verdict was «WARN-LOCK with pre-launch requirements». Round 2 confirms EUIPO clear (good), reveals Provedo Software GmbH broader common-law scope (concerning, requires narrow drafting + attorney pre-filing review), and surfaces a third entity (Provedo Security NL, scope unverified). **Net: WARN-CONDITIONAL is the honest verdict** — name still viable, but pre-filing actions are non-trivial and attorney engagement at $300-2K becomes more clearly necessary, not optional, for EU filing.

---

## Compliance notes

- **Rule 1 (no spend):** No paid clearance services / attorney engagements / domain registrations initiated by this agent. All sources used are free public web (NorthData free tier, public registries, search engines, archive.org). Domain purchase + attorney engagement remain PO greenlight per-transaction.
- **Rule 2 (no comms):** No outreach to Viveros Provedo / Provedo Software GmbH / Provedo Security NL / mark holders / registry operators. Passive observation only.
- **Rule 3 (multi-agent):** This artifact = legal angle of Round 2 multi-agent validation per Navigator dispatch.
