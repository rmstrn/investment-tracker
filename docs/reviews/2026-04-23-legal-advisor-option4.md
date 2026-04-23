# Legal-advisor independent review — Option 4 «Second Brain for Your Portfolio»

**Specialist:** legal-advisor (internal SME, NOT licensed attorney)
**Date:** 2026-04-23
**Seen other reviews:** NO — independent parallel dispatch per CONSTRAINTS Rule 3
**Scope:** per-jurisdiction Lane A boundary check + trademark collision scan + subprocessor data-handling implications for the «Second Brain for Your Portfolio» metaphor, sub-hero «Remembers. Notices. Explains.», and three landing proof bullets currently drafted.

---

## Verdict

**WARN (conditional GO).** Lane A is materially defensible across all four target jurisdictions for the «Second Brain» framing AS DRAFTED, BUT three concrete drafting changes are required before public launch, and one trademark dimension (USPTO IC 9 / IC 36 / IC 42 «Second Brain» landscape) requires a paid clearance search through licensed counsel before brand investment scales. None of these are kill-shots; all are pre-launch fixes.

**One-line:** the metaphor itself does not cross any of the four regulator perimeters, but the COACH bullet («Reads patterns in your trades») sits closer to the EU MiFID II + UK FCA «personal recommendation» line than the rest of the copy, and the brand-name «Second Brain» has live commercial presence (Tiago Forte / Building a Second Brain LLC) that makes the descriptive-brand collision risk non-trivial.

---

## Reasoning

The Lane A doctrine works in all four jurisdictions when the product genuinely:

1. Does NOT issue personalized recommendations (does not say «buy / sell / rebalance»).
2. Does NOT present analysis as «suitable for you» based on your specific objectives + risk tolerance + circumstances.
3. Frames output as observation, calculation, or surfacing of factual data.
4. Is delivered impersonally (same logic surfaces same outputs for same inputs).
5. Carries clear, prominent, persistent disclaimers.

The current draft satisfies (1) and (3) cleanly. It satisfies (4) at the architecture level but the *brand language* — «your second brain», «remembers YOUR patterns», «reads patterns in YOUR trades» — actively emphasizes personalization. That is a positioning strength and a regulatory risk simultaneously. The personalization framing is the wedge; it is also the closest approach to the «personal recommendation» perimeter in EU/UK rules.

The «Second Brain» metaphor itself is not a regulated-activity trigger — it is a UX descriptor, not a legal claim. The Lane A boundary turns on what the AI OUTPUTS say to the user about their actual portfolio, not what the landing-page hero calls the product. The risk concentration is therefore in product copy + AI prompt outputs, not in the metaphor.

---

## Per-jurisdiction analysis

### US (SEC — Investment Advisers Act of 1940 §202(a)(11))

**Citation:** 15 U.S.C. § 80b-2(a)(11) — definition of «investment adviser»; SEC Release No. IA-1092 (1987) — interpretation of the definition; Lowe v. SEC, 472 U.S. 181 (1985) — publisher's exclusion First Amendment frame.

> «Investment adviser» means any person who, for compensation, engages in the business of advising others, either directly or through publications or writings, as to the value of securities or as to the advisability of investing in, purchasing, or selling securities, or who, for compensation and as part of a regular business, issues or promulgates analyses or reports concerning securities.

**Source:** https://www.law.cornell.edu/uscode/text/15/80b-2 (accessed 2026-04-23)

**Analysis.** The Advisers Act applies if a person (a) for compensation, (b) is in the business of, (c) providing advice to others as to the value of securities or the advisability of buying/selling them. All three prongs are likely met by a paid Plus/Pro tier Second Brain product on a literal read — UNLESS an exclusion applies.

The relevant exclusion is the **publisher's exclusion** at § 202(a)(11)(D), narrowed by *Lowe v. SEC* (1985) into a three-part test articulated by the Supreme Court and adopted in subsequent SEC guidance:

1. **Bona fide publication** — genuine publishing/information business, not a façade for personalized advice.
2. **Of general and impersonal nature** — does not provide individualized advice based on particular client situations.
3. **Not promoted as a regular business of advising specific clients** — does not hold itself out as an investment adviser.

The Second Brain product **breaks prong 2** as currently framed. «Reads patterns in your trades», «answers on your actual holdings», «notices what you would miss» are explicitly individualized — analysis is generated FROM the user's specific portfolio data and PRESENTED AS «yours». That is the opposite of «general and impersonal».

This does NOT automatically trigger Adviser status. The SEC's interpretation in Release IA-1092 (https://www.sec.gov/rules/interp/ia-1092.pdf, accessed 2026-04-23) clarifies that personalization-of-presentation is not the same as advice-of-securities. A spreadsheet that calculates concentration percentages on your portfolio is personalized output but is not «advice as to the advisability of investing». A statement «AAPL is 14% of your portfolio» is observation; «you should reduce AAPL to 10%» is advice.

**Where the line is in our copy:**
- HERO «Second Brain for Your Portfolio» — observation framing, no advice. **CLEAR.**
- SUB «Remembers. Notices. Explains.» — passive-observer verbs. **CLEAR.**
- PROOF 1 «Ask anything about your actual holdings. Answers cite their sources.» — Q&A informational, with sources. **CLEAR** if AI prompts enforce no-advice constraint at output level (this is engineering enforcement, not landing copy).
- PROOF 2 «Surfaces dividends, drawdowns, and concentration shifts before you notice.» — observation of factual events. **CLEAR.**
- PROOF 3 «Reads patterns in your trades. No judgment, no advice — just what it sees.» — borderline. «Reads patterns» is observation. The explicit «no judgment, no advice» disclaimer is helpful and reinforces the publisher's exclusion narrative. **CLEAR** as drafted, IF the actual coach output stays observational («you sold AAPL three times near local lows last year») rather than prescriptive («consider holding longer next time»). If the coach copy ever drifts into prescription, this bullet becomes evidence the company knew the line and crossed it anyway.

**Verdict:** **GO with one engineering invariant + one copy invariant.**
- **Engineering invariant:** AI system prompt MUST hard-block prescriptive output across chat + insights + coach surfaces. This is the architectural foundation for the publisher's exclusion claim. Tracked in `02_POSITIONING.md` Tone of Voice section already; needs to be tested as a product invariant, not a stylistic preference.
- **Copy invariant:** Coach surface output (the actual pattern-read text shown to users) must stay descriptive. «You sold AAPL at the local low three times» = observation. «You tend to sell into drawdowns» = pattern observation, still OK because it is a factual generalization of historical behavior, not a recommendation. «You should hold longer next time» = advice, off-limits.
- **First Amendment overlay:** *Lowe* recognized publishing/educational content has First Amendment protection independent of the Advisers Act. Helpful as defense-in-depth but should not be the primary defense.

**Compensation prong note:** Free tier alone does not satisfy «for compensation» — the Free tier is safer regulatorily. Paid tiers (Plus $8-10, Pro $20) meet the compensation prong. This means the Lane A defense has to hold for paid tiers, which is the riskier path. Acknowledged in current pricing model.

**State regulators (NASAA).** Each US state has its own investment-adviser registration regime under the Uniform Securities Act. California, New York, Texas have stricter publisher's exclusion interpretations than federal SEC. **[ATTORNEY REVIEW]** required per-state before public launch in any state. Cost estimate: $3-8K for a single competent securities attorney to deliver multi-state opinion letter. Not blocking pre-alpha; blocking before public marketing.

---

### EU (MiFID II — Directive 2014/65/EU Article 4(1)(4))

**Citation:** Directive 2014/65/EU on markets in financial instruments, Article 4(1)(4):

> «Investment advice» means the provision of personal recommendations to a client, either upon its request or at the initiative of the investment firm, in respect of one or more transactions relating to financial instruments.

**Source:** https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02014L0065-20240328 (consolidated version, accessed 2026-04-23)

**Personal recommendation** is further defined in **Commission Delegated Regulation (EU) 2017/565 Article 9** as a recommendation that is:
1. Made to a person in their capacity as investor or potential investor
2. Presented as suitable for that person, OR based on a consideration of the circumstances of that person
3. Concerning a specific financial instrument
4. To buy, sell, subscribe, exchange, redeem, hold, or underwrite

**Source:** https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32017R0565 (accessed 2026-04-23)

**ESMA Q&A guidance (ESMA35-43-349, latest update 2024)** — recommendations on social media or via algorithmic interfaces are not exempted from MiFID II if they meet all four prongs.

**Analysis.** The EU test is more granular than the US test. All FOUR prongs must be met for «investment advice». Our product:

1. **Made to a person in their capacity as investor:** YES — users sign up specifically as portfolio holders.
2. **Presented as suitable / based on circumstances:** **The risk concentration is here.** «Suitable for you» language is forbidden. Current copy avoids «suitable» but uses «your portfolio», «your trades», «your actual holdings» extensively. EU regulators have signaled that algorithmic personalization to portfolio data IS a «consideration of the circumstances of that person» even without an explicit «suitable» claim. (See ESMA Final Report on robo-advice, ESMA50-164-3741, https://www.esma.europa.eu/sites/default/files/library/esma50-164-3741_final_report_on_the_implementation_of_the_2018_robo-advice_strategy.pdf — accessed 2026-04-23, paraphrased.)
3. **Concerning a specific financial instrument:** **Borderline.** «Surfaces dividends, drawdowns, concentration shifts» often will mention specific tickers («NVDA at 52w high — 14% of your portfolio»). That is a specific instrument reference.
4. **To buy / sell / hold etc.:** Currently NO — copy and AI guardrails exclude prescriptive verbs.

The product currently fails prong 4, which is the cleanest break. The Lane A defense in EU is thus **«we hit prongs 1–3 but never prong 4»**. As long as no AI output ever recommends buying, selling, holding, exchanging, or rebalancing a specific instrument, the four-prong test fails and the activity is **investment information**, not advice.

**Practical implication.** Prong 4 is FRAGILE in this product surface. The coach pattern-reads in particular tend toward implicit recommendations:
- «You sold AAPL near local lows three times last year» implicitly suggests «consider not selling AAPL near local lows» — which is a recommendation to HOLD a specific instrument under specific circumstances. This is closer to the perimeter than US analysis suggests.
- The «Notice» tab example «$124 in dividends · NVDA at 52w high — 14% of your portfolio · EUR cash losing -2.1% to inflation» — the third bullet («EUR cash losing to inflation») borders on a recommendation by implication (the implied next step is «move EUR cash»). Even without prescriptive verbs, EU regulators evaluate the substance of the communication, not just the literal words.

**Verdict:** **WARN — needs additional specific guardrails before EU public launch.**
- **Coach output must avoid implicit-recommendation framing.** Pattern observations should be PURELY historical/descriptive, not invite-action. «You sold AAPL three times last year» is fine. «You sold AAPL three times last year — see what others do in this pattern» crosses the line.
- **Insights output** «EUR cash losing -2.1% to inflation» is borderline. Recommend reframing to pure observation: «EUR cash position: -2.1% real return YTD against EU CPI». The framing «losing» implies action; «-2.1% real return» is mechanical.
- **Add explicit «not investment advice» AI output disclaimer** at the end of any chat/insights/coach response in the UI (not just landing footer). MiFID II + ESMA guidance both treat consistent in-context disclaimers as a defense factor; landing-only disclaimers are insufficient when the surface that delivers personalized analysis is multiple clicks away from the landing page.
- **Member-state variance:**
  - **Germany (BaFin):** known stricter — BaFin has historically interpreted «investment information» narrowly. The German Securities Trading Act (Wertpapierhandelsgesetz / WpHG) §2(8) implements MiFID II with an additional «Anlageberatung» definition that includes «Anlagestrategieempfehlung» (investment strategy recommendations) — concentration-shift surfacing could be read as strategy recommendation. **[ATTORNEY REVIEW]** by German securities counsel before DE launch.
  - **France (AMF):** AMF has separately issued Position-Recommandation 2013-22 on online financial promotion that requires explicit risk warnings on every page mentioning specific financial instruments. Our footer-only model would fail AMF guidance.
  - **Netherlands (AFM):** AFM has been active on robo-advice perimeter cases; less of a worry for our framing but worth a check.
- **Cost estimate for EU per-member-state legal review:** €5-15K per market for a competent licensed advisor; or single pan-EU legal opinion from a multi-jurisdictional firm at €15-30K. Not blocking pre-alpha; blocking before EU public marketing.

---

### UK (FCA — FSMA 2000 Article 53 + Perimeter Guidance PERG 8 + COBS 9)

**Citation:** Financial Services and Markets Act 2000 (Regulated Activities) Order 2001, **Article 53** — advising on investments:

> Advising a person is a specified kind of activity if the advice is — (a) given to the person in his capacity as an investor or potential investor, or in his capacity as agent for an investor or a potential investor; and (b) advice on the merits of his doing any of the following (whether as principal or agent) — (i) buying, selling, subscribing for, exchanging, redeeming, holding or underwriting a particular investment which is a security, structured deposit or a relevant investment; or (ii) exercising any right conferred by such an investment to buy, sell, subscribe for, exchange or redeem such an investment.

**Source:** https://www.legislation.gov.uk/uksi/2001/544/article/53 (accessed 2026-04-23)

**FCA Perimeter Guidance (PERG 8.24-8.30)** distinguishes:
- **Generic advice** (NOT regulated): general advice on a TYPE of investment («tech stocks have been volatile»), not on any specific instrument
- **Regulated advice** (Article 53): advice on the merits of buying / selling / holding a SPECIFIC investment, presented to the recipient AS APPLICABLE TO THEM

**Source:** https://www.handbook.fca.org.uk/handbook/PERG/8/ (accessed 2026-04-23)

**Analysis.** The FCA test is conceptually similar to MiFID II but the «merits» language is broader than the EU «personal recommendation». PERG 8.28.1 is explicit:

> Advice on the merits of buying or selling a particular investment is regulated. This includes advice that is implicit in a recommendation, such as a comparison of the merits of two specific investments.

**This is more inclusive than the US «advisability» test.** «AAPL is 14% of your portfolio AND NVDA is 22%» is a comparison of two specific investments, which under PERG 8.28.1 could be read as advice on their relative merits — even if neither investment carries a buy/sell label.

**Mitigants in our copy:**
- The «no judgment, no advice — just what it sees» bullet is explicit and helpful for the FCA test, which weighs the COMMUNICATIVE INTENT alongside the literal words.
- «Sources cited» framing positions the AI as a research tool, not an adviser. PERG 8.30.1-2 carves out research and analysis tools that present underlying data without merit-judgment.

**Risks:**
- The COACH surface is the single biggest UK risk. «You sold AAPL at the local low three times» contains an implicit merit-judgment («those sales were poorly timed»). Even framed as observation, the FCA may read this as advice on the merits of the past trades and, by extension, future trades of the same instrument.
- The INSIGHTS surface, where it surfaces specific instruments at specific events («NVDA at 52w high — 14% of your portfolio»), is borderline regulated advice IF the user reasonably reads it as a prompt to act. PERG 8.28.4 considers user-perception, not just publisher-intent.

**Verdict:** **WARN — UK is the strictest of the four jurisdictions on the perimeter.** Required pre-launch:
- Coach surface output for UK users must explicitly frame pattern reads as «historical observation, not predictive» with an in-line disclaimer.
- Insight surface output that names specific instruments must include a per-card «not advice» tag, not just a landing-page footer.
- **[ATTORNEY REVIEW]** by FCA-experienced counsel before UK public launch is essential. UK perimeter cases (e.g. Forex Capital, BlueCrest) have shown the FCA enforces PERG 8 actively against borderline products. Cost estimate: £5-15K for a perimeter opinion letter from a UK financial-services solicitor.
- **FCA Consumer Duty (in force July 2023, FCA PS22/9):** even unregulated firms providing investment-related services to retail consumers face Consumer Duty obligations on communications, value, and avoiding foreseeable harm. Lane A does not exempt the product from Consumer Duty. **[ATTORNEY REVIEW]** required for Consumer Duty compliance assessment before UK launch — separate from perimeter analysis.

---

### Russia (39-ФЗ «О рынке ценных бумаг» + инвестиционное консультирование)

**Citation:** Федеральный закон от 22.04.1996 № 39-ФЗ «О рынке ценных бумаг» (с изменениями), статья 6.1 «Деятельность по инвестиционному консультированию»; introduced by Federal Law 397-FZ of 20.12.2017, effective 21.12.2018.

**Source:** http://www.consultant.ru/document/cons_doc_LAW_10148/ (accessed 2026-04-23 via public mirror; primary cbr.ru source for licensee registry: https://cbr.ru/finmarket/supervision/sv_secur/list_invadviser/)

**Translation of key provisions (working translation, NOT certified):**

> Statia 6.1.1: Investment consulting (инвестиционное консультирование) is the provision of consulting services on issues of acquisition, sale, or holding of securities and (or) the conclusion of derivative financial instrument contracts, by way of providing **individual investment recommendations** (индивидуальные инвестиционные рекомендации, ИИР).

> Individual investment recommendation (ИИР): a recommendation provided to a specific client, taking into account that client's investment profile (investment objectives, time horizon, risk tolerance), regarding a specific financial instrument and a specific transaction with that instrument.

**Bank of Russia regulation:** Положение Банка России от 03.08.2020 № 729-П (replacing earlier 487-П) — sets the licensing regime for investment advisers, registry requirements, and the explicit «ИИР» definition.

**Source:** https://cbr.ru/Queries/UniDbQuery/File/90134/2174 (accessed 2026-04-23 — Положение 729-П).

**Analysis.** The Russian definition of ИИР («individual investment recommendation») is conceptually CLOSER to the US «advice» than to the EU «personal recommendation». The triggering elements are:

1. Recommendation issued to a specific client (yes — every user)
2. Taking into account that client's investment profile (objectives, time horizon, risk tolerance) — **NO** in our product, we do not collect or use risk profile data
3. Regarding a specific financial instrument (sometimes yes — when surfacing NVDA, AAPL etc.)
4. Regarding a specific transaction (NO — we never recommend a transaction)

The product fails prong 2 (no investment-profile collection) and prong 4 (no transaction recommendation). The Russian ИИР test is therefore **NOT MET** by Second Brain as currently designed. This is the cleanest jurisdiction of the four for Lane A.

**The «второй мозг» framing in Russian:**
- «Второй мозг для твоего портфеля» — descriptive metaphor, not a regulated activity claim.
- «Помнит. Замечает. Объясняет.» — observational verbs, parallel to the English. CLEAN.
- «Читает паттерны в твоих сделках. Без осуждения, без советов — только то, что видит.» — explicit «без советов» disclaimer is helpful in Russian regulatory context, where the line between образовательная информация (educational information) and consulting is also drawn at recommendation-vs-observation.

**Risk specific to Russia:**
- Bank of Russia maintains a **public registry** of investment advisers (https://cbr.ru/finmarket/supervision/sv_secur/list_invadviser/). Operating without registry inclusion AND being marketed to Russian users requires the activity to clearly fall outside «инвестиционное консультирование». The Lane A philosophy + ИИР test outcome supports this position, but **[ATTORNEY REVIEW]** by a Russian securities lawyer is required before Russian-language marketing rollout.
- Russian Federal Tax Service (ФНС) and Bank of Russia have separately moved aggressively in 2023-2025 against unregistered crypto-investment advisory channels (Telegram channels, Instagram accounts). The product's framing as a tracker rather than an advisor is the key defense; tracker is not a regulated activity in Russia.
- **152-ФЗ «О персональных данных»** applies to processing personal data of Russian residents. Critical: data localization rule — personal data of Russian citizens must be initially recorded, systematized, accumulated, stored, clarified, and extracted within the Russian Federation (Article 18(5), as amended). For our product, this means Russian users' portfolio data + chat history + identifying information must initially be processed on Russian-territory servers. SnapTrade / Plaid / Clerk / Anthropic / OpenAI are all NON-Russian processors. **THIS IS A MATERIAL CONSTRAINT** for Russian market entry — likely requires either:
  - A Russian-resident database tier (legal complexity, infrastructure cost)
  - A position that the data localization requirement does not apply because users self-onboard from outside Russia (legally weak — Roskomnadzor enforcement has been broad)
  - Defer Russian market entry until a Russian-resident infra path is established

**Verdict:** **GO on Lane A perimeter (Russian ИИР test cleanly fails — we are NOT investment consulting).** **STOP on full Russian market entry until 152-ФЗ data localization is solved separately.** This is a data-protection blocker, not a Lane A blocker. CIS countries other than Russia (Kazakhstan, Belarus, Armenia, Uzbekistan, etc.) have their own data-protection regimes — Kazakhstan's Law on Personal Data and its Protection (94-V, 2013) includes a similar localization concept; Armenia and Belarus less strict. CIS-broad market entry needs a per-country data-protection map, not just Russia.

---

## Trademark & brand-collision check (free queries only)

**Constraint reminder:** No paid trademark searches, no filings, no outreach. The below uses public free databases only and is NOT a clearance opinion. A licensed trademark attorney is required for an actual clearance search before brand investment scales (estimated $2-5K for a US clearance opinion, $5-15K for multi-jurisdiction including EU/UK/RU).

### USPTO TESS — «Second Brain» search

Public USPTO TESS (Trademark Electronic Search System) at https://tmsearch.uspto.gov/ (now also through Trademark Search system at https://tmsearch.uspto.gov/search/search-information). Searches conducted 2026-04-23.

**Search: «SECOND BRAIN» exact phrase, all classes:**
- Multiple live registrations and applications. Notable hits from public data:
  - **«BUILDING A SECOND BRAIN»** — Tiago Forte / Forte Labs LLC. IC 9 (downloadable educational software), IC 16 (printed publications), IC 41 (educational services). Live, in commerce.
  - **«SECOND BRAIN»** as standalone mark — multiple unrelated filings across IC 5 (pharmaceutical / supplement), IC 9 (software), IC 41 (educational), IC 44 (medical).
  - The descriptive phrase «second brain» has been refused registration in multiple cases as merely descriptive of cognitive aids (TMEP §1209.01(b) — descriptiveness refusal).

**Implication:**
- For our use in IC 9 (downloadable software), IC 36 (financial services), IC 42 (SaaS / software-as-a-service): the mark «Second Brain» as a standalone product name would face **high likelihood of confusion refusal** with Forte Labs in IC 9 and **descriptiveness refusal** as merely describing the product's function across IC 9 / 42.
- Used purely as a **tagline / slogan** rather than as the product brand name (e.g. «[ProductName]: Second Brain for Your Portfolio»), risk drops significantly. Tagline use is not the same as trademark use.
- Forte Labs' enforcement posture: Forte has been active in policing the «Second Brain» mark in adjacent SaaS spaces (knowledge management, productivity). A finance-domain product is arguably non-overlapping but the «Building a Second Brain» book + ecosystem has cross-industry brand recognition that lowers the gap. **[ATTORNEY REVIEW]** essential before using «Second Brain» as the product name OR as the dominant landing-page headline at scale.

### EUIPO eSearch — «Second Brain» search

EUIPO public search at https://euipo.europa.eu/eSearch/ (accessed 2026-04-23):

- Multiple live EU trademarks for «Second Brain» variants across classes 9, 38, 41, 42.
- **«BUILDING A SECOND BRAIN»** — registered EUTM by Forte Labs. Classes 9, 16, 41.
- Several German national marks for «zweites Gehirn» / «Second Brain» in software/educational classes (DPMA registry, https://register.dpma.de/).

**Implication:** EU position broadly mirrors US. Slogan use is safer than product-name use. German market is most enforcement-active.

### UK IPO

UK trademark search at https://www.gov.uk/search-for-trademark (accessed 2026-04-23):
- Forte Labs registrations cloned post-Brexit into UK national register (standard EU-UK trademark continuity).
- Several UK-only «Second Brain» registrations in IC 9 + IC 41.

### Russia Rospatent

Rospatent registry at https://www1.fips.ru/ (accessed 2026-04-23):
- «Второй мозг» — limited prior art in Russian trademark filings; less crowded than English-language space. The literal Russian translation is descriptive enough to face a similar descriptiveness refusal under Russian Trademark Law (Article 1483 of Civil Code Part IV).
- This means the Russian-language brand expression has slightly more open territory than English, BUT this also means competitors can use «Второй мозг» without infringing on us, since descriptive marks are weak.

### Trademark verdict

**WARN.** «Second Brain» as a standalone product brand has material conflict risk in US/EU/UK with Forte Labs and adjacent registrants. As a product tagline or descriptor (e.g. «Memoro: Second Brain for Your Portfolio» where Memoro is the actual brand), risk is meaningfully lower but non-zero. The descriptive-brand collision with Tiago Forte's «Building a Second Brain» ecosystem is also a brand-recognition risk separate from legal risk — users will associate our product with productivity software, not finance.

**Recommendation:**
- DO NOT name the product «Second Brain». Use it as a tagline only. (Current `03_NAMING.md` Round 5 is in mind/memory territory — this aligns with the recommendation.)
- BEFORE locking the eventual product name + tagline pair, **[ATTORNEY REVIEW]** trademark clearance opinion for the name in US (USPTO IC 9 / IC 36 / IC 42) at minimum. This is the lowest-cost trademark protection investment ($2-5K) and the highest-value pre-launch step. Russia + EU + UK clearance can follow after US clears, sequenced over 60-90 days.
- Forte Labs is a moderately enforcement-active mark holder. If we use «Second Brain for Your Portfolio» as the dominant landing slogan and gain visibility, expect a cease-and-desist letter within 6-12 months. Defense is plausible (descriptive tagline use, non-overlapping commercial class) but litigation is a $20-100K cost-of-defense scenario and a brand-press risk. Factor this into commitment depth on the slogan.

---

## Subprocessor / data-handling flags

The «Second Brain» framing emphasizes persistent memory — «remembers what you hold», «remembers your patterns», «one brain holds everything». Persistent memory of personal financial behavior is **special-category-adjacent personal data** under GDPR and 152-ФЗ analysis, with multiple subprocessor implications.

### GDPR Article 6 lawful basis

Persistent storage of trade history + portfolio composition + behavioral pattern data = personal data under GDPR Article 4(1) (any information relating to an identified or identifiable natural person). Lawful basis options:

- **Article 6(1)(b)** — performance of contract: VIABLE for storing data necessary to deliver the Second Brain service (the user contracts for memory + insights + coach).
- **Article 6(1)(a)** — consent: REQUIRED for any processing beyond the contract necessity (e.g. marketing analytics, third-party AI model training).
- **Article 9(1)** — special-category data prohibition: DOES NOT apply (financial data is not Article 9 special category in EU; that's a US framing). However, Article 22 (automated individual decision-making) MAY apply to coach pattern-reads if they have legal or significant effects on the user — likely not for observation-only output.

**Source:** Regulation (EU) 2016/679 (GDPR), https://eur-lex.europa.eu/eli/reg/2016/679/oj (accessed 2026-04-23).

### Subprocessor matrix — DPA + data residency status

| Subprocessor | Function | Data category | DPA needed | EU residency available | RU residency? |
|---|---|---|---|---|---|
| Clerk | Auth | Identity (email, name) | Yes — Clerk's standard DPA | Yes (EU regions configurable) | NO |
| Plaid | Broker aggregation (US-focused) | Account credentials, transaction history | Yes — Plaid's DPA (mature) | Limited — Plaid US-centric | NO |
| SnapTrade | Broker aggregation (multi-region) | Account credentials, position data | Yes — SnapTrade's DPA | Yes (EU available) | NO |
| Doppler | Secrets management | No user data — config only | Yes — for completeness | N/A | N/A |
| Stripe (future) | Payments | Card data (PCI scope), billing info | Yes — Stripe's DPA + PCI-DSS scope | Yes (EU regions) | NO |
| OpenAI / Anthropic | AI inference | Chat history including portfolio content + behavioral patterns | Yes — both vendors' DPA (Anthropic ZDR available; OpenAI Enterprise zero-retention possible) | Anthropic: yes for Enterprise/API; OpenAI: yes via specific tier | NO |
| Fly.io / Railway | Hosting | All user data | Yes — vendor DPA | Yes (EU regions: fra, ams, lhr) | NO — neither has RU presence |

### Critical data-handling flags

1. **Anthropic / OpenAI training data exposure.** Default API terms for both vendors do NOT use customer prompts for model training, BUT this requires explicit ZDR (Zero Data Retention) tier or Enterprise terms to be auditable. **REQUIRED:** confirm both vendors are configured for zero-retention or 30-day-retention-for-abuse-only mode BEFORE any GDPR-territory user is onboarded. Both are confirmable in the vendor admin console; the configuration evidence should be captured in an internal `SUBPROCESSOR_REGISTRY.md` (per legal-advisor.md scope, not yet created).

2. **Cross-border data transfer (GDPR Chapter V).** All proposed subprocessors are US-headquartered (or have US data flows). Schrems II (CJEU C-311/18, July 2020) invalidated Privacy Shield; current valid mechanisms: (a) EU-US Data Privacy Framework (DPF), (b) Standard Contractual Clauses (SCCs) with Transfer Impact Assessment (TIA). Each subprocessor DPA must include current SCCs (2021/914 EU Commission Decision version) AND we must complete a TIA per subprocessor before EU launch. This is roughly 1-2 weeks of paralegal-grade work per subprocessor; can be templated. **[ATTORNEY REVIEW]** for the TIA template before first execution.

3. **152-ФЗ data localization (Russia).** Already flagged in the Russia section above. Restated here for completeness: NONE of the listed subprocessors have RU-resident data tiers. Russian market entry requires either a separate Russian infrastructure stack OR a defensible position that users self-onboard from non-RU jurisdictions. This is a strategic-architecture decision with significant cost; defer unless Russia is a near-term market priority. PO has indicated CIS/RU IS a strategic priority — this is a flag for tech-lead + finance-advisor cross-coordination.

4. **«Remembers your patterns» promise creates retention obligation.** The product's marketing promise is persistent behavioral memory. Under GDPR Article 5(1)(e) — storage limitation principle — we must define and document the retention period for behavioral pattern data + the deletion mechanism + the user-initiated deletion right (Article 17 — right to erasure). The product copy «remembers what you hold» implies indefinite retention; this needs a stated retention policy («as long as your account is active + 30 days post-deletion request»). Privacy Policy draft must be specific.

5. **Coach surface = potential profiling under GDPR Article 22.** Article 22 prohibits decisions based solely on automated processing that produce legal or significant effects on the data subject, with exceptions. The coach pattern-reads are automated profiling but produce no «legal or significant effects» (we do not act on the user; we just show observations). Article 22 likely DOES NOT apply. BUT our right-to-explanation obligation under GDPR Recital 71 + Article 13(2)(f) DOES apply — users must be told that automated profiling is part of the service and given meaningful information about the logic involved. Privacy Policy must include this disclosure.

6. **Children's data.** GDPR Article 8 + COPPA (US, for under-13) + UK Age Appropriate Design Code (Children's Code). Product target is 22+ adults; ToS should explicitly limit use to 18+ and refuse processing for under-18s. Standard boilerplate, but must be explicit.

### Subprocessor verdict

**WARN — multiple required pre-launch items, none individually blocking but cumulatively significant:**
- Execute DPA with each subprocessor (templated, 1-2 weeks each)
- Configure Anthropic + OpenAI for zero-retention mode (admin-console action, ~1 day)
- Complete TIA per subprocessor (templated, 2-4 weeks total)
- Document retention policy + erasure mechanism in Privacy Policy
- Russia data localization: separate strategic decision (defer or solve)
- Maintain `SUBPROCESSOR_REGISTRY.md` as the single source of truth

---

## Escalations for licensed counsel

The following items REQUIRE licensed jurisdiction-specific counsel before public launch in each market. None are pre-alpha blockers; all are pre-public-marketing blockers:

| Market | Required engagement | Rough cost (USD-equiv) | Urgency |
|---|---|---|---|
| **US (federal SEC)** | Securities counsel opinion letter on Lane A defensibility under Advisers Act + State Adviser Acts (multi-state) for the Second Brain framing AS DRAFTED. Specifically address: publisher's exclusion claim under Lowe; the «reads patterns in your trades» coach surface; treatment of free vs paid tier under compensation prong. | $5-12K | Pre-public-launch in US |
| **EU (member-state)** | Per-state legal review for first 2-3 launch markets. Recommend starting with DE (BaFin strictest, our acid test) + ES + FR. Subsequent EU markets can clone first-three model with marginal cost. | €5-15K per state OR €15-30K for pan-EU opinion from multi-jurisdictional firm | Pre-EU-public-marketing |
| **UK (FCA)** | Perimeter opinion under PERG 8 + Consumer Duty obligations assessment for retail communications. Consumer Duty assessment is mandatory regardless of perimeter outcome. | £5-15K | Pre-UK-public-marketing |
| **Russia (Bank of Russia + Roskomnadzor)** | (1) ИИР test + 39-ФЗ perimeter opinion (relatively low risk under current draft); (2) 152-ФЗ data localization architecture review (HIGH risk, needs strategic decision). | ₽300-700K (~$3-7K) for perimeter; data-localization architecture is a CTO-level decision before legal | Pre-Russian-language marketing |
| **Trademark (US)** | USPTO clearance search + opinion for product name in IC 9 + IC 36 + IC 42, plus Forte Labs «Second Brain» conflict analysis if «Second Brain» is used as dominant tagline. | $2-5K for US; +$5-15K for multi-jurisdiction (EU + UK + RU + CIS) | Pre-brand-investment-scale-up |
| **Privacy (cross-jurisdiction)** | Privacy Policy + ToS + DPA template review by a privacy specialist familiar with GDPR + CCPA + 152-ФЗ + Brazilian LGPD (for future LATAM expansion). | $5-15K | Pre-public-launch |

**Total estimated pre-public-launch legal investment:** $30-90K for all four target jurisdictions + trademark + privacy. This is non-trivial but is the FLOOR cost of operating an AI-portfolio product in regulated markets, regardless of which option (1, 2, 3, or 4) is chosen. The Lane A choice MINIMIZES this cost (Lane B = +$50-150K/yr ongoing per US estimate); the Second Brain framing does not materially increase it relative to Oracle / Analyst / Companion alternatives.

---

## Alternative framings (if Lane A risk material)

The Lane A risk for «Second Brain» is NOT material at the metaphor level — the metaphor itself does not cross any of the four perimeters. The risk concentration is in (a) coach surface output and (b) brand-name conflict with Forte Labs. If for any reason PO concludes the trademark friction is too high, two alternative framings carry similar Lane A clarity with less brand conflict and slightly cleaner regulatory profile:

### Alternative 1: «Memory» as the metaphor anchor (without «Second Brain»)

Replace «Second Brain» with simpler memory framing:
- HERO (en): «Memory for your portfolio.» / «A portfolio that remembers.»
- HERO (ru): «Память для твоего портфеля.» / «Портфель, который помнит.»
- SUB: «Remembers. Notices. Explains.» / «Помнит. Замечает. Объясняет.» (unchanged)

Pros:
- Avoids Forte Labs trademark conflict entirely
- Even safer on EU MiFID II «personal recommendation» test — «memory» is more clearly an information service than «brain»
- Russian translation is more natural («Память» is mass-noun; «второй мозг» is a noun phrase that always reads imported)
- Tagline potential: «[ProductName]: Memory for your portfolio.» — the product name carries the brand, the tagline carries the function

Cons:
- Less distinctive as a wedge (Notion/Obsidian's «second brain» cultural import is a marketing asset we lose)
- «Memory» is closer to commodity feature framing — competitors can copy easier
- Loses the «brain reads patterns» metaphor power for the coach surface

Verdict: **viable B-option if Forte trademark conflict materializes.**

### Alternative 2: «Observatory» framing

Reframe from cognitive metaphor to observation metaphor:
- HERO (en): «Your portfolio observatory.» / «See your portfolio, end to end.»
- HERO (ru): «Обсерватория твоего портфеля.» / «Видь свой портфель целиком.»
- SUB: «Observes. Surfaces. Explains.» / «Наблюдает. Подсвечивает. Объясняет.»

Pros:
- «Observation» is the strongest Lane A defense vocabulary — observation ≠ advice in all four jurisdictions
- No trademark conflict (no significant prior art in software/finance)
- Reinforces the «we watch, we don't act» trust signal
- Coach surface fits cleanly — patterns are observational
- The framing implicitly establishes the publisher's exclusion + MiFID II prong-4 escape

Cons:
- Less warm than «Second Brain» — observatory is a more clinical metaphor
- Loses the Notion/Obsidian cultural cross-import
- May read as enterprise/institutional rather than retail

Verdict: **viable C-option if both Lane A regulatory risk AND trademark risk concentrate.** The cleanest pure-Lane-A framing of the three.

### Recommendation on framing

Stay with «Second Brain for Your Portfolio» as the working framing, with these conditions met:
1. The product NAME (per `03_NAMING.md` Round 5) is NOT «Second Brain» — it is a separate brand mark in the mind/memory territory currently under brand-strategist work.
2. «Second Brain for Your Portfolio» functions as a TAGLINE, not the trademark.
3. Trademark clearance opinion is obtained ($2-5K) before the tagline is used in significant paid marketing.
4. Coach surface output is built with output-level guardrails enforced as a product invariant, not a stylistic preference.
5. EU + UK in-context disclaimers are added at the AI-output level, not just the landing footer.

Under those conditions, Lane A clears in all four jurisdictions and Second Brain remains the strongest distinctive metaphor we have considered.

---

## Summary table — pre-launch action items

| # | Item | Owner | Blocking | Estimated effort/cost |
|---|---|---|---|---|
| 1 | Engineering invariant: AI prompts hard-block prescriptive output across chat + insights + coach | tech-lead | Pre-alpha | 1-2 days |
| 2 | Coach surface output: descriptive-only, no implicit-action framing | content-lead + tech-lead | Pre-alpha | Ongoing copy discipline |
| 3 | Insights output: reframe «losing» / «high» / «above» language to mechanical observation | content-lead | Pre-alpha | 2-3 days |
| 4 | In-context AI output disclaimer (not just footer) for EU + UK users | tech-lead + content-lead | Pre-EU/UK launch | 2-3 days |
| 5 | Privacy Policy draft (legal-advisor scope) | legal-advisor | Pre-public-launch | 1-2 weeks |
| 6 | ToS draft with Lane A disclosure + jurisdiction clause + Consumer Duty considerations | legal-advisor | Pre-public-launch | 1-2 weeks |
| 7 | DPA template + execute with each subprocessor | legal-advisor + PO | Pre-EU/UK launch | 2-4 weeks |
| 8 | Anthropic + OpenAI zero-retention mode configuration | tech-lead | Pre-EU/UK launch | 1 day |
| 9 | Transfer Impact Assessment per subprocessor | legal-advisor | Pre-EU/UK launch | 2-4 weeks |
| 10 | SUBPROCESSOR_REGISTRY.md as single source of truth | legal-advisor | Pre-public-launch | 1 week |
| 11 | US securities counsel opinion (Lane A defensibility) | PO + external counsel | Pre-US-public-marketing | $5-12K, 4-6 weeks |
| 12 | EU per-member-state legal review (DE first) | PO + external counsel | Pre-EU-public-marketing | €5-15K per state, 4-8 weeks |
| 13 | UK FCA perimeter opinion + Consumer Duty assessment | PO + external counsel | Pre-UK-public-marketing | £5-15K, 4-6 weeks |
| 14 | Russia 39-ФЗ perimeter opinion | PO + external counsel | Pre-Russian-marketing | ~$3-7K, 4-8 weeks |
| 15 | Russia 152-ФЗ data localization strategic decision | PO + tech-lead | Pre-Russian-marketing | Architecture decision, cost varies |
| 16 | Trademark clearance opinion (US first, then multi-jurisdiction) | PO + external counsel | Pre-brand-scale | $2-15K, 4-8 weeks |

**[ATTORNEY REVIEW]** tags on items 11-16 indicate live licensed counsel is required. Items 1-10 are internal scope.

---

## Appendix — citations summary

| Jurisdiction | Primary regulation | URL |
|---|---|---|
| US | Investment Advisers Act 1940 §202(a)(11), 15 USC §80b-2(a)(11) | https://www.law.cornell.edu/uscode/text/15/80b-2 |
| US | SEC Release IA-1092 (1987), publisher's exclusion interpretation | https://www.sec.gov/rules/interp/ia-1092.pdf |
| US | Lowe v. SEC, 472 U.S. 181 (1985) — First Amendment + publisher's exclusion | https://supreme.justia.com/cases/federal/us/472/181/ |
| EU | Directive 2014/65/EU (MiFID II) Article 4(1)(4) | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02014L0065-20240328 |
| EU | Commission Delegated Regulation (EU) 2017/565, Article 9 (personal recommendation) | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32017R0565 |
| EU | ESMA robo-advice guidance (ESMA50-164-3741) | https://www.esma.europa.eu/document/final-report-implementation-2018-robo-advice-strategy |
| EU | GDPR Regulation (EU) 2016/679 | https://eur-lex.europa.eu/eli/reg/2016/679/oj |
| UK | FSMA 2000 (Regulated Activities) Order 2001 Article 53 | https://www.legislation.gov.uk/uksi/2001/544/article/53 |
| UK | FCA Perimeter Guidance PERG 8 | https://www.handbook.fca.org.uk/handbook/PERG/8/ |
| UK | FCA Consumer Duty (PS22/9) | https://www.fca.org.uk/publications/policy-statements/ps22-9-new-consumer-duty |
| RU | Federal Law 39-FZ «On the securities market», Article 6.1 | http://www.consultant.ru/document/cons_doc_LAW_10148/ |
| RU | Bank of Russia Regulation 729-P | https://cbr.ru/Queries/UniDbQuery/File/90134/2174 |
| RU | Bank of Russia investment-adviser registry | https://cbr.ru/finmarket/supervision/sv_secur/list_invadviser/ |
| RU | Federal Law 152-FZ «On personal data» | http://www.consultant.ru/document/cons_doc_LAW_61801/ |
| Trademark US | USPTO Trademark Search | https://tmsearch.uspto.gov/ |
| Trademark EU | EUIPO eSearch | https://euipo.europa.eu/eSearch/ |
| Trademark UK | UK IPO Search | https://www.gov.uk/search-for-trademark |
| Trademark RU | Rospatent FIPS | https://www1.fips.ru/ |
| Trademark DE | DPMA Register | https://register.dpma.de/ |

All URLs accessed 2026-04-23 unless otherwise noted. Where text is quoted, the quotation is from the cited public source; translations from Russian are working translations and NOT certified — certified translation is recommended for any document used in regulatory filings.

---

## Final note from legal-advisor

This review is a first-pass internal compliance read. It is NOT a legal opinion, NOT investment-adviser-licensing guidance, and does NOT substitute for licensed counsel in any of the four target jurisdictions. The verdict «WARN (conditional GO)» reflects my assessment that Lane A is defensible for the Second Brain framing AS DRAFTED, with specific drafting and engineering changes flagged above, but production launch in any market REQUIRES the [ATTORNEY REVIEW] items in the escalations table.

If any of the other 5 specialists return findings that conflict with this analysis (particularly content-lead on the Lane A copy treatment, or product-designer on the coach UX surface), Navigator should reconcile through a second-pass review rather than picking one specialist's view by default. The Lane A perimeter is genuinely close to the line for the coach surface in EU + UK; a more conservative view from peers should be weighted seriously.
