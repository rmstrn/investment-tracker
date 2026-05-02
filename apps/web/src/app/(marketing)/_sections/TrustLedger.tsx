import { RecordRail } from '../../style-d1/_components/RecordRail';
import { TRUST_HEADER, TRUST_ITEMS, TRUST_SUB } from '../_lib/landing-copy';

/**
 * Section 6 — Trust ledger (structural trust signals).
 *
 * Per synthesis-lock §1 / item 7: «read-only by structure» + «cannot
 * place trades» + «your data, scoped to you». Three cards, Read-tier
 * quiet emboss + Record Rail signature.
 *
 * Pattern from content-lead v2 §6: «No trades placed. No verdicts
 * given. No data sold.» — the negation stack rephrased as positive
 * structural facts.
 */
export function TrustLedger() {
  return (
    <section className="landing-section" aria-labelledby="landing-trust-heading">
      <div className="landing-section__inner">
        <h2 id="landing-trust-heading" className="landing-section__heading">
          {TRUST_HEADER}
        </h2>
        <p className="landing-section__sub">{TRUST_SUB}</p>

        <div className="landing-trust">
          {TRUST_ITEMS.map((item, idx) => (
            <article key={item.title} className="landing-trust__item">
              <RecordRail label={`TRUST 0${idx + 1}`} />
              <h3 className="landing-trust__title">{item.title}</h3>
              <p className="landing-trust__body">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
