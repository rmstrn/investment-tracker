# Runbook — Deploy Core API

Ops reference for deploying `apps/api` to Fly.io. Scope covers the
three ways a change reaches prod (standard CD, emergency hotfix,
manual dispatch), plus everything you need to debug when it goes
sideways. Separate runbook for the AI Service (`RUNBOOK_ai_flip.md`)
and for workers (lands with PR D).

**Last updated:** 2026-04-20 (PR C — initial deploy infrastructure).

---

## Prerequisites (one-time PO setup)

Nothing below will work until every item in this list is true. PR C
only ships the code + CI — provisioning the platform-side knobs is
a post-merge PO action.

### Doppler

- Project `investment-tracker-api` exists.
- Configs:
  - `dev` — local development placeholders.
  - `stg` — staging values.
  - `prd` — production values.
- Each config carries every key marked `required:` in
  `ops/secrets.keys.yaml`. `optional:` keys may be blank.

### Fly.io

- App `investment-tracker-api` created (`fly apps create investment-tracker-api --org <org>`).
- App `investment-tracker-api-staging` created (same org).
- Both apps live in `fra` primary region.
- Volumes — none required at MVP (state lives in Neon + Upstash).

### GitHub

- Repo secrets:
  - `FLY_API_TOKEN` — org-scoped or app-scoped to both Fly apps.
  - `DOPPLER_TOKEN_STG` — read-only on the `stg` config.
  - `DOPPLER_TOKEN_PRD` — read-only on the `prd` config.
  - `STAGING_TEST_USER_TOKEN` — Clerk session JWT from
    `tools/k6/seed-user.sh` against the staging Clerk instance.
  - `PROD_TEST_USER_TOKEN` — same, against the prod Clerk instance.
- Environments:
  - `staging` — no protection rules.
  - `production` — at least 1 required reviewer (the PO account).

### DNS

- `api-staging.investment-tracker.app` → Fly `investment-tracker-api-staging`.
- `api.investment-tracker.app` → Fly `investment-tracker-api`.
- Fly auto-provisions Let's Encrypt certificates once DNS resolves.
  Add the record *after* the first successful deploy so the app
  exists to be bound to.

### Secrets population

After Doppler is populated but before the first deploy, fire
`doppler-sync.yml` with `target: api` — this pipes Doppler → Fly for
each config. The deploy pipeline's `verify-prod-secrets` step will
then pass; attempting to deploy earlier will fail at that gate with
a list of missing keys.

---

## 1. Standard deploy flow

Triggered by a push to `main` that touches `apps/api/**`,
`tools/k6/**`, or `.github/workflows/deploy-api.yml`. The `deploy-api`
workflow in GitHub Actions runs automatically.

Pipeline order:

1. **verify-staging-secrets** — `ops/scripts/verify-prod-secrets.sh`
   diffs the staging Fly app against `ops/secrets.keys.yaml`. Missing
   required keys fail here.
2. **deploy-staging** — `flyctl deploy --config apps/api/fly.staging.toml`.
   Fly's release_command (`/app/api migrate up`) advances the staging
   DB; if migrations fail, staging is not updated.
3. **smoke-staging** — `tools/k6/run-smoke.sh` hits
   `https://api-staging.investment-tracker.app`. All five scenarios
   must pass.
4. **verify-prod-secrets** — same diff as step 1 but against the prod
   Fly app.
5. **deploy-prod** — waits for manual approval via the `production`
   GitHub Environment. Once approved, `flyctl deploy --config apps/api/fly.toml`
   rolls prod.
6. **smoke-prod** — non-blocking run of the k6 suite against prod.
   A failure here turns the workflow red and is a pager event; it
   does *not* roll the deploy back automatically (see § 4).
7. **tag-release** — pushes an `api-v0.0.<run_number>` git tag and a
   GitHub Release with auto-generated changelog.

Typical elapsed time: 6-10 min, almost all of it in `deploy-staging`
+ `smoke-staging`. `deploy-prod` is gated on the manual approval —
budget a few minutes for the reviewer to click.

---

## 2. Emergency hotfix flow

When something is on fire in prod and the standard staging gate
makes it worse, not better:

1. Push the fix to `main` through a PR (squash-only policy applies
   even under pressure).
2. In the Actions tab, run `deploy-api` with `workflow_dispatch` and
   set `skip_staging_smoke: true`. The `deploy-staging` step still
   runs — only the k6 gate is skipped.
3. Approve the `production` environment.
4. Watch `smoke-prod`; if it fails, go to § 4.

Do **not** bypass `deploy-staging` entirely. Staging is the first
sanity check that the new image actually boots — skipping it trades
a 2-minute delay for the chance of pushing a binary that crashes on
startup to every prod machine.

---

## 3. Rollback procedure

`flyctl` tracks every deploy release with a monotonic `version`. To
roll back:

```bash
fly releases list --app investment-tracker-api
# identify the last known-good version (e.g. v42)

fly releases rollback v42 --app investment-tracker-api
```

Rollback triggers the same rolling swap as a forward deploy, so it
is zero-downtime. If the rollback image still fails `/health`,
machines bounce and the LB routes to the remaining healthy ones until
2/2 are back. Watch `fly logs --app investment-tracker-api` through
the bounce.

**Migrations caveat.** If the bad deploy ran a migration, that
migration is not automatically reversed by the rollback. If the old
image is compatible with the new schema (forward-compatible by design,
which is our standard), do nothing. If it is not, roll the schema
back separately (`goose down` in a one-shot machine) — coordinate
with the team because data loss is on the table.

---

## 4. Debugging a bad deploy

### Live logs

```bash
fly logs --app investment-tracker-api
# filter by instance:
fly logs --app investment-tracker-api -i <machine-id>
```

### SSH into a running machine

```bash
fly ssh console --app investment-tracker-api
# distroless-less alpine base — full shell available.
```

### Correlate with Sentry

Every request emits an `X-Request-Id` header (set by
`internal/middleware/RequestID`). Sentry's `request_id` tag holds the
same value — paste from a failed k6 run or client error into Sentry
search.

### Common failure modes

| Symptom | Likely cause | Fix |
|---|---|---|
| release_command timeout | `migrate up` hit a slow backfill | Split migration into index+backfill pair, run backfill out-of-band |
| /health 503 on staging only | missing Doppler secret | `doppler secrets get --project investment-tracker-api --config stg` to confirm |
| SSE stream drops mid-response | rolling deploy mid-stream | Expected; client reconnects. If user reports persistent, check TD-064 |
| 502 from LB | machine failed `/health` grace_period | Scale up temp, investigate startup logs |
| Prom metrics missing | `/metrics` not registered | Already regression-proofed in PR C; check `server.go:49-57` if it recurs |

---

## 5. Secrets rotation

All rotation flows through Doppler — never `fly secrets set`
directly, because direct sets diverge from the manifest and
verify-prod-secrets.sh will not catch them at deploy time.

### Standard key (Clerk, Stripe, Polygon, SnapTrade)

1. Generate the new value at the provider.
2. Update the corresponding Doppler config.
3. Run `doppler-sync.yml` with `target: api`.
4. Next deploy asserts presence; if no deploy is pending, force one
   via `workflow_dispatch` with `skip_staging_smoke: false`.

### ENCRYPTION_KEK (KEK rotation)

Rotating the KEK is the only rotation that touches DB data. Current
design uses a single active KEK (`ENCRYPTION_KEK`). A future move to
versioned KEKs (`KEK_MASTER_V1/V2` + `KEK_PRIMARY_ID`) is tracked as
TD-060. Until then:

1. Do not rotate KEK in place on prod. Credentials encrypted under
   the old KEK will become unreadable.
2. If compromised, the procedure is: drain all encrypted credentials
   (accounts table `credentials_encrypted`), re-issue broker OAuth
   flows, then rotate. This is disruptive — coordinate with the
   team before executing.

### Core internal tokens (`CORE_API_INTERNAL_TOKEN`, `AI_SERVICE_TOKEN`)

These are shared between Core API and AI Service. Rotate in lockstep:

1. Generate new value: `openssl rand -base64 48`.
2. Update both the `investment-tracker-api` and
   `investment-tracker-ai` Doppler configs in one change set.
3. Sync both via `doppler-sync.yml` with `target: all`.
4. Both services pick up the new token on their next deploy. No dual-
   acceptance window at MVP — a brief 401 flurry during the overlap is
   acceptable; real dual-acceptance is a future TD.

---

## 6. Scaling

### Horizontal (more machines)

```bash
# Prod: start from 2, bump when traffic justifies.
fly scale count 4 --app investment-tracker-api
```

Budget around P95 CPU > 60% or P95 latency > 500ms as the trigger.
Fly's autoscaler is off by default (deterministic capacity wins over
reactive for MVP) — revisit when traffic is loud enough that manual
scaling misses a window.

### Vertical (bigger VM)

```bash
fly scale vm shared-cpu-2x --memory 1024 --app investment-tracker-api
```

Memory bumps come first if `/metrics` shows `go_memstats_alloc_bytes`
climbing and GC pauses spike. CPU bumps second. Don't upsize VM
instead of horizontal — two machines are cheaper and safer than one
large one.

### Staging

Staging uses `auto_stop_machines = suspend` and `min_machines_running = 1`
— scale knobs generally do not need tuning. If smoke runs are eating
enough traffic to keep staging warm 24/7, push back on smoke
frequency before scaling.

---

## 7. DB migration considerations

Migrations live in `apps/api/db/migrations/` (goose format) and ship
baked into the container at `/app/db/migrations`. The
`release_command` in each fly.toml invokes `/app/api migrate up`
before the rolling swap.

Rules of thumb:

- **Forward-only only.** No `goose down` on prod via release_command.
  `down` is a manual-only path invoked from a one-shot `fly machine
  run`.
- **Backward-compatible only.** Old code must still run against the
  new schema during the rolling deploy (one machine old, one new).
  Destructive column drops happen in a follow-up deploy after all
  code paths stopped referencing the column.
- **Expensive backfills get their own PR.** A migration that scans
  50M rows will blow past Fly's 5-minute release_command ceiling.
  Pattern: ship the schema change (fast DDL), then run the backfill
  from a scheduled one-shot machine (`fly machine run ./api custom-backfill`)
  with progress logging. Squash into follow-up commits; PR C does not
  ship backfill machinery.
- **Always test on staging first.** Staging DB must walk the same
  goose ladder as prod; if a migration misbehaves, the staging
  release_command fails and the whole deploy aborts before prod sees
  it.

---

## 8. Observability checklist post-deploy

Things to glance at after every prod deploy:

- **Fly dashboard → Metrics** — latency + error rate on the LB.
- **Sentry → Issues** — new errors tagged `env:production` in the
  last 10 minutes.
- **`X-Async-Unavailable` header** — should be present on responses
  from endpoints that would enqueue an asynq task. `asynqpub.Enabled()`
  returns `false` in prod until PR D; if the header goes missing
  before then, the publisher is reporting enabled state without a
  backing worker and the UI's graceful-degradation path is broken.
- **smoke-prod job** — one run per deploy; failures are pager
  events.

---

## Out of scope (tracked TDs)

| TD | What's deferred | When to revisit |
|---|---|---|
| TD-060 | KMS-managed KEK (vs env-based) | First enterprise/GDPR conversation |
| TD-061 | Multi-region deploy | ~1k paying users |
| TD-062 | APM / trace correlation (OTel → Tempo) | Alongside AI Service flip |
| TD-063 | Per-tenant rate limits | Before first enterprise customer |
| TD-064 | Blue-green deploys (vs rolling) | Only if rolling causes an SSE incident |
| TD-066 | Restore `workers` deploy target | PR D (real asynq consumer) |
| TD-067 | deploy-web.yml / deploy-ai.yml pipeline consistency | Post-first-prod-deploy |
