[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/community](../README.md) / detectCommunities

# Function: detectCommunities()

> **detectCommunities**(`nodes`, `edges`): `Map`\<`string`, `number`\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/community.ts:81](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/community.ts#L81)

Detect communities using simplified Louvain algorithm

This function analyzes graph connectivity to identify groups of nodes that are
more densely connected to each other than to the rest of the graph.

**Usage:**

```typescript
const nodeToCommunity = detectCommunities(nodes, edges);

// Check which community a node belongs to
const community = nodeToCommunity.get(nodeId);

// Count communities
const numCommunities = new Set(nodeToCommunity.values()).size;

// Get all nodes in a specific community
const communityNodes = nodes.filter(n => nodeToCommunity.get(n.id) === targetCommunityId);
```

**Algorithm Details:**

- Uses greedy optimization to maximize intra-community connections
- Randomizes node order each iteration for better convergence
- Runs up to 20 iterations or until convergence
- Communities are renumbered sequentially (0, 1, 2, ...)

## Parameters

### nodes

[`NodeData`](../../../types/interfaces/NodeData.md)[]

Array of nodes to analyze

### edges

[`EdgeData`](../../../types/interfaces/EdgeData.md)[]

Array of edges defining connectivity

## Returns

`Map`\<`string`, `number`\>

Map from node ID to community ID (sequential integers starting at 0)

## See

[getCommunityGroups](getCommunityGroups.md) to convert map to Community objects
