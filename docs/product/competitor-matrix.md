# Competitor Matrix — AI Investing / Portfolio Tracking Landscape

**Owner:** `user-researcher` agent
**Compiled:** 2026-04-23
**Methodology:** Direct WebFetch of landing pages and pricing pages between 2026-04-23 05:00–14:00 UTC, supplemented by desk review sources (WallStreetZen 2025 roundup, Investing.com 2025 chatbots review, Product Hunt). All data either quoted from competitor's own site, or flagged `[unverified]` / `[per third-party review]` where primary source was unreachable.

**How to read:**
- `B-coverage` = broker/exchange count as claimed on landing (source in "Notes" column)
- `AI` field uses the taxonomy: `none` · `chat-basic` · `chat-portfolio-aware` · `proactive-insights` · `scenario-sim` · `trade-exec`
- `$` = USD unless noted
- `YYYY-MM` access date is 2026-04-23 unless stated
- If a claim couldn't be verified on the primary source, it's marked `[unverified]`

---

## 1. Trading-chat (AI that can also execute trades)

| Product | Hero headline (verbatim) | B-coverage | AI type | Read-only vs exec | Asset classes | Aggregation | Pricing | Target | Geo | Tax | Standout | Weakness | 2025-26 change |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Magnifi** | "Magnifi – Invest with intelligence" | [unverified] | chat-portfolio-aware + trade-exec | executes | stocks/ETFs/funds | ~broker aggregation claimed | [pricing page unreachable 2026-04-23] | retail "investing copilot" | US | none | First named "AI copilot for investing"; widely referenced | WebFetch blocked; can't independently verify current feature set | Still present in 2025 roundups |
| **Bobby (RockFlow)** | "Trade Smarter with an AI-Powered Platform" | Interactive Brokers, Nasdaq, HKEX, Reuters partners | chat-portfolio-aware + trade-exec | executes | stocks/ETFs/options | direct-broker via FSP license | "$1USD to start"; subscription not disclosed | "beginners and Gen Z"; copy-traders | Global (NZ-licensed FSP) | none | "Bobby scours social media in seconds"; TradeGPT daily feed | Overseas regulator (NZ FSP) only; no SIPC for non-US | Bobby positioning reinforced 2025 |
| **Public.com AI Agents** | "Investing for those who take it seriously" | Self-broker + Alpaca + Apex | chat-portfolio-aware + trade-exec + proactive-insights | executes | stocks/bonds/ETFs/crypto/options/treasuries | self-custody broker | Premium tier (not disclosed on homepage) | "active investors"; Concierge at $500K+ | US (FINRA/SIPC) | US | "Generated Assets" (turn prompt into index); Market Briefing; Key Moments | Broker-first — competes on trades, not tracking; no external-broker aggregation | "Generated Assets" launched (marked New); Crypto IRAs (New) |
| **Composer** | "Meet Composer" / "Build trading algorithms with AI" | Alpaca + Apex Clearing via Composer Securities | chat-basic → strategy + trade-exec | executes | stocks/ETFs | direct-broker | $32/mo ($384/yr annual) Trading Pass | retail DIY algo traders | US | US | AI-assisted no-code strategy editor; 15M+ orders, $28B volume | Algo-focused; not conversational about existing holdings | "Zero commissions" messaging stable |
| **Moomoo (Agentic)** | "The Next-Gen Online Trading Platform" | self-broker | chat-portfolio-aware + trade-exec | executes | stocks/options/ETFs/crypto/fractional | self-custody | $0 commission | active individual traders | US + multi-region | partial | Launched "Agentic Investing" / "Moomoo API Skills" 2026-04 — automated strategy API | Active-trader focused; no cross-broker aggregation | **2026-04-23**: "Moomoo API Skills" announcement (same day as this audit) |
| **Tickeron** | "Revolutionize Your Trading with Tickeron's AI-Powered Stock Forecast Tools" | Alpaca | proactive-insights + AI bots (auto-trade in brokerage) | hybrid (signals → auto-trade via partner) | stocks/ETFs | Alpaca API | Free (limited); $20/mo model; $40/mo active [per WallStreetZen 2025-2026] | DIY, copy-traders, swing traders | US | none | 230 AI Virtual Agents; claimed "up to 313% returns" on trading bots | Performance claims need scrutiny; signal-heavy | Trading bots now "in brokerages" (2025 expansion) |

---

## 2. Research-chat (chat-first, focused on company research + analysis, limited portfolio context)

| Product | Hero headline (verbatim) | AI type | Portfolio integration | Pricing | Target | Geo | Standout | Weakness | 2025-26 change |
|---|---|---|---|---|---|---|---|---|---|
| **Fiscal.ai** (formerly Finchat.io) | [homepage returned 429 rate-limited; rebrand confirmed via WallStreetZen 2025-2026 roundup] | chat-basic on research (not your portfolio) | "limited integrations" [per WSZ 2025-2026] | Free 10 prompts/mo; $24/mo 100 prompts [per WSZ] | retail wanting conversational research | US/global | "Institutional-grade S&P Global Market Intelligence data" under LLM interface; 100K+ companies | Prompt-quota feels small at entry tier | **Finchat.io rebranded to Fiscal.ai** (2025) |
| **Gainify** | "Stock Analysis That Finds Quality Companies in Minutes" | chat-basic research ("GainifyAI") | watchlists + top-investor tracking, NO personal portfolio | "Starter plan... always free"; premium exists | 17,600+ users, retail quality-seekers | US/global | free-forever research tier; S&P Global data | Research-only; no portfolio chat | Copyright "2026" shown on page |
| **WarrenAI (InvestingPro)** | "Buffett-style Q&A" [per Investing.com academy 2025-2026] | chat-basic research; 135K+ securities; 26 languages | none | from $13.99/mo (InvestingPro) [per Investing.com academy] | pro investors, global | Global/EU/US | 1,200+ enterprise metrics; multi-lingual | Subscription to InvestingPro required; no portfolio chat | Launched April 2025 per original DISCOVERY |
| **Fey (acquired by Wealthsimple)** | "Make better investments." | chat-basic + AI news/earnings summaries; portfolio-aware ("Automatically sync all your brokerage accounts") | IBKR + E*Trade sync | $30/mo or $300/yr flat (7-day trial, 20 Finder queries) | retail, "students mentioned as specific segment" | US | Ad-free; earnings call streaming; natural-language stock screener; 100 Finder queries/mo | Only 2 brokers natively (IBKR + E*Trade); US-only | **Acquired by Wealthsimple ~mid-2025** per Product Hunt reviews |
| **Atom Finance** | [landing redirected 404, go.atom.finance also 404] | — | — | — | originally retail, now enterprise [per industry context] | — | — | Consumer product likely sunset; pivoted B2B | **Consumer landing unreachable 2026-04-23** (likely sunset) |
| **Simply Wall St** | "Welcome to your Portfolio Command Center" | chat-basic (Snowflake visualization, Narratives framework); not full AI chat | 2,000+ broker connections; 5 portfolios unlimited holdings on Unlimited tier | Free / Premium / Unlimited (USD not shown on plans page) | "disciplined individual investors"; value investors | Global | "Snowflake" 5-axis visual analysis; Narratives investment-thesis framework | No true chat interface; older UI | Copyright 2026 |
| **StockAnalysis.com** | "Search for a stock to start your analysis" | none (data tool) | research-only, no portfolio | Stock Analysis Pro (price not disclosed on homepage) | retail research | US/global | 130K+ stocks/funds; IPO tools | No AI, no portfolio integration | Mobile app 4.9★ mentioned |
| **Alinea Invest (AI Allie)** | "Investing as easy as texting" | chat-basic + micro-investing | manages their brokerage accounts (not aggregation) | $120/year (wealth management) | "beginners... women intimidated by financial complexity"; multi-generational | US iOS (Android waitlist) | 24/7 chat; curated portfolios not algo | Is a broker not a tracker; limits users to their platform | "AI Allie" retained; Android "coming soon" |

---

## 3. Self-directed HNW / wealth management (AI + high net worth)

| Product | Hero headline (verbatim) | AI type | Integration | Pricing | Target | Geo | Standout | Weakness | 2025-26 change |
|---|---|---|---|---|---|---|---|---|---|
| **Range** | "All-in-one wealth management. Get modern financial advice for investing, taxes, and more—with no hidden fees." | proactive-insights + "thousands of advanced projections" + CFP humans | full advisory, not just tracking | Flat-fee; tiers Premium/Platinum/Titanium (dollar amount not on homepage); **$2,655/yr flat [per WallStreetZen 2025-2026]** | "If you make over $200k" — executives, tech pros, doctors | US | Hybrid: proprietary AI "Rai" + CFP + CPA + CFA staff; SEC RIA fiduciary | $200K income entry; not for retail at $20K-$100K | 2025/2026 award badges (Benzinga, Finder, TipRanks, Newsweek) |
| **Arta Finance** | "Arta unifies your financial life to help you grow, protect, and enjoy your wealth." | "AI to elevate your investing experience" [launching 2026] | BNY Pershing custody; not cross-broker aggregation | Complimentary on first $100K for 1 yr for new members; 0.5% on structured (≥$25K min) | "professionals from global tech companies" (Google, AppLovin, Verily) | US (SEC) + global | Private equity, private credit, real estate, venture capital, hedge funds, structured products | $25K minimum on structured; HNW-feel even if stated as retail | AI platform "Coming 2026" announcement |
| **Farther** | "Welcome to Intelligent Wealth" | proactive-insights: "Predictive Advice & Planning"; "Intelligent Execution"; Tax-Loss Harvesting Engine | advisor-managed accounts | No minimum disclosed, no fee disclosed on homepage; $15B AUM | HNW with "advisor matching" | US | "Predictive" advisory tech + human advisors; #1 fastest-growing per Inc. | Advisor-gated; not self-serve | "$15B AUM" as of Oct 2025 |
| **Parthean** | "Help your clients make better financial decisions — faster." | AI Paraplanner, tax-strategy optimization, portfolio analysis, research memos | advisor-side (not consumer) | Not disclosed | **B2B — financial advisors**; paraplanners | US | 15+ document extractors; AI for fiduciary workflow | Not a consumer product | Still B2B in 2025-26 |
| **Empower** (formerly Personal Capital) | "Whatever your financial happiness looks like, let's get you there." | none AI-specific on homepage | free dashboard aggregation | Personal Strategy ≥$100K investment; Private Client ≥$1M | HNW via advisor upsell | US | Free dashboard to top-of-funnel $100K+ advisor leads | Upsell model = monetization via human advisors, not tracker | No AI positioning on homepage 2026-04-23 |
| **Mezzi** | "Self-manage your wealth. Get fiduciary advice." | proactive-insights + scenario-sim + chat; Plaid/Finicity aggregation; "Exposure X-ray" | thousands of institutions via Plaid | Core $179/6mo ($299/yr); Plus $299/6mo ($499/yr); White Glove $899/6mo ($1,499/yr) | self-directed, "FIRE to traditional retirement"; NOT HNW-gated | US | "Unlimited AI chat with your wealth team"; 24/7 monitoring; $0 AUM | No free tier; entry price ~$179 for 6 months is high vs retail peers | "Rapid shipping" but no specific 2025-26 announcements |

---

## 4. Self-directed AI advisor (closest to OUR positioning — new entrants)

| Product | Hero headline (verbatim) | AI type | Integration | Pricing | Target | Geo | Standout | Weakness | 2025-26 change |
|---|---|---|---|---|---|---|---|---|---|
| **PortfolioPilot** ⚠ critical competitor | "Complete financial advice for self-directed investors" | chat-portfolio-aware + proactive-insights + scenario-sim + AI Equity Research | **12,000+ institutions aggregation** (read-only) | **Free** / Gold $20/mo / Platinum $49/mo / Pro $99/mo (annual pricing) | "self-directed investors"; modest → complex portfolios | US | $30B+ AUM, 40K+ users; multi-asset incl. crypto/RE/PE/metals; M6 Forecasting Competition winner | Feels advisor-y ("Complete financial advice"); Platinum unlocks real AI | Expanded estate + scenario modeling 2025; $93M tax-loss harvesting savings |
| ↳ **Regulatory structure** | **Hybrid** (confirmed 2026-04-23 via globalpredictions.com/disclosures). Public site + Free tier = **education-only / not advice** (explicit in disclosure). Paid tiers (Gold $20 / Platinum $49 / Pro $99) = **SEC-registered RIA under Client Agreement** (Global Predictions Inc. — Form ADV, Form CRS, standard RIA artifacts). This = real-world implementation of "Lane C" hybrid model per `STRATEGIC_OPTIONS_v1.md`. |
| **Origin** ⚠ critical competitor | "Own your wealth. Track everything. Ask anything." | chat-portfolio-aware + proactive-insights; "first SEC-regulated AI financial advisor with full-context reasoning" | multi-account aggregation + investment tracking | **$1 for first year** (intro); investment account 0% expense | couples + individuals, financial wellness + investing | US | **"SEC-regulated AI advisor"** claim; daily recaps across spending + holdings + news; AI Budget Builder | Couples/budgeting lean dilutes pure-investor UX; regulatory positioning very different from ours | **Launched SEC-regulated AI advisor 2025**; $1/year promo aggressive |
| ↳ **Regulatory structure** | **Pure RIA** (per self-claim: "first SEC-regulated AI financial advisor"). Advisor framing is on the hero, not gated behind a paywall. Full Lane B. |
| **Mezzi** (see §3) — **Regulatory structure** | **Pure RIA** per "fiduciary advice" hero + paid-only access (Core $299/yr entry — no free tier through which unadvised users experience the product). Fiduciary claim legally requires RIA registration. Full Lane B. |
| **Range** (see §3) — **Regulatory structure** | **Pure RIA + human advisors** (SEC RIA fiduciary per hero; CFP/CPA/CFA staff). Lane B, HNW-gated ($200K income minimum). |
| **Albert (Genius AI)** | "Introducing Genius. Your personal financial assistant." | chat-basic + budgeting/investing hybrid | aggregation + own brokerage | $19.99/mo – $39.99/mo (30-day free trial) | integrated money management users | US | Budget + bank + invest + ID theft insurance all in one | Budget-first, investing is secondary | Genius positioning stable; rates updated 2026-04-23 |
| **Wealthfolio** | "Grow Wealth. Keep Control." | chat-basic (built-in AI assistant) | SnapTrade + CSV; 100% open-source | **Free desktop + optional "Wealthfolio Connect" subscription** (price not on homepage) | privacy-conscious self-directed | Global/OSS | **Open-source, local-first, privacy-first**, 6,260 GitHub stars | Niche; setup friction; no cloud-first UX | Active releases 2025-2026 |
| **Ghostfolio** | "Ghostfolio – Open Source Wealth Management Software" | none flagged | self-hosted or cloud | [pricing page returned limited content; Open Source basic tier + Premium — verify separately] | DIY/privacy-conscious/OSS | Global | Open-source alternative to paid trackers | No AI as of 2026-04-23; niche audience | [no specific 2025-26 announcement captured] |

---

## 5. Dashboard-legacy trackers (minimal or no AI primary UX)

| Product | Hero headline (verbatim) | B-coverage | AI type | Pricing | Target | Geo | Tax | Standout | Weakness | 2025-26 change |
|---|---|---|---|---|---|---|---|---|---|---|
| **Snowball Analytics** | "Simple and powerful portfolio tracker" | 1000+ brokers via Yodlee/SnapTrade; 15 direct-import | none | Free / Starter $9.99/mo or $79.99/yr / Investor $19.99/mo or $149.99/yr / Expert $29.99/mo or $249.99/yr | retail, dividend-focused | Global (25+ currencies, 70+ exchanges) | partial (dividend focus) | Dividend tracking best-in-class; rebalance tool | No AI; dated UI; dividend-niche | Tier structure stable; "Starter" replaced older entry tier |
| **Kubera** | "The balance sheet for those who manage their own wealth" | "thousands of institutions worldwide"; all major exchanges | chat-basic via external AI (ChatGPT / Claude desktop / Gemini CLI / Codex) | Essentials **$250/yr**; Black $2,500/yr; White Label from $300/mo | self-directed wealth managers | Global | partial | Wide asset support (stocks, crypto, DeFi, NFTs, RE, jewelry, watches, gold); "Dead Man's Switch" | AI delegated to external LLMs (no native portfolio-aware chat); $250 entry high | **$250/yr** confirmed (was $150/yr in older 2025 sources); AI Import via screenshots added |
| **Empower** (see §3) | — | — | — | — | — | — | — | — | — | — |
| **Monarch Money** | "The modern way to manage money" | 13,000+ financial institutions | none explicit | Core $99.99/yr; Plus $299.99/yr (7-day trial) | couples + individuals, budgeting+investing | US | partial | Widest aggregation count claim (13K+); couples collaboration | Budget-first framing; investing is "advanced analysis" gated on Plus | 30% WELCOME promo |
| **Copilot Money** | "Your money, beautifully organized." | Schwab, Coinbase, Wealthfront, Vanguard + more | chat-basic (pattern-detection, categorization) | $7.92/mo billed yearly ($95/yr) | iOS financial-conscious | US | partial | Apple Design Awards Finalist; beautiful UX | Budget-first, iOS-only leanings | Published April 22, 2026 — active |
| **Sharesight** | "Be the smarter investor" | 200+ integrations; 700K+ stocks/ETFs | none | Free / Starter $7/mo / Standard $18/mo / Premium $23.25/mo | retail + pros; tax-focused | AU-origin, global | Strong AU + CA + UK + US + NZ + EU tax reports | Deep tax reporting for AU CGT; multi-region | No AI; standard portfolio tracker UX | Copyright 2026; stable tier structure |
| **Getquin** | "Your entire wealth. One platform." | "thousands of providers" (no list); 500K users; €20B tracked; Trade Republic + Scalable + EU open-banking strong; IBKR sync broken free-tier; Fidelity blocked; Schwab/Vanguard/Robinhood unconfirmed | **chat-portfolio-aware + proactive-insights** ("AI Financial Agents"; Wealth-tier-gated; no behavioral-history-pattern) | Free / Premium €89.99/yr ($~97) / Wealth €149.99/yr ($~162); annual-only; EUR-only | EU primary retail, mass-market (~€30-40K avg AUM/user) | **Live locales: EN/IT/DE**; ES/PT claimed but 404 on landing (2026-04-23); zero RU locale; US absent | partial; no US tax | AI Financial Agents positioning; EU aggregation + dividend calendar; 500K user scale + Series A $15M 2022 Portage+Horizons | EU-leaning; no US broker integrations confirmed; ads-in-app business model; data accuracy + support complaints (§3.2 deep-dive); AI gated to Wealth €150/yr; zero behavioral pattern detection on trade history; small team (27 LinkedIn employees) | **Deep-dive 2026-04-23** → `getquin-deep-dive.md`. Southern Europe hiring (ES/IT/PT) early 2026 per LinkedIn; no Series B surfaced. |
| **Finary** | [homepage 403 and 404 on multiple locales 2026-04-23] | [per secondary sources: 10K+ institutions; 400K+ users → **600K+ per Sept 2025 Series B release**] | [some AI features added 2024-2025 per press; AI chat not confirmed as primary] | [verify] | EU HNW / sophisticated retail | EU + US expansion | [verify] | Multi-asset incl. real estate, private equity, crypto | Can't verify landing today | **Series B €25M Sept 2025** led by PayPal Ventures + LocalGlobe + Hedosophia + Shapers + YC + Speedinvest; CEO Mounir Laggoune plans heavy AI investment |
| **Parqet** ⚠ missed in v2 | "Sprich mit deinem Portfolio" (Speak with your portfolio) — German-native AI chat framing | 50+ broker file imports; Trade Republic + Scalable autosync; Bitpanda crypto sync upcoming | **chat-portfolio-aware via MCP bridge to Claude + ChatGPT** (not embedded in-app AI) | Basis €0/mo / Plus €11.99/mo / Investor €29.99/mo; 14-day trial | EU retail + DIY investors; beginner and experienced | DE primary, EN available; 350K+ users; 4.7 App Store stars | partial | **MCP-bridge AI is distinct pattern** — exposes portfolio data to user's own Claude/ChatGPT instance; "parqet-cli" for AI-agent access; superior App Store rating vs Getquin (4.7 vs 4.0) | DE-centric; no US presence; AI is external (users need own LLM subscription) | **Discovered 2026-04-23 peer scan** (reference: parqet.com/de/; parqet.com/de/pricing). Missed by v2 discovery. Second EU incumbent alongside Getquin. |

---

## 5b. New peers — 2026-04-23 scan additions (Lane A + AI insights/chat + portfolio-aware + retail)

These products were surfaced in the 2026-04-23 peer scan but were not in the v2 discovery corpus. All meet the criteria (AI chat or AI insights + portfolio-aware + Lane A / education-only + retail pricing + not US-only behind regulatory walls). Most are early-stage; confidence on each is documented per-row.

| Product | Hero headline (verbatim if confirmed) | B-coverage | AI type | Pricing | Target | Geo | Standout | Weakness | Confidence | Source |
|---|---|---|---|---|---|---|---|---|---|---|
| **Investry AI** | "AI-powered analysis, yield tracking, backtesting and factor exposure" | None live; brokerage integrations listed as "planned" | proactive-insights (static AI insights, NOT chat) | Scout $0/mo → Pro $19.99/mo | "Serious, self-directed investors" | US only; international "coming soon" | Powered by Claude AI; factor exposure + Monte Carlo on S&P backtesting | No live broker sync; US-only; no chat; early-stage (copyright 2026) | Medium (direct landing fetch) | investryai.app |
| **Guardfolio** | "The portfolio tracker that Vanguard forgot to make" (tagline per third-party; direct landing 403) | Multi-broker — self-directed + retirees; stocks/ETFs/crypto/mutual funds/401(k) | proactive-insights ("AI risk alerts and plain-language guidance"; concentration detection, sector drift, correlation monitoring) | Free + paid tier (amount not surfaced) | Self-directed investors + retirees | Likely US primary (Medium journal entrepreneurial docs from founder Elad Nachum; US-broker language) | Plain-language AI risk alerts; portfolio health scoring; rebalancing recommendations | Landing returns 403; not verifiable firsthand today | Low-medium (third-party descriptions only) | guardfolio.ai (403); Trustpilot/SourceForge/Slashdot listings |
| **AllInvestView** | "Stocks, bonds, ETFs, options, crypto & real estate in one Dashboard" | **30+ brokers automatic sync** (IBKR + Schwab + DEGIRO + Trading 212 + Saxo Bank + Zerodha + Fidelity + Robinhood); 200K+ assets; 50+ currencies; 80+ exchanges; 14+ tax jurisdictions | proactive-insights + "AI Assistant" (across all tiers) | Free / Starter / Advanced / Pro tiers (dollar prices not on public pricing page; 40% annual discount; 14-day trial) | Retail multi-broker; sophisticated | **Global** (multi-currency + multi-jurisdiction) | Multi-broker breadth + multi-jurisdiction tax reports; read-only access; options Greeks; Monte Carlo | Pricing opacity; AI Assistant granularity gating unclear; "AI Assistant" language vague | Medium (landing fetched) | allinvestview.com, allinvestview.com/pricing |
| **Corvo** | "Free Portfolio Analytics & AI Investing Tools" | None native (yfinance + manual entry); Supabase-hosted | **chat-portfolio-aware via Claude** (AI-powered portfolio chat) + Monte Carlo 8,500 paths + Sharpe/volatility/alpha/beta + sector exposure + educational game system | Free | Retail self-directed; educational gamification (15 levels, daily challenges, leaderboard) | Global (multi-currency USD/GBP/EUR/JPY/CAD); English-only | AI chat via Claude + open-source (github.com/vinay-batra/corvo); Monte Carlo depth (8,500 paths); educational gamification layer | Beta v0.16 (as of HN post); no broker sync; individual-developer project under Business Source License 1.1; not commercial-production-grade | Medium (github + landing verified) | corvo.capital; github.com/vinay-batra/corvo |
| **PortfolioGlance** | "Free AI Portfolio Tracker for Multiple Portfolios & Currencies" | **No sync — manual entry only** ("no syncing or credential sharing"); 30+ currencies; stocks/ETFs/bonds/crypto/REITs/real estate/private assets | proactive-insights ("AI-powered analysis for diversification, concentration risk, and strategy allocation") + "Free AI token pool" | Free (no paywall for core features; AI token pool limited) | Privacy-conscious multi-account investors | Global (multi-currency + multi-region exposure); EN only | **Privacy-first + no credential sharing** — serves segment Getquin/Parqet/PortfolioPilot ignore; copyright 2026 | Manual entry is adoption friction; no chat; no broker sync | Medium-high (landing fetched) | portfolioglance.com |

**Scan methodology (2026-04-23):**
- Sources: DuckDuckGo HTML search (multiple queries on AI + portfolio + 2025-2026 launches); Hacker News Show HN indexed threads; Product Hunt investing/fintech topics; founder LinkedIn trails
- Criteria: (1) claims AI chat or AI insights; (2) portfolio-aware (reads user holdings, not market-wide); (3) Lane A (education/information-only) or Lane A free tier; (4) retail-priced (<$50/mo or free); (5) global or multi-market (not gated behind US-only regulatory walls)
- Candidates evaluated but **excluded**:
  - Capitally — no AI features, does not meet criterion 1
  - Pulsefolio (pulsefolio.net) — landing returns 404; likely sunset or repositioned
  - Portfolio Genius (portfoliogenius.ai) — AI-vs-AI experimental leaderboard, not consumer product per HN launcher's own description
  - Portfolio Terminal — one-off import utility, not a tracker
  - wealthAPI — B2B API licensing, not consumer
  - Luna (iOS) — budgeting-first with investment secondary; not portfolio-aware AI-chat
  - Sumi Finance — crypto-only, adjacency only (CoinStats covers this category)
  - Trade Ideas / TrendSpider / StockHero / AltIndex / Koyfin — trade-execution or research-only, not portfolio-aware Lane A
  - TigerGPT (Tiger Brokers) — broker-native AI layer, not independent tracker
  - Delta App (delta.app) — landing 403, no AI verification possible today
  - Portseido (portseido.com) — landing 403, no AI verification possible today
- Peer count: **5 new peers confirmed + 1 previously-missed EU incumbent (Parqet)** = **6 additions to competitor corpus**

---

## 6. Crypto-focused trackers (for reference — adjacent category)

| Product | Hero headline (verbatim) | Coverage | AI | Pricing | Notes |
|---|---|---|---|---|---|
| **CoinStats** | "The Ultimate Crypto Tracker for Your Wallets & Exchanges" | 300+ exchanges/wallets; 20K+ coins; 120+ blockchains; 10K+ DeFi | "Crypto AI Agent is here!!!" — price predictions, chatbot | Free + Premium (price redacted on homepage) | Crypto + NFT + DeFi |
| **Zerion** | "Your crypto wallet for Solana and Ethereum" | 51+ networks; multi-wallet + Ledger | none explicit | Free + Premium | Wallet-centric, not tracker-centric; no BTC native |
| **DeBank** | "Your go-to portfolio tracker for Ethereum and EVM" | Ethereum + EVM chains | [unverified on homepage] | [unverified] | DeFi-native tracker |
| **CoinTracker** | [403 Forbidden on both .com and .io variants 2026-04-23] | [per industry context: 500+ exchanges] | [unverified] | Free + Premium tiers (verify separately) | Strong tax feature claim historically |

---

## 7. Budgeting + investing hybrids (not direct competitors, but adjacent)

| Product | Hero | Pricing | AI | Investment tracking depth |
|---|---|---|---|---|
| **YNAB** | "Get YNAB. Get good at money." | [not on landing] | none | none flagged |
| **Rocket Money** | "The money app that works for you" | [not on landing] | "autopilot" (spending) | none flagged |
| **PocketSmith** | "Know where your money is going" | [not on landing] | none (forecasting, not AI-labelled) | limited (budgeting-first) |

---

## 8. Summary observations from the scan

**Products identified in scan:** 34 (primary v2 discovery) + 6 peers added 2026-04-23 (Parqet + Investry AI + Guardfolio + AllInvestView + Corvo + PortfolioGlance) + 6 adjacent/budgeting = **46 total.**

**AI positioning density (post 2026-04-23 update):**
- Explicit "AI advisor" or "AI agent" claim on homepage: 11/40 (Magnifi, Bobby, Public, Composer, Moomoo, Tickeron, Fey, PortfolioPilot, Origin, Albert, Mezzi, Kubera external, Getquin, Gainify, Simply Wall St limited, CoinStats, Wealthfolio) — **+ Parqet, Investry AI, Guardfolio, AllInvestView, Corvo, PortfolioGlance** all add explicit AI claims in 2026-04-23 additions
- Portfolio-aware AI (reads YOUR holdings): PortfolioPilot, Origin, Mezzi, Getquin, Fey, Wealthfolio, Moomoo, Public, **+ Parqet (via MCP bridge), Investry AI, Guardfolio, AllInvestView, Corvo, PortfolioGlance** — **14 products**
- Read-only + portfolio-aware AI + retail-priced + NO trade execution + NOT HNW-gated: PortfolioPilot, Origin, Mezzi, Wealthfolio, Getquin, **Parqet, AllInvestView, Corvo, PortfolioGlance, Guardfolio, Investry AI** — **11 products directly in or adjacent to our wedge** (up from 5)

**Wedge pressure summary (updated 2026-04-23):** The wedge is **more contested than v2 discovery captured** — 6 additional peers found. Key patterns:
1. **EU incumbents** stronger than known: Getquin + Parqet together cover 850K+ users in DE/EU retail; AI-chat positioning both (different patterns — Getquin embedded, Parqet via MCP bridge)
2. **Privacy-first / OSS tail** real: PortfolioGlance + Corvo + Wealthfolio each serve «no credential sharing» segment
3. **2026 AI-first entrants numerous**: Investry AI + Corvo + Guardfolio + AllInvestView all launching around same time with overlapping feature claims
4. **Multi-broker global positioning NOT uncontested**: AllInvestView claims 30+ brokers + 80+ exchanges + 14+ tax jurisdictions — direct competitor on «multi-market breadth» claim we were treating as wedge

**Implication:** Wedge narrower than v2 suggested. Option 4 Hybrid (Second Brain) and Companion (behavioral coach on trade history) remain the most defensible positions — neither Parqet nor the six 2026-04-23 peers do behavioral pattern detection on trade history. Oracle + Analyst lose further differentiation against these entrants. See `STRATEGIC_OPTIONS_v1.md` v1.1 ranking — findings reinforce Companion > Option 4 > Oracle > Analyst under Lane A + global.

**Regulatory-lane clarification (2026-04-23):** Of the «advisor-framed AI competitors», **regulatory structure is not uniform**:

- **Pure RIA (Lane B):** Origin, Mezzi, Range — advisor identity is front-of-house, legally consistent with registration from day one.
- **Hybrid (Lane C):** PortfolioPilot — public site + free tier are legally education-only; paid tiers operate as SEC RIA under a written Client Agreement (Global Predictions Inc. Form ADV). Confirmed via disclosures page 2026-04-23.
- **Lane A (education-only, no advisor framing):** all pure trackers (Kubera, Snowball, Simply Wall St, Sharesight, Getquin, Wealthfolio, Ghostfolio).

This matters for our positioning: PortfolioPilot validates Lane C as a viable hybrid structure ($30B AUM, 40K users) rather than a theoretical option. See `01_DISCOVERY.md` §4.5 and `STRATEGIC_OPTIONS_v1.md` regulatory-lane axis.

---

## Methodology notes and caveats

1. **Firsthand vs secondary:** All rows above prefer primary source (competitor's own landing/pricing page at 2026-04-23). Where primary was unreachable (Magnifi, Finary, CoinTracker, Atom Finance consumer), secondary sources (WallStreetZen, Investing.com, Product Hunt reviews) are cited inline.
2. **Unverified claims:** Performance claims ("up to 313% returns" Tickeron; "$15B AUM" Farther; "15M+ orders" Composer) are competitor self-claims, not independently audited.
3. **Pricing freshness:** Fey, PortfolioPilot, Mezzi, Monarch, Sharesight, Snowball, Kubera, Copilot, Getquin verified from primary pricing pages 2026-04-23. Others are from third-party reviews dated 2025 or earlier — may be stale.
4. **Coverage gaps identified:** Could not verify firsthand today: Magnifi, Finary, CoinTracker, Atom Finance consumer, DeBank. Ghostfolio pricing details. Perplexity Finance (404).
5. **Competitors rate-limiting:** Fiscal.ai (429), Finary (403), Copilot pricing page (403), Simply Wall St pricing listed tiers but no prices. Suggest re-scan in 48-72 hrs.
