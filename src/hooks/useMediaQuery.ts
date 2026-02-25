import { useEffect, useState } from 'react';

/**
 * Returns true when the document matches the given CSS media query string.
 * SSR-safe: returns false on the server (no window).
 */
export function useMediaQuery(query: string): boolean {
  const getMatch = () =>
    typeof window !== 'undefined' && window.matchMedia(query).matches;

  const [matches, setMatches] = useState<boolean>(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/** Returns true on screens ≤ 768px wide (mobile). */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

/** Returns true on screens between 769px and 1024px (tablet). */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
}

/** Returns true on screens ≥ 1025px wide (desktop). */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1025px)');
}
