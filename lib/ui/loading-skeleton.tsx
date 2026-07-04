/**
 * LoadingSkeleton — pulse-animated placeholder blocks for fetch-on-mount
 * routes and any surface that renders after data lands.
 *
 * Replaces the ad-hoc ``"loading…"`` text scattered through routes with
 * a consistent visual shape that hints at the eventual layout. Reuses
 * Tailwind's ``animate-pulse`` utility; respects
 * ``prefers-reduced-motion`` automatically via Tailwind's own a11y
 * variants (``motion-safe:`` / ``motion-reduce:`` — animate-pulse is
 * gated on ``motion-safe:`` in default Tailwind theming).
 *
 * Variants:
 *   - ``line`` — a single text-height bar (h-3)
 *   - ``box``  — a 1:1 solid block (aspect-square)
 *   - ``avatar`` — round dot (h-8 w-8)
 *   - ``card`` — larger rounded rectangle (h-24)
 *
 * ``count`` renders ``N`` copies stacked with ``space-y-2`` — useful for
 * list skeletons: ``<LoadingSkeleton variant="line" count={4} />``.
 */
import * as React from "react";

import { cn } from "@/catalyst-ui/utils";

export type LoadingSkeletonVariant = "line" | "box" | "avatar" | "card";

export interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: LoadingSkeletonVariant;
  /** Render N copies stacked with a small gap. Default 1. */
  count?: number;
  /** Overrides the default width class for the ``line`` variant. */
  width?: string;
}

const variantClass: Record<LoadingSkeletonVariant, string> = {
  line: "h-3 w-full rounded",
  box: "aspect-square w-full rounded",
  avatar: "h-8 w-8 rounded-full",
  card: "h-24 w-full rounded-md",
};

export function LoadingSkeleton({
  variant = "line",
  count = 1,
  width,
  className,
  ...props
}: LoadingSkeletonProps) {
  const items = Array.from({ length: Math.max(1, count) });
  return (
    <div className={cn("space-y-2", className)} aria-busy="true" {...props}>
      {items.map((_, i) => (
        <div
          key={i}
          className={cn("bg-muted motion-safe:animate-pulse", variantClass[variant], width)}
          // Vary the last line's width in list mode so the skeleton reads
          // as "text" rather than "N identical bars".
          style={
            variant === "line" && count > 1 && i === items.length - 1 ? { width: "70%" } : undefined
          }
        />
      ))}
    </div>
  );
}
