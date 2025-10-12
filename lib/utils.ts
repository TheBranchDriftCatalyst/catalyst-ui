import { clsx, type ClassValue } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export * from "./utils/logger";
export * from "./utils/shallowEqual";

/**
 * Merge Tailwind CSS classes with proper conflict resolution
 *
 * Combines multiple class names using `clsx` for conditional classes
 * and `tailwind-merge` for handling Tailwind-specific conflicts.
 * Later classes take precedence over earlier ones.
 *
 * @param inputs - Class names to merge (strings, objects, arrays, conditionals)
 * @returns Single merged className string with conflicts resolved
 *
 * @example
 * ```tsx
 * // Basic merging
 * cn('px-4 py-2', 'rounded-md')
 * // => 'px-4 py-2 rounded-md'
 *
 * // Conflict resolution (later wins)
 * cn('px-4', 'px-2')
 * // => 'px-2'
 *
 * // Conditional classes
 * cn('text-red-500', isActive && 'text-blue-500')
 * // => 'text-blue-500' (if isActive is true)
 *
 * // Complex example with component props
 * <Button className={cn('bg-primary', className)} />
 * ```
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * Add React keys to children elements that don't have them
 *
 * Iterates through React children and ensures each valid element has a key prop.
 * Useful when mapping over children without explicit keys. Uses array index as
 * fallback key for children without existing keys.
 *
 * **Note:** Index-based keys are generally discouraged for dynamic lists, but
 * acceptable for static children that won't be reordered.
 *
 * @param children - React children elements to process
 * @returns Children array with keys added where missing
 *
 * @example
 * ```tsx
 * // Inside a component that accepts children
 * function Tabs({ children }) {
 *   return (
 *     <div className="tabs">
 *       {addKeysToChildren(children)}
 *     </div>
 *   );
 * }
 *
 * // Usage (children without explicit keys)
 * <Tabs>
 *   <TabPanel>First</TabPanel>
 *   <TabPanel>Second</TabPanel>
 * </Tabs>
 * ```
 */
export const addKeysToChildren = (children: React.ReactNode): React.ReactNode => {
  return React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      // Check if the child already has a key
      if (child.key != null) {
        return child;
      }
      return React.cloneElement(child, { key: index });
    }
    return child;
  });
};
