import { useEffect, useState, useCallback } from "react";
import { createLogger } from "@/catalyst-ui/utils/logger";

const log = createLogger("useWebVitals");

/**
 * WebVitalMetric - Individual Core Web Vital measurement
 *
 * @property name - The metric type (LCP, INP, CLS, FCP, or TTFB)
 * @property value - The measured value in milliseconds (or unitless for CLS)
 * @property rating - Performance classification based on Google's thresholds
 * @property delta - Change since last measurement
 * @property id - Unique identifier for this measurement instance
 */
export interface WebVitalMetric {
  name: "LCP" | "INP" | "CLS" | "FCP" | "TTFB";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
}

/**
 * UseWebVitalsOptions - Configuration for the useWebVitals hook
 *
 * @property enableConsoleLog - Log metrics to console (default: false)
 * @property enableDetailedLog - Show detailed metric breakdown in logs (default: false)
 * @property onMetric - Callback invoked when each metric is collected
 */
export interface UseWebVitalsOptions {
  enableConsoleLog?: boolean;
  enableDetailedLog?: boolean;
  onMetric?: (metric: WebVitalMetric) => void;
}

/**
 * UseWebVitalsReturn - Return value from the useWebVitals hook
 *
 * @property metrics - Map of all collected metrics, keyed by metric name
 * @property latestMetric - Most recently collected metric (null if none yet)
 * @property aggregateRating - Overall performance rating (worst metric wins)
 * @property clear - Function to reset all collected metrics
 */
export interface UseWebVitalsReturn {
  metrics: Map<string, WebVitalMetric>;
  latestMetric: WebVitalMetric | null;
  aggregateRating: "good" | "needs-improvement" | "poor";
  clear: () => void;
}

/**
 * useWebVitals - Monitors Core Web Vitals performance metrics in development
 *
 * This hook collects and tracks the five Core Web Vitals metrics (LCP, INP, CLS, FCP, TTFB)
 * using Google's official web-vitals library. It provides real-time performance monitoring
 * with automatic rating classification (good/needs-improvement/poor).
 *
 * The hook only operates in development mode (DEV) to avoid impacting production performance.
 * It can log metrics to the console and/or send them to custom analytics endpoints.
 *
 * **Core Web Vitals tracked:**
 * - **LCP** (Largest Contentful Paint) - Loading performance
 * - **INP** (Interaction to Next Paint) - Interactivity/responsiveness
 * - **CLS** (Cumulative Layout Shift) - Visual stability
 * - **FCP** (First Contentful Paint) - Initial paint time
 * - **TTFB** (Time to First Byte) - Server response time
 *
 * @param options - Configuration options for logging and callbacks
 * @param options.enableConsoleLog - Whether to log metrics to console (default: false)
 * @param options.enableDetailedLog - Whether to show detailed metric info (default: false)
 * @param options.onMetric - Callback invoked when each metric is collected
 * @returns Object containing metrics state and control functions
 *
 * @example
 * ```tsx
 * // Basic usage with console logging
 * function PerformanceMonitor() {
 *   const { metrics, latestMetric, aggregateRating } = useWebVitals({
 *     enableConsoleLog: true,
 *   });
 *
 *   return (
 *     <div>
 *       <h3>Performance: {aggregateRating}</h3>
 *       {latestMetric && (
 *         <p>
 *           Latest: {latestMetric.name} = {latestMetric.value.toFixed(2)}
 *         </p>
 *       )}
 *       <p>Total metrics collected: {metrics.size}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Send metrics to analytics service
 * function AnalyticsIntegration() {
 *   const { metrics, aggregateRating } = useWebVitals({
 *     onMetric: (metric) => {
 *       // Send to your analytics platform
 *       analytics.track('web-vital', {
 *         name: metric.name,
 *         value: metric.value,
 *         rating: metric.rating,
 *         id: metric.id,
 *       });
 *     },
 *   });
 *
 *   return <div>Overall Rating: {aggregateRating}</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Display all metrics with detailed breakdown
 * function DetailedMetrics() {
 *   const { metrics, clear } = useWebVitals({
 *     enableConsoleLog: true,
 *     enableDetailedLog: true,
 *   });
 *
 *   return (
 *     <div>
 *       <h3>All Metrics</h3>
 *       <ul>
 *         {Array.from(metrics.values()).map((metric) => (
 *           <li key={metric.id}>
 *             <strong>{metric.name}:</strong> {metric.value.toFixed(2)}ms
 *             <span className={`rating-${metric.rating}`}>{metric.rating}</span>
 *           </li>
 *         ))}
 *       </ul>
 *       <button onClick={clear}>Clear Metrics</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns Object containing:
 * - `metrics` - Map of all collected metrics, keyed by metric name
 * - `latestMetric` - Most recently collected metric (or null)
 * - `aggregateRating` - Worst rating across all metrics (good/needs-improvement/poor)
 * - `clear` - Function to reset all collected metrics
 *
 * @note This hook only runs in development mode. In production builds, it will no-op
 * and return empty/default values to avoid performance overhead.
 *
 * @note The aggregateRating uses the "worst rating wins" strategy - if any metric is
 * "poor", the aggregate is "poor". If any is "needs-improvement", aggregate is
 * "needs-improvement". Only if all are "good" is the aggregate "good".
 *
 * @see https://web.dev/vitals/ - Google's Web Vitals documentation
 * @see https://github.com/GoogleChrome/web-vitals - Official web-vitals library
 */
export function useWebVitals(options: UseWebVitalsOptions = {}): UseWebVitalsReturn {
  const { enableConsoleLog = false, enableDetailedLog = false, onMetric } = options;

  const [metrics, setMetrics] = useState<Map<string, WebVitalMetric>>(new Map());
  const [latestMetric, setLatestMetric] = useState<WebVitalMetric | null>(null);
  const [aggregateRating, setAggregateRating] = useState<"good" | "needs-improvement" | "poor">(
    "good"
  );

  const handleMetric = useCallback(
    (metric: WebVitalMetric) => {
      // Update metrics Map
      setMetrics(prev => {
        const newMetrics = new Map(prev);
        newMetrics.set(metric.name, metric);
        return newMetrics;
      });

      setLatestMetric(metric);

      // Console logging
      if (enableConsoleLog) {
        const emoji =
          metric.rating === "good" ? "✅" : metric.rating === "needs-improvement" ? "⚠️" : "❌";

        if (enableDetailedLog) {
          log.debug(`${emoji} Web Vital: ${metric.name}`);
          log.debug(`Value: ${metric.value}`);
          log.debug(`Rating: ${metric.rating}`);
          log.debug(`Delta: ${metric.delta}`);
          log.debug(`ID: ${metric.id}`);
        } else {
          log.debug(`${emoji} ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`);
        }
      }

      // Custom callback
      if (onMetric) {
        onMetric(metric);
      }
    },
    [enableConsoleLog, enableDetailedLog, onMetric]
  );

  useEffect(() => {
    // Dynamically import web-vitals (development only)
    if (!import.meta.env.DEV) return;

    import("web-vitals").then(({ onLCP, onINP, onCLS, onFCP, onTTFB }) => {
      onLCP(metric => handleMetric(metric as unknown as WebVitalMetric));
      onINP(metric => handleMetric(metric as unknown as WebVitalMetric));
      onCLS(metric => handleMetric(metric as unknown as WebVitalMetric));
      onFCP(metric => handleMetric(metric as unknown as WebVitalMetric));
      onTTFB(metric => handleMetric(metric as unknown as WebVitalMetric));
    });
  }, [handleMetric]);

  // Calculate aggregate rating (worst rating wins)
  useEffect(() => {
    const ratings = Array.from(metrics.values()).map(m => m.rating);

    if (ratings.includes("poor")) {
      setAggregateRating("poor");
    } else if (ratings.includes("needs-improvement")) {
      setAggregateRating("needs-improvement");
    } else {
      setAggregateRating("good");
    }
  }, [metrics]);

  const clear = useCallback(() => {
    setMetrics(new Map());
    setLatestMetric(null);
    setAggregateRating("good");
  }, []);

  return {
    metrics,
    latestMetric,
    aggregateRating,
    clear,
  };
}
