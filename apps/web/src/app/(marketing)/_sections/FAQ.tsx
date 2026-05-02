import { FAQ_HEADER, FAQ_ITEMS } from '../_lib/landing-copy';

/**
 * Section 9 — FAQ (10 Q+A from content-lead v2 §7).
 *
 * Native `<details>`/`<summary>` for zero-JS expand-collapse — fits
 * landing's static-only constraint. SAME `FAQ_ITEMS` array drives the
 * `buildFAQPageSchema()` JSON-LD emission in `page.tsx`, so visible
 * Q+A and structured data never drift.
 *
 * Banlist verification: content-lead §10 confirms zero hits across
 * all ten answers. Q2 phrases the boundary as «tell you what to buy,
 * sell, or hold» rather than the banned verb root.
 */
export function FAQ() {
  return (
    <section className="landing-section" aria-labelledby="landing-faq-heading">
      <div className="landing-section__inner">
        <h2 id="landing-faq-heading" className="landing-section__heading">
          {FAQ_HEADER}
        </h2>

        <div className="landing-faq">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="landing-faq__item">
              <summary className="landing-faq__summary">
                <span>{item.question}</span>
                <span aria-hidden className="landing-faq__marker">
                  +
                </span>
              </summary>
              <p className="landing-faq__answer">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
