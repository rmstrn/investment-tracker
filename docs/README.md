# Investment Portfolio Tracker — Project Files

Набор файлов для работы с проектом через несколько параллельных чатов с Claude.

## Структура

```
docs/
├── README.md                    ← вы тут
├── PO_HANDOFF.md                ← handoff между PO-сессиями (читать первым)
├── UI_BACKLOG.md                ← canonical Web UI backlog (Slice 4+, P1/P2/P3)
├── 00_PROJECT_BRIEF.md          ← концепция, аудитория, USP
├── 01_TECH_STACK.md             ← весь стек технологий
├── 02_ARCHITECTURE.md           ← архитектура + модель данных
├── 03_ROADMAP.md                ← план MVP по месяцам + статус волн
├── 04_DESIGN_BRIEF.md           ← дизайн-система v1.1 (source of truth)
├── DECISIONS.md                 ← engineering decisions log (ADR)
├── TECH_DEBT.md                 ← tech debt tracker (P1/P2/P3 legend)
├── merge-log.md                 ← журнал merge-событий + admin-bypass policy
├── RUNBOOK_deploy.md            ← Doppler / Fly / DNS deploy procedure
├── RUNBOOK_ai_flip.md           ← AI Service 404-swallow → strict (после prod soak)
├── PR_C_preflight.md            ← pre-flight GAP-анализ PR C (Fly.io deploy)
├── CLAUDE_CODE_PROMPTS.md       ← общие шаблоны для CC сессий
├── CC_KICKOFF_api_cors.md       ← reference template (CC owns merge+cleanup)
├── CC_KICKOFF_b3iii.md          ← ✅ merged PR #46
├── CC_KICKOFF_pr_c.md           ← ✅ merged PR #49
├── CC_KICKOFF_web_root_redirect.md ← ✅ merged PR #53
├── CC_KICKOFF_task07_slice1.md  ← ✅ merged PR #45
├── CC_KICKOFF_task07_slice2.md  ← ✅ merged PR #48
├── CC_KICKOFF_task07_slice3.md  ← ✅ merged PR #50
├── TASK_01_monorepo_setup.md    ← ✅ wave 1
├── TASK_02_design_system.md     ← ✅ wave 1
├── TASK_03_api_contract.md      ← ✅ wave 1
├── TASK_04_core_backend.md      ← ✅ wave 2 + CORS slice + staging deploy live
├── TASK_05_ai_service.md        ← ✅ wave 2 + staging deploy live (TD-070 closed 2026-04-21)
├── TASK_06_broker_integrations.md ← ⏳ wave 3 (TD-046)
├── TASK_07_web_frontend.md      ← 🟢 wave 3 (Slice 1+2+3+7a+7b+4a+5a merged; Slice 5b/4b/4c/6/12 → UI_BACKLOG.md)
└── TASK_08_ios_app.md           ← 🧊 wave 4 (out of MVP scope)
```

## Как пользоваться — параллельная работа в нескольких чатах

### Шаг 1: Откройте новый чат в Claude

### Шаг 2: Вставьте в первое сообщение этот шаблон

```
Привет. Я разрабатываю AI-инвест-трекер. Вот контекст проекта и конкретный
таск, на котором мы сейчас работаем. Читай всё внимательно — это твой brief.

=== PROJECT BRIEF ===
[вставить содержимое 00_PROJECT_BRIEF.md]

=== TECH STACK ===
[вставить содержимое 01_TECH_STACK.md]

=== ARCHITECTURE ===
[вставить содержимое 02_ARCHITECTURE.md]

=== TASK ===
[вставить содержимое нужного TASK_XX_xxx.md]

Начни с того, что подтвердишь — понял задачу, вопросов нет / вот такие есть
вопросы. Потом приступаем к работе.
```

### Шаг 3: Работайте над таском в этом чате, а другие запускайте параллельно

## Порядок выполнения тасков

### Волна 1 — ✅ закрыта

| Таск | Что делает | Статус |
|---|---|---|
| **TASK_01** | Monorepo + CI/CD | ✅ merged |
| **TASK_02** | Дизайн-система в Figma | ✅ merged |
| **TASK_03** | API-контракт + схема БД | ✅ merged |

### Волна 2 — ✅ code-complete + staging deploy live

| Таск | Зависит от | Статус |
|---|---|---|
| **TASK_04** (Go API) | TASK_01, TASK_03 | ✅ 10 PRs + CORS micro-slice (PR #54+#55 `fc44782`, 2026-04-21). Staging live: `api-staging.investment-tracker.app`, CORS allowlist работает. Prod cutover после 24-48h soak + PR D (TD-066). |
| **TASK_05** (AI Service) | TASK_01, TASK_03, TASK_04 | ✅ merged (PR #34 + PR #43 cleanup). **✅ Staging deploy live (TD-070 closed 2026-04-21)** — `investment-tracker-ai-staging.fly.dev` (Fra). Slice 6a Insights UNBLOCKED. 404-swallow flip — после prod soak (`RUNBOOK_ai_flip.md`). |

### Волна 3 — 🟢 in flight

| Таск | Зависит от | Статус |
|---|---|---|
| **TASK_06** (Broker Integrations) | TASK_01, TASK_04 | ⏳ TD-046 — SnapTrade / Binance / Coinbase providers. Разблокирует Slice 4b/4c. Slice 4a (manual accounts) merged ✅. |
| **TASK_07** (Web) | TASK_02, TASK_03, TASK_04 | 🟢 Slice 1 (PR #45) + Slice 2 (PR #48) + Slice 3 (PR #50) + root-redirect (PR #53) + Slice 7a+7b (PR #58) + Slice 4a (PR #59) + Slice 5a (PR #60) merged. Web на `staging.investment-tracker.app` включая `/accounts` manual CRUD + `/positions/[id]` transactions CRUD + `/pricing`. **Manual MVP end-to-end flow замкнут.** Остальной Slice scope — `UI_BACKLOG.md` (canonical). |

### Волна 4 — отложено

| Таск | Статус |
|---|---|
| **TASK_08** (iOS) | 🧊 out of MVP scope — нужен Mac + Xcode, отдельный репо |

**Критический путь к alpha (см. UI_BACKLOG.md):** ~~Slice 4a (Manual Accounts CRUD)~~ ✅ PR #59 → ~~Slice 5a (Transactions UI)~~ ✅ PR #60 → **Slice 6a (Insights read-only, UNBLOCKED — TD-070 закрыта)** → ~~Slice 7a + 7b (Landing + Pricing)~~ ✅ PR #58 → Slice 12 (Empty + Error states). Параллельно бэк: PR D workers (TD-066), TASK_06 (TD-046).

## Советы по параллельным чатам

1. **Один чат — один таск.** Не смешивайте задачи, Claude теряет фокус.

2. **В начале нового чата всегда давайте полный контекст** (Brief + Tech + Architecture + Task). Claude не помнит ничего между чатами.

3. **Решения, принятые в одном чате, сохраняйте в эти файлы.** Если в TASK_04 приняли решение "используем такую-то библиотеку для X" — сразу обновляйте файл, чтобы другие чаты знали.

4. **Для контекста между тасками используйте "Decisions Log".** В каждом таске есть секция "Decisions" — туда пишите что решили, чтобы в следующий раз не пересматривать.

5. **Claude Code для реализации.** Эти файлы — для планирования и архитектуры. Когда доходит до "напиши мне эту функцию" — используйте Claude Code в терминале, он работает с файловой системой напрямую.

## Поддержание актуальности

Все эти файлы — живые документы. Когда принимается решение, которое их меняет — обновляйте их сразу, чтобы новые чаты не отталкивались от устаревшей информации.

---

**Следующий шаг:** открыть `PO_HANDOFF.md` (актуальный handoff между сессиями), затем `UI_BACKLOG.md` для приоритетов веба. Slice 4a + 5a merged — manual MVP end-to-end flow замкнут (account → trade → portfolio). AI Service staging live (TD-070 closed 2026-04-21). Текущий фронт работ — **Slice 6a** (Insights read-only — UNBLOCKED) + **Slice 12** (Empty/Error states). Параллельно бэк: PR D workers (TD-066), TASK_06 broker integrations (TD-046, для 4b/4c). Концепция продукта — `00_PROJECT_BRIEF.md`.
