import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const auth = vi.hoisted(() => vi.fn());
const redirect = vi.hoisted(() =>
  vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
);

vi.mock('@clerk/nextjs/server', () => ({ auth }));
vi.mock('next/navigation', () => ({ redirect }));

import LandingPage from './page';

describe('LandingPage', () => {
  beforeEach(() => {
    auth.mockReset();
    redirect.mockClear();
  });

  it('redirects authenticated users to /dashboard', async () => {
    auth.mockResolvedValue({ userId: 'user_abc' });
    await expect(LandingPage()).rejects.toThrow('NEXT_REDIRECT:/dashboard');
    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });

  it('renders hero + CTAs for anonymous users', async () => {
    auth.mockResolvedValue({ userId: null });
    const element = await LandingPage();
    render(element as React.ReactElement);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /what you actually own\. why it moved\. what to do next\./i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /get started — free/i })).toHaveAttribute(
      'href',
      '/sign-up',
    );
    expect(screen.getByRole('link', { name: /see pricing/i })).toHaveAttribute('href', '/pricing');
    expect(redirect).not.toHaveBeenCalled();
  });
});
