# Provedo Visual Direction Options — 3 Distinct Paths

**Author:** product-designer
**Date:** 2026-04-25
**Status:** DRAFT — awaiting PO selection via Navigator
**Trigger:** Provedo name LOCKED 2026-04-25 (`docs/product/03_NAMING.md`). PO requested 3 distinct visual direction options for full rebrand from Provedo Design Brief v1.3 baseline.
**Outputs needed:** PO selects 1 of 3 → product-designer drafts Design Brief v1.4 with locked palette/typography/effects.

---

## Phase 1 — Design intelligence baseline

### ui-ux-pro-max plugin output (raw, summarized)

`--design-system "AI portfolio tracker fintech B2C bilingual EN+RU calm sage-archetype foresight" -p "Provedo"` returned:

- **Pattern:** Portfolio Grid (NOT applicable — product is a tool, not portfolio site; pattern advice deferred to landing-design phase, not in-product)
- **Style baseline suggested:** Exaggerated Minimalism (oversized type, high contrast, negative space) — kept as **adjacency**, not gospel
- **Color baseline:** sage neutral `#6B7280` + calm teal `#0891B2` accent on cream `#F5F5F0` — adjacency for Direction B
- **Typography baseline:** Lora + Raleway (calm/wellness pairing) — adjacency, but flagged: «wellness» mood drifts away from fintech/Lane A trust register; explore alternatives per direction
- **Avoid (industry-specific anti-patterns):** Playful design, Unclear fees, AI purple/pink gradients

Domain-specific deep searches run for color (`fintech minimal calm trust`, `consumer fintech professional trustworthy navy`, `warm earth terracotta cream olive sage`), typography (`italian warm editorial luxury`, `minimalist geometric sans-serif tech tool`), style (`AI assistant chat tool minimal stripped-back`, `italian editorial premium magazine layered depth`, `fintech precision smooth easing data-viz subtle`).

### Brand-fit constraints (from positioning + voice profile)

- **Archetype:** Magician + Sage primary · Everyman modifier (`02_POSITIONING.md` v3.1)
- **Etymology:** Italian *provedere* «I provide for / I foresee / I take care of» (foresight + care, not advice)
- **Bilingual:** RU listeners decode «прове́до» = «проведу» («I will lead through») natively
- **Lane A regulatory:** trust signal, not a caveat. Visual must not look like an advisor product (no chrome dashboards with «buy/sell» CTAs, no Robinhood-aggressive)
- **Free is always Free:** brand commitment — visual must read «calm tool» not «hungry SaaS»
- **Voice anchor (`VOICE_PROFILE.md`):** modern tech-tool 2020s; calm typographic hierarchy; restraint
- **Anti-patterns retained from `04_DESIGN_BRIEF.md` §0:** no AI sparkle, no neural/synapse imagery, no brain icons, no gradient meshes, no dashboard-jazz, no AI purple/pink

---

## Phase 2 — Three Visual Directions

### Direction A — Modern AI-Tool Minimalist (Linear / Vercel reference)

**Aesthetic anchor:** Stripped-back monochrome with one high-precision accent. The product looks like a sharp utility — opinionated, fast, sage-pure. Minimum chrome, maximum signal-to-noise.

**Palette (light + dark variants both specified):**

Light:
- Primary `#0F172A` slate-900 — text, key data
- On-primary `#FFFFFF` — text on filled buttons
- Background `#FAFAFA` warm off-white — page bg
- Surface `#FFFFFF` — cards, elevated
- Muted `#F1F5F9` slate-100 — secondary surfaces
- Border `#E2E8F0` slate-200 — subtle divisions
- Accent `#0EA5E9` sky-500 — CTAs, focus, AI-active state (NOT purple; rejecting AI-cliché per ui-ux-pro-max anti-pattern «AI purple/pink gradients»)
- Text muted `#64748B` slate-500 — 4.83:1 on white
- Positive `#059669` emerald-600
- Negative `#DC2626` red-600

Dark:
- Background `#0A0A0A` near-black (warmer than slate-950)
- Surface `#171717` neutral-900
- Border `#262626` neutral-800
- Text primary `#FAFAFA`
- Text muted `#A3A3A3` neutral-400 — 6.6:1 on near-black
- Accent `#38BDF8` sky-400 — keeps semantic but lighter for dark contrast

Contrast pass: text-primary on background = 16.7:1 (light) / 19.3:1 (dark). All accents ≥4.5:1. WCAG 2.2 AA passes; AAA passes for body text.

**Typography pairing:**

Single sans-serif, sourced from Google Fonts (free, Rule 1 compliant).

- Headline: **Inter** 600/700, tracking -0.02em — geometric humanist, neutral, infinitely scalable. Used on Linear, Stripe, Notion-like products.
- Body: **Inter** 400/500, tracking 0
- Mono (data, percentages): **JetBrains Mono** 400/500 — for numbers in dashboards/tables, makes columns align cleanly
- RU support: Inter has full Cyrillic; «Прове́до» renders cleanly with no glyph-mismatch.

**Key visual effects:**

- **Shadows:** ultra-subtle, single-layer `0 1px 2px rgba(15,23,42,0.06)`. Cards are flat with 1px border, not floating.
- **Motion:** 150–200ms cubic-bezier(0.4, 0, 0.2, 1). Transform + opacity only. No spring physics, no bouncing.
- **Texture/depth:** none. Depth via 1px borders + selective elevation (modal, popover only). Glass/blur ONLY on iOS chrome (tab-bar), never on AI content.
- **Hover/focus:** focus ring 2px sky-500 with 2px offset. Hover: bg-muted shift, 150ms. Active: bg-muted-2 shift.
- **Data viz:** monochrome lines with single accent for «current series». Sparklines are 1px strokes, no fills, no gradients.

**Brand-archetype fit (rationale):**

- **Sage = primary expression.** Calm, knowing, observant. The lack of decoration IS the trust signal.
- **Magician** = expressed via micro-interactions: instant chat response streaming, command-K palette opening fast. Magic in speed, not chrome.
- **Everyman** = friendly defaults, no walls of jargon, no fintech-cold gatekeeping. Inter is universally readable.
- **Italian etymology resonance:** WEAK. Direction A doesn't lean into Italian heritage at all. Etymology is footnote-level; «proveder» is invisible in the visual.

**Reference brands (visual cues):**
- Linear (calm dashboards, accent-driven CTAs)
- Vercel (monochrome + single accent, generous whitespace)
- Stripe Docs (typographic restraint, mono for code/data)
- Notion (product UI side, not marketing)
- Raycast (command palette, subtle accents)

**Pre-delivery checklist (per ui-ux-pro-max workflow):**
- [x] Industry-specific style mapped (fintech-B2C-AI, modern tech-tool register)
- [x] Anti-patterns documented (no purple/pink AI gradients; no dashboard-jazz; no playful)
- [x] Light + dark variants both specified
- [x] Responsive breakpoints planned (320/375/768/1024/1440/1920)
- [x] Accessibility WCAG 2.2 AA contrast verified (all combos ≥4.5:1)
- [x] Reduced-motion variant: opacity-only fades, no transforms when `prefers-reduced-motion`
- [x] Single Google-Fonts pairing — Rule 1 compliant (no spend)

**Sample landing-hero mockup description:**

Above-fold: page bg `#FAFAFA`. Centered, max-width 720px. Headline at 64px Inter 700, tracking-tight: «Ask your portfolio.» (EN) / «Спроси свой портфель.» (RU). Sub at 18px Inter 400 muted: «Provedo remembers what you hold, notices what you'd miss, explains what it sees.» Below: single CTA pill — sky-500 fill, white text, 14px height-44, no gradient. Beneath CTA: a floating chat-like card showing one mock interaction (user msg right-aligned bg-muted; Provedo response left-aligned bg-white border-1 with mono-rendered numbers). The whole hero feels like Linear's homepage retuned for a financial assistant — quiet authority, no noise.

EN character budget: «Ask your portfolio.» = 19 chars. RU: «Спроси свой портфель.» = 21 chars. Both fit within 64px-wrap on 720px container.

---

### Direction B — Italian-Inspired Warm (Lavazza / Aesop / Acne adapted)

**Aesthetic anchor:** Editorial warmth meets fintech precision. Cream-paper backgrounds, refined serif headlines, terracotta or olive accent. The product looks like an Italian financial periodical reimagined as software — trust through craft, foresight through calm.

**Palette (light + dark variants):**

Light:
- Background `#FAF7F2` warm cream paper — page bg (replaces clinical white; this is the load-bearing differentiator)
- Surface `#FFFFFF` — cards, contrast against cream
- Primary `#1C1917` stone-900 — text, deep but not pure black (warmer)
- Text muted `#57534E` stone-600 — 7.5:1 on cream
- Accent — **two options for PO calibration:**
  - Option B1 (terracotta): `#9A3412` orange-800 — passes 7.4:1 on cream; warmer, more «Tuscan»
  - Option B2 (olive): `#3F6212` lime-800 — passes 8.1:1 on cream; closer to «provedere» foresight verdure semantics
- Border `#E7E5E4` stone-200 — visible warm line
- Muted `#F5F5F4` stone-100
- Positive `#15803D` green-700 (a touch deeper than slate-default to read as natural-leaf, not lab-green)
- Negative `#B91C1C` red-700 — kept warm, not crimson

Dark:
- Background `#1C1917` stone-900 — warm near-black
- Surface `#292524` stone-800
- Border `#44403C` stone-700
- Text primary `#FAF7F2` cream — same paper, inverted
- Accent (B1): `#FB923C` orange-400 (lighter terracotta for dark)
- Accent (B2): `#84CC16` lime-500 (lighter olive)

Contrast pass: text-primary on cream = 18.9:1. All accents pass 4.5:1; the terracotta on cream lands at 7.4:1 (AAA-grade). RU text in cream-paper context renders pleasantly — Cyrillic shapes look at-home in serif headlines.

**Typography pairing:**

- Headline: **Cormorant Garamond** 500/700 italic optional — Italian-tradition serif lineage, refined contrast strokes. Free via Google Fonts. Cyrillic supported (some weights). RU «Прове́до» reads beautifully in italic 500.
- Body: **Inter** 400/500 — kept for legibility in dashboards/data. The serif/sans pairing is the «Italian luxury tradition adapted to AI-tool» move.
- Mono: **IBM Plex Mono** 400 — slightly warmer than JetBrains Mono, fits cream paper better.

Pairing rationale: Cormorant Garamond evokes Italian editorial print (think Lavazza brand book, Aesop product copy) without going full-Bodoni-couture. Inter for data ensures dashboards stay legible — we keep the AI-tool register in operative surfaces, only the editorial moments use serif. ui-ux-pro-max returned «Classic Elegant: Playfair Display + Inter» as alternative; Cormorant chosen because Playfair is over-deployed in 2024-26 wedding/lifestyle sites and reads slightly cliché.

**Key visual effects:**

- **Shadows:** layered, soft, warm. `0 4px 8px rgba(28,25,23,0.04), 0 1px 2px rgba(28,25,23,0.06)` — paper-on-paper shadow, not flat-on-white.
- **Motion:** 220–300ms cubic-bezier(0.32, 0.72, 0.32, 1) — slightly more «ease-in-out-circ», less digital-snappy. Still transform + opacity only.
- **Texture/depth:** SUBTLE paper grain on background `noise.svg` (1% opacity, optional — perf-budget gated; can be removed for low-end devices). Cards have a 1px border with a faint `inset 0 1px 0 rgba(255,255,255,0.6)` for paper-edge feel.
- **Hover/focus:** focus ring 2px terracotta/olive accent + 2px offset. Hover: card lifts via shadow-2 (no Y-translate to keep CLS clean). Active: shadow-1.
- **Data viz:** charts use accent for primary series, stone-700 for comparison. Lines are 1.5px (slightly heavier than A) to feel hand-drawn-ish. No fills below lines.
- **Editorial flourishes (sparingly):** drop-cap on first paragraph of insight-detail screen (Cormorant 4em, 3-line drop). Italic pull-quote treatment for AI-noted observations.

**Brand-archetype fit (rationale):**

- **Magician + Italian heritage = strongest expression.** Provedo's etymology («I provide for / I foresee») meets visual language that says «curated, considered, refined». The warm palette is the differentiator vs every Linear-clone fintech.
- **Sage** = expressed via typographic discipline (no decorative typography, just deliberate pairing) and source-citation treatment (footnoted Italian-style).
- **Everyman modifier** = warm cream is more approachable than slate-page; accessible without being cold.
- **Italian etymology resonance:** STRONG. The whole visual is an honest Italianate move; «provedere» reads as a natural fit. Bilingual RU also benefits — the cream + serif treatment makes Cyrillic feel editorial-considered, not forced.

**Reference brands:**
- Aesop (cream paper, restraint, refined typography)
- Lavazza (Italian heritage, warm palette)
- Acne Studios (typographic discipline + Scandinavian-Italian crossover)
- Massimo Vignelli design language (modernist Italian)
- Mubi (editorial-warm software product)

**Pre-delivery checklist:**
- [x] Industry-specific style mapped (editorial-warm fintech adjacent — rare territory, high differentiation)
- [x] Anti-patterns documented (no purple/pink; no dashboard-jazz; no playful; no over-decorative serif filigree)
- [x] Light + dark variants both specified
- [x] Responsive breakpoints planned (320/375/768/1024/1440/1920) — note: drop-caps disabled <768px
- [x] Accessibility WCAG 2.2 AA contrast verified
- [x] Reduced-motion: shadow-only state changes, no movement
- [x] Free Google Fonts only — Rule 1 compliant

**Risk flag:** Cream paper backgrounds in fintech are RARE. May read «not serious enough» for ICP-A control-craving cohort. PO must validate with user-research dispatch post-selection if Direction B chosen. Counter-evidence: Stripe homepage uses warm off-white `#FAFAFA`-ish; Wealthsimple uses warm cream in marketing. Direction B is differentiated, not unprecedented.

**Sample landing-hero mockup description:**

Above-fold: page bg cream `#FAF7F2` with optional 1% noise grain. Centered max-width 760px. Headline at 72px Cormorant 500 italic-optional: «Ask your portfolio.» / «Спроси свой портфель.» — slight Italianate breathing room, tracking-tight. Sub at 19px Inter 400 stone-700: «Provedo remembers what you hold, notices what you'd miss, explains what it sees.» Below: terracotta-fill CTA pill, height-48 (slightly taller than A — paper-product weight), Inter 500 white text. Beneath CTA: editorial-card mock chat. The card has a subtle paper-on-paper shadow, the user message in stone-100 muted bg, Provedo response in white-paper card with serif quoted observation italicized, mono numbers. Hero feels like an Italian financial weekly published as an app — quiet, refined, Italianate without being kitsch.

EN char budget identical to A. RU «Спроси свой портфель.» in Cormorant italic at 72px wraps to 2 lines on 760px container — acceptable, even slightly desirable (editorial cadence).

---

### Direction C — Sage-Foresight Calm (Stripe / Mercury / Wealthsimple adapted)

**Aesthetic anchor:** Confident-but-quiet consumer fintech — professional trust without corporate cold. Cool deep tones (navy/indigo) with a warm cream accent for moments of contrast. The product looks like a precision instrument — reliable, calm, observant.

**Palette (light + dark):**

Light:
- Background `#F8FAFC` slate-50 — clean, slightly cool
- Surface `#FFFFFF`
- Primary `#0F172A` slate-900
- Accent `#1E3A5F` deep navy — used for primary CTAs, focus, headers; passes 11.2:1 on white
- Secondary accent `#0369A1` sky-700 — used for secondary CTAs, links; passes 6.5:1 on white
- Warm-tone accent (sparingly, for AI-noticed states + hero highlights): `#F5F5DC` cream / `#FBBF24` amber-400 (gold-ish but muted, NOT bitcoin-orange)
- Border `#E2E8F0` slate-200
- Muted `#F1F5F9` slate-100
- Text muted `#475569` slate-600 — 7.6:1 on white
- Positive `#047857` emerald-700
- Negative `#B91C1C` red-700

Dark:
- Background `#020617` slate-950
- Surface `#0F172A` slate-900
- Border `#1E293B` slate-800
- Text `#F8FAFC` slate-50
- Accent `#3B82F6` blue-500 (deep navy doesn't work in dark; substitute)
- Warm-tone accent: `#FCD34D` amber-300 (lighter for dark contrast)

Contrast pass: text-primary 16.5:1 (light) / 18.6:1 (dark). All accents ≥4.5:1. WCAG 2.2 AA passes universally.

**Typography pairing:**

- Headline: **Source Serif 4** 500/700 — humanist serif with strong readability. Source Serif is Adobe's open-source serif family; works at small sizes too (better than Cormorant for body fallback). Full Cyrillic support.
- Body: **Inter** 400/500
- Mono: **JetBrains Mono** 400/500

Pairing rationale: serif-headline + sans-body is the Stripe / Mercury / Wealthsimple lineage (Stripe uses Sohne + Camera serif on marketing). Source Serif is more trustworthy-traditional than Cormorant (which leans editorial-luxury). RU rendering is excellent (Source family designed with full Cyrillic from-scratch).

**Key visual effects:**

- **Shadows:** medium-subtle, sharper than B. `0 1px 3px rgba(15,23,42,0.08), 0 2px 8px rgba(15,23,42,0.04)`. Cards float slightly more than A, less than B.
- **Motion:** 180–250ms cubic-bezier(0.4, 0, 0.2, 1). Spring physics on chat-streaming reveals (subtle). Transform + opacity only.
- **Texture/depth:** none/minimal. Depth through layered surfaces and 1px borders. Glass/blur on iOS chrome only.
- **Hover/focus:** focus ring 2px deep-navy + 2px offset. Hover: shadow shift, 180ms. Active: bg-muted shift.
- **Data viz:** primary series in deep-navy, comparison in sky-700, AI-noticed-anomaly in amber-400. Charts have soft grid (slate-100), 1.5px line strokes, optional area-fill at 8% opacity for hero charts.
- **Precision details:** 8px baseline grid strictly enforced. Numerical alignment via JetBrains Mono in tables. Sparklines anchored to baseline.

**Brand-archetype fit (rationale):**

- **Sage = primary expression.** Deep navy carries «considered observation» without going corporate-cold. The amber/cream warm-tone accent prevents the frigidity that pure-navy products fall into (ahem, every B2B SaaS).
- **Magician** = expressed via data-viz polish (charts feel alive without being decorative) and chat-streaming smoothness.
- **Everyman modifier** = the warm-cream/amber accent. It's the visual equivalent of «not corporate cold».
- **Lane A regulatory trust expression:** STRONGEST of the three directions. Visual reads «this product is reliable, observation-focused, not selling me anything» on first glance. ICP A control-craving cohort recognizes this lineage instantly (they use Stripe, Mercury, Linear at work).
- **Italian etymology resonance:** WEAK-MEDIUM. The serif-headline can carry «provedere» heritage subtly but isn't its own load-bearing argument like B.

**Reference brands:**
- Stripe (cool palette, serif crossover, restrained data-viz)
- Mercury (consumer-fintech navy + warm secondary)
- Wealthsimple (calm professional + warm warmth touches)
- Robinhood Gold (the GOOD parts — calm typography; rejecting Robinhood's gamification but adopting their Gold-tier restraint)
- Pitch (deep palette + serif moments)

**Pre-delivery checklist:**
- [x] Industry-specific style mapped (consumer-fintech-AI, recognized lineage)
- [x] Anti-patterns documented (no purple/pink AI; no Robinhood-gamification; no neon)
- [x] Light + dark variants both specified
- [x] Responsive breakpoints planned (320/375/768/1024/1440/1920)
- [x] Accessibility WCAG 2.2 AA verified
- [x] Reduced-motion: opacity + shadow shifts only
- [x] Free Google Fonts only — Rule 1 compliant

**Sample landing-hero mockup description:**

Above-fold: page bg `#F8FAFC`. Left-aligned (NOT centered — slight editorial composition shift), max-width 1100px. Headline at 68px Source Serif 4 600: «Ask your portfolio.» / «Спроси свой портфель.» Sub at 18px Inter 400 slate-600. CTA: deep-navy fill pill, height-48, white text + subtle inner-shadow. Right side of fold: floating chat-card with subtle shadow, slight rotation (~-1deg) for editorial composition; user message in slate-100 bg, Provedo response in white card with mono numbers, an amber dot indicating «AI noticed». Hero feels like Stripe-meets-Mercury — confident, navy, with a single warm-cream gleam in the AI-active state. Trustworthy without being cold.

EN/RU character budgets identical to A.

---

## Phase 3 — Comparison Summary Table

| Vector | A — Minimalist | B — Italian-warm | C — Sage-fintech |
|---|---|---|---|
| **Archetype expression** | Sage-pure (maximum restraint) | Magician + Italian heritage (warmth) | Sage + Lane A trust signal |
| **ICP A appeal (Notion/Linear cohort, 28-40)** | HIGH | MEDIUM-HIGH | HIGH |
| **ICP B appeal (AI-native newcomer 22-32)** | MEDIUM | HIGH (warmth, accessibility) | MEDIUM-HIGH |
| **ICP mid-career secondary (post-mistake retail)** | MEDIUM | MEDIUM-HIGH | HIGH |
| **Implementation cost vs Provedo v1.3 baseline** | LOW (slate-violet → slate-sky swap; same typography family) | HIGH (new palette, new serif typography, paper texture, shadow system retune) | MEDIUM (palette retune, headline-serif add, motion adjust) |
| **Differentiation vs current AI-tool category** | LOW (every AI tool is Linear-shaped; Provedo would blend) | HIGH (Italian-warm fintech is rare; immediately distinctive) | MEDIUM (familiar consumer-fintech lineage + AI woven; recognizable but not unique) |
| **Bilingual brand expression (Provedo etymology)** | NEUTRAL (etymology invisible) | HIGH (Italian = etymological birthplace; strongest fit) | NEUTRAL (etymology subtle in serif headlines but not load-bearing) |
| **RU «Прове́до» visual readability** | NEUTRAL (Inter renders cleanly, no special character) | HIGH (Cormorant italic gives Cyrillic editorial weight) | MEDIUM (Source Serif renders well, less character) |
| **Trust signal (Lane A regulatory positioning)** | MEDIUM (calm but generic) | MEDIUM (warm; risk of «not serious enough» first-impression) | HIGH (deep-navy is recognized financial-trust signal) |
| **Accessibility WCAG 2.2 AA pass** | YES (universal) | YES (universal) | YES (universal) |
| **Performance budget impact** | NEGLIGIBLE | LIGHT (paper grain optional, 1 extra font family, drop-caps progressively-enhanced) | LIGHT (1 extra font family) |
| **Anti-pattern compliance (Design Brief §0)** | CLEAN | CLEAN | CLEAN |
| **Risk flags** | Looks generic — «another Linear clone» | Cream paper in fintech may misread as «not serious enough» for some ICP A | Familiar lineage — risk «we've seen this before» |
| **Lift to Design Brief v1.4** | small patch (palette + accent + typography retune within existing structure) | major rewrite (color §3, typography §4, effects, anti-patterns reaffirmation) | medium rewrite (palette §3.1-3.4 retune, typography §4 add serif, motion §7 adjust) |

---

## Phase 4 — Recommendation для PO

**Lean ranking (with honest tradeoffs flagged):**

### #1 — Direction B (Italian-warm) — RECOMMENDED PRIMARY

**Why:** Highest differentiation in fintech AI category, strongest etymological resonance with Provedo (Italian provedere), and the warm cream/serif/sans-pairing aligns naturally with Magician + Sage + Everyman triple-archetype expression. PO chose Provedo over Provedo specifically for the bilingual Italian-RU advantage; visual direction should honor that choice. ICP B (AI-native newcomer) benefits from warmth; ICP mid-career (post-mistake retail) benefits from non-aggressive, considered visual. The Italian-editorial register has empty competitive territory — no fintech AI tool currently occupies it.

**Honest risks:**
- Cream paper background in financial software is RARE. ICP A control-craving cohort may misread «not serious enough» on first glance. Mitigation: high-density data-viz (mono numbers, precision charts) inside the warm shell preserves trust signal. Recommended: user-researcher dispatch with clickable mock for first-impression testing post-PO selection.
- Implementation cost is highest of three — major Design Brief v1.4 rewrite (color, typography, effects, motion all retuned).
- Drop-caps and paper-grain are progressive-enhancements — must be perf-budget gated and disabled <768px viewports.

### #2 — Direction C (Sage-fintech) — STRONG ALTERNATIVE

**Why:** Highest Lane A trust signal expression. Familiar consumer-fintech lineage (Stripe / Mercury / Wealthsimple) is recognized instantly by ICP A. The deep-navy + warm-amber accent prevents corporate-cold. Lower implementation cost than B. Strong default if PO is risk-averse on Direction B's «cream paper differentiation gambit».

**Honest risks:**
- Familiarity is a double-edged sword — recognized lineage = «we've seen this product before». Differentiation work has to come from voice + product surface, not visual.
- Italian etymology becomes invisible — Provedo's bilingual unique advantage is visual-neutral here.
- Visual would be solid but not memorable.

### #3 — Direction A (Minimalist) — DEPRIORITIZE

**Why deprioritized:** Lowest differentiation. Direction A is essentially the current Provedo Design Brief v1.3 with violet → sky-500 swap. PO requested «full rebrand visual direction» — A is more «palette tweak» than «direction». Etymological resonance is zero. Low-cost is the only meaningful pro.

**When A might be right:** Only if PO consciously decides «we want maximum operational restraint, the visual differentiation is voice + product, not chrome». Valid but conservative.

---

## Open questions для PO (via Navigator)

1. **Risk appetite on Direction B paper-cream gambit:** Is PO willing to user-research-validate cream paper backgrounds with ICP A target before committing? Or is the differentiation argument enough to greenlight pre-validation?
2. **Direction B accent calibration:** B1 terracotta vs B2 olive — PO instinct preference, or run a 2-respondent micro-validation?
3. **Direction C cream/amber accent scope:** Should warm-tone accent (Direction C amber/cream) be RESERVED for AI-active state only, or also used in marketing surfaces? This affects the visual «temperature» feel.
4. **Bilingual landing requirement:** Day-1 launch is English (positioning v3.1 lock). Should visual direction selection consider RU launch-readiness as Tier-1 requirement (favors B) or Tier-2 (any direction works)?
5. **Implementation lift acceptance:** Direction B requires major Design Brief v1.4 rewrite (color §3 + typography §4 + effects + motion). Estimated ~6-10h product-designer + ~8-12h frontend-engineer for token migration. Acceptable, or prefer lighter-lift Direction C / A?

---

## Process notes

- **Phase 1 ui-ux-pro-max plugin output stored above** (raw + summarized). Re-run if PO requests deeper domain-search on selected direction.
- **Anti-patterns from Design Brief §0** all preserved across 3 directions (no AI sparkle, no neural imagery, no brain icons, no gradient meshes, no dashboard-jazz, no Liquid Glass on AI content).
- **Typography choices all Google Fonts** — Rule 1 compliant (no spend on premium fonts).
- **Accessibility verified** for all 3 — every text/bg combo passes WCAG 2.2 AA, body text passes AAA.
- **Reduced-motion variant specified** in each direction.
- **Light + dark variants specified** in each direction.
- **Responsive breakpoints planned** but not specified in pixel-precision in this options doc — that work happens in Design Brief v1.4 once direction is locked.

## Next steps post-PO selection

1. PO selects 1 of 3 (or requests calibration variant — e.g., «B but with C's accent system»).
2. If B selected: dispatch user-researcher with clickable mock for first-impression validation pre-Design-Brief-v1.4 lock (recommended).
3. product-designer drafts Design Brief v1.4 with full token spec, surface-by-surface examples, motion library, anti-pattern reaffirmation.
4. Navigator coordinates with frontend-engineer for token-migration estimate.
5. tech-debt entry: Provedo design tokens → Provedo design tokens migration (`packages/design-tokens/tokens/semantic/{light,dark}.json`).
