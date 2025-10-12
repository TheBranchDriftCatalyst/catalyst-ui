import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/catalyst-ui/utils";

import { createContext, useContext, useState } from "react";

/**
 * Context type for programmatic dialog management
 *
 * Provides methods to open and close dialogs imperatively without
 * managing open state manually.
 */
type DialogContextType = {
  openDialog: (children: React.ReactNode) => void;
  closeDialog: () => void;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

/**
 * DialogProvider - Context provider for imperative dialog control
 *
 * Wraps your application (or a subtree) to enable programmatic dialog management
 * via the `useDialog` hook. Allows opening dialogs from anywhere in the component tree
 * without prop drilling or state management.
 *
 * **Use case:**
 * When you need to trigger dialogs from deep in the component tree (e.g., from buttons,
 * forms, or event handlers) without passing callbacks through multiple layers.
 *
 * @example
 * ```tsx
 * // Wrap your app
 * function App() {
 *   return (
 *     <DialogProvider>
 *       <YourComponents />
 *     </DialogProvider>
 *   );
 * }
 *
 * // Use anywhere in the tree
 * function SomeButton() {
 *   const { openDialog } = useDialog();
 *
 *   return (
 *     <Button onClick={() => openDialog(
 *       <DialogContent>
 *         <DialogHeader>
 *           <DialogTitle>Confirm Action</DialogTitle>
 *         </DialogHeader>
 *       </DialogContent>
 *     )}>
 *       Open Dialog
 *     </Button>
 *   );
 * }
 * ```
 */
export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialogChildren, setDialogChildren] = useState<React.ReactNode>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = (children: React.ReactNode) => {
    setDialogChildren(children);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {dialogChildren}
      </Dialog>
    </DialogContext.Provider>
  );
};

/**
 * useDialog - Hook for imperative dialog control
 *
 * Access dialog methods to programmatically open and close dialogs from anywhere
 * in the component tree. Must be used within a DialogProvider.
 *
 * **Returns:**
 * - `openDialog(children)` - Function to open a dialog with given content
 * - `closeDialog()` - Function to close the currently open dialog
 *
 * @throws Error if used outside of DialogProvider
 *
 * @example
 * ```tsx
 * function DeleteButton({ itemId }) {
 *   const { openDialog, closeDialog } = useDialog();
 *
 *   const handleDelete = () => {
 *     openDialog(
 *       <DialogContent>
 *         <DialogHeader>
 *           <DialogTitle>Confirm Deletion</DialogTitle>
 *           <DialogDescription>
 *             This action cannot be undone.
 *           </DialogDescription>
 *         </DialogHeader>
 *         <DialogFooter>
 *           <Button variant="outline" onClick={closeDialog}>Cancel</Button>
 *           <Button variant="destructive" onClick={() => {
 *             deleteItem(itemId);
 *             closeDialog();
 *           }}>Delete</Button>
 *         </DialogFooter>
 *       </DialogContent>
 *     );
 *   };
 *
 *   return <Button onClick={handleDelete}>Delete</Button>;
 * }
 * ```
 */
export const useDialog = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }

  return context;
};

/**
 * Dialog - Root component for dialog/modal management
 *
 * Radix UI Dialog primitive that handles open state, focus trapping, and accessibility.
 * Use this as the root wrapper for controlled dialogs.
 *
 * @example
 * ```tsx
 * <Dialog open={isOpen} onOpenChange={setIsOpen}>
 *   <DialogTrigger>Open Dialog</DialogTrigger>
 *   <DialogContent>...</DialogContent>
 * </Dialog>
 * ```
 */
const Dialog = DialogPrimitive.Root;

/**
 * DialogTrigger - Button/element that opens the dialog
 *
 * Radix UI trigger primitive that automatically connects to the Dialog state.
 * Renders as a button by default but can be composed with any element.
 *
 * @example
 * ```tsx
 * <DialogTrigger asChild>
 *   <Button variant="outline">Open Settings</Button>
 * </DialogTrigger>
 * ```
 */
const DialogTrigger = DialogPrimitive.Trigger;

/**
 * DialogPortal - Portal for rendering dialog outside DOM hierarchy
 *
 * Radix UI portal primitive that renders dialog content in a portal at document.body.
 * Usually not used directly - DialogContent handles this automatically.
 */
const DialogPortal = DialogPrimitive.Portal;

/**
 * DialogOverlay - Semi-transparent backdrop behind dialog
 *
 * Renders a dark overlay (black at 80% opacity) that covers the entire screen behind
 * the dialog. Includes fade-in/fade-out animations synchronized with dialog state.
 * Automatically managed by DialogContent.
 *
 * @example
 * ```tsx
 * // Custom overlay styling
 * <DialogOverlay className="bg-red-500/50" />
 * ```
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=open]:duration-300 data-[state=closed]:duration-200",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * Available animation variants for DialogContent
 *
 * - `fade` - Simple opacity fade
 * - `scale` - Zoom effect with fade (default)
 * - `slide-up` - Slide in from bottom
 * - `slide-down` - Slide in from top
 * - `zoom` - Dramatic zoom effect (500ms)
 */
export type DialogAnimation = "fade" | "scale" | "slide-up" | "slide-down" | "zoom";

/**
 * Dialog content animation variants using class-variance-authority
 *
 * Defines multiple entrance/exit animations for the dialog content panel.
 * All variants include fade transitions and are synchronized with Radix UI's
 * data-state attributes for smooth open/close animations.
 */
const dialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg gap-4 translate-x-[-50%] translate-y-[-50%] border bg-background p-6 shadow-lg sm:rounded-lg",
  {
    variants: {
      animation: {
        fade: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:duration-300 data-[state=closed]:duration-200",
        scale:
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:duration-300 data-[state=closed]:duration-200",
        "slide-up":
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full data-[state=open]:duration-300 data-[state=closed]:duration-200",
        "slide-down":
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-full data-[state=open]:slide-in-from-top-full data-[state=open]:duration-300 data-[state=closed]:duration-200",
        zoom: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-90 data-[state=open]:zoom-in-90 data-[state=open]:duration-500 data-[state=open]:ease-out data-[state=closed]:duration-200",
      },
    },
    defaultVariants: {
      animation: "scale",
    },
  }
);

/**
 * Props for the DialogContent component
 *
 * Extends Radix UI Dialog.Content props with custom animation variants.
 */
interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {}

/**
 * DialogContent - Main dialog panel with content and close button
 *
 * The primary container for dialog content. Automatically includes an overlay, portal rendering,
 * and a close button (X icon) in the top-right corner. Centered on screen with configurable
 * entrance/exit animations.
 *
 * **Features:**
 * - Centered positioning (absolute center of viewport)
 * - Max width constraint (lg = 512px)
 * - Built-in close button with hover effects
 * - Configurable animation variants
 * - Focus trap and accessibility (via Radix UI)
 * - ESC key to close
 * - Click outside to close
 *
 * @example
 * ```tsx
 * // Default scale animation
 * <DialogContent>
 *   <DialogHeader>
 *     <DialogTitle>Confirmation</DialogTitle>
 *   </DialogHeader>
 * </DialogContent>
 *
 * // Custom animation
 * <DialogContent animation="slide-up">
 *   {content}
 * </DialogContent>
 *
 * // Dramatic zoom effect
 * <DialogContent animation="zoom">
 *   <DialogHeader>
 *     <DialogTitle>Welcome!</DialogTitle>
 *   </DialogHeader>
 * </DialogContent>
 * ```
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, animation = "scale", ...props }, ref) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(dialogContentVariants({ animation }), className)}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className={cn(
            "absolute right-4 top-4",
            "cursor-pointer rounded-sm opacity-70",
            "ring-offset-background transition-opacity",
            "hover:opacity-100",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:pointer-events-none"
          )}
        >
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

/**
 * DialogHeader - Container for dialog title and description
 *
 * Flexbox container that vertically stacks DialogTitle and DialogDescription
 * with consistent spacing. Centered on mobile, left-aligned on larger screens.
 * Typically the first child of DialogContent.
 *
 * @example
 * ```tsx
 * <DialogHeader>
 *   <DialogTitle>Delete Account</DialogTitle>
 *   <DialogDescription>
 *     This action cannot be undone. All your data will be permanently removed.
 *   </DialogDescription>
 * </DialogHeader>
 * ```
 */
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

/**
 * DialogFooter - Container for dialog action buttons
 *
 * Flexbox container for buttons and footer actions. Stacks vertically on mobile
 * (reversed order for accessibility), horizontal row on larger screens with right alignment.
 * Typically the last child of DialogContent.
 *
 * @example
 * ```tsx
 * <DialogFooter>
 *   <Button variant="outline" onClick={onCancel}>
 *     Cancel
 *   </Button>
 *   <Button variant="destructive" onClick={onConfirm}>
 *     Delete
 *   </Button>
 * </DialogFooter>
 * ```
 */
const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

/**
 * DialogTitle - Primary heading for the dialog
 *
 * Renders as a semantically correct heading with prominent typography.
 * Required for accessibility - screen readers announce this as the dialog title.
 * Use inside DialogHeader for proper spacing.
 *
 * **Accessibility:**
 * Radix UI automatically connects this to the dialog's aria-labelledby attribute.
 *
 * @example
 * ```tsx
 * <DialogTitle>Confirm Your Action</DialogTitle>
 * ```
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

/**
 * DialogDescription - Supporting text for the dialog
 *
 * Muted text that provides additional context below the DialogTitle.
 * Important for accessibility - screen readers use this for the dialog description.
 * Use inside DialogHeader below DialogTitle.
 *
 * **Accessibility:**
 * Radix UI automatically connects this to the dialog's aria-describedby attribute.
 *
 * @example
 * ```tsx
 * <DialogDescription>
 *   You are about to perform a permanent action. Please review carefully
 *   before proceeding.
 * </DialogDescription>
 * ```
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
