# Paywall Copy — v1.1 (Memoro, patched 2026-04-23 per 4-locks)

**Author:** content-lead
**Date:** 2026-04-23 (v1); patched 2026-04-23 (v1.1 — 4-locks)
**Status:** draft — production-ready paywall modal + popover copy, awaiting PO review via Navigator
**Language:** English primary (day-1), Russian parallel-secondary (post-launch wave)
**Scope:** `PaywallModal` content per Design Brief §10.4 + §13.2 + §13.3. **5 variants:** Free→Plus, Free→Pro, Plus→Pro, Coach-specific modal, **Contextual Coach teaser popover (NEW)**.
**Patch log:** see §10 for 2026-04-23 4-locks delta — new V5 popover + trial-locked footers + monthly-cap tier-compare.

**CONSTRAINTS enforcement:**
- CONSTRAINTS Rule 1 — no spend. No paid copy-testing tool used.
- CONSTRAINTS Rule 2 — no external send. Drafts live in repo only.
- Lane A — no investment advice, no performance promise, no «Plus will help you make more money».
- **Design Brief §13.3 hard rules respected** — no dark patterns, no urgency manipulation, no countdown timers, no fake scarcity, no «downgrade» language.

---

## §0. Paywall voice rules (applied to every variant below)

### Honest-value principles (Design Brief §2.2 + §13.3)
- **Describe features, not outcomes.** Never «Plus helps you earn more / outperform / win». Say «Plus unlocks unlimited chat / daily insights / full Coach».
- **No urgency manipulation.** No «only today», «limited time», «7 spots left», countdown timers, red-text CTAs. The Upgrade CTA is violet-700 (brand accent, Design Brief §3.2) — calm, not alarming.
- **No guilt-trip.** Free works. Plus adds. That's the story. Never «you deserve better», «stop settling», «unlock your portfolio's potential».
- **Always show the downgrade path.** Per Design Brief §13.3 «no 'downgrade' language; use 'change plan'» — every upgrade surface acknowledges change-plan is one click.
- **Cancel visibility.** Every paywall modal mentions cancel-any-time in one line. Not small print at the bottom — in-line with the price.
- **Preview-mode pattern.** Per Design Brief §13.2 modal lock: show a preview of what they'd see. Paywall is not a wall around a secret — it's a wall with a window.

### Voice invariants
- **Memoro-as-agent** where relevant: «Memoro's Coach» / «Memoro remembers daily on Plus».
- **Value Equation framing (Hormozi)** applied honestly: Dream Outcome (clearer portfolio view) × Perceived Likelihood (we show actual feature-level differences) ÷ Time Delay (Plus active immediately) ÷ Effort (one click). No over-promise on Dream Outcome (Lane A forbids performance claims).
- **Cialdini social proof** used lightly and honestly — no invented customer counts, no «5,000 investors on Plus». If we don't have the number, we don't claim it.
- **StoryBrand hero/guide framework:** user is hero, Memoro is guide. Paywall copy reinforces: «You asked enough questions / connected enough accounts / want more surface. Memoro's Plus unlocks the rest.»

### Structure (all 4 variants)
Per Design Brief §10.4 `PaywallModal` component spec: **honest, single-column, no urgency manipulation.** Content-lead expands to:
1. **Headline** — what this paywall is for (what feature / limit triggered it)
2. **Subhead** — one line of why this tier matters
3. **Tier-compare strip** — 3-column or inline: current tier vs target tier (what's the same, what's new)
4. **Feature list** — concrete features unlocked by target tier
5. **Pricing line** — price + billing cadence + cancel-any-time reminder
6. **Primary CTA** — upgrade action
7. **Secondary action** — dismiss / compare all plans (never «close»)
8. **Footer small-print** — legal notice

---

## §1. Variant 1 — Free → Plus (generic upgrade path)

**Trigger contexts:** user hits any Plus-gated feature — AI chat monthly cap (50 msg/month, PATCHED 2026-04-23 per 4-locks — NOT daily cap), weekly insight cadence, 2-account cap, CSV export click, benchmark comparison click, daily-insights click. Context-sensitive headline per trigger (below).

### Default paywall (triggered by general Plus CTA, e.g. «Manage plan → Upgrade»)

**English:**

> **Headline:** Unlock what Memoro can do every day.
>
> **Subhead:** Plus removes the Free tier caps and turns on daily Coach.
>
> **Tier compare:**
>
> | Feature | Free | Plus |
> |---|---|---|
> | AI chat | 50 / month | Unlimited |
> | Insights | 1 / week | Daily |
> | Accounts | 2 | Unlimited |
> | Coach | Teaser | Full pattern-reads |
> | CSV export | — | ✓ |
> | Benchmark comparison | — | ✓ |
> | Dividend calendar | — | ✓ |
>
> **Pricing:** $8 / month · Cancel anytime — one click, no games.
>
> **Primary CTA:** Upgrade to Plus
> **Secondary CTA:** Compare all plans
>
> **Footer:** Billed monthly through Stripe. 14-day trial available at signup. No surprise charges — we email you the day before.

**Russian:**

> **Заголовок:** Открой, что Memoro умеет каждый день.
>
> **Подзаголовок:** Plus убирает лимиты Free и включает полный коуч.
>
> **Сравнение:**
>
> | Что | Free | Plus |
> |---|---|---|
> | Чат с AI | 50 / месяц | Безлимит |
> | Инсайты | 1 / неделя | Каждый день |
> | Счета | 2 | Безлимит |
> | Коуч | Тизер | Полные пэттерн-риды |
> | CSV-экспорт | — | ✓ |
> | Сравнение с бенчмарком | — | ✓ |
> | Календарь дивидендов | — | ✓ |
>
> **Цена:** $8 / месяц · Отмена в один клик, без игр.
>
> **Primary CTA:** Перейти на Plus
> **Secondary CTA:** Сравнить все планы
>
> **Footer:** Ежемесячная оплата через Stripe. 14-дневный триал доступен при регистрации. Никаких сюрпризов — мы напомним за день до списания.

### Context variant 1a — triggered by AI chat monthly cap hit (PATCHED 2026-04-23 — monthly, not daily)
| Lang | Headline | Subhead |
|---|---|---|
| EN | You've used all 50 chat messages this month. | Plus is unlimited chat, $8/month — no monthly pool to manage. |
| RU | Ты использовал все 50 сообщений в этом месяце. | Plus — безлимитный чат за $8/месяц, без месячного пула. |

(Rest of modal identical to default: tier compare, features, pricing, CTA.)

### Context variant 1b — triggered by 3rd-account connect attempt
| Lang | Headline | Subhead |
|---|---|---|
| EN | Free holds 2 accounts. You want to connect a third. | Plus holds every account you connect. No cap. |
| RU | Free держит 2 счёта. Ты хочешь подключить третий. | Plus держит все счета, которые ты подключаешь. Без потолка. |

### Context variant 1c — triggered by daily-insights click
| Lang | Headline | Subhead |
|---|---|---|
| EN | Memoro notices daily on Plus. | Free surfaces one insight a week. Plus surfaces one every day. |
| RU | На Plus Memoro замечает каждый день. | Free подсвечивает один инсайт в неделю. Plus — каждый день. |

### Context variant 1d — triggered by Coach teaser expansion click (Q5 lock)
| Lang | Headline | Subhead |
|---|---|---|
| EN | Memoro noticed a pattern. Plus shows you what. | Coach pattern-reads — what the pattern is, which trades, what it's based on — unlock on Plus. |
| RU | Memoro заметил паттерн. Plus покажет, какой. | Разборы от коуча — что за паттерн, какие сделки, на чём построен — открываются на Plus. |

### Rationale + Lane A notes (Variant 1 family)
- **«Unlock what Memoro can do every day»** — features the word «every day» which is the cadence-Promise of Plus (daily insights ceiling vs weekly on Free). Made-to-stick Concrete.
- **Tier compare strip** is flat fact-table. No highlighted-row, no «RECOMMENDED» badge, no starred items. Design Brief §13.3 anti-urgency.
- **«One click, no games»** — explicit anti-dark-pattern voice echoed from email sequences. Builds trust through negative-space (what we WON'T do).
- **Lane A check:** Every feature-promise is factual product-feature («unlimited chat» / «daily Coach» / «CSV export»). No performance claim («Plus helps you earn», «Plus beats the market»). PASS all four jurisdictions.
- **Context variants** personalize headline to trigger context — per CRO-methodology (Pruitt Hypothesis-Driven Conversion), paywall relevance at trigger point doubles conversion vs generic paywall. Variants 1a-1d supply this without changing the honest-value body.

---

## §2. Variant 2 — Free → Pro (skip-Plus direct path)

**Trigger contexts:** user clicks Pro-gated feature (scenarios simulator, tax reports, API access, advanced analytics like Sharpe/Sortino). Or clicks «See all plans» and chooses Pro directly from Free.

### English

> **Headline:** Memoro Pro — everything Plus has, plus the serious tools.
>
> **Subhead:** If you're running multi-broker, multi-currency, multi-tax-year — Pro is built for that.
>
> **Tier compare:**
>
> | Feature | Free | Plus | Pro |
> |---|---|---|---|
> | AI chat | 50 / month | Unlimited | Unlimited + advanced models |
> | Insights | 1 / week | Daily | Real-time |
> | Accounts | 2 | Unlimited | Unlimited |
> | Coach | Teaser | Full pattern-reads | Full + behavioral factor analysis |
> | CSV export | — | ✓ | ✓ |
> | Benchmark comparison | — | ✓ | ✓ + custom benchmarks |
> | Dividend calendar | — | ✓ | ✓ + forecasts |
> | Tax reports | — | — | Per jurisdiction (US + EU) |
> | Advanced analytics | — | — | Sharpe, Sortino, factor exposure, max drawdown |
> | Scenarios | — | — | «What if» simulations |
> | Custom alerts | — | — | ✓ |
> | API access | — | — | ✓ |
>
> **Pricing:** $20 / month · Cancel anytime — one click, no games.
>
> **Primary CTA:** Upgrade to Pro
> **Secondary CTA:** Consider Plus first
> **Tertiary (text link):** Not now
>
> **Footer:** Billed monthly through Stripe. 14-day trial available at signup. No surprise charges — we email you the day before.

### Russian

> **Заголовок:** Memoro Pro — всё, что есть в Plus, плюс серьёзные инструменты.
>
> **Подзаголовок:** Если у тебя много брокеров, много валют, много налоговых лет — Pro сделан под это.
>
> **Сравнение:**
>
> | Что | Free | Plus | Pro |
> |---|---|---|---|
> | Чат | 50 / месяц | Безлимит | Безлимит + продвинутые модели |
> | Инсайты | 1 / неделя | Каждый день | В реальном времени |
> | Счета | 2 | Безлимит | Безлимит |
> | Коуч | Тизер | Полные разборы | Полные + факторный анализ |
> | CSV | — | ✓ | ✓ |
> | Бенчмарк | — | ✓ | ✓ + кастомные |
> | Дивиденд. календарь | — | ✓ | ✓ + прогнозы |
> | Налоговые отчёты | — | — | По юрисдикции (US + EU) |
> | Продвинутая аналитика | — | — | Sharpe, Sortino, факторная экспозиция, max drawdown |
> | Сценарии | — | — | Симуляции «а что если» |
> | Кастомные алерты | — | — | ✓ |
> | API-доступ | — | — | ✓ |
>
> **Цена:** $20 / месяц · Отмена в один клик, без игр.
>
> **Primary CTA:** Перейти на Pro
> **Secondary CTA:** Сначала посмотреть Plus
> **Tertiary:** Не сейчас
>
> **Footer:** Ежемесячная оплата через Stripe. 14-дневный триал доступен при регистрации. Никаких сюрпризов — мы напомним за день до списания.

### Rationale + Lane A notes (Variant 2)
- **«Consider Plus first»** secondary CTA is counter-intuitive — almost all SaaS paywalls bury the lower tier. We surface it. Reason: honest guidance. If user doesn't have multi-broker/multi-currency/multi-tax needs, Plus is enough — our positioning is «not selling you anything» (Lane A as positive signal). Influence-psychology reciprocity: counter-selling builds trust.
- **Feature columns 3-wide** — shows the Free → Plus → Pro progression clearly. User sees the whole ladder. No hidden step.
- **«Multi-broker, multi-currency, multi-tax-year»** = specific trigger language. Made-to-stick Concrete. If you're not these, Pro is overkill — honest about it.
- **Lane A check:** «Factor exposure» / «Sharpe» / «Sortino» are analytics feature-names (computed metrics), not investment recommendations. «Scenarios» are user-driven «what if», not Memoro-recommended moves. PASS.
- **Pro-feature context variants** (if user clicks a specific Pro feature — e.g. tax reports — the headline can adapt): «Tax reports are a Pro feature. Here's what Pro includes.» — same modal body, context-sensitive headline. Content-lead provides the generic default above; per-feature headlines in §6.

---

## §3. Variant 3 — Plus → Pro (incremental upgrade)

**Trigger contexts:** user is on Plus, clicks Pro-only feature (same Pro-gated features as Variant 2, but user is already paying).

### English

> **Headline:** You're on Plus. Here's what Pro adds.
>
> **Subhead:** Pro is Plus plus the power-user surface: scenarios, advanced analytics, tax reports, API.
>
> **Tier compare (Plus → Pro delta only):**
>
> | What Pro adds | What it does |
> |---|---|
> | Advanced analytics | Sharpe, Sortino, factor exposure, max drawdown — computed on your real portfolio |
> | Scenarios | Run «what if» on FX drops, rebalances, new positions |
> | Tax reports | Year-end reports per jurisdiction (US + EU) |
> | Custom alerts | Price, allocation, event-based — your rules |
> | API access | Export raw portfolio data to your own tools |
> | Advanced AI models | Pro routes chat to more capable models when the question needs them |
> | Custom benchmarks | Compare against anything — specific ETF, custom portfolio, your own index |
> | Real-time insights | Memoro notices as it happens, not daily batch |
>
> **Pricing:** $20 / month · $12/month more than Plus · Cancel or switch back anytime.
>
> **Primary CTA:** Upgrade to Pro
> **Secondary CTA:** Not now
>
> **Footer:** You'll be billed the $12 difference at your next billing date, prorated. Change plan or cancel anytime in Settings.

### Russian

> **Заголовок:** Ты на Plus. Вот что добавляет Pro.
>
> **Подзаголовок:** Pro — это Plus плюс инструменты для power-user: сценарии, продвинутая аналитика, налоговые отчёты, API.
>
> **Что добавляет Pro:**
>
> | Фича | Что делает |
> |---|---|
> | Продвинутая аналитика | Sharpe, Sortino, факторная экспозиция, max drawdown — на твоём реальном портфеле |
> | Сценарии | Запуск «а что если» — падения валют, ребалансы, новые позиции |
> | Налоговые отчёты | Годовые отчёты по юрисдикциям (US + EU) |
> | Кастомные алерты | Цена, аллокация, события — твои правила |
> | API-доступ | Экспорт сырых данных портфеля в твои инструменты |
> | Продвинутые AI-модели | Pro отправляет чат в более мощные модели, когда вопрос этого требует |
> | Кастомные бенчмарки | Сравнение с чем угодно — конкретный ETF, кастомный портфель, свой индекс |
> | Инсайты в реальном времени | Memoro замечает по мере событий, а не раз в день |
>
> **Цена:** $20 / месяц · На $12/месяц больше Plus · Отмена или возврат когда угодно.
>
> **Primary CTA:** Перейти на Pro
> **Secondary CTA:** Не сейчас
>
> **Footer:** $12 разницы спишется в следующую дату списания, пропорционально. Сменить план или отменить — в настройках, в любой момент.

### Rationale + Lane A notes (Variant 3)
- **Delta-only comparison** — Plus user doesn't need to re-see Plus features. Only shows what Pro adds.
- **«$12/month more than Plus»** — explicit delta. Made-to-stick Concrete. Easier cognitive math than «$20/mo» alone.
- **«Cancel or switch back anytime»** — the «switch back» phrase explicitly acknowledges reverting to Plus is available, per Design Brief §13.3 (no «downgrade» framing; use «change plan»).
- **Prorated billing callout** — transparent about how proration works. Reduces post-upgrade sticker-shock churn.
- **Pro routes chat to more capable models** — honest about what «advanced AI models» means. Not «better AI» vague; specific routing promise.
- **Lane A check:** Every bullet is factual feature. Sharpe / Sortino / factor exposure are analytics metrics, not recommendations. «What if» scenarios are user-driven simulations. No performance claim. PASS.

---

## §4. Variant 4 — Coach-specific paywall (Q5 teaser-paywall lock)

**Trigger context:** user on Free tier clicks «Unlock on Plus» from a Coach teaser card. Per `DECISIONS.md` 2026-04-23 Q5 lock: Free surfaces teaser («Memoro noticed a pattern») → click opens this paywall → Plus unlocks full pattern-read.

### English

> **Headline:** See what Memoro noticed.
>
> **Subhead:** Coach read patterns in your past trades. Plus shows you what they are.
>
> **Body:**
>
> Memoro has been watching your actual trade history. Coach finds patterns — selling on drops, buying on rebounds, sector rotations, dividend-reaction patterns. On Free, you see that patterns exist. On Plus, you see what they are, which trades they're based on, and what Memoro's inference is.
>
> No judgment. No advice. Just what Memoro sees — in full detail, yours to interpret.
>
> **What Plus unlocks:**
>
> - Full Coach pattern-reads — the pattern name, trade list, timeframe, what it's based on
> - Follow-up chat — ask Memoro about any pattern
> - Multi-pattern surfacing — not just one teaser, all detected patterns
> - Pattern re-check — when new trades come in, Memoro updates the read
> - Everything else Plus gives (unlimited chat, daily insights, unlimited accounts, CSV, benchmarks, dividend calendar)
>
> **Pricing:** $8 / month · Cancel anytime — one click, no games.
>
> **Primary CTA:** Unlock Coach on Plus
> **Secondary CTA:** See what else Plus has
> **Tertiary:** Not now
>
> **Footer:** Memoro describes what it sees in your portfolio. It is not an investment advisor and does not recommend specific trades. For educational purposes only.

### Russian

> **Заголовок:** Посмотри, что заметил Memoro.
>
> **Подзаголовок:** Коуч прочитал паттерны в твоих прошлых сделках. Plus покажет, какие.
>
> **Body:**
>
> Memoro смотрит на твою реальную историю сделок. Коуч находит паттерны — продажи на просадках, покупки на отскоках, ротации по секторам, реакции на дивиденды. На Free ты видишь, что паттерны есть. На Plus — что это за паттерны, на каких сделках построены и какой вывод делает Memoro.
>
> Без осуждения. Без советов. Только то, что видит Memoro — в полной детализации, интерпретируешь ты сам.
>
> **Что открывает Plus:**
>
> - Полные пэттерн-риды коуча — название, список сделок, таймфрейм, на чём построен
> - Follow-up в чате — спроси Memoro о любом паттерне
> - Несколько паттернов — не только один тизер, все найденные
> - Пересмотр паттернов — когда появляются новые сделки, Memoro обновляет разбор
> - Всё остальное, что даёт Plus (безлимитный чат, ежедневные инсайты, безлимит счетов, CSV, бенчмарки, календарь дивидендов)
>
> **Цена:** $8 / месяц · Отмена в один клик, без игр.
>
> **Primary CTA:** Открыть коуч на Plus
> **Secondary CTA:** Что ещё даёт Plus
> **Tertiary:** Не сейчас
>
> **Footer:** Memoro описывает, что видит в твоём портфеле. Он не является инвестиционным советником и не рекомендует конкретные сделки. Только для образовательных целей.

### Rationale + Lane A notes (Variant 4, Coach-specific)
- **«See what Memoro noticed» headline** continues the teaser-hook from the Free-tier card into the paywall — curiosity-gap pattern (Heath SUCCES). User already knows a pattern was detected; paywall resolves «what is it» behind a transparent tier wall.
- **Body enumerates pattern TYPES without naming specific patterns** — «selling on drops, buying on rebounds, sector rotations, dividend-reaction patterns» are category labels, not this-user's-specific-pattern. Finance-advisor R11 compliant: over-claim is avoided because pattern SPECIFICS are not surfaced on Free — only category examples. The user upgrades to see THEIR specific pattern, not to unlock information we already hinted.
- **«No judgment. No advice. Just what Memoro sees.»** — explicit Lane A reinforcement at the paywall surface. This is where Lane A gets loudest in product — the exact moment a Free user might mistake teaser-curiosity for «Memoro knows what's wrong with my trading». Explicit disclaim.
- **Disclaimer in footer** — this paywall carries the full AI-disclaimer text (§7 of `microcopy.md`) because it's the surface closest to Coach's regulatory edge (finance-advisor §3.5 EU MiFID II + UK FCA EDGE on Coach output). Paywall doubles as legal-notice carrier.
- **Lane A check:** every surface of this paywall passes — observation verbs, no advice, explicit disclaim in footer, no normative language. PASS all four jurisdictions including EU/UK stricter reading.

---

## §5. Trial handling — LOCKED 2026-04-23 per 4-locks (was DEFERRED in v1)

### Decision locked

`DECISIONS.md` 2026-04-23 «Trial + Free tier + Coach UX + brand commitment (4 locks)» Q1: **14-day Plus trial, card required at signup.** PO chose trial over content-lead's original NO-trial recommendation. Content-lead accepts the PO decision and patches all paywall copy to trial-aware voice.

### Paywall copy patched 2026-04-23

- Footer language across V1/V2/V3 updated: «No trial, no auto-renew traps» → «14-day trial available at signup. No surprise charges — we email you the day before.» (EN + RU)
- V5 NEW paywall added (see §5a) for the contextual-icon Coach teaser popover surface (Coach UX lock Q3 — contextual, not dedicated route).
- Trial CTAs handled in `microcopy.md` §5a (trial-related strings) + `landing.md` §4a (dual-path hero CTA).
- Day-13 auto-renewal reminder email lives in `email-sequences.md` §8 (NEW, legally required per EU Consumer Rights Directive Art. 14 + US CA/NY/OR/VA auto-renewal laws).

### Why «No auto-renew traps» framing held

The replacement footer line still signals honest billing behavior:
- «14-day trial available at signup» — explicit about trial existence, no hidden-trial surprise
- «No surprise charges — we email you the day before» — commitment to the day-13 reminder email + honest voice that competitors typically weaponize (pretend-reminder + ambush charge)

The spirit of the original anti-dark-pattern voice is preserved; only the factual claim adjusts to match the 2026-04-23 trial reality.

### Trial-aware behavior in V4 Coach paywall (existing) and V5 contextual-teaser (NEW §5a)

- V4 Coach paywall primary CTA remains «Unlock Coach on Plus»; secondary CTA «See what else Plus has» remains.
- V5 (new, §5a) primary CTA is «Upgrade to Plus to see detail»; secondary CTA «Start 14-day free trial» — shown ONLY if user has not yet used their trial (engineering: check `trial_started_at IS NULL` at render time; hide CTA if trial already used/cancelled).

### Recommendation tracker

Content-lead's original recommendation (NO trial at launch) is now overridden by PO 2026-04-23 lock. Keeping the rationale in repo for historical record and in case trial-conversion data post-launch triggers revisit:
- Original rationale: trial-free stance is brand signal; Free tier IS the trial; trial-auto-convert feels ambushing even when done well.
- PO counter: standard SaaS trial pattern, card-required, known trade-off (better trial→paid conversion, worse trial uptake).
- Compromise realized in copy: honest voice baked into trial emails (two equal-weight CTAs on day-13), free-forever alternative visible at signup, cancel-one-click everywhere.

---

## §5a. Variant 5 — Contextual Coach teaser popover (NEW 2026-04-23 per 4-locks Q3 Coach UX)

**Decision source.** `DECISIONS.md` 2026-04-23 «Coach UX: contextual — NOT dedicated route, NOT filter-chip». When Memoro notices a pattern tied to a position card, dashboard widget, or chat thread, a blinking icon appears on that element. User clicks icon → small non-blocking popover opens. For Free tier, popover has upgrade CTA. For Plus/Pro tier, popover shows full pattern-read inline (NOT a paywall).

This section specs the **Free-tier popover paywall** (what user sees when clicking icon on Free). Plus/Pro full-read popover lives in `microcopy.md` §5 `coach.icon.popover_plus_full_read`.

### Distinguishing V5 from V4

| Surface | V4 (existing) | V5 (NEW) |
|---|---|---|
| Trigger | User clicks «Unlock on Plus» from a Coach teaser card in the insights feed or dashboard | User clicks a blinking icon on a position / widget / thread |
| Form | Full-screen modal (PaywallModal) | Small popover (~320×240 px) anchored to the icon |
| Depth | Full feature list, 3-column compare, Coach-specific narrative | Minimal: headline + 1-line subject + 2 CTAs + disclaimer footer |
| Dismiss | Modal close button | Click-outside or Esc |

### Popover layout (V5 spec)

**Vertical flow:**
1. **Hero headline** — dynamic context-scoped per pattern type (see §5c in `microcopy.md` for 12 variants)
2. **Body subject-reveal** — 1 line max, subject-scoped («in your {asset} trades» / «in how you respond to drawdowns»)
3. **Primary CTA** — «Upgrade to Plus to see detail»
4. **Secondary CTA** — «Start 14-day free trial» (hidden if user already used trial)
5. **Footer microcopy** — disclaimer + respect-your-decisions reassurance

### V5 Free-tier popover content

#### English

> **Hero headline** (dynamic, ≤60 chars): Memoro noticed a pattern.
>
> **Body (1 line, ≤80 chars, dynamic subject-reveal):** in your {asset_or_category} trades.
> _(or «in how you respond to drawdowns» / «in your dividend reinvestment timing» — behavior-scoped variant)_
>
> **Primary CTA:** Upgrade to Plus to see detail
> **Primary CTA small-print:** $8/month · Cancel any time
>
> **Secondary CTA (shown only if trial not yet used):** Start 14-day free trial
> **Secondary CTA small-print:** Card required. Cancel before {example_trial_end} to stay on Free.
>
> **Footer microcopy:** Memoro always respects your decisions — this is observation, not advice.

#### Russian (parallel secondary)

> **Заголовок** (динамический, ≤70 chars): Memoro заметил паттерн.
>
> **Body (1 строка, ≤100 chars, динамическое раскрытие предмета):** в твоих сделках {asset_or_category}.
> _(или «в том, как ты реагируешь на просадки» / «в тайминге реинвестирования дивидендов»)_
>
> **Primary CTA:** Перейти на Plus — увидеть разбор
> **Primary CTA small-print:** $8/месяц · Отмена в любой момент
>
> **Secondary CTA (показывается, только если триал ещё не использован):** Начать 14-дневный триал
> **Secondary CTA small-print:** Нужна карта. Отмени до {example_trial_end}, чтобы остаться на Free.
>
> **Footer microcopy:** Memoro всегда уважает твои решения — это наблюдение, не совет.

### V5 dynamic headline variants (cross-reference to `microcopy.md` §5c)

All 12 headline variants (asset-scoped × 3, category-scoped × 3, behavior-scoped × 6) live in `microcopy.md` §5c. V5 popover uses those variants as its `{hero_headline}` slot. Selection rule (engineering + AI-output-generator):

| Pattern scope | Picked variant group |
|---|---|
| Single dominant ticker in pattern | Asset-scoped (e.g. «pattern in your NVDA trades») |
| Multi-ticker within same sector/class | Category-scoped (e.g. «pattern in your tech holdings») |
| User-behavior pattern (not asset-linked) | Behavior-scoped (e.g. «pattern in how you respond to drawdowns») |

BANNED variants enforced from §5c at copy layer + AI-output-generator: no «panic-selling», no «FOMO», no «overtrading», no «revenge trading».

### V5 interaction spec

- **Non-blocking popover.** User can still click through the page behind it; clicking outside dismisses.
- **Secondary CTA hidden if `trial_started_at IS NOT NULL`.** Engineering: check at render time; do NOT show «Start trial» if user already tried trial (even if they didn't convert — one trial per account, industry standard, and honest).
- **Primary CTA opens full V4 Coach paywall (modal)** on click — popover is teaser, modal is full pitch. Separation of surfaces respects Q5 teaser-paywall lock at two-layer depth (teaser card → teaser popover → full modal).
- **«Mark as seen»** tertiary action (inline, small, no button weight) in popover footer — stops icon from blinking without dismissing popover. Copy lives in `microcopy.md` §5 `coach.icon.popover_secondary_action`.

### V5 rationale + Lane A notes

- **Hero headline is curiosity-hook, subject-scoped NEVER substance-scoped.** «Memoro noticed a pattern» + «in your NVDA trades» reveals WHAT the pattern is ABOUT but not WHAT IT IS. User needs Plus to get substance. This is the Q5 teaser-paywall lock applied at the contextual-icon surface — same rule as insights-feed Coach card, just smaller form factor.
- **Secondary CTA (trial) is conditionally shown.** If user skipped trial at signup, they can start it from any V5 popover — low-friction entry point. If user already used trial (converted OR canceled), secondary CTA hides. No «retry your trial» dark pattern.
- **«Memoro always respects your decisions — this is observation, not advice»** in footer microcopy — explicit Lane A reinforcement at the smallest UX surface Memoro has. This is the surface most likely to be read while user is looking at a specific position; the disclaimer must be visible, not buried.
- **Card-required small-print on trial CTA** — honest disclosure at click-surface, not post-click.
- **«Cancel before {example_trial_end} to stay on Free»** on trial CTA small-print — reassures user that trial is opt-out-able without losing Free access.

### V5 A11y spec

- Popover: `role="dialog"` + `aria-modal="false"` (non-blocking)
- `aria-labelledby` points to hero-headline `<h3>`
- Focus on open: moves to primary CTA (first focusable)
- Esc dismisses; click-outside dismisses
- Primary/secondary CTAs are `<button>` elements; «Mark as seen» is a `<button>` with ghost visual treatment
- Screen reader announces popover open via `aria-live="polite"` region

### V5 Lane A + dark-pattern check

- [x] No performance promise — «see detail» is feature-description, not outcome-promise
- [x] No urgency manipulation — no countdown, no «patterns expire»
- [x] Pattern SUBJECT revealed; pattern SUBSTANCE behind Plus paywall (Q5 lock preserved at new surface)
- [x] Card-required disclosure at CTA surface
- [x] Cancel-any-time stated at trial CTA small-print
- [x] «Observation, not advice» disclaimer in footer — Lane A reinforcement
- [x] BANNED pathological pattern labels (panic/FOMO/overtrading/revenge) enforced via §5c rules
- [x] Secondary CTA hidden if trial already used — no dark-pattern «retry your trial»

### Cross-surface consistency check

V5 copy patterns verified consistent with:
- `microcopy.md` §5 contextual-icon popover strings (V5 popover IS the Free-tier variant of that component)
- `microcopy.md` §5a trial-related strings (trial CTA language + card-required disclaimer)
- `microcopy.md` §5c contextual-paywall-headline variants (V5 headline slot uses that catalogue)
- `landing.md` §2 Bullet 3 contextual-Coach note (landing describes capability; V5 is one surface of it)
- `email-sequences.md` §6-§9 trial emails (day-13 warning voice echoes V5 trial-CTA small-print)
- `DECISIONS.md` 2026-04-23 Q3 Coach UX contextual + Q5 teaser-paywall locks

### Lane A line calls made for V5

Two decisions required content-lead judgment (both toward conservative Lane A):

1. **Footer microcopy («observation, not advice»).** Considered shorter version «Information only, not advice.» (echoes `microcopy.md` §7 `ai_disclaimer.footer_badge`). Picked longer «Memoro always respects your decisions — this is observation, not advice.» because V5 is adjacent to a position card where user might feel Memoro is «telling them something is wrong» — the longer phrasing buys Lane A margin at minor character-budget cost.

2. **Secondary CTA visibility rule.** Considered always-show with different copy for already-used-trial users («Trial used — upgrade to Plus direct»). Rejected: creates a «retry your trial» feel. Picked hide-if-used. Engineering must enforce; no «reset my trial» workaround in UI.

---

## §6. Context-sensitive headline catalogue

Per §1 pattern (Variants 1a-1d), each Plus/Pro gated feature can surface a context-specific paywall headline at trigger. Content-lead provides the catalogue; engineering wires the trigger → headline mapping.

### Free → Plus triggers

| Trigger | EN headline | RU headline |
|---|---|---|
| AI chat monthly cap hit (50/50) | You've used all 50 chat messages this month. | Ты использовал все 50 сообщений в этом месяце. |
| Trying to connect 3rd account | Free holds 2 accounts. You want to connect a third. | Free держит 2 счёта. Ты хочешь подключить третий. |
| Click «Daily insights» | Memoro notices daily on Plus. | На Plus Memoro замечает каждый день. |
| Click «CSV export» | Take your data out. Plus lets you. | Забери свои данные. Plus позволяет это сделать. |
| Click «Benchmark comparison» | Compare to S&P, MSCI, anything. Plus does that. | Сравни с S&P, MSCI, чем угодно. Plus умеет. |
| Click «Dividend calendar» | See every upcoming payout. Plus shows the calendar. | Посмотри все ближайшие выплаты. Plus показывает календарь. |
| Coach teaser click (Q5) | Memoro noticed a pattern. Plus shows you what. | Memoro заметил паттерн. Plus покажет, какой. |
| Second weekly insight quiet | Weekly is quiet. Plus is daily. | На неделе тихо. Plus — каждый день. |

### Free → Pro triggers

| Trigger | EN headline | RU headline |
|---|---|---|
| Click «Scenarios» | Run «what if» on your real portfolio. | Запусти «а что если» на своём реальном портфеле. |
| Click «Tax reports» | Year-end reports per jurisdiction. | Годовые отчёты по юрисдикции. |
| Click «Advanced analytics» | Sharpe, Sortino, factor exposure. | Sharpe, Sortino, факторная экспозиция. |
| Click «API access» | Your portfolio data, in your code. | Данные портфеля — в твоём коде. |
| Click «Custom alerts» | Alerts on your rules, not ours. | Алерты по твоим правилам, не нашим. |

### Plus → Pro triggers
Same trigger mapping as Free → Pro, but paywall body is Variant 3 (delta-only compare).

---

## §7. Regulatory checklist (consolidated across all variants)

| Variant | Lane A (no advice, no performance) | No dark pattern (§13.3) | No «downgrade» language | Cancel visibility | Disclaimer carrier |
|---|---|---|---|---|---|
| V1 Free → Plus (default) | ✅ | ✅ | ✅ («change plan») | ✅ (pricing line) | Inherited (tooltip layer) |
| V1a-1d context variants | ✅ | ✅ | ✅ | ✅ | Inherited |
| V1a (patched monthly cap) | ✅ | ✅ | ✅ | ✅ | Inherited |
| V2 Free → Pro | ✅ | ✅ | ✅ | ✅ | Inherited |
| V3 Plus → Pro | ✅ | ✅ («switch back» explicit) | ✅ | ✅ | Inherited |
| V4 Coach-specific (modal) | ✅ (explicit «no advice» in body + full footer disclaimer) | ✅ | ✅ | ✅ | ✅ (full AI-disclaimer in footer) |
| V5 Contextual-Coach popover (NEW) | ✅ (subject-scoped teaser + «observation, not advice» footer) | ✅ (secondary CTA hides if trial used) | ✅ | ✅ (cancel in both CTA small-prints) | ✅ (footer microcopy) |

### Voice guardrail per-variant
- [x] No «unlock your portfolio's potential» / «earn more» / «beat the market» / «smarter investing» — every value-prop is feature-level, not outcome-level
- [x] No urgency manipulation — no countdown, no «limited time», no red CTAs, no «only today»
- [x] No fake scarcity — no «X people upgraded today», no «1 seat left»
- [x] No guilt-trip — no «stop settling», «you deserve more», «upgrade to truly understand»
- [x] Cancel-any-time named on every pricing line (and in every trial-CTA small-print)
- [x] Change-plan path acknowledged (not «downgrade»)
- [x] Stripe billing transparency in footer
- [x] Coach-specific (V4 + V5) surfaces Lane A reinforcement at paywall body + disclaimer in footer
- [x] NEW 2026-04-23 — trial is LOCKED 14-day Plus with card required; footer language updated from «No trial» to «14-day trial available at signup. No surprise charges.»
- [x] NEW 2026-04-23 — V5 popover respects Q5 teaser-paywall at smaller form factor (subject-scoped, not substance-scoped)
- [x] NEW 2026-04-23 — V5 secondary CTA (start trial) hidden if user already used trial — no «retry trial» dark pattern

---

## §8. Open decisions for Navigator / PO

1. **Trial offer LOCKED 2026-04-23 per 4-locks.** PO chose 14-day Plus trial with card required. Content-lead patched all paywall copy to trial-aware voice (§5). Previous NO-trial recommendation preserved in repo for historical record.
2. **«No auto-renew traps» language — reframed 2026-04-23.** Original «No trial, no auto-renew traps» replaced with «14-day trial available at signup. No surprise charges — we email you the day before.» This new framing commits product-behavior to: (a) day-13 reminder email fires unconditionally per `email-sequences.md` §8, (b) no ambush charges, (c) cancel-one-click at equal weight to keep-Plus CTA on day-13 email. If product ever reneges on day-13 email or buries the cancel path, this paywall copy becomes evidence of a broken commitment.
3. **Pricing placeholders.** Copy uses «$8/month» (Plus) and «$20/month» (Pro) from `02_POSITIONING.md` §Pricing. If final pricing lands differently (e.g. Plus $10, Pro $15-25), content-lead will swap the numbers. Not blocking.
4. **Stripe Customer Portal redirect.** Design Brief §18.2 specifies «Manage in Stripe» button opens Stripe Customer Portal in new tab. Paywall «Cancel» messaging implies this path — engineering wires it up. Content-lead trusts the engineering spec.
5. **Coach paywall (V4 + V5) timing.** V5 (contextual popover) can fire anytime after day 30 when Coach detects first pattern; V4 (full modal) fires when user clicks through from V5 primary CTA. Day-30 is Onboarding Stage 3 milestone. Does PO want a promotional email at that moment? Email sequence currently has «upgrade offer» at day 45-60 + 30-day recap at day 30 (which already mentions Coach teaser). Question: should day-30 insight email CTA be «Unlock Coach» specifically rather than generic Plus? Content-lead will draft if PO says yes; currently generic.
6. **Russian paywall launch.** Per `02_POSITIONING.md` v3.1 + `DECISIONS.md` 2026-04-23 English-first lock, Russian paywall copy here is parallel secondary. When CIS wave launches, legal-advisor should review Russian Plus/Pro tier billing language under 152-ФЗ + Russian consumer protection (returns, cancellation rights differ from Stripe-global defaults). Flag for legal-advisor.
7. **Plus vs Pro Coach differential.** Variant 2 shows Pro Coach as «Full + behavioral factor analysis» vs Plus Coach «Full pattern-reads». This differential is content-lead-assumed based on Pro = «advanced analytics» tier theme. Not explicitly specified in `02_POSITIONING.md` §Pricing. Is it real product differentiation, or content-lead over-scoping? Flag for product + tech-lead confirmation.
8. **V5 trial-CTA visibility logic (NEW 2026-04-23).** Engineering must enforce: show «Start 14-day free trial» secondary CTA ONLY if `trial_started_at IS NULL` for this user. Hide if trial used (converted OR canceled). One trial per account, no reset. Flag for engineering + PO (confirm one-trial-per-account policy).
9. **V5 dynamic headline selection (NEW 2026-04-23).** Engineering + AI-output-generator must pick correct scope (asset / category / behavior) per pattern type per `microcopy.md` §5c rules. BANNED phrasings (panic / FOMO / overtrading / revenge) must be enforced at pattern-label-generator layer, not just at paywall render. Flag for finance-advisor / AI content-validation workstream.
10. **Monthly cap rendered in tier-compare tables (PATCHED 2026-04-23).** «AI chat: 5 / day» → «AI chat: 50 / month» across V1, V2 EN + RU tables. If product later introduces a soft daily rate-limit for abuse prevention (e.g. 20/hour burst cap), paywall copy does NOT need to mention it — behavioral rate-limiting is infrastructure, not a product-feature-gate. PO confirmation not required; flagged for awareness.

---

## §9. Summary for Navigator

**5 paywall variants delivered, all bilingual (4 original + 1 new from 2026-04-23 4-locks):**
- V1: Free → Plus (default + 4 context variants 1a-1d; variant 1a patched to monthly cap)
- V2: Free → Pro (direct upgrade path; AI chat row patched to monthly cap)
- V3: Plus → Pro (incremental delta-only)
- V4: Coach-specific Free → Plus modal (Q5 teaser-paywall lock)
- **V5 (NEW): Contextual Coach teaser popover** — small non-blocking popover anchored to blinking icon on position card / dashboard widget / chat thread. Hero headline dynamic (asset-scoped / category-scoped / behavior-scoped); body subject-reveal 1 line; primary CTA «Upgrade to Plus to see detail»; secondary CTA «Start 14-day free trial» (hidden if used); footer microcopy «Memoro always respects your decisions — this is observation, not advice».
- Plus §6 catalogue: 13 context-sensitive headlines for trigger-point paywall surfacing (1a patched)

**Voice decisions held:**
- Feature-level value-prop only. Zero outcome claims. Lane A PASS at every surface.
- Anti-dark-pattern voice turned into brand signal («one click, no games», «14-day trial with day-before reminder», «switch back anytime»)
- Tier-compare tables as flat fact-tables — no highlighted-row, no «RECOMMENDED» badge, no starring
- «Cancel anytime» on every pricing line + every trial-CTA small-print
- Coach-specific V4 + V5 both carry Lane A reinforcement in footer; V4 has full disclaimer, V5 has compact «observation, not advice» footer microcopy
- V3 (Plus→Pro) uses explicit «$12/month more» framing + «switch back anytime» language
- **NEW 2026-04-23:** trial footer copy reframed; «Free is always Free» commitment honored via free-forever-alternative in trial-CTA small-print on V5

**Dependencies flagged:**
- PO: Plus-vs-Pro Coach differential confirmation (§8.7); one-trial-per-account policy confirmation (§8.8)
- Product-designer: PaywallModal layout implementation per Design Brief §10.4; V5 popover spec (~320×240 px, non-blocking, Esc/click-outside dismiss, anchored to icon); context-headline wiring at trigger points
- Engineering: Stripe Customer Portal integration + trigger → context-headline mapping + prorated-billing copy display + V5 trial-CTA visibility logic (hide if trial_started_at IS NOT NULL) + V5 dynamic headline scope detection
- Legal-advisor: Russian paywall review under 152-ФЗ before any CIS launch; Stripe-global vs per-jurisdiction cancellation rights; EU Consumer Rights Directive Art. 14 + US state auto-renewal laws on day-13 reminder email
- Finance-advisor: confirm V4 + V5 Coach paywall «no advice» framing carried at AI-output layer; BANNED pattern-label enforcement (§5c of microcopy.md) at pattern-generator layer

**No external send. Drafts live in repo. When PO wires paywall into the app, PO takes this file as input for locale strings.**

---

## §10. Patch log — 2026-04-23 post-4-locks patch

**Decision source.** `DECISIONS.md` 2026-04-23 «Trial + Free tier + Coach UX + brand commitment (4 locks)»:
1. Trial — 14-day Plus, card required
2. Free cap — 50 messages/month, no daily limit (Haiku model)
3. Coach UX — contextual (blinking icons + bell-dropdown), NOT dedicated route
4. «Free is always Free» permanent brand commitment

### Changes applied to this file

**Patched (existing variants):**
- Variant 1 tier-compare table — «AI chat: 5 / day» → «AI chat: 50 / month» (EN + RU)
- Variant 1a context — «You asked 5 questions today.» → «You've used all 50 chat messages this month.» (EN + RU)
- Variant 2 tier-compare table — «AI chat: 5 / day» → «AI chat: 50 / month» (EN + RU)
- §6 catalogue AI-chat-cap entry updated to monthly
- All V1/V2/V3 footer lines: «No trial, no auto-renew traps.» → «14-day trial available at signup. No surprise charges — we email you the day before.» (EN + RU)
- §5 «Trial handling DEFERRED» → «Trial handling LOCKED 2026-04-23» with historical-record + patch-rationale preserved

**Added (new variant):**
- **§5a Variant 5 — Contextual Coach teaser popover** (NEW). ~120 lines of spec: layout, EN + RU copy, dynamic headline cross-reference to `microcopy.md` §5c, interaction spec (non-blocking, Esc/click-outside dismiss, trial-CTA conditional visibility), rationale, Lane A notes, A11y spec, cross-surface consistency verification, content-lead line calls (footer microcopy choice + secondary-CTA visibility rule).

**§7 Regulatory checklist:** added V5 row, added 3 new voice-guardrail bullets (trial locked, V5 teaser, V5 trial-CTA hide-rule).
**§8 Open decisions:** item #1 flipped to LOCKED; item #2 reframed; items #8-10 added (V5 trial-CTA logic, V5 dynamic headline enforcement, monthly-cap in tier-compare tables).
**§9 Summary:** variant count 4→5; dependencies updated for engineering + legal + finance-advisor + PO.

### Trial-voice decisions held
- Footer line acknowledges trial exists + commits to day-before reminder email (Email 8 in `email-sequences.md`)
- V5 secondary CTA (start trial) shown only if user hasn't used trial — no «retry trial» dark pattern
- V5 trial-CTA small-print states card-required + free-until-trial-end cancel-path explicitly
- V5 primary CTA «Upgrade to Plus to see detail» routes user to full V4 modal — teaser-popover ≠ full paywall, two-layer disclosure
- «Cancel any time» kept in both CTA small-prints on V5

### V5 contextual-Coach voice decisions held
- Hero headline is curiosity-hook, always SUBJECT-scoped (in your X trades / in how you respond to Y), never SUBSTANCE-scoped
- Body text is 1 line max, reveals subject but not inference
- Footer microcopy «Memoro always respects your decisions — this is observation, not advice» is the compact Lane A reinforcement (V4 modal carries full disclaimer; V5 popover carries compact version due to form factor)
- BANNED pathological labels (panic / FOMO / overtrading / revenge) enforced via cross-reference to `microcopy.md` §5c
- A11y spec embedded: role=dialog + aria-modal=false (non-blocking); focus on primary CTA on open; Esc dismiss

### Cross-surface consistency verified
- `microcopy.md` §5 contextual-icon popover strings — V5 IS the Free-tier variant of this component
- `microcopy.md` §5a trial strings — V5 trial-CTA language consistent
- `microcopy.md` §5c contextual paywall headlines — V5 headline slot uses this catalogue
- `landing.md` §2 Bullet 3 — landing describes capability; V5 is one surface
- `email-sequences.md` §8 — day-13 reminder voice echoes V5 trial-CTA small-print
- `DECISIONS.md` 2026-04-23 Q3 + Q5 locks — both respected at V5

### Lane A + dark-pattern check (this patch)
- [x] Trial locked copy: charge date + amount + cancel path stated at equal weight
- [x] No performance promise in V5 or in patched variants
- [x] Monthly-cap framing consistent across V1, V2, §6 catalogue
- [x] «Free is always Free» honored via V5 trial-CTA small-print («Cancel before {date} to stay on Free»)
- [x] V5 teaser-popover respects Q5 teaser-paywall lock at new form factor
- [x] V5 secondary CTA hidden if trial already used — no retry-trial dark pattern
- [x] «Observation, not advice» footer microcopy on V5 — Lane A reinforcement at smallest paywall surface
- [x] No «5 msg/day» references remain anywhere in paywall (verified by grep)
- [x] «No trial» false-claim removed from all footers
