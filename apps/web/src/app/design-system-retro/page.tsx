'use client';

/**
 * `/design-system-retro` — comparison render for `Logging-Studio/RetroUI`.
 *
 * Identical content to `/design-system-ekmas`; only the component primitives
 * change. PO picks the visual landing better.
 */

import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';
import { useState } from 'react';
import { Badge } from './_lib/Badge';
import { Button } from './_lib/Button';
import { Card } from './_lib/Card';
import { Checkbox } from './_lib/Checkbox';
import { Input } from './_lib/Input';
import { Label } from './_lib/Label';
import { Select } from './_lib/Select';
import { Switch } from './_lib/Switch';
import { Tabs } from './_lib/Tab';
import { Text } from './_lib/Text';
import { Textarea } from './_lib/Textarea';

interface ColorBlock {
  readonly name: string;
  readonly hex: string;
  readonly textOn: 'ink' | 'paper';
}

const COLOR_BLOCKS: readonly ColorBlock[] = [
  { name: 'signature.green', hex: '#88E26C', textOn: 'ink' },
  { name: 'signal.orange', hex: '#F08A3C', textOn: 'ink' },
  { name: 'candy.pink', hex: '#F7A1C9', textOn: 'ink' },
  { name: 'candy.mustard', hex: '#F4CC4A', textOn: 'ink' },
  { name: 'ink.deep', hex: '#1C1B26', textOn: 'paper' },
  { name: 'paper.cream', hex: '#F6F1E8', textOn: 'ink' },
];

export default function DesignSystemRetroPage() {
  const [toastNote, setToastNote] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── Sticky black header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b-2 border-foreground bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">Provedo</span>
          <nav className="hidden items-center gap-6 text-xs font-medium md:flex">
            <a href="#hero" className="opacity-70 hover:opacity-100">
              product
            </a>
            <a href="#components" className="opacity-70 hover:opacity-100">
              components
            </a>
            <a href="#colors" className="opacity-70 hover:opacity-100">
              colors
            </a>
            <a href="#charts" className="opacity-70 hover:opacity-100">
              charts
            </a>
          </nav>
          <button
            type="button"
            className="rounded-full border-2 border-background bg-background px-4 py-1 text-xs font-semibold text-foreground transition hover:opacity-90"
          >
            sign in
          </button>
        </div>
      </header>

      {/* ─── 1. Hero — full-width candy-pink ─────────────────────────── */}
      <section
        id="hero"
        className="relative border-b-2 border-foreground"
        style={{ backgroundColor: '#F7A1C9' }}
      >
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="mb-8 text-xs font-mono uppercase tracking-[0.2em] text-foreground/70">
            logging-studio/retroui · provedo render
          </p>
          <h1 className="retro-display max-w-4xl text-7xl text-foreground md:text-9xl">
            notice what you&apos;d miss.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-foreground/80 md:text-xl">
            we read every account in your name. weekly. one feed. the dividend before it lands, the
            drawdown before it deepens.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button size="lg">connect.</Button>
            <Button size="lg" variant="secondary">
              look around first →
            </Button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        {/* ─── 2. Components gallery ─────────────────────────────────── */}
        <section id="components" className="mb-24">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-foreground/60">
            components
          </p>
          <h2 className="retro-display mb-12 text-5xl">primitives.</h2>

          {/* Buttons */}
          <div className="mb-12 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/60">
              buttons
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button>default</Button>
              <Button variant="secondary">secondary</Button>
              <Button variant="outline">outline</Button>
              <Button variant="link">link</Button>
              <Button variant="ghost">ghost</Button>
              <Button disabled>disabled</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">small</Button>
              <Button>medium</Button>
              <Button size="lg">large</Button>
            </div>
          </div>

          {/* Cards */}
          <div className="mb-12 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/60">
              cards
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="block w-full">
                <Card.Header>
                  <Card.Title>portfolio</Card.Title>
                  <Card.Description>
                    aggregate balance across your linked accounts.
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <p className="text-3xl font-bold">$184,201</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-foreground/60">
                    +2.4% week
                  </p>
                  <div className="mt-4">
                    <Button size="sm" variant="secondary">
                      view holdings
                    </Button>
                  </div>
                </Card.Content>
              </Card>
              <Card className="block w-full" style={{ backgroundColor: '#F4CC4A' }}>
                <Card.Header>
                  <Card.Title>insight</Card.Title>
                  <Card.Description>your drift exceeds rebalance band by 3.1pp.</Card.Description>
                </Card.Header>
                <Card.Content>
                  <Badge variant="surface">action needed</Badge>
                  <div className="mt-4">
                    <Button size="sm">rebalance.</Button>
                  </div>
                </Card.Content>
              </Card>
              <Card
                className="block w-full"
                style={{ backgroundColor: '#0A0A0F', color: '#FFFFFF' }}
              >
                <Card.Header>
                  <Card.Title className="text-background">stamp</Card.Title>
                  <Card.Description className="text-background/70">
                    the math is real, and so is the shadow.
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <p className="font-mono text-xs uppercase tracking-wider text-background/60">
                    ink-card variant
                  </p>
                  <div className="mt-4">
                    <Button size="sm" variant="outline" className="text-background">
                      learn more
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>

          {/* Forms */}
          <div className="mb-12 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/60">
              forms
            </h3>
            <Card className="block w-full">
              <Card.Content>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="retro-email">email</Label>
                    <Input id="retro-email" placeholder="rey@provedo.app" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retro-account">account type</Label>
                    <Select>
                      <Select.Trigger id="retro-account">
                        <Select.Value placeholder="choose..." />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="brokerage">brokerage</Select.Item>
                        <Select.Item value="ira">ira</Select.Item>
                        <Select.Item value="401k">401(k)</Select.Item>
                        <Select.Item value="hsa">hsa</Select.Item>
                      </Select.Content>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="retro-note">note</Label>
                    <Textarea
                      id="retro-note"
                      placeholder="anything we should know about this account?"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="retro-terms" />
                    <Label htmlFor="retro-terms" className="cursor-pointer">
                      i&apos;ve read the disclaimer.
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch id="retro-weekly" defaultChecked />
                    <Label htmlFor="retro-weekly" className="cursor-pointer">
                      weekly summary email
                    </Label>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Tabs + badge + toast */}
          <div className="mb-12 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/60">
              tabs · badge · toast
            </h3>
            <Tabs defaultValue="overview">
              <Tabs.List>
                <Tabs.Trigger value="overview">overview</Tabs.Trigger>
                <Tabs.Trigger value="holdings">holdings</Tabs.Trigger>
                <Tabs.Trigger value="activity">activity</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="overview">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="surface">success</Badge>
                  <Badge variant="outline">neutral</Badge>
                  <Badge variant="solid">solid</Badge>
                  <span className="text-sm text-foreground/70">
                    five accounts synced two minutes ago.
                  </span>
                </div>
              </Tabs.Content>
              <Tabs.Content value="holdings">
                <p className="text-sm">holdings tab — placeholder for the comparison render.</p>
              </Tabs.Content>
              <Tabs.Content value="activity">
                <p className="text-sm">activity tab — placeholder for the comparison render.</p>
              </Tabs.Content>
            </Tabs>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => {
                  setToastNote(`saved at ${new Date().toLocaleTimeString()}`);
                  window.setTimeout(() => setToastNote(null), 3000);
                }}
              >
                trigger toast
              </Button>
              {toastNote ? (
                <div className="rounded border-2 border-foreground bg-background px-4 py-2 text-sm shadow-md">
                  <span className="mr-3 inline-block h-2 w-6 align-middle bg-primary" />
                  {toastNote}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* ─── 3. Color blocks strip ───────────────────────────────────── */}
        <section id="colors" className="mb-24">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-foreground/60">
            colors
          </p>
          <h2 className="retro-display mb-12 text-5xl">palette.</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {COLOR_BLOCKS.map((block) => (
              <div
                key={block.hex}
                className="rounded border-2 border-foreground shadow-md"
                style={{
                  backgroundColor: block.hex,
                  color: block.textOn === 'paper' ? '#FFFFFF' : '#0A0A0F',
                  padding: '32px 16px',
                  minHeight: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-80">
                  {block.name}
                </span>
                <span className="font-mono text-sm font-semibold">{block.hex}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 4. Chart sample ─────────────────────────────────────────── */}
        <section id="charts" className="mb-24">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-foreground/60">
            charts (visx-candy stays)
          </p>
          <h2 className="retro-display mb-12 text-5xl">drift band.</h2>
          <Card className="block w-full p-6">
            <Card.Header>
              <Card.Title>allocation drift · target ±2pp</Card.Title>
              <Card.Description>visx-candy bar chart inside a RetroUI card frame.</Card.Description>
            </Card.Header>
            <Card.Content>
              <BarVisx payload={BAR_DRIFT_FIXTURE} height={260} />
            </Card.Content>
          </Card>
        </section>

        {/* Text component sample */}
        <section className="mb-24">
          <Text as="h3" className="mb-2">
            typography sample
          </Text>
          <Text as="p" className="text-foreground/70">
            The Text primitive — h1 through h6, p, li, a — handles font scale.
          </Text>
        </section>
      </main>

      {/* ─── 5. Footer band ────────────────────────────────────────────── */}
      <footer className="border-t-2 border-foreground bg-muted">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-foreground/70">
            library: Logging-Studio/RetroUI · radix + tailwind 4
          </p>
        </div>
      </footer>
    </div>
  );
}
