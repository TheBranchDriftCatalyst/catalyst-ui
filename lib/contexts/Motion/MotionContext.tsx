"use client";

import * as React from "react";

/**
 * Motion Context
 *
 * Provides centralized motion configuration and accessibility settings.
 */
export interface MotionContextValue {
  /** Whether animations should be reduced (respects prefers-reduced-motion) */
  prefersReducedMotion: boolean;
  /** Whether motion is currently enabled */
  motionEnabled: boolean;
  /** Toggle motion on/off */
  setMotionEnabled: (enabled: boolean) => void;
}

export const MotionContext = React.createContext<MotionContextValue | undefined>(undefined);

/**
 * Hook to access Motion context
 *
 * @throws Error if used outside MotionProvider
 */
export function useMotion(): MotionContextValue {
  const context = React.useContext(MotionContext);

  if (!context) {
    throw new Error("useMotion must be used within a MotionProvider");
  }

  return context;
}
