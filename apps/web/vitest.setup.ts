import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Vitest `globals: false` prevents `@testing-library/react` from registering
// its built-in `afterEach(cleanup)` — without this hook rendered trees
// accumulate across `it` blocks and `getByText` hits duplicates.
afterEach(() => {
  cleanup();
});

// ── Browser API shims for happy-dom test environment ─────────────────────────

// matchMedia — happy-dom provides a stub that always returns matches=false.
// We override it so `prefers-reduced-motion: reduce` returns true; this
// makes animated components render their final state synchronously and
// keeps tests deterministic without timer mocking.
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: typeof query === 'string' && query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

// IntersectionObserver — happy-dom does not implement it. The Provedo
// landing uses useInView for scroll-triggered animations; under reduced
// motion (forced above) the section renders its final state regardless.
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class StubIntersectionObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  // @ts-expect-error — minimal stub for happy-dom
  globalThis.IntersectionObserver = StubIntersectionObserver;
}

// HTMLDialogElement.showModal/close — happy-dom partially implements
// <dialog>; modern Next.js modals use showModal/close which need stubs.
if (typeof HTMLDialogElement !== 'undefined') {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function showModal(): void {
      this.setAttribute('open', '');
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function close(): void {
      this.removeAttribute('open');
    };
  }
}
