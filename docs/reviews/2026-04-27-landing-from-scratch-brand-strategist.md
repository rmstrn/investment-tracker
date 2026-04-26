# Provedo — Strategic Positioning Vision (from scratch)

**Author:** Brand strategist (outside perspective, cold read)
**Date:** 2026-04-27
**Status:** Strategic input for landing redesign — for right-hand synthesis
**Constraint applied:** No prior project docs read. Naming locked = Provedo. No advice/trading positioning.

---

## Pre-work: where 2026 fintech-AI actually sits

Before claiming a position, three observations about the 2026 landscape that drive everything below:

1. **«AI for your portfolio» is a saturated noun phrase.** Magnifi, Range, Rainbook, Daffy, Catchup, dozens of robo-advisors with «AI» bolted on. The category is loud and undifferentiated. Most pitches collapse into «smarter dashboard» or «chat with your money».

2. **The cited-source / RAG pattern is the dividing line.** Perplexity broke the pattern publicly. In finance, citations are not a feature — they are the regulatory and trust moat. Products that answer without showing receipts read as either reckless or hallucinating in 2026.

3. **Aggregation is commoditized; interpretation is not.** Plaid, SnapTrade, and broker APIs have made «we read all your accounts» table-stakes for any serious entrant. The wedge is no longer *seeing* the data — it is *understanding what is in front of you*.

Provedo sits at the intersection of these three. That intersection is where the bold, defensible claim lives.

---

## 1. The one-sentence pitch

> **Provedo is the answer engine for your own portfolio — every reply cited, nothing prescribed.**

Why this sentence:
- «Answer engine» (not chatbot, not assistant, not dashboard) — claims the Perplexity pattern explicitly. This is the recognizable mental model in 2026.
- «For your own portfolio» — the differentiator vs. general-market answer engines. Personal scope, your data, your positions.
- «Every reply cited» — the trust claim. One word doing massive work.
- «Nothing prescribed» — the regulatory boundary, reframed as a virtue (independence) instead of a limitation.

Alternative tighter version if hero must be 6 words:
> **The cited answer engine for your portfolio.**

---

## 2. Category claim

**Claim a new category name: «Portfolio answer engine».**

Not «AI portfolio tracker» — that's the trailing category and Provedo will lose to whoever has the prettiest dashboard.
Not «AI financial advisor» — regulatorily off-limits and crowded.
Not «portfolio chat» — too small a feature, not a category.

«Portfolio answer engine» does three things:
- **Borrows recognized scaffolding** from «answer engine» (Perplexity has done the public education work; we don't have to define what it means).
- **Restricts scope to «portfolio»** so the user immediately understands the domain.
- **Implies questions in, answers out** — not dashboards, not advice, not trades. Pure cognition layer.

This is a category of one until someone copies it. That's the point.

---

## 3. The «only»

> **Provedo is the only product that turns your real holdings into a queryable, source-cited knowledge base.**

Unpack the «only»:
- **Real holdings** (not generic market data, not paper portfolios) — your actual positions across US brokers, EU brokers, crypto wallets.
- **Queryable** (natural-language, conversational) — not «filter and sort», not «build a chart».
- **Source-cited** (every claim links back to filings, exchange data, your own statements, or analyst reports) — not «trust the AI».
- **Knowledge base** (durable, growing, accretive) — not ephemeral chat history.

The composite is unique. Magnifi has chat but no citations on portfolio scope. Getquin has tracking but no answer layer. Bloomberg has citations but is institutional-priced and not personalized to your holdings. Perplexity Finance has citations but no portfolio integration.

Provedo = **Perplexity × your brokerage statements**.

---

## 4. ICP definition

**Primary ICP: «The Researcher-Investor».**

Specific portrait:

- **Age:** 28–45.
- **Net liquid investable:** $50K–$1.5M (above the robo-advisor floor, below the private-banker floor — the abandoned middle).
- **Accounts:** 3–8 accounts across at least two of: US broker (IBKR, Schwab, Fidelity), EU broker (Trading 212, Degiro, Revolut Invest), crypto (Coinbase, Kraken, self-custody).
- **Behavior:** Already reads 10-Ks, listens to earnings calls, follows finance Twitter / FT / Substacks. Manages portfolio actively (not daily-trading, but rebalances quarterly with intent).
- **Pain:** Spends 3–6 hours/month reconciling positions across accounts. Spends another 5–10 hours/month answering basic questions about own portfolio («what's my real USD exposure», «what's my effective tech weight including ETF look-through», «when did I last add to X», «what's my YTD after FX»). These are not advice questions. They are **bookkeeping-in-natural-language** questions.
- **Tools they currently glue together:** Google Sheets, Portfolio Performance (open-source desktop app), broker UIs, ChatGPT (with manual data paste), maybe Sharesight or Snowball.
- **Identity:** Thinks of themselves as «I do my own research». Will not pay for advice. Will pay for **leverage on their own thinking**.

This person doesn't exist in the marketing material of a single competitor I'd name below. Magnifi targets the «I want recommendations» persona. Getquin targets the «I want a pretty tracker» persona. Bloomberg targets the institution. Sharesight targets the tax-reporter. Provedo targets the **active-but-independent self-researcher**, and that segment has been talking to ChatGPT manually for three years because nothing built for them exists.

---

## 5. Wedge strategy

**Wedge: Crypto-and-equities multi-jurisdictional self-researchers, EU-leaning, English-speaking.**

Why this sub-slice first:

1. **Aggregation pain is most acute.** US-only investors can use Wealthfront / Empower. EU+US+crypto investors have no consolidated tool — they're stuck on spreadsheets. The pain is sharpest where the existing market is thinnest.

2. **Lower advice-regulation surface.** Targeting non-US users first reduces SEC/FINRA exposure during pre-alpha. EU MiFID II treats information services more permissively than US investment-adviser law when no recommendations are issued.

3. **The persona is online and findable.** They cluster on r/EuropeFI, r/Bogleheads, finance Substacks, IBKR forums. Acquisition is targeted, not broad.

4. **They will tolerate pre-alpha rough edges** because their current alternative is a Google Sheet with VLOOKUPs.

5. **Once won, this wedge expands naturally** to (a) US-domestic self-researchers, (b) family-office juniors who do the work for principals, (c) RIA support staff doing client portfolio Q&A.

The wedge gives Provedo a defensible beachhead: the «multi-broker, multi-asset, citation-required» quadrant where larger competitors haven't bothered to compete because the audience is too sophisticated for mass-market products and too small for institutional ones.

---

## 6. The page's central job

**One idea a cold visitor must leave with after 30 seconds:**

> «There is finally a way to ask questions about my own portfolio and get real answers with sources — without anyone telling me what to do.»

Three sub-beats that compose this idea, in priority order:

1. **«My own portfolio»** — visitor sees their broker logos (IBKR, Schwab, Coinbase, etc.) on the page within the first scroll. Recognition = «this is for me».
2. **«Real answers with sources»** — visitor sees a sample exchange where the AI answers a portfolio question and **the citations are visible in the screenshot**. Not a screenshot of a chat bubble — a screenshot of a chat bubble *with footnoted sources*.
3. **«Without anyone telling me what to do»** — visitor reads one line that explicitly says Provedo answers, doesn't advise. This converts the regulatory limit into a positioning weapon: «we respect that you make your own decisions».

If the page achieves only this, the rest is detail work. If the page fails to land this in 30 seconds, no amount of feature lists will save it.

---

## 7. Competitor map

| Product | What they claim | Where they sit | Where Provedo sits differently |
|---|---|---|---|
| **Magnifi** | «AI investing assistant» | Recommendation/discovery layer; suggests trades | Provedo never recommends; only answers questions about what you already own |
| **Getquin** | Social portfolio tracker (EU) | Pretty dashboard + community; visualization-first | Provedo is conversational-first; answers questions Getquin's UI cannot ask |
| **Kubera** | Net-worth tracker for HNW | Aggregation + valuation; passive read-only view | Provedo is interrogation, not just observation; you ask, it answers with sources |
| **Sharesight** | Tax + performance reporter | Compliance/reporting layer; structured reports | Provedo is ad-hoc Q&A; complementary, not competitive on tax-day workflow |
| **Snowball Analytics** | Dividend + portfolio analytics | Power-user dashboards with deep filters | Provedo replaces the «build a custom view» ritual with «just ask the question» |
| **Range** | Holistic financial planning + advisor access | Human advice + planning; high-touch | Provedo is no-advice, no-human, self-directed cognition tool |
| **Perplexity Finance** | Cited answer engine for markets | Public market data + general financial research | Perplexity does not know what you own; Provedo does |
| **Bloomberg Terminal** | Institutional data + research | $24K/year, pro-only | Provedo is consumer-priced personal-scope cognition; not trying to compete on data depth |

**The Provedo quadrant is empty.** Citation-required + your-actual-positions + conversational + no-advice. None of the eight competitors above occupy that intersection. That is the defensible space.

---

## 8. Anti-positioning

What Provedo must explicitly **reject**:

1. **«AI that picks stocks for you»** — Magnifi's lane. Both regulatorily dangerous and brand-cheapening. Provedo is the anti-recommendation product.

2. **«All-in-one wealth management super-app»** — the everything-store positioning is where small fintechs go to die. Provedo is one job done extraordinarily well, not five jobs done adequately.

3. **«Pretty dashboard for your portfolio»** — Getquin and 50 others. Visual-first products win on aesthetics; Provedo wins on cognition. If the landing leads with chart screenshots, we've already lost.

4. **«Robo-advisor» / «automated investing»** — implies handing over decisions. Provedo's persona explicitly does not want this; that's why they're not on Wealthfront.

5. **«For everyone who invests»** — false universality. Provedo is for the self-researcher with multi-account complexity. The mass-market index-fund holder doesn't need it. Saying «for everyone» means «for no one specific».

6. **«Beat the market with AI»** — performance-promise positioning. Off-limits regulatorily and reputationally. Provedo doesn't promise outcomes; it promises clarity.

7. **«Replace your financial advisor»** — adversarial framing against humans. Provedo coexists with advisors (the user might still have one for tax or estate work) and is positioned as augmentation of self-research, not replacement of professional relationships.

The discipline of saying «we are not that» is what makes a category claim credible. A landing that lists ten things Provedo *can* do reads as defensive; a landing that names one thing Provedo *is* and three things it explicitly *isn't* reads as confident.

---

## Closing strategic note

The boldest defensible claim in 2026 fintech-AI for a pre-alpha product without funding is **not** «we're a better robo-advisor» or «we have more data». It is a **category-redefining noun**: *answer engine*. Borrowed from a recognized adjacent category (Perplexity), restricted to a defensible scope (your portfolio), and reinforced by a regulatory limit reframed as a moral position (no advice = independence).

Provedo's marketing job for the next 18 months is not feature differentiation. It is **category creation**: making «portfolio answer engine» a phrase that exists in the heads of 10,000 self-researcher investors. Do that, and Provedo becomes the default name for the category — the way Notion became the default for «flexible workspace» before anyone could explain what that meant.

The landing page is the first chisel-strike of that category-creation work.

---
