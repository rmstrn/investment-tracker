# TASK 02 — Design System

**Status:** ✅ COMPLETED (2026-04-19)
**Merged:** PR #29 (b6aa0c4), PR #31 (8ab31a0 contrast fix), PR #32 (9dc4a7a CI hygiene + design-tokens subpath exports)
**Source of truth going forward:** `04_DESIGN_BRIEF.md` v1.1

**Волна:** 1 (параллельно с TASK_01, TASK_03)
**Зависит от:** ничего
**Блокирует:** TASK_07 (Web), TASK_08 (iOS)
**Срок:** 2-3 недели (начинается сразу, идёт параллельно всем другим)

## Цель

Создать единую визуальную систему, которая работает на вебе и iOS из одних
токенов. Ключевые экраны в макетах. UI должен выглядеть премиально — это
финансовое приложение.

## Что нужно сделать

### 1. Figma-файл со структурой

```
Investment Tracker — Design System
├── 00 — Foundations
│   ├── Colors (light + dark)
│   ├── Typography
│   ├── Spacing scale
│   ├── Border radius
│   ├── Shadows
│   └── Icons (Lucide)
├── 01 — Components
│   ├── Button (5 variants × 3 sizes × 3 states)
│   ├── Input (text, number, select, date)
│   ├── Card (default, elevated, interactive)
│   ├── Dialog / Sheet / Popover
│   ├── Tabs
│   ├── Badge / Pill
│   ├── Avatar
│   ├── Skeleton / Loading states
│   ├── Toast / Alert
│   ├── Chart components (line, pie, bar)
│   └── AI Chat message bubble
├── 02 — Patterns
│   ├── Form layouts
│   ├── Empty states
│   ├── Error states
│   └── Paywall
└── 03 — Screens
    ├── Web (1440, 1024, 768, 375 breakpoints)
    └── iOS (390, 428 viewports)
```

### 2. Дизайн-токены (экспорт через Style Dictionary)

Токены должны быть единственным источником истины. Один источник — два приложения.

**Категории токенов:**

- `color.background.{primary, secondary, tertiary, elevated}`
- `color.text.{primary, secondary, tertiary, brand, muted}`
- `color.border.{subtle, default, strong}`
- `color.state.{positive, negative, warning, info}`
- `color.portfolio.{gain, loss, neutral}` — специфичные для финансового UI
- `spacing.{0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24}`
- `radius.{none, sm, md, lg, xl, full}`
- `font.family.{sans, mono}`
- `font.size.{xs, sm, base, lg, xl, 2xl, 3xl, 4xl}`
- `font.weight.{regular, medium, semibold, bold}`
- `shadow.{sm, md, lg, xl}`
- `motion.duration.{fast, normal, slow}`
- `motion.easing.{default, in, out, inOut}`

Экспорт через **Style Dictionary** в:
- `tailwind.config.ts` — для web
- `Tokens.swift` — для iOS

### 3. Ключевые экраны в макетах

Приоритетный список (макеты на десктоп + мобильный web + iOS):

**Auth & Onboarding**
- Sign up / Sign in
- Onboarding chat (5-7 вопросов от ИИ)
- Connect first account flow
- Welcome / empty state

**Main screens**
- **Dashboard** — главный экран с карточкой "Insight of the day", стоимость, графики
- **Positions** — список позиций с группировкой
- **Position Detail** — конкретная акция/монета
- **AI Chat** — отдельный таб, разговор
- **Insights** — лента проактивных инсайтов
- **Accounts** — подключённые счета, добавить новый

**Flows**
- Add transaction manually
- Import CSV / PDF (позже)
- Connect broker (SnapTrade OAuth flow)

**Settings**
- Profile
- Display currency + locale
- Subscription management (Stripe portal link)
- Notifications
- Delete account

**Monetization**
- Pricing page (Free / Plus / Pro)
- Paywall modal (когда фича заблокирована)
- Upgrade flow

**Legal/Meta**
- 404
- 500 / error
- Terms of Service page
- Privacy Policy page

### 4. Визуальный стиль — принципы

1. **Не финтех-клише.** Избегаем темно-синий + зелёный с золотым. Смотрим на
   современные продукты: Linear, Arc, Raycast, Cursor. Минимализм + личность.

2. **Цветовая палитра.** Нейтральная база (off-white/off-black) + один
   акцентный цвет для брендинга (кандидаты: deep violet, dark teal, warm amber).
   Семантические цвета — сдержанные (не ярко-красный, не ярко-зелёный —
   приглушённые, "финансовые").

3. **Типографика.** Системные шрифты или Inter / Geist / Satoshi. Таблицы и
   числа — моноширинный шрифт (JetBrains Mono или Geist Mono) для
   выравнивания.

4. **Dark mode — first class.** Финансовые приложения часто используются
   вечером, dark mode должен быть не "инвертированный light", а продуманный
   отдельно.

5. **Data-dense экраны ≠ перегруженные.** Дашборд показывает много данных —
   используем whitespace, типографическую иерархию, аккуратные разделители.

6. **Анимации — тонкие, функциональные.** Никаких "bounce" эффектов.
   Transitions 200-300ms, easing `ease-out`. Подсказки направления
   (например, число подрастает когда увеличивается).

7. **Графики — уникальный стиль.** Не дефолтный Recharts. Тонкие линии,
   деликатные точки, минималистичные tooltips.

### 5. Motion / прототипы

Для ключевых flow'ов сделать прототипы в Figma:
- Onboarding chat (как разговор "печатается")
- Подключение счёта (ступени + success state)
- AI Chat (как сообщения появляются, стриминг)
- Paywall появление

### 6. Assets

- Favicon (16, 32, 192, 512, apple-touch-icon)
- App Icon iOS (1024×1024 мастер + все размеры)
- OG-image для веба (1200×630)
- Screenshots для App Store (iPhone 15 Pro Max, iPhone 15, iPad)

## Definition of Done

- [ ] Figma-файл структурирован и доступен команде
- [ ] Все foundation-токены определены (colors, typography, spacing, etc.)
- [ ] Light + Dark режимы для всех токенов
- [ ] 20+ компонентов в компонент-библиотеке Figma
- [ ] Style Dictionary настроен, генерирует Tailwind config и Swift tokens
- [ ] Все приоритетные экраны в макетах (desktop + mobile + iOS)
- [ ] 4+ ключевых flow'а с прототипами
- [ ] App icon утверждён
- [ ] Документ с design principles (1 страница для команды)

## Важные решения

- **Figma как источник истины** — код следует за макетами, не наоборот
- **shadcn/ui как база для веба** — мы её кастомизируем, не пишем с нуля
- **SF Symbols + Lucide для иконок** — единый стиль
- **iOS ≠ iOS-porting of web** — разные платформы, разные UX-паттерны, но
  общие токены и дух

## Что НЕ делаем

- Не рисуем иконки с нуля (используем Lucide для web, SF Symbols для iOS)
- Не пишем код компонентов (это TASK_07 и TASK_08)
- Не делаем идеально полный design system (стартуем с приоритетного, растём)
- Не тратим неделю на выбор брендового цвета — решаем быстро, меняем если надо

## Полезные референсы

- **Linear** — для data-density и чувства качества
- **Lunchmoney.app** — финансовое приложение с хорошим UX
- **Monzo** — банк с сильным брендингом
- **Raycast** — для keyboard-first ощущений
- **Cron (Notion Calendar)** — для clean-minimalism

НЕ референсы: Robinhood (слишком gamified), eToro (перегруженный), большинство
трекеров (скучные).

## Следующий шаг после готовности

Когда токены и ключевые компоненты готовы:
- TASK_07 (Web) забирает Tailwind tokens и начинает собирать компоненты
- TASK_08 (iOS) забирает Swift tokens и начинает собирать SwiftUI views
