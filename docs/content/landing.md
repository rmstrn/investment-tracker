# Landing Copy — v1 (Second Brain for Your Portfolio)

**Author:** content-lead
**Date:** 2026-04-23
**Brief:** `docs/content/LANDING_BRIEF.md`
**Status:** draft — awaiting PO review via Navigator
**Language:** English primary (day-1 launch), Russian parallel secondary (post-launch wave — not wired into build)

Per `.agents/team/CONSTRAINTS.md` reminder: **no external send of this copy.** No emails, no social posts, no newsletter publishes. This document lives in the repo as a draft for PO review. Product name is **Memoro** (locked 2026-04-23 — see `03_NAMING.md` and `DECISIONS.md`). Full rewrite under Memoro brand + imperative hero is dispatched to content-lead post-lock; this v1 draft predates the Option-4-synthesis repositioning (v3 positioning — hero reverts to imperative, Second Brain demoted to tagline) and is superseded by the upcoming content-lead rewrite.

---

## §1. Hero (locked verbatim per `02_POSITIONING.md` v2)

| | English (day-1) | Russian (parallel secondary) |
|---|---|---|
| **Hero** | Second Brain for Your Portfolio. | Второй мозг для твоего портфеля. |
| **Sub-hero direction** | Remembers. Notices. Explains. | Помнит. Замечает. Объясняет. |

Hero is PO-locked. Content-lead scope starts at the sub-hero.

---

## §2. Sub-hero — 3 candidate variants + recommendation

### Variant A — Locked starting point (staccato triplet)

| | English | Russian | Chars (EN / RU) |
|---|---|---|---|
| A | **Remembers. Notices. Explains.** | **Помнит. Замечает. Объясняет.** | 30 / 30 |

- **Rhythm:** three-beat staccato. Each verb is a full sentence.
- **Scan time (estimated):** 2.5–3 seconds — the period after each verb anchors each capability in working memory separately.
- **Pros:** most memorable; each verb maps to one of the three surfaces (chat = explain, insights = notice, coach = remember).
- **Cons:** doesn't name the object — «remembers what?».

### Variant B — Verb-object triplet (ties to surfaces explicitly)

| | English | Russian | Chars (EN / RU) |
|---|---|---|---|
| B | **Remembers what you hold. Notices what you miss. Explains what it sees.** | **Помнит, что у тебя есть. Замечает, что ты упустил. Объясняет, что видит.** | 65 / 69 |

- **Rhythm:** three parallel clauses. Repetition of «what X» across three verbs creates cadence.
- **Scan time (estimated):** 4 seconds — longer but each clause tells the user one capability with the object named.
- **Pros:** explicit sub-surface mapping; more informative; stronger for skeptical reader.
- **Cons:** costs ~1 second of cognitive parsing; loses the «poster-caption» brevity.

### Variant C — Single-line distillation

| | English | Russian | Chars (EN / RU) |
|---|---|---|---|
| C | **Your portfolio, with memory.** | **Твой портфель — с памятью.** | 31 / 28 |

- **Rhythm:** one-line, comma-break. Magazine-caption feel.
- **Scan time (estimated):** 1.5 seconds.
- **Pros:** fastest parse; metaphor-forward.
- **Cons:** loses «notices» and «explains» — collapses three capabilities into one abstract claim.

### Recommendation: **Variant A (Remembers. Notices. Explains.)**

Variant A wins for three reasons:
1. **Metaphor discipline.** The Second Brain hero is abstract; the sub-hero needs to *demonstrate* what a second brain does, not re-describe it. Three verbs = three demonstrations. Variant C re-describes.
2. **Surface mapping is tight.** Each verb maps to one surface (chat / insights / coach) without naming features — this lets the landing below carry the specifics. Variant B over-explains at sub-hero position; save the «what X» structure for the proof bullets below.
3. **Translation parity is strong.** «Помнит. Замечает. Объясняет.» renders as natively Russian as the English renders natively English. Variant B's «что у тебя есть / что ты упустил / что видит» is also clean but carries more translation-contract risk across future EU languages.

**Keep Variant B as alternate for A/B testing** if landing conversion data shows first-scan users bouncing before the proof bullets below.

---

## §3. Top-of-fold — 3 proof bullets (recommended)

Each bullet maps to one primary surface with deliberate tight one-to-one semantics.

### Bullet 1 — Chat / Recall

| | English (recommended) | Russian (parallel secondary) | Chars |
|---|---|---|---|
| 1 | **Ask anything about your actual holdings. Answers cite their sources.** | **Спроси что угодно о своих реальных позициях. Ответ ссылается на источники.** | 65 / 76 |

- **Surface mapped:** chat.
- **Why it lands:** «actual holdings» — differentiates from ChatGPT (hypothetical) and generic AI research tools. «Cite their sources» — differentiates from price-predictor AIs and Magic-8-ball fintech.
- **Regulatory check (Lane A):** no «buy/sell» imperative; no performance promise; observation framing.

### Bullet 2 — Insights / Notice

| | English (recommended) | Russian (parallel secondary) | Chars |
|---|---|---|---|
| 2 | **Surfaces dividends, drawdowns, and concentration shifts before you notice.** | **Подсвечивает дивиденды, просадки и концентрацию раньше, чем ты заметишь.** | 75 / 73 |

- **Surface mapped:** insights feed.
- **Why it lands:** «before you notice» — active voice for the second brain, makes proactive insight feel like memory recall, not notifications. Three specific nouns (dividends, drawdowns, concentration) anchor the abstract promise in concrete capabilities.
- **Regulatory check (Lane A):** no «buy/sell» language; observation verbs only; no prediction.

### Bullet 3 — Coach / Pattern-recognition

| | English (recommended) | Russian (parallel secondary) | Chars |
|---|---|---|---|
| 3 | **Reads patterns in your trades. No judgment, no advice — just what it sees.** | **Читает паттерны в твоих сделках. Без осуждения, без советов — только то, что видит.** | 76 / 88 |

- **Surface mapped:** coach.
- **Why it lands:** «reads patterns» is the coach-surface signature verb. «No judgment, no advice — just what it sees» carries the Lane A promise as positive trust signal, not as compliance caveat. Differentiates from PortfolioPilot/Origin/Mezzi advisor framing explicitly.
- **Regulatory check (Lane A):** «no advice» is literal; no imperatives; «what it sees» = observation-only.

### Alternates table (for repo record / future A/B testing)

| Bullet | Alternate (English) | Alternate (Russian) | Why kept |
|---|---|---|---|
| 1 (chat) | Ask your portfolio anything. Sources attached. | Спроси свой портфель о чём угодно. Источники прилагаются. | Tighter; sacrifices «actual holdings» differentiation |
| 1 (chat) | Your holdings, in conversation. With receipts. | Твои позиции — в разговоре. С пруфами. | Colloquial; «receipts» is Gen-Z trust vocabulary; «пруфы» calque |
| 2 (insights) | Weekly: dividends, drawdowns, events you'd miss. | Еженедельно: дивиденды, просадки, события, которые ты бы упустил. | Cadence-specific; weakens «before you notice» active memory claim |
| 2 (insights) | Notices what moved. Surfaces what matters. | Замечает, что сдвинулось. Подсвечивает, что важно. | Compressed; loses specific nouns |
| 3 (coach) | Patterns in your trades, without the lecture. | Паттерны в твоих сделках — без нотаций. | Personality-forward; «нотаций» stronger than «осуждения» |
| 3 (coach) | Remembers how you've traded. Names the patterns. | Помнит, как ты торговал. Называет паттерны. | «Remembers» ties to sub-hero; weaker on «no judgment» |

---

## §4. Landing structure subtitles (sections 2 / 3 / 4)

Per `02_POSITIONING.md` v2 landing structure table — confirmed or revised below.

### Section 2 — 4 tabs (demo scenarios)

| Locked (v2) | Revise? |
|---|---|
| Hero: «Ask your second brain.» / Sub: «Four things it can do on your actual holdings.» | **CONFIRM — no revision needed.** Clean imperative, surface-neutral invitation, plural «things» signals demonstrations not features. |

### Section 3 — Insights (what it notices)

| Locked (v2) | Revise? |
|---|---|
| Hero: «A few minutes a day and you will not miss a thing.» / Sub: «Dividends, drawdowns, events — your second brain surfaces them before you do.» | **TIGHTEN — propose:** Hero: «A few minutes a week. Nothing missed.» / Sub: «Dividends, drawdowns, and events — surfaced before you notice.» |

- **Rationale for tighten:** «A few minutes a day» implies daily checking-in; insights cadence is weekly (per 6a design). Changed to «a few minutes a week» — honest to product. «Your second brain surfaces them before you do» repeats the brain-metaphor immediately after hero; dropped «your second brain» in sub — it's already the page's premise, doesn't need restating every line.

### Section 4 — Aggregation (what it holds)

| Locked (v2) | Revise? |
|---|---|
| Hero: «One brain holds everything.» / Sub: «1000+ brokers and exchanges.» | **CONFIRM — no revision needed.** «One brain holds everything» ties metaphor forward; «1000+ brokers and exchanges» is the specific proof point. Clean pair. |

---

## §5. Regulatory checklist (Lane A — LOCKED)

Every line of recommended copy passed these filters:

- [x] No imperative investment advice (no «buy X», «sell Y», «rebalance», «reduce», «increase»).
- [x] No performance promises (no «will outperform», «expected to rise», «doubles your returns»).
- [x] No advisor-paternalism (no «we recommend», «our experts advise», «the right move»).
- [x] No AI-response mock copy with «buy/sell» commands (no mock copy at this landing level — lives in tab content in `02_POSITIONING.md` which is already Lane-A-clean).
- [x] Disclaimer pointer: landing footer (locked per `02_POSITIONING.md` §Footer disclaimer) carries the formal «Not a registered investment advisor. Information is for educational purposes only. Past performance is not indicative of future results.» string. Footer unchanged.

Voice-check filters (per brief §Content voice-check):
- [x] All lines use memory-oriented vocabulary (remembers / notices / explains / surfaces / reads / holds / sees / ask / answers / cite).
- [x] All lines avoid «buy / sell / should / must / will outperform».
- [x] No advisor-paternalism.
- [x] Lines are specific (actual holdings, dividends, drawdowns, concentration, patterns in trades) not abstract.
- [x] Each bullet maps tight to ONE surface — no blur.
- [x] English primary is native-craft (not translation-feeling).
- [x] Russian is natural secondary (no word-for-word calque — «before you notice» → «раньше, чем ты заметишь» is idiomatic, not literal).

---

## §6. Open questions for PO (via Navigator)

1. **Sub-hero variant pick.** Variant A recommended. Accept? Or does PO prefer Variant B (explicit «what X» mapping) or Variant C (tighter single-line)?
2. **Proof bullet 3 phrasing.** «No judgment, no advice — just what it sees.» — does «no advice» read as over-claiming our Lane A stance, or as the positive trust signal we want? Alternate: «Patterns in your trades, without the lecture.» — more colloquial, still Lane A. PO preference?
3. **Section 3 tighten.** I recommend changing locked «A few minutes a day» → «A few minutes a week» (honest to weekly cadence). Accept? Or keep «day» for ambitious framing?
4. **Name locked 2026-04-23 as Memoro.** This v1 draft is superseded by upcoming content-lead rewrite (Memoro brand + imperative hero per v3 positioning lock). No further placeholder sweep needed here.
5. **Russian parallel content.** All Russian copy here is a parallel secondary draft, not wired into MVP build (English-only day-1 per PO 2026-04-23). Confirm Russian stays in-repo as draft only, not shipped day-1.

---

## §7. Brief summary for Navigator

**Recommended hero + sub + 3 proof bullets (English primary):**
- Hero: **Second Brain for Your Portfolio.** (locked)
- Sub: **Remembers. Notices. Explains.** (Variant A recommended)
- Proof 1 (chat): **Ask anything about your actual holdings. Answers cite their sources.**
- Proof 2 (insights): **Surfaces dividends, drawdowns, and concentration shifts before you notice.**
- Proof 3 (coach): **Reads patterns in your trades. No judgment, no advice — just what it sees.**

**Russian parallel secondary** included line-by-line (not shipped day-1).

**Alternates table** lives in §3 for future A/B testing / future PO preference.

**Regulatory compliance (Lane A):** passed on all 3 proof bullets + sub-hero + section subtitles. No imperative investment advice anywhere.

**Proposed revision outside sub-hero + proof bullets:** Section 3 («Insights») — change «A few minutes a day» → «A few minutes a week» (honest to weekly cadence). Noted as open question #3 for PO.

**Open questions for PO:** 5 questions listed in §6. Most important: sub-hero variant pick, proof bullet 3 phrasing check, section 3 cadence honesty.

**Regulatory concerns:** none hard-flagged. Soft-flag: proof bullet 3 uses «no advice» explicitly — confirming with PO that over-claiming Lane A stance at sub-surface level is intentional (it IS the product identity per `02_POSITIONING.md` v2 anti-positioning).

**No emails sent. No social posts published. No external communication of any kind. Draft lives in repo only.**
