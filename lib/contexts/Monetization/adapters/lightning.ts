import type { DisplayInfo, MonetizationAdapter } from "../types";

/**
 * Configuration for the {@link lightning} adapter.
 *
 * @public
 */
export interface LightningAdapterConfig {
  /**
   * LNURL string — either a bech32-encoded `LNURL1...` blob or the
   * plaintext HTTPS callback URL. Wallets accept both. If you have a
   * Lightning Address (`user@domain.com`), convert it to LNURL first
   * (LUD-16) before passing it here.
   */
  lnurl: string;
}

/**
 * Lightning Network static-QR adapter.
 *
 * Emits `lightning:<LNURL>` which wallets scan to open an LNURL-pay
 * flow (user picks the amount inside their wallet). This is the
 * evergreen, no-server-needed shape — no invoices to expire, no
 * webhooks required to display the QR.
 *
 * ### Amount handling
 *
 * `supportsAmount: false`. The amount is selected inside the user's
 * wallet after they scan. A future `initiate()` implementation could
 * do the LNURL-pay flow server-round-trip and return a bounded-amount
 * BOLT11 invoice via {@link PaymentIntent}, but that requires a
 * backend that (a) proxies the LNURL callback (CORS) and (b) tracks
 * invoice settlement — out of scope for v1.
 *
 * ### CORS / CSRF
 *
 * `getDisplay()` makes zero network calls. When `initiate()` lands,
 * it will `fetch()` the LNURL callback from the browser — many
 * LNURL servers set `Access-Control-Allow-Origin: *`, but self-hosted
 * ones may not. Consumer-supplied `proxyUrl` config field will be
 * added at that time.
 *
 * @public
 */
export function lightning(
  config: LightningAdapterConfig
): MonetizationAdapter<LightningAdapterConfig> {
  return {
    id: "lightning",
    label: "Lightning",
    kind: "crypto-address",
    supportsAmount: false,
    currencies: ["BTC", "SATS"],
    config,
    getDisplay(): DisplayInfo {
      const uri = `lightning:${config.lnurl}`;
      return {
        address: config.lnurl,
        uri,
        qrValue: uri,
        hint: "Scan with any Lightning wallet",
      };
    },
  };
}
