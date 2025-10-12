"use client";

import { cn } from "@/catalyst-ui/utils";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

/**
 * Toggle variants configuration using class-variance-authority
 *
 * Defines visual styles for toggle button variants and sizes with
 * proper state handling (on/off) and focus indicators.
 */
const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Toggle - Two-state button for on/off selections
 *
 * A button that can be toggled between on and off states. Built on Radix UI
 * primitives with full accessibility support. Different from a checkbox - use
 * Toggle for actions that apply immediately (like bold text), use Checkbox
 * for form selections.
 *
 * **Variants:**
 * - `default` - Transparent background, accent color when active
 * - `outline` - Border with transparent background
 *
 * **Sizes:**
 * - `sm` - Small (36px height)
 * - `default` - Standard (40px height)
 * - `lg` - Large (44px height)
 *
 * **States:**
 * - `off` (default) - Inactive state with transparent background
 * - `on` - Active state with accent background color
 * - `disabled` - Cannot be toggled, reduced opacity
 *
 * **Accessibility:**
 * - Proper ARIA attributes
 * - Keyboard accessible (Space/Enter to toggle)
 * - Focus ring for keyboard navigation
 * - Screen reader support
 *
 * **Use Cases:**
 * - Toolbar buttons (bold, italic, underline)
 * - View toggles (grid/list view)
 * - Feature toggles in UI
 * - Filter chips
 *
 * @example
 * ```tsx
 * // Basic toggle
 * <Toggle aria-label="Toggle italic">
 *   <ItalicIcon />
 * </Toggle>
 *
 * // Controlled toggle
 * <Toggle
 *   pressed={isBold}
 *   onPressedChange={setIsBold}
 *   aria-label="Toggle bold"
 * >
 *   <BoldIcon />
 * </Toggle>
 *
 * // Outline variant
 * <Toggle variant="outline" aria-label="Toggle feature">
 *   Feature
 * </Toggle>
 *
 * // Different sizes
 * <Toggle size="sm">Small</Toggle>
 * <Toggle size="default">Default</Toggle>
 * <Toggle size="lg">Large</Toggle>
 *
 * // Toolbar example
 * <div className="flex gap-1">
 *   <Toggle
 *     pressed={isBold}
 *     onPressedChange={setIsBold}
 *     aria-label="Toggle bold"
 *   >
 *     <BoldIcon />
 *   </Toggle>
 *   <Toggle
 *     pressed={isItalic}
 *     onPressedChange={setIsItalic}
 *     aria-label="Toggle italic"
 *   >
 *     <ItalicIcon />
 *   </Toggle>
 *   <Toggle
 *     pressed={isUnderline}
 *     onPressedChange={setIsUnderline}
 *     aria-label="Toggle underline"
 *   >
 *     <UnderlineIcon />
 *   </Toggle>
 * </div>
 *
 * // Disabled state
 * <Toggle disabled aria-label="Toggle feature">
 *   Disabled
 * </Toggle>
 * ```
 */
const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
