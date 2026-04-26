# AI-Tool Landing Audit — 2026-04-27

**Author:** product-designer (Navigator dispatch — Track A of 3)
**Method:** `curl` fetch w/ browser UA → HTML structural analysis (h1/h2/h3/p/a/meta), brand-attribute extraction (theme-color, bg, asset density), copy verbatim where server-rendered. Motion/anim inferred from class names + asset density + pattern recognition. Public knowledge fallback for SPA-shell targets (`<div id="root">`).
**Targets:** 8 — claude.com · cursor.com · perplexity.ai · linear.app · lovable.dev · openai.com · anthropic.com · granola.ai
**Goal:** complementary scan of the **AI-tool landing landscape** for Provedo's v4 redesign — not a v3.1 tweak.

---

## §1. Scope + delineation from existing audit

The existing **`2026-04-26-strong-competitor-landing-audit.md`** covered 8 targets selected for **fintech + portfolio-tracker overlap**: claude · cursor · perplexity · linear · vercel · stripe · range · public. Its synthesis was tactical (5 patterns for v2 density fix; section spec for v2).

**This audit is COMPLEMENTARY:**

| Already covered by 2026-04-26 | NEW here |
|---|---|
| claude · cursor · linear · perplexity (4 overlap, fintech-density lens) | **lovable.dev · openai.com · anthropic.com · granola.ai** (4 net-new) |
| vercel · stripe (cloud + payments) | (out of scope) |
| range · public (fintech) | (out of scope) |
| Tactical density fix for v3 | **Strategic v4 fundamentals** (hero metaphors, demo-first vs claim-led, voice register, motion budget) |

Where this audit re-touches the 4 overlap targets, it re-reads them as **AI-tool-category artefacts** rather than fintech density references. The lens differs; conclusions sometimes differ.

---

## §2. Per-target audit cards

### 2.1 claude.com (Anthropic)

Light off-white bg; Inter-like UI font + **serif `font-ui-serif`** for headings («Explore plans», FAQ, plan tier names «Free / Pro / Max»). Server-side h1 missing — replaced by **rotating hero phrases** («Brainstorm in Claude, build in Cowork»; backface-visibility flip motion). Dual CTA: Try Claude + Sign up. Mega-menu nav (7 sections × multiple sub-items). Tabbed use-case demos deeper (covered in prior audit). Motion budget: **moderate** — word-rotation is the gesture, otherwise restrained. Voice: intellectual-collaborative («thinking partner»), Sage-dominant. Section count ~9. Trust signals: none direct — Anthropic is the trust signal. **Notable:** mixed sans + serif typography; rotating-word hero replacing static headline — rare. The serif-heading-inside-sans-body is the single most copyable Anthropic move for «calm sage» typographic feel.

### 2.2 cursor.com

**Dual-mode dark+light** (`#14120b` warm-near-black ↔ `#f7f7f4` warm-near-white) — both warm-cast, same family Provedo uses. h1 «Built to make you extraordinarily productive, Cursor is the best way to code with AI» — claim-led superlative. Primary CTA: **Download** (product-pull, not waitlist). Hero embeds **interactive Mission Control sub-demo** — real product UI with anchors («Trigger», «View Behavior»). Strongest «show the product» play in the set. Sticky multi-section nav (mid-density). Motion budget: **heavy but restrained** (interactive demo, parallax). Sans-only typography. ~13 sections (Cursor-tier earned; Provedo cannot). Voice: every section head verb-led — «Agents turn ideas into code» / «Works autonomously, runs in parallel» / «Magically accurate autocomplete» / «Develop enduring software». Trust: YC · Stripe · OpenAI · Vercel · Anthropic · Slack logos. **Notable:** the live mini-app embedded inside hero as proof. Master class on capability-statement heads.

### 2.3 perplexity.ai

SPA shell — `<div id="root">` only. Theme-color `#FCFCF9` light / `#100E12` dark — **near-identical warm-near-white to Provedo's `#FAFAF7`**. Font preload: PPLX-Sans-Beta-VF + FK Grotesk Neue (custom sans + grotesk pairing). Inline JS confirms toggleable `answerFontStyle` — defaults to **serif for answers** — editorial pairing strategy. Hero (public knowledge): **search input IS the hero**. Single ask-box, no headline above. Primary CTA: the input itself. Product-as-hero taken to its extreme. Motion: restrained. Monochrome + muted accent (turquoise/teal). Section count: N/A — single-screen entry; marketing pages live elsewhere. Voice: answer-engine functional («free AI-powered answer engine that provides accurate, trusted, and real-time answers»). **Notable:** no marketing landing on root — the app IS the landing. Provedo can't adopt (visitors don't know the product yet) but it surfaces a tension: the more confident the AI product, the less it argues for itself.

### 2.4 linear.app

**Dark default** (`#08090a` near-pure-black). Hero h1 SPA-rendered; meta + extracted spans confirm: «The system for product development» + «Issue tracking is dead» as manifesto secondary line + sub «Plan and build products. Designed for the AI era». Dual CTA: Get started + Contact sales. **Broadest «show the whole product» display in the set** — confirmed via class extraction: stacked product mockups, live-issue board (status pills, ENG-2703-style), Slack-thread embed («On it! I've received your request. Kicked off a task in kinetic/kinetic-iOS$ /bin/bash..»), code diff viewer, agent execution log, analytics chart. Sticky minimal top nav (≤6 items). Motion: **moderate-heavy** scrollytelling, animated status transitions, message-in-feed sequence — within Linear's discipline. Inter Display + Inter Variable, sans-only. ~10 sections. Voice: declarative, manifesto («Issue tracking is dead» / «A new species of product tool» / «Built for purpose»). Trust: «25 000+ product teams» + customer logos. **Notable:** demonstrates that a landing CAN show many product surfaces at once if every surface is real and typography holds them together.

### 2.5 lovable.dev (AI app builder)

**Warm-cream `#fcfbf8`** — astonishingly close to Provedo's `#FAFAF7`. Same warm family. h1 sub-label «AI App Builder» (small grey above the input). **Hero IS a giant prompt input** with placeholder text. Below: «Get started» / «Log in». Demo-first input → live preview → 3-step explainer («Start with an idea» → «Watch it come to life» → «Refine and ship»). Minimal top nav. Motion: **animated multi-color rainbow gradient sweep on hero words** («Ready to build?» / «Meet Lovable» / «templates» — `linear-gradient(90deg, ..., #82BCFF, #2483FF, #FF66F4, #FF3029, #FE7B02, transparent)`, 1.2s). This is **the AI-purple-pink-orange anti-pattern Provedo §0.1 explicitly bans, deployed full-strength**. Sans system, hero font 3xl–5xl tracking-tight. ~5–6 sections. Voice: product-friendly Everyman warmth («Start with an idea» / «Watch it come to life») — low intellectual register. Trust signals: template gallery as social proof. **Notable:** validates that the AI-cliché-gradient register works for vibe-code-curious audience; near-zero overlap with Provedo's HNW investors. Useful as **what we're rejecting**.

### 2.6 openai.com

Abstract / corporate / art-directed. OG image «teal and pink brushstrokes on orange canvas» — creative-direction register. Hero: «What can I help with?» — **the ChatGPT input prompt itself**. Same product-as-hero pattern as Perplexity / Lovable. CTA: «Get started with ChatGPT» (text-link). Mega-menu top. Motion: **restrained** (1 SVG, minimal canvas — editorial-leaning). Below the input: editorial stream — «Recent news» / «Stories» / «Latest research» / «OpenAI for business». Half product, half magazine. OpenAI Sans (custom) + system fallback, single sans family. ~6 sections visible. Voice: mission-led, research-credible («research will eventually lead to artificial general intelligence...»). Sage-academic register, lower commercial pressure than ChatGPT.com sub-page. Trust: the brand. **Notable:** the magazine/editorial stream below the product input validates the editorial mid-page pattern as an AI-category convention.

### 2.7 anthropic.com

**Warm light** (`#f0eee6` warm-paper-cream w/ tan/coral accent — distinctly warmer than Provedo's `#FAFAF7`; closer to Direction-B cream that Provedo rejected). Hero h1 missing on server (likely SVG-typeset or scrolly). Lead paragraph: «AI will have a vast impact on the world. Anthropic is a public benefit corporation dedicated to securing its benefits and mitigating its risks» — manifesto-led, not product-led. Multiple soft CTAs: «Project Glasswing» («Securing critical software for the AI era»), Claude Opus 4.7 release card, NASA Perseverance / Mars storytelling card. Mega-menu nav. Motion: **restrained** — corporate AI register; trust over motion. Warm-cream + tan/coral accent — chromograph consistent claude.com → anthropic.com. Editorial typography. ~7 sections. Voice: **mission-academic-restrained** at maximum — «public benefit corporation», «Responsible Scaling Policy», «Claude's Constitution», «Economic Index». Highest Sage register in the set; no productivity claims, only stewardship. **Notable:** corporate AI landing that doesn't sell a product directly — sells stewardship of the category. Provedo cannot match the gravitas without lying about scale; useful as ceiling reference, not template.

### 2.8 granola.ai (AI meeting notepad — surprise pick)

White `#ffffff` primary, light-only. Custom display sans **font-quadrant**, tracking-[-0.015em] tight. h1 «The AI notepad for people in back-to-back meetings» — claim-led, **audience-specific**, single-line. Sub: «Granola takes your raw meeting notes and makes them awesome». CTA framing: «Try Granola for a few meetings today. It's free to get started» — low-pressure. Product surface: **screenshot-grade real meeting note interfaces with detailed example content** — same fictional «Intro call: AllFound» demo'd against multiple meeting types, with h3 sub-headers («About them» / «Key takeaways» / «Decision-making insights» / «Budget & Timeline» / «Next Steps»). **Highest-fidelity product-content demo in the set** — actual fake meeting notes worth reading. Minimal nav. Motion: restrained. ~7 sections. Voice: **specific, audience-narrowed, modest** — defines product by negation: «Granola transcribes your computer's audio directly, with no meeting bots joining your call» (Range-style negation). Trust: «Helping the world's best product teams» + Notion / Slack / Vercel logos. **Notable:** the **fake-but-detailed example content** strategy — every screenshot has actually-written example output that reads like real product. Reader skims notes, mentally maps to own meetings, value-prop lands without explanation. **The pattern Provedo most needs to copy** — replace bracketed placeholders with fully-written example chats / insight feeds / dividend calendars.

---

## §3. Pattern frequency table

Across the 8 AI-tool landings:

| Pattern | C | Cu | P | L | Lo | OAI | An | G | Freq | For Provedo |
|---|---|---|---|---|---|---|---|---|---|---|
| Warm-neutral light bg (≠ pure white) | y | y | y | n (dark) | y | partial | y | n | **5/8** | **VALIDATES Provedo `#FAFAF7`** |
| Dark default | n | optional | optional | y | n | n | n | n | 1/8 | n |
| Product-as-hero (input/live demo) | partial | y | y | partial | y | y | n | n | **5/8** | **CONSIDER for v4** (see R2) |
| Stacked product mockups in hero | n | n | n | y | n | n | n | partial | 1/8 | already covered |
| Capability-statement section heads | partial | y (all) | n/a | y (all) | partial | partial | partial | partial | 4/8 | already covered |
| Mixed sans + serif typography | y | n | y (serif answer) | n | n | n | partial | n | 3/8 | **CONSIDER for editorial mid-page** |
| Custom display font for headlines | n | n | y (PPLX) | y (Inter Display) | n | y (OpenAI Sans) | y | y (font-quadrant) | **5/8** | n — Inter+JBM locked |
| Mega-menu navigation | y | partial | n | n | n | y | y | n | 3/8 | **NO** — Provedo too small |
| Single CTA / low-pressure framing | n | n | y | n | y | partial | partial | y | 4/8 | **YES** — re-collapse hero |
| Editorial mid-page narrative | partial | y | n | y (Method) | partial | y | y | partial | **6/8** | **YES** — already in roadmap |
| Animated rainbow gradient on type | n | n | n | n | y | n | n | n | 1/8 | **REJECT** (anti-pattern §0.1) |
| Word-rotation hero | y | n | n | n | n | n | n | n | 1/8 | **CAUTION** — Lane A risk |
| Logo carousel for trust | n | y | n | y | n | n | n | y | 3/8 | already covered |
| Numeric proof in heads | n | y | partial | y | n | n | n | partial | 3/8 | already covered |
| Fully-written example product content | partial | y | n | y | partial | partial | y | **y (highest)** | **5/8** | **YES — replace placeholders** |
| Audience-specificity in hero | n | n | n | n | n | n | n | y | 1/8 | **YES — adopt** (R3) |
| Defines product by negation | n | n | n | partial | n | n | partial | y | 2/8 | already in v2 roadmap |

**Frequency reading.** 5 patterns appear in 5/8+ AI-tool landings:

1. **Warm-neutral light bg** — Provedo locked, validated.
2. **Product-as-hero** — not in Provedo v3.1; potential v4 fundamentals shift (R2).
3. **Editorial mid-page narrative** — already in v2 roadmap; **further validated** here.
4. **Custom display font for headlines** — Provedo cannot adopt (Inter+JBM lock); flag only.
5. **Fully-written example product content** — strongest copy-side gap in v3.1.

---

## §4. Provedo applicability notes — 5 specific recommendations

### R1. Replace ALL bracketed-placeholder demo content with fully-written example product output (highest leverage)

**What Granola does:** writes detailed fake meeting notes that read like real product output. Reader reads the notes, not the marketing copy.
**What Linear does:** real-feeling issue IDs (ENG-2703), real Slack threads, real diff views.
**What Provedo v3.1 does:** «*[Chart of monthly P&L, sources cited inline]*» — bracketed placeholder.

**Recommendation:** content-lead + product-designer joint pass to produce **fully-written example chat conversations** for each §2 demo tab. Each tab gets:
- Real-feeling user question (not «what are my dividends?» — try «My VOO is down. Why is my portfolio still up this month?»)
- Real-feeling Provedo answer with **specific dollar amounts, tickers, dates, source citations** («Source: AAPL Q3 earnings 2025-10-31, Schwab statement 2025-11-01»)
- Rendered chart inline — slate-700 stroke + teal-600 emphasis (per 2026-04-26 V2 spec)

Lane A guardrail intact — every example uses allowlist verbs (notices / surfaces / shows / cites). Cost: ~6–8 hrs content-lead + ~4 hrs product-designer. Zero spend.

### R2. Test «product-as-hero» as v4 fundamentals direction (reserved — Lane A tension)

**5/8 AI tools:** prompt input itself is the hero. No claim above; product invites action.
**Provedo v3.1:** locked imperative «Ask your portfolio» + sub + dual CTA + animated charts.

**Tension.** A live «Ask Provedo» demo would be the highest-conviction move but:
- **Lane A risk:** anonymous visitor types «Should I sell Apple?» — Provedo must respond disclaim-locked. Microcopy at every possible prompt is non-trivial. Demo would need **constrained chip-input** («What moved this week?» / «Who paid me dividends?» / «Where am I most concentrated?»), not free input.
- **Connection-state risk:** Provedo's value depends on **the user's actual portfolio**. Demo before account-link can only show **sample-portfolio** observations — dilutes «notice what *you'd* miss».

**Recommendation:** **DO NOT ship as v4 hero.** Prototype as **§2-tab interaction** instead (chip → demo answer). Defer free-input hero to v5 post-alpha when sample-portfolio mode is reliable.

### R3. Adopt audience-specificity hero modifier (Granola pattern, Provedo-translated)

**Granola:** «The AI notepad for people in back-to-back meetings» — names the user upfront.
**Provedo v3.1:** «Ask your portfolio» — speaks to anyone.

**Recommendation:** add single-line audience modifier:

> **Provedo** *— for portfolios that don't fit in one app*
> Ask your portfolio.
> [sub] Provedo notices what you'd miss across every broker.

This is option B from 2026-04-26 audit; AI-tool landscape **independently re-validates** via Granola. Zero advice register. PASS.

### R4. Lift the editorial mid-page pattern to its strongest variant

**6/8 AI tools** ship a mid-page narrative breaking the feature-grid rhythm. Anthropic = mission. OpenAI = research-stories. Linear = Method. Cursor = research-timeline.
**Provedo v3.1** has §3 mid-page «Your portfolio lives in seven places…» as plain paragraph.

**Recommendation:** keep 2026-04-26 V4 spec (full-bleed dark surface, big editorial type, teal-400 closing accent). **Add one element:** test **JetBrains Mono accent line** for closing «Provedo sees what you hold and notices what you'd miss» tagline (vs italic Inter). Mono reads «product, technical, real»; italic Inter reads «designer flourish». Defer pick to PO via Navigator.

### R5. Add a release-card / changelog block (Anthropic + Cursor pattern) — POST-ALPHA

**Anthropic:** «Latest releases» h2 with cards — Claude Opus 4.7 / «Claude is a space to think» / «Claude on Mars».
**Cursor:** «Changelog» + «Recent highlights» — visible release cadence on the landing.
**Provedo v3.1:** no release surface.

**Recommendation (deferred to post-alpha v5):** «What Provedo noticed this week» insight-of-the-week card pre-footer, structurally identical to Anthropic's release cards. Each weekly Provedo Insight (anonymized aggregate) becomes self-renewing landing asset signaling «active product, real data». Flag now as TD entry so it doesn't get lost.

---

## §5. Anti-patterns to reject

### A1. Animated rainbow gradient on hero typography (Lovable.dev)

`linear-gradient(90deg, ..., #82BCFF, #2483FF, #FF66F4, #FF3029, #FE7B02, transparent)` 1.2s sweep on hero words. **Canonical AI-purple-pink-orange gradient — Provedo §0.1 names it explicitly.** Lovable validates the trope still attracts vibe-code-curious audience; Provedo's HNW investors expect calm financial-tool register. **Use teal-600 only, never gradients.**

### A2. Mega-menu navigation (claude · openai · anthropic)

Earns its complexity at Anthropic-tier scope (100+ pages). Provedo at pre-alpha has 4–5 destinations max. Mega-menu would read **ambitious-cosplay**. Linear and Cursor at their scale still keep nav tight (≤6 top-level) — that's the model.

### A3. Word-rotation hero phrases (claude.com)

Every rotating phrase becomes an implicit capability claim that has to pass §0.2 banned-copy guardrail. Maintenance overhead high; cost of one bad rotation slipping past compliance also high. **Static hero is safer for Lane A.**

### A4. Mission-tier brand register without scale (anthropic.com)

«Public benefit corporation dedicated to securing AI's benefits.» Anthropic earns this register via documented PBC status, Constitutional AI work, category-leading research. Provedo at pre-alpha cannot import the gravitas without it reading **as posture**. Borrow Anthropic's typographic restraint and warm-light-bg discipline; match Provedo's actual scale in copy register: confident, specific, narrow ICP.

---

## §6. AI-tool ⇄ Lane A tensions

The strongest AI-tool patterns surfaced here create **structural tension** with Provedo's Lane A regulatory positioning. Naming them so synthesis + PO sees the trade-offs explicitly.

### T1. «Try the product now» convention vs «account-linked observation» reality

AI tools converge on **try-without-signup** (Perplexity / Lovable / OpenAI / Cursor demo card / claude.com chat preview). Genre expectation: visit, type, see magic. Provedo's value depends on the **actual brokerage portfolio** — without OAuth-linked Schwab/IBKR/Fidelity, Provedo can only render **sample-portfolio observations**. **Tension:** matching genre convention requires a sample-portfolio simulator that doesn't yet exist, and may never feel authentic enough to sell the real product.

### T2. «Product magic» AI register vs Lane A disclaim discipline

AI-tool conventions lean **active claim register** — «turns ideas into code» / «makes them awesome» / «space to think». All capability claims. Provedo's Lane A bans the active-claim verbs in lane («recommends / suggests / advises / strategy / tells you to»). Substitute verbs (notices / surfaces / explains / cites) read **softer by design**. Visitors steeped in AI-tool register may parse Provedo as **less ambitious** than a Lane B/C competitor. **Tension:** the very thing that makes Provedo trustworthy (disclaim discipline) is what makes it sound less «AI-magical» than the genre.

**Mitigation flag:** Provedo's Lane A is **positioning equity**, not a constraint to apologize for. Range's «not a brokerage / not a spreadsheet» (per 2026-04-26 audit) + Granola's «no meeting bots» both demonstrate that **negation as positioning** can read more confident than capability-claim register, not less. Brand-strengthening opportunity for content-lead + brand-voice-curator.

### T3. Demo-first hero vs «scroll to understand» fintech reading order

Granola/Lovable work because visitor already knows what a meeting note / app is. Provedo cannot assume reader knows that multi-broker aggregation is legal (it is, via OAuth — but visitor doesn't know), that AI-on-portfolio ≠ AI-advisor, that Free is permanent. **Tension:** AI-tool genre prefers fast-action heroes; Provedo needs **slower comprehension scaffolding** before action. The 2026-04-26 v2 structure (hero → numeric proof bar → problem-negation → demo tabs → ...) is on the right side of this tension.

### T4. Custom display fonts vs Provedo type lock

5/8 AI-tool landings use custom display fonts (PPLX-Sans, OpenAI Sans, font-quadrant, Inter Display, claude's font-claude-response). Provedo locked Inter + JetBrains Mono — same family as claude/cursor/linear effectively. **No real tension.** Flagging only because v4 might invite «should we license a display font?» — recommendation: **no spend** (Rule 1 + Inter is excellent).

---

## §7. Open questions for the synthesis phase

For Track A → synthesis (Navigator) → PO. Not for product-designer to lock alone.

1. **R2 product-as-hero:** ship in v4 as constrained chip-input demo, defer to v5, or static screenshot? Recommendation: **defer to v5**; v4 stays static stack per 2026-04-26 V1.
2. **R4 mono-accent in editorial mid-page:** worth a 2-variant test (italic Inter vs JBM closing line)? Product-designer recommends test; cost ~1 hour.
3. **R3 audience modifier:** PO preference among A/B/C from 2026-04-26? Recommend **B** for Sage-register fit.
4. **T2 brand-strengthening of Lane A as positioning equity:** worth dispatching brand-voice-curator + content-lead to **promote** negation pattern from compliance footer to landing-hero-area? Range + Granola + this audit all converge — **strongest available positioning move**, but brand-territory, outside product-designer scope. Flag for Navigator → PO → brand-voice-curator dispatch.
5. **R5 release-card surface for post-alpha:** add as **TD-100 entry**? Build post-alpha when first 4 weekly insights are real.
6. **A4 register-calibration:** worth a brand-voice-curator + content-lead pass to draft a **scale-honest mission-equivalent** for Provedo's eventual «about» surface? E.g., «We built Provedo because portfolios across multiple brokers are functionally invisible to the people who own them.» — narrower, scale-honest, no PBC posture. Defer.

---

**Word count:** ~2 950. Within 2 500–3 500 budget.

**END ai-tool-landing-audit-product-designer.md**
