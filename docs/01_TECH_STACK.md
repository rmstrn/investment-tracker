# 01 — Tech Stack

Финальный стек, принятый для проекта. Все решения обоснованы.

## Бекенд

| Компонент | Технология | Версия | Обоснование |
|---|---|---|---|
| Язык Core API | Go | 1.23+ | производительность, конкурентность, подходит для синхронизации с брокерами |
| Web framework | Fiber | v3 | самый быстрый в экосистеме Go, Express-like API |
| ORM / Queries | sqlc + pgx | latest | генерит типобезопасные Go-структуры из SQL, без runtime-магии |
| Миграции БД | goose | latest | простые версионируемые SQL-миграции |
| Очереди | asynq | latest | фоновые задачи с ретраями, работает поверх Redis |
| Валидация | go-playground/validator | v10 | стандарт |
| Логирование | zerolog | latest | структурированные JSON-логи |
| OpenAPI | huma v2 | latest | автогенерит OpenAPI 3.1 спеку |

## AI-сервис

| Компонент | Технология | Обоснование |
|---|---|---|
| Язык | Python 3.13 | вся ИИ-экосистема на Python |
| Framework | FastAPI | стандарт для ИИ-сервисов, async, auto-docs |
| Schemas | Pydantic v2 | типобезопасность между Python и Go |
| LLM SDK | Anthropic SDK | Claude — основная модель |
| Векторы | pgvector (расширение Postgres) | не поднимаем отдельную векторную БД |
| Агенты (если нужно) | LangGraph | для сложных multi-step агентов |

## База данных и кэш

| Компонент | Технология | Провайдер |
|---|---|---|
| Primary DB | PostgreSQL | 17 | Neon или Supabase (managed) |
| Cache + очереди | Redis | 7+ | Upstash (serverless, платим за запросы) |
| File storage | S3-compatible | Cloudflare R2 (без egress fees) |

## Веб

| Компонент | Технология | Версия |
|---|---|---|
| Framework | Next.js | 15 (App Router, RSC, Server Actions) |
| UI library | React | 19 (Actions, use hook, new compiler) |
| Язык | TypeScript | 5.7+ в strict mode |
| Стили | Tailwind CSS | v4 (Rust-движок Oxide) |
| Компоненты | shadcn/ui | latest |
| Иконки | lucide-react | latest |
| Формы | React Hook Form + Zod | latest |
| Data fetching | TanStack Query | v5 |
| Графики (базовые) | Recharts | latest |
| Графики (кастомные) | Visx + D3 | latest |
| Анимации | Motion | latest |
| Runtime | Bun (dev), Node (prod) | latest |
| Монорепа | Turborepo | latest |
| Linting/formatting | Biome | latest (вместо ESLint+Prettier) |

## iOS

| Компонент | Технология |
|---|---|
| Язык | Swift 6 |
| UI framework | SwiftUI |
| Минимальная версия iOS | 17.0 (целимся в Liquid Glass из iOS 26) |
| Architecture | Observable + @Observable (или TCA если сложность вырастет) |
| Networking | URLSession + async/await (без Alamofire) |
| Локальное хранение | SwiftData |
| Графики | Swift Charts |
| Аутентификация | Clerk iOS SDK |
| Push notifications | APNS нативно |

## Android (месяц 7-8)

| Компонент | Технология |
|---|---|
| Язык | Kotlin |
| UI framework | Jetpack Compose |
| Минимальная версия Android | API 28 (Android 9) |
| Architecture | MVVM + Hilt |

## Инфраструктура и хостинг

| Компонент | Провайдер |
|---|---|
| Веб хостинг | Vercel |
| Бекенд хостинг | Fly.io (Go-бинарники отлично летают) |
| Мобильные сборки | EAS (Expo) или Xcode Cloud для iOS |
| CDN | Cloudflare |
| DNS | Cloudflare |
| Репозиторий | GitHub |
| CI/CD | GitHub Actions |

## Сторонние сервисы

| Функция | Сервис |
|---|---|
| Аутентификация | Clerk |
| Платежи | Stripe |
| Email транзакционные | Resend |
| LLM API | Anthropic Claude API |
| Рыночные данные — акции | Polygon.io |
| Рыночные данные — крипта | CoinGecko API |
| Валютные курсы | ECB + openexchangerates |
| Агрегатор брокеров | SnapTrade (+ Plaid как опция) |
| Криптобиржи | Прямые API (Binance, Coinbase, Kraken) |
| Ошибки | Sentry |
| Продуктовая аналитика | PostHog |
| APM / метрики | Grafana Cloud |
| Секреты | Doppler или AWS Secrets Manager |

## Дизайн

| Инструмент | Назначение |
|---|---|
| Figma | Источник истины для UI |
| Style Dictionary | Экспорт токенов в Tailwind + Swift одновременно |

## Инструменты разработки

| Назначение | Инструмент |
|---|---|
| Package manager (Node) | pnpm |
| Package manager (Python) | uv |
| Pre-commit hooks | Lefthook |
| Code review | GitHub + CodeRabbit (AI-ревью) |
| IDE | Cursor / Claude Code / VS Code |
| Database client | TablePlus или DataGrip |
| API testing | Bruno или Insomnia |
| Локальный Postgres | Docker Compose |

## Принципы выбора стека

1. **Managed services везде где можно** — не хочется админить базы, Redis, CDN
2. **Свежие версии стабильных инструментов** — Next.js 15, React 19, Swift 6
3. **Типобезопасность от края до края** — Zod/Pydantic/Swift валидирует на границах
4. **Observability с первого дня** — Sentry, PostHog, structured logs
5. **Локальная разработка = прод** — Docker Compose поднимает полностью рабочую среду

## Что НЕ используем и почему

| Технология | Почему НЕ |
|---|---|
| React Native | iOS-first стратегия, нативный UX на iOS важен |
| Node.js для Core API | Go даёт лучше для конкурентных операций (синк брокеров) |
| MongoDB | Наши данные реляционные (пользователи, счета, сделки) |
| Firebase | Vendor lock-in, не подходит для финансового приложения |
| Redux | TanStack Query + React Context достаточно |
| GraphQL | REST + OpenAPI проще для MVP, GraphQL — overkill |
| ESLint + Prettier | Biome в 10 раз быстрее, один инструмент |
| Alamofire | URLSession в Swift 6 хорош сам по себе |
| ORM (GORM в Go) | sqlc предсказуемее, видим реальные SQL |

## Примерные затраты на инфраструктуру

| Стадия | Пользователей | Стоимость в месяц |
|---|---|---|
| Dev | 0 | $0–50 (в основном free tiers) |
| Beta | <500 | $200–400 |
| Launch | 1 000–5 000 | $500–1 200 |
| Growth | 10 000 | $1 500–3 000 |
| Scale | 100 000 | $8 000–15 000 (с оптимизациями) |

Основные статьи: Neon/Supabase, Vercel, Fly.io, Anthropic API, Polygon.io, SnapTrade.
