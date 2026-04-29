'use client';

import { Logo } from '@investment-tracker/ui';
import { Moon, Sun, ZapOff } from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV = [
  { id: 'foundation', label: 'Foundation' },
  { id: 'iconography', label: 'Iconography' },
  { id: 'primitives', label: 'Primitives' },
  { id: 'charts', label: 'Charts' },
  { id: 'disclaimer', label: 'Disclaimer' },
  { id: 'theme', label: 'Theme · Motion' },
] as const;

/**
 * Sticky header for `/design-system`.
 *
 * Owns two showcase-only toggles that write to `<html>`:
 *   - theme         → `documentElement.dataset.theme = 'light' | 'dark'` AND
 *                     toggles `.dark` class for primitives that key off it.
 *   - reduced motion → `documentElement.dataset.reducedMotion = 'true'` so
 *                     showcase-only CSS can suppress motion demos for users
 *                     who can't change OS-level `prefers-reduced-motion`.
 *
 * The toggles are real `<button>` elements (not Switch primitive yet —
 * Switch lands in Phase γ). Both are keyboard-accessible and announce state
 * via `aria-pressed`.
 */
export function ShowcaseHeader() {
  const [dark, setDark] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Hydrate initial theme from current `<html>` state (set by layout/SSR or
  // a previous toggle). Defaults to light if neither flag is present.
  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark') || root.dataset.theme === 'dark';
    setDark(isDark);
    setReduced(root.dataset.reducedMotion === 'true');
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    root.classList.toggle('dark', next);
    root.dataset.theme = next ? 'dark' : 'light';
  };

  const toggleReduced = () => {
    const next = !reduced;
    setReduced(next);
    const root = document.documentElement;
    if (next) {
      root.dataset.reducedMotion = 'true';
    } else {
      delete root.dataset.reducedMotion;
    }
  };

  return (
    <header
      className="sticky top-0 z-30 border-b border-border-subtle backdrop-blur"
      style={{ background: 'rgba(var(--bg-rgb, 244 241 234) / 0.86)' }}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-3">
          <Logo variant="full" size={26} />
          <span
            className="font-mono uppercase"
            style={{
              fontSize: '10px',
              letterSpacing: '0.22em',
              color: 'var(--text-3, var(--color-text-tertiary))',
            }}
          >
            Design System v1.1 · Locked
          </span>
        </div>
        <nav aria-label="Showcase sections" className="flex items-center gap-1 text-sm">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="rounded-md px-2.5 py-1.5 text-text-secondary transition-colors duration-fast hover:bg-background-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              style={{ fontSize: '13px' }}
            >
              {n.label}
            </a>
          ))}
          <span className="mx-2 h-5 w-px bg-border-subtle" aria-hidden />
          <button
            type="button"
            onClick={toggleReduced}
            aria-pressed={reduced}
            aria-label={
              reduced ? 'Disable reduced-motion override' : 'Enable reduced-motion override'
            }
            title={reduced ? 'Reduced motion ON' : 'Reduced motion OFF'}
            className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-transparent px-2.5 py-1.5 text-text-secondary transition-colors duration-fast hover:bg-background-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            data-state={reduced ? 'on' : 'off'}
            style={{ fontSize: '12px' }}
          >
            <ZapOff size={14} aria-hidden />
            <span>{reduced ? 'Motion off' : 'Motion on'}</span>
          </button>
          <button
            type="button"
            onClick={toggleDark}
            aria-pressed={dark}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-transparent px-2.5 py-1.5 text-text-secondary transition-colors duration-fast hover:bg-background-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            style={{ fontSize: '12px' }}
          >
            {dark ? <Sun size={14} aria-hidden /> : <Moon size={14} aria-hidden />}
            <span>{dark ? 'Light' : 'Dark'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
