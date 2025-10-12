"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/catalyst-ui/utils";

/**
 * Checkbox - Accessible checkbox input component
 *
 * A fully accessible checkbox built on Radix UI primitives with a check icon
 * indicator. Supports checked, unchecked, and indeterminate states with proper
 * keyboard navigation and screen reader support.
 *
 * **Accessibility Features:**
 * - Full keyboard navigation (Space to toggle)
 * - Focus ring for keyboard users
 * - ARIA attributes for screen readers
 * - Disabled state styling
 * - Proper checked/unchecked state announcements
 *
 * **States:**
 * - `unchecked` - Default empty state
 * - `checked` - Selected state with check icon
 * - `indeterminate` - Partial selection (for parent checkboxes)
 *
 * **React Hook Form Integration:**
 * Use `checked` prop with `field.value` and `onCheckedChange` with `field.onChange`
 *
 * @example
 * ```tsx
 * // Standalone checkbox
 * <Checkbox
 *   checked={isChecked}
 *   onCheckedChange={setIsChecked}
 * />
 *
 * // With label
 * <div className="flex items-center space-x-2">
 *   <Checkbox id="terms" />
 *   <Label htmlFor="terms">Accept terms and conditions</Label>
 * </div>
 *
 * // React Hook Form
 * <FormField
 *   control={form.control}
 *   name="marketing"
 *   render={({ field }) => (
 *     <FormItem className="flex items-center space-x-2">
 *       <FormControl>
 *         <Checkbox
 *           checked={field.value}
 *           onCheckedChange={field.onChange}
 *         />
 *       </FormControl>
 *       <FormLabel>Send me marketing emails</FormLabel>
 *     </FormItem>
 *   )}
 * />
 *
 * // Disabled state
 * <Checkbox disabled checked />
 *
 * // Indeterminate state (partial selection)
 * <Checkbox checked="indeterminate" />
 * ```
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
