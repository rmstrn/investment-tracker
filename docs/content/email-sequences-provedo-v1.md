# Email Sequences — Provedo v1 (EN-only)

**Author:** content-lead
**Date:** 2026-04-25
**Status:** v1 DRAFT — first pass under Provedo lock + 5-item EN guardrails. EN-only per PO directive 2026-04-25 («забудь про русский пока»). RU drafts deferred to wave-2.
**Pairs with:** `landing-provedo-v1.md` v2 · `04_BRAND.md` §5 tone-of-voice map (email register: «Patient + warm») · `04_DESIGN_BRIEF.md` §13.4 (sequence triggers/structure) · `BRAND_VOICE/VOICE_PROFILE.md` 5-item EN guardrails.

**Constraints respected:**
- Rule 1 (no spend) — markdown only. No paid email-platform integration proposed.
- Rule 2 (no external send) — drafts for PO review; no emails dispatched.
- Lane A — observation-register only; zero performance promises; «Free is always Free» commitment honored.
- **5-item EN guardrails — load-bearing through every template:**
  1. Banned co-occurrence: Provedo + advice/advise/recommendation/strategy/suggestion → audited zero.
  2. AI EN system-prompt anchor consistent (§A reference applies).
  3. EN verb-allowlist enforced.
  4. «Guidance» splitter — «provides clarity» preferred.
  5. Coach-surface high-risk audit applied (Email 2 + Email 3).

**Character budgets (per Brand Foundation §6 + email standards):**
- Subject ≤50 chars
- Preheader ≤90 chars
- Body 3-5 short paragraphs
- Single primary CTA (≤24 chars button label)

---

## §0. Voice register for email (locked)

Per `04_BRAND.md` §5 tone-of-voice map row «Email sequences (welcome, weekly digest)»:
- **Register:** Patient + warm.
- **Example phrasing reference:** «Provedo has been reading your portfolio for a week now — here are 3 things it noticed.»
- **Anti-patterns rejected:** «Don't miss out!» / «Limited-time strategy alert» / urgency-stacking / FOMO-bait headlines / fake countdown.

**Tone discipline:**
- Provedo is the named agent doing the noticing/holding/surfacing — not «we» (the company), not «our system».
- No exclamation marks in agent voice. Plain periods. Sage gravitas + Everyman warmth, never Sidekick pep.
- No emoji in agent voice (Notion-restrained tone lock).
- «Free is always Free» commitment surfaces in every Free→Plus mention. Never tease the Free user with «you'll lose access».

---

## §1. Email 1 — Welcome (sent on signup, before first portfolio connect)

**Trigger:** account creation succeeds, before SnapTrade/Plaid OAuth flow completes.
**Goal:** Set expectation for what Provedo does and doesn't do; reduce drop-off at the connect step; introduce the named agent.

| Field | Copy (EN) | Chars |
|---|---|---|
| Subject | Welcome to Provedo | 18 |
| Preheader | Connect a broker — Provedo takes it from there. | 47 |

**Body:**

> Welcome to Provedo.
>
> Provedo is a second brain for your portfolio. It holds what you own across every broker, notices what would slip past in a normal week, and shows you patterns in the trades you've already made. With sources for every answer.
>
> One thing first — connect a broker. SnapTrade or Plaid handles the connection (read-only; Provedo never has trading rights). Once your accounts sync, Provedo starts reading.
>
> A note on what Provedo doesn't do: it doesn't recommend buys or sells, doesn't tell you to rebalance, doesn't predict prices. It surfaces, explains, and cites. The decisions stay yours.

**Primary CTA:**

| Field | Copy (EN) | Chars |
|---|---|---|
| Button label | Connect a broker | 16 |
| Button URL | https://provedo.ai/app/connect | — |

**Lane A audit:**
- «Doesn't recommend buys or sells, doesn't tell you to rebalance, doesn't predict prices» — Provedo *disclaims* the advice register; never claims it.
- «With sources for every answer» — trust-through-transparency.
- Allowlist verbs throughout: holds / notices / shows / surfaces / explains / cites / reads.

**EN guardrail audit:**
- Banned co-occurrence (Provedo + advice/recommendation/strategy/suggestion): zero in claiming sense; only present in disclaim-by-negation. PASS.
- Allowlist verbs only. PASS.
- No «provides guidance». PASS.
- This template is not coach-surface (no behavioral pattern context). N/A on guardrail #5.

---

## §2. Email 2 — First-insight (sent after first cross-broker aggregation lands)

**Trigger:** first SnapTrade/Plaid sync completes AND aggregation surface has at least one observation ready (typically minutes-to-hours after Email 1's CTA).
**Goal:** Provedo's first concrete «hello» moment; demonstrate the JTBD on the user's actual data; replace the abstract welcome promise with a specific observation.

| Field | Copy (EN) | Chars |
|---|---|---|
| Subject | Provedo noticed three things | 28 |
| Preheader | Your first read across every account you connected. | 51 |

**Body:**

> Provedo finished its first read. Three things stood out across your accounts:
>
> **One.** You're holding 14 positions across 2 brokers — combined value ${TOTAL_VALUE}. The largest single position is {TOP_HOLDING_TICKER} at {TOP_HOLDING_PCT}% of your equity exposure.
>
> **Two.** {DIVIDEND_COUNT} upcoming dividend payments in the next 30 days, totaling roughly ${DIVIDEND_TOTAL}. The next one is {NEXT_DIV_TICKER} on {NEXT_DIV_DATE}.
>
> **Three.** {INSIGHT_THIRD_OBSERVATION_TEMPLATE}. (Example: «Your tech allocation is 58% — for context, US retail median is around 34%.»)
>
> Three observations, sources cited inline. No advice, no recommendations — just what Provedo sees in your real holdings.

**Primary CTA:**

| Field | Copy (EN) | Chars |
|---|---|---|
| Button label | Open Provedo | 12 |
| Button URL | https://provedo.ai/app | — |

**Lane A audit:**
- All three observations are factual aggregation/disclosed-corp-action data + retrospective context. No predictions. No imperatives.
- «No advice, no recommendations» — Provedo disclaims; doesn't claim.
- «For context» framing on the third observation = allowlist verb pattern (provides context, not advice).

**EN guardrail audit (high-risk template — first push):**
- #1 Banned co-occurrence: zero claiming-sense. «No advice, no recommendations» = explicit disclaim. PASS.
- #3 Allowlist: noticed/finished its first read/sees. PASS.
- #5 Coach-audit: this email is NOT coach-surface (it's aggregation + insight, not behavioral pattern read). However, the third observation slot CAN drift toward coach if the personalization template surfaces a trade pattern. Engineering integration MUST scope third-observation template to insights category only (dividends / concentration / cash drag / events) — NOT trade-behavior patterns. Behavioral patterns belong in Email 3 weekly check-in or Email 5 upgrade offer, where Coach context is established.

---

## §3. Email 3 — Weekly check-in (recurring, Sage observation digest)

**Trigger:** Free tier — every 7 days post-signup, sent on user's preferred day-of-week (default: Monday morning local time per `04_DESIGN_BRIEF.md` §16). Plus tier — daily; this template covers Free cadence baseline.
**Goal:** Sustain engagement via observation-register digest; demonstrate ongoing value; reinforce Sage-archetype trust.

| Field | Copy (EN) | Chars |
|---|---|---|
| Subject | This week, Provedo noticed | 26 |
| Preheader | Three things across your portfolio in the last seven days. | 58 |

**Body:**

> Three things from your portfolio this week:
>
> **{INSIGHT_HEADLINE_1}** — {INSIGHT_BODY_1}. {INSIGHT_SOURCE_CITATION_1}.
>
> **{INSIGHT_HEADLINE_2}** — {INSIGHT_BODY_2}. {INSIGHT_SOURCE_CITATION_2}.
>
> **{INSIGHT_HEADLINE_3}** — {INSIGHT_BODY_3}. {INSIGHT_SOURCE_CITATION_3}.
>
> Provedo reads, surfaces, cites. The reading is yours.

**Example concrete fill (for QA/preview):**

> Three things from your portfolio this week:
>
> **NVDA at 52-week high** — Your NVDA position is now 14% of your portfolio, up from 11% last month. Source: live broker positions + 90-day price chart.
>
> **$124 in dividends** — Three dividend payments arrived this week: KO ($87 ex-div Sept 14), VZ ($28 ex-div Sept 12), and one smaller from JNJ ($9). Source: broker-confirmed transactions.
>
> **EUR cash drag** — Your EUR cash balance is €4,200, up from €3,800 last month. Inflation-adjusted, that's roughly -2.1% in real purchasing power over the trailing year. Source: ECB HICP series.
>
> Provedo reads, surfaces, cites. The reading is yours.

**Primary CTA:**

| Field | Copy (EN) | Chars |
|---|---|---|
| Button label | See full digest | 15 |
| Button URL | https://provedo.ai/app/insights | — |

**Lane A audit:**
- All three observation slots are observation-register (current-state + source citation). No predictions, no imperatives.
- «The reading is yours» — explicit Lane A positive trust signal (parallel to «no judgment, no advice» from coach copy).
- Provedo named as agent of reading/surfacing/citing.

**EN guardrail audit:**
- #1 Banned co-occurrence: zero. PASS.
- #3 Allowlist: reads / surfaces / cites / noticed. PASS.
- #4 «Guidance» splitter: digest content surfaces «what's there», not «what to do». No «provides guidance». PASS.
- #5 Coach-audit: insight templates 1-2 = aggregation/dividend (insights surface, low risk). Template 3 in example = «EUR cash drag» = informational with explicit source. If concrete fills shift to behavioral-pattern category (sells/buys patterns), separate Coach audit applies — engineering integration MUST surface coach observations only via Coach-specific weekly digest variant (not this template). PASS for current scope.

---

## §4. Email 4 — Limit-approaching (Free tier ~80% of 50 msg/month cap)

**Trigger:** Free tier user reaches 40 chat messages in a calendar month (80% of 50-msg cap per `04_DESIGN_BRIEF.md` §13).
**Goal:** Honest heads-up; preserve trust; soft Plus introduction; no urgency manipulation; «Free is always Free» commitment honored.

| Field | Copy (EN) | Chars |
|---|---|---|
| Subject | A heads-up on your monthly chats | 32 |
| Preheader | You've used 40 of your 50 free messages this month. | 51 |

**Body:**

> Quick heads-up — you've used 40 of your 50 free chat messages this month. The remaining 10 are still available, and the counter resets on the 1st.
>
> If you're hitting the limit often, Plus unlocks unlimited chat plus daily insights for $8/month. There's a 14-day free trial if you want to try it before deciding.
>
> Free stays Free. The cap is real, but so is the rest of the product — multi-broker aggregation, weekly insights, and full chat on what you own — those don't go anywhere.
>
> Whatever you pick, Provedo keeps reading.

**Primary CTA (soft, not push):**

| Field | Copy (EN) | Chars |
|---|---|---|
| Button label | See Plus details | 16 |
| Button URL | https://provedo.ai/app/upgrade | — |

**Secondary text-link (in body, not button):**

| Field | Copy (EN) |
|---|---|
| Link text | Or stick with Free — that works too. |
| Link URL | https://provedo.ai/app |

**Lane A audit:**
- No advice register; this is a usage notification + soft Plus introduction.
- No fake urgency («Last chance!» — not used). No countdown. No «Don't miss out».
- «Free stays Free» commitment surfaced explicitly; trust-preserve before upsell.

**EN guardrail audit:**
- #1 Banned co-occurrence: zero. PASS.
- #3 Allowlist: kept / unlocks (functional, not advice). PASS.
- #4 «Guidance» splitter: «Plus unlocks unlimited chat» — functional product description, not «provides guidance». PASS.
- #5 Coach-audit: N/A (usage email, not behavioral surface).

---

## §5. Email 5 — Upgrade offer (Free → Plus, honest non-dark-pattern)

**Trigger:** Free tier user has been active for 30+ days AND has hit Free monthly chat cap at least once OR has dismissed at least 3 «Upgrade for daily insights» in-product nudges.
**Goal:** Clean upgrade offer; honest value framing (Hormozi value-equation: dream outcome + perceived likelihood + time delay + effort/sacrifice); 14-day trial as low-friction entry.

| Field | Copy (EN) | Chars |
|---|---|---|
| Subject | Plus is open if you want to try | 32 |
| Preheader | Unlimited chat, daily insights, full pattern reads — 14 days free. | 65 |

**Body:**

> You've been with Provedo for {DAYS_SINCE_SIGNUP} days now. Provedo has read {INSIGHT_COUNT} weekly observations across your portfolio, answered {CHAT_COUNT} questions, and surfaced {PATTERN_COUNT} pattern matches in your past trades.
>
> If Provedo has earned its place in your week, Plus opens what's behind the Free cap:
>
> — **Unlimited chat.** Ask whenever, as often as the question lands.
> — **Daily insights.** What changed today, surfaced once a day instead of once a week.
> — **Full pattern reads.** The locked teasers in the Coach feed unlock — every behavioral pattern Provedo has noticed in your trades, with timeline.
> — **Dividend calendar + benchmark comparison + CSV export.**
>
> Plus is $8/month. The first 14 days are free; cancel any time, one click, no email back-and-forth.
>
> And Free stays Free. If Plus isn't for you, Provedo keeps reading at the Free cadence — multi-broker aggregation, weekly insights, 50 chat messages a month.

**Primary CTA:**

| Field | Copy (EN) | Chars |
|---|---|---|
| Button label | Try Plus 14 days free | 21 |
| Button URL | https://provedo.ai/app/upgrade?trial=plus | — |

**Secondary text-link:**

| Field | Copy (EN) |
|---|---|
| Link text | Stay on Free — Provedo's still reading. |
| Link URL | https://provedo.ai/app |

**Lane A audit:**
- All Plus features surfaced as **functional product descriptions**, not advice register («unlimited chat», «daily insights», «pattern reads with timeline»).
- No «Plus tells you what to buy», no «Plus gives you the strategy» — both would violate guardrail #1.
- «If Provedo has earned its place» = honest framing; user evaluates value, not pressure-decision.
- «Cancel any time, one click, no email back-and-forth» = explicit anti-dark-pattern; addresses subscription-cancellation friction concern surfaced in CRO research.

**EN guardrail audit:**
- #1 Banned co-occurrence: zero claiming. PASS.
- #3 Allowlist: read/answered/surfaced/notice. PASS.
- #4 «Guidance» splitter: no «provides guidance». «What changed today, surfaced once a day» — observation register. PASS.
- #5 Coach-audit: «every behavioral pattern Provedo has noticed in your trades, with timeline» — Coach surface mention. Frame is **functional unlock description** (the user buys access to *seeing* the patterns; Provedo doesn't *advise* on them). Audit PASS — Plus is gated access to observation, not gated access to advice.

---

## §6. Sequencing summary

| Email | Trigger | Cadence | Tier scope |
|---|---|---|---|
| 1 — Welcome | Account creation success | Once, ~immediately | All tiers |
| 2 — First-insight | First broker sync + first aggregation observation ready | Once, hours-to-days post-Email-1 | All tiers |
| 3 — Weekly check-in | 7-day cycle from signup | Recurring weekly | Free (Plus = daily-digest variant, not in this v1) |
| 4 — Limit-approaching | 40/50 messages used in calendar month | Once per month-cycle if triggered | Free only |
| 5 — Upgrade offer | 30+ days active AND limit-hit-at-least-once OR 3+ in-product upgrade-nudge dismissals | Once, then 60-day cooldown if dismissed | Free only |

**Cadence honesty:** No daily nag stream, no «we noticed you haven't logged in» guilt-trip, no streak-shaming. The product is a calm-not-busy second brain; the email cadence reflects the same archetype.

---

## §7. EN guardrail consolidated audit

| Guardrail | Email 1 | Email 2 | Email 3 | Email 4 | Email 5 |
|---|---|---|---|---|---|
| #1 Banned co-occurrence | PASS (disclaim only) | PASS (disclaim only) | PASS | PASS | PASS |
| #2 AI system-prompt anchor | N/A (template, not AI runtime) | N/A | N/A | N/A | N/A |
| #3 Allowlist verbs only | PASS | PASS | PASS | PASS | PASS |
| #4 «Guidance» splitter | PASS (no «guidance») | PASS | PASS | PASS | PASS |
| #5 Coach-audit | N/A | PASS (constraint flagged on third-observation template) | PASS (concrete-fill scope flagged) | N/A | PASS (functional-unlock framing) |

**Audit result: CLEAN across all 5 templates. Zero violations.**

---

## §8. Open questions for PO (return to Navigator)

1. **Email 2 «first-insight» template scope.** Recommendation locks third-observation slot to insights category only (dividends/concentration/cash-drag/events) — NOT trade-behavior patterns. Behavioral patterns belong in weekly digest or upgrade offer where coach context is established. Confirm PO accepts this scope discipline.
2. **Email 3 weekly cadence default day.** v1 assumes Monday morning local time per `04_DESIGN_BRIEF.md` §16. PO confirm or alternative (Sunday evening for «week-ahead orientation» framing)?
3. **Email 4 «Free stays Free» phrasing.** v1 uses «Free stays Free» three times across the suite (Email 4 + Email 5 twice). Recommendation: keep — it's the trust commitment doing load-bearing work. Open to PO if «Free is always Free» (verbatim from Brand Foundation §2 manifesto) is preferred.
4. **Email 5 upgrade trigger conditions.** v1 OR-condition (limit-hit OR 3+ nudge dismissals). Alternative: AND-condition (limit-hit AND 30+ days). Recommendation: keep OR — captures both engaged-and-capping users and engaged-but-not-yet-capping users. PO call.
5. **Plus daily-digest variant of Email 3.** Not drafted in v1 (focus on Free tier). PO confirm Plus daily-digest gets separate v1.1 dispatch.

---

## §9. Files in suite

This file is one of three v1 deliverables landing 2026-04-25 alongside `landing-provedo-v1.md` v2 and `microcopy-provedo-v1.md` + `paywall-provedo-v1.md`. See landing v2 §12 for full suite manifest.

**END email-sequences-provedo-v1.md (v1)**
