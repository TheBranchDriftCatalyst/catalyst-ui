[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ForceGraph/types](../README.md) / VisibilityState

# Interface: VisibilityState

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:282](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L282)

Visibility state for filtering nodes and edges by type.

## Remarks

Controls which node/edge types are visible in the graph. When a node type
is hidden, all nodes of that type are filtered out. When an edge type is
hidden, all edges of that type are not rendered (but their connected nodes
may still be visible).

## Example

```typescript
const visibility: VisibilityState = {
  visibleNodes: {
    container: true,
    network: true,
    image: false, // Hide all image nodes
    volume: true,
  },
  visibleEdges: {
    derived_from: false, // Hide derivation edges
    connected_to: true,
    mounted_into: true,
  },
};
```

## Extended by

- [`ReactD3GraphProps`](ReactD3GraphProps.md)

## Properties

### visibleNodes

> **visibleNodes**: `Record`\<[`NodeKind`](../type-aliases/NodeKind.md), `boolean`\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:284](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L284)

Visibility flags for each node type

---

### visibleEdges

> **visibleEdges**: `Record`\<[`EdgeKind`](../type-aliases/EdgeKind.md), `boolean`\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:287](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L287)

Visibility flags for each edge type
