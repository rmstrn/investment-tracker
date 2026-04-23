# Strategic Options — 3 candidate directions

**Date:** 2026-04-23
**Owner:** Navigator (orchestrator); synthesis pulls from brand-strategist, product-designer, content-lead
**Source:** v2 discovery (34 competitors, evidence-based) + parallel specialist synthesis + council debate
**Status:** awaiting PO pick (one direction; then all-in)

---

## Evidence baseline (TL;DR для быстрого возврата в контекст)

v2 discovery показала: «AI + portfolio-aware chat» стал 2025-2026 волной, а не пустым рынком. 7+ прямых конкурентов в той же плоскости (PortfolioPilot, Origin, Mezzi, Getquin, Fey, Wealthfolio, Moomoo Agentic). Узкий лайт-занятый коридор — «AI chat + portfolio-aware + НЕ advisor-framed + retail + US+EU». PortfolioPilot, Origin, Mezzi все leаnят в advisor framing; Getquin EU-native; Fey acquired. Наш дифференциал — US+EU retail × chat-first × НЕ advisor × source-cited × behavioral-aware.

PO stance 2026-04-23: «основа — AI, который отвечает на все вопросы о портфеле. Нужно выделяться». Направление (AI-portfolio-chat) — задано; три варианта ниже — **flavors этого направления**, не альтернативы ему.

Три финалиста — это 3 coherent combos из 9 сырых опций (3 от brand × 3 от product × 3 от content), отфильтрованных через council debate по четырём voices: factual, strategic, skeptic, consistency.

---

## Option 1 — «Oracle» (тихая точность)

### One-paragraph pitch
Портфель, с которым можно поговорить — но без bravado, без advisor-вежливости, без «AI-революции» в hero. Тихий, точный, confident-without-loud. Больше Linear/Notion в интонации, чем Robinhood. Chat — это главный вход в продукт; home screen = диалог с закреплённым контекстом твоего портфеля; insights, coach, scenarios — всё через chat.

### Positioning angle (1-liner)
«Спроси о своём портфеле. Без советов. С источниками.»

### Brand archetype tuning + voice feel
- **Archetype:** Magician-dominant с лёгким Sage. Убираем «Everyman-warm» вплоть до нейтральной дружелюбности — не холодно, но и не обнимашки
- **Voice:** короткие предложения, императивы мягкие («спроси», не «давай поговорим»), zero jargon, zero hype. «Знает, не поучает»
- **Personality:** как хороший библиотекарь — быстро находит, точно цитирует, не втирает
- **Pacing:** пауза. Не все секции орут. Белое пространство — дифференциатор

### Product emphasis
- **Primary surface:** chat с portfolio context, всегда доступный с любой страницы
- **Secondary surfaces:** insights (через drill-in из chat), aggregation view, transactions ledger
- **Tertiary (убрать из MVP-ядра):** behavioral coach (слишком активный для Oracle голоса), scenario simulator (оставить как tool внутри chat, не как отдельный surface)
- **Onboarding flow shape:** 3 шага — connect broker → увидел портфель → задай первый вопрос. AI проактивно предлагает 3 стартовых вопроса после первой синхронизации

### Messaging frame (landing hero)
- **Russian:** Поговори со своим портфелем. / Просто задай вопрос. *(текущий locked hero сохраняется)*
- **English:** Talk to your portfolio. / Just ask.
- **Sub-proof 1:** Ответит по твоим реальным позициям — не гипотетическим / Answers on your actual holdings, not hypotheticals
- **Sub-proof 2:** Ссылается на источники, не угадывает / Cites sources, doesn't guess
- **Sub-proof 3:** 1000+ брокеров и криптобирж в одном чате / 1000+ brokers and exchanges in one chat

### Competitor differentiation
- **vs PortfolioPilot** («Complete financial advice»): мы не даём advice — отвечаем на вопросы с источниками. Их tone институциональный, наш — тихий
- **vs Origin** («Own your wealth. Track everything. Ask anything.»): они SEC-regulated advisor, широкий scope (budget + invest); мы investing-pure + explicitly-not-advisor. Hero «Поговори со своим портфелем» более portfolio-specific, чем их «Ask anything»
- **vs Getquin** («Your entire wealth. One platform.»): они aggregator-first + AI слой сверху; мы chat-first + aggregation supporting
- **vs Fey** (research-first post-acquisition): они о research, мы о диалоге с твоим портфелем

### Which ICP wins
- **A (millennials 28-40, $20-100K, multi-broker):** сильная посадка — они ценят restraint, не хотят быть продаваемыми
- **B (newcomers 22-32, $2-20K, AI-native):** нейтральная посадка — могут читать тихий tone как «недостаточно тёплый», но chat-UX их родной
- **Recommendation:** ICP A primary, ICP B secondary-inclusive — но не primary для этого tone

### Risks / trade-offs
- **Адьяcency с Origin:** «Ask» в их sub-hero — в English space мы рядом. Нужна чёткая дифференциация below fold на «not-advisor» + «investing-pure» + «Russian-native»
- **Самый «expected» вариант:** если PO cmotrит на 3 options и выбирает «очевидный» — Oracle. Не worst, но не breakout
- **Зависимость от chat-first гипотезы:** если реальные retail users предпочитают dashboard-first, Oracle страдает сильнее других опций (в Analyst insights-feed home страхует)

### What happens next if PO picks this
1. Navigator локаст positioning в 02_POSITIONING.md без read-only как differentiator; обновит archetype на «Magician-dominant с Sage modifier»
2. brand-strategist дисптчен для naming raund 5: 1-2 syllable evocative nouns, oracle-territory (без rejected Delphi/Koan), bilingual pronounceability
3. content-lead дисптчен для English landing copy + paywall + microcopy в Oracle tone
4. product-designer дисптчен для home-as-chat wireframe + 3-стартовых-вопросов pattern + insight drill-in spec
5. tech-lead получает intent: home page становится chat-centric; Slice 6a insights feed остаётся, но entry-point переосмысливается как drill-in из chat

---

## Option 2 — «Analyst» (резкая ясность)

### One-paragraph pitch
Pro-grade ясность без advisor'а. Dashboard-savvy, insights-feed-first, но без institutional-cold — chat всегда рядом для «почему?». Home screen = weekly digest (уже отгружено Slice 6a) + chat affordance. Дифференциатор — ты получаешь то, что профессионалы видят в терминалах, но conversational, не таблица. Идёт против Simply Wall St и Fey в их поле, но с chat-first UX.

### Positioning angle (1-liner)
«Ясность по портфелю. Как у профи — только без посредников.»

### Brand archetype tuning + voice feel
- **Archetype:** Magician + Hero (action-oriented). Убираем Everyman до минимума
- **Voice:** crisp, confident, слегка edgy. Императивы резче («спроси», «посмотри», «сравни»)
- **Personality:** как умный коллега-аналитик, который сходу показывает что важно. Не «рядом», а «впереди на полшага»
- **Pacing:** плотнее. Больше данных на экране, но каждое число имеет объяснение one-tap away

### Product emphasis
- **Primary surface:** insights feed (home page = еженедельная сводка + просадки + concentration + события)
- **Secondary surfaces:** chat-as-drill-in из любой карточки insight; scenario simulator; analytics (Sharpe/Sortino gated в Pro)
- **Tertiary:** behavioral coach — мягче, как pattern observation в insights, не как отдельный surface
- **Onboarding flow:** connect broker → «получи первую сводку через 10 минут» → проактивный push когда готова. Chat — secondary discovery, не primary entry

### Messaging frame (landing hero)
- **Russian:** Портфель, который умеет отвечать. / Просто спроси.
- **English:** A portfolio that answers back. / Just ask.
- **Sub-proof 1:** Данные S&P, Polygon, прайм-источники — не догадки / S&P, Polygon, prime-grade data — not guesses
- **Sub-proof 2:** Факторы, концентрация, Sharpe — без таблиц / Factors, concentration, Sharpe — without spreadsheets
- **Sub-proof 3:** Дивиденды, просадки, события недели — увидишь первым / Dividends, drawdowns, events of the week — you see them first

### Competitor differentiation
- **vs Simply Wall St** («insights the pros use»): они tracker с Snowflake viz; мы conversational layer на теми же insights + multi-broker aggregation
- **vs Fey** («Make better investments»): они research-forward, 2 брокера (IBKR+E*Trade); мы 1000+ + портфолио-aware
- **vs PortfolioPilot** («Complete financial advice»): мы rejects advice-framing; их hedge-fund-tone vs наш analyst-tone (тот же regulatory space, разный brand)
- **vs WallStreetZen/Zacks**: они rating-as-a-service; мы portfolio-aware context

### Which ICP wins
- **A (millennials 28-40):** primary fit. Эти люди уже тратят минуты в неделю на tracker; Analyst даёт им pro-level output за те же минуты
- **B (newcomers):** слабо. Analyst voice может читаться как «я недостаточно умный для этого»
- **Recommendation:** ICP A primary and dominant; ICP B explicitly deferred to post-alpha (или узкое ICP — AI-native newcomers который уже имеют 2+ broker — см. §5.2 discovery)

### Risks / trade-offs
- **Analyst tone давит на ICP B:** если TAM зависит от newcomers, эта опция сужает funnel
- **Commodity риск:** Simply Wall St + Fey + Fiscal.ai в том же поле; нужна очень сильная differentiation через chat-UX и multi-broker
- **Shipping alignment:** Slice 6a уже даёт insights feed; продукт-state ближе всех к этой опции
- **Phonetics risk:** «Sharp Analyst» English-leaning вокабуляр плохо ложится на Russian phonetics; naming придётся тщательно подбирать

### What happens next if PO picks this
1. Navigator локаст positioning с Analyst tone; обновит ICP appendix (ICP B deferred)
2. brand-strategist дисптчен для naming: sharper phonetics с требованием bilingual parity; territory — analytical/observational evocative words (не rejected list)
3. product-designer дисптчен для home-as-insights-feed polish (Slice 6b+) + chat drill-in spec; ICP A dashboard-sophistication pattern
4. content-lead дисптчен для authority-clarity landing rewrite (ru+en) + pro-tier paywall emphasizing analytics
5. tech-lead: Slice 6b (insights write actions + dismiss persistence) становится приоритетом; Pro-tier analytics features (Sharpe, drawdown) поднимаются в roadmap

---

## Option 3 — «Companion» (спутник, который видит паттерны)

### One-paragraph pitch
Не advisor, не analyst. Наблюдатель-спутник, который читает твою историю сделок и подсвечивает паттерны, которые ты сам не замечаешь. Home = weekly pattern-read на твоих реальных сделках («ты продал Apple на локальном дне три раза за год»). Chat и insights — supporting. Самая distinctive опция; никто из 34 конкурентов не продаёт behavioral-coach на actual trade history по retail-цене.

### Positioning angle (1-liner)
«Видит паттерны в твоих сделках. Без осуждения.»

### Brand archetype tuning + voice feel
- **Archetype:** Everyman + Sage (paternalism stripped). Не Caregiver — мы не «заботимся», мы «смотрим вместе»
- **Voice:** warm, plain, human-first — но без psycho-flattery и без «ты молодец». Factual про поведение. «В прошлом квартале ты купил 3 раза после падения > 5% и продал 1 раз после роста > 5%. Это контрциклический паттерн.»
- **Personality:** как умный друг-трейдер который наблюдает со стороны и делится паттерном. Не «что делать» — а «что видит»
- **Pacing:** неторопливый. Один главный паттерн в неделю, несколько supporting observations

### Product emphasis
- **Primary surface:** weekly coach digest — 1 главный behavioral pattern + 2-3 observations
- **Secondary surfaces:** chat (drill-in из pattern: «почему ты думаешь что я так делал?»); insights feed; aggregation view
- **Tertiary:** scenarios (tool внутри chat, не отдельный surface)
- **Onboarding flow:** connect broker → «нам нужно 30 дней твоей истории для первого чтения паттерна» → временный empty-state (placeholder insights + chat) → первый coach-read на 30-й день

### Messaging frame (landing hero)
- **Russian:** Увидь паттерны в своих сделках. / Без советов. Без осуждения.
- **English:** See the patterns in your trades. / No advice. No judgment.
- **Sub-proof 1:** Читает твою реальную историю — не гипотетические стратегии / Reads your actual history, not hypothetical strategies
- **Sub-proof 2:** На твоей стороне — zero upsells, zero «купи» / On your side — zero upsells, zero «buy» signals
- **Sub-proof 3:** Дивиденды, просадки, поведенческие паттерны — увидишь первым / Dividends, drawdowns, behavior patterns — you see them first

### Competitor differentiation
- **vs Mezzi** («fiduciary advice» + «24/7 monitoring»): они advice-framed, paternalistic, $299/yr entry; мы observation-framed, peer-voice, retail pricing
- **vs Origin** («Own your wealth. Ask anything.»): они SEC-advisor широкого scope; мы behavioral-observer narrow scope
- **vs PortfolioPilot**: их AI даёт rebalance recommendations; наш AI показывает что ты уже делал. Противоположная философия
- **vs Alinea** («investing as easy as texting»): они beginner-onboarding + их broker; мы mid-stage retail с existing history на внешних брокерах
- **vs everyone**: никто не продаёт behavioral-coach на actual trade history в retail tier по состоянию на 2026-04-23

### Which ICP wins
- **A (millennials 28-40 с историей сделок):** сильная посадка — у них ЕСТЬ история для чтения паттернов; self-aware, post-mistake, pre-quit
- **B (newcomers):** слабая посадка в MVP — нет 30-дневной истории; empty-state тяжёлый; возможен narrow pivot на «AI-native newcomers кто уже имеет 2+ broker» (§5.2 discovery)
- **New ICP surfaced:** «Post-mistake mid-career retail» — 30-50 лет, $30-150K портфель, уже сделал 2-3 classic ошибки (panic sell, FOMO buy, over-concentration), ищет observer не advisor
- **Recommendation:** ICP A primary; evaluate new mid-career ICP through live interviews; ICP B acknowledged-but-deferred

### Risks / trade-offs
- **30-day cold start:** empty-state первого месяца — killer UX. Нужен strong workaround: «вот что скажем когда данных хватит» + immediate chat + insights на текущем state портфеля
- **Scope creep:** behavioral coach требует значимый AI product work (pattern detection, narrative generation, temporal reasoning). Самый тяжёлый eng scope из трёх
- **Origin messaging adjacency:** «Ask» / «Own your wealth» — нам нужно очень аккуратно формулировать «observer» framing чтобы не прозвучать как Origin-lite
- **Variance:** самая высокоvariance опция — либо breakout, либо пустой MVP launch без истории паттернов
- **Tone risk:** «паттерны» может прозвучать judgy несмотря на «без осуждения» — требует careful content polish
- **TAM concern:** узкое ICP («post-mistake retail») может быть слишком узким для growth-stage

### What happens next if PO picks this
1. Navigator локаст positioning с Companion-Observer tone; перепишет §anti-positioning чтобы явно отвергнуть advice/coach/guidance всех paternal forms
2. **user-researcher дисптчен для validation interviews** с целью проверить гипотезу «post-mistake retail» — это сверх-важный step до локинга, потому что этот ICP не из discovery v2
3. brand-strategist дисптчен для naming в territory «spotter/watcher/observer/mirror/lens» (non-paternal peer archetype)
4. product-designer дисптчен для 30-day cold-start UX workaround + weekly coach digest design + pattern-read interaction spec
5. content-lead дисптчен для Companion landing (ru+en) + weekly email template + coach digest microcopy (без judgment language)
6. tech-lead: major eng ADR — behavioral pattern detection architecture (LLM reasoning on historical transactions; temporal aggregation; narrative generation templates). Это значимый roadmap shift; Slice 6+ может смениться полностью

---

## Cross-comparison table

| Axis | Oracle | Analyst | Companion |
|---|---|---|---|
| **Archetype centre** | Magician + Sage | Magician + Hero | Everyman + Sage |
| **Voice feel** | Тихая точность | Резкая ясность | Тёплая наблюдательность |
| **Primary home surface** | Chat | Insights feed | Weekly coach digest |
| **Secondary surfaces** | Insights, aggregation | Chat drill-in, analytics | Chat, insights |
| **Primary ICP fit** | A (strong) | A (dominant) | A (strong) + new «post-mistake» ICP |
| **Secondary ICP fit** | B (neutral) | B (weak) | B (weak) + new ICP |
| **Current product state alignment** | Partial (chat shipped, home redesign needed) | **Strong (Slice 6a ready; 6b+ aligned)** | Weak (coach surface brand-new) |
| **Eng scope vs current roadmap** | Moderate | Low (shipping-aligned) | **High (new AI surface)** |
| **Differentiation vs PortfolioPilot** | UX shift + not-advisor | Tone shift + not-advisor | Philosophy shift (observation vs advice) |
| **Differentiation vs Origin** | Investing-pure + Russian | ICP + tone + pro-grade | Observation vs advice (biggest gap) |
| **Differentiation vs Getquin** | Chat-first vs aggregator-first | Chat+insights vs aggregator+AI-layer | Coach vs general AI |
| **Shipping risk** | Low-mid | **Low** | Mid-high |
| **Breakout potential** | Mid (expected play) | Mid-high | **High (most distinctive)** |
| **Regulatory safety** | Strong (not-advisor) | Strong (not-advisor) | **Strongest (observation, not recommendation)** |
| **Bilingual parity ease** | Strong | **Mid (angular English phonetics)** | Strong |
| **MVP cold-start risk** | Low | Low | **High (30-day history gate)** |
| **Naming territory openness** | Oracle/lens/watcher words | Sharp/clarity/focus words | Observer/companion/mirror words |
| **Wedge-fit (council avg)** | **Strongest** | Strong | Strong-but-risky |

---

## Decision aid — PO question checklist

Пять вопросов, которые разводят эти три опции. Ответ PO на них даёт direct mapping.

### Q1 — Кто твой primary user emotionally?
- **«Разумный adult, который ценит тишину»** → Oracle
- **«Serious self-directed, который хочет pro-ясности»** → Analyst
- **«Self-aware retail, который знает что ошибается»** → Companion

### Q2 — Насколько готов рисковать на breakout vs defensibility?
- **Хочу defensibility и solid execution** → Oracle (самый «очевидный» = самый низкий риск)
- **Хочу близко к тому что уже строим** → Analyst (Slice 6a уже дал нам этот фундамент)
- **Хочу breakout опцию, готов к variance** → Companion (может не взлететь, но если взлетит — уникальный продукт)

### Q3 — Насколько важно не отходить от текущего roadmap и shipping momentum?
- **Критично, альфа через 1-2 слайса** → Analyst (Slice 6b+ аккуратно продолжают)
- **Можно сделать редизайн home под chat-first** → Oracle (Slice 6 shifts фокус)
- **Готов на major ADR и переосмысление Slice 7-10** → Companion (behavioral coach = новый eng vertical)

### Q4 — ICP B (AI-native newcomers 22-32, $2-20K) — насколько важен для MVP?
- **Primary сегмент, нужен в MVP funnel** → ни один из трёх не лучший; ближе всего Oracle или narrow-Companion. Возможно нужен hybrid — но это отклонение от instruction «выбери одно и иди all-in»
- **Secondary, ok если мы пока целим в A** → Analyst (честно ставит A primary)
- **Defer до post-alpha** → Companion (новый mid-career ICP может стать сильнее чем B)

### Q5 — Насколько tolerate 30-day MVP cold-start для Companion-specific UX?
- **Да, готов ждать 30 дней пока появляется первый coach-read** → Companion вариант жив
- **Нет, нужен wow-moment в первые 10 минут** → Companion исключён; Oracle или Analyst
- **Middle — хочу чтобы 10-минутный опыт был strong + coach через месяц добавлял depth** → Companion требует serious cold-start UX workaround; это риск-компромисс

---

## Council resolution notes (для прозрачности)

**9 raw options** были свёрнуты в 3 coherent directions через:
- **Factual-reviewer filter:** B-2 (Warm Mentor) + C-2 (Emotional Relief) напрямую откатились — слишком близко к Origin's SEC-advisor positioning; пришлось переформулировать Companion как observation-not-relief
- **Strategic filter:** три coherent combos survived (Oracle / Analyst / Companion); четвёртый возможный combo (B-1 Oracle + P-3 Coach) отклонён как voice/product mismatch
- **Skeptic filter:** P-3 cold-start flag поднят; Analyst phonetics-bilingual flag поднят; Origin adjacency flag поднят на всех
- **Consistency filter:** все три финальных combos внутренне когерентны (brand + product + content говорят одним голосом внутри каждого)

---

## Open questions для PO

1. **Готов ли locked hero («Поговори со своим портфелем / Просто задай вопрос») перезаписать?** Oracle сохраняет, Analyst меняет («Портфель, который умеет отвечать»), Companion меняет сильно («Увидь паттерны в своих сделках»). Если hero — санстити, это сужает до Oracle.
2. **Насколько критичен shipping momentum?** Если альфа через 1-2 слайса — Analyst (aligned with Slice 6a+6b). Если можем позволить redesign home — Oracle. Если готов к major ADR — Companion.
3. **30-day cold start для Companion — приемлем?** Yes/No бинарный фильтр.
4. **«Post-mistake retail» — это реальный ICP или ре-проекция ICP A?** Нужен user-researcher дисптч для validation, но PO intuition здесь ценен.
5. **Brand-strategist ready для naming round 5 на любом из трёх выбранных направлений?** Оракул territory, Analyst territory, Companion territory — разные vocab pools, разные rejected-list implications.

---

## What happens immediately after PO picks

Независимо от pick:
1. Navigator обновит `02_POSITIONING.md` на locked-vΝ состояние для выбранной опции (read-only demoted уже сделано; archetype + tone обновятся)
2. Navigator обновит `DECISIONS.md` с entry «2026-04-23 — Strategic option N locked»
3. Navigator обновит `03_ROADMAP.md` если выбор меняет shipping order (Companion точно меняет; Oracle потенциально меняет; Analyst подтверждает)
4. Три specialist-дисптча запускаются последовательно: brand-strategist (naming round 5 в выбранном territory), product-designer (home surface spec для выбранной опции), content-lead (landing rewrite если нужно + paywall + microcopy в выбранном tone)
5. Tech-lead получает product-intent для следующего eng kickoff, если выбранная опция смещает roadmap

---

## Sources

- `docs/product/01_DISCOVERY.md` v2 (2026-04-23)
- `docs/product/competitor-matrix.md` (34 competitors)
- `docs/product/pricing-landscape.md`
- `docs/product/competitor-positioning.md` (verbatim landing audits)
- `docs/product/02_POSITIONING.md` (current hypothesis, [PENDING-V2] flags)
- `docs/product/03_NAMING.md` (naming criteria, rejected directions)
- `docs/DECISIONS.md` (2026-04-23 entries on read-only + naming)
