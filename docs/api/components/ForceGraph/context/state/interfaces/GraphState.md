[**Catalyst UI API Documentation v1.3.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [components/ForceGraph/context/state](../README.md) / GraphState

# Interface: GraphState

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/context/state.ts:9](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/context/state.ts#L9)

GraphState - Core state shape for the ForceGraph component

## Properties

### config

> **config**: [`GraphConfig`](../../../config/types/interfaces/GraphConfig.md)\<`any`, `any`\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/context/state.ts:10](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/context/state.ts#L10)

---

### rawData

> **rawData**: `null` \| [`GraphData`](../../../types/interfaces/GraphData.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/context/state.ts:11](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/context/state.ts#L11)

---

### filteredData

> **filteredData**: `null` \| [`GraphData`](../../../types/interfaces/GraphData.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/context/state.ts:12](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/context/state.ts#L12)

---

### filters

> **filters**: [`GraphFilters`](../../../types/filterTypes/interfaces/GraphFilters.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/context/state.ts:13](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/context/state.ts#L13)

---

### hoveredNode

> **hoveredNode**: `null` \| `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/context/state.ts:14](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/context/state.ts#L14)

---

### selectedNode

> **selectedNode**: `null` \| `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/context/state.ts:15](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/context/state.ts#L15)

---

### dimensions

> **dimensions**: `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/context/state.ts:16](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/context/state.ts#L16)

#### width

> **width**: `number`

#### height

> **height**: `number`

---

### layout

> **layout**: [`LayoutKind`](../../../utils/layouts/type-aliases/LayoutKind.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/context/state.ts:17](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/context/state.ts#L17)

---

### layoutOptions

> **layoutOptions**: `Record`\<`string`, `any`\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/context/state.ts:18](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/context/state.ts#L18)

---

### orthogonalEdges

> **orthogonalEdges**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/context/state.ts:19](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/context/state.ts#L19)
