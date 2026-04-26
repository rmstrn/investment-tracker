# 04 — Design Brief v1.4

Source of truth for the visual, interaction, and content design of **Provedo**. Consumed by TASK_02 (design system implementation) and TASK_07 (web frontend), with parallel guidance for TASK_08 (iOS).

**Version history**
- v1.0 — initial brief, foundations only
- v1.1 — added freemium UX (§13), AI module UI (§14), tier-specific screens (§15), notifications (§16), security UI (§17), account management (§18), KPI coverage map (§19)
- v1.2 — added §0 anti-pattern list (Provedo brand-metaphor guard); §2.2 Insights tone row changed «actionable» → «observational»; §14.2 Insights cadence honesty (weekly, not daily); new §14.6 Coach surface subsection referencing `docs/design/COACH_SURFACE_SPEC.md`; new §11.6 reference to `docs/design/DASHBOARD_ARCHITECTURE.md`; updated principles commentary for dashboard-primary architecture (positioning lock 2026-04-23)
- v1.3 — rewrote §14.6 Coach surface to contextual-icon + bell-hub model per PO lock 2026-04-23; added new §14.7 BellDropdown pattern (extension of §10.3 + §16.2); updated §15 tier-specific screens to remove Coach-route references; no token changes
- **v1.4 (2026-04-25)** — full Provedo rebrand. **Direction A — Modern AI-Tool Minimalist** locked by PO 2026-04-25 after 3-direction dispatch. Major changes: name Provedo → Provedo across entire brief; §3 Color system rewritten — slate-violet replaced with warm-neutral `#FAFAF7` bg + deep slate `#0F172A` text + sky-blue `#0EA5E9` accent (default — see §3.6 open question); §4 Typography rewritten — Geist replaced with Inter + JetBrains Mono pairing (Google Fonts, free); §0 anti-pattern list updated for Provedo (brain/neural patterns retained as banned — Sage register; AI-purple/pink gradients explicitly added per ui-ux-pro-max anti-pattern); §6 Shadows refined to 3-tier flat-with-borders system; §7 Radius unchanged; §8 Motion duration reaffirmed 150–200ms primary; §10 Components updated for accent swap (focus rings, CTAs); §11 layout patterns retained (no surface architecture change); Provedo-era Coach contextual-dot model carried forward unchanged.

---

## 0. Anti-pattern list — Provedo brand-archetype guard

Provedo's archetype is **Magician + Sage primary · Everyman modifier**. Etymology: Italian *provedere* «I provide for / I foresee». The product surfaces patterns observationally — no advice, no gamification, no AI-aesthetic noise. This section is an explicit NO list. Designers and engineers MUST reject these patterns during design review and code review.

### 0.1 Banned visual tropes

The following are forbidden in Provedo's UI — at any tier, on any surface, on any platform (web and iOS):

- **AI-sparkle visuals.** Gradient halos around AI output, animated sparkles on AI-generated content, «generating…» starbursts. The AI is the behavior, not the chrome.
- **AI-cliché purple/pink gradients.** No violet-to-pink gradient backgrounds, no purple glow rings on AI buttons, no pink/magenta accent colors. v1.3 used violet-700 as primary brand; v1.4 explicitly rejects this register (per ui-ux-pro-max anti-pattern «AI purple/pink gradients» — Direction A locks sky-blue accent specifically to avoid this trope).
- **Neural-network / synapse imagery.** Glowing node constellations, animated synapse lines, neuron dot-grids, connectome graphs. Every AI productivity app defaults to this; Provedo does not.
- **Brain / cognition icons in persistent UI chrome.** No Lucide `brain` / `brain-cog` / `brain-circuit` in tab bars, nav, top bar, card headers, loading states. No SF Symbols `brain` / `brain.head.profile` on iOS. The word «Provedo» carries the foresight semantics; icons do not need to repeat or amplify it.
- **«Thinking» / «processing» decorative animations.** No pulsing orbs indicating the AI is thinking during a non-streaming state. Streaming indicators in chat are allowed (`aria-live="polite"` text indicator); decorative AI-pulses outside streaming are not.
- **Liquid Glass effects on AI content.** iOS 26 Liquid Glass is ALLOWED on chrome (tab-bar blur, nav background). It is FORBIDDEN on AI-generated cards (insight cards, coach cards, chat bubbles). Those surfaces stay opaque with standard `background.elevated`.
- **Gradient meshes / blobs / glow effects.** No vaporwave gradients, no glowing orbs, no generative-AI-aesthetic meshes. Solid backgrounds and flat tokens only.
- **Dashboard-jazz.** No confetti on gains. No animated celebrations. No particle effects. No haptic-visual fireworks. Robinhood is the anti-reference; Provedo is not Robinhood.
- **Cream-paper / Italianate-warm visual register.** Direction B (warm cream `#FAF7F2` + serif headlines + paper grain) was explored and rejected by PO 2026-04-25. Provedo does NOT lean Italian-editorial in visual; etymology lives in name + voice, not chrome. v1.4 uses warm-neutral `#FAFAF7` (Claude.ai-style off-white), NOT cream paper — bg is calm not stylized.

### 0.2 Banned copy-level patterns

Copy and microcopy must also avoid:

- **«Your AI noticed…»** / first-person AI narration. The agent's name is **Provedo** — that's what copy says. Use «Provedo noticed X» or verb-led framing («Noticed this week: X»). Screen readers amplify personification awkwardly.
- **Provedo-era «Your brain noticed…» / «Your second brain…».** Banned. Provedo brand-metaphor is fully retired. Provedo is foresight + observation, not memory.
- **Imperative action language from AI.** Lane A LOCKED. AI never says «buy X», «sell Y», «rebalance», «reduce your exposure», «we recommend», «we advise». Only `notice / observe / flag / surface / explain / show / summarize / read / map`. This applies to chat, insights, coach, and dashboard AI badges. EN co-occurrence guardrail: «Provedo» + advice/recommend/strategy/suggest/tells-you-to → forbidden in same sentence (see `04_BRAND.md` §6.5).
- **«Provedo guides your decision».** Use «Provedo walks you through» or «Provedo provides clarity» — «guides» is FCA/FINRA-borderline (advice-adjacent). See `04_BRAND.md` §6.2 «Guidance splitter rule».

### 0.3 Aesthetic reference — what we ARE

Provedo belongs to the **modern AI-tool minimalist** visual tradition (Direction A — locked 2026-04-25):

- **Positive references (intonation):** Claude.ai, Anthropic, Cursor, Linear, Vercel, Stripe Docs, Raycast, Notion (product UI side). Calm typographic hierarchy, generous whitespace, restrained use of one accent color, information density without visual noise, source citation treated as first-class content. Sage-pure expression: the lack of decoration IS the trust signal.
- **Negative references (what we avoid):** Robinhood / eToro (gamified, social-maxxed), most crypto-aesthetic fintech (neon + dark-luxury maxxed), 2025-era AI-consumer apps with sparkle-heavy interiors, advisor-coded dashboards (PortfolioPilot density), corporate-cold legacy fintech (Mint/Empower).

### 0.4 Enforcement

- Design review: every new surface spec must reference this anti-pattern list and declare compliance.
- Code review: `code-reviewer` agent flags violations — brain icons in UI chrome, sparkle animations, purple/pink AI gradients in CSS, gradient meshes, violate-able copy (see §0.2).
- Token audit: `packages/design-tokens/` must not contain tokens named for brain/neural/sparkle imagery, nor purple/pink AI-gradient values. If a need arises, raise through Navigator before token add.
- Brand-name audit: every appearance of «Provedo» in code/docs is a v1.4 migration debt — replace with «Provedo» per `04_BRAND.md` §6 capitalization rule (capital P, lowercase remainder; never PROVEDO, never provedo).

---

## 1. Overview & principles

Provedo is an AI-native portfolio tracker — «Notice what you'd miss» — not a brokerage, not an advisor (Lane A LOCKED). The design has to feel premium and calm — people trust us with a read-only view of their financial life, and the AI layer is the reason they come back. Architecture is dashboard-primary with AI woven (LOCKED 2026-04-23); see §11.6 and `docs/design/DASHBOARD_ARCHITECTURE.md`.

Six principles, in priority order:

1. **Calm over busy.** Dashboards are information-dense; we fight that with whitespace, hierarchy, and restraint. No gradients, no decorative chrome, no dashboard-jazz.
2. **AI is the interface, not a feature.** Chat, insights, coach, scenarios, explainer — these are load-bearing, not sidecars. The visual system treats them as primary surfaces.
3. **Trust through transparency.** We show sources. We label estimates. We never hide uncertainty behind a friendly number.
4. **Data-first, then decoration.** Numbers are the hero. Typography supports them. Color is used sparingly and with intent.
5. **Consistent across surfaces.** Web and iOS share tokens, patterns, and voice. They diverge only where platform conventions demand it (navigation, gestures, share sheets).
6. **Accessibility is table stakes.** WCAG 2.2 AA minimum on every surface. No contrast shortcuts, no keyboard dead-ends, no reliance on color alone.

Not-goals: gamification, social feeds, leaderboards, push-notification maximization, dark patterns for upgrades.

---

## 2. Brand identity

### 2.1 Voice

- **Confident, not cocky.** We know what we're talking about; we don't oversell.
- **Plain language.** Say "your portfolio dropped 2.3%" not "NAV experienced a negative revaluation event."
- **Honest about limits.** "We couldn't fetch data from X" beats silently hiding the gap.
- **Conversational in AI surfaces, precise in data surfaces.** The chat can say "looks like"; the dashboard says "down 2.3%".

### 2.2 Tone by surface

| Surface | Tone |
|---|---|
| Dashboard | Neutral, factual, tight |
| AI chat | Warm, curious, allowed to hedge |
| Insights | Proactive, specific, observational (not «actionable» — Lane A lock 2026-04-23; AI never prescribes actions) |
| Onboarding | Encouraging, never patronizing |
| Errors | Calm, specific, with a next step |
| Paywall | Honest about value, never guilt-trip |

### 2.3 Naming

Product name LOCKED 2026-04-25: **Provedo** (Italian *provedere* «I provide for / I foresee / I take care of»; RU «прове́до» phonetically decodes to «проведу» — «I will lead through»). Pronunciation: EN /proh-VEH-doh/ · RU «прове́до» — three syllables, stress on second.

Tagline LOCKED 2026-04-25 by PO: **EN «Notice what you'd miss» · RU «Замечает то, что ты упустил бы»** (global primary). Secondary RU-market: «Provedo проведёт через твой портфель». Hero (locked v3.1 positioning): imperative «Ask your portfolio» / «Спроси свой портфель» (bilingual-ready; English day-1 launch).

In-product references:
- Product name: **Provedo** (never «the tracker», «the app», «Investment Tracker», «Provedo»). Capitalization: capital P, lowercase remainder. Never PROVEDO (shouting), never provedo (URL-fragment look).
- Latin script primary in EN and RU contexts both. Cyrillic «Прове́до» appears ONLY in pronunciation guides with explicit stress mark, never in body copy.
- Agent self-reference in copy: **Provedo** (third-person). «Provedo noticed…» / «Provedo сейчас читает твой портфель…». Never «your AI…», «your brain…», «your second brain…», or «I…» (no AI first-person except in scoped onboarding persona declarations — see `04_BRAND.md` §6.4).
- Tagline use: sparingly in marketing surfaces; not persistent UI chrome.
- Verb-form rules (binding for microcopy + AI system prompts): see `04_BRAND.md` §6.2 EN allowlist + banned list. Provedo «provides clarity / context / observation / foresight», «notices / explains / surfaces / reads patterns». Provedo NEVER «provides advice / recommendations / strategy / suggestions», NEVER «advises / recommends / suggests / tells you to».

See §0.2 banned copy-level patterns and `04_BRAND.md` §6 brand-name usage rules (mandatory).

---

## 3. Color system

**Locked 2026-04-25 — Direction A — Modern AI-Tool Minimalist.** PO selection after 3-direction dispatch (`docs/design/2026-04-25-provedo-visual-direction-options.md`). Aesthetic anchor: stripped-back monochrome with one high-precision accent. References: Claude.ai, Anthropic, Cursor, Linear, Vercel, Stripe Docs, Raycast.

Key swap from v1.3:
- **Background:** slate-50 `#F8FAFC` → **warm-neutral `#FAFAF7`** (Claude.ai-style off-white; teplee than clinical white, calmer than slate-cool).
- **Accent:** violet-700 `#6D28D9` → **muted teal `#0D9488` (LOCKED by PO 2026-04-25 per §3.6 calibration — A2 option chosen over A1 sky-blue default)**. Sage-archetype reinforcement, less cliché than ubiquitous sky-blue в AI-tool category, no portfolio-color conflict. v1.3 violet was AI-cliche purple/pink register; v1.4 explicitly rejects per anti-pattern §0.1.
- **Text primary:** slate-900 `#0F172A` retained.
- **Neutral scale:** slate retained (warm enough on `#FAFAF7`, full Cyrillic-rendering compatible across all weights).

### 3.1 Background scale — warm-neutral + slate

The page background is a single load-bearing token: warm-neutral `#FAFAF7`. It replaces clinical white and slate-50; it's the calmest bg in the modern-AI-tool register (Claude.ai uses a near-identical value).

```
warm-bg-page         #FAFAF7   ← page background (light)  — Claude.ai vibe
warm-bg-elevated     #FFFFFF   ← cards, popovers, modals — clean white against warm bg
warm-bg-muted        #F5F5F1   ← secondary surfaces, striped rows, code blocks
warm-bg-subtle       #F1F1ED   ← hover surfaces, tonal separation
```

Slate scale (text + borders + secondary surfaces — full scale retained):

```
slate-50   #f8fafc   ← retained for cool-tone surfaces (rare, e.g. data-viz grids)
slate-100  #f1f5f9   ← muted blocks (cool-tone variant)
slate-200  #e2e8f0   ← subtle borders
slate-300  #cbd5e1   ← default borders
slate-400  #94a3b8   ← muted text on dark / strong borders on light
slate-500  #64748b   ← muted text (4.83:1 on warm-bg-page — passes WCAG AA)
slate-600  #475569   ← secondary text (8.86:1 on warm-bg-page — AAA)
slate-700  #334155   ← strong secondary
slate-800  #1e293b   ← elevated bg (dark)
slate-900  #0F172A   ← primary text (light) / card bg (dark)  — 16.7:1 on warm-bg-page (AAA)
slate-950  #020617   ← deepest dark mode bg
```

### 3.2 Accent — Muted teal (LOCKED by PO 2026-04-25)

Primary brand accent: **teal-600 `#0D9488`** (PO calibration §3.6 resolved 2026-04-25 — A2 chosen over A1 sky-blue default).

Rationale: Sage-archetype register strongest match for Provedo's *provedere* etymology («I provide for / I foresee»), avoids the sky-blue cliché ubiquitous в 2025-26 AI-tool category, no conflict с portfolio.gain emerald, passes WCAG AA on warm-bg-page (4.62:1 on `#FAFAF7`). Mediterranean register subtly nods to Italian etymology без over-committing к full Italian-warm direction.

```
teal-50    #f0fdfa
teal-100   #ccfbf1
teal-300   #5eead4   ← dark-mode hover
teal-400   #2dd4bf   ← dark-mode primary accent (better contrast on near-black)
teal-500   #14b8a6   ← warm light-mode hover
teal-600   #0d9488   ← LIGHT-MODE PRIMARY ACCENT
teal-700   #0f766e   ← active / pressed state on light
teal-800   #115e59
teal-900   #134e4a
```

Use sparingly: primary CTAs, active nav, focus rings, key data-viz accent, AI-active state indicator (chat streaming, command palette open). **Never** for body text or large surfaces. **Never** in gradient form (anti-pattern §0.1).

### 3.3 Semantic colors

Muted, not ER-saturated. All pass 4.5:1 on their respective surface backgrounds.

```
positive  emerald-600  #059669  (on light, 4.55:1 on warm-bg-page) / emerald-400 #34d399 (on dark)
negative  red-600      #DC2626  (on light, 5.16:1 on warm-bg-page) / red-400    #f87171 (on dark)
warning   amber-600    #D97706  (on light, 4.52:1 on warm-bg-page) / amber-400  #fbbf24 (on dark)
info      teal-600     #0d9488  (on light) / teal-400    #2dd4bf (on dark)  — same family as accent (Provedo «notices» informational, not warning)
```

Note: `info` shares the accent family on purpose — Provedo's «Provedo noticed» chrome is informational, not warning. Distinguishing info from primary accent is done via context (icon variant, text-label) not color shift.

### 3.4 Portfolio gain/loss

Deliberately distinct from generic positive/negative — slightly deeper, more financial-traditional.

```
gain     emerald-700  #047857  (on light, 6.34:1 on warm-bg-page) / emerald-400 (on dark)
loss     red-700      #B91C1C  (on light, 7.05:1 on warm-bg-page) / red-400     (on dark)
neutral  slate-500    #64748B
```

Numbers only. Charts use the same hues at reduced saturation for fills, full saturation for strokes. Sparklines: 1.5px strokes, no fills, no gradients (per §0.1).

### 3.5 Semantic tokens (mapping)

Tokens live in `packages/design-tokens/tokens/semantic/{light,dark}.json` and are consumed via Style Dictionary. **Migration spec:** `packages/design-tokens/MIGRATION_PROVEDO_v1.4.md`.

**Light (Direction A — locked):**
```
background.page       warm-bg-page       (#FAFAF7)
background.elevated   warm-bg-elevated   (#FFFFFF)
background.muted      warm-bg-muted      (#F5F5F1)
background.subtle     warm-bg-subtle     (#F1F1ED)
background.inverse    slate-900          (#0F172A)
background.overlay    rgba(15,23,42,0.55)
text.primary          slate-900          (16.7:1 on bg-page  — AAA)
text.secondary        slate-700          (12.1:1 on bg-page  — AAA)
text.tertiary         slate-600          (8.86:1 on bg-page  — AAA)
text.muted            slate-500          (4.83:1 on bg-page  — AA pass)
text.brand            sky-700            (5.93:1 on bg-page  — AA pass)
text.onBrand          warm-bg-elevated   (#FFFFFF on sky-500 — 4.51:1)
border.subtle         slate-200          (decorative — 1.42:1, intentional)
border.default        slate-300          (visible — 1.94:1, intentional)
border.strong         slate-400          (interactive — 2.84:1)
border.focus          sky-500            (focus rings — 3.02:1 from bg-page)
state.positive        emerald-600
state.negative        red-600
state.warning         amber-600
state.info            sky-600
portfolio.gain        emerald-700
portfolio.loss        red-700
portfolio.neutral     slate-500
interactive.primary       sky-500        (CTAs, links default)
interactive.primaryHover  sky-600
interactive.primaryActive sky-700
```

**Dark (Direction A — locked):**
```
background.page       neutral-950        (#0A0A0A — warmer than slate-950)
background.elevated   neutral-900        (#171717)
background.muted      neutral-800        (#262626)
background.inverse    warm-bg-elevated   (#FFFFFF)
background.overlay    rgba(0,0,0,0.7)
text.primary          warm-bg-elevated   (#FAFAFA on near-black — 19.3:1, AAA)
text.secondary        slate-300          (12.1:1)
text.muted            slate-400          (6.62:1)
text.brand            sky-400
text.onBrand          slate-900          (#0F172A on sky-400 — 7.27:1)
border.subtle         neutral-800        (1.18:1)
border.default        neutral-700        (1.97:1)
border.strong         neutral-600        (3.65:1)
border.focus          sky-400
state.positive        emerald-400
state.negative        red-400
state.warning         amber-400
state.info            sky-400
portfolio.gain        emerald-400
portfolio.loss        red-400
portfolio.neutral     slate-400
interactive.primary       sky-400
interactive.primaryHover  sky-300
interactive.primaryActive sky-500
```

Rationale for `border.subtle` (1.42:1) and `border.default` (1.94:1) compromises (below strict 3:1 for UI components): strict compliance produced a harsh fintech look. Decorative containment uses subtle/default; interactive/focused borders use `border.strong` (2.84:1) and `border.focus` (3.02:1) which both meet 3:1. Tracked in `TECH_DEBT.md`.

### 3.6 Accent color calibration — RESOLVED (PO 2026-04-25)

**Decision:** **A2 muted teal `#0D9488`** locked by PO 2026-04-25 per product-designer recommendation. Sky-blue default rejected (cliché). All sky-500 references in v1.4 spec to be read as teal-600 `#0D9488` until token migration completes; sky-400 dark mode references = teal-400 `#2DD4BF`. Frontend-engineer Phase A starts с teal tokens (см. `MIGRATION_PROVEDO_v1.4.md`).

**Calibration options что были рассмотрены:**

| Option | Hex | WCAG on `#FAFAF7` | Register | Risk |
|---|---|---|---|---|
| **A1: sky-blue (default)** | `#0EA5E9` | 4.51:1 AA | Linear / Cursor / Anthropic-familiar; «modern AI tool» instantly | Cliché in AI-tool category; everyone uses sky/blue |
| A2: muted teal | `#0D9488` | 4.62:1 AA | Less cliché; sage-trust signal stronger; «considered observation» | Slightly «health/wellness» drift if not balanced with cool neutrals |
| A3: sophisticated coral | `#C2410C` | 6.51:1 AAA | Subtle Italian etymology nod (terracotta-warm); rare in fintech | High differentiation but high risk — coral CTAs in financial software unprecedented |
| A4: sage green | `#65A30D` | 4.53:1 AA | Calm wisdom register; matches «foresight» semantics; modern | Could read as «positive/gain» visually, conflicting with portfolio.gain emerald-700 |

**product-designer recommendation:** **A2 muted teal `#0D9488`**. Reasoning:
1. Sage register strongest of the four — Provedo's archetype is Sage-primary, accent should reinforce
2. Avoids sky-blue cliché while staying recognizably AI-tool-modern
3. Meaningfully differentiated from emerald-700 (gain) and red-700 (loss) — no portfolio-color conflict (unlike A4 sage)
4. WCAG 4.62:1 — comfortable margin over AA threshold
5. Italian etymology resonance: muted teal evokes Mediterranean / aged-bronze register; honors *provedere* without going Italianate-cream like Direction B
6. Implementation cost: identical to A1 (single color swap; no token-shape change)

**RESOLVED 2026-04-25:** PO selected **A2 muted teal `#0D9488`**. Sky-500 default superseded throughout v1.4. Migration spec (`MIGRATION_PROVEDO_v1.4.md`) ships с teal tokens; frontend-engineer Phase A consumes final calibration.

---

## 4. Typography

**Locked 2026-04-25 — Direction A pairing.** Single sans-serif family (Inter) for all text + dedicated mono family (JetBrains Mono) for numbers/data/code. Both Google Fonts (free, Rule 1 compliant — `https://fonts.google.com/specimen/Inter` + `https://fonts.google.com/specimen/JetBrains+Mono`).

Why these two: Inter is geometric humanist with full Cyrillic support across all weights — «Прове́до» renders cleanly with no glyph-mismatch. Used on Linear, Stripe, Notion-like products (modern-AI-tool register lineage). JetBrains Mono has tabular-by-default monospace that aligns columns cleanly in dashboards/tables and brings developer-tool register signal that ICP A (Notion/Linear cohort) recognizes immediately.

### 4.1 Families

- **Headline / Display:** Inter 600/700, tracking -0.02em (geometric humanist; neutral; infinitely scalable)
- **Body:** Inter 400/500, tracking 0
- **Mono (data, numbers, code):** JetBrains Mono 400/500 (tabular-nums by default; tickers, percentages, currency, code blocks)
- **iOS fallback:** SF Pro on Apple platforms (system font; preserves platform feel) — Inter loaded as web font on iOS only when SF Pro doesn't fit a specific marketing surface

Font loading strategy (per `~/.claude/rules/web/performance.md`):
- `font-display: swap` on both families
- Preload only Inter 400 + Inter 600 (most common weights) — defer 500/700 to avoid render-blocking
- Subset to Latin + Cyrillic where build pipeline supports it
- Total budget: <80kb gzipped both families combined (well within app-page budget)

### 4.2 Scale

Responsive type scale via `clamp()`. Mobile-first, scales up gracefully through 1920 viewport. `viewport-min: 320px`, `viewport-max: 1440px` for clamp interpolation.

```
caption      clamp(0.75rem, 0.7rem + 0.15vw, 0.8125rem)    /* 12-13px  — metadata, timestamps */
body-sm      clamp(0.8125rem, 0.78rem + 0.15vw, 0.875rem)  /* 13-14px  — captions, labels */
body-md      clamp(0.875rem, 0.84rem + 0.18vw, 0.9375rem)  /* 14-15px  — tables, secondary body */
body-lg      clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)       /* 16-17px  — primary body, inputs */
heading-md   clamp(1.0625rem, 1rem + 0.3vw, 1.125rem)      /* 17-18px  — sub-sections */
heading-lg   clamp(1.125rem, 1rem + 0.5vw, 1.25rem)        /* 18-20px  — card titles */
display-sm   clamp(1.5rem, 1.3rem + 1vw, 1.75rem)          /* 24-28px  — sub-heroes */
display-md   clamp(1.75rem, 1.4rem + 1.6vw, 2.25rem)       /* 28-36px  — section heroes */
display-lg   clamp(2.25rem, 1.8rem + 2.2vw, 3rem)          /* 36-48px  — page titles, KPI values */
display-xl   clamp(3rem, 2rem + 5vw, 4.5rem)               /* 48-72px  — hero portfolio value */
```

### 4.3 Weights

- **Regular 400** — body text, default
- **Medium 500** — emphasized body, table headers, button labels (default), input labels
- **Semibold 600** — headings (display-sm through display-xl), CTA button text, important numbers
- **Bold 700** — display-xl hero only (sparingly, marketing surfaces); not used in product UI chrome

Numbers that need visual weight use Semibold 600 + tabular-nums; full Bold 700 reserved for marketing display.

### 4.4 Line-heights

```
leading-none    1.0    /* display-xl hero */
leading-tight   1.1    /* display-lg, display-md */
leading-snug    1.25   /* display-sm */
leading-normal  1.5    /* body default — UI text */
leading-relaxed 1.625  /* longform reading (insight detail body) */
```

### 4.5 Letter-spacing

```
tracking-tightest  -0.04em  /* display-xl hero — wordmark + landing */
tracking-tighter   -0.03em  /* display-lg */
tracking-tight     -0.02em  /* display-md/sm, all heading levels — Inter looks best slightly tightened */
tracking-normal    0        /* body */
tracking-wide      0.025em  /* caption / all-caps labels */
tracking-wider     0.06em   /* eyebrow labels (rare) */
```

### 4.6 Numbers

All currency, quantity, percentage, and timestamp numbers use **JetBrains Mono** with `font-variant-numeric: tabular-nums`. Gain/loss percentages include a leading sign (`+2.3%`, `-1.1%`). Currency symbols stay in mono ($, €, £, ¥). Tickers (AAPL, NVDA) in mono — column-alignment in tables critical.

Body numbers (text-flow, not column-aligned) may stay in Inter with `font-variant-numeric: tabular-nums` if mono visual weight is excessive — design review judges per surface. Default: mono.

### 4.7 Bilingual budget

EN + RU character budget retained. Hero examples:
- EN «Ask your portfolio.» = 19 chars
- RU «Спроси свой портфель.» = 21 chars
- Both fit within 64-72px Inter 600 hero on 720px container at all breakpoints down to 375px.

«Прове́до» specifically:
- 7 Cyrillic chars · 3 syllables · stress mark optional (only in pronunciation guides)
- Inter Cyrillic glyphs balance with Latin equally — no mixed-rendering visual jolt at any weight
- JetBrains Mono Cyrillic equally clean for any RU mono-rendered string

---

## 5. Spacing & layout

Scale (rem): `0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24`.

### 5.1 Grid

- Desktop: 12-col, 1440 canvas, max content width 1280, gutters 24
- Tablet: 8-col, 1024 canvas, gutters 20
- Mobile: 4-col, 390 canvas, gutters 16

### 5.2 Page chrome

Top bar 56. Side nav 240 (collapsible to 56). Content padding 32 desktop, 16 mobile.

---

## 6. Elevation & shadows

**Direction A — flat-with-borders.** Cards are flat with 1px border, not floating. We rely on borders more than shadows in light mode (Linear/Vercel pattern), flipped in dark mode. Three tiers replace v1.3 four-level system.

```
shadow-subtle    0 1px 2px rgba(15,23,42,0.04)
                 → default cards, list rows, input fields at rest
                 (almost imperceptible; visual signal is the border, not the shadow)

shadow-medium    0 2px 6px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.04)
                 → dropdowns, popovers, tooltips, hover-elevated cards

shadow-elevated  0 8px 24px rgba(15,23,42,0.08), 0 2px 6px rgba(15,23,42,0.04)
                 → modals, sheets, command palette, floating chat input on mobile
```

**Removed v1.3 token:** `shadow-ai` (violet glow at 25% alpha) — banned per §0.1 (AI-cliché purple/pink + AI-glow trope). AI surfaces use the same `shadow-subtle` as any other card; AI-active state is signaled by the streaming text indicator + accent border on focus, not a glow.

**Removed v1.3 token:** `shadow-xl` (rare 16px-blur layer) — folded into `shadow-elevated` at lower intensity; deeper levels not needed at Direction A's flat-with-borders register.

**Dark mode:** reduce all shadow opacities by ~40%; compensate with `ring-1 ring-white/5` for edge definition. In dark mode, border tokens carry more visual weight than shadows (warm-bg-elevated swap to neutral-900 makes shadows nearly invisible).

Border-first treatment (light mode):
- Cards: `border: 1px solid {border.subtle}` + `shadow-subtle`
- Hovered cards: `border: 1px solid {border.default}` + `shadow-medium`
- Focused interactive: `border: 1px solid {border.focus}` + 2px sky-500 outer ring (focus-visible)

---

## 7. Border radius

```
radius-none  0
radius-sm    4    chips, small tags
radius-md    8    inputs, small cards
radius-lg    12   cards, dialogs, bottom sheets
radius-xl    16   feature cards, paywall hero
radius-full  9999 avatars, pills, fab
```

---

## 8. Motion

**Direction A principles: short, confident, directional, transform-only.** Never bouncy. Transform + opacity properties only (compositor-friendly per `~/.claude/rules/web/coding-style.md`); never animate width/height/top/left/margin/padding/font-size.

**Duration scale (locked v1.4):**

```
duration-fast      150ms   /* hover states, button press, focus ring fade  — Direction A primary */
duration-base      200ms   /* most transitions, tooltip enter, dropdown reveal — Direction A primary */
duration-medium    250ms   /* major UI transitions: modal enter, sheet slide */
duration-slow      300ms   /* page-level transitions, dialog enter */
duration-count-up  800ms   /* number tween (KPI hero only) */
duration-shimmer  1500ms   /* loading skeleton sweep loop */
```

**Easing scale (locked v1.4):**

```
easing-default   cubic-bezier(0.4, 0, 0.2, 1)    /* in-out cubic — most UI */
easing-out       cubic-bezier(0, 0, 0.2, 1)      /* enter motions, reveals */
easing-in        cubic-bezier(0.4, 0, 1, 1)      /* exit motions, dismiss */
easing-out-expo  cubic-bezier(0.16, 1, 0.3, 1)   /* count-up, hero reveal — exponential settle */
```

**Removed v1.3 token:** `easing-spring` (cubic-bezier(0.34, 1.56, 0.64, 1) — bouncy/playful). Direction A is Sage-pure register; no spring physics anywhere.

Numbers that change animate with `count-up` (tween over 800ms, easing-out-expo). Never animate a delta that the user didn't cause themselves (no auto-tweening on background data refresh).

### 8.1 Reduced-motion variant (mandatory per WCAG 2.2 AA)

When `@media (prefers-reduced-motion: reduce)`:

- Disable all transitions on transform / opacity (instant state changes)
- Disable count-up — show final number immediately
- Disable shimmer loops — replace with static `background.muted` skeleton
- Disable Coach dot pulse animation (per `COACH_SURFACE_SPEC.md` §1.4) — static dot only
- Disable BellDropdown first-session pulse (per §14.7) — static bell only
- Keep functional state changes instant (focus rings still appear, but with no fade-in)
- Keep streaming text indicators in chat (`aria-live="polite"` text indicator is content, not motion)

Implementation pattern:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 9. Iconography

- **Web:** [Lucide](https://lucide.dev) (open-source, ISC licensed; via `lucide-react` package). Default: `currentColor` stroke, `stroke-width="1.5"`, sizes 16/20/24. Direction A-locked default size: **16px** in dense surfaces (table rows, chips), **20px** in nav and bell-dropdown, **24px** in hero CTAs. Lucide is consistent with the modern-AI-tool register (Linear/Cursor/Vercel use compatible icon sets).
- **iOS:** SF Symbols (regular weight, scale medium). Bridges naturally to Apple platform conventions.

**Banned per §0.1:** `brain`, `brain-cog`, `brain-circuit`, any sparkle/star/wand glyph used for AI-decoration. These icons are forbidden in persistent UI chrome — no exceptions.

**Lucide icons used regularly in Provedo (allowlist non-exhaustive):**

| Use case | Lucide icon |
|---|---|
| Notifications hub | `bell` |
| Chat / Ask Provedo | `message-circle`, `send` |
| Settings | `settings`, `sliders-horizontal` |
| Search | `search` |
| Filter | `filter` |
| Sort | `arrow-up-down` |
| Lock (paywall) | `lock` |
| Info / explainer | `info`, `help-circle` |
| Trust marker | `shield-check`, `circle-check` |
| Account / broker | `landmark`, `wallet` |
| Trend up/down | `trending-up`, `trending-down` |
| Coach pattern category | colored dot — NO Lucide icon (per `COACH_SURFACE_SPEC.md` §1) |

Custom icons only for brand marks or asset class glyphs we genuinely need (stock, ETF, crypto) and Lucide doesn't cover cleanly. Custom additions must be reviewed against §0.1 (no brain/sparkle/AI-aesthetic drift).

---

## 10. Components

The design system exposes a set of primitives, composites, and patterns. Tokens drive all of them.

### 10.1 Primitives

Button, Input, Select, Combobox, Checkbox, Radio, Switch, Slider, Badge, Chip, Tooltip, Popover, Dropdown, Dialog, Sheet, Toast, Alert, Tabs, SegmentedControl, Card, Skeleton, Avatar, ProgressBar, Spinner, Separator.

### 10.2 Financial primitives

- **MoneyCell** — formatted currency with tabular-nums, auto color by sign
- **PercentCell** — same, with leading sign
- **CountUpNumber** — animated number for hero metrics
- **PositionRow** — symbol + name + qty + value + daily delta, default row for lists
- **Sparkline** — 7/30/90-day mini chart, uses `portfolio.gain/loss` colors
- **Allocation donut** — pie variant for asset-class breakdown, max 8 slices, ninth bucketed as "Other"

### 10.3 AI-specific primitives

- **ChatInputPill** — grounded single-line input with expanding textarea behavior. Border 1px `border.default` at rest, `border.focus` (sky-500) on focus, 2px outer ring. Radius `radius-full`. Send button: ghost variant until input has content, then `interactive.primary` filled.
- **ToolUseCard** — shows what tool Provedo invoked (e.g., «Fetched your AAPL transactions»), collapsible. `background.muted` bg, `border.subtle` 1px, `radius-md`, mono ticker references.
- **TrustRow** — «Based on: N transactions across M accounts • Updated X min ago» (EN) / «Источник: N транзакций по M счетам • Обновлено N мин назад» (RU). `text.tertiary` color, `body-sm` size, `tracking-wide`.
- **SuggestedPrompt** — dismissable chip with example question. Pill-shaped (`radius-full`), `background.muted` bg, hover `background.subtle`. Always preceded by «Try asking:» header.
- **ExplainerTooltip** — used in-place to decompose a number («this 5.2% = $2,100 / $40,384»). Triggered by `?` icon hover/focus or long-press on mobile. Popover with `shadow-medium`.
- **InsightCard** — headline (verb-led, «Provedo noticed…»), body (2-4 lines observational), source (which positions/dates), two CTAs (`View` / `Dismiss`). `radius-lg`, `border.subtle` 1px, `shadow-subtle`.
- **BellDropdown** — notifications center; `<li>` with inner `<div role="menuitem" tabIndex="0">` for correct a11y semantics. See §14.7 full spec.
- **ChatBubble** — user vs Provedo response variants. **User:** right-aligned, `background.muted` bg (`#F5F5F1`), no border, `radius-lg`. **Provedo:** left-aligned, `background.elevated` bg (white), 1px `border.subtle`, `radius-lg`. v1.3 used violet-50 tint on Provedo response bubbles — REMOVED in v1.4 (no AI-purple tint per §0.1).

### 10.4 Monetization

- **PlanBadge** — subtle chip showing Free/Plus/Pro in context
- **PaywallModal** — honest, single-column, no urgency manipulation
- **UsageMeter** — linear bar with "X of Y used this month"
- **FeatureLockRow** — inline lock icon + one-line reason + CTA
- ~~**LockedPatternCard**~~ — **OBSOLETE in v1.3.** Was a teaser variant of the v1.2 `CoachPatternCard` (dedicated-route model). Replaced by CoachPopover teaser variant in v1.3 (contextual-dot model). See §10.5 and `COACH_SURFACE_SPEC.md` §4.2.

### 10.5 Coach primitives (v1.3 — contextual model — retained in v1.4 with token swaps)

v1.3 **supersedes v1.2** Coach primitives. PO 2026-04-23 locked Coach as contextual (not dedicated route); primitives redesigned accordingly. **v1.4 carries v1.3 architecture forward unchanged** but with token swaps for the multi-category color (no longer violet-700).

**Used in v1.4:**

- **CoachDot** — 6px (desktop) / 8px (mobile) filled circle, categorical semantic color (amber-600 Concentration, sky-600 Timing / Contrarian, emerald-600 Dividends / Cost-averaging, **`interactive.primary` (sky-500 default; teal-600 if PO calibrates per §3.6)** for multi-category on same element). Wrapped in a `<button>` for keyboard + a11y. Optional bounded pulse animation (scale 1.0→1.15→1.0, 1200ms, every 2.5s, max 5min active-page-time, `prefers-reduced-motion` → static). Mount point: any of 5 attachment types per `COACH_SURFACE_SPEC.md` §1.
- **CoachPopover** — dialog anchored to a CoachDot (desktop, max 480px) or full-width bottom sheet (mobile). Two content variants:
  - **Full detail (Plus/Pro):** category pill + read date + verb-led headline + observational summary + evidence block (JetBrains Mono tabular-nums transaction list) + dismiss/snooze actions.
  - **Teaser (Free):** category pill + subject-only headline + skeleton shimmer body + locked evidence + «Upgrade to Plus» CTA.
- **CategoryPill** — retained; categorical (not evaluative) pill with token-colored outline + text label. Used inside CoachPopover and bell-dropdown rows. Never color-only signal (always paired with text label per WCAG 2.2 1.4.1).

**v1.4 notes:** v1.3 spec referenced `accent.primary` = violet-700 for multi-category Coach dots. v1.4 maps multi-category to `interactive.primary` (sky-500 default), maintaining the «accent color» semantic role across the rebrand. `COACH_SURFACE_SPEC.md` v2.0 spec is otherwise unchanged.

**Removed (v1.2 primitives obsoleted by v1.3):**

- ~~`CoachPatternCard`~~ — article-level card for `/coach` route; route removed.
- ~~`CoachWeekAnchor`~~ — `<h2>` week divider; no dedicated coach surface to anchor.
- ~~`CoachEmptyState`~~ — full-surface Path A/B empty states; empty states now live in bell-dropdown (`COACH_SURFACE_SPEC.md` §6).
- ~~`LockedPatternCard` (v1.2 §10.4)~~ — full locked card variant; replaced by teaser variant inside CoachPopover.

Frontend-engineer implements CoachDot + CoachPopover in Slice 8c (scope unchanged at slice level; substituting primitives within the slice).

---

## 11. Layout patterns

### 11.1 Dashboard (home)

```
┌─────────────────────────────────────────────────┐
│ TopBar: logo | search | notif | plan | avatar   │
├─────┬───────────────────────────────────────────┤
│ Nav │ Hero: total value + day/all-time delta    │
│     ├───────────────────────────────────────────┤
│     │ Insight of the day (AI) — full width      │
│     ├───────────────────────┬───────────────────┤
│     │ Portfolio line chart  │ Allocation donut  │
│     ├───────────────────────┴───────────────────┤
│     │ Positions table (top 5, "See all" →)      │
│     ├───────────────────────────────────────────┤
│     │ Recent activity (transactions)            │
└─────┴───────────────────────────────────────────┘
```

### 11.2 AI chat

Split view on desktop, full-screen on mobile. Left: conversation list + "new chat". Right: message column (max 720px readable width), input pinned bottom.

### 11.3 Positions / position detail

Table → row click → side sheet on desktop, full-screen on mobile. Detail contains: identity, position summary, transaction history, explainer for key metrics, related AI insights.

### 11.4 Accounts

List view + "+ Connect" primary action. Each account card shows broker logo, display name, last sync, status pill, quick menu.

### 11.5 Empty states

Illustration-free by default. Icon + short line + single CTA. Example: "No positions yet. Connect an account to see your portfolio. [ Connect ]".

### 11.6 Dashboard architecture — detailed spec

`docs/design/DASHBOARD_ARCHITECTURE.md` owns the full home-screen spec for Provedo:

- Top-of-fold hierarchy (hero → insight of the week → charts → positions → activity). Coach has no dedicated dashboard tile; coach dots surface on position rows + widget headers instead (v1.3 contextual model — retained in v1.4).
- AI-woven pattern (how «Provedo noticed» badges surface on cards without AI-sparkle chrome; coach dots are a distinct primitive).
- Primary routes + tab structure (Dashboard / Positions / Insights / Chat / Settings — 5 routes, Coach is contextual, not a route).
- Web side-nav + iOS bottom tab-bar mapping (4 tabs on iOS: Dashboard / Insights / Chat / Settings).
- Responsive behavior across 320/375/768/1024/1440/1920.
- Per-ICP daily-use patterns (ICP A / ICP B / mid-career post-mistake).

**v1.4 token migration note:** `DASHBOARD_ARCHITECTURE.md` references `accent.primary` (was violet-700 in v1.3) — these references should be re-read as `interactive.primary` (sky-500 default; subject to §3.6 PO calibration). Spec architecture unchanged.

ASCII layout in §11.1 above is retained as a quick-reference; `DASHBOARD_ARCHITECTURE.md` is the authoritative source for dashboard design.

### 11.7 Onboarding flow — detailed spec

`docs/design/ONBOARDING_FLOW.md` owns the 3-stage onboarding flow:

- Stage 1: account creation (Clerk-hosted).
- Stage 2: broker sync (SnapTrade flow).
- Stage 3: first-value moment (warm-start via SnapTrade backfill-derived pattern-read within 10 minutes, NOT 30-day wait).

First-value-moment design handles both warm-start (backfill-triggered) and cold-start (no history) dual paths.

---

## 12. Accessibility

WCAG 2.2 AA mandatory on every surface; AAA targeted for body text and critical financial numbers where achievable.

### 12.1 Contrast

- Text: 4.5:1 minimum (WCAG AA for body), 7:1 target for critical financial numbers
- UI components: 3:1 minimum (WCAG AA), with the documented compromise on `border.subtle` and `border.default` (§3.5) — interactive borders use `border.strong` (2.84:1) and `border.focus` (3.02:1) which both meet 3:1
- Never convey gain/loss through color alone — always sign + number
- Never convey Coach category through color alone — always paired with category text label

### 12.2 Keyboard

- All interactive elements reachable by Tab
- Escape closes dialogs, sheets, popovers
- Enter / Space activate buttons and menu items
- Arrow keys within menus, tabs, segmented controls (minimal arrow-nav in BellDropdown is tech-debt, Enter/Space suffice for now)
- **Focus ring always visible: 2px `border.focus` (sky-500 default; or PO-calibrated accent per §3.6) with 2px outer offset.** Implementation: `outline: 2px solid {border.focus}; outline-offset: 2px;` on `:focus-visible`. v1.3 used violet-700 — REPLACED in v1.4.
- `Cmd/Ctrl+K` opens command palette (Linear/Cursor pattern; familiar to ICP A)
- `Cmd/Ctrl+Shift+B` opens BellDropdown (per §14.7)

### 12.3 Screen readers

- All icons that carry meaning get `aria-label`
- Decorative icons `aria-hidden="true"`
- Live regions for AI streaming responses (`aria-live="polite"`)
- Charts have adjacent data-table alternative
- Brand-name pronunciation hints in settings («Provedo — /proh-VEH-doh/ EN» / «прове́до RU»)

### 12.4 Motion

Respect `prefers-reduced-motion`. Per §8.1: disable count-up, cross-fades, decorative transitions, Coach pulse, BellDropdown first-session pulse. Keep functional state changes instant.

---

## 13. Freemium UX

### 13.1 Tiers

| Tier | Price | Accounts | AI msgs/day | Insights | Tax reports | API |
|---|---|---|---|---|---|---|
| Free | $0 | 2 | 5 | Weekly | — | — |
| Plus | $8–10 | 10 | 100 | Daily | — | — |
| Pro | $20 | Unlimited | Unlimited | Real-time | US+DE | ✓ |

### 13.2 Gating patterns

Three levels of friction, chosen by feature:

1. **Soft lock** — feature visible, greyed-out with `FeatureLockRow` inline. Used for low-value gates (custom alerts).
2. **Modal lock** — `PaywallModal` on click, preview of what they'd see. Used for AI daily insights beyond weekly.
3. **Page lock** — full upgrade page for premium-only surfaces (tax reports). Always shows clearly what's included.

### 13.3 Never

- No dark patterns ("you'll lose your data in 3 days")
- No forced trial auto-renewal without prominent 7-day-prior email reminder
- No fake scarcity ("only 3 spots left")
- No countdown timers on paywalls
- No "downgrade" language; use "change plan"

### 13.4 Upgrade surfaces

- Contextual in-feature CTA (the moment they hit a limit)
- Settings → Subscription (non-intrusive)
- One honest email sequence (welcome → first insight → 30-day value recap → limit-approaching → upgrade offer)

---

## 14. AI module UI

We have five AI surfaces. Each gets its own visual identity within the system.

### 14.1 Chat

Purpose: free-form Q&A about the user's portfolio.

UI:
- Message bubbles: user right-aligned `background.muted` (`#F5F5F1`); Provedo response left-aligned `background.elevated` (`#FFFFFF`) with 1px `border.subtle`. v1.3 used a violet-50 tint on the AI bubble — REMOVED in v1.4 (anti-pattern §0.1, no AI-purple). Dark mode: user bubble `background.tertiary` (neutral-800), Provedo bubble `background.elevated` (neutral-900) with `border.subtle`.
- Streaming: token-by-token, cursor indicator. `aria-live="polite"` on the response container per §12.3.
- ToolUseCard collapses below the message when Provedo used a tool.
- TrustRow appears under every Provedo response.
- SuggestedPrompt chips appear in empty state.

Free tier: 5 messages/day counter visible in input area. Plus/Pro: hidden unless approaching limit.

### 14.2 Proactive insights

Purpose: Provedo notices things without being asked.

**Cadence honesty (LOCKED 2026-04-23):** weekly-default, not daily. Free tier = 1 insight/week (weekly digest). Plus tier = daily (1 per day max). Pro tier = real-time as-found. Earlier «daily» framing for Free tier is rejected — daily pressure breaks the «calm over busy» principle and positions Provedo as push-driven notification stream, which it is not. Landing and in-product copy align on «weekly» for Free tier messaging.

UI:
- InsightCard in a vertical feed on dedicated page (`/insights`)
- "Insight of the week" card on dashboard (top 1 for Free; today's for Plus; real-time for Pro). See `docs/design/DASHBOARD_ARCHITECTURE.md` §2.
- Categories: concentration, behavioral (Coach surfaces contextually via dots on related elements — see §14.6 v1.3 contextual model), dividend, performance, observational (NOT rebalance — rebalance is imperative; Lane A lock forbids imperative framing)
- Each card: headline (one line, verb-led), body (2-4 lines, observational voice), source (which positions/dates), CTAs (View details / Dismiss / Snooze)
- Dismissed insights never return; snoozed return in 7 days if still valid
- Headline framing: **«Provedo noticed…»**, **«Flagged this week:…»**, **«Surfaced:…»**. Never «Your AI noticed…», never «Your brain noticed…». See §0.2.

### 14.3 Behavioral coach

Purpose: flag emotional-investing patterns, gently.

UI:
- Appears as a sheet triggered by behavior (e.g., 3+ buys in 7 days on same ticker after price spike)
- Never blocks user action; it's observational
- "Want to talk about this?" → routes to chat with pre-filled context
- Can be muted per-category in settings

### 14.4 Scenario simulator

Purpose: "what if I bought X / sold Y" and "how would my portfolio look".

UI:
- Entry points: from position detail, from chat, from allocation donut (click segment → "What if I rebalanced?")
- Modal with side-by-side: current vs. simulated, with deltas on key metrics
- Disclaimer: "Simulation only. Past performance doesn't predict future."
- Pro-only feature (Free and Plus see paywall)

### 14.5 Explainer

Purpose: decompose any number on the screen.

UI:
- Long-press / right-click / `?` icon on any financial number opens ExplainerTooltip
- Shows the formula and the inputs ("5.2% = $2,100 gain / $40,384 cost basis")
- Links to source transactions
- Always available (no tier gate)

### 14.6 Coach — contextual behavioral pattern reads

Purpose: Provedo surfaces patterns in user's trade history — observationally, never as advice.

**Architecture (LOCKED 2026-04-23 by PO, supersedes earlier dedicated-route and filter-chip proposals):** Coach is a **contextual layer**, not a primary route. Coach is surfaced via:

1. **Dot indicator primitive** on attachment-point elements — position rows, dashboard widget headers, chat thread previews, insight cards, transaction rows. A small (6px desktop / 8px mobile) categorical-colored filled circle signals «Provedo noticed a pattern concerning this element».
2. **Top-bar bell-dropdown** as the aggregation hub — see §14.7.

Coach is NOT a primary route. Coach is NOT a nav item. Coach is woven into existing surfaces.

**Detailed spec:** `docs/design/COACH_SURFACE_SPEC.md` v2.0 — owns attachment-point taxonomy, dot primitive, pulse motion spec, hover/focus/active states, popover (Plus/Pro full detail + Free teaser), bell-dropdown hub, empty states (Path A warm-start, Path B cold-start, post-gate quiet), accessibility. Supersedes v1.0 `/coach` route spec.

**Integration contract with this design brief:**
- Coach dot primitive uses existing semantic color tokens — `state.warning` (Concentration), `state.info` (Timing / Contrarian-signal), `state.positive` (Dividends / Cost-averaging), `interactive.primary` (multi-category on same element — was `accent.primary`/violet-700 in v1.3; v1.4 maps to sky-500 default per §3.6 PO calibration). No new tokens required.
- Coach popover content (both Plus/Pro detail variant and Free teaser variant) reuses existing primitives: Skeleton (locked state shimmer), Dialog (popover), Button (CTA), Lucide `lock` icon, existing dismiss/snooze mutation buttons.
- Coach patterns flow through the same mutation contract as insights (dismiss + snooze via existing insights backend, per Slice 6b pattern) — no new mutation primitives needed.
- Coach has its own category taxonomy (Concentration / Timing / Dividends / Cost-averaging / Contrarian-signal). Dot colors + popover category pills are categorical, NOT evaluative (no red-for-bad, green-for-good).
- Coach cold-start gating uses tx-count-or-history-span soft gate (not calendar-day hard gate). Bell-dropdown shows progress counter during cold-start (`COACH_SURFACE_SPEC.md` §6.2). See `CC_KICKOFF_option4_coach_adr.md` §2.3.
- Coach in-context AI disclaimer: every popover summary closes with observational-framing language («no judgment», «pattern only», or equivalent). Narrative is AI-Service-generated and passes Lane A regex guardrail (`CC_KICKOFF_option4_coach_adr.md` §2.6 Layer 2) server-side; client trusts the filter and renders only validated text.
- Coach regulatory guardrail: backend regex filter rejects imperative output; design trusts the filter.
- Coach dot anti-pattern compliance (§0): NO sparkle, NO brain glyph, NO gradient halo, NO AI-glow. Solid filled circle only. Optional subtle pulse (scale 1.0→1.15→1.0, 1200ms, every 2.5s, bounded to 5 min active-page-time, `prefers-reduced-motion: reduce` → static).

**Removed v1.2 primitives:**

- `CoachPatternCard` (article-level card for `/coach` route) — obsolete in v1.3 (route removed). Dot + popover take its place. See §10.5 update below.
- `CoachWeekAnchor` (`<h2>` week section divider) — obsolete (no dedicated coach surface to anchor).
- `CoachEmptyState` (Path A / Path B full-surface variants) — obsolete. Empty states now live inside bell-dropdown (`COACH_SURFACE_SPEC.md` §6).
- `LockedPatternCard` (Free-tier full locked card variant) — obsolete. Locked teaser lives in popover instead (`COACH_SURFACE_SPEC.md` §4.2).
- `CategoryPill` — retained as popover/dropdown element; no longer used in a dedicated coach surface.

**New v1.3 primitives:**

- **`CoachDot`** — 6px/8px filled circle with category-colored semantic token, optional pulse animation, wrapped in a `<button>` for keyboard + screen-reader accessibility. Mount point: any attachment-point element per `COACH_SURFACE_SPEC.md` §1.
- **`CoachPopover`** — dialog anchored to a CoachDot (desktop) or full-width bottom sheet (mobile). Two content variants: full detail (Plus/Pro) and teaser (Free). Reuses existing Dialog + Skeleton + Button primitives.

**Content-lead coordination:** every pattern category needs a narrative template (popover summary body). Product-designer owns the dot + popover shape; content-lead owns copy variants (headline templates, observational closer, teaser headline framing, dashboard conversion-nudge banner). See `COACH_SURFACE_SPEC.md` §13 for full list of copy hooks.

**Legal-advisor coordination:** in-context AI disclaimer format is still open per positioning lock 2026-04-23 Q6. Product-designer's candidate recommendation in v1.3 (carried into v1.4) remains **inline observational closer on every popover summary** (not tooltip) plus a one-time first-interaction modal on first dot-click («Provedo shows patterns based on your trade history, not advice. This is educational, not investment guidance.» — Acknowledge). Legal-advisor to confirm whether inline closer satisfies EU/UK requirement. Tracked in `COACH_SURFACE_SPEC.md` §17 Q1.

### 14.7 BellDropdown pattern — hub for «Provedo noticed» notifications

Purpose: single always-on-screen aggregation surface for every «Provedo noticed» notification — including Coach patterns, weekly digest, price alerts, billing, security events.

Extension of the `BellDropdown` primitive from §10.3 and behavior notes in §16.2.

**Visual behavior:**

- Lucide `bell` icon in top-bar right group (left of PlanBadge), 20px, `text.primary` at rest.
- Unread count badge: small circle overlay top-right of bell, `state.info` fill (sky-600), `text.onBrand` text, `caption` size Semibold. Shows 1-9 or `9+`.
- **Coach-unread differentiator:** when at least one unread coach pattern is present in the dropdown, the bell icon gains a subtle 1px `interactive.primary` (sky-500 default; or PO-calibrated accent per §3.6) ring at the icon's outer radius. v1.3 used violet-700 — replaced in v1.4. Differentiates coach-present from generic-product-notifications-only. Disappears when all coach patterns read.
- **First-coach-of-session pulse:** the first time a new coach pattern lands in a session, the bell pulses ONCE (scale 1.0→1.15→1.0 over 1200ms). Subsequent coach patterns in the same session: badge count increments silently. User-agency principle — one attention-grab per session. Reduced motion: no pulse.

**Dropdown structure (see `COACH_SURFACE_SPEC.md` §7.2 / §7.3 for full layouts):**

Sections in order:

1. **Coach · This week** — coach patterns from the current weekly cycle (Sunday 00:00 UTC – Sat 23:59 UTC).
2. **Coach · Earlier** — coach patterns from older cycles, not yet read / dismissed. Collapsed by default if >3 items.
3. **Other notifications** — non-coach types (digest emails, price alerts, billing, etc.).

Footer: «Mark all read» + «Notification settings» link (→ `/settings/notifications`, includes per-Coach-category mute toggles).

**Free vs Plus/Pro:**

- Plus/Pro: coach rows show pattern-name teaser text. Click opens full popover.
- Free: coach rows show «🔒 Locked preview» label. Click opens teaser popover. Footer gains «Upgrade to Plus for full pattern reads ▸» link.

**Keyboard shortcut:**

- `Cmd/Ctrl+Shift+B` toggles the bell-dropdown from anywhere in the app. `Cmd/Ctrl+B` NOT used — conflicts with browser bookmark-bar toggle on Chrome/Firefox.
- Hint shown in bell hover tooltip.

**Accessibility (extends §10.3 TD-005):**

- `<button aria-label="Notifications — N unread" aria-haspopup="menu" aria-expanded="[bool]">` on the bell.
- Dropdown `role="menu"` (minimal arrow-nav remains tech-debt TD-005; Enter/Space + Tab suffice for alpha).
- Coach rows `role="menuitem"` with context-specific `aria-label` per `COACH_SURFACE_SPEC.md` §7.6.
- Reduced motion: dropdown opens/closes instantly (no scale/opacity transition); bell first-session pulse disabled.

**Empty state variants (Path A warm-start, Path B cold-start, post-gate quiet):** see `COACH_SURFACE_SPEC.md` §6. Bell icon shows without badge during all empty states (count = 0).

**Integration contract:** BellDropdown receives its feed from a single notifications API endpoint (tech-lead to confirm — payload must include notification type discriminant so Coach rows can be grouped separately from other types). Coach rows consume insights-type payload with `type = 'coach_weekly'` (per `CC_KICKOFF_option4_coach_adr.md`). Mutation actions on Coach rows (dismiss, snooze) reuse Slice 6b insights-mutation endpoints.

---

## 15. Tier-specific screens

### 15.1 Free

- Dashboard shows weekly insight only, with "Daily insights → Plus" inline CTA
- AI chat input shows "N of 5 messages today" counter
- Accounts page: "Add account" button is disabled past 2 with tooltip

### 15.2 Plus

- Dashboard: daily insight at top, with "Real-time → Pro" tease
- AI chat: clean input, hidden counter
- Accounts: 10-account limit, progress indicator in settings

### 15.3 Pro

- All locks off
- Additional nav item: "Reports" (tax)
- Additional nav item: "Scenarios" (simulator)
- Settings: API key management section

### 15.4 Plan switcher

Top-right `PlanBadge`. Click → dropdown:
- Current plan + "Manage"
- Link to pricing
- If on Free: prominent "Upgrade" button

---

## 16. Notifications

### 16.1 Types

| Type | Channel | Default | Override |
|---|---|---|---|
| Security (new login, etc.) | Email + in-app | On, not mutable | — |
| Insight published | In-app | On | Off per category |
| Weekly summary | Email | On | Off |
| Price alert (user-set) | In-app | On | Off per alert |
| Billing | Email | On, not mutable | — |
| Product updates | Email | Off | On if desired |

### 16.2 In-app

`BellDropdown` in top bar. Unread count as `state.info` dot (sky-600), `interactive.primary` (sky-500 default; PO-calibrated accent per §3.6) when high-priority. Grouping updated in v1.3 — see §14.7 for full spec:

- Coach · This week
- Coach · Earlier
- Other notifications

When a Coach pattern is unread, bell icon gains a 1px `interactive.primary` outer ring. First-coach-of-session bell pulse (1200ms scale, disabled on `prefers-reduced-motion`). Keyboard shortcut `Cmd/Ctrl+Shift+B`.

### 16.3 Email design

Same type scale. Single-column, 600px max width. Unsubscribe link in footer (for non-mandatory emails). No tracking pixels (principle — we'll use aggregate open-tracking via provider, no per-user).

---

## 17. Security UI

### 17.1 Auth

- Clerk-hosted sign-up/sign-in pages, themed to match tokens (not dark-vs-light-flash)
- 2FA setup in settings, QR code + backup codes (downloadable as PDF only, never shown as image or text to copy)
- Sessions page: device, location (country-level, never precise), last active

### 17.2 Data handling

- Every place that displays sensitive data (e.g., broker linkage status) has a "What we see" explainer tooltip
- Accounts page has a "Disconnect" action with a confirmation showing exactly what happens ("we'll stop syncing; your historical data stays until you delete it")
- "Delete account" in settings: destructive red-700 button at bottom, 3-step confirmation (explain → type username → final)

### 17.3 Trust markers

Subtle, not bragging:
- "Read-only" pill next to every broker account
- "Encrypted at rest" in tooltip on security section
- Bank-grade phrasing avoided; we don't need to namedrop SOC-2 until we have it

---

## 18. Account management

### 18.1 Profile

Avatar upload, display name, email (managed by Clerk), locale, display currency, time zone. Changes save inline (no explicit save button) with toast confirmation.

### 18.2 Subscription

Plan card with: current plan, next billing date, amount, "Manage in Stripe" button (opens Stripe Customer Portal in new tab).

### 18.3 Data & privacy

- Export all data (GDPR) → async job, emails link to downloadable zip
- Delete all data (GDPR) → 7-day soft-delete with "restore" option, then hard delete
- Connected accounts overview (Clerk-provided and ours)

### 18.4 Notifications settings

As per §16, togglable per-category.

---

## 19. KPI coverage map

How the design system supports business KPIs. Useful as a sanity check when adding new surfaces.

| KPI | Primary surfaces | Design levers |
|---|---|---|
| Activation (connect first account) | Onboarding, empty dashboard, connect flow | Empty state CTA prominence, onboarding chat, trust markers |
| Engagement (DAU/MAU) | Dashboard, AI chat, insights feed | Daily insight freshness, chat answer quality, notification restraint |
| Retention (30/90-day) | All surfaces, email touchpoints | Calm UX (no fatigue), behavioral coach restraint, value recap emails |
| Conversion Free→Plus | Paywall, usage meter, upgrade CTA contexts | Honest gating, contextual CTAs, no dark patterns |
| Upgrade Plus→Pro | Pro-feature teases, scenario simulator, reports | Tease without nagging, clear Pro-only value |
| Trust / NPS | AI transparency, error states, disclosure | TrustRow, ToolUseCard, source links, calm tone |
| Churn (early warning) | Settings, billing | Reminder emails ≥7 days prior, pause option (future), honest cancel flow |

---

## Appendix A — Reference competitors

Positive references — Direction A (modern AI-tool minimalist) cluster:
- **Claude.ai / Anthropic** — warm-neutral bg, Sage-pure restraint, AI-as-interface (the visual benchmark for v1.4)
- **Cursor** — AI-tool register without sparkle chrome; chat + command palette pattern
- **Linear** — information density + calm; sky-blue accent precedent
- **Vercel / Stripe Docs** — typographic restraint, mono for code/data, single-accent system
- **Raycast** — keyboard-first polish, command palette
- **Notion (product UI side)** — accessible information density
- **Lunchmoney** — financial UX done well, restrained palette

Negative references (what we avoid):
- **Robinhood** — gamified, confetti, dashboard-jazz
- **eToro** — cluttered, social-maxxed
- **PortfolioPilot dashboard** — advisor-coded density, imperative UX
- **Mint / Empower** — corporate-stiff legacy fintech
- 2025-era AI-consumer apps with sparkle-heavy interiors and purple/pink AI gradients
- Most retail broker apps — cluttered, ad-driven

---

## Appendix B — Change log

- **v1.0 → v1.1:** added §13 freemium UX, §14 AI module UI, §15 tier-specific screens, §16 notifications, §17 security UI, §18 account management, §19 KPI coverage map; updated §3.5 with WCAG audit outcomes from PR #31.
- **v1.1 → v1.2 (2026-04-23):** Provedo product-name lock + dashboard-primary architecture lock alignment. Added:
  - **§0 Anti-pattern list** — explicit ban list guarding the «Second Brain» metaphor against AI-sparkle / brain-chrome / neural-network / gradient-mesh / Liquid-Glass-on-AI-content / dashboard-jazz drift. Copy-level patterns banned («Your brain noticed…»). Enforcement notes for design review + code review.
  - **§2.2 Insights tone** — «actionable» → «observational» (Lane A lock, AI never prescribes).
  - **§2.3 Naming** — Provedo locked; agent-self-reference policy («Provedo noticed…», never «your brain…», never AI first-person).
  - **§10.4 Monetization** — added `LockedPatternCard` primitive for Coach teaser-paywall.
  - **§10.5 Coach primitives** — new subsection introducing `CoachPatternCard`, `CoachWeekAnchor`, `CoachEmptyState`, `CategoryPill`.
  - **§11.6 Dashboard architecture** — pointer to `docs/design/DASHBOARD_ARCHITECTURE.md`.
  - **§11.7 Onboarding flow** — pointer to `docs/design/ONBOARDING_FLOW.md`.
  - **§14.2 Insights cadence honesty** — Free tier = weekly (not daily); aligned with positioning + landing.
  - **§14.6 Coach surface** — new subsection; delegates detailed spec to `docs/design/COACH_SURFACE_SPEC.md`; coach integration contract (mutation reuse, category taxonomy, cold-start gating, regulatory guardrail, legal-advisor coordination for in-context AI disclaimer format).
  - No token changes. Token system remains metaphor-neutral; v1.1 palette + semantic mapping survives v1.2 unchanged.
- **v1.2 → v1.3 (2026-04-23):** Coach UX PO lock — contextual-icon + bell-hub model supersedes dedicated-route model. Changes:
  - **§10.4 Monetization** — `LockedPatternCard` marked OBSOLETE (replaced by CoachPopover teaser variant in §10.5).
  - **§10.5 Coach primitives** — rewritten. `CoachDot` + `CoachPopover` added. v1.2 primitives (`CoachPatternCard`, `CoachWeekAnchor`, `CoachEmptyState`, `LockedPatternCard`) marked obsolete. `CategoryPill` retained.
  - **§11.6 Dashboard architecture pointer** — updated primary routes count (5, not 6); removed Coach teaser row from top-of-fold; updated iOS tab-bar (4 tabs, Coach contextual).
  - **§14.2 Insights categories** — behavioral insights note updated (no longer «routes to Coach»; coach surfaces contextually).
  - **§14.6 Coach surface** — major rewrite. Contextual-layer architecture: dot on attachment-points + bell-dropdown hub. Legal-advisor coordination carried forward. Detailed spec now in `COACH_SURFACE_SPEC.md` v2.0.
  - **§14.7 BellDropdown pattern (new)** — single hub for all «Provedo noticed» notifications including Coach. Coach-unread violet ring differentiator, first-session pulse, keyboard shortcut `Cmd/Ctrl+Shift+B`, three-section grouping (Coach · This week / Coach · Earlier / Other).
  - **§16.2 In-app notifications** — BellDropdown grouping updated (points to §14.7).
  - No token changes. Existing semantic tokens (warning / info / positive / accent.primary) cover Coach dot colors. Palette and mapping unchanged.

---

Maintained by the product-designer agent (Navigator mediates PO review). Changes require a PR with rationale in the description. Ship tokens first in `packages/design-tokens`, then this doc, then TASK_07/08 implementation catches up.
