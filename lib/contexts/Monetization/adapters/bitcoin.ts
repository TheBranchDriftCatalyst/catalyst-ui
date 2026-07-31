import type { DisplayInfo, DonationContext, MonetizationAdapter } from "../types";

/**
 * Configuration for the {@link bitcoin} adapter.
 *
 * @public
 */
export interface BitcoinAdapterConfig {
  /**
   * Bitcoin on-chain address in any format (legacy `1...`, P2SH `3...`,
   * bech32 `bc1q...`, taproot `bc1p...`). Not validated at runtime —
   * the value is passed verbatim into a BIP-21 URI and copied to the
   * clipboard by widgets.
   */
  address: string;
  /**
   * Optional label baked into the BIP-21 URI. Receiving wallets
   * typically show this alongside the transaction (e.g. "Support DJ").
   */
  label?: string;
}

/**
 * Bitcoin on-chain adapter.
 *
 * Produces a BIP-21 URI (`bitcoin:<address>?amount=<btc>&label=<label>&message=<msg>`)
 * suitable for encoding into a QR or opening in a wallet.
 *
 * ### Amount handling
 *
 * The BIP-21 `amount` param is denominated in BTC. This adapter passes
 * `ctx.amount` through verbatim **only when** `ctx.currency` is `"BTC"`
 * or omitted. For fiat amounts, resolve the conversion in the widget
 * layer and hand this adapter a `DonationContext` already denominated
 * in BTC — the library intentionally does not bundle a rate source.
 *
 * ### CORS / CSRF
 *
 * Zero network calls. No CSRF or CORS surface.
 *
 * @public
 */
export function bitcoin(config: BitcoinAdapterConfig): MonetizationAdapter<BitcoinAdapterConfig> {
  return {
    id: "bitcoin",
    label: "Bitcoin",
    kind: "crypto-address",
    supportsAmount: true,
    currencies: ["BTC"],
    config,
    getDisplay(ctx: DonationContext): DisplayInfo {
      const params = new URLSearchParams();
      const currency = ctx.currency ?? "BTC";
      if (ctx.amount != null && currency === "BTC") {
        params.set("amount", ctx.amount.toString());
      }
      if (config.label) params.set("label", config.label);
      if (ctx.message) params.set("message", ctx.message);
      const query = params.toString();
      const uri = `bitcoin:${config.address}${query ? `?${query}` : ""}`;
      return {
        address: config.address,
        uri,
        qrValue: uri,
      };
    },
  };
}
