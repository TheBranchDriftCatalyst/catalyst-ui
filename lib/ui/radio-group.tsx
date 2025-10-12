"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/catalyst-ui/utils";

/**
 * RadioGroup - Container for radio button options
 *
 * Groups multiple RadioGroupItem components into a single-choice selection.
 * Built on Radix UI primitives with full keyboard navigation and accessibility
 * support. Only one option can be selected at a time.
 *
 * **Accessibility Features:**
 * - Arrow key navigation between options
 * - Automatic focus management
 * - Proper ARIA attributes for screen readers
 * - Roving tabindex for keyboard navigation
 *
 * **Layout:**
 * By default uses CSS Grid with gap-2 spacing. Override with className
 * for custom layouts (flex, custom grid, etc.)
 *
 * **React Hook Form Integration:**
 * Use `value` prop with `field.value` and `onValueChange` with `field.onChange`
 *
 * @example
 * ```tsx
 * // Basic radio group
 * <RadioGroup defaultValue="option1">
 *   <div className="flex items-center space-x-2">
 *     <RadioGroupItem value="option1" id="r1" />
 *     <Label htmlFor="r1">Option 1</Label>
 *   </div>
 *   <div className="flex items-center space-x-2">
 *     <RadioGroupItem value="option2" id="r2" />
 *     <Label htmlFor="r2">Option 2</Label>
 *   </div>
 * </RadioGroup>
 *
 * // React Hook Form
 * <FormField
 *   control={form.control}
 *   name="notificationMethod"
 *   render={({ field }) => (
 *     <FormItem>
 *       <FormLabel>Notification Method</FormLabel>
 *       <FormControl>
 *         <RadioGroup
 *           onValueChange={field.onChange}
 *           defaultValue={field.value}
 *         >
 *           <div className="flex items-center space-x-2">
 *             <RadioGroupItem value="email" id="email" />
 *             <Label htmlFor="email">Email</Label>
 *           </div>
 *           <div className="flex items-center space-x-2">
 *             <RadioGroupItem value="sms" id="sms" />
 *             <Label htmlFor="sms">SMS</Label>
 *           </div>
 *         </RadioGroup>
 *       </FormControl>
 *     </FormItem>
 *   )}
 * />
 *
 * // Custom layout (horizontal)
 * <RadioGroup defaultValue="small" className="flex space-x-4">
 *   <div className="flex items-center space-x-2">
 *     <RadioGroupItem value="small" id="small" />
 *     <Label htmlFor="small">Small</Label>
 *   </div>
 *   <div className="flex items-center space-x-2">
 *     <RadioGroupItem value="medium" id="medium" />
 *     <Label htmlFor="medium">Medium</Label>
 *   </div>
 * </RadioGroup>
 * ```
 */
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

/**
 * RadioGroupItem - Individual radio button option
 *
 * A single radio button within a RadioGroup. Must have a unique `value` prop
 * and should be paired with a Label for accessibility.
 *
 * **Accessibility:**
 * - Focus indicator with ring
 * - Disabled state styling
 * - Works with Label's htmlFor attribute
 *
 * **Visual States:**
 * - Unchecked: Empty circle with border
 * - Checked: Circle with filled inner dot
 * - Focused: Ring around circle
 * - Disabled: Reduced opacity, not-allowed cursor
 *
 * @example
 * ```tsx
 * <RadioGroupItem value="option1" id="r1" />
 * <RadioGroupItem value="option2" id="r2" disabled />
 * ```
 */
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
