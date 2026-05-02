import { RecordRail } from '../../style-d1/_components/RecordRail';
import { HeroCTA } from '../_components/HeroCTA';
import { CLOSING_HEADER, CLOSING_SUB, TRUTH_BODY, TRUTH_HEADER } from '../_lib/landing-copy';

/**
 * Section 10 — Pre-alpha truth + closing CTA.
 *
 * Per synthesis-lock §6 (UR distinctive): preview empty post-auth
 * dashboard NEAR final CTA. Inverts standard SaaS playbook (which
 * hides post-auth reality, creating sign-up→regret churn). Pre-alpha-
 * truth as conversion asset for ICP B; calibration anchor for ICP A.
 *
 * Verified on disk by user-researcher: copy matches the actual
 * empty-state experience in `(app)/dashboard/page.tsx` and
 * `(app)/accounts/page.tsx`.
 *
 * Reuses <HeroCTA /> client island so signed-in users see the
 * appropriate CTA copy.
 */
export function PreAlphaTruth() {
  return (
    <section className="landing-section" aria-labelledby="landing-truth-heading">
      <div className="landing-section__inner">
        <article className="landing-truth">
          <RecordRail label="HONEST · PRE-ALPHA" />
          <h2 id="landing-truth-heading" className="landing-truth__heading">
            {TRUTH_HEADER}
          </h2>
          <p className="landing-truth__body">{TRUTH_BODY}</p>
          <p className="landing-truth__body" style={{ marginTop: 16 }}>
            <strong style={{ color: 'var(--d1-text-primary)' }}>{CLOSING_HEADER}</strong>{' '}
            {CLOSING_SUB}
          </p>
          <HeroCTA />
        </article>
      </div>
    </section>
  );
}
