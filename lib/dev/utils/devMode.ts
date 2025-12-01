/**
 * Dev utilities flag configuration
 *
 * Dev utils can be enabled in three ways:
 * 1. Running in development mode (import.meta.env.DEV)
 * 2. Setting VITE_CATALYST_DEV_UTILS_ENABLED=true at build time
 * 3. Setting window.ENV.DEV_UTILS_ENABLED=true at runtime (via config.js)
 *
 * When enabled via production flag:
 * - UI features work (inspect, view annotations, view i18n)
 * - Backend sync is DISABLED (no file writes)
 */

/**
 * Check if dev utilities UI should be enabled
 * @returns true if dev UI features should be visible/accessible
 */
export function isDevUtilsEnabled(): boolean {
  // Enable in true dev mode
  if (import.meta.env.DEV) {
    return true;
  }

  // Enable in production if build-time flag is set
  if (import.meta.env.VITE_CATALYST_DEV_UTILS_ENABLED === "true") {
    return true;
  }

  // Enable in production if runtime config flag is set
  if (typeof window !== "undefined" && window.ENV?.DEV_UTILS_ENABLED === true) {
    return true;
  }

  return false;
}

/**
 * Check if backend sync should be enabled
 * Backend sync only works in true development mode, never in production
 * @returns true if backend sync operations should be allowed
 */
export function isBackendSyncEnabled(): boolean {
  return import.meta.env.DEV === true;
}
