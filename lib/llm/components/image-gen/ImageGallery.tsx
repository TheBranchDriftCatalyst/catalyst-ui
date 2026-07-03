/**
 * ImageGallery — responsive grid wrapper for GeneratedImageCard.
 *
 * Pure layout primitive — the consumer owns the list of items and
 * decides the click semantics. Default grid auto-fills with a min cell
 * width of 240px so the same component fits both narrow rails and
 * full-page galleries.
 */
import type { ReactNode } from "react";
import { cn } from "../shared/utils.js";

export interface ImageGalleryProps {
  /** Pre-rendered <GeneratedImageCard /> elements (or any ReactNodes). */
  children: ReactNode;
  /** Minimum cell width in pixels — drives auto-fill columns. Default 240. */
  minCellWidthPx?: number;
  /** Extra class names on the outer grid. */
  className?: string;
  /** Optional empty-state ReactNode rendered when children resolves empty. */
  emptyState?: ReactNode;
}

export function ImageGallery({
  children,
  minCellWidthPx = 240,
  className,
  emptyState,
}: ImageGalleryProps) {
  // We can't introspect children for emptiness in a strict-typed way that
  // works with arrays and fragments, so the caller passes an explicit
  // empty state and an opt-in render path. The minimum-column trick uses
  // an inline style so callers can keep tailwind clean.
  return (
    <div
      className={cn("grid gap-3", className)}
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${minCellWidthPx}px, 1fr))` }}
    >
      {children}
      {emptyState}
    </div>
  );
}
