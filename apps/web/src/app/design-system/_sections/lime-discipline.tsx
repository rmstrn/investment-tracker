import { DsCallout, DsRow, DsSection } from '../_components/DsSection';

/**
 * §Lime Discipline — every lime surface on the page, classified.
 *
 * Three categories per KICKOFF §7.5:
 *  - «Look here» semantic — ONE active per primary view
 *  - «Brand identity» semantic — always-on chrome
 *  - «Data treatment» semantic — lime IS the data, can repeat
 *
 * The «one at a time» rule applies WITHIN the «look here» category only.
 */

interface LimeRow {
  readonly surface: string;
  readonly opacity: string;
  readonly note: string;
}

const LOOK_HERE: ReadonlyArray<LimeRow> = [
  {
    surface: 'Drift KPI fill (`.d1-kpi--lime`)',
    opacity: '100%',
    note: 'One per view, by rule. The most-actionable observation gets the lime card.',
  },
  {
    surface: 'Nav active pill (`.d1-pill--active`)',
    opacity: '100%',
    note: 'Primary navigation signal — sanctioned by fix #5 to keep its lime treatment.',
  },
];

const BRAND_IDENTITY: ReadonlyArray<LimeRow> = [
  {
    surface: 'Record Rail tick (`▮`)',
    opacity: '100%',
    note: 'Letterpress mark above every persistent data zone. Always lime, never animated.',
  },
  {
    surface: 'Record Rail hairline (`.d1-rail__line`)',
    opacity: '30%',
    note: 'Conservative opacity per fix #5 — must not compete with the lime KPI.',
  },
  {
    surface: 'Record Rail entry tick',
    opacity: '100%',
    note: 'Each AI-insight entry header. Same lime, same letterpress weight.',
  },
  {
    surface: 'Disclaimer chip background',
    opacity: '12%',
    note: '«Read-only · No advice» chip in the nav. Lime at 12% sits between muted nav and the active pill.',
  },
  {
    surface: 'Lime CTA (`.d1-cta`)',
    opacity: '100%',
    note: 'Primary marketing CTA only. App routes use the ghost variant.',
  },
];

const DATA_TREATMENT: ReadonlyArray<LimeRow> = [
  {
    surface: 'Heatmap cells (`.d1-heatmap__cell`)',
    opacity: '0 / 15 / 40 / 70 / 100%',
    note: '5-level saturation ramp. Lime IS the dividend intensity — semantic, not decorative.',
  },
  {
    surface: 'Hatched bar pattern',
    opacity: '35% over bg-card',
    note: '8px-pitch SVG `<pattern>` reused across BarVisx + StackedBarVisx + WaterfallVisx.',
  },
  {
    surface: 'Filter chip active hairline',
    opacity: '40% (idle) / 60% (hover)',
    note: 'Inset 1px lime — restored as accent after fix #5 muted the fill.',
  },
];

function LimeTable({ rows }: { rows: ReadonlyArray<LimeRow> }) {
  return (
    <table className="ds-table">
      <thead>
        <tr>
          <th>Surface</th>
          <th>Opacity</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.surface}>
            <td>
              <span className="ds-token-chip" style={{ background: '#D6F26B' }} />
              {r.surface}
            </td>
            <td className="mono">{r.opacity}</td>
            <td style={{ color: 'var(--d1-text-muted)' }}>{r.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function LimeDisciplineSection() {
  return (
    <DsSection
      id="lime-discipline"
      eyebrow="12 · Lime Discipline"
      title="Lime, classified"
      lede="The post-fix-pass audit. Every lime surface on this page falls into one of three categories. The «one active state at a time» rule only applies to the «look here» category — brand-identity chrome and data treatment can repeat freely."
    >
      <DsRow label="«LOOK HERE» SEMANTIC — ONE PER PRIMARY VIEW">
        <LimeTable rows={LOOK_HERE} />
      </DsRow>

      <DsRow label="«BRAND IDENTITY» SEMANTIC — ALWAYS-ON CHROME">
        <LimeTable rows={BRAND_IDENTITY} />
      </DsRow>

      <DsRow label="«DATA TREATMENT» SEMANTIC — LIME IS THE DATA">
        <LimeTable rows={DATA_TREATMENT} />
      </DsRow>

      <DsCallout heading="Why three categories">
        If lime were a single «accent colour», it would burn out by the third appearance. By
        classifying each surface, the page can carry 7+ lime treatments without losing the «look
        here» signal — because the signal is reserved for the «look here» category.
      </DsCallout>
    </DsSection>
  );
}
