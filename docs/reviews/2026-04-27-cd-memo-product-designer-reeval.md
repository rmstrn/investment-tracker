# CD Memo — Independent Product-Designer Re-evaluation (Phase 2.5)

**Author:** product-designer (right-hand dispatch — Rule 3 strategic re-evaluation)
**Date:** 2026-04-27
**Scope:** Independent verdict on outside Claude Design (CD) memo on v3.2 landing. Where CD disagrees with my prior audits (chart-upgrade Proposal B, hero ChatMockup Proposal A), do I — on second look, with shipped code in front of me — agree or disagree?
**Method:**
1. Re-read prior audits + synthesis (R, R-hero, R-synth) without selectivity.
2. Read shipped code at `ca6f53d` (Tab 4 bento) + `56fb9af` (hero polish) — observe what's actually live.
3. Cross-check the demo-tab S4 chat content for Tab 4 to validate CD's «answer says comparison, chart doesn't» read.
4. Independent verdict per question, no deference to CD or to my prior position.

---

## §0 What I observe in the shipped code (grounding)

Before scoring CD's specific proposals, three findings from reading the shipped code that change my evaluation:

### Finding 1 — The Tab 4 chat answer is comparison-shaped, the chart isn't (CD is right on this)

`ProvedoDemoTabsV2.tsx` line 222–230, Tab 4 «aggregate»:

> User: **«How much tech am I holding across IBKR + Schwab?»**
> Provedo: «Across both accounts, tech is **58%** of your equity exposure — about **2x the sector's weight in S&P 500 (~28%)**. IBKR carries the bulk: AAPL ($14k), MSFT ($9k), NVDA ($8k). Schwab adds GOOG ($3k) and AMZN ($2k).»

The answer's load-bearing observation is **«2x S&P weight»** — a comparison. The shipped bento renders:
- Cell A: «By sector» donut → 58% Tech / 18% Fin / 14% Health / 10% Other
- Cell B: «By broker» table → IBKR $186k / Schwab $94k / Coinbase $32k

Neither cell makes the comparison literal. The reader reads «2x S&P weight» and looks for a bar that says «Provedo 58% vs S&P 28%» — and finds a sector pie instead. **CD's structural read on Tab 4 is correct. I missed this in my prior audit.**

### Finding 2 — The bento introduced a fresh data-coherence problem

The shipped data has three incompatible universes:
- **Chat answer named positions:** AAPL $14k + MSFT $9k + NVDA $8k (IBKR) + GOOG $3k + AMZN $2k (Schwab) = $36k tech named
- **Donut center:** $231k total, 58% tech → $134k tech total
- **Broker table sum:** IBKR $186k + Schwab $94k + Coinbase $32k = **$312k**

Three numbers that should be consistent (total tech, total portfolio, broker subtotals) are not consistent. Worse: **Coinbase appears in the broker table but is absent from the chat answer** (which says «Across IBKR + Schwab»). The shipped Tab 4 surface tells two different stories. My prior audit didn't catch this because I evaluated the chart in isolation against the chart-design rubric, not against the chat content above it. **This is a data-integrity miss in my prior audit.**

### Finding 3 — Hero L2 (insight feed) and L3 (broker pie) — re-look

In the shipped hero (`ProvedoHeroV2.tsx`):
- L1 chat surface — high-fidelity, source-cited, mono-formatted, matches §S4 content register ✓
- L2 insight feed — three bullets «Dividend coming · Drawdown forming · Concentration» — generic AI-tool-product-list aesthetic, not a Provedo product surface
- L3 broker pie — standalone donut card at 0.6 opacity, hidden mobile

After reading both my own hero audit §2.6 («the pie L3 reads as orphan chart widget, not portfolio-dashboard mockup») and CD's «sanding a slightly-wrong shape» — they're **converging on the same critique I already wrote** in my own audit. My audit named the L3 problem and then proposed Polish A which doesn't fix L3. **That's an internal inconsistency in my prior audit I didn't see at the time.**

These three findings change the calibration on what follows.

---

## §1 Hero question — was Proposal A wrong?

### 1.1 Steel-man CD's «retire L2+L3, single receipt + 2 footers»

CD's read: the 3-stack invites the eye to read «one product surface» but actually delivers «one credible product surface (chat) + two peripheral artifacts (orphan feed, orphan pie)». Polishing each individually doesn't fix the asymmetric-credibility problem; it makes each individual artifact look better while leaving the composition broken. The honest move is to commit to **one** artifact (the chat receipt), reduce the others to typographic chips/headers (citation chip + digest header), and let the receipt carry the demo.

### 1.2 The strongest counter-argument to retiring L2+L3

The 3-stack carries information the chat alone cannot:
- **Multi-broker proof** (the broker pie visualizes that Provedo aggregates across brokers)
- **Continuous observation proof** (the insight feed visualizes that Provedo doesn't only respond when asked — it watches)
- **Visual depth** (the parallax stack creates the «layered product surfaces» feel that signals «this is a real app, not a marketing mock»)

Reduce to a single chat panel and the hero becomes a chat-product hero, not a portfolio-AI hero. Provedo's positioning lock specifies cross-broker + continuous foresight as load-bearing — collapsing to chat-only loses both.

### 1.3 Does the counter-argument survive on second look?

**Partially. With significant honest erosion.**

- **Multi-broker proof in L3:** the orphan pie at 0.6 opacity, hidden on mobile, is a weak way to carry it. Better carriers exist: a single line in the chat answer («across your IBKR and Schwab»), the proof bar «1000+ brokers» cell, the §S8 marquee. The hero L3 is the third-weakest place to carry the multi-broker signal; promoting it to load-bearing is a stretch.
- **Continuous observation proof in L2:** the «3 items this week» feed signals «product runs in background» — but only if the reader notices it's a feed, not a chat reply. At 0.92 opacity, smaller, off-axis from the chat, casual readers will register it as «more chat». The signal CD claims it sends doesn't reliably arrive.
- **Visual depth:** real, but parallax depth can be carried by a single artifact with subtle shadow + 1–2 background elements (citation chip + digest header per CD's proposal). Doesn't require 3 product surfaces.

The counter-argument survives at maybe 40% strength. CD's read survives at maybe 60% strength. **I am updating.**

### 1.4 Independent verdict — hero

**HYBRID — Proposal A was 60% right but 40% wrong, and I missed the 40%.**

Proposal A was correct on every detail it addressed (content fidelity, mono tokens, sources line, motion polish, replay-on-intersection). What's already shipped at `56fb9af` is genuinely better than what existed before. **Do not undo the shipped polish.**

But Proposal A was scoped to the chat surface alone — it did not address the L2/L3 asymmetric-credibility problem I named in my own audit §2.6. CD's «single receipt + 2 typographic footers» is a coherent fix to that gap and I should have proposed it as Proposal A+ or B-redux.

**Recommended forward move:**
- **Keep** the shipped chat polish at `56fb9af` (Proposal A is shipped, working, voice-correct, brand-correct).
- **Add** a follow-on slice that treats L2 and L3 as typographic system primitives, not product mockups:
  - Replace L2 «InsightFeedMockup» with a `DigestHeader` typographic primitive: «**This week** — 3 observations across your portfolio.» Single line, italic, tertiary text, sits as a header above the chat receipt OR as a small caption below it.
  - Replace L3 «BrokerPieMockup» with a `CitationChip` typographic primitive: «**3 brokers** · IBKR · Schwab · Coinbase» with monospace ticker chips. Sits as a footer below the chat receipt.
  - Result: chat receipt reads as **the** product moment; digest + citation chips as quiet typographic context; no orphan chart widgets.

This is not «Proposal A was wrong». It's «Proposal A was correct in scope and incomplete in scope» — the L2/L3 fix is a separate slice.

### 1.5 Disagreement with CD on hero

CD says «retire L2 + L3 in favor of single receipt + 2 quiet footers». I agree on retire-L2-L3 architecture. **I disagree on the framing.** The L2 replacement should be a **digest header** (positions Provedo as the observer who summarizes a week), not a generic «typographic primitive». The L3 replacement should be a **citation chip** that reinforces the source-cite trust signal (which IS Provedo's load-bearing brand differentiator). Both elements should encode brand meaning, not just visual depth.

Concrete language: don't call them «footers». Call them **the digest** (above) and **the sources** (below). Both have brand meaning; «footer» does not.

---

## §2 Tab 4 question — was bento optimal?

### 2.1 Independent verdict — Tab 4

**COMPARISON-BARS-IS-BETTER. My bento was wrong.**

I'm updating my Proposal B Tab 4 stance hard. Three reasons:

**Reason 1 — Chart must serve the chat answer, not stand alone.**
The chat answer's load-bearing claim is **«about 2× the sector's weight in S&P 500 (~28%)»**. The chart's job is to make that claim visually irrefutable. Comparison-bars (your sector mix vs S&P 500 sector mix, on the same axis) makes the comparison literal in a way no donut can. My bento ships a sector donut + a broker table — neither of which contains the S&P benchmark at all. The chart and the chat answer are speaking past each other.

**Reason 2 — The data-coherence problem I missed.**
The shipped bento has IBKR $186k + Schwab $94k + Coinbase $32k = $312k, but the donut center says $231k total, but the chat answer references only IBKR + Schwab named positions summing to $36k of tech against an implied $134k tech. **Three incompatible numbers in one tab.** Comparison-bars sidesteps this entirely: portfolio-tech-weight (58%) vs S&P-tech-weight (28%) needs only one number from each side. No broker table. No Coinbase contradiction. No total-vs-sum mismatch. The architecture problem disappears with the bento.

**Reason 3 — Brand-fit.**
Sage register favors **one observation that matters** over **many numbers in a card**. Comparison-bars is the cleanest possible expression of «Provedo noticed a thing that's surprising»: «Your tech weight is 2× the market.» Two bars, one comparison, one observation. My bento was **denser** than the original packed combo on per-cell-item basis (legend $-amounts + 3 broker rows + caption + headers); CD's comparison-bars is sparse in exactly the way Sage demands.

### 2.2 What CD got slightly wrong / what to refine

- CD says «2 stacked comparison bars». I'd specify: **one horizontal pair**, your-portfolio (58%) on top + S&P-benchmark (28%) below, same horizontal scale, brand teal for portfolio + neutral slate-tertiary for benchmark. Single mono numeral on each bar. No legend (the bar labels carry it).
- The «By broker» information shouldn't disappear entirely — it's load-bearing for the cross-broker positioning. But it belongs in the chat answer text (which already mentions IBKR and Schwab) or as a one-line footer caption: **«Across IBKR ($186k) and Schwab ($94k).»** Coinbase is the spurious data — drop it, since it's not in the chat answer.
- Sources line stays (already shipped, brand-correct).

### 2.3 Disagreement with my prior position on Tab 4

Stated directly: **My Proposal B Tab 4 bento was wrong.** I evaluated «is the chart cluttered?» and answered «yes, split it into two cleaner cells» — but I should have evaluated «does the chart serve the chat claim?» and answered «no, restructure the chart to match the comparison the chat is making». I optimized for chart-design rubric in isolation when the right rubric was chart-as-evidence-for-text-claim.

This is the most important update in this re-evaluation. The shipped bento is better than the original packed combo, but the comparison-bars approach is materially better than the bento. **Right move forward: replace the shipped bento with comparison-bars in a follow-on slice.**

---

## §3 Smaller CD proposals — quick verdicts

### 3.1 «Sources:» as system typographic primitive

**ADOPT.** Effort low (~2h frontend-engineer + 0.5h product-designer spec). The §S4 already has a `<Sources>` component and the hero already inlines a sources line at `56fb9af`. Promoting to a documented typographic primitive (consistent treatment: italic, tertiary text, ~12px, leading-1.5, prefix «Sources:» in semibold) and applying it to every observational claim on the page (not just chat answers — also S5 insights, S8 broker count, S9 FAQ Q3) would systematize the source-cite trust signal Provedo's brand depends on. **This is the highest-ROI of CD's smaller proposals.** It encodes Provedo's load-bearing trust differentiator (cite trail) as a visual system, not a one-off treatment.

### 3.2 Negation S3 typeset «is not / is» columns, drop lucide + red-X

**EDIT-AND-ADOPT.** I agree with dropping lucide red-X — the iconography over-decorates a typographic moment that should carry itself (R3 §6.11 already noted the meta-header should strip away). I'd refine CD's «is not / is» columns to a single typeset block, three lines, with the negation in normal weight + the affirmation closer in semibold. Two-column layout risks reading as «pros vs cons» which is a sales register Provedo shouldn't borrow. Single column, three negation sentences, then one affirmation sentence as semibold paragraph break, reads as Sage gravitas without binary-comparison framing. **Voice-cleanness check: passes if implemented as single column.**

### 3.3 Proof bar disclaimer move + new <2s cell

**REJECT in current form, EDIT-AND-ADOPT in revised form.**

CD's proposal: move the «Information. Not advice.» disclaimer from a proof-bar cell to an italic footer line below the proof bar; recover the freed cell for «<2s to first answer».

**Reject the «<2s to first answer» replacement.** This is a performance claim that (a) we cannot verify pre-alpha (no real data), (b) is not Sage register («fast answer» is Hero/Outlaw productivity-cult register), (c) opens an unforced Lane A side-door (speed-of-answer implies trading-decision-relevance which is one step from advice). The unverifiable speed-claim alone is grounds for rejection.

**Adopt the disclaimer-move structurally**, but use the freed cell for **«Sources for every answer»** instead. This:
- Is Sage register (epistemic claim, not productivity claim)
- Is verifiable (we can show the receipt — Tab 1 + 2 + 3 + 4 + hero all show sources lines)
- Reinforces Provedo's load-bearing trust signal exactly where cold traffic reads the proof bar
- Brand-correct, Lane A safe, unverifiable-claim safe

**Brand-correct verdict on the disclaimer footer move:** acceptable structurally — italic small-print under proof bar is fine for «Information. Not advice.» so long as it remains visually present (not collapsed). Legal-advisor sign-off recommended on whether the «Information. Not advice.» line moving from a peer-cell to a footer-line meaningfully changes regulator-readability. My read: minimal change, but legal should rule.

### 3.4 Section numbering eyebrows «01 · The product» Stripe Press style

**REJECT.**

This is the most over-decorated of CD's proposals. Three reasons:
- Section numbering is **Stripe Press editorial-magazine register**. Stripe Press uses it because their content IS magazine-format multi-essay collections. Provedo's landing is a single-page product narrative, not a magazine.
- Numbered eyebrows pull attention to **structure** (you're now reading section 04 of N), which is the opposite of what calm-over-busy demands. Reader should be in the content, not aware of the chapter mechanics.
- Stripe Press numbering is a **distinctive house style** that signals «I am Stripe Press». Adopting it on a fintech-AI landing would read as borrowed-aesthetic — pulls toward the «design-template-by-numbers» anti-pattern (web/design-quality.md «Banned Patterns» list).

If CD's underlying intent was «sections need clearer differentiation», the right move is **typographic eyebrows without numbers** (small-caps tertiary-color label like «THE PRODUCT» / «WHAT IT IS NOT» / «WHAT YOU CAN ASK») — closer to Anthropic.com section labels, which are house-style for craft, not for chapter mechanics. But this is an evolution of v4 editorial direction, not a v3.2 patch.

### 3.5 Marquee → typeset list

**EDIT-AND-ADOPT.**

CD's read: replace the `s8 broker marquee` (animated horizontal scroll of broker names) with a typeset 3-column list of representative brokers + count line.

I agree the marquee is **over-decorated for the trust signal it carries**. A scrolling list of broker names asks the reader to wait-and-watch for proof, which is a weak way to deliver «we support 1000+ brokers». A typeset 3-column list is calmer and reads faster.

But: «loses any signal?» — yes, slightly. The marquee carries the visual rhythm signal of «there are MANY of these — they keep coming». A static list of N brokers caps perceived scope at N. The fix: typeset list of 12–15 representative brokers + a closing line «**+ 985 more**» (or actual verified number). Carries the visual scope signal without animation.

Also: the marquee currently animates `transform: translateX()` which is compositor-friendly, motion-rule compliant. Removing it doesn't free a motion-budget violation; it's an aesthetic call. **Net: adopt with the «+ N more» refinement, not a pure list.**

---

## §4 Sequencing — all-in-one PR vs staged?

**STAGED-2-SLICES.** Specifically:

### 4.1 Slice LP3.5 — small wins (next 2–4 days)

Ship as one PR. Low structural risk, immediate visible quality lift, no dependencies on validators:

1. Sources as system typographic primitive (§3.1 above)
2. Negation S3 typeset cleanup, drop lucide icons (§3.2 above)
3. Proof bar disclaimer move + replace freed cell with «Sources for every answer» (§3.3 above, NOT «<2s»)
4. Marquee → typeset list with «+ N more» line (§3.5 above)
5. **Tab 4 chart replacement: bento → comparison-bars** (§2 above)
6. Tab 4 data-coherence fix: drop Coinbase from broker table (or restructure broker info as one-line caption under comparison-bars)

Rough scope: 12–18h frontend-engineer + 4–6h product-designer + 1–2h brand-voice-curator review of comparison-bar copy + 1h legal-advisor sign-off on disclaimer-move position.

### 4.2 Slice LP3.6 — hero composition restructure (1–2 weeks after LP3.5)

Higher-stakes, brand-territory move; needs phase-3 validator coordination:

1. Retire L2 InsightFeedMockup → replace with `DigestHeader` typographic primitive
2. Retire L3 BrokerPieMockup → replace with `CitationChip` typographic primitive
3. Reposition chat receipt as **the** hero artifact with digest above + citation below
4. Re-spec parallax (now 2 thin elements + 1 main artifact instead of 3 surfaces)
5. Re-spec mobile (chat receipt + digest + citation all visible mobile, not L2/L3 hide-behavior)

Rough scope: 8–12h product-designer (spec) + 12–16h frontend-engineer + 2–3h brand-voice-curator (digest + citation copy review) + 2h a11y-architect (reading order audit). Phase-3 validator review on hero-architecture change recommended (I view this as analogous to a hero-re-lock decision; PO directive 2026-04-25 locked the current 3-stack hero, so retiring L2+L3 is **partial-unlock that needs PO authorization**).

### 4.3 Why staged not all-in

- **Validator dependency mismatch.** LP3.5 needs only brand-voice + legal sign-off (low cost, fast turnaround). LP3.6 needs PO authorization on hero-lock partial-reopen + brand-strategist input on whether retiring L2/L3 changes the multi-broker/continuous-observation positioning carriers. Different turnaround clocks.
- **Risk surface.** LP3.5 is structurally low-risk (chart restructure + typographic systematization + 4 small-section polish). LP3.6 is hero-architecture restructure — the highest-stakes single move on the page. Bundling them risks LP3.6 blocking LP3.5's faster wins, and risks a single-PR scope where any reviewer's disagreement on hero-architecture stalls the chart fix.
- **Reversibility.** LP3.5 is fully reversible if any element underperforms. LP3.6 is brand-territory-shaping; once shipped, retreating reads as walking-back-confidence (same dynamic as Option C in synthesis §4 trade-off 2).
- **PO observability.** Two slices = two cycles of PO observation + course-correction. One slice = one cycle. For a redesign-in-flight where PO has shown active steering (chat audit + chart audit + CD memo all in 48h), more cycles = better steering surface.

### 4.4 What I disagree with CD on for sequencing

CD proposes «1 PR, 1 week». I disagree. The hero retire-L2-L3 move is structurally analogous to a positioning-architecture change and merits its own slice with phase-3 validator coordination. Bundling it into a single sprint week creates a PR that's too high-stakes to ship calmly. Slice discipline says: ship the small wins first, observe, then ship the bigger move. CD's preferred all-in-one cadence reads to me as «designer-velocity» discipline, not «product-team-with-validators» discipline.

---

## §5 Synthesis table

| Question | My prior position | CD's position | My re-evaluated verdict | Update direction |
|---|---|---|---|---|
| Hero architecture | Polish 3-stack (Proposal A) | Retire L2+L3, single receipt + 2 footers | **HYBRID:** Keep shipped polish; add follow-on slice retiring L2+L3 with digest header + citation chip replacing them | Update toward CD ~60% |
| Tab 4 chart | Bento (Proposal B) | Comparison-bars (your sector vs S&P) | **COMPARISON-BARS.** Bento doesn't serve the chat claim; comparison-bars makes «2× S&P» literal. Also fixes data-coherence problem. | Hard update toward CD |
| Sources as system primitive | Not in audit | Adopt | **ADOPT.** Highest ROI of CD's smaller proposals. Encodes load-bearing trust signal as visual system. | Adopt CD |
| Negation typeset, drop lucide | Not in audit | Two-column «is not / is» | **EDIT-AND-ADOPT** as single column, not two — two-column risks pros/cons sales register | Adopt CD with refinement |
| Proof bar disclaimer move + <2s cell | Not in audit | Move disclaimer to footer; recover cell for «<2s» | **EDIT-AND-ADOPT** disclaimer move; **REJECT** «<2s» (unverifiable + Hero register); replace freed cell with «Sources for every answer» | Partial adopt CD with substitution |
| Section numbering eyebrows | Not in audit | Adopt Stripe Press style | **REJECT.** Borrowed-aesthetic anti-pattern; over-decoration; pulls reader to structure not content | Disagree with CD |
| Marquee → typeset list | Not in audit | Adopt | **EDIT-AND-ADOPT** as typeset list with «+ N more» closing line, preserves perceived-scope signal | Adopt CD with refinement |
| Sequencing | Not in audit | All-in single PR, 1 week | **STAGED 2-SLICE:** LP3.5 small-wins + comparison-bars; LP3.6 hero-retire-L2-L3 with PO + validator coordination | Disagree with CD |

---

## §6 What I disagree with CD on, summarized

1. **«Footers» framing for hero L2+L3 replacement.** Call them digest (header) + citation (footer) — both encode brand meaning; «footer» understates them.
2. **«<2s to first answer» proof-bar cell.** Unverifiable performance claim; wrong register (Hero/Outlaw, not Sage); Lane A side-door risk. Replace with «Sources for every answer» instead.
3. **Stripe Press section numbering.** Borrowed-aesthetic; pulls attention to structure; adopt typographic eyebrows without numbers if differentiation is needed.
4. **Marquee pure-list replacement.** Loses the perceived-scope signal. Add closing «+ N more» line to recover it.
5. **All-in-one-PR sequencing.** The hero-retire-L2-L3 move is brand-territory-shaping and merits its own slice with PO authorization + phase-3 validator coordination. Staged ship is the right slice discipline.
6. **Negation two-column layout.** Reads as pros/cons sales register; single column with affirmation closer is the Sage-correct treatment.

## §7 What I disagree with my prior position on, summarized (the honest part)

1. **Tab 4 bento was wrong.** I evaluated chart-design-rubric in isolation; I should have evaluated chart-as-evidence-for-chat-claim. Comparison-bars is the right architecture. The shipped bento should be replaced.
2. **Data-coherence missed in Tab 4 audit.** Three numeric universes (chat-named-positions $36k vs donut $134k tech vs broker-sum $312k) coexist in the same tab. I didn't catch it because I evaluated the chart in isolation, not paired with the chat answer above it.
3. **Hero L2/L3 problem named but not solved in my own audit.** My §2.6 hero audit explicitly named «asymmetric mockup credibility» but Proposal A scoped only the chat surface. I should have either (a) flagged the L2/L3 problem as a separate proposal, or (b) made Proposal A architecturally include retiring or restructuring L2/L3. CD reads the gap I left.

## §8 What CD missed (small)

1. **The «delivery miss» phrasing in shipped chat content** is brand-voice-locked verbatim per the brand-voice review §2.5; CD memo doesn't reference this — any restructure of the chat receipt must preserve it.
2. **The Tab 3 simultaneous-animation patch from `8cb509b`** (finance/legal v3.1 patch) is load-bearing and CD memo doesn't reference it; comparison-bars implementation for Tab 4 must not undo Tab 3's patch by accidentally restoring narrative-causation animation patterns.
3. **The 5 motion rules** are specifically named in Slice-LP3.3 commit message; CD memo doesn't reference them. Any new comparison-bars animation must respect: compositor-friendly props only, ≤600ms entrance budget, ≤3 simultaneous animations, prefers-reduced-motion respected, no narrative-causation drift.

## §9 Process note on my own audits

The pattern across the two re-evaluations (Tab 4 + hero):
- Both audits scored against design-rubric-in-isolation (chart-design polish · chat-surface polish).
- Neither scored against **content-claim-coherence** (does the chart serve the chat answer? does the hero stack tell one product story?).
- This is a recurring blindspot in design audits: optimizing per-element without auditing whether the elements compose coherently.

For future right-hand dispatches, I should add a **«does this artifact serve the brand-claim it sits next to?»** check as the first audit step, before per-element rubric scoring. CD's memo did this implicitly (sees the «2× S&P» claim, asks where the chart shows it) and that's where their stronger reads come from.

---

**END cd-memo-product-designer-reeval.md**
