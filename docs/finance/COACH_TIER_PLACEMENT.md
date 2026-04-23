# Coach Tier Placement — Teaser-Paywall Spec (LOCKED 2026-04-23, Q5)

**Owner:** `finance-advisor` agent (internal SME, NOT registered investment advisor)
**Date:** 2026-04-23
**Status:** formalizing PO-locked pattern (DECISIONS.md 2026-04-23 Q5) into operational spec
**Depends on:** `02_POSITIONING.md` v3.1 pricing tiers, Q5 teaser-paywall lock, Lane A lock
**Coordinates with:** product-designer (UX spec), content-lead (teaser microcopy), tech-lead (Coach vertical feasibility), legal-advisor (Lane A guardrails on teaser language)

---

## 1. Executive summary

PO locked **teaser-paywall** pattern for Coach surface. This document formalizes the pattern into an operational spec that product-designer, content-lead, tech-lead, and engineering can build against.

Core pattern per tier:

| Tier | Coach behavior | Value anchor | Lane A framing |
|---|---|---|---|
| **Free** | 1 pattern teaser per month, starting after first sync; headline + obfuscated body + Plus-upgrade CTA | activation event + conversion driver | observation («Memoro noticed…»), no prescription |
| **Plus** | Unlimited detailed pattern-reads across core categories (chasing-momentum, disposition-effect, anchoring, loss-aversion, concentration-drift) | full behavioral memory value | descriptive pattern reads, no normative verbs |
| **Pro** | Unlimited + advanced categories (factor-exposure-drift, tax-loss-harvesting-missed, sector-rotation-pattern) + historical retrospectives + export | power-user tier for sophisticated ICP A | same Lane A constraints + more categories |

**Key unit-economics hypothesis:** Free teaser creates a Day-30-to-90 activation event that functions as the primary Free → Plus conversion driver for users who come through organic acquisition. Without Coach-as-conversion-lever, the Free tier has no differentiated activation beyond first-sync dashboard + basic chat (which competitors Getquin / PortfolioPilot-free offer at equivalent quality).

**Key Lane A hypothesis:** Teaser headline stays observational («Memoro noticed a pattern in your NVDA trades»), NOT prescriptive («You should stop doing X»). The obfuscation gates detail, not prescription — the pattern, once unlocked, is still descriptive, never advisory.

**Key risk:** Coach 30-day cold-start problem carried forward from earlier finance-advisor review (2026-04-23 Option 4 §7.1). The teaser-paywall pattern MITIGATES but does not ELIMINATE this risk — warm-start backfill feasibility per Q2 working assumption is what collapses the activation gap from 30 days to ~24 hours. Without warm-start, Free user sees zero Coach activation for the critical first 30 days.

---

## 2. Pattern per tier (operational spec)

### 2.1 Free tier Coach behavior

**Allocation:** 1 pattern teaser per calendar month, starting after first successful broker sync.

**Timing trigger hierarchy (first pattern):**

1. **Warm-start path (preferred, per Q2 working assumption):** SnapTrade trade-history endpoints backfill user's historical trades at first sync. Coach runs retrospective pattern-detection on backfilled history; if a readable pattern exists (≥3 instances of a recognized pattern class in last 6-12 months of history), first teaser fires within 24 hours of first sync.
2. **Warm-start fallback (partial backfill):** If SnapTrade returns partial history (some accounts, some months), run pattern-detection on whatever history is available. Require lower minimum for first-pattern firing (≥2 instances in any window) to accelerate first-value-moment.
3. **Cold-start path (last resort):** If backfill fails entirely or user has only fresh trades post-signup, first teaser waits until 30+ days of live trade history accumulates + detects first qualifying pattern. This is the legacy cold-start timeline; must be flagged to product-designer as a worst-case path to design against explicitly (empty-state copy required).

**Monthly cadence:** After first teaser, subsequent teasers fire monthly on the anniversary-of-first-teaser day, OR when a new qualifying pattern is detected (whichever comes first — but capped at 1 unlocked teaser per calendar month).

**Teaser format (content-lead owns final copy, finance-advisor validates Lane A):**

- **Headline (visible to Free user):** «Memoro noticed a pattern in your [ticker/cluster] trades»
  - Observation verb («noticed») — Lane A clean
  - Specific instrument reference allowed at headline level (factual observation of what the user holds)
  - No action verb, no normative framing
- **Obfuscated body (Free-tier blurred):** pattern category name + first line of pattern description behind a paywall blur treatment
  - Example visible: «Disposition-effect pattern detected • Seen 4 times in the last 6 months»
  - Example obfuscated: «[blurred: full pattern narrative, specific trade dates, frequency tendency]»
- **Primary CTA:** «Unlock details — upgrade to Plus»
- **Secondary CTA:** «Not interested» (dismiss; no pressure)

**Empty-state (cold-start path, no qualifying pattern yet):**

- First 30 days with no backfill: «Memoro is learning your trade patterns. First pattern-read typically appears around day 30.»
  - Sets honest expectation
  - Reframes wait-time as product learning (not product broken)
  - Lane A clean (observation framing, no prescription)
- Warm-start partial backfill: «Memoro has read [N] trades from your history. Looking for patterns as more data accumulates.»

**Lane A guardrails on teaser headline (finance-advisor validated):**

Allowed headline shapes:
- «Memoro noticed a pattern in your [ticker] trades»
- «Memoro noticed a recurring behavior in your [sector/cluster] positions»
- «Memoro noticed something across your [ticker1]/[ticker2]/[ticker3] trades»

BLOCKED headline shapes (Lane A violations, reject in content-lead review):
- «Memoro suggests you [action]» — prescriptive verb
- «You might want to consider [action]» — soft prescription
- «Memoro recommends [action]» — explicit advice
- «This is risky — [action] now» — urgency + implicit prescription
- «Most successful investors [action]» — social proof prescription

### 2.2 Plus tier Coach behavior

**Allocation:** Unlimited pattern-reads.

**Pattern detection categories (core set):**

1. **Chasing momentum** — user bought an asset after a significant run-up (≥N% in last Y days); detected across ≥3 instances
2. **Disposition effect** — user sold winners (held assets) while holding losers (unrealized losses); detected across ≥3 instances
3. **Anchoring** — user repeatedly places limit orders near a specific historical price (e.g., prior purchase price, 52-week high); detected across ≥3 instances
4. **Loss aversion** — user's selling behavior after drawdowns vs. after rallies is statistically asymmetric; detected via rolling-window analysis
5. **Concentration drift** — user's portfolio concentration (HHI or top-3-position share) has shifted significantly over a window, either via trade action or market drift

**Plus-tier output format:**

- Full narrative (2-4 sentences describing the observed pattern)
- Specific trade dates + tickers
- Frequency count («seen 4 times in last 6 months»)
- Tendency direction («trending up», «intermittent», «concentrated in tech»)
- NO normative language («you should», «consider», «most investors», «next time»)
- NO action invitation («rebalance now», «set a stop-loss»)
- Optional: link to Chat surface for follow-up questions («Ask Memoro about this pattern»)

**Follow-up chat integration:**

Plus tier pattern-reads must be followable via Chat. User clicks «Ask Memoro about this pattern» → Chat opens with context-preloaded (the pattern, the trades). User asks; AI answers descriptively about the pattern, still Lane A.

### 2.3 Pro tier Coach behavior

**Allocation:** Unlimited + extended categories.

**Pattern detection categories (advanced, Pro-only):**

6. **Factor-exposure drift** — user's portfolio factor loadings (value/growth, small/large cap, quality, momentum) have shifted over time; detect via Fama-French-inspired regression on historical composition
   - Requires Pro-tier because it needs deeper historical data + factor index integration
7. **Tax-loss-harvesting missed** — user held a losing position into year-end that, had it been harvested, would have generated a tax benefit; retrospective observation, jurisdiction-scoped
   - Pro-tier only because TLH is jurisdiction-specific and requires tax-report integration
   - Lane A framing: «Memoro observed that [losing position] remained held past year-end 2025. At that point its unrealized loss was $X. Tax-loss harvesting rules in [jurisdiction] permit offsetting gains…» (purely observational + educational; does NOT say «you should have harvested»)
8. **Sector-rotation pattern** — user's trade flows show directional rotation across sectors; detected via sector-weight change analysis + trade-flow signing
   - Pro-tier because it requires full historical reconstruction

**Pro-tier extras beyond categories:**

- **Historical retrospectives** — «This is the 3rd time you've shown a [pattern] pattern; first instance was [date], Coach noticed at [time]»
- **Export** — CSV of all pattern-reads (including dates, trades referenced, pattern classifications) for user's own records
- **Custom alerts** — user can subscribe to alerts when specific pattern classes fire (e.g., «alert me if concentration-drift detected»)

---

## 3. Conversion funnel assumptions

### 3.1 Funnel hypothesis (unvalidated, pre-alpha)

Assumed funnel under teaser-paywall pattern:

```
Visitor (landing)
  ↓ [Landing conversion ~2-5% industry benchmark for SaaS landing pages]
Signup (free tier)
  ↓ [Broker sync completion 60-70% of signups — SnapTrade industry benchmark from connector-builder docs; flagged [SOURCE-PENDING]]
Activated (first-sync completed)
  ↓ [Teaser firing rate: warm-start 80%+ within 24h; cold-start path 30%+ by day 30]
First teaser fired
  ↓ [Teaser → unlock-attempt rate: hypothesis 20-35% of users who see teaser engage with upgrade flow]
Upgrade attempt
  ↓ [Upgrade completion conversion: hypothesis 40-60% of attempt-engagers complete payment]
Plus subscriber
  ↓ [Plus → Pro upgrade: hypothesis 5-10% of Plus users move to Pro within 90 days]
Pro subscriber
```

**End-to-end Free → Plus conversion hypothesis:** 3-7% of visitors convert to Plus within 90 days, assuming warm-start activation is operational.

This is a HYPOTHESIS, not a model — must be replaced with real cohort data post-alpha. Flagged `[SOURCE-PENDING]` throughout this section because public benchmarks for freemium SaaS in retail-finance-tracker category at this price point ($8-10/mo) are sparse.

### 3.2 Benchmark comparison (public references)

| Metric | Industry benchmark | Source | Memoro hypothesis |
|---|---|---|---|
| SaaS freemium Free → paid conversion (broad B2C) | 2-5% over 90 days | OpenView Partners 2023 SaaS benchmarks report `[SOURCE-PENDING for URL]` | 3-7% target (teaser-paywall + activation design optimized) |
| Fintech retail app activation (sync completion after signup) | 40-60% | Plaid case-study aggregate `[SOURCE-PENDING]` | 60-70% (SnapTrade single-provider integration; less friction) |
| Freemium upgrade prompt engagement (generic) | 10-20% | ProfitWell benchmarks `[SOURCE-PENDING]` | 20-35% (teaser is content-driven, not interruption-driven — hypothesis is higher engagement) |

**All three benchmark rows need sourcing work in `BENCHMARKS_SOURCED.md` before numbers can ship in any public-facing material or PO-facing financial model. Until sourced, these are DIRECTIONAL HYPOTHESES ONLY.**

### 3.3 Activation event design (finance-advisor view)

The teaser is the **activation event** for conversion. Before the first teaser fires, Free user has:

- Dashboard view of their portfolio (commodity — Getquin / PortfolioPilot-free / Kubera-trial all show this)
- 5 chat messages per day (competitive with Fiscal.ai 10/mo free but limited)
- 1 insight per week (weekly dividends, drawdowns — commodity-level value)

None of these are Memoro-unique. The differentiated activation that separates Memoro from Getquin/PortfolioPilot-free/Snowball-free is the Coach teaser. Without warm-start, that differentiated activation does not exist for 30 days. With warm-start, it exists within 24 hours.

**Finance-advisor conclusion:** Warm-start backfill is the single highest-leverage operational decision for Free → Plus conversion. Q2 defers this to development-stage feasibility verification. This document flags that the conversion funnel is materially different between the two branches (warm-start operational vs not), and the two branches should be modeled as separate scenarios, not averaged.

---

## 4. Edge cases from finance angle

### 4.1 Zero trade history on signup (ICP B AI-native newcomer path)

**Scenario:** User signs up, connects broker, has ≤3 trades total (just opened brokerage account). No pattern-detection possible.

**Handling:**

- Teaser empty-state activates: «Memoro is building memory of your trades. First pattern-reads appear once you've made a few more moves in the market. In the meantime, [Chat] and [weekly Insights] are ready now.»
- Teaser surface still occupies visual real estate on dashboard — reinforces the forthcoming promise rather than hiding Coach entirely
- No Plus-upgrade pressure at this stage (user hasn't experienced the value — upgrade CTA suppressed until first real teaser)
- Monthly check: once user reaches ≥5 trades OR ≥30 days elapsed, teaser flow re-evaluates

**Finance-advisor view:** This is the ICP B cold-start experience. It is structurally unavoidable for users who genuinely have no history — no product can pattern-read on zero data. The honest framing («we're building memory») is the Lane A + consumer-protection defensible position. Do NOT fabricate patterns from thin data; do NOT show demo/aggregate patterns as if they were the user's own (Lane A + FTC §5 exposure).

### 4.2 SnapTrade backfill fails partially

**Scenario:** User has broker accounts; SnapTrade returns transaction history for 1 of 3 accounts, or only last 90 days.

**Handling:**

- Run pattern-detection on whatever history is available
- Lower minimum-instance threshold for first-pattern firing (≥2 instances instead of ≥3) to accelerate first-value-moment
- Teaser notes the partial-data context: «Memoro noticed a pattern in your [ticker] trades from the data available so far. As more history syncs, the picture gets richer.»
- Do NOT show teaser with unsupportable confidence (if N=2 instances is borderline, flag to user as emerging pattern, not confirmed)
- Backfill retry logic: if SnapTrade later returns more history via re-sync, re-run detection on updated dataset

**Finance-advisor view:** N=2 instances is statistically shaky for pattern claims. Content-lead + tech-lead should treat «emerging pattern» framing as a different surface than «confirmed pattern» (different teaser copy, possibly different confidence indicator in the UI). This is a product-designer question ultimately; flag for their spec.

### 4.3 SnapTrade backfill fails entirely (no history endpoint access)

**Scenario:** User's broker is not supported for trade-history backfill, or SnapTrade access fails for the account. Only live trades (forward-looking) are available.

**Handling:**

- Full cold-start path: 30+ days of live trades before first teaser can fire
- Empty-state copy stronger: «Memoro is building memory of your trades. First pattern-read typically appears around day 30 once enough trades accumulate.»
- Dashboard + Chat + weekly Insights are the only Free-tier value surfaces during the 30-day gap
- No upgrade pressure during this window (user has not experienced Coach yet; upgrade pitch is premature)
- Day 30 checkpoint: if no pattern has fired, surface an honest retention message («Memoro has read your trades but hasn't found a repeat pattern yet — you might be a more systematic trader than average!»)

**Finance-advisor view:** This is the worst-case activation path and the scenario where Free → Plus conversion risk concentrates. If a material fraction of users (say ≥20%) fall into this path, Plus conversion suffers. Tech-lead + product-designer should estimate what percentage of launch-geography users (US + EU + UK + LATAM + APAC) have SnapTrade-history-unsupported brokers as their primary broker. If that percentage is high, warm-start feasibility question becomes more consequential than Q2 locked working assumption implied.

### 4.4 User dismisses teaser

**Scenario:** User sees teaser, clicks «Not interested». Next month's teaser fires normally (not suppressed).

**Handling:**

- Dismissal is per-pattern, not per-user-lifetime. Next month's teaser is a different pattern (or same pattern with different instance) — surface fresh
- Do NOT escalate pressure (no retargeting pop-ups, no repeated CTAs after dismiss)
- Track dismissal signal internally — if user dismisses ≥3 teasers in a row, lower teaser frequency to bi-monthly for that user (respect the signal; don't create annoyance churn)
- Offer user-facing control in settings: «Coach surface preferences» → «Show me teaser alerts: Monthly / Every other month / Never»

**Finance-advisor view:** Respecting dismissal signal protects against Free-tier churn from annoyance. Cost: conversion volume per-user. Benefit: retention at the Free tier (which, while not directly monetizing, is the acquisition pool for later conversion). Content-lead + product-designer decision: how much to weight conversion vs respect. My view: respect wins at the Lane-A-product level because annoyance-driven retention loss damages the «on-your-side» brand positioning far more than a few missed conversions.

### 4.5 Pattern quality / false positives

**Scenario:** Pattern-detection algorithm has a false positive rate > 0. User sees a teaser for a pattern that, on drill-in (after upgrade), they don't recognize as their actual behavior.

**Handling:**

- Threshold pattern detection conservatively — prefer false-negatives (missing a real pattern) over false-positives (fabricating a pattern)
- If user upgrades and finds the pattern unconvincing, reputation damage is high; conservative thresholds mitigate this
- Consider showing pattern confidence to Plus users («high-confidence» vs «emerging») to set expectation
- Offer user-facing feedback mechanism («Was this pattern useful?» thumbs-up/down) — data for algorithm tuning + signal for user that Memoro is listening

**Finance-advisor view:** Pattern-detection false positives are both a product-quality issue and a Lane A issue. If Memoro says «Memoro noticed a disposition-effect pattern» and the pattern isn't really there, it violates «accuracy in advertising» regardless of Lane A (FTC §5 + UCPD exposure). Conservative thresholds are the finance + compliance answer; tech-lead owns implementation; finance-advisor will validate sample outputs post-alpha (`AI_CONTENT_VALIDATION.md`).

---

## 5. Churn risk per tier

### 5.1 Free tier churn risk

**Primary churn driver:** Activation lag. If first teaser doesn't fire within 24-48 hours (warm-start path), user may churn before experiencing Coach differentiation. Getquin-free + PortfolioPilot-free offer comparable commodity value at Day 1; Memoro's differentiation depends on Coach activation.

**Churn mitigation (within Free tier):**

- Warm-start backfill (Q2 working assumption) — primary mitigation
- Honest empty-state for cold-start users — retention via expectation-setting, not fake-value
- Weekly insight cadence (1/week) — keeps engagement touchpoints active even during Coach cold-start
- Chat availability (5 msg/day) — provides immediate utility for users who want to ask questions

**Projected Free-tier 30-day retention:**

- Warm-start operational: 50-65% (hypothesis; typical for retail fintech freemium with strong activation)
- Cold-start only: 25-40% (hypothesis; significantly lower without activation event)

Both are `[SOURCE-PENDING]` hypotheses until real cohort data post-alpha.

### 5.2 Plus tier churn risk

**Primary churn driver:** Perceived value-for-money after novelty fade. Month 1-3: pattern-reads are novel, value visible. Month 6+: user has seen most of their patterns; new pattern firings less frequent; value-per-month drops if they're not actively trading.

**Churn mitigation (Plus tier):**

- Broaden pattern categories quarterly (introduce new categories — give returning users new surfacings)
- Pair Coach with Chat (unlimited Chat is Plus value beyond Coach — value diversification)
- Weekly insight quality (ongoing value regardless of Coach activity)
- Dividend calendar + benchmark comparison (Plus-tier commodity features; keep competitive vs Getquin Premium €90/yr which offers similar)
- Monthly «Coach digest» email — reminds user what Coach has learned; reinforces value retention

**Projected Plus-tier monthly churn:**

- Hypothesis 4-7% monthly churn (SaaS B2C freemium-converted benchmark; `[SOURCE-PENDING]`)
- LTV at 4% churn = 25 months × $10/mo = $250 (directional math)
- LTV at 7% churn = 14 months × $10/mo = $140

This range materially affects unit economics (see `PRICING_TIER_VALIDATION.md`).

### 5.3 Pro tier churn risk

**Primary churn driver:** Feature underuse. If user subscribed for advanced analytics (Sharpe/Sortino/factors/max drawdown) + tax reports + API access but doesn't actually use them, $20/mo at head-to-head with PortfolioPilot Gold becomes harder to justify.

**Churn mitigation (Pro tier):**

- Usage-based re-engagement — monthly «Here's what Pro unlocked for you this month» email (shows tax-loss-harvesting observations, factor drift noticed, alerts triggered)
- Power-user community (if it develops) — Pro Discord / private channel for sophisticated ICP A users to exchange patterns + observations
- Year-end tax report dependency — strong retention hook if user uses Memoro as their primary tax-reporting tool (switching cost is high at tax-season)

**Projected Pro-tier monthly churn:**

- Hypothesis 2-5% monthly churn (more committed subscriber cohort; lower churn than Plus; `[SOURCE-PENDING]`)
- Higher price + lower churn = higher LTV per user at Pro
- Risk: lower conversion volume Free → Pro (direct) vs Plus → Pro (upgrade path)

---

## 6. Lane A guardrails summary

| Surface | Lane A risk | Guardrail |
|---|---|---|
| Free teaser headline | Low | Whitelist verbs only (notices, observes, surfaces); NO prescriptive verbs |
| Free teaser body (obfuscated) | None | Body is paywalled; whatever pattern description lives in Plus output has its own guardrails |
| Plus pattern narrative | Medium (historical finance-advisor §3.5 EDGE verdict in EU/UK) | Descriptive-only; NO «you should», «consider», «next time», «most investors» |
| Plus pattern-naming convention | Medium (legal-advisor §3.5 flagged: «counter-cyclical» has implicit normative weight) | Use neutral category names in UI (e.g., «disposition-effect pattern» not «bad-timing pattern»); in narrative body describe what was observed, not what it means normatively |
| Pro TLH observation | Higher (tax-specific; jurisdiction-dependent) | Framing: «Memoro observed that [position] remained held past year-end. Jurisdiction tax rules in [country] permit offsetting gains…» — educational, not prescriptive; include «consult a tax professional» disclaimer for TLH specifically |
| Pro factor-drift observation | Low | Factual observation of composition change over time; no «you should rebalance» framing |
| Pro sector-rotation observation | Low | Factual observation of trade-flow direction over time; no «your sector bets are wrong» framing |
| AI chat follow-up on any Coach pattern | Medium | Chat AI system prompt enforces Lane A guardrails universally — see `AI_CONTENT_VALIDATION_TEMPLATES.md` |

---

## 7. Open questions → flag to other specialists

1. **product-designer:** What is the visual treatment for the obfuscated teaser body? Blur vs lock-icon vs skeleton-shape vs grayscale with «Upgrade to unlock» overlay? Design affects perceived value of the gated content + conversion rate.
2. **content-lead:** Final microcopy for teaser headline variants (headline templates per pattern category). Must pass Lane A whitelist check before shipping.
3. **tech-lead:** Confirm SnapTrade trade-history endpoint coverage across launch-geography broker set (US + EU + UK + LATAM + APAC major brokers). If coverage <70%, warm-start feasibility gate is more consequential than Q2 assumption implies.
4. **legal-advisor:** Review Pro-tier TLH observation language for per-jurisdiction tax-advice-line compliance. TLH is retroactive observation (historical year-end); US IRS wash-sale rules + EU country-specific rules apply. Escalate to live counsel per jurisdiction.
5. **user-researcher (post-alpha):** Test teaser format with ICP A (N=8-12) in first alpha-user interview wave. Measure: teaser engagement rate, upgrade CTA click-through, perceived value of obfuscation vs annoyance.

---

## 8. Top 3 decisions for PO

1. **Warm-start backfill is the Free → Plus conversion keystone.** Q2 locks it as working assumption deferred to dev-stage verification. Recommend elevating this to an explicit pre-Coach-MVP gate: before Coach ships, tech-lead must verify SnapTrade trade-history coverage for ≥70% of launch-geography users. Below that threshold, teaser-paywall Plus conversion likely underperforms significantly vs industry freemium baselines. **Impact if skipped: Plus conversion may come in 30-50% below hypothesis at launch.**

2. **Free-tier Coach teaser has zero direct revenue but high cost-of-compute.** Pattern detection runs on user's trade history regardless of tier. Each pattern-detection run costs LLM inference (Anthropic API) plus compute for statistical analysis. Free tier sees 1 teaser/month but the detection ran on the full history every time the check fired. **Recommend: cache pattern-detection state; re-run detection only on new trades or monthly refresh, not on every app-open.** Cost modeling in `PRICING_TIER_VALIDATION.md` §cost-to-serve.

3. **Teaser copy is content-lead's Lane A tightrope.** Teaser must generate curiosity + FOMO without crossing into implied prescription. Content-lead dispatch post-naming-lock needs finance-advisor + legal-advisor co-validation on draft headline templates before shipping. **Recommend: content-lead produces ≥5 headline variants per pattern category; finance-advisor validates against whitelist/blacklist verbs; legal-advisor validates against EU/UK MiFID/FCA personal-recommendation-test.**

---

## 9. Evidence + sources

**Locked PO decisions referenced:**

- `docs/DECISIONS.md` 2026-04-23 «Option 4 review synthesis: 7 PO decisions locked» — Q5 (teaser-paywall pattern) + Q2 (warm-start working assumption)
- `docs/DECISIONS.md` 2026-04-23 «Regulatory lane LOCKED: Lane A»

**Prior finance-advisor work:**

- `docs/reviews/2026-04-23-finance-advisor-option4.md` §7.1 (Coach cold-start vs Free tier structural mismatch) + §7.2 (tier placement options + recommendation)

**Prior legal-advisor work:**

- `docs/reviews/2026-04-23-legal-advisor-option4.md` §3.5 (Coach Lane A audit) + §AI-specific disclosures guidance

**Competitor reference:**

- `docs/product/pricing-landscape.md` (Getquin Premium €90/yr, PortfolioPilot Gold $20/mo, Snowball Starter $80/yr)

**External benchmarks status:**

- Free → paid conversion rates, activation rates, freemium upgrade engagement: all `[SOURCE-PENDING]` — must be sourced in `BENCHMARKS_SOURCED.md` before shipping to financial model

---

## 10. Revision log

- **2026-04-23 (v1):** Initial spec. finance-advisor. Formalizes PO Q5 lock into operational tier-behavior specification.

---

**End of Coach Tier Placement Spec. Awaiting product-designer UX spec + content-lead teaser microcopy + tech-lead feasibility confirmation.**
