[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ForceGraph/types](../README.md) / GraphEventHandlers

# Interface: GraphEventHandlers

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:311](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L311)

Event handlers for graph interactions.

## Remarks

Manages hover and selection state for interactive graph behaviors.
These handlers are passed down to the ReactD3Graph component and used
in node rendering to show visual feedback.

## Example

```typescript
const [hoveredNode, setHoveredNode] = useState<string | null>(null);
const [selectedNode, setSelectedNode] = useState<string | null>(null);

const handlers: GraphEventHandlers = {
  setHoveredNode,
  setSelectedNode,
  hoveredNode,
  selectedNode,
};
```

## Extended by

- [`ReactD3GraphProps`](ReactD3GraphProps.md)

## Properties

### setHoveredNode()

> **setHoveredNode**: (`id`) => `void`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:313](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L313)

Callback to update the currently hovered node ID

#### Parameters

##### id

`null` | `string`

#### Returns

`void`

---

### setSelectedNode

> **setSelectedNode**: `Dispatch`\<`SetStateAction`\<`null` \| `string`\>\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:316](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L316)

Callback to update the currently selected node ID

---

### hoveredNode

> **hoveredNode**: `null` \| `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:319](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L319)

Currently hovered node ID (null if none)

---

### selectedNode

> **selectedNode**: `null` \| `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:322](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L322)

Currently selected node ID (null if none)
