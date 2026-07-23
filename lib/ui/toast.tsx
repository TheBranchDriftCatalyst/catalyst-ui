"use client";
/**
 * Toast UI Components
 *
 * React components for displaying toast notifications built on Radix UI Toast primitives.
 * Includes visual variants, animation styles, and an integrated progress indicator.
 *
 * @module toast
 *
 * @example
 * ```tsx
 * import { Toaster } from "@/catalyst-ui/ui/toaster";
 *
 * function App() {
 *   return (
 *     <>
 *       {/* Your app content *\/}
 *       <Toaster />
 *     </>
 *   );
 * }
 * ```
 */
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { Progress } from "@/catalyst-ui/ui/progress";
import { cn } from "@/catalyst-ui/utils";
import type { ToastAnimation } from "./use-toast";

/**
 * Toast provider component that manages toast lifecycle and portal rendering.
 * This is re-exported from Radix UI Toast primitives.
 */
const ToastProvider = ToastPrimitives.Provider;

/**
 * ToastViewport - Portal container for rendering toasts.
 *
 * Defines the fixed viewport where toast notifications appear.
 * By default, toasts render in the top-right corner of the screen.
 *
 * @component
 *
 * @example
 * ```tsx
 * <ToastProvider>
 *   <Toast>...</Toast>
 *   <ToastViewport />
 * </ToastProvider>
 * ```
 */
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-1.5 p-3 sm:flex-col md:max-w-[340px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

/**
 * Toast visual style variants using class-variance-authority.
 *
 * Defines styling for different toast types and animations:
 * - Variants: default (primary), secondary, destructive (error)
 * - Animations: slide, fade, bounce, scale, slide-up, slide-down
 */
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start justify-between gap-3 overflow-hidden rounded-sm border p-3 pr-7 shadow-md backdrop-blur-sm transition data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
  {
    variants: {
      variant: {
        secondary: "bg-secondary/80 border-secondary/60 text-secondary-foreground",
        default: "border-primary/30 bg-card/95 text-foreground hover:border-primary/60",
        destructive:
          "destructive group border-red-500/40 bg-red-950/60 text-red-100 hover:border-red-400/60",
      },
      animation: {
        slide:
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:duration-300",
        fade: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:duration-300 data-[state=closed]:duration-200",
        bounce:
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:duration-500 data-[state=open]:ease-out",
        scale:
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:duration-300",
        "slide-up":
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full data-[state=open]:duration-300",
        "slide-down":
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:duration-300",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "slide",
    },
  }
);

/**
 * Toast - Main toast notification component.
 *
 * Displays a toast notification with configurable styling, animation,
 * and optional auto-dismiss with progress indicator. Supports swipe-to-dismiss
 * gesture on mobile devices.
 *
 * @component
 *
 * @param variant - Visual style: "default" | "secondary" | "destructive"
 * @param animation - Entrance/exit animation: "slide" | "fade" | "bounce" | "scale" | "slide-up" | "slide-down"
 * @param duration - Auto-dismiss duration in milliseconds (shows progress bar)
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <Toast variant="default" animation="slide" duration={5000}>
 *   <ToastTitle>Success</ToastTitle>
 *   <ToastDescription>Your changes have been saved.</ToastDescription>
 *   <ToastClose />
 * </Toast>
 * ```
 *
 * @example
 * ```tsx
 * // Error toast with action
 * <Toast variant="destructive">
 *   <div className="grid gap-1">
 *     <ToastTitle>Error</ToastTitle>
 *     <ToastDescription>Failed to delete item.</ToastDescription>
 *   </div>
 *   <ToastAction altText="Retry">Retry</ToastAction>
 *   <ToastClose />
 * </Toast>
 * ```
 */
const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants> & {
      animation?: ToastAnimation;
    }
>(({ className, variant, animation = "slide", ...props }, ref) => {
  const { duration } = props;
  const [progress, setProgress] = React.useState(duration ? 100 : 0);

  React.useEffect(() => {
    if (duration) {
      const interval = setInterval(() => {
        setProgress(prevProgress => (prevProgress > 0 ? prevProgress - 100 / (duration / 100) : 0));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [duration]);

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant, animation }), className)}
      {...props}
    >
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary/60 group-[.destructive]:bg-red-400/70 rounded-l-sm" />
      {props.children}
      {duration && (
        <Progress value={progress} className="absolute bottom-0 left-0 h-0.5 rounded-b-sm" />
      )}
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

/**
 * ToastAction - Action button within a toast.
 *
 * Provides a clickable action button for toasts, typically used
 * for actions like "Undo", "Retry", or "View". Automatically styled
 * to match the toast variant.
 *
 * @component
 *
 * @param altText - Accessible alternative text (required for screen readers)
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <Toast>
 *   <ToastTitle>File deleted</ToastTitle>
 *   <ToastDescription>Your file has been moved to trash.</ToastDescription>
 *   <ToastAction altText="Undo deletion" onClick={handleUndo}>
 *     Undo
 *   </ToastAction>
 * </Toast>
 * ```
 */
const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

/**
 * ToastClose - Close button for dismissing toasts.
 *
 * Renders an X icon button in the top-right corner of the toast.
 * Hidden by default, appears on hover with smooth transitions.
 * Clicking triggers the toast dismissal animation.
 *
 * @component
 *
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <Toast>
 *   <ToastTitle>Notification</ToastTitle>
 *   <ToastDescription>This is a message.</ToastDescription>
 *   <ToastClose />
 * </Toast>
 * ```
 *
 * @accessibility
 * - Keyboard accessible (focusable and can be activated with Enter/Space)
 * - Shows on focus for keyboard navigation
 * - Proper ARIA labels from Radix UI primitives
 */
const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-1.5 top-1.5 rounded-sm p-0.5 text-foreground/40 opacity-0 transition hover:text-foreground hover:bg-foreground/10 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-primary/50 group-hover:opacity-100 group-[.destructive]:text-red-300/70 group-[.destructive]:hover:text-red-50 group-[.destructive]:hover:bg-red-500/20 group-[.destructive]:focus:ring-red-400",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-3 w-3" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

/**
 * ToastTitle - Title/heading for toast notifications.
 *
 * Displays the main heading text for a toast. Styled with bold,
 * uppercase, and display font for emphasis.
 *
 * @component
 *
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <Toast>
 *   <ToastTitle>Success</ToastTitle>
 *   <ToastDescription>Operation completed.</ToastDescription>
 * </Toast>
 * ```
 */
const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      "text-[11px] font-semibold uppercase tracking-[0.14em] font-mono leading-tight",
      className
    )}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

/**
 * ToastDescription - Body text for toast notifications.
 *
 * Displays detailed message text below the title. Styled with
 * slightly reduced opacity for visual hierarchy.
 *
 * @component
 *
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <Toast>
 *   <ToastTitle>File Uploaded</ToastTitle>
 *   <ToastDescription>
 *     Your document has been uploaded successfully and is now available.
 *   </ToastDescription>
 * </Toast>
 * ```
 */
const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-[11px] opacity-85 leading-snug mt-1 font-mono break-words", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

/**
 * Type for Toast component props.
 * Includes all Radix Toast props plus variant and animation options.
 */
type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

/**
 * Type for ToastAction element.
 * Used in the toast() function for action buttons.
 */
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastActionElement,
  type ToastProps,
};
