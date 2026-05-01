'use client';

/**
 * `/design-system-ekmas` — comparison render for `ekmas/neobrutalism-components`.
 *
 * Pair: `/design-system-retro` (RetroUI) shows the same content with the same
 * copy + structure but library swapped — so PO can pick by visual feel.
 *
 * Out of scope: tests (disposable comparison page), feature parity with the
 * canonical `/design-system` route, mascot subsystem, copy variations.
 */

import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';
import { useState } from 'react';
import { Badge } from './_lib/badge';
import { Button } from './_lib/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './_lib/card';
import { Checkbox } from './_lib/checkbox';
import { Input } from './_lib/input';
import { Label } from './_lib/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './_lib/select';
import { Switch } from './_lib/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './_lib/tabs';
import { Textarea } from './_lib/textarea';

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

export default function DesignSystemEkmasPage() {
  const [toastNote, setToastNote] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── Sticky black header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b-2 border-border bg-foreground text-background">
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
        className="relative border-b-2 border-border"
        style={{ backgroundColor: '#F7A1C9' }}
      >
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="mb-8 text-xs font-mono uppercase tracking-[0.2em] text-foreground/70">
            ekmas/neobrutalism-components · provedo render
          </p>
          <h1 className="ekmas-display max-w-4xl text-7xl text-foreground md:text-9xl">
            notice what you&apos;d miss.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-foreground/80 md:text-xl">
            we read every account in your name. weekly. one feed. the dividend before it lands, the
            drawdown before it deepens.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button size="lg">connect.</Button>
            <Button size="lg" variant="neutral">
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
          <h2 className="ekmas-display mb-12 text-5xl">primitives.</h2>

          {/* Buttons */}
          <div className="mb-12 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/60">
              buttons
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button>default</Button>
              <Button variant="neutral">neutral</Button>
              <Button variant="reverse">reverse</Button>
              <Button variant="noShadow">no shadow</Button>
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">portfolio</CardTitle>
                  <CardDescription>aggregate balance across your linked accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">$184,201</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-foreground/60">
                    +2.4% week
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="neutral">
                    view holdings
                  </Button>
                </CardFooter>
              </Card>
              <Card style={{ backgroundColor: '#F4CC4A' }}>
                <CardHeader>
                  <CardTitle className="text-2xl">insight</CardTitle>
                  <CardDescription>your drift exceeds rebalance band by 3.1pp.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge>action needed</Badge>
                </CardContent>
                <CardFooter>
                  <Button size="sm">rebalance.</Button>
                </CardFooter>
              </Card>
              <Card style={{ backgroundColor: '#0A0A0F', color: '#FFFFFF' }}>
                <CardHeader>
                  <CardTitle className="text-2xl">stamp</CardTitle>
                  <CardDescription className="text-white/70">
                    the math is real, and so is the shadow.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-xs uppercase tracking-wider text-white/60">
                    ink-card variant
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="reverse">
                    learn more
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Forms */}
          <div className="mb-12 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/60">
              forms
            </h3>
            <Card>
              <CardContent className="grid gap-6 pt-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ekmas-email">email</Label>
                  <Input id="ekmas-email" placeholder="rey@provedo.app" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ekmas-account">account type</Label>
                  <Select>
                    <SelectTrigger id="ekmas-account">
                      <SelectValue placeholder="choose..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brokerage">brokerage</SelectItem>
                      <SelectItem value="ira">ira</SelectItem>
                      <SelectItem value="401k">401(k)</SelectItem>
                      <SelectItem value="hsa">hsa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="ekmas-note">note</Label>
                  <Textarea
                    id="ekmas-note"
                    placeholder="anything we should know about this account?"
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="ekmas-terms" />
                  <Label htmlFor="ekmas-terms" className="cursor-pointer">
                    i&apos;ve read the disclaimer.
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="ekmas-weekly" defaultChecked />
                  <Label htmlFor="ekmas-weekly" className="cursor-pointer">
                    weekly summary email
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs + badge + toast */}
          <div className="mb-12 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/60">
              tabs · badge · toast
            </h3>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">overview</TabsTrigger>
                <TabsTrigger value="holdings">holdings</TabsTrigger>
                <TabsTrigger value="activity">activity</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <Card>
                  <CardContent className="flex flex-wrap items-center gap-3 pt-6">
                    <Badge>success</Badge>
                    <Badge variant="neutral">neutral</Badge>
                    <span className="text-sm text-foreground/70">
                      five accounts synced two minutes ago.
                    </span>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="holdings">
                <Card>
                  <CardContent className="pt-6 text-sm">
                    holdings tab — placeholder for the comparison render.
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="activity">
                <Card>
                  <CardContent className="pt-6 text-sm">
                    activity tab — placeholder for the comparison render.
                  </CardContent>
                </Card>
              </TabsContent>
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
                <div className="rounded-base border-2 border-border bg-background px-4 py-2 text-sm shadow-shadow">
                  <span className="mr-3 inline-block h-2 w-6 align-middle bg-main" />
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
          <h2 className="ekmas-display mb-12 text-5xl">palette.</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {COLOR_BLOCKS.map((block) => (
              <div
                key={block.hex}
                className="border-2 border-border shadow-shadow"
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

        {/* ─── 4. Chart sample (visx-candy stays on visx) ──────────────── */}
        <section id="charts" className="mb-24">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-foreground/60">
            charts (visx-candy stays)
          </p>
          <h2 className="ekmas-display mb-12 text-5xl">drift band.</h2>
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="text-xl">allocation drift · target ±2pp</CardTitle>
              <CardDescription>visx-candy bar chart inside an ekmas card frame.</CardDescription>
            </CardHeader>
            <CardContent>
              <BarVisx payload={BAR_DRIFT_FIXTURE} height={260} />
            </CardContent>
          </Card>
        </section>
      </main>

      {/* ─── 5. Footer band ────────────────────────────────────────────── */}
      <footer className="border-t-2 border-border bg-secondary-background">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-foreground/70">
            library: ekmas/neobrutalism-components · radix + tailwind 4
          </p>
        </div>
      </footer>
    </div>
  );
}
