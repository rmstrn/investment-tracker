# Provedo — Terms of Service (DRAFT)

**Status:** DRAFT — first-pass internal legal-advisor output. NOT a finalized contract. Requires licensed counsel review per jurisdiction before public launch.
**Version:** 0.1 (2026-04-23)
**Owner:** legal-advisor (internal SME) · final sign-off: licensed counsel per launch market.
**Key `[ATTORNEY REVIEW]` items:** entity name, governing law selection (DE vs US-Delaware split), arbitration clause enforceability per jurisdiction, refund-window timing rules per member-state, EU 14-day withdrawal right carve-outs, liability-cap ceiling, Consumer Duty (UK) obligations confirmation.

---

## Reader orientation

Bilingual (English first, Russian mirror) for every clause. English governs. RU is for parallel CIS-non-RU expansion reference. Lane A disclosure appears in **BOLD** at the top of the document per positioning lock (`02_POSITIONING.md` v3.1).

---

# EN — Terms of Service

---

## **IMPORTANT — PLEASE READ FIRST**

**Provedo is not a registered investment advisor. Provedo is not a broker, a dealer, or a financial institution. The Service provides portfolio information, aggregation, and educational commentary only. It does not provide investment advice, recommendations, or solicitations to buy, sell, hold, or transact in any security or other financial instrument. All investment decisions are yours alone. Past performance is not indicative of future results.**

**By using Provedo you acknowledge and agree to this framing.**

---

## 1. Parties and acceptance

These Terms of Service ("Terms") are a binding agreement between you ("you", "User") and **`[ENTITY TBD]`** ("Provedo", "we", "us"), the operator of the Provedo service at `provedo.ai` and any related properties (collectively, the "Service").

By creating an account, connecting a broker or exchange account, or otherwise using the Service, you accept these Terms. If you do not agree, do not use the Service.

If you use the Service on behalf of an entity, you represent that you have authority to bind that entity to these Terms, and "you" refers to that entity.

> `[ATTORNEY REVIEW]` — Entity identification and choice of form must be finalized. Acceptance-of-terms mechanism (clickwrap vs. browsewrap) must match implementation — this draft assumes clickwrap with explicit checkbox at sign-up.

## 2. What Provedo is — and is not

### 2.1 What Provedo is
The Service is an AI-assisted portfolio intelligence tool. It:
- Aggregates read-only account data from brokers and crypto exchanges you connect
- Presents your holdings, balances, and transaction history in a unified dashboard
- Generates observations, summaries, and descriptive pattern observations using large-language-model technology
- Answers questions you ask about your own holdings, with citations to data sources where applicable
- Surfaces events and changes in your portfolio (dividends, drawdowns, concentration shifts)

### 2.2 What Provedo is not
The Service is **not**:
- An investment advisor, portfolio manager, or financial planner (within the meaning of the US Investment Advisers Act of 1940, EU MiFID II, UK FSMA 2000, or similar laws)
- A broker, a broker-dealer, or a trading venue (we cannot place trades or transfer assets)
- A fiduciary (we owe you no fiduciary duty)
- A tax advisor, accountant, or lawyer
- A source of personalized investment advice or recommendations
- A predictor of future prices, returns, or market movements
- A guarantor of the accuracy of third-party data (prices, corporate actions, news) we display

### 2.3 Nature of AI output
AI-generated content in the Service is informational and educational. It may contain errors, omit context, or misinterpret your data. Verify anything that matters with your own research, your broker, or a licensed professional. Do not rely on Provedo as the sole basis for any investment, tax, or legal decision.

> `[ATTORNEY REVIEW]` — Section 2 is the single most important clause for Lane A defense. Do not materially alter without licensed counsel sign-off. Language is aligned with Legal-advisor review 2026-04-23 per-jurisdiction analysis (US Advisers Act publisher's exclusion + EU MiFID II Article 4(1)(4) non-applicability + UK FSMA Article 53 non-applicability).

## 3. Eligibility

You must be at least **18 years old** and have the legal capacity to enter into a contract in your jurisdiction to use the Service. The Service is not offered in the Russian Federation (see Section 14). You are responsible for complying with all local laws applicable to your use of the Service, including securities, tax, and data-protection laws.

## 4. Account creation and security

### 4.1 Account
You create an account through our authentication partner (Clerk). You must provide accurate information and keep it current. One account per person.

### 4.2 Credentials
You are responsible for safeguarding your credentials (email/password, OAuth sessions, MFA factors). Notify us immediately at **`[SECURITY CONTACT EMAIL TBD]`** if you suspect unauthorized access. We are not liable for loss or damage from your failure to protect your credentials.

### 4.3 Broker / exchange connections
When you connect a broker or exchange account, you authorize Plaid, SnapTrade, or another named partner to obtain read-only data on your behalf. You represent that you are the account owner or have the owner's authority to connect it. We do not obtain trading authority or any ability to move assets, and we will never ask for your broker password.

### 4.4 Account termination by you
You may terminate your account at any time through the account-settings page or by emailing **`[SUPPORT EMAIL TBD]`**. Upon termination, we will proceed with deletion per the Privacy Policy (30-day grace period for most categories; statutory retention applies where required).

### 4.5 Account termination or suspension by us
We may suspend or terminate your account if you materially breach these Terms, abuse the Service, engage in fraudulent or unlawful activity, or for other legitimate operational reasons with reasonable notice. If we terminate for a material breach you have caused, we are not obligated to refund fees beyond any applicable consumer-protection minimum.

## 5. Acceptable use

You agree not to:
- Use the Service in a way that violates any applicable law, regulation, or third-party right
- Reverse-engineer, decompile, or disassemble the Service except where expressly permitted by law
- Scrape, crawl, or extract data from the Service in bulk through automated means, or otherwise exceed reasonable rate-limits
- Abuse the AI chat surface with prompt-injection attempts, attempts to extract other users' data, or attempts to cause the model to produce prescriptive investment advice outside the Service's design
- Share your account credentials or allow another person to access the Service under your account
- Use the Service to impersonate another person or misrepresent your identity
- Upload malware or otherwise attack the Service's infrastructure
- Use the Service to build a competing product (applies only to content we generate for you; you may of course use your own portfolio data for any lawful purpose)

We may rate-limit, throttle, or block activity that we believe in good faith violates this Section.

## 6. Subscription tiers and payment (where applicable)

### 6.1 Tiers
The Service offers a **Free** tier and paid tiers (**Plus** and **Pro** as described at `provedo.ai/pricing` at any given time). Tier feature sets may change with reasonable notice; material reductions to paid-tier functionality will be communicated at least 30 days in advance and, where applicable, entitle you to a prorated refund.

### 6.2 Billing
Paid tiers are billed monthly or annually in advance through our payment processor (Stripe). Prices are stated in the currency displayed at checkout and include VAT or GST where required by your jurisdiction. Taxes that are not included will be noted at checkout.

### 6.3 Automatic renewal
Paid subscriptions renew automatically at the end of each billing period unless you cancel. You may cancel at any time through the billing-settings page; cancellation takes effect at the end of the current paid period.

### 6.4 Refunds — EU / EEA / UK consumers
If you are a consumer in the EU, EEA, or UK, you have a statutory right to withdraw from a distance contract within **14 days** of entering into it, without giving a reason, subject to the exceptions in EU Directive 2011/83/EU Article 16 and equivalent UK regulations.

**Consent to immediate performance.** Because the Service is a digital service provided immediately upon subscription, at checkout we will ask you to expressly consent to immediate performance and acknowledge that your right of withdrawal is lost once performance has begun. If you do **not** consent, the 14-day withdrawal window applies in full. If you **do** consent, you retain the right to cancel future renewals but may be charged a proportional amount for the service rendered up to the point of your withdrawal request.

### 6.5 Refunds — other jurisdictions
Outside the EU/EEA/UK, and subject to your local consumer-protection law, paid subscriptions are generally non-refundable except at our discretion. We may offer refunds on a case-by-case basis for service outages or material product defects.

> `[ATTORNEY REVIEW]` — Refund windows and withdrawal-right carve-outs vary by EU member state and UK legislative structure (Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 in UK). A per-market annex may be needed for DE/FR/ES launch. For California users, Cal. Bus. & Prof. Code §17602 auto-renewal disclosure rules apply and must be reflected in the billing UX.

### 6.6 Price changes
We may change pricing for paid tiers. Changes to your existing subscription take effect at the next renewal and are communicated at least 30 days in advance. If you do not accept the new price, you may cancel before it takes effect.

## 7. Intellectual property

### 7.1 Our IP
The Service, including software, UI, branding (Provedo), and content we create, is owned by us or our licensors and protected by copyright, trademark, and other laws. We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your personal, non-commercial purposes subject to these Terms.

### 7.2 Your data
You retain all rights in personal data you submit to or generate on the Service (your holdings, transactions, chat messages). By using the Service, you grant us a non-exclusive, royalty-free license to process your data **solely to provide, maintain, secure, and improve the Service** — within the limits of the Privacy Policy. We do not claim ownership of your data. We do not use your prompts, chat content, or portfolio data to train third-party foundation models (see Privacy Policy §5).

### 7.3 AI-generated content
Responses generated by the Service are intended for your use within the Service. Accuracy is not warranted. You are responsible for your use of any output. Where output incorporates cited third-party data (news, prices, corporate-action records), use of that third-party content is subject to the terms of the upstream source.

### 7.4 Feedback
If you send us suggestions or feedback, you grant us a non-exclusive, worldwide, royalty-free, perpetual license to use that feedback to improve the Service, without obligation to you.

## 8. Third-party services

The Service depends on third-party services (Plaid, SnapTrade, Clerk, Anthropic, OpenAI, Fly.io, Doppler, Stripe, market-data providers). Each has its own terms and privacy policy. We list current subprocessors in `docs/legal/SUBPROCESSOR_REGISTRY.md` and in our Privacy Policy. We are not responsible for the acts or omissions of third parties beyond our control, though we select them with care and bind them to appropriate data-protection terms.

## 9. Disclaimers and limitation of liability

### 9.1 Disclaimer of warranties (to the maximum extent permitted by law)
The Service is provided **"as is"** and **"as available"**, without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, non-infringement, and uninterrupted or error-free operation. We do not warrant that the Service will meet your requirements, that outputs will be accurate, that data from brokers or exchanges will be complete or timely, or that defects will be corrected.

### 9.2 Investment outcomes
**You acknowledge that all investment decisions are yours alone and that market outcomes are inherently uncertain. We are not responsible for any investment loss, tax consequence, or other financial outcome arising from your use of the Service.**

### 9.3 Cap on liability (to the maximum extent permitted by law)
**Our aggregate liability to you, under any theory (contract, tort, statute, or otherwise), is capped at the greater of (a) the fees you paid us in the 12 months preceding the event giving rise to the claim, or (b) EUR 100.** We are not liable for indirect, incidental, consequential, exemplary, special, or punitive damages, or for lost profits, lost revenue, lost data, or loss of goodwill, even if we were advised of the possibility.

### 9.4 Carve-outs
Nothing in these Terms excludes or limits liability that cannot be excluded or limited under applicable law, including:
- Liability for gross negligence or willful misconduct
- Liability for death or personal injury caused by our negligence
- Liability for fraud or fraudulent misrepresentation
- Statutory liability to consumers in the EU/EEA/UK under mandatory consumer-protection law
- In Germany, liability for breach of cardinal duties ("wesentliche Vertragspflichten") — capped at foreseeable damages typical for this type of contract (§§ 307, 309 BGB)

> `[ATTORNEY REVIEW]` — Liability cap ceiling and carve-outs must be validated per jurisdiction. EU member-state consumer-protection mandatory minimums override contractual caps. Germany §§ 307, 309 BGB analysis is material for DE launch (first priority per ICP weight). UK Unfair Contract Terms Act 1977 + Consumer Rights Act 2015 review required for UK launch.

## 10. Indemnification

You agree to indemnify and hold us harmless from any claims, damages, liabilities, and reasonable costs (including attorneys' fees) arising out of your breach of these Terms, your misuse of the Service, your violation of any law, or your violation of a third-party right. This Section does not apply where prohibited by mandatory consumer-protection law in your jurisdiction.

## 11. Governing law and dispute resolution

### 11.1 Governing law — EU / EEA / UK users
For users resident in the EU, EEA, or UK, these Terms and any non-contractual obligations arising out of or in connection with them are governed by **`[GERMAN LAW / DUTCH LAW / IRISH LAW — TBD per entity domicile]`** without regard to its conflict-of-laws rules. Mandatory consumer-protection rules of your country of habitual residence apply in addition, to the extent they provide greater protection.

### 11.2 Governing law — US users and rest of world
For users in the United States and any jurisdiction not covered by Section 11.1, these Terms are governed by **the laws of the State of Delaware** (or **`[ALTERNATIVE US STATE — TBD per entity domicile]`**), without regard to its conflict-of-laws rules.

### 11.3 Informal resolution first
If you have a dispute with us, contact **`[DISPUTE CONTACT EMAIL TBD]`** first. We will try in good faith to resolve it within 30 days of receipt.

### 11.4 Dispute resolution — US users
If informal resolution fails, disputes in the US are resolved by **binding arbitration** on an individual (not class) basis, administered by JAMS under its Streamlined Arbitration Rules, in **`[ARBITRATION VENUE — TBD]`**. You may opt out of this arbitration clause within 30 days of first accepting these Terms by emailing **`[OPT-OUT EMAIL TBD]`**. Small-claims court remains available for individual claims within its jurisdictional limits.

### 11.5 Dispute resolution — EU / EEA / UK users
If informal resolution fails, you may bring disputes to the courts of your country of habitual residence or the courts of **`[SEAT — TBD, matching 11.1]`**. The EU online dispute resolution platform is available at **https://ec.europa.eu/consumers/odr** for EU users.

### 11.6 Rest of world
Informal resolution first; if it fails, the courts of **`[SEAT — TBD]`** have exclusive jurisdiction, without prejudice to mandatory local law.

> `[ATTORNEY REVIEW]` — Governing-law and forum selection are the single most consequential commercial clauses. Must be selected in coordination with entity domicile decision. Arbitration clause enforceability varies significantly; California (McGill v. Citibank), New Jersey, and several EU member states have limitations on class-action waivers and mandatory arbitration for consumers. EU consumers cannot validly be forced into arbitration for mandatory-jurisdiction consumer-protection claims per Brussels I bis Regulation.

## 12. UK Consumer Duty (FCA)

For UK users, we acknowledge the FCA's Consumer Duty framework (Principle 12, PS22/9) applies to financial products and services offered to retail consumers in the UK. Although Provedo is not a regulated activity under FSMA 2000 Article 53 (see Section 2.2), we voluntarily align our UK user experience with Consumer Duty expectations on:
- Products and services (design for the identified target market — self-directed retail investors)
- Price and value (pricing transparency + free tier availability)
- Consumer understanding (plain-language communications, explicit Lane A disclosure, inline vocabulary unpacking)
- Consumer support (responsive support channel, account-deletion accessibility)

We reserve the right to update Provedo's UK offering to reflect changes in FCA guidance or regulatory perimeter.

> `[ATTORNEY REVIEW]` — UK Consumer Duty application to non-regulated activities is nuanced. FCA has signaled Consumer Duty obligations can attach to firms within the regulatory perimeter; Provedo's perimeter position must be confirmed with FCA-experienced counsel before UK launch. If Provedo is determined to be outside the perimeter entirely, Consumer Duty may not strictly apply, but this voluntary alignment is defensible positioning.

## 13. Changes to these Terms

We may update these Terms. Material changes (new restrictions, changes to fees, changes to dispute resolution, changes to scope) will be communicated by email and/or in-product notice **at least 30 days** before they take effect. The version date at the top indicates the current version. Continued use of the Service after the effective date constitutes acceptance. If you do not accept material changes, you may terminate your account before they take effect.

Non-material changes (typo fixes, subprocessor changes of equivalent risk, clarifications that do not reduce your rights) may take effect upon posting.

## 14. Geographic scope

The Service is not offered in the Russian Federation. Accounts created using Russian residence information may be declined or suspended. We may add or remove jurisdictions from the Service as operational, legal, or commercial considerations require; removals will be communicated at least 30 days in advance to affected users with a path to export their data.

## 15. Force majeure

We are not liable for delays or failures in performance due to causes beyond our reasonable control, including natural disasters, war, civil unrest, terrorism, cyber-attacks, pandemic, power outages, telecommunications failures, or the actions of third-party infrastructure providers.

## 16. Miscellaneous

- **Severability.** If any provision is held invalid, the remainder remains in effect.
- **No waiver.** Our failure to enforce a provision is not a waiver of our right to enforce it later.
- **Assignment.** You may not assign these Terms without our consent. We may assign these Terms to an affiliate or in connection with a merger, acquisition, or sale of assets, with notice to you.
- **Entire agreement.** These Terms, together with the Privacy Policy, Cookie Policy, and any additional notices presented at the point of collection, constitute the entire agreement between you and us regarding the Service.
- **Language.** If these Terms are translated into another language and there is a conflict, the English version governs, except where mandatory local law requires the local-language version to govern.

## 17. Contact

**General inquiries and support:** `[SUPPORT EMAIL TBD]`
**Legal notices:** `[LEGAL EMAIL TBD]`
**Postal address:** `[COMPANY ADDRESS TBD]`

---

# RU — Условия использования (ЧЕРНОВИК)

**Статус.** Черновик. Параллельная русскоязычная версия для CIS-non-RU расширения. При расхождении — английская версия имеет приоритет.

---

## **ВАЖНО — ПРОЧИТАЙТЕ ПЕРЕД ИСПОЛЬЗОВАНИЕМ**

**Provedo не является зарегистрированным инвестиционным советником. Provedo не является брокером, дилером или финансовым институтом. Сервис предоставляет информацию о портфеле, агрегацию и образовательные комментарии. Сервис не предоставляет инвестиционных советов, рекомендаций или побуждений купить, продать, удержать или совершить сделку с каким-либо финансовым инструментом. Все инвестиционные решения вы принимаете самостоятельно. Прошлая доходность не гарантирует будущую.**

**Используя Provedo, вы подтверждаете понимание этого.**

---

## 1. Стороны и принятие

Настоящие Условия использования («Условия») являются обязывающим соглашением между вами («вы», «Пользователь») и **`[ЮРЛИЦО — TBD]`** («Provedo», «мы»), оператором сервиса Provedo на `provedo.ai` и связанных ресурсах (совместно — «Сервис»).

Создавая учётную запись, подключая счёт брокера или биржи, или иным образом используя Сервис, вы принимаете настоящие Условия. Если вы не согласны — не используйте Сервис.

Если вы используете Сервис от имени организации — вы подтверждаете наличие полномочий обязать её настоящими Условиями.

## 2. Что такое Provedo — и чем Provedo не является

### 2.1 Что это
AI-сервис для анализа инвестиционного портфеля. Он:
- Агрегирует read-only данные счетов брокеров и криптобирж, которые вы подключаете
- Показывает ваши позиции, балансы и историю сделок в едином дашборде
- Генерирует наблюдения, сводки и описательные паттерны через LLM
- Отвечает на вопросы о ваших реальных холдингах с цитированием источников где применимо
- Подсвечивает события и изменения в портфеле (дивиденды, просадки, изменения концентрации)

### 2.2 Чем не является
Сервис **не является**:
- Инвестиционным советником, портфельным управляющим или финансовым планировщиком (в смысле US Investment Advisers Act 1940, EU MiFID II, UK FSMA 2000 и аналогичных законов)
- Брокером, брокер-дилером или торговой площадкой (мы не можем совершать сделки или переводить активы)
- Фидуциаром (у нас нет перед вами фидуциарных обязательств)
- Налоговым консультантом, бухгалтером или юристом
- Источником персонализированных инвестиционных советов или рекомендаций
- Прогнозистом будущих цен, доходностей или рыночных движений
- Гарантом точности сторонних данных (цены, корпоративные действия, новости)

### 2.3 Природа AI-выхода
AI-контент в Сервисе — информационный и образовательный. Может содержать ошибки, упускать контекст или неправильно интерпретировать ваши данные. Всё важное проверяйте своим исследованием, у брокера или у лицензированного специалиста. Не полагайтесь на Provedo как единственную основу для инвестиционных, налоговых или правовых решений.

## 3. Право пользования

Вам должно быть не менее **18 лет** и вы должны обладать правовой дееспособностью заключить договор в вашей юрисдикции. Сервис не предлагается в РФ (см. раздел 14). Вы несёте ответственность за соответствие местным законам, применимым к вашему использованию Сервиса.

## 4. Создание учётной записи и безопасность

### 4.1 Учётная запись
Создаётся через партнёра аутентификации (Clerk). Требуется актуальная достоверная информация. Одна учётная запись на человека.

### 4.2 Учётные данные
Вы отвечаете за безопасность ваших учётных данных. О подозрении на несанкционированный доступ — немедленно сообщите на **`[SECURITY EMAIL — TBD]`**.

### 4.3 Подключения к брокерам/биржам
Подключая счёт, вы авторизуете Plaid, SnapTrade или другого именованного партнёра на получение read-only данных. Вы подтверждаете, что являетесь владельцем счёта или имеете его полномочия. Мы не получаем торговых прав и не сможем перевести активы; мы никогда не спросим пароль от брокера.

### 4.4 Расторжение вами
В любой момент через страницу настроек или письмом на **`[SUPPORT EMAIL — TBD]`**. После — удаление по Privacy Policy (30-дневный льготный период + статутное удержание где требуется).

### 4.5 Расторжение или приостановка нами
Мы можем приостановить или расторгнуть в случае существенного нарушения, злоупотреблений, мошенничества или по иным законным операционным причинам с разумным уведомлением.

## 5. Допустимое использование

Вы соглашаетесь не:
- Использовать Сервис с нарушением закона, регулирования или прав третьих лиц
- Реверс-инжинирить, декомпилировать, разбирать Сервис кроме случаев, явно разрешённых законом
- Скрэпить, краулить или извлекать данные массовыми автоматизированными средствами сверх разумных rate-limits
- Злоупотреблять AI-чатом через prompt-injection, попытки извлечь данные других пользователей, попытки заставить модель давать прескриптивные советы вне дизайна Сервиса
- Делиться учётными данными или позволять доступ третьим лицам
- Выдавать себя за другого или искажать личность
- Загружать вредоносное ПО или атаковать инфраструктуру
- Использовать Сервис для создания конкурирующего продукта (применяется только к контенту, который мы генерируем вам)

Мы можем rate-limit'ить, throttle'ить или блокировать активность, которую считаем нарушением.

## 6. Тарифы и оплата

### 6.1 Тарифы
**Free**, **Plus** и **Pro** (детали на `provedo.ai/pricing`). Набор функций может меняться с разумным уведомлением; существенное сокращение функций платного тарифа — минимум за 30 дней, с пропорциональным возвратом где применимо.

### 6.2 Биллинг
Платные тарифы — ежемесячно или ежегодно авансом через Stripe. Цены в отображаемой на чекауте валюте, с учётом НДС/GST где требуется.

### 6.3 Автопродление
Подписки продлеваются автоматически. Отменить можно в любой момент; отмена действует по окончании текущего оплаченного периода.

### 6.4 Возвраты — потребители ЕС / ЕЭП / UK
У вас есть законное право отказаться от дистанционного договора в течение **14 дней** без причины, согласно Директиве ЕС 2011/83/EU Ст. 16 и аналогичных UK-регуляций.

**Согласие на немедленное исполнение.** Поскольку Сервис — это цифровая услуга, предоставляемая сразу, при оформлении мы попросим вас явно согласиться на немедленное исполнение и подтвердить, что право на отказ теряется после начала исполнения. Если вы **не** согласитесь — 14-дневное окно сохраняется.

### 6.5 Возвраты — иные юрисдикции
Подписки, как правило, не возвращаются кроме как по нашему усмотрению. Возможны возвраты в индивидуальном порядке при перебоях или существенных дефектах продукта.

### 6.6 Изменения цены
Мы можем менять цены. Изменения для вашей существующей подписки вступают в силу при следующем продлении, с уведомлением минимум за 30 дней.

## 7. Интеллектуальная собственность

### 7.1 Наша ИС
Сервис (включая ПО, UI, бренд Provedo и создаваемый нами контент) принадлежит нам или нашим лицензиарам и защищён авторским правом, товарным знаком и иными законами. Мы предоставляем вам ограниченную, неисключительную, непередаваемую, отзывную лицензию на использование Сервиса для личных некоммерческих целей в рамках Условий.

### 7.2 Ваши данные
Вы сохраняете все права на данные, которые вы предоставляете или генерируете в Сервисе (холдинги, транзакции, сообщения чата). Используя Сервис, вы предоставляете нам неисключительную, безвозмездную лицензию обрабатывать ваши данные **только для предоставления, поддержки, безопасности и улучшения Сервиса** — в рамках Privacy Policy. Мы не используем ваши промпты, контент чата или данные портфеля для обучения сторонних foundation-моделей.

### 7.3 AI-контент
Ответы, сгенерированные Сервисом, предназначены для вашего использования в Сервисе. Точность не гарантируется. Вы несёте ответственность за использование любого вывода.

### 7.4 Обратная связь
Отправляя нам предложения — вы предоставляете нам неисключительную, всемирную, безвозмездную, бессрочную лицензию использовать её для улучшения Сервиса без обязательств перед вами.

## 8. Сторонние сервисы

Сервис зависит от сторонних сервисов (Plaid, SnapTrade, Clerk, Anthropic, OpenAI, Fly.io, Doppler, Stripe, поставщики рыночных данных). У каждого — свои условия и политика приватности. Мы перечисляем текущих субпроцессоров в `docs/legal/SUBPROCESSOR_REGISTRY.md` и в Privacy Policy.

## 9. Отказ от гарантий и ограничение ответственности

### 9.1 Отказ от гарантий (в максимально допустимом законом объёме)
Сервис предоставляется **«как есть»** и **«как доступен»**, без каких-либо гарантий, явных или подразумеваемых, включая гарантии пригодности для продажи, пригодности для конкретной цели, ненарушения прав, бесперебойной или безошибочной работы. Мы не гарантируем, что Сервис соответствует вашим требованиям, что выводы точны, что данные от брокеров/бирж полны или своевременны, что дефекты будут исправлены.

### 9.2 Инвестиционные результаты
**Вы признаёте, что все инвестиционные решения принимаете сами и что рыночные результаты по своей природе неопределённы. Мы не несём ответственности за инвестиционные убытки, налоговые последствия или иные финансовые результаты вашего использования Сервиса.**

### 9.3 Ограничение ответственности (в максимально допустимом законом объёме)
**Наша совокупная ответственность перед вами по любой теории (договор, деликт, статут или иное) ограничена большей из: (a) суммы сборов, уплаченных за 12 месяцев до события, породившего требование, либо (b) 100 EUR.** Мы не несём ответственность за непрямые, случайные, последующие, примерные, специальные или штрафные убытки, упущенную прибыль, упущенную выручку, потерю данных или гудвилла.

### 9.4 Исключения
Ничто в настоящих Условиях не исключает и не ограничивает ответственность, которая не может быть исключена по применимому праву, включая:
- Ответственность за грубую небрежность или умышленные действия
- Ответственность за смерть или телесные повреждения по нашей небрежности
- Ответственность за мошенничество
- Статутную потребительскую ответственность в ЕС/ЕЭП/UK
- В Германии — ответственность за нарушение кардинальных обязательств («wesentliche Vertragspflichten»), ограниченная предвидимыми убытками, типичными для данного типа договора (§§ 307, 309 BGB)

## 10. Возмещение ущерба

Вы обязуетесь возмещать нам ущерб от претензий, убытков, обязательств и разумных расходов (включая гонорары юристов), возникающих из нарушения Условий, неправомерного использования Сервиса, нарушения закона или прав третьих лиц. Не применяется там, где запрещено императивным потребительским правом.

## 11. Применимое право и разрешение споров

### 11.1 Применимое право — пользователи ЕС / ЕЭП / UK
Применяется **`[ПРАВО — TBD: DE / NL / IE]`** без учёта коллизионных норм. Императивные потребительские нормы страны вашего обычного проживания применяются дополнительно, если они предоставляют большую защиту.

### 11.2 Применимое право — пользователи US и остальных юрисдикций
Применяется **право штата Делавэр** (или **`[АЛЬТЕРНАТИВНЫЙ US ШТАТ — TBD]`**).

### 11.3 Досудебное урегулирование
При споре — сначала **`[DISPUTE EMAIL — TBD]`**. 30 дней на добросовестное урегулирование.

### 11.4 Споры — US пользователи
Если досудебное не удалось — **обязательный индивидуальный арбитраж** JAMS по Streamlined Arbitration Rules в **`[ВЕНУ — TBD]`**. Вы можете отказаться от арбитражной оговорки в течение 30 дней после первого принятия Условий, написав на **`[OPT-OUT EMAIL — TBD]`**.

### 11.5 Споры — пользователи ЕС / ЕЭП / UK
Суды страны вашего обычного проживания или суды **`[СЕДАЛИЩЕ — TBD]`**. Платформа ODR: **https://ec.europa.eu/consumers/odr**.

### 11.6 Остальные юрисдикции
Досудебное — сначала; потом исключительная юрисдикция судов **`[СЕДАЛИЩЕ — TBD]`**.

## 12. UK Consumer Duty (FCA)

Для UK-пользователей: мы признаём действие FCA Consumer Duty framework (Principle 12, PS22/9). Хотя Provedo не является регулируемой деятельностью по FSMA 2000 Ст. 53, мы добровольно выравниваем UK-опыт с ожиданиями Consumer Duty по продукту/услуге, цене и ценности, пониманию потребителя, потребительской поддержке.

## 13. Изменения Условий

Существенные изменения — по email и/или в-продукте **минимум за 30 дней**. Продолжение использования после вступления в силу — принятие. Несущественные — могут вступать в силу при публикации.

## 14. Географический охват

Сервис не предлагается в РФ. Учётные записи с российскими резидентскими данными могут быть отклонены или приостановлены. Мы можем добавлять или убирать юрисдикции; удаления — минимум за 30 дней с путём экспорта данных.

## 15. Форс-мажор

Не отвечаем за задержки/сбои из-за причин вне нашего разумного контроля (стихийные бедствия, война, гражданские беспорядки, терроризм, кибер-атаки, пандемия, обрывы питания/связи, действия сторонних инфраструктурных провайдеров).

## 16. Разное

- **Делимость.** Недействительность отдельного положения не затрагивает остальное.
- **Отсутствие отказа.** Неисполнение нами положения — не отказ от права его исполнить позднее.
- **Уступка.** Вы не можете уступать Условия без нашего согласия. Мы можем уступить аффилированному лицу или в связи со слиянием/приобретением/продажей активов с уведомлением.
- **Полное соглашение.** Настоящие Условия вместе с Privacy Policy, Cookie Policy и любыми дополнительными уведомлениями в точке сбора — полное соглашение.
- **Язык.** При конфликте — английская версия, кроме случаев императивного требования местного права о местной языковой версии.

## 17. Контакты

**Общие запросы и поддержка:** `[SUPPORT EMAIL — TBD]`
**Правовые уведомления:** `[LEGAL EMAIL — TBD]`
**Почтовый адрес:** `[АДРЕС — TBD]`

---

## Cross-reference matrix — ATTORNEY REVIEW items summary

| # | Item | Section | Owner action |
|---|---|---|---|
| 1 | Entity identification | 1 | PO chooses form; counsel registers |
| 2 | Acceptance mechanism (clickwrap) | 1 | UX implementation check |
| 3 | Lane A disclosure language | 2 | Do not materially alter — locked per Legal-advisor review 2026-04-23 |
| 4 | Refund window per-market carve-outs | 6.4 | Per-market annex for DE/FR/UK launch |
| 5 | California auto-renewal disclosure | 6.4 | Billing UX review |
| 6 | Liability cap ceiling | 9.3 | Validated per DE/UK mandatory rules |
| 7 | Governing law selection | 11.1, 11.2 | Coordinated with entity-domicile decision |
| 8 | Arbitration clause enforceability | 11.4 | McGill / state-specific review |
| 9 | UK Consumer Duty alignment | 12 | FCA-experienced counsel pre-UK launch |
| 10 | Russia geographic exclusion | 14 | Confirm with `DECISIONS.md` 2026-04-23 Q7 |

---

## References

- 15 U.S.C. § 80b-2(a)(11) (Investment Advisers Act definition): https://www.law.cornell.edu/uscode/text/15/80b-2
- Directive 2014/65/EU (MiFID II) Article 4(1)(4): https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02014L0065-20240328
- Directive 2011/83/EU (Consumer Rights — 14-day withdrawal): https://eur-lex.europa.eu/eli/dir/2011/83/oj
- FSMA 2000 (UK) Regulated Activities Order Article 53: https://www.legislation.gov.uk/uksi/2001/544/article/53
- FCA Consumer Duty (PS22/9): https://www.fca.org.uk/publications/policy-statements/ps22-9-new-consumer-duty
- UK Consumer Rights Act 2015: https://www.legislation.gov.uk/ukpga/2015/15/contents
- California Bus. & Prof. Code §17602 (auto-renewal): https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=17602.&lawCode=BPC
- German BGB §§ 307, 309 (unfair terms): https://www.gesetze-im-internet.de/bgb/BJNR001950896.html
- Brussels I bis Regulation 1215/2012 (EU consumer jurisdiction): https://eur-lex.europa.eu/eli/reg/2012/1215/oj
- EU ODR platform: https://ec.europa.eu/consumers/odr

All URLs accessed 2026-04-23.
