[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/GraphNavigator](../README.md) / enrichGraph

# Function: enrichGraph()

> **enrichGraph**(`data`): [`EnrichedGraph`](../type-aliases/EnrichedGraph.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/GraphNavigator.ts:169](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/GraphNavigator.ts#L169)

Enrich graph data with navigation helper methods

Transforms a plain graph data structure into an enhanced version with
bidirectional references and convenience methods. This makes graph
traversal much easier and more intuitive.

**What It Does:**

1. Creates NodeWithHelpers for each node (with get(), neighbors(), etc.)
2. Creates EdgeWithHelpers for each edge (with source, target references)
3. Wires up bidirectional relationships:
   - Nodes know their incoming/outgoing edges
   - Edges know their source/target nodes
   - Nodes can find all neighbors

**Usage:**

```typescript
const enriched = enrichGraph(graphData);

// Access nodes by ID
const node = enriched.nodes["node-123"];

// Get neighbors
const neighbors = node.neighbors();

// Traverse outgoing edges
node.outgoing().forEach(edge => {
  console.log(`${node.id} -> ${edge.target.id}`);
});

// Safe property access
const status = node.get("attributes.status");

// Traverse incoming edges
node.incoming().forEach(edge => {
  console.log(`${edge.source.id} -> ${node.id}`);
});
```

**Performance:**

- Time Complexity: O(n + e) where n = nodes, e = edges
- Space Complexity: O(n + e) - creates new objects
- Called once when graph data changes
- Results can be cached/memoized

**Use Cases:**

- Implementing breadth-first search (BFS)
- Finding shortest paths
- Detecting cycles
- Calculating node centrality
- Custom filtering based on topology

## Parameters

### data

[`GraphData`](../../../types/interfaces/GraphData.md)

Plain graph data (nodes and edges)

## Returns

[`EnrichedGraph`](../type-aliases/EnrichedGraph.md)

Enriched graph with helper methods

## Example

```typescript
// Find all nodes reachable from a starting node (BFS)
function findReachable(start: NodeWithHelpers): Set<string> {
  const visited = new Set<string>();
  const queue = [start];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (visited.has(node.id)) continue;
    visited.add(node.id);

    node.neighbors().forEach(neighbor => queue.push(neighbor));
  }

  return visited;
}
```
