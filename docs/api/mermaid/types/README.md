[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / mermaid/types

# mermaid/types

Mermaid Flowchart Parser Types

This module defines TypeScript types for parsing Mermaid flowchart syntax into structured data.
These types represent the intermediate representation (IR) between raw Mermaid text and ForceGraph data.

## Example

```typescript
import type { ParsedMermaid, NodeShape, EdgeType } from "@/catalyst-ui/utils/mermaid/types";

const parsed: ParsedMermaid = {
  direction: "TB",
  nodes: [
    { id: "A", label: "Start", shape: "circle" },
    { id: "B", label: "Process", shape: "rectangle" },
  ],
  edges: [{ src: "A", dst: "B", type: "solid", bidirectional: false }],
  subgraphs: [],
  classes: [],
};
```

## Interfaces

- [ParsedNode](interfaces/ParsedNode.md)
- [ParsedEdge](interfaces/ParsedEdge.md)
- [ParsedSubgraph](interfaces/ParsedSubgraph.md)
- [ParsedClass](interfaces/ParsedClass.md)
- [ParsedMermaid](interfaces/ParsedMermaid.md)

## Type Aliases

- [NodeShape](type-aliases/NodeShape.md)
- [EdgeType](type-aliases/EdgeType.md)
- [FlowDirection](type-aliases/FlowDirection.md)

## Variables

- [SHAPE_PATTERNS](variables/SHAPE_PATTERNS.md)
- [EDGE_PATTERNS](variables/EDGE_PATTERNS.md)
