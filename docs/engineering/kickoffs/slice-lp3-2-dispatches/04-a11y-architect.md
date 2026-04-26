# Dispatch — a11y-architect — Slice-LP3.2 Universal Improvements

**Wave:** 2 (parallel with frontend-engineer impl; can draft checklist now, apply when impl ready)
**ETA:** 1-2h
**Branch:** `feat/lp-provedo-first-pass` (PR #65 stack)
**Hard rules:** Rule 1 (no spend) · Rule 2 (no PO-name comms) · Rule 4 (no rejected predecessor reference)

## Source artefacts (read first)

1. `docs/kickoffs/2026-04-27-slice-lp3-2-universal-improvements.md` — full kickoff
2. `docs/reviews/2026-04-27-phase3-legal-advisor-validation.md` §2 — `<details>` a11y nuance (some AT/browser combos suppress collapsed content from a11y tree → Layer 3 always-visible link is the regulator-readability belt-and-suspenders)
3. `docs/design/slice-lp3-2-product-designer-specs.md` — when product-designer ships
4. `apps/web/src/app/(marketing)/_components/ProvedoFAQ.tsx` — current `<details>`/`<summary>` reference pattern (chevron + onFocus/onBlur outline)

## Audit scope

### A1 — 3-layer disclaimer `<details>` keyboard + screen-reader audit

**What to verify on Vercel preview when frontend ships:**

- **Keyboard:**
  - Tab focus reaches `<summary>` element with visible focus ring (currently `2px solid var(--provedo-accent)` outline + `2px` offset per ProvedoFAQ pattern)
  - Enter / Space toggles open/close
  - When open, Tab continues to focusable children (the `/disclosures` link inside Layer 2 expanded content)
  - Shift-Tab reverses correctly
- **Screen reader (test on at least 1 combo: NVDA+Firefox or VoiceOver+Safari, document which):**
  - `<summary>` announced with current state (collapsed/expanded)
  - Verbatim 75-word block reachable when expanded
  - The `/disclosures` link has descriptive text («Read full extended disclosures»)
- **Per legal-advisor §2:** the 75-word verbatim block must be reachable via Layer 3 ALWAYS-visible link too — verify the footer also has a direct «/disclosures» path that doesn't require operating the `<details>` toggle.

**Mitigation if `<details>` content is suppressed in collapsed state:** flag as TD or push frontend to add an `aria-controls` + visually-equivalent script-driven fallback. Default native pattern is preferred per legal §2 if a11y-clean.

### A2 — `/disclosures` page audit

**What to verify:**

- Page has single `<h1>` with «Regulatory disclosures»
- Section structure uses semantic `<h2>`/`<h3>` hierarchy (no skip levels)
- Body is reading-order linear (no positioned-absolute breakouts)
- Skip-to-content link works (if present in marketing layout)
- Color contrast meets WCAG AA on body text (check teal accent against page bg if used)
- No interactive elements without accessible name
- Page renders without JS (SSR-only; no client-side disclaimer text)

### A3 — Audience-whisper reading-order check

**What to verify:**

- Wherever audience-whisper «For investors who hold across more than one broker.» lands (under hero sub OR as proof-bar small-print per product-designer V2), it appears in DOM in correct reading order — visual-order matches DOM-order
- Screen-reader announces the line at the right moment in the page narrative (not orphaned at top, not lost mid-proof-bar)
- Text contrast meets WCAG AA (likely small/tertiary-color text — verify ratio)
- If italicized, ensure it's not announced with weird emphasis breaks

### A4 — Removed-secondary-CTA flow check

**What to verify (regression):**

- After hero secondary CTA removed: tab order remains logical (CTA → small-print → next section)
- After repeat-CTA secondary removed but «Or see Plus pricing →» kept: focus order makes sense
- No orphan focus traps from removed elements
- No empty wrapper divs creating unexpected focus stops

### A5 — Single testimonial layout regression

**What to verify:**

- Single `<figure>` carries `<blockquote>` + `<figcaption>` semantics correctly
- Section heading still announces correctly (`<h2 id="testimonials-heading">`)
- «Alpha quotes coming Q2 2026.» line is in the reading flow, not orphaned

## Output

Write to `docs/reviews/2026-04-27-a11y-slice-lp3-2-audit.md` with:

- A1-A5 verification results (PASS / FAIL / FAIL-MITIGATED)
- For any FAIL: minimal patch suggestion to frontend-engineer
- For any FAIL-MITIGATED: the mitigation
- One line per audit area with PASS/FAIL/N-A
- Any newly-discovered TDs to file in `docs/TECH_DEBT.md`

## Reduced-motion regression check

Verify no NEW reduced-motion violations introduced (existing 5-rule compliance held). Specifically:
- New audience-whisper line: no animation (text appears statically)
- 3-layer disclaimer: `<details>` open/close uses default browser behavior (no animated reveal of body — that's a no-op for prefers-reduced-motion since native is instant)
- Proof-bar new time-anchor cell: if it uses `<AnimatedNumber>`, verify it respects `prefersReducedMotion` per existing pattern

## Report back

When complete, report to tech-lead with:
- Path to audit doc
- PASS/FAIL summary
- Any blocking issues for frontend-engineer
- Any new TDs filed
