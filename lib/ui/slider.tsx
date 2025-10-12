"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/catalyst-ui/utils";

/**
 * Thumb shape variants for the slider
 */
type ThumbShape = "circle" | "rectangle" | "rounded-rectangle";

/**
 * Label position variants for value display
 */
type LabelPosition = "inside" | "outside";

/**
 * Props for the Slider component
 *
 * Extends Radix UI Slider props with custom value display options.
 */
interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Show value label on thumb */
  showValue?: boolean;
  /** Format function for value display */
  formatValue?: (value: number) => string;
  /** Label mapping for discrete values (e.g., {1: "Novice", 2: "Beginner", 3: "Expert"}) */
  labels?: Record<number, string>;
  /** Thumb shape variant (default: "circle") */
  thumbShape?: ThumbShape;
  /** Label position - inside the thumb or outside as tooltip (default: "outside") */
  labelPosition?: LabelPosition;
}

/**
 * Thumb shape styling configuration
 *
 * Defines size and border-radius for each thumb shape variant,
 * with different sizes for default and label-inside modes.
 */
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

/**
 * Slider - Range input component with customizable value display
 *
 * A fully accessible range slider built on Radix UI primitives with optional
 * value labels, custom thumb shapes, and formatted value display. Perfect for
 * settings, filters, and value selection.
 *
 * **Features:**
 * - Keyboard navigation (Arrow keys, Home, End, Page Up/Down)
 * - Optional value display (inside thumb or tooltip)
 * - Custom thumb shapes (circle, rectangle, rounded-rectangle)
 * - Label mapping for discrete values
 * - Custom value formatting
 * - Smooth animations and hover effects
 * - Disabled state support
 *
 * **Accessibility:**
 * - Full keyboard control
 * - ARIA attributes for screen readers
 * - Focus indicators
 * - Disabled state styling
 *
 * **Value Display Options:**
 * - `showValue={false}` - No label (default)
 * - `labelPosition="outside"` - Tooltip that appears on hover
 * - `labelPosition="inside"` - Value shown inside enlarged thumb
 *
 * **React Hook Form Integration:**
 * Use `value` with `field.value` and `onValueChange` with `field.onChange`
 *
 * @example
 * ```tsx
 * // Basic slider
 * <Slider
 *   defaultValue={[50]}
 *   max={100}
 *   step={1}
 * />
 *
 * // With value display (tooltip on hover)
 * <Slider
 *   defaultValue={[75]}
 *   max={100}
 *   showValue
 * />
 *
 * // Value inside thumb
 * <Slider
 *   defaultValue={[50]}
 *   max={100}
 *   showValue
 *   labelPosition="inside"
 *   thumbShape="rounded-rectangle"
 * />
 *
 * // Custom formatting (percentage)
 * <Slider
 *   defaultValue={[0.5]}
 *   max={1}
 *   step={0.01}
 *   showValue
 *   formatValue={(val) => `${Math.round(val * 100)}%`}
 * />
 *
 * // Discrete labels (skill level)
 * <Slider
 *   defaultValue={[2]}
 *   min={1}
 *   max={5}
 *   step={1}
 *   showValue
 *   labelPosition="inside"
 *   thumbShape="rounded-rectangle"
 *   labels={{
 *     1: "Novice",
 *     2: "Beginner",
 *     3: "Intermediate",
 *     4: "Advanced",
 *     5: "Expert"
 *   }}
 * />
 *
 * // React Hook Form
 * <FormField
 *   control={form.control}
 *   name="volume"
 *   render={({ field }) => (
 *     <FormItem>
 *       <FormLabel>Volume: {field.value}%</FormLabel>
 *       <FormControl>
 *         <Slider
 *           value={[field.value]}
 *           onValueChange={(vals) => field.onChange(vals[0])}
 *           max={100}
 *           step={1}
 *         />
 *       </FormControl>
 *     </FormItem>
 *   )}
 * />
 *
 * // Disabled state
 * <Slider defaultValue={[50]} disabled />
 * ```
 */
const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
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
    ref
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
        className={cn("relative flex w-full touch-none select-none items-center group", className)}
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
            showValue && "relative"
          )}
        >
          {/* Inside Label */}
          {showInsideLabel && (
            <span
              className={cn(
                "text-xs font-bold font-display tracking-tight uppercase",
                "text-primary pointer-events-none select-none",
                "leading-none px-1"
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
                "border border-primary/20"
              )}
            >
              {formattedValue}
            </span>
          )}
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    );
  }
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
export type { ThumbShape, LabelPosition };
