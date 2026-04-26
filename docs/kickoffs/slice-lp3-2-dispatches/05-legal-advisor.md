# Dispatch — legal-advisor — Slice-LP3.2 Layer 3 sign-off

**Wave:** 2 (parallel with frontend-engineer; gates Layer 3 ship)
**ETA:** 1-2h
**Branch:** `feat/lp-provedo-first-pass` (PR #65 stack)
**Hard rules:** Rule 1 (no spend — no external counsel engagement) · Rule 2 (no comms with regulators or external parties) · Rule 4 (no rejected predecessor reference)

## Background

Phase 3 legal-advisor verdict on `2026-04-27-phase3-legal-advisor-validation.md`:
- Layer 1 wording SIGNED-WITH-EDIT (already locked by PO with your edit applied: «general» + «personalized»).
- Layer 2 GO with conditions (`<summary>` text fix + Layer 3 simultaneous ship — both being implemented).
- **Layer 3 `/disclosures` sub-page** — required to ship simultaneously with Layer 2; full extended text not yet drafted.

content-lead D2 deliverable produces the Layer 3 page text. Your job: sign-off on the wording before frontend ships.

## Source artefacts

1. `docs/reviews/2026-04-27-phase3-legal-advisor-validation.md` (your prior verdict)
2. `docs/reviews/2026-04-26-legal-advisor-landing-review.md` (your v3.1 verdict — `8cb509b` patches lineage)
3. `docs/content/slice-lp3-2-content-lead-deliverables.md` §D2 — Layer 3 draft text (content-lead delivers)
4. `apps/web/src/app/(marketing)/_components/MarketingFooter.tsx` lines 67-77 — current 75-word block (must be preserved as Layer 2 verbatim, also forms the spine of Layer 3)

## Sign-off scope

Verify Layer 3 `/disclosures` page text:

### Required content elements (per your Phase 3 §2 belt-and-suspenders + §9 verbatim-preservation)

1. **«Not registered investment advisor / not broker-dealer» negation** — explicit, in plain language. Already in v3.1 footer block; confirm preserved or expanded in Layer 3.
2. **«No personalized recommendations»** — the SEC personalization-element phrase. Confirm explicitly stated.
3. **Per-jurisdiction citations:**
   - US Investment Advisers Act of 1940 — surface acknowledgment
   - EU MiFID II (Directive 2014/65/EU) — surface acknowledgment
   - UK FSMA 2000 — surface acknowledgment
4. **Past performance disclaimer** — «past performance is not indicative of future results» (or equivalent)
5. **«All investment decisions are your own. Consult a licensed financial advisor in your jurisdiction.»** — preserved
6. **«Last updated» date** — present (2026-04-27)

### Voice / tone audit

- Sage register, observation/disclaim only — NO advice / recommendation / strategy / suggestion verbs
- Plain language but legally defensible (Consumer Duty + SEC clear-and-prominent + MiFID II «fair, clear, not misleading»)
- 400-700 word range per kickoff

### Forward-operational risk check

- Does any new wording create a NEW commitment beyond v3.1's footer block surface? Flag if so.
- Is any phrasing softer than v3.1 in a way that would dilute regulator-readability? Flag if so.
- Does Layer 3 text align with Layer 1's 23-word summary («Provedo provides general information about your portfolio. It is not personalized investment advice — every decision stays yours.»)? Confirm consistency.

### Per-jurisdiction read (light touch — full per-jurisdiction dispatch already complete in your prior Phase 3 report)

- US SEC: passes Marketing Rule clear-and-prominent + publisher-exclusion belt-and-suspenders
- EU MiFID II: passes Article 24(3) fair-clear-not-misleading
- UK FCA: passes COBS 4.2.1R + Consumer Duty PRIN 2A plain-language preference
- Russia 39-ФЗ: out of scope (geography-lock 2026-04-23)

## Output

Write sign-off to `docs/reviews/2026-04-27-legal-layer3-signoff.md`:

- **Verdict:** SIGNED / SIGNED-WITH-EDIT / NOT-SIGNED-NEEDS-REWRITE
- If SIGNED-WITH-EDIT: minimal word-level edits with rationale per edit
- If NOT-SIGNED: required structural changes
- One paragraph per-jurisdiction quick-read (US / EU / UK) — light, your prior report carried the depth
- **[ATTORNEY REVIEW] flag** — note that final pre-launch jurisdictional clearance still requires licensed counsel per Rule 1 caveat (not initiated this slice)

## Constraints

- Do NOT initiate any external counsel contact (Rule 1)
- Do NOT modify the verbatim 75-word block at `MarketingFooter.tsx` lines 67-77 — that's preserved as Layer 2 unchanged
- Do NOT modify Layer 1 wording (already locked: «Provedo provides general information about your portfolio. It is not personalized investment advice — every decision stays yours.»)

## Report back

When complete, report to tech-lead with:
- Path to sign-off doc
- Verdict (SIGNED / SIGNED-WITH-EDIT / NOT-SIGNED)
- Any edits frontend-engineer must apply before merge
