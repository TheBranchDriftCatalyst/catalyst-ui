[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/types/filterTypes](../README.md) / NodeTypeOption

# Interface: NodeTypeOption

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:258](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L258)

UI option for a node type in filter controls.

## Remarks

Represents a single node type that can be toggled in the visibility filters.
Includes visual metadata (label, color) for rendering checkboxes or toggles.

## Example

```typescript
const containerOption: NodeTypeOption = {
  kind: 'container',
  label: 'Containers',
  color: 'var(--primary)'
};

// Render as checkbox
<label style={{ color: containerOption.color }}>
  <input type="checkbox" />
  {containerOption.label}
</label>
```

## Properties

### kind

> **kind**: [`NodeKind`](../../type-aliases/NodeKind.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:260](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L260)

The node kind identifier (matches NodeKind)

---

### label

> **label**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:263](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L263)

Human-readable label for UI display

---

### color

> **color**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:266](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L266)

CSS color value for visual consistency with node rendering
