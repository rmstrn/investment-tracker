# Merge Log

Append-only log of merges to `main`. Every entry captures: PR number + title, merge commit SHA, merger, merge mode, and — if `--admin` was used — the pre-existing red cited and the green-fix PR.

Policy reference: `DECISIONS.md` → "Admin merge bypass policy" (2026-04-19).

Newest entries at the top.

---

## 2026-04-19 — PR #39 `feat(api): TASK_04 PR B2c — analytics + tax domain (read-path close)`

- **Merged as:** `fb16525` (squash)
- **Merger:** project lead
- **Admin bypass:** no (CI green, 8/8 jobs)
- **Branch deleted:** yes (remote `feat/core-backend-b2c` auto-deleted by gh; local worktree remains, will be removed at PR B3 kickoff)
- **Notes:** 7 commits squashed + 1 pre-merge fix: commit 0 (`chore(openapi): mark analytics factor/style/corr + tax withholding nullable`) → `feat(api): tiers.Limit — AdvancedAnalytics + TaxReports bools` → `feat(api): internal/domain/analytics — pure metrics pkg` (Sharpe, Sortino, MaxDD, Volatility, underwater_series) → `feat(api): internal/domain/tax — FIFO/LIFO pure pkg` (hardcoded FIFO in handler, LIFO in pkg for future) → `feat(api): GET /portfolio/analytics — Pro-only quant block` → `feat(api): GET /portfolio/tax — Pro-only FIFO report` → `test(api): extend AI-auth cross-handler test with B2c endpoints` (21 authenticated + 2 public glossary = 23 covered). **Pre-merge compliance commit `ce23519` — `X-Tax-Advisory: mvp-estimate` response header on `/portfolio/tax` so UI always surfaces "estimate, not tax advice" disclaimer; separate compliance decision, not scope creep.** ~1600 LOC (~7% overshoot on 1300-1500 forecast, accepted). Scope-adjacent: openapi nullable patch (same pattern as PR #37 benchmark + PR #38 performance parallel to TD-020), `tiers.Limit` extended with `AdvancedAnalytics` + `TaxReports` Pro-only bools, new sqlc query `ListAllTransactionsByUser` (unbounded — legit for FIFO which requires full history; cost-DoS risk tracked as TD-038), AI-auth fixture tier bumped Plus → Pro to cover both Plus-gated and Pro-only endpoints in one fixture. Scope-cuts all signal via response headers (`X-Analytics-Partial`, `X-Withholding-Unavailable`) + openapi nullable — no fake data. US + DE jurisdictions implemented; others → 400 `JURISDICTION_NOT_SUPPORTED` with `supported_jurisdictions` in details. MVP tax formula uses `realized_gains - realized_losses` (US) and same minus €1000 Sparer-Pauschbetrag (DE) — full rules deferred to TD-036. New TD entered: TD-031 (withholding_amount per-tx schema), TD-032 (factor-model + style feeds), TD-033 (correlation_matrix from prices + sparsity), TD-034 (cost-basis method UI + tax_lots migration — closes `specific_id`), TD-035 (IT/FR/UK/PL/ES/NL jurisdictions), TD-036 (full rule set: US wash-sale, long/short split, DE couples), TD-037 (short-sale / uncovered-qty), TD-038 (paginate/stream `ListAllTransactionsByUser`). **TASK_04 read-path is now closed end-to-end:** 28 authenticated read handlers (B2a 6 + B2b 20 + B2c 2) + public `/glossary*` = 30 GET endpoints, all under dual-mode auth, all in cross-handler AI-auth coverage. Next up: PR B3 (mutations + webhooks + SSE + async), closes TD-021 and TD-027.

---

## 2026-04-19 — PR #38 `feat(api): TASK_04 PR B2b — rest-of-reads (20 handlers)`

- **Merged as:** `fdcf39f4` (squash)
- **Merger:** project lead (via `gh pr merge --squash --delete-branch`)
- **Admin bypass:** no (CI green, 8/8 jobs)
- **Branch deleted:** yes (remote `feat/core-backend-b2b`)
- **Notes:** 18 commits squashed: 20 handlers across 8 domain groups (`/me*` ×6, `/accounts*` ×3, detail GETs ×3, portfolio history/allocation/performance-compare ×3, market search/history ×2, plumbing `/fx_rates`+`/prices`, AI conversations/insights ×3, glossary ×2) + extended cross-handler AI-auth test (17/18 authenticated endpoints — `/me/sessions` stub excluded) + gosec G109 silence. Scope came in at ~3700 LOC vs 1700-1800 est — integration test per endpoint doubled volume, accepted pattern from B2a. Scope-adjacent: 14 new sqlc queries, nullable openapi fix for `PortfolioPerformanceBenchmark` fields (same pattern as PR #37 benchmark fix, parallel to TD-020), new `internal/domain/tiers/limits.go` as shared per-tier caps module for B2b reads + B3 mutation gates, `/glossary*` mounted outside authenticated group per `security: []` spec. New TD entered: TD-027 (Clerk Backend SDK for sessions), TD-028 (monthly rollup for best_month/worst_month), TD-029 (symbol-master provider), TD-030 (OHLC ingest pipeline — `/market/history` returns 501 with working validation). 14 stubs/degraded responses all signal via response headers (`X-Clerk-Unavailable`, `X-Search-Provider`, `X-Benchmark-Unavailable`) or explicit 501 NOT_IMPLEMENTED — no placeholder data anywhere. Read-path for AI Service now complete end-to-end; analytics + tax domain modules to follow in PR B2c.

---

## 2026-04-19 — PR #37 `feat(api): TASK_04 PR B2a — foundation + 6 AI-facing read endpoints`

- **Merged as:** `272e5fe6` (squash, via `gh pr merge` API path — main worktree was dirty with uncommitted docs, clean API merge avoided branch-switch risk)
- **Merger:** project lead
- **Admin bypass:** no (CI green, 8/8 jobs)
- **Branch deleted:** yes (remote `feat/core-backend-b2`); local worktree `D:\investment-tracker-t04` removed post-merge since branch is gone
- **Notes:** 16 commits squashed: commit 0 (fail-fast JWKS) + 4 foundation (cursor pagination helper, FX resolver Redis→PG→inverse, rate-limit + idempotency GET passthrough, shared testcontainers harness) + 6 AI-facing GETs (`/portfolio`, `/positions`, `/transactions`, `/portfolio/performance`, `/market/quote`, `/portfolio/dividends`) + 1 cross-handler AI-auth integration test + 1 gosec G115 silence + 3 pre-merge fixes (benchmark nullable openapi spec fix, `?currency=` → `?display_currency=` rename, `errs.ErrQuoteNotAvailable` sentinel promotion). TD-025 closed pre-merge. New debt entered: TD-020 (benchmark_prices ingest), TD-021 (asynq publisher wire in handlers), TD-022 (dividends / corporate_actions table), TD-024 (previous_close + change_24h not modeled). TD-023 (`total_count` always null in PaginatedEnvelope) not entered — UI-driven need, will add if first client requires progress indicator. PR B2a unlocks real AI↔Core e2e integration test: TASK_05 follow-up in a fresh session can now flip `apps/ai/src/ai_service/clients/core_api.py` 404-swallow and run end-to-end tool calls against live Core API.

---

## 2026-04-19 — PR #36 `feat(api): TASK_04 PR B1 — AI Service unblock (internal auth + /internal/ai/usage)`

- **Merged as:** `462d2993` (squash)
- **Merger:** project lead
- **Admin bypass:** no (CI green, 8/8 jobs)
- **Branch deleted:** yes (remote `feat/core-backend-b1`)
- **Notes:** Closes TD-013 on the Core API side. 11 commits squashed: 8 feature (ai_usage migration `20260419120006`, sqlc queries, dual-mode auth + UserLookup iface, UUIDv7 request-id + level-by-status log, Sentry + internal/app.Deps cycle-break, `/internal/ai/usage` handler with tx + validation + 202, unit tests, testcontainers integration tests) + 3 chore CI follow-ups (`go mod tidy`, golangci-lint exitAfterDefer + G115, `main → run()` refactor). AI Service can now flip `apps/ai/src/ai_service/clients/core_api.py` from 404-swallow to proper error propagation — follow-up PR in apps/ai (not blocking B2). New TD-019 added: integration tests guarded by `-tags integration` are not executed in CI (no Docker runner yet).

---

## 2026-04-19 — PR #35 `feat(api): TASK_04 PR A — Core Backend foundation`

- **Merged as:** `14f95468` (squash)
- **Merger:** project lead
- **Admin bypass:** no (CI green, 8/8 jobs)
- **Branch deleted:** yes (remote `feat/core-backend`)
- **Notes:** TASK_04 Core Backend foundation. 12 commits squashed: 8 feature (go-pin, config+logger+Fiber, sqlc+queries, oapi-codegen+TD-007 preprocessor, Clerk auth+user repo+errors, Redis cache+rate-limit+idempotency, AES-GCM envelope, fingerprint+portfolio calculator) + 4 chore (`.env.example` refresh, review fixes for `CORE_API_INTERNAL_TOKEN` + portfolio partial semantics, `go mod tidy` promoting direct deps, golangci-lint 7-issue cosmetic pass). Speculative TD-012 "Go 1.25 CI bump" never materialized — existing CI and Dockerfile already on `golang:1.26-alpine` from wave 1, so Go 1.25 floor in `go.mod` was satisfied from day one. Known follow-ups: TD-011 (idempotency race), TD-018 (KEK rotation test gap). PR B1 starts from this commit.

---

## 2026-04-19 — PR #34 `feat(ai): AI Service MVP`

- **Merged as:** `1d46ed9` (squash)
- **Merger:** AI service lead (TASK_05 CC session)
- **Admin bypass:** no (CI green, 7/7 jobs)
- **Branch deleted:** yes
- **Notes:** Closes wave 2 AI Service scope. 8 conventional commits squashed. 40 tests green, ruff + mypy --strict clean. Follow-up PR planned to replace `record_ai_usage` stub once Core API `/internal/ai/usage` endpoint ships (TD-013).

---

## 2026-04-19 — PR #32 `chore: fix CI red on main + tokens subpath exports`

- **Merged as:** `9dc4a7a` (squash)
- **Merger:** project lead
- **Admin bypass:** no
- **Branch deleted:** yes
- **Notes:** Closed the admin-bypass window opened by #29/#30/#31. Fixed biome lint (9 justified ignores + 1 a11y improvement in BellDropdown + 1 autofix), Python setup-uv via initial `apps/ai/uv.lock` commit, and design-tokens subpath exports regression (TD-R001). First fully green `main` build after wave 1 merge train.

---

## 2026-04-19 — PR #31 `fix(design): contrast & CountUpDemo`

- **Merged as:** `8ab31a0` (squash, `--admin`)
- **Merger:** project lead
- **Admin bypass:** yes
- **Pre-existing red cited:** biome lint errors in `packages/ui` (25 files) and Python setup-uv failing due to missing `apps/ai/uv.lock` — both on `main` prior to this PR
- **Green-fix PR:** #32 (queued at merge time, merged same day)
- **Branch deleted:** yes
- **Notes:** A11y fix — raised `border.strong` contrast to 2.27:1 where borders carry interactive meaning. CountUpDemo stub replaced with real component at primitives.tsx:217.

---

## 2026-04-19 — PR #30 `feat(api): OpenAPI 3.1 contract + DB migrations`

- **Merged as:** `08f44c2` (squash, `--admin`)
- **Merger:** project lead
- **Admin bypass:** yes
- **Pre-existing red cited:** same as #31 (biome + setup-uv)
- **Green-fix PR:** #32
- **Branch deleted:** yes
- **Notes:** TASK_03 completion. `tools/openapi/openapi.yaml` (3571 lines) + initial goose migrations for tiers A/B/C. TD-007 (oapi-codegen 3.1 nullable) surfaced here.

---

## 2026-04-19 — PR #29 `feat(design): design system v1.0`

- **Merged as:** `b6aa0c4` (squash, `--admin`)
- **Merger:** project lead
- **Admin bypass:** yes
- **Pre-existing red cited:** same as #31
- **Green-fix PR:** #32
- **Branch deleted:** yes
- **Notes:** TASK_02 completion. Style Dictionary tokens, Tailwind config, shadcn/ui base, 20+ primitives in `packages/ui`. Ran into design-tokens subpath export issue that #32 later resolved.

---

## Pending

- **PR B3 — split into B3-i/B3-ii/B3-iii by coherent surface** (per DECISIONS 2026-04-19 "PR B3 split"). Pre-flight audit: 36 mutation endpoints (not ~50-60) + 5 deferred GETs + 3 infra blocks. Sequential merge ordering enforced.
  - **PR B3-i (Data-path + asynq)** — in progress on `D:\investment-tracker-b3`, branch `feat/core-backend-b3` from `fb16525`. 19 handlers (accounts 7, transactions 3, /me data 5, notifications 2 reads, exports 1 GET + 1 POST async stub) + asynq publisher wire-in + SETNX idempotency lock. Closes **TD-011** (idempotency race) and **TD-021** (asynq publisher). Expected ~2200 LOC. New TDs anticipated: TD-039 (CSV export worker consumer), TD-041 (hard_delete_user worker), TD-045 (undo-deletion worker idempotency guard).
  - **PR B3-ii (AI bundle)** — branches from B3-i merge. 7 handlers (AI conversations 2, chat POST + SSE stream, insights mutations 3) + SSE reverse-proxy to AI Service + AI tier rate-limits. Expected ~1400 LOC. New TDs anticipated: TD-040 (SSE reconnect/resume), TD-044 (concurrent AI chat cap per user).
  - **PR B3-iii (Auth + billing)** — branches from B3-ii merge. 11 handlers + 2 webhooks + 2 billing GETs. /me/2fa (4) + sessions DELETE (2) + billing mutations (3) + billing reads (2) + Clerk webhook + Clerk Backend SDK + Stripe webhook + Stripe SDK + `webhook_events(source, event_id)` migration. Closes **TD-027** (Clerk Backend SDK — enables real /me/sessions list). Expected ~2400 LOC. New TDs anticipated: TD-042 (Stripe invoice.payment_failed notification wiring), TD-043 (2FA backup codes storage — depends on Clerk SDK self-host vs managed).
- **PR C (Core Backend — ops)** — Dockerfile <50MB distroless + fly.toml + k6 load-test + deploy runbook. Branches from B3-iii merge.
- **AI Service 404-swallow flip** — follow-up PR in `apps/ai`, not blocking B3. With PR B1 (`/internal/ai/usage` endpoint) + full B2 read-path live, AI Service can now flip `clients/core_api.py` from silent 404-swallow to proper error propagation + log, and run real end-to-end tool calls against live Core API. Small (~20 LOC + httpx.MockTransport assertion). Run through TASK_05 CC in a fresh session when ready.
