# Hero ChatMockup Audit — 2026-04-27

**Author:** product-designer (right-hand dispatch — PO directive «доработать чат» landing-only)
**Scope:** `apps/web/src/app/(marketing)/_components/ProvedoHeroV2.tsx` lines 17–211 (constants + `useTypingSequence` + `TypingCursor` + `ChatMockup`)
**Out of scope (explicit):** `apps/web/src/app/(app)/chat/*` real product chat — separate concern per PO clarification 2026-04-27.
**Method:** Source read (full file) → reference comparison against R1 audit (`2026-04-27-ai-tool-landing-audit-product-designer.md`) → cross-check against §S4 demo-tab chat surface (`ProvedoDemoTabsV2.tsx`) which already ships the better-content treatment → 6-axis evaluation (content / visual polish / motion / length / interactivity / distinctiveness) → 3 proposals scoped against bundle budget (81kB headroom).
**Constraint inputs:** Design Brief v1.4 §0 + §3 + §4 · Brand v1.0 §6 verb-allowlist · 5 animation rules · Lane A bright-line · 60kB max bundle add per proposal.

---

## §1. Current state — what's actually shipping today

The hero ChatMockup is a **single-shot, hardcoded, two-bubble exchange** with typing animation. Architecture:

| Element | Current implementation | Line refs |
|---|---|---|
| Wordmark badge | `Provedo` in teal-600, text-xs, uppercase, tracking-widest, sits ABOVE the user bubble (chronologically wrong — wordmark is the responder, not the asker) | 121–127 |
| User bubble | Right-aligned, `--provedo-bg-subtle` fill, `--provedo-border-subtle` 1px, `rounded-xl` + asymmetric `rounded-tr-sm`, text-xs leading-relaxed, padding `px-3 py-2`, max-width 85% | 129–143 |
| User bubble placeholder | Plain greyed-out fragment `«Why is my portfolio…»` opacity 0.3 — sits in the bubble before typing starts | 140 |
| User question | `«Why is my portfolio down this month?»` — 36 chars | 17 |
| Provedo response bubble | Left-aligned, `--provedo-bg-elevated` fill, asymmetric `rounded-tl-sm`, same text size + padding as user bubble (no hierarchy distinction), gated to render only after `phase === 'response'` | 145–208 |
| Provedo response copy | `«You're down −4.2% this month. 62% of the drawdown is two positions: Apple (−11%) and Tesla (−8%).»` — 100 chars, one sentence | 18–19 |
| Inline P&L sparkline | 200×36 SVG, slate stroke + 2 red dots + `−4.2%` JBM-mono label at right edge, opacity 0.4 → 1 transition over 400ms once `phase === 'done'` | 164–206 |
| Typing speed user | 1500ms total ÷ 36 chars = ~41 ms/char | 50 |
| Typing speed Provedo | 2000ms total ÷ 100 chars = ~20 ms/char | 64 |
| Pause between bubbles | 600ms after user complete → start Provedo | 57 |
| Cursor | 2px wide × 0.85em tall teal-600 bar, blink 0.75s step-start infinite | 88–103 |
| Replay | **None.** Plays once on page-load (after 800ms initial delay), then static for the rest of the session. Refresh to see again. | 36–45 |
| Reduced-motion fallback | Both bubbles render fully populated immediately, sparkline at full opacity. No motion. ✓ | 29–34 |
| Accessibility | `aria-label="Provedo demo conversation"` on article · `aria-live="polite"` on response bubble · `aria-hidden="true"` on cursor | 113, 155, 92 |

**Net:** functional, accessible, respects reduced-motion, voice-correct, Lane A compliant. A solid v1. Not bad — but **markedly behind** the §S4 demo-tab chat treatment that already ships in the same page (which has source citations, mono-formatted tickers, neg/pos color tokens, four exchanges).

---

## §2. Six-axis evaluation

### §2.1 Content quality — score: 4/10

The user question and Provedo answer pair is **the second-weakest content slice on the entire page**, behind only the bracketed-placeholder content the redesign synthesis already flagged for replacement (R1 §4.R1 Granola pattern).

**Specific gaps:**

1. **No source citation.** §S4 Tab 1 — same exact P&L scenario — gets a `Sources:` line: «AAPL Q3 earnings 2025-10-31 · TSLA Q3 delivery report 2025-10-22 · holdings via Schwab statement 2025-11-01». The hero ChatMockup version omits it. The hero is the **highest-traffic surface on the page**. Citations are Provedo's load-bearing trust signal (Brand §6.5; Design Brief §0.3 «source citation treated as first-class content»). Missing here = brand-promise gap on first impression.
2. **No mono-formatted tickers / amounts.** §S4 wraps `Apple`, `−11%`, `Tesla`, `−8%`, `2025-10-31` in `<Mono>` and `<Neg>` components — visual signal that says «this is real data, not marketing copy». The hero ChatMockup ships them all as plain Inter — they **read as marketing prose, not product output**. Granola pattern (R1 §4.R1) lives or dies on this distinction.
3. **No event anchors.** §S4 names the events that caused the drawdown («after Q3 earnings on 2025-10-31», «after the 2025-10-22 delivery miss»). Hero version says «two positions: Apple (−11%) and Tesla (−8%)» — no «why». Reader gets numbers without context. The Provedo-promise is **«Notice what you'd miss»**, which is causal, not numerical — and the hero strips out the causal layer.
4. **Question is generic, not Provedo-specific.** «Why is my portfolio down this month?» works for any AI-portfolio tool. Compare R1 §4.R1's recommended example: «My VOO is down. Why is my portfolio still up this month?» — that question only Provedo can answer compellingly because it requires **multi-position synthesis across the portfolio**, which is the wedge. The current question doesn't surface the wedge.
5. **Answer length is half a Granola-grade response.** §S4 Tab 1 is ~290 chars including event anchors and sources; hero is 100 chars. The hero bubble has horizontal real estate for 2× this content.

**What's right:** the numerical specificity (−4.2%, 62%, −11%, −8%) is correct register and avoids the bracketed-placeholder problem. Content is Lane A clean (no advice verbs, no «recommends/suggests/should»).

### §2.2 Visual polish — score: 6/10

**Specific gaps:**

1. **Wordmark placement is chronologically wrong.** The «Provedo» badge sits at the top of the entire chat surface, BEFORE the user bubble. In every reference (Claude.ai, Anthropic claude-on-mars cards, Linear agent-execution log, ChatGPT Plus surface), the responder's name attaches to the **response bubble**, not floats above the entire conversation. §S4 `ProvedoBubble` does this correctly — places `Provedo` label above the response bubble inline. Hero version is **structurally inconsistent with the same component family** that ships 4 sections below.
2. **No bubble-shape hierarchy between user and Provedo.** Both bubbles are `rounded-xl` with asymmetric corner. Visually they have equal weight. Best-in-class (Claude.ai, ChatGPT, Anthropic conversation surfaces) gives the Provedo response **more visual weight** — wider, more elaborate inner content, sometimes a subtle border-left accent or a small avatar-disc. Current hero treats both bubbles as visual equals, which **flattens the demo's emotional arc** (question → revelation).
3. **Padding is too tight.** `px-3 py-2` (12px × 8px) on text-xs leading-relaxed reads cramped on a 420px-wide card. §S4 ships `px-4 py-3` (16px × 12px) on text-sm — measurably more breathable. Why is the hero version more cramped than the §S4 version? Likely an early-iteration leftover from before the typography was settled. Should match §S4 padding.
4. **Text size.** Hero is `text-xs` (12px); §S4 is `text-sm` (14px). For the **highest-traffic surface on the page**, 12px is too small — particularly for the demonstrative-content layer that needs to be readable at glance. R1 R1 (Granola pattern) is content-fidelity led: the reader **reads** the example, not skims past it. 12px depresses readability at typical desktop viewport distance.
5. **Sparkline is decorative, not informational.** The sparkline shows declining trend with two red dots and `−4.2%` label — but the text already says `−4.2%`. The two red dots aren't anchored to events (Q3 earnings, delivery miss). They're abstract «here are two bad days». **Wasted visual real estate** that could carry event labels (compare §S4 `PnlSparklineAnimated` which carries event timestamps).
6. **Asymmetric corner inversion is correct** (user bubble `rounded-tr-sm`, Provedo `rounded-tl-sm`) — preserves bubble-from-side reading. ✓ This one's right.
7. **Border on user bubble is unnecessary.** User bubble has `--provedo-bg-subtle` fill AND a 1px `--provedo-border-subtle` border — the contrast between fill (`#F1F1ED`) and the surrounding card bg (`#FFFFFF`) already provides enough separation. The 1px border adds noise. §S4 keeps the border, but visually it works there because the surrounding section bg is `--provedo-bg-page` (`#FAFAF7`), not `--provedo-bg-elevated` (white). Hero is rendered ON `--provedo-bg-elevated` (the white card), so the user bubble's `--provedo-bg-subtle` is already a strong tonal step — border is redundant.
8. **Box shadow is correct.** `0 8px 24px rgba(15,23,42,0.06), 0 2px 4px rgba(15,23,42,0.04)` — within Design Brief §6 3-tier flat-with-borders system. ✓

### §2.3 Motion quality — score: 5/10

**Specific gaps:**

1. **Typing speed is uniform within each bubble — feels mechanical.** Real human typing has natural rhythm variation (pauses at punctuation, faster on common words). Real LLM streaming has slightly bursty rhythm (token-batched). Current implementation is dead-uniform `setInterval` at fixed ms-per-char. This is the **single biggest «AI mockup» tell** — every casual user has used ChatGPT and knows it doesn't stream this evenly. Reads as «designer animation», not «real product output».
2. **No micro-pauses at sentence boundaries.** The Provedo response has natural beats: «You're down −4.2% this month.» (full stop) → next clause. Current animation runs straight through without honoring punctuation. Even +120ms at periods would dramatically improve perceived authenticity.
3. **600ms pause between bubbles is too short.** Real users take **2–4 seconds** to read a question, then process. 600ms makes the demo feel impatient. R3 §10 anti-A3 («dramatic-thinking pause») is correct that PERFORMATIVE pauses are bad — but 600ms isn't a pause, it's a stutter. Reading-time-respecting pause = ~1200–1600ms.
4. **Cursor is correct.** Teal-600 2px bar, 0.75s step-start blink. Standard. ✓
5. **No entrance choreography for the response bubble.** The response bubble appears via React mount (gated by `phase === 'response'`) — **pops into existence instantly**. No fade, no slide-up, no opacity transition. Compare every reference (Claude.ai, ChatGPT-3.5 onwards): response bubble fades in ~150–200ms. Current implementation **fails the «motion that clarifies flow» rule** — the bubble appears with a snap that draws attention to the React render, not to the content.
6. **Sparkline has a 400ms opacity transition (0.4 → 1) once phase === done** — but this is a fade-in of an already-present element, not an entrance. Subtle and OK.
7. **No replay.** Plays exactly once per page load. Visitor who scrolls past the hero, scrolls back up — **dead chat**. Loses the mockup's primary value. This is the single biggest motion-system gap. Almost every best-in-class AI-tool hero loops or replays on intersection-observer (Cursor's hero demo, Granola's screenshots, Linear's stacked surfaces).
8. **Reduced-motion fallback is correct.** Both bubbles render statically. Sparkline at full opacity. ✓ No work needed here.

### §2.4 Demo length — score: 5/10

One single Q→A exchange. With no replay, the visitor sees ONE example. The §S4 demo-tabs section ships FOUR examples. The hero is **promising less than the page already delivers**. R1 §4.R1 Granola pattern explicitly recommends fully-written example product content — the strongest version of this would be 2–3 cycling exchanges in the hero, mirroring §S4 tabs tonally so the reader sees «oh, this product answers different kinds of questions» before they even reach §S4.

**However:** more exchanges = more motion budget = more cognitive load on a hero whose primary job is to anchor `Provedo will lead you through your portfolio.` Not obvious that more exchanges is better. Mid-scope Proposal B (cycling carousel) and deepest-scope Proposal C (interactive picker) both address this; conservative Proposal A keeps single exchange but upgrades the one shown.

### §2.5 Interactivity — score: 2/10

**Zero interactivity.** Pure passive demo. No way for visitor to:
- Replay the animation
- Try a different question
- Interact with the surface in any way

The primary CTA «Ask Provedo» (separate component, sits above-fold to the left of the visual stack) is the page's interactivity hook. The chat surface itself is pure ornament. R1 §6.T1 («try the product now» convention vs «account-linked observation» reality) names the underlying tension: AI tools converge on try-without-signup, Provedo cannot offer that without OAuth-linked broker. Mid-ground = sample-prompt-picker without backend (Proposal C) — gives interactivity-feel without violating Lane A or marketing/app separation.

### §2.6 Distinctiveness — score: 3/10

**This is the biggest gap.** Without the wordmark badge, the current hero ChatMockup could ship in any AI-tool landing — Lovable, ChatGPT preview, Granola, generic. Nothing about the bubble shapes, the typing animation, the sparkline placement, or the content register reads as **«this is Provedo specifically»**. Compare:

| Reference | Distinctive surface element |
|---|---|
| Claude.ai conversation | Serif response font (`font-claude-response`) — instant register signal |
| Cursor hero | Embedded mini Mission Control with anchor-targeted sub-demo regions |
| Granola hero | Real-feeling fictional meeting note h3 sub-headers («About them», «Decision-making insights») — content IS the distinctiveness |
| Linear agent log | Real-format Slack thread + ENG-2703-style issue IDs |
| Provedo current | Generic chat bubbles + generic sparkline |

The §S4 chat surface is **more distinctive than the hero version** — it carries `<Sources>` lines, mono-formatted tickers, event anchors, neg/pos color tokens. The hero is a less-developed variant of the same component family. **The hero should be the most distinctive instance, not the least.**

**Magician+Sage register check:** Current copy is Sage-clean (observational, no advice). Magician (pattern synthesis with sources, multi-position causation) is **subdued** — the answer says what dropped but not why-Provedo-noticed-vs-why-the-user-couldn't. R1 §6.T2 «negation as positioning» applies sideways: the strongest Magician signal is naming what only Provedo could surface (cross-broker, multi-position, event-anchored synthesis). Current hero loses this.

---

## §3. Three named-reference gaps PO would notice

These are the three most-load-bearing gaps a PO who has actually used Claude / Cursor / Granola would notice within 5 seconds of comparing the hero to those references:

### Gap 1 — vs Granola.ai hero — content fidelity
Granola's hero ships a full fake meeting note with named sub-headers («About them», «Key takeaways», «Decision-making insights»). Reader **reads** the content and mentally maps it to their own meetings. Provedo hero ships a 100-char one-liner with no event anchors and no sources. PO comparison verdict: «ours looks like a marketing mockup, theirs looks like a product screenshot». **This is the single most-load-bearing gap.** R1 §4.R1 already named this for §S4; it applies even more sharply to the hero.

### Gap 2 — vs Cursor.com hero — perceived realness of motion
Cursor's hero embeds an interactive Mission Control mini-demo with anchor-targeted regions («Trigger», «View Behavior»). Motion is bound to actual product surfaces, feels like product not animation. Provedo hero is a fixed-rate `setInterval` typewriter on hardcoded strings — **reads as a designer's animation**, not as a product output. PO comparison verdict: «their demo feels alive, ours feels scripted». Mitigation: variable typing speed + punctuation-respecting micro-pauses + entrance fade on response bubble + replay-on-intersection (covered in Proposal A scope).

### Gap 3 — vs Claude.ai conversation surface — typographic register signaling
Claude.ai uses a dedicated `font-ui-serif` (or `font-claude-response`) for response text — instant signal that says «this is the AI's voice, distinct from chrome». Provedo can't (and shouldn't) introduce a serif (Inter+JBM lock per Design Brief §4); but it CAN distinguish Provedo response from user message via mono-numerals on data points, the wordmark inline on the response bubble (not floating above), and a small visual chip indicating sourced (e.g., `Source ↗` badge). **The Provedo response bubble currently has no register-signaling chrome that distinguishes it from the user bubble** beyond color. PO comparison verdict: «Claude looks like an AI is responding; ours looks like two people talking».

---

## §4. Proposal A — «Polish current» (lowest scope, ~4–6h)

### Posture
Keep the architecture (single Q→A exchange, hardcoded, in-component). Upgrade content + motion + visual polish to match §S4 quality and close all three named-reference gaps to ~70%.

### Concrete changes

**Content (1.5h, content-lead pass — covered in synthesis Option-A common-work scope, no extra burden):**
- Replace `USER_MESSAGE` from generic «Why is my portfolio down this month?» → wedge-revealing «My VOO is up. Why is my portfolio still down this month?» (or PO-preferred Granola-grade question that requires cross-position synthesis).
- Replace `PROVEDO_RESPONSE` with §S4-Tab1-grade content including event anchors and sources:
  > «You're down −4.2% this month. 62% of the drawdown is two positions: Apple (−11%) after Q3 earnings on 2025-10-31, and Tesla (−8%) after the 2025-10-22 delivery miss. The rest of your portfolio is roughly flat.»
- Add `Sources:` line below the answer text, before the sparkline, mirroring §S4 `<Sources>` component (1 line, italic, text-tertiary, ~12px).

**Visual polish (1.5h product-designer + 1h frontend-engineer):**
- Move «Provedo» wordmark badge from top-of-card to **inline above the response bubble** (matches §S4 `ProvedoBubble` pattern). This single change is the biggest visual-polish win.
- Bump bubble padding from `px-3 py-2` → `px-4 py-3` to match §S4 (more breathable).
- Bump text from `text-xs` → `text-sm` to match §S4 (better readability).
- Wrap data points (`−4.2%`, `62%`, `Apple`, `−11%`, `Tesla`, `−8%`, `2025-10-31`, `2025-10-22`) in mono spans + neg/pos color tokens, mirroring §S4 `<Mono>` / `<Neg>` / `<Pos>` components. Lift those primitives from `ProvedoDemoTabsV2.tsx` to a shared file or duplicate inline.
- Drop the user bubble border (redundant on white card bg).
- Add subtle `Source ↗` chip after the sources line (12px, tertiary text + arrow icon) — register-signal that the response is sourced (Gap 3 mitigation).

**Motion (1.5h product-designer + 1h frontend-engineer):**
- Variable typing speed: base 35ms/char + ±10ms jitter (`Math.random()`) per character to break the mechanical feel. Pseudo-random with fixed seed if test-stability matters.
- Micro-pauses at sentence boundaries: +180ms after `.`, `!`, `?`. Implementation: detect punctuation in the slice loop and bump the next interval by 180ms.
- Bump pause between user-complete and response-start from 600ms → 1400ms (reading-time-respecting; still within R3 anti-A3 «no dramatic pause» rule because it represents user-reading-question, not Provedo-thinking).
- Add 200ms fade-up entrance on response bubble (`opacity 0→1` + `translateY 8px → 0`, `cubic-bezier(0.16, 1, 0.3, 1)`). Compositor-friendly (transform + opacity only); reduced-motion fallback already handles by skipping the animation.
- **Add replay-on-intersection.** When hero scrolls out of viewport then scrolls back into viewport, reset state and replay. IntersectionObserver pattern (same primitive frontend-engineer would use for Option C in synthesis). Single `useEffect` + state reset. Adds ~0.5kB.

### Bundle impact
- Mono/Neg/Pos primitives already exist in §S4; either lift to shared or inline-duplicate. Net: ~0.3kB.
- IntersectionObserver hook: ~0.5kB.
- Variable typing logic: ~0.2kB.
- Total: **~1kB additional**. Well within 60kB ceiling.

### Voice + Lane A check
- New question and answer use only allowlist verbs (down, drawdown, after Q3 earnings, after delivery miss). No advice register. ✓
- Sources line strengthens trust signal without claiming forecast. ✓
- No ICP narrowing or personalization drift. ✓

### Reference gap closure
| Gap | Closure |
|---|---|
| 1 (Granola content fidelity) | ~80% — same-grade content as §S4, sources visible, event-anchored. Still single exchange. |
| 2 (Cursor motion realness) | ~70% — variable typing + sentence pauses + bubble entrance + replay-on-intersection address most «scripted feel» concerns. Won't fully match Cursor's interactive embed. |
| 3 (Claude register signaling) | ~70% — wordmark inline + sources chip + mono data tokens distinguish response from user bubble. Won't get serif register without breaking type lock. |

### Risk
- **Lowest of the three proposals.** No structural change. No new components. No new motion patterns the team hasn't already shipped (variable jitter is novel but trivial; punctuation-pause is trivial).
- Aligns directly with synthesis Option A common-work (content-lead Granola pass already scoped); could fold into that PR.

### Trade-off
- Single exchange remains a constraint. PO who wants «cycling demo» feel will read this as «good polish but not a redesign».
- Doesn't add interactivity. Hero stays passive.

---

## §5. Proposal B — «Multi-turn carousel» (mid scope, ~10–14h)

### Posture
Keep the visual architecture from Proposal A (single chat surface in the hero stack). Cycle through **2–3 different example exchanges** (one each from §S4's 4 tabs, e.g. Tab 1 «Why down», Tab 3 «Patterns», Tab 4 «Aggregation»). Auto-advance with pause; manual nav dots below the surface. Replay control implicit via dot navigation.

### Concrete changes

Everything in Proposal A, plus:

- **Carousel state machine.** Extend `useTypingSequence` to accept an array of `[USER_MESSAGE, PROVEDO_RESPONSE, sources, chartType]` tuples. Phase progression becomes: `idle → user[i] → pause → response[i] → done[i] → dwell[i] → reset → user[i+1] → ...`. After last exchange, loops back to first OR holds on last (PO call).
- **Dwell time.** ~6s per completed exchange (reader has time to absorb), then 200ms fade-out, 100ms gap, 200ms fade-in of new exchange.
- **Manual nav dots.** Three `<button>` elements below the chat card. Active state = teal-600; inactive = `--provedo-border-default`. Click resets carousel to `i = clicked-index` and pauses auto-advance for 30s before resuming. Keyboard accessible (arrow-left/right when focused).
- **Two more chart variants.** Tab 3 needs a `TradeTimelineSparkline` mini-version; Tab 4 needs an `AllocationDonutMini`. Lift simplified versions from existing `*Animated.tsx` components (those are heavier — full inline charts; mini versions for the hero need only the essential shape).
- **Pause-on-hover.** Hovering the card pauses auto-advance until mouse leaves. Touch: pause-on-tap-to-card, resume on tap-elsewhere.
- **Reduced-motion fallback.** Renders all 3 exchanges stacked vertically, statically. No carousel. Slightly different layout but content-equivalent.

### Bundle impact
- Carousel state extension: ~1kB.
- Two mini chart components (TradeTimelineMini, AllocationDonutMini): ~3kB combined.
- Nav dots: ~0.5kB.
- Hover-pause logic: ~0.3kB.
- Reduced-motion stacked variant: ~0.5kB.
- Total: **~5–6kB additional**. Well within 60kB ceiling.

### Voice + Lane A check
- All three exchange tuples use existing §S4 content (already audited Lane A clean by finance + legal). ✓
- Tab 3 patterns content carries the v3.1 finance/legal patch verbatim («not a recommendation about future trading decisions; past patterns do not predict future results») — **load-bearing, must not be paraphrased**. The mini-chart variant must preserve room for this disclaimer line.
- 5-animation-rules compliance: 3 simultaneous animations max — typing animation + cursor + chart entrance counts as 3 already; carousel fade-out/fade-in must be sequential, not concurrent with typing. State-machine ordering covers this.

### Reference gap closure
| Gap | Closure |
|---|---|
| 1 (Granola content fidelity) | ~95% — three different content surfaces, all event-anchored and sourced. Multi-exchange variety further amplifies the «look how much this product can do» feel Granola achieves with multiple meeting-note types. |
| 2 (Cursor motion realness) | ~75% — same as A, plus carousel transitions add another motion layer. Still not interactive in Cursor sense. |
| 3 (Claude register signaling) | ~80% — same as A; multiple exchange types showing different chart variants reinforces «this is a real product handling different question types». |

### Risk
- **Mid.** Adds state machine complexity (carousel + typing + dwell timers + hover-pause + dots — multiple interacting timers risk race conditions). Test plan needs to cover: rapid click between dots, page-blur-during-dwell, reduced-motion path, touch-pause-resume, intersection-observer interaction.
- Risk of feeling «busy» — three cycling exchanges in the hero is more visual activity than the calm-over-busy principle (Design Brief §1.1) prefers. Mitigation: dwell time generous (6s), cross-fade subtle (200ms), max 3 exchanges (not 5).
- Repeats §S4 content — visitor sees Tab 1 in hero AND in §S4 demo tabs. Requires content-lead to either (a) accept the rhyme as intentional reinforcement, or (b) write 3 distinct hero examples that don't overlap §S4.

### Trade-off
- Higher implementation cost than A.
- Higher cognitive load on hero — competes with the 6-sec attention budget for the headline + sub + CTA.
- Still no real interactivity; user can navigate but cannot ask anything.

---

## §6. Proposal C — «Interactive sample-prompt picker» (deepest scope, no backend, ~14–20h)

### Posture
Add an interactive layer below the chat mockup: 3–4 «Try asking Provedo about…» chips. Clicking a chip resets the typing animation and runs the canned answer for the selected question. Still no real backend, still no LLM call, still no user-typed input — but the visitor gets **agency** (chooses what they see) rather than passive viewing.

This addresses the strongest gap PO didn't articulate: the hero **invites the user to do nothing**. A picker invites them to participate without violating Lane A, marketing/app separation, or no-spend rules.

### Concrete changes

Everything in Proposal A, plus:

- **`ChatPromptChips` component.** Renders 3–4 buttons below the chat card:
  - «Why is my portfolio down?»
  - «How am I exposed across brokers?»
  - «When are my next dividends?»
  - «Anything unusual in my trades this year?»
  Styling: pill-shape (`rounded-full`), 1px border `--provedo-border-default`, padding `px-3 py-1.5`, text-xs, tertiary text color. Active chip: teal-600 border + teal-50 fill + primary text.
- **Prompt-answer registry.** Object map keyed by prompt-id, each value a tuple `[USER_MESSAGE, PROVEDO_RESPONSE, sources, chartType]`. Initial state: first prompt's exchange auto-plays on page load (preserves the «AI demo» first-impression).
- **Click behavior.** Clicking a chip: reset typing state → fade out current response (if visible) → run `useTypingSequence` with the selected prompt's tuple → render chart variant on completion. Auto-advance is **off** by default — user is in control.
- **Above the chips: micro-label** «Try asking Provedo about…» (text-xs, tertiary color, mb-2). Tells the visitor what the chips do without making them an instruction.
- **Default state.** First chip is active on page load; first exchange auto-plays once. After completion, no auto-cycle.
- **Replay current.** Active chip is itself clickable — clicking the active chip replays the current exchange. Cursor changes to indicate this.
- **Touch-friendly sizing.** Chips ≥44×44pt touch target (per ui-ux-pro-max 10-priority rubric §2 Touch & Interaction). Achieved with min-height: 36px + adequate padding; on mobile, breakpoint adjusts to bigger chips.
- **Mobile layout.** Chips wrap to 2 rows on <375px viewport. ARIA: `role="group" aria-label="Sample questions for Provedo"` on chip container; each chip is `<button>` with `aria-pressed={i === activeIndex}`.
- **Reduced-motion fallback.** Chips still functional (clicking changes answer instantly without typing animation). Carousel-style stacked-static fallback NOT used here — picker still gives agency under reduced motion.

### Bundle impact
- Chip component: ~1kB.
- Prompt-answer registry data: ~2kB (plus 4 mini chart variants — see Proposal B for chart cost; here ~4kB total for 4 charts).
- State machine for selection: ~0.5kB.
- ARIA + keyboard nav: ~0.5kB.
- Total: **~7–8kB additional**. Well within 60kB ceiling.

### Voice + Lane A check
- All chip prompts are user-questions, not advice prompts. «Should I sell Apple?» would be banned (advice elicitation); «Anything unusual in my trades this year?» is observational. ✓
- All canned answers identical to §S4 content (already audited). ✓
- Lane A risk surface: visitor types in head «what if I asked Provedo about Y?» and the chip set doesn't cover Y — they may walk away thinking the product can't answer Y. Mitigation: chip set covers the four §S4 categories that map directly to the page's promise. The «what if Y» inquiry naturally pushes them toward the «Ask Provedo» CTA, which is the desired conversion path.
- **No backend wiring** — this is pure client-side state. No LLM call. No user-typed input. Marketing/app separation preserved.

### Reference gap closure
| Gap | Closure |
|---|---|
| 1 (Granola content fidelity) | ~95% — same as B, with 4 examples instead of 3. |
| 2 (Cursor motion realness) | ~85% — interactive chip-driven mode reads as product, not animation. Still not as deep as Cursor's anchor-targeted mini-demo, but closer. |
| 3 (Claude register signaling) | ~85% — same as A+B, plus the chip layer adds product-feel chrome that's distinctively Provedo (no peer in R1 audit ships chip-driven hero demo this way). |

**Bonus distinctiveness signal:** No AI-tool landing in R1 audit ships exactly this pattern. Most either: (a) fully passive demo (Granola), (b) fully interactive backend-wired demo (Cursor, Lovable, ChatGPT input), or (c) static screenshot (Linear). Chip-driven canned-answer picker is a **defensible middle ground** that Provedo specifically can claim because of the Lane A constraint (cannot offer free-input without Lane A microcopy at every prompt; cannot offer fully passive without losing product-feel).

### Risk
- **Highest of the three proposals.** Most surface area = most edge cases.
- Visitor may type a question into the chip area expecting it to be an input (if chips aren't clearly chip-shaped). Mitigation: pill shape + tertiary color + micro-label «Try asking Provedo about…» reinforces selection-not-typing.
- Auto-play of first exchange + chip-driven subsequent exchanges = mode confusion risk. First-time visitor sees animation, doesn't realize it stopped, doesn't see chips as interactive. Mitigation: chips fade in 200ms after first auto-exchange completes (subtle entrance choreography).
- Conversion path implication: chips might actually **substitute** for the CTA («I already saw all the answers, no need to click Ask Provedo»). This is a CRO question — content-lead + brand-strategist should rule. Counter-argument: the CTA leads to onboarding (account link), which is the actual value moment; chips just demonstrate the chat surface.

### Trade-off
- Most expensive of the three.
- Adds CTA-substitution risk (above).
- More content-lead authoring cost — needs 4 question/answer/source tuples instead of 1 (Proposal A) or 3 (Proposal B).
- More a11y test surface (chip keyboard nav, focus management between chips, screen reader announce-on-active-chip-change).

---

## §7. Weighted recommendation

**Proposal A — «Polish current».**

### Why A over B and C

1. **Highest yield-per-hour.** A closes ~70–80% of the gap to best-in-class for ~5h of work. B closes ~80–85% for ~12h. C closes ~85–95% for ~17h. The marginal closure-per-hour curve flattens fast after A. PO directive «доработать чат» reads as «fix the obvious gaps», not «redesign the surface» — A delivers the obvious fixes; B and C add complexity beyond the directive.

2. **Folds into synthesis Option A common-work cleanly.** Per `2026-04-27-redesign-synthesis-product-designer.md` §2 Trade-off 3: «Replace bracketed placeholders with Granola-grade fully-written example output» is universal (all 3 redesign options carry it). Proposal A's content rewrite IS that work for the hero ChatMockup specifically. **No incremental content-lead burden.** Proposal B/C add 1–3 more question/answer tuples, which IS incremental burden.

3. **Lowest risk against PO's «calm over busy» principle.** Proposal B (cycling carousel) and Proposal C (chip picker) both add motion or interactivity to a hero that already carries: a parallax 3-stack (3 mockups), a typing animation, a fade-in chart, a CTA button. Adding more in the hero presses against Design Brief §1.1 «calm over busy». A keeps the hero calm; only fixes what's broken.

4. **Strongest Magician+Sage register preservation.** Sage register holds throughout A (single observation, single source-cited answer). B's 3-cycle reads slightly more «product showcase» (Magician-leaning). C's chip picker is most product-showcase (further Magician-lean). A is the only proposal that leaves the hero's register inflection unchanged.

5. **Reversibility.** A is fully reversible (no new components, no new patterns). B requires unwinding the carousel state machine. C requires removing the chip layer + registry. If the hero direction shifts in v5, A lifts cleanest.

### When B becomes the answer instead
If PO's «доработать чат» actually means «show that the product handles MORE than just one question type» (an unspoken MARKETING-SCOPE expansion), B is the right answer. Reading the PO directive literally («fix the chat»), I read this as «not yet» — but right-hand should clarify with PO before locking.

### When C becomes the answer instead
If PO is specifically dissatisfied with **passivity** of the current chat (the «invites the user to do nothing» problem named in §6 above), C is the right answer. C is the only proposal that addresses interactivity. Reading the PO directive literally, this is **possible** — «доработать» can mean «evolve» not just «polish». If right-hand learns from PO that the dissatisfaction is interactivity-specific, switch to C.

### Recommended sequencing
1. Right-hand confirms with PO whether dissatisfaction is (i) polish (→ A), (ii) variety (→ B), or (iii) interactivity (→ C).
2. If (i) or unclear: ship A as part of synthesis Option-A v4 PR (if PO chose Option A in synthesis decision). If synthesis hasn't decided yet, ship A as standalone slice — it's compatible with all three synthesis options.
3. If (ii): ship B as separate slice after synthesis decision; verify content-lead capacity.
4. If (iii): ship C as separate slice; brief brand-voice-curator + content-lead first on chip-text register.

---

## §8. Cross-references

### Conflicts with parallel chart-upgrade audit?
I have not seen the parallel chart-upgrade audit yet. Inferring from likely scope (chart components in §S4 demo tabs): **no direct conflict**. Both audits work on the same `ProvedoDemoTabsV2.tsx` file family but on different concerns:
- Chart audit likely upgrades the **chart visual rendering** in §S4 tabs (PnlSparklineAnimated, DividendCalendarAnimated, TradeTimelineAnimated, AllocationPieBarAnimated).
- This audit upgrades the **chat surface in the hero** (ChatMockup in ProvedoHeroV2.tsx).

**Touch points:**
- If chart audit promotes new chart variants for §S4, **Proposal B and C** would inherit those upgraded charts in their mini variants (since they cycle/select chart types matching §S4 tabs). Proposal A does not need to inherit (single sparkline, scoped per current state).
- If chart audit changes the inline sparkline visual treatment, Proposal A's sparkline upgrade should align. Ideally chart audit ships first, then Proposal A's sparkline tweaks defer to the new treatment.
- No code conflict: chart components live in `_components/charts/`; ChatMockup lives in `_components/ProvedoHeroV2.tsx`. Different files.

### Dependencies
- Synthesis decision (which option A/B/C) doesn't block this proposal — A is compatible with all three synthesis options.
- Content-lead Granola-grade rewrite is a shared dependency between this audit's Proposal A and synthesis common-work.
- Brand-voice-curator review of new hero question/answer text recommended before ship (per agent role boundary).

---

**Word count:** ~3 750. Within typical audit budget.

**END hero-chatmockup-audit-product-designer.md**
