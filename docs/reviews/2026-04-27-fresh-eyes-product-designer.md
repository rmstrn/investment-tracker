# Fresh-eyes design audit — Provedo landing

**Reviewer:** outside senior product-designer (one-day audit, no prior context)
**Date:** 2026-04-27
**URL:** investment-tracker-web-git-feat-lp-pr-7c8919-…vercel.app (auth-walled; audited from rendered React source in `apps/web/src/app/(marketing)/`)
**Lens:** B2C cold-visitor walking a 2026 fintech-AI landing for the first time

---

## First-impression read (5-second take)

Quiet, confident, almost editorial — feels less like a SaaS landing and more like a Stripe-meets-publication essay. The cream background and teal restraint signal «this is for someone who reads» rather than «this is going to convert you.» But within those first five seconds the hero does not telegraph what the product *does* — I see a chat card that's still typing and a calm headline I have to parse. The product category lands later than it should.

---

## Top 3 things working

1. **The chat-app-shell as the hero artifact.** A bordered, headed «Provedo · live» card with a real conversation typing into it is the single best visual move on the page. It's the product, not a stock illustration. The shell is reused in §S4, which gives the whole page a coherent visual shorthand for «this is what an answer looks like.»
2. **The negation/affirmation card pair (§S3).** The asymmetric depth treatment — flat slate card on the left, lifted cream card with teal-tinted shadow on the right — makes the positioning land *visually* without needing a literal versus-table. This is the one place on the page where the design is doing argumentative work.
3. **Editorial dark section (§S6) closer.** The two-line «You hold the assets. / *Provedo holds the context.*» with the second line indented and gradient-clipped is a real typographic moment. The oversized decorative quote glyph behind the body adds a magazine-like depth that almost no fintech landing of 2026 has.

---

## Top 5 things weak

1. **Hero (§S1) — no product anchor in the headline.** «Provedo will lead you through your portfolio» + «Notice what you'd miss across all your brokers.» — neither line names *what the thing is*. A cold visitor's first parse is «portfolio coach? broker app? newsletter?» The chat card on the right is the actual category-tell, but if the user's eye lands left-first (it will) they get poetry before product.
2. **Hero CTA «Ask Provedo» is scoped wrong.** It anchors to `#demo` (the §S4 teaser bento), not to a real product entry. So the primary action on the page is essentially «scroll down.» For a pre-alpha with a free tier, the CTA should either be «Start free» or «See it answer» — anything that feels like motion forward, not a soft scroll.
3. **§S2 numeric proof bar doesn't have numbers.** Three of four cells use words («Hundreds», «Every», «Sources») and only one cell carries an actual figure («5 min»). A «proof bar» with no proof reads as decorative — and the «Sources / for every answer» hero cell is the third place on the page where the same idea is restated. Cell 4 should die or become a real metric (citation rate, broker count once verified, hours saved).
4. **Visual rhythm collapses between §S4 → §S5 → §S6.** Three full-width centered-headline + grid sections in a row, all on warm-cream-or-white, all with the same h2 cadence. There's no breathing room or compositional break. By §S5 the page starts to feel like a doc rather than a pitch. The bento in §S5 is asymmetric, but the section *around* it is symmetric, so the asymmetry doesn't read.
5. **The ChatAppShell glow is a one-trick atmosphere.** The 120px outer teal halo + warm-cream radials in the hero are nice for 0.5 seconds, then they're identical at every recurrence. There's no temperature shift across the page — every section is cream + teal + slate. Feels disciplined at first, monotonous by the bottom.

Honorable mention: header «Get started» CTA points to `#waitlist`, which doesn't appear to exist on the page anymore (the dropped waitlist box). Dead anchor on the most important top-right action.

---

## Top 3 recommendations (concrete moves)

1. **Rewrite the hero left column to lead with category.** Replace the headline with something that names the thing in five words («Your portfolio. One place. Ask anything.» or similar). Keep «Notice what you'd miss…» as the sub. The poetry can survive — it just can't be the load-bearing first line. And give the CTA a real destination (sign-in, free tier, or live demo route) — not a soft scroll into the same page.
2. **Kill or replace §S2 entirely.** As-is it's a typographic decoration, not proof. Either: (a) collapse it into a single line of small mono text under the hero CTA («Hundreds of brokers · cited sources · 50 free questions/mo»), or (b) make it a real proof strip — citations-per-answer count, broker count, average response time. Right now it's eating 200vh of valuable above-fold-adjacent space saying nothing the hero or §S3 hasn't said.
3. **Break the symmetric-rhythm middle by inverting one section.** Take §S5 (insights) or §S8 (broker marquee) and pull it full-bleed with a different temperature — warm dark, or off-white-with-grain, or even a sideways scroll variant. The two dark editorial sections (§S6 + §S10) currently book-end the bottom third — that's one too many of the same visual move. Promote one of them up the page to break the cream monoculture, or differentiate them so they don't read as a rhyme that's actually a repeat.

---

## Overall score: would you ship this for a 2026 fintech-AI startup?

**6.5 / 10.**

It's *better* than the median 2026 fintech-AI landing — most of which are gradient-violet AI-sparkle slop — and the editorial restraint is genuinely distinctive. The chat-shell-as-hero and the §S3 asymmetric cards are real craft. But it's not yet shippable as the canonical first-impression for a pre-alpha launch: the hero doesn't anchor the category in five seconds, the §S2 proof bar is decoration pretending to be substance, and the middle of the page sags into doc-rhythm. Twenty hours of editing on the hero copy + §S2 + a single rhythm-break would push this to an 8.

What I'd keep guarding: the calm. Do not let anyone «add energy» by introducing gradients, animated charts, or product screenshots in the hero. The quietness is the moat — it just needs the first headline to do more work.
