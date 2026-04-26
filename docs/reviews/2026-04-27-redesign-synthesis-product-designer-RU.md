# Provedo Landing v4 — Синтез редизайна (Phase 2) — RU

**Автор:** product-designer (synthesizer)
**Дата:** 2026-04-27
**Статус:** RU-версия английского `2026-04-27-redesign-synthesis-product-designer.md` для PO-чтения. Английский оригинал — канон для CC-диспатчей.

**Что синтезируется:**
- R1 — `2026-04-27-ai-tool-landing-audit-product-designer.md` (ландшафт AI-инструментов: 8 карточек · pattern-frequency · точки трения с Lane A)
- R2 — `2026-04-27-fintech-competitor-landing-audit-user-researcher.md` (fintech-конкуренты JTBD · voice 2x2 · градиент Lane A)
- R3 — `2026-04-27-landing-trends-cro-content-lead.md` (паттерны 2026 · 5 hero-вариаций · правки микрокопи · 3-уровневый дисклеймер)
- Текущее состояние: Provedo v3.1 (HEAD `409cda9`, после finance/legal патч-коммита `8cb509b`) и `landing-provedo-v2.md`
- Voice-замок: `BRAND_VOICE/VOICE_PROFILE.md` post-Provedo-lock
- Ограничения: 5 правил анимации · Lane A bright-line · разрешённые глаголы · запрещённые сочетания

**Выход:** Три расходящиеся опции редизайна для v4. Trade-off'ы честные. Сводная таблица в конце. Открытые вопросы для Phase-3 валидаторов.

**HARD RULES соблюдены:** Rule 1 (без трат) · Rule 2 (без внешних коммуникаций) · Rule 3 (только markdown, без кода) · Rule 4 (без финального копи — hero-кандидаты это однострочные предложения) · Rule 5 (voice-check каждой строки) · Rule 6 (без отката v3.1 патчей) · Rule 7 (5 правил анимации удержаны) · Rule 8 (каждая опция чинит баг waitlist trial-CTA из R3 §M3).

---

## §1 Три расходящиеся позиции (по одной строке)

Опции должны расходиться **стратегически**, а не стилистически. Из трёх отчётов позиции естественно складываются так:

- **Опция A — «Editorial Sage» (редакционный мудрец).** Поднимаем editorial-середину страницы из R1 (паттерн с частотой 6/8) до структурного позвоночника всей страницы; удваиваем уже самый сильный ход Provedo (антитеза §S6, Lane-A-как-позиционирование §S3 негация); сопротивляемся жанровым конвенциям AI-инструментов где они уводят off-brand. Самая консервативная, самая верная Sage-архетипу.
- **Опция B — «Narrowed Wedge» (заострённый клин).** Принимаем самый сильный вывод R2 (chat-first hero незаполнен в прямом fintech-сегменте) — заостряем именование ICP + chat-as-product клин над сгибом; продвигаем broker-marquee и audience-line раньше; берём R3.V1 time-anchor sub. Средний риск, максимальная ясность для cold-traffic, самая сильная конкурентная дифференциация.
- **Опция C — «Negation-Forward» (негация впереди).** Берём R3.V5 hero (negation-led) + переупорядочиваем страницу так что **что Provedo НЕ есть** идёт перед **что Provedo ЕСТЬ**; делаем дисциплину Lane A видимой с первой секунды (продлеваем паттерн Kubera «Skip the middleman» дальше чем сама Kubera). Максимальный бренд-риск, самый сильный single-line позиционный ход, самый отличающийся среди fintech-AI лендингов 2026.

Эти три расходятся по оси **«show / tell / refuse» («показать / рассказать / отказаться»)** из R1 §6: Опция A доверяет редакционному *show* (типографика + структура несут бренд); Опция B доверяет продуктовому *tell* (заостряет JTBD+ICP claim); Опция C доверяет дисциплинированному *refuse* (сначала говорим что мы НЕ, потом тихо раскрываем что мы есть).

---

## §2 Опция A — «Editorial Sage»

### Стратегическая позиция

Считаем v3.1 фундаментально правильной. Не редизайн — **эволюция**. Самая большая отдача — сделать editorial-блок середины страницы (§S6) **структурным якорем страницы**, а не одной из десяти секций. Берём R1.R1 (заменить bracketed-плейсхолдеры полностью прописанным example-выходом продукта — паттерн Granola, частота 5/8) и R1.R4 (поднять editorial-середину до её сильнейшего варианта — частота 6/8); всё остальное отбрасываем как drift.

Ставка: в 2026 дифференциатор для Sage-архетипа AI-инструмента — *не* соответствие AI-жанру, а **типографическая сдержанность + по-настоящему ощущающийся контент + спокойный ритм**. Anthropic.com доказывает что это работает на масштабе; Granola.ai — что это работает на нашем масштабе.

### Изменения по секциям

| § | Изменение | Источник |
|---|---|---|
| S1 Hero | **REVISE.** Берём R3.V1 (time-anchor sub): «Five minutes a week. Every broker. Every position.» Голову оставляем «Provedo will lead you through your portfolio.» Двойной CTA сохраняем. | R3 §7.V1 |
| S2 Proof bar | **REVISE.** Убираем префикс «Lane A —» → «Information. Not advice.» (R3.M4). Ячейку «4 demo scenarios» меняем на «5 minutes a week» reading-time-якорь (R3 §6 строка 7). Заменяем «1000+» когда подтвердим (R2 §A4) или fallback «Hundreds». | R3 §6, §8.M4 |
| S3 Negation | **KEEP.** Сильнейший single-content-ход на странице (R3 §6 строка 10). Снимаем мета-заголовок «This is what Provedo is not.» — пусть три строки негации несут себя сами (R3 §6 строка 11). | R3 §6.10-11 |
| S4 Demo tabs | **REVISE.** Структуру табов сохраняем + v3.1 finance/legal патчи дословно. **Заменяем bracketed-плейсхолдеры полностью прописанным Granola-grade example-выходом по всем 4 табам.** Tab 1 уже получает typing-animation hero treatment; рендеренный chart + per-line citation badges становятся реальным микро-контентом который читатель читает, а не пропускает. Это самый крупный copy+visual апгрейд в Опции A. | R1 §4.R1 |
| S5 Insights bullets | **KEEP.** Три Provedo-as-agent утверждения; ритм хороший (R3 §6 строка 17). |  |
| S6 Editorial mid-page | **REVISE+ELEVATE.** Делаем структурным якорем. Тестим JBM-mono accent-line для closing-tagline (vs italic Inter — R1 §4.R4). Подтягиваем body на 15-20 слов короче (R3 §6 строка 19). Держим candidate #2 «You hold the assets. Provedo holds the context.» как closer. | R1 §4.R4, R3 §6.19 |
| S7 Testimonials | **REVISE.** Три цитаты от Roman M. читаются жидко (R3 §6 строка 20). Сжимаем до **одной взвешенной цитаты** + честная строка «Alpha quotes coming Q2 2026». | R3 §6.20, R3 §11.5 |
| S8 Aggregation marquee | **KEEP+VERIFY.** Закрепляем «1000+» если подтверждено, иначе «Hundreds» — но конкретика лучше generic'а если реальное число например 400 (R3 §6 строка 21). | R3 §6.21 |
| S9 FAQ | **REVISE.** «Common questions» → «Questions you'd ask» (R3.M1). Q4 уже имеет $9 из v3.1 патча. Q3 align с §S8 broker-count. | R3 §8.M1 |
| S10 Pre-footer CTA | **KEEP.** «Open Provedo when you're ready.» — voice-perfect (R3 §6 строка 23). |  |
| Footer disclaimer | **REVISE.** Берём R3 §9 трёхуровневый паттерн (plain-language summary + раскрывающийся verbatim 75-словный блок + `/disclosures` под-страница). Layer 1 ≈ 14-20 слов. **Требуется sign-off legal-advisor по тексту Layer 1.** | R3 §9 |
| **ADD** — Audience-name micro-line | Одна строка под hero или small-print в proof-bar: «For investors who hold across more than one broker.» | R1 §4.R3, R2 §7.Adopt-4 |
| Bug fix | Footer waitlist box CTA «Try Plus free for 14 days» → «Start free forever» + согласованность с шапкой §S10. | R3 §8.M3 |

### Hero-вариация (locked)

| Элемент | Копи | Знаков | Voice-check |
|---|---|---|---|
| Headline | Provedo will lead you through your portfolio. | 45 | leads-through (allowlist, сдержанно) |
| Sub | Five minutes a week. Every broker. Every position. | 49 | observation-anchored, scope-claim, без advice-регистра |
| Audience whisper (NEW, под sub или в proof-bar) | For investors who hold across more than one broker. | 51 | descriptive ICP, без advice-градиента |
| Primary CTA | Ask Provedo | 11 | named-noun продуктовый CTA |
| Secondary | Start free forever | 18 | сбрасывает извиняющееся «Or» (R3.M2) |

### Подача демо (§S4)

**Сохранить табы + заменить контент на реальный.** Структурно паттерн с 4 табами не меняется; tabbed-demo в тренде (Claude делает то же ниже сгиба, R1 §2.1). Изменение чисто *content fidelity* — каждый таб получает полностью прописанный example-чат по R1 §4.R1: реалистичный вопрос пользователя, реалистичный ответ Provedo с конкретными суммами, тикерами, датами, source-цитатами. Inline-чарт становится частью правдоподобного примера, не плейсхолдером. Читатель читает пример, мысленно мапит на свой портфель, value-prop приземляется без объяснения. Это паттерн Granola — и это самый большой copy-side gap в v3.1 по R1 §3.

### Дисклеймер

**Берём R3 §9 трёхуровневый паттерн.** Layer 1 plain-language summary (≈ 14-20 слов) занимает место текущего 75-словного блока. Layer 2 раскрывающаяся «Read full disclosures» сохраняет дословный v3.1 legal-текст (regulator-readable патч из `8cb509b` остаётся неизменным под). Layer 3 `/disclosures` под-страница — post-alpha. **Цена:** legal-advisor должен подписать Layer 1. Драфт от R3: «Provedo provides information about your portfolio. It is not investment advice — every decision stays yours.»

### Бюджет анимации

**Сдержанный.** Hero typing animation (уже задеплоена, best-in-class по R3 §6.25) + parallax-stack + fade-in §S6. Без новой анимации. Anti-pattern A1 (gradient hero), A3 (dramatic-thinking pause), A4 (live-counter widgets) — всё отвергнуто по R3 §10.

### Доказательная база

- Editorial-середина: **R1 §3 частота паттерна 6/8 AI-tool лендингов** + R1 §4.R4 эксплицитная рекомендация.
- Замена плейсхолдеров реальным контентом: **R1 §4.R1** (Granola — exemplar 5/8 highest-fidelity), **R1 §3 строка паттерна «Fully-written example product content» 5/8**.
- Time-anchor sub: **R3 §7.V1** lowest-risk hero-вариант; **R3 §2** идентифицирует sub-line value-anchor как 2026-trend gap в v3.1.
- Трёхуровневый дисклеймер: **R3 §9** (рефы Wealthfront / Public.com / Robinhood); legal-protection сохранена по **R3 §9 «legal-protection check»**.
- Audience-whisper: **R1 §4.R3** (Granola) + **R2 §7.Adopt-4** (Kubera); independent convergence.
- Сохранение voice-fingerprint: **R2 §4** voice 2x2 — Provedo-квадрант (нижний friendly information-only) не оспорен прямыми пирами; Опция A его держит.
- Баг микрокопи v3.1: **R3 §8.M3** идентифицирует footer waitlist trial-CTA leak как top-1 патч.

### Trade-off'ы (3)

1. **Жертвует новизной ради бренд-связности.** Опция A читается случайным посетителем как «лучше v3.1», а не «v4 редизайн». Growth-команда или PO в погоне за visible-redesign-energy найдут это анти-климактичным. Ставка отыгрывается только если PO верит что типографическая сдержанность + content-fidelity реально двигают метрику на нужной когорте (HNW multi-broker millennial — R2 ICP A).
2. **Откладывает chat-first wedge play.** R2 §6.Opp-1 — самый сильный вывод по конкурентной дифференциации (chat-first незаполнен в прямом fintech). Опция A держит chat в hero, но не *продвигает* его как клин над сгибом. Опция B это подбирает; A оставляет на столе.
3. **Самая большая нагрузка на content-lead.** «Replace bracketed placeholders with Granola-grade fully-written example output» — самый тяжёлый single-lift из всех опций (~6-8h content-lead по R1 §4.R1) — и работа невидима для тех кто читает страницу выше демо-табов. Соотношение visible-redesign-yield к content-lead-effort — худшее из трёх опций.

### Lane A градиент риска (vs v3.1) — 0-5 (меньше = строже дисциплина)

| Вектор | v3.1 | Опция A | Δ |
|---|---|---|---|
| Implicit-recommendation drift | 1 | 1 | держим |
| Personalization drift | 1 | 1 | держим |
| Social-proof-as-rec drift | 1 | 1 | держим |
| Animation-narrative-causation drift | 0 | 0 | держим |

**Net:** Опция A держит дисциплину Lane A ровно на уровне v3.1. Работа replace-placeholders в §S4 имеет теоретическую drift-поверхность (правдоподобный AAPL-recovery example можно tightened до маркетингового «AAPL bounced — stay calm next dip») но v3.1 finance/legal патчи на Tab 3 уже кодифицировали безопасный шаблон. Content-lead pass на новый demo-контент должен унаследовать эти guardrails.

### Сохранение voice fingerprint

**Сильнейшее из трёх опций.** Регистр Magician+Sage держится везде. Editorial-середина **усиливает** Sage gravitas через типографическую сдержанность (anti-A1 / anti-A2 / anti-A3 все отвергнуты). Audience-whisper «For investors who hold across more than one broker» — observation-coded ICP, не advice-градиент. JBM-mono accent-test в §S6 closer'е — technical-Sage-Magician регистр, не designer-flourish — сохраняет оба архетипа в одном визуальном жесте.

Без Everyman-drift риска. Опция A эксплицитно сопротивляется Everyman-warm AI-жанровой гравитации (Lovable «Watch it come to life», Linear-too-friendly). Sage-with-Everyman-modifier баланс из v3.1 держится в A.

### Оценка scope'а

| Роль | Часы | Заметки |
|---|---|---|
| content-lead | 8-12 | Заменить 4 tab-плейсхолдера Granola-grade контентом + Layer 1 disclaimer драфт + S6 body tightening + S7 quote consolidation |
| product-designer (ты, follow-up) | 4-6 | Ребаланс ячеек S2 · mono-accent тест в S6 · визуальное размещение audience-whisper · footer disclaimer 3-layer visual spec |
| frontend-engineer | 4-6 | Layer 2 раскрывающийся native HTML details/summary · S2 cell swap · §S3 strip заголовка · S7 single-quote layout · фикс footer waitlist CTA |
| a11y-architect | 1-2 | Аудит Layer 2 details/summary keyboard + screen-reader · аудит audience-whisper читаемого порядка |
| brand-voice-curator | 1-2 | Sign-off на time-anchor sub + audience-whisper + Layer 1 disclaimer |
| **Итого** | **18-28h** |  |

### Sequencing

**Один PR (v4-A).** Все изменения нон-структурные; ни одна секция не добавлена и не убрана. Шипится одним commit-set без риска partial state.

---

## §3 Опция B — «Narrowed Wedge»

### Стратегическая позиция

Берём сильнейший конкурентный вывод R2 (chat-first hero + pattern-detection JTBD незаполнены в прямом fintech) — **продвигаем над сгибом и называем ICP**. Строим на R3.V2 (audience-named hero) и R3.V1 (time-anchor sub), но синтезируем в один hero, а не A/B-тестим. Берём R2.Adopt-2 (broker-marquee раньше) чтобы кэшировать «1000+ brokers» trust-signal раньше в reading order.

Ставка: в 2026 дифференциатор для fintech-AI Sage-инструмента — **ясность кому-это-для + ясность что-делает-уникально**. У Provedo есть и то и другое (chat-first + multi-broker), но они закопаны — Опция B их раскапывает. R2 §8 30-секундный тест называет gap точно («ICP weak, chat-first wedge implicit not explicit»); Опция B его закрывает.

### Изменения по секциям

| § | Изменение | Источник |
|---|---|---|
| S1 Hero | **REPLACE.** Новый hero комбинирует audience-naming (R3.V2 head) + chat-as-product-anchor (текущий Provedo lock) + time-anchor (R3.V1 sub). См. locked variation ниже. | R3 §7.V1+V2 синтез |
| S2 Proof bar | **REVISE.** То же что в Опции A (drop «Lane A —» prefix; swap demo-count на time-anchor). **Добавить 6-ю ячейку или модифицировать #4: «$9/month» Plus-tier цена** для surface'а price-якоря (R3 §5 trend; R2 §7.Adopt-1). | R2 §7.Adopt-1, R3 §8.M4 |
| S3 Negation | **REVISE+REPOSITION.** Сохраняем строки негации + affirmation closer. **Перенести ПОСЛЕ demo-табов (§S4)** — пусть demo сначала покажет что Provedo ЕСТЬ, тогда блок негации читается как Lane-A дисциплина, а не disclaim-pre-product. R2 §6.Opp-2 второй вариант. | R2 §6.Opp-2 |
| **NEW** — Broker marquee thin strip | **ADD между S2 и S4.** Тонкая лого-полоса (slate-700 monochrome, высота ~64px) — визуализирует «1000+» из proof-bar который сейчас абстрактен. Оригинальный §S8 marquee может либо остаться (visual rhyme), либо downgrade до wider strip в S4. | R2 §7.Adopt-2 |
| S4 Demo tabs | **REVISE.** Тот же content-fidelity апгрейд что в Опции A (Granola-grade real example output) + **продвинуть chat-first framing в section header**: «Ask on your actual holdings» становится «Chat with your portfolio. Across every broker.» — якорит chat-first wedge в названии секции. | R1 §4.R1, R2 §6.Opp-1 |
| S5 Insights bullets | **KEEP.** | — |
| S6 Editorial mid-page | **KEEP.** | — |
| S7 Testimonials | **REVISE.** То же что в A (одна взвешенная цитата + honest pre-alpha строка). | R3 §6.20 |
| S8 Aggregation marquee | **REPLACE-OR-DOWNGRADE.** Если новый thin marquee добавлен между S2-S4 (выше), полная §S8 marquee-секция избыточна. **Заменить §S8 на «Sources for every observation»** — показываем cite-trail commitment которая по R2 §6.Opp-5 — Provedo trust-anchor не несомый ни одним пиром. Визуал: 3-card strip — «AAPL Q3 earnings 2025-10-31 → press release link», «Schwab statement 2025-11-01 → broker source», «KO ex-div Sept 14 → SEC filing». | R2 §6.Opp-5 |
| S9 FAQ | **REVISE.** То же что в A (R3.M1 «Questions you'd ask»). | — |
| S10 Pre-footer CTA | **KEEP.** | — |
| Footer disclaimer | **ADOPT three-layer pattern** (то же что в A). | R3 §9 |
| **ADD** — User-empowerment line | После closer'а §S3, одна строка: «You stay in charge. Provedo just shows you everything.» | R2 §6.Opp-4 |
| Bug fix | Тот же фикс waitlist trial-CTA. | R3 §8.M3 |

### Hero-вариация (locked)

| Элемент | Копи | Знаков | Voice-check |
|---|---|---|---|
| Audience headline | For investors who hold across more than one broker. | 52 | descriptive ICP, allowlist-clean |
| Sub | Provedo leads you through every position, every dividend, every drawdown. Five minutes a week. | 95 | leads-through + scope-list + time-anchor; «leads» апгрейд от «will lead» (present-tense, R3 §2 trend-fit) |
| Primary CTA | Ask Provedo | 11 | named-noun продуктовый CTA |
| Secondary | Start free forever | 18 | (R3.M2) |
| Small-print | 50 free questions a month, no card. | 36 | (R3 §6.8: «messages» → «questions» — investor-task регистр) |

**Voice-check:** «leads you through» — апгрейд v3.1 «will lead» — present-tense без потери allowlist-глагола (R3 §2 trend-fit + R3 §7.V2 sub-pattern). Audience-headline — descriptive ICP-statement; не advisor-claim. Scope-list «every position, every dividend, every drawdown» — R2.Opp-3 pattern-artefact-list, всё observation-coded. Pass.

### Подача демо (§S4)

**Сохранить табы + заменить контент на реальный + section-header продвигает chat-wedge.** Та же Granola-grade content-fidelity что в A, плюс заголовок секции переписан чтобы заякорить chat-first JTBD который R2 §3 показывает как незаполненный. Hero уже показывает typing-animation; section header усиливает «вот что отличает нас в этой категории, и мы достаточно уверены чтобы озаглавить секцию так».

### Дисклеймер

**То же что в A — берём R3 §9 трёхуровневый.**

### Бюджет анимации

**Умеренный.** Hero typing animation (сохранена). Parallax-stack (сохранён). Новый thin broker-marquee scroll'ится (уже marquee; reduced-motion fallback на static row). S4 demo charts simultaneous-reveal (locked из v3.1 finance-патча). S8 sources-strip cards имеют hover state раскрывающий source URL preview — небольшое новое взаимодействие. Без нарушений 5 правил анимации.

### Доказательная база

- Audience-naming hero: **R2 §6.Opp-1** (chat-first uncontested), **R2 §7.Adopt-4** (Kubera audience-named hero), **R1 §4.R3** (Granola; «8/8 confidence — adopt»), **R3 §7.V2** explicit candidate.
- Pattern-artefact list в sub: **R2 §6.Opp-3** explicit рекомендация.
- Broker marquee раньше: **R2 §7.Adopt-2** (4/7 прямых конкурентов ведут с broker-trust сигналом ближе к сгибу; Provedo на S8 ниже медианы).
- Negation post-demo repositioning: **R2 §6.Opp-2** второй вариант (тестим reorder hero → demo → negation).
- Chat-first section header: **R2 §3** (chat-first JTBD whitespace map: 0/7 прямых пиров, только Wealthfolio как третичный).
- Sources cite-trail card-strip: **R2 §6.Opp-5** explicit рекомендация.
- Price-on-hero proof-bar cell: **R2 §7.Adopt-1** (Kubera + Sharesight; 4/7 скрывают цену, Provedo тоже).
- User-empowerment line: **R2 §6.Opp-4** (ни один пир не фреймит «no advice» как user-empowerment positively).
- Three-layer disclaimer: **R3 §9**.
- v3.1 microcopy баг: **R3 §8.M3**.

### Trade-off'ы (3)

1. **Меняет hero-poetry на ICP-сигнал.** Headline становится audience-named («For investors who hold across more than one broker») — теряется imperative-Provedo регистр «Provedo will lead you through your portfolio» который PO залочил 2026-04-25. R3 §11.Q2 эксплицитно флагует это как стратегический trade-off (PO call). Выше cold-traffic ясность, ниже brand-poetry.
2. **Больше структурных изменений → выше execution-risk.** Опция B добавляет thin marquee, заменяет §S8 на sources-strip, перемещает §S3 ниже §S4, добавляет user-empowerment line. Видимый ритм страницы существенно сдвигается. Часы frontend-engineer + product-designer масштабируются вверх; bug-surface во время slice'а тоже.
3. **Выше моушн + больше интерактивных поверхностей.** Новый thin marquee + sources-strip hover state поднимают motion-budget относительно A. В рамках 5-rule compliance, но ближе к потолку. Reduced-motion fallback work масштабируется.

### Lane A градиент риска (vs v3.1) — 0-5

| Вектор | v3.1 | Опция B | Δ |
|---|---|---|---|
| Implicit-recommendation drift | 1 | 1 | держим |
| Personalization drift | 1 | **2** | +1 (audience-naming создаёт более резкое «for you» прочтение в cold traffic; смягчается Lane A сигналингом в proof bar, но ICP-ed страница может ощущаться как «built for me» — это шаг от «advises me») |
| Social-proof-as-rec drift | 1 | 1 | держим |
| Animation-narrative-causation drift | 0 | 0 | держим |

**Net:** Опция B вводит +1 personalization-drift риск через audience-naming. Митигация — audience-line descriptive («who hold across more than one broker») а не advisory («who want to maximize returns») — Kubera «those who manage their own wealth» — чистейший прецедент и не читается как personalization. Тем не менее **finance-advisor + brand-voice-curator должны review'нуть audience-naming framing** перед ship'ом.

### Сохранение voice fingerprint

**Держится но с риском повыше.** Magician+Sage регистр сохранён в sub-line и заголовке §S4. Everyman-модификатор усиливается в hero-headline (audience-naming = Everyman direct-address). Риск: page-rhythm shift в сторону «product-claim над сгибом + cite-trail strip + price-on-proof-bar» может читаться как **слегка более агрессивный коммерческий регистр** vs чисто-Sage editorial Опции A. R3 §11.Q1 флагует это как требующее sign-off brand-voice-curator; риск Опции B концентрирован на каденции «every position. every dividend. every drawdown.» — Stripe-imperative-adjacent. Brand-voice-curator должен решить не дрейфит ли эта каденция off-Sage.

### Оценка scope'а

| Роль | Часы | Заметки |
|---|---|---|
| content-lead | 12-16 | Demo-плейсхолдер rewrite (как в A) + новый hero + sources-strip card content + user-empowerment line + S4 section header rewrite |
| product-designer (ты, follow-up) | 8-12 | Hero re-spec · новый thin broker-marquee компонент · sources-strip card design · §S3 reorder spec · ребаланс proof-bar cell |
| frontend-engineer | 12-16 | Hero rewrite · новый ProvedoBrokerMarqueeStrip компонент · ProvedoSourcesStrip section · §S3 reorder · добавить proof-bar cell · фикс footer waitlist |
| a11y-architect | 2-3 | Аудит нового audience-headline reading-order · аудит sources-strip hover/keyboard · аудит reduced-motion на новом marquee strip |
| brand-voice-curator | 2-4 | Hero variation + section header + audience-line + user-empowerment line + cadence review |
| **Итого** | **36-51h** |  |

### Sequencing

**Два среза (LP4-Ba и LP4-Bb) рекомендуется.** Slice-LP4-Ba: hero rewrite + audience-line + добавить proof-bar cell + footer фикс + 3-layer disclaimer (низкий структурный риск, немедленная cold-traffic clarity лифт). Slice-LP4-Bb: thin broker-marquee + sources-strip § заменяющий S8 + reposition §S3 + S4 header rewrite + Granola-content rewrite (более глубокие структурные изменения; может shipped через 1-2 недели после Ba).

---

## §4 Опция C — «Negation-Forward»

### Стратегическая позиция

Берём R3.V5 (negation-led hero) и **переупорядочиваем страницу так что что-Provedo-НЕ предшествует что-Provedo-ЕСТЬ**. Тянем паттерн Kubera «Skip the middleman» дальше чем сама Kubera — они закапывают Lane A в копи, Опция C делает Lane A **первым что видит посетитель**. R2 §5 документирует что 3/7 прямых конкурентов держат Lane A на 0; только Kubera делает негацию *фичей*; **0/7 ведут негацией**.

Ставка: в 2026 сильнейший single positioning ход доступный fintech-AI Sage-инструменту — когда жанр захлёбывается advice-y AI-financial-agent claim'ами (Getquin) и амбивалентными «smart-investor» обещаниями (Sharesight) — это **эксплицитный отказ играть в жанр**. Негация ЕСТЬ бренд. R1 §6.T2 называет это Provedo-доступной positioning equity: «Range "not a brokerage / not a spreadsheet" + Granola "no meeting bots" оба показывают что negation as positioning может читаться более уверенно чем capability-claim регистр.»

### Изменения по секциям

| § | Изменение | Источник |
|---|---|---|
| **NEW S1** Negation hero | **REPLACE текущий S1.** Три строки негации + affirmation closer становятся hero. CTA-слой остаётся dual-stack. | R3 §7.V5 (расширенный) |
| **NEW S2** Affirmation reveal | Прежний v3.1 hero (typing animation + chat surface mockup) становится §S2 — что-Provedo-ЕСТЬ, после негации. Typing animation запускается на scroll-into-view, не на page-load. | R3 §7.V5 rationale |
| S3 Proof bar | **PROMOTE** прежнего S2 сюда. Те же ревизии что в A+B (drop «Lane A —» prefix; swap demo-count на time-anchor; добавить «$9/month» Plus-tier cell). | R3 §8.M4, R2 §7.Adopt-1 |
| S4 Demo tabs | **REVISE.** Granola-grade content-fidelity rewrite (как в A+B). Section header заостряется до «Four answers Provedo finds in your real positions.» (текущий sub становится head; новый sub называет cite-trail). | R1 §4.R1 |
| S5 Insights bullets | **KEEP.** | — |
| S6 Editorial mid-page | **KEEP.** Locked candidate #2 closer держится. | — |
| S7 Testimonials | **REVISE.** Single weighted цитата + honest pre-alpha строка (как в A+B). | R3 §6.20 |
| S8 Broker marquee | **KEEP** в текущей позиции, **trim** до thin strip (R2 §7.Adopt-2). Полный §S8 marquee избыточен если S3 proof bar несёт «1000+»; thin лого-strip несёт visual proof. | R2 §7.Adopt-2 |
| S9 FAQ | **REVISE.** R3.M1 + Q1 ведёт с «No, Provedo does not give investment advice. It provides clarity, observation, context, and foresight.» — усиливает echo негации из §S1. | R3 §8.M1, R2 §6.Opp-2 |
| S10 Pre-footer CTA | **KEEP.** | — |
| Footer disclaimer | **Adopt three-layer pattern** (как в A+B). С негацией в hero, Layer 1 plain-language summary наследует визуальную рифму. | R3 §9 |
| **ADD** — Audience-whisper micro-line | Как в A — одна строка под negation-hero или small-print в proof-bar: «For investors who hold across more than one broker.» | R1 §4.R3, R2 §7.Adopt-4 |
| Bug fix | Тот же waitlist trial-CTA фикс. | R3 §8.M3 |

### Hero-вариация (locked)

| Элемент | Копи | Знаков | Voice-check |
|---|---|---|---|
| Hero head (3-line negation) | Provedo is not a robo-advisor. / Provedo is not a brokerage. / Provedo will not tell you what to buy. | 84 всего | эксплицитный Lane A disclaim регистр; allowlist-compatible (negation как структурное устройство) |
| Affirmation closer (в hero) | What Provedo does: leads you through your portfolio across every broker, with sources for every answer. | 102 | leads-through (allowlist) + scope-claim + cite-trail; Sage gravitas |
| Audience whisper | For investors who hold across more than one broker. | 51 | descriptive ICP |
| Primary CTA | Ask Provedo | 11 | named-noun продуктовый CTA |
| Secondary | Start free forever | 18 | (R3.M2) |

**Voice-check:** Три строки негации — это §S3 negation-строки v3.1 verbatim — уже Lane A clean (R3 §6.10). Affirmation closer — candidate #1 из §S6 candidate set (v1 default), upgraded c «leads» (allowlist) + «with sources for every answer» (cite-trail anchor). Pass.

### Подача демо (§S4)

**Гибрид: scroll-revealed typing animation + Granola-grade tab контент.** Typing animation которую v3.1 несёт в hero перемещается в **§S2** (сразу после negation hero) — запуск на scroll-into-view по паттерну usePrefersReducedMotion + IntersectionObserver (frontend-engineer переиспользует existing typing hook). Читатель сначала видит negation, потом видит как chat-surface оживает. Четыре таба в §S4 наследуют Granola-grade content-fidelity апгрейд.

У этого sequencing'а нарративная сила: «Вот что мы НЕ (calm gravitas) → Вот продукт работающий (proof of capability) → Вот четыре примера на ваших реальных holdings → Вот почему мы держим feed → Вот editorial-line.» — страница читается как уверенный спокойный reveal, не маркетинговый аргумент.

### Дисклеймер

**То же что в A+B — берём R3 §9 трёхуровневый.** С негацией в hero, Layer 1 plain-language summary («Provedo provides information about your portfolio. It is not investment advice — every decision stays yours.») наследует visual rhyme с hero-negation-строками.

### Бюджет анимации

**Сдержанный-к-умеренному.** Hero теряет typing animation в пользу §S2 (typing теперь на scroll-into-view). Negation hero — **статичный** (Sage gravitas — по-прежнему страница, сдержанная типографика, никакого движения). §S2 typing animation (сохранена). §S4 simultaneous demo (сохранена из v3.1 патча). Всё в рамках 5-rule compliance.

R3 §10.A1 (gradient hero) — Опция C — самое сильное отвержение этого anti-pattern: hero — *буквально три предложения чёрного текста на тёплом креме*. Anti-flashy-AI регистр на максимуме.

### Доказательная база

- Negation-led hero: **R3 §7.V5** (наиболее дифференцированный; brand-territory-expanding); **R1 §6.T2** (negation as positioning equity, эксплицитно названа Provedo-доступной); **R2 §6.Opp-2** (Lane A как positioning копи, не просто disclaimer); **R2 §7.Adopt-5** (Range + Kubera negation).
- Lane A как видимая фича: **R2 §5** Lane A градиент (только Snowball + Kubera + Wealthfolio на 0; Kubera делает фичей; никто не продвигает negation в hero).
- Pre-emptive ответ на «is this an AI advisor?»: **R3 §3 «Lane-A trade-off worth flagging»** — Anthropic умышленно не показывает финансовый-data ответ над сгибом; Опция C инвертит: **показывает negation ПЕРЕД продуктом**.
- Granola-grade demo контент: **R1 §4.R1**.
- Proof-bar ревизии: **R3 §8.M4, R2 §7.Adopt-1**.
- Audience-whisper: **R1 §4.R3, R2 §7.Adopt-4**.
- Three-layer disclaimer: **R3 §9**.

### Trade-off'ы (3)

1. **Pre-load'ит mistrust до того как пользователь узнал что продукт.** R3 §7.V5 называет риск эксплицитно: «pre-loads mistrust before user knows what product is». Cold-посетитель приземляется на три строки negation и CTA — может bounce'нуть до того как §S2 раскроет реальный продукт. Brand-strategist + finance-advisor должны решить перевешивает ли upside дифференциации first-second-bounce риск для cold traffic.
2. **Сложнее всего отыграть назад.** Negation-led hero — strategic-posture commitment, не copy-выбор. Раз shipped, отступление к product-led hero выглядит как brand walked back its own confidence. Опция C — самая high-cost single-decision; rolling forward от A или B к C проще чем от C куда-то ещё.
3. **Самые высокие costs координации brand-voice-curator + finance-advisor + legal-advisor.** Negation в hero толкает Lane A signaling до visible максимума. Каждый Phase-3 валидатор имеет прямые stakes в том правильно ли читается negation-фразировка в его домене (legal: pre-empt'ит ли «not a robo-advisor» regulator-readable disclaim? finance: depress'нет ли это конверсию среди ICP-A которые пришли ожидая AI-tool жанр? brand-voice-curator: над-крутится ли страница на Lane A и теряет ли Magician-foresight регистр?).

### Lane A градиент риска (vs v3.1) — 0-5

| Вектор | v3.1 | Опция C | Δ |
|---|---|---|---|
| Implicit-recommendation drift | 1 | **0** | -1 (negation-в-hero pre-empt'ит любое implicit-rec прочтение; читателю сказали что Provedo НЕ есть до того как он что-либо ещё прочитал) |
| Personalization drift | 1 | 1 | держим |
| Social-proof-as-rec drift | 1 | 1 | держим |
| Animation-narrative-causation drift | 0 | 0 | держим |

**Net:** Опция C — единственная которая **усиливает** Lane A дисциплину ниже v3.1 baseline. Implicit-recommendation drift drop'ает до 0 потому что страница буквально открывается с «Provedo will not tell you what to buy.» Любой последующий demo-контент не может drift'ить в implicit-rec потому что Lane A позиция объявлена как positioning.

### Сохранение voice fingerprint

**Смешанный риск.** Magician-архетип риск: negation-led hero **subdues Magician** (foresight / pattern-recognition / craft) в пользу чистого Sage (stewardship / observation / disclaim). Страница — **самая-Sage** из трёх опций — ценой Magician-modifier баланса который позиционный замок specifies (Magician primary + Sage). §S2 reveal восстанавливает Magician через typing animation (chat-as-pattern-recognition surface), но сам hero — Sage-only.

Everyman риск: низкий. Negation-строки прямые, plain-language («Provedo is not a robo-advisor») — Everyman accessibility intact.

R2 §4 voice 2x2: Опция C **углубляет lower-friendly information-only квадрант** даже сильнее чем v3.1 — тянет в Kubera-information-coded территорию больше чем текущая Provedo-Everyman-warmer позиция. Trade-off реален; brand-voice-curator должен решить.

### Оценка scope'а

| Роль | Часы | Заметки |
|---|---|---|
| content-lead | 8-12 | Hero negation rewrite + affirmation closer + Granola-grade demo контент + Layer 1 disclaimer + усиление §S9 Q1 |
| product-designer (ты, follow-up) | 10-14 | Новая negation-hero типографика + §S2 reveal section spec + scroll-trigger animation spec · ребаланс proof-bar cell · визуальное размещение audience-whisper · footer disclaimer 3-layer visual |
| frontend-engineer | 16-22 | Hero rewrite (typography-led, без typing) · §S2 компонент (chat-typing-on-scroll-into-view) · IntersectionObserver hookup · добавить proof-bar cell · §S8 marquee thin-strip · footer waitlist фикс · 3-layer disclaimer details/summary |
| a11y-architect | 3-4 | Аудит negation-hero reading-order · аудит §S2 scroll-triggered animation reduced-motion fallback · аудит Layer 2 disclaimer details/summary · аудит S4 simultaneous-demo (уже shipped) |
| brand-voice-curator | 3-5 | Hero variation review (negation-led — самые большие brand-territory implications) · audience-line review · demo-section voice review · cadence pull-back для удержания Magician modifier в §S2-S6 |
| finance-advisor | 1-2 | Cold-traffic conversion-risk оценка + Lane A signaling adequacy review |
| legal-advisor | 1-2 | Negation-hero phrasing regulator-readability review + Layer 1 disclaimer wording |
| **Итого** | **42-61h** |  |

### Sequencing

**Два среза (LP4-Ca и LP4-Cb) обязательно.** Slice-LP4-Ca: full negation-hero + §S2 typing-on-scroll + page reorder S1-S2-S3 + proof-bar revisions + footer 3-layer disclaimer + bug фикс (высокий структурный риск; ships первым как standalone observable change). Slice-LP4-Cb: Granola-grade demo контент + S8 marquee thin-strip + усиление §S9 FAQ Q1 + S7 testimonial consolidation (lower-risk content-pass; ships через 1-2 недели после Ca, с одобрениями Phase-3 валидаторов).

**Не может shipping одним PR'ом** — слишком много surface change для безопасного single-merge'а. Ca определяет brand-territory ход; Cb углубляет content fidelity внутри новой структуры.

---

## §5 Сводная таблица сравнения

| Измерение | Опция A — Editorial Sage | Опция B — Narrowed Wedge | Опция C — Negation-Forward |
|---|---|---|---|
| Стратегическая позиция | Доверять editorial *show* | Доверять product *tell* | Доверять disciplined *refuse* |
| Hero | Текущая голова + R3.V1 time-anchor sub | Audience-named голова + scope-list sub | Three-line negation + affirmation closer |
| Стратегия demo | Сохранить табы + Granola-grade real content | То же + chat-first section header | То же + typing animation переезжает в §S2 scroll-reveal |
| Lane A risk delta vs v3.1 | держим (1/1/1/0) | +1 personalization (1/2/1/0) | -1 implicit-rec (0/1/1/0) |
| Сохранение voice | Сильнейшее (Magician+Sage держится) | Среднее (лёгкий Stripe-cadence риск в scope-list sub) | Смешанное (Sage усилен; Magician подавлен в hero, восстановлен в §S2+) |
| Scope (часы всего) | 18-28h | 36-51h | 42-61h |
| Sequencing | Один PR (v4-A) | Два среза (LP4-Ba + LP4-Bb) | Два среза (LP4-Ca + LP4-Cb) |
| Сильнейшее research-доказательство | R1 §3 6/8 editorial-mid-page + R1 §4.R1 Granola | R2 §6.Opp-1 chat-first uncontested + R2 §7.Adopt-4 Kubera audience | R1 §6.T2 negation positioning equity + R2 §5 Lane A градиент |
| Top trade-off | Жертвует новизной ради бренд-связности; откладывает chat-first wedge | Меняет hero-poetry на ICP-сигнал; +1 personalization-drift | Pre-load'ит mistrust до продукта; самая high-cost single-decision |
| Differentiation upside | Самый низкий (продолжение текущего направления с content fidelity) | Средний (зажигает uncontested chat-first wedge в категории) | Самый высокий (самый distinct hero среди 2026 fintech-AI) |
| Reversibility | Самая высокая (нет структурных изменений для отмены) | Средняя (page-rhythm shift можно tune'ить post-ship) | Самая низкая (negation-hero — brand-territory commitment) |
| Лучше всего подходит когорте | HNW Sage-aware reader (R2 ICP A premium-tier) | Productivity-native multi-broker millennial (R2 ICP A standard) | Fintech-Twitter regulatory-aware niche + brand-press cohort |

### Общее для всех трёх опций

1. Заменить bracketed-плейсхолдеры демо на Granola-grade полностью прописанный example output (R1 §4.R1) — universal.
2. Three-layer disclaimer паттерн (R3 §9) — universal; sign-off legal-advisor по Layer 1 обязателен.
3. Footer waitlist trial-CTA leak фикс (R3 §8.M3) — universally required.
4. Single weighted testimonial + «alpha quotes coming Q2» строка (R3 §6.20) — universal.
5. Drop «Lane A —» префикс из proof bar cell #4 (R3 §8.M4) — universal.
6. Добавить audience-whisper строку «For investors who hold across more than one broker.» — universal (R1 §4.R3 + R2 §7.Adopt-4 convergence).
7. v3.1 finance/legal патчи на коммите `8cb509b` — held во всех трёх опциях (Tab 3 phrasing · simultaneous animation · sourced benchmark · FAQ Q4 $9 · 75-словный disclaimer остаётся verbatim text за Layer 2).

Это «un-disputable improvements» которые синтез выявил — они shipping даже в no-redesign-decision сценарии.

---

## §6 Открытые вопросы для Phase-3 валидаторов

### Для finance-advisor

- **Опция A:** Триггерит ли time-anchor sub «Five minutes a week. Every broker. Every position.» какой-либо over-promise / FOMO / day-trader-recruitment concern? Честно ли «five minutes» учитывая Free-tier 50-questions/month allocation?
- **Опция B:** Audience-headline «For investors who hold across more than one broker.» — читается как ICP-narrowing или как suggested-fit-for-me (personalization drift)? Рискует ли scope-cadence «every position. every dividend. every drawdown.» читаться как performance-implication?
- **Опция C:** Самый load-bearing вопрос. Depress'ит ли negation-led hero **конверсию среди ICP-A** которые приходят ожидая AI-tool жанр? Конкретно: читается ли «Provedo will not tell you what to buy» как «Provedo менее powerful чем Getquin/Magnifi» для productivity-native millennial? Или regulatory-aware когорта читает как «наконец-то tool который не притворяется advisor'ом»?
- **Universal:** Brand-correct ли новая proof-bar $9/month price-on-hero ячейка (Опции B + C), или читается коммерческое давление (anti-Sage)?

### Для legal-advisor

- **Universal:** Sign-off обязателен на R3 §9 Layer 1 plain-language summary draft: «Provedo provides information about your portfolio. It is not investment advice — every decision stays yours.» — сохраняет ли «provides information about your portfolio» защиту «not personalized recommendation» которую несёт verbatim regulator-readable текст? (R3 §11.Q4 эксплицитно флагнул.)
- **Universal:** Адекватность 3-layer disclaimer паттерна. Layer 2 раскрывающийся native HTML `<details>` — достаточно ли reachable verbatim 75-словный блок для regulator-readability требований (US Investment Advisers Act / EU MiFID II / UK FSMA 2000)?
- **Опция C:** Создаёт ли промоушен 3-line negation в hero какой-либо **affirmative claim risk**? Чтение «Provedo will not tell you what to buy» с regulator-perspective — меняет ли framing negation как positioning копи (vs disclaim копи) интерпретацию? Например, имплицирует ли это что всё ОСТАЛЬНОЕ что Provedo говорит ЕСТЬ advice-by-omission?
- **Опция B:** Audience-headline «For investors who hold across more than one broker.» — есть ли concern «targeted advertising to specific investor cohort» под jurisdictional advertising rules?

### Для brand-voice-curator

- **Universal:** Sign-off обязателен на каденцию time-anchor sub-line. R3 §11.Q1: «every broker. every position.» — drift'ит ли это в Stripe-imperative anti-Sage регистр, или держит Magician-Sage компактность?
- **Опция A:** JBM-mono-accent в §S6 closer (vs italic Inter) — читается ли technical-Sage-Magician регистр правильно, или mono code'ит «product/dev tool» (off-archetype для fintech)?
- **Опция B:** «Provedo leads you through every position, every dividend, every drawdown. Five minutes a week.» — тянет ли scope-list cadence в Outlaw/Hero (capability-claim регистр) или держит Magician-Sage observation? Конкретно: present-tense апгрейд «leads» (vs current «will lead») — улучшение или Sage-foresight-loss?
- **Опция C:** Hero — самое сложное решение. Subdues ли negation-only hero **Magician** до степени нарушающей «Magician primary + Sage modifier» positioning lock? Или §S2 typing-reveal восстанавливает Magician баланс? Если да, где на странице Magician адекватно re-surface'ит?
- **Опция C:** Audience-whisper «For investors who hold across more than one broker.» под negation hero — читается как ICP-naming (correct) или как ICP-recruiting (лёгкий Outlaw/Hero drift)?

---

## §7 Открытые вопросы для PO (через Right-Hand)

Это стратегические вопросы которые синтез не закрывает. Phase-3 валидаторы дают ruling по per-domain техническим вопросам; PO даёт направление по:

1. **Выбор стратегической позиции.** «Show / tell / refuse» — A / B / C. Сильнейший single-decision рычаг.
2. **Reopen hero-замка.** v3.1 hero PO-locked 2026-04-25. Опции B и C обе reopen его. Замок открыт для v4 или hero должен остаться verbatim?
3. **Slice cadence.** Один PR vs два среза — A favors один PR; B и C требуют двух. Constraint таймингов у PO?
4. **Phase-3 validator dispatch budget.** Опция C требует координированных рулинов finance-advisor + legal-advisor + brand-voice-curator. Выше координационная цена vs A/B; ОК тратить?

---

## Файлы (референс)

- `docs/reviews/2026-04-27-ai-tool-landing-audit-product-designer.md` (R1)
- `docs/reviews/2026-04-27-fintech-competitor-landing-audit-user-researcher.md` (R2)
- `docs/reviews/2026-04-27-landing-trends-cro-content-lead.md` (R3)
- `docs/reviews/2026-04-26-finance-advisor-landing-review.md`
- `docs/reviews/2026-04-26-legal-advisor-landing-review.md`
- `docs/reviews/2026-04-26-strong-competitor-landing-audit.md`
- `docs/content/landing-provedo-v2.md`
- `docs/04_DESIGN_BRIEF.md` v1.4
- `docs/product/04_BRAND.md` v1.0
- `docs/product/BRAND_VOICE/VOICE_PROFILE.md` post-Provedo-lock
- `apps/web/src/app/(marketing)/page.tsx` (HEAD `409cda9`, post-`8cb509b`)

**Word count:** ~5 200 (RU adaptation; английский оригинал ~4 750).

**END redesign-synthesis-product-designer-RU.md**
