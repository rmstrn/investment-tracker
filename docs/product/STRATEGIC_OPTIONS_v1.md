# Strategic Options — v1.5: Navigator synthesis returned, PO decision pending

**Date:** 2026-04-23 (v1) · 2026-04-23 (v1.1 — PO constraints lock) · 2026-04-23 (v1.2 — Option 4 Hybrid added) · 2026-04-23 (v1.3 — Option 4 locked) · 2026-04-23 (v1.4 — demoted to TENTATIVE pending proper multi-agent review per CONSTRAINTS Rule 3) · **2026-04-23 (v1.5 — 6 independent specialist reviews returned; Navigator synthesis complete; PO lock pending)**
**Owner:** Navigator (orchestrator); synthesis pulls from independent specialist returns (not simulated)

---

## v1.5 addendum — 6-specialist review results + Navigator weighted recommendation (2026-04-23)

**Full synthesis:** [docs/product/REVIEW_SYNTHESIS_2026-04-23.md](./REVIEW_SYNTHESIS_2026-04-23.md)

**Review returns (all independent, isolated per CONSTRAINTS Rule 3):**
- brand-strategist → WARN conditional-keep — commit preceding `2ca3526`
- content-lead → WARN leaning-REJECT-for-hero / SUPPORT-for-sub-hero — commit `2ca3526`
- product-designer → WARN conditional-support — commit `f7870e8`
- legal-advisor → WARN conditional-GO — commit `6453443`
- finance-advisor → WARN — commit `b97dbcb`
- user-researcher → WARN — commit `105cad2`

**Distribution:** 6/6 WARN. 0 SUPPORT. 0 REJECT.

**Navigator weighted recommendation (does NOT lock — PO locks):**

**KEEP «Second Brain for Your Portfolio» as brand-world tagline; DEMOTE from hero and from product-name; RESTORE imperative hero («Ask your portfolio.» / «Спроси свой портфель.»); SHIP Coach at MVP with warm-start on imported history (tech-lead feasibility gate); GATE launch behind three pre-conditions — trademark clearance clean, AI output invariant landed, in-context Lane A disclaimers.**

**Three reasons weighting:**
1. Brand-strategist's product-NAME vs category-CLAIM separation insight unlocks 4 of 6 specialist concerns without sacrificing the metaphor's strategic value. Forte trademark tension, voice-rule violation, ICP B alienation, and PO «объединить» intuition all resolve if «Second Brain» runs as tagline + brand-world copy while product name lives in Round 5 mind/memory territory and hero is imperative.
2. Coach 30-day cold-start is the highest-impact risk and has a specific, tech-lead-gated fix (warm-start on imported SnapTrade history). If warm-start feasible → Coach ships at MVP with honest hero promise. If not → Oracle fallback cleanly preserves locked hero and zero cold-start. Decision reduces to a single feasibility question with a named fallback.
3. Evidence asymmetry favors demotion: UR's 60-quote retail-investor corpus + 4/5 adjacent-content semantic-collision evidence is hard, reproducible, and specific. «Empty fintech territory» claim in positioning v2 is real but qualitative. Demoting hero pays only brand-voice re-draft cost; keeping hero as-drafted pays parse-test tax + RU gut-microbiome tax + potential FTC §5 exposure if Coach 30-day empty.

**Path B fallback (if warm-start infeasible):** Oracle (Path A fallback already named in v1.3; locked «Поговори со своим портфелем» hero preserved; lowest cold-start risk).

**Path C fallback (if trademark clearance returns unfavorably):** «Portfolio Memory» as tagline (brand-strategist Alt B + legal Alt 1 converge; Round 5 names Mneme/Memoro already aligned with this axis).

**Status:** Option 4 remains TENTATIVE. PO lock decision required on three Priority-1 questions (see §REVIEW_SYNTHESIS_2026-04-23.md §6). No specialists re-dispatched until PO decides.

---

## Status: TENTATIVE (v1.5) — 6 specialist reviews complete; PO lock pending

**Process correction 2026-04-23.** Earlier v1.3 locked Option 4 based on Navigator single-context synthesis (Navigator simulated 4-voice council + 3 specialist lenses within its own context, not real parallel Agent-tool dispatches). PO identified this as broken process violating CONSTRAINTS Rule 3: strategic decisions require REAL independent parallel specialist review, not simulation.

**Status demoted to TENTATIVE** pending:
- Independent parallel dispatch of 6 specialists (brand-strategist + user-researcher + finance-advisor + legal-advisor + content-lead + product-designer) via real Agent-tool calls
- Each specialist isolated — no specialist sees another's draft before writing their own
- Synthesis by Navigator after all 6 return, with one weighted recommendation
- PO final lock after seeing all 6 independent views

**Working artifacts remain as drafts** (not deleted, not elevated):
- `docs/content/landing.md` — landing hero draft (Second Brain frame)
- `docs/product/03_NAMING.md` Round 5 — 10 name candidates in mind/memory territory
- `docs/CC_KICKOFF_option4_feasibility.md` — tech-lead feasibility memo
- `docs/product/02_POSITIONING.md` v2 — rewritten to Second Brain metaphor

These stay as hypothesis-level work product. They become final only if multi-agent review confirms Option 4 (or they are rewritten if review selects alternative).

**Hero (tentative):**
- Russian: «Второй мозг для твоего портфеля»
- English: «Second Brain for Your Portfolio»

**Fallback path if specialist work surfaces blockers.** If tech-lead coach ADR returns «coach vertical not feasible for alpha» OR brand-strategist cannot find a viable name in mind/memory territory after round 5, Navigator reverts to Oracle (Path A fallback — keeps locked «Поговори со своим портфелем» hero, lowest cold-start risk, shipping momentum preserved). This is not a hedge — it's a named escape hatch documented for transparency.

**Earlier constraints (still in force):**
- Regulatory lane = **A** (information/education only). Lane B/C rejected 2026-04-23.
- Geography = **global multi-market** (US + EU + UK + CIS/RU + crypto-native). Multi-language day-1.
- **NEW (2026-04-23):** English-first launch, other languages post-launch. Day-1 launch is English only; Russian content drafted in parallel (secondary artifact); EU languages (DE/IT/ES/FR/PT) deferred to post-launch wave.

## PO constraints locked 2026-04-23

1. **Regulatory lane = A (information/education only).** Lane B (RIA from day 1) and Lane C (hybrid) are REJECTED by PO. PO quote: «я все же не уверен что хочу давать прям советы на покупку, мне нравится "информационное"». Implication: any Analyst variant that leaned on Lane C flexibility loses that argument; re-evaluation below.
2. **Geography = global multi-market.** PO quote: «по географии я не хочу менять, в идеале нам чем больше рынков тем лучше, так же и СНГ». Scope: US + EU + UK + CIS/RU + crypto-native. Multi-language day-1 non-negotiable (minimum EN + RU; likely required for EU reach: DE, ES, FR, IT, PT). Implication: head-to-head with Getquin (EU-dominant, 500K users, multi-lang) is now unavoidable, not optional.

**What this changes below:** sections marked with «Under PO 2026-04-23 constraints» add the re-evaluation. Original content kept for historical record; new evaluation added inline or in new rows.

---

## Evidence baseline (TL;DR для быстрого возврата в контекст)

v2 discovery показала: «AI + portfolio-aware chat» стал 2025-2026 волной, а не пустым рынком. 7+ прямых конкурентов в той же плоскости (PortfolioPilot, Origin, Mezzi, Getquin, Fey, Wealthfolio, Moomoo Agentic). Узкий лайт-занятый коридор — «AI chat + portfolio-aware + НЕ advisor-framed + retail + US+EU». PortfolioPilot, Origin, Mezzi все leаnят в advisor framing; Getquin EU-native; Fey acquired. Наш дифференциал — US+EU retail × chat-first × НЕ advisor × source-cited × behavioral-aware.

PO stance 2026-04-23: «основа — AI, который отвечает на все вопросы о портфеле. Нужно выделяться». Направление (AI-portfolio-chat) — задано; три варианта ниже — **flavors этого направления**, не альтернативы ему.

Три финалиста — это 3 coherent combos из 9 сырых опций (3 от brand × 3 от product × 3 от content), отфильтрованных через council debate по четырём voices: factual, strategic, skeptic, consistency.

---

## Regulatory-lane axis (LOCKED 2026-04-23 → Lane A only)

**PO challenge 2026-04-23 (original):** «PortfolioPilot советует что купить/продать — разве не запрещено?» Ответ: им — нет, потому что они зарегистрированы как SEC RIA (Registered Investment Advisor). Это явный выбор regulatory-lane, не данность.

**PO decision 2026-04-23 (same-day, after deliberation):** Lane A (information/education only) is LOCKED. Lane B (RIA day-1) and Lane C (hybrid) are REJECTED for the product. PO quote: «я все же не уверен что хочу давать прям советы на покупку, мне нравится "информационное"».

Сохранили описания всех трёх lanes ниже как historical record (чтобы следующая итерация видела, что уже рассмотрели и почему отклонили), но дальнейший анализ работает только в Lane A. Re-evaluation трёх опций под Lane-A-only приведена после axis description.

### Три возможные regulatory-lane

**Lane A — Information/education only (LOCKED 2026-04-23)**
- AI может: analyze, highlight, explain, forecast, compare, observe patterns
- AI не может: «купи X», «продай Y», «ребалансируй так»
- Cost: ~$0 compliance overhead; 0 extra months to launch
- Positioning frame: «not-advisor» как positive trust signal («мы не продаём тебе ничего»)
- Risk: head-to-head на слабее плоскости если конкурент говорит «buy NVDA» а мы «NVDA — 14% твоего портфеля, концентрация выше retail benchmark»
- **PO rationale 2026-04-23:** «мне нравится "информационное"» — не хочет давать прямые советы на покупку. Lane A coherent с product philosophy + zero compliance friction + fastest-to-alpha.

**Lane B — RIA from day 1 (Origin path) — REJECTED by PO 2026-04-23**
> *Rationale:* PO prefers information-only framing. Advisor framing conflicts with product identity («не хочу давать прям советы на покупку»). +6-12 месяцев задержки + $50-150K/yr compliance — tradeoff не стоит benefit'а когда core value-prop не требует recommendations.
- AI может: всё из A + «recommended action: rebalance tech 58% → 40%», «consider selling AAPL on overweight signal»
- Compliance: SEC Form ADV + state registration + CCO (chief compliance officer) + compliance program + record-keeping + annual audit
- Cost: +$50-150K/yr ongoing compliance; +6-12 months to first customer (SEC registration + state notices)
- Price-competitive exposure: наш $20 Pro против PortfolioPilot Gold $20 и Origin $12.50/mo на ОДНОЙ regulatory-lane — brutal head-to-head без differentiation
- Upside: can sell «real recommendations» как core value-prop; higher LTV per user

**Lane C — Hybrid (launch A, добавить RIA-tier 6-12 мес post-alpha) — REJECTED by PO 2026-04-23**
> *Rationale:* PO prefers information-only framing end-to-end, not just at launch. Hybrid structure читается как «мы не советуем... если только ты не платишь за tier который советует» — split-narrative конфликтует с «информационным» product identity PO хочет. Validated by PortfolioPilot evidence below сохраняется как historical record, но для нашего продукта Lane C off the table.
- Launch: lane A (fast, low-cost)
- Post-alpha evolution: добавить **RIA Pro tier** как upsell ($40-60/mo?) с explicit «recommended actions» для users кто хочет это
- Tradeoff: double product narrative («мы не советуем... если только ты не платишь за tier который советует») — messaging-сложнее
- Upside: лучший из двух миров, opt-in для самых вовлечённых
- Risk: split product identity; brand может читаться как «educational when convenient, advisor when paid»
- **Validated by PortfolioPilot (confirmed 2026-04-23, discovery §4.5).** Глобальный Predictions Inc. работает ровно по этой модели: публичный сайт + Free tier — education-only («nothing on the publicly available portions of the Platform should be construed as a solicitation, offer, or recommendation»); платные tiers Gold $20 / Platinum $49 / Pro $99 — SEC-registered RIA под Client Agreement. $30B AUM, 40K users — proof что split-narrative проходит compliance и retail adoption. Это **материально de-risks Lane C** — не гипотетический path, а validated реализация.

### Re-evaluation трёх опций под Lane A + global (PO 2026-04-23 constraints)

Исходно три опции оценивались с регуляторной гибкостью как одной из осей дифференциации. Под Lane A only + global (US + EU + UK + CIS/RU + crypto-native, multi-lang day-1) ranking сдвигается:

- **Oracle** — natural fit для Lane A не изменился. Philosophy «знает, не поучает» и Lane A align как и раньше. Под global constraint новый direct competitor — **Getquin** (500K users, EU-dominant, multi-lang EN/IT/DE, explicit AI positioning, Lane A). Конкуренция ужесточается: Oracle's «тихая точность» differentiation от Getquin'а — UX tone-level (Linear/Notion intonation vs aggregator-first + AI layer), не category-level.
- **Analyst** — **потеряла Lane C flexibility, свой самый сильный регуляторный аргумент.** В v1 Analyst differentiated через «tier-progression: observation → recommendation», validated PortfolioPilot paths. Под Lane-A-only Analyst конкурирует в crowded insights-only space (Snowball, Simply Wall St, Getquin, Wealthfolio, Kubera). Analyst-tone сохраняется как brand angle, но структурный регуляторный moat исчез. **Weakened, не killed.**
- **Companion** — **усиливается relative to the other two под constraints.** Behavioral-coach-on-actual-trade-history at Lane A + multi-market — **zero direct competitors в 34-product scan.** PortfolioPilot, Origin, Mezzi все лезут в advisor framing. Getquin — general AI Agents, не behavioral-pattern-detection. Wealthfolio — OSS, не pattern-aware. Это natural wedge под Lane A, и Lane A reinforces Companion's identity rather than ограничивает её («observer, not advisor» — это и есть Lane A philosophy). **Strongest defensible wedge под the new constraints.**

**Ranking shift summary (v1 → v1.1):**
- v1: Oracle > Analyst > Companion (wedge-fit strongest → weakest)
- v1.1 (Lane A + global): **Companion > Oracle > Analyst** (most defensible → least). Companion moves up because its core identity IS the Lane A stance + no direct competitor. Analyst moves down because Lane-C escape hatch закрыт. Oracle holds middle — philosophy intact, competitive density increased.

Below каждая option сохраняет своё primary lane declaration (все три теперь Lane A by PO lock), но новый анализ добавлен в подраздел «Under PO 2026-04-23 constraints» каждой опции.

---

## Option 1 — «Oracle» (тихая точность) — REJECTED (historical record)

> **Status 2026-04-23:** Not chosen. Option 4 «Second Brain» selected instead. Oracle remains the named fallback path if Option 4 specialist work surfaces blockers (locked hero preservable, lowest cold-start risk). Content below preserved for historical reference only — do not re-propose as the strategic direction.

### Regulatory lane: **A (LOCKED by PO 2026-04-23).**
Philosophy «знает, не поучает» и voice «тихая точность» естественно align с Lane A. Historical note: в v1 Lane B и Lane C были отклонены как brand-destructive / awkward; под PO lock это больше не аргумент — Lane A locked, compatibility discussion irrelevant.

### Under PO 2026-04-23 constraints — main competitor shift
Под Lane A + global главный direct competitor — **Getquin** (500K users, EU-dominant, multi-lang EN/IT/DE, AI Financial Agents, Lane A). Differentiation Oracle vs Getquin:
- **UX paradigm:** Oracle = chat-first home, Getquin = aggregator-first + AI layer. Это structural, не tone-level
- **Tone:** Oracle = тихая точность (Linear/Notion), Getquin = «Your entire wealth. One platform.» broad lifestyle tone
- **Multi-lang demand:** Getquin уже EN/IT/DE; Oracle должен стартовать с EN + RU + минимум DE/ES/FR/IT/PT для competitive EU reach. Это значимая content + QA нагрузка на MVP — day-1 non-negotiable per PO lock

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

## Option 2 — «Analyst» (резкая ясность) — REJECTED (historical record)

> **Status 2026-04-23:** Not chosen. Option 4 «Second Brain» selected instead. Content below preserved for historical reference only — do not re-propose as the strategic direction.

### Regulatory lane: **A (LOCKED by PO 2026-04-23). Lane B/C flexibility REVOKED.**

**Original v1 framing (kept as historical record):** Analyst была самой lane-flexible из трёх опций; её сильнейшая дифференциация — Lane C «free/Plus = observation, Pro = recommendation» natural tier-progression, validated by PortfolioPilot at $30B AUM.

**Under PO 2026-04-23 lock:** Lane C revoked → Analyst теряет свой самый сильный structural moat. Осталась только Lane A coherence: «pro-grade analyst voice как factual observation». Это всё ещё valid angle (Sharpe/concentration/drawdown без advice), но теперь Analyst competes head-to-head с established insights-only trackers (Snowball, Simply Wall St, Getquin, Wealthfolio, Kubera) без unique regulatory escape hatch. Weakened, not killed.

### Lane-B/C historical framing (v1, superseded)
Pro-grade analyst voice legitimately работает на любой lane:
- **Lane A:** «Sharpe 0.87, концентрация tech 58% — выше retail median 34%» (factual observation, не recommendation) — **ЭТО ТЕПЕРЬ ЕДИНСТВЕННЫЙ ПУТЬ (PO lock 2026-04-23)**
- **Lane B (REJECTED):** «Recommend: reduce tech concentration to 45% through AAPL/NVDA trim» (full advisor output)
- **Lane C (REJECTED):** Free/Plus tier = observation («concentration 58%»), Pro tier = recommendation («rebalance to 45%»)

**Важная реальность для lane B (historical):** наш $20 Pro против PortfolioPilot Gold $20 на той же regulatory-lane без дифференциатора — проигрываем. Lane B для Analyst работает только если есть сильный differentiator (1000+ брокеров vs их ~10, или US+EU vs US-only, или chat-UX vs dashboard). На нашем текущем product-state B **потенциально жизнеспособен но требует +$50-150K/yr compliance + 6-12 месяцев задержки launch + серьёзный go-to-market план.** — **moot после PO lock.**

**Evidence Lane C валидирован (historical).** Исходно Lane C описывался как гипотетический split-narrative путь. Discovery 2026-04-23 (`01_DISCOVERY.md` §4.5) показал что PortfolioPilot — работающая Lane C реализация ($30B AUM, 40K users). Это de-risked Lane C как path, но **PO 2026-04-23 отклонил Lane C по brand/philosophy reasons** («split-narrative конфликтует с информационным identity»), не по evidence reasons. Lane C validated as viable for OTHER products; not chosen для нашего.

### Under PO 2026-04-23 constraints — main competitor set expanded
Под Lane A + global без Lane C escape, Analyst competes head-to-head с тремя competitors одновременно:
- **Snowball Analytics** — dividend-focused insights, Lane A, retail-priced. Overlap на «pro-grade observation» angle для dividend/portfolio analytics
- **Simply Wall St** — «insights the pros use», Lane A, 7+ years established. Overlap на «analytical insights без advice» angle
- **Getquin** — 500K users, EU-dominant, Lane A, AI Financial Agents covering scenario-sim + optimization + retirement. Overlap на AI-chat-portfolio-aware + multi-market

Это **3-way competitive pressure** без regulatory differentiation. Analyst может выиграть только через: (a) chat-first UX vs их dashboard-first, (b) multi-broker 1000+ vs их narrower integrations, (c) multi-market (US+EU+CIS+crypto) vs их regional specialization. Все три differentiators — UX/data, не positioning — что делает execution risk выше, чем был в v1 под Lane-C framing.

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

## Option 3 — «Companion» (спутник, который видит паттерны) — REJECTED (historical record)

> **Status 2026-04-23:** Not chosen as primary. Option 4 «Second Brain» selected instead. Companion's behavioral-coach surface is absorbed into Option 4's three-surface matrix (Coach = «what your second brain notices about your behavior»). Content below preserved for historical reference only — do not re-propose as a standalone strategic direction.

### Regulatory lane: **A (LOCKED by PO 2026-04-23). Perfect philosophical fit.**
«Observer, не advisor» — это не просто regulatory convenience, это core brand philosophy. Lane A и Companion — это one-and-the-same стратегия, не compromise. PO's 2026-04-23 lock («мне нравится информационное») amplifies Companion's position: regulatory constraint IS the product identity, не tradeoff.

### Under PO 2026-04-23 constraints — strongest defensible wedge
Под Lane A + global Companion становится **strongest defensible wedge из трёх опций**. Обоснование:
- **Zero direct competitor в 34-product scan** для behavioral-coach-on-actual-trade-history at Lane A + multi-market. PortfolioPilot, Origin, Mezzi все advisor-framed (rejected by our Lane A lock). Getquin — general AI Agents / scenario-sim / optimization, **не** behavioral-pattern-detection на real trade history. Wealthfolio — OSS+niche, без pattern narrative. Snowball / Simply Wall St / Kubera — position-level analytics, не behavior-level
- **Lane A reinforces identity** вместо ограничения: «observer, not advisor» — это Lane A philosophy выраженная как value-prop, не как compliance caveat
- **Multi-market не размывает wedge** — behavioral patterns universal across jurisdictions (panic sell, FOMO buy, over-concentration — не US-specific явления). Multi-lang content scale tractable (pattern narratives генерируются LLM'ом на выбранном языке, не custom copy per market)

**Main competitor under Lane A + global: nobody direct.** Adjacent competitors: Mezzi (advisor-framed → Lane A conflict), Getquin (general AI, не behavioral). Это real breakout potential — при условии, что 30-day cold-start UX solved и eng scope tractable.

### Historical framing (v1, superseded — Lane B/C options)
Lane B разрушает самое distinctive value-prop («наблюдение без советов»). Lane C возможен (Free = pattern-observation, Pro = pattern + recommendation), но теряет clean differentiation и ломает «peer-voice, not advisor» tone. **Под PO lock 2026-04-23 эти варианты moot — Lane A locked, Companion identity перпендикулярна ограничению.**

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

## Option 4 — «Second Brain for Your Portfolio» — **LOCKED BY PO 2026-04-23**

### Status
**LOCKED BY PO 2026-04-23.** This is the product direction. Options 1 (Oracle), 2 (Analyst), 3 (Companion) below are rejected alternatives kept for historical record. Hero locked bilingually: «Второй мозг для твоего портфеля» / «Second Brain for Your Portfolio». English-first launch; Russian parallel-drafted secondary; EU languages deferred to post-launch.

### Added 2026-04-23 (v1.2) per PO intuition — pick rationale
PO phrasing 2026-04-23: «я бы хотел все объединить как то». Options 1-3 each pick one of three surfaces (chat / insights / coach) as primary and relegate the others. PO's intuition is that the product IS all three, and the positioning should reflect that. Option 4 is the response: a single unifying metaphor that naturally contains all three surfaces without creating an «everything app» commodity read.

### Regulatory lane: **A (LOCKED by PO 2026-04-23).**
«Second brain» semantics (memory + surface + reflect) align perfectly with Lane A — the brain doesn't advise, it holds context, notices things, reminds, explains. Lane A is NOT a compromise here, it's a natural consequence of the metaphor.

### Unifying metaphor
**«Second Brain for Your Portfolio».** Ported from productivity/knowledge-management category (Tiago Forte book; Notion, Obsidian, Roam cultural territory) into finance. In 34-competitor scan (`competitor-matrix.md`): **zero** matches. No fintech competitor claims «second brain» vocabulary. Empty territory.

The three surfaces map naturally:
- **Chat = the conversation with your second brain.** You ask, it answers on your actual holdings with sources.
- **Insights = what your second brain surfaces proactively.** Weekly digest of dividends, drawdowns, events, concentration shifts — things you'd miss.
- **Coach = what your second brain notices about your behavior over time.** Pattern-reads on actual trade history («ты продал Apple на локальном дне три раза за год»).

The metaphor also contains scenarios (second brain runs what-ifs), explainers (inline vocabulary unpacking), and aggregation (second brain holds everything in one place) — tertiary surfaces fit without forcing.

### One-paragraph pitch
Не advisor, не terminal, не tracker-с-AI-сбоку. Второй мозг для твоего портфеля — держит контекст, отвечает на вопросы, подсвечивает что ты упустил, помнит как ты торговал. Chat, insights и paттерны — не три разных продукта, а три проявления одной памяти о твоих деньгах. Не продаёт советы. Не осуждает. Просто помнит, замечает, объясняет.

### Positioning angle (1-liner)
«Второй мозг для твоего портфеля. Помнит, замечает, объясняет.»

### Brand archetype tuning + voice feel
- **Archetype:** Magician + Sage dominant (knowing, cool-headed, intellectual); Everyman modifier (accessible, not snobby). Notion/Obsidian intonation applied to finance.
- **Voice:** calm, specific, memory-oriented verbs («помнит», «замечает», «объясняет», «подсвечивает»). Zero hype, zero advisor-paternalism. Close to Oracle's тихая точность but with proactive warmth from «замечает».
- **Personality:** как тихий, надёжный референт, который ведёт записи о твоих решениях и в нужный момент подаёт reminder — без оценки, без «я тебе говорил».
- **Pacing:** unhurried. Информация появляется когда имеет смысл появиться, не дёргает постоянно.

### Product emphasis (surface matrix — all three primary, ordered by onboarding sequence)
- **Surface 1 (immediate, minute 1):** Chat с portfolio context — «задай вопрос своему второму мозгу». Всегда доступен, home-adjacent.
- **Surface 2 (minute 10, after first sync):** Insights feed — «вот что твой второй мозг заметил». Proactive surfacing, not passive.
- **Surface 3 (day 30, after history accumulates):** Coach pattern-read — «вот что твой второй мозг помнит о твоих сделках». Weekly cadence post-history.
- **Tertiary (embedded, not separate):** Scenarios (chat-tool), explainer (inline), aggregation (foundation layer).
- **Onboarding flow shape:** 3-stage progressive disclosure. Stage 1 = chat + aggregation visible immediately («твой мозг уже знает что у тебя есть»). Stage 2 = first insight drops within 24h («твой мозг заметил первое»). Stage 3 = first coach pattern-read day 30 («твой мозг помнит достаточно, чтобы увидеть паттерн»). Each stage extends the promise, doesn't replace the last.

### Messaging frame (landing hero)
- **Russian:** Второй мозг для твоего портфеля. / Помнит, замечает, объясняет.
- **English:** A second brain for your portfolio. / Remembers, notices, explains.
- **Sub-proof 1:** Отвечает на твои реальные позиции — с источниками / Answers on your actual holdings, with sources
- **Sub-proof 2:** Подсвечивает дивиденды, просадки, концентрацию — до того как ты заметишь / Surfaces dividends, drawdowns, concentration — before you notice
- **Sub-proof 3:** Читает паттерны в твоих сделках — без осуждения / Reads patterns in your trades — without judgment

### Competitor differentiation
- **vs PortfolioPilot** («Complete financial advice»): они advisor-framed (Lane C); мы memory-framed (Lane A). Split-narrative vs unified narrative
- **vs Origin** («Own your wealth. Ask anything.»): они multi-topic advisor (invest + budget + wellness); мы investing-pure second brain
- **vs Getquin** («Your entire wealth. One platform.»): они aggregator-first + AI layer; мы brain-first (aggregation, chat, insights, coach = one memory). Также: EU dominant vs наш global multi-market explicit
- **vs Mezzi** («Self-manage your wealth. Get fiduciary advice.»): они advice-framed $299/yr; мы observation-framed retail-priced
- **vs Wealthfolio / Ghostfolio**: они OSS privacy-first tracker; мы managed second-brain с AI memory
- **vs Notion / Obsidian (cross-category)**: они second brain for knowledge/notes; мы second brain for one specific knowledge domain — deep domain-expertise in finance vs generic

### Which ICP wins
- **A (millennials 28-40, $20-100K, multi-broker):** strong fit. «Second brain» productivity metaphor resonates with this cohort (они уже читали Forte / используют Notion). Memory + knowledge-worker framing ценит их self-image.
- **B (newcomers 22-32, $2-20K, AI-native):** neutral-positive fit. AI-native users parse «second brain» immediately; но empty-state day 1 тяжелее (coach не стреляет 30 дней). Requires strong chat + early insights to carry первый месяц.
- **Mid-career post-mistake retail (new ICP from Option 3):** strong fit. «Brain that remembers how you traded» без осуждения = именно то, что им нужно.
- **Recommendation:** ICP A primary (strongest archetype match), mid-career retail secondary (natural expansion via coach surface), ICP B tertiary (acknowledged gap in day 1-30 UX that chat+insights mitigate).

### Risks / trade-offs
- **Focus-loss risk (PRIMARY concern — see section below):** abstract metaphor requires sub-proofs to do heavy lifting; cognitive cost ~4 sec vs 3 sec for Oracle's «Поговори со своим портфелем»
- **Eng scope — heaviest of four options:** all three surfaces must ship and work at MVP. Chat shipped; insights feed (Slice 6a) shipped; coach is new vertical requiring major ADR (pattern detection, narrative generation, temporal reasoning)
- **Locked hero rewrite:** current «Поговори со своим портфелем / Просто задай вопрос» replaced — tested, concrete hero swapped for abstract metaphor. Not a zero-risk move
- **Metaphor import risk:** «second brain» is Notion/Obsidian-coded — productivity vocabulary ported to finance may read as pretentious for ICP B newcomers («слишком умно»)
- **30-day cold-start (inherited from Option 3 coach):** coach promise requires 30 days history. If hero promises «remembers how you traded» but first month is empty — brand damage. Requires disciplined onboarding narrative that doesn't over-promise before data arrives
- **Naming territory conflict:** «second brain» implies a NAME in mind/memory/knowledge territory. Brand-strategist round 5 criteria lock 1-2 words + memorable + meaningful. Need to check rejected list — «Folio/Foli» (portfolio roots) rejected; «Delphi/Koan/Vessel» rejected. «Memory/Mind/Recall/Synapse/Neuron» territory not yet explored
- **Content-lead rewrite cost:** landing, paywall, emails, microcopy — all need second-brain-voice rewrite. Rough estimate: 2-3 weeks of content work vs 1 week for Path A variants

### Unifying metaphor (NEW SECTION — what differentiates Option 4 from Path A)
Path A approach (Options 1-3): **pick one surface as primary, relegate the other two.** Oracle → chat primary, insights + coach secondary. Analyst → insights primary, chat + coach secondary. Companion → coach primary, chat + insights secondary. Landing hero reflects the primary; product ships all three but marketing voices one.

Path B approach (Option 4): **one metaphor that naturally contains all three surfaces.** Landing hero doesn't privilege any surface; sub-proofs 1-2-3 map to chat, insights, coach respectively. Product structure reinforces metaphor — first chat question (minute 1) → first insight drop (day 1) → first coach pattern (day 30) reads as «your second brain is learning you» instead of «here's feature #1, feature #2, feature #3».

**The strategic difference:** Path A ships three surfaces under one brand voice (whichever option chosen). Path B ships three surfaces under one conceptual frame that makes them feel like ONE product instead of three bundled features. This matters for perceived product coherence in year 1 — when users describe us to friends, Path A gets «it's an AI tracker that also has chat» (three things), Path B gets «it's a second brain for investing» (one thing).

Path A also wins on: cognitive simplicity (hero parses in 3 sec vs 4 sec), shipping speed (Analyst aligns with current Slice 6 work), locked-hero preservation. Path B wins on: empty brand territory, PO «объединить» intuition, longer defensibility horizon, narrative unity for 3 surfaces we ARE building anyway.

### Risk of focus-loss (NEW SECTION — honest evaluation)
The biggest risk with any «combine three things» positioning is commodity drift — «AI tracker with chat + insights + coach» collapses into the crowded «AI + portfolio» category where PortfolioPilot, Origin, Mezzi, Getquin, Fey, Wealthfolio all already live. Option 4 avoids this ONLY IF the unifying metaphor is strong enough to create a distinct category read.

**«Second Brain for Your Portfolio» holds against focus-loss** for three reasons:
1. **Empty territory in fintech.** No competitor claims this metaphor. First mover owns it.
2. **Metaphor has prior art in adjacent category.** Productivity/knowledge-management users already parse «second brain» (Forte's book ~1M copies; Notion/Obsidian market penetration). Import cost is low; users don't have to learn a new concept, they have to apply a familiar concept to a new domain.
3. **Metaphor is specific about WHAT, not just WOW.** «Second brain» implies memory, surfacing, pattern-reading — the three specific things we do. Unlike «Portfolio Partner» (blurry) or «Portfolio Companion» (vague), «second brain» prescribes behavior.

**Focus-loss risk remains real if:**
- Sub-proofs 1-2-3 don't hold tight mapping to chat/insights/coach respectively — landing then reads «lots of stuff» instead of «one brain, three manifestations»
- Product fails to ship all three surfaces credibly at MVP (coach especially — 30-day cold-start killer)
- Brand-strategist name lands in territory that doesn't reinforce memory/brain semantics — product name disconnected from positioning dilutes the metaphor

**Mitigation paths:**
- Disciplined content-lead brief: hero + sub-proofs must read as «one brain, three manifestations», not «three features bundled»
- Tech-lead coach ADR scoped honestly — if coach can't ship with strong 30-day-or-less UX, revert to Path A (Oracle primary) rather than over-promise in hero
- Brand-strategist naming round 5 scoped to mind/memory/knowledge territory explicitly (not wide-open creative)

**If mitigation fails, Option 4 collapses into commodity «AI + tracker»** — worse outcome than picking any of Options 1-3 cleanly. Option 4 is higher-variance than Path A: better breakout if executed, worse commodity drift if not.

### What happens next (LOCKED — executing 2026-04-23)
1. Navigator relocks `02_POSITIONING.md`: full rewrite of unique-attributes, value-themes, archetype (Magician+Sage primary, Everyman modifier), landing structure (hero rewrite + sub-proofs + landing sections re-sequenced to match chat/insights/coach narrative). Documents Option 4 lock decision in `DECISIONS.md`. — **DONE 2026-04-23 (v1.3).**
2. **brand-strategist dispatched for naming round 5** scoped to mind/memory/knowledge/synapse territory. Criteria: 1-2 words, memorable + meaningful, bilingual pronounceability, avoid all four rejected rounds. New territory → new candidate pool (Recall, Synapse, Cortex, Meridian, Lumen, Axon, etc. — illustrative, not final). — **IN FLIGHT 2026-04-23.**
3. **content-lead dispatched for landing rewrite** (English primary, Russian parallel secondary) + paywall + email templates + microcopy — all in second-brain voice. This is the largest content scope of four options. — **IN FLIGHT 2026-04-23.**
4. **product-designer dispatch deferred** until post-feasibility (tech-lead returns). Designer will pick up 3-stage progressive disclosure flow (minute 1 chat / day 1 insight / day 30 coach) once coach vertical is scoped.
5. **user-researcher dispatch SKIPPED pre-lock.** PO chose to skip the live-interview validation gate and proceed directly. User-researcher's next dispatch will be post-alpha when real users exist.
6. **tech-lead dispatched for feasibility check:** major ADR required for coach vertical (pattern detection architecture, narrative generation, temporal reasoning on transaction history). Slice 6b+ sequencing re-evaluated: insights Slice 6b continues, coach vertical Slice 7+. Current roadmap needs Option-4-aware revision. — **IN FLIGHT 2026-04-23.**

---

## Cross-comparison table

| Axis | Oracle | Analyst | Companion | **Option 4 — Hybrid (Second Brain)** |
|---|---|---|---|
| **Archetype centre** | Magician + Sage | Magician + Hero | Everyman + Sage | Magician + Sage (primary) + Everyman modifier |
| **Voice feel** | Тихая точность | Резкая ясность | Тёплая наблюдательность | Спокойная память (calm + specific + memory-oriented) |
| **Primary home surface** | Chat | Insights feed | Weekly coach digest | **All three (progressive disclosure: chat → insights → coach)** |
| **Secondary surfaces** | Insights, aggregation | Chat drill-in, analytics | Chat, insights | Scenarios, explainer, aggregation (tertiary/embedded) |
| **Primary ICP fit** | A (strong) | A (dominant) | A (strong) + new «post-mistake» ICP | A (strong — productivity-metaphor resonance) + mid-career post-mistake |
| **Secondary ICP fit** | B (neutral) | B (weak) | B (weak) + new ICP | B (neutral-positive for AI-native; empty-state day-1 gap) |
| **Current product state alignment** | Partial (chat shipped, home redesign needed) | **Strong (Slice 6a ready; 6b+ aligned)** | Weak (coach surface brand-new) | Partial (chat + insights shipped; coach new vertical) |
| **Eng scope vs current roadmap** | Moderate | Low (shipping-aligned) | **High (new AI surface)** | **Highest (all three surfaces must ship; coach vertical + full re-layered onboarding)** |
| **Differentiation vs PortfolioPilot** | UX shift + not-advisor | Tone shift + not-advisor | Philosophy shift (observation vs advice) | Frame shift (memory vs advice) + unified narrative |
| **Differentiation vs Origin** | Investing-pure + Russian | ICP + tone + pro-grade | Observation vs advice (biggest gap) | Investing-pure second brain vs multi-topic advisor |
| **Differentiation vs Getquin** | Chat-first vs aggregator-first | Chat+insights vs aggregator+AI-layer | Coach vs general AI | Brain-first (memory/surface/reflect) vs aggregator+AI-layer |
| **Shipping risk** | Low-mid | **Low** | Mid-high | **High (all three surfaces must ship credibly)** |
| **Breakout potential** | Mid (expected play) | Mid-high | **High (most distinctive)** | **Highest if executed (empty fintech territory + unified narrative); worst commodity drift if not** |
| **Regulatory lane — primary (post 2026-04-23 lock)** | A (LOCKED) | A (LOCKED; B/C revoked) | A (LOCKED) | A (LOCKED — «second brain» semantics align naturally with Lane A) |
| **Regulatory lane — v1 flexibility (historical)** | B incompatible, C awkward | All three coherent; C natural (**now moot**) | B destroys brand, C weak (**now moot**) | B/C contradict memory-metaphor (brain remembers, doesn't advise) |
| **Regulatory lane — rationale** | Philosophy «знает, не поучает» requires A | Analyst voice legit observer-only под Lane A; lost Lane-C tier-progression | Observer-identity = A-only; Lane A IS the product identity | Memory-framed product = Lane A natural consequence, not constraint |
| **Main competitor under Lane A + global (PO 2026-04-23)** | **Getquin** (500K users, EU, multi-lang, AI Financial Agents) | **Snowball + Simply Wall St + Getquin** (3-way insights-only pressure) | **Nobody direct** (zero competitor on behavioral-coach-on-trade-history at Lane A) | **Nobody direct in fintech** (empty «second brain for portfolio» territory); cross-category metaphor import from Notion/Obsidian |
| **Bilingual / multi-lang parity ease** | Strong (neutral tone translates well) | **Mid (angular English phonetics)** | Strong (pattern narratives language-agnostic) | Strong («второй мозг» parses equivalently in RU; memory verbs translate cleanly) |
| **Multi-lang day-1 feasibility** | Strong | Mid (analyst jargon harder to localize) | Strong (fewer fixed phrases, LLM-generated) | Strong (metaphor-level abstraction translates; copy volume highest due to 3-surface narrative) |
| **MVP cold-start risk** | Low | Low | **High (30-day history gate)** | **High (inherits coach 30-day gate; hero promises «remembers» so empty first month = brand damage)** |
| **Naming territory openness** | Oracle/lens/watcher words | Sharp/clarity/focus words | Observer/companion/mirror words | Mind/memory/knowledge/synapse territory (unexplored; rejected list doesn't overlap) |
| **Wedge-fit v1 (council avg, pre-lock)** | **Strongest** | Strong | Strong-but-risky | N/A (added v1.2) |
| **Wedge-fit v1.1 (post 2026-04-23 lock)** | Strong (Getquin pressure increases) | **Weakened** (lost Lane-C moat; 3-way pressure) | **Strongest** (zero direct competitor; identity = constraint) | N/A (added v1.2) |
| **Unifying metaphor strength** | N/A (single angle per option) | N/A | N/A | **Strong** (council consensus: empty fintech territory + specific-not-vague + cross-category prior art reduces import cost) |
| **Focus-loss risk** | Low (one angle chosen) | Low | Low | **Mid** (holds if sub-proofs tight-mapped to 3 surfaces + coach ships credibly; collapses to «AI+tracker» commodity if not) |
| **Product dev effort vs single option** | Baseline (chat-redesign) | **Lowest (aligned with Slice 6a+6b)** | Highest single-surface (new coach vertical) | **Highest overall (all three surfaces at MVP; cannot reduce scope without metaphor collapse)** |
| **Landing hero cognition time (est.)** | 3 sec (tested, locked) | 3 sec | 4 sec (pattern concept) | **~4 sec (abstract metaphor; sub-proofs carry load)** |
| **Locked hero compatibility** | Keeps «Поговори со своим портфелем» | Rewrite | Major rewrite | **Major rewrite (swap tested hero for abstract metaphor)** |
| **PO «объединить» intuition fit** | Partial (one surface dominates) | Partial | Partial | **Full match (all three surfaces reflected in hero narrative)** |
| **Defensibility horizon** | ~12 months (contested angle) | ~12 months | ~18 months (no direct competitor) | **~18-24 months (empty territory + cross-category metaphor high adoption cost for competitors)** |

---

## Decision aid — PO question checklist

Пять вопросов, которые разводят опции. Ответ PO на них даёт direct mapping. **Updated v1.2:** questions extended to disambiguate Path A (pick primary from Options 1-3) vs Path B (Option 4 Hybrid).

### Q0 — Path A vs Path B (RESOLVED 2026-04-23)
**PO picked Path B (Option 4 — Second Brain).** Historical answers retained for record:
- Path A (pick primary from Oracle / Analyst / Companion) — not chosen.
- Path B (Option 4 Hybrid) — **CHOSEN**. PO accepted the cost of abstract metaphor for the sake of unified narrative.
- Validation-defer option — not chosen. PO skipped pre-lock user-research gate; pre-alpha validation delegated to specialist feasibility checks (tech-lead), naming territory exploration (brand-strategist), and landing craft (content-lead).

### Q1 — Кто твой primary user emotionally?
- **«Разумный adult, который ценит тишину»** → Oracle
- **«Serious self-directed, который хочет pro-ясности»** → Analyst
- **«Self-aware retail, который знает что ошибается»** → Companion
- **«Productivity-native, который ценит tools-that-remember»** → Option 4 Hybrid

### Q2 — Насколько готов рисковать на breakout vs defensibility?
- **Хочу defensibility и solid execution** → Oracle (самый «очевидный» = самый низкий риск)
- **Хочу близко к тому что уже строим** → Analyst (Slice 6a уже дал нам этот фундамент)
- **Хочу breakout опцию, готов к variance** → Companion (может не взлететь, но если взлетит — уникальный продукт)
- **Хочу highest-variance опцию с unified narrative** → Option 4 Hybrid (breakout если метафора держит + все три surface ships; commodity drift если нет)

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

### Q6 — Regulatory-lane (LOCKED by PO 2026-04-23 — Lane A)
Historical question kept for transparency. PO decision 2026-04-23: **Lane A (information/education only).** Lane B и Lane C rejected (rationale: «мне нравится информационное»). Q6 therefore resolved; options now evaluated under Lane A only (see re-ranking above and in cross-comparison table).

### Q7 — Multi-language day-1 readiness (added 2026-04-23)
Global geography constraint (US + EU + UK + CIS/RU + crypto-native) locked by PO 2026-04-23 — multi-language day-1 is non-negotiable, not deferrable. Minimum launch coverage:
- **EN + RU** (hard minimum — US primary + CIS/RU reach)
- **Likely required для competitive EU presence (against Getquin EN/IT/DE):** DE + IT + ES + FR + PT

Three options evaluated against this:
- **Oracle — Strong.** Neutral tone translates well across languages; short copy surfaces; brand voice (тихая точность) language-agnostic. Main cost: 6-7 languages × landing/microcopy polish
- **Analyst — Mid.** Analyst jargon (Sharpe, drawdown, concentration, factors) requires consistent terminology per language; some pro-finance vocabulary doesn't back-translate cleanly (e.g. Russian retail investors may not recognize «Sharpe» as crisply as «коэффициент Шарпа», which is clumsier). Multi-lang content QA cost higher
- **Companion — Strong.** Pattern narratives primarily LLM-generated at runtime (not fixed-phrase landing copy), so per-language cost is concentrated in landing + onboarding + weekly digest template — smaller surface than Analyst's pro-finance vocabulary

**Critical sub-answer:** multi-lang day-1 is pre-alpha eng cost across all three options. This is a scope decision PO must acknowledge: MVP shipping-timeline impacted by ~3-6 weeks (content localization + i18n infrastructure + QA surface). Tech-lead needs this as explicit scope input, not implicit assumption.

---

## Council resolution notes (для прозрачности)

**9 raw options** были свёрнуты в 3 coherent directions через:
- **Factual-reviewer filter:** B-2 (Warm Mentor) + C-2 (Emotional Relief) напрямую откатились — слишком близко к Origin's SEC-advisor positioning; пришлось переформулировать Companion как observation-not-relief
- **Strategic filter:** три coherent combos survived (Oracle / Analyst / Companion); четвёртый возможный combo (B-1 Oracle + P-3 Coach) отклонён как voice/product mismatch
- **Skeptic filter:** P-3 cold-start flag поднят; Analyst phonetics-bilingual flag поднят; Origin adjacency flag поднят на всех
- **Consistency filter:** все три финальных combos внутренне когерентны (brand + product + content говорят одним голосом внутри каждого)
- **Regulatory-lane pressure-test (добавлено 2026-04-23 post PO challenge):** каждая опция прогнана через вопрос «что твоя regulatory stance — deliberate или implicit?» Результат: Oracle = A deliberate (philosophy match); Analyst = flexible across A/B/C (most adaptable); Companion = A deliberate (observation-identity = lane-A moat). Lane B как path для любой опции требует +$50-150K/yr + 6-12 месяцев задержки; lane C natural только для Analyst. Три опции теперь **не-homogeneous по regulatory axis** — это deliberate feature, не artefact.
- **Lane C validation evidence update (2026-04-23 same-day addendum):** PortfolioPilot disclosures page подтверждает что они работают на hybrid Lane C — не pure RIA. Это **не добавляет 4-й опции** и не меняет ranking трёх финалистов, но meaningfully повышает attractiveness Lane C как path (validated at $30B AUM / 40K users, а не hypothetical). Для PO это значит: если выбор — Analyst, lane C более comfortable choice, чем казалось в первой версии этого документа.

- **PO lock 2026-04-23 v1.1 (final):** PO после deliberation locked Lane A (rejected B и C) + global geography + multi-lang day-1. Re-ranking трёх опций под новые constraints: **Companion > Oracle > Analyst** (см. re-evaluation section above и cross-comparison table). Analyst lost её Lane-C flexibility moat; Oracle держится при увеличенной Getquin pressure; Companion становится strongest defensible wedge (zero direct competitor на behavioral-coach-on-trade-history at Lane A + multi-market). Council re-run не требуется — constraints не добавили новые voices, только зафиксировали axis choice; existing council output остаётся valid с updated weighting.

- **v1.2 — Option 4 «Hybrid (Second Brain for Your Portfolio)» added 2026-04-23** per PO intuition «я бы хотел все объединить как то». Navigator ran 4-voice council on 5 candidate unifying metaphors: Portfolio Partner, Second Brain, Portfolio Mirror, Portfolio Console, Second Set of Eyes. **Council consensus: Second Brain is strongest candidate** — Factual voice confirms empty territory in fintech (zero matches in 34-competitor scan); Senior Strategist confirms defensible horizon 18-24 months due to empty territory + cross-category prior art (Forte / Notion / Obsidian); Skeptic flags ~4 sec hero cognition vs Oracle's 3 sec (manageable but real cost); Consistency checker confirms metaphor holds across brand + product + content + microcopy without fracture (coach surface fits naturally, unlike Mirror where coach fractures). Runner-up: Second Set of Eyes (coherent but under-claims AI capability). Rejected: Partner (blurry), Mirror (coach fracture), Console (narrow TAM). **Navigator recommendation: Path B (Option 4) preferred under PO constraints.** Rationale: Path A (pick primary from 1-3) simpler and lower-risk, but sacrifices PO's «объединить» intuition which is a real strategic signal; all three surfaces ship regardless in any path; empty territory + metaphor unity creates stronger 18-24 month defensibility than picking one contested angle. **Path A fallback path:** Oracle primary (keeps locked hero + lowest cold-start risk) if coach ADR proves too risky OR user-researcher validation shows «second brain» doesn't parse for ICP A.

---

## Open questions для PO

1. **Готов ли locked hero («Поговори со своим портфелем / Просто задай вопрос») перезаписать?** Oracle сохраняет, Analyst меняет («Портфель, который умеет отвечать»), Companion меняет сильно («Увидь паттерны в своих сделках»), Option 4 Hybrid меняет полностью («Второй мозг для твоего портфеля / Помнит, замечает, объясняет»). Если hero — санстити, это сужает до Oracle.
2. **Насколько критичен shipping momentum?** Если альфа через 1-2 слайса — Analyst (aligned with Slice 6a+6b). Если можем позволить redesign home — Oracle. Если готов к major ADR — Companion.
3. **30-day cold start для Companion — приемлем?** Yes/No бинарный фильтр.
4. **«Post-mistake retail» — это реальный ICP или ре-проекция ICP A?** Нужен user-researcher дисптч для validation, но PO intuition здесь ценен.
5. **Brand-strategist ready для naming round 5 на любом из трёх выбранных направлений?** Оракул territory, Analyst territory, Companion territory — разные vocab pools, разные rejected-list implications.
6. **Regulatory-lane — RESOLVED 2026-04-23.** PO locked Lane A. Lane B/C rejected. Q6 закрыт.

7. **Multi-language day-1 scope — acknowledged tradeoff?** Global constraint locked 2026-04-23 требует minimum EN+RU, желательно DE/IT/ES/FR/PT для EU competitive reach. Это ~3-6 weeks pre-alpha content + i18n infrastructure cost. PO готов принять этот scope expansion или хочет обсудить reduced launch set (e.g. EN+RU only → expand post-alpha)?

8. **Getquin specifically — deep-dive research дисптч?** Под Lane A + global Getquin становится main direct competitor (Oracle) или significant pressure (Analyst). 01_DISCOVERY v2 covered Getquin surface-level. Deep-dive research brief для user-researcher рекомендован: EU penetration patterns, multi-lang UX approach, AI Financial Agents capability boundaries, churn vectors.

9. **Option 4 — LOCKED 2026-04-23.** Resolved. PO picked Option 4 without pre-lock validation gate (user-researcher interview step skipped by PO choice). Specialist dispatches executing in parallel 2026-04-23: tech-lead feasibility, brand-strategist naming round 5, content-lead landing draft. Fallback to Oracle named if feasibility blockers surface.

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
