[**Catalyst UI API Documentation v1.3.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [utils/mermaid/flowchartToGraphConfig](../README.md) / ConfiguratorOptions

# Interface: ConfiguratorOptions

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:23](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L23)

Configurator options

## Properties

### autoDetectNodeTypes?

> `optional` **autoDetectNodeTypes**: `boolean`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:25](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L25)

Auto-detect node types from shapes

---

### autoDetectEdgeTypes?

> `optional` **autoDetectEdgeTypes**: `boolean`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:28](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L28)

Auto-detect edge types from arrow styles

---

### colorStrategy?

> `optional` **colorStrategy**: [`ColorStrategy`](../type-aliases/ColorStrategy.md)

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:31](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L31)

Color assignment strategy

---

### neonPalette?

> `optional` **neonPalette**: `string`[]

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:34](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L34)

Custom neon color palette

---

### nodeTypeOverrides?

> `optional` **nodeTypeOverrides**: `Record`\<`string`, `Partial`\<[`NodeTypeConfig`](../../../../components/ForceGraph/config/types/interfaces/NodeTypeConfig.md)\>\>

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:37](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L37)

Node type overrides

---

### edgeTypeOverrides?

> `optional` **edgeTypeOverrides**: `Record`\<`string`, `Partial`\<[`EdgeTypeConfig`](../../../../components/ForceGraph/config/types/interfaces/EdgeTypeConfig.md)\>\>

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:40](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L40)

Edge type overrides

---

### title?

> `optional` **title**: `string`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:43](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L43)

Graph title

---

### enableSubgraphGrouping?

> `optional` **enableSubgraphGrouping**: `boolean`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:46](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L46)

Enable visual subgraph grouping/fencing

---

### subgraphBorderColor?

> `optional` **subgraphBorderColor**: `string`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:49](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L49)

Subgraph border color
