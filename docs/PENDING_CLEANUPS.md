# Pending Cleanups — single source of truth

Tracks doc-level follow-ups that are known-to-do but intentionally deferred to avoid redundant work. Each entry has a clear trigger condition for when to fix.

**Convention:** when you complete an item, move it to «Completed» section at bottom with date + commit hash. Do not delete.

**State as of 2026-04-29:** 7 active items reviewed. None can be closed yet — all triggers still pending. Item #7 verified still active via grep (predecessor name appears in 4 files; 35 occurrences in `03_NAMING.md` alone). No code-work items present (those live in `TECH_DEBT.md`).

**Next-actions sized SMALL** (can be done opportunistically): #7 (predecessor sweep — bounded to 4 files), #5 (single ADR entry), #6 (text + entity decision).

**Next-actions sized DEFERRED** (waiting external signal): #10 (style-only PR threshold), #11 (plugin version bump), #12 (upstream maintainer fix), #13 (gradual rollout, ongoing).

---

## Active items

### 5. Language expansion order clarifier (SMALL — do before wave-2 content work)
**Trigger:** When content-lead starts wave-2 multi-language scoping (post-alpha).
**Last reviewed:** 2026-04-29 — still pending; no wave-2 work scheduled.
**Scope:** Add explicit ADR entry in `DECISIONS.md` clarifying: «English-first (day-1 launch locked). Wave-2 language order: Spanish → Portuguese (LATAM) → DE → IT → FR → NL (EU). Russian drafted parallel but NOT launch-gating (Russian Federation market out-of-scope per Q7; CIS non-RF diaspora still covered).» Currently implied by combining 3 locks but not explicit anywhere.
**Owner:** Right-Hand + content-lead.

### 6. Physical address for commercial email compliance (SMALL — do before first commercial email send)
**Trigger:** Before first commercial email (marketing / newsletter / trial-expiry / upgrade-offer) fires to any recipient. Transactional emails (welcome / password reset / receipt) may not need it depending on jurisdiction.
**Last reviewed:** 2026-04-29 — still pending; no commercial email system online yet.
**Scope:**
- Add legal entity name + physical mailing address to email footer (both bilingual EN + RU templates)
- Required by US CAN-SPAM Act §5.5, EU ePrivacy + GDPR Article 13, Canada CASL, UK PECR
- Likely placeholder in `docs/content/email-sequences.md` footer: replace `[PHYSICAL ADDRESS PLACEHOLDER]` with actual address
**Owner:** PO (entity + address decision) → content-lead (template update) → legal-advisor (compliance verification).

### 7. Predecessor-name residue in product docs (SMALL — Rule 4 latent violation)
**Trigger:** Anytime — flagged 2026-04-27 by brand-strategist; verified still active 2026-04-29.
**Last reviewed:** 2026-04-29 — confirmed via grep.
**Verified scope (2026-04-29 grep):**
- `docs/product/03_NAMING.md` — 35 occurrences (highest density; many are historical workshop context that should stay flagged-as-rejected, NOT swept)
- `docs/product/02_POSITIONING.md` — ~9 occurrences (current-state references; SHOULD be swept to Provedo)
- `docs/product/REVIEW_SYNTHESIS_2026-04-23.md` — historical synthesis doc (preserve as historical, OK)
- `docs/product/STRATEGIC_OPTIONS_v1.md` — historical strategy doc (preserve as historical, OK)

**Sweep policy (decided 2026-04-29):**
- **02_POSITIONING.md:** sweep ALL «Memoro» → «Provedo» (it's a current-state doc, predecessor name there is direct Rule 4 violation; bump version v3.1 → v3.2 noting Provedo lock)
- **03_NAMING.md:** preserve workshop history (rounds 1-6) as-is; sweep ONLY current-state «LOCKED» banner + result-line annotations; doc title bump to «LOCKED: Provedo»
- **REVIEW_SYNTHESIS + STRATEGIC_OPTIONS:** preserve as historical record; add a one-line top-banner «HISTORICAL — superseded by Provedo lock 2026-04-25»

**Owner:** content-lead (sweep) + brand-strategist (verifies positioning copy still composes after sweep). Right-Hand drafts kickoff once a slot opens.

**PO directive:** non-blocking for current sprint (Phase 2 charts + post-review fixes); flagged for next-available cleanup slot. Real Rule 4 violation but bounded.

### 10. plankton-code-quality auto-format hook (SMALL — defer until reviewer noise becomes painful)
**Trigger:** When tech-lead notices ≥3 PRs in a row with style-only review comments (formatter drift), or when biome/eslint/gofmt drift surfaces in code-reviewer reports.
**Last reviewed:** 2026-04-29 — no signal yet.
**Scope:**
- Evaluate `everything-claude-code:plankton-code-quality` skill — write-time auto-format / lint enforcement
- Decide: project-level hook in `.claude/settings.json` PostToolUse on Write|Edit, or rely on `lefthook install` + lint-staged in pre-commit
- Risk: hook fires on every Edit/Write — measure time cost on large files before committing
**Why deferred:** Low ROI right now (CI catches drift, no signal that team is feeling friction). Cheap to add when justified.
**Owner:** tech-lead.

### 11. ui-ux-pro-max search.py path version-pin (SMALL — open as TD when next ui-ux-pro-max version bumps)
**Trigger:** First time `ui-ux-pro-max-skill` plugin updates past v2.5.0 (causing the hard-coded `~/.claude/plugins/cache/ui-ux-pro-max-skill/ui-ux-pro-max/2.5.0/...` path in product-designer.md and frontend-engineer.md to silently break).
**Last reviewed:** 2026-04-29 — no signal; plugin stable at v2.5.0 since 2026-04-24.
**Scope:**
- Replace hard-coded version path with either (a) wildcard `2.*.0` Bash glob, (b) helper script at `scripts/uipm-search.sh` that resolves latest cached version, or (c) env-var indirection
- Update both agent files in one micro-PR
**Why deferred:** No signal of breakage. Trivial fix when triggered.
**Owner:** product-designer + frontend-engineer (single shared edit), tech-lead reviews.

### 12. finance-skills + c-level-skills upstream structure mismatch (LOW — track for plugin maintainer)
**Trigger:** If `claude-code-skills` plugin maintainer ships a structural fix (top-level `skills/` subdirectory) — then we can remove the user-level copies and re-enable plugin loading.
**Last reviewed:** 2026-04-29 — no upstream signal.
**Scope:**
- Currently 9 skills (3 finance + 6 c-level) live as direct copies in `~/.claude/skills/` — see `docs/ADR-2026-04-29-plugin-architecture.md`
- If upstream fixes structure: delete the 9 user-level copies, plugin will load 31 skills natively
- Otherwise: when bumping plugin version, manually re-copy if upstream changed content
**Why deferred:** Working as-is; upstream fix is on plugin maintainer, not us.
**Owner:** Right-Hand (notification trigger), PO decides re-deploy.

### 13. Embed `## Default skill stack` section per agent (gradual rollout)
**Trigger:** Whenever an agent file in `.claude/agents/` is opened for edit (scope change / skill discovery / persona refresh).
**Last reviewed:** 2026-04-29 — appendix in CONSTRAINTS.md amended to mandate `superpowers:brainstorming` baseline; per-agent embed deferred.
**Scope:** Per `.claude/agents/CONSTRAINTS.md` Rule 7 «Default skill stack per agent». The CONSTRAINTS «Common skill recipes» appendix currently serves as fallback for all 17 agent files; per-agent sections are not embedded yet (deferred to keep cleanup commits reviewable). Each touch of an agent file → add the matching CONSTRAINTS appendix recipe as a `## Default skill stack` section. When all 17 agents have explicit sections, simplify CONSTRAINTS Rule 7 wording (drop the fallback clause).
**Owner:** Right-Hand (drafts) + per-agent persona owners (review).
**Linked TD:** TD-104.

---

## Completed

### 1. Name substitution sweep — COMPLETED 2026-04-23
**Trigger:** After PO locked final product name.
**Closed:** Part of name-lock sweep commit 2026-04-23. All `[Name]` / `[Название]` / `[Product]` / `[Продукт]` / `[PRODUCT]` placeholders substituted with the original locked name (later superseded; see item #7 above).
**Commit:** 3524b33.

### 2. `02_POSITIONING.md` body narrative sync — COMPLETED 2026-04-23
**Trigger:** Same as item #1 (name lock).
**Closed:** Part of name-lock sweep commit 2026-04-23. Tone of Voice, Onboarding Promise, Brand Archetype, Key Product Principles sections all synced. (Predecessor-name residue from this work is item #7 above — re-introduced by the later Provedo rebrand 2026-04-25.)
**Commit:** 3524b33.

### 3. Supersede earlier «Geography CIS priority» ADR — COMPLETED 2026-04-23
**Trigger:** Anytime.
**Closed:** Inline SUPERSEDED banner added to the earlier «Geography LOCKED: global multi-market with CIS priority» entry in `DECISIONS.md` prior to the name-lock sweep. The banner points to the later «Option 4 review synthesis: 7 PO decisions locked» entry (Q7) and notes Russia out-of-scope + CIS per-country post-alpha. Original entry preserved as historical record per ADR-preservation convention.
**Commit:** earlier Option-4-synthesis commit (2026-04-23); closure tracked here.

### 4. Round 5 naming annotation — COMPLETED 2026-04-23
**Trigger:** Same as item #1 (name lock).
**Closed:** Part of name-lock sweep commit 2026-04-23. (Annotation later superseded by item #7 Provedo lock; rounds 1-6 preserved as historical record.)
**Commit:** 3524b33.

---

## Convention

- Add new item with: trigger condition, scope, owner, severity tag (MAJOR/MEDIUM/SMALL).
- Severity defines work sizing, not urgency. Urgency is trigger-driven.
- When closing, move to Completed with date + commit hash.
- Each active item should carry a «Last reviewed:» line refreshed at least once per major sweep session.
- This file is Right-Hand-owned but anyone can append.
