"use client";
import * as React from "react";
import { cn } from "@/catalyst-ui/utils";

export interface LabeledStatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Small uppercased key rendered above the value. */
  label: string;
  /** The stat's value. Rendered in monospace by default for numeric /
   *  technical readouts (byte counts, durations, ids); pass any node
   *  when you need custom composition. */
  value: React.ReactNode;
  /** Left (default) or right-align the label+value stack. */
  align?: "left" | "right";
  /** `mono` (default) renders the value in tabular monospace — the shape
   *  built for panels of technical readouts. `text` uses the ambient sans
   *  for prose-y values. */
  variant?: "mono" | "text";
}

/**
 * LabeledStat — small "LABEL" over "value" cell used in detail panels,
 * status grids, and audit views. Complements `StatBar` (a slider-style
 * progress readout) and `CircularGauge` (a 0-100 ring); LabeledStat is the
 * plain textual equivalent for arbitrary values (durations, byte counts,
 * relative timestamps).
 *
 * **When to reach for it:**
 * - Grid of derived-status fields (gap_seconds, last-refresh, table size)
 * - Import run detail (rows imported, HTTP requests, elapsed)
 * - Any panel where a `label + value` pair reads better than a table cell
 *
 * @example
 * ```tsx
 * <LabeledStat label="Rows imported" value="12,441" />
 * <LabeledStat label="Elapsed" value="3h 17m" align="right" />
 * <LabeledStat label="Provider" value="wakatime.com" variant="text" />
 * ```
 */
export function LabeledStat({
  label,
  value,
  align = "left",
  variant = "mono",
  className,
  ...props
}: LabeledStatProps) {
  return (
    <div className={cn(align === "right" && "text-right", className)} {...props}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 text-sm font-medium", variant === "mono" && "font-mono")}>{value}</p>
    </div>
  );
}
