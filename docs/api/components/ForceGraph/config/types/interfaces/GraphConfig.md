[**Catalyst UI API Documentation v1.3.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [components/ForceGraph/config/types](../README.md) / GraphConfig

# Interface: GraphConfig\<TNodeKind, TEdgeKind\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:87](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L87)

Generic graph configuration

## Type Parameters

### TNodeKind

`TNodeKind` _extends_ `string` = `string`

### TEdgeKind

`TEdgeKind` _extends_ `string` = `string`

## Properties

### nodeTypes

> **nodeTypes**: `Record`\<`TNodeKind`, [`NodeTypeConfig`](NodeTypeConfig.md)\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:89](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L89)

Node type configurations

---

### edgeTypes

> **edgeTypes**: `Record`\<`TEdgeKind`, [`EdgeTypeConfig`](EdgeTypeConfig.md)\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:92](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L92)

Edge type configurations

---

### attributeFilters?

> `optional` **attributeFilters**: [`AttributeFilter`](AttributeFilter.md)[]

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:95](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L95)

Custom attribute-based filters

---

### quickFilters?

> `optional` **quickFilters**: [`QuickFilter`](QuickFilter.md)[]

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:98](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L98)

Quick filter preset buttons

---

### title?

> `optional` **title**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:101](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L101)

Graph title (defaults to "FORCE GRAPH")

---

### defaultNodeRenderer?

> `optional` **defaultNodeRenderer**: [`NodeRenderer`](../type-aliases/NodeRenderer.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:104](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L104)

Default node renderer (fallback)

---

### getNodeDimensions()?

> `optional` **getNodeDimensions**: (`node`) => `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:107](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L107)

Custom node dimension calculator

#### Parameters

##### node

[`NodeData`](../../../types/interfaces/NodeData.md)

#### Returns

`object`

##### width

> **width**: `number`

##### height

> **height**: `number`

---

### statusFilterOptions?

> `optional` **statusFilterOptions**: [`FilterOption`](FilterOption.md)\<`any`\>[]

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:114](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L114)

Domain-specific status filter options for UI
Example: For Docker - running, stopped, in-use
These are specific to the domain and not graph-level properties

---

### customFilterOptions?

> `optional` **customFilterOptions**: `Record`\<`string`, [`FilterOption`](FilterOption.md)\<`any`\>[]\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:120](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L120)

Additional custom filter options for domain-specific filters
Use this for any other domain-specific filters beyond status
