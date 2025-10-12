[**Catalyst UI API Documentation v1.4.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [components/ForceGraph/hooks/useGraphFilters](../README.md) / useGraphFilters

# Function: useGraphFilters()

> **useGraphFilters**(`config?`): `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/hooks/useGraphFilters.ts:16](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/hooks/useGraphFilters.ts#L16)

## Parameters

### config?

[`GraphConfig`](../../../../../ForceGraph/config/types/interfaces/GraphConfig.md)\<`any`, `any`\>

## Returns

`object`

### filters

> **filters**: [`GraphFilters`](../../../../../ForceGraph/types/filterTypes/interfaces/GraphFilters.md) = `state.filters`

### filteredData

> **filteredData**: `null` \| [`GraphData`](../../../../../ForceGraph/types/interfaces/GraphData.md) = `state.filteredData`

### updateFilters()

> **updateFilters**: (`newFilters`) => `void`

#### Parameters

##### newFilters

`Partial`\<[`GraphFilters`](../../../../../ForceGraph/types/filterTypes/interfaces/GraphFilters.md)\>

#### Returns

`void`

### toggleNodeVisibility()

> **toggleNodeVisibility**: (`nodeKind`) => `void`

#### Parameters

##### nodeKind

[`NodeKind`](../../../../../ForceGraph/types/type-aliases/NodeKind.md)

#### Returns

`void`

### toggleEdgeVisibility()

> **toggleEdgeVisibility**: (`edgeKind`) => `void`

#### Parameters

##### edgeKind

[`EdgeKind`](../../../../../ForceGraph/types/type-aliases/EdgeKind.md)

#### Returns

`void`

### resetFilters()

> **resetFilters**: () => `void`

#### Returns

`void`

### setStatusFilter()

> **setStatusFilter**: (`filter`) => `void`

#### Parameters

##### filter

`string`

#### Returns

`void`

### setConnectionFilter()

> **setConnectionFilter**: (`filter`) => `void`

#### Parameters

##### filter

[`GraphConnectionFilter`](../../../../../ForceGraph/types/filterTypes/type-aliases/GraphConnectionFilter.md)

#### Returns

`void`

### setSearchQuery()

> **setSearchQuery**: (`query`) => `void`

#### Parameters

##### query

`string`

#### Returns

`void`

### toggleOrphanedOnly()

> **toggleOrphanedOnly**: () => `void`

#### Returns

`void`

### toggleRunningOnly()

> **toggleRunningOnly**: () => `void`

#### Returns

`void`

### toggleInUseOnly()

> **toggleInUseOnly**: () => `void`

#### Returns

`void`

### setAttributeFilterValue()

> **setAttributeFilterValue**: (`filterName`, `value`) => `void`

#### Parameters

##### filterName

`string`

##### value

`any`

#### Returns

`void`

### clearAttributeFilter()

> **clearAttributeFilter**: (`filterName`) => `void`

#### Parameters

##### filterName

`string`

#### Returns

`void`

### excludeNode()

> **excludeNode**: (`nodeId`) => `void`

#### Parameters

##### nodeId

`string`

#### Returns

`void`

### includeNode()

> **includeNode**: (`nodeId`) => `void`

#### Parameters

##### nodeId

`string`

#### Returns

`void`

### clearExcluded()

> **clearExcluded**: () => `void`

#### Returns

`void`

### showOnlyOrphaned()

> **showOnlyOrphaned**: () => `void`

#### Returns

`void`

### showOnlyRunning()

> **showOnlyRunning**: () => `void`

#### Returns

`void`

### showMinimalView()

> **showMinimalView**: () => `void`

#### Returns

`void`

### isOrphanedNode()

> **isOrphanedNode**: (`nodeId`) => `boolean`

#### Parameters

##### nodeId

`string`

#### Returns

`boolean`
