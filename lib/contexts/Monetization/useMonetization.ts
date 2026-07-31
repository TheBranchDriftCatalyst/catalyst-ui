"use client";
import { useContext } from "react";
import { MonetizationContext, type MonetizationContextValue } from "./MonetizationContext";

/**
 * Hook to consume the monetization context.
 *
 * Throws if used outside {@link MonetizationProvider} so misconfigured
 * trees surface the error immediately rather than silently rendering
 * empty donation widgets.
 *
 * @public
 */
export const useMonetization = (): MonetizationContextValue => {
  const ctx = useContext(MonetizationContext);
  if (!ctx) {
    throw new Error(
      "useMonetization() must be used inside <MonetizationProvider>. " +
        "Wrap your app (or the subtree containing donation widgets) with the provider."
    );
  }
  return ctx;
};
