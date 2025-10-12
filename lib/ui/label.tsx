import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/catalyst-ui/utils";

/**
 * Label variants configuration using class-variance-authority
 *
 * Defines styling for form labels with proper accessibility support
 * for disabled states using the peer-disabled utility pattern.
 */
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

/**
 * Label - Accessible label component for form inputs
 *
 * Built on Radix UI's Label primitive with proper accessibility support.
 * Automatically associates with form controls via `htmlFor` prop.
 *
 * **Accessibility Features:**
 * - Properly links to form controls via `htmlFor` attribute
 * - Supports Radix UI's Label primitive ARIA attributes
 * - Automatically adjusts cursor and opacity when associated input is disabled
 *
 * **Peer Disabled Pattern:**
 * When the associated input has the `peer` class and is disabled, the label
 * automatically shows disabled styling (not-allowed cursor, 70% opacity).
 *
 * **Usage:**
 * Can be used standalone or within FormLabel for automatic error handling.
 *
 * @example
 * ```tsx
 * // Standalone label
 * <Label htmlFor="email">Email Address</Label>
 * <Input id="email" type="email" className="peer" />
 *
 * // With disabled input
 * <Label htmlFor="disabled-field">Disabled Field</Label>
 * <Input id="disabled-field" disabled className="peer" />
 *
 * // Custom styling
 * <Label htmlFor="name" className="text-lg font-bold">
 *   Full Name
 * </Label>
 *
 * // Within a form (via FormLabel)
 * <FormLabel>Username</FormLabel>
 * ```
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
