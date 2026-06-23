"use client";

import * as React from "react";
import { cn } from "@/catalyst-ui/utils";

/**
 * Props for {@link SimpleGrid}
 *
 * @public
 */
export interface SimpleGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns, or a responsive object mapping breakpoint -> columns.
   * Defaults to a sensible responsive default (1 -> 2 -> 3 columns).
   *
   * @example
   * ```tsx
   * <SimpleGrid columns={3}>...</SimpleGrid>
   * <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }}>...</SimpleGrid>
   * ```
   */
  columns?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number };

  /**
   * Gap between grid items, mapped to Tailwind's spacing scale (e.g. 4 -> gap-4).
   * Defaults to `4`.
   */
  gap?: number;
}

const columnsToClasses = (columns: SimpleGridProps["columns"]): string => {
  if (columns == null) {
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  }
  if (typeof columns === "number") {
    return `grid-cols-${columns}`;
  }
  const parts: string[] = [];
  if (columns.base != null) parts.push(`grid-cols-${columns.base}`);
  if (columns.sm != null) parts.push(`sm:grid-cols-${columns.sm}`);
  if (columns.md != null) parts.push(`md:grid-cols-${columns.md}`);
  if (columns.lg != null) parts.push(`lg:grid-cols-${columns.lg}`);
  if (columns.xl != null) parts.push(`xl:grid-cols-${columns.xl}`);
  return parts.join(" ");
};

/**
 * A lightweight responsive CSS-Grid container.
 *
 * @remarks
 * Renders a `div` with `display: grid` and the requested column / gap config
 * applied via Tailwind utility classes. Pass any other div props (id, style,
 * onClick, etc.) and they are forwarded.
 *
 * @example
 * ```tsx
 * <SimpleGrid columns={3} gap={6}>
 *   <Card />
 *   <Card />
 *   <Card />
 * </SimpleGrid>
 * ```
 *
 * @public
 */
export const SimpleGrid = React.forwardRef<HTMLDivElement, SimpleGridProps>(
  ({ columns, gap = 4, className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("grid", columnsToClasses(columns), `gap-${gap}`, className)}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
SimpleGrid.displayName = "SimpleGrid";

export default SimpleGrid;
