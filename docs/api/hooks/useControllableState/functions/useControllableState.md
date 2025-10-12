[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [hooks/useControllableState](../README.md) / useControllableState

# Function: useControllableState()

> **useControllableState**\<`T`\>(`controlledValue`, `defaultValue`, `onChange?`): \[`T`, (`value`) => `void`\]

Defined in: [workspace/catalyst-ui/lib/hooks/useControllableState.ts:26](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useControllableState.ts#L26)

useControllableState - Manages controlled/uncontrolled state pattern

This hook provides a unified way to handle components that can be either
controlled or uncontrolled. It's commonly used for form inputs, toggles,
and interactive components.

## Type Parameters

### T

`T`

The type of the state value

## Parameters

### controlledValue

The controlled value from props (undefined if uncontrolled)

`undefined` | `T`

### defaultValue

`T`

The default value for uncontrolled mode

### onChange?

(`value`) => `void`

Callback invoked when state should change (controlled mode)

## Returns

\[`T`, (`value`) => `void`\]

A tuple of [value, setValue] similar to useState

## Example

```tsx
// In a component
const [isOpen, setIsOpen] = useControllableState(props.isOpen, false, props.onOpenChange);
```
