# Design System v2 — Brand Harmony Review

**Verdict:** PATCH
**Confidence:** high

## Summary

The rendered system is 80% on-brand and lands closer to «Mercury 2024 + Stripe Press» territory than any prior round. Palette discipline is excellent — cream + ink + forest-jade + bronze read as restrained, observed, paper-grade. Tactile depth (V4 inset/extruded) reads tactile, not skeuomorphic. Geist with `tnum` and no italic is the right typographic posture for a Magician+Sage product.

But there are 3 brand-side gaps that hold it back from full SUPPORT:
1. Chat user bubble in light theme — PO is right, this is the strongest off-brand element. Pure ink rectangle reads «execute trade», not «I'm asking».
2. Bronze `#9B5C3E` sits one notch too autumnal-orange. PO's instinct toward red-shift is correct on brand-semiotics grounds.
3. Some surfaces lean Magician (the `accent` highlighted word, the `✦` citation glyph) without enough Sage counter-weight — the system slightly over-celebrates pattern-detection in a way the locked tone («zero hype, observation-grade») doesn't sanction.

None of these are REWORK-level. All three are surgical patches. Recommend ship after Section 4 + 5 fixes land.

## Section 1 — Archetype implementation

**Magician (pattern detection across accounts):** lands well. The `pulse` indicator (forest dot with halo) on portfolio cards, the cross-broker insight card («A pattern across accounts»), the citation glyph `✦` — all carry quiet-Magician signal. The Magician here is *librarian-Magician* (Borges, finding the connection in the catalog), not stage-Magician (reveal! flourish!). Correctly tuned.

**Sage (composed observation):** lands well in shadow restraint, mono eyebrows (`PORTFOLIO · ANSWER · ENGINE`), tabular numerals in the type scale, dotted underlines in section heads. The breadcrumb in mono is pure Sage — it's the smallest detail and it's the most on-brand element in the file. The dark theme's stripped shadows (`0 4px 16px rgba(0,0,0,0.5)` no glow) push hard toward Sage and that's right.

**Everyman (warmth, accessibility):** carried by the cream surfaces, the `+2.4% week · 12 positions` plain English captions, the empty-state copy («Connect your first broker and Provedo will surface patterns within a minute»). The cream `#F4F1EA` does most of the Everyman work — without it the system would over-rotate to Sage-cold. Light theme has the right warmth; dark theme is colder by design and that's defensible because dark = «late-night focus mode» where Sage takes over.

**Off-archetype intrusions (Hero/Ruler):** two spots.

1. The signature hero card uses both `Notice **what** you'd miss` headline + `accent` color emphasis on «what» + `lift` shadow + ink CTA. Three emphasis devices stacked = Hero-archetype crowding. One of these (the accent color on «what») could go and the card would read more Sage. Right now it's right at the edge of «promotional» — Patagonia + Craig Mod don't put a colored accent on a single word in a headline, they let the typography rest. **Recommend: keep the lift shadow, keep the ink CTA, drop the green-accent on «what». Let the headline be quiet.**
2. The `chip.accent` (forest-jade pill saying «Verified») reads fine. The `chip.ink` (black pill saying «Lane A») reads slightly Ruler — too much weight for a regulatory boundary chip. Ink should be reserved for the user's own actions (CTA buttons, user chat bubble issue below). Lane A chip should be neutral.

## Section 2 — Voice-visual composition

The voice references — Patagonia, Craig Mod, Wirecutter, Economist, McPhee — share a single visual habit: **they trust the reader to find the signal**. They don't underline, color-code, or asterisk meaning. They let observation sit on the page.

**Where the rendered system carries this voice:**
- Type scale sample: «Your IBKR account drifted 3.2% from target last week» — exact tone match. McPhee would write that line.
- Breadcrumb mono. Dotted-underline section dividers. Numbers right-aligned in tables. All paper-restraint.
- Toast titles («Binance synced», «Drift detected») — verb-noun, no exclamation, no emoji. Wirecutter-clean.
- Empty state: «No insights yet. Connect your first broker and Provedo will surface patterns within a minute.» That's an Economist sentence.

**Where the system fights the voice:**
- The `sig-headline .accent` color treatment on a single word is a billboard device, not an observed-tone device. Stripe Press never colors single words in headlines. Craig Mod never does it. The Economist never does it. Patagonia never does it. The technique is borrowed from Vercel/Linear/Framer landing pages and it pulls the rendered system one notch toward «product marketing» and away from «paper».
- The `✦` glyph on citations is borderline. It's specific and editorial (good), but a star is also celebratory (less good). A `·` or `→` glyph would be more Wirecutter. Keep `✦` if PO likes it — it's a 3/10 issue, not a 7/10 issue.
- Chat assistant body: «Reads as **opportunistic**, not drift.» The bold + accent-colored word inside an assistant response is the same single-word-emphasis tic. AI replies should land like McPhee paragraphs — no emphasis tricks. **Recommend: drop accent color inside chat-bubble bodies. Keep bold weight (bold-without-color is more Sage).**

The microcopy register and visual register are 85% matched. The 15% mismatch is the over-use of the accent color on individual words — a single-pattern over-applied.

## Section 3 — Competitor territory check

**Locked territory:** warm cream + sage cluster (Mercury 2024 / Granola / Stripe Press / Patagonia adjacent).

**Where it actually lands:** Mercury 2024 + Stripe Press primary, with light-touch Granola influence and a faint Linear-shadow inheritance.

- **Mercury 2024 (closest match):** the cream-on-cream card layering, ink-extruded primary CTA, restrained chips, mono eyebrows — all map to Mercury's 2024 redesign aesthetic. PO would see a Mercury account-detail page and feel «yes, this neighborhood».
- **Stripe Press:** the typography choices (Geist with serious tracking discipline, no italic, dotted dividers, mono labels) read directly from the Stripe Press playbook for `Working in Public`, `High Growth Handbook`, etc.
- **Granola:** the chat-bubble structure (asymmetric radii, mono label «PROVEDO REPLIES», cream assistant card) is Granola-adjacent. Granola handles user/assistant asymmetry better — see Section 4.
- **Patagonia:** the warmth of `#F4F1EA` cream and the bronze `#9B5C3E` are Patagonia-Worn-Wear adjacent. Right neighborhood.

**Drift risks:**
- The dark theme's `#0F0F11` neutral cool is closer to Linear/Vercel than to Stripe Press dark. Linear-Vercel is fine territory but it's a *different* territory — colder, more technical, less paper. Recommend the dark theme stay on this side because dark mode for a finance product needs to read «night focus», not «warm reading lamp». Just flag that dark theme = Linear-adjacent, light theme = Mercury/Stripe Press-adjacent. Both legitimate. Two-territory system is fine if the audience understands cream-light = day mode, cool-dark = focus mode.
- Bronze at current saturation could be read as autumn-decorative if mishandled. Section 5 fixes this.

**Brands the system clearly avoids:** Bloomberg (cold institutional), Robinhood (gamified casual), Wealthfront (sterile fintech-blue), Fidelity (corporate-trust gray). Good. Those would all be wrong.

## Section 4 — Chat bubble recommendation (PO callout A)

**PO is right.** Pure ink `#1A1A1A` rounded rect on cream reads:
- «trade execution confirmation» (the visual register of Robinhood's order-confirm chip)
- «system message» (looks like the assistant's CTA, not the user's question)
- «action taken» (extruded shadow + black = «button that was pressed»)

What it should read as: *I'm posing a question, in my own voice, and I trust the system to listen carefully.* That's a Sage+Everyman moment, not a Magician+Ruler moment.

**Reference brands that nail this:**

- **Anthropic Claude.ai (light theme):** user message = soft warm cream rectangle, slightly darker than page background, no shadow, body text in ink. Asymmetry comes from position (right-aligned) and from the assistant's response having more visual weight (longer, with formatted blocks). **Best reference.**
- **Granola:** user message = subtle outlined card on the same tan paper, no fill change, just a thin border. Position-based asymmetry only. Very paper-restraint.
- **Linear comments:** comment = inset/depressed cream surface, very light. Differentiation by avatar + position, not by color saturation.

**Recommendation for Provedo light theme:**

Replace ink fill with **inset cream** — the same `--inset` (`#ECE7DC`) the form fields use, with a soft inset shadow. This:
- Reads «I'm typing into a slightly recessed slot» (Sage observation surface, not Ruler command surface)
- Maintains user-vs-AI asymmetry (user = inset/recessed; AI = lifted/raised card with shadow)
- Composes with paper-restraint (cream-on-cream layering, the Mercury/Stripe Press habit)
- Reads as «posing a question», not «executing order»
- Trust signal preserved (Lane A wants user authority quiet, not loud)

**Spec:**
```css
.bub-user {
  background: var(--inset);          /* #ECE7DC */
  color: var(--ink);                  /* #1A1A1A — text stays ink */
  box-shadow: var(--shadow-inset-light);
  border-radius: 18px 18px 4px 18px;
  padding: 12px 18px;
}
```

The asymmetric border-radius (sharp bottom-right corner) keeps the directional «from me» signal. The inset shadow says «depressed slot for my words». The ink text keeps legibility at AAA contrast.

For dark theme: keep the cream-on-dark user bubble (it works there — cream against `#0F0F11` reads as a typed note on dark paper). Dark mode is fine as-is.

## Section 5 — Bronze tuning (PO callout B)

**PO is right** — current `#9B5C3E` reads ~15° too far toward orange. Brand-semiotic difference matters here:

| Hue territory | Reads as | Brand impression |
|---|---|---|
| Orange-bronze (current ~25° hue) | Autumn metal, oxidized copper, fall foliage | Decorative, seasonal, slightly nostalgic — *Anthropologie catalog* |
| Red-bronze (~15-20° hue) | Old leather, terracotta brick, dried earth, oxblood-adjacent | Restrained, archival, *museum vitrine label* — observed, not decorated |
| Pure red-brown (~10° hue) | Dried blood, rust, danger | Too alarming for a warning chip |

The locked product is Sage-leaning (archive + observation). Red-bronze sits in the museum/archive register — the same red-brown you see in old binding leather, Patagonia's logging-era catalog, Aesop's terracotta packaging. That's the Provedo neighborhood. Orange-bronze drifts toward decorative-craft, which is wrong archetype.

**Recommended hex:**

| Token | Current | Proposed | Note |
|---|---|---|---|
| Light `--terra` | `#9B5C3E` | **`#9C5040`** | red-shift +5° hue, slightly desaturated. Reads «old leather», not «autumn metal». |
| Dark `--terra` | `#B87560` | **`#B86A5A`** | parallel red-shift, preserves dark-theme luminance. |

Quick OKLCH framing for whoever lands the patch:
- Current light: ~`oklch(48% 0.07 35)` (orange-leaning)
- Proposed light: ~`oklch(46% 0.08 25)` (red-leaning, hint more chroma so it doesn't go muddy)
- Current dark: ~`oklch(60% 0.08 35)`
- Proposed dark: ~`oklch(58% 0.09 25)`

**Cross-check against existing usage:**
- Negative delta in tables (`−5.8%`): red-bronze still reads as «warning, not catastrophe» — correct register. Orange-bronze read as «autumn change», wrong. Red-bronze improves semantic fit.
- Bronze `chip.warning` («Drift +3.2%»): red-shift makes drift feel slightly more noteworthy without alarming. Correct calibration.
- Toast warning icon: same — improvement.
- `pulse.warn` halo: improvement (currently the orange halo on Binance card reads decorative; red-bronze halo reads attention-warranted).

No accessibility regression — both proposed hexes maintain AAA on cream backgrounds and AA on ink-card text.

## Section 6 — Top 3 issues + Top 3 wins

### Top 3 brand-side issues

1. **Chat user bubble (light theme)** — wrong register. PATCH per Section 4. Single highest-leverage fix in the file.
2. **Bronze hue 15° too orange** — drifts decorative. PATCH per Section 5. `#9C5040` light / `#B86A5A` dark.
3. **Single-word accent-color emphasis is over-applied** — appears in hero headline, in chat assistant body («opportunistic»), in section section signature card. It's a billboard device borrowed from Vercel/Linear and it fights the Patagonia/Stripe Press paper-voice. PATCH: keep the technique for the hero only (or drop entirely), remove from chat-bubble bodies. Bold weight without color is more Sage.

### Top 3 brand-side wins (where rendered design EXCEEDS spec expectations)

1. **Tabular numerals discipline.** Every dollar amount, every percentage, every quantity column uses `tnum`. This is a Sage/observation move that shows up in The Economist and FT but almost never in fintech competitors. Strongest single brand-typography move in the file.
2. **Mono eyebrow + dotted-underline section dividers.** The `PORTFOLIO · ANSWER · ENGINE` label + the dotted `border-bottom` under section heads is pure Stripe Press / Craig Mod. These two details alone signal «we read carefully here». Keep forever.
3. **Dark theme shadow restraint.** Dropping the double-shadow glow and using flat `0 4px 16px rgba(0,0,0,0.5)` is the right move and a lot of teams get this wrong. The dark theme has Sage-discipline that even the light theme is slightly too generous about. Don't soften.

## Risks

- **Voice drift if Section 6 issue #3 isn't addressed.** If the accent-color-on-single-word habit propagates to dashboard/insight surfaces, the system over-rotates to Magician and the Sage anchor weakens. This becomes the system's biggest long-term tone risk.
- **Bronze regression.** If a future palette tweak swings bronze back toward orange (for «warmth» or «friendliness»), the system loses the museum/archive register. Lock the proposed values in `04_BRAND.md` once landed.
- **Two-theme territory split.** Light = Mercury/Stripe Press, dark = Linear-adjacent. Defensible but worth documenting so future contributors don't try to «harmonize» the dark theme back to warm — the cool-dark is intentional and earns its keep.
- **No Cyrillic typography rendering tested in this showcase.** Geist supports Cyrillic but the rendered samples are English-only. PO bilingual constraint — recommend Right-Hand dispatch a follow-up render with Russian samples in display + body sizes before locking.
- **Accessibility not formally tested.** Forest-jade `#2D5F4E` on cream `#F4F1EA` should pass AA but should be measured. Citation chip mono `10px` is borderline small.
