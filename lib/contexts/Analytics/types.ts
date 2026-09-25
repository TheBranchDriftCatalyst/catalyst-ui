/**
 * Comprehensive analytics and observability type definitions
 */

export interface AnalyticsConfig {
  /** Google Analytics 4 Measurement ID */
  measurementId?: string;
  /** Enable debug logging */
  debug?: boolean;
  /** Enable performance monitoring */
  enablePerformance?: boolean;
  /** Enable error tracking */
  enableErrorTracking?: boolean;
  /** Enable user journey tracking */
  enableUserJourney?: boolean;
  /** Custom dimensions */
  customDimensions?: Record<string, string | number>;
}

export interface AnalyticsEvent {
  /** Event name */
  name: string;
  /** Event category */
  category?: string;
  /** Event parameters */
  params?: Record<string, any>;
  /** Timestamp */
  timestamp: number;
}

export interface PerformanceMetric {
  /** Metric name (LCP, FID, CLS, etc.) */
  name: string;
  /** Metric value */
  value: number;
  /** Delta from previous measurement */
  delta?: number;
  /** Rating (good, needs-improvement, poor) */
  rating?: "good" | "needs-improvement" | "poor";
  /** Timestamp */
  timestamp: number;
}

export interface ErrorEvent {
  /** Error message */
  message: string;
  /** Error stack trace */
  stack?: string;
  /** Component stack (React) */
  componentStack?: string;
  /** Error type */
  type: "error" | "unhandledrejection" | "react";
  /** User agent */
  userAgent: string;
  /** URL where error occurred */
  url: string;
  /** Timestamp */
  timestamp: number;
  /** Additional context */
  context?: Record<string, any>;
}

export interface UserJourneyStep {
  /** Step type */
  type: "pageview" | "click" | "input" | "navigation" | "custom";
  /** Target element or page */
  target: string;
  /** Additional data */
  data?: Record<string, any>;
  /** Timestamp */
  timestamp: number;
}

export interface SessionInfo {
  /** Session ID */
  sessionId: string;
  /** Session start time */
  startTime: number;
  /** Last activity time */
  lastActivity: number;
  /** Page views in session */
  pageViews: number;
  /** Events in session */
  eventCount: number;
  /** User journey steps */
  journey: UserJourneyStep[];
}

export interface AnalyticsContextValue {
  /** Initialize analytics */
  initialize: (config: AnalyticsConfig) => void;
  /** Track custom event */
  trackEvent: (name: string, params?: Record<string, any>) => void;
  /** Track page view */
  trackPageView: (path: string, title?: string) => void;
  /** Track error */
  trackError: (error: Error, context?: Record<string, any>) => void;
  /** Track performance metric */
  trackPerformance: (metric: PerformanceMetric) => void;
  /** Track user journey step */
  trackJourneyStep: (step: Omit<UserJourneyStep, "timestamp">) => void;
  /** Get current session info */
  getSession: () => SessionInfo | null;
  /** Get all events */
  getEvents: () => AnalyticsEvent[];
  /** Get all errors */
  getErrors: () => ErrorEvent[];
  /** Get all performance metrics */
  getMetrics: () => PerformanceMetric[];
  /** Export data as JSON */
  exportData: () => string;
  /** Clear all stored data */
  clearData: () => void;
  /** Check if initialized */
  isInitialized: boolean;
}

/**
 * Page view payload handed to {@link AnalyticsSink.pageView}.
 *
 * A page view is the one signal that is *not* an {@link AnalyticsEvent}: the
 * provider emits it to sinks first and then derives a `page_view` event from
 * it, so sinks with a native page-view concept (GA4's `pageview` hit) and
 * sinks that only understand events both see it.
 *
 * @public
 */
export interface PageViewEvent {
  /** Path that was viewed, as passed to `trackPageView`. */
  path: string;
  /** Optional document title. */
  title?: string;
  /** Timestamp */
  timestamp: number;
}

/**
 * The fan-out methods on an {@link AnalyticsSink}, excluding `init`.
 *
 * @public
 */
export type AnalyticsSinkMethod = "event" | "pageView" | "error" | "performance" | "journeyStep";

/**
 * Payload each {@link AnalyticsSinkMethod} receives.
 *
 * @public
 */
export interface AnalyticsSinkPayloads {
  event: AnalyticsEvent;
  pageView: PageViewEvent;
  error: ErrorEvent;
  performance: PerformanceMetric;
  journeyStep: UserJourneyStep;
}

/**
 * Provider-agnostic destination for collected analytics.
 *
 * A sink is a plain object — no React deps — that forwards what the provider
 * collects to somewhere else: Google Analytics, a console, an OTLP collector.
 * Sinks hold their own configuration and are pure consumers; they never feed
 * data back into the provider.
 *
 * ### Contract
 *
 * Every method is optional. A sink implements only the signals it understands,
 * and the provider skips the rest — GA4 has no journey concept, so the `ga4`
 * sink omits `journeyStep`; page views already reach the console through the
 * derived `page_view` event, so the `console` sink omits `pageView`.
 *
 * | Method         | Fired by                                  |
 * |----------------|-------------------------------------------|
 * | `init`         | `initialize()` / the `config` prop        |
 * | `event`        | `trackEvent` (and `trackPageView`)        |
 * | `pageView`     | `trackPageView`                           |
 * | `error`        | `trackError`                              |
 * | `performance`  | `trackPerformance`                        |
 * | `journeyStep`  | `trackJourneyStep`                        |
 *
 * ### Failure isolation
 *
 * Sinks are best-effort. A method that throws — or returns a promise that
 * rejects — is caught by the provider, logged with `console.warn`, and does
 * not stop the remaining sinks or the unconditional localStorage write that
 * backs the dashboard, Export and Clear. Sinks must therefore never be relied
 * on for correctness of the local record.
 *
 * ### Gating
 *
 * Gating belongs to the sink, not the provider. `init` receives the whole
 * {@link AnalyticsConfig}; a sink that finds itself unconfigured (no
 * `measurementId`, `debug: false`) should disable itself there and no-op
 * afterwards rather than expecting the provider to know about it.
 *
 * @public
 */
export interface AnalyticsSink<TConfig = unknown> {
  /** Stable machine id: `"ga4"`, `"console"`, `"faro"`, ... */
  id: string;
  /** Human-facing label, used in warnings and debug UI. */
  label: string;
  /** Sink-specific configuration (measurement id, endpoint, API key). */
  config: TConfig;
  /** Called once when the provider initializes. Resolve any transport here. */
  init?(config: AnalyticsConfig): void | Promise<void>;
  /** A custom event — including the `page_view` derived from `trackPageView`. */
  event?(event: AnalyticsEvent): void | Promise<void>;
  /** A page view, emitted before its derived `page_view` event. */
  pageView?(view: PageViewEvent): void | Promise<void>;
  /** A tracked error. */
  error?(error: ErrorEvent): void | Promise<void>;
  /** A web-vitals / performance metric. */
  performance?(metric: PerformanceMetric): void | Promise<void>;
  /** A user journey step. */
  journeyStep?(step: UserJourneyStep): void | Promise<void>;
}
