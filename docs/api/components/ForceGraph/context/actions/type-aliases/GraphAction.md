[**Catalyst UI API Documentation v1.4.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [components/ForceGraph/context/actions](../README.md) / GraphAction

# Type Alias: GraphAction

> **GraphAction** = \{ `type`: `"SET_RAW_DATA"`; `payload`: [`GraphData`](../../../../../ForceGraph/types/interfaces/GraphData.md); \} \| \{ `type`: `"SET_FILTERED_DATA"`; `payload`: [`GraphData`](../../../../../ForceGraph/types/interfaces/GraphData.md); \} \| \{ `type`: `"UPDATE_FILTERS"`; `payload`: `Partial`\<[`GraphFilters`](../../../../../ForceGraph/types/filterTypes/interfaces/GraphFilters.md)\>; \} \| \{ `type`: `"SET_HOVERED_NODE"`; `payload`: `string` \| `null`; \} \| \{ `type`: `"SET_SELECTED_NODE"`; `payload`: `string` \| `null`; \} \| \{ `type`: `"SET_DIMENSIONS"`; `payload`: \{ `width`: `number`; `height`: `number`; \}; \} \| \{ `type`: `"TOGGLE_NODE_VISIBILITY"`; `payload`: [`NodeKind`](../../../../../ForceGraph/types/type-aliases/NodeKind.md); \} \| \{ `type`: `"TOGGLE_EDGE_VISIBILITY"`; `payload`: [`EdgeKind`](../../../../../ForceGraph/types/type-aliases/EdgeKind.md); \} \| \{ `type`: `"RESET_FILTERS"`; \} \| \{ `type`: `"SET_LAYOUT"`; `payload`: [`LayoutKind`](../../../../../ForceGraph/utils/layouts/type-aliases/LayoutKind.md); \} \| \{ `type`: `"SET_LAYOUT_OPTIONS"`; `payload`: `Record`\<`string`, `any`\>; \} \| \{ `type`: `"TOGGLE_ORTHOGONAL_EDGES"`; \}

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/context/actions.ts:8](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/context/actions.ts#L8)

GraphAction - All possible actions for graph state management
