import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';

/**
 * `/style-r5` — «Atelier».
 *
 * Modern luxe / sculpted / aspirational stance per `R5-modern-luxe.md`. The page
 * reads like a private wealth dossier: massive top-padding before content, an
 * asymmetric two-column hero (headline left, AI sample card right with a -32px
 * baseline offset), and only two real visual objects on a paper canvas.
 *
 * Hard rules wired:
 *   - All money numerals via `.r5-figure` (Inter tabular, `--r5-ink` AAA 15.8:1
 *     on canvas, AAA 16.4:1 on surface). NEVER Fraunces. NEVER brass.
 *   - Brass appears exactly twice in the first viewport: CTA fill + AI byline
 *     dot. Nothing else.
 *   - Cards holding money objects get BOTH 1px hairline border AND elev-1
 *     shadow (per spec §5 — hairline carries the edge in light, shadow carries
 *     it on the page).
 *   - No glassmorphism. No gradients on surfaces. Single allowed gradient is
 *     the 4% warm-to-cool wash on the page background (in theme.css).
 *   - Lane-A disclosure shipped as a 14px eyebrow at hero-bottom (above the
 *     fold), not buried in a footer.
 *   - BarVisx series colors stay neutral (`--r5-ink` / `--r5-ink-mute`); up/down
 *     semantics live as endpoint dots, never as bar fills (we let the chart's
 *     default neutral palette stand and only annotate the figure above with
 *     caret + delta).
 */

const HEADLINE = 'A quiet, considered place to hold your money.';
const SUB = 'Every position, every dividend, in one calm dossier across your brokers.';

const AI_DATE = '29 Apr 2026 · 14:02';
const AI_SOURCES = 'Sources: 3 positions · FX rates: ECB daily · period 01 Jan – 31 Mar 2026';

const SECTION_TITLE = 'Q1 — what moved the number.';
const SECTION_CAPTION = 'AS OF 01 MAY 2026 · 09:14 ET';

const CHART_LEDE = 'TOTAL Q1 GAIN';
const CHART_FIGURE = '+$5,082.56';
const CHART_DELTA_LABEL = 'vs. Q4 2025';
const CHART_DELTA_AMOUNT = '+$1,287.40';
const CHART_CAPTION_LEFT = 'Schwab · IBKR — read-only feeds';
const CHART_CAPTION_RIGHT = 'PLATE I · 5D';

const LANE_A_DISCLOSURE = 'Read-only · multi-broker · no trading, no advice.';

export default function StyleR5Page() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ─── Top nav ────────────────────────────────────────────────── */}
      <nav className="r5-nav" aria-label="Provedo top navigation">
        <a className="r5-nav__brand" href="#top">
          Provedo
        </a>
        <span className="r5-nav__links">
          <a className="r5-nav__link" href="#positions">
            Positions
          </a>
          <a className="r5-nav__link" href="#insights">
            Insights
          </a>
          <a className="r5-nav__link" href="#pricing">
            Pricing
          </a>
          <a className="r5-nav__link" href="#sign-in">
            Sign in
          </a>
        </span>
      </nav>

      {/* ─── Hero — asymmetric two-column with sculpted offset ──────── */}
      <main id="top" className="r5-hero">
        <div className="r5-hero-grid">
          {/* ─── Left: headline column (~720px) ───────────────────── */}
          <div>
            <h1 className="r5-display">{HEADLINE}</h1>
            <p className="r5-sub">{SUB}</p>

            <div className="r5-cta-row">
              <a href="#request-access" className="r5-cta">
                Request access
              </a>
              <a href="#how-it-works" className="r5-sublink">
                learn how it works
                <span className="r5-sublink__arrow" aria-hidden>
                  ↗
                </span>
              </a>
            </div>

            {/* Lane-A disclosure as an above-the-fold design element. */}
            <p className="r5-eyebrow">{LANE_A_DISCLOSURE}</p>
          </div>

          {/* ─── Right: AI sample card (~480px), -32px baseline offset ── */}
          <aside className="r5-hero-grid__right" aria-label="A sample insight from Provedo's AI">
            <article className="r5-ai">
              <header className="r5-ai__meta">
                <span className="r5-ai__meta-left">
                  <span className="r5-ai__byline-dot" aria-hidden />
                  <span className="r5-ai__byline-text">ai</span>
                  <span className="r5-ai__date">· {AI_DATE}</span>
                </span>
                <a className="r5-ai__pill" href="#method">
                  non-prescriptive ↗
                </a>
              </header>

              <p className="r5-ai__body">
                Your Q1 outperformance was <span className="r5-figure r5-figure--inline">71%</span>{' '}
                currency, <span className="r5-figure r5-figure--inline">29%</span> selection.
                EUR-positions gained <span className="r5-figure r5-figure--inline">4.2%</span> from
                EUR/USD; the same holdings in USD terms were{' '}
                <span className="r5-figure r5-figure--inline">+1.6%</span>.
              </p>

              <p className="r5-ai__sources">{AI_SOURCES}</p>
            </article>
          </aside>
        </div>
      </main>

      {/* ─── Below the hero: chart panel (sculpted surface, same vocabulary) ── */}
      <section id="insights" className="r5-section" aria-label="Quarterly performance breakdown">
        <header className="r5-section__head">
          <h2 className="r5-section__title">{SECTION_TITLE}</h2>
          <p className="r5-section__caption">{SECTION_CAPTION}</p>
        </header>

        <article className="r5-chart">
          <div className="r5-chart__top">
            <div>
              <p className="r5-chart__lede">{CHART_LEDE}</p>
              {/* Money figure — Inter tabular, --r5-ink AAA. Never Fraunces, never brass. */}
              <p className="r5-chart__hero-figure">
                <span className="r5-figure r5-figure--display">{CHART_FIGURE}</span>
              </p>
            </div>
            <p className="r5-chart__delta">
              <span className="r5-caret r5-caret--up" aria-hidden>
                ▲
              </span>
              <span className="r5-chart__delta-amount">{CHART_DELTA_AMOUNT}</span>
              <span>· {CHART_DELTA_LABEL}</span>
            </p>
          </div>

          <div className="r5-chart__well">
            <BarVisx payload={BAR_DRIFT_FIXTURE} width={920} height={300} />
          </div>

          <p className="r5-chart__caption">
            <span>{CHART_CAPTION_LEFT}</span>
            <span>{CHART_CAPTION_RIGHT}</span>
          </p>
        </article>
      </section>

      {/* ─── Disclosure / regulatory strip — Inter, AAA on canvas ──── */}
      <section className="r5-disclosure" id="how-it-works" aria-label="Disclosures and method">
        <div className="r5-disclosure__grid">
          <div>
            <span className="r5-disclosure__label">Method</span>
            <p className="r5-disclosure__copy">
              Provedo connects read-only to your brokers. We compute period contribution against
              your reported cost-basis in account currency. Verify against your broker statement of
              record before filing.
            </p>
          </div>
          <div>
            <span className="r5-disclosure__label">Lane</span>
            <p className="r5-disclosure__copy">
              We hold read-only credentials only. We never execute trades and never custody your
              assets. Provedo does not provide investment advice — observational notes only.
            </p>
          </div>
          <div>
            <span className="r5-disclosure__label">Sources</span>
            <p className="r5-disclosure__copy">
              FX figures sourced from ECB daily reference rates. Position values reconciled to your
              broker's posted close on each trade date. Past performance is not indicative of future
              results.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Foot strip — quiet bookplate ──────────────────────────── */}
      <div className="r5-foot">
        <span>Provedo · Atelier · est. 2026</span>
        <span>REG · PRV-2026-R5-α</span>
      </div>
    </div>
  );
}
