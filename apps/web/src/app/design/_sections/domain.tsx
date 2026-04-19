import {
  AccountConnectCard,
  AssetRow,
  Button,
  ChatMessage,
  InsightCard,
  Logo,
  PortfolioCard,
  TransactionRow,
} from '@investment-tracker/ui';
import { Building2, Landmark } from 'lucide-react';

export function DomainSection() {
  return (
    <section id="domain" className="space-y-10 scroll-mt-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Domain components</h2>
        <p className="text-sm text-text-secondary">Portfolio-specific building blocks.</p>
      </div>

      <Sub title="PortfolioCard">
        <div className="grid grid-cols-3 gap-4">
          <PortfolioCard
            label="Total portfolio"
            value="€124,350.12"
            change="+€2,134.00"
            changePct={1.73}
            caption="Today"
          />
          <PortfolioCard
            label="Stocks"
            value="€86,120.00"
            change="-€432.10"
            changePct={-0.5}
            caption="Today"
          />
          <PortfolioCard
            label="Crypto"
            value="€12,880.40"
            change="+€190.00"
            changePct={1.49}
            caption="24h"
          />
        </div>
      </Sub>

      <Sub title="AssetRow">
        <div className="divide-y divide-border-subtle rounded-lg border border-border-subtle bg-background-elevated">
          <AssetRow
            symbol="AAPL"
            name="Apple Inc."
            quantity="12.5 sh"
            price="$189.34"
            value="$2,366.75"
            changePct={1.25}
            iconSrc="https://logo.clearbit.com/apple.com"
          />
          <AssetRow
            symbol="BTC"
            name="Bitcoin"
            quantity="0.214"
            price="€58,120"
            value="€12,438"
            changePct={-2.14}
          />
          <AssetRow
            symbol="VWCE"
            name="Vanguard FTSE All-World"
            quantity="42.0"
            price="€118.30"
            value="€4,968.60"
            changePct={0.18}
          />
        </div>
      </Sub>

      <Sub title="TransactionRow">
        <div className="rounded-lg border border-border-subtle bg-background-elevated">
          <TransactionRow
            kind="buy"
            symbol="AAPL"
            title="Bought Apple"
            timestamp="Apr 12, 2026 · 10:24"
            amount="-$2,450.00"
            quantity="12.5 shares"
          />
          <TransactionRow
            kind="dividend"
            symbol="MSFT"
            title="Dividend"
            timestamp="Apr 10, 2026"
            amount="+$34.20"
          />
          <TransactionRow
            kind="withdrawal"
            title="Withdrawal"
            timestamp="Apr 08, 2026"
            amount="-€500.00"
          />
        </div>
      </Sub>

      <Sub title="InsightCard">
        <div className="grid grid-cols-2 gap-4">
          <InsightCard
            severity="info"
            title="Your tech allocation is up 38% YTD"
            body="NVIDIA and Microsoft together drove most of the gain. Consider trimming to rebalance."
            action={
              <Button size="sm" variant="outline">
                Learn more
              </Button>
            }
          />
          <InsightCard
            severity="warning"
            title="Concentration risk detected"
            body="Over 25% of your portfolio sits in a single position. Diversification could reduce volatility."
          />
        </div>
      </Sub>

      <Sub title="ChatMessage">
        <div className="max-w-xl space-y-3 rounded-lg border border-border-subtle bg-background-elevated p-4">
          <ChatMessage role="system">Apr 18, 2026</ChatMessage>
          <ChatMessage role="user" timestamp="10:24">
            Why is my portfolio down today?
          </ChatMessage>
          <ChatMessage role="assistant" timestamp="10:24">
            Your portfolio is down 1.2% today, mostly because of a 2.1% drop in NVDA which makes up
            18% of your holdings. Tech broadly is -0.8% on the day.
          </ChatMessage>
        </div>
      </Sub>

      <Sub title="AccountConnectCard">
        <div className="grid grid-cols-2 gap-4 max-w-3xl">
          <AccountConnectCard
            providerName="Interactive Brokers"
            tagline="US stocks + ETFs"
            icon={Landmark}
            status="connected"
          />
          <AccountConnectCard
            providerName="Trading 212"
            tagline="EU / UK broker"
            icon={Building2}
            status="not_connected"
          />
          <AccountConnectCard providerName="Binance" tagline="Crypto exchange" status="syncing" />
          <AccountConnectCard providerName="Kraken" tagline="Crypto exchange" status="error" />
        </div>
      </Sub>

      <Sub title="Logo variants">
        <div className="flex items-center gap-8 rounded-lg border border-border-subtle bg-background-elevated p-6">
          <LogoDemo variant="full" />
          <LogoDemo variant="mark" />
          <LogoDemo variant="wordmark" />
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

function LogoDemo({ variant }: { variant: 'full' | 'mark' | 'wordmark' }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Logo variant={variant} size={32} />
      <span className="font-mono text-[10px] text-text-tertiary">{variant}</span>
    </div>
  );
}
