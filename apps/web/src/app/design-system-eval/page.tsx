/**
 * `/design-system-eval` — INTERNAL EVALUATION ROUTE (NOT PRODUCTION).
 *
 * Sandbox for amCharts 5 community-version evaluation. Renders three sample
 * charts (semi-circle pie, donut, line) styled with Provedo design tokens,
 * for side-by-side visual comparison against the canonical `/design-system`
 * showcase (which uses Recharts).
 *
 * Decision-pending — see `docs/reviews/2026-04-29-amcharts-evaluation.md`.
 *
 * @internal Evaluation only. amCharts community license is «linkware» —
 *   commercial production use is permitted ONLY if the amCharts branding
 *   link is preserved on every rendered chart. Removing the branding link
 *   requires a paid commercial license. This route is gated behind
 *   `noindex`/`nofollow` and not linked from any marketing or product
 *   surface.
 */
import { brand } from '@investment-tracker/design-tokens/brand';
import { AmchartsEvalSurface } from './AmchartsEvalSurface';

export const metadata = {
  title: `amCharts 5 evaluation · ${brand.productName}`,
  description: 'Internal sandbox — amCharts 5 community vs Provedo tokens.',
  robots: { index: false, follow: false },
};

export default function AmchartsEvalPage() {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary" data-theme="light">
      <header className="mx-auto max-w-6xl px-6 py-10 md:px-8">
        <p
          className="font-mono text-xs uppercase"
          style={{
            letterSpacing: '0.18em',
            color: 'var(--accent, var(--color-accent-default))',
          }}
        >
          {brand.productName} · INTERNAL EVALUATION · NOT PRODUCTION
        </p>
        <h1
          className="mt-3 font-semibold text-text-primary"
          style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.02em' }}
        >
          amCharts 5 community — Provedo token harness
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-text-secondary" style={{ lineHeight: 1.55 }}>
          Three sample charts rendered with{' '}
          <code style={{ fontFamily: 'var(--font-mono)' }}>@amcharts/amcharts5</code>, themed
          against Provedo&nbsp;CSS&nbsp;custom&nbsp;properties (`--chart-series-1..7`, `--card`,
          `--text-primary`, Geist + Geist Mono). Compare visual feel to the Recharts versions on{' '}
          <a className="underline" href="/design-system">
            /design-system
          </a>
          . Watermark behavior of the community build is documented in
          `docs/reviews/2026-04-29-amcharts-evaluation.md`.
        </p>
        <p className="mt-2 max-w-3xl text-xs text-text-secondary">
          License note — community version is FREE under «linkware» terms (commercial use allowed if
          the amCharts branding link stays visible). Removing the branding link requires a paid
          commercial license (Standard ~$190/yr per developer). This page is a pre-production audit.
        </p>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 md:px-8">
        <AmchartsEvalSurface />
      </main>
    </div>
  );
}
