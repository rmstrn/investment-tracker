# Fresh-eyes brand voice + copy audit — Provedo landing
**Date:** 2026-04-27
**Reviewer:** Senior brand voice editor (outside, fresh eyes)
**Scope:** Full landing page copy as a cold visitor would meet it.
**Method:** Preview was 401-walled, so copy was read directly from the React component source under `apps/web/src/app/(marketing)/_components/`. No project documentation, voice profile, prior reviews, or naming notes consulted.

---

## 1. What this page sounds like

A literate, slightly bookish fintech that is trying very hard not to sound like a fintech. Think **Notion's restraint crossed with Robinhood's product copy after a Sunday in a New Yorker editor's chair** — short clauses, italic asides, em-dashes, a fondness for the second-person observer voice ("Notice what you'd miss"). The register is calm, pre-alpha-honest, and consciously non-pushy. It earns trust by repeatedly de-positioning ("not advice," "not a robo-advisor," "not a brokerage") rather than by overselling.

The risk: that calmness is achieved partly by abstraction. Several lines describe the product's *posture* rather than what it does for me in the next ten seconds.

---

## 2. The three lines doing the most work

These are the moments where the voice locks in and the page would survive being read aloud:

### "Notice what you'd miss across all your brokers."
*(Hero subhead.)* The single best line on the page. Concrete benefit, second-person, contains the core insight (fragmented portfolio across brokers) without explaining it. The verb "notice" does double duty — it's what the user does *and* what the product does. Quietly perfect.

### "You hold the assets. / Provedo holds the context."
*(Editorial closer, S6.)* The cleanest brand sentence on the site. Symmetrical, owns a real distinction (assets vs. context), and gives the product a job description in two beats. This is the line you'd put on a t-shirt or in a deck.

### "Your portfolio lives in seven places. Your dividends arrive in three inboxes. The reasons you bought NVDA in 2023 are in a group chat you can't find."
*(Editorial body, S6.)* The most concrete, observed, human sentence on the entire landing. It's the only place I felt seen as a real person with a real mess. The page should have started here.

---

## 3. The five lines pulling the page down

### "Provedo will lead you through your portfolio."
*(Hero H1.)* Vague and slightly grand. "Lead through" is a metaphor with no specific payoff for the reader — lead me how, to what, ending where? Worse, it's a future-tense promise ("will lead") in the place that should land a present-tense fact. The sub does all the actual work; the hero is the warm-up act. Consider promoting the sub to H1.

### "A reader. / A noticer. / A source-keeper."
*(S3 affirmation card.)* "A noticer" is a coined noun trying very hard to be charming and instead reads twee. "A source-keeper" sounds medieval. These nouns are doing brand-personality work the verbs underneath them already do better. Keep the predicates, drop the nouns, or replace with normal English ("Reads every broker. / Surfaces what would slip past. / Cites every observation.").

### "Two answers. Same shape on every question."
*(S4 header.)* "Same shape" is internal-team language that has escaped onto the page. As a visitor I don't know what "shape" means yet — I'm being told a feature is consistent before being shown what the feature is. The supporting line then repeats it: "Same shape on every one — read, mono tokens, sources." That second sentence is component-spec talk. No reader should ever encounter the phrase "mono tokens" on a marketing page.

### "Questions you'd ask / If you're wondering, you're not the first."
*(S9 FAQ header.)* The intro line is twee in the same key as "noticer." It performs warmth where a plain "Common questions" would let the answers do the warming. Two cute beats stacked on top of each other ("you'd ask" + "you're not the first") tip into precious.

### "Provedo provides clarity, observation, context, and foresight — never advice, recommendations, or strategy."
*(FAQ Q1.)* A four-noun list answered by a three-noun list reads like a rehearsed disclaimer. "Foresight" is the wrong word for what the product actually does (it doesn't predict — it surfaces what's already true). The sentence wants to sound careful and ends up sounding lawyer-coached.

**Honourable mentions / minor:** "Open Provedo when you're ready" (no urgency, no reason to act now, reads as polite withdrawal); "— and growing" after the broker marquee (cliché, every SaaS uses it); "POSITIONING" eyebrow above S3 (internal taxonomy as visible UI label); "the whole habit" caption under "5 min / a week" (oblique — what habit?); "Ask Provedo" repeated three times as the only CTA verb (page never offers a softer entry like "See a sample answer" or "Try it on a sample portfolio").

---

## 4. Three things missing that should be on the page

### A first-screen "what just happened" reveal
The hero shows a chat. Great. But before I scroll, I have no proof point about scale, no number that anchors the value, no one-line "you'll save X / catch Y." The numeric proof bar (S2) is the second screen and would do real work in or directly under the hero. As shipped, the hero asks me to take a metaphor on faith.

### Any social or signal-of-realness beyond pre-alpha honesty
Testimonials are intentionally absent (which is correct for pre-alpha). But there's nothing in their place — no "built by people who used to run X," no count of beta users, no design-partner logos, no founder-note, nothing. The page is asking for trust without offering a single human attribution. Even one quiet line — "Built in 2026 by a small team who got tired of seven-broker spreadsheets" — would change the temperature.

### A real "for whom" line
The page never says who this is for. It assumes the reader self-identifies as someone with multiple brokers. That assumption is doing a lot of unspoken work — a one-liner ("If your portfolio lives in three or more places, this is for you") would qualify the audience without narrowing it the way the previously-dropped "audience whisper" reportedly did. Without it, casual visitors with one Robinhood account will bounce, not because the product is wrong for them, but because nothing on the page tells them whether it is.

---

## 5. Voice score: distinctive vs. generic SaaS

**6.5 / 10.**

The voice is more distinctive than 80% of fintech landings — the editorial rhythm (S6), the receipt-chrome "Sources" treatment, the negation cards, and the closer line are all real points of view. But the page hedges its own voice in three predictable places: the hero H1 retreats to abstraction, S3's "noticer / source-keeper" reaches for cute, and the FAQ slips into legalese-cosplay. A reader who liked the closer would be surprised by the hero, and vice versa — meaning the voice is **inconsistent across sections rather than fully owned end-to-end**.

The fix isn't more cleverness. It's deleting the cleverness that's already there ("noticer," "same shape," "foresight") and trusting the lines that already work ("Notice what you'd miss," "You hold the assets. Provedo holds the context.," the seven-places paragraph). The page would gain a full voice point from cuts alone, before adding a single new word.

---

## 6. Quick reading-rhythm note

The page pulls hardest in two places: the hero (good) and the dark editorial S6 (very good — that section has the only real prose paragraph and it lands). Between them, S2–S5 read as a series of well-designed *cards* rather than a story being told. A reader gets through them by scanning, not by reading. The repeat CTA (S10) doesn't earn a second ask because the body never built any tension to release.

If you cut S4's "Two answers / same shape" header to one sentence and let the two demo cards speak for themselves, and if you trim S5's bullets from three to two, the page would tighten by maybe 20 seconds of reading time and gain rhythm.

---

## 7. Microcopy roundup

| Where | What | Verdict |
|---|---|---|
| Header CTA | "Get started" | Generic. The body uses "Ask Provedo" — make the header match for consistency, or use "Try it free." |
| Hero CTA | "Ask Provedo" | Strong, on-brand, but it's the only CTA verb on the page. Variation would help. |
| S2 cell 4 sub | "cited inline, dated, traceable" | Good — three concrete attributes, no fluff. |
| S2 cell 1 sub | "every major one" | Vague after "Hundreds." Either drop or specify. |
| Marquee tail | "— and growing" | Cliché. Cut. |
| S6 Sources | "Pre-alpha JTBD interviews 2026-Q1 · ICP cohort signals" | "JTBD" and "ICP" are internal vocabulary visible to the public. Translate or drop. |
| Footer rhyme | "Notice what you'd miss." | Good — the page closes on its strongest line, which is the right move. |
| Footer disclaimer | "every decision stays yours" | One of the page's quiet wins. Keep. |

---

## 8. Single-paragraph verdict

The page has a real voice but doesn't fully trust it. The two best lines on the site are the sub-headline and the editorial closer; everything in between is alternately abstract ("lead you through"), twee ("a noticer"), or operational ("same shape on every question"). Cut the cleverness, promote the concrete, give the visitor one human signal of who is behind this, and answer "for whom" once explicitly. With those edits the voice score moves from 6.5 to a confident 8 without rewriting the core positioning.
