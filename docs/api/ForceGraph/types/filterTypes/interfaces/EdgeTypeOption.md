[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/types/filterTypes](../README.md) / EdgeTypeOption

# Interface: EdgeTypeOption

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:290](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L290)

UI option for an edge type in filter controls.

## Remarks

Represents a single edge type that can be toggled in the visibility filters.
Includes human-readable label for rendering checkboxes or toggles.

## Example

```typescript
const connectionOption: EdgeTypeOption = {
  kind: 'connected_to',
  label: 'Connected To'
};

// Render as checkbox
<label>
  <input type="checkbox" />
  {connectionOption.label}
</label>
```

## Properties

### kind

> **kind**: [`EdgeKind`](../../type-aliases/EdgeKind.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:292](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L292)

The edge kind identifier (matches EdgeKind)

---

### label

> **label**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:295](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L295)

Human-readable label for UI display
