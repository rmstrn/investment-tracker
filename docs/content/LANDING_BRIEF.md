# Landing Brief (Navigator → content-lead)

**Date:** 2026-04-23
**From:** Navigator
**To:** content-lead
**Type:** Creative dispatch — landing hero + top-of-fold, English day-1
**Return format:** `docs/content/landing.md` with Second Brain direction as v1, English primary + Russian secondary; brief summary to Navigator.

---

## Team-wide constraints reminder (MANDATORY)

Per `.agents/team/CONSTRAINTS.md` (PO-locked 2026-04-23):
1. **No spend without explicit PO approval.** This brief needs no spend — landing copy is a markdown draft in the repo. If you find yourself suggesting a paid tool (e.g. Grammarly Premium, copy.ai, a paid stock-image search), surface as recommendation labeled with cost; default to free alternative.
2. **No external communication from PO's identity.** Specifically for this dispatch: **no email sends, no social posts, no newsletter publishes, no launch announcements**. Your output is DRAFT only in the repo. Email copy and social posts stay as drafts in `docs/content/email-sequences.md` / `docs/content/social.md` for PO's personal review before any external send. Nothing in this dispatch leaves the repo.

---

## Context — what PO locked 2026-04-23

Option 4 «Second Brain for Your Portfolio» is the locked strategic direction. See `docs/DECISIONS.md` 2026-04-23 entry and `docs/product/02_POSITIONING.md` v2.

Hero conceptually locked:
- **English:** «Second Brain for Your Portfolio»
- **Russian:** «Второй мозг для твоего портфеля»

Sub-hero direction in `02_POSITIONING.md` v2 landing-structure table:
- **English:** «Remembers. Notices. Explains.»
- **Russian:** «Помнит. Замечает. Объясняет.»

**Language scope (changed 2026-04-23):** English-first launch. Day-1 content is English only. Russian is parallel-drafted as secondary (ready for post-launch wave). EU languages (DE / IT / ES / FR / PT) deferred entirely. Your primary craft is English; Russian is parallel-secondary, not parallel-primary.

---

## Locked voice (from `02_POSITIONING.md` v2)

- **Archetype:** Magician + Sage primary, Everyman modifier. Notion / Obsidian / Linear intonation applied to finance.
- **Tone:** calm, specific, memory-oriented verbs (remembers, notices, explains, surfaces, reads, holds context). Zero hype, zero advisor-paternalism, zero «buy» signals.
- **Form:** short, direct, conversational. Imperative mood for CTAs («Ask», «See», «Connect»).
- **Regulatory constraint (Lane A — LOCKED):** AI never uses imperatives about user actions («buy X», «sell Y», «rebalance now» forbidden). Only `analyze / highlight / explain / surface / observe patterns`. Your landing copy and any mock AI-response copy in demo tabs must respect this — not as compliance caveat but as product identity.

---

## Your task — landing hero + top-of-fold, production-ready English draft

Deliver these artifacts in `docs/content/landing.md`:

### 1. Hero — final locked pair

- **English:** «Second Brain for Your Portfolio» (locked verbatim — you don't rewrite the hero itself; you confirm it as section-1 headline).
- **Russian (secondary parallel):** «Второй мозг для твоего портфеля» (locked).

No rewrite of hero. Your craft is everything BELOW the hero.

### 2. Sub-hero — 3 candidate variants

The sub-hero direction «Remembers. Notices. Explains.» is the v2 lock starting point. Produce 3 candidate variants that either:
- (a) Confirm that phrasing is final.
- (b) Tighten it (fewer syllables, better rhythm).
- (c) Alternate it with an equally-good option (same verbs, different structure — e.g. «Remembers what you hold. Notices what you miss. Explains what it sees.»).

For each variant provide:
- English line.
- Russian parallel-secondary line.
- Character count (target ≤80 chars English, ≤100 Russian — memory-metaphor copy tolerates slightly longer than general hero-sub budget).
- Rhythm read (staccato triplet? one-flowing? imperative-chain?).
- Which variant best carries cognition in 3-4 seconds.
- Your recommended pick.

### 3. Top-of-fold — 3 proof bullets supporting the Second Brain metaphor

One bullet per primary surface, with deliberate tight mapping to chat / insights / coach:

- **Bullet 1 (chat / recall) —** the «you ask, it answers on your actual holdings with sources» proof.
- **Bullet 2 (insights / notice) —** the «it surfaces dividends, drawdowns, concentration before you do» proof.
- **Bullet 3 (coach / pattern-recognition) —** the «it reads patterns in your trades without judgment» proof.

For each bullet:
- English primary line (≤120 chars, ≤90 ideal for scan-rhythm).
- Russian parallel-secondary line.
- Rationale: why this bullet lands the surface it's mapped to.
- Regulatory check (Lane A compliant — no «buy/sell» imperatives, no performance promises, no «we advise» language).

### 4. Alternates table

For each of hero-sub and the 3 proof bullets, include at least 1 alternate worth keeping in the repo for future A/B testing. Mark recommended vs alternate.

### 5. Landing structure subtitles (sections 2, 3, 4)

Per `02_POSITIONING.md` v2 landing structure table, sections 2/3/4 have locked subtitles. Confirm each subtitle as-is, OR propose tightening if the copy can read better. Structure:

| # | Section | Locked English subtitle | Your confirm/revise |
|---|---|---|---|
| 2 | 4 tabs (demo scenarios) | «Four things it can do on your actual holdings.» | confirm or revise |
| 3 | Insights (what it notices) | «Dividends, drawdowns, events — your second brain surfaces them before you do.» | confirm or revise |
| 4 | Aggregation (what it holds) | «1000+ brokers and exchanges.» | confirm or revise |

### 6. Output file

Save all above to `docs/content/landing.md`. Structure:
- §1. Hero (locked, both languages)
- §2. Sub-hero — 3 variants + recommendation
- §3. Proof bullets — 3 final bullets + alternates
- §4. Section subtitles — confirmed / revised
- §5. Regulatory checklist (Lane A compliance pass per bullet)
- §6. Open questions for PO (if any)

### 7. Brief summary back to Navigator

- Recommended hero + sub + 3 proof bullets (English primary, Russian parallel).
- Alternates table pointer (where to find alternates in the file).
- Rationale summary (1 paragraph).
- Any regulatory concerns.
- Open questions for PO.

---

## Content voice-check (do this before you finalize)

Every line must pass these filters:

- [ ] Is it in memory-oriented vocabulary (remembers / notices / explains / surfaces / reads / holds / sees)?
- [ ] Does it avoid «buy / sell / should / must / will outperform»?
- [ ] Does it avoid advisor-paternalism («we recommend», «our experts»)?
- [ ] Is it specific (names a real capability: portfolio context, sources, patterns) not abstract?
- [ ] Does the bullet map tight to ONE surface, not blur three?
- [ ] Is the English primary native-craft (not translated-feeling)?
- [ ] Does the Russian read as natural secondary, not word-for-word calque?

If any bullet fails a filter → revise before returning.

---

## Explicit DO NOT list

- **Do NOT send any email**, even a «test» email to PO's address.
- **Do NOT publish any social post**, draft or otherwise, outside the repo.
- **Do NOT modify `02_POSITIONING.md` landing structure** — your scope is copy inside locked structure, not structure itself. If you think the structure needs revision, flag as open question for PO via Navigator.
- **Do NOT rewrite the locked hero itself.** «Second Brain for Your Portfolio» / «Второй мозг для твоего портфеля» are PO-locked verbatim.
- **Do NOT invent new voice rules.** Consume `02_POSITIONING.md` v2 §Brand archetype + §Tone of voice. If a surface needs tone rules not in that doc, request brand-strategist input via Navigator.
- **Do NOT assume EU languages are in scope.** English day-1. Russian parallel-secondary. EU languages deferred — do not draft them.

---

## Inputs you can rely on

- `docs/product/02_POSITIONING.md` v2 — hero locked; landing structure (table); archetype; tone of voice; competitor differentiation summary.
- `docs/DECISIONS.md` — 2026-04-23 entries (Option 4 lock, Lane A, English-first).
- `docs/product/STRATEGIC_OPTIONS_v1.md` v1.3 — Option 4 pitch + sub-proof direction.
- `docs/04_DESIGN_BRIEF.md` §2 (brand voice), §13 (paywall / pricing), §14 (callout / impact cards — for demo-tab mock copy reference).

---

## Acceptance criteria for your return

- [ ] `docs/content/landing.md` created with 6 sections per the structure above.
- [ ] 3 sub-hero candidate variants + recommendation.
- [ ] 3 proof bullets + alternates + regulatory checklist.
- [ ] English primary + Russian parallel-secondary for every surface.
- [ ] Brief summary back to Navigator.
- [ ] No emails sent. No social posts published. No external communication of any kind.
