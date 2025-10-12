import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/catalyst-ui/utils";

/**
 * Card variants configuration using class-variance-authority
 *
 * Defines visual styles for card containers with optional interactive hover effects.
 */
const cardVariants = cva("rounded-lg border bg-card text-card-foreground shadow-sm", {
  variants: {
    interactive: {
      true: "transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5",
      false: "",
    },
  },
  defaultVariants: {
    interactive: true,
  },
});

/**
 * Props for the Card component
 *
 * Extends standard HTML div attributes with card-specific styling options.
 */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

/**
 * Card - Container component for grouping related content
 *
 * A flexible container with consistent styling for borders, shadows, and spacing.
 * Use with CardHeader, CardTitle, CardDescription, CardContent, and CardFooter
 * for structured layouts.
 *
 * **Interactive mode:**
 * When `interactive={true}` (default), card has hover effects suitable for
 * clickable cards. Set to `false` for static content containers.
 *
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Supporting text</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Main content goes here
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 *
 * // Non-interactive card (no hover effects)
 * <Card interactive={false}>
 *   <CardContent>Static content</CardContent>
 * </Card>
 * ```
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ interactive }), className)} {...props} />
  )
);
Card.displayName = "Card";

/**
 * CardHeader - Top section of a Card for titles and descriptions
 *
 * Container for CardTitle and CardDescription with consistent spacing.
 * Typically the first child of a Card component.
 *
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>Settings</CardTitle>
 *   <CardDescription>Manage your account settings</CardDescription>
 * </CardHeader>
 * ```
 */
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

/**
 * CardTitle - Primary heading for a Card
 *
 * Renders as an `<h3>` element with prominent typography.
 * Use inside CardHeader for proper spacing and hierarchy.
 *
 * @example
 * ```tsx
 * <CardTitle>Account Settings</CardTitle>
 * ```
 */
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

/**
 * CardDescription - Supporting text for a Card title
 *
 * Muted text that provides additional context below the CardTitle.
 * Renders as a paragraph with subdued styling.
 *
 * @example
 * ```tsx
 * <CardDescription>
 *   Configure your preferences and profile information
 * </CardDescription>
 * ```
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

/**
 * CardContent - Main content area of a Card
 *
 * Primary container for card body content. Has padding that connects
 * with CardHeader and CardFooter for consistent spacing.
 *
 * @example
 * ```tsx
 * <CardContent>
 *   <p>Your main content goes here</p>
 *   <Form>...</Form>
 * </CardContent>
 * ```
 */
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

/**
 * CardFooter - Bottom section of a Card for actions
 *
 * Flexbox container for buttons and footer content. Typically contains
 * action buttons like "Save", "Cancel", or links.
 *
 * @example
 * ```tsx
 * <CardFooter>
 *   <Button variant="outline">Cancel</Button>
 *   <Button>Save Changes</Button>
 * </CardFooter>
 * ```
 */
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
