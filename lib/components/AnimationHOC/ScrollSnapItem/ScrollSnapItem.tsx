import * as React from "react";
import { cn } from "@/catalyst-ui/utils";

export interface ScrollSnapItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alignment point for snapping */
  align?: "start" | "center" | "end" | "none";
  /** Offset from top (useful for sticky headers) */
  offset?: number;
  /** Whether scroll should stop at this element */
  stop?: "normal" | "always";
  /** Children to render */
  children: React.ReactNode;
  /** Additional class names */
  className?: string;
}

/**
 * ScrollSnapItem - HOC for marking scroll snap points
 *
 * Wraps an element to make it a scroll snap point within a ScrollSnapContainer.
 * Typically used to wrap Card components for smooth scrolling.
 *
 * @example
 * ```tsx
 * <ScrollSnapItem align="start" offset={80}>
 *   <Card>Content that snaps to viewport</Card>
 * </ScrollSnapItem>
 * ```
 */
export const ScrollSnapItem = React.forwardRef<HTMLDivElement, ScrollSnapItemProps>(
  (
    {
      align = "start",
      offset = 0,
      stop = "normal",
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          scrollSnapAlign: align === "none" ? undefined : align,
          scrollMarginTop: offset > 0 ? `${offset}px` : undefined,
          scrollSnapStop: stop,
          // Ensure snap points are respected even with spacing
          marginBottom: '1rem',
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollSnapItem.displayName = "ScrollSnapItem";
