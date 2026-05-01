import { DsCallout, DsRow, DsSection } from '../_components/DsSection';

/**
 * §Typography — Geist Sans + Geist Mono specimen for D1 «Lime Cabin».
 *
 * Single-family bet (no display serif): Geist Sans for display + UI body
 * (400/500/600), Geist Mono for ALL numerals (KPI / delta / timestamp /
 * kbd / tickers / metadata) at 400/500.
 *
 * Every numeric specimen below is rendered with
 * `font-feature-settings: "tnum" 1, "ss01" 1` (route default — the
 * before/after demo at the bottom proves it).
 */

interface SpecimenRow {
  readonly label: string;
  readonly note: string;
  readonly sample: string;
  readonly style: React.CSSProperties;
}

const SPECIMENS: ReadonlyArray<SpecimenRow> = [
  {
    label: 'Display 56 (Sans 600)',
    note: 'KPI dominant numeral after fix #4 — portfolio value clamp 48-56px',
    sample: '$847,290',
    style: {
      fontFamily: 'var(--d1-font-mono)',
      fontWeight: 500,
      fontSize: 56,
      letterSpacing: '-0.01em',
      color: 'var(--d1-text-primary)',
    },
  },
  {
    label: 'KPI numeral 48 (Mono 500)',
    note: 'Default KPI portfolio numeral at desktop low end',
    sample: '$3,200',
    style: {
      fontFamily: 'var(--d1-font-mono)',
      fontWeight: 500,
      fontSize: 48,
      letterSpacing: '-0.01em',
      color: 'var(--d1-text-primary)',
    },
  },
  {
    label: 'KPI numeral 32 (Mono 500)',
    note: 'Secondary KPI cards — dividends YTD, drift percentage',
    sample: '12.0%',
    style: {
      fontFamily: 'var(--d1-font-mono)',
      fontWeight: 500,
      fontSize: 32,
      letterSpacing: '-0.01em',
      color: 'var(--d1-text-primary)',
    },
  },
  {
    label: 'Headline 36 (Sans 600)',
    note: 'Marketing strip headline — page title or section opener',
    sample: 'Notice what you’d miss.',
    style: {
      fontFamily: 'var(--d1-font-sans)',
      fontWeight: 600,
      fontSize: 36,
      letterSpacing: '-0.02em',
      color: 'var(--d1-text-primary)',
    },
  },
  {
    label: 'Body 16 (Sans 400)',
    note: 'Lane-A regulatory disclosure floor (per spec §0)',
    sample: 'Read-only across every broker. Dividends dated. Drift noted.',
    style: {
      fontFamily: 'var(--d1-font-sans)',
      fontWeight: 400,
      fontSize: 16,
      lineHeight: 1.55,
      color: 'var(--d1-text-muted)',
    },
  },
  {
    label: 'Body 15 (Sans 400)',
    note: 'AI-insight body — the editorial register inside Record Rail entries',
    sample: 'Q1 win was 71% FX tailwind, not stock-picking.',
    style: {
      fontFamily: 'var(--d1-font-sans)',
      fontWeight: 400,
      fontSize: 15,
      lineHeight: 1.5,
      color: 'var(--d1-text-primary)',
    },
  },
  {
    label: 'Label 14 (Sans 500)',
    note: 'KPI labels and primary copy that carries semantic intent',
    sample: 'Portfolio value',
    style: {
      fontFamily: 'var(--d1-font-sans)',
      fontWeight: 500,
      fontSize: 14,
      color: 'var(--d1-text-muted)',
    },
  },
  {
    label: 'Delta 13 (Mono 400)',
    note: 'KPI delta line; renders Mono so signed numerals align tabularly',
    sample: '+12.4% MTD',
    style: {
      fontFamily: 'var(--d1-font-mono)',
      fontWeight: 400,
      fontSize: 13,
      color: 'var(--d1-text-muted)',
    },
  },
  {
    label: 'Chip 13 (Sans 500)',
    note: 'Filter chips, segmented controls, nav pills',
    sample: 'Holdings · Income · Drift',
    style: {
      fontFamily: 'var(--d1-font-sans)',
      fontWeight: 500,
      fontSize: 13,
      color: 'var(--d1-text-primary)',
    },
  },
  {
    label: 'Timestamp 11 (Mono 500 uppercase)',
    note: 'Record Rail datestamp — `MAY 01 · 09:14`, tracking 0.04em',
    sample: 'MAY 01 · 09:14',
    style: {
      fontFamily: 'var(--d1-font-mono)',
      fontWeight: 500,
      fontSize: 11,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: 'var(--d1-text-muted)',
    },
  },
];

const NUMERIC_DEMO = '0123456789';
const MONEY_DEMO = '$1,234,567.89';
const DELTA_DEMO = '+12.4% / -3.7%';

const featuresStyleOff: React.CSSProperties = {
  fontFamily: 'var(--d1-font-mono)',
  fontSize: 24,
  color: 'var(--d1-text-primary)',
  fontFeatureSettings: 'normal',
  fontVariantNumeric: 'normal',
};

const featuresStyleOn: React.CSSProperties = {
  fontFamily: 'var(--d1-font-mono)',
  fontSize: 24,
  color: 'var(--d1-text-primary)',
  fontFeatureSettings: '"tnum" 1, "ss01" 1',
  fontVariantNumeric: 'tabular-nums lining-nums',
};

export function TypographySection() {
  return (
    <DsSection
      id="typography"
      eyebrow="03 · Typography"
      title="Geist Sans + Geist Mono"
      lede="Single-family bet. Geist Sans carries display and UI body; Geist Mono carries every numeral, ticker, datestamp, kbd, and metadata atom. No display serif — D1 has no Fraunces / no editorial third face."
    >
      <DsRow label="SPECIMEN — DISPLAY THROUGH TIMESTAMP">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {SPECIMENS.map((s) => (
            <div
              key={s.label}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 240px) minmax(0, 1fr)',
                gap: 24,
                alignItems: 'baseline',
                paddingBottom: 16,
                borderBottom: '1px solid var(--d1-border-hairline)',
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--d1-font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--d1-text-muted)',
                  }}
                >
                  {s.label}
                </p>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: 12,
                    color: 'var(--d1-text-muted)',
                  }}
                >
                  {s.note}
                </p>
              </div>
              <div style={s.style}>{s.sample}</div>
            </div>
          ))}
        </div>
      </DsRow>

      <DsRow label="`tnum` + `ss01` — BEFORE / AFTER">
        <div className="ds-grid-2">
          <div className="ds-callout">
            <p className="ds-callout__heading">Default — proportional</p>
            <p style={featuresStyleOff}>{NUMERIC_DEMO}</p>
            <p style={featuresStyleOff}>{MONEY_DEMO}</p>
            <p style={featuresStyleOff}>{DELTA_DEMO}</p>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--d1-text-muted)' }}>
              Numerals jitter when stacked — no good for KPI / table / chart axis.
            </p>
          </div>
          <div className="ds-callout">
            <p className="ds-callout__heading">D1 default — `tnum 1, ss01 1`</p>
            <p style={featuresStyleOn}>{NUMERIC_DEMO}</p>
            <p style={featuresStyleOn}>{MONEY_DEMO}</p>
            <p style={featuresStyleOn}>{DELTA_DEMO}</p>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--d1-text-muted)' }}>
              Tabular numerals + stylistic-set 01 — every digit aligns vertically across rows.
            </p>
          </div>
        </div>
      </DsRow>

      <DsCallout heading="Discipline">
        Every money figure, percentage, datestamp, and ticker uses Geist Mono. Geist Sans never
        carries a numeric specimen. The only exception is the Premium chip’s «PREMIUM» label which
        is sans by intent (it’s a wordmark, not a number).
      </DsCallout>
    </DsSection>
  );
}
