'use client';

import { type RefObject, useEffect } from 'react';

/**
 * Keyboard navigation for chart containers. Cycles a focused index through
 * `[0..dataLength-1]` via Left/Right or Up/Down arrows. Esc blurs.
 *
 * Owners pass a ref to the container `div`; the hook attaches a `keydown`
 * listener while the container has focus. Index changes are reported via
 * `onIndexChange` so consumers can drive Recharts' active-index state.
 */
export function useChartKeyboardNav(
  ref: RefObject<HTMLElement | null>,
  dataLength: number,
  onIndexChange: (nextIndex: number) => void,
): void {
  useEffect(() => {
    const node = ref.current;
    if (!node || dataLength <= 0) return;

    let currentIndex = 0;

    const onKeyDown = (event: KeyboardEvent): void => {
      let next = currentIndex;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          next = Math.min(currentIndex + 1, dataLength - 1);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          next = Math.max(currentIndex - 1, 0);
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = dataLength - 1;
          break;
        case 'Escape':
          (event.currentTarget as HTMLElement | null)?.blur?.();
          node.blur();
          return;
        default:
          return;
      }
      if (next !== currentIndex) {
        event.preventDefault();
        currentIndex = next;
        onIndexChange(next);
      }
    };

    node.addEventListener('keydown', onKeyDown);
    return () => node.removeEventListener('keydown', onKeyDown);
  }, [ref, dataLength, onIndexChange]);
}
