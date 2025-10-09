import { useEffect, useState, useCallback } from "react";
import { createLogger } from "@/catalyst-ui/utils/logger";

const log = createLogger("useWebVitals");

export interface WebVitalMetric {
  name: "LCP" | "INP" | "CLS" | "FCP" | "TTFB";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
}

export interface UseWebVitalsOptions {
  enableConsoleLog?: boolean;
  enableDetailedLog?: boolean;
  onMetric?: (metric: WebVitalMetric) => void;
}

export interface UseWebVitalsReturn {
  metrics: Map<string, WebVitalMetric>;
  latestMetric: WebVitalMetric | null;
  aggregateRating: "good" | "needs-improvement" | "poor";
  clear: () => void;
}

/**
 * Hook for monitoring Core Web Vitals
 *
 * Collects LCP, INP, CLS, FCP, TTFB metrics using Google's web-vitals library.
 *
 * @param options - Configuration options
 * @returns Object containing metrics Map, latest metric, aggregate rating, and clear function
 *
 * @example
 * ```tsx
 * const { metrics, latestMetric, aggregateRating } = useWebVitals({
 *   enableConsoleLog: true,
 *   onMetric: (metric) => {
 *     // Send to analytics
 *     analytics.track('web-vital', metric);
 *   }
 * });
 * ```
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
