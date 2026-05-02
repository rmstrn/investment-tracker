/**
 * RegulatoryDisclaimer — copy constants.
 *
 * Source-of-truth: `docs/reviews/2026-04-29-td100-disclaimer-synthesis.md`
 * §«Final copy text — synthesised from content-lead + legal».
 *
 * Two variants × two languages = 4 strings.
 *
 * - Compact (Variant B medium): persistent footer in `(app)` layout. Carries
 *   the cross-market floor — top-3 critical legal statements + EU/UK explicit
 *   «not personalized» phrasing + escape-hatch link to `/legal/disclaimer`.
 * - Verbose (Variant C): full `/legal/disclaimer` page. Renders all 7 legal
 *   floor statements (§1.1–§1.7) as paragraph-by-paragraph copy.
 *
 * Vocabulary discipline:
 * - Uses «инвестиционные советы» rather than «инвестиционные рекомендации» —
 *   both are regulatorily-accurate; «советы» avoids the TD-099 forbidden stem
 *   `рекоменд-`. Term-of-art valid under MiFID II Art. 4(1)(4) + 39-ФЗ.
 * - Uses «обращайтесь» rather than «стоит обратиться» — `стоит` is a TD-099
 *   tier-2 hit.
 * - The token «совет/советы/советник» appears solely as the regulatory
 *   term-of-art for «adviser / advice». This is the documented legitimate
 *   exception (synthesis §Acceptance criteria item 9).
 *
 * Pre-alpha note: copy needs licensed-attorney sign-off before any public
 * route exposes user-facing chart content. Tracked as TD-106.
 */

export type Lang = 'en' | 'ru';
export type Variant = 'compact' | 'verbose';

export interface CompactCopy {
  body: string;
  /** Trailing link label — placed after `body`. */
  linkLabel: string;
  /** Accessible label for the disclaimer landmark. */
  ariaLabel: string;
}

export interface VerboseCopy {
  /** Page heading rendered above the paragraphs. */
  heading: string;
  /** Sequential paragraphs §1.1–§1.7 from the legal floor. */
  paragraphs: ReadonlyArray<string>;
  /** Accessible label for the disclaimer landmark. */
  ariaLabel: string;
}

const COMPACT_EN: CompactCopy = {
  body: 'Provedo provides information, not investment advice. Past performance does not guarantee future results. Investment decisions remain yours.',
  linkLabel: 'Read full disclaimer',
  ariaLabel: 'Lane A regulatory disclaimer',
};

const COMPACT_RU: CompactCopy = {
  body: 'Provedo предоставляет информацию, не инвестиционные советы. Прошлая доходность не гарантирует будущую. Инвестиционные решения остаются за вами.',
  linkLabel: 'Полный текст',
  ariaLabel: 'Регуляторный дисклеймер Lane A',
};

const VERBOSE_EN: VerboseCopy = {
  heading: 'Disclaimer',
  paragraphs: [
    'Provedo is not a registered investment adviser. The information presented is for educational and informational purposes only.',
    'Provedo does not provide personalized recommendations or investment advice tailored to your specific situation, objectives, or risk tolerance.',
    'Past performance does not guarantee future results. Charts and figures shown describe historical or current state of your connected accounts; they do not predict future outcomes.',
    "Provedo does not execute trades, hold custody of your assets, or move money between accounts. All trading and account-management actions are performed by you on your broker's platform.",
    'Account data is sourced from connected aggregators (Plaid, SnapTrade) and synchronized periodically. It may not reflect real-time prices or pending transactions. Verify with your broker before acting on any figure shown here.',
    'For decisions affecting your financial situation, consult a licensed professional appropriate to your jurisdiction.',
  ],
  ariaLabel: 'Lane A regulatory disclaimer — full text',
};

const VERBOSE_RU: VerboseCopy = {
  heading: 'Дисклеймер',
  paragraphs: [
    'Provedo не является зарегистрированным инвестиционным советником. Представленная информация предназначена для образовательных и информационных целей.',
    'Provedo не предоставляет персональных рекомендаций или инвестиционных советов, учитывающих вашу конкретную ситуацию, цели или толерантность к риску.',
    'Прошлая доходность не гарантирует будущую. Показанные графики и цифры описывают историческое или текущее состояние ваших подключённых счетов; они не предсказывают будущие результаты.',
    'Provedo не исполняет сделки, не хранит активы и не переводит деньги между счетами. Все торговые операции и управление счётом вы выполняете на платформе вашего брокера.',
    'Данные счетов поступают из подключённых агрегаторов (Plaid, SnapTrade) и синхронизируются периодически. Они могут не отражать актуальные цены или незавершённые транзакции. Проверьте у вашего брокера перед действием на основе любой цифры здесь.',
    'Для решений, влияющих на ваше финансовое положение, обращайтесь к лицензированному специалисту в вашей юрисдикции.',
  ],
  ariaLabel: 'Регуляторный дисклеймер Lane A — полный текст',
};

export const COMPACT_COPY: Readonly<Record<Lang, CompactCopy>> = {
  en: COMPACT_EN,
  ru: COMPACT_RU,
};

export const VERBOSE_COPY: Readonly<Record<Lang, VerboseCopy>> = {
  en: VERBOSE_EN,
  ru: VERBOSE_RU,
};

/** Path the compact «Read full disclaimer →» link points at. */
export const FULL_DISCLAIMER_PATH = '/legal/disclaimer';
