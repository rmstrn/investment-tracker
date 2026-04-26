# Dispatch — content-lead — Slice-LP3.2 Universal Improvements

**Wave:** 1 (gates Wave 2 frontend-engineer impl)
**ETA:** 6-8h
**Branch:** `feat/lp-provedo-first-pass` (PR #65 stack)
**Hard rules:** Rule 1 (no spend) · Rule 2 (no PO-name comms) · Rule 4 (do NOT name the rejected naming predecessor anywhere) · v3.1 finance/legal patches at commit `8cb509b` are LOAD-BEARING and MUST NOT be undone (see §9 of legal-advisor Phase 3 report).

## Source artefacts (read first)

1. `docs/kickoffs/2026-04-27-slice-lp3-2-universal-improvements.md` — full kickoff
2. `docs/reviews/2026-04-27-phase3-finance-advisor-validation.md` §3 (top 3 finance risks — content-lead must inherit Tab 3 normalization phrasing + Tab 4 sourced-benchmark phrasing verbatim from `8cb509b`)
3. `docs/reviews/2026-04-27-phase3-legal-advisor-validation.md` §1 (Layer 1 wording locked) + §9 (5 verbatim artefacts that must not change)
4. `docs/reviews/2026-04-27-phase3-brand-voice-curator-validation.md` §4 Edit #3 (Layer 1 voice approval) + §1 Q5 (audience-whisper voice approval)
5. `docs/reviews/2026-04-27-redesign-synthesis-product-designer.md` §2 Option A demo presentation strategy (Granola pattern)
6. `docs/finance/AI_CONTENT_VALIDATION_TEMPLATES.md` — Lane A discipline templates
7. `docs/finance/BENCHMARKS_SOURCED.md` — every numerical comparative claim must resolve to a row here OR to the user's own portfolio data
8. `docs/content/landing-provedo-v2.md` lines 268-275 + 295-303 — current Tab 3 + Tab 4 v3.1-patched text (PHRASING TEMPLATES TO INHERIT)
9. `apps/web/src/app/(marketing)/_components/ProvedoDemoTabsV2.tsx` — current shipped Tab 1-4 content (baseline to evolve)
10. `apps/web/src/app/(marketing)/_components/ProvedoTestimonialCards.tsx` — current 3 builder cards

## Deliverables

### D1 — 4 demo tab content (Tab 1 / Tab 2 / Tab 3 / Tab 4) — Granola-grade

**Goal:** replace bracketed-placeholder feel with fully-written real-feeling user question + Provedo answer per tab. Reader reads the example, mentally maps to own portfolio, value-prop lands without explanation.

**Quality bar (Granola-grade):**
- Real-feeling user question (not «Show me my portfolio» — something like «Why is my portfolio down this month?»)
- Real-feeling Provedo answer with specific dollar amounts, tickers, dates, source citations
- Citation badges inline (e.g., «AAPL Q3 earnings 2025-10-31» linking to press release; «Schwab statement 2025-11-01»)
- The rendered chart inline must feel like part of the believable example, not a placeholder

**Hard constraints (from v3.1 patches at `8cb509b`):**
- **Tab 3 (TradeTimeline)** — MUST inherit verbatim phrasing: «price returned above your sell level» + «not a recommendation about future trading decisions» + «past patterns do not predict future results» + «common pattern across retail investors». Animation note (NOT your scope but for context): sell points + recovery marks + connectors fade in SIMULTANEOUSLY, not sequentially. Do NOT introduce «if you hadn't sold» narrative — that was the legal block.
- **Tab 4 (AllocationPieBar)** — MUST use sourced benchmark «about 2x the sector's weight in S&P 500 (~28%)». Do NOT introduce the unsourced «US retail median tech allocation 34%» (that's still flagged in `BENCHMARKS_SOURCED.md` row 8).
- **Every numerical comparative claim in new content** must resolve to either (a) a row in `BENCHMARKS_SOURCED.md` or (b) the user's own portfolio data (e.g., «your weighted average cost of $182»). No new unsourced benchmarks.
- Lane A: no advice / recommendation / strategy / suggestion / guidance-on-action language. Provedo verbs allowlist only: provides clarity / context / observation / foresight · sees / surfaces / shows / cites / connects / notices · leads through.

**Output format:** Markdown deliverable with one section per tab. Each section:
- Section header (current shipped header for context)
- User question (1-2 sentences)
- Provedo answer (3-6 sentences with inline citations marked as `[source: AAPL Q3 earnings 2025-10-31]` etc.)
- Notes for frontend on chart-data-shape if any change needed

### D2 — Layer 3 `/disclosures` full-text page draft

**Goal:** create a stand-alone `/disclosures` MDX or TSX page with full extended disclosure text. Layer 3 is required to ship simultaneously with Layer 2 per legal-advisor §2 (NOT deferred to post-alpha).

**Source for content:**
- The verbatim 75-word block from `apps/web/src/app/(marketing)/_components/MarketingFooter.tsx` lines 67-77 — this is the regulator-readable text from `8cb509b`. Layer 3 contains this AND extended sections.
- Recommended structure: H1 «Regulatory disclosures», then sections:
  1. «Who Provedo is and is not» (uses the negation lines: not registered investment advisor, not broker-dealer, no personalized recommendations, etc.)
  2. «Information we provide» (general information about your portfolio, observation/clarity/context/foresight register)
  3. «Per-jurisdiction notes» (US Investment Advisers Act 1940 reference, EU MiFID II reference, UK FSMA 2000 reference — surface-level acknowledgment, no per-jurisdiction long-form yet)
  4. «Past performance and predictions» (past patterns do not predict future results)
  5. «Your decisions, your responsibility» (every decision stays yours; consult licensed financial advisor in your jurisdiction)
  6. «Last updated» date (use 2026-04-27)
- Length budget: 400-700 words. Plain language but lawyer-defensible.
- Voice: same observation/disclaim register as the footer block. Sage gravitas, no marketing tone.
- LANE A: zero advice/recommendation/strategy verbs. Disclaim register only.

**Output format:** complete page text ready for frontend-engineer to drop into `apps/web/src/app/(marketing)/disclosures/page.tsx` (TSX with metadata + JSX). Include `<Metadata>` with title «Regulatory disclosures · Provedo» and noindex (matching staging deploy posture).

This deliverable goes to legal-advisor (parallel) for sign-off before frontend ship.

### D3 — S7 single weighted testimonial selection + «Alpha quotes coming Q2 2026» line

**Goal:** collapse current 3-card stack to single most-weighted Roman M. quote + honest line. Per finance-advisor and brand-voice-curator: three quotes from same person reads thin.

**Source:** current 3 cards in `ProvedoTestimonialCards.tsx` lines 15-37:
- Card 1 («asked Provedo why my portfolio was down... 62% of the work, with sources»)
- Card 2 («five minutes Sunday morning... whole product for me»)
- Card 3 («selling Apple within days of every dip... no judgment, no advice»)

**Deliverable:** pick ONE quote that carries the most weight. Recommendation criteria:
- Carries multi-broker / chat-first / specific-numbers / sources-cited signal best
- Card 1 is the strongest candidate (ICP-A pattern recognition + sources + chat surface), but you're the editor — make the call.
- Provide:
  1. Selected quote (verbatim)
  2. Section header revision (current «What testers will be noticing.» → propose if change needed)
  3. Honest line copy (recommendation: «Alpha quotes coming Q2 2026.» — keep current «Coming Q2 2026» badge above)
  4. Caption underneath: keep «Roman M. · builder at Provedo · [surface]» pattern

### D4 — Microcopy patches verification

The kickoff §F lists exact diffs. Your job: confirm phrasing voice-clean, propose any micro-refinements, flag concerns. Specifically:

- ProvedoHeroV2:477 «No card. 50 chat messages a month, free always.» → «No card. 50 free questions a month.»
- ProvedoRepeatCTAV2:70 «No card. 50 free messages a month, free always.» → «No card. 50 free questions a month.»
- ProvedoFAQ:29 (Q1 answer) «Free is always free — 50 chat messages a month, full broker aggregation, weekly insights, no card required. Plus tier ($9/month) unlocks unlimited chat and insights when they matter.» → «The Free tier is 50 questions a month, full broker aggregation, weekly insights, no card required. Plus tier ($9/month) unlocks unlimited chat and insights when they matter.»
- ProvedoFAQ:39 (Q3 answer) «Free-forever tier is locked» → «The Free tier is locked»
- (marketing)/page.tsx:29 OG description «...with sources. Free forever, no card.» → «...with sources. Free tier, no card.»
- (marketing)/pricing/page.tsx:9 description → «Simple pricing. Free for basic tracking. Paid tiers unlock deeper AI and tax reports.»
- (marketing)/pricing/page.tsx:32 hero → «Free for basic tracking. Upgrade when the AI and insights earn it.»
- pricing/_components/PricingTable.tsx:23 `priceSuffix: 'forever'` → `priceSuffix: ''` (per kickoff: `$0` standalone is clean)
- ProvedoFAQ section heading: «Common questions» → «Questions you'd ask»
- Footer waitlist box CTA at MarketingFooter.tsx:38 «Try Plus free for 14 days» → propose neutral replacement. Kickoff suggests «Open Provedo» or «Get the email». Recommend one.

**Output:** approval/objection per item, propose any voice-improving alternatives. Brand-voice-curator already pre-approved §F items in `phase3-brand-voice-curator-validation.md` §6 — your job is to catch any patches that should travel together (e.g., audience-whisper tone-of-voice rhyme with disclaimer wording).

### D5 — Audience-whisper line — final approval

**Locked text:** «For investors who hold across more than one broker.» (51 chars)
**Already approved:** brand-voice-curator §1 Q5 (CLEAN — descriptive ICP, not recruitment).
**Your job:** confirm placement preference (under hero sub OR as proof-bar small-print). product-designer owns the visual call but content-lead has voice/reading-order intuition. Provide one sentence rationale for placement preference.

## Constraints

- Do NOT touch hero head/sub copy («Provedo will lead you through your portfolio.» / «Notice what you'd miss across all your brokers.»). Hero LOCKED 2026-04-25; brand-voice-curator did NOT grant lock-reopening.
- Do NOT add any A/B/C strategic-posture content (audience-named hero, negation-led hero, sources-strip section). Those are deferred to Phase 2.5.
- Do NOT change any v3.1 finance/legal patch wording at `8cb509b` (5 artefacts listed in legal-advisor §9).
- Do NOT name the rejected naming predecessor.

## Acceptance criteria

- [ ] D1 — 4 demo tab content drafts ready, all numerical comparatives sourced, Lane A clean, Tab 3 + Tab 4 inherit `8cb509b` phrasing verbatim
- [ ] D2 — `/disclosures` full page text ready (400-700 words), 6 sections, Lane A clean, ready for legal-advisor sign-off
- [ ] D3 — single quote selected with rationale + honest line + section caption
- [ ] D4 — all 11 microcopy patches reviewed, concerns flagged, footer waitlist replacement chosen
- [ ] D5 — audience-whisper placement preference + rationale

## Output location

Write deliverables to `docs/content/slice-lp3-2-content-lead-deliverables.md` (single file with all 5 deliverables sectioned). frontend-engineer reads this file when implementing.

## Report back

When complete, report to tech-lead with:
- Path to deliverable file
- Any blockers or open questions
- Confirmation that hard constraints held
