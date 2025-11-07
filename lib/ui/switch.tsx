"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/catalyst-ui/utils";

/**
 * Switch - Accessible toggle switch component
 *
 * A fully accessible switch (toggle) built on Radix UI primitives. Ideal for
 * binary on/off settings like enabling features, dark mode, notifications, etc.
 * Provides proper keyboard navigation and screen reader support.
 *
 * **Accessibility Features:**
 * - Full keyboard navigation (Space/Enter to toggle)
 * - Focus ring for keyboard users
 * - ARIA attributes for screen readers
 * - Disabled state styling
 * - Proper checked/unchecked state announcements
 *
 * **States:**
 * - `unchecked` - Off state (default)
 * - `checked` - On state
 *
 * **React Hook Form Integration:**
 * Use `checked` prop with `field.value` and `onCheckedChange` with `field.onChange`
 *
 * @example
 * ```tsx
 * // Standalone switch
 * <Switch
 *   checked={isEnabled}
 *   onCheckedChange={setIsEnabled}
 * />
 *
 * // With label
 * <div className="flex items-center space-x-2">
 *   <Switch id="airplane-mode" />
 *   <Label htmlFor="airplane-mode">Airplane Mode</Label>
 * </div>
 *
 * // React Hook Form
 * <FormField
 *   control={form.control}
 *   name="notifications"
 *   render={({ field }) => (
 *     <FormItem className="flex items-center space-x-2">
 *       <FormControl>
 *         <Switch
 *           checked={field.value}
 *           onCheckedChange={field.onChange}
 *         />
 *       </FormControl>
 *       <FormLabel>Enable notifications</FormLabel>
 *     </FormItem>
 *   )}
 * />
 *
 * // Disabled state
 * <Switch disabled checked />
 * ```
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
