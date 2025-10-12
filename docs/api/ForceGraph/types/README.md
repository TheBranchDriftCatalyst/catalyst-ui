[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / ForceGraph/types

# ForceGraph/types

Core type definitions for the ForceGraph component system.

This module provides the fundamental data structures for building interactive
force-directed graphs with D3.js. While the current implementation uses Docker
types for backwards compatibility, the system is designed to be domain-agnostic.

## Example

```typescript
// Create a simple graph
const graphData: GraphData = {
  nodes: {
    node1: { id: "node1", kind: "container", name: "web-server" },
    node2: { id: "node2", kind: "network", name: "bridge-net" },
  },
  edges: [
    { src: "node1", dst: "node2", kind: "connected_to", source: nodes.node1, target: nodes.node2 },
  ],
};
```

## Interfaces

- [NodeData](interfaces/NodeData.md)
- [EdgeData](interfaces/EdgeData.md)
- [GraphData](interfaces/GraphData.md)
- [GraphDimensions](interfaces/GraphDimensions.md)
- [VisibilityState](interfaces/VisibilityState.md)
- [GraphEventHandlers](interfaces/GraphEventHandlers.md)
- [ReactD3GraphProps](interfaces/ReactD3GraphProps.md)
- [ForceGraphProps](interfaces/ForceGraphProps.md)

## Type Aliases

- [NodeID](type-aliases/NodeID.md)
- [~~NodeKind~~](type-aliases/NodeKind.md)
- [~~EdgeKind~~](type-aliases/EdgeKind.md)

## Functions

- [~~isContainerNode~~](functions/isContainerNode.md)
- [~~isNetworkNode~~](functions/isNetworkNode.md)
- [~~isImageNode~~](functions/isImageNode.md)
- [~~isVolumeNode~~](functions/isVolumeNode.md)
