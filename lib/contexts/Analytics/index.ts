/**
 * Analytics Module
 * Comprehensive analytics and observability for React applications
 *
 * @module Analytics
 */

export { AnalyticsProvider, type AnalyticsProviderProps } from "./AnalyticsProvider";
export { AnalyticsErrorBoundary } from "./ErrorBoundary";
export { useAnalytics } from "./AnalyticsContext";
export { storage } from "./storage";
export { scrubErrorEvent, scrubParams, scrubText, scrubUrl } from "./scrub";
export * from "./types";
export * as sinks from "./sinks";
