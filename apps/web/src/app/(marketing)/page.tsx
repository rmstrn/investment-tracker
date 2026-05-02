import { Button, Card, CardDescription, CardTitle } from '@investment-tracker/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import { RedirectIfAuthed } from './_components/RedirectIfAuthed';

export const metadata: Metadata = {
  title: 'Provedo — AI-native portfolio tracker',
  description:
    'AI-native portfolio tracker. Instead of charts and spreadsheets, have a conversation with your investments.',
  alternates: { canonical: '/' },
};

// Static generation — the landing renders identical HTML for every
// visitor; authed users get a client-side redirect via <RedirectIfAuthed/>.
// Trades a brief flash for sub-100ms FCP + SEO on the dominant anonymous
// audience.
export const dynamic = 'force-static';

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
      <RedirectIfAuthed />
      <div className="space-y-20 md:space-y-28">
        <Hero />
        <ThreePillars />
        <TrustStrip />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="flex flex-col items-center text-center">
      <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-text-primary md:text-5xl md:leading-tight">
        What you actually own. Why it moved. What to do next.
      </h1>
      <p className="mt-6 max-w-2xl text-base text-text-secondary md:text-lg">
        AI-native portfolio tracker. Instead of charts and spreadsheets, have a conversation with
        your investments.
      </p>
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link href="/sign-up">
          <Button size="lg">Get started — free</Button>
        </Link>
        <Link
          href="/pricing"
          className="text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          See pricing →
        </Link>
      </div>
    </section>
  );
}

const PILLARS: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: 'Connect any broker',
    body: 'Link your brokerage and crypto exchange accounts in read-only mode. One view across currencies, asset classes, and providers.',
  },
  {
    title: 'AI-explained moves',
    body: 'Ask why your portfolio moved, what changed this week, or what-if scenarios — in plain language, with the data behind the answer.',
  },
  {
    title: 'Honest insights, no churn',
    body: 'Proactive notices when something matters. No gamification, no fake urgency, no hidden upsells — just signal.',
  },
];

function ThreePillars() {
  return (
    <section aria-labelledby="pillars-heading">
      <h2 id="pillars-heading" className="sr-only">
        Product pillars
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {PILLARS.map((p) => (
          <Card key={p.title} variant="default" className="h-full">
            <CardTitle className="text-xl">{p.title}</CardTitle>
            <CardDescription className="mt-2">{p.body}</CardDescription>
          </Card>
        ))}
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="rounded-lg border border-border-subtle bg-background-secondary px-6 py-8 text-center">
      <p className="text-sm text-text-secondary md:text-base">
        <span className="font-medium text-text-primary">Read-only by design.</span> We never place
        trades or move funds — our access is physically limited to reading your positions.
      </p>
    </section>
  );
}
