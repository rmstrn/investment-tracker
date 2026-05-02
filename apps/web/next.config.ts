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
  env: {
    APP_URL: process.env.APP_URL ?? 'http://localhost:3000',
    API_URL: process.env.API_URL ?? 'http://localhost:8080',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080',
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
