# 02 — Product Positioning (LOCKED, pending name)

**Framework:** April Dunford's "Obviously Awesome" (5-step).
**Current score:** 8/10 Strong — all components defined, awaiting name lock + live user validation.
**Date locked:** 2026-04-22

## Positioning Canvas

| Component | Answer |
|---|---|
| **Competitive alternatives** | (1) Spreadsheets + broker-native apps · (2) Dashboard-legacy (Empower, Kubera, Snowball, Sharesight) · (3) AI research tools (ChatGPT, Fiscal.ai, WarrenAI) · (4) Do nothing |
| **Unique attributes** | (1) Chat-first UX tied to **your** aggregated portfolio · (2) Proactive curated weekly insights · (3) Behavioral coach on actual trade history · (4) Source-cited AI answers · (5) US+EU+crypto read-only in one product · (6) Zero trading, zero fund-pushing, zero HNW gate |
| **Value themes** | (1) Second brain for your portfolio · (2) Everything in one view · (3) No conflicts, no upsells |
| **Best-fit customer** | ICP A (multi-broker millennial 28-40, $20-100K) + B (AI-native newcomer 22-32, $2-20K) — US primary, EU secondary |
| **Market category** | **Subcategory: "AI portfolio intelligence"** (under portfolio trackers) |
| **Relevant trends** | LLM-first consumer apps · multi-broker retail reality · post-2022 advisor distrust · open-finance (SnapTrade/Plaid) · post-ChatGPT financial literacy |
| **Positioning statement** (internal) | For retail investors who juggle multiple brokers and prefer conversation over charts, [PRODUCT] turns your portfolio into something you can talk to. |

## Brand archetype

**Magician + Everyman** — modern, smart, delightful AI responses ("wow moment"), without snob vibe. Accessible to retail, not corporate-cold.

## Tone of voice

- Short, direct, conversational
- Imperative mood for user-facing copy ("поговори", "спроси", "подключи")
- No jargon, no condescension
- Native Russian + English (equal weight)
- **Regulatory constraint:** AI never speaks in imperatives about user actions ("buy X", "sell Y" forbidden). Only analyze, highlight, explain.

## Anti-positioning (what we're NOT)

- NOT broker (no trading execution)
- NOT advisor (no "buy/sell" imperatives — regulatory)
- NOT HNW wealth manager (Range/Arta territory)
- NOT dividend terminal (Snowball territory)
- NOT price predictor
- NOT ugly fintech (implicit via design)

## Final landing structure (LOCKED 2026-04-22)

| # | Section | Hero | Sub |
|---|---|---|---|
| 1 | **Hero** | Поговори со своим портфелем. | Просто задай вопрос. |
| 2 | **4 tabs (demo scenarios)** | Спроси что угодно. | Вот 4 примера. |
| 3 | **Insights** | Пара минут в день — и ты знаешь всё о своём портфеле. | Дивиденды, просадки, события — увидишь первым. |
| 4 | **Aggregation** *(marquee)* | Все твои активы в одном чате. | Больше 1000 брокеров и криптобирж. |
| **Footer** | Disclaimer (formal) | — | — |

**Design notes:**
- Section 4 is a right-to-left marquee component showing broker/exchange logos (Fidelity · Schwab · Interactive Brokers · Robinhood · E*TRADE · Trading212 · Hargreaves Lansdown · Questrade · Wealthsimple · Coinbase · Binance · Kraken · ...).
- No dedicated safety/trust section above-fold. Competitor audit showed this is only needed for money-managing products (Range), not trackers (Snowball, Kubera keep trust messaging minimal/mid-page).

### 4-tabs section: demo scenarios (content)

Each tab shows a mock chat interaction demonstrating one AI module.

| Tab | Situation user types | Mock response shown |
|---|---|---|
| **Спроси** | "Почему я в минусе в этом месяце?" | Breakdown: 62% просадки — Apple (-11%) + Tesla (-8%). График. Источники (AAPL Q3 earnings, TSLA Q3 earnings). |
| **Разбери** | "Насколько я diversified?" | Tech 58% (выше среднего US retail 34%). Financials 22%, healthcare 8%, прочее 12%. Круговая диаграмма. |
| **Заметь** | *(weekly push)* "3 вещи на этой неделе" | (1) $124 дивидендов · (2) NVDA 52w high — 14% твоего портфеля · (3) EUR cash теряет -2.1% к инфляции. |
| **Прикинь** | "Что если доллар упадёт на 10%?" | Портфель 87% в USD assets → -8.7% в EUR-терминах. Уязвимы: S&P ETF ($12K), Apple ($8K). Хеджи: EU equities, gold, EUR bonds. |

**Note:** Coach (#3 module) и Explainer (#5) не отдельные tab'ы — они проявляются внутри других (Coach в Заметь, Explainer inline в любом ответе). 5 модулей в 4 вкладках — честно.

## Footer disclaimer (LOCKED, formal)

**Russian:**
> [Название] не является зарегистрированным инвестиционным советником. Информация предоставляется в образовательных целях. Прошлая доходность не гарантирует будущую. Все инвестиционные решения вы принимаете самостоятельно.

**English:**
> [Name] is not a registered investment advisor. Information is provided for educational purposes only. Past performance is not indicative of future results. All investment decisions are your own.

**Placement:** Footer only. NOT in landing body — keep landing positive territory.

## Pricing tiers (from 00_PROJECT_BRIEF, reconfirmed)

| Tier | Price | Key features |
|---|---|---|
| **Free** | $0 | 2 accounts, unlimited positions, 90-day history, basic charts + allocation, AI Chat 5 msg/day, 1 insight/week |
| **Plus** | ~$8-10/mo | Unlimited accounts, full history, unlimited chat, daily insights, dividend calendar, benchmark comparison, CSV export |
| **Pro** | ~$20/mo | Everything in Plus + tax reports per jurisdiction, advanced analytics (Sharpe/Sortino/factors/max drawdown), custom alerts, API access |

**Status:** Pricing is hypothesis. Validate with real users.

## Key product principles (from 00_PROJECT_BRIEF, reconfirmed)

1. Trust over beauty — fintech is about reliability. Zero "magic", everything explainable.
2. Newcomer should not feel stupid — all terms explained inline in context.
3. Privacy and security at financial-app level.
4. Read-only broker connection. Never request trading rights.
5. AI shows sources for every claim/analysis.
6. Mobile and web are equal citizens. Not "website + mobile stub".

## Open for future PO-level decisions

- **TD-091 (PO-level, not tech):** Add "positive" insight type to backend enum. Current: info/warning/critical → renders info/warning/negative in UI. No way to generate celebratory signals ("portfolio outperformed S&P"). Trigger: alpha user feedback if insights feel too doom-focused.
- **TD-090 (P3):** Typed `action_url` in Insight schema (oneOf discriminated union). Trigger: start of Slice 6b or TASK_05 catalogue finalization.
