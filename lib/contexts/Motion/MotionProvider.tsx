"use client";

import * as React from "react";
import { MotionContext } from "./MotionContext";
import { usePrefersReducedMotion } from "@/catalyst-ui/hooks/usePrefersReducedMotion";

export interface MotionProviderProps {
  /** Child components */
  children: React.ReactNode;
  /** Whether to respect user's prefers-reduced-motion setting (default: true) */
  respectReducedMotion?: boolean;
  /** Initial motion enabled state (default: true) */
  defaultMotionEnabled?: boolean;
}

/**
 * MotionProvider - Centralized motion configuration provider
 *
 * Provides motion configuration and accessibility settings to all child components.
 * Automatically respects user's `prefers-reduced-motion` system preference.
 *
 * @example
 * ```tsx
 * <MotionProvider respectReducedMotion>
 *   <App />
 * </MotionProvider>
 * ```
 *
 * @example With manual control
 * ```tsx
 * <MotionProvider defaultMotionEnabled={false}>
 *   <App />
 * </MotionProvider>
 * ```
 */
export function MotionProvider({
  children,
  respectReducedMotion = true,
  defaultMotionEnabled = true,
}: MotionProviderProps) {
  const systemPrefersReducedMotion = usePrefersReducedMotion();
  const [motionEnabled, setMotionEnabled] = React.useState(defaultMotionEnabled);

  // Determine effective reduced motion preference
  const prefersReducedMotion = respectReducedMotion ? systemPrefersReducedMotion : false;

  const value = React.useMemo(
    () => ({
      prefersReducedMotion,
      motionEnabled: motionEnabled && !prefersReducedMotion,
      setMotionEnabled,
    }),
    [prefersReducedMotion, motionEnabled]
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}
