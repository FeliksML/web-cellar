import { useState, useEffect } from "react";

/**
 * Hook to detect if a media query matches
 * @param query - CSS media query string
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/**
 * Hook to detect if viewport is mobile (< 768px)
 * @returns boolean - true if mobile viewport
 */
export function useIsMobile(): boolean {
  return !useMediaQuery("(min-width: 768px)");
}

/**
 * Hook to detect if viewport is tablet or larger (>= 768px)
 * @returns boolean - true if tablet or larger
 */
export function useIsTabletOrLarger(): boolean {
  return useMediaQuery("(min-width: 768px)");
}
