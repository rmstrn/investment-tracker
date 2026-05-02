# TD-099 Forbidden-Vocabulary Workshop — Finance Angle

**Author:** finance-advisor
**Workshop:** TD-099 Lane-A enforcement gate at api-client trust boundary (renderer-layer regex against AI-generated `meta.title` / `meta.subtitle` / `meta.alt` / `CalendarEvent.description` / scatter `referenceLines.label` / `meta.factualCaption`).
**Inputs reviewed:**
- Prior audit `docs/reviews/2026-04-29-finance-charts-lane-a-audit.md` §4 rule 4 (vocab regex sole-gate), §2.7 T-1 (treemap staleness), §2.10 W-1 (waterfall conservation prose).
- Existing prescriptive-verb taxonomy in `docs/finance/AI_CONTENT_VALIDATION_TEMPLATES.md` §3.1–§3.4 (general advice-tone framework).
- Finding N1 in audit: «renderer-layer prose-vocabulary regex absent» — this proposal supplies that regex content.
**Status:** PROPOSED (parallel-isolated; right-hand synthesizes against legal-advisor + content-lead drafts).
**Out of scope:** general-prose advice verbs already covered in `AI_CONTENT_VALIDATION_TEMPLATES.md` §3.1–§3.2 — this proposal supplements with finance-specific vocabulary that the existing list does NOT catch.

---

## 0. Premise + scope clarification

The existing blacklist (`AI_CONTENT_VALIDATION_TEMPLATES.md` §3) catches the obvious advice tokens: `recommend / suggest / advise / should / must / buy / sell / hold / rebalance / allocate / reduce / increase / diversify-imperative / trim / add-imperative / target`. That list is jurisdiction-tested and stays.

What the existing list does NOT catch is finance-domain-specific verb tokens that masquerade as factual analytics but encode forward-looking position guidance. These are the gaps that would slip through if the renderer regex used only §3 vocabulary. This proposal adds a **finance-specific layer** on top.

Three failure modes drive this list:
1. **Forward-looking statements masquerading as descriptive** — verbs that are tense-ambiguous and let the AI agent slip from past-tense factual into future-tense predictive without using an obvious advice verb.
2. **Implied position guidance via comparison** — verbs like «outperform» / «lag» that judge user holdings against an implicit benchmark, where the comparison itself reads as «this thing is better; act on it».
3. **Quantitative-finance jargon that masks advice tone** — TA-indicator vocabulary («overbought», «breakout», «support») has zero descriptive purpose in a Lane-A product; its entire function is action-prompting. This family deserves its own constant.

---

## 1. Proposed FORBIDDEN_VERBS — finance angle

### Tier 1 — financial advice-mode triggers (always block)

These verbs, in financial context, signal advice-mode regardless of grammatical position. Block on substring match (case-insensitive, with word boundaries) at the renderer trust boundary.

**English:**
- **target** / **targets** / **targeting** — implies forward position guidance («target 10% gold», «targeting Q4 entry»). Already in `AI_CONTENT_VALIDATION_TEMPLATES.md` §3.2; reaffirmed here for finance.
- **project** / **projects** / **projecting** / **projection** / **projected** — forward-looking forecast verb («projected returns of X%»). Hard fail in Lane A because Provedo «does not predict» (anti-positioning lock).
- **forecast** / **forecasts** / **forecasting** / **forecasted** — same family.
- **predict** / **predicts** / **predicting** / **prediction** / **predicted** — same family. Anti-positioning lock explicitly rejects «price predictor».
- **outperform** / **outperforms** / **outperforming** / **outperformed** — comparison with implicit position guidance («NVDA outperformed your portfolio» reads as «you should have held more NVDA»). Past-tense usage borderline; gerund/future tense always blocked.
- **underperform** / **underperforms** / **underperforming** / **underperformed** — symmetric with outperform; same Lane-A drift surface.
- **beat** / **beats** / **beating** — finance idiom for outperformance («the S&P beat your portfolio»). Implicit «winners and losers» framing.
- **lag** / **lags** / **lagging** / **lagged** — symmetric finance idiom for underperformance.
- **trail** / **trails** / **trailing** — same idiom family («your portfolio trails the benchmark by X%»). NOTE: «trailing» as in «trailing 12-month return» is a valid technical descriptor; regex must guard against the comparative-verb usage only. Recommendation: block `trail(s|ing|ed)\s+(the|your|its|by)` pattern; permit `trailing\s+(12|6|3|N)-(month|year)` and `trailing\s+(yield|return|P/E|stop)` as factual descriptors via allow-list exception.
- **suggests** / **suggesting** — already in §3.1 advice list, but flagged here for finance because the construct «momentum suggests», «mean reversion suggests», «risk-adjusted return suggests» appears repeatedly in TA jargon. Block at finance layer too (defense-in-depth).
- **signals** / **signaling** / **signalled** — TA-jargon predicate verb («the chart signals a breakout»). Pure action-prompting; zero factual content.
- **anticipates** / **anticipating** — softer forecast verb but functionally identical to «predict» when applied to instruments.

**Russian (CIS context — even though Russia is OUT OF SCOPE per 2026-04-23 Q7, the Russian layer covers RU-language CIS markets within Lane A; RU prompts on the Lane-A surface should still be blocked for the same reasons):**
- **прогнозирую / прогнозирует / прогнозируется / прогноз** — direct forecast verb family.
- **предсказываю / предсказывает / предсказание** — direct prediction verb.
- **нацелено / нацелен / нацелена** — «targeted at», forward-position guidance.
- **превзойдёт / превзошёл / превосходит** — outperform family («NVDA превзойдёт S&P»).
- **обыграет / обыграл / обыгрывает** — RU finance idiom «to beat (a benchmark)»; pure action-prompting framing in trader slang.
- **обгонит / обогнал / обгоняет** — same idiom family («ваш портфель обогнал индекс»).
- **отстаёт / отстал / отставание** — underperform/lag family.
- **сыграет / сыграл / сыграло** — RU trader idiom («акция сыграет на росте» = «this stock will play out on the upswing»). Pure forward-looking position guidance in slang form. **Particularly insidious because it sounds folksy** rather than technical — easy to slip past a generic English regex.
- **вытянет / вытянул / вытягивает** — RU trader idiom («дивиденды вытянут портфель» = «dividends will pull the portfolio up»). Same shape as «сыграет».
- **выстрелит / выстрелил** — RU trader idiom «to shoot up» (price spike prediction). Block.
- **просядет / просел / проседает** — RU trader idiom for «to dip» as forward expectation. Block when forward-tense; permit past-tense factual («акция просела на 3% вчера» = descriptive).

**Tier-1 count:** **30 EN tokens + 21 RU tokens = 51 total** (counting verb stems with their morphological variants as single tokens).

### Tier 2 — financial framing borderline (block in advice-position context, OK in factual)

These verbs are tense-and-context dependent. Pure factual usage is fine; predictive usage crosses Lane A. Renderer regex MUST gate on grammatical context (best signal: surrounding noun phrase).

- **expect** / **expects** / **expected** / **expecting** — OK: «dividend expected on date X» (calendar event mechanic, schedule-based fact). NOT OK: «expect outperformance», «expected returns of N%». Recommendation: regex blocks `expect(s|ed|ing)?\s+(outperformance|underperformance|gains|losses|returns|growth|decline|appreciation|depreciation)`; permits `expected\s+(payment\s+date|ex-date|pay\s+date|dividend|distribution|coupon|maturity)`.
- **anticipate** / **anticipates** / **anticipated** — borderline same shape as expect. In English finance prose, «anticipated dividend» is acceptable corporate-actions vocabulary; «anticipated returns» is forecast.
- **due** — calendar fact «coupon due on date X» = factual; «position due for a correction» = forecast slang. Block second pattern.
- **set to** — finance journalism idiom («NVDA set to report earnings» = factual schedule fact; «set to outperform» = prediction). Block predictive usage.
- **looking** — «looking strong» / «looking weak» = evaluative momentum read; «looking forward to next ex-date» = factual schedule. Block evaluative.
- **poised** — almost always evaluative-predictive in finance prose («poised for breakout»). Functionally Tier-1 but kept here because some neutral usages exist («poised at $50 support» — actually this is also TA, see Tier 3). Recommendation: simplify by promoting **poised** to Tier 1.
- **positioned** — «positioned for growth» = predictive evaluation; «positioned in tech sector» = factual category description. Block first pattern.
- **expectations** (noun) — «consensus expectations», «Street expectations» — sourced sell-side benchmark; permitted ONLY if cited (`source:` field populated) and used purely descriptively. Block bare «expectations are high».

**Russian:**
- **ожидается / ожидается** — «ожидается выплата дивидендов» = factual schedule; «ожидается рост» = forecast. Block second.
- **прогнозируется** — almost always predictive; effectively Tier-1 in RU. Recommendation: promote to Tier 1.
- **должен / должна / должно** — modal «should» (already covered in §3.1 RU equivalent, double-flagged here).
- **готов / готова / готово к** — «готов к росту» = predictive («ready for growth»). Block.

**Tier-2 count:** **13 EN tokens + 6 RU tokens = 19 total** (variable-context).

### Tier 3 — instrument-specific concerns (TA-indicator family — separate constant)

This family is qualitatively different from Tiers 1–2. TA-indicator vocabulary has zero descriptive purpose in a Lane-A information-only product. Its entire pragmatic function is to prompt user trading action. For a portfolio tracker that explicitly excludes TA per `CHARTS_SPEC.md` §4.8 structural exclusions (no `supportLine`, `resistanceLine`, `trendLine`, `rsi`, `macd`, `bollinger`, `signalAnnotation`), TA-indicator prose vocabulary in `meta.title` / `meta.subtitle` is the prose-side equivalent of what the schema already structurally excludes on the data side.

**Recommendation: TA-indicator verb list lives in a SEPARATE constant** (`FORBIDDEN_TA_VOCABULARY`) from the general advice-tone list (`FORBIDDEN_VERBS`). Rationale:
1. **Different remediation path.** General advice verbs get rephrased to observation verbs (§4 softening table). TA-indicator verbs have NO Lane-A-safe rephrasing — the underlying concept itself is action-prompting. There is no descriptive equivalent of «overbought» that is Lane-A-clean.
2. **Different audit cadence.** Tier-1/Tier-2 lists evolve as the AI agent's prose patterns drift; TA-indicator list is essentially static (the TA vocabulary has been stable for 40 years).
3. **Different failure-mode messaging.** When the renderer logs a Tier-1 violation, the alert reads «advice-tone verb detected». When it logs a TA-indicator violation, the alert reads «TA-vocabulary detected — chart-spec structural-exclusion bypass attempt» (this is a distinct severity class, paired with `CHARTS_SPEC.md` §4.8 candle exclusions).

**TA-indicator family — block in ALL prose fields:**

- **overbought** / **oversold** — RSI / stochastic indicator language; pure action prompts.
- **breakout** / **broke out** / **breaking out** / **breakdown** / **broke down** — TA pattern language; predicts continuation.
- **support** (as TA noun: «$X support level») / **resistance** (as TA noun: «$Y resistance»). NOTE: «support» and «resistance» have legitimate non-TA usages in product copy («customer support», «multi-currency support»); regex must guard finance context only. Recommendation: block patterns `\$[\d.,]+\s+(support|resistance)`, `(support|resistance)\s+(level|zone|line|band)`, `(at|above|below|near|tested)\s+(support|resistance)`.
- **breakout** + price target — block.
- **trend** (as TA verb: «trends higher / lower») / **trending** — block as predicate; permit «sector trend chart» descriptor.
- **momentum** (as predictive noun-phrase head: «momentum is building», «momentum signals», «momentum favors») — block. Permit purely-descriptive «momentum factor exposure: 0.34» if sourced.
- **mean-reverting** / **mean reversion** (as predictive: «mean reversion suggests pullback») — block predictive usage.
- **bullish** / **bearish** — sentiment forecast vocabulary; purely action-prompting.
- **rally** (as predictive verb: «set to rally») — block predictive; permit past-tense factual («rallied 4% yesterday»).
- **correction** (as predictive: «due for a correction») — block predictive; permit past-tense factual («10% correction in March»).
- **pullback** / **dip** (as predictive: «expect a pullback») — block predictive.
- **uptrend** / **downtrend** — TA pattern nouns; block.
- **golden cross** / **death cross** — TA technical patterns; block in all positions (no factual usage in a Lane-A product).
- **divergence** (as TA: «bullish divergence», «RSI divergence») — block in TA context; permit finance-statistics context («tracking-error divergence vs benchmark») if factual.
- **buy signal** / **sell signal** / **trade signal** — explicit action prompt; block.
- **entry point** / **exit point** — explicit action prompt; block.
- **stop loss** / **take profit** (as imperative recommendation: «set a stop loss at $X») — block when prescriptive; permit factual descriptive («your trailing-stop order at broker is $X») if user supplied.
- **alpha** / **beta** as predictive predicates («alpha is positive — outperformance») — block predictive framing. Permit factual descriptor («3-year beta vs S&P: 1.12, source: [provider]»). Note: this is the most context-sensitive item in the family; renderer regex should block `(alpha|beta)\s+(suggests|indicates|signals|favors|points\s+to)` while permitting `(alpha|beta)\s*[:=]\s*[\d.]+`.
- **risk-adjusted return suggests** — block as compound predicate.
- **Sharpe-improvement opportunity** / **Sortino opportunity** — block (the word «opportunity» here is the action prompt; would also be flagged by Tier-1 logic if «opportunity» were added to the general advice list, but TA framing makes it specific to this family).
- **factor tilt suggests** / **factor exposure favors** — block predictive framing on factor analytics.

**TA-family count:** **~30 EN tokens** (variable due to multi-word patterns). RU TA vocabulary is largely English-loaned in Russian financial slang (трейдеры используют «бычий / медвежий рынок», «уровень поддержки», «уровень сопротивления», «прорыв», «откат») and should be added in a follow-up if RU surface enables; for MVP the EN list is the priority.

**RU TA-loanwords (tier-3 RU):**
- **бычий / медвежий** (рынок, тренд) — bullish/bearish.
- **прорыв / пробой** — breakout.
- **откат** — pullback.
- **уровень поддержки / сопротивления** — support/resistance.
- **сигнал на покупку / продажу** — buy/sell signal.
- **точка входа / выхода** — entry/exit point.

---

## 2. Approved verbs — what AI agent CAN use (factual-only)

Mirrors `AI_CONTENT_VALIDATION_TEMPLATES.md` §2.1 observation whitelist; reaffirmed here as the positive list the AI prompt template should pull from for chart prose fields.

### Observation verbs (always safe)
- **observed** / **observes** / **observing** — Provedo brand voice anchor verb.
- **noticed** / **notices** — same brand voice.
- **highlighted** / **highlights** / **highlighting** — neutral surfacing.
- **surfaced** / **surfaces** — same.
- **showed** / **shows** / **shown** — display-only verb.
- **displayed** / **displays** — same.
- **described** / **describes** — descriptive.
- **decomposed** / **decomposes** — financial decomposition (waterfall use case).

### Comparison verbs (safe when factual + sourced)
- **compared to** / **versus** / **vs** — neutral comparison; safe with citation.
- **moved** / **changed** — past-tense factual («NVDA moved +12% in Q1»).
- **increased** / **decreased** / **rose** / **fell** / **declined** / **gained** / **lost** — past-tense factual. NOTE: `lost` and `declined` are safe in past-tense; **«losing» (gerund/predicate)** is flagged in §3.4 of `AI_CONTENT_VALIDATION_TEMPLATES.md` per legal review.

### Explanatory verbs (safe, educational)
- **explains** / **explained** — Provedo brand voice.
- **clarifies** / **clarified** — same.
- **defines** / **defined** — same.
- **cites** / **cited** — sourcing verb (Provedo brand promise).
- **references** / **referenced** — same.

### Performance-attribution allowed-verbs (descriptive past-tense ONLY)
This is the load-bearing list for waterfall / cash-flow attribution prose, where the temptation to slip from descriptive to predictive is highest:

- **drove** (past tense only) — «Tech sector drove +8% of YTD return» = factual decomposition. Block `drives` / `will drive` (predictive).
- **contributed** / **contributed to** — neutral attribution past-tense.
- **accounted for** — same.
- **comprised** / **comprised of** — composition, factual.
- **consisted of** — same.
- **decomposed into** — financial decomposition predicate (waterfall).
- **realized** (gain/loss) — accounting term, factual.
- **recognized** (gain/loss/dividend) — accounting term, factual.
- **received** (dividend / distribution / coupon) — past-tense factual.
- **declared** (dividend) — past-tense corporate-action factual.

**Approved-verbs sample size:** **~32 verb tokens (EN)** across the four categories above. Russian observational counterparts (наблюдаю / отмечаю / показывает / отображает / объясняет / поясняет / сравнивает / содержит / получено / признано) follow the same shape; not enumerated exhaustively here.

---

## 3. Renderer regex placement (cross-ref to architect Δ4)

Per architect's Δ4 (dual-side validation), Pydantic AI-side validates structure, Zod FE-side validates structure + cross-field math. **Neither natively guards prose vocabulary.** The renderer-layer regex is the SOLE prose vocabulary gate — see audit §4 rule 4 + Δd reasoning.

**Recommended placement:** at the api-client trust boundary (TD-099), before the validated payload reaches the renderer dispatcher. Two-stage check:

1. **Stage 1 — `FORBIDDEN_VERBS` (Tier 1 + Tier 2 conditional patterns).** On match, render §3.11 error state with code `LANE_A_PROSE_VIOLATION_GENERAL`. Log to monitoring.
2. **Stage 2 — `FORBIDDEN_TA_VOCABULARY`.** On match, render §3.11 error state with code `LANE_A_PROSE_VIOLATION_TA_VOCABULARY` (distinct from Stage 1; signals «structural-exclusion bypass attempt», higher severity for monitoring/alerting).

Both stages run on the same fields: `meta.title`, `meta.subtitle`, `meta.alt`, `meta.factualCaption`, `CalendarEvent.description`, `scatter.referenceLines.label` (V2; relevant when scatter feature-flag enables), and any future text-prose field the AI agent populates. **Field allow-list is also enforceable** — if the AI agent emits a prose field NOT on the allowed list, that's also a violation (defense against future schema additions sneaking through).

---

## 4. Cross-team flags

### For architect
- The TD-099 regex layer is the **third validation layer** (Pydantic + Zod + regex). Architect's Δ4 documents the first two; this proposal documents the third. Recommend the contract package exposes `FORBIDDEN_VERBS` and `FORBIDDEN_TA_VOCABULARY` as exported constants from `packages/shared-types/src/lane-a-vocabulary.ts` so renderer + tests + CI all use the same source of truth. Single source of truth → single update path → no drift between regex and tests.

### For tech-lead (FE kickoff acceptance criteria)
- Renderer dispatcher's pre-render check runs the regex BEFORE rendering any chart prose. Test fixtures: ship at least 3 deliberately-poisoned payloads per tier (Tier-1 hits, Tier-2 contextual hits + non-hits, Tier-3 TA-vocabulary hits) as block-CI fixtures.
- Performance budget: regex runs are O(N×M) on prose-field-count × pattern-count. For ~6 prose fields × ~80 patterns, this is sub-millisecond per chart. No perf concern.

### For legal-advisor
- TA-vocabulary as a separately-classed violation (Stage 2 above) carries additional regulatory weight: TA-indicator language in CIS jurisdictions (CBR Russia interpretation per `AI_CONTENT_VALIDATION_TEMPLATES.md` §3.2 notes on `hold`) is particularly sensitive. Russia is OUT OF SCOPE per 2026-04-23 Q7, but the structural separation positions Provedo well for future RU re-entry if PO opens that door.
- Confirming the Tier 1 / Tier 2 bilingual list against MiFID II / FCA PERG 8.30A / SEC investment-advice definitions is the legal-advisor's parallel deliverable; this proposal supplies the financial-domain content but does NOT validate jurisdictional sufficiency.

### For content-lead
- Provedo brand voice anchor verbs («notices», «observes», «remembers», «highlights», «surfaces», «cites») are reaffirmed in §2 above. Content-lead's parallel deliverable should mirror the approved-verbs list; if content-lead has Provedo-specific voice constraints that NARROW the approved list further, that narrower list wins.

---

## 5. Recommendation: separate constant for TA-indicator vocabulary

**YES — `FORBIDDEN_TA_VOCABULARY` MUST be a separate constant from `FORBIDDEN_VERBS`.** Rationale recap:

1. **Different remediation path.** General advice verbs have observation-verb rephrasings (§2.1 of `AI_CONTENT_VALIDATION_TEMPLATES.md`). TA-vocabulary has NO Lane-A-clean rephrasing — the concept itself is action-prompting.
2. **Different monitoring severity class.** TA-vocabulary detection paired with `CHARTS_SPEC.md` §4.8 structural exclusions = «structural-exclusion bypass attempt», higher severity.
3. **Different audit cadence.** General-advice list evolves; TA-vocabulary is essentially static (40-year-stable canon).
4. **Different alert messages.** Stage-1 violation: «AI emitted advice-tone prose, prompt-engineer please retune». Stage-2 violation: «AI emitted TA-vocabulary, prompt-engineer please rewrite Lane-A boundaries — this is a regulatory exposure».

Both constants live in the same module (`packages/shared-types/src/lane-a-vocabulary.ts`) but are exported separately and consumed separately by the renderer dispatcher.

---

## 6. Verification checklist (self-audit)

1. ✅ Tier-1 / Tier-2 / Tier-3 lists supplied with bilingual EN + RU coverage.
2. ✅ TA-indicator family separated as own list with rationale.
3. ✅ Performance-attribution allowed-verbs explicitly enumerated (§2 «Performance-attribution allowed-verbs»).
4. ✅ Recommendation on separate-constant question explicit (§5).
5. ✅ Cross-team flags routed (architect / tech-lead / legal-advisor / content-lead).
6. ✅ Hard rules respected: R1 (no paid services proposed); R2 (no PO-name external comms); R4 (no predecessor name references — sunk cost not relevant in this artifact); no velocity metrics.
7. ✅ Stay-in-role: domain SME on financial-advice tone; no code changes; output written only to `docs/reviews/`.
8. ✅ Lane-A discipline absolute: this artifact contains no advice-tone prose itself — all blocked verbs are referenced in mention-not-use form (quoted as targets of analysis).

---

## 7. Outstanding for right-hand synthesis

The right-hand synthesis pass should reconcile this finance-angle proposal against:
- **Legal-advisor's regulatory-angle list** — likely overlap on Tier 1; legal-advisor may have additional jurisdiction-specific verbs (e.g., FCA-specific framing language).
- **Content-lead's Provedo-voice-angle list** — likely overlap on approved verbs; content-lead may have voice-narrowing constraints that drop some approved verbs from the AI-prompt-allowed list.

**Conflict-resolution rule recommendation:** UNION on forbidden lists (most-restrictive wins); INTERSECTION on approved lists (only verbs all three SMEs accept survive into the AI prompt template).

**End of finance proposal. Two constants, three tiers, ~80 EN tokens + ~27 RU tokens forbidden, ~32 EN tokens approved. Renderer regex placement at TD-099 trust boundary, paired with architect's Δ4 dual-side validation as the third layer.**
