# Product Owner Handoff — investment-tracker

**Что это:** документ для передачи состояния между сессиями Claude. Когда чат лагает / переполнен контекстом / теряется фокус — открыть новый чат, дать промт (внизу документа), Claude поднимает весь проект по этому файлу и доп.документам.

**Last updated:** 2026-04-20 (после docs sync push, main @ 84465f7)

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
| **main tip** | docs sync (post-#40 PO handoff pass, 14 файлов) | `84465f7` | 2026-04-20 |
| — | docs commit pre-rebase (local-only, осиротел после `git pull --rebase`) | `8532301` | 2026-04-20 |
| #40 | B3-i: 19 handlers + SETNX idempotency + asynqpub wrapper + X-Async-Unavailable header | `11d6098` | 2026-04-19 |
| pre-#40 fix-up | `Publisher.Enabled()` + эмиссия `X-Async-Unavailable: true` в 5 call sites | `61d6c08` | 2026-04-19 |
| #34 | TASK_05 AI Service merged | — | — |
| #39 | B2c closure | `fb16525` | — |
| #30 | TASK_03 API contract + schema | `08f44c2` | — |
| #29 | TASK_02 design screenshots | — | — |

> **Note на 8532301 vs 84465f7:** local-commit `8532301` был создан на старом base (pre-B3-i) до `git pull --rebase`. После rebase его SHA rewrite → `84465f7`. В `origin/main` живёт только `84465f7`; `8532301` осиротел локально (виден в reflog, но не в истории main). Для audit всегда указываем `84465f7`.

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

**Статус (2026-04-20):** B3-ii зелёный свет дан CC, guidance 4/4 принят без дельт. CC в спячке, ждёт команду «погнали» от Ruslan'а → выйдет с pre-flight audit (scope list, LOC, SSE protocol, tier wire, split-decision if >8 handlers / >2500 LOC). Split-fallback B3-ii-a/b на контингенте.

**Worktree cleanup detection-гейт согласован:** CC при старте B3-ii первым делом делает `git worktree list`. Если `D:/investment-tracker-b3` ещё в списке — STOP, ask for confirmation. Порядок команд для Ruslan'а ДО команды start:
```
git worktree remove --force D:/investment-tracker-b3
git worktree prune
cd D:\СТАРТАП && git pull --ff-only
```

**Ждём pre-flight audit от CC по PR B3-ii.**

Когда придёт, проверить/уточнить:
1. **Scope:** AI mutations (~7 handlers) + SSE reverse-proxy + tier gate rate-limit.
2. **LOC:** anchor 2000-2500. Если объективно не режется — расщеплять на B3-ii-a/B3-ii-b, а не ballooning.
3. **SSE error framing:** стандарт `event: error\ndata: {"code":"...","request_id":"..."}\n\n`. Обязательно `request_id` для корреляции Sentry Core API ↔ AI Service.
4. **Tier gate коды:**
   - `403 TIER_LIMIT_EXCEEDED` — тариф не даёт доступа вообще (ChatEnabled=false например) + header `Upgrade-To-Tier: plus`
   - `429 RATE_LIMIT_EXCEEDED` — дневной cap исчерпан + headers `X-RateLimit-Limit/Remaining/Reset`
5. **Rate-limit counter bump** — в Core API на входе `/v1/ai/chat/stream`, **до** проксирования. INCR в Redis атомарно. Core API owns tier enforcement; AI Service не знает о тирах.
6. **ai_usage ledger-запись** — **СИНХРОННО в DB transaction** в том же Core API handler'е после закрытия SSE. **НЕ через asynq** — `asynqpub.Enabled()==false` в проде, иначе потеряется.
7. **Keep-alive:** `: heartbeat\n\n` каждые 15s (иначе LB/прокси обрывают idle).
8. **`X-Request-Id`** пропагировать Core API → AI Service через header; AI Service логирует.
9. **Client reconnect с `Last-Event-ID`** — MVP без resume-logic, просто новый message. TD на будущее (предложить).

**После B3-ii → B3-iii → PR C** (см. `PR_C_preflight.md`) → prod live → AI Service flip (см. `RUNBOOK_ai_flip.md`).

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
