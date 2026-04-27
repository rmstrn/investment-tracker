# Design System v2 — Usability + ICP Fit Review

**Date:** 2026-04-27
**Author:** user-researcher (fresh-eyes pass, isolated context)
**Subject:** `https://staging.investment-tracker.app/design-system.html` (source `apps/web/public/design-system.html`)
**ICP:** Scattered Optimiser, 32-42, multi-broker self-directed (3+ accounts incl. IBKR + crypto), anxious-about-scatter, distrustful of advisor channels, semi-pro mindset.

**Verdict:** PATCH (close to SUPPORT — 4-5 narrow fixes, then ship)
**Confidence:** medium-high. No live ICP test on this rendered version yet (see §6).

---

## Section 1 — 5-second scan simulation

**«Serious tool» or «toy»?** — **Serious.** Cream BG + ink-extruded primary CTA + tabular Geist numerals + dotted dividers reads as «Mercury x Granola x field-guide.» Light theme reads closer to *Linear-light* than to Robinhood-clean. No toy signals. Win on the dominant axis.

**«Anti-Robinhood» signal?** — **Yes.** Highest-stakes single test from palette research. Pure-white + saturated-money-green (the Monarch / Robinhood / Wealthfront zone) is absent. Forest-jade `#2D5F4E` is deep enough not to pattern-match «consumer fintech green» on a fast scan. The ink-primary CTA decision does heavy lifting — every other audited product puts brand color on CTA, and we don't. It reads adult.

**«AI-product-canon» or «marketing template»?** — **AI-product-canon, Granola/Claude side rather than Perplexity.** Citation chip `✦ NVDA · 14 lots` is the strongest single signal — Perplexity/Claude grammar without copying either. «PROVEDO REPLIES» mono caps label is second-strongest (Claude, Perplexity, custom-GPT cards all use this now). No template tells.

**Trust signal — finance shoot/mid/beat?** — **Mid-to-beat.** Stronger than Magnifi (SaaS-AI-template). Weaker than Mercury/Stripe at institutional end — correct, we're not a bank. Closest comps: Mercury account dashboard + Lunch Money category cards + Granola transcript layout.

**Residual risk:** dark reads more generic «AI-product-dark» than light. **Light is the differentiator** — present to ICP first.

---

## Section 2 — Visibility audit

### Light theme

| # | Issue | Severity |
|---|---|---|
| L1 | Mono labels at 9px (`.tr.head`, `.ds-row-label`, `.sw-hex`) — readable on Retina, borderline on standard 1080p Windows at 100% (IBKR-pro cohort uses these). 10px floor would be safer. | MED |
| L2 | `pf-tiny` negative-delta inline `#9B5C3E` on `#FAF7F0` card → ~4.0:1, borderline AA-large. **Lowest-contrast number on the page is on the most anxious data point** (drawdown). | HIGH |
| L3 | `text-3` `#7A7A7A` on `--card` `#FAF7F0` measures ~3.9:1 — fails WCAG AA for body. Mono-uppercase 9-10px metadata uses are tolerable; `.input-help` (12px sentence-case) is not. | MED |
| L4 | Switch off-state thumb (cream circle on cream inset) relies on a 1px shadow — reads almost as «no thumb, just track.» | MED |
| L5 | Pulse warn `--terra` and pulse default `--accent` — protanopes/deuteranopes (~8% male ICP) cannot distinguish. Both look like dark blobs in CB-sim. Need shape or glyph differentiator. | HIGH |
| L6 | Table-head `#7A7A7A` mono on `#ECE7DC` inset → ~3.7:1, fails AA. ICP scans tables fast — squinty column labels slow scan. | HIGH |
| L7 | Delta `+12.4%` (forest-jade) and `−5.8%` (bronze) — same CB problem as L5. Sign characters carry meaning so it's recoverable, but color-coding is decorative-only for ~8% of male ICP. | MED |

### Dark theme

| # | Issue | Severity |
|---|---|---|
| D1 | `--text-3` is identical hex `#7A7A7A` in both themes despite BG inverting. Numerically passes AA in dark; **perceptually mono labels feel "more shouty" than in light.** Counter-intuitive. | LOW |
| D2 | `--text-2` `#B5B5B5` on `#0F0F11` → ~10.6:1. Body text is *higher* contrast than light mode. Dark mode reads more clinical / less calm. ICP wanting calm during anxiety: light is calmer; dark unintentionally amplifies tension. | LOW |
| D3 | Card `#16161A` vs page `#0F0F11` — only 7-luma separation. With (correctly) restrained dark shadows, cards barely lift. **Tactile direction does not exist in dark.** | HIGH |
| D4 | Bronze `#B87560` against cool grey reads more orange than in light (loses warm-cream desat context). "Bronze or warning-orange?" is harder to answer in dark. | MED |
| D5 | Citation chip in dark — only `✦` star in `--accent` `#4A8775` is chromatic; almost invisible against dark inset. Citation grammar that's a hero signal in light becomes a whisper in dark. | MED |
| D6 | User chat bubble in dark = near-cream pill on dark page. Only loud surface in dark theme; eye snaps to user's question rather than AI's answer. Inverts intended hierarchy. | MED |

---

## Section 3 — Density vs breath

Scattered Optimiser is **anxious about scatter** — wants clarity, not minimalism for its own sake. Keeps a Notion page with 7 broker logins.

- **Tables at scan?** OK for 4-row demo. For real 40-position scan, 14px vertical padding is too breathy. **Add `compact` table variant** at 8-10px.
- **Cards too breathy?** `card-pf` at 18-22px is right for hero. **No dense variant exists.** A 7-broker user needs 7 cards on screen — current density gets 3-4 on 1440. Add `card-pf-compact` at 14px / 22px amount.
- **Chat multi-line AI comfort?** Yes. 13px / 1.55 / 20px padding is right for sustained reading. Citation chips don't break cadence. **Strongest single moment for ICP fit.**
- **10+ min sustainability?** Light = sustainable. Dark = D2 + D3 makes it fatiguing. Sunday-evening 10pm dark review would not feel as held as 10am light with coffee. **Light default; dark = IDE-matching preference.**

---

## Section 4 — PO callouts

### Callout A — chat user bubble (currently pure ink `#1A1A1A` on cream)

**Verdict: PATCH. Pure ink is too loud for an anxious investor reading a chat reply.**

Scan of products ICP trusts:
- **Claude.ai:** user = warm dark `#3D3929` on lighter cream bubble. Almost invisible-as-bubble; AI reply anchors.
- **ChatGPT:** no user bubble — right-aligned text only.
- **Cursor chat:** subtle `#2A2A2A` on `#1E1E1E`. Quiet.
- **Mercury support chat:** `#0A0A0A` on light-blue tint, not pure ink.
- **Linear in-app:** subtle grey. Never shouty.
- **Magnifi (the loud one):** purple gradient. Reads «trader app» — what we avoid.

Pattern: **user bubble is quieter than AI reply, not louder.** Pure-ink-on-cream inverts this — eye snaps to user's question rather than AI answer.

**Finance-specific trauma read:** pure black filled rectangle with white text in finance UI = the «press to confirm trade» button on every broker (IBKR Submit Order, Binance Confirm Buy). For an anxious investor, that lands as «I just sent a trade.» Wrong association.

**Recommendation:**
1. **Quiet ink** — `#2A2A2A`-`#333333` text on `--inset` bubble. Closest to Claude/Anthropic. Safest Mercury/Claude play.
2. **Forest-tinted ink** — same `--inset` BG, 3px `--accent` left border. Granola-transcript style. Confident editorial play, low cost.

**My vote: direction 1 for Lane A trust read.**

### Callout B — bronze too orange, want red

**Verdict: PATCH toward red-bronze. PO's instinct is correct.**

**Orange-bronze (current `#9B5C3E`):** "warm, attention, promotional" — Brex shift, Ramp yellow, Notion amber. **Marketing-template adjacent.** In finance, orange = "alert, act now," triggers arousal. ICP viewing `−5.8%` drawdown in orange-bronze reads «URGENT, do something» — wrong response, they should sit with it. Pattern-matches Brex/Notion/Ramp neighborhood.

**Red-bronze (proposed):** "warning, historical, settled" — leather-bound spine, Patagonia red-brown, Economist masthead, Penguin Classics. **Editorial-finance territory.** Reads «notable to attend» without urgency-spike — attention without arousal. Mercury uses deep terra ~`#A14545` for negatives. Lunch Money uses `#B6584C`. **Both products ICP trusts do red-leaning, not orange-leaning.**

**Recommendation:** Shift `--terra` from `#9B5C3E` (~22° hue) toward **`#9B4A3D`–`#A04A40`** (~12-15°). Stays in dusty/desaturated family, harmonious with forest-jade. Just 7-10° rotation. Side benefit: red-bronze + forest-jade has slightly better protanope separation than orange-bronze + forest-jade.

---

## Section 5 — Prioritized fixes

### Tier 1 — would lose trust in <30s scan
1. **Patch chat user bubble** — pure-ink reads as «trade-confirm button» trauma trigger. (Callout A.) ~30 min.
2. **Shift bronze toward red-bronze** — orange-bronze pattern-matches Brex/Notion. (Callout B.) ~10 min.
3. **Pulse + delta CB-safety** — protanopes see two identical pulses. Add filled-vs-ring variant or `!` glyph for warn. ~45 min.

### Tier 2 — erodes trust subtly during 30s scan
4. **Table head contrast** (L6) — `#7A7A7A` on `#ECE7DC` fails AA. Bump to `#5A5A5A` or `--text-2`. ~5 min.
5. **Negative-delta `pf-tiny` color** (L2) — at 11px on cream, lowest-contrast number on page. Use `--terra` only at ≥13px on cards; for 11px tiny use `--text-2`. ~10 min.
6. **Dark theme card lift** (D3) — bump card to `#1A1A20` or add 1px `rgba(255,255,255,0.06)` top hairline. Without this, tactile direction doesn't exist in dark. ~15 min.

### Tier 3 — fatigues during 10+ min sustained use
7. **Mono label floor 10px** (L1) — bump 9px → 10px. ~10 min.
8. **Switch off-thumb visibility** (L4) — add subtle `box-shadow: 0 0 0 1px rgba(20,20,20,0.08)`. ~5 min.
9. **Dark `--text-2` calibration** (D2) — `#B5B5B5` → `#A0A0A0` for calmer read.
10. **Compact table + compact card variants** (§3) — for 7-broker / 40-position daily-use density. Ship after first cohort feedback.

---

## Section 6 — Validation experiment

**$0-50 budget. Recommend a 2-stage stack, ~$25-35 total.**

### Stage 1 — UsabilityHub 5-second test ($20-30)
- Two screens, light theme: hero + signature card; chat thread.
- 25 respondents, screened: «hold investments at 3+ brokers/exchanges?» + 30-45 + self-directed.
- Post-5s: (1) what does this do? (2) who's it for? (3) toy / serious tool? (4) one product it reminds you of?
- Pass: ≥60% mention "portfolio/investments" + ≥50% "serious tool" + Robinhood mentions <10%.

### Stage 2 — async clickthrough ($0)
- 5 ICP-matched from PO's network. 90-sec Loom: scroll, react out loud.
- Surfaces qualitative reactions to chat bubble + bronze + density. Per R2: drafts only, no sending-as-PO.

**If forced to pick ONE:** Stage 1 alone for $25 = highest signal-per-dollar. Validates §1 in 48h. Visual ranking vs Mercury/Magnifi/Granola/Public is worth running later but lower priority.

---

## Risks

- **R1 — Light vs dark default not specified.** If dark ships default, design-system's strongest ICP signals (cream tactile, citation grammar) lose ~50% of punch. Recommend: light default; dark as preference toggle.
- **R2 — Tabular numerals depend on Geist + `tnum` feature.** Verify font loads on Windows IBKR-pro cohort (Edge default). If Geist fails, fallback stack must also support tnum or numbers jitter.
- **R3 — Color-blind safety not audited end-to-end.** §2 surfaces L5/L7. Likely more in chip/toast warning variants. Recommend 30-min protanopia/deuteranopia/tritanopia simulator pass before shipping.
- **R4 — All §1-§5 are still desk-research.** No live ICP test on this rendered file. §6 Stage 1 closes that gap. Don't lock as final until Stage 1 returns. Confidence stays medium-high until live test moves it to high.
- **R5 — Wordmark in showcase is "Provedo"** but locked positioning (`02_POSITIONING.md` v3.1) uses **Memoro**. Doc-state mismatch, not a design-system issue, but worth surfacing since the wordmark is rendered.
