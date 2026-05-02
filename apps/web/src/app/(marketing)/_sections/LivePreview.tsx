import { EmbeddedDashboardSlab } from '../../style-d1/_components/EmbeddedDashboardSlab';
import { PREVIEW_EYEBROW, PREVIEW_HEADER, PREVIEW_SUB } from '../_lib/landing-copy';

/**
 * Section 3 — Live D1 dashboard preview.
 *
 * Per synthesis-lock §5 + architect ADR-4 Option A: consume the shared
 * `<EmbeddedDashboardSlab variant="landing">` server component. Single
 * source of truth — design tweaks land on /style-d1 and here together.
 *
 * Server-rendered SVG; zero added client JS. SEO-crawlable («the
 * product is the screenshot»).
 *
 * Lime-creep accounting: this section is allowed ONE lime-signal event
 * (the look-here Drift KPI lime fill via `.d1-kpi--lime`). All other
 * lime usages inside the slab bind `lime-hairline` per the v5.8 lime
 * ladder discipline. Combined with the hero CTA's lime fill, the
 * landing stays at ≤2 lime-signal events per viewport.
 */
export function LivePreview() {
  return (
    <section className="landing-section" aria-labelledby="landing-preview-heading">
      <div className="landing-section__inner">
        <p className="landing-section__eyebrow">{PREVIEW_EYEBROW}</p>
        <h2 id="landing-preview-heading" className="landing-section__heading">
          {PREVIEW_HEADER}
        </h2>
        <p className="landing-section__sub">{PREVIEW_SUB}</p>

        <div className="landing-preview">
          <EmbeddedDashboardSlab variant="landing" />
        </div>
      </div>
    </section>
  );
}
