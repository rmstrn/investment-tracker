# Tech Stack Audit — Provedo — 2026-04-27

**Architect:** Plugin everything-claude-code:architect
**Scope:** Backend Go + Backend Python + Frontend Next.js + Shared monorepo + Infra/Deploy
**Constraint:** R1 no spend without PO approval · OFL/MIT/Apache-2 self-host · pre-alpha sprint context

---

## Executive Summary

**Total deps audited:** 47 first-party direct deps (Go: 22, Python: 11, Web: 14) + 6 infra/CI surfaces

| Severity | Count | Themes |
|---|---|---|
| **CRITICAL** | 0 | No active CVEs in pinned versions; no EOL runtimes |
| **HIGH** | 4 | Tailwind v4 beta in prod path; uv 0.5.11 stale; biome 1.9.4 (v2 GA available); CI Go version drift |
| **MEDIUM** | 9 | Next.js 15.2→15.5 patch lag; Anthropic SDK 0.40→0.96; pytest 8→9; mypy 1.13→1.20; FastAPI 0.115→0.136; pydantic 2.10→2.13; Fiber v3.1.0 (early v3); turborepo 2.3→2.9; Recharts/lucide minor drift |
| **LOW** | 14 | Routine patch upgrades (zerolog, pgx, asynq, redis-go, etc.) |

**Top architectural concern:** Tailwind v4 pinned to `^4.0.0-beta.8` in `apps/web/package.json` while pnpm-lock has resolved `4.1.7`/`4.2.2`. Tailwind v4 went GA Jan 2025; running on beta channel is unnecessary risk. (HIGH-1)

**Top operational concern:** CI declares `GO_VERSION: "1.26"` but `go.mod` requires `1.25.0` — silent drift. (HIGH-4)

**No R1 spend approval requests.** All recommendations stay within OSS / current managed-service tier.

---

## Section 1 — Backend Go (`apps/api/`)

### 1.1 Runtime &amp; toolchain

| Component | Current | Latest | Status | Rec |
|---|---|---|---|---|
| Go | 1.25.0 (go.mod) | 1.26.x | Supported | KEEP 1.25, plan 1.26 in Sprint 3 |
| golangci-lint | v2.11.4 | v2.x | Supported | KEEP |
| Alpine base | alpine:3.23 | alpine:3.23 | Supported through ~May 2027 | KEEP |
| golang:1.25-alpine | 1.25-alpine | 1.26-alpine | Bound to runtime Go | KEEP, bump with Go |

**HIGH-4: CI Go version drift.** `.github/workflows/ci.yml` line 17 sets `GO_VERSION: "1.26"`, but `go.mod` line 3 declares `go 1.25.0`. CI happens to run because Go is forward-compatible — but `go vet`/`staticcheck` may apply 1.26 rules to a module intended to remain 1.25. Recommendation: align CI to `1.25.x` until deliberate 1.26 migration sequenced.

### 1.2 Web framework

| Library | Current | Latest | Migration | Risk if held | Rec |
|---|---|---|---|---|---|
| `github.com/gofiber/fiber/v3` | v3.1.0 | v3.x (active) | S — patch | Medium: v3 recent (GA ~2025 Q4-2026 Q1); 3.1.0 early. Bug churn risk on edge features (SSE, streaming) — TD-R091 already documents `c.SendStreamWriter` async surprise | UPGRADE to latest v3.x patch (Sprint 2) |
| `github.com/gofiber/schema` | 1.7.1 | latest | S | Low | KEEP |
| `github.com/gofiber/utils/v2` | 2.0.4 | latest | S | Low | KEEP |
| `github.com/valyala/fasthttp` | 1.69.0 | 1.69.x+ | S | Low | KEEP |

**Architectural note (Fiber v3):** Fiber v3 SSE semantics already produced TD-R091. Architect-level recommendation: stay on Fiber v3, but encapsulate SSE in a single thin adapter with a contract test. See ADR-002.

### 1.3 Data layer

| Library | Current | Latest | Status | Rec |
|---|---|---|---|---|
| `jackc/pgx/v5` | v5.9.2 | v5.x | Active | KEEP |
| `sqlc-dev/sqlc` (tool) | v1.27.0 | v1.27+ | Supported | KEEP |
| `pressly/goose/v3` | v3.27.0 | v3.x | Supported | KEEP |
| `shopspring/decimal` | v1.4.0 | v1.4.x | Stable, mature | KEEP |

### 1.4 Async / queue / cache

| Library | Current | Latest | Status | Rec |
|---|---|---|---|---|
| `hibiken/asynq` | v0.26.0 | v0.26.x | Pre-1.0 but stable; very low churn | KEEP — watchlist for &gt;1y inactivity |
| `redis/go-redis/v9` | v9.18.0 | v9.x | Supported | KEEP |
| `alicebob/miniredis/v2` | v2.37.0 | v2.x | Supported (test) | KEEP |

**Watch:** Asynq's release cadence has slowed. If maintenance signals deteriorate (no commits &gt;12 months), the replacement = **river** (riverqueue.com) on Postgres — eliminates Redis-as-queue dependency. Tracked as future watchlist.

### 1.5 Auth / webhook signing

All current and active: `MicahParks/keyfunc/v3 v3.8.0`, `MicahParks/jwkset v0.11.0`, `golang-jwt/jwt/v5 v5.3.1`, `svix/svix-webhooks v1.90.0`, `stripe/stripe-go/v82 v82.5.1` — KEEP all.

### 1.6 Observability / validation / logging

All current and active: `getsentry/sentry-go v0.46.0`, `rs/zerolog v1.35.1`, `go-playground/validator/v10 v10.20.0`, `prometheus/client_golang v1.23.2`, `go.opentelemetry.io/otel v1.41.0` — KEEP all.

### 1.7 Codegen

`oapi-codegen/v2 v2.4.1` — supported, but **TD-007** (OpenAPI 3.1 nullable bug, upstream issue #373) STILL OPEN. Watchlist for upstream fix.
`getkin/kin-openapi v0.127.0` — KEEP.

### 1.8 Testing

`testcontainers/testcontainers-go v0.42.0`, `stretchr/testify v1.11.1` — KEEP.

**Section 1 verdict:** Go stack in good shape. No CVEs surfaced by `govulncheck` workflow. Only HIGH item is Go version drift in CI — one-line fix.

---

## Section 2 — Backend AI Python (`apps/ai/`)

### 2.1 Runtime &amp; toolchain

| Component | Current | Latest | Status | Rec |
|---|---|---|---|---|
| Python | 3.13 | 3.13.x | Supported; 3.14 GA Oct 2025 historical | KEEP 3.13 |
| `python:3.13-slim` (Docker) | latest 3.13-slim | 3.13-slim | Supported | KEEP |

### 2.2 uv (package manager)

**HIGH-2: uv version stale.**

- **Currently pinned:** `0.5.11` (Dockerfile + CI env)
- **Latest stable:** uv has progressed 0.5.x → 0.6.x → 0.7.x cadence; 0.5.11 was leading-edge Dec 2025
- **Migration effort:** S (1-2 hours) — bump in 3 places (Dockerfile, ci.yml env, deploy-ai.yml if any)
- **Risk if held:** Correctness fixes for resolution ordering and Python version selection across 0.5→0.6→0.7. Pre-alpha can defer one cycle, not two
- **Recommendation:** UPGRADE to `0.7.x` as part of Sprint 1 + `uv lock --upgrade`

### 2.3 Framework / runtime

| Library | Lockfile | pyproject pin | Latest | Rec |
|---|---|---|---|---|
| fastapi | 0.136.0 | `&gt;=0.115` | 0.136+ | KEEP — pin upper bound? See ADR-003 |
| starlette | 1.0.0 | (transitive) | 1.x | S — KEEP |
| uvicorn | 0.45.0 | `&gt;=0.32` | 0.45+ | KEEP |
| pydantic | 2.13.3 | `&gt;=2.10` | 2.13.x | S — KEEP |
| pydantic-settings | 2.14.0 | `&gt;=2.7` | 2.14 | KEEP |
| httpx | 0.28.1 | `&gt;=0.28` | 0.28.x | KEEP |

### 2.4 LLM SDK

**MEDIUM-1: Anthropic SDK gap.**
- pyproject pin: `anthropic&gt;=0.40`
- Lockfile resolved: 0.96.0
- Issue: Pin floor 0.40 permits regression if transitive resolution ever drops down. Lockfile saves us, but floor is stale.
- **Recommendation:** UPGRADE pin to `&gt;=0.96`. S effort.

### 2.5 Observability

| Library | Lock | pyproject | Rec |
|---|---|---|---|
| sentry-sdk[fastapi] | 2.58.0 | `&gt;=2.18` | KEEP |
| structlog | 25.5.0 | `&gt;=24.4` | UPGRADE floor `&gt;=25.0` |
| python-json-logger | 4.1.0 | `&gt;=2.0` | **UPGRADE floor `&gt;=4.0`** — major version jump |
| posthog | 7.13.0 | `&gt;=3.7` | **UPGRADE floor `&gt;=7.0`** — major version jump |

**MEDIUM-2: pyproject floors lag lockfile by majors.** Three deps with stale defaults nobody refreshed. Hygiene PR — single sweep.

### 2.6 Dev tooling

| Library | Lock | pyproject | Rec |
|---|---|---|---|
| ruff | 0.15.11 | `&gt;=0.8` | UPGRADE floor `&gt;=0.15` |
| mypy | 1.20.2 | `&gt;=1.13` | UPGRADE floor `&gt;=1.20` |
| pytest | 9.0.3 | `&gt;=8.3` | UPGRADE floor `&gt;=9.0` |
| pytest-asyncio | 1.3.0 | `&gt;=0.24` | UPGRADE floor `&gt;=1.0` |

**Section 2 verdict:** Lockfile healthy and current. Story is **pyproject floor hygiene** — 7 deps lag actual resolved by 1 minor or 1 major. Single-PR sweep, S effort.

---

## Section 3 — Frontend Next.js / TS (`apps/web/` + workspaces)

### 3.1 Runtime &amp; toolchain

| Component | Current | Latest | Status | Rec |
|---|---|---|---|---|
| Node | 22 (engines, CI) | 22 LTS / 24 current | 22 LTS through Apr 2027 | KEEP 22 |
| pnpm | 9.15.0 | 10.x | pnpm 10 GA early 2025 | EVALUATE pnpm 10 in Sprint 3 — has lockfile format change |
| TypeScript | 5.7.2 (root + apps) | 5.9.x | Supported | UPGRADE direct pin to `^5.9` |

### 3.2 Framework

| Library | Pinned | Lock | Latest | Rec |
|---|---|---|---|---|
| next | `^15.2.3` | 15.5.15 | 15.5.x | UPGRADE pin to `^15.5.0` |
| react | `19.2.5` (exact) | 19.2.5 | 19.x | KEEP |
| react-dom | `19.2.5` (exact) | 19.2.5 | 19.x | KEEP |

### 3.3 Styling

**HIGH-1: Tailwind v4 beta in production path.**
- **Pinned:** `tailwindcss: "^4.0.0-beta.8"` and `@tailwindcss/postcss: "^4.0.0-beta.8"`
- **Lock resolved:** `4.1.7`/`4.2.2` (caret carried forward)
- **Latest stable:** Tailwind v4 GA Jan 2025; current 4.2.x
- **Issue:** Beta floor in package.json. Confusing signal for new contributors. CI would also accept future `4.0.0-beta.X` resolution.
- **Migration effort:** S (10 minutes)
- **Recommendation:** UPGRADE pin to `^4.2.0` immediately. ADR-001.

### 3.4 Data fetching / state / forms

| Library | Pinned | Lock | Rec |
|---|---|---|---|
| @tanstack/react-query | `^5.62.7` | 5.99.2 | KEEP — bump floor to `^5.99` |
| @clerk/nextjs | `^6.16.0` | 6.39.2 | KEEP — bump floor to `^6.39` |

**Note:** `apps/web/package.json` does **not list react-hook-form, zod, or motion** as direct deps, despite `01_TECH_STACK.md` declaring them. Either deferred or doc is aspirational. **Architectural drift to flag.**

### 3.5 UI primitives

| Library | Pinned | Lock | Latest | Rec |
|---|---|---|---|---|
| lucide-react | `^0.468.0` | 0.468.0 | 0.5xx | UPGRADE — many new icons, S |
| recharts (in `packages/ui`) | `^3.8.1` | 3.8.1 | 3.x | KEEP |
| geist (font) | `^1.3.1` | — | 1.x | KEEP |

### 3.6 Testing

| Library | Pinned | Lock | Latest | Rec |
|---|---|---|---|---|
| vitest | `^2.1.8` | 2.1.9 | 3.x | EVALUATE — Vitest 3 GA early 2025 (Sprint 3) |
| @testing-library/react | `^16.1.0` | 16.x | 16.x | KEEP |
| @testing-library/jest-dom | `^6.6.3` | 6.x | 6.x | KEEP |
| happy-dom | `^15.11.7` | 15.11.7 | 15.x or 16.x | EVALUATE (Sprint 3) |

### 3.7 Lint / format

**HIGH-3: Biome v1 vs v2.**
- **Currently pinned:** `@biomejs/biome: "1.9.4"`
- **Latest stable:** Biome 2.0 GA June 2025
- **Migration effort:** M (2-4 days) — has migration command, deprecates several v1 rules. Project has 9 pre-existing `biome-ignore` (TD-004) needing re-validation
- **Risk if held:** v1 maintenance window will close
- **Recommendation:** UPGRADE in Sprint 2. ADR-004.

### 3.8 Monorepo / orchestration

| Library | Pinned | Lock | Rec |
|---|---|---|---|
| turbo | `^2.3.3` | 2.9.6 | UPGRADE pin to `^2.9.0` |
| lefthook | `^1.10.1` | 1.13.6 | UPGRADE pin to `^1.13.0` |
| @commitlint/cli | `^19.6.0` | 19.x | KEEP |

### 3.9 OpenAPI tooling

| Library | Pinned | Lock | Rec |
|---|---|---|---|
| @redocly/cli | `^2.29.0` | 2.x | KEEP |
| @scalar/cli | `^1.0.0` | 1.x | KEEP |
| openapi-typescript | `^7.4.4` | 7.13.0 | UPGRADE pin to `^7.13.0` |
| openapi-fetch | `^0.13.4` | 0.13.8 | KEEP |

**Section 3 verdict:** Two HIGH items + cluster of pin-floor hygiene MEDIUMs. Pinned floors lag actual resolved versions across whole frontend. Suggests no upgrade cadence has been set since project bootstrap. ADR-005 proposes Renovate Bot config (free OSS — no R1 spend).

---

## Section 4 — Shared / Monorepo

### 4.1 Lockfiles &amp; integrity

- `pnpm-lock.yaml` `lockfileVersion: '9.0'` — current pnpm 9 format
- `apps/ai/uv.lock` — present and committed (TD-008 manual generation still open)
- `go.sum` — present, CI runs `go mod tidy` + diff
- No `go.work` file — single-module structure, fine for current scope

### 4.2 Generated client packages

- `packages/api-client` wraps `openapi-fetch` over `packages/shared-types` types — healthy
- Drift detection covered by `contract-k6-spec-sync` CI job — good
- **MEDIUM-3: No drift detection between Go-generated types and OpenAPI spec at PR time.** Recommend adding CI step `pnpm generate:go && git diff --exit-code`.

### 4.3 GitHub Actions versions

All actions version-current except:

**MEDIUM-4: `superfly/flyctl-actions/setup-flyctl@master`** appears in `deploy-api.yml`, `deploy-ai.yml`, `doppler-sync.yml`. Pinning to `@master` defeats SHA pinning purpose — SLSA-graded supply-chain risk. Pin to SHA or release tag. Sprint 1.

---

## Section 5 — Infra / Deploy

### 5.1 Docker base images

All current and supported. Redis 7-alpine vs Redis 8 — EVALUATE Redis 8 in Sprint 3 (only after Upstash supports stable on prod tier).

### 5.2 Managed services

- Neon Postgres 17 — matches local `pgvector/pgvector:pg17`, parity good
- Upstash Redis 7 — matches local
- Vercel CLI — recommend explicit pin
- Fly.io flyctl — `@master` (MEDIUM-4)
- Doppler v4, Sentry v3, Clerk 6.39, Stripe v82 — all KEEP

### 5.3 Local dev parity

`docker-compose.yml` matches managed-service major versions — **excellent parity discipline**. No action.

---

## Section 6 — ADR drafts

### ADR-001: Tailwind v4 beta → 4.2 stable pin
**Status:** Proposed
**Decision:** Bump floor to `^4.2.0` in both `tailwindcss` and `@tailwindcss/postcss` packages.
**Migration:** ~10 min, S effort.

### ADR-002: Encapsulate Fiber v3 SSE behind a thin adapter
**Status:** Proposed
**Context:** Fiber v3.1.0 SSE semantics already produced TD-R091 (race on persist). Mid-pre-alpha too early to swap framework.
**Decision:** Wrap all SSE writes in `apps/api/internal/transport/sse` package with contract test asserting flush-before-return.
**Migration:** M effort, ~1 day.

### ADR-003: Tighten Python pyproject floors to current lockfile
**Status:** Proposed
**Decision:** Bump floors for 7 deps (anthropic, sentry-sdk, structlog, python-json-logger, posthog, ruff, mypy, pytest, pytest-asyncio) to match current major.minor of lockfile.
**Migration:** S effort, ~15 min.

### ADR-004: Migrate Biome v1.9.4 → v2.x
**Status:** Proposed (Sprint 2)
**Context:** Biome 2.0 GA June 2025; on 1.9.4. v2 brings new rules, deprecates several v1 rules, has migration command. 9 pre-existing `biome-ignore` (TD-004) need re-validation.
**Decision:** Run `biome migrate` in dedicated PR. Re-validate every existing ignore. Adopt new rules incrementally.
**Migration:** M effort, 2-4 days.

### ADR-005: Adopt Renovate Bot for dependency upgrade cadence
**Status:** Proposed (Sprint 3)
**Context:** Audit revealed pin-floor drift across Python + Web. No upgrade cadence set since bootstrap. Manual quarterly review will not scale.
**Decision:** Add `renovate.json` at repo root. Group patch+minor PRs weekly. Group majors monthly. Auto-merge patch level for trusted ecosystems on green CI.
**Cost:** **$0** — Renovate is free for OSS / GitHub OAuth via Mend's hosted bot. **No R1 spend.**

---

## Section 7 — Recommended sequence (for tech-lead decomposition)

### Sprint 1 — Stop-the-bleed (1-2 days, all S, all zero-risk)
1. CI Go version alignment (HIGH-4) — ci.yml line 17: `GO_VERSION: "1.25"`
2. Tailwind beta pin → 4.2 (HIGH-1, ADR-001)
3. Pin Fly action SHA/tag (MEDIUM-4) — replace `@master` in 3 workflows
4. uv 0.5.11 → 0.7.x (HIGH-2)
5. Bump pyproject floors (ADR-003) — single PR sweeping all 7

### Sprint 2 — High-impact (1 week)
1. Biome v1 → v2 (HIGH-3, ADR-004) — M, dedicated PR, re-validate TD-004
2. Fiber v3 SSE adapter (ADR-002) — M, refactor PR
3. Pin floor sweep — Web (turbo, lefthook, lucide, openapi-typescript, tanstack-query, clerk, biome itself once on v2)
4. Next.js floor 15.2 → 15.5
5. TypeScript 5.7 → 5.9

### Sprint 3+ — Continuous (watchlist)
1. Renovate Bot (ADR-005)
2. Go 1.25 → 1.26
3. pnpm 9 → 10 (lockfile format migration)
4. Vitest 2 → 3
5. Asynq watchlist — replacement = river queue if maintenance signals deteriorate
6. Redis 7 → 8 (when Upstash supports)
7. Python 3.13 → 3.14 (when SDKs catch up)
8. TD-007 follow-up — when oapi-codegen fixes upstream issue #373

---

## Risks identified

1. **Stack-doc vs reality drift.** `01_TECH_STACK.md` declares «React Hook Form + Zod» and «Motion». None appear as direct deps in `apps/web/package.json`. Either deferred or aspirational. Tech-lead should reconcile.
2. **No SBOM generation.** CI runs gitleaks/trivy/govulncheck (good!) but no SBOM published. For SOC 2 (TD-060 references KMS migration), should be on roadmap.
3. **`@master` action pinning on Fly** — supply-chain risk class.
4. **Pin-floor drift is structural, not anecdotal** — recurs without ADR-005 (Renovate).
5. **TD-007 stays open** until upstream `oapi-codegen#373` lands. Watch trigger: 2026-Q3.
6. **Asynq pre-1.0 + slowing maintenance** — strategic watchlist. Replacement candidate = river.

---

## Open questions for PO

1. **Sprint 1 hygiene bundle** — green-light to land all 5 Sprint 1 items as one tech-hygiene PR series?
2. **Renovate Bot adoption** (ADR-005) — confirm OK to introduce. **No R1 spend** (free).
3. **TD-007 watch-trigger date** — propose 2026-Q3 review. Confirm or adjust.
4. **Reconciling stack-doc drift** — is React Hook Form / Zod / Motion deferred or removed from declared stack?
5. **SBOM publication** — SOC 2 prereq before alpha, or post-launch?

---

**Audit complete.** Ready for tech-lead pickup. Decomposition into micro-PR slices, sprint kickoff docs, and `TECH_DEBT.md` updates are out of scope per architect role boundary — handing off to tech-lead.
