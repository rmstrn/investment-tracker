'use client';

/**
 * `/design-system-retro` — comparison render for `Logging-Studio/RetroUI` AS-IS.
 *
 * NO Provedo branding. NO Provedo palette. NO Provedo typography overrides.
 * Components installed verbatim via the official shadcn CLI from the RetroUI
 * registry (`https://retroui.dev/r/<name>.json`). The route paints with the
 * library's own out-of-the-box theme so PO can fairly evaluate defaults.
 *
 * Pair: `/design-system-ekmas` (ekmas/neobrutalism-components). Loser is
 * deleted post-decision.
 */

import { Accordion } from '@/components/retroui/Accordion';
import { Alert } from '@/components/retroui/Alert';
import { Avatar } from '@/components/retroui/Avatar';
import { Badge } from '@/components/retroui/Badge';
import { Breadcrumb } from '@/components/retroui/Breadcrumb';
import { Button } from '@/components/retroui/Button';
import { Card } from '@/components/retroui/Card';
import { Checkbox } from '@/components/retroui/Checkbox';
import { Dialog } from '@/components/retroui/Dialog';
import { Input } from '@/components/retroui/Input';
import { Label } from '@/components/retroui/Label';
import { Loader } from '@/components/retroui/Loader';
import { Menu } from '@/components/retroui/Menu';
import { Popover } from '@/components/retroui/Popover';
import { Progress } from '@/components/retroui/Progress';
import { Select } from '@/components/retroui/Select';
import { Slider } from '@/components/retroui/Slider';
import { Switch } from '@/components/retroui/Switch';
import { Tabs, TabsContent, TabsTrigger, TabsTriggerList } from '@/components/retroui/Tab';
import { Text } from '@/components/retroui/Text';
import { Textarea } from '@/components/retroui/Textarea';
import { Tooltip } from '@/components/retroui/Tooltip';
import { AreaChart } from '@/components/retroui/charts/AreaChart';
import { BarChart } from '@/components/retroui/charts/BarChart';
import { LineChart } from '@/components/retroui/charts/LineChart';
import { PieChart } from '@/components/retroui/charts/PieChart';

interface PaletteSwatch {
  readonly token: string;
  readonly value: string;
  readonly label: string;
}

/** Provedo palette mapped to RetroUI semantic tokens — see `_lib/theme.css`. */
const RETROUI_PALETTE: readonly PaletteSwatch[] = [
  { token: '--background', value: '#F6F1E8', label: 'background · paper-cream' },
  { token: '--foreground', value: '#1C1B26', label: 'foreground · ink-deep' },
  { token: '--primary', value: '#F08A3C', label: 'primary · signal-orange' },
  { token: '--primary-hover', value: '#C4622E', label: 'primary-hover · orange-deep' },
  { token: '--secondary', value: '#1C1B26', label: 'secondary · ink-deep' },
  { token: '--card', value: '#F4F0E4', label: 'card · cream-on-ink' },
  { token: '--accent', value: '#F4CC4A', label: 'accent · candy-mustard' },
  { token: '--destructive', value: '#C4622E', label: 'destructive · orange-deep' },
  { token: '--border', value: '#1C1B26', label: 'border · ink-deep' },
  { token: '--chart-2', value: '#F7A1C9', label: 'chart · candy-pink' },
  { token: '--chart-4', value: '#88E26C', label: 'chart · signature-green' },
];

const BAR_DATA = [
  { month: 'Jan', sales: 120, profit: 80 },
  { month: 'Feb', sales: 150, profit: 100 },
  { month: 'Mar', sales: 100, profit: 60 },
  { month: 'Apr', sales: 180, profit: 130 },
  { month: 'May', sales: 220, profit: 160 },
  { month: 'Jun', sales: 200, profit: 140 },
];

const LINE_DATA = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 273, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 314, mobile: 240 },
];

const AREA_DATA = LINE_DATA;

const PIE_DATA = [
  { name: 'Stocks', value: 400 },
  { name: 'Bonds', value: 300 },
  { name: 'Crypto', value: 200 },
  { name: 'Cash', value: 100 },
];

export default function DesignSystemRetroPage() {
  return (
    <Tooltip.Provider>
      <div className="min-h-screen bg-background text-foreground">
        {/* ─── Library meta-strip ────────────────────────────────────── */}
        <div className="border-b-2 border-border">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-2 font-mono text-[11px] uppercase tracking-[0.18em]">
            <span>library · Logging-Studio/RetroUI · provedo palette</span>
            <span>22 components · 4 charts · wraps recharts</span>
            <a
              href="https://github.com/Logging-Studio/RetroUI"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-2 underline-offset-2"
            >
              github →
            </a>
          </div>
        </div>

        {/* ─── 1. Hero — Provedo candy-pink loud surface ─────────────── */}
        <section
          className="relative border-b-2 border-border"
          style={{ backgroundColor: '#F7A1C9', color: '#1C1B26' }}
        >
          <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
            <p className="mb-8 text-xs font-mono uppercase tracking-[0.2em]">
              retroui · with provedo palette
            </p>
            <h1 className="font-head max-w-4xl text-7xl md:text-9xl">RetroUI.</h1>
            <p className="mt-8 max-w-2xl text-lg md:text-xl">
              RetroUI components painted with Provedo&apos;s palette via the library&apos;s
              documented `:root` / `@theme inline` mechanism. Candy-pink hero, signal-orange
              primary, paper-cream surfaces, ink-deep borders.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button size="lg">Default</Button>
              <Button size="lg" variant="secondary">
                Secondary
              </Button>
              <Button size="lg" variant="outline">
                Outline
              </Button>
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          {/* ─── 2. Form components ───────────────────────────────────── */}
          <section className="mb-24">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em]">
              form · 9 components
            </p>
            <Text as="h2" className="mb-12 text-5xl font-head">
              Form
            </Text>
            <div className="space-y-12">
              {/* Buttons full variants */}
              <div className="space-y-4">
                <Text as="h3" className="text-xl font-head">
                  Button — 5 variants × 4 sizes
                </Text>
                <div className="flex flex-wrap items-center gap-4">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button disabled>Disabled</Button>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button>Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon" aria-label="icon button">
                    ★
                  </Button>
                </div>
              </div>

              {/* Input + Textarea + Label */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="r-name">Name</Label>
                  <Input id="r-name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-email">Email</Label>
                  <Input id="r-email" type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="r-bio">Bio</Label>
                  <Textarea id="r-bio" rows={3} placeholder="A few words about yourself..." />
                </div>
              </div>

              {/* Select + Switch + Checkbox */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="r-fruit">Choose a fruit</Label>
                  <Select>
                    <Select.Trigger id="r-fruit">
                      <Select.Value placeholder="Select..." />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="apple">Apple</Select.Item>
                      <Select.Item value="banana">Banana</Select.Item>
                      <Select.Item value="cherry">Cherry</Select.Item>
                      <Select.Item value="date">Date</Select.Item>
                    </Select.Content>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="r-airplane" defaultChecked />
                  <Label htmlFor="r-airplane">Airplane mode</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="r-terms" />
                  <Label htmlFor="r-terms">Accept terms</Label>
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <Label>Volume</Label>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
            </div>
          </section>

          {/* ─── 3. Surface components ────────────────────────────────── */}
          <section className="mb-24">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em]">
              surface · 4 components
            </p>
            <Text as="h2" className="mb-12 text-5xl font-head">
              Surface
            </Text>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <Card.Header>
                  <Card.Title>Card</Card.Title>
                  <Card.Description>Default card surface with chunky shadow.</Card.Description>
                </Card.Header>
                <Card.Content>
                  <p className="text-sm">
                    RetroUI cards: 2-px border, hard offset shadow, white card surface against cream
                    background.
                  </p>
                </Card.Content>
              </Card>
              <Card>
                <Card.Header>
                  <Card.Title>Avatar</Card.Title>
                  <Card.Description>3 sizes shown.</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="flex items-center gap-4">
                    <Avatar className="size-8">
                      <Avatar.Image src="https://i.pravatar.cc/64?img=11" alt="sm" />
                      <Avatar.Fallback>SM</Avatar.Fallback>
                    </Avatar>
                    <Avatar className="size-12">
                      <Avatar.Image src="https://i.pravatar.cc/64?img=12" alt="md" />
                      <Avatar.Fallback>MD</Avatar.Fallback>
                    </Avatar>
                    <Avatar className="size-16">
                      <Avatar.Image src="https://i.pravatar.cc/64?img=13" alt="lg" />
                      <Avatar.Fallback>LG</Avatar.Fallback>
                    </Avatar>
                  </div>
                </Card.Content>
              </Card>
              <Card>
                <Card.Header>
                  <Card.Title>Badge</Card.Title>
                  <Card.Description>Variants shown.</Card.Description>
                </Card.Header>
                <Card.Content className="flex flex-wrap gap-2">
                  <Badge>default</Badge>
                  <Badge variant="solid">solid</Badge>
                  <Badge variant="outline">outline</Badge>
                  <Badge variant="surface">surface</Badge>
                </Card.Content>
              </Card>
            </div>
          </section>

          {/* ─── 4. Overlay + Feedback ────────────────────────────────── */}
          <section className="mb-24">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em]">
              overlay + feedback · 7 components
            </p>
            <Text as="h2" className="mb-12 text-5xl font-head">
              Overlay
            </Text>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Dialog */}
              <Card>
                <Card.Header>
                  <Card.Title>Dialog</Card.Title>
                </Card.Header>
                <Card.Content>
                  <Dialog>
                    <Dialog.Trigger asChild>
                      <Button>Open dialog</Button>
                    </Dialog.Trigger>
                    <Dialog.Content>
                      <Dialog.Header>Confirm action</Dialog.Header>
                      <Dialog.Description>
                        This is RetroUI&apos;s native modal dialog.
                      </Dialog.Description>
                    </Dialog.Content>
                  </Dialog>
                </Card.Content>
              </Card>

              {/* Tooltip */}
              <Card>
                <Card.Header>
                  <Card.Title>Tooltip</Card.Title>
                </Card.Header>
                <Card.Content>
                  <Tooltip>
                    <Tooltip.Trigger asChild>
                      <Button variant="outline">Hover me</Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>RetroUI tooltip</Tooltip.Content>
                  </Tooltip>
                </Card.Content>
              </Card>

              {/* Popover */}
              <Card>
                <Card.Header>
                  <Card.Title>Popover</Card.Title>
                </Card.Header>
                <Card.Content>
                  <Popover>
                    <Popover.Trigger asChild>
                      <Button variant="outline">Open popover</Button>
                    </Popover.Trigger>
                    <Popover.Content>
                      <p className="text-sm">Popover content with chunky border.</p>
                    </Popover.Content>
                  </Popover>
                </Card.Content>
              </Card>

              {/* Menu */}
              <Card>
                <Card.Header>
                  <Card.Title>Menu</Card.Title>
                </Card.Header>
                <Card.Content>
                  <Menu>
                    <Menu.Trigger asChild>
                      <Button variant="outline">Open menu</Button>
                    </Menu.Trigger>
                    <Menu.Content>
                      <Menu.Item>Profile</Menu.Item>
                      <Menu.Item>Settings</Menu.Item>
                      <Menu.Item>Sign out</Menu.Item>
                    </Menu.Content>
                  </Menu>
                </Card.Content>
              </Card>

              {/* Alert */}
              <Card>
                <Card.Header>
                  <Card.Title>Alert</Card.Title>
                </Card.Header>
                <Card.Content>
                  <Alert>
                    <Alert.Title>Heads up!</Alert.Title>
                    <Alert.Description>
                      This is a RetroUI alert with default styling.
                    </Alert.Description>
                  </Alert>
                </Card.Content>
              </Card>

              {/* Loader + Progress */}
              <Card>
                <Card.Header>
                  <Card.Title>Loader · Progress</Card.Title>
                </Card.Header>
                <Card.Content className="space-y-4">
                  <Loader />
                  <Progress value={67} />
                </Card.Content>
              </Card>
            </div>
          </section>

          {/* ─── 5. Navigation ─────────────────────────────────────────── */}
          <section className="mb-24">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em]">
              navigation · 3 components
            </p>
            <Text as="h2" className="mb-12 text-5xl font-head">
              Navigation
            </Text>

            <div className="space-y-8">
              <Card>
                <Card.Header>
                  <Card.Title>Tabs</Card.Title>
                </Card.Header>
                <Card.Content>
                  <Tabs>
                    <TabsTriggerList>
                      <TabsTrigger>Overview</TabsTrigger>
                      <TabsTrigger>Holdings</TabsTrigger>
                      <TabsTrigger>Activity</TabsTrigger>
                    </TabsTriggerList>
                    <TabsContent>Overview content lives in panel one.</TabsContent>
                    <TabsContent>Holdings content lives in panel two.</TabsContent>
                    <TabsContent>Activity content lives in panel three.</TabsContent>
                  </Tabs>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Breadcrumb</Card.Title>
                </Card.Header>
                <Card.Content>
                  <Breadcrumb>
                    <Breadcrumb.List>
                      <Breadcrumb.Item>
                        <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Separator />
                      <Breadcrumb.Item>
                        <Breadcrumb.Link href="#">Components</Breadcrumb.Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Separator />
                      <Breadcrumb.Item>
                        <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
                      </Breadcrumb.Item>
                    </Breadcrumb.List>
                  </Breadcrumb>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Accordion</Card.Title>
                </Card.Header>
                <Card.Content>
                  <Accordion type="single" collapsible>
                    <Accordion.Item value="a">
                      <Accordion.Header>What is RetroUI?</Accordion.Header>
                      <Accordion.Content>
                        A retro-styled neo-brutalism component library based on Tailwind v4.
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item value="b">
                      <Accordion.Header>Is it free?</Accordion.Header>
                      <Accordion.Content>Yes, MIT licensed.</Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                </Card.Content>
              </Card>
            </div>
          </section>

          {/* ─── 6. Native charts (4) ──────────────────────────────────── */}
          <section className="mb-24">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em]">
              data · 4 native chart components (recharts wrappers)
            </p>
            <Text as="h2" className="mb-12 text-5xl font-head">
              Charts
            </Text>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <Card.Header>
                  <Card.Title>Bar Chart</Card.Title>
                  <Card.Description>Sales · profit by month</Card.Description>
                </Card.Header>
                <Card.Content>
                  <BarChart data={BAR_DATA} index="month" categories={['sales', 'profit']} />
                </Card.Content>
              </Card>
              <Card>
                <Card.Header>
                  <Card.Title>Line Chart</Card.Title>
                  <Card.Description>Desktop · mobile traffic</Card.Description>
                </Card.Header>
                <Card.Content>
                  <LineChart data={LINE_DATA} index="month" categories={['desktop', 'mobile']} />
                </Card.Content>
              </Card>
              <Card>
                <Card.Header>
                  <Card.Title>Area Chart</Card.Title>
                  <Card.Description>Gradient fill default</Card.Description>
                </Card.Header>
                <Card.Content>
                  <AreaChart data={AREA_DATA} index="month" categories={['desktop', 'mobile']} />
                </Card.Content>
              </Card>
              <Card>
                <Card.Header>
                  <Card.Title>Pie Chart</Card.Title>
                  <Card.Description>Asset allocation</Card.Description>
                </Card.Header>
                <Card.Content>
                  <PieChart data={PIE_DATA} dataKey="value" nameKey="name" />
                </Card.Content>
              </Card>
            </div>
          </section>

          {/* ─── 7. Provedo palette mapped onto RetroUI tokens ─────────── */}
          <section className="mb-24">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em]">
              palette · provedo → retroui tokens
            </p>
            <Text as="h2" className="mb-12 text-5xl font-head">
              Palette
            </Text>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {RETROUI_PALETTE.map((swatch) => (
                <div
                  key={swatch.token}
                  className="border-2 border-border shadow-md"
                  style={{
                    backgroundColor: swatch.value,
                    color:
                      swatch.value === '#1C1B26' || swatch.value === '#C4622E'
                        ? '#F4F0E4'
                        : '#1C1B26',
                    padding: '32px 16px',
                    minHeight: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-80">
                    {swatch.label}
                  </span>
                  <div>
                    <div className="font-mono text-xs opacity-70">{swatch.token}</div>
                    <div className="font-mono text-sm font-semibold">{swatch.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* ─── Footer band ────────────────────────────────────────────── */}
        <footer className="border-t-2 border-border">
          <div className="mx-auto max-w-7xl px-6 py-8 font-mono text-xs uppercase tracking-[0.25em]">
            <p>
              install:{' '}
              <code>
                pnpm dlx shadcn@latest add &apos;https://retroui.dev/r/&lt;name&gt;.json&apos;
              </code>
            </p>
            <p className="mt-1">
              github:{' '}
              <a className="underline" href="https://github.com/Logging-Studio/RetroUI">
                Logging-Studio/RetroUI
              </a>{' '}
              · license: MIT · charts wrap{' '}
              <a className="underline" href="https://recharts.org">
                recharts
              </a>
            </p>
          </div>
        </footer>
      </div>
    </Tooltip.Provider>
  );
}
