[**Catalyst UI API Documentation v1.3.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [components/ForceGraph/hooks/useGraphState](../README.md) / useGraphState

# Function: useGraphState()

> **useGraphState**(): `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/hooks/useGraphState.ts:6](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/hooks/useGraphState.ts#L6)

## Returns

`object`

### rawData

> **rawData**: `null` \| [`GraphData`](../../../types/interfaces/GraphData.md) = `state.rawData`

### filteredData

> **filteredData**: `null` \| [`GraphData`](../../../types/interfaces/GraphData.md) = `state.filteredData`

### hoveredNode

> **hoveredNode**: `null` \| `string` = `state.hoveredNode`

### selectedNode

> **selectedNode**: `null` \| `string` = `state.selectedNode`

### dimensions

> **dimensions**: `object` = `state.dimensions`

#### dimensions.width

> **width**: `number`

#### dimensions.height

> **height**: `number`

### layout

> **layout**: [`LayoutKind`](../../../utils/layouts/type-aliases/LayoutKind.md) = `state.layout`

### layoutOptions

> **layoutOptions**: `Record`\<`string`, `any`\> = `state.layoutOptions`

### orthogonalEdges

> **orthogonalEdges**: `boolean` = `state.orthogonalEdges`

### filters

> **filters**: [`GraphFilters`](../../../types/filterTypes/interfaces/GraphFilters.md) = `state.filters`

### setRawData()

> **setRawData**: (`data`) => `void`

#### Parameters

##### data

[`GraphData`](../../../types/interfaces/GraphData.md)

#### Returns

`void`

### setHoveredNode()

> **setHoveredNode**: (`nodeId`) => `void`

#### Parameters

##### nodeId

`null` | `string`

#### Returns

`void`

### setSelectedNode()

> **setSelectedNode**: (`nodeId`) => `void`

#### Parameters

##### nodeId

`null` | `string`

#### Returns

`void`

### setDimensions()

> **setDimensions**: (`dimensions`) => `void`

#### Parameters

##### dimensions

###### width

`number`

###### height

`number`

#### Returns

`void`

### setLayout()

> **setLayout**: (`layout`) => `void`

#### Parameters

##### layout

[`LayoutKind`](../../../utils/layouts/type-aliases/LayoutKind.md)

#### Returns

`void`

### setLayoutOptions()

> **setLayoutOptions**: (`options`) => `void`

#### Parameters

##### options

`Record`\<`string`, `any`\>

#### Returns

`void`

### toggleOrthogonalEdges()

> **toggleOrthogonalEdges**: () => `void`

#### Returns

`void`

### getNodeInfo()

> **getNodeInfo**: (`nodeId`) => `undefined` \| [`NodeData`](../../../types/interfaces/NodeData.md)

#### Parameters

##### nodeId

`null` | `string`

#### Returns

`undefined` \| [`NodeData`](../../../types/interfaces/NodeData.md)
