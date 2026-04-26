# archive/

Historical and superseded documents. Preserved for git history + audit trail; no active use.

| Subfolder | Contents |
|---|---|
| [session-snapshots/](session-snapshots/) | Old session-resume snapshots (>3 days, no longer canonical — current state lives in `strategic/PO_HANDOFF.md`) |
| [landing-evolution/](landing-evolution/) | Old landing copy versions (v1, v2). Current landing copy lives in `apps/web/src/app/(marketing)/` (code) and `content/` (any active microcopy specs). |

## When to archive

- Session-resume snapshots: after 3 days, when content has been absorbed into PO_HANDOFF.md
- Landing/content versions: when superseded by new version that has shipped to staging
- Specs: when implementation has shipped + spec no longer matches current code

## When NOT to archive (keep in active folder)

- Historical decisions: stay in `strategic/DECISIONS.md` (append-only log)
- Naming/positioning lock history: stay in `product/NAMING.md` (history section)
- Closed kickoffs: stay in `engineering/kickoffs/` (audit trail; don't move)
