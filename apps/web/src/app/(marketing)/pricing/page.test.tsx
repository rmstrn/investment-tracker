import { fireEvent, render, screen, within } from '@testing-library/react';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const useUser = vi.hoisted(() => vi.fn());

vi.mock('@clerk/nextjs', () => ({ useUser }));

import PricingPage from './page';

function renderPricing() {
  return render(PricingPage() as React.ReactElement);
}

describe('PricingPage (static + auth-aware island)', () => {
  beforeEach(() => {
    useUser.mockReset();
  });

  it('renders all three tiers with prices for anonymous users', () => {
    useUser.mockReturnValue({ isLoaded: true, isSignedIn: false, user: null });
    renderPricing();

    expect(screen.getByRole('heading', { level: 2, name: 'Free' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Plus' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Pro' })).toBeInTheDocument();

    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('$8')).toBeInTheDocument();
    expect(screen.getByText('$20')).toBeInTheDocument();
  });

  it('Free CTA links to /sign-up for anonymous users', () => {
    useUser.mockReturnValue({ isLoaded: true, isSignedIn: false, user: null });
    renderPricing();

    const getStarted = screen.getByRole('link', { name: /get started/i });
    expect(getStarted).toHaveAttribute('href', '/sign-up');
  });

  it('Plus and Pro expose Subscribe buttons for anonymous users', () => {
    useUser.mockReturnValue({ isLoaded: true, isSignedIn: false, user: null });
    renderPricing();

    const subscribeButtons = screen.getAllByRole('button', { name: /subscribe/i });
    expect(subscribeButtons).toHaveLength(2);
  });

  it('shows Current plan on Free when authed user tier is free', () => {
    useUser.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: { publicMetadata: { tier: 'free' } },
    });
    renderPricing();

    const freeHeading = screen.getByRole('heading', { level: 2, name: 'Free' });
    const freeCard = freeHeading.closest('div[class*="rounded"]') as HTMLElement;
    expect(freeCard).not.toBeNull();
    expect(within(freeCard).getByText(/current plan/i)).toBeInTheDocument();

    expect(screen.getAllByRole('button', { name: /subscribe/i })).toHaveLength(2);
  });

  it('defaults unknown tier to free fallback for authed users', () => {
    useUser.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: { publicMetadata: {} },
    });
    renderPricing();

    expect(screen.getByText(/current plan/i)).toBeInTheDocument();
  });

  it('renders anonymous default while Clerk is still loading', () => {
    useUser.mockReturnValue({ isLoaded: false, isSignedIn: false, user: null });
    renderPricing();

    // No «Current plan» badge until Clerk resolves
    expect(screen.queryByText(/current plan/i)).not.toBeInTheDocument();
  });

  it('Subscribe click logs TODO intent without throwing', () => {
    useUser.mockReturnValue({ isLoaded: true, isSignedIn: false, user: null });
    renderPricing();

    const logSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const subscribeButtons = screen.getAllByRole('button', { name: /subscribe/i });
    const firstSubscribe = subscribeButtons[0];
    if (!firstSubscribe) throw new Error('Expected at least one Subscribe button');
    expect(() => fireEvent.click(firstSubscribe)).not.toThrow();
    expect(logSpy).toHaveBeenCalledWith('TODO: Stripe checkout', expect.stringMatching(/plus|pro/));
    logSpy.mockRestore();
  });
});
