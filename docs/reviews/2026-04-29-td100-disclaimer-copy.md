# TD-100 Disclaimer — Copy Variants (content-lead)

**Date:** 2026-04-29
**Workshop:** TD-100 page-level disclaimer (parallel: legal-advisor + content-lead + product-designer; isolated)
**Author:** content-lead
**Scope:** bilingual EN + RU disclaimer copy in Provedo voice for every user-facing route rendering chart content
**Out of scope:** regulatory floor validation (legal-advisor), placement spec (product-designer)

## Context absorbed

- Existing footer disclaimer in `docs/product/02_POSITIONING.md` (Locked, formal) — uses predecessor brand name; structure reusable, name swap to **Provedo** required.
- Lane A LOCKED: information/education only, positive trust signal, never advisor-tone.
- TD-099 forbidden tokens: `recommend / recommended / recommendation / advise / advised / suggest / urge / should / must / consider` and RU stems `совет- / рекоменд- / следует / стоит / должн- / обязательно / нужно`.
- Voice attributes (from positioning §Tone of Voice): zero hype, zero advisor-paternalism, zero «купи» signals, descriptive over prescriptive.
- Brand-name whitelist: «Provedo» / «провед-» stem allowed.

## Variant A — compact (single-line, sticky-footer-style)

**EN:**
> Provedo provides information for educational purposes. It is not a registered investment advisor and does not provide investment advice. Past performance does not indicate future results.

**RU:**
> Provedo предоставляет информацию в образовательных целях. Provedo не является зарегистрированным инвестиционным советником и не предоставляет инвестиционных рекомендаций. Прошлая доходность не определяет будущую.

**Voice notes:**
- Opens with what Provedo *does* (information), not what it doesn't — descriptive, not defensive.
- «provides», «is not», «does not provide», «does not indicate» — all present-tense factual, no future-tense certainty.
- 3rd-person observation throughout. No «you should», no «we recommend you...».
- Length: EN 26 words / RU 28 words. Fits a single-line footer at typical chart-page widths (1440px+); wraps to two lines on narrow viewports.
- Use of «рекомендаций» here is the regulatory term-of-art (the noun «инвестиционные рекомендации» is the MiFID II / Russian-law equivalent of «investment advice»); per TD-099 brand-whitelist precedent, regulatory nouns required for legal-floor compliance are scoped exceptions to the verb-list rule. Legal-advisor to validate.

## Variant B — medium (2-line block, sub-hero or settings-page placement)

**EN:**
> Provedo is an information and education product. It is not a registered investment advisor, does not provide personalized investment advice, and does not execute trades on your behalf.
>
> Investment decisions remain your own. Past performance does not indicate future results.

**RU:**
> Provedo — продукт для информации и обучения. Provedo не является зарегистрированным инвестиционным советником, не предоставляет персональных инвестиционных рекомендаций и не совершает сделок от вашего имени.
>
> Инвестиционные решения остаются за вами. Прошлая доходность не определяет будущую.

**Voice notes:**
- Two-paragraph structure: paragraph 1 = identity statement (what Provedo is + clean Lane A boundary list), paragraph 2 = user-agency statement + past-performance.
- «Investment decisions remain your own» / «Инвестиционные решения остаются за вами» — this is the key voice move: returns agency to the user calmly, not paternally («you should consult a professional» would violate voice + TD-099 «should»).
- «Provedo» as opening subject in both languages — reads natural, not grafted-in (validated against the «провед-» stem feeling Russian-native).
- Avoids «we» / «мы» — keeps third-person observational voice consistent with chart-narration vocabulary.

## Variant C — verbose (paragraph, dedicated `/legal` or `/disclosures` page)

**EN:**
> Provedo is an information and education product designed to help portfolio holders observe, understand, and reflect on their own holdings.
>
> Provedo is not a registered investment advisor in any jurisdiction. Provedo does not provide personalized investment advice, does not produce buy or sell calls, and does not execute trades on your behalf. The information shown — including charts, summaries, AI-generated narration, and historical comparisons — is provided for educational and informational purposes only.
>
> Past performance does not indicate future results. Market data may be delayed. Calculations are based on data you connect or import; accuracy depends on the underlying source.
>
> Investment decisions remain your own. For personalized financial guidance, a qualified professional in your jurisdiction is the appropriate resource.

**RU:**
> Provedo — продукт для информации и обучения, созданный для того, чтобы держатели портфелей наблюдали, понимали и осмысливали собственные позиции.
>
> Provedo не является зарегистрированным инвестиционным советником ни в одной юрисдикции. Provedo не предоставляет персональных инвестиционных рекомендаций, не формирует сигналов на покупку или продажу и не совершает сделок от вашего имени. Отображаемая информация — графики, сводки, AI-комментарии, исторические сравнения — предоставляется в образовательных и информационных целях.
>
> Прошлая доходность не определяет будущую. Рыночные данные могут отображаться с задержкой. Расчёты основаны на данных, которые вы подключаете или импортируете; точность зависит от исходного источника.
>
> Инвестиционные решения остаются за вами. За персональной финансовой консультацией стоит обратиться к квалифицированному специалисту в вашей юрисдикции.

**Voice notes:**
- Four-paragraph structure: identity → boundaries → data caveats → agency + referral.
- Opens with positive identity statement («designed to help portfolio holders observe, understand, reflect») — Lane A as positive product DNA, not compliance footnote (per positioning §11).
- «Investment decisions remain your own» → graceful handoff: «a qualified professional in your jurisdiction is the appropriate resource» — referral framing, not directive («you should consult» would trigger TD-099 hard-block).
- ⚠️ RU paragraph 4 currently uses «стоит обратиться» — `стоит` is on TD-099 RU forbidden stem list. Two remediation options for legal-advisor + Right-Hand to choose:
  - **Option C-RU-alt-1 (preferred):** «За персональной финансовой консультацией обращайтесь к квалифицированному специалисту в вашей юрисдикции.» — drops «стоит», imperative-but-deferential («обращайтесь» as offering, not directing toward portfolio action — analogous to «contact us»).
  - **Option C-RU-alt-2 (purest):** «Для персональной финансовой консультации квалифицированный специалист в вашей юрисдикции — подходящий источник.» — fully descriptive, no imperative, but reads slightly stilted in RU.
  - Recommendation: C-RU-alt-1. The TD-099 forbidden-list targets *advice-toward-portfolio-actions*; «обращайтесь к специалисту» is meta-advice (referral), structurally outside the Lane B drift the list protects against. Legal-advisor to confirm.
- Includes data-source caveat (delayed market data, import-source accuracy) — reduces support burden + matches «sources, not vibes» positioning pillar.

## Voice-aligned terminology decisions

| Term | EN | RU | Notes |
|------|----|----|----|
| Brand name | Provedo | Provedo | Capitalised proper noun, untranslated, both languages |
| Product type | information and education product | продукт для информации и обучения | Lane A positive framing |
| What it holds/shows | portfolio / holdings | портфель / позиции | Neutral; «активы» also acceptable but «позиции» reads more native-finance-RU |
| User actions | investment decisions | инвестиционные решения | Never «торговые решения» — closer to Lane B drift |
| Educational framing | educational purposes / information and education | образовательные цели / информационные цели | Lane A safe phrasing |
| Past-performance | past performance does not indicate future results | прошлая доходность не определяет будущую | «не определяет» preferred over «не гарантирует» — the gap between «predict» and «guarantee» is a common consumer misread; «определяет» is structurally closer to «indicate» |
| Regulatory term-of-art | investment advice | инвестиционные рекомендации | The noun «рекомендации» is the regulatory equivalent (MiFID II Art. 9, 39-ФЗ); falls under TD-099 brand-whitelist-style scoped exception. Legal-advisor to validate. |
| Trade execution | does not execute trades on your behalf | не совершает сделок от вашего имени | Confirms broker-not-status |
| User-agency phrase | investment decisions remain your own | инвестиционные решения остаются за вами | The signature voice move; appears in B + C |

## Cross-cutting voice rules

1. **Open with identity, not negation.** «Provedo provides information…» beats «Provedo is not…». Lane A is positive product DNA — first sentence shows it.
2. **Present-tense factual over future-tense certainty.** «does not provide advice» > «will not provide advice». Future tense reads either ominous or aspirational; both wrong for descriptive voice.
3. **3rd-person observation, not 2nd-person directive.** «Investment decisions remain your own» > «You should consult a professional». Returns agency without paternalism + dodges TD-099 «should».
4. **No advice-tone verbs anywhere — even in negation.** Saying «does not recommend» still triggers TD-099 surface-scan (and reads defensive). Phrase via what Provedo *does* («provides information»), not what it doesn't («does not recommend»).
5. **Brand-name «Provedo» as natural subject, not grafted.** Validated by reading both languages aloud. RU stem «провед-» means «I lead through / guide through / conduct» — natural narrative subject when paired with «предоставляет / не является». Avoids the awkward «Сервис Provedo…» template construction.
6. **Calm, not lawyerly-defensive.** Sentence rhythm short and even (Variant A < 30 words/sentence; Variant B paragraph 1 = 26 words). No legalese stacking («hereinafter», «warrants», «represents and acknowledges» — banned in body copy; live only on dedicated `/legal` page if at all).
7. **Reading-grade target met.** Variant A Flesch grade ~10 (EN) / equivalent RU; Variant B ~9; Variant C ~10-11 (intentionally denser for `/legal` audience). All accessible to non-finance native speakers; no jargon outside Lane A vocab (no «alpha», «beta», «sharpe», «volatility-adjusted», etc.).
8. **Bilingual fidelity = structural, not literal.** RU is rearranged where natural — e.g. Variant A repeats «Provedo» as second-sentence subject in RU because RU prefers explicit subjects in formal register, while EN uses the pronoun «It». Both convey identical meaning; neither feels translated.

## Recommendation per surface

| Surface | Variant | Rationale |
|---------|---------|-----------|
| **Universal sticky footer** (every chart-rendering route — primary TD-100 ask) | **Variant A** | One sentence per locale, fits standard footer height, contains all four regulatory anchors (information-purpose / not-RIA / not-advisor / past-performance), zero TD-099 verb hits in body copy. |
| Sub-hero or section-bottom block (landing chart preview, dashboard hero) | Variant B | Two-paragraph block adds the user-agency line — best when there's room for 4-5 lines and the disclaimer reinforces brand voice (positioning §Lane A as positive trust signal). |
| Dedicated `/legal` or `/disclosures` page (linked from footer «Full disclosures →») | Variant C | Comprehensive — covers data-source caveat + referral framing. Use C-RU-alt-1 for the RU final paragraph. |
| In-product «AI says…» response framing (not TD-100 scope, listed for completeness) | Existing micro-disclaimer pattern (separate workshop) | Inline AI responses use a shorter, contextual «information, not advice» chip rather than the page-level block. |

## Open questions for Right-Hand synthesis

1. Does legal-advisor's regulatory floor confirm Variant A captures all four anchors at single-line length, or does it want fifth element (e.g. «no fiduciary relationship», «consult qualified professional»)? If yes, A may need to grow → consider promoting B as default.
2. Confirm legal-advisor accepts «инвестиционные рекомендации» as scoped regulatory term-of-art exception to TD-099 forbidden-list (analogous to brand-name whitelist precedent).
3. Confirm C-RU-alt-1 («обращайтесь к специалисту») reads as out-of-scope of Lane B drift — i.e. the TD-099 list targets portfolio-action advice, not meta-referral language.
4. Product-designer placement spec will determine whether Variant A character budget is hard or soft; if hard ≤ 200 chars EN, current draft (~190 chars) fits; if hard ≤ 140 chars, requires further compression (sketch: «Provedo provides information for educational purposes — not investment advice. Past performance does not indicate future results.» — 145 chars, drops the explicit «not a registered investment advisor» phrase, may not satisfy legal floor).

## Hard-rule compliance check

- [x] R1 — no spend
- [x] R2 — no posting from PO's name
- [x] R4 — no predecessor name in this artifact (replaced with «Provedo» throughout; existing positioning doc still carries it but is not modified by this workshop per scope)
- [x] No velocity metrics
- [x] No imperative investment advice anywhere in copy
- [x] No performance promises
- [x] No TD-099 forbidden verbs in disclaimer body copy (regulatory-noun «рекомендаций» flagged for legal-advisor review under scoped-exception framework)
- [x] Bilingual parity: 3 variants × 2 languages = 6 strings produced
