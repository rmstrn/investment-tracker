import { ChartBar, Lock, MoreHorizontal, Plus } from 'lucide-react';
import { DsCallout, DsRow, DsSection } from '../_components/DsSection';

/**
 * §Pill Vocabulary — every `border-radius: 9999px` surface in D1.
 *
 * D1’s defining vocabulary is the pill: nav, chip, icon-pill, premium
 * chip, disclaimer chip (NEW post-fix #3), brand monogram. The «no
 * 9999px on data containers» sub-rule lives in §Elevation & Radii.
 */

interface PillRow {
  readonly name: string;
  readonly tokens: string;
  readonly node: React.ReactNode;
}

const PILLS: ReadonlyArray<PillRow> = [
  {
    name: 'Nav pill — 40px tall, 9999px radius',
    tokens: 'Sans 500 13px · idle: text-muted on transparent · active: ink on lime',
    node: (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button type="button" className="d1-pill d1-pill--active">
          Overview
        </button>
        <button type="button" className="d1-pill">
          Insights
        </button>
        <button type="button" className="d1-pill">
          Drift
        </button>
      </div>
    ),
  },
  {
    name: 'Filter chip — 36px tall, 9999px radius',
    tokens: 'Sans 500 13px · active: text-primary on bg-card-soft + lime hairline',
    node: (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button type="button" className="d1-chip d1-chip--active">
          All
        </button>
        <button type="button" className="d1-chip">
          Holdings
        </button>
        <button type="button" className="d1-chip">
          Income
        </button>
      </div>
    ),
  },
  {
    name: 'Nav icon-pill — 40×40, 9999px radius',
    tokens: 'bg-card · text-muted → text-primary on hover',
    node: (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button type="button" className="d1-nav__icon-pill" aria-label="More">
          <MoreHorizontal size={16} />
        </button>
        <button type="button" className="d1-nav__icon-pill" aria-label="Add">
          <Plus size={16} />
        </button>
      </div>
    ),
  },
  {
    name: 'Premium chip — 24px tall, 9999px radius',
    tokens: 'Sans 500 11px · text-primary on purple @ 18% opacity',
    node: <span className="d1-chip-premium">Premium</span>,
  },
  {
    name: 'Disclaimer chip — 32px tall, 9999px radius (NEW · fix #3)',
    tokens: 'Sans 500 12px · text-primary on lime @ 12% · 14px lime lock icon',
    node: (
      <span className="d1-disclaimer-chip">
        <span className="d1-disclaimer-chip__icon" aria-hidden>
          <Lock size={14} />
        </span>
        <span>Read-only · No advice</span>
      </span>
    ),
  },
  {
    name: 'Brand monogram — 32×32 circle, 9999px radius',
    tokens: 'Sans 700 15px · text-primary on accent-purple',
    node: (
      <span className="d1-nav__brand" aria-label="Provedo">
        P
      </span>
    ),
  },
  {
    name: 'Lime CTA — 40px tall, 9999px radius',
    tokens: 'Sans 600 14px · ink on lime · ghost variant has hairline border',
    node: (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button type="button" className="d1-cta">
          See the dashboard
        </button>
        <button type="button" className="d1-cta d1-cta--ghost">
          Read the disclosure
        </button>
      </div>
    ),
  },
  {
    name: 'KPI icon-chip — 32×32 inner pill on KPI cards',
    tokens: 'rgba(255,255,255,0.06) · text-muted',
    node: (
      <span className="d1-kpi__icon-chip" aria-hidden>
        <ChartBar size={16} />
      </span>
    ),
  },
];

export function PillVocabularySection() {
  return (
    <DsSection
      id="pill-vocabulary"
      eyebrow="04 · Pill Vocabulary"
      title="Pills everywhere"
      lede="Every chrome surface in D1 carries `border-radius: 9999px`. Nav, chip, icon-pill, premium chip, disclaimer chip, brand monogram, KPI icon-chip, ink CTA — the page reads as one continuous radius vocabulary."
    >
      <DsRow label="EVERY 9999PX SURFACE ON THE PAGE">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {PILLS.map((p) => (
            <div
              key={p.name}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 280px) minmax(0, 1fr)',
                gap: 24,
                alignItems: 'center',
                paddingBottom: 16,
                borderBottom: '1px solid var(--d1-border-hairline)',
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--d1-font-mono)',
                    fontSize: 12,
                    color: 'var(--d1-text-primary)',
                  }}
                >
                  {p.name}
                </p>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: 11,
                    fontFamily: 'var(--d1-font-mono)',
                    color: 'var(--d1-text-muted)',
                  }}
                >
                  {p.tokens}
                </p>
              </div>
              <div>{p.node}</div>
            </div>
          ))}
        </div>
      </DsRow>

      <DsCallout heading="Sub-rule">
        Pills do NOT belong on data containers. Cards, charts, panels, and tooltips have their own
        radii ladder (24 / 28 / 12 / 8 / 6 px) — see §Elevation & Radii. The 9999px vocabulary is
        reserved for chrome.
      </DsCallout>
    </DsSection>
  );
}
