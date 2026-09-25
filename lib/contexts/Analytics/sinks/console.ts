import type {
  AnalyticsConfig,
  AnalyticsEvent,
  AnalyticsSink,
  ErrorEvent,
  PerformanceMetric,
  UserJourneyStep,
} from "../types";

/**
 * Configuration for the {@link consoleSink} sink.
 *
 * @public
 */
export interface ConsoleSinkConfig {
  /**
   * Force logging on or off. When omitted the sink follows
   * `AnalyticsConfig.debug`, which is the behaviour every existing consumer
   * already has.
   */
  enabled?: boolean;
}

/**
 * Console sink.
 *
 * Mirrors what the provider collects to the browser console. This is the
 * developer-facing sink — it is registered by default and gated on
 * `AnalyticsConfig.debug`, so production consumers get it for free and pay
 * nothing for it.
 *
 * ### Page views
 *
 * Deliberately no `pageView` method. `trackPageView` also emits a derived
 * `page_view` event, so implementing both would print every navigation twice.
 *
 * ### Message format
 *
 * The messages (`"Event tracked:"`, `"Error tracked:"`, ...) are verbatim the
 * strings the provider used to log inline. Anyone grepping a console session
 * or filtering devtools on them keeps working.
 *
 * @public
 */
export function consoleSink(config: ConsoleSinkConfig = {}): AnalyticsSink<ConsoleSinkConfig> {
  // Silent until `init` says otherwise — matches the old behaviour, where
  // `configRef.current?.debug` was undefined before initialization.
  let enabled = config.enabled ?? false;

  return {
    id: "console",
    label: "Console",
    config,
    init(analyticsConfig: AnalyticsConfig) {
      enabled = config.enabled ?? analyticsConfig.debug ?? false;
    },
    event(event: AnalyticsEvent) {
      if (enabled) console.log("Event tracked:", event);
    },
    error(error: ErrorEvent) {
      if (enabled) console.error("Error tracked:", error);
    },
    performance(metric: PerformanceMetric) {
      if (enabled) console.log("Performance metric tracked:", metric);
    },
    journeyStep(step: UserJourneyStep) {
      if (enabled) console.log("Journey step tracked:", step);
    },
  };
}
