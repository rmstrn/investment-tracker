# CC Kickoff — API CORS Middleware (micro-slice)

**Scope:** добавить Fiber CORS middleware в Core API с allowlist origins из `ALLOWED_ORIGINS` config. Раскрыть headers которые фронту нужно читать (X-RateLimit-*, X-Scope-Cut-*, X-Request-ID, X-Async-Unavailable). Обновить ops/secrets.keys.yaml + RUNBOOK_deploy.md.
**Anchor:** 50-100 LOC (middleware wiring + config field + secrets doc + RUNBOOK note + 1-2 unit tests).
**Worktree:** `D:/investment-tracker-api-cors` (branch `feature/api-cors` from main).
**Base:** main tip = `cdfca5d` + web-root-redirect PR squash (SHA TBD после того как CC сделает и PO смержит).
**Parallels with:** `D:/investment-tracker-web-root` (root-redirect) — другой worktree, zero code overlap (код в apps/api vs apps/web).

---

## Context

Core API сейчас не имеет CORS middleware вообще. Обнаружено grep'ом по `apps/api/internal/`:
```
grep -riE 'cors|AllowedOrigins|Access-Control' apps/api → 0 matches
```

Бэк работал через curl (CI smoke, k6 tests) без проблем, но как только web на Vercel начал ходить `fetch()` напрямую на `api-staging.investment-tracker.app` — браузер блокирует preflight. Типичный production-only gap: локальная разработка проходила через Next.js rewrites (`apps/web/next.config.js` proxy к localhost:8080), поэтому preflight не требовался.

**Правильное решение:** explicit origin allowlist (НЕ `Access-Control-Allow-Origin: *`), comma-separated из env var. Причины:
1. `*` несовместим с `AllowCredentials: true` (браузеры ignore).
2. Мы ходим на API с Clerk-установленными куками (через Authorization header всё же, но credentials=include может быть в будущем).
3. Public API allowlist — правильный хигиенический default для финансового приложения.

---

## Current state (main tip `cdfca5d` + возможный root-redirect PR)

### Fiber server assembly
- `apps/api/internal/server/server.go` — builds Fiber app, регистрирует middleware'ы (auth, idempotency, rate-limit), handlers через ServerInterface (oapi-codegen).
- `apps/api/internal/config/` — Koanf/`caarlos0/env`-style env loader. Config struct в `config.go` (проверь актуальное имя файла).
- `apps/api/internal/middleware/` — текущие middleware'ы (auth, idempotency, etc.).

### Что нужно добавить
1. **Config field.** В `internal/config/config.go` (или как там named) — `AllowedOrigins []string` с tag для env `ALLOWED_ORIGINS` (comma-separated parser). Default: `["http://localhost:3000"]` для local dev удобства.
2. **CORS middleware wiring.** В `internal/server/server.go` подключить `github.com/gofiber/fiber/v3/middleware/cors` перед route registration:
   ```go
   app.Use(cors.New(cors.Config{
       AllowOrigins:     cfg.AllowedOrigins,
       AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
       AllowHeaders:     []string{"Authorization", "Content-Type", "X-User-Id", "Idempotency-Key", "X-Request-ID"},
       ExposeHeaders:    []string{
           "X-Request-ID",
           "X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset",
           "X-Async-Unavailable",
           "X-Partial-Portfolio", "X-FX-Unavailable", "X-Clerk-Unavailable",
           "X-Search-Provider", "X-Benchmark-Unavailable", "X-Analytics-Partial",
           "X-Withholding-Unavailable", "X-Tax-Advisory", "X-Export-Pending",
       },
       AllowCredentials: true,
       MaxAge:           int((24 * time.Hour).Seconds()),
   }))
   ```
   CC проверь точный API Fiber v3 `cors` пакета — может быть `AllowOrigins string` (comma-joined) а не slice. Подстрой под реальный API.
3. **`ops/secrets.keys.yaml`** — добавить `ALLOWED_ORIGINS` в required list (с notes что это CSV URLs без trailing slash).
4. **`RUNBOOK_deploy.md` § Prerequisites** — обновить список Doppler secrets (добавить `ALLOWED_ORIGINS`).
5. **1-2 unit теста** в `internal/server/server_test.go` (или adjacent): CORS preflight от allowed origin → 204 + proper headers; CORS preflight от disallowed origin → no CORS headers (browser заблокирует). Можно через Fiber `app.Test()`.

### Что CC должен проверить pre-flight
- Что Fiber v3 `middleware/cors` импорт path правильный (`github.com/gofiber/fiber/v3/middleware/cors` — возможно у v3 он другой).
- Что config loader корректно parse'ит comma-separated env → slice (если нет — добавить split).
- Что /healthz / /metrics роуты не блокируются CORS (обычно не важно — Fly internal health checks идут без Origin header, но лучше explicitly allow).
- Нет ли где-то hardcoded `Access-Control-*` header sets в ручных handlers (маловероятно, но grep ради безопасности).

---

## Что НЕ делаем

1. **Wildcard `*.vercel.app`** — security risk, attacker регистрит `evil.vercel.app` и читает user data. Exact match only.
2. **CSP / Content-Security-Policy headers** — отдельный слайс по security hardening.
3. **Rate-limit preflight OPTIONS requests** — Fiber CORS middleware сам их обрабатывает before main rate limiter.
4. **CORS для SSE endpoint `/v1/ai/chat/stream`** — SSE это EventSource-style, не `fetch()` с credentials. НО frontend использует `fetch()` + `ReadableStream` (см. TASK_07 Slice 3 `sse-client.ts`), поэтому CORS правила на `/v1/ai/chat/stream` ТАКИЕ ЖЕ как на обычные endpoints — middleware purepose применяется глобально, никаких исключений.
5. **CORS headers для /healthz, /metrics** — Fly internal checks идут без Origin, CORS middleware их no-op'ит. Не нужно explicit skip.
6. **Refactoring существующих middleware'ев** — CORS встаёт как дополнительный слой, other middleware не трогаем.

---

## Acceptance criteria

- `ALLOWED_ORIGINS` читается из env, default = `http://localhost:3000`.
- Fiber CORS middleware подключён до всех route handlers.
- Response на OPTIONS preflight от allowed origin содержит:
  - `Access-Control-Allow-Origin: <exact origin>`
  - `Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS`
  - `Access-Control-Allow-Headers: Authorization,Content-Type,...`
  - `Access-Control-Expose-Headers: X-Request-ID,X-RateLimit-Limit,X-RateLimit-Remaining,X-RateLimit-Reset,X-Async-Unavailable,X-Partial-Portfolio,...`
  - `Access-Control-Allow-Credentials: true`
  - `Access-Control-Max-Age: 86400`
- Response на OPTIONS preflight от disallowed origin НЕ содержит `Access-Control-Allow-Origin` header.
- `ops/secrets.keys.yaml` updated (ALLOWED_ORIGINS в required list).
- `RUNBOOK_deploy.md` updated.
- `go vet ./...` + `golangci-lint run` green.
- `go test ./apps/api/...` green (baseline + новые CORS тесты).
- `goimports -w .` applied.

---

## Open questions (CC решает в процессе)

1. Fiber v3 CORS config — `AllowOrigins` это `string` (CSV) или `[]string`? → CC проверит godoc / API. Если string — config field тоже пусть будет string + pass as-is. Если slice — парсить CSV в config loader.
2. `AllowCredentials: true` vs Bearer token (Authorization header) — technically не нужен для Bearer flow (credentials=include отвечает только за куки), но оставляем true на будущее если Clerk куки будут. → **Yes, keep true.** Edge case: `AllowCredentials: true` + `AllowOrigins: ["*"]` браузер игнорит. Мы origins не wildcard'ом, safe.
3. MaxAge 24h — агрессивное кэширование preflight. Safari max 10 min, Chrome max 2h. Эффективно получим 2h. → OK, оставляем 86400, браузер capped.

---

## Deliverables

1. PR в main: `feat(api): CORS middleware with ALLOWED_ORIGINS allowlist`.
2. GAP REPORT перед merge (в чат PO) — CI status, LOC count, TDs opened/closed (не ожидаю новых TDs).
3. **После PO approval — CC сам делает merge + cleanup + docs pass (PO нигде не жмёт кнопки в GitHub):**
   - `gh pr merge <N> --squash --delete-branch` (squash-only per PO_HANDOFF § 3).
   - В main worktree `D:/investment-tracker`: `git checkout main && git pull origin main`.
   - `git worktree remove D:/investment-tracker-api-cors`.
   - `git branch -D feature/api-cors` (после squash локальная ветка не выглядит merged — `-D` нужен).
   - Обновить `docs/merge-log.md` — добавить запись merge'а (дата, squash SHA, scope, LOC delta).
   - Обновить `docs/PO_HANDOFF.md § 1` и § 2 — зафиксировать новый main tip SHA.
   - Обновить `docs/DECISIONS.md` — добавить запись "implicit CORS → allowlist-based" (ссылка на этот kickoff + squash SHA).
   - Commit + push directly to main (docs-only direct push allowed per PO_HANDOFF § 3).
   - Финальный ping PO в чат: "merged + cleaned + docs done, main tip now `<SHA>`. Готово к Doppler + fly deploy с твоей стороны".

---

## PO notes (что реально делает PO — после CC ping'а "merged")

- Squash-only policy — CC merges сам через `gh pr merge --squash --delete-branch`. PO в GitHub UI не заходит.
- `doppler secrets set ALLOWED_ORIGINS=https://staging.investment-tracker.app --project investment-tracker-api --config stg` (если ещё не сделано).
- `fly deploy -a investment-tracker-api-staging` для пересборки образа с новым кодом + Doppler pull.
- Smoke: `curl -i -X OPTIONS https://api-staging.investment-tracker.app/portfolio -H "Origin: https://staging.investment-tracker.app" -H "Access-Control-Request-Method: GET"` → ожидаем 204 + `Access-Control-Allow-Origin: https://staging.investment-tracker.app` + все expose-headers.
- После этого UI на `https://staging.investment-tracker.app` начнёт нормально ходить в API.
