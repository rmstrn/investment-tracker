import { RecordRail } from '../../style-d1/_components/RecordRail';
import { AUDIENCE_GROUPS, AUDIENCE_HEADER } from '../_lib/landing-copy';

/**
 * Section 7 — For whom (ICP A + ICP B coverage).
 *
 * Per synthesis-lock §1 item 8: a single hero satisfies both ICPs;
 * this section names them explicitly so visitors can self-select.
 *
 * Two cards in a 2-col grid (collapses to 1 on mobile).
 */
export function ForWhom() {
  return (
    <section className="landing-section" aria-labelledby="landing-audience-heading">
      <div className="landing-section__inner">
        <h2 id="landing-audience-heading" className="landing-section__heading">
          {AUDIENCE_HEADER}
        </h2>

        <div className="landing-audience">
          {AUDIENCE_GROUPS.map((group, idx) => (
            <article key={group.who} className="landing-audience__item">
              <RecordRail label={`READER 0${idx + 1}`} />
              <h3 className="landing-audience__who">{group.who}</h3>
              <p className="landing-audience__detail">{group.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
