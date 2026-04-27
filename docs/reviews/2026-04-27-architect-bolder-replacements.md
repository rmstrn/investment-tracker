# Bolder Replacement Audit — Provedo — 2026-04-27

**Architect:** plugin everything-claude-code:architect
**Mission:** «Fast + beautiful + scalable» — re-evaluate stack with bolder lens. PO open to bigger rewrites if ROI is real.
**Constraints:** R1 (no new paid SaaS) · pre-alpha sprint context · production-ready only (no betas)
**Companion to:** `docs/reviews/2026-04-27-architect-tech-stack-audit.md`

---

## Methodology shift

Original audit asked «is component current?» (hygiene lens). This re-audit asks «is the category choice right?» (architecture lens).

---

## TOP 3 RECOMMENDED bolder moves (post-alpha, all R1-clean)

### ADR-B-001: Fiber v3 → chi + stdlib net/http (M, ~3-4 days)

**Status:** Proposed — post-alpha
**Why:** Fiber v3 is early-major (v3.1.0); already produced TD-R091 SSE bug. fasthttp's non-stdlib semantics cause subtle bugs over time. chi is the most boring, battle-tested Go router. Migrating gives:
- stdlib `net/http` = `otelhttp` first-class (today we wrap Fiber to expose otel)
- 5x larger middleware ecosystem (rate limit, csrf, jwt all stdlib-targeted)
- Onboarding cost zero for any Go dev
- Fiber's «zero-allocation routing» perf benefit doesn't show at our scale

**Sequence:** Post-alpha, before more streaming features land.

### ADR-B-002: Asynq → River queue (M, ~3-5 days, conditional)

**Status:** Proposed — post-alpha, conditional
**Why:** Asynq is pre-1.0 (v0.26.0), maintenance cadence slowing. River is Postgres-backed (eliminates Redis-as-queue), actively maintained by Brandur (ex-Stripe), type-safe job args via codegen. Benefits:
- Postgres-native = uses existing backup/monitor/replication infra
- One fewer critical-path service (Upstash Redis becomes optional cache only)
- Simpler SOC 2 story (one less data store with PII-adjacent payloads)

**Trigger condition:** Asynq main branch >12 months without commits OR Redis incident causes job-queue downtime.

### ADR-B-003: Turbo → Moon spike (2 days eval)

**Status:** Proposed — exploratory, post-alpha
**Why:** Our monorepo is multi-language (Go + Python + TS). Turborepo's caching model is JS-first — Go and Python tasks run via shell scripts that Turbo cannot meaningfully cache. Moon (`moonrepo/moon`) is language-agnostic with explicit Go and Python toolchain integration; `proto`-managed runtime versions replace ad-hoc Node 22 / Go 1.25 / Python 3.13 declarations.

**Decision:** 2-day spike post-alpha. If CI cache hit rate improves >25% on representative PRs → schedule M migration.

**Pros:** Native Go + Python toolchain (real cache, not wrapper cache); proto = single source of truth для runtime versions (closes HIGH-4 «Go version drift» permanently); affected-projects detection across all 3 languages; free, OSS, self-hosted.

---

## CLEAR REJECTED list (with rationale)

### REJECTED-1: Bun + Hono replacing Go API
**Why considered:** Language unification (one runtime FE+BE).
**Why rejected:**
- Fintech ecosystem fit (Go's decimal, Stripe SDK, Svix, race detector — exactly what fintech needs)
- Migration cost is XL — months not weeks
- Concurrency model regression — Bun/Node async-await ≠ Go goroutines for parallel broker syncs
- Type unification benefit overstated — already 70% solved by `packages/shared-types` + OpenAPI codegen
- Single-binary deploy — Go's killer ops feature

### REJECTED-2: Next.js 15 → Vite + TanStack Start
**Why considered:** Build speed, simpler mental model, no RSC complexity.
**Why rejected:**
- Turbopack already delivers Vite-class HMR (`next dev --turbopack`)
- TanStack Start 1.0 only just stabilized — adopting at riskiest moment
- Migration cost XL — ~40-80 future routes
- Loses Vercel free-tier optimizations (image, fonts, middleware, ISR)
- Verdict: Reject for v1, revisit at v2 if RSC pain materializes

### REJECTED-3: Cloudflare Workers replacing Fly backend
**Why considered:** Edge-first, free tier, best DDoS protection.
**Why rejected:**
- Workers can't run Go binaries (V8-only)
- Workers can't host long-lived job consumers (Asynq/River)
- pgx + TCP Postgres incompatible with Workers
- Fly.io regional pinning (fra) provides predictable EU latency for stateful DB-backed API

### Additional REJECTs:
- **FastAPI → Litestar** — `apps/ai` is thin LLM proxy; Anthropic API latency dominates by 100x. Framework perf is fictional ROI.
- **Supabase / PlanetScale replacing Neon** — Neon is best-in-class for Postgres-serverless; Clerk auth correct over Supabase auth.
- **Solid.js / Qwik replacing React** — ecosystem-of-one for fintech; no Clerk/TanStack/Recharts equivalents.
- **Vanilla Extract replacing Tailwind v4** — Tailwind v4's CSS-first config already solves typed-tokens problem.
- **Modal / Replicate** — paid SaaS, R1 violation.

---

## Section A — Per-candidate evaluation (full table)

Migration cost legend: **S** = ≤1 day · **M** = 2-5 days · **L** = 1-3 weeks · **XL** = 1-3 months

### Backend Go

| Current | Proposed | ROI driver | Migration cost | Risk | Verdict |
|---|---|---|---|---|---|
| Go 1.25 + Fiber v3 | Bun + Hono on TS server | Language unification | XL — ~40-60 files rewrite | HIGH — Bun on server still maturing; fintech ecosystem leans Go-native | **REJECT** |
| Fiber v3 | Chi + stdlib net/http | Stability, larger middleware ecosystem, otelhttp first-class | M — replace router + middleware shim | LOW — chi is most boring, battle-tested router | **STRONG CONSIDER (post-alpha)** ADR-B-001 |
| Asynq (Redis-backed) | River queue (Postgres-backed) | Eliminate Redis-as-queue, type-safe args, active maintenance | M — ~5-10 job types | LOW — River 0.13+ production-stable | **CONSIDER (conditional)** ADR-B-002 |
| pgx direct + sqlc | + PgBouncer / pgx pool tuning | Connection scaling | S — config-only | LOW | **DEFER, prepare runbook** |
| HTTP API | Add NATS / Kafka for events | Real-time multi-broker sync | XL | HIGH for pre-alpha | **REJECT for now** |

### Backend Python AI

| Current | Proposed | ROI driver | Migration cost | Risk | Verdict |
|---|---|---|---|---|---|
| FastAPI 0.136 | Litestar 2.x | ~30% faster, better DI | M — ~10-15 endpoints | MEDIUM — smaller ecosystem | **REJECT** (Anthropic latency dominates) |
| Pydantic v2 | + msgspec on hot paths | 5-10x faster serialize | S — surgical | LOW | **DEFER, watch-trigger** (>100 req/s) |
| uvicorn + own host | Modal / Replicate | Auto-scaling AI workers | — | — | **REJECT (R1 violation)** |
| FastAPI + uvicorn | Granian (Rust-based ASGI) | 2-3x throughput | S — drop-in | MEDIUM — smaller community | **WATCHLIST** |

### Frontend

| Current | Proposed | ROI driver | Migration cost | Risk | Verdict |
|---|---|---|---|---|---|
| Next.js 15 | Vite + TanStack Router + Start | Build speed, no RSC complexity | XL — full rewrite | HIGH — TanStack Start 1.0 young | **REJECT for v1** |
| Next.js | Nuxt / Astro / SvelteKit | Different framework | XL | HIGH — ecosystem reset | **REJECT** |
| React 19 | Solid.js / Qwik | Truly fast SPA primitives | XL+ | VERY HIGH | **REJECT** |
| pnpm 9 + Turborepo 2.3 | Bun runtime + Turborepo | Faster install + test | M | MEDIUM — Bun-on-Windows rough | **DEFER** |
| Turborepo | Moon | Multi-language monorepo native | M | MEDIUM | **CONSIDER (post-alpha)** ADR-B-003 |
| Tailwind v4 | Vanilla Extract / Pigment | Type-safe styles | L | MEDIUM | **REJECT** (Tailwind v4 already CSS-first) |

### Infra / Deploy

| Current | Proposed | ROI driver | Migration cost | Risk | Verdict |
|---|---|---|---|---|---|
| Fly.io | Cloudflare Workers + Pages | Edge-first | XL for backend | VERY HIGH for Go API | **REJECT for backend; consider for static FE only** |
| Fly.io | Railway / Render / DO | Better DX | M | LOW-MEDIUM | **REJECT** (Fly fits our use case) |
| Neon Postgres | Supabase Postgres | Realtime subs, auth bundled | XL | HIGH (auth migration risk) | **REJECT** |
| Neon | PlanetScale | Horizontal scale | XL+ | VERY HIGH | **STRONGLY REJECT** (wrong DB family) |
| Upstash Redis | Cloudflare Durable Objects | Edge-native | XL | HIGH | **REJECT** |

---

## Section D — Sequence proposal

### Pre-alpha (lock now, no movement)
- Stack as-is plus original audit's Sprint 1+2 hygiene (Tailwind beta, Fiber patch, uv bump, Biome v2, pyproject floors, CI Go drift)
- **No category-level swaps.** Pre-alpha team focus belongs on product, not infra rewrite

### Post-alpha (Months 1-3 after launch)
- **ADR-B-001:** Fiber v3 → chi migration (M, 3-4 days)
- **ADR-B-003 spike:** 2-day Moon vs Turbo bake-off
- Original audit's Sprint 3 watchlist items (pnpm 10, Vitest 3, Renovate Bot)

### Year-2 reconsider (1M+ users, growth-stage)
- **ADR-B-002:** Asynq → River (conditional)
- PgBouncer in front of Neon (when sustained connections >500)
- Granian replacing uvicorn (if AI traffic warrants)
- pgvector → dedicated vector store (Qdrant/Weaviate) only if RAG becomes core
- Re-evaluate Vite + TanStack Start if RSC pain has materialized

### Never (no signal supports)
- Bun on backend (Go is correct for fintech)
- Solid.js / Qwik (ecosystem cost too high)
- Cloudflare Workers backend (architectural mismatch)
- Vanilla Extract (Tailwind v4 already solves it)
- Supabase / PlanetScale (wrong-direction migrations)
- Modal / Replicate (R1 violation)

---

## Section E — What changed vs the original audit

The original audit's KEEP verdicts были correct but **incomplete in framing.** They answered «is this version current?» without asking «is the category right?» This re-audit adds three category-level moves the original missed:

1. **Fiber → chi** is now a *recommended* (post-alpha) move
2. **Asynq → River** elevated from «watchlist» to *conditional ADR*
3. **Turbo → Moon spike** is new

The original audit's conservatism on **frontend** (Next.js) and **runtime** (Go) is reaffirmed by this bolder pass.

---

## Section F — Open questions for PO

1. **Sequencing confirmation:** Lock pre-alpha as-is (do hygiene only, no category swaps until post-alpha)?
2. **ADR-B-001 (Fiber → chi):** Approve as post-alpha M-effort?
3. **ADR-B-003 (Moon spike):** Approve a 2-day post-alpha bake-off with go/no-go criterion (>25% CI cache improvement)?
4. **ADR-B-002 (River queue):** Approve as *conditional* — only triggered if Asynq maintenance stalls?
5. **R1 reconfirm:** All proposals R1-clean (no new paid SaaS).

---

**Audit complete.** Ready for tech-lead pickup post-alpha.
