# Backend Audit — 2026-04-22

**Scope:** post-Sprint-C health check before Slice 6a (/insights UI)
or other new work. Confirms Sprint C commits are present, build +
test baseline is clean, docs are current, and nothing rotted during
the PO's OneDrive-sync recovery.

**Baseline commit:** `9040d42 test: silence bodyclose on StreamChat
upstream (ownership transfer)`. Sprint C closed at this commit on
2026-04-21.

---

## ✅ Clean findings — baseline is solid

### 1. Tree integrity

- `git status` — clean, working tree matches `origin/main` exactly.
- `git log --oneline -10` — top commit is `9040d42`, the expected
  Sprint C tail.
- `git log origin/main..HEAD` — empty (no local-ahead drift).

### 2. Build / test baseline

| Check | Result |
|-------|-------:|
| `go vet ./...` | clean |
| `go test ./...` (23 packages) | all `ok` |
| `govulncheck ./...` | **No vulnerabilities found** |
| Python `pytest` | 40/40 passed; total coverage 84% (906/1052 stmts) |
| Python `mypy src` | no issues in 31 files |
| Python `ruff check src tests` | all checks passed |
| `pnpm -r lint` | all workspaces clean |
| `pnpm -r typecheck` | all workspaces clean |

**Coverage gates — every Sprint B baseline preserved:**

| Package | Required | Actual |
|---------|---------:|-------:|
| `internal/server` | ≥85% | **94.5%** |
| `internal/middleware` | ≥80% | **86.7%** |
| `internal/sseproxy` | ≥85% | **87.3%** |
| `internal/middleware/airatelimit` | ≥85% | **88.4%** |

### 3. Debt ledger

- 43 Active TD entries in `docs/TECH_DEBT.md`. Priority spread:
  2 × P1 (TD-066 workers placeholder, TD-047 CSVExport tier flag),
  14 × P2, 8 × P3, remainder un-stamped older entries.
- 11 × TD-R* in Resolved section. **Every referenced commit SHA
  resolves** (verified with `git cat-file -e` per SHA):
  `7e6ea94`, `f64bc41`, `040c70f`, `bdf6a0a`, `a913a7a`, `05f43d3`,
  `bcd1b34`, `4357739`, `b079d30`, `2b81fd2`, `cdfca5d`, `11d6098`,
  `b827241`.
- Both P1 items still unresolved in code (checked: `cmd/workers/main.go`
  is still 40-line placeholder per TD-066; no CSVExport tier gate
  work per TD-047 grep). **No silently-fixed P1s hidden in Active.**
- **Only one `TODO/FIXME/HACK/XXX` comment in the whole codebase
  outside generated files:** `apps/api/internal/config/config.go:71
  // TODO(TD-046): re-require when SnapTrade client lands` —
  correctly cross-referenced to a tracked TD. No orphan TODOs.

### 4. Doc currency

- **`docs/merge-log.md`** — Sprint C block present, lists all 9
  feature commits (`750959c`, `60aa650`, `d5f6dee`, `7e6ea94`,
  `f27fd0d`, `14a2b92`, `6920ccf`, `3455e67`, `9d5c871`) grouped by
  cluster with scope-per-item. (Minor gap: `dc514d4` + `9040d42`
  trailing meta-commits not referenced — see § Minor findings.)
- **`docs/BACKEND_HEALTH_2026-04-21.md` §5** — all 13 smells
  annotated with ✅/⏳/🟡 status + resolving SHA. Matches actual
  code state: smells 1, 2, 3, 4, 6, 10, 12 closed; 11 partial;
  5, 7, 8, 9, 13 open.
- **`docs/ENV.md`** — 38 of 39 env vars documented (see § Minor
  findings for the one omission).

### 5. Orphans / hygiene

- No `.bak`, `.tmp`, `.orig`, `.swp` files in tree.
- `tools/openapi/generated/openapi.bundled.json` not currently
  present in working tree — the "keeps re-appearing" pattern has
  been quiet since Sprint A.
- **Applied during this audit:** new `.gitignore` rule
  `tools/openapi/generated/*` + un-ignore for
  `swift/` and `swift/**` so the bundle file is permanently
  ignored without losing the swift codegen outputs that live
  in-tree per `tools/openapi/README.md` convention.
  Verified via `git check-ignore -v`: `openapi.bundled.json`
  matches the ignore rule; `swift/.gitkeep` stays tracked.

### 6. GitHub Actions

- **CI workflow last 10 runs on main:** latest (`9040d42`) green.
  Four interim failures during Sprint C session 3 were all
  lint-catches (bodyclose on `ai_chat_stream.go`, ruff N814 on
  Python CamelCase imports) immediately fixed by the next commit.
  No flaky patterns — every failure had a deterministic root
  cause + a one-line follow-up fix.
- **Deploy — api (Fly.io) workflow:** staging pipeline green on
  every push (`Verify staging secrets` + `Deploy — staging` +
  `k6 smoke — staging`). The workflow's overall status shows red
  because of **`Verify prod secrets`**, which is the pre-existing
  known failure from the TD-091 kickoff era — prod Fly app
  `investment-tracker-api` is not yet provisioned so the
  `flyctl secrets list` JSON-decode trips on empty output.
  **Not a regression.** Kickoff explicitly out-of-scope for
  Sprint C.
- **Sentry** is wired on both sides (`apps/api/cmd/api/main.go`
  initSentry + `apps/ai/src/ai_service/observability.py`
  init_sentry). `SENTRY_DSN` env var gated; unset → silent
  disable. Live issue query is out of scope for a CC audit
  (requires Sentry dashboard auth).

---

## ⚠️ Minor findings — defer as follow-ups

### M1. `docs/ENV.md` missing `CORE_API_TIMEOUT_SECONDS`

`apps/ai/src/ai_service/config.py:82` reads
`CORE_API_TIMEOUT_SECONDS` (`float`, default `30.0`) for the
reverse-channel HTTP client timeout, but this env var is absent
from the `docs/ENV.md` registry. One missing row, no runtime
impact — ops can see the default in code, but the registry is
supposed to be the one-file-to-grep answer.

**Proposed fix** (separate PR, trivial):
```markdown
| `CORE_API_TIMEOUT_SECONDS` | — | `core_api_timeout_seconds` | `30.0` | AI Service outbound HTTP timeout |
```
Add under the "Cross-service auth" table. 1-line edit.

### M2. `docs/merge-log.md` Sprint C block missing trailing meta-commits

The block was itself committed as `dc514d4` (docs housekeeping) and
cannot reference itself; `9040d42` (bodyclose lint fix) landed
after. Per the audit kickoff's literal wording — "commits 6920ccf
through 9040d42, 11 commits" — the block lists 9. The 2 missing
are meta-commits (doc-close and lint-fix, not feature work).

**Proposed fix** (optional — cosmetic): append a short note at the
end of the Sprint C block listing the two trailing SHAs with their
role. Or leave as-is: the merge-log block is about feature scope,
which stays correctly represented by the 9 feature SHAs.

Recommendation: **leave as-is**. The block already reads "11
commits across 3 sessions" in the Sprint C report summary, and
the specific feature SHA list is the meaningful artifact.

### M3. Coverage drift on `observability.py` (52%)

`apps/ai/src/ai_service/observability.py` sits at 52% line
coverage — tests don't exercise the Sentry/PostHog live-service
initialization paths. Pre-existed before Sprint C; noted in
`docs/BACKEND_HEALTH_2026-04-21.md § 3`. Not a regression; flagged
here only because the audit surfaces it.

No action this audit.

### M4. Active TD entries with no `**Priority:**` line

Some older Active TDs (TD-054 down to TD-001) use a slightly
different frontmatter format and don't have an explicit
`**Priority:**` line the audit could grep. Unclear whether that's
a doc-format drift or intentional. Doesn't affect tracking — they
still appear in the TECH_DEBT.md Active section.

No action this audit. Could be a good hour-long sweep to
normalize formatting during a later doc pass.

---

## 🚨 Real issues — none

Nothing blocks Slice 6a or other new work. The baseline is
demonstrably clean.

---

## Summary

**Status: Ready to move on.**

Sprint C's 11 commits landed cleanly on `main` as
`9040d42`; every test + lint + type-check + vulnerability scan
that CI runs passes locally and remotely (modulo the
pre-existing `Verify prod secrets` gate that's explicit
out-of-scope until prod Fly app is provisioned). All coverage
gates hold, no silent debt accumulated in code comments, and
the three audit-triggered questions about specific artifacts
(prod workflow failure, openapi bundle re-appearance,
`CORE_API_TIMEOUT_SECONDS` doc) resolve to either "known-red,
out-of-scope" or "trivial follow-up".

The one hygiene fix the audit itself applied (the
`tools/openapi/generated/*` gitignore rule) ships alongside
this report in a single commit.

No blocking issues. Green light for Slice 6a.
