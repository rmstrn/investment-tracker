# ADR — 2026-04-29 — Plugin × project-agent architecture

**Status:** ACCEPTED (PO greenlit 2026-04-29 — «делай как считаешь нужно, используя скилы и лучшие практики»)
**Update 2026-05-02:** `finance-skills` + `c-level-skills` plugins disabled in `.claude/settings.json` `enabledPlugins` (PO directive — silenced the recurring `/doctor` «Path escapes plugin directory» errors). The 9 user-level skill copies (3 finance + 6 c-level) at `~/.claude/skills/` continue to load and remain the active source. References updated in `.claude/agents/finance-advisor.md` + `docs/finance/PRICING_TIER_VALIDATION.md` to drop the now-meaningless `finance-skills:` / `c-level-skills:` prefix. PENDING_CLEANUPS item #12 closed.
**Author:** Right-Hand
**Scope:** how 14 enabled marketplace plugins compose with 17 project agents
**Counterpart memory:** `project_plugin_architecture_2026-04-29.md`

---

## Context

PO asked whether marketplace plugins (superpowers, everything-claude-code, ui-ux-pro-max, plus 11 smaller packs from wondelai-skills, claude-code-workflows, claude-code-skills marketplaces) are being used correctly with the existing 17 project agents, and whether plugins might be **better** than project agents.

A workspace-surface audit (skill: `everything-claude-code:workspace-surface-audit`) was performed across:
- Plugin caches: `~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/`
- Project + global settings: `.claude/settings.json`, `~/.claude/settings.json`
- Hook configs: ECC `hooks.json` + superpowers `hooks.json`
- MCP servers: ECC `.mcp.json` (6 default) + `mcp-configs/mcp-servers.json` (27 templates, all gated on placeholders)
- Project agents skill-references: 17 files, 11–31 explicit `Skill:` refs each
- Repo `.env*` surfaces (key-names only): Clerk, Stripe, Sentry, PostHog, Anthropic, Polygon, CoinGecko, SnapTrade, Doppler, KEK
- Live skill list at session start (authoritative source for plugin activation status)

## Decision

Plugins do **NOT** replace project agents. They compose as layers:

```
WHO       → 17 project agents     (.claude/agents/*.md)
            Provedo persona, Rule 1-4 enforcement, ownership boundaries,
            Russian-first PO conversation, project-state context.

HOW       → ~250 plugin skills    (Skill tool — pluginname:skill OR project skill)
            Process discipline, framework playbooks, language patterns,
            domain methodologies. Each agent curates its own subset.

FALLBACK  → 49 plugin agents      (Agent tool — subagent_type)
            Generic specialists with no project context. Useful when:
            (a) a project agent doesn't exist for the role,
            (b) peer-review of a project-agent output is needed (Rule 3),
            (c) one-off non-project work.

TOOLING   → 82 plugin commands    (slash invocation)
          + ECC hooks             (auto-active on PreToolUse)
          + 6 MCP servers default (github / context7 / exa / memory /
                                   playwright / sequential-thinking)
```

## Findings (top 5)

### F1 — Two enabled plugins were INERT (zero ROI from them)

`finance-skills` (3 skills: financial-analyst, saas-metrics-coach, business-investment-advisor) and `c-level-skills` (28 skills: cfo-advisor, founder-coach, board-deck-builder, ciso-advisor, intl-expansion, scenario-war-room, ceo-advisor, cmo-advisor, cpo-advisor, cto-advisor, cro-advisor, chro-advisor, coo-advisor, ciso-advisor, cs-onboard, executive-mentor, board-meeting, competitive-intel, ma-playbook, agent-protocol, change-management, company-os, context-engine, culture-architect, decision-logger, internal-narrative, org-health-diagnostic, strategic-alignment) were both enabled in `.claude/settings.json` since 2026-04-24 but **not loaded** — verified by their absence from session-start skill list.

Root cause: non-standard plugin structure. Each sub-skill has its own `.claude-plugin/plugin.json` while the parent pack also has one with `"skills": "./"` — Claude Code's skill loader does not index nested plugin manifests as siblings of a pack-level manifest.

**Action taken (M1):** 9 most Provedo-relevant skills copied to `~/.claude/skills/` (user-level — not project-polluting):
- All 3 from finance-skills: `financial-analyst`, `saas-metrics-coach`, `business-investment-advisor`
- 6 from c-level-skills: `cfo-advisor`, `founder-coach`, `board-deck-builder`, `scenario-war-room`, `ciso-advisor`, `intl-expansion`

Selection criteria: skip skills that overlap with existing project agents (cmo-advisor would compete with brand-strategist; cpo-advisor with right-hand + product-designer; ceo-advisor too generalist; cs-onboard / coo / chro / cro irrelevant pre-launch). The 9 picked are non-overlapping and stage-appropriate (pre-alpha founder-led).

**Verified:** all 9 visible in current session's skill list immediately after copy (no session restart needed).

### F2 — ui-ux-pro-max CLI wired but not invoked

Plugin installed 2026-04-24 with explicit Bash invocation patterns in `product-designer.md` (line 184) and `frontend-engineer.md` (line 127). Path: `python3 ~/.claude/plugins/cache/ui-ux-pro-max-skill/ui-ux-pro-max/2.5.0/src/ui-ux-pro-max/scripts/search.py "<q>" --domain <color|style|typography|chart|ux|landing>`.

In practice: never called in recent sessions. Smoke test 2026-04-29 returned 3 palette matches for «warm cream paper earth tones» in <1s — exactly the kind of shortlist that would have shortened the 2026-04-27 multi-agent palette review.

**Action taken (M2):** Added on-demand reference + reminder block in `right-hand.md` so strategic-design moments (palette / typography / chart selection) route through DB-filter shortlist before invoking multi-agent review.

### F3 — Project-agent skill stacks adequately wired (not the gap I expected)

Earlier audit-pass had under-counted: most agents are well-stacked.
- product-designer: 23 unique skill refs (full ux-design pack + ui-ux-pro-max + ECC frontend-design + accessibility)
- content-lead: 18 (full marketing-cro + sales-influence + ECC content-engine + brand-voice)
- user-researcher: 17 (full product-strategy + product-innovation + strategy-growth + ECC research-ops)
- frontend-engineer: 15 (ECC frontend stack + ui-ux-pro-max)
- backend-engineer: 22 (ECC Go + Python stacks + patterns)
- devops-engineer: 11 (ECC infra stack — but missing 2)
- legal-advisor: 6 (already pulls hr-legal-compliance:gdpr-data-handling — but missing peer-review pattern)

**Action taken (M4 — small targeted edits, not rewrites):**
- `devops-engineer.md` — added `everything-claude-code:database-migrations` + `:strategic-compact`
- `legal-advisor.md` — added explicit peer-review pattern: dispatch `hr-legal-compliance:legal-advisor` plugin agent for independent draft review on DPA/TOS/Privacy/Lane-A pattern docs (Rule 3 alignment)

### F4 — security-compliance:security-auditor agent loaded but never used

Plugin agent existed since enablement but no workflow trigger. Provedo handles Clerk PII + KEK-encrypted broker tokens + Stripe billing — concrete pre-launch SOC2 readiness need.

**Action taken (M3):** Created project skill `.claude/skills/release-readiness/SKILL.md` — orchestrates 5-pass audit: security-auditor + silent-failure-hunter + performance-optimizer + security-scan/repo-scan + ciso-advisor (now active per F1). Triggered explicitly before alpha cutover, paywall release, AI Service config changes, broker integration go-lives.

### F5 — 27 ECC MCP server templates available, none installed

`mcp-configs/mcp-servers.json` contains opt-in templates for jira / supabase / vercel / railway / stripe / cloudflare-bundle / clickhouse / firecrawl / omega-memory etc. — all gated on `YOUR_*_HERE` placeholders. PO has parallel `claude.ai` connected apps surface (Stripe, Google Drive, Miro) which serves the same need without `npx install` overhead.

**Decision:** No action. Connected apps surface is sufficient for current alpha-prep scope. Re-evaluate when team scales past founder-only.

## What was NOT changed

- The 17-agent project team — correct WHO layer; no agent replaceable by plugin equivalent without losing Provedo context
- All 14 plugin enablements in `.claude/settings.json` — kept active (the 2 inert ones now compensated by user-level skill copies)
- `ECC_HOOK_PROFILE=minimal` — current hook noise level appropriate
- `quantitative-trading` plugin — wrong domain (Lane A ≠ trading) but enabled cheaply; no skills wired into agents
- 27 ECC MCP templates — opt-in, not installed
- `everything-claude-code:plankton-code-quality` write-time-format hook — deferred (PENDING_CLEANUPS #10), low ROI vs. current CI coverage

## Layer rule (going forward)

When evaluating any future plugin add or remove:
1. Does it introduce a **WHO** that should be a Provedo persona? → Reject; persona changes go to project agents.
2. Does it introduce a **HOW** (skill / methodology / pattern)? → Wire into the relevant agent's curated stack, don't bloat right-hand's 14.
3. Does it introduce a **FALLBACK agent**? → Optionally allowed; document peer-review trigger if Rule 3 applies.
4. Does it introduce **TOOLING** (commands / hooks / MCP)? → Evaluate cost (every-Edit hook = expensive) vs. benefit case-by-case.

## Consequences

**Positive:**
- 9 net-new skills active immediately (founder-coach, cfo-advisor, board-deck-builder, scenario-war-room, ciso-advisor, intl-expansion, financial-analyst, saas-metrics-coach, business-investment-advisor) — direct fit for current pre-alpha founder-led stage and upcoming seed prep
- ui-ux-pro-max DB now reachable via right-hand workflow reminder — shortcut for future strategic-design shortlists
- Pre-release safety net (`release-readiness` skill) exists where there was none
- legal-advisor has cleaner peer-review pattern matching Rule 3 spirit
- devops gains 2 narrowly-useful skills for prod cutover window

**Negative / risks:**
- 9 user-level skill copies — duplicated content; if upstream plugin maintainer fixes the structure issue, we have stale copies until manual re-deploy (tracked: PENDING_CLEANUPS #12)
- Hard-coded ui-ux-pro-max version path in 2 agent files — silently breaks on plugin version bump (tracked: PENDING_CLEANUPS #11)
- right-hand.md is now slightly longer; on-demand block adds context cost per session

**Cost incurred:** $0 (Rule 1 respected; all moves use already-paid skills + project-local files).

## Files changed

### Tracked in git (will commit)

```
docs/PENDING_CLEANUPS.md                   (+ items #10, #11, #12)
docs/ADR-2026-04-29-plugin-architecture.md (this file — new)
```

### Per-developer / per-machine (NOT committed — `.gitignore` line 63 excludes `.claude/`)

```
~/.claude/skills/financial-analyst/             (new — copied from plugin cache)
~/.claude/skills/saas-metrics-coach/            (new — copied)
~/.claude/skills/business-investment-advisor/   (new — copied)
~/.claude/skills/cfo-advisor/                   (new — copied)
~/.claude/skills/founder-coach/                 (new — copied)
~/.claude/skills/board-deck-builder/            (new — copied)
~/.claude/skills/scenario-war-room/             (new — copied)
~/.claude/skills/ciso-advisor/                  (new — copied)
~/.claude/skills/intl-expansion/                (new — copied)

.claude/agents/right-hand.md                    (M2 edit — on-demand block, local only)
.claude/agents/devops-engineer.md               (M4 edit — +2 skills, local only)
.claude/agents/legal-advisor.md                 (M4 edit — peer-review pattern, local only)
.claude/skills/release-readiness/SKILL.md       (M3 — new project skill, local only)
```

### Caveat — `.claude/` gitignored

The project's `.gitignore` excludes `.claude/` entirely (per-developer permissions / MCP / agent customizations). This means the M2 / M3 / M4 file changes live only on the originating machine. Implications:

- The 17-agent project team is, in practice, per-developer. Original 13 agents have a tracked canonical at `.agents/team/*.md` (older, lacks 4 newer agents: right-hand / architect / seo-specialist / brand-voice-curator).
- This ADR is the authoritative record of M2/M3/M4 decisions. Other contributors must replicate the local file changes from this ADR if they want the same behaviour, or PO migrates `.claude/agents/` → tracked path in a separate decision.
- This issue is **not in scope** for this ADR — flagged for separate triage. Tracked: `docs/PENDING_CLEANUPS.md` (consider adding item #10 if PO wants to address agent-file shipping policy).

## Revisit triggers

- New plugin pack added to `enabledPlugins` → run a 5-min skill-list diff to verify activation (catch the F1 failure mode early).
- Quarterly: re-run `everything-claude-code:workspace-surface-audit` to keep plugin coverage honest.
- Plugin version bump on any pack with explicit Bash-invocation pattern in agent files → PENDING_CLEANUPS #11 trigger.
- If `claude-code-skills` plugin maintainer fixes structure → PENDING_CLEANUPS #12 trigger.
