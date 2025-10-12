[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ForceGraph/types](../README.md) / ReactD3GraphProps

# Interface: ReactD3GraphProps

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:351](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L351)

Props for the ReactD3Graph rendering component.

## Remarks

This is the low-level D3 graph renderer. It combines graph data, dimensions,
visibility state, and event handlers to render the force-directed graph using D3.js.

The `config` prop allows customization of node/edge styling and behavior.
The `storageKey` enables persistent node positions across sessions.

## Example

```typescript
<ReactD3Graph
  data={graphData}
  dimensions={{ width: 1200, height: 800 }}
  visibleNodes={visibilityState.visibleNodes}
  visibleEdges={visibilityState.visibleEdges}
  hoveredNode={hoveredNode}
  selectedNode={selectedNode}
  setHoveredNode={setHoveredNode}
  setSelectedNode={setSelectedNode}
  config={DockerGraphConfig}
  storageKey="my-graph-positions"
/>
```

## Extends

- [`VisibilityState`](VisibilityState.md).[`GraphEventHandlers`](GraphEventHandlers.md)

## Properties

### visibleNodes

> **visibleNodes**: `Record`\<[`NodeKind`](../type-aliases/NodeKind.md), `boolean`\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:284](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L284)

Visibility flags for each node type

#### Inherited from

[`VisibilityState`](VisibilityState.md).[`visibleNodes`](VisibilityState.md#visiblenodes)

---

### visibleEdges

> **visibleEdges**: `Record`\<[`EdgeKind`](../type-aliases/EdgeKind.md), `boolean`\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:287](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L287)

Visibility flags for each edge type

#### Inherited from

[`VisibilityState`](VisibilityState.md).[`visibleEdges`](VisibilityState.md#visibleedges)

---

### setHoveredNode()

> **setHoveredNode**: (`id`) => `void`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:313](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L313)

Callback to update the currently hovered node ID

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

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:316](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L316)

Callback to update the currently selected node ID

#### Inherited from

[`GraphEventHandlers`](GraphEventHandlers.md).[`setSelectedNode`](GraphEventHandlers.md#setselectednode)

---

### hoveredNode

> **hoveredNode**: `null` \| `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:319](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L319)

Currently hovered node ID (null if none)

#### Inherited from

[`GraphEventHandlers`](GraphEventHandlers.md).[`hoveredNode`](GraphEventHandlers.md#hoverednode)

---

### selectedNode

> **selectedNode**: `null` \| `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:322](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L322)

Currently selected node ID (null if none)

#### Inherited from

[`GraphEventHandlers`](GraphEventHandlers.md).[`selectedNode`](GraphEventHandlers.md#selectednode)

---

### data

> **data**: [`GraphData`](GraphData.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:353](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L353)

Graph data to render

---

### dimensions

> **dimensions**: [`GraphDimensions`](GraphDimensions.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:356](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L356)

Canvas dimensions

---

### config?

> `optional` **config**: `any`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:359](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L359)

Graph configuration (styling, renderers, etc.) - using any to avoid circular import

---

### storageKey?

> `optional` **storageKey**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:362](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L362)

localStorage key for persisting node positions
