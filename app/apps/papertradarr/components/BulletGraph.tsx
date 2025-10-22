/**
 * BulletGraph Component
 * Compact horizontal bullet chart for displaying metrics with context
 * Based on Stephen Few's bullet graph design
 */

import React from "react";
import { cn } from "@/catalyst-ui/utils";

interface BulletGraphProps {
  /**
   * Primary value to display
   */
  value: number;
  /**
   * Target/goal value for comparison
   */
  target?: number;
  /**
   * Maximum value for scale (defaults to target * 1.2 or value * 1.5)
   */
  max?: number;
  /**
   * Label for the metric
   */
  label: string;
  /**
   * Optional subtitle/description
   */
  subtitle?: string;
  /**
   * Format function for displaying values
   */
  formatValue?: (value: number) => string;
  /**
   * Qualitative ranges for background shading [poor, ok, good]
   * Each value is a percentage of max
   */
  ranges?: [number, number, number];
  /**
   * Color variant
   */
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

const variantColors = {
  default: {
    value: "bg-primary",
    target: "border-primary",
    poor: "bg-destructive/20",
    ok: "bg-muted",
    good: "bg-primary/20",
  },
  success: {
    value: "bg-green-500",
    target: "border-green-500",
    poor: "bg-red-500/20",
    ok: "bg-yellow-500/20",
    good: "bg-green-500/20",
  },
  warning: {
    value: "bg-yellow-500",
    target: "border-yellow-500",
    poor: "bg-red-500/20",
    ok: "bg-yellow-500/20",
    good: "bg-green-500/20",
  },
  danger: {
    value: "bg-red-500",
    target: "border-red-500",
    poor: "bg-red-500/20",
    ok: "bg-yellow-500/20",
    good: "bg-green-500/20",
  },
};

export function BulletGraph({
  value,
  target,
  max,
  label,
  subtitle,
  formatValue = v => v.toFixed(0),
  ranges = [0.33, 0.66, 1],
  variant = "default",
  className,
}: BulletGraphProps) {
  // Calculate max if not provided
  const computedMax = max || (target ? target * 1.2 : value * 1.5);

  // Calculate percentages
  const valuePercent = Math.min((value / computedMax) * 100, 100);
  const targetPercent = target ? Math.min((target / computedMax) * 100, 100) : undefined;

  // Qualitative ranges as percentages
  const [poorEnd, okEnd] = ranges;
  const poorPercent = poorEnd * 100;
  const okPercent = okEnd * 100;

  const colors = variantColors[variant];

  return (
    <div className={cn("space-y-2", className)}>
      {/* Header */}
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">{label}</div>
          {subtitle && <div className="text-xs text-muted-foreground truncate">{subtitle}</div>}
        </div>
        <div className="text-sm font-bold text-foreground">{formatValue(value)}</div>
      </div>

      {/* Bullet Graph */}
      <div className="relative h-6 rounded overflow-hidden border border-border">
        {/* Qualitative ranges (background) */}
        <div className="absolute inset-0 flex">
          <div className={cn("h-full", colors.poor)} style={{ width: `${poorPercent}%` }} />
          <div
            className={cn("h-full", colors.ok)}
            style={{ width: `${okPercent - poorPercent}%` }}
          />
          <div className={cn("h-full", colors.good)} style={{ width: `${100 - okPercent}%` }} />
        </div>

        {/* Value bar (foreground) */}
        <div
          className={cn("absolute inset-y-0 left-0 transition-all duration-300", colors.value)}
          style={{ width: `${valuePercent}%` }}
        />

        {/* Target marker */}
        {targetPercent !== undefined && (
          <div
            className="absolute inset-y-0 w-1 bg-background"
            style={{ left: `${targetPercent}%`, transform: "translateX(-50%)" }}
          >
            <div className={cn("h-full w-0.5 mx-auto border-2", colors.target)} />
          </div>
        )}
      </div>

      {/* Legend */}
      {target && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Target: {formatValue(target)}</span>
          <span>
            {value >= target ? "+" : ""}
            {formatValue(value - target)}
          </span>
        </div>
      )}
    </div>
  );
}
