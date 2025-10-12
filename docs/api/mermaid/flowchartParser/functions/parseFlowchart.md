[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [mermaid/flowchartParser](../README.md) / parseFlowchart

# Function: parseFlowchart()

> **parseFlowchart**(`mermaidText`): [`ParsedMermaid`](../../types/interfaces/ParsedMermaid.md)

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/flowchartParser.ts:140](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/flowchartParser.ts#L140)

Parse a Mermaid flowchart into structured data

Main entry point for parsing Mermaid flowchart text into a ParsedMermaid structure.
Handles all aspects of Mermaid flowchart syntax including nodes, edges, subgraphs, and styling.

**Supported Syntax:**

- Node shapes: `[rect]`, `(round)`, `{diamond}`, `[(db)]`, `((circle))`, etc.
- Edge types: `-->`, `---`, `-.->`, `==>`, `~~~`, `<-->`
- Edge labels: `A -->|label| B` or `A --> "label" B`
- Subgraphs: `subgraph "title" ... end`
- Direction: `flowchart TB/LR/BT/RL`
- Classes: `classDef name fill:#color` + `class nodeId className`
- Comments: `%% comment` (ignored)

## Parameters

### mermaidText

`string`

Raw Mermaid flowchart syntax as a string

## Returns

[`ParsedMermaid`](../../types/interfaces/ParsedMermaid.md)

Parsed Mermaid structure with nodes, edges, subgraphs, and classes

## Examples

```typescript
const result = parseFlowchart(`
  flowchart TB
    A[Start] --> B[Process]
    B --> C[End]
`);

// result.nodes = [
//   { id: 'A', label: 'Start', shape: 'rectangle' },
//   { id: 'B', label: 'Process', shape: 'rectangle' },
//   { id: 'C', label: 'End', shape: 'rectangle' }
// ]
// result.edges = [
//   { src: 'A', dst: 'B', type: 'solid', bidirectional: false },
//   { src: 'B', dst: 'C', type: 'solid', bidirectional: false }
// ]
```

```typescript
const result = parseFlowchart(`
  flowchart LR
    subgraph "User Interface"
      ui[UI] --> router[Router]
    end
    subgraph "Backend"
      api[API] --> db[(Database)]
    end
    router -.->|REST| api
`);

// result.subgraphs = [
//   { id: 'user_interface', title: 'User Interface', nodeIds: ['ui', 'router'] },
//   { id: 'backend', title: 'Backend', nodeIds: ['api', 'db'] }
// ]
// result.edges includes dotted edge with label 'REST'
```
