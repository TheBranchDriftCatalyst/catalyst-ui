/**
 * Event tracking hooks
 * Provides utilities for tracking user interactions
 */

import { useCallback } from "react";
import { useAnalytics } from "@/catalyst-ui/contexts/Analytics";

/**
 * Hook to track custom events
 * @returns Object with tracking functions
 */
export const useEventTracking = () => {
  const analytics = useAnalytics();

  const trackClick = useCallback(
    (elementName: string, additionalData?: Record<string, any>) => {
      analytics.trackEvent("click", {
        element: elementName,
        ...additionalData,
      });
    },
    [analytics]
  );

  const trackFormSubmit = useCallback(
    (formName: string, success: boolean, additionalData?: Record<string, any>) => {
      analytics.trackEvent("form_submit", {
        form_name: formName,
        success,
        ...additionalData,
      });
    },
    [analytics]
  );

  const trackSearch = useCallback(
    (query: string, resultsCount?: number) => {
      analytics.trackEvent("search", {
        search_term: query,
        results_count: resultsCount,
      });
    },
    [analytics]
  );

  const trackDownload = useCallback(
    (fileName: string, fileType?: string) => {
      analytics.trackEvent("download", {
        file_name: fileName,
        file_type: fileType,
      });
    },
    [analytics]
  );

  const trackShare = useCallback(
    (content: string, method?: string) => {
      analytics.trackEvent("share", {
        content_type: content,
        share_method: method,
      });
    },
    [analytics]
  );

  return {
    trackClick,
    trackFormSubmit,
    trackSearch,
    trackDownload,
    trackShare,
    trackEvent: analytics.trackEvent,
  };
};
