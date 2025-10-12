[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ForceGraph/types](../README.md) / GraphData

# Interface: GraphData

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:225](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L225)

Complete graph data structure containing all nodes and edges.

## Remarks

The graph data structure uses a dictionary for nodes (O(1) lookup by ID)
and an array for edges (easy iteration for rendering).

## Example

```typescript
const graph: GraphData = {
  nodes: {
    web: { id: "web", kind: "container", name: "web-server" },
    db: { id: "db", kind: "container", name: "database" },
    net: { id: "net", kind: "network", name: "app-network" },
  },
  edges: [
    { src: "web", dst: "net", kind: "connected_to", source: nodes.web, target: nodes.net },
    { src: "db", dst: "net", kind: "connected_to", source: nodes.db, target: nodes.net },
  ],
};
```

## Properties

### nodes

> **nodes**: `Record`\<`string`, [`NodeData`](NodeData.md)\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:227](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L227)

Dictionary of nodes indexed by ID for fast lookups

---

### edges

> **edges**: [`EdgeData`](EdgeData.md)[]

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:230](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L230)

Array of edges connecting nodes
