# Fresh-eyes editorial audit — Provedo landing

**Reviewer:** outside editorial lead (cold read, no prior project exposure)
**Date:** 2026-04-27
**Method:** preview was 401-walled; copy read from React components in `apps/web/src/app/(marketing)/_components/` per brief.
**Scope:** marketing landing page (S1–S10) + header + footer. No docs, no spec, no prior content artefacts read.

---

## Editorial verdict (one paragraph, plain prose)

The page has a real voice — quiet, observational, almost editorial — and that's rare for a fintech landing. The hero earns its first beat. «Provedo will lead you through your portfolio. Notice what you'd miss across all your brokers.» reads as a promise, not a slogan, and the typed-out chat answer underneath makes the promise concrete in a way most landings never bother with. After that, the page slowly loses its discipline. The voice keeps speaking *about Provedo* in third person — «Provedo holds», «Provedo notices», «Provedo cites» — until the product starts to feel like a brand book reciting itself. Three sections in a row repeat the «sources / cites / notice» triad in nearly identical phrasing. The S2 proof bar is a string of single words («Hundreds», «Every», «5 min», «Sources») that mean nothing without their fine print and read like a CFO's first draft of a brag wall. S4's header «Two answers. Same shape on every question.» is internal product-team language, not visitor language. By the time you reach S6's italic gradient «You hold the assets. Provedo holds the context.» the line is genuinely good — but you've already seen the same idea delivered four times. There is at least 25–30 percent slack in this page. Cut it and the voice gets sharper, not weaker.

---

## Top 5 lines to cut entirely

1. **«Two answers. Same shape on every question.»** (S4 header)
   *Internal-team copy describing a layout pattern, not a value. A visitor reads «answers» and «shape» and gets nothing from it.*

2. **«These are two of the questions Provedo answers daily. Same shape on every one — read, mono tokens, sources.»** (S4 sub)
   *«Read, mono tokens, sources» is design-system vocabulary leaking into marketing copy. Visitors do not know what a mono token is and should not have to.*

3. **«Every / observation cited / with sources inline»** (S2 proof bar cell #2)
   *«Every» as a giant number-replacement is a stunt that doesn't pay off — it's not actually a number, it's an adverb. The «sources» promise is already cell #4 of the same row.*

4. **«5 min / a week / the whole habit»** (S2 proof bar cell #3)
   *Unsubstantiated time claim with no source for a product that asks visitors to believe in source-citation. «The whole habit» is also vague to the point of meaning nothing.*

5. **«— and growing»** (S8 broker marquee tail)
   *Italic afterthought that adds zero information after a marquee already showing twelve broker names plus the word «Hundreds» three sections earlier.*

---

## Top 5 lines to rewrite

1. **Original:** «Notice what you'd miss across all your brokers.» (S1 sub)
   **Rewrite:** «See what's moving across every broker, before you'd notice it yourself.»
   *«What you'd miss» is a double-conditional that takes a beat to parse. The rewrite keeps the promise but lands in active tense.*

2. **Original:** «Provedo holds context across every broker — knows what you own, what changed, where the deltas matter.» (S5 hero card)
   **Rewrite:** «Connect every broker once. Provedo keeps track of what you own, what changed, and what's worth a look.»
   *«Holds context», «deltas matter» is engineer voice. The rewrite gives a user verb («connect») and replaces «deltas» with English.*

4. **Original:** «Hundreds of brokers and exchanges, in one place — Provedo reads them all.» (S8 sub)
   **Rewrite:** «One chat. Every broker you use. Read-only, no trading credentials.»
   *Current line repeats the S2 «Hundreds» beat verbatim and adds «reads them all» which echoes other sections. Rewrite swaps the third repetition for a security signal visitors actually want at this point in the scroll.*

3. **Original:** «If you're wondering, you're not the first.» (S9 FAQ intro)
   **Rewrite:** «The questions everyone asks first.»
   *Original is cute but condescending on a re-read («you're not the first» = «you're predictable»). Rewrite is shorter and sets the same expectation.*

5. **Original:** «What does "pre-alpha" mean? — Provedo is in active build. The Free tier is locked; the product is real and runs on your real holdings. Some surfaces are still being polished, and you're early.» (FAQ Q6)
   **Rewrite:** «What does "pre-alpha" mean? — It runs on your real holdings today. Some screens are rough, some features land week by week. You're early — which is the point.»
   *«The Free tier is locked» reads as a contradiction (locked = unavailable, in most product vocabulary). «You're early» needs a payoff to land — the rewrite gives one.*

---

## Top 3 lines that should be added

1. **Above the hero CTA «Ask Provedo»** — a one-line trust anchor:
   **«Read-only. We never touch a trade.»**
   *The page sells «we read your broker accounts» for ~700 px before mentioning that read-only access is the whole security model. That belongs near the first CTA, not buried in FAQ Q5.*

2. **At the top of S5 (Insights), as a small eyebrow above the heading** — a frequency anchor:
   **«Weekly digest · daily on demand»**
   *The S5 heading promises «A few minutes a day» but never tells you when those minutes happen, who initiates them (you? the product?), or how. One line of microcopy fixes it.*

3. **In the footer disclaimer block, as a one-line opener before the legal paragraph** — a human-language summary:
   **«Plain English: we tell you what's in your portfolio. We don't tell you what to do with it.»**
   *The current Layer-1 «Provedo provides general information…» reads like the lawyer wrote it, because the lawyer did. A one-line plain-English opener costs nothing and carries the regulatory frame in the brand voice instead of breaking it.*

---

## If I had to cut 30% of words

The S2 proof bar (cells 2 and 3) plus the S4 sub plus all repetitions of «cited / sources / observation» beyond their first occurrence in S3 would absorb most of it. The S5 hero card sentence and the FAQ intro line would close the gap. The page would lose nothing the first-time reader needs and would gain pace.

---

## Overall editorial score: 6.5 / 10

«Would you ship this without rewrites?» — No. The hero, the S6 dark editorial section, and the FAQ are close to ship-ready. The proof bar, the S4 demo header, and the S5 hero bullet need at least one more pass. The voice is good enough to be worth defending; right now the page is diluting it by saying the same true thing four ways.
