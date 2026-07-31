"use client";
import { useMemo, type ReactNode } from "react";
import { MonetizationContext, type MonetizationContextValue } from "./MonetizationContext";
import type { MonetizationAdapter } from "./types";

/**
 * Props for {@link MonetizationProvider}.
 *
 * @public
 */
export interface MonetizationProviderProps {
  /**
   * Adapters to register, in display order. Duplicate `id`s are not
   * allowed — the last one wins in the lookup map and a dev warning
   * is emitted. Pass adapter instances from `contexts/Monetization/adapters`
   * (or your own custom adapter conforming to {@link MonetizationAdapter}).
   */
  providers: MonetizationAdapter[];
  /**
   * Default currency for widgets that don't override it. Adapters that
   * don't accept this currency will either convert (if configured with
   * a price oracle) or omit the amount from their URI.
   *
   * @defaultValue `"USD"`
   */
  defaultCurrency?: string;
  children?: ReactNode;
}

/**
 * Root provider for the monetization system.
 *
 * Register once near your app root (typically alongside
 * `CatalystProvider` / `ThemeProvider`), then consume adapters and
 * async checkout via {@link useMonetization} anywhere below.
 *
 * @example Donation setup with Bitcoin + PayPal + Venmo
 * ```tsx
 * import {
 *   MonetizationProvider,
 *   adapters,
 * } from "@/catalyst-ui/contexts/Monetization";
 *
 * <MonetizationProvider
 *   providers={[
 *     adapters.bitcoin({ address: "bc1q...", label: "Support the work" }),
 *     // adapters.paypal({ handle: "yourname" }),
 *     // adapters.venmo({ handle: "yourname" }),
 *   ]}
 *   defaultCurrency="USD"
 * >
 *   <App />
 * </MonetizationProvider>
 * ```
 *
 * @public
 */
export const MonetizationProvider = ({
  providers,
  defaultCurrency = "USD",
  children,
}: MonetizationProviderProps) => {
  const value = useMemo<MonetizationContextValue>(() => {
    const byId = new Map<string, MonetizationAdapter>();
    for (const p of providers) {
      if (byId.has(p.id) && typeof console !== "undefined") {
        console.warn(
          `[MonetizationProvider] duplicate provider id "${p.id}" — the last registration wins.`
        );
      }
      byId.set(p.id, p);
    }
    return {
      providers,
      defaultCurrency,
      getProvider: id => byId.get(id),
      initiate: async (id, ctx) => {
        const p = byId.get(id);
        if (!p) {
          throw new Error(`[MonetizationProvider] unknown provider id: "${id}"`);
        }
        if (!p.initiate) {
          throw new Error(
            `[MonetizationProvider] provider "${id}" (kind=${p.kind}) does not implement initiate(); use getProvider(id).getDisplay(ctx) instead.`
          );
        }
        return p.initiate({ currency: defaultCurrency, ...ctx });
      },
    };
  }, [providers, defaultCurrency]);

  return <MonetizationContext.Provider value={value}>{children}</MonetizationContext.Provider>;
};

export default MonetizationProvider;
