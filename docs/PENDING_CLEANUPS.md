# Pending Cleanups — single source of truth

Tracks doc-level follow-ups that are known-to-do but intentionally deferred to avoid redundant work. Each entry has a clear trigger condition for when to fix.

**Convention:** when you complete an item, move it to «Completed» section at bottom with date + commit hash. Do not delete.

---

## Active items

### 5. Language expansion order clarifier (SMALL — do before wave-2 content work)
**Trigger:** When content-lead starts wave-2 multi-language scoping (post-alpha).
**Scope:** Add explicit ADR entry in `DECISIONS.md` clarifying: «English-first (day-1 launch locked). Wave-2 language order: Spanish → Portuguese (LATAM) → DE → IT → FR → NL (EU). Russian drafted parallel but NOT launch-gating (Russian Federation market out-of-scope per Q7; CIS non-RF diaspora still covered).» Currently implied by combining 3 locks but not explicit anywhere.
**Owner:** Navigator + content-lead.

### 6. Physical address for commercial email compliance (SMALL — do before first commercial email send)
**Trigger:** Before first commercial email (marketing / newsletter / trial-expiry / upgrade-offer) fires to any recipient. Transactional emails (welcome / password reset / receipt) may not need it depending on jurisdiction.
**Scope:**
- Add legal entity name + physical mailing address to email footer (both bilingual EN + RU templates)
- Required by US CAN-SPAM Act §5.5, EU ePrivacy + GDPR Article 13, Canada CASL, UK PECR
- Likely placeholder in `docs/content/email-sequences.md` footer: replace `[PHYSICAL ADDRESS PLACEHOLDER]` with actual address
- PO deferred 2026-04-23: no commercial emails being sent yet, so not blocking
**Owner:** PO (entity + address decision) → content-lead (template update) → legal-advisor (compliance verification).

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
