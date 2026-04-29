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
  async rewrites() {
    return [
      // Preserve the legacy `/design-system.html` URL that PO has shared
      // during design rounds. Real route lives at `/design-system`.
      { source: '/design-system.html', destination: '/design-system' },
    ];
  },
  async redirects() {
    return [
      // Old Next.js showcase route → consolidated `/design-system`.
      { source: '/design', destination: '/design-system', permanent: true },
      { source: '/design/:path*', destination: '/design-system/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
