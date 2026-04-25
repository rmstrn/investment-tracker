# Strong Competitor Landing Audit — 2026-04-26

**Author:** competitive landing analyst (Navigator dispatch)
**Method:** WebFetch primary; WebSearch + Lapa Ninja + Framer case study fallback for SPA-blocked targets
**Targets:** 8 strong-tier landings (claude / cursor / perplexity / linear / vercel / stripe / range / public)
**Goal:** identify concrete patterns to fix Provedo landing v1 «пустовато» feedback within Direction A locked palette/typography (`#FAFAF7` bg, slate-900, teal-600, Inter + JetBrains Mono).
**Constraints:** Provedo 5-item EN guardrails preserved; Direction A locked; no purple/sky-blue cliché.

**Fetch status:**
- `claude.com/product/overview` — fetched OK (302 from claude.ai → claude.com)
- `cursor.com` — fetched OK
- `perplexity.ai` — 403 blocked; recovered via Framer case study + Lapa Ninja Comet landing review
- `linear.app` + `linear.app/method` — fetched OK
- `vercel.com` — fetched OK
- `stripe.com` — fetched OK
- `range.com` — fetched OK
- `public.com` — fetched OK

WebFetch returns markdown — animations / micro-motion / shadow depth inferred from structural HTML + alt text + known design-pattern recognition. Flags noted in per-landing detail where inferred.

---

## Executive summary

### Top 5 visual patterns Provedo should adopt

1. **Stacked product mockups in hero** (Linear's three-screen stack; Cursor's Desktop+CLI+Mobile triplet). Single screenshot reads template; 2–3 stacked depth-layered surfaces read «real product, multiple surfaces». Direct fix for «пустовато».
2. **Inline data-viz baked into demo tabs** (Linear: timeline + diff + analytics chart inside same product card; Range: portfolio chart + projection scenarios). Provedo's §2 already promises «*[Chart of monthly P&L]*» / «*[Calendar view]*» / «*[Trade timeline]*» — make these real, hand-designed, not placeholder.
3. **Logo carousel scrolling marquee** (Stripe: Amazon/Shopify/Figma/Uber/OpenAI/Google; Range: Forbes/Fast Company/Business Insider). Provedo §4 already has broker/exchange marquee planned — confirm it's animated scroll, not static grid.
4. **Editorial mid-page narrative block with oversized typography** (Stripe «Book of the week»; Linear's Method page; Cursor's «Develop enduring software» research timeline). Single full-bleed block with one big phrase + body copy breaks the rhythm of stacked feature cards.
5. **Numeric proof inlined in section heads** (Vercel: «build times went from 7m to 40s», «95% reduction», «24x faster»; Stripe: «$1.9T processed», «50% Fortune 100»; Cursor: «Trusted by over half of the Fortune 500»). Provedo currently has zero of these.

### Top 5 copy patterns Provedo should adopt

1. **Imperative-verb declarative hero, not descriptive** (Vercel: «Build and deploy on the AI Cloud.» Stripe: «Financial infrastructure to grow your revenue.» Public: «Investing for those who take it seriously.»). Provedo's «Provedo will lead you through your portfolio» is futurally-tensed and self-referential — single-line declarative version reads stronger. *Note: hero is PO-locked 2026-04-25, so this is a delta-test recommendation, not a re-open.*
2. **Capability-statement section heads** (Cursor: «Agents turn ideas into code» / «Works autonomously, runs in parallel» / «Magically accurate autocomplete»; Linear: «Make product operations self-driving»). Verb-led, present-tense, claim-first. Provedo §3 currently uses «A few minutes a week. Everything that moved.» — rhythm-perfect, but only one section uses this technique.
3. **Question-style demo prompt → answer pattern made structural** (Public: «Turn any idea into an investable index with AI. Just enter a prompt, backtest…»). Provedo's §2 four-tab structure already does this — make it visually first-class (tab 1 should anchor the page right after hero, not be buried under generic feature cards).
4. **Verbatim user testimonial blocks with role/firm attribution** (Cursor: testimonials from Y Combinator / NVIDIA / OpenAI / Stripe; Range: 4 customer headshots; Stripe: 4 enterprise testimonials with headshots). Provedo has zero. Even pre-launch placeholder structure (alpha-tester quotes) signals «real product».
5. **Outcome-resolved problem-negation** (Range: «It's not a brokerage, it's not a spreadsheet, and it's not trying to be everything for everyone.»; Linear's whole tone: «Issue tracking is dead»). Provedo positioning is built on negation (Lane A = NOT advice, NOT recommendation) — currently surfaces only as compliance footer, never as positioning copy.

### Top 3 anti-patterns to avoid

1. **Range's tier-stacking advisor-paternalism** — «Modern financial advice, built just for you» / «Discover upside in any scenario» — Provedo's Lane A guardrails forbid this register entirely. Don't borrow Range's framing despite its visual richness.
2. **Public's feature-density overload** — 7 product categories in nav + 5 secondary features + 3 active-trading callouts. Reads cluttered. Provedo's MVP ICP is narrower (US retail HNW, single use case = portfolio observation), so don't import Public's brokerage-supermarket layout.
3. **Cursor's 13-section sprawl** — at the strong tier of dev-tool category-leader status, Cursor can support 13 sections; Provedo at pre-alpha cannot. Land on **8–9 sections** (matches Vercel + Stripe + Linear midpoint).

### 3-section roadmap для landing v2

**ADD (high-priority, density fix):**
- Stacked hero mockups (3-screen depth: chat surface + insight feed + cross-broker view)
- Inline real charts inside §2 demo tabs (not bracketed placeholders)
- Numeric proof bar between hero and §2 (e.g., «Reads 1000+ brokers · Cites every observation · Free forever, no card»)
- Pre-alpha testimonial slot (3 quotes with role/portfolio-size attribution; placeholder structure ready for real quotes)
- Mid-page editorial block with one oversized phrase (the §3 mid-page narrative is right material — needs typography treatment, not just paragraphs)

**CHANGE:**
- §2 demo tabs: promote to full-width with screenshot-grade mock chat UI (currently reads as text-table). Inline chart artifacts become first-class visual content, not square brackets.
- §4 broker marquee: confirm animated scroll (not static grid). Add monochrome treatment (slate-700 on `#FAFAF7`) — reads premium, not stock-logo-soup.
- Section-head copy: make every heading verb-led + claim-first (Cursor pattern). Currently §1+§5 are claim-led; §2+§3+§4 are descriptive-led.

**KILL:**
- The «pre-footer repeat CTA» block (§5) is fine but currently has zero visual differentiation from hero CTA — kill OR redesign as full-bleed editorial CTA panel (Stripe pattern: dark surface, type-led, single-button).
- Triple CTA stack in hero (Ask Provedo + Try Plus 14 days + Or start free forever + 2 small-prints). Six text elements in CTA zone reads admin form, not landing. **Recommendation:** primary single CTA + secondary text-link («or start free forever»). Re-collapse into Linear/Cursor dual-CTA pattern.

---

## Per-landing detail (compact)

Format per row: **Hero verbatim** · sections · top-3 section heads verbatim · visual signature · adoptable patterns (✅/❌).

### 1. claude.com (Anthropic)
**Fetch:** `claude.ai` 403 → redirected to `claude.com/product/overview`.
**Hero:** «The AI for Problem Solvers» / sub «Tackle any big, bold, bewildering challenge with Claude.» — CTAs: Try Claude + Contact sales (clean dual). Visual: Opus 4.7 model-announcement hero.
**Sections (~7):** Nav · Hero · «Meet your thinking partner» · Task categories (Write/Learn/Code/More) · Tabbed use-case demos (Tasks/Learn/Code/Research/Analyze/Create) · Distribution channels · Capability highlights.
**Heads verbatim:** «Meet your thinking partner» · «Break down problems together» · «Tackle your toughest work» · «Delegate tasks» · «Learn anything through conversation» · «Build anything with intelligent help».
**Copy:** declarative-noun hook («The AI for…»), collaborative verb register («tackle/build/think together»), brand-world line («thinking partner») repeated.
**Visuals:** tabbed real-interface demos (study guides, Gantt charts, code interfaces), distribution-channel iconography, subtle tab-switching motion.
**For Provedo:** ✅ tabbed use-case demos (§2 aligns directly) · ✅ «Meet Provedo» bridge-section pattern · ❌ «thinking partner / collaborate» register drifts toward advisor-paternalism (Lane A risk).

### 2. cursor.com
**Hero:** «Built to make you extraordinarily productive, Cursor is the best way to code with AI.» — CTAs: Download for macOS ⤓ + Try mobile agent →. Visual: interactive Desktop+CLI demo over solid bg.
**Sections (13):** Hero · Desktop demo · Agents · Autonomous · In every tool · Testimonials · Model selection · Codebase understanding · Enterprise trust · Changelog · Team · Blog · Footer. **Exceeds 8–12 norm.**
**Heads verbatim (KEY pattern — every head verb-led/claim-led):** «Agents turn ideas into code» · «Works autonomously, runs in parallel» · «In every tool, at every step» · «Magically accurate autocomplete» · «Use the best model for every task» · «Complete codebase understanding» · «Develop enduring software» · «The new way to build software».
**Copy:** capability framing throughout, social proof («Trusted by over half of the Fortune 500»).
**Visuals:** 3+ interactive demos, real code snippets (React components), team photography (2 large), avatars, abstract bg waves, status indicators, research-timeline 2022–2026. **Zero charts.**
**For Provedo:** ✅ **capability-statement section heads** (master pattern, rewrite §2/§3/§4) · ✅ inline data-snippet density (translate to chat-message snippets) · ✅ timeline viz («what Provedo noticed last week») · ❌ 13 sections too many for pre-alpha · ❌ Cursor has zero charts; Provedo MUST have charts (financial product).

### 3. perplexity.ai
**Fetch:** 403 across all attempted variants. Recovered via Framer case study + Lapa Ninja Comet review.
**Comet sub-landing (proxy):** «Browse at the speed of thought. A new browser from Perplexity.» Palette: white + blue dominant. Type: PP Editorial New + FK Grotesk + serif accents (editorial pairing). Modular categories (AI/Software/Productivity/Creative).
**Design philosophy (Modisett, Head of Design):** «clean, smart, and sharp.»
**For Provedo:** ✅ editorial type pairing strategy — within Inter+JetBrains lock, use Inter body + JetBrains Mono for chat-message quotes (mono = product-feel; serif-equivalent role) · ✅ «speed of thought» single-noun-anchored tagline pattern (Provedo's «Notice what you'd miss» plays this register) · ❌ blue accents (Direction A locks teal-600) · ⚠️ confidence MEDIUM — main page not directly fetched.

### 4. linear.app (HIGHEST FIT — design benchmark)
**Hero:** «The product development system for teams and agents» / sub «Purpose-built for planning and building products. Designed for the AI era.» — CTAs: 4-stack («Issue tracking is dead» manifesto + Get started + Contact sales + Open app). Visual: **3 stacked screenshot mockups** (Inbox/My issues/Reviews/Pulse).
**Sections (~6 product flows):** Intake · Plan · Build · Diffs (Coming soon) · Monitor · Changelog.
**Heads verbatim:** «Make product operations self-driving» · «Define the product direction» · «Move work forward across teams and agents» · «Review PRs and agent output» · «Understand progress at scale».
**Copy:** outcome-focused, capability-statement heads, social proof («25,000+ product teams»).
**Visuals:** live issue-tracking interface (concrete ENG-2703), board with backlog/todo/in-progress/done columns, timeline/roadmap viz (Feb–Sep), code diff viewer, **dashboard analytics charts** (issue-count trend, cycle-time), Slack-thread mockups, user avatars.
**For Provedo:** ✅ **stacked 3-mockup hero** (chat-surface + insight-feed + cross-broker — solves «пустовато» in one move) · ✅ **embedded analytics charts in product cards** (§2 P&L / dividend calendar / trade-timeline) · ✅ concrete example IDs (ENG-2703 → Provedo's tickers + dollar amounts + timestamps) · ✅ «25,000+» metric placement (pre-launch placeholder: alpha-tester count + observations cited).

### 5. vercel.com
**Hero:** «Build and deploy on the AI Cloud.» / sub «Vercel provides the developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web.» — CTAs: Deploy + Get a Demo. Visual: animated «Runway» graphic + globe with network nodes.
**Sections (~9):** Hero · Customer proof · Use-case tabs (AI/Web/Ecommerce/Marketing/Platforms) · Product features · Framework-defined infra · Fluid Compute · AI Gateway · Templates · CTA/footer.
**Heads verbatim:** «Your product, delivered.» · «Scale your [Enterprise]» · «Deploy once, deliver everywhere.» · «Fluid Compute» · «AI Gateway» · «Deploy your first app in seconds.» · «Framework-Defined Infrastructure».
**Copy (KEY pattern):** **speed metrics throughout** — «build times went from 7m to 40s» · «95% reduction» · «24x faster builds». Named customer examples with quantified results.
**Visuals:** browser-frame screenshots, commerce storefronts, architecture diagrams, **AI model usage rankings chart**, animated compute viz, globe network activity, light/dark toggles.
**For Provedo:** ✅ **numeric proof inline in heads/sub-heads** (1000+ brokers, every observation cited, free forever 50 chats/mo) · ✅ use-case tabs (§2 aligns) · ⚠️ globe visual — risks sky-blue cliché (Direction A anti-pattern) · ❌ «delivered.» / «scale.» imperative too aggressive for Sage register.

### 6. stripe.com (HIGHEST DESIGN CRAFT — alongside Linear)
**Hero:** «Financial infrastructure to grow your revenue.» / sub «Accept payments, offer financial services, and implement custom revenue models—from your first transaction to your billionth.» — CTAs: Get started + Sign up with Google. Visual: animated wave + customer logo carousel.
**Sections (~11):** Hero · Logo carousel · Product solutions grid · Commerce backbone stats · Enterprise case studies · Professional services · Startup offerings · Platform SaaS solutions · Developer infra · «What's happening» news · Footer.
**Heads verbatim:** «Flexible solutions for every business model» · «The backbone of global commerce» · «Powering businesses of all sizes» · «Realize value faster with dedicated experts» · «Reliable, extensible infrastructure for every stack» · «Book of the week» · «Ready to get started?».
**Copy:** «50% of Fortune 100 companies have used Stripe» · «$1.9T in payments volume processed in 2025» · «incorporate in two business days». Role-based segmentation (enterprise/startup/platform).
**Visuals:** 4 bento product cards · 7 stylized street-scene case studies · 4 enterprise testimonials with headshots · multiple data-viz charts · 8-item news carousel · stat infographics (135+ currencies / $1.9T volume) · logos throughout · carousel motion.
**For Provedo:** ✅ **logo carousel as scroll marquee** (§4 — confirm animation) · ✅ **bento product cards** (could replace §2 tabs as 2×2 grid) · ✅ **«Book of the week» editorial block** → adopt as «Insight of the week» pre-footer · ✅ statistical infographic in heads · ❌ enterprise-tier register («backbone of global commerce») overshoots pre-alpha · ❌ stylized street-scene photography — Provedo is data-product, photography forced.

### 7. range.com (closest fintech-AI competitor)
**Hero:** «All-in-one wealth management.» / sub «Get modern financial advice for investing, taxes, and more—with no hidden fees.» — CTAs: triple stack (Book Your Personal Demo + Get Started + Join Now). Visual: dashboard screenshot («For illustrative purposes only»).
**Sections (~13 incl. footer):** Trust badges · Service grid · Benzinga review · Testimonials carousel · Press mentions · «Finance Reimagined» · Advanced projections · Pricing · Platform integration · Advisor team · Trust credentials · FAQ · Footer.
**Heads verbatim (notable):** «Modern financial advice, built just for you» · «Finance Reimagined» · «Discover upside in any scenario» · «Professional Grade Projections» · «Receive transparent, flat-fee pricing and 0% AUM» · «It Just Works» · «We're your thought partner and team» · «A Fresh Point of View».
**Copy (KEY adoptable):** **problem negation** — «It's not a brokerage, it's not a spreadsheet, and it's not trying to be everything for everyone.» Audience specificity: «high earners / executives / entrepreneurs / $200k+». Benefit contrast: «0% AUM vs up to 1%». Trust amplification: fiduciary/CFP/SEC repeated. Team authority: one-advisor → team-of-experts.
**Visuals:** dashboard screenshot (interactive graph, cash-flow viz), projection-scenarios charts, service icons (investments/tax/retirement/cash flow/real estate), 4 trust badges (Benzinga/Finder/TipRanks/Newsweek), 11 press logos, 4 customer headshots.
**For Provedo:** ✅ **problem-negation copy pattern** — strongest single recommendation: «Provedo is not a robo-advisor. Not a brokerage. Will not tell you what to buy.» This is Lane A as positioning copy · ✅ press-logo grid (when coverage exists) · ✅ audience specificity («Built for portfolios above $X across 3+ brokers») · ⛔ **hard-block:** Range's «financial advice / thought partner / modern financial advice» register is Lane A violation territory. **Use visual richness; NEVER import copy register.**

### 8. public.com (closest direct competitor — chat+trade)
**Hero:** «Investing for those who take it seriously» — sub-features stacked (Multi-asset investing · AI Agents · 3.3% APY on cash). CTAs: Get started + nav-as-CTA (Stocks/Bonds/Treasuries/Options/Crypto/ETFs). Visual: portfolio-transfer promo banner (1% uncapped match).
**Sections (~7):** Nav (mega-menu) · Hero + floating promo · AI features · Active trading · Specialized features · Security/trust · CTA + footer.
**Heads verbatim:** «AI for investors» · «Bring AI into every part of your investing experience» · «Agents» · «Market briefing» · «Key moments» · «The new standard. For active trading.» · «Trade options. Earn rebates.» · «The lowest margin rates. Period.» · «Five nerdy features you'll love.» · «Secure by design. Transparent by choice.» · «Have an account valued at $500,000 or more?» · «Transfer your portfolio. Earn an uncapped 1% match.».
**Copy:** benefit+explanation, credential+proof («10K+ reviews»), superlative+comparison («lowest base rate»), feature-first technical («agentic brokerage / tax-loss harvesting / direct indexing»).
**Visuals:** 6 feature cards · 3 active-trading images · 5 secondary features with visuals · mobile variants · bg assets (security/CTA) · calculator visuals (Treasury yield / margin interest / HYSA).
**For Provedo:** ✅ **«Investing for those who take it seriously» framing** — declarative-noun + audience-specific (Provedo equivalent: «For investors holding across more than one broker.») · ✅ AI-Agent-as-feature naming validates Provedo's named-agent approach · ✅ «Market briefing / Key moments» nomenclature family (→ «Insight of the week / What changed») · ❌ superlative claims register · ❌ «agentic brokerage / direct indexing» term-density.

---

## Cross-landing pattern matrix

| Pattern | claude | cursor | linear | vercel | stripe | perplexity | range | public | Freq | For Provedo? |
|---|---|---|---|---|---|---|---|---|---|---|
| Imperative-led hero headline | n | n | n | YES | YES | YES | n | n | 3/8 | n (PO-locked hero) |
| Stacked product mockups in hero | n | YES (3) | YES (3) | partial | n | unknown | YES (1) | YES (1) | 4/8 | **YES — adopt** |
| Capability-statement section heads | partial | YES (all) | YES (all) | YES | partial | unknown | n | partial | 4/8 | **YES — rewrite §2/§3/§4** |
| Inline data viz in product cards | YES | n | YES | partial | YES | unknown | YES | partial | 5/8 | **YES — replace placeholders** |
| Logo carousel/marquee | n | n | n | n | YES | unknown | YES (press) | n | 2/8 | **YES — confirm marquee** |
| Numeric proof in heads/subs | n | YES | YES | YES (heavy) | YES (heavy) | unknown | partial | YES | 6/8 | **YES — add proof bar** |
| Verbatim user testimonials | n | YES (4+) | YES | n | YES (4) | unknown | YES (4) | partial | 4/8 | **YES — placeholder slot** |
| Editorial mid-page block | n | YES (research timeline) | n | n | YES (Book of week) | YES (PP Editorial type) | YES (FAQ) | n | 4/8 | **YES — promote §3 mid-page** |
| Problem-negation positioning | n | n | YES (implicit) | n | n | unknown | YES (explicit) | n | 1–2/8 | **YES — Lane A as copy** |
| Tabbed use-case demos | YES | partial | n | YES | n | unknown | n | n | 2/8 | **YES — already in §2** |
| Bento grid product cards | n | n | n | partial | YES | unknown | n | partial | 1/8 | maybe (replace tabs) |
| Single mega-CTA pre-footer | partial | partial | YES | YES | YES | unknown | YES | YES | 6/8 | **YES — redesign §5** |
| Dual-CTA only in hero | YES | YES | n (4 stack) | YES | YES | unknown | n (3 stack) | n | 4/8 | **YES — collapse hero CTAs** |
| Animation/motion on hero | unknown | YES | YES | YES (Runway) | YES (wave) | unknown | partial | n | 5/7 known | **YES — subtle motion on stacked mocks** |
| Photography of people | n | YES | partial (avatars) | n | YES (street) | unknown | YES (4) | n | 3/8 | n (data-product) |

**Frequency reading:** 6/8 patterns appearing in ≥4 strong-tier landings = baseline for «not пустовато». Provedo v1 hits 1/8 of the high-frequency patterns (tabbed demos, partial). Gap = ~5 patterns to close.

---

## 5 visual patterns Provedo should adopt (specific spec for product-designer)

### V1. Stacked 3-mockup hero (Linear pattern)

**What:** Three Provedo UI surfaces layered with offset + soft shadow:
- Foreground (largest, ~70% width, full opacity): Chat surface — user message «Why is my portfolio down this month?» + Provedo answer with inline P&L chart
- Mid-layer (offset top-right, ~50% width, slightly faded): Insight feed — weekly observations list
- Back layer (offset top-left, ~45% width, more faded): Cross-broker aggregation view (IBKR + Schwab pie)

**Spec:**
- Bg `#FAFAF7` (Direction A locked)
- Card surfaces: white `#FFFFFF` with subtle shadow `0 8px 24px rgba(15,23,42,0.06)` + `0 2px 4px rgba(15,23,42,0.04)`
- Border: 1px `slate-200`
- Border-radius: 12px (premium tool register, not 4–6 commodity)
- Stack offset: 24–32px x/y between layers
- Subtle parallax on scroll (compositor-friendly transform only, ≤4px)
- Reduced-motion: static stack, no parallax

**Why:** Single-mockup hero reads template. 3-stack reads «multiple product surfaces, real depth.» Direct fix for «пустовато».

---

### V2. Inline real charts in §2 demo tabs (Linear + Range pattern)

**What:** Replace `*[Chart of monthly P&L, sources cited inline.]*` placeholder with hand-designed actual chart inside the chat-message bubble.

**Spec per tab:**
- Tab 1 (Why?): Inline sparkline P&L, slate-700 stroke, teal-600 emphasis on drawdown points. Below: 2-line position breakdown. ~280px tall.
- Tab 2 (Dividends): Inline 3-month calendar grid — each cell = ex-div date with ticker + amount. Mono-font ticker (JetBrains). ~200px tall.
- Tab 3 (Patterns): Inline trade timeline — horizontal axis = months, sell-points marked teal, 8-week-after marks slate-400. ~240px tall.
- Tab 4 (Aggregate): Inline allocation pie + per-broker bar split. ~280px tall.

**Why:** Linear and Range demonstrate that strong-tier financial-data products treat charts as part of the design system, not afterthoughts. Provedo currently has zero rendered charts.

---

### V3. Numeric proof bar (Vercel + Stripe pattern)

**What:** Single horizontal strip between hero and §2, three numeric proof points, mono-font numbers.

**Spec:**
- Bg subtle: `oklch(98% 0 0)` (slightly cooler than page bg for delineation)
- 3 columns, divider between
- Format per cell: `1000+` (big mono number, slate-900) + `brokers and exchanges` (small uppercase tracked, slate-500)
- Suggested cells: «1000+ brokers and exchanges» · «Every observation cited» · «$0 / month free forever»
- Height: 96–120px
- Typography: JetBrains Mono for numbers (per type-lock); Inter for labels

**Why:** 6/8 strong-tier landings use numeric proof in heads/sub-heads. Provedo has zero. Smallest visual addition with biggest density payoff.

---

### V4. Editorial mid-page narrative block (Stripe «Book of the week» + Cursor research timeline pattern)

**What:** §3 mid-page narrative («Your portfolio lives in seven places…») gets full-bleed editorial treatment.

**Spec:**
- Full-bleed surface, bg `slate-900` OR `oklch(28% 0 0)` (warm dark, not pure black) — single dark surface in otherwise-light page = drama
- Text color: `#FAFAF7` (page bg becomes text color — design-system reciprocity)
- Headline («One brain. One feed. One chat.»): Inter, 64–88px, `tracking-tight`, weight 500
- Body paragraph: 24–28px Inter, weight 400, line-height 1.5, max-width 56ch
- Closing line («Provedo sees what you hold and notices what you'd miss.»): Inter italic 32px, teal-400 accent on «notices what you'd miss»
- Generous vertical padding: 120–160px top + bottom

**Why:** Single dark editorial section breaks page rhythm + earns the «brand-world narrative» the copy deserves. Currently the §3 mid-page is buried as paragraph text.

---

### V5. Pre-alpha testimonial slot (Cursor + Linear + Range + Stripe pattern — universal)

**What:** A 3-card horizontal row between §3 and §4 with placeholder testimonial structure, ready for real quotes once alpha-tester pool produces them.

**Spec per card:**
- Card bg: white, shadow as V1
- Quote: 18px Inter, weight 400, ~3–4 lines max
- Attribution: 14px Inter, weight 500 («First name L.») + 13px Inter slate-500 («Portfolio across IBKR + Schwab · Boston»)
- No headshots in v2 (Provedo is data-product; faces not load-bearing — also avoids stock-photo cliché)
- Optional: tiny mono ticker icon top-right indicating user's primary broker

**Pre-alpha state:** Cards rendered with structurally-real but copy-blank quotes (e.g., «"I caught a dividend I would've missed in the second week." — Alex K., Plus user, Jan 2026»). Real quotes swap in post-alpha.

**Why:** Even placeholder structure signals «this is a real product with real users.» Empty-of-testimonials pre-launch landings read more «пустовато» than the structure with anchor quotes.

---

## 5 copy patterns Provedo should adopt (specific spec for content-lead)

### C1. Capability-statement section heads (Cursor + Linear pattern)

**What:** Rewrite every section head from descriptive → capability-claim, present-tense, verb-led.

**Audit + rewrite proposal:**

| Current §head | Pattern critique | Rewrite (allowlist-clean) |
|---|---|---|
| §2: «Ask on your actual holdings.» | imperative — works | KEEP |
| §2 sub: «Four things Provedo can do on what you really own.» | descriptive «can do» | «Four answers Provedo finds in your real positions.» |
| §3: «A few minutes a week. Everything that moved.» | descriptive (poetic — works) | KEEP |
| §3 sub: «Provedo surfaces dividends, drawdowns…» | already capability-led | KEEP |
| §3 mid: «One brain. One feed. One chat.» | declarative — works | KEEP |
| §4: «One chat holds everything.» | capability-led | KEEP |
| §4 sub: «1000+ brokers and exchanges, in one place — Provedo reads them all.» | capability-led | KEEP |
| §5: «Ready when you are.» | conversational | «Open Provedo when you're ready.» (matches imperative register of §1 Ask Provedo) |

**Net change:** §2 sub + §5 head only. Most copy is already strong on this dimension — content-lead's draft is more coherent than expected; the «пустовато» is **visual**, not copy.

**Guardrail check:** all proposed rewrites use allowlist verbs (finds / surfaces / holds / reads / open). Zero advice/recommendation/strategy. PASS.

---

### C2. Numeric proof inline in section sub-heads (Vercel + Stripe pattern)

**What:** Add numeric-anchor parenthetical or trailing clause to each section sub.

**Spec:**

| Section | Add to sub |
|---|---|
| §2 sub | «Four answers Provedo finds in your real positions. **Every answer cites its source.**» |
| §3 sub | «Provedo surfaces dividends, drawdowns, concentration shifts, and events — once a week, in one feed, **not scattered across seven broker emails.**» (already has the «seven» — promote it: bold or split as proof) |
| §4 sub | «**1000+** brokers and exchanges, in one place — Provedo reads them all.» (already has it — keep, just confirm visual weight on the number) |

**Why:** Numbers and plurals are visual anchors. Provedo has them in §3+§4 already; §2 sub lacks one. Add «Every answer cites its source» — turns guardrail into proof.

---

### C3. Problem-negation positioning copy (Range pattern, Lane-A-aligned)

**What:** Net-new section between §1 and §2, single full-bleed strip, three negation lines.

**Spec:**

> Provedo is not a robo-advisor. It is not a brokerage. It will not tell you what to buy.
>
> Provedo holds your portfolio across every broker, answers your questions about what you own, and surfaces what you'd miss. With sources for every observation.

**Why:** Range demonstrates problem-negation drives positioning home for fintech audiences burned by advisor-paternalism. Lane A guardrails *are already* a negation; promoting them to positioning copy (not just compliance footer) is the single highest-leverage copy move.

**Guardrail check:**
- «Not a robo-advisor / not a brokerage / will not tell you what to buy» = explicit disclaim, allowlist-compatible
- «Holds / answers / surfaces» = allowlist verbs
- «Sources for every observation» = trust anchor
- PASS all 5 guardrails.

---

### C4. Verbatim alpha-tester quote framing (Cursor + Linear + Stripe pattern)

**What:** Pre-alpha placeholder quote structure (paired with V5 visual spec).

**Spec template:**

> «\[1 sentence about the noticing — what they almost missed\]. \[1 sentence about the cite-trail or context\].»
> — First-name L., \[Plus / Free\] user, \[primary broker\] + \[secondary broker\] · \[city or region\]

**Three placeholder quotes (structurally real):**

1. «I caught a dividend payment in the second week I would have missed across three brokers. The cite trail showed me exactly where it was scheduled.» — Alex K., Plus user, IBKR + Schwab · Boston
2. «Provedo noticed I'd been selling Apple within days of every dip for over a year. It just showed me the pattern. No advice, no judgment.» — Maria S., Free user, Fidelity + Robinhood · Austin
3. «I check the weekly feed for five minutes Sunday morning. Everything that moved is in one place. That's the whole product for me.» — David R., Plus user, IBKR · Berlin

**Guardrail check:** quotes echo allowlist verbs (caught / noticed / showed / moved). One quote (#2) uses «no advice, no judgment» — disclaim register, mirrors §2 Tab 3 line. PASS.

---

### C5. Audience-specificity micro-copy (Public + Range pattern, Provedo-translated)

**What:** Single line near hero or in proof-bar that names the ICP without paywalling it.

**Spec options (PO calls):**

- A: «For investors holding across more than one broker.»
- B: «Built for portfolios that don't fit in one app.»
- C: «For people who own things in seven places and want to think about them in one.»

**Recommendation:** B is most Sage-register; A is most concrete; C is most brand-world (echoes §3 mid-page «seven places» motif).

**Guardrail check:** all three avoid advice register. PASS.

---

## 3 anti-patterns to avoid

### A1. Range's advisor-paternalism register

«Modern financial advice, built just for you» / «Your thought partner» / «Discover upside in any scenario» — Range gets away with this because they're a registered investment advisor. Provedo cannot import any of this register without violating Lane A regulatory positioning. **Use Range's visuals + problem-negation pattern; never import its advisory tone.**

### A2. Public's feature-density / mega-menu nav

7 product categories + 5 secondary features + active-trading callouts + API + margin rates — reads cluttered, brokerage-supermarket. Provedo's narrower MVP scope (US retail HNW, single use case = portfolio observation) cannot carry that density without reading like an unfinished version of Public. **Land at 8–9 sections, not 13.**

### A3. Generic globe / network-node hero visualizations (Vercel)

Vercel's globe + network-activity hero is brilliant *for Vercel* (CDN-edge product). For Provedo, importing «globe with connection lines» visualization risks (a) reading sky-blue tech-cliché (Direction A anti-pattern), (b) suggesting Provedo *is* a broker integration platform (it consumes broker APIs but the user-value is observation, not network-routing). **Stick to product-surface mockups + financial data viz.**

---

## Recommended landing v2 structure

**Target:** 8–9 sections (matches Linear/Vercel/Stripe midpoint), 5 high-frequency patterns added.

**Section list with copy/visual notes:**

### S1. Hero
- Copy: PO-locked. Headline + sub + primary CTA (Ask Provedo).
- **Change:** collapse triple-CTA stack → primary CTA + single text-link («or start free forever» — strip the trial card-required line into hover/footnote).
- **Visual ADD (V1):** stacked 3-mockup. Chat-surface foreground + insight-feed mid + cross-broker back. Subtle parallax on scroll.

### S2. Numeric proof bar (NEW)
- Copy: «1000+ brokers and exchanges» · «Every observation cited» · «$0 / month free forever»
- **Visual ADD (V3):** thin horizontal strip, mono numbers, slate-on-cool-bg.

### S3. Problem-negation positioning (NEW)
- Copy: «Provedo is not a robo-advisor. Not a brokerage. Will not tell you what to buy. / Holds your portfolio across every broker, answers your questions about what you own, surfaces what you'd miss. With sources for every observation.»
- Visual: type-led, no mockup. Generous vertical padding. Slate-900 text on `#FAFAF7`. Optional small Provedo wordmark above.

### S4. Demo tabs (KEEP §2 — promote visual)
- Copy: rewrite §2 sub per C1+C2. Tab content as locked.
- **Visual ADD (V2):** real charts inside chat bubbles, not bracketed placeholders. Each tab gets its own data viz language consistent across all four (slate-700 stroke + teal-600 emphasis + JetBrains Mono for numbers).

### S5. Insights / Pattern recognition (KEEP §3)
- Copy: as locked. C2 minor tweak to sub (bold the «seven broker emails»).
- **Visual:** bullet list with small icon per bullet — minimal iconography, monoline, slate-500.

### S6. Editorial mid-page narrative (PROMOTE §3 mid-page → full-bleed)
- Copy: as locked.
- **Visual ADD (V4):** full-bleed dark surface, big editorial typography, teal-400 accent on closing line. Single dramatic break in light-toned page.

### S7. Alpha-tester testimonials (NEW)
- Copy: 3 placeholder quotes per C4.
- **Visual ADD (V5):** 3-card row, white cards on `#FAFAF7`, no headshots, mono ticker icon top-right.

### S8. Aggregation marquee (KEEP §4)
- Copy: as locked. Confirm fallback («Hundreds of brokers…») triggers if 1000+ unverified.
- **Visual:** scrolling marquee, monochrome logos slate-700, animated infinite scroll. Direction left-to-right OR right-to-left consistent.

### S9. Pre-footer CTA (REDESIGN §5)
- Copy: «Open Provedo when you're ready.» + single primary CTA + small-print line.
- **Visual:** full-bleed editorial CTA panel — same dark surface as S6 (visual rhyme), single button, no triple-stack.

### S10. Footer disclaimer (KEEP §6)
- Copy: as locked.

**Section count:** 10 incl. footer. Within strong-tier 8–12 range. Density-rich enough to read «strong tier», not so dense it reads Public.com-cluttered.

---

## Limitations / honest expectations

- **Perplexity main page (`perplexity.ai`)** returned 403 across all attempted variants. Recommendations on Perplexity grounded in their Comet sub-landing + Framer case study + design-team interview. Direct hero-anatomy verbatim copy NOT captured. Lapa Ninja review confirms PP Editorial New + FK Grotesk type pairing (which we cannot adopt anyway under Direction A type-lock); design-philosophy quote («clean, smart, sharp») informs aesthetic register only.
- **Animations / motion / micro-interaction details** are inferred from structural HTML + alt text + known-pattern recognition — WebFetch returns markdown, not visual playback. All motion specs above are recommendations, not direct observations.
- **Claude.ai original homepage** returned 403; followed redirect to `claude.com/product/overview` which is the same hero ecosystem, captured cleanly. Confidence high.
- **Cursor mobile-agent / desktop interactive demo** — captured structurally but not interactively. Visual richness density-score read directly from element count + alt text patterns.

**Net confidence:** 7/8 landings high-confidence; Perplexity medium (proxy + interview rather than direct fetch). Pattern matrix + recommendations remain robust because high-frequency patterns (numeric proof, capability heads, stacked mockups, editorial blocks) appeared in ≥4 of 7 directly-fetched landings before Perplexity is even counted.

**END strong-competitor-landing-audit.md**
