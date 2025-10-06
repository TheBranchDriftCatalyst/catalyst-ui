"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/catalyst-ui/utils";

type ThumbShape = "circle" | "rectangle" | "rounded-rectangle";
type LabelPosition = "inside" | "outside";

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Show value label on thumb */
  showValue?: boolean;
  /** Format function for value display */
  formatValue?: (value: number) => string;
  /** Label mapping for discrete values (e.g., {1: "Novice", 2: "Beginner"}) */
  labels?: Record<number, string>;
  /** Thumb shape variant */
  thumbShape?: ThumbShape;
  /** Label position - inside the thumb or outside as tooltip */
  labelPosition?: LabelPosition;
}

const thumbShapeClasses: Record<ThumbShape, { default: string; withLabel: string }> = {
  circle: {
    default: "h-5 w-5 rounded-full",
    withLabel: "h-12 w-12 rounded-full",
  },
  rectangle: {
    default: "h-6 w-8 rounded-sm",
    withLabel: "h-10 w-16 rounded-sm",
  },
  "rounded-rectangle": {
    default: "h-6 w-10 rounded-md",
    withLabel: "h-10 w-20 rounded-md",
  },
};

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      showValue = false,
      formatValue,
      labels,
      thumbShape = "circle",
      labelPosition = "outside",
      ...props
    },
    ref,
  ) => {
    const value = props.value ?? props.defaultValue ?? [0];
    const displayValue = Array.isArray(value) ? value[0] : value;

    // Determine the formatted value based on labels or formatValue
    const formattedValue = React.useMemo(() => {
      if (labels && labels[displayValue]) {
        return labels[displayValue];
      }
      if (formatValue) {
        return formatValue(displayValue);
      }
      return displayValue.toString();
    }, [displayValue, labels, formatValue]);

    const showInsideLabel = showValue && labelPosition === "inside";
    const showOutsideLabel = showValue && labelPosition === "outside";
    const thumbClasses = showInsideLabel
      ? thumbShapeClasses[thumbShape].withLabel
      : thumbShapeClasses[thumbShape].default;

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center group",
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={cn(
            "flex items-center justify-center border-2 border-primary bg-background ring-offset-background transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            "hover:scale-110 active:scale-95",
            thumbClasses,
            showValue && "relative",
          )}
        >
          {/* Inside Label */}
          {showInsideLabel && (
            <span
              className={cn(
                "text-xs font-bold font-display tracking-tight uppercase",
                "text-primary pointer-events-none select-none",
                "leading-none px-1",
              )}
            >
              {formattedValue}
            </span>
          )}

          {/* Outside Label (Tooltip) */}
          {showOutsideLabel && (
            <span
              className={cn(
                "absolute -top-10 left-1/2 -translate-x-1/2",
                "px-3 py-1.5 rounded-md text-xs font-semibold",
                "bg-primary text-primary-foreground shadow-lg",
                "whitespace-nowrap pointer-events-none",
                "opacity-0 transition-opacity duration-200",
                "group-hover:opacity-100",
                "border border-primary/20",
              )}
            >
              {formattedValue}
            </span>
          )}
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
export type { ThumbShape, LabelPosition };
