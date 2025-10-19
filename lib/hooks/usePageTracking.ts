/**
 * Page tracking hook
 * Automatically tracks page views when path changes
 */

import { useEffect } from "react";
import { useAnalytics } from "@/catalyst-ui/contexts/Analytics";

/**
 * Hook to automatically track page views
 * @param path - Current page path
 * @param title - Optional page title
 */
export const usePageTracking = (path: string, title?: string) => {
  const analytics = useAnalytics();

  useEffect(() => {
    if (analytics.isInitialized) {
      analytics.trackPageView(path, title);
    }
  }, [path, title, analytics]);
};
