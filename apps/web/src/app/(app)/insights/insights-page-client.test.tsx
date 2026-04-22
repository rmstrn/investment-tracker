/**
 * Vitest smoke tests for Slice 6a — Insights Feed UI.
 * Tests: severity mapping, dismiss flow, empty states (2 variants), error state.
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Insight } from '../../../lib/api/insights';

// ---------------------------------------------------------------------------
// Mock next/navigation — InsightFilters + InsightsPageClient need these
// ---------------------------------------------------------------------------
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/insights',
}));

// ---------------------------------------------------------------------------
// Mock hooks
// ---------------------------------------------------------------------------

const insightsMock = vi.fn();
const accountsMock = vi.fn();
const localDismissMock = vi.fn();

vi.mock('../../../hooks/useInsights', () => ({
  useInsights: (...args: unknown[]) => insightsMock(...args),
}));

vi.mock('../../../hooks/useAccounts', () => ({
  useAccounts: (...args: unknown[]) => accountsMock(...args),
}));

vi.mock('../../../hooks/useLocalDismissedInsights', () => ({
  useLocalDismissedInsights: () => localDismissMock(),
}));

// Import after mocks
import { InsightsPageClient } from './insights-page-client';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeInsight(overrides: Partial<Insight> = {}): Insight {
  return {
    id: 'aaaaaaaa-0000-0000-0000-000000000001',
    insight_type: 'risk',
    title: 'High concentration in tech',
    body: 'Over 60% of your portfolio is in technology stocks.',
    severity: 'warning',
    generated_at: '2026-04-21T10:00:00Z',
    viewed_at: null,
    dismissed_at: null,
    data: {},
    ...overrides,
  };
}

function makeInsightsQuery(insights: Insight[], overrides: Record<string, unknown> = {}) {
  return {
    data: { pages: [{ data: insights, meta: { next_cursor: null, has_more: false } }] },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    ...overrides,
  };
}

function defaultDismiss() {
  return {
    dismiss: vi.fn(),
    isDismissed: () => false,
    reset: vi.fn(),
  };
}

function renderPage() {
  return render(<InsightsPageClient />);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('InsightsPageClient', () => {
  beforeEach(() => {
    insightsMock.mockReset();
    accountsMock.mockReset();
    localDismissMock.mockReset();
    localDismissMock.mockReturnValue(defaultDismiss());
  });

  it('maps critical severity to negative InsightCard bar (negative class)', () => {
    accountsMock.mockReturnValue({ data: [{ id: 'acc-1' }], isLoading: false });
    insightsMock.mockReturnValue(
      makeInsightsQuery([
        makeInsight({
          id: 'ins-critical',
          severity: 'critical',
          title: 'Critical portfolio risk',
          body: 'Immediate rebalancing recommended.',
        }),
      ]),
    );

    renderPage();

    // InsightCard renders the title — confirms it rendered
    expect(screen.getByText('Critical portfolio risk')).toBeInTheDocument();
    // The kicker for insight_type='risk' appears in card + filter select <option>
    expect(screen.getAllByText('Risk').length).toBeGreaterThanOrEqual(1);
    // The severity bar div with negative class should be present in DOM
    // InsightCard renders: <div class="... bg-state-negative-default ..." aria-hidden="true" />
    const bars = document.querySelectorAll('[aria-hidden="true"]');
    const hasNegativeBar = Array.from(bars).some((el) =>
      el.className.includes('bg-state-negative-default'),
    );
    expect(hasNegativeBar).toBe(true);
  });

  it('removes card from DOM when dismiss is clicked', () => {
    accountsMock.mockReturnValue({ data: [{ id: 'acc-1' }], isLoading: false });
    const dismissFn = vi.fn();

    // First render: card visible (not dismissed)
    localDismissMock.mockReturnValue({
      dismiss: dismissFn,
      isDismissed: (id: string) => id === 'ins-to-dismiss' && dismissFn.mock.calls.length > 0,
      reset: vi.fn(),
    });

    insightsMock.mockReturnValue(
      makeInsightsQuery([
        makeInsight({
          id: 'ins-to-dismiss',
          title: 'Dismiss me',
          body: 'This insight will be dismissed.',
        }),
      ]),
    );

    const { rerender } = renderPage();
    expect(screen.getByText('Dismiss me')).toBeInTheDocument();

    // Click the kebab trigger to open menu
    const kebabBtn = screen.getByRole('button', { name: /insight options/i });
    fireEvent.click(kebabBtn);

    // Click the Dismiss menu item
    const dismissItem = screen.getByRole('menuitem', { name: /dismiss/i });
    fireEvent.click(dismissItem);

    expect(dismissFn).toHaveBeenCalledWith('ins-to-dismiss');

    // Now simulate isDismissed returning true for that id
    localDismissMock.mockReturnValue({
      dismiss: dismissFn,
      isDismissed: (id: string) => id === 'ins-to-dismiss',
      reset: vi.fn(),
    });

    rerender(<InsightsPageClient />);
    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
  });

  it('shows "Connect account" empty state when user has no accounts', () => {
    accountsMock.mockReturnValue({ data: [], isLoading: false });
    insightsMock.mockReturnValue(makeInsightsQuery([]));

    renderPage();

    expect(
      screen.getByText(/connect an account to get personalised insights/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /connect account/i })).toHaveAttribute(
      'href',
      '/accounts',
    );
  });

  it('shows generic empty state when user has accounts but no insights', () => {
    accountsMock.mockReturnValue({ data: [{ id: 'acc-1' }], isLoading: false });
    insightsMock.mockReturnValue(makeInsightsQuery([]));

    renderPage();

    expect(screen.getByText(/no insights yet/i)).toBeInTheDocument();
  });

  it('shows error state with retry button when query fails', () => {
    accountsMock.mockReturnValue({ data: [], isLoading: false });
    const refetchFn = vi.fn();
    insightsMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: refetchFn,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    renderPage();

    expect(screen.getByText(/couldn't load insights/i)).toBeInTheDocument();
    const retryBtn = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryBtn);
    expect(refetchFn).toHaveBeenCalled();
  });
});
