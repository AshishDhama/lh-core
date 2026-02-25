import { useEffect, type RefObject } from 'react';

/**
 * Calls `handler` when a click occurs outside the element referenced by `ref`.
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
) {
  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [ref, handler]);
}
