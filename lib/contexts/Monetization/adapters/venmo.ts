import type { DisplayInfo, DonationContext, MonetizationAdapter } from "../types";

/**
 * Configuration for the {@link venmo} adapter.
 *
 * @public
 */
export interface VenmoAdapterConfig {
  /**
   * Venmo username without the leading `@`. Not validated at runtime.
   */
  handle: string;
}

/**
 * Venmo link adapter.
 *
 * Produces a `venmo.com` URL with `txn=pay` prefill parameters. The
 * URL works on both desktop and mobile — mobile browsers redirect
 * into the native Venmo app automatically. A `venmo://` URI is also
 * emitted for consumers that want to use the deep-link form directly.
 *
 * ### Currency
 *
 * Venmo is USD-only. The adapter ignores `ctx.currency` and formats
 * the amount to two decimal places.
 *
 * ### CORS / CSRF
 *
 * Zero network calls from this adapter.
 *
 * @public
 */
export function venmo(config: VenmoAdapterConfig): MonetizationAdapter<VenmoAdapterConfig> {
  return {
    id: "venmo",
    label: "Venmo",
    kind: "link",
    supportsAmount: true,
    currencies: ["USD"],
    config,
    getDisplay(ctx: DonationContext): DisplayInfo {
      const params = new URLSearchParams({
        txn: "pay",
        audience: "public",
        recipients: config.handle,
      });
      if (ctx.amount != null) params.set("amount", ctx.amount.toFixed(2));
      if (ctx.message) params.set("note", ctx.message);
      const href = `https://venmo.com/?${params.toString()}`;
      const uri = `venmo://paycharge?${params.toString()}`;
      return {
        href,
        uri,
        hint: `@${config.handle}`,
      };
    },
  };
}
