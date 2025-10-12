[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [mermaid/flowchartToGraphConfig](../README.md) / ConfiguratorOptions

# Interface: ConfiguratorOptions

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:89](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L89)

Configuration options for MermaidFlowChartGraphConfigurator

Controls how Mermaid flowcharts are converted to ForceGraph structures.

## Properties

### autoDetectNodeTypes?

> `optional` **autoDetectNodeTypes**: `boolean`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:98](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L98)

Auto-detect node types from Mermaid shapes

When true, creates a unique node type for each distinct shape
encountered in the flowchart.

#### Default Value

```ts
true;
```

---

### autoDetectEdgeTypes?

> `optional` **autoDetectEdgeTypes**: `boolean`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:108](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L108)

Auto-detect edge types from Mermaid arrow styles

When true, creates a unique edge type for each distinct arrow
style (solid, dotted, thick, etc.).

#### Default Value

```ts
true;
```

---

### colorStrategy?

> `optional` **colorStrategy**: [`ColorStrategy`](../type-aliases/ColorStrategy.md)

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:116](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L116)

Color assignment strategy

#### See

ColorStrategy

#### Default Value

```ts
"auto";
```

---

### neonPalette?

> `optional` **neonPalette**: `string`[]

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:126](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L126)

Custom neon color palette for node coloring

Nodes are assigned colors from this palette in round-robin fashion.
Defaults to CSS variables for neon colors.

#### Default Value

```ts
["var(--neon-cyan)", "var(--neon-purple)", ...]
```

---

### nodeTypeOverrides?

> `optional` **nodeTypeOverrides**: `Record`\<`string`, `Partial`\<[`NodeTypeConfig`](../../../ForceGraph/config/types/interfaces/NodeTypeConfig.md)\>\>

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:143](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L143)

Node type configuration overrides

Override auto-generated node type configs by kind.

#### Example

```typescript
{
  nodeTypeOverrides: {
    'decision': { color: '#ff0000', icon: '?' },
    'database': { color: '#00ff00', icon: 'DB' }
  }
}
```

---

### edgeTypeOverrides?

> `optional` **edgeTypeOverrides**: `Record`\<`string`, `Partial`\<[`EdgeTypeConfig`](../../../ForceGraph/config/types/interfaces/EdgeTypeConfig.md)\>\>

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:160](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L160)

Edge type configuration overrides

Override auto-generated edge type configs by kind.

#### Example

```typescript
{
  edgeTypeOverrides: {
    'data': { color: '#00ffff', strokeWidth: 2 },
    'primary': { color: '#ff00ff', strokeWidth: 3 }
  }
}
```

---

### title?

> `optional` **title**: `string`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:167](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L167)

Graph title

#### Default Value

```ts
"MERMAID FLOWCHART";
```

---

### enableSubgraphGrouping?

> `optional` **enableSubgraphGrouping**: `boolean`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:177](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L177)

Enable visual subgraph grouping/fencing

When true, nodes in subgraphs are visually grouped
(exact implementation depends on ForceGraph rendering).

#### Default Value

```ts
true;
```

---

### subgraphBorderColor?

> `optional` **subgraphBorderColor**: `string`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:184](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L184)

Subgraph border color

#### Default Value

```ts
"var(--primary)";
```
