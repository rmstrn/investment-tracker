# Team Agents — Shared Source of Truth

Canonical copies of the investment-tracker Claude Code agent team.
`.claude/` is gitignored (per-developer), so these live here and each
developer syncs them into their local runtime.

## Roster

| Agent | Role | Model |
|---|---|---|
| `navigator.md` | PO's Russian-speaking strategic co-pilot | opus |
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

Each agent lists "Available skills" in its front-matter section.
See `everything-claude-code` plugin (pinned in `skills-lock.json`) plus
user-level skills: `backend-patterns`, `github`, `golang-patterns`,
`redis-cache-manager`, `redis-patterns`.
