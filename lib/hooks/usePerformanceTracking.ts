/**
 * Performance tracking hooks
 * Provides utilities for tracking component performance
 */

import { useEffect, useRef } from "react";
import { useAnalytics } from "@/catalyst-ui/contexts/Analytics";

/**
 * Hook to track component render time
 * @param componentName - Name of the component
 */
export const useComponentPerformance = (componentName: string) => {
  const analytics = useAnalytics();
  const renderStartRef = useRef<number>(0);

  useEffect(() => {
    renderStartRef.current = performance.now();

    return () => {
      const renderTime = performance.now() - renderStartRef.current;

      if (analytics.isInitialized && renderTime > 0) {
        analytics.trackPerformance({
          name: `component_render_${componentName}`,
          value: renderTime,
          timestamp: Date.now(),
          rating: renderTime < 16 ? "good" : renderTime < 50 ? "needs-improvement" : "poor",
        });
      }
    };
  }, [componentName, analytics]);
};

/**
 * Hook to track API call performance
 * @returns Function to track API calls
 */
export const useApiPerformance = () => {
  const analytics = useAnalytics();

  const trackApiCall = (
    url: string,
    method: string,
    startTime: number,
    success: boolean,
    statusCode?: number
  ) => {
    const duration = performance.now() - startTime;

    analytics.trackPerformance({
      name: `api_call_${method}_${url}`,
      value: duration,
      timestamp: Date.now(),
      rating: duration < 100 ? "good" : duration < 300 ? "needs-improvement" : "poor",
    });

    analytics.trackEvent("api_call", {
      url,
      method,
      duration,
      success,
      status_code: statusCode,
    });
  };

  return { trackApiCall };
};

/**
 * Hook to track custom performance marks
 * @param markName - Name of the performance mark
 */
export const usePerformanceMark = (markName: string) => {
  const analytics = useAnalytics();

  const mark = (action: "start" | "end") => {
    const fullMarkName = `${markName}_${action}`;
    performance.mark(fullMarkName);

    if (action === "end") {
      const startMarkName = `${markName}_start`;
      try {
        performance.measure(markName, startMarkName, fullMarkName);
        const measure = performance.getEntriesByName(markName)[0];

        if (measure && analytics.isInitialized) {
          analytics.trackPerformance({
            name: markName,
            value: measure.duration,
            timestamp: Date.now(),
            rating:
              measure.duration < 100
                ? "good"
                : measure.duration < 300
                  ? "needs-improvement"
                  : "poor",
          });
        }

        // Clean up marks and measures
        performance.clearMarks(startMarkName);
        performance.clearMarks(fullMarkName);
        performance.clearMeasures(markName);
      } catch (error) {
        console.warn("Performance measurement failed:", error);
      }
    }
  };

  return { mark };
};
