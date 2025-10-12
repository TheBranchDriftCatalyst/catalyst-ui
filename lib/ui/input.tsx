import * as React from "react";

import { cn } from "@/catalyst-ui/utils";

/**
 * Props for the Input component
 *
 * Extends standard HTML input attributes with all native input functionality
 * including type, placeholder, value, onChange, etc.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Input - Text input field with enhanced styling and interactions
 *
 * A styled text input component with consistent theming, focus states, and smooth transitions.
 * Supports all native HTML input types (text, email, password, number, etc.) and includes
 * special styling for file inputs. Features hover effects and subtle scale animation on focus.
 *
 * **Features:**
 * - Responsive height and padding for comfortable interaction
 * - Focus ring with offset for accessibility
 * - Hover state with primary color border hint
 * - Disabled state with reduced opacity and cursor change
 * - File input styling (borderless, transparent background)
 * - Smooth transitions on all interactive states
 * - Subtle scale animation on focus (1.01x)
 *
 * @example
 * ```tsx
 * // Basic text input
 * <Input type="text" placeholder="Enter your name" />
 *
 * // Email input with controlled state
 * <Input
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   placeholder="you@example.com"
 * />
 *
 * // Password input with disabled state
 * <Input
 *   type="password"
 *   placeholder="Enter password"
 *   disabled={isLoading}
 * />
 *
 * // File input (styled automatically)
 * <Input type="file" accept="image/*" />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-primary/50 focus:scale-[1.01]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
