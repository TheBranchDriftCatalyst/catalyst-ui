import type { DisplayInfo, MonetizationAdapter } from "../types";

/**
 * Configuration for the {@link kofi} adapter.
 *
 * @public
 */
export interface KofiAdapterConfig {
  /**
   * Your Ko-fi handle — the part after `ko-fi.com/`. Not validated
   * at runtime.
   */
  handle: string;
}

/**
 * Ko-fi hosted-page adapter.
 *
 * Ko-fi handles amount selection, currency, receipts, and recurring
 * memberships on their own page. This adapter is intentionally a
 * one-line redirect — `supportsAmount: false` because the amount
 * picker lives on ko-fi.com. Consumers that want an in-app amount
 * input should use `paypal` or `bitcoin` instead.
 *
 * ### CORS / CSRF
 *
 * Zero network calls from this adapter.
 *
 * @public
 */
export function kofi(config: KofiAdapterConfig): MonetizationAdapter<KofiAdapterConfig> {
  return {
    id: "kofi",
    label: "Ko-fi",
    kind: "link",
    supportsAmount: false,
    config,
    getDisplay(): DisplayInfo {
      return {
        href: `https://ko-fi.com/${encodeURIComponent(config.handle)}`,
        hint: `ko-fi.com/${config.handle}`,
      };
    },
  };
}
