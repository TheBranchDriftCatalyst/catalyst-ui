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
