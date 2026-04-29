# Tech Debt Log

Running ledger of known-but-accepted debt. Each item has an owner (who revisits), a trigger (when to revisit), and a scope (how big the fix is).

Newest entries at the top. When an item is resolved, move it to the "Resolved" section at the bottom with the resolution commit/PR.

## Priority legend

- **P1** — GA blocker. Должно быть закрыто до публичного launch (рискует прод-инцидент или блокирует базовый user flow).
- **P2** — Post-GA OK для запуска alpha, но критично до scale (несколько сотен пользователей или платный plan).
- **P3** — Polish / nice-to-have. Не блокирует, но накапливать нельзя — раз в квартал bulk-cleanup.

---

## Active

### TD-093 — pin AI-agent SSE chart-emission streaming protocol

**Added:** 2026-04-29 (SLICE-CHARTS-BACKEND-V1).
**Priority:** P2.
**Source:** Code-architect blueprint open-question 1 («does AI agent SSE stream emit `ChartEnvelope` as a single JSON atom after its tool-call completes, or stream JSON incrementally?»). Backend chart slice deferred this; current `parseChartEnvelope` assumes a complete payload at the trust boundary, so single-atom emission is implicitly required. Once `apps/ai/` starts emitting charts on the SSE bridge, the FE renderer (and `parseChartEnvelope`) needs a confirmed contract — partial payloads would force either re-validation per chunk (breaks the single-parser invariant) or buffering until `done` (fine but undocumented).
**Recommendation:** single-atom after tool-call completes (matches blueprint AI-agent integration boundary §). Document in `tools/openapi/openapi.yaml` SSE event schema and in the AI service `stream_chat` handler.
**Owner:** Backend (Python AI) + Tech-lead.
**Trigger to revisit:** start of `SLICE-AI-CHARTS-V1` — the slice that wires the AI service to emit `ChartEnvelope` over SSE.
**Links:** `docs/reviews/2026-04-27-chart-implementation-blueprint.md` §AI-agent integration; `apps/ai/src/ai/api/chat.py`.

### TD-092 — re-activate scatter `referenceLines.label` vocabulary regex on V2 re-introduction

**Added:** 2026-04-29 (SLICE-CHARTS-BACKEND-V1).
**Priority:** P3.
**Source:** Finance audit §2.9 finding S-2 (HIGH → V2-deferred-gate per audit §9 Δa). Scatter is excluded from the MVP `ChartPayload` discriminated union per architect Δ3, so any scatter payload fails parse before the `referenceLines.label` content is inspected. When V2 re-introduces scatter (PO greenlight + legal-advisor sign-off), the schema must add a `.refine()` rejecting prescriptive vocabulary in `referenceLines.label` per `AI_CONTENT_VALIDATION_TEMPLATES.md` §3 verb blacklist (e.g. «aggressive», «conservative», «efficient», «optimal», «target», «aspirational»).
**Owner:** Backend (Zod schemas) + finance-advisor (vocabulary list owner).
**Trigger to revisit:** V2 PO greenlight to re-add scatter to the union (schema bump ≥1.1) AND legal-advisor sign-off.
**Links:** `docs/reviews/2026-04-29-finance-charts-lane-a-audit.md` §2.9 + §9 Δa; `packages/shared-types/src/charts.ts` `ScatterChartPayload` (defined but not unioned).

### TD-091 — Pydantic mirror generation for `apps/ai/` chart payload validation

**Added:** 2026-04-29 (SLICE-CHARTS-BACKEND-V1).
**Priority:** P3.
**Source:** Architect ADR §«Δ4 dual-side validation». Canonical chart-payload schemas live in `packages/shared-types/src/charts.ts` (Zod). For dual-side defense-in-depth, `apps/ai/` must mirror the structural exclusions (Risk Flags 1/2/3) in Pydantic v2 so the AI agent fails fast on malformed emissions BEFORE the network roundtrip to FE. Cross-field math invariants (waterfall conservation Δ2, sum-to-total Δ1) live ONLY in Zod and are NOT duplicated in Pydantic per Δ4. The Pydantic models must be GENERATED from the OpenAPI schema (which is itself derived from Zod via `zod-to-openapi`), not hand-authored.
**Recommendation:** dispatch as `SLICE-AI-CHARTS-V1`. Add `zod-to-openapi` to the `packages/shared-types` build pipeline; emit `tools/openapi/charts.openapi.yaml` (or extend the main spec); regenerate Pydantic models in `apps/ai/src/ai/schemas/charts.py` via `datamodel-code-generator` or equivalent. Mirror structural exclusion tests in `apps/ai/tests/test_charts_schema.py` (identical fixtures, two language runtimes).
**Owner:** Backend (Python AI).
**Trigger to revisit:** start of `SLICE-AI-CHARTS-V1` — the slice that wires the AI service to emit `ChartEnvelope` payloads.
**Links:** `docs/reviews/2026-04-29-architect-chart-data-shape-adr.md` §«Brainstorm-pass addendum / Δ4»; `packages/shared-types/src/charts.ts`.

### TD-090 — typed action_url for insights (oneOf discriminated union)

**Added:** 2026-04-22 (Slice 6a post-merge, PR #64).
**Priority:** P3.
**Source:** `InsightData.additionalProperties: true` в OpenAPI spec — shape не типизирован. В Slice 6a `action_url` читается через runtime cast `(insight.data as { action_url?: string })?.action_url` с guard `startsWith('/')`. Это работает для MVP, но теряет compile-time safety и не документирует намерение бэка.
**Desired state:** `InsightData` в spec раскрывается как oneOf discriminated union по `insight_type` (или хотя бы выделяется `action_url?: string` как top-level optional property). Generated client тогда даёт точный тип, и apps/web cast убирается.
**Owner:** CC (web) + Backend — требует backend spec change + `pnpm api:generate`.
**Trigger:** start of Slice 6b OR after TASK_05 insight catalogue finalization — whichever comes first.
**Links:** Slice 6a kickoff §Open questions #3; DECISIONS.md ADR below.

### TD-084 — flyctl ловит build context из CWD, не из location of `--config` toml

**Added:** 2026-04-21 (TD-070 first deploy — gotcha поймана PO).
**Priority:** P2.
**Source:** `flyctl deploy --config apps/ai/fly.staging.toml --app investment-tracker-ai-staging` запущенный из `D:\investment-tracker` использует `D:\investment-tracker\` как Docker build context (а не `apps/ai/`). Dockerfile pathing должен быть relative к repo root, **не** к `apps/ai/`. Default scaffold Dockerfile содержал `COPY pyproject.toml uv.lock ./` который ожидал CWD = `apps/ai/` — fail в реальном flyctl deploy.
**Two valid resolutions:**
1. Дополнить Dockerfile `WORKDIR /src` + `COPY apps/ai/pyproject.toml apps/ai/uv.lock ./` (paths relative to repo root). **← применено для TD-070.**
2. Run flyctl из `apps/ai/` директории (`cd apps/ai && flyctl deploy --config fly.staging.toml`). Простое для local но breaks CI (CI workflow не делает `cd`).
**Decision:** repo-root-relative paths — единственный workable вариант для CI. Дополнительно должен быть закреплён в Dockerfile pattern для всех multi-stage Python apps (см. TD-086).
**Owner:** AI Service maintainer + infra.
**Trigger to revisit:** при добавлении нового Fly-deploy'd app с monorepo subpath — sanity-check что Dockerfile COPY paths repo-root-relative; or каждый раз при `flyctl deploy` из CI workflow.
**Links:** TD-086 (CI Docker build поймал бы); merge-log close-td-070 entry.

### TD-082 — reserved: automated drift check for `AI_SERVICE_TOKEN` ≡ `INTERNAL_API_TOKEN` parity

**Status:** reserved for the AI Service prod flip (owner = infra). Not opened as
a real TD yet — today the invariant is guarded manually by PO (runbook § 5 sets
both sides to the same value when provisioning staging; the same procedure will
run for prod). ID is pinned so the prod-flip slice has a known handle.
**Added:** 2026-04-21 (TD-070 config-as-code slice).
**What's missing.** A CI step (likely inside `deploy-ai.yml` or a new
`verify-bridge.yml`) that reads `AI_SERVICE_TOKEN` from the Core API Fly app and
`INTERNAL_API_TOKEN` from the AI Service Fly app, compares hashes (not plaintext
— values never leave Fly), and fails the deploy if they diverge. Staging failure
= 401 from every AI call into Core; prod failure = same, but on real users.
**Blocker to opening.** AI Service prod deploy is not yet scheduled (see
`RUNBOOK_ai_flip.md`). Once prod flip lands in a sprint, this TD opens real.
**Links:** DECISIONS.md § "AI Service staging deploy topology (TD-070)".

### TD-081 — reserved, unused

**Status:** reserved for TASK_07 Slice 5a (Transactions UI, PR #60), genuine debt не обнаружен во время slice'а — ID остаётся свободным для следующего slice'а, которому понадобится новый TD.
**Added:** 2026-04-21 (Slice 5a post-merge docs pass).
**Reason not filled:** pre-flight GAP REPORT обозначил potential edge case с Idempotency-Key lifecycle (network-lost response → new key → duplicate row), но решение с auto-inject + fingerprint dedup + `isPending` button-disable покрыло MVP acceptable — формализация не требовалась. Если edge case поймаем в alpha, откроется новый TD под следующим свободным ID (не TD-081 — этот уже не точка входа).
**Links:** DECISIONS.md § "Transactions UI: Idempotency-Key auto-inject + fingerprint safety-net (Slice 5a)" — rationale почему fixed-key lifecycle overkill для MVP.

### TD-080 — Paywall gate wiring: real feature trigger points in `(app)` routes

**Added:** 2026-04-21 (Slice 7a+7b merge — paywall demo trigger на `/dashboard` вырезан из scope, kickoff §3 Step 3).
**Priority:** P2
**Source:** UI готов — `PaywallModal`, `LockedPreview`, `PlanBadge`, `UsageIndicator` уже живут в `packages/ui` и демонстрируются в `/design/freemium` (Slice 3 merge). `/pricing` (Slice 7b) — рабочая destination для upgrade flow. Но **в `(app)` routes** (dashboard, chat, positions) нет ни одного реального trigger'а: AI daily-limit hit, CSV export click, insights generate throttle, accounts-over-limit на connect — ни один сейчас не открывает paywall. Пихать dev-only триггер без настоящего gate = noise, который потом всё равно выкидывается (обсуждалось в GAP REPORT PR #58).
**Decision deferred:** завести trigger'ы одновременно с Stripe checkout slice 7c — тогда gate принимает реальные usage counters из API и ведёт в работающий checkout, а не в `console.info` stub. Конкретные точки: `(app)/chat` (rate-limit → toast уже есть, добавить paywall путь для Free-хитов), `(app)/dashboard` (CSV export feature flag), `(app)/accounts` (Slice 4 — on "Add account" когда `count === limit`), AI insights generate endpoint (tier-check после TD-053).
**Owner:** CC (слайс 7c или 4a follow-up, в зависимости от того что раньше merge'нется).
**Revisit:** когда merged slice 7c.
**Depends:** TD-057 (Stripe catalog), TD-053 (per-week/per-day insight tier gate), real DB-backed usage counters (нет отдельного TD — будет заведён с 7c kickoff).
**Links:** DECISIONS.md § "Paywall demo triggers deferred to Slice 7c (PR #58)", merge-log PR #58 entry.

### TD-079 — accounts→transactions FK = CASCADE but handler uses soft-delete only

**Added:** 2026-04-21 (found during TASK_07 Slice 4a pre-flight).
**Priority:** P3
**Source:** `apps/api/db/migrations/20260418120001_initial_schema.sql:72` declares `transactions.account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE`. The `DeleteAccount` handler (`apps/api/internal/handlers/accounts_mutations.go:183`) uses the `SoftDeleteAccount` sqlc query — it sets `deleted_at`, never issues a hard `DELETE`. The OpenAPI spec for `DELETE /accounts/{id}` documents soft-delete semantics ("Historical transactions remain for accurate snapshot reconstruction."). Slice 4a's UI confirm dialog is written against this soft-delete contract.
**Risk:** currently none — no hard DELETE path exists. Future defense-in-depth: a retention-cleanup cron or manual `psql` session running `DELETE FROM accounts WHERE deleted_at < …` would silently cascade-wipe every linked transaction, breaking snapshot reconstruction.
**Defense-in-depth options:**
1. Migrate FK to `ON DELETE RESTRICT` — forces any future hard-delete path to fail loudly until a cascade decision is made explicitly.
2. Add a `BEFORE DELETE` trigger on `accounts` raising an exception unless a dedicated archive flag is set.
**Owner:** backend. **Blocks:** nothing today. **Revisit:** whenever a retention / archival story is scheduled, or when a future slice touches account lifecycle.
**Links:** DECISIONS.md § "Accounts soft-delete pattern + FK mismatch deferred (TD-079)".

### TD-069 — `doppler-sync.yml` not env-aware (stg/prd dimension missing)

**Added:** 2026-04-20 (staging ops bootstrap)
**Priority:** P2
**Source:** TASK_01/A scaffold shipped `doppler-sync.yml` as a placeholder. PR C did not rewrite it. Current shape:
- Input: `target` (all|web|api|ai) only — no `env` dimension.
- Pulls from secrets `DOPPLER_TOKEN_API` / `DOPPLER_TOKEN_AI` / `DOPPLER_TOKEN_WEB` (repo does not hold these; only `DOPPLER_TOKEN_STG` was set during bootstrap).
- Runs `flyctl secrets import --config apps/api/fly.toml` — targets **prod** toml regardless of intent.

Staging bootstrap bypassed the workflow via local pipe:
```
doppler secrets download --no-file --format=env --project investment-tracker-api --config stg \
  | flyctl secrets import -a investment-tracker-api-staging
```

**Risk:** medium — blocks automated secret rotations for staging. Any time secrets change, PO must re-run local pipe instead of triggering CI. Drift across environments becomes easier to miss.

**Fix:** matrix-ise the workflow.
1. New input `env` (stg|prd), alongside existing `target` (all|web|api|ai).
2. Repo secrets renamed per dimension:
   - `DOPPLER_TOKEN_STG_API`, `DOPPLER_TOKEN_STG_AI`, `DOPPLER_TOKEN_STG_WEB`
   - `DOPPLER_TOKEN_PRD_API`, `DOPPLER_TOKEN_PRD_AI`, `DOPPLER_TOKEN_PRD_WEB`
3. Sync step picks the right Doppler token + the right fly toml (`fly.staging.toml` vs `fly.toml`) based on the env input.

**Trigger to revisit:** first secret rotation event on staging OR first prod deploy cutover (prod sync must be automatable).

**Owner:** backend + infra
**Scope:** ~120 LOC workflow rewrite + 6 repo-secret provisions — 0.5 day
**Links:** paired with TD-067 (pipeline consistency across web/ai deploy workflows).

---

### TD-067 — deploy-web.yml / deploy-ai.yml pipeline consistency

**Added:** 2026-04-20 (PR C / Core API deploy infra)
**Priority:** P2
**Source:** PR C rewrote `deploy-api.yml` into a staging → smoke → approve → prod pipeline with k6 + Doppler hygiene. `deploy-web.yml` + `deploy-ai.yml` kept their simpler single-shot `workflow_dispatch` shape from TASK_01. Once all three services deploy frequently a PO clicking through three different dispatch UIs is a footgun.
**Risk:** low — each workflow is fine in isolation. Divergence cost is confusion + occasional miss (forgetting to run k6 after deploy-web, forgetting Doppler verify before deploy-ai).
**Fix:** mirror the `deploy-api.yml` pattern for both siblings. Web: Vercel has its own deploy primitive but the k6 gate + approval still apply (smoke scenarios are web-specific — `/design`, sign-in flow, Dashboard hydration). AI: Fly deploy + smoke, same pattern as api with AI-specific scenarios (`/v1/chat/complete` round-trip).
**Trigger to revisit:** first successful prod deploy of all three services — once the api pattern is validated end-to-end, generalize.
**Owner:** backend + web + AI (coord)
**Scope:** ~200 LOC deploy-ai.yml rewrite + ~250 LOC deploy-web.yml rewrite + per-service smoke — 2-3 days total

---

### TD-066 — Restore `workers` deploy target

**Added:** 2026-04-20 (PR C / Core API deploy infra)
**Priority:** P1 (PR D blocker)
**Source:** PR C removed `target: workers|both` from the `deploy-api.yml` `workflow_dispatch` inputs defensively — `cmd/workers/main.go` is still a placeholder heartbeat (30s log tick, no asynq consumer). Shipping the placeholder to prod by a click-mistake would masquerade as healthy worker coverage while real enqueued tasks silently drop.
**Risk:** blocks PR D. The whole point of PR D is a real asynq consumer; the CD pipeline must carry it forward the same day.
**Fix:** re-add `deploy-workers` + `smoke-workers` jobs to `deploy-api.yml` mirroring the api pipeline (staging → smoke → approval → prod → tag). Smoke should hit whatever asynq-inspector endpoint workers exposes (TBD in PR D). Keep workers behind the same GitHub `production` environment gate.
**Trigger to revisit:** `cmd/workers` acquires a real consumer (PR D scope).
**Owner:** backend lead
**Scope:** ~80 LOC workflow + smoke scenario — 1 day

---

### TD-065 — `TransactionRow.kind`: support split events

**Added:** 2026-04-20 (PR #48 / TASK_07 Slice 2)
**Priority:** P3
**Source:** `packages/ui` `TransactionRow.kind` enum = `buy | sell | dividend | deposit | withdrawal | fee`. OpenAPI `TransactionType` enum включает `split` — для которого нет mapping в `kind` (нет cash flow, нет amount column semantics, иконка buy/sell не подходит). PR #48 filter'ит `split` события из `/positions/[id]` Transactions tab + surface'ит footnote `"Stock splits hidden (N)"` если хотя бы один split присутствует в fetched pages.
**Risk:** low — splits не искажают денежные суммы на detail page (фильтр client-side, API contract не меняется, ledger в БД не трогаем). Visual-only gap: пользователь не видит что 2:1 split произошёл, информация про изменение quantity теряется в UI (хотя сам факт изменения quantity уже отражён в `position.quantity`).
**Fix:** расширить `TransactionRow.kind` value `'split'`. Display: ratio (`2:1`) + execution date, no amount column (или em-dash). Domain helper `splitRatio(t: Transaction): string` — парсит `t.source_details` либо compute из `quantity_before`/`quantity_after` (требует backend контракт — возможно уже в `source_details` JSONB при импорте). UI: muted tone, distinct icon (`lucide` `Split`). Test coverage: один smoke для splits-variant `TransactionRow`.
**Trigger to revisit:** первый user feedback про отсутствие splits в Transactions list; OR первый seed dataset со split events для UI testing; OR broker integration (TASK_06) начинает поставлять split events массово.
**Owner:** frontend + design
**Scope:** ~80 LOC (TransactionRow kind extension + splitRatio helper + test + footnote cleanup в apps/web `PositionTransactionsTab`) — 0.5 day

---

### TD-064 — Blue-green deploys instead of rolling

**Added:** 2026-04-20 (PR C / Core API deploy infra)
**Priority:** P3
**Source:** `fly.toml` uses `strategy = "rolling"` — machines swap one at a time. Stateless HTTP is fine; SSE streams (e.g. `/ai/chat/stream`) dropped mid-deploy leave the user with a broken frame until `EventSource` reconnects. UX jitter, not data loss.
**Risk:** low. EventSource auto-reconnects; the tee-parser persists whatever content arrived before the drop. Real risk is user-visible stutter during a deploy.
**Fix:** Fly's `bluegreen` strategy (v2 app platform) swaps the whole fleet at once with instant rollback. Requires DNS or LB hand-off choreography and longer deploy duration, but removes the mid-stream swap.
**Trigger to revisit:** first SSE drop incident escalated by a user, OR `smoke-prod` `ai_chat_stream` scenario starts flaking during deploys.
**Owner:** backend + infra
**Scope:** ~100 LOC fly.toml delta + RUNBOOK update + rehearsal — weekend of work

---

### TD-063 — Per-tenant rate limits

**Added:** 2026-04-20 (PR C / Core API deploy infra)
**Priority:** P2
**Source:** Core API rate-limit middleware today is per-IP (DoS protection) + per-user on AI endpoints. Shared resources (prices cache, asynq queues, DB pool) have no per-tenant cap — one abusive tenant can crowd out others.
**Risk:** medium pre-enterprise. Enterprise contracts usually demand per-tenant SLA; first such conversation will flag this.
**Fix:** Redis-backed token bucket keyed on `(user_id, endpoint_class)`. Tier-aware caps (Free stricter, Pro looser), integrated with the existing `airatelimit` pattern so there is one rate-limit ladder to reason about.
**Trigger to revisit:** first enterprise customer conversation, OR a PagerDuty event where one tenant saturated the cache or AI queue.
**Owner:** backend lead
**Scope:** ~200 LOC + tests + tier-caps update — 1-2 days

---

### TD-062 — APM / cross-service trace correlation

**Added:** 2026-04-20 (PR C / Core API deploy infra)
**Priority:** P2
**Source:** PR C ships Sentry + structured logs + Prometheus default metrics. Cross-service traces are manual via `X-Request-Id` correlation through logs. Sufficient at MVP scale; lossy once Core ↔ AI ↔ Workers triple-hops become common.
**Risk:** debugging time on cross-service incidents grows superlinearly without proper traces. Deferred cost, not immediate pain.
**Fix:** OpenTelemetry SDK (`go.opentelemetry.io/otel`) across Core API + AI Service, later Workers. Span kind server/client, baggage carries `user_id` + `request_id`. Export to Grafana Tempo (self-host) or Datadog (managed).
**Trigger to revisit:** alongside the AI Service 404-swallow flip (see `RUNBOOK_ai_flip.md`) — trace correlation makes that flip's debug surface finite.
**Owner:** backend + AI (coord)
**Scope:** ~500 LOC per service + Tempo/DD setup + dashboards — 1-2 weeks

---

### TD-061 — Multi-region deploy

**Added:** 2026-04-20 (PR C / Core API deploy infra)
**Priority:** P3
**Source:** `fly.toml` pins `primary_region = "fra"`. Single-region is an SPOF — a fra outage drops all EU users. Neon/Upstash are similarly single-region at the MVP tier.
**Risk:** low at MVP scale (most EU users near fra; fly SLA is acceptable). Escalates with traffic and, more importantly, with user count that makes an outage a real PR event.
**Fix:** add a secondary region (ams or lhr), configure `regions` in fly.toml, verify Neon read-replica + Upstash global configuration cover the second region at acceptable latency.
**Trigger to revisit:** ~1k paying users, OR a first fra outage user-visible enough to require post-mortem.
**Owner:** backend + infra
**Scope:** multi-day — ~400 LOC config + DB/Redis regional setup + failover drills

---

### TD-060 — KMS-managed KEK (replace env-based)

**Added:** 2026-04-20 (PR C / Core API deploy infra)
**Priority:** P2
**Source:** `ENCRYPTION_KEK` currently lives as a base64 env var in Fly secrets. Fine for MVP; audit-hostile. A compromised Fly access token reveals the master key, and key rotation is a full re-encrypt.
**Risk:** medium. SOC2 / enterprise conversations will flag raw-env KEK. GDPR stance at MVP is defensible, but only just.
**Fix:** AWS KMS (or GCP KMS) as KEK custodian. Core API holds a KEK-ID + IAM role; decryption via `kms.Decrypt` at boot, KEK never touches disk. Unlocks versioned KEKs + clean rotation (TD original intent in `02_ARCHITECTURE.md` § 5).
**Trigger to revisit:** first enterprise / GDPR-sensitive customer conversation, OR SOC2 Type 2 scoping.
**Owner:** backend lead + security
**Scope:** ~300 LOC (KMS client wrapper, boot fetch + caching, rotation runbook update) — 3-4 days

---

### TD-059 — `/portfolio/tax/export` downloadable bundle

**Added:** 2026-04-20 (PR #46 / B3-iii)
**Priority:** P3
**Source:** openapi defines `GET /portfolio/tax/export` returning a downloadable tax package (CSV/PDF). B3-iii shipped a 501 stub; real implementation overlaps TD-039 (export-job worker) + jurisdiction-specific rendering templates.
**Risk:** low — не влияет на Pro-tier tax report JSON (`GetPortfolioTax` работает). Downloadable export — convenience feature, не блокер GA.
**Fix:** after export-job worker lands (TASK_06 / TD-039), add renderer per jurisdiction (DE/US/UK/FR/ES/NL) + enqueue pattern matching existing `/exports` flow. Wire stub → real handler.
**Trigger to revisit:** TASK_06 worker slice landed, product опционально prioritizes tax downloads.
**Owner:** backend + design (jurisdiction templates)
**Scope:** ~200 LOC handler + per-jurisdiction renderer packages — 1-2 days per jurisdiction

---

### TD-058 — GDPR `/me/export` data bundle

**Added:** 2026-04-20 (PR #46 / B3-iii)
**Priority:** P2 (GDPR compliance — требуется для EU retail launch)
**Source:** openapi `GET /me/export` → `UserExportBundle`. B3-iii shipped 501 stub — aggregation handler не реализован. Empty/partial bundle misrepresents user data, поэтому честнее 501 чем empty-200.
**Risk:** medium — GDPR Article 15 (right of access) expects a responsive export within a month. MVP launch без endpoint'а = юридически наш `/me/export` должен работать хотя бы на запрос через support. Current gap = soft risk.
**Fix:** handler aggregates all per-user tables (users, accounts, transactions, positions, portfolio_snapshots, ai_conversations, ai_messages, insights, usage_counters, ai_usage, notifications, notification_preferences, audit_log), optionally decrypts `accounts.credentials_encrypted` (or omits), returns signed JSON. Consider async via export-job flow если размер большой.
**Trigger to revisit:** перед public EU launch (GA blocker for compliance), OR первый support-ticket с запросом GDPR export.
**Owner:** backend + legal review
**Scope:** ~200 LOC aggregation + test fixtures

---

### TD-057 — Billing CRUD endpoints after prod Stripe catalog

**Added:** 2026-04-20 (PR #46 / B3-iii)
**Priority:** P2 (зависит от Stripe prod setup, не блокер CI)
**Source:** 5 `/billing/*` endpoints (GET subscription, POST checkout, POST portal, GET invoices, POST cancellation-feedback) зашли scope-cut 501 stubs. `/billing/webhook` уже live (PR #46) — это client-facing half Stripe integration, требует:
  1. Prod Stripe product+price catalog (price_id'ы для STRIPE_PRICE_PLUS/PRO уже переменные env'а).
  2. Stripe Customer Portal config в dashboard.
  3. `cancellation_feedback` таблица (мини-миграция).
  4. Real Stripe `client.CheckoutSessions.New` с метаданным `user_id` (для webhook resolve fallback — pattern уже закреплён в B3-iii).
**Risk:** low — пока продовый Stripe не настроен, эти endpoints не нужны. Webhook без them'а graceful degradation через warn+200 до первой checkout-через-UI.
**Fix:** отдельный slice после PR C. Handler'ы используют client-instance stripe.Client (per-request `client.New(cfg.StripeSecretKey, nil)`) чтобы оставаться consistent с webhook-side no-global-stripe.Key.
**Trigger to revisit:** prod Stripe setup complete (product catalog + portal config + price_id'ы published).
**Owner:** backend lead + billing ops
**Scope:** ~400-500 LOC (5 handlers + cancellation_feedback миграция + tests) — 1-2 days

---

### TD-056 — Clerk Backend SDK wiring (2FA + session mutations)

**Added:** 2026-04-20 (PR #46 / B3-iii)
**Priority:** P2
**Pair:** TD-027 (original Clerk SDK gap — оригинально только про `GET /me/sessions`). TD-056 — расширение на полный surface: 2FA × 5 + `DELETE /me/sessions/{id,others}` × 2.
**Source:** 7 endpoints'ов proxied в Clerk Management API (openapi comment § 234: "All 2FA + session endpoints proxy to Clerk Management API"). B3-iii shipped:
  - `GET /me/2fa` — empty-state-200 + `X-Clerk-Unavailable` (matches ListMySessions pattern, `{enabled: false, backup_codes: {remaining: 0}}`).
  - POST `/me/2fa/{enroll,verify,disable,backup-codes/regenerate}` — 501 NOT_IMPLEMENTED + `X-Clerk-Unavailable`.
  - DELETE `/me/sessions/{id}`, `/me/sessions/others` — 501 NOT_IMPLEMENTED + `X-Clerk-Unavailable`.
**Risk:** low — web/iOS могут реализовать 2FA напрямую через Clerk SDK (not proxied через наш API). Наши endpoints — convenience для UI stability + fleet visibility. Прямой Clerk SDK — workaround до TD-056.
**Fix:** add Clerk Backend SDK (`github.com/clerk/clerk-sdk-go/v2`) в `app.Deps`. Handler'ы вызывают `clerkClient.Users.VerifyTOTP(...)`, `clerkClient.Sessions.Revoke(...)` и т.п. Empty-state на `GET /me/2fa` → real `Users.Get(clerkUserID)` + parsing 2FA enrolment fields.
**Trigger to revisit:** web UI готов интегрировать 2FA flow; OR первый enterprise-customer запрос на session management.
**Owner:** backend lead
**Scope:** ~200 LOC (SDK wiring + 7 handlers + tests с Clerk SDK stub) — 1 day

---

### TD-055 — AI stream OpenAPI spec drift (re-serialize in Core API)

**Added:** 2026-04-20 (PR #44 / B3-ii-b)
**Priority:** P2
**Source:** AI Service SSE frames (`ai_service/models.py`) diverged from the openapi `AIChatStreamEvent` shape — `message_start` без `conversation_id`, `content_delta {text}` vs openapi `{index, delta:{text}}`, `message_stop` несёт `usage: TokenUsage` вместо `{message_id, tokens_used}`, `error` несёт `{message, code}` вместо обёрнутого `ErrorEnvelope`. Core API `sseproxy/translator.go` сейчас re-serialize'ит каждый frame в openapi-compliant форму перед отдачей клиенту.
**Risk:** любая schema эволюция на AI Service side должна синхронно отражаться в Core API serializer, иначе silent drift либо на клиенте (web/iOS codegen от openapi) либо на Core tee-parser (который собирает content blocks для persist). Единая точка изменения сейчас — переписать translator + опционально openapi fix.
**Mitigation:** contract test между AI Service canonical fixture frames и Core API re-serialize output. Фаза 1 — shared fixture set + парный тест. Фаза 2 — align openapi spec к AI Service shape OR align AI Service к openapi (cross-service решение).
**Trigger to revisit:** первый новый frame type / field в AI Service SSE schema; OR перед public GA когда mobile/web клиенты завязываются на openapi codegen жёстко.
**Owner:** backend (Core API) + AI lead (TASK_05) для coord.
**Scope:** фаза 1 ~60 LOC (fixture file + test); полный spec-align — отдельная story.

---

### TD-053 — `/ai/insights/generate` per-week / per-day tier gate

**Added:** 2026-04-20 (PR B3-ii-a)
**Source:** openapi `/ai/insights/generate` doc string says Free=1/week, Plus=1/day, Pro=unlimited. Текущий handler гейтится через `airatelimit` middleware, который считает против `ai_messages_daily` (Free=5/day, Plus=50/day, Pro=∞) — тот же бюджет что /ai/chat. Бюджет защищён, но семантика «1 в неделю на Free» не enforced — Free может позвать /generate 5 раз в день.
**Risk:** низкий — UI button click frequency низкая, нет abuse signals; openapi-described gate это UX cap, не cost cap.
**Fix:** новый dedicated counter `insights_generated_<period>` в Redis (или usage_counters table). Per-tier window: Free=1/week, Plus=1/day, Pro=skip. Отдельный middleware либо параметризованный airatelimit с кастомным TTL+cap.
**Trigger to revisit:** product решает «Free спамят /generate, нужна жёсткая 1/week крышка», или UI feedback показывает что текущая шаринг-с-чатом семантика confusит.
**Owner:** backend
**Scope:** ~80 LOC + tests — 2 часа

---

### TD-051 — SSE parser в Core API дублирует AI Service знание о frame format

**Added:** 2026-04-20 (PR B3-ii-a planning, lands in B3-ii-b)
**Source:** B3-ii-b SSE proxy handler парсит frames AI Service'а (event: <type>\ndata: <json>\n\n) для tee → DB persist. AI Service одновременно владеет тем же contract'ом в `ai_service/llm/streaming.py`. Оба должны быть синхронны.
**Risk:** drift при schema bump на одной из сторон. Например, если AI Service добавит новое поле в JSON payload — Core API `tee` parser его игнорит (OK), но если frame format поменяется (CRLF вместо LF, multi-line data:) — silent break.
**Fix:** общий контракт-test: AI Service publishes a fixture set of canonical frames; Core API parser test consumes the same fixture. Или: вытащить `sseproxy` в отдельный Go pkg + Python equivalent с shared spec.
**Trigger to revisit:** при первом silent-bug на streaming side (production incident OR CI canary).
**Owner:** backend + AI lead
**Scope:** ~40 LOC contract-test (фаза 1); полный shared-spec rewrite — отдельный story.

---

### TD-050 — `/ai/insights/generate` Path B handler hangs 5-30s (Fly.io idle 60s)

**Added:** 2026-04-20 (PR B3-ii-a)
**Source:** Path B = sync inline AI Service call. Handler блокирует HTTP request на 5-30s ждущий LLM. Под Fly.io idle timeout (60s) safe, но LB / browser disconnect могут убить connection до завершения.
**Risk:** LB или client side timeout → 502/504, insights не сохранятся, юзер видит ошибку, при retry — ещё один LLM call ($).
**Fix:** Async path — handler enqueue'ит asynq task, returns 202 + status=queued + job_id; worker (TASK_06) пулл'ит → AI Service → INSERT insights → job done. Нужна `insight_generation_jobs` table + `WorkerHardDeleteJob` analog для статусов.
**Trigger to revisit:** asynq worker landed (TASK_06), OR первый production incident про timeout на /generate.
**Owner:** backend (handler) + ops (TASK_06 worker)
**Scope:** ~150 LOC + migration `insight_generation_jobs` + worker handler — 4-6 часов

---

### TD-049 — SSE Last-Event-ID resume protocol

**Added:** 2026-04-20 (PR B3-ii-a planning, lands in B3-ii-b)
**Source:** MVP SSE proxy не поддерживает client-side reconnect+resume. Если client потерял connection mid-stream (network blip, mobile cellular handoff) — он начинает новый chat message. Token cost double, history может задвоиться.
**Risk:** mobile users с unstable connectivity платят 2x за один answer. UI может показать assistant message дважды (если client успел persist первый chunk).
**Fix:** Last-Event-ID header support per SSE spec. Server emits per-frame `id: <uuid>`. На reconnect client sends `Last-Event-ID: <uuid>` → server resumes from that point (нужен per-conversation event log в Redis). Полное решение: persistent SSE journal.
**Trigger to revisit:** mobile launch (TASK_08), или metrics показывают >5% chat sessions с reconnect events.
**Owner:** backend
**Scope:** ~200 LOC + Redis schema + integration tests — 1 день

---

### TD-046 — Aggregator provider clients (SnapTrade / Plaid / broker APIs)

**Added:** 2026-04-19 (PR #40 / B3-i)
**Source:** `POST /accounts` сейчас принимает только `connection_type = manual`. Aggregator flows (SnapTrade OAuth, Plaid, per-broker APIs) возвращают 501 NOT_IMPLEMENTED через scope-cut pattern.
**Current state:** Manual entry работает; aggregator — TASK_06 scope.
**Trigger to revisit:** TASK_06 старт после закрытия TASK_04 (PR C merged).
**Owner:** integrations lead (TASK_06)
**Scope:** full TASK_06 — 4-6 недель

---

### TD-045 — Hard-delete worker must re-check `deletion_scheduled_at`

**Added:** 2026-04-19 (PR #40 / B3-i)
**Pair:** **requires** TD-041 (hard_delete_user worker implementation). Физически неразделимы — воркер без этой проверки ломает undo-flow.
**Source:** DELETE /me не удаляет юзера сразу — помечает `deletion_scheduled_at` + enqueue'ит `hard_delete_user` task с delay=7d. Если юзер передумал и вызвал undo — колонка сбрасывается в NULL, но отложенная задача в asynq остаётся.
**Fix:** worker consumer в TASK_06 должен первым делом re-fetch'ить юзера и делать no-op, если `deletion_scheduled_at IS NULL`. Логировать как `hard_delete_cancelled_undo`.
**Status note (2026-04-20):** publisher path verified done в B3-i (`61d6c08`). Clerk `user.deleted` webhook (PR #46 B3-iii) uses the same contract — enqueue через `asynqpub.TaskHardDeleteUser` + `HardDeleteGracePeriod` delay + `X-Async-Unavailable` when publisher off. Comment-anchor в `apps/api/internal/clients/asynqpub/publisher.go:159` фиксирует requirement для consumer. Actively Active до merge TASK_06.
**Trigger to revisit:** вместе с TD-041 в TASK_06.
**Owner:** workers lead (TASK_06)
**Scope:** ~10 LOC + test сценарий undo

---

### TD-041 — `hard_delete_user` worker consumer

**Added:** 2026-04-19 (PR #40 / B3-i)
**Pair:** **implements** TD-041 but **requires** TD-045 (no-op on undo). Не катить без TD-045.
**Source:** DELETE /me publisher уже в Core API (PR #40). Consumer-side — в TASK_06.
**Current state:** задача enqueue'ится с delay=7d, но воркера ещё нет — задачи копятся в asynq `default` queue.
**Status note (2026-04-20):** publisher-path complete и усилен в B3-iii. Два call-site'а делают enqueue: (1) `DeleteMe` в `me_mutations.go` (user-initiated); (2) `handleClerkUserDeleted` в `webhook_clerk.go` (Clerk webhook driven). Оба следуют одному contract'у. Consumer остаётся scope TASK_06.
**Fix:** worker в TASK_06 с scope:
  1. fetch user by ID
  2. **re-check `deletion_scheduled_at IS NOT NULL`** (см. TD-045)
  3. cascade-delete через Postgres FK constraints (accounts, transactions, positions, snapshots, ai_conversations, insights, usage_counters, audit_log, ai_usage)
  4. audit-log запись `user_hard_deleted`
**Trigger to revisit:** TASK_06 старт.
**Owner:** workers lead (TASK_06)
**Scope:** ~100 LOC worker + integration test с 7d-fast-forward

---

### TD-039 — CSV export worker consumer

**Added:** 2026-04-19 (PR #40 / B3-i)
**Source:** POST /exports в Core API создаёт запись в `export_jobs` (status=pending) + enqueue'ит `generate_csv_export` задачу. GET /exports/{id} возвращает status. Consumer-side worker — в TASK_06.
**Current state:** юзер видит status=pending навсегда, т.к. воркера нет.
**Fix:** worker в TASK_06:
  1. materialize CSV из transactions + positions по фильтрам
  2. upload в R2 object storage с presigned URL (TTL 24h)
  3. patch `export_jobs.status='ready'`, `result_url=...`, `expires_at=...`
  4. email-уведомление (опционально)
**Trigger to revisit:** TASK_06 старт.
**Owner:** workers lead (TASK_06)
**Scope:** ~150 LOC + test с test-R2 bucket

### TD-002 — `make` required for `apps/api` build, unavailable on Windows

**Added:** 2026-04-19 (wave 1)
**Source:** `pnpm build` fails on Windows at `@investment-tracker/api:build` with "make is not recognized"
**Current workaround:** dev and CI use make; Windows devs skip local api build or install make via choco/winget
**Cost:** onboarding friction for Windows contributors
**Trigger to revisit:** if we onboard ≥2 Windows devs, or when we standardize on one build runner
**Owner:** backend lead
**Scope:** replace Makefile with Taskfile (taskfile.dev) or equivalent cross-platform runner — ~half day

---

### TD-003 — `border.default` at 1.48:1 contrast (below strict WCAG 3:1 for UI components)

**Added:** 2026-04-19 (PR #31)
**Source:** strict WCAG AA for non-text UI components requires 3:1; our default border is deliberately lighter for a calm, non-fintech-harsh look
**Current state:** `border.default = slate-300 #cbd5e1` on white = 1.48:1 (fails strict)
**Compensation:** `border.strong` (slate-400, 2.27:1) used wherever the border carries interactive meaning (buttons, focused inputs); `border.default` reserved for decorative containment
**Trigger to revisit:** if accessibility audit or user testing flags missed affordances
**Owner:** design lead
**Scope:** swap `border.default` to `border.strong` in listed primitives — 1-hour sweep; will darken visual tone

---

### TD-004 — Pre-existing `biome-ignore` comments in `packages/ui`

**Added:** 2026-04-19 (PR #32)
**Source:** biome lint errors that weren't safely autofixable; accepted with justifications rather than silencing the rules globally

Inventory (9 ignores, each with reason):

| File | Rule | Reason |
|---|---|---|
| `CountUpNumber.tsx:37` | `useExhaustiveDependencies` | deps intentionally omitted to avoid re-subscription on every render |
| `ChatInputPill.tsx:54` | `useExhaustiveDependencies` | same pattern |
| `ExplainerTooltip.tsx:37` | `useExhaustiveDependencies` | same |
| `ExplainerTooltip.tsx:41` | `useExhaustiveDependencies` | same |
| `BarChart.tsx:88` | `noArrayIndexKey` | static demo data, order never changes |
| `PaywallModal.tsx:44` | `noArrayIndexKey` | same |
| `chat demo:?` | `noArrayIndexKey` | same |
| `SegmentedControl.tsx:56` | `noNonNullAssertion` | options invariant: length ≥ 1 enforced by JSDoc/props contract |
| `SegmentedControl.tsx:72` | `noNonNullAssertion` | same |

**Trigger to revisit:** quarterly lint audit OR when any file is refactored substantially (Sprint D audit 2026-04-22: 8/8 ignores still valid, each justification holds — re-audit 2026-07-22)
**Owner:** web lead
**Scope:** verify each ignore is still correct; migrate to proper types or `useCallback`/memoization where it improves code — 2-4 hours quarterly

---

### TD-005 — `BellDropdown` keyboard navigation is minimal

**Added:** 2026-04-19 (PR #32)
**Source:** a11y fix wrapped menu items in `<div role="menuitem" tabIndex={0}>` with Enter/Space handlers; full arrow-key navigation between items not implemented
**Current state:** Tab moves through items linearly, Enter/Space activate. Works but not idiomatic menu navigation.
**Trigger to revisit:** first a11y audit, or user feedback, or any other menu component requiring the same treatment (we'd do it properly once)
**Owner:** web lead
**Scope:** roving tabindex + arrow handlers + home/end + close-on-escape — ~2 hours; upgrade to shared `<Menu>` primitive for reuse

---

### TD-006 — Admin bypass used to merge wave 1 PRs with red CI

**Added:** 2026-04-19 (wave 1 retrospective)
**Source:** PRs #29, #30, #31 merged with `--admin` because CI on main was red from pre-existing biome + Python setup-uv failures unrelated to the PR content
**Resolution applied:** PR #32 (`chore/fix-ci-red-main`) brought main to green; admin bypass no longer needed
**Policy going forward:** `--admin` merge is only acceptable when the red is documented pre-existing on main AND a green-main fix is queued or in progress. Never for genuine CI regressions. Each bypass should be logged in `docs/merge-log.md` with the justification.
**Trigger to revisit:** if we use `--admin` more than once in a quarter — signals a CI hygiene problem
**Owner:** project lead
**Scope:** ongoing discipline

---

### TD-007 — `oapi-codegen` upstream bug on OpenAPI 3.1 `nullable` (issue #373)

**Added:** 2026-04-19 (TASK_03)
**Source:** OpenAPI 3.1 uses `type: [string, "null"]` for nullable fields; oapi-codegen v2 doesn't yet generate correct Go types for this pattern
**Current workaround:** TASK_03 output uses optional fields where possible; where nullable is required semantically, hand-patching is tracked in `apps/api/codegen/patches/`
**Trigger to revisit:** when oapi-codegen releases a fix for [deepmap/oapi-codegen#373]; or when we hit a case where hand-patching is too fragile
**Owner:** backend lead
**Scope:** remove patches + regenerate — ~1 hour after upstream fix

---

### TD-008 — `apps/ai/uv.lock` generation is manual for new Python deps

**Added:** 2026-04-19 (PR #32)
**Source:** first commit of `uv.lock` was manual; new deps require contributors to remember to regenerate
**Current state:** no pre-commit hook for `uv lock`
**Trigger to revisit:** first time lock drift causes a CI failure
**Owner:** AI service lead
**Scope:** add `uv lock` to pre-commit or to a workspace-level script invoked on `pnpm install` — 30 min

---

## Resolved

### TD-R086 — CI gate for AI Service Docker build

**Resolved:** 2026-04-22 by `09d5af7 ci: close Sprint D lane 1 — workflow + hook hardening (TD-086, TD-077, TD-083)`.
**Was:** `.github/workflows/deploy-ai.yml` is `workflow_dispatch`-only, so apps/ai's Dockerfile never got verified on a PR before a manual deploy. TD-085 + TD-087 were both caught by PO only during the first `flyctl deploy` — 30 minutes of build→fail→fix cycles that should have been one CI-side fail on the PR.
**Fix:** new `docker-build-ai` job in `ci.yml` uses `docker/setup-buildx-action@v3` + `docker/build-push-action@v6` with GHA cache, then runs `docker run --entrypoint python ai-service:ci -c "import ai_service.main"` inside the built image — the exact TD-087 failure mode (multi-stage venv shipping a `.pth` pointing at a missing `/src` path).
**Why no matching apps/api job:** `deploy-api.yml` already builds the Dockerfile via `flyctl deploy` on every push to main, so Dockerfile regressions surface there. Pattern clones cleanly if we later want PR-gated API Docker verification.
**Links:** Sprint D merge-log block.

### TD-R083 — `hook-commitlint.sh` fallback branches dead under `set -e`

**Resolved:** 2026-04-22 by `09d5af7 ci: close Sprint D lane 1 — workflow + hook hardening (TD-086, TD-077, TD-083)`.
**Was:** `set -e` + `if command -v pnpm; then pnpm exec commitlint ...` — on a fresh CC worktree with pnpm installed but `node_modules/` missing, pnpm exits with `ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL`; set -e kills the shell BEFORE the `elif` fallback branches run. Three CC sessions hit this in a row. Same shape also broken in `hook-biome.sh`.
**Fix:** rewrote both hooks to use the "probe runner with `--version` before delegating, then `exec` the real call" pattern. No `set -e`, no `2>/dev/null` masking. Lint/format exit codes propagate naturally; runner-unavailable paths skip cleanly.
**hook-ruff.sh / hook-gofmt.sh:** verified they use single-runner shape — no fallback cascade, no broken pattern. Untouched.
**Links:** Sprint D merge-log block.

### TD-R077 — Lefthook pre-push gap: golangci-lint not run locally

**Resolved:** 2026-04-22 by `09d5af7 ci: close Sprint D lane 1 — workflow + hook hardening (TD-086, TD-077, TD-083)`.
**Was:** pre-push ran `gofmt` + `go vet` + `typecheck` + `py-mypy` but NOT `golangci-lint`. Categories `bodyclose`, `noctx`, `errcheck`, `gocritic`, `revive` surfaced only on CI. PR #54 (CORS slice) leaked 2 × `bodyclose` + 2 × `noctx` for exactly this reason.
**Fix:** new `tools/scripts/hook-golangci-lint.sh` wired into `lefthook.yml` pre-push. Runs `golangci-lint run --new-from-rev=origin/main` on apps/api when the push actually touches Go files — same baseline CI uses, so local + CI agree on what's a "new" issue. Self-skips when Go toolchain absent (web-only workstations), apps/api missing, origin/main not fetched, or no .go changes vs origin/main.
**Install instructions** inline in the script header (one-time per dev machine).
**Links:** Sprint D merge-log block; DECISIONS.md § "CORS middleware: implicit → allowlist".

### TD-R076 — Contract sync test: OpenAPI schema → k6 smoke shape validation

**Resolved:** 2026-04-22 by `22cf906 test: close Sprint D lane 2 — OpenAPI ↔ k6 smoke contract validator (TD-076)`.
**Was:** `tools/k6/smoke/*.js` scripts assert response shapes by ad-hoc key checks (`body.items`, `body.total_value`, …); nothing enforced those keys match the generated OpenAPI types. TD-R075 was exactly that drift class: 4 scripts referenced fields that had been renamed in a schema tighten, caught only at flyctl-deploy-blocking staging time.
**Fix:** new `tools/scripts/check-k6-contract.py` — stdlib-only Python validator that reads the bundled OpenAPI JSON (from `pnpm --dir tools/openapi bundle`), scans each k6 script for `http.METHOD(...)` + body-key references, resolves the 2xx response schema, and asserts every `body.X` dotted key exists in the schema tree (transparent through arrays, resolves one-level `$ref`, tries each `oneOf/anyOf/allOf` branch). Only gates scripts that contain `body = X.json()` — request-payload + status-only smokes are correctly skipped.
**Tests:** `tools/scripts/check_k6_contract_test.py` — 14 unit tests covering the regex, schema walk, and validate_script happy/drift/skip paths.
**CI wiring:** new `contract-k6-spec-sync` job in `ci.yml` alongside `contract-header-symmetry`. Steps: pnpm install → pnpm bundle → run validator → run validator's own unit tests.
**Links:** Sprint D merge-log block.

### TD-R078 — Mandatory `gh pr checks <N> --watch` before `gh pr merge`

**Resolved:** 2026-04-22 by `cb66a2a chore: close Sprint D lane 4 — web tooling audit + doc hygiene (TD-001, TD-004, TD-054, TD-078)`.
**Was:** PR #54 was merged with failing `Go — lint + vet + build + test` check. CC + PO in different sessions both approved without sync to CI. Admin-bypass was an implicit default when someone rushed, not an explicit decision.
**Fix:** `docs/PO_HANDOFF.md § 3 "Cycle per PR"` now makes `gh pr checks <N> --watch` mandatory before `gh pr merge` (new step 4). `gh pr merge --admin` requires an inline PR comment explaining the CI-outage / P1-hotfix rationale — silent admin-bypass is a cycle-discipline violation. Admin-bypass policy paragraph updated to cross-reference both TD-006 (original) and TD-R078 (CI-watch requirement).
**Links:** Sprint D merge-log block; DECISIONS.md § "CORS middleware: implicit → allowlist (PR #54 + #55)".

### TD-R068 — Tighten `AIChatStreamEvent` schema to match translator reality

**Resolved:** 2026-04-22 by `2e4cd82 feat(spec): close Sprint D lane 3 — SSE schema tighten + request_id propagation (TD-048, TD-068)`.
**Was:** Two schemas in `tools/openapi/openapi.yaml` were looser than what `apps/api/internal/sseproxy/translator.go` actually emits on the wire. `AIStreamEventContentDelta.delta` was `type: object, additionalProperties: true` (translator always emits `{text: string}` — no `input_json_delta` discriminator post-translation). `AIStreamEventError.error` was `$ref: ErrorEnvelope` (wrapped shape — but translator emits the flat `{code, message, request_id?}` at top level of `event.error`).
**Fix:** explicit `required: [text]` + `properties: { text }` + `additionalProperties: false` on the delta; inline `{code, message, request_id?}` + `additionalProperties: false` on the error. Codegen regenerated via `generate-ts.sh` (shared-types) + `Makefile gen-api` (oapi-codegen via preprocess step for TD-007's 3.1-nullable workaround). Diff scoped to the two intended schema nodes + the auto-updated base64 swagger blob at the bottom of `openapi.gen.go`.
**Web consumer** — `apps/web/src/lib/ai/chat-reducer.ts` `unwrapEnvelope` kept as a 30-day compat shim with refreshed comment (drop target: 2026-05-22 per 2026-04-22 spec cutover); null-safety fallbacks preserved.
**Links:** Sprint D merge-log block.

### TD-R048 — SSE error event payload — request_id field

**Resolved:** 2026-04-22 by `2e4cd82 feat(spec): close Sprint D lane 3 — SSE schema tighten + request_id propagation (TD-048, TD-068)`.
**Was:** `ErrorEvent` in `apps/ai/src/ai_service/models.py` carried `message` + `code` but NOT `request_id`. Mid-stream errors forced cross-correlation by timestamp + user_id — slower MTTR.
**Fix:** `ErrorEvent.request_id: str | None = None` added; Pydantic always emits the field (None → null) for stable consumer shape. `ChatAgent.stream(...)` accepts an optional `request_id` kwarg and stamps it on the exception-fallback `ErrorEvent`. `stream_chat` FastAPI handler reads `X-Request-ID` via `Header(alias=...)` + an import-time assert against drift in `ai_service.http_headers.REQUEST_ID`, passes through to the agent. Core API side already emitted `request_id` in the outbound error frame (`sseproxy/translator.go:errorFrame`); `sseproxy/contract_test.go` asserts it — no Go changes needed.
**Tests:** `apps/ai/tests/test_streaming.py::test_format_sse_event_error` extended; new `::test_format_sse_event_error_with_request_id`.
**Links:** Sprint D merge-log block.

### TD-R001 — Next.js Turbopack incompatible with `experimental.typedRoutes`

**Resolved:** 2026-04-22 by `cb66a2a chore: close Sprint D lane 4 — web tooling audit + doc hygiene (TD-001, TD-004, TD-054, TD-078)` — audit-only close; no code change needed.
**Was:** Wave 1 disabled Turbopack because `experimental.typedRoutes` was incompatible. Trigger: Next.js 15.3+ (where the combination is expected to work).
**Audit:** Sprint D found `--turbopack` flag already present in `apps/web/package.json` dev script, `next.config.ts` has `typedRoutes: true`, installed Next.js is 15.5.15 (above the 15.3.0 threshold), web `typecheck` passes. Whoever re-enabled Turbopack (likely a routine Next bump sometime after the original TD) didn't close the debt. Sprint D catches the ledger up.
**Links:** Sprint D merge-log block.

### TD-R054 — CC agent memory lives outside repo (shared invariants gap)

**Resolved:** 2026-04-22 by `cb66a2a chore: close Sprint D lane 4 — web tooling audit + doc hygiene (TD-001, TD-004, TD-054, TD-078)`.
**Was:** CC memory lives in `C:\Users\<user>\.claude\projects\<project>\...`, outside the repo. New CC sessions didn't see previous sessions' invariants — single point of failure was PO discipline in writing decisions to DECISIONS.md.
**Fix (option b per the original TD):** `docs/PO_HANDOFF.md § 12 continuation prompt` now instructs the incoming CC to also read `docs/DECISIONS.md` AND to mirror any cross-session invariant discovered in the current session back to DECISIONS.md BEFORE ending. Rule-of-thumb added: "if the answer to 'why do we do this?' requires a read-through of current code, it's an invariant — write it to DECISIONS.md". Cheapest fix — no new `docs/CC_MEMORY/` directory, no commit-noise.
**Links:** Sprint D merge-log block.

### TD-R047 — CSVExport tier flag heuristic (P1 pre-GA)

**Resolved:** 2026-04-22 by `4ad38fc fix(tiers): replace CSVExport heuristic with explicit tier flag (TD-047)`.
**Was:** The `/exports` handler (`apps/api/internal/handlers/exports.go:41-49`) gated Free vs Plus+ by inferring "not-free" from `AIMessagesDaily <= 5`. Correct today but fragile — any future tuning of the Free-tier AI budget (trial experiments bumping the cap to 10-20) would silently flip the CSV-export gate for free users.
**Fix applied:** explicit `CSVExport bool` flag on `tiers.Limit`, set to `true` on Plus + Pro, matching the existing flag pattern used for `AdvancedAnalytics` (Pro-only) and `TaxReports` (Pro-only). Handler replaced with:
```go
if !tiers.For(user.SubscriptionTier).CSVExport {
    return errs.Respond(c, reqID,
        errs.New(http.StatusForbidden, "FEATURE_LOCKED", "CSV export requires Plus or higher"))
}
```
No wire-contract change — response envelope, status code, `X-Export-Pending` header all byte-equivalent for every tier.

**Tests:**
- `internal/domain/tiers/limits_test.go` (new) — table-driven matrix asserting every (tier × counter) and (tier × flag) pair + the unknown-tier fail-closed fallback. Coverage: `internal/domain/tiers` 20.0% → 100.0%.
- `exports_integration_test.go` — strengthened `TestCreateExport_FreeTier_403` to assert `error.code == "FEATURE_LOCKED"` (not a generic forbidden); added `TestCreateExport_HappyPath_Pro` so the flag matrix is observed end-to-end from both Plus and Pro upgrade paths.

**Links:** `apps/api/internal/domain/tiers/limits.go` (flag + matrix); `apps/api/internal/handlers/exports.go` (handler gate); `apps/api/internal/domain/tiers/limits_test.go` (matrix unit tests); `apps/api/internal/handlers/exports_integration_test.go` (strengthened + new integration tests).

### TD-R052 — AIRateLimit pre-increment overcount

**Resolved:** 2026-04-21 by `7e6ea94 fix(airatelimit): reserve-then-commit — refund rejected + failed attempts (TD-052)` (Sprint C session 2 cluster 2b).
**Was:** `airatelimit` middleware pre-incremented the Redis daily counter BEFORE the cap check, so every rejected 6th attempt left the counter stuck at `cap+1` (counter=6 with free cap=5 and 5 allowed + 1 rejected). Handler 5xx responses (AI Service outage) also inflated the counter permanently — the user "spent" quota on upstream failures they never actually completed.
**Fix applied:** `airatelimit.New` now implements reserve-then-commit:
1. INCR reserves a slot (still atomic against concurrent racers).
2. If post-INCR count > cap → DECR refund + 429 (rejected attempt does not stick).
3. Run `c.Next()`.
4. If the handler returned an error OR the response status is outside [200, 300) → DECR refund (failed attempt does not stick).
5. Otherwise: keep the INCR (2xx is the commit signal).

Streaming 2xx responses commit at the handler's write — once the client receives the 200 + first SSE bytes the AI Service has already spent tokens and the billing ledger in `persistTurn` is the authoritative record (TD-R091 guarantee preserved unchanged).

**Test flip:** Sprint B pinned `counter=6` in `TestTD052_PreIncrementOvercountOnDownstreamFailure`. Sprint C session 2 renamed it to `TestTD052_UpstreamFailureRefundsCounter` and flipped the expectation — with the fix, 6 × 502 leaves the counter at **0** (every attempt refunded) because no AI work actually completed. A separate new test `TestReserveCommit_RejectedAttemptRefundsBucket` isolates the narrower "5 success + 1 reject → counter=5" case.

**New helper:** `apps/api/internal/cache.Client.Decr` — thin `rdb.Decr` wrapper so the refund path stays symmetrical with `IncrWithTTL` and future rate-limit middlewares reuse the pair without reaching through `cache.Client.Redis()`.

**Coverage:** `internal/middleware/airatelimit` 80.6% → 88.4% across Sprint B + C. Uncovered is the DECR-fails warn log; above the ≥85% gate.

**Links:** Sprint C merge-log block (see merge-log.md); `apps/api/internal/middleware/airatelimit/airatelimit.go` (fix); `apps/api/internal/middleware/airatelimit/airatelimit_test.go` (flipped test); `apps/api/internal/cache/redis.go:Decr` (new helper).

### TD-R091 — Fiber v3 `c.SendStreamWriter` is async — persist branch race

**Resolved:** 2026-04-21 by `f64bc41` (product fix) + deploy-unblock chain `040c70f` → `bdf6a0a` → `a913a7a` (k6 smoke fixes).
**Was:** `apps/api/internal/handlers/ai_chat_stream.go` читал `res` из closure variable вне `c.SendStreamWriter` callback'а. Fiber v3 / fasthttp запускает тот callback *после* handler returns, так что `res == nil` в outer scope всегда → каждая successful stream иттерация уходила в else-branch "message_stop not received — skipping persist". Результат: assistant messages *никогда* не persist'ились, `ai_usage` billing ledger *никогда* не insert'ился, UI показывал ответ и он пропадал на refetch (React Query invalidate → empty DB → unmount).

**Fix applied (product):** `f64bc41 fix(api): persist AI chat turn inside SendStreamWriter callback (TD-091)` — persist + error-log переехали внутрь SendStreamWriter callback'а, где `res` actually populated к моменту branch'а. Outer handler теперь только commit'ит SSE headers и returns. Структурный comment (ai_chat_stream.go:71–78) документирует async semantics для следующего разработчика.

**Deploy unblock chain:** TD-091 product code merge'ился на main сразу, но `deploy-api.yml` падал на k6 smoke — проблема была не в TD-091, а в pre-existing bug'е `tools/k6/smoke/ai_chat_stream.js` (copy-paste-inherited от более старого runner'а). Три последовательных CI-fix'а:
1. `040c70f fix(ci): k6 ai_chat_stream mints real conversation` — smoke script посылал hardcoded `conversation_id = uuid.Nil`, который `parseChatRequestBody` (ai_chat_shared.go:80) отклоняет 400 "conversation_id is required" ещё до ownership/upstream слоёв. Переключил на `setup()` который делает реальный `POST /ai/conversations` и передаёт id в iterations.
2. `bdf6a0a fix(ci): single iteration + tolerate 429` — `duration: 30s` + `vus: 1` выжигал daily cap (AIMessagesDaily=5 для free tier) за пару секунд, потому что `airatelimit` middleware (apps/api/internal/middleware/airatelimit/airatelimit.go:80) increment'ит counter *до* upstream call. Одна иттерация + принятие 429 как healthy outcome (proves path intact up to rate-limit middleware).
3. `a913a7a fix(ci): drop http_req_failed threshold` — k6 built-in metric считает 429 как failure, `rate<0.05` не выживало 1/2 ratio (setup 201 + main 429). `checks` threshold уже авторитативный; http_req_failed дублировал ту же проверку looser-definition'ом.

**Verification:**
- Staging Fly deploy succeeded — image labels содержат `GH_SHA=a913a7a`, который carries f64bc41. `flyctl status -a investment-tracker-api-staging` → 1 machine `started`, checks passing, deployed 2026-04-21T18:07:50Z.
- `deploy-api.yml` run `24738505122`: ✓ Verify staging secrets, ✓ Deploy staging, ✓ k6 smoke staging. Overall run red только из-за pre-existing "Verify prod secrets" failure — prod Fly app `investment-tracker-api` ещё не provisioned, out of scope per kickoff ("prod may not exist yet").
- Fiber logs window rolled since test requests (machine re-deployed 3x в этой сессии), direct DB verification не выполнен автоматически — см. PO follow-up ниже.

**PO follow-up (browser verification):** открыть `chat.investment-tracker.app` (staging) → залогиниться → `/chat` → отправить test message. Ожидается:
1. Ответ стримится live.
2. Ответ остаётся после stream completion (previously пропадал).
3. `flyctl logs -a investment-tracker-api-staging --since 5m | grep persistTurnBackground` показывает success log.
4. DB: новый `ai_usage` row (billing ledger restored) + новый `ai_messages` row с `role='assistant'` для сегодняшнего turn'а.

**Why tests didn't catch it originally:** `apps/api/internal/sseproxy/proxy_test.go` тестирует `sseproxy.Run` напрямую на `httptest.ResponseRecorder` — synchronous invariant, async wrapper не покрыт. Integration test с реальным Fiber app + upstream SSE mock — отсутствует (opened как follow-up тех-debt в next sprint, см. Trigger to revisit ниже).

**Trigger to revisit (opened follow-ups):**
- Integration test который поднимает Fiber app, даёт mock AI Service stream, ждёт `message_stop` на клиентской стороне, проверяет что `ai_messages` + `ai_usage` rows созданы в test DB. Должен включаться в `api` CI workflow. *Scheduled for post-alpha sprint.*
- Grep `SendStreamWriter` по всему `apps/api/internal/handlers/` — это единственный handler его использующий, но любой будущий streaming endpoint должен помещать post-stream логику внутрь callback'а. Добавить lint-rule или DECISIONS.md entry.
- Fiber v3 upgrade notes при major bump — проверить не изменилась ли семантика.
- TD-070 смоук-тест 503-tolerance теперь pre-obsolete (AI Service deployed 2026-04-21) — оставлен в коде как безопасная fallback, уберётся вместе с TD-070 prod cutover.

**Links:** `apps/api/internal/handlers/ai_chat_stream.go` (product fix); `apps/api/internal/sseproxy/proxy.go` (unaffected — Run itself is synchronous); `tools/k6/smoke/ai_chat_stream.js` (smoke fix chain); merge-log entry ниже.

### TD-R090 — `turbo.json` env list drift — Vercel env vars filtered out of runtime

**Resolved:** 2026-04-21 by `05f43d3 fix(turbo): allowlist API_URL + APP_URL so Vercel env reaches runtime`.
**Was:** Turbo v2 cuts any env var not in the `globalEnv` / `tasks.build.env` allowlist from the build process AND from the serverless function runtime environment. `API_URL` + `APP_URL` were set on Vercel Production but missing from `turbo.json` → `process.env.API_URL` was `undefined` in Next.js Server Component `page.tsx` for `/chat/[id]` → `createApiClient({ baseUrl: undefined })` → openapi-fetch internal exception → UI rendered "Unable to load this conversation right now."
**Fix applied:** Added `API_URL` + `APP_URL` to `tasks.build.env` array in `turbo.json`. Vercel build log's `Warning - the following environment variables are set on your Vercel project, but missing from "turbo.json"` was the leading indicator that got missed.
**Trigger to revisit (open follow-up):** every new Vercel env var must be added to `turbo.json`. Longer-term fix: CI gate that fails a PR if Vercel env vars diverge from `turbo.json` (requires Vercel API integration), or periodic audit. Also grep `apps/web/` for all `process.env.\w+` usages and confirm each is declared.
**Links:** TD-R088 + TD-R089 (same staging-chat-debug arc); merge-log `turbo.json` fix entry.

### TD-R089 — Root `prepare` hook fails in CI build envs missing `.git`

**Resolved:** 2026-04-21 by `bcd1b34 fix(web): defensive API_URL fallback + guard lefthook prepare in CI`.
**Was:** `package.json` root `"prepare": "lefthook install"` — npm/pnpm run `prepare` automatically after `install`. Vercel build env has no `.git` directory (CI checkout without git metadata), so `lefthook install` → `git rev-parse --show-toplevel` → exit 128 → `pnpm install` failed → build died before `apps/web/` compile. Found only because TD-088 redeploy forced a cold-cache Vercel build.
**Fix applied:** `prepare` wrapped in inline node guard: `node -e "if(require('fs').existsSync('.git'))require('child_process').execSync('lefthook install',{stdio:'inherit'})"`. Local `.git` present → hooks install as before. CI / Vercel without `.git` → prepare exits 0 silently.
**Trigger to revisit (open follow-up):** if any `apps/*/package.json` adds its own `prepare`, replicate the guard. If `lefthook` is replaced or removed, guard simplifies back to direct install.
**Links:** TD-R088 (same commit); merge-log close-td-088 entry.

### TD-R088 — `apps/web/src/lib/api/server.ts` should use `||` not `??` for `API_URL` fallback

**Resolved:** 2026-04-21 by `bcd1b34 fix(web): defensive API_URL fallback + guard lefthook prepare in CI`.
**Was:** `const SERVER_BASE_URL = process.env.API_URL ?? 'http://localhost:8080';` — `??` only falls back on `null`/`undefined`. On Vercel Production `API_URL` got created interactively with an empty value (misconfigured `vercel env add` pipe with CRLF) → `process.env.API_URL === ""` → `??` didn't trigger → `createApiClient({ baseUrl: "" })` → openapi-fetch exception → all chat conversations hit generic error fallback silently.
**Fix applied:** `??` → `||` with a comment explaining empty-string is a common misconfigured value and must trigger fallback. Defensive guard — if Vercel env is empty again, web now hits localhost and staging shows obvious connection-refused instead of mystery "Unable to load".
**Trigger to revisit (open follow-up):** audit remaining `process.env.X ?? '...'` across the monorepo. URL / hostname / port / feature-flag vars prefer `||`. Arbitrary string vars that may legitimately be empty (rare — e.g. `LOG_PREFIX`) keep `??`. One `rg 'process\.env\.\w+ \?\?' apps/ packages/` sweep closes it.
**Links:** TD-R089 (same commit); TD-R090 (real root cause — the `turbo.json` drift — that TD-R088 defensively hedges against); DECISIONS.md (TBD entry: `?? vs ||` policy for env var defaults).

### TD-R087 — `uv sync` in multi-stage Dockerfile must use `--no-editable`

**Resolved:** 2026-04-21 by `4357739 fix(ai): install project non-editable in Dockerfile (fix multi-stage ModuleNotFoundError)`.
**Was:** `apps/ai/Dockerfile` builder stage ran `uv sync --frozen --no-dev` without `--no-editable`. uv defaults to editable install — drops a `.pth` file in site-packages pointing at `/src/src/ai_service`. Copying `/opt/venv` to runtime stage without `/src` broke imports: `ModuleNotFoundError: No module named 'ai_service'`. Container booted but `python -m ai_service.main` crashed.
**Fix applied:** `--no-editable` added to `uv sync`. Project lands as a normal package in `/opt/venv/lib/python3.13/site-packages/ai_service` and travels with the venv copy.
**Trigger to revisit (open follow-up):** next Python service with multi-stage Dockerfile — cement pattern in a shared base image or Dockerfile template. TD-086 CI gate would catch regressions.
**Links:** TD-086 (CI gate would have caught); DECISIONS.md § "AI Service staging deploy topology (TD-070)" gotchas list; merge-log entry for `4357739`.

### TD-R085 — `apps/ai/.dockerignore` excluded `README.md` which `pyproject.toml` requires

**Resolved:** 2026-04-21 by `b079d30 fix(ai): remove README.md from dockerignore (Dockerfile COPY requires it)`.
**Was:** Default scaffold `.dockerignore` had `README.md` in the exclude list. `apps/ai/pyproject.toml` declares `readme = "README.md"` — Hatchling build-backend requires README.md in the build context. `uv sync` in Docker builder died with `FileNotFoundError: README.md`.
**Fix applied:** removed `README.md` line from `apps/ai/.dockerignore`.
**Trigger to revisit (open follow-up):** audit `.dockerignore` in any Python app with `pyproject.toml` declaring `readme` or `license`. Closes fully once TD-086 lands a CI Docker build gate.
**Links:** TD-086 (CI gate would have caught); TD-R087 (same first-deploy debug session); merge-log entry for `b079d30`.

### TD-R070 — AI Service staging deploy

**Resolved:** 2026-04-21 (this PR — `docs: close td-070 + post-deploy ledger`).
**Was:** AI Service (`apps/ai`, Python 3.13 / FastAPI) был code-complete (PR #34 + PR #43 cleanup) но не deployed ни в один environment. Блокировал UI Slice 6a (Insights read-only) потому что `/v1/ai/insights` endpoint недоступен на staging → фронт не мог имплементировать real data fetch.

**Resolution sequence:**
1. **Config-as-code** — PR #61 (`8ff5abf`, merged 2026-04-21): `apps/ai/fly.staging.toml`, `apps/ai/secrets.keys.yaml`, `ops/scripts/verify-ai-secrets.sh` shim, `.github/workflows/deploy-ai.yml` rewrite к `workflow_dispatch` + `environment:` input, ADR в `DECISIONS.md`, точечные правки `RUNBOOK_ai_staging_deploy.md`.
2. **First deploy + 2 ops-fixes** — PO runtime ops поймали 2 latent Dockerfile bugs которые CI не словил:
   - `4357739 fix(ai): install project non-editable in Dockerfile (fix multi-stage ModuleNotFoundError)` — см. TD-087.
   - `b079d30 fix(ai): remove README.md from dockerignore (Dockerfile COPY requires it)` — см. TD-085.
3. **Smoke green** — `https://investment-tracker-ai-staging.fly.dev/healthz` 200 OK; bridge invariant `AI_SERVICE_TOKEN` ≡ `INTERNAL_API_TOKEN` verified via round-trip smoke; no error events в Sentry post-deploy.

**Latent bugs caught during first deploy (documented as separate TDs):**
- **TD-084** (P2) — flyctl build context CWD vs `--config` location (Dockerfile COPY paths must be repo-root-relative).
- **TD-085** (P3, fixed inline `b079d30`) — `apps/ai/.dockerignore` excluded `README.md` which `pyproject.toml` readme-ref requires.
- **TD-086** (P2) — no CI Docker build gate на `apps/ai/` (TD-087 + TD-085 должны были быть пойманы CI).
- **TD-087** (P3, fixed inline `4357739`) — `uv sync` должен использовать `--no-editable` в multi-stage Dockerfile.

**Reserved for prod flip:** TD-082 (automated drift check for `AI_SERVICE_TOKEN` ≡ `INTERNAL_API_TOKEN` parity) — opens real когда AI Service prod deploy scheduled.

**Unblocked:** UI Slice 6a (Insights read-only) — фронт может имплементировать real data fetch против `https://investment-tracker-ai-staging.fly.dev/v1/ai/insights`.

**Not yet done (пост-staging tracks):**
- AI Service prod app (`investment-tracker-ai`, separate from staging) — отдельный runbook ops, блокер 404-swallow strict flip (`RUNBOOK_ai_flip.md`).
- DNS CNAME `investment-tracker-ai-staging.fly.dev` → `ai-staging.investment-tracker.app` — cosmetic, не блокер.

**Links:** `RUNBOOK_ai_staging_deploy.md`, `DECISIONS.md` § "AI Service staging deploy topology (TD-070)", `RUNBOOK_ai_flip.md` (prod flip pending), merge-log `close-td-070` entry.

---

### TD-R075 — k6 smoke scripts drift vs actual API response shapes

**Resolved:** 2026-04-20, this PR.
**Was:** four of five `tools/k6/smoke/*.js` scripts asserted response fields that don't exist on the current API:
- `portfolio_read.js` expected top-level `body.total_value` / `body.accounts`. Real `/portfolio` shape is `PortfolioSnapshot` — `total_value` is nested under `values.base` / `values.display`; no `accounts` field at all.
- `positions_read.js` expected `body.items` + `body.next_cursor`. Real `/positions` returns `{data: Position[]}` (single-shot list — cursor-paginated variant lives on `/positions/{id}/transactions`).
- `idempotency.js` expected the cached replay to return 200. The middleware (`internal/middleware/idempotency.go`) preserves the original status on replay — second identical POST returns 201 with the same body. The real correctness invariant is `account.id` equality between first call and replay, not a status-code rewrite.
- `ai_chat_stream.js` sent a legacy request shape `{messages:[{role, content}]}`. Real `AIChatRequest` per OpenAPI is nested — `{conversation_id, message: {content: [{type:"text", text}]}}`. Plus AI Service is not yet deployed on staging (TD-070) so `/ai/chat/stream` returns 503 regardless.

Scripts were written before PR #30 tightened the OpenAPI schema; never re-audited. Surfaced on first real end-to-end smoke run 24680345933 after TD-R071 unblocked auth.

**Fix:**
- `portfolio_read.js`: assert `body.snapshot_date && body.values.base.total_value !== undefined`.
- `positions_read.js`: drop the `?limit=20` query (ignored), assert `Array.isArray(body.data)`, drop `next_cursor` check.
- `idempotency.js`: update comments + assertions to accept `201 (replay) | 409 (in-progress)`. New assertion — replayed `account.id` must equal the first call's `account.id`.
- `ai_chat_stream.js`: correct request body to `AIChatRequest` shape. Accept `200 OR 503`, with 200-conditional SSE content-type + data-frame checks. Scenario will turn strict 200-only automatically once TD-070 closes.

**Alternative considered:** regenerate scripts from OpenAPI at CI build time. Rejected as over-scope for a 25-LOC fix. Recorded as **TD-076** for future contract-sync work.

---

### TD-R071 — k6 auth-gated smoke fails on 60s Clerk JWT TTL

**Resolved:** 2026-04-20, this PR (pre-smoke mint step in `deploy-api.yml`).
**Was:** `STAGING_TEST_USER_TOKEN` repo secret held a Clerk session JWT with Clerk's default 60-second TTL. By the time `deploy-staging` finished and `smoke-staging` hit its first auth-gated scenario (`portfolio_read.js`), the JWT was expired → every auth scenario returned `401 INVALID_TOKEN` and the whole smoke job failed even on a fully-healthy app. Observed on run 24679709643 (2026-04-20, SHA `2c43587`): public scenarios 126/126 green, auth scenarios 0/N green.
**Fix:** new step `Mint fresh Clerk JWT` in `smoke-staging`, runs before `bash tools/k6/run-smoke.sh`. Pulls a fresh token via `POST /v1/sessions/{SID}/tokens` using `CLERK_SECRET_KEY_STG` + `STAGING_TEST_SESSION_ID` repo secrets, `::add-mask::` on the value, forwards via `GITHUB_ENV` as `TEST_USER_TOKEN`. The stale `STAGING_TEST_USER_TOKEN` secret is no longer read by the workflow (can be deleted separately when convenient).
**Alternative considered:** Clerk JWT Template with 1h TTL. Rejected because the template has to be configured in the Clerk dashboard (no public API) — pushes manual setup onto PO and is invisible in the repo. Pre-smoke mint keeps the contract in code.

---

### TD-R021 — `asynq` publisher wrapper + /market/quote cache-miss enqueue

**Resolved:** 2026-04-19 in PR #40 (SHA `11d6098`) commit `b827241`
**Was:** Core API не имел wrapper'а для публикации фоновых задач в asynq. Market-data handlers на cache-miss возвращали stale data без попытки fetch'нуть свежую цену; workers в TASK_06 �