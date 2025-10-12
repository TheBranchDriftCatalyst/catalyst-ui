[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [mermaid/types](../README.md) / ParsedNode

# Interface: ParsedNode

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/types.ts:164](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/types.ts#L164)

Parsed node from Mermaid flowchart

Represents a single node/vertex in the graph after parsing.

## Examples

```typescript
const node: ParsedNode = {
  id: "process1",
  label: "Process Data",
  shape: "rectangle",
};
```

```typescript
const node: ParsedNode = {
  id: "db1",
  label: "Database",
  shape: "database",
  subgraph: "backend",
  classes: ["critical", "storage"],
};
```

## Properties

### id

> **id**: `string`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/types.ts:165](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/types.ts#L165)

Unique node identifier

---

### label

> **label**: `string`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/types.ts:166](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/types.ts#L166)

Display text for the node

---

### shape

> **shape**: [`NodeShape`](../type-aliases/NodeShape.md)

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/types.ts:167](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/types.ts#L167)

Visual shape (rectangle, circle, diamond, etc.)

---

### subgraph?

> `optional` **subgraph**: `string`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/types.ts:168](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/types.ts#L168)

Optional parent subgraph ID (for grouping)

---

### classes?

> `optional` **classes**: `string`[]

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/types.ts:169](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/types.ts#L169)

CSS classes applied via `class` directive

---

### style?

> `optional` **style**: `string`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/types.ts:170](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/types.ts#L170)

Inline CSS styles (for custom styling)
