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
  EmptyState,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  useToast,
} from '@investment-tracker/ui';
import { Search, Sparkles } from 'lucide-react';
import { Section, SubBlock } from '../_components/Section';

/**
 * §Primitives — Tier-1 building blocks from `packages/ui/src/primitives/`.
 *
 * Curated subset showing variants + states for the most-used primitives.
 * Each demo mounts the real component (no static markup) so hover / focus /
 * active states are CSS-driven and interactive.
 *
 * The full primitive inventory (30+) is covered by Storybook in a future
 * slice; this showcase prioritizes the surfaces designers reference daily
 * + the new DSM-V1 launch additions (Phase γ — placeholder note below).
 */
export function PrimitivesSection() {
  return (
    <Section
      id="primitives"
      eyebrow="§ Primitives"
      title="Tier-1 building blocks"
      description="Real React mounts from @investment-tracker/ui. Hover / focus / active states are CSS-driven — interact directly to verify each transition."
    >
      <SubBlock title="Buttons" meta="5 variants × 3 sizes">
        <div className="showcase-demo-card space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
            <Button data-force-focus="true">Forced focus</Button>
          </div>
        </div>
      </SubBlock>

      <SubBlock title="Inputs" meta="default · search · error">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="showcase-demo-card space-y-2">
            <label
              htmlFor="ds-input-default"
              className="font-mono uppercase block"
              style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--text-3)' }}
            >
              Default
            </label>
            <Input id="ds-input-default" placeholder="Add a holding…" />
          </div>
          <div className="showcase-demo-card space-y-2">
            <label
              htmlFor="ds-input-search"
              className="font-mono uppercase block"
              style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--text-3)' }}
            >
              With icon
            </label>
            <div className="relative">
              <Search
                size={14}
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
              />
              <Input id="ds-input-search" placeholder="Search transactions…" className="pl-9" />
            </div>
          </div>
          <div className="showcase-demo-card space-y-2">
            <label
              htmlFor="ds-input-error"
              className="font-mono uppercase block"
              style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--text-3)' }}
            >
              Error
            </label>
            <Input
              id="ds-input-error"
              defaultValue="-12 invalid"
              aria-invalid="true"
              className="border-state-negative-default focus:border-state-negative-default"
            />
            <p style={{ fontSize: '11px', color: 'var(--terra)' }}>
              Quantity must be a positive number.
            </p>
          </div>
        </div>
      </SubBlock>

      <SubBlock title="Badge + Avatar" meta="status + identity">
        <div className="showcase-demo-card flex flex-wrap items-center gap-4">
          <Badge>Default</Badge>
          <Badge tone="positive">Positive</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="info">Info</Badge>
          <Badge tone="negative">Negative</Badge>
          <span className="mx-2 h-6 w-px bg-border-subtle" aria-hidden />
          <Avatar fallback="RM" />
          <Avatar fallback="PT" size="sm" />
          <Avatar fallback="AI" size="lg" />
        </div>
      </SubBlock>

      <SubBlock title="Card — surface" meta="paper-feel container">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio overview</CardTitle>
              <CardDescription>Snapshot across 4 connected brokers.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold tabular-nums tracking-tight" style={{ fontSize: '32px' }}>
                $226,390
              </p>
              <p style={{ fontSize: '13px', color: 'var(--accent)' }}>+$7,890 · +3.6%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Latest insight</CardTitle>
              <CardDescription>Jade-tagged · explainable · sourced.</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.55 }}>
                Concentration risk in tech sector reached 38%, exceeding your{' '}
                <Sparkles size={11} className="inline" aria-hidden /> 30% guardrail.
              </p>
            </CardContent>
          </Card>
        </div>
      </SubBlock>

      <SubBlock title="Tabs" meta="active-indicator">
        <div className="showcase-demo-card">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="positions">Positions</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-4 text-sm text-text-secondary">
              Click between tabs — the active indicator slides under the trigger.
            </TabsContent>
            <TabsContent value="positions" className="pt-4 text-sm text-text-secondary">
              Positions tab content (mock).
            </TabsContent>
            <TabsContent value="activity" className="pt-4 text-sm text-text-secondary">
              Activity tab content (mock).
            </TabsContent>
          </Tabs>
        </div>
      </SubBlock>

      <SubBlock title="Dialog · Tooltip · Toast" meta="overlays + transient feedback">
        <div className="showcase-demo-card flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger>
              <span className="inline-flex h-10 items-center rounded-md bg-interactive-primary px-4 text-sm font-medium text-text-onBrand">
                Open dialog
              </span>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Disconnect broker?</DialogTitle>
              <DialogDescription>
                We&apos;ll stop syncing positions from this account. You can reconnect anytime.
              </DialogDescription>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost">Cancel</Button>
                <Button variant="destructive">Disconnect</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Tooltip label="Cumulative cash flow vs. baseline. Computed at close.">
            <Button variant="outline">Hover for tooltip</Button>
          </Tooltip>
          <ToastTriggerButton />
        </div>
      </SubBlock>

      <SubBlock title="Empty state" meta="paper-feel + CTA">
        <Card>
          <CardContent className="py-8">
            <EmptyState
              illustration={<Sparkles size={48} aria-hidden />}
              title="No insights yet"
              description="Connect a broker to start receiving Provedo's daily insights."
              primaryAction={<Button variant="primary">Connect broker</Button>}
            />
          </CardContent>
        </Card>
      </SubBlock>

      <SubBlock title="Phase γ additions" meta="placeholder">
        <div
          className="showcase-demo-card"
          style={{ borderLeft: '3px solid var(--text-3)', paddingLeft: 16 }}
        >
          <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.55 }}>
            DSM-V1 Phase γ adds{' '}
            <strong>Switch · Checkbox · Radio · Breadcrumb · StatusDot · Topbar · Citation</strong>{' '}
            primitives. Demos land alongside each component as the phase ships. See{' '}
            <code className="font-mono text-[12px]">docs/design/PROVEDO_DESIGN_SYSTEM_v1.md</code>{' '}
            §primitives for the full inventory.
          </p>
        </div>
      </SubBlock>
    </Section>
  );
}

function ToastTriggerButton() {
  const { toast } = useToast();
  return (
    <Button
      variant="secondary"
      onClick={() =>
        toast({
          title: 'Saved',
          description: 'Filter preset stored to your workspace.',
          tone: 'positive',
        })
      }
    >
      Trigger toast
    </Button>
  );
}
