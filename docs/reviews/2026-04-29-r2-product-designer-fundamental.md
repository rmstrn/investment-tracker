# Round-2 Fundamental Visual Review — product-designer angle

**Date:** 2026-04-29
**Branch:** `chore/plugin-architecture-2026-04-29` @ `afef2bf`
**Scope:** read-only audit + brainstorm. NOT iteration. Looking for the fundamental wrong-tool / wrong-shape / wrong-hierarchy gaps that Round 1 missed.
**PO trigger:** Round 1 produced 14 fixes Tier 0-3 + 8 chart bullets. PO says nothing fundamental changed. Iterative approach is failing.

---

## §0 — Iteration trap diagnosis

Round 1's 3-voice brainstorm produced **14 surface-level fixes** (token bumps, prop wiring, copy swaps, legend gates, stroke widths). Every fix was correct *within its frame*. The frame itself is wrong.

The frame is: **«React showcase should match static showcase as closely as possible.»**

Three failure modes follow from that frame:

1. **Parity ceiling.** When the goal is parity, the upper bound of perceived quality is the static reference. The static reference is a hand-crafted single-file artefact built for a critique session, not a product. It is *also* not award-level. So «achieve parity» = «cap at not-very-good».
2. **Catalog format.** Static is a catalog of primitives in `<DsSection>` slabs (Color tokens / Typography / Shadow / Buttons / Forms / Cards / Toasts / Modal / Navigation / Chat / Table / Avatars / Charts). A catalog is a *documentation* register. Documentation does not convey brand. Editorial portfolios convey brand. Bento mockups convey brand. Catalogs convey *coverage*.
3. **Library-bound charts.** Static charts are hand-drawn SVG paths (51 `<svg>` elements). Recharts cannot match hand-drawn SVG with theming alone — Recharts always looks like a charting library trying to look bespoke, and the seams are visible (axis tick fonts, tooltip chrome, default dot rendering). Round 1 piled 8 patches on top of Recharts; the gap remains because the gap is the *tool*.

**Why Round 1 didn't move the needle:** every fix shrunk the gap to static. None of the fixes broke past static. PO is reading visual quality holistically — small absolute deltas register as «mostly the same».

**A fourth failure mode found in this audit:** the React showcase is **missing 5 entire sections** that exist in the static reference: **Toasts, Modal/paywall, Navigation, Chat, Table**. Round 1 didn't catch this because Round 1 was sectioned by *fix-list*, not by *section-coverage diff*. This alone is a 30-40% «not-the-same» perception delta the PO is correctly registering.

---

## §1 — Seven fundamental directions × brainstorm 3-5 alternatives each

### Direction 1 — Charts: Recharts vs hand-rolled SVG

**Problem:** static charts are illustration-quality (precise Bézier curves, hand-tuned tick stops, paper-cut donut sectors). Recharts adds theme to a generic charting engine; the result reads as «library tried hard», not «illustrated».

**Alternatives:**
- **A.** Stay on Recharts, deepen theming layer (current approach). Iteration trap.
- **B.** Replace Recharts with hand-crafted React SVG components per chart type (Line, Area, Bar, Donut, Treemap, Waterfall, Calendar, Sparkline). Generate paths from fixture data using D3-shape (`d3-scale`, `d3-shape`) — no Recharts.
- **C.** Hybrid: use Recharts for interaction (tooltip, hover state, focus), but *render the visible geometry* (paths, bars, donut sectors) ourselves via custom shape components passed into Recharts.
- **D.** Use a different library closer to bespoke (Visx — D3 + React primitives, no opinion on theming).
- **E.** Static-screenshot the charts as illustrations for the showcase only; ship Recharts in product. Showcase = aspirational, product = practical.

**Pick: C (hybrid) for showcase + product. Defensible because:**
- Preserves interaction + a11y plumbing (Recharts already gives keyboard nav, ARIA roles, payload tooltips).
- Replaces the visible geometry with hand-shape components (Bézier paths for line/area, paper-cut sectors for donut, anchored pillars for waterfall).
- Visx (D) is the secondary if hybrid plumbing fights us — it's the strongest «React-native low-level» option.
- E is a tempting time-saver but creates a divergence between showcase and product that PO will notice the moment they open a real product surface.

**Reject A** (current iteration trap). **Reject B** (rebuilds a11y/keyboard from zero). **Reject D** initially because the migration cost is high and Recharts already runs in product; reach for D only if hybrid stalls. **Reject E** (showcase ≠ product = trust break).

---

### Direction 2 — Section ORDER and stage shape

**Problem:** today's React stage renders Foundation → Primitives → Forms → Cards → Charts. Static does Color → Typography → Shadow → Hero → Buttons → Forms → Cards → Empty → Chips → Toasts → Modal → Navigation → Chat → Table → Avatars → Charts. We dropped 5 sections + reordered.

**Alternatives:**
- **A.** Match static section order + sections 1:1.
- **B.** Editorial sequence: lead with the most product-defining surface (Chat or Insight card), then Charts as a feature spread, then primitives as supporting documentation at the END.
- **C.** Three-act: ACT 1 «What you'd see» = Chat + Insight + Portfolio cards (product mockup), ACT 2 «How it's drawn» = primitives, foundations, charts catalog, ACT 3 «How it holds up» = states (empty, loading, error, paywall, toast).
- **D.** Bento dashboard: a single rich mock dashboard demonstrating EVERY primitive in real composition, with a primitives appendix below.
- **E.** Reverse-pyramid: Charts and complex composition first (the hard stuff that proves the system works), then primitives.

**Pick: C (Three-act).** Magazine/editorial register is documented in ui-ux-pro-max as ✓ WCAG AAA, Performance Excellent, and explicitly «print-inspired». Matches Provedo positioning (E-Ink/Paper archetype). Three-act gives the *narrative arc* that catalog format lacks. ACT 1 is the «wow» the PO is looking for; ACT 3 demonstrates rigor.

**Reject A** (parity ceiling). **Reject B** (no rigor demonstration). **Reject D** (one bento can't honestly show toast + modal + paywall + chat + table without becoming a Frankenstein dashboard). **Reject E** (good idea but skips the «what is this product» context).

---

### Direction 3 — Showcase format: catalog vs product-mockup

**Problem:** the showcase IS a catalog. PO is judging visual quality. Catalogs cannot communicate visual quality at the same density as a real product surface — they show *coverage*, not *composition*.

**Alternatives:**
- **A.** Pure catalog (today).
- **B.** Pure product-mockup (one fake dashboard page).
- **C.** **Three-act layered** (per Direction 2-C): ACT 1 product mockups (Chat thread + Insight + Portfolio bento), ACT 2 catalog (existing primitives sections), ACT 3 states.
- **D.** Storybook-style stories where each primitive has a 20-second «in-context» mini-mockup beside it.
- **E.** Single long-form scroll narrative: «Meet Provedo» → mockup → «Here's how it's built» → primitives → «Here's how it fails gracefully» → states.

**Pick: C.** Same as Direction 2 — three-act gives both wow and rigor. D (Storybook side-by-side) is the second-best, but doubles the page length and shifts focus from «one big visible system» to «mini-fragments». E is a fancy version of C, defer the fancy.

**Reject A** (current). **Reject B** (no rigor). **Reject D** (length explosion). **Reject E** (too ambitious for one delivery).

---

### Direction 4 — Typography ladder

**Problem:** Geist 600 at 48px Display does not feel «editorial paper». It feels like a SaaS landing page. Static reference uses Geist too — same mediocrity. PO says nothing changed even after we swapped real Provedo copy in. The font itself is the limiter.

**Alternatives:**
- **A.** Stay on Geist + Geist Mono. Apply tighter letter-spacing (`-0.045em` at Display, current is `-0.035em`) and bump Display to 56-64px.
- **B.** Add a serif accent: keep Geist for body/UI, introduce a single serif (Source Serif 4 / Newsreader / Inter Display alternative) for Display + H1 only. Per UPM Magazine Style result: «Bodoni's editorial elegance + Public Sans for clean UI.» Direct precedent.
- **C.** Triple stack: Display = Playfair Display 900 / Body = Geist / Mono = Geist Mono. Per UPM «Minimalist Monochrome Editorial» pairing — explicitly «editorial publications, portfolio apps, e-reader aesthetics».
- **D.** Hand-tune Geist with `font-feature-settings: "ss01" "cv11" "tnum"` etc. + variable weight axis 580 (between 500/600). Subtle character without adding a font.
- **E.** Drop Geist entirely. Move to Inter Display + Inter — boring but performance-neutral.

**Pick: B (serif accent).** Per UPM, direct precedent for «editorial portfolio» pairing. Adds *character* without adding *bloat* (only Display + H1 use the serif; everything else stays Geist). C is more ambitious but deviates from the locked Provedo brand decision (Geist + Geist Mono LOCKED 2026-04-27 per memory). B is *additive*, not *replacement* — easier to defend as «editorial accent on the locked stack» than C («replace heading family»).

This is the single most likely-to-«wow» change. Whisper edges in body, ELOQUENCE in heads. Patagonia / Stripe Press canon — heads have shape, body is invisible.

**Reject A** (we already iterated tracking, no perceptual jump). **Reject C** (breaks locked brand). **Reject D** (subtle, won't move PO needle). **Reject E** (downgrade).

---

### Direction 5 — Proportions / asymmetry

**Problem:** stage frame padding `36 40 44`, asymmetric bottom-heavy. Cards 14px gap. ChartCard 18-20px padding. Everything is in the «medium tight» band. No real silence. Editorial design uses *extreme* whitespace ratios (1:4, 1:6) for breath.

**Alternatives:**
- **A.** Keep current proportions, fix only contrast issues.
- **B.** Inflate vertical rhythm: section gaps `60-80px` between major slabs, stage padding `48 56 80`. More breath. Risk: scroll length.
- **C.** Bento spacing: irregular grid with 2x1, 2x2, 1x1 cells; gaps 24-32px. Per UPM bento style: card-radius 24, gap 20, page-bg #F5F5F7, hover scale 1.02. Direct precedent.
- **D.** Asymmetric Swiss grid: 12-col, primary content on cols 2-9, marginalia on cols 10-12 (eyebrows, meta, tier labels). Magazine-density.
- **E.** Paper-page proportions: stage frame becomes a single «tall paper page» with broad outer margin (10vw left/right desktop), narrow inner gutter. Reads as a printed sheet.

**Pick: D (asymmetric Swiss/magazine grid).** Combined with Direction 4-B (serif accent) this is the fundamental editorial pivot. Marginalia column is exactly where mono eyebrows + tier labels + meta go — they stop being chrome dust on full-width rows and become deliberate sidenotes. ui-ux-pro-max Editorial Grid result confirms: «multi-column text, bylines, section dividers, white space balance, asymmetric grid».

**Reject A** (no needle move). **Reject B** (just bigger, not better). **Reject C** (bento conflicts with the editorial register; bento is consumer-tech / Apple). **Reject E** (extreme; breaks responsive at 320-768).

---

### Direction 6 — Magician + Sage archetype visibility

**Problem:** archetype lives in copy («Notice what you'd miss»). It does NOT live in visual decisions. A Magician interface should *reveal* (motion-on-arrive, ink that draws itself, content that appears through subtraction). A Sage interface should *cite* (footnotes, sources, marginalia).

**Alternatives:**
- **A.** Don't address; archetype is a brand-strategist concern, not visual.
- **B.** Add reveal motion: section heads draw an underline on first scroll-into-view (200-300ms ease, transform/opacity only); ink-rule scribbles in. Magician = revelation.
- **C.** Add citation marginalia: every claim in copy gets a tiny mono footnote in the margin column (per Direction 5-D grid). «3 cross-broker patterns this week¹» with marginal footnote «¹ Audit 2026-04-26 · 7 brokers.» Sage = citation.
- **D.** Both B + C combined.
- **E.** Add a «sleight of hand» motif: hover state on insight cards reveals an underline-and-pull-quote layer (e.g., the insight gets a typographic «pull quote» treatment on hover). Quiet revelation.

**Pick: D (B + C combined).** Each is small, both are essential. Reveal motion = Magician, marginalia = Sage. Without one of them the archetype is a copy-only claim.

**Reject A** (PO is asking for visual change; copy-only is the complaint). **Reject B alone** (Sage missing). **Reject C alone** (Magician missing). **Reject E** (too ornamental, distracts from data).

---

### Direction 7 — Match static vs transcend static

**Problem:** static is the floor we've been treating as the ceiling.

**Alternatives:**
- **A.** Match static. (Round 1 stance.)
- **B.** Replace static. Demolish `design-system.html` once React showcase is the canonical reference. No more side-by-side. Forces the React showcase to stand on its own without hiding behind «we matched the static».
- **C.** Transcend: React showcase becomes an *award-quality artefact* (Awwwards / SiteInspire calibre). Use static only as a structural skeleton; visual ambition exceeds it.
- **D.** Decommission both: showcase becomes a Storybook with stories per primitive; the website-style visual lives only in the actual product surfaces (Dashboard, Chat).
- **E.** Two-track: keep static as the «primitive coverage map» (catalog), build a SECOND surface `/design-system/showroom` as the editorial product mockup. Same content, two angles.

**Pick: C (transcend) + B (eventually retire static once React surpasses it).** This is the strategic shift: stop comparing, start setting the bar. Static stays as a backup for one cycle, then is retired. ui-ux-pro-max design-system bootstrap explicitly recommends «Exaggerated Minimalism» + «Bold minimalism, oversized typography, high contrast, negative space, statement design» for portfolio/editorial — that's award-register, not catalog-register.

**Reject A** (the iteration trap). **Reject D** (Storybook is engineering-internal, doesn't communicate product to PO). **Reject E** (split focus, two surfaces to maintain).

---

## §2 — Top-3 FUNDAMENTAL changes recommended

Each is *not* a tweak. Each requires reframing what the showcase IS.

### Fundamental Change #1 — Three-act narrative + restore missing 5 sections

**Why:** the current showcase is a catalog with 30-40% of static's surface coverage missing. Catalog format alone caps perceived quality. Restoring missing sections + reordering into a narrative arc is the single biggest «move the needle».

**Implementation outline:**

```
Outer page H1 = "Provedo Design System v2 — refined" (28px, neutral) — keep.

ACT 1 — "Notice what you'd miss." (product surfaces — the wow)
  Stage: Light
  Content (in this order):
    1. SignatureHero (existing)
    2. Chat — TWO-bubble thread with citation glyphs (NEW — port from static §Chat)
    3. Cards — Portfolio bento (IBKR + BINANCE + INSIGHT 02 + Empty) (existing)
    4. Modal — paywall mock (NEW — port from static §Modal)
    5. Toasts — three variants (NEW — port from static §Toasts)
  Stage: Dark — same content, dark variant.

ACT 2 — "How it's drawn." (primitives + foundations — the rigor)
  Stage: Light
  Content:
    1. Color tokens (existing)
    2. Typography (existing — but per Fundamental #2 below)
    3. Shadow / elevation (existing)
    4. Buttons (existing) + Chips · badges (existing) + Avatars (existing)
    5. Form fields (existing)
    6. Navigation (NEW — port from static §Navigation: topbar + tabs + breadcrumb)
    7. Table — positions table (NEW — port from static §Table)
  Stage: Dark — same, dark variant.

ACT 3 — "How it holds up." (states — the depth)
  Stage: Light
  Content:
    1. Empty states (existing in cards + chart-empty)
    2. Loading skeletons (existing in chart-skeleton)
    3. Error states (NEW — at least one error toast / inline)
  Stage: Dark — same.

ACT 4 — "How it draws data." (charts — only AFTER product mockups)
  Stage: Light + Dark with full chart matrix (existing).

Outside stages: Iconography + Disclaimer + Theme/motion (existing dev utilities).
```

**Why this works:**
- ACT 1 leads with the surfaces a real user sees first (Chat, Insight, Portfolio). PO opens the showcase, sees the *product* before seeing the catalog. That's the wow.
- ACT 2 catalog comes *after* context — primitives now read as «here's the kit that built what you just saw», not «here's a kit, imagine what it could build».
- ACT 3 states *after* chrome — we're proving the system holds up under stress.
- ACT 4 charts are the heaviest visual signature — putting them last is a closer, not an opener.
- Restoring 5 missing sections closes the section-coverage diff vs static.

**Touchpoints:**
- New: `_sections/chat.tsx`, `_sections/modal.tsx`, `_sections/toasts.tsx`, `_sections/navigation.tsx`, `_sections/table.tsx`.
- Reorganise `page.tsx` into 4 acts (currently 2 stages + utility appendix).
- showcase.css needs new classes for chat bubbles, modal stage, toast row, topbar, tabs, breadcrumb, positions table — port from static.

**Estimated complexity:** the 5 missing sections are CSS-heavy but already half-authored in `showcase.css` (chat, modal, toast, topbar, tabs, breadcrumb, table classes are in static; check showcase.css for partials). Most likely a port + paste, not net-new design.

---

### Fundamental Change #2 — Editorial typography pivot (serif accent)

**Why:** Geist alone reads SaaS-generic. Per ui-ux-pro-max Magazine Style precedent, a serif accent on Display + H1 with Geist body is the canonical editorial register. This is the single change that flips «competent SaaS» to «editorial paper».

**Implementation outline:**

```
Add font: Newsreader (Google Fonts; metric-similar to Source Serif 4, low overhead, free).
  - Use only at weights 500 + 600 + 700.
  - Use only for Display 48 + H1 32 + Signature hero 40px headline + signature accent word.
  - Keep H2 / Body / Mono / Numerals on Geist (no change).
  - Italic restraint: NO italic in UI. Reserved for citation glyph subtext (per Sage motif).

CSS additions in showcase.css:
  --font-display: 'Newsreader', 'Geist', serif;
  apply to:
    .showcase-stage-v2__headline (currently 40px Geist 600 → 48px Newsreader 600, same letter-spacing -0.035em)
    .showcase-signature__headline (currently 40px Geist 600 → 48px Newsreader 600)
    .showcase-type-row Display 48 sample (existing 48px → switch to Newsreader)

Constraint: do NOT change body/mono/labels. Only Display + H1 + accent.
```

**Why this works:**
- Direct UPM precedent: «Magazine Style — Bodoni's editorial elegance + Public Sans for clean UI». Newsreader is Source Serif 4-class — same family of choice, more contemporary.
- Provedo positioning is E-Ink/Paper. Paper has serif heads. Period.
- One font addition, one weight tier — performance budget barely moves.
- Zero impact on body / mono / data tables — those stay Geist tabular for legibility.

**Risk:** brand-strategist + tech-lead may push back («Geist locked»). Counter-argument: Geist is locked for body + UI + numerals + mono. Display heading family is *additive*, not replacement. Bring this through a brand-strategist + tech-lead 2-voice review before commit.

**Touchpoints:**
- `apps/web/src/app/layout.tsx` (or wherever fonts are configured) — add Newsreader.
- `_styles/showcase.css` — `--font-display` token + apply to 3 selectors.
- `packages/design-tokens/tokens/semantic/*` — register `font.family.display`.

---

### Fundamental Change #3 — Asymmetric editorial grid + marginalia column

**Why:** current layout is uniform 12-col centered with a 60/40 stage head. Editorial = asymmetric. A marginalia column gives mono eyebrows + tier labels a *home* — they stop floating as chrome dust on full-width rows. Combined with Change #2, this completes the editorial pivot.

**Implementation outline:**

```
Stage frame internal grid:
  [.... marginalia 2col ....] [..... main content 9col .....]
  marginalia (right edge, 320-1024 stacks above):
    - Stage eyebrow (PROVEDO · DESIGN SYSTEM v2 · LIGHT)
    - Tier labels (TIER 1 — MUST-SHIP MVP)
    - Section meta (no italic · tabular nums)
    - DsRow labels (TIER 1 — MUST-SHIP MVP, currently inline)
  main content column:
    - Section heads + bodies + chart cards + tables

Mobile (<768px):
  - Collapse to single column.
  - Marginalia floats above each section as a normal mono eyebrow (current behaviour).
  - This degrades gracefully — no layout shift.

Tablet (768-1024):
  - 2-col asymmetric: marginalia 1.5col + main 6.5col.

Desktop (>1024):
  - Full 11-col asymmetric grid (max-width 1280px container).

Implementation note: this is a CSS-only change inside StageFrame.tsx + DsSection.tsx.
No new components.
```

**Why this works:**
- ui-ux-pro-max Editorial Grid: «asymmetric grid, pull quotes, drop caps, multi-column text, bylines, section dividers, white space balance». Direct map.
- Marginalia gives the «archive» / «journal» visual language that matches Sage archetype.
- Mono eyebrows finally have somewhere to live without competing with section heads for vertical real estate.

**Risk:** breakpoint regressions. Mitigate with explicit responsive testing at 320/375/768/1024/1440/1920 (CONSTRAINTS rule).

**Touchpoints:**
- `_components/StageFrame.tsx` — inner grid template change.
- `_components/SectionHead.tsx` — DsRow label moves to marginalia column.
- `_styles/showcase.css` — new grid-template-areas + responsive breakpoints.

---

## §3 — ui-ux-pro-max queries log (5+ queries × insights)

| # | Query | Domain / Stack | Key insight |
|---|-------|----------------|-------------|
| 1 | "design system showcase product mockup hand-crafted editorial polish" | --domain ux | UX rules domain returned only generic results (mobile-first, loading, gesture). Confirms there is no industry rule that says «catalog». Showcase format is a free choice. |
| 2 | "hand-crafted SVG vs library polish financial editorial" | --domain chart | Only result was Candlestick, not relevant. Implication: chart domain doesn't hold opinion on hand-crafted vs library. Decision is ours. Recharts is a default, not a recommendation. |
| 3 | "magazine layout editorial density section sequence" | --domain ux | Generic results (smooth scroll, content jumping, active state). Confirms section sequencing is also a free choice. The fact that no rule mandates catalog format = catalogs are convention, not requirement. |
| 4 | "muted earth editorial paper magazine palette" | --domain color | Returned «Magazine/Blog» palette: Primary #18181B, Background #FAFAFA, Accent #EC4899 — high-contrast editorial. Confirms editorial palettes lean monochrome with single accent. Provedo's palette (BG #E8E0D0, ink #1A1A1A, jade #2D5F4E, bronze #A04A3D) already matches the *spirit* — just needs the editorial *typography* + *layout*, not a color overhaul. |
| 5 | "AI portfolio tracker fintech B2C chat-first minimal" --design-system Provedo | bootstrap | **MOST USEFUL.** Recommended: Pattern «Portfolio Grid», Style «Exaggerated Minimalism — bold minimalism, oversized typography, high contrast, negative space, statement design», Typography «Archivo + Space Grotesk». Effects: «font-size: clamp(3rem 10vw 12rem), font-weight: 900, letter-spacing: -0.05em, massive whitespace». **AVOID: Playful design + Unclear fees + AI purple/pink gradients.** This corroborates Direction 4-B + Direction 5-D + Direction 7-C: oversized typography, massive whitespace, statement design = editorial. We are NOT doing oversized today (Display is 48px, recommendation is `clamp(3rem 10vw 12rem)` which tops out near 192px). Newsreader Display at 64-80px would close that gap. |
| 6 | "magician archetype quiet revelation interface restraint" | --domain ux | Zero results. Archetype is not in the rule database. Confirms archetype-to-visual translation is a designer judgment call, not a rule lookup. Direction 6 (reveal motion + marginalia) is original work. |
| 7 | "bento grid editorial layout dashboard" | --domain style | Returned BOTH «Bento Box Grid» and «Editorial Grid / Magazine». **Editorial Grid: WCAG AAA, Performance Excellent, Complexity Low, Light + Dark Full.** Bento Grid: WCAG AA, Excellent, Light + Dark Full. **Editorial wins on accessibility (AAA vs AA) and aligns with positioning. Picks Direction 5-D over 5-C.** |
| 8 | "Geist sans editorial portfolio finance pairing" | --domain typography | Three pairings returned. Most relevant: «Magazine Style — Libre Bodoni + Public Sans, magazine, editorial, publishing, refined, journalism». Direct UPM precedent for «editorial accent on UI sans». Newsreader is the modern equivalent of Bodoni for digital body (Bodoni is print-only, optical-sized, Newsreader is Google-Fonts editorial serif designed for screen). |
| 9 | "scrollytelling immersive long-form storytelling" | --domain style | Editorial Grid AAA wins again. Parallax Storytelling explicitly «Performance ❌ Poor, Accessibility ❌ Poor (motion)» — rejected. Confirms Direction 6-B (reveal motion) must stay subtle (transform/opacity only, ≤300ms, respect `prefers-reduced-motion`), not full parallax. |
| 10 | "performance bundle suspense" | --stack nextjs | Confirms Suspense + streaming are the right tools for new sections (Modal, Chat). Modal can mount lazy. Chat bubbles are static — no Suspense needed there. |

**Most useful query: #5 (`--design-system Provedo`).** Three concrete deliverables surfaced from that single call:
1. Style direction = «Exaggerated Minimalism» (oversized typography is missing today).
2. Avoid list = «AI purple/pink gradients» (good — we don't do this).
3. Implementation hint = `font-size: clamp(3rem 10vw 12rem)` for headlines (we cap at 48px, which is in the SaaS register, not the editorial-statement register).

---

## §4 — Discarded directions (record so we don't re-litigate)

| Direction | Discarded option | Reason |
|-----------|------------------|--------|
| 1 (charts) | A. Iterate Recharts theme deeper | Round 1's trap. Theming a charting library never reaches hand-crafted illustration register. |
| 1 (charts) | B. Replace Recharts entirely | Throws away a11y plumbing for a register gain. Hybrid (C) gets the gain without the loss. |
| 1 (charts) | E. Static-screenshot the showcase charts | Showcase ≠ product divergence. PO will catch in product. |
| 2 (sequence) | A. Match static 1:1 | Parity ceiling. |
| 2 (sequence) | D. Bento dashboard | Can't honestly demo 5 missing sections in one bento. |
| 3 (format) | A. Pure catalog | Today. Iteration trap. |
| 3 (format) | B. Pure mockup | Doesn't demonstrate primitive coverage / rigor. |
| 4 (typography) | A. Tweak Geist tracking only | We did this. No needle move. |
| 4 (typography) | C. Triple-stack with Playfair | Breaks locked Geist+GeistMono brand. Newsreader is additive only. |
| 4 (typography) | E. Drop Geist | Downgrade. |
| 5 (proportions) | C. Bento spacing | Bento = consumer/Apple register, not editorial. |
| 5 (proportions) | E. Paper-page extreme margins | Breaks responsive. |
| 6 (archetype) | A. Don't address visually | PO complaint is visual. Copy-only fails. |
| 6 (archetype) | E. Hover-pull-quote on insight cards | Ornamental, distracts from data. |
| 7 (transcend) | A. Match static | Iteration trap. |
| 7 (transcend) | D. Decommission both | Storybook is internal-only. |
| 7 (transcend) | E. Two-track (showroom + catalog) | Maintenance split. |

---

## §5 — Recommendation: pivot, not iterate

**Stay-the-course OR pivot:** **PIVOT.**

**Pivot to:** the three-act editorial narrative (FC#1) + Newsreader Display accent (FC#2) + asymmetric marginalia grid (FC#3) + hybrid Recharts (Direction 1-C, lower priority — defer to a later cycle since it's an isolated subsystem).

**What to abandon:**
- The Round-1 «iterate visual fixes» frame.
- The «match static reference» goal.
- The catalog-only format.

**What to keep:**
- Locked Geist + Geist Mono for body/UI/numerals/mono (FC#2 is additive, not replacement).
- Locked palette (already confirmed editorial-spirit per UPM query #4).
- Existing primitives (Buttons, Forms, Cards, Avatars, Charts as Recharts) — they move into ACT 2, unchanged.
- Stage-frame light/dark side-by-side mechanism — still useful, just embedded inside acts.

**What to add:**
- 5 missing sections (Toasts, Modal, Chat, Navigation, Table) — net-new but mostly already drafted in static + showcase.css.
- Newsreader font (1 file, 3 selectors).
- Marginalia grid (CSS-only refactor of StageFrame).
- Reveal motion + citation footnotes (Direction 6).

**What to defer:**
- Hybrid charts (Direction 1-C) — isolated, can ship in a separate cycle.
- Award-quality polish pass (Direction 7-C end state) — earned by this pivot, not part of it.

---

## §6 — Output file path

`docs/reviews/2026-04-29-r2-product-designer-fundamental.md` (this file).

---

## §7 — Open questions for Right-Hand → PO

1. **Brand lock break authorisation:** is adding Newsreader as a Display-only serif accent acceptable, given Geist + Geist Mono are LOCKED 2026-04-27? Frame: additive, not replacement. body/UI/mono/numerals stay Geist.
2. **Three-act reorder authorisation:** PO sign-off for replacing the «two stages, identical content» layout with a four-act narrative (ACT 1 product surfaces → ACT 2 primitives → ACT 3 states → ACT 4 charts), each act containing both light + dark.
3. **Static reference retirement plan:** keep `design-system.html` for one cycle as fallback, then retire? Or keep indefinitely as a primitive-coverage map?
4. **Charts hybrid scope:** ship FC#1 + FC#2 + FC#3 first (no chart engine change), measure PO reaction. Charts hybrid (Direction 1-C) is a separate cycle. Confirm.
5. **Newsreader vs alternative serif:** Newsreader is the recommended pick (modern editorial, designed for screen, Google-Fonts free). If PO prefers a paid editorial serif, that's an R1 (no spend) blocker. Default = Newsreader.
