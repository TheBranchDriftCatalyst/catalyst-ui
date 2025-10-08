import { useCallback, useState } from "react";

/**
 * useControllableState - Manages controlled/uncontrolled state pattern
 *
 * This hook provides a unified way to handle components that can be either
 * controlled or uncontrolled. It's commonly used for form inputs, toggles,
 * and interactive components.
 *
 * @template T - The type of the state value
 * @param controlledValue - The controlled value from props (undefined if uncontrolled)
 * @param defaultValue - The default value for uncontrolled mode
 * @param onChange - Callback invoked when state should change (controlled mode)
 * @returns A tuple of [value, setValue] similar to useState
 *
 * @example
 * ```tsx
 * // In a component
 * const [isOpen, setIsOpen] = useControllableState(
 *   props.isOpen,
 *   false,
 *   props.onOpenChange
 * );
 * ```
 */
export function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): [T, (value: T | ((prev: T) => T)) => void] {
  const [internalValue, setInternalValue] = useState<T>(defaultValue);

  // Determine if the component is controlled
  const isControlled = controlledValue !== undefined;

  // Use controlled value if provided, otherwise use internal state
  const value = isControlled ? controlledValue : internalValue;

  // Handle state changes for both controlled and uncontrolled modes
  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      // Resolve functional updates
      const resolvedValue =
        typeof newValue === "function" ? (newValue as (prev: T) => T)(value) : newValue;

      if (isControlled) {
        // In controlled mode, notify parent via callback
        onChange?.(resolvedValue);
      } else {
        // In uncontrolled mode, update internal state
        setInternalValue(resolvedValue);
      }
    },
    [isControlled, onChange, value]
  );

  return [value, setValue];
}
