import { ReactNode } from "react";
import { isDevUtilsEnabled } from "../utils/devMode";
import { LocalizationProvider } from "../context/LocalizationContext";
import { AnnotationProvider } from "../context/AnnotationContext";

interface DevProvidersProps {
  children: ReactNode;
}

/**
 * Conditional wrapper for dev-mode providers
 *
 * In development (or when VITE_CATALYST_DEV_UTILS_ENABLED=true):
 * - Wraps children with LocalizationProvider and AnnotationProvider
 * - Enables live translation editing and component annotations
 *
 * In production (when flag not set):
 * - Renders children directly (pass-through)
 * - Entire dev provider code can be tree-shaken
 *
 * This ensures dev utilities are completely removed from production bundles
 * when not explicitly enabled.
 */
export function DevProviders({ children }: DevProvidersProps) {
  // Check if dev utilities should be enabled
  if (!isDevUtilsEnabled()) {
    // Production mode with flag not set - just pass through
    return <>{children}</>;
  }

  // Dev mode or production with flag - wrap with providers
  return (
    <LocalizationProvider>
      <AnnotationProvider>{children}</AnnotationProvider>
    </LocalizationProvider>
  );
}
