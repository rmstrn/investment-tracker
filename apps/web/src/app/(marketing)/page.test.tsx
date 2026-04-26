// Smoke tests — Provedo landing v2 «The Ledger That Talks» (2026-04-27).
// Replaces the v1 LP6 page test entirely. The retired Provedo* components
// stay in the file tree dormant per spec §A.4 — they're no longer imported
// by page.tsx and we no longer test them as part of the home-page composition.
//
// Coverage: page composition + section landmarks + metadata + 6-section + FAQ.
// Detailed per-section coverage lives in `landing-v2.test.tsx`.

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import MarketingHomePage, { metadata } from './page';

// Browser API shims (matchMedia, IntersectionObserver, HTMLDialogElement) live
// in `vitest.setup.ts` — applied globally so reduced-motion is force-on for
// every test and the hero renders its final state synchronously.

describe('MarketingHomePage v2 — composition', () => {
  it('renders the locked hero h1 verbatim', () => {
    render(<MarketingHomePage />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toContain('Provedo will lead');
    expect(h1.textContent).toContain('you through your');
    expect(h1.textContent).toContain('portfolio.');
  });

  it('renders all 6 v2 sections + FAQ as named landmarks', () => {
    render(<MarketingHomePage />);
    // S1 hero — aria-labelledby ties to the H1 which uses hard <br/>
    // breaks; we look it up by the more permissive "provedo will lead"
    // prefix which screen readers also announce.
    expect(screen.getByRole('region', { name: /provedo will lead/i })).toBeInTheDocument();
    // S2 ask question
    expect(
      screen.getByRole('region', { name: /ask the question you've been googling/i }),
    ).toBeInTheDocument();
    // S3 coverage
    expect(
      screen.getByRole('region', { name: /every account\. one conversation/i }),
    ).toBeInTheDocument();
    // S4 differentiators
    expect(
      screen.getByRole('region', { name: /the things hiding between your brokers/i }),
    ).toBeInTheDocument();
    // S5 trust band
    expect(
      screen.getByRole('region', { name: /read-only\. no advice\. no surprises/i }),
    ).toBeInTheDocument();
    // S6 closing CTA
    expect(screen.getByRole('region', { name: /it only takes one question/i })).toBeInTheDocument();
    // FAQ kept per resolution #1
    expect(screen.getByRole('region', { name: /questions you'd ask/i })).toBeInTheDocument();
  });

  it('does NOT mount the retired LP6 components on the page', () => {
    render(<MarketingHomePage />);
    // Retired ProvedoEditorialNarrative had «One place. One feed. One chat.»
    expect(screen.queryByRole('region', { name: /^one place/i })).not.toBeInTheDocument();
    // Retired ProvedoNegationSection had POSITIONING eyebrow
    expect(screen.queryByRole('region', { name: /^positioning$/i })).not.toBeInTheDocument();
    // Retired ProvedoDemoTeasersBento had «See how Provedo answers.»
    expect(
      screen.queryByRole('region', { name: /see how provedo answers/i }),
    ).not.toBeInTheDocument();
  });

  it('mounts the early-access modal (rendered closed by default)', () => {
    render(<MarketingHomePage />);
    expect(screen.getByTestId('early-access-modal')).toBeInTheDocument();
  });
});

describe('MarketingHomePage v2 — metadata', () => {
  it('keeps robots noindex for staging', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it('drops «free forever» / «free tier» from OG description (v2 positioning)', () => {
    const og =
      typeof metadata.openGraph === 'object' && metadata.openGraph
        ? ((metadata.openGraph as { description?: string }).description ?? '')
        : '';
    expect(og).not.toMatch(/free forever/i);
    expect(og).not.toMatch(/free tier/i);
    expect(og).toMatch(/answer engine/i);
  });
});
