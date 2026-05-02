import { RecordRail } from '../../style-d1/_components/RecordRail';
import { REALITY_HEADER, REALITY_IS, REALITY_IS_NOT, REALITY_SUB } from '../_lib/landing-copy';

/**
 * Section 2 — Reality strip (anti-positioning).
 *
 * Per synthesis-lock §4 + content-lead v2 §4.2: explicit dual-list with
 * crossed-out NOT pills + structural IS pills. Defuses F1 mis-
 * categorization friction («is this an advisor?») in 2 seconds.
 *
 * Pattern: «What Provedo is, and what it isn't.»
 *
 * Banlist note: the IS_NOT list contains «advisor» as a STRUCTURAL
 * NEGATION («not a registered investment advisor»). This is permitted
 * inside an inline-disclaimer surface per content-lead §10.3.
 */
export function RealityStrip() {
  return (
    <section
      className="landing-section landing-section--tight"
      aria-labelledby="landing-reality-heading"
    >
      <div className="landing-section__inner">
        <h2 id="landing-reality-heading" className="landing-section__heading">
          {REALITY_HEADER}
        </h2>
        <p className="landing-section__sub">{REALITY_SUB}</p>

        <div className="landing-reality">
          <article className="landing-reality__col" aria-labelledby="reality-not">
            <RecordRail label="WHAT IT ISN'T" />
            <h3 id="reality-not" className="landing-reality__col-heading">
              Provedo is not
            </h3>
            <ul className="landing-reality__list">
              {REALITY_IS_NOT.map((item) => (
                <li key={item}>
                  <span className="landing-reality__pill landing-reality__pill--neg">{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="landing-reality__col" aria-labelledby="reality-is">
            <RecordRail label="WHAT IT IS" />
            <h3 id="reality-is" className="landing-reality__col-heading">
              Provedo is
            </h3>
            <ul className="landing-reality__list">
              {REALITY_IS.map((item) => (
                <li key={item}>
                  <span className="landing-reality__pill landing-reality__pill--pos">{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
