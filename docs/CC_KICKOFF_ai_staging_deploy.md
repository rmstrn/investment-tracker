# CC Kickoff — TD-070 (AI Service Staging Deploy — infra-as-code)

**Scope:** подготовить config-as-code для AI Service staging deploy на Fly.io по образцу Core API staging (`apps/api/fly.staging.toml` + `ops/secrets.keys.yaml` + `ops/scripts/verify-prod-secrets.sh`). CC пишет ТОЛЬКО файлы-конфиги, манифест secrets, docs ADR и docs state updates. **Все runtime-операции (flyctl apps create, Doppler provisioning, первый deploy, smoke tests) делает PO** по `docs/RUNBOOK_ai_staging_deploy.md` — этот runbook уже существует, не переписывать.

**Anchor:** один micro-PR, config-only, ~5-7 файлов. **LOC не метрика** — критерий завершённости = acceptance criteria + CI green + PO может открыть runbook и последовательно выполнить § 2-7 без модификации файлов.

**Worktree:** `D:\investment-tracker-ai-staging` (branch `feature/td-070-ai-staging-deploy` from `origin/main` tip `<pre-flight SHA>`).
**Base:** main tip = post-Slice-5a (2026-04-21).
**Parallels with:** ничего на бэке не мешает. PO может параллельно делать runtime smoke Slice 5a на UI staging — они не пересекаются (UI vs backend infra).

---

## Context

### Зачем этот TD критичен

TD-070 блокирует UI Slice 6a (Insights read-only) — без staging AI Service frontend не может дёргать `/api/v1/insights` без 404-swallow. Вторым эффектом: без staging AI у нас нет soak'а перед prod flip (`RUNBOOK_ai_flip.md`). После TD-070 закрытия Slice 6a unblocked + Slice 12 (Empty/Error) параллельно — это последние два gatekeeper'а до alpha.

### Что уже есть в репо

- `apps/ai/Dockerfile` ✅ (multi-stage, uv-based, non-root).
- `apps/ai/fly.toml` ✅ (production config: `app = "investment-tracker-ai"`, `min_machines_running = 0`, `ENVIRONMENT = "production"`).
- `apps/ai/src/ai_service/config.py` ✅ (SecretStr Settings — требует `INTERNAL_API_TOKEN`, `ANTHROPIC_API_KEY`, `CORE_API_URL`, `CORE_API_INTERNAL_TOKEN`, + 3 модели + optional Sentry/PostHog).
- `.github/workflows/deploy-ai.yml` ✅ (один job, `workflow_dispatch`, deploy-by `apps/ai/fly.toml`, FLY_API_TOKEN placeholder).
- `ops/secrets.keys.yaml` ✅ (manifest для **Core API** — НЕ для AI. Required list: DATABASE_URL, REDIS_URL, CLERK_*, STRIPE_*, AI_SERVICE_URL, AI_SERVICE_TOKEN, CORE_API_INTERNAL_TOKEN, ENCRYPTION_KEK, POLYGON_API_KEY, SNAPTRADE_*, SENTRY_DSN, ALLOWED_ORIGINS).
- `ops/scripts/verify-prod-secrets.sh` ✅ (parametrized by `FLY_APP` env — работает для любого app если дать manifest path через `KEYS_FILE` env; **сейчас KEYS_FILE хард-рассчитывается относительно script, нужна или генерализация, или отдельный verify-ai-secrets.sh**).
- `docs/RUNBOOK_ai_staging_deploy.md` ✅ (332 строки, 11 секций, canonical runbook — **не переписывать**, тебе этот файл = source of truth).

### Что CC создаёт / изменяет (scope)

1. **`apps/ai/fly.staging.toml`** — skeleton по runbook § 3. Ключевые отличия от prod:
   - `app = "investment-tracker-ai-staging"`.
   - `ENVIRONMENT = "staging"`.
   - `min_machines_running = 1` (не 0 — чтобы UI smoke не ловил cold-start).
   - Остальное: `primary_region = "fra"`, `internal_port = 8000`, `force_https = true`, `auto_stop_machines = "suspend"`, `auto_start_machines = true`, concurrency soft/hard 50/80, healthcheck `/healthz` 30s/15s grace / 5s timeout, `[[vm]] shared-cpu-1x / 1gb`, `kill_signal = "SIGTERM"`, `kill_timeout = 30`.
   - `[env]` блок: `AI_LISTEN_HOST = "0.0.0.0"`, `AI_LISTEN_PORT = "8000"`, `ENVIRONMENT = "staging"`, `LOG_LEVEL = "INFO"` (последнее — новое vs prod, staging verbose ОК).
   - Шапка-комментарий с командой deploy: `flyctl deploy --config apps/ai/fly.staging.toml --dockerfile apps/ai/Dockerfile`.

2. **`apps/ai/secrets.keys.yaml`** — AI Service secrets manifest по образцу `ops/secrets.keys.yaml`. Required set (из `apps/ai/src/ai_service/config.py`):
   - `INTERNAL_API_TOKEN` — Core → AI bearer (должен быть ≡ `AI_SERVICE_TOKEN` в Core API — это bridge invariant).
   - `ANTHROPIC_API_KEY` — Anthropic SDK key.
   - `CORE_API_URL` — AI → Core base URL (`https://api-staging.investment-tracker.app` на staging).
   - `CORE_API_INTERNAL_TOKEN` — AI → Core reverse-channel bearer.
   - `ANTHROPIC_MODEL_SONNET` — default `claude-sonnet-4-6` (можно вынести в `[env]` вместо secret — CC решает; но default в config.py требует alias, так что если вынесено в `[env]` то в manifest оставить НЕ нужно; если secret — добавить).
   - `ANTHROPIC_MODEL_HAIKU`, `ANTHROPIC_MODEL_OPUS` — same rule.
   - Decision CC: models — `[env]` блок в `fly.staging.toml` (hardcoded defaults совпадают с production — нет смысла в secrets), **только** 4 tokens/URLs идут через Doppler. Обоснование: модели не rotate'ятся и не секретны.
   - Optional: `SENTRY_DSN`, `POSTHOG_API_KEY`, `SENTRY_TRACES_SAMPLE_RATE`, `POSTHOG_HOST`, `ANTHROPIC_MAX_CONCURRENT`, `ANTHROPIC_TIMEOUT_SECONDS`, `ANTHROPIC_MAX_RETRIES`, `CORE_API_TIMEOUT_SECONDS`.
   - Шапка-комментарий: Doppler project = `investment-tracker-ai`, configs = `dev / stg / prd`.

3. **`ops/scripts/verify-ai-secrets.sh`** (optional, **рекомендуется**) — тонкая обёртка вокруг логики `verify-prod-secrets.sh` но с `KEYS_FILE` указывающим на `apps/ai/secrets.keys.yaml`. Варианты:
   - **A.** Скопировать `verify-prod-secrets.sh`, переименовать, заменить `KEYS_FILE` путь. +1 скрипт.
   - **B.** Генерализовать `verify-prod-secrets.sh` через env-var `KEYS_FILE` override (fallback на текущее поведение если не задан) + новый shim `verify-ai-secrets.sh` который просто exports `KEYS_FILE=apps/ai/secrets.keys.yaml` и вызывает существующий скрипт. 0 дублирования.
   - **Предпочтение:** B, но если ломается регрессия для Core API verify — fallback на A. Decision CC; GAP REPORT упомянуть выбор.

4. **`.github/workflows/deploy-ai.yml`** — enhance: добавить второй job `deploy-staging` аналогичный `deploy` но на `apps/ai/fly.staging.toml`, также под `workflow_dispatch` с input-selector `environment: {production | staging}` (single job с if-branching тоже ОК — CC решает). Production job НЕ трогать кроме переименования если нужно для clarity. FLY_API_TOKEN пока в placeholder (PO добавит secret после app create).

5. **`docs/DECISIONS.md`** — append ADR:
   - **Title:** «AI Service staging deploy topology (TD-070)».
   - **Context:** нужен long-lived staging AI для UI smoke + prod soak; отдельный Fly app, отдельная Doppler config, bridge via INTERNAL_API_TOKEN ≡ AI_SERVICE_TOKEN.
   - **Decision:** Fly app `investment-tracker-ai-staging`, Doppler project `investment-tracker-ai` config `stg`, `min_machines_running = 1`, `auto_stop_machines = suspend`. Bridge invariant (token-equality) пока охраняется вручную (PO-side); TD-кандидат на automated drift check зарезервирован как **TD-082**.
   - **Consequences:** staging $~$2-3/мес idle (1 suspended machine); cold-start risk: нет (min=1); Anthropic key shared между dev/stg/prd (low-traffic staging → acceptable); Sentry/PostHog на staging не обязательны — оставлены optional в manifest.
   - **Alternatives considered:** (a) разделить prod/staging конфиги через `[deploy.env.staging]` в том же fly.toml — Fly не поддерживает multi-env в одном файле, отклонено; (b) `min_machines_running = 0` — отклонено из-за cold-start UX в демо; (c) отдельный Anthropic key для staging — deferred, нет рисков.

6. **`docs/TECH_DEBT.md`** — TD-070 запись: **не закрывать** (закрывает PO после deploy+smoke), но обновить статус до `config shipped, awaiting PO deploy`. Добавить новый **TD-082** (reserved за этим TD): «automated drift check — verify `AI_SERVICE_TOKEN` (Core API) ≡ `INTERNAL_API_TOKEN` (AI Service) in deploy CI». Кратко: сейчас invariance охраняется головой PO, для prod flip это unacceptable risk. Не opened TD с реальным owner'ом — резервируем ID + запись «blocked-by: prod flip готовится».
   - Если при работе над TD-070 CC находит genuine TD-кандидата — открывает под следующим id (TD-083).

7. **`docs/RUNBOOK_ai_staging_deploy.md`** — минимальные правки:
   - В § 3 заметка: «файл `apps/ai/fly.staging.toml` теперь в репо (commit `<SHA>`); шаг = убедиться что актуален».
   - В § 6 добавить: «альтернативно — GitHub Actions workflow_dispatch на `deploy-ai.yml` с `environment: staging`» (если CC добавил staging job).
   - В § 9 (post-deploy docs) убрать строку «(Опционально) добавить `apps/ai/secrets.keys.yaml`» — он уже landed в этом PR.
   - **НЕ** переписывать структуру runbook; точечные правки.

8. **`docs/TASK_07_web_frontend.md`** — НЕ трогать (UI-документ, не backend).
   **`docs/03_ROADMAP.md`** — НЕ закрывать строку «AI Service / FastAPI deploy» (PO закрывает после runtime deploy + smoke); допустимо пометить «config shipped, deploy pending PO» в том же правом столбце.
   **`docs/PO_HANDOFF.md`** — НЕ трогать (PO-only territory; CC docs pass ограничен DECISIONS + TECH_DEBT + RUNBOOK tweak + ROADMAP pending-note + `merge-log.md`).

### Что CC проверяет pre-flight

- `apps/api/fly.staging.toml` существует как reference (mirror pattern). Если нет — запрос в чат PO.
- `flyctl` не нужен локально CC — **все runtime команды делает PO**. CC пишет ТОЛЬКО файлы.
- `bash` + `python3` в CC dev env — для локального smoke `verify-ai-secrets.sh` без Fly API calls (e.g. `FLY_APP=dummy flyctl` mock'ать не нужно; CC может проверить что manifest парсится: запусти `python3 - < apps/ai/secrets.keys.yaml` фрагментом из `verify-prod-secrets.sh` и убедись что все required keys детектятся).
- `ops/scripts/verify-prod-secrets.sh` читабелен — шаблон для verify-ai-secrets (если выбран вариант A).
- `apps/ai/src/ai_service/config.py` — source of truth для required secret set. Если CC находит ключ в config.py без default'а и без optional union — он required; добавить в manifest.
- `docs/RUNBOOK_ai_staging_deploy.md` § 3 — canonical `fly.staging.toml` template. CC **копирует** блок, не изобретает.

---

## Что НЕ делаем (explicit out-of-scope)

1. **`flyctl apps create investment-tracker-ai-staging`** — PO делает после merge (runbook § 2).
2. **Doppler provisioning** (`doppler projects create` / `doppler configs create` / `doppler secrets set`) — PO делает после merge (runbook § 4).
3. **Первый `flyctl deploy`** — PO (runbook § 6).
4. **Smoke tests** (curl healthcheck, auth check, logs review) — PO (runbook § 7).
5. **DNS setup** (`ai-staging.investment-tracker.app` CNAME + `flyctl certs create`) — PO, опционально (runbook § 8).
6. **Bridge update Core API staging secrets** (обновить `AI_SERVICE_URL` + `AI_SERVICE_TOKEN` в `investment-tracker-api` Doppler stg) — PO (runbook § 5).
7. **Automated drift check для token parity** — TD-082, отдельный PR после prod flip.
8. **Prod deploy AI Service** — отдельная задача (`RUNBOOK_ai_flip.md`), не в scope.
9. **Rotation обычного Anthropic key на staging-specific** — не в scope; key shared.
10. **Prod fly.toml modifications** — **не трогать** `apps/ai/fly.toml` вообще. Любое изменение → дополнительный риск prod deploy.

---

## Acceptance criteria

- `apps/ai/fly.staging.toml` создан, скопирован из runbook § 3 блока, валиден (CC не может `flyctl config validate` без Fly login — достаточно визуального diff с `apps/ai/fly.toml` + `apps/api/fly.staging.toml`).
- `apps/ai/secrets.keys.yaml` создан, 4 required (INTERNAL_API_TOKEN, ANTHROPIC_API_KEY, CORE_API_URL, CORE_API_INTERNAL_TOKEN) + optional (Sentry/PostHog/timeouts) — все matching aliases в `config.py`.
- `ops/scripts/verify-ai-secrets.sh` exists (если вариант B — shim; если A — полная копия). Исполняемый (`chmod +x`), shebang `#!/usr/bin/env bash`, `set -euo pipefail`. CC проверил локально что script парсит manifest без ошибок (без Fly API calls — например через envsubst + dummy `flyctl` в PATH ИЛИ через `bash -n verify-ai-secrets.sh` syntax check + python YAML-parse блок изолированно).
- `.github/workflows/deploy-ai.yml` — staging job добавлен (single-job-with-input или two-jobs — CC решает). Production job behavior не изменён. `workflow_dispatch` trigger сохранён.
- `docs/DECISIONS.md` — ADR «AI Service staging deploy topology» добавлен.
- `docs/TECH_DEBT.md` — TD-070 статус обновлён (`config shipped, awaiting PO deploy`); TD-082 зарегистрирован как reserved.
- `docs/RUNBOOK_ai_staging_deploy.md` — точечные правки § 3, § 6, § 9 (только где действительно устарело из-за landed config).
- `pnpm lint`, `pnpm typecheck`, `pnpm build` — не затронуты (нет TS файлов в PR). Go/Python test suites — не затронуты (нет .go / .py изменений). Если workflow YAML меняется → GH Actions lint в CI должен пройти.
- **Mandatory pre-merge `gh pr checks <N> --watch`** (TD-078).
- Никаких новых прод TDs не ожидается кроме TD-082 reserved. Если CC находит genuine — **TD-083** свободен.
- В PR description:
  - Ссылка на `RUNBOOK_ai_staging_deploy.md` § 1-11 как «PO execution plan after merge».
  - Явный список «что PO должен сделать после merge» (3-7 шаги runbook).
  - Bridge invariant reminder: `AI_SERVICE_TOKEN` (Core API Doppler stg) ≡ `INTERNAL_API_TOKEN` (AI Service Doppler stg).

---

## Open questions (CC решает в процессе)

1. **`ANTHROPIC_MODEL_*` — `[env]` vs secrets?** Предпочтение PO: `[env]` block в `fly.staging.toml` (hardcoded, не секретны, не rotate'ятся). Если CC видит причину держать в secrets (например, для per-env pinning) — document в PR description. Default = `[env]`.
2. **`verify-ai-secrets.sh` — вариант A (копия) vs B (shim через KEYS_FILE env)?** Предпочтение PO: B (DRY), если не ломает regression для prod Core API verify. Decision CC после прочтения скрипта.
3. **`deploy-ai.yml` — один job с input selector vs два separate jobs?** Оба валидны. Предпочтение: один job с `environment: {production | staging}` input (DRY), default = staging (безопаснее — не-прод). Decision CC.
4. **`LOG_LEVEL = "INFO"` vs `"DEBUG"` на staging?** Предпочтение: `INFO` (как в runbook § 3 template). DEBUG генерирует noise, не помогает при malformed Anthropic responses (там нужны structured logs, а не level).
5. **`ENCRYPTION_KEK` для AI Service?** AI Service НЕ шифрует ничего AES-level — он просто proxy к Anthropic. `ENCRYPTION_KEK` НЕ в required set для AI Service manifest'а (в Core API — да, там envelope-encrypt broker creds). Подтверждаю: не добавлять.
6. **`doppler-sync.yml` — нужен отдельный для AI project?** Deferred. Sync пока ручной (runbook § 4.3 = одна команда PO). Если в будущем drift'ы замечу — TD-кандидат.

---

## Deliverables

1. PR в `main`: `ops(ai): TD-070 — staging deploy config (fly.staging.toml + secrets manifest + verify script + deploy workflow)`.
2. GAP REPORT перед merge (в чат PO):
   - CI status (ожидаем 10/10 green; **обязательный** `gh pr checks <N> --watch` per TD-078).
   - File list (что добавлено / изменено — ожидается 5-7 файлов).
   - Chosen decisions по open questions #1-6 (коротко).
   - TDs opened/closed (ожидается: TD-070 → «config shipped, awaiting PO deploy»; TD-082 reserved; возможно TD-083 если genuine).
   - Scope-adjacent changes (если пришлось трогать `verify-prod-secrets.sh` для generalization — flag'ни отдельно).
3. **После PO approval — CC сам делает merge + cleanup + docs pass** (см. `PO_HANDOFF.md § 10` — **codified 7-step flow**):
   1. `gh pr merge <N> --squash --delete-branch`.
   2. `git fetch origin && git checkout origin/main` — **detached HEAD в СВОЁМ worktree** (`D:\investment-tracker-ai-staging`), НЕ в main worktree.
   3. Edit docs append-only: `merge-log.md`, `TECH_DEBT.md` (TD-070 status + TD-082 reserved + TD-083 если opened), `DECISIONS.md` (ADR уже в PR — проверить что landed). Опционально `03_ROADMAP.md` pending-note. **НЕ трогать `PO_HANDOFF.md` + `UI_BACKLOG.md`** — это PO territory.
   4. `git add docs/ && git commit -m "docs: td-070 post-merge pass" && git push origin HEAD:main`.
   5. Non-fast-forward → `git pull --rebase origin main` + append-only resolve + push. Никогда force-push.
   6. Cleanup из main worktree: `cd D:\investment-tracker && git worktree remove D:\investment-tracker-ai-staging && git branch -D feature/td-070-ai-staging-deploy`. Если remote branch остался → `gh api -X DELETE repos/<owner>/<repo>/git/refs/heads/feature/td-070-ai-staging-deploy`.
   7. Ping PO: «merged + cleaned + docs done, main tip now `<SHA>`. Готово к staging deploy по RUNBOOK_ai_staging_deploy.md § 2-8.»

**Pre-approved actions в этом flow:** detached HEAD docs workflow, remote branch force-delete, rebase+append conflict resolve. Не спрашивать разрешение на каждый шаг. Любое отклонение от списка выше — стоп + вопрос в чат PO.

---

## PO notes (что делает PO — после CC ping'а «merged»)

Следовать `RUNBOOK_ai_staging_deploy.md` последовательно:

1. **§ 2** — `flyctl apps create investment-tracker-ai-staging --org personal` (2 мин).
2. **§ 4** — Doppler project `investment-tracker-ai` + config `stg` + залить 4 required secrets (10 мин).
3. **§ 4.3** — `doppler secrets download ... | flyctl secrets import ...` (1 мин).
4. **§ 5** — обновить Core API staging Doppler: `AI_SERVICE_URL = https://investment-tracker-ai-staging.fly.dev`, `AI_SERVICE_TOKEN = <INTERNAL_API_TOKEN from AI Doppler>`, sync → Fly (3 мин).
5. **§ 6** — `flyctl deploy --config apps/ai/fly.staging.toml --dockerfile apps/ai/Dockerfile --app investment-tracker-ai-staging --remote-only` (5 мин).
6. **§ 7** — smoke: `/healthz` → 200; без token → 401; `flyctl logs` чистые (5 мин).
7. **§ 8** — DNS optional (если хочется `ai-staging.investment-tracker.app` вместо `*.fly.dev` — 5 мин + 5-15 мин DNS propagation).
8. **§ 9** — post-deploy docs (PO): закрыть TD-070 в `TECH_DEBT.md`, отметить done в `03_ROADMAP.md`, убрать § 9 из `PO_HANDOFF.md`, обновить `README.md` Wave 2 строку, добавить note в `RUNBOOK_ai_flip.md`.
9. После § 7 smoke green — TD-070 closed, Slice 6a unblocked. Kickoff Slice 6a параллельно с Slice 12.

Если на deploy что-то падает (build error, secret missing, healthcheck fail) — PO фиксит локально, НЕ зовёт CC обратно (CC уже отмержен). Если фикс требует изменения `fly.staging.toml` → PO делает commit прямо в main (`--no-verify` ОК для ops-only).

---

## Стиль работы CC (напоминание)

- Русский, коротко, без overformatting.
- Decisions-first: сначала что делаешь, потом почему.
- Видишь риск — говори сразу.
- Верифицируй каждый Edit через Read (state loss бывал).
- LOC не трекать как scope metric — критерий = acceptance criteria + CI green + файлы matching runbook § 3 template.
- Pre-merge **обязательный** `gh pr checks <N> --watch` (TD-078 policy).
- CC docs pass — **всегда** в собственном worktree (detached HEAD), **никогда** в main worktree `D:\investment-tracker` (PO-only territory; gotcha #10).
- Post-merge chain (merge → detached HEAD → docs → push → cleanup → ping) выполняется без вопросов по каждому шагу — весь список pre-approved в этом kickoff'е (gotcha #9).
- **НЕ трогать runtime-команды.** Никаких `flyctl ...`, `doppler ...`, `curl https://...` в этом PR — всё runtime PO делает вручную по runbook. CC remit = config-as-code + docs. Если видишь что runbook шаг можно скриптовать (bonus) — open TD, не добавляй в этот PR.
- Если что-то в scope непонятно или появилась дилемма — пиши в чат PO до того как делаешь large changes.
