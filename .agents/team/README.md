# Team Agents — Shared Source of Truth

Canonical copies of the investment-tracker Claude Code agent team.
`.claude/` is gitignored (per-developer), so these live here and each
developer syncs them into their local runtime.

## Roster

### PO-side (single PO interface: Navigator)

| Agent | Role | Model |
|---|---|---|
| `navigator.md` | PO's Russian-speaking strategic co-pilot, единый вход PO | opus |

### Product specialists (dispatched by Navigator)

| Agent | Role | Model |
|---|---|---|
| `brand-strategist.md` | Naming, brand archetype, tone, taglines, brand foundation | opus |
| `brand-voice-curator.md` | Living taste-reference log + derived voice profile; fixes the 17-round «no positive anchor» root cause | opus |
| `product-designer.md` | UX flows, wireframes, surface design, Design Brief | opus |
| `user-researcher.md` | ICP validation, interviews, JTBD, opportunity mapping | opus |
| `content-lead.md` | Landing copy, email sequences, microcopy, paywall copy | opus |

### Domain SMEs — internal validators (dispatched by Navigator)

| Agent | Role | Model |
|---|---|---|
| `finance-advisor.md` | AI content validation (formulas/benchmarks), startup finance model, Lane A numeric compliance | opus |
| `legal-advisor.md` | Privacy policy / ToS drafts, GDPR + SEC + MiFID II + FCA + 39-ФЗ boundary review, subprocessor DPAs | opus |

### Engineering-side (via tech-lead)

| Agent | Role | Model |
|---|---|---|
| `tech-lead.md` | Engineering co-pilot, routes work, writes kickoffs | opus |
| `backend-engineer.md` | Go + Python AI service implementer | sonnet |
| `frontend-engineer.md` | Next.js 15 implementer | sonnet |
| `devops-engineer.md` | CI/CD, Docker, Doppler, deploy | sonnet |
| `qa-engineer.md` | Test strategy across Go + Python + Vitest + k6 | sonnet |
| `code-reviewer.md` | Independent post-merge reviewer | opus |

## Install

Copy all agent files into your local Claude Code agents directory:

```bash
mkdir -p .claude/agents
cp .agents/team/*.md .claude/agents/
# Exclude this README from the runtime directory:
rm -f .claude/agents/README.md
```

After copying, Claude Code will pick up the agents automatically — invoke
via the `Agent` tool with the matching `subagent_type`.

## Update flow

1. Edit the canonical copy here in `.agents/team/`.
2. Re-run the install command above to sync your local runtime.
3. Commit the canonical change. Other devs pull + re-sync.

Never edit `.claude/agents/*.md` directly for team-shared changes — the
file lives outside git and your edits will be lost on the next sync.

## Skills referenced

Each agent lists "Primary skills" in its body. Plugin sources:

### Installed plugins (verified 2026-04-23, expanded 2026-04-24)

- **`superpowers@claude-plugins-official`** (obra/superpowers, v5.0.7) — process discipline: `brainstorming`, `using-superpowers`, `writing-plans`, `verification-before-completion`, `dispatching-parallel-agents`, `subagent-driven-development`, `test-driven-development`, `systematic-debugging`, `requesting-code-review`, `receiving-code-review`, `finishing-a-development-branch`, `using-git-worktrees`, `writing-skills`, `executing-plans`
- **`everything-claude-code@everything-claude-code`** (v1.10.0) — strategy, research, content, design: `council`, `brand-voice`, `content-engine`, `design-system`, `frontend-design`, `accessibility`, `market-research`, `deep-research`, `exa-search`, `product-lens`, `prp-prd`, `prp-plan`, `plan`, `blueprint`, `evolve`, `click-path-audit`, `ui-demo`, `liquid-glass-design`, `article-writing`, `crosspost`, `investor-materials`, `investor-outreach`, `save-session`, `resume-session`, `ck`, + ~180 more
- **`ui-ux-pro-max@nextlevelbuilder`** (v2.5.0, added 2026-04-24) — design intelligence searchable via Python CLI. 161 industry reasoning rules, 67 UI styles, 161 color palettes, 57 font pairings, 99 UX guidelines, 25 chart types, stack-specific rules for 15+ stacks (Next.js, React, shadcn, SwiftUI, Flutter, etc.). Flagship: `--design-system` generates complete design system (pattern + style + colors + typography + effects + anti-patterns + pre-delivery checklist). Also bundles `ckm:brand` sub-skill (brand voice template, asset organization, logo usage). **Primary consumers:** product-designer (core), frontend-engineer (stack + pre-delivery checklist). **Deferred consumer:** brand-strategist (for `04_BRAND.md` scope after name lock). Invocation via Bash: `python3 ~/.claude/plugins/cache/ui-ux-pro-max-skill/ui-ux-pro-max/2.5.0/src/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>`.
- **`strategy-growth@wondelai-skills`** (v1.0.0) — `crossing-the-chasm`, `blue-ocean-strategy`, `traction-eos`, `obviously-awesome`
- **`product-strategy@wondelai-skills`** (v1.0.0) — `jobs-to-be-done`, `mom-test`, `negotiation`
- **`ux-design@wondelai-skills`** (v1.0.0) — `refactoring-ui`, `ios-hig-design`, `ux-heuristics`, `hooked-ux`, `improve-retention`, `web-typography`, `top-design`, `design-everyday-things`, `lean-ux`, `microinteractions`
- **`marketing-cro@wondelai-skills`** (v1.0.0) — `cro-methodology`, `storybrand-messaging`, `scorecard-marketing`, `contagious`, `one-page-marketing`
- **`sales-influence@wondelai-skills`** (v1.0.0) — `influence-psychology`, `predictable-revenue`, `made-to-stick`, `hundred-million-offers`
- **`product-innovation@wondelai-skills`** (v1.0.0) — `lean-startup`, `design-sprint`, `design-everyday-things`, `inspired-product`, `continuous-discovery`, `37signals-way`

All skill prefixes referenced by agents are valid against the plugin registry as of 2026-04-23.

### If adding more wondelai plugins in the future

Full catalogue: `team-motivation` (drive-motivation), `code-craftsmanship` (clean-code, refactoring-patterns, software-design-philosophy, pragmatic-programmer, domain-driven-design), `systems-architecture` (ddia-systems, system-design, clean-architecture, release-it, high-perf-browser). Not currently needed for product/brand/design team scope.

### MCP tools (not skills; invoked via ToolSearch, not Skill)

- `sequential-thinking` — structured step-by-step reasoning. Available via ECC MCP. Agents mention it inline as `[mcp] sequential-thinking` for clarity, but the actual invocation is through the MCP tool layer, not the Skill tool.

### User-level skills (installed in `~/.claude/skills/`)

- `backend-patterns`, `github`, `golang-patterns`, `redis-cache-manager`, `redis-patterns`, `obviously-awesome`

### Canonical source for plugin metadata

- `/c/Users/rmais/.claude/plugins/installed_plugins.json` — registry of installed plugins
- `/c/Users/rmais/.claude/plugins/cache/wondelai-skills/strategy-growth/1.0.0/.claude-plugin/marketplace.json` — wondelai marketplace manifest (shows plugin→skill mapping)
