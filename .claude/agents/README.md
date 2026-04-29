# Project agents — `.claude/agents/`

Canonical, tracked Claude Code agent definitions for the `investment-tracker` (Provedo) project.

`.claude/` is gitignored for per-developer permissions/MCPs, but `.claude/agents/` and `.claude/skills/` are carved out via `!.claude/agents/` etc — these are SHARED canonical sources. Edits here propagate to every contributor on next pull. No second tree (`.agents/team/` was retired 2026-04-29 to eliminate drift).

Read `CONSTRAINTS.md` first — it carries the hard team-wide rules every agent must respect.

## Roster

### PO interface

| Agent | Role | Status | Model |
|---|---|---|---|
| `right-hand.md` | PO's Russian-speaking strategic co-pilot — single point of contact for PO | **canonical** | opus |
| `navigator.md` | Legacy PO interface | deprecated (kept for legacy session resume) | opus |

### Engineering

| Agent | Role | Model |
|---|---|---|
| `architect.md` | System design, scalability, technology stack audits, ADRs | opus |
| `tech-lead.md` | Strategic co-pilot for slice decomposition, kickoffs, TD ledger | opus |
| `backend-engineer.md` | Go (apps/api) + Python AI (apps/ai) + TypeScript (packages/shared-types) | sonnet |
| `frontend-engineer.md` | Next.js 15 (apps/web) + design-system consumer integration | sonnet |
| `devops-engineer.md` | CI/CD, Docker, Doppler, deploy pipelines, runbooks | sonnet |
| `qa-engineer.md` | Test strategy across Go + Python + Vitest + k6 | sonnet |
| `code-reviewer.md` | Independent post-merge / large-PR pre-merge review | sonnet |

### Product specialists (dispatched by Right-Hand)

| Agent | Role | Model |
|---|---|---|
| `brand-strategist.md` | Naming, brand archetype, tone, taglines, brand foundation | opus |
| `brand-voice-curator.md` | Living taste-reference log + voice-profile reverse-engineering | sonnet |
| `product-designer.md` | UX flows, wireframes, surface design, Design Brief | opus |
| `user-researcher.md` | ICP validation, interviews, JTBD, opportunity mapping | opus |
| `content-lead.md` | Landing copy, email sequences, microcopy, paywall copy | opus |
| `seo-specialist.md` | Technical SEO + on-page + structured data + Core Web Vitals | sonnet |

### Domain SMEs (internal validators, dispatched by Right-Hand)

| Agent | Role | Model |
|---|---|---|
| `finance-advisor.md` | AI content validation, startup finance model, Lane A numeric compliance | opus |
| `legal-advisor.md` | Privacy/ToS, GDPR + SEC + MiFID II + FCA + 39-ФЗ boundary review | opus |

## How to dispatch

Right-Hand is the single PO interface. PO talks to Right-Hand in Russian; Right-Hand dispatches specialists via the `Agent` tool with `subagent_type: "<agent-name>"`.

Per `CONSTRAINTS.md` Rule 7, every dispatch prompt MUST include an explicit «Skills to activate up-front» section. Each agent file's `## Default skill stack` section lists the canonical skills for that role.

Per `CONSTRAINTS.md` Rule 5, major slices (schema / UI subsystem / Lane-A surface / a11y / security / cross-package) require independent reviewer fan-out before downstream work proceeds.

## Editing convention

When you edit an agent .md:
1. Update the `## Default skill stack` section if scope changes.
2. If the change affects HARD rules, propagate to `CONSTRAINTS.md` first.
3. Commit with prefix `chore(agents): ...` so the team-wide impact is searchable in git log.

## Related directories

- `.claude/skills/` — project-specific skills (e.g. `release-readiness`). Also tracked.
- `~/.claude/skills/` — user-level / per-machine skill installs. NOT shared, per-developer.
- `docs/ADR-2026-04-29-plugin-architecture.md` — defines the WHO (project agents = persona) / HOW (plugins = methodology) / FALLBACK (plugin agents = generic) / TOOLING (MCPs) layering.

---

**Last updated:** 2026-04-29 (consolidated from `.agents/team/` after drift detected; Rule 5 + Rule 7 + Rule 8 added to CONSTRAINTS).
