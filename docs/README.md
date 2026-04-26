# docs/ — Documentation Portal

Project: **Provedo** (investment-tracker repo) — pre-alpha Lane A portfolio AI assistant.

This is the docs entry point. Everything is organized into 10 top-level folders by purpose. Strategic context first, then per-domain.

---

## Start here

| If you're... | Open |
|---|---|
| **PO returning to a session** | [strategic/PO_HANDOFF.md](strategic/PO_HANDOFF.md) |
| **A new agent / contributor** | [strategic/PROJECT_BRIEF.md](strategic/PROJECT_BRIEF.md) → [team/CODE_TEAM_BOOTSTRAP.md](team/CODE_TEAM_BOOTSTRAP.md) |
| **Looking for current sprint state** | [strategic/ROADMAP.md](strategic/ROADMAP.md) → [engineering/UI_BACKLOG.md](engineering/UI_BACKLOG.md) |
| **About to make an architectural decision** | [strategic/DECISIONS.md](strategic/DECISIONS.md) (read first; never duplicate) |

---

## Folder map

```
docs/
├── README.md                       ← you are here (portal)
│
├── strategic/                      ← PO-facing & cross-domain decisions
│   ├── PO_HANDOFF.md               ← session-to-session handoff (canonical)
│   ├── DECISIONS.md                ← engineering + product decisions log (ADR-style)
│   ├── ROADMAP.md                  ← MVP plan, wave status, alpha critical path
│   ├── PROJECT_BRIEF.md            ← concept, audience, USP, scope
│   └── PENDING_CLEANUPS.md         ← deferred doc/spec items tracker
│
├── product/                        ← positioning, brand, naming, research
│   ├── DISCOVERY.md                ← user discovery, ICP, JTBD foundation
│   ├── POSITIONING.md              ← obviously-awesome canvas (Provedo positioning)
│   ├── NAMING.md                   ← naming history + locked Provedo decision
│   ├── BRAND.md                    ← brand foundation v1.0 (archetype, tagline)
│   ├── STRATEGIC_OPTIONS_v1.md     ← locked product strategy options (4 PO locks)
│   ├── BRAND_VOICE/                ← voice profile, references log
│   ├── USER_RESEARCH/              ← hypotheses, interview output
│   └── competitive/                ← competitor matrices, deep dives
│
├── design/                         ← surface specs, design system
│   ├── DESIGN_BRIEF.md             ← Direction A Modern AI-Tool Minimalist v1.4
│   ├── COACH_SURFACE_SPEC.md       ← Coach UX (post-alpha)
│   ├── DASHBOARD_ARCHITECTURE.md   ← dashboard surface spec
│   ├── ONBOARDING_FLOW.md          ← onboarding flow spec
│   ├── slice-lp3-2-product-designer-specs.md  ← active dispatch artifact
│   └── historical/                 ← superseded visual specs (kept for reference)
│
├── content/                        ← landing copy, microcopy, paywall, email
│   ├── microcopy-provedo.md
│   ├── paywall-provedo.md
│   ├── email-sequences-provedo.md
│   └── slice-lp3-2-content-lead-deliverables.md
│
├── engineering/                    ← all eng-side docs
│   ├── TECH_DEBT.md                ← living TD ledger (P1/P2/P3)
│   ├── UI_BACKLOG.md               ← canonical Web UI backlog
│   ├── merge-log.md                ← merge events + admin-bypass policy
│   ├── architecture/               ← TECH_STACK, ARCHITECTURE, ENV
│   ├── tasks/                      ← TASK_01..08 monorepo task specs + PR-preflights
│   ├── kickoffs/                   ← slice + feature kickoffs (some date-prefixed, some CC_KICKOFF_*)
│   │   └── task-07-slices/         ← 7 historical task07 slice kickoffs
│   ├── runbooks/                   ← deploy, AI flip, staging procedures
│   └── audits/                     ← backend health snapshots
│
├── finance/                        ← finance-advisor domain
│   ├── EXPENSES.md
│   ├── PRICING_TIER_VALIDATION.md
│   ├── COACH_TIER_PLACEMENT.md
│   ├── BENCHMARKS_SOURCED.md
│   └── AI_CONTENT_VALIDATION_TEMPLATES.md
│
├── legal/                          ← legal-advisor domain
│   ├── PRIVACY_POLICY_draft.md
│   ├── TOS_draft.md
│   ├── COOKIE_POLICY_draft.md
│   ├── DPA_template.md
│   ├── AI_DISCLAIMER_PATTERN.md
│   └── SUBPROCESSOR_REGISTRY.md
│
├── reviews/                        ← multi-agent validations, syntheses, audits
│   └── (date-prefixed: 2026-04-25-*, 2026-04-26-*, 2026-04-27-*)
│
├── team/                           ← team process, agent guides
│   ├── CODE_TEAM_BOOTSTRAP.md      ← team charter + how to join
│   ├── TEAM_ROSTER.md              ← active agent roster
│   └── agent-guides/               ← CLAUDE_CODE_PROMPTS, CLAUDE_DESIGN_HANDOFF
│
└── archive/                        ← historical, superseded
    ├── session-snapshots/          ← prior session-resume snapshots
    └── landing-evolution/          ← old landing v1, v2 (current is in code)
```

---

## Naming conventions

- **Strategic / canonical living docs:** `SCREAMING_SNAKE.md` (DECISIONS.md, TECH_DEBT.md)
- **Topic docs in subfolders:** `kebab-case.md` or `SCREAMING_SNAKE.md` per established pattern
- **Date-prefixed snapshots/reviews:** `YYYY-MM-DD-descriptor-role.md` (used in `reviews/`, `kickoffs/`, `archive/`)
- **Index files:** `INDEX.md` (NOT `README.md`) inside subfolders — README is reserved for repo-root + top-level entry
- **Numeric prefixes (`01_`, `02_`)** retained ONLY where ordering matters within a folder. Dropped when moving from root into a domain folder where the file is unique.

---

## Living-log hygiene

`PO_HANDOFF.md`, `DECISIONS.md`, `TECH_DEBT.md`, `UI_BACKLOG.md`, `merge-log.md` are edited-in-place living logs (not snapshots). Always check `git log -1 <file>` if uncertain about freshness.

For session bridges that age out (>3 days), move them to `archive/session-snapshots/`.

---

## Ownership

- `strategic/` — right-hand (cross-domain), tech-lead (DECISIONS engineering side)
- `product/` — product-lead, brand-strategist, brand-voice-curator, user-researcher
- `design/` — product-designer
- `content/` — content-lead
- `engineering/` — tech-lead (TECH_DEBT, kickoffs, tasks), devops-engineer (runbooks)
- `finance/` — finance-advisor
- `legal/` — legal-advisor
- `reviews/` — multi-agent (each file's owner in title or frontmatter)
- `team/` — right-hand
- `archive/` — anyone (just preserves history)

Right-hand is DRI for `docs/` taxonomy + naming convention.

---

**Last reorg:** 2026-04-27 — flattened root, grouped by domain, archived old session snapshots.
