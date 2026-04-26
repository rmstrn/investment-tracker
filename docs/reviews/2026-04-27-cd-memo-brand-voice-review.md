# CD Memo — Brand-Voice Review

**Author:** brand-voice-curator (independent dispatch, isolated context per Rule 3)
**Date:** 2026-04-27
**Reviewing:** Outside Claude Design memo with proposals A–H (hero sub-extension, hero receipt content, section number eyebrows, proof-bar new cell, S3 negation typographic refactor + reader/noticer/citer affirmations, S6 editorial closing additions with manifesto sources, Tab 4 «Notice» line, marquee replacement).
**Anchors consulted:**
- `docs/product/BRAND_VOICE/VOICE_PROFILE.md` post-Provedo-lock (verb-allowlist, 5-item EN guardrails, 7-criterion rubric, anti-target territory list).
- `docs/product/BRAND_VOICE/REFERENCES_LIVING.md` (15 positive + 12 negative).
- `docs/product/BRAND.md` v1.0 (locked tagline, tone-of-voice surface map, brand-name usage rules §6).
- `docs/reviews/2026-04-27-brand-voice-review-charts-and-hero-chat.md` (own prior approval of PD's hero ChatMockup Proposal A + chart Proposal B).
- Live shipped state via codebase: `apps/web/src/app/(marketing)/_components/ProvedoHeroV2.tsx`, `ProvedoNegationSection.tsx`, `ProvedoNumericProofBar.tsx`, `ProvedoEditorialNarrative.tsx`, `ProvedoAggregationSection.tsx`, `ProvedoDemoTabsV2.tsx`. Vercel preview URL was 401-walled — live HTML inspection deferred to source-of-truth components.

**Constraints honored:** Rule 1 (no spend), Rule 2 (no PO-as-author comms), Rule 3 (verdict independent of CD memo, independent of PD/brand-strategist parallel reviews), Rule 4 (no rejected-predecessor mention).

---

## §0. Method note + critical context

**The shipped state is not what CD's memo assumes in two places.** Verifying CD's proposals against the actual current code reveals:

1. **Hero sub IS already an extension** of the locked tagline. The locked v1.0 BRAND.md tagline is **«Notice what you'd miss»** (5 words). Shipped sub today is **«Notice what you'd miss across all your brokers.»** (8 words). PO accepted the 3-word scope-extension «across all your brokers» 2026-04-25/26 (visible in `ProvedoHeroV2.tsx` line 706 + page.tsx metadata strings line 23 + 27 + 36). CD's framing of the «locked sub» as the 8-word version is correct in practice; CD's «proposed extension» adds 4 more words for a 12-word total. So the question is not «extend the lock» — it is «extend an already-extended version a second time».

2. **CD's «proposed verbatim hero receipt content» is, line-for-line, what is already shipped** in `ProvedoHeroV2.tsx` — `HERO_USER_MESSAGE` (line 30), `HERO_RESPONSE_SEGMENTS` (lines 43-57), `HERO_SOURCES_LINE` (lines 60-61). Brand-voice-curator approved this verbatim 2026-04-27 in the prior review (§2.5, score 9.5/10). CD memo treats this as a new proposal; the more accurate framing is «CD ratifies what shipped 24 hours ago.»

These are not gotchas — they are essential context for ruling on each item. A naive read would be «CD is proposing changes», but on items B + (partly) A the substance of what CD asks for is already-shipped or partially-shipped. The voice ruling differs accordingly.

I review against the locked voice profile, not against CD's framing. Where CD's proposal matches shipped state, I confirm the shipped state holds voice-clean. Where CD adds new content beyond shipped state, I rule on the addition.

---

## §1. Item A — Hero sub modification + supporting copy

### A.1 — Hero sub extension proposal: «Notice what you'd miss across all your brokers — with sources for every observation.»

**Verdict: REJECT extension. KEEP shipped sub as-is.**

**Voice score (proposed extended):** 6.5/10
**Voice score (shipped current):** 8.5/10

The shipped sub already extends the canonical 5-word tagline by 3 words to anchor the multi-broker scope. That extension is justified — it converts the abstract observation-promise into a product-specific scope claim that lands on first read for the ICP-A multi-broker cohort. PO accepted it. **It already costs the brand one extension's worth of dilution to add «across all your brokers».** Adding a second em-dashed clause «with sources for every observation» costs another extension, with diminishing voice return.

Specific voice problems with the proposed double-extension:

1. **Sage compactness violation (C2 in the 7-criterion rubric).** 12 words is at the upper edge of hero-sub Sage-restraint. The Notion / Linear / Anthropic-Console reference cluster runs 4-8 words on the hero sub. 12 words pulls Provedo's hero into the Stripe-marketing-warm cadence the voice profile explicitly rejects.

2. **Redundancy with adjacent surfaces.** The «with sources» promise is already carried by:
   - The shipped chat-mockup sources line directly below the hero text (visible inside the hero region itself).
   - Proof-bar Cell 2 «Every / observation cited / with sources inline» immediately below the hero.
   - The S3 negation closer «With sources for every observation.»
   - Tab 1-4 inline source footers in §S4.
   Repeating the «sources» promise a fifth time in the hero sub is not reinforcement — it is the opposite of the Sage discipline that says «show it once, don't say it twice». The shipped landing already has a textbook three-touch cadence on sources (proof bar → S3 closer → S4 demo). A hero-sub fourth touch over-rotates.

3. **Em-dash + extension cadence drifts toward marketing-explanatory register.** The Sage hero pattern is declarative: tagline, then a short concrete claim, then chat surface. Adding «— with sources for every observation» converts the sub from declarative to *justifying*. Justification language in a hero is a tell of brand-anxiety («let me prove it isn't AI snake-oil»), and it scans as the borrowed Stripe/Brex/Mercury anchor the voice profile rejects in plain text in §«Tone registers to reject».

4. **Verb-allowlist neutral but not strengthening.** «With sources for every observation» uses zero banned words — passes 5-item EN guardrails. But it doesn't strengthen the verb-allowlist either; it just sits there. A neutral addition is not a positive trade in a hero sub at upper-edge length.

**What CD is correctly identifying** is real: the «with sources» claim is the load-bearing trust proposition of the brand and deserves visibility. But the right surface for that visibility is the **chat-mockup sources line directly below**, which is already shipped, animates in after the response completes, and reads as *demonstrated* sources rather than *promised* sources. A demonstrated promise is always Sage-stronger than a stated one. The hero today already does this.

**Lock-extend ruling: DENY-LOCK-EXTEND.** Stronger than mere «do not adopt». The shipped sub is already an extension; the lock has been opened once. Re-opening to extend further sets a precedent where each new pass adds 3-4 words. By v6 the hero sub will be 25 words and the Sage register will be gone. Hold the line at the current shipped extension.

### A.2 — Hero supporting copy: «No card · 50 questions a month · pre-alpha»

**Verdict: REJECT.** Current shipped: «No card. 50 free questions a month.» **Keep shipped.**

**Voice score (proposed):** 6/10
**Voice score (shipped):** 8/10

Three problems with CD's proposal:

1. **«pre-alpha» disclosure does not belong in hero supporting copy.** Pre-alpha status is a transparency claim — appropriate in onboarding modal, in S7 testimonials section («Coming Q2 2026»), in product copy («pre-alpha → public preview»). In the hero supporting copy slot, it functions as a credibility hedge, which Sage-archetype declarative copy explicitly rejects. The Notion/Linear/Anthropic-Console reference cluster does not put product-stage labels in hero supporting copy. PortfolioPilot/Magnifi do, and they read correspondingly weaker.

2. **«50 questions a month» without «free» loses the commercial anchor.** The shipped «50 *free* questions a month» frames the limit as a generous floor (not a paywalled ceiling). Dropping «free» converts it from generosity to constraint. Voice register shifts from Everyman-warm («here's what you get for free») to Sage-clinical («here's the limit»).

3. **Middle-dot (·) separator is a downgrade from periods.** The dot-separated triple reads as a tag-list (think label cloud), not a complete supporting sentence. Shipped «No card. 50 free questions a month.» is two declarative micro-sentences — Sage-restraint at hero-supporting-copy scale. Dot-separated tag-style works in proof-bar cell sub-labels (where it's already deployed); using it in hero supporting copy is genre-bleed.

**Counterproposal (if CD or PO insists on iterating):** keep shipped exactly. If pre-alpha disclosure is felt missing from the page, add it as a dedicated micro-line in S7 testimonials section header (which is already designed to carry the «pre-alpha» context), not in the hero.

---

## §2. Item B — Hero receipt content (CD «verbatim proposal»)

### Verdict: APPROVE — but with critical context.

**Voice score:** 9.5/10 (matches my prior review §2.5).

The content CD proposes verbatim is **already shipped** in `apps/web/src/app/(marketing)/_components/ProvedoHeroV2.tsx`:
- User message at line 30 — verbatim match.
- Response segments at lines 43-57 — verbatim match including all event anchors (Q3 earnings 2025-10-31, delivery miss 2025-10-22), all mono-formatted tickers, all neg-formatted negative percentages.
- Sources line at lines 60-61 — verbatim match including AAPL Q3 earnings, TSLA Q3 delivery report, Schwab statement attribution.

The content was approved via PD's Hero ChatMockup Proposal A in the prior 2026-04-27 brand-voice review, then implemented and shipped. It scored 9.5/10 on first read for these reasons (preserved here for completeness):
- Closes the Magician under-rotation in the hero (the prior numerically-specific-but-causally-empty answer was the largest single voice gap on the page).
- Event anchors carry the Magician-pattern signal (Provedo as foresight-pattern surfacing, not just numerical aggregation).
- Sources line carries the Sage trust-signal (the «Provedo cites» verb is on the allowlist and load-bearing per BRAND.md §6.5).
- Mono-formatted tokens place the demo into the modern-tech-tool 2020s reference cluster (Anthropic Console, Linear, Cursor).

**Versus shipped slice-LP3.4:** equivalent. CD ratifies the shipped state.

**One minor framing concern with CD's memo on this item:** CD presents this as «proposed verbatim», implying it is new. The content is 24-hour-old shipped reality, voice-approved already. Where CD intends to *change* the hero receipt, the memo should be explicit; otherwise the appearance of new-proposal language confuses the review process. Right-hand should clarify whether CD is genuinely proposing alternative receipt content or ratifying current.

---

## §3. Item C — Section numbering eyebrows («01 · The product» etc.)

### Verdict: REJECT.

**Voice score (proposed):** 5/10

CD invokes the «Stripe Press pattern» as justification. This conflates two different design surfaces:

- **Stripe Press** (printed books + book-product landing pages) uses chapter-number eyebrows because it is *literally a book product*. Chapter numbers are content artifacts there, not design decoration.
- **Stripe.com** (product landing pages) does not use «01 · The product / 02 · Proof» numbered section eyebrows. Neither does Vercel, Linear, Notion, Cursor, Anthropic, Granola, Arc, Figma, Raycast — none of the modern-tech-tool 2020s positive-anchor cluster in the voice profile.

The brands that **do** use numbered section eyebrows on landing pages are: Apple investor-relations pages, McKinsey insights, Deloitte thought-leadership, Stripe Atlas guides, Stripe Press. Notice the pattern — those are all editorial/IR/long-form-essay surfaces, not product landings.

Specific voice problems:

1. **Off-archetype.** «01 · The product» reads as institutional / consultant-deck / annual-report register. That is Sage-overdosed-academic territory (Noesis-shape on the anti-target list). Magician + Everyman both subdued. The voice profile explicitly rejects this register in §«Tone registers to reject».

2. **«06 · Brand world» is the most problematic.** Calling out a section as a «Brand world» eyebrow is meta-design talk — it announces «look at our brand world» rather than letting the content carry the brand. That is the *opposite* of the Sage editorial register the locked S6 already achieves. Anthropic.com does not have a «04 · Anthropic's voice» section.

3. **Numbered eyebrows on a landing page imply linearity that the page does not actually have.** Visitors don't read landings linearly — they scan, they jump to the demo, they bounce back to the proof bar. Numbering creates a false promise of «follow these steps in order». Notion/Linear/Vercel/Cursor all design landings as scroll-friendly islands, not numbered chapters, for exactly this reason.

4. **Conflicts with the v3.1 §S2 «Provedo» eyebrow already in use.** The negation section already carries an «PROVEDO» wordmark eyebrow (per the shipped `ProvedoNegationSection.tsx` line 161-167). Layering numbered chapter marks on top creates a double-eyebrow rhythm that is visually noisy and editorially redundant.

**Acceptable narrow alternative if eyebrow scaffolding is felt to be missing on some sections** (not a recommendation, just a fallback if PD/CD push):
- Use **wordmark-style eyebrows** consistent with the §S3 «PROVEDO» pattern, not numbered chapter marks. E.g. «THE BOUNDARY» / «BRAND WORLD» / «PROOF» as small uppercase text eyebrow without leading number. This stays in modern-tech-tool 2020s register.
- Restrict to 3-4 sections maximum. Numbering is the Sage-academic-drift trigger; the bare uppercase eyebrow without a number is the Notion/Linear pattern.

**Composite:** REJECT numbered chapter marks. If section-eyebrow scaffolding is the underlying need, alternative pattern above (no leading number) lands voice-clean.

---

## §4. Item D — Proof bar new cell IV + replacement footer

### D.1 — New cell IV: «<2s · to first answer · on your real holdings»

**Verdict: REJECT.**

**Voice score (proposed):** 4/10

Three independent voice problems:

1. **Performance-claim register is off-archetype.** «<2s to first answer» is a performance-throughput claim — Stripe-aggressive-fintech / dev-tool-perf-marketing register. The voice profile lists this as «fintech-infrastructure-serious-only» drift, explicitly rejected. Notion does not say «answers in 2s», Linear does not say «load-time 200ms» on the hero — these are dev-tool surfaces, not product surfaces.

2. **«on your real holdings» creates a personalization-drift signal.** Per the prior PD Option B review (Lane A risk gradient table §3): cold-traffic copy that invokes «your real holdings» without qualification reads to regulator-aware reviewers as suggesting personalization. Lane A discipline says the page may *demonstrate on user data* (in the chat surface, after the user has provided data) but should not *promise personalization* (in the proof bar before user has provided anything). The shipped Cell 4 «information not advice / no robo-advisor, no brokerage» is the protective canonical phrasing.

3. **Disclaims the product's actual cadence.** Provedo is not optimized for sub-2-second answers. Real LLM responses streaming over multi-broker normalized data are 3-8 seconds. A «<2s» claim would be either misleading (if it triggers regulator/user complaint) or product-design-distorting (if it forces engineering to optimize for a marketing claim instead of answer quality). Brand-voice does not claim things product cannot deliver — Sage discipline.

**Verdict: REJECT.** Keep shipped Cell 4 «100% / information not advice / no robo-advisor, no brokerage». It is the load-bearing Lane A signal cell on the page; replacing it with a perf-marketing claim subtracts from the brand's most-distinctive positioning move.

### D.2 — New footer line: «Information, not advice. No robo-advisor, no brokerage. For investors who hold across more than one broker.»

**Verdict: REJECT as written. APPROVE concept with edit.**

**Voice score (proposed):** 5/10
**Voice score (with edit below):** 8/10

The intent — collapse Lane A disclaimer + audience-whisper into a single line — is reasonable from a CRO/redesign-density standpoint. The problem is execution:

1. **Two distinct semantic frames sandwiched.** «Information, not advice. No robo-advisor, no brokerage.» = Lane A disclaimer-of-status. «For investors who hold across more than one broker.» = ICP description. These are unrelated frames. Reading them concatenated forces the visitor to context-switch mid-line, which is the Sage-restraint anti-pattern.

2. **Run-on register.** Three sentences (two periods + one micro-clause) crammed into a single line read as legalese-drift. Compare:
   - Apple legal footer line — usually 1 frame per line.
   - Anthropic disclaimers — separated by line breaks even when adjacent.
   - Wealthfront's plain-language disclaimer — one sentence, not three.

3. **Loses the shipped audience-whisper's italic register.** Shipped audience-whisper today is italic, max-width 480px, text-tertiary color — a deliberately quiet voice mark (per `ProvedoNumericProofBar.tsx` lines 222-235). Combining into a Lane A-prefixed line removes that quietness; the audience claim suddenly carries weight it should not carry.

**Edit (if combining is felt necessary):**
- Keep audience-whisper as separate italic line (current shipped state). Voice-clean as-is.
- Move «Information, not advice. No robo-advisor, no brokerage.» to a separate plain-text supporting line *under* the proof-bar grid but *above* the audience-whisper italic. Two visual layers, two distinct voice registers, no run-on.

**Or, alternatively (simpler):** keep shipped state exactly. The shipped Cell 4 already carries «information not advice / no robo-advisor, no brokerage» as proof-bar copy; the audience-whisper sits below as a quiet italic. Voice-clean. CD's combined line solves a problem that does not exist in the shipped state.

---

## §5. Item E — S3 negation typographic refactor + reader/noticer/citer affirmations

### E.1 — Negation refactor (em-dash bullets, «What Provedo is not / — A robo-advisor. Won't move money for you.» etc.)

**Verdict: APPROVE-WITH-EDIT.**

**Voice score (as proposed):** 7/10
**Voice score (with edit):** 8.5/10

The structural refactor (extract noun-token + clause description) is voice-improving in three ways:

1. **Reads as Sage-editorial typography (em-dash bullet) rather than dashboard-card-grid.** Em-dash bullets are the Anthropic.com pattern, the Notion changelog pattern, the Linear changelog pattern. Modern-tech-tool 2020s typography. **Voice-clean upgrade.**

2. **Noun-token («A robo-advisor.») makes the negation more declarative and less wordy.** The shipped «Not a robo-advisor / moves money for you» is voice-clean but slightly redundant; refactor «A robo-advisor. Won't move money for you.» tightens.

3. **Mirrors the shipped negation 3-column structure into typographic 3-bullet structure.** Same content, different surface. The current grid+icon+cross-out implementation has a visual-richness budget cost; CD's typographic refactor reads as a *quieter* Sage version. Both are voice-acceptable; the typographic version is slightly more Sage-restrained.

**Edit (LOW severity, voice-tightening):** the «Won't» contraction is colloquial-Everyman register. The voice profile's declarative-Sage register prefers «does not» over «won't». Suggested:
- «A robo-advisor. Does not move money for you.» (instead of «Won't move money for you.»)
- «A brokerage. Does not execute trades.» (instead of «Won't execute trades.»)
- «Advice. Does not tell you what to buy.» (instead of «Won't tell you what to buy.»)

«Does not» is two characters longer per line; readability impact: zero. Voice gain: meaningful — pulls from chatty register to declarative register, which is the load-bearing voice fingerprint move.

### E.2 — Affirmations: «A reader. / A noticer. / A citer.»

**Verdict: REJECT «citer». APPROVE-WITH-EDIT on «reader» and «noticer».**

**Voice score (as proposed):** 5.5/10
**Voice score (with edit):** 7.5/10

Critical voice ruling: **«citer» is not an English word in common usage.** Dictionary check confirms — «citer» is a back-formation from «to cite» that exists only in legal/academic-jargon context, not in product-marketing or modern-tech-tool register. The modern-tech-tool 2020s reference cluster (Notion, Linear, Cursor, Vercel, Anthropic) does not coin agent-noun back-formations from verbs. Notion does not call itself «a writer / a noter / a thinker». Cursor does not call itself «an editor / a coder / a typer». They name themselves with one product-noun, then describe what they do with sentences.

«Citer» specifically:
- **C4 Invented-but-rooted score: 4/10.** «Citer» is theoretically rooted in «to cite» but the root is invisible in everyday English; reads as coined-slug or as legal-jargon. In the verb-allowlist «cites» is on the list (Provedo cites), but the noun «citer» is not. The verb-allowlist is verb-form-specific.
- **C7 Semantic-fit-к-product score: 5/10.** «I'm a citer» does not parse cleanly. Native English speaker reads it twice. Sage-restraint requires single-pass legibility.
- Within the «reader / noticer / citer» triplet, «citer» is the odd one out — «reader» and «noticer» are common English words used naturally; «citer» reads coined and breaks the rhythm.

«Reader» and «noticer» have lighter voice issues but pass:
- **«A reader» — APPROVE.** Common English word; «Provedo reads your portfolio» is allowlist verb-form (reads patterns / reads every broker — both already in shipped landing copy at S6 paragraph 2 and Aggregation section). Persona-fit clean. Sage-archetype clean.
- **«A noticer» — APPROVE-WITH-EDIT-FLAG.** «Noticer» is technically valid English (Macmillan dictionary) but rare in modern product copy. It reads slightly literary / poetic. In the Provedo voice that has «notices» as a load-bearing allowlist verb (from the locked tagline «Notice what you'd miss»), promoting «noticer» as an agent-noun creates a strong voice rhyme with the tagline. **Acceptable, with one watch-flag:** ensure «noticer» is not visually parsed as «notice-r» (typo). Rendering in serif or strong sans should test legibly.

**Suggested replacement for «citer»:** the shipped landing copy already has the right phrasing: **«With sources for every observation.»** as full clause (in the §S3 affirmation closer that's currently shipped). The clause carries the source-citation promise without forcing a coined agent-noun.

**Recommended affirmation triplet (voice-clean):**
- «A reader. Holds your holdings across every broker.»
- «A noticer. Surfaces what would slip past.»
- «A source-keeper. Every observation tied to a source.» **OR** «A witness. Every observation tied to a source.»

Both «source-keeper» and «witness» are common English compounds/words that carry the cite-trail promise without coining a back-formation. «Witness» is the more poetic option (mid-Sage register); «source-keeper» is the more direct option (Magician-craft register). Either is voice-acceptable. **«Citer» is not.**

**Hard rule:** if forced to choose between (a) ship «reader/noticer/citer» as-proposed or (b) keep shipped affirmation closer «What Provedo does: holds your portfolio across every broker, answers what you ask, surfaces what you'd miss. With sources for every observation.» — choose (b). The shipped state is voice-cleaner than the proposed-with-«citer» triplet.

---

## §6. Item F — S6 editorial closing additions

### F.1 — «06 · Brand world» chapter mark

**Verdict: REJECT.** Same reasoning as §3 (Item C); see there.

### F.2 — «— Premise» label

**Verdict: REJECT.**

**Voice score:** 4/10

«— Premise» as a label preceding the editorial section content reads as essay-craft / academic-paper-section-header register. Sage-overdosed-academic territory — directly in the anti-target list of the voice profile. The locked editorial S6 (per BRAND.md §5 + per shipped `ProvedoEditorialNarrative.tsx`) achieves Sage-editorial register through *typography and color* (oversized sans, dark slate-900 full-bleed, italic closer). Adding a meta-label «— Premise» tells the reader «this is a manifesto», which is the opposite of the Sage discipline that *is* a manifesto without announcing itself.

Reference cluster check: Anthropic.com mid-page editorial sections do not have «— Premise» / «— Manifesto» / «— Thesis» labels. Notion does not. Linear does not. Granola does not. The **only** brands that use such labels are essayist/think-tank/IR surfaces (a16z marketing essays, Stripe Press, McKinsey publications). Wrong reference cluster.

### F.3 — Manifesto sources line: «Sources · Pre-alpha JTBD interviews 2026-Q1 · ICP A multi-broker cohort n=24 · ICP B AI-native cohort n=16»

**Verdict: REJECT.**

**Voice score:** 3/10

This is the most problematic single proposal in CD's memo. Three voice failures stack:

1. **Manifesto-with-citations is academic-paper register.** The brand-world / S6 editorial section is *not* a research finding. It is a positioning declaration. Citing JTBD interview sample sizes for a manifesto reads as «we are nervous you might not believe us, here is our research.» Sage-archetype confidence is the *opposite* of this — the manifesto carries its own weight, or it does not belong on the page.

2. **«Performative» — exactly the failure mode the Sage anti-target list calls out.** Per the voice profile: Sage works through restraint (showing, not announcing). Performative-Sage (announcing one's own restraint, citing one's own research) is the failure mode that turns Sage into Noesis-shape register — the academic-philosophical register the voice profile rejects.

3. **Discloses pre-alpha cohort sample sizes (n=24 + n=16) on the public landing.** This is a strategic/legal exposure issue beyond voice scope, but worth flagging: putting interview sample sizes in landing copy (a) signals «small sample size» to sophisticated readers (n=24 + n=16 is fine for early discovery, but reading it as a citation on a manifesto reads as «we have not done the work yet»), (b) creates a public commitment to those exact ICP labels («ICP A multi-broker cohort») that may shift, and (c) invites questions like «what was the interview methodology?» that the brand is not yet prepared to answer publicly. Should be deferred to an `/about` or `/research` page if disclosed at all, with finance-advisor + legal-advisor sign-off.

**Verdict: REJECT.** The manifesto either stands on its own as Sage-editorial (current state) or collapses into academic-research-report register (proposed addition). Hold the line.

---

## §7. Item G — Tab 4 comparison-bars Notice line

### Verdict: APPROVE-WITH-EDIT.

**Voice score (proposed):** 6.5/10
**Voice score (with edit):** 8.5/10

CD proposes: **«Notice / Your tech weight is about 2× the index's — driven by IBKR.»**

The framing intent is voice-correct: explicitly invoke the «notice» verb that is the locked tagline anchor, and ground the data observation in a causal explanation («driven by IBKR»). This rhymes with the brand promise. **Strengthens, not dilutes** — answering CD's own question about repetition.

Two problems with execution:

1. **«Notice» as a section label without further verb is bare.** Reads like a UI affordance label («Notice [bell icon]») rather than a Provedo-voice utterance. The shipped Tab 4 currently has Provedo speak in full-sentence form («Across both accounts, tech is 58% of your equity exposure...»). CD's «Notice / [observation]» format breaks the persona-voice register and converts Provedo from speaker to label-printer.

2. **Loses the source-citation rhythm.** Shipped Tab 4 ends with a Sources footer (`ProvedoDemoTabsV2.tsx` lines 231-235). The «Notice» single-line refactor would either (a) drop the source line — which violates the C7 source-anchor commitment — or (b) keep the source line below a now-truncated single-clause observation, which reads thin.

**Edit:** keep the Provedo persona-voice speaker form, but add an explicit «Provedo notices:» preamble verb to one of the sentences. Suggested:

- Current shipped: «Across both accounts, tech is 58% of your equity exposure — about 2x the sector's weight in S&P 500 (~28%). IBKR carries the bulk: AAPL ($14k), MSFT ($9k), NVDA ($8k). Schwab adds GOOG ($3k) and AMZN ($2k).»
- Voice-tightened: **«Provedo notices:** across both accounts, tech is 58% of your equity exposure — about 2x the sector's weight in S&P 500 (~28%). IBKR carries the bulk: AAPL ($14k), MSFT ($9k), NVDA ($8k). Schwab adds GOOG ($3k) and AMZN ($2k).»

The «Provedo notices:» preamble explicitly invokes the tagline-allowlist verb in agent-subject position (matching the §S5 InsightsBullets pattern), strengthens the brand-promise rhyme CD identified, and preserves the full sentence + source line + chart structure that Tab 4 needs to work as a demo.

**Repetition concern (CD's own question):** «notices» appears in tagline, in proof bar, in §S5 insights, in §S6 manifesto («notices what would slip past»), now in §S4 Tab 4. **Strengthens, does not dilute** — repetition of *one* allowlist verb across surfaces is exactly how brand-voice consolidation works. Anthropic repeats «helpful, harmless, honest» across surfaces; Linear repeats «built for speed»; Notion repeats «one place for...». Brand-voice repetition is feature, not bug. The dilution risk would be repeating *different* synonyms («notices», «spots», «catches», «detects») — that does dilute. Repeating the same allowlist verb does not.

---

## §8. Item H — Marquee replacement

### Verdict: APPROVE-WITH-EDIT.

**Voice score (proposed):** 7/10
**Voice score (with edit):** 8/10

CD proposes typeset list: **«12 brokers · 4 exchanges · 2 wallets · …» + «100s more» tail**

This is a voice-improving replacement for the current shipped marquee (animated horizontal scroll of broker abbreviation cards) for two reasons:

1. **Reduces motion budget.** Current marquee is animated CSS scroll (per `ProvedoAggregationSection.tsx` lines 86-100). It is the most kinetic surface on the page. Replacing animated marquee with static typeset list pulls the motion budget down. Sage-restraint gain.

2. **Typeset numerical breakdown is more *honest* than abstract «hundreds of brokers».** Saying «12 brokers · 4 exchanges · 2 wallets · 100s more» communicates real coverage shape, while «hundreds of brokers and exchanges» is generic-marketing register that the voice profile flags. Specificity > genericity — Sage discipline.

Voice problems with execution:

1. **«100s more» tail register-bleeds with shipped «100s» in proof bar Cell 1.** The proof bar Cell 1 is the canonical «100s» display on the page. Repeating «100s more» in the marquee section creates either (a) confusion («wait, is it 100s or 1000+?») or (b) redundancy. Recommend dropping «100s more» from the tail and using more specific finishing.

2. **Numbers must be verified before shipping.** «12 brokers · 4 exchanges · 2 wallets» are specific claims. Tech-lead + finance-advisor must verify SnapTrade + Plaid + CCXT actually deliver these exact counts. Do not ship a copy claim that engineering then disputes (TD-095 is already open on broker-count verification — same dependency applies here).

**Edit:** keep proposed structure, fix tail. Suggested:

- Current proposed: «12 brokers · 4 exchanges · 2 wallets · … 100s more»
- Voice-tightened: **«12 brokers · 4 exchanges · 2 wallets — and growing.»**

«— and growing.» is honest about the pre-alpha state (the list is genuinely expanding), avoids «100s» repetition, holds Sage-restraint, and signals momentum without performance-marketing register («growing fast!» would over-rotate).

**Composite:** approve replacement-of-marquee in principle, with the «and growing» tail edit, contingent on tech-lead numerical verification.

---

## §9. Cross-cutting voice-fingerprint risk assessment

### 9.1 Combined push of CD's proposals on overall page voice

**Voice-fingerprint risk: WATCH.**

If all CD proposals were adopted as-written, the page would drift from current Magician+Sage+Everyman blend toward a **Sage-overdosed-academic + manifesto-performative** register. Specific drift contributions:

| CD proposal | Drift direction |
|---|---|
| A.1 hero sub double-extension | Stripe-marketing-warm cadence drift |
| A.2 «pre-alpha» in supporting copy | Credibility-hedge / Notion-academic drift |
| C numbered chapter eyebrows | Sage-overdosed-academic / Stripe-Press essay register |
| D.1 «<2s to first answer» | Stripe-aggressive-fintech perf-marketing |
| D.2 run-on combined Lane A + audience footer | Legalese-drift |
| E.2 «citer» coined back-formation | Coined-slug / Lerx-shape territory |
| F.1 «06 · Brand world» eyebrow | Sage-overdosed-academic |
| F.2 «— Premise» label | Sage-overdosed-academic / essay-craft |
| F.3 manifesto sample-size citations | Performative-Sage failure mode |

That is **9 drift signals across one memo**. Individual signals are LOW-MEDIUM each; aggregate is HIGH WATCH. The composite shift is meaningful — adopting all of CD as-written would push the landing into editorial-essay-citation register (the Stripe Press / a16z-essay surface, not the modern-tech-tool 2020s product-landing surface that the voice profile derives from).

### 9.2 Where CD is voice-correct (do not over-discount)

CD also surfaces several real voice-improving opportunities:

- **Item E.1 negation typographic refactor** (em-dash bullet structure with noun-token + clause): voice-positive. Pulls toward Anthropic-mid-page typography pattern.
- **Item G Tab 4 «Notice» framing intent** (explicit allowlist verb invocation grounding the data in causal explanation): voice-positive once the persona-voice form is preserved.
- **Item H marquee replacement** (static typeset numerical breakdown over animated abstract scroll): voice-positive. Specificity over genericity.

These three items are real value-adds. The voice review does not reject CD wholesale — it accepts the structural improvements and rejects the academic-essay-register additions.

### 9.3 Disagreement with CD

Five direct disagreements:

1. **A.1 (hero sub extension).** CD says extension strengthens the «sources for every observation» promise. I disagree: the shipped landing already triple-touches sources (chat mockup line, proof-bar Cell 2, S3 closer); a fourth touch in the hero sub over-rotates and dilutes Sage compactness.
2. **C (numbered chapter eyebrows).** CD invokes Stripe Press as precedent. I disagree: Stripe Press is a book-product landing, not a product landing. None of the modern-tech-tool 2020s reference cluster uses numbered eyebrows on landings.
3. **D.1 («<2s to first answer» cell).** CD frames as performance proof. I disagree: performance-claim register is fintech-aggressive anti-target on the voice profile; the cell it would replace is the load-bearing Lane A signal cell.
4. **E.2 («citer»).** CD frames as parallel agent-noun construction. I disagree: «citer» is not common English; the C4 invented-but-rooted criterion fails; affirmation triplet should use «source-keeper» or «witness» or revert to the shipped clause.
5. **F.3 (manifesto sample-size citations).** CD frames as research-credibility. I disagree: this is the performative-Sage anti-pattern; manifestos do not cite their own JTBD interviews; trust-signal belongs in the chat-mockup demonstrated source line, not in the manifesto.

### 9.4 Disagreement with my own prior position

In the prior 2026-04-27 brand-voice review (charts + hero ChatMockup), I approved Hero ChatMockup Proposal A wholesale. **I do not retract that.** The hero receipt content is voice-clean and remains shipped.

**Reaffirmation, not change of position:** The hero sub today («Notice what you'd miss across all your brokers.») is the maximum extension I support. Any further extension (CD's A.1 proposal) crosses my Sage-compactness threshold for hero sub. This is consistent with my prior position — at the time of the prior review the question of hero sub double-extension was not on the table; today it is, and the answer is no.

---

## §10. Top 3 copy lines to rewrite if CD direction adopted

If PO adopts the CD direction wholesale, the three highest-priority copy rewrites (severity HIGH → LOW):

1. **(HIGH) Hero sub.** Drop the proposed double-extension. Keep shipped state «Notice what you'd miss across all your brokers.» — full stop, no em-dash extension. Single-most-important voice protection on the page.

2. **(HIGH) Affirmation triplet «citer» token.** Replace «A citer. Every observation tied to a source.» with **«A source-keeper. Every observation tied to a source.»** (or «A witness. Every observation tied to a source.»). Coined back-formation rejection.

3. **(MEDIUM) Tab 4 Notice line.** Adopt the «Provedo notices:» preamble form rather than CD's «Notice / [observation]» label form. Preserves persona-voice speaker register that the chat-surface demo depends on.

---

## §11. Final summary

| Item | Verdict | Voice score | Required edit |
|---|---|---|---|
| A.1 Hero sub extension | REJECT | 6.5 (proposed) vs 8.5 (shipped) | Hold shipped state |
| A.2 Hero supporting copy | REJECT | 6 (proposed) vs 8 (shipped) | Hold shipped state |
| B Hero receipt content | APPROVE | 9.5 | Already shipped — voice-clean |
| C Numbered chapter eyebrows | REJECT | 5 | None — drop pattern |
| D.1 Proof bar new cell IV | REJECT | 4 | Hold shipped Cell 4 |
| D.2 Combined Lane A + audience footer | REJECT-WITH-EDIT | 5 (proposed) vs 8 (with edit) | Keep audience-whisper italic separate from any Lane A line; do not run-on |
| E.1 Negation typographic refactor | APPROVE-WITH-EDIT | 7 (proposed) vs 8.5 (with edit) | «Won't» → «Does not» across all three lines |
| E.2 reader/noticer/citer affirmations | REJECT-WITH-EDIT | 5.5 (proposed) vs 7.5 (with edit) | Replace «citer» with «source-keeper» or «witness» |
| F.1 «06 · Brand world» | REJECT | 5 | Drop pattern |
| F.2 «— Premise» label | REJECT | 4 | Drop pattern |
| F.3 Manifesto sample-size citations | REJECT | 3 | Drop pattern |
| G Tab 4 Notice line | APPROVE-WITH-EDIT | 6.5 (proposed) vs 8.5 (with edit) | Use «Provedo notices:» preamble; keep full Provedo speaker sentence form |
| H Marquee replacement | APPROVE-WITH-EDIT | 7 (proposed) vs 8 (with edit) | «100s more» → «and growing»; tech-lead number verification |

**Hero sub modification (A) lock-extend ruling:** **DENY-LOCK-EXTEND.** Shipped sub is already an extension; second extension over-rotates. Hold the line at the current shipped state.

**Voice-fingerprint risk of CD direction overall: WATCH.** Aggregate of 9 drift signals across the memo would push the landing toward Sage-overdosed-academic + manifesto-performative register. Individual signals manageable; aggregate is not. Right-hand should treat CD memo as «3 useful structural improvements + 6 anti-pattern proposals to reject» rather than as wholesale-adopt.

**Lane A status:** CD proposals D.1 («on your real holdings») and D.2 (combined disclaimer) introduce Lane A risk; both rejected. CD proposal F.3 introduces strategic-disclosure risk on pre-alpha cohort sample sizes; rejected. Other items are Lane A neutral.

**Verb-allowlist:** clean across all approved items. «Reader», «noticer», «source-keeper», «witness», «notices» all in or compatible with allowlist. «Citer» not.

**Disagreement with PD or brand-strategist parallel reviews:** I have not seen those parallel reviews (independent dispatch). My ruling is on voice fingerprint independent of their findings; right-hand consolidates.

**Disagreement with CD or my own prior position:** stated in §9.3 + §9.4 above. Five direct disagreements with CD; no retraction of prior approval of shipped Hero ChatMockup Proposal A; reaffirmation that hero sub has reached its compactness limit.

**Next-action recommendation for right-hand:**
1. Take the three approve-with-edit items (E.1, G, H) forward to product-designer + frontend-engineer with the specific edits in §11 table.
2. Hold the seven reject items at right-hand level — do not dispatch to engineering.
3. Item B is no-op — already shipped, ratification only.
4. Surface to PO via right-hand: hero-sub lock is closed at current shipped state; further extension proposals should carry explicit voice review before opening for discussion.

---

**End of brand-voice review on CD memo.**
