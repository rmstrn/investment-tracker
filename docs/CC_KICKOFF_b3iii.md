# CC Kickoff — TASK_04 B3-iii

**Scope:** write-path completion + Clerk/Stripe webhooks + `webhook_events` idempotency.
**Anchor:** 1200-1800 LOC.
**Worktree:** `D:/investment-tracker-b3iii` (новый).
**Base:** main tip = `cf5ae55` (или свежее если на момент старта был новый docs push).
**Parallels with:** TASK_07 в другом worktree/CC — не пересекается по файлам (apps/api/** vs apps/web/**).

---

## Continuation prompt (копировать в новый CC чат)

```
Привет. Я Ruslan, Product Owner проекта investment-tracker
(AI-инвест-трекер: Next.js web + Go Core API + Python AI Service).
Оркеструю параллельные Claude Code сессии — каждая CC работает
свой PR в отдельном worktree. Главный проект: D:\СТАРТАП.

Первым делом читай:

  D:\СТАРТАП\docs\PO_HANDOFF.md       (полный handoff)
  D:\СТАРТАП\docs\README.md           (wave status)
  D:\СТАРТАП\docs\TASK_04_core_backend.md  (твоя таска)
  D:\СТАРТАП\docs\02_ARCHITECTURE.md  (scope-cut headers, patterns)
  D:\СТАРТАП\docs\DECISIONS.md        (ADR log, Clerk/Stripe решения)
  D:\СТАРТАП\docs\TECH_DEBT.md        (особо — TD-041 ⇔ TD-045)
  D:\СТАРТАП\docs\merge-log.md        (freshest merge-events)
  D:\СТАРТАП\docs\PR_C_preflight.md   (что ждёт после тебя; учитывай
                                       что TD-048..052 в этом файле
                                       stale — номера уже заняты)

Текущий статус:
- main tip = cf5ae55 (может быть свежее — проверь)
- 8 of ~9 PRs merged. Ты делаешь B3-iii — последний PR TASK_04
  перед PR C (Fly.io deploy).
- AI chat end-to-end живёт в main (PR #42/#43/#44), ai_usage =
  Core API single-writer, SSE reverse-proxy работает.

Твой scope — B3-iii:

1. **Write-path completion.**
   Grep `server.gen.go` ServerInterface vs реализованных handlers,
   найди gap. Ожидаемо: DELETE /me (account deletion kickoff +
   7-day grace через `deletion_scheduled_at`), плюс возможно пара
   остатков. Составь список и подтверди до write-phase.

2. **Clerk webhook handler.**
   POST /webhooks/clerk. svix signature verification (`CLERK_WEBHOOK_SECRET`
   env). События: `user.created`, `user.updated`, `user.deleted` →
   sync в нашу `users` table. `user.deleted` на Clerk стороне ≠ наш
   hard-delete — только mark как detached (см. TD-045 пэйрный pattern).

3. **Stripe webhook handler.**
   POST /webhooks/stripe. `webhook.ConstructEvent` с `STRIPE_WEBHOOK_SECRET`.
   События: `customer.subscription.created/updated/deleted`,
   `invoice.payment_failed`. Обновление `users.subscription_tier`
   через tier mapping (Stripe price_id → "free"/"plus"/"pro").

4. **webhook_events table + idempotency.**
   Миграция: `CREATE TABLE webhook_events (source TEXT, event_id TEXT,
   received_at TIMESTAMPTZ DEFAULT now(), PRIMARY KEY (source, event_id))`.
   В handlers: `INSERT ... ON CONFLICT DO NOTHING RETURNING received_at`.
   Если 0 rows — событие уже обработано, return 200 (idempotent replay).
   Паттерн описан в PO_HANDOFF § 5 (Clerk/Stripe webhooks).

5. **DELETE /me kick.**
   Scope-cut header pattern: если `asynqpub.Enabled()=false`,
   эмитим `X-Async-Unavailable: true` (прецедент из B3-i, PR #40
   pre-merge fixup `61d6c08`). INSERT `deletion_scheduled_at` сейчас,
   hard-delete worker consumer — отдельный TASK_06 scope, но re-check
   pattern `deletion_scheduled_at IS NOT NULL` должен быть
   задокументирован в коде как требование к consumer.
   TD-041 и TD-045 — closable по этому PR если DELETE /me kickoff
   корректно кладёт task и re-check pattern зафиксирован comment'ом.

Acceptance (проверю перед отмашкой):
- 8/8 CI green (или 7/8 с pre-existing flake — скажи явно какой).
- svix + stripe-go webhook sig verification unit-тесты
  (замоканный secret + valid/invalid payload).
- webhook_events idempotency тест (два одинаковых event_id → второй
  DO NOTHING).
- DELETE /me → idempotency lock (уже на main в mutations middleware)
  + `X-Async-Unavailable` header если publisher off.
- Миграция goose up/down работает без ошибок.
- tier mapping Stripe price_id → tier flag протестирован (или явно
  замокан и отмечен TD если price_id'ов ещё нет в env).

Стиль общения (из PO_HANDOFF):
- Русский, коротко, без over-formatting.
- Decisions-first (что делать → почему).
- Видишь риск — говори сразу.
- Верифицируй через Read перед confirm (state loss бывал).
- Squash-only merge policy (TD-006). Admin-bypass только по policy.
- GAP REPORT перед write-phase.

Cycle:
1) Прочти docs. Подтверди что понял.
2) Pre-flight audit: grep ServerInterface, найди write-path gap,
   проверь schema (webhook_events ещё не в миграциях?), проверь
   env secrets inventory (CLERK_WEBHOOK_SECRET, STRIPE_WEBHOOK_SECRET
   должны быть в config.go — если нет, добавить).
3) GAP REPORT: scope, LOC прогноз, opened/closed TDs, риски.
4) Я оцениваю → даю отмашку.
5) Write-phase.
6) GAP REPORT v2 (write-phase done): LOC actual, AC mapping, CI
   status, branch SHA, merge readiness.
7) Я даю go/no-go.
8) Ты сам мерджишь (gh pr create + gh pr merge --squash
   --delete-branch).
9) Post-merge docs pass (merge-log + TECH_DEBT + TASK_04 row
   + README counter: 9 of ~9 PRs merged).
10) Final report мне — PR number, squash SHA, docs SHA, diff stat,
    опен'ед TDs wording, worktree cleanup status.

Start: прочти PO_HANDOFF.md целиком, потом подтверди готов.
Потом pre-flight.
```
