[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/GraphNavigator](../README.md) / EnrichedGraph

# Type Alias: EnrichedGraph

> **EnrichedGraph** = `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/GraphNavigator.ts:61](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/GraphNavigator.ts#L61)

Graph data structure with enhanced navigation

Contains nodes (indexed by ID) and edges with bidirectional references.

## Properties

### nodes

> **nodes**: `Record`\<`string`, [`NodeWithHelpers`](NodeWithHelpers.md)\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/GraphNavigator.ts:63](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/GraphNavigator.ts#L63)

Map of node ID to node with helpers

---

### edges

> **edges**: [`EdgeWithHelpers`](EdgeWithHelpers.md)[]

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/GraphNavigator.ts:65](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/GraphNavigator.ts#L65)

Array of edges with source/target references
