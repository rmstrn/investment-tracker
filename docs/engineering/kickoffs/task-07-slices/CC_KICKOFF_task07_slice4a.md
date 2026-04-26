# CC Kickoff — TASK_07 Slice 4a (Manual Accounts CRUD)

**Scope:** добавить `(app)/accounts` route в web — список manual accounts + Add Manual Account modal + Rename + Delete. Активировать sidebar slot `accounts` (сейчас no-op `href: /dashboard`). Подключить TanStack Query hooks к existing `/accounts` REST endpoints. **Только manual variant** — никакого OAuth/API-keys; SnapTrade/Binance/Coinbase flows ждут TD-046 и поедут отдельными slices 4b/4c.

**Anchor:** один micro-PR, scope ~5-7 файлов в `apps/web/src/app/(app)/accounts/` + 1 sidebar update + 1-2 TanStack Query hook файла + 2-3 Vitest smoke. **LOC не трекаем** — критерий завершённости = acceptance criteria + CI green.

**Worktree:** `D:/investment-tracker-accounts-4a` (branch `feature/task07-slice4a` from `origin/main` tip `0a0d437`).
**Base:** main tip = `0a0d437` (docs cleanup pass поверх CORS slice).
**Parallels with:** ничего на момент kickoff'а — только этот worktree активен.

---

## Context

### Зачем этот slice критичен

Сейчас все три merged UI-слайса (Dashboard / Positions / AI Chat) показывают пусто, потому что у пользователя нет способа добавить данные. SnapTrade/Binance/Coinbase OAuth блокируются TD-046 (broker provider clients не реализованы). Manual accounts — единственный путь разблокировать MVP-flow до TD-046.

После Slice 4a + Slice 5a (Transactions UI) пользователь сможет: добавить manual account → внести trades → увидеть портфолио на dashboard / positions. Это minimal viable product.

### Что уже готово на бэке

OpenAPI `/accounts` endpoints полностью спекнуты (`tools/openapi/openapi.yaml`):

- `GET /accounts` — список
- `POST /accounts` — создание (`AccountCreateRequest`: `connection_type`, `display_name`, optional `broker_name`/`base_currency`/`account_type`)
- `GET /accounts/{id}` — детали
- `PATCH /accounts/{id}` — обновление (`AccountUpdateRequest`)
- `DELETE /accounts/{id}` — удаление
- `POST /accounts/{id}/sync` / `/status` / `/reconnect` / `/pause` / `/resume` — out of scope для 4a (sync — manual no-op, reconnect/pause только для broker connections)

Core API handlers тоже готовы (PR B3-i, B3-iii). Manual-only flow означает `connection_type=manual` в request body, остальные поля как в спеке.

### Что уже готово на фронте

- `packages/ui/src/domain/AccountConnectCard.tsx` — существующий domain-компонент (CC проверит реальный API и переиспользует если подходит, иначе сделает minimal `AccountListItem` локально в apps/web).
- `apps/web/src/components/app-shell-client.tsx` — sidebar NAV массив с slot `accounts` который сейчас no-op'ит на `/dashboard` (`href: '/dashboard'`). Нужно поменять `href: '/accounts'` + добавить case в `activeSlugFor()`.
- `@investment-tracker/api-client` — generated клиент из openapi.yaml (использовался в Slices 1/2/3, паттерн отлажен).
- TanStack Query setup (`Providers` в `apps/web/src/app/providers.tsx`) — готов.
- shadcn/ui Dialog/Form компоненты — есть в `packages/ui` или ставятся через shadcn cli (как в предыдущих slices).

### Что CC делает (decomposition)

1. **Route + page.** `apps/web/src/app/(app)/accounts/page.tsx` (Server Component shell + клиентский AccountsListClient внутри). Список accounts из `useAccounts()`. Empty state ("No accounts yet" + "Add manual account" CTA). Sort: newest first. Каждый item: display_name, broker_name (если есть), account_type badge, base_currency, sync_status pill, действия (kebab menu — Rename / Delete).
2. **Add Manual Account modal.** Form с полями:
   - `display_name` (required, string, maxLength 120)
   - `account_type` (dropdown: broker / crypto / manual; default `manual`)
   - `base_currency` (dropdown с топовыми валютами USD/EUR/GBP/UAH... use shared currency list если есть в packages, иначе hardcode 8-10 штук — это temporary, refine в Slice 8 Settings.preferences)
   - `broker_name` (optional, free-text — для manual это просто метка типа "My broker", не enum)
   - `connection_type` всегда `manual` (hidden — модалка только manual flow)
   - Submit → `POST /accounts` через `useCreateAccount()` mutation → invalidate accounts query → close modal → toast success.
3. **Rename action.** Переиспользует ту же modal в "edit mode" (или отдельная inline edit — CC выбирает по UX). `PATCH /accounts/{id}` с `display_name` only.
4. **Delete action.** Confirm dialog ("Delete <name>? Trades останутся, account будет removed from portfolio"). `DELETE /accounts/{id}` → invalidate → toast.
5. **TanStack Query hooks.** `apps/web/src/lib/api/accounts.ts` — 4 hooks: `useAccounts`, `useCreateAccount`, `useUpdateAccount`, `useDeleteAccount`. Pattern как в `apps/web/src/lib/api/positions.ts` (Slice 2). `staleTime: 30s` для list. Mutations invalidate `['accounts']` queryKey + `['portfolio']` (account changes влияют на portfolio aggregation).
6. **Sidebar activation.** `app-shell-client.tsx`: `accounts` NAV item `href: '/accounts'` (был `/dashboard`); `activeSlugFor()` add `if (pathname.startsWith('/accounts')) return 'accounts';`.
7. **Vitest smoke (2-3).**
   - Empty state renders когда useAccounts возвращает `[]`.
   - List renders item с display_name + broker_name + sync pill.
   - Submit modal с valid form → mutation called с правильным payload (connection_type=manual).
   - Тестов больше — на усмотрение CC, но не gold-plating.

### Что CC проверяет pre-flight

- Generated `@investment-tracker/api-client` после `pnpm api:generate` (или эквивалент команды) реально содержит typed `Account` / `AccountCreateRequest` / `getAccounts` / `createAccount` etc. Если нет — re-run codegen first.
- `AccountConnectCard` в packages/ui — что он реально умеет. Если он про OAuth-connect flow (broker logos + SnapTrade init) и не подходит для manual list — **не использовать**, сделать minimal local `AccountListItem`.
- Что `POST /accounts` принимает `Idempotency-Key` header (он required по спеке) — нужен в mutation flow. Использовать `crypto.randomUUID()` per submission.
- Что `account_type` enum в openapi реально `broker | crypto | manual` (см. сейчас выше — да, эти три).
- Что нет hardcoded routes/links в других местах web которые ведут на `/dashboard` для accounts (grep). Если есть — поправить.

---

## Что НЕ делаем

1. **OAuth / API-keys flows.** SnapTrade init, Binance API key encryption, Coinbase OAuth — всё ждёт TD-046 broker providers + отдельных slices 4b/4c. В UI просто нет options для них в Add modal — manual only.
2. **Account Detail page** (`/accounts/[id]`). Slice 4a — только list + create + rename + delete. Detail (sync history, paused state, reconnect button) — отдельный slice если нужен.
3. **Sync / Pause / Resume / Reconnect actions.** Manual accounts не синкаются (нет provider'а). UI этих кнопок не показывает для `connection_type=manual`. Когда придут broker accounts — добавим conditionally в Slice 4b/4c.
4. **Transactions из этого slice.** Tx CRUD — отдельный Slice 5a. Здесь можно опционально показать "0 transactions" / "X transactions" counter, но не CRUD.
5. **Bulk-операции** (multi-select + bulk delete). Не в MVP scope.
6. **Account types beyond manual.** Не делаем broker-specific UI хитростей. `account_type=manual` default, остальные значения юзер может выбрать в form, но никаких type-specific полей.
7. **Soft-delete vs hard-delete UX.** `DELETE /accounts/{id}` бэкенд решает (пока soft-delete по контракту). UI просто диспатчит DELETE и удаляет из списка.

---

## Acceptance criteria

- `/accounts` route рендерит список accounts из `GET /accounts`.
- Empty state ("No accounts yet" + CTA) когда список пуст.
- "Add Manual Account" кнопка открывает modal с form (display_name + account_type + base_currency + optional broker_name).
- Submit → `POST /accounts` с `connection_type=manual` + `Idempotency-Key` header → новый account появляется в списке без full reload (query invalidation).
- Rename action работает (`PATCH /accounts/{id}` с `display_name`).
- Delete action с confirm → `DELETE /accounts/{id}` → account исчезает из списка.
- Sidebar `Accounts` ведёт на `/accounts` (не `/dashboard`), активный state работает.
- Toast feedback на success / error (используя existing ToastProvider из Slices 1-3).
- Form validation: `display_name` required + maxLength 120; `base_currency` required.
- 2-3 Vitest smoke зелёные. `pnpm test` green для apps/web.
- `pnpm lint` (biome) green. `pnpm typecheck` green.
- `pnpm build` green в apps/web.
- Никаких новых TDs не ожидается. Если CC находит genuine TD — фиксирует в TECH_DEBT.md как новый ID (TD-079+) с приоритетом + ссылкой на этот kickoff.

---

## Open questions (CC решает в процессе)

1. **`AccountConnectCard` reuse vs local component** — CC решает по факту (см. pre-flight check выше). Если не подходит, делает local `AccountListItem` в `apps/web/src/components/accounts/`.
2. **Currency dropdown source** — есть ли shared `CURRENCIES` const в packages? Если нет, hardcode top-10 в `accounts/page.tsx` и вынести в shared в Slice 8 (Settings.preferences). **Решение:** не плодить новый shared package ради 10 строк.
3. **Modal vs inline edit для Rename** — CC выбирает по UX простоте. Modal предпочтительнее (consistent с Add flow).
4. **Default `account_type`** — `manual` (соответствует connection_type=manual). Юзер может выбрать `broker` или `crypto` если у него реальный broker account который он ведёт вручную.
5. **`broker_name` field визуально** — required в OpenAPI только если `connection_type != manual`. Для manual flow — optional, placeholder "e.g. Interactive Brokers".

---

## Deliverables

1. PR в `main`: `feat(web): TASK_07 Slice 4a — Manual Accounts CRUD`.
2. GAP REPORT перед merge (в чат PO):
   - CI status (ожидаем 8/8 green; **обязательный** `gh pr checks <N> --watch` per TD-078).
   - File list (что добавлено / изменено).
   - TDs opened/closed (не ожидаю новых).
   - Scope-adjacent changes (sidebar update — единственное вне `accounts/`).
   - Скриншоты UI (опционально, если CC может сгенерить через playwright или просто описание визуально).
3. **После PO approval — CC сам делает merge + cleanup + docs pass:**
   - `gh pr merge <N> --squash --delete-branch`.
   - В main worktree `D:/investment-tracker`: `git checkout main && git pull origin main`.
   - `git worktree remove D:/investment-tracker-accounts-4a`.
   - `git branch -D feature/task07-slice4a` (после squash локальная ветка не выглядит merged — `-D` нужен).
   - Обновить `docs/merge-log.md` — запись merge'а (дата, squash SHA, scope).
   - Обновить `docs/PO_HANDOFF.md` § 1 — статус Slice 4a merged + новый main tip; § 2 PR table — новая строка.
   - Обновить `docs/UI_BACKLOG.md` — отметить Slice 4a ✅, обновить critical path.
   - Обновить `docs/TASK_07_web_frontend.md` — Slice 4a в таблице статуса.
   - Обновить `docs/README.md` если что-то в file index или wave статусе сместилось.
   - Если CC находит genuine ADR-worthy decision (например, "AccountConnectCard не использован, потому что..."), добавить в `docs/DECISIONS.md`.
   - Commit + push directly to main (`--no-verify` если lefthook не в PATH; docs-only direct push allowed per PO_HANDOFF § 3).
   - Финальный ping PO: «merged + cleaned + docs done, main tip now `<SHA>`. Готово к runtime smoke на staging.»

---

## PO notes (что делает PO — после CC ping'а «merged»)

- Vercel auto-deploy подхватит main за ~60s.
- Открыть `https://staging.investment-tracker.app/accounts` → должна быть пустая страница с "Add manual account" CTA.
- Создать manual account через UI → проверить что POST идёт на `https://api-staging.investment-tracker.app/accounts` (devtools network), 201 ответ, новый item в списке.
- Rename + Delete — smoke test.
- Если всё OK — следующий kickoff Slice 5a (Transactions UI).

---

## Стиль работы CC (напоминание)

- Русский, коротко, без overformatting.
- Decisions-first: сначала что делаешь, потом почему.
- Видишь риск — говори сразу.
- Верифицируй каждый Edit через Read (state loss бывал).
- LOC не трекать как scope metric — критерий = acceptance criteria + CI green.
- Pre-merge **обязательный** `gh pr checks <N> --watch` (TD-078 policy после CORS incident).
- Если что-то в scope непонятно или появилась дилемма — пиши в чат PO до того как делаешь large changes.
