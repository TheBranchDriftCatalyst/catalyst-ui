[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/types](../README.md) / FilterOption

# Interface: FilterOption\<T\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:335](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L335)

Generic filter option for UI components.

## Remarks

Used in select filters, dropdowns, and other UI components that need
a value/label pair for display.

## Example

```typescript
const statusOptions: FilterOption<string>[] = [
  { value: "all", label: "All Status" },
  { value: "running", label: "Running" },
  { value: "stopped", label: "Stopped" },
];

const priorityOptions: FilterOption<number>[] = [
  { value: 1, label: "High" },
  { value: 2, label: "Medium" },
  { value: 3, label: "Low" },
];
```

## Type Parameters

### T

`T` = `string`

Type of the option value (defaults to string)

## Properties

### value

> **value**: `T`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:337](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L337)

Option value (used in filter state)

---

### label

> **label**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:340](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L340)

Human-readable label for UI display
