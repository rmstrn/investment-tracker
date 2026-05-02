import { RecordRail } from '../../style-d1/_components/RecordRail';
import { SAMPLE_EXCHANGES, SAMPLE_HEADER, SAMPLE_SUB } from '../_lib/landing-copy';

/**
 * Section 5 — AI sample row (concrete chat exchanges).
 *
 * Per synthesis-lock + content-lead v2 §4.4: three Q+A pairs from the
 * assistant. Past-tense, source-attributed, no advice. Each exchange
 * sits inside a Read-tier card with a Record Rail header showing a
 * sample question label.
 *
 * Anchor `#sample` matches the hero secondary CTA's href.
 */
export function AISampleRow() {
  return (
    <section id="sample" className="landing-section" aria-labelledby="landing-sample-heading">
      <div className="landing-section__inner">
        <h2 id="landing-sample-heading" className="landing-section__heading">
          {SAMPLE_HEADER}
        </h2>
        <p className="landing-section__sub">{SAMPLE_SUB}</p>

        <div className="landing-samples">
          {SAMPLE_EXCHANGES.map((ex, idx) => (
            <article key={ex.question} className="landing-sample">
              <RecordRail label={`SAMPLE 0${idx + 1}`} />
              <p className="landing-sample__q">You asked</p>
              <p className="landing-sample__q-body">{ex.question}</p>
              <p className="landing-sample__q">Provedo answered</p>
              <p className="landing-sample__a-body">{ex.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
