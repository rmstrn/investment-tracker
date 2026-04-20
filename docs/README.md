# Investment Portfolio Tracker — Project Files

Набор файлов для работы с проектом через несколько параллельных чатов с Claude.

## Структура

```
docs/
├── README.md                    ← вы тут
├── 00_PROJECT_BRIEF.md          ← концепция, аудитория, USP
├── 01_TECH_STACK.md             ← весь стек технологий
├── 02_ARCHITECTURE.md           ← архитектура + модель данных
├── 03_ROADMAP.md                ← план MVP по месяцам + статус волн
├── 04_DESIGN_BRIEF.md           ← дизайн-система v1.1 (source of truth)
├── DECISIONS.md                 ← engineering decisions log
├── TECH_DEBT.md                 ← накопленный и принятый tech debt
├── merge-log.md                 ← журнал merge-событий + admin-bypass policy
├── CLAUDE_CODE_PROMPTS.md       ← шаблоны для параллельных CC сессий
├── RUNBOOK_ai_flip.md           ← runbook: AI Service 404-swallow → strict (после B3-iii)
├── PR_C_preflight.md            ← pre-flight GAP-анализ финального PR C (Fly.io deploy)
├── CC_KICKOFF_pr_c.md           ← PR C kickoff (wrapper вокруг PR_C_preflight)
├── CC_KICKOFF_task07_slice1.md  ← ✅ merged PR #45
├── CC_KICKOFF_task07_slice2.md  ← ✅ merged PR #48
├── CC_KICKOFF_task07_slice3.md  ← ✅ merged PR #50
├── TASK_01_monorepo_setup.md    ← ✅ wave 1, инфраструктура
├── TASK_02_design_system.md     ← ✅ wave 1, Figma + UI kit
├── TASK_03_api_contract.md      ← ✅ wave 1, OpenAPI + миграции
├── TASK_04_core_backend.md      ← ✅ wave 2 closed (9/9 merged: A/B1/B2a/B2b/B2c/B3-i/B3-ii-a/B3-ii-b/B3-iii; PR C Fly.io deploy in flight separately)
├── TASK_05_ai_service.md        ← ✅ wave 2, Python AI-сервис (PR #34 initial + PR #43 ai_usage dual-write cleanup 2026-04-20)
├── TASK_06_broker_integrations.md  ← wave 3 (стартует после закрытия TASK_04)
├── TASK_07_web_frontend.md      ← 🟢 wave 3 in flight (Slice 1 PR #45 + Slice 2 PR #48 + Slice 3 PR #50 merged; Slice 4+ pending)
└── TASK_08_ios_app.md           ← wave 4 (deferred — нужен Mac)
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

### Волна 2 — ✅ code-complete

| Таск | Зависит от | Статус |
|---|---|---|
| **TASK_04** (Go API) | TASK_01, TASK_03 | ✅ 10/10 PRs merged (PR C deploy infra merged 2026-04-20, PR #49 `fa9c9dc`; operational setup — Doppler/Fly/DNS/soak — на PO per `RUNBOOK_deploy.md § Prerequisites`) |
| **TASK_05** (AI Service) | TASK_01, TASK_03, TASK_04 | ✅ merged (PR #34 initial + PR #43 cleanup `b6108a4` 2026-04-20). 404-swallow flip после PR C prod soak (`RUNBOOK_ai_flip.md`) |

### Волна 3 — 🟢 in flight

| Таск | Зависит от | Статус |
|---|---|---|
| **TASK_06** (Broker Integrations) | TASK_01, TASK_04 | ⏳ waiting (после PR C prod soak + PR D workers deploy) |
| **TASK_07** (Web) | TASK_02, TASK_03, TASK_04 | 🟢 Slice 1 (PR #45 `a622bd3`) + Slice 2 (PR #48 `366d12f`) + Slice 3 (PR #50 `4881dfd`, AI Chat UI, 2026-04-20) merged; Slice 4+ pending |

### Волна 4 — отложено

| Таск | Статус |
|---|---|
| **TASK_08** (iOS) | 🧊 deferred — нужен Mac + Xcode, отдельный репо |

**Важно:** TASK_04 (Go API) code-complete. PR D — workers deploy + asynq consumer (**blocker: TD-066** — restore workers deploy target в deploy-api.yml dispatch). TASK_06 разблокируется после PR D.

## Советы по параллельным чатам

1. **Один чат — один таск.** Не смешивайте задачи, Claude теряет фокус.

2. **В начале нового чата всегда давайте полный контекст** (Brief + Tech + Architecture + Task). Claude не помнит ничего между чатами.

3. **Решения, принятые в одном чате, сохраняйте в эти файлы.** Если в TASK_04 приняли решение "используем такую-то библиотеку для X" — сразу обновляйте файл, чтобы другие чаты знали.

4. **Для контекста между тасками используйте "Decisions Log".** В каждом таске есть секция "Decisions" — туда пишите что решили, чтобы в следующий раз не пересматривать.

5. **Claude Code для реализации.** Эти файлы — для планирования и архитектуры. Когда доходит до "напиши мне эту функцию" — используйте Claude Code в терминале, он работает с файловой системой напрямую.

## Поддержание актуальности

Все эти файлы — живые документы. Когда принимается решение, которое их меняет — обновляйте их сразу, чтобы новые чаты не отталкивались от устаревшей информации.

---

**Следующий шаг:** открыть PO_HANDOFF.md (актуальный handoff между сессиями), потом 00_PROJECT_BRIEF.md для концепции. Текущий фронт работ — PO operational setup (Doppler/Fly/DNS/первый staging deploy per `RUNBOOK_deploy.md § Prerequisites`), затем AI Service 404-swallow flip (`RUNBOOK_ai_flip.md`). Параллельно — TASK_07 Slice 4 (Insights feed + FloatingAiFab) либо Slice 5 (Paywall + Pricing + Stripe Checkout), PR D workers (TD-066 blocker), TASK_06 broker integrations.
