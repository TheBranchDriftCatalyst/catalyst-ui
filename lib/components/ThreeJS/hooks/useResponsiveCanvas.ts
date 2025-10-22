/**
 * useResponsiveCanvas - Media Query Hook for 3D Responsive Behavior
 *
 * Tracks viewport size and provides mobile/desktop state for adjusting
 * 3D model scale, position, and camera settings.
 */

import { useState, useEffect } from "react";

export interface ResponsiveCanvasState {
  /** Is viewport mobile-sized (≤ 500px) */
  isMobile: boolean;
  /** Current viewport width */
  width: number;
  /** Current viewport height */
  height: number;
}

/**
 * useResponsiveCanvas Hook
 *
 * Monitors window size and detects mobile viewport.
 * Updates on resize with debouncing.
 *
 * @param mobileBreakpoint - Width threshold for mobile (default: 500)
 * @returns Responsive state object
 *
 * @example
 * ```tsx
 * const { isMobile, width, height } = useResponsiveCanvas();
 * const scale = isMobile ? 0.7 : 0.75;
 * ```
 */
export function useResponsiveCanvas(mobileBreakpoint = 500): ResponsiveCanvasState {
  const [state, setState] = useState<ResponsiveCanvasState>(() => ({
    isMobile: typeof window !== "undefined" && window.innerWidth <= mobileBreakpoint,
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  }));

  useEffect(() => {
    // Handler for window resize
    const handleResize = () => {
      setState({
        isMobile: window.innerWidth <= mobileBreakpoint,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Attach resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileBreakpoint]);

  return state;
}
