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

## 2026-04-20 — `ai_usage` ledger: Core API is single-writer

**Decision:** записи в `ai_usage` table делает **только Core API**, синхронно,
в той же DB transaction что и INSERT последнего assistant message в
`ai_messages` (после SSE `message_stop` frame). AI Service (Python)
**не пишет** в `ai_usage` через RPC к Core API.

**Context:**
- TASK_05 § 7 исходно показывал `await core_api.record_ai_usage(...)` из
  Python — AI Service делал RPC после Anthropic response.
- TASK_04 B3-ii-b plan (2026-04-20) закладывает Core API synchronous
  DB write после `message_stop` в `/ai/chat/stream` handler.
- Если оба пишут — дубликаты в ledger, биллинг завышен x2, audit broken.

**Почему Core API owner:**
1. Core API уже владеет остальными usage counters (`usage_counters` table
   для daily rate-limit cap). Single service owns all billing/usage writes.
2. Core API имеет атомарный DB transaction вокруг message persist +
   ai_usage insert — если transaction упадёт, всё откатится.
3. AI Service был owner только потому что ему «удобнее» — слабый аргумент
   против consistency риска.
4. Когда в будущем появится billing reconciliation job, он смотрит в одно
   место.

**Consequences:**
- AI Service `record_ai_usage` вызов + HTTP client method **удаляются**
  в отдельной TASK_05 cleanup PR (~50-150 LOC).
- TASK_05 cleanup PR **блокирует merge** B3-ii-b (Core API write path
  для chat). B3-ii-a можно мержить независимо.
- AI Service всё ещё возвращает usage данные (input_tokens, output_tokens,
  model) в SSE `message_stop` payload — Core API извлекает их оттуда
  для INSERT в `ai_usage`.

**Owner:** backend lead (Core API) + AI lead (Python removal).
**Revisit:** при next billing schema change (e.g. multi-model pricing,
partial turn billing). Не ранее MVP launch.
