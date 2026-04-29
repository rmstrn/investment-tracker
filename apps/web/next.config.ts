import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  typedRoutes: true,
  // Allow tests to use an isolated build output directory so a Playwright
  // dev server (port 3100) doesn't collide with the developer's `pnpm dev`
  // on port 3000 over a shared `.next/` cache (Windows file locks on
  // `.next/trace`). Default unchanged in normal `pnpm dev` / `pnpm build`.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  // see packages/ui/src/charts/_shared/chart-backend-dispatch.tsx for the
  // runtime-safety layer; this env-block is belt-and-braces.
  env: {
    APP_URL: process.env.APP_URL ?? 'http://localhost:3000',
    API_URL: process.env.API_URL ?? 'http://localhost:8080',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080',
    // Chart backend canary flag — pinned at build time so Turbopack inlines
    // the SAME value into the server and client bundles. Without this, the
    // workspace package `@investment-tracker/ui/charts/index.ts` reads
    // `process.env.NEXT_PUBLIC_PROVEDO_CHART_BACKEND` at module-eval time
    // and the server vs. client bundles can resolve to different values
    // (server: `.env.local`; client: workspace boundary may not propagate),
    // causing a React hydration mismatch on `<DonutChart>` / `<Sparkline>`.
    // Reading via this `env:` block forces symmetric inlining across both
    // bundles. β.1 canary: defaults to `'recharts'` when unset.
    NEXT_PUBLIC_PROVEDO_CHART_BACKEND: process.env.NEXT_PUBLIC_PROVEDO_CHART_BACKEND ?? 'recharts',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  // Note: `/design-system.html` rewrite removed 2026-04-29 — static file at
  // `apps/web/public/design-system.html` (the polished v2 reference, 2156 lines)
  // is restored as the canonical visual target. React route at `/design-system`
  // is parallel surface (interactive playground). Two surfaces, distinct roles —
  // static = visual canon, React = interactive demo. Re-consolidation pending
  // after React showcase reaches static visual fidelity.
  async redirects() {
    return [
      // Old Next.js showcase route → consolidated `/design-system`.
      { source: '/design', destination: '/design-system', permanent: true },
      { source: '/design/:path*', destination: '/design-system/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
