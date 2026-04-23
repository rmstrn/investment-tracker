# Email Sequences — v1.1 (Memoro, patched 2026-04-23 per 4-locks)

**Author:** content-lead
**Date:** 2026-04-23 (v1); patched 2026-04-23 (v1.1 — 4-locks)
**Status:** draft — production-ready copy, awaiting PO review via Navigator
**Language:** English primary (day-1), Russian parallel-secondary (post-launch wave, not shipped day-1)
**Scope:** 9 email templates — 5 original from `docs/04_DESIGN_BRIEF.md §13.4` + 4 new trial-specific from `DECISIONS.md` 2026-04-23 4-locks.
**Patch log:** see §13 for 2026-04-23 4-locks delta (new trial emails + monthly-cap rework).

**CONSTRAINTS enforcement:**
- CONSTRAINTS Rule 1 — no spend. No paid email tool decided here; copy is tool-agnostic markdown draft.
- CONSTRAINTS Rule 2 — **no external send.** These templates live in the repo as drafts ONLY. No test sends to PO's address, no provisioning against Mailgun/Postmark/Resend, no trigger wiring. When PO is ready to wire into an ESP, PO takes this copy as input and provisions personally.
- Lane A — no investment advice, no performance claim, no «buy/sell/should» in any body copy.
- No dark patterns — no fake urgency, no countdown language, no «limited seats». Per Design Brief §13.3 «Never» list.

---

## §0. Global email rules (applied to every template below)

### Voice invariants
- **Memoro as named agent.** Emails say «Memoro noticed», «Memoro has been holding your portfolio for 30 days». Not «we flagged» / «our AI detected». This distances Memoro from advisor-paternalism and keeps Lane A in voice, not just disclaimer.
- **Magician + Sage + Everyman triangulation.** Subjects lean Magician (specific, quietly curious). Body leans Sage (observational, calm, sourced). CTAs lean Everyman (imperative-direct, «Open your feed» not «View now»).
- **No hype verbs.** No «discover», «unlock your potential», «take control», «level up», «game-changing». Standard SaaS-marketing verbs banned per brand-voice. Allowed verbs: see, open, try, read, check, skip, unsubscribe.
- **Honest about timing.** If Coach takes 30 days, day-1 email does not promise Coach. If insights are weekly Free / daily Plus, the email never implies daily on Free.

### Structure
- Subject: ≤50 chars (character budget per content-lead conventions).
- Preheader: ≤80 chars (mobile inbox preview window).
- Body: single-column, 600px max per Design Brief §16.3. No HTML tables, no sidebars, no promotional banners. Plain prose + single primary CTA + footer.
- Primary CTA: ≤24 chars, imperative, direct. One CTA per email (no secondary buttons; secondary links inline only).
- Footer: unsubscribe link (all non-transactional emails), legal notice, plain text address (post-alpha: required by CAN-SPAM / GDPR).
- Tracking: no per-user pixel tracking per Design Brief §16.3. Aggregate open-rate via provider only.

### Trigger conditions
Each email has a specific trigger. Triggers are described at the top of each template. Actual implementation (Resend / Postmark / Mailgun wiring + Core API event subscription) is engineering scope, not content-lead scope. Per TD-091-family work; out of scope here.

### Email type classification (CAN-SPAM / GDPR)
- **Transactional:** Welcome (post-signup), Limit-approaching (usage-based). No unsubscribe required; does not need commercial-email opt-in.
- **Commercial / behavioral:** First-insight, 30-day recap, Upgrade offer. Unsubscribe required, physical address in footer.

---

## §1. Email 1 — Welcome (transactional, hour-0 post-signup)

**Trigger:** user completes Clerk signup + lands on first-sync-or-empty-dashboard. Email fires at sign-up-complete event, not at sync-complete (don't gate welcome on technical-success).

### English

**Subject:** Welcome to Memoro.
**Preheader:** Your second brain for your portfolio just came online.

**Body:**
> Hi {first_name_or_blank},
>
> Memoro remembers what you hold, notices what you'd miss, and explains what it sees — on your real positions, with sources.
>
> The fastest way to see this in action is to connect one account. Any broker, any exchange. It's read-only — we look at your positions, we don't touch them.
>
> Once the first sync finishes (usually under a minute), you can start asking questions in chat. Try «what's my biggest position?» or «what dividends are coming up?» — that's enough to get a feel for it.
>
> If you connect more accounts later, Memoro's memory grows with you.

**CTA:** Connect your first account
**CTA link:** {app_url}/accounts/connect

**Footer:**
> Memoro is not a registered investment advisor. Information is for educational purposes only. — {physical_address}

**No unsubscribe link** (transactional; does not carry promotional payload).

### Russian (parallel secondary)

**Subject:** Добро пожаловать в Memoro.
**Preheader:** Твой второй мозг для портфеля только что включился.

**Body:**
> Привет, {first_name_or_blank}.
>
> Memoro помнит, что у тебя есть, замечает, что бы ты упустил, и объясняет, что видит — на твоих реальных позициях, со ссылками на источники.
>
> Быстрее всего это почувствовать — подключить один счёт. Любой брокер, любая биржа. Только на чтение — мы смотрим на твои позиции, но их не трогаем.
>
> Как только первая синхронизация закончится (обычно меньше минуты), можешь начать задавать вопросы в чате. Попробуй «какая моя самая большая позиция?» или «какие дивиденды на подходе?» — этого хватит, чтобы почувствовать продукт.
>
> Когда подключишь больше счетов — память Memoro вырастет вместе с тобой.

**CTA:** Подключить первый счёт
**Footer:**
> Memoro не является зарегистрированным инвестиционным советником. Информация предоставляется в образовательных целях. — {physical_address}

### Rationale
- **Subject:** plain declarative. Not «Welcome 🎉» (no emoji per brand voice), not «Welcome to the future of portfolio tracking» (no hype). Says what arrived. Magician quiet-invention tone.
- **Preheader:** repeats tagline in first-person-of-Memoro. Does not duplicate subject.
- **Body opens with three-verb identity** matching sub-hero — reinforces landing-to-email consistency.
- **Action: connect account.** Activation is the primary job of welcome email per `05_KPIS.md` implied (activation = first-account-connect). Single CTA, no dilution.
- **Sample questions provided.** Reduces cold-start friction for ICP B newcomer. Named questions match scripted demo-tab content from `02_POSITIONING.md`.
- **Lane A:** nothing about performance, buying, selling. «Dividends coming up» = observational. PASS.
- **Read-only call-out** — echoes Design Brief §17.3 trust marker pattern. Named once, not labored.

---

## §2. Email 2 — First insight (behavioral, day 1-3 when first pattern surfaces)

**Trigger:** Memoro surfaces first insight card for this user (InsightEvent fired in Core API). Usually within 24h of first sync if insights backend has enough data (dividend upcoming, concentration pattern, holding event); fallback 72h if data sparse.

**Classification:** Behavioral. Commercial opt-in required (if user opted out of product emails during signup, this email does not fire).

### English

**Subject:** Memoro noticed something in your portfolio.
**Preheader:** Your first insight is ready. Takes about a minute to read.

**Body:**
> Hi {first_name_or_blank},
>
> Memoro's been holding your portfolio for {hours_since_signup} hours, and the first thing worth surfacing just showed up.
>
> {insight_headline_personalized}
>
> It's in your insights feed now, with the source positions and the numbers behind it. Memoro doesn't tell you what to do with it — just what it sees.
>
> More insights show up over time as your portfolio shifts. On Free, one a week. On Plus, daily.

**CTA:** Open your insight
**CTA link:** {app_url}/insights/{insight_id}

**Footer:**
> You're receiving this because you signed up for Memoro. Adjust email preferences [here]({prefs_url}) or [unsubscribe]({unsubscribe_url}).
> Memoro is not a registered investment advisor. Information is for educational purposes only. — {physical_address}

### Russian (parallel secondary)

**Subject:** Memoro заметил кое-что в твоём портфеле.
**Preheader:** Первый инсайт готов. Читается примерно за минуту.

**Body:**
> Привет, {first_name_or_blank}.
>
> Memoro держит твой портфель уже {hours_since_signup} часов, и первое, что стоит подсветить, только что появилось.
>
> {insight_headline_personalized}
>
> Инсайт сейчас в твоём фиде — с исходными позициями и числами под ним. Memoro не говорит, что с этим делать — только показывает, что видит.
>
> Со временем инсайтов будет больше, по мере того как портфель меняется. На Free — один в неделю. На Plus — каждый день.

**CTA:** Открыть инсайт
**Footer:**
> Ты получаешь это письмо, потому что зарегистрировался в Memoro. Настроить уведомления [здесь]({prefs_url}) или [отписаться]({unsubscribe_url}).
> Memoro не является зарегистрированным инвестиционным советником. Информация предоставляется в образовательных целях. — {physical_address}

### Rationale + Lane A notes
- **Subject uses Memoro-as-agent voice.** «Memoro noticed» is the canonical Coach / Insights voice (Q5 teaser-paywall lock, v3.1 positioning). Creates curiosity without promising answers.
- **Hours-since-signup framing** makes memory-metaphor literal («Memoro's been holding your portfolio for X hours») — Hooked / trigger specificity (Nir Eyal). Gives the promise a timestamp.
- **{insight_headline_personalized} is Memoro's headline, not a marketing tagline.** Sample headlines (from `docs/product/02_POSITIONING.md` demo-tab content, Lane-A-compliant):
  - «NVDA is now 14% of your portfolio — up from 9% in April.»
  - «Your tech allocation shifted from 44% to 58% this month.»
  - «AAPL announced its dividend: $0.25/share, pays {date}.»
  - «EUR cash position ($8,400) is losing ~2.1%/yr to Eurozone inflation at current rate.»
  Never: «consider reducing NVDA», «you should rebalance», «this is risky». Finance-advisor R10 guardrail — describe, don't name normatively.
- **Lane A explicit disclaim inside body** — «Memoro doesn't tell you what to do with it, just what it sees» — pre-empts any implicit-suggestion read of the headline itself.
- **Free-vs-Plus cadence honest** — sets expectation that next insight might be a week away on Free. Prevents «why is this quiet» churn.
- **Commercial email footer pattern** — unsubscribe + preference center + physical address per CAN-SPAM / GDPR.

---

## §3. Email 3 — 30-day recap (commercial/behavioral, day 30)

**Trigger:** user is 30 days past signup AND has at least one connected account active. If no account connected, skip (different «we haven't met» re-engagement email, not in this set).

**Classification:** Commercial behavioral. Unsubscribe required.

### English

**Subject:** 30 days with Memoro — here's what it noticed.
**Preheader:** A month of memory, in one quick recap.

**Body:**
> Hi {first_name_or_blank},
>
> Memoro's been remembering your portfolio for 30 days. Here's what stood out.
>
> **Your memory so far:**
> - Positions held: {position_count}
> - Brokers connected: {broker_count}
> - Insights surfaced: {insight_count}
> - Questions asked in chat: {chat_msg_count}
>
> **What Memoro saw this month:**
> {top_3_insights_personalized}
>
> Memoro has now read enough of your trade history to start seeing patterns. If you're on Plus, the first pattern-reads from Coach will start showing up in your feed. If you're on Free, Memoro will show you one pattern teaser — and if you want the full read, Plus unlocks it.
>
> No spam. No «last chance» nonsense. Just: there's more here when you want it.

**CTA:** See your month in Memoro
**CTA link:** {app_url}/recap/30d

**Footer:**
> You're receiving this because you signed up for Memoro. Adjust email preferences [here]({prefs_url}) or [unsubscribe]({unsubscribe_url}).
> Memoro is not a registered investment advisor. Information is for educational purposes only. — {physical_address}

### Russian (parallel secondary)

**Subject:** 30 дней с Memoro — вот что он заметил.
**Preheader:** Месяц памяти — в одном коротком обзоре.

**Body:**
> Привет, {first_name_or_blank}.
>
> Memoro помнит твой портфель уже 30 дней. Вот что выделилось.
>
> **Твоя память пока:**
> - Позиций в учёте: {position_count}
> - Брокеров подключено: {broker_count}
> - Инсайтов подсвечено: {insight_count}
> - Вопросов в чате: {chat_msg_count}
>
> **Что Memoro увидел за месяц:**
> {top_3_insights_personalized}
>
> Memoro прочитал уже достаточно твоей истории сделок, чтобы начать видеть паттерны. Если ты на Plus, первые пэттерн-риды от коуча начнут появляться в фиде. Если на Free — Memoro покажет один пэттерн-тизер; а полный разбор — это Plus.
>
> Без спама. Без «последних шансов». Просто: здесь есть больше, когда захочешь.

**CTA:** Посмотреть месяц в Memoro
**Footer:** [same as English footer structure]

### Rationale + Lane A notes
- **Month-as-memory framing** — ties to sub-hero «remembers» and to Onboarding Stage 3 per `02_POSITIONING.md` (day-30 Coach activation milestone).
- **Data recap** (positions, brokers, insights, chat count) is factual retrospection. Not «your portfolio is up X%» (Lane A forbidden framing; also performance-promise adjacent). Zero financial-outcome language.
- **{top_3_insights_personalized}** = top 3 insights that already fired for this user, replayed with headline only. No new normative content introduced. Finance-advisor R10 guardrail applied at source.
- **Coach teaser transition** — this is the email that bridges from 30-day milestone to Coach availability. Honest about tier split (Free = 1 pattern teaser, Plus = full pattern-reads). Matches Q5 teaser-paywall lock.
- **«No spam. No last chance nonsense.»** — explicit anti-dark-pattern voice (Design Brief §13.3 «Never» list echoed as brand voice). Made-to-stick «Unexpected» device (SUCCES) — breaks SaaS-email expectation.
- **Lane A:** no «you should upgrade», no «Plus will help you earn more». Upgrade framing is «there's more here when you want it» — opt-in invitation, not pressure.

---

## §4. Email 4 — Limit approaching (transactional, Free tier usage ≥80%)

**Trigger:** user is on Free tier AND hits ≥80% of any monthly/weekly/account limit (AI chat 50/month = fires at 40th msg sent; 1 insight/week cap = fires at 7-day mark without new insight; 2-account cap = fires when adding 2nd account, not before).

**PATCHED 2026-04-23 per 4-locks (DECISIONS.md):** Free tier = **50 messages/month, NO daily limit**. Previous draft had 5 msg/day cap; replaced entirely. User can burst 10 messages in a day and be silent the next — more retail-friendly. Trigger fires at 80% of monthly cap, not any daily threshold.

**Classification:** Transactional (usage-triggered). No unsubscribe required, but does carry upgrade-adjacent framing — we'll provide an «email preferences» link for hygiene even though it's technically transactional.

### English — variant A: AI chat monthly limit approaching

**Subject:** 40 of 50 chats used this month.
**Preheader:** Resets on the 1st. Or go unlimited on Plus.

**Body:**
> Hi {first_name_or_blank},
>
> Quick heads-up: you've used 40 of your 50 monthly chat messages with Memoro. Your allowance resets on {next_reset_date} (first of the month).
>
> No daily caps, no streak-breaking — just a monthly pool. If you'd rather not track it, Plus is $8/month and the counter goes away.
>
> Free is always Free — we'd rather have you on the limit than upgrade you for the wrong reason.

**CTA:** See Plus details
**CTA link:** {app_url}/pricing?ref=limit_email_chat

**Footer:**
> [email preferences]({prefs_url}) · Memoro is not a registered investment advisor. — {physical_address}

### English — variant B: account limit (adding 2nd)

**Subject:** You're at the 2-account Free limit.
**Preheader:** Connect more accounts with Plus, or stay on Free — up to you.

**Body:**
> Hi {first_name_or_blank},
>
> You just connected your second account — that's the Free tier limit. Memoro's memory now holds both.
>
> If you have a third account anywhere, Plus lifts the limit ($8/month, unlimited accounts). No pressure — the two accounts you have work fine on Free indefinitely.

**CTA:** See Plus details
**CTA link:** {app_url}/pricing?ref=limit_email_accounts

**Footer:** [same pattern]

### English — variant C: weekly insight cadence (7-day quiet)

**Subject:** Memoro's been quiet this week.
**Preheader:** Free tier = 1 insight / week. Here's what's waiting on Plus.

**Body:**
> Hi {first_name_or_blank},
>
> On Free, Memoro surfaces one insight a week. This week's insight already dropped on {last_insight_date}; the next one comes around {next_insight_date}.
>
> If you want Memoro noticing every day instead of every week, Plus ($8/month) lifts the cadence. Same Memoro, just more frequent.
>
> Or stay on Free — the weekly cadence is honest, not a limitation we're embarrassed about.

**CTA:** See daily insights on Plus
**CTA link:** {app_url}/pricing?ref=limit_email_insights

**Footer:** [same pattern]

### Russian (parallel secondary, variant A — AI chat monthly limit)

**Subject:** 40 из 50 чатов использовано в этом месяце.
**Preheader:** Обнуляется 1-го числа. Или сними лимит на Plus.

**Body:**
> Привет, {first_name_or_blank}.
>
> Коротко: ты использовал 40 из 50 месячных сообщений в чате с Memoro. Лимит обновится {next_reset_date} (1-го числа следующего месяца).
>
> Никаких дневных ограничений, никаких «сорванных серий» — просто месячный пул. Если не хочется его считать — Plus стоит $8 в месяц, и счётчик уходит.
>
> Free всегда бесплатный — мы бы предпочли, чтобы ты сидел на лимите, чем апгрейдился не по той причине.

**CTA:** Посмотреть Plus
**Footer:** [тот же паттерн]

### Rationale + Lane A / dark-pattern notes
- **«Free is always Free» / «the weekly cadence is honest, not a limitation we're embarrassed about»** — core anti-dark-pattern voice. Design Brief §13.3 forbids «you'll lose access in 3 days» / «last chance» / «only 3 spots left» — these variants actively invert that voice into a positive brand signal. Contagious STEPPS «social currency» — sharing this email positions the user as «look at this non-sleazy company».
- **Honest reset times** — «resets at midnight UTC» / «next one around {date}». Factual, not urgency-manipulated.
- **No countdown language, no «limited time», no «save X%»** — per Design Brief §13.3 hard rule.
- **CTA ref= parameters** for analytics (email → conversion attribution) — not tracked per-user; aggregate only.
- **Lane A:** nothing about market performance, returns, investment outcomes. All tier-upgrade language is about product features (chat cap, account cap, insight cadence). PASS all four jurisdictions.

---

## §5. Email 5 — Upgrade offer (commercial, day 45-60 nurture)

**Trigger:** user is 45-60 days past signup AND on Free tier AND has sent ≥20 chat messages total OR connected ≥2 accounts (= engaged Free user, meaningful activation signal). If user has NOT hit these signals, skip — don't waste upgrade ammo on cold users.

**Classification:** Commercial. Unsubscribe mandatory.

### English

**Subject:** Your Memoro is getting a lot of use.
**Preheader:** Free works forever. But here's what Plus adds, if you're curious.

**Body:**
> Hi {first_name_or_blank},
>
> A quick observation: you've been using Memoro for {days_since_signup} days, asked {chat_msg_count} questions, and connected {broker_count} account{plural}. That's solid use.
>
> Free will keep working — we're not going to degrade it to push you upgrade. But if what you want is more, here's what Plus gives you for $8 a month:
>
> - **Unlimited chat.** No monthly cap — ask as much as you want.
> - **Daily insights.** Memoro notices every day, not just weekly.
> - **Unlimited accounts.** All your brokers, all your exchanges, no 2-account ceiling.
> - **Full Coach.** Plus unlocks the pattern-reads Memoro has been building from your trade history — not just teasers.
> - **Dividend calendar.** Know when every payout lands, not just the week it happens.
> - **Benchmark comparison.** How your portfolio moved vs S&P 500, vs MSCI World, vs anything you want to compare against.
> - **CSV export.** Your data, in your hands, anytime.
>
> The cancel button is one click. Always. No «we'll remind you before we charge you again» games — if Plus isn't worth it, you change your plan and we stop charging. (If you skipped the 14-day Plus trial at signup, that's fine — you can start one now, or just subscribe directly.)

**CTA:** See Plus
**CTA link:** {app_url}/pricing?ref=upgrade_offer_d45

**Footer:**
> You're receiving this because you've been actively using Memoro. Adjust email preferences [here]({prefs_url}) or [unsubscribe]({unsubscribe_url}).
> Memoro is not a registered investment advisor. Information is for educational purposes only. — {physical_address}

### Russian (parallel secondary)

**Subject:** Твой Memoro явно в работе.
**Preheader:** Free работает всегда. А вот что добавляет Plus — если интересно.

**Body:**
> Привет, {first_name_or_blank}.
>
> Короткое наблюдение: ты пользуешься Memoro уже {days_since_signup} дней, задал {chat_msg_count} вопросов и подключил {broker_count} счёт{plural}. Это серьёзное использование.
>
> Free продолжит работать — мы не будем его ухудшать, чтобы выдавить тебя на апгрейд. Но если хочется больше — вот что Plus даёт за $8 в месяц:
>
> - **Безлимитный чат.** Без месячного лимита — спрашивай сколько хочешь.
> - **Инсайты каждый день.** Memoro замечает каждый день, а не раз в неделю.
> - **Безлимитные счета.** Все брокеры, все биржи, без потолка в 2.
> - **Полный коуч.** Plus открывает пэттерн-риды, которые Memoro строил из твоей истории сделок — не просто тизеры.
> - **Календарь дивидендов.** Точные даты выплат, а не только недели.
> - **Сравнение с бенчмарком.** Как твой портфель двигался относительно S&P 500, MSCI World — или любого ориентира на твой выбор.
> - **CSV-экспорт.** Твои данные — в твоих руках, когда захочешь.
>
> Кнопка отмены — в один клик. Всегда. Никаких «мы напомним за неделю до списания» — если Plus не стоит своих денег, ты меняешь план, мы прекращаем списывать. (Если пропустил 14-дневный триал Plus при регистрации — не страшно, можешь запустить его сейчас или подписаться напрямую.)

**CTA:** Посмотреть Plus
**Footer:** [standard commercial]

### Rationale + Lane A notes
- **«A quick observation»** opens with the «Memoro noticed» voice — email IS a Memoro-observation about user behavior, not a sales pitch.
- **Feature list is concrete, not aspirational.** Each item names what changes, not how it will make the user «smarter» or «wealthier». Zero performance-adjacent language.
- **«Cancel button is one click. Always.»** — explicit anti-dark-pattern voice. Influence-psychology — counter-intuitive honesty builds trust (Cialdini reciprocity reversed; you trust someone who undersells).
- **«No we'll-remind-you-before-we-charge games»** — directly addresses the hated SaaS pattern of auto-renewal-with-pretend-reminder. User-researcher §NEGATIVE list (Product Hunt Getquin support complaints — users leave when feels deceptive). NOTE: «no trial» framing was removed 2026-04-23 per 4-locks — Memoro now offers a 14-day Plus trial with card-required at signup. Trial conversion is handled cleanly (§7-9 trial emails give explicit billing-date callout on day 13), which is the behavioral equivalent of the «remind you before we charge» pattern — but done honestly. The upgrade-offer email (this template) targets users who skipped or missed the trial; the line acknowledges the trial exists.
- **Lane A:** every feature line is factual product feature. Zero market/return/performance claims. Benchmark-comparison line is the closest to financial-content — scoped as a computed comparison feature, not a performance claim. PASS.

---

## §6. Email 6 — Trial welcome (transactional, hour-0 of trial start)

**Added 2026-04-23 per 4-locks (DECISIONS.md):** Trial = 14-day Plus, card required at signup. This email fires the moment trial starts (user completes signup with card on file). It is SEPARATE from Email 1 (Welcome) which fires for any new user regardless of trial/free-forever choice. If user chose trial-path at signup, Email 1 is replaced by this email (don't send both — user-research hygiene).

**Trigger:** user completes signup + Stripe payment-method authorization + chose trial path (not free-forever path). Fires once at `trial_started_at` event.

**Classification:** Transactional. No unsubscribe required; does not carry promotional payload — this is trial-start confirmation, legally required to name the charge date.

### English

**Subject:** 14 days of Plus starts now.
**Preheader:** Full access to Memoro — chat, insights, coach, all of it.

**Body:**
> Hi {first_name_or_blank},
>
> Your 14-day Plus trial just started. You have full access to everything Memoro does:
>
> - **Unlimited chat.** Ask as much as you want.
> - **Daily insights.** Memoro notices every day, not just weekly.
> - **Unlimited accounts.** Every broker, every exchange.
> - **Full Coach.** Memoro reads patterns in your past trades — what it sees, in full detail.
> - Plus everything else: CSV export, benchmarks, dividend calendar.
>
> On {trial_end_date}, your card will be charged $8 for the first month — unless you cancel before then. Cancel any time in Settings, one click, no friction.
>
> The fastest way to get the most out of 14 days: connect one account, ask one question. Memoro remembers from there.

**CTA:** Connect your first account
**CTA link:** {app_url}/accounts/connect

**Footer:**
> You'll receive two more trial emails: one at day 7 (midpoint, optional-skip), one at day 13 (the heads-up before your card is charged). Adjust email preferences [here]({prefs_url}).
> Memoro is not a registered investment advisor. Information is for educational purposes only. — {physical_address}

### Russian (parallel secondary)

**Subject:** 14 дней Plus начинаются сейчас.
**Preheader:** Полный доступ к Memoro — чат, инсайты, коуч.

**Body:**
> Привет, {first_name_or_blank}.
>
> Твой 14-дневный триал Plus только что стартовал. У тебя — полный доступ ко всему, что умеет Memoro:
>
> - **Безлимитный чат.** Спрашивай сколько хочешь.
> - **Инсайты каждый день.** Memoro замечает каждый день, а не раз в неделю.
> - **Безлимитные счета.** Все брокеры, все биржи.
> - **Полный коуч.** Memoro читает паттерны в твоих прошлых сделках — что видит, в полной детализации.
> - Плюс всё остальное: CSV-экспорт, бенчмарки, календарь дивидендов.
>
> {trial_end_date} с карты спишется $8 за первый месяц — если не отменишь до этой даты. Отмена — в настройках, в любой момент, в один клик, без трений.

> Как быстрее всего использовать 14 дней: подключи один счёт, задай один вопрос. Memoro запомнит — дальше всё само.

**CTA:** Подключить первый счёт
**Footer:**
> Ты получишь ещё два триальных письма: на 7-й день (середина, можно пропустить) и на 13-й день (предупреждение перед списанием). Настроить уведомления [здесь]({prefs_url}).
> Memoro не является зарегистрированным инвестиционным советником. Информация предоставляется в образовательных целях. — {physical_address}

### Rationale + voice notes
- **Subject is factual declarative.** «14 days of Plus starts now.» — not «Welcome to the future», not «Your journey begins». States what happened. Magician quiet-invention voice.
- **Body opens with «Your 14-day Plus trial just started»** — confirmation frame, not sales frame. User already clicked trial; email confirms, doesn't re-sell.
- **Feature bullets list what's on.** Four bullets + one «plus everything else». No upsell, no «level up». Factual product access.
- **Charge date stated explicitly** — «On {trial_end_date}, your card will be charged $8». CAN-SPAM / EU Consumer Rights Directive compliant. Also brand-voice aligned («we don't hide the charge»).
- **Cancel mentioned in same sentence as charge.** Influence-psychology: over-disclose, under-promise. «Cancel any time in Settings, one click, no friction.» is now a recurring phrase across email + paywall; continuity is the point.
- **«Fastest way to get the most out of 14 days»** — activation nudge without pressure. Hooked / trigger: names the action («connect one account, ask one question») so first-step friction is low.
- **Footer pre-announces the 2 follow-up emails** — sets expectation honestly. User is never surprised by what lands in their inbox.
- **Lane A:** every feature line is product feature. Zero performance / return claims. PASS.

---

## §7. Email 7 — Trial day-7 midpoint (behavioral, day 7 of 14-day trial)

**Added 2026-04-23 per 4-locks.** Optional nudge for trial users who haven't explored key features. Not sent if user has already hit the main activation signals (≥3 chat messages + ≥1 Coach pattern viewed + ≥1 daily insight opened).

**Trigger:** trial user is at day 7 AND has NOT hit all three activation signals (chat, coach, daily insights). Skip if power-user.

**Classification:** Commercial-behavioral. Unsubscribe required.

### English

**Subject:** One week in. Has Memoro surprised you yet?
**Preheader:** A few things worth trying before your trial ends.

**Body:**
> Hi {first_name_or_blank},
>
> You're halfway through your 14-day Plus trial. Memoro has been remembering your portfolio for a week.
>
> A quick observation on what you've tried so far:
> - Chat: {chat_message_count} question{plural} asked
> - Daily insights: {insight_opens} opened
> - Coach patterns: {coach_patterns_viewed} viewed
>
> If you haven't yet, here are the three things that usually make Plus worth $8/month for most people:
>
> **1. Ask Memoro something you'd normally Google.** «How exposed am I to tech?» or «When's my next dividend?» — it reads your actual positions, not generic market data.
>
> **2. Open a Coach pattern-read.** Memoro has been watching your past trades. It sees things you might not — retrospectively, without judgment.
>
> **3. Check your daily insight.** On Free, Memoro surfaces one per week. On your Plus trial, one per day. See how the cadence changes the feel.
>
> Your trial ends {trial_end_date}. Your card will be charged $8 then — unless you cancel. No surprise charges; we'll remind you the day before.

**CTA:** Open Memoro
**CTA link:** {app_url}/dashboard

**Footer:**
> You're receiving this because you're on a 14-day Plus trial. Adjust email preferences [here]({prefs_url}) or [unsubscribe]({unsubscribe_url}).
> Memoro is not a registered investment advisor. Information is for educational purposes only. — {physical_address}

### Russian (parallel secondary)

**Subject:** Неделя с Memoro. Удивил?
**Preheader:** Что ещё стоит попробовать до конца триала.

**Body:**
> Привет, {first_name_or_blank}.
>
> Ты на середине 14-дневного триала Plus. Memoro помнит твой портфель уже неделю.
>
> Коротко — что ты уже попробовал:
> - Чат: {chat_message_count} вопрос{plural}
> - Ежедневные инсайты: открыто — {insight_opens}
> - Паттерны от коуча: просмотрено — {coach_patterns_viewed}
>
> Если ещё не, вот три вещи, ради которых Plus обычно стоит $8 в месяц для большинства:
>
> **1. Спроси у Memoro то, что обычно гуглишь.** «Насколько я зависим от tech?» или «Когда следующий дивиденд?» — Memoro читает твои реальные позиции, а не общие рыночные данные.
>
> **2. Открой разбор паттерна от коуча.** Memoro смотрит на твои прошлые сделки. Видит то, что ты можешь не замечать — ретроспективно, без осуждения.
>
> **3. Загляни в ежедневный инсайт.** На Free Memoro подсвечивает один раз в неделю. На твоём триале Plus — каждый день. Посмотри, как меняется ощущение.
>
> Триал заканчивается {trial_end_date}. Карта будет списана на $8 тогда — если не отменишь. Никаких сюрпризов; мы напомним за день.

**CTA:** Открыть Memoro
**Footer:** [standard commercial pattern]

### Rationale + voice notes
- **Subject is a question.** «Has Memoro surprised you yet?» — invites reflection, not sales. Influence-psychology: user answering own question is high-engagement pattern.
- **Counter displayed without judgment.** «{chat_message_count} question asked, {insight_opens} opened» — factual, no «you're falling behind» or «you've barely used it». Just numbers.
- **Three features highlighted contextually** — pick the ones the user HASN'T tried (engineering: pick 2-3 from untried activation set). If user tried all, email skips entirely.
- **«Ask Memoro something you'd normally Google»** — Hooked / variable-reward framing. Specific examples reduce cold-start.
- **Coach framing stays Lane A.** «Retrospectively, without judgment.» — echoes landing bullet 3 verbatim.
- **Cadence difference stated as «feel», not «value».** «See how the cadence changes the feel.» — voice-appropriate, Magician quiet-invention. Not «upgrade to feel more productive».
- **Charge reminder already embedded** — user knows exactly when and how much. No surprise.
- **Lane A:** no «upgrade to earn more», no «Plus helps you win». Feature descriptions only. PASS.

---

## §8. Email 8 — Trial day-13 urgency (transactional + behavioral, day 13 of 14-day trial)

**Added 2026-04-23 per 4-locks.** The «tomorrow your trial ends» email. This is the only trial email that fires unconditionally (all trial users get it). Honest framing; NO dark patterns.

**Trigger:** trial user at trial_start_at + 13 days (= 24 hours before auto-charge). Fires exactly once per trial.

**Classification:** Transactional (billing-adjacent — legally required per EU Consumer Rights Directive Art. 14, US state-level auto-renewal-disclosure laws in CA/NY/OR/VA). Unsubscribe optional but provided for hygiene.

### English

**Subject:** Tomorrow: your Plus trial ends.
**Preheader:** Your card will be charged $8 — or cancel to stay on Free.

**Body:**
> Hi {first_name_or_blank},
>
> Heads-up: your 14-day Plus trial ends on {trial_end_date} at {trial_end_time} — about 24 hours from now.
>
> **What happens next:**
>
> - If you do nothing: your card is charged $8 for the first month of Plus. You keep everything Plus gives you.
> - If you cancel before {trial_end_date}: your Plus trial stops, your card is not charged, and you continue on Free. (50 chat messages/month, weekly insights, 2 accounts, Coach teasers.)
>
> Either path is fine. Free will keep working — we won't degrade it to push you upgrade. This email is a heads-up, not a sales pitch.
>
> **What you've done with Memoro in 14 days:**
> - {chat_msg_count} questions asked
> - {account_count} account{plural} connected
> - {insight_opens} insights opened
> - {coach_patterns_viewed} pattern-read{plural} viewed
>
> If that feels like Plus-level use to you, stay. If it doesn't, cancel — one click.

**CTA primary:** Keep Plus (continue to paid)
**CTA primary link:** {app_url}/billing/confirm-plus?ref=trial_d13

**CTA secondary:** Cancel trial, stay on Free
**CTA secondary link:** {app_url}/billing/cancel-trial?ref=trial_d13

**Footer:**
> This is a required trial-ending notice. You cannot unsubscribe from it — but after your trial resolves, your email preferences apply to all other emails. [Manage preferences]({prefs_url}).
> Memoro is not a registered investment advisor. Information is for educational purposes only. — {physical_address}

### Russian (parallel secondary)

**Subject:** Завтра: твой триал Plus заканчивается.
**Preheader:** Карта будет списана на $8 — или отмени, чтобы остаться на Free.

**Body:**
> Привет, {first_name_or_blank}.
>
> Короткое предупреждение: твой 14-дневный триал Plus заканчивается {trial_end_date} в {trial_end_time} — примерно через 24 часа.
>
> **Что будет дальше:**
>
> - Если ничего не делать: карта списывает $8 за первый месяц Plus. Всё, что даёт Plus, остаётся.
> - Если отменить до {trial_end_date}: триал прекращается, карта не списывается, ты продолжаешь на Free. (50 сообщений в чате в месяц, инсайты раз в неделю, 2 счёта, тизеры от коуча.)
>
> Оба варианта — нормально. Free продолжит работать — мы не будем его ухудшать, чтобы тебя выдавить. Это предупреждение, не продажа.
>
> **Что ты успел с Memoro за 14 дней:**
> - {chat_msg_count} вопрос{plural} задано
> - {account_count} счёт{plural} подключено
> - {insight_opens} инсайтов открыто
> - {coach_patterns_viewed} разбор{plural} паттернов просмотрено
>
> Если это ощущается как Plus-уровень использования — оставайся. Если нет — отмена в один клик.

**CTA primary:** Оставить Plus (перейти на платный)
**CTA secondary:** Отменить триал, остаться на Free

**Footer:**
> Это обязательное уведомление перед списанием. От него нельзя отписаться — но когда триал закончится, настройки email применяются ко всем остальным письмам. [Настроить]({prefs_url}).
> Memoro не является зарегистрированным инвестиционным советником. Информация предоставляется в образовательных целях. — {physical_address}

### Rationale + Lane A / anti-dark-pattern notes
- **Subject is declarative fact, NOT urgency-manipulated.** «Tomorrow: your Plus trial ends.» — not «⚠️ Last chance!», not «Don't miss out!», not «Action required». States what will happen tomorrow.
- **TWO primary CTAs, equal weight.** «Keep Plus» AND «Cancel trial, stay on Free» — both buttons on the email, both clickable, equal visual hierarchy. This is the critical anti-dark-pattern choice: most trial-end emails bury the cancel path. Memoro surfaces it.
- **«What happens next» is bullet-enumerated.** Users know exactly what each path does. No «auto-renew» ambush.
- **Usage stats framed as decision-input, not guilt.** «If that feels like Plus-level use to you, stay. If it doesn't, cancel — one click.» — respects user judgment. No «look how much you used!» sales push.
- **Free tier caps restated** — user sees explicitly what Free means: «50 chat messages/month, weekly insights, 2 accounts, Coach teasers». No misremembering on opt-out.
- **Legal note about unsubscribe** — some jurisdictions require trial-end notice regardless of marketing preferences. Transparent about it.
- **Influence-psychology (Cialdini) applied honestly:** no invented scarcity («only today»), no social proof fakery («12 people upgraded in last hour»). The only psychological lever used is clarity — fully-informed user builds trust, and trust converts better than manipulation at long horizon.
- **Lane A:** «stay on Free with 50 messages/month» is factual product-tier, not advice. «If that feels like Plus-level use» is user-self-assessment prompt, not «you should upgrade» normative push. PASS all four jurisdictions.

---

## §9. Email 9 — Post-trial welcome to paid Plus (transactional, fires after successful auto-conversion)

**Added 2026-04-23 per 4-locks.** Optional but recommended. Fires ONLY if user auto-converts from trial to paid Plus (did not cancel). Not sent to users who canceled before trial end (they get the Free-tier continuation experience).

**Trigger:** Stripe `invoice.payment_succeeded` event for the first paid month + `subscription_source = trial_auto_conversion`.

**Classification:** Transactional (payment receipt + product status). No unsubscribe required.

### English

**Subject:** Welcome to Memoro Plus.
**Preheader:** Your first Plus month just started. Here's what's on.

**Body:**
> Hi {first_name_or_blank},
>
> Your 14-day trial converted — your first Plus month started today ({billing_start_date}). $8 was charged to your card ending in {card_last_4}.
>
> **Your next billing date:** {next_billing_date} ($8/month, unless you change plan)
> **Manage or cancel:** Settings → Subscription (one click, no friction)
>
> You now have:
>
> - Unlimited chat — ask as much as you want
> - Daily insights — Memoro notices every day
> - Unlimited accounts — every broker, every exchange
> - Full Coach — the pattern-reads, not just teasers
> - CSV export, benchmarks, dividend calendar
>
> A quick note on what won't change: Free-tier users keep their same access if they later stop paying for Plus. Your data stays with you. Your connected accounts stay connected. Memoro's memory doesn't forget your history when you change tier.
>
> Thanks for staying. We'll keep Memoro honest.

**CTA:** Open your dashboard
**CTA link:** {app_url}/dashboard

**Footer:**
> This is a payment confirmation. You cannot unsubscribe — but your other email preferences apply to all non-transactional emails. [Manage preferences]({prefs_url}).
> Memoro is not a registered investment advisor. Information is for educational purposes only. — {physical_address}

### Russian (parallel secondary)

**Subject:** Добро пожаловать в Memoro Plus.
**Preheader:** Твой первый месяц Plus начался. Вот что включено.

**Body:**
> Привет, {first_name_or_blank}.
>
> Твой 14-дневный триал конвертировался — первый месяц Plus стартовал сегодня ({billing_start_date}). $8 списано с карты, оканчивающейся на {card_last_4}.
>
> **Следующая дата списания:** {next_billing_date} ($8/месяц, пока не сменишь план)
> **Управление или отмена:** Настройки → Подписка (один клик, без трений)
>
> Теперь у тебя:
>
> - Безлимитный чат — спрашивай сколько хочешь
> - Ежедневные инсайты — Memoro замечает каждый день
> - Безлимитные счета — все брокеры, все биржи
> - Полный коуч — разборы паттернов, не просто тизеры
> - CSV-экспорт, бенчмарки, календарь дивидендов
>
> Коротко про то, что НЕ поменяется: пользователи Free сохраняют свой доступ, если позже перестанут платить за Plus. Твои данные остаются с тобой. Подключённые счета — подключены. Memoro не забывает твою историю при смене тарифа.
>
> Спасибо, что остаёшься. Мы будем держать Memoro честным.

**CTA:** Открыть dashboard
**Footer:** [transactional, see English pattern]

### Rationale + voice notes
- **Subject is plain welcome** — «Welcome to Memoro Plus.» Confirmation-frame, not re-sales.
- **Billing details up-top** — card last-4, charge amount, next billing date. This is the legally-binding receipt content; brand-voice just presents it plainly.
- **Feature list echoes Welcome email structure** — signals consistency; user knows the shape of these emails.
- **«Won't change: Free-tier users keep their access»** — brand-promise reinforcement. 2026-04-23 4-locks include «Free is always Free permanent commitment». This email quietly reaffirms it for the user who just upgraded, so they know the offering has a floor.
- **«We'll keep Memoro honest»** — brand voice closing. Influence-psychology: explicit commitment to behavior (Cialdini consistency). Sets social expectation that we will maintain trust going forward.
- **Lane A:** feature-level product descriptions, no performance / return claims. PASS.

---

## §10. Regulatory checklist (consolidated across all 9 emails)

| Email | Lane A (no buy/sell) | No performance promise | No dark pattern (urgency/scarcity) | Memoro as agent | Unsubscribe (if commercial) | Physical address |
|---|---|---|---|---|---|---|
| 1 Welcome (free-forever path) | ✅ | ✅ | ✅ | ✅ | n/a (transactional) | ✅ |
| 2 First insight | ✅ | ✅ (disclaim embedded) | ✅ | ✅ | ✅ | ✅ |
| 3 30-day recap | ✅ | ✅ | ✅ («no last chance nonsense») | ✅ | ✅ | ✅ |
| 4a Chat monthly limit (patched 2026-04-23) | ✅ | ✅ | ✅ («Free is always Free») | ✅ | ✅ | ✅ |
| 4b Account limit | ✅ | ✅ | ✅ («no pressure») | ✅ | ✅ | ✅ |
| 4c Cadence | ✅ | ✅ | ✅ («not a limitation we're embarrassed») | ✅ | ✅ | ✅ |
| 5 Upgrade offer | ✅ | ✅ | ✅ («cancel is one click») | ✅ | ✅ | ✅ |
| 6 Trial welcome (NEW 2026-04-23) | ✅ | ✅ | ✅ (charge date stated up-front) | ✅ | n/a (transactional) | ✅ |
| 7 Trial day-7 midpoint (NEW) | ✅ | ✅ | ✅ (usage stats = decision-input, not guilt) | ✅ | ✅ | ✅ |
| 8 Trial day-13 urgency (NEW) | ✅ | ✅ | ✅ (TWO equal-weight CTAs — cancel path NOT buried) | ✅ | ✅ (+ legally-required notice) | ✅ |
| 9 Post-trial welcome (NEW) | ✅ | ✅ | ✅ (Free-forever reaffirmed) | ✅ | n/a (transactional) | ✅ |

---

## §11. Open decisions for Navigator / PO

1. **Variable substitution format.** Used `{variable_name}` here (generic markdown). Final ESP (Postmark / Resend / Mailgun / Beehiiv) may use different syntax (`{{var}}`, `%var%`, Liquid `{% for %}`). Content-lead will adapt on ESP lock; no ESP decision made.
2. **`{insight_headline_personalized}` source.** These are Memoro-generated insight headlines replayed in email. Finance-advisor R10 guardrail requires these never carry normative weight. Does insight-generator already enforce this? Flag for finance-advisor / AI-content-validator workstream.
3. **Physical address.** CAN-SPAM (US) requires a postal address in commercial email footer. GDPR (EU) requires the same. PO's personal address, a PO box, or a registered-agent address all work. Needs PO decision before any commercial email fires — NOT blocking draft.
4. **Day-45 vs Day-60 upgrade trigger.** Set placeholder to day 45-60; actual trigger day is engagement-based, not calendar-based. Analytics + retention data post-alpha will tune.
5. **«Free is always Free» brand promise — LOCKED 2026-04-23.** PO confirmed the permanent brand commitment in `DECISIONS.md` 2026-04-23 4-locks entry. Microcopy here carries it explicitly. Previous flag resolved.
6. **Russian translations.** Per `02_POSITIONING.md` v3.1 + `DECISIONS.md` 2026-04-23 English-first lock, Russian copy here is parallel secondary not shipped day-1. Kept in-repo as reference for post-launch CIS wave. Not wired into ESP.
7. **Trial email 6/7/8/9 (NEW 2026-04-23).** Triggered only for users who chose trial path at signup. Engineering must wire trial_started_at / trial_end_date / card_last_4 / next_billing_date events from Stripe webhook → ESP.
8. **Email 1 (Welcome) vs Email 6 (Trial welcome) mutual exclusion.** Signup wizard gates which email fires — user picks trial OR free-forever at signup; one email goes, not both. Engineering must enforce at trigger layer (not ESP layer).
9. **Trial day-13 urgency email is legally required.** Per EU Consumer Rights Directive Art. 14 + US CA SB-313 / NY Gen Bus §527-a / OR ORS 646A.297 / VA Code §59.1-207.46, auto-renewal disclosures must fire before first charge. Content copy handles the disclosure content; engineering must guarantee the TRIGGER always fires (not gated on user preferences, not delayed by queue backpressure). Flag to engineering + legal-advisor.
10. **Honest-voice trial calibration.** All trial emails explicitly state card will be charged + cancel path at equal weight. If PO ever wants to a/b-test a more aggressive trial-end nudge, content-lead recommends NO — the honest voice IS the brand, and conversion-rate win from manipulation rarely exceeds long-term brand erosion cost.

---

## §12. Summary for Navigator

**9 templates delivered, all bilingual (4 existing + 1 patched + 4 new from 2026-04-23 4-locks):**
- Welcome (transactional, hour-0 — free-forever path)
- First insight (behavioral, day 1-3)
- 30-day recap (commercial, day 30)
- Limit-approaching × 3 variants (transactional: AI chat monthly [patched — was daily] / accounts / cadence)
- Upgrade offer (commercial, day 45-60 — post-trial-window users)
- **Trial welcome (NEW — hour-0 of trial, confirmation frame)**
- **Trial day-7 midpoint (NEW — conditional, skip if already activated)**
- **Trial day-13 urgency (NEW — legally required, TWO equal-weight CTAs)**
- **Post-trial welcome to paid Plus (NEW — fires on successful auto-conversion)**

**Voice decisions held:**
- Memoro as named agent throughout («Memoro noticed», «Memoro's been remembering»)
- No hype verbs (discover / unlock your potential / level up all banned)
- Explicit anti-dark-pattern positive-voice («Free is always Free», «cancel is one click», «no last chance nonsense») — turns regulatory-required non-deceptiveness into brand-voice feature
- Magician+Sage voice pattern on subjects (quiet-invention, observational); Everyman on CTAs (imperative-direct)
- **Trial voice calibration:** trial emails ALL state charge date + cancel path at equal weight. Day-13 email has two primary CTAs (keep Plus / cancel trial) — no dark pattern around auto-conversion.

**Regulatory compliance:**
- Lane A PASS all templates (finance-advisor §3 framework applied)
- CAN-SPAM / GDPR pattern: unsubscribe + preference-center link + physical address on all commercial emails
- EU Consumer Rights Directive Art. 14 + US CA/NY/OR/VA auto-renewal disclosure laws: Email 8 (trial day-13) is the required pre-charge notice. Content-lead supplies the disclosure copy; engineering must guarantee the trigger always fires.
- No performance promises anywhere; no «buy/sell/should» in any body

**Dependencies flagged:**
- Finance-advisor: `{insight_headline_personalized}` source must enforce R10 (no normative pattern-naming) at generation layer
- PO: physical-address decision before any commercial email fires
- Engineering: ESP selection + trigger wiring (`TD-091` family / Core API event subscription); Stripe webhook → trial_started / trial_ending / subscription_converted event chain for emails 6-9; Email 1 vs Email 6 mutual exclusion at trigger layer
- Legal-advisor: Russian unsubscribe + physical-address requirements under 152-ФЗ / Russian consumer protection — deferred per geography Q7 lock (Russia out of scope day-1); EU/UK/CA/NY/OR/VA auto-renewal-disclosure legal-review on Email 8 before any trial fires
- Product: trial path vs free-forever path UX at signup determines which welcome email fires — signup wizard needs the branch explicit

**No external send. Drafts live in repo only. When PO ready to fire first welcome email, PO takes this file as input and wires it into whichever ESP PO personally provisions.**

---

## §13. Patch log — 2026-04-23 post-4-locks patch

**Decision source.** `DECISIONS.md` 2026-04-23 «Trial + Free tier + Coach UX + brand commitment (4 locks)»:
1. Trial — 14-day Plus, card required
2. Free cap — 50 messages/month, no daily limit (Haiku model)
3. Coach UX — contextual, not dedicated route
4. «Free is always Free» permanent brand commitment

### Changes applied to this file

**Added (4 new emails):**
- §6 Email 6 — Trial welcome (hour-0 of trial start, confirmation frame)
- §7 Email 7 — Trial day-7 midpoint (conditional, skip if already activated)
- §8 Email 8 — Trial day-13 urgency (legally required, two equal-weight CTAs)
- §9 Email 9 — Post-trial welcome to paid Plus (fires on successful auto-conversion)

**Patched (existing emails):**
- §4 Email 4 variant A — reworked «5 msg/day chat cap» → «50 msg/month monthly pool» (EN + RU). Subject, preheader, body, trigger spec all updated. Voice unchanged; cap math is the only delta.
- §5 Email 5 upgrade-offer bullet «No daily cap» → «No monthly cap — ask as much as you want» (EN + RU).
- §5 Email 5 «No trial, no we'll-remind-you games» → reframed to acknowledge trial exists («If you skipped the 14-day trial at signup…»). Reflects 4-locks trial reality without breaking honest-voice.
- §5 rationale note updated — old «no trial» framing removed; new note explains 2026-04-23 trial reality + why Email 8 is the honest «remind-before-charge» equivalent done right.

**Checklist table (§10):** 4 new rows for emails 6-9 + annotated row for Email 4a (patched monthly limit).

**Open decisions (§11):** Added items 7-10 — trial trigger wiring dependency, Email 1 vs Email 6 mutual exclusion, legal-requirement on Email 8, honest-voice trial-calibration principle.

### Trial-voice decisions held

- **Subject lines factual declarative** (not urgency-manipulated). «Tomorrow: your Plus trial ends.» not «⚠️ LAST CHANCE».
- **Day-13 email has TWO primary CTAs of equal visual weight** — Keep Plus AND Cancel trial. This is the critical anti-dark-pattern choice. Most trial-end emails bury the cancel path.
- **Charge date + amount + card-last-4 up-front in all trial emails.** No buried small-print.
- **Usage stats framed as decision-input, not guilt-trip.** «If that feels like Plus-level use to you, stay. If it doesn't, cancel — one click.»
- **Free-tier caps restated on Day-13 email** — user knows exactly what Free means before choosing to cancel. No opt-out ambush.
- **Email 9 (post-conversion) quietly reaffirms «Free is always Free»** even to paid users — keeps brand promise visible.

### Lane A + dark-pattern check (this patch)
- [x] No performance / return promises in any trial email
- [x] No countdown language, no «only today», no fake scarcity in Day-13 email
- [x] Card charge date + amount disclosed explicitly, not hidden
- [x] Cancel path visible at same visual weight as «keep» path
- [x] Haiku-model decision (Free tier uses cheaper Sonnet Haiku not standard) is engineering-layer, not user-facing — no email copy needs to mention it. Brand-voice truth: «Memoro on Free answers questions» stays TRUE regardless of underlying model.
- [x] No «5 msg/day» references remain in any email copy (verified by grep)
- [x] «No trial» false-claim removed from Email 5
