/**
 * shallowEqual - Performs shallow comparison of two objects
 *
 * Compares objects by checking if all keys have the same values using strict equality (===).
 * Only compares first-level properties - nested objects are compared by reference, not value.
 *
 * **When to use:**
 * - React.memo comparison functions to prevent unnecessary re-renders
 * - Custom shouldComponentUpdate implementations
 * - Props comparison in custom hooks
 * - Performance optimization when deep equality is not needed
 *
 * **When NOT to use:**
 * - Objects with nested data structures that need deep comparison
 * - Arrays containing objects (use deep equality instead)
 * - When referential equality is sufficient (use `===`)
 *
 * **Performance:**
 * - O(n) where n is the number of keys in the larger object
 * - Faster than deep equality checks
 * - Early returns for null/undefined cases
 * - Short-circuits on first inequality
 *
 * @param objA - First object to compare
 * @param objB - Second object to compare
 * @returns true if objects are shallowly equal, false otherwise
 *
 * @example
 * ```tsx
 * // Basic usage - primitive values
 * const a = { x: 1, y: 2, name: "test" };
 * const b = { x: 1, y: 2, name: "test" };
 * shallowEqual(a, b); // true
 *
 * // Different values
 * const c = { x: 1, y: 2 };
 * const d = { x: 1, y: 3 };
 * shallowEqual(c, d); // false
 *
 * // Nested objects (compared by reference)
 * const e = { x: 1, nested: { value: 2 } };
 * const f = { x: 1, nested: { value: 2 } };
 * shallowEqual(e, f); // false (different object references)
 *
 * // Same reference for nested objects
 * const nested = { value: 2 };
 * const g = { x: 1, nested };
 * const h = { x: 1, nested };
 * shallowEqual(g, h); // true (same reference)
 * ```
 *
 * @example
 * ```tsx
 * // React.memo with custom comparison
 * const MyComponent = React.memo(
 *   ({ data, onUpdate }) => {
 *     return <div>{data.title}</div>;
 *   },
 *   (prevProps, nextProps) => {
 *     // Only re-render if data has changed (shallow comparison)
 *     return shallowEqual(prevProps.data, nextProps.data);
 *   }
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Custom hook with shallow props comparison
 * function useShallowEffect(effect: EffectCallback, deps: Record<string, any>) {
 *   const prevDeps = useRef(deps);
 *
 *   useEffect(() => {
 *     if (!shallowEqual(prevDeps.current, deps)) {
 *       prevDeps.current = deps;
 *       return effect();
 *     }
 *   }, [deps]);
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Handling null/undefined
 * shallowEqual(null, null);           // true
 * shallowEqual(undefined, undefined); // true
 * shallowEqual(null, undefined);      // false
 * shallowEqual({ x: 1 }, null);       // false
 * ```
 *
 * @note This function uses Object.keys() which only iterates over enumerable properties.
 * Non-enumerable properties and Symbols are not compared.
 *
 * @see {@link https://react.dev/reference/react/memo} - React.memo documentation
 */
export function shallowEqual<T extends Record<string, any>>(
  objA: T | null | undefined,
  objB: T | null | undefined
): boolean {
  // Handle null/undefined cases
  if (objA === objB) return true;
  if (!objA || !objB) return false;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  // Different number of keys
  if (keysA.length !== keysB.length) return false;

  // Check if all keys and values match
  return keysA.every(
    key => Object.prototype.hasOwnProperty.call(objB, key) && objA[key] === objB[key]
  );
}
