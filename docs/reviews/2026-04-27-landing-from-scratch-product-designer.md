# Provedo Landing — From-Scratch Vision (Product Designer)

**Date:** 2026-04-27
**Author:** product-designer
**Status:** Vision draft for right-hand synthesis
**Brief:** Throw out current landing. Design new landing for chat-first AI portfolio assistant. Pre-alpha.

---

## 1. The one big move

**"The Ledger That Talks."**

The signature visual identity is a **two-pane editorial document** — left pane is the user's portfolio rendered as a quiet, typeset *financial ledger* (Inter + JetBrains Mono, generous whitespace, monochrome with one teal accent line); right pane is a **persistent, breathing conversation** that annotates the ledger in real time. The whole page reads like *the Financial Times redesigned by a calm AI* — not a SaaS dashboard, not a chatbot demo. A reader scrolls and the conversation on the right responds to whatever's in view: a position, an allocation drift, a dividend coming up. The ledger is the body of the page; the assistant lives in the right margin like a smart annotator with a teal pen.

This is the move because every fintech-AI landing in 2026 either (a) shows a fake hero chat in a glass box ("Anthropic-lite") or (b) shows a hero dashboard screenshot ("Linear-lite"). Provedo's product is *neither*. It's an assistant *for* a portfolio you already have. The landing should literally show the relationship — not the chatbox alone, not the dashboard alone, but the **conversation grafted onto the document**. That asymmetric two-pane rhythm carries the entire page; it's the thing nobody else is doing.

Atmosphere: warm cream paper, slate ink, one teal pen-mark. No gradients on UI surfaces. No glass panels. Subtle paper grain on the cream background (3% noise SVG). Type is the hero — the page should feel like a printed quarterly review that woke up.

---

## 2. Reference cluster

| # | Reference | URL | One-line takeaway |
|---|---|---|---|
| 1 | **Stripe Press** | https://press.stripe.com | Editorial typography on a single warm-paper page; restraint = trust |
| 2 | **Granola** | https://www.granola.ai | "Document + AI in margin" pattern done well; meeting notes annotated by AI |
| 3 | **Anthropic (Claude.com)** | https://www.claude.com | Calm corporate confidence; restrained palette; AI without "AI gradient" cliché |
| 4 | **Linear** | https://linear.app | Hero composition discipline; product screenshot as protagonist with no clutter |
| 5 | **Mercury** | https://mercury.com | How fintech earns trust visually — typography first, decoration last |
| 6 | **Cursor** | https://www.cursor.com | "Show the product doing the thing" hero — autonomous, in-line, unmistakable |
| 7 | **Lovable** | https://lovable.dev | Live, deterministic hero animation that demonstrates value in 4 seconds |
| 8 | **Origin (origin.com)** | https://www.useorigin.com | Wealth product done in a calm, editorial register — closest analog in fintech |
| 9 | **Apple Intelligence page** | https://www.apple.com/apple-intelligence | How to talk about AI without saying "AI" thirty times |
| 10 | **Are.na** | https://www.are.na | Editorial-scrolly tone; serif headline + plain prose doing all the work |

Cuts I deliberately did **not** reference: Vercel (too "developer-tool"), MidJourney (wrong archetype, fantasy), every "agent platform" with purple aurora gradient (banned), Robinhood / eToro (bro-finance), most Awwwards-winning fintech (over-animated, low trust signal).

---

## 3. Section list (8 sections, top to bottom)

1. **Sticky thin header** — wordmark left, two links (Pricing, Sign in) right. No nav cruft.
2. **Hero: The Ledger That Talks** — locked headline + sub, two-pane editorial composition (ledger left / live conversation right), single primary CTA.
3. **The five questions section** — five large-typography questions a real investor asks, each with a one-line "Provedo answers in seconds, with citations" payoff. Anti-feature-grid; reads like a manifesto.
4. **How it works (3 steps, horizontal scrolly)** — Connect brokers → Ask anything → Get answers with sources. Not numbered cards — a horizontal storyline that scrubs as you scroll.
5. **The brokers panel** — quiet logo wall of supported brokers (US / EU / Crypto), grouped by region. One sentence: "One conversation across all of them."
6. **Trust band** — what Provedo will and **will not** do. Two columns. Honest. This is the trust earner; replaces the "testimonials we don't have."
7. **Pricing teaser** — three tiers as a single horizontal strip, link to /pricing for detail. No comparison table on landing.
8. **Closing CTA + footer** — one line, one button, then the footer with disclosures.

That's it. No "Built by ex-..." credibility brag, no FAQ, no logo carousel of brokers we don't actually integrate with, no fake testimonial placeholder. **Eight sections, ~3,200px tall on 1440 desktop.**

---

## 4. Hero composition (detailed)

**Goal:** in 4 seconds the visitor understands "this is an assistant that reads my whole portfolio and talks to me about it." Not "another dashboard," not "another chatbot."

### Layout (1440 desktop)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PROVEDO                                       Pricing   Sign in           │  ← 56px sticky header, hairline border bottom
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   PROVEDO WILL LEAD                  ┌─ portfolio.ledger ──────────┐       │
│   YOU THROUGH YOUR                   │                             │       │
│   PORTFOLIO.                         │  IBKR · US           $312k  │       │
│                                      │  Trading 212 · EU     €84k  │       │
│   Notice what you'd miss             │  Kraken · Crypto      $19k  │       │
│   across all your brokers.           │  ─────────────────────────  │       │
│                                      │  Total                $431k │       │
│   ┌─────────────────────┐            │                             │       │
│   │  Try the demo  →    │            │  Top drift: NVDA  +4.2pp ◐  │       │
│   └─────────────────────┘            │  Dividends Apr 28: $312     │       │
│   No card. Read-only.                │  Currency exposure: 71% USD │       │
│                                      └─────────────────────────────┘       │
│                                                                            │
│                                      ┌─ assistant ────────────────┐        │
│                                      │ ↳ "Why is NVDA flagged?"   │        │
│                                      │                             │        │
│                                      │ Your target was 12% NVDA.   │        │
│                                      │ It's now 16.2% — drift of   │        │
│                                      │ +4.2pp from a 38% rally     │        │
│                                      │ since Feb. ¹                │        │
│                                      │                             │        │
│                                      │ ¹ IBKR · positions · today  │        │
│                                      └─────────────────────────────┘        │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Hierarchy & type

- **Headline:** Inter Tight 700, `clamp(56px, 6vw, 96px)`, leading-[0.95], slate-900 ink, optical kerning. Sits at top-left of left column. Three lines, hard line-breaks at "LEAD / THROUGH YOUR / PORTFOLIO" — typeset like a magazine cover.
- **Sub-headline:** Inter 400, `clamp(20px, 1.6vw, 26px)`, leading-snug, slate-700, max 28ch wide. 32px below headline.
- **CTA:** Filled teal-600 button, slate-900 text, 56px tall, 24px horizontal pad, 6px radius (just barely soft). Hover: ink-fill animation from left to right (200ms, ease-out-expo), label flips to white. Below CTA: `Inter 14 / slate-500` legal whisper "No card. Read-only access. 2 minutes."
- **No secondary CTA in hero.** A second CTA dilutes the page's only job. "Sign in" lives in the header for returning users.

### Right pane (the protagonist)

The right pane is **two stacked editorial cards**, not glass, not a phone mockup, not a browser chrome screenshot. Cards are warm-cream surfaces with a 1px slate-200 border, 8px radius, generous interior padding (32px). Each card has a tiny lowercase mono label in the top-left (`portfolio.ledger`, `assistant`) — labels in JetBrains Mono 12, slate-400.

**Top card: the ledger.** A condensed snapshot of a (fictional but realistic) multi-broker portfolio. Three brokers across regions, totals in JetBrains Mono with tabular figures, then three "noticed" items below the totals — exactly the things a self-directed investor would never see across-brokers without effort. The drift number `+4.2pp` is highlighted with a **teal underline** (the "pen mark"). This is the only color in the hero besides the CTA.

**Bottom card: the assistant.** The conversation card answers the question implied by the highlighted drift. Question is in mono prefixed with `↳`, answer is in Inter — *deliberately mixing* monospace question with sans-serif answer to make the assistant feel literate, not robotic. The footnote `¹ IBKR · positions · today` is a real citation chip — slate-100 background, 3px radius, 11px mono. **This citation chip is the trust signal of the entire page.**

### Motion (4-second loop, runs once on load, then idle)

Time `t` in seconds:
- `0.0s` — page loads. Headline fades in (200ms).
- `0.3s` — sub fades in (200ms).
- `0.5s` — left pane CTA fades in.
- `0.8s` — ledger card fades + slides 8px up (300ms ease-out-expo). Numbers count up from 0 to final values (400ms, monospace tabular, eases via custom counter — values look "real").
- `1.6s` — `+4.2pp ◐` line gets its teal underline drawn left-to-right (350ms).
- `2.2s` — assistant card appears empty with mono cursor pulsing.
- `2.6s` — user "types" `↳ Why is NVDA flagged?` (mono, character-by-character, 35ms/char).
- `3.5s` — short typing-dot pause (400ms).
- `3.9s` — answer streams in word-by-word (Inter, ~50ms/word) like a real LLM.
- `5.5s` — citation chip fades in (200ms). Loop ends in idle state.
- After 12s of idle, optional: cursor moves to a different highlighted ledger row, asks a different question. Cycles three preset Q&A pairs. Pause on hover. Stop entirely on `prefers-reduced-motion`.

Reduced-motion fallback: all elements appear in final state immediately. Citation chip visible. No counter animation. No streaming.

### Atmosphere

- Background: `#FAFAF7` warm cream with a 3% multiply-blend noise SVG layer (paper grain). Imperceptible up close, gives the page weight when you scroll.
- Above the hero, a *very* subtle radial wash from top-left: `radial-gradient(ellipse at top left, rgba(13,148,136,0.04), transparent 60%)`. This is the only "atmosphere" — no gradient mesh, no aurora, no orb.
- A single hairline divider (`1px slate-200`) below the header.
- No floating shapes. No hero illustration. The two cards *are* the hero illustration.

### What the hero is NOT

- Not a phone mockup
- Not a Chrome browser frame
- Not a glass panel
- Not a 3D iPhone
- Not a video loop of "scrolling through an app"
- Not a "watch demo" button
- Not a logo cloud directly under the fold

---

## 5. Body sections (one paragraph each)

### Section 3 — The Five Questions

Full-bleed cream section, 240px top padding. A single column, max-width 880px, centered. Five questions stacked vertically, each in **Inter Tight 600 at 48px / leading-tight**, slate-900. Beneath each question, in slate-500 Inter 400 at 18px, a one-line answer-promise. Each question has a small left gutter with an animated teal vertical line (1px) that "draws down" as the question scrolls into view (IntersectionObserver, 400ms ease-out). Questions:

1. *"How exposed am I to a single stock across all my brokers?"* → Aggregated in seconds, with sources.
2. *"What dividends are landing this month?"* → A unified calendar, no spreadsheet.
3. *"Where is my portfolio drifting from my target?"* → Drift detection across accounts, cited.
4. *"What did I sell at a loss this year, for tax?"* → Realized P&L, ready for export.
5. *"What changed since I last looked?"* → A daily digest in plain English.

This section replaces "feature grid." Rhythm-broken by intentionally not being a grid. Reads like a manifesto / Q&A pull-quote spread from a magazine.

### Section 4 — How it works (horizontal scrolly)

Full-viewport-height pinned section. As you scroll, the page locks and a horizontal sequence advances through three states: **Connect** → **Ask** → **Verify**. Left half is a sticky illustration (ledger + assistant cards, same vocabulary as hero). Right half is a description that updates per state. No gimmicky 3D — just clean state transitions of the same two-pane composition we established in the hero. Each state takes ~80vh of scroll. Total: 240vh of scroll mapped to 3 states. On mobile, this collapses to three vertically stacked frames with native scroll. (Implementation: GSAP ScrollTrigger or Framer Motion `useScroll`. Reduced-motion fallback: all three states shown stacked, no pinning.)

### Section 5 — The brokers panel

Quiet section. Left column: the line **"One conversation across all of them."** in Inter Tight 600, 36px. Right column: a 4-column grid of broker logos grouped by region tags (US, EU, Crypto). Logos are monochrome slate-400 by default, slate-900 on hover (200ms). Region labels in JetBrains Mono 11px uppercase. No marquee, no auto-scroll carousel. Just a calm wall. Below the wall, a small line: *"More integrations every week. [See roadmap →]"* — sets expectations honestly for pre-alpha.

### Section 6 — The trust band ("What Provedo will and won't do")

Two-column section on cream background, with a deliberate **slate-900 inverted band** treatment — the only inverted (dark) section on the page, used to signal weight. Left column header: **"What Provedo does."** Right column header: **"What Provedo doesn't."** Six items each, in Inter 18px slate-100 (left) / slate-500 (right). The right column is *deliberately* shown in muted color to visually demote what's not promised. Examples on the "doesn't" side: *won't recommend trades · won't move your money · won't sell your data · isn't an advisor*. This section does the work that "fake testimonials" usually do on pre-alpha pages: it earns trust by being honest about scope. Inverted treatment makes it feel like fine print made unfine — a feature, not a disclaimer.

### Section 7 — Pricing teaser

Single horizontal strip. Three pill-shaped cards side by side, each containing tier name + one-line value + price. No feature checklists, no comparison matrix. CTA at the end of the row: *"See full pricing →"* linking to `/pricing`. Cards are cream with slate-200 border; the recommended tier (middle) has a teal-600 1px border and a tiny mono label `most chosen` in the top-right corner. Restraint here is intentional — pricing is not a hero, it's a check-the-box.

### Section 8 — Closing CTA + footer

Full-bleed cream. Single line of Inter Tight 600 at 64px, centered: **"Start with one broker. See what you've been missing."** Below it: the same teal CTA from the hero. Below that: a small footer with disclosures, social links, copyright, and the legally-required "Provedo is not an investment advisor" line in slate-500 12px. Footer height: 200px max. No fat newsletter capture, no four-column footer link farm.

---

## 6. What's NOT on the page (explicit cuts)

Cuts vs. typical fintech / AI landing:

- **No glass / glassmorphism.** Trust signal kill.
- **No aurora gradients, no purple-pink AI mesh, no animated orb.** ui-ux-pro-max flagged this as banned for fintech/trust products; I agree.
- **No 3D iPhone mockup.** The product is a web chat; a phone mock lies.
- **No "trusted by" logo cloud.** Pre-alpha. We don't have logos. Inserting fake ones is dishonest and we'd lose the legal/finance reviewers' trust.
- **No testimonial section.** Pre-alpha. Quotes would be fake or staff. Don't fake.
- **No FAQ accordion.** A landing isn't a help center. Move FAQ to /pricing or /faq.
- **No "Built by ex-Stripe / ex-Google" credibility brag.** Cliché; the page should earn trust via honesty, not by name-dropping.
- **No video.** Video shifts CWV badly, and the live hero animation IS the video.
- **No "watch a demo" CTA.** The product *is* the demo on this page.
- **No newsletter capture in footer.** Pre-alpha — we don't have a newsletter rhythm yet. Don't promise one.
- **No comparison table** ("Provedo vs Robo-advisors"). Off-tone for a calm assistant.
- **No nav links besides Pricing + Sign in.** Marketing nav inflation kills focus.
- **No second hero CTA** ("learn more / watch video"). One CTA, one job.
- **No "AI-powered" anywhere in copy.** The page demonstrates it; it doesn't have to brag.
- **No emoji icons.** SVG only (Lucide / Heroicons).
- **No dark mode at launch.** Cream + slate is the brand register; a dark variant dilutes positioning. Add post-launch if data demands.

Cuts vs. likely *current* landing (inferred — I have not read the existing brief):

- Drop any "feature grid" of 6+ tiles
- Drop any "metrics bar" ("$X tracked · Y users · Z brokers") — pre-alpha, numbers would be dishonest or trivial
- Drop any "as seen in" press cluster
- Drop any product walk-through carousel longer than 3 frames

---

## 7. Effort estimate

### Product Designer hours (me, post-vision)

| Workstream | Hours |
|---|---|
| Section-by-section detailed specs (Figma-equivalent in markdown + asset list) | 14 |
| Type scale + spacing token additions to design-tokens package | 3 |
| Two-pane hero composition spec (timing curves, cursor states, idle loop, citation chip variants) | 8 |
| Horizontal scrolly section motion choreography (3 states × in/out timings) | 6 |
| Empty-states + reduced-motion variants for every section | 4 |
| Responsive breakpoint specs (320 / 375 / 768 / 1024 / 1440 / 1920) — including how two-pane collapses to single-column on <900px | 6 |
| A11y pass: contrast audit, keyboard flow, screen-reader labels, ARIA for live conversation region | 5 |
| Microcopy pass + handoff doc | 4 |
| **Total PD** | **~50 hrs / ~1.5 weeks at 70% utilization** |

### Frontend Engineer hours

| Workstream | Hours |
|---|---|
| Hero two-pane + scripted animation timeline (deterministic, reduced-motion-safe) | 18 |
| Citation chip + ledger card components (reusable) | 6 |
| Five-questions section with IntersectionObserver line-draw | 4 |
| Horizontal scrolly section (GSAP ScrollTrigger or Framer `useScroll`) — desktop pin + mobile fallback | 16 |
| Brokers panel with logo grid + grouping | 3 |
| Trust band inverted section | 3 |
| Pricing teaser strip | 4 |
| Closing CTA + footer | 3 |
| Paper-grain noise layer + atmosphere wash | 2 |
| Responsive QA (6 breakpoints) | 8 |
| A11y QA (axe + manual keyboard + reduced-motion + screen reader) | 6 |
| Performance pass (LCP / CLS / bundle budget) | 5 |
| **Total FE** | **~78 hrs / ~2.5 weeks at 70% utilization** |

### Combined timeline (sequential PD → parallel FE + PD-QA)

- **Week 1:** PD details + tokens
- **Week 2-3:** FE builds; PD reviews + QA-walks each section as it lands
- **Week 4:** A11y + performance + cross-browser + responsive polish; launch

**~3.5 weeks calendar** assuming one PD + one FE focused on this with normal interrupts. Faster if FE is dedicated.

---

## Risks (vision-level)

1. **Scrolly-pin section is the highest-risk piece.** ~20 of the 78 FE hours are in section 4 alone. Mobile fallback is mandatory and well-trodden, but the desktop pin must feel *butter-smooth*; a janky scrolly section actively damages trust on a fintech page. Mitigation: pre-validate with a one-day spike before committing to the pattern. Fallback: stack three frames vertically with non-pinned reveal.
2. **The "+4.2pp drift" example must be perfectly accurate finance.** The hero example needs review by the finance reviewer to make sure the math, vocabulary, and framing are bulletproof. A subtle finance error in the hero would torch trust faster than any design choice could rescue.
3. **Pre-alpha trust gap.** Even with the honest "What Provedo doesn't do" section, some visitors will bounce because there are no testimonials, no trusted-by, no SOC 2 badge yet. Mitigation: add a single line near the CTA: *"Read-only access. We can't move your money."* — stating the security posture in one breath.

---

## Appendix A — Token additions needed (semantic layer)

```json
{
  "color": {
    "ink": { "value": "{color.slate.900}" },
    "paper": { "value": "#FAFAF7" },
    "paper-grain": { "value": "rgba(15, 23, 42, 0.03)" },
    "pen": { "value": "#0D9488" },
    "pen-soft": { "value": "rgba(13, 148, 136, 0.08)" }
  },
  "type": {
    "display": { "fontFamily": "Inter Tight, Inter, sans-serif", "fontWeight": 700 },
    "body": { "fontFamily": "Inter, sans-serif", "fontWeight": 400 },
    "mono": { "fontFamily": "JetBrains Mono, monospace", "fontWeight": 400 }
  },
  "motion": {
    "ease-out-expo": { "value": "cubic-bezier(0.16, 1, 0.3, 1)" },
    "duration-quick": { "value": "200ms" },
    "duration-considered": { "value": "350ms" }
  }
}
```

(Inter Tight added as a display weight — currently only Inter is loaded. Subset both at preload to weights 400 / 600 / 700 only.)

---

## Appendix B — Open questions for right-hand → PO

1. Do we have permission to show real broker logos on the brokers panel, or do we need to use neutral wordmarks until partnerships are formalized?
2. The "What Provedo doesn't do" section commits us legally to those nots. Legal reviewer should sign off on the exact wording.
3. The hero's example portfolio (`$312k IBKR + €84k T212 + $19k Kraken`) — fine as illustrative? Or do we need to show smaller / more conservative numbers to match the ICP psychology better?
