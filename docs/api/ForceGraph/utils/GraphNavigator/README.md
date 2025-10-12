[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / ForceGraph/utils/GraphNavigator

# ForceGraph/utils/GraphNavigator

Graph navigation and traversal utilities

Provides enhanced graph data structures with convenience methods for
traversing relationships between nodes and edges. Makes it easy to
explore graph topology without writing manual loops.

**Key Features:**

- Helper methods on nodes: neighbors(), outgoing(), incoming()
- Direct edge.source and edge.target references
- Safe nested property access via get() method
- Type-safe TypeScript interfaces

**Use Cases:**

- Finding all neighbors of a node
- Traversing incoming/outgoing connections
- Implementing graph algorithms (BFS, DFS, etc.)
- Building custom filter predicates
- Analyzing graph topology

## Type Aliases

- [NodeWithHelpers](type-aliases/NodeWithHelpers.md)
- [EdgeWithHelpers](type-aliases/EdgeWithHelpers.md)
- [EnrichedGraph](type-aliases/EnrichedGraph.md)

## Functions

- [enrichGraph](functions/enrichGraph.md)
