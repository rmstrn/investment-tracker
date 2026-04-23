# Pending Cleanups — single source of truth

Tracks doc-level follow-ups that are known-to-do but intentionally deferred to avoid redundant work. Each entry has a clear trigger condition for when to fix.

**Convention:** when you complete an item, move it to «Completed» section at bottom with date + commit hash. Do not delete.

---

## Active items

### 1. Name substitution sweep (MAJOR — do once name is locked)
**Trigger:** After PO locks final product name (Memoro or Round 6 winner).
**Scope:**
- Replace `[Name]` / `[Название]` placeholders across ALL docs with locked product name
- Relevant files (non-exhaustive):
  - `docs/product/02_POSITIONING.md` (footer disclaimer, multiple body refs)
  - `docs/product/03_NAMING.md` (lock annotation)
  - `docs/content/landing.md` (hero, sub, proof bullets already in English but refs to `[Name]` if any)
  - `docs/content/email-sequences.md` (when created)
  - `docs/content/microcopy.md` (when created)
  - `docs/product/STRATEGIC_OPTIONS_v1.md` (references to «the product»)
- Run Grep for `\[Name\]|\[Название\]|\[Product\]|\[Продукт\]` before commit
- **Owner:** Navigator coordinates; content-lead does substitution.

### 2. `02_POSITIONING.md` body narrative sync (MEDIUM — same sweep as #1)
**Trigger:** Same time as #1 (name lock).
**Scope:** Body text in sections still narrates Second-Brain-as-hero, though landing structure row was updated to imperative hero. Sections to retune:
- «Tone of voice» — remove «your second brain» voice references; align to imperative + tagline separation
- «Onboarding promise» narrative — remove lines like «Your second brain already knows what you hold»; replace with imperative-hero-consistent copy
- «Brand archetype» description — ensure Magician+Everyman+Sage balance reflects demoted-Second-Brain (tagline) rather than Second-Brain-as-product-identity
- «Key product principles» — verify framing still holds under tagline demotion
**Owner:** content-lead drafts, Navigator merges.

### 3. Supersede earlier «Geography CIS priority» ADR (SMALL — do anytime)
**Trigger:** Anytime — low priority.
**Scope:** In `docs/DECISIONS.md`, find the earlier 2026-04-23 «Geography LOCKED: global multi-market with CIS priority» entry and add banner at top: `**SUPERSEDED 2026-04-23 by Q7 decision: Russia out of scope; CIS per-country post-alpha.**`. Do NOT delete the original — preserve history.
**Owner:** Navigator.

### 4. Round 5 naming annotation (SMALL — do at name lock)
**Trigger:** Same as #1.
**Scope:** In `docs/product/03_NAMING.md` Round 5 section, add top-level annotation: `**Result 2026-04-23: [final name] selected. Round 5 preserved as historical.**`. No re-ordering of Pick 1/2/3 needed — historical record.
**Owner:** brand-strategist annotates, Navigator merges.

### 5. Language expansion order clarifier (SMALL — do before wave-2 content work)
**Trigger:** When content-lead starts wave-2 multi-language scoping (post-alpha).
**Scope:** Add explicit ADR entry in `DECISIONS.md` clarifying: «English-first (day-1 launch locked). Wave-2 language order: Spanish → Portuguese (LATAM) → DE → IT → FR → NL (EU). Russian drafted parallel but NOT launch-gating (market out-of-scope per Q7).» Currently implied by combining 3 locks but not explicit anywhere.
**Owner:** Navigator + content-lead.

---

## Completed

(none yet)

---

## Convention

- Add new item with: trigger condition, scope, owner, severity tag (MAJOR/MEDIUM/SMALL).
- Severity defines work sizing, not urgency. Urgency is trigger-driven.
- When closing, move to Completed with date + commit hash.
- This file is Navigator-owned but anyone can append.
