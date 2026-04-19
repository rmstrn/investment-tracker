'use client';

import {
  AskAiButton,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CountUpNumber,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
  EmptyState,
  Input,
  SegmentedControl,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Shimmer,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  useToast,
} from '@investment-tracker/ui';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function PrimitivesSection() {
  return (
    <section id="primitives" className="space-y-10 scroll-mt-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Primitives</h2>
        <p className="text-sm text-text-secondary">shadcn-style building blocks, token-driven.</p>
      </div>

      <Sub title="Button — variants × sizes">
        <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
          {(['primary', 'secondary', 'ghost', 'outline', 'destructive'] as const).map((v) => (
            <div key={v} className="contents">
              <span className="font-mono text-xs text-text-tertiary">{v}</span>
              <div className="flex gap-2 items-center">
                <Button variant={v} size="sm">
                  Small
                </Button>
                <Button variant={v} size="md">
                  Medium
                </Button>
                <Button variant={v} size="lg">
                  Large
                </Button>
                <Button variant={v} disabled>
                  Disabled
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Sub>

      <Sub title="AskAiButton — special moments only (brief §6.2)">
        <div className="flex items-center gap-3 flex-wrap">
          <AskAiButton size="sm">Ask AI</AskAiButton>
          <AskAiButton size="md">Ask anything</AskAiButton>
          <AskAiButton size="lg">Should I rebalance?</AskAiButton>
          <AskAiButton fab aria-label="Ask AI FAB" />
          <span className="font-mono text-[11px] text-text-tertiary">
            ai-gradient + shadow-ai glow
          </span>
        </div>
      </Sub>

      <Sub title="SegmentedControl — period picker (brief §5.1)">
        <SegmentedControl
          label="Period"
          defaultValue="1M"
          options={[
            { value: '1D', label: '1D' },
            { value: '1W', label: '1W' },
            { value: '1M', label: '1M' },
            { value: '3M', label: '3M' },
            { value: '1Y', label: '1Y' },
            { value: 'All', label: 'All' },
          ]}
        />
      </Sub>

      <Sub title="CountUpNumber — tabular-nums exp-out (brief §3.5)">
        <CountUpDemo />
      </Sub>

      <Sub title="Input">
        <div className="grid grid-cols-3 gap-4 max-w-2xl">
          <Input placeholder="Email address" />
          <Input placeholder="Invalid state" invalid defaultValue="oops@" />
          <Input placeholder="Disabled" disabled />
        </div>
      </Sub>

      <Sub title="Card — default / elevated / interactive">
        <div className="grid grid-cols-3 gap-4">
          {(['default', 'elevated', 'interactive'] as const).map((v) => (
            <Card key={v} variant={v}>
              <CardHeader>
                <CardTitle>{v}</CardTitle>
                <CardDescription>Card variant example</CardDescription>
              </CardHeader>
              <CardContent>
                Content body. Uses semantic text tokens so it adapts to theme.
              </CardContent>
            </Card>
          ))}
        </div>
      </Sub>

      <Sub title="Badge">
        <div className="flex flex-wrap gap-2">
          {(['neutral', 'brand', 'positive', 'negative', 'warning', 'info'] as const).map((t) => (
            <Badge key={t} tone={t}>
              {t}
            </Badge>
          ))}
        </div>
      </Sub>

      <Sub title="Avatar">
        <div className="flex items-center gap-4">
          <Avatar size="sm" fallback="SA" alt="Sam" />
          <Avatar size="md" fallback="MK" alt="Maria" />
          <Avatar size="lg" fallback="TJ" alt="Tom" />
        </div>
      </Sub>

      <Sub title="Skeleton / Shimmer (brief §6.8 — never spinners)">
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          <div className="space-y-3">
            <span className="font-mono text-xs text-text-tertiary">Skeleton (static pulse)</span>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="space-y-3">
            <span className="font-mono text-xs text-text-tertiary">Shimmer (violet sweep)</span>
            <Shimmer className="h-4 w-40" />
            <Shimmer className="h-4 w-64" />
            <Shimmer className="h-24 w-full" />
          </div>
        </div>
      </Sub>

      <Sub title="EmptyState (brief §6.7)">
        <Card className="!p-0">
          <EmptyState
            title="No transactions yet"
            description="Connect an account or add your first manual transaction to start tracking."
            primaryAction={<Button>+ Connect account</Button>}
            secondaryAction={<Button variant="outline">+ Add manually</Button>}
          />
        </Card>
      </Sub>

      <Sub title="Tabs">
        <Tabs defaultValue="overview" className="max-w-lg">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="text-sm text-text-secondary">
            Summary view of holdings, allocation, and performance.
          </TabsContent>
          <TabsContent value="positions" className="text-sm text-text-secondary">
            Detailed table of all positions grouped by asset class.
          </TabsContent>
          <TabsContent value="activity" className="text-sm text-text-secondary">
            Transactions, deposits, dividends.
          </TabsContent>
        </Tabs>
      </Sub>

      <Sub title="Dialog / Sheet / Dropdown / Tooltip / Toast">
        <div className="flex flex-wrap gap-3">
          <DialogDemo />
          <SheetDemo />
          <DropdownDemo />
          <TooltipDemo />
          <ToastDemo />
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

function CountUpDemo() {
  const [v, setV] = useState(127450);
  return (
    <div className="space-y-3">
      <p
        className="font-bold tracking-tighter"
        style={{ fontSize: 'var(--text-display-lg)', lineHeight: '1.1' }}
      >
        $
        <CountUpNumber
          value={v}
          format={(n) => n.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        />
      </p>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => setV((x) => x + 1234)}>+ $1,234</Button>
        <Button variant="outline" size="sm" onClick={() => setV((x) => x - 567)}>− $567</Button>
        <Button variant="ghost" size="sm" onClick={() => setV(127450)}>Reset</Button>
      </div>
      <p className="text-[11px] text-text-tertiary">
        800ms exp-out · tabular-nums · respects prefers-reduced-motion.
      </p>
    </div>
  );
}

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirm action</DialogTitle>
        <DialogDescription>
          This is a dialog with focus trap and Escape-to-close. Clicking the overlay dismisses.
        </DialogDescription>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SheetDemo() {
  return (
    <Sheet side="right">
      <SheetTrigger>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>Filters</SheetTitle>
        <p className="mt-2 text-sm text-text-secondary">
          Slide-over panel for side content (filters, details, settings).
        </p>
      </SheetContent>
    </Sheet>
  );
}

function DropdownDemo() {
  return (
    <Dropdown>
      <DropdownTrigger className="inline-flex h-10 items-center gap-2 rounded-md border border-border-default bg-background-elevated px-4 text-sm text-text-primary hover:bg-interactive-ghostHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
        Options
        <ChevronDown size={14} aria-hidden="true" />
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem>Duplicate</DropdownItem>
        <DropdownSeparator />
        <DropdownItem destructive>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

function TooltipDemo() {
  return (
    <Tooltip label="Performance vs. S&P 500 benchmark">
      <Button variant="outline">Hover for tooltip</Button>
    </Tooltip>
  );
}

function ToastDemo() {
  const { toast } = useToast();
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast({
          title: 'Sync complete',
          description: 'Fetched 12 transactions from Interactive Brokers.',
          tone: 'positive',
        })
      }
    >
      Show toast
    </Button>
  );
}
