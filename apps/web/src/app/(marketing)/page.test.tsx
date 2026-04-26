// Smoke tests — Provedo landing v2 (Slice-LP2) + v3.2 universal-improvements patches.
// Coverage: 10 sections × 3-4 tests each + cross-section + guardrail checks + Slice-LP3.2 deltas.
// Test shape: render → getByRole/getByText → assertion (AAA pattern)
// Does NOT import 'use client' components with DOM APIs — uses dedicated component-level mocks.

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MarketingFooter } from './_components/MarketingFooter';
import { MarketingHeader } from './_components/MarketingHeader';
import { ProvedoAggregationSection } from './_components/ProvedoAggregationSection';
import { ProvedoDemoTabsV2 } from './_components/ProvedoDemoTabsV2';
import { ProvedoEditorialNarrative } from './_components/ProvedoEditorialNarrative';
import { ProvedoFAQ } from './_components/ProvedoFAQ';
import {
  HERO_RESPONSE_SEGMENTS,
  HERO_SOURCES_ITEMS,
  HERO_SOURCES_LINE,
  HERO_USER_MESSAGE,
  ProvedoHeroV2,
} from './_components/ProvedoHeroV2';
import { ProvedoInsightsBullets } from './_components/ProvedoInsightsBullets';
import { ProvedoNegationSection } from './_components/ProvedoNegationSection';
import { ProvedoNumericProofBar } from './_components/ProvedoNumericProofBar';
import { ProvedoRepeatCTAV2 } from './_components/ProvedoRepeatCTAV2';
import { ProvedoTestimonialCards } from './_components/ProvedoTestimonialCards';
import { Sources } from './_components/Sources';
import { AllocationPieBar } from './_components/charts/AllocationPieBar';
import { AllocationPieBarAnimated } from './_components/charts/AllocationPieBarAnimated';
import { DividendCalendar } from './_components/charts/DividendCalendar';
import { PnlSparkline } from './_components/charts/PnlSparkline';
import { TradeTimeline } from './_components/charts/TradeTimeline';
import { CitationChip } from './_components/hero/CitationChip';
import { DigestHeader } from './_components/hero/DigestHeader';
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

  it('renders the 9 active landmark sections (Slice-LP5-A: S7 testimonials unmounted)', () => {
    render(<MarketingHomePage />);
    // S1 Hero — h1
    expect(
      screen.getByRole('heading', { level: 1, name: /provedo will lead you through/i }),
    ).toBeInTheDocument();
    // S2 Proof bar — has «Proof points» aria-label
    expect(screen.getByRole('region', { name: /proof points/i })).toBeInTheDocument();
    // S3 Negation — Slice-LP5-BCD A1: section is now aria-labelledby a small
    // «POSITIONING» eyebrow, NOT the dropped «This is what Provedo is not.» h2
    // (PO 2026-04-27 «дважды дублируем»). The 2-card asymmetric table speaks
    // without a redundant header.
    expect(screen.getByRole('region', { name: /^positioning$/i })).toBeInTheDocument();
    // S4 Demo teasers bento — «Two answers. Same shape on every question.» (Slice-LP5-A §K.2)
    expect(
      screen.getByRole('region', { name: /two answers. same shape on every question/i }),
    ).toBeInTheDocument();
    // S5 Insights — «A few minutes a day» (v3 Patch B)
    expect(screen.getByRole('region', { name: /a few minutes a day/i })).toBeInTheDocument();
    // S6 Editorial — «One place. One feed. One chat.» (v3)
    expect(screen.getByRole('region', { name: /one place/i })).toBeInTheDocument();
    // S7 Testimonials — UNMOUNTED in Slice-LP5-A (PO directive 2026-04-27, PD §S7
    // recommendation HIDE accepted). The component file is preserved in the
    // codebase for possible future reuse but is no longer rendered on the
    // landing — pre-loaded social-proof expectations the product can't yet back.
    expect(
      screen.queryByRole('region', { name: /what testers will be noticing/i }),
    ).not.toBeInTheDocument();
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
  it('renders 4 proof cells (Slice-LP3.5: Cell IV swapped to «Sources / for every answer»)', () => {
    render(<ProvedoNumericProofBar />);
    expect(screen.getByText('brokers and exchanges')).toBeInTheDocument();
    expect(screen.getByText('observation cited')).toBeInTheDocument();
    // Cell #3 — time-anchor «5 min / a week / the whole habit»
    expect(screen.getByText('a week')).toBeInTheDocument();
    expect(screen.getByText(/the whole habit/i)).toBeInTheDocument();
    // Slice-LP3.5: Cell #4 NEW — «Sources / for every answer»
    expect(screen.getByText(/^for every answer$/i)).toBeInTheDocument();
    expect(screen.getByText(/cited inline, dated, traceable/i)).toBeInTheDocument();
    // Slice-LP3.5: Cell IV body «100% / information not advice» MUST be gone
    expect(screen.queryByText(/^information not advice$/i)).not.toBeInTheDocument();
  });

  it('renders «5 min» time-anchor token (v3.2 NEW)', () => {
    render(<ProvedoNumericProofBar />);
    expect(screen.getByText('5 min')).toBeInTheDocument();
  });

  it('Slice-LP5-BCD C4: audience-whisper line is DROPPED (PO directive)', () => {
    // PO 2026-04-27: «а у кого один брокер, не наши клиенты?» — narrowing
    // ICP excluded single-broker users. Line removed from proof-bar surface;
    // the marketing wedge stays implicit. Anti-regression guard.
    const { container } = render(<ProvedoNumericProofBar />);
    expect(container.textContent ?? '').not.toMatch(
      /for investors who hold across more than one broker/i,
    );
  });

  it('uses "Hundreds" fallback by default (Slice-LP3.7-A: aligned with §S8 register)', () => {
    render(<ProvedoNumericProofBar />);
    expect(screen.getByText('Hundreds')).toBeInTheDocument();
    // Anti-test: the prior «100s» mono-numeric register MUST NOT regress —
    // it created a one-viewport copy mismatch with §S8 «Hundreds of brokers».
    expect(screen.queryByText('100s')).not.toBeInTheDocument();
  });

  it('renders "1000+" when coverage prop is provided', () => {
    render(<ProvedoNumericProofBar coverage="1000+" />);
    expect(screen.getByText('1000+')).toBeInTheDocument();
  });

  it('Slice-LP5-BCD C3: «Information, not advice.» disclaimer is DROPPED from proof bar (PO directive)', () => {
    // PO 2026-04-27: «обязательно везде упоминать?» — the disclaimer was
    // mounted in BOTH the proof-bar footer + footer Layer-1 disclaimer.
    // The footer Layer-1 mount is legal-required + load-bearing; the
    // proof-bar mount is dropped to single-mount the disclaim across the
    // page (Lane A discipline preserved, just at a single load-bearing site).
    const { container, queryByTestId } = render(<ProvedoNumericProofBar />);
    expect(queryByTestId('proof-bar-disclaimer-footer')).toBeNull();
    expect(container.textContent ?? '').not.toMatch(/information, not advice/i);
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

  it('renders «What Provedo is not» heading + 3 em-dash items (Slice-LP3.5 typeset)', () => {
    const { container } = render(<ProvedoNegationSection />);
    const text = container.textContent ?? '';
    // Slice-LP3.5: typeset block headings replace the lucide+red-X 3-column grid.
    expect(text).toMatch(/what provedo is not/i);
    // Brand-voice EDIT: «Does not» (declarative-Sage), NOT «Won't» (chatty).
    expect(text).toMatch(/a robo-advisor\..*does not move money for you\./i);
    expect(text).toMatch(/a brokerage\..*does not execute trades\./i);
    expect(text).toMatch(/advice\..*does not tell you what to buy\./i);
  });

  it('renders «What Provedo is» mirror block with reader/noticer/source-keeper (brand-voice REJECT «citer»)', () => {
    const { container } = render(<ProvedoNegationSection />);
    const text = container.textContent ?? '';
    expect(text).toMatch(/what provedo is\b/i);
    expect(text).toMatch(/a reader\.\s*holds your holdings across every broker\./i);
    expect(text).toMatch(/a noticer\.\s*surfaces what would slip past\./i);
    // Brand-voice REJECT: «citer» (coined back-formation) → «source-keeper».
    expect(text).toMatch(/a source-keeper\.\s*every observation tied to a source\./i);
    expect(text).not.toMatch(/\ba citer\b/i);
  });

  it("does NOT contain «Won't» chatty register or lucide-icon class names (Slice-LP3.5)", () => {
    const { container } = render(<ProvedoNegationSection />);
    const text = container.textContent ?? '';
    // Brand-voice EDIT: declarative «Does not» replaces chatty «Won't».
    expect(text).not.toMatch(/won['']t move/i);
    expect(text).not.toMatch(/won['']t execute/i);
    expect(text).not.toMatch(/won['']t tell/i);
    // Lucide icons + red-X SVG overlay are dropped — no `lucide` className, no
    // explicit `#EF4444` cross-out stroke remains in the DOM.
    expect(container.innerHTML).not.toMatch(/lucide-/i);
    expect(container.innerHTML).not.toMatch(/#EF4444/);
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
  it('renders comparison-bars with descriptive aria-labels (Slice-LP3.5)', () => {
    render(<AllocationPieBar />);
    // Slice-LP3.5: 2 stacked horizontal comparison-bars (your portfolio vs S&P)
    // each carry their own role="img". `getAllByRole` so the test does not
    // collide on the multiple bar elements.
    const bars = screen.getAllByRole('img');
    expect(bars.length).toBeGreaterThanOrEqual(2);
    expect(
      bars.some((el) => /your portfolio sector mix/i.test(el.getAttribute('aria-label') ?? '')),
    ).toBe(true);
    expect(
      bars.some((el) => /s&p 500 sector weights/i.test(el.getAttribute('aria-label') ?? '')),
    ).toBe(true);
  });

  it('renders mandatory visible data caption (WCAG color-not-only)', () => {
    const { container } = render(<AllocationPieBar />);
    expect(container.textContent).toMatch(/Tech 58%/);
    expect(container.textContent).toMatch(/Financials 18%/);
  });

  it('labels all 4 portfolio slices', () => {
    const { container } = render(<AllocationPieBar />);
    expect(container.textContent).toMatch(/healthcare 14%/i);
    expect(container.textContent).toMatch(/other 10%/i);
  });
});

// ─── Slice-LP3.3 chart upgrade Proposal B — regression suite ────────────────

describe('Slice-LP3.3 — PnlSparkline brand-color upgrade (§A)', () => {
  // The headline P&L line MUST render in brand teal (var(--provedo-accent)),
  // not in slate-secondary text color. Closes the largest brand-alignment gap
  // identified by the chart upgrade audit.
  it('primary line stroke uses var(--provedo-accent), not text-secondary', () => {
    const { container } = render(<PnlSparkline />);
    const polylines = container.querySelectorAll('polyline');
    // The P&L line is the polyline whose stroke is set (not the gradient-fill polyline).
    const lineWithStroke = Array.from(polylines).find(
      (p) => (p.getAttribute('stroke') ?? 'none') !== 'none',
    );
    expect(lineWithStroke).toBeDefined();
    expect(lineWithStroke?.getAttribute('stroke')).toBe('var(--provedo-accent)');
    // Slate fallback MUST NOT be used for the primary line.
    expect(lineWithStroke?.getAttribute('stroke')).not.toBe('var(--provedo-text-secondary)');
  });

  it('end label −4.2% renders at 20pt JBM-mono (was 11pt)', () => {
    render(<PnlSparkline />);
    const endLabel = screen.getByText('−4.2%');
    expect(endLabel.getAttribute('font-size')).toBe('20');
  });
});

describe('Slice-LP3.5 — AllocationPieBar comparison-bars (§Tab 4 refactor)', () => {
  // Slice-LP3.5: replaces the Slice-LP3.3 2-cell bento (donut + broker-table)
  // with two stacked horizontal comparison-bars on the same scale. Bento was
  // dropped because it didn't visualize the chat answer's load-bearing
  // «about 2× S&P 500 sector weight» comparison + introduced data-coherence
  // problems. Comparison-bars sidesteps both.

  it('renders comparison-bars container, NOT the dropped 2-cell bento', () => {
    const { container } = render(<AllocationPieBar />);
    expect(screen.getByTestId('allocation-comparison-bars')).toBeInTheDocument();
    // Slice-LP3.3 bento markers MUST be gone.
    expect(container.textContent).not.toMatch(/^by sector$/im);
    expect(container.textContent).not.toMatch(/^by broker$/im);
    expect(container.textContent).not.toMatch(/across \d+ positions/i);
  });

  it('renders S&P 500 benchmark series labelled with 2025-Q3 reporting period', () => {
    const { container } = render(<AllocationPieBar />);
    expect(container.textContent).toMatch(/s&p 500 · 2025-q3/i);
    expect(container.textContent).toMatch(/tech 28%/i);
  });

  it('renders portfolio series with tech segment highlighted', () => {
    const { container } = render(<AllocationPieBar />);
    expect(container.textContent).toMatch(/your portfolio/i);
    expect(container.textContent).toMatch(/tech 58%/i);
  });

  it('renders accounts ledger row for IBKR + Schwab tech holdings (mono-set, not card)', () => {
    const { container } = render(<AllocationPieBar />);
    const text = container.textContent ?? '';
    expect(text).toMatch(/IBKR.*AAPL.*MSFT.*NVDA.*\$31k/i);
    expect(text).toMatch(/Schwab.*GOOG.*AMZN.*\$5k/i);
  });

  it('renders «Provedo notices:» preamble line (brand-voice approved form)', () => {
    render(<AllocationPieBar />);
    expect(
      screen.getByText(
        /provedo notices: your tech weight is about 2× the index's — driven by ibkr\./i,
      ),
    ).toBeInTheDocument();
  });

  it('mounts <Sources> primitive citing Holdings + S&P methodology (Slice-LP3.5)', () => {
    const { container } = render(<AllocationPieBar />);
    const sources = container.querySelector('[data-testid="provedo-sources"]');
    expect(sources).not.toBeNull();
    expect(sources?.textContent).toMatch(/holdings via schwab statement 2025-11-01/i);
    expect(sources?.textContent).toMatch(/s&p 500 sector weights via s&p dji methodology 2025-q3/i);
  });

  it('does NOT introduce undefined «accent-light» token (preserves Slice-LP3.3 token discipline)', () => {
    const { container } = render(<AllocationPieBar />);
    expect(container.innerHTML).not.toMatch(/--provedo-accent-light/);
  });
});

describe('Slice-LP3.3 — DividendCalendar polish (§C)', () => {
  it('cell borders are 1px (was 0.5px — invisible at 100% scaling)', () => {
    const { container } = render(<DividendCalendar />);
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBeGreaterThan(0);
    // EVERY cell rect uses strokeWidth=1 — no half-pixel borders left.
    for (const rect of rects) {
      const sw = rect.getAttribute('stroke-width');
      expect(sw).not.toBe('0.5');
      expect(Number(sw)).toBeGreaterThanOrEqual(1);
    }
  });

  it('counter renders statically at 16pt (no count-up animation)', () => {
    render(<DividendCalendar />);
    // The counter is a static <p> with «$312 expected this quarter» — no rAF tick.
    const counter = screen.getByText(/\$312 expected this quarter/i);
    expect(counter).toBeInTheDocument();
    // 16px = 16pt headline numeral per audit §C.
    const computedFontSize = (counter as HTMLElement).style.fontSize;
    expect(computedFontSize).toBe('16px');
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

  it('Q1 answer contains explicit disclaim (information, not advice)', () => {
    render(<ProvedoFAQ />);
    expect(screen.getByText(/never advice, recommendations, or strategy/i)).toBeInTheDocument();
    expect(screen.getByText(/information, not advice/i)).toBeInTheDocument();
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

  it('Slice-LP5-BCD B3: waitlist box is DROPPED entirely (PD §Footer + PO directive)', () => {
    // PO 2026-04-27: «две максимально тупые секции одна за другой» — the
    // S10 dark CTA + footer waitlist box read as two ask-the-product CTAs
    // back-to-back. Footer is now chrome-only; S10 carries the pre-footer
    // commitment moment alone (PD §C.S10).
    const { container } = render(<MarketingFooter />);
    // Anti-regression: legacy waitlist box copy MUST be gone.
    expect(container.textContent ?? '').not.toMatch(/ready when you are/i);
    expect(container.textContent ?? '').not.toMatch(/provedo is coming soon/i);
    expect(container.textContent ?? '').not.toMatch(/waitlist open/i);
    expect(container.textContent ?? '').not.toMatch(/try plus free for 14 days/i);
    // The previously-rendered footer-internal «Open Provedo» button is gone.
    // The footer should not render an Ask Provedo CTA at all.
    const askProvedoButtons = screen.queryAllByRole('link', { name: /^open provedo$/i });
    expect(askProvedoButtons.length).toBe(0);
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

// ─── Wave 2.6 a11y CRIT-2 — single <main> landmark on home page ──────────

describe('MarketingHomePage — Wave 2.6 CRIT-2 (no nested <main>)', () => {
  it('does NOT render its own <main> element (layout already provides one)', () => {
    // The marketing layout at (marketing)/layout.tsx wraps children in
    // <main id="main-content">. The home page must NOT introduce a second
    // <main> landmark, which would create two landmarks of the same role
    // and confuse SR landmark navigation
    // (WCAG 1.3.1 Info and Relationships A + 4.1.2 Name, Role, Value A).
    const { container } = render(<MarketingHomePage />);
    const inlineMain = container.querySelector('main');
    expect(inlineMain).toBeNull();
  });
});

// ─── Wave 2.6 a11y HIGH-2 — proof bar visible on SSR / first paint ───────

describe('ProvedoNumericProofBar — Wave 2.6 HIGH-2 (visible on SSR)', () => {
  it('renders cell #2 «Every» without an opacity:0 inline style (always visible)', () => {
    render(<ProvedoNumericProofBar />);
    // The «Every» token sits inside a <dd>. Per Wave 2.6 HIGH-2, the
    // destructive opacity-fade-on-scroll was dropped — text content stays
    // unconditionally visible so no-JS users + the early hydration phase
    // see real content.
    const everyEl = screen.getByText('Every');
    const dd = everyEl.closest('dd');
    expect(dd).not.toBeNull();
    const inlineStyle = (dd as HTMLElement).getAttribute('style') ?? '';
    // Must not contain `opacity: 0` as initial state.
    expect(inlineStyle).not.toMatch(/opacity:\s*0(?!\.)/);
  });

  it('renders cell #3 «5 min» without an opacity:0 inline style (always visible)', () => {
    render(<ProvedoNumericProofBar />);
    const fiveMinEl = screen.getByText('5 min');
    const dd = fiveMinEl.closest('dd');
    expect(dd).not.toBeNull();
    const inlineStyle = (dd as HTMLElement).getAttribute('style') ?? '';
    expect(inlineStyle).not.toMatch(/opacity:\s*0(?!\.)/);
  });

  it('renders cell #4 «Sources / for every answer» on SSR (Slice-LP3.5: count-up dropped)', async () => {
    // Use react-dom/server so the test sees the actual SSR HTML payload.
    // Slice-LP3.5: Cell IV was swapped from «100% / information not advice» to
    // «Sources / for every answer» (epistemic claim, no count-up). The «100%»
    // count-up animation is dropped entirely. SSR must render the static cell
    // body verbatim so no-JS users see real content.
    const { renderToString } = await import('react-dom/server');
    const html = renderToString(<ProvedoNumericProofBar />).replace(/<!--[^>]*-->/g, '');
    expect(html).toMatch(/Sources/);
    expect(html).toMatch(/for every answer/i);
    expect(html).toMatch(/cited inline, dated, traceable/i);
    // Slice-LP5-BCD C3: «Information, not advice.» is no longer mounted on
    // this surface — the single load-bearing mount lives in footer Layer-1.
    expect(html).not.toMatch(/information, not advice/i);
  });
});

// ─── Wave 2.6 a11y HIGH-1 — Tabs arrow-key keyboard navigation ───────────

describe('Tabs — Wave 2.6 HIGH-1 (WAI-ARIA APG arrow-key nav)', () => {
  it('ArrowRight from active tab moves selection + focus to next tab', () => {
    render(<ProvedoDemoTabsV2 />);
    const whyTab = screen.getByRole('tab', { name: /why\?/i });
    whyTab.focus();
    fireEvent.keyDown(whyTab, { key: 'ArrowRight' });
    const dividendsTab = screen.getByRole('tab', { name: /dividends/i });
    expect(dividendsTab).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(dividendsTab);
  });

  it('ArrowLeft from first tab wraps to last tab', () => {
    render(<ProvedoDemoTabsV2 />);
    const whyTab = screen.getByRole('tab', { name: /why\?/i });
    whyTab.focus();
    fireEvent.keyDown(whyTab, { key: 'ArrowLeft' });
    const aggregateTab = screen.getByRole('tab', { name: /aggregate/i });
    expect(aggregateTab).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(aggregateTab);
  });

  it('Home key jumps to first tab', () => {
    render(<ProvedoDemoTabsV2 />);
    // Activate the Aggregate (last) tab first
    const aggregateTab = screen.getByRole('tab', { name: /aggregate/i });
    fireEvent.click(aggregateTab);
    aggregateTab.focus();
    fireEvent.keyDown(aggregateTab, { key: 'Home' });
    const whyTab = screen.getByRole('tab', { name: /why\?/i });
    expect(whyTab).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(whyTab);
  });

  it('End key jumps to last tab', () => {
    render(<ProvedoDemoTabsV2 />);
    const whyTab = screen.getByRole('tab', { name: /why\?/i });
    whyTab.focus();
    fireEvent.keyDown(whyTab, { key: 'End' });
    const aggregateTab = screen.getByRole('tab', { name: /aggregate/i });
    expect(aggregateTab).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(aggregateTab);
  });
});

// ─── Wave 2.6 HIGH-3 — Rule 4 grep regression across apps/web ────────────

describe('Rule 4 — no rejected predecessor name in apps/web user-facing source', () => {
  // Walk apps/web/src and grep for the rejected predecessor display string
  // in source files we own. Package-name imports (`@investment-tracker/...`)
  // are infrastructure — different namespace, allowed by design — so the
  // pattern explicitly targets the two-word display string.
  const REJECTED_PATTERN = /Investment\s+Tracker/i;
  // Vitest runs from apps/web/ → cwd-relative resolution avoids
  // import.meta.url URL-scheme issues under happy-dom.
  const SRC_DIR = path.resolve(process.cwd(), 'src');
  const SKIPPED_DIRS = new Set(['node_modules', '.next']);
  const SCANNABLE_EXT = /\.(tsx?|jsx?|md)$/;

  function shouldSkipFile(full: string): boolean {
    // The Rule 4 audit tests themselves contain the pattern by definition;
    // skip them so the assertion does not match against its own source.
    if (full.endsWith('middleware.test.ts')) return true;
    return full.endsWith('page.test.tsx') && full.includes(`${path.sep}(marketing)${path.sep}`);
  }

  function collectFiles(dir: string, out: string[]): void {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIPPED_DIRS.has(entry.name)) collectFiles(full, out);
        continue;
      }
      if (!SCANNABLE_EXT.test(entry.name)) continue;
      if (shouldSkipFile(full)) continue;
      out.push(full);
    }
  }

  function findOffendersInFile(file: string): Array<{ file: string; line: number; text: string }> {
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    const offenders: Array<{ file: string; line: number; text: string }> = [];
    for (let idx = 0; idx < lines.length; idx += 1) {
      const line = lines[idx] ?? '';
      // Strip package-import lines — they reference the workspace npm
      // namespace `@investment-tracker/*` which is a different identifier.
      if (line.includes('@investment-tracker/')) continue;
      if (REJECTED_PATTERN.test(line)) {
        offenders.push({ file, line: idx + 1, text: line.trim() });
      }
    }
    return offenders;
  }

  it('no source file under apps/web/src renders the rejected predecessor display string', () => {
    const files: string[] = [];
    collectFiles(SRC_DIR, files);

    const offenders = files.flatMap(findOffendersInFile);

    if (offenders.length > 0) {
      const summary = offenders.map((o) => `${o.file}:${o.line} → ${o.text}`).join('\n');
      throw new Error(
        `Rule 4 violation — rejected predecessor display string found in user-facing source:\n${summary}`,
      );
    }
    expect(offenders).toEqual([]);
  });
});

// ─── Slice-LP3.4 — Hero ChatMockup polish (Proposal A) ────────────────────
//
// Brand-voice APPROVE-AS-DRAFTED 2026-04-27 — the response text + sources line
// must be rendered VERBATIM. These tests pin the exact strings against drift,
// validate the mono-token typography baseline (matches §S4 Tab 1 + chart upgrade
// 20pt JBM-mono baseline), and verify the IntersectionObserver-driven replay
// hook is wired to the chat surface (under reduced-motion the static fallback
// renders the full content immediately so visitors with motion preferences off
// still see the upgraded copy on first paint + on every scroll-back).

describe('Slice-LP3.4 — Hero ChatMockup content invariants (verbatim)', () => {
  it('user message is locked to «Why is my portfolio down this month?»', () => {
    expect(HERO_USER_MESSAGE).toBe('Why is my portfolio down this month?');
  });

  it('response text matches §S4 Tab 1 verbatim — including comma before «and Tesla»', () => {
    const fullText = HERO_RESPONSE_SEGMENTS.map((seg) => seg.text).join('');
    expect(fullText).toBe(
      "You're down −4.2% this month. 62% of the drawdown is two positions:" +
        ' Apple (−11%) after Q3 earnings on 2025-10-31, and Tesla (−8%)' +
        ' after the 2025-10-22 delivery miss.' +
        ' The rest of your portfolio is roughly flat.',
    );
  });

  it('keeps «delivery miss» phrasing (brand-voice §2.5: do NOT euphemize)', () => {
    const fullText = HERO_RESPONSE_SEGMENTS.map((seg) => seg.text).join('');
    expect(fullText).toMatch(/delivery miss/);
    // Anti-euphemism guardrail — neither softer alternative is allowed.
    expect(fullText).not.toMatch(/delivery shortfall/i);
    expect(fullText).not.toMatch(/delivery report/i);
  });

  it('sources line is verbatim per brand-voice review §2.5 + PD audit §4 (legacy string preserved)', () => {
    // Legacy concatenated string is preserved as a content-invariant lock.
    expect(HERO_SOURCES_LINE).toBe(
      'Sources: AAPL Q3 earnings 2025-10-31 · TSLA Q3 delivery report 2025-10-22 ·' +
        ' holdings via Schwab statement 2025-11-01.',
    );
    // Slice-LP3.5: rendered through <Sources items={HERO_SOURCES_ITEMS} />.
    expect(HERO_SOURCES_ITEMS).toEqual([
      'AAPL Q3 earnings 2025-10-31',
      'TSLA Q3 delivery report 2025-10-22',
      'holdings via Schwab statement 2025-11-01',
    ]);
  });

  it('mono-token segments exist for tickers + amounts + dates (Magician-craft register)', () => {
    const monoTexts = HERO_RESPONSE_SEGMENTS.filter((s) => s.kind === 'mono').map((s) => s.text);
    expect(monoTexts).toContain('62%');
    expect(monoTexts).toContain('Apple (−11%)');
    expect(monoTexts).toContain('Tesla (−8%)');
    expect(monoTexts).toContain('2025-10-31');
    expect(monoTexts).toContain('2025-10-22');
  });

  it('the headline drawdown number is in a NEG token (red mono)', () => {
    const negTexts = HERO_RESPONSE_SEGMENTS.filter((s) => s.kind === 'neg').map((s) => s.text);
    expect(negTexts).toEqual(['−4.2%']);
  });

  it('uses no advisor-prescriptive verbs (Lane A + verb-allowlist)', () => {
    const fullText = HERO_RESPONSE_SEGMENTS.map((seg) => seg.text).join('');
    // Banned per Lane A + the 5-item EN guardrail set.
    expect(fullText).not.toMatch(/recommend/i);
    expect(fullText).not.toMatch(/suggest/i);
    expect(fullText).not.toMatch(/advis/i);
    expect(fullText).not.toMatch(/strategy/i);
    expect(fullText).not.toMatch(/you should/i);
  });
});

describe('Slice-LP3.4 — Hero ChatMockup render (reduced-motion fallback path)', () => {
  // Under prefers-reduced-motion: reduce, the typing animation is skipped and the
  // chat surface renders the full final text statically on first paint. This is
  // the deterministic path for assertions about the rendered DOM (no fake-timer
  // brittleness, no async typing-state machine).
  let originalMatchMedia: typeof window.matchMedia | undefined;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    // Mock matchMedia to report reduced-motion preference.
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    if (originalMatchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: originalMatchMedia,
      });
    }
  });

  it('renders the full Provedo response text statically (no partial typing)', async () => {
    render(<ProvedoHeroV2 />);
    // Wait for hydration effect that flips reduced-motion + sets full state.
    const responseBubble = await screen.findByLabelText(/provedo response/i);
    const fullText = HERO_RESPONSE_SEGMENTS.map((s) => s.text).join('');
    // `textContent` concatenates the segmented text + mono + neg children.
    expect(responseBubble.textContent).toContain(fullText);
  });

  it('renders the verbatim sources items below the response bubble (Slice-LP3.5 <Sources>)', async () => {
    const { container } = render(<ProvedoHeroV2 />);
    await screen.findByLabelText(/provedo response/i);
    const sources = container.querySelector('[data-testid="provedo-sources"]');
    expect(sources).not.toBeNull();
    const text = sources?.textContent ?? '';
    for (const item of HERO_SOURCES_ITEMS) {
      expect(text).toContain(item);
    }
  });

  it('renders mono-token spans for all required data points', async () => {
    const { container } = render(<ProvedoHeroV2 />);
    // First wait for the response bubble to appear so token spans exist.
    await screen.findByLabelText(/provedo response/i);
    const monoTokens = container.querySelectorAll('[data-testid="hero-mono-token"]');
    // 5 mono segments per HERO_RESPONSE_SEGMENTS — the count must match exactly
    // so a future paraphrase cannot silently drop a ticker / date.
    expect(monoTokens.length).toBe(5);
    const negTokens = container.querySelectorAll('[data-testid="hero-neg-token"]');
    expect(negTokens.length).toBe(1);
  });

  it('renders the wordmark INLINE above the response bubble (not floating above the card)', async () => {
    const { container } = render(<ProvedoHeroV2 />);
    const responseBubble = await screen.findByLabelText(/provedo response/i);
    // The §S4 ProvedoBubble structural pattern places the wordmark <p>Provedo</p>
    // INSIDE the response-bubble wrapper, immediately before the bubble itself —
    // it must NOT float at the top of the chat article (audit §2.2.1).
    const article = container.querySelector('article[aria-label="Provedo demo conversation"]');
    expect(article).not.toBeNull();
    // The wordmark must NOT be the first child element of the article.
    const firstChild = article?.firstElementChild;
    expect(firstChild?.textContent?.trim()).not.toBe('Provedo');
    // The wordmark must be the previous sibling of the response bubble itself,
    // i.e. live inside the response wrapper as the bubble's header.
    const previousSibling = responseBubble.previousElementSibling;
    expect(previousSibling?.tagName.toLowerCase()).toBe('p');
    expect(previousSibling?.textContent).toBe('Provedo');
  });

  it('user bubble has no border (audit §2.2.7: redundant on white card bg)', async () => {
    const { container } = render(<ProvedoHeroV2 />);
    await screen.findByLabelText(/provedo response/i);
    const userBubbleWrapper = container.querySelector('[aria-label="User message"]');
    expect(userBubbleWrapper).not.toBeNull();
    const userBubble = userBubbleWrapper?.firstElementChild as HTMLElement | null;
    expect(userBubble).not.toBeNull();
    const inlineStyle = userBubble?.getAttribute('style') ?? '';
    // The previous version set `border: 1px solid var(--provedo-border-subtle)`.
    expect(inlineStyle).not.toMatch(/border:\s*1px solid/);
  });

  it('chat surface is wrapped in an IntersectionObserver-aware ref (replay-on-intersection)', async () => {
    // useInView assigns its ref to the article element directly. We can't observe
    // the IO callback under happy-dom (which provides only an IO stub), but we
    // CAN assert the article element is present so the ref attaches — the wiring
    // surface that distinguishes this slice from the pre-3.4 single-shot version.
    render(<ProvedoHeroV2 />);
    const article = await screen.findByLabelText('Provedo demo conversation');
    expect(article.tagName.toLowerCase()).toBe('article');
  });
});

describe('Slice-LP3.4 — Hero ChatMockup typography baseline', () => {
  // Reuses the reduced-motion mock so the response bubble renders synchronously.
  let originalMatchMedia: typeof window.matchMedia | undefined;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    if (originalMatchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: originalMatchMedia,
      });
    }
  });

  it('user bubble + response bubble both lift to text-sm (was text-xs)', async () => {
    const { container } = render(<ProvedoHeroV2 />);
    await screen.findByLabelText(/provedo response/i);
    const userBubble = container.querySelector(
      '[aria-label="User message"] > div',
    ) as HTMLElement | null;
    expect(userBubble).not.toBeNull();
    expect(userBubble?.className).toMatch(/text-sm/);
    expect(userBubble?.className).not.toMatch(/text-xs/);
  });

  it('Slice-LP5-A §K.1.a: hero response bubble does NOT render an inline P&L sparkline', async () => {
    // PO pivot: «мы не показываем чарты». The hero bubble stays text-led —
    // the «mention charts exist» beat moves to §S4 Teaser 1 (PD §K.2). This
    // test guards the picture-first contract: no chart inside the bubble.
    const { container } = render(<ProvedoHeroV2 />);
    await screen.findByLabelText(/provedo response/i);
    const sparkline = container.querySelector('svg[aria-label*="trend line"]');
    expect(sparkline).toBeNull();
  });

  it('Slice-LP5-A §K.1.a: mono-token pills carry the JBM-mono pill chrome (slate-100 bg, rounded)', async () => {
    const { container } = render(<ProvedoHeroV2 />);
    await screen.findByLabelText(/provedo response/i);
    const monoTokens = container.querySelectorAll<HTMLElement>('[data-testid="hero-mono-token"]');
    expect(monoTokens.length).toBeGreaterThan(0);
    // First mono pill carries the upgraded chrome contract — the answer
    // reads as «product data» without needing a chart inside the bubble.
    const first = monoTokens[0] as HTMLElement;
    const inline = first.getAttribute('style') ?? '';
    expect(inline).toMatch(/font-family:\s*var\(--provedo-font-mono\)/);
    expect(inline).toMatch(/background-color:\s*var\(--provedo-bg-subtle\)/);
    expect(inline).toMatch(/border-radius:\s*4px/);
  });
});

// ─── Slice-LP3.5 — <Sources> primitive unit tests ─────────────────────────

describe('Slice-LP3.5 — Sources primitive', () => {
  it('renders nothing when items array is empty', () => {
    const { container } = render(<Sources items={[]} />);
    expect(container.querySelector('[data-testid="provedo-sources"]')).toBeNull();
  });

  it('renders «Sources» eyebrow + items joined with «·»', () => {
    render(<Sources items={['AAPL Q3 earnings 2025-10-31', 'Schwab statement 2025-11-01']} />);
    const sources = screen.getByTestId('provedo-sources');
    expect(sources.textContent).toMatch(/Sources/);
    expect(sources.textContent).toContain('AAPL Q3 earnings 2025-10-31');
    expect(sources.textContent).toContain(' · ');
    expect(sources.textContent).toContain('Schwab statement 2025-11-01');
  });

  it('carries an aria-label so SR users know the cite line context', () => {
    render(<Sources items={['x']} />);
    const sources = screen.getByTestId('provedo-sources');
    expect(sources.getAttribute('aria-label')).toMatch(/sources for the preceding observation/i);
  });

  it('uses italic + dotted-top-rule styling (receipt-chrome signature)', () => {
    render(<Sources items={['x']} />);
    const sources = screen.getByTestId('provedo-sources') as HTMLElement;
    const inline = sources.getAttribute('style') ?? '';
    expect(inline).toMatch(/font-style:\s*italic/);
    // Browsers expand `border-top: 1px dotted` to per-property longhand. Match
    // the style + width invariants regardless of shorthand vs longhand emission.
    expect(inline).toMatch(/border-top-style:\s*dotted/);
    expect(inline).toMatch(/border-top-width:\s*1px/);
  });

  it('dark theme uses lighter text suitable for dark surfaces', () => {
    render(<Sources items={['x']} theme="dark" />);
    const sources = screen.getByTestId('provedo-sources') as HTMLElement;
    const inline = sources.getAttribute('style') ?? '';
    // Dark theme uses rgba(203, 213, 225, ...) for text + a faded teal eyebrow.
    expect(inline).toMatch(/color:\s*rgba\(203,\s*213,\s*225/);
  });
});

// ─── Slice-LP3.5 — Sources primitive system mounts ────────────────────────

describe('Slice-LP3.5 — Sources mounts across the page', () => {
  it('S6 editorial closing renders Sources with pre-alpha JTBD + ICP cohort items', () => {
    const { container } = render(<ProvedoEditorialNarrative />);
    const sources = container.querySelector('[data-testid="provedo-sources"]');
    expect(sources).not.toBeNull();
    expect(sources?.textContent).toMatch(/pre-alpha jtbd interviews 2026-q1/i);
    expect(sources?.textContent).toMatch(/icp cohort signals/i);
    // Brand-voice REJECT §6.3: no specific cohort-N citations on the manifesto surface.
    expect(sources?.textContent).not.toMatch(/n=\d+/);
  });

  it('S7 testimonial renders Sources with builder-note + 2026-Q2 dating', () => {
    const { container } = render(<ProvedoTestimonialCards />);
    const sources = container.querySelector('[data-testid="provedo-sources"]');
    expect(sources).not.toBeNull();
    expect(sources?.textContent).toMatch(/pre-alpha builder note · 2026-q2/i);
  });

  it('S4 demo Tab 1 mounts Sources via the shared primitive (extracted from inline)', () => {
    const { container } = render(<ProvedoDemoTabsV2 />);
    // Default Why? tab is active — Sources primitive should be in DOM.
    const sources = container.querySelectorAll('[data-testid="provedo-sources"]');
    expect(sources.length).toBeGreaterThanOrEqual(1);
    // First mount carries Tab 1's verbatim cite items.
    const first = sources[0];
    expect(first?.textContent).toMatch(/aapl q3 earnings 2025-10-31/i);
  });
});

// ─── Slice-LP3.5 — Aggregation marquee → typeset list ─────────────────────

describe('Slice-LP5-BCD A4 — ProvedoAggregationSection (marquee restored, 2 rows)', () => {
  it('renders the 2-row opposing-direction marquee container with broker pills', () => {
    render(<ProvedoAggregationSection />);
    const container = screen.getByTestId('broker-marquee-container');
    expect(container).toBeInTheDocument();
    // Both rows present — top row scrolls ltr, bottom row scrolls rtl.
    expect(screen.getByTestId('broker-marquee-track-ltr')).toBeInTheDocument();
    expect(screen.getByTestId('broker-marquee-track-rtl')).toBeInTheDocument();
  });

  it('renders broker WORDMARKS (full names) in mono pills, not abbreviations', () => {
    render(<ProvedoAggregationSection />);
    // PD spec §C.S8: pills carry full broker NAMES (better visual density).
    // Verify several full-name labels render across the two tracks.
    const ltrTrack = screen.getByTestId('broker-marquee-track-ltr');
    const rtlTrack = screen.getByTestId('broker-marquee-track-rtl');
    const allText = `${ltrTrack.textContent ?? ''} ${rtlTrack.textContent ?? ''}`;
    expect(allText).toMatch(/Interactive Brokers/);
    expect(allText).toMatch(/Charles Schwab/);
    expect(allText).toMatch(/Hargreaves Lansdown/);
  });

  it('declares both marquee keyframes (ltr + rtl) and uses transform-only animation', () => {
    const { container } = render(<ProvedoAggregationSection />);
    const styleTag = container.querySelector('style');
    expect(styleTag).not.toBeNull();
    const css = styleTag?.textContent ?? '';
    expect(css).toMatch(/@keyframes\s+provedo-marquee-ltr/);
    expect(css).toMatch(/@keyframes\s+provedo-marquee-rtl/);
    // Animations must use transform (compositor-friendly), NOT layout-bound props.
    expect(css).toMatch(/transform:\s*translateX/);
    expect(css).not.toMatch(/left:\s*\d/);
  });

  it('respects prefers-reduced-motion via @media block (animation: none fallback)', () => {
    const { container } = render(<ProvedoAggregationSection />);
    const styleTag = container.querySelector('style');
    const css = styleTag?.textContent ?? '';
    // Reduced-motion fallback freezes the marquee animation.
    expect(css).toMatch(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/);
    expect(css).toMatch(/animation:\s*none/);
  });

  it('renders «— and growing» tail (brand-voice EDIT — NOT «100s more»)', () => {
    render(<ProvedoAggregationSection />);
    const tail = screen.getByTestId('broker-list-tail');
    expect(tail.textContent).toMatch(/—\s*and growing/i);
    // Brand-voice §8 EDIT: «100s more» rejected (collides with proof-bar Cell I «100s»).
    expect(tail.textContent).not.toMatch(/100s more/i);
  });
});

// ─── Slice-LP3.6 — Hero L2/L3 retire (DigestHeader + CitationChip) ────────

describe('Slice-LP3.6 — DigestHeader typographic primitive', () => {
  it('renders «THIS WEEK» eyebrow + «3 observations across your portfolio» tagline (PD spec §3.4)', () => {
    render(<DigestHeader />);
    const header = screen.getByTestId('hero-digest-header');
    expect(header).toBeInTheDocument();
    // Eyebrow source casing is «This week» but uppercase Tailwind class
    // produces «THIS WEEK» visually. We assert source-case content +
    // CSS uppercase transform together.
    const eyebrow = within(header).getByText(/this week/i);
    expect(eyebrow).toBeInTheDocument();
    expect(eyebrow.className).toMatch(/uppercase/);
    // Tagline split across <span> (mono «3») + text node — assert via textContent.
    expect(header.textContent).toMatch(/3\s+observations across your portfolio/i);
  });
});

describe('Slice-LP3.6 — CitationChip typographic primitive', () => {
  it('renders verbatim «IBKR · Schwab — 2 brokers» (data-coherence with chat ledger, NOT 3 brokers)', () => {
    render(<CitationChip isComplete={true} prefersReduced={true} />);
    const chip = screen.getByTestId('hero-citation-chip');
    expect(chip).toBeInTheDocument();
    // Mono ticker tokens — verbatim per PD §10.1 Option B (Coinbase intentionally
    // dropped because it never appears in the chat answer; «2 brokers» suffix
    // matches the IBKR + Schwab pair).
    expect(chip.textContent).toContain('IBKR · Schwab');
    expect(chip.textContent).toMatch(/—\s*2 brokers/);
    // Anti-test: the legacy «3 brokers» (with Coinbase) MUST NOT regress.
    expect(chip.textContent).not.toMatch(/3 brokers/);
    expect(chip.textContent).not.toMatch(/coinbase/i);
  });
});

describe('Slice-LP3.6 — Hero receipt-system composition', () => {
  // Reuse the reduced-motion mock pattern so the receipt mounts synchronously
  // and the <aside> is queryable on first paint.
  let originalMatchMedia: typeof window.matchMedia | undefined;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    if (originalMatchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: originalMatchMedia,
      });
    }
  });

  it('Slice-LP5-A §K.1: right column is wrapped in <aside> + only the ChatAppShell-wrapped ChatMockup (no Digest/Citation siblings)', async () => {
    render(<ProvedoHeroV2 />);
    const aside = await screen.findByLabelText('Provedo demo receipt');
    expect(aside.tagName.toLowerCase()).toBe('aside');
    // The picture-first hero drops the DigestHeader (header) + CitationChip
    // (footer) siblings. Only the ChatAppShell-wrapped ChatMockup remains.
    expect(within(aside).getByLabelText('Provedo demo conversation')).toBeInTheDocument();
    // Anti-test: the retired siblings MUST NOT mount on the hero.
    expect(within(aside).queryByTestId('hero-digest-header')).not.toBeInTheDocument();
    expect(within(aside).queryByTestId('hero-citation-chip')).not.toBeInTheDocument();
  });

  it('Slice-LP5-A §K.1: hero column carries the layout-shift min-height lock (≥ 320px mobile / ≥ 440px md+)', async () => {
    render(<ProvedoHeroV2 />);
    const aside = await screen.findByLabelText('Provedo demo receipt');
    // PD §K.1.c lock — the picture-first variant tightens the recalculated
    // min-height to 320px / 440px (vs prior 380/480 with chart in bubble).
    // We assert via Tailwind class contract because happy-dom does not run
    // responsive media queries reliably.
    expect(aside.className).toContain('min-h-[400px]');
    expect(aside.className).toContain('md:min-h-[440px]');
  });
});

// ─── Slice-LP3.7-A — final design-review fixes ─────────────────────────────

describe('Slice-LP3.7-A — Tab 4 in-segment label contrast (CRIT-A WCAG 1.4.3 AA)', () => {
  // The prior color logic (`seg.highlight || seg.pct >= 50`) produced
  // foreground-equals-background on at least 3 segments (e.g. tech 28% on
  // text-secondary fill = literal 1.0:1 invisibility). Slice-LP3.7-A drives
  // label color from `data-segment-tone`: dark fills get cream-on-dark text;
  // light fills get slate-on-cream text. Each label must contrast with its
  // own segment background ≥ 4.5:1.

  // Pairs verified in the design-review token math:
  //   --provedo-bg-page         = #FAFAF7 (cream)
  //   --provedo-text-primary    = #0F172A (slate-900)
  //   --provedo-text-secondary  = #334155 (slate-700)
  //   --provedo-accent          = #0D9488 (teal-600)
  //   --provedo-accent-hover    = #0F766E (teal-700)
  //   --provedo-border-default  = #CBD5E1 (slate-300)
  // dark fills (accent / accent-hover / text-secondary) → bg-page text     ≥ 4.7:1
  // light fills (border-default)                        → text-primary text ≈ 12:1

  for (const [Component, name] of [
    [AllocationPieBar, 'AllocationPieBar (static)'],
    [AllocationPieBarAnimated, 'AllocationPieBarAnimated (animated)'],
  ] as const) {
    it(`${name}: each in-segment label color is the inverse tone of its background`, () => {
      const { container } = render(<Component />);
      const segments = container.querySelectorAll<HTMLElement>('[data-segment-tone]');
      expect(segments.length).toBeGreaterThan(0);

      for (const segment of segments) {
        const tone = segment.getAttribute('data-segment-tone');
        const styleColor = segment.style.color;
        const styleBg = segment.style.backgroundColor;

        // Foreground MUST NOT equal background — anti-test for the
        // exact failure mode CRIT-A flagged (#334155 text on #334155 fill).
        expect(styleColor).not.toBe(styleBg);

        if (tone === 'dark') {
          // Dark fills carry cream/light text.
          expect(styleColor).toBe('var(--provedo-bg-page)');
        } else if (tone === 'light') {
          // Light fills carry primary slate text.
          expect(styleColor).toBe('var(--provedo-text-primary)');
        } else {
          throw new Error(`Unexpected tone: ${tone ?? 'null'}`);
        }
      }
    });

    it(`${name}: prior contrast-failing logic is gone (no «pct >= 50 picks bg-page» rule)`, () => {
      // Anti-regression: the failing combination was that a 72%-wide segment
      // with a LIGHT fill (border-default #CBD5E1) was getting bg-page (#FAFAF7)
      // text — 1.36:1 ratio. After the fix, light fills must NEVER get bg-page
      // text regardless of pct. Verify by inspecting the «remaining 72%» row.
      const { container } = render(<Component />);
      const lightSegments = Array.from(
        container.querySelectorAll<HTMLElement>('[data-segment-tone="light"]'),
      );
      for (const segment of lightSegments) {
        expect(segment.style.color).not.toBe('var(--provedo-bg-page)');
      }
    });
  }
});

describe('Slice-LP3.7-A — §S5 InsightsBullets Sources mount (chrome-promise content backing)', () => {
  // Brand-strategist 2026-04-27 §S5 found: bullet #3 verbatim asserts
  // «Provedo cites every observation. Every pattern ties back to a trade,
  // an event, or a published source.» but the surface itself shipped without
  // a Sources mount. This test guards the close of that chrome-promise gap.

  it('mounts <Sources> primitive below the 3 bullets (closes §S5 chrome-promise gap)', () => {
    const { container } = render(<ProvedoInsightsBullets />);
    const wrapper = container.querySelector('[data-testid="insights-sources-wrapper"]');
    expect(wrapper).not.toBeNull();
    const sources = wrapper?.querySelector('[data-testid="provedo-sources"]');
    expect(sources).not.toBeNull();
  });

  it('cites methodology + per-answer items, NOT internal pre-alpha cohort references', () => {
    const { container } = render(<ProvedoInsightsBullets />);
    const sources = container.querySelector('[data-testid="provedo-sources"]');
    expect(sources?.textContent).toMatch(/methodology/i);
    expect(sources?.textContent).toMatch(/cited per observation/i);
    // Brand-voice REJECT: do NOT cite pre-alpha JTBD interviews / ICP cohort
    // signals on this surface. That treatment is reserved for §S6 editorial.
    expect(sources?.textContent ?? '').not.toMatch(/jtbd interviews/i);
    expect(sources?.textContent ?? '').not.toMatch(/icp cohort/i);
    expect(sources?.textContent ?? '').not.toMatch(/n=\d+/);
  });

  it('uses lighter chrome (constrained max-width + opacity) to avoid Sage-stacking', () => {
    const { container } = render(<ProvedoInsightsBullets />);
    const wrapper = container.querySelector<HTMLElement>(
      '[data-testid="insights-sources-wrapper"]',
    );
    expect(wrapper).not.toBeNull();
    // Brand-strategist §7 ceiling note: 6 mounts is upper-bound for Everyman
    // survival; the 7th uses muted weight rather than full chrome density.
    expect(wrapper?.style.maxWidth).toBe('480px');
    // Opacity in the 0.7-0.9 range — visually de-emphasized vs the other 6.
    const opacityValue = Number.parseFloat(wrapper?.style.opacity ?? '1');
    expect(opacityValue).toBeGreaterThanOrEqual(0.7);
    expect(opacityValue).toBeLessThan(1);
  });
});

describe('Slice-LP3.7-A — §S2 «Hundreds» / §S8 «Hundreds» register alignment', () => {
  // PD final review §S2 vs §S8 mismatch: proof-bar Cell I shipped «100s»
  // (mono-numeric register) one viewport apart from §S8 header «Hundreds»
  // (sans-narrative register). Slice-LP3.7-A aligns both surfaces to the
  // sans-narrative «Hundreds» until TD-095 lands the verified «1000+» upgrade.

  it('proof-bar Cell I and §S8 header use the same «Hundreds» register on the live page', () => {
    render(<MarketingHomePage />);
    const headings = screen.getAllByText(/hundreds of brokers and exchanges/i);
    // Cell I sub never carries the full phrase but Cell I dd carries «Hundreds»
    // and §S8 paragraph carries «Hundreds of brokers and exchanges, in one place.»
    expect(headings.length).toBeGreaterThanOrEqual(1);
    // Anti-regression: «100s» as a numeric token MUST NOT regress on the
    // landing page (it created the proof-bar / §S8 register mismatch).
    expect(screen.queryByText(/^100s$/)).not.toBeInTheDocument();
  });
});

describe('Slice-LP3.7-A — ProvedoFAQ focus-visible CSS migration (MED)', () => {
  it('renders without inline onFocus/onBlur JS handlers (matches MarketingFooter pattern)', () => {
    const { container } = render(<ProvedoFAQ />);
    // The Wave 2.5 spec migrated MarketingFooter to CSS :focus-visible.
    // Slice-LP3.7-A migrates ProvedoFAQ to the same pattern so both
    // <details>/<summary> patterns converge in the design system.
    const summaries = container.querySelectorAll('summary');
    expect(summaries.length).toBe(6);
    for (const summary of summaries) {
      // Must use Tailwind focus-visible utility classes, not inline JS.
      expect(summary.className).toMatch(/focus-visible:outline/);
      expect(summary.className).toMatch(/focus-visible:\[outline-color/);
    }
    // No inline `outline: 2px solid …` style applied on initial render.
    for (const summary of summaries) {
      expect((summary as HTMLElement).style.outline).toBe('');
    }
  });
});

describe('Slice-LP3.7-A — CitationChip aria-label semantic correction (LOW)', () => {
  it('footer aria-label reads «Brokers covered» (not «Sources»)', () => {
    const { container } = render(<CitationChip isComplete={true} prefersReduced={true} />);
    const footer = container.querySelector('footer');
    expect(footer).not.toBeNull();
    // The chip carries broker scope — the receipt's own «Sources:» line above
    // already lists the citations. SR readout now matches what the chip means.
    expect(footer?.getAttribute('aria-label')).toBe('Brokers covered');
    expect(footer?.getAttribute('aria-label')).not.toBe('Sources');
  });
});

// ─── Slice-LP5-A — picture-first hero atmosphere + ChatAppShell + S4 teasers + S2 bento ─

import { ProvedoDemoTeasersBento } from './_components/ProvedoDemoTeasersBento';
import { ChatAppShell } from './_components/hero/ChatAppShell';
import { HeroAtmosphere } from './_components/hero/HeroAtmosphere';
import { TypingDots } from './_components/hero/TypingDots';

describe('Slice-LP5-A — ChatAppShell shared chrome primitive', () => {
  it('renders an <article> wrapper with the caller-provided aria-label', () => {
    render(
      <ChatAppShell ariaLabel="custom shell label" headerTitle="Provedo">
        <p>body</p>
      </ChatAppShell>,
    );
    const shell = screen.getByLabelText('custom shell label');
    expect(shell.tagName.toLowerCase()).toBe('article');
    expect(shell).toHaveAttribute('data-testid', 'chat-app-shell');
  });

  it('renders a header bar with the «Provedo» title + status pill (default «live»)', () => {
    render(
      <ChatAppShell ariaLabel="x" headerTitle="Provedo">
        <p>body</p>
      </ChatAppShell>,
    );
    const header = screen.getByTestId('chat-app-shell-header');
    expect(header).toBeInTheDocument();
    expect(header.textContent).toMatch(/Provedo/);
    const statusPill = screen.getByTestId('chat-app-shell-status-pill');
    expect(statusPill.textContent).toMatch(/live/i);
  });

  it('status dot carries an aria-label so SR users hear the live status', () => {
    render(
      <ChatAppShell ariaLabel="x" headerTitle="Provedo" statusLabel="live">
        <p>body</p>
      </ChatAppShell>,
    );
    const statusLive = screen.getByLabelText('status: live');
    expect(statusLive).toBeInTheDocument();
  });

  it('mandatory 120px outer teal-glow halo is present on the shell box-shadow (PD §K.1.b)', () => {
    render(
      <ChatAppShell ariaLabel="x" headerTitle="Provedo">
        <p>body</p>
      </ChatAppShell>,
    );
    const shell = screen.getByTestId('chat-app-shell') as HTMLElement;
    const inline = shell.getAttribute('style') ?? '';
    // 120px ambient teal halo is the picture-first signature — without it the
    // shell reads as «dropped on top of» the atmosphere instead of «sitting in»
    // it. The inline check is a forgiving pattern (accepts whitespace + the
    // teal-tinted rgba alpha).
    expect(inline).toMatch(/box-shadow/);
    expect(inline).toMatch(/120px rgba\(13,\s*148,\s*136/);
  });

  it('messageMinHeight prop locks the inner body min-height (CLS guard)', () => {
    render(
      <ChatAppShell ariaLabel="x" headerTitle="Provedo" messageMinHeight="360px">
        <p>body</p>
      </ChatAppShell>,
    );
    const body = screen.getByTestId('chat-app-shell-body') as HTMLElement;
    expect(body.style.minHeight).toBe('360px');
  });
});

describe('Slice-LP5-A — TypingDots indicator', () => {
  it('renders 3 dots with aria-hidden so SR users do not loop the wave', () => {
    const { container } = render(<TypingDots prefersReduced={false} />);
    const wrapper = screen.getByTestId('hero-typing-dots');
    expect(wrapper.getAttribute('aria-hidden')).toBe('true');
    // 3 dot spans inside the wrapper (each dot is its own <span>).
    const dotSpans = wrapper.querySelectorAll('span[aria-hidden="true"]');
    expect(dotSpans.length).toBe(3);
    // Sanity: no chart svg leaks into the typing indicator.
    expect(container.querySelector('svg')).toBeNull();
  });

  it('respects prefers-reduced-motion (animation: none on each dot)', () => {
    render(<TypingDots prefersReduced={true} />);
    const wrapper = screen.getByTestId('hero-typing-dots');
    const dots = wrapper.querySelectorAll<HTMLElement>('span[aria-hidden="true"]');
    for (const dot of dots) {
      const inline = dot.getAttribute('style') ?? '';
      // Each dot's animation must be «none» in reduced-motion mode.
      expect(inline).toMatch(/animation:\s*none/);
    }
  });
});

describe('Slice-LP5-A — HeroAtmosphere (Layer 1 + Layer 2)', () => {
  it('renders the atmosphere wrapper with two radial gradients painted via background-image', async () => {
    // Happy-dom does not consistently surface `background-image` longhand on
    // inline `style.backgroundImage`. Use renderToString to assert against the
    // serialized SSR HTML, which preserves the gradient strings verbatim.
    const { renderToString } = await import('react-dom/server');
    const html = renderToString(<HeroAtmosphere />);
    expect(html).toMatch(/radial-gradient/);
    expect(html).toMatch(/rgba\(13, ?148, ?136/);
    expect(html).toMatch(/rgba\(250, ?240, ?220/);
    // Smoke-mount for the aria + testid contract.
    render(<HeroAtmosphere />);
    const atmosphere = screen.getByTestId('hero-atmosphere');
    expect(atmosphere.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders the bespoke synthesis-glyph SVG (1 source → 3 brokers → 1 Provedo node) at opacity 0.10', () => {
    render(<HeroAtmosphere />);
    const glyph = screen.getByTestId('hero-synthesis-glyph');
    expect(glyph).toBeInTheDocument();
    expect(glyph.getAttribute('aria-hidden')).toBe('true');
    const inline = glyph.getAttribute('style') ?? '';
    expect(inline).toMatch(/opacity:\s*0\.1\b/);
    // 5 nodes total — top source + 3 brokers + bottom Provedo synthesis.
    const circles = glyph.querySelectorAll('circle');
    expect(circles.length).toBe(5);
    // The accent-stroked synthesis path carries the teal accent line.
    const accentStroke = screen.getByTestId('hero-synthesis-accent-stroke');
    expect(accentStroke.getAttribute('stroke')).toBe('var(--provedo-accent)');
  });

  it('glyph SVG is decorative (no role="img") so it does not pollute SR landmark output', () => {
    render(<HeroAtmosphere />);
    const glyph = screen.getByTestId('hero-synthesis-glyph');
    // PD §K.1.b — the glyph is purely atmospheric. Picking it up as an
    // image landmark would announce «graphic» to SR users for no signal.
    expect(glyph.getAttribute('role')).toBeNull();
  });
});

describe('Slice-LP5-A — Hero ChatAppShell composition', () => {
  // Reuse the reduced-motion mock pattern so the surface mounts synchronously.
  let originalMatchMedia: typeof window.matchMedia | undefined;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    if (originalMatchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: originalMatchMedia,
      });
    }
  });

  it('hero ChatMockup is wrapped in the ChatAppShell chrome (header bar + body slot)', async () => {
    render(<ProvedoHeroV2 />);
    await screen.findByLabelText(/provedo response/i);
    const shell = screen.getByTestId('chat-app-shell');
    expect(shell).toBeInTheDocument();
    // The shell carries the «Provedo» header title with the status pill.
    const header = within(shell).getByTestId('chat-app-shell-header');
    expect(header.textContent).toMatch(/Provedo/);
    expect(within(shell).getByTestId('chat-app-shell-status-pill')).toBeInTheDocument();
  });

  it('hero ChatAppShell carries the message-area min-height lock (CLS guard)', async () => {
    render(<ProvedoHeroV2 />);
    await screen.findByLabelText(/provedo response/i);
    const body = screen.getByTestId('chat-app-shell-body') as HTMLElement;
    // The lock is a CSS clamp() with the mobile floor + desktop ceiling;
    // happy-dom preserves the inline value so we can assert presence of
    // the clamp-with-px units string.
    expect(body.style.minHeight).toMatch(/clamp\(320px,/);
    expect(body.style.minHeight).toMatch(/360px\)/);
  });

  it('Slice-LP5-A §K.1.a: hero response bubble does NOT include an inline chart of any kind', async () => {
    const { container } = render(<ProvedoHeroV2 />);
    const responseBubble = await screen.findByLabelText(/provedo response/i);
    // No SVG chart inside the response bubble (anti-regression: prior
    // shipped sparkline lived here; PD §K.1.a removes it).
    expect(responseBubble.querySelector('svg')).toBeNull();
    // Nor anywhere else in the chat-app-shell body wrapper.
    const body = container.querySelector('[data-testid="chat-app-shell-body"]');
    expect(body).not.toBeNull();
    expect(body?.querySelector('svg[aria-label*="trend line"]')).toBeNull();
  });
});

describe('Slice-LP5-A — ProvedoNumericProofBar bento layout (PD §C.S2)', () => {
  it('renders the 4-cell bento grid (no divide-x / divide-y dividers)', () => {
    const { container } = render(<ProvedoNumericProofBar />);
    const grid = screen.getByTestId('proof-bar-bento-grid');
    expect(grid).toBeInTheDocument();
    // Bento grid uses CSS grid, NOT the prior divide-x flat strip.
    expect(grid.className).toMatch(/\bgrid\b/);
    // Anti-test: divide-x / divide-y must be gone (PO «скучные»).
    expect(container.innerHTML).not.toMatch(/divide-x\b/);
    expect(container.innerHTML).not.toMatch(/divide-y\b/);
  });

  it('cell #4 is the teal-tinted hero cell (PD §C.S2: Sources reads as dominant claim)', () => {
    render(<ProvedoNumericProofBar />);
    const heroCell = screen.getByTestId('proof-bar-cell-sources-hero');
    const inline = heroCell.getAttribute('style') ?? '';
    // Teal-tinted bg per PD §C.S2 verbatim — rgba(13, 148, 136, 0.04).
    expect(inline).toMatch(/background-color:\s*rgba\(13,\s*148,\s*136,\s*0\.04\)/);
    // Teal-200 hairline border on the hero cell.
    expect(inline).toMatch(/border-color:\s*rgba\(13,\s*148,\s*136,\s*0\.25\)/);
  });

  it('the three supporting cells sit on warm-bg-muted with subtle hairline borders', () => {
    render(<ProvedoNumericProofBar />);
    for (const id of [
      'proof-bar-cell-coverage',
      'proof-bar-cell-cited',
      'proof-bar-cell-time',
    ] as const) {
      const cell = screen.getByTestId(id);
      const inline = cell.getAttribute('style') ?? '';
      expect(inline).toMatch(/background-color:\s*var\(--provedo-bg-muted\)/);
      expect(inline).toMatch(/border-color:\s*var\(--provedo-border-subtle\)/);
    }
  });

  it('cell #4 number stays slate-900 (PD §C.S2: accent moved to bg, NOT the number)', () => {
    render(<ProvedoNumericProofBar />);
    const heroCell = screen.getByTestId('proof-bar-cell-sources-hero');
    const sourcesNumber = within(heroCell).getByText('Sources') as HTMLElement;
    // The big-number style sets `color: var(--provedo-text-primary)` — anti-
    // regression for the prior version which used `var(--provedo-accent)` on
    // the number itself (created accent-on-accent washed contrast).
    expect(sourcesNumber.style.color).toBe('var(--provedo-text-primary)');
  });
});

describe('Slice-LP5-A — ProvedoDemoTeasersBento (S4 picture-first reduction §K.2)', () => {
  it('renders the new section heading + sub copy verbatim', () => {
    render(<ProvedoDemoTeasersBento />);
    expect(
      screen.getByRole('heading', { level: 2, name: /two answers. same shape on every question/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/these are two of the questions provedo answers daily/i),
    ).toBeInTheDocument();
  });

  it('renders 2 teaser surfaces in a side-by-side bento grid (mobile stacks 1-col)', () => {
    render(<ProvedoDemoTeasersBento />);
    const grid = screen.getByTestId('demo-teasers-grid');
    expect(grid).toBeInTheDocument();
    // 2-col grid at lg+, single column on mobile.
    expect(grid.className).toMatch(/\bgrid-cols-1\b/);
    expect(grid.className).toMatch(/\blg:grid-cols-2\b/);
  });

  it('Teaser 1 «Why?» reuses the ChatAppShell chrome with a dedicated header title', () => {
    render(<ProvedoDemoTeasersBento />);
    const teaser = screen.getByLabelText('Provedo answer · Why?');
    expect(teaser).toBeInTheDocument();
    expect(teaser.getAttribute('data-testid')).toBe('chat-app-shell');
    const header = within(teaser).getByTestId('chat-app-shell-header');
    expect(header.textContent).toMatch(/Why\?/);
  });

  it('Teaser 1 «Why?» includes ONE small inline PnlSparkline (the «mention charts exist» beat)', () => {
    render(<ProvedoDemoTeasersBento />);
    const teaser = screen.getByLabelText('Provedo answer · Why?');
    const sparklineSlot = within(teaser).getByTestId('teaser-why-sparkline');
    expect(sparklineSlot).toBeInTheDocument();
    // The inline sparkline carries an svg with the trend-line aria-label
    // (PnlSparklineAnimated component contract).
    const svg = within(sparklineSlot).getByRole('img');
    expect(svg.getAttribute('aria-label')).toMatch(/p&l/i);
  });

  it('Teaser 2 «Aggregate» renders ZERO inline charts (text-led + italic pull-quote)', () => {
    render(<ProvedoDemoTeasersBento />);
    const teaser = screen.getByLabelText('Provedo answer · Aggregate');
    expect(teaser).toBeInTheDocument();
    // The teaser must not include any svg chart — the «no chart on this one»
    // beat per PD §K.2 reinforces the picture-first pivot.
    expect(within(teaser).queryByRole('img')).toBeNull();
    // The italic Provedo-voice pull-quote carries the «here's the shape»
    // beat without needing a visualization.
    const pullquote = within(teaser).getByTestId('teaser-aggregate-pullquote');
    expect(pullquote.textContent).toMatch(
      /your tech exposure is about 2× the index['']s — driven by ibkr/i,
    );
  });

  it('both teasers carry their own Sources line below the response bubble', () => {
    const { container } = render(<ProvedoDemoTeasersBento />);
    const sources = container.querySelectorAll('[data-testid="provedo-sources"]');
    // 2 teasers × 1 sources each = 2 mounts.
    expect(sources.length).toBe(2);
    // Each one carries its own cite items — Teaser 1 cites AAPL/TSLA;
    // Teaser 2 cites the cross-broker statement + S&P methodology.
    const allText = Array.from(sources)
      .map((s) => s.textContent ?? '')
      .join('\n');
    expect(allText).toMatch(/aapl q3 earnings 2025-10-31/i);
    expect(allText).toMatch(/s&p 500 sector weights via s&p dji methodology 2025-q3/i);
  });

  it('mono-token pills (slate-100 bg, rounded) are used across both teasers (matches §K.1.a hero)', () => {
    const { container } = render(<ProvedoDemoTeasersBento />);
    const pills = container.querySelectorAll<HTMLElement>('[data-testid="teaser-mono-token"]');
    expect(pills.length).toBeGreaterThan(0);
    const first = pills[0] as HTMLElement;
    const inline = first.getAttribute('style') ?? '';
    expect(inline).toMatch(/font-family:\s*var\(--provedo-font-mono\)/);
    expect(inline).toMatch(/background-color:\s*var\(--provedo-bg-subtle\)/);
    expect(inline).toMatch(/border-radius:\s*4px/);
  });
});

describe('Slice-LP5-A — ProvedoDemoTabsV2 unmount + S7 testimonials unmount on landing', () => {
  it('landing page no longer mounts the 4-tab ProductTabBar (deferred)', () => {
    render(<MarketingHomePage />);
    // The legacy 4-tab pill switcher carried these tab triggers. They MUST
    // NOT render on the landing — the section is now the 2-teaser bento.
    expect(screen.queryByRole('tab', { name: /^why\?$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /^dividends$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /^patterns$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /^aggregate$/i })).not.toBeInTheDocument();
  });

  it('landing page no longer mounts the testimonials section (Slice-LP5-A PO directive)', () => {
    render(<MarketingHomePage />);
    // PD §S7 recommendation HIDE accepted by PO 2026-04-27 — the section
    // pre-loaded social-proof expectations the product cannot back yet.
    expect(screen.queryByText(/^coming q2 2026$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/alpha quotes coming q2 2026/i)).not.toBeInTheDocument();
  });
});

// ─── Slice-LP5-BCD — comprehensive PO-feedback-coverage block ─────────────
//
// This block aggregates the Slice-LP5-BCD changes that complete the section-
// by-section feedback PO surfaced after Slice-LP5-A. Each test guards a
// specific PO directive — the test names cite the directive verbatim so the
// rationale stays load-bearing in CI failures.

describe('Slice-LP5-BCD A1 — S3 Negation 2-card asymmetric table', () => {
  it('renders the 2-card asymmetric grid (NOT the prior single-column typeset)', () => {
    render(<ProvedoNegationSection />);
    const grid = screen.getByTestId('negation-cards-grid');
    expect(grid).toBeInTheDocument();
    // Both cards present.
    expect(screen.getByTestId('negation-card-not')).toBeInTheDocument();
    expect(screen.getByTestId('negation-card-is')).toBeInTheDocument();
  });

  it('drops the redundant «This is what Provedo is not.» h2 (PO «дважды дублируем»)', () => {
    const { container } = render(<ProvedoNegationSection />);
    expect(container.textContent ?? '').not.toMatch(/this is what provedo is not\./i);
  });

  it('drops the «Provedo» word eyebrow (PO «зачем перед этим текстом Provedo»)', () => {
    render(<ProvedoNegationSection />);
    // The new eyebrow is neutral «POSITIONING» — no «Provedo» word repetition.
    const eyebrow = screen.getByTestId('negation-eyebrow');
    expect(eyebrow.textContent).toMatch(/^positioning$/i);
    expect(eyebrow.textContent).not.toMatch(/provedo/i);
  });

  it('right card («What Provedo is») carries a teal-tinted layered shadow (asymmetric depth)', () => {
    render(<ProvedoNegationSection />);
    const isCard = screen.getByTestId('negation-card-is') as HTMLElement;
    const inline = isCard.getAttribute('style') ?? '';
    // Box-shadow uses teal-tinted rgba — the asymmetry IS the message per PD §C.S3.
    expect(inline).toMatch(/box-shadow:\s*[^;]*rgba\(13,\s*148,\s*136/);
  });

  it('mobile order: «What Provedo is» renders FIRST (positive-led on small screens)', () => {
    render(<ProvedoNegationSection />);
    const grid = screen.getByTestId('negation-cards-grid');
    // The «is» card has order-1 (mobile), order-2 wrapper (md+ via wrapper class).
    const cards = within(grid).getAllByTestId(/^negation-card-/);
    // Find the wrapper of the «is» card and verify its className contains «order-1»
    // for the mobile-first positive-led order.
    const isCardWrapper = cards.find(
      (el) => el.dataset.testid === 'negation-card-is',
    )?.parentElement;
    expect(isCardWrapper?.className ?? '').toMatch(/\border-1\b/);
  });
});

describe('Slice-LP5-BCD A2 — S5 Insights asymmetric bento', () => {
  it('renders the bento grid with one large hero card + two small cards (NOT 3 equal cards)', () => {
    render(<ProvedoInsightsBullets />);
    const grid = screen.getByTestId('insights-bento-grid');
    expect(grid).toBeInTheDocument();
    expect(screen.getByTestId('insights-bento-hero-card')).toBeInTheDocument();
    const smalls = screen.getAllByTestId('insights-bento-small-card');
    expect(smalls.length).toBe(2);
  });

  it('hero card occupies cols 1-8 at lg+ breakpoint (asymmetric 2/3 split)', () => {
    render(<ProvedoInsightsBullets />);
    const hero = screen.getByTestId('insights-bento-hero-card');
    expect(hero.className).toMatch(/lg:col-span-8/);
  });

  it('drops the lucide icon set + teal-tint badge pattern (PO «не красиво»)', () => {
    const { container } = render(<ProvedoInsightsBullets />);
    // No lucide-* class names anywhere in the rendered tree.
    expect(container.innerHTML).not.toMatch(/lucide-/i);
  });

  it('renders 3 bespoke inline SVG mini-illustrations (broker-graph + notif + cite-link)', () => {
    render(<ProvedoInsightsBullets />);
    expect(screen.getByTestId('insights-illustration-broker-graph')).toBeInTheDocument();
    expect(screen.getByTestId('insights-illustration-notification-stack')).toBeInTheDocument();
    expect(screen.getByTestId('insights-illustration-cite-link')).toBeInTheDocument();
  });
});

describe('Slice-LP5-BCD A3 — S6 Editorial atmosphere upgrade', () => {
  it('renders radial-glow + noise overlay + decorative «Q» glyph layers', () => {
    render(<ProvedoEditorialNarrative />);
    expect(screen.getByTestId('editorial-radial-glow')).toBeInTheDocument();
    expect(screen.getByTestId('editorial-noise-overlay')).toBeInTheDocument();
    const glyph = screen.getByTestId('editorial-decorative-glyph');
    expect(glyph).toBeInTheDocument();
    // Decorative — must be aria-hidden so SR users skip the «Q» glyph.
    expect(glyph.getAttribute('aria-hidden')).toBe('true');
  });

  it('closer line uses larger typography + gradient-on-text on second line', () => {
    render(<ProvedoEditorialNarrative />);
    const closer = screen.getByTestId('editorial-closer');
    expect(closer).toBeInTheDocument();
    // Both PO-locked lines preserved.
    expect(closer.textContent ?? '').toMatch(/you hold the assets/i);
    expect(closer.textContent ?? '').toMatch(/provedo holds the context/i);
    const gradientLine = screen.getByTestId('editorial-closer-gradient-line') as HTMLElement;
    const inline = gradientLine.getAttribute('style') ?? '';
    // Gradient via background-clip:text — Stripe-pattern, ONE word-cluster.
    expect(inline).toMatch(/background-clip:\s*text/);
    expect(inline).toMatch(/linear-gradient/);
  });
});

describe('Slice-LP5-BCD B1 — S9 FAQ 2-column magazine layout', () => {
  it('renders left col with FAQ eyebrow + intro line + right col accordion', () => {
    render(<ProvedoFAQ />);
    expect(screen.getByTestId('faq-grid')).toBeInTheDocument();
    expect(screen.getByTestId('faq-left-col')).toBeInTheDocument();
    expect(screen.getByTestId('faq-right-col')).toBeInTheDocument();
    // Lane-A clean intro line (observation-coded, not advice).
    expect(screen.getByText(/if you.re wondering, you.re not the first/i)).toBeInTheDocument();
  });

  it('left col carries the sticky behavior at md+ for magazine-style layout', () => {
    render(<ProvedoFAQ />);
    const leftCol = screen.getByTestId('faq-left-col');
    expect(leftCol.className).toMatch(/md:sticky/);
  });

  it('preserves all 6 FAQ questions in the right col accordion', () => {
    render(<ProvedoFAQ />);
    const rightCol = screen.getByTestId('faq-right-col');
    const detailsEls = rightCol.querySelectorAll('details');
    expect(detailsEls.length).toBe(6);
  });
});

describe('Slice-LP5-BCD B2 — S10 atmosphere upgrade matches §S6 visual rhyme', () => {
  it('renders atmosphere layers (radial-glow + noise + decorative arrow)', () => {
    render(<ProvedoRepeatCTAV2 />);
    expect(screen.getByTestId('cta-radial-glow')).toBeInTheDocument();
    expect(screen.getByTestId('cta-noise-overlay')).toBeInTheDocument();
    const arrow = screen.getByTestId('cta-decorative-arrow');
    expect(arrow).toBeInTheDocument();
    expect(arrow.getAttribute('aria-hidden')).toBe('true');
  });

  it('headline splits into two visual lines (italic-second-line rhyme with §S6)', () => {
    render(<ProvedoRepeatCTAV2 />);
    const italicLine = screen.getByTestId('cta-headline-italic-line') as HTMLElement;
    expect(italicLine.textContent).toMatch(/when you.re ready/i);
    expect(italicLine.getAttribute('style') ?? '').toMatch(/font-style:\s*italic/);
  });

  it('primary CTA carries an ambient teal glow (box-shadow on wrapper, not the button)', () => {
    render(<ProvedoRepeatCTAV2 />);
    const wrapper = screen.getByTestId('cta-button-glow-wrapper') as HTMLElement;
    const inline = wrapper.getAttribute('style') ?? '';
    expect(inline).toMatch(/box-shadow:\s*[^;]*rgba\(13,\s*148,\s*136/);
  });
});

describe('Slice-LP5-BCD B3 — Footer chrome refactor + visual separator', () => {
  it('renders the visual separator (warm-bg-muted bg + thicker top border)', () => {
    const { container } = render(<MarketingFooter />);
    const footer = container.querySelector('footer') as HTMLElement;
    const inline = footer.getAttribute('style') ?? '';
    expect(inline).toMatch(/background-color:\s*var\(--provedo-bg-muted\)/);
    // Browsers expand `border-top: 1px solid var(--token)` to per-property
    // longhand. Match the longhand emission produced by the CSS engine.
    expect(inline).toMatch(/border-top-width:\s*1px/);
    expect(inline).toMatch(/border-top-style:\s*solid/);
    expect(inline).toMatch(/border-top-color:\s*var\(--provedo-border-default\)/);
  });

  it('renders the wordmark with a single-letter «P» teal underline accent', () => {
    render(<MarketingFooter />);
    const wordmark = screen.getByTestId('footer-wordmark');
    expect(wordmark.textContent).toBe('Provedo');
    // The «P» span carries the teal underline; the rest of «rovedo» does not.
    const innerP = wordmark.querySelector('span');
    expect(innerP).not.toBeNull();
    const inline = innerP?.getAttribute('style') ?? '';
    // Browsers expand `border-bottom: 2px solid var(--token)` to per-property longhand.
    expect(inline).toMatch(/border-bottom-width:\s*2px/);
    expect(inline).toMatch(/border-bottom-style:\s*solid/);
    expect(inline).toMatch(/border-bottom-color:\s*var\(--provedo-accent\)/);
  });

  it("renders the tagline-rhyme italic line «Notice what you'd miss.» (PD §Footer)", () => {
    render(<MarketingFooter />);
    const tagline = screen.getByTestId('footer-tagline-rhyme') as HTMLElement;
    expect(tagline.textContent).toMatch(/notice what you.d miss/i);
    expect(tagline.getAttribute('style') ?? '').toMatch(/font-style:\s*italic/);
  });

  it('preserves the 3-layer disclaimer block (legal lock — Layer 1 + Layer 2 + Layer 3)', () => {
    render(<MarketingFooter />);
    // Layer 1 plain summary.
    expect(
      screen.getByText(/provedo provides general information about your portfolio/i),
    ).toBeInTheDocument();
    // Layer 2 expandable details.
    expect(screen.getByText(/full regulatory disclosures \(us, eu, uk\)/i)).toBeInTheDocument();
    // Layer 3 link to /disclosures.
    expect(screen.getByRole('link', { name: /read full extended disclosures/i })).toHaveAttribute(
      'href',
      '/disclosures',
    );
  });
});

describe('Slice-LP5-BCD C1 — Hero left-column equal-width alignment', () => {
  it('hero uses an explicit grid-cols-2 split at lg+ (left text col flush to padding edge)', () => {
    render(<ProvedoHeroV2 />);
    const heading = screen.getByRole('heading', { level: 1 });
    // Walk up to the column-grid wrapper that owns the lg:grid-cols-2 contract.
    // The grid wrapper is itself a div.flex (it carries `flex flex-col items-
    // center ... lg:grid lg:grid-cols-2`), so `closest('div.flex')` lands on it.
    const gridWrapper = heading.closest('div.flex');
    expect(gridWrapper).not.toBeNull();
    expect(gridWrapper?.className ?? '').toMatch(/lg:grid-cols-2/);
  });
});

describe('Slice-LP5-BCD C2 — Hero microcopy «No card. 50 free questions» dropped', () => {
  it('hero no longer renders the small-print «No card. 50 free questions a month.» line', () => {
    const { container } = render(<ProvedoHeroV2 />);
    // The Free-tier policy is implicit from product flow + repeated in §S10
    // pre-footer CTA + FAQ Q4. PO 2026-04-27 «зачем оставили».
    // The hero left col MUST NOT carry the line. We scope to the left col so a
    // future re-mount of the same copy elsewhere does not give a false pass.
    const heading = screen.getByRole('heading', { level: 1 });
    const leftCol = heading.closest('div');
    expect(leftCol?.textContent ?? '').not.toMatch(/no card\. 50 free questions a month/i);
    // Belt-and-suspenders — the section as a whole does not carry it.
    expect(container.textContent ?? '').not.toMatch(/no card\.\s*50 free questions a month\./i);
  });
});

describe('Slice-LP5-BCD C5 — Header inner-width matches main-content max-w-7xl', () => {
  it('header inner row is constrained to max-w-7xl (PO «текст в ней уже чем сама страница»)', () => {
    const { container } = render(<MarketingHeader />);
    const innerRow = container.querySelector('header > div');
    expect(innerRow?.className ?? '').toMatch(/\bmax-w-7xl\b/);
    // Anti-regression: the prior max-w-6xl must NOT be the chosen constraint.
    expect(innerRow?.className ?? '').not.toMatch(/\bmax-w-6xl\b/);
  });
});
