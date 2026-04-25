// Smoke tests — Provedo landing v2 (Slice-LP2)
// Coverage: 10 sections × 3-4 tests each = ~40 tests + cross-section + guardrail checks
// Test shape: render → getByRole/getByText → assertion (AAA pattern)
// Does NOT import 'use client' components with DOM APIs — uses dedicated component-level mocks.

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProvedoDemoTabsV2 } from './_components/ProvedoDemoTabsV2';
import { ProvedoEditorialNarrative } from './_components/ProvedoEditorialNarrative';
import { ProvedoFAQ } from './_components/ProvedoFAQ';
import { ProvedoInsightsBullets } from './_components/ProvedoInsightsBullets';
import { ProvedoNegationSection } from './_components/ProvedoNegationSection';
import { ProvedoNumericProofBar } from './_components/ProvedoNumericProofBar';
import { ProvedoRepeatCTAV2 } from './_components/ProvedoRepeatCTAV2';
import { ProvedoTestimonialCards } from './_components/ProvedoTestimonialCards';
import { AllocationPieBar } from './_components/charts/AllocationPieBar';
import { DividendCalendar } from './_components/charts/DividendCalendar';
import { PnlSparkline } from './_components/charts/PnlSparkline';
import { TradeTimeline } from './_components/charts/TradeTimeline';
import MarketingHomePage, { metadata } from './page';

// ─── Page-level smoke tests ────────────────────────────────────────────────

describe('MarketingHomePage v2', () => {
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
    const askCta = screen.getAllByRole('link', { name: /ask provedo/i });
    expect(askCta.length).toBeGreaterThanOrEqual(1);
    expect(askCta[0]).toHaveAttribute('href', '#demo');
  });

  it('sets robots noindex for staging deploy', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it('renders OG description without trial mention (v2 delta)', () => {
    const ogDesc =
      typeof metadata.openGraph === 'object' && metadata.openGraph
        ? (metadata.openGraph as { description?: string }).description
        : '';
    expect(ogDesc).not.toMatch(/14 days/i);
    expect(ogDesc).toMatch(/free forever/i);
  });

  it('renders all 10 landmark sections (via headings)', () => {
    render(<MarketingHomePage />);
    // S1 Hero — h1
    expect(
      screen.getByRole('heading', { level: 1, name: /provedo will lead you through/i }),
    ).toBeInTheDocument();
    // S2 Proof bar — has «Proof points» aria-label
    expect(screen.getByRole('region', { name: /proof points/i })).toBeInTheDocument();
    // S3 Negation — h2 with «This is what Provedo is not»
    expect(
      screen.getByRole('region', { name: /this is what provedo is not/i }),
    ).toBeInTheDocument();
    // S4 Demo tabs — «Ask anything.» (v3 Patch C)
    expect(screen.getByRole('region', { name: /ask anything/i })).toBeInTheDocument();
    // S5 Insights — «A few minutes a day» (v3 Patch B)
    expect(screen.getByRole('region', { name: /a few minutes a day/i })).toBeInTheDocument();
    // S6 Editorial — «One place. One feed. One chat.» (v3)
    expect(screen.getByRole('region', { name: /one place/i })).toBeInTheDocument();
    // S7 Testimonials — «What testers will be noticing.»
    expect(
      screen.getByRole('region', { name: /what testers will be noticing/i }),
    ).toBeInTheDocument();
    // S8 Aggregation — «One chat holds everything.»
    expect(screen.getByRole('region', { name: /one chat holds everything/i })).toBeInTheDocument();
    // S9 FAQ — «Common questions»
    expect(screen.getByRole('region', { name: /common questions/i })).toBeInTheDocument();
    // S10 Repeat CTA — «Open Provedo when you're ready.»
    expect(
      screen.getByRole('region', { name: /open provedo when you.re ready/i }),
    ).toBeInTheDocument();
  });
});

// ─── S2 Numeric proof bar ──────────────────────────────────────────────────

describe('ProvedoNumericProofBar', () => {
  it('renders 3 proof cells (v3 Patch A)', () => {
    render(<ProvedoNumericProofBar />);
    expect(screen.getByText('brokers and exchanges')).toBeInTheDocument();
    expect(screen.getByText('observation cited')).toBeInTheDocument();
    // Cell 3 is now Lane A — «information not advice» (Patch A)
    expect(screen.getByText(/lane a — information not advice/i)).toBeInTheDocument();
  });

  it('uses "100s" fallback by default', () => {
    render(<ProvedoNumericProofBar />);
    expect(screen.getByText('100s')).toBeInTheDocument();
  });

  it('renders "1000+" when coverage prop is provided', () => {
    render(<ProvedoNumericProofBar coverage="1000+" />);
    expect(screen.getByText('1000+')).toBeInTheDocument();
  });

  it('renders Lane A «100%» cell (v3 Patch A — replaces $0/month)', () => {
    render(<ProvedoNumericProofBar />);
    // Cell 3: animated count-up target = 100% — renders as 0 initially (count starts on scroll)
    expect(screen.getByText(/no robo-advisor, no brokerage/i)).toBeInTheDocument();
  });

  it('section has correct aria-label', () => {
    render(<ProvedoNumericProofBar />);
    expect(screen.getByRole('region', { name: /proof points/i })).toBeInTheDocument();
  });
});

// ─── S3 Problem-negation ───────────────────────────────────────────────────

describe('ProvedoNegationSection', () => {
  it('renders the section heading', () => {
    render(<ProvedoNegationSection />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('contains «not a robo-advisor» negation line', () => {
    const { container } = render(<ProvedoNegationSection />);
    expect(container.textContent).toMatch(/not a robo-advisor/i);
  });

  it('contains «not a brokerage» negation line', () => {
    const { container } = render(<ProvedoNegationSection />);
    expect(container.textContent).toMatch(/not a brokerage/i);
  });

  it('contains «not advice» column (v3 visual rebuild)', () => {
    const { container } = render(<ProvedoNegationSection />);
    // v3: 3-column grid with «Not advice» label + «tells you what to buy» sub-label
    expect(container.textContent).toMatch(/not advice/i);
    expect(container.textContent).toMatch(/tells you what to buy/i);
  });

  it('renders affirmation closer with allowlist verbs', () => {
    render(<ProvedoNegationSection />);
    expect(screen.getByText(/holds your portfolio across every broker/i)).toBeInTheDocument();
  });
});

// ─── S4 Demo tabs v2 ──────────────────────────────────────────────────────

describe('ProvedoDemoTabsV2', () => {
  it('renders all four tab triggers', () => {
    render(<ProvedoDemoTabsV2 />);
    expect(screen.getByRole('tab', { name: /why\?/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /dividends/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /patterns/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /aggregate/i })).toBeInTheDocument();
  });

  it('renders v3 section sub «Four real questions» (Patch C)', () => {
    render(<ProvedoDemoTabsV2 />);
    expect(screen.getByText(/four real questions/i)).toBeInTheDocument();
  });

  it('shows Why? tab content by default', () => {
    render(<ProvedoDemoTabsV2 />);
    expect(screen.getByText(/why is my portfolio down this month/i)).toBeInTheDocument();
  });

  it('switches to Dividends tab content on click', () => {
    render(<ProvedoDemoTabsV2 />);
    fireEvent.click(screen.getByRole('tab', { name: /dividends/i }));
    expect(screen.getByText(/when are dividends coming this quarter/i)).toBeInTheDocument();
  });

  it('switches to Patterns tab and shows «no judgment, no advice» disclaim', () => {
    render(<ProvedoDemoTabsV2 />);
    fireEvent.click(screen.getByRole('tab', { name: /patterns/i }));
    expect(screen.getByText(/no judgment, no advice/i)).toBeInTheDocument();
  });

  it('switches to Aggregate tab and shows cross-broker content', () => {
    render(<ProvedoDemoTabsV2 />);
    fireEvent.click(screen.getByRole('tab', { name: /aggregate/i }));
    expect(screen.getByText(/how much tech am i holding across ibkr/i)).toBeInTheDocument();
  });
});

// ─── SVG chart components ──────────────────────────────────────────────────

describe('PnlSparkline', () => {
  it('renders with role="img" and descriptive aria-label', () => {
    render(<PnlSparkline />);
    const svg = screen.getByRole('img');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-label', expect.stringMatching(/p&l/i));
  });

  it('shows −4.2% end label', () => {
    render(<PnlSparkline />);
    expect(screen.getByText('−4.2%')).toBeInTheDocument();
  });

  it('labels AAPL and TSLA emphasis points', () => {
    render(<PnlSparkline />);
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('TSLA')).toBeInTheDocument();
  });
});

describe('DividendCalendar', () => {
  it('renders with role="img" and descriptive aria-label', () => {
    render(<DividendCalendar />);
    const svg = screen.getByRole('img');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-label', expect.stringMatching(/dividend calendar/i));
  });

  it('renders visible caption for WCAG color-not-only compliance', () => {
    render(<DividendCalendar />);
    expect(screen.getByText(/KO Sept 14/)).toBeInTheDocument();
    expect(screen.getByText(/VZ Oct 7/)).toBeInTheDocument();
    expect(screen.getByText(/MSFT Nov 19/)).toBeInTheDocument();
  });
});

describe('TradeTimeline', () => {
  it('renders with role="img" and aria-label describing sell points', () => {
    render(<TradeTimeline />);
    const svg = screen.getByRole('img');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-label', expect.stringMatching(/sell points/i));
  });

  it('renders accessible fallback <details> table', () => {
    render(<TradeTimeline />);
    expect(screen.getByText(/view data table/i)).toBeInTheDocument();
  });

  it('aria-label includes «no judgment, no advice» framing', () => {
    render(<TradeTimeline />);
    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('aria-label', expect.stringMatching(/no judgment, no advice/i));
  });
});

describe('AllocationPieBar', () => {
  it('renders with role="img" and descriptive aria-label', () => {
    render(<AllocationPieBar />);
    const svg = screen.getByRole('img');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-label', expect.stringMatching(/allocation/i));
  });

  it('renders mandatory visible data table (WCAG color-not-only)', () => {
    const { container } = render(<AllocationPieBar />);
    // Caption paragraph contains all four allocation labels
    expect(container.textContent).toMatch(/Tech 58%/);
    expect(container.textContent).toMatch(/Financials 18%/);
  });

  it('labels all 4 slices', () => {
    const { container } = render(<AllocationPieBar />);
    expect(container.textContent).toMatch(/healthcare 14%/i);
    expect(container.textContent).toMatch(/other 10%/i);
  });
});

// ─── S5 Insights bullets ──────────────────────────────────────────────────

describe('ProvedoInsightsBullets', () => {
  it('renders section heading (v3 Patch B: week → day)', () => {
    render(<ProvedoInsightsBullets />);
    expect(
      screen.getByRole('heading', { level: 2, name: /a few minutes a day/i }),
    ).toBeInTheDocument();
  });

  it('renders «seven broker emails» bolded emphasis (v2 delta)', () => {
    render(<ProvedoInsightsBullets />);
    expect(screen.getByText(/seven broker emails/i)).toBeInTheDocument();
  });

  it('renders 3 proof bullet cards', () => {
    render(<ProvedoInsightsBullets />);
    expect(screen.getByText(/holds context across every broker/i)).toBeInTheDocument();
    expect(screen.getByText(/surfaces what would slip past/i)).toBeInTheDocument();
    expect(screen.getByText(/cites every observation/i)).toBeInTheDocument();
  });
});

// ─── S6 Editorial narrative ───────────────────────────────────────────────

describe('ProvedoEditorialNarrative', () => {
  it('renders section heading «One place. One feed. One chat.» (v3)', () => {
    render(<ProvedoEditorialNarrative />);
    expect(
      screen.getByRole('heading', { level: 2, name: /one place. one feed. one chat./i }),
    ).toBeInTheDocument();
  });

  it('renders PO-locked closing line — candidate #2', () => {
    render(<ProvedoEditorialNarrative />);
    expect(screen.getByText(/you hold the assets/i)).toBeInTheDocument();
    expect(screen.getByText(/provedo holds the context/i)).toBeInTheDocument();
  });

  it('renders body text with allowlist verbs', () => {
    render(<ProvedoEditorialNarrative />);
    expect(screen.getByText(/provedo holds it in one place/i)).toBeInTheDocument();
  });

  it('does NOT contain banned advisor-paternalism register', () => {
    const { container } = render(<ProvedoEditorialNarrative />);
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/thought partner/i);
    expect(text).not.toMatch(/modern financial advice/i);
    expect(text).not.toMatch(/built just for you/i);
  });
});

// ─── S7 Testimonial cards ─────────────────────────────────────────────────

describe('ProvedoTestimonialCards', () => {
  it('renders «Coming Q2 2026» badge', () => {
    render(<ProvedoTestimonialCards />);
    expect(screen.getByText(/coming q2 2026/i)).toBeInTheDocument();
  });

  it('renders honest pre-alpha disclaimer below cards', () => {
    render(<ProvedoTestimonialCards />);
    expect(screen.getByText(/quotes are from the team building the product/i)).toBeInTheDocument();
  });

  it('renders 3 quote cards as <figure><blockquote>', () => {
    render(<ProvedoTestimonialCards />);
    const figures = document.querySelectorAll('figure');
    expect(figures.length).toBe(3);
  });

  it('card 3 contains «No judgment, no advice» Lane A disclaim', () => {
    render(<ProvedoTestimonialCards />);
    expect(screen.getByText(/no judgment, no advice/i)).toBeInTheDocument();
  });

  it('attribution shows «builder at Provedo»', () => {
    render(<ProvedoTestimonialCards />);
    const builderLabels = screen.getAllByText(/builder/i);
    expect(builderLabels.length).toBeGreaterThanOrEqual(3);
  });
});

// ─── S9 FAQ ───────────────────────────────────────────────────────────────

describe('ProvedoFAQ', () => {
  it('renders section heading «Common questions»', () => {
    render(<ProvedoFAQ />);
    expect(
      screen.getByRole('heading', { level: 2, name: /common questions/i }),
    ).toBeInTheDocument();
  });

  it('renders all 6 FAQ questions', () => {
    render(<ProvedoFAQ />);
    expect(screen.getByText(/does provedo give investment advice/i)).toBeInTheDocument();
    expect(screen.getByText(/how is provedo different from a robo-advisor/i)).toBeInTheDocument();
    expect(screen.getByText(/which brokers are supported/i)).toBeInTheDocument();
    expect(screen.getByText(/what does provedo cost/i)).toBeInTheDocument();
    expect(screen.getByText(/is my data secure/i)).toBeInTheDocument();
    expect(screen.getByText(/what does .pre-alpha. mean/i)).toBeInTheDocument();
  });

  it('Q1 answer contains Lane A explicit disclaim', () => {
    render(<ProvedoFAQ />);
    expect(screen.getByText(/never advice, recommendations, or strategy/i)).toBeInTheDocument();
  });

  it('Q5 security answer mentions read-only connections', () => {
    render(<ProvedoFAQ />);
    expect(screen.getByText(/read-only api connections/i)).toBeInTheDocument();
  });

  it('renders native <details> elements (keyboard accessible)', () => {
    render(<ProvedoFAQ />);
    const details = document.querySelectorAll('details');
    expect(details.length).toBe(6);
  });
});

// ─── S10 Repeat CTA v2 ────────────────────────────────────────────────────

describe('ProvedoRepeatCTAV2', () => {
  it("renders v2 heading «Open Provedo when you're ready.»", () => {
    render(<ProvedoRepeatCTAV2 />);
    expect(
      screen.getByRole('heading', { level: 2, name: /open provedo when you.re ready/i }),
    ).toBeInTheDocument();
  });

  it('renders primary «Ask Provedo» CTA', () => {
    render(<ProvedoRepeatCTAV2 />);
    expect(screen.getByRole('link', { name: /ask provedo/i })).toBeInTheDocument();
  });

  it('renders secondary «Or start free forever» link', () => {
    render(<ProvedoRepeatCTAV2 />);
    expect(screen.getByRole('link', { name: /or start free forever/i })).toBeInTheDocument();
  });

  it('does NOT contain v1 «Ready when you are» copy', () => {
    const { container } = render(<ProvedoRepeatCTAV2 />);
    expect(container.textContent).not.toMatch(/ready when you are/i);
  });
});

// ─── EN guardrail audit (cross-component) ─────────────────────────────────

describe('EN guardrail audit — zero advisor-paternalism', () => {
  const BANNED_PHRASES = [
    /thought partner/i,
    /modern financial advice/i,
    /built just for you/i,
    /provedo recommends/i,
    /provedo advises/i,
    /provedo suggests/i,
    /provedo provides advice/i,
    /provedo provides guidance/i,
    /provedo provides strategy/i,
  ] as const;

  const componentsToAudit = [
    { name: 'NegationSection', element: <ProvedoNegationSection /> },
    { name: 'EditorialNarrative', element: <ProvedoEditorialNarrative /> },
    { name: 'TestimonialCards', element: <ProvedoTestimonialCards /> },
    { name: 'FAQ', element: <ProvedoFAQ /> },
    { name: 'RepeatCTAV2', element: <ProvedoRepeatCTAV2 /> },
    { name: 'InsightsBullets', element: <ProvedoInsightsBullets /> },
  ] as const;

  for (const comp of componentsToAudit) {
    for (const pattern of BANNED_PHRASES) {
      it(`${comp.name}: no «${pattern.source}» (guardrail)`, () => {
        const { container } = render(comp.element);
        expect(container.textContent ?? '').not.toMatch(pattern);
      });
    }
  }
});

// ─── No purple/violet anywhere ────────────────────────────────────────────

describe('Anti-pattern: no purple/violet', () => {
  it('ProvedoEditorialNarrative uses no purple/violet colors', () => {
    const { container } = render(<ProvedoEditorialNarrative />);
    const html = container.innerHTML;
    expect(html).not.toMatch(/purple/i);
    expect(html).not.toMatch(/violet/i);
    expect(html).not.toMatch(/#[56789][Dd][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]/);
  });
});
