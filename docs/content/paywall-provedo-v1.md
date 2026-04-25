# Paywall — Provedo v1 (EN-only)

**Author:** content-lead
**Date:** 2026-04-25
**Status:** v1 DRAFT — first pass under Provedo lock + 5-item EN guardrails. EN-only per PO directive 2026-04-25. RU drafts deferred to wave-2.
**Pairs with:** `landing-provedo-v1.md` v2 · `microcopy-provedo-v1.md` v1 · `email-sequences-provedo-v1.md` v1 (Email 4 + Email 5 = upsell context) · `04_DESIGN_BRIEF.md` §13 freemium UX (tier feature matrix + paywall constraints) · `04_BRAND.md` §5 tone-of-voice map row «Paywall: Honest + non-dark-pattern».

**Constraints respected:**
- Rule 1 (no spend) — markdown only. No paid paywall-platform integration proposed.
- Rule 2 (no external send) — repo artefact.
- Lane A — observation-register only; zero advice register.
- **5-item EN guardrails — load-bearing through every variant:**
  1. Banned co-occurrence: Provedo + advice/recommendation/strategy/suggestion → audited zero.
  2. AI system-prompt anchor inherits from landing v2 §A.
  3. EN verb-allowlist enforced.
  4. «Guidance» splitter — no «provides guidance».
  5. Coach-surface paywall mentions audited (variant B).
- **Brand commitment honored:** «Free is always Free» per `04_BRAND.md` §2 manifesto.
- **Anti-dark-pattern discipline** per `04_DESIGN_BRIEF.md` §13:
  - No countdown timers
  - No fake urgency
  - No hidden auto-renewal
  - One-click cancel
  - Trial requires card but cancellation is friction-free

---

## §0. Voice register for paywall (locked)

Per `04_BRAND.md` §5 row «Paywall»:
- **Register:** Honest + non-dark-pattern.
- **Example phrasing reference:** «Free is always Free. Plus unlocks unlimited chat + daily insights.»
- **Anti-pattern rejected:** Manipulation tactics («last chance», fake urgency, hidden auto-renewal).

**Honest-upsell discipline (Hormozi value-equation framing — `sales-influence:hundred-million-offers`):**
- **Dream outcome:** «See what's happening across your portfolio every day, not just once a week.»
- **Perceived likelihood:** Surface concrete features (unlimited chat, daily insights, full pattern reads) — not vague benefit-language.
- **Time delay:** «14 days free» = immediate access; no waitlist friction.
- **Effort/sacrifice:** «Cancel any time, one click, no email back-and-forth» = explicit anti-friction framing.

**Cialdini-discipline (`sales-influence:influence-psychology`, **honest mode only**):**
- Reciprocity: Free tier is genuinely useful (multi-broker aggregation, weekly insights, 50 chats/month) — not crippleware. Establishes good-faith trust before any upgrade ask.
- Social proof: NOT used in v1. («10,000+ users on Plus» style would require real data; we're pre-alpha. v2 may add post-launch.)
- Scarcity: NOT used. (No «limited slots», «founding member pricing» tricks.)
- Commitment/consistency: NOT manipulated. (No «You said you'd upgrade — here's your reminder» dark-pattern.)
- Authority: Implicit via product quality, not name-drop.
- Liking: Sage tone, not chumminess.

---

## §1. Tier feature matrix (per Design Brief §13, content-lead phrasing pass)

Tier structure locked in `04_DESIGN_BRIEF.md` §13 + `02_POSITIONING.md` §Pricing tiers. Content-lead applies Provedo-voice phrasing pass; structure unchanged.

| Feature | Free | Plus ($8–10/mo) | Pro ($20/mo) |
|---|---|---|---|
| **Brokers / accounts connected** | 2 | 10 | Unlimited |
| **Chat messages** | 50 / month | Unlimited | Unlimited |
| **Insights cadence** | Weekly digest | Daily | Real-time as found |
| **Coach pattern reads** | Locked teasers (Plus opens full read) | Full pattern reads | Full pattern reads |
| **Dividend calendar** | — | Yes | Yes |
| **Benchmark comparison** | — | Yes | Yes |
| **CSV export** | — | Yes | Yes |
| **Tax reports (US + DE)** | — | — | Yes |
| **Advanced analytics (Sharpe, Sortino, factor exposure, max drawdown)** | — | — | Yes |
| **Custom alerts** | — | — | Yes |
| **API access** | — | — | Yes |
| **Sync frequency** | Daily | Hourly | Real-time |
| **Position history** | 90 days | Full history | Full history |

**Locked Free commitments (do NOT cross):**
- Multi-broker aggregation: 2 brokers stays workable for first-real-portfolio user.
- Weekly digest: every Free user gets the «Three things this week» observation flow.
- 50 chat messages / month: enough for ~1.5 questions per day, casual usage.
- 90-day position history: enough to ask «why am I down this month?» / «what changed this quarter?».

**Plus = unlocking volume + cadence + coach.** Pro = adds depth + real-time + reports.

---

## §2. Modal — Variant A (Observation-pull)

Pulls upgrade trigger from the *aggregation+observation* angle. Plays to ICP-A multi-broker millennial («I want to see more, more often»).

**Trigger contexts:** Free user on insights tab; Free user clicks daily-insight teaser; Free user navigates to settings → upgrade.

| Element | Copy (EN) | Chars |
|---|---|---|
| Modal headline | See what's happening across your portfolio every day, not just once a week. | 78 |
| Modal sub | Plus opens the full Provedo cadence. | 36 |
| Body (3 features) | — Unlimited chat, no monthly cap. Ask whenever the question lands. | 65 |
|  | — Daily insights instead of weekly. What changed today, surfaced once a day. | 76 |
|  | — Full pattern reads. Every behavioral pattern Provedo has noticed in your trades, with timeline. | 96 |
| Trial framing | First 14 days free. Cancel any time, one click. | 47 |
| Pricing line | $8/month after trial. | 21 |
| Free commitment | And Free stays Free. If Plus isn't for you, Provedo keeps reading at the Free cadence. | 87 |
| Primary CTA | Try Plus 14 days free | 21 |
| Secondary CTA | Stay on Free | 12 |

**Lane A audit:**
- All Plus features described as **functional product capabilities**, not advice register.
- «Surfaced once a day» = observation; not «alerts you when to act».
- «Behavioral patterns Provedo has noticed in your trades, with timeline» — Coach-surface mention. Frame is *gated access to observation*, not *gated access to advice*. PASS guardrail #5.

**Anti-dark-pattern check:**
- No countdown ✓
- No fake urgency («Only today!» — not used) ✓
- No hidden auto-renewal — «$8/month after trial» explicit ✓
- One-click cancel — explicit «Cancel any time, one click» ✓
- Free commitment surfaced before secondary CTA ✓

**EN guardrail audit:**
- #1 Banned co-occurrence: zero. PASS.
- #3 Allowlist: opens / surfaces / noticed / reads. PASS.
- #4 «Guidance»: zero. PASS.
- #5 Coach-audit: «Every behavioral pattern Provedo has noticed in your trades» — observation register; «with timeline» = visualization-of-observation, not advice-payload. PASS.

---

## §3. Modal — Variant B (Context-pull)

Pulls upgrade trigger from the *holding-context* angle. Plays to ICP user who's already engaged but hitting volume cap on chat.

**Trigger contexts:** Free user hits 40+/50 monthly chat messages; Free user gets `error.chat_rate_limited_free` error.

| Element | Copy (EN) | Chars |
|---|---|---|
| Modal headline | Provedo holds your context — Plus lets you ask whenever. | 56 |
| Modal sub | Unlimited chat, daily insights, full pattern reads. | 51 |
| Body (3 features) | — **Unlimited chat.** Ask 5 times today, 50 tomorrow, 200 this month — no cap. | 80 |
|  | — **Daily insights.** Once-a-week becomes once-a-day, surfacing what's changed. | 78 |
|  | — **Full pattern reads.** The locked teasers in Coach unlock — every pattern, with the trade timeline behind it. | 110 |
| Trial framing | 14 days free. Cancel one click. No email back-and-forth. | 56 |
| Pricing line | $8/month after trial. | 21 |
| Free commitment | Free stays Free. The cap is real, but multi-broker, weekly insights, and 50 chats reset every month — those don't go anywhere. | 124 |
| Primary CTA | Try Plus 14 days free | 21 |
| Secondary CTA | Stay on Free for now | 20 |

**Lane A audit:** Same as Variant A — all features functional, allowlist verbs, no advice register.

**Anti-dark-pattern check:** Same as Variant A. ✓

**EN guardrail audit:**
- #1: zero ban-words. PASS.
- #3: holds / lets / surfacing / unlock. PASS.
- #5 Coach-audit: «every pattern, with the trade timeline behind it» — observation framing. PASS.

**Differentiator from Variant A:** Variant B emphasizes **volume relief** over **cadence expansion**. Better fit for usage-cap-trigger context (user has demonstrated intent by hitting cap; pull is «let me ask freely» not «show me more»).

---

## §4. Modal — Variant C (Trial-soft)

Pulls upgrade trigger from the *low-commitment trial* angle. Plays to user undecided on value; emphasizes reversibility over feature-richness.

**Trigger contexts:** First-time paywall surface (user hasn't seen any prior paywall); cold-traffic landing → upgrade flow.

| Element | Copy (EN) | Chars |
|---|---|---|
| Modal headline | Try Plus for 14 days. See if it earns its place. | 49 |
| Modal sub | If it doesn't, cancel one click. Free stays open. | 49 |
| Body (3 features as bulleted, lighter touch) | — Unlimited chat | 16 |
|  | — Daily insights instead of weekly | 33 |
|  | — Full Coach pattern reads | 26 |
|  | — Dividend calendar, benchmark comparison, CSV export | 53 |
| Trust block | No card-of-shame, no email-cancellation maze. Card required for trial; one-click cancellation any time. | 105 |
| Pricing line | After trial: $8/month. Cancel any time. | 38 |
| Free commitment | Don't want to try? Free's still here — multi-broker, weekly insights, 50 chats / month. | 88 |
| Primary CTA | Start 14-day trial | 18 |
| Secondary CTA | Stay on Free | 12 |

**Lane A audit:** All features functional. No advice register.

**Anti-dark-pattern check:**
- «No card-of-shame, no email-cancellation maze» — explicit naming-and-rejecting of competitor dark patterns.
- Free path surfaced as parallel choice, not afterthought.
- One-click cancel + 14-day window stated twice (modal subhead + trust block).

**EN guardrail audit:**
- #1: zero. PASS.
- #3: try/see/cancel/start. PASS (functional CTAs).
- #4: zero «guidance». PASS.
- #5 Coach-audit: «Full Coach pattern reads» — single phrase, no behavioral payload. PASS.

**Differentiator:** Variant C lowers commitment-anxiety for users uncertain about value. Best for cold-traffic and first-paywall-surface; weaker for already-engaged-but-capped users (where Variant B's volume framing is stronger).

---

## §5. A/B test recommendation matrix

| Trigger context | Recommended primary variant | Rationale |
|---|---|---|
| Free user clicks daily-insight teaser | **Variant A (Observation-pull)** | User wants more cadence; A frames upgrade as cadence-unlock |
| Free user hits 40/50 chat cap (Email 4 + in-app) | **Variant B (Context-pull)** | User has demonstrated volume intent; B frames upgrade as volume-relief |
| Free user clicks Coach locked-teaser | **Variant B (Context-pull)** | Coach is volume+depth; B's «full pattern reads with timeline» pulls hardest |
| Cold-traffic landing → upgrade | **Variant C (Trial-soft)** | First touch; lowest-friction frame wins for unfamiliar users |
| Settings → manual upgrade flow | **Variant C (Trial-soft)** | Self-initiated context; trust-block discipline rewards intentionality |
| Free user 30+ days, no prior paywall view | **Variant A (Observation-pull)** | Established trust; cadence-expansion frame fits long-tenure user |

**Test discipline:**
- Run 50/50 split between A vs B for 2 weeks on volume-cap trigger context (clearest comparison).
- Run 50/50 split between A vs C for cold-traffic.
- Measure: trial-start rate, trial-to-paid conversion at day 14, 30-day retention post-paid.
- DO NOT measure «time-to-decision» as a stress KPI — anti-dark-pattern principle says we're not optimizing for impulsive decisions.

---

## §6. In-product paywall surfaces (non-modal)

Locked-feature surfaces that surface paywall affordance inline rather than via full modal.

### §6.1 Daily-insight locked card (dashboard)

**Trigger:** Free user lands on dashboard; daily-insight slot is gated.

| Element | Copy (EN) |
|---|---|
| Card label | Daily insight |
| Locked headline | Plus unlocks daily insights |
| Locked body | Provedo surfaces what changed today, once a day. Free is once a week. |
| CTA | See Plus details |

### §6.2 Real-time-sync locked label (broker card)

**Trigger:** Free or Plus user views broker-card sync settings; real-time toggle is Pro-only.

| Element | Copy (EN) |
|---|---|
| Label | Real-time sync · Pro |
| Tooltip on click | Real-time sync is part of Pro. Plus syncs hourly; Free syncs daily. |
| CTA (when expanded) | See Pro details |

### §6.3 CSV-export locked button (transactions tab)

**Trigger:** Free user clicks Export CSV.

| Element | Copy (EN) |
|---|---|
| Locked tooltip | CSV export is part of Plus. |
| Button label | Export CSV (Plus) |
| Click action | Opens Variant B paywall modal (volume/context frame fits) |

### §6.4 Coach locked teaser (popover)

**Trigger:** Free user clicks Coach dot on dashboard pattern.

| Element | Copy (EN) |
|---|---|
| Header | A pattern is here |
| Body | Provedo holds the full pattern. Plus opens it — and every other pattern Provedo has noticed in your trades. |
| Locked indicator | Plus unlocks the full read |
| CTA | See full pattern with Plus |
| Footer (always present) | Provedo notices — no judgment, no advice. The decisions stay yours. |

(Strings shared with `microcopy-provedo-v1.md` §8 — kept in sync.)

### §6.5 Tax-reports locked (Pro-only feature)

**Trigger:** Free or Plus user navigates to tax-reports tab.

| Element | Copy (EN) |
|---|---|
| Header | Tax reports are part of Pro |
| Body | Provedo generates jurisdiction-specific tax reports for US and Germany. More jurisdictions added over time. |
| CTA | See Pro details |

**Lane A audit on §6.5:** «Provedo generates… tax reports» = factual report-generation; not «provides tax advice». «See Pro details» = neutral CTA. PASS guardrail.

---

## §7. Paywall global rules (locked)

Per `04_DESIGN_BRIEF.md` §13 + brand commitment in `04_BRAND.md` §2:

1. **«Free is always Free» commitment surfaces in EVERY paywall touchpoint.** Modal, locked-feature card, locked tooltip — every one carries the explicit Free-commitment line. Not optional.
2. **One-click cancel is mandatory.** Every Plus/Pro upgrade flow includes the explicit «Cancel any time, one click, no email back-and-forth» (or equivalent ≤60-char compression).
3. **Card required for trial; cancellation friction must be zero.** This is the only friction allowed in the trial framing. (Asymmetry: high-friction-on-entry for adverse selection / low-friction-on-exit for trust.)
4. **No countdown timers, ever.** No «Plus offer expires in 24h:00m:00s». Time pressure is forbidden.
5. **No «founding member» / «early access» fake-scarcity.** Pricing is what it is; no manufactured exclusivity.
6. **Coach paywall surfaces inherit `coach.observation_closer`** («Provedo notices — no judgment, no advice. The decisions stay yours.») as footer — Lane A trust phrase is locked into the highest-risk paywall surface.
7. **No social-proof claims until they're real.** «Join 10,000 investors» style is forbidden until we have 10,000 investors AND can cite the count honestly.

---

## §8. EN guardrail consolidated audit

| Section | #1 Banned co-occurrence | #2 System-prompt anchor | #3 Allowlist verbs | #4 Guidance splitter | #5 Coach audit |
|---|---|---|---|---|---|
| §1 Tier matrix | PASS | N/A | PASS | PASS | N/A (functional) |
| §2 Variant A | PASS | inherits | PASS | PASS | PASS (observation framing) |
| §3 Variant B | PASS | inherits | PASS | PASS | PASS (timeline-of-observation) |
| §4 Variant C | PASS | inherits | PASS | PASS | PASS (single-phrase feature) |
| §5 A/B matrix | N/A (analytics doc) | N/A | N/A | N/A | N/A |
| §6 In-product surfaces | PASS (disclaim only) | inherits | PASS | PASS | PASS line-by-line (§6.4) |

**Audit result: CLEAN across all variants. Zero violations.**

---

## §9. Open questions for PO (return to Navigator)

1. **Variant locked for v1 ship.** Three variants drafted; A/B/C all clean. Recommendation: ship Variant B as default for usage-cap trigger context (most common Free→Plus path), Variant C as cold-traffic default, Variant A as A/B test challenger. PO call on the default lock.
2. **Trial-card requirement.** v1 spec assumes 14-day trial **requires card** (per Design Brief §13). Anti-dark-pattern principle is preserved via one-click cancel. Alternative: card-free trial (lower-friction-entry, but higher-friction-cancel-conversion). Recommendation: keep card-required + one-click cancel — it's the right balance for trust + adverse-selection. PO call.
3. **Pro tier paywall.** v1 covers Free→Plus only. Plus→Pro paywall variants not drafted (lower priority — fewer Plus users will hit Pro upsell; Pro is depth-niche). Recommendation: defer Pro paywall to v1.1 once Plus base is real. PO confirm scope.
4. **Variant A vs B copy length.** Variant B is longer (124-char Free commitment). Modal real-estate may constrain. Recommendation: keep B's longer Free commitment — the trust load it carries is worth the line. If design constrains, compress «multi-broker, weekly insights, and 50 chats reset every month» to «multi-broker, weekly insights, monthly chat allowance».
5. **«No card-of-shame, no email-cancellation maze» (Variant C).** Phrasing is opinionated — explicitly names competitor dark patterns. Some PO read this as on-brand (Sage with edge); some prefer softer phrasing. Alternative: «Card required for trial; cancellation is one click, no email back-and-forth.» Recommendation: keep opinionated version; it's a positioning differentiator. PO call.

---

## §10. Files in suite

This file is one of three v1 deliverables landing 2026-04-25 alongside `landing-provedo-v1.md` v2 and `email-sequences-provedo-v1.md` + `microcopy-provedo-v1.md`. See landing v2 §12 for full suite manifest.

**END paywall-provedo-v1.md (v1)**
