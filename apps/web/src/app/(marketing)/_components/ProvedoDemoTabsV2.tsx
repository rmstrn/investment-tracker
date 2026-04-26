'use client';

// ProvedoDemoTabsV2 — §S4 demo tabs with animated inline SVG charts (v3.2)
// V3.2 (Slice-LP3.2): inline source citation footer added to all 4 tabs (content-lead D1).
//   - Tab 1 + Tab 2 also lift inline event labels (AAPL Q3 earnings, TSLA delivery miss).
//   - Tab 3 + Tab 4 phrasing PRESERVED verbatim from `8cb509b` legal/finance v3.1 patches.
//   - Source-line styling mirrors Tab 3's existing disclaimer (text-xs italic, text-tertiary).
// V3.2 — all 4 charts replaced with animated versions (PnlSparklineAnimated etc.)
// Patch C: section header reframed «Ask anything.» + sub «Four real questions on your actual holdings. Notice what you'd miss.»
// Lane A: Tab 3 patterns section audited — «not a recommendation about future trading decisions» retained

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@investment-tracker/ui';
import { Sources } from './Sources';
import { AllocationPieBarAnimated } from './charts/AllocationPieBarAnimated';
import { DividendCalendarAnimated } from './charts/DividendCalendarAnimated';
import { PnlSparklineAnimated } from './charts/PnlSparklineAnimated';
import { TradeTimelineAnimated } from './charts/TradeTimelineAnimated';

// ─── Chat bubble primitives ──────────────────────────────────────────────────

function UserBubble({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-xs rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed md:max-w-sm"
        style={{
          backgroundColor: 'var(--provedo-bg-subtle)',
          color: 'var(--provedo-text-secondary)',
          border: '1px solid var(--provedo-border-subtle)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ProvedoBubble({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div className="flex justify-start">
      <div className="max-w-sm md:max-w-md">
        <p
          className="mb-1.5 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--provedo-accent)' }}
        >
          Provedo
        </p>
        <div
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

function Mono({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <span style={{ fontFamily: 'var(--provedo-font-mono)', color: 'var(--provedo-text-primary)' }}>
      {children}
    </span>
  );
}

function Neg({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <span style={{ fontFamily: 'var(--provedo-font-mono)', color: 'var(--provedo-negative)' }}>
      {children}
    </span>
  );
}

function Pos({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <span style={{ fontFamily: 'var(--provedo-font-mono)', color: 'var(--provedo-positive)' }}>
      {children}
    </span>
  );
}

// Sources primitive (Slice-LP3.5): inline citation now rendered via the
// shared <Sources items={...}> component imported from `./Sources`. The
// previous inline implementation is removed; tab-specific source lists live
// alongside each tab's content below.

// ─── Main component ──────────────────────────────────────────────────────────

export function ProvedoDemoTabsV2(): React.ReactElement {
  return (
    <section
      id="demo"
      aria-labelledby="demo-v2-heading"
      className="px-4 py-16 md:py-24"
      style={{ backgroundColor: 'var(--provedo-bg-page)' }}
    >
      <div className="mx-auto max-w-3xl">
        {/* Section header — Patch C: reframed */}
        <div className="mb-10 text-center md:mb-14">
          <h2
            id="demo-v2-heading"
            className="text-2xl font-semibold tracking-tight md:text-3xl"
            style={{ color: 'var(--provedo-text-primary)' }}
          >
            Ask anything.
          </h2>
          <p
            className="mt-3 text-base leading-relaxed md:text-lg"
            style={{ color: 'var(--provedo-text-secondary)' }}
          >
            Four real questions on your actual holdings. Notice what you&apos;d miss.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="why">
          <TabsList
            className="mb-6 flex w-full justify-center overflow-x-auto"
            style={
              {
                backgroundColor: 'var(--provedo-bg-elevated)',
                border: '1px solid var(--provedo-border-subtle)',
              } as React.CSSProperties
            }
          >
            {(['why', 'dividends', 'patterns', 'aggregate'] as const).map((tab) => {
              const labels: Record<string, string> = {
                why: 'Why?',
                dividends: 'Dividends',
                patterns: 'Patterns',
                aggregate: 'Aggregate',
              };
              return (
                <TabsTrigger key={tab} value={tab}>
                  {labels[tab]}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab 1 — Why? — Animated P&L Sparkline (v3.2: source line per content-lead D1) */}
          <TabsContent value="why">
            <div className="space-y-4">
              <UserBubble>Why is my portfolio down this month?</UserBubble>
              <ProvedoBubble>
                <p>
                  You&apos;re down <Neg>−4.2%</Neg> this month. <Mono>62%</Mono> of the drawdown is
                  two positions: <Mono>Apple (−11%)</Mono> after Q3 earnings on{' '}
                  <Mono>2025-10-31</Mono> and <Mono>Tesla (−8%)</Mono> after the{' '}
                  <Mono>2025-10-22</Mono> delivery miss. The rest of your portfolio is roughly flat.
                </p>
                <Sources
                  items={[
                    'AAPL Q3 earnings 2025-10-31',
                    'TSLA Q3 delivery report 2025-10-22',
                    'holdings via Schwab statement 2025-11-01',
                  ]}
                />
                <PnlSparklineAnimated />
              </ProvedoBubble>
            </div>
          </TabsContent>

          {/* Tab 2 — Dividends — Animated Calendar (v3.2: source line per content-lead D1) */}
          <TabsContent value="dividends">
            <div className="space-y-4">
              <UserBubble>When are dividends coming this quarter?</UserBubble>
              <ProvedoBubble>
                <p>
                  This quarter, <Pos>$312</Pos> expected across your holdings. Largest:{' '}
                  <Mono>KO</Mono> ex-div <Mono>Sept 14 ($87)</Mono>, <Mono>VZ</Mono> ex-div{' '}
                  <Mono>Oct 7 ($74)</Mono>, <Mono>MSFT</Mono> ex-div <Mono>Nov 19 ($61)</Mono>.
                  Three smaller payments after that.
                </p>
                <Sources
                  items={[
                    'ex-dividend dates from issuer investor-relations announcements',
                    'per-share amounts × your holdings of record on Schwab statement 2025-09-30',
                  ]}
                />
                <DividendCalendarAnimated />
              </ProvedoBubble>
            </div>
          </TabsContent>

          {/* Tab 3 — Patterns (Coach surface — highest Lane A risk, fully audited)
              v3.2: phrasing PRESERVED verbatim from `8cb509b` legal-advisor patch (load-bearing).
              Source line added per content-lead D1 — strengthens «every observation cited» promise. */}
          <TabsContent value="patterns">
            <div className="space-y-4">
              <UserBubble>Anything unusual in my trades this year?</UserBubble>
              <ProvedoBubble>
                <p>
                  You sold <Mono>Apple</Mono> within <Mono>3 trading days</Mono> of a{' '}
                  <Neg>&gt;5% drop</Neg>, three times last year. Each time, <Mono>AAPL</Mono>&apos;s
                  price returned above your sell level within <Mono>8 weeks</Mono>. This is a common
                  pattern across retail investors.
                </p>
                <p className="mt-2 text-xs" style={{ color: 'var(--provedo-text-tertiary)' }}>
                  Retrospective observation about past trades; not a recommendation about future
                  trading decisions. Past patterns do not predict future results.
                </p>
                <Sources
                  items={[
                    'AAPL trade timestamps from your Schwab + IBKR statements 2025-01-01 to 2025-12-31',
                    'AAPL daily close from public market data',
                    'disposition-effect pattern per Shefrin & Statman (1985)',
                  ]}
                />
                <TradeTimelineAnimated />
              </ProvedoBubble>
            </div>
          </TabsContent>

          {/* Tab 4 — Aggregate — Animated Donut + Bar
              v3.2: phrasing PRESERVED verbatim from `8cb509b` finance-advisor patch (sourced
              «about 2x the sector's weight in S&P 500 (~28%)»). Source line added per D1. */}
          <TabsContent value="aggregate">
            <div className="space-y-4">
              <UserBubble>How much tech am I holding across IBKR + Schwab?</UserBubble>
              <ProvedoBubble>
                <p>
                  Across both accounts, tech is <Mono>58%</Mono> of your equity exposure — about{' '}
                  <Mono>2x</Mono> the sector&apos;s weight in S&amp;P 500 (<Mono>~28%</Mono>).{' '}
                  <Mono>IBKR</Mono> carries the bulk: <Mono>AAPL ($14k)</Mono>,{' '}
                  <Mono>MSFT ($9k)</Mono>, <Mono>NVDA ($8k)</Mono>. <Mono>Schwab</Mono> adds{' '}
                  <Mono>GOOG ($3k)</Mono> and <Mono>AMZN ($2k)</Mono>.
                </p>
                {/* Tab 4: Sources is rendered by AllocationPieBarAnimated below
                    (alongside the comparison-bars + accounts ledger) so the cite
                    line sits next to the visualization it backs, not duplicated
                    in the chat bubble. */}
                <AllocationPieBarAnimated />
              </ProvedoBubble>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
