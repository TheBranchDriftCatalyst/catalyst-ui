/**
 * Analytics Provider
 * Main provider component that handles Google Analytics 4, error tracking,
 * performance monitoring, and user journey tracking
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactGA from "react-ga4";
import type {
  AnalyticsConfig,
  AnalyticsContextValue,
  AnalyticsEvent,
  ErrorEvent,
  PerformanceMetric,
  SessionInfo,
  UserJourneyStep,
} from "./types";
import { storage } from "./storage";
import { AnalyticsContext } from "./AnalyticsContext";

interface AnalyticsProviderProps {
  children: React.ReactNode;
  /** Auto-initialize with config */
  config?: AnalyticsConfig;
}

const generateSessionId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children, config }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const configRef = useRef<AnalyticsConfig | null>(null);
  const sessionRef = useRef<SessionInfo | null>(null);

  // Initialize session
  const initializeSession = useCallback(() => {
    const existingSession = storage.getSession();
    const now = Date.now();

    // Check if existing session is still valid (< 30 minutes since last activity)
    if (existingSession && now - existingSession.lastActivity < 30 * 60 * 1000) {
      sessionRef.current = existingSession;
      storage.updateSession({ lastActivity: now });
    } else {
      // Create new session
      const newSession: SessionInfo = {
        sessionId: generateSessionId(),
        startTime: now,
        lastActivity: now,
        pageViews: 0,
        eventCount: 0,
        journey: [],
      };
      sessionRef.current = newSession;
      storage.setSession(newSession);
    }
  }, []);

  // Initialize analytics
  const initialize = useCallback(
    (initConfig: AnalyticsConfig) => {
      if (isInitialized) {
        console.warn("Analytics already initialized");
        return;
      }

      configRef.current = initConfig;

      // Initialize GA4 if measurement ID provided
      if (initConfig.measurementId) {
        ReactGA.initialize(initConfig.measurementId, {
          gaOptions: {
            debug_mode: initConfig.debug,
            ...initConfig.customDimensions,
          },
        });

        if (initConfig.debug) {
          console.log("Google Analytics 4 initialized:", initConfig.measurementId);
        }
      }

      // Initialize session
      initializeSession();

      // Setup global error handlers if enabled
      if (initConfig.enableErrorTracking) {
        window.addEventListener("error", handleGlobalError);
        window.addEventListener("unhandledrejection", handleUnhandledRejection);
      }

      // Setup performance monitoring if enabled
      if (
        initConfig.enablePerformance &&
        typeof window !== "undefined" &&
        "PerformanceObserver" in window
      ) {
        setupPerformanceMonitoring();
      }

      // Setup user journey tracking if enabled
      if (initConfig.enableUserJourney) {
        setupUserJourneyTracking();
      }

      setIsInitialized(true);
    },
    [isInitialized, initializeSession]
  );

  // Auto-initialize if config provided
  useEffect(() => {
    if (config && !isInitialized) {
      initialize(config);
    }
  }, [config, isInitialized, initialize]);

  // Track custom event
  const trackEvent = useCallback((name: string, params?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      name,
      params,
      timestamp: Date.now(),
    };

    // Store locally
    storage.addEvent(event);

    // Send to GA4
    if (configRef.current?.measurementId) {
      ReactGA.event(name, params);
    }

    // Update session
    if (sessionRef.current) {
      storage.updateSession({
        eventCount: sessionRef.current.eventCount + 1,
        lastActivity: Date.now(),
      });
    }

    if (configRef.current?.debug) {
      console.log("Event tracked:", event);
    }
  }, []);

  // Track page view
  const trackPageView = useCallback(
    (path: string, title?: string) => {
      // Send to GA4
      if (configRef.current?.measurementId) {
        ReactGA.send({ hitType: "pageview", page: path, title });
      }

      // Track as custom event
      trackEvent("page_view", { page_path: path, page_title: title });

      // Update session page views
      if (sessionRef.current) {
        storage.updateSession({
          pageViews: sessionRef.current.pageViews + 1,
          lastActivity: Date.now(),
        });
      }

      // Track in user journey
      if (configRef.current?.enableUserJourney) {
        trackJourneyStep({
          type: "pageview",
          target: path,
          data: { title },
        });
      }
    },
    [trackEvent]
  );

  // Track error
  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    const errorEvent: ErrorEvent = {
      message: error.message,
      stack: error.stack,
      type: "react",
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
      context,
    };

    // Store locally
    storage.addError(errorEvent);

    // Send to GA4
    if (configRef.current?.measurementId) {
      ReactGA.event("exception", {
        description: error.message,
        fatal: false,
        ...context,
      });
    }

    if (configRef.current?.debug) {
      console.error("Error tracked:", errorEvent);
    }
  }, []);

  // Track performance metric
  const trackPerformance = useCallback((metric: PerformanceMetric) => {
    // Store locally
    storage.addMetric(metric);

    // Send to GA4
    if (configRef.current?.measurementId) {
      ReactGA.event("web_vitals", {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
      });
    }

    if (configRef.current?.debug) {
      console.log("Performance metric tracked:", metric);
    }
  }, []);

  // Track user journey step
  const trackJourneyStep = useCallback((step: Omit<UserJourneyStep, "timestamp">) => {
    const journeyStep: UserJourneyStep = {
      ...step,
      timestamp: Date.now(),
    };

    storage.addJourneyStep(journeyStep);

    if (configRef.current?.debug) {
      console.log("Journey step tracked:", journeyStep);
    }
  }, []);

  // Global error handler
  const handleGlobalError = useCallback(
    (event: Event) => {
      const errorEvent = event as globalThis.ErrorEvent;
      const error = new Error(errorEvent.message);
      error.stack = errorEvent.error?.stack;
      trackError(error, { type: "global" });
    },
    [trackError]
  );

  // Unhandled rejection handler
  const handleUnhandledRejection = useCallback(
    (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      trackError(error, { type: "unhandled_rejection" });
    },
    [trackError]
  );

  // Setup performance monitoring
  const setupPerformanceMonitoring = useCallback(() => {
    // Import web-vitals dynamically
    import("web-vitals").then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(metric => trackPerformance({ ...metric, timestamp: Date.now() }));
      onINP(metric => trackPerformance({ ...metric, timestamp: Date.now() }));
      onFCP(metric => trackPerformance({ ...metric, timestamp: Date.now() }));
      onLCP(metric => trackPerformance({ ...metric, timestamp: Date.now() }));
      onTTFB(metric => trackPerformance({ ...metric, timestamp: Date.now() }));
    });
  }, [trackPerformance]);

  // Setup user journey tracking
  const setupUserJourneyTracking = useCallback(() => {
    // Track clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const id = target.id;
      const className = target.className;

      trackJourneyStep({
        type: "click",
        target: `${tagName}${id ? `#${id}` : ""}${className ? `.${className.split(" ")[0]}` : ""}`,
        data: {
          x: e.clientX,
          y: e.clientY,
        },
      });
    };

    // Track navigation
    const handleNavigation = () => {
      trackJourneyStep({
        type: "navigation",
        target: window.location.pathname,
      });
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", handleNavigation);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [trackJourneyStep]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (configRef.current?.enableErrorTracking) {
        window.removeEventListener("error", handleGlobalError as any);
        window.removeEventListener("unhandledrejection", handleUnhandledRejection as any);
      }
    };
  }, [handleGlobalError, handleUnhandledRejection]);

  // Context value
  const contextValue: AnalyticsContextValue = {
    initialize,
    trackEvent,
    trackPageView,
    trackError,
    trackPerformance,
    trackJourneyStep,
    getSession: () => storage.getSession(),
    getEvents: () => storage.getEvents(),
    getErrors: () => storage.getErrors(),
    getMetrics: () => storage.getMetrics(),
    exportData: () => JSON.stringify(storage.exportData(), null, 2),
    clearData: () => storage.clear(),
    isInitialized,
  };

  return <AnalyticsContext.Provider value={contextValue}>{children}</AnalyticsContext.Provider>;
};
