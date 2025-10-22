/**
 * Circular Gauge Component
 *
 * A compact circular progress indicator perfect for dashboard metrics.
 * Shows percentage value with colored ring and optional label.
 *
 * @module circular-gauge
 */
import * as React from "react";
import { cn } from "@/catalyst-ui/utils";

export interface CircularGaugeProps {
  /** Current value (0-100) */
  value: number;
  /** Maximum value for the gauge (default: 100) */
  max?: number;
  /** Gauge size in pixels (default: 64) */
  size?: number;
  /** Stroke width in pixels (default: 6) */
  strokeWidth?: number;
  /** Label to display below the value */
  label?: string;
  /** Color variant */
  variant?: "default" | "success" | "warning" | "danger" | "info";
  /** Additional CSS classes */
  className?: string;
  /** Show percentage symbol (default: true) */
  showPercent?: boolean;
}

const variantColors = {
  default: { stroke: "stroke-primary", bg: "stroke-muted" },
  success: { stroke: "stroke-green-500", bg: "stroke-muted" },
  warning: { stroke: "stroke-yellow-500", bg: "stroke-muted" },
  danger: { stroke: "stroke-red-500", bg: "stroke-muted" },
  info: { stroke: "stroke-blue-500", bg: "stroke-muted" },
};

/**
 * CircularGauge - Compact circular progress indicator
 *
 * Perfect for dashboard metrics, showing percentage completion
 * with a colored ring and centered value display.
 *
 * @example
 * ```tsx
 * <CircularGauge value={75} label="Temperature" variant="warning" />
 * ```
 */
export function CircularGauge({
  value,
  max = 100,
  size = 64,
  strokeWidth = 6,
  label,
  variant = "default",
  className,
  showPercent = true,
}: CircularGaugeProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const colors = variantColors[variant];

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={colors.bg}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={cn(colors.stroke, "transition-all duration-500 ease-out")}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        {/* Centered value text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold tabular-nums">
            {Math.round(percentage)}
            {showPercent && "%"}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs text-muted-foreground text-center max-w-[80px] truncate">
          {label}
        </span>
      )}
    </div>
  );
}
