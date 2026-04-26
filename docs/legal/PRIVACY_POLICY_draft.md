# Provedo — Privacy Policy (DRAFT)

**Status:** DRAFT — first-pass internal legal-advisor output. NOT a finalized policy. Requires licensed privacy counsel review per market before public launch.
**Version:** 0.1 (2026-04-23)
**Scope:** GDPR (EU/EEA), UK GDPR + DPA 2018, California (CCPA/CPRA), general US state privacy laws. Russia 152-ФЗ excluded (Russia out of launch scope per `DECISIONS.md` 2026-04-23 Q7).
**Owner:** legal-advisor (internal SME) · final sign-off: licensed counsel per jurisdiction.
**Jurisdictions marked `[ATTORNEY REVIEW]`:** entity/controller identification, retention-period confirmation, SCC version selection, lawful-basis allocation per category, CCPA «Notice at Collection» specificity, children-data boilerplate per-state.

---

## Reader orientation

This document is written in two columns — English first, Russian mirror second — for every substantive clause. English is the primary legal version for launch (EN-only day-1 per `02_POSITIONING.md` v3.1). Russian is a parallel draft maintained for future CIS-non-RU expansion (Kazakhstan, Armenia, etc. post-alpha). Both versions must be kept in sync by legal-advisor on every update. If they drift, English governs.

---

# EN — Privacy Policy

## 1. Who we are

Provedo (the "Service") is operated by **`[ENTITY TBD]`** (the "Company", "we", "us"), a **`[legal form — LLC / Ltd / GmbH / etc. TBD]`** with its registered office at **`[ADDRESS TBD]`**. Our primary domain is `provedo.ai`. For the purposes of the EU General Data Protection Regulation (GDPR), the UK GDPR, and the California Consumer Privacy Act (CCPA/CPRA), the Company is the **data controller** for personal data processed in connection with the Service.

For EU/EEA users, our EU representative under GDPR Article 27 is **`[EU REP TBD — required if Company is not established in EU/EEA]`**.

For UK users, our UK representative under UK GDPR Article 27 is **`[UK REP TBD — required if Company is not established in UK]`**.

Data protection contact: **`[DPO / PRIVACY CONTACT EMAIL — TBD]`**. This is also the address for exercising any of the rights described in Section 7.

> `[ATTORNEY REVIEW]` — Confirm legal entity form + jurisdiction of incorporation before finalizing. Confirm whether a formal DPO is required under GDPR Article 37 (depends on core activities + regular systematic monitoring + large-scale special category data — likely NOT required for Provedo at current scale, but a designated privacy contact is mandatory regardless). EU Article 27 representative is required only if Company is not established in an EU member state.

## 2. What Provedo is (context for processing)

Provedo is an AI-assisted portfolio intelligence service. Users connect read-only brokerage and crypto exchange accounts; Provedo aggregates positions, surfaces observations ("Insights"), answers questions about the user's actual holdings ("Chat"), and describes patterns in the user's historical trades ("Coach"). Provedo is **not** a registered investment advisor and does not provide investment advice. The Service is educational and informational. This Privacy Policy describes how we handle personal data in the course of providing the Service.

## 3. Data we collect

We collect and process the following categories of personal data:

### 3.1 Account data
- Email address (required for authentication)
- Display name (optional)
- Profile preferences (display currency, language, timezone)
- Password (when applicable — stored as a cryptographic hash only, never in plaintext)
- Authentication session tokens and multi-factor credentials (managed by our authentication subprocessor, Clerk)

**Source:** directly from you during sign-up or profile updates.

### 3.2 Brokerage and exchange connection data
- OAuth access tokens and refresh tokens issued by your broker/exchange via our aggregation partners (Plaid, SnapTrade)
- Institution identifiers (broker name, account nickname, account type — e.g. IRA, taxable, margin)
- Account balances, positions (ticker symbol, quantity, cost basis, market value), and transaction history (buys, sells, dividends, interest, transfers, corporate actions)

**Important:** Provedo does **not** store your broker username or password. Plaid / SnapTrade hold OAuth tokens on our behalf; we hold a reference to the connection and cached position/transaction snapshots.

**Source:** from your broker or exchange via Plaid or SnapTrade after you explicitly authorize the connection.

### 3.3 AI interaction data
- Chat messages you send to Provedo
- AI-generated responses (including tool-call transcripts and cited sources)
- Feedback signals (thumbs-up/down, "report response" submissions)
- Prompts and response embeddings used for caching and retrieval

**Source:** directly from you during interaction with the Service.

### 3.4 Usage and device data
- Access timestamps, pages viewed, features used
- Device type, operating system, browser type and version
- IP address (truncated/hashed where possible for analytics)
- Crash logs and error reports
- Cookies and similar technologies (see `COOKIE_POLICY_draft.md` for the full inventory)

**Source:** automatically when you use the Service.

### 3.5 Billing data (when applicable for paid tiers)
- Payment method (processed by Stripe — we do **not** see or store full card numbers)
- Billing address and tax identifier where required by jurisdiction
- Invoice history and tier subscription status

**Source:** directly from you and from Stripe.

### 3.6 Support and communications
- Messages you send us (support@`[DOMAIN TBD]`, in-app feedback)
- Metadata about any communication with us

**Source:** directly from you.

### 3.7 What we do **not** collect
- Special-category data under GDPR Article 9 (health, biometrics, political opinions, religious beliefs, sexual orientation, etc.) — Provedo has no legitimate basis to process these and does not solicit them
- Brokerage account passwords (held only by the user and, transiently, by Plaid/SnapTrade during OAuth)
- Data from users we know or suspect to be under 18 (Section 9)
- Precise geolocation (we use IP-derived coarse region only)

## 4. Legal bases for processing (GDPR Article 6) and purposes

We process each category under one or more of the following GDPR Article 6(1) bases. CCPA "purposes of collection" are listed in parallel for California residents.

| Category | Purpose | GDPR Article 6(1) basis | CCPA purpose |
|---|---|---|---|
| Account data | Create, authenticate, and secure your account | (b) performance of contract | Providing the service you requested |
| Brokerage/exchange connection data | Aggregate your portfolio and render dashboards, insights, chat, and coach outputs | (b) performance of contract | Providing the service you requested |
| AI interaction data | Generate responses; improve prompt caching and retrieval performance; short-term retention for abuse prevention | (b) performance of contract; (f) legitimate interest (security/abuse prevention) | Providing the service + security/fraud |
| Usage and device data — security & reliability | Detect fraud, abuse, and product defects | (f) legitimate interest; (c) legal obligation where applicable | Security/fraud |
| Usage and device data — analytics | Understand feature usage to improve the product | (a) consent (EU/UK, where cookies classified as non-essential) | Analytics |
| Billing data | Process payments; comply with tax and accounting law | (b) performance of contract; (c) legal obligation | Providing the service + legal compliance |
| Support and communications | Respond to your inquiries | (b) performance of contract; (f) legitimate interest | Customer service |
| Marketing emails (opt-in only) | Send product updates and educational content | (a) consent | Marketing (opt-in) |

> `[ATTORNEY REVIEW]` — Legal-basis allocation should be re-verified by privacy counsel against local transpositions. In particular: legitimate-interest assessment (LIA) documentation should be produced separately for any processing relying on Article 6(1)(f). A short LIA summary for Provedo's four legitimate-interest uses (security, abuse prevention, product-defect detection, non-cookie-based analytics) should live at `docs/legal/LIA_summary.md` before EU public launch.

## 5. AI processing — specific disclosures

Because Provedo is AI-assisted, we provide the following additional transparency under GDPR Article 13(2)(f) (right to be informed about automated processing):

### 5.1 What automated processing we perform
- **Chat:** your messages are sent to a large-language-model API (Anthropic and/or OpenAI — see `SUBPROCESSOR_REGISTRY.md`) along with authorized context from your portfolio and cited sources. The model generates a response. We do not use model providers that train on our API inputs (see Section 5.3).
- **Insights:** we run rule-based and model-assisted analysis on your position and transaction data to surface events (dividends, drawdowns, concentration, benchmark deviation). No third-party model is used for the rule tier; the summarization tier may use an LLM API.
- **Coach:** we analyze your historical trades and produce descriptive pattern observations (e.g. "you sold AAPL near local lows three times over the past year"). This is descriptive, not prescriptive — Provedo does not tell you to buy, sell, hold, or change any position.

### 5.2 Logic and consequences
Provedo's outputs are observations, calculations, and descriptions drawn from your actual data. The logic involved is a combination of deterministic aggregation (sums, percentages, time-series derivations) and LLM-assisted summarization. Provedo does **not** make decisions "which produce legal effects concerning you or similarly significantly affect you" within the meaning of GDPR Article 22. No automated decision is enforced against you by Provedo — you retain full control of your accounts at your broker or exchange. Accordingly, we take the position that Article 22 (automated decision-making) does not apply to the Service; nonetheless, we honor the right-to-explanation principle and this Section 5 is that explanation.

> `[ATTORNEY REVIEW]` — Confirm Article 22 non-applicability position. The Coach surface's "pattern-reads" are descriptive in output and produce no legal or significant effect, but EU regulators have taken expansive views of Article 22 in related sectors (credit-scoring, employment). A short Article 22 non-applicability memo documenting the reasoning should be produced by counsel and retained internally as part of records of processing under Article 30.

### 5.3 AI subprocessor configuration
- Anthropic (Claude): configured for zero-data-retention (ZDR) / enterprise terms. Inputs and outputs are not used for model training.
- OpenAI: configured for zero-retention or 30-day-abuse-only retention tier. Inputs and outputs are not used for model training.

Both configurations are verified and documented in `SUBPROCESSOR_REGISTRY.md`. If either provider's retention posture materially changes, we will update this Policy and notify affected users.

> `[ATTORNEY REVIEW]` — Retain evidence (vendor admin console screenshot + DPA extract) for the ZDR / no-training configuration of each AI vendor. This evidence is the factual foundation of the disclosure in 5.3 and must be re-verified quarterly.

## 6. Subprocessors, international transfers, and storage

We use third-party service providers ("subprocessors") to deliver the Service. A current subprocessor list, including purpose, data shared, location, and DPA status, is maintained at **`[SUBPROCESSOR REGISTRY PUBLIC URL — TBD]`** (internally tracked in `docs/legal/SUBPROCESSOR_REGISTRY.md`).

### 6.1 Current subprocessors (summary)

| Subprocessor | Purpose | Data shared | HQ / data location |
|---|---|---|---|
| Clerk | Authentication, session management | Email, name, authentication tokens | US (EU region available) |
| Plaid | Brokerage aggregation (US-focused) | OAuth tokens, account data, transactions | US |
| SnapTrade | Brokerage aggregation (multi-region) | OAuth tokens, account data, transactions | Canada / US |
| Anthropic | AI inference (Claude API, ZDR tier) | Chat content, portfolio context | US |
| OpenAI | AI inference (zero-retention tier) | Chat content, portfolio context | US |
| Fly.io | Hosting, application infrastructure | All processed data (at rest and in transit) | EU (fra/ams), US, APAC regions |
| Doppler | Secrets management | Configuration only (no user data) | US |
| Stripe (future, paid tiers) | Payments | Billing info, payment method tokens | US (EU regions available) |

We do not sell personal data. We do not share personal data with subprocessors for purposes other than providing the Service.

### 6.2 International transfers

Some subprocessors are located outside the EU/EEA and the UK. For transfers of EU/EEA personal data, we rely on:
- The **EU-US Data Privacy Framework (DPF)** where the recipient is self-certified (e.g. Clerk, Stripe — verify current status in `SUBPROCESSOR_REGISTRY.md`)
- **Standard Contractual Clauses (SCCs)** — Module 2 (controller-to-processor), version adopted under EU Commission Implementing Decision 2021/914 — for other transfers
- A **Transfer Impact Assessment (TIA)** per subprocessor, as required by the CJEU's *Schrems II* decision (C-311/18), documenting supplementary measures where the destination country's laws may not offer essentially equivalent protection

For UK transfers, we rely on the UK International Data Transfer Agreement (IDTA) or the UK Addendum to the EU SCCs, as applicable.

> `[ATTORNEY REVIEW]` — SCC version and module selection must be verified by counsel. A TIA template and completed TIAs per subprocessor are pre-EU-launch requirements (tracked in Legal-advisor review 2026-04-23, items 9 + 10). Schrems II analysis for US recipients (Clerk, Plaid, Anthropic, OpenAI, Fly.io US regions, Doppler, Stripe) requires the same supplementary measure set; for Canada (SnapTrade) the European Commission adequacy decision 2002/2/EC may apply — counsel to confirm current status.

### 6.3 Data location
Production data for EU/EEA users is stored in EU regions (Fly.io fra/ams) where available. Data for US users is stored in US regions. Backups are encrypted at rest and retained per Section 8. Provedo does not process data on servers located in Russia; the Service is not offered to users in Russia (see Section 12).

## 7. Your rights

Depending on where you live, you have some or all of the following rights.

### 7.1 Rights under GDPR (EU/EEA) and UK GDPR

Under Articles 15–22 GDPR, you have the right to:

- **Access** (Art. 15) — obtain a copy of the personal data we hold about you and information about how we process it.
- **Rectification** (Art. 16) — correct inaccurate or incomplete data.
- **Erasure** (Art. 17) — request deletion of your data ("right to be forgotten"), subject to limited exceptions (legal retention, freedom of expression, public interest).
- **Restriction of processing** (Art. 18) — request that we temporarily suspend processing in certain circumstances.
- **Data portability** (Art. 20) — receive your data in a structured, commonly-used, machine-readable format and transmit it to another controller where technically feasible.
- **Object** (Art. 21) — object to processing based on legitimate interest or for direct marketing.
- **Not to be subject to automated decision-making** (Art. 22) — see Section 5 above; we take the position Article 22 does not apply, but you may still request human review of any output that materially concerns you.
- **Withdraw consent** (Art. 7) — at any time, for any processing based on consent, without affecting prior lawful processing.
- **Lodge a complaint** with your supervisory authority. A non-exhaustive list: Ireland (DPC), Germany (BfDI + state DPAs), France (CNIL), Spain (AEPD), UK (ICO). You may also contact us first so we can try to resolve the matter directly.

### 7.2 Rights under CCPA / CPRA (California)

If you are a California resident, you have the right to:
- **Know** what personal information we collect and for what purposes (this Policy plus our Notice at Collection)
- **Delete** personal information we have collected from you, subject to legal exceptions
- **Correct** inaccurate personal information
- **Opt out of sale or sharing** of personal information (we do not sell or share for cross-context behavioral advertising — there is nothing to opt out of in our current configuration, but you may still submit a request)
- **Limit use of sensitive personal information** — the only SPI we process is precise financial account information necessary to deliver the Service
- **Non-discrimination** for exercising your rights

California residents may also designate an authorized agent to submit requests on their behalf.

> `[ATTORNEY REVIEW]` — CCPA "Notice at Collection" must be presented at or before the point of collection (typically on the sign-up page). Draft separate `docs/legal/CCPA_NOTICE_AT_COLLECTION_draft.md` if California public launch is planned within 12 months. CPRA-specific sensitive-PI framing of brokerage account data should be reviewed by US counsel.

### 7.3 How to exercise your rights

Email **`[PRIVACY CONTACT EMAIL TBD]`** from the email address associated with your account. We will respond within **one month** under GDPR (extendable to three months for complex requests, with notice) or **45 days** under CCPA (extendable to 90 days). We may ask you to verify your identity before we act on the request.

There is no fee for exercising these rights unless the request is manifestly unfounded or excessive.

## 8. Retention

We retain personal data for only as long as necessary to provide the Service, comply with legal obligations, resolve disputes, and enforce agreements. Specifically:

| Data category | Default retention | Post-deletion grace |
|---|---|---|
| Account data (email, profile) | Duration of account | 30 days after account deletion, then erased |
| Brokerage/exchange connection data (tokens, positions, transactions) | Duration of account | 30 days after account deletion or broker disconnect, then erased |
| AI interaction data (chat messages, responses) | 90 days rolling | Erased on account deletion; user can request earlier deletion |
| Usage analytics (event logs) | 24 months, aggregated / pseudonymized after 90 days | Aggregated analytics may persist as non-personal data |
| Billing data (invoices, tax records) | 7 years (US federal tax retention); varies by jurisdiction (e.g. 10 years in Germany — §147 AO) | Retained per statutory retention requirement regardless of account deletion |
| Support communications | 2 years | Erased on account deletion unless subject to legal retention |
| Security logs (auth events, anomaly detection) | 12 months | Retained for security/legal defense even after account deletion |

> `[ATTORNEY REVIEW]` — Retention periods above are proposals balancing utility with GDPR Article 5(1)(e) storage-limitation principle. Each period needs validation against:
> - GDPR Article 5(1)(e) + Recital 39 — storage limitation
> - Local tax/accounting retention law for billing data (varies by jurisdiction; 7 years US, 10 years DE, 6 years UK, etc.)
> - Anti-money-laundering retention where applicable (likely N/A for Provedo — we are not a regulated financial institution, but confirm under FinCEN/AMLD VI scope)
> - User expectations (the brand promise is "remembers what you hold"; 30-day-post-deletion grace may be perceived as too short or too long depending on user segment)
> - Evidence preservation for disputes (12-month security log minimum)

## 9. Children

Provedo is not directed to individuals under 18 years of age. We do not knowingly collect personal data from anyone under 18. If you believe a child has provided personal data to us, contact us at **`[PRIVACY CONTACT EMAIL TBD]`** and we will delete it.

For users in the UK: we comply with the UK Age Appropriate Design Code (Children's Code) by not targeting users under 18, not designing for minors, and applying age-gate checks at sign-up.

## 10. Security

We protect personal data using technical and organizational measures appropriate to the risk (GDPR Article 32):

- TLS 1.2+ in transit for all connections
- Encryption at rest (AES-256) for all stored user data
- OAuth / API tokens stored in Doppler (secrets management) with access restricted to production services
- Role-based access control for internal personnel; least-privilege principle
- Multi-factor authentication required for internal admin access
- Security logging and anomaly detection
- Periodic dependency and vulnerability scans; incident response playbook maintained
- Formal vendor risk assessment for all subprocessors

In the event of a personal data breach affecting EU/EEA or UK users, we will notify the competent supervisory authority within 72 hours of becoming aware (GDPR Article 33), and affected users without undue delay where the breach is likely to result in a high risk to their rights and freedoms (Article 34). For California users, we will comply with breach-notification obligations under Cal. Civ. Code §1798.82.

> `[ATTORNEY REVIEW]` — Security measures above are baseline-appropriate for current scale but should be validated by security-compliance counsel + the `security-compliance:security-auditor` skill as the product grows. SOC 2 readiness path should be scoped separately by tech-lead before any B2B / institutional user onboarding.

## 11. Cookies and similar technologies

We use cookies as described in our [Cookie Policy](./COOKIE_POLICY_draft.md). Essential cookies (authentication, session) are strictly necessary and do not require consent under GDPR Article 7 / ePrivacy Directive. Non-essential cookies (analytics, preferences) are used only with your explicit consent obtained through our cookie banner on first visit, and you may withdraw consent at any time through the cookie settings link in the footer of the site.

## 12. Jurisdictions where Provedo is not offered

Provedo is currently not offered to users resident in the Russian Federation. Accounts created using Russian residence information may be declined or suspended. This is a product-scope decision and may be revisited in the future; when it is, we will update this Policy to describe the data-localization and regulatory measures required for that market (Russian Federal Law No. 152-FZ).

## 13. Changes to this Policy

We will update this Policy when our practices change. Material changes (new categories of data, new purposes, new subprocessors that materially change the risk profile, changes to retention) will be communicated to users by email and/or in-product notice **at least 30 days** before they take effect. The version date at the top of the Policy indicates the current version; historical versions are kept in this repository under `docs/legal/PRIVACY_POLICY_draft.md` git history.

## 14. Contact

**Privacy inquiries and data-subject requests:** `[PRIVACY CONTACT EMAIL TBD]`
**General support:** `[SUPPORT EMAIL TBD]`
**Postal address:** `[COMPANY ADDRESS TBD]`
**EU representative (Art. 27):** `[TBD]`
**UK representative (Art. 27):** `[TBD]`

---

# RU — Политика конфиденциальности (ЧЕРНОВИК)

**Статус.** Черновик — первичный внутренний draft от legal-advisor. НЕ финальный документ. Требует ревью лицензированного специалиста по защите персональных данных в каждом рынке до публичного запуска.
**Версия.** 0.1 (2026-04-23)
**Сфера действия.** Русскоязычная версия поддерживается параллельно для будущего расширения на русскоязычную диаспору (Казахстан, Армения, другие страны СНГ кроме РФ). Россия сейчас вне запуска (см. `DECISIONS.md` 2026-04-23 Q7). При расхождении версий — английский текст имеет приоритет.

## 1. Кто мы

Provedo («Сервис») оперируется компанией **`[ЮРЛИЦО — TBD]`** («Компания», «мы»), с юридическим адресом **`[АДРЕС — TBD]`**. Основной домен: `provedo.ai`. В целях GDPR (ЕС), UK GDPR, а также CCPA/CPRA (Калифорния) Компания выступает **контроллером данных** в отношении персональных данных, обрабатываемых в связи с Сервисом.

Контакт по вопросам защиты данных: **`[EMAIL — TBD]`**. Это же адрес для реализации прав пользователя согласно разделу 7.

## 2. Что такое Provedo

Provedo — AI-сервис для анализа инвестиционного портфеля. Пользователи подключают брокерские и криптобиржевые счета в режиме «только чтение»; Provedo агрегирует позиции, подсвечивает наблюдения («Insights»), отвечает на вопросы о реальных холдингах пользователя («Chat») и описывает паттерны в истории сделок («Coach»). Provedo **не является** зарегистрированным инвестиционным советником и не предоставляет инвестиционных советов. Сервис носит образовательный и информационный характер.

## 3. Категории собираемых данных

### 3.1 Данные учётной записи
- Email (требуется для аутентификации)
- Отображаемое имя (по желанию)
- Настройки профиля (валюта отображения, язык, часовой пояс)
- Пароль (где применимо — хранится только в виде криптографического хэша)
- Токены сессии и мульти-факторные реквизиты (управляются субпроцессором Clerk)

### 3.2 Данные подключений к брокерам и биржам
- OAuth-токены доступа и обновления, выданные брокером/биржей через Plaid или SnapTrade
- Идентификаторы учреждения (название брокера, тип счёта)
- Балансы счетов, позиции (тикер, количество, себестоимость, рыночная стоимость), история транзакций (покупки, продажи, дивиденды, проценты, переводы, корпоративные действия)

**Важно.** Provedo **не** хранит логин и пароль от брокера. OAuth-токены хранят Plaid / SnapTrade от нашего имени.

### 3.3 Данные взаимодействия с AI
- Ваши сообщения в чат
- Ответы AI (включая трассировки вызовов инструментов и цитируемые источники)
- Сигналы обратной связи («палец вверх/вниз», отчёты о некорректном ответе)
- Промпты и эмбеддинги ответов, используемые для кэширования и поиска

### 3.4 Данные использования и устройства
- Метки времени, просматриваемые страницы, используемые функции
- Тип устройства, ОС, браузер
- IP-адрес (усечённый/хэшированный для аналитики где возможно)
- Логи сбоев и отчёты об ошибках
- Cookies и аналогичные технологии (см. Cookie Policy)

### 3.5 Биллинговые данные (для платных тарифов)
- Платёжный метод (обработкой занимается Stripe — мы не видим и не храним номера карт)
- Платёжный адрес и налоговый идентификатор где требуется юрисдикцией
- История счетов и статус подписки

### 3.6 Поддержка и коммуникации
- Сообщения в нашу поддержку и метаданные переписки

### 3.7 Что мы **не** собираем
- Специальные категории данных по Ст. 9 GDPR (здоровье, биометрия, политические взгляды, религиозные убеждения, сексуальная ориентация и т.д.)
- Пароли брокерских счетов
- Данные от пользователей, о которых нам известно или мы подозреваем, что им меньше 18 лет
- Точную геолокацию (используем только грубый регион по IP)

## 4. Правовые основания обработки (Ст. 6 GDPR) и цели

Мы обрабатываем каждую категорию на одном или нескольких из следующих оснований по Ст. 6(1) GDPR.

| Категория | Цель | Основание Ст. 6(1) GDPR |
|---|---|---|
| Данные учётной записи | Создать, аутентифицировать и защитить ваш аккаунт | (b) исполнение договора |
| Данные брокерских подключений | Агрегировать портфель, рендерить дашборды, инсайты, чат, коуч | (b) исполнение договора |
| Данные взаимодействия с AI | Генерировать ответы; кэширование и поиск; краткосрочное хранение для предотвращения злоупотреблений | (b) договор; (f) законный интерес (безопасность) |
| Использование и устройство — безопасность | Обнаружение мошенничества, злоупотреблений, дефектов продукта | (f) законный интерес; (c) правовая обязанность где применимо |
| Использование и устройство — аналитика | Понимание использования функций для улучшения продукта | (a) согласие (EU/UK при неэссенциальных cookies) |
| Биллинг | Обработка платежей; налоговые и бухгалтерские обязательства | (b) договор; (c) правовая обязанность |
| Поддержка | Отвечать на ваши запросы | (b) договор; (f) законный интерес |
| Маркетинг (только opt-in) | Отправка продуктовых обновлений и образовательного контента | (a) согласие |

## 5. Обработка AI — специальные раскрытия

Поскольку Provedo является AI-сервисом, предоставляем дополнительную прозрачность согласно Ст. 13(2)(f) GDPR:

### 5.1 Автоматизированная обработка
- **Chat.** Ваши сообщения отправляются в API большой языковой модели (Anthropic и/или OpenAI — см. `SUBPROCESSOR_REGISTRY.md`) с авторизованным контекстом из вашего портфеля. Модель генерирует ответ. Мы не используем поставщиков моделей, которые тренируются на наших API-входах.
- **Insights.** Выполняем правила + модельный анализ на данных позиций и транзакций для выявления событий. Третья модель используется только для слоя суммаризации.
- **Coach.** Анализируем историю сделок и создаём описательные наблюдения-паттерны. Это дескриптивно, не прескриптивно — Provedo не говорит купить, продать, удержать или изменить позицию.

### 5.2 Логика и последствия
Выходные данные Provedo — наблюдения, вычисления и описания на основе ваших реальных данных. Логика — комбинация детерминистической агрегации и LLM-суммаризации. Provedo **не** принимает решений, «производящих правовые последствия в отношении вас или существенно влияющих на вас» в смысле Ст. 22 GDPR. Никакое автоматизированное решение не навязывается — вы сохраняете полный контроль над счетами у брокера/биржи.

### 5.3 Конфигурация AI-субпроцессоров
- Anthropic (Claude): zero-data-retention (ZDR) / enterprise-условия. Входы и выходы не используются для обучения модели.
- OpenAI: zero-retention или 30-day-abuse-only. Входы и выходы не используются для обучения.

Обе конфигурации подтверждены и задокументированы в `SUBPROCESSOR_REGISTRY.md`.

## 6. Субпроцессоры, международные передачи и хранение

Мы используем сторонних поставщиков услуг («субпроцессоры») для предоставления Сервиса. Актуальный список субпроцессоров с целью, передаваемыми данными, локацией и статусом DPA поддерживается в `SUBPROCESSOR_REGISTRY.md`.

| Субпроцессор | Цель | Передаваемые данные | HQ / локация |
|---|---|---|---|
| Clerk | Аутентификация | Email, имя, токены аутентификации | US (доступен EU-регион) |
| Plaid | Агрегация брокеров (US) | OAuth-токены, данные счетов, транзакции | US |
| SnapTrade | Агрегация брокеров (мульти-регион) | OAuth-токены, данные счетов, транзакции | Канада / US |
| Anthropic | AI-инференс (Claude API, ZDR) | Контент чата, контекст портфеля | US |
| OpenAI | AI-инференс (zero-retention) | Контент чата, контекст портфеля | US |
| Fly.io | Хостинг | Все обработанные данные | ЕС (fra/ams), US, APAC |
| Doppler | Управление секретами | Только конфигурация (без пользовательских данных) | US |
| Stripe (в будущем) | Платежи | Биллинговые данные, токены платежа | US (доступны EU-регионы) |

Мы **не** продаём персональные данные. Мы **не** передаём их субпроцессорам для целей, не связанных с предоставлением Сервиса.

### 6.2 Международные передачи

Для передач персональных данных из ЕС/ЕЭП мы опираемся на:
- EU-US Data Privacy Framework (DPF) где получатель сертифицирован
- Стандартные договорные положения (SCCs) Модуль 2, версия 2021/914
- Transfer Impact Assessment (TIA) на каждого субпроцессора (Schrems II, CJEU C-311/18)

Для передач из UK — UK IDTA или UK-Addendum к EU SCCs.

### 6.3 Локация данных
Данные EU-пользователей хранятся в EU-регионах (Fly.io fra/ams). Provedo **не** обрабатывает данные на серверах, расположенных в России; Сервис не предлагается пользователям в РФ (см. раздел 12).

## 7. Ваши права

### 7.1 Права по GDPR (EU/EEA) и UK GDPR

По Ст. 15–22 GDPR вы имеете право:
- **Доступ** (Ст. 15)
- **Исправление** (Ст. 16)
- **Удаление** (Ст. 17, «право быть забытым»)
- **Ограничение обработки** (Ст. 18)
- **Переносимость данных** (Ст. 20)
- **Возражение** (Ст. 21)
- **Не быть субъектом автоматизированного решения** (Ст. 22)
- **Отозвать согласие** (Ст. 7) в любой момент
- **Подать жалобу** в надзорный орган (Ирландия DPC / Германия BfDI / Франция CNIL / UK ICO и т.д.)

### 7.2 Права по CCPA / CPRA (Калифорния)
- **Знать**, какую информацию собираем и для чего
- **Удалить** информацию, собранную от вас
- **Исправить** неточную информацию
- **Отказаться от продажи/sharing** (мы не продаём и не шарим для межконтекстной рекламы)
- **Ограничить использование чувствительной PI**
- **Недискриминация** за реализацию прав

### 7.3 Как реализовать права
Письмо на **`[EMAIL — TBD]`** с адреса email, привязанного к учётной записи. Ответим в течение **1 месяца** (GDPR, с возможностью продления до 3 месяцев) или **45 дней** (CCPA, с возможностью до 90 дней). Можем попросить подтвердить личность. Плата не взимается, если запрос не является явно необоснованным или чрезмерным.

## 8. Сроки хранения

| Категория | Хранение по умолчанию | Период после удаления |
|---|---|---|
| Данные учётной записи | На время действия аккаунта | 30 дней после удаления, затем стираются |
| Брокерские подключения | На время действия аккаунта | 30 дней после удаления или отключения брокера |
| AI-взаимодействия | 90 дней скользящим окном | Стираются при удалении аккаунта |
| Аналитика использования | 24 месяца, агрегируется/псевдонимизируется после 90 дней | Агрегированная может сохраняться как не-персональная |
| Биллинг | 7 лет (налоговые требования США); варьируется по юрисдикциям | Сохраняется по статутному требованию |
| Поддержка | 2 года | Стирается при удалении аккаунта если нет правового удержания |
| Логи безопасности | 12 месяцев | Сохраняются для безопасности/правовой защиты |

## 9. Несовершеннолетние

Provedo не предназначен для лиц младше 18 лет. Мы не собираем сознательно персональные данные лиц младше 18. Если вы считаете что ребёнок предоставил нам данные — напишите на **`[EMAIL — TBD]`** и мы их удалим.

## 10. Безопасность

Мы защищаем персональные данные техническими и организационными мерами, соответствующими риску (Ст. 32 GDPR):
- TLS 1.2+ в транзите
- Шифрование в покое (AES-256)
- OAuth/API-токены хранятся в Doppler
- Контроль доступа по ролям, принцип наименьших привилегий
- MFA для внутреннего административного доступа
- Логирование безопасности и обнаружение аномалий
- Периодические сканы зависимостей и уязвимостей
- Процедуры реагирования на инциденты
- Оценка рисков по каждому субпроцессору

В случае нарушения защиты данных EU/EEA или UK пользователей — уведомим надзорный орган в течение 72 часов (Ст. 33 GDPR) и затронутых пользователей без необоснованной задержки если риск высокий (Ст. 34).

## 11. Cookies и аналогичные технологии

Мы используем cookies как описано в [Cookie Policy](./COOKIE_POLICY_draft.md). Эссенциальные cookies (аутентификация, сессия) согласия не требуют. Неэссенциальные (аналитика, предпочтения) — только с вашего явного согласия через cookie-баннер при первом визите; согласие можно отозвать в любой момент через ссылку в футере.

## 12. Юрисдикции, в которых Provedo не предлагается

Provedo в настоящее время не предлагается пользователям-резидентам Российской Федерации. Учётные записи, созданные с использованием российских резидентских данных, могут быть отклонены или приостановлены. Это продуктовое решение и может быть пересмотрено в будущем; при пересмотре — обновим Политику.

## 13. Изменения Политики

Мы обновляем Политику при изменении наших практик. Существенные изменения (новые категории данных, новые цели, новые субпроцессоры с существенным изменением профиля риска, изменения сроков хранения) — сообщаем по email и/или в продукте **минимум за 30 дней** до вступления в силу. Версия вверху Политики отражает текущую; исторические версии сохраняются в git.

## 14. Контакты

**Вопросы по приватности и запросы субъектов данных:** `[EMAIL — TBD]`
**Общая поддержка:** `[EMAIL — TBD]`
**Почтовый адрес:** `[АДРЕС — TBD]`
**Представитель в ЕС (Ст. 27):** `[TBD]`
**Представитель в UK (Ст. 27):** `[TBD]`

---

## Cross-reference matrix — ATTORNEY REVIEW items summary

| # | Item | Section | Owner action |
|---|---|---|---|
| 1 | Entity form and registered office | 1 | PO chooses form; counsel registers |
| 2 | EU/UK representatives under Art. 27 | 1, 14 | Required before EU/UK launch |
| 3 | DPO designation decision | 1 | Privacy counsel confirms not required under Art. 37 |
| 4 | Legitimate-interest assessments (LIA) | 4 | Draft `docs/legal/LIA_summary.md` |
| 5 | Article 22 non-applicability memo | 5.2 | Counsel memo retained in records of processing |
| 6 | AI vendor ZDR evidence retention | 5.3 | Quarterly re-verify |
| 7 | SCC version + TIA per subprocessor | 6.2 | Pre-EU-launch block; templated per Legal-advisor review |
| 8 | Retention periods | 8 | Validate vs local tax/AML law per jurisdiction |
| 9 | CCPA Notice at Collection | 7.2 | Separate draft if CA launch within 12 months |
| 10 | Security measures scope (SOC 2 path) | 10 | security-compliance audit before B2B |

---

## References

- Regulation (EU) 2016/679 (GDPR): https://eur-lex.europa.eu/eli/reg/2016/679/oj
- Data Protection Act 2018 (UK): https://www.legislation.gov.uk/ukpga/2018/12/contents
- California Consumer Privacy Act + CPRA: https://oag.ca.gov/privacy/ccpa
- EU Commission Implementing Decision 2021/914 (new SCCs): https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj
- CJEU C-311/18 (Schrems II): https://curia.europa.eu/juris/document/document.jsf?docid=228677
- UK ICO Age Appropriate Design Code: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/
- Cal. Civ. Code §1798.82 (breach notification): https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=1798.82.&lawCode=CIV

All URLs accessed 2026-04-23.
