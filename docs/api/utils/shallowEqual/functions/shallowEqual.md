[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [utils/shallowEqual](../README.md) / shallowEqual

# Function: shallowEqual()

> **shallowEqual**\<`T`\>(`objA`, `objB`): `boolean`

Defined in: [workspace/catalyst-ui/lib/utils/shallowEqual.ts:95](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/shallowEqual.ts#L95)

shallowEqual - Performs shallow comparison of two objects

Compares objects by checking if all keys have the same values using strict equality (===).
Only compares first-level properties - nested objects are compared by reference, not value.

**When to use:**

- React.memo comparison functions to prevent unnecessary re-renders
- Custom shouldComponentUpdate implementations
- Props comparison in custom hooks
- Performance optimization when deep equality is not needed

**When NOT to use:**

- Objects with nested data structures that need deep comparison
- Arrays containing objects (use deep equality instead)
- When referential equality is sufficient (use `===`)

**Performance:**

- O(n) where n is the number of keys in the larger object
- Faster than deep equality checks
- Early returns for null/undefined cases
- Short-circuits on first inequality

## Type Parameters

### T

`T` _extends_ `Record`\<`string`, `any`\>

## Parameters

### objA

First object to compare

`undefined` | `null` | `T`

### objB

Second object to compare

`undefined` | `null` | `T`

## Returns

`boolean`

true if objects are shallowly equal, false otherwise

## Examples

```tsx
// Basic usage - primitive values
const a = { x: 1, y: 2, name: "test" };
const b = { x: 1, y: 2, name: "test" };
shallowEqual(a, b); // true

// Different values
const c = { x: 1, y: 2 };
const d = { x: 1, y: 3 };
shallowEqual(c, d); // false

// Nested objects (compared by reference)
const e = { x: 1, nested: { value: 2 } };
const f = { x: 1, nested: { value: 2 } };
shallowEqual(e, f); // false (different object references)

// Same reference for nested objects
const nested = { value: 2 };
const g = { x: 1, nested };
const h = { x: 1, nested };
shallowEqual(g, h); // true (same reference)
```

```tsx
// React.memo with custom comparison
const MyComponent = React.memo(
  ({ data, onUpdate }) => {
    return <div>{data.title}</div>;
  },
  (prevProps, nextProps) => {
    // Only re-render if data has changed (shallow comparison)
    return shallowEqual(prevProps.data, nextProps.data);
  }
);
```

```tsx
// Custom hook with shallow props comparison
function useShallowEffect(effect: EffectCallback, deps: Record<string, any>) {
  const prevDeps = useRef(deps);

  useEffect(() => {
    if (!shallowEqual(prevDeps.current, deps)) {
      prevDeps.current = deps;
      return effect();
    }
  }, [deps]);
}
```

```tsx
// Handling null/undefined
shallowEqual(null, null); // true
shallowEqual(undefined, undefined); // true
shallowEqual(null, undefined); // false
shallowEqual({ x: 1 }, null); // false
```

## Note

This function uses Object.keys() which only iterates over enumerable properties.
Non-enumerable properties and Symbols are not compared.

## See

[https://react.dev/reference/react/memo](https://react.dev/reference/react/memo) - React.memo documentation
