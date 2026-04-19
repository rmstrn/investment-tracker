'use client';

import {
  AskAiButton,
  BellDropdown,
  Button,
  GlobalBanner,
  LockedPreview,
  type Notification,
  PaywallModal,
  PlanBadge,
  SyncStatusBadge,
  TrustRow,
  UsageIndicator,
} from '@investment-tracker/ui';
import { useState } from 'react';

const DEMO_NOTIFS: Notification[] = [
  {
    id: '1',
    title: 'New insight generated',
    body: 'Tech allocation exceeds target by 12%',
    timestamp: '2m',
    tone: 'info',
  },
  {
    id: '2',
    title: 'Robinhood sync completed',
    body: '12 new transactions imported',
    timestamp: '1h',
    tone: 'success',
    read: true,
  },
  {
    id: '3',
    title: 'Binance — needs attention',
    body: 'API key expired, please reconnect',
    timestamp: '5h',
    tone: 'warning',
  },
];

export function FreemiumSection() {
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <section id="freemium" className="space-y-10 scroll-mt-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Freemium, trust &amp; account state
        </h2>
        <p className="text-sm text-text-secondary">
          Usage caps, paywall, plan badges, sync status, global banner, notifications bell.
        </p>
      </div>

      <Sub title="UsageIndicator — 3 tones (brief §13.3)">
        <div className="space-y-2 max-w-md">
          <UsageIndicator used={3} limit={5} unit="messages" plan="Free plan" />
          <UsageIndicator used={4} limit={5} unit="messages" />
          <UsageIndicator
            used={5}
            limit={5}
            unit="messages"
            upgradeCta={
              <AskAiButton size="sm" onClick={() => setPaywallOpen(true)}>
                Upgrade
              </AskAiButton>
            }
          />
        </div>
      </Sub>

      <Sub title="PaywallModal (brief §13.4)">
        <div className="flex gap-2">
          <Button onClick={() => setPaywallOpen(true)}>Open paywall</Button>
        </div>
        <PaywallModal
          open={paywallOpen}
          onOpenChange={setPaywallOpen}
          context="You've used 5 AI messages today. Plus unlocks unlimited conversations and daily insights."
          bullets={[
            'Unlimited AI chat messages',
            'Daily insights tailored to your portfolio',
            'Export to CSV',
            'Weekly performance digest',
          ]}
          upgradeLabel="Upgrade to Plus — $8/mo"
          onUpgrade={() => window.alert('Open Stripe checkout here')}
        />
      </Sub>

      <Sub title="LockedPreview — blur gate (brief §13.5)">
        <LockedPreview
          tier="Pro"
          description="Sharpe, Sortino, Max Drawdown, and factor exposure analytics."
          onUnlock={() => window.alert('Open Stripe checkout here')}
        >
          <div className="grid grid-cols-4 gap-3 p-6">
            {[
              { k: 'Sharpe', v: '1.24' },
              { k: 'Sortino', v: '1.86' },
              { k: 'Max DD', v: '-12.4%' },
              { k: 'Volatility', v: '14.2%' },
            ].map((m) => (
              <div
                key={m.k}
                className="rounded-md border border-border-subtle bg-background-elevated p-4"
              >
                <div className="text-xs text-text-tertiary">{m.k}</div>
                <div className="mt-1 font-mono text-xl font-bold tabular-nums">{m.v}</div>
              </div>
            ))}
          </div>
        </LockedPreview>
      </Sub>

      <Sub title="PlanBadge (brief §13.6)">
        <div className="flex items-center gap-3">
          <PlanBadge tier="free" showUpgradeHint />
          <PlanBadge tier="plus" />
          <PlanBadge tier="pro" />
        </div>
      </Sub>

      <Sub title="TrustRow — read-only assurance (brief §17.1)">
        <div className="space-y-3 max-w-xl">
          <TrustRow
            description="Via SnapTrade. We can never place trades or move funds — this is physically enforced by the broker's read-only scope."
            action={
              <Button variant="ghost" size="sm">
                How this works
              </Button>
            }
          />
          <div>
            <TrustRow variant="inline" />
          </div>
        </div>
      </Sub>

      <Sub title="SyncStatusBadge (brief §18.2)">
        <div className="space-y-2 max-w-md">
          <div className="flex items-center justify-between rounded-md border border-border-subtle bg-background-elevated p-3">
            <span className="text-sm text-text-primary">Robinhood</span>
            <SyncStatusBadge status="synced" label="Synced 2h ago" />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border-subtle bg-background-elevated p-3">
            <span className="text-sm text-text-primary">Coinbase</span>
            <SyncStatusBadge status="syncing" label="Syncing…" />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border-subtle bg-background-elevated p-3">
            <span className="text-sm text-text-primary">Binance</span>
            <SyncStatusBadge status="error" label="Needs attention" />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border-subtle bg-background-elevated p-3">
            <span className="text-sm text-text-primary">Interactive Brokers</span>
            <SyncStatusBadge status="paused" label="Paused by you" />
          </div>
        </div>
      </Sub>

      <Sub title="GlobalBanner (brief §18.3)">
        <div className="space-y-2">
          {bannerDismissed ? (
            <Button size="sm" variant="outline" onClick={() => setBannerDismissed(false)}>
              Restore banner
            </Button>
          ) : (
            <GlobalBanner
              tone="warning"
              action={<Button size="sm">Fix now</Button>}
              onDismiss={() => setBannerDismissed(true)}
            >
              1 of 3 accounts hasn't synced in 24h — <span className="font-medium">Robinhood</span>
            </GlobalBanner>
          )}
          <GlobalBanner tone="info">
            You're viewing demo data. <span className="font-medium">Connect a real account</span> to
            start tracking.
          </GlobalBanner>
          <GlobalBanner tone="danger">
            Your Pro subscription expired. AI features are limited.
          </GlobalBanner>
        </div>
      </Sub>

      <Sub title="BellDropdown (brief §16.1)">
        <div className="flex items-center gap-4">
          <BellDropdown items={DEMO_NOTIFS} />
          <BellDropdown items={[]} />
          <span className="text-xs text-text-tertiary">
            ↑ empty state is next to populated one.
          </span>
        </div>
      </Sub>
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-text-tertiary">{title}</h3>
      {children}
    </div>
  );
}
