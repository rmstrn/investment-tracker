# Dispatch — product-designer — Slice-LP3.2 Universal Improvements

**Wave:** 1 (parallel with content-lead, gates Wave 2 frontend-engineer impl)
**ETA:** 4-6h
**Branch:** `feat/lp-provedo-first-pass` (PR #65 stack)
**Hard rules:** Rule 1 (no spend — no new icon-set / asset purchase) · Rule 2 (no PO-name comms) · Rule 4 (do NOT name the rejected naming predecessor)

## Source artefacts (read first)

1. `docs/kickoffs/2026-04-27-slice-lp3-2-universal-improvements.md` — full kickoff (scope items §C, §D, §E, §F)
2. `docs/04_DESIGN_BRIEF.md` v1.4 — locked Direction A (warm-neutral #FAFAF7 + slate-900 + teal-600 #0D9488; Inter + JetBrains Mono)
3. `docs/reviews/2026-04-27-phase3-brand-voice-curator-validation.md` §4 Edit #2 (Inter italic DEFAULT for §S6 closer; JBM-mono italic REJECTED)
4. `apps/web/src/app/(marketing)/_components/ProvedoNumericProofBar.tsx` — current 3-cell proof bar (you're rebalancing)
5. `apps/web/src/app/(marketing)/_components/ProvedoHeroV2.tsx` lines 461-478 — current dual-CTA stack (secondary CTA being removed)
6. `apps/web/src/app/(marketing)/_components/ProvedoRepeatCTAV2.tsx` lines 56-79 — current secondary CTA + small-print (secondary being removed)
7. `apps/web/src/app/(marketing)/_components/MarketingFooter.tsx` — current 75-word disclaimer (becomes Layer 2 collapsed)

## Deliverables (visual specs only — no implementation)

### V1 — Proof bar cell rebalance spec

**Current:** 3 cells — (1) brokers count, (2) every observation cited, (3) Lane A 100%.

**Required changes:**
- Cell #2 microcopy: «50 free chat messages a month» → «50 free questions a month» (NOTE: this is a MICROCOPY swap, not a structural change — but check whether the proof-bar carries this in addition to the hero CTA's small-print. Spec the whole-bar copy after content-lead D4 lands.)
- Cell #4 / new cell: «Lane A — Information. Not advice.» → DROP «Lane A —» prefix → «Information. Not advice.»
- ADD time-anchor cell «5 minutes a week» — content-lead recommendation per kickoff §C.7 + brand-voice-curator §1 Q1 mitigation #2 («route the 5 minutes a week to S2 proof bar as time-anchor cell, NOT into hero sub»). Kickoff says «in proof bar — NOT in hero sub (brand-voice-curator correction: keep hero locked).»

**Decision needed:** does proof-bar go from 3 → 4 cells, OR does the new time-anchor cell REPLACE one of the existing? Reasoning options:
- Option Replace: drop cell #1 (brokers count goes to S8 marquee already) and reuse the slot. Cleaner visual, same width per cell.
- Option Add: 4 cells across, narrower per cell. Requires responsive re-spec at 768/1024/1440 breakpoints.

**Output:** chosen approach + per-breakpoint spec (320 / 768 / 1024 / 1440). Include each cell's:
- Big number / token (font, size clamp, weight)
- Eyebrow text (uppercase tracking, weight, color)
- Sub-line (size, color)
- Spacing rhythm (preserve current `py-12 md:py-16` baseline, divider treatment)

### V2 — Audience-whisper visual placement

**Locked text (from content-lead):** «For investors who hold across more than one broker.» (51 chars)

**Decision:** under hero sub OR as proof-bar small-print? content-lead provides preference; you make the visual call.

Considerations:
- Under-hero placement: small text below sub-line, before CTA stack. Risk: dilutes the hero stack hierarchy. Benefit: lands before user has scrolled.
- Proof-bar small-print: lives below the proof-bar (4-cell strip), as italic micro-line. Risk: easy to miss. Benefit: doesn't clutter hero.

**Output:** chosen placement + spec (font, size, color, position, max-width, mobile/desktop behavior).

### V3 — Footer 3-layer disclaimer visual spec

**Current:** single 75-word block at bottom of footer (`MarketingFooter.tsx` lines 67-77).

**Required structure:**
- **Layer 1 (visible plain-language summary, where the 75-word block currently sits):**
  > «Provedo provides general information about your portfolio. It is not personalized investment advice — every decision stays yours.»
  (23 words, locked by legal-advisor + brand-voice-curator + PO)
- **Layer 2 (expandable native HTML `<details>`):** contains the verbatim current 75-word block. `<summary>` text per legal-advisor §2: **«Full regulatory disclosures (US, EU, UK)»** (explicit jurisdictional invitation).
- **Layer 3 (separate `/disclosures` route):** linked from Layer 2 expanded view as «Read full extended disclosures →». Frontend-engineer creates the route; you spec the link affordance.

**Output:** visual spec for the 3 layers in footer:
- Layer 1 typography (size, weight, color, max-width, line-height — match current 75-word block treatment but slightly more prominent since it's the primary visible disclaim now)
- Layer 2 `<details>`/`<summary>` styling — must look like a native interaction, not a button. Chevron indicator (consistent with FAQ pattern in `ProvedoFAQ.tsx`). Spacing for opened/closed states. Focus-visible outline.
- Layer 3 link affordance inside Layer 2 expanded content: text-link style consistent with other footer nav links.
- a11y note: indicate that the verbatim 75-word block is preserved exactly and is `aria-label`-discoverable.

### V4 — Removed-secondary-CTA visual rebalance

**Current state — 4 places affected:**
1. `ProvedoHero.tsx` lines 53-60 (V1 LEGACY — likely dead code, NOT mounted in `page.tsx`. Verify with frontend-engineer; if dead, delete file)
2. `ProvedoHeroV2.tsx` lines 466-473 (CURRENT — `<ProvedoNavLink href="/sign-up">Or start free forever</ProvedoNavLink>`) — REMOVE
3. `ProvedoRepeatCTA.tsx` lines 28-31 (V1 LEGACY — likely dead code; verify)
4. `ProvedoRepeatCTAV2.tsx` lines 56-66 (CURRENT — same NavLink pattern) — REMOVE

**Required:** with secondary CTA removed, the primary «Ask Provedo» button needs to feel right alone. Currently it sits in a flex stack with sm:flex-row alignment.

**Output:** visual spec for hero + repeat CTA after removal:
- Centering / alignment (currently `flex-col items-center gap-4 sm:flex-row lg:items-start` — likely simplify)
- Spacing above/below the lonely primary CTA (visual breathing room)
- Small-print «No card. 50 free questions a month.» — keep position but verify it doesn't look orphaned without the «Or...» text-link above
- Repeat CTA at S10 — same treatment, but the current `mt-4` Plus pricing link («Or see Plus pricing →» at line 71-78) remains. So actually only the «Or start free forever» line removes; the «Or see Plus pricing →» stays. Confirm visually.

### V5 — S7 single weighted testimonial layout

**Current:** 3-card grid (`md:grid-cols-2 lg:grid-cols-3`).
**Required:** collapse to single card center-stage. Must not look lonely or under-designed.

**Output:** spec for single-quote layout:
- Card width / max-width (recommend max-width ~640px centered)
- Card padding adjusted to feel substantial as single artifact
- Quote typography size bump (consider one-step-larger for solo treatment)
- «Alpha quotes coming Q2 2026.» line position — under the quote? Under the section header? content-lead provides copy; you place it.
- Section header copy stays «What testers will be noticing.» (or per content-lead D3 revision)

## Constraints

- Do NOT propose any A/B/C strategic-posture changes (no audience-named hero, no negation-hero reorder, no sources-strip section, no JBM-mono editorial accent test).
- Do NOT touch hero head/sub typography (locked).
- Do NOT modify v3.1 finance/legal patch surfaces at `8cb509b` (Tab 3 framing, Tab 4 benchmark, FAQ Q4, footer 75-word block as content — only Layer 2 wrapping changes).
- Stay within existing token system (`docs/04_DESIGN_BRIEF.md` v1.4). No new color, no new typeface.
- No motion changes outside the existing 5 animation rules.

## Acceptance criteria

- [ ] V1 — proof-bar rebalance spec (decision: 3 vs 4 cells; per-cell typography/copy; per-breakpoint behavior)
- [ ] V2 — audience-whisper placement chosen + spec
- [ ] V3 — 3-layer footer disclaimer visual spec (Layer 1 typography, Layer 2 `<details>` styling + summary text, Layer 3 link affordance)
- [ ] V4 — secondary-CTA-removed hero + repeat-CTA layout spec (4 places; flag dead-code candidates)
- [ ] V5 — single-quote S7 testimonial layout spec

## Output location

Write specs to `docs/design/slice-lp3-2-product-designer-specs.md` (single file with V1-V5 sectioned). frontend-engineer reads this when implementing.

## Report back

When complete, report to tech-lead with:
- Path to spec file
- Any decisions deferred to frontend-engineer (e.g., dead-code verification)
- Any coordination items with content-lead (e.g., audience-whisper placement preference alignment)
