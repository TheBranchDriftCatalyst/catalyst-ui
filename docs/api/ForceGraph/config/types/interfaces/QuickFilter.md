[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/types](../README.md) / QuickFilter

# Interface: QuickFilter

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:377](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L377)

Quick filter preset configuration.

## Remarks

Quick filters are preset button combinations that apply multiple filter changes
at once. They provide shortcuts for common filtering scenarios.

The `action` function receives the current filter state and returns a partial
filter state to merge in.

## Example

```typescript
const orphanedFilter: QuickFilter = {
  label: "Orphaned",
  icon: "🔍",
  className: "bg-red-500 text-white",
  action: current => ({
    showOrphanedOnly: true,
    connectionFilter: "orphaned",
    statusFilter: "all",
  }),
};

const activeOnlyFilter: QuickFilter = {
  label: "Active Only",
  icon: "▶️",
  action: () => ({
    statusFilter: "running",
    showRunningOnly: true,
    connectionFilter: "connected",
  }),
};
```

## Properties

### label

> **label**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:379](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L379)

Button label text

---

### icon

> **icon**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:382](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L382)

Emoji or icon character to display on button

---

### action()

> **action**: (`currentFilters`) => `Partial`\<[`GraphFilters`](../../../types/filterTypes/interfaces/GraphFilters.md)\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:390](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L390)

Function to compute filter changes when button is clicked.

#### Parameters

##### currentFilters

[`GraphFilters`](../../../types/filterTypes/interfaces/GraphFilters.md)

Current filter state

#### Returns

`Partial`\<[`GraphFilters`](../../../types/filterTypes/interfaces/GraphFilters.md)\>

Partial filter state to merge into current filters

---

### className?

> `optional` **className**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:393](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L393)

Optional CSS classes for button styling (Tailwind or custom)
