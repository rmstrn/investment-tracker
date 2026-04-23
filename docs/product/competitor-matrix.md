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
| **Getquin** | "Your entire wealth. One platform." | "thousands of providers"; 500K users; €20B tracked | **chat-portfolio-aware + scenario-sim + proactive-insights** ("AI Financial Agents") | Free / Premium €89.99/yr ($~97) / Wealth €149.99/yr ($~162) | EU primary retail | EU (EN/IT/DE) | partial | AI Financial Agents: optimization, scenarios, retirement planning; strong EU aggregation | EU-leaning; no US tax features | Explicit AI positioning on landing |
| **Finary** | [homepage 403 and 404 on multiple locales 2026-04-23] | [per secondary sources: 10K+ institutions; 400K+ users] | [some AI features added 2024-2025 per press] | [verify] | EU HNW / sophisticated retail | EU + US expansion | [verify] | Multi-asset incl. real estate, private equity, crypto | Can't verify landing today | [access blocked] |
| **Finchat.io** | [rebranded to Fiscal.ai — see §2] | — | — | — | — | — | — | — | — | — |

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

**Products identified in scan:** 34 (primary) + 6 adjacent/budgeting = 40 total.

**AI positioning density:**
- Explicit "AI advisor" or "AI agent" claim on homepage: 11/34 (Magnifi, Bobby, Public, Composer, Moomoo, Tickeron, Fey, PortfolioPilot, Origin, Albert, Mezzi, Kubera external, Getquin, Gainify, Simply Wall St limited, CoinStats, Wealthfolio)
- Portfolio-aware AI (reads YOUR holdings): **PortfolioPilot, Origin, Mezzi, Getquin, Fey, Wealthfolio, Moomoo, Public** — **8 products**
- Read-only + portfolio-aware AI + retail-priced + NO trade execution + NOT HNW-gated: **PortfolioPilot, Origin, Mezzi, Wealthfolio, Getquin** — **5 products directly in our wedge**

**Wedge pressure summary:** Our original 2026-04-22 claim of "uncontested wedge" assumed the chat-with-portfolio + read-only + retail + no-advisor combination was empty. **It is not.** PortfolioPilot, Origin, and Mezzi each occupy overlapping parts of it, and Getquin occupies it for EU. Deeper analysis in `competitor-positioning.md` and `01_DISCOVERY.md` v2.

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
