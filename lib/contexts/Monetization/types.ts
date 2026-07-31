import type { ReactNode } from "react";

/**
 * Category of monetization provider — determines which methods the
 * adapter is expected to implement and how the widget renders it.
 *
 * - `crypto-address`: static wallet address + optional QR (Bitcoin on-chain).
 * - `link`: user is sent to an external URL (paypal.me, ko-fi.com).
 * - `deep-link`: URI-scheme handoff to a native app (venmo://, cashapp://).
 * - `sdk-checkout`: async flow that returns a {@link PaymentIntent}
 *   (Lightning LNURL, Stripe Checkout, PayPal Orders API).
 *
 * The kind drives which of `getDisplay` / `initiate` the widget calls.
 *
 * @public
 */
export type MonetizationKind = "crypto-address" | "link" | "deep-link" | "sdk-checkout";

/**
 * Runtime request for a payment.
 *
 * Adapters use this to shape the URI, invoice, or checkout session they
 * hand back to the widget. Every field is optional so widgets that don't
 * collect an amount (pure "here's my BTC address" flows) can still call
 * adapters uniformly.
 *
 * @public
 */
export interface DonationContext {
  /** Numeric amount in `currency` units (e.g. 20 for $20 USD, 0.001 for 0.001 BTC). */
  amount?: number;
  /** ISO-4217 fiat code or "BTC"/"SATS". Falls back to provider default. */
  currency?: string;
  /** Free-form message attached to the payment (BIP-21 `message`, Stripe metadata, etc). */
  message?: string;
  /** Adapter-specific extras. Never inspected by the library. */
  metadata?: Record<string, string>;
}

/**
 * Sync display info produced by an adapter's `getDisplay`.
 *
 * Any subset of fields may be present. `qrValue` is the string that
 * should be encoded into a QR — typically the same as `uri`.
 *
 * @public
 */
export interface DisplayInfo {
  /** Raw address / handle safe to show + copy (e.g. BTC address, `@handle`). */
  address?: string;
  /** URI to hand off to a wallet or app (bitcoin:..., lightning:..., venmo://...). */
  uri?: string;
  /** External URL to open in a new tab (paypal.me/user/20, ko-fi.com/user). */
  href?: string;
  /** String to encode as a QR code. Defaults to `uri ?? address`. */
  qrValue?: string;
  /** Optional short subtitle the widget may render under the address. */
  hint?: string;
}

/**
 * Status of an async payment initiated via `initiate()`.
 *
 * @public
 */
export type PaymentStatus = "pending" | "complete" | "failed" | "cancelled";

/**
 * Handle for an async payment flow.
 *
 * Returned by `initiate()` for `sdk-checkout` adapters. The widget uses
 * this to display a QR / checkout link and (optionally) poll for status.
 *
 * @public
 */
export interface PaymentIntent {
  status: PaymentStatus;
  /** External URL to open in a new tab (Stripe Checkout, LNURL callback). */
  externalUrl?: string;
  /** String to encode as a QR (BOLT11 invoice, Lightning URI). */
  qrValue?: string;
  /** Error message when status is `"failed"`. */
  error?: string;
  /** Adapter-provided cancel: aborts polling, revokes invoice, etc. */
  cancel?: () => void | Promise<void>;
  /**
   * Adapter-provided poll. Widgets call this on an interval to refresh
   * status. If omitted, the widget assumes fire-and-forget (user pays
   * in the external app, we never know it completed).
   */
  poll?: () => Promise<PaymentStatus>;
  /** Adapter-defined session id (invoice hash, checkout id). */
  sessionId?: string;
}

/**
 * Provider-agnostic monetization adapter.
 *
 * An adapter is a plain object — no React deps — that turns a
 * {@link DonationContext} into either static display info
 * (`getDisplay`) or an async payment session (`initiate`). Adapters
 * hold their own configuration (address, handle, API key) and are
 * pure data producers; rendering lives in widget components.
 *
 * ### Contract
 *
 * At least one of `getDisplay` or `initiate` MUST be defined. The
 * `kind` field tells the widget which is expected:
 *
 * | Kind             | getDisplay | initiate |
 * |------------------|:----------:|:--------:|
 * | `crypto-address` | required   | —        |
 * | `link`           | required   | —        |
 * | `deep-link`      | required   | —        |
 * | `sdk-checkout`   | —          | required |
 *
 * Lightning is the interesting hybrid: an adapter MAY implement both
 * (static BOLT11 invoice via `getDisplay`, LNURL-pay flow via
 * `initiate`) and let the widget pick based on which is present.
 *
 * @public
 */
export interface MonetizationAdapter<TConfig = unknown> {
  /** Stable machine id: `"bitcoin"`, `"lightning"`, `"paypal"`, ... */
  id: string;
  /** Human-facing label rendered by the widget. */
  label: string;
  /** Icon rendered by the widget (typically a lucide-react or simple-icons node). */
  icon?: ReactNode;
  /** Category — see {@link MonetizationKind}. */
  kind: MonetizationKind;
  /** ISO currency codes the adapter accepts. Empty/omitted = any. */
  currencies?: string[];
  /** Whether the adapter can encode a specific amount in its URI/session. */
  supportsAmount: boolean;
  /** Adapter-specific configuration (address, handle, API key). */
  config: TConfig;
  /** Sync display for `crypto-address` / `link` / `deep-link` adapters. */
  getDisplay?(ctx: DonationContext): DisplayInfo;
  /** Async checkout for `sdk-checkout` adapters. */
  initiate?(ctx: DonationContext): Promise<PaymentIntent>;
}
