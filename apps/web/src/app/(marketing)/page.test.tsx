import { render, screen } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';

// `<RedirectIfAuthed/>` mounts a Clerk `useUser` hook + `useRouter` —
// both client-only. Mocking the component to a no-op keeps the static
// page test from pulling in Clerk + Next router runtime.
vi.mock('./_components/RedirectIfAuthed', () => ({
  RedirectIfAuthed: () => null,
}));

import LandingPage from './page';

describe('LandingPage (static)', () => {
  it('renders hero + CTAs without an auth probe', () => {
    const element = LandingPage();
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
  });
});
