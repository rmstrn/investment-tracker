// Comprehensive tests — Provedo landing v2 «The Ledger That Talks» (2026-04-27).
// Covers each section component, sub-primitives, modal interaction, and
// per-resolution expectations (#1-#8).
//
// Tests run with prefers-reduced-motion forced ON to bypass the 6.5s hero
// timeline; the hero renders in its final state under reduced motion which
// makes assertions deterministic without timer mocking.

import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LandingAskQuestion } from './_components/LandingAskQuestion';
import { LandingClosingCTA } from './_components/LandingClosingCTA';
import { LandingCoverage } from './_components/LandingCoverage';
import { LandingDifferentiators } from './_components/LandingDifferentiators';
import { LandingEarlyAccessModal } from './_components/LandingEarlyAccessModal';
import { LandingHero } from './_components/LandingHero';
import { LandingTrustBand } from './_components/LandingTrustBand';
import { ProvedoFAQ } from './_components/ProvedoFAQ';
import { BrokerLogoStrip } from './_components/landing/BrokerLogoStrip';
import { CitationLink } from './_components/landing/CitationLink';
import { ConversationCard } from './_components/landing/ConversationCard';
import { ConversationMessage } from './_components/landing/ConversationMessage';
import { Ledger } from './_components/landing/Ledger';
import { LedgerRow } from './_components/landing/LedgerRow';
import { PenMarkUnderline } from './_components/landing/PenMarkUnderline';

// Browser API shims (matchMedia, IntersectionObserver, HTMLDialogElement) live
// in `vitest.setup.ts` — applied globally so reduced-motion is force-on for
// every test and the hero renders its final state synchronously.

// ── Section 1: Hero ────────────────────────────────────────────────────────
describe('LandingHero — section 1', () => {
  it('renders the locked H1 verbatim (resolution #3 — copy LOCKED)', () => {
    render(<LandingHero />);
    const h1 = screen.getByRole('heading', { level: 1 });
    // The H1 has hard <br/> line breaks for desktop layout; happy-dom does
    // not insert whitespace between adjacent text nodes and <br/>. Assert
    // each LOCKED line individually + an anti-leak compact comparison.
    expect(h1.textContent).toContain('Provedo will lead');
    expect(h1.textContent).toContain('you through your');
    expect(h1.textContent).toContain('portfolio.');
    const compact = (h1.textContent ?? '').replace(/\s+/g, '');
    expect(compact).toBe('Provedowillleadyouthroughyourportfolio.');
  });

  it('renders the locked sub copy verbatim', () => {
    render(<LandingHero />);
    expect(screen.getByText("Notice what you'd miss across all your brokers.")).toBeInTheDocument();
  });

  it('renders the trust pill with three claims separated by middle dots', () => {
    render(<LandingHero />);
    const pill = screen.getByTestId('hero-trust-pill');
    expect(pill).toHaveTextContent('Read-only · No trading · No advice');
  });

  it('renders the CTA microcopy with three friction-killers', () => {
    render(<LandingHero />);
    expect(
      screen.getByText('No card. Look without connecting. Read-only when you connect.'),
    ).toBeInTheDocument();
  });

  it('renders the Ledger card with mock account rows', () => {
    render(<LandingHero />);
    expect(screen.getByTestId('ledger-card')).toBeInTheDocument();
    expect(screen.getByTestId('ledger-row-ibkr')).toHaveTextContent('IBKR');
    expect(screen.getByTestId('ledger-row-t212')).toHaveTextContent('Trading 212');
    expect(screen.getByTestId('ledger-row-krak')).toHaveTextContent('Kraken');
    expect(screen.getByTestId('ledger-row-total')).toHaveTextContent('$431,000');
  });

  it('renders the Conversation card with user + Provedo messages and Sources', () => {
    render(<LandingHero />);
    expect(screen.getByTestId('conversation-card')).toBeInTheDocument();
    expect(screen.getByTestId('conversation-message-user')).toHaveTextContent(
      /why is nvda flagged/i,
    );
    expect(screen.getByTestId('conversation-message-provedo')).toHaveTextContent(/4\.2pp/);
    expect(screen.getByTestId('provedo-sources')).toHaveTextContent(/IBKR · positions · today/);
  });

  it('does NOT render the retired ChatPromptPicker chip group', () => {
    render(<LandingHero />);
    // The v1 hero had chips like «Why is NVDA flagged?» as buttons; v2 does
    // not. The user message is plain text, not a button.
    expect(screen.queryByRole('button', { name: /why is nvda flagged/i })).not.toBeInTheDocument();
  });

  it('renders the citation chip linking to ledger-row-nvda anchor', () => {
    render(<LandingHero />);
    const link = screen.getByTestId('citation-link-1');
    expect(link).toHaveAttribute('href', '#ledger-row-nvda');
  });

  it('CTA dispatches the open-early-access event when clicked', () => {
    render(<LandingHero />);
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    const cta = screen.getByTestId('hero-cta');
    fireEvent.click(cta);
    const calls = dispatchSpy.mock.calls.flat() as Array<Event>;
    const matched = calls.find((e) => e.type === 'provedo:open-early-access');
    expect(matched).toBeDefined();
    dispatchSpy.mockRestore();
  });
});

// ── Section 2: Ask the question ────────────────────────────────────────────
describe('LandingAskQuestion — section 2', () => {
  it('renders the H2 verbatim from content-lead doc', () => {
    render(<LandingAskQuestion />);
    expect(
      screen.getByRole('heading', { level: 2, name: /ask the question you've been googling/i }),
    ).toBeInTheDocument();
  });

  it('renders the load-bearing transcript with a static user question', () => {
    render(<LandingAskQuestion />);
    expect(screen.getByTestId('ask-question-user')).toHaveTextContent(
      /how concentrated am i in tech right now/i,
    );
  });

  it('renders inline citation chips in the answer transcript', () => {
    render(<LandingAskQuestion />);
    const answer = screen.getByTestId('ask-question-answer');
    // Three superscript citations preceding AAPL, NVDA, GOOGL
    expect(answer.textContent).toMatch(/AAPL/);
    expect(answer.textContent).toMatch(/NVDA/);
    expect(answer.textContent).toMatch(/GOOGL/);
  });

  it('renders the Sources line with date-stamped sources', () => {
    render(<LandingAskQuestion />);
    const sources = screen.getByTestId('provedo-sources');
    expect(sources).toHaveTextContent(/Schwab statement · 2026-04-26/);
    expect(sources).toHaveTextContent(/IBKR positions · today/);
  });

  it('renders the verbatim caption under the transcript', () => {
    render(<LandingAskQuestion />);
    expect(
      screen.getByText(
        /every answer cites the position, the broker, and the date\. you can verify in two clicks\./i,
      ),
    ).toBeInTheDocument();
  });
});

// ── Section 3: Coverage ────────────────────────────────────────────────────
describe('LandingCoverage — section 3', () => {
  it('renders H2 + body copy', () => {
    render(<LandingCoverage />);
    expect(
      screen.getByRole('heading', { level: 2, name: /every account\. one conversation/i }),
    ).toBeInTheDocument();
  });

  it('uses «Hundreds» fallback per resolution #2 (TD-095 still open)', () => {
    render(<LandingCoverage />);
    expect(screen.getByText(/hundreds of institutions supported/i)).toBeInTheDocument();
    expect(screen.queryByText(/over 1,000/i)).not.toBeInTheDocument();
  });

  it('renders the 12 wordmark broker cells (resolution #3 — text, not SVG logos)', () => {
    render(<LandingCoverage />);
    const strip = screen.getByTestId('broker-logo-strip');
    expect(strip).toBeInTheDocument();
    // Spot-check the canonical 12 wordmarks
    expect(within(strip).getByText('Schwab')).toBeInTheDocument();
    expect(within(strip).getByText('Fidelity')).toBeInTheDocument();
    expect(within(strip).getByText('IBKR')).toBeInTheDocument();
    expect(within(strip).getByText('Vanguard')).toBeInTheDocument();
    expect(within(strip).getByText('Robinhood')).toBeInTheDocument();
    expect(within(strip).getByText('E*TRADE')).toBeInTheDocument();
    expect(within(strip).getByText('Trading 212')).toBeInTheDocument();
    expect(within(strip).getByText('Revolut')).toBeInTheDocument();
    expect(within(strip).getByText('Coinbase')).toBeInTheDocument();
    expect(within(strip).getByText('Binance')).toBeInTheDocument();
    expect(within(strip).getByText('Kraken')).toBeInTheDocument();
    expect(within(strip).getByText('Ledger')).toBeInTheDocument();
  });

  it('renders the see-full-list link', () => {
    render(<LandingCoverage />);
    expect(screen.getByTestId('coverage-see-full')).toHaveTextContent(/see full institution list/i);
  });
});

// ── Section 4: Differentiators ─────────────────────────────────────────────
describe('LandingDifferentiators — section 4', () => {
  it('renders the H2 verbatim', () => {
    render(<LandingDifferentiators />);
    expect(
      screen.getByRole('heading', { level: 2, name: /the things hiding between your brokers/i }),
    ).toBeInTheDocument();
  });

  it('renders all 3 cards with content-lead numerals + headers + body', () => {
    render(<LandingDifferentiators />);
    expect(screen.getByTestId('differentiator-card-01')).toHaveTextContent(
      /dividend you didn't know/i,
    );
    expect(screen.getByTestId('differentiator-card-02')).toHaveTextContent(/holding twice/i);
    expect(screen.getByTestId('differentiator-card-03')).toHaveTextContent(
      /drawdown you'd only notice in april/i,
    );
  });

  it('uses observation verbs (notices/flags/surface) — Lane A discipline', () => {
    render(<LandingDifferentiators />);
    expect(screen.getByText(/three things provedo notices/i)).toBeInTheDocument();
    expect(screen.getByText(/provedo flags upcoming distributions/i)).toBeInTheDocument();
    expect(screen.getByText(/cross-account drawdowns surface/i)).toBeInTheDocument();
  });

  it('does NOT use any banned imperative verbs (buy/sell/rebalance)', () => {
    const { container } = render(<LandingDifferentiators />);
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/\bbuy\b/i);
    expect(text).not.toMatch(/\bsell\b/i);
    expect(text).not.toMatch(/\brebalance\b/i);
  });
});

// ── Section 5: Trust band ──────────────────────────────────────────────────
describe('LandingTrustBand — section 5', () => {
  it('renders H2 verbatim', () => {
    render(<LandingTrustBand />);
    expect(
      screen.getByRole('heading', { level: 2, name: /read-only\. no advice\. no surprises/i }),
    ).toBeInTheDocument();
  });

  it('renders 3 trust statements with verbatim body copy', () => {
    render(<LandingTrustBand />);
    expect(
      screen.getByText(/provedo can see your positions\. it cannot move them\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/we don't tell you what to do with it\./i)).toBeInTheDocument();
    expect(screen.getByText(/you can delete everything in one click\./i)).toBeInTheDocument();
  });
});

// ── Section 6: Closing CTA ─────────────────────────────────────────────────
describe('LandingClosingCTA — section 6', () => {
  it('renders the H2 verbatim', () => {
    render(<LandingClosingCTA />);
    expect(
      screen.getByRole('heading', { level: 2, name: /it only takes one question/i }),
    ).toBeInTheDocument();
  });

  it('CTA dispatches open-early-access event', () => {
    render(<LandingClosingCTA />);
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    fireEvent.click(screen.getByTestId('closing-cta'));
    const calls = dispatchSpy.mock.calls.flat() as Array<Event>;
    expect(calls.some((e) => e.type === 'provedo:open-early-access')).toBe(true);
    dispatchSpy.mockRestore();
  });

  it('renders the pre-alpha microcopy', () => {
    render(<LandingClosingCTA />);
    expect(screen.getByText(/we're letting people in slowly/i)).toBeInTheDocument();
  });
});

// ── Modal: Early Access ────────────────────────────────────────────────────
describe('LandingEarlyAccessModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('does not render content until opened', () => {
    render(<LandingEarlyAccessModal />);
    const modal = screen.getByTestId('early-access-modal');
    expect(modal).not.toHaveAttribute('open');
  });

  it('opens when the open-early-access event fires', async () => {
    render(<LandingEarlyAccessModal />);
    window.dispatchEvent(new CustomEvent('provedo:open-early-access'));
    await waitFor(() => {
      expect(screen.getByTestId('early-access-modal')).toHaveAttribute('open');
    });
    expect(screen.getByTestId('early-access-form')).toBeInTheDocument();
    expect(screen.getByTestId('early-access-email')).toBeInTheDocument();
  });

  it('closes when the close button is clicked', async () => {
    render(<LandingEarlyAccessModal />);
    window.dispatchEvent(new CustomEvent('provedo:open-early-access'));
    await waitFor(() => {
      expect(screen.getByTestId('early-access-modal')).toHaveAttribute('open');
    });
    fireEvent.click(screen.getByTestId('early-access-close'));
    await waitFor(() => {
      expect(screen.getByTestId('early-access-modal')).not.toHaveAttribute('open');
    });
  });

  it('submits to /api/early-access on form submit', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<LandingEarlyAccessModal />);
    window.dispatchEvent(new CustomEvent('provedo:open-early-access'));
    await waitFor(() => {
      expect(screen.getByTestId('early-access-form')).toBeInTheDocument();
    });

    const emailInput = screen.getByTestId('early-access-email') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.submit(screen.getByTestId('early-access-form'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/early-access',
        expect.objectContaining({ method: 'POST' }),
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/thanks/i)).toBeInTheDocument();
    });

    vi.unstubAllGlobals();
  });

  it('shows error message when API responds non-OK', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ success: false, error: 'Email format is invalid' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<LandingEarlyAccessModal />);
    window.dispatchEvent(new CustomEvent('provedo:open-early-access'));
    await waitFor(() => {
      expect(screen.getByTestId('early-access-form')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('early-access-email'), {
      target: { value: 'bad' },
    });
    fireEvent.submit(screen.getByTestId('early-access-form'));

    await waitFor(() => {
      expect(screen.getByTestId('early-access-error')).toHaveTextContent(/invalid/i);
    });

    vi.unstubAllGlobals();
  });
});

// ── Sub-primitives ─────────────────────────────────────────────────────────
describe('LedgerRow primitive', () => {
  it('renders label + context + value', () => {
    render(<LedgerRow row={{ id: 'test', label: 'IBKR', context: 'US', value: '$312,000' }} />);
    const row = screen.getByTestId('ledger-row-test');
    expect(row).toHaveTextContent('IBKR');
    expect(row).toHaveTextContent('US');
    expect(row).toHaveTextContent('$312,000');
  });

  it('marks the citation row data-row-active when isCitationActive=true', () => {
    render(
      <LedgerRow
        row={{ id: 'drift', label: 'Top drift', context: 'NVDA', value: '+4.2pp' }}
        isCitationActive
      />,
    );
    expect(screen.getByTestId('ledger-row-drift')).toHaveAttribute('data-row-active', 'true');
  });
});

describe('CitationLink primitive', () => {
  it('renders the index inside the chip', () => {
    render(<CitationLink index={1} targetId="anchor" />);
    expect(screen.getByTestId('citation-link-1')).toHaveTextContent('1');
  });

  it('uses the correct anchor href', () => {
    render(<CitationLink index={2} targetId="ledger-row-nvda" />);
    expect(screen.getByTestId('citation-link-2')).toHaveAttribute('href', '#ledger-row-nvda');
  });

  it('fires onActivate on hover and onDeactivate on leave', () => {
    const onActivate = vi.fn();
    const onDeactivate = vi.fn();
    render(
      <CitationLink
        index={1}
        targetId="anchor"
        onActivate={onActivate}
        onDeactivate={onDeactivate}
      />,
    );
    const link = screen.getByTestId('citation-link-1');
    fireEvent.mouseEnter(link);
    expect(onActivate).toHaveBeenCalledTimes(1);
    fireEvent.mouseLeave(link);
    expect(onDeactivate).toHaveBeenCalledTimes(1);
  });
});

describe('PenMarkUnderline primitive', () => {
  it('renders with clip-path collapsed when not active', () => {
    render(<PenMarkUnderline active={false} />);
    const underline = screen.getByTestId('pen-mark-underline');
    expect(underline.style.clipPath).toContain('inset(0 100% 0 0)');
  });

  it('renders fully drawn when active', () => {
    render(<PenMarkUnderline active />);
    const underline = screen.getByTestId('pen-mark-underline');
    expect(underline.style.clipPath).toContain('inset(0 0% 0 0)');
  });
});

describe('Ledger primitive', () => {
  it('renders 3 account rows + total + 3 observation rows', () => {
    render(
      <Ledger
        penMarkActive={false}
        activeCitationId={null}
        onCitationActivate={() => {}}
        onCitationDeactivate={() => {}}
      />,
    );
    expect(screen.getByTestId('ledger-row-ibkr')).toBeInTheDocument();
    expect(screen.getByTestId('ledger-row-t212')).toBeInTheDocument();
    expect(screen.getByTestId('ledger-row-krak')).toBeInTheDocument();
    expect(screen.getByTestId('ledger-row-total')).toBeInTheDocument();
    expect(screen.getByTestId('ledger-row-drift')).toBeInTheDocument();
    expect(screen.getByTestId('ledger-row-div')).toBeInTheDocument();
    expect(screen.getByTestId('ledger-row-fx')).toBeInTheDocument();
  });
});

describe('ConversationCard primitive', () => {
  it('renders the lowercase mono label + Sources line', () => {
    render(
      <ConversationCard sources={['IBKR · positions · today']}>
        <ConversationMessage variant="user">test</ConversationMessage>
      </ConversationCard>,
    );
    expect(screen.getByTestId('conversation-card')).toHaveTextContent('conversation');
    expect(screen.getByTestId('provedo-sources')).toHaveTextContent('IBKR · positions · today');
  });
});

describe('BrokerLogoStrip primitive', () => {
  it('renders wordmarks as text (not SVG logos) — resolution #3', () => {
    render(<BrokerLogoStrip wordmarks={[{ name: 'Schwab' }, { name: 'IBKR' }]} />);
    const strip = screen.getByTestId('broker-logo-strip');
    expect(strip.querySelectorAll('svg').length).toBe(0);
    expect(within(strip).getByText('Schwab')).toBeInTheDocument();
    expect(within(strip).getByText('IBKR')).toBeInTheDocument();
  });
});

// ── FAQ — Q1 copy revision per resolution #8 ───────────────────────────────
describe('ProvedoFAQ — Q1 copy revision (resolution #8)', () => {
  it('does NOT contain the word «foresight» in any answer', () => {
    const { container } = render(<ProvedoFAQ />);
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/foresight/i);
  });

  it('Q1 answer uses observation/citations framing', () => {
    render(<ProvedoFAQ />);
    expect(
      screen.getByText(
        /no\. provedo provides clarity, observation, context, and citations — never advice/i,
      ),
    ).toBeInTheDocument();
  });
});
