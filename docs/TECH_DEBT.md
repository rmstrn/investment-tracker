# Tech Debt Log

Running ledger of known-but-accepted debt. Each item has an owner (who revisits), a trigger (when to revisit), and a scope (how big the fix is).

Newest entries at the top. When an item is resolved, move it to the "Resolved" section at the bottom with the resolution commit/PR.

---

## Active

### TD-038 — `ListAllTransactionsByUser` is unbounded

**Added:** 2026-04-19 (TASK_04 PR B2c / PR #39)
**Source:** `apps/api/internal/db/queries/transactions.sql` — new sqlc query `ListAllTransactionsByUser` returns the entire transactions ledger for a user in one SELECT, no cursor, no LIMIT. Used exclusively by `GET /portfolio/tax` because FIFO lot-matching requires the full history.
**Current state:** Safe at MVP scale (first ~1000 users, typical portfolio 10-500 transactions). Potential cost-DoS vector from a heavy user (10k+ transactions) — response time + DB memory grow linearly, and `/portfolio/tax` is a GET so it's rate-limited only by the global per-user bucket.
**Trigger to revisit:** **first user with 10k+ transactions in production**, OR p95 latency on `/portfolio/tax` exceeds 2s, OR an ops incident where a single user's tax call saturates a DB connection.
**Fix options (pick one when trigger fires):**
1. Chunk by year inside the handler: loop SQL per year in the requested range, stream into accumulator. Simple, ~2 hours.
2. Cursor-based stream from pgx into a FIFO matcher that consumes rows incrementally. Better memory profile, ~4 hours.
3. Materialize tax report in an async worker, `/portfolio/tax` serves from cache or triggers job. Best for re-report scenarios but needs job infra, ~1 day.
**Owner:** backend lead
**Scope:** 2-8 hours depending on chosen fix

---

### TD-037 — Short-sale / uncovered-qty not handled in tax FIFO

**Added:** 2026-04-19 (TASK_04 PR B2c / PR #39)
**Source:** `apps/api/internal/domain/tax/fifo.go`. FIFO matcher assumes every `sell` transaction has a prior matching `buy`. Short sales (sell before buy) and uncovered sales (sell qty exceeds prior buys) currently either return an error or produce nonsensical gains.
**Current state:** Margin/short trading is out of MVP scope (no broker integration exposes short positions in v1). For long-only accounts this is a non-issue. If a broker sync returns a short position, the tax report will skip or error that symbol with a logged warning.
**Trigger to revisit:** when we add a margin/short-capable broker integration (IBKR, Tastytrade), OR when a user manually enters a short transaction through the ledger UI.
**Fix:** Extend `fifo.go` to track negative quantity lots (short positions); on cover-buy, match against open shorts in LIFO order (IRS rule for shorts). Add test fixtures for short-then-cover and short-held-open-at-year-end (mark-to-market required for open shorts under US rules).
**Owner:** backend lead + tax-domain SME
**Scope:** ~1 day — pkg changes + test fixtures + jurisdiction dispatch for short-specific rules

---

### TD-036 — Tax report uses MVP formulas, not full jurisdiction rule sets

**Added:** 2026-04-19 (TASK_04 PR B2c / PR #39)
**Source:** `apps/api/internal/domain/tax/report.go`. `estimated_taxable_income` for US = `realized_gains - realized_losses`; for DE = same minus €1000 (Sparer-Pauschbetrag, single filer). No wash-sale detection (US §1091), no long-term vs short-term gains separation (US §1222 — 365-day boundary is captured in `holding_period_days` per-tx but not aggregated), no married-filing-jointly doubling of DE Pauschbetrag, no partial-year proration, no carryforward of prior-year losses.
**Current state:** Response header `X-Tax-Advisory: mvp-estimate` set on every `/portfolio/tax` response (compliance decision, pre-merge commit `ce23519`). UI must surface disclaimer "this is an estimate, not tax advice" prominently. Legal exposure is mitigated but the numbers are meaningfully different from what a CPA would produce.
**Trigger to revisit:** Pro tax reports milestone (month 5-6 per roadmap), OR first paying user complaint about a specific rule discrepancy.
**Fix:** Full rules require: (a) wash-sale lookback window (30-day before/after sale, same/substantially-identical security) with disallowed loss carryforward; (b) long-term vs short-term aggregation + separate tax rate application; (c) DE filing-status parameter (single vs joint) affecting Pauschbetrag; (d) prior-year loss carryforward (requires persistence of prior-year report or separate `tax_carryforwards` table); (e) jurisdiction-specific edge cases (FIFO vs HIFO in UK CGT, per-asset 1-year hold rule in DE before Abgeltungsteuer, etc).
**Owner:** backend lead + tax-domain SME (per-jurisdiction)
**Scope:** ~1 week per major jurisdiction (US + DE first, then add as users request)

---

### TD-035 — Only US + DE jurisdictions supported in tax report

**Added:** 2026-04-19 (TASK_04 PR B2c / PR #39)
**Source:** `apps/api/internal/domain/tax/report.go` dispatch. Other jurisdictions return `400 JURISDICTION_NOT_SUPPORTED` with `supported_jurisdictions: ["US","DE"]` in error details.
**Current state:** Users outside US/DE can still see their realized gains in `/portfolio/performance` (jurisdictionless), but cannot pull a tax report. Product decision: ship the two biggest markets for our target demo, expand by demand.
**Trigger to revisit:** paying-user ask per jurisdiction — each add is its own mini-project. Likely order based on market size + residency data from onboarding: IT, FR, UK, PL, ES, NL.
**Fix:** Per jurisdiction — research cost-basis rules, Pauschbetrag/allowance equivalents, filing deadlines, any special rules (UK share-pooling, French PFU flat vs bareme choice). Add to `tax/jurisdictions/{iso}.go`, extend dispatch, add integration test, add to `supported_jurisdictions` list.
**Owner:** backend lead + tax-domain SME per jurisdiction
**Scope:** ~2-3 days per jurisdiction (research + implementation + tests)

---

### TD-034 — Cost-basis method selection requires `tax_lots` table + UI lot-picker

**Added:** 2026-04-19 (TASK_04 PR B2c / PR #39)
**Source:** `apps/api/internal/handlers/portfolio_tax.go`. Method is hardcoded to FIFO inside the tax package; LIFO exists in pkg for future use but is not exposed. `specific_id` (user selects which lots to realize on a sale, common for tax optimization) is not supported — the tax pkg has no state to record lot selection.
**Current state:** FIFO default works for 80%+ of retail tax scenarios. Users who want HIFO (Highest-In-First-Out — best tax optimization) or specific-ID cannot access those methods. Per DECISIONS 2026-04-19 tax method was removed from query params (spec-driven) — method became an internal detail pending full UX.
**Trigger to revisit:** **Pro tax reports milestone (month 5-6 per roadmap).** Gated on UI work because specific-ID requires a lot-picker surface per-sale.
**Fix:** (a) New `tax_lots` migration — each buy creates lots, sells consume lots per method or explicit selection. (b) Migrate FIFO/LIFO from pure-function to stateful read through lots. (c) New lot-picker UI on sell/transaction entry. (d) Re-expose method in `/portfolio/tax` query params. (e) Backfill script: for existing transactions, generate FIFO-style lots retroactively so historical reports stay stable.
**Owner:** backend lead + web lead
**Scope:** ~5-7 days (migration + handler rewrite + UI + backfill)

---

### TD-033 — `correlation_matrix` empty pending price-series computation

**Added:** 2026-04-19 (TASK_04 PR B2c / PR #39)
**Source:** `apps/api/internal/handlers/portfolio_analytics.go`. `correlation_matrix` field in response is `null` with `X-Analytics-Partial: true` response header. Computing it requires a daily price series per position over the requested period, a square matrix of Pearson correlations, and sparsity handling for positions that have partial price coverage.
**Current state:** Only position-level price series is theoretically computable from existing `prices` table — but the table currently stores only the latest quote (TD-024 for `previous_close`, TD-030 for OHLC history). Until OHLC ingest pipeline (TD-030) is live, there's no price series to correlate.
**Trigger to revisit:** **after TD-030 closes.** Depends on OHLC backfill being populated for all symbols in a user's portfolio.
**Fix:** Once `prices_ohlc` has daily coverage for requested period, query series per position, compute Pearson correlation matrix in Go (`gonum/stat` or equivalent). Sparsity check: if any position has <75% coverage over the period, either omit from matrix with a warning or return `null` if <3 positions have full coverage.
**Owner:** backend lead
**Scope:** ~4 hours (pkg + handler wiring + test) once TD-030 data is available

---

### TD-032 — `factor_exposure` + `style_box` empty pending fundamentals feed

**Added:** 2026-04-19 (TASK_04 PR B2c / PR #39)
**Source:** `apps/api/internal/handlers/portfolio_analytics.go`. `factor_exposure` (5 factors — anticipating Fama-French 3 + momentum + quality or similar canonical factor model) and `style_box` (3×3 grid: value/blend/growth × small/mid/large-cap) fields are `null` with `X-Analytics-Partial: true` response header. Both require per-security fundamentals data (market cap, P/B, P/E, momentum scores) that we don't ingest today.
**Current state:** Pro users see empty factor/style blocks with disclaimer via header. AI Service tool calls get nulls and skip the analysis in prompts.
**Trigger to revisit:** **Pro feature milestone (month 5-6 per roadmap).** Bundled with TASK_06 market-data workers — adding a fundamentals feed (Polygon Reference, Morningstar, or a factor-model provider like Axioma/MSCI) is the unblocker.
**Fix:** (a) Add `securities_fundamentals(symbol, market_cap, pb_ratio, pe_ratio, momentum_12m, quality_score, style_category, updated_at)` table. (b) Daily worker pulls from chosen provider. (c) Compute portfolio-level factor exposure = weighted sum of position factor scores. (d) Compute style_box = bucket each position by (style_category, market_cap_bucket), sum weights per cell.
**Owner:** backend lead + market-data lead
**Scope:** ~1 week — provider contract + schema + worker + compute + tests

---

### TD-031 — `withholding_tax` not captured per-transaction

**Added:** 2026-04-19 (TASK_04 PR B2c / PR #39)
**Source:** `apps/api/internal/domain/tax/report.go`. Tax report's `withholding_tax` field is `null` with `X-Withholding-Unavailable: true` response header. The `transactions` table has no `withholding_amount` column, so there's nowhere to store tax withheld at source on dividends (common for cross-border dividend payments — e.g. US-listed security held by non-US resident, 15-30% withheld per treaty).
**Current state:** DE/EU users holding US stocks see their dividends in gross terms in the tax report — not net of withholding. This understates realized cash but overstates taxable income. Legal exposure mitigated by `X-Tax-Advisory: mvp-estimate` header + UI disclaimer (pre-merge commit `ce23519`).
**Trigger to revisit:** (a) first broker integration that exposes per-dividend withholding (SnapTrade does surface this for some brokers); (b) first user complaint that their tax report doesn't match their 1099-DIV / annual Steuerbescheinigung.
**Fix:** Schema migration — `ALTER TABLE transactions ADD COLUMN withholding_amount NUMERIC(20,6), ADD COLUMN withholding_currency CHAR(3)`. Broker sync workers populate where available. Manual transaction entry UI adds optional "withholding" field for dividend type. Tax report replaces `null` with `SUM(withholding_amount)` for the year, removes `X-Withholding-Unavailable` header.
**Owner:** backend lead + market-data lead (for broker sync side)
**Scope:** ~4 hours — migration + sync update + handler + tests

---

### TD-030 — `/market/history` returns 501, no OHLC ingest pipeline

**Added:** 2026-04-19 (TASK_04 PR B2b / PR #38)
**Source:** `apps/api/internal/handlers/market.go` GET `/market/history?symbol=&asset_type=&period=&resolution=`. Validation layer fully implemented (period enum, resolution enum, symbol/asset_type required). Handler returns `501 NOT_IMPLEMENTED` because there is no `prices_ohlc` (or equivalent) table and no ingest worker.
**Current state:** UI cannot draw per-symbol candle/line history. AI Service tool calls needing symbol-level history (e.g. "how has AAPL moved over 1y") get 501 and must fall back to current-quote-only reasoning.
**Trigger to revisit:** TASK_06 market-data workers design, OR when TASK_07 Web first needs per-symbol history chart on position detail page. Whichever comes first.
**Fix:** Introduce `prices_ohlc(symbol, asset_type, resolution, ts, open, high, low, close, volume, source)` with composite PK `(symbol, asset_type, resolution, ts)`. Ingest: daily worker pulls Polygon (`/v2/aggs/ticker/.../range/...`) for stocks/ETFs, CoinGecko (`/coins/.../market_chart`) for crypto. Backfill on first symbol request (enqueue via TD-021 publisher). Handler swaps 501 for query against table.
**Owner:** market-data lead + backend lead
**Scope:** ~1.5 days — migration + Polygon/CoinGecko wrappers + worker + handler activation

---

### TD-029 — No symbol-master provider for `/market/search`

**Added:** 2026-04-19 (TASK_04 PR B2b / PR #38)
**Source:** `apps/api/internal/handlers/market.go` GET `/market/search?q=&asset_type=`. Handler returns empty `items: []` with `X-Search-Provider: unavailable` response header. No `symbols` master table, no Polygon Tickers endpoint wrapper.
**Current state:** UI "add transaction" flow cannot type-ahead search for symbols. Users must know the exact ticker. AI Service `/market/search` tool call returns empty.
**Trigger to revisit:** TASK_07 Web onboarding "add your first transaction" flow (user-facing blocker), OR TASK_06 market-data pipeline picks up symbol-master as part of Polygon integration.
**Fix:** Create `symbols(symbol, asset_type, name, exchange, currency, country, active, updated_at)` with trigram index on `name` and `symbol`. Daily worker refreshes from Polygon `/v3/reference/tickers` (stocks/ETFs) and CoinGecko `/coins/list` (crypto). Handler swaps empty-200 for `ILIKE '%q%' OR symbol ILIKE 'q%'` query with rank by (exact symbol match > prefix > contains). Remove `X-Search-Provider` header.
**Owner:** market-data lead + backend lead
**Scope:** ~1 day — migration + two provider wrappers + worker + handler + tests

---

### TD-028 — `best_month` / `worst_month` need monthly rollup table

**Added:** 2026-04-19 (TASK_04 PR B2b / PR #38)
**Source:** `apps/api/internal/handlers/portfolio.go` GET `/portfolio/performance`. Response includes `best_month` and `worst_month` (value + month label). Current implementation leaves these as `null` — computing them on every request requires scanning the full `portfolio_snapshots` table for the user and bucketing by month, too expensive for a hot read.
**Current state:** UI performance page shows `—` for both cells. AI Service tool calls see `null` and skip mentioning best/worst month in summaries.
**Trigger to revisit:** when TASK_07 Web performance page asks for these cells, OR when first daily-insights run wants "your worst month was February: -8.2%" as a framing device.
**Fix:** Create `portfolio_monthly_rollup(user_id, year_month, return_percent, value_start, value_end, updated_at)` with PK `(user_id, year_month)`. Daily worker computes last-closed-month on month-boundary + current-month running total. Handler reads from rollup, takes MAX and MIN return_percent over requested period.
**Owner:** backend lead
**Scope:** ~4 hours — migration + worker + handler update + test

---

### TD-027 — Clerk Backend SDK not yet wired (sessions, webhooks)

**Added:** 2026-04-19 (TASK_04 PR B2b / PR #38)
**Source:** `apps/api/internal/handlers/me.go` GET `/me/sessions` returns an empty list with `X-Clerk-Unavailable: true` response header. Handler has no Clerk Backend SDK client configured — session revocation and cross-device session listing require the SDK's `Sessions.List` + `Sessions.Revoke` endpoints. Same SDK instance will be needed for Clerk webhooks in PR B3 (user.created, user.updated, session.revoked).
**Current state:** UI account security page shows "no active sessions" even when user has multiple. Self-service device revoke is unavailable.
**Trigger to revisit:** **closes in PR B3** — webhooks require the SDK anyway, so we wire it once and hit both use cases. Alternatively sooner if user feedback demands session management before B3 ships.
**Fix:** Add `clerk-sdk-go/v2` dependency. Wire `clerk.NewClient(apiKey)` into `internal/clients/clerk/`. Update `/me/sessions` handler to call `SDK.Sessions.List(ctx, &clerk.ListSessionsParams{UserID: uid})` and map response. Remove `X-Clerk-Unavailable` header on success. In B3, reuse client for webhook signature verification + user lifecycle handlers.
**Owner:** backend lead
**Scope:** ~4 hours (most cost is B3 webhook work; `/me/sessions` is ~30 min after SDK is in)

---

### TD-024 — `prices.previous_close` and `change_24h` not modeled

**Added:** 2026-04-19 (TASK_04 PR B2a / PR #37)
**Source:** `apps/api/internal/handlers/market.go` GET `/market/quote`. Response schema includes `previous_close` and `change_24h_percent` fields, but `prices` table currently only stores current price + `as_of` timestamp. Handler returns `null` for both.
**Current state:** AI Service tool calls that read quote data see incomplete data — day-over-day change is visible on request-by-request basis but not historically trackable without a separate lookup. UI day-over-day change chips (`▲ +2.3%`) won't work.
**Trigger to revisit:** when first UI component needs day-over-day change display (TASK_07 scope), OR when AI insight logic wants to flag abnormal day moves.
**Fix:** Extend `update_prices` worker (TASK_06 scope) to snapshot current price as `previous_close` at market-close boundary (4pm ET for US equities, 00:00 UTC for crypto). Add index on `(symbol, asset_type, as_of DESC)` to support lookback queries. Handler joins both rows at read time.
**Owner:** backend lead (worker) + market-data lead (schema)
**Scope:** ~4 hours — schema migration + worker enhancement + handler join

---

### TD-023 — `total_count` always null in PaginatedEnvelope

**Added:** 2026-04-19 (TASK_04 PR B2a / PR #37) — not yet entered formally, recorded here for completeness
**Source:** openapi `PaginatedEnvelope` schema says `total_count` is populated "where count is cheap". All current list endpoints (`/transactions`, `/portfolio/dividends`) leave it `null` because filtered COUNT over large transactions table is not cheap.
**Current state:** No UI progress indicator is possible ("showing 50 of 847 transactions"). AI Service doesn't need it.
**Trigger to revisit:** first UI client asks for progress indicator, OR first tool call that needs total estimation for prompt context.
**Fix:** Add `SELECT COUNT(*) ... WHERE <same filter>` in parallel with the paginated query. Cache result in Redis (TTL 60s) keyed by filter hash. For `transactions`, watch query plan on large users (1000+ rows) — may need index hints.
**Owner:** backend lead
**Scope:** ~2 hours

---

### TD-022 — No `dividends` / `corporate_actions` table

**Added:** 2026-04-19 (TASK_04 PR B2a / PR #37)
**Source:** `apps/api/internal/handlers/dividends.go` GET `/portfolio/dividends`. Historical dividend feed is synthesized from `transactions` ledger (`transaction_type = 'dividend'`). Upcoming dividends (ex-date in future, pay-date in future) cannot be produced — they're not in the ledger.
**Current state:** Users see dividends they've _already received_. They don't see "upcoming: AAPL ex-div on 2026-05-10, expected payment 2026-05-15 of $4.40". AI insight `upcoming_dividend` (TASK_05) can fire only on transactions ledger, so it's effectively silent in MVP.
**Trigger to revisit:** when user feedback asks for dividend calendar, OR when a broker integration (SnapTrade, IBKR) can deliver upcoming dividend events for free.
**Fix:** Introduce `corporate_actions` table (type enum: dividend/split/spinoff/merger, payload jsonb, ex_date, pay_date/effective_date, record_date, source) populated by async worker from external source (Polygon corporate-actions endpoint or broker feed). Dividend-specific view on top. Update handler to UNION historical (transactions) + upcoming (corporate_actions where ex_date > today and user holds position).
**Owner:** backend lead + market-data lead
**Scope:** ~1 day — migration + worker + handler rewrite + AI insight unblock

---

### TD-021 — asynq publisher not wired into handlers

**Added:** 2026-04-19 (TASK_04 PR B2a / PR #37)
**Source:** `apps/api/internal/handlers/market.go` GET `/market/quote`. On cache miss + DB miss, handler returns 404 (`ErrQuoteNotAvailable`) but does _not_ enqueue a background fetch. Same gap will apply to any future "lazy-populate-on-demand" flow.
**Current state:** User requesting an exotic symbol gets 404 permanently. No self-healing — cache stays empty until some other path populates it.
**Trigger to revisit:** PR B3 (Core Backend mutations). Publisher will be wired for account-sync jobs anyway; extend it to cache-miss paths in the same commit.
**Fix:** Wire `deps.AsynqClient` into handler Deps. In `/market/quote` 404 path, call `Enqueue(ctx, asynq.NewTask("fetch_quote", payload))` before returning error. Worker consumer lives in TASK_06 scope.
**Owner:** backend lead
**Scope:** ~30 min once publisher is wired in B3

---

### TD-020 — Benchmark prices ingest missing

**Added:** 2026-04-19 (TASK_04 PR B2a / PR #37)
**Source:** `apps/api/internal/handlers/performance.go` GET `/portfolio/performance`. `benchmark_return_percent` and `alpha_percent` fields are nullable (openapi fixed pre-merge in PR #37 commit 13) and handler returns `null` with `X-Benchmark-Unavailable: true` response header. No `benchmark_prices` table exists and no ingest job populates benchmark (SPX, NDX) historical data.
**Current state:** UI cannot draw "portfolio vs S&P 500" comparison. AI `performance_anomaly` insight (TASK_05) has no benchmark baseline — falls back to "5pp vs SPX" heuristic that compares against empty data, so insight is effectively disabled.
**Trigger to revisit:** TASK_07 Web adds performance comparison chart, OR TASK_06 sets up market-data ingest pipeline and benchmark historical is a 15-min add-on.
**Fix:** Create `benchmark_prices(symbol, date, close, currency)` table with daily resolution. Seed with 5-year SPX + NDX historicals from Polygon (one-off job). Add daily worker to append new close at market-close boundary. Update handler to join benchmark_prices on period boundary dates, compute return % and alpha.
**Owner:** market-data lead
**Scope:** ~1 day — migration + seed job + daily worker + handler join

---

### TD-019 — Integration tests not executed in CI

**Added:** 2026-04-19 (TASK_04 PR B1 / PR #36)
**Source:** `apps/api/internal/handlers/*_integration_test.go` guarded by `//go:build integration`. Tests run locally via `go test -tags integration ./...` with `docker compose up -d` for Postgres + Redis, but the GitHub Actions workflow never passes `-tags integration`, so the entire testcontainers matrix is skipped in CI.
**Current state:** Green CI on Core API PRs is misleading — only unit tests + lint run. Integration coverage exists but has to be run manually. PR B1's 5 scenarios (happy path, Clerk JWT rejection on internal path, token mismatch, user_id/X-User-Id mismatch, duplicate delivery) pass locally but wouldn't catch a regression merged by someone who skipped local run.
**Trigger to revisit:** (a) before first prod deploy (PR C timeframe), OR (b) when PR B3 adds Stripe/Clerk webhook handlers — those add a third external service (webhook signing) and polyglot testcontainers setup gets complex enough that "just run locally" breaks down. Whichever comes first.
**Fix:** Add a GitHub Actions job `integration-tests` with Docker service + Postgres service + Redis service (`services:` block in workflow YAML), runs `go test -tags integration -timeout 5m ./...`. Self-hosted runner optional — `ubuntu-latest` supports docker services natively. Consider matrix for `go-version` + `postgres-version` if resources allow.
**Owner:** backend lead
**Scope:** ~3 hours (workflow YAML + caching tuning + first green run on a representative PR)

---

### TD-018 — KEK rotation path has no test

**Added:** 2026-04-19 (TASK_04 PR A / PR #35)
**Source:** `apps/api/internal/crypto/envelope.go`. `KekIDCurrent = "v1"` is hardcoded in config; envelope encrypts with the current KEK and stores `kek_id` on each record. Decryption path reads `kek_id` and picks the correct KEK, but there's no test that exercises two KEKs coexisting (encrypt under `v1`, introduce `v2`, confirm old ciphertexts still decrypt, new writes go to `v2`).
**Current state:** DEK randomness is covered (`TestEnvelope_DifferentCiphertextsEachTime`). Multi-KEK scenario is unimplemented in test fixtures — if we ever rotate KEK in prod without the test, we'll find regressions late.
**Trigger to revisit:** before first KEK rotation in any environment (staging or prod), OR before SOC 2 / pentest where crypto key lifecycle is audited.
**Fix:** table-driven test in `envelope_test.go` with a two-KEK keyring (`v1`, `v2`), verifying: (a) encrypt under v1, decrypt OK after adding v2 to keyring; (b) flip current → v2, new writes stamped `kek_id=v2`; (c) mixed batch decrypts correctly; (d) removing `v1` from keyring fails decryption for `v1`-tagged rows with a clear error.
**Owner:** backend lead
**Scope:** ~2 hours

---

### TD-017 — LLM JSON parsing is best-effort

**Added:** 2026-04-19 (TASK_05 PR #34)
**Source:** `apps/ai/src/ai_service/agents/insight_generator.py` and `behavioral_coach.py` strip ` ```json ` code fences and call `json.loads` on Claude's output to get structured `Insight` / `BehavioralPattern` objects.
**Current state:** Works in practice because prompts demand strict JSON shape; failures are rare and handled with a retry + log-and-skip fallback. But there's no schema enforcement at the LLM level — malformed JSON or hallucinated fields surface as runtime errors.
**Trigger to revisit:** Anthropic ships structured outputs for Messages API (native JSON schema enforcement), OR we hit a production incident where a malformed insight breaks the UI.
**Fix:** Migrate to structured outputs API when available; until then, add Pydantic post-validation with a retry-once loop on validation failure.
**Owner:** AI service lead
**Scope:** ~2 hours once structured outputs ships upstream

---

### TD-016 — Anthropic SDK mocks use SimpleNamespace

**Added:** 2026-04-19 (TASK_05 PR #34)
**Source:** Integration tests in `apps/ai/tests/integration/` mock the Anthropic SDK by monkey-patching `AsyncAnthropic.messages.stream` / `.create` with scripted events built from `types.SimpleNamespace`. Works because we `isinstance` check against `ToolUseBlock` / `TextBlock` directly from the SDK, and SimpleNamespace covers the rest via duck typing.
**Current state:** Tests pass reliably today. Fragile to SDK wire-type changes — a rename of an event attribute or a new required field will break mocks silently.
**Trigger to revisit:** First time an Anthropic SDK bump breaks the integration test suite.
**Fix:** Migrate mocks to `anthropic.types.Raw*Event` classes (construct real event objects, not lookalikes).
**Owner:** AI service lead
**Scope:** ~2 hours; purely test-code refactor

---

### TD-015 — Anthropic rate limit is in-memory (per-process)

**Added:** 2026-04-19 (TASK_05 PR #34)
**Source:** `apps/ai/src/ai_service/llm/client.py` uses `asyncio.Semaphore(ANTHROPIC_MAX_CONCURRENT)` (default 10) to cap concurrent calls to Anthropic.
**Current state:** Correct for single-replica Fly.io deployment. A second replica would bypass the cap (two replicas × 10 = 20 concurrent calls to Anthropic, potentially tripping their org-level limit).
**Trigger to revisit:** when we add a second AI Service replica (auto-scale or manual), OR when Anthropic org-level 429s appear in logs.
**Fix:** Redis-backed token bucket at key `anthropic:bucket:{model}` with model-specific refill rates; client blocks on bucket before making the API call.
**Owner:** AI service lead
**Scope:** 1-2 hours (redis-py already a transitive dep once we add cache layer)

---

### TD-014 — `allocation_drift` insight uses MVP proxy, not real baseline

**Added:** 2026-04-19 (TASK_05 PR #34)
**Source:** `apps/ai/src/ai_service/agents/insight_generator.py` flags allocation drift when any single asset class exceeds 60% of portfolio value. True drift requires a baseline allocation from N days ago compared to current.
**Current state:** Proxy catches the egregious cases (user is 70%+ in stocks) but misses subtler drift (target 60/40 slowly becoming 70/30). False negatives, not false positives — insight is conservative.
**Trigger to revisit:** when Core API exposes a snapshot-by-date query (`/portfolio/snapshots?date=X` or similar) so AI Service can compare "today vs 30 days ago".
**Fix:** Query Core API for historical snapshot → compute allocation delta → threshold on meaningful drift (e.g., any class ±5pp from baseline). Replace proxy check.
**Owner:** AI service lead + backend lead (for the endpoint)
**Scope:** 2-3 hours once the endpoint exists

---

### TD-013 — `record_ai_usage` is a stub pending Core API endpoint

**Added:** 2026-04-19 (TASK_05 PR #34)
**Source:** `apps/ai/src/ai_service/clients/core_api.py::record_ai_usage` writes a structured log line + PostHog event. The intended target — `POST /internal/ai/usage` on Core API — doesn't exist yet (scheduled for TASK_04 PR B per DECISIONS 2026-04-19 "AI usage telemetry via dedicated internal endpoint").
**Current state:** Body shape in the stub already matches the final contract: `{user_id, conversation_id, input_tokens, output_tokens, cost_usd, model}`. When Core API ships the endpoint, the swap is a single-line change (replace log emit with `await self._post("/internal/ai/usage", body)`).
**Trigger to revisit:** when Core API PR B merges and the endpoint is live.
**Fix:** Replace stub body with actual HTTP POST; add retry-with-backoff (usage data is important but not critical-path).
**Owner:** AI service lead
**Scope:** 30 minutes

---

### TD-011 — Idempotency middleware doesn't block concurrent duplicates

**Added:** 2026-04-19 (TASK_04 PR A)
**Source:** `apps/api/internal/middleware/idempotency.go`. Two simultaneous POSTs with the same `Idempotency-Key` both reach the handler before either writes to Redis; whichever writes second wins (overwrites the cached response).
**Current state:** For endpoints where duplicates are destructive, domain-level dedup catches the case: `POST /transactions` is protected by a unique index on `fingerprint` (DB layer blocks the dupe regardless of idempotency). `POST /exports` is content-addressable (generating twice is idempotent by nature). For remaining mutating endpoints the risk is hypothetical — no known scenario where the same client fires the same key twice in parallel.
**Trigger to revisit:** first production duplicate-write incident on a mutating endpoint without domain-level dedup, OR pre-public-launch audit of all POST/PATCH/DELETE endpoints.
**Fix:** `SETNX idem:{user_id}:{sha256(key)}:lock` with a short TTL before executing handler. Second request SETNX fails → short retry loop polling the cache → serve cached response once first completes.
**Owner:** backend lead
**Scope:** ~1 hour

---

### TD-009 — Trivy SARIF upload step fails on main CI

**Added:** 2026-04-19 (wave 1 QA)
**Source:** `Upload Trivy results to GitHub Security` step fails with permissions/GHAS-related error; job itself runs and scans successfully, only the SARIF upload to Code Scanning fails
**Current state:** every main run shows as "failure" even though all functional jobs are green; misleading red signal
**Options:**
1. Enable GitHub Advanced Security on the repo (free for public repos; paid for private — check current plan)
2. Remove `upload: true` from the trivy-action step; keep the scan, skip Code Scanning integration
3. Make the upload step `continue-on-error: true` and surface results differently
**Trigger to revisit:** before any public launch (misleading CI badge), or before onboarding a security-minded contributor
**Owner:** project lead
**Scope:** 5-minute workflow edit + verify green run — ~30 min total

---

### TD-010 — Design brief uses "slate" naming; tokens use "neutral"

**Added:** 2026-04-19 (wave 1 wrap-up)
**Source:** `04_DESIGN_BRIEF.md` §3.1 describes the neutral scale as "Slate" with `slate-*` Tailwind names and hex values; the actual design-tokens primitives are named `color.neutral.*` (generic) with slate hexes inside
**Current state:** hex values match; only names diverge. No functional impact.
**Fix:** rewrite §3.1 / §3.5 in `04_DESIGN_BRIEF.md` to use `neutral.*` token names; keep "slate" only as a note about hex origin ("values sourced from Tailwind's slate palette")
**Trigger to revisit:** bundled with the first docs-update PR after wave 2 kickoff
**Owner:** design lead
**Scope:** 10-minute edit to the brief — zero code impact

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

### TD-R001 — `@investment-tracker/design-tokens` subpath exports missing types

**Resolved:** 2026-04-19 in PR #32 commit 2 (`fix(tokens): add types to subpath exports + build on typecheck`)
**Was:** `exports["./brand"]` defined as plain string (JS only), so TypeScript couldn't resolve types; fresh CI checkouts without build artifacts failed `tsc` with TS2307
**Fix:** rewrote `exports` map with `{ types, default }` objects for all JS subpaths; `typecheck` script now triggers `node build.js` to guarantee artifacts; `prepare` hook runs `pnpm install` so tokens are auto-built

### TD-R002 — Port `:8080` conflict with system java.exe on Windows dev

**Resolved:** 2026-04-19 in TASK_01 follow-up
**Was:** API default listen addr `:8080` collided with a pre-existing Java process on the dev's machine
**Fix:** made `API_LISTEN_ADDR` configurable via env, default documented as `:8090` in `.env.example`

---

## Process

- Log it here **when** you decide to defer, not weeks later
- Include the reason, the workaround, and the trigger to revisit
- Quarterly: project lead reviews active items, closes stale ones, promotes blockers
- When resolving: move to Resolved section with PR/commit reference, keep the entry (history value)
