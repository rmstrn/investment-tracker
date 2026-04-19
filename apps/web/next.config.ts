import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Enables reading source maps in Sentry
  productionBrowserSourceMaps: true,
  experimental: {
    // React 19 compiler — opt in once stable libs catch up
    // reactCompiler: true,
    typedRoutes: true,
  },
  env: {
    APP_URL: process.env.APP_URL ?? 'http://localhost:3000',
    API_URL: process.env.API_URL ?? 'http://localhost:8080',
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
};

export default nextConfig;
