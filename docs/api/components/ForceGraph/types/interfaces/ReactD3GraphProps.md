[**Catalyst UI API Documentation v1.3.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/ForceGraph/types](../README.md) / ReactD3GraphProps

# Interface: ReactD3GraphProps

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:86](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L86)

Props for ReactD3Graph

## Extends

- [`VisibilityState`](VisibilityState.md).[`GraphEventHandlers`](GraphEventHandlers.md)

## Properties

### visibleNodes

> **visibleNodes**: `Record`\<[`NodeKind`](../type-aliases/NodeKind.md), `boolean`\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:73](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L73)

#### Inherited from

[`VisibilityState`](VisibilityState.md).[`visibleNodes`](VisibilityState.md#visiblenodes)

---

### visibleEdges

> **visibleEdges**: `Record`\<[`EdgeKind`](../type-aliases/EdgeKind.md), `boolean`\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:74](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L74)

#### Inherited from

[`VisibilityState`](VisibilityState.md).[`visibleEdges`](VisibilityState.md#visibleedges)

---

### setHoveredNode()

> **setHoveredNode**: (`id`) => `void`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:79](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L79)

#### Parameters

##### id

`null` | `string`

#### Returns

`void`

#### Inherited from

[`GraphEventHandlers`](GraphEventHandlers.md).[`setHoveredNode`](GraphEventHandlers.md#sethoverednode)

---

### setSelectedNode

> **setSelectedNode**: `Dispatch`\<`SetStateAction`\<`null` \| `string`\>\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:80](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L80)

#### Inherited from

[`GraphEventHandlers`](GraphEventHandlers.md).[`setSelectedNode`](GraphEventHandlers.md#setselectednode)

---

### hoveredNode

> **hoveredNode**: `null` \| `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:81](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L81)

#### Inherited from

[`GraphEventHandlers`](GraphEventHandlers.md).[`hoveredNode`](GraphEventHandlers.md#hoverednode)

---

### selectedNode

> **selectedNode**: `null` \| `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:82](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L82)

#### Inherited from

[`GraphEventHandlers`](GraphEventHandlers.md).[`selectedNode`](GraphEventHandlers.md#selectednode)

---

### data

> **data**: [`GraphData`](GraphData.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:87](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L87)

---

### dimensions

> **dimensions**: [`GraphDimensions`](GraphDimensions.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:88](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L88)

---

### config?

> `optional` **config**: `any`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:89](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L89)

---

### storageKey?

> `optional` **storageKey**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:90](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L90)
