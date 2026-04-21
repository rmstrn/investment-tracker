# RUNBOOK — AI Service Staging Deploy (TD-070)

**Owner:** PO (manual, no CC)
**Estimated time:** 30–45 минут (включая Doppler + первый deploy + smoke)
**Closes:** TD-070 (AI Service staging deploy)
**Unblocks:** UI Slice 6a (Insights read-only) — фронт сможет дёргать `https://ai-staging.investment-tracker.app`

---

## ✅ STATUS: CLOSED 2026-04-21

Runbook успешно выполнен — staging живёт на `https://investment-tracker-ai-staging.fly.dev/healthz` (200). TD-070 закрыта (см. `TECH_DEBT.md` § Resolved / TD-R070).

**Latent bugs caught during first deploy (4 TDs opened):**
- **TD-084** (P2) — flyctl build context CWD vs `--config` toml location (Dockerfile COPY paths должны быть repo-root-relative).
- **TD-085** (P3, fixed inline `b079d30`) — `apps/ai/.dockerignore` исключал `README.md` который `pyproject.toml` readme-ref требует в build context.
- **TD-086** (P2) — нет CI Docker build gate на `apps/ai/` (TD-087 + TD-085 должны были быть пойманы CI'ем, а не PO во время runtime ops).
- **TD-087** (P3, fixed inline `4357739`) — `uv sync` в multi-stage Dockerfile должен использовать `--no-editable` (иначе `ModuleNotFoundError` в runtime stage).

**Gotchas caught (не TDs — process notes):**
- Doppler export на Windows в PowerShell добавляет UTF-8 BOM при пайпе `doppler secrets download --format env | flyctl secrets import`. Workaround: JSON-формат + PowerShell `ConvertFrom-Json` + spread в `flyctl secrets set`. Закреплено в § 4.3 ниже.
- `openssl` отсутствует в default PowerShell; token generation через `[System.Security.Cryptography.RandomNumberGenerator]` работает как замена.
- `GET /v1/chat/health` возвращает 404 на staging (prod-only endpoint в routing). Не блокер для smoke — `/healthz` + `/v1/health` дают достаточно.

Runbook оставлен для reference + следующих Python service deploys (worker, analytics и т. д.).

---

## 0. Что мы делаем

Поднимаем staging-инстанс AI Service (FastAPI) на Fly.io по той же модели, что и Core API: отдельное Fly app `investment-tracker-ai-staging`, secrets через Doppler config `stg`, deploy через `flyctl deploy --config apps/ai/fly.staging.toml`.

Прод-deploy AI Service делаем **позже** (после prod soak Core API + 404-swallow flip — см. `RUNBOOK_ai_flip.md`).

---

## 1. Pre-flight (5 мин)

### 1.1 Что уже есть в репо
- `apps/ai/Dockerfile` ✅ (multi-stage, uv-based, runs as non-root)
- `apps/ai/fly.toml` ✅ (production config — `investment-tracker-ai`)
- `.github/workflows/deploy-ai.yml` ✅ (workflow_dispatch only — пока ОК)
- `apps/ai/src/ai_service/config.py` ✅ (SecretStr-based settings)

### 1.2 Что НУЖНО создать
- `apps/ai/fly.staging.toml` — staging config (см. § 3 ниже, шаблон по `apps/api/fly.staging.toml`)
- Fly app `investment-tracker-ai-staging` — через `fly apps create`
- Doppler project `investment-tracker-ai` (если ещё нет) с config `stg`
- Secrets в Doppler stg (см. § 4 ниже)

### 1.3 Зависимости снаружи
- **Доступ:** `flyctl` залогинен (`flyctl auth whoami` → твой email)
- **Доступ:** `doppler` CLI залогинен (`doppler whoami`)
- **API key:** Anthropic API key — production ключ ОК, в staging тоже шлём через него (low traffic)
- **Core API staging:** `api-staging.investment-tracker.app` — должен быть live (✅ уже есть, PR C)

---

## 2. Создать Fly app + region (2 мин)

```bash
# Создать app в той же org / region, что и Core API staging
flyctl apps create investment-tracker-ai-staging --org personal

# Установить primary region — fra (Frankfurt), как у API
# (это не команда, это будет в fly.staging.toml)

# Sanity-check
flyctl apps list | grep investment-tracker-ai
# → должен видеть и production (investment-tracker-ai) и staging
```

Если apps:create падает с «name already taken» — кто-то его уже создавал; `flyctl apps list` покажет владельца.

---

## 3. `apps/ai/fly.staging.toml`

> **2026-04-21 update (TD-070 config-as-code slice).** Файл теперь в репо —
> шаг = проверить что актуален (`git log apps/ai/fly.staging.toml`), не создавать
> заново. Anthropic model IDs (`ANTHROPIC_MODEL_SONNET|HAIKU|OPUS`) захардкожены в
> `[env]` блоке, **не** через Doppler (§ 4.2 ниже обновлён соответственно).
> Manifest требуемых secrets — `apps/ai/secrets.keys.yaml`; verify CI —
> `ops/scripts/verify-ai-secrets.sh`. Оригинальный шаблон ниже для справки, если
> понадобится пересоздать:

```toml
# Fly.io deployment config — AI Service (staging).
# Deploy:  flyctl deploy --config apps/ai/fly.staging.toml --dockerfile apps/ai/Dockerfile

app = "investment-tracker-ai-staging"
primary_region = "fra"

kill_signal = "SIGTERM"
kill_timeout = 30

[build]
  dockerfile = "Dockerfile"

[env]
  AI_LISTEN_HOST = "0.0.0.0"
  AI_LISTEN_PORT = "8000"
  ENVIRONMENT = "staging"
  LOG_LEVEL = "INFO"

[http_service]
  internal_port = 8000
  force_https = true
  # Staging traffic — bursty (UI smoke + PO ручные тесты), suspend ОК.
  auto_stop_machines = "suspend"
  auto_start_machines = true
  min_machines_running = 1

  [http_service.concurrency]
    type = "requests"
    soft_limit = 50
    hard_limit = 80

  [[http_service.checks]]
    grace_period = "15s"
    interval = "30s"
    method = "GET"
    path = "/healthz"
    timeout = "5s"

[[vm]]
  size = "shared-cpu-1x"
  memory = "1gb"
```

Положи файл коммитом в main (docs+config-only, `--no-verify` OK):

```bash
cd D:\investment-tracker
git add apps/ai/fly.staging.toml docs/RUNBOOK_ai_staging_deploy.md
git commit --no-verify -m "ops(ai): add staging fly config + deploy runbook (TD-070)"
git push origin main
```

---

## 4. Doppler — create project + secrets (10 мин)

### 4.1 Project + configs
Если проекта `investment-tracker-ai` ещё нет:

```bash
# Создать project (web UI или CLI)
doppler projects create investment-tracker-ai

# Создать configs
doppler configs create dev --project investment-tracker-ai
doppler configs create stg --project investment-tracker-ai
doppler configs create prd --project investment-tracker-ai
```

### 4.2 Secrets для config `stg`
Минимально-обязательные ключи (manifest: `apps/ai/secrets.keys.yaml`, source:
`apps/ai/src/ai_service/config.py`):

| Key | Value | Где взять |
|---|---|---|
| `INTERNAL_API_TOKEN` | `<random 32-byte hex>` | `openssl rand -hex 32` |
| `ANTHROPIC_API_KEY` | `sk-ant-…` | твой Anthropic console |
| `CORE_API_URL` | `https://api-staging.investment-tracker.app` | hardcoded |
| `CORE_API_INTERNAL_TOKEN` | `<существующее значение из investment-tracker-api/stg>` | `doppler secrets get CORE_API_INTERNAL_TOKEN --project investment-tracker-api --config stg --plain` |

> **Anthropic model IDs (`ANTHROPIC_MODEL_SONNET|HAIKU|OPUS`) — НЕ заливать в
> Doppler.** Они захардкожены в `apps/ai/fly.staging.toml [env]` блоке
> (commit SHA — см. `git log apps/ai/fly.staging.toml`). Fly secrets
> override `[env]` — если модели окажутся в Doppler, они silently вытеснят
> explicit pin в toml. Если при rollout'е появится нужда per-env pin —
> правь toml, не Doppler.

Опциональные (можно отложить; `verify-ai-secrets.sh` их **не** проверяет):
- `SENTRY_DSN`, `SENTRY_TRACES_SAMPLE_RATE` — error-tracking.
- `POSTHOG_API_KEY`, `POSTHOG_HOST` — analytics.
- `ANTHROPIC_MAX_CONCURRENT`, `ANTHROPIC_TIMEOUT_SECONDS`, `ANTHROPIC_MAX_RETRIES` —
  tuning (config.py defaults ОК для старта).
- `CORE_API_TIMEOUT_SECONDS` — тоже tuning (default 30.0).

Залить в Doppler (быстрый способ — UI; CLI вариант):

```bash
doppler secrets set INTERNAL_API_TOKEN=$(openssl rand -hex 32) \
  --project investment-tracker-ai --config stg --silent

doppler secrets set ANTHROPIC_API_KEY=sk-ant-... \
  --project investment-tracker-ai --config stg --silent

doppler secrets set CORE_API_URL=https://api-staging.investment-tracker.app \
  --project investment-tracker-ai --config stg --silent

doppler secrets set CORE_API_INTERNAL_TOKEN=$(doppler secrets get CORE_API_INTERNAL_TOKEN --project investment-tracker-api --config stg --plain) \
  --project investment-tracker-ai --config stg --silent
```

### 4.3 Sync Doppler → Fly secrets

Самый простой способ — одной командой залить в Fly:

```bash
doppler secrets download --project investment-tracker-ai --config stg --no-file --format env | \
  flyctl secrets import --app investment-tracker-ai-staging
```

После этого:
```bash
flyctl secrets list --app investment-tracker-ai-staging
# → должен видеть 4 required ключа (модели живут в fly.staging.toml [env], не
#   secrets, поэтому в `secrets list` не появятся — это by design).
```

Sanity-check manifest'ом (читает ключи с Fly, сравнивает с
`apps/ai/secrets.keys.yaml`):

```bash
export FLY_APP=investment-tracker-ai-staging
export FLY_API_TOKEN=$(flyctl auth token)
bash ops/scripts/verify-ai-secrets.sh
# → exit 0 + "4 required keys present"
```

---

## 5. Bridge AI ↔ Core: обновить Core API staging secrets (3 мин)

Чтобы Core API смог звонить в новый AI Service, обнови его secrets:

```bash
# Добавить в Core API staging Doppler:
doppler secrets set AI_SERVICE_URL=https://investment-tracker-ai-staging.fly.dev \
  --project investment-tracker-api --config stg --silent

doppler secrets set AI_SERVICE_TOKEN=$(doppler secrets get INTERNAL_API_TOKEN --project investment-tracker-ai --config stg --plain) \
  --project investment-tracker-api --config stg --silent

# Залить в Fly (Core API staging уже live):
doppler secrets download --project investment-tracker-api --config stg --no-file --format env | \
  flyctl secrets import --app investment-tracker-api-staging
```

⚠ **Важно:** `AI_SERVICE_TOKEN` в Core API должен быть равен `INTERNAL_API_TOKEN` в AI Service. Инвариантность охраняет PO — automated drift check зарезервирован как **TD-082** (open'ится когда AI Service готовится к prod flip; сейчас staging-only).

После `secrets import` Fly сделает rolling restart Core API staging (~30 сек). Это OK.

---

## 6. Первый deploy (5 мин)

```bash
cd D:\investment-tracker

flyctl deploy \
  --config apps/ai/fly.staging.toml \
  --dockerfile apps/ai/Dockerfile \
  --app investment-tracker-ai-staging \
  --remote-only
```

Watch the build. Deploy ожидаемо ~3-5 минут (uv install + image push + machine boot).

Если что-то падает на build → проблема в Dockerfile / pyproject. Фикси, коммить, перезапускай.
Если падает на healthcheck → проверь логи: `flyctl logs --app investment-tracker-ai-staging`. Чаще всего — secret missing (Anthropic key не залит, например).

> **Alternative — GitHub Actions (после bootstrap).** Когда § 2 (apps create) +
> § 4 (Doppler provisioning + Fly secrets sync) + § 5 (Core API bridge update)
> выполнены **и** `FLY_API_TOKEN` лежит в repo secrets — можно катить через
> `Actions → Deploy — ai (Fly.io) → Run workflow → environment: staging`.
> Workflow запустит `verify-ai-secrets.sh` pre-deploy check, затем `flyctl
> deploy --remote-only`. **Не** заменяет § 2-5 bootstrap; если запустить
> раньше — verify-secrets упадёт потому что Fly app пустой.

---

## 7. Smoke tests (5 мин)

### 7.1 Healthcheck
```bash
curl https://investment-tracker-ai-staging.fly.dev/healthz
# Expected: 200 {"status": "ok"} или похожее
```

### 7.2 Internal auth (с Core API endpoint)
Достань `INTERNAL_API_TOKEN` локально:
```bash
TOKEN=$(doppler secrets get INTERNAL_API_TOKEN --project investment-tracker-ai --config stg --plain)

# Smoke endpoint без юзер-контекста (например, /v1/health/auth — если есть)
curl -H "Authorization: Bearer $TOKEN" https://investment-tracker-ai-staging.fly.dev/v1/health/auth
# Expected: 200 (если endpoint существует) или 404 (если нет — не страшно)

# Без токена должно быть 401:
curl -i https://investment-tracker-ai-staging.fly.dev/v1/chat/health
# Expected: 401 Unauthorized
```

### 7.3 End-to-end через Core API (если Slice 6a уже частично)
Если frontend ещё не вызывает AI — пропусти. Если вызывает (например, через `/api/v1/insights`) — открой `/dashboard` или `/insights` в staging web и проверь, что нет 502 от AI.

### 7.4 Логи
```bash
flyctl logs --app investment-tracker-ai-staging
# → ищи структурные JSON-логи без ERROR/CRITICAL
```

---

## 8. DNS (опционально, 5 мин)

Если хочешь красивый домен `ai-staging.investment-tracker.app` вместо `*.fly.dev`:

```bash
# В Fly:
flyctl certs create ai-staging.investment-tracker.app --app investment-tracker-ai-staging

# В DNS provider (Porkbun/Cloudflare/whatever):
# CNAME ai-staging.investment-tracker.app → investment-tracker-ai-staging.fly.dev
# или A/AAAA по адресам, которые fly purports

# Дождаться issue:
flyctl certs check ai-staging.investment-tracker.app --app investment-tracker-ai-staging
# → "Verified" (5-15 минут)

# Обновить Core API staging Doppler:
doppler secrets set AI_SERVICE_URL=https://ai-staging.investment-tracker.app \
  --project investment-tracker-api --config stg --silent

doppler secrets download --project investment-tracker-api --config stg --no-file --format env | \
  flyctl secrets import --app investment-tracker-api-staging
```

DNS — НЕ блокер для закрытия TD-070. `*.fly.dev` URL валиден для smoke и Slice 6a.

---

## 9. Post-deploy: docs + state updates

После успешного smoke:

1. **`docs/TECH_DEBT.md`** — TD-070 → ✅ closed (с датой + commit SHA + Fly app name).
2. **`docs/03_ROADMAP.md`** — Месяц 3 / AI Service / FastAPI deploy → отметить done.
3. **`docs/PO_HANDOFF.md`** — § 9 (AI Service deploy pending) убрать или зачеркнуть; main tip обновить.
4. **`docs/README.md`** — Wave 2 TASK_05 строка: убрать «(staging deploy pending TD-070)».
5. **`docs/RUNBOOK_ai_flip.md`** — добавить заметку «staging up на `…fly.dev`/`ai-staging.it.app` since YYYY-MM-DD; prod flip pending».

Один docs-only commit прямо в main (`--no-verify` если lefthook не подцепился).

---

## 10. Rollback procedure (if shit breaks)

Если staging AI начнёт жрать $$ или DDoS-ить Anthropic:

```bash
# 1. Suspend все machines:
flyctl scale count 0 --app investment-tracker-ai-staging

# 2. (Опционально) удалить app:
flyctl apps destroy investment-tracker-ai-staging
```

Core API упадёт обратно в 404-swallow поведение для AI calls (по дизайну, см. TD-072 / RUNBOOK_ai_flip.md). Frontend это переживает.

---

## 11. Checklist (для самопроверки)

- [ ] `apps/ai/fly.staging.toml` создан + закоммичен
- [ ] `flyctl apps create investment-tracker-ai-staging` ✅
- [ ] Doppler project `investment-tracker-ai` + config `stg` ✅
- [ ] 4 minimum secrets в Doppler stg (INTERNAL_API_TOKEN, ANTHROPIC_API_KEY, CORE_API_URL, CORE_API_INTERNAL_TOKEN)
- [ ] Doppler → Fly sync для AI staging ✅
- [ ] Doppler → Fly sync для Core API staging обновил AI_SERVICE_URL + AI_SERVICE_TOKEN
- [ ] `flyctl deploy --config apps/ai/fly.staging.toml` ✅
- [ ] Healthcheck `/healthz` → 200
- [ ] Auth check (без token → 401)
- [ ] `flyctl logs` чистые
- [ ] Docs updated (TECH_DEBT, ROADMAP, PO_HANDOFF, README, RUNBOOK_ai_flip)
- [ ] (опц.) DNS `ai-staging.investment-tracker.app`

После всех ✅ — TD-070 закрыт, Slice 6a (Insights) разблокирован для UI.
