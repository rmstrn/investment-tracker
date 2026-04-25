'use client';

// ProvedoDemoTabsV2 — §S4 demo tabs with animated inline SVG charts (v3)
// V3.2: all 4 charts replaced with animated versions (PnlSparklineAnimated etc.)
// Patch C: section header reframed «Ask anything.» + sub «Four real questions on your actual holdings. Notice what you'd miss.»
// Patch B: «week» → «day» not applicable in this section (week refs are in S5)
// Lane A: Tab 3 patterns section audited — «no judgment, no advice» disclaim retained

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@investment-tracker/ui';
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

          {/* Tab 1 — Why? — Animated P&L Sparkline */}
          <TabsContent value="why">
            <div className="space-y-4">
              <UserBubble>Why is my portfolio down this month?</UserBubble>
              <ProvedoBubble>
                <p>
                  You&apos;re down <Neg>−4.2%</Neg> this month. <Mono>62%</Mono> of the drawdown is
                  two positions: <Mono>Apple (−11%, AAPL Q3 earnings)</Mono> and{' '}
                  <Mono>Tesla (−8%, TSLA delivery miss)</Mono>. The rest of your portfolio is
                  roughly flat.
                </p>
                <PnlSparklineAnimated />
              </ProvedoBubble>
            </div>
          </TabsContent>

          {/* Tab 2 — Dividends — Animated Calendar */}
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
                <DividendCalendarAnimated />
              </ProvedoBubble>
            </div>
          </TabsContent>

          {/* Tab 3 — Patterns (Coach surface — highest Lane A risk, fully audited) */}
          <TabsContent value="patterns">
            <div className="space-y-4">
              <UserBubble>Anything unusual in my trades this year?</UserBubble>
              <ProvedoBubble>
                <p>
                  One pattern stands out. You sold <Mono>Apple</Mono> within{' '}
                  <Mono>3 trading days</Mono> of a <Neg>&gt;5% drop</Neg>, three times last year.
                  Each time, <Mono>AAPL</Mono> recovered above your sell price within{' '}
                  <Mono>8 weeks</Mono>.
                </p>
                <TradeTimelineAnimated />
              </ProvedoBubble>
            </div>
          </TabsContent>

          {/* Tab 4 — Aggregate — Animated Donut + Bar */}
          <TabsContent value="aggregate">
            <div className="space-y-4">
              <UserBubble>How much tech am I holding across IBKR + Schwab?</UserBubble>
              <ProvedoBubble>
                <p>
                  Across both accounts, tech is <Mono>58%</Mono> of your equity exposure.{' '}
                  <Mono>IBKR</Mono> carries the bulk: <Mono>AAPL ($14k)</Mono>,{' '}
                  <Mono>MSFT ($9k)</Mono>, <Mono>NVDA ($8k)</Mono>. <Mono>Schwab</Mono> adds{' '}
                  <Mono>GOOG ($3k)</Mono> and <Mono>AMZN ($2k)</Mono>. For context, US retail median
                  tech allocation is around <Mono>34%</Mono>.
                </p>
                <AllocationPieBarAnimated />
              </ProvedoBubble>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
