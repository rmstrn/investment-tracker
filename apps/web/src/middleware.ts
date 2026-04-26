import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublic = createRouteMatcher([
  '/',
  '/pricing',
  '/design(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/disclosures',
  '/api/early-access',
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
