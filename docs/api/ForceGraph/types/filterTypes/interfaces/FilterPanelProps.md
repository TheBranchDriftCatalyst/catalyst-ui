[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/types/filterTypes](../README.md) / FilterPanelProps

# Interface: FilterPanelProps

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:228](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L228)

Props for the filter panel component.

## Remarks

Controls the visibility and toggle behavior of the filter panel UI.
The filter panel typically slides in/out from the side of the graph.

## Example

```typescript
function FilterPanel({ isVisible, onToggle }: FilterPanelProps) {
  return (
    <div className={isVisible ? 'visible' : 'hidden'}>
      <button onClick={onToggle}>Close</button>
      {/* Filter controls... */}
    </div>
  );
}
```

## Properties

### isVisible

> **isVisible**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:230](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L230)

Whether the filter panel is currently visible

---

### onToggle()

> **onToggle**: () => `void`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:233](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L233)

Callback to toggle filter panel visibility

#### Returns

`void`
