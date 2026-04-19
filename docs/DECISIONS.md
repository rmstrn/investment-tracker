# Engineering decisions log

A running log of non-obvious engineering decisions: what was decided, why,
and when we plan to revisit. Newest entries at the bottom.

## 2026-04-19 — Dependency upgrade policy

Until post-MVP (after first production deploy), we PIN current majors for all
tooling. Dependabot is configured to auto-PR minor/patch only; majors are
bulk-upgraded once per quarter in a dedicated "upgrades" sprint.

Reason: pre-launch stability > latest features. Mid-build major bumps cost
more than they return.

Owner of quarterly upgrade pass: project lead.
First review: post-MVP launch + 2 weeks.

## 2026-04-19 — API listen address configurable via env

Default API port moved from `:8080` to `:8090` and made configurable via
`API_LISTEN_ADDR` in `.env.local`. Triggered by a port collision with a
system Java process during local dev.

Reason: hardcoding ports leaks onto contributor machines; `:8080` is too
popular. Env-driven config is cheap and future-proof.

Pattern: any bind-address or external-service URL goes through the
`envOr(key, default)` helper in `apps/api/config/config.go`. Document in
`.env.example` with a sensible default.

Owner: backend lead. Revisit: never (this is just how we do it).

## 2026-04-19 — Design tokens subpath exports require types + build-on-install

`@investment-tracker/design-tokens` exposes subpaths (`./brand`, `./color`,
etc.). Original `package.json` declared these as plain strings — JS-only.
TypeScript in a fresh CI checkout couldn't resolve the types and failed
`tsc` with TS2307 across downstream packages.

Decision:

1. Every subpath in `exports` uses the full object form:
   ```json
   "./brand": { "types": "./dist/brand.d.ts", "default": "./dist/brand.js" }
   ```
2. `typecheck` script depends on a built `dist/` — it runs `node build.js`
   first, so artifacts exist before `tsc` runs downstream.
3. `prepare` hook runs `pnpm build` on `pnpm install`, so contributors
   never hit "module not found" after a clean clone.

Pattern: applies to any package we publish internally that has subpath
exports. Codified in the design-tokens package; other packages follow the
same shape when they add subpaths.

Owner: web lead. Revisit: only if the build step becomes slow enough to
matter on fresh installs.

## 2026-04-19 — Admin merge bypass policy

`gh pr merge --admin` is allowed under one condition only: the CI failure
on the PR is documented pre-existing on `main` AND a green-main fix is
either already merging in parallel or explicitly queued.

Never for:
- genuine regressions introduced by the PR
- "convenience" to skip a slow check
- to unblock a PR whose own tests are failing

Every admin merge must be logged in `docs/merge-log.md` with:
- PR number + title
- the specific pre-existing failure cited
- link to the green-main fix PR (or a TODO with owner + date)

This came out of wave 1 where we used `--admin` for PRs #29, #30, #31
because of pre-existing biome + setup-uv failures unrelated to the PRs;
PR #32 brought main back to green and closed that window.

Owner: project lead. Revisit: if we use `--admin` more than once per
quarter, the CI hygiene process itself needs attention.

## 2026-04-19 — Core API: spec-first via oapi-codegen, not code-first via huma

Original TASK_04 stack listed `huma v2` (code-first: Go → auto-generated OpenAPI).
We already had `tools/openapi/openapi.yaml` (3571 lines) as a hand-authored
source-of-truth from TASK_03, and huma + Fiber v3 don't interop cleanly. Going
code-first would have meant rewriting the canonical spec as a byproduct of Go
code — inverting the current dependency graph and losing the wire-contract
stability TASK_03 established.

Decision: spec-first via `oapi-codegen`. `openapi.yaml` remains canonical.
Generation pipeline: `preprocess` (Go utility) → `oapi-codegen` → server
interfaces + types in `apps/api/internal/generated/`. Fiber v3 is the HTTP
runtime; huma is out.

Owner: backend lead. Revisit: only if oapi-codegen's 3.1 support becomes
complete and the preprocessor step becomes obsolete (tracked as TD-007).

## 2026-04-19 — Go 1.25 as minimum version

Fiber v3.1.0 requires `go 1.25` in `go.mod` — hard dependency, not a soft
recommendation. Downgrade to Fiber v2 would delete too much of our Fiber v3
handler code. Go 1.25 was generally available as of August 2025, so this is
not a bleeding-edge choice.

Decision: `go 1.25` in `go.mod`. No `toolchain` directive — local devs use
`GOTOOLCHAIN=auto` to autofetch; CI uses `golang:1.25` or `go-version: '1.25'`
in setup-go action.

Supersedes the earlier "Go 1.23+" line in TASK_04 stack.

Owner: backend lead. Revisit: next Go major (1.26) — by then Fiber v4 or
similar may shift the floor again.

## 2026-04-19 — sqlc + oapi-codegen as `go tool` dependencies

With Go 1.24+ introducing `go tool` for pinned dev dependencies, we stopped
using `go install` / PATH-based installs of `sqlc` and `oapi-codegen`. Versions
are now pinned in `go.mod` / `go.sum`, invoked via `go tool sqlc generate`
and `go tool oapi-codegen`.

Reason: avoids GOPATH weirdness on Windows (no env vars required, no "command
not found after fresh clone"), deterministic across machines, regular
dependency-upgrade workflow.

Pattern: any build-time Go tooling we adopt goes through `go tool` unless
there's a strict reason otherwise.

Owner: backend lead. Revisit: never (this is just how we do it for Go 1.24+).

## 2026-04-19 — TD-007 preprocessor as canonical OpenAPI 3.1 → 3.0 workaround

oapi-codegen v2 doesn't fully handle OpenAPI 3.1's `type: [X, "null"]` and
`oneOf: [..., {type: "null"}]` nullable patterns. Tracked as TD-007.

Decision: build-time preprocessor in `apps/api/codegen/preprocess/` rewrites
62+ nullable occurrences to 3.0-style `nullable: true`, plus injects
`x-go-name` on known name-collision sites. Canonical `openapi.yaml` is never
mutated — the preprocessed file is a build artefact that lives in-memory /
build cache.

`apps/api/codegen/patches/` directory remains for cases the preprocessor
can't handle generically (no patches needed as of PR A).

Owner: backend lead. Revisit: when oapi-codegen merges 3.1 nullable support
(deepmap/oapi-codegen#373). At that point: delete preprocessor, regenerate,
close TD-007.

## 2026-04-19 — Idempotency: Redis primary, Postgres table reserved

`Idempotency-Key` header is contractually required on all POST/PATCH/DELETE
per the OpenAPI spec. Middleware caches `{status, body, headers}` in Redis
with 24h TTL at key `idem:{user_id}:{sha256(key)}`.

The `idempotency_keys` Postgres table from TASK_03 migrations exists but is
currently unused — reserved for a future durable write-behind layer if Redis
eviction becomes a correctness issue.

MVP stance: Redis-only is acceptable. Known race condition (two concurrent
requests with same key can both execute handler before first writes cache)
tracked as TD-011; fingerprint dedup on DB catches the most dangerous case
(POST /transactions).

Owner: backend lead. Revisit: first production duplicate-request incident on
a mutating endpoint without domain-level dedup, or before public launch audit.

## 2026-04-19 — Portfolio calculator as pure function, plumbing separate

The `CalculatePortfolio` function in `internal/domain/portfolio/` is a pure
function: `(positions, prices, fxRates, displayCurrency) → Portfolio`. No
DB calls, no cache reads, no I/O.

Caching, DB access, and cache invalidation live in a separate layer in
handlers / repository code.

Reason: trivial unit testing on currency mixes, missing prices, NULL cost
basis — no testcontainers needed for calculator correctness. Integration
tests cover the plumbing layer separately.

Owner: backend lead. Revisit: never.

## 2026-04-19 — Claude model selection matrix

Locked mapping of Anthropic models to AI Service use cases:

| Use case | Model | Rationale |
|---|---|---|
| AI Chat (all tiers) | `claude-sonnet-4-6` | Price/quality balance, tool calling quality |
| Insight formatting | `claude-haiku-4-5-20251001` | Short-form, cheap, fast |
| Explainer (glossary) | `claude-haiku-4-5-20251001` | Deterministic short outputs |
| Behavioral pattern narration | `claude-sonnet-4-6` | Nuance matters, not just classification |
| Pro-tier complex analysis | `claude-opus-4-6` | Reserved; no default invocations in MVP |

Haiku for classification / simple formatting, Sonnet for nuanced narration,
Opus as Pro-tier upsell. Selection is config-driven in `apps/ai/src/ai_service/
config.py` so swaps don't require code changes.

Owner: AI service lead. Revisit: every major Claude family release, or when
Anthropic ships a cheaper/stronger alternative in one of the slots.

## 2026-04-19 — AI Service rate limit: in-memory MVP, Redis for multi-replica

Anthropic rate limit protection currently uses `asyncio.Semaphore` per-process
(`ANTHROPIC_MAX_CONCURRENT`, default 10). Works for single-replica Fly.io
deployment.

Decision: ship MVP with in-memory limiter; move to Redis-backed token bucket
when we scale past one replica. Tracked as TD-015 with explicit trigger
(second AI Service replica added).

Reason: Redis token bucket adds infrastructure weight that's not justified at
MVP scale. YAGNI for closed beta; swap is 1-2 hour fix when needed.

Owner: AI service lead. Revisit: first time we add a second replica.

## 2026-04-19 — Core API ↔ AI Service auth: dual-mode middleware

AI Service needs to call Core API on behalf of a user (tool execution for
portfolio data). Core API needs to distinguish Clerk-authenticated end-user
requests from internal AI Service requests.

Decision: Core API auth middleware runs in two modes:

1. **End-user mode** (default): validates Clerk JWT → loads user by
   `clerk_user_id` → sets `c.Locals("user", *User)`.
2. **Internal-caller mode**: if `Authorization: Bearer {CORE_API_INTERNAL_TOKEN}`
   matches the configured internal token, skip Clerk validation, read
   `X-User-Id` header as the effective user, load user by UUID.

Both modes result in the same `c.Locals("user")` — handlers don't need to
branch. Tier checks, rate limits, etc. continue to work.

AI Service uses the public `openapi.yaml` endpoints (not a separate
`/internal/*` surface) with internal-caller mode + `X-User-Id` header.

Reason: keeps the contract surface small (no parallel internal API). A
separate `/internal/*` family can be introduced later if strict isolation is
needed (e.g., different rate limits, different schemas) — not an MVP need.

Owner: backend lead. Revisit: if AI Service needs capabilities not available
through the public endpoints, or if security review requires hard isolation.

## 2026-04-19 — AI usage telemetry via dedicated internal endpoint

AI Service tracks token usage per conversation and needs to report it back
to Core API for billing attribution and cost dashboards.

Decision: Core API exposes `POST /internal/ai/usage` (internal-caller mode
only) accepting:

```json
{
  "user_id": "uuid",
  "conversation_id": "uuid",
  "input_tokens": 1234,
  "output_tokens": 567,
  "cost_usd": "0.0042",
  "model": "claude-sonnet-4-6"
}
```

AI Service posts one record per Claude API call. Core API appends to
`ai_usage` table and updates rolling counters in `usage_counters` for
rate-limit enforcement.

Until this endpoint ships (TASK_04 PR B scope), AI Service stubs the call
as structlog + PostHog event (TD-013). Body shape in the stub already
matches the final contract, so the swap is a one-line change.

Owner: backend lead (endpoint) + AI service lead (client swap). Revisit:
after first month of production traffic — if cost-per-user dashboard is
accurate, done.

## 2026-04-19 — `internal/domain/tiers/limits.go` as shared per-tier caps module

Per-tier caps (max accounts, max transactions, AI messages/day, insights/week,
export formats, history window, etc.) are consumed by two separate concerns:

1. **Read handlers** (PR B2b) — e.g., `/portfolio/performance?period=` must
   reject `period=all` for Free tier (capped at 1y), `/transactions?before=`
   must cap history window, `/ai/conversations` must cap retention.
2. **Mutation handlers** (PR B3) — `POST /accounts` must block on account
   cap, `POST /transactions` must block on monthly transaction cap, AI chat
   send must block on daily message cap.

Decision: one module, `apps/api/internal/domain/tiers/limits.go`, exposing
`Limits(tier)` → struct with all caps as typed fields. Both read and
mutation handlers import it. No duplication, no drift between "what the
read enforces" and "what the mutation enforces".

Shape:

```go
type TierLimits struct {
    MaxAccounts            int
    MaxTransactionsPerMonth int
    AIMessagesPerDay       int
    InsightsPerWeek        int
    HistoryWindowMonths    int  // 12 for Free, unlimited (-1) for Plus/Pro
    ExportFormats          []string
    // ...
}

func Limits(tier string) TierLimits { ... }
```

Caps themselves are sourced from `04_PRICING.md` §Tier matrix and kept in
sync manually — a single ADR update here + the pricing doc, no feature
flags or config table. Rationale: caps are business policy, not operator
toggles; changing them is a deliberate product decision worth a docs diff.

Reason: putting this in B2b (not B3) means read-side tier gates land first
with tests; B3 mutation gates just consume the same module — no refactor
when the second consumer lands.

Owner: backend lead. Revisit: when pricing/packaging changes, OR when caps
need to become operator-configurable (unlikely pre-launch — forcing that
through a deploy is the right friction).

## 2026-04-19 — PR B3 split into B3-i/B3-ii/B3-iii by coherent surface

TASK_04 PR B3 scope audit found 36 mutation endpoints + 5 deferred GETs +
3 infrastructure blocks (SSE proxy to AI Service, Clerk webhook + SDK,
Stripe webhook + SDK) + asynq publisher wire-up + idempotency race fix
(TD-011). One-PR estimate ~5500-6500 LOC, 40-50 commits — unreviewable.

Considered two split strategies:

1. **By handler domain** (first proposal) — accounts+tx / ai+notif+exports
   / webhooks+billing. Rejected: billing reads (`/subscription`,
   `/invoices`) conceptually belong with Stripe webhook + SDK, but billing
   POSTs (`/checkout`, `/portal`) also require the same Stripe SDK.
   Splitting one SaaS-integration surface across two PRs is unnatural —
   two PRs each stand up a Stripe client, double the config + testing
   surface.
2. **By coherent surface** (accepted) — each PR has one mental model and
   one shared SDK/infrastructure dependency.

Accepted split:

| PR | Scope | Handlers | LOC est | Closes TD |
|---|---|---|---|---|
| **B3-i** Data-path + asynq | accounts (7) + transactions (3) + /me data mutations (5: PATCH/DELETE/paywall-dismiss/undo-deletion/prefs-PATCH) + notifications reads (2 GETs) + exports (1 GET + 1 POST async stub) + asynq publisher + SETNX idempotency lock | 19 | ~2200 | TD-011, TD-021 |
| **B3-ii** AI bundle | ai mutations (7: conversations CRUD, chat POST, chat/stream SSE, insights generate/dismiss/viewed) + SSE reverse-proxy to AI Service + AI tier rate-limits | 7 | ~1400 | — |
| **B3-iii** Auth + billing | /me/2fa (4: enroll/verify/disable/backup-codes-regenerate) + /me/sessions DELETE (2: id + others) + billing mutations (3: checkout, portal, cancellation-feedback) + billing reads (2: subscription, invoices) + Clerk webhook + Clerk Backend SDK + Stripe webhook + Stripe SDK + `webhook_events` migration | 11 + 2 webhooks | ~2400 | TD-027 |

Why this split:

- **Shared SDK groupings.** B3-iii bundles 2FA + sessions + Clerk webhook
  under one Clerk SDK wire-up, and bundles billing mutations + billing
  reads + Stripe webhook under one Stripe SDK wire-up. Each SDK lands
  once with its full consumer set tested end-to-end.
- **asynq publisher is exercised day-one in B3-i** via account sync
  enqueue and export enqueue — not sitting mute waiting for a later PR
  to use it.
- **AI bundle (B3-ii) is thematically tight** — SSE proxy, chat
  rate-limits, and insights generation all depend on the AI Service
  contract; reviewer holds one mental model.
- **Sequential merge ordering matters:** B3-ii depends on B3-i's
  idempotency middleware + asynq publisher pattern, and B3-iii's
  `webhook_events` migration shares DB namespace with prior migrations.
  No parallel branches.

Alternative considered: land all three under one feature branch with
separate PRs but delayed merges (stack-style). Rejected — our CI +
merge-log hygiene is optimized for one PR at a time, and stacking
requires rebase discipline we haven't established.

Scope discipline: if any of B3-i/ii/iii exceeds +15% LOC overshoot on
forecast, the spillover becomes B3-i-follow-up rather than expanding the
current PR. Same pattern as B2c's 7% overshoot accepted, PR #38's 3700
LOC accepted, but both with explicit forecast-vs-actual call-out in GAP
REPORT.

Owner: backend lead. Revisit: never — this is a one-time split
rationale, not an ongoing policy. Future PR splits will follow the same
"coherent surface with shared infra" principle.
