# 01 — Product Discovery (Market Research v2, 2026-04-23)

**Owner:** `user-researcher` agent
**Replaces:** v1 (2026-04-22 desk research, ~15 competitors, 10 sources)
**Methodology:** Direct WebFetch of landing + pricing pages at 2026-04-23, plus secondary sources (WallStreetZen 2025-2026, Investing.com academy 2025-2026, Product Hunt, Crunchbase mentions). 34 competitors catalogued in `competitor-matrix.md`; pricing details in `pricing-landscape.md`; landing-copy audit in `competitor-positioning.md`.

## Changelog vs v1

- **v2 expands competitor coverage 15 → 34**
- **v2 is evidence-first** — every product claim cites a URL + access date 2026-04-23
- **v2 introduces three products v1 missed that materially pressure-test the wedge:** PortfolioPilot, Origin, Mezzi
- **v2 surfaces platform-level news v1 didn't cover:** Fey/Wealthsimple acquisition, Finchat→Fiscal.ai rebrand, Moomoo Agentic Investing launch (same day as scan), Arta AI coming 2026, Atom Finance consumer sunset
- **v2 separates competitor self-claims from third-party claims**

**HYPOTHESES under test vs v2 evidence:** Current `02_POSITIONING.md` stance on ICP, wedge, pricing, and acquisition is the working hypothesis — this doc tests it. Positioning file is NOT edited here; implications flagged for Navigator.

---

## 1. What changed in market since v1 (2026-04-22 → 2026-04-23)

Short list of material changes since the original v1 audit:

### 1.1 Products v1 missed entirely

| Product | Category | Why it matters |
|---|---|---|
| **PortfolioPilot** | Self-directed AI advisor (**hybrid regulatory structure** — see §5.4) | $30B+ AUM, 40K+ users, Free+$20/$49/$99 tiers, 12K+ institutions aggregation, portfolio-aware AI. **Most direct competitor to our wedge we've found.** |
| **Origin** | AI financial assistant | Hero "Own your wealth. / Track everything. Ask anything." — sub-hero matches our wedge framing. Claims "first SEC-regulated AI financial advisor" (2025) |
| **Mezzi** | AI wealth replacement | "Self-manage your wealth. Get fiduciary advice." — AI + Plaid/Finicity aggregation; $299-1,499/yr |
| **Fey** | AI research + tracker | Acquired by Wealthsimple ~mid-2025; IBKR+E*Trade portfolio sync; $300/yr flat |
| **Albert (Genius)** | AI finance assistant (broader) | Genius AI for budget + invest; $19.99-39.99/mo |
| **Tickeron** | AI trading bots | 230 AI Virtual Agents; signals + broker-integrated auto-trade |
| **Composer** | AI algo trading | $32/mo Trading Pass; natural-language strategy editor |
| **Moomoo (Agentic)** | Broker + AI API | Launched "Agentic Investing" / "Moomoo API Skills" 2026-04-23 (announced day of this scan) |
| **Wealthfolio** | OSS AI tracker | 6,260 GitHub stars; built-in AI assistant; privacy-first; SnapTrade |
| **Ghostfolio** | OSS tracker (no AI confirmed) | Adjacent competitor in privacy/OSS segment |
| **Gainify** | AI research (free) | 17,600 users; GainifyAI free-forever; S&P Global data |
| **WallStreetZen** | AI ratings | 115-factor AI rating; $19.50/mo |
| **Farther** | HNW AI-enhanced | $15B AUM, "intelligent wealth", hybrid advisor |
| **Arta Finance AI** | HNW alts | "AI to elevate your investing" **coming 2026** |

### 1.2 Positioning pivots + M&A since 2025

- **Finchat.io → Fiscal.ai rebrand** (2025). We noted Finchat as research-chat in v1; it's been rebranded. Feature set similar, prompt-quota pricing ($24/mo for 100 prompts).
- **Fey acquired by Wealthsimple** (~mid-2025 per Product Hunt reviews). Wealthsimple now has AI research tool in portfolio; Wealthsimple itself is a Canadian broker.
- **Moomoo launched Agentic Investing** 2026-04-23 (same day as this scan). Adds trade-execution AI layer via API skills.
- **Atom Finance consumer landing sunset** (go.atom.finance 404 on 2026-04-23). Likely pivoted B2B entirely.
- **Arta Finance flagged "AI for Wealth" as "Coming 2026"** — late mover in HNW AI.
- **Kubera increased pricing** $150 → $250/yr Essentials (v1 noted $150).
- **Origin launched "first SEC-regulated AI financial advisor"** (2025). SEC-registered-as-advisor positioning, opposite of our not-advisor framing.

### 1.3 Market narrative shift

From v1: "AI + investing" was a wave of 2024-2025 entrants.
v2 observation: **"AI + portfolio-aware chat" is the 2025-2026 wave.** Early "AI investing" tools (Magnifi 2023, Fiscal.ai 2024) were research-focused. 2025-2026 entrants (PortfolioPilot, Origin, Mezzi, Getquin AI Agents, Moomoo Agentic) all lean "AI that knows YOUR portfolio." Our wedge is at the center of the current wave, not ahead of it.

---

## 2. Is the wedge still uncontested?

**Original claim (v1, 2026-04-22):** "AI chat about YOUR portfolio, read-only, for retail, no trading, no advisor upsell" — uncontested wedge.

**v2 verdict:** **Partially contested**, not uncontested. Here's the evidence.

### 2.1 Wedge attribute-by-attribute evidence

| Wedge attribute | Products that match this (2026-04-23) | Contested? |
|---|---|---|
| AI chat **about your portfolio** | PortfolioPilot, Origin, Mezzi, Getquin, Fey, Wealthfolio, Public.com AI, Moomoo Agentic, Kubera (via external LLM), CoinStats (crypto-only) | **Crowded** |
| Read-only (no trading) | PortfolioPilot, Origin, Mezzi, Getquin, Kubera, Snowball, Sharesight, Simply Wall St, Empower, Monarch, Wealthfolio | **Common attribute**, not unique |
| For retail (not HNW-gated) | Getquin, Snowball, Sharesight, Monarch, Copilot, Gainify, Wealthfolio, Albert, Origin ($1/yr intro), Simply Wall St | **Common**, NOT an exclusive wedge attribute |
| No trade execution | PortfolioPilot, Origin, Mezzi, Kubera, Snowball, Sharesight, Monarch, Empower, Simply Wall St, Wealthfolio | **Common** |
| No advisor upsell | **Here's where it gets interesting:** Kubera ✓, Snowball ✓, Simply Wall St ✓, Getquin ✓, Sharesight ✓, Wealthfolio ✓. BUT: PortfolioPilot positions AS "advice" **on paid tiers only — hybrid structure, see §5.4**; Origin = SEC-registered advisor; Mezzi = "fiduciary advice"; Range = full advisor. | **Split** — all pure trackers avoid advisor upsell; all AI-first products lean INTO advisor framing (PortfolioPilot = hybrid: free = education-only, paid = RIA) |

### 2.2 Wedge intersection: who has ALL of [AI chat + portfolio-aware + retail + read-only + not-advisor]?

Running the strict filter:
- **AI chat + portfolio-aware**: PortfolioPilot, Origin, Mezzi, Getquin, Fey, Wealthfolio, Kubera (external)
- **+ Read-only + no trading**: remove Public, Moomoo → left with PortfolioPilot, Origin, Mezzi, Getquin, Fey, Wealthfolio, Kubera
- **+ Retail (not HNW-gated by threshold or income)**: all survive in marketing language, though PortfolioPilot + Mezzi skew sophisticated
- **+ Not advisor-framed**: remove PortfolioPilot (paid tiers operate as SEC RIA — hybrid structure, see §5.4), Origin ("SEC-regulated AI financial advisor"), Mezzi ("fiduciary advice")
- **Survivors: Getquin, Fey (recently acquired), Wealthfolio, Kubera (AI delegated to external LLMs)**

**Narrower wedge finding:** The "no advisor" + "AI portfolio chat" combination IS lightly occupied. Getquin leads in EU, Kubera is AI-via-external-LLMs (weak), Wealthfolio is OSS+niche, Fey is research-first and post-acquisition.

**If we add "US primary market"** to the filter:
- Getquin — EU-native, light US presence
- Fey — US, now Wealthsimple-owned (Canada)
- Wealthfolio — OSS / niche
- Kubera — global, AI-external

**Net narrower wedge conclusion:** For "AI-native, chat-first, portfolio-aware, read-only, retail, not-advisor-framed, US+EU" there is still a gap — nobody is fully occupying it. But PortfolioPilot and Origin are adjacent enough that we must distinguish ourselves crisply on the not-advisor framing.

### 2.3 Re-stated wedge (evidence-corrected)

**v1 claimed:** "AI chat about YOUR portfolio, read-only, for retail, no trading, no advisor upsell" — uncontested.

**v2 evidence-corrected:** "Chat-first (not dashboard-first) AI that knows YOUR portfolio, explicitly NOT an advisor (the others in this wedge lean into advisor framing), multi-broker aggregation on par with PortfolioPilot's 12K+ claim, US+EU from day one, investing-pure (not budgeting-hybrid like Origin or Albert)."

This is more specific, more defensible, and acknowledges contest rather than claiming empty space.

---

## 3. New adjacent categories we missed

### 3.1 OSS / privacy-first tracker

Wealthfolio (6,260 stars) + Ghostfolio are niche but growing. **Implication:** If our aggregation requires giving up privacy (Plaid / SnapTrade), we have zero answer for the privacy-first user. Our positioning doesn't address this — neither as "privacy-first alternative" nor as "we serve the aggregation-ok majority." Flag as an open decision.

### 3.2 AI-broker hybrids

Moomoo Agentic + Public.com AI Agents + Bobby/RockFlow represent a pattern v1 called out but didn't scope: brokers bolting aggressive AI layers on top. They have the aggregation built-in (their own brokerage) but deliberately exclude external-broker aggregation (it cannibalizes their flow revenue). **Implication:** If users default to brokerage-native AI for their primary broker, the value of OUR aggregation has to justify itself as "everything across brokers" not "AI in one broker." Reinforces the "multi-broker" claim importance.

### 3.3 Budgeting+investing hybrids with AI

Origin, Albert, Copilot, Monarch Plus — these entities own the "one app for everything money" territory. **Implication:** We reject this direction (`02_POSITIONING.md` says investing-only). That remains a positive differentiation.

### 3.4 B2B-only AI advisor tools

Parthean, Farther (advisor-led), institutional platforms. Out of our scope, but worth noting: if we win consumer, these become potential acquirers.

---

## 4. Implications for positioning (flag for Navigator; don't edit 02_POSITIONING.md)

### 4.1 Wedge re-framing

**Flag:** Update `02_POSITIONING.md` wedge claim to reflect contested reality. Current statement ("not fully occupied") is defensible but understates density. Recommend:

Suggested replacement wedge language (for Navigator to evaluate):
> **"Chat-first AI portfolio intelligence for retail multi-broker users, explicitly not an advisor — distinct from PortfolioPilot ('Complete financial advice') and Origin ('SEC-regulated AI financial advisor') which lean into advisor framing, and from pure trackers (Snowball, Kubera, Simply Wall St) which don't have AI-native UX."**

### 4.2 Differentiation matrix update

v1's differentiation map was 5 axes. v2 requires adding:
- **Advisor framing axis** (us = NOT advisor; PortfolioPilot/Origin/Mezzi = ARE advisor-framed)
- **Primary UX axis** (us = chat-first; Getquin = aggregator-first with AI layered; PortfolioPilot = dashboard-first with AI chat below)

### 4.3 Hero copy validation

Current hero "Поговори со своим портфелем. Просто задай вопрос." holds up well. See `competitor-positioning.md` §5 for detailed reasoning. Biggest English-language adjacency risk is Origin's "Track everything. Ask anything." — our hero is more portfolio-specific.

### 4.4 Safety/trust placement validation

Current decision (footer-only disclaimer) is VALIDATED by audit. See `competitor-positioning.md` §2.3 — products that are trackers put trust in footer/mid; products that are advisors put it in hero. Our positioning matches the tracker pattern, correctly.

### 4.5 PortfolioPilot as validated Lane C implementation

**New evidence (2026-04-23, from globalpredictions.com/disclosures):** PortfolioPilot is **not a pure-RIA product** — it operates under a **hybrid regulatory structure** that is a real-world implementation of what `STRATEGIC_OPTIONS_v1.md` calls «Lane C (hybrid — launch A, add RIA tier later)».

**Direct quotes from their disclosure page:**

1. **Lane A — public site + Free tier (education only):** «The publicly available portions of the Platform... are provided for educational purposes only and are not intended to provide legal, tax, or financial planning advice. Nothing on the publicly available portions of the Platform should be construed as a solicitation or offer, or recommendation, to buy or sell any security.»
2. **Lane B — paid tiers Gold $20 / Platinum $49 / Pro $99 behind written Client Agreement (SEC RIA):** «Global Predictions Inc. provides investment advice only through its internet-based application, PortfolioPilot, and only to investors who are advisory clients of Global Predictions pursuant to written advisory Client Agreements ("Advisory Services").»
3. **Marketing copy legally scoped:** their «Complete financial advice for self-directed investors» hero is constrained by the disclosure: «The financial advisor described in this marketing language is referring to you, the reader. PortfolioPilot is meant to be an aid to the self-directed investor.»
4. Global Predictions Inc. has Form ADV, Form CRS, and the standard SEC RIA registration footer («Registration does not imply a certain level of skill or training»).

**Implication for our strategic thinking:**

- Lane C is **no longer a hypothetical path**. It has a $30B-AUM, 40K-user validated implementation. This materially de-risks Lane C as a strategic option — the gate-structure (free = education, paid = RIA) is workable in practice, not just in theory.
- PortfolioPilot's «Complete financial advice» hero is **not a pure-RIA claim** — it's a hybrid claim, legally scoped by a disclosure page that retail users rarely read. Our previous mental model («PortfolioPilot = SEC RIA, we are education-only, clean wedge») was too simple.
- The actual competitive difference is: **PortfolioPilot operates on Lane C; we are currently locked to Lane A** (per `02_POSITIONING.md` and `DECISIONS.md` 2026-04-23). Either of these is a deliberate stance, not a default.
- The «not advisor-framed» dimension in the wedge table (§2.1) is **more nuanced than stated**: PortfolioPilot is education-only for non-paying users, advice-scoped for paying users. If our ICP A (millennials, $20K-100K, likely to try free first) compares us to PortfolioPilot on landing/free experience, both are Lane A there — the advisor differentiation only manifests post-paywall.

**No positioning file edit triggered by this note.** `02_POSITIONING.md` remains Lane A-locked pending PO pick in `STRATEGIC_OPTIONS_v1.md`. This subsection exists so the v2 record does not carry the earlier «PortfolioPilot = pure RIA» shortcut.

---

## 5. Implications for ICP

### 5.1 ICP A — Multi-broker millennial (28-40, $20K-100K)

**Competitor overlap for this ICP:**
- PortfolioPilot Gold ($20/mo) — **direct overlap**, 40K+ users skew this demographic
- Getquin Premium (€90/yr) — **direct overlap** in EU
- Monarch Plus ($300/yr) — if they want budget+invest
- Copilot Money ($95/yr) — if they want beautiful budget + investment view
- Snowball Starter ($80/yr) — dividend-focused subset
- Simply Wall St Premium — if research-heavy

**Confidence:** ICP A is correctly identified. It's a real segment, but **actively contested**. Live interviews are urgent.

**New question surfaced:** How does this ICP currently make "brokers across accounts" comparison? Do they already use PortfolioPilot / Empower / Copilot? Switching-cost is now a live discovery question, not an abstraction.

### 5.2 ICP B — AI-native newcomer (22-32, $2K-20K)

**Competitor overlap:**
- Alinea Invest ($120/yr) — "investing as easy as texting"; targets intimidated beginners, particularly women
- Gainify (free forever) — quality-hunting retail beginners
- Albert Genius ($19.99/mo) — integrated financial wellness
- Public.com (free broker + AI Agents) — Gen Z serious-but-new
- Origin ($1 first year) — couples + individuals wellness
- CoinStats (Crypto AI Agent) — crypto-native newcomers

**Concern:** ICP B may be MORE contested than ICP A, not less. Alinea, Gainify, Albert, Public, Origin all actively target beginners-with-AI. Origin's $1/year intro is aggressive acquisition for the exact segment.

**New question surfaced:** Do AI-native newcomers with small portfolios ($2-20K) care enough about multi-broker aggregation to pay for it? A user with one Robinhood + one Coinbase may be well-served by Robinhood's native AI + CoinStats AI, each free.

**Recommendation for Navigator:** Consider whether ICP B should narrow to "AI-native newcomers who ALREADY have 2+ brokers" vs generic "newcomers". Validate with interviews.

### 5.3 New ICP surfaced: ICP C candidate — Privacy-conscious self-directed

Evidence: Wealthfolio has 6,260 GitHub stars; Ghostfolio has sustained OSS community. Privacy-first retail exists as segment. Not currently in our ICP.

**Decision needed:** either explicitly INCLUDE (and build privacy-first features/local-first mode) or explicitly EXCLUDE (and state they're out of ICP).

---

## 6. Implications for pricing

### 6.1 Pricing sits in crowded clusters

Detail in `pricing-landscape.md`. Key takeaways:

- **Free is table-stakes** — 9+ competitors offer it. Having a Free tier is not a moat.
- **Plus $8-10/mo** = $96-120/yr = **crowded 4-way cluster** with Copilot ($95), Snowball Starter ($80), Monarch Core ($100), Getquin Premium (~$97). Each of these has a different value story, so our AI chat has to be visibly better at that price.
- **Pro $20/mo** = $240/yr = **exact match to PortfolioPilot Gold** ($240/yr). Same price, PP has 40K users + $30B AUM proof.
- **Gap at $30-50/mo** — Fey $30, Composer $32, PortfolioPilot Platinum $49, Mezzi Core $50 equiv. If ICP A upgrades toward serious-retail use, we lose them to Platinum tiers we don't offer.
- **Usage-gate (prompts-per-month)** is modern and underused — Fiscal.ai pioneered it. Could fit our AI-native UX better than account-count gates.

### 6.2 Pricing hypothesis re-cast

**Original (02_POSITIONING.md):** Free ($0) / Plus (~$8-10) / Pro (~$20).

**Evidence-based flags:**
1. Our Plus $8-10/mo is realistic and has precedent (Copilot $7.92, Snowball Starter $9.99, Sharesight Starter $7, Getquin Premium ~$8). Don't raise.
2. Our Pro $20/mo sits at PP Gold exactly. Three options:
   a. **Hold $20** and differentiate via UX + not-advisor framing + EU/Russian markets
   b. **Undercut to $15/mo** and position as "cheapest retail AI tracker"
   c. **Add a Power tier at $40-50/mo** to catch upgraders, positioning current Pro as "primary retail" and new Power as "serious retail"
3. Usage-gate on AI messages is more AI-native than account-count gate. Recommend: "Free = 5 msg/day; Plus = unlimited chat; Pro = unlimited + advanced models + API."

**Not recommending changes to `02_POSITIONING.md` directly** — Navigator owns that file. These are evidence-backed options.

---

## 7. Acquisition channels — implications

ICP A channels (v1): Reddit r/personalfinance, r/investing, YouTube finance, Twitter/X.
ICP B channels (v1): TikTok/Reels, YouTube, r/personalfinance.

**v2 evidence-driven additions and concerns:**

1. **Product Hunt is an active channel for AI-investing products** — Fey launches, PortfolioPilot mentions, and "Fey" discovery all went through PH. Worth including for ICP A launch.
2. **Subreddit-specific evidence** — r/personalfinance has existing threads ranking PortfolioPilot / Empower / Monarch / Copilot. Entering this conversation requires differentiation from all four.
3. **LinkedIn for EU + Getquin competition** — worth considering for Getquin-adjacent EU acquisition (EU retail investors are more LinkedIn-present than US retail).
4. **Twitter/X and TikTok** — intense saturation of AI-investing content. Creator partnerships more important than organic ads.
5. **SEO keyword "AI portfolio tracker 2026"** — crowded field; PP, Magnifi, WallStreetZen, Investing.com, RockFlow all rank on it. Winning requires either (a) brand-name searches (naming matters) or (b) long-tail differentiators ("AI portfolio tracker EU multi-broker read-only").

**Note:** Channel strategy needs dedicated exercise with growth/marketing; this discovery doc should only identify pressure and opportunity, not execute plan.

---

## 8. Trends tailwinding our positioning (reconfirmed)

All 5 trends from v1 hold in v2 evidence:

1. LLM-first consumer apps — reinforced (ChatGPT, Claude, Perplexity mainstream; AI UX expected)
2. Multi-broker / multi-currency retail reality — reinforced (Monarch claim 13K+ institutions, PP 12K+, Getquin "thousands"; open-finance normalized)
3. Post-2022 advisor distrust — reinforced (PP, Mezzi, Kubera, Origin, Range all lean into "not a traditional advisor" or "replace your advisor")
4. Open-finance normalization (SnapTrade, Plaid, Finicity, Yodlee, MX) — reinforced, all present in competitors
5. Post-ChatGPT financial literacy curiosity — reinforced; new products (Alinea, Gainify, Albert, Origin) all educational-AI for beginners

**One emerging trend v1 didn't articulate:** "Agentic investing" (AI that can take actions, not just answer questions). Moomoo announced it literally today. Public.com's Agents work similarly. This is a 2026 trend direction: **trackers → chatbots → agents that act**. We are explicitly NOT going agentic (read-only positioning). That's a conscious differentiator but also a potential roadmap question.

---

## 9. NOT our customer (reconfirmed + specified)

From v1, refined:

- **HNW $500K+** → Range ($2,655/yr), Arta Finance, Farther territory
- **Active day traders** → Moomoo Agentic, Composer, Bobby execute, not analyze
- **Dividend-only power users** → Snowball Investor+
- **Pure crypto natives** → CoinStats, Zerion, DeBank, Zapper
- **Human advisor seekers** → need CFP/Range
- **Budget-first, investing-secondary** → Monarch, Copilot, YNAB, Rocket Money, Origin (partial), Albert
- **Self-hosters / OSS-first** → Wealthfolio, Ghostfolio — flag open decision; possibly include, possibly exclude
- **SEC-regulated-advice seekers** → Origin positions here; we do NOT

---

## 10. Open research questions (generated by this v2)

These became visible only through deeper scan:

1. **Switching cost from PortfolioPilot / Empower / Copilot** — for ICP A, what would make someone switch from an established tracker? Validate in interviews.
2. **Does ICP B actually value multi-broker aggregation?** If they're one-broker + one-exchange, our aggregation pitch is overkill. Validate in interviews.
3. **Is "chat-first" preference real or asserted?** Do retail users actually prefer conversation over dashboard for portfolio insights? Validate in interviews.
4. **How far does ICP B go for "not an advisor" framing?** Our positioning is that this is positive (anti-upsell). But Origin is winning ICP B segment by explicitly BEING an SEC-regulated AI advisor. Validate which framing trust-resonates.
5. **Privacy-first tail ICP** — is there enough volume in Wealthfolio/Ghostfolio users to consider as ICP C?
6. **Russian-native retail investing users** — who is serving them today? Near-zero evidence in this audit. Possible open market or possibly zero demand.
7. **EU retail preference: Getquin vs new entrant** — why would EU users switch from Getquin?

All flagged to `hypotheses.md` (in USER_RESEARCH/) for live-interview testing.

---

## 11. Sources (2026-04-23 firsthand access unless noted)

### Primary (WebFetch 2026-04-23, reachable)

- PortfolioPilot: https://portfoliopilot.com/ + /pricing (accessed 2026-04-23)
- Origin: https://www.useorigin.com/ (accessed 2026-04-23)
- Mezzi: https://www.mezzi.com/ + /pricing (accessed 2026-04-23)
- RockFlow/Bobby: https://www.rockflow.ai/ (accessed 2026-04-23)
- Public.com: https://public.com/ (accessed 2026-04-23)
- Composer: https://www.composer.trade/ + /pricing (accessed 2026-04-23)
- Moomoo: https://www.moomoo.com/ (accessed 2026-04-23; 2026-04-23 Agentic announcement cited on page)
- Gainify: https://www.gainify.io/ (accessed 2026-04-23)
- Simply Wall St: https://simplywall.st/ + /plans (accessed 2026-04-23)
- Range: https://www.range.com/ (accessed 2026-04-23)
- Arta Finance: https://artafinance.com/ (accessed 2026-04-23)
- Farther: https://farther.com/ (accessed 2026-04-23)
- Parthean: https://parthean.com/ (accessed 2026-04-23)
- Empower: https://www.empower.com/ (accessed 2026-04-23)
- Monarch Money: https://www.monarch.com/ + /pricing (accessed 2026-04-23)
- Copilot Money: https://copilot.money/ (accessed 2026-04-23)
- Kubera: https://www.kubera.com/ (accessed 2026-04-23)
- Getquin: https://getquin.com/ + /pricing (accessed 2026-04-23)
- Sharesight: https://www.sharesight.com/ + /pricing (accessed 2026-04-23)
- Snowball Analytics: https://snowball-analytics.com/ + /pricing (accessed 2026-04-23)
- Kubera: https://www.kubera.com/ (accessed 2026-04-23)
- Albert: https://albert.com/ (accessed 2026-04-23)
- Alinea Invest: https://alinea-invest.com/ (accessed 2026-04-23)
- Fey: https://fey.com/ + /pricing (accessed 2026-04-23)
- CoinStats: https://coinstats.app/ (accessed 2026-04-23)
- Zerion: https://zerion.io/ (accessed 2026-04-23)
- DeBank: https://debank.com/ (accessed 2026-04-23; limited content returned)
- Wealthfolio: https://wealthfolio.app/ (accessed 2026-04-23)
- Ghostfolio: https://ghostfol.io/en (accessed 2026-04-23; limited content returned)
- StockAnalysis.com: https://stockanalysis.com/ (accessed 2026-04-23)
- Rocket Money: https://rocketmoney.com/ (accessed 2026-04-23)
- YNAB: https://ynab.com/ (accessed 2026-04-23)
- PocketSmith: https://pocketsmith.com/ (accessed 2026-04-23)
- Tickeron: https://tickeron.com/ (accessed 2026-04-23)
- Lemon.markets: https://www.lemon.markets/ (accessed 2026-04-23)

### Secondary (sourced because primary returned 403/404/429)

- WallStreetZen "Best AI Portfolio Management Tools" 2025-2026: https://www.wallstreetzen.com/blog/best-ai-portfolio-management-tools/ (for Magnifi, Range $2,655/yr, Tickeron tiers, Fiscal.ai pricing)
- Investing.com Academy "Best Finance Chatbots" 2025-2026: https://www.investing.com/academy/investing-pro/best-finance-chatbots/ (for WarrenAI pricing, chatbot comparative)
- Product Hunt: https://www.producthunt.com/products/fey (for Fey launch date, Wealthsimple acquisition)
- Product Hunt Investing topic: https://www.producthunt.com/topics/investing (for recent launches discovery)

### Unreachable on 2026-04-23 (flagged for re-scan)

- Magnifi landing + pricing (HTML returned minimal content)
- Finary all locales (403/404)
- CoinTracker both .com and .io (403/404)
- Atom Finance consumer (go.atom.finance 404 — likely sunset)
- Fiscal.ai direct pricing page (429 rate-limit)
- Copilot Money pricing page (403)
- Ghostfolio pricing detail

---

## 12. Appendix — artifact index

- `competitor-matrix.md` — 34-product feature comparison by category
- `competitor-positioning.md` — verbatim landing-copy audit, claims matrix, trust placement
- `pricing-landscape.md` — 9 archetypes, crowded-tier analysis, our proposed pricing vs field
- `USER_RESEARCH/hypotheses.md` — hypothesis log (to be created next) with IDs, sources, status
- `USER_RESEARCH/interview-scripts/` — Mom-Test compliant scripts (next deliverable)
