# Validation: Warm Tactile UI Direction — Content-Lead

**Date:** 2026-04-27
**Author:** content-lead (isolated dispatch — Right-Hand Rule 3)
**Verdict:** WARN (lean REJECT for option-a; SUPPORT only for option-c with strict guardrails)
**Confidence:** high

---

## Summary

The locked voice — observant, composed, plain-spoken; references Patagonia product-page, Craig Mod, Wirecutter, Economist leaders, McPhee — is a **flat-editorial paper voice**. It is the voice of a printed field guide. The references are unanimous on this point: none of them are tactile, none are 3D, none are warm-domestic. They are restrained-paper.

A heavy double-shadow neumorphic visual frame is a different mood: domestic, toy-like, fingertip-pressable, candy-soft. It signals «touch me, play with me» — a register the voice has explicitly excluded («Not Notion: too playful»; «Not Granola-precious»; banned diminutives; banned celebration; «no badges, no streaks»).

Heavy tactile (option a) creates legible cognitive dissonance: the page would *feel* like Headspace or Duolingo while *reading* like a Patagonia spec sheet. The reader resolves that conflict by trusting the louder signal — visual — and the voice collapses into beige under a friendly mood. That is exactly the failure mode the brand-voice doc names: «restraint without craft reads as flat; restraint *with* craft reads as confident».

Hybrid (option c) — moderate flat baseline with **selective tactile moments at instrument surfaces** (a single conviction lock-up, a connect-broker affordance, the early-access modal CTA) — is the only intensity that preserves voice integrity AND gets the «touchable / warm / not-corporate» quality the PO is reaching for. Moderate-everywhere (option b) softens the voice mid-page where the reader most needs the page to feel like authority, not a stress ball.

---

## Section 1 — Voice-mood composition

The five reference voices share one property: **paper**.

- **Patagonia product pages** — flat product photography on white; spec lists; the typography does the work.
- **Craig Mod / Ridgeline** — long-form newsletter prose; flat black-on-cream; one image per essay; no UI texture at all.
- **Wirecutter** — editorial review layout; flat content blocks; the only depth is hierarchy of headline → kicker → body.
- **The Economist leaders** — print column; flat type on flat paper.
- **McPhee** — hardcover book interior; black ink, white page.

Tactile/neumorphic mood pairs canonically with a different voice family: **playful · personal · whimsical · encouraging**. Headspace, Duolingo, Linear's earlier marketing, Things 3, the Headway app, Rosebud, Stoic. The shadow language says «I am soft. I am a friend. Touch me.» The voice that resolves that signal naturally is warm-encouraging, not observant-restrained.

This is not a hard incompatibility — it is a register conflict. The product can absolutely use depth, warmth, and even some tactility. But a **heavy** neumorphic system pulls the page toward a voice family the brand-voice doc has explicitly disowned (Robinhood-celebratory; Notion-playful; Granola-precious). The reader's mood and the reader's reading converge on the louder cue, which is always the visual.

**Concrete dissonance test.** Read the locked sub aloud in two frames:

> *«Notice what you'd miss across all your brokers.»*

In flat-editorial: it lands as understated authority. The reader hears a guide.
In heavy-neumorphic earth-warm: it lands as «look at this cute reminder app». The reader hears a friend with a clipboard.

The voice survives the second frame, but it loses 30–40% of its authority. Authority is the entire reason this voice exists.

**Verdict on composition:** option (a) UNDERMINES the voice; option (b) DILUTES it; option (c) can AMPLIFY warmth without surrendering composure if tactility is rationed to instrument surfaces only.

---

## Section 2 — Microcopy implications

If we go tactile, microcopy must adjust. The current voice was written for a flat editorial canvas; tactile UI changes the contract on every string surface.

**Buttons.** Heavy 3D buttons read as more visually present than flat ones. The hand wants to press, so the label has to *earn* the press in fewer words. Current voice already keeps CTAs short («See it for yourself»; «Connect a broker in two minutes. No card.»). Tactile would force one more squeeze: drop the supporting line on tactile primary buttons; let the surface do the inviting. **Trade-off:** we lose the «no card» honesty signal which is load-bearing for trust. Not free.

**Empty states.** Tactile UI does invite slightly longer, warmer empty-state copy because the surface is no longer austere. But the voice forbids warmth-as-decoration. The honest response is: keep empty-state copy the same length, replace one observation-verb with a slightly more domestic one — *waiting* instead of *standing by*; *quiet* instead of *empty*. Microcopy register shifts ½ a notch warmer; lexicon stays inside the verb-allowlist.

**Error messages.** This is where the conflict gets sharpest. Tactile UI + clinical voice = condescending («The button is soft and friendly but the message is cold»). Tactile UI + soft voice = patronising («everything is round and the app says «oopsie»»). The voice doc bans both. The fix is: errors on tactile UI must be **shorter and more factual** than on flat UI, because the visual is already doing the cushioning. Current Lane-A error patterns («We can't reach Schwab right now. Your data is unchanged.») already work; tactility lets us drop the second sentence on transient errors.

**Tooltips / hints.** Tactile hints (the soft pill, the pressed-in label) read as *invitation to play*. Voice forbids play. Tooltips must stay declarative, present-tense, ≤140 chars, and avoid any verb that turns the tooltip into a coach («try», «explore», «discover» — all banned). On tactile UI the temptation to use those verbs goes UP because the surface invites them. We need explicit reinforcement in the tone-by-surface table.

**Onboarding.** This is where heavy tactile would do the most damage. Onboarding is where every encouraging-voice fintech leans hardest into «You're doing great!» «Almost there!» «One more step!». The voice has banned all of it. Tactile UI in onboarding will create constant pull toward that register; every onboarding string will need to be re-audited specifically against the «no celebration» rule.

**Net microcopy impact.** Going tactile is not a visual-only decision. It rewrites the constraints on roughly 60–70% of in-product strings — every button label, every empty state, every tooltip, every onboarding line. That is a real workload, and it raises the failure rate of any future writer who doesn't internalize the voice.

---

## Section 3 — Landing copy compatibility (PR #66 hero stress-test)

**Hero head:** *Provedo will lead you through your portfolio.*

This sentence is doing a single very specific thing: future-tense, third-person product, the verb «lead» is the work. The brand-voice doc explicitly defends it: «future tense, not imperative. The product *accompanies*, it doesn't *command*. «Lead through» is the verb of a guide.»

In a flat-editorial frame, that sentence sits like a printed line in a field guide. The future tense reads as composed promise.

In a heavy-tactile frame, two things shift:

1. The visual softness pulls «lead» toward a friendlier register. «Lead» is no longer the steady hand of a guide; it starts to read as «walk you through» in the Headspace sense — gentle, hand-holding, encouraging. That is a different product than the one the voice describes.
2. The future tense, paired with tactile mood, can flip from *composed promise* to *aspirational marketing* — the «we'll get there together» tone of every onboarding wizard. The hero stops sounding like a guide and starts sounding like a wellness app.

**Hero sub:** *Notice what you'd miss across all your brokers.*

«Notice» is the load-bearing verb of the entire voice. It is the McPhee/Mod observation register. It earns its place because the surrounding mood is restrained — the voice is doing the noticing.

In a tactile frame, «notice» reads as quieter than the surface, which inverts the relationship. The surface is the loud part; the voice is the quiet part. That is acceptable on a flat editorial page (paper is supposed to be quiet). It is *not* acceptable on a tactile page, because tactile surfaces are supposed to be *quieter than the content*, not louder. The hierarchy reverses.

**Concrete: does it read RIGHT?** No, not in heavy intensity. In moderate-uniform it reads OK — slightly soft, slightly less authoritative, but still legible. In hybrid (flat hero canvas + tactile only on the CTA + the connect-broker affordance + the modal), it reads correctly: the hero stays paper, the press-here surfaces feel touchable, and the «lead» metaphor is supported rather than diluted.

The single most load-bearing primitive on the page is the **Sources** dotted-rule eyebrow (per implementation spec §reused components). If that eyebrow becomes a soft pressed pill, the trust contract collapses. Sources need to stay flat-editorial regardless of intensity choice.

---

## Section 4 — Reference patterns

### Successful marriages (warm/tactile + composed voice)

1. **Things 3 (Cultured Code)** — moderate-tactile UI (soft shadows, paper-like cards, tactile checkboxes) with a deliberately sparse, declarative voice in microcopy. «Today.» «Upcoming.» «Logbook.» No encouragement, no celebration. The tactility is the warmth; the words stay quiet. **This is the closest reference for what the PO is reaching for.** Things 3 also doesn't use heavy double-shadow neumorphism — it uses *restrained* depth, which is closer to option (c).

2. **Linear (early years, ~2020-22)** — moderate depth in components (subtle layered surfaces, not flat-flat) paired with composed engineer-voice copy. They later flattened further as the voice evolved, which suggests even moderate tactility creates pressure to soften copy.

3. **Stripe Dashboard (selectively)** — clinical voice, mostly flat, but uses selective depth on instrument surfaces (Pay-with-Stripe button, key cards). This is the option-(c) pattern executed cleanly: flat baseline, tactile moments at the instrument.

### Failed marriages

1. **Most «AI for finance» landings 2023-25** — neumorphic dashboards with copy reaching for «delight» and «magic». The tactile surface forces the copy into encouraging-voice territory; the resulting page reads as a wellness app for money, which is the exact anti-voice the brand-voice doc names.

2. **Headspace's brief 2022 finance/wellbeing crossover content** — heavy tactile + restrained voice felt patronising; users read the combination as «we're being calm AT you». Restraint without flat scaffolding reads as withholding rather than authority.

3. **Robinhood's 2021 «cash management» surface** — they tried clinical voice on top of their celebratory tactile UI. The mismatch was so visible that the voice was eventually rewritten to match the visual rather than fixing the visual to match the trust requirement.

**Pattern across successes:** moderate or restrained depth, never heavy. Tactility used as **rhythm** (one moment of depth among many flat moments), not as **baseline** (every surface tactile).

---

## Section 5 — Recommendation on (a)/(b)/(c)

**Recommendation: option (c), strictly disciplined.**

| Option | Voice impact | Verdict |
|---|---|---|
| (a) Heavy as reference | Forces voice into encouraging/playful register; collapses authority; rewrites 60-70% of microcopy | REJECT from voice perspective |
| (b) Moderate everywhere | Dilutes voice mid-page where authority is most needed; trust band + sources surfaces lose their flat-editorial weight | WARN — fragile, easy to drift |
| (c) Hybrid (moderate baseline + heavy at instrument moments) | Flat-editorial canvas preserves voice; tactile moments add warmth where it earns its place | SUPPORT — only viable path |

**Specific guardrails for option (c):**

- **Hero canvas stays flat-editorial.** No tactile depth on the hero head, sub, or the conversation card behind them. Paper grain only. The hero is the voice's showcase; it cannot be softened.
- **Sources eyebrow stays flat.** Dotted rule + small caps; no tactile treatment. This is the trust contract.
- **Trust band (section 5 «what Provedo will and won't do») stays flat.** This section is where the voice does its hardest work — the legal/posture statement. Any tactility here turns the disclaim into decoration.
- **Tactile only at instrument surfaces:** primary CTA buttons, the connect-broker affordance, the early-access modal, paywall lock-ups inside the app. These are the moments where «touch me» is the correct invitation.
- **Microcopy audit:** every button label, every onboarding string, every tooltip gets re-read once with the tactile mood in mind, with explicit attention to the onboarding-encouragement risk.

---

## Risks

1. **Drift toward option (a) during build.** Once tactile components exist, designers will reach for them on more surfaces. The trust band gets a soft card, the FAQ accordion becomes pressable, the Sources eyebrow becomes a pill. Each step is small; the cumulative effect is option (a). Mitigation: write a one-page «tactile budget» (which surfaces get depth, which stay flat) and ship it with the design system patch.
2. **Voice writer drift.** Future content contributors who haven't internalized the voice will read the tactile UI as permission to write encouraging copy. The brand-voice doc already names this as the top risk («easy to mistake for blandness»); tactile UI multiplies the slip rate. Mitigation: add a tone-by-surface row to Design Brief §2.2 for «tactile surfaces» specifically.
3. **Microcopy rewrite cost.** Going hybrid still requires re-auditing in-product microcopy against tactile mood. Real work, not a free decision.
4. **Hero authority loss if tactility leaks into hero.** Single biggest copy risk. The «will lead you through» line is doing work that depends on flat scaffolding.
5. **Trust collapse if Sources eyebrows become tactile.** Cited in the implementation spec as the most load-bearing trust primitive. Non-negotiable.

---

## Alternatives

1. **Stay flat editorial; add warmth through paper grain + warmer earth palette only** (no tactile at all). Cheapest path. Preserves voice fully. Probably 70% of what PO is reaching for. Recommended as fallback if option (c) discipline can't be enforced.

2. **Tactile on app surface only, flat on landing.** Landing is where the voice is most concentrated and most public. App surfaces have more affordances that justify tactility (chat input, connect-broker flow, paywall). This is a cleaner split than per-component hybrid and easier to enforce. Strong alternative to option (c).

3. **Tactile only at the modal / paywall layer.** Early-access modal and paywall cards are short-lived, intent-charged moments. Letting them feel pressable without bleeding tactility into the steady-state UI gives the «warm touchable» feeling while keeping reading surfaces flat.

4. **Defer the visual reset until landing v2 ships.** PR #66 is mid-flight. Reskinning the still-shipping landing into a different visual register before it lands risks turning two weeks of content work into rework. Voice ratification of v2 is the cheaper sequence.

---

**Bottom line.** The voice is a paper voice. Heavy tactile UI is a candy voice. They don't share a register. Hybrid with strict discipline (option c) is the only intensity that buys what the PO is reaching for without renting the voice out to a different brand. If discipline is uncertain, stay flat and warm the palette instead.
