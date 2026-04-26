# Landing-from-Scratch — User-Researcher View

**Date:** 2026-04-27
**Author:** user-researcher
**Reports to:** right-hand
**Brief:** Define ONE ICP segment for the new Provedo landing, plus the JTBD that drives them. No prior research consulted.

---

## Method note

I have not read prior ICP docs, hypothesis logs, or positioning artefacts for this exercise. This is a first-principles cut from the product description plus general knowledge of retail-investing behaviour, AI-tool adoption patterns (2024-2026), and how multi-broker retail investors actually behave (forums, Reddit threads, public surveys, fintech case studies). Where I make a claim that should be tested against live interviews before locking, I mark it `[ASSUMPTION → test]`.

The product as described:
- Chat-first portfolio AI
- Reads every broker (US/EU/crypto)
- Cited answers
- Read-only, no advice, no trading
- Pre-alpha, solo founder, no funding

This combination has a specific natural buyer. Not the buyer marketers wish for — the buyer the product accidentally fits.

---

## 1. The ONE ICP segment

### Persona: "The Scattered Optimiser"

A working professional, **32-42 years old**, who accumulated investment positions across multiple platforms over 5-10 years and now has lost the thread on what they actually own.

**Concrete demographic:**
- Age: 32-42 (peak years of "I started investing seriously after 2018-2020 and never consolidated")
- Geography: US-primary, EU-secondary (English-speaking; multi-jurisdictional broker mess is most acute here)
- Income: $90k-180k household; not rich, not broke; the band where investing is a real activity but not a profession
- Profession cluster: **mid-career individual contributors and managers in tech-adjacent fields** — software engineers, designers, PMs, data analysts, technical marketers, consultants, biotech, healthcare-IT, finance ops (not portfolio managers themselves)
- Lifestyle: dual-income or solo; partnered or in a serious relationship; may or may not have kids; lives in a metro; works hybrid or fully remote
- Tech fluency: **high** — uses ChatGPT or Claude weekly, has tried Notion, has at minimum one paid SaaS tool they actually use (Things, Linear, Raycast, 1Password), comfortable connecting accounts via OAuth

**Their actual portfolio (this is the load-bearing part):**
- **3 to 6 accounts across 2 to 4 brokers**, typically a mix like:
  - Fidelity or Schwab (rolled-over 401k, IRA)
  - Robinhood or E*TRADE (the first taxable brokerage they opened)
  - Coinbase or Kraken (crypto bag from 2020-2021)
  - Maybe Wealthfront or Betterment (the "I'll just automate it" account)
  - Maybe a foreign broker (IBKR for international, or a home-country broker for EU folks)
- Total invested: **$50k-400k** — past the "single account is fine" stage, below the "I have a financial advisor" stage
- They check positions **2-5 times per week**, mostly via mobile apps, mostly out of low-grade anxiety, not for action
- They have NOT made a meaningful trade in 60+ days for most positions; they're **holders with anxiety**, not traders

**Their fears (as they would phrase them, not as a marketer would):**
- "I have no idea what my actual asset allocation is"
- "I'm probably way over-concentrated in tech and don't realise it"
- "Half my crypto is in some wallet I haven't checked since 2022"
- "If something happens to me my partner has no idea what's where"
- "Every quarter I tell myself I'll consolidate and I never do"
- "I keep getting blindsided by tax stuff"

**The language they actually use** (test this — ASSUMPTION based on Reddit r/personalfinance, r/Bogleheads, r/fatFIRE adjacency):
- "Portfolio" — yes, but more often "my accounts" or "all my investments"
- "Asset allocation" — only the ones who read Bogleheads
- "Diversification" — passive vocab, they recognise it but don't say it unprompted
- "Concentration risk" — almost never unprompted
- "Tax-loss harvesting" — recognise it; don't actively do it
- "Net worth" — yes, this word lands; they Google "net worth tracker" more than "portfolio analyser"
- "Where my money actually is" — this phrase is gold and shows up in interview transcripts of similar segments
- "Just tell me if I'm okay" — the actual emotional ask underneath

---

## 2. Why THIS segment first

### The wedge logic

A pre-alpha, solo-founder product cannot win a broad "retail investor" market. It needs a segment that satisfies five conditions:

1. **The pain is acute and recurring**, not theoretical
2. **Existing tools fail them in a specific way** the product happens to solve
3. **They will pay** (not a free-tool-only segment)
4. **They will tell other people** (network effects via word-of-mouth)
5. **They are reachable cheaply** (founder-led channels, not paid acquisition)

**The Scattered Optimiser scores well on all five:**

1. **Acute pain:** they live with low-grade financial anxiety and the mess gets worse every year. Not theoretical.
2. **Existing tools fail in a specific way:** Mint died, Empower (Personal Capital) sells advisor calls, Kubera is dashboard-heavy and dry, Snowball Analytics is dividend-nerdy, brokers' own apps don't see other brokers. None of them answer questions in plain English. The "answer my actual question with citations" gap is real for this segment specifically — they already use ChatGPT for everything else and notice the gap immediately.
3. **They will pay:** this segment pays for Notion, Things, 1Password, ChatGPT Plus, possibly Claude Pro, possibly Raycast Pro. They are normalised to $10-20/month for tools that reduce friction. `[ASSUMPTION → test willingness for finance-tool specifically; finance-paid-tool conversion is historically lower than productivity-tool conversion]`
4. **They will tell others:** mid-career tech-adjacent professionals share tool recommendations in Slacks, group chats, and Twitter/Bluesky. Strong word-of-mouth surface.
5. **Reachable cheaply:** founder can post in r/personalfinance, r/fatFIRE, r/Bogleheads, Hacker News, Indie Hackers, Bluesky finance circles, Twitter FinTwit-but-not-trader-FinTwit, Bogleheads forum. Zero paid acquisition needed at pre-alpha stage.

### Why NOT start broad

The product description ("chat-first portfolio AI for every retail investor") is the kind of generic positioning that loses to specific competitors at every segment boundary:

- **Versus Robinhood-native traders:** loses because Provedo doesn't trade
- **Versus Bogleheads disciples:** loses because the disciples don't want chat, they want a spreadsheet
- **Versus FAs' clients:** loses because they already have a human telling them what to do
- **Versus crypto-natives:** loses because pure crypto users want DeFi-native tools, not broker integrations
- **Versus complete beginners:** loses because beginners don't have multi-broker pain yet

A landing aimed at "everyone" is read by the Scattered Optimiser as: "this is not for me specifically, so it must be for someone less serious than me." That is the worst possible signal for a segment whose central complaint is "no one takes my actual situation seriously."

---

## 3. Top 3 JTBD (ranked by intensity)

JTBD format: **When [situation], I want to [motivation], so I can [outcome].**

### JTBD #1 — Reconciliation (highest intensity)

**When** I have positions scattered across 4+ accounts and I haven't looked at the full picture in months,
**I want to** ask "what do I actually own and what is it worth right now" and get one honest answer with the underlying numbers I can verify,
**so I can** stop carrying the low-grade anxiety of not knowing my own financial state.

This is the single strongest pull. It's the job that gets them to sign up. Everything else is downstream of this.

Evidence pattern to look for in interviews: phrases like "I just want to see it all in one place," "I've been meaning to do this for two years," "I tried Mint, then I tried Empower, but..."

### JTBD #2 — Concentration sanity-check

**When** I suspect I'm over-exposed to one stock, sector, or asset class but I'm not sure how badly,
**I want to** ask "am I dangerously concentrated in tech / in one stock / in USD" and see the breakdown with sources,
**so I can** decide whether to do something about it (without being told what to do).

This is the recurring-use job. Reconciliation gets them in; concentration sanity-checks bring them back monthly. The "without being told what to do" part is critical for this segment — they are sophisticated enough to feel insulted by prescriptive advice and savvy enough to know that prescriptive advice from an AI is a regulatory liability.

The "no advice" stance the product already takes is a **feature** for this segment, not a limitation.

### JTBD #3 — Question-answering at the moment of doubt

**When** something happens (market drop, news event, tax season, partner asks me a question, I'm reviewing accounts before a big decision),
**I want to** ask a specific question about my own portfolio in plain English and get a cited answer in under a minute,
**so I can** make my own decision faster instead of opening 4 broker apps and a spreadsheet.

This is the chat-first-native job. It's the one that justifies the chat interface over a dashboard. If the product can't deliver on this in under 60 seconds end-to-end, the chat-first thesis collapses for this segment.

### What I deliberately did NOT put in the top 3

- **Tax optimisation.** Real, but it's a job they hire CPAs for, not chat tools. Risk of overclaim.
- **Performance benchmarking.** Real, but not anxiety-inducing for this segment; it's a "nice to know," not a "need to know."
- **Rebalancing.** Real, but it crosses into advice territory, which the product correctly refuses.
- **Goal planning.** This is the FA / Wealthfront job; not the Scattered Optimiser job.

---

## 4. Top 3 anxiety triggers (why they DON'T sign up)

Be honest about these, because they kill conversion.

### Anxiety #1 — "I'm about to give an unknown startup read access to every account I own"

This is **the single largest barrier** for this segment. They are tech-fluent enough to know what OAuth / Plaid / aggregator-key risk actually is. They have read the Equifax stories. They will not connect Fidelity + Schwab + Coinbase to a pre-alpha product without significant trust signals.

What they want to see (in priority order):
1. Plaid / SnapTrade / Yodlee / Akoya named explicitly as the aggregator (a known liability layer)
2. "Read-only" stated literally in the connection step, not just on the marketing page
3. Where data is stored (US? EU? encrypted at rest? key management?)
4. SOC 2 status (or honest "we're pre-alpha, here's what we do instead")
5. A founder face and name, not a faceless brand
6. A way to **try the product without connecting anything** (sample portfolio / demo mode)

If the landing does not address this within the first scroll, this segment bounces.

### Anxiety #2 — "AI is going to hallucinate something about my money and I'll act on it"

This segment uses ChatGPT enough to know it lies. They will assume a finance-AI will lie about their numbers unless proven otherwise.

What they want to see:
- **Citations on every number.** "Your AAPL position is 8.2% of portfolio [source: Schwab as of 14:32 today]."
- **Visible source data**, not just narrative
- **Honest "I don't know"** answers when data is missing or stale
- **No prescriptive language** ("you should sell" → instant trust collapse)

The product already says it cites sources. The landing needs to **show the citation pattern visually** in the first screenshot, not just claim it in copy.

### Anxiety #3 — "This is just another wrapper that will die in 6 months"

The 2023-2025 wave of GPT-wrapper products has burned this exact segment multiple times. They've signed up for AI tools that disappeared, leaving them re-doing onboarding for a competitor.

What they want to see:
- A specific reason this product is **different from a thin wrapper** (proprietary pipeline? structured data? something defensible — even if it's just "we built the broker-aggregation layer ourselves")
- Some signal of durability (founder commitment, roadmap honesty, not a generic "raising soon" smell)
- Honesty about pre-alpha status. The Scattered Optimiser respects "this is early, here's what works and what doesn't" far more than "the future of investing." Overclaim is a death signal.

---

## 5. Five-second test for this segment

What must visually/textually hit in the first 5 seconds for a Scattered Optimiser to keep scrolling?

**The signal stack (in 5 seconds, roughly in order of perception):**

1. **A headline that names their specific situation**, not a generic value prop.
   - Bad: "AI for your investments"
   - Bad: "The future of portfolio management"
   - Better: "Every account you own. One honest answer."
   - Better: "Ask one question. Read all your brokers. Get cited answers."
   - Test against: does it mention multiple accounts / multiple brokers? does it mention asking a question? does it avoid "advice" / "smarter investing" / "AI-powered"?

2. **A visible product surface that LOOKS like chat with a portfolio**, not a generic dashboard or a generic ChatGPT screenshot.
   - The hero visual should be a chat exchange: a real-feeling user question ("How concentrated am I in tech right now?") and a cited answer with numbers and source labels.
   - This is the single highest-leverage visual decision on the page.

3. **Read-only / no-advice / no-trading reassurance** must be visible without scrolling.
   - Even as a small badge or inline pill: "Read-only · No trading · No advice"
   - This converts the no-advice constraint from a limitation into a trust signal for this exact segment.

4. **A real broker logo strip** (Fidelity, Schwab, Robinhood, Coinbase, IBKR, etc.) signalling "yes, your specific brokers."
   - The Scattered Optimiser's first scan question is "do they support MY brokers" — answer it before they have to ask.

If those four things are present in the first viewport, you keep this segment for the 30-second test.

---

## 6. Thirty-second test

What they need to see in the next 25 seconds (after the hero) to actually start the signup:

1. **One concrete example exchange shown in full.** Not a marketing claim about what it can do — an actual question + actual cited answer + actual numbers. This is the single most persuasive element on the page for this segment.

2. **Security and aggregator transparency.** Named partner (Plaid / SnapTrade / Akoya), "read-only" said again, "we never store your broker credentials" (or whatever the truth is — do not lie).

3. **A "try without connecting" path.** Sample portfolio / demo. This converts the "I'm not connecting Schwab to a pre-alpha" objection into "fine, let me just see what it does."

4. **One sentence of founder context.** Not a long story. Something like "Built by [name], solo, after [specific moment of pain]." This is a credibility multiplier with this segment because they trust solo-founder products in tools they care about.

5. **Pricing honesty (if priced) or "free during alpha" (if not).** The Scattered Optimiser hates the "request a demo" smell. They want to know what it costs and to be able to start now.

6. **An anti-claim.** Something the product explicitly does NOT do. "We don't trade. We don't recommend. We don't sell your data." Anti-claims create trust faster than positive claims for this segment.

If all six land in 30 seconds, signup intent is set.

---

## 7. Trust ladder (ordered)

The order matters. This segment processes trust signals in a specific sequence; signals out of order are wasted.

**Rung 1 — Visual product proof (seconds 0-5):**
A real chat exchange with cited numbers in the hero. This is the foundation. Without it, no other trust signal works.

**Rung 2 — Specificity proof (seconds 5-15):**
Their broker logos. Their portfolio sizes named in copy. Language that mirrors their internal vocabulary ("scattered across accounts," "what you actually own," "concentrated in tech"). Specificity = "this product was built for me, not for everyone."

**Rung 3 — Security mechanism transparency (seconds 15-30):**
Named aggregator. Read-only. No credential storage. Where data lives. Avoid security theatre ("bank-grade encryption" alone is now a negative signal — this segment knows that phrase is meaningless).

**Rung 4 — Anti-claims and constraints (seconds 30-60):**
What it doesn't do. No advice. No trading. No data resale. The constraints become trust signals.

**Rung 5 — Founder credibility (after 60 seconds):**
Solo founder, real name, real face, public posting history if available. A short "why I'm building this" — not a brand story, a personal motivation.

**Rung 6 — Social / institutional proof (later still):**
Testimonials if real, waitlist count if meaningful, press if any, Plaid / SnapTrade as credibility-by-proxy. **Do not fake or inflate this rung.** The Scattered Optimiser sniffs out fake testimonials within seconds; once they smell it, the whole page collapses.

**Rung 7 — Pricing and exit (anywhere on the page, but always discoverable):**
Clear price. Clear "you can disconnect anytime." Clear "your data stays yours."

What is **NOT** on the trust ladder for this segment:
- Awards, badges, "as seen in" without real coverage
- Generic stock photos of diverse smiling people
- Animated AI brain hero images
- "Powered by GPT-4" as a credential (in 2026 this reads as commodity)
- Dollar amounts of "assets tracked" unless verifiable

---

## 8. Two-to-three segments to NOT optimise for

### Anti-segment #1 — Active traders / day-traders / options-active retail

**Why not:**
- Their job is to trade, fast. A read-only no-trading product is structurally useless to them.
- They want screeners, options chains, level-2 data, fast execution. Not a single thing the product does.
- They won't tolerate "no advice"; they want signal generation, not reflection.
- They're loud on social media. If the landing accidentally markets to them, you'll get traffic that bounces and reviews like "this doesn't even let you trade??"

**Implication for the landing:** every word that sounds like trading-product copy must be cut. No "alpha," no "edge," no "moves," no "trade signals," no "real-time pricing" framed in trader vocab. Speak in holder-vocab.

### Anti-segment #2 — Complete beginners / first-account investors

**Why not:**
- They have one account. The multi-broker reconciliation job is irrelevant.
- They lack the financial vocabulary to ask interesting questions of a chat tool. The product underwhelms them.
- They want education and prescription ("just tell me what to invest in"). The product refuses to do either.
- Acquisition cost is high, retention is low, willingness to pay is low. Worst-quartile segment.

**Implication for the landing:** no "investing made simple" framing, no "start with $5" framing, no "we'll guide you" framing. The Scattered Optimiser reads those phrases as "this is for people more confused than me" and bounces.

### Anti-segment #3 — HNW / family-office-adjacent / advisor-served clients

**Why not:**
- They have a human advisor and an Addepar/Black Diamond-style platform.
- They don't trust pre-alpha SaaS with their full financial picture; the trust threshold is months of relationship-building, not a landing page.
- They want bespoke, not productised. A self-serve SaaS read-only chat is positioned wrong for this segment.
- The product can't compete with Arta, Range, or a full RIA stack on this segment's terms.

**Implication for the landing:** no "wealth management" vocabulary, no $1M+ portfolio screenshots, no "private" / "concierge" / "white-glove" framing. Those move the page out of the Scattered Optimiser's price/psychology range and don't earn the HNW segment either.

---

## 9. Risks I want flagged to right-hand

1. **"Read-only / no advice" can be perceived as toothless** if the landing doesn't reframe the constraint as a trust signal. The constraint is the wedge — if framed as a feature it's a moat; if framed as a limitation it's a leak. This is a copy decision, not a product decision.

2. **The Scattered Optimiser segment overlaps with several other plausible segments** (Bogleheads-curious, FIRE-adjacent, expat-multi-broker). The landing should be specific enough for the core but not exclude these adjacencies in the same view. Risk: over-correction makes the page read as "for one weird niche."

3. **No live interviews exist (assumed).** Every "they say X" claim above is a hypothesis. This segment definition needs to be validated against 8-12 real conversations before locking the landing rebuild. The riskiest assumptions to test first:
   - Whether they actually use ChatGPT for finance-adjacent questions today
   - Whether they will pay $10-20/month for a read-only tool
   - Whether the multi-broker pain is as acute as claimed, or merely acknowledged
   - Whether they actually want chat over dashboard (or want chat-on-top-of-dashboard)

4. **Regulatory framing risk.** Any copy that drifts toward implied advice ("personalised insights," "tailored to you," "your AI advisor") creates legal exposure that legal-advisor should pressure-test. Stay in the question-answering / cited-information lane.

---

# SHORT SUMMARY (≤ 400 words)

## The one ICP

**The Scattered Optimiser** — a 32-42-year-old US-or-EU mid-career tech-adjacent professional ($90k-180k household, $50k-400k invested), who has accumulated 3-6 accounts across 2-4 brokers (Fidelity/Schwab + Robinhood/E*TRADE + Coinbase + maybe a foreign broker) over the last 5-10 years and has lost the thread on what they actually own. High tech-fluency, weekly ChatGPT user, normalised to paying for productivity SaaS. Holds positions with low-grade anxiety rather than trading them. Internal language: "where my money actually is," "I'm probably way over-concentrated," "I need to consolidate but I never do," "just tell me if I'm okay." Past pain with Mint dying, Empower selling advisor calls, Kubera being dry. They are reachable cheaply via founder-led Reddit / HN / Bluesky posting. They will pay; they will tell other people.

## Top 3 JTBD

1. **Reconciliation** — "When I have positions scattered across 4+ accounts and haven't looked in months, I want to ask 'what do I actually own right now' and get one honest cited answer, so I can stop carrying the anxiety of not knowing my own financial state." (Highest intensity — gets them to sign up.)
2. **Concentration sanity-check** — "When I suspect I'm over-exposed to one stock or sector, I want to ask and see the breakdown with sources, so I can decide whether to act — without being told what to do." (Recurring-use job.)
3. **Question-answering at the moment of doubt** — "When something happens (market drop, tax season, partner asks), I want a cited answer in under 60 seconds instead of opening 4 broker apps." (The chat-first-native job.)

## Top 3 anxiety triggers

1. "I'm about to give an unknown startup read-access to every account I own." (Largest barrier.)
2. "AI is going to hallucinate about my money and I'll act on it."
3. "This is just another GPT-wrapper that will die in 6 months."

## Five-second-test signal

A hero visual that **shows a real chat exchange with cited numbers** ("How concentrated am I in tech?" → cited answer with broker source labels), under a headline that names their specific multi-broker situation, with read-only / no-trading / no-advice visible as a trust pill, and a real broker-logo strip in view.

## Top 1 anti-segment

**Active traders / day-traders.** Read-only no-trading is structurally useless to them; their vocabulary in the page poisons it for the Scattered Optimiser.

## Top 1 risk

The product's "read-only / no advice" constraint must be **reframed as a trust signal**, not described as a limitation. The constraint is the wedge — copy decisions on the landing determine whether it reads as a moat or a leak.
