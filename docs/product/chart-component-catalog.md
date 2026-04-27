# Chart / Inline-Component Catalog — Provedo Chat Answers

**Owner:** finance-advisor (catalog production); product-designer (visual mockup consumer); tech-lead (data-contract owner downstream)
**Status:** v1.1 draft 2026-04-27 (currency review + PD 8-chart-scope reconciliation + investment-domain expansion)
**Purpose:** Authoritative catalog of every visualization Provedo's chat answers may emit. Pairs with `docs/finance/AI_CONTENT_VALIDATION_TEMPLATES.md` (verb whitelist/blacklist + Lane A invariants), `docs/finance/BENCHMARKS_SOURCED.md` (benchmark citations + finance formulas reference), `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` (visual tokens, color discipline, motion budget — DS v1.1 ratified 2026-04-26 with Geist + ink-CTA + locked palette + tactile depth), `docs/design/COACH_SURFACE_SPEC.md` v2.0 (Coach indicator placement on charts/widgets), `docs/design/DASHBOARD_ARCHITECTURE.md` v1.1 (where MVP charts live in dashboard surface).
**Pre-alpha scope discipline:** entries marked **MVP** ship with first alpha; **V2** are aspirational and called out explicitly. Visual mockup work should prioritize MVP; V2 entries are catalog placeholders only.
**Visual baseline (already shipped):** four inline SVG charts in `apps/web/src/app/(marketing)/_components/charts/` — PnL sparkline, dividend calendar, trade timeline, allocation comparison-bars. The hero chat-answer pattern (`hero/ChatMockup.tsx`) demonstrates the composition: text answer → inline chart → Sources line. That composition shape is the reference pattern for every entry below.
**Brand:** «Notice what you'd miss» (locked). ICP A: Scattered Optimiser (32-42, multi-broker self-directed prosumer). Lane A LOCKED — information / education only, NOT registered investment advisor. Naming LOCKED — Provedo (2026-04-25).

---

## Section 1 — Lane A boundary rules for visualizations (binding)

These rules govern every chart, table, badge, and inline component shipped by Provedo's chat answer surface. They are non-negotiable because the entire product sits in Lane A (information / education only — NOT registered investment advice). Substance-over-disclaimer is the SEC / MiFID II / FCA / CBR standard: a chart that *looks like* advice is treated as advice, regardless of footer disclaimer.

### 1.1 What charts CAN do (safe register)

- **Describe what is.** «Your tech allocation = 58% as of 2026-04-26» — factual present-tense observation.
- **Describe what was.** «Your AAPL position is down 11% since 2025-10-31 earnings» — factual past-tense observation tied to a citable event.
- **Compare two things factually.** «Your tech allocation 58% vs S&P 500 sector weight 28% (S&P DJI 2025-Q3)» — neutral two-bar comparison, both numbers sourced.
- **Surface a pattern.** «You sold AAPL three times within 7 days of a local low across 2025» — historical pattern read on user's own trade data, no normative wrapper.
- **Explain a concept.** «Drawdown = peak-to-trough decline as %. Your max 12-month drawdown was −18% on 2024-10-15.» — educational + factual user-data.
- **Show a calendar.** «$124 dividends scheduled across 7 positions in May 2026» — observation of broker-confirmed events.
- **Cite sources.** Every numerical claim resolves to either (a) user's own broker data with a timestamp + broker name, or (b) a row in `BENCHMARKS_SOURCED.md` with citation fragment.

### 1.2 What charts CANNOT do (hard-banned register)

- **Imply «buy / sell / hold».** No buy/sell arrows. No «target zone» bands. No «entry» / «exit» markers on price charts. No directional emoji (^/v) overlays that read as call-to-action.
- **Display forecasts of price or return.** No «projected price» line. No «expected return» distribution. No Monte Carlo overlay on future prices. (User-driven what-if scenarios are different — see §1.3.)
- **Use «target» / «recommended» / «suggested» / «advised» / «strategy» language anywhere on the chart, axis, label, tooltip, or legend.** Per `BRAND.md` §6.5 banned co-occurrence list, these words must not co-occur with «Provedo» in the same sentence.
- **Imply ranking with normative weight.** No «top performers» framed as «best picks». «Top 5 dividend payers in your portfolio» is OK (factual ranking by yield); «top 5 stocks to consider» is BANNED (prescriptive).
- **Color-code with normative meaning beyond factual gain/loss.** Green = positive return / red = negative return is industry-standard factual. Green = «good» allocation / red = «bad» allocation is BANNED (color-coded prescription).
- **Display benchmark comparison without sourcing the benchmark.** Every comparison line / bar / band needs a `[source · access date]` resolvable citation. No unsourced «average retail investor» claims (see `BENCHMARKS_SOURCED.md` row 8 for the exact failure mode already flagged).
- **Display a «risk score» as a single number with normative gradient.** A factual Sharpe ratio = 0.42 is OK if formula is right + period is stated + benchmark cited. A «Provedo Risk Score = 7/10 (high risk — consider rebalancing)» is BANNED (composite advice signal).

### 1.3 Borderline categories that require explicit framing

- **What-if scenarios.** User-driven simulations («what if I had bought 50% more AAPL in 2024?») are observational *if* framed as historical counterfactual on the user's own trades. Forward-looking what-if («what if AAPL drops 20% next quarter?») is OK *only* if labeled clearly as a scenario the user posed, with no Provedo-voiced direction («here's what that scenario would look like in your portfolio» — describe; do NOT add «so you might want to hedge»). V2 / Pro-tier feature, not MVP.
- **Drawdown projection.** Historical drawdown = factual. Projected drawdown for next N days = forecast = banned. Volatility cone showing historical envelope = factual + safe.
- **Rebalance windows.** Calendar markers for «your quarterly review window opens in N days» (a date the user themselves set in onboarding) = OK as scheduling. Provedo voicing «time to rebalance» = BANNED.
- **Tax-loss harvesting.** Showing realized loss positions and short-vs-long-term split = factual. Suggesting which lots to sell = BANNED. Tax surfaces especially audited per `AI_CONTENT_VALIDATION_TEMPLATES.md` §4.

### 1.4 Required annotations on every chart

Every chart shipped in a chat answer carries:

1. **Time anchor.** «as of YYYY-MM-DD HH:MM TZ» or «period: YYYY-MM-DD to YYYY-MM-DD». Visible in title row or below chart, not hidden in tooltip.
2. **Source citation.** Format: `Source: [broker name] · [data type] · [last sync timestamp]` for user data, `Source: [organization] · [report] · [year]` for benchmarks. Multiple sources concatenated with `·` separator (matches existing `Sources` primitive).
3. **Period of measurement.** «12-month», «YTD», «since position opened», «full history». Never ambiguous.
4. **Currency.** «USD», «EUR», «GBP» — explicit, even when single-currency portfolio. Multi-currency portfolios show currency per-position or aggregate with explicit FX rate timestamp.
5. **Caption (color-not-only WCAG 1.4.3).** Mandatory data caption summarizing what the chart shows in plain text — required for accessibility AND for Lane A clarity. Example: «Your tech allocation is 58% (highlighted in teal); S&P 500 tech weight is 28% (gray). Source: Schwab holdings 2026-04-26 + S&P DJI methodology Q3 2025.»

### 1.5 Forbidden visual patterns (anti-template list)

- Buy / sell arrows on price or P&L charts
- Green / red «zones» on charts that imply «buy zone» / «sell zone» / «overbought» / «oversold»
- Speedometer / gauge widgets that compress multi-dimensional finance state into single normative score
- «Crystal ball» / fortune-teller iconography for what-ifs (forecasting brand drift)
- Animated countdown timers («3 days until you should…»)
- Heat-map overlays where red implicitly means «sell» and green implicitly means «buy»
- «Recommended allocation» pie chart next to «your allocation» pie chart (this is a textbook advisor frame — banned even with disclaimer)
- Star ratings on positions or benchmarks
- «Provedo Score» / «Health Score» / any single-number composite gradient
- **Technical-analysis overlays on price charts** (added v1.1): support / resistance lines, trend lines, channels, RSI / MACD / Bollinger bands / stochastics / any indicator panel — these are trader-tool conventions and pull a price chart from descriptive (Lane A) into prescriptive (Lane B-feeling) territory. Moving averages allowed only in V2 with explicit «historical observation, not signal» framing.
- **Efficient-frontier overlays on scatter plots** (added v1.1): no curved «efficient frontier» line on H5 risk-return scatter; no «optimal» region shading; no quadrant labels like «aggressive / conservative». Quadrant labels framed as factual axes only («high volatility / low volatility», «high return / low return» — descriptive only) per H5 guardrails.
- **«Target weight» bars on drift charts** (added v1.1): B8 drift visualization shows period-over-period change only. A target-weight reference line implies a prescription («you should be at X%»). Banned. Industry-convention thresholds (e.g., 5% rebalance band) may be cited in tooltip text as factual conventions but not drawn as a target line.

### 1.6 Source-citation requirement matrix

| Chart class | Citation requirement |
|---|---|
| User's own positions / trades / dividends | `[broker] · [last sync timestamp]` mandatory |
| Market benchmark (S&P 500, sector ETF) | `BENCHMARKS_SOURCED.md` row reference + access date |
| Retail comparison (e.g., «average retail tech allocation») | `BENCHMARKS_SOURCED.md` verified row OR DO NOT SHIP (row 8 lesson) |
| News event annotation (earnings, corporate action) | `[issuer] [filing/press-release type] [date]` |
| Behavioral pattern (Coach surface) | Pattern definition + paper citation (e.g., «disposition effect per Shefrin & Statman 1985») |
| Tax calculation | Jurisdiction reference («US IRS Pub 550 FIFO default» / «UK Section 104 pool» / «DE §23 EStG FIFO») |

### 1.7 Default time-period anchors per chart semantic (added v1.1)

When a chat answer surfaces a chart without the user specifying a period, the AI prompt MUST select a default per the chart's semantic. Inappropriate defaults can quietly bias narrative (e.g., showing 1Y when YTD is more relevant after a March drawdown). Defaults below align chart semantics with prosumer ICP A reading conventions:

| Chart entry | Default period | Rationale |
|---|---|---|
| A1 portfolio sparkline (general «how am I doing») | **YTD** | Most natural anchor for «doing» framing; users self-anchor to current year. Provide tabs for WTD / MTD / 1Y / ALL. |
| A1 portfolio sparkline (drawdown / «down this month» framing) | **MTD** | Match the user's framing; if the user says «this month», don't show 1Y. |
| A2 / A2b position card | **since position opened** | Cost-basis-anchored framing; «12-month return» mid-position is misleading. |
| A2b candlestick / line (price chart) | **1Y** with toggles to 1M / 3M / 6M / 5Y | Match broker / TradingView conventions; users expect this. |
| A3 attribution bar | **same as user's question** | If user asks «why am I down this week», answer WTD; do NOT default to 1Y. Match their framing. |
| A4 / H1 benchmark comparison | **1Y** with YTD toggle | Long enough for benchmark drift to be meaningful; short enough not to obscure recent narrative. |
| A5 drawdown chart | **ALL available history** (capped at 5Y) | Drawdown is a tail-event concept; short windows hide what users want to see. |
| A6 volatility cone | **1Y rolling, 30-day window** | Standard convention. |
| A8 cash-on-cash | **ALL available history** | Compounding context only meaningful over full holding period. |
| A9 portfolio area | **YTD with 1Y / ALL toggles** | Mirrors A1 conventions. |
| A10 stacked-area accounts | **YTD with 1Y toggle** | Match A1; account contribution tells YTD story best. |
| B1–B5 allocation breakdowns | **point-in-time (no period)** | Allocation is a snapshot; «period» applies only to drift (B8). |
| B8 position-drift bar | **QTD** default; toggles to MTD / YTD / 1Y | Quarterly anchor matches institutional rebalancing convention; YTD too noisy for drift narrative. |
| B9 concentration treemap | **point-in-time** | Snapshot. |
| C1 dividend calendar | **next 30 days + last 30 days** | «What's coming up» AND «what just paid». |
| C5 cash flow timeline | **YTD** | Tax-year alignment. |
| C6 cash-flow waterfall | **YTD with 1Y toggle** | Year-in-review framing. |
| D1 trade timeline | **last 30 days** | Recency bias is correct here — recent trades dominate user's mental model. |
| D3 / D4 Coach pattern | **all-history pattern; instances over last 1Y** | Pattern needs sample size; instances need recency for credibility. |
| D6 trade-frequency heatmap | **last 1Y** | GitHub-style annual contribution view is the convention. |
| E1 realized gains | **current tax year** (jurisdiction-aware) | Tax year, not calendar year. UK April-anchored, US Jan-anchored. |
| F2 / F3 risk metrics | **last 1Y** with formula tooltip | Standard convention; shorter periods unstable. |
| F4 concentration stat | **point-in-time** | Snapshot. |
| G1 / G3 / G5 events | **next 30 days** | Forward-looking events. |
| H4 what-if scenarios | **user-specified period** | User defines the scenario; never default. |
| H5 risk-return scatter | **last 1Y** | Standard convention. |

**General principles:**
1. **Match user's framing.** If the user says «this week», do not default to 1Y.
2. **Tax-year aware.** Realized gains, dividend income summaries: tax year, not calendar year, jurisdiction-aware.
3. **Snapshot vs period.** Allocation breakdowns = snapshot. Drift / change = period. Don't mix.
4. **Always show toggle.** Even with smart default, user gets WTD / MTD / QTD / YTD / 1Y / ALL toggles where applicable.
5. **Forward-looking caps at 30 days.** Provedo does not project further than the broker / issuer announcement window. No 90-day forward projections.

---

## Section 2 — Scaling principles (2 holdings vs 1000 holdings)

Provedo's user base will range from a newcomer with 2 ETFs ($2,000 portfolio) to a multi-broker millennial with 200+ positions across 4 brokers ($80,000 portfolio) to power-users with 1,000+ positions including options, bonds, crypto. Every component must work across this range without becoming useless at either extreme. The catalog encodes a single recurring scaling pattern with three modes, plus per-component fallbacks.

### 2.1 The «Top-N + Other» pattern (recurring solution)

The dominant scaling pattern across allocation, exposure, P&L, and dividend visualizations:

- **Small (N ≤ 10 positions / sectors / accounts):** show every entity individually. No aggregation. Sparkline for every position is feasible.
- **Medium (10 < N ≤ 100):** show top 10 by relevant metric (weight, P&L magnitude, dividend amount, trade count); aggregate the rest as «Other (N items, X%)» with a click-through to a paginated drilldown. The aggregate slice must show its own count + total so the user knows what's hidden.
- **Large (N > 100):** show top 5–7; aggregate the rest as «Other (N items, X%)»; offer a sort/filter drawer for power-users to find specific positions. Default chat answer mentions only top-3-by-relevance + «and N more — say "show all" to expand».

The «top-N» metric varies by chart context (weight for allocation, gain magnitude for P&L attribution, payment date for dividend calendar). The «N» chosen is per-chart but should match the visual density the chart can support without losing legibility at 320px viewport (mobile-first constraint per `web/performance.md`).

### 2.2 Pagination + drilldown affordances

Every aggregated «Other» bucket must be expandable. Drill-down behavior:

- **Inline expand** (preferred when N ≤ 30 hidden items): a click on «Other» reveals a virtualized table inline below the chart. No page navigation.
- **New chat turn** (when N > 30 or when drill-down requires a different chart type): Provedo answers in a new turn with the requested view («Show me all 47 positions in Other» → new table-style answer).
- **Side drawer** (V2): a side drawer with full sortable / filterable holdings table for power-users. Out of MVP scope but flagged so backend contract anticipates.

### 2.3 Empty-state and insufficient-data fallbacks

Every chart needs a defined fallback for users who don't yet have the data the chart requires:

- **No connected broker:** suppress the chart entirely; chat answer redirects to onboarding step («Connect a broker so Provedo can read your positions»).
- **Connected but <30 days history:** charts requiring time-series (sparkline, drawdown, behavioral patterns) show a placeholder with «Provedo needs ~30 days of history to surface this. Currently has [N] days.» Coach surface specifically requires this gate per `STRATEGIC_OPTIONS_v1.md` §Option 4 risk note.
- **Single position only:** allocation charts collapse to a labeled badge («100% AAPL — Provedo can compare against benchmarks once you have a second position»).
- **No realized trades:** tax / realized-gain charts suppress with «No realized gains/losses in this period.»
- **No dividends paid in period:** dividend calendar shows the empty grid with a «No dividends scheduled / received in [period]» note rather than nothing.

### 2.4 Mobile vs desktop responsive behavior

Per `web/testing.md` breakpoints (320 / 768 / 1024 / 1440):

- **320px (mobile):** charts collapse to single-column; legends move below chart; tooltip becomes tap-to-reveal. Maximum 7 visible categories before forced «Other» aggregation regardless of total N.
- **768px (tablet):** standard layouts; up to 10 visible categories.
- **1024px+ (desktop):** full layouts; up to 12 visible categories before aggregation; secondary axes (e.g., dual currency overlay) become legible.

### 2.5 Performance budget per chart

Inline SVG (the established pattern from `charts/*.tsx`) is preferred for charts with ≤200 data points. Beyond 200 points, downsample (LTTB algorithm or simple aggregation) before rendering rather than ship a heavier canvas/WebGL chart in a chat answer. The chat-answer surface is conversational; if the user needs a 10,000-point intraday tick chart, that's a dedicated drilldown surface (V2), not a chat-inline component.

---

## Section 3 — The catalog

50 entries grouped A–I. Each entry follows the format defined in the dispatch brief.

Field shorthand:
- **Triggers:** example user questions that yield this component
- **Lane A category:** Information / Observation / Pattern / Comparison / Tax / Educational / Event / Citation / Meta
- **Data shape:** TypeScript-style contract (illustrative, not normative — backend defines final shape)
- **Viz hint:** one-line hint for product-designer; not a full visual spec
- **Scaling:** small / medium / large behavior
- **Annotations:** Lane A guardrails on labels
- **Sources:** what citation must accompany
- **Fallback:** insufficient-data behavior
- **Frequency:** how often this appears across chat answers
- **Status:** MVP / V2

---

### Bucket A — Performance & P&L (8 entries)

#### A1. Portfolio P&L sparkline

- **Triggers:** «How am I doing?» / «What's my YTD?» / «Why is my portfolio down this month?» (the locked hero example)
- **Lane A category:** Observation
- **Data shape:** `{ period: 'WTD'|'MTD'|'YTD'|'1Y'|'ALL', points: { date: ISO, value: number, currency: 'USD'|... }[], deltaAbs: number, deltaPct: number, asOf: ISO }`
- **Viz hint:** ultra-thin line with single end-label highlighting current value + delta token; optional dotted baseline at start-of-period; matches existing `PnlSparkline.tsx` shape
- **Scaling:** time-density downsample (252 points max for 1Y; LTTB to 60 points if needed for sparkline width); same component for 2 holdings or 1000 (it's portfolio-level aggregate)
- **Annotations:** delta token uses `var(--provedo-negative)` red or `--provedo-positive` green; no «good/bad» wording; period label mandatory
- **Sources:** `Source: aggregated holdings via [broker list] · last sync [timestamp]`
- **Fallback:** if <7 days history → show flat baseline + «Provedo has [N] days of history; sparkline appears after 7 days»
- **Frequency:** **HIGH** — appears in most «how am I doing» style answers, and as a sub-element in many other answers
- **Status:** MVP (already shipped, see `PnlSparkline.tsx`)

#### A2. Per-position P&L card / row

- **Triggers:** «How is AAPL doing?» / «What are my biggest gainers/losers?» / drill-down from A1
- **Lane A category:** Observation
- **Data shape:** `{ ticker, name, currentPrice, costBasisAvg, gainAbs, gainPct, position: { qty, currency }, asOf: ISO, brokerSource: string }`
- **Viz hint:** position-pill (see I2) + delta token + miniature sparkline (60×16px) + cost-basis line below
- **Scaling:** single position = card view; multiple = stacked rows; >10 = top-10-by-magnitude + «Other (N more)»; >100 = paginated table mode
- **Annotations:** «since position opened» or explicit period; no «target price» / «fair value» fields
- **Sources:** `Source: [broker] holdings + [price source] · [timestamp]`
- **Fallback:** if position closed within period, show «closed YYYY-MM-DD at $X (realized $Y)»
- **Frequency:** **HIGH** — appears in any per-ticker question
- **Status:** MVP

#### A2b. Per-position price history (candlestick OR line) — NEW v1.1

- **Triggers:** «Show me AAPL price history» / «How has TSLA moved over the last year?» (**reconciles with PD chart-type 6 «Candlestick — price history»**)
- **Lane A category:** Observation
- **Data shape (candlestick):** `{ ticker, candles: { date: ISO, open, high, low, close, volume?: number }[], period, currency }`
- **Data shape (line variant):** `{ ticker, points: { date: ISO, close }[], period, currency }`
- **Viz hint:** **Default = line variant** (cleaner for chat-inline at 320–768px; matches Lane A's narrative-friendly mode). Candlestick variant available on power-user explicit request («show me candles») or in a dedicated drill-down surface — NOT in default chat answers. Position's own trade markers (D2 lots) overlaid as dots if user asks for combined view.
- **Scaling:** intraday (≤390 candles per session): full; daily 1Y (252 candles): full; multi-year: aggregate to weekly/monthly candles
- **Annotations:** **CRITICAL Lane A guardrail** — price history charts are the highest-risk visual surface in the catalog. They are visually indistinguishable from broker / TradingView trading-app charts and carry the strongest implicit «entry/exit» reading. MANDATORY guardrails: (a) NO buy/sell arrows / markers other than the user's own historical trades; (b) NO support / resistance lines; (c) NO trend lines / channels; (d) NO moving-average overlays in MVP (V2 only with explicit «historical observation» framing); (e) NO RSI / MACD / Bollinger / any technical-indicator overlay — these are advisor / trader-tool conventions that pull the chart into prescriptive territory; (f) caption «Historical price chart. Provedo describes the past; it does not annotate entry, exit, support, resistance, trend, or any technical signal.» mandatory; (g) candlestick variant additionally carries the line above as legend explainer.
- **Sources:** `Source: price history via [provider] · last update [timestamp] · OHLC from [exchange]`
- **Fallback:** new listing / IPO with <30 days history: collapse to current-price token; thinly-traded: warn about gappy data
- **Frequency:** **LOW-MEDIUM** — explicit ask; default surface is per-position card (A2), not full price chart. Note: power users frequently expect candlestick — providing the LINE default is a deliberate Lane A choice, not a power-user oversight.
- **Status:** MVP for **line variant**; **V2** for candlestick variant (legal-advisor sign-off recommended before shipping candlestick — even with guardrails, candlestick visual semantics carry trader-tool connotations that may push Lane A further than line)

#### A3. Period-attribution bar (which positions drove the move)

- **Triggers:** «Why is my portfolio down?» / «What drove the gain this week?» (the locked hero answer)
- **Lane A category:** Observation
- **Data shape:** `{ totalDeltaAbs: number, totalDeltaPct: number, contributors: { ticker, name, contributionAbs: number, contributionPct: number }[], period: { from: ISO, to: ISO } }`
- **Viz hint:** horizontal stacked bar with positive (green) and negative (red) contributions; top-3 contributors labeled; «Other» segment for the tail; matches narrative pattern of hero answer («62% of the drawdown is two positions: Apple, Tesla»)
- **Scaling:** small (N ≤ 5): every contributor labeled; medium: top 5 + «Other (N more)»; large: top 5 + «Other»
- **Annotations:** percent-of-total-move framing; no «underperformer» / «winner» normative tags
- **Sources:** `Source: position-level returns from [broker] holdings + [price source]`
- **Fallback:** if portfolio flat (delta ≈ 0): «Roughly flat this period; no single position drove >2%.»
- **Frequency:** **HIGH** — paired with A1 in most «why» answers
- **Status:** MVP

#### A4. Benchmark comparison line chart (P&L vs S&P 500 / sector ETF)

- **Triggers:** «Am I beating the market?» / «How am I doing vs S&P?» (note: «beating the market» framing is user-asked; Provedo answer must NOT adopt the «beat» framing — see §1.5)
- **Lane A category:** Comparison
- **Data shape:** `{ portfolio: { date, normalizedValue }[], benchmarks: { name, ticker: 'SPY'|'VTI'|..., source: string, points: { date, normalizedValue }[] }[], period }` — both lines normalized to 100 at start
- **Viz hint:** two lines, portfolio in `--provedo-accent`, benchmark in muted gray; end-labels on both; single source-line below; no «outperformance gap» shading or normative annotation
- **Scaling:** independent of portfolio size (always single aggregate line vs single benchmark line); user can toggle benchmark from a small list
- **Annotations:** «portfolio total return (incl. dividends)» vs «benchmark total return (incl. dividends)» — must match comparison method; «period: from / to» mandatory
- **Sources:** `Source: holdings via [broker] + benchmark prices via [provider] · methodology: [link to total-return calculation]`
- **Fallback:** if portfolio history < benchmark availability period, normalize from later date; explicit note about period mismatch
- **Frequency:** **MEDIUM** — appears when user asks comparison; not unprompted
- **Status:** MVP

#### A5. Drawdown chart (underwater curve)

- **Triggers:** «What was my worst drawdown?» / «How much did I lose in [event]?»
- **Lane A category:** Observation (historical) / Educational
- **Data shape:** `{ points: { date, drawdownPct: number /* always ≤0 */, peakValue: number, currentValue: number }[], maxDD: { startDate, troughDate, recoveryDate?, magnitudePct }, period }`
- **Viz hint:** filled area below zero baseline (red gradient), thin line; max-drawdown trough explicitly labeled; recovery date marker if recovered; «still in drawdown» badge if not
- **Scaling:** portfolio-level chart (independent of N positions); time-density downsample as in A1
- **Annotations:** «Drawdown = peak-to-trough decline as % of peak» mini-explainer in tooltip; «max drawdown over [period]» label; NO normative «severe / moderate» tags
- **Sources:** `Source: aggregated holdings · drawdown calc per CFA Institute Portfolio Mgmt definition`
- **Fallback:** if history <90 days, suppress chart with «Provedo needs ~90 days of history to surface meaningful drawdown patterns»
- **Frequency:** **LOW** — only when explicitly asked or in educational context
- **Status:** MVP

#### A6. Volatility cone (historical envelope)

- **Triggers:** «How volatile is my portfolio?» / «What's a normal range for my returns?»
- **Lane A category:** Observation / Educational
- **Data shape:** `{ rollingWindowDays: number, percentiles: { date, p5, p25, p50, p75, p95 }[], realizedPath: { date, value }[], asOf }`
- **Viz hint:** envelope shading (lightest p5–p95, mid p25–p75), median line, actual portfolio path overlaid; legend explains percentiles
- **Scaling:** portfolio-level; same regardless of N positions
- **Annotations:** «Historical envelope based on rolling [N]-day windows over [period]» — explicitly historical, NOT predictive; no «forecast» / «expected range» language
- **Sources:** `Source: portfolio rolling returns calculated from holdings via [broker]`
- **Fallback:** if history <180 days, suppress with «Provedo needs ~6 months of history for volatility cones»
- **Frequency:** **LOW** — power-user / explicit ask
- **Status:** **V2** (post-MVP — adds compute complexity)

#### A7. Realized-vs-unrealized P&L split

- **Triggers:** «What have I actually made vs paper gains?» / tax-context questions
- **Lane A category:** Observation / Tax-adjacent
- **Data shape:** `{ realized: { ytd: number, allTime: number, currency }, unrealized: { current: number, currency }, asOf, taxYearEnd: ISO }`
- **Viz hint:** two-stat composition (realized vs unrealized) as side-by-side number pair with mini-bar showing relative size; tax-year reset date noted
- **Scaling:** portfolio-level aggregate; single component
- **Annotations:** «Realized = closed positions, taxable. Unrealized = open positions, paper» mini-explainer; jurisdiction-aware tax-year boundary
- **Sources:** `Source: closed positions via [broker] · tax-year boundary per [jurisdiction]`
- **Fallback:** if no closed trades: «No realized gains/losses [this year / since you connected].»
- **Frequency:** **MEDIUM** — common in financial-planning questions
- **Status:** MVP

#### A8. Cumulative cash-on-cash return curve

- **Triggers:** «What's my actual return on cash invested?»
- **Lane A category:** Observation
- **Data shape:** `{ cashFlows: { date, deposit?: number, withdrawal?: number }[], values: { date, portfolioValue }[], twrPct: number, mwrPct: number, asOf }`
- **Viz hint:** dual-axis showing cumulative deposits (stepped line) and portfolio value (smooth line); endpoint labels for TWR (time-weighted) and MWR (money-weighted) returns
- **Scaling:** portfolio-level; same regardless of N
- **Annotations:** «TWR isolates investment performance; MWR includes timing of your deposits» mini-explainer; both formulas cited
- **Sources:** `Source: cash flows + holdings via [broker] · TWR per CFA Institute GIPS standard`
- **Fallback:** if <2 deposit events, suppress MWR with «MWR needs ≥2 cash-flow events»
- **Frequency:** **LOW** — power-user / serious-tracker question
- **Status:** **V2**

#### A9. Portfolio value area chart (cumulative gain shading) — NEW v1.1

- **Triggers:** «Show me my portfolio over time» / «How has my net worth grown?» (**reconciles with PD chart-type 2 «Area — cumulative gains»**)
- **Lane A category:** Observation
- **Data shape:** `{ points: { date: ISO, totalValue: number, currency }[], cumulativeDepositAbs: number, cumulativeGainAbs: number, period }` — same data as A1/A8 but rendered as filled area below the curve to make cumulative gain (vs deposits baseline) visually salient
- **Viz hint:** smooth line with filled area between line and a deposits-baseline; gain area uses `--provedo-positive` at low opacity, loss area uses `--provedo-negative`; matches PD's «Area — cumulative gains» chart-type-2
- **Scaling:** portfolio-level; LTTB downsample to ≤200 points for chat-inline; full resolution in dashboard surface (per `DASHBOARD_ARCHITECTURE.md` portfolio chart slot)
- **Annotations:** caption «area shows cumulative gain above deposits baseline»; period label mandatory; NO «good year / bad year» tags
- **Sources:** `Source: aggregated holdings + cash flows via [broker list] · last sync [timestamp]`
- **Fallback:** if <30 days history, fallback to A1 sparkline; if no deposit events recorded, suppress baseline (single-line variant)
- **Frequency:** **HIGH** in dashboard surface (per architecture spec); **MEDIUM** in chat answers (chat usually prefers tighter A1 sparkline)
- **Status:** MVP (added 2026-04-27 to reconcile with PD chart-type 2)

#### A10. Stacked-area chart — account contribution to portfolio over time — NEW v1.1

- **Triggers:** «How has each broker contributed to my portfolio over time?» / «Which account grew the most?» (**reconciles with PD chart-type 2 «Area — stacked accounts»**)
- **Lane A category:** Observation
- **Data shape:** `{ points: { date: ISO, byAccount: { broker, accountLabel?, valueAbs }[] }[], baseCurrency, period, asOf }`
- **Viz hint:** stacked area chart, one band per broker/account; consistent ordering (largest at bottom or top — PD choice for visual stability); legend below
- **Scaling:** small (1–4 accounts, the common multi-broker prosumer case): all bands; medium (5–10): all bands with consolidation of <5%-of-current accounts into «Other»; mobile collapses to top-3 + Other regardless
- **Annotations:** «Cumulative value contribution per account; FX rates as of [timestamp] for cross-currency aggregation» mandatory if multi-currency; NO «top performer / laggard» tags
- **Sources:** `Source: holdings via [broker list] · per-broker timestamps · FX via [provider]`
- **Fallback:** single account: suppress, redirect to A9 portfolio area chart
- **Frequency:** **MEDIUM** — common Scattered Optimiser ICP question
- **Status:** MVP (added 2026-04-27 — multi-broker is core ICP A scenario; deserves first-class chart)

---

### Bucket B — Allocation & Exposure (7 entries)

#### B1. Sector breakdown (current state)

- **Triggers:** «What sectors am I in?» / «Show me my allocation»
- **Lane A category:** Observation
- **Data shape:** `{ sectors: { name: string, weightPct: number, valueAbs: number, currency, positions: { ticker, weightPct }[] }[], asOf, classificationStandard: 'GICS'|'ICB' }`
- **Viz hint:** horizontal stacked bar OR donut (PD choice); position drilldown on sector click; matches `AllocationPieBar.tsx` family
- **Scaling:** small (≤7 sectors): show all; medium (8–11 GICS sectors): show all (GICS has 11); large (sub-industries, 100+): top-7 + «Other»; mobile collapses to top-5 + Other
- **Annotations:** «Classification: GICS sectors» — explicit standard; no «over-/under-weighted» language without sourced benchmark
- **Sources:** `Source: holdings via [broker] + [classification source: e.g., S&P Capital IQ / FT Russell ICB]`
- **Fallback:** single position: collapse to single sector badge
- **Frequency:** **HIGH** — common in any «what do I own» style question
- **Status:** MVP (shipped variant)

#### B2. Sector-vs-benchmark comparison bars

- **Triggers:** «How does my tech allocation compare?» / drill-down from B1
- **Lane A category:** Comparison
- **Data shape:** `{ portfolio: { sector, weightPct }[], benchmark: { name: 'S&P 500'|..., source: string, sectors: { sector, weightPct }[], asOf: ISO }, deltas: { sector, deltaPct }[] }`
- **Viz hint:** two horizontal bars on shared scale per sector; matches shipped `AllocationPieBar.tsx`; highlight one sector at a time per chat-answer focus
- **Scaling:** show only sectors with non-trivial delta (|delta| > 2pp by default); GICS 11-sector cap; mobile shows top 3 deltas
- **Annotations:** «vs [benchmark name] · [benchmark date]»; absolute pp delta in mono token; NO «over-/under-weight» normative language
- **Sources:** **MANDATORY** benchmark citation (e.g., «S&P 500 sector weights per S&P DJI methodology Q3 2025»). If benchmark not in `BENCHMARKS_SOURCED.md`, DO NOT SHIP.
- **Fallback:** if benchmark stale (>6 months), show staleness warning
- **Frequency:** **MEDIUM** — appears in «am I diversified» style answers
- **Status:** MVP (shipped)

#### B3. Geography / country exposure breakdown

- **Triggers:** «What countries am I in?» / «How much is US vs international?»
- **Lane A category:** Observation
- **Data shape:** `{ countries: { iso2: string, name, weightPct, valueAbs }[], regions: { name: 'NA'|'EU'|'APAC'|..., weightPct }[], asOf, methodology: 'domicile'|'revenue-weighted' }`
- **Viz hint:** horizontal bars OR small choropleth (PD choice); regional aggregate above country detail
- **Scaling:** small: every country; medium: top-7 + «Other (N more)»; large: top-5 + Other
- **Annotations:** **CRITICAL** — methodology label mandatory («domicile» = where listed; «revenue-weighted» = where revenue earned). These give very different answers; ambiguity = misleading.
- **Sources:** `Source: holdings via [broker] + country classification per [provider methodology]`
- **Fallback:** if all single-country: collapse to single badge
- **Frequency:** **MEDIUM**
- **Status:** MVP

#### B4. Asset-class breakdown (equity / fixed income / cash / crypto / other)

- **Triggers:** «What's my asset mix?» / «How much cash am I holding?»
- **Lane A category:** Observation
- **Data shape:** `{ assetClasses: { class: 'equity'|'fixed_income'|'cash'|'crypto'|'commodity'|'real_estate'|'other', weightPct, valueAbs, currency }[], asOf }`
- **Viz hint:** horizontal stacked bar, single row, clearly labeled segments
- **Scaling:** typically ≤7 classes; no aggregation needed; mobile-friendly inherently
- **Annotations:** asset-class definitions implied by canonical labels; no «aggressive/conservative» normative tags
- **Sources:** `Source: holdings via [broker] · classification per [provider]`
- **Fallback:** equity-only portfolio: collapse to «100% equity» badge with B1 sector drilldown
- **Frequency:** **MEDIUM**
- **Status:** MVP

#### B5. Currency exposure breakdown

- **Triggers:** «How much of my portfolio is in EUR?» / «What's my FX exposure?»
- **Lane A category:** Observation
- **Data shape:** `{ currencies: { iso: 'USD'|'EUR'|..., weightPct, valueAbsInBase, baseCurrency }[], fxRatesAsOf: ISO, baseCurrency }`
- **Viz hint:** horizontal bars; base currency pinned to top; FX rate timestamp below
- **Scaling:** small (≤5 currencies): all; medium (5–15): top-5 + «Other»; rarely larger
- **Annotations:** «Reported in [base currency]; FX rates as of [timestamp]»; rate provider cited
- **Sources:** `Source: holdings via [broker] · FX rates via [ECB / Fed / provider] · [timestamp]`
- **Fallback:** single-currency portfolio: suppress chart with «100% [currency] — no FX exposure tracked»
- **Frequency:** **MEDIUM** for multi-currency users; LOW for US-only
- **Status:** MVP

#### B6. Concentration metrics — Top-N as % of portfolio

- **Triggers:** «How concentrated am I?» / «What's my biggest position?»
- **Lane A category:** Observation
- **Data shape:** `{ top1Pct, top3Pct, top5Pct, top10Pct, hhi: number, totalPositions: number, asOf }`
- **Viz hint:** stat strip showing top-1 / top-3 / top-5 / top-10 percent of total + HHI value; no gauge / speedometer
- **Scaling:** independent of N; always shows the same set of summary stats; if N < requested top, show available («top 5 = top 3 — only 3 positions»)
- **Annotations:** HHI definition + threshold convention available in tooltip («<1500 low, 1500–2500 moderate, >2500 high per antitrust convention adapted to portfolio theory»); thresholds shown as factual conventions, NOT as «you should rebalance» framing
- **Sources:** `Source: holdings via [broker] · HHI per Herfindahl 1950 / FINRA investor education`
- **Fallback:** single position: «100% in [ticker] — concentration metrics meaningful with ≥2 positions»
- **Frequency:** **MEDIUM** — common in «how diversified» style answers
- **Status:** MVP

#### B7. Account / broker split (horizontal bars + stacked-bar variant) — REVISED v1.1

- **Triggers:** «How much is in my Schwab account?» / «What's the split across my brokers?» (**reconciles with PD chart-type 7 «Stacked bar — broker contribution»**)
- **Lane A category:** Observation
- **Data shape:** `{ accounts: { broker: string, accountLabel?: string, weightPct, valueAbs, currency, positionCount: number, byAssetClass?: { class, valueAbs }[] }[], asOf }`
- **Viz hint:** **two variants** — (a) horizontal bars per account (existing); (b) **stacked-bar variant** (added v1.1 to align with PD chart-type 7): single bar per broker, segments = asset classes within that broker, OR single bar per account with segments = top positions. PD chooses variant per chat-answer context.
- **Scaling:** small (1–4 accounts, the common case): show all; medium (5–10): show all; rarely larger; stacked variant inherits asset-class scaling from B4
- **Annotations:** account-label support for users with multiple accounts at one broker («Schwab Brokerage» vs «Schwab Roth IRA»); stacked variant requires legend explaining segment dimension
- **Sources:** `Source: holdings via [broker list] · last sync [per-broker timestamps]`
- **Fallback:** single account: collapse to single badge
- **Frequency:** **MEDIUM** — multi-broker millennials (ICP A — Scattered Optimiser) ask this often; stacked variant especially relevant for «is one account too tech-heavy?» style questions
- **Status:** MVP

#### B8. Position-drift bar (period-over-period weight change) — NEW v1.1

- **Triggers:** «How has my allocation drifted?» / «What's changed in my portfolio?» (**reconciles with PD chart-type 3 «Bar — drift per position»**)
- **Lane A category:** Observation / Comparison
- **Data shape:** `{ positions: { ticker, weightPctNow, weightPctPrior, deltaPp: number, valueChangeAbs }[], priorDate: ISO, currentDate: ISO, period: 'WTD'|'MTD'|'QTD'|'YTD'|'1Y'|custom }`
- **Viz hint:** diverging horizontal bars centered on zero; positive drift to right (`--provedo-accent` muted), negative to left (gray); top-N by absolute drift magnitude; matches PD «Bar — drift per position» chart-type-3
- **Scaling:** small (≤10 positions): all positions; medium: top-10-by-|delta|; large: top-10-by-|delta| + «N more positions with smaller drift»
- **Annotations:** **CRITICAL Lane A guardrail** — caption «Drift = change in weight from [priorDate] to [currentDate], driven by price moves and any trades. Provedo describes drift; it does not mark drift as good/bad or recommend rebalancing.» — MANDATORY. NO «target weight» comparison (target weight implies prescription). Drift is purely period-over-period factual change.
- **Sources:** `Source: holdings via [broker] at [priorDate] vs [currentDate]`
- **Fallback:** if <30 days of history at prior anchor: «Provedo needs ~30 days of history to surface drift; currently has [N] days.»; single position: suppress
- **Frequency:** **MEDIUM** — anchor of «what changed» chat answers + Insights digest
- **Status:** MVP (Lane A treatment must pass content-lead review before mockup)

#### B9. Concentration treemap — NEW v1.1

- **Triggers:** «Show me my portfolio at a glance» / «What dominates my portfolio?»
- **Lane A category:** Observation
- **Data shape:** `{ tiles: { ticker, name, weightPct, valueAbs, sector?, dailyChangePct? }[], asOf, baseCurrency }`
- **Viz hint:** treemap rectangles sized by `weightPct`; optional second-channel encoding via daily-change color (positive = `--provedo-positive` muted, negative = `--provedo-negative` muted); ticker + weight label in each tile that exceeds 4% of total area; smaller tiles unlabeled
- **Scaling:** small (≤20): all tiles labeled; medium (20–100): top-20 + «Other» tile; large (>100): top-30 + «Other»; mobile collapses to top-12 + «Other»
- **Annotations:** caption «Tile size = % of portfolio; color = today's price change. Treemap describes proportions; concentration thresholds are factual conventions per FINRA, not Provedo recommendations.»
- **Sources:** `Source: holdings via [broker] · price changes via [provider]`
- **Fallback:** single position: suppress, redirect to A2 position card
- **Frequency:** **LOW-MEDIUM** — common request from prosumer ICP; pairs with B6 concentration stats
- **Status:** MVP (extends F1 heatmap into a more standard finance treemap; F1 stays as alt visualization)

---

### Bucket C — Income & Cash Flow (5 entries)

#### C1. Dividend calendar (received + scheduled)

- **Triggers:** «When are my dividends?» / «How much in dividends this month?»
- **Lane A category:** Event / Observation
- **Data shape:** `{ events: { ticker, exDate: ISO, payDate: ISO, amountPerShare, currency, expectedAmount, status: 'scheduled'|'received'|'announced' }[], periodStart: ISO, periodEnd: ISO, totalScheduled, totalReceived }`
- **Viz hint:** matches shipped `DividendCalendar.tsx` — month grid with payment markers + total badge; ticker chips on each marker
- **Scaling:** small (≤10 events / period): inline calendar; medium (10–30): summarized monthly totals + click to expand day; large (>30 = bond-portfolio): aggregate by ticker, list view
- **Annotations:** «Scheduled (broker-confirmed)» vs «Announced (issuer press release, broker not yet updated)» status legend; «expected» tag for unconfirmed
- **Sources:** `Source: dividend events via [broker corporate-actions feed] + [issuer press release date if relevant]`
- **Fallback:** no dividends in period: empty calendar with «No dividends scheduled / received in [period]» note
- **Frequency:** **MEDIUM-HIGH** — anchor of weekly Insights digest, common chat ask
- **Status:** MVP (shipped)

#### C2. Dividend history per position (yield + payments timeline)

- **Triggers:** «How much has KO paid me?» / «What's my dividend yield from VYM?»
- **Lane A category:** Observation
- **Data shape:** `{ ticker, payments: { payDate, amount, dpsAtPay }[], cumulativeReceived, currentYieldPct, yieldOnCostPct, asOf }`
- **Viz hint:** small bar chart of payments by quarter + two stat tokens (current yield, yield-on-cost)
- **Scaling:** per-position component; chart depth bounded by holding period
- **Annotations:** **CRITICAL** — distinguish «current yield» (DPS / current price) from «yield on cost» (DPS / your cost basis); both reported with formula tooltip; no «high yield» normative tag
- **Sources:** `Source: dividend events via [broker] · cost basis from your trade history`
- **Fallback:** if no dividends paid by ticker: «[Ticker] has not paid dividends in your holding period»
- **Frequency:** **MEDIUM**
- **Status:** MVP

#### C3. Dividend yield breakdown (portfolio-level)

- **Triggers:** «What's my portfolio yield?»
- **Lane A category:** Observation
- **Data shape:** `{ portfolioYieldPct, yieldOnCostPct, contributors: { ticker, contribToYieldPct, weightPct, dividendYieldPct }[], asOf }`
- **Viz hint:** stat token + horizontal contributor bars («tickers driving X% of portfolio yield»); benchmark line for S&P 500 yield optional
- **Scaling:** small: show all; medium: top-7 contributors + «Other»; large: top-5 + «Other»
- **Annotations:** comparison to S&P 500 yield (~1.3% per `BENCHMARKS_SOURCED.md` row 9) optional; if shown, MUST cite
- **Sources:** `Source: portfolio-weighted yield from holdings · S&P 500 yield per FRED + S&P DJI methodology` (if benchmark shown)
- **Fallback:** zero-dividend portfolio: «Your portfolio yield is 0% — no dividend-paying positions»
- **Frequency:** **LOW** — power-user / income-focused investor
- **Status:** MVP

#### C4. Bond coupon / interest schedule

- **Triggers:** «When do my bonds pay?» / «What's my interest income next month?»
- **Lane A category:** Event / Observation
- **Data shape:** `{ events: { instrument, isin?, couponDate, couponAmount, frequency, currency, accrualBasis: '30/360'|'ACT/365'|'ACT/ACT' }[], totalUpcoming, periodStart, periodEnd }`
- **Viz hint:** calendar variant of C1, but bond-flavored: ISIN labels, accrual-basis tooltip
- **Scaling:** small portfolios rarely have bonds; large bond portfolios → list-view with month grouping
- **Annotations:** «Coupon = bond interest payment» mini-explainer; accrual basis shown for transparency
- **Sources:** `Source: bond holdings via [broker] · coupon schedule from issuance terms`
- **Fallback:** no bonds held: suppress entirely
- **Frequency:** **LOW** — fixed-income holders only
- **Status:** **V2** (bond support deferred from MVP per current product scope)

#### C5. Cash balance + cash flow timeline

- **Triggers:** «How much cash do I have?» / «When did I deposit money?»
- **Lane A category:** Observation
- **Data shape:** `{ currentCashByCurrency: { currency, amount }[], cashFlows: { date, type: 'deposit'|'withdrawal'|'dividend'|'interest', amount, currency, label? }[], periodStart, periodEnd }`
- **Viz hint:** stat strip (current cash by currency) + chronological timeline of flows below; flows colored by type (deposit / withdrawal / income)
- **Scaling:** small: every flow listed; medium: aggregate by month; large: aggregate by quarter + drill-down
- **Annotations:** explicit currency per balance and per flow; no «cash drag» normative framing without sourced inflation comparison
- **Sources:** `Source: cash balances + transactions via [broker]`
- **Fallback:** zero cash: «No cash held across connected brokers»
- **Frequency:** **MEDIUM** — common in financial-planning questions
- **Status:** MVP

#### C6. Cash-flow waterfall (deposits + dividends + price moves → current value) — NEW v1.1

- **Triggers:** «Where did my portfolio value come from?» / «How much of my growth is deposits vs gains vs dividends?»
- **Lane A category:** Observation / Educational
- **Data shape:** `{ startValue: number, components: { label: 'deposits'|'withdrawals'|'realized_gains'|'unrealized_gains'|'dividends_received'|'interest'|'fx_effects', deltaAbs: number }[], endValue: number, period, currency }`
- **Viz hint:** classic waterfall chart; each component labeled with positive/negative bar; baseline starts at startValue, ends at endValue; floating bars show contribution of each component
- **Scaling:** typically 5–8 components; fixed taxonomy (deposits, withdrawals, realized, unrealized, dividends, interest, fees, FX); single component
- **Annotations:** caption «Decomposes change in portfolio value into mechanical components: cash you added, gains your positions made, dividends and interest received, FX effects. Does not predict future contributions.»; per-jurisdiction tax-treatment differences NOT shown here (escalate to E1/E2 if tax context)
- **Sources:** `Source: cash flows + holdings + dividend events via [broker] · FX rates via [provider]`
- **Fallback:** if <30 days history: suppress with reason; single-period (no prior anchor): suppress
- **Frequency:** **LOW-MEDIUM** — common quarterly / annual review question; anchor of «year in review» Insights
- **Status:** MVP

---

### Bucket D — Patterns & History (6 entries)

#### D1. Trade timeline

- **Triggers:** «Show me my trades» / «When did I buy AAPL?»
- **Lane A category:** Observation (historical)
- **Data shape:** `{ trades: { tradeId, date: ISO, ticker, side: 'buy'|'sell', qty, price, value, currency, broker }[], periodStart, periodEnd, totalCount }`
- **Viz hint:** chronological row-list with side-coded chips; matches shipped `TradeTimeline.tsx`
- **Scaling:** small (<20 trades): show all; medium: top-20-by-recency + «Show N earlier»; large (>200): paginated, default last 30 days
- **Annotations:** explicit broker source per trade; no «mistake» / «well-timed» normative tags
- **Sources:** `Source: transactions via [broker] · last sync [timestamp]`
- **Fallback:** no trades in period: «No trades in [period]»
- **Frequency:** **MEDIUM** — explicit asks; also building block for D3/D4 Coach
- **Status:** MVP (shipped)

#### D2. Position-history detail (entry/exit/holds for one ticker)

- **Triggers:** «What's my history with TSLA?» / drill-down from A2
- **Lane A category:** Observation (historical)
- **Data shape:** `{ ticker, lots: { openedDate, closedDate?, qty, costBasis, currentPrice?, realizedAbs?, status: 'open'|'closed' }[], firstOpened: ISO, currentQty, currentValue }`
- **Viz hint:** lot-strip showing each lot with open/close dates; price chart overlay with markers at each trade; lot count summary
- **Scaling:** small (<10 lots): full detail; medium: aggregate same-day lots; large: aggregate by month
- **Annotations:** lot-level detail mandatory for tax-aware users; FIFO/LIFO/specific-lot label per jurisdiction default
- **Sources:** `Source: transactions via [broker] · cost basis per [jurisdiction] default rule`
- **Fallback:** single-lot position: collapse to «Single lot opened [date], [qty] @ [price]»
- **Frequency:** **LOW-MEDIUM** — drill-down from per-position questions
- **Status:** MVP

#### D3. Win/loss pattern strip (Coach-surface, retrospective)

- **Triggers:** Coach proactive insight; «How well do I time my buys?» / «What's my hit rate?»
- **Lane A category:** Pattern
- **Data shape:** `{ closedRoundTrips: { ticker, openedDate, closedDate, holdingDays, outcomeAbs, outcomePct }[], hitRatePct, avgWinPct, avgLossPct, payoffRatio, sampleSize, period }`
- **Viz hint:** stat block + small win/loss histogram of outcomes; explicit sample size; **no** «improve your win rate» framing
- **Scaling:** small history (<10 trades): suppress with «Provedo needs ≥10 closed round-trips for hit-rate patterns»; medium: full stats; large: paginated drill-down to underlying trades
- **Annotations:** **CRITICAL** — «Retrospective observation of your closed positions. Past patterns do not predict future outcomes.» — mandatory caption per Lane A; sample-size disclosure mandatory; NO «good» / «poor» tags on hit rate
- **Sources:** `Source: your closed positions via [broker] · pattern observation per Barber & Odean (2000) framework — DOI 10.1111/0022-1082.00226` (citation pattern, not implying user is a Barber-Odean subject)
- **Fallback:** insufficient closed trades: suppress
- **Frequency:** **LOW** — Coach surface, day-30+ only
- **Status:** MVP (Coach surface part of locked Option 4 scope)

#### D4. Behavioral observation card («you sold AAPL 3x within 7 days of local low»)

- **Triggers:** Coach proactive; user-initiated «what patterns do I have?»
- **Lane A category:** Pattern
- **Data shape:** `{ patternType: 'disposition_effect'|'recency_bias'|'momentum_chase'|'gain_letting'|..., descriptionTemplate: string, instances: { ticker, eventDate, contextDate, contextLabel }[], sampleSize, definitionRef: string }`
- **Viz hint:** narrative card with embedded mini-chart showing the instances on a price-time axis; pattern definition in expandable; matches the «Provedo notices» preamble pattern
- **Scaling:** show top-3 instances + «N more»; multiple patterns paginated
- **Annotations:** **CRITICAL** — every pattern card MUST cite the pattern definition (e.g., «disposition effect per Shefrin & Statman 1985»); MUST be framed as observation, NOT as «stop doing this» — see `BRAND.md` §6.5; explicit «without judgment» voice register
- **Sources:** `Source: your trade history via [broker] · pattern definition per [academic citation]`
- **Fallback:** insufficient pattern instances (<3): suppress
- **Frequency:** **LOW** — Coach surface, day-30+ only
- **Status:** MVP

#### D5. Cost-basis evolution per position

- **Triggers:** «How has my cost basis changed?» / tax-prep context
- **Lane A category:** Tax / Observation
- **Data shape:** `{ ticker, costBasisHistory: { date, avgCostPerShare, totalCostBasis, qty }[], realizedEvents: { date, qtyClosed, methodApplied: 'FIFO'|'LIFO'|'specific' }[] }`
- **Viz hint:** stepped line chart of avg-cost over time with markers at lot adds and partial closes
- **Scaling:** small history: full detail; medium: aggregate by month; large: aggregate by quarter
- **Annotations:** «Method: [FIFO/LIFO/specific] per [jurisdiction default]» mandatory; UK Section 104 pool note for UK users
- **Sources:** `Source: transactions via [broker] · cost basis method per [IRS Pub 550 / HMRC / etc.]`
- **Fallback:** single-lot position: «Single lot — cost basis = [value] since [date]»
- **Frequency:** **LOW** — tax-prep / detailed analysis
- **Status:** **V2** (tax-detail surfaces are Pro-tier candidate per `PRICING_TIER_VALIDATION.md`)

#### D6. Trade-frequency heatmap (calendar-style)

- **Triggers:** «How often do I trade?» / Coach behavioral observation
- **Lane A category:** Pattern
- **Data shape:** `{ days: { date, tradeCount }[], periodStart, periodEnd, totalTrades, medianTradesPerWeek }`
- **Viz hint:** GitHub-contribution-style calendar heatmap with intensity = trade count; mono labels for peak weeks
- **Scaling:** independent of N positions; bounded by time window
- **Annotations:** «Frequency observation; no normative weight» — explicit; no «overtrading» tag
- **Sources:** `Source: transactions via [broker]`
- **Fallback:** <30 trades / period: collapse to summary stat
- **Frequency:** **LOW** — Coach / power-user
- **Status:** **V2**

---

### Bucket E — Tax & Regulatory (5 entries)

#### E1. Realized gains/losses YTD

- **Triggers:** «What are my realized gains this year?» / tax-prep context
- **Lane A category:** Tax / Observation
- **Data shape:** `{ realizedShortTerm: number, realizedLongTerm: number, currency, byPosition: { ticker, realizedAbs, holdingPeriodDays, classification: 'short'|'long' }[], taxYearStart, taxYearEnd, jurisdiction }`
- **Viz hint:** two-stat summary (short-term / long-term) + sortable table of contributing positions
- **Scaling:** small: every position; medium: top-10 by magnitude + «Other»; large: top-10 + paginated
- **Annotations:** **CRITICAL** — jurisdiction label mandatory; short/long-term threshold per jurisdiction (US ≥365 days = long-term); «Educational summary, not tax advice» disclaim chip mandatory; «Consult a tax professional» reference
- **Sources:** `Source: closed positions via [broker] · classification per [IRS Pub 550 / HMRC / etc.]`
- **Fallback:** no realized trades: «No realized gains/losses [tax year]»
- **Frequency:** **MEDIUM** — quarterly + tax-season spike
- **Status:** MVP (read-only summary; full tax export V2)

#### E2. Tax-lot composition (FIFO/LIFO/specific-lot views)

- **Triggers:** «What lots do I have for AAPL?» / tax-aware sale planning context
- **Lane A category:** Tax / Observation
- **Data shape:** `{ ticker, lots: { lotId, openedDate, qty, costBasis, currentValue, unrealizedAbs, holdingDays, classification: 'short'|'long' }[], defaultMethod: 'FIFO'|'LIFO'|'specific', jurisdiction }`
- **Viz hint:** sortable lot table with classification chips (short / long); cost-basis method note
- **Scaling:** small (<10 lots): full table; medium: paginated; large: virtualized
- **Annotations:** «Provedo shows your lots; what to sell is your decision (or your tax advisor's)» — explicit Lane A frame; jurisdiction-specific method note
- **Sources:** `Source: transactions via [broker] · lots per [jurisdiction default]`
- **Fallback:** single lot: collapse to «1 lot — [details]»
- **Frequency:** **LOW** — tax-aware power-users
- **Status:** **V2**

#### E3. Wash-sale flag list (US-specific, observation-only)

- **Triggers:** Coach proactive (US users only); «Did I trigger a wash sale?»
- **Lane A category:** Tax / Observation
- **Data shape:** `{ candidates: { sellTradeId, sellDate, ticker, lossAbs, repurchaseTradeId, repurchaseDate, daysApart }[], jurisdiction: 'US' }`
- **Viz hint:** flagged-candidate list with date pairs and gap visualization; **no** «to avoid this, do X» voicing
- **Scaling:** typically small list; full display
- **Annotations:** **CRITICAL** — «Wash-sale rule per IRS §1091. Provedo flags candidates based on trade dates. Final wash-sale determination is your broker's / tax advisor's. This is observation, not tax advice.» — explicit; jurisdiction-gated (US only)
- **Sources:** `Source: trades via [broker] · IRS §1091 definition (https://www.irs.gov/publications/p550)`
- **Fallback:** no candidates flagged: suppress; non-US jurisdiction: suppress entirely
- **Frequency:** **LOW** — US tax-season + Coach
- **Status:** **V2**

#### E4. Long-term vs short-term capital-gain split

- **Triggers:** drill-down from E1; tax-prep
- **Lane A category:** Tax / Observation
- **Data shape:** subset of E1 — same data, summary view
- **Viz hint:** two-bar comparison or donut split; tax-year boundary date noted
- **Scaling:** portfolio-level; single component
- **Annotations:** jurisdiction-specific threshold; tax-year boundary
- **Sources:** as E1
- **Fallback:** as E1
- **Frequency:** **LOW**
- **Status:** MVP (sub-component of E1)

#### E5. Estimated tax liability summary

- **Triggers:** «What might I owe in taxes?»
- **Lane A category:** Tax / Educational (BORDERLINE)
- **Data shape:** `{ realizedShortTerm, realizedLongTerm, jurisdiction, marginalRateAssumed?: number, estimatedLiability: number, currency }`
- **Viz hint:** stat block with assumed marginal rate clearly labeled as user-input
- **Scaling:** single component
- **Annotations:** **CRITICAL** — «Estimate based on your stated marginal rate. NOT tax advice. Actual liability depends on your full tax situation. Consult a tax professional.» — mandatory disclaim chip; PO + legal-advisor sign-off required before shipping this surface; user must input the marginal rate (Provedo does NOT infer)
- **Sources:** `Source: realized gains via [broker] · rate per your input · jurisdiction tax brackets per [IRS / HMRC / etc. published rates link]`
- **Fallback:** no realized: «No realized gains in [year] — no estimated liability»
- **Frequency:** **VERY LOW** — explicit ask only; gated behind disclaim
- **Status:** **V2** (regulatory edge case — escalate to legal-advisor before any visual mockup)

---

### Bucket F — Risk Surfaces (descriptive only — Lane A discipline) (5 entries)

#### F1. Concentration heatmap

- **Triggers:** «Show me my biggest exposures» / drill-down from B6
- **Lane A category:** Observation
- **Data shape:** `{ cells: { dim1: 'sector'|'country'|'asset', label, weightPct }[], maxWeightPct, asOf }`
- **Viz hint:** simple heatmap or treemap; intensity = weight; **no normative red/green** — neutral palette (e.g., teal gradient)
- **Scaling:** small portfolios: dense grid; medium: top-N + Other; large: top-N + Other with drill-down
- **Annotations:** legend explains intensity = weight, NOT risk score; no «hot zones» language
- **Sources:** `Source: holdings via [broker] · classification per [provider]`
- **Fallback:** single dimension: collapse to bar
- **Frequency:** **LOW**
- **Status:** MVP

#### F2. Beta + correlation matrix (cross-position)

- **Triggers:** «How correlated are my positions?» / «What's my beta to S&P?»
- **Lane A category:** Observation / Educational
- **Data shape:** `{ portfolioBeta: number, vsBenchmark: 'SPY'|..., positions: { ticker, beta, correlationMatrix: number[][] }[], lookbackDays: number, asOf }`
- **Viz hint:** small correlation matrix table (top-N positions only); portfolio-level beta as headline stat with formula tooltip
- **Scaling:** small (≤8 positions): full matrix; medium: top-8-by-weight matrix; large: top-8 + summary stat; matrix > 8×8 unreadable inline
- **Annotations:** «Beta = sensitivity to [benchmark]; >1 = more volatile than benchmark; <1 = less. Calculation period: [N] days.»; no «high beta» normative tag
- **Sources:** `Source: rolling returns from [broker] holdings + benchmark prices via [provider]`
- **Fallback:** single position or <90 days history: suppress with reason
- **Frequency:** **LOW** — power-user
- **Status:** **V2**

#### F3. Sharpe / Sortino ratio stat

- **Triggers:** «What's my Sharpe ratio?» / «How risk-adjusted are my returns?»
- **Lane A category:** Observation / Educational
- **Data shape:** `{ sharpe: number, sortino: number, lookbackDays: number, riskFreeRateUsedPct: number, riskFreeSource: string, asOf }`
- **Viz hint:** stat tokens with formula tooltip per `BENCHMARKS_SOURCED.md` §4.1, §4.2
- **Scaling:** portfolio-level; single component
- **Annotations:** **CRITICAL** — formula must be correct (252 trading days, geometric returns, current T-bill rate as Rf); «Convention: ~1.0 considered strong, but interpretation varies by strategy and period» — factual convention, no «good/bad» label
- **Sources:** `Source: portfolio returns from [broker] · Rf per [3-mo T-bill via FRED] · formula per Sharpe (1966) DOI 10.1086/294846`
- **Fallback:** <180 days history: suppress with reason
- **Frequency:** **LOW** — power-user / explicit ask
- **Status:** MVP

#### F4. Single-stock concentration vs diversification stat

- **Triggers:** Coach proactive; «How concentrated am I?»
- **Lane A category:** Observation
- **Data shape:** subset of B6 + interpretation badge
- **Viz hint:** stat strip + factual heuristic note («Convention: positions >10% of portfolio are commonly considered concentrated per FINRA investor education»)
- **Scaling:** as B6
- **Annotations:** factual convention citation, NOT prescription; no «you should reduce» language
- **Sources:** `Source: holdings via [broker] · convention per FINRA investor education`
- **Fallback:** as B6
- **Frequency:** **MEDIUM** in Coach context
- **Status:** MVP

#### F5. Currency exposure stat (FX risk descriptor)

- **Triggers:** «How exposed am I to EUR moves?»
- **Lane A category:** Observation
- **Data shape:** subset of B5 + recent-FX-move stat
- **Viz hint:** B5 + stat showing «X% of portfolio sensitive to EUR/USD; EUR/USD has moved Y% over [period]»
- **Scaling:** as B5
- **Annotations:** historical FX volatility, no forecast
- **Sources:** as B5
- **Fallback:** single-currency: suppress
- **Frequency:** **LOW**
- **Status:** **V2**

---

### Bucket G — Events & News (5 entries)

#### G1. Earnings calendar (your positions)

- **Triggers:** «What earnings are coming up for my positions?»
- **Lane A category:** Event
- **Data shape:** `{ events: { ticker, earningsDate: ISO, earningsTime: 'BMO'|'AMC'|'TBD', estEps?: number, prevEps?: number, status: 'upcoming'|'reported' }[], periodStart, periodEnd }`
- **Viz hint:** ticker-anchored calendar list; status chips (upcoming / reported); NO buy/sell action prompts
- **Scaling:** small portfolio: full upcoming list (next 30 days); large: top-N by weight
- **Annotations:** «Schedule per issuer / exchange announcement»; «Provedo does NOT predict earnings outcomes»
- **Sources:** `Source: earnings calendar via [provider — e.g., issuer IR + exchange filings]`
- **Fallback:** no upcoming earnings in window: «No earnings scheduled in next [period]»
- **Frequency:** **MEDIUM** — common in event-driven asks
- **Status:** **V2** (requires earnings-data feed integration)

#### G2. Ex-dividend date markers

- **Triggers:** subset of C1 / dividend-focused asks
- **Lane A category:** Event
- **Data shape:** subset of C1 with explicit ex-date emphasis
- **Viz hint:** badge / inline marker on dividend calendar
- **Scaling:** as C1
- **Annotations:** «Ex-date = last day to buy and qualify for upcoming dividend» mini-explainer
- **Sources:** as C1
- **Fallback:** as C1
- **Frequency:** **MEDIUM**
- **Status:** MVP (sub-element of C1)

#### G3. Corporate-actions log (splits, mergers, spin-offs)

- **Triggers:** «What corporate actions affected my portfolio?» / «Did I miss anything in [month]?»
- **Lane A category:** Event / Observation
- **Data shape:** `{ actions: { ticker, type: 'split'|'reverse_split'|'merger'|'spinoff'|'name_change'|'delisting', effectiveDate: ISO, ratio?: string, description: string, impactToHolding?: string }[], periodStart, periodEnd }`
- **Viz hint:** chronological list with type chips; impact-to-user note where applicable
- **Scaling:** typically small list (per period); full display
- **Annotations:** factual description + impact only; no «good/bad for you» tags
- **Sources:** `Source: corporate-actions feed via [broker] + [issuer 8-K / press release]`
- **Fallback:** no actions in period: «No corporate actions affected your portfolio in [period]»
- **Frequency:** **LOW** — periodic; flagged proactively when material
- **Status:** MVP

#### G4. News mention list per position (citation-trail)

- **Triggers:** «What's been in the news about TSLA recently?» (when news feed available); cited when narrative answer references a news event
- **Lane A category:** Event / Citation
- **Data shape:** `{ ticker, mentions: { headline, source: string, publishedAt: ISO, url, summarySentence?: string }[] }`
- **Viz hint:** stacked source-cards with headline + source + date; matches the established Sources primitive shape but expanded
- **Scaling:** show top-3-by-recency or top-3-by-relevance; expand on user request
- **Annotations:** **CRITICAL** — Provedo does NOT editorialize on news. Each item is headline + source + date only. NO «this is bullish/bearish» framing.
- **Sources:** `Source: news aggregation via [provider — e.g., issuer PR feed + tier-1 wires]`
- **Fallback:** no recent news: «No recent news mentions in [period]»
- **Frequency:** **LOW-MEDIUM**
- **Status:** **V2** (news integration is post-MVP)

#### G5. Forthcoming-events calendar (composite — earnings + dividends + corp actions)

- **Triggers:** «What's coming up for my portfolio next 30 days?»
- **Lane A category:** Event
- **Data shape:** union of G1 + C1 + G3 with type discriminator
- **Viz hint:** unified calendar with type-coded markers; legend for event types
- **Scaling:** typically small list per 30-day window; large portfolios: aggregate by week
- **Annotations:** as per source surfaces
- **Sources:** combined sources
- **Fallback:** no upcoming events: «No scheduled events in next [period]»
- **Frequency:** **MEDIUM** — common Insights-feed anchor
- **Status:** **V2** (composes V2 G1 + MVP C1 + MVP G3)

---

### Bucket H — Comparison & What-If (descriptive only) (4 entries)

#### H1. Benchmark comparison panel (you vs S&P / sector ETF / custom)

- **Triggers:** as A4
- **Lane A category:** Comparison
- **Data shape:** as A4
- **Viz hint:** as A4
- **Scaling:** as A4
- **Annotations:** as A4
- **Sources:** as A4
- **Fallback:** as A4
- **Frequency:** **MEDIUM**
- **Status:** MVP (= A4 — listed here for cross-reference)

#### H2. Sector comparison (your sector mix vs benchmark sector mix)

- **Triggers:** as B2
- **Lane A category:** Comparison
- **Data shape:** as B2
- **Viz hint:** as B2 (matches shipped `AllocationPieBar.tsx`)
- **Scaling:** as B2
- **Annotations:** as B2
- **Sources:** as B2
- **Fallback:** as B2
- **Frequency:** **MEDIUM**
- **Status:** MVP (= B2 — listed here for cross-reference)

#### H3. Position-vs-position factual comparison

- **Triggers:** «How is AAPL doing vs MSFT?» / «Compare my biggest two positions»
- **Lane A category:** Comparison
- **Data shape:** `{ comparison: { ticker, returnPct, sparkline: number[], currentWeightPct, costBasis }[], period, asOf }`
- **Viz hint:** side-by-side stat blocks with overlaid normalized sparklines
- **Scaling:** typically 2–3 positions; max 5 inline
- **Annotations:** «Factual comparison; Provedo does not rank positions as better/worse» — explicit; no «winner» / «loser» tags
- **Sources:** `Source: position returns from [broker] holdings + [price source]`
- **Fallback:** single position: redirect to A2
- **Frequency:** **LOW-MEDIUM** — explicit ask
- **Status:** MVP

#### H5. Position-vs-position scatter — NEW v1.1

- **Triggers:** «Plot my positions by return vs volatility» / «Where do my holdings sit on the risk-return chart?» / «How do my positions compare on size vs gain?» (**reconciles with PD chart-type 8 «Scatter — position-vs-position»**)
- **Lane A category:** Observation / Educational (BORDERLINE — risk-return scatter has efficient-frontier connotation that drifts toward advice)
- **Data shape:** `{ positions: { ticker, name, xValue: number, yValue: number, weightPct, currency }[], xAxis: { label, unit, formula?: string }, yAxis: { label, unit, formula?: string }, period, asOf }`
- **Viz hint:** scatter plot, dot size = portfolio weight, axis-flexible (PD chooses x/y per chat-answer context). Common axis pairs: (a) **historical return × historical volatility** (risk-return scatter); (b) **portfolio weight × YTD gain** (size vs performance); (c) **market cap × your position size** (sizing context); (d) **dividend yield × YTD price return** (income vs growth)
- **Scaling:** small (≤15 positions): all dots labeled; medium (15–50): top-N-by-weight labeled, others unlabeled but visible; large (>50): top-20-by-weight + density-cluster representation for the rest
- **Annotations:** **CRITICAL Lane A guardrail** — risk-return scatter MUST carry caption «Historical observation only. The chart describes where each holding has been; it does not predict where any holding will go, and it does not recommend rebalancing toward any region of the chart. Volatility ≠ risk in any normative sense. Past patterns do not predict future outcomes.» — mandatory; **no efficient-frontier overlay**, **no «optimal» region shading**, **no «aggressive / conservative» quadrant labels**; axis formulas cited
- **Sources:** `Source: position returns + volatility computed from [broker] holdings + [price provider] · period [from]–[to]`
- **Fallback:** <90 days of history: suppress with reason; single position: suppress
- **Frequency:** **LOW** — power-user / explicit ask only
- **Status:** **V2** (Lane A risk + computational complexity — defer to post-MVP; legal-advisor sign-off recommended before live ship even at V2)

#### H4. What-if scenario simulator (user-driven, retrospective)

- **Triggers:** «What if I had bought 50% more AAPL in 2024?» / «What if I sold TSLA at the peak?»
- **Lane A category:** Comparison / Educational
- **Data shape:** `{ scenarioDescription: string, baseline: { totalReturnPct, finalValue }, alternative: { totalReturnPct, finalValue }, deltaAbs, deltaPct, period, methodology: string }`
- **Viz hint:** two normalized lines (baseline = your actual; alternative = scenario); end-labels with deltas
- **Scaling:** scenario-bounded; single component per scenario
- **Annotations:** **CRITICAL** — «Retrospective scenario: shows what would have happened with these specific historical prices. NOT a prediction. NOT a suggestion to act on.» — mandatory caption; user-stated scenario quoted back so framing is theirs not Provedo's
- **Sources:** `Source: historical prices via [provider] · your trade history via [broker]`
- **Fallback:** insufficient history for scenario period: «Provedo doesn't have data for [period]»
- **Frequency:** **LOW** — explicit power-user ask
- **Status:** **V2** (post-MVP per `STRATEGIC_OPTIONS_v1.md` Option 4 tertiary surfaces)

---

### Bucket I — Inline non-chart components (10 entries)

#### I1. Citation badge / Sources block

- **Triggers:** appears in EVERY chat answer that includes a numerical claim or named event
- **Lane A category:** Citation
- **Data shape:** `string[]` (item labels) — matches existing `Sources` primitive (`HERO_SOURCES_ITEMS`)
- **Viz hint:** «Sources: item · item · item.» single line below answer body; matches shipped pattern
- **Scaling:** wrap to 2 lines max on mobile; truncate with «+N more» if >5 sources; expand on tap
- **Annotations:** every item must be a verifiable source; no vague «multiple sources» placeholders
- **Sources:** is itself the citation primitive
- **Fallback:** no claims requiring citation: omit (don't show empty Sources line)
- **Frequency:** **VERY HIGH** — anchor of Lane A trust mechanic
- **Status:** MVP (shipped)

#### I2. Position pill (ticker + price + day-change)

- **Triggers:** any answer mentioning a specific position
- **Lane A category:** Observation
- **Data shape:** `{ ticker, name, currentPrice, currency, dayChangeAbs, dayChangePct, asOf }`
- **Viz hint:** compact chip: TICKER · $price · ±N.N%; mono font for numerics; color-token for change sign
- **Scaling:** inline-flowing; can stack many in a single answer
- **Annotations:** «as of [timestamp]» on hover
- **Sources:** `Source: [price provider] · [timestamp]` (in Sources line, not on pill itself)
- **Fallback:** stale data (>15 min during market hours): show staleness flag
- **Frequency:** **VERY HIGH**
- **Status:** MVP

#### I3. Account / broker pill

- **Triggers:** any answer scoped to an account or broker
- **Lane A category:** Meta
- **Data shape:** `{ broker: string, accountLabel?: string, lastSync: ISO }`
- **Viz hint:** small chip with broker logo / label + last-sync timestamp
- **Scaling:** stack inline; multiple brokers shown as separate pills
- **Annotations:** sync timestamp visible
- **Sources:** N/A (meta)
- **Fallback:** sync stale (>24h): show warning chip
- **Frequency:** **HIGH**
- **Status:** MVP

#### I4. Time-anchor badge («as of YYYY-MM-DD HH:MM TZ»)

- **Triggers:** every chart and many text answers
- **Lane A category:** Meta
- **Data shape:** `{ asOf: ISO, label?: 'now'|'market_close'|'last_sync', timezone: string }`
- **Viz hint:** small subdued text; `as of` prefix; mono font for date
- **Scaling:** single instance per chart / answer
- **Annotations:** mandatory on every visualization
- **Sources:** N/A (meta)
- **Fallback:** stale: red staleness flag
- **Frequency:** **VERY HIGH**
- **Status:** MVP

#### I5. Lane A disclaim chip («Information, not advice»)

- **Triggers:** persistent UI element on every Provedo chat-answer surface; emphasized on tax/risk surfaces
- **Lane A category:** Meta / Citation
- **Data shape:** `{ variant: 'short'|'expanded'|'tax-specific'|'risk-specific', jurisdiction?: string }`
- **Viz hint:** subtle pill near input or below answer; expanded variant on tax/risk-heavy surfaces
- **Scaling:** single instance per surface
- **Annotations:** copy locked per `BRAND.md` §5 footer disclaimer; NOT paraphrased
- **Sources:** N/A
- **Fallback:** N/A
- **Frequency:** **VERY HIGH** — persistent
- **Status:** MVP

#### I6. Quote-with-attribution block (for news / research citations)

- **Triggers:** when answer references a specific news headline or research finding
- **Lane A category:** Citation
- **Data shape:** `{ quote: string, source: string, publishedAt: ISO, url?: string }`
- **Viz hint:** indented italic block with attribution line below
- **Scaling:** typically 1–2 per answer; max 3
- **Annotations:** quote verbatim; no Provedo paraphrase that could distort
- **Sources:** integrated into block
- **Fallback:** no quotes available: omit
- **Frequency:** **LOW-MEDIUM**
- **Status:** **V2** (paired with G4)

#### I7. Stat token (single-number callout in mono)

- **Triggers:** any answer with a load-bearing single number («$124», «−4.2%», «58%»)
- **Lane A category:** Observation
- **Data shape:** `{ value: string, kind: 'positive'|'negative'|'neutral'|'mono' }`
- **Viz hint:** mono font; color-token by kind; matches `MonoToken` / `NegToken` from shipped `ChatMockup.tsx`
- **Scaling:** inline-flowing; multiple per answer
- **Annotations:** every stat token resolves to source in I1
- **Sources:** via I1
- **Fallback:** N/A
- **Frequency:** **VERY HIGH**
- **Status:** MVP (shipped)

#### I8. Date / event marker token

- **Triggers:** any answer referencing a specific date («2025-10-31 Q3 earnings»)
- **Lane A category:** Event / Citation
- **Data shape:** `{ date: ISO, eventLabel?: string }`
- **Viz hint:** mono date + optional event label; matches `MonoToken` for date display in shipped hero
- **Scaling:** inline-flowing
- **Annotations:** date format consistent (ISO YYYY-MM-DD recommended for de-jurisdictioned clarity)
- **Sources:** via I1
- **Fallback:** N/A
- **Frequency:** **HIGH**
- **Status:** MVP

#### I9. «Provedo notices» preamble caption

- **Triggers:** any chart prefaced by an observation; matches the locked pattern in `AllocationPieBar.tsx` («Provedo notices: Your tech weight is about 2× the index's — driven by IBKR.»)
- **Lane A category:** Observation
- **Data shape:** `{ text: string }` — voice-curated short observation sentence
- **Viz hint:** italic line above or below chart; quietly anchored
- **Scaling:** single line per chart; ~80 chars max
- **Annotations:** **CRITICAL** — every preamble passes the verb whitelist (`AI_CONTENT_VALIDATION_TEMPLATES.md` §2); never «recommends / suggests / advises»
- **Sources:** N/A (the chart it precedes carries sources)
- **Fallback:** if no observation worth surfacing, omit (don't force)
- **Frequency:** **MEDIUM-HIGH** — paired with most charts
- **Status:** MVP (pattern shipped in `AllocationPieBar.tsx`)

#### I10. «Insufficient data» state badge

- **Triggers:** any chart that needs to suppress due to insufficient data per §2.3
- **Lane A category:** Meta
- **Data shape:** `{ requiredDays?: number, currentDays?: number, requiredEvents?: number, currentEvents?: number, message: string }`
- **Viz hint:** subdued placeholder card with explainer text + progress indicator if applicable
- **Scaling:** single component
- **Annotations:** explicit about what's missing and what would unlock the chart
- **Sources:** N/A
- **Fallback:** is itself a fallback
- **Frequency:** **MEDIUM** — especially common in first 30 days for Coach surface
- **Status:** MVP

---

## Section 4 — Cross-cutting concerns

### 4.1 Color tokens (Lane A binding)

Per `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` (DS v1.1 — locked palette + ink-CTA + tactile depth) + shipped `ChatMockup.tsx`. Source-of-truth for token values is the design-system doc; this catalog only specifies semantic mapping.

- `--provedo-positive` (green token) — gain / received
- `--provedo-negative` (red token) — loss / scheduled outgoing
- `--provedo-accent` (brand token — defined in DS v1.1) — highlight / portfolio data emphasis
- `--provedo-text-primary` / `--provedo-text-secondary` — body
- Neutral grays for benchmarks (so they don't compete with portfolio data visually)

**Banned color uses:** red as «sell signal», green as «buy signal», amber as «warning to act», colored zones implying action regions.

### 4.2 Typography

- Mono font (`--provedo-font-mono`) for ALL numerics and ticker symbols. Prevents misreads, signals «data, not prose».
- Sans for prose / labels / chart annotations.

### 4.3 Animation discipline

Per shipped patterns + `web/performance.md`:

- Charts fade in / draw in once on first reveal; replay on scroll-back.
- Animate `opacity` + `transform` only (no `width`/`height`/layout-property animation).
- Reduced-motion fallback mandatory: full chart rendered statically, no animation.

### 4.4 Responsive breakpoints

Per §2.4 — every catalog entry assumed to render correctly at 320 / 768 / 1024 / 1440px. Mobile-first: if a chart can't be made legible at 320px, it should not ship inline in chat — drill-down into a dedicated surface instead.

---

## Section 5 — Backend data-contract gaps (for tech-lead)

The catalog implies several backend capabilities that are not yet assumed in current product scope. Flagged for tech-lead awareness:

1. **Cost-basis tracking with FIFO/LIFO/specific-lot per jurisdiction** — required for E1/E2/D5. Not all brokers expose lot-level data via API; some only export year-end statements.
2. **Corporate-actions feed** — required for G3/G5. Brokers vary in completeness; supplemental issuer-IR feed may be needed for completeness.
3. **Earnings calendar feed** — required for G1/G5. Public sources exist (issuer IR + exchange filings) but normalization is non-trivial.
4. **News mention feed** — required for G4/I6. **V2 only**; flagged as paid-feed candidate which would require PO Rule-1 approval.
5. **Pattern-detection engine for Coach (D3/D4/D6)** — requires temporal reasoning and statistical-significance gating before surfacing patterns. Per `STRATEGIC_OPTIONS_v1.md` Option 4 «major ADR required for coach vertical».
6. **Benchmark prices + total-return calculations (A4/H1)** — needs price source for SPY / VTI / sector ETFs + total-return methodology (price + dividends reinvested). FRED gives price; total-return requires more.
7. **FX rates feed (B5/F5)** — public ECB / Fed sources free; needs caching and timestamp tracking.
8. **Realized vs unrealized split per jurisdiction tax year (E1/E4)** — tax-year boundaries vary (US = calendar year; UK = April 6; etc.). Backend needs jurisdiction context.

---

## Section 6 — Open questions

1. **Q1 to PO via Navigator:** for the Coach surface (D3/D4/D6), the catalog assumes 30-day history gate per `STRATEGIC_OPTIONS_v1.md`. Should the gate be 30 days OR ≥10 closed round-trips, whichever is later? Behavioral patterns from <10 events are statistically thin and risk Lane A drift («pattern» that's actually random).
2. **Q2 to legal-advisor:** E5 (estimated tax liability summary) — does any jurisdiction's «not tax advice» disclaim suffice, or do specific jurisdictions (e.g., Russia, India) prohibit even disclaimer-protected estimation? Catalog marks V2 + «escalate before mockup» but flagging here for visibility.
3. **Q3 to tech-lead:** for «benchmark comparison» entries (A4/B2/H1/H2), does product-designer's mockup work need a defined benchmark-set list (e.g., SPY + VTI + sector ETFs + custom user-pick), or is single benchmark (S&P 500) sufficient for v1 mockups?
4. **Q4 to product-designer:** the «Provedo notices» preamble (I9) currently lives as italic line above charts in shipped `AllocationPieBar.tsx`. Should this become a first-class component with its own visual identity (chip, callout box) or remain inline italic? Affects how often the preamble can co-occur with multiple charts in one answer.
5. **Q5 to PO:** scenario simulator (H4) is tagged V2. If a paid tier emerges around V2 features per `PRICING_TIER_VALIDATION.md`, should H4 be Pro-tier-gated? Catalog defers to pricing-tier work.

---

## Section 7 — Index summary (for product-designer reference)

**Total entries:** 57 (across 9 buckets A–I) — v1.0 had 50; v1.1 adds 7 new chart entries (A2b, A9, A10, B8, B9, C6, H5)

**v1.1 new entries:**
- A2b — Per-position price history (line MVP / candlestick V2) — reconciles PD chart-type 6
- A9 — Portfolio value area chart — reconciles PD chart-type 2 (cumulative)
- A10 — Stacked-area accounts — reconciles PD chart-type 2 (stacked)
- B7 — Account split — REVISED to add stacked-bar variant for PD chart-type 7
- B8 — Position-drift bar — reconciles PD chart-type 3
- B9 — Concentration treemap — investment-domain expansion
- C6 — Cash-flow waterfall — investment-domain expansion
- H5 — Position-vs-position scatter — reconciles PD chart-type 8 (V2 due to Lane A risk)

**MVP entries (37):** A1, A2, A2b (line variant only), A3, A4, A5, A7, A9, A10, B1, B2, B3, B4, B5, B6, B7, B8, B9, C1, C2, C3, C5, C6, D1, D2, D3, D4, E1, E4, F1, F3, F4, G2, G3, H1 (= A4), H2 (= B2), H3, I1, I2, I3, I4, I5, I7, I8, I9, I10

**V2 entries (20):** A2b (candlestick variant), A6, A8, C4, D5, D6, E2, E3, E5, F2, F5, G1, G4, G5, H4, H5, I6 (some overlap with cross-references; H5 added v1.1)

**Lane A red flags identified across catalog (v1.1 expanded to 12):**
1. A4 «beating market» framing
2. B2 «over/under-weight» language
3. B3 methodology ambiguity (domicile vs revenue-weighted)
4. C2 yield-on-cost vs current-yield confusion
5. D3/D4 Coach normative drift
6. E1/E2/E5 tax-advice borderline
7. F1 heatmap color norm
8. F3 Sharpe formula correctness
9. G4 news editorialization risk
10. **A2b candlestick / line price chart** — TA-overlay risk; brokerlike framing **(NEW v1.1 — highest visual-surface risk in catalog)**
11. **B8 drift bar** — «target weight» drift implies prescription **(NEW v1.1)**
12. **H5 risk-return scatter** — efficient-frontier connotation drifts toward advice **(NEW v1.1)**

**Top 5 highest-frequency components** (likely to appear in most chat answers — unchanged v1.1):
1. **I1 Sources block** — every answer with a number
2. **I2 Position pill** — every answer mentioning a ticker
3. **I7 Stat token** — every answer with a load-bearing number
4. **I4 Time-anchor badge** — every chart and most answers
5. **I5 Lane A disclaim chip** — persistent surface element

**Recurring scaling pattern:** «top-N + Other» with three modes (small ≤10 = all; medium 10–100 = top 10 + Other; large >100 = top 5–7 + Other + drilldown), tuned per chart for the relevant ranking metric (weight, P&L magnitude, payment date, trade count).

---

## Section 8 — Reconciliation with product-designer 8-chart visual scope (added v1.1)

Product-designer is currently building `docs/design/CHARTS_SPEC.md` (in-flight 2026-04-27, not yet committed) with 8 chart types in scope. This section reconciles PD's 8-type scope with this catalog so PD can incorporate Lane A treatments and the catalog's domain coverage into her visual spec.

| # | PD chart type | PD framing | Catalog mapping (v1.1) | Reconciliation note |
|---|---|---|---|---|
| 1 | Line | Portfolio value over time | A1 sparkline + A2b line variant + A4 benchmark line | Multi-instance — PD's «Line» is the family; catalog has three semantically distinct uses (sparkline tight, position price, benchmark dual-line). PD should treat «Line» as a primitive with three variants. |
| 2 | Area | Cumulative gains, stacked accounts | **A9 (cumulative gain)** + **A10 (stacked accounts)** — both NEW v1.1 | Catalog v1.0 had this gap. v1.1 adds both variants explicitly. PD should produce two visuals — single-series cumulative gain area AND multi-series stacked-account area. |
| 3 | Bar | Drift per position | **B8 drift bar** — NEW v1.1 + A3 attribution bar | A3 (existing) is a contribution-to-period-return bar; B8 (new) is the period-over-period weight-drift bar PD has in mind. Both are «horizontal bar» visually but semantically distinct. **CRITICAL:** B8's Lane A guardrail (no target-weight reference line) MUST be reflected in PD's mockup. |
| 4 | Donut | Allocation breakdown | B1 sector (donut OR bar — PD choice) + B4 asset class | Donut belongs to allocation-breakdown family. PD's donut should be sector-based by default (B1); donut for asset class (B4) and currency (B5) is acceptable variant but bar is often more legible. |
| 5 | Sparkline | Inline mini-charts | A1 sparkline + A2 mini-sparkline (60×16) + I7 stat-token-with-spark | Catalog uses «sparkline» throughout — naming aligned with PD. PD should treat sparkline as a sizing-variant primitive (full-width sparkline ≈ 240×40, mini-sparkline 60×16, inline-stat-token 40×12). |
| 6 | Candlestick | Price history | **A2b** — NEW v1.1 (line MVP, candlestick V2) | Catalog v1.0 had this gap. v1.1 adds A2b with explicit Lane A guardrail: **default = line variant**, candlestick is V2 power-user variant. PD's mockup should produce both BUT mark candlestick as «V2 / power-user surface, not default chat answer» so MVP energy goes to line. The 6+ Lane-A guardrails on A2b (no TA overlays, no support/resistance, no MAs in MVP) are mandatory in PD's mockup. |
| 7 | Stacked bar | Broker contribution | **B7 stacked-bar variant** — REVISED v1.1 + A10 stacked-area | B7 is the static stacked-bar (point-in-time broker split, segments = asset classes). A10 is the time-series stacked-area (broker contribution over time). Both belong to «stacked» family — PD chooses static OR time-series per chat-answer context. |
| 8 | Scatter | Position-vs-position | **H5** — NEW v1.1 (V2) | Catalog v1.0 had H3 (side-by-side stat blocks for 2-3 positions); v1.1 adds H5 as the actual scatter primitive PD has in mind. **CRITICAL:** H5 is V2 due to Lane A risk (efficient-frontier connotation). PD should mock H5 BUT mark V2 + with mandatory Lane A guardrails (no efficient-frontier overlay, no quadrant-as-advice labels). Legal-advisor sign-off recommended before V2 ship. |

**Catalog-only chart types (in catalog, not in PD's 8-type scope):**
- **Calendar** primitive (C1 dividend calendar, D6 trade heatmap, G1 earnings, G3 corporate actions, G5 forthcoming-events) — calendar is a chart family in its own right, not a generic chart type. Recommend PD adds a 9th chart type «Calendar» to her CHARTS_SPEC.md, OR that calendar is treated as a separate component family (more accurate framing). Calendar primitives carry C1 / D6 / G1 / G3 / G5 specifically.
- **Treemap** (B9, F1) — separate from heatmap; PD should consider adding a 10th type or treating it as a variant of heatmap.
- **Heatmap / underwater** (A5 drawdown filled-area, F1 concentration) — A5 is a specialized line/area chart; F1 may belong with treemap. Worth a clarification call with PD before mockup.
- **Stat / token primitives** (I7 stat token, I2 position pill, I9 «Provedo notices» preamble) — these are not «charts» in PD's framing but are catalog entries because they appear inline in chat answers and carry visual-system weight. PD should ensure her CHARTS_SPEC.md covers chart-adjacent inline tokens explicitly OR cross-references this catalog's I-bucket.

**PD-only items (PD scope, not in catalog v1.0 — now reconciled in v1.1):**
- All 8 of PD's items now have explicit catalog entries; v1.0 gaps closed via A2b, A9, A10, B7-revised, B8, B9, C6 (bonus), H5.

**Hand-off checklist for PD:**
- [ ] Adopt catalog naming for the 8 chart types (sparkline, line, area, donut, bar, stacked-bar, candlestick, scatter); add «calendar» and «treemap» as 9th and 10th if scope allows
- [ ] Implement Lane A guardrails for A2b (price chart) — strongest visual-surface risk
- [ ] Implement Lane A guardrails for B8 (drift bar — no target line)
- [ ] Mark H5 (scatter) as V2 + Lane A escalation pending
- [ ] Cross-reference §1.5 forbidden visual patterns (anti-template list) — mandatory baseline
- [ ] Cross-reference §1.7 default time periods — annotation defaults must match
- [ ] Cross-reference I-bucket for inline tokens (I1, I2, I7, I8, I9) that pair with charts in chat answers
- [ ] Coordinate with finance-advisor + legal-advisor before mocking E5 (estimated tax liability) and H5 (risk-return scatter) — both flagged for legal escalation

---

## Changelog

- **v1.0 (2026-04-26):** initial catalog. 50 entries, 9 buckets. Lane A boundary rules (§1) and scaling principles (§2) codified. 33 MVP / 17 V2 split. Backend contract gaps flagged for tech-lead. Five open questions surfaced for PO / legal-advisor / tech-lead / product-designer routing via right-hand.
- **v1.1 (2026-04-27):** currency review + reconciliation with product-designer's 8-chart visual scope + investment-domain expansion. **Net change: 50 → 57 entries (+7 new, +1 revised).**
  - **New chart entries:** A2b price history (line MVP / candlestick V2), A9 portfolio area, A10 stacked-area accounts, B8 position-drift bar, B9 concentration treemap, C6 cash-flow waterfall, H5 position scatter (V2)
  - **Revised:** B7 account split now includes stacked-bar variant for PD chart-type 7
  - **§1.5 forbidden patterns expanded:** added technical-analysis overlays ban (RSI/MACD/Bollinger/MAs in MVP/support-resistance/trend lines), efficient-frontier overlay ban on scatter, target-weight reference-line ban on drift charts. These reinforce Lane A under the new visual surfaces.
  - **§1.7 default time periods (NEW):** authoritative table of default time anchors per chart semantic, addressing the AI-prompt question «what period to show when user doesn't specify». Tax-year aware. Snapshot vs period principles.
  - **§8 reconciliation with PD scope (NEW):** explicit cross-walk between PD's 8 chart types and this catalog; identifies catalog-only gaps (calendar, treemap, stat primitives) and provides hand-off checklist.
  - **Lane A red flags grew:** 9 → 12 (added A2b price chart, B8 drift, H5 scatter — all need careful PD treatment).
  - **References cleanup:** stale `BRAND.md` / `BRAND_VOICE/VOICE_PROFILE.md` references replaced with `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` v1.1 + cross-refs to `COACH_SURFACE_SPEC.md` v2.0 and `DASHBOARD_ARCHITECTURE.md` v1.1.
  - **Currency notes:** catalog itself uses Provedo throughout (R4 compliant). Cross-document inconsistency observed — `02_POSITIONING.md` and `AI_CONTENT_VALIDATION_TEMPLATES.md` and `BENCHMARKS_SOURCED.md` still reference predecessor naming; flagged for right-hand routing to relevant owners as a separate doc-currency cleanup pass (not blocking PD's mockup work — naming substitution is mechanical).
