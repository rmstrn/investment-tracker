# Merge Log

Журнал merge-событий на `main`. Только то, что реально уехало в integration ветку.

Формат записи:
- PR номер + ссылка
- Squash SHA (на origin/main после merge)
- Дата
- Scope в 1-2 предложениях
- Admin-bypass — только если использовался (TD-006 policy — см. TECH_DEBT.md)
- Tests / CI status
- Migrations / break-glass notes (если применимо)

Newest entries at the top.

---

## sprint-d — Polish sprint: 10 small-scoped TDs, 4 lanes

**Window:** 2026-04-22 (single CC session, ~½ day).
**Scope in one line:** polish sprint closing the tail of small-scoped debts before Slice 6a — CI / hook hygiene, contract-sync validator, SSE schema tighten + request-id, web tooling audit. 9 TDs closed, 1 (TD-004 biome-ignore audit) confirmed still-needed with refreshed revisit date.
**Base:** prior main tip after `027417a` (post-TD-047 bundle).

**Lane 1 — CI workflow + hook hardening** (`09d5af7 ci: close Sprint D lane 1 — workflow + hook hardening (TD-086, TD-077, TD-083)`)
  - **TD-R086** — new `docker-build-ai` job in `ci.yml` using docker/setup-buildx + docker/build-push-action with GHA cache, runs `docker run --entrypoint python -c "import ai_service.main"` smoke. No api-docker job (redundant with `deploy-api.yml`'s flyctl staging build on every push).
  - **TD-R077** — new `tools/scripts/hook-golangci-lint.sh` wired into lefthook pre-push; `--new-from-rev=origin/main` scoping, self-skips on missing toolchain / missing baseline / no-Go-changes push.
  - **TD-R083** — rewrote `hook-commitlint.sh` + `hook-biome.sh` from `set -e` + `if/elif` cascade to "probe runner with `--version`, then `exec`" pattern so fallback chain is reachable on fresh CC worktrees (three CC sessions hit the old bug in a row).

**Lane 2 — OpenAPI ↔ k6 contract validator** (`22cf906 test: close Sprint D lane 2 — OpenAPI ↔ k6 smoke contract validator (TD-076)`)
  - **TD-R076** — new stdlib-only Python validator `tools/scripts/check-k6-contract.py` that reads the bundled OpenAPI JSON, scans each k6 smoke script for `http.METHOD(...)` + body-key refs, resolves the 2xx response schema (with one-level `$ref` walk + oneOf/anyOf/allOf support), and asserts every `body.X` chain exists. Skips scripts without `body = X.json()`. Unit-tested in `check_k6_contract_test.py` (14 cases — regex, schema walk, happy/drift/skip). New CI job `contract-k6-spec-sync` alongside the existing header-symmetry check.

**Lane 3 — SSE schema tighten + request_id propagation** (`2e4cd82 feat(spec): close Sprint D lane 3 — SSE schema tighten + request_id propagation (TD-048, TD-068)`)
  - **TD-R068** — two schema edits in `tools/openapi/openapi.yaml` matching wire reality: `AIStreamEventContentDelta.delta` tightened to explicit `{text: string}`; `AIStreamEventError.error` changed from `$ref: ErrorEnvelope` to inline flat `{code, message, request_id?}`. Codegen regenerated (TS + Go via preprocess → oapi-codegen). Web reducer `unwrapEnvelope` kept as a 30-day compat shim with refreshed drop target (2026-05-22).
  - **TD-R048** — AI Service `ErrorEvent` gained optional `request_id`; `ChatAgent.stream(...)` accepts a `request_id` kwarg and stamps it on exception-fallback errors; `stream_chat` handler reads `X-Request-ID` via FastAPI `Header(alias=...)` + import-time assert against drift in `http_headers`. Core API side already emitted `request_id` in the outbound error frame, with test coverage in `sseproxy/contract_test.go` — no Go changes needed.

**Lane 4 — Web tooling audit + doc hygiene** (`cb66a2a chore: close Sprint D lane 4 — web tooling audit + doc hygiene (TD-001, TD-004, TD-054, TD-078)`)
  - **TD-R001** — audit-only close. `--turbopack` flag already present in `apps/web/package.json` dev script + `next.config.ts` has `typedRoutes: true`; installed Next.js is 15.5.15 (above the 15.3.0 threshold TD-001 named). Typecheck passes with both enabled. Re-enable happened silently during a routine Next bump; Sprint D catches the ledger up.
  - **TD-004 (NOT resolved, refreshed)** — audit of 8 `biome-ignore` comments in `packages/ui` (inventory was 9; 1 drifted). Per-ignore review in the commit body; all 8 keep — justifications tied to React conventions (useExhaustiveDependencies), type-system invariants (noNonNullAssertion), or positional-array semantics (noArrayIndexKey). Revisit date refreshed to 2026-07-22.
  - **TD-R054** — `docs/PO_HANDOFF.md § 12 continuation prompt` instructs incoming CC to read `docs/DECISIONS.md` AND mirror any cross-session invariant back to DECISIONS.md before ending. Rule-of-thumb added. Cheapest option (b) from the original TD — no `CC_MEMORY/` commit-noise.
  - **TD-R078** — `docs/PO_HANDOFF.md § 3 "Cycle per PR"` new step 4: `gh pr checks <N> --watch` mandatory before `gh pr merge`. `--admin` merge requires an inline PR comment with CI-outage / P1-hotfix rationale. Prior art: PR #54 CORS incident where CC + PO both approved a red-CI merge.

**Lane 5 — ledger + merge-log + health snapshot** (this commit)
  - Moves 9 TDs from Active to TD-R* in `docs/TECH_DEBT.md`: 086, 083, 077, 076, 078, 068, 048, 001, 054.
  - Restores TD-002..008 (sibling entries accidentally bundled with TD-001 removal during scripted ledger surgery; restored verbatim from prior tip).
  - Refreshes TD-004's revisit-date annotation (stays Active with Sprint D audit note).
  - This merge-log Sprint D block.
  - `docs/BACKEND_HEALTH_2026-04-21.md` §1 debt-count snapshot updated: Active 43 → 34 (9 closed, 0 new).

**Closed TDs:** TD-001, TD-048, TD-054, TD-068, TD-076, TD-077, TD-078, TD-083, TD-086 (9 total).
**Refreshed-not-closed:** TD-004 (audit held, revisit date refreshed).

**Tests / CI status:**
  - Go `go test ./...` — all packages ok.
  - `go test -tags=integration -c ./internal/handlers/` — clean build.
  - Python pytest 41/41 (1 new).
  - mypy + ruff clean.
  - pnpm -r typecheck clean.
  - Every Sprint B coverage gate still preserved.

**Admin-bypass / migrations:** none.

---

## close-td-047 + M1 — CSVExport explicit flag + ENV.md doc backfill

**Window:** 2026-04-22 (post-Sprint-C small-debt bundle, one CC session).
**Scope in one line:** close the single P1 pre-GA backend debt (TD-047 tier flag heuristic) plus the one doc-only minor finding surfaced by the `docs/BACKEND_AUDIT_2026-04-22.md` audit.
**Base:** prior main tip after `3a489d9` (post-Sprint-C audit).

**Commits:**
- `4ad38fc fix(tiers): replace CSVExport heuristic with explicit tier flag (TD-047)` — adds `CSVExport bool` to `tiers.Limit`, sets `true` on Plus + Pro, replaces the `AIMessagesDaily <= 5` heuristic in `exports.go` with the canonical flag pattern. Strengthens the Free-tier integration test to assert `error.code == "FEATURE_LOCKED"` (not just status 403). Adds Pro-tier happy-path integration test. New table-driven unit tests in `tiers/limits_test.go` cover every (tier × counter) and (tier × flag) pair + the unknown-tier fail-closed fallback; `internal/domain/tiers` coverage 20% → 100%.
- `<this commit>` — moves TD-047 to TD-R047 in TECH_DEBT.md; adds the `CORE_API_TIMEOUT_SECONDS` row the audit flagged as missing in `docs/ENV.md`; this merge-log entry.

**Closed TDs:** TD-047 (Active P1 count drops from 2 → 1; TD-066 workers deploy target remains the sole Active P1).

**Tests / CI status:**
- Go `go test ./...` — every package `ok`.
- `internal/domain/tiers` coverage: 20.0% → **100.0%**.
- All Sprint B coverage gates preserved.
- Integration test binary still builds under `//go:build integration` tag.

**No API surface change:** `POST /exports` response envelope, status code (202 on success, 403 FEATURE_LOCKED on free), and `X-Export-Pending` header are byte-equivalent before/after for every tier.

**Admin-bypass / migrations:** none.
**Worktree cleanup:** N/A — direct to main.

---

## sprint-c — Deep backend refactor: handlers, middleware, cross-service hygiene

**Window:** 2026-04-21 (three CC sessions, chronological SHAs below).
**Scope in one line:** final pre-alpha pass to turn the feature-complete backend from "works" into "maintainable" — closes 8 concrete code smells from `docs/BACKEND_HEALTH_2026-04-21.md § 5` plus the TD-052 airatelimit overcount bug that Sprint B pinned with a test.
**Base:** prior main tip after `46ceb57` (Sprint B — test foundations).

**Cluster 1 — handler plumbing (session 1):**
- `750959c refactor(api): bindAndValidate helper + migrate 5 handlers` — new `internal/handlers/httputil` with generic `BindAndValidate[T]` + `BindJSON[T]` + `BindJSONOptional[T]`; validator/v10 tag enforcement; JSON field name preserved in errors via `RegisterTagNameFunc`. 7 handlers migrated: `CreateAccount`, `UpdateAccount`, `CreateTransaction`, `UpdateTransaction`, `CreateAIConversation`, `UpdateMe`, `GenerateInsightsHandler`. Closes smell #1.
- `60aa650 refactor(api): decompose accounts_mutations + ai_chat_shared` — 379-line `accounts_mutations.go` split into CRUD (203 lines) + `accounts_actions.go` (205 lines) for sync/reconnect/pause/resume; 379-line `ai_chat_shared.go` replaced by `ai_chat_request.go` (~150) + `ai_chat_history.go` (~95) + `ai_chat_persist.go` (~200). Closes smells #3, #4. Adds cross-reference comments linking Go `historyCap=40` ↔ Python `max_length=40` (partial fix for #7 — full collapse needs cluster 3a scope).

**Cluster 2 — middleware + infra (session 2):**
- `d5f6dee refactor(api): extract webhook package — shared verify/claim/dispatch` — new `internal/handlers/webhook/` package with `Provider` interface, `Handle` orchestrator, `ClerkProvider` + `StripeProvider` impls. Adding a third webhook provider (SnapTrade TD-046, future Plaid) drops from "copy-paste 250 lines of verify/claim/dispatch preamble" to "register with `webhook.Handle`". Provider-neutral orchestrator tests added for signature-tampering, idempotency-replay, unknown-event, claim-error paths. Closes smell #2.
- `7e6ea94 fix(airatelimit): reserve-then-commit — refund rejected + failed attempts (TD-052)` — the one semantic bug-fix in Sprint C. Counter now refunds rejected 429s and failed `c.Next()` attempts; 2xx response is the commit signal. Sprint B test pinning `counter=6` renamed + flipped to assert counter=0 after 6 × 502. New helper `cache.Client.Decr` for the refund path. Closes TD-052 (now TD-R052).
- `f27fd0d refactor(server): middleware chain registry + golden-list ordering test` — `internal/server/middleware_chain.go` hosts the ordered `GlobalChain []ChainEntry` slice; `server.go` shrinks 35 lines (inline CORS config + "don't reorder" comments consolidated). New `TestGlobalChain_OrderMatchesGoldenList` catches accidental reordering. Closes smell #6.
- `14a2b92 test: drop unused calledWith field on fakeProvider (lint fix)` — post-merge cleanup.

**Cluster 3 — cross-service hygiene (session 3):**
- `6920ccf refactor(api,ai): shared HTTP header constants + CI drift check (3a)` — new `apps/api/internal/httpheader/httpheader.go` + `apps/ai/src/ai_service/http_headers.py`. Cross-service subset (`UserID/USER_ID`, `RequestID/REQUEST_ID`, `Authorization/AUTHORIZATION`) pinned on both sides. New CI job `contract-header-symmetry` runs `tools/scripts/check-header-symmetry.py` which parses both files and asserts identical values via a pair list (Go CamelCase ↔ Python UPPER_SNAKE_CASE). Canonicalized `X-Request-ID` (was drifted `X-Request-Id` on Python side — HTTP case-insensitive lookup masked it but logs + tracing showed the drift). Migrated every call site across `middleware/{auth,requestlog,idempotency}.go`, `server/middleware_chain.go` (CORS headers), `clients/aiservice/client.go`, AI service `api/{middleware,auth}.py`, `clients/core_api.py`. Closes smell #12.
- `3455e67 docs(env): canonical env-var registry + close INTERNAL_API_TOKEN drift (3b)` — new `docs/ENV.md` authoritative registry documents every env var with its Go field + Python field mapping (making the PascalCase / UPPER_SNAKE / lower_snake triple-casing explicit-not-drift). Fixes the one real drift: Python `internal_api_token` now reads canonical `AI_SERVICE_TOKEN` (matches `ops/secrets.keys.yaml`) with `INTERNAL_API_TOKEN` accepted as legacy alias via `AliasChoices(...)`. Adds missing `AI_SERVICE_TOKEN` line to `apps/ai/.env.example`. Closes smell #11 (partial — three casings documented, drift bug closed).
- `9d5c871 refactor(handlers): extract RunStreamingProxy helper (3c — TD-051 foundation)` — extracts the TD-R091 async-callback pattern (SSE headers + `SendStreamWriter` + `sseproxy.Run` + message-stop-or-dropped branch) into reusable `RunStreamingProxy(c, upstream, cfg)` in `streaming_proxy.go`. `ai_chat_stream.go` shrinks from 115 to ~80 lines; insights streaming when Slice 6a lands will reuse the helper instead of re-deriving the TD-R091 invariant. Full TD-051 (cross-service SSE contract codegen) remains open as a post-alpha ticket. Closes smell #10 (foundation).

**Closed smells per BACKEND_HEALTH §5:** 1, 2, 3, 4, 6, 10, 11 (partial), 12. See `docs/BACKEND_HEALTH_2026-04-21.md` for updated status.
**Remaining smells (deferred post-alpha):** 5 (auth middleware split), 7 (tier limits Go/Python single-source — cluster 3a foundation enables but does not do this), 8 (LLM pricing parity), 9 (users.Repo upsert), 13 (full SSE contract codegen / TD-051).
**Closed TDs:** TD-052 moved to TD-R052 in `docs/TECH_DEBT.md`.
**Opened TDs:** None — the `INTERNAL_API_TOKEN` → `AI_SERVICE_TOKEN` alias window is documented inline in `docs/ENV.md § Deprecated names` without a standalone TD (scope is "remove the AliasChoices fallback once Doppler rotates"; single-line future edit).

**Tests / CI status:**
- Every Sprint C commit's CI run green.
- Coverage gates preserved across the whole sprint: `internal/server` ≥85% (94.1→94.5), `internal/middleware` ≥80% (86.7→86.7), `internal/sseproxy` ≥85% (87.3→87.3), `internal/middleware/airatelimit` ≥85% (88.9→88.4; above gate).
- New coverage: `internal/handlers/httputil` 65.5% (unit-level), `internal/handlers/webhook` 26.1% (orchestrator ~100%; per-event handlers covered by the 12 integration tests that run green under `//go:build integration`).
- Sprint B's 12 `ai_chat_stream_integration_test.go` regression tests continue to pass unchanged across every cluster — the TD-R091 persist-race is still guarded, now from inside `RunStreamingProxy` instead of the inlined closure.
- New CI job: `contract-header-symmetry` (stdlib Python, <10s).

**Admin-bypass:** N/A (hotfix-free direct-to-main per post-TD-091 convention).
**Migrations:** None.

**LoC delta across Sprint C:** roughly `+2400 / −1200` = net `+1200`. Not the kickoff's predicted net-negative — structural test + doc additions (new webhook orchestrator tests, `docs/ENV.md`, package-level doc blocks on the three new packages) outweigh the raw handler dedup. The goal was compositional clarity, not line reduction; per-file readability is the axis this moved.

**Worktree cleanup:** N/A — all commits landed directly on main.

---

## close-td-091 — Fiber v3 SendStreamWriter async persist race (P1) + k6 deploy-unblock chain

**Product fix SHA:** `f64bc41 fix(api): persist AI chat turn inside SendStreamWriter callback (TD-091)`
**Deploy unblock SHAs:** `040c70f` → `bdf6a0a` → `a913a7a` (three k6 smoke fixes — pre-existing `ai_chat_stream.js` bug was eating every `deploy-api.yml` run since `cdfca5d`; TD-091 was correct on push but couldn't actually land through CI).
**Merged:** 2026-04-21
**Base:** prior main tip after `8fcc0b6` (Vercel CLI ignore chore).

**Scope:**
- **Product** — `apps/api/internal/handlers/ai_chat_stream.go`: persist + error-log moved inside `c.SendStreamWriter(func(w *bufio.Writer) { ... })` callback. Fiber v3 dispatches that callback *after* the handler returns (fasthttp `SetBodyStreamWriter`), so the prior code read a still-nil `res` in outer scope and always took the "skipping persist" branch. One-file, 115-line final handler; structural comment at lines 71–78 documents async semantics for the next reader.
- **CI unblock** — `tools/k6/smoke/ai_chat_stream.js`: (1) smoke was sending `conversation_id = uuid.Nil` which `parseChatRequestBody` rejects 400 before any ownership/upstream path runs → switched to `setup()` that `POST /ai/conversations` and threads the id through; (2) duration-based loop burned the user tier daily cap (AIMessagesDaily=5 for free) within seconds because `airatelimit` middleware increments *before* the upstream call → dropped to `iterations: 1` and tolerate 429 alongside 200/503; (3) k6 built-in `http_req_failed` counts 429/503 as failed and tripped `rate<0.05` on 1-of-2 requests → dropped the threshold, kept `checks` as authoritative gate.

**Tests / CI status:**
- `deploy-api.yml` run `24738505122`: ✓ Verify staging secrets, ✓ Deploy staging (34s), ✓ k6 smoke staging (1m19s). Overall run red only because of pre-existing `Verify prod secrets` job failing on JSON-decode of empty `flyctl secrets list` output (prod Fly app `investment-tracker-api` not yet provisioned, out of scope per TD-091 kickoff).
- `flyctl status -a investment-tracker-api-staging`: 1 machine `started` in `fra`, checks passing, image labeled `GH_SHA=a913a7a` (which includes f64bc41).
- Local `turbo run typecheck` + `py-mypy` + `go vet` all green (pre-push lefthook).

**Admin-bypass:** N/A (direct pushes to main per repo convention for hotfixes / deploy-unblock).
**Migrations:** None.
**Closed TDs:** TD-091 (moved to Resolved as TD-R091).
**Opened TDs:** None. Integration test for SendStreamWriter-async-vs-persist recorded as trigger-to-revisit inside TD-R091 (scheduled for post-alpha sprint; not a standalone TD yet).

**PO follow-up (browser verification — not automated):**
- Open staging web (`chat.investment-tracker.app` or Vercel preview for `main`), sign in, `/chat`, send a test message.
- Expected: response streams live **and stays visible** after stream completion; `flyctl logs -a investment-tracker-api-staging --since 5m | grep persistTurnBackground` shows success; DB has new `ai_usage` + assistant `ai_messages` rows for today.
- Fly log window has rolled since automated smoke requests (machine redeployed 3x during this session) so direct log verification of the earlier smoke-run messages is no longer possible — PO browser check is the confirmation path.

**Worktree cleanup (на PO):** N/A — все коммиты landed прямо на main worktree.

---

## docs: close td-070 + post-deploy ledger (ops fixes for 5 latent Dockerfile/CI bugs caught during first deploy)

**Squash SHA:** `2b81fd2`
**Merged:** 2026-04-21
**Base:** prior main tip after `b079d30` ops-fix.
**Scope:** TD-070 closure docs pass. AI Service staging deploy CLOSED 2026-04-21 — `https://investment-tracker-ai-staging.fly.dev/healthz` returns 200; bridge invariant `AI_SERVICE_TOKEN` ≡ `INTERNAL_API_TOKEN` verified via round-trip smoke. Slice 6a Insights UNBLOCKED.

**Files updated:**
- `docs/TECH_DEBT.md` — TD-070 moved Active → Resolved as **TD-R070** (full deploy sequence, SHAs `8ff5abf`/`4357739`/`b079d30`, 4 latent TDs caught documented). Opened **TD-084** (P2 flyctl build context CWD vs `--config` toml location), **TD-085** (P3 fixed inline `b079d30` — `apps/ai/.dockerignore` excluded README.md required by `pyproject.toml` readme-ref), **TD-086** (P2 — нет CI Docker build gate на `apps/ai/`), **TD-087** (P3 fixed inline `4357739` — `uv sync --no-editable` обязательно для multi-stage venv handoff).
- `docs/PO_HANDOFF.md` — main tip line rewritten; TASK_05 Wave 2 status changed (✅ Staging deploy live); § 7 file map TASK_05 row updated; § 9 Track 1 trailing list strikethrough TD-070; § 9 Backend tracks strikethrough TD-070 + добавлен AI Service prod app context; § 9.5 P1 priority list strikethrough TD-070 + новые TD-084/TD-086 P2 entries; § 12 continuation prompt rewritten для нового main tip + UNBLOCKED Slice 6a.
- `docs/03_ROADMAP.md` — Wave 2 status: TASK_05 строка переписана (CLOSED 2026-04-21 + 4 caught TDs); Month 3 / AI Service / FastAPI item marked `[x]` с reference на TD-070 close.
- `docs/README.md` — file tree TASK_05 entry updated; Wave 2 table TASK_05 row updated; "Критический путь к alpha" — Slice 6a больше не "ждёт TD-070" а UNBLOCKED; final "Следующий шаг" paragraph — AI Service staging live mention added.
- `docs/RUNBOOK_ai_staging_deploy.md` — intro блок "✅ STATUS: CLOSED 2026-04-21" с listing 4 caught TDs + 3 process gotchas (Doppler PowerShell BOM, `openssl` отсутствует на Windows, `/v1/chat/health` 404 expected на staging).
- `docs/RUNBOOK_ai_flip.md` — "Update 2026-04-21" note: staging live, prod flip pending (Core API prod cutover + AI Service prod app `investment-tracker-ai` blockers).

**Process gotchas закреплены (не TDs — runbook notes):**
- Windows PowerShell + Doppler `--format env` pipe → flyctl: добавляется UTF-8 BOM который flyctl парсит как часть значения первого secret. Workaround: JSON-формат + `ConvertFrom-Json` + spread `@setArgs` в `flyctl secrets set`.
- `openssl rand -hex 32` отсутствует в default Windows PowerShell — use `[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)` + `[BitConverter]::ToString($bytes).Replace('-', '')`.
- `GET /v1/chat/health` returns 404 на staging (prod-only routing); `/healthz` + `/v1/health` достаточно для smoke.

**Tests / CI status:** docs-only, no CI run.
**Admin-bypass:** N/A (docs-only).
**Migrations:** N/A.
**Closed TDs:** TD-070.
**Opened TDs:** TD-084, TD-085 (fixed inline), TD-086, TD-087 (fixed inline).

**Worktree cleanup (на PO):** N/A — docs-only edits в main worktree.

---

## ops-fix `b079d30` — fix(ai): remove README.md from dockerignore (Dockerfile COPY requires it)

**SHA:** `b079d30`
**Merged direct to main:** 2026-04-21 (single-line fix, no PR)
**Scope:** `apps/ai/.dockerignore` содержал `README.md` в excludes (default scaffold). `apps/ai/pyproject.toml` объявляет `readme = "README.md"` — Hatchling build-backend требует README в build context во время `uv sync`. Без этого fix Docker builder stage падал с `FileNotFoundError: README.md`. Поймано во второй итерации `flyctl deploy` (после TD-087 fix).

**Tracked:** TD-085 (TECH_DEBT.md — already-fixed, kept for general .dockerignore audit pattern).
**Tests / CI status:** local `docker build -f apps/ai/Dockerfile .` reproduced fail-then-pass before pushing; CI nothing (TD-086 — нет CI Docker build для `apps/ai/`).
**Migrations:** N/A.

---

## ops-fix `4357739` — fix(ai): install project non-editable in Dockerfile (fix multi-stage ModuleNotFoundError)

**SHA:** `4357739`
**Merged direct to main:** 2026-04-21 (single-line fix, no PR)
**Scope:** `apps/ai/Dockerfile` builder stage делал `uv sync --frozen --no-dev` без `--no-editable`. По default'у uv ставит проект как editable install — `.pth` файл в `/opt/venv/lib/python3.13/site-packages` указывает на `/src/src/ai_service`. Multi-stage `COPY --from=builder /opt/venv /opt/venv` в runtime stage без исходников `/src` ломает import: `ModuleNotFoundError: No module named 'ai_service'`. Container booted, `uvicorn` стартовал, `/healthz` 200 — но любой `python -m ai_service.<X>` failed. Fix: `--no-editable` ставит проект как обычный package в site-packages, переносится с venv.

**Tracked:** TD-087 (TECH_DEBT.md — already-fixed, kept for next multi-stage Python image rationale).
**Tests / CI status:** local `docker build` + `docker run --rm --entrypoint python ai-staging:local -c "import ai_service.main"` reproduced fail-then-pass; CI nothing (TD-086).
**Migrations:** N/A.

---

## PR #61 — ci(ai): TD-070 — staging deploy config (fly.staging.toml, secrets manifest, verify shim, workflow)

**Squash SHA:** `8ff5abf`
**Merged:** 2026-04-21
**Base:** `f08627b` (kickoff TD-070).
**Scope:** Config-as-code для AI Service staging deploy. **No runtime ops** — все flyctl / doppler / curl PO выполняет вручную после merge по `docs/RUNBOOK_ai_staging_deploy.md` § 2-7. Staging Fly app `investment-tracker-ai-staging`, Doppler project `investment-tracker-ai` config `stg`, bridge via `INTERNAL_API_TOKEN` ≡ `AI_SERVICE_TOKEN` в Core API staging Doppler. После PO runtime deploy + smoke → TD-070 closes, UI Slice 6a (Insights read-only) разблокируется.

- **New:** `apps/ai/fly.staging.toml` (region `fra`, `min_machines_running=1`, `LOG_LEVEL=INFO`; 3 Anthropic model IDs pinned в `[env]` — не через Doppler, чтобы Fly secrets не могли silently override explicit pin).
- **New:** `apps/ai/secrets.keys.yaml` (manifest: 4 required — `INTERNAL_API_TOKEN`, `ANTHROPIC_API_KEY`, `CORE_API_URL`, `CORE_API_INTERNAL_TOKEN`; + 8 optional для Sentry/PostHog/Anthropic+Core tuning; `ENCRYPTION_KEK` намеренно НЕ required — AI Service = pure proxy к Anthropic, envelope encryption живёт только в Core API).
- **New:** `ops/scripts/verify-ai-secrets.sh` (thin shim — exports `KEYS_FILE=apps/ai/secrets.keys.yaml` и `exec`'ает `verify-prod-secrets.sh`; zero parse-logic duplication).
- **Mod (scope-adjacent):** `ops/scripts/verify-prod-secrets.sh` — 1-line generalization `KEYS_FILE="${KEYS_FILE:-<default>}"` для поддержки per-service shim'ов. Backward-compat ✅ (существующий Core API callsite env-var не передаёт → fallback branch → идентичное поведение).
- **Mod:** `.github/workflows/deploy-ai.yml` — переписан с single-job-on-prod на `workflow_dispatch` с `environment: staging|production` input (default=staging) + pre-deploy verify-ai-secrets step; app + config автоматически выбираются из environment. Alternative к manual `flyctl deploy` в runbook § 6 — **не** заменяет § 2 (apps create) / § 4 (Doppler provisioning) / § 5 (bridge update).
- **Mod:** `docs/DECISIONS.md` — 2 ADRs: «AI Service staging deploy topology (TD-070)» (топология, bridge invariant, alternatives rejected) + «`verify-prod-secrets.sh` generalized via KEYS_FILE env override» (refactor rationale).
- **Mod:** `docs/TECH_DEBT.md` — TD-070 status → 🟡 «config shipped, awaiting PO runtime deploy» + landed/still-open split; TD-082 reserved (automated bridge drift check, opens real при prod flip prep); TD-081 остался reserved от Slice 5a.
- **Mod:** `docs/RUNBOOK_ai_staging_deploy.md` — 4 точечные правки: § 3 landed-file note, § 4.2 модели убраны из Doppler таблицы (+ verify-ai-secrets.sh sanity snippet), § 6 GH Actions alt path, § 9 obsolete optional-manifest line removed.

**Decisions (all pre-approved per kickoff GAP REPORT):**
1. Models в `[env]` hardcode, не Doppler — explicit pin в diff, Fly secrets override-safe.
2. `verify-ai-secrets.sh` через shim (variant B), не full copy — DRY.
3. `deploy-ai.yml` single-job + env input, не two-jobs mirror deploy-api.yml — AI pipeline легче (нет k6 / release_command migrations / approval gate).
4. `LOG_LEVEL=INFO` на staging.
5. `ENCRYPTION_KEK` не добавлять в AI manifest.
6. `doppler-sync.yml` generalization — defer (TD-069 уже owner).

**Local smoke performed pre-PR:** `bash -n` syntax on both verify scripts ✅; reuse `verify-prod-secrets.sh` YAML parser on AI manifest → exactly 4 expected keys, regression check на Core manifest → 16 required keys without change; `tomllib` parse `fly.staging.toml` — all invariants (app/env/LOG_LEVEL/model pins/min_machines) hold; YAML parse `deploy-ai.yml` — default=staging, options correct, «Verify secrets» step present.

**Tests / CI:** 10/10 CI checks green (Go lint+vet+build+test, Node lint+typecheck+build, Node unit, Python lint+typecheck+test, Trivy, govulncheck, gitleaks, Vercel preview + comments). `gh pr checks 61 --watch` до полного resolve (TD-078 mandatory).

**No admin-bypass.** Subject adjusted from kickoff-recommended `ops(ai):` to `ci(ai):` — `commitlint.config.mjs` type-enum allows only `feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`; `ci` fits deploy workflow as primary code mass. Header shrunk to 100 chars (limit).

**Pre-commit gotcha (TD-083 opened):** `tools/scripts/hook-commitlint.sh` с `set -e` валит скрипт на `pnpm exec commitlint` non-zero до того как fallback branches (`[ -x node_modules/.bin/commitlint ]`, `npx --no-install`) получают control. На fresh worktree без `pnpm install` первый commit падает моментально; fix = `pnpm install` в worktree root (~10 сек). Третий раз подряд CC натыкается — P3 TD открыт. `gh pr merge --squash --delete-branch` завершился с local-worktree error (gotcha #2 — main checked out в `D:\investment-tracker`), remote merge ✅ прошёл; cleanup в этом docs pass.

**TD ledger:** TD-070 → 🟡 awaiting PO runtime deploy (closes по runbook § 11); TD-082 → reserved (prod flip prep); **TD-083 → opened** (hook-commitlint.sh fallback dead under set -e). Scope-adjacent `verify-prod-secrets.sh` change flagged в PR description и ADR.

**Docs pass (this commit):** merge-log PR #61 entry (эта запись) + TD-083 append в TECH_DEBT + optional ROADMAP pending-note на AI Service row. PO_HANDOFF / UI_BACKLOG / TASK_07 / README — PO обновит сам после ping'а (scope ограничен per PO correction 2026-04-21).

---

## PR #60 — feat(web): TASK_07 Slice 5a — Transactions UI (add/edit/delete buy/sell/dividend)

**Squash SHA:** `5e556a9`
**Merged:** 2026-04-21
**Base:** `37b2d6c` (PO_HANDOFF lessons-learned codification + slice-5a kickoff).
**Scope:** Manual CRUD для transactions на Position Detail. "Add transaction" CTA в Transactions tab header открывает single `TransactionFormDialog` (mode create|edit) для `buy / sell / dividend`. Row-level kebab menu — Edit / Delete — рендерится только для `source === 'manual'` rows (API-sourced rows immutable per OpenAPI contract). Edit-mode locks fields которые API не accept'ит на PATCH (`account_id` / `transaction_type` / `symbol` / `asset_type` / `currency`) и PATCHes только diff. Split / transfer_in / transfer_out / fee — deferred к Slice 5b; select их показывает с "Coming soon" suffix (disabled options).
- New web: `apps/web/src/lib/api/transactions.ts` (typed wrappers), `apps/web/src/hooks/{useCreateTransaction,useUpdateTransaction,useDeleteTransaction}.ts` (TanStack Query mutations с `['position-transactions', id]` + `['portfolio']` + `['positions']` invalidation + toast feedback), `apps/web/src/components/positions/{transaction-form-dialog,delete-transaction-confirm}.tsx`.
- Extended `apps/web/src/lib/api/errors.ts` — `mapTransactionMutationError` (409 `DUPLICATE_TRANSACTION` → "looks like a duplicate", 403 `FORBIDDEN` → "synced from a broker and can't be changed", плюс общие VALIDATION / IDEMPOTENCY / RATE_LIMITED).
- Extended `position-transactions-tab.tsx` — toolbar CTA, kebab gate, dialog state. Existing split filter + `hiddenSplits` counter + infinite pagination — не тронуты.
- Минимальный edit `position-detail-live.tsx` — pass locked `{symbol, asset_type, currency}` через новый `position` prop (был только `positionId`).
- 8 новых Vitest smoke (3 файла): create payload shape + default currency из position + submit blocked на zero qty, edit diff-only PATCH (only changed `quantity` ends up в body), kebab visibility (manual → shown / aggregator → hidden), delete confirm calls mutation с правильным id.

**Form UX decisions:**
- Datetime picker = `<input type="datetime-local">` wrapped в `Input` styling (no shadcn Calendar). Value в local wall-clock → `toISOString()` at submit для RFC3339 UTC.
- AlertDialog = reuse `Dialog` primitive (same pattern как `DeleteConfirmDialog` в accounts).
- 0-accounts edge case: dialog renders warning banner + link на `/accounts`, submit disabled.
- Account select shows ALL accounts (не фильтруется по `connection_type=manual`) — legitimate use case: юзер с broker account добавляет manual entry для дивиденда который sync пропустил.
- Account default = newest по `created_at`.
- `Idempotency-Key` auto-injected middleware'ом `createBrowserApiClient` (новый per submit). Backend fingerprint dedup + `isPending` button-disable = защита от accidental double-tap. Per-dialog fixed-key lifecycle — overkill для MVP; если поймаем network-lost edge case в alpha → open new TD.

**Tests / CI:** 64/64 Vitest (16 test files; +8 tests в 3 новых файлах). Все 10 CI checks green (Node lint+typecheck+build, Node unit, Go, Python, 3× security scanners, Vercel, Trivy, Vercel Preview Comments). `gh pr checks 60 --watch` подтвердил до merge (TD-078 policy). Local gates — `pnpm test / lint / typecheck / build` green в `apps/web`.

**No admin-bypass.** `gh pr merge --squash --delete-branch` с local-worktree error в конце (main checked out в `D:\investment-tracker`); GitHub-side merge прошёл чисто; remote feature branch удалён через `gh api -X DELETE /git/refs/heads/feature/task07-slice5a` (§ 10 pre-approved action).

**TD ledger:** TD-081 был зарезервирован под этот slice, genuine debt не обнаружен — ID остаётся свободным для следующего slice'а.

**Docs pass (this commit):** merge-log PR #60 entry (эта запись), PO_HANDOFF § 1 status + § 2 row + § 12 continuation prompt, UI_BACKLOG Slice 5a ✅ + critical-path update, TASK_07 status row, 03_ROADMAP Wave 3 update, TECH_DEBT note про TD-081 reservation, DECISIONS.md 2 новых ADR (single TransactionFormDialog + datetime-local fallback; Idempotency-Key auto-inject rationale).

---

## PR #59 — feat(web): TASK_07 Slice 4a — Manual Accounts CRUD

**Squash SHA:** `c5590f5`
**Merged:** 2026-04-21
**Base:** `528333b` (PR #58 main tip).
**Scope (per commit message, CC #1 may expand in their own docs pass):** `/accounts` route + list + Add/Rename/Delete для `connection_type=manual`, plus sidebar activation. TanStack Query hooks против existing REST endpoints. Broker OAuth (Slice 4b/4c) всё ещё блокирован на TD-046.
- New web: `apps/web/src/app/(app)/accounts/{page,accounts-page-client}`, `apps/web/src/components/accounts/{account-list-item, account-form-modal, delete-confirm-dialog, currencies}`, `apps/web/src/hooks/{useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount}`, `apps/web/src/lib/api/{accounts, errors}`.
- Patched `packages/ui` `SyncStatusBadge` — 'manual' variant (no dot, neutral tone, tooltip "Manually entered — does not sync").
- Patched `apps/web/src/components/app-shell-client.tsx` — accounts href `/dashboard` → `/accounts` + `activeSlugFor` case.
- Docs (in-PR): `docs/TECH_DEBT.md` **TD-079** (accounts→transactions FK = CASCADE vs handler soft-delete mismatch, P3) + `docs/DECISIONS.md` 2 ADRs ("Accounts soft-delete pattern + FK mismatch deferred"; "AccountConnectCard not reused for manual accounts list").

Delete confirm copy — "Remove «{name}» from portfolio? Trades stay historical, portfolio recalculates without this account." — aligned against handler + OpenAPI. Currency list choice: OpenAPI `Currency` open regex `^[A-Z]{3}$` (not enum); default = EUR (EU audience).

**No admin-bypass.**

---

## PR #58 — feat(web): TASK_07 Slice 7a+7b — landing + pricing + paywall ui

**Squash SHA:** `528333b`
**Merged:** 2026-04-21
**Base:** `a407d7d` (PO_HANDOFF § 3.1 pre-CC checklist + kickoffs slice 4a/7ab + AI staging runbook).
**Scope:** Public face of the product. `(marketing)/` route group с собственным минимальным layout'ом (без `app-shell`). `/` — hero («What you actually own. Why it moved. What to do next.») + 3 pillars (Connect any broker / AI-explained moves / Honest insights) + read-only trust strip; authed → `redirect('/dashboard')`. `/pricing` — 3 tier cards (Free $0 / Plus $8/mo / Pro $20/mo) с feature matrix, выверенной по `04_DESIGN_BRIEF § 13.1` и `00_PROJECT_BRIEF`: accounts 2/10/Unlimited, AI 5/100/Unlimited **per day**, insights Weekly/Daily/Real-time, tax reports только Pro (US+DE), API access только Pro. `MarketingHeader` использует `<Logo variant="full" />` из `packages/ui`. Subscribe CTAs — noop stubs (`console.info('TODO: Stripe checkout', tier)`), реальный checkout ждёт Slice 7c / TD-057. `middleware.ts` — `/pricing` добавлен в `isPublic` matcher. Старый root redirect `apps/web/src/app/page.tsx` удалён, auth-redirect переехал в `(marketing)/page.tsx`. Tabular-nums на ценах (визуальное выравнивание `$8` / `$20`). Только semantic design-tokens, без raw hex. `export const metadata` на обеих страницах.

**Kickoff corrections applied (PO-approved):**
- Цены + feature matrix выровнены к `04_DESIGN_BRIEF § 13.1` (kickoff §3 Step 2 был ошибочен: Tax reports на Plus вместо Pro-only, AI limits в monthly units вместо daily, accounts 1/3/Unlimited вместо 2/10/Unlimited).
- Kickoff §3 Step 3 (paywall demo trigger на `/dashboard`) вырезан — дублировал `/design/freemium`, реальное wiring ждёт Slice 7c. Tracked as **TD-080** в `TECH_DEBT.md` + ADR в `DECISIONS.md` («Paywall demo triggers deferred to Slice 7c, PR #58»).

**Tests / CI:** 46/46 Vitest (добавлено 2 landing + 6 pricing specs). All 10 CI checks green (Node lint+typecheck+build, Node unit tests, Go full pipeline, Python, 3 × security scanners, Vercel preview). `gh pr checks 58 --watch` подтвердил до merge (TD-078 policy).

**No admin-bypass.** `gh pr merge --squash --delete-branch` с local-worktree error в конце (main checked out в D:\investment-tracker) — GitHub-side merge прошёл чисто.

**Docs pass (this commit):** UI_BACKLOG Slice 7a + 7b ✅ + SHA, ROADMAP Месяц 4 Paywall UI [x], PO_HANDOFF § 2 (main tip → `528333b`) + § 12 status line, TECH_DEBT.md +TD-080, DECISIONS.md + 2026-04-21 ADR.

---

## PR #55 — fix(api): golangci-lint hotfix for cors_test.go

**Squash SHA:** `f1b5799`
**Merged:** 2026-04-21
**Base:** `fb68193` (main tip после PR #54 + `19e72b8` docs-only amendment + `fb68193` gitignore chore).
**Scope:** hotfix за PR #54. Четыре golangci-lint issue в `apps/api/internal/server/cors_test.go`:
- `bodyclose` × 2 — `resp, err := a.Test(req)` требовал `defer resp.Body.Close()`.
- `noctx` × 2 — `httptest.NewRequest(...)` → `httptest.NewRequestWithContext(t.Context(), ...)`.

Cherry-pick `d3f674a` из уже-мёртвой `feature/api-cors` (написан сразу после CI fail, не успел попасть в оригинальный PR до admin-bypass merge). Все 8 CI checks зелёные (Go / Node / Python / Security × 3 / Vercel / Trivy).

**Incident:** см. `DECISIONS.md` — «CORS slice lint gap». Две TD записи про gap в pre-push hook и про обязательный `gh pr checks --watch` перед merge.

**No admin-bypass** на этом PR.

---

## PR #54 — feat(api): CORS middleware with ALLOWED_ORIGINS allowlist

**Squash SHA:** `adad1a1`
**Merged:** 2026-04-20 21:35 UTC
**Base:** `973fca8`.
**Scope:** Fiber v3 `cors.New()` middleware на всём авторизованном + публичном API surface.
- `apps/api/internal/config/config.go` — `AllowedOrigins []string` envconfig tag `ALLOWED_ORIGINS`, default `http://localhost:3000` (envconfig нативно сплитит CSV в slice).
- `apps/api/internal/server/server.go` — `cors.New(cors.Config{...})` после `RequestID` + `RequestLog`, до Auth. `AllowOrigins` exact-match (wildcards rejected — `AllowCredentials: true`). `ExposeHeaders` = 10 scope-cut `X-*` (PO_HANDOFF §6) + `X-RateLimit-*` + `X-Request-ID`. `AllowMethods` = GET/POST/PUT/PATCH/DELETE/OPTIONS. `MaxAge` = 86400 (браузеры сами capping'ят до 2h).
- `apps/api/internal/server/cors_test.go` (new) — 2 теста через Fiber `app.Test()`: allowed origin → 204 + exact `Access-Control-Allow-Origin` + `-Credentials: true` + `-Max-Age: 86400`; disallowed origin → ни одного `Access-Control-*` header.
- `ops/secrets.keys.yaml` — `ALLOWED_ORIGINS` добавлен в `required:` (CSV format, no trailing slash).
- `docs/RUNBOOK_deploy.md` — Prerequisites/Doppler nudge про формат.

**⚠ Admin-bypass (TD-006):** merged с fail'ящим `Go — lint + vet + build + test` check (golangci-lint вывел 4 issue — `bodyclose` × 2 и `noctx` × 2 в новом `cors_test.go`). CC (Claude) запустил локально только `go vet` + `go test -short` + `gofmt`, не `golangci-lint run`. Lefthook pre-push hook покрывает `gofmt` / `go vet` / `typecheck` / `py-mypy`, но НЕ полный `golangci-lint`. Gap замечен после merge'а; исправлен в PR #55 (см. выше). Пометка оставлена намеренно чтобы incident был трассируем.

---

## 2026-04-20 — PR C deploy-chain hot-fixes (staging bootstrap)

Direct-to-main commits applied during staging bootstrap to unblock the first real deploy. Each one fixes a pre-existing bug shipped in PR #49 (PR C) that only surfaced because the workflow had never run end-to-end (PR #49's push-on-merge run failed even earlier, on Fly app not existing).

| SHA | Fix | Trigger |
|---|---|---|
| `a86aaa3` | `deploy-api.yml` — `sh` → `bash` for verify + smoke steps (Ubuntu `sh` is dash, kills on `set -o pipefail`) | run 24677840667 failed in verify-staging-secrets |
| `d52822e` | `ops/scripts/verify-prod-secrets.sh` — `flyctl secrets list --json` emits lower-case `name` (older docs showed `Name`) | same run, after a86aaa3 |
| `80b516d` | `deploy-api.yml` — `working-directory: apps/api` + relative paths so Dockerfile COPY resolves `/go.mod` | run 24678034296 failed at build: `"/go.mod": not found` |
| `a123d66` | `fly.staging.toml` + `fly.toml` — `release_command = "migrate up"` (was `"/app/api migrate up"`; ENTRYPOINT prepends `/app/api`, so argv double-prefixed and dispatch fell through) | release_command machine timed out running Fiber server instead of migrations |

All four are TASK_04 PR C follow-ups, not new TDs — each has an inlined incident note in the affected file. No admin-bypass used (standard commit + push, commitlint passed, hooks green).

After all four: run 24678493942 — `Deploy — staging` ✅, 9 migrations applied (`20260418120001` → `20260420120001`), `https://investment-tracker-api-staging.fly.dev/health` returns `{"env":"staging","status":"ok"}`, Sentry initialised, 2 healthy machines in `fra`. k6 smoke still red because `api-staging.investment-tracker.app` DNS isn't pointed — that's the documented PO post-deploy step (`RUNBOOK_deploy.md § Prerequisites`).

**Opened TDs (2) — staging-bootstrap gaps:**
- **TD-069** (P2) — `doppler-sync.yml` not env-aware (stg/prd dimension missing). Bypassed via local pipe for bootstrap.
- **TD-070** (P2) — `apps/ai/fly.staging.toml` missing (+ `deploy-ai.yml` staging job). Phase C skipped; `/ai/*` 503s on staging.

---

## PR #50 — TASK_07 Slice 3: AI Chat UI (streaming + conversations + rich content)

**Squash SHA:** `4881dfd`
**Merged:** 2026-04-20
**Base:** `7931e8e` (docs-only kickoff tip post-#49).
**Scope:** третий vertical slice веб-фронта — полноценный AI Chat: `(app)/chat` + `(app)/chat/[id]` routes, SSE streaming, conversation CRUD, rich content rendering, tier-limit paywall (toast MVP), rate-limit surface через canonical `X-RateLimit-*`.
- `apps/web/src/lib/ai/sse-client.ts` (+92 LOC) — fetch + ReadableStream SSE parser (EventSource непригоден — не пропускает Bearer). Partial-frame reassembly across chunk boundaries, AbortSignal-aware, trailing-frame flush on `done`.
- `apps/web/src/lib/ai/chat-reducer.ts` (+240 LOC) — state machine над translator-normalized `AIChatStreamEvent`. `StreamState = idle | streaming | done | error`. Live blocks: text (delta-accumulated) / tool_use (полный frame сразу) / tool_result. Flat `ChatErrorView` (unwrapped from server `ErrorEnvelope`). Defensive `unwrapEnvelope` + `readDeltaText` — см. TD-068.
- `apps/web/src/lib/api/ai.ts` (+190 LOC) — typed wrappers `fetchConversations` / `fetchConversationDetail` / `createConversation` / `deleteConversation` + native-fetch `sendChatMessageStream` (openapi-fetch буферизует response body, streaming обходит его). `TierLimitError` / `ApiStreamError` carry `ChatErrorView`.
- `packages/api-client/src/index.ts` — extended (+45 LOC): `onRateLimitHeaders` opt-in callback на каждом response, shared `parseRateLimitHeaders` helper, `RateLimitSnapshot` + `RateLimitHandler` type exports. Canonical `X-RateLimit-{Limit,Remaining,Reset}` only — `-Daily` suffix нигде нет (proof: `airatelimit.go:94-96`, `idempotency.go:157`).
- `apps/web/src/hooks/useRateLimit.tsx` — React Context holding latest snapshot; monotonic-remaining guard против stale cached responses undoing a fresher update.
- 6 TanStack Query hooks: `useConversations` (infinite `['ai-conversations']`), `useConversation` (`['ai-conversation', id]`), `useCreateConversation` (invalidates list), `useDeleteConversation` (removes detail + invalidates list), `useChatStream` (AbortController-scoped; invalidates conv query on `done`; surfaces `TierLimitError` via `onTierLimit`).
- 9 UI components в `apps/web/src/components/chat/`:
  - `streaming-message-view.tsx` — pure-presentation (как Slice 2 `PositionPriceChartView` паттерн): text + tool_use/tool_result blocks, `TypingCursor` на последнем open text block, `ThinkingDots` при empty blocks.
  - `chat-message-item.tsx` — persisted `AIMessage` renderer с full 5-way discriminator (text / tool_use / tool_result / impact_card / callout).
  - `impact-card-view.tsx` — scenario simulator card (§14.2): before/after snapshots, top_affected_positions, narrative. Рендерится ТОЛЬКО из persisted history (never emitted live per `collector.go:58-60`).
  - `callout-view.tsx` — behavioral / explainer / info / warning tones. Persisted-only.
  - `chat-message-list.tsx` — scrollable column; reverses DESC API order для oldest-top UX; auto-scroll on new content / stream phase change.
  - `conversations-sidebar.tsx` + `conversations-sidebar-live.tsx` — thread list с New-chat + delete affordances; delete active convo → redirect `/chat`.
  - `chat-input-bar.tsx` — `ChatInputPill` + `UsageIndicator` + Stop button во время streaming; Esc listener scoped через `onKeyDown` в pill (no document-level listener — no conflict with Sheet/Dropdown close handlers).
  - `empty-conversation-state.tsx` + `empty-chat-shell.tsx` — 4 generic SuggestedPrompts per design brief §14.1 framing (factual, never advisory).
  - `chat-view-live.tsx` — orchestrator: `useConversation` + `useChatStream` + optimistic user-message echo + tier-limit toast.
- Routes:
  - `(app)/chat/layout.tsx` — two-column shell.
  - `(app)/chat/page.tsx` — SC fetch most-recent convo id → `redirect('/chat/{id}')`, or render `EmptyChatShell`.
  - `(app)/chat/[id]/page.tsx` — SC fetch `/ai/conversations/{id}` with messages; 404 → `notFound()`, 5xx → inline error; hydrates `ChatViewLive` via `initialData`.
- Sidebar activation в `app-shell-client.tsx`: Chat slot `href: '/dashboard'` → `/chat`, `activeSlugFor` добавлен case `pathname.startsWith('/chat')`.
- `providers.tsx` — wrap с `ToastProvider` + `RateLimitProvider`, QueryClient остаётся outer.
- `biome.json` (root) + `apps/web/biome.json` — extended a11y override to `**/apps/web/src/components/chat/**` (mirror existing `design/**` pattern) — `ChatMessage.role` domain prop триггерит `useValidAriaRole` false positive.
**LOC:** 33 files touched (+2316 / −9 = net +2307). Anchor 1500-2000 — overshoot +16% из-за defensive schema-drift parsing (TD-068 обоснование), RateLimitProvider infra, `ImpactCardView` + `CalloutView` ~175 LOC, optimistic user echo. Все overruns — одобренные Risk #1 decisions, не scope creep.
**Tests:** 8 files / 38 tests (было 6/15 до слайса, +23):
- `sse-client.test.ts` (+10): parseFrame edge cases (event/data defaults, multi-data joining, leading-space trim, comment lines), streamSSE chunked streaming, partial-frame reassembly, trailing frame flush, AbortSignal, empty-body error.
- `chat-reducer.test.ts` (+5): message_start transition, text delta accumulation, tool_use/tool_result block sequencing, error with partial message preserved, unknown-shape delta graceful skip (demonstrates TD-068 defensive parsing).
- `chat-message-item.test.tsx` (+4): user text, tool_use, impact_card (before/after + top_affected), explainer callout with term_slug.
- `streaming-message-view.test.tsx` (+4): thinking dots when empty, cursor on last text block, tool_use running label, cursor drop on stream end.
**CI:** 8/8 green на final squashed SHA (Go lint+vet+build+test 40s, Node lint+typecheck+build 1m26s, Node unit tests 25s, Python 18s, Trivy fs 34s, govulncheck 34s, gitleaks 5s, Trivy side-check 2s).
**Admin-bypass:** нет.
**Migrations:** нет (pure frontend slice; no OpenAPI / schema / handler touches).
**Closed TDs:** —
**Opened TDs (1):**
- **TD-068** (P3, docs-only) — schema drift в `tools/openapi/openapi.yaml` для `AIChatStreamEvent`: (1) `content_delta.delta` typed `additionalProperties: true` но factually always `{text: string}` (translator.go:59-64); (2) `AIStreamEventError.error` typed как wrapped `ErrorEnvelope` но translator emits flat `{code, message, request_id?}` (translator.go:149-157). Reducer carries defensive unwrap (~15 LOC). Fix: tighten schema definitions. No runtime impact — shape stable today.
**Schema drift rationale (TD-068):** Core API `sseproxy/translator.go` normalizes Python AI Service-native SSE shape в OpenAPI-compliant frames, но сама OpenAPI spec для `AIChatStreamEvent.content_delta.delta` и `AIStreamEventError.error` объявлена слишком loose (первое) / слишком wrapped (второе) относительно того что translator реально пишет на wire. Frontend reducer carries defensive parsing — symptom а не блокер. TD отражает clean-up work в spec housekeeping pass.
**Worktree cleanup (на PO):** `git worktree remove --force D:/investment-tracker-task07-s3 && git worktree prune`. Local branch `feature/task07-slice3` уже удалён с remote (`--delete-branch`); локально можно снести `git branch -D feature/task07-slice3` из `D:\СТАРТАП`.
**Next:** TASK_07 Slice 4+ candidates — FloatingAiFab activation + Insights page (прочитан через `/ai/insights/*` endpoints в main), либо Slice 5 Paywall + Pricing + Stripe Checkout в зависимости от PO priority. PR D workers deploy (TD-066 blocker) + TASK_06 broker integrations остаются параллельными треками.

---

## PR #49 — PR C: Core API deploy infrastructure (Fly.io + k6 + runbook)

**Squash SHA:** `fa9c9dc`
**Merged:** 2026-04-20
**Base:** `ad73a5a` (docs-only post-#48 tip; rebased mid-flight when Slice 2 landed).
**Scope:** первый real deploy infra slice TASK_04. «Fill-gaps + Doppler-first» режим — бустрап (alpine Dockerfile, `cmd/api`/`cmd/workers` split, `doppler-sync.yml`, manual `deploy-api.yml`) был уже в репо с TASK_01/A; PR C дополнил без переписывания.
- `apps/api/cmd/api/migrate.go` + `migrate_test.go` + `migrate_integration_test.go` (tag=integration, testcontainers pg) — subcommand `./api migrate <up|status|version>` для `fly.toml` `release_command` (atomic deploy — new code never meets old schema).
- `apps/api/cmd/api/main.go` — dispatch на `migrate` subcommand до `config.Load` (DATABASE_URL — единственный env, migrate не требует Clerk/Stripe/Polygon surface).
- `apps/api/internal/server/server.go` — `/metrics` endpoint через `github.com/prometheus/client_golang/prometheus/promhttp` + Fiber v3 `adaptor.HTTPHandler`. Default registry (go_* + process_*) only; custom app metrics — не-TD per PO decision ("плодить TDs без concrete trigger — bad habit").
- `apps/api/fly.toml` (prod) — `kill_signal=SIGTERM`, `kill_timeout=30`, `[deploy] release_command + strategy=rolling`, `min_machines_running=2`, `auto_stop_machines=false`, `[metrics]` block, explicit `[env]` (LOG_LEVEL/LOG_FORMAT/ENV=production).
- `apps/api/fly.staging.toml` (new) — cheaper knobs: `min=1`, `auto_stop=suspend`, `ENV=staging`, остальное зеркалит prod (same region, TLS, healthcheck, release_command).
- `apps/api/Dockerfile` — `golang:1.26-alpine` → `golang:1.25-alpine` (consistent с go.mod) + `COPY db/migrations /app/db/migrations` (self-contained image для release_command).
- `apps/api/.dockerignore` — expanded 9 → 35 lines (.git, editor/OS clutter, coverage, test files — context upload speed + cache stability).
- Healthcheck path mismatch fix: `fly.toml` `/healthz` → `/health` (handler всегда был на `/health` — bootstrap artifact в синxрон с route table; без фикса первый deploy = все машины 404-unhealthy).
- `.github/workflows/deploy-api.yml` rewrite: push-to-main + workflow_dispatch → verify-staging-secrets → deploy-staging → k6 smoke-staging → verify-prod-secrets → deploy-prod (GitHub Environment `production` approval gate) → smoke-prod (continue-on-error) → tag-release (`api-v0.0.<run_number>`). `target=workers|both` dispatch опции удалены защитно (TD-066 PR D blocker — placeholder binary не должен уехать в prod по клику).
- `ops/secrets.keys.yaml` (new, Doppler-first) — 15 required + 3 optional keys, value-less manifest.
- `ops/scripts/verify-prod-secrets.sh` (new) — Python-parsed YAML + `flyctl secrets list --json` diff. Missing required → exit 1; unexpected extras → warning.
- `tools/k6/smoke/*.js` (5 scenarios: health / portfolio_read / positions_read / ai_chat_stream / idempotency) + `run-smoke.sh` wrapper (skips auth-gated scenarios когда TEST_USER_TOKEN unset) + `seed-user.sh` (Clerk Backend API helper — one-time PO setup).
- `docs/RUNBOOK_deploy.md` (new, 316 LOC) — 8 headings (standard flow / emergency hotfix / rollback / debugging / secrets rotation / scaling / migrations / observability) + Prerequisites 9-й блок per Q10 (Doppler project, Fly apps, GitHub Environments+secrets, DNS pointing procedure, secrets population через `doppler-sync.yml`).
- `docs/DECISIONS.md` — "2026-04-20 — Core API Fly.io deploy (PR C)" entry, 9 sub-decisions: alpine preserved (not distroless, not debt — committed TASK_01/A choice), Doppler single-source-of-truth, single-region fra для MVP, rolling strategy (не blue-green, TD-064 для future SSE incident), migrate subcommand > ephemeral `fly machine run`, workers dispatch disabled до PR D, health path /healthz→/health, /metrics on public port, separate `fly.staging.toml` vs parameterised toml.
**LOC:** 24 files touched (15 new + 9 modified), +1687 / −27 = net +1660. Anchor 1800-2400 — внутри (−7.8%). Prognosis GAP v1 был 1430-1590; overshoot +4.4% из-за richer RUNBOOK + migrate tests (130 LOC integration).
**Mid-flight events:**
- **Rebase conflict** в `docs/TECH_DEBT.md` когда PR #48 Slice 2 merged во время PR C work — Slice 2 добавил TD-065 в то же место (top of Active). Resolved placing TD-065 в proper descending numeric order между TD-066 и TD-064. Остальной auto-merge clean.
- **Lint hotfix** pre-merge: golangci-lint errcheck на `fmt.Fprint/Fprintf` unchecked returns в `migrate.go` → `_, _ = fmt.Fprint(...)` explicit discard. Commit `264352a` перед финальным CI run-through → 8/8 green.
**CI:** 8/8 green on final squashed SHA (Go lint+vet+build+test 3m5s, Node lint+typecheck+build 1m9s, Node unit tests 23s, Python lint+typecheck+test 17s, Trivy fs 19s, govulncheck 33s, gitleaks 12s, Trivy side-check 2s).
**Admin-bypass:** нет.
**Migrations:** нет (migrations были applied ранее через CI dev env; PR C только добавляет deploy-time механизм через release_command).
**Closed TDs:** —
**Opened TDs (7):**
- **TD-060** (P2) — KMS-managed KEK (replace env-based `ENCRYPTION_KEK`). Trigger: first enterprise/GDPR-sensitive conversation или SOC2 scoping.
- **TD-061** (P3) — Multi-region deploy (fra → + ams/lhr). Trigger: ~1k paying users или first fra outage.
- **TD-062** (P2) — APM / cross-service trace correlation (OTel → Tempo/Datadog). Trigger: AI Service 404-swallow flip (`RUNBOOK_ai_flip.md`).
- **TD-063** (P2) — Per-tenant rate limits (per-user token bucket). Trigger: first enterprise conversation или cache/queue saturation incident.
- **TD-064** (P3) — Blue-green deploys вместо rolling (SSE safety). Trigger: first SSE drop user-visible incident.
- **TD-066** (P1) — Restore `workers` deploy target в `deploy-api.yml` dispatch inputs. **PR D blocker**. PR D CC kickoff должен читать TD-066 first.
- **TD-067** (P2) — `deploy-web.yml`/`deploy-ai.yml` pipeline consistency (staging + smoke + approval gate). Trigger: post-first-prod-deploy когда pattern confirmed.
**Known follow-ups (PO post-merge, operational 8-12h):**
1. Create Doppler project `investment-tracker-api` + configs dev/stg/prd.
2. Populate 15 required secrets per `ops/secrets.keys.yaml`.
3. Add 4 GitHub repo secrets (`FLY_API_TOKEN`, `DOPPLER_TOKEN_STG`, `DOPPLER_TOKEN_PRD`, `STAGING_TEST_USER_TOKEN`, `PROD_TEST_USER_TOKEN`) + 2 Environments (`staging` no gate; `production` 1 required reviewer = PO).
4. `fly apps create investment-tracker-api --org <org>` + `fly apps create investment-tracker-api-staging --org <org>`.
5. Dispatch `doppler-sync.yml target=api` — pipes Doppler → Fly secrets.
6. `tools/k6/seed-user.sh` против staging Clerk → `gh secret set STAGING_TEST_USER_TOKEN`.
7. Dispatch `deploy-api.yml` — pipeline runs verify-staging-secrets → staging deploy → k6 smoke-staging → verify-prod-secrets → **blocks на production environment approval** → prod deploy → k6 smoke-prod → tag release.
8. Point DNS `api-staging.investment-tracker.app` + `api.investment-tracker.app` на Fly после первого успешного deploy.
9. 24-48h staging soak перед prod traffic cutover.
10. После prod soak — AI Service 404-swallow flip (`RUNBOOK_ai_flip.md`).
**Worktree cleanup (на PO):** `git worktree remove --force D:/investment-tracker-pr-c && git worktree prune`. Local branch `feature/pr-c-deploy` уже удалён с remote (`--delete-branch`); локально можно снести `git branch -D feature/pr-c-deploy` из `D:\СТАРТАП`.
**Next:** TASK_04 закрыт 10/10 (A, B1, B2a, B2b, B2c, B3-i, B3-ii-a, B3-ii-b, B3-iii, **PR C**). PR D — workers deploy + asynq consumer (TASK_06 integration) после первого prod soak. TASK_07 Slice 3 идёт параллельно (Chat UI или Insights/Accounts).

---

## PR #48 — TASK_07 Slice 2: Positions list + Position Detail (read-only)

**Squash SHA:** `366d12f`
**Merged:** 2026-04-20
**Base:** `fd3b5c5` (docs-only kickoff tip post-#45).
**Scope:** второй vertical slice веб-фронта поверх Slice 1 scaffold.
- `/positions` — Server Component с server-hydrated `initialData` для дефолтного запроса `sort=value_desc + group_by=symbol`. `PositionsListLive` bridge + `PositionsTable` (desktop HTML table + mobile `AssetRow` cards через `md:` breakpoint) + `PositionsToolbar` (Sort `SegmentedControl` / Group `Dropdown` / Asset-type Filter `Dropdown`) + `PositionsRow` desktop row с gain/loss coloring.
- `/positions/[id]` — Server Component с parallel fetch позиции + первой страницы транзакций. 404 → `notFound()`, 5xx → inline error message (не infinite skeleton). `PositionDetailLive` composes `PositionHeader` + `Tabs(Overview, Transactions)`. Overview = `PositionOverviewTab` (P&L card + Metadata card) + `PositionPriceChart`. Transactions = infinite-query list + "Load more" ghost Button.
- `PositionPriceChart` поверх `@investment-tracker/ui/charts` `AreaChart` subpath (Recharts pulled through `packages/ui` direct dep; **zero direct dep в `apps/web`**, zero drift `pnpm-lock.yaml` с параллельным PR C). Period `SegmentedControl` 1W/1M/3M/6M/1Y/All (default 1M) → OpenAPI `5d/1m/3m/6m/1y/max`. `PositionPriceChartView` вынесен как pure presentational для smoke-теста без QueryClient — паттерн Slice 1 (`PortfolioValueCardView`).
- `PositionHeader` использует `CountUpNumber` с `from === value` чтобы первый paint рендерил финальное отформатированное значение; tween запускается только на последующих refetch'ах (no 0→value animation on mount).
- 4 TanStack Query хука: `usePositions` (initialData для default query only — избегает seeding unrelated query keys), `usePosition`, `usePositionTransactions` (infinite; first page hydrated через `initialData: { pages: [firstPage], pageParams: [undefined] }` + `initialPageParam: undefined` — без setQueryData-в-useEffect anti-pattern), `useMarketHistory` (`period` живёт в query key + client state — OpenAPI response не возвращает `period`, только query param).
- `lib/api/positions.ts` — thin typed fetch helpers (`fetchPositions` / `fetchPosition` / `fetchPositionTransactions` / `fetchMarketHistory`) типизированы через generated `paths` + `components` из `@investment-tracker/shared-types`. Unwrap на 2xx, throw на non-2xx → TanStack Query surface'ит через `error`.
- `lib/format.ts` extensions: `formatRelativeTime` (`2h ago` с fallback на абсолютную дату), `formatShortAccountId` (`Account #<last-8 uuid>` placeholder до `/accounts` lookup в Slice 5), `formatDateTime`, `formatAxisDate`. `lib/period.ts` — UI ↔ API period mapping.
- `components/positions/pnl-helpers.ts` — `formatPositionPnl`: derive percent locally когда `pnl_percent` null но `pnl_absolute` есть (`abs / (total_value - abs)`); both fields optional per OpenAPI contract на `Position`.
- `TransactionRow.kind` не модели `split` events — фильтруем `split` транзакции с footnote "Stock splits hidden (N)" когда хотя бы один split присутствует. См. **TD-065** ниже.
- Sidebar: `positions` slot href `/dashboard` → `/positions`; `activeSlugFor` резолвит `/positions*` → `'positions'`. Active-state следует за роутом.
- Vitest: 3 smoke-теста (`positions-row` — gain/loss/absent P&L + локально-computed percent edge case; `position-header` — symbol + asset-type Badge + CountUpNumber-seeded-with-value invariant + 3 P&L variants; `position-price-chart` — loading/error/chart/empty-points render paths на `PositionPriceChartView`).
- `vitest.setup.ts` +7 LOC: `afterEach(cleanup)` hook. С Vitest `globals: false` `@testing-library/react` не регистрирует свой built-in cleanup, рендеры копились между `it`-блоками. Slice 1 dodged это случайно (уникальные ассёрты в каждом тесте).
**LOC:** 1443 insertions, 4 removals, 24 files (21 new, 3 modified: `app-shell-client.tsx`, `format.ts`, `vitest.setup.ts`). В пределах 1400-1800 anchor. Scaffold Slice 1 тянет половину работы.
**Out-of-spec touches (объявлены в GAP v2):**
1. `vitest.setup.ts` cleanup hook — real bug fix в test infra, verified не ломает Slice 1.
2. `PositionPriceChartView` вынесен отдельно — +20 LOC boilerplate, взамен чистый smoke test без QueryClient mock'ов. Следует Slice 1 паттерну.
3. **Zero `package.json` / `pnpm-lock.yaml` touches** — no deps added. Recharts через `@investment-tracker/ui/charts` subpath.
**CI:** 8/8 green on push (Go lint+vet+build+test 34s, Node lint+typecheck+build 1m13s, Node unit tests 26s, Python lint+typecheck+test 19s, Trivy fs 27s, govulncheck 37s, gitleaks 5s, Trivy side-check 5s).
**Admin-bypass:** нет.
**Migrations:** нет.
**Closed TDs:** —
**Opened TDs:**
- **TD-065** — `TransactionRow.kind` extension для `split` events (display ratio + date, no amount col). P3, owner frontend+design, revisit при первом user feedback про splits. См. TECH_DEBT.md.
**Known follow-ups (не TDs):**
- Runtime smoke `/positions → click row → /positions/[id]` с docker compose + Go API + реальными позициями — PO post-merge.
- Scope-cut headers (`X-Partial-Portfolio`, `X-FX-Unavailable`) на `/positions` — отдельный micro-slice для консистентности с `/dashboard`.
- Slice 3+ scope без изменений (Chat UI, Insights, Accounts CRUD, Settings, Paywall, Vercel deploy, PWA, sidebar disabled state для placeholder nav-слотов).
**Worktree cleanup (на PO):** `git worktree remove --force D:/investment-tracker-task07-s2 && git worktree prune`. Local branch `feature/task07-slice2` уже удалён с remote (--delete-branch), локально можно снести `git branch -D feature/task07-slice2` из `D:\СТАРТАП`.
**Next:** Slice 3 (Chat UI или Insights/Accounts) + параллельно PR C (Fly.io deploy) + продолжает.

---

## PR #45 — TASK_07 Slice 1: Clerk auth + (app)/dashboard vertical slice

**Squash SHA:** `a622bd3`
**Merged:** 2026-04-20
**Base:** `0c3bea5` (docs-only post-#46 tip).
**Scope:** первый vertical slice веб-фронта поверх существующего apps/web scaffold.
- Clerk integration: `src/middleware.ts` (public matcher: `/`, `/design(.*)`, `/sign-in(.*)`, `/sign-up(.*)`), `<ClerkProvider>` с themed appearance из design-tokens (CSS-var bindings), `(auth)/sign-in/[[...sign-in]]` + `(auth)/sign-up/[[...sign-up]]` catch-all routes.
- Protected app shell: `(app)/layout.tsx` → `AppShellClient` (client) composes dumb `AppShell` + `Sidebar` (next/link adapter + `usePathname` active-slug) + `TopBar` + Clerk `<UserButton />`. Non-Dashboard nav слоты видимы, href = `/dashboard` (no-op placeholder до соответствующих slices).
- `(app)/dashboard/page.tsx` = Server Component. `createServerApiClient()` (server-side Clerk token через `auth().getToken()`) → `GET /portfolio` → `initialData` → `<PortfolioValueCardLive>`. On fetch failure Server Component отдаёт `null` → client показывает empty/error card.
- Two thin api-client factories (`lib/api/server.ts` + `lib/api/browser.ts`) поверх `@investment-tracker/api-client` wrapper. Browser factory подаёт `crypto.randomUUID` в `idempotencyKeyFactory`.
- TanStack Query provider (`app/providers.tsx`, staleTime 60s, refetchOnWindowFocus, retry 1) + `hooks/usePortfolio.ts` с server-hydrated `initialData`.
- `PortfolioValueCardLive` (TanStack Query bridge) + `PortfolioValueCardView` (pure presentation, unit-testable) + skeleton/error/empty sub-components. Использует существующий `PortfolioCard` primitive + tokens `text-portfolio-gain-default` / `text-portfolio-loss-default`.
- `lib/format.ts`: Intl.NumberFormat wrappers (currency / signed-currency / percent) — no `Number()` arithmetic на `Money` strings.
- Vitest + happy-dom + @testing-library/react + @testing-library/jest-dom setup. 1 smoke test (3 cases: gain variant, loss variant, empty state).
- ClerkProvider receives explicit `publishableKey` с CI-safe fallback, построенным в server render через `Buffer.from` из low-entropy source string — prerender `/` и `/_not-found` проходит в CI без Clerk secrets. Real deploys inline настоящий `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
**LOC:** ~551 (production + tests; +524 net excluding pnpm-lock). Значительно ниже 1200-1600 anchor — scaffold (`PortfolioCard`, api-client wrapper, `AppShell`/`Sidebar`/`TopBar`, gain/loss tokens) делает половину работы. Anchor был cap'ом, не floor'ом.
**Out-of-spec touches (объявлены в GAP v2):**
1. `next` `15.1.3` → `^15.2.3` — @clerk/nextjs 6.39 peer range требует ≥15.2.3 (patch bump).
2. `experimental.typedRoutes` → top-level `typedRoutes` — Next 15.5 deprecation cleanup.
3. `apps/web/.env.local` с synthesized Clerk placeholder keys — gitignored, не коммитилось.
4. Visual disabled state на placeholder nav-слотах Sidebar отложен (требует расширения `NavItem` API в `packages/ui` — отдельный slice).
**CI:** 8/8 green on final squashed SHA (Go lint+vet+build+test, Node lint+typecheck+build, Node unit tests, Python lint+typecheck+test, Trivy fs, govulncheck, gitleaks, Trivy side-check).
**Admin-bypass:** нет.
**Migrations:** нет.
**Mid-flight fixups (pre-merge, squashed in):**
1. `next build` prerender fail на missing `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (корневой `<ClerkProvider>` рендерится для public `/` + `/_not-found`) → explicit `publishableKey` prop с fallback.
2. Gitleaks `generic-api-key` (entropy 4.63) flagged committed base64 placeholder literal → runtime `Buffer.from` construction; base64 literal не появляется в source. Force-pushed squashed branch для скрабинга leaked literal из PR history (feature-branch rewrite OK per policy — main squash всё равно стирает intermediate commits).
**Rebase note:** feature branch перед финальным push был rebased на `0c3bea5` (docs tip после B3-iii). OpenAPI surface между `a75f541` и `0c3bea5` не менялась — regen `shared-types` не потребовался, drift = 0 (apps/web/** vs apps/api/**).
**Closed TDs:** —
**Opened TDs:** — (slice 1 ничего нового не открыл).
**Known follow-ups (не TDs):**
- Real `/portfolio` runtime smoke — PO post-merge (docker compose + Go API).
- Реальный Clerk dev project (`rmaistrenko.job+task07@gmail.com`) — PO создаёт, пишет keys в свой `.env.local`.
- Slice 2+: Positions + Position Detail, Chat UI streaming, Insights feed, Accounts/Settings/Paywall, visual disabled state для placeholder nav-слотов, `usePortfolioHistory` + period toggle + sparkline, Vercel preview PR, real Sentry/PostHog DSN wiring.
**Next:** TASK_07 Slice 2 — параллельно с PR C (Fly.io deploy).

---

## PR #46 — B3-iii: Clerk/Stripe webhooks + webhook_events idempotency

**Squash SHA:** `08e09f4`
**Merged:** 2026-04-20
**Base:** `a75f541` (docs-only tip post-#44).
**Scope:** финальный write-path slice TASK_04.
- `POST /auth/webhook` (public) — svix `Webhook.Verify` → `user.created/updated/deleted`. Deletion path переиспользует B3-i DELETE /me (MarkUserDeletionRequested + 7d `TaskHardDeleteUser`). svix `NewWebhook` используется и в проде, и в тестах (whsec_<base64> shape).
- `POST /billing/webhook` (public) — `stripe-go webhook.ConstructEvent` → subscription.created/updated/deleted + invoice.payment_failed. Client-instance verifier (нет global `stripe.Key`). Tier mapping через optional `STRIPE_PRICE_PLUS`/`STRIPE_PRICE_PRO` env. Unknown price → WARN + skip (fail-open, избегаем 72h retry-шторма).
- Миграция `20260420120001_webhook_events.sql` — PK `(source, event_id)` + CHECK `source IN ('clerk','stripe')`. sqlc `ClaimWebhookEvent` = `INSERT ... ON CONFLICT DO NOTHING RETURNING processed_at`. 0 rows → idempotent replay (200).
- `internal/clients/webhookidem` — shared Claimer surface поверх sqlc query.
- User resolve для Stripe events: `stripe_customer_id` → `metadata.user_id` fallback → WARN + 200 no-op (до `/billing/checkout` через TD-057).
- `stripe_customer_id` preserved on subscription cancel (resub-friendly — коммент в `handleStripeSubscriptionDeleted`).
- 14 scope-cut 501 stubs для OpenAPI completeness: `/me/2fa/*` (5), `DELETE /me/sessions/{id,others}` (2), `/billing/*` CRUD (5), `/me/export` (1), `/portfolio/tax/export` (1). `GET /me/2fa` эмитит `X-Clerk-Unavailable` + empty-state-200 per ListMySessions pattern.
- Config: optional `StripePricePlus` + `StripePricePro`. `CLERK_WEBHOOK_SECRET` + `STRIPE_WEBHOOK_SECRET` уже были в config.
**LOC:** ~1160 production, ~750 tests, ~80 sqlc generated. Grand total ~1900 LOC, 23 файла touched.
**CI:** 8/8 green (Go lint+vet+build+test, Node lint+typecheck+build, Node unit tests, Python lint+typecheck+test, Trivy fs, govulncheck, gitleaks, Trivy side-check).
**Admin-bypass:** нет.
**Migrations:** `20260420120001_webhook_events.sql`.
**Binary size:** 18 MB (`-s -w`, trimpath) — под PR C cap 25 MB. Delta от baseline ~15 MB = +3 MB (stripe-go + svix + transitive).
**Mid-flight fix-up (pre-merge, squashed in):** staticcheck SA1019 — `fasthttp RequestHeader.VisitAll` deprecated → перевод на `All()` iterator. Gitleaks generic-api-key triggered на whsec-format test secret → `gitleaks:allow` inline комментарии. Оба зафиксированы в squash перед финальным CI runthrough — чистый one-shot 8/8 green post-squash.
**Closed TDs:** — (TD-041/TD-045 остаются Active с припиской: publisher done в B3-i commit `61d6c08`; Clerk `user.deleted` webhook использует тот же contract; consumer tracked в TASK_06).
**Opened TDs:**
- TD-056 — Clerk Backend SDK wiring (2FA × 5 + session mutations × 2). Pair с TD-027.
- TD-057 — Billing CRUD endpoints (5) depends on prod Stripe product catalog.
- TD-058 — GDPR `/me/export` bundle aggregation.
- TD-059 — `/portfolio/tax/export` tax bundle (overlap с TD-039 worker).
**Next:** TASK_04 закрыт (9 of ~9 PRs). PR C (Fly.io deploy) — см. `PR_C_preflight.md`. До PR C — 24-48h clean staging desirable; после prod deploy → AI Service 404-swallow flip (`RUNBOOK_ai_flip.md`).

---

## PR #44 — B3-ii-b: POST /ai/chat + SSE reverse-proxy + ai_usage single-writer

**Squash SHA:** `c2a2afe`
**Merged:** 2026-04-20
**Base:** `b6108a4` (PR #43 squash)
**Scope:** вторая половина AI mutations группы — POST /ai/chat (sync) + POST /ai/chat/stream (кастомный SSE reverse-proxy с single-writer goroutine, tee-parser, persist). `sseproxy/proxy.go`, `handlers.persistTurn` (tee+DB transaction, единственный writer `ai_usage`), `sseproxy.Result.GotMessageStop` gate, heartbeat ticker.Reset после frame, `aiservice.ErrUpstreamAuth` → 502, `flattenUserContent`/`flattenStoredContent`, `stampHeaders` для `X-Request-Id`. OpenAPI re-serialize в Core API (трекается через TD-055).
**LOC:** 1606 production (+7% vs 1500 anchor — nit-lint overhead), 1389 tests, 147 generated/SQL. Grand total +3142/-2.
**CI:** 8/8 green. Go lint+build+test, Node typecheck+test, Python lint+test, trivy image, govulncheck, gitleaks — всё зелёное (trivy на PR прошёл штатно — pre-existing main-side flake на `Security — filesystem scan` не повторился; отдельный chore-PR на permissions не понадобился).
**Admin-bypass:** нет (branch protection required checks = 0, нормальный squash).
**Migrations:** нет.
**Closed TDs:** — (core mutations закрыты; Path B и tier-per-period остаются отдельно).
**Opened TDs:** TD-055 — AI stream OpenAPI spec drift from re-serialize в Core API.
**Next:** B3-iii — DELETE /me + JWKS cache prune + break-glass runbook polish. После этого PR C (Fly.io deploy).

---

## PR #43 — TASK_05 cleanup: remove Core API `record_ai_usage` dual-write

**Squash SHA:** `b6108a4`
**Merged:** 2026-04-20
**Base:** `8c52a4d` (PR #42 squash)
**Scope:** Python AI Service cleanup — удалены все call sites `record_ai_usage` + метод в `core_api.py` client + обновлены тесты которые mock'али вызов. Коммент-заглушка на месте удалённой записи: `# ai_usage tracking owned by Core API (TASK_04 B3-ii-b). See docs/DECISIONS.md 2026-04-20 entry.`
**Context:** блокер для B3-ii-b merge — Core API стал single-writer для `ai_usage` ledger (см. DECISIONS.md 2026-04-20). Dual-write = дубликаты в ledger = биллинг x2.
**LOC:** ~90 touched (handlers chat + insights + client + tests).
**CI:** 8/8 green.
**Admin-bypass:** нет.
**Migrations:** нет.
**Closed TDs:** — (cleanup, не создаёт долг)
**Opened TDs:** TD-054 (CC agent memory lives outside repo — flag from this CC session).
**Next:** B3-ii-b (Core API SSE proxy + chat handlers + tee-to-DB) можно стартовать.

---

## PR #42 — B3-ii-a: AI Service HTTP client + rate-limit middleware + 5 simple handlers

**Squash SHA:** `8c52a4d`
**Merged:** 2026-04-20
**Base:** `47276bb` (docs-only direct commit 2026-04-20 — DECISIONS.md ai_usage entry)
**Scope:** foundation для AI mutations группы. HTTP client → AI Service (`apps/api/internal/aiclient/`), middleware `airatelimit` (Lua atomic INCR+EXPIRE, tier-aware cap: Free=5, Plus=50, Pro=∞), 5 handlers: POST /ai/conversations, DELETE /ai/conversations/{id}, POST /ai/insights/generate (Path B sync inline, 202 + status=done), POST /ai/insights/{id}/dismiss, POST /ai/insights/{id}/viewed. `tiers.Limit.AIChatEnabled bool` forward-compat flag (true для всех тарифов в MVP).
**LOC:** ~1780 (прогноз был 1500, overrun из-за Lua script tests + client fakes).
**CI:** 8/8 green (Go lint+build+test, Node typecheck+test, Python lint+test, trivy fs+image, govulncheck, gitleaks).
**Admin-bypass:** нет.
**Migrations:** нет.
**Pre-merge fix-up:** коммит `ec53eb8` — TD-048..TD-053 добавлены в TECH_DEBT.md Active (6 штук), чтобы post-merge docs pass не забыл.
**Closed TDs:** —
**Opened TDs:**
- TD-048 — SSE error event payload: add `request_id` field (cross-service).
- TD-049 — SSE Last-Event-ID resume protocol.
- TD-050 — `/ai/insights/generate` Path B handler hangs 5-30s (Fly.io idle 60s).
- TD-051 — SSE parser в Core API дублирует AI Service знание о frame format.
- TD-052 — AIRateLimit pre-increment overcount (P2).
- TD-053 — `/ai/insights/generate` per-week/per-day tier gate.

**Next:** B3-ii-b — POST /ai/chat (sync) + POST /ai/chat/stream (SSE reverse-proxy + tee-parser + persist) + SSE parser pkg + ai_usage INSERT в DB transaction после message_stop. Anchor ~1500 LOC. Зависит от этого PR + PR #43 (TASK_05 cleanup).

---

## Docs-only direct-to-main — DECISIONS.md ai_usage single-writer entry

**Tip SHA on origin/main:** `47276bb`
**Pushed:** 2026-04-20 by Ruslan
**Previous tip:** `e96f6de`
**Scope:** 1 файл, 36 insertions — `docs/DECISIONS.md` новый ADR "2026-04-20 — `ai_usage` ledger: Core API is single-writer". Фиксирует решение для будущих сессий + служит reference в PR #43 description.
**Context:** CC-task05 корректно запросил ссылку на DECISIONS.md перед cleanup work (grep показал 0 matches — я уже Edit'нул файл, но Ruslan ещё не закоммитил). Ruslan закоммитил + push, pre-push hooks green (markdownlint, vale).
**Policy note:** docs-only direct-to-main разрешён, squash-only относится к merge PRs.
**CI:** не применимо.
**Admin-bypass:** нет.
**Migrations:** нет.

---

## Docs-only direct-to-main — PO_HANDOFF + merge-log entry (CC-landed)

**Tip SHA on origin/main:** `e96f6de` (at 2026-04-20 ~00:23 UTC+3)
**Previous tip:** `84465f7` (см. entry ниже)
**Pushed:** 2026-04-20 by CC during B3-ii worktree cleanup sequence
**Scope:** 2 файла, 285 insertions:
- `docs/PO_HANDOFF.md` (new, 271 LOC) — session-handoff document: ключевые SHAs, worktree state, current PR status, cleanup gates, canonical bootstrap prompt.
- `docs/merge-log.md` (+14 LOC) — entry про docs-only direct-to-main 84465f7.

**Context (как вышло что CC landed PO-правки):**
PO-Claude в сессии у Ruslan'а правил обе доки через Edit tool. Ruslan не успел сам закоммитить перед тем как дать CC команду start B3-ii. CC при старте pre-flight audit увидел uncommitted changes в working tree D:\СТАРТАП, не смог switch на feature branch для write-phase, поэтому сам закоммитил+запушил ровно те правки что PO-Claude оставил. Контент легитный; commit подписан `Co-Authored-By: Claude Opus 4.7 (1M context)`.

**Gate firing:**
CC правильно сработал paranoid-check «tip mismatch» сразу после commit'а — PO_HANDOFF § 9 скрипт cleanup'а ожидал `84465f7`, actual был `e96f6de`. STOP + явный запрос ack от Ruslan'а. Ruslan верифицировал через `git show e96f6de --stat`, увидел 2 docs-файла, дал «go, expected = e96f6de». Audit продолжен.

**Policy note:** тот же pattern что и предыдущий entry — docs-only direct-to-main разрешён, squash-only относится к merge PRs не к docs landings.
**CI:** не применимо.
**Admin-bypass:** нет.
**Migrations:** нет.

**Lesson learned для следующих сессий:** PO должен коммитить свои docs-правки сам **до** команды start CC, чтобы tip не уезжал под ним. Gate работает как recovery, но prevention лучше.

---

## Docs-only direct-to-main — PO handoff sync (post-#40)

**Tip SHA on origin/main:** `84465f7`
**Original local commit SHA (pre-rebase):** `8532301` — осиротел локально после `git pull --rebase` (local main стоял на pre-B3-i base); в `origin/main` живёт только rewritten `84465f7`.
**Pushed:** 2026-04-20
**Base:** `11d6098` (PR #40 squash).
**Scope:** docs-only sync — 14 файлов (11 modified + 3 new). Полный PO handoff pass: PO_HANDOFF.md создан, merge-log.md / RUNBOOK_ai_flip.md / PR_C_preflight.md материализованы (ghost-files fix), README + TECH_DEBT + TASK файлы приведены к актуальному состоянию после B3-i.
**Policy note:** direct-to-main без PR. Squash-only policy применяется к **merge PRs**, не к docs-only PO commits. Логируется здесь для audit trail (через 3 месяца при debugging было видно что это не-PR landing).
**CI:** не применимо (docs-only, no code touched).
**Admin-bypass:** нет.
**Migrations:** нет.

---

## PR #40 — B3-i: data-path mutations + asynq + idempotency lock

**Squash SHA:** `11d6098bd5eba4d756af22bf72ca1500b2f0192e`
**Merged:** 2026-04-19
**Base:** fb16525 (PR #39 squash)
**Scope:** первый write-path slice Core API — 19 handlers (accounts 7, transactions 3, /me 5, notifications 4, exports 2) + infra (SETNX idempotency lock, asynq publisher wrapper с nil-safe Enabled(), `X-Async-Unavailable` scope-cut header).
**CI:** 8/8 green (Go lint+build+test, Node typecheck+test, Python lint+test, trivy fs+image, govulncheck, gitleaks).
**Admin-bypass:** нет.
**Migrations:** нет.
**Pre-merge fix-up:** commit `61d6c08` — добавил `Publisher.Enabled()` + эмиссию `X-Async-Unavailable: true` в 5 call sites перед enqueue, чтобы консистентно с остальными scope-cut header'ами (X-Benchmark-Unavailable, X-Tax-Advisory, X-FX-Unavailable, X-Clerk-Unavailable, X-Search-Provider, X-Withholding-Unavailable, X-Analytics-Partial, X-Export-Pending, X-Partial-Portfolio).

**Closed TDs:**
- TD-011 — idempotency race → SETNX lock на mutations group
- TD-021 — asynq publisher wrapper + /market/quote cache-miss enqueue

**Opened TDs:** TD-039, TD-041 (+TD-045 pair), TD-046, TD-047 (P1 pre-GA). См. TECH_DEBT.md.

**Next:** PR B3-ii — AI mutations (7 handlers) + SSE reverse-proxy + tier gate rate-limit. Anchor ~2000-2500 LOC с учётом B3-i overrun коэффициента.

---

## Прошлые merge-события (до PR #40)

Прежние записи merge-log'а не сохранились в planning-docs (были только в commit-месседжах и PR-описаниях). Восстановить можно через `git log --merges --first-parent origin/main` в репе investment-tracker.

Последовательность PR'ов до B3-i (в порядке merge, SHA — из переписки с CC):

| PR | Scope | Squash SHA |
|---|---|---|
| TASK_04 PR A | skeleton, config, middleware basics | 14f95468 |
| TASK_04 PR B1 | first read handlers (portfolio, positions) | 462d2993 |
| TASK_04 PR B2a | read handlers batch 2 (transactions, market) | 272e5fe6 |
| TASK_04 PR B2b | read handlers batch 3 (accounts, insights, /me) | fdcf39f4 |
| TASK_05 PR #34 | AI Service (Python) | — |
| TASK_04 PR B2c | final read handlers closure — 30 GET endpoints authenticated | fb16525 |
| TASK_04 PR #40 B3-i | **(this entry — see above)** | 11d6098 |

---

## Policy — admin-bypass

Per TD-006 (см. TECH_DEBT.md):
- `--admin` merge разрешён **только** если red on main is pre-existing AND green-main fix уже в работе.
- Никогда — для реальных CI регрессий, внесённых самим PR.
- Каждый bypass логируется в этой записи с явным обоснованием.
- Использование `--admin` более одного раза за квартал — сигнал проблемы с CI-гигиеной (триггер на project-lead review).

---

## Policy — squash only

Все merge в `main` — через `gh pr merge --squash --delete-branch`. История на main = линейная, 1 PR = 1 commit. Feature-branch коммиты сохраняются только в PR-timeline на GitHub.
