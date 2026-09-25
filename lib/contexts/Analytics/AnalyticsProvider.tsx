/**
 * Analytics Provider
 * Main provider component that handles Google Analytics 4, error tracking,
 * performance monitoring, and user journey tracking
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import type {
  AnalyticsConfig,
  AnalyticsContextValue,
  AnalyticsEvent,
  AnalyticsSink,
  AnalyticsSinkMethod,
  AnalyticsSinkPayloads,
  ErrorEvent,
  PerformanceMetric,
  SessionInfo,
  UserJourneyStep,
} from "./types";
import { storage } from "./storage";
import { scrubErrorEvent, scrubParams, scrubText } from "./scrub";
import { consoleSink, ga4 } from "./sinks";
import { AnalyticsContext } from "./AnalyticsContext";

/**
 * Props for {@link AnalyticsProvider}.
 *
 * @public
 */
export interface AnalyticsProviderProps {
  children: React.ReactNode;
  /** Auto-initialize with config */
  config?: AnalyticsConfig;
  /**
   * Destinations the collected signals are forwarded to, in fan-out order.
   *
   * Omit this and you get the historical pair — `ga4()` (inert without a
   * `measurementId`) and `consoleSink()` (inert without `debug`) — so existing
   * consumers passing only `{ children, config }` are unaffected. Pass `[]`
   * to collect into localStorage and nothing else.
   *
   * The list is read once, on the provider's first render: sinks are
   * registered, not reactive. Sink failures never reach the caller — see
   * {@link AnalyticsSink}.
   */
  sinks?: AnalyticsSink[];
}

/** The historical destinations, each self-gating on {@link AnalyticsConfig}. */
const defaultSinks = (): AnalyticsSink[] => [ga4(), consoleSink()];

const isThenable = (value: unknown): value is Promise<unknown> =>
  typeof (value as Promise<unknown> | undefined)?.then === "function";

const generateSessionId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  config,
  sinks,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const configRef = useRef<AnalyticsConfig | null>(null);
  const sessionRef = useRef<SessionInfo | null>(null);

  // Registered once, on first render, so `emit` can stay dependency-free and
  // every track callback keeps a stable identity.
  const sinksRef = useRef<AnalyticsSink[] | null>(null);
  if (sinksRef.current === null) {
    sinksRef.current = sinks ?? defaultSinks();
  }

  // Everything `initialize` attaches outside React's effect graph, as the
  // teardowns that undo it. They have to live in a ref: they are produced
  // imperatively, long after the effect responsible for running them was
  // declared, so there is nowhere else to hand them.
  const teardownsRef = useRef<Array<() => void>>([]);

  // The "already initialized" guard has to be a ref rather than the
  // `isInitialized` state, because a state guard is only ever as fresh as the
  // closure reading it: `setIsInitialized(true)` is queued, not applied, so a
  // second `initialize()` in the same render cycle still reads `false` and
  // re-runs the lot -- a second click listener, a second session, a second
  // `init()` on every sink. A ref is updated in place, so the second call sees
  // what the first did.
  //
  // This is *not* what fixes StrictMode's double-attach; `teardown` below is.
  // Note it also clears this ref, so StrictMode's second pass deliberately
  // re-initializes from scratch -- correct, because the simulated unmount
  // already detached everything the first pass attached.
  const initializedRef = useRef(false);

  /** Undo everything `initialize` attached, in one place. */
  const teardown = useCallback(() => {
    for (const undo of teardownsRef.current.splice(0)) undo();
    initializedRef.current = false;
  }, []);

  const warnSinkFailure = useCallback((sink: AnalyticsSink, method: string, error: unknown) => {
    console.warn(`[AnalyticsProvider] sink "${sink.id}" threw in ${method}()`, error);
  }, []);

  /**
   * Fan one signal out to every sink that implements it.
   *
   * Best-effort by contract: a throwing sink is reported and skipped so it can
   * neither break the caller nor starve the sinks registered after it. The
   * localStorage write has already happened by the time this runs.
   */
  const emit = useCallback(
    <M extends AnalyticsSinkMethod>(method: M, payload: AnalyticsSinkPayloads[M]) => {
      for (const sink of sinksRef.current ?? []) {
        const handler = sink[method] as
          | ((value: AnalyticsSinkPayloads[M]) => void | Promise<void>)
          | undefined;
        if (typeof handler !== "function") continue;

        try {
          const result = handler.call(sink, payload);
          if (isThenable(result)) {
            result.then(undefined, error => warnSinkFailure(sink, method, error));
          }
        } catch (error) {
          warnSinkFailure(sink, method, error);
        }
      }
    },
    [warnSinkFailure]
  );

  // Initialize session
  const initializeSession = useCallback(() => {
    const existingSession = storage.getSession();
    const now = Date.now();

    // Check if existing session is still valid (< 30 minutes since last activity)
    if (existingSession && now - existingSession.lastActivity < 30 * 60 * 1000) {
      // Resume: the ref has to carry the refreshed activity stamp too, so it
      // never disagrees with what was just persisted.
      const resumed: SessionInfo = { ...existingSession, lastActivity: now };
      sessionRef.current = resumed;
      storage.setSession(resumed);
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
      if (initializedRef.current) {
        console.warn("Analytics already initialized");
        return;
      }
      initializedRef.current = true;

      configRef.current = initConfig;

      // Bring up the sinks. Each one gates itself on `initConfig` (GA4 on
      // `measurementId`, console on `debug`), and one that fails to start must
      // not take the others — or initialization itself — down with it.
      for (const sink of sinksRef.current ?? []) {
        if (typeof sink.init !== "function") continue;
        try {
          const result = sink.init(initConfig);
          if (isThenable(result)) {
            result.then(undefined, error => warnSinkFailure(sink, "init", error));
          }
        } catch (error) {
          warnSinkFailure(sink, "init", error);
        }
      }

      // Initialize session
      initializeSession();

      // Setup global error handlers if enabled. The teardown is registered
      // here, against the handlers actually attached, rather than rebuilt later
      // from `configRef` -- the config that decided to attach is the only thing
      // that can be trusted to decide to detach.
      if (initConfig.enableErrorTracking) {
        window.addEventListener("error", handleGlobalError);
        window.addEventListener("unhandledrejection", handleUnhandledRejection);
        teardownsRef.current.push(() => {
          window.removeEventListener("error", handleGlobalError);
          window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        });
      }

      // Setup performance monitoring if enabled
      if (
        initConfig.enablePerformance &&
        typeof window !== "undefined" &&
        "PerformanceObserver" in window
      ) {
        setupPerformanceMonitoring();
      }

      // Setup user journey tracking if enabled. The returned teardown is the
      // only handle on the `click` and `popstate` listeners it attaches;
      // discarding it leaked both for the lifetime of the page, so an unmounted
      // provider went on recording journey steps.
      if (initConfig.enableUserJourney) {
        teardownsRef.current.push(setupUserJourneyTracking());
      }

      setIsInitialized(true);
    },
    [initializeSession, warnSinkFailure]
  );

  // Auto-initialize if config provided
  useEffect(() => {
    if (config && !isInitialized) {
      initialize(config);
    }
  }, [config, isInitialized, initialize]);

  // Track custom event
  const trackEvent = useCallback(
    (name: string, params?: Record<string, any>) => {
      const event: AnalyticsEvent = {
        name,
        // Scrubbed HERE, before storage and before any sink, for the same
        // reason trackError scrubs at collection: the invariant then holds for
        // every sink including ones this repo never sees, and for localStorage
        // and the Export button, which a user can hand to anyone.
        params: scrubParams(params),
        timestamp: Date.now(),
      };

      // Store locally. Unconditional and first: the dashboard, Export and
      // Clear read this, so it must not depend on any sink.
      storage.addEvent(event);

      emit("event", event);

      // Update session — the bump reads the persisted total, never the ref,
      // which is only assigned at init and would pin the counter at that value.
      if (sessionRef.current) {
        sessionRef.current = storage.incrementSession({ eventCount: 1 }) ?? sessionRef.current;
      }
    },
    [emit]
  );

  // Track page view
  const trackPageView = useCallback(
    (rawPath: string, title?: string) => {
      // Reduced ONCE, up front, because this function has two independent
      // exits: the native pageView emit below bypasses trackEvent entirely, so
      // scrubbing only inside trackEvent would leave this path leaking.
      const path = scrubText(rawPath);

      // Sinks with a native page-view concept see it first...
      emit("pageView", { path, title, timestamp: Date.now() });

      // ...then the derived event, for sinks (and storage) that only speak events
      trackEvent("page_view", { page_path: path, page_title: title });

      // Update session page views (see trackEvent — same persisted-total rule)
      if (sessionRef.current) {
        sessionRef.current = storage.incrementSession({ pageViews: 1 }) ?? sessionRef.current;
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
    [emit, trackEvent]
  );

  // Track error
  const trackError = useCallback(
    (error: Error, context?: Record<string, any>) => {
      // `componentStack` is the one context key with a home of its own on
      // ErrorEvent, and `trackError(error, context)` has no parameter for it --
      // so a caller that has one (AnalyticsErrorBoundary, now delegating rather
      // than writing its own copy) can only hand it over inside `context`.
      // Left there it is lost data: `sinks/faro.ts` and the Observability tab
      // both read the top-level field, and neither would ever see it. Lift it
      // out rather than copy it, so the record carries exactly one stack.
      //
      // A lift is a move, so the siblings have to survive it: `context` is the
      // caller's only channel, and dropping what is left after the stack comes
      // out would take the `{ type: "global" }` / `{ type: "unhandled_rejection" }`
      // markers below with it -- the same lost-data failure one layer up. The
      // ternary is load-bearing in both directions and is pinned by
      // ErrorBoundary.test.tsx's "trackError context lifting" block; `{}` is
      // collapsed to `undefined` so the record never claims a context it has
      // none of.
      let componentStack: string | undefined;
      let rest = context;
      if (typeof context?.componentStack === "string") {
        const { componentStack: lifted, ...others } = context;
        componentStack = lifted;
        rest = Object.keys(others).length > 0 ? others : undefined;
      }

      // Scrubbed before it is stored, not before it is sent: localStorage and
      // the Export button are egress too, and doing it here means every sink
      // -- including ones written outside this repo -- is safe by construction
      // rather than by remembering. See ./scrub.
      const errorEvent: ErrorEvent = scrubErrorEvent({
        message: error.message,
        stack: error.stack,
        componentStack,
        type: "react",
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
        context: rest,
      });

      // Store locally (unconditional)
      storage.addError(errorEvent);

      emit("error", errorEvent);
    },
    [emit]
  );

  // Track performance metric
  const trackPerformance = useCallback(
    (metric: PerformanceMetric) => {
      // Store locally (unconditional)
      storage.addMetric(metric);

      emit("performance", metric);
    },
    [emit]
  );

  // Track user journey step
  const trackJourneyStep = useCallback(
    (step: Omit<UserJourneyStep, "timestamp">) => {
      const journeyStep: UserJourneyStep = {
        ...step,
        timestamp: Date.now(),
      };

      // Store locally (unconditional)
      storage.addJourneyStep(journeyStep);

      emit("journeyStep", journeyStep);
    },
    [emit]
  );

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

      // Handle className which can be a string, DOMTokenList, or SVGAnimatedString
      const classNameStr = typeof className === "string" ? className : "";
      const firstClass = classNameStr ? `.${classNameStr.split(" ")[0]}` : "";

      trackJourneyStep({
        type: "click",
        target: `${tagName}${id ? `#${id}` : ""}${firstClass}`,
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

  // Cleanup on unmount: run every teardown `initialize` registered. Empty of
  // its own logic on purpose -- anything that knows how to detach itself
  // registered that knowledge at attach time, so nothing can be forgotten here.
  useEffect(() => teardown, [teardown]);

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
