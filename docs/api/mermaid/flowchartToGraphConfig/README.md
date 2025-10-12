[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / mermaid/flowchartToGraphConfig

# mermaid/flowchartToGraphConfig

Mermaid Flowchart to ForceGraph Config Converter

This module converts parsed Mermaid flowcharts into ForceGraph-compatible
GraphConfig and GraphData structures. It provides intelligent defaults for
node/edge styling based on Mermaid syntax, with extensive customization options.

## Examples

```typescript
import { MermaidFlowChartGraphConfigurator } from '@/catalyst-ui/utils/mermaid/flowchartToGraphConfig';

const mermaid = `
  flowchart TB
    A[Start] --> B{Decision}
    B --> C[End]
`;

const configurator = new MermaidFlowChartGraphConfigurator(mermaid);
const config = configurator.generateConfig();
const data = configurator.generateData();

// Use with ForceGraph component
<ForceGraph config={config} data={data} />
```

```typescript
const configurator = new MermaidFlowChartGraphConfigurator(mermaid, {
  colorStrategy: "subgraph", // Color nodes by their subgraph
  neonPalette: ["#00ffff", "#ff00ff", "#ffff00"],
});
```

```typescript
const configurator = new MermaidFlowChartGraphConfigurator(mermaid, {
  nodeTypeOverrides: {
    decision: { color: "#ff0000", icon: "?" },
    database: { color: "#00ff00", icon: "DB" },
  },
});
```

## Classes

- [MermaidFlowChartGraphConfigurator](classes/MermaidFlowChartGraphConfigurator.md)

## Interfaces

- [ConfiguratorOptions](interfaces/ConfiguratorOptions.md)

## Type Aliases

- [ColorStrategy](type-aliases/ColorStrategy.md)
