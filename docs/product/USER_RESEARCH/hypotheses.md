# Hypotheses Log

**Owner:** `user-researcher` agent
**Started:** 2026-04-23 (after v2 discovery rewrite)
**Format:** `H-NNN — statement — status — evidence-count — last-tested-date`
**Status values:** `untested` · `partial-desk` (supported by desk research only) · `partial-interview` (1-2 interviews) · `validated` (3+ consistent interviews) · `invalidated` (3+ contradicting)

Purpose: single source of truth for what we CLAIM vs what we have EVIDENCE for.

---

## Positioning hypotheses (from `02_POSITIONING.md`)

### Wedge + UX

- **H-001** — Retail multi-broker users prefer chat-first UX over dashboard-first for portfolio insights — `untested` — 0 interviews — 2026-04-23.
  Desk evidence mixed: Getquin keeps aggregator-first with AI layered; PortfolioPilot dashboard+chat; Origin is conversation-led. No evidence yet what users actually prefer.

- **H-002** — "AI chat with YOUR aggregated portfolio" wedge is uncontested for retail non-HNW non-advisor segment in US+EU — `invalidated (partial)` — 0 interviews — 2026-04-23.
  Desk evidence: PortfolioPilot, Origin, Mezzi, Getquin, Fey, Wealthfolio all occupy overlapping parts. Narrower wedge ("not-advisor framed + US+EU + chat-first + multi-broker") remains lightly contested but not empty. See `01_DISCOVERY.md` v2 §2.

- **H-003** — "Explicitly not an advisor" is a positive differentiator vs Origin's "SEC-regulated AI advisor" positioning — `untested` — 0 interviews — 2026-04-23.
  Critical test: does retail perceive "not-advisor" as trustworthy-restraint or as weak/untrustworthy?

- **H-004** — Proactive weekly insights (push notifications with 3 observations) are desirable over ad-hoc queries — `untested` — 0 interviews — 2026-04-23.
  Desk evidence: Mezzi + Origin offer "24/7 monitoring" or "daily recaps" as value claim. No user-side validation.

- **H-005** — Source citation on every AI answer is a trust trigger, not just UX nice-to-have — `untested` — 0 interviews — 2026-04-23.

- **H-006** — Read-only broker connection is a TRUST BENEFIT, not a feature limitation, in the user's mind — `untested` — 0 interviews — 2026-04-23.
  Competing signal: PP users seem comfortable with read-only. But explicit validation not done.

### ICP A — Multi-broker millennial (28-40, $20K-100K)

- **H-010** — Exists in meaningful volume: retail users 28-40, $20-100K, 2-3 brokers, weekly ChatGPT users — `partial-desk` — 0 interviews — 2026-04-23.
  Evidence: PortfolioPilot's 40K users, Empower's userbase, Getquin's 500K, Monarch 13K+ institutions claim all imply segment exists. Size uncertain.

- **H-011** — Their primary pain is "one view across brokers" — `untested` — 0 interviews — 2026-04-23.
  Competing pain candidates: tax prep, dividend timing, rebalancing anxiety, performance-vs-benchmark. Unknown which dominates.

- **H-012** — They have tried spreadsheet tracking and abandoned it — `untested` — 0 interviews — 2026-04-23.

- **H-013** — They would pay $8-10/mo for the value described — `untested` — 0 interviews — 2026-04-23.
  Plus tier cluster at $80-120/yr has precedent (Copilot, Snowball, Monarch, Getquin) — pricing is plausible but not willingness-to-pay validated.

### ICP B — AI-native newcomer (22-32, $2K-20K)

- **H-020** — Exists in volume and uses ChatGPT daily — `partial-desk` — 0 interviews — 2026-04-23.

- **H-021** — Their small portfolios ($2-20K) often span 2+ venues (stocks + crypto) — `untested` — 0 interviews — 2026-04-23.
  Concern: Newcomers may be ONE-broker users for whom aggregation adds no value.

- **H-022** — They prefer chat over TikTok-style feeds for portfolio understanding — `untested` — 0 interviews — 2026-04-23.

- **H-023** — They would convert Free → Plus if AI value is visible in first 5 messages — `untested` — 0 interviews — 2026-04-23.

### Acquisition + channel

- **H-030** — Reddit r/personalfinance + r/investing is top organic channel for ICP A — `partial-desk` — 0 interviews — 2026-04-23.
  Evidence: multiple competitor threads exist on those subreddits.

- **H-031** — TikTok finance creators + Reels drive ICP B awareness — `untested` — 0 interviews — 2026-04-23.

- **H-032** — Product Hunt launch is effective for AI-investing products in this wave — `partial-desk` — 0 interviews — 2026-04-23.
  Evidence: Fey + PortfolioPilot + Mezzi all had Product Hunt presence.

---

## Pricing hypotheses

- **H-040** — Free tier (2 accounts, 90-day, 5 msg/day, 1 insight/week) is sufficient to prove AI value — `untested` — 0 interviews — 2026-04-23.

- **H-041** — Plus $8-10/mo is at market anchor and will not feel overpriced — `partial-desk` — 0 interviews — 2026-04-23.
  Evidence: Copilot $7.92, Snowball Starter $9.99, Sharesight Starter $7, Getquin Premium ~$8 — crowded cluster.

- **H-042** — Pro $20/mo matches PP Gold exactly; users will perceive value parity or better — `untested` — 0 interviews — 2026-04-23.
  Concern: PP has 40K proof, we are pre-alpha. Direct price match with unproven product may seem bold.

- **H-043** — Usage-gate (AI messages per day/month) feels more natural for AI product than account-count gate — `untested` — 0 interviews — 2026-04-23.
  Desk evidence: Fiscal.ai pioneered prompts-per-month pricing; no other competitor uses it as primary gate.

---

## New hypotheses surfaced by v2 discovery (2026-04-23)

- **H-050** — ICP C candidate: privacy-conscious self-directed (Wealthfolio/Ghostfolio user) is a viable segment to address — `partial-desk` — 0 interviews — 2026-04-23.
  Evidence: Wealthfolio 6,260 GitHub stars, sustained OSS communities. Open decision for Navigator.

- **H-051** — Moomoo Agentic Investing signals 2026 market direction toward "agent acts on your behalf" — not our direction — `partial-desk` — 0 interviews — 2026-04-23.
  Strategic: we are explicitly read-only. This is differentiation OR miss depending on user expectation.

- **H-052** — Russian-native retail investing AI market is near-uncontested — `partial-desk` — 0 interviews — 2026-04-23.
  Evidence: no Russian-language competitor surfaced in 34-product scan. But demand-volume unknown.

- **H-053** — EU retail with multi-broker pain is currently Getquin's or switches to new entrant — `untested` — 0 interviews — 2026-04-23.

- **H-054** — Switching cost FROM PortfolioPilot/Empower/Copilot is meaningful and blocks acquisition — `untested` — 0 interviews — 2026-04-23.

---

## Top priorities for first live interviews

Ranked by "leverage if invalidated":

1. **H-001 (chat-first preference)** — core wedge. If invalidated, positioning is fundamentally wrong.
2. **H-011 (primary pain = one view)** — if users' pain is actually tax/dividends/rebalance, wedge is different.
3. **H-054 (switching cost from existing tools)** — affects acquisition cost assumption, not just positioning.
4. **H-003 (not-advisor as positive)** — affects footer disclaimer + tone-of-voice decisions.
5. **H-042 (Pro $20 vs PP Gold)** — affects monetization model.

Interview scripts for ICP A and ICP B should include questions touching all of the above.

---

## New hypotheses surfaced by Option 4 review (2026-04-23)

Surfaced during independent user-researcher review of Option 4 «Second Brain for Your Portfolio» (see `docs/reviews/2026-04-23-user-researcher-option4.md`). All grounded in surrogate evidence (Product Hunt review corpus, App Store quotes, adjacent content analysis) — no live interviews yet.

- **H-060** — ICP A prospects primed by Notion/Obsidian culture decode «second brain for your portfolio» as a research/notes tool before decoding it as a portfolio tracker — `untested` — 0 interviews — 2026-04-23.
  Evidence: 4 out of 5 adjacent content sources (Jimmy's Journal «Building a Second Brain for Investing», Zen Finance AI, LinkedIn pulse by Anshul Mathur, The Investors Podcast / Tiago Forte episode) use «second brain» to mean a research/notes system, not a tracker. Notion user review #37 confirms «second brain» is PKM-native vocabulary. Test: pre-launch 5-second recall test on landing page.

- **H-061** — Retail investor native vocabulary for portfolio tools clusters on tool/action/visual verbs (track, organize, see, aggregate, dashboard, one place), not cognitive verbs (remember, notice, think, brain, memory) — `partial-desk` — 0 interviews — 2026-04-23.
  Evidence: 16 verbatim user quotes across Getquin / Kubera / Wealthfolio / Snowball / Empower corpus show zero cognitive-metaphor usage; tool/action verbs dominate. Test: interview prompt «describe the tool you wish existed for your portfolio» without suggesting vocabulary, code first 3 verbs used.

- **H-062** — ICP B (22-32, $2-20K) parses cognitive/PKM metaphors as signals of «not-for-me sophistication», reducing conversion — `untested` — 0 interviews — 2026-04-23.
  Test: split-test landing copy between cognitive-frame («Second Brain») and tool-frame («All your investments, one conversation») with ICP B proxy audience; measure signup intent and qualitative decode.

- **H-063** — First-articulated retail investor pain in this category is fragmentation across brokers («multiple accounts», «one place») rather than cognitive-overload («can't hold in my head») — `partial-desk` — 0 interviews — 2026-04-23.
  Evidence: Product Hunt user quotes #2, #4, #8, #9, #15, #20 in review doc all lead with fragmentation; zero quotes lead with cognitive-overload framing. Test: open-ended interview question «what's the hardest part of tracking your investments right now?», code first-mention.

- **H-064** — Users respond more strongly to landing claims with concrete verbs/nouns (advice, place, balance-sheet, analyst, see) than to metaphorical noun phrases (second brain, command center, copilot) — `partial-desk` — 0 interviews — 2026-04-23.
  Test: A/B landing headline comparison across two frames; measure time-to-scroll, time-to-CTA, signup intent.

- **H-065** — Russian-language retail investor segment does not carry Notion/Forte cultural capital at the same density as US/EU; «Второй мозг для твоего портфеля» reads more clinically than «Second Brain for Your Portfolio» reads in English — `untested` — 0 interviews — 2026-04-23.
  Test: CIS/RU interview cohort reactions to bilingual copy. Critical if RU launch precedes post-alpha.

- **H-066** — Behavioral pattern-read output («you sold AAPL on the local low 3x last year») resonates strongest with post-mistake mid-career cohort ($30-150K, 30-50) rather than with ICP A ($20-100K, 28-40) millennial cohort — `partial-desk` — 0 interviews — 2026-04-23.
  Test: present mock Coach output across age/capital segments, measure emotional + trust response.

---

## Changelog

- 2026-04-23 — initial version created after v2 discovery rewrite; 26 hypotheses logged across wedge / ICP-A / ICP-B / acquisition / pricing / new-from-v2.
- 2026-04-23 — added H-060 through H-066 (7 new hypotheses) surfaced during Option 4 Second Brain independent user-researcher review.
