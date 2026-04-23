# User Research

**Owner:** `user-researcher` agent (dispatched by `navigator`).
**Status:** empty — no live interviews conducted yet (as of 2026-04-23).

## Purpose

Turn positioning assumptions into evidence. Validate/invalidate ICP, JTBD, and value-prop hypotheses from `docs/product/01_DISCOVERY.md` and `02_POSITIONING.md` via real customer conversations.

## Structure

```
USER_RESEARCH/
├── README.md              ← this index
├── hypotheses.md          ← live log of hypotheses with status
├── jtbd-statements.md     ← JTBD formulations per segment
├── interview-scripts/     ← Mom-Test-compliant scripts per segment
│   ├── segment-A-multi-broker.md
│   └── segment-B-ai-native-newcomer.md
├── interviews/            ← raw notes, one file per interview
│   └── YYYY-MM-DD-<pseudo>.md
└── synthesis/             ← insight reports, opportunity trees
    └── YYYY-MM-DD-<topic>.md
```

## Cadence (proposal, pending PO confirmation)

- Weekly: 1-2 interviews minimum (Torres continuous discovery)
- Bi-weekly: synthesis + hypothesis status update
- Monthly: opportunity solution tree refresh

## Key open hypotheses (from 02_POSITIONING.md)

To be listed in `hypotheses.md` once created. Top candidates to validate first:
- Chat-first preference over dashboard-first (core wedge)
- Multi-broker aggregation is top pain for ICP-A
- Weekly proactive insights > ad-hoc queries for retention
- Read-only + no-advisor-upsell is a trust trigger (not a limitation)

## Conventions

- Mom-Test compliance: past behavior > opinions about future
- All findings linked to interview refs: `[i-NNN]`
- Confidence levels: `low` (1-2 interviews) / `medium` (3-5) / `high` (6+)
- Language: Russian for synthesis, English for interview notes if conducted in English
- Never share raw PII-containing notes in commits (pseudonymize names; redact financial specifics)
