[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/types](../README.md) / EdgeTypeConfig

# Interface: EdgeTypeConfig

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:169](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L169)

Configuration for a specific edge type.

## Remarks

Defines the visual appearance of an edge type. Each edge kind in your
graph should have a corresponding EdgeTypeConfig entry.

## Example

```typescript
const connectionConfig: EdgeTypeConfig = {
  label: "Connected To",
  color: "#00ff00",
};
```

## Properties

### label

> **label**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:171](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L171)

Human-readable label for UI display (e.g., filter checkboxes)

---

### color

> **color**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:174](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L174)

CSS color value for edge lines (supports CSS variables)
