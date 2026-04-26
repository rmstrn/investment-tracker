# reviews/

Multi-agent validations, audits, syntheses. Date-prefixed (`YYYY-MM-DD-descriptor-role.md`) for chronological auditing.

## How to navigate

Files are flat (no subfolders) — use search by:
- **Date prefix** for chronology
- **Role suffix** (`-product-designer`, `-finance-advisor`, `-legal-advisor`, `-brand-voice-curator`, `-brand-strategist`, `-content-lead`, `-user-researcher`, `-a11y-architect`, `-tech-lead`, `-qa-engineer`)
- **Topic in middle** (`landing-audit`, `validation`, `synthesis`, `phase3`)

## Lifecycle

A typical multi-agent dispatch produces these review files in sequence:
1. Input audits (per-specialist research) — e.g., `2026-04-27-ai-tool-landing-audit-product-designer.md`
2. Synthesis (cross-input integration) — e.g., `2026-04-27-redesign-synthesis-product-designer.md`
3. Phase-3 validators (independent verdicts) — e.g., `2026-04-27-phase3-finance-advisor-validation.md`
4. Implementation kickoff lives in `engineering/kickoffs/` (NOT here)

## When to add files here

ANY multi-agent dispatch that produces a written analysis/verdict for right-hand or PO synthesis. Per-builder commit history goes in `git log`, not here.

## Owner

Multi-role. Each file's specialist owner is named in its file (in the H1 or in author frontmatter).
