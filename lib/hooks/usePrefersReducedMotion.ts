import { useEffect, useState } from "react";

/**
 * usePrefersReducedMotion - Detects user's motion preferences
 *
 * Respects the `prefers-reduced-motion` media query, which indicates
 * that the user has requested that the system minimize the amount of
 * non-essential motion it uses.
 *
 * This is crucial for accessibility, as some users experience motion
 * sickness or vestibular disorders triggered by animations.
 *
 * @returns boolean - true if user prefers reduced motion
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = usePrefersReducedMotion();
 * const duration = prefersReducedMotion ? 0 : 300;
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window and matchMedia are available (SSR safety)
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers use addEventListener, older ones use addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // @ts-ignore - Fallback for older browsers
      mediaQuery.addListener(handleChange);
      // @ts-ignore
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}
