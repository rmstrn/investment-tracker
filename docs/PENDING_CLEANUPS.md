# Pending Cleanups — single source of truth

Tracks doc-level follow-ups that are known-to-do but intentionally deferred to avoid redundant work. Each entry has a clear trigger condition for when to fix.

**Convention:** when you complete an item, move it to «Completed» section at bottom with date + commit hash. Do not delete.

---

## Active items

### 5. Language expansion order clarifier (SMALL — do before wave-2 content work)
**Trigger:** When content-lead starts wave-2 multi-language scoping (post-alpha).
**Scope:** Add explicit ADR entry in `DECISIONS.md` clarifying: «English-first (day-1 launch locked). Wave-2 language order: Spanish → Portuguese (LATAM) → DE → IT → FR → NL (EU). Russian drafted parallel but NOT launch-gating (Russian Federation market out-of-scope per Q7; CIS non-RF diaspora still covered).» Currently implied by combining 3 locks but not explicit anywhere.
**Owner:** Navigator + content-lead.

### 7. Predecessor-name residue in 2 product docs (SMALL — Rule 4 latent violation)
**Trigger:** Anytime — flagged by brand-strategist 2026-04-27 during palette research.
**Scope:** `docs/product/02_POSITIONING.md` and `docs/product/03_NAMING.md` still reference the rejected predecessor name as «locked» (residue from naming workshops before Provedo was locked 2026-04-25). Per HARD RULE «No predecessor references» (PO directive 2026-04-27), these need to be swept to Provedo. Items to address:
- Replace predecessor name with «Provedo» throughout body content
- Bump document title/version to reflect Provedo lock (date 2026-04-25)
- Preserve naming workshop history in archived form (don't delete the rejected-candidates analysis — it's still useful for «do not revisit these names»)
- Spot-check: `grep -rn` for old name in `docs/product/` to ensure no other files affected
**PO deferred 2026-04-27:** non-blocking for current sprint (palette + design system); flagged for cleanup pass.
**Owner:** Right-Hand (drafts replacement) + brand-strategist (verifies positioning copy still composes after sweep).

### 6. Physical address for commercial email compliance (SMALL — do before first commercial email send)
**Trigger:** Before first commercial email (marketing / newsletter / trial-expiry / upgrade-offer) fires to any recipient. Transactional emails (welcome / password reset / receipt) may not need it depending on jurisdiction.
**Scope:**
- Add legal entity name + physical mailing address to email footer (both bilingual EN + RU templates)
- Required by US CAN-SPAM Act §5.5, EU ePrivacy + GDPR Article 13, Canada CASL, UK PECR
- Likely placeholder in `docs/content/email-sequences.md` footer: replace `[PHYSICAL ADDRESS PLACEHOLDER]` with actual address
- PO deferred 2026-04-23: no commercial emails being sent yet, so not blocking
**Owner:** PO (entity + address decision) → content-lead (template update) → legal-advisor (compliance verification).

### 10. plankton-code-quality auto-format hook (SMALL — defer until reviewer noise becomes painful)
**Trigger:** When tech-lead notices ≥3 PRs in a row with style-only review comments (formatter drift), or when biome/eslint/gofmt drift surfaces in code-reviewer reports.
**Scope:**
- Evaluate `everything-claude-code:plankton-code-quality` skill — write-time auto-format / lint enforcement
- Decide: project-level hook in `.claude/settings.json` PostToolUse on Write|Edit, or rely on `lefthook install` + lint-staged in pre-commit
- Risk: hook fires on every Edit/Write — measure time cost on large files before committing
**Why deferred:** Low ROI right now (CI catches drift, no signal that team is feeling friction). Cheap to add when justified.
**Owner:** tech-lead.

### 11. ui-ux-pro-max search.py path version-pin TD (SMALL — open as TD when next ui-ux-pro-max version bumps)
**Trigger:** First time `ui-ux-pro-max-skill` plugin updates past v2.5.0 (causing the hard-coded `~/.claude/plugins/cache/ui-ux-pro-max-skill/ui-ux-pro-max/2.5.0/...` path in product-designer.md and frontend-engineer.md to silently break).
**Scope:**
- Replace hard-coded version path with either (a) wildcard `2.*.0` Bash glob, (b) helper script at `scripts/uipm-search.sh` that resolves latest cached version, or (c) env-var indirection
- Update both agent files in one micro-PR
**Why deferred:** No signal of breakage yet (plugin stable since 2026-04-24). Trivial fix when triggered.
**Owner:** product-designer + frontend-engineer (single shared edit), tech-lead reviews.

### 13. Embed `## Default skill stack` section per agent (gradual rollout)
**Trigger:** Whenever an agent file in `.claude/agents/` is opened for edit (scope change / skill discovery / persona refresh).
**Scope:** Per `.claude/agents/CONSTRAINTS.md` Rule 7 «Default skill stack per agent». The CONSTRAINTS «Common skill recipes» appendix currently serves as fallback for all 17 agent files; per-agent sections are not embedded yet (deferred to keep the chore(agents) consolidation commit reviewable). Each touch of an agent file → add the matching CONSTRAINTS appendix recipe as a `## Default skill stack` section. When all 17 agents have explicit sections, simplify CONSTRAINTS Rule 7 wording (drop the fallback clause).
**PO deferred 2026-04-29:** non-blocking; gradual rollout aligned with natural agent edits.
**Owner:** Right-Hand (drafts) + per-agent persona owners (review).
**Linked TD:** TD-104.

### 12. finance-skills + c-level-skills upstream structure mismatch (LOW — track for plugin maintainer)
**Trigger:** If `claude-code-skills` plugin maintainer ships a structural fix (top-level `skills/` subdirectory) — then we can remove the user-level copies and re-enable plugin loading.
**Scope:**
- Currently 9 skills (3 finance + 6 c-level) live as direct copies in `~/.claude/skills/` — see `docs/ADR-2026-04-29-plugin-architecture.md`
- If upstream fixes structure: delete the 9 user-level copies, plugin will load 31 skills natively
- Otherwise: when bumping plugin version, manually re-copy if upstream changed content
**Why deferred:** Working as-is; upstream fix is on plugin maintainer, not us.
**Owner:** Right-Hand (notification trigger), PO decides re-deploy.

---

## Completed

### 1. Name substitution sweep — COMPLETED 2026-04-23
**Trigger:** After PO locked final product name.
**Closed:** Part of name-lock sweep commit 2026-04-23. All `[Name]` / `[Название]` / `[Product]` / `[Продукт]` / `[PRODUCT]` placeholders substituted with «Memoro» (proper noun; same EN + RU spelling). Verified by `grep -rn "\[Name\]\|\[Название\]\|\[Product\]\|\[Продукт\]" docs/` returning zero actual-placeholder matches (remaining matches describe the placeholder-substitution task itself, not actual placeholder content).
**Commit:** 3524b33.

### 2. `02_POSITIONING.md` body narrative sync — COMPLETED 2026-04-23
**Trigger:** Same as item #1 (name lock).
**Closed:** Part of name-lock sweep commit 2026-04-23. Tone of Voice, Onboarding Promise, Brand Archetype, Key Product Principles sections all synced away from «your second brain» hero-voice residue toward Memoro-as-named-agent + imperative-hero + tagline framing. Positioning Statement updated from `[PRODUCT]` placeholder to «Memoro». Document title bumped v3 → v3.1 to reflect name lock.
**Commit:** 3524b33.

### 3. Supersede earlier «Geography CIS priority» ADR — COMPLETED 2026-04-23
**Trigger:** Anytime.
**Closed:** Inline SUPERSEDED banner added to the earlier «Geography LOCKED: global multi-market with CIS priority» entry in `DECISIONS.md` prior to the name-lock sweep. The banner points to the later «Option 4 review synthesis: 7 PO decisions locked» entry (Q7) and notes Russia out-of-scope + CIS per-country post-alpha. Original entry preserved as historical record per ADR-preservation convention.
**Commit:** earlier Option-4-synthesis commit (2026-04-23); closure tracked here.

### 4. Round 5 naming annotation — COMPLETED 2026-04-23
**Trigger:** Same as item #1 (name lock).
**Closed:** Part of name-lock sweep commit 2026-04-23. `03_NAMING.md` document title bumped from «03 — Naming Workshop (IN PROGRESS)» → «03 — Naming Workshop (LOCKED: Memoro)». «RESULT 2026-04-23: MEMORO selected» annotation added at top with pronunciation, domain target, Round 5/6 preservation note. Rounds 1-6 preserved as historical record; no re-ranking inside rounds.
**Commit:** 3524b33.

---

## Convention

- Add new item with: trigger condition, scope, owner, severity tag (MAJOR/MEDIUM/SMALL).
- Severity defines work sizing, not urgency. Urgency is trigger-driven.
- When closing, move to Completed with date + commit hash.
- This file is Navigator-owned but anyone can append.
