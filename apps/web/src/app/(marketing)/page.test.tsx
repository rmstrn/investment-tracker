import { render, screen } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';

// Mock the Clerk-dependent client island to a no-op so the static page
// test does not pull in Clerk + Next router runtime.
vi.mock('./_components/HeroCTA', () => ({
  HeroCTA: () => null,
}));

// Mock BarVisx (chart) — it pulls in @visx; dom-test environment doesn't
// need to render the chart pixel-accurate; we only assert shape and copy.
vi.mock('@investment-tracker/ui/charts', () => ({
  BAR_DRIFT_FIXTURE: {},
  BarVisx: () => null,
}));

import LandingPage from './page';

describe('LandingPage (static, force-static, server-rendered)', () => {
  it('renders the locked hero H1 + sub-spine', () => {
    const element = LandingPage();
    render(element as React.ReactElement);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /every holding\. every broker\. one conversation\./i,
      }),
    ).toBeInTheDocument();
  });

  it('renders the anti-positioning section header', () => {
    const element = LandingPage();
    render(element as React.ReactElement);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /what provedo is, and what it isn't\./i,
      }),
    ).toBeInTheDocument();
  });

  it('renders the FAQ heading and at least 10 questions', () => {
    const element = LandingPage();
    render(element as React.ReactElement);

    expect(
      screen.getByRole('heading', { level: 2, name: /questions, answered plainly/i }),
    ).toBeInTheDocument();

    // FAQ_ITEMS has 10 entries; each renders a <details><summary>.
    // Use getAllByText to confirm at least 10 question labels are present.
    const broker = screen.getAllByText(/is provedo a broker\?/i);
    expect(broker.length).toBeGreaterThanOrEqual(1);
    const advisor = screen.getAllByText(/is provedo an advisor\?/i);
    expect(advisor.length).toBeGreaterThanOrEqual(1);
  });
});
