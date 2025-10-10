[**Catalyst UI API Documentation v1.3.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/MermaidForceGraph/MermaidFlowChartGraph](../README.md) / MermaidFlowChartGraph

# Variable: MermaidFlowChartGraph

> `const` **MermaidFlowChartGraph**: `React.FC`\<[`MermaidFlowChartGraphProps`](../interfaces/MermaidFlowChartGraphProps.md)\>

Defined in: [workspace/catalyst-ui/lib/components/MermaidForceGraph/MermaidFlowChartGraph.tsx:73](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/MermaidForceGraph/MermaidFlowChartGraph.tsx#L73)

MermaidFlowChartGraph

Renders a Mermaid flowchart as an interactive force-directed graph.
Supports loading from file or raw text input.

## Example

```tsx
// Load from file
<MermaidFlowChartGraph
  filename="/mermaid/solar-system.mmd"
  configuratorOptions={{
    title: "Solar Power System",
    colorStrategy: 'subgraph'
  }}
/>

// Use raw text
<MermaidFlowChartGraph
  mermaidText={`
    flowchart TB
      A[Start] --> B{Decision}
      B -->|Yes| C[End]
  `}
/>
```
