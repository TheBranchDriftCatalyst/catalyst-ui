/**
 * Toaster - Global toast container component.
 *
 * Renders all active toasts managed by the useToast hook.
 * This component should be included once at the root of your application.
 *
 * @module toaster
 *
 * @example
 * ```tsx
 * // In your root layout or App component
 * import { Toaster } from "@/catalyst-ui/ui/toaster";
 *
 * function App() {
 *   return (
 *     <>
 *       <YourAppContent />
 *       <Toaster />
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Then use toast anywhere in your app
 * import { toast } from "@/catalyst-ui/ui/use-toast";
 *
 * function MyComponent() {
 *   const handleClick = () => {
 *     toast({
 *       title: "Success!",
 *       description: "Your action completed successfully.",
 *     });
 *   };
 *
 *   return <button onClick={handleClick}>Show Toast</button>;
 * }
 * ```
 */
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
} from "./toast";
import { useToast } from "./use-toast";

/**
 * Toaster component that renders all active toasts.
 *
 * Subscribes to the global toast state and renders each toast
 * with its configured properties. Handles toast lifecycle,
 * animations, and portal rendering automatically.
 *
 * @returns The toast container with all active toasts
 *
 * @remarks
 * This component uses Radix UI Portal for rendering toasts outside
 * the normal DOM hierarchy, ensuring they appear above all other content.
 * It should only be rendered once per application.
 */
export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, animation, ...props }) {
        return (
          <Toast key={id} animation={animation} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
