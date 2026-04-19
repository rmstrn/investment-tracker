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
