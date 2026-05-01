'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The Ember — Style B signature.
 *
 * 280px breathing radial-gradient blob (terracotta → peach). The breath
 * cycle accelerates from 9.5s → 4s when the cursor enters a 200px
 * proximity. This is the «AI noticed you» gesture from the spec.
 *
 * Implementation tradeoff: we drive the breath with a CSS `@keyframes`
 * animation and only mutate `animation-duration` from JS based on cursor
 * distance. CSS-keyframes-driven motion is significantly cheaper than a
 * RAF-driven scale loop (offloaded to compositor, no React re-renders),
 * and the proximity check itself is rate-limited to 60Hz via the native
 * `pointermove` throttle. Reduced-motion is honoured in CSS (animation
 * disabled, opacity dialled to 0.85) — no JS branch needed.
 */

const FAR_PERIOD = '9.5s';
const NEAR_PERIOD = '4s';
const PROXIMITY_PX = 200;

export function Ember() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const emberRef = useRef<HTMLDivElement | null>(null);
  const [, force] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const ember = emberRef.current;
    if (!wrap || !ember) return;

    const handlePointerMove = (event: PointerEvent): void => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < PROXIMITY_PX) {
        const t = distance / PROXIMITY_PX; // 0 (touching) → 1 (edge)
        // Linearly interpolate period between 4s and 9.5s as we leave the zone.
        const seconds = 4 + t * 5.5;
        ember.style.setProperty('--b-ember-period', `${seconds.toFixed(2)}s`);
        ember.style.filter = `brightness(${1 + (1 - t) * 0.12})`;
      } else {
        ember.style.setProperty('--b-ember-period', FAR_PERIOD);
        ember.style.filter = '';
      }
    };

    const handlePointerLeave = (): void => {
      ember.style.setProperty('--b-ember-period', FAR_PERIOD);
      ember.style.filter = '';
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    force((n) => n + 1); // ensure ref-set CSS prop registers on first paint
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div className="b-ember-wrap" ref={wrapRef} aria-hidden>
      <div
        className="b-ember"
        ref={emberRef}
        style={{ '--b-ember-period': NEAR_PERIOD } as React.CSSProperties}
      />
    </div>
  );
}

/**
 * Docked ember — pinned 12px breathing dot in the top-right of the
 * viewport, fades in once the user has scrolled past the hero.
 */
export function EmberDock() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById('b-ember-sentinel');
    if (!sentinel || typeof IntersectionObserver === 'undefined') {
      const onScroll = (): void => setVisible(window.scrollY > 600);
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return <div className="b-ember-dock" data-visible={visible} aria-hidden />;
}

/**
 * Headline weight-oscillator — fires once, on first appearance via
 * Intersection Observer. The actual 500 → 580 → 500 oscillation is a CSS
 * keyframe; this hook just toggles the class on enter.
 */
export function useTypeBreath(ref: React.RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          node.classList.add('b-headline-thinking');
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
}
