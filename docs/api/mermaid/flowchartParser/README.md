[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / mermaid/flowchartParser

# mermaid/flowchartParser

Mermaid Flowchart Parser

This module parses Mermaid flowchart syntax into structured data (ParsedMermaid).
It supports the full Mermaid flowchart syntax including:

- Multiple node shapes (rectangle, circle, diamond, database, etc.)
- Multiple edge types (solid, dotted, thick, bidirectional, etc.)
- Subgraphs with custom directions
- Class definitions and applications
- Edge labels

## Examples

```typescript
import { parseFlowchart } from "@/catalyst-ui/utils/mermaid/flowchartParser";

const mermaid = `
  flowchart TB
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
    C --> D
`;

const parsed = parseFlowchart(mermaid);
console.log(parsed.nodes.length); // 4
console.log(parsed.edges.length); // 4
```

```typescript
const mermaid = `
  flowchart LR
    subgraph "Frontend"
      ui[UI Layer]
      state[State Management]
    end
    subgraph "Backend"
      api[API]
      db[(Database)]
    end
    ui --> api
    api --> db
`;

const parsed = parseFlowchart(mermaid);
console.log(parsed.subgraphs.length); // 2
```

```typescript
const mermaid = `
  flowchart TB
    classDef critical fill:#ff6b6b,stroke:#c92a2a
    classDef success fill:#51cf66,stroke:#2f9e44

    A[Normal Node]
    B[Critical Node]
    C[Success Node]

    class B critical
    class C success
`;

const parsed = parseFlowchart(mermaid);
console.log(parsed.classes.length); // 2
console.log(parsed.nodes[1].classes); // ['critical']
```

## Functions

- [parseFlowchart](functions/parseFlowchart.md)
