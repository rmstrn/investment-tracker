# Product Owner Handoff — investment-tracker

**Что это:** документ для передачи состояния между сессиями Claude. Когда чат лагает / переполнен контекстом / теряется фокус — открыть новый чат, дать промт (внизу документа), Claude поднимает весь проект по этому файлу и доп.документам.

**Last updated:** 2026-04-20 (поздний вечер — GAP REPORT B3-ii получен, 6 decisions приняты, split B3-ii-a/b accept, B3-ii-a в write-phase, TASK_05 cleanup параллельная сессия)

---

## 0. Кто я, что за проект

**Ruslan, Product Owner.** Не разработчик. Оркеструю параллельные Claude Code (CC) сессии — каждая CC-сессия работает свой PR в своём worktree (D:\investment-tracker-b3, и т.д.). Главный документный репозиторий — `D:\СТАРТАП\docs\`.

**Investment-tracker** — AI-native агрегатор инвест-портфеля. Стек: Next.js 15 (web), Go 1.25 (Core API), Python (AI Service), Postgres (Neon), Redis (Upstash), Clerk auth, Stripe billing, Fly.io deploy. MVP для EU retail investors.

**Полный brief:** `D:\СТАРТАП\docs\00_PROJECT_BRIEF.md`.

---

## 1. Текущий статус (2026-04-20)

### Волна 1 — ✅ закрыта
TASK_01 (monorepo+CI), TASK_02 (design system), TASK_03 (API contract + schema).

### Волна 2 — 🚧 в работе
- **TASK_04 Core API (Go):** 6 of ~8 PRs merged.
  - ✅ A (skeleton), B1, B2a, B2b, B2c (read path), **B3-i (write path mutations, 2026-04-19, SHA `11d6098`, PR #40)**
  - 🚧 B3-ii next — AI mutations (7 handlers) + SSE reverse-proxy + tier rate-limit, anchor 2000-2500 LOC. **CC делает pre-flight audit прямо сейчас.**
  - ⏳ B3-iii — write path completion + webhook_events migration
  - ⏳ PR C — deploy: Dockerfile + fly.toml + k6 smoke + runbook (см. `PR_C_preflight.md`)
- **TASK_05 AI Service (Python):** ✅ merged (PR #34). Сейчас 404-swallows пробелы Core API. Flip на strict propagation — после B3-iii (см. `RUNBOOK_ai_flip.md`).

### Волна 3 — ⏳ ждёт закрытия TASK_04
TASK_06 Broker Integrations, TASK_07 Web Frontend.

### Волна 4 — 🧊 отложено
TASK_08 iOS (нужен Mac + Xcode, отдельный репо).

---

## 2. Ключевые PR SHAs

| PR | Scope | SHA | Дата |
|---|---|---|---|
| **main tip** | docs: PO_HANDOFF + merge-log entry (CC-landed для clean tree перед B3-ii pre-flight) | `e96f6de` | 2026-04-20 |
| prev tip | docs sync (post-#40 PO handoff pass, 14 файлов) | `84465f7` | 2026-04-20 |
| — | docs commit pre-rebase (local-only, осиротел после `git pull --rebase`) | `8532301` | 2026-04-20 |
| #40 | B3-i: 19 handlers + SETNX idempotency + asynqpub wrapper + X-Async-Unavailable header | `11d6098` | 2026-04-19 |
| pre-#40 fix-up | `Publisher.Enabled()` + эмиссия `X-Async-Unavailable: true` в 5 call sites | `61d6c08` | 2026-04-19 |
| #34 | TASK_05 AI Service merged | — | — |
| #39 | B2c closure | `fb16525` | — |
| #30 | TASK_03 API contract + schema | `08f44c2` | — |
| #29 | TASK_02 design screenshots | — | — |

> **Notes на расхождение SHA:**
> - `e96f6de` vs `84465f7` — PO-Claude правил PO_HANDOFF + merge-log через Edit; Ruslan не успел сам закоммитить до старта B3-ii. CC при pre-flight увидел uncommitted changes, не смог switch на feature branch, сам закоммитил+запушил → `e96f6de`. Контент легитный, проверен через `git show e96f6de --stat` (только 2 docs-файла, 285 insertions). Gate `tip mismatch` в § 9 сработал корректно: CC STOP'нул и запросил явный ack, Ruslan дал «go, expected = e96f6de».
> - `8532301` vs `84465f7` — local-commit `8532301` был создан на старом base (pre-B3-i) до `git pull --rebase`. После rebase SHA rewrite → `84465f7`. В `origin/main` живёт только `84465f7`; `8532301` осиротел локально (виден в reflog).
> - **Pattern:** Ruslan коммитит свои docs-правки **до** команды start CC. Иначе CC закоммитит за него, tip уедет, gate сработает, потеряем 5-10 минут на ack-цикл.

Полный лог — `merge-log.md`.

---

## 3. Как я работаю с CC (правила орекстровки)

**Cycle per PR:**
1. CC анонсирует pre-flight audit на слайс.
2. CC присылает GAP REPORT: scope, CI status (ожидаем 8/8 green), LOC count, closed/opened TDs, scope-adjacent changes, контракт подтверждён.
3. Я (PO-Claude) оцениваю: есть ли риск? что докинуть? дать ли отмашку?
4. Ruslan мержит (squash-only политика; admin-bypass только по TD-006).
5. PO-Claude делает post-merge docs pass: merge-log + TECH_DEBT + TASK файл + README.
6. Ruslan ack'ит → CC стартует следующий PR.

**Squash-only policy.** История на main — только squash-коммиты. Rebase-merge и merge-commits запрещены.

**Admin-bypass policy (TD-006):** только при CI-outage или hotfix после P1 incident declaration. Логируется в `merge-log.md` с причиной.

**State hygiene:** каждая новая сессия **ВЕРИФИЦИРУЕТ через Read** что файл реально на диске, прежде чем подтверждать обновление. Прецедент был: предыдущая сессия «обновила» 10+ файлов, но большинство не сохранилось — пришлось восстанавливать.

---

## 4. Active TDs (newest first)

| ID | Priority | Description | Pair / Links |
|---|---|---|---|
| TD-047 | **P1 pre-GA** | CSVExport tier flag — хрупкая корреляция с AIMessagesDaily ≥ 100. Ломается на trial-экспериментах. | standalone |
| TD-046 | P2 | Aggregator provider clients (SnapTrade / Plaid / broker APIs) | inherits → TASK_06 |
| TD-045 | P1 | Hard-delete worker must re-check `deletion_scheduled_at IS NOT NULL` перед wiping | **⇔ TD-041** (физически неразделимы) |
| TD-041 | P1 | `hard_delete_user` worker consumer (7-day delayed task) | **⇔ TD-045** |
| TD-039 | P2 | CSV export worker consumer | будет после deploy workers (PR D) |
| TD-007 | P3 | oapi-codegen OpenAPI 3.1 nullable upstream bug — preprocessor `type: [X, "null"]` → 3.0 `nullable: true` | workaround works |
| TD-006 | — | Admin-bypass policy (not a debt, policy document) | see merge-log.md |

**Resolved by PR #40:**
- TD-R011 — SETNX idempotency lock (was: race window между key-check и processing)
- TD-R021 — asynq publisher wrapper + /market/quote cache-miss enqueue

**Proposed at PR C time (docs draft ready):**
- TD-048 env KEK → cloud KMS (AWS KMS / GCP KMS)
- TD-049 multi-region deploy
- TD-050 APM/trace correlation (OpenTelemetry → Tempo/Datadog)
- TD-051 per-tenant rate limits (Redis token bucket)
- TD-052 blue-green deploys

Полный файл: `TECH_DEBT.md`.

---

## 5. Active decisions quick-ref

| Topic | Decision | Почему |
|---|---|---|
| Go version | 1.25+ | `go tool` pinned dev deps (sqlc, oapi-codegen) |
| API framework | **oapi-codegen spec-first** (NOT huma v2) | фронт/iOS качают клиенты из той же spec — риск рассинхрона в code-first |
| Money | shopspring/decimal | никогда float64 |
| Encryption | AES-256-GCM envelope | BYTEA blob: `[kek_id(1) \|\| nonce_outer(12) \|\| encrypted_dek(32+16) \|\| nonce_inner(12) \|\| ciphertext \|\| tag(16)]`; KEK в env (`KEK_MASTER_V1` + `KEK_PRIMARY_ID`) |
| Tiers | `tiers.Limits` struct + `RequireTier(flag func(l TierLimits) bool)` middleware | ❌ anti-pattern: `if user.Tier == "pro"`; ✅ `if tiers.For(user.Tier).TaxReports` |
| Idempotency | SETNX lock: `SET idem:{key} pending NX EX 10` → 409 IDEMPOTENCY_IN_PROGRESS; payload cached 24h | TD-R011 closed |
| Pagination | Cursor-based (base64), не offset | scale для transactions |
| IDs | UUID v7 (не v4) | монотонные, лучше для индексов |
| Auth | dual-mode: Clerk JWT OR `CORE_API_INTERNAL_TOKEN` + X-User-Id header | для AI Service / workers |
| SSE | `httputil.ReverseProxy` + `FlushInterval: -1` | typing-эффект не буферизуется |
| Clerk webhooks | svix SDK | идемпотентность через `webhook_events (source, event_id)` PK + ON CONFLICT DO NOTHING |
| Stripe webhooks | stripe-go SDK | аналогично |
| Queue | asynq (Redis-backed); queues: default/sync/prices/insights/exports/deletions | `asynqpub.Enabled()` в проде пока `false` (workers не задеплоены) |

Полный ADR лог: `DECISIONS.md`.

---

## 6. Scope-cut headers (all 10)

Core API эмитит header когда фича частично недоступна — клиент рендерит degraded state. **Всё задокументировано в `02_ARCHITECTURE.md`.**

| Header | Trigger |
|---|---|
| X-Clerk-Unavailable | Clerk webhook не доставлен → stale user state |
| X-Search-Provider | Polygon search rate-limited → cached fallback |
| X-Benchmark-Unavailable | /portfolio/performance без S&P сравнения |
| X-Analytics-Partial | /portfolio/allocation неполный (missing price) |
| X-Withholding-Unavailable | dividend withholding tax не посчитан |
| X-Tax-Advisory | /insights генерит tax advice — UI должен показать disclaimer |
| X-FX-Unavailable | FX курс не найден → позиция в native currency |
| X-Partial-Portfolio | один из accounts не засинкан |
| X-Export-Pending | CSV export в очереди (async) |
| X-Async-Unavailable | asynq publisher disabled (workers не задеплоены) — **эмитится сейчас на проде** |

---

## 7. File map

| Файл | Назначение |
|---|---|
| `README.md` | Индекс + wave status |
| `00_PROJECT_BRIEF.md` | Концепция, аудитория, USP |
| `01_TECH_STACK.md` | Стек технологий |
| `02_ARCHITECTURE.md` | Архитектура + модель данных + scope-cut headers + patterns |
| `03_ROADMAP.md` | MVP план по месяцам |
| `04_DESIGN_BRIEF.md` | Дизайн-система v1.1 |
| `DECISIONS.md` | Engineering ADR log |
| `TECH_DEBT.md` | Tech debt tracker |
| `merge-log.md` | Журнал merge-событий + policy |
| `CLAUDE_CODE_PROMPTS.md` | Шаблоны для CC сессий |
| `RUNBOOK_ai_flip.md` | AI Service 404-swallow → strict flip (после B3-iii) |
| `PR_C_preflight.md` | GAP-анализ финального PR C (Fly.io deploy) |
| `PO_HANDOFF.md` | **ЭТОТ ФАЙЛ** — handoff между сессиями |
| `TASK_01..08_*.md` | Таски по компонентам |

---

## 8. Known gotchas / прецеденты

1. **State loss между сессиями.** Было: сессия «обновила» 10+ файлов, но ~80% на диске не было. Защита: всегда Read перед confirm.
2. **`gh pr merge --delete-branch` может упасть** на local-checkout если worktree уже на main. Remote-side мерж всё равно проходит — local cleanup отдельно: `git worktree remove --force D:/investment-tracker-b3 && git worktree prune`.
3. **X-Async-Unavailable «implied» vs emitted.** В GAP REPORT PR #40 CC сначала написал что header «implied», при probing выяснилось — не эмитился. Фикс: pre-merge commit 61d6c08. Урок: на scope-cut header'ы требовать явной демонстрации, не подразумеваний.
4. **Ghost files в README.** `merge-log.md`, `RUNBOOK_ai_flip.md`, `PR_C_preflight.md` были проиндексированы, но на диске отсутствовали. Фикс: все созданы 2026-04-20.
5. **TASK_08 был Волна 2** — устаревшая метка, поправлено на Волна 4 (deferred) для консистентности с README.

---

## 9. Next action (при входе в новый чат)

**Статус (2026-04-20, поздний вечер):** GAP REPORT от CC получен, 6 decisions приняты, B3-ii split на **B3-ii-a + B3-ii-b** (~1500 LOC каждый, последовательно). B3-ii-a в write-phase. Параллельно открывается **вторая CC сессия TASK_05 cleanup** — удалить дублирующий `record_ai_usage` вызов из Python (блокер для B3-ii-b merge, не для B3-ii-a).

### Решения по B3-ii (зафиксировано для audit trail)

1. **`POST /ai/insights/generate` = Path B (sync inline).** AI Service `/internal/insights/generate` синхронный 5-30s. HTTP 202 + body `{status: "done", insight_id: "..."}`. Не async через asynq (publisher disabled в prod → job потерялся бы).
2. **AI message caps = `tiers.Limit` на сегодня (Free=5, Plus=50, Pro=unlimited/nil).** Три источника расходятся (Brief: 5/unlim, TASK_04 doc: 3/20/100, код: 5/50/nil) — доверяем коду. Brief + TASK_04 doc подчистим docs-pass'ом **после** B3-ii merge.
3. **`tiers.Limit.AIChatEnabled bool` = true для всех тарифов в MVP.** Forward-compat под будущий product change. Middleware возвращает 403 TIER_LIMIT_EXCEEDED + `Upgrade-To-Tier` header если false (dead code сегодня).
4. **Split B3-ii-a / B3-ii-b — ACCEPT.** LOC прогноз ~2900, anchor 2500 → режем:
   - **B3-ii-a:** AI Service HTTP client foundation + rate-limit middleware + 5 handlers (POST/DELETE /ai/conversations, POST /ai/insights/generate, /insights/{id}/dismiss, /insights/{id}/viewed). ~1500 LOC. Можно мержить независимо.
   - **B3-ii-b:** POST /ai/chat (sync) + POST /ai/chat/stream (SSE proxy + tee + persist) + SSE parser pkg. ~1500 LOC. **Зависит от B3-ii-a** (shared client + middleware).
5. **`ai_usage` owner = Core API single-writer.** AI Service **перестаёт** писать `ai_usage` (удаляем `record_ai_usage` вызов в параллельной TASK_05 cleanup PR). Core API пишет **синхронно** в DB transaction после `message_stop` в `/ai/chat/stream` handler. Причина: dual-write = дубликаты в ledger = биллинг x2. См. `DECISIONS.md`.
6. **Paranoid-fallback enqueue для /generate — НЕТ.** KISS, single codepath.

### SSE proxy дополнения (B3-ii-b acceptance criteria)

- **Failure mid-stream:** skip incomplete assistant message целиком + log incident со всеми собранными chunks. Не пиши partial — confusит AI на следующем turn + user видит `...`.
- **SSE parser на TCP-split frames:** ≥3 unit tests на split-boundary cases (включая split по середине JSON data payload).
- **Heartbeat:** single-writer goroutine через channel, parser игнорирует SSE comment (`:` префикс). Каждые 15s idle.
- **401/403 от AI Service → 502 BAD_GATEWAY клиенту** + critical log + Sentry alert. Не пропагируй 401 клиенту — это bug в Core API internal token config, не user error.
- **Content flatten:** join `content[]` blocks с `\n\n` (Anthropic standard). Single-block = `content[0].text`.
- **Rate-limit INCR+EXPIRE:** single Lua eval (atomic round-trip), не pipeline.
- **`X-Request-Id` пропагация** Core → AI через header (для Sentry correlation). SSE error event payload с request_id — **TD-048, не блокер** для B3-ii.

### Новые TDs (proposed, логируются в TECH_DEBT.md)

- **TD-048** — SSE error event payload bump: add `request_id` field (cross-service: AI Service + Core API).
- **TD-049** — SSE Last-Event-ID resume protocol (MVP без resume — reconnect = new message).
- **TD-050** — `/ai/insights/generate` Path B handler hangs 5-30s (long timeout vulnerable к LB idle disconnect; future async via TASK_06 worker).
- **TD-051** — Tee SSE parser в Core API duplicates AI Service's SSE knowledge (drift risk).
- **TD-052** — Concurrent chat race window (pre-increment OK для MVP, future = reserve+commit).

### Где что происходит прямо сейчас

| Сессия | Что | ETA |
|---|---|---|
| CC chat #1 (B3-ii) | B3-ii-a write-phase (5 handlers + client + middleware) | 2-3 дня |
| CC chat #2 (TASK_05) | Удалить `record_ai_usage` из Python AI Service (небольшой PR, 50-150 LOC) | 1-2 дня |
| PO (Ruslan) | Координация обеих сессий, финальный docs commit вечером | ongoing |

### Завтрашний старт чек-лист

1. Проверить прогресс B3-ii-a: что CC успел, блокеры, SHAs новых коммитов в feature branch.
2. Проверить план-дельту TASK_05 CC (если вчера успел её дать) или дождаться.
3. Передать progress reports PO-Claude'у.
4. Если TASK_05 CC ещё не стартовал — открыть (промт внизу, см. § 10).
5. Фоновый мониторинг: оба PR не должны конфликтовать (разные файлы — Go vs Python).

**После B3-ii-a merge → B3-ii-b (ждёт TASK_05 cleanup merged) → B3-iii → PR C** (см. `PR_C_preflight.md`) → prod live → AI Service flip (см. `RUNBOOK_ai_flip.md`).

---

## 10. Draft response to CC in flight (последний ответ, который готовился)

На случай если нужно отправить CC прямо сейчас — вот что было подготовлено как реакция на его «Жду отмашки» после мержа #40:

> Worktree cleanup моя забота (`git worktree remove --force D:/investment-tracker-b3 && git worktree prune` + `git pull --ff-only` в D:\СТАРТАП).
>
> Docs pass закрыт полностью. Зелёный свет на B3-ii. Anchor 2000-2500 LOC.
>
> Мой POV на pre-flight items (см. секцию 9 этого документа — детально расписаны все 9 пунктов).
>
> Жду GAP REPORT.

---

## 10.5 Промт для параллельной TASK_05 cleanup сессии

Скопировать в новый CC чат. Scope — удалить `record_ai_usage` вызов из Python AI Service. Блокер для B3-ii-b merge.

```
Привет. Я Ruslan, Product Owner проекта investment-tracker
(AI-инвест-трекер: Next.js web + Go Core API + Python AI Service).
Главный док-репозиторий: D:\СТАРТАП.

У нас параллельно идёт TASK_04 B3-ii-a в другом CC чате (Go Core API,
свой worktree). Я прошу тебя сделать МАЛЕНЬКУЮ правку в TASK_05
(Python AI Service, apps/ai/...).

Контекст и все решения — в:
  D:\СТАРТАП\docs\PO_HANDOFF.md (прочти целиком первым делом)

Scope правки (ничего другого не трогать):

В AI Service сейчас есть вызов core_api.record_ai_usage(...)
после каждого Anthropic response (см. TASK_05 § 7 и код
в apps/ai/src/ai_service/... — скорее всего в handlers chat/stream
и insights/generate, и в клиенте core_api.py).

Этот вызов нужно УДАЛИТЬ полностью. Причина: дубликат учёта.
Core API теперь сам пишет ai_usage в своей DB transaction после
SSE close (это делается в TASK_04 B3-ii-b). Если оба пишут —
ledger дублируется, биллинг завышен x2.

Что сделать:
1. Найти все call sites `record_ai_usage` / `record_ai_usage_async`
   и любые связанные с записью usage в Core API.
2. Удалить вызовы. Удалить метод в core_api.py клиенте если он
   больше нигде не используется.
3. Удалить тесты которые mock'ают этот вызов (или обновить если
   они проверяют полный flow — тогда просто убрать expectation
   на usage call).
4. Добавить короткий комментарий на месте удалённого вызова
   (один раз, в главной точке flow):
   # ai_usage tracking owned by Core API (TASK_04 B3-ii-b).
   # See docs/PO_HANDOFF.md § 9 (ai_usage dual-write resolution).
5. Запустить тесты локально, убедиться что всё зелёное.
6. Открыть PR — название:
   "TASK_05: remove Core API ai_usage call (dual-write fix)"
   В описании сослаться на TASK_04 B3-ii-b dependency.

Что НЕ делать:
- Не трогать бизнес-логику chat/stream или insights/generate.
- Не трогать SSE error events (TD-048 — отдельная работа позже).
- Не менять ничего кроме удаления usage-вызовов.
- Не переписывать core_api.py клиент — только удалить ненужный метод.
- Не добавлять новые зависимости.

Размер: ожидаю 50-150 LOC touched, очень маленький PR.

Timing: нужно смерджить до того как основной CC дойдёт до
B3-ii-b (через ~3 дня). Желательно за 1-2 дня.

Мой стиль общения (из PO_HANDOFF):
- Русский, коротко, без overformatting.
- Decisions-first: сначала что делаешь, потом почему.
- Видишь риск — говори сразу.
- Верифицируй каждый Edit через Read (state loss бывал).

Первым делом: прочти PO_HANDOFF.md, README.md, TASK_05_ai_service.md.
Потом grep'ни по apps/ai/ все call sites record_ai_usage. Потом дай
мне короткий план-дельту (что удалить, где, размер) до write-phase.
```

---

## 11. Мой стиль общения (для нового Claude)

- **Русский по умолчанию**, английские технические термины OK.
- **Коротко, без over-formatting** (минимум bold/headers/bullets, prose-first).
- **Decisions-first:** сначала что делать, потом почему.
- **Видишь риск — говори сразу**, не жди вопроса.
- **Автономен в scope**: «как считаешь нужное» — значит доверяю решать самому.
- **Pushback welcome** — если вижу что ты ошибся или CC ошибся, скажу; жду того же.
- **Файлы создавать в `D:\СТАРТАП\docs\`**, scratch в outputs.
- **Links через `computer://`** когда расшариваю файл.
- **TodoList** использовать активно для многошаговой работы.
- **Всегда верифицировать через Read** перед confirm обновления — state loss уже был.

---

## 12. Continuation prompt (копировать в новый чат)

```
Привет. Я Ruslan, Product Owner проекта investment-tracker
(AI-инвест-трекер: Next.js web + Go API + Python AI Service).
Оркеструю параллельные Claude Code сессии — каждая CC работает
свой PR в отдельном worktree. Главный проект: D:\СТАРТАП.

Предыдущая сессия забагала (context window). Полный контекст
и handoff — в файле:

  D:\СТАРТАП\docs\PO_HANDOFF.md

Прочти его ПЕРВЫМ ДЕЛОМ. Для фона также пробежись по:

  D:\СТАРТАП\docs\README.md
  D:\СТАРТАП\docs\02_ARCHITECTURE.md
  D:\СТАРТАП\docs\TECH_DEBT.md
  D:\СТАРТАП\docs\merge-log.md

Текущий статус в двух словах:
- PR #40 (B3-i) смержен 2026-04-19 @ SHA 11d6098
- Все доки обновлены, проверено что всё на диске
- Жду GAP REPORT от CC по PR B3-ii (AI mutations + SSE reverse-proxy
  + tier rate-limit, anchor 2000-2500 LOC)
- Приоритеты для B3-ii review разобраны в PO_HANDOFF.md секция 9

Стиль:
- Отвечай по-русски, коротко, без over-formatting
- Decisions-first (что делать → почему)
- Видишь риск — говори сразу
- Файлы создавай в D:\СТАРТАП\docs\
- Верифицируй через Read перед confirm (state loss уже был)

Начни с того, что прочитал PO_HANDOFF.md и скажи готов.
Потом ждём GAP REPORT от CC или мои новые вводные.
```
