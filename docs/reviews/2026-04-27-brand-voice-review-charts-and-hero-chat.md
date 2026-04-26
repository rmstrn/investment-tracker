# Brand-Voice Review — Chart Upgrade Proposal B + Hero ChatMockup Proposal A

**Author:** brand-voice-curator (independent dispatch, isolated context per Rule 3)
**Date:** 2026-04-27
**Reviewing:**
- `docs/reviews/2026-04-27-chart-upgrade-audit-product-designer.md` (PD recommends Proposal B)
- `docs/reviews/2026-04-27-hero-chatmockup-audit-product-designer.md` (PD recommends Proposal A)
**Reference anchors:**
- `docs/product/BRAND_VOICE/VOICE_PROFILE.md` (post-Provedo-lock 2026-04-25 — 7-criterion rubric, 5-item EN guardrails, verb-allowlist)
- `docs/product/BRAND_VOICE/REFERENCES_LIVING.md` (15 positive + 12 negative)
- `docs/product/04_BRAND.md` v1.0 (Magician + Sage primary · Everyman modifier; tagline «Notice what you'd miss»)
**Constraints honored:** Rule 1 (no spend), Rule 2 (no PO-as-author comms), Rule 3 (independent verdict — not deferring to PD), Rule 4 (no rejected-predecessor mention).

---

## §0. Method note

I reviewed each proposal against the locked Provedo voice fingerprint independently of PD's reasoning. PD's recommendations are taken as inputs, not conclusions. Where I disagree with PD, I say so explicitly in §3 cross-cutting.

The voice rubric I'm scoring against (per VOICE_PROFILE.md):
1. **Archetype balance** — Magician (foresight/pattern) primary + Sage (calm observation, restraint) primary modifier + Everyman (accessible, anti-paternalistic) modifier. NOT Sidekick warmth, NOT Outlaw aggression, NOT Sage-overdosed-academic.
2. **Verb-allowlist for Provedo as agent-subject** — provides clarity / context / observation / foresight; sees / surfaces / shows / cites / connects / notices / leads through. BANNED: advises / recommends / suggests / strategizes / tells you to act / guides your decision.
3. **5-item EN guardrails** — banned co-occurrence of «Provedo» with advice / recommendation / strategy / suggestion in the same sentence.
4. **Anti-tone registers** — NOT advisor-prescriptive, NOT profit-aggressive, NOT surveillance-creepy («tracks/watches/monitors»), NOT Sidekick-warm, NOT fintech-infrastructure-serious-only (the borrowed Stripe/Brex anchor).
5. **Tagline anchor** — «Notice what you'd miss» / «Замечает то, что ты упустил бы». Sage-observation register. The whole landing should rhyme with this line.

---

## §1. Chart Proposal B — line-by-line voice review

### 1.1 Brand-color move (PnL line slate-gray → teal-600 2px stroke)

**Question (right-hand):** Does promoting teal-600 to chart line color reinforce Magician+Sage register, or does it over-rotate teal as «product action color» (vs. its current observation-only use)?

**Voice verdict: STRONGLY APPROVE.** The current state — slate-gray P&L line on cream — actively undermines the Magician register. Magician archetype demands the *visible signal of pattern surfaced by the tool*; rendering the most-prominent piece of pattern data (the headline P&L curve) in slate-secondary text color says «this is generic dashboard chrome», not «this is what Provedo noticed». The chart fails to look like an instance of the brand-promise («Notice what you'd miss»).

Promoting teal-600 to the primary data-line stroke is not action-color drift. Action-color drift would be: teal on a *button* the user *clicks* to *do* something. A chart line is not an action surface — it is an observation surface. Teal here reads as «this is the data Provedo is showing you», which is exactly the Magician+Sage signal we want. The Linear/Anthropic-Console reference cluster (named in the audit §2.4) also uses brand color for primary chart strokes; this is the modern-tech-tool 2020s norm, not a deviation.

There is one micro-risk worth flagging: if teal becomes simultaneously the (a) chart line color, (b) tagline accent color, (c) hero CTA fill, and (d) data-emphasis chip color, the palette starts to feel monotone. PD's Proposal B keeps red `--provedo-negative` for the emphasis dots and slate for axis/labels, so the hierarchy holds. **No edit needed.**

**Voice score: 9/10.** Single-line reason: closes the largest brand-alignment gap on the page; teal-as-data-surface is squarely in-register.

### 1.2 Tab 4 restructure (donut card + broker-table card, drop stacked bar)

**Question (right-hand):** Does the new dual-card layout hold Sage-restraint, or does it drift toward dashboard-product-tool register (anti-Sage editorial)?

**Voice verdict: APPROVE-WITH-EDITS.** The restructure is *more* Sage-restrained than the current state, not less. The current AllocationPieBar packs 17 text elements + 4 arcs + 5 bars into 280×150px — the densest chart in the inventory by ~3×. That density is the anti-Sage failure: Sage shows one number that matters, not twenty-six items competing. Splitting into two cards where each card has a single primary read (donut = sector mix; table = broker breakdown) is Sage-editorial behavior, not dashboard-product-tool behavior.

The dashboard-product-tool concern would apply if the two cards added interactive controls, sortable columns, expandable rows, hover-to-reveal — Bloomberg-terminal moves. PD's Proposal B keeps both cards static and observational. That is the Sage line.

**One required edit (see §1.4).** The exact phrasing «$186k · 5 positions» needs voice review — see below.

**Voice score: 8/10.** Single-line reason: structurally Sage-correct; one copy-string flag holds it back from 9.

### 1.3 Typography lift (≥11pt floor + 18-24pt primary numerals)

**Question (right-hand):** Does pushing primary numerals to 24pt match Granola-confidence Magician register, or does it overshoot into Stripe-imperative (anti-Sage)?

**Voice verdict: APPROVE.** This is Granola/Anthropic-Console register, not Stripe-imperative. The distinction:

- **Stripe-imperative typographic register** = giant numerals + giant verb + giant CTA, all stacked, urging action. The numbers exist to push the user toward a decision. Stripe's homepage hero «$1B+ processed» is this shape.
- **Granola/Anthropic-Console Magician register** = primary number large because it is the *one thing the tool surfaced for you to notice*; supporting context smaller. The number exists as observation, not as urging.

PD's Proposal B is the second pattern. The 24pt center number on the donut («$231k») is the chart's primary observation; the 11pt labels around it are the supporting decode. This is Magician-foresight-as-pattern (one number Provedo surfaced) + Sage-restraint (everything around it stays calm). The Provedo persona declaration template («Provedo noticed…») rhymes with this typographic shape — large noticed-thing + restrained surrounding context.

The 24pt ceiling is appropriate for chart center-numerals specifically. Generalizing 24pt to *all* numerals across the page (e.g. landing body copy) would over-rotate. PD's audit scopes the lift to chart center-numerals + emphasis end-labels — correct scope.

**Voice score: 9/10.** Single-line reason: Granola/Anthropic-Console pattern is exactly the modern-tech-tool 2020s register the voice profile derives from.

### 1.4 «$186k · 5 positions» phrasing — exact voice check

**Question (right-hand):** Voice-check this exact phrasing — verb-allowlist clean? Pattern-artefact register?

**Voice verdict: APPROVE-WITH-EDIT.**

- **Verb-allowlist:** clean — no verb at all; pure observation token. ✓
- **5-item EN guardrails:** clean — no advice/recommend/strategy/suggest co-occurrence. ✓
- **Lane A:** clean — pure factual aggregation, no implied action. ✓
- **Magician+Sage register fit:** clean — observation-token, calm, factual. ✓

**One micro-edit recommended (LOW severity, would take from 8 to 9):** the middle dot `·` separator is correct for Sage-restraint (it's the tagline-sub separator pattern from §S4 already). However, the unit «5 positions» is slightly bare without label scaffold. Consider:

- **Current proposed:** `IBKR · $186k · 5 positions`
- **Voice-tighter alternative:** `IBKR · $186k across 5 positions`

The «across» preposition adds zero typographic weight (one short word) and converts the row from a dense-data triple into a near-readable clause that mirrors the brand voice cadence («Provedo notices: $124 in dividends across 3 brokers» style from §S4 sub-proofs). It also forecloses the «is this a dashboard or a sentence?» ambiguity that pure-token rows can carry.

If 24px row width is a constraint, the bare middle-dot version is acceptable. **Not blocking.**

**Voice score: 8/10 as-drafted, 9/10 with the «across» edit.**

### 1.5 Chart Proposal B — overall voice verdict

**APPROVE-WITH-EDITS** (the «across» micro-edit on the broker-table card is the only one).

**Composite voice score: 8.5/10.** Single-line reason: structurally fixes anti-Sage density problem on Tab 4; teal-as-primary-data-stroke is in-register; typography lift is Granola/Anthropic Magician-Sage shape, not Stripe-imperative; one copy-string would benefit from a one-word edit.

---

## §2. Hero ChatMockup Proposal A — line-by-line voice review

### 2.1 Content upgrade (generic question → §S4-Tab-1-grade with sources + event anchors + mono tickers)

**Question (right-hand):** Does this pull the Magician (foresight/pattern) register too strongly into hero or does it strengthen the chat-as-product wedge?

**Voice verdict: STRONGLY APPROVE.** This is the single highest-leverage voice-alignment fix on the entire landing.

The current hero answer («You're down −4.2% this month. 62% of the drawdown is two positions: Apple (−11%) and Tesla (−8%).») is *numerically specific but causally empty*. The Provedo brand-promise is causal: «Notice what you'd miss» = the *why*, the *connection across positions*, the *event that explains the move*. A hero answer that gives numbers without causation is a generic fintech-dashboard answer — exactly the «borrowed Stripe/Brex/Mercury anchor» register the project rejected after the rejected-predecessor cycle. **The hero currently understates the Magician register.**

PD's proposed upgrade adds:
- Event anchors («after Q3 earnings on 2025-10-31», «after the 2025-10-22 delivery miss») — Magician pattern-surfacing.
- Sources line — Sage trust-signal (load-bearing per Brand §6.5; the «Provedo cites» verb is on the allowlist).
- Mono-formatted tickers and amounts — modern-tech-tool 2020s register signal that says «this is real product output», not marketing copy.

All three moves pull the hero *closer* to the locked tagline «Notice what you'd miss» and to the persona template («I notice patterns across your brokers and explain them in plain language»). This is not over-rotation into Magician; it is correcting an under-rotation.

**Risk check:** the upgraded answer (~290 chars per PD) approaches the upper edge of hero readability. Above ~340 chars in a hero bubble, Sage-restraint starts losing to wall-of-text. PD's audit is at ~290 — within budget. **No edit needed on length.**

**Voice score: 10/10.** Single-line reason: closes the hero's Magician under-rotation; rhymes with the locked tagline.

### 2.2 Variable typing speed + sentence pause + entrance fade + replay-on-intersection

**Question (right-hand):** Does the «more lifelike» motion direction read as Magician-craft, or as Stripe-marketing-warm (Everyman drift)?

**Voice verdict: APPROVE.** The four motion moves are all *legibility-of-the-product* signals, not *warmth-of-the-marketing* signals. The distinction matters:

- **Stripe-marketing-warm motion** = elements that pulse, breathe, glow, gradient-wash; motion that exists to *charm* the visitor. Magnetic CTA buttons, parallax that happens because parallax is fashionable, micro-interactions on text. This is Everyman over-rotation — friendliness as substitute for substance.
- **Magician-craft motion** = motion that signals *this is how the product actually behaves*. Variable typing speed is what real LLM streaming actually looks like. Punctuation pauses are how readers actually read. Replay-on-intersection means the demo is honest the second time the visitor scrolls back. None of these moves exist to *charm*; they exist to make the demo *more accurate to the product*.

This is squarely Magician-craft register. The Cursor.com hero comparison (PD §2.6) is the right reference — Cursor's motion makes the demo feel like product, not animation. Provedo's Proposal A is doing the same thing.

**One register-flag worth naming but NOT blocking:** entrance fade on the response bubble (200ms `opacity 0→1` + `translateY 8px → 0`, expo ease) is the most decorative of the four moves. It sits inside compositor-friendly properties so it passes the 5-rule constraint. The voice question is: does the easing curve `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) signal Magician-craft or Stripe-marketing? Expo-out is the Linear/Vercel default and reads Magician-craft in that context. ✓ Acceptable. If PD had specified a bouncier easing (e.g. spring with overshoot), I would flag it as Sidekick-warm drift; expo-out is fine.

**Voice score: 9/10.** Single-line reason: lifelike motion = product-honest motion = Magician-craft register; expo-out easing keeps it Sage-restrained, not Sidekick-warm.

### 2.3 Mono-format data tokens (tickers + dollar amounts in JBM-mono)

**Question (right-hand):** Does this match technical-Sage-Magician register, or does it code «product/dev tool» off-archetype for fintech?

**Voice verdict: APPROVE.** Mono tokens for tickers and amounts are *the* defining typographic move of the modern-AI-tool 2020s reference cluster — Anthropic Console, Linear, Cursor, Vercel, Notion-with-code-blocks all do this. The voice profile's positive references list lives in this exact register.

The «is this off-archetype for fintech?» concern would apply if Provedo's positioning were anchored to *legacy fintech* (Mint, Empower, Personal Capital, Bloomberg Terminal). Per Brand §7, Mint/Empower/Bloomberg Terminal are *negative* visual anchors for Provedo. Provedo is positioned in the modern-tech-tool 2020s cluster (Notion/Linear/Arc/Cursor/Vercel/Figma — Brand §7) which uses mono tokens for data. Mono tokens here are *in-register*, not off-archetype.

There is a Sage-Magician-specific reading too: mono tokens for data tokens reinforce that the data is *real, structured, retrievable* — not marketing prose. That is exactly the Sage trust-signal the brand needs on first contact.

**Voice score: 10/10.** Single-line reason: matches positive-anchor cluster typographic norm; reinforces Sage trust-signal.

### 2.4 Wordmark inline placement (badge moves into chat header / above response bubble)

**Question (right-hand):** Voice-check — is wordmark-on-chat appropriate, or does it read as «branding the demo» (anti-Sage editorial)?

**Voice verdict: APPROVE.** The current placement (wordmark floating *above* the entire chat *before* the user bubble) is the actually-anti-Sage version — it brands the demo from outside, like a watermark. Moving the wordmark *inline above the response bubble* converts it from branding-chrome into responder-attribution, which is exactly what the §S4 `ProvedoBubble` already does and which matches every reference in the positive-anchor cluster (Claude.ai, ChatGPT, Anthropic surfaces).

Responder-attribution is *more* Sage than watermark-branding because:
- It signals *this is the AI's voice, distinct from the chrome around it* — which is the Magician-craft register signal.
- It removes the «marketing surface around a chat surface» double-frame and lets the chat surface be the surface — Sage-restraint.

**No edit needed.** The change closes a structural-consistency gap with §S4 too (PD §2.2 finding 1).

**Voice score: 9/10.** Single-line reason: converts wordmark from external branding into in-context attribution; matches positive-anchor cluster pattern.

### 2.5 Hero ChatMockup Proposal A — overall voice verdict

**APPROVE-AS-DRAFTED** (no copy edits required; all four content/visual/motion moves are voice-clean).

One **mandatory copy-validation step** for the new hero answer text before frontend implementation:

- The proposed exact answer is: *«You're down −4.2% this month. 62% of the drawdown is two positions: Apple (−11%) after Q3 earnings on 2025-10-31, and Tesla (−8%) after the 2025-10-22 delivery miss. The rest of your portfolio is roughly flat.»*
- **Verb check:** «down», «drawdown», «after [event]», «is roughly flat» — all observation-coded. No advice / recommend / strategy / suggest / guidance language. ✓ 5-item EN guardrails clean.
- **Sources line scope:** PD's audit suggests «AAPL Q3 earnings 2025-10-31 · TSLA Q3 delivery report 2025-10-22 · holdings via Schwab statement 2025-11-01». All three are observation-attribution, no advisor verbs. ✓
- **One micro-flag:** «delivery miss» is mildly negative-affect (the word «miss» carries emotional weight). The voice profile's anti-target list flags «negative-valence English head morpheme» specifically for *names*, not for *event descriptions*. Real events have real names; «delivery miss» is the actual reporting language for that event. **Acceptable as-is.** Do not soften to «delivery report» or «delivery shortfall» — both would be euphemism, which is anti-Sage (Sage names what is).

**Composite voice score: 9.5/10.** Single-line reason: every move closes a Magician under-rotation gap; zero verb/guardrail violations; no copy edits required.

---

## §3. Cross-cutting voice-fingerprint risk assessment

### 3.1 Combined push of both proposals on overall landing voice register

**Question (right-hand):** Do PD's two proposals together push the landing's overall voice register beyond what Magician primary + Sage modifier allows?

**Voice verdict: NO. Risk-status: OK.**

The two proposals together do this:
1. Hero chat becomes more Magician-pattern (event-anchored, sourced, mono-formatted) and more Sage-restrained (wordmark in attribution context, not as watermark).
2. §S4 Tab 1 P&L gets brand-color signal that says «this is what Provedo noticed» (Magician).
3. §S4 Tab 4 sheds 26-item density and becomes two clean observation cards (Sage-restraint).
4. Typography across charts lifts to Granola/Anthropic-Console scale that signals «attention to craft» (Magician+Sage modern-tech-tool register).

Net direction = *toward* the locked positioning, not away from it. The current landing voice has been *under-Magician* (numerically specific but causally empty) and *under-Sage-restrained* (Tab 4 density). Both proposals correct under-rotations. Neither over-rotates.

The only register I would have flagged as a violation — if PD had proposed it — is interactive hover-to-reveal data layers in §S4 (which would push toward dashboard-product-tool register, anti-Sage editorial). PD explicitly *did not* propose that (they ranked it as Proposal C and explicitly recommended against it). This is the right call. **PD's choice of Proposal B over Proposal C is itself voice-correct.**

### 3.2 Risk monitor (not violations, but worth tracking)

| Watch-item | Why | Mitigation |
|---|---|---|
| Teal saturation across surfaces | Teal on chart line + teal on CTA + teal on tagline accent + teal on chip = monotone palette risk | Confirmed not occurring in Proposal B (red `--provedo-negative` retained, slate for axis/labels). Re-check after frontend implementation. |
| Hero answer length ceiling | ~290 chars current proposal, ~340 chars is the Sage-restraint ceiling | Within budget. Future content additions should not exceed 340. |
| Mono-token everywhere drift | Mono is the positive-anchor signal but if every data point on the landing uses mono, it loses signal value | Currently mono is scoped to data tokens (tickers, amounts, dates) — correct scope. Don't extend mono to body copy. |
| «delivery miss» negative-affect language | Real-world event language is allowed but accumulation of negative-affect terms across multiple sections would drift register | Current scope is one event description; acceptable. |

### 3.3 Specific copy edits (consolidated)

1. **Chart Proposal B, broker-table card (LOW severity, recommended not blocking):**
   - Current proposed: `IBKR · $186k · 5 positions`
   - Voice-tighter alternative: `IBKR · $186k across 5 positions`
   - Apply same to Schwab row.

2. **Hero ChatMockup Proposal A:** **no copy edits required.** The proposed answer text + sources line are all voice-clean as-drafted.

### 3.4 Disagreement with PD recommendations

**No disagreement on either recommendation.**

- PD's Proposal B (charts) is voice-correct over Proposal A (which leaves Tab 4 cluttered = anti-Sage density problem unresolved) and over Proposal C (which adds dashboard-product-tool drift).
- PD's Proposal A (hero chat) is voice-correct over Proposal B (which adds 3-cycle carousel = busier hero, mild anti-Sage drift) and over Proposal C (which adds chip picker = product-showcase Magician-lean that crowds the locked tagline's Sage register).

PD's recommendation rationale (highest yield-per-hour, lowest risk against «calm over busy», strongest archetype preservation) maps cleanly to my voice rubric. Independent verdict: **concur.**

---

## §4. Final summary

| Proposal | Verdict | Voice score | Required edits |
|---|---|---|---|
| Chart Upgrade Proposal B | APPROVE-WITH-EDITS | 8.5/10 | One LOW: «across 5 positions» phrasing on broker-table card |
| Hero ChatMockup Proposal A | APPROVE-AS-DRAFTED | 9.5/10 | None |

**Cross-cutting voice-fingerprint risk:** OK.

**Disagreement with PD:** None on either proposal. PD's Proposal selection on both audits matches the voice profile's anti-target list (Proposal C in charts + Proposal B/C in hero chat would both push register beyond Magician primary + Sage modifier).

**Lane A status:** clean on both proposals. No banned co-occurrences. All proposed copy uses verb-allowlist verbs only.

**Next agent action (right-hand to coordinate):**
1. If PO selects Chart Proposal B + Hero Proposal A: dispatch frontend-engineer with this review's §3.3 copy edit list.
2. Before frontend ships: brand-voice-curator should do a final string-level review of the implemented PR (catch any frontend-engineer paraphrase drift on the «$186k across 5 positions» row + sources-line exact text).

---

**End of brand-voice review.**
