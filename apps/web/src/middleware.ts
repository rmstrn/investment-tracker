import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublic = createRouteMatcher([
  '/',
  '/pricing',
  '/design(.*)',
  // Visual-direction comparison routes (`/style-a`, `/style-b`, `/style-c`).
  // PO-internal mini-landings; not indexed (route metadata sets robots:noindex).
  '/style-(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  // Next.js 15 auto-generated icon route from `app/icon.tsx`. Must be
  // public so the browser-tab favicon resolves without an auth round-trip
  // (otherwise Clerk redirects /icon → /sign-in and the browser logs a 404).
  // Exact match — Next 15 emits the single URL `/icon` for `app/icon.tsx`;
  // sub-paths aren't generated, so a greedy regex would over-expose.
  '/icon',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublic(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js|jpg|jpeg|png|svg|ico|webp|woff2?|map)$).*)',
    '/(api|trpc)(.*)',
  ],
};
