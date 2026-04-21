# Tech Debt Log

Running ledger of known-but-accepted debt. Each item has an owner (who revisits), a trigger (when to revisit), and a scope (how big the fix is).

Newest entries at the top. When an item is resolved, move it to the "Resolved" section at the bottom with the resolution commit/PR.

## Priority legend

- **P1** — GA blocker. Должно быть закрыто до публичного launch (рискует прод-инцидент или блокирует базовый user flow).
- **P2** — Post-GA OK для запуска alpha, но критично до scale (несколько сотен пользователей или платный plan).
- **P3** — Polish / nice-to-have. Не блокирует, но накапливать нельзя — раз в квартал bulk-cleanup.

---

## Active

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

### TD-078 — Mandatory `gh pr checks <N> --watch` before `gh pr merge`

**Added:** 2026-04-21 (CORS slice incident — PR #54 admin-bypass merge with red CI; original ID TD-077 в DECISIONS.md, перенумерован чтобы не конфликтовать с existing TD-076).
**Priority:** P2
**Source:** PR #54 был мёрджен с failing `Go — lint + vet + build + test` check. CC и PO в разных сессиях одновременно одобрили merge без синхронизации с CI. Admin-bypass должен быть **явным** решением (`--admin` flag + inline comment с reason), а не молчаливым default'ом когда кто-то торопится.
**Decision deferred:** policy update требует documenting в `PO_HANDOFF.md § 3 Cycle per PR`. Перед `gh pr merge` обязательный `gh pr checks <N> --watch` до получения all-green; если checks red — остановиться, запустить hotfix flow (см. PR #55 как reference).
**Owner:** PO.
**Revisit:** 2 PR merge'а подряд без violation → считаем абсорбированным.
**Links:** DECISIONS.md § "CORS middleware: implicit → allowlist (PR #54 + #55)" — incident detail.

### TD-077 — Lefthook pre-push gap: golangci-lint not run locally

**Added:** 2026-04-21 (CORS slice incident; original ID TD-076 в DECISIONS.md, перенумерован).
**Priority:** P2
**Source:** `lefthook.yml` pre-push hook сегодня прогоняет `gofmt` + `go vet` + `typecheck` + `py-mypy`. Этого мало: категории `bodyclose`, `noctx`, `errcheck`, `gocritic`, `revive` ловятся ТОЛЬКО на CI. PR #54 пострадал именно от этого: 2 `bodyclose` (missing `defer resp.Body.Close()` после `app.Test()`) и 2 `noctx` (`httptest.NewRequest` вместо `NewRequestWithContext`) проскочили локально.
**Decision deferred:** добавить `tools/scripts/hook-golangci-lint.sh` + entry в pre-push. Опция: запускать только на staged Go файлах через `{staged_files}` или `--new-from-rev=origin/main`, чтобы не гонять full lint каждый push.
**Owner:** backend lead.
**Revisit:** after next Go-touching PR — подтвердить что incident не повторяется.
**Links:** DECISIONS.md § "CORS middleware: implicit → allowlist".

### TD-076 — Contract sync test: OpenAPI schema → k6 smoke shape validation

**Added:** 2026-04-20 (paired with TD-R075 — k6 scripts drifted silently against actual API shapes)
**Priority:** P3
**Source:** `tools/k6/smoke/*.js` scripts assert response shapes by ad-hoc key checks (`body.items`, `body.total_value`, …). Nothing enforces those keys match the generated OpenAPI types, so a backend rename or a shape rework breaks smoke only at runtime — and the only runtime we have is a deploy-blocking staging job. TD-R075 was exactly that failure mode (4 scripts drifted post-PR #30 schema tighten).
**Risk:** low per-incident, but each drift blocks a deploy and requires a PR. Cost compounds as more scenarios land.
**Fix sketch:** a pre-smoke validation step that loads `tools/openapi/openapi.yaml`, extracts the response schema for each hit endpoint, and asserts the k6 script's expected fields are declared in the spec. Alternatively, generate typed fixtures from the spec (JSON Schema / zod) that k6 scripts import. Former is simpler, latter is tighter.
**Trigger to revisit:** next silent drift OR when smoke scenario count crosses ~10 (today 5).
**Owner:** backend + infra
**Scope:** ~150 LOC Python or Node validator + 1 new workflow step — 1 day

---

### TD-070 — AI Service staging deploy

**Status:** 🟡 config shipped, awaiting PO runtime deploy + smoke.
**Added:** 2026-04-20 (staging ops bootstrap). **Priority:** P2.

**Config-as-code shipped (2026-04-21):**
- `apps/ai/fly.staging.toml` — staging Fly config (app `investment-tracker-ai-staging`, region `fra`, `min_machines_running = 1`, `LOG_LEVEL = "INFO"`, Anthropic model IDs pinned in `[env]`).
- `apps/ai/secrets.keys.yaml` — manifest: 4 required (`INTERNAL_API_TOKEN`, `ANTHROPIC_API_KEY`, `CORE_API_URL`, `CORE_API_INTERNAL_TOKEN`) + 8 optional (Sentry/PostHog/Anthropic tuning).
- `ops/scripts/verify-ai-secrets.sh` — thin shim over `verify-prod-secrets.sh` via `KEYS_FILE` env override (1-line generalization in the shared script).
- `.github/workflows/deploy-ai.yml` — rewritten to `workflow_dispatch` + `environment: staging|production` input (default = staging) + pre-deploy verify-secrets step.
- `docs/DECISIONS.md` — ADR "AI Service staging deploy topology (TD-070)" explaining topology, bridge invariant, and alternatives rejected.
- `docs/RUNBOOK_ai_staging_deploy.md` — точечные правки (§ 3 landed note, § 4.2 Doppler models убраны, § 6 GH Actions alt path, § 9 obsolete line removed).

**Still open (PO runtime ops):**
1. `flyctl apps create investment-tracker-ai-staging --org personal` (runbook § 2).
2. Doppler project `investment-tracker-ai` + config `stg` + 4 secrets (runbook § 4).
3. `doppler → flyctl secrets import` для AI app (§ 4.3).
4. Core API staging Doppler: `AI_SERVICE_URL` + `AI_SERVICE_TOKEN` (bridge invariant — equal to AI's `INTERNAL_API_TOKEN`), sync → Fly (§ 5).
5. First `flyctl deploy --config apps/ai/fly.staging.toml` + smoke (§ 6-7).

**Reserved:** TD-082 (automated drift check for `AI_SERVICE_TOKEN` ≡ `INTERNAL_API_TOKEN` parity) opens real when AI Service prod flip is scheduled.

**Trigger to close:** PO confirms `/healthz` 200 + auth check + clean logs, then marks TD-070 ✅ per runbook § 11 checklist.

**Owner:** PO (remaining runtime ops). **Unblocks:** UI Slice 6a (Insights read-only).

---

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

### TD-068 — Tighten `AIChatStreamEvent` schema to match translator reality

**Added:** 2026-04-20 (PR #50 / TASK_07 Slice 3)
**Priority:** P3 (docs-only, no runtime impact — shape stable)
**Source:** `apps/api/internal/sseproxy/translator.go` normalises Python AI Service-native SSE frames into OpenAPI-compliant frames before forwarding to clients, but the spec for two events in `tools/openapi/openapi.yaml` is out of sync with what actually goes on the wire:

- **`AIStreamEventContentDelta.delta`** is typed `type: object, additionalProperties: true` (line 2972-2975) — too loose. Translator always emits `{text: string}` (translator.go:59-64). No `text_delta` / `input_json_delta` Anthropic-native discriminator exists post-translation.
- **`AIStreamEventError.error`** is typed as `$ref: ErrorEnvelope` (line 3020) — the full wrapped envelope `{error: {code, message, request_id}}`. Translator emits flat `{code, message, request_id?}` at top level of the event's `error` property (translator.go:148-157 via `errorFrame`).

**Risk:** low — shape is stable today; TypeScript frontend (PR #50) carries `unwrapEnvelope` + `readDeltaText` helpers in `chat-reducer.ts` (~15 LOC) that accept both shapes defensively. Future schema evolution (e.g. adding `input_json_delta` for partial tool args) would widen the gap.

**Fix:** two small schema edits in `tools/openapi/openapi.yaml`:
1. `AIStreamEventContentDelta.delta` → explicit object with `required: [text]` + `properties: { text: { type: string } }` (or keep additionalProperties: true but make `text` a required named property).
2. `AIStreamEventError.error` → replace `$ref: ErrorEnvelope` with inline `{code, message, request_id?}` — mirror the actual `errorFrame` output shape.

Regenerate `packages/shared-types` after spec change. Frontend cleanup: remove `unwrapEnvelope` helper + `readDeltaText` defensive parse; `chat-reducer.ts` shrinks ~15 LOC.

**Trigger to revisit:** OpenAPI spec housekeeping pass, OR any future expansion of `content_delta.delta` payload (e.g. tool-input deltas arriving for impact_card / callout blocks when server starts emitting them).

**Owner:** backend (Core API spec + translator coord) + frontend (cleanup)
**Scope:** ~30 LOC (spec edits + regeneration + reducer simplification) — 0.5 day
**Links:** PR #50 commit `63ac3bf` (defensive parsing); PR #50 `chat-reducer.test.ts` «ignores unknown delta shapes gracefully» test demonstrates the resilience.

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

### TD-054 — CC agent memory lives outside repo (shared invariants gap)

**Added:** 2026-04-20 (flag from TASK_05 cleanup CC, post-PR #43)
**Source:** каждая Claude Code сессия пишет свою memory в `C:\Users\<user>\.claude\projects\<project>\...` — вне репозитория. Новые CC сессии не видят выводы предыдущих (например TASK_05 CC записал invariant «ai_usage owner = Core API» в local memory note, но B3-ii-b CC этого файла не получит).
**Current mitigation:** shared invariants дублируются в `docs/PO_HANDOFF.md` и `docs/DECISIONS.md` — новые CC читают их первым делом. Практически проблема не острая, пока PO поддерживает дисциплину записи decisions в DECISIONS.md.
**Risk:** низкий — если PO забудет записать decision в doc, новый CC может переизобретать или расходиться. Единичная точка отказа = дисциплина PO.
**Fix options:**
  a. `docs/CC_MEMORY/` в репо — каждая CC сессия commit'ит свою memory note как artifact. Git-версионировано. Минус: шум в commits, memory меняется часто.
  b. Convention: любой long-lived invariant из CC memory → зеркалится в DECISIONS.md автоматически (prompt update для CC).
  c. Оставить как есть — PO owns invariants в DECISIONS/PO_HANDOFF, CC memory считается ephemeral cache.
**Trigger to revisit:** первый incident drift между CC сессиями (один CC ведёт себя inconsistent с другим из-за missing invariant).
**Owner:** PO + any CC
**Scope:** (b) самый дешёвый — update continuation prompt template, ~5 LOC в PO_HANDOFF § 12.

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

### TD-052 — AIRateLimit pre-increment overcount (P2)

**Added:** 2026-04-20 (PR B3-ii-a)
**Source:** `airatelimit` middleware INCRementit Redis counter ДО handler вызова. Если post-INCR n > cap → 429 + counter сидит на n (over). Если handler 5xx (AI Service down) — counter уже инкрементирован, юзер «потерял» попытку.
**Risk:** низкий — overcount-by-1 на 429 = ноль разница для юзера (он уже отгеймлен). Counter-inflate-on-5xx = плохой DX (юзер «потратил quota» на upstream сбой).
**Fix:** «reserve + commit» паттерн. Lua script: SETNX reservation (TTL 60s), handler runs, on success — INCR daily counter + DEL reservation; on failure — DEL reservation; на 429 — никаких inserts. Атомарно, точно.
**Trigger to revisit:** complaint «я не делал столько запросов» или audit показывает >5% overcount drift против ai_usage ledger.
**Owner:** backend
**Scope:** ~50 LOC + tests — 1.5 часа

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

### TD-048 — SSE error event payload extension — request_id field

**Added:** 2026-04-20 (PR B3-ii-a planning, lands in B3-ii-b)
**Source:** AI Service SSE `event: error` payload (см. `ai_service/agents/chat_agent.py` ErrorEvent) carries `message` + `code`, но НЕ `request_id`. Sentry-correlation Core API ↔ AI Service сейчас работает только на HTTP-уровне (X-Request-Id header в request log) — для in-stream errors trace потеряется.
**Risk:** debugging mid-stream errors потребует cross-correlate logs по timestamp + user_id вместо одной trace ID. Slower MTTR.
**Fix:** AI Service ErrorEvent добавляет `request_id: str` field; Core API SSE proxy пропагирует его как полученный X-Request-Id в headers. Координация через TASK_05 CC.
**Trigger to revisit:** первый mid-stream production incident требующий cross-service trace; OR routine TASK_05 update.
**Owner:** backend lead + AI lead (TASK_05 coordination)
**Scope:** ~10 LOC AI Service + ~5 LOC Core API + spec bump

---

### TD-047 — CSVExport tier flag heuristic (P1 pre-GA)

**Added:** 2026-04-19 (PR #40 / B3-i)
**Priority:** P1 — **must fix before public GA**
**Source:** экспорт-tier gate в `/exports` handler'е сейчас эвристика: «если у юзера жёсткий AIMessagesDaily cap → значит free → значит нет экспорта». Рабочая корреляция сегодня, хрупкая архитектура.
**Risk:** если мы захотим дать Free попробовать AI (поднять `AIMessagesDaily` с 3-5 до 10-20 для trial-эксперимента) — экспорт автоматом откроется free-юзерам без явного intent.
**Fix:** добавить `CSVExport bool` в `internal/domain/tiers/limits.go` TierLimits struct. Заменить эвристику на explicit gate: `RequireTier(func(l TierLimits) bool { return l.CSVExport })`. Прописать в tier matrix: Free=false, Plus=true, Pro=true.
**Trigger to revisit:** перед public GA, жёсткий blocker.
**Owner:** backend lead
**Scope:** ~30 LOC + test — 1 час

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

---

### TD-001 — Next.js Turbopack incompatible with `experimental.typedRoutes`

**Added:** 2026-04-19 (wave 1)
**Source:** dev startup failure; Turbopack errors on typedRoutes config
**Fix applied:** removed `--turbopack` flag from `apps/web` dev script; runs on webpack
**Cost:** slower dev HMR (~2-3x on cold start)
**Trigger to revisit:** Next.js 15.3+ (typedRoutes + Turbopack compatibility expected)
**Owner:** web lead
**Scope:** 1-line package.json change + smoke test

---

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

**Trigger to revisit:** quarterly lint audit OR when any file is refactored substantially
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