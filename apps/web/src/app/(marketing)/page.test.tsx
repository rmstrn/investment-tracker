// Smoke tests — Provedo landing v2 (Slice-LP2) + v3.2 universal-improvements patches.
// Coverage: 10 sections × 3-4 tests each + cross-section + guardrail checks + Slice-LP3.2 deltas.
// Test shape: render → getByRole/getByText → assertion (AAA pattern)
// Does NOT import 'use client' components with DOM APIs — uses dedicated component-level mocks.

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MarketingFooter } from './_components/MarketingFooter';
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
import DisclosuresPage, { metadata as disclosuresMetadata } from './disclosures/page';
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

  it('renders OG description without trial mention (v2 delta) and without «free forever» (v3.2 delta)', () => {
    const ogDesc =
      typeof metadata.openGraph === 'object' && metadata.openGraph
        ? (metadata.openGraph as { description?: string }).description
        : '';
    expect(ogDesc).not.toMatch(/14 days/i);
    // v3.2: PO microcopy principle — no «free forever» framings in marketing surface.
    expect(ogDesc).not.toMatch(/free forever/i);
    expect(ogDesc).toMatch(/free tier/i);
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
    // S9 FAQ — «Questions you'd ask» (v3.2 Slice-LP3.2 rename)
    expect(screen.getByRole('region', { name: /questions you.d ask/i })).toBeInTheDocument();
    // S10 Repeat CTA — «Open Provedo when you're ready.»
    expect(
      screen.getByRole('region', { name: /open provedo when you.re ready/i }),
    ).toBeInTheDocument();
  });
});

// ─── S2 Numeric proof bar ──────────────────────────────────────────────────

describe('ProvedoNumericProofBar', () => {
  it('renders 4 proof cells (v3.2: time-anchor cell added)', () => {
    render(<ProvedoNumericProofBar />);
    expect(screen.getByText('brokers and exchanges')).toBeInTheDocument();
    expect(screen.getByText('observation cited')).toBeInTheDocument();
    // v3.2: Cell #3 NEW — time-anchor «5 min / a week / the whole habit»
    expect(screen.getByText('a week')).toBeInTheDocument();
    expect(screen.getByText(/the whole habit/i)).toBeInTheDocument();
    // v3.2: Cell #4 — «Lane A —» prefix dropped per PD spec V1
    expect(screen.getByText(/^information not advice$/i)).toBeInTheDocument();
    // v3.2: «Lane A —» prefix MUST be gone
    expect(screen.queryByText(/lane a — information not advice/i)).not.toBeInTheDocument();
  });

  it('renders «5 min» time-anchor token (v3.2 NEW)', () => {
    render(<ProvedoNumericProofBar />);
    expect(screen.getByText('5 min')).toBeInTheDocument();
  });

  it('renders audience-whisper micro-line (v3.2 NEW per PD spec V2)', () => {
    render(<ProvedoNumericProofBar />);
    expect(
      screen.getByText(/for investors who hold across more than one broker/i),
    ).toBeInTheDocument();
  });

  it('uses "100s" fallback by default', () => {
    render(<ProvedoNumericProofBar />);
    expect(screen.getByText('100s')).toBeInTheDocument();
  });

  it('renders "1000+" when coverage prop is provided', () => {
    render(<ProvedoNumericProofBar coverage="1000+" />);
    expect(screen.getByText('1000+')).toBeInTheDocument();
  });

  it('renders «100%» information-not-advice cell sub-line', () => {
    render(<ProvedoNumericProofBar />);
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
    // Badge text — exact match (sub-line uses different phrasing «Alpha quotes coming Q2 2026.»)
    expect(screen.getByText(/^coming q2 2026$/i)).toBeInTheDocument();
  });

  it('renders «Alpha quotes coming Q2 2026.» honest line in header (v3.2)', () => {
    render(<ProvedoTestimonialCards />);
    expect(screen.getByText(/alpha quotes coming q2 2026/i)).toBeInTheDocument();
  });

  it('renders single weighted quote (v3.2: was 3-card grid, now single figure)', () => {
    render(<ProvedoTestimonialCards />);
    const figures = document.querySelectorAll('figure');
    expect(figures.length).toBe(1);
  });

  it('renders the chat-surface quote («62% of the work, with sources»)', () => {
    render(<ProvedoTestimonialCards />);
    expect(screen.getByText(/62% of the work, with sources/i)).toBeInTheDocument();
  });

  it('attribution shows «builder at Provedo» on the single card', () => {
    render(<ProvedoTestimonialCards />);
    const builderLabels = screen.getAllByText(/builder/i);
    expect(builderLabels.length).toBeGreaterThanOrEqual(1);
  });
});

// ─── S9 FAQ ───────────────────────────────────────────────────────────────

describe('ProvedoFAQ', () => {
  it("renders section heading «Questions you'd ask» (v3.2 rename)", () => {
    render(<ProvedoFAQ />);
    expect(
      screen.getByRole('heading', { level: 2, name: /questions you.d ask/i }),
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

  it('does NOT render «Or start free forever» link (v3.2: dropped per PO microcopy principle)', () => {
    render(<ProvedoRepeatCTAV2 />);
    expect(screen.queryByRole('link', { name: /or start free forever/i })).not.toBeInTheDocument();
  });

  it('renders updated small-print «50 free questions a month» (v3.2)', () => {
    render(<ProvedoRepeatCTAV2 />);
    expect(screen.getByText(/50 free questions a month/i)).toBeInTheDocument();
  });

  it('keeps «Or see Plus pricing →» link (v3.2: kept, distinct from dropped sign-up link)', () => {
    render(<ProvedoRepeatCTAV2 />);
    expect(screen.getByRole('link', { name: /or see plus pricing/i })).toBeInTheDocument();
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

// ─── Slice-LP3.2 — Footer 3-layer disclaimer ─────────────────────────────

describe('MarketingFooter — 3-layer disclaimer (v3.2)', () => {
  it('Layer 1: renders plain-language summary', () => {
    render(<MarketingFooter />);
    expect(
      screen.getByText(/provedo provides general information about your portfolio/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/it is not personalized investment advice — every decision stays yours/i),
    ).toBeInTheDocument();
  });

  it('Layer 2: renders <details>/<summary> with locked summary copy', () => {
    render(<MarketingFooter />);
    const summaryText = screen.getByText(/full regulatory disclosures \(us, eu, uk\)/i);
    expect(summaryText).toBeInTheDocument();
    // Ensure native <details> wrapping for keyboard accessibility (PD spec V3)
    const details = summaryText.closest('details');
    expect(details).not.toBeNull();
    // The text is rendered inside a <summary> child of <details> for the focusable affordance
    const summary = summaryText.closest('summary');
    expect(summary).not.toBeNull();
    expect(summary?.tagName.toLowerCase()).toBe('summary');
  });

  it('Layer 2: contains verbatim 75-word regulator-readable block (preserved from 8cb509b)', () => {
    render(<MarketingFooter />);
    expect(
      screen.getByText(
        /provedo is not a registered investment advisor and is not a broker-dealer/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/u.s. investment advisers act of 1940, eu mifid ii, or uk fsma 2000/i),
    ).toBeInTheDocument();
  });

  it('Layer 3: renders link to /disclosures inside expanded Layer 2', () => {
    render(<MarketingFooter />);
    const link = screen.getByRole('link', { name: /read full extended disclosures/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/disclosures');
  });

  it('waitlist box CTA renamed «Try Plus free for 14 days» → «Open Provedo» (v3.2)', () => {
    render(<MarketingFooter />);
    expect(screen.getByRole('link', { name: /^open provedo$/i })).toBeInTheDocument();
    // Old «Try Plus free for 14 days» MUST be gone
    expect(screen.queryByText(/try plus free for 14 days/i)).not.toBeInTheDocument();
  });

  it('does NOT contain «free forever» / «free always» / «forever» framings (PO microcopy principle)', () => {
    const { container } = render(<MarketingFooter />);
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/free forever/i);
    expect(text).not.toMatch(/free always/i);
    expect(text).not.toMatch(/free-forever/i);
  });
});

// ─── Slice-LP3.2 — /disclosures page (Layer 3 full text) ─────────────────

describe('DisclosuresPage (Layer 3)', () => {
  it('renders «Regulatory disclosures» h1', () => {
    render(<DisclosuresPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: /regulatory disclosures/i }),
    ).toBeInTheDocument();
  });

  it('robots metadata: noindex + nofollow', () => {
    expect(disclosuresMetadata.robots).toEqual({ index: false, follow: false });
  });

  it('renders all 6 sections from content-lead D2', () => {
    render(<DisclosuresPage />);
    expect(
      screen.getByRole('heading', { level: 2, name: /who provedo is and is not/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /information we provide/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /per-jurisdiction notes/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /past performance and predictions/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /your decisions, your responsibility/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /^contact$/i })).toBeInTheDocument();
  });

  it('cites US/EU/UK regulatory frameworks per legal-advisor brief', () => {
    const { container } = render(<DisclosuresPage />);
    const text = container.textContent ?? '';
    expect(text).toMatch(/investment advisers act of 1940/i);
    expect(text).toMatch(/mifid ii/i);
    expect(text).toMatch(/financial services and markets act 2000/i);
  });

  it('contact section links to support@provedo.app', () => {
    render(<DisclosuresPage />);
    const link = screen.getByRole('link', { name: /support@provedo\.app/i });
    expect(link).toHaveAttribute('href', 'mailto:support@provedo.app');
  });
});

// ─── Slice-LP3.2 Wave 2.5 — legal SIGNED-WITH-EDITS corrections ──────────

describe('DisclosuresPage — legal Wave 2.5 corrections', () => {
  it('§5 «Your decisions»: drops tax/retirement/composition qualifier (legal Required Edit 1)', () => {
    const { container } = render(<DisclosuresPage />);
    const text = container.textContent ?? '';
    // Verbatim base phrase must remain (Element-5 inheritance from 75-word footer)
    expect(text).toMatch(
      /consult a licensed financial advisor in your jurisdiction before making investment decisions/i,
    );
    // Forecloser-qualifier must be GONE (creates DOL Fiduciary Rule adjacency that
    // forecloses future Plus-tier tax-optimization + retirement-account features)
    expect(text).not.toMatch(/tax consequences/i);
    expect(text).not.toMatch(/retirement accounts/i);
    expect(text).not.toMatch(/portfolio composition/i);
  });

  it('§4 «Past performance»: singular «a recommendation» for Tab-3 verbal-rhyme (legal Required Edit 2)', () => {
    render(<DisclosuresPage />);
    // Singular phrasing matches locked Tab-3 disclaim verbatim («not a recommendation
    // about future trading decisions»). Use a flexible matcher because the text node
    // can break across whitespace.
    expect(
      screen.getByText(/not a recommendation about future trading decisions/i),
    ).toBeInTheDocument();
    // Plural form must be gone
    expect(
      screen.queryByText(/not recommendations about future trading decisions/i),
    ).not.toBeInTheDocument();
  });

  it('§3-UK: explicit FCA PERG 8 citation (legal Optional Edit 4 applied)', () => {
    const { container } = render(<DisclosuresPage />);
    expect(container.textContent ?? '').toMatch(/fca perimeter guidance manual.*perg 8/i);
  });

  it('§2 «Information»: «foresight» replaced with «perspective» (legal Optional Edit 5 applied)', () => {
    const { container } = render(<DisclosuresPage />);
    const text = container.textContent ?? '';
    // /disclosures specifically — predict-coded register softened. (FAQ marketing
    // surface keeps «foresight» — out of scope for Optional Edit 5.)
    expect(text).toMatch(/clarity, observation, context, and perspective/i);
    expect(text).not.toMatch(/clarity, observation, context, and foresight/i);
  });
});

// ─── Slice-LP3.2 Wave 2.5 — a11y-architect spec corrections ──────────────

describe('DisclosuresPage — a11y Wave 2.5 corrections', () => {
  it('A2.1: page wrapper is <article> (no nested <main> inside layout <main>)', () => {
    const { container } = render(<DisclosuresPage />);
    const article = container.querySelector('article[aria-labelledby="disclosures-heading"]');
    expect(article).not.toBeNull();
    // The page itself must not introduce a second <main> landmark — the marketing
    // layout already wraps children in <main id="main-content">.
    const inlineMain = container.querySelector('main');
    expect(inlineMain).toBeNull();
  });

  it('A2.2: «Last updated» date is wrapped in <time> with machine-readable dateTime', () => {
    const { container } = render(<DisclosuresPage />);
    const timeEls = container.querySelectorAll('time[datetime="2026-04-27"]');
    // Header date + footer date — both wrapped
    expect(timeEls.length).toBeGreaterThanOrEqual(1);
  });

  it('A2.4: TOC nav with all 6 sectional anchors', () => {
    render(<DisclosuresPage />);
    const toc = screen.getByRole('navigation', { name: /on this page/i });
    expect(toc).toBeInTheDocument();
    // Each TOC item is a hash link to its corresponding <h2 id>
    expect(toc.querySelector('a[href="#who"]')).not.toBeNull();
    expect(toc.querySelector('a[href="#what"]')).not.toBeNull();
    expect(toc.querySelector('a[href="#per-jurisdiction"]')).not.toBeNull();
    expect(toc.querySelector('a[href="#past-performance"]')).not.toBeNull();
    expect(toc.querySelector('a[href="#decisions"]')).not.toBeNull();
    expect(toc.querySelector('a[href="#contact"]')).not.toBeNull();
  });

  it('A2.4: every <h2> carries a matching id anchor for TOC jump', () => {
    const { container } = render(<DisclosuresPage />);
    expect(container.querySelector('h2#who')).not.toBeNull();
    expect(container.querySelector('h2#what')).not.toBeNull();
    expect(container.querySelector('h2#per-jurisdiction')).not.toBeNull();
    expect(container.querySelector('h2#past-performance')).not.toBeNull();
    expect(container.querySelector('h2#decisions')).not.toBeNull();
    expect(container.querySelector('h2#contact')).not.toBeNull();
  });
});

describe('MarketingFooter — Wave 2.5 cross-cutting (legal §2 + a11y O2)', () => {
  it('Footer nav row contains ALWAYS-VISIBLE /disclosures link', () => {
    render(<MarketingFooter />);
    const nav = screen.getByRole('navigation', { name: /footer navigation/i });
    expect(nav).toBeInTheDocument();
    const disclosuresLink = screen
      .getAllByRole('link', { name: /disclosures/i })
      .find((link) => link.getAttribute('href') === '/disclosures');
    expect(disclosuresLink).toBeDefined();
    // Specifically, one of the always-visible nav links (not just inside <details>)
    expect(nav.querySelector('a[href="/disclosures"]')).not.toBeNull();
  });

  it('Footer Layer 2 <summary> retains «Full regulatory disclosures (US, EU, UK)» text', () => {
    render(<MarketingFooter />);
    // Confirms phase-3 commitment §7: <summary> text matches legal-advisor recommendation
    const summaryText = screen.getByText(/full regulatory disclosures \(us, eu, uk\)/i);
    expect(summaryText.closest('summary')).not.toBeNull();
  });
});

describe('ProvedoTestimonialCards — Wave 2.5 a11y A5.1', () => {
  it('uses CSS border-top on <figcaption>, NOT <hr> between blockquote + figcaption', () => {
    const { container } = render(<ProvedoTestimonialCards />);
    // The single weighted card must NOT contain an <hr> divider (avoids unhelpful
    // SR «separator» announcement between quote and attribution).
    const figure = container.querySelector('figure');
    expect(figure).not.toBeNull();
    expect(figure?.querySelector('hr')).toBeNull();
    // <figcaption> must still exist (caption preserved)
    expect(figure?.querySelector('figcaption')).not.toBeNull();
  });
});

// ─── Slice-LP3.2 — Demo tabs source citations ────────────────────────────

describe('ProvedoDemoTabsV2 — source citations (v3.2)', () => {
  it('Tab 1 (Why?): renders source line with AAPL Q3 + TSLA delivery + Schwab statement', () => {
    render(<ProvedoDemoTabsV2 />);
    expect(screen.getByText(/aapl q3 earnings 2025-10-31/i)).toBeInTheDocument();
    expect(screen.getByText(/tsla q3 delivery report 2025-10-22/i)).toBeInTheDocument();
  });

  it('Tab 2 (Dividends): renders source line with issuer IR + Schwab statement', () => {
    render(<ProvedoDemoTabsV2 />);
    fireEvent.click(screen.getByRole('tab', { name: /dividends/i }));
    expect(
      screen.getByText(/ex-dividend dates from issuer investor-relations/i),
    ).toBeInTheDocument();
  });

  it('Tab 3 (Patterns): preserves verbatim load-bearing phrasing + adds source line', () => {
    render(<ProvedoDemoTabsV2 />);
    fireEvent.click(screen.getByRole('tab', { name: /patterns/i }));
    // v3.1 verbatim — MUST remain
    expect(screen.getByText(/common pattern across retail investors/i)).toBeInTheDocument();
    expect(
      screen.getByText(/not a recommendation about future trading decisions/i),
    ).toBeInTheDocument();
    // v3.2 NEW source line — Shefrin & Statman (1985) verified citation
    expect(screen.getByText(/shefrin & statman \(1985\)/i)).toBeInTheDocument();
  });

  it('Tab 4 (Aggregate): preserves «about 2x» sourced benchmark + adds S&P DJI citation', () => {
    render(<ProvedoDemoTabsV2 />);
    fireEvent.click(screen.getByRole('tab', { name: /aggregate/i }));
    // v3.1 verbatim — MUST remain
    expect(screen.getByText(/~28%/)).toBeInTheDocument();
    // v3.2 NEW source line — S&P DJI methodology
    expect(screen.getByText(/s&p dji methodology/i)).toBeInTheDocument();
  });
});
