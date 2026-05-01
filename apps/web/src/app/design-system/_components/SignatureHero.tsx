import { Button } from '@investment-tracker/ui';

/**
 * SignatureHero — anchor card at the top of each stage.
 *
 * Mirrors the static reference: extra-prominent shadow (`var(--shadow-lift)`),
 * mono eyebrow under-rule, 40px Geist semibold tagline with bold accent word,
 * supporting copy, and two CTAs (primary + ghost).
 *
 * Brand voice: do NOT color the accent word — Patagonia / Stripe Press canon.
 * Bold weight only.
 */
export function SignatureHero() {
  return (
    <div className="showcase-signature">
      <p className="showcase-signature__eyebrow">PORTFOLIO ANSWER ENGINE · 01</p>
      <h3 className="showcase-signature__headline">
        Notice <span className="showcase-signature__headline-accent">what</span>
        <br />
        you&apos;d miss.
      </h3>
      <p className="showcase-signature__sub">
        Provedo reads every account in your name and points at things hiding between brokers — then
        explains why they matter, with sources.
      </p>
      <div className="showcase-signature__cta">
        <Button variant="primary">Get early access</Button>
        <Button variant="ghost">See how it works →</Button>
      </div>
    </div>
  );
}
