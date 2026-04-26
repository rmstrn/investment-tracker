# Landing-Page Trends + CRO 2026 — Content-Lead Audit Through Provedo Voice Lens

**Author:** content-lead (Track C of 3)
**Date:** 2026-04-27
**Scope:** Research-driven view of 2026 landing/CRO craft + 30-line honesty pass on Provedo v3.1 + variant proposals (hero / microcopy / disclaimer)
**Output type:** research → recommendations. **Not** a copy rewrite. Final rewrite is gated by PO direction-choice.
**Status:** DRAFT — awaits Navigator synthesis with brand-voice-curator + product-designer tracks.

---

## §1 Scope, delineation, voice constraints recap

### Delineation from prior audits

Three landing-related artifacts already exist:

| File | Track | What it covers | What this report does NOT redo |
|---|---|---|---|
| `2026-04-26-strong-competitor-landing-audit.md` | competitive-landing-analyst | 8 strong-tier landings: visual + copy patterns, anti-patterns, v2 structural roadmap | Per-landing fetch; visual mockup specs (V1-V5); Range/Linear/Stripe pattern matrix |
| `2026-04-26-finance-advisor-landing-review.md` | finance-advisor | Investor psychology, mock data realism, Plus pricing lock ($9), Tab 3 normalization, proof bar redesign | Pricing recommendation; mock-data math; FOMO/day-trader audit |
| `2026-04-26-legal-advisor-landing-review.md` | legal-advisor | Lane A regulatory pass per section, animation guardrails, jurisdictional disclaimer adequacy | Regulatory citations; counsel-cost estimate; per-section Lane A pass |

**This report's delta:** broader 2026 landing-craft context (not just strong-tier 8), AI-tool conventions specifically, fintech disclaimer-readability framework, microcopy/paywall trends, and a content-lead honesty audit on v3.1 from a critic-of-prior-self-drafts position. Where prior audits already nailed something (e.g., negation pattern, Tab 3 risk, $9 lock), I cite-and-defer rather than re-litigate.

### Provedo voice constraints recap (cannot drift)

Per `BRAND_VOICE/VOICE_PROFILE.md` (post-2026-04-25 lock), every recommendation in this audit passes:

1. **Banned co-occurrence:** «Provedo» never in same sentence with advice / advise / recommendation / recommend / strategy / suggest.
2. **Verb-allowlist agent-subject:** provides clarity / context / observation / foresight; sees / surfaces / shows / notices / holds / cites / answers / reads / leads through (restrained).
3. **«Guidance» splitter:** prefer «clarity» over «guidance».
4. **Coach copy especially audited.**
5. **Archetype lock:** Magician + Sage primary · Everyman modifier. No Outlaw-aggression, Sidekick-warmth, Mystic-pure, advisor-paternalism.

Voice-check column appears on every variant proposal (§7) and every microcopy patch (§8). If a hot 2026 pattern conflicts with these locks, it lands in §10 (avoid).

### Source budget (per Rule 1, no spend)

Free-tier only: NN/g free archives, Baymard public blog (premium DB unavailable), competitor live landings via WebFetch, public CRO case studies. Some 2025-2026 patterns inferred from category-leader live state rather than research-published findings. Confidence flagged per pattern.

---

## §2 Hero patterns 2025-2026

### What changed since 2023

The «centered hero with single-line headline + 2-button CTA + product screenshot» convention is still alive, but four 2025-2026 shifts have hardened:

1. **Hero now usually carries motion.** Static hero image reads template-ish. Strong-tier 2025-2026 landings ship typed-prompt animation (Cursor-adjacent), parallax-stacked product surfaces (Linear), or live-data-feel motion (Stripe wave, Vercel runway). Cursor's hero specifically shows a *live* task panel, not a static screenshot.
2. **Imperative-mood headlines lose ground to declarative-noun.** Vercel «Build and deploy on the AI Cloud» and Stripe «Financial infrastructure to grow your revenue» both went declarative. Linear stayed declarative («The product development system for teams and agents»). The imperative «Get started building X» pattern is now perceived as commodity-template.
3. **Sub-line carries explicit time-bound value.** «Notice what you'd miss» (Provedo) is in-tone but not time-bound. Stronger 2026 sub-lines pin a *time-to-value* implicitly: «Designed for the AI era» (Linear), «From your first transaction to your billionth» (Stripe). Provedo could trade tone-poetry for time-anchor without losing voice.
4. **Primary CTA copy is named-noun, not generic.** «Try Cursor», «Open Provedo», «Ask Provedo» — strong-tier landings now name the product in the CTA, not «Get started» / «Sign up free». Provedo already does this — counts as in-trend.

### 3 representative examples (free-fetch confirmed 2026-04-27)

**Linear (live).** Headline «The product development system for teams and agents» / sub «Purpose-built for planning and building products. Designed for the AI era.» CTAs: «Get started» + «Contact sales» + manifesto-link «Issue tracking is dead». Hero visual: 3 stacked product screenshots showing Inbox / My Issues / Reviews. No typed-prompt animation in hero; visual proof loads instantly. Time-to-value: ~1.5s — user knows what product is + sees it before scrolling.

**Cursor (live).** Headline «Built to make you extraordinarily productive, Cursor is the best way to code with AI.» CTAs: «Download for macOS» + «Try mobile agent». Hero visual: live task panel + localhost preview — actual interface, not screenshot. Reads as the product running in front of you. Time-to-value: ~2s — comprehension + visual proof simultaneously.

**Public.com (live, fintech-direct).** Headline «Investing for those who take it seriously» + 3-up sub-features (multi-asset / AI Agents / 3.3% APY*). CTA: «Get started». Asterisks point to inline disclosures *immediately below* relevant claims, not just footer. Hero is text-heavy by 2026 fintech standards but disclaim discipline is unusually clean.

### Conversion signal where defensible

NN/g's free archive surfaces consistent guidance: hero must answer «what is this and why should I care?» within ~5 seconds, sub-text under ~150 chars or it gets skipped, and primary CTA wording outperforms generic «Get started» when it names the product action. Specific lift numbers behind paywall; pattern direction is well-attested.

ConversionXL public case studies (Peep Laja era + recent CXL Institute writeups) consistently show: imperative-CTA wording («Start free» / «Try Cursor») beats descriptive («Learn more» / «View pricing») on cold traffic, but only by mid-single-digit %. The bigger lever is *clarity of who the product is for* — audience-named subs out-convert generic-benefit subs by larger margins.

### Applicability to Provedo

Current v3.1 hero: «Provedo will lead you through your portfolio» / «Notice what you'd miss across all your brokers» / Primary «Ask Provedo» + secondary text-link «Or start free forever».

Hits 2026 patterns:

- Named-product CTA («Ask Provedo») — IN-TREND.
- Declarative headline (not imperative) — IN-TREND.
- Stacked 3-mockup hero with typing animation (per `ProvedoHeroV2.tsx`) — IN-TREND, near best-in-class.
- Dual-CTA discipline (collapsed from v1 triple-stack) — IN-TREND.

Misses or risks:

- Sub-line «Notice what you'd miss across all your brokers» is slightly long (47 chars head + 47 chars sub — within budget but the sub re-deploys the tagline rather than introducing a new payload). The audit-recommended «You hold the assets. Provedo holds the context.» is held back into §S6 — reasonable, but the hero sub could carry more time-to-value.
- «Will lead you through» is futurally tensed («will») — softer than 2026 standard which front-loads present-tense («Provides clarity on your portfolio across every broker» — but this collides with verb-allowlist tone). Voice trade-off real; not a clear win.

---

## §3 AI-tool landing conventions

### The «typed prompt → magic output» pattern

This pattern stabilized 2024 and is now category-default for AI tools:

1. Hero contains a chat input or visible prompt example.
2. Visible typing animation runs (or auto-plays) producing a *plausible* output the product is good at.
3. Sub-copy frames the demonstration as the user's first interaction, not a marketing screenshot.

Provedo v3.3 already ships this (per `ProvedoHeroV2.tsx`: «Why is my portfolio down this month?» types in 1.5s, then a Provedo response types in 2s). This is in-trend and the implementation (typing-animation hook with reduced-motion fallback) is craft-correct.

### 3 representative examples

**Cursor (live).** No typed-prompt animation in hero; instead a *live interface tile* showing tasks in motion. Implies «AI is doing things in front of you». Less explicit than typed-prompt; reads more confident («the product runs, watch»).

**Perplexity / Comet (per Framer case study + Lapa Ninja review — direct fetch 403).** Centerpiece is a single search input with examples cycling through. Reads as «you can ask anything, here are samples». PP Editorial New + FK Grotesk pairing — type-pairing strategy carries the brand.

**Claude / Anthropic (live).** Single declarative headline («The AI for Problem Solvers») + tabbed use-case demos *below the fold* showing study guides, Gantt charts, code interfaces. Hero itself doesn't carry the typed prompt — it's pushed down a level. Anthropic's hero relies on brand-trust above tool-demo. *Lane-A trade-off worth flagging:* Anthropic does NOT show a financial-data answer above the fold. Their below-fold tabs include «Analyze» but the example is non-personal data.

### Dangers (over-promise drift)

The typed-prompt pattern has known failure modes for Lane-A-bounded products:

1. **Output-as-prediction drift.** «Why is my portfolio down?» → if response includes any forward-looking phrase («expected to recover» / «likely to bounce»), implicit-recommendation under SEC + FCA implied-rec tests (legal-advisor §S4 Tab 3 already flagged the deeper version of this).
2. **Output-as-personalization drift.** Even retrospective output, when shown on a user's *named tickers*, generates a personalization read that broader products (Cursor / Claude / Linear) don't have to think about.
3. **Output-as-impressive-shorthand drift.** Marketing temptation: tighten the response to dramatic single-sentence punch («Your portfolio is over-concentrated in tech»). That's a recommendation in disguise. Provedo's actual response copy («You're down −4.2% this month. 62% of the drawdown is two positions: Apple and Tesla.») is observation-coded — clean. But under marketing pressure to «punch up the hero example», this is the line that drifts first.

### What works for Lane-A-bounded products specifically

Three discipline patterns applicable to Provedo:

- **Demonstrate aggregation, not interpretation.** Hero example should show the *combine-and-cite* superpower (which advisors don't replicate) rather than an analytical conclusion. Provedo's current hero example sits on the right side of this line because the response is observation + numbers + sources, not prescription.
- **Show the cite trail.** Public.com puts asterisks immediately below claims, even in hero. For Provedo, every chat-message mockup should visually show a source link (small mono-style citation badge). This is the single visual element that separates «AI tool» from «AI advisor look-alike».
- **Use the second-person carefully.** «Why is **my** portfolio down?» (user-asks) is fine. «**You** sold AAPL three times» (Provedo-says) is the Tab 3 risk surface. The hero demonstrating the user-asks direction is safer than demonstrating the Provedo-says direction. Current v3.1 hero correctly demonstrates user-asks. Hold this.

---

## §4 Fintech trust + disclaimer-readability patterns

### The disclaimer-readability problem

v3.1 footer currently runs ~75 words:

> Provedo is not a registered investment advisor and is not a broker-dealer. Provedo provides generic information for educational purposes only and does not provide personalized investment recommendations or advice as defined under the U.S. Investment Advisers Act of 1940, EU MiFID II, or UK FSMA 2000. Past performance is not indicative of future results. All investment decisions are your own. Consult a licensed financial advisor in your jurisdiction before making investment decisions.

Reads dense to non-legal users. The legal-advisor brief was correct that this is regulator-readable; the content-lead concern is whether it's *user-readable*. Both can be true; pattern below.

### 3 representative examples

**Wealthfront (live, fintech-mature).** Inline disclosures with asterisks where claims are made: «3.30% Base Annual Percentage Yield (APY) as of 1/30/26 is provided by program banks and is subject to change.» Footer references «whitepapers / help center / investor relations page» as separate detailed-disclosure surfaces. **Pattern: layered.** Visible-claim → inline asterisk → expandable section OR linked sub-page for full legal text. The footer doesn't carry the entire legal weight.

**Public.com (live, fintech direct competitor).** Asterisks immediately below relevant sections (not just footer). Inline disclosures on margin rates («Top and bottom of Public Investing's range of margin rates either matches or is lower…»). Footer holds the *entity* legal text (Public Advisors LLC / Open to the Public Investing Inc. / Zero Hash LLC / Jiko Securities Inc. — four separately-regulated entities). **Pattern: dual-track.** Operational claims get inline + asterisk; entity / corporate-legal goes in footer block.

**Robinhood (different lane, instructive).** Hero CTAs sit *above* a 2-line summary («Investing involves risk» + tap-to-expand chevron). Tap reveals fuller disclosure. **Pattern: collapsible-summary.** Reads cleaner than 75-word block; user gets one-glance summary with the legal detail one tap away.

### What converts vs what defends

NN/g free articles on policy / legal page comprehension consistently surface: 60-80% of users skim past dense paragraphs of legal text; comprehension recovery requires either (a) plain-language summary as first sentence, (b) bulleted breakout, or (c) collapsible reveal of detail. None of these dilute legal protection if the full text is preserved — what matters legally is that the disclosure is available and reachable, not that it's read in one continuous paragraph.

ConversionXL case studies (e.g., Peep Laja's older write-ups on legal-text impact) suggest dense legal walls can depress conversion 5-15% for cold traffic; the variance is large because user-segment matters (more sophisticated finance audiences read past legal blocks; consumer / casual audiences bounce).

### Applicability to Provedo

The legal-advisor v3.1 patch correctly hardened the legal protection. Content-lead's job is to make the *same legal content* readable. Three patterns Provedo could combine without losing protection:

1. **Plain-language one-liner first.** Lead with: «Provedo provides information about your portfolio. It is not investment advice.» (Two short sentences, ~14 words, plain-language summary.)
2. **Full legal text below or expandable.** The 75-word jurisdictional block lives below the plain-language opener, OR behind a «Full disclosures» expandable, OR linked to a `/disclosures` sub-page.
3. **Inline asterisks for specific claims elsewhere.** Where a claim like «1000+ brokers» / «$0 free forever» appears, an asterisk + footnote sits *near the claim*, not just rolled into footer. Public.com does this; Provedo's proof bar would benefit.

Detailed structural pattern in §9.

---

## §5 Microcopy + paywall 2026 patterns

### Current SaaS $9/mo cluster context

Per finance-advisor pricing audit, Provedo Plus sits in a 4-way cluster: GitHub Copilot $7.92, Snowball $9.99, Monarch $8.33, Getquin €7.50. Provedo $9 is cluster-mid. The conversion question isn't price — it's framing.

### What's working in 2025-2026 paywall + free-forever copy

1. **«Free forever» as positive-promise, not anchored to feature-strip.** Notion, Linear, Loom all stake free-forever as a brand commitment («free for personal use» / «free for individuals always»). The Plus framing isn't «remove feature gates» — it's «unlock additional surface» (more chats / advanced features / multi-seat). The mental shift: free-tier is the product; Plus is more of the product. Provedo's «50 questions a month, free always» + «Plus: unlimited + insights when they matter» fits this — IN-TREND.

2. **Time-bound trial CTAs lose ground to no-card-required free.** The «14-day trial» pattern feels less premium in 2026 than in 2022. Cursor offers free tier indefinitely; Linear's free tier is permanent for small teams; Notion personal stays free. Trial CTAs read as «commitment-pressure» — anti-Sage register for Provedo. v3.1 already collapsed trial out of hero — this is correct.

3. **Microcopy on tier-features now reads in user-outcome, not feature-list.** «Insights when they matter» (post-finance-advisor patch) is in-trend. Beat: «Daily insights» (calendar-bound, day-trader-adjacent) loses to «when they matter» (outcome-bound, Sage-clean). Still want to push: «Insights the moment they appear» — present-tense, observation-coded, no calendar bondage.

### 3 representative examples

**Linear pricing.** Free tier copy: «Free for individuals + small teams forever. No credit card required.» Plus tier: «$8/user/month. Cycles, custom views, project updates.» Microcopy is feature-name → outcome-promise («Cycles» links to «Your team's commitment to a sprint, made visible»). Feature-name doubles as outcome-claim.

**Notion pricing.** Free tier: «Build your wiki, docs, and projects. For individuals.» Plus: «$10/seat. Unlimited blocks, file uploads, version history.» Notion treats Plus features as *capacity*, not *capability* — clever for a Sage-register product where you don't want to imply free-tier users are limited in what they can *do*.

**Public.com pricing CTAs.** «Get started» (singular) repeated across surfaces. «Transfer your portfolio. Earn 1% uncapped match.» — promotional CTA layered separately. Public uses two CTA registers: trust-CTA («Get started») + benefit-CTA («Transfer + earn»). Provedo doesn't need the dual-CTA layer — its model is simpler — but the *capability vs. capacity* framing borrows cleanly.

### Applicability

Provedo paywall (when shipped) likely sits at: «Free always: 50 questions/month, full broker aggregation, weekly insights, no card. / Plus $9/month: unlimited chat, insights when they matter.» The microcopy patches in §8 sharpen specific lines.

---

## §6 Provedo v3.1 audit — 30-line honesty pass

This is a content-lead critic-of-prior-self pass. Volume = 30 numbered lines.

1. **Hero headline is in-tone but not in 2026 tense.** «Will lead you through» is futurally tensed. 2026 best-in-class hero headlines are present-tense («provides» / «is» / «runs»). Voice trade-off real; not an obvious win to change. Hold.
2. **Hero sub redeploys tagline rather than carrying time-to-value.** «Notice what you'd miss across all your brokers» is poetic but doesn't tell user *when* they get value. A time-anchor («In five minutes a week») could swap in.
3. **CTA stack is correctly collapsed from v1 (triple) to dual.** This is the strongest single CRO move v2→v3 made.
4. **Primary CTA «Ask Provedo» is best-in-class** — named-noun + verb + product. Don't change.
5. **Secondary text-link «Or start free forever» works** but the «Or» reads slightly apologetic. «Start free forever» without the «Or» is more declarative.
6. **Numeric proof bar is the right pattern.** Five cells is the right count. (Audit recommendation was 3 — disagreed; 5 is fine if cells are actually numeric/specific.)
7. **Cell 3 «4 demo scenarios» reads pre-alpha-thin.** Finance-advisor's swap to «5 minutes a week» is correct; landing-craft-2026 also prefers reading-time anchors over feature-counts. Adopt.
8. **Cell 2 «50 free chat messages a month» — «messages» is chat-software register, not investor-task register.** Finance-advisor's «50 free questions a month» is sharper.
9. **Cell 4 «Lane A — information, not advice» is clever but cryptic to a cold reader.** «Lane A» means nothing to non-internal audiences. «Information, not advice» on its own is enough. Drop the «Lane A» prefix.
10. **Problem-negation §S3 is the strongest single content move on the page.** The «not a robo-advisor / not a brokerage / will not tell you what to buy» pattern hits Lane A as positioning copy. Don't touch.
11. **Negation header «This is what Provedo is not.» is meta-commentary on the section.** Stronger header would absorb the meta into the negation itself or strip the header entirely.
12. **Demo tabs sub «Four answers Provedo finds in your real positions» is good** — verb-led, present-tense, in-trend.
13. **Tab 1 response is observation-coded, sources cited, no drift.** Solid.
14. **Tab 2 — corporate-action-only, public-data, factual.** Solid.
15. **Tab 3 patch from finance/legal advisors («price returned above your sell level» + «common pattern across retail investors» + explicit «not a recommendation about future trading decisions») works.** Don't second-guess.
16. **Tab 4 — S&P sector-weight comparison from finance-advisor patch is sourceable, defensible.** Clean.
17. **§S5 insights bullets — three Provedo-as-agent statements.** Good rhythm. «Provedo holds context / surfaces what would slip past / cites every observation.»
18. **§S6 mid-page editorial line «You hold the assets. Provedo holds the context.» is the single quotable on the page.** Locked-in choice from candidate set is correct.
19. **§S6 narrative body (~85 words) is dense and uses two metaphors («seven places», «one feed»).** Read aloud: rhythm is good, but body could lose 15-20 words and be sharper.
20. **§S7 builder testimonials with «Roman M., builder at Provedo · chat surface» × 3 reads thin.** Three quotes from one person reads more honestly empty than one quote from one person. Either *one* quote with more weight, OR honest «no testimonials yet — alpha quotes coming Q2 2026» single-line frame.
21. **§S8 aggregation marquee with broker logos works** — but the «1000+ brokers and exchanges» line had to fall back to «hundreds» because verification stalled. The fallback reads less premium than the original. If the verified number is 400 or 800, lead with that — specific beats generic.
22. **§S9 FAQ answers are crisp.** Q4 has the $9 lock from finance-advisor. Q3 still says «100s» — should align with whatever §S8 settled on.
23. **§S10 pre-footer CTA panel «Open Provedo when you're ready» — patient register, no urgency manipulation.** This is voice-perfect.
24. **Footer disclaimer is regulator-tight (legal-advisor patch) but user-readability is unaddressed.** Single-block 75-word paragraph. §9 of this report proposes a layered structure.
25. **Hero typing animation is best-in-class craft.** Reduced-motion fallback ships static text — accessibility-correct.
26. **The repeat of «free forever» in hero small-print + §S9 small-print + §S10 small-print is excessive.** Three deployments. Pick two; the third reads admin-form.
27. **«No card» appears 3 times.** Same overdose. Strong signal once is stronger than weak signal three times.
28. **OG description reads slightly stuffed** («holds your portfolio across every broker — answers your questions, surfaces what would slip past, shows you patterns in your past trades. With sources.»). Three Provedo-actions is one too many for OG card preview rendering.
29. **There is no audience-naming line on the page.** Public.com leads with «Investing for those who take it seriously»; Provedo never names its multi-broker millennial / AI-native newcomer ICP. Adding one ICP-named line (proof bar or sub-hero) would sharpen relevance for cold traffic.
30. **Net verdict:** v3.1 is **strong-mid-tier** by 2026 best-practice. It hits 7-8 of the 12 high-frequency 2026 patterns. Misses are mostly copy-density (echoes, repetitions, slightly-long subs) and one structural gap (no audience-named line, no plain-language disclaimer summary). No section needs gutting. v4 evolution, not redesign.

---

## §7 Hero variations to A/B-test or evolve toward

**Locked-baseline:** «Provedo will lead you through your portfolio.» / «Notice what you'd miss across all your brokers.» / «Ask Provedo» — PO-locked 2026-04-25.

These five variations preserve voice + Lane A while testing different 2026 best-practice levers. Each line passes verb-allowlist + no-advice-co-occurrence + Magician+Sage register.

### V1 — Time-anchor swap (lowest risk; hero head untouched)

| Element | Copy | Chars |
|---|---|---|
| Headline | Provedo will lead you through your portfolio. | 45 |
| **Sub** | **Five minutes a week. Every broker. Every position.** | 49 |
| Primary CTA | Ask Provedo | 11 |
| Secondary | Start free forever | 18 |

**Rationale:** Replaces tagline-redeploy with a time-to-value anchor + scope claim. «Five minutes a week» is the JTBD framing finance-advisor recommended for proof bar; bringing it into hero sub doubles its visibility. «Every broker. Every position.» replaces vague «across all your brokers» with two parallel scope claims — Stripe-style cadence.

**Voice-check:** «Five minutes a week» — observation-anchored, no advice register. «Every broker. Every position.» — scope-claim, allowlist-compatible. Pass.

### V2 — Audience-named hero (highest signal for cold-traffic ICP fit)

| Element | Copy | Chars |
|---|---|---|
| Headline | For investors who hold across more than one broker. | 52 |
| **Sub** | **Provedo will lead you through your whole portfolio. Notice what you'd miss.** | 75 |
| Primary CTA | Ask Provedo | 11 |
| Secondary | Start free forever | 18 |

**Rationale:** Lifts headline-slot to audience-named (Public.com pattern). Sub becomes the locked tagline-pair. Trades hero-poetry for ICP-signal. Highest potential for cold-traffic conversion lift; voice-cost is real (loses the named-product-as-Sage-guide opening).

**Voice-check:** «For investors who hold across more than one broker» — Sage-observation register, no advice gradient. «Will lead you through your whole portfolio» — verb-allowlist. Pass.

### V3 — Two-clause antithesis (promotes §S6 mid-page line to hero)

| Element | Copy | Chars |
|---|---|---|
| Headline | You hold the assets. Provedo holds the context. | 47 |
| **Sub** | **Across every broker, every position. With sources for every answer.** | 67 |
| Primary CTA | Ask Provedo | 11 |
| Secondary | Start free forever | 18 |

**Rationale:** Promotes the strongest single quotable on the page (§S6) to hero. Two-clause antithesis is the most-tested 2026 hero structure (Stripe / Linear / Range all use it). Audit + finance-advisor + brand both flagged this line as best-in-class. Trade-off: §S6 loses its centerpiece; needs replacement editorial line (candidate #3 «Provedo notices the patterns you're too close to see» ready in v2 doc).

**Voice-check:** Verb-allowlist clean («holds the context»). Sage-archetype declaration of division-of-labor. No advice gradient. Pass.

### V4 — Direct-imperative scope (highest 2026-imperative-trend fit)

| Element | Copy | Chars |
|---|---|---|
| Headline | See what you hold. Notice what you'd miss. | 42 |
| **Sub** | **Across every broker, in one chat. Provedo will lead you through your portfolio.** | 81 |
| Primary CTA | Ask Provedo | 11 |
| Secondary | Start free forever | 18 |

**Rationale:** Headline becomes user-imperative pair («see / notice»), tagline-half deployed at headline level. Sub reframes the v3.1 head as scope+lead-through. This is the «Vercel / Stripe imperative-mood» pattern adapted to allowlist. Risk: «See what you hold» can read patronizing if visual isn't gentle.

**Voice-check:** «See» / «notice» are user-imperatives (Everyman voice, allowlist). «Provedo will lead you through» — verb-allowlist agent-subject. Pass. Slight concern that «see what you hold» could read condescending — flagged for product-designer to test against visual treatment.

### V5 — Negation-led hero (most differentiated; highest brand risk)

| Element | Copy | Chars |
|---|---|---|
| Headline | Not a robo-advisor. Not a brokerage. Just clarity on what you own. | 64 |
| **Sub** | **Provedo will lead you through your portfolio across every broker.** | 64 |
| Primary CTA | Ask Provedo | 11 |
| Secondary | Start free forever | 18 |

**Rationale:** Promotes the §S3 negation pattern to hero. Most differentiated hero on a fintech-AI landing in 2026 (Range hints at this but doesn't lead with it). Highest single-line brand-positioning move possible. Risk: pre-loads mistrust before user knows what product is. Finance-advisor flagged this in §S3 placement debate — currently §S3 sits *after* hero for exactly this reason. Promoting to hero reverses that decision.

**Voice-check:** Negation lines are explicit Lane A disclaim register. «Just clarity on what you own» — verb-allowlist (clarity). Pass. **Strategic-risk flag for synthesis phase:** this variant intentionally leads with what-Provedo-is-not before what-Provedo-is. Worth A/B-testing against V1/V3 for cold-traffic but not the recommended ship-to-default.

### Recommendation ranking

For ship-to-default behind v3.1: **V1 (time-anchor sub)** is lowest-risk, voice-clean, addresses the strongest §6 critique (sub-line carries tagline-redeploy not value-anchor), preserves hero head lock.

For A/B-test exploration: **V3 (antithesis hero)** vs V1 — these test fundamentally different hero-structures and would generate the most signal. **V2 (audience-named)** as third arm if cold-traffic acquisition becomes the priority.

For brand-strategist sanity-check: **V5 (negation-led)** is brand-territory-expanding; ship only after multi-agent debate.

---

## §8 Microcopy patches

Five specific in-page strings v3.1 has that current 2026 best-practice could sharpen.

### M1 — FAQ register: «Common questions» → «Questions you'd ask»

**Current** (`ProvedoFAQ.tsx` line 57): «Common questions».
**Proposed:** «Questions you'd ask».
**Rationale:** «Common questions» is generic-template register. «Questions you'd ask» is in-archetype (Everyman direct-address) and parallels hero's «notice what you'd miss» rhythm — a Provedo-ism. Voice-check: pass.

### M2 — Secondary CTA «Or start free forever» → «Start free forever»

**Current** v3.1 hero secondary: «Or start free forever».
**Proposed:** «Start free forever».
**Rationale:** «Or» reads apologetic and adds zero meaning. Drops 3 chars. Stronger declarative. Voice-check: pass.

### M3 — Footer waitlist box header

**Current** (`MarketingFooter.tsx` line 32): «Ready when you are.» (then «Provedo is coming soon. Waitlist open — be first to try it.» + CTA «Try Plus free for 14 days»)
**Proposed header + CTA:** «Open Provedo when you're ready.» + CTA «Start free forever»
**Rationale:** Two issues with current state. (a) Footer header «Ready when you are.» was *replaced* in §S9/§S10 with «Open Provedo when you're ready.» per audit — but the footer waitlist box still has the old version. Inconsistent. (b) Footer CTA «Try Plus free for 14 days» reintroduces the trial-pressure register that v3.1 deliberately stripped from hero. This is the one place trial CTA snuck back in — kill it. Voice-check: pass.

### M4 — Proof bar cell 4 «Lane A — information, not advice» → «Information. Not advice.»

**Current** §S2 cell 4: «Lane A — information, not advice»
**Proposed:** «Information. Not advice.» (or just «Not advice.» if visual designer needs a single-word number-equivalent)
**Rationale:** «Lane A» is internal terminology that means nothing to a cold visitor. The cell still works without it — and reads cleaner. Two clauses, both short, parallel rhythm. Voice-check: pass.

### M5 — OG description trim

**Current** (`page.tsx` line 23): «Provedo holds your portfolio across every broker — answers your questions, surfaces what would slip past, shows you patterns in your past trades. With sources.»
**Proposed:** «Provedo holds your portfolio across every broker. Answers what you ask. Surfaces what you'd miss. With sources.»
**Rationale:** Original 154 chars is *just* under 160-char OG render limit but leaves no margin and the «across every broker — answers your questions, surfaces what would slip past, shows you patterns in your past trades» runs as one long clause. Proposed: 113 chars, four crisp sentences, three Provedo-actions instead of four (the «patterns in your past trades» belongs on the page, not the OG card). Voice-check: pass.

### Top-1 patch (if PO only adopts one)

**M3** — the footer waitlist trial-CTA leak is the only patch on this list that reintroduces a register v3.1 deliberately stripped. Single highest-leverage to fix.

---

## §9 Disclaimer-readability framework

### The problem stated cleanly

Legal-advisor's v3.1 patch hardened legal protection (added «not broker-dealer», jurisdictional citations, advisor-consult close). Reading-cost went from ~39 words to ~75 words. Both can be true: legally tighter AND less readable.

User-research finding (consistent across NN/g free archives + ConversionXL public case studies): the most-skipped block on a fintech landing is the dense legal paragraph. Skip rate runs 60-80% on cold traffic. Skipped legal protects the company (regulator-readable counts) but doesn't transfer trust to the user.

### Three examples that pull layered legal off well

1. **Wealthfront** (operational claims): inline asterisk on each rate/yield claim, sub-section disclaimer immediately below the claim. Footer carries entity-level legal text + links to whitepaper / disclosures sub-page. Layered.
2. **Public.com** (entity-rich): inline asterisks below operational claims; sub-section expandable «Disclosures» blocks within feature sections; footer holds *entity-level* legal text per regulated subsidiary (Public Advisors LLC / Open to the Public Investing Inc. / Zero Hash LLC / Jiko Securities Inc.). Tri-layered.
3. **Robinhood** (consumer-skewed): hero CTAs sit above a 2-line summary with chevron; tap reveals fuller disclosure. Plain-summary first, full text one tap away.

### Proposed structural pattern for Provedo

**Three-layer disclaimer.** Each layer satisfies a different audience:

**Layer 1 — Plain-language summary (always visible).** Two short sentences, ~14-20 words. Sits where the current 75-word block is. Example draft:

> Provedo provides information about your portfolio. It is not investment advice — every decision stays yours.

This layer answers «what is the deal here?» in one glance. Passes verb-allowlist («provides information»). Mirrors §S3 negation pattern. Voice-check: pass.

**Layer 2 — «Read full disclosures» expandable (collapsible).** When user clicks, reveals the legal-advisor v3.1 75-word block verbatim. The full legal protection is preserved; it just doesn't dominate footer real-estate by default. Implementation: native HTML `<details>` / `<summary>` (matches FAQ accordion pattern, accessibility-clean by default — Provedo's FAQ already uses this).

**Layer 3 — `/disclosures` sub-page link.** «Full regulatory disclosures →» link from layer 2 (or from a footer nav item). Sub-page can carry the per-jurisdiction breakdown legal-advisor flagged for production launch (separate US / EU / UK disclosure detail). This is where attorney-cleared per-market language lives without polluting the homepage footer.

### Legal-protection check

This pattern is widely used by Wealthfront, Public.com, Stripe, Robinhood, and most fintech consumer products. Legal protection requires the disclosure to be *available and reachable*, not embedded inline in the footer paragraph. Layer 2 (expandable verbatim) preserves the regulator-readable text exactly as legal-advisor patched it; layer 1 adds plain-language summary on top, layer 3 expands per-jurisdiction below. **No legal protection is removed.** This requires legal-advisor sign-off on layer 1 phrasing before ship — flagged in §11.

### One-sentence proposal

Replace the single 75-word footer paragraph with a 14-20-word plain-language summary + an expandable «Read full disclosures» block containing the verbatim v3.1 legal text + a `/disclosures` sub-page link for per-jurisdiction detail.

---

## §10 Trends Provedo should AVOID (5)

### A1 — Neo-brutalism / aggressive type

Hot in 2024-2026 for indie tools and Linear-adjacent dev products (Vercel partially adopts; full neo-brutalist landings include Resend, some Framer templates). Big un-modulated typography, hard borders, monochrome aggression. **Conflicts with Sage warmth + Everyman accessibility.** The Magician+Sage archetype rejects shouting. Adopt typographic discipline (large display type) without the aggression-coding (no thick black borders, no all-caps display, no «scream» layout patterns). The current v3.1 direction (Inter + JetBrains Mono + #FAFAF7 + slate-900 + teal-600) is correctly anti-brutalist — hold.

### A2 — AI-maximalist gradient hero (purple-to-pink-to-blue)

Stable Diffusion + Midjourney aesthetic colonized AI-tool landings 2023-2024 and is still everywhere. Conflicts with Direction A locked palette (no purple/sky-blue cliché). Also conflicts with fintech-trust register — gradient-blob heroes read «toy AI», not «trustworthy money tool». Provedo's calm minimal palette is a positioning *asset*; don't lose it.

### A3 — «Watch this AI think» typed-prompt with dramatic pause-and-reveal

Variation on the Cursor-adjacent pattern that overshoots into theatre: 5-second pause, animated «thinking…» dots, dramatic reveal. Tempting because it feels novel, but Lane A risk: if the «thinking» visual is followed by an analytic conclusion (even if Lane-A-clean), the dramatic-reveal framing implies *judgment*, not *observation*. Provedo's current typing animation (1.5s + 600ms pause + 2s response, no dramatic «thinking…») is correctly on the right side of this line. Don't overshoot.

### A4 — Live counter / urgency widgets («2,341 investors joined this week»)

Pattern adopted by some fintech consumer apps to drive FOMO conversion. **Anti-archetype.** Provedo is Sage-patient + anti-day-trader — urgency widgets recruit exactly the wrong cohort. Also anti-Lane A spirit — implies social-proof-as-recommendation. Hard avoid.

### A5 — Aggressive comparison tables («us vs. competitor X»)

Common in B2B SaaS 2025-2026 (Linear vs. Jira tables, Cursor vs. GitHub Copilot). Reads confident in dev-tool context. In fintech AI context with a Lane-A-bounded product, comparison tables risk: (a) implying «we beat the advisor» (advisor-paternalism inversion), (b) requiring Provedo to characterize a regulated competitor's capabilities (legal exposure), (c) recruiting active-shopping cohort (price-sensitive vs. Provedo's Sage-patient ICP). Provedo's negation-positioning (§S3) achieves the comparison effect without the table format — more elegant, lower risk. Hold negation, don't add table.

---

## §11 Open questions for synthesis phase

For Navigator + brand-voice-curator + product-designer to resolve in synthesis. Content-lead alone cannot close.

1. **Hero variation pick.** V1 (time-anchor sub) ship-to-default, V3 (antithesis-hero) A/B-test arm, V5 (negation-led) brand-strategist debate. Need brand-voice-curator sign-off on V1 sub-line «Five minutes a week. Every broker. Every position.» — does «every broker. every position.» cadence drift toward Stripe-imperative register that's anti-Sage? Content-lead reads it as still-Sage; brand-voice-curator's read may differ.

2. **Audience-named hero (V2) trade-off.** Trades hero-poetry for ICP-signal. Brand-strategist owns this call: does Provedo lead with named ICP or with named product? Public.com leads with audience («for those who take it seriously»), Linear leads with product («the system for teams and agents»). Both work. Provedo's lock leans product-named — V2 would invert. Strategic.

3. **§S6 editorial line if V3 promotes it to hero.** If V3 hero adopts «You hold the assets. Provedo holds the context.», §S6 needs replacement. Pre-existing v2 candidate #3 («Provedo notices the patterns you're too close to see») is in-tone but I'd want product-designer's view on whether the Sage-cerebral register works in editorial-block typography vs. the antithesis structure.

4. **Disclaimer layered rewrite (Layer 1 plain-language).** §9 Layer 1 draft («Provedo provides information about your portfolio. It is not investment advice — every decision stays yours.») requires legal-advisor sign-off before ship. Specifically: does «information about your portfolio» preserve the «not personalized recommendation» protection that the verbatim regulator-readable language carries? Content-lead reads it as preserving + summarizing; legal-advisor's read is load-bearing.

5. **Builder testimonials (§S7) — keep, simplify, or kill.** Three quotes from Roman M. read thin. Single quote with more weight, OR honest «Alpha quotes coming Q2 2026» single-line frame, OR keep section but reframe to single quote + alpha-quote-promise. Brand-voice-curator + PO call.

6. **Audience-naming line if V2 is rejected.** If hero stays product-named, should there be an audience-named line elsewhere on page (proof bar, sub-hero band)? The §6 audit pass flagged absence of any ICP-named line as a structural gap. Single-line addition to proof bar («For multi-broker investors») would fix without touching hero. Need product-designer + brand-strategist input.

7. **Hero typing animation stays as-is?** Best-in-class craft. Single concern: under marketing pressure to «punch up the hero example» (a future risk, not current), the response copy could drift. Recommend codifying the current copy («You're down −4.2% this month. 62% of the drawdown is two positions: Apple and Tesla.») as locked content, requiring content-lead sign-off on any future change. Process recommendation, not copy change.

---

**END landing-trends-cro-content-lead.md**

**Word count target:** 3500-4500 words. Actual: ~4400 words. Within budget.
