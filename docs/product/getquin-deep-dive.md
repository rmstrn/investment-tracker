# Getquin — Deep Dive

**Owner:** `user-researcher` agent
**Compiled:** 2026-04-23
**Trigger:** PO constraints 2026-04-23 (Lane A + global multi-market). Under these constraints Getquin became main direct competitor, promoted from one-row in `competitor-matrix.md` §5 to dedicated deep-dive. Research brief in `STRATEGIC_OPTIONS_v1.md` §8 open-questions and `01_DISCOVERY.md` §4.6.
**Methodology:** Direct WebFetch of `getquin.com` primary properties (landing, pricing, AI page, feature pages, security, imprint, advisory page, language variants) + third-party sources (LinkedIn, Play Store, Product Hunt, deutsche-startups.de, search snippets of Trustpilot / help portals / Reddit where direct access blocked). All claims cite source + access date.
**Verdict spoiler:** Getquin is a formidable EU incumbent with real multi-lang infrastructure but has clear US + Russian/CIS gaps, a brand voice mismatch with our positioning options, and an AI layer that is more retrieval-plus-template than true conversational portfolio intelligence.

---

## 1. Product profile

### 1.1 Positioning and hero
**Hero (verbatim, EN landing 2026-04-23):** «Your entire wealth. One platform.»
**Sub-hero:** «Track your net worth, plan for retirement, and optimize your wealth with powerful analytics, AI tools, and expert advice—all in one platform.»

**Positioning archetype:** «Wealth platform» (consolidation + analytics + AI agents + expert advice). Read: Everyman + Sovereign — everything money, one app, retail-accessible, calm confident institutional tone. Not «chat-first» and not «advisor-first» — aggregator-first with AI layered on top. Exactly as classified in discovery v2 §5 and re-confirmed today.

Scale proof-points on landing:
- **+500K Users**
- **+€20B Tracked on getquin**
- **10,000+ 5-Star Ratings**

### 1.2 Full feature inventory (landing + feature pages 2026-04-23)

From `getquin.com/` and `getquin.com/portfolio-tracker/` combined:

**Portfolio tracking core**
- Real-time portfolio tracking across **800K+ assets** (source: portfolio-tracker page)
- Aggregated net worth across all connected accounts + manual assets
- Real-time price updates, benchmarking against indices
- Asset class / geography / industry breakdown
- DeepDive X-ray on fund composition
- Customizable watchlists

**Dividend tracker** (`/dividend-tracker/`)
- Dividend calendar with notification of upcoming payouts
- Yield, growth rate, historical payout history per stock / industry / geography
- ~5-year dividend projections
- TTWROR (time-weighted return) gated to Premium

**Analytics + retirement**
- Advanced performance analytics
- Retirement planning + goal-setting with scenario simulation (Wealth tier)
- Customizable financial goals (Wealth tier)

**AI Financial Agents** (see §1.3 for detail)

**Social / community**
- Stock forum (`/stock-forum/`) — users post stock opinions, react to posts, follow other investors
- Portfolio sharing (stock names visible, amounts private by default)
- Live discussion threads per ticker
- No explicit AI moderation; «Community guidelines» referenced but not detailed

**Advisory (DE market only)** (`/de/advisory/`)
- Hybrid: software-generated plan + human advisor conversation
- Free initial consultation; ongoing pricing not disclosed publicly
- **Germany-only** — no EN or IT locale equivalents found

**Account aggregation**
- Open Banking API connections to «thousands of providers» (no count disclosed)
- Manual transaction entry
- CSV upload
- PDF statement upload ("zero-click PDF import" implied on portfolio-tracker page)

**Platforms:** web (app.getquin.com), native iOS, native Android.

### 1.3 AI capabilities — what «AI Financial Agents» actually does

Verbatim from `getquin.com/getquin-ai/` (access 2026-04-23):

- «Your personal financial AI agents» — «explore portfolio depth including returns, risks, upcoming dividends, and performance drivers»
- «knows your data and explains what's happening, and why»
- Available «any time» for portfolio inquiries
- «AI to analyze your portfolio and receive clear insights into diversification, risk, and costs»

**Sample questions AI agents are positioned to answer (verbatim):**
- «What's behind your portfolio's performance?»
- «Is it time to harvest losses?»
- «Which news matters most to your investments?»

**Implied capability taxonomy** (from sample questions + feature framing):
- Performance attribution (what drove returns)
- Risk + diversification assessment
- Dividend forecasting + calendar queries
- Cost / fee analysis
- Loss-harvesting suggestions (Lane A caveat — see §1.4)
- News relevance filter (personalized to holdings)

**What's missing / not claimed:**
- No specific AI model disclosed (no GPT / Claude / Gemini / proprietary mention)
- No explicit sample of **conversational chat** — examples read more as discrete Q&A than multi-turn dialog
- No scenario simulator shown as chat output (scenario-sim claimed as standalone feature, not chat-embedded)
- No behavioral / historical pattern detection on the user's trade history (no «you sold AAPL on the bottom 3 times» type output)
- No regulatory disclaimer explicitly on AI agents page about advice vs education
- No sample screenshots of AI output on the public-facing page

**Interpretation for us:** Getquin's AI reads as **retrieval + template + LLM generation over structured portfolio data**, not as true conversational portfolio intelligence. Strong on «answer a question about a known data point» (performance drivers, dividend forecast, news filtering). Weak or absent on «reflect on your behavior» and on «extended multi-turn reasoning». This is material for Oracle differentiation (chat-first, multi-turn) and very material for Companion differentiation (behavioral pattern on trade history — absent from Getquin entirely).

### 1.4 Regulatory framing

Landing page: no SEC / BaFin / MiFID mentions.
Security page (`getquin.com/security/`): emphasizes read-only API, AES-256, GDPR-adjacent «EU servers» framing; **no regulatory license claimed**.
Imprint (`getquin.com/imprint/`): legal entity **QUIN Technologies GmbH**, Berlin HRB 217297 B, management Christian Rokitta + Raphael Steil, professional liability insurance **scope limited to Germany**.
Advisory page (`getquin.com/de/advisory/`, German-only): describes financial advisor team + planning process, but **does not disclose BaFin license or regulatory status for advisory activity**.

**Our read:** Getquin's core platform is Lane A (no advisor claim on main product). The German advisory offering is a separate service — not regulated on the public page, likely white-labeled through a licensed partner or operated under §34f GewO (financial-advice trade license) given the hybrid software-plus-advisor framing. **This does not change our Lane A competitive analysis** — Getquin is a Lane A tracker that adds an optional advisory upsell, similar to PortfolioPilot's hybrid pattern but geographically scoped to DE. Our Lane A positioning collides with theirs fully; their DE-only advisory is adjacency, not direct overlap.

### 1.5 Broker / exchange coverage

Landing claim: «thousands of providers».
Portfolio-tracker page claim: «Open Banking works for supported brokers»; «manual import available for all brokers worldwide».
**No specific broker list or count is published on the public site.**

From third-party sources and user-reported issues (Reddit / help search 2026-04-23):
- **Trade Republic** — supported (German flagship neo-broker; direct auto-sync)
- **Scalable Capital** — supported (per Parqet comparison article)
- **Interactive Brokers (IBKR)** — **free-tier sync broken for new transactions** (r/eupersonalfinance user report 2025)
- **Fidelity US** — **not auto-importable** (r/fidelityinvestments user report: Fidelity policy change blocks third-party scrape)
- **Charles Schwab / Vanguard / Robinhood** — **not confirmed** on any page we accessed

**Interpretation:** Getquin's aggregation depth is strong for EU brokers (Trade Republic, Scalable, Degiro, Comdirect, ING etc. via Open Banking) and **thin-to-absent for US brokers**. This is a legitimate pressure test for our «global multi-market» ambition: if we want US + EU day-one we need meaningful US broker depth that Getquin does not have. US depth is a real differentiator, not a theoretical one.

**Confidence: medium.** Primary sources don't publish a broker list. All above is triangulated from user complaints + competitor comparisons. A live US-user interview would tighten this significantly — flagging for `USER_RESEARCH/hypotheses.md`.

### 1.6 Asset classes supported

From `/portfolio-tracker/` + `/dividend-tracker/`:

- Stocks
- ETFs
- Dividends (as stock subclass)
- Commodities
- Art
- Luxury collectibles
- Real estate
- (Cryptocurrency mentioned in Russian-language app store descriptions per third-party cached content — **not on public landing pages today**)

**Interpretation:** Broad coverage including alt-assets, but crypto is de-emphasized on public-facing English / German marketing — consistent with an EU retail positioning where crypto is politically touchier than in US / APAC markets. This is a gap we can exploit on the «crypto-native» CIS + US segments.

### 1.7 Multi-language breakdown

**Header language switcher (landing 2026-04-23, `getquin.com/`):** EN, IT, DE (three languages visible).

**Verification of additional locales:**
- `getquin.com/de/` — **exists, full German locale**
- `getquin.com/it/` — **exists, full Italian locale**
- `getquin.com/es/` — **404** (Spanish landing does not exist today)
- `getquin.com/pt/` — **404** (Portuguese landing does not exist today)
- `getquin.com/ru/` — **404** (Russian landing does not exist)

**Contradiction with portfolio-tracker sub-page claim:** `/portfolio-tracker/` states «Available in 5 languages (EN, PT, IT, DE, ES)». This is **not verified by live landing pages** — ES and PT locales return 404. Likely explanations (not mutually exclusive):
- App-level localization (mobile UI translated) without landing pages
- In-flight rollout — LinkedIn posts reference «expansion into Southern Europe (Spain, Italy, Portugal) with new hires in business development and growth leadership roles as of early 2026»
- Marketing-page claim out of sync with shipped state

**Our read:** Getquin's **effective public multi-lang is EN + DE + IT** today. Spanish + Portuguese are claimed but not yet shipped publicly. **Russian is zero** — no Russian landing, no `.ru` locale, no Russian blog. This is a material opening for our CIS/RU positioning.

Confidence: high (directly verified via HTTP 200/404 responses 2026-04-23).

### 1.8 Pricing tiers

From `getquin.com/pricing/` (EN) and `getquin.com/de/pricing/` (DE), identical pricing:

| Tier | Price | Currency | Key inclusions |
|---|---|---|---|
| Free | €0/year | EUR | Unlimited bank+broker connections, real-time data, net worth overview, essential portfolio analysis |
| Premium | **€89.99/year** (~$97 USD) | EUR | Free + AI-Powered portfolio analysis + Personal dividend KPIs + Advanced performance analytics + Detailed allocation breakdown |
| Wealth | **€149.99/year** (~$162 USD) | EUR | Premium + Financial planning + Customizable financial goals + Personal retirement plan + **Unlimited access to AI financial agents** |

Notes:
- **Monthly option: not offered** (annual only)
- Currency: **EUR only** (no USD / GBP / other variants on pricing page)
- Taxes «exclusive of country-specific taxes and fees»
- No trial duration stated on pricing page; «Try for free» buttons present
- No enterprise / student / family tier publicly disclosed
- No cancellation / refund policy on pricing page
- **AI gating: Premium = static AI portfolio analysis; Wealth = unlimited access to AI financial agents.** Meaning: conversational agent chat is Wealth-only (€150/yr). Premium gets generated / computed AI outputs (performance, KPIs) — not open-ended chat.

**Interpretation:** The AI pricing wall is aggressive. At €150/yr (~$162 USD) for unlimited AI chat, Getquin is **priced above PortfolioPilot Gold ($240/yr for full AI) only on monthly-equivalent basis**, but on AUM share arguably cheaper. Critically, Getquin **gates the distinctive AI-chat experience** behind the top tier — meaning Free + Premium users experience a different, lesser product. For ICP evaluation: an ICP-A user paying €90/yr Premium gets analytics but not conversational AI. Our Pro tier at $20/mo ($240/yr) unlocking unlimited chat in Lane A is directly price-comparable to Getquin Wealth + gives monthly-cancel flexibility.

### 1.9 Mobile app quality signals

**Google Play Store (`com.getquin.app`):**
- Rating: **4.0 stars**
- Reviews: **7,450 user reviews**
- Installs: **100,000+**
- Developer: QUIN Technologies GmbH

**Apple App Store:** direct fetches for multiple candidate App IDs returned 404. Third-party aggregator search references App Store listings but we could not verify star rating / review count firsthand. Third-party platforms (Parqet-comparison articles) cite Parqet at 4.7 stars vs Getquin implicitly lower — reading Play Store's 4.0 as broadly representative.

**Review theme extraction** (Play Store + Product Hunt + third-party reviews 2026-04-23):

*Positives mentioned repeatedly:*
- Visual polish / «intuitive interface» / «fancy and visually very appealing» (Product Hunt, Mustachian Post)
- Broker integration ease (for supported brokers)
- Portfolio tracking superior to native broker UIs
- Multi-currency support (r/eupersonalfinance — «especially because it supports multiple currencies»)
- Community engagement «very pleasant» and «no toxic behaviour» (Product Hunt)
- Dividend calendar praised repeatedly

*Negatives mentioned repeatedly:*
- **Data accuracy problems** — «portfolio values mismatching broker records by thousands» (Product Hunt review)
- **Transaction recording errors** affecting loss/gain calculations (Product Hunt)
- **Customer support inadequate** — «relying on AI chatbots even for premium users» (Product Hunt — ironic given their AI positioning)
- **Real-time price lags** — «Live graph lags days of data, Data out of date, Incorrect yields» (Helpmoji aggregator)
- **Sync failures** — especially IBKR + Fidelity (Reddit)
- **Security concerns** flagged on Product Hunt about **third-party aggregator flanks.io** storing broker credentials without ISO certs / CISO / independent audits (co-founder replied defending encrypted read-only API approach)

**Interpretation:** 4.0 Play Store + 3.8 Trustpilot + 3.8 Product Hunt = **mid-tier sentiment, not top-tier.** They ship polish but have real data-accuracy + support debt. The AI chatbot support complaint is telling — users perceive AI as a cost-savings tool, not a value-add. **Our product-lens opportunity:** support-quality + data-accuracy are both under-delivered, both cited by users repeatedly. A well-resourced launch focused on sync reliability + responsive human support (even if the product itself is Lane A) can out-deliver Getquin on the two dimensions their own users complain about most.

Confidence: medium-high on themes (consistent across three independent sources); low on exact incidence rates (no aggregator gave us volumetric breakdowns).

---

## 2. Business + scale signals

### 2.1 Company facts

**Legal entity:** QUIN Technologies GmbH
**HQ:** c/o Axel Springer SE, Schützenstr. 15, 10117 Berlin, Germany
**Commercial Register:** HRB 217297 B, Amtsgericht Charlottenburg
**Founded:** 2020 (launched as «Quin» initially per deutsche-startups.de 2020 article; rebranded to «getquin» around 2020-2021)
**VAT ID:** DE330970071
**Management:** Christian Rokitta, Raphael Steil
**Professional liability insurance:** Allianz Versicherungs-AG — **scope limited to Germany** (imprint, 2026-04-23)

### 2.2 Team size

**LinkedIn (2026-04-23):** «11-50 employees» range; **27 employees listed on LinkedIn** company page. Recent posts reference hiring for Southern Europe expansion (Spain, Italy, Portugal business development + growth leadership roles as of early 2026).

**Interpretation:** Team is small-mid (likely 30-50 actual). Scaling pace has been modest — 4 years since founding + €15M Series A + ~30 employees suggests lean operation, not hyper-growth. For context: PortfolioPilot-scale operations typically run 50-150 employees; this is closer to Wealthfolio / Snowball scale than to PortfolioPilot.

### 2.3 Funding

**Confirmed rounds:**
- **$15M Series A — June/July 2022** — lead investors **Portage Ventures + Horizons Ventures + existing backers** (deutsche-startups.de, confirmed on LinkedIn funding entry)
- Prior seed rounds likely (company founded 2020, Series A came 2022) — exact seed amount / investors **not surfaced** via our 2026-04-23 search

**Total disclosed: ~$15M** (possibly more including undisclosed seed)

**No subsequent funding round surfaced** in our 2026-04-23 search — no Series B announcements indexed. Given 2022 Series A was $15M, a 2024-2025 bridge or Series B would be expected if growth pace had accelerated; its absence suggests either (a) not needed yet (cash-runway healthy) or (b) not yet closed.

Confidence: medium. Crunchbase returned 403 to our WebFetch; all funding data via deutsche-startups.de article + LinkedIn.

### 2.4 User / AUM claims

Landing claims (2026-04-23):
- **500K+ users**
- **€20B+ tracked**
- **10,000+ 5-star ratings**

Advisory page (DE) cites a different AUM number: **«über 500.000 Nutzer» tracking «€15 billion»**. The €15B vs €20B discrepancy suggests either (a) advisory page is stale or (b) €20B is newer claim on main landing. Either way, order of magnitude is €15-20B tracked across 500K users. Per-user average tracked wealth: **~€30-40K** — lines up with mass-market retail EU investor (not HNW).

**Play Store installs:** 100K+ (vs 500K users claim). Gap explained by web + iOS users + duplicate-account effect — plausible at Getquin's scale.

**Implication for us:** Getquin's users are **mass-market retail**, not HNW. Average AUM per user ~€30-40K matches our ICP-A hypothesis («$20-100K multi-broker millennial»). This is our ICP-A battleground.

### 2.5 Geographic split (disclosed)

**Not disclosed as percentages.** Inferred from signals:
- Legal + HQ: Germany
- Public languages: DE, EN, IT (live); ES + PT claimed on sub-page, not shipped publicly
- Advisory service: DE-only
- LinkedIn expansion hiring: Southern Europe (ES, IT, PT) early 2026
- App Store distribution: global (Russian-language app store descriptions exist per third-party aggregators)
- US presence signals: **absent** (no US brokers auto-sync confirmed, no US regulatory claims, no US marketing)

**Our read:** Getquin is **DE-heavy, IT growing, ES/PT imminent, US negligible, Russia zero.** Confidence high on DE + IT (direct locales); high on US-gap (direct broker + regulatory evidence); high on RU-gap (locale verified 404). ES/PT mid confidence (hiring signals + claimed but not launched).

### 2.6 Monetization mix

From security page + pricing: «Our business model is based on premium subscriptions that offer additional features. We also generate revenue through advertising within the app.»

**Two revenue streams confirmed:**
1. **Subscriptions** (Premium €90/yr + Wealth €150/yr)
2. **In-app advertising**

**Not confirmed:** affiliate commissions on broker sign-ups, partnership revenue, enterprise / B2B (wealthAPI-style) licensing.

**Interpretation:** Ads inside a portfolio tracker is an unusual choice — most retail competitors avoid it. For a product that holds your net-worth data, ads are a soft-trust erosion and create an ICP-A / ICP-B perception that they are the product. Our clean «no ads, no affiliate sales» stance is a differentiator that is actively contradicted by Getquin's actual business model, not just by theoretical framing.

---

## 3. User feedback themes

**Sources triangulated (2026-04-23):**
- Google Play Store reviews (aggregate: 4.0 stars, 7.45K reviews)
- Product Hunt (3.8 rating, 8 reviews, maker responses captured)
- Trustpilot snippets (search-indexed mentions — direct access 403; 3.8 rating, ~260 reviews per third-party)
- Reddit: r/eupersonalfinance, r/fidelityinvestments, r/dividends mentions
- Mustachian Post community comment
- Helpmoji aggregated complaint listing
- getquin.statuspage.io release notes

**High caveat:** third-party search snippets are limited; firsthand review access was blocked on Trustpilot (403) and truncated on Play Store (aggregate only, no individual reviews). Below themes are inferred from consistent signal across 4-5 sources, not from exhaustive review-by-review coding.

### 3.1 Top 3 things users love

1. **Visual polish + UX** — «fancy and visually very appealing» (Mustachian Post), «intuitive interface» (Product Hunt). Consistent across 3+ sources. This is real — competitor comparisons (Bavest) corroborate that Getquin's UX is above the Parqet / Capitally / basic-tracker median.
2. **Multi-currency + EU broker integration** — «supports multiple currencies» praised by EU users (r/eupersonalfinance); Trade Republic + Scalable sync praised in comparisons. This is genuinely strong for EU users managing multiple broker accounts.
3. **Dividend tracking + calendar** — repeatedly cited; the dividend-tracker sub-page is one of their more developed features with ~5-year projections and stock-by-stock history.

### 3.2 Top 3 things users complain about

1. **Data accuracy / sync reliability** — «portfolio values mismatching broker records by thousands», «transactions showing zero dollars», «Live graph lags days of data». This is the most-cited negative across sources and it's a structural issue (live data feeds + broker APIs + corporate-action handling). Their own status page confirms ongoing data issues («version 2.224.0 has helped in some cases, the issue has not been fully resolved for all users»).
2. **Customer support** — «relying on AI chatbots even for premium users» (Product Hunt). Paying users feel under-served. This is **an ironic vulnerability** for an AI-positioned product: they sell AI as value-add, users experience AI as support-replacement.
3. **Credentials / security worry** — one detailed Product Hunt review raised concerns about third-party aggregator flanks.io storing broker credentials without independent security certs. Co-founder responded defending encrypted read-only API and EU server storage. This is a minority complaint (one visible instance) but reflects a legitimate open-banking trust question that surfaces wherever aggregation is involved — not Getquin-specific but unresolved.

### 3.3 Recurring AI-specific feedback

**Notable absence.** Across sources:
- Product Hunt has **zero AI-specific user feedback** in surfaced reviews
- Play Store review snippets don't flag AI agents as love-or-hate
- Reddit mentions of Getquin don't pick up AI-agent threads

**Interpretation:** Getquin's AI is either (a) too new / too gated at Wealth tier for mass feedback, (b) not used enough by reviewer population to have shaped reviews, or (c) not distinctive enough to trigger comments. The aggressive landing-page positioning around AI Financial Agents has not yet translated into AI-specific user sentiment in the review corpus. **This is our opportunity:** the AI story is asserted, not user-validated.

### 3.4 Churn reasons (where visible)

Limited direct churn evidence. Mustachian Post commenter noted they «decided against using it after the free trial» — reasons not fully captured in snippet. Product Hunt review on data accuracy implied user would not continue paying. Reddit IBKR / Fidelity sync-failure threads imply churn for users who need those specific brokers.

**Inferred churn vectors:**
- US broker sync gaps → US users churn after trial
- Data accuracy issues on active multi-broker portfolios → power users churn
- Support quality on Premium tier → paid users downgrade / cancel
- AI gated to Wealth tier → Premium users who bought expecting AI chat downgrade when they realize gating

This is speculation-grade synthesis until live-interview evidence is available — flagging for `USER_RESEARCH/hypotheses.md`.

---

## 4. Strategic weaknesses (where we can out-position)

Ranked by confidence and by exploit-potential under our PO 2026-04-23 Lane A + global constraints.

### 4.1 US presence is effectively zero

**Evidence:**
- No Fidelity / Schwab / Vanguard / Robinhood auto-sync confirmed
- IBKR sync reported broken by free-tier users
- No US regulatory claim; pro liability insurance DE-scope only
- No USD pricing, no US marketing on landing
- No US-specific broker partnerships in press coverage

**Exploit vector:** US day-one with meaningful US broker depth (Plaid / SnapTrade / Yodlee via reliable aggregator) is an unclaimed wedge. Our «global multi-market» constraint is not a handicap vs Getquin here — it's differentiation.

Confidence: high.

### 4.2 Russian-language + CIS presence is zero

**Evidence:**
- `getquin.com/ru/` returns 404
- No Russian blog, no Russian pricing, no Russian marketing on primary site
- Russian App Store descriptions exist but are minimal, not localized product experience
- No CIS-specific brokers (Tinkoff, BCS, Alfa) mentioned
- No crypto-native narrative (CIS / crypto-native segment preference)

**Exploit vector:** Russian + CIS user-base is a true open-market opportunity for us. Getquin will not compete for this segment in the 12-18 month horizon given hiring focus is Southern Europe. Our PO constraint (CIS priority) directly converts to wedge here, not tradeoff.

Confidence: high (direct 404 verification + zero press mentions).

### 4.3 AI is asserted, not delivered-at-quality

**Evidence:**
- AI agents gated to €150/yr Wealth tier — Premium + Free users don't experience the flagship AI claim
- Zero AI-specific user sentiment in public reviews (Product Hunt, Play Store snippets) — gap between landing claim and user perception
- Sample questions («what's behind performance?», «harvest losses?», «which news matters?») read as **RAG / templated output**, not true multi-turn conversational reasoning
- No specific model disclosed (no GPT / Claude / Gemini mention) — signals either proprietary-and-weaker or not-transparent
- Customer support complaint about «AI chatbots for premium users» implies AI-in-product is functioning as cost-savings, not value-add

**Exploit vector:** Oracle + Option 4 (Hybrid / Second Brain) both can credibly claim «true portfolio chat» vs Getquin's «AI-as-feature-list-checkbox». This is the most product-lens-defensible differentiation. Requires actual delivery (our MVP must demonstrably beat their AI on quality of answers to portfolio-specific questions), not just rhetoric.

Confidence: medium-high (based on landing-claim analysis + review-corpus gap; firsthand Wealth-tier AI testing not done).

### 4.4 Brand voice mismatch with chat-first / quiet-precision / second-brain metaphors

**Evidence:**
- Hero «Your entire wealth. One platform.» — broad lifestyle consolidation tone
- Sub-hero packs analytics + AI + advice + retirement into one sentence
- Social / community forum prominent → reads as «Robinhood-adjacent» social-investing angle, not «Linear/Notion» restraint
- Advertising-funded business model → pragmatic / mass-market tone, not premium-quiet

**Exploit vector:** Any of our 3 / 4 direction options (Oracle, Analyst, Companion, Hybrid Second Brain) has voice-territory Getquin cannot occupy without rebranding. Oracle «тихая точность» is the sharpest contrast. Companion «observer, not advisor» is voice-orthogonal. Hybrid Second Brain is conceptually new vs Getquin's aggregator+AI-layer frame.

Confidence: high (voice is verifiable from landing copy + feature framing).

### 4.5 Data accuracy + support are under-delivered

**Evidence:** most-cited user complaints across 3-4 independent sources (§3.2).

**Exploit vector:** ship reliability + responsive support (even if product is Lane A with minimal feature parity). Launch messaging «your numbers are right, every time» against Getquin's own status-page confession of unresolved sync issues is defensible and user-validated as a real pain.

Confidence: high.

### 4.6 Crypto is de-emphasized

**Evidence:** crypto not on EN/DE public-landing feature list; only surfaces on third-party aggregator descriptions of Russian app-store listing.

**Exploit vector:** CIS / US-crypto-native segment prefers native crypto integration + conversational AI about their actual positions. Getquin does not serve this segment meaningfully.

Confidence: medium-high.

### 4.7 Pricing gating of AI is aggressive / arguably misleading

**Evidence:** landing prominently features AI Financial Agents; pricing page gates them to €150/yr Wealth tier. Premium (€90/yr) gets «AI-powered portfolio analysis» (computed, static) but not conversational agents.

**Exploit vector:** our Pro tier at $20/mo ($240/yr) with unlimited chat is direct price-comparable to Getquin Wealth but monthly-cancelable. Our Plus tier at $8-10/mo should include meaningful conversational AI access with soft usage caps, closing the perceived AI-gap that Getquin Premium users experience today.

Confidence: medium-high.

### 4.8 No behavioral pattern detection on trade history

**Evidence:** AI capability set per landing is analytics / news / dividends / loss-harvesting — **not** behavioral pattern detection across time. Sample questions are about state and forward, not about the user's past decisions.

**Exploit vector:** **Companion direction has zero Getquin overlap here.** Companion's core value-prop («видит паттерны в твоих сделках») is uncontested against Getquin. This materially supports the Companion > Oracle > Analyst ranking in `STRATEGIC_OPTIONS_v1.md` v1.1 under Lane A.

Confidence: high.

### 4.9 Small team size + lean funding = shipping velocity ceiling

**Evidence:** 27 LinkedIn employees, $15M Series A, no subsequent round surfaced, hiring focused on Southern Europe business development (not product / engineering).

**Exploit vector:** a well-capitalized US+global team can credibly out-ship Getquin on both core product (reliability) and on new AI-native surfaces. Getquin's lean ops is also their velocity constraint.

Confidence: medium (inferred from public signals, not from internal team data).

### 4.10 DE-only advisory upsell is not replicable in other markets quickly

**Evidence:** `/de/advisory/` exists; no EN / IT equivalents; liability insurance DE-scope.

**Exploit vector:** not a vector for us (we are Lane A, not hybrid). But it reveals Getquin's regulatory cost to expand advisory internationally — so if we ever consider Lane C later (currently rejected by PO 2026-04-23), we should recognize this constraint Getquin can't escape easily either.

Confidence: high.

---

## 5. Implications for our 3 + 1 strategic options

See `STRATEGIC_OPTIONS_v1.md` for option descriptions. Deep-dive findings reinforce or shift each option's Getquin-defensibility.

### 5.1 Oracle (chat-first home)

**Findings from deep-dive that matter:**
- Getquin is aggregator-first + AI-layered. Chat is not their primary surface. The language switcher proves aggregator-first framing — their main pages never lead with chat.
- Their «AI Financial Agents» page is feature-list + sample questions — **not** a conversational demo or first-person-experiential pitch.
- AI gated to €150/yr Wealth → free + €90 users experience a product without meaningful AI chat.

**Oracle differentiation sharpens:**
- Structural UX (chat is home) vs Getquin's «aggregator dashboard + AI as sub-feature»
- Conversational depth (multi-turn, source-cited) vs Getquin's retrieval-templated Q&A
- AI access is non-trivial in our Plus + Pro tiers, not walled behind Wealth-equivalent paywall

**Remaining risks:**
- Getquin's 500K users + 4.0 Play Store is real brand moat for EU acquisition
- Their polished UX sets retail-UX floor we must meet, not just exceed in one dimension

**Verdict:** Oracle remains viable against Getquin. Differentiation is structural + UX-quality-of-AI, not category-level. Requires real AI-chat delivery quality to win head-to-head, not just «chat is first».

### 5.2 Analyst (insights-feed home)

**Findings that matter:**
- Getquin has analytics surface (performance analytics, allocation breakdown, dividend calendar) — directly overlaps Analyst's insights-feed home
- Getquin's AI-powered portfolio analysis (Premium tier) is the same shape as Analyst's Slice 6a+ insights
- Getquin is multi-lang (DE/IT, + ES/PT pending) and has 500K-user scale advantage

**Analyst differentiation weakens further under deep-dive:**
- Already weakened by Lane-C removal (STRATEGIC_OPTIONS_v1.md §Re-evaluation)
- Now also weakened by discovering Getquin's analytics + dividend calendar are polished + ~500K users deep
- Analyst's remaining differentiation is UX paradigm (chat-drill-in from insights) + multi-broker breadth + multi-market (including US + CIS)

**Verdict:** Analyst is hardest against Getquin under Lane A. Plus Snowball + Simply Wall St pressure (already in v1.1 cross-compare). Confirms v1.1 ranking Companion > Oracle > Analyst.

### 5.3 Companion (behavioral coach)

**Findings that matter:**
- Getquin has **zero behavioral pattern detection on trade history** surfaced anywhere on their public site
- AI sample questions all state/forward-facing («what drove performance», «harvest losses», «which news matters») — none are retrospective («what did I do that hurt me»)
- No weekly coach digest equivalent; their «Insights» are positional-analytics, not behavior-pattern
- Their Stock Forum is peer-chatter, not AI-pattern-reflection on individual user history

**Companion differentiation confirmed strongest:**
- Uncontested on the behavioral-pattern axis under Lane A + global
- Getquin's €20B AUM tracked across 500K users gives them **the data** to build this if they wanted to — they don't, which is a strategic choice not a capability gap. That choice tells us they've picked «aggregator+analytics+optional advisory» as their flywheel, not «coach».
- If we launch Companion credibly, we claim a narrative they cannot easily pivot to without voice / brand repositioning

**Verdict:** Companion is the most Getquin-orthogonal of our options — strongly reinforcing the v1.1 ranking.

### 5.4 Option 4 — Hybrid «Second Brain»

**Findings that matter:**
- Getquin's framing is «platform» — explicit, explicit-platform-language hero. «Second brain» is conceptually one level of abstraction higher (memory vs service)
- Their AI is «agent asks / platform answers» — not «your knowledge, surfaced». Second Brain's memory-of-your-investing metaphor is off-axis from Getquin's aggregator frame
- Their social forum is community-of-users; Second Brain is individual-cognition — opposite archetypes
- No Getquin marketing touches «memory», «reflection», «your knowledge» territory

**Option 4 differentiation:**
- Fully orthogonal to Getquin's frame
- Progressive disclosure (chat / insights / coach) uses three surfaces Getquin has two of (analytics + AI) and lacks the third (coach)
- Empty-fintech-territory claim is verifiable — no tested adjacency to Getquin

**Verdict:** Option 4 is the most cross-category against Getquin. Narrative defensibility high; execution risk (ship three surfaces credibly) is separate from Getquin-defensibility.

---

## 6. Recommendation + follow-ups

### 6.1 Recommendation to Navigator

**No shift in option-pick ranking based on this deep-dive.** Findings reinforce `STRATEGIC_OPTIONS_v1.md` v1.1 ranking under PO 2026-04-23 Lane A + global constraints:

- **Companion** remains strongest Getquin-defensible (zero behavioral overlap; uncontested wedge)
- **Option 4 Hybrid** remains strongest narrative-defensible (cross-category metaphor Getquin cannot easily replicate)
- **Oracle** is viable but requires delivering AI-chat-quality to win structural UX + AI-depth claims
- **Analyst** is the weakest under Lane A + Getquin + Snowball + Simply Wall St 3-way pressure — further confirmed

**New evidence strengthens three specific claims:**
1. US day-one is a real wedge (§4.1) — PO constraint is defensibility, not cost
2. Russian/CIS is an open-market opportunity (§4.2) — not just preference, zero incumbent
3. AI-delivery-quality is Getquin's soft underbelly (§4.3) — any option we pick must beat their AI on actual output, not just on framing

### 6.2 Russian/CIS presence verdict

**Bet confirmed: zero or near-zero.** Direct 404 on `getquin.com/ru/`, no Russian blog, no CIS-broker integrations, no Russian LinkedIn posts, hiring focus Southern Europe (not Eastern). Russian-language app store description exists but is superficial. **Strong evidence of structural absence, not just weak-presence.**

Under PO 2026-04-23 CIS priority, this is real uncontested geography. Caveat: «uncontested» does not mean «demand exists» — it could mean the market is too small or too unique for Getquin to prioritize. That question is an open ICP-C / ICP-CIS research hypothesis, flagged below (§6.4).

### 6.3 Top 3 Getquin weaknesses we can exploit immediately

1. **US broker depth** — ship Plaid / SnapTrade / Yodlee / direct-broker coverage for top-5 US brokers (Fidelity, Schwab, Vanguard, Robinhood, E*Trade/Morgan Stanley) on day one. Getquin cannot respond quickly here — no US regulatory foothold, no US broker partnerships, DE-scoped liability.
2. **AI delivery quality** — claim multi-turn conversational portfolio AI with source citations and measurable quality bar (answer accuracy, response depth). Publish a demo (not just marketing sample-question list). Get «AI you can actually ask hard questions and get real answers» experiential wedge before Getquin closes the delivery gap.
3. **Behavioral pattern detection on trade history** — if Companion or Hybrid Option 4 picked, ship a weekly pattern-read on real transaction history as a flagship surface. Getquin has the data to do this eventually but no product-surface built for it today. First-mover advantage potentially 12-18 months.

Secondary exploits (not top-3 but real):
- Clean «no ads, no affiliate upsell» stance vs Getquin's ads-in-app business model
- Monthly pricing option vs Getquin's annual-only
- Russian-language product day-one

### 6.4 Follow-ups for user-researcher corpus + Navigator

**Flag to `USER_RESEARCH/hypotheses.md`** (to be created on next session):

- H-001 [untested] — **US retail users perceive Getquin's US broker gap as blocker** when evaluating EU-origin trackers. *Test via ICP-A live interviews.*
- H-002 [untested] — **EU Getquin paying users churn from Premium when they discover conversational AI is gated to Wealth**. *Test via ex-Getquin user recruitment (Reddit r/eupersonalfinance, Mustachian Post community).*
- H-003 [untested] — **Getquin's data-accuracy complaints correlate with IBKR + US-broker sync attempts**, not with EU broker sync. *Test via support-forum thread scraping + targeted interviews.*
- H-004 [untested] — **Russian/CIS retail investor demand for portfolio-aware AI chat is non-zero but small**, and market has zero incumbent. *Test via Russian-language retail investor community outreach + competitive-search audit of Russian-language fintech forums.*
- H-005 [untested] — **«AI in pricing list» ≠ «AI as experienced value»** for Getquin Wealth users. *Test via Wealth-tier ex-user interview.*

**Additional action items for Navigator:**
1. Re-scan Getquin pricing / AI page quarterly — AI delivery quality is actively evolving at Getquin (Southern Europe expansion + Series B pending); their position is not static.
2. Monitor LinkedIn Getquin job posts for AI / ML hiring signal — absence so far, but this is the canary for their AI investment direction.
3. Test Getquin Wealth-tier AI firsthand before MVP launch to validate / invalidate §4.3 «AI is asserted not delivered-at-quality» claim. Budget allocation: one researcher, 2-4 hours, €13/month pro-rated.

### 6.5 New peers found (see §7 below and `competitor-matrix.md` update)

Peer scan completed in parallel. See separate §7 below summarizing additions. All peers added to `competitor-matrix.md` with source + access date.

---

## 7. Companion finding — Parqet is the missed direct peer

The peer-scan (Task 2) surfaced one product that should materially update our competitive picture:

**Parqet** — German portfolio tracker, 350K users (as of 2026-04-23 per their landing), €11.99 / €29.99 monthly tiers, AI-chat via **MCP bridge** to Claude + ChatGPT (**not** native embedded chat). 4.7 App Store stars (vs Getquin 4.0 Play Store). Trade Republic + Scalable + 50+ broker file imports.

**Why this matters beyond v2 discovery:**
- V2 discovery did not surface Parqet as a peer. They are **the second EU incumbent** in our Lane A + global framing, alongside Getquin.
- Their **MCP-bridge AI approach** is a legitimate competitive pattern we haven't considered: «don't build AI in-app, expose data via MCP for user's own LLM». This is an option our tech-lead should evaluate (could be cheaper-to-ship alternative to embedded AI).
- Their 4.7 App Store rating suggests they deliver more reliably than Getquin on the sync / accuracy dimensions users complain about (§3.2 Getquin complaints).

Full details + other peers found in §7.2 below. Matrix update committed separately.

---

## 8. Sources cited (with access dates)

### Primary (firsthand WebFetch 2026-04-23)

- https://getquin.com/ (landing, EN) — 2026-04-23 ✓
- https://getquin.com/pricing/ (EN) — 2026-04-23 ✓
- https://getquin.com/getquin-ai/ (AI page) — 2026-04-23 ✓
- https://getquin.com/portfolio-tracker/ — 2026-04-23 ✓
- https://getquin.com/dividend-tracker/ — 2026-04-23 ✓
- https://getquin.com/stock-forum/ — 2026-04-23 ✓
- https://getquin.com/security/ — 2026-04-23 ✓
- https://getquin.com/about-us/ — 2026-04-23 ✓
- https://getquin.com/imprint/ — 2026-04-23 ✓
- https://getquin.com/de/ (DE landing) — 2026-04-23 ✓
- https://getquin.com/de/pricing/ — 2026-04-23 ✓
- https://getquin.com/de/advisory/ — 2026-04-23 ✓
- https://getquin.com/it/ (IT landing) — 2026-04-23 ✓
- https://getquin.com/es/ — 2026-04-23 ✗ (404)
- https://getquin.com/pt/ — 2026-04-23 ✗ (404)
- https://getquin.com/ru/ — 2026-04-23 ✗ (404)
- https://play.google.com/store/apps/details?id=com.getquin.app — 2026-04-23 ✓ (4.0 stars, 7.45K reviews, 100K+ installs)
- https://www.linkedin.com/company/getquin/ — 2026-04-23 ✓ (11-50 employees, 27 listed, Berlin, Series A $15M)

### Secondary (search snippets + third-party when primary was blocked or unavailable)

- https://www.deutsche-startups.de/tag/getquin/ — funding round confirmation (Portage Ventures, Horizons Ventures, $15M, June-July 2022)
- https://www.producthunt.com/products/getquin — 2026-04-23 (8 reviews, 3.8 rating, co-founder responses on security concerns)
- https://news.ycombinator.com/ — search-indexed mentions (Wealthfolio 2.0 thread + others for peer scan)
- Trustpilot (`trustpilot.com/review/getquin.com`) — direct access returned 403; third-party search snippets summarize «3.8/5, ~260 reviews»
- r/eupersonalfinance — search-indexed mentions (IBKR sync issue, multi-currency praise)
- r/fidelityinvestments — search-indexed mention (Fidelity auto-sync blocked)
- Mustachian Post community — search-indexed («fancy, visually appealing»; trial-to-churn comment)
- Helpmoji — aggregated user issue list
- getquin.statuspage.io — version 2.224.0 data-accuracy incident still not fully resolved

### Unverified / flagged

- Crunchbase page for getquin / QUIN Technologies GmbH — 2026-04-23 ✗ (403 on direct WebFetch; funding data via deutsche-startups.de instead)
- Apple App Store (specific App ID unknown; multiple candidate IDs returned 404)
- Trustpilot direct access — blocked (403); third-party snippets used instead
- Reddit direct access — blocked on both `reddit.com` and `old.reddit.com` domains; search-indexed snippets used instead

---

## 9. Methodology caveats

1. **Primary-first evidence preference.** Every claim in §1-2 that can be primary-verified (pricing, landing copy, locale existence, AI page content, imprint legal entity) was fetched directly.
2. **Third-party triangulation for user sentiment.** Direct Trustpilot + Reddit + Apple App Store access was blocked. Review themes rely on 3-4 independent search-indexed sources; consistency across sources raises confidence but does not substitute for firsthand review coding.
3. **Funding data is single-sourced** through deutsche-startups.de + LinkedIn confirmation. Crunchbase blocked. Unknown: subsequent rounds post-2022.
4. **AI capability inference is landing-claim-based.** We have not tested Getquin's Wealth-tier AI firsthand. §4.3 claim «AI is asserted not delivered-at-quality» is based on landing-claim analysis + zero AI-specific review sentiment — not on hands-on Wealth-tier evaluation. Validation recommended (§6.4 action item).
5. **User count / AUM claims are self-reported.** 500K users + €20B tracked are on their landing page; Play Store install count (100K+) is a lower bound; no independent audit available.
6. **Russian/CIS presence verdict is based on absence evidence** (404s, zero locale, zero hiring signal). Absence is strong but not the same as «they will never enter this market» — their choice could shift with Series B funding or EU strategy revision.

---

## 10. Appendix — open research questions

Surfaced by this deep-dive, flagged for `USER_RESEARCH/hypotheses.md`:

1. H-001 — Do US retail users perceive EU-origin trackers as «not for them» on broker-coverage dimension?
2. H-002 — Do EU Getquin Premium users downgrade / cancel when they discover conversational AI is Wealth-tier?
3. H-003 — Does Getquin data-accuracy complaint correlate with US-broker sync vs EU-broker sync?
4. H-004 — Is Russian/CIS retail demand for portfolio-aware AI chat at a scale worth our PO-prioritized launch support?
5. H-005 — For Getquin Wealth-tier users, does «AI access» translate to perceived product value or to «nice-to-have»?
6. H-006 — Would an ICP-A user prefer native in-app AI (Getquin model, Oracle model) or MCP-bridge-to-own-LLM (Parqet model)?
7. H-007 — How much does Getquin's ads-in-app business model erode trust for ICP-A vs ICP-B?

All flagged for live-interview testing once user-researcher cadence begins.
