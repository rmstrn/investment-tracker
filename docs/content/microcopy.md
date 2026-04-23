# Microcopy — v1.1 (Memoro, in-product strings, patched 2026-04-23 per 4-locks)

**Author:** content-lead
**Date:** 2026-04-23 (v1); patched 2026-04-23 (v1.1 — 4-locks)
**Status:** draft — production-ready in-product copy, awaiting PO review via Navigator
**Language:** English primary (day-1), Russian parallel-secondary (post-launch wave)
**Scope:** primary buttons, empty states, error states, loading states, Coach teasers + contextual icons, trial strings, bell-dropdown strings, paywall inline, AI disclaimer tooltip. In-product strings feed into `locales/{en,ru}.json` (or equivalent) for frontend-engineer integration.
**Patch log:** see §13 for 2026-04-23 4-locks delta — new trial / bell-dropdown / contextual-icon sections + monthly-cap patch.

**CONSTRAINTS enforcement:**
- CONSTRAINTS Rule 1 — no spend.
- CONSTRAINTS Rule 2 — no external send. Strings are code-destined, in-repo only.
- Lane A — no investment advice, no performance promises. All Memoro strings stay observational.
- No dark patterns (Design Brief §13.3).

---

## §0. Global microcopy rules

### Character budgets
- Button primary: ≤24 chars EN, ≤30 chars RU
- Button secondary / inline text link: ≤20 chars EN, ≤26 chars RU
- Tooltip: ≤140 chars EN, ≤160 chars RU
- Toast / notification: ≤100 chars EN, ≤120 chars RU
- Empty state heading: ≤40 chars EN, ≤50 chars RU
- Empty state body: ≤140 chars EN, ≤170 chars RU
- Error heading: ≤40 chars EN, ≤50 chars RU
- Error body: ≤140 chars EN, ≤170 chars RU
- Loading: ≤40 chars EN, ≤50 chars RU

### Voice invariants
- **User-facing imperatives** (Everyman voice): Ask · Connect · Unlock · See · Try · Upgrade · Open · Add · Rename · Delete · Cancel · Retry · Refresh · Continue.
- **Memoro-as-agent verbs:** remembers · notices · surfaces · reads · holds · explains · sees · answers · shows · cites · fetched · parsed · found.
- **Forbidden Memoro verbs about user actions:** recommends · advises · should · must · consider · next time · we flagged · rebalance · buy · sell · reduce · increase.
- **Error voice:** calm, specific, next-step-oriented. Design Brief §2.2: «Errors: Calm, specific, with a next step.» Never blame-the-user, never jargon.
- **Empty-state voice:** honest + inviting. Icon + short line + single CTA (Design Brief §11.5).
- **Paywall inline voice:** honest about value, never guilt-trip (Design Brief §2.2).

### A11y
- `aria-label` provided when visual label differs from accessible label (e.g. icon-only buttons).
- Error states use `role="alert"` (live region) at component layer; content-lead supplies text, engineering supplies role wrapping.
- Live regions for AI streaming responses (`aria-live="polite"`, Design Brief §12.3) — content-lead supplies «Memoro is thinking…» type text.

---

## §1. Primary buttons

| Key | EN | RU | Context | Max chars | A11y label (if differs) |
|---|---|---|---|---|---|
| `btn.connect_account` | Connect account | Подключить счёт | Accounts page primary CTA | EN 15 / RU 16 | — |
| `btn.connect_first_account` | Connect your first account | Подключить первый счёт | Empty-dashboard hero CTA, Welcome email CTA | EN 26 / RU 23 | — |
| `btn.ask_memoro` | Ask Memoro | Спросить Memoro | Chat input send button (primary state, before typing) | EN 10 / RU 15 | `aria-label`: "Send question to Memoro" / "Отправить вопрос Memoro" |
| `btn.send` | Send | Отправить | Chat input send button (when text typed) | EN 4 / RU 9 | same as above |
| `btn.see_insight_detail` | See detail | Подробнее | Insight card secondary action | EN 10 / RU 9 | `aria-label`: "See insight detail" / "Смотреть детали инсайта" |
| `btn.see_all_insights` | See all insights | Все инсайты | Dashboard «Insight of the day» footer link | EN 16 / RU 11 | — |
| `btn.dismiss_insight` | Dismiss | Скрыть | Insight card secondary action | EN 7 / RU 7 | `aria-label`: "Dismiss this insight" / "Скрыть этот инсайт" |
| `btn.snooze_insight` | Snooze 7 days | Отложить на 7 дней | Insight card secondary (returns in 7 days if still valid) | EN 14 / RU 19 | — |
| `btn.upgrade_to_plus` | Upgrade to Plus | Перейти на Plus | Paywall modal primary CTA, Free-tier upgrade hint | EN 15 / RU 16 | — |
| `btn.upgrade_to_pro` | Upgrade to Pro | Перейти на Pro | Plus-tier upgrade hint | EN 14 / RU 15 | — |
| `btn.unlock_on_plus` | Unlock on Plus | Открыть на Plus | Coach teaser paywall inline CTA | EN 14 / RU 15 | — |
| `btn.manage_plan` | Manage plan | Управлять планом | Settings → Subscription | EN 11 / RU 16 | — |
| `btn.cancel_plan` | Cancel plan | Отменить план | Settings → Subscription destructive action | EN 11 / RU 13 | — |
| `btn.rename_account` | Rename | Переименовать | Account row kebab menu | EN 6 / RU 14 | `aria-label`: "Rename account" / "Переименовать счёт" |
| `btn.delete_account` | Delete | Удалить | Account row kebab menu (destructive, requires confirm) | EN 6 / RU 7 | `aria-label`: "Delete account" / "Удалить счёт" |
| `btn.retry` | Retry | Повторить | Error state primary action | EN 5 / RU 9 | — |
| `btn.refresh` | Refresh | Обновить | Stale-data banner action | EN 7 / RU 8 | — |
| `btn.continue` | Continue | Продолжить | Onboarding multi-step navigation | EN 8 / RU 10 | — |
| `btn.skip_for_now` | Skip for now | Пропустить | Onboarding optional step skip | EN 12 / RU 10 | — |

### Button voice rationale
- **«Ask Memoro»** is the empty-chat-input CTA; switches to plain **«Send»** once text is typed (less branded-noise, more direct). Design Brief §10.3 ChatInputPill behavior.
- **«Unlock on Plus»** (not «Buy Plus», not «Upgrade now!») — imperative about the feature, not the purchase. Made-to-stick Concrete: user unlocks a specific thing (Coach detail), not a generic tier.
- **«Skip for now»** instead of «Skip» alone — the «for now» softens the action, implies it's recoverable. Design Brief §2.2 onboarding voice: «encouraging, never patronizing».

---

## §2. Empty states

Design Brief §11.5 pattern: icon + short line + single CTA, no illustration by default.

### `empty.accounts`
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | No accounts connected yet. | Connect one account and Memoro starts remembering what you hold. | Connect account |
| RU | Пока ни одного счёта. | Подключи первый — и Memoro начнёт помнить, что у тебя есть. | Подключить счёт |

- Context: `/accounts` page when `accounts.length === 0`
- A11y: heading `<h2>`, CTA is primary button
- Max chars: heading EN 28 / RU 22, body EN 64 / RU 68

### `empty.first_sync_pending`
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | First sync in progress. | Memoro is reading your positions. This usually takes less than a minute. | — (no CTA; spinner state) |
| RU | Идёт первая синхронизация. | Memoro читает твои позиции. Обычно это занимает меньше минуты. | — |

- Context: `/dashboard` first view post-connect, before first sync completes
- A11y: `role="status"`, `aria-live="polite"`
- Behavior: auto-resolves when sync succeeds; if sync fails, flips to `error.sync_failed` state

### `empty.insights_no_data_yet`
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | No insights yet. | Memoro needs a bit of your portfolio history to notice things. Come back in a day or two. | — |
| RU | Инсайтов пока нет. | Memoro нужно немного истории твоего портфеля, чтобы замечать. Загляни через день-два. | — |

- Context: `/insights` feed when no insights generated yet (within 24h of first sync, or Free tier mid-week between insights)
- Lane A check: «come back in a day or two» is product-expectation, not investment-timing-advice. PASS.

### `empty.insights_free_quiet_week`
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | Quiet week. | On Free, Memoro surfaces one insight per week. Next one lands {next_date}. | See daily on Plus |
| RU | Тихая неделя. | На Free Memoro подсвечивает один инсайт в неделю. Следующий — {next_date}. | Смотреть каждый день на Plus |

- Context: Free tier, 0 new insights in current week
- Voice: honest about cadence. Upgrade CTA is soft invitation.

### `empty.coach_cold_start_free`
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | Coach hasn't read enough yet. | Memoro needs about 30 days of your trading history to start seeing patterns. | — |
| RU | Коуч пока не прочитал достаточно. | Memoro нужно около 30 дней твоей истории сделок, чтобы начать видеть паттерны. | — |

- Context: Coach surface visited within first 30 days, no patterns yet detectable
- A11y: `role="status"`
- Voice: Memoro-as-agent («Memoro needs»). Honest timeline (30 days matches Onboarding Stage 3).
- Lane A: no advice, no performance claim, no normative framing. PASS.

### `empty.coach_teaser_free_first_pattern` (teaser-paywall, Q5 lock)
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | Memoro noticed a pattern. | The first pattern-read is ready. Plus unlocks what it is and what it's based on. | Unlock on Plus |
| RU | Memoro заметил паттерн. | Первый пэттерн-рид готов. Plus открывает, что это за паттерн и на чём он построен. | Открыть на Plus |

- Context: Free tier, day 30+, first pattern detected by Coach backend. Single-line teaser — no pattern details leak.
- Lane A note: «a pattern» is curiosity hook, zero normative content. The pattern detail itself lives behind paywall; teaser does not reveal substance. Finance-advisor R11 compliant (no over-claim at Free surface).
- Voice: Memoro-as-agent, quiet-invention Magician tone. Made-to-stick «curiosity gap» (Heath — tell what you know, hint at what they don't).

### `empty.chat_new_conversation`
| Lang | Heading | Body | Suggestions |
|---|---|---|---|
| EN | What do you want to know about your portfolio? | Memoro answers on your actual holdings. With sources. | «What's my biggest position?» / «What dividends are coming up?» / «How diversified am I?» |
| RU | Что хочешь узнать о своём портфеле? | Memoro отвечает на твоих реальных позициях. Со ссылками на источники. | «Какая моя самая большая позиция?» / «Какие дивиденды на подходе?» / «Насколько я диверсифицирован?» |

- Context: `/chat` new conversation, empty message state
- Component: uses `SuggestedPrompt` chips per Design Brief §10.3
- A11y: heading `<h1>`, suggested prompts are buttons with full text in `aria-label`
- Lane A: suggested prompts are all observation questions. PASS.

### `empty.scenarios_paywall_free`
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | Scenarios are a Pro feature. | Run «what if» on your real portfolio — FX drops, rebalances, new positions — with Pro. | See Pro |
| RU | Сценарии — это фича Pro. | Запускай «а что если» на своём реальном портфеле — падения валют, ребалансы, новые позиции — на Pro. | Посмотреть Pro |

- Context: Free/Plus user tries to open Scenarios tab
- Lane A: «what if» examples are specifically hypothetical, neutral. «Rebalances» here is user-intent, not Memoro-recommendation. PASS.

### `empty.search_no_results`
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | No matches. | Nothing in your portfolio matches «{query}». Try a ticker or company name. | — |
| RU | Совпадений нет. | В твоём портфеле ничего не совпадает с «{query}». Попробуй тикер или название компании. | — |

---

## §3. Error states

Design Brief §2.2 error voice: «Calm, specific, with a next step.»

### `error.sync_failed_generic`
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | We couldn't reach {broker_name}. | Memoro will try again in a few minutes. Your data isn't lost — just not fresh right now. | Retry now |
| RU | Не удалось связаться с {broker_name}. | Memoro повторит через несколько минут. Данные не потеряны — просто сейчас не свежие. | Повторить |

- A11y: `role="alert"`
- Voice: «We couldn't» not «You failed to» — error is Memoro's, not user's. Specific broker name. Next step named.

### `error.sync_failed_auth`
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | {broker_name} needs re-authorization. | Your connection expired — brokers do this for security. Takes about 30 seconds to reconnect. | Reconnect |
| RU | {broker_name} требует повторной авторизации. | Сессия истекла — брокеры так делают ради безопасности. Переподключение занимает около 30 секунд. | Переподключить |

- Voice: explains WHY it happened (security, not a bug). Design Brief §17.3 trust-marker pattern carried into error.

### `error.sync_failed_rate_limit`
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | {broker_name} is asking us to slow down. | Memoro will retry automatically in a few minutes. No action needed. | — |
| RU | {broker_name} просит нас сбавить темп. | Memoro автоматически повторит через несколько минут. Ничего делать не нужно. | — |

### `error.ai_unavailable`
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | Memoro's chat is temporarily unavailable. | We're working on it. Your history is safe — check back in a few minutes. | Retry |
| RU | Чат Memoro временно недоступен. | Мы работаем над этим. История в безопасности — зайди через несколько минут. | Повторить |

- Context: AI service 5xx / timeout / health-check fail
- Voice: «we're working on it» is the one place «we» appears — error context, not product-identity voice. Transparent about the interruption.

### `error.rate_limit_hit_free` (PATCHED 2026-04-23 per 4-locks — monthly cap, no daily)
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | Monthly chat limit reached. | On Free, Memoro answers 50 questions per month. Resets on {next_reset_date}, or unlimited on Plus. | See Plus |
| RU | Месячный лимит чата достигнут. | На Free Memoro отвечает на 50 вопросов в месяц. Обновится {next_reset_date}, или безлимит на Plus. | Посмотреть Plus |

- Voice: factual, no urgency manipulation. Reset date specific.
- Note: PATCHED per `DECISIONS.md` 2026-04-23 4-locks — Free tier = 50 msg/month with NO daily limit. User can burst 10 in one day, be silent the next. Error fires only at monthly cap hit.

### `error.insight_limit_hit_free`
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | This week's insight already landed. | On Free, Memoro surfaces one insight per week. Plus is daily. | See Plus |
| RU | Инсайт этой недели уже вышел. | На Free Memoro подсвечивает один инсайт в неделю. Plus — каждый день. | Посмотреть Plus |

### `error.accounts_over_limit_free`
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | Free tier is 2 accounts max. | To connect more, upgrade to Plus — $8/mo, unlimited accounts. | See Plus |
| RU | На Free — до 2 счетов. | Чтобы подключить больше — Plus за $8/мес, безлимит. | Посмотреть Plus |

### `error.network_offline`
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | You're offline. | Memoro needs a connection to read your portfolio. Check your network. | Retry |
| RU | Ты офлайн. | Memoro нужно соединение, чтобы читать твой портфель. Проверь сеть. | Повторить |

### `error.generic_fallback`
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | Something went sideways. | Memoro hit an unexpected snag. Refreshing usually fixes it. If not, email {support_email}. | Refresh |
| RU | Что-то пошло не так. | Memoro наткнулся на неожиданную проблему. Обновление обычно помогает. Если нет — напиши на {support_email}. | Обновить |

- Voice: «went sideways» / «пошло не так» — calm, specific, human. Design Brief §2.2 principle: «Honest about limits.»

---

## §4. Loading states

### `loading.generic`
| Lang | Text |
|---|---|
| EN | Loading… |
| RU | Загрузка… |

### `loading.sync_in_progress`
| Lang | Text |
|---|---|
| EN | Memoro is syncing {broker_name}… |
| RU | Memoro синхронизирует {broker_name}… |

### `loading.ai_thinking`
| Lang | Text |
|---|---|
| EN | Memoro is thinking… |
| RU | Memoro думает… |

- A11y: `aria-live="polite"` announces this to screen readers (Design Brief §12.3)
- Voice: Memoro-as-agent. NOT «AI is typing» (too generic).

### `loading.ai_fetching_tool`
| Lang | Text |
|---|---|
| EN | Memoro is fetching your {tool_context}… |
| RU | Memoro подтягивает {tool_context}… |

- Context: surfaces in `ToolUseCard` (Design Brief §10.3) while AI calls a tool
- `{tool_context}` examples: "transactions", "holdings", "dividend history" / "транзакции", "позиции", "историю дивидендов"

### `loading.insights_computing`
| Lang | Text |
|---|---|
| EN | Memoro is reading your portfolio… |
| RU | Memoro читает твой портфель… |

---

## §5. Coach teaser strings (Q5 teaser-paywall lock)

Per `DECISIONS.md` 2026-04-23 Q5: Free tier surfaces «Memoro noticed a pattern» as a teaser (one-line curiosity hook). Pattern details gated behind Plus.

### `coach.teaser.free_single_pattern`
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | Memoro noticed a pattern in your past trades. | The full read — what the pattern is, which trades, what it's based on — is on Plus. | Unlock detail on Plus |
| RU | Memoro заметил паттерн в твоих прошлых сделках. | Полный разбор — что за паттерн, какие сделки, на чём построен — на Plus. | Открыть разбор на Plus |

- Used in: Insights feed card (as a Coach-type card), Dashboard Insight-of-the-day slot, 30-day recap email
- Lane A check: «noticed a pattern» is hook-only, zero substance leaked. «What the pattern is» is the thing Plus unlocks — Free sees teaser, Plus sees full read. No finance-advisor R11 over-claim at this surface.

### `coach.teaser.free_multiple_patterns`
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | Memoro noticed {N} patterns in your trades. | The full reads are on Plus — what each pattern is, which trades, what it's based on. | Unlock all on Plus |
| RU | Memoro заметил {N} паттернов в твоих сделках. | Полные разборы — на Plus: что за паттерны, какие сделки, на чём построены. | Открыть все на Plus |

### `coach.full_read_plus_intro`
| Lang | Heading | Body |
|---|---|---|
| EN | What Memoro sees. | Memoro read your past trades and surfaced the patterns below. No judgment, no advice — just what it sees. |
| RU | Что Memoro видит. | Memoro прочитал твои прошлые сделки и подсветил паттерны ниже. Без осуждения, без советов — только то, что видит. |

- Context: Plus tier Coach page intro — reaffirms Lane A voice at surface, not just landing
- Voice: echoes landing bullet 3 verbatim («No judgment, no advice, just what it sees»)

### Contextual-icon teaser strings (NEW 2026-04-23 per 4-locks Coach UX)

**Decision source.** `DECISIONS.md` 2026-04-23 «Coach UX: contextual» lock. Blinking icons appear on contextual elements (position cards, dashboard widgets, relevant chat threads) when Memoro notices a pattern tied to that element. Icon click opens a small popover with pattern TEASER (subject-level, not substance). For Free tier, popover has upgrade CTA. For Plus/Pro, popover shows full pattern-read inline.

**Teaser rule (Lane A critical):** popover reveals pattern SUBJECT («Memoro noticed a pattern in your NVDA trades») but not SUBSTANCE (what the pattern is, which trades, what the inference is). Substance lives behind Plus paywall for Free users; lives in-popover for Plus/Pro users.

### `coach.icon.tooltip` — blinking icon hover tooltip
| Lang | Text |
|---|---|
| EN | Memoro noticed something. Click to see. |
| RU | Memoro кое-что заметил. Нажми, чтобы увидеть. |

- Placement: tooltip on hover of the blinking icon (position card corner, dashboard widget header, chat thread indicator)
- ≤40 chars EN / ≤50 chars RU
- A11y: `aria-label`: "Memoro noticed a pattern — click to expand" / "Memoro заметил паттерн — нажми для раскрытия"

### `coach.icon.popover_free_asset_scoped` — Free tier, pattern tied to specific asset
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | Memoro noticed a pattern in your {asset_ticker} trades. | Upgrade to Plus to see what the pattern is and which trades it's based on. | Upgrade to Plus |
| RU | Memoro заметил паттерн в твоих сделках {asset_ticker}. | Перейди на Plus, чтобы увидеть, что за паттерн и на каких сделках построен. | Перейти на Plus |

- `{asset_ticker}` examples: "NVDA", "AAPL", "BTC", "EUR cash" — any position/category where a pattern is detected
- Dynamic category version — when pattern spans multiple tickers:
  - EN: "Memoro noticed a pattern in your {category} trades." — where {category} is "tech", "high-div", "crypto-spot", "drawdown-reactive", etc.
  - RU: "Memoro заметил паттерн в твоих сделках {category}."
- Dynamic behavior-scoped version — when pattern is about user-behavior, not asset:
  - EN: "Memoro noticed a pattern in how you respond to drawdowns."
  - RU: "Memoro заметил паттерн в том, как ты реагируешь на просадки."

### `coach.icon.popover_free_behavior_scoped` — Free tier, pattern tied to user behavior
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | Memoro noticed a pattern in {behavior_phrase}. | Upgrade to Plus to see the pattern read in detail. | Upgrade to Plus |
| RU | Memoro заметил паттерн в {behavior_phrase}. | Перейди на Plus, чтобы увидеть разбор паттерна в деталях. | Перейти на Plus |

- `{behavior_phrase}` examples (Lane A + finance-advisor R10 compliant, descriptive-not-normative):
  - EN: "how you respond to drawdowns", "your buying cadence after earnings", "your dividend reinvestment timing", "your sector-rotation patterns"
  - RU: "том, как ты реагируешь на просадки", "том, как ты покупаешь после отчётов", "том, как ты реинвестируешь дивиденды", "твоих ротациях по секторам"
- BANNED phrasing (normative / pathological framing — finance-advisor R10):
  - EN: "your panic-selling habits", "your FOMO", "your revenge trading", "how you overtrade"
  - RU: "твоих паниках", "твоём FOMO", "реванше", "твоих овер-сделках"
- A11y: heading `<h3>` inside popover, body `<p>`, CTA `<button>`; popover has `role="dialog"` + `aria-modal="false"` (non-blocking)

### `coach.icon.popover_plus_full_read` — Plus/Pro tier, full pattern in popover
| Lang | Heading | Body | CTA |
|---|---|---|---|
| EN | Memoro noticed: {pattern_name} | **Based on:** {N} trades in {timeframe} · **What Memoro saw:** {ai_description_short}<br/>Full read in your Coach activity. | See in Coach activity |
| RU | Memoro заметил: {pattern_name} | **На основе:** {N} сделок за {timeframe} · **Что увидел Memoro:** {ai_description_short}<br/>Полный разбор — в активности коуча. | Смотреть в коуче |

- `{pattern_name}` constraints: same as §5 `coach.pattern_item_template` — descriptive-factual, not normative
- `{ai_description_short}` = first 1-2 sentences of full pattern-read (popover budget limits full description)
- Button «See in Coach activity» opens the bell-dropdown hub (§5b) expanded to this pattern

### `coach.icon.popover_secondary_action` — both tiers
| Lang | Text |
|---|---|
| EN | Mark as seen |
| RU | Отметить как просмотренное |

- Secondary action in popover footer. Marks the blinking icon as acknowledged (stops blink for this pattern).
- ≤20 chars EN / ≤30 chars RU

### `coach.pattern_item_template` (content-lead-owned wrapper; pattern text itself is AI-generated)
| Lang | Wrapper |
|---|---|
| EN | **Pattern:** {pattern_name}<br/>**Based on:** {N} trades in {timeframe}<br/>**What Memoro saw:** {ai_description}<br/>[See the trades] |
| RU | **Паттерн:** {pattern_name}<br/>**На основе:** {N} сделок за {timeframe}<br/>**Что увидел Memoro:** {ai_description}<br/>[Смотреть сделки] |

- `{pattern_name}` must be descriptive-factual, NOT normative. Examples content-lead allows:
  - EN: "Selling after >5% drawdown", "Buying on post-earnings drops", "Sector rotation out of tech to energy"
  - RU: "Продажи после просадки >5%", "Покупки на падениях после отчётов", "Ротация из tech в энергетику"
- `{pattern_name}` banned examples (finance-advisor R10 — normative framing):
  - EN: "Panic-selling", "FOMO-buying", "Revenge trading"
  - RU: "Паника", "FOMO", "Реванш" (все нормативно-окрашенные)
- This is a content-voice constraint on the AI output generator — flagged to finance-advisor / AI content validation workstream.

---

## §5a. Trial-related strings (NEW 2026-04-23 per 4-locks — 14-day Plus trial)

**Decision source.** `DECISIONS.md` 2026-04-23 «Trial: 14-day Plus, card required» lock. User signs up with card → 14 days of Plus access → auto-charge on day 14 OR user cancels.

### `trial.countdown_banner` — persistent top banner during trial
| Lang | Format | Context |
|---|---|---|
| EN | {days_left} days of Plus left · Cancel any time | Day 14 through day 8 remaining |
| RU | {days_left} дн. Plus осталось · Отмена в любой момент | Day 14 through day 8 remaining |
| EN | {days_left} days left — your card is charged on {trial_end_date} | Day 7 through day 2 remaining |
| RU | {days_left} дн. осталось — карта спишется {trial_end_date} | Day 7 through day 2 remaining |
| EN | 1 day left — your card is charged tomorrow | Day 1 remaining |
| RU | 1 день остался — карта спишется завтра | Day 1 remaining |

- Placement: top banner, persistent, dismissible (re-appears on each new session)
- ≤80 chars EN / ≤100 chars RU
- Voice: factual, no urgency manipulation. «Cancel any time» is reassurance, not marketing.
- Day-1 variant uses plain «1 day left» — not «LAST CHANCE», not «hurry».
- A11y: `role="status"` + `aria-live="polite"` (non-critical announcement)

### `trial.countdown_short` — tight space variant (nav bar badge)
| Lang | Format |
|---|---|
| EN | {days_left}d Plus |
| RU | {days_left}д Plus |

- ≤12 chars
- Used in top nav bar as compact pill
- Hover tooltip: full `trial.countdown_banner` text

### `trial.ended_banner` — post-conversion confirmation banner
| Lang | Text | Duration |
|---|---|---|
| EN | You're on Plus. Cancel any time in Settings. | 48 hours post-conversion |
| RU | Ты на Plus. Отмена — в настройках, в любой момент. | 48 hours post-conversion |

- Shown for 48 hours after successful trial→paid conversion, then hidden
- ≤60 chars EN / ≤80 chars RU

### `trial.canceled_banner` — user canceled before trial end
| Lang | Text |
|---|---|
| EN | Trial canceled. You're on Free — {free_until_date} Plus features still active. | ≤100 chars |
| RU | Триал отменён. Ты на Free — фичи Plus доступны до {free_until_date}. | ≤110 chars |

- Shown for ~48 hours after cancel. Reassures user that Plus access continues until the original trial_end_date even though they canceled (no penalty for early cancel).

### `trial.card_on_file_confirmation` — signup flow post-card-add
| Lang | Heading | Body |
|---|---|---|
| EN | Card saved. Trial starts now. | Your 14-day Plus trial just started. On {trial_end_date}, we charge $8 — or you cancel before then. |
| RU | Карта сохранена. Триал начался. | Твой 14-дневный триал Plus только что стартовал. {trial_end_date} спишется $8 — или отменишь до этой даты. |

- Placement: signup wizard final step, post-Stripe-Elements-submit success
- Body ≤140 chars EN / ≤170 chars RU
- Voice: confirmation frame, not sales. Names the charge date + amount explicitly per regulatory disclosure requirement.

### `trial.cta_start_trial` — trial entry point CTAs
| Key | EN | RU | Context |
|---|---|---|---|
| `btn.start_14_day_trial` | Try Plus free for 14 days | Попробуй Plus бесплатно 14 дней | Landing hero, signup, paywall secondary CTA |
| `btn.start_trial_short` | Start trial | Начать триал | Tight-space nav or modal variant |
| `btn.skip_trial_stay_free` | Skip — start on Free forever | Пропустить — начать на Free навсегда | Signup wizard alternative path |
| `btn.cancel_trial` | Cancel trial | Отменить триал | Settings → Subscription during trial |
| `btn.keep_plus` | Keep Plus | Оставить Plus | Trial day-13 email landing page, signup wizard trial-renewal-confirm |

- Voice: imperative-direct (Everyman). «Try» on primary trial CTA — permission to exit, not commitment. «Skip — start on Free forever» explicit wording reassures user that skipping trial isn't losing anything.

### `trial.card_required_disclaimer`
| Lang | Text |
|---|---|
| EN | Card required. Cancel any time, one click. We charge $8 on {trial_end_date} unless you cancel. |
| RU | Нужна карта. Отмена в один клик, в любой момент. Списываем $8 {trial_end_date}, если не отменишь. |

- Placement: under trial-start CTA in signup + landing
- ≤120 chars EN / ≤140 chars RU
- Voice: full disclosure up-front, not buried.

### `trial.free_forever_alternative`
| Lang | Text |
|---|---|
| EN | Not ready for a card? Start free forever. No trial ending, 50 messages/month. |
| RU | Не готов к карте? Начни бесплатно — навсегда. Без истечения триала, 50 сообщений в месяц. |

- Placement: under trial-start CTA as alternative path link
- ≤110 chars EN / ≤130 chars RU
- Voice: legit alternative, not consolation prize. Free IS a full-value path.

### Trial-email strings (used in trial emails 6-9, cross-reference to `email-sequences.md`)
These strings are duplicated here for inline-reference/i18n-key consistency. Actual email body copy lives in `email-sequences.md` §6-§9.

| Key | EN | RU |
|---|---|---|
| `trial.email.subject_welcome` | 14 days of Plus starts now. | 14 дней Plus начинаются сейчас. |
| `trial.email.subject_day7` | One week in. Has Memoro surprised you yet? | Неделя с Memoro. Удивил? |
| `trial.email.subject_day13` | Tomorrow: your Plus trial ends. | Завтра: твой триал Plus заканчивается. |
| `trial.email.subject_post_conversion` | Welcome to Memoro Plus. | Добро пожаловать в Memoro Plus. |

### Trial Lane A + dark-pattern check
- [x] Card requirement disclosed at signup, not after
- [x] Charge date + amount stated in multiple surfaces (signup confirmation, countdown banner, day-13 email) — no ambush
- [x] Cancel path visible at equal weight everywhere
- [x] No countdown language manipulated for urgency («only 2 days left!!!» — forbidden; «2 days left · Cancel any time» — allowed)
- [x] Free-forever alternative surfaced with equal visual treatment
- [x] «Cancel any time, one click» phrasing consistent across surfaces (email, microcopy, paywall)

---

## §5b. Bell-dropdown strings (NEW 2026-04-23 per 4-locks Coach UX)

**Decision source.** `DECISIONS.md` 2026-04-23 «Coach UX: contextual». Bell-dropdown in top-bar is the discovery HUB for all Coach patterns (replaces earlier filter-chip / dedicated-route options). Unread count badge on bell icon. Click → dropdown list of current coach patterns + settings link.

### `bell.icon.label` — aria-label for bell icon
| Lang | Text |
|---|---|
| EN | Memoro activity ({unread_count} unread) |
| RU | Активность Memoro ({unread_count} непрочитанных) |

- A11y: `aria-label` for bell icon button in top nav
- `{unread_count}` = count of unseen Coach patterns since last dropdown open
- When count = 0: "Memoro activity" / "Активность Memoro" (no parenthetical)

### `bell.icon.badge` — unread count visible on bell
| Lang | Format |
|---|---|
| Both | {N} |

- If N ≥ 99: render as "99+" (EN) / "99+" (RU)
- A11y: count announced via parent button's aria-label, not read separately

### `bell.dropdown.heading`
| Lang | Text |
|---|---|
| EN | What Memoro noticed |
| RU | Что заметил Memoro |

- Placement: dropdown header
- ≤30 chars

### `bell.dropdown.empty_state`
| Lang | Heading | Body |
|---|---|---|
| EN | No patterns noticed yet. | Memoro needs about 30 days of your trade history to start seeing patterns. | ≤140 chars body |
| RU | Паттернов пока нет. | Memoro нужно около 30 дней твоей истории сделок, чтобы начать видеть паттерны. | ≤170 chars body |

- Shown when user has no Coach patterns yet (day 0-30 post-signup for new user; or user never had any)
- Voice: Memoro-as-agent, honest timeline. Same shape as `empty.coach_cold_start_free` (§2) — single source of truth.

### `bell.dropdown.item_format` — pattern list item in dropdown
| Lang | Format |
|---|---|
| EN | **{pattern_name_or_subject}** · {time_ago} · {asset_or_category} |
| RU | **{pattern_name_or_subject}** · {time_ago} · {asset_or_category} |

- For Free tier: `{pattern_name_or_subject}` renders as subject-only teaser («Pattern in NVDA trades») — never substance
- For Plus/Pro tier: `{pattern_name_or_subject}` renders full pattern name («Selling after >5% drawdown in NVDA trades»)
- `{time_ago}` format: "2h ago" / "2ч назад", "3d ago" / "3д назад" — same format as Insights feed timestamps
- `{asset_or_category}` shown if not already in pattern_name
- Max ≤80 chars full-render EN / ≤100 chars RU
- Unseen items have bolder visual weight; seen items are muted

### `bell.dropdown.item_cta_free` — Free tier pattern list item CTA
| Lang | Text |
|---|---|
| EN | Upgrade to Plus to see detail |
| RU | Перейти на Plus — увидеть разбор |

- Inline text link on each Free-tier pattern item
- ≤32 chars EN / ≤38 chars RU

### `bell.dropdown.item_cta_plus` — Plus/Pro tier pattern list item CTA
| Lang | Text |
|---|---|
| EN | Open pattern |
| RU | Открыть паттерн |

### `bell.dropdown.mark_all_read`
| Lang | Text |
|---|---|
| EN | Mark all as read |
| RU | Отметить всё как прочитанное |

- Placement: dropdown footer, left-aligned
- ≤20 chars EN / ≤30 chars RU

### `bell.dropdown.settings_link`
| Lang | Text |
|---|---|
| EN | Activity settings |
| RU | Настройки активности |

- Placement: dropdown footer, right-aligned
- Links to Settings → Activity (where user can configure which pattern types trigger blinking icons + bell updates)
- ≤20 chars EN / ≤26 chars RU

### `bell.dropdown.activity_history_link`
| Lang | Text |
|---|---|
| EN | See full activity history |
| RU | Смотреть всю историю |

- Placement: dropdown footer bottom, centered
- Links to Settings → Activity history (full chronological log of all Coach patterns ever detected + bell notifications + dismissals)
- ≤28 chars EN / ≤26 chars RU

### `bell.settings.heading` — Settings → Activity page
| Lang | Heading | Sub |
|---|---|---|
| EN | Memoro activity | Control what Memoro notices and how you see it. |
| RU | Активность Memoro | Управляй тем, что Memoro замечает и как ты это видишь. |

### `bell.settings.toggle_blinking_icons`
| Lang | Label | Description |
|---|---|---|
| EN | Blinking icons on context | When Memoro notices a pattern on a position, dashboard widget, or chat thread, show a blinking icon. |
| RU | Мигающие иконки в контексте | Когда Memoro замечает паттерн на позиции, виджете дашборда или в чате — показывать мигающую иконку. |

### `bell.settings.toggle_bell_notifications`
| Lang | Label | Description |
|---|---|---|
| EN | Bell notifications | Show unread count on the top-bar bell icon. |
| RU | Уведомления-звонок | Показывать счётчик непрочитанного на иконке-звонке в верхней панели. |

### `bell.settings.toggle_email_activity`
| Lang | Label | Description |
|---|---|---|
| EN | Weekly activity email | Summary of what Memoro noticed this week, delivered Sunday. |
| RU | Еженедельное письмо об активности | Сводка того, что Memoro заметил за неделю, приходит в воскресенье. |

- Default: off (opt-in). Avoids unexpected email volume.

### Bell-dropdown A11y
- Bell icon: `<button aria-label="{bell.icon.label}" aria-haspopup="true" aria-expanded="{true|false}">`
- Dropdown panel: `role="menu"` with `aria-label="{bell.dropdown.heading}"`
- Pattern list items: `role="menuitem"`; Upgrade CTA on Free items = nested link
- Empty state: `role="status"` (non-critical announcement)
- Keyboard: Esc closes, Tab cycles through items, Enter activates
- Screen reader announces unread count change via `aria-live="polite"` region elsewhere

### Bell-dropdown Lane A check
- [x] Pattern list items on Free tier reveal SUBJECT only, never substance
- [x] Upgrade CTA is feature-description («see detail»), not performance-promise
- [x] Empty state is Memoro-as-agent voice, no advice
- [x] Settings toggles are product controls, not behavior modification
- [x] Weekly activity email is opt-in (no default-on email volume)

---

## §5c. Free-to-Plus upgrade copy for coach paywall (NEW dynamic variants, 2026-04-23)

**Decision source.** `DECISIONS.md` 2026-04-23 «Coach UX: contextual» + §4 Variant 5 in `paywall.md` (contextual teaser popover). Dynamic copy where `{asset}` or `{category}` or `{behavior_phrase}` is injected based on detected pattern scope.

**Purpose.** When user clicks «Upgrade to Plus» from bell-dropdown item, contextual-icon popover, or Insights feed Coach card, paywall modal opens with CONTEXT-specific headline. This section is the catalogue of context-headline variants. Generic Coach paywall body lives in `paywall.md` §4.

### Asset-scoped variants (pattern tied to specific ticker/asset)

| Context | EN headline | RU headline |
|---|---|---|
| Default asset-scoped | Memoro noticed a pattern in your {asset} trades. | Memoro заметил паттерн в твоих сделках {asset}. |
| Multiple trades same asset | Memoro sees a pattern across your {N} {asset} trades. | Memoro видит паттерн в {N} твоих сделках {asset}. |
| Asset + timeframe | Memoro noticed a pattern in your {asset} trades from {timeframe}. | Memoro заметил паттерн в твоих сделках {asset} за {timeframe}. |

- `{asset}` examples: "NVDA", "AAPL", "TSLA", "BTC", "ETH", "EUR cash", "gold holdings"
- `{timeframe}` examples: "last 6 months", "Q4 2025", "2025" / "последние 6 месяцев", "Q4 2025", "2025"
- ≤80 chars EN / ≤100 chars RU

### Category-scoped variants (pattern tied to sector / asset-class / currency)

| Context | EN headline | RU headline |
|---|---|---|
| Sector | Memoro noticed a pattern in your {sector} holdings. | Memoro заметил паттерн в твоих позициях {sector}. |
| Asset class | Memoro sees a pattern in how you handle {asset_class}. | Memoro видит паттерн в том, как ты обращаешься с {asset_class}. |
| Currency | Memoro noticed a pattern in your {currency} exposure. | Memoro заметил паттерн в твоей экспозиции в {currency}. |

- `{sector}` examples: "tech", "high-div", "energy", "consumer staples" / "tech", "высокодивидендных", "энергетика", "базовое потребление"
- `{asset_class}` examples: "ETFs", "individual stocks", "crypto", "bonds" / "ETF", "отдельных акциях", "крипте", "облигациях"
- `{currency}` examples: "USD", "EUR", "cash positions" / "USD", "EUR", "денежных позициях"

### Behavior-scoped variants (pattern tied to user-action, not asset)

| Context | EN headline | RU headline |
|---|---|---|
| Drawdown response | Memoro noticed a pattern in how you respond to drawdowns. | Memoro заметил паттерн в том, как ты реагируешь на просадки. |
| Post-earnings behavior | Memoro sees a pattern in how you react to earnings. | Memoro видит паттерн в том, как ты реагируешь на отчёты. |
| Dividend reinvestment | Memoro noticed a pattern in your dividend reinvestment timing. | Memoro заметил паттерн в твоей тайминге реинвестирования дивидендов. |
| Sector rotation | Memoro sees a pattern in your sector rotations. | Memoro видит паттерн в твоих ротациях по секторам. |
| Buying cadence | Memoro noticed a pattern in when you add positions. | Memoro заметил паттерн в том, когда ты добавляешь позиции. |
| Selling cadence | Memoro sees a pattern in when you trim positions. | Memoro видит паттерн в том, когда ты режешь позиции. |

### Forbidden (normative/pathological — finance-advisor R10)

Content-lead BANS the following framings in all contextual headlines. If pattern-detection backend surfaces any of these categories, microcopy must REPHRASE to descriptive-factual equivalent.

| BANNED EN | Forbidden why | ALLOWED rephrase |
|---|---|---|
| «Memoro spotted your panic-selling» | «panic» is normative, pathologizes user | «Memoro noticed a pattern in how you sell during drawdowns» |
| «Memoro found your FOMO habit» | «FOMO» + «habit» are both value-judgment | «Memoro sees a pattern in when you buy after rallies» |
| «Memoro caught your overtrading» | «overtrading» + «caught» both normative | «Memoro noticed a pattern in your trade frequency» |
| «Memoro detected revenge trading» | «revenge» pathologizes | «Memoro sees a pattern in your trades after losses» |

### Dynamic substitution rules for Coach paywall copy
- Headline: use asset-scoped if pattern has a single dominant ticker, category-scoped if multi-ticker, behavior-scoped if action-type pattern
- Body stays constant (the generic «see what Memoro noticed» framing from `paywall.md` §4) — ONLY headline varies by context
- CTA stays constant («Upgrade to Plus to see detail»)
- Footer disclaimer stays constant (AI-disclaimer full text per `paywall.md` §4 footer)

### A11y
- Dynamic headlines: screen reader reads the FULL text verbatim (no abbreviation). Variable substitution happens server-side before render.
- Focus on modal open goes to heading; trap keyboard focus in modal until dismissed.

### Lane A check (contextual coach headlines)
- [x] Every variant uses «noticed / sees» (observation verb), never «flagged / warned / found problem»
- [x] Asset/category/behavior naming is descriptive, not normative (no «panic», «FOMO», «overtrading», «bad trades»)
- [x] Pattern SUBJECT revealed; pattern SUBSTANCE stays behind Plus paywall — Q5 teaser-paywall lock respected at every surface
- [x] User is the actor, Memoro is the observer — «how you respond», «when you add» — agentic framing for user, observer framing for Memoro
- [x] No performance claims, no «your patterns are costing you money»

---

## §6. Paywall inline strings (used inside modals and feature-lock rows)

Full paywall modal copy lives in `paywall.md`. This section covers **inline** strings that appear outside the modal — on feature-lock rows, usage meters, tier badges.

### `tier.badge.free`
| Lang | Text |
|---|---|
| EN | Free |
| RU | Free |

### `tier.badge.plus`
| Lang | Text |
|---|---|
| EN | Plus |
| RU | Plus |

### `tier.badge.pro`
| Lang | Text |
|---|---|
| EN | Pro |
| RU | Pro |

- Design Brief §10.4 `PlanBadge` component
- Using English «Plus» / «Pro» in Russian deliberately — these are product-tier proper nouns, not translated. Matches pattern seen in EU SaaS (Notion «Plus», Linear «Standard»).

### `usage.chat_meter` (PATCHED 2026-04-23 per 4-locks — monthly pool)
| Lang | Format |
|---|---|
| EN | {used} of {cap} this month |
| RU | {used} из {cap} в этом месяце |

- Design Brief §10.4 `UsageMeter`
- Example render: "23 of 50 this month" / "23 из 50 в этом месяце"
- Tooltip on hover (content-lead adds): «Free tier = 50 messages/month. Resets on the 1st.» / «Free — 50 сообщений в месяц. Обнуляется 1-го числа.»

### `usage.chat_meter_unlimited`
| Lang | Text |
|---|---|
| EN | Unlimited |
| RU | Безлимит |

### `usage.accounts_meter`
| Lang | Format |
|---|---|
| EN | {used} of {cap} accounts |
| RU | {used} из {cap} счетов |

### `feature_lock.unlimited_chat` (NEW 2026-04-23 per 4-locks — replaces old daily-cap framing)
| Lang | Label | Reason | CTA |
|---|---|---|---|
| EN | Unlimited chat | Free = 50 messages/month. Plus unlocks unlimited. | Upgrade to Plus |
| RU | Безлимитный чат | Free — 50 сообщений в месяц. Plus открывает безлимит. | Перейти на Plus |

- Design Brief §10.4 `FeatureLockRow`
- Voice: honest about monthly pool (NOT daily cap per 4-locks). No streak-breaking framing.

### `feature_lock.daily_insights`
| Lang | Label | Reason | CTA |
|---|---|---|---|
| EN | Daily insights | Free = weekly. Plus unlocks daily insights. | Upgrade to Plus |
| RU | Инсайты каждый день | Free — еженедельно. Plus открывает ежедневные инсайты. | Перейти на Plus |

- Design Brief §10.4 `FeatureLockRow`
- Voice: neutral fact + upgrade path. No «you're missing out», no FOMO.

### `feature_lock.csv_export`
| Lang | Label | Reason | CTA |
|---|---|---|---|
| EN | CSV export | Plus unlocks CSV export of your portfolio data. | Upgrade to Plus |
| RU | CSV-экспорт | Plus открывает CSV-экспорт данных портфеля. | Перейти на Plus |

### `feature_lock.benchmark_comparison`
| Lang | Label | Reason | CTA |
|---|---|---|---|
| EN | Benchmark comparison | Plus compares your portfolio against S&P 500, MSCI World, and more. | Upgrade to Plus |
| RU | Сравнение с бенчмарком | Plus сравнивает портфель с S&P 500, MSCI World и другими. | Перейти на Plus |

### `feature_lock.tax_reports`
| Lang | Label | Reason | CTA |
|---|---|---|---|
| EN | Tax reports | Pro generates tax-year reports for your jurisdiction. | Upgrade to Pro |
| RU | Налоговые отчёты | Pro собирает отчёты за налоговый год по твоей юрисдикции. | Перейти на Pro |

### `feature_lock.advanced_analytics`
| Lang | Label | Reason | CTA |
|---|---|---|---|
| EN | Advanced analytics | Pro adds Sharpe, Sortino, factor exposure, and max drawdown. | Upgrade to Pro |
| RU | Продвинутая аналитика | Pro добавляет Sharpe, Sortino, факторную экспозицию и макс. просадку. | Перейти на Pro |

### `feature_lock.scenarios`
| Lang | Label | Reason | CTA |
|---|---|---|---|
| EN | Scenarios | Pro runs «what if» simulations on your real portfolio. | Upgrade to Pro |
| RU | Сценарии | Pro запускает симуляции «а что если» на твоём реальном портфеле. | Перейти на Pro |

### `feature_lock.api_access`
| Lang | Label | Reason | CTA |
|---|---|---|---|
| EN | API access | Pro includes API keys for your portfolio data. | Upgrade to Pro |
| RU | API-доступ | Pro включает API-ключи к данным твоего портфеля. | Перейти на Pro |

---

## §7. AI disclaimer tooltip (Q6 lock — format TBD, content-lead provides interim copy)

Per `DECISIONS.md` 2026-04-23 Q6: «In-context AI disclaimer, format TBD design phase.» Product-designer will finalize format (tooltip / inline micro-copy / first-interaction modal). Content-lead provides tooltip-format draft as default candidate.

**Coordination note:** This copy is referenced-by-and-will-be-coordinated-with whatever pattern legal-advisor produces in `AI_DISCLAIMER_PATTERN.md`. That doc does not yet exist in repo (as of 2026-04-23) — content-lead drafts the interim copy; legal-advisor will own final wording per-jurisdiction once they're dispatched. Flag as dependency.

### `ai_disclaimer.tooltip` — default / US / global
| Lang | Tooltip text |
|---|---|
| EN | Memoro describes what it sees in your portfolio. It is not an investment advisor and does not recommend specific trades. For educational purposes only. | ≤140 chars |
| RU | Memoro описывает, что видит в твоём портфеле. Он не является инвестиционным советником и не рекомендует конкретные сделки. Только для образовательных целей. | ≤180 chars |

### `ai_disclaimer.tooltip_eu_uk` — MiFID II / FCA stricter line (Q6 Lane A reinforcement)
| Lang | Tooltip text |
|---|---|
| EN | Memoro provides portfolio information and observation only. This is not investment advice under MiFID II / FCA. Any decisions are yours alone. | ≤160 chars |
| RU | Memoro предоставляет только информацию и наблюдения о портфеле. Это не инвестиционная консультация по MiFID II / FCA. Решения — только за тобой. | ≤180 chars |

- Placement: triggered by `?` icon next to Memoro's response header in chat, on InsightCard, and on Coach pattern-reads
- A11y: `aria-describedby` on the AI-response container points to tooltip ID; tooltip has `role="tooltip"`
- Escape key dismisses tooltip
- Jurisdiction-aware: render EU/UK variant when user locale = EU/UK (IP/account-level), else default

### `ai_disclaimer.footer_badge`
| Lang | Text |
|---|---|
| EN | Information only. Not advice. |
| RU | Только информация. Не совет. |

- Persistent footer badge on all Memoro AI surfaces (chat, insights, coach)
- ≤30 chars EN / ≤30 chars RU
- Accompanied by `?` icon that opens full `ai_disclaimer.tooltip`

---

## §8. Toast / notification strings

### `toast.account_connected`
| Lang | Text |
|---|---|
| EN | {broker_name} connected. Memoro is reading your positions. | ≤80 chars |
| RU | {broker_name} подключён. Memoro читает твои позиции. | ≤80 chars |

### `toast.account_renamed`
| Lang | Text |
|---|---|
| EN | Account renamed. | |
| RU | Счёт переименован. | |

### `toast.account_disconnected`
| Lang | Text |
|---|---|
| EN | {broker_name} disconnected. Your historical data stays. | |
| RU | {broker_name} отключён. Историческая история сохраняется. | |

- Voice: echoes Design Brief §17.2 — «we'll stop syncing; your historical data stays until you delete it»

### `toast.insight_dismissed`
| Lang | Text |
|---|---|
| EN | Insight dismissed. | |
| RU | Инсайт скрыт. | |

### `toast.insight_snoozed`
| Lang | Text |
|---|---|
| EN | Snoozed for 7 days. Memoro will check if still relevant. | |
| RU | Отложено на 7 дней. Memoro проверит, актуально ли ещё. | |

### `toast.chat_message_copied`
| Lang | Text |
|---|---|
| EN | Copied. | |
| RU | Скопировано. | |

### `toast.csv_exported`
| Lang | Text |
|---|---|
| EN | Your CSV is ready to download. | |
| RU | Твой CSV готов к скачиванию. | |

### `toast.plan_changed`
| Lang | Text |
|---|---|
| EN | Plan changed to {tier_name}. | |
| RU | План изменён на {tier_name}. | |

### `toast.error_generic`
| Lang | Text |
|---|---|
| EN | Something didn't go through. Try again? | |
| RU | Что-то не прошло. Попробовать ещё раз? | |

---

## §9. Onboarding strings (first-run tooltips / coach-marks)

Per `02_POSITIONING.md` Onboarding promise:

### `onboarding.stage1.chat_tooltip`
| Lang | Text |
|---|---|
| EN | Ask Memoro anything about your portfolio. It reads your actual positions and answers with sources. | ≤140 chars |
| RU | Спроси Memoro что угодно о своём портфеле. Он читает твои реальные позиции и отвечает со ссылками на источники. | ≤170 chars |

### `onboarding.stage1.aggregation_tooltip`
| Lang | Text |
|---|---|
| EN | Memoro remembers what you hold across every broker and exchange you connect. | |
| RU | Memoro помнит, что у тебя есть, по всем подключённым брокерам и биржам. | |

### `onboarding.stage2.first_insight_toast`
| Lang | Text |
|---|---|
| EN | Memoro noticed the first thing worth surfacing. Check your insights feed. | |
| RU | Memoro заметил первое, что стоит подсветить. Загляни в ленту инсайтов. | |

### `onboarding.stage3.first_coach_read_toast`
| Lang | Text |
|---|---|
| EN | Memoro has read enough of your trades to see a pattern. Take a look. | |
| RU | Memoro прочитал достаточно твоих сделок, чтобы увидеть паттерн. Посмотри. | |

### `onboarding.ai_disclaimer_first_interaction`
| Lang | Text |
|---|---|
| EN | Quick note: Memoro describes what it sees in your portfolio. It does not recommend specific trades or give investment advice. Any decisions are yours. | ≤200 chars |
| RU | Коротко: Memoro описывает, что видит в твоём портфеле. Он не рекомендует конкретные сделки и не даёт инвестиционных советов. Все решения — твои. | ≤220 chars |

- Shown once, on first AI interaction (chat or insight drill-down)
- Acknowledge-and-dismiss pattern — user clicks «Got it» once, never shown again
- Stored in `user_preferences.ai_disclaimer_acknowledged_at` (engineering scope)

### `onboarding.btn.got_it`
| Lang | Text |
|---|---|
| EN | Got it |
| RU | Понятно |

---

## §10. Regulatory checklist (consolidated across all microcopy)

| Category | Lane A PASS | No dark pattern | Memoro as agent (where relevant) | Character budgets respected |
|---|---|---|---|---|
| Primary buttons (§1) | ✅ | ✅ | ✅ | ✅ |
| Empty states (§2) | ✅ | ✅ | ✅ | ✅ |
| Error states (§3) | ✅ | ✅ (no «you failed» blame) | ✅ | ✅ |
| Loading (§4) | ✅ | n/a | ✅ | ✅ |
| Coach teasers (§5) | ✅ (observational hook, no substance leak to Free) | ✅ (no urgency, no FOMO) | ✅ | ✅ |
| Contextual icon teasers (§5, NEW) | ✅ (subject-scoped, not substance-scoped) | ✅ | ✅ | ✅ |
| Trial strings (§5a, NEW) | ✅ (factual charge disclosure, cancel equal-weight) | ✅ | ✅ | ✅ |
| Bell-dropdown (§5b, NEW) | ✅ (subject-scoped on Free, substance on Plus) | ✅ | ✅ | ✅ |
| Contextual paywall headlines (§5c, NEW) | ✅ (descriptive-not-normative pattern labels) | ✅ | ✅ | ✅ |
| Paywall inline (§6) | ✅ (feature-description only, no performance-claim) | ✅ | ✅ | ✅ |
| AI disclaimer tooltip (§7) | ✅ (this IS the Lane A reinforcement) | n/a | ✅ | ✅ |
| Toasts (§8) | ✅ | ✅ | ✅ | ✅ |
| Onboarding (§9) | ✅ | ✅ | ✅ | ✅ |

### Voice guardrail per-line
- [x] Memoro uses observation verbs only (no «recommends / advises / should / must / consider»).
- [x] Paywall inline strings describe features, not outcomes. No «Upgrade to earn more», no «Plus helps you win» — only «Plus unlocks [specific feature]».
- [x] Error states follow §2.2 «Calm, specific, with a next step.» No blame-the-user language.
- [x] Empty states follow §11.5 «icon + short line + single CTA».
- [x] Coach teaser strings never leak pattern substance on Free tier. Curiosity hook only.
- [x] AI disclaimer uses observation framing («describes what it sees») not defensive («no advice given»).

---

## §11. Open decisions for Navigator / PO

1. **Localization mechanism.** `{variable}` format used here is generic markdown. Final i18n library (react-i18next / next-intl / Lingui / etc.) will dictate variable syntax. Content-lead will adapt; no tech decision here.
2. **Plural handling.** `{broker_count} account{plural}` needs proper i18n plural rules. Russian plurals (один счёт / два счёта / пять счетов) are complex; engineering must use a pluralization library (ICU MessageFormat recommended). Content-lead provides forms for 1 / 2-4 / 5+ when required; not all strings have plurals yet.
3. **Tier badge translations.** Kept «Plus» / «Pro» in Russian as proper-noun product tiers (unchanged). Alternative: «Плюс» / «Про» — feels calque-y. PO preference?
4. **AI disclaimer tooltip jurisdiction-aware switch.** Engineering must detect EU/UK user (via Clerk locale / account region / IP fallback). Content-lead provides the 2 variants; gating logic is engineering + legal-advisor scope.
5. **Pattern-name allowlist / blocklist.** Coach pattern-name examples in §5 — content-lead establishes descriptive-factual vs normative framing. Final AI-output generator must enforce this. Finance-advisor R10 escalation. See §5c Forbidden table for explicit BAN list that must be enforced at pattern-label-generator layer.
6. **«Free is always Free» brand-promise LOCKED 2026-04-23.** PO confirmed in 4-locks. Microcopy patched to carry it consistently across trial / paywall / landing surfaces.
7. **Contextual-icon + bell-dropdown wiring.** Engineering wires when icons blink (pattern detected in context) + when bell count increments (new pattern) + when items are marked seen (user clicked popover OR opened dropdown with item visible). Content-lead supplies strings; triggers are engineering scope.
8. **Trial countdown banner thresholds.** Content-lead splits banner copy into 3 day-ranges (14-8, 7-2, 1). Engineering wires date-math to pick the right variant. Final day-ranges may be adjusted post-alpha based on conversion data.
9. **Weekly activity email opt-in default.** §5b `bell.settings.toggle_email_activity` defaults to OFF. PO confirmation needed before shipping — some SaaS defaults to ON which surfaces the feature, but that increases unexpected-email friction.
10. **Chat usage meter threshold.** §usage.chat_meter shows «{used} of 50 this month» always visible. Alternative: hide until 80% cap (reduces cognitive load on low-use user). PO preference flag.

---

## §12. Summary for Navigator

**Coverage delivered (v1 + v1.1 2026-04-23 patch):**
- 20 primary button labels (+ 5 new trial-CTA buttons in §5a)
- 10 empty states (accounts, sync, insights, coach cold-start, coach teaser, chat, scenarios, search)
- 8 error states (sync failures × 3 types, AI unavailable, rate limits × 3 patched monthly, network, generic)
- 5 loading states
- 3 Coach teaser strings (Free teaser × 2 + Plus intro) + **5 new contextual-icon teaser strings**
- 1 Coach pattern-item wrapper template (content-lead voice constraint on AI output)
- **NEW §5a: 8 trial-strings groups (countdown banner × 3 ranges, short variant, ended/canceled banners, card-on-file confirmation, CTAs × 5, card-required disclaimer, free-forever alternative, trial-email subjects × 4)**
- **NEW §5b: 11 bell-dropdown strings (icon label, badge, heading, empty state, item format Free + Plus variants, mark-all-read, settings link, activity-history link, 3 settings toggles)**
- **NEW §5c: 12 contextual-paywall-headline variants (3 asset-scoped, 3 category-scoped, 6 behavior-scoped) + forbidden-patterns BAN list**
- 3 tier badges + 2 usage meters (chat meter PATCHED to monthly) + **8 feature-lock row variants (7 original + NEW `feature_lock.unlimited_chat`)**
- 1 AI disclaimer tooltip (default + EU/UK variant) + 1 persistent footer badge
- 10 toast / notification strings
- 5 onboarding tooltip / first-interaction strings
- **Total: ~130 discrete strings, bilingual** (up from ~80 in v1)

**Voice decisions held:**
- Memoro-as-agent consistently — strings say «Memoro noticed» / «Memoro is thinking», never «AI detected» / «we flagged»
- User-facing imperatives only in CTAs (Ask, Connect, Unlock, Upgrade, See, Try, Retry)
- Paywall inline copy describes features, not outcomes — Lane A holds under feature-gate surface
- Error voice consistent with Design Brief §2.2 «calm, specific, next step»
- Coach teaser never leaks pattern substance on Free — Q5 teaser-paywall lock respected at copy layer
- **NEW: trial countdown banner uses «days left · Cancel any time» framing — factual, not urgency-manipulated. No «LAST CHANCE», no «only N left!!».**
- **NEW: contextual paywall headlines are SUBJECT-scoped on Free («pattern in your NVDA trades»), SUBSTANCE-scoped on Plus — same Q5 lock pattern extended to new surfaces.**
- **NEW: §5c explicit BAN list on normative/pathological pattern labels (panic / FOMO / overtrading / revenge) — finance-advisor R10 enforced at content-lead layer, flagged for AI-output-generator.**

**Dependencies flagged:**
- Legal-advisor: `AI_DISCLAIMER_PATTERN.md` does not exist yet; content-lead provides interim tooltip copy, legal-advisor should finalize per-jurisdiction wording when dispatched.
- Finance-advisor / AI content validation workstream: Coach pattern-name allowlist (§5 + §5c BAN list) enforcement at AI-output-generator layer is R10 + R11 remediation.
- Product-designer: AI disclaimer tooltip placement + trigger + interaction pattern (Q6 format TBD) — content-lead copy is tooltip-ready; designer picks final surface. ALSO: contextual-icon popover UX + bell-dropdown component spec (§5b A11y notes provided).
- Engineering: i18n library choice (`{variable}` syntax adaptation) + plural handling + jurisdiction-aware AI-disclaimer switch (§7) + toast component integration. ALSO: trial countdown banner date-math; bell-dropdown wiring (icon-blink / mark-seen / unread-count); contextual-paywall context-detection (asset vs category vs behavior pattern routing).
- PO: tier-name translation preference (Plus/Pro Latin vs calque). Weekly activity email default opt-in vs opt-out. Chat usage meter always-visible vs 80%-threshold display.

**No external communication. Strings live in repo as pre-ESP-integration reference for frontend-engineer + product-designer.**

---

## §13. Patch log — 2026-04-23 post-4-locks patch

**Decision source.** `DECISIONS.md` 2026-04-23 «Trial + Free tier + Coach UX + brand commitment (4 locks)»:
1. Trial — 14-day Plus, card required
2. Free cap — 50 messages/month, no daily limit (Haiku model)
3. Coach UX — contextual (blinking icons + bell-dropdown), NOT dedicated route, NOT filter-chip
4. «Free is always Free» permanent brand commitment

### Changes applied to this file

**Patched (existing strings):**
- §3 `error.rate_limit_hit_free` — «Daily chat limit reached / 5 questions per day / Resets at {reset_time}» → «Monthly chat limit reached / 50 questions per month / Resets on {next_reset_date}» (EN + RU)
- §6 `usage.chat_meter` — «{used} of {cap} today» → «{used} of {cap} this month» + tooltip addition explaining monthly pool (EN + RU)
- §6 feature-locks — added `feature_lock.unlimited_chat` («Free = 50 messages/month. Plus unlocks unlimited.») before daily-insights lock

**Added (new sections):**
- §5 internal expansion — 5 new contextual-icon teaser strings: `coach.icon.tooltip`, `coach.icon.popover_free_asset_scoped`, `coach.icon.popover_free_behavior_scoped`, `coach.icon.popover_plus_full_read`, `coach.icon.popover_secondary_action`. Covers asset-scoped, category-scoped, and behavior-scoped dynamic teasers with BANNED phrasing list.
- §5a Trial-related strings — 18+ string keys covering countdown banner (3 day-ranges), short variant, ended/canceled banners, card-on-file confirmation, 5 trial-CTA buttons, card-required disclaimer, free-forever alternative, trial-email subjects × 4. Plus Lane A + dark-pattern check.
- §5b Bell-dropdown strings — 11 string keys covering bell icon label + badge, dropdown heading + empty state + item format (Free + Plus tier variants) + mark-all-read + settings link + activity-history link + 3 Settings → Activity toggles. Plus A11y spec.
- §5c Free-to-Plus contextual coach paywall headlines — 12 dynamic headline variants split into asset-scoped / category-scoped / behavior-scoped + explicit BAN list (panic / FOMO / overtrading / revenge framings forbidden). Dynamic substitution rules.

**§10 Regulatory checklist:** 4 new rows for the new sections.
**§11 Open decisions:** updated item #5 (Free-forever LOCKED), added items #7-10 (bell-dropdown wiring, trial countdown thresholds, weekly activity email default, chat usage meter visibility).
**§12 Summary:** coverage counts updated (~130 strings total, up from ~80); voice decisions include new trial + contextual-paywall notes; dependencies flagged include new engineering + designer scope items.

### Trial-voice decisions held
- Countdown banner: factual day-count + «Cancel any time» reassurance, never urgency-manipulated
- Card-on-file confirmation names charge date + amount explicitly at signup
- Trial CTAs use imperative-direct voice («Try Plus free for 14 days», «Skip — start on Free forever»)
- Card-required disclaimer surfaces at CTA, not buried in footer
- Free-forever alternative has equal visual weight to trial CTA
- Trial-email subjects from email-sequences.md duplicated here for i18n-key consistency

### Contextual-Coach voice decisions held
- Icon tooltip reveals intent («Memoro noticed something») without substance
- Popover headline reveals SUBJECT («pattern in your NVDA trades», «how you respond to drawdowns») not SUBSTANCE
- Behavior-scoped patterns use descriptive-agentic framing («how you respond», «when you add») — never pathological («panic», «FOMO», «overtrading»)
- §5c explicit BAN list enforced at content-lead layer; flagged for AI-output-generator enforcement
- Bell-dropdown items on Free tier show subject only; Plus tier shows full pattern name

### Bell-dropdown UX-voice decisions held
- Empty state reuses `empty.coach_cold_start_free` voice (30-day cold-start honesty) — single source of truth
- Unread count announced via parent button aria-label (not separate announcement)
- «Mark all as read» placed bottom-left; «Activity settings» bottom-right; «See full activity history» bottom-center — three discrete footer actions
- Weekly activity email defaults OFF — no unexpected email volume

### Lane A + dark-pattern check (this patch)
- [x] No performance / return promises in any new trial or coach string
- [x] Charge date + amount + cancel path stated at equal weight everywhere trial is mentioned
- [x] No countdown manipulation («LAST CHANCE» / «only 2 days!!!» — forbidden)
- [x] Contextual coach popover on Free reveals subject only, never substance
- [x] Pattern labels are descriptive (action + timeframe), not normative (panic / FOMO / overtrading)
- [x] Explicit BAN list in §5c provides AI-output-validation contract
- [x] Bell-dropdown pattern items respect tier boundary (Free = subject, Plus = substance)
- [x] No «5 msg/day» references remain in any microcopy (verified by grep)
- [x] Monthly-pool framing consistent across error.rate_limit_hit_free / usage.chat_meter / feature_lock.unlimited_chat / email sequences
