# CC Kickoff — PR C (Core API deploy: Fly.io + Dockerfile + k6 smoke + runbook)

**Scope:** Ship Core API to Fly.io prod + staging. Dockerfile, fly.toml, GitHub Actions deploy workflow, k6 smoke suite, `RUNBOOK_deploy.md`.
**Anchor:** 1800-2400 LOC (включая Dockerfile, fly.toml, .github/workflows, k6 scenarios, runbook, ops scripts).
**Worktree:** `D:/investment-tracker-pr-c` (feature/pr-c-deploy branch from main).
**Base:** main tip = `4e7c67a` (или свежее — проверь `git fetch origin main`).
**Parallels with:** TASK_07 Slice 2 (web) в другом worktree. Drift risk = 0 (apps/api/** + .github/workflows/** + tools/k6/** + docs/RUNBOOK_deploy.md vs apps/web/**).

---

## Context

Полный scope + skeletons уже в `D:\СТАРТАП\docs\PR_C_preflight.md`. Этот kickoff = thin wrapper с state refresh и continuation prompt.

**Что поменялось с момента написания PR_C_preflight:**

1. **B3-ii merged** (PR #44, squash SHA see merge-log) — AI SSE reverse-proxy live в Core API. k6 scenario 4 (`ai_chat_stream.js`) теперь имеет реальный target.
2. **B3-iii merged** (PR #46, squash `08e09f4`, docs `0c3bea5`) — write path полный: Clerk + Stripe webhooks, accounts CRUD, transactions CRUD, idempotency via webhook_events table. TASK_04 closed 9/9. `asynqpub.Enabled() = false` в prod — интендед scope-cut, `X-Async-Unavailable: true` header должен появляться в staging smoke (sanity check).
3. **TASK_07 Slice 1 merged** (PR #45, squash `a622bd3`) — Clerk auth + Dashboard vertical slice в apps/web. Deploy блокер для web не здесь, но api.investment-tracker.app DNS → Fly после PR C unblock'ает web prod deploy.
4. **TD renumbering:** PR_C_preflight.md "Follow-up TDs" были TD-048..052 — теперь TD-060..064 (TD-048..052 заняты реальным debt'ом: SSE error payload, Last-Event-ID, Path B timeout, SSE parser dup, AIRateLimit pre-increment). Renumbering уже committed в PR_C_preflight.md — используй новые номера при создании entries в TECH_DEBT.md.

**Что НЕ поменялось:**
- Dockerfile skeleton (distroless static-debian12 nonroot, multi-stage, ~15-20 MB final image).
- fly.toml skeleton (primary_region = fra, min_machines_running = 2, rolling strategy, release_command = migrate up).
- Secrets inventory (14 secrets — DATABASE_URL, REDIS_URL, CLERK_*, STRIPE_*, AI_SERVICE_URL, CORE_API_INTERNAL_TOKEN, KEK_MASTER_V1/PRIMARY_ID, POLYGON_API_KEY, SENTRY_DSN, POSTHOG_API_KEY).
- GitHub Actions pipeline (build → push GHCR → deploy staging → k6 smoke → manual approve → deploy prod → k6 smoke prod → tag release).
- k6 smoke suite (5 scenarios: health, portfolio_read, positions_read, ai_chat_stream, idempotency).
- DoD (Dockerfile builds <25 MB, fly config validate зелёный, staging deploy clean, 14 secrets set, k6 smoke 24h clean, runbook peer-reviewed, rollback rehearsed).

---

## What PR C actually ships (checklist)

Каждый файл — приблизительный LOC в скобках.

1. `apps/api/Dockerfile` (~50 LOC) — skeleton в PR_C_preflight § Dockerfile.
2. `apps/api/fly.toml` (~70 LOC) — skeleton в PR_C_preflight § fly.toml. Пишется для prod app `investment-tracker-core-api`; staging app reuses тот же toml через `fly deploy -a investment-tracker-core-api-staging`.
3. `apps/api/.dockerignore` (~20 LOC) — `node_modules/`, `.git/`, `**/*.test.go`, `tools/`, `docs/`, `.env*`.
4. `.github/workflows/deploy-core-api.yml` (~250 LOC) — full pipeline из PR_C_preflight § GitHub Actions.
5. `ops/secrets.env.template` (~30 LOC) — committed template, empty values, 14 keys.
6. `ops/scripts/verify-prod-secrets.sh` (~50 LOC) — wraps `fly secrets list` + diff against template.
7. `tools/k6/smoke/health.js` (~40 LOC) — готов в PR_C_preflight.
8. `tools/k6/smoke/portfolio_read.js` (~60 LOC).
9. `tools/k6/smoke/positions_read.js` (~60 LOC).
10. `tools/k6/smoke/ai_chat_stream.js` (~80 LOC) — SSE open + first-byte < 2s + ≥1 `data:` event + clean close.
11. `tools/k6/smoke/idempotency.js` (~70 LOC).
12. `tools/k6/run-smoke.sh` (~40 LOC) — wrapper aggregating exit codes.
13. `tools/k6/seed-user.sh` (~60 LOC) — creates a Clerk test user + seeds one account + returns JWT для использования в k6 scenarios.
14. `docs/RUNBOOK_deploy.md` (~400-500 LOC) — 8 headings (pre-deploy checklist, standard flow, emergency hotfix, rollback, debugging, secrets rotation, scaling, migrations).
15. `docs/DECISIONS.md` — entry: «Fly.io for Core API deploy» (region = fra, strategy = rolling, single-region for MVP, distroless image, release_command для migrations).
16. `docs/merge-log.md` — PR C entry.
17. `docs/TECH_DEBT.md` — 5 new entries TD-060..064 (KMS, multi-region, APM, per-tenant rate limits, blue-green).

**Не ship'аем в PR C:**
- Worker deploy (asynq) — PR D, после появления первого реального worker'а.
- DNS записи — admin action, не код.
- `api.investment-tracker.app` сертификат — Fly auto-provisions, требует DNS first.
- Multi-region — TD-061.
- APM tracing — TD-062.
- Blue-green — TD-064.

---

## Pre-flight audit (до write-phase)

Прочитай PR_C_preflight.md ПОЛНОСТЬЮ перед любыми изменениями. Потом запусти:

1. `git fetch origin main && git log -1 origin/main` — confirm base SHA = 4e7c67a (или свежее; если свежее — rebase branch на актуальный main до open PR).
2. `ls apps/api/` — confirm что `cmd/core-api/`, `db/migrations/`, `go.mod` on place. `Dockerfile.dev` есть (dev compose), production `Dockerfile` отсутствует.
3. `go version` — должен быть go1.25 (compile target в Dockerfile).
4. `cat apps/api/cmd/core-api/main.go | grep -n "migrate"` — confirm что `./core-api migrate up` subcommand существует (обязательно для `release_command`).
5. `cat apps/api/internal/http/health.go` — confirm `/health` возвращает `{status, version, db, redis}`. Version должна быть set'нута из `main.Version` build-time var.
6. `ls .github/workflows/` — confirm у тебя нет конфликта имён с существующим workflow.
7. `ls tools/k6/ 2>/dev/null || echo "clean slate"` — обычно нет.
8. `gh auth status` — confirm CC может create/merge PR через gh CLI.
9. `fly version 2>/dev/null || echo "flyctl not installed"` — если нет, install via https://fly.io/docs/flyctl/install/.
10. **Не запускай** `fly deploy` локально — deploy через CI only. Local `fly auth signup/login` нужен только если проверяешь `fly config validate`.

## GAP REPORT v1 — что ожидается

Короткий paste мне с:
- Pre-flight audit results (10 пунктов выше).
- Scope delta vs PR_C_preflight: что изменилось в repo между написанием preflight'а и сейчас, нужна ли корректировка любого skeleton'а.
- LOC прогноз по файлам (sum → 1800-2400 target).
- Questions (например: создавать ли staging app с нуля через `fly apps create` в runbook'е как manual step, или добавить idempotent `fly apps create --or-ignore` в CI? Какая GHCR org — `ruslan-m` или org-level?).
- Risk assessment (например: `release_command` timeout при миграциях — есть ли у нас long-running миграций сейчас?).
- Confirmation: ни один файл НЕ создан/изменён до моей отмашки.

Я посмотрю → отвечу на вопросы → дам go на write-phase.

## Write-phase protocol

1. Пиши файлы по чеклисту (17 items выше). Commit incremental: Dockerfile+dockerignore → fly.toml → secrets template+verify script → GHA workflow → k6 suite → runbook → DECISIONS entry → TECH_DEBT entries.
2. Каждый commit должен быть conventional (`feat(ops): ...`, `docs(ops): ...`, `ci(deploy): ...`).
3. Lint что применимо:
   - `fly config validate -c apps/api/fly.toml` (требует flyctl).
   - `hadolint apps/api/Dockerfile` (если установлен; иначе skip с note в GAP REPORT v2).
   - `shellcheck ops/scripts/*.sh tools/k6/*.sh`.
   - `actionlint .github/workflows/deploy-core-api.yml` (если установлен).
   - `go build` локально в apps/api — Dockerfile'у не надо доверять слепо, binary должен билдиться из той же go.mod.
4. **НЕ запускай реальный deploy.** CI/Fly side = post-merge PO responsibility. CC scope = код + config + runbook, не prod operations.

## Acceptance (GAP REPORT v2)

- [ ] Dockerfile builds локально: `docker build -t core-api:test -f apps/api/Dockerfile .` → image size < 25 MB, binary run'ится `docker run core-api:test --version` exit 0.
- [ ] `fly config validate -c apps/api/fly.toml` → зелёный (или note что flyctl not installed в CI-only environment).
- [ ] GHA workflow syntactically valid: `actionlint` или `gh workflow view deploy-core-api.yml` parse clean.
- [ ] k6 scripts — `k6 inspect tools/k6/smoke/*.js` зелёный для каждого scenario.
- [ ] Все 17 файлов созданы, LOC distribution совпадает с прогнозом (±20%).
- [ ] RUNBOOK_deploy.md полный 8 headings, каждый с конкретными command'ами (не placeholder'ами).
- [ ] DECISIONS entry в stock format (context / decision / consequences).
- [ ] 5 TD entries в TECH_DEBT.md с TD-060..064.
- [ ] PR description цитирует `PR_C_preflight.md` как источник scope + checklist completed + smoke plan post-merge.
- [ ] Branch rebased on latest main, squash-ready.

## Merge protocol

1. `gh pr create --base main --head feature/pr-c-deploy --title "ops: Core API deploy infrastructure (PR C)"` с description из template.
2. Wait for CI зелёный (build + lint + k6 scripts validate + existing go tests).
3. `gh pr merge --squash --delete-branch` (self-merge — squash-only policy per TD-006).
4. Post-merge docs pass: merge-log.md entry с squash SHA + timestamp + zero deploy status ("infrastructure merged; first real deploy pending Fly app creation + DNS + secrets import").
5. Final report мне: PR number, squash SHA, docs SHA, diff stat, opened TDs, worktree cleanup status, **what PO needs to do next** (create Fly apps, import secrets, point DNS, trigger first staging deploy via `workflow_dispatch`).

---

## Continuation prompt (копировать в новый CC чат)

```
Привет. Я Ruslan, Product Owner investment-tracker
(AI-инвест-трекер EU: Next.js web + Go Core API + Python AI Service).
Оркеструю параллельные Claude Code сессии — каждая CC работает
свой PR в отдельном worktree. Главный проект: D:\СТАРТАП.

Первым делом читай в этом порядке:

  D:\СТАРТАП\docs\PO_HANDOFF.md                   (полный handoff)
  D:\СТАРТАП\docs\README.md                       (wave status)
  D:\СТАРТАП\docs\CC_KICKOFF_pr_c.md              (ТВОЙ kickoff —
                                                    читай особо
                                                    внимательно)
  D:\СТАРТАП\docs\PR_C_preflight.md               (полный scope
                                                    + skeletons)
  D:\СТАРТАП\docs\02_ARCHITECTURE.md              (scope-cut headers,
                                                    patterns)
  D:\СТАРТАП\docs\DECISIONS.md                    (ADR log)
  D:\СТАРТАП\docs\merge-log.md                    (recent merges —
                                                    B3-iii #46, Slice 1 #45)

Текущий статус:
- main tip = 4e7c67a (проверь fetch — может быть свежее).
- TASK_04 Core API: 9/9 PRs merged. B3-ii SSE proxy + B3-iii
  write-path live в main.
- TASK_07 Slice 1 (Clerk + Dashboard) merged (PR #45). Slice 2
  идёт параллельно в другом worktree — НЕ пересекается
  (apps/web/** vs твой apps/api/** + ops + tools/k6).
- Prod environment ещё НЕ существует — PR C это первый
  infrastructure commit. DNS, Fly apps, secrets — post-merge PO work.

Ты делаешь PR C: Core API deploy infrastructure.
Scope в CC_KICKOFF_pr_c.md + полные skeletons в PR_C_preflight.md.
Кратко 17 файлов:
- apps/api/Dockerfile (distroless, multi-stage, <25 MB)
- apps/api/fly.toml (fra region, rolling, min 2 machines)
- apps/api/.dockerignore
- .github/workflows/deploy-core-api.yml
- ops/secrets.env.template + ops/scripts/verify-prod-secrets.sh
- tools/k6/smoke/*.js (5 scenarios) + run-smoke.sh + seed-user.sh
- docs/RUNBOOK_deploy.md (8 headings)
- docs/DECISIONS.md entry
- docs/TECH_DEBT.md: TD-060..064 (KMS, multi-region, APM,
  per-tenant rate limits, blue-green) — NOT TD-048..052,
  те заняты реальным debt.
- docs/merge-log.md entry

Anchor 1800-2400 LOC. Real deploy (Fly apps creation, DNS, secret
import) = post-merge PO responsibility, не твой scope.

Стиль общения (из PO_HANDOFF):
- Русский, коротко, без over-formatting.
- Decisions-first (что делать → почему).
- Видишь риск — говори сразу.
- Верифицируй через Read перед confirm (state loss бывал).
- Squash-only merge policy (TD-006).
- GAP REPORT перед write-phase.

Cycle:
1) Прочти docs в указанном порядке.
2) Pre-flight audit (10 checks в CC_KICKOFF_pr_c.md § Pre-flight audit).
3) GAP REPORT v1: scope delta, LOC прогноз, questions, risk
   assessment, confirmation что ни один файл не изменён.
4) Я даю отмашку.
5) Write-phase (incremental commits по секциям).
6) GAP REPORT v2: DoD mapping, CI status, branch SHA, merge
   readiness.
7) Я даю go/no-go.
8) Ты сам мерджишь (gh pr create + gh pr merge --squash
   --delete-branch).
9) Post-merge docs pass (merge-log + TECH_DEBT).
10) Final report мне: PR number, squash SHA, docs SHA, diff stat,
    opened TDs, worktree cleanup status, what PO needs to do next
    (Fly apps creation, DNS, secrets import, trigger first
    staging deploy).

Start: прочти все указанные docs, потом подтверди готов к
pre-flight audit.
```
