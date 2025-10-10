[**Catalyst UI API Documentation v1.3.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [components/ForceGraph/utils/filterPredicates](../README.md) / matchesConnectionFilter

# Function: matchesConnectionFilter()

> **matchesConnectionFilter**(`nodeId`, `filter`, `edges`): `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/filterPredicates.ts:46](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/filterPredicates.ts#L46)

Check if a node matches the connection filter
This is a graph-level property (connected/orphaned), not domain-specific

## Parameters

### nodeId

`string`

### filter

[`GraphConnectionFilter`](../../../types/filterTypes/type-aliases/GraphConnectionFilter.md)

### edges

[`EdgeData`](../../../types/interfaces/EdgeData.md)[]

## Returns

`boolean`
