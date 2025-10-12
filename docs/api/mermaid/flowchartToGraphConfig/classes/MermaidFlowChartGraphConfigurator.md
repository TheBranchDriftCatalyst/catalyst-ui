[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [mermaid/flowchartToGraphConfig](../README.md) / MermaidFlowChartGraphConfigurator

# Class: MermaidFlowChartGraphConfigurator

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:325](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L325)

Mermaid Flowchart to ForceGraph Configurator

Main class for converting Mermaid flowcharts to ForceGraph structures.
Handles parsing, type generation, and data transformation.

**Workflow:**

1. Parse Mermaid text → ParsedMermaid
2. Auto-detect node/edge types from parsed data
3. Generate GraphConfig (node/edge type definitions)
4. Generate GraphData (actual nodes/edges)

## Examples

```typescript
const mermaid = `
  flowchart TB
    subgraph "Frontend"
      ui[UI Layer] --> state[State]
    end
    subgraph "Backend"
      api[API] --> db[(Database)]
    end
    state -.->|REST| api
`;

const configurator = new MermaidFlowChartGraphConfigurator(mermaid, {
  colorStrategy: 'subgraph',
  title: 'System Architecture'
});

const config = configurator.generateConfig();
// config.nodeTypes = { frontend_process: {...}, backend_storage: {...}, ... }
// config.edgeTypes = { flow: {...}, data: {...} }

const data = configurator.generateData();
// data.nodes = { ui: {...}, state: {...}, api: {...}, db: {...} }
// data.edges = [{ src: 'ui', dst: 'state', ... }, ...]

// Use with ForceGraph
<ForceGraph config={config} data={data} />
```

```typescript
const configurator = new MermaidFlowChartGraphConfigurator(mermaid);
const parsed = configurator.getParsedData();

console.log(parsed.direction); // 'TB'
console.log(parsed.subgraphs); // [{ id: 'frontend', ... }, { id: 'backend', ... }]
```

## Constructors

### Constructor

> **new MermaidFlowChartGraphConfigurator**(`mermaidText`, `options`): `MermaidFlowChartGraphConfigurator`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:357](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L357)

Create a new Mermaid flowchart configurator

Parses the Mermaid text and initializes options with defaults.

#### Parameters

##### mermaidText

`string`

Raw Mermaid flowchart syntax

##### options

[`ConfiguratorOptions`](../interfaces/ConfiguratorOptions.md) = `{}`

Configuration options (optional)

#### Returns

`MermaidFlowChartGraphConfigurator`

#### Example

```typescript
const configurator = new MermaidFlowChartGraphConfigurator(
  `
  flowchart TB
    A --> B
`,
  {
    colorStrategy: "shape",
    title: "My Flowchart",
  }
);
```

## Methods

### generateConfig()

> **generateConfig**(): [`GraphConfig`](../../../ForceGraph/config/types/interfaces/GraphConfig.md)\<`string`, `string`\>

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:398](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L398)

Generate complete GraphConfig

Creates ForceGraph-compatible node and edge type definitions
based on the parsed Mermaid flowchart.

#### Returns

[`GraphConfig`](../../../ForceGraph/config/types/interfaces/GraphConfig.md)\<`string`, `string`\>

GraphConfig with node types, edge types, and title

#### Example

```typescript
const config = configurator.generateConfig();
// {
//   nodeTypes: {
//     'process': { label: 'Process', color: 'var(--neon-cyan)', icon: '▭' },
//     'decision': { label: 'Decision', color: 'var(--neon-purple)', icon: '◆' },
//     'storage': { label: 'Storage', color: 'var(--neon-yellow)', icon: '🗄️' }
//   },
//   edgeTypes: {
//     'flow': { label: 'Flow', color: 'var(--primary)' },
//     'data': { label: 'Data', color: 'var(--secondary)' }
//   },
//   title: 'MERMAID FLOWCHART'
// }
```

---

### generateData()

> **generateData**(): [`GraphData`](../../../ForceGraph/types/interfaces/GraphData.md)

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:442](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L442)

Generate GraphData from parsed Mermaid

Transforms parsed nodes and edges into ForceGraph-compatible
NodeData and EdgeData structures.

**Node Kind Assignment:**

- Based on `colorStrategy` option
- Nodes in subgraphs have `attributes.subgraph` and `attributes.group` set

**Edge Kind Assignment:**

- Based on Mermaid arrow type (solid, dotted, thick, etc.)
- Labels preserved in `attributes.label`
- Bidirectional flag preserved in `attributes.bidirectional`

#### Returns

[`GraphData`](../../../ForceGraph/types/interfaces/GraphData.md)

GraphData with nodes and edges ready for ForceGraph

#### Example

```typescript
const data = configurator.generateData();
// {
//   nodes: {
//     'A': { id: 'A', kind: 'process', name: 'Start', attributes: { shape: 'rectangle' } },
//     'B': { id: 'B', kind: 'decision', name: 'Check?', attributes: { shape: 'diamond' } },
//     'C': { id: 'C', kind: 'storage', name: 'DB', attributes: { shape: 'database', subgraph: 'backend' } }
//   },
//   edges: [
//     { src: 'A', dst: 'B', kind: 'flow', attributes: { bidirectional: false }, source: {...}, target: {...} },
//     { src: 'B', dst: 'C', kind: 'data', attributes: { label: 'Query', bidirectional: false }, source: {...}, target: {...} }
//   ]
// }
```

---

### getParsedData()

> **getParsedData**(): [`ParsedMermaid`](../../types/interfaces/ParsedMermaid.md)

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartToGraphConfig.ts:500](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartToGraphConfig.ts#L500)

Get parsed Mermaid data

Returns the raw parsed Mermaid structure before transformation
to GraphData. Useful for inspecting parse results or debugging.

#### Returns

[`ParsedMermaid`](../../types/interfaces/ParsedMermaid.md)

ParsedMermaid structure with nodes, edges, subgraphs, etc.

#### Example

```typescript
const parsed = configurator.getParsedData();
console.log(parsed.direction); // 'TB' | 'LR' | etc.
console.log(parsed.subgraphs); // [{ id: 'frontend', title: 'Frontend', ... }]
console.log(parsed.classes); // [{ name: 'critical', fill: '#ff0000', ... }]
```
