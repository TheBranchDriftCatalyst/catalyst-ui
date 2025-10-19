/**
 * SEO Context
 * React context for SEO metadata management
 */

import { createContext, useContext } from "react";
import type { SEOContextValue } from "./types";

const SEOContext = createContext<SEOContextValue | null>(null);

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error("useSEO must be used within SEOProvider");
  }
  return context;
};

export { SEOContext };
