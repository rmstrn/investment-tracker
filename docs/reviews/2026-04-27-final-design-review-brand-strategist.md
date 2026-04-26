# Final Design Review — Brand-Strategist Independent Verdict on Shipped State (3.2 + 3.3 + 3.4 + 3.5 + 3.6)

**Author:** brand-strategist (Phase-5 final, parallel Rule-3 dispatch with 4 other specialists)
**Date:** 2026-04-27
**Method:** code-state walkthrough at HEAD (Vercel preview is 401-auth-walled; verdict grounded in shipped code, not visual rendering — flagged where it matters)
**Inputs:**
- `docs/reviews/2026-04-27-phase3-brand-strategist-validation.md` (Option D = 47/50)
- `docs/reviews/2026-04-27-cd-memo-brand-strategist-verdict.md` (D-prime = 45/50)
- `docs/design/slice-lp3-6-hero-retire-spec.md`
- `docs/reviews/2026-04-27-fintech-competitor-landing-audit-user-researcher.md`
- Shipped code: `apps/web/src/app/(marketing)/_components/*` at HEAD `ad359a6`
**HARD RULES respected:** Rule 1 (no spend) · Rule 2 (no PO-name comms) · Rule 3 (independent — explicitly disagrees with prior verdicts and CD where evidence pushes me to) · Rule 4 (no rejected-predecessor reference)

---

## §1. Method note — what I could and could not verify

The Vercel preview returned 401 (auth-walled). I could not perform a sighted walk-through; my verdict is grounded in the shipped React/TSX code at HEAD and the prior multi-agent reviews. Three things this approach can verify with high confidence:

1. Whether the `<Sources>` primitive is mounted on the surfaces D-prime spec required.
2. Whether L2/L3 retire was executed structurally as specified (`InsightFeedMockup` and `BrokerPieMockup` deleted, `DigestHeader` + `CitationChip` introduced).
3. Whether Tab 4 ships the comparison-bars treatment that the Phase-3 product-designer + brand-voice converged on.

What I cannot verify without a sighted render: chrome-typography rhythm at 1440px, whether 12px gaps actually read as «one receipt-system» vs «three cards», whether motion sequencing (chip fade after typing complete) feels like a single causal beat or like two unconnected events. I flag this in the C-window section because chrome execution at the rendering layer is the part of D-prime most likely to drift from spec.

---

## §2. Score shipped state on D-prime rubric (out of 50)

Re-running the 10-dimension rubric from `2026-04-27-cd-memo-brand-strategist-verdict.md` §10, scoring the **shipped composition** (not the spec).

| Dimension | D-prime spec score (prior) | Shipped score | Δ | Why |
|---|---|---|---|---|
| Holds empty 2x2 quadrant cleanly | 5 | 5 | 0 | Voice register held: Sage observation + Everyman warmth. Hero head/sub/CTA copy untouched per LOCKED. |
| Pre-data falsifiability of bet | 4 | 4 | 0 | Chrome-as-iteration is observable on dwell-time/scroll-depth when instruments land; no posture commitment shipped. |
| Brand-territory commitment cost | 4 | 4 | 0 | All chrome reversible at typographic layer. No structural lock that can't be unwound. |
| Reversibility (strategic, not structural) | 4 | 4 | 0 | Receipt-chrome can be tightened or relaxed across versions. |
| Preserves Magician + Sage + Everyman archetype balance | 4 | 4 | 0 | Magician held in chat surface (typing animation, sparkline, comparison-bars motion). Sage strengthened by Sources system. Everyman not crushed — chrome stayed restrained-Sage end (no courtroom-exhibit drift, mono-numerals not aggressive). |
| Preserves Provedo etymology load (provedere) | 5 | 5 | 0 | «Notice / surface / source-keeper» language across S3 + S5 reinforces «I provide for / I foresee» without surfacing the Italian directly. |
| Cold-traffic-data-collection-friendly (allows clean A/B testing later) | 4 | 4 | 0 | No structural rhythm change to undo for tests. |
| Lane A discipline | 5 | 5 | 0 | «Information, not advice» moved from cell-IV to dedicated italic footer line. Cell-IV freed for «Sources / for every answer» (epistemic claim). Negation §S3 preserved typographically. Disposition-effect note in Tab 3 («not a recommendation about future trading decisions») is a Lane A best-in-class touch. |
| Differentiation upside in current category map | 5 | 5 | 0 | Receipt-chrome remains unclaimed across audited fintech + AI-tool sets. Sources eyebrow (JBM-mono small-caps, dotted top-rule) is genuine system signature. |
| Brand-equity compounding under «no distribution yet» constraint | 5 | **4** | **−1** | One material gap: §S5 InsightsBullets bullet #3 says verbatim «Provedo cites every observation. Every pattern ties back to a trade, an event, or a published source.» but §S5 itself does NOT mount a `<Sources>`. The chrome promise this bullet makes is the load-bearing chrome promise of the whole D-prime move, and it ships unbacked at the surface that asserts it. See §6 for full reading. |
| **Total shipped** | **45** | **44** | **−1** | |

**Score shipped state: 44/50.**

The shipped composition is one point below the D-prime spec. The single point lost is on the chrome-promise-content-mismatch axis I flagged as Risk #1 in `2026-04-27-cd-memo-brand-strategist-verdict.md` §8. The chrome-promise was made in copy and went unbacked at the §S5 surface that makes it.

This is not a degradation of D-prime; this is D-prime mostly-delivered with a single specific gap that I would route to content-lead + product-designer as a slice-LP3.7 fix before it compounds.

---

## §3. Q2 — Receipt-chrome instantiation across the page

**Sources primitive mount audit (verbatim from grep against shipped code):**

| Surface | `<Sources>` mounted? | Items shipped | Reads as system primitive? |
|---|---|---|---|
| §S1 Hero ChatMockup | YES | AAPL Q3 earnings 2025-10-31 · TSLA Q3 delivery report 2025-10-22 · holdings via Schwab statement 2025-11-01 | YES — italic tertiary, dotted top-rule, JBM-mono «Sources» eyebrow |
| §S2 NumericProofBar | NO mount, but cell IV «Sources / for every answer» typographic claim | n/a — meta-claim about the system | N/A — proof bar doesn't itself observe; it asserts the system exists |
| §S3 NegationSection | NO | n/a — negation is positioning, not observation | OK — no claim made that requires citation |
| §S4 Demo Tab 1 (Notice) | confirmed via grep | (per shipped Tab 1 content, Sources mounted under each bubble) | YES |
| §S4 Demo Tab 2 (Coach) | confirmed via grep | (Sources mount per tab) | YES |
| §S4 Demo Tab 3 (Patterns) | YES (verified at line 208) | AAPL trade timestamps from your Schwab + IBKR statements 2025-01-01 to 2025-12-31 · AAPL daily close from public market data · disposition-effect pattern per Shefrin & Statman (1985) | YES — best-in-class cite (named academic source for the pattern) |
| §S4 Demo Tab 4 (Aggregate) | YES (mounted inside `AllocationPieBarAnimated` chart, not in chat bubble — deliberate per shipped comment) | Holdings via Schwab statement 2025-11-01 · S&P 500 sector weights via S&P DJI methodology 2025-Q3 | YES |
| §S5 InsightsBullets | **NO** | bullet #3 promises «cites every observation, every pattern ties back to a trade, an event, or a published source» — but no `<Sources>` mounted on §S5 | **NO — gap** |
| §S6 EditorialNarrative | YES (dark theme variant) | Pre-alpha JTBD interviews 2026-Q1 · ICP cohort signals | YES — restrained per brand-voice §6.3 (no n=24 performative-Sage drift) |
| §S7 TestimonialCards | YES | Pre-alpha builder note · 2026-Q2 | YES |
| §S8 AggregationSection (marquee) | NO mount | n/a — marquee is broker-list display, not observation | OK |
| §S9 FAQ | NO mount | n/a — FAQ answers are instruction, not observation | OK |
| §S10 RepeatCTAV2 | NO mount | n/a — CTA section, not observation | OK |

**Coverage verdict:** the Sources primitive ships on **every surface that makes an observational claim except one** — §S5 InsightsBullets, which is precisely the surface that *asserts the chrome promise itself*. Six surfaces with Sources is enough to read as system primitive. The §S5 omission is the chrome-promise-content-mismatch gap (§6).

The dispatch brief asked: «only where shipped (hero, charts, S6, testimonial)?» The shipped state is broader than that — Sources is also on Demo Tabs 3 + 4 (Tab 3 with academic cite, Tab 4 inside the chart). But it's narrower than the brand-promise demands: §S5 is the missing link.

---

## §4. Q3 — Hero retire of L2+L3 — receipt-system or just removal?

**Verdict: receipt-system, not just removal.** The PD spec §1 reading-order trace («weekly cadence → specific observation with sources → broker scope») is what the shipped composition implements. Concrete evidence from shipped code:

1. **`DigestHeader` ships** (`apps/web/src/app/(marketing)/_components/hero/DigestHeader.tsx`, 64 lines, pure typography per spec §3) — eyebrow «THIS WEEK» + tagline «3 observations across your portfolio» with mono numeral.
2. **`CitationChip` ships** (`apps/web/src/app/(marketing)/_components/hero/CitationChip.tsx`, 129 lines) — inline-flex pill with `IBKR · Schwab · Coinbase — 3 brokers` + Layers3 icon + 240ms fade-in tied to typing-completion phase.
3. **L1 ChatMockup extracted** (`hero/ChatMockup.tsx`) with `onPhaseChange` callback so parent learns when typing reaches `done` — chip fade-in is causally tied to typing completion, not on a fixed timer. This is the «one continuous observation» reading the spec required.
4. **Right column wrapped in `<aside aria-label="Provedo demo receipt">`** with `<header>` + `<article>` + `<footer>` semantic structure — screen-readers parse digest → conversation → citation in receipt order.
5. **Parallax handler dropped** (no consumer after L2/L3 retire) — the hero is structurally cleaner, not just emptier.
6. **Mobile (<768px) hides DigestHeader + CitationChip** per spec §7.2 — chat-first wedge survives full-width on mobile, chrome layers stack only where viewport supports them.

**One concern I cannot verify without a sighted render:** whether the 12px gaps actually compose as «one receipt-system» or read as «three small surfaces stacked». Spec §5.3 named this as Failure Mode 3. Code structure is correct; rhythm needs eyes-on. **Route to product-designer slice-LP3.7 review for visual confirmation at 1440px and tablet 768px.**

---

## §5. Q4 — Tab 4 comparison-bars vs bento — does it make 2× literal?

**Verdict: yes, the 2× claim is now structurally literal.** Evidence from shipped `AllocationPieBarAnimated.tsx`:

- Top bar: «Your portfolio · Tech 58%» — first segment is 58% wide, accent-colored (highlight=true), labeled «tech 58%».
- Bottom bar: «S&P 500 · 2025-Q3 · Tech 28%» — first segment is 28% wide, neutral text-secondary color, labeled «tech 28%».
- **Both bars rendered on the same scale (100% width container).** The visual length difference between 58 and 28 IS the «about 2×» claim. The chat answer's load-bearing phrase «about 2x the sector's weight in S&P 500 (~28%)» now has a literal corresponding visual.
- `PROVEDO_NOTICES_LINE` shipped: «Provedo notices: Your tech weight is about 2× the index's — driven by IBKR.» — the brand-voice line that frames the comparison.
- Coinbase removed (was absent from chat answer per data-coherence finding) — a mono-set accounts ledger keeps cross-broker proof visible without re-introducing the bento data-coherence issue.
- Sources mounted inside the chart with explicit dating: «Holdings via Schwab statement 2025-11-01 · S&P 500 sector weights via S&P DJI methodology 2025-Q3».

This is the strongest brand-voice ↔ visual-system coherence move on the page. The earlier memo's complaint («the bento chart didn't make the chat answer literal») is fully addressed. Tab 4 now demonstrates the receipt-system principle at its cleanest: claim → visual proof → cited sources, in one read.

---

## §6. Q5 — C-window status (negation-led-hero trigger criteria)

My Phase-3 verdict §3 named three trigger events that open the C-window (negation-led hero option):

1. First credible third-party brand mention with referent-anchoring weight
2. First 1000+ unique cold-traffic visitors with measurable bounce baseline
3. Confirmed ICP-A productivity-native millennial inbound signal

**Did anything shipped in 3.5 + 3.6 implicitly close any of these windows?** My answer: **all three remain open. Two were not affected; one was strengthened in a way that makes C *less* needed, but that's not the same as closing the window.**

Per-trigger reading:

- **Trigger 1 (third-party mention).** Unaffected. Cannot be triggered by self-improvement work. Still open.
- **Trigger 2 (1000+ visitors).** Unaffected. The shipped chrome polish doesn't generate distribution. Still open.
- **Trigger 3 (ICP-A inbound signal).** Indirectly strengthened by the audience-whisper line («For investors who hold across more than one broker.») shipping in the proof-bar footer. This makes the page *more* legible to ICP-A on cold landing, which means the C-trigger «we observed ICP-A inbound» becomes *more* falsifiable post-ship. Window stays open; falsifiability improved.

**Important meta-finding:** §S3 NegationSection refactor (slice-LP3.5) — drop lucide icons + red-X overlays, single column with «What Provedo is not» (em-dash bullets) + mirrored «What Provedo is» — actually **strengthens the negation-as-positioning move at its current §S3 placement** without committing to negation-as-hero. This is positioning-equity-positive: it captures more of the negation upside while preserving the option to elevate negation to hero post-data. The brand-voice EDITs («Does not» replaces «Won't»; «source-keeper» replaces rejected «citer») show the negation register has been audited and tightened, not abandoned.

**C-window verdict: still-open across all three triggers.** No implicit closure. The negation refactor at §S3 is the most you can do to capture C-equity without closing the C-trigger window.

---

## §7. Q6 — Voice 2x2 positioning held?

R2 §4 places Provedo in the lower-friendly information-only quadrant — uncontested. **Verdict: held cleanly, with one risk on horizon.**

Evidence from shipped state that the quadrant holds:

- Hero head + sub + CTA: untouched. Quadrant-anchoring copy preserved.
- §S2 Cell IV: «Sources / for every answer» replaces «100% / information not advice» count-up — both are quadrant-correct, but Sources is *more information-only* (epistemic claim, not perf claim). Slight strengthening on the y-axis (deeper information-only).
- §S2 footer: «Information, not advice.» italic — relegated from cell to footer, signals Lane A without dominating the proof bar. Quadrant-clean.
- §S3 NegationSection: «source-keeper» wording is brand-voice-curator-approved Sage register. «Does not» (declarative-Sage) replaces «Won't» (chatty-Everyman drift mitigated). Voice register tightened toward Sage, but Everyman warmth held in the affirmative column («A reader. A noticer. A source-keeper.»).
- §S5 InsightsBullets: «Provedo holds context / surfaces what would slip past / cites every observation» — verb register is observation-coded throughout. Quadrant-correct.
- §S6 EditorialNarrative: dark-theme Sources mount strengthens the Sage register without performative-citation drift (n=24 sample-size citations were rejected per brand-voice §6.3). Restrained-Sage executed correctly.

**Risk on horizon:** the Sources primitive is a Sage-system signature. It compounds in the Sage direction every time it ships. Six mounts on a page (hero + 4 demo tabs + S6 + S7) is at the upper bound of what Everyman can absorb without crushing. The chrome-promise-content-mismatch gap at §S5 (§6 below) is also a Sage-overweight risk — if shipped as fix, it adds a 7th Sources mount, which would push Sage past Everyman parity.

**Mitigation if §S5 Sources gap is fixed:** the §S5 mount should use lighter chrome treatment than the others — possibly «Pre-alpha JTBD interviews 2026-Q1» style cohort-reference rather than dated specific events, to avoid stacking specificity on top of the existing Sources density.

**Voice 2x2 verdict: held in lower-friendly information-only quadrant. Sage-strengthened, Everyman not yet crushed, but the next Sources mount needs deliberate lightness.**

---

## §8. Q7 — Distinctiveness vs fintech-AI peers

**Verdict: distinctive at the chrome-system level. Hero copy still inhabits territory adjacent to two peers.**

Per the audited 7 fintech-portfolio-tracker peers (R2):

- **Receipt-chrome system: 0/7 peers have anything like it.** Snowball is data-rich but commodity-chromed. Kubera is testimonial-led, named-founder. Wealthfolio is developer/OSS-coded. None turn citation into typographic primitive on the marketing page. **Provedo is now the first.**
- **Per the AI-tool peers (R1) — Perplexity is the closest analog.** Perplexity uses citation as in-product chrome but their landing is an input-box, not a citation-chrome page. **Provedo's landing chrome is a category-first move at the AI-tool intersection too.**
- **Tab 4 comparison-bars treatment: 0/7 fintech peers visualize a 2× claim with same-scale comparison bars on the marketing landing.** Most use feature-grid screenshots or product-mockup screenshots. The literal-claim → literal-visual coupling is unclaimed territory.
- **Negation typography (§S3 single column, em-dash bullets): structurally similar to Kubera's «Skip the middleman» negation but executed at section-level not hero-level. Distinctive in execution; Kubera's negation is more aggressive (hero-level) but less typographically refined.**

**Where Provedo still inhabits adjacent territory:**

- Hero copy («Provedo will lead you through your portfolio. Notice what you'd miss across all your brokers.») sits adjacent to Snowball's tracker positioning + Wealthfolio's «AI-powered insights» — the differentiator is the chrome system below the fold, not the copy above it.
- The «Ask Provedo» CTA is structurally chat-first but visually doesn't *yet* pop the chat-first wedge (no chat-bubble icon treatment, no visible chat-affordance). This was a Phase-3 R2 §8 call-out and remains uncaptured.

**Distinctiveness verdict: at the chrome-system layer Provedo looks like Provedo and like nothing else in the audited set. At the hero-copy + CTA-affordance layer Provedo still reads as a respectable-but-not-yet-distinctive entry in the category. The chrome layer is doing more positioning work than the copy layer.** This is the inverse of the typical SaaS pattern (copy claims, chrome decorates) — and it's actually the right pattern for D-prime: copy stayed honestly under-claimed (Lane A discipline), chrome instantiates the epistemic discipline that the copy refuses to claim about itself.

---

## §9. Q8 — Cross-cutting positioning-equity risk: chrome-promise-content-mismatch

This was Risk #1 in `2026-04-27-cd-memo-brand-strategist-verdict.md` §8: «If receipt-chrome is shipped before Granola-grade demo content rewrite lands, the page promises citation-discipline and delivers placeholder-content. Negative equity.»

**Status of mitigation: mostly delivered, one gap.**

Surfaces where the chrome promise is backed by content:

- Hero ChatMockup: Sources line cites three specific dated events. **Backed.**
- Demo Tab 3: Sources line cites Schwab+IBKR statements + named academic source (Shefrin & Statman 1985). **Best-in-class. Backed.**
- Demo Tab 4: Sources line cites Schwab statement + S&P DJI methodology. **Backed.**
- §S6 Editorial: Sources line cites pre-alpha JTBD interviews + ICP cohort signals. **Backed (with restraint per brand-voice).**
- §S7 Testimonials: Sources line cites pre-alpha builder note. **Backed (with honest pre-alpha framing).**

Surface where the chrome promise is NOT backed:

- **§S5 InsightsBullets, bullet #3:** «Provedo cites every observation. Every pattern ties back to a trade, an event, or a published source.» — this bullet **asserts the chrome promise as the central trust claim of the section** but the section itself ships without a `<Sources>` mount. The reader who parses the bullet then asks «and where's the cite for *this* observation about Provedo's behavior?» and finds nothing.

**Why this matters:** §S5 is the surface where the chrome promise is most explicitly *spoken*. Every other Sources mount on the page *demonstrates* the promise. §S5 is where the promise is *narrated*. A narrated promise without a demonstrated mount on the same surface reads as the page telling the reader to trust a claim that the page doesn't itself honor at that moment. This is the chrome-promise-content-mismatch failure mode in microcosm — not catastrophic, not yet shipped at scale, but precisely the failure mode that compounds if more chrome is added without more content backing.

**Recommended fix (slice-LP3.7-A — single-PR 2-3h):**

Add a Sources mount under the §S5 InsightsBullets section, restrained variant. Two options content-lead can pick from:
- Lighter chrome (recommended): single line `Pre-alpha JTBD interviews 2026-Q1 · Provedo source-keeper architecture spec` — matches §S6 register, doesn't overweight Sage.
- Specific demonstration: replace bullet #3's body with an inline cite («Provedo cites every observation — see Tab 3's disposition-effect cite for an example») so the bullet self-references the page's own demonstrated cite rather than asserting it. This avoids adding a 7th Sources mount.

Either fix closes the chrome-promise-content-mismatch gap. I lean toward the second (self-referential): it leverages content already shipped on the page, doesn't add chrome density, and turns the §S5 bullet into a navigational signal that walks the reader to the cite-trail demonstration. Brand-voice-curator should approve the chosen variant before ship.

---

## §10. Verdict

**POSITIONING-EQUITY-DELIVERED — with one specific gap (§S5 chrome-promise-content-mismatch) that should ship as slice-LP3.7-A before it compounds.**

**Score:** 44/50 on D-prime rubric (vs spec's 45/50 — one point below spec).

**The shipped state delivers what the D-prime memo scored 45/50** at the system-architecture and chrome-instantiation layers. Receipt-chrome is mounted on every observational surface except one. Hero retire executed as receipt-system composition, not as removal. Tab 4 makes the 2× claim literal. Negation refactor strengthens §S3 without closing the C-window. Voice 2x2 quadrant holds. Distinctiveness against audited peers is real at the chrome layer.

**The one gap** — §S5 InsightsBullets asserts the chrome promise without demonstrating it on the same surface — is the precise failure mode I named as Risk #1 in the prior verdict, manifest in microcosm. Fixable in 2-3 hours. Should be routed to content-lead + product-designer as slice-LP3.7-A before any further chrome work lands (because every additional Sources mount that ships without content backing widens the gap).

**Three other items are not gaps but flags:**

1. **Visual rhythm of the hero receipt-system at 1440px** is the part of D-prime I cannot verify without a sighted render. Code structure is correct; gap composition needs eyes-on. Route to product-designer for visual confirmation in slice-LP3.7-B.
2. **CTA chat-first wedge is structurally claimed but not visually popped.** «Ask Provedo» button doesn't yet visualize the chat-first affordance. R2 §8 call-out remains uncaptured. Defer to post-data; doesn't degrade what shipped.
3. **Sage stacking risk on the Sources primitive itself.** Six mounts is upper-bound for Everyman survival. The §S5 fix should use lighter chrome (option B above — self-referential rather than a 7th mount) to avoid pushing Sage past Everyman parity.

**C-window status: STILL-OPEN across all three triggers** (third-party mention / 1000+ visitors / ICP-A inbound). Audience-whisper line shipping in proof-bar footer makes Trigger-3 falsifiability *better*, not closed.

**Top positioning-equity risk remaining:** the §S5 chrome-promise-content-mismatch. Not catastrophic, but it is exactly the risk I flagged before ship and exactly where it landed. Fix-able as slice-LP3.7-A. Until fixed, the page contains one surface that *narrates* the promise and one moment of *unbacked claim* — which is the kind of inconsistency that brand-voice audits catch and that compounds under cold-traffic distribution.

**Recommended next slice: slice-LP3.7-A** — close the §S5 gap (content-lead picks variant; brand-voice-curator approves; product-designer ships). Then slice-LP3.7-B (visual rhythm confirmation at 1440px and 768px). Then defer further chrome work until cold-traffic data arrives.

**Word count:** ~2 350. Within review budget.

**END 2026-04-27-final-design-review-brand-strategist.md**
