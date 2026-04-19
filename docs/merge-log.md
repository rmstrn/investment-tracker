# Merge Log

Журнал merge-событий на `main`. Только то, что реально уехало в integration ветку.

Формат записи:
- PR номер + ссылка
- Squash SHA (на origin/main после merge)
- Дата
- Scope в 1-2 предложениях
- Admin-bypass — только если использовался (TD-006 policy — см. TECH_DEBT.md)
- Tests / CI status
- Migrations / break-glass notes (если применимо)

Newest entries at the top.

---

## Docs-only direct-to-main — PO_HANDOFF + merge-log entry (CC-landed)

**Tip SHA on origin/main:** `e96f6de` (at 2026-04-20 ~00:23 UTC+3)
**Previous tip:** `84465f7` (см. entry ниже)
**Pushed:** 2026-04-20 by CC during B3-ii worktree cleanup sequence
**Scope:** 2 файла, 285 insertions:
- `docs/PO_HANDOFF.md` (new, 271 LOC) — session-handoff document: ключевые SHAs, worktree state, current PR status, cleanup gates, canonical bootstrap prompt.
- `docs/merge-log.md` (+14 LOC) — entry про docs-only direct-to-main 84465f7.

**Context (как вышло что CC landed PO-правки):**
PO-Claude в сессии у Ruslan'а правил обе доки через Edit tool. Ruslan не успел сам закоммитить перед тем как дать CC команду start B3-ii. CC при старте pre-flight audit увидел uncommitted changes в working tree D:\СТАРТАП, не смог switch на feature branch для write-phase, поэтому сам закоммитил+запушил ровно те правки что PO-Claude оставил. Контент легитный; commit подписан `Co-Authored-By: Claude Opus 4.7 (1M context)`.

**Gate firing:**
CC правильно сработал paranoid-check «tip mismatch» сразу после commit'а — PO_HANDOFF § 9 скрипт cleanup'а ожидал `84465f7`, actual был `e96f6de`. STOP + явный запрос ack от Ruslan'а. Ruslan верифицировал через `git show e96f6de --stat`, увидел 2 docs-файла, дал «go, expected = e96f6de». Audit продолжен.

**Policy note:** тот же pattern что и предыдущий entry — docs-only direct-to-main разрешён, squash-only относится к merge PRs не к docs landings.
**CI:** не применимо.
**Admin-bypass:** нет.
**Migrations:** нет.

**Lesson learned для следующих сессий:** PO должен коммитить свои docs-правки сам **до** команды start CC, чтобы tip не уезжал под ним. Gate работает как recovery, но prevention лучше.

---

## Docs-only direct-to-main — PO handoff sync (post-#40)

**Tip SHA on origin/main:** `84465f7`
**Original local commit SHA (pre-rebase):** `8532301` — осиротел локально после `git pull --rebase` (local main стоял на pre-B3-i base); в `origin/main` живёт только rewritten `84465f7`.
**Pushed:** 2026-04-20
**Base:** `11d6098` (PR #40 squash).
**Scope:** docs-only sync — 14 файлов (11 modified + 3 new). Полный PO handoff pass: PO_HANDOFF.md создан, merge-log.md / RUNBOOK_ai_flip.md / PR_C_preflight.md материализованы (ghost-files fix), README + TECH_DEBT + TASK файлы приведены к актуальному состоянию после B3-i.
**Policy note:** direct-to-main без PR. Squash-only policy применяется к **merge PRs**, не к docs-only PO commits. Логируется здесь для audit trail (через 3 месяца при debugging было видно что это не-PR landing).
**CI:** не применимо (docs-only, no code touched).
**Admin-bypass:** нет.
**Migrations:** нет.

---

## PR #40 — B3-i: data-path mutations + asynq + idempotency lock

**Squash SHA:** `11d6098bd5eba4d756af22bf72ca1500b2f0192e`
**Merged:** 2026-04-19
**Base:** fb16525 (PR #39 squash)
**Scope:** первый write-path slice Core API — 19 handlers (accounts 7, transactions 3, /me 5, notifications 4, exports 2) + infra (SETNX idempotency lock, asynq publisher wrapper с nil-safe Enabled(), `X-Async-Unavailable` scope-cut header).
**CI:** 8/8 green (Go lint+build+test, Node typecheck+test, Python lint+test, trivy fs+image, govulncheck, gitleaks).
**Admin-bypass:** нет.
**Migrations:** нет.
**Pre-merge fix-up:** commit `61d6c08` — добавил `Publisher.Enabled()` + эмиссию `X-Async-Unavailable: true` в 5 call sites перед enqueue, чтобы консистентно с остальными scope-cut header'ами (X-Benchmark-Unavailable, X-Tax-Advisory, X-FX-Unavailable, X-Clerk-Unavailable, X-Search-Provider, X-Withholding-Unavailable, X-Analytics-Partial, X-Export-Pending, X-Partial-Portfolio).

**Closed TDs:**
- TD-011 — idempotency race → SETNX lock на mutations group
- TD-021 — asynq publisher wrapper + /market/quote cache-miss enqueue

**Opened TDs:** TD-039, TD-041 (+TD-045 pair), TD-046, TD-047 (P1 pre-GA). См. TECH_DEBT.md.

**Next:** PR B3-ii — AI mutations (7 handlers) + SSE reverse-proxy + tier gate rate-limit. Anchor ~2000-2500 LOC с учётом B3-i overrun коэффициента.

---

## Прошлые merge-события (до PR #40)

Прежние записи merge-log'а не сохранились в planning-docs (были только в commit-месседжах и PR-описаниях). Восстановить можно через `git log --merges --first-parent origin/main` в репе investment-tracker.

Последовательность PR'ов до B3-i (в порядке merge, SHA — из переписки с CC):

| PR | Scope | Squash SHA |
|---|---|---|
| TASK_04 PR A | skeleton, config, middleware basics | 14f95468 |
| TASK_04 PR B1 | first read handlers (portfolio, positions) | 462d2993 |
| TASK_04 PR B2a | read handlers batch 2 (transactions, market) | 272e5fe6 |
| TASK_04 PR B2b | read handlers batch 3 (accounts, insights, /me) | fdcf39f4 |
| TASK_05 PR #34 | AI Service (Python) | — |
| TASK_04 PR B2c | final read handlers closure — 30 GET endpoints authenticated | fb16525 |
| TASK_04 PR #40 B3-i | **(this entry — see above)** | 11d6098 |

---

## Policy — admin-bypass

Per TD-006 (см. TECH_DEBT.md):
- `--admin` merge разрешён **только** если red on main is pre-existing AND green-main fix уже в работе.
- Никогда — для реальных CI регрессий, внесённых самим PR.
- Каждый bypass логируется в этой записи с явным обоснованием.
- Использование `--admin` более одного раза за квартал — сигнал проблемы с CI-гигиеной (триггер на project-lead review).

---

## Policy — squash only

Все merge в `main` — через `gh pr merge --squash --delete-branch`. История на main = линейная, 1 PR = 1 commit. Feature-branch коммиты сохраняются только в PR-timeline на GitHub.
