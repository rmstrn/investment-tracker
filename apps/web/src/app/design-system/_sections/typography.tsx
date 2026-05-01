import { DsRow, SectionShell } from '../_components/SectionShell';

/**
 * §Typography — Fraunces opsz-axis specimen + Inter weights + JetBrains Mono.
 *
 * This is SURFACE #1 of three sanctioned Fraunces moments (the typography
 * specimen itself). The other two are the KPI numeral demo (cards section)
 * and the drilldown H2 demo (page title at the top of /design-system).
 *
 * The Fraunces 3-surface lock is the single most important typography
 * discipline in D3 — the visual lock-callout below makes the forbidden
 * list explicit in copy, not just in CSS comments.
 */

const FORBIDDEN_SURFACES: readonly string[] = [
  'Body copy',
  'Chip labels',
  'Button labels',
  'Nav items',
  'Form labels',
  'Tooltip values',
  'Axis ticks',
  'Captions / metadata',
];

export function TypographySection() {
  return (
    <SectionShell
      id="typography"
      title="Typography"
      meta="FRAUNCES 3-LOCK · INTER · JETBRAINS MONO"
      description="Three families, all OFL, all variable, all preloaded. Fraunces (opsz axis) carries the editorial moment on three surfaces; Inter does every other UI string; JetBrains Mono renders every numeral that needs to align."
    >
      <DsRow label="Fraunces · display only — opsz 56 / 44 / 32">
        <div className="ds-type-specimen">
          <div className="ds-type-specimen__row">
            <p className="ds-type-specimen__label">opsz 56 — welcome name (drilldown H1 / hero)</p>
            <p className="ds-type-specimen__display-xl">Your portfolio, examined.</p>
          </div>
          <div className="ds-type-specimen__row">
            <p className="ds-type-specimen__label">opsz 44 — KPI numeral, tabular</p>
            <p className="ds-type-specimen__display-md">$ 248,310.40</p>
          </div>
          <div className="ds-type-specimen__row">
            <p className="ds-type-specimen__label">opsz 32 — drilldown H2</p>
            <p className="ds-type-specimen__display-sm">Concentration over the last 90 days</p>
          </div>
        </div>
      </DsRow>

      <DsRow label="Fraunces is forbidden everywhere else">
        <div className="ds-type-lock">
          <p className="ds-type-lock__title">Three-surface lock</p>
          <p className="ds-type-lock__body">
            Fraunces appears on <strong>exactly three surfaces</strong>: the welcome name, the KPI
            numeral, and the drilldown H2. It is <strong>forbidden</strong> in:{' '}
            {FORBIDDEN_SURFACES.join(' · ')}. Tooltip numerals and donut center labels stay in
            JetBrains Mono — the editorial register stays scarce, or it stops reading as editorial.
          </p>
        </div>
      </DsRow>

      <DsRow label="Inter · body, labels, chips, buttons">
        <div className="ds-type-specimen">
          <div className="ds-type-specimen__row">
            <p className="ds-type-specimen__label">600 weight — section title</p>
            <p className="ds-type-specimen__body ds-type-specimen__body--600">
              Three positions account for 64% of unrealised P&amp;L this month.
            </p>
          </div>
          <div className="ds-type-specimen__row">
            <p className="ds-type-specimen__label">500 weight — eyebrow / chip</p>
            <p className="ds-type-specimen__body ds-type-specimen__body--500">
              Read-only across every broker. The discipline of a private banker.
            </p>
          </div>
          <div className="ds-type-specimen__row">
            <p className="ds-type-specimen__label">400 weight — body copy / AI message</p>
            <p className="ds-type-specimen__body ds-type-specimen__body--400">
              Calm rooms make better decisions. We help with the room. Reads comfortably from 14px
              upwards on warm-graphite without losing its serif counterpart's authority.
            </p>
          </div>
        </div>
      </DsRow>

      <DsRow label="JetBrains Mono · numerals, axes, timestamps">
        <div className="ds-type-specimen">
          <div className="ds-type-specimen__row">
            <p className="ds-type-specimen__label">14px — KPI delta line</p>
            <p className="ds-type-specimen__mono">+ 1.84 % · +$ 4,486.32 · 30D</p>
          </div>
          <div className="ds-type-specimen__row">
            <p className="ds-type-specimen__label">14px — AI dossier byline / timestamp</p>
            <p className="ds-type-specimen__mono">PROVEDO · 09:14:02 · 2026-04-29</p>
          </div>
          <div className="ds-type-specimen__row">
            <p className="ds-type-specimen__label">14px — tabular columns</p>
            <p className="ds-type-specimen__mono">
              0 1 2 3 4 5 6 7 8 9 — fixed-width digits never break the column.
            </p>
          </div>
        </div>
      </DsRow>
    </SectionShell>
  );
}
