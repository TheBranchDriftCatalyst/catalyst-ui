[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/filterPredicates](../README.md) / matchesConnectionFilter

# Function: matchesConnectionFilter()

> **matchesConnectionFilter**(`nodeId`, `filter`, `edges`): `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/filterPredicates.ts:138](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/filterPredicates.ts#L138)

Check if a node matches the connection filter

Filters nodes based on their connectivity in the graph structure.
This is a graph-level filter (not domain-specific).

**Filter Values:**

- `"all"` → all nodes pass
- `"connected"` → only nodes with at least one edge
- `"orphaned"` → only nodes with no edges

**Use Cases:**

- Show only connected components
- Highlight isolated nodes for investigation
- Clean up visualization by hiding orphans

## Parameters

### nodeId

`string`

ID of node to check

### filter

[`GraphConnectionFilter`](../../../types/filterTypes/type-aliases/GraphConnectionFilter.md)

Connection filter type

### edges

[`EdgeData`](../../../types/interfaces/EdgeData.md)[]

All edges in graph

## Returns

`boolean`

true if node matches filter

## Example

```typescript
// Show only connected nodes
const connectedNodes = nodes.filter(n => matchesConnectionFilter(n.id, "connected", edges));
```

## See

[isOrphanedNode](isOrphanedNode.md) for the underlying orphan detection
