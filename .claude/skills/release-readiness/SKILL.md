---
name: release-readiness
description: Multi-pass pre-release audit for Provedo. Use before alpha cutover, prod deploys, or any milestone PR where the cost of latent issues exceeds the cost of a 30-min check. Orchestrates security audit, silent-failure hunt, perf scan, secret scan, repo classification, and CISO-level risk readout. Returns severity-ranked findings (CRITICAL / HIGH / MEDIUM / LOW) with concrete remediation per finding.
license: MIT
metadata:
  author: right-hand (Provedo team)
  version: "1.0.0"
  scope: project
  created: 2026-04-29
---

# Release-Readiness Audit

Use this skill when the cost of shipping an issue exceeds the cost of a 30-minute systematic sweep. Typical triggers: pre-alpha cutover, prod deploy of a high-impact slice, paywall/billing release, AI Service config change, broker integration go-live, marketing-launch landing freeze.

## When NOT to use

- Single-file bug fix
- Routine doc edits / kickoff drafts
- Dependabot minor bumps with green CI
- Anything where you already know all the failure modes

## Hard rules (Provedo CONSTRAINTS — apply throughout)

- **R1** No paid scans / SaaS audit tools — only ECC / plugin-local agents.
- **R2** No outbound communication during audit (no tweets, no vendor support tickets) without PO approval.
- **R4** Findings must reference internal paths, never the rejected naming predecessor.

## Audit composition (5-pass, parallel where possible)

Dispatch via `Agent` tool with `run_in_background: true` for the four parallel passes; synthesize after all return.

### Pass 1 — Security audit
- **Agent:** `security-compliance:security-auditor`
- **Scope:** OWASP Top 10, auth/authz boundaries, secret hygiene, input validation, CSP/CORS, dependency CVEs.
- **Inputs:** changed files since last release tag + entire `apps/api/internal/middleware/`, `apps/web/src/middleware.ts`, `apps/api/internal/handlers/`.
- **Output expected:** finding list with severity + location + reproduction.

### Pass 2 — Silent failures + error handling
- **Skill:** `everything-claude-code:silent-failure-hunter`
- **Scope:** swallowed errors, missing error propagation, bad fallbacks, race conditions in goroutines, missing context cancellation paths.
- **Focus areas for Provedo:** `apps/api/internal/services/ai_*`, broker provider clients, SSE handlers, Stripe webhook reconciliation.

### Pass 3 — Performance scan
- **Skill:** `everything-claude-code:performance-optimizer`
- **Scope:** N+1 queries, unbounded selects, missing indexes, render-blocking JS, hydration mismatches.
- **Focus areas:** `apps/web/src/app/(app)/dashboard/`, `apps/web/src/app/(app)/positions/`, `apps/api/internal/db/queries/*.sql`.

### Pass 4 — Secret hygiene + repo classification
- **Skill:** `everything-claude-code:security-scan` + `everything-claude-code:repo-scan`
- **Scope:** hardcoded secrets, leaked tokens in test fixtures, .env in git history, world-readable files in deploy artifacts.

### Pass 5 — CISO-level risk readout
- **Skill:** `ciso-advisor` (user-level, deployed 2026-04-29)
- **Scope:** strategic risk view — what would a CISO flag for SOC2 readiness, breach blast-radius, third-party broker-token storage, KEK rotation policy.
- **Output expected:** prose risk register, not file-level findings.

## Synthesis format

After all 5 passes return, produce a single artifact at `docs/reviews/<YYYY-MM-DD>-release-readiness-<release-tag>.md`:

```markdown
# Release-Readiness Audit — <release-tag>
**Date:** YYYY-MM-DD
**Scope:** <branch / SHA range>
**Verdict:** GO / WARN / STOP

## CRITICAL (block release)
- [ ] <finding> — <file:line> — <remediation> — <pass that surfaced it>

## HIGH (should fix before release; document if punted)
- [ ] ...

## MEDIUM (TD)
- [ ] ...

## LOW / nits
- ...

## Strategic risk register (CISO pass)
- <prose>

## Passes summary
| Pass | Tool | Status | Findings |
|---|---|---|---|
| 1 Security audit | security-compliance:security-auditor | green/warn/red | N |
| 2 Silent failures | silent-failure-hunter | ... | N |
| 3 Performance | performance-optimizer | ... | N |
| 4 Secret + repo scan | security-scan + repo-scan | ... | N |
| 5 CISO readout | ciso-advisor | ... | prose only |
```

## Rules of synthesis

- **CRITICAL = blocks release.** Must be fixed or PO must explicitly accept the risk in writing (added to `docs/DECISIONS.md` with date).
- **HIGH = strong recommendation.** If shipping anyway, open a TD entry with P1 + post-release-trigger.
- **MEDIUM = TD entry P2 / P3, no release block.**
- **LOW = nit, optionally batched into a hygiene PR.**
- **No "consider" or "might want" findings.** Either it's actionable with file:line + remediation, or it's not in the artifact.

## After the audit

- File the report in `docs/reviews/`.
- Update `docs/PENDING_CLEANUPS.md` with any deferred HIGH/MEDIUM items.
- Right-Hand notifies PO: 1 line — verdict + count by severity + path to full report.
- If verdict = STOP — Right-Hand drafts blocker kickoff, dispatches builders.
