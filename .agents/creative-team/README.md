# Creative Team — Subteam under Navigator

**Orchestrator:** `creative-director` (this folder)
**Reports to:** `navigator` (PO single point of contact, lives in `.agents/team/`)
**Members:** 7 creative specialists + 1 orchestrator = 8 files
**Hierarchy:** PO ↔ Navigator ↔ creative-director ↔ {7 specialists}

This subteam exists because creative-only initiatives (naming workshops, brand sprints, design audits, content reviews, research validation, accessibility audits, SEO audits) benefit from a dedicated coordinator that runs CONSTRAINTS Rule 3 (multi-agent strategic review) consistently and maintains brand-voice continuity across creative outputs.

Engineering work, legal work, finance work continue to flow through Navigator directly (or through tech-lead for engineering).

## Roster

| Role | File | Model | Scope |
|---|---|---|---|
| creative-director | `creative-director.md` | opus | Orchestrator: scopes creative initiatives, dispatches 1-6 specialists in parallel, synthesizes into one weighted recommendation back to Navigator |
| brand-strategist | `brand-strategist.md` | opus | Naming, brand archetype, tone, taglines, brand foundation |
| brand-voice-curator | `brand-voice-curator.md` | opus | Living taste-reference log + voice profile derivation |
| product-designer | `product-designer.md` | opus | UX flows, wireframes, surface design, Design Brief |
| user-researcher | `user-researcher.md` | opus | ICP validation, interviews, JTBD, opportunity mapping |
| content-lead | `content-lead.md` | opus | Landing copy, email sequences, microcopy, paywall copy, in-product strings |
| a11y-architect | `a11y-architect.md` | opus | WCAG 2.2 accessibility audit + inclusive UX design (POUR) |
| seo-specialist | `seo-specialist.md` | sonnet | Technical SEO, on-page optimization, schema markup, Core Web Vitals, content/keyword mapping |

## Dispatch model

```
PO  ──→  Navigator  ──→  creative-director  ──→  {1-6 specialists in parallel}
                              ↑                          │
                              └──── synthesis ───────────┘
```

- PO talks to Navigator only.
- Navigator decides: «engineering» (→ tech-lead) or «creative» (→ creative-director) or «domain» (→ finance-advisor / legal-advisor).
- creative-director identifies which specialists are relevant for the creative initiative, dispatches them in parallel via Agent tool with `run_in_background: true`, waits for all returns, synthesizes one weighted recommendation, returns to Navigator.
- Navigator translates synthesis to PO 2-section format.
- PO decides; lock goes back through Navigator.

## Skills attach principle

Each agent file has a curated `Primary skills` section. Picks were selected to maximize role fitness without padding. Every member has `superpowers:brainstorming` (PO-mandated process discipline before any creative work).

Skill catalogue inventoried 2026-04-25 (~290 skills across 5 plugin sources). Per-agent picks documented in each agent file's «Primary skills» section.

## Install

```bash
mkdir -p .claude/agents/creative-team
cp .agents/creative-team/*.md .claude/agents/creative-team/
rm -f .claude/agents/creative-team/README.md
```

After copying, Claude Code picks up the agents automatically — invoke via `Agent` tool with the matching `subagent_type`.

## Update flow

1. Edit canonical copy here in `.agents/creative-team/`.
2. Re-run install command above to sync local runtime.
3. Commit canonical change. Other devs pull + re-sync.

Never edit `.claude/agents/creative-team/*.md` directly for team-shared changes — the file lives outside git and your edits will be lost on the next sync.

## Constraints (apply to ALL creative-team members)

Inherited from `.agents/team/CONSTRAINTS.md`:

- **Rule 1 (no spend):** No paid services, subs, platforms, domain/trademark purchases, premium broker domains, paid clearance, paid consultants without explicit per-transaction PO approval.
- **Rule 2 (no comms in PO name):** No external posts/emails/DMs/messages authored as-if-from-PO without explicit per-message approval. Drafts for PO review are fine; sending as PO is not.
- **Rule 3 (multi-agent strategic review):** Strategic decisions (idea / naming / positioning / brand / pricing / regulatory) require REAL parallel Agent-tool dispatch of 3-6 specialists in isolated contexts. Single-agent simulated council = broken. creative-director synthesizes; PO decides.
- **Bilingual EN+RU parity** for all PO-facing artefacts (Russian primary).
- **Lane A regulatory boundary** — no investment-advice register in any output.

## Sources

- Agents inventory: `docs/reviews/2026-04-25-agents-inventory.md`
- Skills inventory: `docs/reviews/2026-04-25-skills-inventory.md`
- Original creative agents (still active, parallel hierarchy): `.agents/team/{brand-strategist,brand-voice-curator,product-designer,user-researcher,content-lead}.md`
- Plugin a11y-architect canonical: `~/.claude/plugins/cache/everything-claude-code/everything-claude-code/1.10.0/agents/a11y-architect.md`
- Plugin seo-specialist canonical: `~/.claude/plugins/cache/everything-claude-code/everything-claude-code/1.10.0/agents/seo-specialist.md`
