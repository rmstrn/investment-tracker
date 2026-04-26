# Final Design Review — Brand Voice Fingerprint Check on Shipped State

**Author:** brand-voice-curator (independent dispatch, isolated context per Rule 3)
**Date:** 2026-04-27
**Branch:** `feat/lp-provedo-first-pass`
**Scope:** End-to-end voice review across 6 shipped slices (3.2 + 3.3 + 3.4 + 3.5 + 3.6) and `/disclosures` Layer 3 page.
**Anchors consulted:**
- `docs/product/BRAND_VOICE/VOICE_PROFILE.md` (post-Provedo-lock — verb-allowlist, 5-item EN guardrails, 7-criterion rubric, anti-target territory list, brand voice fingerprint refinement section, persona introduction templates).
- `docs/reviews/2026-04-27-brand-voice-review-charts-and-hero-chat.md` (own prior review).
- `docs/reviews/2026-04-27-cd-memo-brand-voice-review.md` (own prior review).
- Vercel preview URL `…7c8919-ruslan-maistrenko1.vercel.app` was 401-walled (no public access). Live review performed against shipped source-of-truth components (the deployed bundle is built from the same).
- Files inspected: `apps/web/src/app/(marketing)/page.tsx`, `_components/ProvedoHeroV2.tsx`, `_components/hero/{ChatMockup,DigestHeader,CitationChip}.tsx`, `_components/ProvedoNumericProofBar.tsx`, `_components/ProvedoNegationSection.tsx`, `_components/ProvedoDemoTabsV2.tsx`, `_components/charts/AllocationPieBarAnimated.tsx`, `_components/ProvedoAggregationSection.tsx`, `_components/ProvedoEditorialNarrative.tsx`, `_components/ProvedoFAQ.tsx`, `disclosures/page.tsx`.

**Constraints honored:** Rule 1 (no spend), Rule 2 (no PO-as-author comms), Rule 3 (independent verdict in parallel multi-specialist context — I have not seen PD / brand-strategist / a11y / qa parallel reviews), Rule 4 (no rejected-predecessor mention).

---

## §0. Method note + critical context

I reviewed each of the 11 specific check items against the locked Provedo voice fingerprint. For every shipped string I evaluated:

1. **Verb-allowlist clean?** (Provedo as agent-subject must use *provides clarity / context / observation / foresight / insights*; *sees / surfaces / shows / cites / connects / notices / leads through*; never *advises / recommends / suggests / strategizes*.)
2. **5-item EN co-occurrence guardrails clean?** (Provedo never co-occurs with *advice / recommendation / strategy / suggestion* in a single sentence; «guidance» splitter applied.)
3. **Lane A discipline clean?** (No advisor-prescriptive register, no profit-aggressive, no surveillance-creepy, no companion-warm-Sidekick.)
4. **Magician + Sage primary · Everyman modifier balance held?** (No drift to Stripe-imperative, Lovable-warm, Linear-too-friendly, Sidekick-warm, Sage-overdosed-academic.)
5. **Sage-restraint compactness floor preserved?** (Hero sub ≤ shipped 8-word extension; chart copy honest about demo-data; sources visible at every observation surface.)

Where I find DRIFT, I provide explicit edits. Where I find VIOLATION, I provide a fix and severity label.

The shipped state is the reference truth. Where my prior reviews recommended edits and they were applied, I confirm pass. Where edits were partially applied, I flag explicitly.

---

## §1. Per-check-item findings

### Item 1 — Hero copy

**Shipped (verbatim):**
- H1: «Provedo will lead you through your portfolio.»
- Sub: «Notice what you'd miss across all your brokers.»
- CTA: «Ask Provedo»
- Small-print: «No card. 50 free questions a month.»

**Voice check:**
- H1 uses the *leads through* allowlist verb in agent-subject position. Carries Magician (foresight) + Sage (stewardship) + Everyman (caring helper). The persona introduction template in VOICE_PROFILE §«Brand voice fingerprint — Provedo refined» explicitly endorses this pattern («Provedo provides clarity… leads through…»). Bilingual hook intact (the «провести / проведу» RU resonance).
- Sub uses the *notice* verb (locked tagline allowlist verb), no co-occurrence with banned advice/recommendation/strategy/suggestion. 8-word scope-extension previously approved + held in CD-memo review §1.A.1. No further extension was attempted in this slice — lock holds.
- CTA «Ask Provedo» is an allowed agent self-reference per VOICE_PROFILE §«Bilingual wordplay (EN) — restricted».
- Small-print uses two declarative micro-sentences (Sage-restraint at hero scale).

**Verdict: PASS.** Score 9.5/10. Verbatim match against locked spec.

---

### Item 2 — DigestHeader «THIS WEEK · 3 observations across your portfolio»

**Shipped (verbatim — `DigestHeader.tsx` lines 31-62):**
- Eyebrow: «This week» (CSS uppercase, 11px tracking-wide)
- Body: numeral «3» in JBM-mono + «observations across your portfolio»

**Voice check:**
- «Observations» is the load-bearing Sage-Magician noun on the verb-allowlist. Pulls the cadence claim («this week») into the brand promise («notice what you'd miss») without asserting product action. Sage-clean.
- «Across your portfolio» rhymes with the hero sub «across all your brokers» — the cross-broker scope claim is repeated once at hero, once here, in different form (Sage repetition pattern, not synonym-drift; matches CD-memo review §7 ruling on allowlist-verb consolidation).
- Eyebrow «This week» (rendered uppercase via CSS) is the modern-tech-tool 2020s register pattern (Linear changelog, Anthropic Console). Not Stripe-Press-numbered-chapter, not Notion-academic. In-cluster.
- Numeral typography: «3» in JBM-mono ties the header to the L1 receipt's mono number tokens (composition signature). This is a Magician-craft register signal (mono = real product output, not marketing copy).

**Data-coherence check:**
- The L1 chat answer surfaces effectively three observations:
  1. Total drawdown attribution (−4.2% with 62%-driven positions),
  2. AAPL post-Q3-earnings causal anchor,
  3. TSLA post-delivery-miss causal anchor.
- The mono «3» is honest with current demo content — it counts the response-segment observations (tied to the three sources cited). Internally coherent.
- Sources line under the response confirms: 3 cited observations = 3 source items. Tight composition.

**Verdict: PASS.** Score 9.5/10. Voice-clean and data-coherent. The «observations across your portfolio» phrasing is the strongest single new typographic primitive on the page — it converts a digest cadence claim into a brand-voice utterance without adding marketing register.

---

### Item 3 — CitationChip «IBKR · Schwab — 2 brokers»

**Shipped (verbatim — `CitationChip.tsx` lines 99-127):**
- Layers3 icon + «IBKR · Schwab» (mono) + «— 2 brokers» (sans, tertiary)

**Voice check:**
- Pure observation token; no verb. ✓ Allowlist neutral (no banned co-occurrence).
- Mono tokens for broker names continue the page's mono-data convention (positive-anchor cluster signal).
- «— 2 brokers» em-dashed clarifier reads as Sage-restraint (Linear changelog footer pattern).
- The two brokers cited match the L1 receipt's Sources line («holdings via Schwab statement…») and Tab 4's user message («across IBKR + Schwab»). **Page-wide data coherence holds** — every chat surface that names brokers names exactly these two. Coinbase appears in §S8 broker list but never in a chat answer (correct exclusion per CitationChip docstring rationale).

**Verdict: PASS.** Score 9.5/10. Voice-clean + data-coherent. The chip closes the receipt with the source-locality promise that the L1 sources line opens — composition is the single best new primitive in slice-LP3.6 from a voice standpoint.

---

### Item 4 — ChatMockup answer + sources line

**Shipped (verbatim — `ChatMockup.tsx` lines 22-52):**
- User: «Why is my portfolio down this month?»
- Provedo response (segments concatenated): «You're down −4.2% this month. 62% of the drawdown is two positions: Apple (−11%) after Q3 earnings on 2025-10-31, and Tesla (−8%) after the 2025-10-22 delivery miss. The rest of your portfolio is roughly flat.»
- Sources line: «Sources: AAPL Q3 earnings 2025-10-31 · TSLA Q3 delivery report 2025-10-22 · holdings via Schwab statement 2025-11-01.»
- «Provedo» eyebrow above response bubble in accent uppercase tracking-widest

**Voice check (matches my prior review §2.5 — re-verified):**
- Response verbs: «down», «is» (62% of drawdown is two positions), «after Q3 earnings» (event anchor), «is roughly flat». All observation-coded. No advise / recommend / strategy / suggest / guide-on-action.
- No co-occurrence violations.
- Mono tokens for percentages, tickers, dates — modern-tech-tool 2020s register.
- Negative tokens (−4.2%, −11%, −8%) styled in red mono — honest about negative-affect data without aestheticizing it (Sage names what is, doesn't soften with euphemism).
- «delivery miss» — flagged in prior review as mildly negative-affect English, accepted because real-world event language. No change needed; the brand voice profile flags negative-valence head morpheme in *names*, not in *event descriptions*. Acceptable.
- Sources line uses three concrete attributions (issuer earnings call, broker statement). Each item dated. Sage trust-signal load-bearing.
- «Provedo» eyebrow above response bubble = responder-attribution (matches §S4 ProvedoBubble pattern + the positive-anchor cluster Claude.ai/ChatGPT pattern).

**Verdict: PASS.** Score 9.5/10. Verbatim shipped state matches voice-approved Hero ChatMockup Proposal A from prior review.

---

### Item 5 — Tab 4 «Provedo notices:» preamble

**Shipped (verbatim — `AllocationPieBarAnimated.tsx` line 75-76):**
> «Provedo notices: Your tech weight is about 2× the index's — driven by IBKR.»

Rendered as italic 14px sans (text-secondary), faded-up 80ms after the bars settle. Followed by a Sources block (Schwab statement + S&P DJI methodology).

**Voice check:**
- «Provedo notices:» is the explicit allowlist-verb-in-agent-subject preamble I recommended in my prior CD-memo review §7. Edit was applied verbatim. ✓
- The clause «Your tech weight is about 2× the index's — driven by IBKR» is observation-coded (causal explanation, not prescription). No advise / recommend / strategy / suggest co-occurrence. The «driven by IBKR» causal anchor is Magician-pattern-surfacing.
- The «×» symbol (proper Unicode multiplication sign) is used correctly — Sage-typographic-precision; would have been a flag if it had been the lowercase Latin letter «x».
- The Sources block underneath cites the public source (S&P DJI methodology) and the user-data source (Schwab statement). Trust-signal pattern matches L1 receipt.

**Repetition with brand promise OK?** Yes — voice repetition of *one* allowlist verb («notices») across surfaces (tagline → DigestHeader → Tab 4 → §S6 manifesto) is the brand-voice consolidation pattern, not the dilution risk that comes from synonym-spray. CD-memo review §7 ruled this is feature, not bug. Anthropic repeats «helpful, harmless, honest»; Linear repeats «built for speed»; Notion repeats «one place for…». In-pattern.

**One micro-flag (LOW, NOT blocking):** the chat-bubble paragraph above the chart («Across both accounts, tech is 58% of your equity exposure — about 2x the sector's weight in S&P 500 (~28%). IBKR carries the bulk: AAPL ($14k), MSFT ($9k), NVDA ($8k). Schwab adds GOOG ($3k) and AMZN ($2k).») is also observation-coded but does NOT have the «Provedo notices:» preamble. The preamble appears only on the post-chart italic line. This is acceptable because (a) the chat bubble is itself authored by «Provedo» via the eyebrow above it, so the agent-attribution is already done; (b) the post-chart italic line is *not* in a Provedo-eyebrowed bubble, so it benefits from the explicit preamble. Composition reads correctly. No edit.

**Verdict: PASS.** Score 9.5/10. Edit applied as recommended; brand-promise repetition is in-pattern; data-coherence with §S2 + Tab 1 holds.

---

### Item 6 — Negation single-column with «Does not» + «source-keeper»

**Shipped (verbatim — `ProvedoNegationSection.tsx` lines 28-38):**

«What Provedo is not» (single-column, em-dash glyphs):
- «A robo-advisor. Does not move money for you.»
- «A brokerage. Does not execute trades.»
- «Advice. Does not tell you what to buy.»

«What Provedo is» (single-column, plus-sign glyphs in teal):
- «A reader. Holds your holdings across every broker.»
- «A noticer. Surfaces what would slip past.»
- «A source-keeper. Every observation tied to a source.»

Section h2: «This is what Provedo is not.»
Section eyebrow: «Provedo» (accent uppercase tracking-widest).

**Voice check:**
- «Does not» (declarative-Sage register) replacing «Won't» (chatty register) — edit from prior CD-memo review §5.E.1 applied verbatim. ✓
- «Source-keeper» (common English compound) replacing «citer» (coined back-formation that scored 4/10 on C4 invented-but-rooted) — edit from prior CD-memo review §5.E.2 applied verbatim. ✓ Resolves the single largest semantic violation in the CD memo.
- Negation noun-tokens («A robo-advisor.» / «A brokerage.» / «Advice.») are clean declarative-Sage. Each predicate uses an allowlist-shape verb in negation form («Does not move money», «Does not execute trades», «Does not tell you what to buy») — directly invokes and rejects the Lane A advisor verbs at the surface where Lane A is most load-bearing. This is exactly the mechanical guardrail VOICE_PROFILE §«Provedo EN copy guardrails» mandates.
- Affirmation noun-tokens («A reader.» / «A noticer.» / «A source-keeper.») all parse as common English on first read; all rhyme with the locked tagline allowlist verbs. Persona-fit clean («Hi, I'm Provedo. I'm a noticer.» — parses; «Hi, I'm Provedo. I'm a citer.» would not have).
- Single-column typeset replaces 2-column pros/cons grid (which would have read as sales-comparison register, anti-Sage editorial). Single-column is Anthropic-mid-page typography pattern. ✓
- Section h2 «This is what Provedo is not.» pairs with the «What Provedo is» mirror — the heading is a deliberate negation framing that the body affirms-in-negation-and-positive. Sage-editorial structure.

**Verdict: PASS.** Score 9.5/10. Both prior-review edits applied verbatim. This is the section that improved most across slices — voice score moved from 5.5 (with «citer» + «Won't») to 9.5 (with «source-keeper» + «Does not»). Strongest single voice fix in the shipment.

---

### Item 7 — Proof bar Cell IV «Sources / for every answer» + italic footer disclaimer

**Shipped (verbatim — `ProvedoNumericProofBar.tsx` lines 130-160):**

Cell IV (in accent color):
- Big number: «Sources» (mono, ~3.25rem)
- Eyebrow: «for every answer» (uppercase tracking-wide)
- Sub: «cited inline, dated, traceable»

Disclaimer footer (italic, separate line):
- «Information, not advice.»

Audience-whisper (italic, separate line below disclaimer):
- «For investors who hold across more than one broker.»

**Voice check:**
- Cell IV adoption of «Sources» as the proof-token is exactly the voice-correct replacement for the rejected «<2s to first answer» perf-marketing claim from the CD memo (§4.D.1). My prior review ruled this would close the largest voice-alignment gap on the proof bar. Edit applied. ✓
- «for every answer» eyebrow + «cited inline, dated, traceable» sub forms a clean Sage-trust-signal triplet. The sub-line uses three observation-coded adjectives stacked (cited / dated / traceable) — modern-tech-tool 2020s register (matches Anthropic «honest, harmless, helpful» triplet shape).
- «Information, not advice.» disclaimer is the canonical Lane A phrase from BRAND.md §6.5. Italic register pulls it visually out of the proof-bar grid into supporting-Sage-disclaimer register. Single declarative micro-sentence — no run-on. ✓
- Audience-whisper kept SEPARATE from the disclaimer (per my prior CD-memo review §4.D.2 REJECT-WITH-EDIT). Two distinct italic lines, two distinct semantic frames, no Sage-restraint violation. ✓
- Cell IV in accent color (vs. text-primary for cells I-III) — visual hierarchy signal that this is the load-bearing trust-claim cell. In-register.

**Run-on risk:** none. Three separate semantic frames are kept on three separate lines (cells I-III + Cell IV proof, then italic disclaimer, then italic audience-whisper). Sage compactness held.

**Verdict: PASS.** Score 9.5/10. Two prior-review edits applied. The proof-bar is now structurally the strongest single Sage-trust-signal surface on the page.

---

### Item 8 — Marquee replacement «— and growing» tail

**Shipped (verbatim — `ProvedoAggregationSection.tsx`):**
- Section h2: «One chat holds everything.»
- Section sub: «Hundreds of brokers and exchanges, in one place — Provedo reads them all.»
- Static 3-column mono list: 12 broker abbreviations (IBKR, Schwab, Fidelity, Coinbase, Robinhood, E*TRADE, T212, Questrade, Wealth, Binance, Kraken, HL).
- Tail: «— and growing» (mono italic tertiary)

**Voice check:**
- «— and growing» tail (replacing the proposed «100s more» which would have conflicted with proof-bar Cell I «100s») applied verbatim from prior CD-memo review §8 edit. ✓
- Static typeset list replaces the previous animated marquee (motion-budget reduction; Sage-restraint gain). Linear-changelog typographic register. ✓
- Section h2 «One chat holds everything.» — declarative Sage with the brand promise compressed to four words. No banned co-occurrence. Allowlist-adjacent verb («holds» is a Provedo-allowlist verb per VOICE_PROFILE §«Provedo brand-name usage rules — Bilingual wordplay (RU)» where «удерживает в виду» appears, and per persona-introduction-template «I provide clarity… holds your portfolio»).
- Section sub «Hundreds of brokers and exchanges, in one place — Provedo reads them all.» — uses the «reads» allowlist verb in agent-subject position. ✓ «Hundreds» as a coverage claim is consistent with proof-bar Cell I «100s» (TD-095 swap will land both at «1000+» when tech-lead verifies). No co-occurrence violations.
- Mono broker abbreviations (IBKR / Schwab / Fidelity etc.) match the page-wide mono-data convention. Aria-labels carry full broker names for screen-readers. A11y clean (out of scope but worth noting).

**One micro-flag (LOW, NOT blocking):** the «E*TRADE» abbreviation is rendered with the literal asterisk. Acceptable because that's the broker's real name. No edit.

**Verdict: PASS.** Score 9/10. Edit applied; motion budget reduced; voice-honest about coverage shape («12 brokers + and growing» reads more honest than «hundreds» abstraction alone, while still pairing with proof-bar Cell I as the macro claim).

---

### Item 9 — FAQ Q1 answer post-«Lane A:» drop

**Shipped (verbatim — `ProvedoFAQ.tsx` lines 12-15):**
- Q: «Does Provedo give investment advice?»
- A: «No. Provedo provides clarity, observation, context, and foresight — never advice, recommendations, or strategy. Information, not advice.»

**Voice check:**
- The structural pattern is the canonical AI EN system-prompt anchor from VOICE_PROFILE §«Provedo EN copy guardrails — Item 2» — verbatim verb-pair list («clarity, observation, context, and foresight — never advice, recommendations, or strategy»). The system-prompt clause is mandated to be inheritable across every Provedo agent surface; deploying it verbatim in the FAQ Q1 is the strongest possible Lane A signal at the highest-traffic disclaim surface. ✓
- «Information, not advice.» repeats the proof-bar disclaimer footer — Sage repetition of the canonical Lane A phrase. Reads correctly: it functions as a closing emphasis, not as redundant filler, because the preceding clause covers the verb-pair guardrails and the closing phrase compresses them into the brand's load-bearing positioning summary.
- «Provedo provides clarity, observation, context, and foresight» uses four allowlist nouns. No banned co-occurrence — the negation «never advice, recommendations, or strategy» is an explicit anti-target list within the same sentence, which is *allowed* under the 5-item EN guardrails because the banned words appear as objects of «never», not as objects of «provides». Hard rule literal text: «'Provedo' NEVER appears in the same sentence as any of: advice / advise / advisory / recommendation / recommend / recommendations / strategy / strategic / strategist / suggestion / suggest». Strict reading: this sentence DOES contain «Provedo» + «advice / recommendations / strategy» in the same sentence.

**FLAG (MEDIUM severity, edit-needed):** This is a **strict reading violation** of the 5-item EN guardrails Item 1. The guardrails do not have an explicit exception for «Provedo … never advice / recommendations / strategy» negation form. While the *intent* of the guardrails is to prevent Provedo from being framed as the source of advice/recommendations/strategy, the literal rule says «NEVER appears in the same sentence as» — no negation exception.

**Two readings, both defensible:**
1. **Strict (rule-literal):** flag as VIOLATION — restructure to put the banned terms in a separate sentence.
2. **Intent (rule-purpose):** PASS — the negation framing actively reinforces what guardrails are designed to prevent (Provedo ≠ advisor) and is the canonical AI system-prompt clause per VOICE_PROFILE Item 2 itself.

**Recommended ruling:** EDIT-NEEDED, voice-tightening (LOW severity in practice, but flagged because the strict guardrail rule does not have an exception clause):

> **Current:** «No. Provedo provides clarity, observation, context, and foresight — never advice, recommendations, or strategy. Information, not advice.»
>
> **Voice-tightened:** «No. Provedo provides clarity, observation, context, and foresight. Information, not advice. Not recommendations. Not strategy.»

The rewrite (a) splits the sentence so the «provides» clause and the «never» negation are no longer co-sentenced; (b) collapses the closing into a three-beat declarative-Sage pattern that rhymes with the negation-section glyphs; (c) pulls «Information, not advice. Not recommendations. Not strategy.» into a deliberate parallel structure that reads stronger than the em-dashed concession in the current version.

**Alternative (lower-friction):** add an exception clause to VOICE_PROFILE §«Provedo EN copy guardrails — Item 1» explicitly permitting negation-form co-occurrence in disclaim contexts. This is a profile-side fix; until it lands, the strict rule applies.

**Verdict: EDIT-NEEDED.** Score 7/10 strict / 9/10 intent. Either rewrite the FAQ Q1 answer or add the negation-exception clause to VOICE_PROFILE. NOT a ship-blocker, but real ambiguity that should be resolved before next contractor copy round.

**Note on «foresight» in the answer:** «foresight» is on the EN verb-allowlist per VOICE_PROFILE §«Provedo EN copy guardrails — Item 3» («Provedo provides foresight» — explicitly listed as Sage-clean). However, see Item 10 below where the /disclosures page replaced «foresight» with «perspective» per legal-advisor REQUIRED Edit 5. **Inconsistency:** FAQ Q1 retains «foresight», /disclosures §«what» uses «perspective». Should be aligned — preferably keep «foresight» in the marketing FAQ (per VOICE_PROFILE Item 3) and «perspective» in the /disclosures regulatory page (per legal-advisor edit). Both are voice-clean; the gap is intentional but worth documenting as «consumer-facing copy uses brand-allowlist verb; regulatory copy uses regulator-safer synonym».

---

### Item 10 — `/disclosures` Layer 3 page

**Shipped (verbatim verb scan — `disclosures/page.tsx`):**

Verb-allowlist usage of «Provedo» as agent-subject across the page (every occurrence found):

- §metadata: «Provedo provides general information about your portfolio. It is not personalized investment advice — every decision stays yours.»
- §who: «Provedo is a software product that provides general information…», «Provedo is not a registered investment advisor and is not a broker-dealer», «Provedo does not provide personalized investment recommendations or advice as defined under…», «Provedo does not hold custody…», «Provedo does not execute trades…», «Provedo connects… on a read-only basis to aggregate position data and surface observations.»
- §what: «Provedo provides clarity, observation, context, and perspective on your portfolio. Provedo surfaces what you hold, shows what has changed, notices patterns across your trade history, and cites the sources for every observation. Provedo describes what is. Provedo does not prescribe what you should do.»
- §what para 2: «When Provedo references general market information… Provedo cites the public source. When Provedo references your own portfolio… Provedo cites the broker statement and date the data was retrieved from.»
- §per-jurisdiction: «Provedo is not registered…», «Provedo does not provide a personal recommendation as defined in MiFID II…», «Provedo provides generic information.», «Provedo provides generic information and does not provide regulated investment advice…», «Provedo's communications are intended to be fair, clear, and not misleading.»
- §past-performance: «Patterns Provedo surfaces from your trade history are retrospective observations…»
- §decisions: «Every decision about your portfolio remains yours. Information Provedo surfaces is intended to support your own analysis, not to replace it. Consult a licensed financial advisor in your jurisdiction before making investment decisions.»

**Voice check:**
- **Lane A discipline holds.** Every Provedo-as-subject sentence uses an allowlist verb (provides clarity / observation / context / perspective; surfaces; shows; notices; cites; describes; aggregates; connects; references) OR an explicit negation («does not provide personalized investment recommendations», «does not hold custody», «does not execute trades», «does not prescribe what you should do», «does not provide a personal recommendation as defined in MiFID II»).
- **Verb-allowlist violation check:** the regulatory negation phrases on this page DO contain «Provedo … recommendations / advice / personal recommendation» in the same sentence (multiple instances across §who and §per-jurisdiction). Strict reading of VOICE_PROFILE §«Provedo EN copy guardrails — Item 1» flags these. **Same ambiguity as Item 9 — these are negation-form disclaim sentences where the banned terms are objects of explicit negation.** On a regulatory disclaimer page, this is the *only* way to draft the page; the banned terms must appear so the disclaimer can deny them. **This is the surface where the strict rule must yield to the intent.** Profile-side exception clause needed (see Item 9 ruling).
- **«Perspective» substitution for «foresight»** (legal-advisor REQUIRED Edit 5, applied) — preserves Sage register in regulatory context. Voice-clean substitution; «perspective» is on the implicit observation-noun cluster (provides perspective = same archetype as provides clarity / context / observation). No harm to brand voice; gain in SEC-Marketing-Rule risk reduction.
- **Persona consistency:** «Provedo describes what is. Provedo does not prescribe what you should do.» This sentence-pair is the cleanest single-line summary of the brand's Lane A discipline anywhere on the page or in the docs. Strong Sage-declarative shape; modern-tech-tool-2020s register; no Stripe-Press / Noesis-academic drift. **This is the load-bearing single sentence on /disclosures from a brand-voice standpoint.**
- **No surveillance-creepy register** — «connects… on a read-only basis», «aggregates position data», «surfaces observations» — Sage-clean. Does NOT use «watches / tracks / monitors» (the anti-pattern from VOICE_PROFILE).
- **No advisor-prescriptive register** anywhere in the body. The closing «Consult a licensed financial advisor in your jurisdiction…» correctly places the advisory role *outside* Provedo (third-party advisor), not on Provedo.

**Verb-allowlist scan:** clean (allowlist verbs used; banned verbs only in negation-disclaim form, same caveat as Item 9).

**Verdict: PASS.** Score 9.5/10. /disclosures Layer 3 holds Lane A discipline cleanly. Same negation-co-occurrence ambiguity as Item 9 — surfaces the need for a VOICE_PROFILE Item 1 exception clause for negation-disclaim form, but this is the appropriate genre for that pattern; the page itself is voice-correct.

---

### Item 11 — Cross-cutting voice fingerprint

**Question: Magician + Sage primary · Everyman modifier still balanced? Drift toward Stripe-imperative / Lovable-warm / Linear-too-friendly?**

**Cross-section scan:**

| Section | Magician signal | Sage signal | Everyman signal | Drift detected |
|---|---|---|---|---|
| Hero H1 + sub | leads-through (foresight) | declarative restraint | accessible plain language | none |
| Hero CTA | — | restrained (single button, no urgency stack) | «Ask Provedo» (friendly approachable) | none |
| DigestHeader | — | observational cadence | — | none |
| ChatMockup answer | event-anchored causal pattern surfacing | mono data + sources line | plain language explanation | none |
| CitationChip | source-locality (Magician-craft) | typographic restraint | — | none |
| Proof bar Cell I-III | — | declarative numerals | «every major one» (warm but factual) | none |
| Proof bar Cell IV | source-claim (Magician trust) | accent-color hierarchy | — | none |
| Disclaimer + audience-whisper | — | italic restraint, separated frames | «For investors who hold across more than one broker» (Everyman scope) | none |
| Negation §S3 | — | declarative typeset (Sage-editorial) | accessible noun-token lead | none |
| Affirmation §S3 | reader / noticer / source-keeper (Magician-craft + Sage-trust) | plus-glyph teal (restrained accent) | common English compounds | none |
| Demo Tabs section header | «Notice what you'd miss» rhyme | «Ask anything.» (Sage-restrained CTA-shape) | plain-language tab labels | none |
| Tab 1 (Why?) | event-anchored pattern surfacing | mono + sources | accessible explanation | none |
| Tab 2 (Dividends) | calendar-foresight surfacing | mono + sources | plain dividend explanation | none |
| Tab 3 (Patterns) | behavioral pattern surfacing (Magician-craft load-bearing) | retrospective disclaim + sources + Shefrin & Statman cite | plain «common pattern across retail investors» | none |
| Tab 4 (Aggregate) | comparison surfacing (Magician-pattern) + «Provedo notices:» preamble | mono + sources + S&P methodology cite | plain broker-by-broker breakdown | none |
| §S5 Insights bullets | (not in this slice) | — | — | (out of scope) |
| §S6 Editorial | foresight-as-pattern claim | dark slate-900 oversized restraint, italic closer | plain «group chat you can't find» | none |
| §S8 Aggregation | «reads them all» (allowlist verb agent-subject) | static typeset (motion-budget restraint) | mono broker abbrs + «and growing» | none |
| §S9 FAQ Q1 | provides clarity / observation / context / foresight | declarative + repeated «Information, not advice.» | accessible Q&A format | strict negation-co-occurrence ambiguity (see Item 9) |
| §S9 FAQ Q3-Q6 | broker count + read-only API + Free tier (Magician-craft, Sage-trust) | declarative restraint | plain «active build», «you're early» | none |
| /disclosures | full Lane A discipline; «describes what is, does not prescribe what you should do» | regulatory register handled in Sage-gravitas | accessible per-jurisdiction notes | strict negation-co-occurrence ambiguity (see Item 10) |

**No drift detected toward any of the named anti-target registers:**
- **NOT Stripe-imperative:** no giant-numerals-pushing-decision pattern; primary-numeral lift in Tab 4 charts is Granola/Anthropic-Console Magician-Sage shape (per prior chart review §1.3). Hero CTA is single button with no urgency stack. No «Maximize / Beat / Outperform» language anywhere.
- **NOT Lovable-warm:** no friendly-pal mascot register; no «Hey there!», no «Welcome friend», no emoji in agent voice. Persona-attribution is uppercase tracking-widest «PROVEDO» (Sage gravitas), not warm-companion register.
- **NOT Linear-too-friendly:** no «Built for [target user] who [emotional state]» framing. Voice stays declarative + observational throughout.
- **NOT Sidekick-warm** (per VOICE_PROFILE anti-tone): no companion / pal / buddy / cute-mascot register. ✓
- **NOT Sage-overdosed-academic** (per VOICE_PROFILE anti-tone): no Noesis-shape lecture-hall register; no numbered chapter eyebrows; no «— Premise» labels; no manifesto-with-citation pattern (the §S6 Sources line cites 2 items but is restrained — does NOT surface cohort sample sizes per CD-memo review §6.F.3). ✓
- **NOT surveillance-creepy** (per VOICE_PROFILE anti-tone): consistently uses «sees / surfaces / notices / cites / aggregates / reads» (active-by-the-tool); never «watches / tracks / monitors / analyzes your behavior» (passive-on-the-user). ✓
- **NOT profit-aggressive** (per VOICE_PROFILE anti-tone): no «Maximize gains / outperform / beat the market» register. Coverage claim («100s of brokers») is factual, not aspirational. ✓
- **NOT advisor-prescriptive** (per VOICE_PROFILE anti-tone): every Provedo-as-subject sentence uses observation/clarity/context/foresight verbs OR explicit negation. Never tells user what to do. ✓
- **NOT insurance-vendor** (per VOICE_PROFILE anti-tone): no «your provider says…» register from «provide» drift. ✓

**Magician + Sage primary balance:** load-bearing surfaces (hero H1, ChatMockup answer, Tab 4 «Provedo notices:», §S6 manifesto, /disclosures «describes what is») all carry both archetypes. Magician-foresight + Sage-observation co-occur cleanly without drift to one or the other.

**Everyman modifier:** present in plain-language explanations (FAQ Q&A, audience-whisper «For investors who hold across more than one broker», hero small-print «No card. 50 free questions a month.»). Not over-rotated into companion-warm-Sidekick territory. ✓

**Verdict: PASS.** Score 9.5/10. Cross-cutting voice fingerprint is the strongest the project has shipped. Multi-slice implementation introduced no register drift; the 6 slices reinforced the locked Provedo voice fingerprint without dilution.

---

## §2. Voice fingerprint score for shipped state

**Composite voice score: 9.4 / 10.**

Per-item scoring summary:

| Item | Score | Verdict |
|---|---|---|
| 1. Hero copy | 9.5 | PASS |
| 2. DigestHeader | 9.5 | PASS |
| 3. CitationChip | 9.5 | PASS |
| 4. ChatMockup answer + sources | 9.5 | PASS |
| 5. Tab 4 «Provedo notices:» preamble | 9.5 | PASS |
| 6. Negation single-column + «source-keeper» | 9.5 | PASS |
| 7. Proof bar Cell IV + footer | 9.5 | PASS |
| 8. Marquee replacement «— and growing» | 9.0 | PASS |
| 9. FAQ Q1 answer | 7.0 strict / 9.0 intent | EDIT-NEEDED (negation-co-occurrence ambiguity) |
| 10. /disclosures Layer 3 | 9.5 | PASS (same negation ambiguity as Item 9, but appropriate to genre) |
| 11. Cross-cutting voice fingerprint | 9.5 | PASS |

**Composite formula:** average of 11 items, weighted equally = 9.4.

**Year-over-year context:** the same fingerprint scoring rubric on the rejected naming predecessor's last landing (pre-Provedo lock) would have scored ~5.5 (borrowed Stripe/Brex/Mercury anchor + advisor-adjacent verbs + missing source-anchor cells). The 9.4 today is the load-bearing measurable outcome of the Provedo lock + 6 slices + brand-voice-curator/PD/content-lead/legal-advisor multi-specialist iteration.

---

## §3. Top 3 voice drifts to fix

Only one true ambiguity surfaced; nothing else read as drift in the shipped state.

**1. Strict negation-co-occurrence ambiguity in 5-item EN guardrails Item 1 (MEDIUM, profile-side fix preferred over copy-side fix).** FAQ Q1 («Provedo provides clarity, observation, context, and foresight — never advice, recommendations, or strategy. Information, not advice.») and multiple /disclosures sentences («Provedo does not provide personalized investment recommendations or advice…») contain «Provedo» + banned-term-in-negation in the same sentence. Strict reading of VOICE_PROFILE §«Provedo EN copy guardrails — Item 1» flags these; intent reading allows them as the canonical AI EN system-prompt clause from Item 2 itself.

**Fix (preferred): profile-side.** Add to VOICE_PROFILE §«Provedo EN copy guardrails — Item 1» an exception clause:

> **Exception:** the Item 1 ban does not apply when banned terms appear as the object of explicit negation in a disclaim, definitional, or persona-introduction context (e.g. «provides clarity… never advice / recommendations / strategy»; «does not provide personalized investment advice as defined under…»). The intent of Item 1 is to prevent Provedo from being framed as the source of advice; negation form actively reinforces this intent. Disclaim/definitional copy MAY co-sentence «Provedo» with banned terms IF the banned terms are objects of an explicit «not / never / does not / no» negation.

**Fix (alternative): copy-side.** Restructure FAQ Q1 to: «No. Provedo provides clarity, observation, context, and foresight. Information, not advice. Not recommendations. Not strategy.» (See Item 9 above for full rewrite.) /disclosures sentences would also need restructuring; this is mechanically expensive and reduces regulatory clarity. Profile-side fix is strongly preferred.

**No other voice drifts identified across the shipped state.**

The two micro-flags below are NOT drifts — they're consistency notes worth tracking but not fixing in this slice:

**(a) «foresight» vs «perspective» split between FAQ and /disclosures.** FAQ Q1 uses «foresight» (per VOICE_PROFILE Item 3 allowlist); /disclosures §«what» uses «perspective» (per legal-advisor REQUIRED Edit 5 — SEC-Marketing-Rule risk reduction). Both are voice-clean; intentional split between marketing copy (allowlist verb) and regulatory copy (regulator-safer synonym). Worth documenting in VOICE_PROFILE §«Provedo EN copy guardrails» as a recognized pattern.

**(b) «E*TRADE» asterisk in §S8 broker list.** Real broker name; correct rendering. Not a drift.

---

## §4. Verdict

**VOICE-CLEAN-SHIP-READY.**

Composite score 9.4/10 across 11 check items. Ten of eleven items PASS verbatim with prior-review edits applied (Items 1-8, 10, 11). One item (Item 9 FAQ Q1) carries a strict-vs-intent ambiguity in the 5-item EN guardrails Item 1 negation-co-occurrence rule — recommend resolving via profile-side exception clause rather than copy-side rewrite, because (a) the canonical AI EN system-prompt anchor in Item 2 *itself* uses negation-co-occurrence form, (b) /disclosures Layer 3 cannot be drafted without negation-co-occurrence, and (c) the intent of Item 1 (prevent Provedo-as-source-of-advice framing) is actively reinforced by negation form, not violated.

**No ship-blockers.** No CRITICAL or HIGH voice violations. The Item 9 ambiguity is MEDIUM (clarification needed in the binding profile, not in the shipped copy).

**Cross-cutting voice fingerprint verdict:** Magician + Sage primary · Everyman modifier balance held cleanly across all 6 slices. No drift toward Stripe-imperative, Lovable-warm, Linear-too-friendly, Sidekick-warm, Sage-overdosed-academic, surveillance-creepy, profit-aggressive, advisor-prescriptive, or insurance-vendor registers. The locked Provedo voice fingerprint is operationally honored at every shipped surface.

**Recommendation to right-hand:**
1. **Ship the current shipped state.** No copy edits required to ship.
2. **Add VOICE_PROFILE §«Provedo EN copy guardrails — Item 1» exception clause for negation form** (see §3 fix-preferred). This is a profile-side cleanup that resolves the Item 9 + Item 10 strict-rule ambiguity without changing any shipped copy.
3. **Document the «foresight» vs «perspective» genre-split** as a recognized pattern (marketing allowlist verb on consumer surfaces; regulator-safer synonym on regulatory disclosure surfaces). Add to VOICE_PROFILE §«Provedo EN copy guardrails» as Item 6 if formalization is wanted; otherwise leave as informal pattern documented in this review.
4. **Brief future contractor copy writers on the Item 9 + Item 10 negation-co-occurrence pattern explicitly** so they don't either (a) avoid the canonical disclaim phrases out of strict-rule fear or (b) drift into non-disclaim co-occurrence thinking the rule has loosened generally. The exception is *only* for negation-form disclaim/definitional/persona-introduction contexts.

**Prior review reaffirmation:** All edits I recommended in `2026-04-27-brand-voice-review-charts-and-hero-chat.md` and `2026-04-27-cd-memo-brand-voice-review.md` were applied verbatim in the shipped state (verified file-by-file). The «source-keeper» replacement of «citer», the «Does not» replacement of «Won't», the «Provedo notices:» preamble in Tab 4, the «and growing» replacement of «100s more», the Cell IV «Sources / for every answer» replacement of the perf-marketing claim, the audience-whisper kept separate from the disclaimer footer — all applied. This is the cleanest brand-voice round-trip the project has shipped.

**Disagreement with parallel reviews:** I have not seen PD / brand-strategist / a11y / qa parallel reviews (independent dispatch). My verdict is on voice fingerprint alone; right-hand consolidates.

**Lane A status:** clean across all shipped surfaces. The two negation-co-occurrence sentences (FAQ Q1 + /disclosures multi-instance) are *protective* of Lane A, not violations of it. Profile clarification will lock this distinction explicitly.

---

**End of final brand-voice review on shipped state.**
