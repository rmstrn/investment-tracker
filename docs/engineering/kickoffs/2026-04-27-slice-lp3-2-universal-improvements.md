# Kickoff — Slice-LP3.2 — Provedo Landing v3.2 «Universal Improvements»

**Author:** right-hand
**Date:** 2026-04-27
**Status:** PO-greenlit (Option D, Layer 1 = legal-edit, «free forever» drop = global)
**Branch:** stack on `feat/lp-provedo-first-pass` (PR #65 in flight)
**Strategic posture:** A/B/C decision DEFERRED to post-trigger Phase 2.5 session

---

## ⚠ ADDENDUM 2026-04-27 — PO microcopy principle (READ BEFORE DISPATCHING content-lead)

After initial scope, PO tightened the «free forever» drop directive into a broader principle. **Updated DECISIONS.md entry (2026-04-23 «Free tier is permanent») now reads:**

> Marketing-copy directive: This commitment is INTERNAL anchor only. Do NOT translate into user-facing copy. No «free forever», no «free always», no «always free», no «no trial ending», no «no last chance», no «no expiration» framings. Users know free is free — explaining the obvious reads condescending and signals anti-commercial intent. Trust users to discover the policy through product use, not through reassurance copy.

**What this changes for slice-LP3.2:**
- Drop ALL «no trial ending» / «no last chance» / «cancel is one click» / «no expiration» framings ANYWHERE in marketing surface they appear (not just landing CTAs).
- DO NOT replace dropped phrases with NEW explanatory copy («The Free tier is permanent», «Free never expires», etc.). Just remove. Less is more.
- Keep ONLY actual product info: «No card.» (informational — some «free» tiers DO require card upfront, this is real differentiation), «50 free questions/month» (product detail).
- Apply to /pricing page hero copy too — «Upgrade when the AI and insights earn it.» is also reassurance copy bordering on anti-commercial. Flag for content-lead review; if no clean replacement, drop the line entirely.
- FAQ answers are exception — user came asking, direct answer is appropriate.

**No counter-arguments survived review** (right-hand audited 4 candidate exceptions 2026-04-27, all rejected). This is principle, not preference.

---

## Background

Phase 2 redesign synthesis (`docs/reviews/2026-04-27-redesign-synthesis-product-designer.md`) presented 3 options (A/B/C). Right-hand issued preliminary Option A recommendation. Phase 3 multi-specialist validation (Rule 3 dispatch) returned **4/4 SUPPORT-ALT-D**: ship 7 universally-validated improvements as v3.2 patch slice; defer A/B/C strategic posture decision until cold-traffic signal exists.

PO accepted Option D + 2 micro-decisions:
1. Layer 1 disclaimer wording — legal-advisor's edit applied
2. «free forever» — drop globally across all marketing surface, replace with just «Free»

## Phase 3 validator reports
- `docs/reviews/2026-04-27-phase3-finance-advisor-validation.md`
- `docs/reviews/2026-04-27-phase3-legal-advisor-validation.md`
- `docs/reviews/2026-04-27-phase3-brand-voice-curator-validation.md`
- `docs/reviews/2026-04-27-phase3-brand-strategist-validation.md`

## Trigger criteria for Phase 2.5 (when to revisit A/B/C)

Per brand-strategist verdict — A/B/C decision reopens after one of:
1. First credible third-party brand mention (fintech-Twitter >5K-follower account, podcast, named case-study)
2. 1000+ unique visitors with bounce-rate baseline <70% on v3.2-patched landing
3. Confirmed ICP-A inbound (Notion/Linear/Cursor email-domains in waitlist)

Until trigger fires — keep evolving D-style.

---

## Scope — 11 changes

### A. Demo content fidelity
1. **S4 demo tabs (4 tabs) — Granola-grade fully-written example output.** Replace bracketed placeholders with real-feeling user question + Provedo answer per tab. Inherit v3.1 finance/legal patch templates from commit `8cb509b` (Tab 3 simultaneous-animation phrasing; Tab 4 sourced-benchmark template). Source: synthesis §2 line 46 + R1 §4.R1 + finance-advisor risk #2.

### B. Three-layer disclaimer
2. **Footer disclaimer — three-layer pattern (Layer 1 + Layer 2 + Layer 3 SHIP SIMULTANEOUSLY).** Per legal-advisor risk #2: do NOT defer Layer 3.
3. **Layer 1 plain-language summary** (replaces current 75-word block in visible position):
   > «Provedo provides general information about your portfolio. It is not personalized investment advice — every decision stays yours.»
   (Legal SIGNED-WITH-EDIT — added «general» + «personalized» — closes SEC personalization-element gap.)
4. **Layer 2 expandable native HTML `<details>`** containing verbatim 75-word v3.1 disclaimer (the regulator-readable text from commit `8cb509b` MUST NOT be modified).
5. **Layer 3 `/disclosures` sub-page** — full extended disclosure text. ~30 min lift per legal-advisor.

### C. Proof bar revisions
6. **Drop «Lane A —» prefix** from cell #4 → «Information. Not advice.» (R3 §8.M4)
7. **Add «5 minutes a week» time-anchor cell** in proof bar — NOT in hero sub (brand-voice-curator correction: keep hero locked).
8. **Cell #2 microcopy:** «50 free chat messages a month» → «50 free questions a month» (finance-advisor patch — investor-task register).

### D. Audience-whisper
9. **Add micro-line:** «For investors who hold across more than one broker.» Placement: under hero or as proof-bar small-print (product-designer call). Source: R1 §4.R3 + R2 §7.Adopt-4 convergence.

### E. Testimonial honesty
10. **S7 testimonials — collapse to single weighted Roman M. quote** + honest line «Alpha quotes coming Q2 2026». Source: R3 §6.20.

### F. PO directives (microcopy + CTA)
11. **«Free forever» — drop globally; replace with just «Free».** Apply to all marketing surface:
    - **Drop secondary CTA «Or start free forever»** entirely (per PO directive — single-CTA pattern):
      - `ProvedoHero.tsx` lines 53-60 (legacy — verify if dead code; if mounted anywhere else, patch; else delete file)
      - `ProvedoHeroV2.tsx` lines 466-473 (current — remove NavLink, rebalance flex layout)
      - `ProvedoRepeatCTA.tsx` lines 28-31 (legacy — same dead-code check)
      - `ProvedoRepeatCTAV2.tsx` lines 56-66 (current — remove NavLink + visual rebalance)
    - **Microcopy «free always» / «always free» / «free forever» / «free-forever» — replace with just «Free» context where it makes sense:**
      - `ProvedoHeroV2.tsx:477` «No card. 50 chat messages a month, free always.» → «No card. 50 free questions a month.» (also applies finance-advisor «messages»→«questions» patch)
      - `ProvedoRepeatCTAV2.tsx:70` «No card. 50 free messages a month, free always.» → «No card. 50 free questions a month.»
      - `ProvedoFAQ.tsx:29` (Q1 answer) «Free is always free — 50 chat messages a month, full broker aggregation, weekly insights, no card required. Plus tier ($9/month) unlocks unlimited chat and insights when they matter.» → «The Free tier is 50 questions a month, full broker aggregation, weekly insights, no card required. Plus tier ($9/month) unlocks unlimited chat and insights when they matter.»
      - `ProvedoFAQ.tsx:39` (Q3 answer) «Free-forever tier is locked» → «The Free tier is locked»
    - **OG/SEO description** `(marketing)/page.tsx:29` «...with sources. Free forever, no card.» → «...with sources. Free tier, no card.»
    - **Pricing page** (PO directive «вообще не надо упоминать»):
      - `(marketing)/pricing/page.tsx:9` description «Simple pricing. Free forever for basic tracking...» → «Simple pricing. Free for basic tracking...»
      - `(marketing)/pricing/page.tsx:32` hero «Free forever for basic tracking. Upgrade when the AI and insights earn it.» → «Free for basic tracking. Upgrade when the AI and insights earn it.»
      - `(marketing)/pricing/_components/PricingTable.tsx:23` `priceSuffix: 'forever'` → `priceSuffix: ''` (or remove the suffix prop entirely — `$0` standalone is clean)
    - **S9 FAQ section heading:** «Common questions» → «Questions you'd ask» (R3.M1)
    - **Footer waitlist box CTA fix** (R3 §M3): if footer renders «Try Plus free for 14 days», replace with neutral «Open Provedo» or «Get the email» — tech-lead's call after seeing actual mounted footer copy

### G. Hero — DO NOT TOUCH
- Hero head LOCKED 2026-04-25: «Provedo will lead you through your portfolio.»
- Sub LOCKED: «Notice what you'd miss across all your brokers.»
- Brand-voice-curator hero-lock NOT GRANTED for any change.
- Time-anchor «5 minutes a week» goes to PROOF BAR, not hero sub.

---

## Universal improvements EXPLICITLY EXCLUDED from D

These were proposed in synthesis but Phase 3 validators REJECTED:
- **JBM-mono accent test on §S6 closer** — REJECTED by brand-voice-curator (reads as code-comment, off-archetype for fintech). Keep Inter italic.
- **$9/month price-on-hero proof-bar cell** — REJECTED by finance-advisor (anti-Sage commercial-pressure copy; Sharesight comparison incorrect; FAQ Q4 already carries $9).
- **All A/B/C strategic-posture changes** (audience-named hero / negation-led hero / sources-strip / page-reorder) — DEFERRED until trigger event.

---

## Specialist dispatch (tech-lead to coordinate)

- **content-lead:** 4 demo tab content rewrites + Layer 1 + Layer 3 sub-page draft + audience-whisper + S7 quote consolidation + microcopy patches
- **product-designer:** proof-bar cell rebalance (add time-anchor + drop «Lane A —» + «messages»→«questions») · audience-whisper visual placement · footer 3-layer visual spec · removed-secondary-CTA visual rebalance (hero + repeat-CTA)
- **frontend-engineer:** Layer 1+2+3 implementation · proof-bar cell changes · hero/repeat-CTA secondary CTA removal (4 components — verify v1 dead code) · FAQ wording patches · OG meta update · /pricing copy + PricingTable suffix · footer waitlist fix · all test updates
- **a11y-architect:** `<details>` keyboard + screen-reader audit · Layer 3 `/disclosures` page audit · audience-whisper reading-order check
- **legal-advisor:** Layer 3 `/disclosures` full-text sign-off
- **qa-engineer:** smoke + visual regression on staging Vercel preview before merge

## Test impact
- `apps/web/src/app/(marketing)/page.test.tsx:53` — update OG description assertion (drop «free forever» match)
- `apps/web/src/app/(marketing)/page.test.tsx:411` — REMOVE «Or start free forever» link assertion (no longer rendered)
- `apps/web/src/app/(marketing)/pricing/page.test.tsx` — verify no «free forever» assertion remains
- ADD: audience-whisper rendering test
- ADD: time-anchor proof-bar cell test
- ADD: 3-layer disclaimer details/summary semantics test (open/close, keyboard accessible)
- ADD: `/disclosures` page basic render test
- VERIFY: 175/175 tests still pass; CI green

## Sequencing
**Single PR (slice-LP3.2)** stacked on PR #65 (or merged into PR #65 if PO greenlights bundling). All non-structural except 3-layer disclaimer + secondary-CTA removal. Tech-lead decides bundling vs new branch based on PR #65 merge timing.

## Out of scope (do NOT touch)
- Hero copy (locked, voice-curator did not grant)
- A/B/C strategic posture (deferred to Phase 2.5 post-trigger)
- TD-091 (Provedo SVG wordmark)
- TD-092 (full v1.4 token migration)
- TD-093 (Clerk auth restoration)

## Definition of done
- All 11 scope items implemented
- 175/175 tests passing + new tests for new components
- CI green
- Vercel preview deployed for PO review
- /disclosures page accessible from footer Layer 2 link
- DECISIONS.md updated with «2026-04-27 — Landing v3.2 universal-improvements ship; A/B/C deferred» entry (right-hand owns)
- TECH_DEBT.md updated if any debt introduced (tech-lead owns)
- merge-log.md entry on merge (tech-lead owns)

## Hard constraints (Rule 1-4)
1. No spend without PO greenlight (no paid services, no domain/TM purchases this slice)
2. No external comms in PO's name (no posts/emails/DMs as PO)
3. This kickoff is the synthesized output of real Rule 3 multi-agent dispatch (4 validators in parallel) — implementation can proceed without re-dispatching
4. Do NOT name the rejected naming predecessor in any code/copy/test/doc/commit

---

**END kickoff-2026-04-27-slice-lp3-2-universal-improvements.md**
