# Product Owner Handoff — investment-tracker

**Что это:** документ для передачи состояния между сессиями Claude. Когда чат лагает / переполнен контекстом / теряется фокус — открыть новый чат, дать промт (внизу документа), Claude поднимает весь проект по этому файлу и доп.документам.

**Last updated:** 2026-04-24 — end-of-session snapshot after full pre-alpha product spec landed.

## Session 2026-04-23/24 — What happened

**Major productivity session.** Started with a broken single-agent «council» process; PO identified Rule 3 violation; rebuilt as 6 real independent specialist reviews → Navigator synthesis → 7 PO decisions → 4 execution dispatches (product-designer / content-lead / finance-advisor / legal-advisor) → 3 patch dispatches (coach UX rewrite / trial+content / 50-cap cost model). Product name locked. Domain purchased ($250).

**Commits this session (chronological top→bottom):**
- `21cf3ad` DECISIONS 7-locks entry
- `8836029` STRATEGIC_OPTIONS v1.6
- `b5eb108` POSITIONING v3 (imperative hero + dashboard-primary + Russia out)
- `990cfb5` NAMING Round 6 placeholder
- `e993bd4` PENDING_CLEANUPS (5 items tracked)
- `7fbc379` NAMING Round 6 (12 candidates, Memoro stays lead)
- `3524b33` NAME-LOCK sweep (Memoro everywhere)
- `250c410` commit-hash backfill
- `70139ef` PO_HANDOFF Memoro snapshot
- `21d865d` EXPENSES.md + first entry ($250 domain)
- `ac920a6` PENDING_CLEANUPS item #6 (physical address)
- `e5e0313` DECISIONS 4-locks entry (trial + cap + coach UX + free-forever)
- Content-lead patches: `893ef8f` / `038e385` / `ad18837` / `4a8baa5`
- Product-designer patches: coach-contextual rewrite v2.0, dashboard v1.1, DB v1.3, onboarding v1.1
- Finance-advisor patches: pricing + coach-tier + AI validation + benchmarks
- Legal-advisor drafts: `e20cbea` / `a789b54` / `99e78a7` / `7d25f33` / `d7635fb` / `80e8b5d`

## Locked decisions 2026-04-23 (product spec complete)

- **Product name:** **Memoro** (Latin «I remember»; pronounced «meh-MO-ro» EN / «мемóро» RU). Domain target: `memoro.co` — **purchased 2026-04-23 for $250** (see `docs/finance/EXPENSES.md`).
- **Tagline:** «Second Brain for Your Portfolio» — mid-page brand-world copy, NOT hero, NOT product name.
- **Hero:** imperative — «Ask your portfolio» EN / «Спроси свой портфель» RU.
- **Regulatory lane:** A (information/education only). Lane B/C explicitly rejected.
- **Geography:** global **без РФ**. US + EU + UK + LATAM + APAC + crypto-native. CIS per-country post-alpha.
- **Launch language:** English primary. Russian drafted parallel. EU languages (DE/IT/ES/FR/PT) deferred to wave-2.
- **Architecture:** dashboard-primary with AI woven (NOT chat-primary). Chat is a tab. 5 primary routes: Dashboard / Positions / Insights / Chat / Settings. iOS tab-bar 4.
- **Coach UX:** contextual — blinking dots on position cards / dashboard widgets / chat threads / insight cards / transaction rows + bell-dropdown top-bar hub (unread count). NO `/coach` route. NO filter-chip. Free teaser reveals subject not substance; «Upgrade to Plus to see detail» CTA.
- **Trial:** 14-day Plus, card required. No pushy copy. Day-13 has TWO equal-weight CTAs (Keep Plus / Cancel).
- **Free cap:** 50 messages/month (NO daily limit). **Haiku model** for Free tier (5x cheaper than Sonnet). Plus/Pro on Sonnet.
- **«Free is always Free»** — permanent brand commitment. Content-lead built landing + paywall copy around this.

## Rule 3 establishment

**Permanent rule** from this session (in `.agents/team/CONSTRAINTS.md` Rule 3 + `feedback_multi_agent_strategic_review.md` memory): strategic decisions (new metaphor / positioning / naming / brand / pricing structure / regulatory lane / ICP / major surface emphasis) require REAL parallel Agent-tool dispatch of 3-6 specialists in isolated contexts. Single-agent simulation forbidden. Navigator synthesizes with ONE weighted recommendation; PO decides.

Six independent reviews landed for Option 4 («Second Brain») — all 6 WARN, none SUPPORT, none REJECT. Synthesis in `docs/product/REVIEW_SYNTHESIS_2026-04-23.md`. PO chose condition-keep path (demote metaphor to tagline, imperative hero, product name Memoro from Round 5) → all 7 conditions locked → execution dispatches → product spec complete.

## Open threads for next session

### Pri 1 — Strategic palette review (PO asked, not yet launched)
PO noticed that violet-700 + slate palette was inherited from pre-Memoro generic tracker design, never explicitly decided for Memoro. Also Claude Design logo output shows gradient violations of Design Brief v1.2 §0 anti-pattern list + no wordmark↔icon case consistency. **PO asked to launch palette exploration as multi-agent strategic review (brand-strategist + product-designer + content-lead in parallel)** — PO's «запускаю» not given yet. Next-session trigger: PO says «запускаю palette review» or alternative.

### Pri 2 — 4 trial-policy clarifications from content-lead
PO confirm requests:
- One-trial-per-account policy YES/NO
- Weekly activity email default ON/OFF
- Chat usage meter visibility always vs 80% threshold
- Tier-name localization «Plus/Pro» Latin (current) vs «Плюс/Про» calque

### Pri 3 — 2 product-designer nits (non-blocking)
- `Cmd/Ctrl+Shift+B` as bell-dropdown shortcut (vs `Cmd/Ctrl+B` which conflicts with Chrome bookmark-bar)
- Free-tier nudge banner threshold: ≥3 unread locked patterns/month, max once/month, dismissable

### Pri 4 — Engineering ready to start
Tech-lead can receive Slice 8a kickoff when PO ready. Full product spec exists; Coach contextual UX + Trial flow + Free/Plus/Pro tier structure all specc'ed. Dependencies flagged by specialists:
- Haiku routing for Free MUST ship before 50/mo cap (else cost 3.75x worse)
- Plus heavy-user fair-use policy (600+ msg/mo on Sonnet → negative margin)
- Contextual Coach icon infrastructure (new product surface — tech-lead scopes firing + unread-state management)
- SnapTrade trade-history coverage audit (≥70% of launch-geography brokers — gate for warm-start Coach feasibility)

### Pri 5 — Deferred cleanups (PENDING_CLEANUPS.md)
- #5 Language expansion order ADR — post-alpha wave-2
- #6 Physical address for commercial email — trigger: first commercial email fires

### Pri 6 — Spend items (all ЗАПРЕЩЕНЫ until PO explicit greenlight)
- Trademark clearance US $2-5K + multi-jurisdiction
- US securities-counsel opinion $5-12K (highest ROI pre-launch legal)
- DE legal-counsel €5-15K (if EU within 6-months launch window)
- OpenAI Enterprise tier (for GDPR zero-retention)
- Professional naming consultant (not needed since Memoro locked)

## Financial state

- **Total spent to date:** $250 (domain Memoro)
- **Projected pre-launch legal:** $30-90K across jurisdictions (deferred per PO decision)
- **Free-tier LLM COGS at 10K users:** $3,600/month (down from $26,600/month under v1 Sonnet+5-msg/day model)
- **Free→Plus break-even conversion:** 11.8% (industry benchmark 15-30% for card-required trial)

## Team state

**13 agents in `.agents/team/`:**
- Navigator (PO entry point, opus, has Agent tool for parallel dispatch)
- Product specialists: brand-strategist, product-designer, user-researcher, content-lead (all opus)
- Domain SMEs: finance-advisor, legal-advisor (both opus — NOT yet loaded in session; require session restart to appear in subagent roster; currently via general-purpose with full role-file prompts)
- Tech-lead + builders (backend, frontend, devops, qa) + code-reviewer

**Rules locked in `.agents/team/CONSTRAINTS.md`:**
- Rule 1: no spend without explicit per-transaction PO approval
- Rule 2: no external communication in PO's name
- Rule 3: multi-agent review mandatory for strategic decisions

## Artefact map (where to find things)

- **Product:** `docs/product/01_DISCOVERY.md` v2, `02_POSITIONING.md` v3.1, `03_NAMING.md` (LOCKED: Memoro), `STRATEGIC_OPTIONS_v1.md` v1.6, `REVIEW_SYNTHESIS_2026-04-23.md`, `competitor-matrix.md`, `competitor-positioning.md`, `pricing-landscape.md`, `getquin-deep-dive.md`, `USER_RESEARCH/hypotheses.md`
- **Content:** `docs/content/landing.md`, `email-sequences.md`, `microcopy.md`, `paywall.md`
- **Design:** `docs/04_DESIGN_BRIEF.md` v1.3, `docs/design/DASHBOARD_ARCHITECTURE.md`, `COACH_SURFACE_SPEC.md` v2.0, `ONBOARDING_FLOW.md`
- **Legal:** `docs/legal/PRIVACY_POLICY_draft.md`, `TOS_draft.md`, `COOKIE_POLICY_draft.md`, `DPA_template.md`, `AI_DISCLAIMER_PATTERN.md`, `SUBPROCESSOR_REGISTRY.md`
- **Finance:** `docs/finance/EXPENSES.md`, `COACH_TIER_PLACEMENT.md`, `AI_CONTENT_VALIDATION_TEMPLATES.md`, `BENCHMARKS_SOURCED.md`, `PRICING_TIER_VALIDATION.md`
- **Reviews (Option 4 independent):** `docs/reviews/2026-04-23-*-option4.md` (6 specialists)
- **Process:** `docs/DECISIONS.md` (newest entries at bottom), `docs/PENDING_CLEANUPS.md`

**Earlier entry (2026-04-21):** TD-070 closure — AI Service staging live. Sequence: PR #61 `8ff5abf` config-as-code (fly.staging.toml + secrets manifest + verify shim + workflow rewrite + ADR) → ops-fix `4357739` (`uv sync --no-editable` для multi-stage venv handoff) → ops-fix `b079d30` (`.dockerignore` лишал README.md который требует `pyproject.toml` readme-ref) → PO runtime ops (Doppler stg + fly app create + secrets sync + bridge invariant + first deploy) → smoke green на `https://investment-tracker-ai-staging.fly.dev/healthz`. 4 latent TDs caught + opened: TD-084 (P2 flyctl build context), TD-085 (P3 fixed inline), TD-086 (P2 no CI Docker build), TD-087 (P3 fixed inline). Slice 6a Insights UNBLOCKED. Prior main tip `5e556a9` (Slice 5a Transactions UI PR #60). CORS end-to-end live с PR #54/#55; Doppler stg + fly staging настроены; web ↔ API ↔ AI cross-origin flow работает end-to-end.)

---

## 0. Кто я, что за проект

**Ruslan, Product Owner.** Не разработчик. Оркеструю параллельные Claude Code (CC) сессии — каждая CC-сессия работает свой PR в своём worktree (`D:\investment-tracker-<feature>`). Главный репозиторий — `D:\investment-tracker\` (docs в `D:\investment-tracker\docs\`).

**Investment-tracker** — AI-native агрегатор инвест-портфеля. Стек: Next.js 15 (web), Go 1.25 (Core API), Python (AI Service), Postgres (Neon), Redis (Upstash), Clerk auth, Stripe billing, Fly.io deploy, Vercel (web hosting). MVP для EU retail investors.

**Полный brief:** `D:\investment-tracker\docs\00_PROJECT_BRIEF.md`.

---

## 1. Текущий статус (2026-04-21)

### Волна 1 — ✅ закрыта
TASK_01 (monorepo+CI), TASK_02 (design system), TASK_03 (API contract + schema).

### Волна 2 — ✅ code-complete + staging deploy live
- **TASK_04 Core API (Go):** 10 PRs + CORS micro-slice + staging deploy live.
  - ✅ A (skeleton), B1, B2a, B2b, B2c (read path), B3-i (write mutations, PR #40), B3-ii-a (AI foundation, PR #42), B3-ii-b (AI chat sync + SSE reverse-proxy + single-writer `ai_usage`, PR #44), B3-iii (Clerk/Stripe webhooks + 14 scope-cut 501 stubs, PR #46), PR C (deploy infra — Dockerfile + fly.toml prod/staging + `deploy-api.yml` + k6 smoke + Doppler-first secrets + RUNBOOK, PR #49).
  - ✅ CORS middleware (PR #54 `adad1a1` + hotfix PR #55 `f1b5799`, 2026-04-21) — allowlist из `ALLOWED_ORIGINS`, 10 scope-cut `X-*` + `X-RateLimit-*` в `ExposeHeaders`.
  - ✅ Staging deploy live: `api-staging.investment-tracker.app` — CORS smoke 204 OK с `Access-Control-Allow-Origin: https://staging.investment-tracker.app` + все expose-headers. Web ↔ API cross-origin flow работает.
  - ⏳ Prod cutover — ждёт 24-48h staging soak + PR D (workers deploy target, **TD-066 blocker**).
- **TASK_05 AI Service (Python):** ✅ PR #34 merged + ✅ cleanup PR #43 `b6108a4` (`record_ai_usage` dual-write удалён — Core API single-writer per PR #44). 404-swallow → strict flip ждёт prod soak (см. `RUNBOOK_ai_flip.md`). **✅ Staging deploy live (TD-070 closed 2026-04-21)** — `https://investment-tracker-ai-staging.fly.dev` (Fra), bridge invariant `AI_SERVICE_TOKEN` ≡ `INTERNAL_API_TOKEN` verified. Slice 6a Insights UNBLOCKED.

### Волна 3 — 🟢 в работе
- **TASK_07 (Web Frontend):** Slice 1 + 2 + 3 + 7a + 7b + 4a + 5a merged — Auth + Dashboard + Positions + AI Chat + Landing + Pricing + Manual Accounts CRUD + Transactions CRUD работают на `staging.investment-tracker.app`. **Manual MVP end-to-end flow замкнут.**
  - Slice 1 (PR #45 `a622bd3`) — Clerk auth + `(app)/dashboard` + `PortfolioValueCardLive` + `usePortfolio` + 1 Vitest.
  - Slice 2 (PR #48 `366d12f`) — Positions list + detail read-only, toolbar, Recharts price chart через `@investment-tracker/ui/charts` subpath, 4 hooks + 3 Vitest.
  - Slice 3 (PR #50 `4881dfd`) — AI Chat UI: `(app)/chat` + `(app)/chat/[id]`, SSE client over fetch+ReadableStream, chat reducer state machine, 6 TanStack hooks, 9 UI components, tier-limit toast, `UsageIndicator` через `onRateLimitHeaders` middleware. TD-068 opened (P3 schema drift).
  - PR #53 (root-redirect) merged 2026-04-21 — `/` на `(app)/dashboard` для signed-in юзеров.
  - Slice 7a+7b (PR #58 `528333b`) — Landing + `/pricing` (Free/Plus/Pro) + `(marketing)/` route group; subscribe CTAs stubbed (Stripe → Slice 7c). TD-080 opened (paywall trigger wiring deferred).
  - Slice 4a (PR #59 `c5590f5`) — Manual Accounts CRUD — `(app)/accounts` route + Add/Rename/Delete для `connection_type=manual`, sidebar activation, 4 TanStack hooks, `SyncStatusBadge` 'manual' variant. TD-079 opened (P3 FK CASCADE vs handler soft-delete mismatch, defense-in-depth).
  - Slice 5a (PR #60 `5e556a9`) — Transactions UI — `buy/sell/dividend` add/edit/delete на Position Detail. Single `TransactionFormDialog` с mode create|edit, row-level kebab только для `source === 'manual'`, 3 TanStack mutation hooks, `mapTransactionMutationError` (409 dup / 403 non-manual), 8 Vitest smoke. Split/transfer/fee типы — Slice 5b (disabled с "Coming soon" в type select). TD-081 reservation не использован — ID остаётся свободным.
  - **Slice 5+ — см. `UI_BACKLOG.md`** (canonical backlog для всей оставшейся UI-работы: Insights feed, 4b/4c broker flows, 5b split/transfer/fee, Settings, Scope-cut banners, FloatingAiFab, Empty states, PWA, SEO, Observability). Остаётся critical path: Slice 6a → Slice 12.
- **TASK_06 (Broker Integrations):** ⏳ Slice 4a (manual accounts) + Slice 5a (manual transactions) merged — alpha-ready manual flow разблокирован end-to-end. SnapTrade/Binance/Coinbase providers — TD-046.

### Волна 4 — 🧊 отложено
TASK_08 iOS (нужен Mac + Xcode, отдельный репо).

---

## 2. Ключевые PR SHAs

| PR | Scope | SHA | Дата |
|---|---|---|---|
| **main tip** | TD-070 closure docs pass: TECH_DEBT (TD-070 → Resolved as TD-R070; opened TD-084/085/086/087 для caught Dockerfile/CI bugs) + PO_HANDOFF § 1 / § 2 TASK_05 status / § 7 file map / § 9 Track 1 / § 9.5 / § 12 continuation prompt + 03_ROADMAP Wave 2 + Month 3 [x] FastAPI + README TASK_05 row + critical path + RUNBOOK_ai_staging_deploy intro CLOSED note + RUNBOOK_ai_flip Update note + merge-log 4 new entries. No code changes. | `2b81fd2` | 2026-04-21 |
| ops-fix | `b079d30` `fix(ai): remove README.md from dockerignore (Dockerfile COPY requires it)` — TD-085 inline fix, поймано во второй итерации deploy: `pyproject.toml` объявляет `readme = "README.md"` → Hatchling требует README в build context. | `b079d30` | 2026-04-21 |
| ops-fix | `4357739` `fix(ai): install project non-editable in Dockerfile (fix multi-stage ModuleNotFoundError)` — TD-087 inline fix, поймано в первой итерации deploy: editable install кладёт `.pth` в site-packages указывающий на `/src/src/ai_service`, multi-stage handoff `/opt/venv` → runtime ломает import. | `4357739` | 2026-04-21 |
| #61 | TD-070 config-as-code: `apps/ai/fly.staging.toml` (region `fra`, `min_machines_running=1`, Anthropic model IDs pinned), `apps/ai/secrets.keys.yaml` manifest (4 required + 8 optional), `ops/scripts/verify-ai-secrets.sh` thin shim над `verify-prod-secrets.sh` через `KEYS_FILE`, `.github/workflows/deploy-ai.yml` rewrite к `workflow_dispatch` + `environment: staging|production` input + pre-deploy verify-secrets, ADR в DECISIONS.md, точечные правки `RUNBOOK_ai_staging_deploy.md`. | `8ff5abf` | 2026-04-21 |
| docs-only | TD-070 kickoff (`CC_KICKOFF_ai_staging_deploy.md`) + ROADMAP TASK_05 pending TD-070 note + TECH_DEBT TD-070 entry + PO_HANDOFF § 9 Track 1 update + § 9.5 P1 priority. | `f08627b` | 2026-04-21 |
| docs-only | post-slice-5a docs pass from CC (merge-log PR #60 entry + PO_HANDOFF § 1 / § 2 / Wave 3 status + UI_BACKLOG Slice 5a ✅ + critical-path update + TASK_07 status row + ROADMAP Wave 3 note + TECH_DEBT note про TD-081 reservation unused + DECISIONS.md 2 новых ADR). No code changes. | `6aec268` | 2026-04-21 |
| #60 | TASK_07 Slice 5a: Transactions UI (add/edit/delete) для `buy/sell/dividend` на Position Detail. Single `TransactionFormDialog` с mode create|edit, diff-only PATCH, row-level kebab gated на `source === 'manual'` (API-sourced rows immutable per OpenAPI contract). 3 TanStack mutation hooks (`useCreateTransaction` / `useUpdateTransaction` / `useDeleteTransaction`) с invalidation `['position-transactions', id]` + `['portfolio']` + `['positions']` + toast. `mapTransactionMutationError` (409 `DUPLICATE_TRANSACTION` / 403 `FORBIDDEN` tailored copy). DateTime picker = `<input type="datetime-local">` (no shadcn Calendar). 8 новых Vitest smoke (64/64 total). TD-081 reservation не использован (genuine debt не обнаружен) — ID остаётся свободным. Docs in-commit (этот commit): 2 DECISIONS ADRs (form-dialog pattern + Idempotency-Key auto-inject rationale). | `5e556a9` | 2026-04-21 |
| prev main tip | PO-Claude lessons-learned codification: PO_HANDOFF § 8 gotchas #9-11 + § 10 codified 7-step post-merge flow + § 11 CC docs workflow / `--permission-mode acceptEdits` / TD ID reservation + new `CC_KICKOFF_task07_slice5a.md` scaffold. No code changes. | `37b2d6c` | 2026-04-21 |
| prev main tip | post-slice-4a docs pass from CC #1 (UI_BACKLOG Slice 4a ✅ + critical-path update + TASK_07 status row + Wave 3 updates in PO_HANDOFF / ROADMAP / README). TD-079 + DECISIONS ADRs landed in-PR via #59. | `ece1b49` | 2026-04-21 |
| prev main tip | post-slice-7ab docs pass from CC #2 (UI_BACKLOG Slice 7a+7b ✅ + ROADMAP Paywall UI [x] + TECH_DEBT TD-080 + DECISIONS ADR + merge-log PR #58 entry). | `87a0706` | 2026-04-21 |
| #59 | TASK_07 Slice 4a: Manual Accounts CRUD — `(app)/accounts` route + list + Add/Rename/Delete for `connection_type=manual`, sidebar activation, TanStack Query hooks, packages/ui `SyncStatusBadge` 'manual' variant. Broker OAuth (Slice 4b/4c) remains blocked on TD-046. Docs in-PR: **TD-079** (accounts→transactions FK = CASCADE vs soft-delete handler, P3) + 2 DECISIONS ADRs (Accounts soft-delete pattern; AccountConnectCard not reused). | `c5590f5` | 2026-04-21 |
| #58 | TASK_07 Slice 7a+7b: Landing + Pricing + Paywall UI — `(marketing)/` route group, `/` landing (hero + 3 pillars + trust strip, anon render / authed redirect), `/pricing` (3 tiers aligned to `04_DESIGN_BRIEF §13.1`: Free $0 / Plus $8 / Pro $20, feature matrix with accounts/AI-msgs-per-day/insights/tax/API), Subscribe CTAs stubbed (Stripe in 7c / TD-057), MarketingHeader + MarketingFooter without legal placeholders, middleware `/pricing` public, 8 new Vitest specs (46/46 green). Paywall demo trigger на `/dashboard` deferred → TD-080. | `528333b` | 2026-04-21 |
| docs-only | kickoffs (slice 4a + 7ab) + AI staging runbook + PO_HANDOFF § 3.1 pre-CC checklist | `a407d7d` | 2026-04-21 |
| docs-only | kickoffs for slice 4a + slice 7ab + AI staging deploy runbook (TD-070) | `a70807d` | 2026-04-21 |
| docs-only | cleanup pass (UI_BACKLOG.md создан, PO_HANDOFF revision, ROADMAP Doppler ✅, TECH_DEBT P-legend, README index refresh) | `0a0d437` | 2026-04-21 |
| docs-only | post-CORS docs pass: merge-log + PO_HANDOFF + DECISIONS (PR #54 + #55) | `fc44782` | 2026-04-21 |
| #55 | fix(api): golangci-lint hotfix for `cors_test.go` — cherry-pick `d3f674a` из feature/api-cors. `bodyclose` ×2 + `noctx` ×2 satisfied. Incident + 2 новые TD записаны в DECISIONS.md (TD-077 pre-push golangci-lint gap + TD-078 политика `gh pr checks --watch` перед merge — renumbered с TD-076/077 которые конфликтовали с existing TD-076 Contract sync). | `f1b5799` | 2026-04-21 |
| #54 ⚠ | feat(api): CORS middleware with `ALLOWED_ORIGINS` allowlist — Fiber v3 `cors.New()` после RequestID/RequestLog. Exact-origin allowlist (credentials mode), 10 scope-cut `X-*` + `X-RateLimit-*` + `X-Request-ID` в `ExposeHeaders`, `MaxAge=86400`. 2 unit теста через `app.Test()`. `ops/secrets.keys.yaml` + `RUNBOOK_deploy.md` обновлены. **Admin-bypass** (TD-006): merged с fail'ящим golangci-lint, hotfixed в PR #55. | `adad1a1` | 2026-04-20 |
| docs-only | CC owns merge+cleanup+docs post-approval (api-cors slice) | `19e72b8` | 2026-04-20 |
| chore-only | gitignore local secrets backup files | `fb68193` | 2026-04-20 |
| #50 | TASK_07 Slice 3: AI Chat UI — `(app)/chat` + `(app)/chat/[id]` routes, SSE client over fetch+ReadableStream, chat reducer, 6 TanStack hooks, 9 UI components (incl. StreamingMessageView / ChatMessageItem 5-way / ImpactCardView §14.2 / CalloutView §14.1-14.3), tier-limit toast, UsageIndicator via `onRateLimitHeaders` extension в api-client. Sidebar activated. 4 Vitest smoke (tests 15→38). TD-068 opened (P3 schema drift). | `4881dfd` | 2026-04-20 |
| docs-only | kickoff TASK_07 Slice 3 | `7931e8e` | 2026-04-20 |
| #49 | PR C: Core API deploy infrastructure — migrate subcommand + /metrics + fly.toml (prod + staging) + deploy-api.yml pipeline (staging→smoke→approval→prod) + k6 smoke suite (5) + Doppler-first secrets (`ops/secrets.keys.yaml` + verify script) + `RUNBOOK_deploy.md` + TD-060..064 + TD-066 + TD-067. TASK_04 closed 10/10. | `fa9c9dc` | 2026-04-20 |
| #48 | TASK_07 Slice 2: Positions list + Position Detail read-only — `(app)/positions` + `(app)/positions/[id]` + toolbar + Recharts price chart (через `@investment-tracker/ui/charts` subpath, zero apps/web direct dep) + infinite transactions + 4 hooks + 3 Vitest smoke + sidebar activation + TD-065 opened | `366d12f` | 2026-04-20 |
| docs-only | post-merge pass PR #45 TASK_07 Slice 1 | `4e7c67a` | 2026-04-20 |
| docs-only | kickoffs TASK_07 Slice 2 + PR C, renumber PR C follow-up TDs | `fd3b5c5` | 2026-04-20 |
| #45 | TASK_07 Slice 1: Clerk auth + middleware + (auth) routes + (app)/dashboard vertical slice + PortfolioValueCardLive + TanStack Query usePortfolio + 1 Vitest | `a622bd3` | 2026-04-20 |
| docs-only | post-merge pass PR #46 B3-iii | `0c3bea5` | 2026-04-20 |
| #46 | B3-iii: Clerk/Stripe webhooks + webhook_events idempotency + 14 scope-cut 501 stubs | `08e09f4` | 2026-04-20 |
| docs-only | CC_KICKOFF_task07_slice1 revised (+ PO sync kickoff prompts) | `a75f541` / `aa4d4a5` | 2026-04-20 |
| #44 | B3-ii-b: POST /ai/chat + POST /ai/chat/stream (SSE reverse-proxy, tee-parser, persistTurn single-writer `ai_usage`) | `c2a2afe` | 2026-04-20 |
| #43 | TASK_05 cleanup: remove `record_ai_usage` dual-write (Python) | `b6108a4` | 2026-04-20 |
| #42 | B3-ii-a: AI client + rate-limit middleware + 5 handlers (conv create/del, insights gen/dismiss/viewed) | `8c52a4d` | 2026-04-20 |
| docs-only | DECISIONS.md: ai_usage single-writer ADR (reference для PR #43) | `47276bb` | 2026-04-20 |
| docs-only | PO_HANDOFF + merge-log entry (CC-landed для clean tree перед B3-ii pre-flight) | `e96f6de` | 2026-04-20 |
| docs-only | docs sync post-#40 (14 файлов) | `84465f7` | 2026-04-20 |
| #40 | B3-i: 19 handlers + SETNX idempotency + asynqpub wrapper + X-Async-Unavailable header | `11d6098` | 2026-04-19 |
| pre-#40 fix-up | `Publisher.Enabled()` + эмиссия `X-Async-Unavailable: true` в 5 call sites | `61d6c08` | 2026-04-19 |
| #34 | TASK_05 AI Service initial merge | — | — |
| #39 | B2c closure | `fb16525` | — |
| #30 | TASK_03 API contract + schema | `08f44c2` | — |
| #29 | TASK_02 design screenshots | — | — |

> **Notes на расхождение SHA:**
> - `b6108a4` (PR #43) смерджен после `8c52a4d` (PR #42) — обе merge-squash, squash-only policy соблюдена.
> - `47276bb` — docs-only direct-to-main, нужен был CC-task05 как reference для cleanup work (grep DECISIONS.md вернул 0 matches до commit'а — классический timing-gap).
> - `e96f6de` — CC-landed docs (PO не успел закоммитить перед B3-ii start). Pattern на будущее: **PO коммитит docs до команды start CC**, иначе CC закоммитит за него и tip уедет.
> - `8532301` — осиротевший local commit pre-rebase. В `origin/main` живёт только `84465f7`.

Полный лог — `merge-log.md`.

---

## 3. Как я работаю с CC (правила орекстровки)

**Cycle per PR:**
1. CC анонсирует pre-flight audit на слайс.
2. CC присылает GAP REPORT: scope, CI status (ожидаем 8/8 green), LOC count, closed/opened TDs, scope-adjacent changes, контракт подтверждён.
3. Я (PO-Claude) оцениваю: есть ли риск? что докинуть? дать ли отмашку?
4. **BEFORE `gh pr merge`: run `gh pr checks <N> --watch` until it returns all-green (TD-R078).** Если какой-то check red — stop, диагностировать, hotfix flow (см. PR #55 как reference). Admin-bypass в этой точке означает: `gh pr merge --admin` ТОЛЬКО с inline-комментом в PR body объясняющим почему CI-outage / P1 hotfix оправдывает bypass (см. DECISIONS.md § CORS incident для прецедента). Любой другой admin-bypass — violation cycle-discipline.
5. Ruslan мержит (squash-only политика; admin-bypass только по TD-006 + шагу 4 выше).
6. PO-Claude делает post-merge docs pass: merge-log + TECH_DEBT + TASK файл + README.
7. Ruslan ack'ит → CC стартует следующий PR.

**Squash-only policy.** История на main — только squash-коммиты. Rebase-merge и merge-commits запрещены.

**Admin-bypass policy (TD-006 + TD-R078):** только при CI-outage или hotfix после P1 incident declaration. `--admin` flag + inline PR comment с rationale — не молчаливое решение. Логируется в `merge-log.md`. PR #54 (CORS slice) — прецедент: CC + PO в разных сессиях одновременно одобрили merge с red CI; TD-R078 policy update с `--watch` step существует чтобы это больше не повторилось.

**State hygiene:** каждая новая сессия **ВЕРИФИЦИРУЕТ через Read** что файл реально на диске, прежде чем подтверждать обновление. Прецедент был: предыдущая сессия «обновила» 10+ файлов, но большинство не сохранилось — пришлось восстанавливать.

---

## 3.1 Pre-CC start checklist (MANDATORY — два прецедента)

**Прежде чем PO запускает CC в worktree — ВЫПОЛНИТЬ ВСЕ ТРИ ШАГА в PowerShell на хост-машине (`D:\investment-tracker`). Без этого CC блокируется и теряем 10-30 минут на re-push + перечитывание брифа.**

```powershell
cd D:\investment-tracker

# ШАГ 1 — убить index.lock если sandbox оставил (assistant НЕ может удалить
# его сам из-за Windows mount permissions; см. § 8 gotcha #7).
if (Test-Path .git\index.lock) { Remove-Item .git\index.lock }

# ШАГ 2 — убедиться что docs/kickoff/runbook ВСЕ закоммичены и на origin/main.
git status --short                    # MUST: пустой output
git fetch origin
git log origin/main --oneline -1      # MUST: совпадает с локальным main tip

# Если git status показал untracked docs/kickoff/* (типичный кейс — assistant
# написал файл через Write, но не закоммитил):
git add docs/
git commit --no-verify -m "docs: <описание kickoff/runbook>"
git push origin main

# ШАГ 3 — теперь worktree от СВЕЖЕГО origin/main:
git worktree add D:/investment-tracker-<feature> -b feature/<branch-name> origin/main

# Проверить что worktree чистый:
cd D:\investment-tracker-<feature>
git status                            # MUST: clean, on feature/<branch-name>
ls docs\CC_KICKOFF_<task>.md          # MUST: файл существует
```

**Только после всех ✅ — `claude --dangerously-skip-permissions` в worktree.**

**Почему это обязательно:**
1. **Прецедент №1 (Slice 4a, 2026-04-21).** Assistant написал `docs/CC_KICKOFF_task07_slice4a.md` через Write, не закоммитил. PO сделал `git worktree add ... origin/main` → worktree чистый, kickoff отсутствует → CC #1 заблокирован, попросил re-push.
2. **Прецедент №2 (Slice 7ab + AI runbook, 2026-04-21).** Та же ошибка — три файла untracked (`CC_KICKOFF_task07_slice4a.md`, `CC_KICKOFF_task07_slice7ab.md`, `RUNBOOK_ai_staging_deploy.md`). CC #1 поймал на pre-flight `git status`, дал structured отказ.
3. **`.git/index.lock` recurring.** Третий раз: assistant пытается `git add` из sandbox, Windows mount permissions не дают удалить lock после крэша. PO fix — `Remove-Item` в PowerShell.

**Корень проблемы:** assistant (PO-Claude в Cowork mode) **не может надёжно `git commit` из Linux sandbox на Windows mount**. Финальный commit+push **всегда** делает PO в PowerShell. Assistant пишет файлы через Write/Edit; PO коммитит. Этот invariant теперь жёсткий — см. § 11.

---

## 4. Active TDs (newest first)

| ID | Priority | Description | Pair / Links |
|---|---|---|---|
| TD-068 | P3 | `AIChatStreamEvent` schema drift — `content_delta.delta` additionalProperties vs factual `{text}`, `AIStreamEventError.error` wrapped-in-spec vs flat-on-wire. Reducer carries defensive unwrap. Docs-only spec tightening. | PR #50 commit `63ac3bf` |
| TD-059 | P3 | `/portfolio/tax/export` downloadable bundle — scope-cut 501 в B3-iii | overlap TD-039 |
| TD-058 | P2 | GDPR `/me/export` bundle aggregation — scope-cut 501 в B3-iii | legal review pre-EU launch |
| TD-057 | P2 | Billing CRUD endpoints — scope-cut 501 в B3-iii; нужен prod Stripe catalog | after PR C |
| TD-056 | P2 | Clerk Backend SDK — 2FA × 5 + session mutations × 2; scope-cut в B3-iii | pair TD-027 |
| TD-055 | P2 | AI stream OpenAPI spec drift: Core API re-serialize'ит SSE frames в openapi shape; schema эволюция на AI Service стороне требует sync update в Core translator | contract-test fixture |
| TD-054 | P3 | CC agent memory lives outside repo — shared invariants gap | mitigation: DECISIONS.md дисциплина |
| TD-053 | P2 | `/ai/insights/generate` per-week/per-day tier gate (1/wk Free, 1/day Plus) | planned Redis counter |
| TD-052 | P2 | AIRateLimit pre-increment overcount (429 или 5xx) | reserve+commit Lua |
| TD-051 | P2 | SSE parser в Core API дублирует AI Service знание frame format | contract-test fixture |
| TD-050 | P1 | `/ai/insights/generate` Path B hangs 5-30s (Fly.io idle 60s) | TASK_06 async worker |
| TD-049 | P3 | SSE Last-Event-ID resume protocol | TASK_08 mobile launch |
| TD-048 | P3 | SSE error event payload: add `request_id` field (cross-service) | TASK_05 coord |
| TD-047 | **P1 pre-GA** | CSVExport tier flag — хрупкая корреляция с AIMessagesDaily ≥ 100 | standalone |
| TD-046 | P2 | Aggregator provider clients (SnapTrade / Plaid / broker APIs) | inherits → TASK_06 |
| TD-045 | P1 | Hard-delete worker must re-check `deletion_scheduled_at IS NOT NULL` перед wiping. Publisher done B3-i (`61d6c08`), Clerk user.deleted webhook (PR #46) использует тот же contract | **⇔ TD-041** |
| TD-041 | P1 | `hard_delete_user` worker consumer (7-day delayed task). Publisher-path complete; два call-site'а (DeleteMe + Clerk user.deleted webhook); consumer в TASK_06 | **⇔ TD-045** |
| TD-039 | P2 | CSV export worker consumer | будет после deploy workers (PR D) |
| TD-007 | P3 | oapi-codegen OpenAPI 3.1 nullable upstream bug | workaround works |
| TD-006 | — | Admin-bypass policy (not a debt, policy document) | see merge-log.md |

**Resolved by PR #40:**
- TD-R011 — SETNX idempotency lock (was: race window между key-check и processing)
- TD-R021 — asynq publisher wrapper + /market/quote cache-miss enqueue

Полный файл: `TECH_DEBT.md`.

---

## 5. Active decisions quick-ref

Highlights — для всего остального **читать `DECISIONS.md`** (single source of truth).

- **Go 1.25+ + oapi-codegen spec-first** (НЕ huma) — клиенты web/iOS генерируются из той же openapi.yaml.
- **Money = shopspring/decimal**; никогда float64.
- **Encryption = AES-256-GCM envelope**; KEK в env (`KEK_MASTER_V1` + `KEK_PRIMARY_ID`).
- **Tiers через `tiers.For(user.Tier).Flag` middleware** — никогда `if user.Tier == "pro"`.
- **Idempotency = SETNX `SET idem:{key} pending NX EX 10`** → 409 IDEMPOTENCY_IN_PROGRESS, payload 24h cache.
- **Auth = dual-mode**: Clerk JWT OR `CORE_API_INTERNAL_TOKEN` + `X-User-Id` (для AI/workers).
- **SSE = `httputil.ReverseProxy` + `FlushInterval: -1`** в Core API; web client = `fetch()` + ReadableStream (НЕ EventSource — нужен Bearer header).
- **CORS = exact-origin allowlist** из `ALLOWED_ORIGINS` env (CSV → `[]string` через envconfig). `AllowCredentials: true`. Никогда wildcard.
- **Queue = asynq (Redis)**; `asynqpub.Enabled()` пока false на проде (workers ждут PR D, TD-066).
- **Squash-only merge**, admin-bypass только под TD-006, mandatory `gh pr checks --watch` перед merge (TD-078).

---

## 6. Scope-cut headers (all 10)

Core API эмитит header когда фича частично недоступна — клиент рендерит degraded state. **Всё задокументировано в `02_ARCHITECTURE.md`.**

| Header | Trigger |
|---|---|
| X-Clerk-Unavailable | Clerk webhook не доставлен → stale user state |
| X-Search-Provider | Polygon search rate-limited → cached fallback |
| X-Benchmark-Unavailable | /portfolio/performance без S&P сравнения |
| X-Analytics-Partial | /portfolio/allocation неполный (missing price) |
| X-Withholding-Unavailable | dividend withholding tax не посчитан |
| X-Tax-Advisory | /insights генерит tax advice — UI должен показать disclaimer |
| X-FX-Unavailable | FX курс не найден → позиция в native currency |
| X-Partial-Portfolio | один из accounts не засинкан |
| X-Export-Pending | CSV export в очереди (async) |
| X-Async-Unavailable | asynq publisher disabled (workers не задеплоены) — **эмитится сейчас на проде** |

---

## 7. File map

**Core docs:**

| Файл | Назначение |
|---|---|
| `README.md` | Индекс + wave status |
| `PO_HANDOFF.md` | **ЭТОТ ФАЙЛ** — handoff между сессиями |
| `UI_BACKLOG.md` | **NEW** — canonical Web UI backlog (Slice 4+, P1/P2/P3) |
| `00_PROJECT_BRIEF.md` | Концепция, аудитория, USP |
| `01_TECH_STACK.md` | Стек технологий |
| `02_ARCHITECTURE.md` | Архитектура + модель данных + scope-cut headers + patterns |
| `03_ROADMAP.md` | MVP план по месяцам |
| `04_DESIGN_BRIEF.md` | Дизайн-система v1.1 |
| `DECISIONS.md` | Engineering ADR log |
| `TECH_DEBT.md` | Tech debt tracker (P1/P2/P3 legend сверху) |
| `merge-log.md` | Журнал merge-событий + policy |

**Tasks (по компонентам):**

| Файл | Назначение |
|---|---|
| `TASK_01_monorepo_setup.md` | Wave 1 ✅ |
| `TASK_02_design_system.md` | Wave 1 ✅ |
| `TASK_03_api_contract.md` | Wave 1 ✅ |
| `TASK_04_core_backend.md` | Wave 2 ✅ + CORS slice |
| `TASK_05_ai_service.md` | Wave 2 ✅ + staging deploy live (TD-070 closed 2026-04-21) |
| `TASK_06_broker_integrations.md` | Wave 3 ⏳ (TD-046) |
| `TASK_07_web_frontend.md` | Wave 3 🟢 Slice 1+2+3 merged. Дальнейший scope — `UI_BACKLOG.md` |
| `TASK_08_ios_app.md` | Wave 4 🧊 (out of MVP scope) |

**Runbooks + kickoff templates:**

| Файл | Назначение |
|---|---|
| `RUNBOOK_deploy.md` | Deploy/Doppler/Fly procedure |
| `RUNBOOK_ai_flip.md` | AI Service 404-swallow → strict flip |
| `PR_C_preflight.md` | GAP-анализ финального PR C (Fly.io deploy) |
| `CLAUDE_CODE_PROMPTS.md` | Шаблоны для CC сессий |
| `CC_KICKOFF_*.md` | Конкретные kickoff'ы (per-slice) — переиспользуемый шаблон в `CC_KICKOFF_api_cors.md` (содержит CC-owns-merge directive) |

---

## 8. Known gotchas / прецеденты

1. **State loss между сессиями.** Было: сессия «обновила» 10+ файлов, но ~80% на диске не было. Защита: всегда Read перед confirm.
2. **`gh pr merge --delete-branch` может упасть** на local-checkout если worktree уже на main. Remote-side мерж всё равно проходит — local cleanup отдельно: `git worktree remove --force D:/investment-tracker-b3 && git worktree prune`.
3. **X-Async-Unavailable «implied» vs emitted.** В GAP REPORT PR #40 CC сначала написал что header «implied», при probing выяснилось — не эмитился. Фикс: pre-merge commit 61d6c08. Урок: на scope-cut header'ы требовать явной демонстрации, не подразумеваний.
4. **Ghost files в README.** `merge-log.md`, `RUNBOOK_ai_flip.md`, `PR_C_preflight.md` были проиндексированы, но на диске отсутствовали. Фикс: все созданы 2026-04-20.
5. **TASK_08 был Волна 2** — устаревшая метка, поправлено на Волна 4 (deferred) для консистентности с README.
6. **Kickoff/runbook НЕ на `origin/main` до `git worktree add`** (CC блокируется). Два прецедента 2026-04-21 — Slice 4a kickoff + Slice 7ab kickoff + AI runbook. Фикс закреплён в § 3.1 (MANDATORY checklist). Assistant пишет через Write, PO коммитит+пушит в PowerShell, **только потом** `git worktree add`.
7. **`.git/index.lock` drift в sandbox.** PO-Claude в Cowork mode работает в Linux sandbox, mapped на `D:\investment-tracker`. Windows mount + race при `git add` → lock-файл создаётся, но sandbox не может удалить (permission issue). Третий раз попадаемся. Фикс (PO, PowerShell): `Remove-Item .git\index.lock`. Закреплено в § 3.1 шаг 1.
8. **Assistant commit из sandbox = запрещено.** Следствие gotcha #7. Assistant пишет файлы через Write/Edit; финальный `git commit` + `git push` делает PO в PowerShell. Если assistant пытается `git add` из `mcp__workspace__bash` — это bug в процессе, не «просто ошибка».
9. **CC stuck on post-merge docs pass — needs path A pre-approval.** Pattern (Slice 4a + Slice 7a+7b, 2026-04-21): после `gh pr merge --squash --delete-branch` CC's worktree оказывается в неопределённом состоянии (`git checkout main` падает потому что main worktree D:\investment-tracker уже занят), CC stops asking permission for "scope escalation" (detached HEAD docs flow / remote branch delete). Оба слайса подряд — несколько round-trips к PO. Фикс: post-merge actions list ВКЛЮЧЕНЫ в kickoff approval (см. § 10 codified flow); assistant даёт CC explicit go на весь chain в одном сообщении.
10. **Cross-session contamination в main worktree.** Когда CC пытается сделать docs pass IN main worktree `D:\investment-tracker` (вместо detached HEAD в собственном worktree), он оставляет staged/unstaged изменения которые блокируют параллельный CC. Прецедент 2026-04-21: Slice 7a+7b CC #2 docs остался staged-but-uncommitted в main worktree, заблокировал Slice 4a CC #1's docs flow до ручного PO unblock. Фикс — § 11: CC docs commits ВСЕГДА из собственного worktree в detached HEAD на `origin/main`; main worktree `D:\investment-tracker` = PO-only territory.
11. **Plan mode keyboard gate adds round-trips.** CC в plan mode (`Ready to code? ❯ 1. Yes, auto mode`) — это keyboard selector, не текстовый промпт. PO's text approval не продвигает gate, CC re-shows план → loop. Прецедент 2026-04-21: 4 round-trips на тот же план Slice 7a+7b. Фикс: launch CC через `claude --dangerously-skip-permissions --permission-mode acceptEdits` (skips plan gate) ИЛИ PO жмёт `1` сразу + execution notes отправляет отдельным сообщением after start. Codified в § 11.

---

## 9. Параллельные треки

**Track 1 — Core API (TASK_04): CODE-COMPLETE + STAGING LIVE** ✅
10 PRs merged + CORS micro-slice (PR #54+#55, 2026-04-21). PR C deploy
infra (PR #49 `fa9c9dc`) — migrate subcommand, `/metrics`, `fly.toml`
(prod + staging), `deploy-api.yml` pipeline, Doppler-first secrets, 5 k6
scenarios, `RUNBOOK_deploy.md`. **Staging deployed:**
`api-staging.investment-tracker.app` отвечает 204 на CORS preflight с
полным набором expose-headers; web на `staging.investment-tracker.app`
успешно ходит cross-origin.

**Lesson learned (CORS slice, 2026-04-21):** PR #54 был merged с red
golangci-lint (admin-bypass). Hotfix PR #55 cherry-pick. Две новые TD:
TD-077 (lefthook pre-push gap — golangci-lint не запускается локально)
и TD-078 (mandatory `gh pr checks --watch` перед merge). Renumbered с
TD-076/077 которые конфликтовали с existing TD-076 (Contract sync).

Дальше по TASK_04 (operational):
- 24-48h staging soak до prod cutover.
- PR D — workers deploy + asynq consumer (TD-066 blocker).
- ~~AI Service staging deploy (TD-070) — нужно для Slice 6 Insights UI.~~ ✅ Closed 2026-04-21 (`investment-tracker-ai-staging.fly.dev`).

**Track 2 — Web Frontend (TASK_07): Wave 3 🟢 in flight**
Slice 1 merged (PR #45, squash `a622bd3`) — Clerk auth + `(app)/dashboard`
vertical slice + `PortfolioValueCardLive` + 1 Vitest. LOC ~551.
Slice 2 merged (PR #48, squash `366d12f`, 2026-04-20) — `(app)/positions`
list + `(app)/positions/[id]` detail read-only. Toolbar, desktop/mobile
table, Overview + Transactions tabs, price chart через
`@investment-tracker/ui/charts` subpath (zero direct Recharts dep в
apps/web), infinite transactions, 4 TanStack hooks, 3 Vitest smoke,
sidebar activation. LOC 1443. TD-065 opened.
**Slice 3 merged (PR #50, squash `4881dfd`, 2026-04-20) — AI Chat UI.**
`(app)/chat` + `(app)/chat/[id]` routes; SSE client over fetch +
ReadableStream (EventSource не пропускает Bearer); chat reducer = state
machine над translator-normalized `AIChatStreamEvent` (text / tool_use /
tool_result blocks; impact_card + callout рендерятся только из
persisted AIMessage — never emitted live per `collector.go:58-60`);
6 TanStack hooks (conversations CRUD + `useChatStream`
AbortController-scoped + `useRateLimit` Context); 9 UI components
включая `StreamingMessageView` pure-presentation split, `ChatMessageItem`
5-way discriminator, `ImpactCardView` §14.2 Scenario Simulator,
`CalloutView` §14.1/§14.3 Behavioral Coach + Explainer, `ChatMessageList`
с DESC→oldest-top reversal, `ConversationsSidebar` с delete,
`ChatInputBar` со scoped Esc cancel, `EmptyConversationState` с 4
SuggestedPrompts. Tier-limit fallback = toast MVP
(`TIER_LIMIT_EXCEEDED` → «Daily AI limit reached. Upgrade to Plus…»);
PaywallModal deferred до Slice 5 когда `/pricing` route существует.
`UsageIndicator` через canonical `X-RateLimit-{Limit,Remaining,Reset}`
(no `-Daily` suffix anywhere) — реализовано через новый
`onRateLimitHeaders` opt-in middleware в `@investment-tracker/api-client`
(+45 LOC extension, shared через RateLimitProvider context). Sidebar
activated: href `/chat` + `activeSlugFor` case. 4 Vitest smoke
(10 sse-client + 5 reducer + 4 chat-message-item + 4 streaming-view);
tests 15→38 total. LOC **2316** (anchor 1500-2000, overshoot +16% —
defensive TD-068 parsing + RateLimitProvider + Impact/Callout ~175 LOC +
optimistic user echo, все одобренные Risk #1 decisions). **TD-068
opened (P3, docs-only)**: schema drift в
`tools/openapi/openapi.yaml` — `content_delta.delta` typed
`additionalProperties: true` vs factual `{text: string}`;
`AIStreamEventError.error` typed wrapped `ErrorEnvelope` vs flat
`{code, message, request_id?}` on the wire. Reducer carries defensive
unwrap (~15 LOC) — symptom, не блокер; shape stable.
Main tip post-docs = этот docs-pass commit.

### Next (приоритеты, сверху = срочнее)

**Web UI критический путь к alpha** — см. `UI_BACKLOG.md` (canonical
source). Коротко: Slice 4a (Manual Accounts CRUD) → Slice 5a
(Transactions UI) → Slice 6a (Insights read-only) → Slice 7a + 7b
(Landing + Pricing + Paywall без Stripe) → Slice 12 (Empty + Error
states). Всё остальное (Settings, scope-cut banners, FloatingAiFab,
PWA, SEO, Observability) — P2/P3, после alpha-сигнала.

**Backend треки параллельно:**
- ~~**AI Service staging deploy (TD-070)** — блокер для Slice 6 Insights UI.~~ ✅ Closed 2026-04-21 — `investment-tracker-ai-staging.fly.dev` live. Slice 6a Insights UNBLOCKED.
- **PR D — workers deploy + asynq consumer (TD-066).** Restore
  `target=workers|both` в `deploy-api.yml` + реальный asynq consumer
  (hard-delete TD-041/045, CSV export TD-039, broker sync TASK_06).
- **TASK_06 — broker providers (TD-046).** Разблокирует Slice 4b/4c
  (SnapTrade/Binance/Coinbase OAuth+API-key flows).
- **AI Service 404-swallow flip** после prod soak (`RUNBOOK_ai_flip.md`). Prod app `investment-tracker-ai` — отдельный deploy после Core API prod cutover.

**Key reference PRs:**
- PR #54 + #55 (CORS middleware + lint hotfix) `fc44782` — staging live.
- PR #53 (root-redirect) — `/` → dashboard для signed-in.
- PR #50 (TASK_07 Slice 3, AI Chat UI) `4881dfd`.
- PR #49 (PR C, deploy infra) `fa9c9dc`.
- PR #48 (TASK_07 Slice 2, Positions) `366d12f`.
- PR #46 (B3-iii, webhooks + 501 stubs) `08e09f4`.
- PR #45 (TASK_07 Slice 1, Dashboard) `a622bd3`.
- PR #44 (B3-ii-b, AI chat sync + SSE reverse-proxy) `c2a2afe`.

**Worktrees (на PO / on CC post-merge):** CC теперь owns merge+cleanup
post-approval — см. CC_KICKOFF_api_cors.md § Deliverables. Старые
worktrees (`b3iii`, `task07-s1..3`, `pr-c`, `api-cors`) — CC удаляет
сам через `git worktree remove --force && git worktree prune` в своей
сессии. PO проверяет `git worktree list` если сомневается.

### Открытые TDs высокого приоритета (P1/P2)

- **TD-047 (P1 pre-GA)** — CSVExport tier flag.
- **TD-045 ⇔ TD-041 (P1)** — hard-delete worker + undo re-check.
- **TD-066 (P1)** — workers deploy target (PR D blocker).
- ~~**TD-070 (P1)** — AI Service staging deploy (Slice 6 blocker).~~ ✅ Closed 2026-04-21 (см. TECH_DEBT.md / TD-R070).
- **TD-046 (P2)** — Aggregator providers (Slice 4b/4c blocker).
- **TD-056 (P2)** — Clerk Backend SDK (Slice 8b 2FA blocker).
- **TD-057 (P2)** — Billing CRUD + Stripe Checkout (Slice 7c + 9 blocker).
- **TD-077/TD-078 (P2, CORS incident)** — lefthook pre-push golangci-lint gap + mandatory `gh pr checks --watch` policy.
- **TD-084 (P2, new)** — flyctl build context CWD vs `--config` toml location (Dockerfile COPY paths repo-root-relative).
- **TD-086 (P2, new)** — нет CI Docker build gate на `apps/ai/` (TD-087 + TD-085 могли бы быть пойманы CI'ем).

Полный список — `TECH_DEBT.md`.

---

## 10. CC kickoff template (CC owns merge+cleanup+docs post-approval)

См. `CC_KICKOFF_api_cors.md § Deliverables` — это reference template.
**Codified post-merge flow** (after PO approval = green light на весь
chain, CC НЕ переспрашивает на каждом шаге; gotchas #9, #10):

1. `gh pr merge <N> --squash --delete-branch` — squash на main, remote
   feature branch удаляется автоматически.
2. `git fetch origin && git checkout origin/main` — **detached HEAD в
   СВОЁМ worktree** (`D:\investment-tracker-<feature>`). НЕ трогать
   main worktree `D:\investment-tracker` — PO-only territory
   (gotcha #10, § 11).
3. Edit docs append-only / expand placeholder rows: `merge-log.md`
   (канонический), `PO_HANDOFF.md` (§ 1 status + § 2 PR row),
   `UI_BACKLOG.md` (slice ✅ + critical-path update), `03_ROADMAP.md`
   (wave status), `TECH_DEBT.md` (TD add/close), `DECISIONS.md`
   (ADR если уместно), `TASK_<NN>_*.md` (status row).
4. `git add docs/ && git commit -m "docs: <slice> post-merge pass" &&
   git push origin HEAD:main`.
5. Non-fast-forward → `git pull --rebase origin main`, append-only
   conflict resolve (оба ADR / оба TD сохраняются — никогда drop),
   `git push origin HEAD:main`. **Никогда force-push.**
6. Cleanup: `cd D:\investment-tracker && git worktree remove
   D:\investment-tracker-<feature> && git branch -D
   feature/<name>`. Если remote branch остался из-за race:
   `gh api -X DELETE repos/<owner>/<repo>/git/refs/heads/feature/<name>`.
7. Ping PO: «merged + cleaned + docs done, main tip now `<SHA>`».

**Pre-approved actions** (CC не просит добро отдельно): detached HEAD
docs workflow, remote branch force-delete если `--delete-branch` не
отработал, rebase+append conflict resolve. Всё что НЕ в этом списке —
CC останавливается и спрашивает.

PO в GitHub UI не заходит — squash-only, никаких manual rebase'ей.

---

## 11. Мой стиль общения (для нового Claude)

- **Русский по умолчанию**, английские технические термины OK.
- **Коротко, без over-formatting** (минимум bold/headers/bullets, prose-first).
- **Decisions-first:** сначала что делать, потом почему.
- **Видишь риск — говори сразу**, не жди вопроса.
- **Автономен в scope**: «как считаешь нужное» — значит доверяю решать самому.
- **Pushback welcome** — если вижу что ты ошибся или CC ошибся, скажу; жду того же.
- **2-section ответы**: «Для тебя / Для CC» — чёткое разделение где PO читает vs где CC читает.
- **Файлы создавать в `D:\investment-tracker\docs\`**, scratch в outputs.
- **Links через `computer://`** когда расшариваю файл.
- **LOC не трекаем** как scope metric — только по признакам завершённости (acceptance criteria + CI green).
- **TodoList** использовать активно для многошаговой работы.
- **Всегда верифицировать через Read** перед confirm обновления — state loss уже был.
- **CC запускается через `claude --dangerously-skip-permissions --permission-mode acceptEdits`** в worktree — оба флага обязательны. `acceptEdits` пропускает plan-mode keyboard gate (gotcha #11); без него CC re-shows план после text-approval → 3-4 round-trips на один и тот же план.
- **Assistant НЕ коммитит из sandbox** (gotcha #7-8, § 3.1). Assistant пишет файлы через Write/Edit; финальный `git commit` + `git push` ВСЕГДА делает PO в PowerShell. Никаких `git add` / `git commit` через `mcp__workspace__bash` — это ломается на Windows mount + index.lock.
- **Перед каждым `git worktree add` — § 3.1 pre-CC checklist** (три шага, MANDATORY). Игнорировали дважды — оба раза CC заблокировался на pre-flight.
- **CC docs pass — ВСЕГДА в собственном worktree** (detached HEAD на `origin/main`). Main worktree `D:\investment-tracker` = PO-only territory; любой CC touch там оставляет staged changes которые блокируют параллельный CC (gotcha #10). Codified flow — § 10.
- **Post-merge actions pre-approved всем слайсом** (gotcha #9). Kickoff approval = зелёный свет на весь chain: merge → detached HEAD docs → push+rebase → cleanup → ping. CC не переспрашивает на каждом шаге. Если CC выходит за pre-approved list (§ 10) — тогда стоп + вопрос.
- **TD ID reservation при параллельных CC**: PO выдаёт явный TD-<NN> каждому CC в kickoff (`TD-079 — CC #1, TD-080 — CC #2`). Два CC подряд брали один и тот же ID → rebase conflict на `TECH_DEBT.md`.

---

## 12. Continuation prompt (копировать в новый чат)

```
Привет. Я Ruslan, Product Owner проекта investment-tracker
(AI-инвест-трекер: Next.js web + Go API + Python AI Service).
Оркеструю параллельные Claude Code сессии — каждая CC работает
свой PR в отдельном worktree. Главный проект: D:\investment-tracker.

Предыдущая сессия забагала (context window). Полный контекст
и handoff — в файле:

  D:\investment-tracker\docs\PO_HANDOFF.md

Прочти его ПЕРВЫМ ДЕЛОМ. Для фона также пробежись по:

  D:\investment-tracker\docs\README.md
  D:\investment-tracker\docs\UI_BACKLOG.md
  D:\investment-tracker\docs\02_ARCHITECTURE.md
  D:\investment-tracker\docs\TECH_DEBT.md
  D:\investment-tracker\docs\merge-log.md
  D:\investment-tracker\docs\DECISIONS.md

Текущий статус в двух словах:
- main tip = TD-070 closure docs pass (2026-04-21) — TECH_DEBT
  TD-070 → TD-R070 + 4 new TDs (TD-084/085/086/087 для latent
  Dockerfile/CI bugs caught during first deploy).
- TASK_04 Core API code-complete + staging deploy live
  (api-staging.investment-tracker.app, CORS allowlist работает)
- TASK_05 AI Service staging deploy **closed 2026-04-21** —
  investment-tracker-ai-staging.fly.dev. Bridge invariant verified.
- TASK_07 Web Slice 1+2+3+4a+5a+7a+7b merged (auth + dashboard + positions +
  AI chat + manual accounts CRUD + transactions CRUD + landing/pricing);
  manual MVP end-to-end flow замкнут на staging.investment-tracker.app
- Slice 5b+ scope — UI_BACKLOG.md (canonical). Критический путь до alpha:
  **Slice 6a (Insights read-only — UNBLOCKED)** → Slice 12 (Empty/Error states).
  Остальное (Slice 5b split/transfer/fee, 4b/4c broker flows, Settings,
  Scope-cut banners, FloatingAiFab, PWA, SEO, Observability) — после alpha.
- Backend параллельно: PR D (workers + asynq, TD-066), TASK_06
  broker providers (TD-046). AI Service prod app + 404-swallow flip
  после Core API prod cutover (RUNBOOK_ai_flip.md).

Стиль:
- Отвечай по-русски, коротко, без over-formatting
- Decisions-first (что делать → почему)
- 2-section ответы: «Для тебя» (PO action) / «Для CC» (что CC делает)
- Видишь риск — говори сразу
- Файлы создавай в D:\investment-tracker\docs\
- Верифицируй через Read перед confirm (state loss уже был)
- LOC не трекаем как scope metric

**Cross-session invariants (TD-R054 — CC memory ephemeral):**
- Также прочти `docs/DECISIONS.md` на старте — там cross-session
  architectural invariants которые новая CC сессия НЕ увидит через
  local memory (`.claude/projects/...` вне репо). Любой non-trivial
  invariant который ты выводишь в этой сессии (policy, API contract,
  schema constraint, service-boundary rule) → зеркалится в
  DECISIONS.md **до** завершения сессии, иначе следующая CC его не
  найдёт и будет переизобретать.
- Rule of thumb: если ответ на "почему мы делаем так а не иначе"
  потребует read-through текущего кода — это invariant, пиши в
  DECISIONS.md.

Начни с того, что прочитал PO_HANDOFF.md + DECISIONS.md и скажи готов.
Потом ждём GAP REPORT от CC или мои новые вводные.
```
