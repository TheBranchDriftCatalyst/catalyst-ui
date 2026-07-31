"use client";
import { Copy } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button, type ButtonProps } from "@/catalyst-ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/catalyst-ui/ui/dialog";
import { cn } from "@/catalyst-ui/utils";
import { createLogger } from "@/catalyst-ui/utils/logger";
import type { DonationContext, PaymentIntent } from "../types";
import { useMonetization } from "../useMonetization";
import { PaymentQR } from "./PaymentQR";

const log = createLogger("DonateButton");

/**
 * Props for {@link DonateButton}.
 *
 * @public
 */
export interface DonateButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  /** Adapter id registered on {@link MonetizationProvider}, e.g. `"bitcoin"`. */
  providerId: string;
  /** Amount in `currency` units. Ignored for adapters where `supportsAmount` is false. */
  amount?: number;
  /** ISO currency or `"BTC"`/`"SATS"`. Defaults to the provider's `defaultCurrency`. */
  currency?: string;
  /** Optional message attached to the payment (BIP-21 `message`, Venmo `note`, etc). */
  message?: string;
  /** Button label. Defaults to the adapter's `label`. */
  children?: ReactNode;
  /** Custom icon slot. Falls back to the adapter's `icon` if any. */
  icon?: ReactNode;
}

/**
 * Provider-agnostic donation button.
 *
 * Reads the adapter from the surrounding {@link MonetizationProvider}
 * and dispatches on `kind`:
 *
 * - `link` — renders a standard `<a target="_blank">` styled as a
 *   button (PayPal, Ko-fi, Venmo web URL).
 * - `crypto-address` — opens a dialog showing a QR + copy-able
 *   address (Bitcoin, Lightning).
 * - `deep-link` — same as `link` but hands off to a `venmo://`-style
 *   URI (mostly useful on mobile).
 * - `sdk-checkout` — calls `initiate()` on click, then displays the
 *   returned {@link PaymentIntent} in a dialog (Stripe, LNURL-pay).
 *
 * Returns `null` (with a dev-log warning) when the provider id is
 * unknown — this keeps composite widgets from crashing when a
 * consumer removes an adapter from their `providers` list without
 * updating downstream buttons.
 *
 * @example
 * ```tsx
 * <DonateButton providerId="bitcoin" amount={0.001} currency="BTC" />
 * <DonateButton providerId="paypal" amount={20} variant="outline" />
 * ```
 *
 * @public
 */
export function DonateButton({
  providerId,
  amount,
  currency,
  message,
  children,
  icon,
  className,
  ...buttonProps
}: DonateButtonProps) {
  const { getProvider, initiate, defaultCurrency } = useMonetization();
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  const [copied, setCopied] = useState(false);

  const provider = getProvider(providerId);
  if (!provider) {
    log.warn(`unknown providerId "${providerId}" — is it registered on MonetizationProvider?`);
    return null;
  }

  const ctx: DonationContext = {
    amount,
    currency: currency ?? defaultCurrency,
    message,
  };
  const btnLabel = children ?? provider.label;
  const btnIcon = icon ?? provider.icon;

  // --- link / deep-link: plain anchor
  if (provider.kind === "link" || provider.kind === "deep-link") {
    const info = provider.getDisplay?.(ctx);
    const href = info?.href ?? info?.uri;
    if (!href) {
      log.warn(`provider "${providerId}" of kind "${provider.kind}" produced no href/uri`);
      return null;
    }
    return (
      <Button asChild className={className} {...buttonProps}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {btnIcon}
          {btnLabel}
        </a>
      </Button>
    );
  }

  // --- shared copy helper
  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      log.warn("clipboard write failed", e);
    }
  };

  // --- crypto-address: dialog with QR + copyable address
  if (provider.kind === "crypto-address") {
    const info = provider.getDisplay?.(ctx);
    return (
      <>
        <Button onClick={() => setOpen(true)} className={className} {...buttonProps}>
          {btnIcon}
          {btnLabel}
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{provider.label}</DialogTitle>
              {info?.hint && <DialogDescription>{info.hint}</DialogDescription>}
            </DialogHeader>
            {info?.qrValue && (
              <div className="flex justify-center py-2">
                <PaymentQR value={info.qrValue} />
              </div>
            )}
            {info?.address && (
              <div className="flex items-center gap-2 rounded-md border bg-muted/40 p-2">
                <code className="flex-1 truncate font-mono text-xs">{info.address}</code>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(info.address!)}
                  aria-label="Copy address"
                >
                  <Copy className={cn("h-3.5 w-3.5", copied && "text-primary")} />
                </Button>
              </div>
            )}
            {copied && (
              <p className="text-center text-xs text-muted-foreground">Copied to clipboard</p>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // --- sdk-checkout: initiate on click, render PaymentIntent
  if (provider.kind === "sdk-checkout") {
    const handleClick = async () => {
      setOpen(true);
      setIntent(null);
      try {
        const result = await initiate(providerId, ctx);
        setIntent(result);
      } catch (e) {
        setIntent({
          status: "failed",
          error: e instanceof Error ? e.message : String(e),
        });
      }
    };
    const handleClose = (next: boolean) => {
      setOpen(next);
      if (!next) {
        void intent?.cancel?.();
        setIntent(null);
      }
    };
    return (
      <>
        <Button onClick={handleClick} className={className} {...buttonProps}>
          {btnIcon}
          {btnLabel}
        </Button>
        <Dialog open={open} onOpenChange={handleClose}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{provider.label}</DialogTitle>
            </DialogHeader>
            {!intent && <p className="text-sm text-muted-foreground">Preparing checkout…</p>}
            {intent?.status === "failed" && (
              <p className="text-sm text-destructive">{intent.error ?? "Payment failed"}</p>
            )}
            {intent?.qrValue && (
              <div className="flex justify-center py-2">
                <PaymentQR value={intent.qrValue} />
              </div>
            )}
            {intent?.externalUrl && (
              <Button asChild variant="outline">
                <a href={intent.externalUrl} target="_blank" rel="noopener noreferrer">
                  Open checkout
                </a>
              </Button>
            )}
            {intent?.status === "complete" && (
              <p className="text-center text-sm text-primary">Payment received.</p>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return null;
}
