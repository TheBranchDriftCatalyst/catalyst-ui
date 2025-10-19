/**
 * Analytics Context
 * Provides analytics functionality throughout the app
 */

import { createContext, useContext } from "react";
import type { AnalyticsContextValue } from "./types";

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  }
  return context;
};

export { AnalyticsContext };
