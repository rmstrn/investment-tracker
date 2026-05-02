import { RecordRail } from '../../style-d1/_components/RecordRail';
import { MODES_HEADER, MODES_ITEMS } from '../_lib/landing-copy';

/**
 * Section 4 — Three modes.
 *
 * What it does + what it refuses, paired. Each card carries one
 * positive-action + one explicit refusal so the boundary is the
 * product, not a footer.
 *
 * Three cards in a 3-col grid (collapses to 2 then 1 on mobile).
 * Read-tier quiet emboss; hover-NO-OP per depth v3 ADR-6.
 */
export function ThreeModes() {
  return (
    <section className="landing-section" aria-labelledby="landing-modes-heading">
      <div className="landing-section__inner">
        <h2 id="landing-modes-heading" className="landing-section__heading">
          {MODES_HEADER}
        </h2>

        <div className="landing-modes">
          {MODES_ITEMS.map((mode, idx) => {
            const railLabels = ['MODE 01', 'MODE 02', 'MODE 03'];
            return (
              <article key={mode.title} className="landing-mode-card">
                <RecordRail label={railLabels[idx] ?? `MODE 0${idx + 1}`} />
                <h3 className="landing-mode-card__title">{mode.title}</h3>
                <p className="landing-mode-card__body">{mode.body}</p>
                <p className="landing-mode-card__refusal">{mode.refusal}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
