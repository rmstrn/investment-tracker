# Slice-LP3.2 — A11y-Architect Spec-Level Audit (Phase 3, pre-implementation)

**Author:** a11y-architect
**Date:** 2026-04-27
**Type:** Spec-level audit (pre-implementation). Code-level audit is a follow-up dispatch after Vercel preview is live.
**Standard:** WCAG 2.2 Level AA minimum. Selected Level AAA noted where the spec already exceeds AA.
**Branch:** `feat/lp-provedo-first-pass` (PR #65 stack)
**Hard rules respected:** Rule 1 (no spend) · Rule 2 (no PO-name comms) · Rule 4 (no rejected naming predecessor)

---

## Audit envelope

| Source artefact | Read | Notes |
|---|---|---|
| `docs/kickoffs/slice-lp3-2-dispatches/04-a11y-architect.md` | YES | A1-A5 deliverable scope |
| `docs/design/slice-lp3-2-product-designer-specs.md` | YES | V1-V5 visual + interaction specs |
| `docs/content/slice-lp3-2-content-lead-deliverables.md` | YES | D1-D5 copy + IA |
| `docs/kickoffs/2026-04-27-slice-lp3-2-universal-improvements.md` | YES | Slice context |
| `apps/web/src/app/(marketing)/_components/ProvedoFAQ.tsx` | YES | Reference `<details>` pattern parity check |
| `apps/web/src/app/(marketing)/_components/MarketingFooter.tsx` | YES | Layer 1+2+3 insertion site |
| `apps/web/src/app/(marketing)/_components/MarketingHeader.tsx` | YES | Skip-link confirmed: targets `#main-content` |
| `apps/web/src/app/(marketing)/_components/ProvedoNumericProofBar.tsx` | YES | `<dl><dt><dd>` pattern + `aria-label="Proof points"` |
| `apps/web/src/app/(marketing)/_components/ProvedoTestimonialCards.tsx` | YES | `<figure><blockquote><figcaption>` pattern |
| `apps/web/src/app/(marketing)/layout.tsx` | YES | Token values for contrast math |

**Verified token values (from `layout.tsx`, NOT spec text):**
- `--provedo-text-secondary` = `#334155` (slate-700) — not slate-600 as PD spec stated
- `--provedo-text-tertiary` = `#475569` (slate-600) — not slate-500 as PD spec stated
- `--provedo-bg-page` = `#FAFAF7`
- `--provedo-bg-muted` = `#F5F5F1`
- `--provedo-accent` = `#0D9488` (teal-600)
- `--provedo-border-subtle` = `#E2E8F0` (slate-200)

The actual tokens are DARKER than the PD spec narrative implies, meaning contrast is HIGHER than PD claimed. **Net: PD's contrast claims are conservative (passes more easily than spec-text suggests). No flag.**

---

## A1 — `<details>` keyboard + screen-reader pattern (Layer 2)

**Verdict: PASS-AS-SPECCED with 2 NEEDS-CODE-VERIFICATION items + 1 HIGH risk to mitigate at impl time.**

### What the spec gets right

- Native `<details>` / `<summary>` chosen (V3, lines 213-217). This is the canonical accessible pattern; modern AT support is broadly correct.
- Pattern parity with `ProvedoFAQ.tsx` (lines 60-118 of FAQ component) — visual + behavioral consistency across the site's disclosure interactions. Cognitive-load win for repeat visitors.
- Focus-visible spec: `outline: 2px solid var(--provedo-accent); outline-offset: 2px; border-radius: 4px`.
- `::-webkit-details-marker { display: none }` documented.
- Reduced-motion: chevron rotation honored via existing motion vars.
- Per legal-advisor §2 belt-and-suspenders: 75-word verbatim block reachable via Layer 3 ALWAYS-visible link → `/disclosures` page (independent of `<details>` toggle). This is the **structural mitigation** for AT/browser combos that suppress collapsed `<details>` content from the a11y tree.

### A1.1 — HIGH risk: focus ring parity with FAQ pattern is INCOMPLETE in current FAQ code

**Issue.** The reference pattern at `ProvedoFAQ.tsx:71-83` uses an `onFocus` / `onBlur` JS handler to toggle `outline` in inline style. This is a **non-idiomatic implementation of `:focus-visible`** that:

1. Triggers on ALL focus events (mouse-click + keyboard-tab) — `:focus-visible` would correctly suppress the ring on mouse activation, but this manual handler does not. Result: keyboard-only users get the same ring as mouse-clickers, which is over-eager but not a WCAG fail.
2. Requires `'use client'` for the handler, which is the reason the FAQ file is client-side. Layer 2 disclaimer is in the footer — if frontend implements the same handler pattern, **the entire `MarketingFooter.tsx` becomes a client component**, regressing SSR.

**Spec change for frontend-engineer.** Use CSS `:focus-visible` instead of inline JS handlers:

```css
/* applied as a Tailwind / CSS-module rule, not inline style */
summary:focus-visible {
  outline: 2px solid var(--provedo-accent);
  outline-offset: 2px;
  border-radius: 4px;
}
```

**Benefit:** correct keyboard-only focus signaling per WCAG 2.4.7 + 2.4.11, and `MarketingFooter.tsx` stays a server component. **WCAG SC: 2.4.7 Focus Visible (AA) + 2.4.11 Focus Not Obscured (AA, new in 2.2).**

**Action:** flag to frontend-engineer at impl time. Optionally backfill the FAQ to the same CSS-only pattern in this slice (small, justified, removes the `'use client'` directive there too).

### A1.2 — NEEDS-CODE-VERIFICATION: Focus reaches Layer 3 link only when expanded

**What to verify post-impl.**
- Tab from Layer 2 `<summary>` (collapsed): focus moves to next focusable element OUTSIDE the `<details>` (footer nav links above OR document end). Expected.
- Tab from Layer 2 `<summary>` (expanded): focus moves INTO the expanded content and lands on the Layer 3 link «Read full extended disclosures →» before continuing past the `<details>`. Expected.
- Shift-Tab from Layer 3 link returns to Layer 2 `<summary>`. Expected.

This is default browser behavior for native `<details>` — but combo-test on at least 1 browser is required at code-audit time.

### A1.3 — NEEDS-CODE-VERIFICATION: SR announces state change

**What to verify post-impl on at least 1 SR+browser combo (NVDA+Firefox or VoiceOver+Safari, document which):**
- Collapsed: «Full regulatory disclosures (US, EU, UK), button, collapsed» (or equivalent — AT-specific phrasing varies)
- Expanded: «Full regulatory disclosures (US, EU, UK), button, expanded» announced on toggle
- 75-word verbatim block readable when expanded
- Layer 3 link «Read full extended disclosures» announced as link with descriptive text (the `→` Unicode arrow should NOT be announced — verify at impl whether a wrapping `<span aria-hidden="true">→</span>` is needed)

**Spec change for frontend-engineer (proactive).** Wrap the `→` glyph in `<span aria-hidden="true">→</span>` to prevent SR readout «right arrow». The link text becomes «Read full extended disclosures» semantically while visually still showing the arrow. **WCAG SC: 1.3.1 Info and Relationships (A) + 4.1.2 Name, Role, Value (A).**

### A1.4 — Reduced-motion native-default check

`<details>` open/close uses default browser behavior — no animated body reveal. Native is instant; no `prefers-reduced-motion` violation. Chevron 150ms rotation: spec correctly notes existing motion vars honor reduced-motion. PASS.

---

## A2 — `/disclosures` page structure

**Verdict: PASS-AS-SPECCED with 4 spec changes required for AA compliance.**

### What the spec gets right

- New route `apps/web/src/app/(marketing)/disclosures/page.tsx` (D2, line 156).
- Single `<h1>` «Regulatory disclosures» (D2 markdown, line 197).
- Sequential `<h2>` hierarchy: Who/What/Per-jurisdiction/Past-performance/Decisions/Contact. No skip-levels. PASS WCAG 1.3.1.
- Body voice is disclaim register, no marketing tone — supports cognitive accessibility (3.1.5 Reading Level, AAA).
- `metadata` includes meaningful title + description for AT users navigating tab list / browser history.
- `robots: { index: false, follow: false }` — neutral on a11y, fine for legal page intent.
- Inherits the `MarketingHeader` skip-link (`#main-content`) via the marketing layout. PASS WCAG 2.4.1 Bypass Blocks.

### A2.1 — HIGH: missing semantic landmark on `<main>` content wrapper

**Issue.** D2 spec uses `<main className="...">` but the marketing layout already wraps children in `<main id="main-content">`. **Nesting `<main>` inside `<main>` is invalid HTML and creates two landmarks of the same role**, which confuses SR landmark navigation (NVDA's D / VoiceOver's rotor lands on whichever the AT-implementation chooses first; user lands in the wrong region).

**Spec change.** D2 page-component should use `<article>` directly (NO inner `<main>`):

```tsx
export default function DisclosuresPage(): React.ReactElement {
  return (
    <article
      className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24"
      aria-labelledby="disclosures-heading"
      style={{
        backgroundColor: 'var(--provedo-bg-page)',
        color: 'var(--provedo-text-secondary)',
      }}
    >
      <h1 id="disclosures-heading">Regulatory disclosures</h1>
      <p><em>Last updated: 2026-04-27</em></p>
      {/* ... sections ... */}
    </article>
  );
}
```

**WCAG SC: 1.3.1 Info and Relationships (A) + 4.1.1 Parsing (deprecated in 2.2 but still valid HTML hygiene).**

### A2.2 — HIGH: «Last updated» italic line should be `<p><time>` for SR semantics

**Spec change.** The current D2 markdown has `*Last updated: 2026-04-27*` rendered presumably as `<em>`. Wrap the date in a `<time dateTime="2026-04-27">` element so SR users + crawlers parse the date as machine-readable:

```tsx
<p className="text-sm" style={{ color: 'var(--provedo-text-tertiary)' }}>
  Last updated: <time dateTime="2026-04-27">2026-04-27</time>
</p>
```

Drop the italics on this metadata line — italics here serve no semantic purpose and are redundant with the «Last updated» label. **Avoids unnecessary AT emphasis-prosody.** Italic on the trailing line at the end of the doc can stay (decorative / soft sign-off).

### A2.3 — MEDIUM: link contrast on body text

**Issue.** D2 spec defines body text color as `var(--provedo-text-secondary)` = `#334155`. The body contains an inline `mailto:` link «support@provedo.app» (line 264). Spec does not specify link color.

**If links inherit body color (#334155 = slate-700) on `#FAFAF7` page bg = 11.4:1 (AAA).** PASS as text-contrast. **BUT WCAG 1.4.1 Use of Color (A)** requires that link semantics not rely on color alone — there must be an underline OR a separate non-color affordance.

**Spec change.** Spec for `/disclosures` body links:

```css
article a {
  color: var(--provedo-accent); /* #0D9488 = 4.6:1 on #FAFAF7 — AA */
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-thickness: 1px;
}
article a:hover { text-decoration-thickness: 2px; }
article a:focus-visible {
  outline: 2px solid var(--provedo-accent);
  outline-offset: 2px;
  border-radius: 2px;
}
```

**WCAG SC: 1.4.1 Use of Color (A) + 1.4.3 Contrast Minimum (AA) + 2.4.7 Focus Visible (AA).**

### A2.4 — MEDIUM: provide direct skip-link or sectional nav to verbatim block

**Brief requirement (A2):** «75-word verbatim block reachable via skip-link or sectional nav.»

The D2 page does NOT contain the verbatim 75-word footer block — it CONTAINS-AND-EXPANDS it. The verbatim block lives in the footer's Layer 2 only. So the «reachable via skip-link» requirement on `/disclosures` is misframed: the page is the long-form expansion, not a verbatim mirror.

**However:** for regulator-readability + SR users who want to jump to a specific clause, add a TOC at the top of the page:

```tsx
<nav aria-label="On this page" className="mb-8">
  <ol className="text-sm space-y-1">
    <li><a href="#who">Who Provedo is and is not</a></li>
    <li><a href="#what">Information we provide</a></li>
    <li><a href="#per-jurisdiction">Per-jurisdiction notes</a></li>
    <li><a href="#past-performance">Past performance and predictions</a></li>
    <li><a href="#decisions">Your decisions, your responsibility</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</nav>
```

Each `<h2>` then carries the matching `id`. **WCAG SC: 2.4.5 Multiple Ways (AA) + 2.4.1 Bypass Blocks (A).**

### A2.5 — PASS: SSR-only / no client JS

D2 spec uses `Metadata` export and a sync default function. No `'use client'`, no client-side data fetching. Page renders without JS — full a11y tree available on initial paint. PASS.

### A2.6 — PASS: heading hierarchy

`<h1>` Regulatory disclosures → 6× `<h2>` sections. No `<h3>` needed at this length. Sequential and complete. PASS WCAG 1.3.1.

---

## A3 — Audience-whisper reading-order

**Verdict: PASS-AS-SPECCED.**

### What the spec gets right

V2 spec (PD lines 122-178) places the audience-whisper as proof-bar small-print, OUTSIDE the `<dl>` cell grid, INSIDE the same `<section>`, BELOW the cell row, BEFORE the bottom 1px border.

**Reading-order linearization** (visual-order = DOM-order):

1. `<section aria-label="Proof points">` enters
2. `<dl>` with 4 `<dt>/<dd>` groups — SR announces «list, 4 items» (or AT-specific equivalent for description list)
3. `<p>` audience-whisper «For investors who hold across more than one broker.»
4. `</section>` exits

This matches visual reading flow: data first, audience-frame second. PASS WCAG 1.3.2 Meaningful Sequence (A).

### A3.1 — Contrast verification (corrected for actual token values)

**PD spec claims** color `var(--provedo-text-tertiary)` (claimed slate-500) on `--provedo-bg-muted` (`#F5F5F1`) = 4.7:1.

**Actual token** `--provedo-text-tertiary` = `#475569` (slate-600), NOT slate-500. Recomputed:

- `#475569` on `#F5F5F1` ≈ 7.4:1 (AAA — well above 4.5:1 AA minimum)

PASS WCAG 1.4.3 Contrast Minimum (AA). Italic styling does not affect contrast ratio.

### A3.2 — Italic + SR prosody check

**Concern raised in dispatch:** «If italicized, ensure it's not announced with weird emphasis breaks.»

**Verdict.** CSS `font-style: italic` applied via inline style does NOT add `<em>` semantics. SRs interpret `font-style` as visual-only and do NOT add prosodic emphasis. The text reads as plain text. PASS.

**Counter-flag.** If frontend-engineer wraps the line in `<em>` for «richer» semantics, that WOULD trigger SR emphasis prosody — which is undesirable here (the line is descriptive ICP framing, not emphatic). **Spec note:** keep it `<p>` only. No `<em>` wrap.

### A3.3 — Mobile wrap behavior at 320-479px

Spec wraps to 2 lines at 320-479px. Visual wrap creates a virtual line break in the DOM only via CSS — SRs read the full sentence as one unit. PASS.

### A3.4 — Counter-recommendation rejected

Content-lead D5 floated a stronger preference for «proof-bar HEADER» placement (above the cells). PD chose «below cells» in V2.

**A11y assessment of both placements:**

- **Below cells (PD chosen):** Reading-order = data → frame. Cognitive flow: «here are 4 facts → here's who they're for.» Acceptable.
- **Above cells (content-lead alternative):** Reading-order = frame → data. Cognitive flow: «here's who → here are facts.» Also acceptable.

Both are WCAG-compliant. The choice is editorial, not a11y-blocking. PD spec stands. PASS.

---

## A4 — Removed-secondary-CTA tab-flow

**Verdict: PASS-AS-SPECCED with 1 LOW recommendation.**

### What the spec gets right

V4-A (hero, lines 328-355): drops `ProvedoNavLink` «Or start free forever», keeps single primary CTA. Wrapper `<div>` retained for layout consistency.

V4-B (repeat-CTA, lines 356-411): drops the same NavLink, keeps the «Or see Plus pricing →» link inside the small-print `<p>`. Wrapper `<div className="mt-4">` deleted entirely.

### A4.1 — Tab-stop count verification (post-impl)

**Hero before slice:**
1. Skip-link → 2. Wordmark → 3. Pricing nav → 4. Sign-in nav → 5. Get-started CTA → 6. Hero «Ask Provedo» CTA → 7. **«Or start free forever»** ← REMOVED → 8. Demo tabs

**Hero after slice:**
1. Skip-link → 2. Wordmark → 3. Pricing nav → 4. Sign-in nav → 5. Get-started CTA → 6. Hero «Ask Provedo» CTA → 7. Demo tabs

Tab-stop count drops by 1 in the hero. Logical, no orphan focus.

**Repeat-CTA before slice:** «Ask Provedo» → «Or start free forever» → «Or see Plus pricing →»
**Repeat-CTA after slice:** «Ask Provedo» → «Or see Plus pricing →»

Tab-stop count drops by 1 in the repeat-CTA. Logical, no orphan focus.

### A4.2 — Empty-wrapper-div check

V4-A keeps the empty-ish wrapper `<div className="mt-10 flex flex-col items-center lg:items-start">`. **A11y impact: zero.** Empty divs are skipped by SRs and AT focus traversal. PASS.

V4-B deletes the wrapper containing the removed NavLink. PASS.

### A4.3 — LOW: Verify that the empty wrapper doesn't introduce keyboard-trap risk

Native flex `<div>` with single child cannot create a focus trap. PASS theoretically. **Code-verify** at preview time that no `tabindex` or `role` was inadvertently inherited.

### A4.4 — Touch-target check on remaining primary CTA

Primary CTA `ProvedoButton variant="primary" size="lg"` — verify rendered hit area meets WCAG 2.5.8 Target Size Minimum (24×24 CSS pixels) AA. The `size="lg"` button at typical implementations is comfortably above 44×44 (the older AAA target), so AA passes by a wide margin. PASS by inheritance.

### A4.5 — Microcopy patch a11y-neutral

«50 chat messages a month, free always.» → «50 free questions a month.» Same `<p>` semantic. SR-neutral. PASS.

---

## A5 — Single-testimonial S7 regression

**Verdict: PASS-AS-SPECCED with 1 MEDIUM recommendation.**

### What the spec gets right

V5 spec collapses the 3-card grid (`grid gap-6 md:grid-cols-2 lg:grid-cols-3`) to a single centered `<figure>` (max-width 640px). Preserves:
- `<section aria-labelledby="testimonials-heading">` outer wrapper
- `<h2 id="testimonials-heading">` semantic
- `<figure>` + `<blockquote>` + `<figcaption>` triplet
- `aria-hidden="true"` on the decorative `«` glyph
- `<hr>` semantic divider
- `TierBadge` component with `aria-label="Plus tier"` (existing, lines 41-61 of `ProvedoTestimonialCards.tsx`)

### A5.1 — MEDIUM: `<hr>` between blockquote and figcaption

**Concern.** Inside a `<figure>`, an `<hr>` between content and caption is **questionable HTML semantics**. `<hr>` represents a thematic break between paragraphs, not a visual decoration inside an atomic figure. SRs may announce «horizontal rule» / «separator», which is unhelpful between a quote and its attribution.

**Spec change.** Replace `<hr>` with a CSS `border-top` on the `<figcaption>`:

```tsx
<figcaption
  style={{
    borderTop: '1px solid var(--provedo-border-subtle)',
    paddingTop: '20px',
    marginTop: '32px',
  }}
>
  ...
</figcaption>
```

Visual identical, drops the spurious SR announcement. **WCAG SC: 1.3.1 Info and Relationships (A).**

(This is a regression carry-forward — the existing `ProvedoTestimonialCards.tsx` already uses `<hr>`. Worth fixing in the same slice since the file is being rewritten anyway.)

### A5.2 — Heading restructure check

D3 + V5 move «Alpha quotes coming Q2 2026.» from below-quote to inside the section header sub-line. The `<h2>` itself is unchanged. The section sub `<p>` is rewritten. **No heading-hierarchy regression.** PASS.

### A5.3 — Disclosure-line drop check

V5 / D3 drop the existing footer disclosure paragraph («Provedo is in pre-alpha. Quotes are from the team building the product. Real alpha-tester quotes replace these once alpha ships.»). The honest framing moves into the section sub.

**A11y impact.** Removing a `<p>` reduces SR linearization length but does not break landmark or heading semantics. The replacement framing in the sub-line is announced earlier in the section. PASS.

### A5.4 — Tier badge SR readout

Existing badge: `aria-label="Plus tier"` + visible text «Plus user». SR will announce «Plus tier» (label takes precedence). PASS for AT users; visible-text «Plus user» mismatch with SR-announced «Plus tier» is acceptable but slightly odd. **Optional fix:** change `aria-label` to «Plus user» to match visible text exactly (WCAG 2.5.3 Label in Name AA — passes either way since «Plus» is in both, but matching is cleaner).

### A5.5 — Single `<figure>` semantics on solo card

`<figure>` with single `<blockquote>` + `<figcaption>` is canonical. SR announces «figure, quote: [text], end of quote, figure caption: [name + role]». Works correctly. PASS WCAG 1.3.1.

### A5.6 — Reduced-motion preserved

`ScrollFadeIn` wrapper present (existing pattern, honors `usePrefersReducedMotion`). PASS — no new motion introduced.

### A5.7 — Color contrast on solo card

`<blockquote>` color bumps from `--provedo-text-secondary` to `--provedo-text-primary` per V5 spec.

- `--provedo-text-primary` `#0F172A` on `--provedo-bg-elevated` `#FFFFFF` = 17.4:1 (AAA). PASS by a wide margin.
- Caption-name `#0F172A` on `#FFFFFF` = 17.4:1 (AAA).
- Caption-sub `--provedo-text-muted` (slate-500 per spec, but token value not in `layout.tsx`'s defined set — needs verification) on `#FFFFFF` ≈ 4.6:1 if `#64748b`. PASS at AA assuming the token resolves to slate-500.

**NEEDS-CODE-VERIFICATION.** `--provedo-text-muted` is referenced in PD spec but NOT defined in the marketing-layout token block (lines 34-48 of `layout.tsx` define `text-primary` / `text-secondary` / `text-tertiary` only). If `text-muted` is undefined at the layout root, the rule cascades to whatever the inherited browser/global default is — possibly black. **Spec change for frontend-engineer.** Either:
- (a) Add `--provedo-text-muted: #64748b` to the layout token block, OR
- (b) Replace `--provedo-text-muted` references in V5 spec with `--provedo-text-tertiary` (which IS defined).

This is a TOKEN-INTEGRITY bug masking as an a11y risk. Flag for frontend-engineer + tech-lead.

---

## Reduced-motion regression check (carried from dispatch)

| Item | Verdict |
|---|---|
| Audience-whisper line — no animation | PASS (static text) |
| `<details>` open/close — native browser, no animation | PASS |
| Chevron rotation 150ms — uses motion vars | PASS (existing pattern) |
| Cell #3 «5 min» — opacity fade-in, no count-up | PASS (V1 spec line 102 explicitly forbids count-up) |
| Cell #4 `100%` — existing count-up retained, honors `usePrefersReducedMotion` | PASS (existing pattern) |
| Solo testimonial — `ScrollFadeIn` honors reduced-motion | PASS (existing pattern) |

No new reduced-motion violations introduced.

---

## Cross-cutting observations

### O1 — `'use client'` minimization

Layer 2 `<details>` is a native HTML element. If frontend-engineer follows A1.1 (CSS `:focus-visible` instead of inline JS handlers), `MarketingFooter.tsx` does NOT need `'use client'`. Net: better SSR, lower JS-bundle, faster INP. Worth the small refactor.

### O2 — `/disclosures` link from footer is the legal-belt-and-suspenders path

Per legal-advisor §2: the verbatim 75-word block must be reachable WITHOUT operating the `<details>` toggle. Current PD spec puts the «Read full extended disclosures →» link INSIDE the expanded Layer 2 — meaning users must first expand the disclosure to find the link.

**Spec change recommendation.** Add a SECOND, ALWAYS-VISIBLE link to `/disclosures` somewhere in the footer (e.g., footer nav row alongside «Pricing» and «Sign in»). Even in collapsed Layer 2 state, the regulator-readable text remains reachable in one click via this anchor.

```tsx
<nav aria-label="Footer navigation" className="flex items-center gap-5">
  <Link href="/pricing" ...>Pricing</Link>
  <Link href="/sign-in" ...>Sign in</Link>
  <Link href="/disclosures" ...>Disclosures</Link> {/* ADD */}
</nav>
```

This addresses both:
- A11y: AT/browser combos that hide collapsed `<details>` content from the a11y tree (legal-advisor §2 mitigation #3)
- Legal: regulator-readability without requiring AT-toggle interaction

**Action:** flag for tech-lead + legal-advisor concurrence. Trivial impl.

### O3 — Content-lead D2 page title metadata

`title: 'Regulatory disclosures · Provedo'` — clear, SR-friendly browser-tab announcement on navigation. PASS WCAG 2.4.2 Page Titled (A).

### O4 — Skip-link continuity

`MarketingHeader.tsx` skip-link targets `#main-content`. `/disclosures` page (per A2.1 spec change) lives inside the `<main id="main-content">` provided by `(marketing)/layout.tsx`. Skip-link works on `/disclosures` automatically. PASS WCAG 2.4.1 Bypass Blocks (A).

---

## Compliance mapping (WCAG 2.2 SC addressed)

| SC | Level | Addressed in |
|---|---|---|
| 1.3.1 Info and Relationships | A | A1, A2.1, A5.1, A5.5 |
| 1.3.2 Meaningful Sequence | A | A3 |
| 1.4.1 Use of Color | A | A2.3 |
| 1.4.3 Contrast Minimum | AA | A3.1, A5.7 |
| 2.1.1 Keyboard | A | A1, A4 |
| 2.4.1 Bypass Blocks | A | A2.4, O4 |
| 2.4.2 Page Titled | A | O3 |
| 2.4.3 Focus Order | A | A1.2, A4.1 |
| 2.4.5 Multiple Ways | AA | A2.4 |
| 2.4.7 Focus Visible | AA | A1.1, A2.3 |
| 2.4.11 Focus Not Obscured (Minimum) | AA (new in 2.2) | A1.1 |
| 2.5.3 Label in Name | A | A5.4 |
| 2.5.8 Target Size (Minimum) | AA (new in 2.2) | A4.4 |
| 4.1.2 Name, Role, Value | A | A1.3, A5.5 |

---

## Spec-change summary (pre-implementation actions for frontend-engineer)

| ID | Severity | Action |
|---|---|---|
| A1.1 | HIGH | Use CSS `:focus-visible` on Layer 2 `<summary>`, NOT inline JS handlers. Keeps `MarketingFooter.tsx` server-rendered. |
| A1.3 | LOW | Wrap Layer 3 link `→` glyph in `<span aria-hidden="true">` to suppress SR readout. |
| A2.1 | HIGH | Use `<article>` not `<main>` in `/disclosures` page (avoid landmark nesting with marketing layout's `<main>`). |
| A2.2 | MEDIUM | Wrap «Last updated» date in `<time dateTime="2026-04-27">`. |
| A2.3 | MEDIUM | Add explicit underline + accent color + focus-visible ring on `/disclosures` body links. |
| A2.4 | MEDIUM | Add TOC `<nav aria-label="On this page">` at top of `/disclosures` for sectional jump. |
| A5.1 | MEDIUM | Replace `<hr>` between blockquote and figcaption with CSS `border-top` on `<figcaption>`. |
| A5.4 | LOW | Optional: change TierBadge `aria-label` to «Plus user» to match visible text exactly. |
| A5.7 | HIGH-BLOCKING | Resolve `--provedo-text-muted` token (either define it in layout.tsx OR replace V5 references with `--provedo-text-tertiary`). |
| O2 | MEDIUM | Add ALWAYS-VISIBLE `/disclosures` link to footer nav row (independent of Layer 2 toggle). |

---

## Items requiring post-impl code-level verification

| ID | What |
|---|---|
| A1.2 | `<details>` Tab + Shift-Tab traversal correctness on Vercel preview |
| A1.3 | SR state-change announcement combo-test (NVDA+Firefox or VoiceOver+Safari, document which) |
| A4.3 | Verify no inadvertent `tabindex` / `role` on retained empty wrapper div |
| A4.4 | Verify rendered primary CTA hit area ≥ 24×24 CSS px |
| A5.7 | Verify `--provedo-text-muted` resolves to a defined token at runtime |

---

## Sign-off

**A1 — `<details>` keyboard + SR pattern:** PASS-AS-SPECCED + 1 HIGH spec change (A1.1) + 2 NEEDS-CODE-VERIFICATION.
**A2 — `/disclosures` page structure:** PASS-AS-SPECCED + 4 spec changes (A2.1 HIGH, A2.2 MEDIUM, A2.3 MEDIUM, A2.4 MEDIUM).
**A3 — Audience-whisper reading-order:** PASS-AS-SPECCED.
**A4 — Removed-secondary-CTA tab-flow:** PASS-AS-SPECCED + 1 NEEDS-CODE-VERIFICATION (A4.3).
**A5 — Single-testimonial S7 regression:** PASS-AS-SPECCED + 1 MEDIUM (A5.1) + 1 HIGH-BLOCKING token-integrity issue (A5.7).

**Cross-cutting recommendation O2:** Add always-visible `/disclosures` link to footer nav for legal-advisor §2 compliance + AT-tree resilience.

**No CRITICAL blockers identified.** All findings are addressable at impl time without architectural rework.

**Follow-up code-level audit required after Vercel preview is up.** This spec audit cannot substitute for runtime AT testing.

---

**End — Slice-LP3.2 a11y-architect spec audit.**
