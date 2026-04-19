'use client';

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Input,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  useToast,
} from '@investment-tracker/ui';
import { ChevronDown } from 'lucide-react';

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

      <Sub title="Skeleton">
        <div className="space-y-3 max-w-sm">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-24 w-full" />
        </div>
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
