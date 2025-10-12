[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/community](../README.md) / getCommunityGroups

# Function: getCommunityGroups()

> **getCommunityGroups**(`_nodes`, `nodeToCommunity`): [`Community`](../interfaces/Community.md)[]

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/community.ts:200](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/community.ts#L200)

Convert community map to structured Community objects

Transforms the flat node-to-community map returned by [detectCommunities](detectCommunities.md)
into an array of Community objects, each containing its member nodes.

**Usage:**

```typescript
const nodeToCommunity = detectCommunities(nodes, edges);
const communities = getCommunityGroups(nodes, nodeToCommunity);

// Iterate through communities
communities.forEach(community => {
  console.log(`Community ${community.id} has ${community.nodes.length} nodes`);
  community.nodes.forEach(nodeId => {
    // Access node data
    const node = nodes.find(n => n.id === nodeId);
  });
});

// Find largest community
const largest = communities.reduce((max, c) => (c.nodes.length > max.nodes.length ? c : max));
```

## Parameters

### \_nodes

[`NodeData`](../../../types/interfaces/NodeData.md)[]

Original node array (currently unused, kept for API compatibility)

### nodeToCommunity

`Map`\<`string`, `number`\>

Map from node ID to community ID

## Returns

[`Community`](../interfaces/Community.md)[]

Array of Community objects, each containing an ID and member node IDs

## See

[detectCommunities](detectCommunities.md) for generating the node-to-community map
