"use client";
import { createContext } from "react";
import type { DonationContext, MonetizationAdapter, PaymentIntent } from "./types";

/**
 * Value exposed by {@link MonetizationContext}.
 *
 * @public
 */
export interface MonetizationContextValue {
  /** All adapters registered on the provider, in the order supplied. */
  providers: MonetizationAdapter[];
  /** Default currency used when a {@link DonationContext} omits one. */
  defaultCurrency: string;
  /** Lookup helper. Returns `undefined` for unknown ids. */
  getProvider: (id: string) => MonetizationAdapter | undefined;
  /**
   * Kick off an async checkout on the named adapter. Throws if the
   * adapter is unknown or does not implement `initiate()`.
   */
  initiate: (id: string, ctx: DonationContext) => Promise<PaymentIntent>;
}

/**
 * React context for provider-agnostic monetization.
 *
 * Consumers should use {@link useMonetization} instead of reading this
 * directly — the hook enforces that a provider is present.
 *
 * @public
 */
export const MonetizationContext = createContext<MonetizationContextValue | null>(null);
