'use client';

// ProvedoDemoTeasersBento — §S4 picture-first reduction (Slice-LP5-A §K.2)
//
// PO pivot 2026-04-27: charts are mentioned and shown in «парочку» (a couple),
// not as a 4-tab interactive product-demo. PD spec §K.2 binds the 2-teaser
// bento layout.
//
// Replaces ProvedoDemoTabsV2's 4-tab ProductTabBar with two side-by-side
// bento teaser cards. Both reuse the new <ChatAppShell> chrome from §K.1.b
// (so the hero + S4 share the same chat-app visual language). Asymmetric
// content shape carries the message «charts exist, but they're not the main
// thing»:
//
//   Teaser 1 («Why?») — text-led answer + ONE small inline PnlSparkline at
//   the bottom of the response (the «mention charts exist» beat).
//
//   Teaser 2 («Aggregate») — text-led answer + italic Provedo-voice pull-
//   quote line. NO chart. The asymmetry reinforces the picture-first pivot.
//
// Section header — Slice-LP6 §gap-6 voice cuts (content-lead REJECT):
//   OLD: «Two answers. Same shape on every question.» (internal-team copy)
//   NEW: «See how Provedo answers.» (visitor-language; the two surfaces
//        speak for themselves without needing the «same shape» preface).
//   Section sub also DROPPED entirely — «read, mono tokens, sources» was
//   design-system vocabulary leaking into marketing copy.
//
// Layout (PD §K.2):
//   - 12-col grid on lg+, gap-8.
//   - Teaser 1 spans cols 1–6. Teaser 2 spans cols 7–12.
//   - Both equal min-height ~440px to align bottom edges.
//   - Mobile: stack 1-col, gap-6. Teaser 1 first.
//
// What's deferred (NOT in this slice):
//   - 4-tab ProductTabBar pill switcher.
//   - Tab 2 DividendCalendar craft upgrade.
//   - Tab 3 TradeTimeline simultaneous-animation lock (legal-advisor lock
//     from `8cb509b` stays binding for any future re-introduction).
//   - Tab 4 AllocationPieBar craft upgrade.

import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { Sources } from './Sources';
import { PnlSparklineAnimated } from './charts/PnlSparklineAnimated';
import { ChatAppShell } from './hero/ChatAppShell';

// ─── Inline mono-token + neg-token primitives (matches §K.1.a pill style) ──

function MonoPill({ children }: { children: ReactNode }): ReactElement {
  return (
    <span
      data-testid="teaser-mono-token"
      style={{
        fontFamily: 'var(--provedo-font-mono)',
        fontWeight: 500,
        fontSize: '12px',
        color: 'var(--provedo-text-secondary)',
        backgroundColor: 'var(--provedo-bg-subtle)',
        padding: '1px 6px',
        borderRadius: '4px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

function NegPill({ children }: { children: ReactNode }): ReactElement {
  return (
    <span
      style={{
        fontFamily: 'var(--provedo-font-mono)',
        fontWeight: 500,
        fontSize: '12px',
        color: 'var(--provedo-negative)',
        backgroundColor: 'rgba(220, 38, 38, 0.08)',
        padding: '1px 6px',
        borderRadius: '4px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

// ─── Shared bubble primitives (visually mirror the hero's bubbles) ─────────

function UserBubble({ children }: { children: ReactNode }): ReactElement {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed"
        style={{
          backgroundColor: 'var(--provedo-bg-subtle)',
          color: 'var(--provedo-text-secondary)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface ProvedoBubbleProps {
  children: ReactNode;
  testId?: string;
}

function ProvedoBubble({ children, testId }: ProvedoBubbleProps): ReactElement {
  return (
    <div className="flex justify-start">
      <div className="max-w-full">
        <p
          className="mb-1.5 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--provedo-accent)' }}
        >
          Provedo
        </p>
        <div
          data-testid={testId}
          className="rounded-2xl rounded-tl-sm border px-4 py-3 text-sm leading-relaxed"
          style={{
            backgroundColor: 'var(--provedo-bg-elevated)',
            borderColor: 'var(--provedo-border-subtle)',
            color: 'var(--provedo-text-primary)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Teaser 1 — «Why?» (text-led + ONE inline sparkline) ──────────────────

function TeaserWhy(): ReactElement {
  // Source items mirror the hero answer's sources line so the «same shape»
  // promise reads as page-level coherence. Verbatim per §S4 Tab 1 lock.
  const sourceItems = [
    'AAPL Q3 earnings 2025-10-31',
    'TSLA Q3 delivery report 2025-10-22',
    'holdings via Schwab statement 2025-11-01',
  ] as const;

  return (
    <ChatAppShell
      ariaLabel="Provedo answer · Why?"
      headerTitle="Why?"
      statusLabel="live"
      messageMinHeight="320px"
      className="h-full"
    >
      <div className="flex flex-col gap-3">
        <UserBubble>Why is my portfolio down this month?</UserBubble>
        <ProvedoBubble testId="teaser-why-bubble">
          <p>
            You&apos;re down <NegPill>−4.2%</NegPill> this month. <MonoPill>62%</MonoPill> of the
            drawdown is two positions: <MonoPill>Apple (−11%)</MonoPill> after Q3 earnings on{' '}
            <MonoPill>2025-10-31</MonoPill>, and <MonoPill>Tesla (−8%)</MonoPill> after the{' '}
            <MonoPill>2025-10-22</MonoPill> delivery miss. The rest of your portfolio is roughly
            flat.
          </p>
          {/* The «mention charts exist» beat — single small inline sparkline
              sitting BELOW the text answer. Not the hero of the response;
              the answer is read-led, the chart is supporting detail. */}
          <div data-testid="teaser-why-sparkline" className="mt-3">
            <PnlSparklineAnimated />
          </div>
          <Sources items={sourceItems} />
        </ProvedoBubble>
      </div>
    </ChatAppShell>
  );
}

// ─── Teaser 2 — «Aggregate» (text-led, italic Provedo-voice pull-quote) ────

function TeaserAggregate(): ReactElement {
  // Slice-LP6 §gap-4: source items unmounted (Sources receipt dropped from
  // this teaser — see comment at JSX site below). Cite items for the
  // cross-broker statement + S&P methodology now live ONLY in the matching
  // chat-prompts.ts catalog so the chip-driven hero replay carries them.
  return (
    <ChatAppShell
      ariaLabel="Provedo answer · Aggregate"
      headerTitle="Aggregate"
      statusLabel="live"
      messageMinHeight="320px"
      className="h-full"
    >
      <div className="flex flex-col gap-3">
        <UserBubble>What&apos;s my sector exposure across all brokers?</UserBubble>
        <ProvedoBubble testId="teaser-aggregate-bubble">
          <p>
            Across both accounts, tech is <MonoPill>58%</MonoPill> of your equity exposure — about{' '}
            <MonoPill>2x</MonoPill> the sector&apos;s weight in S&amp;P 500 (
            <MonoPill>~28%</MonoPill>). <MonoPill>IBKR</MonoPill> carries the bulk:{' '}
            <MonoPill>AAPL ($14k)</MonoPill>, <MonoPill>MSFT ($9k)</MonoPill>,{' '}
            <MonoPill>NVDA ($8k)</MonoPill>. <MonoPill>Schwab</MonoPill> adds{' '}
            <MonoPill>GOOG ($3k)</MonoPill> and <MonoPill>AMZN ($2k)</MonoPill>.
          </p>
          {/* Italic Provedo-voice pull-quote — Lane-A clean, observation-coded.
              Replaces the dropped chart; the pull-quote IS the «here's the
              shape» beat without needing a visualization. */}
          <p
            data-testid="teaser-aggregate-pullquote"
            className="mt-3 border-l-2 pl-3"
            style={{
              fontStyle: 'italic',
              color: 'var(--provedo-text-secondary)',
              borderLeftColor: 'var(--provedo-accent)',
            }}
          >
            Your tech exposure is about 2× the index&apos;s — driven by IBKR.
          </p>
          {/* Slice-LP6 §gap-4 — Sources mount DROPPED from Teaser 2 (PD + voice
              + content convergence: «sources/cites/notice» triad repeated
              3-4 sections in a row dilutes the first mention). Teaser 2 is
              text-led already — the pull-quote carries the observation
              chrome without needing receipt-rule treatment. */}
        </ProvedoBubble>
      </div>
    </ChatAppShell>
  );
}

// ─── Section composer ─────────────────────────────────────────────────────

const SECTION_HEADER_STYLE: CSSProperties = {
  color: 'var(--provedo-text-primary)',
};

export function ProvedoDemoTeasersBento(): ReactElement {
  return (
    <section
      id="demo"
      aria-labelledby="demo-teasers-heading"
      className="px-4 py-16 md:py-24"
      style={{ backgroundColor: 'var(--provedo-bg-page)' }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center md:mb-14">
          <h2
            id="demo-teasers-heading"
            className="text-2xl font-semibold tracking-tight md:text-3xl"
            style={SECTION_HEADER_STYLE}
          >
            See how Provedo answers.
          </h2>
          {/* Slice-LP6 §gap-6 voice cuts: section sub DROPPED entirely.
              Old copy («Same shape on every one — read, mono tokens, sources»)
              was design-system vocabulary leaking into marketing copy
              (content-lead REJECT). The two surfaces speak for themselves. */}
        </div>

        <div
          data-testid="demo-teasers-grid"
          className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8"
        >
          <TeaserWhy />
          <TeaserAggregate />
        </div>
      </div>
    </section>
  );
}
