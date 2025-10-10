[**Catalyst UI API Documentation v1.3.0**](../../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../../README.md) / [components/ForceGraph/utils/layering/community](../README.md) / applyCommunityLayout

# Function: applyCommunityLayout()

> **applyCommunityLayout**(`nodes`, `edges`, `dimensions`, `options`): `Simulation`\<`any`, `undefined`\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/layering/community.ts:130](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/layering/community.ts#L130)

Apply community-based layout with calculated positioning
Returns simulation for compatibility (nodes are already positioned)

## Parameters

### nodes

[`NodeData`](../../../../types/interfaces/NodeData.md)[]

### edges

[`EdgeData`](../../../../types/interfaces/EdgeData.md)[]

### dimensions

[`LayoutDimensions`](../../../layouts/interfaces/LayoutDimensions.md)

### options

[`CommunityLayoutOptions`](../interfaces/CommunityLayoutOptions.md) = `{}`

## Returns

`Simulation`\<`any`, `undefined`\>
