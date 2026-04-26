# Dispatch — qa-engineer — Slice-LP3.2 Universal Improvements

**Wave:** 3 (final — runs after frontend-engineer ships + Vercel preview deploys)
**ETA:** 1-2h
**Branch:** `feat/lp-provedo-first-pass` (PR #65 stack)
**Hard rules:** Rule 1 (no paid services / no Percy / Chromatic spend) · Rule 2 (no PO-name comms) · Rule 4 (no rejected predecessor reference)

## Source artefacts

1. `docs/kickoffs/2026-04-27-slice-lp3-2-universal-improvements.md` — kickoff (acceptance criteria)
2. `docs/content/slice-lp3-2-content-lead-deliverables.md`
3. `docs/design/slice-lp3-2-product-designer-specs.md`
4. `docs/reviews/2026-04-27-a11y-slice-lp3-2-audit.md` (a11y-architect output)
5. `docs/reviews/2026-04-27-legal-layer3-signoff.md` (legal-advisor sign-off)
6. Vercel preview URL (frontend-engineer provides post-push)

## Smoke test scope

### S1 — Functional smoke (manual on Vercel preview)

**Hero (S1):**
- [ ] Headline reads «Provedo will lead you through your portfolio.» verbatim
- [ ] Sub reads «Notice what you'd miss across all your brokers.» verbatim
- [ ] Single primary CTA «Ask Provedo» visible (NO secondary «Or start free forever» link)
- [ ] Small-print: «No card. 50 free questions a month.» (NOT «messages», NOT «free always»)
- [ ] Audience-whisper line «For investors who hold across more than one broker.» visible in chosen placement (under hero OR proof-bar small-print)

**Proof bar (S2):**
- [ ] «5 minutes a week» time-anchor cell visible
- [ ] «Information. Not advice.» (NO «Lane A —» prefix)
- [ ] All cells render correctly at 320 / 768 / 1024 / 1440

**Demo tabs (S4):**
- [ ] All 4 tabs render Granola-grade content (specific dollars, tickers, dates, citations)
- [ ] Tab 3: «price returned above your sell level» + «not a recommendation about future trading decisions» + «past patterns do not predict future results» + «common pattern across retail investors» phrases ALL PRESENT (legal §9 verbatim preservation)
- [ ] Tab 3 chart: sell points + recovery marks + connectors fade in SIMULTANEOUSLY (not sequentially)
- [ ] Tab 4: «about 2x the sector's weight in S&P 500 (~28%)» (NOT «US retail median 34%»)

**Testimonials (S7):**
- [ ] Single weighted quote (NOT 3 cards)
- [ ] «Alpha quotes coming Q2 2026.» line present
- [ ] «Coming Q2 2026» badge present

**FAQ (S9):**
- [ ] Section heading: «Questions you'd ask» (NOT «Common questions»)
- [ ] Q1 answer: includes «information, not advice» disclaim
- [ ] Q3 answer: «The Free tier is locked» (NOT «Free-forever tier is locked»)
- [ ] Q4 answer: contains «$9/month» + «insights when they matter» (legal §9 preservation)
- [ ] Q4 free-tier copy: «50 questions a month» (NOT «50 chat messages»)

**Repeat CTA (S10):**
- [ ] Single «Ask Provedo» primary CTA
- [ ] NO «Or start free forever» secondary
- [ ] «Or see Plus pricing →» link STILL PRESENT
- [ ] Small-print: «No card. 50 free questions a month.»

**Footer (3-layer disclaimer):**
- [ ] Layer 1 visible: «Provedo provides general information about your portfolio. It is not personalized investment advice — every decision stays yours.»
- [ ] Layer 2 `<details>` collapsed by default; summary text «Full regulatory disclosures (US, EU, UK)»
- [ ] Layer 2 expanded reveals verbatim 75-word block (legal §9 — text matches `MarketingFooter.tsx` lines 71-77 from `8cb509b`)
- [ ] Layer 2 expanded contains link to `/disclosures` («Read full extended disclosures →»)
- [ ] Footer waitlist box CTA changed (NOT «Try Plus free for 14 days»)

**`/disclosures` page:**
- [ ] Page loads at `/disclosures`
- [ ] H1 «Regulatory disclosures» present
- [ ] All content elements per legal sign-off present
- [ ] noindex robots meta present (staging posture)

**Pricing page (`/pricing`):**
- [ ] Description: «Simple pricing. Free for basic tracking. Paid tiers unlock deeper AI and tax reports.» (NOT «Free forever»)
- [ ] H1 hero sub: «Free for basic tracking. Upgrade when the AI and insights earn it.» (NOT «Free forever»)
- [ ] PricingTable Free tier: `$0` standalone (NO «forever» suffix)

### S2 — Cross-browser sanity

Test on at least:
- Chrome (latest)
- Firefox (latest)
- Safari (latest if available)

For each browser verify:
- Hero renders, animations smooth
- 3-layer disclaimer `<details>` keyboard-toggleable
- /disclosures route loads
- No console errors in DevTools

### S3 — Responsive sanity

Test viewports: 320, 768, 1024, 1440.
- Hero stack reflows correctly
- Proof bar (3 OR 4 cells per product-designer V1 decision) reflows
- Single testimonial centered
- Footer 3-layer disclaimer readable on mobile

### S4 — Reduced-motion sanity

DevTools → emulate `prefers-reduced-motion: reduce`:
- All animations halt or fade-skip per existing pattern
- `<AnimatedNumber>` shows target value immediately
- No new motion violations from new audience-whisper or new proof-bar cell

### S5 — Performance check

- Run Lighthouse on Vercel preview `/`
- Verify First Load JS still < 220kB (current 139kB; new code adds Layer 3 page + small components — likely ~5-10kB delta)
- Verify CLS < 0.1 (no new layout shifts)
- Verify LCP < 2.5s

### S6 — Visual regression (lightweight, no paid Percy/Chromatic)

If Playwright is set up locally:
- Capture screenshots at 320/768/1440 of `/` and `/disclosures` and `/pricing`
- Compare against current main (`409cda9`) screenshots if available
- Flag any unexpected diffs (some are expected — that's the point of the slice; flag UNEXPECTED diffs only)

If Playwright not set up: do manual side-by-side visual check of key sections (hero, proof bar, testimonials, footer) on Vercel preview vs prod-current (https://vercel — get URL from Vercel project).

## Output

Write report to `docs/reviews/2026-04-27-qa-slice-lp3-2-smoke.md`:

- S1 functional checklist results
- S2 cross-browser PASS/FAIL per browser
- S3 responsive PASS/FAIL per viewport
- S4 reduced-motion PASS/FAIL
- S5 performance numbers (Lighthouse score, JS bundle, CLS, LCP)
- S6 visual regression notes
- **OVERALL VERDICT:** GO-FOR-MERGE / FIX-NEEDED / BLOCK
- Any newly-discovered defects → frontend-engineer patch list (if blocking) OR new TDs (if non-blocking)

## Constraints

- Do NOT install paid visual-regression tooling (Rule 1 — no spend)
- Do NOT modify code (you're QA, not impl — file defects, don't fix them)

## Report back

When complete, report to tech-lead with:
- Path to smoke report
- Overall verdict (GO / FIX / BLOCK)
- Any blockers for merge
