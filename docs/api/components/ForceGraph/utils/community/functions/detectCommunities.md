[**Catalyst UI API Documentation v1.3.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [components/ForceGraph/utils/community](../README.md) / detectCommunities

# Function: detectCommunities()

> **detectCommunities**(`nodes`, `edges`): `Map`\<`string`, `number`\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/community.ts:17](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/community.ts#L17)

Detect communities using simplified Louvain algorithm
Returns map of nodeId -> communityId

## Parameters

### nodes

[`NodeData`](../../../types/interfaces/NodeData.md)[]

### edges

[`EdgeData`](../../../types/interfaces/EdgeData.md)[]

## Returns

`Map`\<`string`, `number`\>
