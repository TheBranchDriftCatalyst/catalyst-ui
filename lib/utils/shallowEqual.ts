/**
 * shallowEqual - Performs shallow comparison of two objects
 *
 * Compares objects by checking if all keys have the same values using ===.
 * Useful for React.memo comparison functions and shouldComponentUpdate.
 *
 * @param objA - First object to compare
 * @param objB - Second object to compare
 * @returns true if objects are shallowly equal, false otherwise
 *
 * @example
 * ```typescript
 * const a = { x: 1, y: 2 };
 * const b = { x: 1, y: 2 };
 * shallowEqual(a, b); // true
 *
 * const c = { x: 1, y: { z: 2 } };
 * const d = { x: 1, y: { z: 2 } };
 * shallowEqual(c, d); // false (nested objects are different references)
 * ```
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
