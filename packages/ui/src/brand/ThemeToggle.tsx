'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../primitives/Button';

/**
 * Lightweight theme toggle. Flips `.dark` on <html>. Persists to
 * localStorage so reloads remember. Apps that want SSR-correct theming
 * should replace this with a provider that reads cookies — this is good
 * enough for the /design preview page.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('portfolio-theme');
    const initial =
      stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDark(initial);
    document.documentElement.classList.toggle('dark', initial);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    window.localStorage.setItem('portfolio-theme', next ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
      <span>{dark ? 'Light' : 'Dark'}</span>
    </Button>
  );
}
