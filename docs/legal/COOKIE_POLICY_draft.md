# Memoro — Cookie Policy (DRAFT)

**Status:** DRAFT — first-pass internal legal-advisor output. Requires licensed counsel review + final cookie-audit before public launch.
**Version:** 0.1 (2026-04-23)
**Owner:** legal-advisor (internal SME) · final sign-off: licensed counsel + tech-lead for the cookie inventory audit.
**Key `[ATTORNEY REVIEW]` items:** cookie inventory accuracy (requires tech-lead audit of production bundle), third-party cookie lifetime verification, CMP vendor selection, ePrivacy Directive (as amended) transposition variance per EU member state.

---

## Reader orientation

Bilingual (EN first, RU mirror) per positioning lock. EN governs.

---

# EN — Cookie Policy

## 1. What this Policy covers

This Cookie Policy describes how Memoro (operated by **`[ENTITY TBD]`**, "we") uses cookies and similar technologies on `memoro.co` and related properties (collectively, the "Service"). It should be read together with our [Privacy Policy](./PRIVACY_POLICY_draft.md) and [Terms of Service](./TOS_draft.md).

This Policy is drafted to comply with:
- The EU General Data Protection Regulation (GDPR), Regulation (EU) 2016/679
- The ePrivacy Directive 2002/58/EC as amended by 2009/136/EC (the "Cookie Directive"), as transposed into national law in each EU member state (e.g. TTDSG in Germany, LCEN / CNIL guidance in France, PECR in UK)
- The California Consumer Privacy Act (CCPA/CPRA) transparency obligations

## 2. What cookies are

A cookie is a small text file placed on your device when you visit a website. Cookies are used for authentication, preferences, analytics, and other purposes. "Similar technologies" include pixel tags, web beacons, local storage, session storage, and IndexedDB — this Policy treats all of them together as "cookies" unless stated otherwise.

## 3. Consent model

Under EU and UK law, we may set cookies without consent only if they are **strictly necessary** to provide the service you requested (e.g. to authenticate you, to remember your current session, to secure a form submission). All other categories — preferences, analytics, marketing — require your **explicit opt-in consent**, obtained through a consent banner displayed on your first visit.

You can review and change your cookie preferences at any time by clicking **"Cookie Preferences"** in the site footer. Withdrawing consent does not affect processing already performed under the previous consent.

Outside the EU/UK, we apply the same consent model as a matter of product policy (opt-in for non-essential), to simplify operations.

> `[ATTORNEY REVIEW]` — Consent UX (banner design, granularity, opt-out symmetry with opt-in) is heavily scrutinized by CNIL, BfDI, and ICO. A real CMP (Consent Management Platform) vendor must be selected; recommended options include Cookiebot, OneTrust, or an in-house solution validated against IAB TCF 2.2. Selection is a `[PAID SERVICE — CONSTRAINT RULE 1 — requires PO approval]` decision or a build decision for tech-lead.

## 4. Cookie categories we use

The matrix below lists the cookie categories currently in use on the Service. The specific cookie inventory is audited and maintained by tech-lead; see `[COOKIE INVENTORY — audit pending]` for the current authoritative list.

| Category | Purpose | Legal basis | Consent required |
|---|---|---|---|
| **Strictly necessary** | Authentication, session management, CSRF protection, load balancing | GDPR Art. 6(1)(b) performance of contract | No |
| **Preferences** | Remember display currency, theme, language, timezone | GDPR Art. 6(1)(a) consent | Yes |
| **Analytics** | Aggregate product usage to improve the Service | GDPR Art. 6(1)(a) consent | Yes |
| **Marketing** | *Not currently used.* Would cover third-party advertising or remarketing pixels. | GDPR Art. 6(1)(a) consent | Yes (and would require explicit opt-in) |

## 5. Cookie inventory

> `[ATTORNEY REVIEW]` + `[TECH-LEAD ACTION]` — The inventory below is a DRAFT based on current known integrations. Before public launch, tech-lead must perform a production cookie audit (manual + automated scan with a CMP vendor's audit tool) and reconcile this table. Each cookie must be confirmed for name, domain, purpose, duration, and third-party involvement.

### 5.1 Strictly necessary (no consent required)

| Name | Set by | Purpose | Duration | Type |
|---|---|---|---|---|
| `__session` | Clerk | Authentication session | Session (until browser closed) | First-party, HTTP-only |
| `__client_uat` | Clerk | Client user-agent token for session refresh | 7 days | First-party, HTTP-only |
| `memoro_csrf` | Memoro | CSRF token for form submissions | Session | First-party, HTTP-only, SameSite=Strict |
| `__cf_bm` | Cloudflare / Fly.io edge | Bot management and DDoS protection | 30 minutes | First-party set by network provider |

### 5.2 Preferences (opt-in)

| Name | Set by | Purpose | Duration | Type |
|---|---|---|---|---|
| `memoro_currency` | Memoro | Store selected display currency | 1 year | First-party |
| `memoro_theme` | Memoro | Store UI theme preference (light/dark/system) | 1 year | First-party |
| `memoro_locale` | Memoro | Store preferred language | 1 year | First-party |

### 5.3 Analytics (opt-in)

> `[TECH-LEAD ACTION]` — Analytics vendor selection pending. If PostHog / Plausible / Matomo is chosen, update this section with the exact cookie names and durations. If an analytics vendor with self-hosted option is chosen, document accordingly. If no analytics cookies are set (e.g. server-side-only anonymous analytics), delete this section.

| Name | Set by | Purpose | Duration | Type |
|---|---|---|---|---|
| `[TBD]` | `[TBD]` | Product usage analytics | `[TBD]` | `[TBD]` |

### 5.4 Marketing (none currently)

We do not currently use marketing or advertising cookies on the Service. If this changes, we will update this Policy and re-prompt for consent.

## 6. Third-party cookies

Some subprocessors may set cookies on your device as part of their embedded functionality (e.g. Clerk's authentication widget, Stripe Elements when we add payments). These third-party cookies are subject to the third party's privacy policy as well as ours. We list known third-party cookies in Section 5 and update the inventory when subprocessors change.

## 7. Local storage and similar technologies

In addition to cookies, we use browser local storage and session storage for:
- **Draft chat messages** — so you don't lose what you typed if the page reloads
- **UI state** — e.g. sidebar collapsed/expanded, last-viewed tab
- **Optimistic update buffers** — for responsive UI during API calls

These are stored only on your device and are not transmitted to us. They are cleared when you clear your browser data.

## 8. Do Not Track

Most browsers offer a "Do Not Track" (DNT) setting. There is no industry consensus on how sites should respond to DNT signals. Memoro does **not** currently respond to DNT signals; instead, we rely on the cookie consent banner for opt-in control of non-essential cookies. For Global Privacy Control (GPC) signals under CCPA, we honor GPC for California residents.

> `[ATTORNEY REVIEW]` — GPC signal handling is required for California (CPRA regulations) and increasingly expected by Colorado, Connecticut, and other US states. Tech-lead must implement GPC detection and treat it as an opt-out-of-sale/share signal (equivalent to our "Do Not Sell" link, which in our current configuration has nothing to opt out of but must be respected symbolically).

## 9. Changes to this Policy

We may update this Cookie Policy as our cookie usage changes. When we add a new category of cookie (particularly analytics or marketing), we will re-prompt for your consent. Minor updates (e.g. changing an analytics vendor within the same category with equivalent risk) may take effect upon posting. The version date at the top of this Policy indicates the current version.

## 10. Contact

Cookie and privacy inquiries: **`[PRIVACY CONTACT EMAIL TBD]`**.

---

# RU — Политика cookies (ЧЕРНОВИК)

**Статус.** Черновик. Параллельная русскоязычная версия. Английская версия имеет приоритет при расхождении.

## 1. Сфера действия

Настоящая Политика cookies описывает использование cookies и аналогичных технологий на `memoro.co` и связанных ресурсах («Сервис») компанией Memoro (оператором является **`[ЮРЛИЦО — TBD]`**). Читается вместе с [Privacy Policy](./PRIVACY_POLICY_draft.md) и [Terms of Service](./TOS_draft.md).

Соответствует:
- GDPR (EU) 2016/679
- Директиве ePrivacy 2002/58/EC с изменениями 2009/136/EC, в национальной транспозиции (TTDSG Германия, CNIL Франция, PECR UK и т.д.)
- CCPA/CPRA (Калифорния) — требования прозрачности

## 2. Что такое cookies

Cookie — небольшой текстовый файл, размещаемый на вашем устройстве при посещении сайта. Используется для аутентификации, предпочтений, аналитики и других целей. «Аналогичные технологии» — pixel tags, web beacons, local storage, session storage, IndexedDB.

## 3. Модель согласия

По праву ЕС и UK мы можем устанавливать cookies без согласия только если они **строго необходимы** для предоставления запрошенной вами услуги (аутентификация, сессия, защита форм). Все остальные категории — предпочтения, аналитика, маркетинг — требуют вашего **явного opt-in согласия** через баннер при первом визите.

Пересмотреть и изменить настройки можно в любой момент по ссылке **«Настройки cookies»** в футере сайта. Отзыв согласия не влияет на уже выполненную обработку.

Вне ЕС/UK мы применяем ту же модель согласия как продуктовую политику.

## 4. Категории cookies

| Категория | Цель | Правовое основание | Требуется согласие |
|---|---|---|---|
| **Строго необходимые** | Аутентификация, сессия, CSRF, балансировка | Ст. 6(1)(b) GDPR | Нет |
| **Предпочтения** | Валюта отображения, тема, язык, часовой пояс | Ст. 6(1)(a) согласие | Да |
| **Аналитика** | Агрегированная статистика использования | Ст. 6(1)(a) согласие | Да |
| **Маркетинг** | *Не используется сейчас.* | Ст. 6(1)(a) согласие | Да (при появлении — opt-in) |

## 5. Реестр cookies

### 5.1 Строго необходимые (без согласия)

| Имя | Устанавливается | Цель | Длительность | Тип |
|---|---|---|---|---|
| `__session` | Clerk | Аутентификационная сессия | Сессия | first-party, HTTP-only |
| `__client_uat` | Clerk | Client user-agent token | 7 дней | first-party, HTTP-only |
| `memoro_csrf` | Memoro | CSRF-токен | Сессия | first-party, HTTP-only, SameSite=Strict |
| `__cf_bm` | Cloudflare / Fly.io | Защита от ботов и DDoS | 30 минут | first-party через сеть |

### 5.2 Предпочтения (opt-in)

| Имя | Устанавливается | Цель | Длительность | Тип |
|---|---|---|---|---|
| `memoro_currency` | Memoro | Валюта отображения | 1 год | first-party |
| `memoro_theme` | Memoro | Тема UI | 1 год | first-party |
| `memoro_locale` | Memoro | Предпочтительный язык | 1 год | first-party |

### 5.3 Аналитика (opt-in)

Выбор аналитического вендора в процессе. Таблица будет обновлена после выбора.

### 5.4 Маркетинг

Не используется.

## 6. Сторонние cookies

Некоторые субпроцессоры могут устанавливать cookies на ваше устройство в рамках встроенного функционала (виджет Clerk, Stripe Elements когда добавим платежи). Подчиняются политикам сторон.

## 7. Local storage и аналогичные технологии

Используем browser local storage и session storage для: черновиков сообщений чата, UI-состояния (свёрнутая панель, последняя вкладка), буферов оптимистичных обновлений. Хранятся только на вашем устройстве, нам не передаются.

## 8. Do Not Track

Memoro **не** реагирует на сигнал Do Not Track; опираемся на cookie-баннер. Для Global Privacy Control (GPC) — чтим GPC для резидентов Калифорнии по CPRA.

## 9. Изменения Политики

Обновляем при изменении использования cookies. Новая категория (особенно аналитика/маркетинг) — переспрос согласия. Незначительные — вступают в силу при публикации.

## 10. Контакт

Вопросы: **`[PRIVACY EMAIL — TBD]`**.

---

## Cross-reference matrix — ATTORNEY REVIEW + TECH-LEAD items

| # | Item | Section | Owner |
|---|---|---|---|
| 1 | CMP vendor selection (Cookiebot / OneTrust / in-house) | 3 | PO + tech-lead |
| 2 | Production cookie audit | 5 | tech-lead |
| 3 | Analytics vendor selection | 5.3 | PO + tech-lead |
| 4 | GPC signal handling implementation | 8 | tech-lead |
| 5 | Consent UX validation (banner design, granularity, opt-out symmetry) | 3 | product-designer + legal counsel |
| 6 | Per-member-state ePrivacy transposition variance check | 1 | privacy counsel |

## References

- ePrivacy Directive 2002/58/EC as amended: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02002L0058-20091219
- GDPR Article 7 (conditions for consent): https://gdpr-info.eu/art-7-gdpr/
- EDPB Guidelines 05/2020 on consent: https://edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-consent-under-regulation-2016679_en
- UK ICO cookie guidance: https://ico.org.uk/for-organisations/advice-for-small-organisations/frequently-asked-qs/cookies/
- CNIL (France) cookie guidance: https://www.cnil.fr/en/cookies-and-trackers
- BfDI / TTDSG (Germany): https://www.gesetze-im-internet.de/ttdsg/
- IAB Europe TCF 2.2: https://iabeurope.eu/tcf-2-2/
- California CPRA regulations (GPC): https://oag.ca.gov/privacy/ccpa/regs

All URLs accessed 2026-04-23.
