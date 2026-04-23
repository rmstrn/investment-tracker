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
| **Free** | $0 | $0 | 2 accounts, 90-day history, basic charts + allocation, AI Chat 5 msg/day, 1 insight/week, Coach teaser (1/month, warm-start) |
| **Plus** | ~$8-10/mo | ~$96-120/yr | Unlimited accounts, full history, unlimited chat, daily insights, dividend calendar, benchmark comparison, CSV export, full Coach pattern-reads |
| **Pro** | ~$20/mo | ~$240/yr | Everything in Plus + tax reports per jurisdiction, advanced analytics (Sharpe/Sortino/factors/max drawdown), custom alerts, API access, advanced Coach categories |

**Finance-advisor verdict: WARN (viable but with 3 structural risks to resolve before launch).**

### Verdict breakdown:

1. **Tier structure itself is sound for Lane A + freemium retail fintech.** Three-tier ladder matches industry convention; price anchors ($0 / $8-10 / $20) are competitively positioned without being head-to-head undercuts or premium anomalies.
2. **Pro at $20 sits EXACTLY at PortfolioPilot Gold price.** This is head-to-head on price axis with a competitor that has RIA registration ($30B AUM / 40K users / Lane C advice on paid tiers). Memoro's differentiation at this price point depends on Lane A POSITIVE trust + Coach uniqueness + EU/UK geography coverage + dashboard-primary UX. If any of those fail to differentiate convincingly at alpha, Pro conversion risks Pareto loss to PortfolioPilot Gold at the same price.
3. **Plus at $8-10 is in a 4-way crowded cluster** (Copilot $7.92, Snowball $9.99, Monarch $8.33, Getquin €7.50). Price anchor is fine; differentiation must come from product-experience uniqueness (Coach + unlimited chat + Memoro's «remembers» metaphor) at this price point, not from being cheaper or more features.
4. **Free tier is the conversion keystone AND the cost-to-serve risk.** Free has negative gross margin per user (LLM inference cost > $0 revenue). Tolerable if Free → Plus conversion rate is within hypothesis range (3-7%); becomes a financial problem if Free is heavily used without conversion (high-usage Free user burns $X/month in Anthropic API with no offset). See §5 cost-to-serve + §6 conversion funnel.
5. **Coach 30-day cold-start (per 2026-04-23 review §7.1 + `COACH_TIER_PLACEMENT.md` §3) materially affects Free → Plus conversion.** Warm-start backfill is the decisive operational variable. Warm-start path: conversion funnel works. Cold-start path: Plus conversion may come in 30-50% below hypothesis.

---

## 2. Per-tier value mapping (what user gets, what's gated)

### 2.1 Free tier ($0)

**Included (what user experiences):**
- Dashboard view of aggregated portfolio (up to 2 broker accounts)
- Basic charts: allocation pie, time-series value chart
- 90-day history retention (everything older is gated)
- AI Chat: 5 messages per day, cleared at midnight
- Insights: 1 per week, curated from available observations
- Coach: 1 teaser per month, Plus-paywalled detail (see `COACH_TIER_PLACEMENT.md`)
- Email weekly digest (1/week)
- Mobile + web access (equal citizens per `02_POSITIONING.md`)

**Gated (requires upgrade):**
- 3rd broker account onward
- History beyond 90 days
- 6th chat message of the day
- Coach pattern detail unlock
- Daily insights (beyond 1/week)
- Dividend calendar view
- Benchmark comparison against retail medians
- CSV export of any data

### 2.2 Plus tier ($8-10/mo)

**Adds (beyond Free):**
- Unlimited broker accounts (vs. 2 on Free)
- Full history retention (vs. 90 days on Free)
- Unlimited AI Chat (vs. 5/day on Free)
- Daily insights (vs. 1/week on Free)
- Dividend calendar view with ex-dates + payment dates
- Benchmark comparison (vs. retail aggregates where sourced — see `BENCHMARKS_SOURCED.md`)
- CSV export of portfolio data + insights + chat history
- **Full Coach pattern-reads (core categories: chasing-momentum, disposition-effect, anchoring, loss-aversion, concentration-drift)**
- Coach follow-up chat integration (ask Memoro about a pattern)
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
| Chat | 5/day | unlimited | unlimited |
| Insights | 1/week | daily | daily + custom alerts |
| Coach | 1 teaser/mo (detail gated) | full core patterns | full + advanced + retrospectives |
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

**Memoro Pro ($20/mo) provides:**
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

| Axis | PortfolioPilot Gold | Memoro Pro | Memoro edge? |
|---|---|---|---|
| Proof / AUM | 40K users, $30B AUM | pre-alpha, 0 users | PP dominant |
| AI chat depth | Limited on Gold | Unlimited | Memoro edge |
| Regulatory lane | Lane C (RIA on paid) — can recommend | Lane A (observation-only) — cannot recommend | Depends on ICP — some users WANT advice (favors PP), others AVOID advice (favors Memoro) |
| Coach (behavioral patterns) | Does NOT have this surface | HAS this surface | Memoro edge — structural differentiator |
| EU / UK / multi-market | US-focused | Multi-market from day 1 | Memoro edge |
| Tax | Prospective «tax optimization» suggestions | Retrospective tax reports per jurisdiction | Different product shapes |
| Scenario planning | YES | YES (via chat) | Parity |
| Trust narrative | «Advisor we pay for» | «Memory that doesn't advise» | Depends on ICP preference |
| Dashboard / aggregation UX | Mature | Unknown pre-alpha (dashboard-primary per Q3 lock) | PP dominant at launch |

**Finance-advisor assessment:** At identical $20 price, Memoro Pro has real differentiation on 3 axes (Coach, EU/UK coverage, Lane A positive-trust) but loses on 3 axes (proof/AUM, regulatory lane for users who want advice, dashboard maturity). Net: differentiation is REAL but needs to be EARNED at alpha; cannot be assumed from positioning alone.

**Risk flag:** ICP A (multi-broker millennial, post-advisor-distrust) SHOULD prefer Memoro Pro. ICP B (AI-native newcomer) may prefer PortfolioPilot (wants guidance, not observation). Positioning already has ICP B as tertiary. Pricing assumption assumes ICP A dominance.

### 3.2 Getquin Premium (€90/yr = ~$97/yr) — CLOSE to Plus annual

Per `docs/product/01_DISCOVERY.md` §4.6 + competitor scan:

**Getquin Premium provides:**
- Unlimited broker connections
- Premium analytics (AI-powered portfolio analysis — state/forward-facing AI)
- Extended history
- EU-dominant market presence (500K users)

**Getquin Wealth (€150/yr = ~$162/yr) adds:**
- «AI Financial Agents» — conversational AI layer (comparable to Memoro's chat)
- Still state/forward-facing AI — no retrospective behavioral pattern detection (confirmed per getquin-deep-dive.md)

**Memoro Plus ($96-120/yr equivalent) provides:**
- Unlimited chat with behavioral memory (Getquin: has chat in Wealth tier only)
- **Full Coach pattern-reads** (Getquin: does not have equivalent — structural differentiator)
- Dividend calendar, benchmark comparison, CSV export
- Multi-market (Getquin is EU-dominant, US second-class)

**Comparison verdict vs Getquin:**

At Memoro Plus $96-120/yr vs Getquin Premium €90/yr (~$97/yr):
- Similar price, similar year
- Memoro's full chat is HERE at Plus; Getquin's conversational AI is NOT at Premium (€90/yr) — it's at Wealth (€150/yr)
- Memoro's Coach is the structural differentiator Getquin lacks at any tier
- Getquin has maturity + 500K user base; Memoro does not (pre-alpha)

**Net:** Memoro Plus at $96-120 vs. Getquin Premium €90/yr offers MORE AI-integrated features at similar price + a structural differentiator Getquin doesn't have anywhere. **Defensible value proposition.**

### 3.3 Snowball Starter ($79.99/yr) — CHEAPER than Plus annual

Per `docs/product/pricing-landscape.md`:

- Dividend-tracker orientation (different positioning axis)
- 1 portfolio, 10 holdings cap on Starter
- Higher tiers $149.99 (Investor) / $249.99 (Expert)

**Comparison verdict:** Different segment. Snowball serves dividend-income-focused retail. Memoro Plus serves broader «AI-integrated portfolio memory» segment. Not direct price comparison.

### 3.4 Mezzi Core ($299/yr) — EXPENSIVE (different lane)

Per `docs/product/pricing-landscape.md`:

- Fiduciary advice framing (Lane B-equivalent)
- Aggregation via Plaid + Finicity

**Comparison verdict:** Different lane. Memoro does not compete on advice; Mezzi is advice-first. No direct comparison.

### 3.5 ChatGPT Plus ($20/mo) — COMMODITY AI ANCHOR at Pro price

Not direct competitor on functionality but anchors the $20/mo price in user mental model as «what I pay for AI». Users comparing Memoro Pro $20 to ChatGPT Plus $20 may question «why pay both?». **Mitigation:** positioning makes Memoro specifically about portfolio memory (vs. generic LLM chat); the value delta is portfolio-awareness + multi-broker aggregation + behavioral coach — things ChatGPT Plus cannot do.

---

## 4. Value-per-dollar analysis for each tier

### 4.1 Free tier — $0 per user per month

Value delivered: commodity dashboard + limited AI chat + 1 weekly insight + 1 monthly coach teaser = similar to Getquin-free / PortfolioPilot-free / Kubera-trial baseline.

**User's perception of value-per-dollar:** positive (anything for free is positive). BUT: retention depends on whether Free tier delivers ENOUGH differentiated value to convert. Commodity-level features at $0 do not drive conversion; differentiated activation (Coach teaser + unique brand framing) drives conversion.

**Memoro's cost per Free user:** see §5 cost-to-serve. Negative gross margin by definition.

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

**Key retention mechanism: tax report seasonal stickiness.** Once user generates Memoro tax report in February/March for 2025 tax year, switching cost is high for following year (data continuity, report format familiarity, jurisdiction-specific calculations).

### 4.4 Summary value-per-dollar table

| Tier | Price/mo | Price/day | % of $50K portfolio/yr | Differentiated value unlocked |
|---|---|---|---|---|
| Free | $0 | $0 | 0% | Commodity tracker + limited AI + 1 monthly Coach teaser |
| Plus | $8-10 | $0.27-0.33 | 0.19-0.24% | + Unlimited AI chat, + daily insights, + full Coach core patterns |
| Pro | $20 | $0.67 | 0.48% | + Tax reports, + advanced analytics, + advanced Coach, + API, + custom alerts |

At percentages of portfolio value, all tiers are economically invisible if they deliver on value promise. The bottleneck is value-demonstration, not price-affordability.

---

## 5. Cost-to-serve per tier

**Critical pre-alpha analysis:** what does each tier cost Memoro per user, especially on LLM inference?

### 5.1 Anthropic API cost model (Claude 3.5 Sonnet reference pricing as of 2026-04-23 — PUBLIC PRICING)

Per Anthropic pricing page (anthropic.com/pricing):
- Input tokens: $3 / 1M tokens
- Output tokens: $15 / 1M tokens

Note: pricing subject to change; verify before financial modeling lock. `[REFRESH]` flag.

### 5.2 Estimated token consumption per interaction

**Chat interaction (typical):**
- Input: user question + portfolio context + chat history ≈ 2,000-5,000 tokens
- Output: AI response ≈ 300-600 tokens
- Cost per chat: ($3 × 3,500/1M) + ($15 × 450/1M) ≈ $0.0105 + $0.00675 ≈ **$0.017 per chat**

**Insight generation (weekly / daily):**
- Input: portfolio state + recent events ≈ 3,000-5,000 tokens
- Output: insight ≈ 100-150 tokens
- Cost per insight: ($3 × 4,000/1M) + ($15 × 125/1M) ≈ $0.012 + $0.00188 ≈ **$0.014 per insight**

**Coach pattern-detection + narrative (monthly or triggered):**
- Input: full trade history + portfolio context ≈ 10,000-20,000 tokens (history is the large context)
- Output: pattern narrative ≈ 200-400 tokens
- Cost per pattern-read: ($3 × 15,000/1M) + ($15 × 300/1M) ≈ $0.045 + $0.0045 ≈ **$0.050 per Coach run**

Prompt caching + context optimization could reduce these ~30-50% at scale, but v1 estimates use uncached base rates.

### 5.3 Monthly LLM cost per active user per tier

**Free tier monthly LLM cost (per user, if user uses allocation fully):**
- Chat: 5/day × 30 days × $0.017 = $2.55
- Insight: 1/week × 4 weeks × $0.014 = $0.056
- Coach teaser detection: 1/month × $0.050 = $0.05 (detection runs monthly even if nothing fires)
- **Total Free LLM cost: ~$2.66 per fully-active Free user per month**
- Revenue offset: $0
- **Gross margin per Free user: -$2.66/mo**

**Plus tier monthly LLM cost (per active user):**
- Chat: unlimited; typical daily user ~10 chats/day × 30 × $0.017 = $5.10 (upper bound if heavily used)
- Insight: daily × 30 × $0.014 = $0.42
- Coach: pattern-detection + narrative on trigger; assume 4 runs/month average = 4 × $0.050 = $0.20
- **Total Plus LLM cost: ~$5.72 per active Plus user per month (upper bound)**
- Revenue: $8-10/mo
- **Gross margin per Plus user: ~$2.28 - $4.28/mo (28-48% gross margin at LLM level)**

**Pro tier monthly LLM cost (per active user):**
- Chat: unlimited; power users may run 20+ chats/day × 30 × $0.017 = $10.20 (upper bound)
- Insight: daily + custom alerts; ~45 alerts/month × $0.014 = $0.63
- Coach: advanced categories fire more frequently; ~8 runs/month × $0.050 = $0.40
- Tax reports: computed, not LLM-generated (outside LLM cost)
- **Total Pro LLM cost: ~$11.23 per active Pro user per month (upper bound)**
- Revenue: $20/mo
- **Gross margin per Pro user: ~$8.77/mo (44% gross margin at LLM level)**

### 5.4 Gross margin risks flagged

**CRITICAL — Free tier negative gross margin at scale:**

If Memoro has 10,000 active Free users using full allocation, LLM burn = 10,000 × $2.66 = **~$26,600/month** ($319,200/year) in Anthropic API cost with ZERO revenue offset.

**Mitigations:**

1. **Cap Free AI interactions harder.** Current 5 msg/day may be too generous. Alternatives:
   - 5 msg/week (aggressive cap) → $0.34/user/month LLM cost
   - 3 msg/day (modest reduction) → $1.53/user/month
   - 10 msg/day but only 3 complex queries/day → mixed cap
2. **Use cheaper model for Free tier responses.** Claude 3.5 Haiku or similar lower-tier model at Free. Production quality check required.
3. **Aggressive prompt caching for Free tier portfolio context.** Static portfolio context can be cached across sessions; reduces input token cost significantly.
4. **Convert high-volume Free users.** Rate-limit feedback («You've used 3 of 5 messages today — upgrade for unlimited») drives conversion.

**Finance-advisor flag for PO:** Without cost caps, Free tier at scale is a real financial bleed. Recommend: tech-lead + finance-advisor agree on Free tier LLM-cost cap BEFORE alpha launch (target <$1.50/user/month).

**MEDIUM — Plus tier margin is thin at heavy-user profile:**

A heavy-use Plus user (20+ chats/day, full Coach triggering) can approach $10+ LLM cost at $8-10 revenue = zero or negative margin. Mitigations:
1. Plus tier «fair use» policy (unstated limits that kick in at pathological usage; industry-standard practice)
2. Prompt optimization + context compression
3. Cheaper model for routine insights (Haiku); Sonnet only for complex chat

**Pro tier has healthy margin at $20** — most sustainable tier economically.

### 5.5 Additional costs not modeled above (rough)

Per-user costs beyond LLM:
- Database + hosting (Fly.io / Neon / Upstash) — ~$0.10-0.50/user/month at scale
- SnapTrade API fees (broker aggregation) — depends on SnapTrade pricing model; `[SOURCE-PENDING]` for current rates
- Clerk auth — ~$0.02/MAU (Clerk pro tier pricing)
- Stripe fees on paid tiers — ~2.9% + $0.30 per subscription transaction
- Email (Resend/Postmark) — ~$0.001-0.005/email

These add roughly $0.50-1.50/user/month at current hosting pricing. Not huge but meaningful at Free-tier scale.

### 5.6 Unit-economics sanity table

| Tier | Revenue/mo | LLM cost/mo (upper) | Other infra cost/mo | Est. gross margin | Gross margin % |
|---|---|---|---|---|---|
| Free (heavy user) | $0 | $2.66 | $0.50 | -$3.16 | N/A (negative) |
| Free (light user) | $0 | $0.80 | $0.30 | -$1.10 | N/A (negative) |
| Plus (median user) | $9 | $3.00 | $0.75 | $5.25 | 58% |
| Plus (heavy user) | $9 | $5.72 | $1.00 | $2.28 | 25% |
| Pro (median user) | $20 | $7.00 | $1.25 | $11.75 | 59% |
| Pro (heavy user) | $20 | $11.23 | $1.50 | $7.27 | 36% |

**Finance-advisor note:** Plus median user gross margin ~58% is HEALTHY for SaaS at scale. Plus heavy user at 25% is thin but not negative. Pro median at 59% is excellent. Free is the financial risk — needs cap.

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
- Lack of immediate «why Memoro vs X?» signal
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

### 6.3 Where is Memoro's biggest funnel risk?

**Finance-advisor assessment:**

Highest-leverage loss points (where best mitigation → biggest conversion lift):

1. **Stage 3 (Activated → differentiated value encountered).** Without warm-start, Free user experiences zero Memoro-unique value for 30 days. Warm-start backfill is THE single most important operational decision for conversion.
2. **Stage 5 (Teaser → Upgrade attempt).** This is where the teaser UX + copy make or break. Content-lead microcopy + product-designer visual treatment + finance-advisor Lane A validation all pile on this stage.
3. **Stage 4 (Activated → First teaser).** Partial-backfill users are the hidden risk — they get some warm-start but not a qualifying pattern. Need lower-threshold firing for first pattern + honest «emerging» vs. «confirmed» framing.

### 6.4 Activation event explicit naming

From `COACH_TIER_PLACEMENT.md` §3.3:

**The activation event is the first Coach teaser firing.** Before this, user has commodity-level tracker features. After this, user experiences Memoro's structural differentiator + sees paid-tier value anchor («there's more detail behind this»). Without the activation event firing in the first 7-14 days post-signup, Free → Plus conversion likely underperforms.

**This is the single most important funnel metric to track post-alpha.**

---

## 7. Risks flagged (summary table)

| # | Risk | Severity | Impact | Mitigation owner |
|---|---|---|---|---|
| F1 | Free tier negative gross margin at scale; LLM burn without offset | HIGH | $26K+/mo at 10K active Free users fully-using allocation | tech-lead (caps + model tier); finance-advisor (monitoring) |
| F2 | Pro $20 head-to-head with PortfolioPilot Gold $20 — RIA competitor with proof | HIGH | Pro-tier conversion pressure; differentiation must earn price parity | Navigator (positioning); content-lead (differentiation messaging); product-designer (UX edge) |
| F3 | Plus $8-10 in crowded 4-way cluster — differentiation not on price axis | MEDIUM | Plus feels «just another tracker» at same price as Copilot/Snowball/Getquin | content-lead (unique Coach messaging); product-designer (Memoro-unique UX) |
| F4 | Warm-start backfill failure reduces Plus conversion 30-50% | HIGH | Plus revenue hypothesis fails if cold-start is the common path | tech-lead (SnapTrade coverage audit); product-designer (empty-state design) |
| F5 | Coach teaser obfuscation wrong dose → low upgrade CTA click-through | MEDIUM | Primary conversion driver fails | product-designer (UX treatment); content-lead (microcopy variants) |
| F6 | Plus user novelty fade after month 3 → high monthly churn | MEDIUM | LTV hypothesis fails; CAC payback stretched | finance-advisor + user-researcher (cohort retention data post-alpha) |
| F7 | ChatGPT Plus $20/mo anchors user mental model on «AI value» — Pro may feel redundant | LOW-MEDIUM | Pro conversion friction | content-lead (positioning vs. ChatGPT differentiation) |
| F8 | ICP B preference for advice (Origin Lane B) may divert away from Memoro Lane A | LOW | ICP B is tertiary per positioning; acknowledged tradeoff | Navigator (already locked; no change) |
| F9 | «90-day history» Free limit narrows Coach quality for any user in that tier | LOW | Coach works better with more history; Free limit compounds 30-day cold-start | product-designer (tier-limit UX); finance-advisor (model impact) |
| F10 | Tax report Pro retention hook depends on report quality + jurisdiction coverage | MEDIUM | Pro retention driver fails if reports are weak or country-incomplete | tech-lead (tax calculation implementation); legal-advisor (jurisdiction compliance) |

---

## 8. Top 3 finance decisions flagged for PO

### 8.1 Free tier AI cost cap — LAUNCH-BLOCKING operational decision

**Recommendation:** lower Free tier AI chat from 5 msg/day to 3 msg/day AND cap total monthly message count (e.g., 60/month) to protect against heavy-Free-use burn. Target: LLM cost per fully-active Free user <$1.50/month.

**Why this is launch-blocking:** without a cap, 10K active Free users fully using allocation = $26K/mo Anthropic bill. If Free → Plus conversion is only 3%, that's 300 paying users × $9 = $2,700/mo revenue — massive net loss.

**Trade-off:** 3 msg/day feels tight vs Getquin / PortfolioPilot free tiers. Mitigate by:
- Pairing cap with strong conversion nudge («Upgrade for unlimited chat»)
- Using model-tiering (Haiku for Free, Sonnet for Plus+) to reduce cost without reducing count
- Periodic re-evaluation post-alpha based on actual usage distribution (if most users use 1-2 chats, 5/day is fine)

**Alternative:** use Haiku for Free instead of Sonnet (~3-5x cost reduction per token). Quality check required.

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
- Conversion funnel percentages are hypothesis anchored on industry SaaS benchmarks; Memoro's actual funnel must be measured post-alpha.
- No Bloomberg / Refinitiv / paid data used (CONSTRAINTS Rule 1 respected throughout).

---

## 10. Revision log

- **2026-04-23 (v1):** Initial validation. finance-advisor. Per-tier value mapping, competitor comparison (PortfolioPilot Gold + Getquin Premium + Snowball Starter + Mezzi Core + ChatGPT Plus), value-per-dollar analysis, cost-to-serve model with Anthropic pricing reference, conversion funnel bottleneck analysis, top-3 PO flags. Most numerical claims flagged `[SOURCE-PENDING]` or hypothesis-labeled until real cohort data post-alpha.

---

**End of Pricing Tier Validation v1. Awaiting tech-lead SnapTrade coverage audit + product-designer teaser UX + content-lead microcopy + real cohort data post-alpha for v2 refinement.**
