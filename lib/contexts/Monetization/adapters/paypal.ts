import type { DisplayInfo, DonationContext, MonetizationAdapter } from "../types";

/**
 * Configuration for the {@link paypal} adapter.
 *
 * @public
 */
export interface PayPalAdapterConfig {
  /**
   * Your PayPal.me handle — the part after `paypal.me/`. Do not
   * include the leading slash. Not validated at runtime.
   */
  handle: string;
}

/**
 * PayPal.me link adapter.
 *
 * Produces a URL of the form `https://paypal.me/<handle>/<amount><CUR>`
 * when an amount is supplied, or `https://paypal.me/<handle>` otherwise.
 * PayPal.me accepts most major currencies as an ISO code suffix appended
 * to the numeric amount (e.g. `/20USD`, `/15EUR`).
 *
 * ### Why not the hosted Donate SDK?
 *
 * The hosted `PayPal.Donation.Button` SDK requires a merchant account
 * and business ID, injects a script, and has its own iframe / popup
 * lifecycle. PayPal.me covers the donation use case without any SDK,
 * matches the "link" kind, and works from a static site.
 *
 * ### CORS / CSRF
 *
 * Zero network calls from this adapter. The user is redirected to
 * paypal.me and completes payment there.
 *
 * @public
 */
export function paypal(config: PayPalAdapterConfig): MonetizationAdapter<PayPalAdapterConfig> {
  return {
    id: "paypal",
    label: "PayPal",
    kind: "link",
    supportsAmount: true,
    currencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK"],
    config,
    getDisplay(ctx: DonationContext): DisplayInfo {
      const base = `https://paypal.me/${encodeURIComponent(config.handle)}`;
      let href = base;
      if (ctx.amount != null) {
        const cur = (ctx.currency ?? "USD").toUpperCase();
        href = `${base}/${ctx.amount}${cur}`;
      }
      return {
        href,
        hint: `paypal.me/${config.handle}`,
      };
    },
  };
}
