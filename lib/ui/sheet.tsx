"use client";

/**
 * Sheet (Drawer) Components
 *
 * Sliding panel overlays that appear from screen edges. Built on Radix UI Dialog
 * primitives with custom styling for drawer/sheet behavior.
 *
 * Sheets are useful for navigation menus, sidebars, filters, or forms that
 * slide in from the side without navigating away from the current page.
 *
 * @module sheet
 *
 * @example
 * ```tsx
 * import {
 *   Sheet,
 *   SheetContent,
 *   SheetDescription,
 *   SheetHeader,
 *   SheetTitle,
 *   SheetTrigger,
 * } from "@/catalyst-ui/ui/sheet";
 *
 * function NavigationDrawer() {
 *   return (
 *     <Sheet>
 *       <SheetTrigger asChild>
 *         <button>Open Menu</button>
 *       </SheetTrigger>
 *       <SheetContent side="left">
 *         <SheetHeader>
 *           <SheetTitle>Navigation</SheetTitle>
 *           <SheetDescription>
 *             Choose a section to navigate
 *           </SheetDescription>
 *         </SheetHeader>
 *         <nav>
 *           <a href="/home">Home</a>
 *           <a href="/about">About</a>
 *         </nav>
 *       </SheetContent>
 *     </Sheet>
 *   );
 * }
 * ```
 */
import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/catalyst-ui/utils";

/**
 * Sheet - Root sheet/drawer component.
 *
 * Manages open/close state and coordinates trigger/content.
 * Re-exported from Radix UI Dialog primitives.
 *
 * @component
 *
 * @param open - Controlled open state
 * @param defaultOpen - Initial open state (uncontrolled)
 * @param onOpenChange - Callback when open state changes
 * @param modal - Whether to render as modal (default: true)
 */
const Sheet = SheetPrimitive.Root;

/**
 * SheetTrigger - Element that opens the sheet.
 *
 * The button or element users click to open the sheet.
 *
 * @component
 *
 * @example
 * ```tsx
 * <Sheet>
 *   <SheetTrigger asChild>
 *     <button>Open Filters</button>
 *   </SheetTrigger>
 *   <SheetContent>...</SheetContent>
 * </Sheet>
 * ```
 */
const SheetTrigger = SheetPrimitive.Trigger;

/**
 * SheetClose - Element that closes the sheet.
 *
 * Can be used inside SheetContent to programmatically close the sheet.
 *
 * @component
 *
 * @example
 * ```tsx
 * <SheetContent>
 *   <SheetClose asChild>
 *     <button>Cancel</button>
 *   </SheetClose>
 * </SheetContent>
 * ```
 */
const SheetClose = SheetPrimitive.Close;

/**
 * SheetPortal - Portal for rendering sheet outside normal DOM hierarchy.
 *
 * Ensures sheet renders at document body level. Usually not needed directly.
 *
 * @internal
 */
const SheetPortal = SheetPrimitive.Portal;

/**
 * SheetOverlay - Semi-transparent backdrop behind the sheet.
 *
 * Dims background content and closes sheet when clicked.
 * Automatically included in SheetContent.
 *
 * @component
 *
 * @param className - Additional CSS classes
 */
const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=open]:duration-300 data-[state=closed]:duration-200",
      className
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

/**
 * Sheet content positioning and animation variants.
 *
 * Defines slide animations from each screen edge with appropriate borders.
 */
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-400 data-[state=closed]:duration-300 data-[state=open]:ease-out data-[state=closed]:ease-in",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

/**
 * Props for SheetContent component.
 * Combines Radix Dialog Content props with sheet variants.
 */
interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

/**
 * SheetContent - The main content panel of the sheet.
 *
 * Slides in from specified screen edge with backdrop overlay.
 * Includes automatic close button and portal rendering.
 *
 * @component
 *
 * @param side - Edge to slide from: "top" | "right" | "bottom" | "left" (default: "right")
 * @param className - Additional CSS classes
 * @param children - Sheet content
 *
 * @example
 * ```tsx
 * // Right-side sheet (default)
 * <Sheet>
 *   <SheetTrigger>Open</SheetTrigger>
 *   <SheetContent>
 *     <SheetHeader>
 *       <SheetTitle>Settings</SheetTitle>
 *     </SheetHeader>
 *     <div>Your content here</div>
 *   </SheetContent>
 * </Sheet>
 * ```
 *
 * @example
 * ```tsx
 * // Left-side navigation drawer
 * <Sheet>
 *   <SheetTrigger>Menu</SheetTrigger>
 *   <SheetContent side="left">
 *     <nav>
 *       <a href="/">Home</a>
 *       <a href="/about">About</a>
 *     </nav>
 *   </SheetContent>
 * </Sheet>
 * ```
 *
 * @example
 * ```tsx
 * // Bottom sheet for mobile filters
 * <Sheet>
 *   <SheetTrigger>Filters</SheetTrigger>
 *   <SheetContent side="bottom">
 *     <SheetHeader>
 *       <SheetTitle>Filter Options</SheetTitle>
 *     </SheetHeader>
 *     <FilterForm />
 *   </SheetContent>
 * </Sheet>
 * ```
 *
 * @accessibility
 * - Traps focus within sheet when open
 * - Closes on Escape key
 * - Restores focus to trigger on close
 * - ARIA attributes managed by Radix UI
 * - Backdrop click closes sheet
 */
const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

/**
 * SheetHeader - Header container for sheet title and description.
 *
 * Provides consistent spacing and layout for sheet headers.
 * Typically contains SheetTitle and SheetDescription.
 *
 * @component
 *
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <SheetContent>
 *   <SheetHeader>
 *     <SheetTitle>Edit Profile</SheetTitle>
 *     <SheetDescription>
 *       Make changes to your profile information
 *     </SheetDescription>
 *   </SheetHeader>
 * </SheetContent>
 * ```
 */
const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

/**
 * SheetFooter - Footer container for action buttons.
 *
 * Provides consistent spacing and layout for sheet footer actions.
 * Typically contains submit/cancel buttons or other actions.
 *
 * @component
 *
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <SheetContent>
 *   <SheetHeader>...</SheetHeader>
 *   <div>Form content</div>
 *   <SheetFooter>
 *     <SheetClose asChild>
 *       <button>Cancel</button>
 *     </SheetClose>
 *     <button type="submit">Save</button>
 *   </SheetFooter>
 * </SheetContent>
 * ```
 */
const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

/**
 * SheetTitle - Title heading for the sheet.
 *
 * Main heading text for the sheet. Required for accessibility.
 *
 * @component
 *
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <SheetContent>
 *   <SheetHeader>
 *     <SheetTitle>Edit Profile</SheetTitle>
 *   </SheetHeader>
 * </SheetContent>
 * ```
 */
const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

/**
 * SheetDescription - Description text for the sheet.
 *
 * Provides additional context about the sheet's purpose.
 * Important for accessibility.
 *
 * @component
 *
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <SheetContent>
 *   <SheetHeader>
 *     <SheetTitle>Delete Account</SheetTitle>
 *     <SheetDescription>
 *       This action cannot be undone. All your data will be permanently removed.
 *     </SheetDescription>
 *   </SheetHeader>
 * </SheetContent>
 * ```
 */
const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
