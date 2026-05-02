'use client';

/**
 * `/design-system-ekmas` — comparison render for `ekmas/neobrutalism-components`
 * AS-IS.
 *
 * NO Provedo branding. NO Provedo palette. NO Provedo typography overrides.
 * Components installed verbatim via the official shadcn CLI from the ekmas
 * registry (`https://www.neobrutalism.dev/r/<name>.json`). The route paints
 * with the library's own out-of-the-box theme so PO can fairly evaluate
 * defaults against `/design-system-retro`.
 *
 * Loser is deleted post-decision.
 */

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PaletteSwatch {
  readonly token: string;
  readonly value: string;
  readonly label: string;
}

/** Provedo palette mapped to ekmas semantic tokens — see `_lib/theme.css`. */
const EKMAS_PALETTE: readonly PaletteSwatch[] = [
  { token: '--background', value: '#F6F1E8', label: 'background · paper-cream' },
  { token: '--secondary-background', value: '#F4F0E4', label: 'secondary-bg · cream-on-ink' },
  { token: '--main', value: '#F08A3C', label: 'main · signal-orange' },
  { token: '--foreground', value: '#1C1B26', label: 'foreground · ink-deep' },
  { token: '--main-foreground', value: '#1C1B26', label: 'main-fg · ink-deep' },
  { token: '--border', value: '#1C1B26', label: 'border · ink-deep' },
  { token: '--chart-2', value: '#F7A1C9', label: 'chart-2 · candy-pink' },
  { token: '--chart-3', value: '#F4CC4A', label: 'chart-3 · candy-mustard' },
  { token: '--chart-4', value: '#88E26C', label: 'chart-4 · signature-green' },
  { token: '--chart-5', value: '#C4622E', label: 'chart-5 · orange-deep' },
];

const CHART_DATA = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 273, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 314, mobile: 240 },
];

const CHART_CONFIG: ChartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
};

export default function DesignSystemEkmasPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── Library meta-strip ────────────────────────────────────── */}
      <div className="border-b-2 border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-2 font-mono text-[11px] uppercase tracking-[0.18em]">
          <span>library · ekmas/neobrutalism-components · provedo palette</span>
          <span>24 components · chart wraps recharts</span>
          <a
            href="https://github.com/ekmas/neobrutalism-components"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-2 underline-offset-2"
          >
            github →
          </a>
        </div>
      </div>

      {/* ─── 1. Hero — Provedo candy-mustard loud surface ──────────── */}
      <section
        className="relative border-b-2 border-border"
        style={{ backgroundColor: '#F4CC4A', color: '#1C1B26' }}
      >
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="mb-8 text-xs font-mono uppercase tracking-[0.2em]">
            ekmas · with provedo palette
          </p>
          <h1 className="font-heading max-w-4xl text-7xl md:text-9xl">Neobrutalism.</h1>
          <p className="mt-8 max-w-2xl text-lg md:text-xl font-base">
            ekmas components painted with Provedo&apos;s palette via the library&apos;s documented
            `:root` / `@theme inline` mechanism. Candy-mustard hero, signal-orange `--main`,
            paper-cream surfaces, ink-deep borders.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button size="lg">Default</Button>
            <Button size="lg" variant="neutral">
              Neutral
            </Button>
            <Button size="lg" variant="reverse">
              Reverse
            </Button>
            <Button size="lg" variant="noShadow">
              No shadow
            </Button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        {/* ─── 2. Form components ───────────────────────────────────── */}
        <section className="mb-24">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em]">form · 9 components</p>
          <h2 className="mb-12 text-5xl font-heading">Form</h2>

          <div className="space-y-12">
            {/* Buttons full variants */}
            <div className="space-y-4">
              <h3 className="text-xl font-heading">Button — 4 variants × 4 sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button>Default</Button>
                <Button variant="neutral">Neutral</Button>
                <Button variant="reverse">Reverse</Button>
                <Button variant="noShadow">No shadow</Button>
                <Button disabled>Disabled</Button>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" aria-label="icon button">
                  ★
                </Button>
              </div>
            </div>

            {/* Input + Textarea + Label */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="e-name">Name</Label>
                <Input id="e-name" placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="e-email">Email</Label>
                <Input id="e-email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="e-bio">Bio</Label>
                <Textarea id="e-bio" rows={3} placeholder="A few words about yourself..." />
              </div>
            </div>

            {/* Select + Switch + Checkbox */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="e-fruit">Choose a fruit</Label>
                <Select>
                  <SelectTrigger id="e-fruit">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="cherry">Cherry</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="e-airplane" defaultChecked />
                <Label htmlFor="e-airplane">Airplane mode</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="e-terms" />
                <Label htmlFor="e-terms">Accept terms</Label>
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
          <h2 className="mb-12 text-5xl font-heading">Surface</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Card</CardTitle>
                <CardDescription>Default card surface with chunky shadow.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  ekmas cards: 2-px border, hard offset shadow on the bottom-right.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="neutral">
                  Action
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Avatar</CardTitle>
                <CardDescription>3 sizes shown.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="size-8">
                    <AvatarImage src="https://i.pravatar.cc/64?img=11" alt="sm" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <Avatar className="size-12">
                    <AvatarImage src="https://i.pravatar.cc/64?img=12" alt="md" />
                    <AvatarFallback>MD</AvatarFallback>
                  </Avatar>
                  <Avatar className="size-16">
                    <AvatarImage src="https://i.pravatar.cc/64?img=13" alt="lg" />
                    <AvatarFallback>LG</AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Badge · Skeleton</CardTitle>
                <CardDescription>Variants shown.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>default</Badge>
                  <Badge variant="neutral">neutral</Badge>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ─── 4. Overlay + Feedback ────────────────────────────────── */}
        <section className="mb-24">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em]">
            overlay + feedback · 6 components
          </p>
          <h2 className="mb-12 text-5xl font-heading">Overlay</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Dialog */}
            <Card>
              <CardHeader>
                <CardTitle>Dialog</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Open dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm action</DialogTitle>
                      <DialogDescription>
                        This is ekmas&apos;s native modal dialog.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Tooltip */}
            <Card>
              <CardHeader>
                <CardTitle>Tooltip</CardTitle>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="neutral">Hover me</Button>
                    </TooltipTrigger>
                    <TooltipContent>ekmas tooltip</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            {/* Popover */}
            <Card>
              <CardHeader>
                <CardTitle>Popover</CardTitle>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="neutral">Open popover</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <p className="text-sm">Popover content with chunky border.</p>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            {/* Dropdown */}
            <Card>
              <CardHeader>
                <CardTitle>Dropdown</CardTitle>
              </CardHeader>
              <CardContent>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="neutral">Open menu</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>

            {/* Alert */}
            <Card>
              <CardHeader>
                <CardTitle>Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription>This is an ekmas alert with default styling.</AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={67} />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ─── 5. Navigation ─────────────────────────────────────────── */}
        <section className="mb-24">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em]">
            navigation · 3 components
          </p>
          <h2 className="mb-12 text-5xl font-heading">Navigation</h2>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Tabs</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="holdings">Holdings</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">Overview content lives in panel one.</TabsContent>
                  <TabsContent value="holdings">Holdings content lives in panel two.</TabsContent>
                  <TabsContent value="activity">Activity content lives in panel three.</TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Breadcrumb</CardTitle>
              </CardHeader>
              <CardContent>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Components</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accordion</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="a">
                    <AccordionTrigger>What is neobrutalism?</AccordionTrigger>
                    <AccordionContent>
                      A neobrutalism component library based on shadcn/ui — chunky borders, hard
                      shadows, hover-translate.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="b">
                    <AccordionTrigger>Is it free?</AccordionTrigger>
                    <AccordionContent>Yes, MIT licensed.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ─── 6. Native chart ──────────────────────────────────────── */}
        <section className="mb-24">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em]">
            data · 1 native chart primitive (recharts wrapper)
          </p>
          <h2 className="mb-12 text-5xl font-heading">Charts</h2>

          <Card>
            <CardHeader>
              <CardTitle>Bar Chart — desktop · mobile</CardTitle>
              <CardDescription>
                Native ekmas Chart wrapper around recharts. Fixture: monthly visitor counts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={CHART_CONFIG}>
                <BarChart accessibilityLayer data={CHART_DATA}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>

        {/* ─── 7. Default palette ────────────────────────────────────── */}
        <section className="mb-24">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em]">
            palette · provedo → ekmas tokens
          </p>
          <h2 className="mb-12 text-5xl font-heading">Palette</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {EKMAS_PALETTE.map((swatch) => (
              <div
                key={swatch.token}
                className="border-2 border-border shadow-shadow"
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
                  <div className="font-mono text-[10px] opacity-70">{swatch.token}</div>
                  <div className="font-mono text-[11px] font-semibold">{swatch.value}</div>
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
              pnpm dlx shadcn@latest add
              &apos;https://www.neobrutalism.dev/r/&lt;name&gt;.json&apos;
            </code>
          </p>
          <p className="mt-1">
            github:{' '}
            <a className="underline" href="https://github.com/ekmas/neobrutalism-components">
              ekmas/neobrutalism-components
            </a>{' '}
            · license: MIT · chart wraps{' '}
            <a className="underline" href="https://recharts.org">
              recharts
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
