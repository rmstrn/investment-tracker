import { fireEvent, render, screen, within } from '@testing-library/react';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const auth = vi.hoisted(() => vi.fn());
const redirect = vi.hoisted(() =>
  vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
);

vi.mock('@clerk/nextjs/server', () => ({ auth }));
vi.mock('next/navigation', () => ({ redirect }));

import PricingPage, { metadata as pricingMetadata } from './page';

async function renderPricing() {
  const element = await PricingPage();
  return render(element as React.ReactElement);
}

describe('PricingPage', () => {
  beforeEach(() => {
    auth.mockReset();
    redirect.mockClear();
  });

  it('renders all three tiers with prices for anonymous users', async () => {
    auth.mockResolvedValue({ userId: null, sessionClaims: null });
    await renderPricing();

    // Tier headings (h2 inside each card)
    expect(screen.getByRole('heading', { level: 2, name: 'Free' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Plus' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Pro' })).toBeInTheDocument();

    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('$8')).toBeInTheDocument();
    expect(screen.getByText('$20')).toBeInTheDocument();
  });

  it('Free CTA links to /sign-up for anonymous users', async () => {
    auth.mockResolvedValue({ userId: null, sessionClaims: null });
    await renderPricing();

    const getStarted = screen.getByRole('link', { name: /get started/i });
    expect(getStarted).toHaveAttribute('href', '/sign-up');
  });

  it('Plus and Pro expose Subscribe buttons for anonymous users', async () => {
    auth.mockResolvedValue({ userId: null, sessionClaims: null });
    await renderPricing();

    const subscribeButtons = screen.getAllByRole('button', { name: /subscribe/i });
    expect(subscribeButtons).toHaveLength(2);
  });

  it('shows Current plan on Free when authed user tier is free', async () => {
    auth.mockResolvedValue({
      userId: 'user_abc',
      sessionClaims: { publicMetadata: { tier: 'free' } },
    });
    await renderPricing();

    const freeHeading = screen.getByRole('heading', { level: 2, name: 'Free' });
    const freeCard = freeHeading.closest('div[class*="rounded"]') as HTMLElement;
    expect(freeCard).not.toBeNull();
    expect(within(freeCard).getByText(/current plan/i)).toBeInTheDocument();

    // Plus / Pro still show Subscribe
    expect(screen.getAllByRole('button', { name: /subscribe/i })).toHaveLength(2);
  });

  it('defaults unknown tier to free fallback for authed users', async () => {
    auth.mockResolvedValue({
      userId: 'user_abc',
      sessionClaims: { publicMetadata: {} },
    });
    await renderPricing();

    // Free gets Current plan badge (because fallback = 'free')
    expect(screen.getByText(/current plan/i)).toBeInTheDocument();
  });

  it('Subscribe click logs TODO intent without throwing', async () => {
    auth.mockResolvedValue({ userId: null, sessionClaims: null });
    await renderPricing();

    const logSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const subscribeButtons = screen.getAllByRole('button', { name: /subscribe/i });
    const firstSubscribe = subscribeButtons[0];
    if (!firstSubscribe) throw new Error('Expected at least one Subscribe button');
    expect(() => fireEvent.click(firstSubscribe)).not.toThrow();
    expect(logSpy).toHaveBeenCalledWith('TODO: Stripe checkout', expect.stringMatching(/plus|pro/));
    logSpy.mockRestore();
  });
});

// ─── Wave 2.6 HIGH-3 (Rule 4) — predecessor-name sanitization ─────────────

describe('PricingPage — Wave 2.6 HIGH-3 (Rule 4)', () => {
  it('metadata.title mentions only Provedo (no rejected predecessor name)', () => {
    expect(pricingMetadata.title).toBeDefined();
    const title =
      typeof pricingMetadata.title === 'string'
        ? pricingMetadata.title
        : String(pricingMetadata.title);
    // Hard rule: rejected naming predecessor must NOT appear in browser tab
    // or screen-reader page-load announcement.
    expect(title).not.toMatch(/investment tracker/i);
    // Positive assertion: title surfaces the brand we DO ship under.
    expect(title).toMatch(/provedo/i);
  });

  it('metadata.description does not contain the rejected predecessor name', () => {
    const description = pricingMetadata.description ?? '';
    expect(description).not.toMatch(/investment tracker/i);
  });
});
