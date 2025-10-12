[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / ForceGraph/config/types

# ForceGraph/config/types

Configuration types for customizing ForceGraph behavior and appearance.

This module defines the configuration system that allows you to customize
node rendering, edge styling, filtering behavior, and layout options.
All configuration is type-safe and can be domain-specific (e.g., Docker, Kubernetes).

## Example

```typescript
import { GraphConfig, NodeTypeConfig, EdgeTypeConfig } from "./types";

// Define node types
const nodeTypes: Record<string, NodeTypeConfig> = {
  server: { label: "Servers", color: "#ff0000", icon: "🖥️" },
  database: { label: "Databases", color: "#00ff00", icon: "💾" },
};

// Define edge types
const edgeTypes: Record<string, EdgeTypeConfig> = {
  connects_to: { label: "Connects To", color: "#0000ff" },
};

// Create config
const config: GraphConfig = {
  nodeTypes,
  edgeTypes,
  title: "Infrastructure Graph",
};
```

## Interfaces

- [NodeRendererProps](interfaces/NodeRendererProps.md)
- [NodeTypeConfig](interfaces/NodeTypeConfig.md)
- [EdgeTypeConfig](interfaces/EdgeTypeConfig.md)
- [AttributeFilter](interfaces/AttributeFilter.md)
- [FilterOption](interfaces/FilterOption.md)
- [QuickFilter](interfaces/QuickFilter.md)
- [GraphConfig](interfaces/GraphConfig.md)

## Type Aliases

- [NodeRenderer](type-aliases/NodeRenderer.md)
- [AttributeFilterPredicate](type-aliases/AttributeFilterPredicate.md)
- [ExtractNodeKind](type-aliases/ExtractNodeKind.md)
- [ExtractEdgeKind](type-aliases/ExtractEdgeKind.md)
