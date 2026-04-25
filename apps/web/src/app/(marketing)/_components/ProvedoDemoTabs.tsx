'use client';

// ProvedoDemoTabs — §2 copy verbatim from docs/content/landing-provedo-v1.md v2
// Interactive tabs require 'use client' (useState via Tabs primitive).
// Chart placeholders = skeleton blocks per kickoff §2.7 Option C.
// Mock data: realistic but obviously placeholder (per kickoff §5).

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@investment-tracker/ui';

// Skeleton placeholder component — represents a chart area
function ChartSkeleton({ label, height = 120 }: { label: string; height?: number }) {
  return (
    <div
      className="mt-4 flex items-center justify-center rounded-lg border"
      style={{
        height: `${height}px`,
        borderColor: 'var(--provedo-border-subtle)',
        backgroundColor: 'var(--provedo-bg-muted)',
        fontFamily: 'var(--provedo-font-mono)',
      }}
      role="img"
      aria-label={label}
    >
      <span className="text-xs font-medium" style={{ color: 'var(--provedo-text-tertiary)' }}>
        {label}
      </span>
    </div>
  );
}

// Chat bubble — user message
function UserBubble({ children }: { children: React.ReactNode }) {
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

// Chat bubble — Provedo response
function ProvedoBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-sm md:max-w-md">
        {/* Provedo wordmark label */}
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

// Mono-styled number/ticker span
function Mono({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-medium"
      style={{
        fontFamily: 'var(--provedo-font-mono)',
        color: 'var(--provedo-text-primary)',
      }}
    >
      {children}
    </span>
  );
}

// Negative value — red
function Neg({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: 'var(--provedo-font-mono)', color: 'var(--provedo-negative)' }}>
      {children}
    </span>
  );
}

// Positive value — emerald
function Pos({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: 'var(--provedo-font-mono)', color: 'var(--provedo-positive)' }}>
      {children}
    </span>
  );
}

export function ProvedoDemoTabs() {
  return (
    <section
      id="demo"
      aria-labelledby="demo-heading"
      className="px-4 py-16 md:py-24"
      style={{ backgroundColor: 'var(--provedo-bg-page)' }}
    >
      <div className="mx-auto max-w-3xl">
        {/* Section header — verbatim §2 */}
        <div className="mb-10 text-center md:mb-14">
          <h2
            id="demo-heading"
            className="text-2xl font-semibold tracking-tight md:text-3xl"
            style={{ color: 'var(--provedo-text-primary)' }}
          >
            Ask on your actual holdings.
          </h2>
          <p
            className="mt-3 text-base leading-relaxed md:text-lg"
            style={{ color: 'var(--provedo-text-secondary)' }}
          >
            Four things Provedo can do on what you really own.{' '}
            <span style={{ color: 'var(--provedo-text-tertiary)' }}>
              Notice what you&apos;d miss.
            </span>
          </p>
        </div>

        {/* Tabs — keyboard-navigable via Tabs primitive arrow-key support */}
        <Tabs defaultValue="why">
          <TabsList
            className="mb-6 flex w-full justify-center overflow-x-auto"
            style={
              {
                // Override the default bg-background-secondary to use provedo tokens
                '--tw-bg-opacity': '1',
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
                <TabsTrigger
                  key={tab}
                  value={tab}
                  style={
                    {
                      '--provedo-trigger-active-bg': 'var(--provedo-bg-muted)',
                    } as React.CSSProperties
                  }
                >
                  {labels[tab]}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab 1 — Why? */}
          <TabsContent value="why">
            <div className="space-y-4">
              <UserBubble>Why is my portfolio down this month?</UserBubble>
              <ProvedoBubble>
                <p>
                  You&apos;re down <Neg>–4.2%</Neg> this month. <Mono>62%</Mono> of the drawdown is
                  two positions: <Mono>Apple (–11%, AAPL Q3 earnings)</Mono> and{' '}
                  <Mono>Tesla (–8%, TSLA delivery miss)</Mono>. The rest of your portfolio is
                  roughly flat.
                </p>
                <ChartSkeleton label="Chart of monthly P&L, sources cited inline" height={120} />
              </ProvedoBubble>
            </div>
          </TabsContent>

          {/* Tab 2 — Dividends */}
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
                <ChartSkeleton label="Calendar view, broker-confirmed dates linked" height={96} />
              </ProvedoBubble>
            </div>
          </TabsContent>

          {/* Tab 3 — Patterns (Coach surface — highest Lane A risk, audited) */}
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
                <p className="mt-2 text-xs" style={{ color: 'var(--provedo-text-tertiary)' }}>
                  Provedo notices — no judgment, no advice.
                </p>
                <ChartSkeleton
                  label="Trade timeline with sell points + 8-week-after marks"
                  height={120}
                />
              </ProvedoBubble>
            </div>
          </TabsContent>

          {/* Tab 4 — Aggregate */}
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
                <ChartSkeleton label="Allocation pie + per-broker breakdown" height={140} />
              </ProvedoBubble>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
