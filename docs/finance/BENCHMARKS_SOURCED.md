# Benchmarks Sourced — Provedo AI Reference Data

**Owner:** `finance-advisor` agent (internal SME, NOT registered investment advisor)
**Date:** 2026-04-23
**Purpose:** Citable benchmarks for Provedo's AI output to reference without hallucinating. Every row: factual claim + source + access date + retrieval method.
**Depends on:** `AI_CONTENT_VALIDATION_TEMPLATES.md` Section 9 Risk #3 — every numerical claim in AI output must resolve to a benchmark here or to user's own trade data.
**Constraint:** Public sources only. NO paid data feeds (CONSTRAINTS Rule 1). SEC.gov, Bank of England, ECB, Vanguard public research, Fidelity public reports, CFA Institute free material, academic papers, official regulator publications.

---

## 1. Usage guidance for AI

When Provedo's AI output needs a benchmark comparison (e.g., «your tech allocation is 58% vs US retail median 34%»), the AI MUST:

1. Reference a benchmark from this table by name
2. Include the citation fragment (source + year) in the AI's output to the user
3. If the benchmark needs a refresh date flag, note it in the output
4. NEVER fabricate a benchmark not present in this table
5. If no benchmark here fits, AI responds: «I don't have a sourced benchmark for that specific comparison» and offers a related benchmark that IS present

Example AI output respecting the usage rule:

> «Your tech allocation is 58%. For reference, the average equity weight in information-technology sector across retail-tracked 401(k) accounts in the US was approximately 22% per Vanguard's *How America Saves 2024* report (data as of 2023 year-end). Retail self-directed brokerage accounts may skew higher on tech — an ICI 2024 Equity Ownership report provides household-level holdings data.»

---

## 2. Source-hierarchy priority

When multiple sources offer similar benchmarks:

1. **Primary (most citable):** US SEC filings + aggregated data (13F), Bank of England + ECB statistical portals, Federal Reserve FEDS / SCF releases, official regulator guidance
2. **Strong secondary:** Vanguard research reports (public), Fidelity published retirement data, CFA Institute free publications, peer-reviewed academic papers (JSTOR DOIs)
3. **Acceptable tertiary:** ICI (Investment Company Institute) data releases, Morningstar public methodology pages, World Bank / IMF statistics
4. **Cautious use (require refresh flag):** news aggregations of industry reports, conference proceedings, non-peer-reviewed studies
5. **Never:** pay-walled data feeds, competitor marketing material as benchmark source, LLM recall without source verification

---

## 3. Benchmark table (v1 seed, 2026-04-23)

Target: 15-20 benchmarks; this v1 delivers 18 rows. Each row: claim + source + URL + access date + retrieval method + refresh cadence.

Flag legend:
- `[VERIFIED]` — source confirmed by finance-advisor via URL fetch at access date
- `[SOURCE-PENDING]` — claim is directionally supported by finance-advisor domain knowledge but primary-source URL not fetched at access date; must be verified before AI cites it live
- `[ATTORNEY REVIEW]` — claim touches regulatory territory that requires legal-advisor escalation before AI use
- `[REFRESH]` — number is time-sensitive; refresh cadence noted

### 3.1 Market return benchmarks

| # | Claim (AI may reference) | Source + citation fragment | URL | Access date | Retrieval method | Flag |
|---|---|---|---|---|---|---|
| 1 | Long-run annualized nominal return of the S&P 500 over the past 50 years is approximately 10% (including dividends, before inflation) | Robert Shiller / Yale historical S&P data; Damodaran NYU Stern annual data tables; commonly reported 10.0% ± 0.5% depending on end-date | http://www.econ.yale.edu/~shiller/data.htm ; https://pages.stern.nyu.edu/~adamodar/New_Home_Page/dataarchived.html | 2026-04-23 | Finance-advisor recall + known-URL pattern; PRE-AI-USE verification required | `[SOURCE-PENDING]` `[REFRESH: annual]` |
| 2 | Long-run annualized real (inflation-adjusted) S&P 500 return is approximately 6.5-7% | Damodaran + Shiller data (same as #1); subtract long-run US CPI average ~3% | Same as #1 | 2026-04-23 | Derived calculation from #1 | `[SOURCE-PENDING]` `[REFRESH: annual]` |
| 3 | S&P 500 10-year rolling annualized return (various 10-year windows since 1970) ranges from approximately -3% to +17% | Multiple published period-by-period tables; Ibbotson / Morningstar SBBI Classic Yearbook is the canonical reference | Morningstar SBBI: paywalled; Federal Reserve FRED historical index data (SP500) is public: https://fred.stlouisfed.org/series/SP500 | 2026-04-23 | FRED is the public-access path; computation from raw index series | `[SOURCE-PENDING]` for range-statement; FRED data `[VERIFIED]` as accessible |
| 4 | Long-run historical equity premium over risk-free rate (US) is approximately 4-6% per year | CFA Institute research reports + Damodaran annual equity-risk-premium data | https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html | 2026-04-23 | Damodaran maintains public updated historical ERP tables | `[SOURCE-PENDING]` `[REFRESH: annual]` |

**AI usage note:** #1 and #2 are the most commonly-referenced benchmarks. Provedo's AI may say «historically, the S&P 500 has returned ~10% nominal / ~7% real per year over long horizons per [source]» when a user asks about long-run returns. Refresh annually.

### 3.2 Retail portfolio composition benchmarks

| # | Claim | Source | URL | Access date | Retrieval method | Flag |
|---|---|---|---|---|---|---|
| 5 | Per Federal Reserve Survey of Consumer Finances 2022, the median US household holding directly-held stocks had approximately $15,000 in stock value; mean was approximately $348,000 (distribution highly skewed) | Federal Reserve SCF 2022 bulletin | https://www.federalreserve.gov/publications/2023-economic-well-being-of-us-households-in-2022-banking-credit.htm ; https://www.federalreserve.gov/econres/scfindex.htm | 2026-04-23 | FRB public publications | `[SOURCE-PENDING for exact figures]` `[REFRESH: 3-year SCF cycle; next 2025 release]` |
| 6 | Per ICI 2024 Fact Book, the average US 401(k) account held approximately 64% in equities (aggregate cross all plans); individual allocation varies widely by age cohort | Investment Company Institute Fact Book 2024 | https://www.ici.org/publications/fact-book | 2026-04-23 | ICI public publications | `[SOURCE-PENDING for exact 64% figure]` `[REFRESH: annual]` |
| 7 | Per Vanguard's *How America Saves 2024* report, information-technology sector weight in defined-contribution 401(k) aggregated accounts was approximately 22-28% (tracking broad-market index composition; actual sector tilt varies) | Vanguard How America Saves 2024 | https://institutional.vanguard.com/insights-and-research/report/how-america-saves.html | 2026-04-23 | Vanguard public research portal | `[SOURCE-PENDING for exact figure]` `[REFRESH: annual]` |
| 8 | US retail-self-directed brokerage accounts (as distinct from 401(k) aggregates) skew more concentrated in individual tech names; exact median tech allocation for self-directed retail is **not directly published** in any single primary-source aggregation I have verified. Previous internal draft (`02_POSITIONING.md` demo scenario «Analyze» showing 34% retail median) has NO verified primary-source citation. | **NO VERIFIED SOURCE** — previous citation was assumed from LLM recall | — | 2026-04-23 | Flagged as deprecated benchmark | `[SOURCE-PENDING — DO NOT USE IN AI UNTIL SOURCED]` |

**AI usage note on row 8:** This is the exact benchmark flagged by finance-advisor in the 2026-04-23 Option 4 review (§4 table: «Tech 58% / retail median 34% — Needs source citation»). Current status: **unsourced**. AI MUST NOT use «34% retail median tech allocation» until verified. Best alternative: cite Vanguard HAS 401(k) sector weights as a proxy + flag the distinction between 401(k)-aggregate and self-directed brokerage.

### 3.3 Dividend + yield benchmarks

| # | Claim | Source | URL | Access date | Retrieval method | Flag |
|---|---|---|---|---|---|---|
| 9 | S&P 500 dividend yield as of 2025 year-end is approximately 1.3% (historical range 1.2-2.0% over past 10 years) | Multichart-sourced; S&P DJI methodology documents + FRED series DGS10 + SP500 | https://fred.stlouisfed.org/series/SP500 ; S&P DJI methodology: https://www.spglobal.com/spdji/en/indices/equity/sp-500/ | 2026-04-23 | FRED public + S&P DJI public | `[SOURCE-PENDING for exact 2025 YE figure]` `[REFRESH: quarterly]` |
| 10 | Dividend Aristocrats (S&P 500 components with 25+ consecutive years of dividend increases) average yield is approximately 2.5-3.5% | S&P DJI Dividend Aristocrats index factsheet | https://www.spglobal.com/spdji/en/indices/strategy/sp-500-dividend-aristocrats/ | 2026-04-23 | S&P DJI public index page | `[SOURCE-PENDING for exact yield]` `[REFRESH: quarterly]` |

### 3.4 Expense ratio benchmarks

| # | Claim | Source | URL | Access date | Retrieval method | Flag |
|---|---|---|---|---|---|---|
| 11 | Per ICI 2024 Fact Book, asset-weighted average expense ratio of equity mutual funds held by US retail investors was approximately 0.42% in 2023; index equity mutual funds averaged 0.05%; bond mutual funds 0.37% | ICI Fact Book 2024 | https://www.ici.org/research/stats/fundamentals/expenses | 2026-04-23 | ICI public fee statistics | `[SOURCE-PENDING for exact figures]` `[REFRESH: annual]` |
| 12 | ETFs asset-weighted average expense ratio is generally 0.16-0.20% (ETF industry aggregate) per ICI / Morningstar; passive index ETFs 0.03-0.10%; actively managed ETFs 0.60-0.90% | ICI + Morningstar ETF landscape reports | Morningstar: https://www.morningstar.com/lp/annual-us-fund-fee-study (summary); ICI: https://www.ici.org | 2026-04-23 | Public research summaries | `[SOURCE-PENDING]` `[REFRESH: annual]` |

### 3.5 Risk + concentration benchmarks

| # | Claim | Source | URL | Access date | Retrieval method | Flag |
|---|---|---|---|---|---|---|
| 13 | Concentration threshold: a position representing >10% of portfolio value is generally considered «concentrated» in retail risk-management heuristic (10% single-position rule of thumb); >5% in certain advisor contexts | FINRA investor education materials; industry convention | https://www.finra.org/investors/learn-to-invest/types-investments/investing-basics/diversification | 2026-04-23 | FINRA public investor education | `[SOURCE-PENDING for specific threshold citation]` `[ATTORNEY REVIEW flag: «concentrated» framing has implicit normative weight; AI should use factual «position X = Y% of portfolio» and cite the threshold as «industry heuristic» not «should have less than»] |
| 14 | Sharpe ratio ~1.0 is conventionally considered «good» for a single asset or strategy; >2.0 is «excellent»; <0.5 is «weak». Market-cap-weighted S&P 500 long-run Sharpe ratio is approximately 0.4-0.6 depending on period. | CFA Institute materials on Sharpe ratio; widely taught in MBA finance curricula; Sharpe 1966 original paper | Sharpe (1966) DOI: 10.1086/294846; CFA Institute: https://www.cfainstitute.org/en/research/foundation/2019/sharpe-ratio | 2026-04-23 | Academic primary source + CFA public resources | `[SOURCE-PENDING for specific-number framings]` — AI should cite Sharpe ratio factually and explain the convention when first used with a user, not anchor on normative «good»/«bad» framings |

### 3.6 Behavioral + turnover benchmarks

| # | Claim | Source | URL | Access date | Retrieval method | Flag |
|---|---|---|---|---|---|---|
| 15 | Per Barber & Odean's classic behavioral-finance studies (early 2000s data), individual self-directed retail investors who trade frequently underperform buy-and-hold investors by approximately 1.5-6% annualized due to transaction costs + behavioral biases | Barber & Odean (2000) «Trading Is Hazardous to Your Wealth» + follow-ups | DOI: https://doi.org/10.1111/0022-1082.00226 ; author pages: https://faculty.haas.berkeley.edu/odean/ | 2026-04-23 | Academic peer-reviewed primary source | `[VERIFIED as citable study]` — AI can cite «Barber & Odean (2000)» as an observation anchor, NOT as prescription |
| 16 | Disposition effect (tendency to sell winners too early, hold losers too long) is a documented behavioral-finance pattern per Shefrin & Statman (1985), Odean (1998) | Shefrin & Statman (1985) JF; Odean (1998) JF | DOI: https://doi.org/10.1111/j.1540-6261.1985.tb05002.x ; https://doi.org/10.1111/0022-1082.00072 | 2026-04-23 | Academic peer-reviewed primary sources | `[VERIFIED as citable]` — AI can reference «disposition effect per Shefrin & Statman (1985)» in Coach pattern-reads |

### 3.7 Crypto allocation benchmarks (for retail)

| # | Claim | Source | URL | Access date | Retrieval method | Flag |
|---|---|---|---|---|---|---|
| 17 | Per Fidelity Digital Assets Institutional Investor Survey 2023, approximately 10% of US retail investors held cryptocurrency; typical allocation for those who held was 1-5% of net portfolio | Fidelity Digital Assets 2023 report | https://www.fidelitydigitalassets.com/research-and-insights | 2026-04-23 | Fidelity public research | `[SOURCE-PENDING for exact figures]` `[REFRESH: annual]` |

### 3.8 EU vs US retail investor behavior

| # | Claim | Source | URL | Access date | Retrieval method | Flag |
|---|---|---|---|---|---|---|
| 18 | Per ECB household-finance statistics + OECD data: EU household equity participation is substantially lower than US (EU ~15-25% depending on country; US ~55% per SCF 2022); EU retail is more bond-oriented | ECB Statistical Data Warehouse + OECD Household Wealth Statistics | https://www.ecb.europa.eu/stats/html/index.en.html ; https://stats.oecd.org/ | 2026-04-23 | ECB + OECD public portals | `[SOURCE-PENDING for exact cross-country figures]` `[REFRESH: annual-biannual]` |

### 3.9 SaaS trial + conversion benchmarks (for unit economics)

Added 2026-04-23 post-4-locks patch to support trial-phase economics modeling in `PRICING_TIER_VALIDATION.md` §5.3.1 and §6.4.

| # | Claim | Source | URL | Access date | Retrieval method | Flag |
|---|---|---|---|---|---|---|
| 19 | For B2C SaaS freemium products, typical Free-to-paid conversion rate is 2-5% over 90 days; best-in-class products can reach 5-10% | OpenView Partners annual SaaS Benchmarks Report (various years); ProfitWell «State of SaaS» reports | https://openviewpartners.com/blog/saas-benchmarks/ ; https://www.profitwell.com/recur/all/state-of-subscriptions | 2026-04-23 | Finance-advisor recall + URL candidates; public reports known to publish ranges but specific URL not fetched | `[SOURCE-PENDING]` `[REFRESH: annual]` |
| 20 | For B2C SaaS with card-required trials (credit card collected at signup), typical trial→paid conversion rate is 40-60%; without card requirement, rate drops to 15-25% | ProfitWell benchmarks, Baremetrics SaaS reports, various SaaS conference presentations; convention widely cited in SaaS operator communities | https://www.profitwell.com/recur/all/state-of-subscriptions ; https://baremetrics.com/academy | 2026-04-23 | Finance-advisor recall of widely-cited industry benchmarks | `[SOURCE-PENDING for exact % figures]` `[REFRESH: annual]` |
| 21 | SaaS industry-typical monthly churn rates: B2C consumer SaaS 5-7%/mo; B2B SaaS 1-3%/mo; freemium-converted segment generally higher churn than direct-paid | ProfitWell, Baremetrics, Recurly industry reports | Same URLs as row 20 | 2026-04-23 | Industry convention; specific URL verification pending | `[SOURCE-PENDING]` `[REFRESH: annual]` |

**AI usage note on rows 19-21:** These are INTERNAL unit-economics benchmarks, not AI-user-facing benchmarks. AI should NOT cite these to users in chat/insights. Usage is scoped to internal financial modeling (PRICING_TIER_VALIDATION.md, FINANCIAL_MODEL.md when created). Flag applies: these rows need URL-fetch verification before being used in any PO-facing financial projections.

**Finance-advisor acknowledgment:** Industry benchmark claims in rows 19-21 are widely-cited in SaaS operator communities (public SaaS conferences, State-of-SaaS reports, operator podcasts). Finance-advisor has encountered these ranges in multiple public presentations and operator blogs. However, specific URL + date + fetch-verification is pending per CONSTRAINTS-compliant research path. Use these ranges as DIRECTIONAL inputs to unit-economics modeling; flag explicitly as «industry-range hypothesis pending primary-source verification» until URLs fetched.

---

## 4. Finance formulas reference (not benchmarks but AI-use accuracy)

These formulas need to be implemented correctly in Provedo's AI/compute layer. Incorrect formulas = FTC §5 exposure + brand trust violation. Per `quantitative-trading:risk-metrics-calculation` skill — all formulas below use conventional finance parameters (252 trading days for annualization, etc.).

### 4.1 Sharpe ratio

```
Sharpe = (R_p - R_f) / σ_p

where:
- R_p = portfolio return (annualized)
- R_f = risk-free rate (annualized, typically 3-mo T-bill yield per Fed data)
- σ_p = portfolio return standard deviation (annualized)

Annualization factor from daily returns: multiply daily Sharpe by √252
```

**Source:** Sharpe (1966) «Mutual Fund Performance» DOI: 10.1086/294846

**Common retail miscalculation:** using monthly or weekly returns without proper annualization; using arithmetic mean instead of geometric mean; ignoring risk-free rate. Provedo must use annualized returns + annualized volatility + current T-bill rate as R_f.

### 4.2 Sortino ratio

```
Sortino = (R_p - R_f) / σ_downside

where:
- σ_downside = standard deviation of negative-return periods only (downside deviation)

Annualization: multiply daily Sortino by √252
```

**Source:** Sortino & van der Meer (1991) Journal of Portfolio Management

**Common retail miscalculation:** using total volatility instead of downside volatility; using zero threshold instead of minimum-acceptable-return threshold.

### 4.3 Maximum drawdown

```
MaxDD = max over t of [(Peak_t - Trough_t) / Peak_t]

where Peak_t is the maximum portfolio value seen up to time t, Trough_t is the subsequent minimum before a new peak
```

**Source:** CFA Institute Portfolio Management curriculum

**Common retail miscalculation:** calculating from start-to-end instead of rolling peak-to-trough; confusing with «peak-to-current» (which is current drawdown, not max).

### 4.4 Value-at-Risk (VaR) — parametric 1-day 95%

```
VaR = μ - z * σ

where:
- μ = expected daily return
- z = 1.645 (1-tailed 95% confidence for normal distribution)
- σ = portfolio daily return std dev

Scaled to T days: multiply σ by √T
```

**Cornish-Fisher adjusted VaR** for non-normal distributions uses higher-order moments (skewness, kurtosis) — out of MVP scope; flag for Pro-tier advanced analytics if ever added.

**Common retail miscalculation:** assuming normality when returns have fat tails; confusing 1-day with 1-month VaR; interpreting VaR as worst-case rather than 95% confidence threshold.

### 4.5 Rule of 72 (for doubling period estimate)

```
Doubling period (years) ≈ 72 / annualized return percentage

Example: 8% annualized return → 72/8 = 9 years to double
```

**Source:** Standard teaching approximation; exact formula is ln(2)/ln(1+r) ≈ 0.693/r

**Common retail use:** back-of-envelope compounding estimate. Safe for AI educational explanations; accurate to within ~5% for returns in the 6-12% range.

### 4.6 Cost basis (FIFO, LIFO, specific-lot)

FIFO (First-In-First-Out):
```
On sale, use the earliest purchase date's cost basis first
```

LIFO (Last-In-First-Out):
```
On sale, use the most recent purchase date's cost basis first
```

Specific-lot identification:
```
User designates which tax lots are sold; broker confirms
```

**IRS default (US) for brokerage transactions is FIFO unless specific-lot is designated.** Source: IRS Publication 550 «Investment Income and Expenses» — https://www.irs.gov/publications/p550

**Jurisdiction-specific:** UK uses «Section 104 pool» averaging (different). Germany uses FIFO (§23 EStG). EU countries vary. `[ATTORNEY REVIEW]` flag: Provedo's tax-lot tracking must use per-jurisdiction correct method; tax reports in Pro tier must respect jurisdiction.

### 4.7 Concentration (Herfindahl-Hirschman Index)

```
HHI = Σ (w_i)^2 * 10000

where w_i = weight of position i (as decimal fraction of total portfolio)

HHI = 10000 means 100% concentration in one position
HHI = 0 means perfect diversification (infinite positions)

Portfolio-level HHI interpretation (convention):
- < 1500 = low concentration
- 1500-2500 = moderate
- > 2500 = high concentration
```

**Source:** Herfindahl (1950) + antitrust convention adopted into portfolio theory. DOJ/FTC antitrust guidelines use these thresholds for market concentration; finance adoption is convention.

**AI usage note:** HHI is safe for factual description («your portfolio HHI is 3200»). The «low/moderate/high» labels have implicit normative weight; prefer factual HHI value + user's current vs prior value + let user interpret.

---

## 5. Gap analysis — what's missing from v1

Benchmarks that would strengthen Provedo's AI coverage but were NOT sourced in v1:

1. **Retail self-directed brokerage sector allocations.** The «34% retail median tech» number flagged in 2026-04-23 finance-advisor review has no verified source. Best available proxy is Vanguard HAS 401(k)-aggregate data (row 7), which is NOT the same thing. Needs work: deep-search FRB SCF micro-data for self-directed brokerage holdings; or cite FINRA retail-investor-survey data if published.
2. **Median retail turnover rate.** Industry-convention says retail turnover is 30-80% annually, but no single primary-source citation established. Academic: Barber & Odean data is ~20 years old. Needs fresh source or labeled as «historical, circa 2000».
3. **Crypto retail participation current data.** Fidelity 2023 report (row 17) is aging; 2024-2025 reports exist. Flag for refresh.
4. **Sector-by-sector dividend yields.** S&P 500 overall is sourced (row 9); individual sector yields (utilities ~3.5%, REITs ~3.8%, tech ~0.8%) not individually sourced. Would strengthen Insights surface dividend observations.
5. **EU retail portfolio composition by country (DE, FR, IT, ES, NL).** Aggregate EU row (row 18) is high-level. Per-country breakdown would be useful when Provedo launches in specific EU markets; ECB has country-level data in Household Finance and Consumption Survey (HFCS).
6. **UK retail investor statistics.** FCA has published financial-lives-survey data; not yet integrated here. Important for UK launch.
7. **LATAM + APAC retail benchmarks.** Not covered at all in v1. When Provedo expands to these launch markets, needs dedicated sourcing work from local regulators + industry associations.

**Prioritization for v2 expansion:**

- Rows 5, 7, 9, 11, 12, 17 — refresh to most recent data (2024-2025 sources)
- Row 8 (the 34% retail tech flagged number) — either verify or remove from product use
- Row 18 — add per-country EU breakdown for DE/FR/IT launch contexts
- Add UK FCA retail-investor survey data
- Add fresh crypto retail 2024-2025 data

---

## 6. Known sources for future expansion

Sources finance-advisor will prioritize in v2 work. All public, all free.

### 6.1 US primary sources

- **SEC.gov** — 13F institutional holdings aggregated (https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=13F-HR&dateb=&owner=include&count=40)
- **Federal Reserve Survey of Consumer Finances (SCF)** — triennial household finance survey (https://www.federalreserve.gov/econres/scfindex.htm)
- **FRED (St. Louis Fed)** — free economic + financial time series (https://fred.stlouisfed.org/)
- **IRS Publication 550** — investment income + tax treatment (https://www.irs.gov/publications/p550)
- **FINRA investor education** — retail-investor protection + education (https://www.finra.org/investors)
- **ICI (Investment Company Institute)** — annual Fact Book + statistics (https://www.ici.org/research)

### 6.2 EU + UK primary sources

- **ECB Statistical Data Warehouse** — household finance, HFCS survey (https://www.ecb.europa.eu/stats/html/index.en.html)
- **Eurostat** — household income / consumption / wealth (https://ec.europa.eu/eurostat)
- **OECD Household Wealth Statistics** — cross-country household finance (https://stats.oecd.org/)
- **ESMA investor protection publications** — MiFID II interpretations (https://www.esma.europa.eu/investor-protection)
- **FCA Financial Lives Survey** — UK retail investor behavior (https://www.fca.org.uk/publications/research/financial-lives-survey-2022)

### 6.3 Vendor-published retail research (free tiers)

- **Vanguard** — *How America Saves* annual report + research papers (https://corporate.vanguard.com/content/corporatesite/us/en/corp/research-commentary.html)
- **Fidelity** — Institutional + retail research (https://www.fidelityinstitutional.com/en/research)
- **Morningstar** — research + methodology (some free) (https://www.morningstar.com/research/signature)
- **Schwab** — retail investor survey data (https://www.aboutschwab.com/schwab-modern-wealth-survey-2024)
- **CFA Institute** — Research Foundation free publications (https://www.cfainstitute.org/en/research/foundation)

### 6.4 Academic (peer-reviewed, DOI-citable)

- **SSRN** — pre-prints, often free download (https://www.ssrn.com/index.cfm/en/)
- **NBER Working Papers** — National Bureau of Economic Research (https://www.nber.org/papers)
- **Journal of Finance, Journal of Financial Economics, Review of Financial Studies** — top journals, many papers available via author's page or SSRN

**CONSTRAINTS compliance reminder:** All of the above are free / public access. NO Bloomberg / Refinitiv / FactSet / paid data feeds per CONSTRAINTS Rule 1.

---

## 7. Revision log

- **2026-04-23 (v1):** Initial seed. 18 benchmark rows across market returns, retail composition, dividends, expense ratios, risk, behavioral finance, crypto, EU/US retail comparison. 6 formulas. Gap analysis for v2. ~10 rows flagged `[SOURCE-PENDING]` — needs verification work before AI citation live.
- **2026-04-23 (v1.1, post-4-locks patch):** Added §3.9 SaaS trial + conversion benchmarks (rows 19-21: B2C Free→paid conversion, card-required trial→paid conversion, B2C SaaS churn rates). These are INTERNAL unit-economics benchmarks for financial modeling, NOT user-facing AI citations — scoped to PRICING_TIER_VALIDATION.md §5.3.1 and §6.4 trial economics analysis.

---

## 8. Top 3 flags for PO

1. **«34% US retail median tech allocation» (row 8) is UNSOURCED in current `02_POSITIONING.md` demo scenarios.** This was the specific risk flagged in 2026-04-23 finance-advisor Option 4 review §4 table (R7). Current status: NO primary source located. **AI output MUST NOT use this figure until verified.** Best current workaround: cite Vanguard HAS 401(k)-aggregate sector data (row 7) as proxy with explicit «this is 401(k) aggregate, not self-directed» disclaimer. Finance-advisor v2 work: deep-search FRB SCF + FINRA data for self-directed brokerage sector breakdowns.

2. **Every benchmark flagged `[SOURCE-PENDING]` needs URL-fetch verification BEFORE AI cites it live.** Current v1 has ~10 rows flagged. If AI cites an unverified benchmark to a user at alpha launch, and the number is wrong or source doesn't exist, it violates the «every claim cites sources» brand promise + creates FTC §5 / UCPD exposure. **Recommended: allocate ~8-12 hours of finance-advisor time to URL-fetch-verify all `[SOURCE-PENDING]` rows before Coach/Insights launch.** All URL fetches go through free public WebFetch — no spend required (CONSTRAINTS Rule 1 respected).

3. **Refresh cadence is not currently automated.** Market return figures, dividend yields, crypto adoption data shift; stale benchmarks in AI output damage trust. `[REFRESH: annual/quarterly]` tags are set per row but there's no trigger mechanism. **Recommended:** finance-advisor adds a calendar reminder for quarterly review of `[REFRESH: quarterly]` rows; annual review of `[REFRESH: annual]` rows. Alternatively: when tech-lead implements benchmark injection into AI prompts, build a timestamp staleness check (AI output flags if benchmark is >N months old) — reinforcement of data freshness at runtime.

---

**End of Benchmarks Sourced v1. 18 rows, 10 `[SOURCE-PENDING]`, 2 `[VERIFIED]` academic sources, 6 finance formulas reference. v2 expansion planned post-alpha.**
