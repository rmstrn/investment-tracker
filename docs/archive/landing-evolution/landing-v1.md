# Landing Copy — Provedo v2 (EN-first, post-PO-lock 2026-04-25)

**Author:** content-lead
**Date:** 2026-04-25
**Status:** v2 LOCKED — hero/sub/CTA fixed by PO 2026-04-25; EN-first per PO directive «забудь про русский пока, делаем english версию». RU sections deferred to wave-2.
**Supersedes:** v1 (2026-04-25 morning, three-hero-variant draft + EN+RU parity).
**Language scope:** **EN ONLY for v2.** RU drafts preserved in git history at v1 commit; will return as wave-2 deliverable when PO greenlights RU surface.

**v2 changes from v1:**
1. **Hero locked to single phrase** (was H1/H2/H3 scored set): «Provedo will lead you through your portfolio» / sub «Notice what you'd miss across all your brokers» / CTA «Ask Provedo».
2. **RU columns dropped** in all bilingual tables. Single «Copy (EN)» column.
3. **Mid-page brand-world line** rewritten EN-only — no «Provedo проведёт» bilingual wordplay deployed.
4. **Tab 4 confirmed Schwab** (IBKR + Schwab; Russian brokers removed; US-equity ICP-aligned).
5. **Tagline integration:** «Notice what you'd miss» surfaces as proof-line in hero sub + Section 2 + Section 3 — not duplicated as standalone hero line.
6. **Footer disclaimer** retained verbatim per locked positioning.

**Constraints respected:**
- Rule 1 (no spend) — markdown only.
- Rule 2 (no external send) — repo-only artefact.
- Lane A — information/education only; zero performance promises.
- **Provedo 5-item EN guardrails (load-bearing through entire file):**
  1. Banned co-occurrence: Provedo + advice/advise/recommendation/strategy/suggestion → audited zero.
  2. AI EN system-prompt anchor verbatim in §A.
  3. EN verb-allowlist enforced.
  4. «Guidance» splitter — «provides clarity» preferred.
  5. Coach surface (§2 Tab 3) audited line-by-line.

---

## §0. Voice snapshot (applied to every line below)

Locked from `02_POSITIONING.md` v3.1 + `04_BRAND.md` v1.0 + `BRAND_VOICE/VOICE_PROFILE.md` 2026-04-25 post-Provedo refresh:

- **Archetype:** Magician + Sage primary · Everyman modifier. Provedo's *provedere* etymology («I provide for / I foresee») leans Magician (foresight) + Sage (stewardship/observation).
- **EN verb-allowlist for Provedo (agent-subject):** provides clarity · provides context · provides observation · provides foresight · reads · surfaces · shows · notices · holds · cites · answers · sees · explains · leads through (restrained).
- **EN verbs Provedo NEVER uses (BANNED):** recommends · advises · suggests · should · must · consider · provides advice / recommendations / strategy / suggestions / guidance-on-action.
- **User-facing imperatives (Everyman voice):** Ask · Connect · Try · See · Open · Start.
- **Provedo as named agent.** Copy says «Provedo notices» / «Provedo holds your context» — not «we recommend» / «we flagged». Reinforces Lane A through voice.

---

## §1. Hero (LOCKED 2026-04-25)

PO locked single phrase 2026-04-25. No A/B variants in v2 ship. Variants reserved for post-alpha conversion testing.

| Role | Copy (EN) | Chars |
|---|---|---|
| **Headline** | Provedo will lead you through your portfolio. | 45 |
| **Sub-hero** | Notice what you'd miss across all your brokers. | 47 |
| **Primary CTA** | Ask Provedo | 11 |
| **Trial CTA (secondary, below hero)** | Try Plus free for 14 days | 25 |
| **Trial small-print** | Card required. Cancel any time, one click. | 42 |
| **Free CTA (tertiary)** | Or start free forever | 21 |
| **Free small-print** | No card. No trial ending. 50 chat messages / month on Free. | 57 |

**Tagline integration.** «Notice what you'd miss» (the global primary tagline locked in `04_BRAND.md` §1) surfaces here as the **sub-hero line** — it carries the JTBD claim while the headline carries the brand-world Sage-guide promise. The tagline does NOT appear as a separate top-of-fold display element; it lives inside the hero sub, returns in §2 section sub, and returns again in §3 mid-page narrative as a proof anchor.

**Lane A audit:**
- «Will lead you through» — Sage-guide neighborhood, allowlist verb («leads through»). NOT «advise», NOT «recommend», NOT «provide guidance».
- «Notice what you'd miss» — Sage observation, no normative imperative.
- «Ask Provedo» — user-imperative (Everyman); not Provedo as advice-issuer.
- **EN guardrail check:** zero co-occurrence of Provedo + advice/advise/recommendation/strategy/suggestion. PASS.

---

## §2. Section 2 — 4 demo tabs (per locked structure)

Each tab shows mock user message + mock Provedo response. EN only.

**Section header:**

| Role | Copy (EN) |
|---|---|
| Section 2 hero | Ask on your actual holdings. |
| Section 2 sub | Four things Provedo can do on what you really own. Notice what you'd miss. |

(Tagline returns here as proof — second of three deployments.)

### Tab 1 — Performance-explanation («why am I down?»)

| Role | Copy (EN) |
|---|---|
| Tab label | Why? |
| User message | Why is my portfolio down this month? |
| Provedo response | You're down 4.2% this month. 62% of the drawdown is two positions: Apple (–11%, AAPL Q3 earnings) and Tesla (–8%, TSLA delivery miss). The rest of your portfolio is roughly flat. *[Chart of monthly P&L, sources cited inline.]* |

**Lane A audit:** Retrospective observation on real positions. Sources cited. No «sell AAPL», no «consider rebalancing», no «expected to recover». PASS. EN guardrail: no «provides» as Provedo-subject — clean.

### Tab 2 — Dividend-aware («when are dividends?»)

| Role | Copy (EN) |
|---|---|
| Tab label | Dividends |
| User message | When are dividends coming this quarter? |
| Provedo response | This quarter, $312 expected across your holdings. Largest: KO ex-div Sept 14 ($87), VZ ex-div Oct 7 ($74), MSFT ex-div Nov 19 ($61). Three smaller payments after that. *[Calendar view, broker-confirmed dates linked.]* |

**Lane A audit:** Forward-looking ONLY on disclosed corporate-action data (ex-div dates are public broker-confirmed facts, not predictions). PASS.

### Tab 3 — Pattern-recognition (Coach surface, retrospective) — HIGHEST RISK

| Role | Copy (EN) |
|---|---|
| Tab label | Patterns |
| User message | Anything unusual in my trades this year? |
| Provedo response | One pattern stands out. You sold Apple within 3 trading days of a >5% drop, three times last year. Each time, AAPL recovered above your sell price within 8 weeks. Provedo notices — no judgment, no advice. *[Trade timeline with sell points + 8-week-after marks.]* |

**Lane A audit (full per guardrail #5):**
- Retrospective only. Past trades + past price moves.
- Provedo named as agent of observation.
- Explicit «no judgment, no advice» disclaim baked in.
- **EN guardrail:** zero «provides advice / recommendations / strategy». Provedo «notices» — allowlist. PASS.
- US/EU/UK retrospective-observation framing: PASS.

### Tab 4 — Aggregation cross-broker (IBKR + Schwab)

| Role | Copy (EN) |
|---|---|
| Tab label | Aggregate |
| User message | How much tech am I holding across IBKR + Schwab? |
| Provedo response | Across both accounts, tech is 58% of your equity exposure. IBKR carries the bulk: AAPL ($14k), MSFT ($9k), NVDA ($8k). Schwab adds GOOG ($3k) and AMZN ($2k). For context, US retail median tech allocation is around 34%. *[Allocation pie + per-broker breakdown.]* |

**Lane A audit:** Cross-account aggregation. «Provides context» (allowlist). No «you should diversify», no «consider reducing». PASS.

---

## §3. Section 3 — Insights («pattern recognition» value prop)

**Section header:**

| Role | Copy (EN) | Chars |
|---|---|---|
| Section 3 hero | A few minutes a week. Everything that moved. | 46 |
| Section 3 sub | Provedo surfaces dividends, drawdowns, concentration shifts, and events — once a week, in one feed, not scattered across seven broker emails. Notice what you'd miss. | 169 |

(Tagline returns — third deployment, closing the proof-loop.)

### Three insight-type proof bullets

| # | Copy (EN) |
|---|---|
| 1 | Provedo holds context across every broker — knows what you own, what changed since last week, where the deltas matter. |
| 2 | Provedo surfaces what would slip past — incoming dividends, forming drawdowns, creeping concentration. |
| 3 | Provedo cites every observation. Every pattern shown ties back to a trade, an event, or a published source. |

**Lane A audit:**
- All three bullets use allowlist verbs (holds / surfaces / cites).
- Bullet 1 «knows what you own» = factual aggregation claim, not predictive.
- Bullet 2 «forming drawdowns» = observational; «forming» replaces older «before you notice» (which carried implicit-suggestion payload).
- Bullet 3 «cites every observation» = trust-through-transparency.
- **EN guardrail:** no «provides advice/recommendations/strategy». PASS.

### Mid-page brand-world section (Sage-guide narrative, EN-only)

This section carries the post-Provedo-lock equivalent of the Provedo-era «Second Brain» mid-page narrative. RU bilingual wordplay («Provedo проведёт») deferred to wave-2; EN-only equivalent below.

**Section header:**

| Role | Copy (EN) |
|---|---|
| Header | One brain. One feed. One chat. |

**Narrative body (~85 words EN):**

> Your portfolio lives in seven places. Your dividends arrive in three inboxes. The reasons you bought NVDA in 2023 are in a group chat you can't find.
>
> Provedo holds it in one place. Reads what you own across every broker. Notices what would slip past — a dividend coming, a drawdown forming, a concentration creeping up. Shows you patterns in your past trades — what you did, when, what came next.
>
> Across chat, weekly insights, and pattern-reads on your trades. On your real positions. With sources for every answer.

**Closing brand-world line (replaces v1 bilingual wordplay):**

> **Provedo sees what you hold and notices what you'd miss.**

**Rationale for closing line.** v1 used the bilingual «Provedo проведёт через всё это» as the closing line — RU-only asset, can't carry to EN-only landing. The replacement «Provedo sees what you hold and notices what you'd miss» does two jobs in one sentence: (1) restates the JTBD-pair (aggregation: «sees what you hold» + insights: «notices what you'd miss»), (2) embeds the locked tagline («Notice what you'd miss») as a proof anchor without quoting it as a standalone display line. RU wordplay returns when wave-2 RU surfaces ship.

**Lane A audit:**
- All Provedo verbs from allowlist (holds / reads / notices / surfaces / shows / sees).
- **EN guardrail:** zero «provides advice/recommendations/strategy». PASS.
- Resolves the disambiguation against Notion/Obsidian/Forte «research-notes» semantic: «seven places / three inboxes / group chat» grounds the metaphor in *aggregation + recall of what you own and what you did*, not *notes you took on stocks you researched*.

---

## §4. Section 4 — Aggregation marquee

**Section header:**

| Role | Copy (EN) |
|---|---|
| Section 4 hero | One chat holds everything. |
| Section 4 sub | 1000+ brokers and exchanges, in one place — Provedo reads them all. |

**Marquee components:** broker/exchange logos scrolling right-to-left (Fidelity · Schwab · Interactive Brokers · Robinhood · E*TRADE · Trading212 · Hargreaves Lansdown · Questrade · Wealthsimple · Coinbase · Binance · Kraken · etc.). Per Design Brief §5 grid + 02_POSITIONING.md §Design notes.

**Tech-lead verification flag:** «1000+» claim must be verified against current SnapTrade + Plaid + CCXT coverage before production. Fallback copy:

| Fallback | Copy (EN) |
|---|---|
| A | Hundreds of brokers and exchanges. |
| B | Every major broker. Every major exchange. |

---

## §5. Repeat-CTA block (pre-footer)

After Section 4 (aggregation marquee), repeat the dual-path CTA pattern from §1 hero. Same trial + free-forever structure; framed as «scrolled the full landing without clicking, here's the door».

| Role | Copy (EN) |
|---|---|
| Block header | Ready when you are. |
| Trial CTA | Try Plus free for 14 days |
| Free CTA | Or start free forever |
| Small-print | Plus: card required, cancel one click. Free: no card, no trial ending, 50 messages / month. |

---

## §6. Footer disclaimer (LOCKED, formal — Provedo-substituted)

**English (day-1):**

> Provedo is not a registered investment advisor. Information is provided for educational purposes only. Past performance is not indicative of future results. All investment decisions are your own.

**Substitution audit:** Provedo → Provedo. No other changes. Locked verbatim from `02_POSITIONING.md` §Footer disclaimer.

**EN guardrail check:** «Information is provided» — passive voice, no Provedo as subject of «provide». PASS audit. The disclaimer is the one place where «provided» appears in EN copy; it's a passive regulatory phrase, not a Provedo-as-subject claim. Acceptable.

---

## §7. SEO meta + OG tags

EN guardrails apply throughout. Title and description tested for «provide → advise» drift — clean.

### Title tag

| Field | Copy (EN) | Chars |
|---|---|---|
| Title | Provedo · Notice what you'd miss across all your brokers | 56 |

### Meta description

| Field | Copy (EN) | Chars |
|---|---|---|
| Description | Provedo holds your portfolio across every broker — answers your questions, surfaces what would slip past, shows you patterns in your past trades. With sources. | 156 |

**Audit:** allowlist verbs (holds/answers/surfaces/shows). Zero «provides advice/recommendations/strategy». PASS.

### Open Graph

| Field | Value |
|---|---|
| og:title | Provedo · Notice what you'd miss across all your brokers |
| og:description | Provedo will lead you through your portfolio — across every broker, with sources. Free forever, or try Plus 14 days. |
| og:type | website |
| og:locale | en_US |
| og:image | (suggested) 1200×630 PNG; minimal type-led mark; «Provedo» wordmark + tagline «Notice what you'd miss»; surface direction A — Modern AI-Tool Minimalist (per Design Brief v1.4 lock pending) |
| og:url | https://provedo.ai/ |

### Twitter card

| Field | Value |
|---|---|
| twitter:card | summary_large_image |
| twitter:title | Provedo · Notice what you'd miss across all your brokers |
| twitter:description | Provedo will lead you through your portfolio — across every broker, with sources. |
| twitter:image | (same as og:image) |

### Canonical

| Field | Value |
|---|---|
| canonical URL | https://provedo.ai/ |

**Audit:** «will lead you through» — allowlist Sage-guide register, not «provides advice». PASS guardrail.

---

## §A. AI EN system-prompt anchor (mandatory, verbatim)

Every EN AI-persona prompt that speaks as Provedo MUST include this clause verbatim:

> «You are Provedo. The name comes from Italian *provedere* «to provide for, to foresee» + Russian «проведу» «I will lead through». You provide *clarity, observation, foresight, context* — never *advice, recommendations, strategy, or guidance-on-action*. Frame all outputs as observation, not prescription. When the user asks "what should I do?", surface what they have and what's changed; never tell them what to do.»

Engineering-side AI integrations MUST inherit this clause. Future model upgrades MUST preserve all four element-pairs.

---

## §8. EN guardrail audit summary

Full document scanned for the 5-item EN copy guardrails:

| # | Guardrail | Audit result |
|---|---|---|
| 1 | Banned co-occurrence: Provedo + advice / advise / recommendation / strategy / suggestion | **ZERO occurrences** in any Provedo-as-subject EN sentence. Only appearance: «no judgment, no advice» (§2 Tab 3) — Provedo *disclaims* advice register, never claims it. PASS. |
| 2 | AI EN system-prompt anchor present verbatim | §A above. PASS. |
| 3 | EN verb-allowlist (provides clarity / context / observation / foresight; reads / surfaces / shows / notices / holds / cites / answers) | Used throughout. BANNED forms (provides advice/recommendations/strategy) — zero occurrences. PASS. |
| 4 | «Guidance» splitter: prefer «provides clarity» over «provides guidance» | «Provides guidance» does not appear. «Will lead you through» (hero) is Sage-companion register, not advisor-guidance register. PASS. |
| 5 | Behavioral-coach EN copy especially audit | §2 Tab 3 audited line-by-line. All Provedo-as-subject verbs from allowlist (notices/shows). Explicit «no judgment, no advice» disclaim. Retrospective scoping. PASS. |

**EN guardrail audit: CLEAN. Zero violations across 8 sections. Discipline holds.**

---

## §9. Lane A consolidated checklist

| Section | No «buy/sell» imperative? | No performance promise? | No advisor-paternalism? | Provedo named as agent? | Allowlist verbs only? |
|---|---|---|---|---|---|
| §1 Hero | ✅ | ✅ | ✅ | ✅ (will lead) | ✅ |
| §2 Tab 1 (Why?) | ✅ | ✅ | ✅ | ✅ (implicit; observation) | ✅ |
| §2 Tab 2 (Dividends) | ✅ | ✅ (forward-looking only on disclosed corp-action) | ✅ | ✅ | ✅ |
| §2 Tab 3 (Patterns) — HIGH RISK | ✅ | ✅ | ✅ (explicit «no judgment, no advice») | ✅ (Provedo notices) | ✅ |
| §2 Tab 4 (Aggregate) | ✅ | ✅ | ✅ | ✅ (provides context — allowlist) | ✅ |
| §3 Insights bullets | ✅ | ✅ | ✅ | ✅ (holds/surfaces/cites) | ✅ |
| §3 Mid-page narrative | ✅ | ✅ | ✅ | ✅ (holds/reads/notices/shows/sees) | ✅ |
| §4 Aggregation | ✅ | ✅ | ✅ | ✅ (reads them all) | ✅ |
| §5 Repeat-CTA | ✅ | ✅ | ✅ | n/a (user-imperative) | ✅ |
| §6 Footer | n/a | n/a | n/a | n/a (regulatory) | LOCKED |
| §7 Meta/OG | ✅ | ✅ | ✅ | ✅ (holds/will lead) | ✅ |

**Lane A: PASS across all sections.**

---

## §10. RU sections — deferred to wave-2

Per PO directive 2026-04-25 («забудь про русский пока, делаем english версию»), all RU copy from v1 has been removed from this file. v1 (git history at the prior commit) preserves the bilingual draft. When PO greenlights wave-2 RU surface:

1. Re-introduce RU column to all bilingual tables.
2. Restore the RU bilingual wordplay close in §3 mid-page («Provedo проведёт через всё это»).
3. Re-translate hero/sub/CTA to match locked RU rendering of «Notice what you'd miss» = «Замечает то, что ты упустил бы» per `04_BRAND.md` §1 tagline lock.
4. Restore RU footer disclaimer (preserved in `02_POSITIONING.md` §Footer disclaimer).
5. Re-audit RU side under same Lane A rules; RU has no special EN guardrails (Sage-clean «провести/проводить»).

**No RU copy ships in v2.** The only RU appearance is in this §10 explanatory paragraph (audit-trail note), not in user-facing landing.

---

## §11. Open questions for PO (return to Navigator)

1. **og:image direction.** v2 references «Modern AI-Tool Minimalist» direction A (PO-locked 2026-04-25). Awaiting product-designer's hi-fi asset; placeholder in §7 OG block.
2. **«1000+ brokers and exchanges» numeric verification.** Tech-lead verification flag still open. Fallback copy provided (§4).
3. **Section 2 sub line tagline echo placement.** v2 places tagline echo at end of section sub («Four things Provedo can do on what you really own. Notice what you'd miss.»). Alternative: standalone tagline display element above tabs grid. Recommendation: keep as section-sub embed (less display-noise). PO call.
4. **Repeat-CTA block (§5) tagline echo.** v2 does NOT echo tagline in §5 (already three echoes deployed: hero sub, §2 sub, §3 sub). Recommendation: hold echo discipline at three; do not over-deploy. PO call if four is preferred.

---

## §12. Files in this content suite (v2 wave)

**Updated this dispatch:**
- `docs/content/landing-provedo-v1.md` — this file (refactored to v2 EN-first per PO 2026-04-25 lock).

**Created this dispatch (siblings):**
- `docs/content/email-sequences-provedo-v1.md` — 5 templates (welcome / first-insight / weekly check-in / limit-approaching / upgrade offer).
- `docs/content/microcopy-provedo-v1.md` — buttons / tooltips / empty / loading / error / confirmations.
- `docs/content/paywall-provedo-v1.md` — modal copy + Free vs Plus comparison + 3 A/B variants.

**Preserved as historical record:**
- `docs/content/landing.md` — Provedo-era. NOT edited.
- `docs/content/email-sequences.md`, `microcopy.md`, `paywall.md`, `LANDING_BRIEF.md` — Provedo-era; NOT edited.

**No external communication sent. No emails dispatched. No social posts published. All artifacts live in repo only.**

---

## §13. Status & next steps

**Status:** v2 LOCKED for ship. EN-only per PO directive 2026-04-25. Ready for Navigator → frontend-engineer integration handoff.

**Recommended next steps (PO + Navigator):**
1. PO confirms v2 EN-only ship and the three open questions in §11.
2. Navigator dispatches frontend-engineer for `locales/en.json` integration once §11 resolved.
3. Tech-lead verifies «1000+ brokers and exchanges» claim in §4 before production deploy. Fallback copy provided.
4. RU wave-2 dispatch when PO greenlights.

**END landing-provedo-v1.md (v2)**
