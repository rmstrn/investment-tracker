import { DsCallout, DsRow, DsSection } from '../_components/DsSection';

/**
 * §Elevation & Radii — the depth and corner ladders.
 *
 * Three elevation tiers (page → surface → card → hover-card) and a 5-step
 * radii ladder (24 KPI / 28 outer surface / 9999 pills / 12 tooltip / 6
 * heatmap cell). Plus 8px chart bars from KICKOFF §4.1.
 */

interface ElevationTier {
  readonly name: string;
  readonly bg: string;
  readonly note: string;
  readonly shadow?: string;
}

const ELEVATIONS: ReadonlyArray<ElevationTier> = [
  {
    name: 'Page · --d1-bg-page (#141416)',
    bg: '#141416',
    note: 'Outer canvas, no shadow — the floor.',
  },
  {
    name: 'Surface · --d1-bg-surface (#1F2024)',
    bg: '#1F2024',
    note: 'Lifted card holding sections; rests on the page.',
  },
  {
    name: 'Card · --d1-bg-card (#26272C)',
    bg: '#26272C',
    note: 'KPI / chart / panel default fill; the «paper».',
  },
  {
    name: 'Card hover · --d1-bg-card + shadow',
    bg: '#26272C',
    note: 'translateY(-2px) + 0 8px 24px rgba(0,0,0,0.4)',
    shadow: '0 8px 24px rgba(0,0,0,0.4)',
  },
];

interface RadiusRow {
  readonly tier: string;
  readonly value: string;
  readonly use: string;
}

const RADII: ReadonlyArray<RadiusRow> = [
  { tier: 'Outer surface', value: '28px', use: '`.d1-surface` — section card holding the rest' },
  {
    tier: 'KPI · panel · ds-section',
    value: '24px',
    use: '`.d1-kpi` / `.d1-panel` / `.ds-section`',
  },
  { tier: 'Tooltip / inner card', value: '12px', use: 'Chart tooltip, info pill, soft callout' },
  {
    tier: 'Form field / nested chip',
    value: '12px',
    use: '`.d1-input`, `.d1-select`, `.d1-textarea`',
  },
  { tier: 'Chart bar top corner', value: '8px', use: '`BarVisx` / `StackedBarVisx` bar caps' },
  { tier: 'Heatmap cell', value: '6px', use: '`.d1-heatmap__cell` — 28×28 cells, 4px gap' },
  { tier: 'Pill (any chrome)', value: '9999px', use: 'Nav, chip, icon-pill, premium chip, CTA' },
];

export function ElevationAndRadiiSection() {
  return (
    <DsSection
      id="elevation-and-radii"
      eyebrow="08 · Elevation & Radii"
      title="Three layers, six radii"
      lede="The page reads as page → surface → card → hover-card. Pills are reserved for chrome. Data containers (KPI, panel, tooltip, form, heatmap, chart bars) get their own radii ladder; nothing in that ladder is 9999px."
    >
      <DsRow label="ELEVATION LADDER">
        <div className="ds-grid-2">
          {ELEVATIONS.map((e) => (
            <div
              key={e.name}
              style={{
                background: e.bg,
                borderRadius: 16,
                padding: 24,
                boxShadow: e.shadow ?? 'none',
                border: '1px solid var(--d1-border-hairline)',
                color: 'var(--d1-text-primary)',
                fontFamily: 'var(--d1-font-mono)',
                fontSize: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                minHeight: 120,
              }}
            >
              <p style={{ margin: 0, color: 'var(--d1-text-primary)', fontSize: 13 }}>{e.name}</p>
              <p style={{ margin: 0, color: 'var(--d1-text-muted)', fontSize: 12 }}>{e.note}</p>
            </div>
          ))}
        </div>
      </DsRow>

      <DsRow label="RADII LADDER">
        <table className="ds-table">
          <thead>
            <tr>
              <th>Tier</th>
              <th>Value</th>
              <th>Use</th>
              <th>Sample</th>
            </tr>
          </thead>
          <tbody>
            {RADII.map((r) => (
              <tr key={r.tier}>
                <td>{r.tier}</td>
                <td className="mono">{r.value}</td>
                <td className="mono" style={{ color: 'var(--d1-text-muted)' }}>
                  {r.use}
                </td>
                <td>
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-block',
                      width: 56,
                      height: 24,
                      background: 'var(--d1-bg-card-soft)',
                      borderRadius: r.value,
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DsRow>

      <DsCallout heading="No 9999px on data containers">
        Pills are chrome. Data containers carry the 24 / 28 / 12 / 8 / 6 px ladder so the page reads
        two visual languages: «pills above» (chrome) and «paper below» (data). Mixing them — e.g. a
        fully-rounded KPI card — collapses the hierarchy.
      </DsCallout>
    </DsSection>
  );
}
