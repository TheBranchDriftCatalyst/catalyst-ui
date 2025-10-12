import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/catalyst-ui/utils";

/**
 * Badge variants configuration using class-variance-authority
 *
 * Defines visual styles for badge variants with pill-shaped borders and hover effects.
 * All variants include smooth color transitions and focus ring support for accessibility.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Props for the Badge component
 *
 * Extends standard HTML div attributes with badge-specific styling variants.
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge - Small label for status, categories, or counts
 *
 * A compact, pill-shaped badge component for displaying status indicators, tags, categories,
 * or notification counts. Features multiple color variants and smooth hover transitions.
 * Renders as an inline element that flows with text.
 *
 * **Variants:**
 * - `default` - Primary badge with theme colors (blue/purple)
 * - `secondary` - Muted badge for less prominent labels (gray)
 * - `destructive` - Error or warning badge (red)
 * - `outline` - Border-only badge for subtle emphasis
 *
 * **Use cases:**
 * - Status indicators (Active, Pending, Completed)
 * - Category tags (TypeScript, React, Documentation)
 * - Notification counts (3 unread, 12 new)
 * - Feature flags (Beta, New, Premium)
 *
 * @example
 * ```tsx
 * // Status badge
 * <Badge variant="default">Active</Badge>
 *
 * // Category tag
 * <Badge variant="secondary">TypeScript</Badge>
 *
 * // Error indicator
 * <Badge variant="destructive">Failed</Badge>
 *
 * // Outline badge
 * <Badge variant="outline">Draft</Badge>
 *
 * // Custom styling with notification count
 * <Badge className="ml-2">
 *   3 new
 * </Badge>
 * ```
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
