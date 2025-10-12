[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/MermaidForceGraph/MermaidFlowChartGraph](../README.md) / MermaidFlowChartGraphProps

# Interface: MermaidFlowChartGraphProps

Defined in: [workspace/catalyst-ui/lib/components/MermaidForceGraph/MermaidFlowChartGraph.tsx:17](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/MermaidForceGraph/MermaidFlowChartGraph.tsx#L17)

Props for the MermaidFlowChartGraph component
MermaidFlowChartGraphProps

## Properties

### filename?

> `optional` **filename**: `string`

Defined in: [workspace/catalyst-ui/lib/components/MermaidForceGraph/MermaidFlowChartGraph.tsx:19](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/MermaidForceGraph/MermaidFlowChartGraph.tsx#L19)

Path to .mmd file in public folder (e.g., "/mermaid/solar-system.mmd")

---

### mermaidText?

> `optional` **mermaidText**: `string`

Defined in: [workspace/catalyst-ui/lib/components/MermaidForceGraph/MermaidFlowChartGraph.tsx:22](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/MermaidForceGraph/MermaidFlowChartGraph.tsx#L22)

Raw Mermaid flowchart text

---

### configuratorOptions?

> `optional` **configuratorOptions**: [`ConfiguratorOptions`](../../../../mermaid/flowchartToGraphConfig/interfaces/ConfiguratorOptions.md)

Defined in: [workspace/catalyst-ui/lib/components/MermaidForceGraph/MermaidFlowChartGraph.tsx:25](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/MermaidForceGraph/MermaidFlowChartGraph.tsx#L25)

Configurator options for customization

---

### forceGraphProps?

> `optional` **forceGraphProps**: `Partial`\<`Omit`\<[`ForceGraphProps`](../../../../ForceGraph/types/interfaces/ForceGraphProps.md), `"data"` \| `"config"`\>\>

Defined in: [workspace/catalyst-ui/lib/components/MermaidForceGraph/MermaidFlowChartGraph.tsx:28](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/MermaidForceGraph/MermaidFlowChartGraph.tsx#L28)

Pass-through props to ForceGraph
