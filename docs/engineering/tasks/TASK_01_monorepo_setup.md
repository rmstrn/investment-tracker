# TASK 01 — Monorepo Setup & DevOps

**Status:** ✅ COMPLETED (wave 1 foundation)
**Follow-ups tracked:** `TECH_DEBT.md` → TD-001 (Turbopack + typedRoutes), TD-002 (`make` on Windows), TD-R002 (port :8080 conflict resolved)

**Волна:** 1 (стартовая)
**Зависит от:** ничего
**Блокирует:** все остальные таски кода (04, 05, 06, 07, 08)
**Срок:** 3-5 дней

## Цель

Поставить фундамент проекта: монорепу, CI/CD, локальное окружение, инструменты.
После этого таска любой разработчик может склонировать репо, запустить одну
команду и получить рабочую среду.

## Что нужно сделать

### 1. Turborepo monorepo

Структура:

```
investment-tracker/
├── apps/
│   ├── web/              # Next.js 15 (пустой проект для TASK_07)
│   ├── api/              # Go Core API (пустой для TASK_04)
│   ├── ai/               # Python AI Service (пустой для TASK_05)
│   └── ios/              # iOS app (не в монорепе, отдельный репо или subtree)
├── packages/
│   ├── shared-types/     # Общие TS типы (генерятся из OpenAPI)
│   ├── api-client/       # Сгенерированный TS API-клиент
│   ├── ui/               # Shared UI components (если будут)
│   └── config/           # Общие конфиги (eslint, tsconfig base)
├── tools/
│   ├── scripts/          # Deploy/DB скрипты
│   └── openapi/          # OpenAPI spec + generators
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── docker-compose.yml    # Локальный Postgres + Redis
└── .github/workflows/    # CI/CD
```

### 2. Package managers

- **Node:** pnpm (быстрее npm, workspace-friendly)
- **Python:** uv (в 10x быстрее pip, современный)
- **Go:** стандартный go modules

### 3. Docker Compose для локальной разработки

Файл `docker-compose.yml` должен поднимать:
- PostgreSQL 17 с volume для persistence
- Redis 7
- pgAdmin или Adminer (опционально для удобства)

Команда `pnpm dev:infra` должна запускать это.

### 4. Secrets management

- **Локально:** `.env.local` файлы (gitignored)
- **Продакшен:** Doppler
- **CI:** GitHub Secrets
- **Документация:** `.env.example` в каждом app с комментариями

### 5. GitHub Actions CI/CD

**Workflow: pull_request**
- `lint` — все линтеры (Biome для TS, golangci-lint для Go, ruff для Python)
- `typecheck` — TypeScript, Python (mypy), Go build
- `test` — unit-тесты всех приложений
- `security` — Dependabot, Trivy scan

**Workflow: push to main**
- Всё из PR +
- `build` — билд всех приложений
- `deploy-preview` — превью-деплой (Vercel для web, Fly.io для api/ai)

**Workflow: release tag**
- `deploy-production`

### 6. Линтеры и форматтеры

- **TS/JS:** Biome (один инструмент вместо ESLint+Prettier)
- **Go:** golangci-lint с конфигом (gofmt, errcheck, staticcheck, revive)
- **Python:** ruff + mypy
- **SQL:** sqlfluff
- **Commit messages:** Conventional Commits + commitlint

### 7. Git hooks

Через **Lefthook** (быстрее Husky):
- `pre-commit`: format + lint на staged-файлах
- `commit-msg`: commitlint
- `pre-push`: typecheck + unit-тесты

### 8. Observability setup (базовый)

- Sentry проекты для web, api, ai (отдельные DSN)
- PostHog проект
- Grafana Cloud (free tier) для логов и метрик

### 9. Базовая документация

В корне проекта:
- `README.md` — как запустить локально
- `CONTRIBUTING.md` — процесс работы, стиль коммитов
- `docs/local-setup.md` — подробная инструкция
- `docs/architecture.md` — ссылка на 02_ARCHITECTURE.md из project files

## Definition of Done

- [ ] Монорепа структура создана, `pnpm install` работает
- [ ] `pnpm dev:infra` поднимает Postgres + Redis
- [ ] Пустые apps/web, apps/api, apps/ai собираются (`pnpm build`)
- [ ] CI зелёный на PR (lint, typecheck, test)
- [ ] Превью-деплой работает при PR
- [ ] README позволяет новому разработчику запустить проект за <10 минут
- [ ] Secrets management работает: переменные читаются из .env локально и из Doppler в продакшене
- [ ] Git hooks работают (можно протестировать плохим коммитом)
- [ ] Sentry, PostHog инициализированы в каждом app (пока без реальных событий)

## Важные решения (принятые ранее)

- **pnpm**, не npm и не yarn
- **Biome**, не ESLint+Prettier
- **Turborepo**, не Nx
- **Lefthook**, не Husky
- **Doppler** для секретов (открыт к альтернативам, но не AWS Secrets — дорого для MVP)

## Конкретные библиотеки и версии

| Что | Версия |
|---|---|
| Node | 22 LTS |
| pnpm | 9+ |
| Go | 1.25+ |
| Python | 3.13 |
| Turborepo | latest |
| Biome | latest |
| PostgreSQL | 17 |
| Redis | 7+ |

## Что НЕ делаем в этом таске

- Не пишем код приложений (это TASK_04+)
- Не настраиваем production Kubernetes (Fly.io достаточно)
- Не пишем dashboards в Grafana (это позже)
- Не настраиваем Datadog (дорого, вернёмся к APM когда будет нужда)

## Полезные ссылки

- Turborepo docs: https://turborepo.com/docs
- Biome: https://biomejs.dev
- Lefthook: https://github.com/evilmartians/lefthook
- Fly.io deploy Go: https://fly.io/docs/languages-and-frameworks/golang/

## Вопросы, которые могут возникнуть

**Q: iOS отдельный репо или subtree?**
A: Отдельный репо (proj-ios). Swift-проекты в монорепе с Node/Go создают неудобства с Xcode. Общение через API-контракт (OpenAPI) и git submodules для генерированного клиента, если нужен.

**Q: Почему не Nx?**
A: Nx мощнее, но сложнее. Turborepo проще, его хватает для монорепы такого размера.

**Q: Managed Postgres для dev?**
A: Нет. Локальный Postgres в Docker — быстрее, бесплатно, легче сбросить.

**Q: Почему Doppler, а не Vault?**
A: Vault — overkill для стартапа. Doppler простой, интегрируется с Vercel, Fly.io, GitHub Actions.
