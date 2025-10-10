[**Catalyst UI API Documentation v1.3.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [utils/shallowEqual](../README.md) / shallowEqual

# Function: shallowEqual()

> **shallowEqual**\<`T`\>(`objA`, `objB`): `boolean`

Defined in: [workspace/catalyst-ui/lib/utils/shallowEqual.ts:22](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/shallowEqual.ts#L22)

shallowEqual - Performs shallow comparison of two objects

Compares objects by checking if all keys have the same values using ===.
Useful for React.memo comparison functions and shouldComponentUpdate.

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

## Example

```typescript
const a = { x: 1, y: 2 };
const b = { x: 1, y: 2 };
shallowEqual(a, b); // true

const c = { x: 1, y: { z: 2 } };
const d = { x: 1, y: { z: 2 } };
shallowEqual(c, d); // false (nested objects are different references)
```
