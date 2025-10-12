[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/types](../README.md) / NodeTypeConfig

# Interface: NodeTypeConfig

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:134](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L134)

Configuration for a specific node type.

## Remarks

Defines the visual appearance and behavior of a node type. Each node kind
in your graph should have a corresponding NodeTypeConfig entry.

## Example

```typescript
const containerConfig: NodeTypeConfig = {
  label: "Containers",
  color: "var(--primary)",
  icon: "📦",
  renderer: CustomContainerRenderer, // Optional custom renderer
};
```

## Properties

### label

> **label**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:136](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L136)

Human-readable label for UI display (e.g., filter checkboxes)

---

### color

> **color**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:139](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L139)

CSS color value for node styling (supports CSS variables)

---

### icon

> **icon**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:142](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L142)

Emoji or icon character to display on the node

---

### renderer?

> `optional` **renderer**: `any`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:151](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L151)

Optional custom renderer component for this node type.

#### Remarks

If not provided, the default renderer will be used. Custom renderers
allow complete control over node appearance.
