import * as React from "react";
import { cn } from "@/catalyst-ui/utils";

export interface ScrollSnapContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Direction of scroll snapping */
  type?: "x" | "y" | "both" | "none";
  /** Snap behavior - proximity is more natural, mandatory is aggressive */
  behavior?: "proximity" | "mandatory";
  /** Enable smooth scrolling */
  smooth?: boolean;
  /** Offset from top for snap point (in pixels) */
  snapOffset?: number;
  /** Children to render */
  children: React.ReactNode;
  /** Additional class names */
  className?: string;
}

/**
 * ScrollSnapContainer - HOC for enabling CSS scroll snap on a container
 *
 * Wraps a scrolling area to enable snap points for child elements.
 * Use with ScrollSnapItem to create smooth card-to-card scrolling.
 *
 * @example
 * ```tsx
 * <ScrollSnapContainer type="y" behavior="proximity" snapOffset={10}>
 *   <ScrollSnapItem><Card>1</Card></ScrollSnapItem>
 *   <ScrollSnapItem><Card>2</Card></ScrollSnapItem>
 * </ScrollSnapContainer>
 * ```
 */
export const ScrollSnapContainer = React.forwardRef<HTMLDivElement, ScrollSnapContainerProps>(
  (
    {
      type = "y",
      behavior = "proximity",
      smooth = true,
      snapOffset = 10,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const scrollSnapType = type === "none"
      ? undefined
      : `${type} ${behavior}`;

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          scrollSnapType,
          scrollBehavior: smooth ? "smooth" : undefined,
          scrollPaddingTop: snapOffset ? `${snapOffset}px` : undefined,
          overflowY: type === "y" || type === "both" ? "auto" : undefined,
          overflowX: type === "x" || type === "both" ? "auto" : undefined,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollSnapContainer.displayName = "ScrollSnapContainer";
