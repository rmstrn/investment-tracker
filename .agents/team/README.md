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
| `product-designer.md` | UX flows, wireframes, surface design, Design Brief | opus |
| `user-researcher.md` | ICP validation, interviews, JTBD, opportunity mapping | opus |
| `content-lead.md` | Landing copy, email sequences, microcopy, paywall copy | opus |

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

### Installed plugins (verified 2026-04-23)

- **`superpowers@claude-plugins-official`** (obra/superpowers, v5.0.7) — process discipline: `brainstorming`, `using-superpowers`, `writing-plans`, `verification-before-completion`, `dispatching-parallel-agents`, `subagent-driven-development`, `test-driven-development`, `systematic-debugging`, `requesting-code-review`, `receiving-code-review`, `finishing-a-development-branch`, `using-git-worktrees`, `writing-skills`, `executing-plans`
- **`everything-claude-code@everything-claude-code`** (v1.10.0) — strategy, research, content, design: `council`, `brand-voice`, `content-engine`, `design-system`, `frontend-design`, `accessibility`, `market-research`, `deep-research`, `exa-search`, `product-lens`, `prp-prd`, `prp-plan`, `plan`, `blueprint`, `evolve`, `click-path-audit`, `ui-demo`, `liquid-glass-design`, `article-writing`, `crosspost`, `investor-materials`, `investor-outreach`, `save-session`, `resume-session`, `ck`, + ~180 more
- **`strategy-growth@wondelai-skills`** (v1.0.0) — **ONLY 4 skills**: `crossing-the-chasm`, `blue-ocean-strategy`, `traction-eos`, `obviously-awesome`

### Required-but-not-yet-installed (PO: install when ready to activate full team)

```bash
# Already installed: strategy-growth@wondelai-skills
# To activate full skill coverage, run:
/plugin install product-strategy@wondelai-skills      # jobs-to-be-done, mom-test, negotiation           (user-researcher)
/plugin install ux-design@wondelai-skills             # refactoring-ui, ios-hig-design, ux-heuristics,    (product-designer, content-lead)
                                                      # hooked-ux, web-typography, top-design,
                                                      # design-everyday-things, lean-ux, microinteractions,
                                                      # improve-retention
/plugin install marketing-cro@wondelai-skills         # storybrand-messaging, contagious,                 (content-lead, brand-strategist)
                                                      # one-page-marketing, cro-methodology,
                                                      # scorecard-marketing
/plugin install sales-influence@wondelai-skills       # influence-psychology, made-to-stick,              (content-lead, brand-strategist)
                                                      # predictable-revenue, hundred-million-offers
/plugin install product-innovation@wondelai-skills    # continuous-discovery, mom-test (duplicate),       (user-researcher, product-designer,
                                                      # lean-startup, design-sprint, inspired-product,    brand-strategist, navigator)
                                                      # 37signals-way, design-everyday-things (duplicate)
```

Agents reference these with correct plugin prefixes (`ux-design:refactoring-ui`, `product-strategy:mom-test`, etc.). Until the plugin is installed, that specific Skill invocation will silently fall back — the agent still works, just with a narrower toolkit.

### MCP tools (not skills; invoked via ToolSearch, not Skill)

- `sequential-thinking` — structured step-by-step reasoning. Available via ECC MCP. Agents mention it inline as `[mcp] sequential-thinking` for clarity, but the actual invocation is through the MCP tool layer, not the Skill tool.

### User-level skills (installed in `~/.claude/skills/`)

- `backend-patterns`, `github`, `golang-patterns`, `redis-cache-manager`, `redis-patterns`, `obviously-awesome`

### Canonical source for plugin metadata

- `/c/Users/rmais/.claude/plugins/installed_plugins.json` — registry of installed plugins
- `/c/Users/rmais/.claude/plugins/cache/wondelai-skills/strategy-growth/1.0.0/.claude-plugin/marketplace.json` — wondelai marketplace manifest (shows plugin→skill mapping)
