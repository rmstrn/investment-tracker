// Smoke tests — Provedo first-pass landing (Slice-LP1)
// Covers: hero render, DemoTabs tab switching, metadata robots noindex.

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProvedoDemoTabs } from './_components/ProvedoDemoTabs';
import MarketingHomePage, { metadata } from './page';

describe('MarketingHomePage', () => {
  it('renders hero h1 with locked Provedo headline', () => {
    render(<MarketingHomePage />);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /provedo will lead you through your portfolio/i,
      }),
    ).toBeInTheDocument();
  });

  it('renders primary CTA linking to #demo anchor', () => {
    render(<MarketingHomePage />);
    const askCta = screen.getByRole('link', { name: /ask provedo/i });
    expect(askCta).toHaveAttribute('href', '#demo');
  });

  it('sets robots noindex for staging deploy', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});

describe('ProvedoDemoTabs', () => {
  it('renders all four tab triggers', () => {
    render(<ProvedoDemoTabs />);
    expect(screen.getByRole('tab', { name: /why\?/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /dividends/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /patterns/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /aggregate/i })).toBeInTheDocument();
  });

  it('shows Why? tab content by default', () => {
    render(<ProvedoDemoTabs />);
    expect(screen.getByText(/why is my portfolio down this month/i)).toBeInTheDocument();
  });

  it('switches to Dividends tab content on click', () => {
    render(<ProvedoDemoTabs />);
    const dividendsTab = screen.getByRole('tab', { name: /dividends/i });
    fireEvent.click(dividendsTab);
    expect(screen.getByText(/when are dividends coming this quarter/i)).toBeInTheDocument();
  });

  it('switches to Patterns tab and shows "no judgment, no advice" disclaim', () => {
    render(<ProvedoDemoTabs />);
    const patternsTab = screen.getByRole('tab', { name: /patterns/i });
    fireEvent.click(patternsTab);
    expect(screen.getByText(/no judgment, no advice/i)).toBeInTheDocument();
  });
});
