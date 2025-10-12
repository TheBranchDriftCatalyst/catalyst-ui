import { cn } from "@/catalyst-ui/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

/**
 * Button variants configuration using class-variance-authority
 *
 * Defines all visual styles for button variants and sizes with smooth transitions.
 * Includes hover effects, focus states, and accessibility features.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-95 hover:shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 rounded",
        "icon-sm": "h-8 w-8 rounded",
        "icon-lg": "h-12 w-12 rounded",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Props for the Button component
 *
 * Extends standard HTML button attributes with variant styling options
 * and Radix UI's asChild composition pattern.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Use Radix UI Slot to render as a different element
   *
   * When true, Button will not render a `<button>` but will instead
   * clone and pass props to its child element. Useful for rendering
   * buttons as links or other interactive elements.
   *
   * @example
   * ```tsx
   * <Button asChild>
   *   <a href="/about">Link Button</a>
   * </Button>
   * ```
   */
  asChild?: boolean;
}

/**
 * Button - Primary interactive element for user actions
 *
 * A versatile button component with multiple visual variants, sizes, and states.
 * Built on Radix UI primitives with full accessibility support. Includes smooth
 * hover effects, focus indicators, and disabled states.
 *
 * **Variants:**
 * - `default` - Primary action button with theme colors
 * - `destructive` - For dangerous actions (delete, remove, etc.)
 * - `outline` - Secondary actions with border
 * - `secondary` - Alternative styling for less prominent actions
 * - `ghost` - Minimal styling, hover only
 * - `link` - Styled as a hyperlink
 *
 * **Sizes:**
 * - `default` - Standard button height (40px)
 * - `sm` - Small button (36px)
 * - `lg` - Large button (44px)
 * - `icon` / `icon-sm` / `icon-lg` - Square buttons for icons
 *
 * @example
 * ```tsx
 * // Primary action button
 * <Button variant="default" size="lg">
 *   Save Changes
 * </Button>
 *
 * // Destructive action
 * <Button variant="destructive" onClick={() => handleDelete()}>
 *   Delete Account
 * </Button>
 *
 * // Button as link (Radix Slot pattern)
 * <Button variant="outline" asChild>
 *   <a href="/docs">View Documentation</a>
 * </Button>
 *
 * // Icon button
 * <Button variant="ghost" size="icon">
 *   <SearchIcon />
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
