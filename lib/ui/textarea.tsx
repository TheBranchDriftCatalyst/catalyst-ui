import * as React from "react";

import { cn } from "@/catalyst-ui/utils";

/**
 * Props for the Textarea component
 *
 * Extends standard HTML textarea attributes with no additional props.
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Textarea - Multi-line text input component
 *
 * A resizable text input for longer form content like comments, descriptions,
 * or messages. Includes smooth animations and consistent styling with other
 * form inputs.
 *
 * **Features:**
 * - Minimum height of 80px (customizable via className)
 * - User-resizable by default (browser native)
 * - Focus ring for keyboard navigation
 * - Hover effects on border
 * - Subtle scale animation on focus
 * - Placeholder text support
 * - Disabled state styling
 *
 * **Accessibility:**
 * - Proper focus indicators
 * - Disabled state with cursor and opacity changes
 * - Works with Label component via id/htmlFor
 *
 * **React Hook Form Integration:**
 * Spread `{...field}` to connect with form state and validation.
 *
 * @example
 * ```tsx
 * // Basic textarea
 * <Textarea placeholder="Enter your message..." />
 *
 * // With controlled value
 * <Textarea
 *   value={message}
 *   onChange={(e) => setMessage(e.target.value)}
 * />
 *
 * // Custom height
 * <Textarea
 *   className="min-h-[200px]"
 *   placeholder="Write a long description..."
 * />
 *
 * // Disable resize
 * <Textarea className="resize-none" />
 *
 * // React Hook Form
 * <FormField
 *   control={form.control}
 *   name="bio"
 *   render={({ field }) => (
 *     <FormItem>
 *       <FormLabel>Bio</FormLabel>
 *       <FormControl>
 *         <Textarea
 *           placeholder="Tell us about yourself"
 *           {...field}
 *         />
 *       </FormControl>
 *       <FormDescription>
 *         Brief description for your profile
 *       </FormDescription>
 *       <FormMessage />
 *     </FormItem>
 *   )}
 * />
 *
 * // Disabled state
 * <Textarea disabled placeholder="Not editable" />
 *
 * // With rows prop
 * <Textarea rows={5} placeholder="Fixed row height" />
 * ```
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-primary/50 focus:scale-[1.01]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
