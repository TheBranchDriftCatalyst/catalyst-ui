[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/filterPredicates](../README.md) / isOrphanedNode

# Function: isOrphanedNode()

> **isOrphanedNode**(`nodeId`, `edges`): `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/filterPredicates.ts:54](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/filterPredicates.ts#L54)

Check if a node is orphaned (has no edges)

An orphaned node has no incoming or outgoing connections in the graph.
This is a structural graph property, independent of domain-specific data.

**Use Cases:**

- Finding isolated nodes
- Detecting potential data quality issues
- Filtering out disconnected components
- Highlighting unused entities

**Performance:**

- Time Complexity: O(e) where e = number of edges
- Called once per node during filtering
- Consider caching for large graphs

## Parameters

### nodeId

`string`

ID of node to check

### edges

[`EdgeData`](../../../types/interfaces/EdgeData.md)[]

All edges in the graph

## Returns

`boolean`

true if node has no connections, false otherwise

## Example

```typescript
const orphans = nodes.filter(node => isOrphanedNode(node.id, edges));
console.log(`Found ${orphans.length} orphaned nodes`);
```
