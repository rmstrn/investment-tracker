# Dispatch — frontend-engineer — Slice-LP3.2 Universal Improvements

**Wave:** 2 (depends on Wave 1 content-lead + product-designer; legal-advisor sign-off on Layer 3 needed before that file lands)
**ETA:** 6-8h
**Branch:** `feat/lp-provedo-first-pass` (PR #65 stack — DO NOT branch off; commit on top)
**Base SHA:** `409cda9` (post-Memoro purge)
**Hard rules:** Rule 1 (no new dependencies / paid services) · Rule 2 (no PO-name comms) · Rule 4 (do NOT name the rejected naming predecessor in any commit/code/comment)

## Source artefacts (read first)

1. `docs/kickoffs/2026-04-27-slice-lp3-2-universal-improvements.md` — full kickoff
2. `docs/content/slice-lp3-2-content-lead-deliverables.md` — your copy source (from content-lead)
3. `docs/design/slice-lp3-2-product-designer-specs.md` — your visual specs (from product-designer)
4. `docs/reviews/2026-04-27-phase3-legal-advisor-validation.md` §9 — 5 verbatim artefacts that MUST NOT change (Tab 3 framing, Tab 3 simultaneous animation, footer 75-word block, FAQ Q4 $9/mo, Tab 4 sourced benchmark)
5. `docs/reviews/2026-04-27-phase3-brand-voice-curator-validation.md` §4 Edit #2 — keep §S6 closer in Inter italic (NOT JBM-mono)
6. Phase 3 a11y considerations — see a11y-architect dispatch (parallel)

## Implementation work (11 scope items from kickoff)

### A. Demo content fidelity

1. **S4 demo tabs (Tab 1-4) content rewrite** in `apps/web/src/app/(marketing)/_components/ProvedoDemoTabsV2.tsx`. Replace bracketed/placeholder content with content-lead D1 deliverable (Granola-grade fully-written examples). Tab 3 + Tab 4 MUST inherit verbatim phrasing from `8cb509b` per legal §9. Chart data shape may need micro-adjustments — coordinate with content-lead notes.

### B. Three-layer disclaimer (Layer 1 + Layer 2 + Layer 3 ship SIMULTANEOUSLY)

2. **Layer 1 plain-language summary** — replace current 75-word block in `MarketingFooter.tsx` lines 67-77 with locked Layer 1 wording:
   > «Provedo provides general information about your portfolio. It is not personalized investment advice — every decision stays yours.»
   Apply product-designer V3 typography spec.

3. **Layer 2 expandable native HTML `<details>`** — wrap verbatim 75-word block (current text exactly, do NOT modify) inside `<details>`/`<summary>`. Summary text: «Full regulatory disclosures (US, EU, UK)». Use the same chevron pattern as `ProvedoFAQ.tsx` (group-open:rotate-180 SVG, focus-visible outline via onFocus/onBlur to keep keyboard nav). Apply product-designer V3 spec.

4. **Layer 3 `/disclosures` page** — create new route at `apps/web/src/app/(marketing)/disclosures/page.tsx`. Use content-lead D2 text. Add `Metadata` with title «Regulatory disclosures · Provedo», `robots: { index: false, follow: false }` (matches staging posture). Layout inherits from `(marketing)/layout.tsx`. Add link from Layer 2 expanded content («Read full extended disclosures →»).

### C. Proof bar revisions (in `ProvedoNumericProofBar.tsx`)

5. **Drop «Lane A —» prefix** from cell #3 (currently line 215: `Lane A — information not advice` → `Information. Not advice.`).

6. **Add «5 minutes a week» time-anchor cell** — apply product-designer V1 spec (4-cell or replace decision). Use `<AnimatedNumber>` pattern if a numeric token; otherwise mono token «5 min». Include eyebrow + sub-line.

7. **Cell #2 microcopy** — verify whether proof-bar carries «50 free chat messages a month» or whether that's hero-CTA-only. If proof-bar text needs swap → «50 free questions a month» per content-lead D4.

### D. Audience-whisper

8. **Add micro-line** «For investors who hold across more than one broker.» — placement per product-designer V2 (under hero sub OR as proof-bar small-print). Apply spec exactly.

### E. Testimonial honesty

9. **S7 collapse** in `ProvedoTestimonialCards.tsx` — replace 3-card grid with single weighted card per content-lead D3 + product-designer V5 spec. Add «Alpha quotes coming Q2 2026.» line per content-lead copy. Update grid → single centered figure.

### F. PO directives (microcopy + CTA removal)

10. **«Free forever» → «Free» / drop secondary CTA — 4-component sweep:**
    - **`ProvedoHero.tsx`** lines 53-60 (LEGACY) — first verify if mounted anywhere (`grep -rn "ProvedoHero[^V]" apps/web/src/`). If NOT mounted → DELETE the file entirely. If mounted somewhere → patch.
    - **`ProvedoHeroV2.tsx`** lines 466-473 — REMOVE the entire `<ProvedoNavLink href="/sign-up">Or start free forever</ProvedoNavLink>` block. Rebalance flex layout per product-designer V4 spec. Update line 477 small-print: «No card. 50 chat messages a month, free always.» → «No card. 50 free questions a month.»
    - **`ProvedoRepeatCTA.tsx`** lines 28-31 (LEGACY) — same dead-code check + delete-or-patch.
    - **`ProvedoRepeatCTAV2.tsx`** lines 56-66 — REMOVE the `<ProvedoNavLink>Or start free forever</ProvedoNavLink>` block. KEEP the «Or see Plus pricing →» link at lines 71-78 (per kickoff). Update line 70 small-print: «No card. 50 free messages a month, free always.» → «No card. 50 free questions a month.»
    - **`ProvedoFAQ.tsx`** line 29 (Q1 answer): rewrite per kickoff §F.
    - **`ProvedoFAQ.tsx`** line 39 (Q3 answer): rewrite per kickoff §F.
    - **`ProvedoFAQ.tsx`** line 57 (section heading): «Common questions» → «Questions you'd ask».
    - **`(marketing)/page.tsx`** line 29 OG description: «...with sources. Free forever, no card.» → «...with sources. Free tier, no card.»
    - **`(marketing)/pricing/page.tsx`** line 9 (description): «Simple pricing. Free forever for basic tracking. Paid tiers unlock deeper AI and tax reports.» → «Simple pricing. Free for basic tracking. Paid tiers unlock deeper AI and tax reports.»
    - **`(marketing)/pricing/page.tsx`** line 32 (hero): «Free forever for basic tracking. Upgrade when the AI and insights earn it.» → «Free for basic tracking. Upgrade when the AI and insights earn it.»
    - **`pricing/_components/PricingTable.tsx`** line 23: `priceSuffix: 'forever'` → `priceSuffix: ''` (empty string; the `$0` standalone is clean per kickoff).
    - **`MarketingFooter.tsx`** line 38 — replace «Try Plus free for 14 days» with content-lead D4 chosen replacement (kickoff suggested «Open Provedo» or «Get the email»).

### G. Test impact (your scope)

Update existing tests + add new tests:

- **UPDATE** `apps/web/src/app/(marketing)/page.test.tsx:53` — drop «free forever» match assertion (no longer in OG description).
- **UPDATE** `apps/web/src/app/(marketing)/page.test.tsx:411` — REMOVE «Or start free forever» link assertion (no longer rendered).
- **VERIFY** `apps/web/src/app/(marketing)/pricing/page.test.tsx` — update any remaining «free forever» assertion.
- **ADD** test: audience-whisper line renders.
- **ADD** test: time-anchor proof-bar cell renders.
- **ADD** test: 3-layer disclaimer details/summary semantics — open/close, keyboard accessible, summary text matches «Full regulatory disclosures (US, EU, UK)».
- **ADD** test: `/disclosures` page basic render (title + body sections present + noindex robots meta).
- **ADD** test: S7 single testimonial renders with «Alpha quotes coming Q2 2026.» line.
- **VERIFY:** all 175 existing tests still pass post-update; total count rises with new tests; CI green.

## Hard constraints (DO NOT TOUCH)

- Hero head/sub copy («Provedo will lead you through your portfolio.» / «Notice what you'd miss across all your brokers.») LOCKED.
- v3.1 patches at `8cb509b`: Tab 3 framing + Tab 3 simultaneous animation + footer 75-word block (preserved as Layer 2 verbatim) + FAQ Q4 «$9/month» + Tab 4 «about 2x S&P 500 sector weight (~28%)».
- Existing 5 animation rules + 175-test baseline.
- Bundle budget: 220kB First Load JS (currently 139kB).
- Do NOT add new dependencies. Use existing primitives (native HTML `<details>`, existing chevron SVG pattern, existing `ProvedoNavLink` / `ProvedoButton`).

## Pre-flight checks

```bash
# From repo root
git status                                    # confirm clean working tree
git log --oneline -5                          # confirm 409cda9 is HEAD or recent
git branch --show-current                     # should be feat/lp-provedo-first-pass
pnpm install                                  # ensure deps
pnpm --filter web test                        # establish 175/175 baseline
pnpm --filter web typecheck
pnpm --filter web lint
```

## Commit structure

**Commit 1 (impl):** single commit with all 11 scope items + test updates.
- Message: `feat(marketing): provedo landing v3.2 — universal improvements (Slice-LP3.2)`
- Body: bullet list of 11 scope items shipped + test count delta + bundle delta.

**Commit 2 (docs):** end-of-slice docs.
- Message: `docs: close Slice-LP3.2 — landing v3.2 universal improvements`
- Touches: `docs/merge-log.md` (tech-lead provides text), `docs/PO_HANDOFF.md` (right-hand provides text — DO NOT touch this file from worktree per memory `feedback_cc_docs_scope`), `docs/TECH_DEBT.md` if any new TD introduced.

**IMPORTANT — docs scope (per CC post-merge docs scope memory):** from worktree you may touch only `docs/merge-log.md`, `docs/TECH_DEBT.md`, `docs/DECISIONS.md`, `docs/03_ROADMAP.md`. PO_HANDOFF + UI_BACKLOG + TASK_0N + README are PO-only / right-hand-only.

## Acceptance criteria

- [ ] All 11 scope items implemented per content-lead + product-designer deliverables
- [ ] All 4 «Free forever» / secondary-CTA touchpoints patched (Hero V2 + RepeatCTA V2 currently mounted; V1 components dead-code-deleted OR patched)
- [ ] All 5 v3.1 verbatim artefacts at `8cb509b` PRESERVED unchanged
- [ ] Layer 1 + Layer 2 + Layer 3 all SHIP TOGETHER (Layer 3 is `/disclosures` route)
- [ ] All test updates applied; new tests added; 175+ tests passing
- [ ] `pnpm --filter web typecheck` clean
- [ ] `pnpm --filter web lint` clean (warnings on TD-099 components OK — pre-existing)
- [ ] `pnpm --filter web build` succeeds
- [ ] Bundle First Load JS still < 220kB (current baseline 139kB)
- [ ] CI green on push (Vercel preview auto-deploys)

## Report format

After commit, report to tech-lead with:
```
git log --oneline -3
```
+ test count: X/Y passing
+ bundle First Load JS: NNNkB
+ Vercel preview URL
+ acceptance checklist (above)
+ any surprise findings as new TDs (NOT inline fixes)
