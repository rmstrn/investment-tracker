import { beforeEach, describe, expect, it, vi } from 'vitest';

const auth = vi.hoisted(() => vi.fn());
const redirect = vi.hoisted(() =>
  vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
);

vi.mock('@clerk/nextjs/server', () => ({ auth }));
vi.mock('next/navigation', () => ({ redirect }));

import HomePage from './page';

describe('HomePage (root redirect)', () => {
  beforeEach(() => {
    auth.mockReset();
    redirect.mockClear();
  });

  it('redirects authenticated users to /dashboard', async () => {
    auth.mockResolvedValue({ userId: 'user_abc' });
    await expect(HomePage()).rejects.toThrow('NEXT_REDIRECT:/dashboard');
    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });

  it('redirects guests to /sign-in', async () => {
    auth.mockResolvedValue({ userId: null });
    await expect(HomePage()).rejects.toThrow('NEXT_REDIRECT:/sign-in');
    expect(redirect).toHaveBeenCalledWith('/sign-in');
  });

  // Per kickoff § Open Q #2: auth() returns {userId: null} for public routes and
  // never throws. No try/catch fallback in page.tsx — that would mask a middleware
  // misconfig (e.g. '/' accidentally moved out of isPublic matcher).
});
