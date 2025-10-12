/**
 * Toast Management System
 *
 * Provides a global toast notification system inspired by react-hot-toast.
 * Manages toast queue, animations, and lifecycle through a reducer-based state machine.
 *
 * @module use-toast
 *
 * @example
 * ```tsx
 * import { useToast } from "@/catalyst-ui/ui/use-toast";
 *
 * function MyComponent() {
 *   const { toast } = useToast();
 *
 *   const handleSuccess = () => {
 *     toast({
 *       title: "Success!",
 *       description: "Your changes have been saved.",
 *       variant: "default",
 *     });
 *   };
 *
 *   const handleError = () => {
 *     toast({
 *       title: "Error",
 *       description: "Something went wrong.",
 *       variant: "destructive",
 *     });
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={handleSuccess}>Save</button>
 *       <button onClick={handleError}>Trigger Error</button>
 *     </>
 *   );
 * }
 * ```
 */
// Inspired by react-hot-toast library
import * as React from "react";

import type { ToastActionElement, ToastProps } from "./toast";

/**
 * Maximum number of toasts that can be displayed simultaneously.
 * Older toasts are automatically removed when this limit is exceeded.
 */
const TOAST_LIMIT = 5; // Allow up to 5 toasts to stack

/**
 * Delay in milliseconds before a dismissed toast is removed from the DOM.
 * This allows exit animations to complete before cleanup.
 */
const TOAST_REMOVE_DELAY = 1000000;

/**
 * Available animation styles for toast entrance/exit.
 *
 * @typedef ToastAnimation
 * @property {"slide"} slide - Slides in from top, slides out to right (default)
 * @property {"fade"} fade - Fades in/out with opacity transition
 * @property {"bounce"} bounce - Bouncy entrance animation
 * @property {"scale"} scale - Zoom/scale transition
 * @property {"slide-up"} slide-up - Slides in from bottom
 * @property {"slide-down"} slide-down - Slides in from top
 */
export type ToastAnimation = "slide" | "fade" | "bounce" | "scale" | "slide-up" | "slide-down";

/**
 * Internal toast representation with unique identifier and content.
 *
 * @internal
 */
type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  animation?: ToastAnimation;
};

/**
 * Action types for the toast reducer state machine.
 *
 * @internal
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

/**
 * Generates unique sequential IDs for toasts.
 *
 * @internal
 * @returns A unique string identifier
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

/**
 * Union type of all possible toast reducer actions.
 *
 * @internal
 */
type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

/**
 * Toast reducer state shape.
 *
 * @internal
 */
interface State {
  toasts: ToasterToast[];
}

/**
 * Map of toast IDs to their removal timeout handles.
 * Used to schedule toast removal after dismissal.
 *
 * @internal
 */
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Schedules a toast for removal after the configured delay.
 * Prevents duplicate timeouts for the same toast.
 *
 * @internal
 * @param toastId - The ID of the toast to remove
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

/**
 * Toast state reducer that handles all toast lifecycle actions.
 *
 * Manages toast queue with automatic limiting, dismissal scheduling,
 * and removal cleanup. Supports add, update, dismiss, and remove operations.
 *
 * @internal
 * @param state - Current toast state
 * @param action - Action to perform
 * @returns Updated state
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(t => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach(toast => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.toastId),
      };
  }
};

/**
 * Global array of state listeners for reactive updates.
 * Components subscribe via useToast hook to receive state changes.
 *
 * @internal
 */
const listeners: Array<(state: State) => void> = [];

/**
 * Global in-memory state for the toast system.
 * Persists across component unmounts and re-renders.
 *
 * @internal
 */
let memoryState: State = { toasts: [] };

/**
 * Dispatches an action to the toast reducer and notifies all listeners.
 * This enables global state management without React context.
 *
 * @internal
 * @param action - The action to dispatch
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach(listener => {
    listener(memoryState);
  });
}

/**
 * Public toast options without the internal ID field.
 */
type Toast = Omit<ToasterToast, "id">;

/**
 * Imperatively displays a toast notification.
 *
 * This function can be called from anywhere in your application,
 * even outside React components. Returns methods to update or dismiss
 * the specific toast instance.
 *
 * @param props - Toast configuration options
 * @param props.title - Toast heading text
 * @param props.description - Toast body text
 * @param props.variant - Visual style variant (default, secondary, destructive)
 * @param props.animation - Entrance/exit animation style
 * @param props.duration - Auto-dismiss duration in milliseconds
 * @param props.action - Optional action button element
 *
 * @returns Object with methods to control the toast
 * @returns {string} id - Unique toast identifier
 * @returns {Function} dismiss - Immediately dismiss this toast
 * @returns {Function} update - Update toast properties
 *
 * @example
 * ```tsx
 * // Simple success toast
 * toast({
 *   title: "Success",
 *   description: "Your changes have been saved.",
 *   variant: "default",
 * });
 *
 * // Error toast with custom duration
 * toast({
 *   title: "Error",
 *   description: "Failed to save changes.",
 *   variant: "destructive",
 *   duration: 5000,
 * });
 *
 * // Toast with action button
 * toast({
 *   title: "File uploaded",
 *   description: "Your file has been uploaded successfully.",
 *   action: <ToastAction altText="View">View</ToastAction>,
 * });
 *
 * // Update toast dynamically
 * const { id, update } = toast({
 *   title: "Processing...",
 *   description: "Please wait",
 * });
 *
 * setTimeout(() => {
 *   update({
 *     id,
 *     title: "Complete!",
 *     description: "Processing finished",
 *   });
 * }, 2000);
 * ```
 */
function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: open => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

/**
 * React hook for managing toast notifications.
 *
 * Provides reactive access to the global toast state and methods
 * to display or dismiss toasts. This hook subscribes to state changes
 * and automatically re-renders when toasts are added, updated, or removed.
 *
 * @returns Toast state and control methods
 * @returns {ToasterToast[]} toasts - Array of currently active toasts
 * @returns {Function} toast - Function to display a new toast (same as imperative toast())
 * @returns {Function} dismiss - Dismiss toast(s) by ID, or all if no ID provided
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { toast, dismiss } = useToast();
 *
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       toast({
 *         title: "Saved!",
 *         description: "Your data has been saved successfully.",
 *       });
 *     } catch (error) {
 *       toast({
 *         title: "Error",
 *         description: error.message,
 *         variant: "destructive",
 *       });
 *     }
 *   };
 *
 *   const dismissAll = () => {
 *     dismiss(); // Dismiss all toasts
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={handleSave}>Save</button>
 *       <button onClick={dismissAll}>Clear All</button>
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Loading toast pattern
 * function AsyncOperation() {
 *   const { toast } = useToast();
 *
 *   const handleProcess = async () => {
 *     const { id, update, dismiss } = toast({
 *       title: "Processing...",
 *       description: "Please wait while we process your request",
 *       duration: Infinity, // Don't auto-dismiss
 *     });
 *
 *     try {
 *       await processData();
 *       update({
 *         id,
 *         title: "Success!",
 *         description: "Processing complete",
 *         duration: 3000,
 *       });
 *     } catch (error) {
 *       update({
 *         id,
 *         title: "Failed",
 *         description: error.message,
 *         variant: "destructive",
 *         duration: 5000,
 *       });
 *     }
 *   };
 *
 *   return <button onClick={handleProcess}>Start Process</button>;
 * }
 * ```
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
