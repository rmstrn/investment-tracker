# TD-099 — FORBIDDEN_VERBS (Voice Angle)

**Author:** content-lead
**Date:** 2026-04-29
**Scope:** Lane-A enforcement gate at the api-client trust boundary. Provedo voice profile applied to AI-emitted strings (`meta.title`, `meta.subtitle`, `meta.alt`, `CalendarEvent.description`).
**Sister artifacts:** legal-advisor (regulatory angle), finance-advisor (financial-advice-tone angle). Right-Hand synthesizes.
**Voice anchors:** `02_POSITIONING.md` §«Tone of voice» + §61, `04_DESIGN_BRIEF.md` §2.1 / §2.2 / §0.2 / §521-576.
**Lane discipline:** AI describes / notices / surfaces / explains. AI never recommends, advises, urges, prescribes, or directs the user.

---

## Proposed FORBIDDEN_VERBS — voice angle

### Tier 1 — break Provedo voice immediately (always block, hard-fail)

These verbs collapse the Lane-A frame in a single token. They turn the AI from a describer into an advisor or commander. **Hard-block at api-client; reject the entire payload.**

**English (24):**
- recommend, recommends, recommending, recommendation
- suggest, suggests, suggesting, suggestion
- advise, advises, advising
- urge, urges, urging
- propose, proposes, proposing
- endorse, endorses, endorsing
- direct (verb), directs, directing
- instruct, instructs, instructing
- prescribe, prescribes, prescribing
- counsel (verb), counsels, counseling
- warn (when prescriptive: «warns you to sell»)
- caution (when prescriptive: «cautions against»)

**Russian (16):**
- рекомендую / рекомендуем / рекомендация / рекомендуется
- советую / советуем / совет / посоветую
- предлагаю / предлагаем (in advisory frame, not «I show»)
- настоятельно (intensifier — almost always paired with imperative)
- следует (impersonal modal: «следует продать» = «one should sell»)
- стоит (impersonal modal: «стоит купить» = «it is worth buying»)
- нужно / надо / необходимо (prescriptive impersonal)
- призываю / призываем (urge)

### Tier 2 — voice-tone violations (block unless wrapped in clearly-factual / 3rd-person-historical frame)

These are softer but still pull toward prescription. Block by default; allow only when the surrounding sentence is unambiguously descriptive (e.g. «historical pattern shows X tended to recover»). At api-client level, treat as hard-block — Tier 2 lift to Tier 1 because the api-client cannot judge surrounding frame.

**English:**
- should, must, need (modal of obligation)
- will (future-tense certainty: «X will recover», «X will outperform»)
- guarantee, guarantees, guaranteed
- ensure, ensures (when promising outcome)
- expect (when AI promises: «expect 8% returns»)
- outperform / underperform (predictive, not descriptive of past)
- deliver (in performance frame: «will deliver returns»)
- avoid (imperative: «avoid this asset»)
- consider (imperative-soft: «consider rebalancing»)
- review (imperative: «review your allocation»)
- check (imperative: «check this position»)

**Russian:**
- должны / должен / должна (must)
- обязательно / гарантированно (certainty intensifiers)
- избегайте / избегай (avoid, imperative)
- рассмотрите / рассмотри (consider, imperative)
- проверьте / проверь (check, imperative)
- обратите внимание (pay attention — soft imperative; use «note» / «отметим» instead)
- стоит обратить (worth-attending impersonal)
- будет / окажется (in predictive predicate over user portfolio: «будет расти»)

### Tier 3 — borderline (log + flag for human review; do not hard-block)

These pass in many contexts but warrant a soft-flag log so we can monitor drift. Log on every emission; sample for human review.

**English:**
- consider (when it appears in `meta.subtitle` or `description` — softer in `meta.alt`)
- might want to / may want to («you might want to look at» = imperative-soft)
- look at / take a look (imperative-soft when 2nd-person directed)
- explore (when directed at user: «explore alternatives»)
- promising / risky / strong / weak / attractive / underwhelming (value-judgment adjectives next to user holdings — flag, don't block, allow only with attribution «historically classified as»)
- opportunity (when used as a recommendation-implicit: «this is an opportunity»)

**Russian:**
- помните / запомните (remember, imperative) — soft but technically 2nd-person directive
- задумайтесь (think about it — imperative-frame even if reflective)
- обрати / обратите (pay attention)
- интересный / привлекательный / перспективный / рискованный (judgment adjectives over positions)
- возможность (opportunity-as-implicit-recommendation)

---

## Forbidden constructions

Beyond the verb-token list, the following grammatical patterns must be blocked at api-client even if the lemma list misses them:

1. **Second-person imperative in any tense** — EN: bare verb addressed to «you»; RU: any imperative verb form (`-й`, `-йте`, `-и`, `-ите` endings on action-verbs targeting user). The api-client must run a morphological check on RU strings and a lead-token check on EN.
2. **Modal verbs of obligation directed at user** — `should / must / need to / have to / ought` + user-action object; RU: `следует / нужно / надо / стоит / должны` + action.
3. **Value-judgment adjectives next to position names** — «strong buy», «weak signal», «promising stock», «risky position», «attractive entry», «underwhelming asset»; RU: «привлекательная позиция», «рискованный актив», «перспективная бумага». Allowed only when wrapped in attribution: «classified as X by [source]» / «historically labelled X».
4. **Future-tense certainty over user portfolios** — `will [outperform/recover/deliver/grow/drop]` as a flat predicate; RU: future-tense verbs in declarative mood over user holdings (`будет расти`, `окажется прибыльной`, `вырастет`). Allowed only with explicit hedge tokens (`projected`, `forecast`, `прогноз`, `по модели`, `в сценарии`).
5. **Russian-specific traps:**
   - **Diminutive forms** softening prescriptive verbs (`посмотрите-ка`, `обратите-ка внимание`) — block, the diminutive does not neutralize the imperative.
   - **Instrumental case implying agency-with-asset** («с этим активом стоит подождать» = «with this asset one should wait») — flag at parser; the «с + INSTR + следует/стоит» shape is a stealth recommendation.
   - **Reflexive verbs in advisory frame** (`рекомендуется`, `советуется`, `предлагается`) — these are already in Tier 1; reinforce that the impersonal-passive does not launder the verb.
   - **«Лучше» + infinitive** — («лучше продать», «лучше подождать») — soft imperative, treat as Tier 2.

---

## Voice-aligned substitute table

For each Tier-1 verb, a Provedo-voice replacement that an AI rewriter / prompt-template can use. Same lemma where possible across EN/RU.

| Forbidden (EN) | Provedo replacement (EN) | Forbidden (RU) | Provedo replacement (RU) |
|---|---|---|---|
| recommend | note / surface / show | рекомендую | отмечу / покажу / обращу внимание (factual) |
| suggest | describe / point out | советую | опишу / укажу |
| advise | explain / outline | советую (advisory) | объясню / опишу |
| urge | highlight | настоятельно | выделю |
| propose | present / outline | предлагаю (advisory) | представлю / опишу |
| endorse | describe / characterize | одобряю | характеризую / описываю |
| direct | indicate / point to | направляю | указываю |
| instruct | explain | указываю (directive) | объясняю |
| prescribe | describe | предписываю | описываю |
| counsel | summarize | наставляю | резюмирую |
| should | tends to / historically | следует / должны | склонен / исторически |
| must | is | должны | является |
| will [grow/recover] | has tended to / projected to | будет [расти] | склонен к / по модели — |
| guarantee | observe / record | гарантирую | фиксирую / наблюдаю |
| ensure | confirm | обеспечу | подтверждаю |
| outperform (predictive) | has outperformed (past) | обгонит | обогнал (past tense only) |
| avoid (imperative) | has historically diverged from | избегайте | исторически расходился с |
| consider (imperative) | one option to look at is — described | рассмотрите | один из описанных вариантов — |
| check (imperative) | shown on — / visible at — | проверьте | показан на — / виден в — |
| review (imperative) | summarized below | обратите внимание | отмечено ниже / резюмировано ниже |

**General rewrite pattern:**
- **2nd-person imperative → 3rd-person observational.** «Sell X» → «X is shown declining». «Продай X» → «X показан снижающимся».
- **Future certainty → past-tense or projection-marked.** «X will recover» → «X has historically recovered after similar drawdowns» / «projection model shows recovery in scenario A».
- **Value judgment → quantified attribute or attributed classification.** «risky stock» → «volatility 28% (90-day)» / «classified high-volatility by [source]».
- **Modal of obligation → descriptive observation.** «You should rebalance» → «Allocation drift since rebalance: 12pp».

---

## Recommendation: hard-block vs logged-only at api-client

| Tier | Action at api-client | Rationale |
|---|---|---|
| **Tier 1** | **Hard-block.** Reject payload, return validation error to upstream AI service for retry with reinforced prompt. Log full violation. | These verbs are unambiguous voice violations regardless of frame. The api-client cannot recover them; safer to fail-closed. |
| **Tier 2** | **Hard-block at api-client (lift from soft-block).** Reject payload, log. | The api-client lacks the surrounding-sentence context to decide if a Tier-2 verb is wrapped in a clearly-factual frame. Push the contextual judgment back to the AI service prompt layer; let the api-client be a dumb fail-closed gate. |
| **Tier 3** | **Log + pass.** Emit a structured warning event (`voice.tier3.flagged`) with the verb, the field, and the full string. Sample 10% for human review weekly. Do not block. | Tier 3 verbs have legitimate descriptive uses; blocking would cause too many false positives at the boundary. Drift monitoring is the goal here, not enforcement. |

**Forbidden constructions** (imperative-mood / modal-obligation / value-judgment-adjacency / future-certainty / RU traps): hard-block at api-client. These are pattern-level not lemma-level — implement with a small set of regex / morphological checks alongside the lemma list.

**Failure-mode preference:** voice violations are quieter than regulatory violations but corrosive. A single Tier-1 verb in a `meta.subtitle` undoes the «we describe, never advise» trust signal that Lane A is built on. Fail-closed is correct.

**Out-of-scope for this list (handled by sister specialists):**
- Specific instrument-name + action pairs (legal-advisor): «buy AAPL», «sell BTC».
- Performance-promise quantifiers (finance-advisor): «8% guaranteed», «doubled returns».

---

**End of voice-angle proposal.** Awaits Right-Hand synthesis with legal + finance angles.
