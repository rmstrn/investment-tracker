# Option 4 — Coach Vertical Feasibility Memo + ADR Drafts

**Author:** tech-lead
**Date:** 2026-04-23
**Brief:** `docs/CC_KICKOFF_option4_feasibility.md`
**Return target:** Navigator (brief summary) + this memo in repo

---

## Constraints inherited (from Navigator brief)

1. No spend without PO approval. Any recommendation that implies cost (larger Fly machine class, new SaaS, different LLM tier) is labeled and left as `pending PO approval`.
2. No external communication in PO's name. Memo lives in-repo. No outreach.
3. Option 4 is LOCKED. Scope is «can we build it?», not «is it the right call?».

---

## TL;DR — Verdict

**Feasible: YELLOW (green-leaning).** The three-surface Second Brain can ship to alpha credibly, but the coach vertical pushes alpha launch out by ~3-4 micro-PR slices and introduces three real risks that need explicit scoping before first-coach-slice starts.

- **Chat surface:** shipped enough for Second Brain framing (Slice 3 PR #50). Gap is marginal polish + source-citation discipline tightening in prompt templates — ~0.5 slice.
- **Insights Feed surface:** shipped (Slice 6a PR #64, read-only + local dismiss). Gap is Slice 6b scope (persistent dismiss + proper mutation) — already planned.
- **Coach surface:** **genuinely new vertical**. No scaffolding except vestigial `CalloutView` references in chat (§14.1/§14.3 — those are in-chat callouts, not a standalone coach surface). Needs 3-4 slices before first-credible-pattern-read ships.

**Top 3 risks driving the yellow read:**
1. **30-day cold-start UX.** Hero promises «remembers» — first month is structurally empty for new users. Mitigation is a design problem (empty-state onboarding copy that reframes «learning» as a feature), but it IS a blocker if product-designer can't solve it credibly.
2. **Pattern-detection architecture decision is load-bearing.** AI Service (Python, LLM reasoning over transaction history) vs Core API worker (Go, rule-based detection + LLM narrative) determines cost shape, latency, testability, and pattern-catalog evolution speed. See ADR draft 1 below.
3. **Worker infrastructure still open.** TD-066 (workers deploy) is the P1 currently deferred «to workers scope». Coach weekly cadence needs workers. This blocks first real pattern-read in production.

**Fallback recommendation:** if any of these three risks escalates during the first coach slice (8a), pull back to Oracle per `DECISIONS.md` 2026-04-23 escape hatch. Do not ship a broken coach.

**Estimated slice count to coach-MVP:** 4-5 micro-PRs (~1800-2500 LOC total) after Slice 6b completes. Calendar estimate deferred to PO — I don't commit dates, I commit slice budgets.

---

## Section 1 — What already exists (code inspection + merge-log)

### Chat surface
- **Backend (shipped):** `apps/api/internal/handlers/ai_chat_*.go` (stream, sync, persist, history, request, conversations). SSE reverse-proxy via `sseproxy`, single-writer `ai_usage` ledger (DECISIONS.md 2026-04-20), fingerprint dedup, Idempotency-Key (Slice 5a ADR 2026-04-21).
- **Backend (AI Service):** `apps/ai/src/ai_service/api/chat.py` (via module `ai_service/api`) + `agents/` + `tools/` + `llm/`. Anthropic client, tool_use streaming, portfolio-context injection.
- **Frontend (shipped):** `apps/web/src/app/(app)/chat/**` + `apps/web/src/app/(app)/chat/[id]/**`. SSE client over `fetch + ReadableStream`, chat reducer, 9 components incl. `CalloutView` §14.1/§14.3 (explainer + behavioral coach callouts inline in chat — this IS vestigial scaffolding for the coach concept, but it's an in-chat artefact, not a standalone coach surface).
- **Gap for Second Brain-quality chat:** 
  - Source citation enforcement in prompt template — needs review to confirm every factual claim in AI output lands a citation tool-use. Likely clean (Slice 3 wired sources per `04_DESIGN_BRIEF` §14.2), but worth a voice-check pass from content-lead side.
  - Portfolio-context injection must include trade history (for coach-style chat-drill-in: «why did I buy AAPL in Q2?»). Currently includes positions, not history. Small AI Service PR (~150 LOC).
  - **Estimated chat gap: 0.5 slice.**

### Insights Feed surface
- **Backend (shipped):** `apps/api/internal/handlers/ai_insights_*.go` (generate, mutations), `apps/api/internal/handlers/insights.go` (list). Generate is manual on-demand; there's no worker loop yet.
- **Frontend (shipped):** `apps/web/src/app/(app)/insights/**` (PR #64). `useInsights` (useInfiniteQuery cursor pagination), `useLocalDismissedInsights` (sessionStorage — Slice 6a ADR 2026-04-22). Severity filter + local dismiss + type filter.
- **Gap for Second Brain-quality insights:**
  - Slice 6b (persistent dismiss + backend mutation + TanStack invalidate) — already on roadmap.
  - TD-090 (typed `action_url` oneOf discriminated union) — P3, planned with Slice 6b.
  - TD-091 (positive insight type in backend enum) — PO-level decision; no code blocker.
  - TD-053 (per-week/per-day tier gate for `/ai/insights/generate`) — P2, Redis-counter planned.
  - Automated insight-generation loop: currently manual trigger; needs worker (depends on TD-066).
  - **Estimated insights gap: Slice 6b (~300 LOC) + insight-worker slice (blocked by TD-066).**

### Coach surface
- **Scaffolding that exists:** `CalloutView` component in `packages/ui` + `apps/web` ChatMessageItem renders §14.3 Behavioral Coach callouts inline in chat (per Slice 3 scope). This is IN-CHAT surfacing of a pattern-read, NOT a standalone coach surface. It's useful scaffolding (the frontend can render coach narratives) but does NOT constitute the coach vertical.
- **What's missing:**
  - Pattern-detection service (no code).
  - Pattern catalog (no data model).
  - Weekly cadence worker (no code; blocked by TD-066).
  - Coach endpoints (`GET /ai/coach/weekly`, `POST /ai/coach/pattern-read` or analogous — no OpenAPI entries).
  - Standalone `/coach` route in web app (no code).
  - 30-day gate enforcement logic (no code).
- **Estimated coach gap: 4-5 micro-PRs (see Section 3 slice breakdown).**

---

## Section 2 — Option 4 coach vertical — what's NEW

### 2.1 Pattern-detection service — architectural decision required

**Two plausible homes:**

**Option A — AI Service (Python) owns pattern detection + narrative generation.**
- Flow: Core API worker fetches user's transaction history (last 30/60/90 days) → POST to AI Service with history payload → AI Service invokes Anthropic with «behavioral-coach» system prompt that asks LLM to identify up-to-N patterns and generate narratives → returns structured `PatternRead[]` → Core API persists as insights of type `coach_weekly`.
- Pros: consolidated AI-reasoning surface; single prompt-engineering discipline; faster iteration on pattern catalog (edit prompt, not migrations); aligns with existing AI Service layering (`agents/` + `tools/`).
- Cons: LLM per pattern-read is expensive (~$0.02-0.05 per user per week at Sonnet; ~$0.005 at Haiku — cost note below); latency 5-30s range (Fly idle 60s — TD-050 concern is relevant); determinism is low (same history → slightly different narratives).

**Option B — Core API (Go) owns detection via rules, AI Service only does narrative.**
- Flow: Core API scheduled worker scans transaction history using deterministic rules («sold at local low», «bought after +5% gain», «concentration top-3 > 60%», «quarterly cost-averaging detected») → for each rule-fired pattern, POST narrative-gen request to AI Service → AI Service returns natural-language phrasing only.
- Pros: detection is deterministic + testable + cheap; pattern catalog evolves as code (TDD-able); AI Service reduced to narrative polish (~$0.001 per pattern — Haiku clearly appropriate); latency predictable; easy to audit «why did coach flag this?».
- Cons: two services touch coach (detection + narrative) — more moving parts; pattern catalog is code not prompt (slower iteration but safer); new Go module to build.

**Recommendation (ADR draft 1): Option B — Core API detection + AI Service narrative.**

*Why this tips:* (1) Lane A regulatory guardrail is structurally enforceable when detection is rule-based — no risk of LLM hallucinating a «sell AAPL» recommendation because the detection layer never passed a sell-recommendation pattern to the narrative layer. (2) Determinism matters for user trust — two users with the same 30-day history should see the same patterns flagged; only the narrative phrasing differs. (3) Cost predictability under Haiku is ~5-10× cheaper than Option A at Sonnet. (4) Pattern catalog as Go code is TDD-friendly — QA can test «does rule X fire on history Y?» directly, not through LLM variance.

*What tips the other way:* if PO wants a «surprising» coach that finds patterns we didn't pre-code, Option A's emergent-pattern capability is real. But for MVP the regulatory and trust argument beats the surprise argument.

*Cost note (pending PO approval — no spend yet):* Option B with Haiku narrative generation: ~$0.001-0.002 per weekly coach digest per user. At 1K users: ~$5-10/month. At 10K users: ~$50-100/month. Already fits within existing Anthropic API budget — no new approval needed until we hit 10K users. **Labeled for PO awareness, not for action.**

### 2.2 Trade-history schema completeness

Current `transactions` table (per Slice 5a PR #60): `account_id, symbol, asset_type, transaction_type (buy/sell/dividend), qty, price, fee, currency, executed_at, notes`. Fingerprint dedup lives in handler layer.

**Sufficient for MVP pattern-read:** YES for the pattern catalog we'd ship in Slice 8 (panic-sell, FOMO-buy, over-concentration, cost-averaging, contrarian-signal, dividend-clustering). These patterns need `symbol + qty + price + executed_at + transaction_type` — all present.

**What's missing but not MVP-blocking:**
- Tagged user intent (`{rebalance|harvest-loss|speculative|dividend-capture|dollar-cost-avg}`) — would let coach distinguish «you panic-sold» from «you intentionally harvested». Add post-alpha.
- Split/transfer/fee (Slice 5b scope — deferred). Splits especially matter for «did you sell at local low?» normalization. Recommend Slice 5b ships before first coach slice — but can be parallel.
- Order type (market / limit / stop-loss). Not MVP-blocking.

**Schema gap: effectively zero for MVP.** No migration needed before coach Slice 8a.

### 2.3 Temporal aggregation — the 30-day gate

PO locked «day 30» as onboarding promise (`02_POSITIONING.md` v2 Stage 3).

**Soft gate, not hard gate, is the recommendation:**
- First 29 days: coach surface shows empty-state: «Your second brain is learning. First pattern-read in N days.» Decrementing count is a small UX touch that makes the gate feel productive rather than locked.
- Day 30+: coach runs weekly; first pattern-read delivered.
- Edge case: user imports historical trades via manual entry on day 1 → they already have 90+ days of data. Hard gate on calendar days would block them unfairly. **Soft gate triggered by transaction-count + span-of-history (e.g. ≥30 transactions OR ≥30 days of history spread from earliest-to-latest transaction) handles both new and historical-import users.**
- Recommendation: `has_sufficient_history(user_id) := (tx_count >= 30) OR (max(executed_at) - min(executed_at) >= 30 days)` — cheap SQL, deterministic, testable.

**30-day gate enforcement: design-level soft-gate, not schema-level hard-gate.** Addressed in Slice 8a.

### 2.4 Narrative generation + pattern catalog

**Pattern catalog (shipping in Slice 8a):**
1. **Panic-sell** — sold position within N days of >K% drawdown.
2. **FOMO-buy** — bought position within N days of >K% rally.
3. **Over-concentration** — single position > P% of portfolio for Q consecutive snapshots.
4. **Cost-averaging (positive)** — multiple buys of same symbol across N months with decreasing average price.
5. **Contrarian-signal** — bought during drawdown > K%, position now up.
6. **Dividend-clustering** — N dividend payments received in M weeks.
7. **Sell-at-local-low** — sold within N% of rolling-30d low, and symbol recovered ≥K% within 60 days.

Each rule is a pure Go function `(transactions, prices) → pattern | null`. Catalog is versioned as code. Pattern records in DB are `coach_pattern_reads(id, user_id, pattern_code, params, detected_at, pricing_asof, dismissed_at)`. Narrative field is populated post-detection by AI Service narrative call.

**Narrative prompt template (stored in `apps/ai/src/ai_service/prompts/coach_narrative.py` or analogous):** receives `pattern_code + params + (symbol, qty, price, date) context` + regulatory system prompt → produces narrative string in locked tone (no «buy/sell» imperatives, observation-only).

**Regulatory guardrail (Section 2.6) applies here.** Two-layer defense.

### 2.5 Weekly cadence + delivery surface

**Recommended surface: new `coach_weekly` insight-type inside the existing Insights Feed, surfaced with visual distinction.** Not a standalone `/coach` page.

*Why reuse insights-feed chassis:*
- Slice 6a infrastructure (list + filter + dismiss + severity mapping) exists. Extending with new `type: coach_weekly` is a ~50-LOC handler change + ~100-LOC UI polish (distinct card visual) + ~30-LOC filter-chip addition.
- Standalone `/coach` page duplicates chassis for marginal UX benefit. Users check insights feed weekly anyway.
- Visual distinction via `CalloutView` §14.3 (which already exists per Slice 3) — can render coach patterns as deliberate-different cards inside the feed.
- Week-scoped grouping: render last-7-days coach patterns above other insights; add «Week of April 14-20» anchor.

*Alternative considered:* standalone `/coach` page. Rejected for MVP scope — adds ~2 extra routes + mobile-nav change + separate loading state for marginal user-journey improvement. Can revisit post-alpha if user-feedback says coach is getting lost in general insights.

*Delivery cadence:* weekly worker runs pattern-detection across all users. Blocked by TD-066 (workers deploy). See Section 4 below.

*Email delivery:* NOT in MVP scope. Coach shows up in-app. Email triggers are content-lead scope + need email-infra (not yet set up). Add to post-alpha roadmap.

### 2.6 Regulatory guardrail — two-layer enforcement

**Layer 1 — Prompt-level:** coach narrative system prompt includes explicit NO imperatives about user actions. Banned phrases list: `(buy|sell|should|recommend|advise|rebalance|reduce|increase) [anything]`. Positive examples encouraged: `(observed|noticed|flagged|surfaced|pattern|history shows|you bought X on Y)`.

**Layer 2 — Post-generation regex filter:** after AI Service returns narrative string, a Go-side `validateCoachNarrative(s string) error` runs a regex gate: reject if contains `/\b(buy|sell|should|advise|recommend|rebalance)\b/i` OR performance-prediction verbs (`will outperform`, `expected to rise`, etc.). On reject, coach narrative falls back to deterministic template («Pattern: panic-sell. You sold AAPL on 2026-02-15 within 3 days of a 12% drawdown») — less elegant, always safe.

**Human review:** prompt template is code-reviewed before ship; pattern catalog is code-reviewed per-catalog-change. Standard review discipline (code-reviewer agent post-merge).

### 2.7 30-day cold-start UX — engineering affordance

Design problem first, engineering affordance second:
- Empty-state coach card on Insights Feed days 1-29: «Your second brain is learning. First pattern-read in [N] days.»
- Chat-side subtle nudge: when user asks «why am I down this month?», if they're pre-day-30 the AI adds a one-liner: «I'm still learning your patterns — by day 30 I'll surface what I notice.»
- Dashboard-side: N/A — coach doesn't surface on dashboard at day 1.
- This is a 50-LOC frontend + 30-LOC copy change. Product-designer + content-lead own the copy; frontend-engineer implements. **Not a blocker; solvable within Slice 8c (coach UI).**

---

## Section 3 — Slice breakdown (rough estimate)

Assumes Slice 6b (persistent dismiss) ships before coach Slice 8a. Assumes TD-066 (workers deploy) gets its own slice (call it Slice 9 — scoped by devops-engineer via tech-lead, per existing pattern).

### Slice 6b — Insights persistent dismiss + backend mutation (already planned, ~300 LOC, not blocked by coach)
- Not Option 4-new; already on roadmap.
- Enables Option 4 indirectly (dismiss polish makes insights feed feel like «your second brain remembered you dismissed this»).

### Slice 8a — Coach foundation: pattern-detection service + 3 rules (~500-600 LOC)
- New Go module `apps/api/internal/coach/` with pattern-rule interface + 3 initial rules (panic-sell, over-concentration, cost-averaging).
- Unit tests per rule (TDD — each rule has ≥5 golden-transaction-history test fixtures).
- No workers yet; detection runs on-demand via internal endpoint for testing.
- New migration for `coach_pattern_reads` table.
- No OpenAPI public endpoints yet; internal-auth-only test endpoint.
- **Dependencies:** Slice 6b merged (insights feed schema/extensibility); transactions table with fingerprint (already shipped). Nothing new.
- **Parallel-safe with:** Slice 12 (empty/error states), Slice 5b (transactions split/transfer/fee).

### Slice 8b — Coach narrative generation (AI Service) + coach_weekly insight integration (~400-500 LOC)
- AI Service: new `api/coach.py` endpoint `POST /coach/narrate` — receives pattern code + params, returns narrative string. Haiku model (cost note from 2.1).
- Core API: wire detection → narrative → insights-table insert as `type: coach_weekly`. Regex post-generation validator (Section 2.6 Layer 2).
- OpenAPI spec additions: internal `/coach/narrate` (AI Service side), insight type enum extended.
- Contract-sync k6 test (existing pattern per PR #54) passes.
- Unit tests: regex validator; narrative-empty-fallback; insight-wire-path.
- **Dependencies:** 8a merged; AI Service staging deploy (live per TD-070 close 2026-04-21).

### Slice 8c — Coach web surface inside Insights Feed + empty-state UX (~300-400 LOC)
- `InsightCard` gets `variant: coach_weekly` using `CalloutView` §14.3 pattern (already exists).
- Filter chip for coach-type insights.
- Week anchor header when coach insights present.
- Empty-state days 1-29 (copy owned by content-lead; frontend-engineer wires).
- Day-30 countdown shown in empty-state.
- Vitest smoke for coach-card render + empty-state rendering.
- **Dependencies:** 8b merged.

### Slice 8d — 4 more pattern rules (FOMO-buy, contrarian-signal, dividend-clustering, sell-at-local-low) (~300-400 LOC)
- Four more Go rule functions with their golden test fixtures.
- No handler changes; 8a chassis handles new rules automatically.
- **Dependencies:** 8a merged. Can ship in parallel with 8b/8c.

### Slice 8e — Weekly worker + cadence (~200-300 LOC)
- Worker consumes a new asynq queue `coach:weekly`.
- Cron trigger: Sunday 00:00 UTC enqueues one task per active user with sufficient history (2.3).
- Worker calls detection → narrative → insert, batched.
- **DEPENDENCIES: TD-066 resolution (workers deploy) — currently P1 deferred.** This is the biggest risk surface for coach-MVP timeline.

**Total coach-vertical slice count: 5 slices (8a through 8e). Rough LOC: 1700-2200 total.**

**Critical path to first-credible-coach-surface:**
1. Slice 6b (~300 LOC) — already planned.
2. Slice 8a (~500-600 LOC) — foundation.
3. Slice 8b (~400-500 LOC) — narrative.
4. Slice 8c (~300-400 LOC) — UI surface.
5. Slice 8d (~300-400 LOC) — more rules (can parallel with 8c).
6. Slice 8e (~200-300 LOC) — worker. **BLOCKED by TD-066 → Slice 9.**

**If Slice 9 (workers deploy = TD-066 close) does not ship before 8e:** coach exists but runs on-demand only (user hits «generate coach read» button). Acceptable for dogfood alpha, NOT acceptable for marketing-promised «weekly coach digest». PO should decide whether to:
- (a) close TD-066 first (adds a slice before 8e);
- (b) accept on-demand coach for alpha + automate post-alpha;
- (c) pull Slice 8e forward by having devops-engineer handle workers infra in same slice.

My recommendation: **(a) close TD-066 first.** It's the right sequencing and TD-066 is P1 anyway.

---

## Section 4 — Blocking architectural decisions (ADR drafts)

### ADR draft 1 — Pattern detection: Core API rule-based (Option B from Section 2.1)

**Decision:** detection runs in `apps/api/internal/coach/` as pure Go rule functions. Narrative generation runs in AI Service via `/coach/narrate` with Haiku.

**Why:** regulatory guardrail is structurally enforceable (detection layer never passes a sell-recommendation pattern); determinism + testability; cost predictability; pattern catalog as TDD-able code.

**Alternative:** AI Service LLM-based end-to-end detection. Rejected for MVP on regulatory + trust + cost grounds. May revisit post-alpha if user feedback demands emergent pattern discovery.

**Cost impact:** Haiku narrative generation ~$5-10/month at 1K users, ~$50-100/month at 10K users. Fits within existing budget — **pending PO approval at 10K users scale, not now**.

### ADR draft 2 — Pattern catalog as code, not DB-backed

**Decision:** pattern catalog lives in `apps/api/internal/coach/catalog/` as Go files. Each pattern is a `Rule` interface implementation with parameterized thresholds (configurable via env or config file for tuning).

**Why:** code-reviewable per change; TDD-able; versioned with source; no migration on catalog change; config file can hold thresholds for easy tuning.

**Alternative:** DB-backed catalog with admin UI for non-engineering tuning. Rejected — catalog changes are rare (every few weeks at most), engineering change cost < admin UI build cost, and non-engineers shouldn't be tuning coach semantics without review.

### ADR draft 3 — Weekly cadence via asynq worker (standard pattern)

**Decision:** `coach:weekly` asynq queue; Sunday 00:00 UTC cron enqueues per-user tasks; workers consume and run detection + narrative + insert.

**Why:** standard pattern already used for `sync_account`, `update_prices`. No new infra.

**Alternative (rejected):** real-time pattern-detection on every new transaction. Rejected — coach is a reflective surface, not a real-time alerter; weekly cadence matches user expectation; reduces LLM spend.

**Blocker:** TD-066 (workers deploy). Must close before Slice 8e.

### ADR draft 4 — Coach narrative two-layer regulatory guardrail (Section 2.6)

**Decision:** prompt-level «observe, don't advise» system prompt + post-generation regex filter (Go-side `validateCoachNarrative`) with deterministic-template fallback on reject.

**Why:** single layer is insufficient for regulatory claim («never says buy/sell»); two-layer defense holds under LLM misbehavior; fallback is degraded but always safe.

**Alternative (rejected):** single-layer prompt. Too much trust in LLM for a product identity claim (Lane A LOCKED).

### ADR draft 5 — 30-day gate as soft gate via transaction-count-or-history-span

**Decision:** `has_sufficient_history(user_id) := (tx_count >= 30) OR (max(executed_at) - min(executed_at) >= 30 days)`.

**Why:** handles both organic-30-day users and historical-import users; cheap SQL; testable; no calendar-enforced hard gate that penalizes importers.

**Alternative (rejected):** 30 days since user signup. Rejected — unfair to users who import 2 years of Robinhood history on day 1.

---

## Section 5 — i18n scope input

PO narrowed 2026-04-23 to **English-first launch**. Russian is parallel-drafted secondary. EU languages entirely deferred.

**My scope input:**

- **i18n library for MVP frontend: NOT REQUIRED.** English-only day-1 means `apps/web` ships with English strings inline. Russian parallel content lives in `docs/content/` as markdown drafts, not wired into UI. When Russian wave ships, we introduce i18n library (likely `next-intl` or `next-i18next`) then — not now. This saves ~1-2 slices of i18n scaffolding.
- **AI Service prompt templates: English-only.** All coach narrative prompts, all chat system prompts, English-only. Russian prompt variants drafted but not wired. This simplifies prompt engineering by ~40% — one language to calibrate, not seven.
- **API layer: language-agnostic.** Narratives are stored as strings; API doesn't care about language. When RU wave ships, we add `language` field to narrative-generation request + branch prompt templates per language. Not MVP.
- **Backend regulatory regex filter: English-only.** `validateCoachNarrative` regex banned-word list is English. When RU wave ships, we add RU-language regex branch. Not MVP.
- **Microcopy + landing copy: English-only day-1.** content-lead's scope (parallel dispatch) produces English primary + Russian secondary drafts in `docs/content/landing.md`. Only English is wired into the build.

**Bottom line: English-only simplifies MVP by ~2-3 weeks of scope.** PO's 2026-04-23 narrowing is a real scope win, not a cost.

---

## Section 6 — Named blocker check

**Do any of these warrant triggering the Oracle fallback per `DECISIONS.md` 2026-04-23 escape hatch?**

Evaluated three potential blocker-class findings:

1. **Trade-history schema gap.** NOT a blocker. Current schema supports MVP pattern catalog (Section 2.2). Splits/transfers/fees deferred per Slice 5b; acceptable parallel work.

2. **Pattern-detection requires embeddings/vector-store we don't have.** NOT a blocker under ADR 1 recommendation (rule-based detection, not LLM-embedding-search). If we chose Option A (AI Service LLM end-to-end) this would become a cost concern but still not a structural blocker.

3. **Worker infrastructure still TD-066.** **YELLOW, not red.** TD-066 is P1 already. Coach-MVP depends on it eventually (Slice 8e). But detection + narrative + UI (8a/8b/8c/8d) can all ship and be tested on-demand BEFORE workers land. So TD-066 is a sequencing concern for «weekly cadence marketing promise», not a blocker for «does coach surface exist at all». **Recommend closing TD-066 as its own slice before 8e; PO to confirm sequencing.**

**Conclusion: NO named blocker justifies Oracle fallback at this feasibility stage.** Three real risks to watch (30-day cold-start UX design, pattern-detection architecture decision held open for PO awareness, TD-066 sequencing) — none individually warrants fallback.

**Recommendation: proceed with Option 4. Ship Slice 6b, then open Slice 8a kickoff. Close TD-066 as Slice 9 before Slice 8e. If during Slice 8a any new blocker surfaces, re-evaluate then.**

---

## Section 7 — Brief summary for Navigator (copy/paste to PO)

**Feasibility verdict: YELLOW (green-leaning). Option 4 three-surface Second Brain is shippable to alpha.**

- Chat: shipped (Slice 3). ~0.5 slice gap for Second Brain-quality polish.
- Insights: shipped (Slice 6a). Slice 6b (persistent dismiss) already planned.
- Coach: NEW vertical. 5 slices (8a–8e, ~1700–2200 LOC total) to first-credible-surface.

**Key risks:**
1. 30-day cold-start UX — design problem, solvable in Slice 8c.
2. Pattern-detection architecture — recommended Option B (Core API rule-based + AI Service narrative); ADR draft included.
3. TD-066 (workers deploy) blocks Slice 8e (weekly cadence) — recommend closing TD-066 as Slice 9 before 8e.

**Blocking decisions enumerated:** 5 ADR drafts included in this memo. All have a recommended direction + honest alternative.

**No named blocker** justifies Oracle fallback at this stage. Proceed with Option 4.

**i18n scope under English-first lock:** NO i18n library needed for MVP frontend. AI Service prompts English-only. Microcopy English-only day-1. Saves ~2-3 weeks of scope.

**No spend implied at MVP scale.** Haiku narrative generation fits existing Anthropic budget (~$5-10/month at 1K users). PO awareness flagged for 10K-user scale (~$50-100/month) — not a now-decision.

**No external communication in PO's name.** All output is in-repo memos.

**Next kickoff:** Slice 6b (insights persistent dismiss) proceeds as already planned. Slice 8a (coach foundation) kickoff can be drafted once PO confirms this memo's recommendations.
