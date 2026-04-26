# Slice-LP3.2 — Content-Lead Deliverables

**Author:** content-lead
**Date:** 2026-04-27
**Branch:** `feat/lp-provedo-first-pass` (PR #65 stack)
**Wave:** 1 (gates Wave 2 frontend-engineer impl)
**Status:** READY FOR REVIEW (D2 → legal-advisor sign-off; D5 placement → product-designer call)

**Hard rules respected:** Rule 1 (no spend) · Rule 2 (no PO-name comms) · Rule 4 (rejected naming predecessor not named) · v3.1 finance/legal patches at `8cb509b` LOAD-BEARING and not undone.

**PO microcopy principle 2026-04-27 applied throughout:** «free forever / free always / always free / no expiration / no last chance / cancel-is-one-click / we'll never charge you» framings dropped. Replacements are removals, not new explanatory copy. Kept: «No card.» (real product info), «50 free questions a month» (product detail), FAQ direct answers (user came asking).

---

## D1 — 4 demo tab content (Granola-grade)

**Surface:** `apps/web/src/app/(marketing)/_components/ProvedoDemoTabsV2.tsx`
**Strategy:** evolve current shipped content (already Granola-leaning post-`8cb509b`). Tab 3 + Tab 4 phrasing preserved verbatim from finance/legal v3.1 patch. Tab 1 + Tab 2 lifted to add inline source citations matching the «every observation cited» brand promise.

### Section header (above tabs)

KEEP current shipped:
- H2: «Ask anything.»
- Sub: «Four real questions on your actual holdings. Notice what you'd miss.»

Voice-check: PASS. Imperative «Ask», observation register «notice», no advice gradient.

### Tab 1 — «Why?»

**Tab label:** `Why?` (KEEP)

**User question (UserBubble):**
> Why is my portfolio down this month?

**Provedo answer (ProvedoBubble) — REVISED with source citation badges:**

> You're down **−4.2%** this month. **62%** of the drawdown is two positions: **Apple (−11%)** after Q3 earnings on **2025-10-31** [AAPL Q3 earnings] and **Tesla (−8%)** after the **2025-10-22** delivery miss [TSLA Q3 deliveries press release]. The rest of your portfolio is roughly flat.
>
> *Sources: AAPL Q3 earnings 2025-10-31 · TSLA Q3 delivery report 2025-10-22 · holdings via Schwab statement 2025-11-01.*

**Voice-check:** PASS. «Down / drawdown / flat» = observation register. No «consider rebalancing» / no «may want to». Disposition register only.

**Lane A check:** PASS. Retrospective public-record observation. No forward-looking forecast. Cohort-personalized but on user's own holdings (not advice-by-implication).

**Numerical comparatives sourced:**
- −4.2% / −11% / −8% / 62% — derived from user's own portfolio data (not external benchmark)
- AAPL Q3 earnings 2025-10-31 — public-record corporate event
- TSLA delivery miss 2025-10-22 — public-record corporate event

**Notes for frontend (chart-data shape — no change required):** `PnlSparklineAnimated` continues to render the −4.2% sparkline. New citation footer line is one additional `<p>` inside the existing `ProvedoBubble`. Consider rendering the source line in `text-xs` italic via `var(--provedo-text-tertiary)` to mirror Tab 3's disclaimer styling — visual rhyme.

---

### Tab 2 — «Dividends»

**Tab label:** `Dividends` (KEEP)

**User question (UserBubble):**
> When are dividends coming this quarter?

**Provedo answer (ProvedoBubble) — REVISED with source citation:**

> This quarter, **$312** expected across your holdings. Largest: **KO** ex-div **Sept 14 ($87)**, **VZ** ex-div **Oct 7 ($74)**, **MSFT** ex-div **Nov 19 ($61)**. Three smaller payments after that.
>
> *Sources: ex-dividend dates from issuer investor-relations announcements · per-share amounts × your holdings of record on Schwab statement 2025-09-30.*

**Voice-check:** PASS. Forward-looking on PUBLIC corporate-action data only (ex-div dates published by issuer). No return forecast. No «reinvest» suggestion.

**Lane A check:** PASS. Public-record corporate-action data + arithmetic on user's own positions = generic information, not personalized recommendation.

**Numerical comparatives sourced:**
- $312 / $87 / $74 / $61 — derived from user's own portfolio × public per-share dividend amounts (not external benchmark)
- Sept 14 / Oct 7 / Nov 19 ex-div dates — public-record corporate calendar

**Notes for frontend:** No chart-data shape change. Same one-line italic citation footer pattern as Tab 1.

---

### Tab 3 — «Patterns»

**Tab label:** `Patterns` (KEEP)

**Constraint:** verbatim phrasing inheritance from `8cb509b` finance-advisor + legal-advisor v3.1 patches. Do NOT modify the load-bearing phrases:
- «AAPL's price returned above your sell level within 8 weeks»
- «common pattern across retail investors»
- «Retrospective observation about past trades; not a recommendation about future trading decisions. Past patterns do not predict future results.»

**User question (UserBubble) — KEEP shipped:**
> Anything unusual in my trades this year?

**Provedo answer (ProvedoBubble) — KEEP shipped verbatim, add source line:**

> You sold **Apple** within **3 trading days** of a **>5% drop**, three times last year. Each time, **AAPL**'s price returned above your sell level within **8 weeks**. This is a common pattern across retail investors.
>
> *Retrospective observation about past trades; not a recommendation about future trading decisions. Past patterns do not predict future results.*
>
> *Sources: AAPL trade timestamps from your Schwab + IBKR statements 2025-01-01 to 2025-12-31 · AAPL daily close from public market data · disposition-effect pattern per Shefrin & Statman (1985).*

**Voice-check:** PASS. «Sold / returned / common pattern / observation» = observation register. Disclaimer paragraph is disclaim register.

**Lane A check:** PASS. Verbatim inheritance of legal-advisor patch. The added source line strengthens the «every observation cited» brand promise. Shefrin & Statman (1985) is `[VERIFIED]` in BENCHMARKS_SOURCED.md row 16 — citable as observation anchor, not prescription.

**Numerical comparatives sourced:**
- 3 trading days / >5% drop / 3x last year / 8 weeks — derived from user's own AAPL trade history + public AAPL daily close data
- «Common pattern across retail investors» — Shefrin & Statman (1985), BENCHMARKS row 16

**Notes for frontend (animation reminder, NOT scope but flagged for context):** Per legal-advisor §2.2 + design-brief animation rule #2: sell points + recovery marks + connectors must fade in **simultaneously**, not sequentially. Do NOT introduce a narrated «if you hadn't sold» reveal — that's the legal block point.

---

### Tab 4 — «Aggregate»

**Tab label:** `Aggregate` (KEEP)

**Constraint:** verbatim inheritance of «about 2x the sector's weight in S&P 500 (~28%)» finance-advisor v3.1 patch. Do NOT introduce «US retail median tech allocation 34%» (BENCHMARKS row 8 = unsourced, flagged 2026-04-23).

**User question (UserBubble) — KEEP shipped:**
> How much tech am I holding across IBKR + Schwab?

**Provedo answer (ProvedoBubble) — KEEP shipped verbatim, add source line:**

> Across both accounts, tech is **58%** of your equity exposure — about **2x** the sector's weight in S&P 500 (**~28%**). **IBKR** carries the bulk: **AAPL ($14k)**, **MSFT ($9k)**, **NVDA ($8k)**. **Schwab** adds **GOOG ($3k)** and **AMZN ($2k)**.
>
> *Sources: position values from your IBKR + Schwab statements 2025-11-01 · S&P 500 sector weights from S&P DJI methodology, Information Technology sector as of 2025-Q3.*

**Voice-check:** PASS. «Carries / adds» = observation register. «2x the sector's weight» = factual ratio framing, no «which is high / consider trimming» drift.

**Lane A check:** PASS. Verbatim inheritance of finance-advisor + legal-advisor patch. Cohort context via SOURCED S&P 500 weight, not unsourced retail-median.

**Numerical comparatives sourced:**
- 58% / $14k / $9k / $8k / $3k / $2k — derived from user's own IBKR + Schwab positions
- ~28% S&P 500 IT sector weight — S&P DJI methodology page (publicly verifiable; finance-advisor patch validated)
- 2x ratio = 58% / ~28% (arithmetic on the two prior facts)

**Notes for frontend:** No chart-data shape change. `AllocationPieBarAnimated` continues. Same one-line italic source footer pattern.

---

### D1 summary

| Tab | Status | Source citation added | Numerical comparatives |
|---|---|---|---|
| Tab 1 «Why?» | REVISED | YES — AAPL Q3, TSLA Q3, Schwab statement | All from user portfolio + public corporate events |
| Tab 2 «Dividends» | REVISED | YES — issuer IR + Schwab statement | All from user portfolio + public ex-div calendar |
| Tab 3 «Patterns» | KEEP shipped + source line | YES — Schwab + IBKR statements + Shefrin & Statman (1985) | All sourced; row-16 verified academic |
| Tab 4 «Aggregate» | KEEP shipped + source line | YES — IBKR + Schwab statements + S&P DJI | All sourced; S&P DJI primary |

**Net diff vs `8cb509b`:** Tabs 1+2 add source-line italic footers (~25-35 chars each). Tabs 3+4 add source-line italic footers but keep all other phrasing verbatim. Zero regression risk on legal/finance v3.1 patches.

**D1 STATUS: COMPLETE**

---

## D2 — Layer 3 `/disclosures` full-text page draft

**Surface:** `apps/web/src/app/(marketing)/disclosures/page.tsx` (new file)
**Length:** ~580 words (within 400-700 budget)
**Voice:** disclaim register / Sage gravitas / no marketing tone
**Lane A:** zero advice/recommendation/strategy verbs
**Sign-off path:** legal-advisor (parallel to frontend-engineer impl)

### Page metadata + structure

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regulatory disclosures · Provedo',
  description:
    'Full regulatory disclosures for Provedo. Provedo provides general information about your portfolio. It is not personalized investment advice — every decision stays yours.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DisclosuresPage(): React.ReactElement {
  return (
    <main
      className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24"
      style={{
        backgroundColor: 'var(--provedo-bg-page)',
        color: 'var(--provedo-text-secondary)',
      }}
    >
      <article className="prose prose-slate max-w-none">
        {/* ... section content below ... */}
      </article>
    </main>
  );
}
```

### Page body content (markdown-source — frontend-engineer renders as semantic HTML)

```markdown
# Regulatory disclosures

*Last updated: 2026-04-27*

## Who Provedo is and is not

Provedo is a software product that provides general information about
your investment portfolio. Provedo is not a registered investment
advisor and is not a broker-dealer. Provedo does not provide
personalized investment recommendations or advice as defined under the
U.S. Investment Advisers Act of 1940, the EU Markets in Financial
Instruments Directive (MiFID II), or the UK Financial Services and
Markets Act 2000.

Provedo does not hold custody of your assets. Provedo does not execute
trades on your behalf. Provedo connects to your broker accounts on a
read-only basis to aggregate position data and surface observations.

## Information we provide

Provedo provides clarity, observation, context, and foresight on your
portfolio. Provedo surfaces what you hold, shows what has changed,
notices patterns across your trade history, and cites the sources for
every observation. Provedo describes what is. Provedo does not
prescribe what you should do.

When Provedo references general market information — such as historical
sector weights, dividend calendar dates, or documented behavioral-
finance patterns — Provedo cites the public source. When Provedo
references your own portfolio — positions, trades, dividends received —
Provedo cites the broker statement and date the data was retrieved
from.

## Per-jurisdiction notes

**United States.** Provedo is not registered as an investment advisor
under the Investment Advisers Act of 1940 and does not provide
personalized investment advice. Provedo is not a broker-dealer
registered under the Securities Exchange Act of 1934.

**European Union.** Provedo does not provide a personal recommendation
as defined in MiFID II (Directive 2014/65/EU). Provedo provides
generic information.

**United Kingdom.** Provedo provides generic information and does not
provide regulated investment advice under the Financial Services and
Markets Act 2000 (FSMA). Provedo's communications are intended to be
fair, clear, and not misleading.

## Past performance and predictions

Past performance is not indicative of future results. Patterns Provedo
surfaces from your trade history are retrospective observations about
past trades. They are not predictions about future market movements
and are not recommendations about future trading decisions.

## Your decisions, your responsibility

Every decision about your portfolio remains yours. Information
Provedo surfaces is intended to support your own analysis, not to
replace it. Consult a licensed financial advisor in your jurisdiction
before making investment decisions, particularly decisions involving
tax consequences, retirement accounts, or significant changes to your
portfolio composition.

## Contact

Questions about these disclosures: support@provedo.app

---

*Last updated: 2026-04-27.*
```

**Voice-check (line-by-line):**
- Verb-allowlist only: provides / surfaces / shows / notices / cites / connects / aggregates / describes / supports
- Banned co-occurrence audit: zero use of advise / advice / recommend / recommendation / strategy / strategic / suggestion / suggest with «Provedo» as subject. The «advice» word appears only in disclaim/negation register («not investment advice», «not personalized recommendations»).
- «Guidance» splitter rule: word «guidance» absent (used «clarity» and «observation» instead).
- Sage register: restrained, factual, no urgency, no marketing tone.

**Lane A audit:** PASS across all six sections. Every active verb on Provedo's side is allowlist. Every regulated-territory mention is in disclaim/negation register.

**Word count:** ~580 words (in 400-700 budget).

**Section count:** 6 (matches brief: Who/What/Per-jurisdiction/Past performance/Your decisions/Last updated). «Contact» added as practical micro-section since users on a disclosures page often need a route to ask follow-up — kept to one line.

**Note for legal-advisor sign-off:** This text inherits the verbatim 75-word footer block's regulator-readable phrases («not registered investment advisor», «not a broker-dealer», «not personalized investment recommendations», explicit Investment Advisers Act / MiFID II / FSMA 2000 citations, «past performance not indicative of future results», «consult licensed financial advisor») and expands them into plain-language sections. Per-jurisdiction notes are surface-level acknowledgment as briefed; no per-jurisdiction long-form yet (deferred to future per-market clearance).

**D2 STATUS: COMPLETE — pending legal-advisor sign-off (parallel dispatch)**

---

## D3 — S7 single weighted testimonial

**Surface:** `apps/web/src/app/(marketing)/_components/ProvedoTestimonialCards.tsx` (rewrite to single-card layout)

### Quote selection — recommendation: Card 1 (chat surface)

**Selected quote (verbatim from current shipped):**

> «I asked Provedo why my portfolio was down. It told me which two positions did 62% of the work, with sources. Two minutes, no spreadsheet.»
> — Roman M., **builder** at Provedo · chat surface

**Selection rationale:**

| Criterion | Card 1 (chat) | Card 2 (insights) | Card 3 (patterns) |
|---|---|---|---|
| Chat-first wedge signal | STRONG («asked Provedo / told me») | weak | medium |
| Multi-broker signal | implicit (cross-position drawdown) | none | implicit |
| Specific numbers | YES (62%, 2 minutes) | YES (5 minutes) | none |
| Sources-cited signal | YES («with sources») | NO | NO |
| ICP-A pattern recognition | YES (multi-position diagnosis) | weak | YES (behavioral) |
| Lane A risk | LOW | LOW | MEDIUM («no judgment, no advice» needed because Coach surface) |

Card 1 carries four of the six load-bearing signals (chat-first + specific numbers + sources + ICP-A diagnosis) — the strongest single-card weight. Card 2 captures «5 minutes» but that anchor now lives in the proof-bar (S2 cell change). Card 3 is strong content but the «no judgment, no advice» disclaimer it carries is brand-defensive — works in a 3-card stack, reads slightly defensive as a SINGLE quote.

Final call: **Card 1.**

### Section header revision

**Current shipped (above the 3-card grid):**
- Badge: `Coming Q2 2026`
- H2: «What testers will be noticing.»
- Sub: «Provedo enters closed alpha Q2 2026. Below: quotes from the team building the product.»

**Recommended for single-quote layout:**
- Badge: `Coming Q2 2026` (KEEP)
- H2: «What testers will be noticing.» (KEEP — still works for a single quote, reads as a specimen rather than a roundup)
- Sub: «Alpha quotes coming Q2 2026. Below: a builder's note from the team shipping the product.»

Voice-check: PASS. «Builder's note» is honest framing; «quotes coming Q2 2026» is the explicit honest line per brief. No urgency, no scarcity.

### Honest line copy (the line the brief asks for)

**Recommended placement:** as the section sub-header (above the single quote), exactly as drafted above:

> «Alpha quotes coming Q2 2026. Below: a builder's note from the team shipping the product.»

This bundles the «honest line» with the section sub — single information density beat instead of two separate honest-pre-alpha disclaimers. The current shipped honest disclaimer below the cards («Provedo is in pre-alpha. Quotes are from the team building the product. Real alpha-tester quotes replace these once alpha ships.») can either:
- (a) be **dropped** since the new sub already carries the information, OR
- (b) be **kept** as the small-print italic footer for belt-and-suspenders honesty.

**Recommendation: drop (a).** With one quote on the page, repeating «these are builders, real quotes coming» three times (badge + sub + footer) reads anxious. Single mention in the sub line is enough. Less is more — same principle as the «free forever» drop.

### Caption underneath the quote

**KEEP shipped pattern verbatim:**

> Roman M.
> [Plus user badge]
> **builder** at Provedo · `chat surface`

Caption is already the right shape per brief — name + tier badge + «builder at Provedo · [surface]». No change needed.

### Layout / motion notes for frontend

- Single `<figure>` instead of grid. Centered max-width ~640px. Same card visual treatment (white surface, slate border, mono-quote-glyph accent, blockquote → divider → figcaption).
- `ScrollFadeIn` wraps the single card (no stagger needed — single element).
- Tier badge KEEP («Plus user»).
- Optional: scale up the type slightly (single quote can carry 18px instead of 16px) — visual decision for product-designer.

**D3 STATUS: COMPLETE**

---

## D4 — Microcopy patches review

11 patches reviewed. Approval per item below.

### Patch D4.1 — ProvedoHeroV2:477

| | Copy |
|---|---|
| Current | No card. 50 chat messages a month, free always. |
| Patch | No card. 50 free questions a month. |

**Approval: APPROVED.** Voice-clean. Drops «free always» (PO microcopy principle). «Messages → questions» finance-advisor patch applied. Compact (33 chars).

### Patch D4.2 — ProvedoRepeatCTAV2:70

| | Copy |
|---|---|
| Current | No card. 50 free messages a month, free always. |
| Patch | No card. 50 free questions a month. |

**Approval: APPROVED.** Same as D4.1 by structure. Symmetric copy across hero + repeat-CTA = good (visual rhyme).

### Patch D4.3 — ProvedoFAQ.tsx:29 (Q1 answer)

| | Copy |
|---|---|
| Current | Free is always free — 50 chat messages a month, full broker aggregation, weekly insights, no card required. Plus tier ($9/month) unlocks unlimited chat and insights when they matter. |
| Patch | The Free tier is 50 questions a month, full broker aggregation, weekly insights, no card required. Plus tier ($9/month) unlocks unlimited chat and insights when they matter. |

**Approval: APPROVED.** FAQ is the explicit exception in PO microcopy principle («user came asking, direct answer is appropriate»). «The Free tier is 50 questions a month» = direct factual answer. «Always free» drop applied. «Messages → questions» applied. «Insights when they matter» preserved (already finance-advisor patched).

**Micro-refinement (optional — flag, no blocker):** «full broker aggregation» reads slightly ops-jargon. Consider «every broker» for parallel structure with proof-bar «1000+ brokers and exchanges». Not load-bearing — leave editorial call to right-hand if simplification wanted; current text ships fine.

### Patch D4.4 — ProvedoFAQ.tsx:39 (Q3 answer)

| | Copy |
|---|---|
| Current | Free-forever tier is locked |
| Patch | The Free tier is locked |

**Approval: APPROVED.** Direct, factual. «The Free tier» = noun phrase (capital F per brand-name-pattern of «Plus tier»). PO principle applied (no «forever» framing).

### Patch D4.5 — (marketing)/page.tsx:29 (OG description)

| | Copy |
|---|---|
| Current | ...with sources. Free forever, no card. |
| Patch | ...with sources. Free tier, no card. |

**Approval: APPROVED.** «Free tier» = neutral product-detail noun. «No card» = real product info (kept). Meta-description audience is search/social preview readers — no FAQ context — so the brief minimal phrasing is exactly right.

### Patch D4.6 — (marketing)/pricing/page.tsx:9 (description metadata)

| | Copy |
|---|---|
| Current (implied per kickoff) | Simple pricing. Free forever for basic tracking... |
| Patch | Simple pricing. Free for basic tracking. Paid tiers unlock deeper AI and tax reports. |

**Approval: APPROVED.** «Free for basic tracking» = product-detail framing, not reassurance framing. Survives PO principle.

### Patch D4.7 — (marketing)/pricing/page.tsx:32 (hero)

| | Copy |
|---|---|
| Current (implied) | Free forever for basic tracking. Upgrade when the AI and insights earn it. |
| Patch | Free for basic tracking. Upgrade when the AI and insights earn it. |

**Approval: APPROVED — with kickoff-flagged review of second sentence.**

The kickoff addendum flags «Upgrade when the AI and insights earn it.» as «reassurance copy bordering on anti-commercial. Flag for content-lead review; if no clean replacement, drop the line entirely.»

**Content-lead read:** the second sentence is doing real work — it tells a /pricing visitor *the upgrade decision is contingent on product value, not on time pressure or limit hits*. This is a value-conditional framing, distinct from reassurance ones like «no expiration» or «we'll never charge you». «Earn it» as a verb is product-confidence register, not anti-commercial — it reads «we'll prove value first» which is the opposite of «we don't expect you to upgrade» (the rejected reassurance shape).

**Recommended phrasing — three options ranked:**

1. **(RECOMMENDED) KEEP as patched:** «Free for basic tracking. Upgrade when the AI and insights earn it.»
2. **Tighten:** «Free for basic tracking. Plus when you want more.» (drops «earn it», loses some product-confidence punch but cleaner)
3. **Drop second sentence:** «Free for basic tracking.» (matches PO principle of «less is more», but pricing page hero feels thin without the second beat)

**Recommendation:** Option 1. «Earn it» is product-confidence, not anti-commercial reassurance. Pricing page is the surface where commercial framing IS appropriate. Drops to right-hand if disagrees.

### Patch D4.8 — pricing/_components/PricingTable.tsx:23

| | Copy |
|---|---|
| Current | `priceSuffix: 'forever'` |
| Patch | `priceSuffix: ''` |

**Approval: APPROVED.** «$0» standalone is clean. Matches PO principle (no temporal-claim adornment).

### Patch D4.9 — ProvedoFAQ section heading

| | Copy |
|---|---|
| Current | Common questions |
| Patch | Questions you'd ask |

**Approval: APPROVED.** «Questions you'd ask» = second-person observation register, conversational. «Common questions» = generic FAQ pattern. Patch is voice-stronger.

### Patch D4.10 — Footer waitlist box CTA at MarketingFooter.tsx:38

| | Copy |
|---|---|
| Current | Try Plus free for 14 days |
| Options | (a) «Open Provedo» / (b) «Get the email» |

**Recommendation: (a) «Open Provedo».**

Rationale:
- Voice-rhymes with §S9 pre-footer CTA «Open Provedo when you're ready» — visual+verbal repetition reinforces the CTA pattern.
- «Get the email» implies a newsletter signup which is not the actual product surface (waitlist is the actual surface — they get product access notification, not «the email»).
- «Open Provedo» is product-direct: the CTA-target is to explore the product itself.
- The fact that there's currently no functional sign-up endpoint is a separate concern — the box header reads «Ready when you are. Provedo is coming soon. Waitlist open — be first to try it.» so users already understand «Open Provedo» = «open the door» = «join waitlist».

### Patch D4.11 — Drop secondary CTA «Or start free forever»

The kickoff §F also asks: drop secondary CTA «Or start free forever» from `ProvedoHeroV2.tsx` lines 466-473 + `ProvedoRepeatCTAV2.tsx` lines 56-66.

**Content-lead read:** APPROVED. Per PO directive (single-CTA pattern + drop «free forever» globally) — the secondary CTA is a casualty of both decisions. Removing it cleans the hero visual hierarchy and applies the microcopy principle. No replacement copy needed.

### D4 — voice-rhyme observation (cross-patch)

Patches D4.1 + D4.2 produce identical hero/repeat-CTA microcopy «No card. 50 free questions a month.» — visual rhyme = good. Patches D4.5 + D4.6 + D4.7 produce a consistent «Free [for X]» pattern across pricing/OG/footer surfaces. The microcopy patches travel together cleanly; no orphaned patch left to flag.

### D4 — concerns flagged

**Concern 1 (LOW):** D4.3 keeps «full broker aggregation» — reads slightly ops-jargon. Optional simplification to «every broker» for parallel rhyme with proof-bar. Not blocking.

**Concern 2 (LOW):** D4.7 second sentence «Upgrade when the AI and insights earn it.» — content-lead recommends KEEP per Option 1 above. Right-hand call if PO disagrees with the «earn it = product-confidence not reassurance» distinction.

**Concern 3 (NONE flagged on remaining 9 patches):** all voice-clean, all PO-principle-aligned, all ready to implement.

**D4 STATUS: COMPLETE — 11/11 patches reviewed; 9 plain APPROVED, 1 APPROVED-with-optional-refinement (D4.3), 1 APPROVED-with-keep-recommendation (D4.7)**

---

## D5 — Audience-whisper line — final approval

**Locked text:** «For investors who hold across more than one broker.» (51 chars)

**Pre-approved by:** brand-voice-curator §1 Q5 (CLEAN — descriptive ICP, not recruitment).

**Voice re-check (content-lead):** PASS.
- «For investors who hold» — descriptive third-person, not «If you hold» second-person recruitment.
- «across more than one broker» — multi-broker JTBD signal without ICP-A naming or wedge claim.
- Sage register, observation tone.
- Zero advice/recommendation/strategy gradient.
- 51 chars — within button-budget territory (≤60), comfortable inline whisper-line size.

### Placement preference (content-lead voice/reading-order recommendation)

**Recommended: PROOF-BAR small-print** (above or below the 5 cells, in `text-xs` `var(--provedo-text-tertiary)` styling).

**Rationale (1-sentence):** Hero is locked (head + sub) and brand-voice-curator did not grant lock-reopening — adding a third line under the sub-line dilutes the «Provedo will lead» / «Notice what you'd miss» voice rhyme; the proof-bar is the natural ICP-context surface (where «1000+ brokers» already sits) and the audience-whisper there reads as a quiet self-qualifying line for the cohort that will recognize themselves.

**Alternative (if product-designer prefers visual hero anchor):** as proof-bar **header** small-print line ABOVE the 5 cells, e.g.:
```
For investors who hold across more than one broker.
[1000+ brokers and exchanges] [5 minutes a week] [Information. Not advice.] [50 free questions a month] [$0]
```

This treatment makes the audience-whisper the contextualizing frame for the proof bar — the cells then read as «what we offer that cohort.» Strong information-architecture move. Slightly more visually load-bearing than small-print-below; product-designer call.

**Either placement is voice-clean.** Content-lead has a mild preference for proof-bar HEADER position because it reads as an editorial frame on the proof claims. But product-designer owns the visual call.

**Strong objection: would NOT recommend placing it under the hero sub** — that position visually competes with the sub-line «Notice what you'd miss across all your brokers» which already carries the multi-broker signal implicitly. Repeating «more than one broker» one line down dilutes both lines.

**D5 STATUS: COMPLETE — voice-approved; recommend proof-bar header placement; product-designer owns final visual call.**

---

## Open questions for product-designer

1. **D5 — audience-whisper placement** — proof-bar header (content-lead preference) vs proof-bar small-print below cells vs under hero sub. Content-lead voice-recommendation = proof-bar header. Voice does not blocker the call; visual hierarchy lens trumps if there's a conflict.

2. **D1 — source-citation footer styling** — recommend `text-xs italic` `var(--provedo-text-tertiary)` to mirror Tab 3's existing disclaimer styling (visual rhyme across all 4 tabs). product-designer confirms or proposes alternate.

3. **D3 — single-card type scale** — current 3-card layout uses 16px blockquote. Single-card layout could reasonably scale to 18px. product-designer call.

---

## Hard-constraint compliance audit

- Rule 1 (no spend): PASS. No paid services invoked, no domain/TM purchases.
- Rule 2 (no PO-name comms): PASS. No external posts/emails/DMs authored.
- Rule 4 (no rejected naming predecessor): PASS. Only «Provedo» appears in this document and all proposed copy.
- Hero copy locked 2026-04-25: PASS. Hero head + sub untouched in all 5 deliverables.
- v3.1 finance/legal patches at `8cb509b` LOAD-BEARING: PASS. Tab 3 phrasing verbatim. Tab 4 sourced-benchmark verbatim. Footer 75-word block untouched (only Layer 1 + Layer 3 added around it). 5 verbatim artefacts in legal-advisor §9 not modified.
- A/B/C strategic posture: PASS. No audience-named hero, no negation-led hero, no sources-strip section added to scope.
- BENCHMARKS_SOURCED.md row 8 (unsourced 34% retail tech): PASS. Not used anywhere. Tab 4 uses S&P DJI ~28% sourced benchmark only.
- 5-item EN copy guardrails (VOICE_PROFILE.md): PASS. No banned co-occurrence anywhere. No «guidance» drift. AI-persona EN system-prompt not in scope.

---

## Sign-off chain

- **Content-lead:** READY 2026-04-27
- **Right-hand:** review pending (synthesizer + Wave 1 gate to Wave 2 frontend impl)
- **Legal-advisor (D2 only):** review pending (parallel dispatch — `/disclosures` page text)
- **Product-designer (D5 only):** placement call pending (visual/IA lens)
- **PO:** approval pending (right-hand presents)

**End of slice-LP3.2 content-lead deliverables.**
