"use client";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/catalyst-ui/utils";

/**
 * Props for {@link PaymentQR}.
 *
 * @public
 */
export interface PaymentQRProps {
  /** String encoded into the QR — usually a `bitcoin:`, `lightning:`, or `venmo://` URI. */
  value: string;
  /** Pixel size of the rendered SVG. @defaultValue `200` */
  size?: number;
  /** Extra classes applied to the outer white-background wrapper. */
  className?: string;
  /** QR foreground color (the dark modules). @defaultValue `"#000000"` */
  fgColor?: string;
  /** QR background color. @defaultValue `"#FFFFFF"` */
  bgColor?: string;
  /**
   * Quiet-zone margin in modules around the QR. @defaultValue `2`
   * QR spec requires ≥4 for max scanner reliability, but the wrapper
   * div already provides visual padding so 2 is a good compromise.
   */
  marginSize?: number;
  /**
   * Error-correction level. @defaultValue `"M"` (15% recovery)
   * Use `"H"` (30%) if the QR will be printed or overlaid with a logo.
   */
  level?: "L" | "M" | "Q" | "H";
}

/**
 * Renders a scannable QR code for a payment URI.
 *
 * Wraps `qrcode.react`'s `QRCodeSVG` in a white-background container so
 * it stays scannable on any theme (dark themes would otherwise invert
 * the QR modules and break scanners). The wrapper always has a light
 * background regardless of `bgColor` — override with `className` if
 * you really need a themed background.
 *
 * @example
 * ```tsx
 * const { getProvider } = useMonetization();
 * const info = getProvider("bitcoin")?.getDisplay?.({ amount: 0.001 });
 * return info?.qrValue ? <PaymentQR value={info.qrValue} /> : null;
 * ```
 *
 * @public
 */
export function PaymentQR({
  value,
  size = 200,
  className,
  fgColor,
  bgColor,
  marginSize = 2,
  level = "M",
}: PaymentQRProps) {
  return (
    <div className={cn("inline-flex rounded-md bg-white p-3", className)}>
      <QRCodeSVG
        value={value}
        size={size}
        fgColor={fgColor}
        bgColor={bgColor}
        marginSize={marginSize}
        level={level}
      />
    </div>
  );
}
