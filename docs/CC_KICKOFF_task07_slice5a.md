# CC Kickoff — TASK_07 Slice 5a (Transactions UI — Add / Edit / Delete)

**Scope:** расширить existing `PositionTransactionsTab` (read-only из Slice 2 PR #48) до полного CRUD для manual transactions типов `buy / sell / dividend`. Add Transaction action на Position Detail + row-level Edit / Delete для `source=manual` rows. API-sourced rows (`source != manual`) — read-only по контракту (`403` на PATCH/DELETE), UI это honor'ит: нет kebab menu для non-manual rows. **Типы `split / transfer_in / transfer_out / fee` — out of scope** (Slice 5b, ждёт TD-065).

**Anchor:** один micro-PR, scope ~6-8 файлов: Position Detail tab extension, форм-dialog + confirm-dialog, 3 новых TanStack mutation hooks, 2-3 Vitest smoke. **LOC не трекаем** — критерий завершённости = acceptance criteria + CI green.

**Worktree:** `D:\investment-tracker-tx-5a` (branch `feature/task07-slice5a` from `origin/main` tip `<pre-flight SHA>`).
**Base:** main tip = post-Slice-4a + post-Slice-7ab docs pass (2026-04-21).
**Parallels with:** ничего на момент kickoff'а. Если параллельно стартует AI Service staging deploy (TD-070) — он trrouches backend only, no conflicts.

---

## Context

### Зачем этот slice критичен

Slice 4a (manual Accounts CRUD) смерджен — юзер может создать manual account. Но без Transactions UI он не может внести trades из интерфейса: portfolio на dashboard остаётся пустым. Slice 5a замыкает end-to-end manual MVP: user creates account → adds buy/sell/dividend → видит non-empty portfolio + positions с корректными avg price / cost basis / unrealized PnL.

Это последний P1 MVP-blocker на UI-критическом пути до alpha launch. После Slice 5a blocker список для alpha сокращается до: TD-070 (AI Service staging deploy, разблокирует Slice 6a Insights) + Slice 12 (Empty/Error states, polish).

### Что уже готово на бэке

OpenAPI `/transactions` endpoints полностью спекнуты (`tools/openapi/openapi.yaml:613-737`):

- `GET /transactions` — фильтры `account_id`, `symbol`, `transaction_type`, `from/to`, cursor pagination.
- `GET /positions/{id}/transactions` — per-position feed (используется в существующем `PositionTransactionsTab`).
- `POST /transactions` — create, required `Idempotency-Key`; body `TransactionCreateRequest` (`account_id`, `symbol`, `asset_type`, `transaction_type`, `quantity`, `currency`, `executed_at`, optional `price`, `fee`, `notes`). `409` на duplicate-fingerprint.
- `PATCH /transactions/{id}` — edit; body `TransactionUpdateRequest` (`quantity`, `price`, `fee`, `executed_at`, `notes` — всё optional). **`403` если `source != manual`.**
- `DELETE /transactions/{id}` — delete, required `Idempotency-Key`. **`403` если `source != manual`.**

Core API handlers landed в PR #40 (B3-i). Server-side валидация: `quantity > 0`, `price >= 0`, `executed_at <= now`, `account` принадлежит юзеру, `source = manual` на create (backend forces).

### Что уже готово на фронте

- `apps/web/src/components/positions/position-transactions-tab.tsx` — read-only feed, infinite query через `usePositionTransactions`. Renders `TransactionRow` (из `@investment-tracker/ui`) + `KIND_MAP` / `TITLE_MAP` (buy/sell/dividend/transfer_in/transfer_out/fee/split). **Extend этот файл**, не создавать параллельный.
- `apps/web/src/components/positions/position-detail-live.tsx` — host для tab.
- `apps/web/src/hooks/usePositionTransactions.ts` — existing read hook; новые mutation hooks кладём рядом (`useCreateTransaction`, `useUpdateTransaction`, `useDeleteTransaction`) в `apps/web/src/lib/api/transactions.ts` (новый файл — параллельно `lib/api/positions.ts`, `lib/api/accounts.ts`).
- `@investment-tracker/api-client` — generated клиент из openapi.yaml; `createTransaction`, `updateTransaction`, `deleteTransaction` operations уже на месте (паттерн отлажен в Slices 1/2/3/4a).
- `Idempotency-Key` flow — есть в `useCreateAccount` (Slice 4a), reuse паттерн: `crypto.randomUUID()` per submission, key пересоздаётся при retry.
- shadcn/ui `Dialog`, `Form`, `Select`, `Input`, `Textarea` — есть в packages/ui или ставятся через shadcn cli.
- `TransactionRow` компонент из `packages/ui/src/domain/` — если он достаточно гибок для kebab-menu slot, расширяем; если нет — wrapper в apps/web.

### Что CC делает (decomposition)

1. **TanStack mutation hooks.** `apps/web/src/lib/api/transactions.ts` — 3 новых hook'а:
   - `useCreateTransaction()` — `POST /transactions` + `Idempotency-Key`. OnSuccess: `invalidateQueries({ queryKey: ['position-transactions', positionId] })` + `['portfolio']` + `['positions']` (create влияет на aggregation).
   - `useUpdateTransaction()` — `PATCH /transactions/{id}` + `Idempotency-Key`. Same invalidations.
   - `useDeleteTransaction()` — `DELETE /transactions/{id}` + `Idempotency-Key`. Same invalidations.
   - Error-handling: `409` на create = toast «Duplicate transaction»; `403` на edit/delete = toast «This transaction is synced from a broker and can't be changed». Иначе generic error toast.

2. **`AddTransactionDialog` + `EditTransactionDialog`** (один компонент с variant prop ИЛИ два — CC выбирает; предпочтительнее один `TransactionFormDialog` с `mode: 'create' | 'edit'`).
   Form поля:
   - `account_id` (Select, required; options = `useAccounts()` — hooks already exist из Slice 4a; на Position Detail мы знаем accounts пользователя, а symbol и asset_type подтягиваем из position — это позволяет юзеру выбрать какой account связать с trade).
   - `transaction_type` (Select, required; **только `buy / sell / dividend`** в этом slice; `split/transfer_*/fee` — disabled с tooltip «Coming soon»).
   - `quantity` (Input, decimal, required, `> 0`).
   - `price` (Input, decimal, optional на dividend; required на buy/sell).
   - `currency` (Select, required; default = position.currency; top-10 список из `lib/format` если есть, иначе hardcode как в Slice 4a).
   - `fee` (Input, decimal, optional).
   - `executed_at` (DateTime picker, required, max = now).
   - `notes` (Textarea, optional, maxLength 1000).
   - `symbol` + `asset_type` — **locked** на Position Detail (берутся из position context, hidden в form но submitted). Это делает UX понятным: юзер всегда добавляет trade для **этой** конкретной позиции.
   - Submit create → `useCreateTransaction.mutate` → close dialog + toast success + list auto-refetch через invalidation.
   - Submit edit → `useUpdateTransaction.mutate` только с изменёнными полями (diff vs initial). Quantity/price/fee/executed_at/notes editable; symbol/asset_type/account_id/currency/transaction_type НЕ editable на edit (API не принимает).

3. **`DeleteTransactionConfirm`** (AlertDialog). Body: «Delete this <type> of <qty> <symbol>? Portfolio value will update.» CTA Delete (destructive) → `useDeleteTransaction.mutate(id)` → toast.

4. **Row-level Edit / Delete actions.** В `position-transactions-tab.tsx` — для каждой row с `source === 'manual'` добавить kebab menu (DropdownMenu из shadcn) с Edit / Delete items. Для non-manual rows kebab не рендерится (immutable per contract). `source` поле есть в `Transaction` schema.

5. **Toolbar с "Add Transaction" CTA.** Над feed'ом (либо в `PositionHeader`, либо в `PositionTransactionsTab` header) — primary button открывает `TransactionFormDialog` в mode=create. Account-select внутри form'ы (не в toolbar).

6. **Split-row handling.** Существующий код в `position-transactions-tab.tsx:59` фильтрует split rows из display и показывает counter (`hiddenSplits`). Оставить как есть — split/transfer/fee **не** получают Edit/Delete UI в 5a. Если CC видит что логика counter'а требует уточнения после добавления Edit/Delete — document в PR description.

7. **Vitest smoke (2-3).**
   - `TransactionFormDialog` renders с правильным default `currency` для position, submit вызывает `createTransaction` с корректным payload (symbol + asset_type взяты из position context, `Idempotency-Key` присутствует).
   - Row rendering: для row с `source=manual` появляется kebab; для `source='aggregator'` (или не-manual) — не появляется.
   - Delete confirm flow → `deleteTransaction` вызван с правильным id.
   - Больше тестов — на усмотрение CC, без gold-plating.

### Что CC проверяет pre-flight

- Generated `@investment-tracker/api-client` содержит typed `Transaction`, `TransactionCreateRequest`, `TransactionUpdateRequest`, `TransactionType`, `createTransaction`, `updateTransaction`, `deleteTransaction`. Если нет — `pnpm api:generate`.
- `Transaction.source` поле (enum: `manual / aggregator / api / import`) присутствует в generated типе — нужно для gate'а kebab menu.
- `usePositionTransactions` + query key — для корректной invalidation'и после mutations (нужно знать точный queryKey).
- `useAccounts` из Slice 4a доступен (`apps/web/src/lib/api/accounts.ts`) — используем его для Account select в форме.
- `ToastProvider` из предыдущих slices есть (используется в Slice 4a) — reuse.
- `PositionHeader` — туда ли идёт Add Transaction CTA, или в header of Transactions tab. CC выбирает по UX; предпочтительнее в tab header, чтобы не конкурировать с глобальным header CTA.
- Backend `403 FORBIDDEN_NOT_MANUAL` error-code contract — проверить в `apps/api/internal/handlers/transactions.go` реальный error-code чтобы map'нуть точно в toast message.
- shadcn `DropdownMenu`, `AlertDialog`, `DatePicker` (или DateTimeInput) — что реально установлено. DateTime picker может потребовать новый shadcn add; если сложно, fallback на `<input type="datetime-local">` wrapped с `Input` styling — decision CC.

---

## Что НЕ делаем

1. **`split / transfer_in / transfer_out / fee` CRUD** — out of scope. Split блокируется TD-065 (backend split events contract). Transfer/fee — low-priority, UI добавится в 5b если понадобится. В form'е эти options disabled с tooltip «Coming in a future update».
2. **Bulk operations** (multi-select delete, CSV import). Не в MVP.
3. **Transaction history globally** (`/transactions` route без position context). Не в MVP — всё происходит на Position Detail.
4. **Asset creation через form.** Symbol и asset_type locked на Position Detail (берутся из position). Нельзя создать tx для symbol'а которого нет в portfolio — это ограничение acceptable для MVP (юзер сначала создаёт position через первую buy-tx... chicken-and-egg? см. open questions #1).
5. **Editing API-sourced trades.** Backend возвращает 403 — UI это honor'ит: нет kebab menu, нет редактирования. Это по контракту, не скоп-кат.
6. **FX conversion preview** (если tx в USD, а account в EUR — показать equivalent). Нет в MVP.
7. **Undo после delete.** Не в MVP.
8. **Form field-level optimistic updates.** Базовый invalidate-after-mutation — достаточно. Optimistic updates (append-before-confirm) — nice-to-have, но добавляет complexity; CC может сделать только если очевидно просто.

---

## Acceptance criteria

- На `/positions/[id]` появляется "Add Transaction" CTA (в Transactions tab header или Position header — CC выбирает).
- Клик → dialog с формой; submit с valid data → `POST /transactions` с `Idempotency-Key` → 201 → new row появляется в Transactions tab без full reload (query invalidation).
- Portfolio value / positions list / dashboard после create видят изменение после invalidation (query keys `['portfolio']`, `['positions']` инвалидированы).
- Для каждой row с `source === 'manual'` — kebab menu с Edit / Delete. Для non-manual rows kebab не рендерится.
- Edit → тот же dialog в edit-mode, pre-filled; submit → `PATCH` → row обновляется в списке.
- Delete → confirm dialog → `DELETE` → row исчезает.
- `409` duplicate на create → toast «This transaction looks like a duplicate of an existing one.»
- `403` на edit/delete (не должно случаться для manual rows, но на всякий) → toast «This transaction is synced from a broker and can't be changed.»
- Form validation: required поля enforced; `quantity > 0`; `price >= 0`; `executed_at <= now`; `notes.length <= 1000`.
- Split / transfer / fee options в `transaction_type` select disabled с tooltip. Существующий split filter в read-only feed остаётся.
- `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build` — green в `apps/web`.
- **Mandatory pre-merge `gh pr checks <N> --watch`** (TD-078).
- Никаких новых TDs не ожидается. Если CC находит genuine TD — фиксирует как новый ID (**TD-081** зарезервирован за этим слайсом).

---

## Open questions (CC решает в процессе)

1. **Empty Position Detail.** Позиция существует только когда у юзера уже есть хотя бы одна buy-tx. Chicken-and-egg: как добавить первую tx для нового symbol? **Решение на этот slice:** first-tx flow пока через `/positions` list (если там есть "Add first trade" CTA — добавить, иначе MVP = юзер идёт в существующую позицию и добавляет trades туда; новую позицию — через POST /transactions с новым symbol'ом, UI для этого — Slice 5b или отдельный `New position` CTA в `/positions`). **В этом slice:** CC добавляет Add Transaction CTA на Position Detail только. Global "New trade" CTA — open question для 5b.
2. **Single vs double dialog.** Один `TransactionFormDialog` с `mode` prop vs два компонента. Предпочтительнее один — меньше duplication, edit-locked поля просто disabled в edit mode.
3. **Date picker выбор.** Если shadcn calendar + popover усложняет — fallback `<input type="datetime-local">` acceptable. Decision CC по UX / available deps.
4. **`account_id` default в form.** Если у юзера один manual account — default selected. Если несколько — empty, force choose. Decision: CC делает default = «самый свежий по created_at» если доступно, иначе empty.
5. **Idempotency-Key на edit/delete.** По спеке header required. Re-submit тех же значений с тем же key должен возвращать тот же 200/204. Re-use `crypto.randomUUID()` per submission (фиксированный на life-cycle dialog'а, если юзер нажимает submit несколько раз на том же state — один key).
6. **Optimistic update на delete.** Можно сделать (list temporarily removes row before 204) — simple case. CC decision по complexity.

---

## Deliverables

1. PR в `main`: `feat(web): TASK_07 Slice 5a — Transactions UI (add/edit/delete buy/sell/dividend)`.
2. GAP REPORT перед merge (в чат PO):
   - CI status (ожидаем 8/8 green; **обязательный** `gh pr checks <N> --watch` per TD-078).
   - File list (что добавлено / изменено).
   - TDs opened/closed (не ожидаю новых; TD-081 зарезервирован если понадобится).
   - Scope-adjacent changes (если пришлось трогать `PositionHeader`, `ToastProvider` expansion, shadcn primitive additions).
   - Скриншоты UI (опционально — add / edit / delete flow).
3. **После PO approval — CC сам делает merge + cleanup + docs pass** (см. `PO_HANDOFF.md § 10` — **codified 7-step flow**):
   1. `gh pr merge <N> --squash --delete-branch`.
   2. `git fetch origin && git checkout origin/main` — **detached HEAD в СВОЁМ worktree** (`D:\investment-tracker-tx-5a`), НЕ в main worktree.
   3. Edit docs append-only: `merge-log.md`, `PO_HANDOFF.md` (§ 1 status + § 2 PR row), `UI_BACKLOG.md` (Slice 5a ✅ + critical-path update), `03_ROADMAP.md`, `TECH_DEBT.md` (TD-081 если opened), `DECISIONS.md` (ADR если уместно — например «TransactionFormDialog single-component pattern»), `TASK_07_web_frontend.md`.
   4. `git add docs/ && git commit -m "docs: slice-5a post-merge pass" && git push origin HEAD:main`.
   5. Non-fast-forward → `git pull --rebase origin main` + append-only resolve + push. Никогда force-push.
   6. Cleanup из main worktree: `cd D:\investment-tracker && git worktree remove D:\investment-tracker-tx-5a && git branch -D feature/task07-slice5a`. Если remote branch остался — `gh api -X DELETE repos/<owner>/<repo>/git/refs/heads/feature/task07-slice5a`.
   7. Ping PO: «merged + cleaned + docs done, main tip now `<SHA>`. Готово к runtime smoke на staging.»

**Pre-approved actions в этом flow:** detached HEAD docs workflow, remote branch force-delete, rebase+append conflict resolve. Не спрашивать разрешение на каждый шаг. Любое отклонение от списка выше — стоп + вопрос.

---

## PO notes (что делает PO — после CC ping'а «merged»)

- Vercel auto-deploy подхватит main за ~60s.
- Открыть `https://staging.investment-tracker.app/positions/<id>` → Transactions tab → должна быть кнопка "Add Transaction".
- Create manual tx (buy, 1 share, $100, USD, today) → ожидаем 201, новая row в feed, portfolio value вырос на dashboard.
- Edit на созданной row → обновить qty / price → 200, row обновлена.
- Delete на созданной row → 204, row исчезает, portfolio value откатился.
- Проверить что API-sourced row (если есть в staging) **не** показывает kebab menu.
- Если всё OK — следующий kickoff Slice 6a (Insights UI) — но сначала нужен TD-070 (AI Service staging deploy); если 6a заблокирован — пойдём на Slice 12 (Empty/Error states) или на backend-track (TD-070 отдельным kickoff'ом).

---

## Стиль работы CC (напоминание)

- Русский, коротко, без overformatting.
- Decisions-first: сначала что делаешь, потом почему.
- Видишь риск — говори сразу.
- Верифицируй каждый Edit через Read (state loss бывал).
- LOC не трекать как scope metric — критерий = acceptance criteria + CI green.
- Pre-merge **обязательный** `gh pr checks <N> --watch` (TD-078 policy).
- CC docs pass — **всегда** в собственном worktree (detached HEAD), **никогда** в main worktree `D:\investment-tracker` (PO-only territory; gotcha #10).
- Post-merge chain (merge → detached HEAD → docs → push → cleanup → ping) выполняется без вопросов по каждому шагу — весь список pre-approved в этом kickoff'е (gotcha #9).
- Если что-то в scope непонятно или появилась дилемма — пиши в чат PO до того как делаешь large changes.
