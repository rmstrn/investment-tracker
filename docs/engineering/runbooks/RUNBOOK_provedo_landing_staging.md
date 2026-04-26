# Runbook — Provedo Landing Staging Deploy

**Slice:** Slice-LP1 (Provedo first-pass landing)
**Target:** `https://staging.investment-tracker.app`
**Last updated:** 2026-04-25
**Owner:** devops-engineer

---

## Platform identification

**Platform:** Vercel
**Config file:** `apps/web/.vercel/project.json`
  - `projectId`: `prj_8TbIm2CjE0aUu5zgOI1Iv0gmv5jw`
  - `orgId`: `team_XHZrEZI4dWarNMJzedf1asyP`
  - `projectName`: `investment-tracker-web`

**DNS:** `staging.investment-tracker.app` → Vercel DNS alias `9227dc148bf1ccc6.vercel-dns-017.com` (CNAME confirmed via nslookup).

**Note on Bootstrap doc discrepancy:** `docs/PO_HANDOFF.md` bootstrap says Railway; `TEAM_ROSTER` says Fly.io for backend (Go API + Python AI). Web frontend is on **Vercel** — confirmed by `.vercel/project.json` and live 200 response from staging with `Server: Vercel` header. Backend (Core API, AI Service) is on Fly.io. No discrepancy — different services use different platforms.

---

## Current staging state (verified 2026-04-25)

```
HTTP/1.1 200 OK
Server: Vercel
X-Clerk-Auth-Status: signed-out
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=63072000
```

**Existing content:** Investment Tracker (Provedo-era) marketing landing — title "Investment Tracker — AI-native portfolio tracker", hero "What you actually own. Why it moved. What to do next."

**No noindex meta tag** present currently. Frontend-engineer adds `<meta name="robots" content="noindex,nofollow">` in Provedo landing build per kickoff §6. This is a **page-level meta tag** in `page.tsx`, NOT an HTTP header — confirmed correct approach for Next.js App Router staging.

**Clerk runtime:** Active on staging. `pk_test_cmVzb2x2ZWQtbW9sbHktNTkuY2xlcmsuYWNjb3VudHMuZGV2JA` visible in response. Frontend-engineer strips `await auth()` from marketing route per kickoff (TD-092).

---

## Deploy trigger

**Current state:** `deploy-web.yml` is `workflow_dispatch` only — **manual trigger, NOT auto on push to main.**

The workflow comment reads: "Disabled by default. Flip to `push: [main]` once VERCEL_* secrets are set."

**GitHub Secrets status (verified):**
- `VERCEL_TOKEN` — **NOT present** in repo secrets (only `CLERK_SECRET_KEY_STG`, `DOPPLER_TOKEN_STG`, `FLY_API_TOKEN`, `STAGING_TEST_SESSION_ID`, `STAGING_TEST_USER_TOKEN` are set).
- `VERCEL_ORG_ID` — NOT present.
- `VERCEL_PROJECT_ID` — NOT present.

**Implication:** `deploy-web.yml` will fail if triggered via GitHub Actions — Vercel secrets missing. **Current deploys to staging.investment-tracker.app are manual Vercel deploys** (either via Vercel CLI or Vercel dashboard Git integration directly).

**Vercel Git integration likely active** given staging is live and project.json exists. Vercel may be auto-deploying on push to `main` via its own Git integration (bypassing GitHub Actions `deploy-web.yml`). This is the most likely reason staging is functional without GitHub Actions secrets.

---

## Pre-merge actions needed for Provedo landing

1. **No action needed on infra** — Vercel Git integration auto-deploys when frontend-engineer merges `feat/lp-provedo-first-pass` to `main`.
2. **Verify Vercel Git integration is active:** PO or devops confirms in Vercel dashboard that project `investment-tracker-web` has GitHub integration with auto-deploy on `main` branch. If disabled → use manual trigger (see §Manual deploy below).
3. **No env vars needed for landing** — static route, no backend calls, Clerk stripped per kickoff.

---

## Deploy sequence (post-merge)

### Standard path (Vercel Git integration active)

```
1. frontend-engineer opens PR feat/lp-provedo-first-pass
2. GitHub Actions CI (ci.yml) runs all 8 jobs — must be green before merge
3. frontend-engineer requests review + merge to main
4. Vercel auto-deploys from main (typically <2 minutes)
5. devops-engineer runs smoke tests (see §Smoke tests)
6. Notify Navigator: "Slice-LP1 deployed to staging, SHA <hash>, smoke passed"
```

### Fallback: manual deploy via Vercel CLI

If auto-deploy not confirmed:

```bash
# Prereq: PO provides VERCEL_TOKEN or grants devops team access

cd D:\investment-tracker\apps\web

# Deploy to Vercel preview (staging-equivalent)
pnpm exec vercel --token=$VERCEL_TOKEN

# Or deploy to production alias (staging.investment-tracker.app)
# Note: requires VERCEL_ORG_ID + VERCEL_PROJECT_ID from project.json
pnpm exec vercel --prod --token=$VERCEL_TOKEN
```

### Fallback: enable GitHub Actions deploy-web.yml

Requires PO to add three GitHub secrets:
- `VERCEL_TOKEN` — from Vercel dashboard → Account Settings → Tokens
- `VERCEL_ORG_ID` — `team_XHZrEZI4dWarNMJzedf1asyP` (from `apps/web/.vercel/project.json`)
- `VERCEL_PROJECT_ID` — `prj_8TbIm2CjE0aUu5zgOI1Iv0gmv5jw` (from same file)

Then trigger:
```
Actions → Deploy — web (Vercel) → Run workflow → environment: preview
```

---

## Smoke test commands (post-deploy)

Run after Vercel shows deployment complete:

```bash
# 1. HTTP 200 + HTTPS
curl -s -o /dev/null -w "%{http_code}" --max-time 10 https://staging.investment-tracker.app/
# Expected: 200

# 2. Provedo brand in page
curl -s --max-time 10 https://staging.investment-tracker.app/ | grep -i "provedo"
# Expected: "Provedo" appears in title, hero headline, header

# 3. noindex meta tag (frontend-engineer adds this in landing build)
curl -s --max-time 10 https://staging.investment-tracker.app/ | grep -i "noindex"
# Expected: <meta name="robots" content="noindex,nofollow">

# 4. HTTP → HTTPS redirect
curl -s -o /dev/null -w "%{http_code} %{redirect_url}" --max-time 10 http://staging.investment-tracker.app/
# Expected: 301 https://staging.investment-tracker.app/

# 5. No Clerk auth() errors in page (X-Clerk-Auth-Reason should be absent or non-error)
curl -s -I --max-time 10 https://staging.investment-tracker.app/ | grep -i "clerk"
# Expected: X-Clerk-Auth-Status: signed-out (OK — no auth error)

# 6. Lighthouse (if CLI installed)
lighthouse https://staging.investment-tracker.app/ \
  --only-categories=performance,accessibility \
  --output=json --quiet 2>&1 | \
  python3 -c "import json,sys; d=json.load(sys.stdin); print('LCP:', d['audits']['largest-contentful-paint']['displayValue'], '| A11y:', d['categories']['accessibility']['score'])"
# Targets: LCP <2.5s, A11y score ≥0.95
```

---

## Rollback procedure

**Scenario: Provedo landing breaks existing staging app routes (e.g., /dashboard, /sign-in)**

1. **Vercel dashboard rollback (fastest, <2 min):**
   - Go to vercel.com → Project `investment-tracker-web` → Deployments
   - Find previous deployment (pre-Provedo-PR SHA)
   - Click "..." → "Promote to Production"
   - Verify staging.investment-tracker.app reverts

2. **Git revert (if Vercel Git integration active):**
   ```bash
   git revert <merge-commit-sha>
   git push origin main
   # Vercel auto-deploys the revert
   ```

3. **Scope of rollback risk:** LOW. Provedo landing only modifies `apps/web/src/app/(marketing)/` route and its layout. All `(app)/*`, `(auth)/*` routes are untouched per kickoff §out-of-scope. Rollback only needed if marketing route change breaks shared layout.

---

## Known issues / pre-merge checks

### Issue 1 — Vercel Git integration vs. GitHub Actions (CONFIRM before merge)

Staging is live but `VERCEL_TOKEN` is not in GitHub secrets, meaning `deploy-web.yml` cannot run. Either:
- **(A)** Vercel Git integration is auto-deploying on push to main (most likely) — confirm in Vercel dashboard.
- **(B)** Previous deploys were manual CLI — someone with Vercel access deployed manually.

**Action before merge:** PO or devops confirms via Vercel dashboard which deploy triggered the current live deployment. If Git integration is active → no action needed. If not → set up before frontend PR merges.

### Issue 2 — No noindex on current staging (acceptable for now)

Current Investment Tracker landing on staging has no noindex. Provedo landing adds noindex per kickoff §6. This is correct staging hygiene but is frontend-engineer's responsibility to implement.

### Issue 3 — Vercel environment naming

`deploy-web.yml` uses `preview` and `production` as Vercel environment options, but `staging.investment-tracker.app` maps to Vercel's production alias (not preview). Triggering `production` environment in the workflow requires PO to add a required reviewer on the GitHub `production` environment. For Slice-LP1, direct Vercel Git integration deploy bypasses this gate — acceptable for first-pass.

---

## TD entries

| TD | Description | Priority | Trigger |
|---|---|---|---|
| TD-092 | Restore Clerk `await auth()` + `/dashboard` redirect в `(marketing)/page.tsx` — stripped for Slice-LP1 Clerk-free staging | P3 | provedo.ai production migration slice |
| TD-093 | Enable `deploy-web.yml` auto-trigger on `push: [main]` — add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` to GitHub Secrets for CI-driven deploys. Currently staging deploys via Vercel Git integration only (bypasses GitHub Actions). | P2 | Before first production web deploy or when CI-only deploy policy enforced |
| TD-094 | Add `robots.txt` at Next.js route level for staging env — currently noindex relies on page-level meta only; HTTP header `X-Robots-Tag: noindex` not set by Vercel for staging domain. Low-risk for first-pass (staging not promoted). | P3 | Before staging becomes publicly accessible URL |

---

## Files changed

- `docs/RUNBOOK_provedo_landing_staging.md` — this file (created)
