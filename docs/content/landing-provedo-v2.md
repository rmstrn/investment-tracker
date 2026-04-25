# Landing Copy — Provedo v2 (post-competitor-audit iteration, 2026-04-26)

**Author:** content-lead
**Date:** 2026-04-26
**Status:** v2 DRAFT — derived from 5 copy patterns surfaced by `docs/reviews/2026-04-26-strong-competitor-landing-audit.md`. Awaits PO review.
**Supersedes:** `landing-provedo-v1.md` (the v2 EN-first lock from 2026-04-25). PO directive 2026-04-26: «с текстом я бы поигрался» — this iteration responds to that.
**Language scope:** EN only (per PO directive 2026-04-25 «забудь про русский пока, делаем english версию»). RU wave-2 deferred.
**Anti-pattern hard-block:** Range advisor-paternalism register («thought partner» / «modern financial advice» / «built just for you») — banned. Visual richness OK; copy register HARD NO.

**v2 deltas from v1:**
1. **NEW — Section S3 (problem-negation positioning).** Three-line negation lifted from Range pattern, retuned to Lane A. Promotes Lane A guardrail from compliance footer to positioning copy.
2. **NEW — Section S2 (numeric proof bar).** Pre-alpha-honest five-cell strip between hero and demo tabs. No fake user counts.
3. **NEW — Section S7 (alpha-tester testimonials).** Honest pre-alpha framing. Recommendation: option B (builder quotes from internal team with «builder» badge) — preferred over placeholder cards or skip.
4. **NEW — Section S10 (FAQ).** Six anticipated questions, Lane A clean answers.
5. **CHANGE — Section S6 (mid-page editorial).** Iterated 5 candidates for the brand-world line. Recommended: candidate #2 («You hold the assets. Provedo holds the context.») over v1 «Provedo sees what you hold and notices what you'd miss.» — tighter, sets up section S2 hero contrast better. Three runner-ups preserved for future A/B.
6. **CHANGE — Hero CTA stack.** v1 triple-stack (Ask Provedo + Try Plus 14 days + Or start free forever) collapses to dual-stack: primary «Ask Provedo» + free secondary «Or start free forever». Trial moves into FAQ + paywall surface. Audit findings: 6/8 strong-tier landings use dual-CTA only.
7. **CHANGE — Section heads (capability-statement rewrites per audit C1).** §S4 sub: «Four answers Provedo finds in your real positions. Every answer cites its source.» (was «Four things Provedo can do…»). §S9 head: «Open Provedo when you're ready.» (was «Ready when you are.»).

**Constraints respected:**
- Rule 1 (no spend) — markdown only
- Rule 2 (no external send) — repo only
- Lane A regulatory — every section audited
- 5-item EN guardrails — every line audited; zero violations (audit table §A)
- Anti-pattern Range advisor-paternalism — HARD NO confirmed
- Character budgets: hero ≤60, sub ≤120, CTA ≤24, microcopy ≤140

---

## §0. Voice snapshot (applied to every line below)

Locked from `02_POSITIONING.md` v3.1 + `04_BRAND.md` v1.0 + `BRAND_VOICE/VOICE_PROFILE.md` post-Provedo-lock:

- **Archetype:** Magician + Sage primary · Everyman modifier.
- **EN verb-allowlist for Provedo (agent-subject):** provides clarity · provides context · provides observation · provides foresight · reads · surfaces · shows · notices · holds · cites · answers · sees · explains · leads through (restrained) · finds.
- **EN verbs Provedo NEVER uses (BANNED):** recommends · advises · suggests · should · must · consider · provides advice / recommendations / strategy / suggestions / guidance-on-action.
- **User-facing imperatives (Everyman voice):** Ask · Connect · Try · See · Open · Start.
- **Provedo as named agent.** «Provedo notices» / «Provedo holds» — never «we recommend» / «we flagged».
- **Anti-Range register banned.** No «thought partner / modern financial advice / built just for you» phrasing.

---

## §S1. Hero (LOCKED 2026-04-25; CTA stack collapsed v2)

PO locked single phrase 2026-04-25. CTA stack updated v2 per audit recommendation.

| Role | Copy (EN) | Chars |
|---|---|---|
| **Headline** | Provedo will lead you through your portfolio. | 45 |
| **Sub-hero** | Notice what you'd miss across all your brokers. | 47 |
| **Primary CTA** | Ask Provedo | 11 |
| **Secondary CTA (text-link)** | Or start free forever | 21 |
| **Free small-print** | No card. 50 chat messages a month, free always. | 48 |
| **Trial pointer (footnote-style)** | Plus tier? See pricing → | 22 |

**v2 CTA dual-stack rationale.** v1 hero had three buttons + two small-print lines = six CTA-zone elements. Audit shows 6/8 strong-tier landings use dual-CTA only (Linear's 4-stack is the outlier; Range's 3-stack reads cluttered alongside its dashboard mockup). Primary «Ask Provedo» + secondary text-link «Or start free forever» reads cleaner. Trial info moves to dedicated paywall + FAQ; users scrolling for pricing find it without hero-zone admin-form noise.

**Lane A audit:**
- «Will lead you through» — Sage-guide neighborhood, allowlist verb. NOT advise/recommend/guide-on-action.
- «Notice what you'd miss» — Sage observation, no normative imperative.
- «Ask Provedo» — user-imperative (Everyman); not Provedo issuing advice.
- **5-item EN guardrails:** zero co-occurrence of Provedo + advice/advise/recommendation/strategy/suggestion. PASS.

---

## §S2. Numeric proof bar (NEW — Vercel/Stripe pattern)

Single horizontal strip between hero and demo tabs. Five cells, mono-font numbers, slate-on-cool-bg. Honest pre-alpha framing — no fake user counts.

| Cell | Number | Label |
|---|---|---|
| 1 | **1000+** | brokers and exchanges |
| 2 | **50** | free chat messages a month |
| 3 | **4** | demo scenarios on real positions |
| 4 | **Lane A** | information, not advice |
| 5 | **$0** | free forever, no card |

**Visual spec:** product-designer owns. Recommended: JetBrains Mono numbers slate-900 + Inter labels uppercase tracked slate-500. Height 96-120px. Divider between cells.

**Honest framing.** No «10K+ users» / «$X processed» / «Y testimonials» — Provedo is pre-alpha, those numbers don't exist yet. The five cells we DO have are real and verifiable: broker coverage (tech-lead flag — verify before ship), free tier size, demo count, regulatory positioning, price.

**v1 → v2 delta on cell #4 phrasing.** «Lane A — information not advice» — taking the regulatory anchor from footer disclaimer and promoting it to proof-bar. Echoes problem-negation in §S3. Lane A becomes a *feature*, not just a compliance line.

**Tech-lead verification flag:** «1000+» must verify against current SnapTrade + Plaid + CCXT coverage before production. Fallbacks:
- A: «Hundreds of brokers and exchanges»
- B: «Every major broker»

**Lane A audit:**
- All five cells are factual claims — no advice register.
- «Lane A — information, not advice» — explicit Lane A surface, allowlist-clean.
- **5-item EN guardrails:** PASS. (One cell uses word «advice» but in disclaim context — «not advice» — same pattern as §S3 Tab 3 disclaim line, allowed.)

---

## §S3. Problem-negation positioning (NEW — Range pattern, Lane A retuned)

Net-new section between hero proof bar and demo tabs. Single full-bleed strip, three negation lines, affirmation closer. Type-led, no mockup.

**Section header (one line):**

| Role | Copy (EN) | Chars |
|---|---|---|
| Header | This is what Provedo is not. | 28 |

**Three-line negation:**

> Provedo is not a robo-advisor.
> Provedo is not a brokerage.
> Provedo will not tell you what to buy.

**Affirmation closer (one line):**

> What Provedo does: holds your portfolio across every broker, answers what you ask, surfaces what you'd miss. With sources for every observation.

**Visual spec:** product-designer owns. Recommended: generous vertical padding (120-160px), Inter 56-72px for negation lines, Inter 24-28px for affirmation closer. Slate-900 text on `#FAFAF7`. Provedo wordmark optional small above header.

**Why this section.** Range opens its landing with: «It's not a brokerage, it's not a spreadsheet, and it's not trying to be everything for everyone.» — drives positioning home for fintech audiences burned by advisor-paternalism. Provedo has the same audience pull (multi-broker millennials Notion/Obsidian-cohort). Lane A guardrails *are already* a negation — promoting them from compliance footer to positioning copy is the single highest-leverage copy move per audit.

**Anti-pattern check (HARD).** Range itself uses advisor-paternalism elsewhere on its page («thought partner / modern financial advice / built just for you»). Provedo borrows ONLY the structural three-things-it-is-not pattern, NOT Range's tone register. The affirmation closer uses Provedo's own allowlist verbs (holds / answers / surfaces / cites), not Range's «modern advice» register.

**Lane A audit:**
- «Not a robo-advisor / not a brokerage / will not tell you what to buy» — explicit disclaim, allowlist-compatible.
- «Holds / answers / surfaces / cites» — allowlist verbs.
- «Sources for every observation» — trust anchor.
- **5-item EN guardrails:** zero violations. The negation lines say «not a robo-advisor», «will not tell you what to buy» — these are Provedo *disclaiming* advisor verbs in same sentence, mirror-pattern of §S5 Tab 3 «no judgment, no advice». PASS.

---

## §S4. Demo tabs (KEEP §2 from v1; sub rewritten per audit C1)

Each tab shows mock user message + mock Provedo response. EN only.

**Section header (rewritten v2):**

| Role | Copy (EN) | Chars |
|---|---|---|
| Section S4 hero | Ask on your actual holdings. | 28 |
| Section S4 sub | Four answers Provedo finds in your real positions. Every answer cites its source. | 80 |

**v1 → v2 sub delta.** v1 sub was «Four things Provedo can do on what you really own. Notice what you'd miss.» Audit C1 critique: «can do» is descriptive-led; rewrite to capability-claim. v2 «Four answers Provedo finds in your real positions. Every answer cites its source.» — verb-led («finds»), present-tense, claim-first. Drops the third tagline echo (already deployed in hero sub + §S6 mid-page); replaces with proof-anchor («cites its source») which serves the Lane A trust register.

### Tab 1 — Performance-explanation («why am I down?»)

| Role | Copy (EN) |
|---|---|
| Tab label | Why? |
| User message | Why is my portfolio down this month? |
| Provedo response | You're down 4.2% this month. 62% of the drawdown is two positions: Apple (–11%, AAPL Q3 earnings) and Tesla (–8%, TSLA delivery miss). The rest of your portfolio is roughly flat. *[Inline P&L sparkline; sources cited inline.]* |

**Lane A audit:** Retrospective observation on real positions. Sources cited. No «sell AAPL», no «consider rebalancing», no «expected to recover». PASS.

### Tab 2 — Dividend-aware («when are dividends?»)

| Role | Copy (EN) |
|---|---|
| Tab label | Dividends |
| User message | When are dividends coming this quarter? |
| Provedo response | This quarter, $312 expected across your holdings. Largest: KO ex-div Sept 14 ($87), VZ ex-div Oct 7 ($74), MSFT ex-div Nov 19 ($61). Three smaller payments after that. *[3-month calendar grid, broker-confirmed dates linked.]* |

**Lane A audit:** Forward-looking ONLY on disclosed corporate-action data (ex-div dates are public broker-confirmed facts). PASS.

### Tab 3 — Pattern-recognition (Coach surface, retrospective) — HIGHEST RISK

| Role | Copy (EN) |
|---|---|
| Tab label | Patterns |
| User message | Anything unusual in my trades this year? |
| Provedo response | One pattern stands out. You sold Apple within 3 trading days of a >5% drop, three times last year. Each time, AAPL recovered above your sell price within 8 weeks. Provedo notices — no judgment, no advice. *[Trade timeline with sell points + 8-week-after marks.]* |

**Lane A audit (full per guardrail #5):**
- Retrospective only.
- Provedo named as agent of observation.
- Explicit «no judgment, no advice» disclaim baked in.
- **5-item EN guardrail:** zero «provides advice / recommendations / strategy». Provedo «notices» — allowlist. PASS.

### Tab 4 — Aggregation cross-broker (IBKR + Schwab)

| Role | Copy (EN) |
|---|---|
| Tab label | Aggregate |
| User message | How much tech am I holding across IBKR + Schwab? |
| Provedo response | Across both accounts, tech is 58% of your equity exposure. IBKR carries the bulk: AAPL ($14k), MSFT ($9k), NVDA ($8k). Schwab adds GOOG ($3k) and AMZN ($2k). For context, US retail median tech allocation is around 34%. *[Allocation pie + per-broker breakdown.]* |

**Lane A audit:** Cross-account aggregation. «Provides context» (allowlist). No «you should diversify», no «consider reducing». PASS.

---

## §S5. Insights / Pattern recognition (KEEP §3 from v1)

**Section header:**

| Role | Copy (EN) | Chars |
|---|---|---|
| Section S5 hero | A few minutes a week. Everything that moved. | 46 |
| Section S5 sub | Provedo surfaces dividends, drawdowns, concentration shifts, and events — once a week, in one feed, not scattered across **seven broker emails**. | 154 |

**v1 → v2 sub delta.** Audit C2: bold the «seven broker emails» as proof-anchor. Drops the third tagline echo (per audit recommendation: hold echo discipline at three deployments — hero sub already carries it, §S6 mid-page closes the loop, no need for fourth here).

### Three insight-type proof bullets

| # | Copy (EN) |
|---|---|
| 1 | Provedo holds context across every broker — knows what you own, what changed since last week, where the deltas matter. |
| 2 | Provedo surfaces what would slip past — incoming dividends, forming drawdowns, creeping concentration. |
| 3 | Provedo cites every observation. Every pattern shown ties back to a trade, an event, or a published source. |

**Lane A audit:**
- All bullets use allowlist verbs (holds / surfaces / cites).
- **5-item EN guardrail:** PASS.

---

## §S6. Editorial mid-page narrative (PROMOTE v1 §3 mid-page → full-bleed editorial block)

Per audit V4 visual spec: full-bleed dark surface, oversized typography, single dramatic break in light-toned page. Copy iterated below; brand-world closing line gets 3-5 candidates with recommendation.

**Section header:**

| Role | Copy (EN) | Chars |
|---|---|---|
| Header | One brain. One feed. One chat. | 30 |

**Narrative body (~85 words EN):**

> Your portfolio lives in seven places. Your dividends arrive in three inboxes. The reasons you bought NVDA in 2023 are in a group chat you can't find.
>
> Provedo holds it in one place. Reads what you own across every broker. Notices what would slip past — a dividend coming, a drawdown forming, a concentration creeping up. Shows you patterns in your past trades — what you did, when, what came next.
>
> Across chat, weekly insights, and pattern-reads on your trades. On your real positions. With sources for every answer.

### Closing brand-world line — 5 candidates

| # | Copy (EN) | Direction | Chars | Notes |
|---|---|---|---|---|
| 1 | Provedo sees what you hold and notices what you'd miss. | Direct (v1 lock) | 56 | v1 default. Restates JTBD-pair (aggregation + insights) in one sentence. Embeds tagline as proof anchor without quoting it standalone. Safe choice. |
| 2 | **You hold the assets. Provedo holds the context.** ⭐ **(RECOMMENDED)** | Hook + payoff | 51 | Two-clause antithesis structure (audit C4 pattern: «outcome-resolved problem-negation»). Sets up the user/Provedo division of labor cleanly. Sage-register, no advice gradient. Most quotable. |
| 3 | Provedo notices the patterns you're too close to see. | Sage observation | 53 | Names the *why* of pattern-detection (proximity bias). Most «Sage gravitas» of the five. Slight risk: «too close to see» can read patronizing if visual isn't gentle. |
| 4 | Across seven brokers and one chat. | Editorial-fragment | 36 | Picks up «seven» motif from narrative body; fragment cadence (Stripe «Book of the week» register). Tight, but loses the «notices what you'd miss» payoff. |
| 5 | The portfolio you have. The patterns you don't see. | Two-clause Sage | 51 | Echoes v1 candidate #4 structure («Sees what you hold. Notices what you'd miss.») with cleaner negative-clause framing. Strong rhythm but slightly more cerebral than #2. |

**Recommendation:** **Candidate #2 «You hold the assets. Provedo holds the context.»**

**Rationale:** (a) Two-clause antithesis is the strongest single-line copy device in the strong-tier audit (Stripe + Linear use it for hero subs; Range uses it in section closers). (b) Names the user/Provedo *division of labor* explicitly — this is the brand-promise reduced to one sentence: user owns assets and decisions, Provedo owns observation/context/foresight. (c) «Holds the context» is the single most allowlist-clean Provedo verb in the EN guardrails (`provides clarity / context / observation / foresight`). (d) Most quotable line on the page — testimonial-bait for builder/alpha-tester quotes once available. (e) Sage-register with zero advisor-drift gradient: «holds the context» cannot decode as «recommends actions» under any reading.

**Bilingual note (RU wave-2 deferred):** when RU lands, candidate #2 EN companion is RU «Активы — у тебя. Контекст — у Provedo.» — direct parallel structure preserves the antithesis. Candidate #1 EN companion would be the bilingual wordplay «Provedo проведёт через всё это» (RU-only). Wave-2 owners pick.

**Lane A audit (recommendation):**
- «You hold the assets» — user as agent of holding.
- «Provedo holds the context» — Provedo as agent of context-holding (allowlist verb «holds context»).
- Zero advice/recommendation/strategy/suggestion register.
- **5-item EN guardrails:** PASS.

---

## §S7. Pre-alpha alpha-tester testimonials (NEW — honest framing)

3-card horizontal row between §S6 editorial and §S8 marquee. Per audit V5 visual spec: white cards on `#FAFAF7`, no headshots, mono ticker icon top-right.

**Honest framing problem.** Provedo is pre-alpha. No real user testimonials exist. Audit recommended placeholder option. Three approaches considered:

| Option | Description | Honest? | Brand impact | Audit fit |
|---|---|---|---|---|
| A | Placeholder cards with «coming soon» / «alpha quotes pending» framing | Yes (transparent) | Reads thin / WIP, signals «we're not ready yet» | Weakest |
| B | **Pre-alpha builder quotes** — internal team voices with «builder» badge instead of user role | Yes (clearly labeled) | Reads «real product, real builders» — signal authenticity over fake-numbers | **RECOMMENDED** |
| C | Skip section until alpha-tester quotes exist | Yes | Page reads «пустовато» — defeats audit fix | Audit-counter |

**Recommendation: Option B — builder quotes.**

**Card structure (per audit V5):**

> «\[1 sentence about the product moment that earned the line\]. \[1 sentence about the cite-trail or context\].»
> — \[First name + last initial\], **builder** at Provedo · \[primary surface or area\]

**Three builder cards (drafts — PO + builders confirm before ship):**

### Card 1 — chat surface

> «I asked Provedo why my portfolio was down. It told me which two positions did 62% of the work, with sources. Two minutes, no spreadsheet.»
> — Roman M., **builder** at Provedo · chat surface

### Card 2 — insights feed

> «I check the weekly feed for five minutes Sunday morning. Everything that moved is in one place. That's the whole product for me.»
> — Roman M., **builder** at Provedo · weekly insights

### Card 3 — pattern detection

> «Provedo noticed I'd been selling Apple within days of every dip last year. It just showed me the pattern. No judgment, no advice.»
> — Roman M., **builder** at Provedo · pattern recognition

**Honest disclaimer (microcopy below cards):**

> *Provedo is in pre-alpha. Quotes are from the team building the product. Real alpha-tester quotes replace these once alpha ships.*

**Why builders not fake users.** Per Rule 2 (no external comms in PO's name) + Rule 1 spirit (honest representation) — fake testimonials with stock-photo personas would (a) violate the spirit of the constraints, (b) erode trust if discovered, (c) waste post-alpha quote-replacement work. Builder quotes are a single team member (PO) speaking honestly about the product they're building. Once alpha ships, real quotes swap in.

**Lane A audit:**
- All three quotes use allowlist verbs (told / asked / showed / noticed / moved).
- Card 3 explicitly «no judgment, no advice» — disclaim register.
- Builder badge eliminates any «testimonial = social proof of returns» implication.
- **5-item EN guardrails:** PASS.

---

## §S8. Aggregation marquee (KEEP §4 from v1)

**Section header:**

| Role | Copy (EN) | Chars |
|---|---|---|
| Section S8 hero | One chat holds everything. | 26 |
| Section S8 sub | 1000+ brokers and exchanges, in one place — Provedo reads them all. | 67 |

**Marquee components:** broker/exchange logos scrolling right-to-left (Fidelity · Schwab · Interactive Brokers · Robinhood · E*TRADE · Trading212 · Hargreaves Lansdown · Questrade · Wealthsimple · Coinbase · Binance · Kraken · etc.). Per audit V3+V4 spec — confirm animated scroll, monochrome slate-700.

**Tech-lead verification flag:** «1000+» — verify against SnapTrade + Plaid + CCXT coverage before production. Fallbacks: «Hundreds of brokers and exchanges» / «Every major broker. Every major exchange.»

---

## §S9. Pre-footer CTA (REDESIGN §5 from v1 → editorial CTA panel)

Per audit recommendation: full-bleed editorial CTA panel matching §S6 dark-surface visual rhyme. Single primary button, no triple-stack.

| Role | Copy (EN) | Chars |
|---|---|---|
| Block header | Open Provedo when you're ready. | 31 |
| Primary CTA | Ask Provedo | 11 |
| Small-print | No card. 50 free messages a month, free always. Or see Plus pricing → | 71 |

**v1 → v2 head delta.** v1 «Ready when you are.» was conversational but matches Range conversational-closer register. Audit C1 rewrite to imperative-Provedo register: «Open Provedo when you're ready.» — verb-led («open»), present-tense, matches §S1 hero «Ask Provedo» imperative-to-product pattern.

**Visual spec:** product-designer owns. Recommended: same dark surface as §S6 (visual rhyme), single button, generous vertical padding.

**Lane A audit:**
- «Open Provedo» — user-imperative.
- «Free always» — pricing fact.
- **5-item EN guardrails:** PASS.

---

## §S10. FAQ (NEW — strong-tier optional, audit recommended)

Six anticipated questions. Each answer ≤2 sentences. All 5-item EN guardrails clean.

| # | Question | Answer |
|---|---|---|
| 1 | **Does Provedo give investment advice?** | No. Provedo provides clarity, observation, context, and foresight — never advice, recommendations, or strategy. Lane A: information, not advice. |
| 2 | **How is Provedo different from a robo-advisor?** | A robo-advisor moves money for you. Provedo holds your portfolio across every broker, answers your questions, and surfaces what you'd miss — but every decision stays yours. |
| 3 | **Which brokers are supported?** | 1000+ brokers and exchanges via SnapTrade, Plaid, and CCXT — Fidelity, Schwab, IBKR, Robinhood, E*TRADE, Trading212, Coinbase, Binance, Kraken, and most major venues globally. *(Tech-lead verification — confirm before ship.)* |
| 4 | **What does Provedo cost?** | Free is always free — 50 chat messages a month, full broker aggregation, weekly insights, no card required. Plus tier ($X/month) unlocks unlimited chat and daily insights. |
| 5 | **Is my data secure?** | Provedo reads your broker data through read-only API connections — no trading credentials, no money movement. Provedo cannot place trades on your account, by design. |
| 6 | **What does «pre-alpha» mean?** | Provedo is in active build. Free-forever tier is locked; the product is real and runs on your real holdings. Some surfaces are still being polished, and you're early. |

**Audit notes:**
- Q1 directly takes the §S3 problem-negation premise and answers the user's most-likely-asked first question. Lane A surface twice in the answer.
- Q2 ties back to §S3 negation lines (robo-advisor / brokerage / will not tell you what to buy).
- Q3 includes tech-lead verification flag.
- Q4 carries the «Free is always Free» brand-commitment from `04_BRAND.md` §2 manifesto.
- Q5 is the security framing audit recommended; phrased as capability-statement (verb-led, present-tense).
- Q6 «pre-alpha» honest framing — completes the trust loop with §S7 builder testimonials.

**Lane A audit per question:**

| Q | No imperative? | No performance promise? | Allowlist verbs only? | EN guardrails? |
|---|---|---|---|---|
| Q1 | YES | YES | YES (provides clarity/observation/context/foresight) | PASS |
| Q2 | YES | YES | YES (holds/answers/surfaces) | PASS |
| Q3 | YES | YES | (n/a — factual list) | PASS |
| Q4 | YES | YES | (n/a — pricing) | PASS |
| Q5 | YES | YES | YES (reads — allowlist) | PASS |
| Q6 | YES | YES | (n/a — disclaim) | PASS |

**5-item EN guardrails (full FAQ):** Q1 mentions «advice / recommendations / strategy» — all in *disclaim* register («never advice, recommendations, or strategy») — same pattern as §S5 Tab 3 «no judgment, no advice» and §S2 cell #4 «information, not advice». This is *Provedo disclaiming the advisor verbs*, not Provedo claiming them. PASS.

---

## §S11. Footer disclaimer (LOCKED, formal — Provedo-substituted)

> Provedo is not a registered investment advisor. Information is provided for educational purposes only. Past performance is not indicative of future results. All investment decisions are your own.

**Substitution audit:** verbatim from `02_POSITIONING.md` §Footer disclaimer. No changes.

**5-item EN guardrail check:** «Information is provided» — passive voice, no Provedo as subject of «provide». Acceptable per `BRAND_VOICE/VOICE_PROFILE.md` §3 Item 2 splitter discipline. PASS.

---

## §S12. SEO meta + OG tags (KEEP from v1)

| Field | Copy (EN) | Chars |
|---|---|---|
| Title | Provedo · Notice what you'd miss across all your brokers | 56 |
| Description | Provedo holds your portfolio across every broker — answers your questions, surfaces what would slip past, shows you patterns in your past trades. With sources. | 156 |
| og:title | Provedo · Notice what you'd miss across all your brokers | 56 |
| og:description | Provedo will lead you through your portfolio — across every broker, with sources. Free forever, no card. | 102 |

**Audit:** allowlist verbs (holds/answers/surfaces/shows/will lead). Zero «provides advice/recommendations/strategy». PASS.

**v1 → v2 og:description delta.** v1 closed «Free forever, or try Plus 14 days.» Replaced with «Free forever, no card.» — collapses trial mention (matches §S1 dual-stack CTA collapse). Trial info lives in FAQ + paywall now.

---

## §S13. AI EN system-prompt anchor (mandatory, verbatim — KEEP from v1)

Every EN AI-persona prompt that speaks as Provedo MUST include this clause verbatim:

> «You are Provedo. The name comes from Italian *provedere* «to provide for, to foresee» + Russian «проведу» «I will lead through». You provide *clarity, observation, foresight, context* — never *advice, recommendations, strategy, or guidance-on-action*. Frame all outputs as observation, not prescription. When the user asks "what should I do?", surface what they have and what's changed; never tell them what to do.»

---

## §A. 5-item EN guardrails audit summary (full document, post-iteration)

Full v2 document scanned for the 5-item EN copy guardrails:

| # | Guardrail | v2 audit result |
|---|---|---|
| 1 | Banned co-occurrence: Provedo + advice/advise/recommendation/strategy/suggestion | **ZERO occurrences** as Provedo-as-subject claim. Three appearances, all in *disclaim* register: §S2 cell #4 «information, not advice»; §S3 affirmation «Will not tell you what to buy»; §S5 Tab 3 «no judgment, no advice»; §S10 Q1 «never advice, recommendations, or strategy». All four are explicit disclaim, not claim. PASS. |
| 2 | AI EN system-prompt anchor present verbatim | §S13. PASS. |
| 3 | EN verb-allowlist (provides clarity / context / observation / foresight; reads / surfaces / shows / notices / holds / cites / answers / finds) | Used throughout. New v2 verb «finds» (§S4 sub) added — sits in same observation-coded register as «surfaces / shows / notices». BANNED forms — zero. PASS. |
| 4 | «Guidance» splitter: prefer «provides clarity» over «provides guidance» | «Guidance» does not appear in v2. PASS. |
| 5 | Behavioral-coach EN copy especially audit | §S4 Tab 3 audited line-by-line (KEEP from v1, audited there). §S7 Card 3 also Coach-adjacent (pattern recognition) — audited: «noticed / showed / no judgment, no advice». PASS. |

**v2 EN guardrail audit: CLEAN. Zero violations across 11 sections + FAQ.**

---

## §B. Lane A consolidated checklist (v2 full document)

| Section | No «buy/sell» imperative? | No performance promise? | No advisor-paternalism? | Provedo named as agent? | Allowlist verbs only? |
|---|---|---|---|---|---|
| §S1 Hero | ✅ | ✅ | ✅ | ✅ (will lead) | ✅ |
| §S2 Proof bar | ✅ | ✅ | ✅ | n/a (factual) | ✅ |
| §S3 Problem-negation | ✅ | ✅ | ✅ (explicit disclaim) | ✅ (holds/answers/surfaces/cites) | ✅ |
| §S4 Tab 1 (Why?) | ✅ | ✅ | ✅ | ✅ (implicit observation) | ✅ |
| §S4 Tab 2 (Dividends) | ✅ | ✅ (corp-action only) | ✅ | ✅ | ✅ |
| §S4 Tab 3 (Patterns) | ✅ | ✅ | ✅ (explicit disclaim) | ✅ (notices) | ✅ |
| §S4 Tab 4 (Aggregate) | ✅ | ✅ | ✅ | ✅ (provides context) | ✅ |
| §S5 Insights | ✅ | ✅ | ✅ | ✅ (holds/surfaces/cites) | ✅ |
| §S6 Mid-page editorial | ✅ | ✅ | ✅ | ✅ (holds context) | ✅ |
| §S7 Builder testimonials | ✅ | ✅ | ✅ (Card 3 explicit disclaim) | ✅ (told/showed/noticed) | ✅ |
| §S8 Aggregation | ✅ | ✅ | ✅ | ✅ (reads them all) | ✅ |
| §S9 Pre-footer CTA | ✅ | ✅ | ✅ | n/a (user-imperative) | ✅ |
| §S10 FAQ | ✅ | ✅ | ✅ (Q1 explicit disclaim) | ✅ (provides clarity/holds/answers/surfaces/reads) | ✅ |
| §S11 Footer | n/a | n/a | n/a | n/a (regulatory) | LOCKED |
| §S12 Meta/OG | ✅ | ✅ | ✅ | ✅ (holds/will lead) | ✅ |

**Lane A: PASS across all sections.**

**Range advisor-paternalism anti-pattern check.** v2 scanned for: «thought partner» / «modern financial advice» / «built just for you» / «advisory team» / «fiduciary» (in product-claim context) — **zero occurrences.** PASS hard-block.

---

## §C. Open questions for PO (return to Navigator)

1. **Mid-page brand-world line — pick from 5 candidates (§S6).** Recommendation: candidate #2 «You hold the assets. Provedo holds the context.» Alternative top-runners: #3 «Provedo notices the patterns you're too close to see» (more Sage), #1 «Provedo sees what you hold and notices what you'd miss» (v1 default). PO call.
2. **CTA dual-stack pick (§S1).** v2 default: primary «Ask Provedo» + secondary text-link «Or start free forever»; trial info in FAQ + paywall. Alternative: primary «Ask Provedo» + secondary «Try Plus free for 14 days» (de-emphasize free). Recommendation: ship default — trial CTA in hero risks paywall-pressure register, and free-tier brand-commitment («Free is always Free») is the larger asset. PO call.
3. **Builder testimonials (§S7) — option B confirmed?** Recommendation: option B (builder quotes from PO with «builder» badge). Alternative: option C (skip section). Option A (placeholder «coming soon» cards) not recommended. Need PO confirmation that quote attribution to «Roman M., builder at Provedo» is acceptable.
4. **Numeric proof bar cell #1 «1000+» (§S2).** Tech-lead verification flag — confirm before ship. Fallback copy provided.
5. **FAQ Q4 Plus tier price (§S10).** Currently «$X/month» placeholder. Need PO confirmation of Plus pricing for landing copy lock.
6. **§S6 mid-page editorial — full-bleed dark surface, but page is otherwise light?** Visual decision — product-designer owns. Audit recommendation: yes, single dramatic break = drama. Confirm with product-designer before integration.

---

## §D. Files updated this dispatch

**Updated:**
- `docs/content/landing-provedo-v2.md` — this file (NEW v2 iteration post-competitor-audit).

**Preserved as historical record:**
- `docs/content/landing-provedo-v1.md` — v1 EN-first lock (PO 2026-04-25). Still source-of-truth until v2 PO-locked.
- `docs/content/landing.md` — Memoro-era. NOT edited.
- `docs/content/email-sequences-provedo-v1.md`, `microcopy-provedo-v1.md`, `paywall-provedo-v1.md` — Memoro/Provedo earlier; NOT edited this dispatch.

**No external communication sent. No emails dispatched. No social posts published. All artefacts live in repo only.**

---

## §E. Status & next steps

**Status:** v2 DRAFT — awaits PO review on §C open questions. Ready for Navigator → PO routing.

**Recommended next steps (PO + Navigator):**
1. PO reviews §C open questions; decides on mid-page brand-world line, CTA stack, builder testimonial format.
2. Navigator dispatches product-designer for §S2 proof bar visual + §S3 problem-negation typography + §S6 full-bleed editorial visual + §S7 testimonial card visual + §S9 pre-footer panel visual.
3. Tech-lead verifies «1000+ brokers and exchanges» claim (§S2 cell #1, §S8 sub, §S10 Q3).
4. PO confirms Plus tier pricing for §S10 Q4.
5. Navigator dispatches frontend-engineer for `locales/en.json` integration once §C resolved.
6. RU wave-2 dispatch when PO greenlights.

**END landing-provedo-v2.md**
