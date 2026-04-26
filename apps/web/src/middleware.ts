import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Wave 2.6 a11y CRIT-1: `/disclosures` MUST be reachable without auth.
// The 3-layer disclaimer pattern (Wave 2.5) places an always-visible footer
// link to /disclosures so regulators / lawyers / crawlers / prospects can
// reach the verbatim regulator-readable text without operating any toggle
// AND without authenticating. noindex remains, but anonymous access is
// required by the legal-advisor sign-off on the 3-layer pattern.
const isPublic = createRouteMatcher([
  '/',
  '/pricing',
  '/disclosures',
  '/design(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
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
