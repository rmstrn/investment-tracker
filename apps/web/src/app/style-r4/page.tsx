import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';

/**
 * `/style-r4` — «The Archivist's Study».
 *
 * Expressive / illustrated / character-led stance per `R4-expressive-illustrated.md`.
 * The page reads like the desk of a quiet, careful records-keeper: the upper-right
 * hero hosts a hand-drawn open-ledger illustration; below the fold a hard-bordered
 * vault card holds the actual numbers in JetBrains Mono. The two layers never touch.
 *
 * Hard rules wired:
 *   - All money numerals via `.r4-figure` (JetBrains Mono tabular,
 *     `--r4-ink` AAA 14.8:1 on paper, AAA 15.3:1 on vault).
 *   - Illustration is inline SVG only (no external kit). It sits upper-right
 *     of the hero and does NOT overlap or border the vault card.
 *   - AI surface is text-led: vault-coloured card, 1px hairline, byline in
 *     Inter Tight small caps, footnote markers `[1]` `[2]` linking to source.
 *   - No mascot. The «archivist» is a posture — we never see a face.
 *   - Disclosure strip in Inter (NOT Fraunces), 16px AAA on paper, includes
 *     [1][2] footnote text linked from the AI card.
 */

const HEADLINE = 'The careful records of a portfolio you actually own.';
const SUB =
  'One filed, dated record across every broker. Dividends counted. Drift noted. Nothing prescribed.';
const SECTION_LABEL = 'READ-ONLY · MULTI-BROKER · ENGLISH';

const VAULT_TITLE = 'Q1 2026 — what actually moved the number';
const VAULT_CAPTION = 'from your Schwab + IBKR';

const AI_BYLINE = 'PROVEDO · 2026-05-01 · 14:22 ET';

/**
 * Inline SVG vignette — the «archivist's hand» motif.
 *
 * A stylised open ledger book with hand-drawn jitter, viewed from above on a
 * desk corner. Includes:
 *   - the open book itself with sketched binding shadow (rust spot-colour)
 *   - column rules + a few JetBrains-Mono-style tabular figures on the page
 *   - a small bookmark ribbon (cobalt) and a coffee-ring stain (moss tint)
 *   - hand-drawn linework with `stroke-dasharray` jitter on key strokes
 *
 * No face, no mascot, no creature. The user IS the archivist.
 * Implemented inline so its style sits next to the page's voice — and so its
 * palette comes directly from the route tokens via `currentColor` and explicit
 * fills (we cannot use CSS variables inside SVG fill without inline style, so
 * we hardcode hexes here that match the theme tokens exactly).
 */
function ArchivistVignette() {
  // Token-aligned hex constants — these MUST match _lib/theme.css palette.
  const PAPER = '#F4EFE6';
  const INK = '#1B1A17';
  const INK_SOFT = '#4A463E';
  const VAULT = '#F8F4EB';
  const RUST = '#B8442A';
  const MOSS = '#3F6B47';
  const COBALT = '#2A3E78';

  return (
    <svg
      viewBox="0 0 600 480"
      role="img"
      aria-label="An open ledger book on a desk corner, with rust-coloured binding, cobalt bookmark ribbon, and three columns of monospaced figures penned in by hand."
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Desk shadow under the book (very soft, warm) ──────────────── */}
      <ellipse cx="320" cy="430" rx="240" ry="14" fill={INK} opacity="0.07" />

      {/* ── Book back-cover (rust, slightly off-register) ─────────────── */}
      <g transform="translate(60 90) rotate(-2)">
        <rect x="0" y="0" width="500" height="320" rx="3" fill={RUST} opacity="0.92" />
        {/* Hand-drawn highlight on the cover edge */}
        <path
          d="M 4 6 L 496 6"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          opacity="0.18"
          className="stroke-jitter"
        />
        {/* A tiny pressed-foil mark — pure decoration, no copy */}
        <rect x="40" y="36" width="38" height="6" fill={PAPER} opacity="0.55" rx="1" />
      </g>

      {/* ── Open pages (paper, with subtle two-page spread shadow) ────── */}
      <g transform="translate(72 78)">
        {/* Left page */}
        <rect x="0" y="0" width="232" height="316" fill={PAPER} stroke={INK} strokeWidth="1.2" />
        {/* Right page */}
        <rect x="232" y="0" width="232" height="316" fill={PAPER} stroke={INK} strokeWidth="1.2" />
        {/* Centre gutter shadow — hand-drawn taper */}
        <path
          d="M 232 4 Q 230 158 232 312"
          stroke={INK}
          strokeWidth="2.2"
          fill="none"
          opacity="0.32"
        />
        <path
          d="M 232 4 Q 234 158 232 312"
          stroke={INK_SOFT}
          strokeWidth="0.9"
          fill="none"
          opacity="0.5"
        />

        {/* ── LEFT PAGE — header line + column rules + figures ───────── */}
        {/* Header rule */}
        <line x1="20" y1="34" x2="212" y2="34" stroke={INK} strokeWidth="1" />
        {/* Header label — drawn as small ticks (we don't render real text
            in the SVG so the «archivist's hand» feel stays stable across
            zoom levels). */}
        <line x1="22" y1="22" x2="62" y2="22" stroke={INK} strokeWidth="2.4" />
        <line x1="68" y1="22" x2="86" y2="22" stroke={INK_SOFT} strokeWidth="1.4" />
        <line x1="92" y1="22" x2="118" y2="22" stroke={INK_SOFT} strokeWidth="1.4" />
        {/* Column rules */}
        <line
          x1="120"
          y1="34"
          x2="120"
          y2="296"
          stroke={INK_SOFT}
          strokeWidth="0.8"
          opacity="0.65"
        />
        <line
          x1="170"
          y1="34"
          x2="170"
          y2="296"
          stroke={INK_SOFT}
          strokeWidth="0.8"
          opacity="0.65"
        />

        {/* Row figures — drawn as ink dashes to read as «entries», not text.
            Static layout: each row is uniquely keyed by its baseline y so order
            never matters (biome/no-array-index-key compliant). */}
        {[56, 84, 112, 140, 168, 196, 224, 252].map((y, i) => {
          // Slight horizontal jitter per row for hand-drawn feel
          const j = (i % 3) - 1;
          return (
            <g key={`row-y-${y}`}>
              {/* ticker block */}
              <rect x={22 + j} y={y - 8} width={36 + (i % 4) * 4} height="3" fill={INK} />
              {/* qty block */}
              <rect x={126} y={y - 8} width={28 + (i % 3) * 4} height="3" fill={INK} />
              {/* amount block (slightly bolder — tabular feel) */}
              <rect x={176} y={y - 8} width={32 + (i % 5) * 3} height="3.5" fill={INK} />
            </g>
          );
        })}

        {/* ── RIGHT PAGE — a sketched monthly bar set + total rule ───── */}
        <line x1="252" y1="34" x2="444" y2="34" stroke={INK} strokeWidth="1" />
        <line x1="254" y1="22" x2="298" y2="22" stroke={INK} strokeWidth="2.4" />
        <line x1="304" y1="22" x2="332" y2="22" stroke={INK_SOFT} strokeWidth="1.4" />

        {/* Tiny bar chart sketched as if pencilled. Each bar keyed by its
            x-position (unique, stable, order-independent). */}
        {(() => {
          const bars = [42, 28, 56, 38, 70, 48, 62, 36];
          const baseX = 258;
          const baseY = 240;
          return bars.map((h, i) => {
            const x = baseX + i * 22;
            return (
              <g key={`bar-x-${x}`}>
                <rect x={x} y={baseY - h} width="14" height={h} fill={INK} opacity={0.85} />
                {/* Sketched edge highlight */}
                <line
                  x1={x}
                  y1={baseY - h}
                  x2={x + 14}
                  y2={baseY - h}
                  stroke={MOSS}
                  strokeWidth="1.4"
                  opacity={i % 3 === 0 ? 0.95 : 0}
                  className="stroke-jitter"
                />
              </g>
            );
          });
        })()}
        {/* Baseline rule with hand-drawn wobble */}
        <path d="M 254 244 Q 350 246 442 243" stroke={INK} strokeWidth="1.6" fill="none" />

        {/* Total line — small dashed «pencil» + a moss check */}
        <line
          x1="252"
          y1="270"
          x2="444"
          y2="270"
          stroke={INK}
          strokeWidth="0.8"
          strokeDasharray="3 3"
        />
        <rect x="318" y="278" width="76" height="4" fill={INK} />
        <path
          d="M 404 282 l 6 6 l 12 -16"
          stroke={MOSS}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* ── Bookmark ribbon (cobalt) draped over the right page top ───── */}
      <g transform="translate(420 60)">
        <path d="M 0 0 L 28 0 L 28 78 L 14 70 L 0 78 Z" fill={COBALT} />
        <path d="M 4 4 L 24 4" stroke="#FFFFFF" strokeWidth="1" opacity="0.25" />
      </g>

      {/* ── Coffee ring (moss tint, hand-drawn loop) ──────────────────── */}
      <g transform="translate(40 360)">
        <ellipse
          cx="36"
          cy="14"
          rx="36"
          ry="14"
          fill="none"
          stroke={MOSS}
          strokeWidth="2"
          opacity="0.55"
          strokeDasharray="3 5"
        />
        <ellipse
          cx="36"
          cy="14"
          rx="32"
          ry="11"
          fill="none"
          stroke={MOSS}
          strokeWidth="1.2"
          opacity="0.35"
        />
      </g>

      {/* ── Pencil resting on the desk corner ─────────────────────────── */}
      <g transform="translate(380 410) rotate(-18)">
        <rect x="0" y="0" width="160" height="8" fill={VAULT} stroke={INK} strokeWidth="1" />
        <polygon points="160,0 174,4 160,8" fill={INK_SOFT} />
        <rect x="0" y="0" width="22" height="8" fill={RUST} />
        {/* Eraser ferrule */}
        <line x1="22" y1="0" x2="22" y2="8" stroke={INK} strokeWidth="1" />
        <line x1="28" y1="0" x2="28" y2="8" stroke={INK} strokeWidth="0.8" />
      </g>

      {/* ── Tiny page-corner fold (top-right of right page) ───────────── */}
      <g transform="translate(516 78)">
        <polygon points="0,0 20,0 20,20" fill={PAPER} stroke={INK} strokeWidth="1" />
        <line x1="0" y1="0" x2="20" y2="20" stroke={INK_SOFT} strokeWidth="0.8" />
      </g>
    </svg>
  );
}

export default function StyleR4Page() {
  return (
    <div style={{ background: 'var(--r4-paper)', minHeight: '100vh' }}>
      {/* ─── Top nav ────────────────────────────────────────────────── */}
      <nav className="r4-nav" aria-label="Provedo top navigation">
        <span className="r4-nav__brand">
          <span className="r4-nav__brand-mark" aria-hidden />
          Provedo
        </span>
        <span className="r4-nav__links">
          <a className="r4-nav__link" href="#vault">
            Sample ledger
          </a>
          <a className="r4-nav__link" href="#disclosure">
            How it works
          </a>
          <a className="r4-nav__link" href="#sign-in">
            Sign in
          </a>
        </span>
      </nav>

      {/* ─── Hero zone — left copy + right illustration (NEVER touches data) ── */}
      <main
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: 'clamp(48px, 6vw, 96px) clamp(24px, 5vw, 56px) 0',
        }}
      >
        <div
          className="r4-hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 5fr)',
            gap: 'clamp(40px, 5vw, 80px)',
            alignItems: 'center',
          }}
        >
          {/* ─── Left: copy column ──────────────────────────────────── */}
          <div>
            <h1 className="r4-display">{HEADLINE}</h1>

            <p className="r4-sub">{SUB}</p>

            <div
              style={{
                marginTop: 36,
                display: 'flex',
                gap: 28,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <a href="#vault" className="r4-cta">
                See a sample ledger
                <span className="r4-cta__arrow" aria-hidden>
                  →
                </span>
              </a>
              <a href="#demo" className="r4-sublink">
                See a demo
              </a>
            </div>

            <p className="r4-label" style={{ marginTop: 'clamp(40px, 5vw, 56px)' }}>
              {SECTION_LABEL}
            </p>
          </div>

          {/* ─── Right: illustration spot (the «archivist's» vignette) ─ */}
          <div className="r4-illus" aria-hidden={false}>
            <ArchivistVignette />
          </div>
        </div>

        {/* ─── Below the fold: vault card ────────────────────────────── */}
        <section
          id="vault"
          style={{
            marginTop: 'clamp(72px, 10vw, 128px)',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: 'clamp(32px, 4vw, 56px)',
          }}
          aria-label="Sample ledger from Q1 2026"
        >
          <article className="r4-vault">
            <header>
              <p className="r4-label" style={{ marginBottom: 12 }}>
                ── PLATE I · A QUARTERLY READING ──
              </p>
              <h2 className="r4-vault__title">{VAULT_TITLE}</h2>
            </header>

            <table className="r4-ledger">
              <caption
                style={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: 'hidden',
                  clip: 'rect(0, 0, 0, 0)',
                  whiteSpace: 'nowrap',
                  border: 0,
                }}
              >
                Q1 2026 contribution breakdown
              </caption>
              <tbody>
                <tr className="r4-ledger__row">
                  <td className="r4-ledger__label">Stock selection</td>
                  <td className="r4-ledger__share">29%</td>
                  <td className="r4-ledger__amount">
                    <span className="r4-caret r4-caret--up" aria-hidden>
                      ▲
                    </span>
                    +$1,398.00
                  </td>
                </tr>
                <tr className="r4-ledger__row">
                  <td className="r4-ledger__label">FX (EUR / USD)</td>
                  <td className="r4-ledger__share">71%</td>
                  <td className="r4-ledger__amount">
                    <span className="r4-caret r4-caret--up" aria-hidden>
                      ▲
                    </span>
                    +$3,422.16
                  </td>
                </tr>
                <tr className="r4-ledger__row">
                  <td className="r4-ledger__label">Dividends received</td>
                  <td className="r4-ledger__share">—</td>
                  <td className="r4-ledger__amount">
                    <span className="r4-caret r4-caret--up" aria-hidden>
                      ▲
                    </span>
                    +$262.40
                  </td>
                </tr>
                <tr className="r4-ledger__row r4-ledger__row--total">
                  <td className="r4-ledger__label">Total Q1 gain</td>
                  <td className="r4-ledger__share">100%</td>
                  <td className="r4-ledger__amount">+$5,082.56</td>
                </tr>
              </tbody>
            </table>

            <div className="r4-vault__chart">
              <BarVisx payload={BAR_DRIFT_FIXTURE} width={760} height={280} />
            </div>

            <p className="r4-vault__caption">{VAULT_CAPTION}</p>
          </article>

          {/* ─── AI surface — vault-coloured, hairline, bylined, footnoted ── */}
          <article className="r4-ai" aria-label="A note from Provedo's archive">
            <span className="r4-ai__byline">
              <span className="r4-ai__byline-dot" aria-hidden />
              {AI_BYLINE}
            </span>
            <p className="r4-ai__body">
              A quarterly look. Of your{' '}
              <span className="r4-figure r4-figure--inline">$5,082.56</span> Q1 gain,{' '}
              <span className="r4-figure r4-figure--inline">$3,422.16</span> (71%) came from FX
              movement on your USD-denominated holdings.
              <a className="r4-ai__footnote" href="#fn-1" aria-label="Footnote 1">
                [1]
              </a>{' '}
              Stock selection contributed{' '}
              <span className="r4-figure r4-figure--inline">$1,398.00</span> across four positions;
              dividends added <span className="r4-figure r4-figure--inline">$262.40</span>.
              <a className="r4-ai__footnote" href="#fn-2" aria-label="Footnote 2">
                [2]
              </a>{' '}
              Nothing required your attention this quarter.
            </p>
          </article>
        </section>

        {/* ─── Disclosure strip — Inter, AAA, footnoted ──────────────── */}
        <footer
          id="disclosure"
          style={{
            marginTop: 'clamp(56px, 8vw, 96px)',
            paddingTop: 32,
            borderTop: '1px solid rgba(27, 26, 23, 0.18)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 32,
            }}
          >
            <p className="r4-disclosure" id="fn-1">
              <span className="r4-disclosure__marker">1</span>
              FX figures sourced from your broker's posted close on each trade date. Provedo holds
              read-only credentials; we never execute trades and never touch your assets.
            </p>
            <p className="r4-disclosure" id="fn-2">
              <span className="r4-disclosure__marker">2</span>
              Method: USD/EUR contribution computed against your reported cost-basis in account
              currency. Verify against your broker statement of record before filing.
            </p>
            <p className="r4-disclosure">
              <span className="r4-disclosure__marker">3</span>
              Provedo does not provide investment advice. Observational notes only. Past performance
              is not indicative of future results.
            </p>
          </div>
        </footer>
      </main>

      {/* ─── Foot strip — quiet bookplate ──────────────────────────────── */}
      <div className="r4-foot">
        <span>Provedo · the archivist's study · est. 2026</span>
        <span>REG · PRV-2026-R4-α</span>
      </div>
    </div>
  );
}
