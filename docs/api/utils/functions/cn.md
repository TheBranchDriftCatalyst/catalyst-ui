[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / [utils](../README.md) / cn

# Function: cn()

> **cn**(...`inputs`): `string`

Defined in: [workspace/catalyst-ui/lib/utils.ts:36](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils.ts#L36)

Merge Tailwind CSS classes with proper conflict resolution

Combines multiple class names using `clsx` for conditional classes
and `tailwind-merge` for handling Tailwind-specific conflicts.
Later classes take precedence over earlier ones.

## Parameters

### inputs

...`ClassValue`[]

Class names to merge (strings, objects, arrays, conditionals)

## Returns

`string`

Single merged className string with conflicts resolved

## Example

```tsx
// Basic merging
cn('px-4 py-2', 'rounded-md')
// => 'px-4 py-2 rounded-md'

// Conflict resolution (later wins)
cn('px-4', 'px-2')
// => 'px-2'

// Conditional classes
cn('text-red-500', isActive && 'text-blue-500')
// => 'text-blue-500' (if isActive is true)

// Complex example with component props
<Button className={cn('bg-primary', className)} />
```
