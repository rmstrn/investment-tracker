# Pricing Tier Validation — Free / Plus / Pro Boundary Sanity Check

**Owner:** `finance-advisor` agent (internal SME, NOT registered investment advisor)
**Date:** 2026-04-23
**Status:** pre-alpha validation; numbers are hypotheses until real cohort data lands
**Depends on:** `02_POSITIONING.md` v3.1 pricing tiers, `COACH_TIER_PLACEMENT.md`, `BENCHMARKS_SOURCED.md`, `AI_CONTENT_VALIDATION_TEMPLATES.md`
**Skills applied:** `finance-skills:saas-metrics-coach` (tier structure), `c-level-skills:cfo-advisor` (unit economics + conversion funnel), `finance-skills:business-investment-advisor` (ROI/NPV-per-tier)

---

## 1. Executive summary

PO-locked tiers per `02_POSITIONING.md`:

| Tier | Price | Annual equiv | Core value |
|---|---|---|---|
| **Free** | $0 | $0 | 2 accounts, 90-day history, basic charts + allocation, AI Chat **50 messages/month (no daily cap) on Haiku**, 1 insight/week, Coach teaser (1/month, warm-start) |
| **Plus** | ~$8-10/mo | ~$96-120/yr | Unlimited accounts, full history, unlimited chat on Sonnet, daily insights, dividend calendar, benchmark comparison, CSV export, full Coach pattern-reads. **14-day trial, card required at signup.** |
| **Pro** | ~$20/mo | ~$240/yr | Everything in Plus + tax reports per jurisdiction, advanced analytics (Sharpe/Sortino/factors/max drawdown), custom alerts, API access, advanced Coach categories |

**Model routing (per DECISIONS 2026-04-23):**
- Free tier AI responses: **Claude 3.5 Haiku** (5x cheaper than Sonnet; sufficient quality for Free-tier depth)
- Plus + Pro (and 14-day Plus trial): **Claude 3.5 Sonnet** (full product experience)

**Trial structure (per DECISIONS 2026-04-23):**
- 14-day Plus access, card required at signup
- Card charged on day 14 → Plus subscription OR auto-downgrade to Free if card fails / user cancels
- Card-required pattern trades some trial uptake for much better trial→paid conversion (industry standard; see §6.4)

**Finance-advisor verdict: SUPPORT (post-2026-04-23 4-locks patch). Free-tier sustainability red flag from v1 is RESOLVED by Haiku routing + 50 msg/mo monthly cap. Trial economics are SAFE with wide margin. Plus + Pro margin analysis unchanged from v1 and remains healthy.**

### Verdict breakdown:

1. **Tier structure itself is sound for Lane A + freemium retail fintech.** Three-tier ladder matches industry convention; price anchors ($0 / $8-10 / $20) are competitively positioned without being head-to-head undercuts or premium anomalies.
2. **Pro at $20 sits EXACTLY at PortfolioPilot Gold price.** This is head-to-head on price axis with a competitor that has RIA registration ($30B AUM / 40K users / Lane C advice on paid tiers). Provedo's differentiation at this price point depends on Lane A POSITIVE trust + Coach uniqueness + EU/UK geography coverage + dashboard-primary UX. If any of those fail to differentiate convincingly at alpha, Pro conversion risks Pareto loss to PortfolioPilot Gold at the same price.
3. **Plus at $8-10 is in a 4-way crowded cluster** (Copilot $7.92, Snowball $9.99, Monarch $8.33, Getquin €7.50). Price anchor is fine; differentiation must come from product-experience uniqueness (Coach + unlimited chat + Provedo's «remembers» metaphor) at this price point, not from being cheaper or more features.
4. **Free tier is the conversion keystone AND the cost-to-serve risk.** Free has negative gross margin per user (LLM inference cost > $0 revenue). Tolerable if Free → Plus conversion rate is within hypothesis range (3-7%); becomes a financial problem if Free is heavily used without conversion (high-usage Free user burns $X/month in Anthropic API with no offset). See §5 cost-to-serve + §6 conversion funnel.
5. **Coach 30-day cold-start (per 2026-04-23 review §7.1 + `COACH_TIER_PLACEMENT.md` §3) materially affects Free → Plus conversion.** Warm-start backfill is the decisive operational variable. Warm-start path: conversion funnel works. Cold-start path: Plus conversion may come in 30-50% below hypothesis.

---

## 2. Per-tier value mapping (what user gets, what's gated)

### 2.1 Free tier ($0)

**Included (what user experiences):**
- Dashboard view of aggregated portfolio (up to 2 broker accounts)
- Basic charts: allocation pie, time-series value chart
- 90-day history retention (everything older is gated)
- AI Chat: **50 messages per calendar month, no daily cap (burstable), served by Haiku model**
- Insights: 1 per week, curated from available observations (served by Haiku)
- Coach: 1 teaser per month, Plus-paywalled detail (see `COACH_TIER_PLACEMENT.md`)
- Email weekly digest (1/week)
- Mobile + web access (equal citizens per `02_POSITIONING.md`)

**Gated (requires upgrade):**
- 3rd broker account onward
- History beyond 90 days
- 51st chat message in a calendar month
- Sonnet-quality AI responses (Free tier gets Haiku)
- Coach pattern detail unlock
- Daily insights (beyond 1/week)
- Dividend calendar view
- Benchmark comparison against retail medians
- CSV export of any data

**Rationale for 50/mo monthly cap with NO daily limit (per DECISIONS 2026-04-23):**
- PO chose monthly cap only (rejected 3/day + 60/mo combo proposed in v1)
- User can burst 10 messages in one day and be silent the next — more retail-friendly usage pattern
- 50/mo is tighter than v1-proposed 60/mo — better unit economics, same UX shape
- Haiku routing (5x cheaper than Sonnet) makes the cap generous in value terms without being expensive in COGS terms

### 2.2 Plus tier ($8-10/mo)

**Adds (beyond Free):**
- Unlimited broker accounts (vs. 2 on Free)
- Full history retention (vs. 90 days on Free)
- Unlimited AI Chat on Sonnet (vs. 50/mo on Haiku for Free)
- Daily insights (vs. 1/week on Free)
- Dividend calendar view with ex-dates + payment dates
- Benchmark comparison (vs. retail aggregates where sourced — see `BENCHMARKS_SOURCED.md`)
- CSV export of portfolio data + insights + chat history
- **Full Coach pattern-reads (core categories: chasing-momentum, disposition-effect, anchoring, loss-aversion, concentration-drift)**
- Coach follow-up chat integration (ask Provedo about a pattern)
- Priority support (email within 48 hours)

**Gated (Pro only):**
- Tax reports per jurisdiction
- Advanced analytics (Sharpe, Sortino, factor exposures, max drawdown)
- Custom alerts
- API access
- Advanced Coach categories (factor-drift, TLH-missed, sector-rotation)
- Historical retrospectives in Coach

### 2.3 Pro tier ($20/mo)

**Adds (beyond Plus):**
- **Tax reports per jurisdiction** (US, UK, DE, FR, IT, ES, NL — per launch geography; requires tax-rule compliance work per jurisdiction)
- **Advanced analytics** — Sharpe ratio, Sortino ratio, factor exposures (value/growth/small/large/quality/momentum), max drawdown, rolling-window risk metrics
- **Custom alerts** — user-configurable triggers (concentration threshold, drawdown depth, dividend received, pattern detected)
- **API access** — programmatic portfolio read (not trading execution; Lane A preserved)
- **Advanced Coach categories** — factor-exposure-drift, tax-loss-harvesting-missed, sector-rotation-pattern
- **Historical retrospectives** in Coach — «3rd time you've shown this pattern since [date]»
- Export enhancements (CSV + API + potentially PDF tax reports)
- Power-user priority support (email within 24 hours)

### 2.4 Value progression analysis

| Axis | Free | Plus | Pro |
|---|---|---|---|
| Broker accounts | 2 | unlimited | unlimited |
| History | 90 days | full | full |
| Chat | 50/mo on Haiku | unlimited on Sonnet | unlimited on Sonnet |
| Insights | 1/week | daily | daily + custom alerts |
| Coach | 2 teasers/mo (detail gated, contextual icons) | full core patterns | full + advanced + retrospectives |
| Analytics | basic (allocation, time-series) | + dividend calendar, benchmarks | + Sharpe, Sortino, factor, max drawdown |
| Tax | none | none | per-jurisdiction reports |
| Export | none | CSV | CSV + API |

Progression is MONOTONIC (each tier strictly expands the previous). No features are «downgraded» across tiers. Good structure.

---

## 3. Comparison vs key competitors

### 3.1 PortfolioPilot Gold ($20/mo = $240/yr) — HEAD-TO-HEAD on Pro price

Per `docs/product/pricing-landscape.md` + `docs/product/01_DISCOVERY.md` §4.5:

**PortfolioPilot Gold provides:**
- AI chat with portfolio-aware LLM (limited vs Platinum unlimited)
- Scenario planning
- Complete financial advice (Lane C RIA under written Client Agreement — they are a registered advisor on paid tiers)
- Hidden fee detection
- Tax optimization
- Portfolio aware of 12,000+ institutions (aggregation breadth)
- $30B AUM / 40K+ users proof point

**Provedo Pro ($20/mo) provides:**
- Unlimited AI chat with Lane A positive-trust-signal framing
- Scenario chat interactions
- Tax reports per jurisdiction (different from PP «tax optimization»; more retrospective vs. prospective)
- Advanced analytics (Sharpe, Sortino, factor, max drawdown)
- Advanced Coach (factor-drift, TLH-missed, sector-rotation) + retrospectives
- API access
- Custom alerts
- Multi-market coverage (US + EU + UK + LATAM + APAC + crypto)
- Lane A «we are not selling you anything» positive trust signal

**Comparison verdict — at identical price ($20/mo):**

| Axis | PortfolioPilot Gold | Provedo Pro | Provedo edge? |
|---|---|---|---|
| Proof / AUM | 40K users, $30B AUM | pre-alpha, 0 users | PP dominant |
| AI chat depth | Limited on Gold | Unlimited | Provedo edge |
| Regulatory lane | Lane C (RIA on paid) — can recommend | Lane A (observation-only) — cannot recommend | Depends on ICP — some users WANT advice (favors PP), others AVOID advice (favors Provedo) |
| Coach (behavioral patterns) | Does NOT have this surface | HAS this surface | Provedo edge — structural differentiator |
| EU / UK / multi-market | US-focused | Multi-market from day 1 | Provedo edge |
| Tax | Prospective «tax optimization» suggestions | Retrospective tax reports per jurisdiction | Different product shapes |
| Scenario planning | YES | YES (via chat) | Parity |
| Trust narrative | «Advisor we pay for» | «Memory that doesn't advise» | Depends on ICP preference |
| Dashboard / aggregation UX | Mature | Unknown pre-alpha (dashboard-primary per Q3 lock) | PP dominant at launch |

**Finance-advisor assessment:** At identical $20 price, Provedo Pro has real differentiation on 3 axes (Coach, EU/UK coverage, Lane A positive-trust) but loses on 3 axes (proof/AUM, regulatory lane for users who want advice, dashboard maturity). Net: differentiation is REAL but needs to be EARNED at alpha; cannot be assumed from positioning alone.

**Risk flag:** ICP A (multi-broker millennial, post-advisor-distrust) SHOULD prefer Provedo Pro. ICP B (AI-native newcomer) may prefer PortfolioPilot (wants guidance, not observation). Positioning already has ICP B as tertiary. Pricing assumption assumes ICP A dominance.

### 3.2 Getquin Premium (€90/yr = ~$97/yr) — CLOSE to Plus annual

Per `docs/product/01_DISCOVERY.md` §4.6 + competitor scan:

**Getquin Premium provides:**
- Unlimited broker connections
- Premium analytics (AI-powered portfolio analysis — state/forward-facing AI)
- Extended history
- EU-dominant market presence (500K users)

**Getquin Wealth (€150/yr = ~$162/yr) adds:**
- «AI Financial Agents» — conversational AI layer (comparable to Provedo's chat)
- Still state/forward-facing AI — no retrospective behavioral pattern detection (confirmed per getquin-deep-dive.md)

**Provedo Plus ($96-120/yr equivalent) provides:**
- Unlimited chat with behavioral memory (Getquin: has chat in Wealth tier only)
- **Full Coach pattern-reads** (Getquin: does not have equivalent — structural differentiator)
- Dividend calendar, benchmark comparison, CSV export
- Multi-market (Getquin is EU-dominant, US second-class)

**Comparison verdict vs Getquin:**

At Provedo Plus $96-120/yr vs Getquin Premium €90/yr (~$97/yr):
- Similar price, similar year
- Provedo's full chat is HERE at Plus; Getquin's conversational AI is NOT at Premium (€90/yr) — it's at Wealth (€150/yr)
- Provedo's Coach is the structural differentiator Getquin lacks at any tier
- Getquin has maturity + 500K user base; Provedo does not (pre-alpha)

**Net:** Provedo Plus at $96-120 vs. Getquin Premium €90/yr offers MORE AI-integrated features at similar price + a structural differentiator Getquin doesn't have anywhere. **Defensible value proposition.**

### 3.3 Snowball Starter ($79.99/yr) — CHEAPER than Plus annual

Per `docs/product/pricing-landscape.md`:

- Dividend-tracker orientation (different positioning axis)
- 1 portfolio, 10 holdings cap on Starter
- Higher tiers $149.99 (Investor) / $249.99 (Expert)

**Comparison verdict:** Different segment. Snowball serves dividend-income-focused retail. Provedo Plus serves broader «AI-integrated portfolio memory» segment. Not direct price comparison.

### 3.4 Mezzi Core ($299/yr) — EXPENSIVE (different lane)

Per `docs/product/pricing-landscape.md`:

- Fiduciary advice framing (Lane B-equivalent)
- Aggregation via Plaid + Finicity

**Comparison verdict:** Different lane. Provedo does not compete on advice; Mezzi is advice-first. No direct comparison.

### 3.5 ChatGPT Plus ($20/mo) — COMMODITY AI ANCHOR at Pro price

Not direct competitor on functionality but anchors the $20/mo price in user mental model as «what I pay for AI». Users comparing Provedo Pro $20 to ChatGPT Plus $20 may question «why pay both?». **Mitigation:** positioning makes Provedo specifically about portfolio memory (vs. generic LLM chat); the value delta is portfolio-awareness + multi-broker aggregation + behavioral coach — things ChatGPT Plus cannot do.

---

## 4. Value-per-dollar analysis for each tier

### 4.1 Free tier — $0 per user per month

Value delivered: commodity dashboard + limited AI chat + 1 weekly insight + 1 monthly coach teaser = similar to Getquin-free / PortfolioPilot-free / Kubera-trial baseline.

**User's perception of value-per-dollar:** positive (anything for free is positive). BUT: retention depends on whether Free tier delivers ENOUGH differentiated value to convert. Commodity-level features at $0 do not drive conversion; differentiated activation (Coach teaser + unique brand framing) drives conversion.

**Provedo's cost per Free user:** see §5 cost-to-serve. Negative gross margin by definition.

### 4.2 Plus tier — $8-10/mo

Price conversion: $8/mo = $0.27/day; $10/mo = $0.33/day.

Value delivered per month:
- ~30 chat conversations (assuming daily use; unlimited allowance)
- ~30 daily insights (personalized observations across portfolio)
- ~1-4 Coach pattern-reads per month (depends on trade frequency + pattern occurrence)
- Dividend calendar tracking (passive value)
- Benchmark comparison (passive value)
- CSV export (on-demand value)

**Value-per-dollar:** user pays $0.27-0.33/day for 30+ personalized data interactions + memory + pattern detection. Comparable coffee-shop cost (€2-3 coffee). For ICP A ($20-100K portfolio), this is <0.01% of portfolio value annually — economically invisible if value is demonstrated.

**Risk:** if Chat + Insights + Coach do NOT deliver ongoing value (novelty fade after month 1-3), perceived value-per-dollar drops fast. Monthly churn 4-7% hypothesis reflects this risk.

### 4.3 Pro tier — $20/mo

Price conversion: $20/mo = $0.67/day; $240/yr is ~0.2-1% of a $20-100K portfolio (ICP A range).

Value delivered per month (incremental over Plus):
- Tax reports per jurisdiction (seasonal peak at year-end / tax filing)
- Advanced analytics (Sharpe/Sortino/factor/max drawdown — episodic use, high value when used)
- Custom alerts (ongoing passive value)
- API access (developer / power-user value)
- Advanced Coach (factor-drift, TLH-missed, sector-rotation — lower-frequency firings, higher-depth value)
- Historical retrospectives (ongoing value, compounds with time)

**Value-per-dollar:** $20/mo is justifiable for user who USES the advanced features. If user subscribes to Pro but only uses Plus features, they paying 2x for no marginal value — churn risk.

**Key retention mechanism: tax report seasonal stickiness.** Once user generates Provedo tax report in February/March for 2025 tax year, switching cost is high for following year (data continuity, report format familiarity, jurisdiction-specific calculations).

### 4.4 Summary value-per-dollar table

| Tier | Price/mo | Price/day | % of $50K portfolio/yr | Differentiated value unlocked |
|---|---|---|---|---|
| Free | $0 | $0 | 0% | Commodity tracker + limited AI + 1 monthly Coach teaser |
| Plus | $8-10 | $0.27-0.33 | 0.19-0.24% | + Unlimited AI chat, + daily insights, + full Coach core patterns |
| Pro | $20 | $0.67 | 0.48% | + Tax reports, + advanced analytics, + advanced Coach, + API, + custom alerts |

At percentages of portfolio value, all tiers are economically invisible if they deliver on value promise. The bottleneck is value-demonstration, not price-affordability.

---

## 5. Cost-to-serve per tier

**Critical pre-alpha analysis:** what does each tier cost Provedo per user, especially on LLM inference? **This section updated 2026-04-23 post-4-locks patch for Haiku routing on Free + Sonnet on Plus/Pro/Trial.**

### 5.1 Anthropic API cost model (public pricing as of 2026-04-23)

Per Anthropic pricing page (anthropic.com/pricing) at 2026-04-23:

| Model | Input ($/M tok) | Output ($/M tok) | Use in Provedo |
|---|---|---|---|
| **Claude 3.5 Haiku** | $0.80 | $4.00 | Free tier (per DECISIONS 2026-04-23) |
| **Claude 3.5 Sonnet** | $3.00 | $15.00 | Plus + Pro + 14-day Plus trial |

Haiku is 3.75x cheaper on input and 3.75x cheaper on output than Sonnet. Sonnet costs ~3.75x Haiku for equivalent token volumes.

Note: pricing subject to change; verify before financial model lock. `[REFRESH: quarterly]`.

### 5.2 Estimated token consumption per interaction

**Assumptions per DECISIONS 2026-04-23 Free-tier patch brief:**
- Free chat: average 500 input tokens + 400 output tokens per message (light context; Haiku handles portfolio summaries well without heavy context)
- Plus chat (heavy context with full portfolio + history): 3,500 input + 450 output per message (unchanged from v1)
- Insights: 4,000 input + 125 output per run (unchanged)
- Coach pattern detection + narrative: 15,000 input + 300 output per run (unchanged; history context is the large cost)

**Cost per message — Free tier (Haiku, 500 in / 400 out):**
- (500 × $0.80 + 400 × $4.00) / 1M = ($0.00040 + $0.00160) = **$0.00200 per Free chat message**

**Cost per message — Plus/Pro/Trial (Sonnet, 3500 in / 450 out heavy context):**
- (3,500 × $3.00 + 450 × $15.00) / 1M = ($0.0105 + $0.00675) = **$0.01725 per Plus chat message**

**Cost per insight — Haiku (Free) vs Sonnet (Plus/Pro):**
- Haiku: (4000 × $0.80 + 125 × $4.00) / 1M = $0.00320 + $0.00050 = **$0.00370 per Free insight**
- Sonnet: (4000 × $3.00 + 125 × $15.00) / 1M = $0.01200 + $0.00188 = **$0.01388 per Plus insight** (rounded $0.014)

**Cost per Coach pattern-detection + narrative:**
- Haiku (Free tier teaser): (15000 × $0.80 + 300 × $4.00) / 1M = $0.01200 + $0.00120 = **$0.01320 per Free Coach run**
- Sonnet (Plus/Pro): (15000 × $3.00 + 300 × $15.00) / 1M = $0.04500 + $0.00450 = **$0.04950 per Plus Coach run**

Prompt caching + context optimization could reduce these 30-50% at scale, but v1.1 estimates use uncached base rates for conservatism.

### 5.3 Monthly LLM cost per active user per tier

**Free tier monthly LLM cost (Haiku, 50 msg/mo cap, no daily limit):**

_Worst case (user maxes monthly cap):_
- Chat: 50 messages × $0.00200 = **$0.100**
- Insight: 1/week × 4 × $0.00370 = **$0.015**
- Coach detection: 1/month × $0.01320 = **$0.013**
- **Total Free LLM cost (worst case, fully-active user): ~$0.128/user/mo (round to $0.13)**

_Typical user (30% of monthly cap ≈ 15 messages; industry active-user ratio):_
- Chat: 15 × $0.00200 = $0.030
- Insight: 4 × $0.00370 = $0.015
- Coach: $0.013
- **Total Free LLM cost (typical user): ~$0.058/user/mo (round to $0.06)**

- Revenue offset: $0
- **Gross margin per Free user (worst case): -$0.13/mo**
- **Gross margin per Free user (typical): -$0.06/mo**

**Compared to v1 (pre-4-locks) which showed -$2.66/mo worst case: 20x improvement.** The combination of Haiku routing + 50 msg/mo cap + light-context assumption drops the per-user burn from «structural financial risk» to «negligible operating cost».

**Plus tier monthly LLM cost (Sonnet, unlimited chat — typical-usage estimate):**
- Chat: unlimited; typical active Plus user uses ~300 messages/month (10/day equivalent, industry SaaS active-user pattern with heavier context)
  - 300 × $0.01725 = $5.175
- Insight: daily × 30 × $0.01388 = $0.416
- Coach: typical Plus user triggers 4 pattern-reads/mo average; 4 × $0.04950 = $0.198
- **Total Plus LLM cost (typical active user): ~$5.79/user/mo**

Upper bound (heavy Plus user, 600 msg/mo chat):
- 600 × $0.01725 + $0.42 + $0.20 = $10.95/user/mo

- Revenue: $8-10/mo
- **Gross margin per Plus user (typical): $8-10 − $5.79 − Stripe 2.9%+$0.30 ≈ $1.65-$3.65/mo (18-41% gross margin at LLM level)**
- **Gross margin per heavy-use Plus user: $8-10 − $10.95 = NEGATIVE at $8 price point, break-even at $10.** Fair-use policy + model tiering for routine responses advised (see §5.4).

**Pro tier monthly LLM cost (Sonnet, unlimited + advanced):**
- Chat: power users ~600 chats/mo × $0.01725 = $10.35
- Insight: daily + custom alerts ~45/mo × $0.01388 = $0.624
- Coach: advanced categories + retrospectives ~8 runs/mo × $0.04950 = $0.396
- Tax reports: computed, not LLM-generated (outside LLM cost)
- **Total Pro LLM cost (typical active Pro user): ~$11.37/user/mo**
- Revenue: $20/mo
- **Gross margin per Pro user: $20 − $11.37 − Stripe ~$0.88 ≈ $7.75/mo (39% gross margin at LLM level)**

### 5.3.1 Trial-phase economics (14-day Plus access on Sonnet)

**Per DECISIONS 2026-04-23 Trial lock: 14-day Plus trial, card required at signup.**

_Trial COGS per user over 14 days (Sonnet at Plus usage rate):_
- Plus typical LLM cost $5.79/mo × (14/30) = **$2.70/trial-user LLM**
- Infra overhead $0.75/mo × (14/30) = $0.35
- **Total trial COGS per user: ~$3.05/trial-user over 14 days**

_If user converts on day 14 (card charged):_
- Stripe first-month fee: 2.9% × $9 + $0.30 = $0.56
- Day-15 onward: user pays $9/mo, generates ~$1.89/mo gross contribution (after COGS + Stripe)
- Break-even on trial COGS alone: $3.05 / $1.89 ≈ 1.6 months of paid retention needed to recover trial cost
- **At 5% monthly churn (industry B2C SaaS), average paid tenure is ~20 months → LTV after trial = $1.89 × 20 = $37.80.**
- **LTV − trial COGS = $37.80 − $3.05 = $34.75 net contribution per converting trial user.**

_If user does NOT convert (card fails / user cancels at day 14):_
- Auto-downgrade to Free tier
- Trial COGS of $3.05 is SUNK (no revenue offset)

_Break-even trial→paid conversion rate (LTV basis):_
- Expected value per trial start: p × $34.75 + (1 − p) × (−$3.05) ≥ 0
- p ≥ $3.05 / ($34.75 + $3.05) = **p ≥ 8.1%** for trial to break even on LTV basis
- Industry benchmark for card-required B2C SaaS trial→paid: **40-60%** (per ProfitWell, Baremetrics public reports; see §6.4)
- **Provedo trial has a 5-7x cushion between break-even (8%) and industry benchmark (40-60%). Trial economics are SAFE with wide margin.**

_Break-even trial→paid conversion rate (1-month horizon — pessimistic):_
- If we only count month-1 paid retention (1 paid month × $1.89 − $3.05 = −$1.16): p × $1.89 − $3.05 ≥ 0 → **p ≥ 61%** to break even in 1 month alone
- This is above the industry benchmark. BUT: this overlooks LTV. With LTV horizon, trial is safe; with 1-month payback horizon, trial is marginal at industry conversion rates and LOSSY at below-benchmark conversion.
- **Implication:** trial economics depend on Plus retention past month 1. If Plus churn is pathological (>15%/mo), trial eats into margin. If Plus churn is normal (5-7%/mo), trial is strongly accretive.

_Red flag for trial COGS:_
- If trial→paid conversion comes in at <15% (well below industry benchmark), trial COGS eats material lunch at scale: 10K trial starts × $3.05 = $30,500 burn with 1,500 × $37.80 = $56,700 LTV offset → net +$26,200. Still positive but margin compressed.
- If trial→paid conversion collapses to <8%, trial becomes net negative.
- **Monitoring action:** measure trial→paid conversion at 90 days post-launch (per DECISIONS 2026-04-23 revisit schedule); if <15%, investigate trial duration / card-required policy / onboarding UX.

### 5.4 Gross margin risks flagged (post-4-locks)

**RESOLVED — Free tier negative gross margin at scale:**

v1 flagged $26,600/month burn at 10K active Free users on Sonnet with 5 msg/day cap. Post-4-locks with Haiku + 50 msg/mo:

| User scale | Free LLM burn/mo (worst case, fully-maxed users) | Free LLM burn/mo (typical, 30% of cap) |
|---|---|---|
| 1K Free | ~$130 | ~$60 |
| 10K Free | ~$1,300 | ~$600 |
| 100K Free | ~$13,000 | ~$6,000 |

Add infra ($0.30/user/mo): total Free burn at 100K = $30,000-$43,000/mo. **Compare to $319,200/yr ($26,600/mo) v1 projection at 10K users — the 4-locks patch reduces Free burn at 10x the user count to below the pre-patch burn at 1x user count.** Structural Free-tier cost risk is RESOLVED.

**MEDIUM — Plus tier margin thin at heavy-user profile (unchanged from v1):**

A heavy-use Plus user (600+ chats/mo, full Coach triggering) can approach $11+ LLM cost at $8-10 revenue = zero or negative margin. Mitigations same as v1:
1. Plus «fair use» policy (unstated limits at pathological usage; industry convention)
2. Prompt optimization + context compression (potential 30-50% reduction at scale)
3. Model tiering inside Plus — Haiku for routine insights + light chat, Sonnet for complex chat (Coach, pattern-reads, advice-adjacent refusals)

**Pro tier has healthy margin at $20** — most sustainable tier economically.

**MEDIUM — Trial COGS at scale if conversion under-performs (new post-4-locks):**

At 10K trial starts/mo, trial COGS = $30,500/mo. Offset depends on conversion rate × LTV. At industry-benchmark 50% conversion: offset = $189K/mo LTV-basis (strongly positive). At 15% conversion: offset = $56.7K/mo (still net positive). At 8% break-even, zero-net. Below 8%: net drain.

Monitoring: trial→paid conversion measured at 90 days post-launch; re-evaluate if <15%.

### 5.4.1 Free-tier sustainability at scale (the key question)

**Per DECISIONS 2026-04-23: «measure actual Free burn at 1K / 10K / 100K users; adjust cap if unit economics break».** This section establishes the baseline.

Free-tier total cost at scale (LLM + infra, typical-usage assumption):

| Active Free users | Typical-use LLM burn/mo | Typical-use infra burn/mo | Total Free burn/mo | Comment |
|---|---|---|---|---|
| 1,000 | $60 | $300 | ~$360 | Negligible; within any startup burn |
| 10,000 | $600 | $3,000 | ~$3,600 | Manageable; offset by even 1% Plus conversion (100 × $1.89 = $189/mo) INSUFFICIENT → need higher conv |
| 100,000 | $6,000 | $30,000 | ~$36,000 | Material but not catastrophic; break-even at ~12% Plus conversion (see §6.5) |

Worst-case Free-tier total cost at scale (all users max their 50 msg/mo):

| Active Free users | Worst-case LLM burn/mo | Worst-case infra burn/mo | Total Free burn/mo |
|---|---|---|---|
| 1,000 | $130 | $300 | ~$430 |
| 10,000 | $1,300 | $3,000 | ~$4,300 |
| 100,000 | $13,000 | $30,000 | ~$43,000 |

**Finance-advisor red flag assessment:** NO sustainability red flag at any user-count tier (1K / 10K / 100K) under current 4-locks structure, provided Haiku routing is in place for Free responses. At 100K Free users with 0% conversion, $36K/mo burn is material but not existential (compare: a single senior-engineer hire ≈ $15-25K/mo loaded in US). At even 5% Free→Plus conversion at 100K users, Plus revenue contribution = 5K × $1.89 = $9.4K/mo, covering 25% of Free burn. At 12%+ conversion (see §6.5 break-even), Free tier is net-profitable at scale.

### 5.5 Additional costs not modeled above (rough)

Per-user costs beyond LLM:
- Database + hosting (Fly.io / Neon / Upstash) — ~$0.10-0.50/user/month at scale
- SnapTrade API fees (broker aggregation) — depends on SnapTrade pricing model; `[SOURCE-PENDING]` for current rates
- Clerk auth — ~$0.02/MAU (Clerk pro tier pricing)
- Stripe fees on paid tiers — ~2.9% + $0.30 per subscription transaction
- Email (Resend/Postmark) — ~$0.001-0.005/email

These add roughly $0.50-1.50/user/month at current hosting pricing. Not huge but meaningful at Free-tier scale.

### 5.6 Unit-economics sanity table (updated 2026-04-23 post-4-locks)

| Tier | Revenue/mo | LLM cost/mo | Infra cost/mo | Est. gross margin | Gross margin % |
|---|---|---|---|---|---|
| Free (worst case, maxed) | $0 | $0.128 (Haiku) | $0.30 | -$0.43 | N/A (negative) |
| Free (typical) | $0 | $0.058 (Haiku) | $0.30 | -$0.36 | N/A (negative, but tiny) |
| Trial (14d Plus, Sonnet) | $0 | $2.70 (Sonnet, 14d) | $0.35 | -$3.05 | N/A (deferred revenue via day-14 conversion) |
| Plus (typical) | $9 | $5.79 (Sonnet) | $0.75 | $1.90 (post-Stripe) | 21% |
| Plus (heavy) | $9 | $10.95 (Sonnet) | $1.00 | -$3.50 | Negative; fair-use needed |
| Pro (typical) | $20 | $11.37 (Sonnet) | $1.25 | $6.50 (post-Stripe) | 33% |
| Pro (heavy) | $20 | $13.00 (Sonnet) | $1.50 | $4.62 | 23% |

**Finance-advisor note (post-4-locks):**
- Free typical at -$0.36/mo is NEGLIGIBLE — essentially a free-trial of the product at near-zero marginal cost. Haiku routing makes Free sustainable at any realistic user scale.
- Plus typical at 21% gross margin is below v1's 58% — but v1 used lower Sonnet usage assumptions (300 msg/mo at heavier cost). Real number depends on usage distribution; monitor post-alpha.
- Plus heavy-user negative margin is the real risk tier — fair-use policy + model tiering within Plus required.
- Pro at 33% typical is healthy; remains most sustainable paid tier.
- Trial (14-day) at -$3.05/user is an ACQUISITION COST, not a recurring loss — break-even needs trial→paid conversion ≥8% on LTV basis (well under industry 40-60% benchmark).

**Key observation:** v1 flagged Free tier as the PRIMARY financial risk. Post-4-locks with Haiku + 50 msg/mo cap, Free tier is NO LONGER the primary risk. The new primary financial risks are (in order): (1) Plus heavy-user margin compression; (2) trial→paid conversion under-performance; (3) Plus churn driving LTV below trial break-even.

---

## 6. Conversion bottleneck analysis (where do we lose Free → Plus users?)

### 6.1 Funnel stages + typical loss points

Reproducing from `COACH_TIER_PLACEMENT.md` §3.1:

```
Visitor (landing)
  ↓ Landing conversion 2-5%
Signup (free tier)
  ↓ Broker sync completion 60-70% [SOURCE-PENDING]
Activated (first-sync completed)
  ↓ Teaser firing: warm-start 80%+ within 24h; cold-start 30%+ by day 30
First teaser fired
  ↓ Teaser → unlock-attempt 20-35%
Upgrade attempt
  ↓ Upgrade completion 40-60%
Plus subscriber
```

### 6.2 Per-stage loss analysis

**Stage 1 (Landing → Signup):** losses driven by:
- Hero parse-time / metaphor abstraction (cognition cost flagged in 02_POSITIONING v3.1 Risks)
- Lack of immediate «why Provedo vs X?» signal
- Signup friction
- **Mitigation:** landing copy (content-lead) + imperative hero (PO Q1 lock) + visible proof elements (sub-proofs «cites sources», «1000+ brokers»)

**Stage 2 (Signup → Broker sync):** losses driven by:
- User connects wrong broker / broker not supported
- SnapTrade integration friction
- Security concern («why do I give credentials?»)
- **Mitigation:** SnapTrade UX (product-designer + tech-lead); transparent security messaging; broker-coverage clarity at signup

**Stage 3 (Sync → Activated):** losses driven by:
- Activation lag (30 days cold-start if warm-start unavailable)
- Dashboard feels commodity / not differentiated
- **Mitigation:** warm-start backfill (Q2 working assumption) + differentiated brand voice + Chat value visible Day 1

**Stage 4 (Activated → First teaser):** losses driven by:
- No qualifying pattern detected
- Cold-start user has no history to read
- **Mitigation:** partial-backfill threshold lowering; honest empty-state copy; weekly insight + chat as Coach-gap fillers

**Stage 5 (Teaser → Upgrade attempt):** losses driven by:
- Teaser obfuscation too aggressive (user can't tell if it's valuable)
- Teaser obfuscation too revealing (user doesn't need to upgrade)
- Price pressure ($8-10/mo feels high for curiosity)
- **Mitigation:** product-designer UX of obfuscation; content-lead teaser copy A/B; upgrade page design emphasizing value

**Stage 6 (Attempt → Complete):** losses driven by:
- Payment friction (Stripe flow)
- Second-guess at payment confirmation
- **Mitigation:** standard Stripe UX best practices; clear cancellation policy; trial period consideration

### 6.3 Where is Provedo's biggest funnel risk?

**Finance-advisor assessment:**

Highest-leverage loss points (where best mitigation → biggest conversion lift):

1. **Stage 3 (Activated → differentiated value encountered).** Without warm-start, Free user experiences zero Provedo-unique value for 30 days. Warm-start backfill is THE single most important operational decision for conversion.
2. **Stage 5 (Teaser → Upgrade attempt).** This is where the teaser UX + copy make or break. Content-lead microcopy + product-designer visual treatment + finance-advisor Lane A validation all pile on this stage.
3. **Stage 4 (Activated → First teaser).** Partial-backfill users are the hidden risk — they get some warm-start but not a qualifying pattern. Need lower-threshold firing for first pattern + honest «emerging» vs. «confirmed» framing.

### 6.4 Activation event explicit naming

From `COACH_TIER_PLACEMENT.md` §3.3:

**The activation event is the first Coach teaser firing — manifested as a blinking contextual icon on a position card or dashboard widget (per DECISIONS 2026-04-23 Coach UX lock).** Before this, user has commodity-level tracker features. After this, user experiences Provedo's structural differentiator + sees paid-tier value anchor («there's more detail behind this» via teaser popover). Without the activation event firing in the first 7-14 days post-signup, Free → Plus conversion likely underperforms.

**This is the single most important funnel metric to track post-alpha.**

**Trial→paid conversion industry benchmarks (card-required B2C SaaS):**

| Pattern | Typical trial→paid conversion | Source |
|---|---|---|
| Card-required trial (credit card at signup) | 40-60% | ProfitWell public benchmarks 2023; Baremetrics SaaS benchmarks reports `[SOURCE-PENDING URL]` |
| Card-not-required / freemium trial | 15-25% | Same sources |
| OpenView SaaS Benchmarks Report (broad SaaS) | 20-30% median freemium Free→paid over 90d | OpenView Partners `[SOURCE-PENDING]` |
| B2C consumer SaaS ($5-15/mo price point) | 25-40% trial→paid when card required | Industry convention; see `BENCHMARKS_SOURCED.md` for specific citable rows when verified |

**Provedo's trial hypothesis:** 30-50% trial→paid conversion at 14 days (card-required pattern; Plus product experience delivered). At 8.1% break-even (§5.3.1), even pessimistic trial performance covers COGS. Key sensitivity: Plus retention past month 1.

### 6.5 Free→Plus conversion break-even threshold

**Question: At what Free→Plus conversion rate does the Free tier become net-profitable at scale?**

Inputs:
- Free user drain: $0.42/user/mo (typical) to $0.43/user/mo (worst case), round to $0.42
- Plus user gross contribution: $1.89/mo (typical Plus user, post-Stripe, post-COGS)
- Conversion horizon: 12 months (a signed-up Free user either converts within ~12 months or is unlikely to ever convert)

**1-month horizon break-even:**
- Condition: (1-p) × (-$0.42) + p × $1.89 ≥ 0
- p ≥ $0.42 / ($0.42 + $1.89) = **p ≥ 18.2%** for Free tier to break even in 1 month
- This is high — Free-tier economics do not break even instantly

**12-month LTV horizon (more realistic SaaS framing):**
- Free user 12-month drain: $0.42 × 12 = $5.04
- Plus user 12-month gross contribution: $1.89 × 12 = $22.68 (assuming user stays Plus for 12+ months; with churn, weighted lower)
- Plus LTV at 5% monthly churn (20-month avg tenure): $1.89 × 20 = $37.80
- Condition (LTV-basis): (1-p) × (-$5.04) + p × $37.80 ≥ 0
- **p ≥ $5.04 / ($5.04 + $37.80) = p ≥ 11.8%** over 12-month LTV horizon
- At 7% churn (14-month avg tenure): Plus LTV = $26.46 → **p ≥ 16.0%**
- At 10% churn (10-month tenure): Plus LTV = $18.90 → **p ≥ 21.1%**

**Summary break-even ranges:**

| Plus churn scenario | Plus LTV | Free→Plus break-even |
|---|---|---|
| Optimistic (4% monthly churn, 25-mo avg) | $47.25 | 9.6% |
| Industry-typical (5% churn, 20-mo avg) | $37.80 | 11.8% |
| Pessimistic (7% churn, 14-mo avg) | $26.46 | 16.0% |
| High-churn (10% churn, 10-mo avg) | $18.90 | 21.1% |

**Hypothesis vs break-even:** `COACH_TIER_PLACEMENT.md` §3.1 hypothesizes Free→Plus conversion 3-7% over 90 days. Annualized to 12 months, 3-7% at 90 days likely compounds to ~8-18% at 12 months (continued conversion curve + some late converters). This is in the NEIGHBORHOOD of the break-even band (12-16%) but not clearly above it.

**Finance-advisor assessment:** Free tier at scale is near-break-even under hypothesis, with meaningful downside risk if conversion is at the low end (3%) and Plus churn is high (7%+). At upside conversion (7%+ at 90d → 15%+ at 12mo) + industry-typical churn, Free tier is profitable. **The 4-locks structure makes Free tier economically viable — but profitability depends on maintaining Plus churn ≤7%/mo and Free→Plus conversion ≥12%/12mo.**

---

## 7. Risks flagged (summary table)

| # | Risk | Severity | Impact | Mitigation owner |
|---|---|---|---|---|
| F1 | Free tier negative gross margin at scale (RESOLVED 2026-04-23 by Haiku + 50 msg/mo lock) | LOW | Post-4-locks: worst case $43K/mo at 100K users; break-even at ~12% conversion (see §6.5) | finance-advisor (ongoing monitoring at 1K/10K/100K thresholds) |
| F1a | Plus heavy-user margin negative at $8; fair-use needed | MEDIUM | Users using 600+ chat msgs/mo on Sonnet exceed $9 revenue | tech-lead (model tiering inside Plus + fair-use policy) |
| F1b | Trial COGS $3.05/user not recovered if conversion <8% | MEDIUM | 10K/mo trial starts × $3.05 = $30.5K/mo burn; offset depends on conversion | finance-advisor (90d post-launch measurement); content-lead (trial onboarding UX) |
| F2 | Pro $20 head-to-head with PortfolioPilot Gold $20 — RIA competitor with proof | HIGH | Pro-tier conversion pressure; differentiation must earn price parity | Navigator (positioning); content-lead (differentiation messaging); product-designer (UX edge) |
| F3 | Plus $8-10 in crowded 4-way cluster — differentiation not on price axis | MEDIUM | Plus feels «just another tracker» at same price as Copilot/Snowball/Getquin | content-lead (unique Coach messaging); product-designer (Provedo-unique UX) |
| F4 | Warm-start backfill failure reduces Plus conversion 30-50% | HIGH | Plus revenue hypothesis fails if cold-start is the common path | tech-lead (SnapTrade coverage audit); product-designer (empty-state design) |
| F5 | Coach teaser obfuscation wrong dose → low upgrade CTA click-through | MEDIUM | Primary conversion driver fails | product-designer (UX treatment); content-lead (microcopy variants) |
| F6 | Plus user novelty fade after month 3 → high monthly churn | MEDIUM | LTV hypothesis fails; CAC payback stretched | finance-advisor + user-researcher (cohort retention data post-alpha) |
| F7 | ChatGPT Plus $20/mo anchors user mental model on «AI value» — Pro may feel redundant | LOW-MEDIUM | Pro conversion friction | content-lead (positioning vs. ChatGPT differentiation) |
| F8 | ICP B preference for advice (Origin Lane B) may divert away from Provedo Lane A | LOW | ICP B is tertiary per positioning; acknowledged tradeoff | Navigator (already locked; no change) |
| F9 | «90-day history» Free limit narrows Coach quality for any user in that tier | LOW | Coach works better with more history; Free limit compounds 30-day cold-start | product-designer (tier-limit UX); finance-advisor (model impact) |
| F10 | Tax report Pro retention hook depends on report quality + jurisdiction coverage | MEDIUM | Pro retention driver fails if reports are weak or country-incomplete | tech-lead (tax calculation implementation); legal-advisor (jurisdiction compliance) |

---

## 8. Top 3 finance decisions flagged for PO

### 8.1 Free tier AI cost — RESOLVED by 2026-04-23 4-locks lock

**Status:** RESOLVED. PO locked Free tier at 50 msg/mo (monthly-only, no daily cap) on Haiku model (5x cheaper than Sonnet). Resulting economics per §5.3 above: $0.06-0.13/user/mo worst case, 20x improvement over v1's Sonnet+5-msg/day projection.

**Dependency (flag for tech-lead):** Haiku routing for Free tier MUST ship before 50 msg/mo cap goes live. If cap is enforced but responses still route to Sonnet, cost/user becomes $0.375-$0.86/mo (3.75x worse than Haiku). Still sustainable but loses the cost advantage that makes Free tier viable at 100K users.

**Monitoring action (per DECISIONS 2026-04-23 revisit schedule):**
- Track actual Free-user chat usage distribution at 30 / 90 / 180 days post-launch
- Measure actual LLM burn at 1K / 10K / 100K active Free user thresholds
- Revisit cap if unit economics break (e.g., if typical-use ratio turns out to be >60% of cap, rather than the assumed 30%)

### 8.2 Pro tier at $20 differentiation earn-vs-undercut decision

**Recommendation:** do NOT undercut to $15. Stay at $20 and earn the differentiation.

**Why:** undercutting signals «we are the cheaper alternative» positioning; locks into second-mover narrative vs PortfolioPilot. $20 + real differentiation signals confidence. Differentiation earning requires:
- Demonstrable Coach value at alpha (Coach must ship well)
- Demonstrable EU/UK coverage advantage
- Lane A positive-trust signal landing with at least ICP A
- Dashboard-primary UX at least matching Getquin / Kubera polish

**If at alpha it becomes clear differentiation is not landing, considered alternative:** $17/mo (splits difference between $15 undercut and $20 parity). Don't pre-commit.

### 8.3 Warm-start backfill is the pre-alpha feasibility gate that matters most

**Recommendation:** elevate warm-start backfill from «working assumption deferred to dev-stage feasibility» (Q2 current state) to an explicit pre-alpha gate.

**Why:** Plus conversion hypothesis depends on warm-start being operational. If tech-lead's SnapTrade feasibility returns «only 40% of launch-geography users have supported history endpoints», we should:
- Know this before launch, not discover at alpha metrics
- Plan the cold-start empty-state UX very explicitly
- Potentially consider delaying Coach launch until backfill coverage improves

**Action:** request tech-lead to produce a SnapTrade trade-history endpoint coverage matrix for launch-geography brokers (US, UK, DE, FR, IT, ES, NL, major LATAM, major APAC, major crypto exchanges). If coverage <70% across launch markets, revisit tier design (potentially push Coach to Plus-only, with Free-tier activation driven by something else).

---

## 9. Methodology + caveats

- All LLM cost estimates use Anthropic public pricing at 2026-04-23. `[REFRESH]` required before financial model lock.
- Token consumption estimates are hypothesis based on typical context patterns; real usage requires post-alpha instrumentation.
- SnapTrade API fees NOT modeled (`[SOURCE-PENDING]` on current pricing).
- All benchmark conversions + rates (EUR→USD ~1.08) use approximations; real-time rates will shift.
- Conversion funnel percentages are hypothesis anchored on industry SaaS benchmarks; Provedo's actual funnel must be measured post-alpha.
- No Bloomberg / Refinitiv / paid data used (CONSTRAINTS Rule 1 respected throughout).

---

## 10. Revision log

- **2026-04-23 (v1):** Initial validation. finance-advisor. Per-tier value mapping, competitor comparison (PortfolioPilot Gold + Getquin Premium + Snowball Starter + Mezzi Core + ChatGPT Plus), value-per-dollar analysis, cost-to-serve model with Anthropic pricing reference, conversion funnel bottleneck analysis, top-3 PO flags. Most numerical claims flagged `[SOURCE-PENDING]` or hypothesis-labeled until real cohort data post-alpha.
- **2026-04-23 (v1.1, post-4-locks patch):** Rewrote §5 cost-to-serve with Haiku-on-Free + Sonnet-on-Plus/Pro/Trial pricing per DECISIONS 2026-04-23 Trial+Free+Coach+Brand lock. Added §5.3.1 trial-phase economics (14-day Plus trial on Sonnet = $3.05/user trial COGS; break-even 8.1% on LTV basis). Added §5.4.1 Free-tier sustainability at 1K/10K/100K user thresholds. Added §6.5 Free→Plus break-even threshold analysis (11.8-16% under industry-typical churn). Added §6.4 trial→paid industry benchmarks. Verdict changed from WARN to SUPPORT: Free tier structural cost risk RESOLVED; new primary risks are Plus heavy-user margin + trial→paid conversion under-performance + Plus churn. Updated §5.6 unit-economics sanity table. Updated §8.1 from «cap Free harder» recommendation to «Free tier RESOLVED by PO lock; dependency flag: Haiku routing must ship before 50 msg/mo cap».

---

**End of Pricing Tier Validation v1.1. Awaiting tech-lead SnapTrade coverage audit + product-designer teaser UX + content-lead microcopy + Haiku routing implementation + real cohort data post-alpha for v2 refinement.**
