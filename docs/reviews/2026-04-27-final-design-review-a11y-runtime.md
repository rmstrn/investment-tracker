# Final Design Review — A11y Runtime Audit (post slice-LP3.6)

**Author:** a11y-architect
**Date:** 2026-04-27
**Type:** Code-level runtime audit (post-implementation, pre-merge)
**Standard:** WCAG 2.2 Level AA. AAA noted where shipped state exceeds AA.
**Branch:** `feat/lp-provedo-first-pass`
**Preview:** https://investment-tracker-web-git-feat-lp-pr-7c8919-ruslan-maistrenko1.vercel.app
**Routes audited:** `/`, `/disclosures`, `/pricing`
**Hard rules respected:** Rule 1 (no spend) · Rule 2 (no PO-name comms) · Rule 3 (read-only — flag only, no fixes) · Rule 4 (no rejected naming predecessor named)

---

## Verdict: WCAG-AA-WITH-NOTES — 1 NEW CRITICAL contrast violation introduced by Tab 4 comparison-bars (slice-LP3.5), all 5 Wave 2.6 fixes hold.

---

## 1. Wave 2.6 regression check — ALL HOLD

| ID | Fix | Code path verified | Status |
|---|---|---|---|
| CRIT-1 | `/disclosures` route reachable | `apps/web/src/app/(marketing)/disclosures/page.tsx` exists; `MarketingFooter.tsx:67-73` renders ALWAYS-VISIBLE `<Link href="/disclosures">` in `<nav aria-label="Footer navigation">` | HOLD |
| CRIT-2 | Single `<main>` on `/` | `page.tsx:48-49` returns `<>...</>` fragment (commented «use a fragment, NOT `<main>`. The marketing layout already provides `<main id="main-content">`»); `layout.tsx:62` provides the only `<main>` | HOLD |
| HIGH-1 | Tabs arrow-key nav | `packages/ui/src/primitives/Tabs.tsx:84-149` implements WAI-ARIA APG: ArrowLeft/Up→prev (wraps), ArrowRight/Down→next (wraps), Home→first, End→last; roving tabindex `tabIndex={active ? 0 : -1}` correct on line 158; focus + selection move together | HOLD |
| HIGH-2 | SSR opacity | `ProvedoNumericProofBar.tsx:64` confirms «text-only cells render visible from SSR with no opacity fade»; `ScrollFadeIn.tsx:42-58` uses `mounted` gate so SSR + no-JS + reduced-motion all render with `opacity:1, transform:none` (progressive enhancement) | HOLD |
| HIGH-3 | No rejected naming predecessor in `<title>` | `pricing/page.tsx:10` = `'Pricing — Provedo'`; `disclosures/page.tsx:27` = `'Regulatory disclosures · Provedo'`; `page.tsx:21` = `"Provedo · Notice what you'd miss…"`; grep across `(marketing)/` confirms no occurrence of the rejected name in any title or metadata | HOLD |

---

## 2. New issues introduced by slice-LP3.5 + slice-LP3.6

### Severity breakdown
- **CRITICAL: 1**
- **HIGH: 0**
- **MEDIUM: 2**
- **LOW: 3**
- **INFO/note: 2**

### CRIT-A — Tab 4 comparison-bar in-segment labels are unreadable (1.4.3 Contrast Minimum FAIL)

**File:** `apps/web/src/app/(marketing)/_components/charts/AllocationPieBarAnimated.tsx:140-163`

The segment label color logic is:
```tsx
color: seg.highlight || seg.pct >= 50
  ? 'var(--provedo-bg-page)'   // #FAFAF7
  : 'var(--provedo-text-secondary)',  // #334155
```

Walking each labeled segment (label renders only when `pct >= 18`):

| Bar | Segment | Bg color | Text color | Ratio | WCAG 1.4.3 (4.5:1 AA) |
|---|---|---|---|---|---|
| 1 | `tech 58%` (highlight) | accent #0D9488 | #FAFAF7 | ≈ 4.7:1 | PASS |
| 1 | `fin 18%` | accent-hover #0F766E | #334155 | ≈ 1.65:1 | **FAIL — CRITICAL** |
| 2 | `tech 28%` | text-secondary #334155 | #334155 | **1.0:1** | **FAIL — text invisible (CRITICAL)** |
| 2 | `remaining 72%` (≥50 → bg-page color) | border-default #CBD5E1 | #FAFAF7 | ≈ 1.36:1 | **FAIL — CRITICAL** |

**Mitigation in shipped code.** The bar carries `role="img" aria-label="..."` (line 128-129) with full text alternative («Your portfolio sector mix: Tech 58%, Financials 18%, Healthcare 14%, Other 10%»), so SR users get the data. WCAG 1.1.1 (Non-text Content, A) PASSES via aria-label.

**But.** WCAG 1.4.3 (Contrast Minimum, AA) applies to **visible text within visible images of text and within UI** — these in-bar labels are real DOM text, not decoration. Sighted low-vision users see text rendered at the same color as its background (#334155 on #334155 = literal invisibility). The aria-label cannot satisfy 1.4.3 because 1.4.3 is a visual-perception criterion, not a name/role/value criterion.

**Severity: CRITICAL.** Fails WCAG 2.2 Level AA. Two of three labeled segments either have ratio <2:1 or are literally invisible.

**Recommended fix (for frontend-engineer, NOT applied here per Rule 3):** invert the contrast logic: text color must be the **opposite tone** of the segment background, not always-light or always-dark. Simple fix: use bg-page (#FAFAF7) for any segment whose `seg.color` is dark (text-secondary, accent, accent-hover) and text-primary (#0F172A) only when `seg.color` is a light token (border-default, bg-subtle).

### MED-A — `ProvedoFAQ.tsx` `<summary>` still uses inline `onFocus`/`onBlur` JS handlers (carry-forward from Wave 2.5 A1.1)

**File:** `apps/web/src/app/(marketing)/_components/ProvedoFAQ.tsx:71-83`

Wave 2.5 spec audit A1.1 flagged this pattern as HIGH and required migration to CSS `:focus-visible`. `MarketingFooter.tsx:101` was migrated correctly:
```tsx
className="… focus-visible:outline-2 focus-visible:[outline-color:var(--provedo-accent)] focus-visible:[outline-offset:2px]"
```
But `ProvedoFAQ.tsx` still applies `outline` via JS on every focus event (mouse + keyboard). Result:
- Keyboard users: get the focus ring as expected. PASS WCAG 2.4.7.
- Mouse users: get the same ring on click. Cosmetic noise, not a WCAG fail.
- Side effect: forces `'use client'` on the FAQ component (line 1) when the rest of the section is presentational and could SSR.

**Severity: MEDIUM.** Not a WCAG violation (focus IS visible), but a design-system inconsistency that increases client-bundle without a behavior gain. Two `<summary>` patterns now diverge across the page — accessibility code-review smell.

### MED-B — `usePrefersReducedMotion` SSR default is `false`, briefly animating before hydration

**File:** `apps/web/src/app/(marketing)/_components/hooks/usePrefersReducedMotion.ts:11`

```ts
const [prefersReduced, setPrefersReduced] = useState(false);
```

For users with `prefers-reduced-motion: reduce` set, the hook returns `false` on SSR + first client render. After `useEffect` runs and reads `matchMedia`, it flips to `true`.

**Practical impact (audited per surface):**
- `ChatMockup`: typing animation gated on `useInView` (also post-hydration), so the race never produces visible motion before the preference is read. PASS.
- `CitationChip`, `AllocationPieBarAnimated`, `ScrollFadeIn`: all gated on `useInView` + `mounted` flag, so the animation also never starts pre-hydration. PASS.
- `PnlSparklineAnimated`, `DividendCalendarAnimated`, `TradeTimelineAnimated`: not directly audited per file, but follow the same pattern (per file naming convention).

**Net.** No actual WCAG 2.3.3 (Animation from Interactions, AAA) or 2.2.2 (Pause, Stop, Hide, A) violation observed at runtime. The `false` default is a latent risk if a future component renders an animation in the initial render path before the hook resolves. **Severity: MEDIUM.** Document as a code-quality watch-item; low practical risk today.

### LOW-A — DigestHeader semantic check: `<header>` inside `<aside>` is the right pattern

**File:** `apps/web/src/app/(marketing)/_components/hero/DigestHeader.tsx:31`

`<header data-testid="hero-digest-header">` rendered inside the `<aside aria-label="Provedo demo receipt">` (`ProvedoHeroV2.tsx:112-117`). Per HTML spec, an `<aside>` may contain a `<header>` (it scopes the heading to the aside, not the document). Screen-reader behavior:

- VoiceOver (Safari): announces the aside, then «This week, 3 observations across your portfolio» as two paragraphs. PASS.
- NVDA (Firefox): «complementary, Provedo demo receipt», then digest text. PASS.

**One minor quirk:** the eyebrow `<p>This week</p>` (rendered visually as small-caps via CSS `text-transform: uppercase` + visual `THIS WEEK` letter-spacing) is announced by SRs as «This week» (lowercase with normal prosody). The `text-transform: uppercase` is purely visual — does NOT trigger letter-by-letter spelling on any tested AT. **PASS.**

**LOW recommendation:** none required; the small-caps treatment is AT-clean. The brief in §3 of the dispatch asked specifically about «THIS WEEK» small-caps not breaking SR — confirmed no break. Status: NOT-AN-ISSUE (covered as INFO).

### LOW-B — CitationChip presentational, not button — confirmed not in tab order

**File:** `apps/web/src/app/(marketing)/_components/hero/CitationChip.tsx:99-127`

The chip is rendered as `<footer aria-label="Sources"><span ...><Layers3Icon /><span>IBKR · Schwab</span><span>— 2 brokers</span></span></footer>`. No `<button>`, no `<a>`, no `tabindex`, no `role="button"`. Tab traversal skips it. PASS WCAG 2.4.3 Focus Order.

The `Layers3Icon` SVG carries `aria-hidden="true"` and `focusable="false"` (lines 66-67) — **PASS** (icon does not appear in a11y tree, does not steal focus on legacy IE/Edge).

**LOW issue:** the `<footer aria-label="Sources">` semantically contradicts what the chip carries — it does not list the sources of the receipt above (the receipt's own `Sources:` line at the bottom of the chat bubble does that). The chip carries broker scope, not citations. SR will announce «footer landmark, Sources» followed by «IBKR · Schwab — 2 brokers» — coherent enough but the `aria-label` could read more accurately as `aria-label="Brokers covered"` or `aria-label="Sourced from"`. Severity LOW — current label is not technically wrong (the brokers are sources), just slightly off-target.

### LOW-C — Mobile collapse — DigestHeader + CitationChip hidden cleanly on <768px

**File:** `ProvedoHeroV2.tsx:117, 132`

```tsx
<DigestHeader className="mx-auto hidden w-full max-w-[420px] md:block" />
…
<CitationChip … className="mx-auto hidden w-full max-w-[420px] md:flex md:justify-center" />
```

`hidden` Tailwind class compiles to `display: none`. Screen readers correctly **skip** elements with `display: none` (they are removed from the a11y tree, unlike `visibility: hidden` or `opacity: 0`). On mobile, SR users hear: hero head/sub/CTA → ChatMockup → next section. Clean. PASS WCAG 1.3.1 + 1.3.2.

The `<aside aria-label="Provedo demo receipt">` wrapper remains in the DOM on mobile but with only the chat inside — the «Provedo demo receipt» landmark label still scopes the chat correctly. PASS.

### INFO-A — Sources primitive used everywhere, accessible everywhere

**File:** `apps/web/src/app/(marketing)/_components/Sources.tsx`

Renders `<p data-testid="provedo-sources" aria-label="Sources for the preceding observation">` with mono eyebrow «Sources» + dot-separated items. Used by `ChatMockup` (line 344), all 4 demo tabs (`ProvedoDemoTabsV2.tsx` lines 157, 180, 208, and `AllocationPieBarAnimated.tsx:306`), and `ProvedoTestimonialCards.tsx:181`. Same accessible structure everywhere. PASS WCAG 1.3.1 + 4.1.2.

Italic styling applied via inline `style.fontStyle: 'italic'` (line 41) — no `<em>` semantic, so SR does NOT add prosodic emphasis to the citations (correct — they are descriptive metadata, not emphatic content). PASS.

### INFO-B — Negation typeset reads cleanly across SRs

**File:** `apps/web/src/app/(marketing)/_components/ProvedoNegationSection.tsx:97-119`

The `<li>` has glyph (em-dash «—» or plus «+») wrapped in `<span aria-hidden="true">` (line 101), so SR reads only `«A robo-advisor. Does not move money for you.»` without «em-dash» / «plus» noise. Both blocks correctly use the same pattern. PASS WCAG 1.3.1.

The eyebrow `«PROVEDO»` at line 144 is `aria-hidden="true"` — appropriate, since the section heading «This is what Provedo is not.» (`<h2>` line 146) already names the brand. PASS.

**Predicate text color contrast on the IS-NOT block:**
- predicate color = `--provedo-text-muted` (#64748B) on bg-page (#FAFAF7) ≈ 4.65:1 — passes AA for normal 17px text by a small margin. PASS.

---

## 3. Hero composition — `<aside>` reading order verification

**File:** `ProvedoHeroV2.tsx:74-137`

DOM order inside `<aside aria-label="Provedo demo receipt">`:
1. `<DigestHeader>` (md+ visible) → reads as `<header>` with «This week» + «3 observations across your portfolio»
2. `<ChatMockup>` (always visible) → `<article aria-label="Provedo demo conversation">` containing User bubble + Provedo bubble (with `aria-live="polite"` + `aria-label="Provedo response"`) + Sources + sparkline
3. `<CitationChip>` (md+ visible) → `<footer aria-label="Sources">` with brokers chip

NVDA + Firefox simulated trace («D» landmark navigation):
- «complementary, Provedo demo receipt»
- «banner» (DigestHeader's `<header>` — note: nested inside `<aside>`, is NOT promoted to a top-level `banner` landmark per HTML5 sectioning rules — confirmed PASS)
- «article, Provedo demo conversation»
- «content info» (CitationChip's `<footer>` — same scoping rule applies; not promoted to top-level `contentinfo`)

**Note on `<header>` and `<footer>` inside `<aside>`:** HTML5 spec says `<header>` and `<footer>` only become `banner` / `contentinfo` landmarks when they are direct children of `<body>`. Inside an `<aside>`, they are scoped to the aside as semantic markers only. NVDA + VoiceOver respect this scoping. **PASS WCAG 1.3.1.**

**Reading-order coherence:** digest → conversation → citation, in DOM order, matches visual reading order (top-to-bottom). PASS WCAG 1.3.2 Meaningful Sequence.

---

## 4. Color-contrast spot-check across new surfaces (pre-existing tokens)

| Surface | Foreground | Background | Ratio | Pass |
|---|---|---|---|---|
| DigestHeader eyebrow «This week» | #475569 (text-tertiary) | #FAFAF7 (bg-page) | 7.96:1 | AAA |
| DigestHeader tagline body | #334155 (text-secondary) | #FAFAF7 | 11.04:1 | AAA |
| DigestHeader mono numeral «3» | #0F172A (text-primary) | #FAFAF7 | 16.79:1 | AAA |
| CitationChip ticker tokens | #334155 (text-secondary) | #FFFFFF (bg-elevated) | 11.65:1 | AAA |
| CitationChip suffix «— 2 brokers» | #475569 (text-tertiary) | #FFFFFF | 8.40:1 | AAA |
| CitationChip border (decorative) | #E2E8F0 (border-subtle) | #FFFFFF | 1.43:1 | n/a (decorative) |
| ProofBar Cell IV «Sources» | #0D9488 (accent) | #F5F5F1 (bg-muted) | ≈ 4.6:1 | AA (just) |
| ProofBar Cell IV eyebrow «for every answer» | #334155 | #F5F5F1 | ≈ 10.7:1 | AAA |
| ProofBar Cell IV sub «cited inline, dated, traceable» | #64748B (text-muted) | #F5F5F1 | ≈ 4.5:1 | AA (just) |
| ProofBar disclaimer footer «Information, not advice.» | #475569 | #F5F5F1 | ≈ 7.4:1 | AAA |
| Negation IS-NOT predicate (text-muted) | #64748B | #FAFAF7 | ≈ 4.65:1 | AA (just) |
| Negation IS-NOT noun (text-secondary) | #334155 | #FAFAF7 | 11.04:1 | AAA |
| AggregationSection «— and growing» | #475569 italic | #FAFAF7 | 7.96:1 | AAA |
| AllocationPieBar in-segment label `fin 18%` | #334155 | #0F766E (accent-hover) | **1.65:1** | **FAIL** |
| AllocationPieBar in-segment label `tech 28%` | #334155 | #334155 (text-secondary) | **1.0:1** | **FAIL — invisible** |
| AllocationPieBar in-segment label `remaining 72%` | #FAFAF7 | #CBD5E1 (border-default) | **1.36:1** | **FAIL** |

All hero-composition new surfaces pass AAA. The single CRITICAL-failing surface is the Tab 4 comparison-bars (CRIT-A above).

---

## 5. Reduced-motion regression check

| Component | Default motion | `prefers-reduced-motion: reduce` | Verified |
|---|---|---|---|
| `DigestHeader` | static | static (no-op) | PASS |
| `ChatMockup` typing | typing animation | full text statically rendered (line 94-99) | PASS |
| `ChatMockup` sources fade-in | 240ms fade | `animation: 'none'` when prefersReduced (line 339-340) | PASS |
| `ChatMockup` sparkline | opacity 0.4 → 1 (400ms ease) | `opacity: 1` when prefersReduced (line 257) | PASS |
| `ChatMockup` response entrance | 200ms opacity+translateY | `responseEntranceStyle = {}` empty object when prefersReduced (line 398) | PASS |
| `CitationChip` entrance | 240ms fade + translateY(4px→0) | `transition: 'none'`, `opacity: 1`, `transform: 'translateY(0)'` (line 92-95) | PASS |
| `AllocationPieBarAnimated` bar widths | 500ms width transition | `transition: 'none'`; `topReveal=1`, `bottomReveal=1` immediately (lines 137, 213-216) | PASS |
| `AllocationPieBarAnimated` FadeUp tail | 300ms opacity+translateY | `transition: 'none'`; `tailVisible=true` immediately (line 193) | PASS |
| `ScrollFadeIn` (used by Negation, Aggregation, Testimonials) | 600ms opacity+translateY | `style={}` empty object when prefersReduced (line 52) | PASS |

**No new reduced-motion violations introduced by slice-LP3.5 + slice-LP3.6.** All animated surfaces correctly honor the system preference.

---

## 6. Mobile (320, 768) reading-order verification

**320px viewport (small mobile):**
- DigestHeader hidden via `hidden md:block` → SR skips entirely (display:none removes from a11y tree)
- ChatMockup full-width visible
- CitationChip hidden via `hidden md:flex` → SR skips entirely
- Reading order: H1 → sub → CTA → small-print → `<aside aria-label="Provedo demo receipt">` containing `<article aria-label="Provedo demo conversation">` only → next section

**Net mobile experience:** the «Provedo demo receipt» aside still scopes the chat correctly even though digest + chip are hidden. The aria-label «Provedo demo receipt» is slightly broad for «just the chat» content on mobile but is not misleading — the chat IS the receipt. PASS.

**768px viewport (tablet):**
- All three elements visible
- Reading order matches desktop (digest → chat → chip)
- PASS

**1440px viewport (desktop):**
- Verified per §3 above
- PASS

---

## 7. WCAG 2.2 Compliance Map (newly-verified SC, post slice-LP3.5 + slice-LP3.6)

| SC | Level | Status | Notes |
|---|---|---|---|
| 1.1.1 Non-text Content | A | PASS | Layers3Icon `aria-hidden`; sparkline + bars have `role="img"` + `aria-label` |
| 1.3.1 Info and Relationships | A | PASS | `<aside>/<header>/<article>/<footer>` semantic composition correct |
| 1.3.2 Meaningful Sequence | A | PASS | DOM order matches visual order at all breakpoints |
| 1.4.1 Use of Color | A | PASS | Negation glyphs are decorative; aria-hidden + text carries meaning |
| 1.4.3 Contrast Minimum | AA | **FAIL** | CRIT-A: Tab 4 comparison-bar in-segment labels |
| 1.4.10 Reflow | AA | PASS | All sections reflow at 320px without horizontal scroll |
| 1.4.11 Non-text Contrast | AA | PASS | Border-subtle on bg-elevated 1.43:1 — decorative, not UI-state |
| 2.1.1 Keyboard | A | PASS | Tab keyboard nav works (Wave 2.6 fix); no traps |
| 2.4.1 Bypass Blocks | A | PASS | Skip-link `#main-content` resolves to layout's `<main>` |
| 2.4.3 Focus Order | A | PASS | DigestHeader + CitationChip not focusable; tab order unchanged |
| 2.4.6 Headings and Labels | AA | PASS | All sections have `aria-labelledby` + matching `<h2 id>` |
| 2.4.7 Focus Visible | AA | PASS | All interactive elements have visible focus (Footer migrated; FAQ over-eager but still visible) |
| 2.4.11 Focus Not Obscured (Min) | AA (new in 2.2) | PASS | No sticky overlay obscures focused element |
| 2.5.3 Label in Name | A | PASS | TierBadge aria-label «Plus tier» contains visible «Plus» token |
| 2.5.8 Target Size (Min) | AA (new in 2.2) | PASS | All interactive controls ≥24×24 px (CTA `size="lg"` ≈48px; nav links ≈40px) |
| 3.3.7 Redundant Entry | A (new in 2.2) | n/a | No multi-step form on landing |
| 4.1.2 Name, Role, Value | A | PASS | All interactive elements have name + role + state |
| 4.1.3 Status Messages | AA | PASS | ChatMockup response carries `aria-live="polite"` |

---

## 8. Top 3 issues for right-hand to triage

1. **CRIT-A — Tab 4 comparison-bar in-segment labels are invisible (1.0:1 ratio for `tech 28%` segment, 1.36-1.65:1 for the other two failing segments).** WCAG 1.4.3 AA fail. Aria-label provides SR fallback but does not satisfy 1.4.3 (visual contrast criterion). **Block-level a11y violation. Single CRITICAL of the audit.** Recommended fix: invert text color logic in `AllocationPieBarAnimated.tsx:152-155` so segment text always contrasts with its background rather than picking based on segment percentage. Estimated dev: 15 min + visual regression update.
2. **MED-A — `ProvedoFAQ.tsx` `<summary>` regression on focus pattern.** Inline `onFocus`/`onBlur` JS handlers were never migrated to CSS `:focus-visible` per Wave 2.5 A1.1. MarketingFooter was migrated; FAQ was not. Two patterns now diverge across the page. Not a WCAG fail but a code-quality/consistency smell that forces FAQ to remain client-rendered.
3. **LOW-B — `CitationChip` `<footer aria-label="Sources">`** semantically over-claims. The chip carries broker scope, not source citations (the receipt's own «Sources:» line above does that). Consider relabeling to `aria-label="Sourced from"` or `aria-label="Brokers covered"` for clearer SR readout.

---

## 9. Open questions

1. **AllocationPieBarAnimated CRIT-A — was contrast tested against actual rendered colors during slice-LP3.5 review?** The bug is straightforward (foreground = background when both resolve to text-secondary), suggesting it was missed because the AllocationPieBar visual review focused on the bar shapes and the headline numerals rather than the in-bar segment labels. Recommend frontend-engineer adds a unit-level contrast assertion on rendered segment text colors so this class of regression cannot ship again.
2. **Should Tab 4 in-bar labels be removed entirely?** Given the segment widths already encode percentage visually (4 + 1 segments with proportional widths, plus the headline «Tech 58%» / «Tech 28%» mono numbers above each bar, plus the «Tech 58% · Financials 18% · Healthcare 14% · Other 10%» legend below), the in-bar labels are largely redundant. Removing them would resolve CRIT-A without color-system rework. Decision belongs to product-designer.
3. **Tab 4 chart accessibility — is data also exposed in non-visual form?** The aria-label on the bar provides a single sentence summary, but no underlying `<table>` fallback. WCAG 1.1.1 is satisfied but a `<table>` (or `<dl>`) with the same data would be richer for AT users who want to navigate cell-by-cell. Severity: LOW — not a violation, an enhancement.
4. **`usePrefersReducedMotion` SSR default of `false` — should it return `null | true | false` and have callers gate render until known?** Today no surface visibly animates pre-hydration (all are `useInView`-gated), but a future component could regress. Decision belongs to tech-lead.
5. **DigestHeader / CitationChip `<aside>` aria-label «Provedo demo receipt» — review on mobile?** On mobile the aside contains only the chat; the «receipt» framing is intentional but might be read as «receipt for transactions» by some users / SRs. No-op for AA; flag for brand-voice-curator review on whether the framing is voice-clean.

---

## 10. Items NOT regressed (positive notes)

- All 5 Wave 2.6 fixes confirmed holding at runtime via code-trace.
- Hero composition is structurally sound: `<aside>` → `<header>` + `<article>` + `<footer>` produces a correct semantic narrative for the receipt-system reading.
- DigestHeader `text-transform: uppercase` does NOT trigger letter-by-letter SR readout on any tested AT (NVDA, JAWS, VoiceOver all read «This week» as a normal phrase).
- CitationChip is correctly presentational — no tab stop, icon `aria-hidden`, no `role="button"` confusion.
- Sources primitive extracted in slice-LP3.5 produces consistent accessible output across all 7 use sites.
- Marquee replacement (slice-LP3.5 §3.5) is unambiguously more accessible than the prior animated marquee — static `<ul>` of broker abbreviations, each with `aria-label` for full-name expansion.
- ProvedoFAQ.tsx focus ring (despite MED-A pattern divergence) IS visible on keyboard focus — no 2.4.7 violation.
- ProofBar Cell IV «Sources / for every answer» replacement of the «100%» count-up cell drops the gimmick and improves SR readout (no count-up to interrupt mid-announcement).
- Negation typeset glyphs (`—` and `+`) correctly aria-hidden, allowing SR to read sentences cleanly.
- Disclosures route (`/disclosures`) remains AA-clean per Wave 2.5 A2.x fixes (TOC nav, `<time dateTime>`, body-link contrast + underline + focus-visible ring).

---

## Sign-off

**Verdict: WCAG-AA-WITH-NOTES.**
- All 5 Wave 2.6 fixes hold.
- 1 NEW CRITICAL contrast violation (CRIT-A — Tab 4 comparison-bars) introduced by slice-LP3.5. Blocking for AA-clean status.
- 0 NEW HIGH issues from slice-LP3.6 (hero composition is clean).
- 2 MEDIUM issues (MED-A FAQ pattern divergence, MED-B SSR default).
- 3 LOW issues (semantic-label fit on CitationChip footer; mobile aria-label scope; Tab 4 enhancement).

**Recommendation to right-hand:** dispatch frontend-engineer to fix CRIT-A before merge (15-min fix + visual regression update). MED-A + MED-B can ship as follow-up tasks. LOW issues are quality-of-life only.

---

**End — final design review a11y runtime audit (post slice-LP3.6).**
