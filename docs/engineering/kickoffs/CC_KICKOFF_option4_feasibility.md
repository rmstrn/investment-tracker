# CC_KICKOFF — Option 4 Feasibility Check (Navigator → tech-lead)

**Date:** 2026-04-23
**From:** Navigator (PO co-pilot)
**To:** tech-lead
**Type:** Feasibility memo / proto-ADR request (not a ship-slice kickoff)
**Return format:** feasibility memo saved to `docs/CC_KICKOFF_option4_coach_adr.md` (per your choice of filename — suggested); return brief summary to Navigator: feasible Yes/No, key risks, estimated slices to MVP, any named blocker.

---

## Team-wide constraints reminder (MANDATORY)

Per `.agents/team/CONSTRAINTS.md` (PO-locked 2026-04-23):
1. **No spend without explicit PO approval.** Any paid service, SaaS, API with cost, cloud upgrade, contractor hire — surface as a recommendation with `«это потребует $X от тебя — нужно твоё согласие»`; default your artifact to the free alternative; wait for PO's explicit greenlight via Navigator.
2. **No external communication from PO's identity.** No posts, emails, DMs, PR comments on external repos, or any outreach under PO's name. Internal artifacts in this repo (memos, ADRs, TECH_DEBT entries, kickoff drafts) are fine.

If your memo recommends any spending (e.g. a new Anthropic model tier, a pattern-detection SaaS, a larger Fly machine class), label it explicitly with cost and mark as «pending PO approval». Never assume.

---

## Context — what PO locked 2026-04-23

Option 4 «Second Brain for Your Portfolio» is locked as the product's strategic direction (see `docs/DECISIONS.md` 2026-04-23 entry and `docs/product/STRATEGIC_OPTIONS_v1.md` v1.3). Hero locked bilingually. Three surfaces form the Second Brain:

- **Chat** — «the conversation with your second brain». Already partially shipped: Slice 3 (PR #50 `4881dfd`, 2026-04-20), Slice 4+ chat polish as UI_BACKLOG captures.
- **Insights Feed** — «what your second brain surfaces proactively». Shipped: Slice 6a (PR #64 `f752de3`, 2026-04-22) — read-only list + filter + local dismiss on `(app)/insights`.
- **Behavioral Coach** — «what your second brain notices about your behavior over time». **NEW vertical. No code shipped. No ADR drafted.**

Two other constraints (for your scope input, not for you to re-litigate):
- **Lane A** (information/education only, LOCKED). Coach must speak in observation/pattern-read voice, never «buy/sell» imperatives.
- **English-first launch** (LOCKED 2026-04-23). Day-1 content is English only. Russian parallel-drafted secondary, EU languages deferred. This narrows the earlier multi-language-day-1 constraint; your i18n scope input accordingly.

---

## Your task — feasibility gate (not ship-plan yet)

PO's question, translated: **Can we ship all three Second Brain surfaces (chat + insights + coach) to alpha credibly?** If yes, what's the eng slice breakdown and rough timeline? If no, what's the blocker and how is it sized?

Specifically, produce a feasibility memo answering:

### 1. What already exists (confirm via code inspection + merge-log)

- Chat surface: `apps/api/internal/handlers/ai_chat_*.go`, `apps/web/src/app/(app)/chat/**`, AI Service `apps/ai/src/ai_service/api/chat.py` (or analogous). Slice 3 merged. What's shipped vs what's gap for Second Brain-quality chat (source citations, portfolio-context injection, history retention, streaming polish)?
- Insights Feed: `apps/api/internal/handlers/ai_insights_*.go`, `apps/web/src/app/(app)/insights/**`. Slice 6a merged (read-only + local dismiss). What's gap for Second Brain-quality insights (persistent dismiss — Slice 6b scope; positive insight type — TD-091; typed action_url — TD-090; worker-generation loop — currently manual `/ai/insights/generate`)?
- Coach: does ANY coach scaffolding exist? `ai_chat_stream.go` CalloutView §14.1/§14.3 mentions behavioral-coach callouts inline in chat — is that vestigial scaffolding or a real surface?

### 2. What's new for Option 4 Coach vertical

The coach must read user's actual transaction history and surface behavioral patterns with narrative framing. Concretely, evaluate:

- **Pattern-detection service.** Where does it live? AI Service (Python, reasoning over trade history passed in prompt) or Core API worker (Go, rule-based detection + LLM narrative generation)? Architectural decision required.
- **Trade-history schema completeness.** `transactions` table already has buy/sell/dividend (Slice 5a PR #60); split/transfer/fee (Slice 5b) deferred per `UI_BACKLOG.md`. Are current fields (qty/price/fee/executed_at/asset_type) sufficient for pattern-read, or do we need additional metadata (e.g. order type, tagged intent)?
- **Temporal aggregation.** How many days of history are enough for first pattern-read? PO locked «day 30» as onboarding promise in `02_POSITIONING.md`. Is that enforceable as a hard gate, or is it a UX default with empty-state fallback for <30-day users?
- **Narrative generation.** LLM prompt template + pattern catalog (panic-sell, FOMO-buy, over-concentration, contrarian-signal, cost-averaging, etc.). Stored where? Versioned how?
- **Weekly cadence + delivery surface.** Weekly digest is the PO-locked cadence (see `02_POSITIONING.md` onboarding promise Stage 3). Is this a new page, a new insight-type inside the insights feed (reusing Slice 6a chassis), or a weekly email? Recommend with trade-offs.
- **Regulatory constraint enforcement.** Pattern narratives must NEVER say «sell X», «buy Y», «rebalance». Only observe pattern + name it + quantify it. Enforceable how? Prompt-level guardrail + post-generation regex filter + human-reviewed prompt template?
- **30-day cold-start UX.** Hero promises «remembers» but first month is empty. What's the engineering-side affordance? Empty-state coach tab that shows «Your second brain is learning — first pattern-read in 30 days»? Does this affect insights feed onboarding copy?

### 3. Slice breakdown + rough estimate

Produce a micro-PR slice list for the coach vertical (~200-600 LOC per slice, consistent with existing slice discipline). Minimum I need:

- Slice names (e.g. «Slice 8a — pattern-detection service skeleton», «Slice 8b — weekly coach endpoint», «Slice 8c — web coach surface»).
- Rough size per slice.
- Dependency order and which can run parallel with existing Slice 6b (persistent dismiss + backend) and Slice 12 (empty/error states).
- Rough timeline to first-credible-coach-surface assuming 1-person CC pace.

Also tell me: is coach feasible for **alpha blocker** status, or should it be explicitly **post-alpha**? PO's lock assumes coach ships by alpha — if you disagree, surface it now, don't paper over.

### 4. Blocking architectural decisions (enumerate)

List every ADR-sized decision the coach vertical forces, with your recommended direction + honest alternatives. At minimum I expect:

- Pattern-detection service location (AI Service vs Core API worker).
- Pattern catalog storage + versioning (hardcoded in prompt vs DB-backed vs YAML-configured).
- Weekly cadence trigger (cron worker vs on-demand vs user-initiated).
- Pattern-read regulatory guardrail mechanism.
- 30-day gate enforcement (hard vs soft).

Each decision: 2-3 sentences on recommendation + 2-3 sentences on alternative + 1 sentence on what tips the balance.

### 5. i18n scope input (English-first narrows this)

Earlier constraint was multi-language day-1 (EN + RU + likely DE/IT/ES/FR/PT). PO narrowed to **English-only day-1** 2026-04-23. Your scope input:

- Does this remove i18n infrastructure from MVP scope entirely, or does Russian-parallel-drafted content still require i18n plumbing?
- Pattern-detection narratives are LLM-generated at runtime — English-only simplifies prompt templates (one language). Confirm.
- Landing + microcopy + paywall are English-only day-1 — content-lead will produce English-first. Confirm no frontend i18n library needed for MVP.

### 6. Named blocker check

Is there any feasibility blocker you'd surface that would trigger PO's Oracle fallback path (per `DECISIONS.md` 2026-04-23)? Be explicit — naming a blocker now saves 3 weeks of content + eng work if coach is actually infeasible. Examples of blocker-class findings:

- «Trade history schema lacks X; adding X is a 2-slice migration with user-data backfill — coach ADR depends on it».
- «Pattern detection requires embeddings + vector store that we don't have; provisioning cost $X/mo».
- «Reasonable coach cadence requires worker infrastructure that's still TD-066».

---

## Inputs you can rely on

- `docs/DECISIONS.md` — 2026-04-23 entries (Option 4 lock; Lane A; Geography; English-first; read-only demote).
- `docs/product/STRATEGIC_OPTIONS_v1.md` v1.3 — Option 4 surfaces, risks, ICP.
- `docs/product/02_POSITIONING.md` v2 — Second Brain canvas + landing structure + onboarding promise.
- `docs/PO_HANDOFF.md` — current state, main tip, active TDs (34 active, 1 P1).
- `docs/03_ROADMAP.md` — current slice state.
- `docs/TECH_DEBT.md` — existing TD list. Relevant entries: TD-053 (insight tier gate), TD-066 (workers deploy), TD-080 (paywall wiring), TD-090 (typed action_url), TD-091 (positive insight type).
- `docs/merge-log.md` — what's actually shipped (Slice 3 chat PR #50, Slice 6a insights PR #64, etc.).
- `apps/api/internal/handlers/ai_*.go` — chat + insights backend surface.
- `apps/ai/src/ai_service/**` — AI Service structure.
- `apps/web/src/app/(app)/chat/**`, `apps/web/src/app/(app)/insights/**` — current UI surfaces.
- `tools/openapi/openapi.yaml` — source of truth for API contracts.

---

## NOT your scope (out-of-task explicitly)

- Writing the coach implementation code. You write memo + proposed slices + ADR drafts only; builders implement later.
- Writing ADRs as final documents (only drafts-inside-memo form).
- Anything product-side (brand / copy / design). Those are parallel dispatches to brand-strategist + content-lead; you'll see their output via Navigator synthesis later.
- Re-litigating Option 4 pick itself. That's PO-locked. Your scope is «can we actually build it?», not «is it the right call?».

---

## Acceptance criteria for your return

- [ ] Feasibility memo saved to `docs/CC_KICKOFF_option4_coach_adr.md` (or your preferred name under `docs/`).
- [ ] Brief summary returned to Navigator: feasible Yes/No (green/yellow/red), ≤5 bullets on key risks, slice count to coach-MVP, blocking decisions list.
- [ ] If any spend is implied in a recommendation — labeled explicitly with cost and «pending PO approval».
- [ ] If a named blocker warrants Oracle fallback — say so plainly, don't soft-pedal.
- [ ] No code shipped. No commits needed beyond the memo itself.
