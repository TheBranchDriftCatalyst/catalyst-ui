[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/GraphNavigator](../README.md) / NodeWithHelpers

# Type Alias: NodeWithHelpers

> **NodeWithHelpers** = [`NodeData`](../../../types/interfaces/NodeData.md) & `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/GraphNavigator.ts:31](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/GraphNavigator.ts#L31)

Node with enhanced navigation methods

Extends base NodeData with helper methods for graph traversal.

## Type Declaration

### neighbors()

> **neighbors**: () => `NodeWithHelpers`[]

Get all neighboring nodes (connected by any edge)

#### Returns

`NodeWithHelpers`[]

### outgoing()

> **outgoing**: () => [`EdgeWithHelpers`](EdgeWithHelpers.md)[]

Get all outgoing edges from this node

#### Returns

[`EdgeWithHelpers`](EdgeWithHelpers.md)[]

### incoming()

> **incoming**: () => [`EdgeWithHelpers`](EdgeWithHelpers.md)[]

Get all incoming edges to this node

#### Returns

[`EdgeWithHelpers`](EdgeWithHelpers.md)[]

### get()

> **get**: (`path`) => `any`

Safely access nested properties (e.g., "attributes.status")

#### Parameters

##### path

`string`

#### Returns

`any`
