import type {
  AnalyticsConfig,
  AnalyticsEvent,
  AnalyticsSink,
  ErrorEvent,
  PageViewEvent,
  PerformanceMetric,
} from "../types";

/** The `react-ga4` default export, resolved lazily. */
type ReactGAApi = Awaited<typeof import("react-ga4")>["default"];

/**
 * Configuration for the {@link ga4} sink.
 *
 * @public
 */
export interface Ga4SinkConfig {
  /**
   * GA4 Measurement ID (`G-XXXXXXXXXX`). When omitted the sink falls back to
   * `AnalyticsConfig.measurementId`; when neither is set the sink disables
   * itself and `react-ga4` is never loaded.
   */
  measurementId?: string;
}

/**
 * Google Analytics 4 sink.
 *
 * ### Why the dynamic import
 *
 * `react-ga4` used to be a static import in `AnalyticsProvider`, so it landed
 * in a shared chunk (~27KB) that every consumer of the Analytics context paid
 * for — including the overwhelming majority who never set a `measurementId`.
 * The `import("react-ga4")` below is inside `init` and behind the
 * measurement-id check, so the bundler splits it into its own chunk and the
 * chunk is only ever fetched by an app that actually configured GA4.
 *
 * Keep it that way: any top-level `import` of `react-ga4` in this file, or a
 * type-only import promoted to a value import, silently undoes it.
 *
 * ### Ordering
 *
 * The transport resolves asynchronously, so hits are queued onto the same
 * import promise and therefore still reach GA in call order. Calls made before
 * `init` (or when GA4 is disabled) are dropped, exactly as the inline
 * `configRef.current?.measurementId` guard used to drop them.
 *
 * ### Journey steps
 *
 * No `journeyStep` method — GA4 has no equivalent concept, and the old inline
 * code never sent them either. Journey steps stay in localStorage.
 *
 * @public
 */
export function ga4(config: Ga4SinkConfig = {}): AnalyticsSink<Ga4SinkConfig> {
  let transport: Promise<ReactGAApi> | null = null;

  const send = (fn: (api: ReactGAApi) => void) => {
    if (!transport) return;
    transport.then(fn).catch(() => {
      // `init` already reported the load failure; dropping hits afterwards is
      // the intended degradation, not a second thing to shout about.
    });
  };

  return {
    id: "ga4",
    label: "Google Analytics 4",
    config,
    init(analyticsConfig: AnalyticsConfig) {
      const measurementId = config.measurementId ?? analyticsConfig.measurementId;
      if (!measurementId) return;

      transport = import("react-ga4").then(mod => {
        const api = mod.default;
        api.initialize(measurementId, {
          gaOptions: {
            debug_mode: analyticsConfig.debug,
            ...analyticsConfig.customDimensions,
          },
        });

        if (analyticsConfig.debug) {
          console.log("Google Analytics 4 initialized:", measurementId);
        }

        return api;
      });

      return transport.then(() => undefined);
    },
    event(event: AnalyticsEvent) {
      send(api => api.event(event.name, event.params));
    },
    pageView(view: PageViewEvent) {
      send(api => api.send({ hitType: "pageview", page: view.path, title: view.title }));
    },
    error(error: ErrorEvent) {
      send(api =>
        api.event("exception", {
          description: error.message,
          fatal: false,
          ...error.context,
        })
      );
    },
    performance(metric: PerformanceMetric) {
      send(api =>
        api.event("web_vitals", {
          metric_name: metric.name,
          metric_value: metric.value,
          metric_rating: metric.rating,
        })
      );
    },
  };
}
